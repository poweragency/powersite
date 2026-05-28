"use client";

import { useState } from "react";

interface Props {
  title: string;
  items: { q: string; a: string }[];
}

/**
 * FAQ accordion con apertura MORBIDA (grid-template-rows 0fr→1fr) invece dello
 * scatto del <details> nativo.
 */
export function Faq({ title, items }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28">
      <div className="container-narrow max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-12">
          {title}
        </h2>
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 text-left font-semibold text-primary"
                >
                  <span>{item.q}</span>
                  <span
                    className={`flex-none text-accent text-2xl transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                <div className={`faq-answer ${isOpen ? "faq-answer--open" : ""}`}>
                  <div className="overflow-hidden">
                    <p className="pt-3 text-ink/70 leading-relaxed">{item.a}</p>
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
