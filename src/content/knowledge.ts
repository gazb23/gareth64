import { siteContent } from "./site";

export type KnowledgeTopic =
  | "profile"
  | "clinical"
  | "iris"
  | "retrieval"
  | "safety"
  | "operations"
  | "products"
  | "principles"
  | "interests"
  | "contact";

export type EvidenceStatus = "verified-public" | "public-safe";

export type KnowledgeChunkId = `kb-${string}`;

export interface KnowledgeChunk {
  readonly id: KnowledgeChunkId;
  readonly topic: KnowledgeTopic;
  readonly title: string;
  readonly aliases: readonly string[];
  readonly text: string;
  readonly canonicalUrl: string;
  readonly evidenceStatus: EvidenceStatus;
}

const baseUrl = "https://gareth64.vercel.app";

function chunk(
  id: KnowledgeChunkId,
  topic: KnowledgeTopic,
  title: string,
  aliases: readonly string[],
  text: string,
  anchor: string,
  evidenceStatus: EvidenceStatus = "public-safe",
): KnowledgeChunk {
  return {
    id,
    topic,
    title,
    aliases,
    text,
    canonicalUrl: `${baseUrl}/${anchor}`,
    evidenceStatus,
  };
}

export const knowledgeRegistry = [
  chunk("kb-profile-identity", "profile", "Gareth Beall", ["gareth", "garrett", "garreth", "who is he"], `${siteContent.name} is a Lead AI/ML Engineer based on the Sunshine Coast in Queensland, Australia.`, "#about", "verified-public"),
  chunk("kb-profile-positioning", "profile", "Professional positioning", ["role", "job", "title", "position"], "Gareth leads with AI and machine-learning engineering. Clinical pharmacy is his differentiator rather than the category he wants to be hired into.", "#about"),
  chunk("kb-profile-summary", "profile", "What Gareth builds", ["summary", "overview", "bio"], "Gareth builds production AI systems for settings where evidence, safety, governance, and operational reliability matter.", "#about"),
  chunk("kb-profile-bridge", "profile", "Two sides of the interface", ["unusual", "different", "advantage", "bridge"], "Gareth understands both specialist clinical work and the engineering needed to make AI systems dependable in practice.", "#about"),
  chunk("kb-profile-thinking", "principles", "How Gareth thinks", ["thinking", "approach", "mindset"], "He starts with the real decision, the available evidence, and the failure modes. Architecture follows from those constraints rather than from fashion.", "#principles"),
  chunk("kb-profile-candid", "profile", "Candid introduction", ["personality", "candid", "human"], "Gareth is curious, product-minded, and unusually willing to follow difficult technical work through governance, release, and operations rather than stopping at a prototype.", "#about"),

  chunk("kb-clinical-years", "clinical", "Clinical experience", ["pharmacist", "pharmacy", "years", "healthcare"], "Gareth has fifteen years of clinical pharmacy experience.", "#clinical", "verified-public"),
  chunk("kb-clinical-icu", "clinical", "Intensive care", ["icu", "intensive care", "hospital"], "His clinical background includes intensive-care pharmacy, where ambiguity and medication risk have real consequences.", "#clinical", "verified-public"),
  chunk("kb-clinical-evidence", "clinical", "Evidence discipline", ["evidence", "guidelines", "sources"], "Clinical practice trained Gareth to distinguish a plausible answer from one that is supported, applicable, and safe to act on.", "#clinical"),
  chunk("kb-clinical-human-factors", "clinical", "Human factors", ["human factors", "workflow", "users"], "Gareth treats workflow, cognitive load, and the way evidence is presented as safety concerns, not polish to add at the end.", "#clinical"),
  chunk("kb-clinical-uncertainty", "clinical", "Handling uncertainty", ["uncertainty", "unknown", "confidence"], "He prefers explicit uncertainty and traceable sources over confident language that outruns the evidence.", "#clinical"),

  chunk("kb-iris-origin", "iris", "IRIS origin", ["iris", "started", "origin", "idea"], "Gareth conceived and built the initial IRIS clinical RAG system before leading its engineering into a governed Queensland Health delivery context.", "#iris"),
  chunk("kb-iris-purpose", "iris", "IRIS purpose", ["iris purpose", "clinical rag", "what is iris"], "IRIS is a clinical retrieval-augmented generation system designed to give users answers grounded in reviewed source material.", "#iris"),
  chunk("kb-iris-leadership", "iris", "Engineering leadership", ["led", "leadership", "team"], "Gareth led engineering work across IRIS retrieval, evaluation, inference, safety, security, UAT, release, and operations.", "#iris"),
  chunk("kb-iris-governance", "iris", "Governed delivery", ["governance", "public sector", "queensland health"], "IRIS was engineered for governed public-sector delivery, where source control, security review, UAT, release evidence, and operational ownership all matter.", "#iris"),
  chunk("kb-iris-scope", "iris", "Public-safe scope", ["confidential", "private", "source code"], "Public descriptions of IRIS deliberately stay at capability level and exclude protected health-system material, private metrics, and internal implementation details.", "#iris"),

  chunk("kb-ingestion-reviewed", "retrieval", "Reviewed ingestion", ["ingestion", "documents", "sources"], "IRIS ingestion starts with reviewed sources and records the information needed to trace processed material back to its origin.", "#iris"),
  chunk("kb-ingestion-audit", "retrieval", "Auditable processing", ["audit", "traceability", "pipeline"], "The ingestion pipeline was designed to be auditable so failures, transformations, and source identity can be investigated rather than guessed.", "#iris"),
  chunk("kb-ingestion-quarantine", "safety", "Quarantine paths", ["quarantine", "reject", "unsafe source"], "Material that should not be retrievable can be quarantined instead of silently entering the searchable corpus.", "#iris"),
  chunk("kb-retrieval-hybrid", "retrieval", "Hybrid retrieval", ["hybrid", "semantic", "lexical", "search"], "IRIS combines lexical and semantic retrieval so exact clinical terms and meaning-based matches can both contribute candidates.", "#iris"),
  chunk("kb-retrieval-reranking", "retrieval", "Reranking", ["rerank", "ranking", "relevance"], "Candidate passages are reranked to improve which evidence reaches the answer-generation stage.", "#iris"),
  chunk("kb-retrieval-citations", "retrieval", "Citation continuity", ["citation", "sources", "evidence card"], "Citation identity and continuity are treated as system contracts so the displayed evidence corresponds to the retrieved source.", "#iris"),
  chunk("kb-retrieval-evaluation", "retrieval", "Retrieval evaluation", ["eval", "evaluation", "benchmark", "top three"], "Retrieval is evaluated against realistic questions, including paraphrases, difficult terminology, and cases where the system should abstain.", "#iris"),
  chunk("kb-retrieval-tables", "retrieval", "Complex evidence", ["tables", "pdf", "page"], "Gareth has worked on retrieval and evidence presentation for difficult source structures such as tables and page-aware PDF content.", "#iris"),

  chunk("kb-inference-self-hosted", "operations", "Self-hosted inference", ["self hosted", "vllm", "gpu", "inference"], "IRIS uses self-hosted model inference so privacy, availability, performance, and operational control can be engineered explicitly.", "#iris"),
  chunk("kb-inference-gpu", "operations", "GPU systems", ["gpu", "serving", "model server"], "Gareth has hands-on experience operating GPU-backed model-serving infrastructure rather than only consuming hosted chat APIs.", "#iris"),
  chunk("kb-ops-release", "operations", "Release engineering", ["release", "deploy", "promotion"], "He treats release gates, exact build identity, migration state, and live verification as part of delivering an AI capability.", "#iris"),
  chunk("kb-ops-uat", "operations", "User acceptance testing", ["uat", "testing", "acceptance"], "Gareth has led IRIS through UAT, where useful proof comes from the deployed system and representative workflows rather than local tests alone.", "#iris"),
  chunk("kb-ops-observability", "operations", "Observability", ["observability", "logs", "monitoring"], "IRIS operations include observability and evidence-led diagnosis so incidents can be traced through current runtime state.", "#iris"),
  chunk("kb-ops-incidents", "operations", "Incident discipline", ["incident", "debug", "failure"], "Gareth separates diagnosis, remediation, deployment, and live proof instead of declaring an incident fixed when code merely passes locally.", "#iris"),

  chunk("kb-safety-guardrails", "safety", "Safety controls", ["guardrail", "safety", "scope"], "IRIS safety work includes scope controls, guarded prompts, evidence display, and deterministic checks around failure-prone boundaries.", "#iris"),
  chunk("kb-safety-abstention", "safety", "Honest abstention", ["abstain", "unsupported", "no answer"], "When evidence is missing or outside scope, Gareth wants systems to say so clearly and offer a useful next step rather than inventing an answer.", "#iris"),
  chunk("kb-safety-evals", "safety", "Safety evaluation", ["red team", "hostile", "prompt injection"], "Evaluation covers supported questions, unsupported claims, privacy probes, prompt injection, and hostile input.", "#iris"),
  chunk("kb-safety-clinical", "safety", "Clinical responsibility", ["clinical advice", "patient", "medical"], "A portfolio assistant can describe Gareth's public work but must not provide patient-specific clinical advice or expose private health-system information.", "#iris"),

  chunk("kb-product-opioid", "products", "Opioid Conversion Calculator", ["opioid", "calculator", "conversion"], "Gareth built the Opioid Conversion Calculator, a focused clinical tool for health professionals.", "#products", "verified-public"),
  chunk("kb-product-opioid-thinking", "products", "Clinical product translation", ["medication", "clinical tool", "usability"], "The calculator reflects Gareth's ability to translate specialist medication knowledge into a practical product interface.", "#products"),
  chunk("kb-product-namely", "products", "Namely", ["baby name", "names", "namely"], "Gareth built Namely, a consumer product for exploring and comparing baby names.", "#products", "verified-public"),
  chunk("kb-product-namely-thinking", "products", "Preference-led discovery", ["preference", "discovery", "consumer app"], "Namely explores how playful interaction and preference signals can support a personal decision without making the product feel clinical.", "#products"),
  chunk("kb-product-photo", "products", "My Restored Photo", ["photo", "restoration", "image ai"], "Gareth built My Restored Photo, an AI-assisted experience for restoring damaged personal photographs.", "#products", "verified-public"),
  chunk("kb-product-photo-thinking", "products", "Emotionally legible AI", ["meaningful ai", "restored photos", "human"], "My Restored Photo applies modern image technology to an outcome people immediately understand: recovering a photograph that matters to them.", "#products"),
  chunk("kb-product-inky", "products", "Inky Health", ["inky", "inky health", "portfolio"], "Inky Health is Gareth's health-AI venture: private, self-hosted document AI for health and government organisations whose sensitive data cannot leave their own network.", "#products", "verified-public"),
  chunk("kb-product-inky-detail", "products", "Inky Health capabilities", ["document ai", "redaction", "extraction", "self hosted ai"], "Inky Health covers document search, structured extraction, redaction, and agent workflows, all running inside the customer's own infrastructure.", "#products", "verified-public"),
  chunk("kb-product-e2", "products", "E2 Apps", ["e2", "e2 apps", "studio"], "E2 Apps is Gareth's small product studio for turning domain knowledge into useful software.", "#products", "verified-public"),

  chunk("kb-principle-evidence", "principles", "Make evidence visible", ["principle", "evidence", "transparent"], "A recurring Gareth principle is to make the supporting evidence visible so users can inspect why a system answered as it did.", "#principles"),
  chunk("kb-principle-failure", "principles", "Model failure states", ["failure mode", "state machine", "errors"], "He models failure states deliberately: offline providers, unsupported questions, incomplete sources, unsafe scope, and interrupted releases are expected states, not surprises.", "#principles"),
  chunk("kb-principle-operations", "principles", "Operations are product", ["operations", "production", "shipping"], "Gareth treats monitoring, deployment, documentation, support, and recovery as part of the product experience.", "#principles"),
  chunk("kb-principle-useful", "principles", "Useful over fashionable", ["pragmatic", "hype", "fashion"], "He prefers the smallest architecture that can be tested and operated well, then adds complexity when evaluations expose a real deficiency.", "#principles"),
  chunk("kb-principle-interface", "principles", "Interface and infrastructure", ["design", "ux", "backend"], "Gareth works across the interface and infrastructure because user trust depends on both the visible interaction and the invisible retrieval and release contracts beneath it.", "#principles"),

  chunk("kb-interest-building", "interests", "Building useful things", ["experiments", "maker", "side projects"], "Gareth enjoys building small products and technical experiments that turn an idea into something another person can actually use.", "#products"),
  chunk("kb-interest-gareth64", "interests", "Why Gareth64 exists", ["this website", "gareth64", "resume site", "c64", "commodore", "retro"], "Gareth64 presents a résumé as a playable 1980s computer because Gareth would rather demonstrate craft, evidence, and product thinking than hand over another PDF. The retro styling is a design choice, not a biography.", "#about"),
  chunk("kb-iris-video", "iris", "IRIS pilot demo video", ["video", "demo", "watch", "vimeo", "pilot"], "A two-minute demo video filmed during the IRIS pilot is available on the IRIS tape. It shows an earlier build of the system in use.", "#iris", "verified-public"),

  chunk("kb-contact-email", "contact", "Email Gareth", ["email", "contact", "hire", "reach"], `The primary way to contact Gareth is ${siteContent.email}.`, "#contact", "verified-public"),
  chunk("kb-contact-linkedin", "contact", "LinkedIn", ["linkedin", "profile", "social"], `Gareth's public LinkedIn profile is ${siteContent.links.linkedin}.`, "#contact", "verified-public"),
  chunk("kb-contact-github", "contact", "GitHub", ["github", "code", "repositories", "open source"], `Gareth's GitHub is ${siteContent.links.github}.`, "#contact", "verified-public"),
  chunk("kb-contact-location", "contact", "Location", ["where", "location", "australia", "queensland"], `Gareth is based on the ${siteContent.location}.`, "#contact", "verified-public"),
  chunk("kb-contact-resume", "contact", "Résumé download", ["resume", "résumé", "cv", "pdf"], "A concise PDF résumé is available from the CONTACT tape and the quick-view contact section.", "#contact"),
] as const satisfies readonly KnowledgeChunk[];

export const knowledgeById = new Map(
  knowledgeRegistry.map((item) => [item.id, item] as const),
);
