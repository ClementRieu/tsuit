/**
 * Thrown when a duplicate key is encountered where uniqueness is required
 * (e.g. `indexBy` with `{ onDuplicate: "throw" }`).
 */
export class DuplicateKeyError extends Error {
  constructor(public readonly key: PropertyKey) {
    super(`Duplicate on key '${key.toString()}'`);
    this.name = "DuplicateKeyError";
  }
}

/**
 * Thrown by `single` when the array is empty.
 */
export class EmptyArrayError extends Error {
  constructor() {
    super("Expected exactly one element, but the array was empty");
    this.name = "EmptyArrayError";
  }
}

/**
 * Thrown by `single` when the array holds more than one element.
 */
export class MultipleElementsError extends Error {
  constructor(public readonly count: number) {
    super(`Expected exactly one element, but the array had ${count}`);
    this.name = "MultipleElementsError";
  }
}
