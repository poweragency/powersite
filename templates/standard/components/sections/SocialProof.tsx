interface Testimonial {
  name: string;
  quote: string;
  rating?: number;
  image?: string;
}

interface Props {
  title: string;
  testimonials: Testimonial[];
}

export function SocialProof({ title, testimonials }: Props) {
  return (
    <section className="py-20 md:py-28 bg-secondary">
      <div className="container-narrow">
        <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-12">
          {title}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="bg-canvas p-6 rounded-2xl border border-ink/5 flex flex-col"
            >
              {t.rating !== undefined && (
                <div className="text-accent text-lg mb-3" aria-label={`${t.rating} stelle`}>
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </div>
              )}
              <blockquote className="text-ink/80 italic leading-relaxed mb-4 flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="font-semibold text-primary text-sm">
                — {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
