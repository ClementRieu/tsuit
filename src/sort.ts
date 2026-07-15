export interface SortByKeyOptions {
  /**
   * Sort direction applied to non-null keys. Items with a `null` key are placed
   * according to `nulls`, unaffected by this option. Defaults to `"asc"`.
   */
  order?: "asc" | "desc";
  /**
   * Where items with a `null` key go, regardless of `order`. They keep their
   * relative order among themselves. Defaults to `"last"`.
   */
  nulls?: "first" | "last";
}

/**
 * Builds a comparator for `Array.prototype.sort` that orders items by the key
 * returned from `keyFn`:
 * - string keys are compared alphabetically (locale-aware, via `localeCompare`);
 * - number keys are compared numerically;
 * - items whose key is `null` sort to the end by default (`nulls: "first"`
 *   moves them to the front), keeping their relative order, unaffected by the
 *   `order` option.
 *
 * @example
 * items.sort(sortByKey((item) => item.name));
 * items.sort(sortByKey((item) => item.age, { order: "desc" }));
 * items.sort(sortByKey((item) => item.score, { nulls: "first" }));
 */
export function sortByKey<T, K extends string | number>(
  keyFn: (item: T) => K | null,
  options: SortByKeyOptions = {},
): (a: T, b: T) => number {
  const direction = options.order === "desc" ? -1 : 1;
  const nullRank = options.nulls === "first" ? -1 : 1;

  return (a, b) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);

    // Null keys go first or last per `nulls`, in original order, ignoring direction.
    if (keyA === null || keyB === null) {
      if (keyA === null && keyB === null) return 0;
      return keyA === null ? nullRank : -nullRank;
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
