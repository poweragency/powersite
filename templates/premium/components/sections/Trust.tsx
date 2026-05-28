import { CountUp } from "../CountUp";

interface Badge {
  label: string;
  value: string;
  detail?: string;
}

interface Props {
  title: string;
  badges: Badge[];
}

export function Trust({ title, badges }: Props) {
  const cols =
    badges.length >= 6 ? "md:grid-cols-3 lg:grid-cols-3" : badges.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";
  return (
    <section className="py-24 md:py-32 bg-secondary">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="section-eyebrow">Numeri & credenziali</p>
          <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl text-primary">
            {title}
          </h2>
        </div>
        <div className={`grid gap-x-8 gap-y-12 ${cols}`}>
          {badges.map((b, i) => (
            <div key={i} className="text-center md:text-left fade-in">
              <div className="text-5xl md:text-6xl lg:text-7xl text-accent leading-none mb-3 serif-italic font-semibold">
                <CountUp value={b.value} />
              </div>
              <div className="text-base md:text-lg font-semibold text-primary mb-1">
                {b.label}
              </div>
              {b.detail && (
                <div className="text-sm text-ink/60 leading-relaxed">{b.detail}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
