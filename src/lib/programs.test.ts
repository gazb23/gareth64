import { describe, expect, it } from "vitest";

import type { TapeId } from "@/content/tapes";

import { programLines, starterQuestionCommand } from "./programs";

const careerTapes = ["gareth", "iris", "products", "contact"] satisfies readonly TapeId[];

describe("programLines", () => {
  it.each(careerTapes)("ends the %s tape with useful next actions", (tape) => {
    const lines = programLines(tape);
    const textLines = lines.filter((line) => line.kind === "text").map((line) => line.text);
    const commands = lines.filter((line) => line.kind === "command");

    expect(textLines).toContain("WHAT NEXT?");
    expect(commands.some((line) => line.text === "> VIEW RÉSUMÉ" && line.command === "RESUME")).toBe(true);
    expect(commands.some((line) => line.command.startsWith('LOAD "'))).toBe(true);
  });

  it("opens the Products tape from the products starter question", () => {
    expect(starterQuestionCommand("What products has he shipped?")).toBe('LOAD "PRODUCTS",1');
    expect(starterQuestionCommand("Who is Gareth?")).toBe('ASK "Who is Gareth?"');
  });
});
