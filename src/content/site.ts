export const siteContent = {
  name: "Gareth Beall",
  shortName: "Gareth",
  headline: "Lead AI/ML Engineer",
  differentiator:
    "Clinical pharmacist turned AI engineer. I ship RAG in healthcare, where safety and evals are non-negotiable and every pipeline stage has to survive scrutiny.",
  introduction:
    "I build production AI systems for work where evidence matters. My advantage is that I understand both sides: fifteen years of clinical pharmacy, including intensive care, and six years of AI/ML engineering. I've been building software since I was twelve.",
  location: "Sunshine Coast, Queensland, Australia",
  email: "gareth.beall@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/gareth-beall-835517321/",
    github: "https://github.com/gazb23",
    site: "https://garethbeall.com",
    opioid: "https://www.opioidconversioncalculator.com",
    namely: "https://namelyapp.com",
    restoredPhoto: "https://www.myrestoredphoto.com",
    inkyHealth: "https://inkyhealth.com",
  },
  proofPoints: [
    {
      eyebrow: "Clinical AI",
      title: "Built IRIS from idea to governed delivery",
      text: "A clinical RAG system for Queensland Health. I took it from first prototype to governed release, and tuned every pipeline stage until clinicians could rely on it.",
    },
    {
      eyebrow: "Rare context",
      title: "Fifteen years inside clinical practice",
      text: "Clinical pharmacy experience, including intensive care, shapes how I reason about evidence, ambiguity, human factors, and the consequences of confident errors.",
    },
    {
      eyebrow: "Product instinct",
      title: "Ships tools, not demonstrations",
      text: "Built and ran clinical calculators, consumer apps, photo restoration, and small AI experiments. All of them shipped to real users.",
    },
  ],
  iris: {
    name: "IRIS",
    label: "Clinical AI assistant for Queensland Health",
    summary:
      "IRIS is an AI assistant Gareth conceived and built for clinicians at Queensland Health. Staff ask a question in plain language and IRIS answers from the health service's own approved documents. Every answer shows its exact sources, and when the evidence isn't there, IRIS says so.",
    chapters: [
      ["What it does", "Answers clinical questions from approved local documents, with the supporting passages shown beside every answer."],
      ["How it works", "IRIS checks every document it ingests, searches by exact keywords and by meaning, and re-ranks the best passages before it writes an answer."],
      ["Runs in-house", "The AI models run on the hospital's own GPU servers, so sensitive data never leaves the network."],
      ["Built to be safe", "Tested against realistic clinical questions, including ones it should refuse. An honest \"I don't know\" beats confident guessing."],
      ["Delivered for real", "Security review, user acceptance testing with clinicians, controlled releases, monitoring, and ongoing operations."],
    ] as const,
    video: {
      page: "https://vimeo.com/1093612016",
      embed: "https://player.vimeo.com/video/1093612016",
      note: "Filmed during the pilot, on an earlier build of IRIS.",
    },
  },
  products: [
    {
      name: "Opioid Conversion Calculator",
      role: "Clinical product",
      description:
        "A medication-safety tool that puts specialist opioid-conversion knowledge into a focused, dependable interface for health professionals.",
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
        "A baby-name app that learns what you like as you swipe, instead of handing you an endless list.",
      href: "https://namelyapp.com",
      viewId: "NAMELY",
      embeddable: true,
    },
    {
      name: "My Restored Photo",
      role: "AI product",
      description:
        "AI photo restoration. Send a damaged photograph that matters to you, get it back repaired.",
      href: "https://www.myrestoredphoto.com",
      viewId: "PHOTO",
      embeddable: false,
    },
  ],
  resume: {
    fileName: "Gareth_Beall_Lead_AI_ML_Engineer_Resume.pdf",
    profile:
      "Lead AI/ML engineer with six years of hands-on AI and machine-learning engineering, and fifteen years of clinical pharmacy practice, including intensive care. Many people have built RAG applications; very few have shipped one in a healthcare environment, where safety and evaluation are critical and every part of the pipeline has to be scrutinised, picked apart, and tuned to state of the art. That is exactly what I did with IRIS at Queensland Health.",
    capabilities: [
      ["Clinical RAG", "Retrieval-augmented generation built for healthcare: grounded answers, citation continuity, honest abstention, and traceable evidence at every step."],
      ["Evaluation and safety", "Clinician-graded and automated evaluation suites, guardrails, scope controls, and prompt-injection defence. Every pipeline stage gets measured before it ships."],
      ["Retrieval and data", "Hybrid lexical and semantic search, embeddings, vector databases, reranking, OCR and document processing, PostgreSQL, and object storage."],
      ["Model serving", "Self-hosted inference on GPU infrastructure with vLLM: model loading, concurrency, latency, throughput, health, and fine-tuning."],
      ["Software and operations", "Python, TypeScript, APIs, workers, queues, Linux, Docker, Podman, CI/CD, monitoring, backup, and release management."],
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
