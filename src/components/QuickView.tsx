import Link from "next/link";

import { siteContent } from "@/content/site";

import styles from "./quick-view.module.css";

interface QuickViewProps {
  readonly compact?: boolean;
  readonly embedded?: boolean;
}

export function QuickView({ compact = false, embedded = false }: QuickViewProps) {
  return (
    <article className={`${styles.view} ${compact ? styles.compact : ""}`} aria-label="Gareth Beall résumé quick view">
      <nav className={styles.navigation} aria-label="Résumé navigation">
        {!embedded && <Link href="/">← Gareth64</Link>}
        <div><a href="#experience">Experience</a><a href="#iris">IRIS</a><a href="#products">Products</a><a href="#contact">Contact</a></div>
      </nav>
      <header className={styles.hero} id="about">
        <p className={styles.kicker}>{siteContent.location}</p>
        <h1>{siteContent.name}</h1>
        <p className={styles.headline}>{siteContent.headline}</p>
        <p className={styles.introduction}>{siteContent.resume.profile}</p>
        <div className={styles.actions}>
          <a className={styles.primaryAction} href={`mailto:${siteContent.email}`}>Email Gareth</a>
          <a href={siteContent.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={siteContent.links.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`/${siteContent.resume.fileName}`} download>Download résumé</a>
        </div>
      </header>

      <section className={styles.proofGrid} aria-label="Strongest evidence">
        {siteContent.proofPoints.map((point, index) => (
          <article className={styles.proof} key={point.title}>
            <span>0{index + 1}</span>
            <p>{point.eyebrow}</p>
            <h2>{point.title}</h2>
            <p>{point.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.experience} id="experience">
        <div className={styles.sectionHeading}><p className={styles.sectionLabel}>Experience</p><h2>What I&#39;ve built.</h2></div>
        <div className={styles.timeline}>
          {siteContent.resume.experience.map((job) => (
            <article className={styles.job} key={job.organisation}>
              <div><p className={styles.period}>{job.period}</p><h3>{job.role}</h3><p className={styles.organisation}>{job.organisation}</p><p className={styles.jobLocation}>{job.location}</p></div>
              <ul>{job.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.caseStudy} id="iris">
        <div>
          <p className={styles.sectionLabel}>Selected system</p>
          <h2>{siteContent.iris.name}</h2>
          <p className={styles.caseLabel}>{siteContent.iris.label}</p>
          <a className={styles.demoLink} href={siteContent.iris.video.page} target="_blank" rel="noreferrer">Watch the pilot demo ↗</a>
          <p className={styles.demoNote}>{siteContent.iris.video.note}</p>
          <figure className={styles.pipeline}>
            <figcaption>From source to answer</figcaption>
            <ol>
              <li><span>01</span><div><strong>Approved documents</strong><small>Ingest, check, version</small></div></li>
              <li><span>02</span><div><strong>Find the evidence</strong><small>Hybrid search + reranking</small></div></li>
              <li><span>03</span><div><strong>Answer with sources</strong><small>Supporting passages included</small></div></li>
            </ol>
            <p>Insufficient evidence? Say so.</p>
          </figure>
        </div>
        <div>
          <p className={styles.caseSummary}>{siteContent.iris.summary}</p>
          <dl className={styles.chapterList}>
            {siteContent.iris.chapters.map(([title, text]) => (
              <div key={title}>
                <dt>{title}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={styles.capabilities} id="capabilities">
        <div className={styles.sectionHeading}><p className={styles.sectionLabel}>Engineering</p><h2>The work behind the answer.</h2></div>
        <dl>{siteContent.resume.capabilities.map(([title, description]) => <div key={title}><dt>{title}</dt><dd>{description}</dd></div>)}</dl>
        <p className={styles.education}><strong>{siteContent.resume.education.qualification}</strong> · {siteContent.resume.education.institution} · {siteContent.resume.education.year}</p>
      </section>

      <section className={styles.products} id="products">
        <p className={styles.sectionLabel}>Independent products</p>
        <h2>Useful things, shipped</h2>
        <div className={styles.productGrid}>
          {siteContent.products.map((product, index) => (
            <a href={product.href} target="_blank" rel="noreferrer" key={product.name}>
              <div className={styles.productArt} aria-hidden="true" data-project={product.viewId}>
                <span>0{index + 1}</span>
                <svg viewBox="0 0 240 110" fill="none">
                  {product.viewId === "OPIOID" ? <><path d="M20 58h46l12-25 18 54 19-70 19 49 12-20h72" /><rect x="91" y="5" width="58" height="100" rx="12" /></> :
                   product.viewId === "INKY" ? <><rect x="70" y="8" width="70" height="90" rx="4" /><path d="M85 30h36M85 44h36M85 58h18" /><circle cx="145" cy="70" r="21" /><path d="m161 86 21 21" /></> :
                   product.viewId === "NAMELY" ? <><rect x="62" y="16" width="64" height="85" rx="9" transform="rotate(-12 62 16)" /><rect x="113" y="5" width="64" height="85" rx="9" transform="rotate(12 113 5)" /><path d="M128 43c-14-13-22 7 7 24 30-20 17-36 5-24l-6 6z" /></> :
                   <><rect x="64" y="10" width="110" height="85" rx="3" /><circle cx="142" cy="34" r="9" /><path d="m66 83 34-37 23 27 15-14 34 29M119 10l-8 24 12 13-14 23 9 25" /></>}
                </svg>
              </div>
              <span>{product.role}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <strong>Visit project ↗</strong>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.closing} id="contact">
        <p className={styles.sectionLabel}>Contact</p>
        <h2>Let&#39;s talk.</h2>
        <p>{siteContent.location}</p>
        <a href={`mailto:${siteContent.email}`}>{siteContent.email}</a>
      </section>
    </article>
  );
}

