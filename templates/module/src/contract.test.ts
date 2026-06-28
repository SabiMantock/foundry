/**
 * Contract test (gate G4). Asserts the code's public surface matches the
 * published contract (contracts/example-hello.v1.yaml). This is what lets
 * modules evolve without silently breaking consumers (doc 04 §3).
 */
import { describe, it, expect } from 'vitest';
import * as mod from './index.js';

describe('example-hello contract (G4)', () => {
  it('exposes the declared exports', () => {
    expect(typeof mod.greet).toBe('function');
    expect(mod.CONTRACT_VERSION).toBe('1.0.0');
  });

  it('greet honors its declared signature (optional arg)', () => {
    // Declared: greet(options?) -> string
    expect(typeof mod.greet()).toBe('string');
    expect(typeof mod.greet({ name: 'x', locale: 'en' })).toBe('string');
  });

  it('contract version matches package contract surface', () => {
    expect(mod.CONTRACT_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
