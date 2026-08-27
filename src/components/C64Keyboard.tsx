"use client";

import type { PointerEvent as ReactPointerEvent } from "react";

import styles from "./gareth64.module.css";

export interface KeyDef {
  readonly id: string;
  readonly label: string;
  readonly sub?: string;
  readonly code?: string;
  readonly span?: number;
  readonly insert?: string;
  readonly action?: "backspace" | "enter" | "clear" | "break" | "noop";
  readonly command?: string;
}

const k = (def: KeyDef): KeyDef => def;

export const KEYBOARD_ROWS: readonly (readonly KeyDef[])[] = [
  [
    k({ id: "arrowleft", label: "←", code: "Backquote", action: "noop" }),
    ...(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] as const).map((digit, i) =>
      k({ id: `digit${digit}`, label: digit, sub: ["!", '"', "#", "$", "%", "&", "'", "(", ")", ""][i], code: `Digit${digit}`, insert: digit }),
    ),
    k({ id: "plus", label: "+", code: "Minus", insert: "+" }),
    k({ id: "minus", label: "-", code: "Equal", insert: "-" }),
    k({ id: "pound", label: "£", code: "Backslash", insert: "£" }),
    k({ id: "home", label: "HOME", sub: "CLR", code: "Home", action: "clear", span: 1.25 }),
    k({ id: "del", label: "DEL", sub: "INST", code: "Backspace", action: "backspace", span: 1.25 }),
  ],
  [
    k({ id: "ctrl", label: "CTRL", code: "ControlLeft", action: "noop", span: 1.5 }),
    ...(["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"] as const).map((letter) =>
      k({ id: `key${letter}`, label: letter, code: `Key${letter}`, insert: letter }),
    ),
    k({ id: "at", label: "@", code: "BracketLeft", insert: "@" }),
    k({ id: "star", label: "*", code: "BracketRight", insert: "*" }),
    k({ id: "uparrow", label: "↑", sub: "π", code: "Semicolon", insert: "↑" }),
    k({ id: "restore", label: "RESTORE", code: "Quote", action: "noop", span: 2 }),
  ],
  [
    k({ id: "runstop", label: "STOP", sub: "RUN", code: "Escape", action: "break", span: 1.25 }),
    k({ id: "shiftlock", label: "SHIFT", sub: "LOCK", code: "CapsLock", action: "noop", span: 1.25 }),
    ...(["A", "S", "D", "F", "G", "H", "J", "K", "L"] as const).map((letter) =>
      k({ id: `key${letter}`, label: letter, code: `Key${letter}`, insert: letter }),
    ),
    k({ id: "colon", label: ":", sub: "[", insert: ":" }),
    k({ id: "semicolon", label: ";", sub: "]", insert: ";" }),
    k({ id: "equals", label: "=", insert: "=" }),
    k({ id: "return", label: "RETURN", code: "Enter", action: "enter", span: 2 }),
  ],
  [
    k({ id: "commodore", label: "C=", code: "AltLeft", action: "noop", span: 1.3 }),
    k({ id: "shiftl", label: "SHIFT", code: "ShiftLeft", action: "noop", span: 1.6 }),
    ...(["Z", "X", "C", "V", "B", "N", "M"] as const).map((letter) =>
      k({ id: `key${letter}`, label: letter, code: `Key${letter}`, insert: letter }),
    ),
    k({ id: "comma", label: ",", sub: "<", code: "Comma", insert: "," }),
    k({ id: "period", label: ".", sub: ">", code: "Period", insert: "." }),
    k({ id: "slash", label: "/", sub: "?", code: "Slash", insert: "/" }),
    k({ id: "shiftr", label: "SHIFT", code: "ShiftRight", action: "noop", span: 1.6 }),
    k({ id: "crsrud", label: "CRSR", sub: "↑ ↓", code: "ArrowUp", action: "noop" }),
    k({ id: "crsrlr", label: "CRSR", sub: "← →", code: "ArrowLeft", action: "noop" }),
  ],
];

export const SPACE_KEY: KeyDef = k({ id: "space", label: "", code: "Space", insert: " " });

export const FUNCTION_KEYS: readonly KeyDef[] = [
  k({ id: "f1", label: "f1", sub: "f2", code: "F1", command: "DIR" }),
  k({ id: "f3", label: "f3", sub: "f4", code: "F3", command: 'LOAD "GARETH",1' }),
  k({ id: "f5", label: "f5", sub: "f6", code: "F5", command: "RUN" }),
  k({ id: "f7", label: "f7", sub: "f8", code: "F7", command: "HELP" }),
];

interface C64KeyboardProps {
  readonly pressedId: string | null;
  readonly onKey: (def: KeyDef) => void;
}

function Key({ def, pressed, onKey }: { readonly def: KeyDef; readonly pressed: boolean; readonly onKey: (def: KeyDef) => void }) {
  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    onKey(def);
  }
  const fn = def.id.startsWith("f");
  return (
    <button
      type="button"
      tabIndex={-1}
      className={`${styles.key} ${pressed ? styles.keyPressed : ""} ${def.id === "space" ? styles.keySpace : ""} ${fn ? styles.keyFn : ""}`}
      style={{ flexGrow: def.span ?? 1, flexBasis: 0 }}
      onPointerDown={handlePointerDown}
      aria-label={def.label ? `Key ${def.label}` : "Space bar"}
    >
      {def.sub ? <span className={styles.keySub}>{def.sub}</span> : <span className={styles.keySub} aria-hidden="true" />}
      <span className={styles.keyLabel}>{def.label}</span>
    </button>
  );
}

export function C64Keyboard({ pressedId, onKey }: C64KeyboardProps) {
  return (
    <div className={styles.keysWrap}>
      <div className={styles.keyCluster}>
        <div className={styles.keyMain}>
          <div className={styles.keyRows}>
            {KEYBOARD_ROWS.map((row, index) => (
              <div className={styles.keyRow} key={index}>
                {row.map((def) => (
                  <Key def={def} pressed={pressedId === def.id} onKey={onKey} key={def.id} />
                ))}
              </div>
            ))}
          </div>
          <div className={styles.fnCol}>
            {FUNCTION_KEYS.map((def) => (
              <Key def={def} pressed={pressedId === def.id} onKey={onKey} key={def.id} />
            ))}
          </div>
        </div>
        <div className={styles.spaceRow}>
          <span className={styles.spacePad} aria-hidden="true" />
          <Key def={SPACE_KEY} pressed={pressedId === SPACE_KEY.id} onKey={onKey} />
          <span className={styles.spacePad} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
