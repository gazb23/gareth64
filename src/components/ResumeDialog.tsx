"use client";

import { useEffect, useRef, type ReactNode } from "react";

import styles from "./gareth64.module.css";

export function ResumeDialog({ children, onClose }: {
  readonly children: ReactNode;
  readonly onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog ref={dialogRef} className={styles.quickOverlay} aria-label="Gareth Beall résumé" onCancel={onClose}>
      <header className={styles.dialogBar}><button className={styles.closeOverlay} type="button" onClick={onClose}>BACK TO COMPUTER [ESC]</button></header>
      {children}
    </dialog>
  );
}
