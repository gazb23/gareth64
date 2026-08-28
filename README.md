# GARETH64

An interactive resume that runs as a playable Commodore 64.

**Live:** https://garethbeall.com

Power it on, load a career tape, and the machine tells you who
[Gareth Beall](https://www.linkedin.com/in/gareth-beall-835517321/) is. A
critical care pharmacist turned Lead AI/ML Engineer who builds the AI systems
hospitals actually run. Or type `ASK "your question"` and let GARETH.AI answer.

## The ask command is real

The `ASK` command on the GARETH.AI tape is a working retrieval-augmented
generation pipeline, the same shape of system Gareth builds professionally.
Not a canned demo.

- **Hybrid retrieval.** Lexical scoring with aliases, IDF, and coverage
  checks, fused with semantic embedding search over a curated knowledge
  registry ([`retrieval-local.ts`](src/lib/retrieval-local.ts),
  [`retrieval-rank.ts`](src/lib/retrieval-rank.ts)).
- **Honest abstention.** Privacy, prompt-injection, and clinical-advice gates
  plus an evidence-coverage check. When the disk doesn't hold the answer, the
  machine says so instead of inventing one.
- **Grounded generation.** The model answers only from retrieved chunks and
  streams into the terminal. Every answer carries clickable source cards that
  open the resume at the cited section.
- **A fixed eval suite.** Paraphrases, misspellings, unsupported claims, and
  hostile inputs run in CI ([`retrieval-eval.ts`](src/lib/retrieval-eval.ts)).

The rest of the machine: a typed state machine for the hardware, a small
BASIC interpreter (`LOAD`, `LIST`, `POKE 53280`, `SYS 64738`), a streaming
CRT terminal, an in-monitor viewer that dials up Gareth's shipped products,
and a playable Pong on tape 64.

## Stack

Next.js (App Router), React, TypeScript, Vitest, OpenRouter for chat and
embeddings, CSS Modules. No UI libraries. The hardware is hand-built CSS.

## Run it

```bash
pnpm install
cp .env.example .env.local   # add your OpenRouter key
pnpm dev
```

Without an API key the machine still boots and the tapes still run. The ask
pipeline falls back to the local lexical index.

```bash
pnpm check             # content verify + lint + typecheck + tests + build
pnpm knowledge:embed   # re-embed after editing src/content/knowledge.ts
pnpm pdf:build         # regenerate the downloadable PDF resume
```

## Content safety

Everything the AI can say lives in a reviewed public registry
([`knowledge.ts`](src/content/knowledge.ts)). A verification script blocks
forbidden claims from ever being committed, and the API answers only from
that registry.
