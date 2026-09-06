// Shared by the website, public AI evidence and downloadable resume.
const engineeringSections = [
  {
    "title": "Document processing, retrieval and context",
    "bullets": [
      "Unified over 10,000 guidelines across PDFs, Word files and web pages. Built collection, scraping and update workflows, reconciling poor structure while retaining source identity and history. Combined vision-language and language models to use image and text evidence.",
      "Built hybrid search, reranking and table-row retrieval, with evidence selection, conversation history and token budgets. Linked answers to their supporting sources.",
      "Worked with clinical departments to handle differing guideline recommendations. Adapted retrieval and answer context to departmental resource preferences, the user, clinical question and patient context."
    ]
  },
  {
    "title": "Application engineering and AI-assisted delivery",
    "bullets": [
      "Built TypeScript/Next.js APIs and PostgreSQL/pg-boss processing jobs, with indexing readiness checks, bounded retries, visible failures and recovery.",
      "Built AI-assisted development gates: linting, type checks, tests, automated PR reviews and CI/CD. Encoded recurring mistakes in regression checks and shared agent skills; added migration and recovery tooling."
    ]
  },
  {
    "title": "Retrieval evaluation and model development",
    "bullets": [
      "Deployed matched table evidence in reranker inputs after local evaluation recovered previously missed answers. Kept full source sections available for answer generation and citations.",
      "Fine-tuned and deployed a reranker, comparing variants on real clinician questions using NDCG@10, MRR, recall and latency. Also used synthetic queries and teacher-labelled training data.",
      "Checked training/evaluation overlap and grouped related queries. Used paired comparisons, confidence intervals and broad regressions, then clinician-graded and automated answer checks to trace failures and assess improvements."
    ]
  },
  {
    "title": "GPU architecture and model serving",
    "bullets": [
      "Selected GPUs and designed VM layouts for self-hosted OCR, embeddings, reranking and LLMs, including vLLM. Chose models and external APIs against benchmarks, representative documents, hardware and privacy requirements.",
      "Operated model services with health checks and recovery. Optimised GPU memory, concurrency, KV-cache use and quantisation; load-tested throughput, tail latency, errors and timeouts."
    ]
  },
  {
    "title": "Clinical workflow, governance and delivery",
    "bullets": [
      "Completed the Foundational Artificial Intelligence Risk Assessment (FAIRA) and worked through the proposal with Queensland Health cybersecurity. Deployed a PII-detection model and implemented role-based access controls."
    ]
  }
] as const;

export const siteContent = {
  "name": "Gareth Beall",
  "shortName": "Gareth",
  "headline": "Lead AI/ML Engineer",
  "differentiator": "I build AI systems and software products. I conceived and built IRIS, now in clinical use following a rollout covering 5,000 Queensland Health clinicians. I've been coding since I was twelve and still can't leave an interesting problem alone. Away from work, I'm a husband, father, surfer and musician.",
  "introduction": "I lead IRIS engineering at Queensland Health, from document ingestion and retrieval through model serving, evaluation, and release. I also spent fifteen years as a clinical pharmacist, including intensive care.",
  "location": "Sunshine Coast, Queensland, Australia",
  "email": "gareth.beall@gmail.com",
  "links": {
    "linkedin": "https://www.linkedin.com/in/gareth-beall-835517321/",
    "github": "https://github.com/gazb23",
    "site": "https://garethbeall.com",
    "opioid": "https://www.opioidconversioncalculator.com",
    "namely": "https://namelyapp.com",
    "restoredPhoto": "https://www.myrestoredphoto.com",
    "inkyHealth": "https://inkyhealth.com"
  },
  "proofPoints": [
    {
      "eyebrow": "Clinical AI",
      "title": "IRIS is in clinical use",
      "text": "I conceived, built and rolled out the service across hospitals covering 5,000 Queensland Health clinicians."
    },
    {
      "eyebrow": "Clinical background",
      "title": "Fifteen years as a clinical pharmacist",
      "text": "My experience includes intensive care. It helps me spot answers that look plausible but are unsupported, wrong for the patient, or unsafe."
    },
    {
      "eyebrow": "Product work",
      "title": "Over 50,000 app downloads worldwide",
      "text": "I built Opioid Conversion Calculator to address gaps in existing clinical tools. I also built Namely and My Restored Photo."
    }
  ],
  "iris": {
    "name": "IRIS",
    "label": "Clinical AI assistant for Queensland Health",
    "summary": "I conceived, built and rolled out IRIS to help clinicians find reliable answers in scattered hospital documents. It is in clinical use across hospitals covering 5,000 Queensland Health clinicians, with a corpus of over 10,000 guidelines and answers linked to their sources.",
    "chapters": [
      [
        "Document processing",
        "Collected and reconciled PDFs, Word files and web pages, retaining source identity and version history. Combined vision-language and language models to use image and text evidence."
      ],
      [
        "Retrieval and context",
        "Built hybrid search, table-row retrieval and context selection. Worked with departments to account for preferred resources, the clinical question and patient context."
      ],
      [
        "Evaluation and deployment",
        "Compared rerankers using real clinician questions, ranking metrics and latency. Deployed a selected fine-tuned reranker and matched table evidence after evaluation recovered previously missed answers."
      ],
      [
        "Infrastructure and governance",
        "Designed on-premises GPU infrastructure, completed FAIRA, worked with Queensland Health cybersecurity, and deployed PII detection and role-based access controls."
      ],
      [
        "Early results",
        "In a comparison involving 200 clinicians answering set clinical questions, time to a correct answer averaged about 27 minutes with the existing hospital search portal; with IRIS, most answers were found in under one minute. After the first month of wider use, 98% of surveyed clinicians would recommend IRIS."
      ]
    ],
    "video": {
      "page": "https://vimeo.com/1093612016",
      "embed": "https://player.vimeo.com/video/1093612016",
      "note": "Filmed during the pilot, on an earlier build of IRIS."
    },
    "comparison": "In a comparison involving 200 clinicians answering set clinical questions, time to a correct answer averaged about 27 minutes with the existing hospital search portal; with IRIS, most answers were found in under one minute.",
    "recommendation": "After the first month of wider use, 98% of surveyed clinicians would recommend IRIS."
  },
  "products": [
    {
      "name": "Opioid Conversion Calculator",
      "role": "Clinical product",
      "description": "Built to address gaps in existing clinical tools, using my pharmacy experience to shape its content and workflows. Over 50,000 downloads worldwide and climbing.",
      "href": "https://www.opioidconversioncalculator.com",
      "viewId": "OPIOID",
      "embeddable": true
    },
    {
      "name": "Inky Health",
      "role": "Consultancy in development",
      "description": "I am establishing Inky Health, an independent consultancy focused on document systems and private AI.",
      "href": "https://inkyhealth.com",
      "viewId": "INKY",
      "embeddable": true
    },
    {
      "name": "Namely",
      "role": "Consumer product",
      "description": "A baby-name app that learns what you like as you swipe, instead of handing you an endless list.",
      "href": "https://namelyapp.com",
      "viewId": "NAMELY",
      "embeddable": true
    },
    {
      "name": "My Restored Photo",
      "role": "AI product",
      "description": "Restores damaged photographs with AI. Uploads stay private and are deleted on schedule.",
      "href": "https://www.myrestoredphoto.com",
      "viewId": "PHOTO",
      "embeddable": false
    }
  ],
  "resume": {
    "fileName": "Gareth_Beall_Lead_AI_ML_Engineer_Resume.pdf",
    "profile": "I conceived and built IRIS to help clinicians find reliable answers in scattered hospital documents. The service is in clinical use following a rollout covering 5,000 Queensland Health clinicians. After the first month of wider use, 98% of surveyed clinicians would recommend it.",
    "capabilities": [
      [
        "Software",
        "Python, TypeScript/JavaScript, Dart, Java, Kotlin, SQL; Node.js, React, Next.js, Flutter, SwiftUI; APIs, authentication and integrations."
      ],
      [
        "Cloud and infrastructure",
        "Extensive Azure work; AWS EC2 and GPU instances for language-model training; Firebase, Linux, VM security, vLLM, Docker and Podman."
      ],
      [
        "Data and recovery",
        "PostgreSQL/pgvector, MySQL, BM25, hybrid search, Drizzle and pg-boss; migrations, custom backups, write-ahead logging and Rubrik."
      ],
      [
        "AI engineering",
        "Model selection, RAG, context engineering, OCR, vision-language models, reranker fine-tuning and evaluation; self-hosted services and external APIs; inference optimisation, assessing when quantisation is appropriate, and KV-cache optimisation."
      ]
    ],
    "experience": [
      {
        "role": "Lead AI/ML Engineer",
        "organisation": "Sunshine Coast Hospital and Health Service",
        "period": "February 2025 to present",
        "location": "Queensland Health",
        "highlights": [
          "Primary engineer for a hospital AI programme with multimillion-dollar funding. Defined requirements with cybersecurity, hospital and statewide document custodians, and clinical departments.",
          "In a comparison involving 200 clinicians answering set clinical questions, time to a correct answer averaged about 27 minutes with the existing hospital search portal; with IRIS, most answers were found in under one minute."
        ]
      },
      {
        "role": "Founder",
        "organisation": "Inky Health",
        "period": "August 2026 to present",
        "location": "Sunshine Coast, Queensland",
        "highlights": [
          "Establishing an independent consultancy focused on document systems and private AI."
        ]
      },
      {
        "role": "Founder and software engineer",
        "organisation": "E2 Apps",
        "period": "September 2022 to present",
        "location": "Sunshine Coast, Queensland",
        "highlights": [
          "Built Opioid Conversion Calculator to address gaps in existing tools, using my clinical experience to shape its content and workflows. Now with over 50,000 downloads worldwide and climbing.",
          "Created Namely while my wife was pregnant, designing a baby-name app around features missing from other products and the experience parents needed.",
          "Built My Restored Photo with AI restoration, uploads, editing, payments and scheduled file deletion."
        ]
      },
      {
        "role": "Earlier independent work",
        "organisation": "Independent projects",
        "period": "2019-2021",
        "location": "",
        "highlights": [
          "Began self-directed AI/ML learning, small projects and hospital workflow automations during this period. This work later led to IRIS.",
          "Created Find the Treasure to encourage outdoor exploration through competitive mobile treasure hunts. Attracted over 10,000 users and raised more than $100,000, all for charity."
        ]
      }
    ],
    "education": {
      "qualification": "Bachelor of Pharmacy",
      "institution": "The University of Queensland",
      "year": "2008"
    },
    "headline": "Lead AI/ML Engineer | Applied AI and production systems",
    "engineeringSections": engineeringSections,
    "clinicalBackground": "Fifteen years in clinical pharmacy, including intensive care."
  },
  "starterQuestions": [
    "Who is Gareth?",
    "What makes him different?",
    "What did he build with IRIS?",
    "What products has he shipped?"
  ]
} as const;

export type SiteContent = typeof siteContent;
