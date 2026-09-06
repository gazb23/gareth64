import { siteContent } from "@/content/site";
import { tapes, tapesById, type TapeId } from "@/content/tapes";

import { command, gap, link, map, text, type TermLine } from "./terminal";

const pad = (value: string, width: number) => value.padEnd(width, " ");

const NEXT_TAPE_ACTIONS = [
  { tape: "gareth", label: "> ASK GARETH.AI", command: 'LOAD "GARETH.AI",1' },
  { tape: "iris", label: "> EXPLORE IRIS", command: 'LOAD "IRIS",1' },
  { tape: "products", label: "> SEE THE PRODUCTS", command: 'LOAD "PRODUCTS",1' },
  { tape: "contact", label: "> CONTACT GARETH", command: 'LOAD "CONTACT",1' },
] satisfies readonly { readonly tape: TapeId; readonly label: string; readonly command: string }[];

function nextStepLines(currentTape: TapeId): TermLine[] {
  const nextTapes = NEXT_TAPE_ACTIONS.filter(({ tape }) => tape !== currentTape).slice(0, 2);
  return [
    text("WHAT NEXT?", "system"),
    ...nextTapes.map((next) => command(next.label, next.command)),
    command("> VIEW RÉSUMÉ", "RESUME"),
  ];
}

export function starterQuestionCommand(question: string): string {
  return question === "What products has he shipped?"
    ? 'LOAD "PRODUCTS",1'
    : `ASK "${question}"`;
}

export function directoryLines(): TermLine[] {
  const rows = tapes.map((tape) =>
    text(`${pad(tape.number, 4)}"${pad(tape.label, 14)}" PRG${"fictional" in tape && tape.fictional ? "   C64 GAME" : ""}`),
  );
  return [
    text('0 "GARETH64 CAREER DISK" GB 2A', "system"),
    ...rows,
    gap(),
    text("6656 BLOCKS FREE.", "dim"),
  ];
}

/** Boot-time invitation: every career tape as a one-click load. */
export function tapeMenuLines(): TermLine[] {
  return [
    text("EXPLORE MY WORK. PICK A TAPE:", "system"),
    ...tapes.map((tape) => command(`${tape.number}  ${tape.label}`, `LOAD "${tape.label}",1`)),
  ];
}

export function helpLines(): TermLine[] {
  return [
    text("GARETH64 BASIC COMMANDS", "system"),
    text("DIR ............ TAPE DIRECTORY"),
    text('LOAD "NAME",1 .. LOAD A TAPE'),
    text("RUN ............ RUN LOADED PROGRAM"),
    text("LIST ........... LIST LOADED PROGRAM"),
    text('ASK "QUESTION" . CONSULT GARETH.AI'),
    text("RESUME ......... FAST RESUME VIEW"),
    text("EJECT .......... EJECT TAPE"),
    text("CLEAR .......... CLEAR SCREEN"),
    text("POKE 53280,N ... BORDER COLOUR (0-15)"),
    text("POKE 53281,N ... SCREEN COLOUR (0-15)"),
    text("SYS 64738 ...... WARM RESET"),
    gap(),
    text("OR JUST TYPE A QUESTION ABOUT GARETH.", "dim"),
    text("TIP: F1 = DIR   F3 = LOAD GARETH   F5 = RUN   F7 = HELP", "dim"),
    text('PLAY: LOAD "PONG",1 THEN RUN. ARROW KEYS MOVE.', "dim"),
  ];
}

export function listingLines(tape: TapeId): TermLine[] {
  const label = tapesById.get(tape)?.label ?? tape;
  const listings: Record<TapeId, readonly string[]> = {
    gareth: [
      `10 REM *** ${label} ***`,
      '20 PRINT "GARETH BEALL / LEAD AI-ML ENGINEER"',
      '30 PRINT "CLINICAL JUDGEMENT + PRODUCTION AI"',
      "40 GOSUB 100 : REM EVIDENCE DISK",
      "50 IF EVIDENCE$ = \"\" THEN GOTO 40",
      "60 GOTO 20 : REM ALWAYS SHIPPING",
    ],
    iris: [
      `10 REM *** ${label} ***`,
      '20 PRINT "TRACEABLE SOURCES OR IT DIDN\'T HAPPEN"',
      "30 FOR C = 1 TO 5 : GOSUB CHAPTER(C) : NEXT",
      "40 IF CONFIDENT AND WRONG THEN ALARM",
      "50 GOTO 30 : REM EVALUATE EVERYTHING",
    ],
    products: [
      `10 REM *** ${label} ***`,
      "20 DIM P$(4) : REM CALCULATOR, INKY, NAMELY, PHOTOS",
      "30 FOR I = 1 TO 4 : PRINT P$(I) : NEXT",
      "40 REM SHIPS TOOLS, NOT DEMONSTRATIONS",
    ],
    contact: [
      `10 REM *** ${label} ***`,
      `20 PRINT "${siteContent.email.toUpperCase()}"`,
      "30 REM REPLIES FASTER THAN TAPE LOADS",
    ],
    pong: [
      `10 REM *** ${label} ***`,
      "20 POKE 53280,0 : POKE 53281,0",
      '30 PRINT "FIRST TO SEVEN WINS"',
      "40 SYS 49152 : REM START GAME",
    ],
  };
  return listings[tape].map((line) => text(line));
}

export function programLines(tape: TapeId): TermLine[] {
  if (tape === "gareth") {
    return [
      text("GARETH BEALL / PROFILE", "system"),
      gap(),
      text("LEAD AI/ML ENGINEER", "bright"),
      text("FIFTEEN YEARS AS A CLINICAL PHARMACIST, INCLUDING INTENSIVE CARE. NOW BUILDING CLINICAL AI AT QUEENSLAND HEALTH.", "bright"),
      map(),
      text("* AI/ML LEARNING AND PROJECTS SINCE 2019-2021. CODING SINCE AGE 12.", "dim"),
      text("* BUILT IRIS, THE CLINICAL AI ASSISTANT AT QUEENSLAND HEALTH.", "dim"),
      text("* RUNS THE WHOLE STACK: GPU SERVING, RETRIEVAL, EVALS, RELEASE.", "dim"),
      text("* SHIPS REAL PRODUCTS PEOPLE PAY FOR.", "dim"),
      gap(),
      text("GARETH.AI IS LISTENING.", "system"),
      text("TYPE A QUESTION BELOW OR CLICK ONE:", "dim"),
      ...siteContent.starterQuestions.map((q) => command(`? ${q.toUpperCase()}`, starterQuestionCommand(q))),
      gap(),
      ...nextStepLines(tape),
    ];
  }

  if (tape === "iris") {
    return [
      text("IRIS / CLINICAL AI FOR QUEENSLAND HEALTH", "system"),
      gap(),
      text(siteContent.iris.summary, "bright"),
      gap(),
      ...siteContent.iris.chapters.flatMap(([title, body]): TermLine[] => [
        text(`${title.toUpperCase()}: ${body}`, "dim"),
      ]),
      gap(),
      command('> WATCH THE 2-MINUTE PILOT DEMO ON THIS SCREEN', 'VIEW "IRIS DEMO"'),
      text(siteContent.iris.video.note.toUpperCase(), "dim"),
      gap(),
      ...nextStepLines(tape),
    ];
  }

  if (tape === "products") {
    return [
      text(`PRODUCT DIRECTORY / ${siteContent.products.length} FILES`, "system"),
      gap(),
      ...siteContent.products.flatMap((product): TermLine[] => [
        product.embeddable
          ? command(`> ${product.name.toUpperCase()}`, `VIEW "${product.viewId}"`)
          : link(`> ${product.name.toUpperCase()} (NEW WINDOW)`, product.href),
        text(product.description, "dim"),
        gap(),
      ]),
      ...nextStepLines(tape),
    ];
  }

  if (tape === "contact") {
    return [
      text("CONTACT / READY", "system"),
      gap(),
      link(`EMAIL: ${siteContent.email.toUpperCase()}`, `mailto:${siteContent.email}`),
      link("LINKEDIN PROFILE", siteContent.links.linkedin),
      link("GITHUB: GAZB23", siteContent.links.github),
      command("FAST RESUME VIEW", "RESUME"),
      link("DOWNLOAD PDF RESUME", `/${siteContent.resume.fileName}`),
      gap(),
      ...nextStepLines(tape),
    ];
  }

  return [
    text("PONG / TAPE 64", "system"),
    gap(),
    text("A C64-STYLE PONG RUNNING ON THIS MACHINE."),
    text("ARROW KEYS OR MOUSE. FIRST TO SEVEN. ESC EJECTS.", "dim"),
  ];
}
