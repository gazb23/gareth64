export const siteContent = {
  name: "Gareth Beall",
  shortName: "Gareth",
  headline: "Lead AI/ML Engineer",
  differentiator:
    "I build AI systems and software products. Most recently, I built IRIS, a clinical RAG system I'm taking into production for 5,000 Queensland Health clinicians. I've been coding since I was twelve and still can't leave an interesting problem alone. Away from work, I'm a husband, father, surfer and musician.",
  introduction:
    "I lead IRIS engineering at Queensland Health, from document ingestion and retrieval through model serving, evaluation, and release. I also spent fifteen years as a clinical pharmacist, including intensive care.",
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
      title: "Built IRIS for 5,000 clinicians",
      text: "I built the first prototype, brought it into Queensland Health, and now lead its production rollout.",
    },
    {
      eyebrow: "Clinical background",
      title: "Fifteen years as a clinical pharmacist",
      text: "My experience includes intensive care. It helps me spot answers that look plausible but are unsupported, wrong for the patient, or unsafe.",
    },
    {
      eyebrow: "Product work",
      title: "Built a clinical app used by 50,000 health professionals",
      text: "I built and run Opioid Conversion Calculator. I also built Namely and My Restored Photo.",
    },
  ],
  iris: {
    name: "IRIS",
    label: "Clinical AI assistant for Queensland Health",
    summary:
      "IRIS answers clinicians' questions from Queensland Health's approved documents. I conceived and built it. I now lead its production rollout. Each answer shows its sources. If the evidence is not there, IRIS says so.",
    chapters: [
      ["What it does", "Answers clinical questions from approved local documents, with the supporting passages shown beside every answer."],
      ["How it works", "IRIS checks every document it ingests, searches by exact keywords and by meaning, and re-ranks the best passages before it writes an answer."],
      ["Runs in-house", "IRIS runs on Queensland Health's own GPU servers. Sensitive data stays on the network."],
      ["Built to be safe", "I test IRIS against realistic clinical questions, including questions it should refuse. An honest \"I don't know\" beats a confident guess."],
      ["Rollout", "The rollout covers security review, clinician user acceptance testing, controlled releases, monitoring, and support."],
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
        "A medication-safety app that helps health professionals calculate opioid conversions using specialist clinical content.",
      href: "https://www.opioidconversioncalculator.com",
      viewId: "OPIOID",
      embeddable: true,
    },
    {
      name: "Inky Health",
      role: "Health AI venture",
      description:
        "Private, self-hosted document AI for health and government organisations whose data cannot leave their network. It covers search, structured extraction, and redaction.",
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
        "Restores damaged photographs with AI. Uploads stay private and are deleted on schedule.",
      href: "https://www.myrestoredphoto.com",
      viewId: "PHOTO",
      embeddable: false,
    },
  ],
  resume: {
    fileName: "Gareth_Beall_Lead_AI_ML_Engineer_Resume.pdf",
    profile:
      "I have six years' experience in AI and ML engineering and fifteen years as a clinical pharmacist, including intensive care. I conceived and built IRIS and now lead its production rollout at Queensland Health. My work covers clinical RAG, self-hosted model inference, evaluation, fine-tuning, safety, and release.",
    capabilities: [
      ["Clinical RAG", "Grounded answers that preserve citations and show their evidence. The system refuses when its sources do not support an answer."],
      ["Evaluation and safety", "Clinician-graded and automated evals for ingestion, retrieval, reranking, prompts, and models. Guardrails, scope controls, and prompt-injection defence."],
      ["Retrieval and data", "Hybrid lexical and semantic search, embeddings, vector databases, reranking, OCR and document processing, PostgreSQL, and object storage."],
      ["Model serving", "Run vLLM on self-hosted GPU infrastructure. Tune model loading, concurrency, latency, and throughput. Fine-tune smaller models for defined clinical tasks."],
      ["Software and operations", "Python, TypeScript, APIs, workers, queues, Linux, Docker, Podman, CI/CD, monitoring, backup, and release management."],
    ] as const,
    experience: [
      {
        role: "Lead AI/ML Engineer",
        organisation: "Sunshine Coast Hospital and Health Service",
        period: "February 2025 to present",
        location: "Hybrid, Sunshine Coast, Queensland",
        highlights: [
          "Conceived and built IRIS and now lead its production rollout to 5,000 Queensland Health clinicians.",
          "Built auditable ingestion for PDF, Word, and web content, covering text, tables, and images. Added source identity, version detection, and quarantine for material that must not be retrieved.",
          "Built hybrid lexical and semantic retrieval, reranking, and row-level table retrieval. Preserved citations from retrieved passages to the final answer and tested the system against realistic clinical questions.",
          "Run self-hosted model inference and document processing on GPU infrastructure. Manage containers, model loading, concurrency, health, latency, and throughput.",
          "Curate clinical training and evaluation datasets. Run clinician-graded and automated evals and fine-tune smaller models for defined clinical tasks. Use failures to decide what to change next.",
          "Built the services around IRIS, including APIs, workers, queues, PostgreSQL, and object storage. Added admin tools, audit records, monitoring, backup, restore, and controlled releases.",
        ] as const,
      },
      {
        role: "Founder and Software Engineer",
        organisation: "E2 Apps",
        period: "September 2022 to present",
        location: "Remote, Sunshine Coast, Queensland",
        highlights: [
          "Built and run Opioid Conversion Calculator, a medication-safety app used by more than 50,000 health professionals. Wrote its clinical content, built the Flutter app and backend, and manage analytics, subscriptions, releases, and support.",
          "Built Namely, a baby-name app that learns from each swipe. Also built My Restored Photo, an AI photo-restoration service with private uploads, editing, payments, and scheduled deletion.",
        ] as const,
      },
      {
        role: "Founder and AI Engineer",
        organisation: "Inky Health",
        period: "August 2026 to present",
        location: "Remote, Sunshine Coast, Queensland",
        highlights: [
          "Develop private, self-hosted document AI for health and government organisations whose data must stay on their network. Work covers document search, structured extraction, redaction, and agent workflows.",
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
