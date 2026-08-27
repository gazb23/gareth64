import { askStreamEventSchema, type AskStreamEvent } from "@/lib/ask-schema";

export type AskSources = Extract<AskStreamEvent, { type: "sources" }>;

export interface AskHandlers {
  readonly onText: (delta: string) => void;
  readonly onSources: (event: AskSources) => void;
  readonly onError: (message: string, fallback: string) => void;
}

export async function askGareth(question: string, handlers: AskHandlers): Promise<void> {
  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, company: "" }),
    });
    if (!response.ok || !response.body) {
      const payload = await response.json().catch(() => ({ error: "AI CHANNEL OFFLINE" }));
      const message = typeof payload.error === "string" ? payload.error : "AI CHANNEL OFFLINE";
      handlers.onError(message, "THE LOCAL EVIDENCE INDEX IS STILL AVAILABLE — TRY A STARTER QUESTION.");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value: bytes, done } = await reader.read();
      buffer += decoder.decode(bytes, { stream: !done });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.trim()) continue;
        const parsed = askStreamEventSchema.safeParse(JSON.parse(line));
        if (!parsed.success) continue;
        const event = parsed.data;
        if (event.type === "sources") handlers.onSources(event);
        if (event.type === "text") handlers.onText(event.delta);
        if (event.type === "error") handlers.onError(event.message, event.fallback);
      }
      if (done) break;
    }
  } catch {
    handlers.onError("AI CHANNEL OFFLINE — SEARCHING LOCAL DISK", "TRY ONE OF THE STARTER QUESTIONS — THE LOCAL EVIDENCE INDEX IS STILL AVAILABLE.");
  }
}
