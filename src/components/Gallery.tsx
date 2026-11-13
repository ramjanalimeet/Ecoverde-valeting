"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY, JOBS } from "@/data/site";

const ALL = [...GALLERY, ...JOBS];
import { ArrowRight, CloseIcon } from "./Icons";

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const step = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i === null ? i : (i + dir + ALL.length) % ALL.length));
  }, []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const item = index !== null ? ALL[index] : null;

  return (
    <section id="gallery" className="section section--soft" aria-labelledby="gallery-title">
      <div className="container">
        <p className="eyebrow eyebrow--center">Recent Work · Before &amp; After</p>
        <h2 id="gallery-title" className="center">
          Car valeting before &amp; <em>after</em> in West London
        </h2>
        <ul className="bento">
          {GALLERY.map((g, i) => (
            <li key={g.src} className={g.span ? `bento--${g.span}` : undefined}>
              <button
                type="button"
                className="bento__item"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setIndex(i);
                }}
                aria-label={`Open image: ${g.caption}`}
              >
                <Image src={g.src} alt={g.alt} fill sizes="(max-width: 640px) 50vw, 440px" />
                <span className="bento__caption">{g.caption}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="jobs">
          <h3 className="jobs__title">More recent jobs</h3>
          <ul className="jobs__row" aria-label="More recent jobs">
            {JOBS.map((j, k) => (
              <li key={j.src}>
                <button
                  type="button"
                  className="jobs__item"
                  onClick={(e) => {
                    lastTrigger.current = e.currentTarget;
                    setIndex(GALLERY.length + k);
                  }}
                  aria-label={`Open image: ${j.caption}`}
                >
                  <Image src={j.src} alt={j.alt} fill sizes="200px" />
                  <span className="jobs__caption">{j.caption}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={item?.caption ?? "Image viewer"}
        onClose={() => {
          setIndex(null);
          lastTrigger.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) setIndex(null);
        }}
      >
        {item && (
          <figure>
            <div className="lightbox__img">
              <Image src={item.src} alt={item.alt} fill sizes="90vw" />
            </div>
            <figcaption>
              {item.caption} <span>({(index ?? 0) + 1} / {ALL.length})</span>
            </figcaption>
          </figure>
        )}
        <button type="button" className="lightbox__close icon-btn" onClick={() => setIndex(null)} aria-label="Close image viewer">
          <CloseIcon />
        </button>
        <button type="button" className="lightbox__nav lightbox__nav--prev icon-btn" onClick={() => step(-1)} aria-label="Previous image">
          <ArrowRight style={{ transform: "rotate(180deg)" }} />
        </button>
        <button type="button" className="lightbox__nav lightbox__nav--next icon-btn" onClick={() => step(1)} aria-label="Next image">
          <ArrowRight />
        </button>
      </dialog>
    </section>
  );
}
