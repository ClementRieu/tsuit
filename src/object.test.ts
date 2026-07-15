import { describe, expect, it } from "vitest";
import { isDefined, omit, pick } from "./object.js";

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
