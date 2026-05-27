import type { Section } from "../lib/content-schema";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Hero } from "./sections/Hero";
import { Value } from "./sections/Value";
import { Features } from "./sections/Features";
import { Process } from "./sections/Process";
import { Trust } from "./sections/Trust";
import { SocialProof } from "./sections/SocialProof";
import { CtaBlock } from "./sections/CtaBlock";
import { Faq } from "./sections/Faq";
import { Catalog } from "./sections/Catalog";
import { Contact } from "./sections/Contact";

interface Props {
  brandName: string;
  sections: Section[];
  navLinks: Array<{ label: string; href: string }>;
  /** Spazio sopra il primo contenuto utile (compensa la nav fissa). */
  pageTitle?: string;
  /**
   * Sezione contatti RICORRENTE: renderizzata in fondo a OGNI pagina come CTA
   * ripetuta. Se l'addon "Modulo contatti" è attivo, include il form (la
   * Contact lo mostra in base a NEXT_PUBLIC_CONTACT_FORM) → form in ogni pagina.
   */
  contactSection?: Section;
}

function renderSection(section: Section, brandName: string, i: number) {
  switch (section.type) {
    case "hero":
      return (
        <Hero
          key={i}
          brandName={brandName}
          headline={section.headline}
          subheadline={section.subheadline}
          ctaPrimary={section.ctaPrimary}
          ctaSecondary={section.ctaSecondary}
          image={section.image}
        />
      );
    case "value":
      return <Value key={i} title={section.title} items={section.items} />;
    case "features":
      return <Features key={i} title={section.title} items={section.items} />;
    case "process":
      return <Process key={i} title={section.title} steps={section.steps} />;
    case "trust":
      return <Trust key={i} title={section.title} badges={section.badges} />;
    case "social-proof":
      return <SocialProof key={i} title={section.title} testimonials={section.testimonials} />;
    case "cta":
      return <CtaBlock key={i} title={section.title} body={section.body} ctaPrimary={section.ctaPrimary} />;
    case "faq":
      return <Faq key={i} title={section.title} items={section.items} />;
    case "catalog":
      return <Catalog key={i} title={section.title} subtitle={section.subtitle} categories={section.categories} />;
    case "contact":
      return (
        <Contact
          key={i}
          title={section.title}
          address={section.address}
          phone={section.phone}
          email={section.email}
        />
      );
  }
}

export function SiteShell({ brandName, sections, navLinks, pageTitle, contactSection }: Props) {
  // Se la pagina NON ha hero come prima sezione, aggiungo un padding-top
  // per non finire sotto la nav fissa.
  const startsWithHero = sections[0]?.type === "hero";
  return (
    <>
      <Nav brandName={brandName} links={navLinks} />
      <main className={`page-fade-in ${startsWithHero ? "" : "pt-24 md:pt-32"}`}>
        {pageTitle && !startsWithHero && (
          <section className="container-narrow pb-12 md:pb-16">
            <h1 className="text-balance text-5xl md:text-7xl text-primary font-display">
              {pageTitle}
            </h1>
            <div className="hairline mt-6 max-w-[120px]" />
          </section>
        )}
        {sections.map((s, i) => renderSection(s, brandName, i))}
        {/* Contatti ricorrenti: CTA in fondo a ogni pagina (+ form se addon attivo). */}
        {contactSection && renderSection(contactSection, brandName, 9999)}
      </main>
      <Footer brandName={brandName} />
    </>
  );
}
