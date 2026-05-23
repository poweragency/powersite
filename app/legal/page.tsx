import { LegalLayout } from "@/components/LegalLayout";

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
      updatedAt="23 maggio 2026"
    >
      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          Titolare
        </h2>
        <p className="mt-3">
          Power Agency — Atelier digitale, con sede in Firenze, Italia.
          Per qualsiasi questione legale, scrivere a{" "}
          <a href="mailto:hello@poweragency.it" className="text-brass hover:underline">
            hello@poweragency.it
          </a>.
        </p>
      </section>

      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          Diritti d&apos;autore
        </h2>
        <p className="mt-3">
          Tutti i contenuti di questo sito (testi, grafica, codice sorgente,
          marchi) sono di proprietà di Power Agency salvo dove diversamente
          indicato. La riproduzione, modifica o distribuzione non autorizzata
          è vietata.
        </p>
        <p className="mt-3">
          Il codice sorgente dei siti consegnati ai clienti diventa di
          proprietà del cliente al momento della delivery, secondo i{" "}
          <a href="/termini" className="text-brass hover:underline">termini di servizio</a>.
        </p>
      </section>

      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          Limitazione di responsabilità
        </h2>
        <p className="mt-3">
          Le informazioni pubblicate su questo sito sono fornite a scopo
          informativo. Power Agency non garantisce l&apos;accuratezza
          assoluta dei contenuti e declina ogni responsabilità per usi
          impropri delle informazioni fornite.
        </p>
      </section>

      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          Privacy e trattamento dati
        </h2>
        <p className="mt-3">
          I dati raccolti tramite il form d&apos;ordine sono trattati secondo
          il GDPR (Regolamento UE 2016/679). Vedi <a href="/cookies" className="text-brass hover:underline">Cookie policy</a> per
          dettagli sui cookie utilizzati.
        </p>
      </section>

      <p className="mt-12 rounded-2xl border border-brass/30 bg-brass/5 p-5 text-sm text-mist">
        ⚠️ <strong className="text-bone">Documento da finalizzare.</strong> Questo
        testo è un placeholder. Prima del lancio in produzione fai validare le
        Note legali definitive da un consulente legale.
      </p>
    </LegalLayout>
  );
}
