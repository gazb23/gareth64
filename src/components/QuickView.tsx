import { siteContent } from "@/content/site";

import styles from "./quick-view.module.css";

interface QuickViewProps {
  readonly compact?: boolean;
}

export function QuickView({ compact = false }: QuickViewProps) {
  return (
    <article className={`${styles.view} ${compact ? styles.compact : ""}`} aria-label="Gareth Beall résumé quick view">
      <header className={styles.hero} id="about">
        <h1>{siteContent.name}</h1>
        <p className={styles.headline}>{siteContent.headline}</p>
        <p className={styles.introduction}>{siteContent.introduction}</p>
        <div className={styles.actions}>
          <a className={styles.primaryAction} href={`mailto:${siteContent.email}`}>Email Gareth</a>
          <a href={siteContent.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={siteContent.links.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href="/Gareth_Beall_Lead_AI_ML_Engineer_Resume.pdf" download>Download résumé</a>
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

      <section className={styles.caseStudy} id="iris">
        <div>
          <p className={styles.sectionLabel}>Selected system</p>
          <h2>{siteContent.iris.name}</h2>
          <p className={styles.caseLabel}>{siteContent.iris.label}</p>
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

      <section className={styles.products} id="products">
        <p className={styles.sectionLabel}>Independent products</p>
        <h2>Useful things, shipped</h2>
        <div className={styles.productGrid}>
          {siteContent.products.map((product) => (
            <a href={product.href} target="_blank" rel="noreferrer" key={product.name}>
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

