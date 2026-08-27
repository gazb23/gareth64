import { embed } from "ai";

import {
  knowledgeById,
  knowledgeRegistry,
  type KnowledgeChunkId,
} from "@/content/knowledge";
import vectors from "@/content/knowledge-vectors.json";
import { getServerConfig } from "@/server/config";
import { getOpenRouter } from "@/server/openrouter";
import { retrieveLexically, type RetrievalResult } from "./retrieval-local";
import { rankHybrid } from "./retrieval-rank";

export { retrieveLexically, type RetrievalResult } from "./retrieval-local";

export async function retrieveHybrid(question: string, limit = 6): Promise<readonly RetrievalResult[]> {
  const lexical = retrieveLexically(question, knowledgeRegistry.length);

  try {
    const config = getServerConfig();
    if (vectors.model !== config.OPENROUTER_EMBEDDING_MODEL || vectors.dimensions === 0) {
      return lexical.slice(0, limit);
    }

    const openrouter = getOpenRouter();
    const instructedQuery = `Instruct: Retrieve public résumé evidence about Gareth Beall that answers the question.\nQuery: ${question}`;
    const { embedding } = await embed({
      model: openrouter.textEmbeddingModel(config.OPENROUTER_EMBEDDING_MODEL),
      value: instructedQuery,
      abortSignal: AbortSignal.timeout(5_000),
    });

    return rankHybrid(question, embedding, limit);
  } catch {
    return lexical.slice(0, limit);
  }
}

export function allowedChunks(ids: readonly string[]) {
  return ids.flatMap((id) => {
    const chunk = knowledgeById.get(id as KnowledgeChunkId);
    return chunk ? [chunk] : [];
  });
}
