import { describe, expect, it } from "vitest";
import {
  chunk,
  lookupBy,
  distinct,
  distinctBy,
  first,
  indexBy,
  last,
  single,
  type IndexByOptions,
  type DistinctByOptions,
} from "./array.js";
import {
  ArrayRangeError,
  DuplicateKeyError,
  EmptyArrayError,
  MultipleElementsError,
} from "./errors.js";

describe("array", () => {

  describe("chunk", () => {

    it("splits into expected groups", () => {

      const result = chunk([1, 2, 3, 4, 5], 2);

      const expected = [[1, 2], [3, 4], [5]];

      expect(result).toEqual(expected);
    });

    it("rejects invalid sizes", () => {
      expect(() => chunk([1], 0)).toThrow(ArrayRangeError);
    });

  });


  describe("distinct", () => {

    it("preserves order", () => {
      const result = distinct([1, 1, 2, 3, 2]);

      const expected = [1, 2, 3];

      expect(result).toEqual(expected);
    });

  });

  describe("single", () => {

    it("returns the only element", () => {
      expect(single([42])).toBe(42);
    });

    it("throws EmptyArrayError when the array is empty", () => {
      expect(() => single([])).toThrow(EmptyArrayError);
    });

    it("throws MultipleElementsError when there is more than one element", () => {
      expect(() => single([1, 2])).toThrow(MultipleElementsError);
    });

  });

  describe("first", () => {

    it("returns the first element", () => {
      expect(first([1, 2, 3])).toBe(1);
    });

    it("throws EmptyArrayError when the array is empty", () => {
      expect(() => first([])).toThrow(EmptyArrayError);
    });

  });

  describe("last", () => {

    it("returns the last element", () => {
      expect(last([1, 2, 3])).toBe(3);
    });

    it("throws EmptyArrayError when the array is empty", () => {
      expect(() => last([])).toThrow(EmptyArrayError);
    });

  });

  describe("lookupBy", () => {

    it("groups buckets by key", () => {

      const result = lookupBy(
        [1, 2, 3, 4],
        (n) => (n % 2 === 0 ? "even" : "odd")
      );

      const expected = {
        odd: [1, 3],
        even: [2, 4],
      };

      expect(result).toEqual(expected);
    });

  });

  describe("indexBy", () => {

    const getKey = (item: { v: string }) => item.v

    const a = { v: "a" };
    const b = { v: "b" };
    const c = { v: "c" };
    const a2 = { ...a, index: 2 };

    const testCases = [
      {
        testCase: "base test",
        items: [
          a, b, c
        ],
        getKey,
        options: {},
        expectedResult: {
          "a": a,
          "b": b,
          "c": c,
        }
      },
      {
        testCase: "no duplicate ignores duplicate throws",
        items: [
          a, b, c
        ],
        getKey,
        options: {
          onDuplicate: "throw"
        } satisfies IndexByOptions,
        expectedResult: {
          "a": a,
          "b": b,
          "c": c,
        }
      },
      {
        testCase: "duplicates (default)",
        items: [
          a, b, c, a2
        ],
        getKey,
        options: {},
        expectedResult: {
          "a": a2,
          "b": b,
          "c": c,
        }
      },
      {
        testCase: "keep-first duplicates",
        items: [
          a, b, c, a2
        ],
        getKey,
        options: {
          onDuplicate: "keep-first"
        } satisfies IndexByOptions,
        expectedResult: {
          "a": a,
          "b": b,
          "c": c,
        }
      }
    ]

    for (const { testCase, items, getKey, options, expectedResult } of testCases) {
      
      it(`should return expected result for case '${testCase}'`, () => {

        const result = indexBy(
          items,
          getKey,
          options
        );

        expect(result).toEqual(expectedResult);
      });

    }

    it(`should throw on .onDuplicate: "throw" and duplicates`, () => {

        const items = [a, a2]

        const getResult = () => indexBy(
          items,
          getKey,
          {
            onDuplicate: "throw"
          }
        );

        expect(getResult).toThrow(DuplicateKeyError);
      });

  });

  describe("distinctBy", () => {

    const getKey = (item: { v: string }) => item.v

    const a = { v: "a" };
    const b = { v: "b" };
    const c = { v: "c" };
    const a2 = { ...a, index: 2 };

    const testCases = [
      {
        testCase: "base test",
        items: [
          a, b, c
        ],
        getKey,
        options: {},
        expectedResult: [a, b, c]
      },
      {
        testCase: "default keeps the first occurrence",
        items: [
          a, b, c, a2
        ],
        getKey,
        options: {},
        expectedResult: [a, b, c]
      },
      {
        testCase: "keep-first keeps the first occurrence",
        items: [
          a, b, c, a2
        ],
        getKey,
        options: {
          onDuplicate: "keep-first"
        } satisfies DistinctByOptions,
        expectedResult: [a, b, c]
      },
      {
        testCase: "keep-last keeps the last value at the first position",
        items: [
          a, b, c, a2
        ],
        getKey,
        options: {
          onDuplicate: "keep-last"
        } satisfies DistinctByOptions,
        expectedResult: [a2, b, c]
      }
    ]

    for (const { testCase, items, getKey, options, expectedResult } of testCases) {

      it(`should return expected result for case '${testCase}'`, () => {

        const result = distinctBy(
          items,
          getKey,
          options
        );

        expect(result).toEqual(expectedResult);
      });

    }

    it("preserves first-occurrence order with integer-like keys", () => {

      const items = [{ id: 3 }, { id: 1 }, { id: 3 }, { id: 2 }];

      const result = distinctBy(items, (item) => item.id);

      const expected = [{ id: 3 }, { id: 1 }, { id: 2 }];

      expect(result).toEqual(expected);
    });

  });

});
