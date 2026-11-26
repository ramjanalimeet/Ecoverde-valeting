"use client";

import { useCallback, useRef } from "react";
import { CloseIcon } from "./Icons";

const PDF = "/documents/ecoverde-public-liability-insurance-certificate.pdf";
const PREVIEW = "/images/public-liability-insurance-certificate.webp";

/** Hero trust tile: "Fully Insured" — opens the public liability certificate in a pop-up. */
export default function InsuranceCertificate() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    d.showModal();
    document.documentElement.classList.add("modal-open");
  }, []);

  const close = useCallback(() => {
    const d = dialogRef.current;
    if (!d?.open || d.classList.contains("is-closing")) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      d.close();
      return;
    }
    d.classList.add("is-closing");
    const done = () => {
      clearTimeout(fallback);
      d.removeEventListener("animationend", onEnd);
      d.classList.remove("is-closing");
      d.close();
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target === d) done();
    };
    d.addEventListener("animationend", onEnd);
    const fallback = setTimeout(done, 400);
  }, []);

  return (
    <li className="hero__tile--link hero__tile-insured">
      <span className="insured__shield" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="insured-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#d9a520" />
              <stop offset="0.55" stopColor="#2ca56f" />
              <stop offset="1" stopColor="#147c71" />
            </linearGradient>
          </defs>
          <path stroke="url(#insured-grad)" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path stroke="url(#insured-grad)" d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
      </span>
      <button
        type="button"
        className="hero__tile-link insured__btn"
        onClick={open}
        aria-haspopup="dialog"
        title="View our public liability insurance certificate"
      >
        <span className="insured__text">
          <strong>Fully Insured · £1m Public Liability</strong>
          <small>Underwritten by U K Insurance Ltd (Direct Line)</small>
        </span>
        <span className="insured__cta">
          View certificate
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className="quote-modal cert-modal"
        aria-labelledby="cert-modal-title"
        onClose={() => {
          document.documentElement.classList.remove("modal-open");
          lastFocus.current?.focus?.();
        }}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="cert-modal__head">
          <div>
            <p id="cert-modal-title" className="cert-modal__title">
              Certificate of Public Liability Insurance
            </p>
            <p className="cert-modal__sub">£1m cover · valid 10 May 2026 – 09 May 2027</p>
          </div>
          <a className="cert-modal__pdf" href={PDF} target="_blank" rel="noopener">
            Open PDF
          </a>
          <button type="button" className="cert-modal__close icon-btn icon-btn--sm" onClick={close} aria-label="Close certificate">
            <CloseIcon width={16} height={16} />
          </button>
        </div>
        <div className="cert-modal__body">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PREVIEW}
            width={1489}
            height={2105}
            loading="lazy"
            decoding="async"
            alt="Certificate of Public Liability Insurance for EcoVerde Valeting Service: £1m indemnity limit, insurer U K Insurance Limited, valid 10 May 2026 to 09 May 2027"
          />
        </div>
      </dialog>
    </li>
  );
}
