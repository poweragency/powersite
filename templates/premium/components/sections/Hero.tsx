import Link from "next/link";
import { InteractiveGrid } from "../InteractiveGrid";

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
    <section className="relative bg-secondary py-28 md:py-40 overflow-hidden">
      <InteractiveGrid />
      {image && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-canvas/40 via-canvas/60 to-canvas/95" />
        </>
      )}
      <div className="container-narrow relative z-10 max-w-4xl text-center fade-in">
        <p className="section-eyebrow">{brandName}</p>
        <h1 className="text-balance text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-primary mb-8">
          {headline}
        </h1>
        {subheadline && (
          <p className="text-pretty text-lg md:text-xl text-ink/70 max-w-2xl mx-auto mb-12 leading-relaxed">
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
