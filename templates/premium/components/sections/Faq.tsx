"use client";

import { useState } from "react";

interface Props {
  title: string;
  items: { q: string; a: string }[];
}

/**
 * FAQ accordion con apertura MORBIDA: il contenuto anima l'altezza via
 * grid-template-rows 0fr→1fr (transizione fluida, non lo scatto del <details>).
 */
export function Faq({ title, items }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 bg-canvas">
      <div className="container-narrow max-w-3xl">
        <div className="text-center mb-16">
          <p className="section-eyebrow">Domande frequenti</p>
          <h2 className="text-balance text-4xl md:text-5xl text-primary">{title}</h2>
        </div>
        <div className="divide-y divide-primary/10 border-y border-primary/10">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="py-6 md:py-7">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-8 text-left"
                >
                  <span className="text-lg md:text-xl font-semibold text-primary leading-snug">
                    {item.q}
                  </span>
                  <span
                    className={`flex-none text-accent text-3xl leading-none mt-1 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                <div className={`faq-answer ${isOpen ? "faq-answer--open" : ""}`}>
                  <div className="overflow-hidden">
                    <p className="pt-4 text-ink/70 leading-relaxed text-base md:text-lg max-w-2xl">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
