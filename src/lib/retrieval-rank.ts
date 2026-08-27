import { knowledgeRegistry, type KnowledgeChunkId } from "@/content/knowledge";
import vectors from "@/content/knowledge-vectors.json";

import { retrieveLexically, type RetrievalResult } from "./retrieval-local";

function dotProduct(left: readonly number[], right: readonly number[]): number {
  if (left.length !== right.length || left.length === 0) return 0;
  let sum = 0;
  for (let index = 0; index < left.length; index += 1) sum += (left[index] ?? 0) * (right[index] ?? 0);
  return sum;
}

function vectorRecord(id: KnowledgeChunkId): readonly number[] | null {
  return (vectors.records as Record<string, readonly number[]>)[id] ?? null;
}

export function rankHybrid(question: string, queryEmbedding: readonly number[], limit = 6): readonly RetrievalResult[] {
  const lexical = retrieveLexically(question, knowledgeRegistry.length);
  const lexicalById = new Map(lexical.map((result) => [result.chunk.id, result.lexicalScore] as const));

  return knowledgeRegistry
    .map((item) => {
      const lexicalScore = lexicalById.get(item.id) ?? 0;
      const itemVector = vectorRecord(item.id);
      const semanticScore = itemVector ? dotProduct(queryEmbedding, itemVector) : null;
      const normalizedLexical = Math.min(lexicalScore / 12, 1);
      const score = semanticScore === null
        ? normalizedLexical
        : (semanticScore * 0.45) + (normalizedLexical * 0.55);
      return { chunk: item, lexicalScore, semanticScore, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

