import content from "../../content.json";
import type { Content } from "../../lib/content-schema";
import { LegalPageShell } from "../../components/LegalPageShell";
import { PrivacyBody } from "../../lib/legal-bodies";

const data = content as unknown as Content;

export const metadata = {
  title: `Privacy policy — ${data.brand.name}`,
};

export default function PrivacyPage() {
  if (!data.legal) {
    return (
      <LegalPageShell title="Privacy policy">
        <p>Dati legali non disponibili.</p>
      </LegalPageShell>
    );
  }
  return (
    <LegalPageShell title="Privacy policy">
      <PrivacyBody legal={data.legal} brandName={data.brand.name} />
    </LegalPageShell>
  );
}
