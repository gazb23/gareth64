import { describe, expect, it } from "vitest";

import { askRequestSchema, askStreamEventSchema } from "./ask-schema";

describe("Gareth.AI boundaries", () => {
  it("caps question input", () => {
    expect(askRequestSchema.safeParse({ question: "Who is Gareth?", company: "" }).success).toBe(true);
    expect(askRequestSchema.safeParse({ question: "x".repeat(401) }).success).toBe(false);
    expect(askRequestSchema.safeParse({ question: "Who is Gareth?", company: "bot" }).success).toBe(false);
    expect(askRequestSchema.safeParse({ question: "Who is Gareth?", admin: true }).success).toBe(false);
  });

  it("rejects malformed citation events", () => {
    expect(askStreamEventSchema.safeParse({ type: "done", citationIds: ["invented"] }).success).toBe(false);
    expect(askStreamEventSchema.safeParse({ type: "done", citationIds: ["kb-profile-identity"] }).success).toBe(true);
  });
});
