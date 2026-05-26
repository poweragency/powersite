import content from "../../content.json";
import type { Content } from "../../lib/content-schema";
import { LegalPageShell } from "../../components/LegalPageShell";
import { CookiesBody } from "../../lib/legal-bodies";

const data = content as unknown as Content;

export const metadata = {
  title: `Cookie policy — ${data.brand.name}`,
};

export default function CookiesPage() {
  if (!data.legal) {
    return (
      <LegalPageShell title="Cookie policy">
        <p>Dati legali non disponibili.</p>
      </LegalPageShell>
    );
  }
  return (
    <LegalPageShell title="Cookie policy">
      <CookiesBody legal={data.legal} brandName={data.brand.name} />
    </LegalPageShell>
  );
}
