export interface SortByKeyOptions {
  /**
   * Sort direction applied to non-null keys. Items with a `null` key always
   * sort to the end regardless of this option. Defaults to `"asc"`.
   */
  order?: "asc" | "desc";
}

/**
 * Builds a comparator for `Array.prototype.sort` that orders items by the key
 * returned from `keyFn`:
 * - string keys are compared alphabetically (locale-aware, via `localeCompare`);
 * - number keys are compared numerically;
 * - items whose key is `null` always sort to the end, keeping their relative
 *   order, unaffected by the `order` option.
 *
 * @example
 * items.sort(sortByKey((item) => item.name));
 * items.sort(sortByKey((item) => item.age, { order: "desc" }));
 */
export function sortByKey<T, K extends string | number>(
  keyFn: (item: T) => K | null,
  options: SortByKeyOptions = {},
): (a: T, b: T) => number {
  const direction = options.order === "desc" ? -1 : 1;

  return (a, b) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);

    // Null keys always sort last, in their original order, ignoring direction.
    if (keyA === null || keyB === null) {
      if (keyA === null && keyB === null) return 0;
      return keyA === null ? 1 : -1;
    }

    return direction * compareKeys(keyA, keyB);
  };
}

function compareKeys(a: string | number, b: string | number): number {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  return String(a).localeCompare(String(b));
}
