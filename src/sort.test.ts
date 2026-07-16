import { describe, expect, it } from "vitest";
import { compareBy, chainComparators, type CompareByOptions } from "./sort.js";

describe("sort", () => {

  describe("compareBy", () => {

    type Row = { id: number; key: string | number | null };

    const testCases = [
      {
        testCase: "string keys ascending",
        items: [
          { id: 1, key: "banana" },
          { id: 2, key: "apple" },
          { id: 3, key: "cherry" },
        ],
        options: {},
        expectedIds: [2, 1, 3],
      },
      {
        testCase: "string keys descending",
        items: [
          { id: 1, key: "banana" },
          { id: 2, key: "apple" },
          { id: 3, key: "cherry" },
        ],
        options: {
          order: "desc"
        } satisfies CompareByOptions,
        expectedIds: [3, 1, 2],
      },
      {
        testCase: "number keys ascending",
        items: [
          { id: 1, key: 3 },
          { id: 2, key: 1 },
          { id: 3, key: 2 },
        ],
        options: {},
        expectedIds: [2, 3, 1],
      },
      {
        testCase: "number keys descending",
        items: [
          { id: 1, key: 3 },
          { id: 2, key: 1 },
          { id: 3, key: 2 },
        ],
        options: {
          order: "desc"
        } satisfies CompareByOptions,
        expectedIds: [1, 3, 2],
      },
      {
        testCase: "null keys sort last (ascending)",
        items: [
          { id: 1, key: "b" },
          { id: 2, key: null },
          { id: 3, key: "a" },
        ],
        options: {},
        expectedIds: [3, 1, 2],
      },
      {
        testCase: "null keys still sort last (descending)",
        items: [
          { id: 1, key: "b" },
          { id: 2, key: null },
          { id: 3, key: "a" },
        ],
        options: {
          order: "desc"
        } satisfies CompareByOptions,
        expectedIds: [1, 3, 2],
      },
      {
        testCase: "nulls first moves null keys to the front",
        items: [
          { id: 1, key: "b" },
          { id: 2, key: null },
          { id: 3, key: "a" },
        ],
        options: {
          nulls: "first"
        } satisfies CompareByOptions,
        expectedIds: [2, 3, 1],
      },
      {
        testCase: "nulls first is unaffected by descending order",
        items: [
          { id: 1, key: "b" },
          { id: 2, key: null },
          { id: 3, key: "a" },
        ],
        options: {
          order: "desc",
          nulls: "first"
        } satisfies CompareByOptions,
        expectedIds: [2, 1, 3],
      },
      {
        testCase: "null keys keep their relative order",
        items: [
          { id: 1, key: null },
          { id: 2, key: "a" },
          { id: 3, key: null },
        ],
        options: {},
        expectedIds: [2, 1, 3],
      },
      {
        testCase: "strings sort alphabetically with accents (localeCompare)",
        items: [
          { id: 1, key: "éclair" },
          { id: 2, key: "abricot" },
          { id: 3, key: "Zoé" },
        ],
        options: {},
        expectedIds: [2, 1, 3],
      },
    ] satisfies Array<{
      testCase: string;
      items: Row[];
      options: CompareByOptions;
      expectedIds: number[];
    }>;

    for (const { testCase, items, options, expectedIds } of testCases) {

      it(`should return expected order for case '${testCase}'`, () => {

        const result = [...items].sort(compareBy((item) => item.key, options));

        expect(result.map((item) => item.id)).toEqual(expectedIds);
      });

    }

  });

  describe("chainComparators", () => {

    const people = [
      { id: 1, last: "Smith", first: "Bob" },
      { id: 2, last: "Jones", first: "Alice" },
      { id: 3, last: "Smith", first: "Alice" },
      { id: 4, last: "Jones", first: "Bob" },
    ];

    it("uses the first comparator as primary and later ones to break ties", () => {

      const result = [...people].sort(chainComparators([
        compareBy((person) => person.last),
        compareBy((person) => person.first),
      ]));

      // Jones before Smith; within each last name, Alice before Bob.
      expect(result.map((person) => person.id)).toEqual([2, 4, 3, 1]);
    });

    it("swapping the order swaps which key is primary", () => {

      const result = [...people].sort(chainComparators([
        compareBy((person) => person.first),
        compareBy((person) => person.last),
      ]));

      // Alice before Bob; within each first name, Jones before Smith.
      expect(result.map((person) => person.id)).toEqual([2, 3, 4, 1]);
    });

    it("honors per-comparator options in the tie-break", () => {

      const result = [...people].sort(chainComparators([
        compareBy((person) => person.last),
        compareBy((person) => person.first, { order: "desc" }),
      ]));

      // Jones before Smith; within each last name, Bob before Alice (desc).
      expect(result.map((person) => person.id)).toEqual([4, 2, 1, 3]);
    });

  });

});
