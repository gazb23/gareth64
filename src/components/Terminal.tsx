"use client";

import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from "react";
import { Fragment, useLayoutEffect, useRef } from "react";

import type { TermLine } from "@/lib/terminal";

import { AustraliaMap } from "./AustraliaMap";
import styles from "./gareth64.module.css";

interface TerminalProps {
  readonly lines: TermLine[];
  readonly input: string;
  readonly showInput: boolean;
  readonly busy: boolean;
  readonly printing: boolean;
  readonly streaming: boolean;
  readonly scrollTargetId: number | null;
  readonly searching: string | null;
  readonly inputRef: RefObject<HTMLInputElement | null>;
  readonly onInputChange: (value: string) => void;
  readonly onSubmit: () => void;
  readonly onHistory: (direction: 1 | -1) => void;
  readonly onCommandClick: (command: string) => void;
  readonly onEvidenceClick: (anchor: string) => void;
  readonly onFocusRequest: () => void;
  readonly onScrollTargetHandled: (id: number) => void;
}

type VisibleTermLine = Exclude<TermLine, { readonly kind: "scroll-anchor" }>;

function Line({ line, onCommandClick, onEvidenceClick }: {
  readonly line: VisibleTermLine;
  readonly onCommandClick: (command: string) => void;
  readonly onEvidenceClick: (anchor: string) => void;
}) {
  if (line.kind === "gap") return <div className={styles.gapLine} aria-hidden="true" />;
  if (line.kind === "map") return <AustraliaMap />;
  if (line.kind === "link") {
    const external = /^https?:/.test(line.href);
    return (
      <a
        className={styles.linkLine}
        href={line.href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        <span>{line.text}</span>
        {line.hint && <small>{line.hint}</small>}
      </a>
    );
  }
  if (line.kind === "evidence") {
    return (
      <button type="button" className={styles.linkLine} onClick={() => onEvidenceClick(line.anchor)}>
        <span>{line.text}</span>
        {line.hint && <small>{line.hint}</small>}
      </button>
    );
  }
  if (line.kind === "command") {
    return (
      <button type="button" className={styles.commandLine} onClick={() => onCommandClick(line.command)}>
        {line.text}
      </button>
    );
  }
  if (line.kind === "echo") return <p className={styles.echoLine}>{line.text}</p>;
  const tone = line.tone && line.tone !== "normal" ? styles[`tone_${line.tone}`] : "";
  return <p className={`${styles.termLine} ${tone}`}>{line.text}</p>;
}

export function Terminal({
  lines,
  input,
  showInput,
  busy,
  printing,
  streaming,
  scrollTargetId,
  searching,
  inputRef,
  onInputChange,
  onSubmit,
  onHistory,
  onCommandClick,
  onEvidenceClick,
  onFocusRequest,
  onScrollTargetHandled,
}: TerminalProps) {
  const logRef = useRef<HTMLDivElement>(null);
  const streamAnchorRef = useRef<HTMLSpanElement>(null);
  const printAnchorRef = useRef<HTMLSpanElement>(null);
  const streamStartRef = useRef<number | null>(null);
  const wasStreamingRef = useRef(false);
  const lineBeforeStream = lines[lines.length - 2];
  const streamAnchorIndex = lineBeforeStream?.kind === "echo" ? lines.length - 2 : lines.length - 1;

  useLayoutEffect(() => {
    const log = logRef.current;
    if (!log) return;

    if (streaming) {
      const anchor = streamAnchorRef.current;
      if (anchor) {
        const logTop = log.getBoundingClientRect().top;
        const anchorTop = anchor.getBoundingClientRect().top;
        const paddingTop = Number.parseFloat(window.getComputedStyle(log).paddingTop);
        streamStartRef.current = log.scrollTop + anchorTop - logTop - paddingTop;
      }
      log.scrollTop = log.scrollHeight;
    } else if (wasStreamingRef.current && streamStartRef.current !== null) {
      log.scrollTop = Math.max(0, streamStartRef.current);
      streamStartRef.current = null;
    } else {
      log.scrollTop = log.scrollHeight;
    }

    wasStreamingRef.current = streaming;
  }, [lines, input, searching, streaming]);

  useLayoutEffect(() => {
    if (printing || scrollTargetId === null) return;
    const log = logRef.current;
    const anchor = printAnchorRef.current;
    if (!log || !anchor) return;
    const logTop = log.getBoundingClientRect().top;
    const anchorTop = anchor.getBoundingClientRect().top;
    const paddingTop = Number.parseFloat(window.getComputedStyle(log).paddingTop);
    log.scrollTop = Math.max(0, log.scrollTop + anchorTop - logTop - paddingTop);
    onScrollTargetHandled(scrollTargetId);
  }, [printing, scrollTargetId, onScrollTargetHandled]);

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    if (event.target instanceof Element && event.target.closest("a, button")) return;
    onFocusRequest();
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      onHistory(-1);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      onHistory(1);
    }
  }

  return (
    <div className={styles.paper} onPointerUp={handlePointerUp} role="presentation">
      <div className={styles.log} ref={logRef} role="log" aria-live="polite" aria-label="Gareth64 terminal output">
        {lines.map((line, index) => (
          <Fragment key={index}>
            {streaming && index === streamAnchorIndex ? (
              <span ref={streamAnchorRef} className={styles.streamAnchor} data-stream-anchor aria-hidden="true" />
            ) : null}
            {line.kind === "scroll-anchor" ? (
              <span
                ref={line.id === scrollTargetId ? printAnchorRef : undefined}
                className={styles.printAnchor}
                data-print-anchor={line.id}
                aria-hidden="true"
              />
            ) : (
              <Line line={line} onCommandClick={onCommandClick} onEvidenceClick={onEvidenceClick} />
            )}
          </Fragment>
        ))}
        {searching && (
          <p className={styles.searchStatus}>
            <span className={styles.searchBlocks} aria-hidden="true" />
            {searching}
            <span className={styles.searchDots} aria-hidden="true" />
          </p>
        )}
        {showInput && (
          <div className={styles.inputLine}>
            <span className={styles.inputText}>{input}</span>
            <span className={`${styles.cursor} ${busy ? styles.cursorBusy : ""}`} aria-hidden="true" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        className={styles.hiddenInput}
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Gareth64 terminal. Type a command such as HELP or DIR"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        maxLength={400}
        enterKeyHint="send"
        inputMode="none"
      />
    </div>
  );
}
