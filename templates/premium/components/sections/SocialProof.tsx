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
  const tall = testimonials.length <= 2;
  const cols = testimonials.length >= 4 ? "lg:grid-cols-2" : "md:grid-cols-3";
  return (
    <section className="py-24 md:py-32 bg-secondary">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="section-eyebrow">Le voci dei nostri clienti</p>
          <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl text-primary">
            {title}
          </h2>
        </div>
        <div className={`grid gap-8 ${cols}`}>
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className={`bg-canvas p-8 md:p-10 rounded-3xl border border-primary/5 shadow-sm flex flex-col ${tall ? "min-h-[320px]" : ""}`}
            >
              {t.rating !== undefined && (
                <div className="text-accent text-lg mb-4 tracking-wider" aria-label={`${t.rating} stelle`}>
                  {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                </div>
              )}
              <blockquote className="text-ink/85 text-lg leading-relaxed mb-6 flex-1 serif-italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="text-sm font-semibold text-primary">
                — {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
