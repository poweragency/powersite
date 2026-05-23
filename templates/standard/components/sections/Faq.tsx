interface Props {
  title: string;
  items: { q: string; a: string }[];
}

export function Faq({ title, items }: Props) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-narrow max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-12">
          {title}
        </h2>
        <dl className="divide-y divide-ink/10 border-y border-ink/10">
          {items.map((item, i) => (
            <details key={i} className="group py-5">
              <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-primary">
                <dt>{item.q}</dt>
                <span className="text-accent text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <dd className="mt-3 text-ink/70 leading-relaxed">{item.a}</dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
