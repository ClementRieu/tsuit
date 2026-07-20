import { describe, expect, it } from "vitest";
import { isDefined, mapToRecord, mapValues, omit, pick, stripUndefined } from "./object.js";

describe("object", () => {

  describe("pick", () => {

    it("keeps only requested keys", () => {

      const result = pick({ a: 1, b: 2, c: 3 }, ["a", "c"]);

      const expected = { a: 1, c: 3 };

      expect(result).toEqual(expected);
    });

    it("ignores inherited keys, copying only own properties", () => {

      const proto = { inherited: 1 };
      const obj = Object.create(proto) as { inherited: number; own: number };
      obj.own = 2;

      const result = pick(obj, ["own", "inherited"]);

      expect(result).toEqual({ own: 2 });
      expect(Object.hasOwn(result, "inherited")).toBe(false);
    });

  });

  describe("omit", () => {

    it("removes requested keys", () => {

      const result = omit({ a: 1, b: 2, c: 3 }, ["b"]);

      const expected = { a: 1, c: 3 };

      expect(result).toEqual(expected);
    });

  });

  describe("isDefined", () => {

    it("narrows nullish values", () => {

      const result = [1, null, 2, undefined].filter(isDefined);

      const expected = [1, 2];

      expect(result).toEqual(expected);
    });

  });

  describe("mapValues", () => {

    it("maps each value while keeping the keys", () => {

      const result = mapValues({ a: 1, b: 2 }, (n) => n * 10);

      const expected = { a: 10, b: 20 };

      expect(result).toEqual(expected);
    });

    it("passes the key to the callback", () => {

      const result = mapValues({ a: 1, b: 2 }, (n, key) => `${key}${n}`);

      const expected = { a: "a1", b: "b2" };

      expect(result).toEqual(expected);
    });

    it("returns a new object without mutating the input", () => {

      const input = { a: 1 };

      const result = mapValues(input, (n) => n + 1);

      expect(result).not.toBe(input);
      expect(input).toEqual({ a: 1 });
    });

  });

  describe("stripUndefined", () => {

    it("removes keys whose value is undefined but keeps null", () => {

      const result = stripUndefined({ a: 1, b: undefined, c: null });

      const expected = { a: 1, c: null };

      expect(result).toEqual(expected);
    });

    it("does not add keys that were absent", () => {

      const result = stripUndefined({ a: 1 });

      expect(Object.keys(result)).toEqual(["a"]);
    });

  });

  describe("mapToRecord", () => {

    it("builds a record from a map's entries", () => {

      const result = mapToRecord(new Map([["a", 1], ["b", 2]]));

      const expected = { a: 1, b: 2 };

      expect(result).toEqual(expected);
    });

    it("returns a plain object", () => {

      const result = mapToRecord(new Map<string, number>());

      expect(result).toEqual({});
    });

  });

  describe("prototype safety", () => {

    // An own, enumerable "__proto__" data property — as produced by JSON.parse or
    // a computed key. This is the key a naive `{}` + assignment would mishandle
    // (the proto setter would drop it or corrupt the result's prototype).
    const withMagicKey = () => ({ ["__proto__"]: 1, keep: 2 } as Record<string, number>);

    it("input carrying __proto__ as data is set up correctly (sanity)", () => {
      const obj = withMagicKey();
      expect(Object.hasOwn(obj, "__proto__")).toBe(true);
      expect(Object.getPrototypeOf(obj)).toBe(Object.prototype);
    });

    it("pick preserves it as data and returns a normal object", () => {
      const result = pick(withMagicKey(), ["__proto__", "keep"]);
      expect(Object.hasOwn(result, "__proto__")).toBe(true);
      expect(result["__proto__"]).toBe(1);
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    });

    it("omit preserves it as data and returns a normal object", () => {
      const result = omit(withMagicKey(), ["keep"]);
      expect(Object.hasOwn(result, "__proto__")).toBe(true);
      expect((result as Record<string, number>)["__proto__"]).toBe(1);
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    });

    it("stripUndefined preserves it as data and returns a normal object", () => {
      const result = stripUndefined(withMagicKey());
      expect(Object.hasOwn(result, "__proto__")).toBe(true);
      expect((result as Record<string, number>)["__proto__"]).toBe(1);
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    });

    it("mapValues transforms it as data and returns a normal object", () => {
      const result = mapValues(withMagicKey(), (n) => n * 10);
      expect(Object.hasOwn(result, "__proto__")).toBe(true);
      expect(result["__proto__"]).toBe(10);
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    });

  });

});
