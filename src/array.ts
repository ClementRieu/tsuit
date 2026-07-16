import { DuplicateKeyError, EmptyArrayError, MultipleElementsError } from "./errors.js";

/**
 * Splits an array into chunks of the given size.
 *
 * @example
 * chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(
  items: readonly T[], size: number
): T[][] {
  
  if (size < 1) {
    throw new RangeError("chunk size must be >= 1");
  }
  
  const result: T[][] = [];
  
  for (let i = 0; i < items.length; i += size) {
    result.push(
      items.slice(i, i + size)
    );
  }
  
  return result;
}

/**
 * Returns a new array with duplicate values removed, preserving order.
 */
export function distinct<T>(items: readonly T[]): T[] {
  return [
    ...new Set(items)
  ];
}

/**
 * Returns the only element of `items`, throwing if it does not contain exactly
 * one:
 * - {@link EmptyArrayError} when `items` is empty;
 * - {@link MultipleElementsError} when `items` has more than one element.
 */
export function single<T>(items: readonly T[]): T {
  if (items.length === 1) {
    return items[0]!;
  }
  if (items.length === 0) {
    throw new EmptyArrayError();
  }
  throw new MultipleElementsError(items.length);
}

/**
 * Groups array items by the key returned from `keyFn`.
 */
export function lookupBy<T, K extends PropertyKey>(
  items: readonly T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {

  // Null-prototype object so keys like "toString" or "__proto__" behave as
  // plain data entries instead of hitting inherited members / the proto setter.
  const result = Object.create(null) as Record<K, T[]>;

  for (const item of items) {
    
    const key = keyFn(item);
    
    (result[key] ??= []).push(item);
  }

  return result;
}


export interface IndexByOptions {
  /**
   * How to handle two items resolving to the same key:
   * - `"keep-last"` (default): the last item wins.
   * - `"keep-first"`: the first item wins; later duplicates are ignored.
   * - `"throw"`: throw a {@link DuplicateKeyError} on the first duplicate.
   */
  onDuplicate?: "keep-last" | "keep-first" | "throw";
}

/**
 * Indexes array items by the key returned from `keyFn`, mapping each key to a
 * single item. Unlike `lookupBy`, which keeps every item sharing a key, this
 * keeps only one; use `onDuplicate` to choose which when keys collide.
 */
export function indexBy<T, K extends PropertyKey>(
  items: readonly T[],
  keyFn: (item: T) => K,
  options: IndexByOptions = {},
): Record<K, T> {

  const { onDuplicate = "keep-last" } = options;

  // Null-prototype object so keys like "toString" or "__proto__" behave as
  // plain data entries instead of hitting inherited members / the proto setter.
  const result = Object.create(null) as Record<K, T>;

  for (const item of items) {

    const key = keyFn(item);

    if (onDuplicate === "keep-last") {
      // we write no matter what
      result[key] = item;
      continue;
    }

    const keyExist = Object.hasOwn(result, key);

    if (!keyExist) {
      // we write only new keys
      result[key] = item;
      continue;
    }

    if (onDuplicate === "throw") {
      throw new DuplicateKeyError(key);
    }
  }

  return result;
}

export interface DistinctByOptions {
  /**
   * Which occurrence's value to keep when several items resolve to the same
   * key. Either way the item stays at the position of the key's *first*
   * occurrence — this only picks the value kept there:
   * - `"keep-first"` (default): keep the first occurrence's value.
   * - `"keep-last"`: keep the last occurrence's value.
   */
  onDuplicate?: "keep-first" | "keep-last";
}

/**
 * Returns a new array with duplicates removed based on the key returned from
 * `keyFn`. Items keep the position of their key's first occurrence, preserving
 * input order. `onDuplicate` selects which colliding item's value is kept
 * there — the first (default) or the last.
 */
export function distinctBy<T, K>(
  items: readonly T[],
  keyFn: (item: T) => K,
  options: DistinctByOptions = {},
): T[] {
  
  const { onDuplicate = "keep-first" } = options;
  
  const positionByKey = new Map<K, number>();
  
  const result: T[] = [];
  
  for (const item of items) {
    
    const key = keyFn(item);
    
    const position = positionByKey.get(key);
    
    if (position === undefined) {
      positionByKey.set(key, result.length);
      result.push(item);
      continue;
    }
    
    if (onDuplicate === "keep-last") {
      result[position] = item; // keep-last: overwrite in place, same position.
    }
  }

  return result;
}
