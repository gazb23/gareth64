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

  it("allows streaming only from the Gareth tape", () => {
    expect(transition({ kind: "program", tape: "iris" }, { type: "ASK" })).toEqual({ kind: "program", tape: "iris" });
    expect(transition({ kind: "program", tape: "gareth" }, { type: "ASK" })).toEqual({ kind: "streaming", tape: "gareth" });
  });
});

