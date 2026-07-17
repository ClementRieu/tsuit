export interface CompareByOptions {
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
  /**
   * BCP 47 locale used to compare string keys (via {@link Intl.Collator}), so
   * the order is deterministic instead of depending on the runtime's default
   * locale. Defaults to `"en"`. Collators are cached per locale; keep the set
   * of locales small — if the locale is itself a business variable, build your
   * own comparator rather than churning this cache.
   */
  locale?: string;
}

// Collators are relatively expensive to build, so reuse one per locale. The
// default "en" lands here on first use like any other locale.
const collatorCache = new Map<string, Intl.Collator>();

function getCollator(locale: string): Intl.Collator {

  let collator = collatorCache.get(locale);

  if (collator === undefined) {
    collator = new Intl.Collator(locale, { sensitivity: "variant" });
    collatorCache.set(locale, collator);
  }

  return collator;
}

/**
 * Builds a comparator for `Array.prototype.sort` that orders items by the key
 * returned from `keyFn`:
 * - string keys are compared alphabetically (locale-aware, via `Intl.Collator`,
 *   defaulting to the `"en"` locale — see `options.locale`);
 * - number keys are compared numerically;
 * - items whose key is `null` sort to the end by default (`nulls: "first"`
 *   moves them to the front), keeping their relative order, unaffected by the
 *   `order` option.
 *
 * @example
 * items.sort(compareBy((item) => item.name));
 * items.sort(compareBy((item) => item.age, { order: "desc" }));
 * items.sort(compareBy((item) => item.score, { nulls: "first" }));
 */
export function compareBy<T, K extends string | number>(
  keyFn: (item: T) => K | null,
  options: CompareByOptions = {},
): (a: T, b: T) => number {
  
  const direction = options.order === "desc" ? -1 : 1;

  const nullRank = options.nulls === "first" ? -1 : 1;

  const collator = getCollator(options.locale ?? "en");

  return (a, b) => {
    
    const keyA = keyFn(a);
    const keyB = keyFn(b);

    // Null keys go first or last per `nulls`, in original order, ignoring direction.
    if (keyA === null && keyB === null) {
      return 0;
    }
    
    if (keyA === null) {
      return nullRank;
    }

    if (keyB === null) {
      return -nullRank;
    }

    return direction * compareKeys(keyA, keyB, collator);
  };
}

/**
 * Sorts `items` by the key from `keyFn`, returning a **new** array (the input is
 * not mutated). Same ordering options as {@link compareBy} (`order`, `nulls`,
 * `locale`).
 *
 * Performance: `keyFn` runs **once per item** (O(n)) instead of on every
 * comparison. `items.sort(compareBy(keyFn))` re-derives the key inside each
 * comparison — O(n log n) calls — so prefer `sortBy` when `keyFn` is non-trivial
 * (derivation, parsing, formatting, allocation). For a cheap property access the
 * difference is negligible and either form is fine.
 *
 * For multi-key / tie-breaking sorts, compose comparators with
 * {@link chainComparators} instead.
 *
 * @example
 * sortBy(users, (user) => user.name);
 * sortBy(scores, (score) => score.value, { order: "desc", nulls: "first" });
 */
export function sortBy<T, K extends string | number>(
  items: readonly T[],
  keyFn: (item: T) => K | null,
  options: CompareByOptions = {},
): T[] {

  // Decorate: compute each key exactly once, so the sort below never re-runs the
  // (possibly expensive) `keyFn`.
  const decorated = items.map((item) => ({ item, key: keyFn(item) }));

  // Reuse compareBy's ordering logic; here its keyFn is a trivial field read.
  decorated.sort(compareBy((entry) => entry.key, options));

  // Undecorate. `Array.prototype.sort` is stable, so equal keys keep input order.
  return decorated.map((entry) => entry.item);
}

/**
 * Combines comparators into a single one that applies them in order, using each
 * later comparator only to break ties left by the earlier ones. The first
 * comparator is the primary sort; subsequent ones are tie-breakers.
 *
 * @example
 * items.sort(chainComparators([
 *   compareBy((item) => item.lastName),  // primary
 *   compareBy((item) => item.firstName), // tie-break
 * ]));
 */
export function chainComparators<T>(
  comparators: ReadonlyArray<(a: T, b: T) => number>,
): (a: T, b: T) => number {

  return (a, b) => {
    
    for (const compare of comparators) {
      
      const result = compare(a, b);
      
      if (result !== 0) {
        return result;
      }
    }
    
    return 0;
  };
}

function compareKeys(
  a: string | number,
  b: string | number,
  collator: Intl.Collator,
): number {

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  return collator.compare(String(a), String(b));
}
