/**
 * Public contract surface for @foundry/example-hello.
 * This file IS the module's contract in code; it must stay in sync with
 * contracts/example-hello.v1.yaml (asserted by contract.test.ts at gate G4).
 */
export { greet } from './greet.js';
export type { GreetOptions } from './greet.js';

/** Module version — kept in lockstep with the published contract version. */
export const CONTRACT_VERSION = '1.0.0' as const;
