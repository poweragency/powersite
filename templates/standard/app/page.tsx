import content from "../content.json";
import type { Content, Section } from "../lib/content-schema";
import { BrandStyle } from "../components/BrandStyle";
import { Nav } from "../components/Nav";
import { Hero } from "../components/sections/Hero";
import { Value } from "../components/sections/Value";
import { Features } from "../components/sections/Features";
import { Process } from "../components/sections/Process";
import { Trust } from "../components/sections/Trust";
import { SocialProof } from "../components/sections/SocialProof";
import { CtaBlock } from "../components/sections/CtaBlock";
import { Faq } from "../components/sections/Faq";
import { Catalog } from "../components/sections/Catalog";
import { Gallery } from "../components/sections/Gallery";
import { Contact } from "../components/sections/Contact";
import { Footer } from "../components/Footer";
import { ChatWidget } from "../components/ChatWidget";

const data = content as unknown as Content;

/**
 * Mapping tipo-sezione → ancora HTML usata dalla Nav per scroll.
 * Le voci che non hanno una sezione corrispondente nel content vengono
 * filtrate via — niente link rotti nella nav.
 */
const SECTION_ANCHORS: Record<Section["type"], { id: string; label: string }> = {
  hero: { id: "hero", label: "Home" },
  value: { id: "servizi", label: "Servizi" },
  features: { id: "caratteristiche", label: "Caratteristiche" },
  process: { id: "metodo", label: "Metodo" },
  trust: { id: "credenziali", label: "Credenziali" },
  "social-proof": { id: "recensioni", label: "Recensioni" },
  cta: { id: "cta", label: "" },
  faq: { id: "faq", label: "FAQ" },
  catalog: { id: "catalogo", label: "Catalogo" },
  gallery: { id: "galleria", label: "Galleria" },
  contact: { id: "contatti", label: "Contatti" },
};

function buildNavLinks(sections: Section[]) {
  const seen = new Set<string>();
  const links: { label: string; href: string }[] = [];
  for (const s of sections) {
    const anchor = SECTION_ANCHORS[s.type];
    if (!anchor || !anchor.label || seen.has(anchor.id)) continue;
    seen.add(anchor.id);
    links.push({ label: anchor.label, href: `#${anchor.id}` });
  }
  return links;
}

function sectionId(s: Section, index: number, sections: Section[]): string {
  const anchor = SECTION_ANCHORS[s.type];
  if (!anchor) return `section-${index}`;
  // Se ci sono duplicati dello stesso tipo (es. 2x value), il secondo
  // ha un id derivato per non collidere.
  const firstOfType = sections.findIndex((x) => x.type === s.type);
  return firstOfType === index ? anchor.id : `${anchor.id}-${index}`;
}

function renderSection(section: Section, brandName: string, i: number, all: Section[]) {
  const id = sectionId(section, i, all);
  const wrap = (node: React.ReactNode) => <div key={i} id={id} className="scroll-mt-20">{node}</div>;
  switch (section.type) {
    case "hero":
      return wrap(
        <Hero
          brandName={brandName}
          headline={section.headline}
          subheadline={section.subheadline}
          ctaPrimary={section.ctaPrimary}
          ctaSecondary={section.ctaSecondary}
          image={section.image}
        />,
      );
    case "value":
      return wrap(<Value title={section.title} items={section.items} />);
    case "features":
      return wrap(<Features title={section.title} items={section.items} />);
    case "process":
      return wrap(<Process title={section.title} steps={section.steps} />);
    case "trust":
      return wrap(<Trust title={section.title} badges={section.badges} />);
    case "social-proof":
      return wrap(<SocialProof title={section.title} testimonials={section.testimonials} />);
    case "cta":
      return wrap(<CtaBlock title={section.title} body={section.body} ctaPrimary={section.ctaPrimary} />);
    case "faq":
      return wrap(<Faq title={section.title} items={section.items} />);
    case "catalog":
      return wrap(<Catalog title={section.title} subtitle={section.subtitle} categories={section.categories} />);
    case "gallery":
      return wrap(<Gallery title={section.title} subtitle={section.subtitle} images={section.images} />);
    case "contact":
      return wrap(
        <Contact
          title={section.title}
          address={section.address}
          phone={section.phone}
          email={section.email}
        />,
      );
  }
}

export default function HomePage() {
  const navLinks = buildNavLinks(data.sections);
  return (
    <>
      <BrandStyle palette={data.brand.palette} />
      <Nav brandName={data.brand.name} links={navLinks} />
      <main id="top">
        {data.sections.map((s, i) => renderSection(s, data.brand.name, i, data.sections))}
      </main>
      <Footer brandName={data.brand.name} />
      <ChatWidget brandName={data.brand.name} />
    </>
  );
}
