import content from "../../content.json";
import type { Content } from "../../lib/content-schema";
import { BrandStyle } from "../../components/BrandStyle";
import { SiteShell } from "../../components/SiteShell";
import { sectionsForPage, navLinksFromContent, getContactSection } from "../../lib/page-routing";

const data = content as unknown as Content;

export const metadata = {
  title: `Servizi — ${data.brand.name}`,
};

export default function ServiziPage() {
  return (
    <>
      <BrandStyle palette={data.brand.palette} />
      <SiteShell
        brandName={data.brand.name}
        sections={sectionsForPage(data.sections, "servizi")}
        navLinks={navLinksFromContent(data.sections)}
        contactSection={getContactSection(data.sections)}
        pageTitle="Servizi"
      />
    </>
  );
}
