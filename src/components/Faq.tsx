"use client";

import { useState } from "react";
import { FAQS } from "@/data/site";
import { ChevronDown } from "./Icons";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="section section--muted" aria-labelledby="faq-title">
      <div className="container container--narrow">
        <div className="section-head section-head--center">
          <p className="eyebrow">Questions &amp; Answers</p>
          <h2 id="faq-title">Everything you need to know</h2>
        </div>
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
                    <ChevronDown width={20} height={20} />
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
