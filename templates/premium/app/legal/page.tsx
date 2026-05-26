import content from "../../content.json";
import type { Content } from "../../lib/content-schema";
import { LegalPageShell } from "../../components/LegalPageShell";
import { LegalBody } from "../../lib/legal-bodies";

const data = content as unknown as Content;

export const metadata = {
  title: `Note legali — ${data.brand.name}`,
};

export default function LegalPage() {
  if (!data.legal) {
    return (
      <LegalPageShell title="Note legali">
        <p>Dati legali non disponibili. Contatta l&apos;azienda per richiederli.</p>
      </LegalPageShell>
    );
  }
  return (
    <LegalPageShell title="Note legali">
      <LegalBody legal={data.legal} brandName={data.brand.name} />
    </LegalPageShell>
  );
}
