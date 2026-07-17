import { describe, expect, it } from "vitest";
import { capitalize, slugify, truncate } from "./string.js";
import { StringRangeError } from "./errors.js";

describe("string", () => {

  describe("capitalize", () => {

    it("uppercases the first char", () => {

      const result = capitalize("hello");

      const expected = "Hello";

      expect(result).toBe(expected);
    });

    it("leaves an empty string unchanged", () => {
      expect(capitalize("")).toBe("");
    });

    it("works with accents", () => {
      expect(capitalize("é")).toBe("É");
    });
  });

  describe("slugify", () => {

    it("produces url-friendly slugs", () => {

      const result = slugify("Héllo, World!");

      const expected = "hello-world";

      expect(result).toBe(expected);
    });

  });

  describe("truncate", () => {

    it("appends a suffix when cut", () => {

      const result = truncate("hello world", 8);

      const expected = "hello w…";

      expect(result).toBe(expected);
    });

    it("leaves short strings untouched", () => {
      expect(truncate("hi", 8)).toBe("hi");
    });

    it("throws StringRangeError when the suffix is longer than maxLength", () => {
      expect(() => truncate("hello", 2, "...")).toThrow(StringRangeError);
    });

  });

});
