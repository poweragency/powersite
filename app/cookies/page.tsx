import { LegalLayout } from "@/components/LegalLayout";
import { CookiesBody } from "@/components/legal/bodies";

export const metadata = {
  title: "Cookie policy — Power Agency",
  description: "Informativa sui cookie utilizzati su Power Agency.",
};

export default function CookiesPage() {
  return (
    <LegalLayout
      eyebrow="Cookies"
      title="Cookie policy."
      italicWord="policy"
      updatedAt="25 maggio 2026"
    >
      <CookiesBody />
    </LegalLayout>
  );
}
