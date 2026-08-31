import { z } from "zod";

export const askRequestSchema = z.object({
  question: z.string().trim().min(2).max(400),
  company: z.string().max(0).optional(),
}).strict();

export type AskRequest = z.infer<typeof askRequestSchema>;

export const sourceCardSchema = z.object({
  id: z.string().startsWith("kb-"),
  title: z.string(),
  text: z.string(),
  canonicalUrl: z.string().url(),
});

export const askStreamEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("sources"),
    status: z.enum(["grounded", "unsupported", "local-fallback"]),
    sources: z.array(sourceCardSchema).max(6),
    followUps: z.array(z.string()).max(3),
  }),
  z.object({ type: z.literal("text"), delta: z.string() }),
  z.object({ type: z.literal("done"), citationIds: z.array(z.string().startsWith("kb-")).max(6) }),
  z.object({ type: z.literal("error"), message: z.string(), fallback: z.string() }),
]);

export type AskStreamEvent = z.infer<typeof askStreamEventSchema>;
