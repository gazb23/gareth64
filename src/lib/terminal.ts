export type TermTone = "normal" | "dim" | "bright" | "error" | "system";

export type TermLine =
  | { readonly kind: "text"; readonly text: string; readonly tone?: TermTone }
  | { readonly kind: "link"; readonly text: string; readonly href: string; readonly hint?: string }
  | { readonly kind: "command"; readonly text: string; readonly command: string }
  | { readonly kind: "evidence"; readonly text: string; readonly anchor: string; readonly hint?: string }
  | { readonly kind: "echo"; readonly text: string }
  | { readonly kind: "map" }
  | { readonly kind: "gap" };

export const text = (value: string, tone: TermTone = "normal"): TermLine => ({ kind: "text", text: value, tone });
export const link = (value: string, href: string, hint?: string): TermLine => ({ kind: "link", text: value, href, hint });
export const command = (value: string, run: string): TermLine => ({ kind: "command", text: value, command: run });
export const evidence = (value: string, anchor: string, hint?: string): TermLine => ({ kind: "evidence", text: value, anchor, hint });
export const map = (): TermLine => ({ kind: "map" });
export const echo = (value: string): TermLine => ({ kind: "echo", text: value });
export const gap = (): TermLine => ({ kind: "gap" });

/** Pepto palette — the canonical C64 colours. Index matches POKE values 0-15. */
export const C64_PALETTE = [
  "#000000", "#ffffff", "#68372b", "#70a4b2",
  "#6f3d86", "#588d43", "#352879", "#b8c76f",
  "#6f4f25", "#433900", "#9a6759", "#444444",
  "#6c6c6c", "#9ad284", "#6c5eb5", "#959595",
] as const;

export const C64_PAPER = C64_PALETTE[6];
export const C64_BORDER = C64_PALETTE[14];
