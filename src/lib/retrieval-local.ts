import { knowledgeRegistry, type KnowledgeChunk } from "@/content/knowledge";

export interface RetrievalResult {
  readonly chunk: KnowledgeChunk;
  readonly lexicalScore: number;
  readonly semanticScore: number | null;
  readonly score: number;
}

export type UnsupportedReason =
  | "clinical-advice"
  | "insufficient-evidence"
  | "privacy"
  | "prompt-injection";

export type RetrievalAssessment =
  | { readonly kind: "supported"; readonly results: readonly RetrievalResult[] }
  | {
      readonly kind: "unsupported";
      readonly reason: UnsupportedReason;
      readonly results: readonly RetrievalResult[];
    };

const stopWords = new Set([
  "a", "about", "an", "and", "are", "as", "at", "be", "can", "cannot", "did", "do", "does", "for", "has", "have", "he", "him", "his", "how", "i", "in", "is", "it", "me", "my", "of", "on", "outside", "the", "to", "was", "what", "where", "which", "who", "with",
]);

const requestWords = new Set([
  "ai", "answer", "background", "describe", "detail", "details", "exactly", "experience", "explain", "gareth", "give", "handle", "know", "made", "make", "making", "please", "show", "tell", "work", "worked",
]);

const tokenAliases: Readonly<Record<string, string>> = {
  app: "product",
  apps: "product",
  application: "product",
  applications: "product",
  builder: "build",
  builds: "build",
  built: "build",
  citations: "citation",
  created: "build",
  creates: "build",
  garrett: "gareth",
  garreth: "gareth",
  garrath: "gareth",
  handled: "handle",
  jobs: "role",
  makes: "make",
  pharmasist: "pharmacist",
  products: "product",
  projects: "product",
  proof: "verify",
  prove: "verify",
  proving: "verify",
  retrival: "retrieval",
  roles: "role",
  sources: "source",
  traceability: "citation",
  traceable: "citation",
  unusually: "unusual",
  verification: "verify",
  verified: "verify",
  verifies: "verify",
  verifying: "verify",
  years: "year",
};

const promptInjectionPattern = /(?:bypass|disregard|ignore|jailbreak|override).{0,40}(?:instruction|prompt|rule)|(?:developer|system) (?:message|prompt)|reveal.{0,30}(?:instruction|prompt)|repeat.{0,30}(?:instruction|prompt)/i;
const privacyPattern = /(?:api key|confidential|home address|internal document|password|phone number|private|salary|secret|source code)/i;
const clinicalAdvicePattern = /(?:diagnos|dosage|dose for|medical advice|my patient|patient-specific|should i take|treat my)/i;

interface IndexedChunk {
  readonly item: KnowledgeChunk;
  readonly title: ReadonlySet<string>;
  readonly aliases: readonly ReadonlySet<string>[];
  readonly aliasPhrases: readonly string[];
  readonly body: ReadonlySet<string>;
  readonly topic: ReadonlySet<string>;
  readonly all: ReadonlySet<string>;
}

interface PreparedQuery {
  readonly normalized: string;
  readonly originalTokens: readonly string[];
  readonly rankingTokens: readonly string[];
}

function normalize(value: string): string {
  return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function canonicalToken(token: string): string {
  const aliased = tokenAliases[token] ?? token;
  if (aliased.endsWith("ing") && aliased.length > 6) return aliased.slice(0, -3);
  if (aliased.endsWith("ed") && aliased.length > 5) return aliased.slice(0, -2);
  if (aliased.endsWith("s") && aliased.length > 5) return aliased.slice(0, -1);
  return aliased;
}

function tokens(value: string): readonly string[] {
  return normalize(value)
    .split(/\s+/)
    .map(canonicalToken)
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values)];
}

function prepareQuery(question: string): PreparedQuery {
  const normalized = normalize(question);
  const originalTokens = unique(tokens(question));
  const additions: string[] = [];

  if (/outside (?:of )?iris/.test(normalized)) additions.push("product", "app");
  if (/(?:cannot|can t|unsupported).{0,30}answer|evidence.{0,30}(?:missing|cannot|can t)/.test(normalized)) additions.push("abstain", "unsupported");
  if (/(?:live|located|location|based).{0,20}(?:where|australia|queensland)|where.{0,20}(?:live|located|based)/.test(normalized)) additions.push("location", "based");
  if (/(?:prove|proof|verify).{0,30}(?:deploy|release)|(?:deploy|release).{0,30}(?:prove|proof|verify)/.test(normalized)) additions.push("release", "verify", "live");
  if (/(?:traceable|traceability).{0,30}(?:answer|ai|source)|(?:answer|ai|source).{0,30}(?:traceable|traceability)/.test(normalized)) additions.push("citation", "continuity", "audit");

  const rankingTokens = unique([
    ...originalTokens.filter((token) => !(token === "iris" && /outside (?:of )?iris/.test(normalized))),
    ...additions.map(canonicalToken),
  ]);
  return { normalized, originalTokens, rankingTokens };
}

function indexChunk(item: KnowledgeChunk): IndexedChunk {
  const title = new Set(tokens(item.title));
  const aliases = item.aliases.map((alias) => new Set(tokens(alias)));
  const aliasPhrases = item.aliases.map(normalize);
  const body = new Set(tokens(item.text));
  const topic = new Set(tokens(item.topic));
  return {
    item,
    title,
    aliases,
    aliasPhrases,
    body,
    topic,
    all: new Set([...title, ...aliases.flatMap((alias) => [...alias]), ...body, ...topic]),
  };
}

const indexedRegistry = knowledgeRegistry.map(indexChunk);
const documentFrequency = new Map<string, number>();
for (const indexed of indexedRegistry) {
  for (const token of indexed.all) documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
}

function inverseDocumentFrequency(token: string): number {
  const frequency = documentFrequency.get(token) ?? 0;
  return 1 + Math.log((indexedRegistry.length + 1) / (frequency + 1));
}

function scoreLexically(query: PreparedQuery, indexed: IndexedChunk): number {
  if (query.rankingTokens.length === 0) return 0;

  let score = 0;
  let possibleScore = 0;
  for (const token of query.rankingTokens) {
    const rarity = inverseDocumentFrequency(token);
    possibleScore += 5 * rarity;
    if (indexed.title.has(token)) score += 4 * rarity;
    if (indexed.aliases.some((alias) => alias.has(token))) score += 5 * rarity;
    if (indexed.body.has(token)) score += 1.5 * rarity;
    if (indexed.topic.has(token)) score += 2 * rarity;
  }
  if (indexed.aliasPhrases.some((alias) => alias.length > 2 && query.normalized.includes(alias))) {
    score += 7;
    possibleScore += 7;
  }
  return possibleScore === 0 ? 0 : (score / possibleScore) * 10;
}

export function retrieveLexically(question: string, limit = 6): readonly RetrievalResult[] {
  const query = prepareQuery(question);
  return indexedRegistry
    .map((indexed) => {
      const lexicalScore = scoreLexically(query, indexed);
      return { chunk: indexed.item, lexicalScore, semanticScore: null, score: lexicalScore };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score || left.chunk.id.localeCompare(right.chunk.id))
    .slice(0, limit);
}

function evidenceCoverage(question: string, top: RetrievalResult | undefined): number {
  if (!top) return 0;
  const query = prepareQuery(question);
  const indexed = indexedRegistry.find((candidate) => candidate.item.id === top.chunk.id);
  if (!indexed) return 0;
  if (indexed.aliasPhrases.some((alias) => alias.includes(" ") && query.normalized.includes(alias))) return 1;
  const informative = query.rankingTokens.filter((token) => !requestWords.has(token));
  if (informative.length === 0) return top.lexicalScore > 0 ? 1 : 0;
  const matched = informative.filter((token) => indexed.all.has(token));
  return matched.length / informative.length;
}

export function assessRetrieval(
  question: string,
  results: readonly RetrievalResult[] = retrieveLexically(question, 6),
): RetrievalAssessment {
  if (promptInjectionPattern.test(question)) return { kind: "unsupported", reason: "prompt-injection", results };
  if (privacyPattern.test(question)) return { kind: "unsupported", reason: "privacy", results };
  if (clinicalAdvicePattern.test(question)) return { kind: "unsupported", reason: "clinical-advice", results };

  const hasStrongLexicalEvidence = results
    .slice(0, 3)
    .some((result) => result.lexicalScore >= 1.25 && evidenceCoverage(question, result) >= 0.5);
  if (!hasStrongLexicalEvidence) return { kind: "unsupported", reason: "insufficient-evidence", results };
  return { kind: "supported", results };
}
