import { LegalLayout } from "@/components/LegalLayout";
import { LegalBody } from "@/components/legal/bodies";

export const metadata = {
  title: "Note legali — Power Agency",
  description: "Informazioni legali, titolare del trattamento, contatti.",
};

export default function LegalPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Note legali."
      italicWord="legali"
      updatedAt="25 maggio 2026"
    >
      <LegalBody />
    </LegalLayout>
  );
}
