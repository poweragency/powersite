interface Props {
  title: string;
  items: { title: string; body: string }[];
}

/**
 * In Premium, `value` viene usato 2 volte con titoli diversi:
 *   1. WHY US — "Cosa ci rende diversi" (4-5 items, body ricco)
 *   2. TRUST SIGNALS — "Le nostre credenziali" (4-6 items, dati concreti)
 * Layout: grid 2 colonne con divider sottile tra le sezioni.
 */
export function Value({ title, items }: Props) {
  const cols = items.length >= 5 ? "lg:grid-cols-3" : items.length === 4 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <section className="py-24 md:py-32 bg-canvas">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl text-primary mb-4">
            {title}
          </h2>
          <div className="hairline mx-auto max-w-[120px]" />
        </div>
        <div className={`grid gap-x-10 gap-y-12 ${cols}`}>
          {items.map((item, i) => (
            <article key={i} className="fade-in">
              <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3 leading-snug">
                <span className="serif-italic text-accent text-3xl md:text-4xl mr-3 align-baseline">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.title}
              </h3>
              <p className="text-ink/70 leading-relaxed pl-12">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
