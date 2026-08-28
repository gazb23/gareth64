import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { embedMany } from "ai";

import { knowledgeRegistry } from "../src/content/knowledge";

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is required. Run with environment variables loaded.");
  }

  const model = process.env.OPENROUTER_EMBEDDING_MODEL ?? "perplexity/pplx-embed-v1-0.6b";
  const openrouter = createOpenRouter({
    apiKey,
    appName: "Gareth64 knowledge build",
    appUrl: "https://garethbeall.com",
    compatibility: "strict",
  });

  const values = knowledgeRegistry.map(
    (item) => `${item.title}\nTopic: ${item.topic}\nAliases: ${item.aliases.join(", ")}\n${item.text}`,
  );

  const { embeddings } = await embedMany({
    model: openrouter.textEmbeddingModel(model),
    values,
    maxParallelCalls: 2,
  });

  if (embeddings.length !== knowledgeRegistry.length || !embeddings[0]?.length) {
    throw new Error("Embedding response did not match the knowledge registry.");
  }

  const records = Object.fromEntries(
    knowledgeRegistry.map((item, index) => [item.id, embeddings[index]]),
  );

  await writeFile(
    resolve("src/content/knowledge-vectors.json"),
    `${JSON.stringify({ model, dimensions: embeddings[0].length, records })}\n`,
    "utf8",
  );

  console.log(`Embedded ${knowledgeRegistry.length} chunks with ${model} (${embeddings[0].length} dimensions).`);
}

void main();
