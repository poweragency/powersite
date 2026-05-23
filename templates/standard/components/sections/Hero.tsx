import Link from "next/link";

interface Props {
  brandName: string;
  headline: string;
  subheadline?: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  image?: string;
}

export function Hero({ brandName, headline, subheadline, ctaPrimary, ctaSecondary, image }: Props) {
  return (
    <section className="relative bg-secondary py-20 md:py-32 overflow-hidden">
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="container-narrow relative z-10 text-center">
        <p className="text-sm uppercase tracking-widest text-accent font-semibold mb-4">
          {brandName}
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6">
          {headline}
        </h1>
        {subheadline && (
          <p className="text-lg md:text-xl text-ink/70 max-w-2xl mx-auto mb-10">
            {subheadline}
          </p>
        )}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href={ctaPrimary.href} className="btn-primary">
            {ctaPrimary.label}
          </Link>
          {ctaSecondary && (
            <Link href={ctaSecondary.href} className="btn-outline">
              {ctaSecondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
