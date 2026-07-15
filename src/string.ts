// Matches combining diacritical marks (U+0300–U+036F) left after NFKD normalization.
const COMBINING_MARKS = /[̀-ͯ]/g;
const NON_ALNUM = /[^a-z0-9]+/g;
const EDGE_DASHES = /^-+|-+$/g;

/**
 * Capitalizes the first character of a string.
 */
export function capitalize(value: string): string {
  return value.length === 0 ? value : value[0]!.toUpperCase() + value.slice(1);
}

/**
 * Converts a string to a URL-friendly slug.
 *
 * @example
 * slugify("Héllo, World!"); // "hello-world"
 */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .trim()
    .replace(NON_ALNUM, "-")
    .replace(EDGE_DASHES, "");
}

/**
 * Truncates a string to `maxLength`, appending `suffix` if it was cut.
 */
export function truncate(value: string, maxLength: number, suffix = "…"): string {
  if (value.length <= maxLength) {
    return value;
  }
  const maxTruncateLength = maxLength - suffix.length;
  return value.slice(0, Math.max(0, maxTruncateLength)) + suffix;
}
