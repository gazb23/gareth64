import { describe, expect, it } from "vitest";

import { knowledgeRegistry } from "./knowledge";
import vectors from "./knowledge-vectors.json";
import { tapes } from "./tapes";

describe("content registries", () => {
  it("publishes only reviewed evidence with stable unique IDs", () => {
    expect(knowledgeRegistry.length).toBeGreaterThanOrEqual(50);
    expect(new Set(knowledgeRegistry.map((item) => item.id)).size).toBe(knowledgeRegistry.length);
    expect(knowledgeRegistry.every((item) => item.evidenceStatus === "verified-public" || item.evidenceStatus === "public-safe")).toBe(true);
  });

  it("has an embedding for every knowledge chunk", () => {
    expect(vectors.model).toBe("perplexity/pplx-embed-v1-0.6b");
    expect(vectors.dimensions).toBe(1024);
    expect(Object.keys(vectors.records)).toHaveLength(knowledgeRegistry.length);
  });

  it("ships all career tapes", () => {
    const ids = tapes.map((tape) => tape.id);
    expect(ids).toEqual(expect.arrayContaining(["gareth", "iris", "products", "contact"]));
  });
});

