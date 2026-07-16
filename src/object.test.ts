import { describe, expect, it } from "vitest";
import { isDefined, omit, pick, stripUndefined } from "./object.js";

describe("object", () => {

  describe("pick", () => {

    it("keeps only requested keys", () => {

      const result = pick({ a: 1, b: 2, c: 3 }, ["a", "c"]);

      const expected = { a: 1, c: 3 };

      expect(result).toEqual(expected);
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

});
