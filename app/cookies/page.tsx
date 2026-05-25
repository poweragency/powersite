import { LegalLayout } from "@/components/LegalLayout";

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
      updatedAt="23 maggio 2026"
    >
      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          Cosa sono i cookie
        </h2>
        <p className="mt-3">
          I cookie sono piccoli file di testo che i siti visitati salvano
          sul tuo dispositivo per memorizzare informazioni di sessione,
          preferenze o per attività di analisi.
        </p>
      </section>

      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          Cookie utilizzati su questo sito
        </h2>
        <p className="mt-3">
          Power Agency utilizza esclusivamente cookie tecnici necessari al
          funzionamento del sito (preferenze sessione, sicurezza). Non
          utilizziamo cookie di profilazione né di terze parti per finalità
          pubblicitarie.
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="rounded-xl border border-bone/10 bg-coal/40 p-4">
            <strong className="font-mono text-xs uppercase tracking-widest text-brass">Cookie tecnici</strong>
            <p className="mt-2 text-mist">
              Indispensabili per la navigazione e l&apos;invio del form
              d&apos;ordine. Non richiedono consenso (art. 122 Codice Privacy).
            </p>
          </li>
          <li className="rounded-xl border border-bone/10 bg-coal/40 p-4">
            <strong className="font-mono text-xs uppercase tracking-widest text-brass">Preferenza cookie banner</strong>
            <p className="mt-2 text-mist">
              La tua scelta sul banner cookie è salvata in <code>localStorage</code>
              (non in un cookie). Nessun identificatore persistente associato.
            </p>
          </li>
          <li className="rounded-xl border border-bone/10 bg-coal/40 p-4">
            <strong className="font-mono text-xs uppercase tracking-widest text-brass">Vercel Analytics (opz.)</strong>
            <p className="mt-2 text-mist">
              Se abilitato in futuro, raccoglierà statistiche anonime sulle
              visite (no cookie persistenti, no identificatori univoci).
            </p>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          Gestione delle preferenze
        </h2>
        <p className="mt-3">
          Puoi bloccare o eliminare i cookie modificando le impostazioni del
          tuo browser. Tieni presente che disabilitando i cookie tecnici
          alcune funzionalità del sito (in particolare il form d&apos;ordine)
          potrebbero non funzionare correttamente.
        </p>
      </section>

      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          Contatti
        </h2>
        <p className="mt-3">
          Per qualsiasi domanda relativa al trattamento dei tuoi dati,
          scrivici a{" "}
          <a href="mailto:info@poweragency.it" className="text-brass hover:underline">
            info@poweragency.it
          </a>.
        </p>
      </section>

      <p className="mt-12 rounded-2xl border border-brass/30 bg-brass/5 p-5 text-sm text-mist">
        ⚠️ <strong className="text-bone">Documento da finalizzare.</strong> Questo
        testo è un placeholder. Prima del lancio in produzione integra
        l&apos;informativa definitiva (es. via Iubenda o consulente legale).
      </p>
    </LegalLayout>
  );
}
