import { knowledgeRegistry } from "../src/content/knowledge";
import { tapes } from "../src/content/tapes";

const errors: string[] = [];
const forbidden = [
  /patient[- ]?(?:name|record|information)/i,
  /queensland health source code/i,
  /built (?:entirely )?solo/i,
  /family history/i,
];

if (knowledgeRegistry.length < 50 || knowledgeRegistry.length > 100) {
  errors.push(`Knowledge registry must contain 50–100 records; found ${knowledgeRegistry.length}.`);
}

const ids = new Set<string>();
for (const item of knowledgeRegistry) {
  if (ids.has(item.id)) errors.push(`Duplicate knowledge ID: ${item.id}`);
  ids.add(item.id);
  if (!item.text.trim()) errors.push(`Empty knowledge text: ${item.id}`);
  if (!item.aliases.length) errors.push(`Missing aliases: ${item.id}`);
  if (!item.canonicalUrl.startsWith("https://")) errors.push(`Invalid canonical URL: ${item.id}`);
  if (!(["verified-public", "public-safe"] as const).includes(item.evidenceStatus)) {
    errors.push(`Unpublishable evidence status: ${item.id}`);
  }
  for (const pattern of forbidden) {
    if (pattern.test(item.text)) errors.push(`Forbidden public claim in ${item.id}: ${pattern}`);
  }
}

const tapeIds = new Set(tapes.map((tape) => tape.id));
if (tapeIds.size !== tapes.length) errors.push("Tape registry contains duplicate IDs.");
for (const required of ["gareth", "iris", "products", "contact"] as const) {
  if (!tapeIds.has(required)) errors.push(`Missing career tape: ${required}`);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Verified ${knowledgeRegistry.length} knowledge chunks and ${tapes.length} tapes.`);

