import { describe, expect, it } from "vitest";
import { isDefined, omit, pick } from "./object.js";

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

});
