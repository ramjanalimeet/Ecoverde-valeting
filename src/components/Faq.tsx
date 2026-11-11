"use client";

import { useState } from "react";
import { FAQS } from "@/data/site";
import { PlusIcon } from "./Icons";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="section section--soft faq-section" aria-labelledby="faq-title">
      <span className="leaves leaves--left" aria-hidden="true" />
      <div className="container">
        <p className="eyebrow eyebrow--center">Questions &amp; Answers</p>
        <h2 id="faq-title" className="center">
          Everything you need to <em>know</em>
        </h2>
        <div className="faq">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`faq__item${isOpen ? " is-open" : ""}`}>
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{f.q}</span>
                    <span className="faq__plus" aria-hidden="true">
                      <PlusIcon width={14} height={14} />
                    </span>
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!isOpen} className="faq__a">
                  <p>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
