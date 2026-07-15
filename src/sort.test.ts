import { describe, expect, it } from "vitest";
import { sortByKey, type SortByKeyOptions } from "./sort.js";

describe("sort", () => {

  describe("sortByKey", () => {

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
        } satisfies SortByKeyOptions,
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
        } satisfies SortByKeyOptions,
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
        } satisfies SortByKeyOptions,
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
        } satisfies SortByKeyOptions,
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
        } satisfies SortByKeyOptions,
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
      options: SortByKeyOptions;
      expectedIds: number[];
    }>;

    for (const { testCase, items, options, expectedIds } of testCases) {

      it(`should return expected order for case '${testCase}'`, () => {

        const result = [...items].sort(sortByKey((item) => item.key, options));

        expect(result.map((item) => item.id)).toEqual(expectedIds);
      });

    }

    it("infers the item type from the array being sorted", () => {

      const people = [
        { name: "Charlie", age: 30 },
        { name: "Alice", age: 25 },
        { name: "Bob", age: 40 },
      ];

      // No explicit generics: the item type flows from `.sort`'s context.
      const byName = [...people].sort(sortByKey((person) => person.name));
      const byAgeDesc = [...people].sort(sortByKey((person) => person.age, { order: "desc" }));

      expect(byName.map((person) => person.name)).toEqual(["Alice", "Bob", "Charlie"]);
      expect(byAgeDesc.map((person) => person.age)).toEqual([40, 30, 25]);
    });

  });

});
