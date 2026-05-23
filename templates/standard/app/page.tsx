import content from "../content.json";
import type { Content, Section } from "../lib/content-schema";
import { BrandStyle } from "../components/BrandStyle";
import { Hero } from "../components/sections/Hero";
import { Value } from "../components/sections/Value";
import { Features } from "../components/sections/Features";
import { SocialProof } from "../components/sections/SocialProof";
import { CtaBlock } from "../components/sections/CtaBlock";
import { Faq } from "../components/sections/Faq";
import { Contact } from "../components/sections/Contact";
import { Footer } from "../components/Footer";

const data = content as unknown as Content;

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
    case "social-proof":
      return <SocialProof key={i} title={section.title} testimonials={section.testimonials} />;
    case "cta":
      return <CtaBlock key={i} title={section.title} body={section.body} ctaPrimary={section.ctaPrimary} />;
    case "faq":
      return <Faq key={i} title={section.title} items={section.items} />;
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

export default function HomePage() {
  return (
    <>
      <BrandStyle palette={data.brand.palette} />
      <main>
        {data.sections.map((s, i) => renderSection(s, data.brand.name, i))}
      </main>
      <Footer brandName={data.brand.name} />
    </>
  );
}
