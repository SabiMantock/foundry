import { describe, it, expect } from 'vitest';
import { greet } from './index.js';

describe('greet (unit)', () => {
  it('defaults to greeting the world in English', () => {
    expect(greet()).toBe('Hello, world!');
  });

  it('greets a named person', () => {
    expect(greet({ name: 'Sabi' })).toBe('Hello, Sabi!');
  });

  it('honors locale (proves the localization seam)', () => {
    expect(greet({ name: 'Sabi', locale: 'es' })).toBe('Hola, Sabi!');
  });

  it('treats blank names as the default', () => {
    expect(greet({ name: '   ' })).toBe('Hello, world!');
  });
});
