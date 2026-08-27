"use client";

import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";
import { useEffect, useRef } from "react";

import type { TermLine } from "@/lib/terminal";

import { AustraliaMap } from "./AustraliaMap";
import styles from "./gareth64.module.css";

interface TerminalProps {
  readonly lines: TermLine[];
  readonly input: string;
  readonly showInput: boolean;
  readonly busy: boolean;
  readonly searching: string | null;
  readonly inputRef: RefObject<HTMLInputElement | null>;
  readonly onInputChange: (value: string) => void;
  readonly onSubmit: () => void;
  readonly onHistory: (direction: 1 | -1) => void;
  readonly onCommandClick: (command: string) => void;
  readonly onEvidenceClick: (anchor: string) => void;
  readonly onFocusRequest: () => void;
}

function Line({ line, onCommandClick, onEvidenceClick }: {
  readonly line: TermLine;
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
  searching,
  inputRef,
  onInputChange,
  onSubmit,
  onHistory,
  onCommandClick,
  onEvidenceClick,
  onFocusRequest,
}: TerminalProps) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [lines, input, searching]);

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
    <div className={styles.paper} onClick={onFocusRequest} role="presentation">
      <div className={styles.log} ref={logRef} role="log" aria-live="polite" aria-label="Gareth64 terminal output">
        {lines.map((line, index) => (
          <Line line={line} onCommandClick={onCommandClick} onEvidenceClick={onEvidenceClick} key={index} />
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
        aria-label="Gareth64 terminal — type a command such as HELP or DIR"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        maxLength={400}
        enterKeyHint="send"
      />
    </div>
  );
}
