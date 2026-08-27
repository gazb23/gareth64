import { describe, expect, it } from "vitest";

import { resolveTape, runCommand, type BasicContext } from "./basic";
import type { MachineState } from "./machine";

const ctx = (state: MachineState = { kind: "ready", selectedTape: null }): BasicContext => ({
  state: state as Exclude<MachineState, { kind: "quick-view" }>,
});

const texts = (result: ReturnType<typeof runCommand>) =>
  result.lines.filter((line) => line.kind === "text").map((line) => line.text);

describe("resolveTape", () => {
  it("resolves by id, label, number, and partial label", () => {
    expect(resolveTape("iris")).toBe("iris");
    expect(resolveTape("IRIS")).toBe("iris");
    expect(resolveTape("2")).toBe("iris");
    expect(resolveTape("02")).toBe("iris");
    expect(resolveTape("gareth")).toBe("gareth");
    expect(resolveTape("pong")).toBe("pong");
    expect(resolveTape("PONG")).toBe("pong");
    expect(resolveTape("64")).toBe("pong");
  });

  it("returns null for unknown tapes", () => {
    expect(resolveTape("windows-95")).toBeNull();
    expect(resolveTape("")).toBeNull();
  });
});

describe("runCommand", () => {
  it("prints the directory for DIR", () => {
    const result = runCommand("DIR", ctx());
    expect(result.events).toEqual([]);
    expect(texts(result).join("\n")).toContain("GARETH64 CAREER DISK");
    expect(texts(result).join("\n")).toContain("PONG");
    expect(texts(result).join("\n")).toContain("C64 GAME");
    expect(texts(result).join("\n")).toContain("BLOCKS FREE");
  });

  it("loads a tape by quoted name", () => {
    const result = runCommand('LOAD "IRIS",1', ctx());
    expect(result.events).toEqual([
      { type: "SELECT_TAPE", tape: "iris" },
      { type: "LOAD_TAPE" },
    ]);
  });

  it("ejects a running program before loading another tape", () => {
    const result = runCommand('LOAD "PRODUCTS",1', ctx({ kind: "program", tape: "iris" }));
    expect(result.events).toEqual([
      { type: "EJECT" },
      { type: "SELECT_TAPE", tape: "products" },
      { type: "LOAD_TAPE" },
    ]);
  });

  it("reports file not found for unknown tapes", () => {
    const result = runCommand('LOAD "DOOM",1', ctx());
    expect(result.events).toEqual([]);
    expect(texts(result)[0]).toContain("?FILE NOT FOUND ERROR");
  });

  it("runs the selected tape from ready", () => {
    const result = runCommand("RUN", ctx({ kind: "ready", selectedTape: "contact" }));
    expect(result.events).toEqual([{ type: "LOAD_TAPE" }]);
  });

  it("reprints a running program for RUN", () => {
    const result = runCommand("RUN", ctx({ kind: "program", tape: "products" }));
    expect(result.events).toEqual([]);
    expect(texts(result).join("\n")).toContain("PRODUCT DIRECTORY");
  });

  it("fails RUN politely with nothing loaded", () => {
    const result = runCommand("RUN", ctx());
    expect(texts(result)[0]).toContain("?RUN ERROR");
  });

  it("lists the loaded program as a BASIC listing", () => {
    const result = runCommand("LIST", ctx({ kind: "program", tape: "gareth" }));
    expect(texts(result).join("\n")).toContain("10 REM *** GARETH.AI ***");
  });

  it("routes ASK to the ask effect only from the gareth program", () => {
    const ok = runCommand('ASK "What did he build?"', ctx({ kind: "program", tape: "gareth" }));
    expect(ok.effect).toEqual({ type: "ask", question: "What did he build?" });

    const denied = runCommand('ASK "anything"', ctx({ kind: "program", tape: "iris" }));
    expect(denied.effect).toBeUndefined();
    expect(texts(denied)[0]).toContain("?DEVICE NOT PRESENT ERROR");
  });

  it("parses POKE with range checking", () => {
    const ok = runCommand("POKE 53280,0", ctx());
    expect(ok.effect).toEqual({ type: "poke", register: 53280, value: 0 });
    const bad = runCommand("POKE 53280,16", ctx());
    expect(bad.effect).toBeUndefined();
    expect(texts(bad)[0]).toContain("?ILLEGAL QUANTITY ERROR");
  });

  it("maps SYS 64738 to a reset effect", () => {
    expect(runCommand("SYS 64738", ctx()).effect).toEqual({ type: "reset" });
  });

  it("honours the 10 PRINT maze easter egg", () => {
    const result = runCommand("10 PRINT CHR$(205.5+RND(1)); : GOTO 10", ctx());
    const maze = texts(result).filter((line) => /^[/\\]+$/.test(line));
    expect(maze.length).toBeGreaterThanOrEqual(7);
    expect(maze[0]).toHaveLength(46);
  });

  it("clears the screen for CLEAR", () => {
    expect(runCommand("CLEAR", ctx()).effect).toEqual({ type: "clear" });
  });

  it("ejects a selected tape from ready", () => {
    const result = runCommand("EJECT", ctx({ kind: "ready", selectedTape: "products" }));
    expect(result.events).toEqual([{ type: "EJECT" }]);
  });

  it("routes VIEW to a viewer effect for known hosts", () => {
    const ok = runCommand('VIEW "IRIS DEMO"', ctx({ kind: "program", tape: "iris" }));
    expect(ok.effect?.type).toBe("view");
    expect(ok.effect?.type === "view" && ok.effect.view.kind).toBe("video");

    const unknown = runCommand('VIEW "GEOCITIES"', ctx());
    expect(unknown.effect).toBeUndefined();
    expect(texts(unknown)[0]).toContain("?REMOTE HOST NOT FOUND");

    const off = runCommand('VIEW "OPIOID"', ctx({ kind: "off" }));
    expect(off.effect).toBeUndefined();
    expect(texts(off)[0]).toContain("?DEVICE NOT READY ERROR");
  });

  it("opens the quick view for RESUME", () => {
    expect(runCommand("RESUME", ctx()).events).toEqual([{ type: "OPEN_QUICK_VIEW" }]);
  });

  it("rejects unknown commands with a syntax error", () => {
    const result = runCommand("FORMAT C:", ctx());
    expect(texts(result)[0]).toBe("?SYNTAX ERROR");
  });

  it("ignores empty input", () => {
    expect(runCommand("   ", ctx())).toEqual({ lines: [], events: [] });
  });
});
