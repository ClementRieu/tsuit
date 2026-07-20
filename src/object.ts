/**
 * Assigns `value` to `key` on `target` as an own, enumerable data property —
 * safe even when `key` is `"__proto__"`, which a plain `target[key] = value`
 * would route through the prototype setter (dropping the entry, or corrupting
 * the prototype when the value is an object).
 *
 * Building on a normal `{}` and guarding only this one key keeps V8's fast
 * properties — far faster than an `Object.create(null)` accumulator, which
 * falls into dictionary mode. The guard is a single, well-predicted branch per
 * key, so it costs essentially nothing.
 */
function assignSafe(
  target: Record<PropertyKey, unknown>,
  key: PropertyKey,
  value: unknown,
): void {
  if (key === "__proto__") {
    Object.defineProperty(target, key, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } else {
    target[key] = value;
  }
}

/**
 * Returns a new object containing only the given keys.
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {

  const result = {} as Record<PropertyKey, unknown>;

  for (const key of keys) {
    if (Object.hasOwn(obj, key)) {
      assignSafe(result, key, obj[key]);
    }
  }

  return result as Pick<T, K>;
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
      assignSafe(result, key, obj[key]);
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
      assignSafe(result, key, obj[key]);
    }
  }

  return result as WithoutUndefined<T>;
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

  const result = {} as Record<PropertyKey, unknown>;

  for (const key of Object.keys(obj) as (keyof T)[]) {
    assignSafe(result, key, fn(obj[key], key));
  }

  return result as { [K in keyof T]: R };
}

/**
 * Converts a `Map` into a plain `Record` holding the same key/value pairs.
 * Handy for turning the `Map` returned by {@link indexBy} into an object literal.
 *
 * Keys are coerced the way object keys always are — numbers become strings — so
 * the input must be keyed by `string | number | symbol`.
 *
 * Prototype-safe: a `"__proto__"` key is stored as own data (via
 * `defineProperty`) rather than routed through the prototype setter, and the
 * result is a normal `Object.prototype` object.
 *
 * @example
 * mapToRecord(new Map([["a", 1], ["b", 2]])); // { a: 1, b: 2 }
 */
export function mapToRecord<K extends PropertyKey, V>(
  map: Map<K, V>
): Record<K, V> {

  const record = {} as Record<PropertyKey, unknown>;

  map.forEach((v, k) => {
    assignSafe(record, k, v);
  });

  return record as Record<K, V>;
}
