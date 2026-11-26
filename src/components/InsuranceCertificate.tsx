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
        <svg viewBox="0 0 48 56" width="40" height="46" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="insured-grad" x1="0" y1="0" x2="0.35" y2="1">
              <stop offset="0" stopColor="#e0a823" />
              <stop offset="0.55" stopColor="#5d9440" />
              <stop offset="1" stopColor="#14695f" />
            </linearGradient>
          </defs>
          {/* outer + inner shield outline, sparkle and tick (after the "Fully Insured" badge) */}
          <path stroke="url(#insured-grad)" strokeWidth="2.6" d="M24 2.5 44.5 8.5v18c0 13.5-9 22.5-20.5 27C12.5 49 3.5 40 3.5 26.5v-18z" />
          <path stroke="url(#insured-grad)" strokeWidth="1.8" d="M24 8 39.5 12.5v14c0 10.5-6.8 17.6-15.5 21.3C15.3 44.1 8.5 37 8.5 26.5v-14z" />
          <path fill="url(#insured-grad)" d="m21 15.5 1.2 3.3 3.3 1.2-3.3 1.2L21 24.5l-1.2-3.3-3.3-1.2 3.3-1.2z" />
          <path stroke="url(#insured-grad)" strokeWidth="3.2" d="m16.5 30 5.5 6 11-14" />
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
          <strong className="insured__title">Fully Insured</strong>
          <small className="insured__sub">Public Liability &amp; Treatment Risk Protected</small>
        </span>
        <span className="insured__cta">
          View Certificate
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
