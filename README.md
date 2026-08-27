# GARETH64

An interactive résumé, shipped as a playable Commodore 64.

**Live:** https://gareth64.vercel.app

Power it on, load a career tape from the shelf, and the machine tells you who
[Gareth Beall](https://www.linkedin.com/in/gareth-beall-835517321/) is — a
critical care pharmacist turned Lead AI/ML Engineer who builds the AI systems
hospitals actually run. Or just type `ASK "your question"` and let GARETH.AI
answer.

## Why it's not just a gimmick

The `ASK` command on the GARETH.AI tape is a **real retrieval-augmented
generation pipeline**, the same shape of system Gareth builds professionally:

- **Hybrid retrieval** — lexical scoring (aliases, IDF, coverage) fused with
  semantic embedding search over a curated knowledge registry
  ([`src/lib/retrieval-local.ts`](src/lib/retrieval-local.ts),
  [`src/lib/retrieval-rank.ts`](src/lib/retrieval-rank.ts)).
- **Honest abstention** — privacy, prompt-injection, and clinical-advice
  gates, plus an evidence-coverage check; when the disk doesn't hold the
  answer, the machine says so instead of inventing one.
- **Grounded generation** — the model answers only from retrieved chunks and
  streams into the terminal; every answer ships with clickable source cards
  that open the résumé at the cited section.
- **A fixed eval suite** — paraphrases, misspellings, unsupported claims, and
  hostile inputs run in CI ([`src/lib/retrieval-eval.ts`](src/lib/retrieval-eval.ts)).

The rest of the machine: a typed finite-state machine for the hardware
(`off → boot → ready → loading → program → streaming`), a BASIC interpreter
(`LOAD`, `LIST`, `POKE 53280`, `SYS 64738`…), a streaming CRT terminal, an
in-monitor "remote host" viewer that dials up Gareth's shipped products, and a
playable Pong on tape 64.

## Stack

Next.js (App Router) · React · TypeScript · Vitest · OpenRouter (chat +
embeddings) · CSS Modules — no UI libraries; the hardware is hand-built CSS.

## Run it

```bash
pnpm install
cp .env.example .env.local   # add your OpenRouter key
pnpm dev
```

Without an API key the machine still boots and the tapes still run — the ask
pipeline falls back to the local lexical index.

```bash
pnpm check             # content verify + lint + typecheck + tests + build
pnpm knowledge:embed   # re-embed after editing src/content/knowledge.ts
```

## Content safety

Everything the AI can say lives in a reviewed public registry
([`src/content/knowledge.ts`](src/content/knowledge.ts)); a verification
script blocks forbidden claims from ever being committed, and the API answers
only from that registry.
