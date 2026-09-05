import { describe, expect, it } from "vitest";

import { transition, type MachineState } from "./machine";

describe("Gareth64 state machine", () => {
  it("follows the power, boot, tape, program, and eject path", () => {
    let state: MachineState = { kind: "off" };
    state = transition(state, { type: "POWER" });
    expect(state.kind).toBe("powering-on");
    state = transition(state, { type: "POWERED" });
    state = transition(state, { type: "BOOT_COMPLETE" });
    state = transition(state, { type: "SELECT_TAPE", tape: "iris" });
    state = transition(state, { type: "LOAD_TAPE" });
    expect(state).toEqual({ kind: "loading", tape: "iris" });
    state = transition(state, { type: "LOAD_COMPLETE" });
    expect(state).toEqual({ kind: "program", tape: "iris" });
    state = transition(state, { type: "EJECT" });
    expect(state).toEqual({ kind: "ready", selectedTape: null });
  });

  it("preserves the previous machine state while quick view is open", () => {
    const ready: MachineState = { kind: "ready", selectedTape: "gareth" };
    const quick = transition(ready, { type: "OPEN_QUICK_VIEW" });
    expect(quick.kind).toBe("quick-view");
    expect(transition(quick, { type: "CLOSE_QUICK_VIEW" })).toEqual(ready);
  });

  it.each<MachineState>([
    { kind: "ready", selectedTape: null },
    { kind: "program", tape: "iris" },
    { kind: "program", tape: "gareth" },
  ])("opens the AI directly from $kind $tape and returns to an interactive program", (state) => {
    const streaming = transition(state, { type: "ASK" });
    expect(streaming).toEqual({ kind: "streaming", tape: "gareth" });
    expect(transition(streaming, { type: "ANSWER_COMPLETE" })).toEqual({ kind: "program", tape: "gareth" });
  });

  it("ignores a second question while an answer is streaming", () => {
    const streaming: MachineState = { kind: "streaming", tape: "gareth" };
    expect(transition(streaming, { type: "ASK" })).toEqual(streaming);
  });

  it("finishes an answer while the résumé is open", () => {
    const quick = transition({ kind: "streaming", tape: "gareth" }, { type: "OPEN_QUICK_VIEW" });
    const answered = transition(quick, { type: "ANSWER_COMPLETE" });
    expect(answered.kind).toBe("quick-view");
    expect(transition(answered, { type: "CLOSE_QUICK_VIEW" })).toEqual({ kind: "program", tape: "gareth" });
  });

  it("finishes booting and loading behind the résumé", () => {
    let state = transition({ kind: "powering-on" }, { type: "OPEN_QUICK_VIEW" });
    state = transition(state, { type: "POWERED" });
    state = transition(state, { type: "BOOT_COMPLETE" });
    expect(transition(state, { type: "CLOSE_QUICK_VIEW" })).toEqual({ kind: "ready", selectedTape: null });
    const loading = transition({ kind: "loading", tape: "iris" }, { type: "OPEN_QUICK_VIEW" });
    expect(transition(transition(loading, { type: "LOAD_COMPLETE" }), { type: "CLOSE_QUICK_VIEW" })).toEqual({ kind: "program", tape: "iris" });
  });
});
