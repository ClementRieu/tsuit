import { describe, expect, it } from "vitest";
import { doTimes, mapTimes } from "./iteration.js";
import { InvalidValueError } from "./errors.js";

describe("algo", () => {

  describe("doTimes", () => {

    it("executes number of times", () => {

      let count = 0;

      doTimes(12, () => {
        count++
      });

      expect(count).toEqual(12);
    });

    it("takes index and time as parameter", () => {

      const indexes: number[] = [];

      doTimes(12, (index) => {
        indexes.push(index)
      });

      expect(indexes).toEqual([0,1,2,3,4,5,6,7,8,9,10,11]);
    });

    it("throws on negative 'times'", () => {

      const execute = () => doTimes(-1, () => {});

      expect(execute).toThrow(InvalidValueError);
    });

    it("throws on NaN or infinite 'times'", () => {
      expect(() => doTimes(NaN, () => {})).toThrow(InvalidValueError);
      expect(() => doTimes(Infinity, () => {})).toThrow(InvalidValueError);
    });
  });

  describe("mapTimes", () => {

    it("returns expected result", () => {

      const result = mapTimes(12, (time) => time);

      expect(result).toEqual([0,1,2,3,4,5,6,7,8,9,10,11]);
    });

    it("throws on NaN or infinite 'times'", () => {
      expect(() => mapTimes(NaN, (index) => index)).toThrow(InvalidValueError);
      expect(() => mapTimes(Infinity, (index) => index)).toThrow(InvalidValueError);
    });

    it("accepts a fractional 'times', stopping below it", () => {
      // Floats are intentionally allowed: the loop runs while time <= 2.9.
      expect(mapTimes(2.9, (index) => index)).toEqual([0, 1]);
    });

    it("throws on negative 'times'", () => {

      const execute = () => mapTimes(-1, (index) => index);

      expect(execute).toThrow(InvalidValueError);
    });
  });
});
