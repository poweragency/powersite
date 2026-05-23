import { LegalLayout } from "@/components/LegalLayout";

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
      updatedAt="23 maggio 2026"
    >
      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          1. Oggetto del servizio
        </h2>
        <p className="mt-3">
          Power Agency progetta, sviluppa e deploya siti web su misura per
          conto del cliente sulla base del brief compilato al momento
          dell&apos;ordine. La consegna avviene tipicamente entro 48 ore
          lavorative dal ricevimento del pagamento.
        </p>
      </section>

      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          2. Ordine e pagamento
        </h2>
        <p className="mt-3">
          L&apos;ordine si perfeziona con il pagamento tramite Stripe.
          Il prezzo del pacchetto e degli add-on selezionati è visibile prima
          del checkout. Prezzi e IVA esclusi salvo diversa indicazione.
          Nessun abbonamento ricorrente, salvo add-on esplicitamente marcati
          come &ldquo;mensile&rdquo;.
        </p>
      </section>

      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          3. Materiali del cliente
        </h2>
        <p className="mt-3">
          Il cliente garantisce di avere tutti i diritti necessari sulle
          immagini, sui testi e sui materiali forniti tramite il brief.
          Power Agency declina ogni responsabilità in caso di violazioni
          di copyright commesse dal cliente.
        </p>
      </section>

      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          4. Tempi di consegna
        </h2>
        <p className="mt-3">
          La delivery avviene entro 48 ore lavorative dal pagamento, salvo
          ritardi documentati o richieste extra del cliente. Eventuali ritardi
          imputabili a Power Agency danno diritto al rimborso integrale.
        </p>
      </section>

      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          5. Revisioni
        </h2>
        <p className="mt-3">
          Il cliente ha diritto a una revisione completa entro 7 giorni dalla
          consegna del preview. Le modifiche includono riscrittura del copy,
          riorganizzazione delle sezioni e aggiustamenti grafici. Richieste
          oltre i 7 giorni sono trattate come nuovi interventi.
        </p>
      </section>

      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          6. Proprietà del sito
        </h2>
        <p className="mt-3">
          Alla consegna definitiva il codice sorgente, il dominio (se incluso
          come add-on) e la repository diventano di proprietà del cliente.
          Power Agency conserva il diritto di citare il progetto nel proprio
          portfolio salvo diversa richiesta esplicita.
        </p>
      </section>

      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          7. Recesso e rimborso
        </h2>
        <p className="mt-3">
          Il cliente può richiedere il rimborso integrale entro 14 giorni
          dall&apos;ordine se il risultato consegnato non soddisfa le
          aspettative e la revisione non risolve le criticità.
        </p>
      </section>

      <section>
        <h2 className="display text-2xl font-bold tracking-tighter text-cream">
          8. Foro competente
        </h2>
        <p className="mt-3">
          Per qualsiasi controversia è competente in via esclusiva il Foro
          di Firenze.
        </p>
      </section>

      <p className="mt-12 rounded-2xl border border-brass/30 bg-brass/5 p-5 text-sm text-mist">
        ⚠️ <strong className="text-bone">Documento da finalizzare.</strong> Questo
        testo è un placeholder. Prima del lancio in produzione fai validare i
        Termini di servizio da un consulente legale.
      </p>
    </LegalLayout>
  );
}
