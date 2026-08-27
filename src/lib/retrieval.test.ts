import { describe, expect, it } from "vitest";

import type { KnowledgeChunkId } from "@/content/knowledge";
import { ragEvalCases } from "./retrieval-eval";
import { assessRetrieval, retrieveLexically } from "./retrieval-local";

const supportedCases = ragEvalCases.filter((testCase) => testCase.kind === "supported");
const unsupportedCases = ragEvalCases.filter((testCase) => testCase.kind === "unsupported");

function includesExpected(expectedIds: readonly KnowledgeChunkId[], id: KnowledgeChunkId): boolean {
  return expectedIds.includes(id);
}

describe("fixed RAG evaluation set", () => {
  it.each(supportedCases)("ranks evidence for $id", (testCase) => {
    const results = retrieveLexically(testCase.question, testCase.maxRank);
    const ids = results.map((result) => result.chunk.id);
    expect(ids.some((id) => includesExpected(testCase.expectedIds, id))).toBe(true);
    expect(assessRetrieval(testCase.question, results).kind).toBe("supported");
  });

  it.each(unsupportedCases)("rejects $id as $expectedReason", (testCase) => {
    const assessment = assessRetrieval(testCase.question);
    expect(assessment.kind).toBe("unsupported");
    if (assessment.kind === "unsupported") expect(assessment.reason).toBe(testCase.expectedReason);
  });

  it("keeps every required evaluation category represented", () => {
    expect(new Set(ragEvalCases.map((testCase) => testCase.category))).toEqual(new Set([
      "supported-question",
      "paraphrase",
      "spelling",
      "unsupported-claim",
      "privacy",
      "prompt-injection",
    ]));
  });
});
