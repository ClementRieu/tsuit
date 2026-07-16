/**
 * Returns a new object containing only the given keys.
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  
  const result = {} as Pick<T, K>;
  
  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }
  
  return result;
}

/**
 * Returns a new object without the given keys.
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  
  const exclude = new Set<PropertyKey>(keys);
  
  const result = {} as Record<PropertyKey, unknown>;
  
  for (const key of Object.keys(obj) as (keyof T)[]) {
    
    if (!exclude.has(key)) {
      result[key] = obj[key];
    }
  }
  
  return result as Omit<T, K>;
}

/**
 * Type guard: true when a value is neither `null` nor `undefined`.
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * The result of {@link stripUndefined}: keys whose value type could be
 * `undefined` become optional (they may have been stripped) and lose `undefined`
 * from their type; all other keys are preserved as-is.
 */
export type WithoutUndefined<T> =
  & { [K in keyof T as (undefined extends T[K] ? never : K)]: T[K] }
  & { [K in keyof T as (undefined extends T[K] ? K : never)]?: Exclude<T[K], undefined> };

/**
 * Returns a new object without the keys whose value is `undefined`. Keys set to
 * `null` are kept — only `undefined` is stripped. Shallow: nested objects are
 * left untouched.
 *
 * Keys that could hold `undefined` become optional in the result, reflecting
 * that they may have been removed.
 *
 * @example
 * stripUndefined({ a: 1, b: undefined, c: null }); // { a: 1, c: null }
 */
export function stripUndefined<T extends object>(obj: T): WithoutUndefined<T> {

  const result = {} as Record<PropertyKey, unknown>;

  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }

  return result as WithoutUndefined<T>;
}
