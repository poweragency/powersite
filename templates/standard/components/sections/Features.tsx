interface Props {
  title: string;
  items: { title: string; body: string; icon?: string }[];
}

export function Features({ title, items }: Props) {
  return (
    <section className="py-20 md:py-28 bg-secondary">
      <div className="container-narrow">
        <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-12">
          {title}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <article key={i} className="bg-canvas p-6 rounded-2xl border border-ink/5">
              {item.icon && (
                <div className="text-3xl mb-3" aria-hidden>{item.icon}</div>
              )}
              <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
              <p className="text-ink/70 text-sm leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
