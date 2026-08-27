import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { getServerConfig } from "./config";

export function getOpenRouter() {
  const config = getServerConfig();
  return createOpenRouter({
    apiKey: config.OPENROUTER_API_KEY,
    appName: "Gareth64",
    appUrl: config.NEXT_PUBLIC_SITE_URL,
    compatibility: "strict",
  });
}

