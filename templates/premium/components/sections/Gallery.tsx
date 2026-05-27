interface Props {
  title: string;
  subtitle?: string;
  images: string[];
}

/**
 * Galleria immagini — vetrina visiva per i clienti che caricano molte foto.
 * Griglia responsive con aspect ratio uniforme e hover soft. Le immagini
 * vivono in /uploads/ (servite static dal sito generato).
 */
export function Gallery({ title, subtitle, images }: Props) {
  if (!images?.length) return null;
  return (
    <section id="galleria" className="py-24 md:py-32 bg-canvas">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <p className="section-eyebrow">Galleria</p>
          <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl text-primary">{title}</h2>
          {subtitle && <p className="mt-5 text-lg text-ink/70 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((src, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-secondary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${title} — ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
