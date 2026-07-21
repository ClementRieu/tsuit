import { InvalidValueError } from "./errors.js";

/**
 * Validates the `times` argument shared by {@link doTimes} and {@link mapTimes}:
 * it must be finite (rejects `NaN` and `±Infinity`) and non-negative. A
 * fractional `times` is accepted — the loop simply stops below it.
 */
function assertAndValidTimes(times: number): void {
  if (!Number.isFinite(times)) {
    throw new InvalidValueError(`'times' must be a finite number`);
  }
  if (times < 0) {
    throw new InvalidValueError(`'times' can't be negative`);
  }
}

/**
 * Calls `execute` `times` times, passing the **1-based** iteration number (`1`
 * on the first call, up to `times` on the last). Does nothing when `times` is
 * `0`.
 *
 * Note: the counter starts at `1`, not `0` — unlike array indices or lodash's
 * `times`.
 *
 * @throws {InvalidValueError} if `times` is negative, `NaN`, or infinite.
 *
 * @example
 * doTimes(3, (n) => console.log(n)); // logs 1, then 2, then 3
 */
export function doTimes(
  times: number,
  execute: (index: number) => void,
): void {

  const iterations = Math.floor(times);

  assertAndValidTimes(iterations);

  for (let index = 0; index < iterations; index++) {
    execute(index);
  }
}

/**
 * Builds an array of length `times` by calling `map` with the **1-based**
 * iteration number (`1` up to `times`). Returns an empty array when `times` is
 * `0`.
 *
 * Note: the counter starts at `1`, not `0` — unlike array indices or lodash's
 * `times`.
 *
 * @throws {InvalidValueError} if `times` is negative, `NaN`, or infinite.
 *
 * @example
 * mapTimes(3, (n) => n * 2); // [2, 4, 6]
 */
export function mapTimes<T>(
  times: number,
  map: (index: number) => T,
): T[] {

  const iterations = Math.floor(times);

  assertAndValidTimes(iterations);

  const result: T[] = [];

  for (let index = 0; index < iterations; index++) {
    result.push(map(index));
    
  }
  return result;
}
