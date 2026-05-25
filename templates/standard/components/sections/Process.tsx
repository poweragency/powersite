interface Step {
  title: string;
  body: string;
  icon: string;
}

interface Props {
  title: string;
  steps: Step[];
}

/**
 * METODO step-by-step. Layout lineare con icon-dot e connettore verticale.
 * Lo Standard non genera mai questo tipo, ma il componente esiste per
 * compatibilità con content.json di Premium che dovesse essere clonato.
 */
export function Process({ title, steps }: Props) {
  return (
    <section className="py-20 md:py-28 bg-canvas">
      <div className="container-narrow max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-12">
          {title}
        </h2>
        <ol className="space-y-8">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-5">
              <div className="flex-none">
                <div className="w-14 h-14 rounded-full bg-secondary border border-ink/10 grid place-items-center text-2xl" aria-hidden>
                  {s.icon}
                </div>
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-bold text-primary mb-2">{s.title}</h3>
                <p className="text-ink/70 leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
