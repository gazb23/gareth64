import type { TapeId } from "@/content/tapes";

export type MachineState =
  | { readonly kind: "off" }
  | { readonly kind: "powering-on" }
  | { readonly kind: "booting"; readonly skippable: boolean }
  | { readonly kind: "ready"; readonly selectedTape: TapeId | null }
  | { readonly kind: "loading"; readonly tape: TapeId }
  | { readonly kind: "program"; readonly tape: TapeId }
  | { readonly kind: "streaming"; readonly tape: "gareth" }
  | { readonly kind: "error"; readonly message: string; readonly recoverTo: "ready" | "program" }
  | { readonly kind: "quick-view"; readonly returnTo: Exclude<MachineState, { kind: "quick-view" }> };

export type MachineEvent =
  | { readonly type: "POWER" }
  | { readonly type: "POWERED" }
  | { readonly type: "BOOT_COMPLETE" }
  | { readonly type: "SKIP_BOOT" }
  | { readonly type: "SELECT_TAPE"; readonly tape: TapeId }
  | { readonly type: "LOAD_TAPE" }
  | { readonly type: "LOAD_COMPLETE" }
  | { readonly type: "ASK" }
  | { readonly type: "ANSWER_COMPLETE" }
  | { readonly type: "FAIL"; readonly message: string }
  | { readonly type: "RECOVER" }
  | { readonly type: "OPEN_QUICK_VIEW" }
  | { readonly type: "CLOSE_QUICK_VIEW" }
  | { readonly type: "EJECT" };

function assertNever(value: never): never {
  throw new Error(`Unhandled machine state: ${JSON.stringify(value)}`);
}

export function transition(state: MachineState, event: MachineEvent): MachineState {
  if (event.type === "OPEN_QUICK_VIEW" && state.kind !== "quick-view") {
    return { kind: "quick-view", returnTo: state };
  }

  if (state.kind === "quick-view") {
    if (event.type === "CLOSE_QUICK_VIEW") return state.returnTo;
    if (event.type === "OPEN_QUICK_VIEW") return state;
    const next = transition(state.returnTo, event);
    return next.kind === "quick-view" ? next : { kind: "quick-view", returnTo: next };
  }

  switch (state.kind) {
    case "off":
      return event.type === "POWER" ? { kind: "powering-on" } : state;
    case "powering-on":
      return event.type === "POWERED" ? { kind: "booting", skippable: true } : state;
    case "booting":
      return event.type === "BOOT_COMPLETE" || event.type === "SKIP_BOOT"
        ? { kind: "ready", selectedTape: null }
        : state;
    case "ready":
      if (event.type === "POWER") return { kind: "off" };
      if (event.type === "ASK") return { kind: "streaming", tape: "gareth" };
      if (event.type === "SELECT_TAPE") return { ...state, selectedTape: event.tape };
      if (event.type === "EJECT" && state.selectedTape) return { kind: "ready", selectedTape: null };
      if (event.type === "LOAD_TAPE" && state.selectedTape) {
        return { kind: "loading", tape: state.selectedTape };
      }
      return state;
    case "loading":
      if (event.type === "POWER") return { kind: "off" };
      if (event.type === "LOAD_COMPLETE") return { kind: "program", tape: state.tape };
      if (event.type === "FAIL") return { kind: "error", message: event.message, recoverTo: "ready" };
      return state;
    case "program":
      if (event.type === "POWER") return { kind: "off" };
      if (event.type === "EJECT") return { kind: "ready", selectedTape: null };
      if (event.type === "ASK") return { kind: "streaming", tape: "gareth" };
      if (event.type === "FAIL") return { kind: "error", message: event.message, recoverTo: "program" };
      return state;
    case "streaming":
      if (event.type === "POWER") return { kind: "off" };
      if (event.type === "ANSWER_COMPLETE") return { kind: "program", tape: "gareth" };
      if (event.type === "FAIL") return { kind: "error", message: event.message, recoverTo: "program" };
      return state;
    case "error":
      if (event.type !== "RECOVER") return state;
      return state.recoverTo === "ready"
        ? { kind: "ready", selectedTape: null }
        : { kind: "program", tape: "gareth" };
    default:
      return assertNever(state);
  }
}
