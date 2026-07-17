# tsuit

A collection of small TypeScript helper functions — zero dependencies, tree-shakeable.
Claude helped a lot, meaning you all did.

## Installation

Once published:

```bash
npm install @clementrieu/tsuit
```

## Usage

```ts
import { chunk, slugify, pick } from "@clementrieu/tsuit";

chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
slugify("Héllo, World!"); // "hello-world"
pick({ a: 1, b: 2, c: 3 }, ["a", "c"]); // { a: 1, c: 3 }
```

## Available helpers

| Module   | Functions                          |
| -------- | ---------------------------------- |
| `array`  | `chunk`, `distinct`, `single`, `distinctBy`, `lookupBy`, `indexBy` |
| `string` | `capitalize`, `slugify`, `truncate`                     |
| `object` | `pick`, `omit`, `isDefined`, `stripUndefined`           |
| `sort`   | `compareBy`, `chainComparators`                         |
| `tree`   | `walkTree`                                               |
| `errors` | `TsuitError` (base), `DuplicateKeyError`, `EmptyArrayError`, `MultipleElementsError`, `ArrayRangeError`, `StringRangeError`, `ErrorCode`, `isTsuitError`, `AnyTsuitError` |

## Development

```bash
npm install        # install dependencies
npm test           # run the test suite (vitest)
npm run typecheck  # type-check without emitting
npm run build      # build ESM + CJS + type declarations into dist/
```

## Adding a helper

1. Add (or extend) a module in `src/`, e.g. `src/number.ts`.
2. Export it from `src/index.ts`.
3. Add its tests in a sibling file named after the module, e.g. `src/number.test.ts`.

Each module keeps its tests in a co-located `*.test.ts` file (`array.ts` →
`array.test.ts`, etc.); vitest picks them up automatically.

## License

[MIT](./LICENSE) © Clement Rieu
