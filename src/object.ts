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
    if (!exclude.has(key)) result[key] = obj[key];
  }
  return result as Omit<T, K>;
}

/**
 * Type guard: true when a value is neither `null` nor `undefined`.
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
