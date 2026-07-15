import { describe, expect, it } from "vitest";
import { chunk, groupBy, unique } from "./array.js";

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
