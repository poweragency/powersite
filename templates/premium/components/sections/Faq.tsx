interface Props {
  title: string;
  items: { q: string; a: string }[];
}

export function Faq({ title, items }: Props) {
  return (
    <section className="py-24 md:py-32 bg-canvas">
      <div className="container-narrow max-w-3xl">
        <div className="text-center mb-16">
          <p className="section-eyebrow">Domande frequenti</p>
          <h2 className="text-balance text-4xl md:text-5xl text-primary">{title}</h2>
        </div>
        <dl className="divide-y divide-primary/10 border-y border-primary/10">
          {items.map((item, i) => (
            <details key={i} className="group py-6 md:py-7">
              <summary className="flex justify-between items-start gap-8 cursor-pointer list-none">
                <dt className="text-lg md:text-xl font-semibold text-primary leading-snug">
                  {item.q}
                </dt>
                <span className="flex-none text-accent text-3xl leading-none mt-1 group-open:rotate-45 transition-transform duration-300">
                  +
                </span>
              </summary>
              <dd className="mt-4 text-ink/70 leading-relaxed text-base md:text-lg max-w-2xl">
                {item.a}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
