"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";

import { echo, type TermLine } from "./terminal";

const MAX_LINES = 400;
const TICK_MS = 12;
const CHARS_PER_TICK = 5;

const isTypable = (line: TermLine): line is Extract<TermLine, { kind: "text" }> => line.kind === "text";

interface BufferState {
  readonly committed: readonly TermLine[];
  readonly pending: readonly TermLine[];
  readonly printing: { readonly line: TermLine; readonly shown: number } | null;
}

type BufferAction =
  | { readonly type: "enqueue"; readonly lines: readonly TermLine[] }
  | { readonly type: "commit"; readonly lines: readonly TermLine[] }
  | { readonly type: "tick"; readonly instant: boolean }
  | { readonly type: "flush" }
  | { readonly type: "clear" };

const emptyBuffer: BufferState = { committed: [], pending: [], printing: null };

const cap = (lines: readonly TermLine[]) => lines.slice(-MAX_LINES);

function pushCommitted(state: BufferState, line: TermLine): BufferState {
  return { ...state, committed: cap([...state.committed, line]) };
}

function bufferReducer(state: BufferState, action: BufferAction): BufferState {
  if (action.type === "enqueue") {
    return action.lines.length ? { ...state, pending: [...state.pending, ...action.lines] } : state;
  }
  if (action.type === "commit") {
    return action.lines.length ? { ...state, committed: cap([...state.committed, ...action.lines]) } : state;
  }
  if (action.type === "clear") return emptyBuffer;
  if (action.type === "flush") {
    return state.printing ? { ...pushCommitted(state, state.printing.line), pending: [], printing: null } : { ...state, pending: [] };
  }
  // tick
  if (!state.printing) {
    const [next, ...rest] = state.pending;
    if (!next) return state;
    if (!isTypable(next) || action.instant) {
      return pushCommitted({ ...state, pending: rest }, next);
    }
    return { ...state, pending: rest, printing: { line: next, shown: 0 } };
  }
  if (!isTypable(state.printing.line)) return pushCommitted({ ...state, printing: null }, state.printing.line);
  const shown = state.printing.shown + CHARS_PER_TICK;
  if (shown >= state.printing.line.text.length) {
    return pushCommitted({ ...state, printing: null }, state.printing.line);
  }
  return { ...state, printing: { ...state.printing, shown } };
}

export function useTerminal({ reducedMotion }: { readonly reducedMotion: boolean }) {
  const [buffer, dispatchBuffer] = useReducer(bufferReducer, emptyBuffer);
  const [streamText, setStreamText] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  // Mirrors streamText so endStream can commit synchronously, in order, exactly once.
  const streamRef = useRef<string | null>(null);

  const engineActive = buffer.printing !== null || buffer.pending.length > 0;
  useEffect(() => {
    if (!engineActive) return;
    const id = window.setInterval(() => {
      dispatchBuffer({ type: "tick", instant: reducedMotion });
    }, reducedMotion ? 1 : TICK_MS);
    return () => window.clearInterval(id);
  }, [engineActive, reducedMotion]);

  const print = useCallback((lines: TermLine[]) => {
    dispatchBuffer({ type: "enqueue", lines });
  }, []);

  const printNow = useCallback((lines: TermLine[]) => {
    dispatchBuffer({ type: "commit", lines });
  }, []);

  const clear = useCallback(() => {
    dispatchBuffer({ type: "clear" });
    streamRef.current = null;
    setStreamText(null);
  }, []);

  const flush = useCallback(() => {
    dispatchBuffer({ type: "flush" });
  }, []);

  const commitEcho = useCallback((value: string) => {
    const clean = value.trim();
    if (clean) historyRef.current = [...historyRef.current.slice(-49), clean];
    historyIndexRef.current = -1;
    setInput("");
    dispatchBuffer({ type: "commit", lines: [echo(value)] });
  }, []);

  const historyMove = useCallback((direction: 1 | -1) => {
    const history = historyRef.current;
    if (!history.length) return;
    const current = historyIndexRef.current;
    const next = direction === -1
      ? (current === -1 ? history.length - 1 : Math.max(0, current - 1))
      : (current === -1 ? -1 : current + 1);
    if (next === -1 || next >= history.length) {
      historyIndexRef.current = -1;
      setInput("");
      return;
    }
    historyIndexRef.current = next;
    setInput(history[next] ?? "");
  }, []);

  const insert = useCallback((value: string) => {
    setInput((current) => (current + value).slice(0, 400));
  }, []);

  const backspace = useCallback(() => {
    setInput((current) => current.slice(0, -1));
  }, []);

  const beginStream = useCallback(() => {
    streamRef.current = "";
    setStreamText("");
  }, []);
  const appendStream = useCallback((delta: string) => {
    streamRef.current = (streamRef.current ?? "") + delta;
    setStreamText(streamRef.current);
  }, []);
  const endStream = useCallback(() => {
    const current = streamRef.current;
    streamRef.current = null;
    if (current) dispatchBuffer({ type: "commit", lines: [{ kind: "text", text: current, tone: "bright" }] });
    setStreamText(null);
  }, []);

  const lines = useMemo(() => {
    const visible: TermLine[] = [...buffer.committed];
    if (buffer.printing) {
      visible.push(
        isTypable(buffer.printing.line)
          ? { ...buffer.printing.line, text: buffer.printing.line.text.slice(0, buffer.printing.shown) }
          : buffer.printing.line,
      );
    }
    if (streamText !== null) visible.push({ kind: "text", text: streamText, tone: "bright" });
    return visible;
  }, [buffer, streamText]);

  return {
    lines,
    input,
    setInput,
    insert,
    backspace,
    commitEcho,
    historyMove,
    print,
    printNow,
    clear,
    flush,
    beginStream,
    appendStream,
    endStream,
    streaming: streamText !== null,
    busy: engineActive || streamText !== null,
  };
}

export type Terminal = ReturnType<typeof useTerminal>;
