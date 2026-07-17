/**
 * Returns a new object containing only the given keys.
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {

  // Null-proto while building (safe writes even for "__proto__"); the spread on
  // return hands back a normal Object.prototype object.
  const result = Object.create(null) as Pick<T, K>;

  for (const key of keys) {
    if (Object.hasOwn(obj, key)) {
      result[key] = obj[key];
    }
  }

  return { ...result };
}

/**
 * Returns a new object without the given keys.
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {

  const exclude = new Set<PropertyKey>(keys);

  // Null-proto while building (safe writes even for "__proto__"); the spread on
  // return hands back a normal Object.prototype object.
  const result = Object.create(null) as Record<PropertyKey, unknown>;

  for (const key of Object.keys(obj) as (keyof T)[]) {

    if (!exclude.has(key)) {
      result[key] = obj[key];
    }
  }

  return { ...result } as Omit<T, K>;
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

  // Null-proto while building (safe writes even for "__proto__"); the spread on
  // return hands back a normal Object.prototype object.
  const result = Object.create(null) as Record<PropertyKey, unknown>;

  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }

  return { ...result } as WithoutUndefined<T>;
}

/**
 * Returns a new object with the same keys as `obj`, each value replaced by the
 * result of `fn`. Own enumerable keys only; the original is not mutated.
 *
 * @example
 * mapValues({ a: 1, b: 2 }, (n) => n * 10); // { a: 10, b: 20 }
 */
export function mapValues<T extends object, R>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => R,
): { [K in keyof T]: R } {

  // Null-proto while building (safe writes even for "__proto__"); the spread on
  // return hands back a normal Object.prototype object.
  const result = Object.create(null) as { [K in keyof T]: R };

  for (const key of Object.keys(obj) as (keyof T)[]) {
    result[key] = fn(obj[key], key);
  }

  return { ...result };
}
