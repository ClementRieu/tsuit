/**
 * Machine-readable code carried by every error this library throws. Frozen at
 * runtime (not just `readonly` at compile time), so the contract can't be
 * mutated by accident from TS or JS.
 *
 * Use the derived {@link ErrorCode} type as a `Record` key to build exhaustive
 * mappings — TS rejects the compile if a code is missing or extraneous:
 *
 * @example
 * const httpByCode = {
 *   DUPLICATE_KEY: 409, EMPTY_ARRAY: 400, MULTIPLE_ELEMENTS: 400,
 *   ARRAY_RANGE: 400, STRING_RANGE: 400,
 * } satisfies Record<ErrorCode, number>;
 */
export const ErrorCode = Object.freeze({
  DUPLICATE_KEY: "DUPLICATE_KEY",
  EMPTY_ARRAY: "EMPTY_ARRAY",
  MULTIPLE_ELEMENTS: "MULTIPLE_ELEMENTS",
  ARRAY_RANGE: "ARRAY_RANGE",
  STRING_RANGE: "STRING_RANGE",
} as const);

/** Union of every {@link ErrorCode} value, e.g. `"DUPLICATE_KEY"`. */
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Base class for every error this library throws. Catch it (via `instanceof`
 * for intra-app code, or {@link isTsuitError} for realm-safe tooling) to handle
 * any tsuit error uniformly; the concrete subclasses carry the specific context
 * and a distinct `code`. Abstract so each subclass must declare its `code`.
 */
export abstract class TsuitError extends Error {
  /** Stable, machine-readable discriminant. Narrows the subclass on a switch. */
  abstract readonly code: ErrorCode;

  constructor(message: string) {
    super(message);
    this.name = "TsuitError";
  }
}

/**
 * Thrown when a duplicate key is encountered where uniqueness is required
 * (e.g. `indexBy` with `{ onDuplicate: "throw" }`). The offending `key` is kept
 * for inspection; the caller supplies the message.
 */
export class DuplicateKeyError extends TsuitError {
  readonly code = ErrorCode.DUPLICATE_KEY;

  constructor(message: string, public readonly key: PropertyKey) {
    super(message);
    this.name = "DuplicateKeyError";
  }
}

/**
 * Thrown by `single` when the array is empty. The caller supplies the message.
 */
export class EmptyArrayError extends TsuitError {
  readonly code = ErrorCode.EMPTY_ARRAY;

  constructor(message: string) {
    super(message);
    this.name = "EmptyArrayError";
  }
}

/**
 * Thrown by `single` when the array holds more than one element. The actual
 * `count` is kept for inspection; the caller supplies the message.
 */
export class MultipleElementsError extends TsuitError {
  readonly code = ErrorCode.MULTIPLE_ELEMENTS;

  constructor(message: string, public readonly count: number) {
    super(message);
    this.name = "MultipleElementsError";
  }
}

/**
 * Thrown by array helpers when a numeric argument is outside its valid range
 * (e.g. `chunk` with a size below 1). The project-owned counterpart to the
 * built-in `RangeError`; the caller supplies the message.
 */
export class ArrayRangeError extends TsuitError {
  readonly code = ErrorCode.ARRAY_RANGE;

  constructor(message: string) {
    super(message);
    this.name = "ArrayRangeError";
  }
}

/**
 * Thrown by string helpers when a numeric argument is outside its valid range
 * (e.g. `truncate` with a suffix longer than `maxLength`). The project-owned
 * counterpart to the built-in `RangeError`; the caller supplies the message.
 */
export class StringRangeError extends TsuitError {
  readonly code = ErrorCode.STRING_RANGE;

  constructor(message: string) {
    super(message);
    this.name = "StringRangeError";
  }
}

/**
 * Union of every concrete error this library throws. Switch on `.code` for an
 * exhaustive, narrowing dispatch (each case exposes that error's context).
 */
export type AnyTsuitError =
  | DuplicateKeyError
  | EmptyArrayError
  | MultipleElementsError
  | ArrayRangeError
  | StringRangeError;

const KNOWN_CODES: ReadonlySet<string> = new Set(Object.values(ErrorCode));

/**
 * Realm-safe guard: identifies any error this library threw by its `code`
 * rather than by class identity. Unlike `instanceof`, it survives duplicate
 * package copies (dual ESM/CJS load, multiple versions) and values whose
 * prototype was lost — as long as the `code` is intact.
 */
export function isTsuitError(value: unknown): value is AnyTsuitError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    typeof (value as { code: unknown }).code === "string" &&
    KNOWN_CODES.has((value as { code: string }).code)
  );
}
