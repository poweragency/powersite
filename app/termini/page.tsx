import { LegalLayout } from "@/components/LegalLayout";
import { TerminiBody } from "@/components/legal/bodies";

export const metadata = {
  title: "Termini di servizio — Power Agency",
  description: "Condizioni d'uso del servizio Power Agency.",
};

export default function TerminiPage() {
  return (
    <LegalLayout
      eyebrow="Termini"
      title="Termini di servizio."
      italicWord="servizio"
      updatedAt="25 maggio 2026"
    >
      <TerminiBody />
    </LegalLayout>
  );
}
