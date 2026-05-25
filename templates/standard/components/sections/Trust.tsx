interface Badge {
  label: string;
  value: string;
  detail?: string;
}

interface Props {
  title: string;
  badges: Badge[];
}

/**
 * TRUST SIGNALS / credenziali. Layout grid con NUMERO grande in primo piano.
 */
export function Trust({ title, badges }: Props) {
  return (
    <section className="py-20 md:py-28 bg-secondary">
      <div className="container-narrow">
        <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-12">
          {title}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((b, i) => (
            <div key={i} className="bg-canvas p-6 rounded-2xl border border-ink/5 text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2 leading-none">
                {b.value}
              </div>
              <div className="text-sm font-semibold text-primary mb-1">{b.label}</div>
              {b.detail && <div className="text-xs text-ink/60 leading-relaxed">{b.detail}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
