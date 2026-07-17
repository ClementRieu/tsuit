import { describe, expect, it } from "vitest";
import {
  ArrayRangeError,
  DuplicateKeyError,
  EmptyArrayError,
  ErrorCode,
  MultipleElementsError,
  StringRangeError,
  TsuitError,
  isTsuitError,
  type AnyTsuitError,
} from "./errors.js";

describe("errors", () => {

  it("exposes a runtime-frozen ErrorCode table", () => {
    expect(Object.isFrozen(ErrorCode)).toBe(true);
    // ESM runs in strict mode, so writing to a frozen object throws.
    expect(() => {
      (ErrorCode as unknown as Record<string, string>).DuplicateKey = "x";
    }).toThrow(TypeError);
  });

  it("tags each error with its code while staying a TsuitError and Error", () => {
    const cases: Array<[AnyTsuitError, string]> = [
      [new DuplicateKeyError("dup", "k"), ErrorCode.DUPLICATE_KEY],
      [new EmptyArrayError("empty"), ErrorCode.EMPTY_ARRAY],
      [new MultipleElementsError("many", 3), ErrorCode.MULTIPLE_ELEMENTS],
      [new ArrayRangeError("range"), ErrorCode.ARRAY_RANGE],
      [new StringRangeError("range"), ErrorCode.STRING_RANGE],
    ];

    for (const [error, code] of cases) {
      expect(error.code).toBe(code);
      expect(error).toBeInstanceOf(TsuitError);
      expect(error).toBeInstanceOf(Error);
    }
  });

  it("keeps typed context on each subclass", () => {
    expect(new DuplicateKeyError("dup", "k").key).toBe("k");
    expect(new MultipleElementsError("many", 3).count).toBe(3);
  });

  it("narrows the context by switching on code", () => {
    const error: AnyTsuitError = new MultipleElementsError("many", 3);

    let seen = -1;
    switch (error.code) {
      case ErrorCode.MULTIPLE_ELEMENTS:
        seen = error.count; // narrowed: `count` is available here
        break;
      default:
        break;
    }

    expect(seen).toBe(3);
  });

  describe("isTsuitError", () => {

    it("matches errors this library throws", () => {
      expect(isTsuitError(new EmptyArrayError("x"))).toBe(true);
      expect(isTsuitError(new DuplicateKeyError("x", "k"))).toBe(true);
    });

    it("matches by code even without the prototype (realm-safe)", () => {
      // Simulates an error that crossed a serialization boundary: plain object,
      // no TsuitError prototype, but the code survived.
      const rehydrated = { code: ErrorCode.ARRAY_RANGE, message: "y" };
      expect(isTsuitError(rehydrated)).toBe(true);
    });

    it("rejects foreign errors and non-errors", () => {
      expect(isTsuitError(new Error("nope"))).toBe(false);
      expect(isTsuitError({ code: "unknown_code" })).toBe(false);
      expect(isTsuitError({ code: 42 })).toBe(false);
      expect(isTsuitError(null)).toBe(false);
      expect(isTsuitError("empty_array")).toBe(false);
    });

  });

});
