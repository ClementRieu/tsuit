# ts-helpers

A collection of small, well-typed TypeScript helper functions — zero dependencies, tree-shakeable, and ready to be published as an npm package.

## Installation

Once published:

```bash
npm install ts-helpers
```

## Usage

```ts
import { chunk, slugify, pick } from "ts-helpers";

chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
slugify("Héllo, World!"); // "hello-world"
pick({ a: 1, b: 2, c: 3 }, ["a", "c"]); // { a: 1, c: 3 }
```

## Available helpers

| Module   | Functions                          |
| -------- | ---------------------------------- |
| `array`  | `chunk`, `unique`, `groupBy`       |
| `string` | `capitalize`, `slugify`, `truncate`|
| `object` | `pick`, `omit`, `isDefined`        |

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
3. Add tests in `src/index.test.ts` (or a dedicated `*.test.ts`).

## Publishing

The package builds to dual ESM/CJS with type declarations. To publish:

```bash
npm version patch   # bump the version
npm publish         # runs the build via prepublishOnly
```

> Update the `name` in `package.json` to an available npm name (or a scoped name like `@clementrieu/ts-helpers`) before publishing.

## License

[MIT](./LICENSE) © Clement Rieu
