/**
 * General utility / helper functions.
 * Add your own project-specific utilities here.
 */

/**
 * Returns the URL query string from the hash portion of the current URL.
 *
 * Example:
 *   URL: http://localhost:9001/#/home?tab=overview
 *   Returns: 'tab=overview'
 */
export const getQueryParamsFromHash = (): string => {
  const hash = window.location.hash;
  const queryIndex = hash.indexOf('?');
  return queryIndex !== -1 ? hash.slice(queryIndex + 1) : '';
};

/**
 * Capitalises the first letter of a string.
 */
export const capitalise = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Returns `undefined` instead of `null` to satisfy strict null checks.
 * Useful when mapping over API responses that may return `null`.
 */
export const nullToUndefined = <T>(value: T | null): T | undefined => value ?? undefined;

/**
 * Type-safe object keys helper (Object.keys with typed return).
 */
export const typedObjectKeys = <T extends object>(obj: T): Array<keyof T> =>
  Object.keys(obj) as Array<keyof T>;

/**
 * Delays execution for `ms` milliseconds. Useful in tests and demos.
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
