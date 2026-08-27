export const siteContent = {
  name: "Gareth Beall",
  shortName: "Gareth",
  headline: "Lead AI/ML Engineer",
  differentiator:
    "Clinical pharmacist turned AI engineer, building retrieval systems that can survive real governance, safety, and operational constraints.",
  introduction:
    "I build production AI systems for work where evidence matters. My unusual advantage is that I understand both sides of the interface: fifteen years of clinical pharmacy, including intensive care, and the engineering needed to turn retrieval, evaluation, inference, safety, and release processes into a dependable product.",
  location: "Sunshine Coast, Queensland, Australia",
  email: "gareth.beall@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/gareth-beall-835517321/",
    github: "https://github.com/gazb23",
    work: "https://inkyhealth.com/work",
    opioid: "https://www.opioidconversioncalculator.com",
    namely: "https://namelyapp.com",
    restoredPhoto: "https://www.myrestoredphoto.com",
    inkyHealth: "https://inkyhealth.com",
  },
  proofPoints: [
    {
      eyebrow: "Clinical AI",
      title: "Built IRIS from idea to governed delivery",
      text: "Led the engineering of a public-sector clinical RAG system through ingestion, retrieval, reranking, evaluation, self-hosted inference, safety controls, UAT, release, and operations.",
    },
    {
      eyebrow: "Rare context",
      title: "Fifteen years inside clinical practice",
      text: "Clinical pharmacy experience, including intensive care, shapes how I reason about evidence, ambiguity, human factors, and the consequences of confident errors.",
    },
    {
      eyebrow: "Product instinct",
      title: "Ships tools, not demonstrations",
      text: "Built and operated products spanning clinical calculators, consumer apps, photographic restoration, and small AI experiments.",
    },
  ],
  iris: {
    name: "IRIS",
    label: "Clinical AI assistant for Queensland Health",
    summary:
      "IRIS is an AI assistant Gareth conceived and built for clinicians at Queensland Health. Staff ask a question in plain language and IRIS answers from the health service's own approved documents — showing the exact sources behind every answer, and saying so honestly when the evidence isn't there.",
    chapters: [
      ["What it does", "Answers clinical questions from approved local documents, with the supporting passages shown beside every answer."],
      ["How it works", "Documents are ingested and checked, search combines exact keywords with meaning-based matching, and the best passages are re-ranked before the answer is written."],
      ["Runs in-house", "The AI models run on the hospital's own GPU servers, so sensitive data never leaves the network."],
      ["Built to be safe", "Tested against realistic clinical questions — including ones it should refuse — with guardrails and honest \"I don't know\" behaviour instead of confident guessing."],
      ["Delivered for real", "Security review, user acceptance testing with clinicians, controlled releases, monitoring, and ongoing operations."],
    ] as const,
    video: {
      page: "https://vimeo.com/1093612016",
      embed: "https://player.vimeo.com/video/1093612016",
      note: "Filmed during the pilot — an earlier build of IRIS.",
    },
  },
  products: [
    {
      name: "Opioid Conversion Calculator",
      role: "Clinical product",
      description:
        "A medication-safety tool for health professionals: specialist opioid-conversion knowledge in a focused, dependable interface.",
      href: "https://www.opioidconversioncalculator.com",
      viewId: "OPIOID",
      embeddable: true,
    },
    {
      name: "Inky Health",
      role: "Health AI venture",
      description:
        "Private, self-hosted document AI for health and government: search, structured extraction, and redaction for organisations whose data cannot leave their own network.",
      href: "https://inkyhealth.com",
      viewId: "INKY",
      embeddable: true,
    },
    {
      name: "Namely",
      role: "Consumer product",
      description:
        "A baby-name discovery app built around playful exploration and preference signals rather than endless lists.",
      href: "https://namelyapp.com",
      viewId: "NAMELY",
      embeddable: true,
    },
    {
      name: "My Restored Photo",
      role: "AI product",
      description:
        "AI photo restoration for something people immediately understand: recovering a damaged photograph that matters to them.",
      href: "https://www.myrestoredphoto.com",
      viewId: "PHOTO",
      embeddable: false,
    },
  ],
  resume: {
    fileName: "Gareth_Beall_Lead_AI_ML_Engineer_Resume.pdf",
    profile:
      "Lead AI/ML engineer and clinical pharmacist with fifteen years of clinical practice, including intensive care. I build production AI systems for settings where evidence, safety, governance, and operational reliability matter.",
    capabilities: [
      ["Clinical AI", "RAG, agent workflows, prompt and tool design, model evaluation, safety controls, and fine-tuning."],
      ["Retrieval and data", "Hybrid lexical and semantic search, embeddings, vector databases, reranking, PostgreSQL, and object storage."],
      ["Software and operations", "Python, TypeScript, APIs, workers, queues, vLLM, Linux, Docker, Podman, CI/CD, monitoring, backup, and release management."],
    ] as const,
    experience: [
      {
        role: "Lead AI/ML Engineer",
        organisation: "Sunshine Coast Hospital and Health Service",
        period: "February 2025 to present",
        location: "Hybrid, Sunshine Coast, Queensland",
        highlights: [
          "Conceived and built the initial IRIS clinical RAG system, then led its engineering into a governed Queensland Health delivery context for clinical evaluation and user acceptance testing.",
          "Built auditable ingestion for PDF, Word, and web content, including text, tables, images, source identity, version detection, and quarantine paths for material that should not be retrieved.",
          "Built hybrid lexical and semantic retrieval, reranking, row-level table retrieval, citation continuity, and evaluation against realistic clinical questions.",
          "Operate self-hosted model-serving and document-processing workloads on GPU infrastructure, covering containers, model loading, concurrency, health, latency, and throughput.",
          "Treat prompts, retrieval, reranking, and model changes as experiments, using clinician-graded and automated evaluations to study failures and decide what to change next.",
          "Built the surrounding delivery system across APIs, workers, queues, PostgreSQL, object storage, administration tools, audit records, observability, migrations, backup, restore, and controlled releases.",
        ] as const,
      },
      {
        role: "Founder and Software Engineer",
        organisation: "E2 Apps",
        period: "September 2022 to present",
        location: "Remote, Sunshine Coast, Queensland",
        highlights: [
          "Built and operate Opioid Conversion Calculator, a focused medication-safety product for health professionals, including its clinical content, Flutter app, backend, analytics, subscriptions, releases, monitoring, and support.",
          "Shipped Namely, a preference-led baby-name discovery product, and My Restored Photo, an AI-assisted photo-restoration service with uploads, processing, editing, payments, private storage, and scheduled deletion.",
        ] as const,
      },
      {
        role: "Founder and AI Engineer",
        organisation: "Inky Health",
        period: "August 2026 to present",
        location: "Remote, Sunshine Coast, Queensland",
        highlights: [
          "Develop private, self-hosted document AI for health and government settings where sensitive data cannot leave the organisation's network, including document search, structured extraction, redaction, and agent workflows.",
        ] as const,
      },
    ] as const,
    education: {
      qualification: "Bachelor of Pharmacy",
      institution: "The University of Queensland",
      year: "2008",
    },
  },
  starterQuestions: [
    "Who is Gareth?",
    "What makes him different?",
    "What did he build with IRIS?",
    "What products has he shipped?",
  ],
} as const;

export type SiteContent = typeof siteContent;
