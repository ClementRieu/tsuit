import { describe, expect, it } from "vitest";
import { capitalize, slugify, truncate } from "./string.js";

describe("string", () => {
  it("capitalize uppercases the first char", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("")).toBe("");
  });

  it("slugify produces url-friendly slugs", () => {
    expect(slugify("Héllo, World!")).toBe("hello-world");
  });

  it("truncate appends a suffix when cut", () => {
    expect(truncate("hello world", 8)).toBe("hello w…");
    expect(truncate("hi", 8)).toBe("hi");
  });
});
