import { tapes, type TapeId } from "@/content/tapes";
import { resolveView, type ViewTarget } from "@/content/views";

import type { MachineEvent, MachineState } from "./machine";
import { directoryLines, helpLines, listingLines, programLines } from "./programs";
import { gap, text, type TermLine } from "./terminal";

export type BasicEffect =
  | { readonly type: "clear" }
  | { readonly type: "ask"; readonly question: string }
  | { readonly type: "poke"; readonly register: 53280 | 53281; readonly value: number }
  | { readonly type: "reset" }
  | { readonly type: "view"; readonly view: ViewTarget };

export interface BasicResult {
  readonly lines: TermLine[];
  readonly events: MachineEvent[];
  readonly effect?: BasicEffect;
}

export interface BasicContext {
  readonly state: Exclude<MachineState, { kind: "quick-view" }>;
}

const ready: TermLine = text("READY.");
const syntaxError: TermLine = text("?SYNTAX ERROR", "error");

const withReady = (lines: TermLine[]): TermLine[] => [...lines, gap(), ready];

export function resolveTape(query: string): TapeId | null {
  const q = query.trim().toLowerCase().replace(/^["']|["']$/g, "");
  if (!q) return null;
  const numeric = /^\d{1,2}$/.test(q) ? String(Number(q)) : null;
  const match =
    tapes.find((tape) => tape.id === q) ??
    tapes.find((tape) => tape.label.toLowerCase() === q) ??
    (numeric ? tapes.find((tape) => String(Number(tape.number)) === numeric) : undefined) ??
    tapes.find((tape) => tape.label.toLowerCase().replace(/\s+/g, "-") === q) ??
    tapes.find((tape) => tape.label.toLowerCase().includes(q));
  return match?.id ?? null;
}

function mazeLines(): TermLine[] {
  const rows: TermLine[] = [];
  for (let row = 0; row < 7; row += 1) {
    let line = "";
    for (let col = 0; col < 46; col += 1) line += Math.random() < 0.5 ? "/" : "\\";
    rows.push(text(line, "dim"));
  }
  return rows;
}

function loadEvents(tape: TapeId, state: BasicContext["state"]): MachineEvent[] {
  const events: MachineEvent[] = [];
  if (state.kind === "error") events.push({ type: "RECOVER" });
  if (state.kind === "program" || state.kind === "error") events.push({ type: "EJECT" });
  events.push({ type: "SELECT_TAPE", tape }, { type: "LOAD_TAPE" });
  return events;
}

function askQuestion(question: string, state: BasicContext["state"]): BasicResult {
  if (state.kind !== "ready" && state.kind !== "program") {
    return { lines: withReady([text("PLEASE WAIT UNTIL THE COMPUTER IS READY.", "dim")]), events: [] };
  }
  if (question.length < 2 || question.length > 400) {
    return { lines: withReady([text("ASK ABOUT GARETH IN 2–400 CHARACTERS.", "dim")]), events: [] };
  }
  return { lines: [], events: [], effect: { type: "ask", question } };
}

export function runCommand(raw: string, ctx: BasicContext): BasicResult {
  const input = raw.trim();
  const { state } = ctx;
  if (!input) return { lines: [], events: [] };

  const upper = input.toUpperCase();

  if (upper === "HELP" || upper === "?") {
    return { lines: withReady(helpLines()), events: [] };
  }

  if (upper === "DIR" || upper === "DIRECTORY" || upper === "CATALOG" || /^LOAD\s*"\$"/.test(upper)) {
    return { lines: withReady(directoryLines()), events: [] };
  }

  if (upper === "LIST") {
    const tape =
      state.kind === "program" || state.kind === "streaming"
        ? state.tape
        : state.kind === "ready"
          ? state.selectedTape
          : null;
    if (!tape) return { lines: [ready], events: [] };
    return { lines: withReady(listingLines(tape)), events: [] };
  }

  const loadMatch = /^LOAD\s+"?([^",]+?)"?\s*(?:,\s*\d+\s*)?(?:,\s*\d+\s*)?$/i.exec(input);
  if (loadMatch?.[1]) {
    if (state.kind === "off" || state.kind === "powering-on" || state.kind === "booting") {
      return { lines: [text("?DEVICE NOT READY ERROR", "error"), gap(), ready], events: [] };
    }
    if (state.kind === "loading" || state.kind === "streaming") {
      return { lines: [text("?DEVICE BUSY ERROR", "error"), gap(), ready], events: [] };
    }
    const tape = resolveTape(loadMatch[1]);
    if (!tape) {
      return {
        lines: [text(`?FILE NOT FOUND ERROR — "${loadMatch[1].toUpperCase()}"`, "error"), text("TYPE DIR FOR THE TAPE DIRECTORY.", "dim"), gap(), ready],
        events: [],
      };
    }
    return { lines: [], events: loadEvents(tape, state) };
  }

  if (upper === "RUN") {
    if (state.kind === "program") return { lines: withReady(programLines(state.tape)), events: [] };
    if (state.kind === "ready" && state.selectedTape) return { lines: [], events: [{ type: "LOAD_TAPE" }] };
    return {
      lines: [text("?RUN ERROR — NOTHING LOADED", "error"), text("TYPE DIR, THEN LOAD \"NAME\",1.", "dim"), gap(), ready],
      events: [],
    };
  }

  const askMatch = /^ASK\s+"?(.+?)"?\s*$/i.exec(input);
  if (askMatch?.[1]) {
    return askQuestion(askMatch[1].trim(), state);
  }

  const viewMatch = /^VIEW\s+"?(.+?)"?\s*$/i.exec(input);
  if (viewMatch?.[1]) {
    if (state.kind === "off" || state.kind === "powering-on" || state.kind === "booting") {
      return { lines: [text("?DEVICE NOT READY ERROR", "error"), gap(), ready], events: [] };
    }
    if (state.kind === "loading" || state.kind === "streaming") {
      return { lines: [text("?DEVICE BUSY ERROR", "error"), gap(), ready], events: [] };
    }
    const view = resolveView(viewMatch[1]);
    if (!view) {
      return {
        lines: [text(`?REMOTE HOST NOT FOUND — "${viewMatch[1].toUpperCase()}"`, "error"), gap(), ready],
        events: [],
      };
    }
    return { lines: [], events: [], effect: { type: "view", view } };
  }

  if (upper === "RESUME" || upper === "RÉSUMÉ" || upper === "CV") {
    return { lines: [], events: [{ type: "OPEN_QUICK_VIEW" }] };
  }

  if (upper === "EJECT") {
    if (state.kind === "program" || (state.kind === "ready" && state.selectedTape)) {
      return { lines: [], events: [{ type: "EJECT" }] };
    }
    return { lines: [text("DECK IS ALREADY EMPTY.", "dim"), gap(), ready], events: [] };
  }

  if (upper === "CLEAR" || upper === "CLR") {
    return { lines: [], events: [], effect: { type: "clear" } };
  }

  const pokeMatch = /^POKE\s+(53280|53281)\s*,\s*(\d+)$/.exec(upper);
  if (pokeMatch?.[1] && pokeMatch[2]) {
    const value = Number(pokeMatch[2]);
    if (value < 0 || value > 15) {
      return { lines: [text("?ILLEGAL QUANTITY ERROR — N MUST BE 0-15", "error"), gap(), ready], events: [] };
    }
    return {
      lines: [ready],
      events: [],
      effect: { type: "poke", register: Number(pokeMatch[1]) as 53280 | 53281, value },
    };
  }

  if (/^SYS\s+64738$/.test(upper)) return { lines: [], events: [], effect: { type: "reset" } };
  if (/^SYS\s+\d+$/.test(upper)) return { lines: [text("NOTHING HAPPENS.", "dim"), gap(), ready], events: [] };

  if (/^(HELLO|HI|HEY|YO)[!.]*$/.test(upper)) {
    return { lines: withReady([text("HELLO! ASK ME ABOUT GARETH'S WORK, SKILLS OR EXPERIENCE.", "bright")]), events: [] };
  }

  if (upper === "WHOAMI") {
    return { lines: [text("GARETH BEALL — LEAD AI/ML ENGINEER. CLINICAL PHARMACIST. SHIPS REAL THINGS.", "bright"), gap(), ready], events: [] };
  }

  if (/^\d+\s+PRINT/.test(upper)) {
    return { lines: withReady(mazeLines()), events: [] };
  }

  // Preserve errors for malformed BASIC instructions; ordinary text is a question.
  if (/^(POKE|SYS)\b/.test(upper)) return { lines: [syntaxError, gap(), ready], events: [] };
  return askQuestion(input, state);
}
