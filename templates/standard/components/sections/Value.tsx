interface Props {
  title: string;
  items: { title: string; body: string }[];
}

export function Value({ title, items }: Props) {
  return (
    <section id="servizi" className="py-20 md:py-28">
      <div className="container-narrow">
        <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-12">
          {title}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <article key={i} className="text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold mb-4 mx-auto md:mx-0">
                {i + 1}
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">{item.title}</h3>
              <p className="text-ink/70 leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
