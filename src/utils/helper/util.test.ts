import { afterEach, describe, expect, it } from 'vitest';

import {
  capitalise,
  getQueryParamsFromHash,
  nullToUndefined,
  sleep,
  typedObjectKeys,
} from './util';

// ─── getQueryParamsFromHash ───────────────────────────────────────────────────

describe('getQueryParamsFromHash', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('returns an empty string when there is no hash', () => {
    expect(getQueryParamsFromHash()).toBe('');
  });

  it('returns an empty string when hash has no query string', () => {
    window.history.replaceState({}, '', '/#/home');
    expect(getQueryParamsFromHash()).toBe('');
  });

  it('returns the query string portion from the hash', () => {
    window.history.replaceState({}, '', '/#/home?tab=overview&page=1');
    expect(getQueryParamsFromHash()).toBe('tab=overview&page=1');
  });

  it('returns only the part after "?" in the hash', () => {
    window.history.replaceState({}, '', '/#/about?foo=bar');
    expect(getQueryParamsFromHash()).toBe('foo=bar');
  });
});

// ─── capitalise ──────────────────────────────────────────────────────────────

describe('capitalise', () => {
  it('capitalises the first letter', () => {
    expect(capitalise('hello')).toBe('Hello');
  });

  it('leaves an already-capitalised string unchanged', () => {
    expect(capitalise('World')).toBe('World');
  });

  it('returns an empty string unchanged', () => {
    expect(capitalise('')).toBe('');
  });

  it('handles a single character', () => {
    expect(capitalise('a')).toBe('A');
  });

  it('does not lowercase the rest of the string', () => {
    expect(capitalise('hELLO')).toBe('HELLO');
  });
});

// ─── nullToUndefined ─────────────────────────────────────────────────────────

describe('nullToUndefined', () => {
  it('converts null to undefined', () => {
    expect(nullToUndefined(null)).toBeUndefined();
  });

  it('passes non-null values through unchanged', () => {
    expect(nullToUndefined('hello')).toBe('hello');
    expect(nullToUndefined(0)).toBe(0);
    expect(nullToUndefined(false)).toBe(false);
  });

  it('passes undefined through as undefined', () => {
    expect(nullToUndefined(undefined)).toBeUndefined();
  });

  it('passes objects through unchanged', () => {
    const obj = { a: 1 };
    expect(nullToUndefined(obj)).toBe(obj);
  });
});

// ─── typedObjectKeys ─────────────────────────────────────────────────────────

describe('typedObjectKeys', () => {
  it('returns the keys of an object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(typedObjectKeys(obj)).toEqual(['a', 'b', 'c']);
  });

  it('returns an empty array for an empty object', () => {
    expect(typedObjectKeys({})).toEqual([]);
  });

  it('returns only own enumerable keys', () => {
    const obj = { x: 10, y: 20 };
    const keys = typedObjectKeys(obj);
    expect(keys).toHaveLength(2);
    expect(keys).toContain('x');
    expect(keys).toContain('y');
  });
});

// ─── sleep ───────────────────────────────────────────────────────────────────

describe('sleep', () => {
  it('resolves after the given number of milliseconds', async () => {
    const start = Date.now();
    await sleep(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(40);
  });

  it('returns a Promise', () => {
    expect(sleep(0)).toBeInstanceOf(Promise);
  });
});
