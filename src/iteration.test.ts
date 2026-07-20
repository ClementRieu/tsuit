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

    it("takes time as parameter", () => {

      const push: number[] = [];

      doTimes(12, (time) => {
        push.push(time)
      });

      expect(push).toEqual([1,2,3,4,5,6,7,8,9,10,11,12]);
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

      expect(result).toEqual([1,2,3,4,5,6,7,8,9,10,11,12]);
    });

    it("throws on NaN or infinite 'times'", () => {
      expect(() => mapTimes(NaN, (time) => time)).toThrow(InvalidValueError);
      expect(() => mapTimes(Infinity, (time) => time)).toThrow(InvalidValueError);
    });

    it("accepts a fractional 'times', stopping below it", () => {
      // Floats are intentionally allowed: the loop runs while time <= 2.9.
      expect(mapTimes(2.9, (time) => time)).toEqual([1, 2]);
    });

    it("throws on negative 'times'", () => {

      const execute = () => mapTimes(-1, (time) => time);

      expect(execute).toThrow(InvalidValueError);
    });
  });
});
