"use client";

import { useRef } from "react";
import Link from "next/link";
import { CloseIcon } from "./Icons";

export type IncludedGroup = { title: string; items: string[] };

/** "What's included" button that opens a modal with grouped checklists. */
export default function IncludedDialog({ name, groups, quoteHref }: { name: string; groups: IncludedGroup[]; quoteHref: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();
  return (
    <>
      <button
        type="button"
        className="btn btn--outline btn--block btn--sm"
        onClick={() => {
          ref.current?.showModal();
          document.documentElement.classList.add("modal-open");
        }}
        aria-haspopup="dialog"
      >
        What&apos;s included
      </button>
      <dialog
        ref={ref}
        className="incl"
        aria-label={`${name} — what's included`}
        onClose={() => document.documentElement.classList.remove("modal-open")}
        onClick={(e) => {
          if (e.target === ref.current) close();
        }}
      >
        <button type="button" className="incl__close icon-btn icon-btn--sm" onClick={close} aria-label="Close">
          <CloseIcon width={15} height={15} />
        </button>
        <p className="eyebrow">What&apos;s Included</p>
        <h3 className="incl__title">{name}</h3>
        {groups.map((g) => (
          <div key={g.title} className="incl__group">
            <p className="incl__head">{g.title}</p>
            <ul>
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
        <Link className="btn btn--primary btn--block" href={quoteHref} onClick={close}>
          Get a Free Quote
        </Link>
      </dialog>
    </>
  );
}
