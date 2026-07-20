# tsuit

A collection of small TypeScript helper functions — zero dependencies, tree-shakeable.
Claude helped a lot, meaning you all did.

> [!WARNING]
> **Pre-1.0 — expect frequent breaking changes.** The API is still being shaped
> and may change in any release while the version stays below `1.0.0`.
> Following SemVer's 0.x convention, breaking changes bump the **minor** version
> (`0.1.x → 0.2.0`) and compatible fixes bump the **patch** version.
> Pin an exact version (or a `~0.1.x` range) if you need stability.

## Installation

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
| `array`  | `chunk`, `distinct`, `single`, `first`, `last`, `distinctBy`, `groupBy`, `indexBy` |
| `iteration`   | `doTimes`, `mapTimes`              |
| `string` | `capitalize`, `slugify`, `truncate`                     |
| `object` | `pick`, `omit`, `mapValues`, `isDefined`, `stripUndefined`, `mapToRecord` |
| `sort`   | `compareBy`, `sortBy`, `chainComparators`               |
| `tree`   | `walkTree`                                               |
| `errors` | `TsuitError` (base), `DuplicateKeyError`, `EmptyArrayError`, `MultipleElementsError`, `ArrayRangeError`, `StringRangeError`, `InvalidValueError`, `ErrorCode`, `isTsuitError`, `AnyTsuitError` |

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
