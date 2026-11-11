"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY } from "@/data/site";
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
    setIndex((i) => (i === null ? i : (i + dir + GALLERY.length) % GALLERY.length));
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

  const item = index !== null ? GALLERY[index] : null;

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
              {item.caption} <span>({(index ?? 0) + 1} / {GALLERY.length})</span>
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
