#!/usr/bin/env node
// Architecture fitness-function check (gate-architecture). See
// skills/gate-architecture/SKILL.md and templates/reference-designs/ for the rules this
// enforces.
//
// Cheap, mechanical, CI-run on every PR. Fails loud with enough detail that a worker or
// architect can fix it immediately — this is what keeps "ship faster" from becoming
// "drift silently."

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { load as loadYamlDoc } from 'js-yaml'; // js-yaml 5.x is pure ESM, named exports only

const ROOT = process.cwd();
const PACKAGES_DIR = join(ROOT, 'packages');
const CONTRACTS_DIR = join(ROOT, 'contracts');
const REGISTRY_DIR = join(ROOT, 'registry', 'index');

const failures = [];
const fail = (msg) => failures.push(msg);

function listDirs(path) {
  if (!existsSync(path)) return [];
  return readdirSync(path).filter((f) => statSync(join(path, f)).isDirectory());
}
function listFiles(path, ext) {
  if (!existsSync(path)) return [];
  return readdirSync(path).filter((f) => f.endsWith(ext));
}
function loadYaml(path) {
  return loadYamlDoc(readFileSync(path, 'utf8'));
}
function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

if (!existsSync(PACKAGES_DIR)) {
  console.log('architecture:check — no packages/ yet, nothing to verify.');
  process.exit(0);
}

// --- 1. Contract coverage: every package has exactly one contract ---
const packages = listDirs(PACKAGES_DIR);
const contractFiles = listFiles(CONTRACTS_DIR, '.yaml');
const contracts = contractFiles.map((f) => ({ file: f, ...loadYaml(join(CONTRACTS_DIR, f)) }));
const contractsByModule = new Map(contracts.map((c) => [c.module, c]));

for (const pkg of packages) {
  if (!contractsByModule.has(pkg)) {
    fail(
      `packages/${pkg} has no matching contracts/${pkg}.vN.yaml — every module needs exactly one contract.`,
    );
  }
}
for (const contract of contracts) {
  if (!packages.includes(contract.module)) {
    fail(
      `contracts/${contract.file} declares module "${contract.module}" but packages/${contract.module} does not exist — stale contract.`,
    );
  }
}

// --- 2. Registry freshness: every package has a registry entry, and vice versa ---
const registryFiles = listFiles(REGISTRY_DIR, '.yaml');
const registryEntries = registryFiles.map((f) => ({ file: f, ...loadYaml(join(REGISTRY_DIR, f)) }));
const registryByName = new Map(registryEntries.map((r) => [r.name, r]));

for (const pkg of packages) {
  if (!registryByName.has(pkg)) {
    fail(
      `packages/${pkg} has no registry/index/${pkg}.yaml entry — orphaned module, invisible to reuse-search.`,
    );
  }
}
for (const entry of registryEntries) {
  if (!packages.includes(entry.name)) {
    fail(
      `registry/index/${entry.file} catalogs "${entry.name}" but packages/${entry.name} does not exist — phantom catalog entry, retire it.`,
    );
  }
}

// --- 3. Contract fidelity: public exports match `provides:` (best-effort source scan) ---
for (const pkg of packages) {
  const indexPath = join(PACKAGES_DIR, pkg, 'src', 'index.ts');
  const contract = contractsByModule.get(pkg);
  if (!contract || !existsSync(indexPath)) continue;
  const src = readFileSync(indexPath, 'utf8');
  const declaredNames = (contract.provides || [])
    .map((p) => p.export || (p.signature || '').split('(')[0])
    .filter(Boolean)
    .map((s) => s.trim());
  for (const name of declaredNames) {
    const exported =
      new RegExp(`export\\s+(const|function|class|interface|type)\\s+${name}\\b`).test(src) ||
      new RegExp(`export\\s*\\{[^}]*\\b${name}\\b[^}]*\\}`).test(src);
    if (!exported) {
      fail(
        `packages/${pkg}/src/index.ts does not export "${name}", but contracts/${pkg} declares it — contract drift.`,
      );
    }
  }
}

// --- 4. Dependency graph: depends_on must form a DAG (no module cycles) ---
const graph = new Map(contracts.map((c) => [c.module, c.depends_on || []]));
function findCycle() {
  const visiting = new Set();
  const visited = new Set();
  const stack = [];
  function visit(node) {
    if (visited.has(node)) return null;
    if (visiting.has(node)) return [...stack, node];
    visiting.add(node);
    stack.push(node);
    for (const dep of graph.get(node) || []) {
      const cycle = visit(dep);
      if (cycle) return cycle;
    }
    stack.pop();
    visiting.delete(node);
    visited.add(node);
    return null;
  }
  for (const node of graph.keys()) {
    const cycle = visit(node);
    if (cycle) return cycle;
  }
  return null;
}
const cycle = findCycle();
if (cycle) {
  fail(`Dependency cycle across module contracts: ${cycle.join(' -> ')} — modules must form a DAG.`);
}

// --- 5. Layering (best-effort text scan): domain/ never imports application/ or infrastructure/ ---
for (const pkg of packages) {
  const domainDir = join(PACKAGES_DIR, pkg, 'src', 'domain');
  if (!existsSync(domainDir)) continue;
  for (const file of walk(domainDir)) {
    if (!file.endsWith('.ts')) continue;
    const src = readFileSync(file, 'utf8');
    if (/from ['"].*\/(application|infrastructure)\//.test(src)) {
      fail(
        `${file.replace(ROOT + '/', '')} (domain layer) imports application/infrastructure — domain must stay pure. See templates/reference-designs/README.md.`,
      );
    }
  }
}

// --- Report ---
if (failures.length) {
  console.error(`gate-architecture: ${failures.length} violation(s)\n`);
  for (const f of failures) console.error(`  x ${f}`);
  console.error('\nSee skills/gate-architecture/SKILL.md and templates/reference-designs/ for the rules.');
  process.exit(1);
} else {
  console.log(
    `gate-architecture: clean (${packages.length} module(s), ${contracts.length} contract(s) checked).`,
  );
}
