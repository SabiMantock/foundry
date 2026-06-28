// Foundry ESLint config — FLAT config (required by ESLint 10+).
//
// Beyond standard TS linting, this enforces the factory's CONTRACT-ONLY rule
// (docs 04 & 06): a module may only be imported through its public entry (its
// contract), never by reaching into another module's `src/` internals. That is
// what makes "reuse first" safe and keeps modules swappable.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'apps/*' },
        { type: 'module', pattern: 'packages/*' },
      ],
    },
    rules: {
      // Zero-warning policy in CI (standards doc 06 §2).
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Contract-only imports: forbid deep imports into a module's internals.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@*/*/src/*', '**/packages/*/src/*'],
              message:
                'Import a module through its public contract (package entry), not its internals.',
            },
          ],
        },
      ],

      // Boundaries: apps may use modules; modules may use modules; nothing imports an app.
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'app', allow: ['module'] },
            { from: 'module', allow: ['module'] },
          ],
        },
      ],
    },
  },
  { ignores: ['**/dist/**', '**/coverage/**', '**/.turbo/**'] },
);
