import content from "../content.json";
import type { Content } from "../lib/content-schema";
import { BrandStyle } from "../components/BrandStyle";
import { SiteShell } from "../components/SiteShell";
import { sectionsForPage, navLinksFromContent } from "../lib/page-routing";

const data = content as unknown as Content;

export default function HomePage() {
  return (
    <>
      <BrandStyle palette={data.brand.palette} />
      <SiteShell
        brandName={data.brand.name}
        sections={sectionsForPage(data.sections, "home")}
        navLinks={navLinksFromContent(data.sections)}
      />
    </>
  );
}
