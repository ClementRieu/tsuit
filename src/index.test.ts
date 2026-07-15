import { describe, expect, it } from "vitest";
import { chunk, groupBy, unique } from "./array.js";
import { capitalize, slugify, truncate } from "./string.js";
import { isDefined, omit, pick } from "./object.js";

describe("array", () => {
  it("chunk splits into groups", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("chunk rejects invalid sizes", () => {
    expect(() => chunk([1], 0)).toThrow(RangeError);
  });

  it("unique preserves order", () => {
    expect(unique([1, 1, 2, 3, 2])).toEqual([1, 2, 3]);
  });

  it("groupBy buckets by key", () => {
    expect(groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? "even" : "odd"))).toEqual({
      odd: [1, 3],
      even: [2, 4],
    });
  });
});

describe("string", () => {
  it("capitalize uppercases the first char", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("")).toBe("");
  });

  it("slugify produces url-friendly slugs", () => {
    expect(slugify("Héllo, World!")).toBe("hello-world");
  });

  it("truncate appends a suffix when cut", () => {
    expect(truncate("hello world", 8)).toBe("hello w…");
    expect(truncate("hi", 8)).toBe("hi");
  });
});

describe("object", () => {
  it("pick keeps only requested keys", () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 });
  });

  it("omit removes requested keys", () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ["b"])).toEqual({ a: 1, c: 3 });
  });

  it("isDefined narrows nullish values", () => {
    expect([1, null, 2, undefined].filter(isDefined)).toEqual([1, 2]);
  });
});
