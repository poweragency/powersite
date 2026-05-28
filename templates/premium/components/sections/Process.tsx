interface Step {
  title: string;
  body: string;
  icon: string;
}

interface Props {
  title: string;
  steps: Step[];
}

export function Process({ title, steps }: Props) {
  return (
    <section className="py-24 md:py-32 bg-canvas">
      <div className="container-narrow max-w-4xl">
        <div className="text-center mb-20">
          <p className="section-eyebrow">Il nostro processo</p>
          <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl text-primary">
            {title}
          </h2>
        </div>
        <ol className="relative space-y-12 md:space-y-16">
          <div className="absolute left-[27px] md:left-[35px] top-8 bottom-8 w-px bg-gradient-to-b from-accent/30 via-primary/10 to-transparent" aria-hidden />
          {steps.map((s, i) => (
            <li key={i} className="relative flex gap-6 md:gap-8 fade-in fx-lift">
              <div className="flex-none">
                <div className="w-[54px] h-[54px] md:w-[70px] md:h-[70px] rounded-full bg-secondary border border-primary/15 grid place-items-center text-2xl md:text-3xl shadow-sm" aria-hidden>
                  {s.icon}
                </div>
              </div>
              <div className="flex-1 pt-2 md:pt-3">
                <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3">
                  {s.title}
                </h3>
                <p className="text-ink/70 leading-relaxed text-base md:text-lg">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
