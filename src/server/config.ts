import "server-only";

import { z } from "zod";

const serverConfigSchema = z.object({
  OPENROUTER_API_KEY: z.string().min(20),
  OPENROUTER_CHAT_MODEL: z.string().min(3).default("openai/gpt-oss-120b:nitro"),
  OPENROUTER_EMBEDDING_MODEL: z.string().min(3).default("perplexity/pplx-embed-v1-0.6b"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://garethbeall.com"),
});

export type ServerConfig = z.infer<typeof serverConfigSchema>;

export function getServerConfig(): ServerConfig {
  return serverConfigSchema.parse(process.env);
}
