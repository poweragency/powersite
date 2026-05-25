interface Props {
  title: string;
  items: { title: string; body: string; icon?: string }[];
}

/**
 * In Premium, `features` può rappresentare 2 ruoli diversi:
 *  - METODO (step-by-step process) — icon = emoji settoriali rappresentative
 *  - TRUST signals (rare, di solito Premium li mette in `value` riusato)
 * Layout: spaziato, icon grandi, divisori sottili tra items.
 */
export function Features({ title, items }: Props) {
  return (
    <section className="py-24 md:py-32 bg-canvas">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center mb-20">
          <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl text-primary mb-4">
            {title}
          </h2>
          <div className="hairline mx-auto max-w-[120px]" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-14">
          {items.map((item, i) => (
            <article key={i} className="flex gap-6 fade-in">
              {item.icon && (
                <div className="flex-none text-5xl md:text-6xl leading-none" aria-hidden>
                  {item.icon}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-ink/70 leading-relaxed">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
