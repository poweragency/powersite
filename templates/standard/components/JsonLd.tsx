/**
 * LocalBusiness schema generato dai dati legali + sezione contact del cliente.
 * Vince i punti SEO/GEO/GAIO: Google capisce nome azienda, indirizzo,
 * telefono → boost in Local Pack + Knowledge Panel.
 */
import type { Content } from "../lib/content-schema";

export function JsonLd({ content, siteUrl }: { content: Content; siteUrl: string }) {
  const contact = content.sections.find((s) => s.type === "contact") as
    | { type: "contact"; address?: string; phone?: string; email?: string }
    | undefined;

  const legal = content.legal;
  const name = legal?.companyName || content.brand.name;
  const address = contact?.address || legal?.sedeLegale;
  const phone = contact?.phone || legal?.phone;
  const email = contact?.email || legal?.email;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    url: siteUrl,
    description: content.meta.description,
  };
  if (address) data.address = { "@type": "PostalAddress", streetAddress: address, addressCountry: "IT" };
  if (phone) data.telephone = phone;
  if (email) data.email = email;
  if (legal?.vatNumber) data.vatID = legal.vatNumber;

  const testimonials = content.sections.find((s) => s.type === "social-proof") as
    | { type: "social-proof"; testimonials: { name: string; quote: string; rating?: number }[] }
    | undefined;
  if (testimonials && testimonials.testimonials.length > 0) {
    const withRating = testimonials.testimonials.filter((t) => typeof t.rating === "number");
    if (withRating.length > 0) {
      const avg = withRating.reduce((a, t) => a + (t.rating ?? 0), 0) / withRating.length;
      data.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: avg.toFixed(1),
        reviewCount: testimonials.testimonials.length,
      };
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
