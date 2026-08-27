"use client";

import { useEffect, useState } from "react";

import type { ViewTarget } from "@/content/views";

import styles from "./gareth64.module.css";

const LOAD_STEPS = [
  "DIALING REMOTE HOST",
  "CARRIER DETECTED — 300 BAUD",
  "NEGOTIATING PROTOCOL",
  "RENDERING TRANSMISSION",
] as const;

interface ScreenViewerProps {
  readonly view: ViewTarget;
  readonly reducedMotion: boolean;
  readonly onClose: () => void;
}

export function ScreenViewer({ view, reducedMotion, onClose }: ScreenViewerProps) {
  const [step, setStep] = useState(reducedMotion ? LOAD_STEPS.length : 0);
  const live = step >= LOAD_STEPS.length;

  useEffect(() => {
    if (live) return;
    const id = window.setInterval(() => {
      setStep((current) => Math.min(LOAD_STEPS.length, current + 1));
    }, 380);
    return () => window.clearInterval(id);
  }, [live]);

  return (
    <div className={styles.viewer}>
      <div className={styles.viewerBar}>
        <span className={styles.viewerTitle}>{view.label}</span>
        <span className={styles.viewerActions}>
          <a href={view.pageUrl} target="_blank" rel="noreferrer">POP OUT ↗</a>
          <button type="button" onClick={onClose}>CLOSE [ESC]</button>
        </span>
      </div>
      {live ? (
        <iframe
          className={styles.viewerFrame}
          src={view.embedUrl}
          title={view.label}
          loading="eager"
          allow={view.kind === "video" ? "autoplay; fullscreen; picture-in-picture; encrypted-media" : undefined}
          allowFullScreen={view.kind === "video"}
        />
      ) : (
        <div className={styles.viewerLoading} aria-live="polite">
          {LOAD_STEPS.slice(0, step + 1).map((line, index) => (
            <p key={line}>
              {line}
              {index === step ? <span className={styles.viewerCursor} aria-hidden="true" /> : "  OK"}
            </p>
          ))}
          <p className={styles.viewerUrl}>URL: {view.pageUrl.toUpperCase()}</p>
          <div className={styles.viewerProgress} aria-hidden="true">
            <i style={{ width: `${Math.min(100, ((step + 1) / (LOAD_STEPS.length + 1)) * 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
