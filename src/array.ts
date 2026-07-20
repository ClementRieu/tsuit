import {
  ArrayRangeError,
  DuplicateKeyError,
  EmptyArrayError,
  MultipleElementsError,
} from "./errors.js";

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
    throw new ArrayRangeError("chunk size must be >= 1");
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
    throw new EmptyArrayError("Expected exactly one element, but the array was empty");
  }
  throw new MultipleElementsError(
    `Expected exactly one element, but the array had ${items.length}`,
    items.length,
  );
}

/**
 * Returns the first element of `items`, throwing {@link EmptyArrayError} when it
 * is empty.
 */
export function first<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new EmptyArrayError("Cannot read the first element of an empty array");
  }
  return items[0]!;
}

/**
 * Returns the last element of `items`, throwing {@link EmptyArrayError} when it
 * is empty.
 */
export function last<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new EmptyArrayError("Cannot read the last element of an empty array");
  }
  return items[items.length - 1]!;
}

/**
 * Groups array items into a `Map` keyed by the value returned from `keyFn`,
 * each key mapping to the list of items that produced it, in input order. Keys
 * may be of any type — they are matched by `Map` identity (`SameValueZero`).
 *
 * @example
 * groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? "even" : "odd"));
 * // Map { "odd" => [1, 3], "even" => [2, 4] }
 */
export function groupBy<T, K>(
  items: readonly T[],
  keyFn: (item: T) => K,
): Map<K, T[]> {

  const result = new Map<K, T[]>();

  for (const item of items) {

    const key = keyFn(item);

    let bucket = result.get(key);

    if (bucket === undefined) {
      bucket = [];
      result.set(key, bucket);
    }

    bucket.push(item);
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
 * Indexes array items into a `Map` keyed by the value returned from `keyFn`,
 * mapping each key to a single item. Unlike {@link groupBy}, which keeps every
 * item sharing a key, this keeps only one; use `onDuplicate` to choose which
 * when keys collide. Keys may be of any type — they are matched by `Map`
 * identity (`SameValueZero`).
 *
 * When keys are property keys (`string | number | symbol`), pass the result to
 * {@link mapToRecord} to get a plain `Record` instead.
 *
 * @example
 * indexBy([{ id: "a" }, { id: "b" }], (item) => item.id);
 * // Map { "a" => { id: "a" }, "b" => { id: "b" } }
 */
export function indexBy<T, K>(
  items: readonly T[],
  keyFn: (item: T) => K,
  options: IndexByOptions = {},
): Map<K, T> {

  const { onDuplicate = "keep-last" } = options;

  const result = new Map<K, T>();

  for (const item of items) {

    const key = keyFn(item);

    if (onDuplicate === "keep-last") {
      // we write no matter what
      result.set(key, item);
      continue;
    }

    if (!result.has(key)) {
      // we write only new keys
      result.set(key, item);
      continue;
    }

    if (onDuplicate === "throw") {
      throw new DuplicateKeyError(`Duplicate on key '${String(key)}'`, key);
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
