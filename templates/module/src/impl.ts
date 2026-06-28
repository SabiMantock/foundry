/**
 * Internal implementation. Consumers must NOT import this file directly —
 * they import the public contract via the package entry (`src/index.ts`).
 * The contract-only lint rule enforces this.
 */

export interface GreetOptions {
  /** Name to greet. Defaults to "world". */
  name?: string;
  /** Locale for the greeting. Defaults to "en". */
  locale?: 'en' | 'es';
}

const GREETINGS: Record<NonNullable<GreetOptions['locale']>, string> = {
  en: 'Hello',
  es: 'Hola', // a second locale — proves the localization seam exists from day one
};

/** Produce a localized greeting. Pure, deterministic, no I/O. */
export function greet(options: GreetOptions = {}): string {
  const name = (options.name ?? 'world').trim() || 'world';
  const locale = options.locale ?? 'en';
  return `${GREETINGS[locale]}, ${name}!`;
}
