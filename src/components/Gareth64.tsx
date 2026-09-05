"use client";

import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore } from "react";

import dynamic from "next/dynamic";
import Link from "next/link";

import { siteContent } from "@/content/site";
import { tapes, tapesById, type Tape, type TapeId } from "@/content/tapes";
import type { ViewTarget } from "@/content/views";
import { askGareth, type AskSources } from "@/lib/ask-client";
import { runCommand, type BasicEffect } from "@/lib/basic";
import { transition, type MachineState } from "@/lib/machine";
import { programLines, starterQuestionCommand, tapeMenuLines } from "@/lib/programs";
import { C64_PALETTE, command, evidence, gap, text, type TermLine } from "@/lib/terminal";
import { useTerminal } from "@/lib/use-terminal";

import { C64Keyboard, FUNCTION_KEYS, KEYBOARD_ROWS, SPACE_KEY, type KeyDef } from "./C64Keyboard";
import { ResumeDialog } from "./ResumeDialog";

import { ScreenViewer } from "./ScreenViewer";
import { Terminal } from "./Terminal";
import styles from "./gareth64.module.css";

const Pong = dynamic(() => import("./Pong").then((module) => module.Pong));

const initialState: MachineState = { kind: "off" };
const muteEvent = "gareth64-mute-change";

const ALL_KEYS: readonly KeyDef[] = [...KEYBOARD_ROWS.flat(), SPACE_KEY, ...FUNCTION_KEYS];
const keyByCode = new Map(ALL_KEYS.filter((def) => def.code).map((def) => [def.code as string, def]));

function subscribeToMute(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(muteEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(muteEvent, callback);
  };
}

function getMuteSnapshot() {
  try { return window.localStorage.getItem("gareth64-muted") !== "false"; } catch { return true; }
}

function usePersistentMute() {
  const muted = useSyncExternalStore(subscribeToMute, getMuteSnapshot, () => true);
  const toggle = useCallback(() => {
    try { window.localStorage.setItem("gareth64-muted", String(!getMuteSnapshot())); } catch { return; }
    window.dispatchEvent(new Event(muteEvent));
  }, []);
  return [muted, toggle] as const;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useMachineAudio(muted: boolean) {
  const contextRef = useRef<AudioContext | null>(null);

  const ensureContext = useCallback(() => {
    const AudioContextClass = window.AudioContext;
    const context = contextRef.current ?? new AudioContextClass();
    contextRef.current = context;
    if (context.state === "suspended") void context.resume();
    return context;
  }, []);

  const tone = useCallback((frequency: number, duration: number, gainValue = 0.035, endFrequency?: number) => {
    if (muted) return;
    const context = ensureContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(frequency, now);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    gain.gain.setValueAtTime(gainValue, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }, [ensureContext, muted]);

  return {
    power: () => { tone(52, 0.65, 0.08, 180); window.setTimeout(() => tone(880, 0.08, 0.025), 420); },
    click: () => tone(980, 0.018, 0.009),
    enter: () => tone(420, 0.03, 0.014),
    screech: () => {
      tone(1150, 0.3, 0.011);
      for (let i = 0; i < 9; i += 1) {
        window.setTimeout(() => tone(1600 + Math.random() * 2400, 0.07, 0.006), 330 + i * 95);
      }
    },
    ready: () => { tone(330, 0.06, 0.018); window.setTimeout(() => tone(660, 0.09, 0.018), 75); },
  };
}

function currentTape(state: MachineState): TapeId | null {
  if (state.kind === "ready") return state.selectedTape;
  if (state.kind === "loading" || state.kind === "program" || state.kind === "streaming") return state.tape;
  if (state.kind === "quick-view") return currentTape(state.returnTo);
  return null;
}

const BOOT_LINES: TermLine[] = [
  gap(),
  text("    **** GARETH64 BASIC V2 ****", "bright"),
  gap(),
  text("64K RAM SYSTEM  38911 BASIC BYTES FREE"),
  gap(),
];

const MONITOR_KNOBS = ["TINT", "COLOR", "BRIGHT", "CONT", "H.POS", "V.HOLD", "VOL"] as const;

/** Sections that exist in the quick-view résumé; anything else lands at the top. */
const QUICK_VIEW_ANCHORS = new Set(["about", "experience", "iris", "capabilities", "products", "contact"]);

function quickViewAnchor(canonicalUrl: string): string {
  const hash = canonicalUrl.split("#")[1] ?? "";
  return QUICK_VIEW_ANCHORS.has(hash) ? hash : "about";
}

const normaliseQuestion = (question: string) => question.trim().toLowerCase().replace(/[?!.]+$/, "");

/** Evidence anchor → the tape that tells the fuller story. */
const TAPE_SUGGESTIONS = [
  { anchor: "iris", label: "> LOAD THE IRIS TAPE FOR THE FULL STORY", run: 'LOAD "IRIS",1' },
  { anchor: "products", label: "> LOAD THE PRODUCTS TAPE TO SEE THEM RUN", run: 'LOAD "PRODUCTS",1' },
  { anchor: "contact", label: "> LOAD THE CONTACT TAPE", run: 'LOAD "CONTACT",1' },
] as const;

function CassetteFace({ item, spinning = false }: { readonly item: Tape; readonly spinning?: boolean }) {
  return (
    <span
      className={`${styles.cassFace} ${spinning ? styles.cassSpinning : ""}`}
      style={{ "--tape-colour": item.colour, "--tape-ink": item.ink } as CSSProperties}
    >
      <span className={styles.cassScrews} aria-hidden="true" />
      <span className={styles.cassLabel}>
        <em>{item.number}</em>
        <strong>{item.label}</strong>
        {"fictional" in item && item.fictional ? <small>GAME</small> : null}
      </span>
      <span className={styles.cassWindow} aria-hidden="true">
        <i /><i />
      </span>
      <span className={styles.cassTeeth} aria-hidden="true" />
    </span>
  );
}

export function Gareth64({ overlayQuickView }: { readonly overlayQuickView: ReactNode }) {
  const [state, dispatch] = useReducer(transition, initialState);
  const [muted, toggleMuted] = usePersistentMute();
  const reducedMotion = useReducedMotion();
  const audio = useMachineAudio(muted);
  const term = useTerminal({ reducedMotion });
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [keysVisible, setKeysVisible] = useState(true);
  const [palette, setPalette] = useState<{ readonly border?: string; readonly paper?: string }>({});
  const [counter, setCounter] = useState("000");
  const [view, setView] = useState<ViewTarget | null>(null);
  const [everLoaded, setEverLoaded] = useState(false);
  const [searching, setSearching] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typeTimerRef = useRef<number | null>(null);
  const bootedOnceRef = useRef(false);
  const prevKindRef = useRef<string>("off");
  const viewRef = useRef<ViewTarget | null>(null);
  const askedRef = useRef<Set<string>>(new Set());
  const pendingAnchorRef = useRef<string | null>(null);

  const visibleState = state.kind === "quick-view" ? state.returnTo : state;
  const tape = currentTape(state);
  const canType = visibleState.kind === "ready" || visibleState.kind === "program";
  const canLoad = canType && !term.streaming;

  const stateRef = useRef(state);
  const visibleRef = useRef(visibleState);
  const termRef = useRef(term);
  const audioRef = useRef(audio);

  const focusInput = useCallback(() => {
    if (document.querySelector("dialog[open]") || !window.matchMedia("(pointer: fine)").matches) return;
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const runAsk = useCallback(async (question: string) => {
    dispatch({ type: "ASK" });
    askedRef.current.add(normaliseQuestion(question));
    setSearching("SEARCHING KNOWLEDGE DISK");
    term.beginStream();
    const result: { sources: AskSources | null; failure: { message: string; fallback: string } | null; sawText: boolean } = {
      sources: null,
      failure: null,
      sawText: false,
    };
    await askGareth(question, {
      onText: (delta) => {
        if (!result.sawText) {
          result.sawText = true;
          setSearching(null);
        }
        term.appendStream(delta);
      },
      onSources: (event) => {
        result.sources = event;
        setSearching("EVIDENCE FOUND. WRITING ANSWER");
      },
      onError: (message, fallback) => { result.failure = { message, fallback }; },
    });
    setSearching(null);
    term.endStream();
    const out: TermLine[] = [];
    if (result.failure) out.push(text(result.failure.message, "error"), text(result.failure.fallback, "dim"));
    // The model went quiet without erroring: answer from the retrieved evidence instead.
    if (!result.failure && !result.sawText && result.sources && result.sources.sources.length > 0) {
      out.push(text("AI CHANNEL SILENT. READING FROM THE LOCAL DISK:", "dim"));
      for (const source of result.sources.sources.slice(0, 2)) out.push(text(source.text, "bright"));
    }
    if (result.sources && result.sources.sources.length > 0) {
      out.push(gap(), text("SOURCES:", "system"));
      result.sources.sources.forEach((source, index) => {
        out.push(evidence(`[${index + 1}] ${source.title.toUpperCase()}`, quickViewAnchor(source.canonicalUrl)));
      });
    }
    // When the evidence points at a tape, invite the deep dive.
    const anchors = (result.sources?.sources ?? []).map((source) => quickViewAnchor(source.canonicalUrl));
    const suggestedTape = TAPE_SUGGESTIONS.find(({ anchor }) => anchors.includes(anchor));
    const remaining = siteContent.starterQuestions
      .filter((candidate) => !askedRef.current.has(normaliseQuestion(candidate)))
      .slice(0, 3);
    out.push(gap(), text("WHAT NEXT?", "system"));
    for (const candidate of remaining.slice(0, 2)) {
      out.push(command(`? ${candidate.toUpperCase()}`, starterQuestionCommand(candidate)));
    }
    const nextTape = suggestedTape ?? TAPE_SUGGESTIONS[0];
    out.push(command(nextTape.label, nextTape.run));
    out.push(command("> VIEW RÉSUMÉ", "RESUME"));
    out.push(gap(), text("READY."));
    term.printNow(out);
    if (visibleRef.current.kind === "streaming") dispatch({ type: "ANSWER_COMPLETE" });
  }, [term]);

  const runAskRef = useRef(runAsk);

  const handleEffect = useCallback((effect: BasicEffect) => {
    if (effect.type === "clear") {
      term.clear();
      term.printNow([text("READY.")]);
      return;
    }
    if (effect.type === "poke") {
      const colour = C64_PALETTE[effect.value] ?? C64_PALETTE[14];
      setPalette((current) => ({
        ...current,
        [effect.register === 53280 ? "border" : "paper"]: colour,
      }));
      return;
    }
    if (effect.type === "reset") {
      term.clear();
      setPalette({});
      setView(null);
      if (visibleRef.current.kind === "program") dispatch({ type: "EJECT" });
      term.print([...BOOT_LINES, text("READY.")]);
      return;
    }
    if (effect.type === "view") {
      term.printNow([text(`CONNECTING TO ${effect.view.label}...`, "dim")]);
      audioRef.current.screech();
      setView(effect.view);
      return;
    }
    setEverLoaded(true);
    setView(null);
    void runAskRef.current(effect.question);
  }, [term]);

  const closeView = useCallback(() => {
    if (!viewRef.current) return;
    setView(null);
    termRef.current.printNow([text("CONNECTION CLOSED."), gap(), text("READY.")]);
    focusInput();
  }, [focusInput]);

  const execute = useCallback((raw: string) => {
    if (termRef.current.streaming) return;
    const value = raw.trim();
    term.commitEcho(raw);
    if (!value) return;
    audio.enter();
    const result = runCommand(value, { state: visibleRef.current });
    if (result.events.some((event) => event.type === "LOAD_TAPE")) {
      setEverLoaded(true);
      setView(null);
    }
    for (const event of result.events) dispatch(event);
    if (result.lines.length) term.print(result.lines);
    if (result.effect) handleEffect(result.effect);
  }, [audio, term, handleEffect]);

  const executeRef = useRef(execute);

  const typeCommand = useCallback((command: string) => {
    if (termRef.current.streaming) return;
    if (typeTimerRef.current) window.clearInterval(typeTimerRef.current);
    focusInput();
    term.setInput("");
    let index = 0;
    typeTimerRef.current = window.setInterval(() => {
      index += 1;
      term.setInput(command.slice(0, index));
      if (index >= command.length) {
        if (typeTimerRef.current) window.clearInterval(typeTimerRef.current);
        typeTimerRef.current = null;
        executeRef.current(command);
      }
    }, reducedMotion ? 6 : 34);
  }, [focusInput, term, reducedMotion]);

  const typeCommandRef = useRef(typeCommand);

  // Latest-value mirrors, refreshed after every commit before any handler runs.
  useEffect(() => {
    stateRef.current = state;
    visibleRef.current = visibleState;
    termRef.current = term;
    audioRef.current = audio;
    executeRef.current = execute;
    typeCommandRef.current = typeCommand;
    runAskRef.current = runAsk;
    viewRef.current = view;
  });

  const power = useCallback(() => {
    const current = visibleRef.current.kind;
    if (current === "powering-on" || current === "booting") return;
    if (current === "off") {
      termRef.current.clear();
      setPalette({});
      audioRef.current.power();
    } else {
      setView(null);
    }
    dispatch({ type: "POWER" });
  }, []);

  const openEvidence = useCallback((anchor: string) => {
    pendingAnchorRef.current = anchor;
    dispatch({ type: "OPEN_QUICK_VIEW" });
  }, []);

  const breakIn = useCallback(() => {
    if (typeTimerRef.current) {
      window.clearInterval(typeTimerRef.current);
      typeTimerRef.current = null;
    }
    if (visibleRef.current.kind === "booting") {
      dispatch({ type: "SKIP_BOOT" });
      return;
    }
    termRef.current.flush();
    termRef.current.printNow([text("BREAK."), gap(), text("READY.")]);
  }, []);

  const handleKeyDef = useCallback((def: KeyDef) => {
    const kind = visibleRef.current.kind;
    const playing = visibleRef.current.kind === "program" && visibleRef.current.tape === "pong";
    if (kind === "off" || kind === "powering-on") return;
    audioRef.current.click();
    if (playing) {
      if (def.action === "break") executeRef.current("EJECT");
      return;
    }
    focusInput();
    if (def.command) {
      if (kind === "ready" || kind === "program") typeCommandRef.current(def.command);
      return;
    }
    if (def.action === "backspace") { termRef.current.backspace(); return; }
    if (def.action === "enter") {
      if (kind === "ready" || kind === "program") executeRef.current(termRef.current.input);
      return;
    }
    if (def.action === "clear") { executeRef.current("CLEAR"); return; }
    if (def.action === "break") { breakIn(); return; }
    if (def.action === "noop") return;
    if (def.insert && (kind === "ready" || kind === "program")) termRef.current.insert(def.insert);
  }, [focusInput, breakIn]);

  // First boot: switch the machine on shortly after arrival.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (visibleRef.current.kind === "off") {
        termRef.current.clear();
        setPalette({});
        dispatch({ type: "POWER" });
      }
    }, reducedMotion ? 120 : 750);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Power-on flash, then boot.
  useEffect(() => {
    if (visibleState.kind !== "powering-on") return;
    const timer = window.setTimeout(() => dispatch({ type: "POWERED" }), reducedMotion ? 40 : 620);
    return () => window.clearTimeout(timer);
  }, [visibleState.kind, reducedMotion]);

  // Boot banner, then ready.
  useEffect(() => {
    if (visibleState.kind !== "booting") return;
    termRef.current.print(BOOT_LINES);
    const timer = window.setTimeout(() => dispatch({ type: "BOOT_COMPLETE" }), reducedMotion ? 120 : 1750);
    return () => window.clearTimeout(timer);
  }, [visibleState.kind, reducedMotion]);

  // Arriving at ready: greet once after boot, note ejects.
  useEffect(() => {
    if (visibleState.kind !== "ready") return;
    const prev = prevKindRef.current;
    if (prev === "booting" || prev === "powering-on" || prev === "off") {
      if (!bootedOnceRef.current) {
        termRef.current.printNow([
          ...tapeMenuLines(),
          gap(),
          text("TYPE HELP FOR COMMANDS. F1 SHOWS THE TAPE DIRECTORY.", "dim"),
          gap(),
          text("READY."),
        ]);
        bootedOnceRef.current = true;
      } else {
        termRef.current.printNow([text("READY.")]);
      }
      return;
    }
    if (prev === "program" || prev === "error") {
      termRef.current.printNow([gap(), text("TAPE EJECTED."), gap(), text("READY.")]);
      return;
    }
    termRef.current.printNow([text("READY.")]);
  }, [visibleState.kind, focusInput]);

  // Quick view opened from an evidence card: jump to the cited section.
  useEffect(() => {
    if (state.kind !== "quick-view") return;
    const anchor = pendingAnchorRef.current;
    pendingAnchorRef.current = null;
    if (!anchor) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state.kind, reducedMotion]);

  // Tape loading: screech, counter, border stripes (via .tubeLoading), then run.
  useEffect(() => {
    if (visibleState.kind !== "loading") return;
    const label = tapesById.get(visibleState.tape)?.label ?? visibleState.tape;
    audioRef.current.screech();
    termRef.current.print([
      text("PRESS PLAY ON TAPE"),
      text("OK"),
      text("SEARCHING"),
      text(`FOUND ${label}`),
      text("LOADING"),
    ]);
    const started = Date.now();
    const counterId = window.setInterval(() => {
      setCounter(String(Math.min(999, Math.floor((Date.now() - started) / 24))).padStart(3, "0"));
    }, 90);
    const timer = window.setTimeout(() => {
      dispatch({ type: "LOAD_COMPLETE" });
      audioRef.current.ready();
    }, reducedMotion ? 120 : 2000);
    return () => {
      window.clearInterval(counterId);
      window.clearTimeout(timer);
      setCounter("000");
    };
  }, [visibleState, reducedMotion]);

  // Program start (from a fresh load only): READY. RUN, then the listing.
  useEffect(() => {
    if (visibleState.kind !== "program" || prevKindRef.current !== "loading") return;
    termRef.current.clear();
    termRef.current.printFromStart(programLines(visibleState.tape));
  }, [visibleState]);

  // Tracks the previous machine kind so the effects above can tell arrivals apart.
  useEffect(() => {
    prevKindRef.current = visibleState.kind;
  }, [visibleState.kind]);

  // Physical keyboard: highlight keys, click sounds, route typing to the terminal.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (stateRef.current.kind === "quick-view") {
        if (event.key === "Escape") dispatch({ type: "CLOSE_QUICK_VIEW" });
        return;
      }
      if (viewRef.current) {
        if (event.key === "Escape") {
          event.preventDefault();
          closeView();
        }
        return;
      }
      const typingInTerminal = event.target === inputRef.current;
      if (!typingInTerminal && event.key !== "Escape" && event.target instanceof Element && event.target.closest("a, button, input, textarea, select, [contenteditable=\"true\"]")) return;
      const kind = visibleRef.current.kind;
      if (kind === "off") {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          power();
        }
        return;
      }
      if (event.key === "Escape") {
        if (visibleRef.current.kind === "program" && visibleRef.current.tape === "pong") {
          event.preventDefault();
          executeRef.current("EJECT");
        } else {
          breakIn();
        }
        return;
      }
      const playing = visibleRef.current.kind === "program" && visibleRef.current.tape === "pong";
      const def = keyByCode.get(event.code);
      if (def) {
        setPressedKey(def.id);
        if (!event.repeat) audioRef.current.click();
      }
      if (playing || event.metaKey || event.ctrlKey || event.altKey) return;
      const typingHere = document.activeElement === inputRef.current;
      const typeable = kind === "ready" || kind === "program";
      if (def?.command && typeable) {
        event.preventDefault();
        typeCommandRef.current(def.command);
        return;
      }
      if (typingHere || !typeable) return;
      if (event.key === "Enter") {
        event.preventDefault();
        executeRef.current(termRef.current.input);
      } else if (event.key === "Backspace") {
        termRef.current.backspace();
      } else if (event.key.length === 1) {
        termRef.current.insert(event.key.toUpperCase());
      }
    }
    function handleKeyUp() {
      setPressedKey(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [breakIn, power, closeView]);

  useEffect(() => () => {
    if (typeTimerRef.current) window.clearInterval(typeTimerRef.current);
  }, []);

  const paletteStyle = {
    ...(palette.border ? { "--c64-border": palette.border } : {}),
    ...(palette.paper ? { "--c64-paper": palette.paper } : {}),
  } as CSSProperties;

  const screenOn = visibleState.kind !== "off" && visibleState.kind !== "powering-on";
  const loading = visibleState.kind === "loading";
  const playingPong = visibleState.kind === "program" && visibleState.tape === "pong";
  const inserted = tape ? tapesById.get(tape) : undefined;
  const deckLabel = inserted ? `${inserted.label} IN DECK` : "DECK EMPTY";
  const canTypeNow = canType && !playingPong;

  const closeResume = useCallback(() => dispatch({ type: "CLOSE_QUICK_VIEW" }), []);

  return (
    <main id="main-content" className={styles.experience} style={paletteStyle}>
      <section className={`${styles.scene} ${keysVisible ? styles.keysVisible : ""}`} aria-label="Interactive Gareth64 résumé computer">
        <div className={styles.ambient} aria-hidden="true" />
        <header className={styles.sceneHeader}>
          <a className={styles.wordmark} href="#top" aria-label="Gareth64 home">GARETH BEALL <span>/ LEAD AI·ML ENGINEER</span></a>
          <div>
            <button className={styles.keysToggle} type="button" onClick={() => setKeysVisible((value) => !value)} aria-pressed={keysVisible}>
              {keysVisible ? "HIDE KEYS" : "KEYBOARD"}
            </button>
            <Link className={styles.resumeLink} href="/resume">VIEW RÉSUMÉ <span aria-hidden="true">↗</span></Link>
            <button type="button" onClick={toggleMuted} aria-pressed={muted}>{muted ? "SOUND OFF" : "SOUND ON"}</button>
          </div>
        </header>

        <div className={styles.desk}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Sunshine Coast, Australia</p>
            <h1>I build AI.<br /><em>And the software around it.</em></h1>
            <p className={styles.introCopy}>I&#39;m Gareth. I build clinical AI and software products, with fifteen years as a clinical pharmacist behind me.</p>
            <p className={styles.currentWork}>I conceived and built <strong>IRIS</strong>. Now I lead its production rollout for 5,000 Queensland Health clinicians.</p>
            <div className={styles.introActions}>
              <Link href="/resume">Read my résumé <span aria-hidden="true">↗</span></Link>
              <a href={`/${siteContent.resume.fileName}`} download>Download PDF <span aria-hidden="true">↓</span></a>
            </div>
            <dl className={styles.credentials}>
              <div><dt>6 years</dt><dd>AI / ML engineering</dd></div>
              <div><dt>50,000+</dt><dd>Health professionals using my app</dd></div>
            </dl>
            <div className={styles.playNote}>
              <span aria-hidden="true">↳</span>
              <p>Coding since I was twelve. Some things stick.<br /><strong>Pick a tape. Explore my work. Ask the AI.</strong></p>
            </div>
          </div>
          <div className={styles.machine}>
          <div className={`${styles.monitor} ${screenOn ? styles.monitorLive : ""}`}>
            <div className={styles.monitorShell}>
              <div className={styles.ventLeft} aria-hidden="true" />
              <div className={styles.monitorFace}>
                <div className={styles.hood} aria-hidden="true" />
                <div className={styles.bezelOuter}>
                  <div className={styles.bezelMid}>
                    <div className={`${styles.glass} ${screenOn ? styles.glassOn : ""}`}>
                      <div className={`${styles.tube} ${loading ? styles.tubeLoading : ""}`}>
                        <div className={styles.screenBorder}>
                          {screenOn ? (
                            playingPong ? (
                              <Pong muted={muted} reducedMotion={reducedMotion} />
                            ) : view ? (
                              <ScreenViewer key={view.id} view={view} reducedMotion={reducedMotion} onClose={closeView} />
                            ) : (
                              <Terminal
                                lines={term.lines}
                                input={term.input}
                                showInput={canTypeNow || visibleState.kind === "streaming"}
                                busy={term.busy}
                                printing={term.printing}
                                streaming={term.streaming}
                                scrollTargetId={term.scrollTargetId}
                                searching={searching}
                                inputRef={inputRef}
                                onInputChange={term.setInput}
                                onSubmit={() => execute(term.input)}
                                onHistory={term.historyMove}
                                onCommandClick={(command) => typeCommand(command)}
                                onEvidenceClick={openEvidence}
                                onFocusRequest={focusInput}
                                onScrollTargetHandled={term.acknowledgeScrollTarget}
                              />
                            )
                          ) : (
                            <div className={styles.paperOff} aria-hidden="true" />
                          )}
                        </div>
                        <div className={styles.scanlines} aria-hidden="true" />
                        <div className={styles.grille} aria-hidden="true" />
                        <div className={styles.glare} aria-hidden="true" />
                        <div className={styles.vignette} aria-hidden="true" />
                        {visibleState.kind === "powering-on" && <div className={styles.powerFx} aria-hidden="true" />}
                        {visibleState.kind === "off" && <div className={styles.offMask} aria-hidden="true" />}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.chin}>
                  <span className={styles.speaker} aria-hidden="true" />
                  <span className={styles.chinBrand}>
                    <span className={styles.chinBadge}>GARETH64</span>
                    <small>COLOR MONITOR</small>
                  </span>
                  <span className={styles.ledWell} aria-hidden="true">
                    <span className={`${styles.chinLed} ${screenOn ? styles.ledOn : ""}`} />
                  </span>
                </div>
                <div className={styles.controlBay} aria-hidden="true">
                  {MONITOR_KNOBS.map((name) => (
                    <span className={styles.knob} key={name}>
                      <i />
                      <em>{name}</em>
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.ventRight} aria-hidden="true" />
            </div>
            <div className={styles.stand} aria-hidden="true"><i /><b /></div>
          </div>

          <aside className={styles.gear}>
              <div className={styles.deck} aria-label="Datasette">
                <div className={styles.deckTop}>
                  <span className={styles.deckBrand}>1530 DATASETTE</span>
                  <span className={`${styles.deckSave} ${loading ? styles.deckSaveOn : ""}`} aria-hidden="true" />
                </div>
                <div className={styles.deckWell}>
                  {inserted ? (
                    <CassetteFace item={inserted} spinning={loading} />
                  ) : (
                    <span className={styles.deckEmpty}>INSERT TAPE</span>
                  )}
                </div>
                <div className={styles.deckRow}>
                  <span className={styles.deckCounter} aria-hidden="true">{counter}</span>
                  <button
                    type="button"
                    className={styles.deckPlay}
                    onClick={() => typeCommand("RUN")}
                    disabled={!(visibleState.kind === "ready" && visibleState.selectedTape)}
                  >
                    PLAY
                  </button>
                  <button type="button" onClick={() => typeCommand("EJECT")} disabled={!tape || !canLoad}>
                    EJECT
                  </button>
                </div>
                <p className={styles.deckStatus}>{loading ? `LOADING… ${counter}` : deckLabel}</p>
              </div>

          <div
            className={`${styles.tapeShelf} ${screenOn && !everLoaded ? styles.shelfInvite : ""}`}
            aria-label="Career tape library"
          >
            <p>CAREER TAPES</p>
            {screenOn && !everLoaded && <p className={styles.shelfHint}>CLICK A TAPE TO LOAD IT</p>}
            {tapes.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`${styles.cassette} ${tape === item.id ? styles.tapeInserted : ""}`}
                style={{ "--tape-colour": item.colour, "--tape-ink": item.ink } as CSSProperties}
                onClick={() => typeCommand(`LOAD "${item.label}",1`)}
                disabled={!canLoad}
                aria-pressed={tape === item.id}
                aria-label={`Load tape ${item.label}`}
              >
                <CassetteFace item={item} spinning={loading && tape === item.id} />
              </button>
            ))}
          </div>
          </aside>

          <div className={styles.bench}>
            <div className={styles.breadbin}>
              <div className={styles.ridge} aria-hidden="true" />
              <div className={styles.caseTop}>
                <span className={styles.badge}>GARETH <i>64</i></span>
                <button
                  type="button"
                  className={styles.keysReveal}
                  onClick={(event) => {
                    event.stopPropagation();
                    setKeysVisible((value) => !value);
                  }}
                  aria-pressed={keysVisible}
                  aria-label={keysVisible ? "Hide keyboard" : "Show keyboard"}
                >
                  {keysVisible ? "KEYS ▴" : "KEYS ▾"}
                </button>
                <span className={styles.caseRight}>
                  <span className={`${styles.caseLed} ${screenOn ? styles.ledRed : ""}`} aria-hidden="true" />
                  <button
                    type="button"
                    className={styles.powerSwitch}
                    onClick={(event) => {
                      event.stopPropagation();
                      power();
                    }}
                    aria-label={visibleState.kind === "off" ? "Power on Gareth64" : "Power off Gareth64"}
                    aria-pressed={visibleState.kind !== "off"}
                  >
                      <span className={styles.rocker} aria-hidden="true"><i /></span>
                      <span>{visibleState.kind === "off" ? "OFF" : "ON"}</span>
                  </button>
                </span>
              </div>
              <div className={styles.keybed} inert={!keysVisible ? true : undefined}>
                <div className={styles.keybedClip}>
                  <C64Keyboard pressedId={pressedKey} onKey={handleKeyDef} />
                </div>
              </div>
              <div className={styles.caseLip} aria-hidden="true" />
            </div>
          </div>
          </div>

        </div>

        <footer className={styles.hints}>
          <a href={`mailto:${siteContent.email}`}>GET IN TOUCH ↗</a>
          <span>TYPE HELP</span><span>F1 = DIR</span><span>F5 = RUN</span><span>ESC = BREAK</span>
          {(visibleState.kind === "program" || visibleState.kind === "streaming") && (
            <button type="button" onClick={() => typeCommand("EJECT")}>EJECT TAPE</button>
          )}
        </footer>
      </section>

      {state.kind === "quick-view" && (
        <ResumeDialog onClose={closeResume}>{overlayQuickView}</ResumeDialog>
      )}
    </main>
  );
}
