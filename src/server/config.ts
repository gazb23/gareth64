import "server-only";

import { z } from "zod";

const serverConfigSchema = z.object({
  OPENROUTER_API_KEY: z.string().min(20),
  OPENROUTER_CHAT_MODEL: z.string().min(3).default("deepseek/deepseek-v4-flash-0731"),
  OPENROUTER_EMBEDDING_MODEL: z.string().min(3).default("perplexity/pplx-embed-v1-0.6b"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://gareth64.vercel.app"),
});

export type ServerConfig = z.infer<typeof serverConfigSchema>;

export function getServerConfig(): ServerConfig {
  return serverConfigSchema.parse(process.env);
}

