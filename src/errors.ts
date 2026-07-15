/**
 * Thrown when a duplicate key is encountered where uniqueness is required
 * (e.g. `indexBy` with `{ duplicateThrows: true }`).
 */
export class DuplicateKeyError extends Error {
  constructor(public readonly key: PropertyKey) {
    super(`Duplicate on key '${key.toString()}'`);
    this.name = "DuplicateKeyError";
  }
}
