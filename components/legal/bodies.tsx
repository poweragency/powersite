/**
 * Corpo dei 3 documenti legali, estratto in component condivisi così
 * possono essere renderizzati sia nelle pagine standalone (/legal, /termini,
 * /cookies) sia dentro il LegalDialog modal che si apre dal form ordine.
 *
 * Sono solo JSX puro, no Layout wrapper, no client hooks → usabili ovunque.
 */

import type { ReactNode } from "react";

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="display text-2xl font-bold tracking-tighter text-cream">{children}</h2>
);

const Section = ({ children }: { children: ReactNode }) => (
  <section className="space-y-3">{children}</section>
);

const Disclaimer = ({ children }: { children: ReactNode }) => (
  <p className="mt-12 rounded-2xl border border-brass/30 bg-brass/5 p-5 text-sm text-mist">
    ⚠️ <strong className="text-bone">Documento da finalizzare.</strong> {children}
  </p>
);

// ────────────────────────────────────────────────────────────────────────
// /legal — Note legali
// ────────────────────────────────────────────────────────────────────────
export function LegalBody() {
  return (
    <>
      <Section>
        <H2>Titolare</H2>
        <p>
          Per qualsiasi questione legale o relativa al trattamento dati, scrivere a{" "}
          <a href="mailto:info@poweragency.it" className="text-brass hover:underline">
            info@poweragency.it
          </a>
          .
        </p>
        <ul className="mt-4 space-y-2 text-sm text-mist">
          <li><strong className="text-bone">Ragione sociale:</strong> [DA INSERIRE]</li>
          <li><strong className="text-bone">Sede legale:</strong> [Via, n°, CAP, Città, Provincia]</li>
          <li><strong className="text-bone">Partita IVA:</strong> [DA INSERIRE]</li>
          <li><strong className="text-bone">Codice Fiscale:</strong> [DA INSERIRE]</li>
          <li><strong className="text-bone">Iscrizione REA:</strong> [DA INSERIRE]</li>
          <li><strong className="text-bone">PEC:</strong> [DA INSERIRE]</li>
          <li><strong className="text-bone">Email:</strong> info@poweragency.it</li>
          <li><strong className="text-bone">Regime fiscale:</strong> Forfettario — operazioni non soggette a IVA (art. 1, comma 58, L. 190/2014)</li>
        </ul>
      </Section>

      <Section>
        <H2>Diritti d&apos;autore</H2>
        <p>
          Tutti i contenuti di questo sito (testi, grafica, codice sorgente,
          marchi) sono di proprietà di Power Agency salvo dove diversamente
          indicato. La riproduzione, modifica o distribuzione non autorizzata
          è vietata.
        </p>
        <p>
          Il codice sorgente dei siti consegnati ai clienti diventa di
          proprietà del cliente al momento della delivery, secondo i{" "}
          <a href="/termini" className="text-brass hover:underline">termini di servizio</a>.
        </p>
      </Section>

      <Section>
        <H2>Limitazione di responsabilità</H2>
        <p>
          Le informazioni pubblicate su questo sito sono fornite a scopo
          informativo. Power Agency non garantisce l&apos;accuratezza assoluta
          dei contenuti e declina ogni responsabilità per usi impropri delle
          informazioni fornite.
        </p>
      </Section>

      <Section>
        <H2>Privacy e trattamento dati</H2>
        <p>
          I dati raccolti tramite il form d&apos;ordine sono trattati secondo il
          GDPR (Regolamento UE 2016/679). Vedi{" "}
          <a href="/cookies" className="text-brass hover:underline">Cookie policy</a>{" "}
          per dettagli sui cookie utilizzati.
        </p>
      </Section>

      <Disclaimer>
        Questo testo è un placeholder. Prima del lancio in produzione fai
        validare le Note legali definitive da un consulente legale.
      </Disclaimer>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────
// /termini — Termini di servizio
// ────────────────────────────────────────────────────────────────────────
export function TerminiBody() {
  return (
    <>
      <Section>
        <H2>1. Oggetto del servizio</H2>
        <p>
          Power Agency progetta, sviluppa e deploya siti web su misura per
          conto del cliente sulla base del brief compilato al momento
          dell&apos;ordine. La consegna avviene tipicamente entro 48 ore
          lavorative dal ricevimento del pagamento.
        </p>
      </Section>

      <Section>
        <H2>2. Ordine e pagamento</H2>
        <p>
          Il cliente compila il brief tramite il form d&apos;ordine. Power
          Agency contatta il cliente tramite il canale indicato (telefono /
          WhatsApp / email) per concordare modalità di pagamento e tempi di
          delivery. Il prezzo del pacchetto e degli add-on selezionati è
          visibile prima dell&apos;invio del brief. I prezzi sono finali:
          operazione non soggetta a IVA ai sensi dell&apos;art. 1, comma 58,
          della L. 190/2014 (regime forfettario). Nessun abbonamento ricorrente,
          salvo add-on esplicitamente marcati come &ldquo;mensile&rdquo;.
        </p>
      </Section>

      <Section>
        <H2>3. Materiali del cliente</H2>
        <p>
          Il cliente garantisce di avere tutti i diritti necessari sulle
          immagini, sui testi e sui materiali forniti tramite il brief.
          Power Agency declina ogni responsabilità in caso di violazioni di
          copyright commesse dal cliente.
        </p>
      </Section>

      <Section>
        <H2>4. Tempi di consegna</H2>
        <p>
          La delivery avviene entro 48 ore lavorative dal pagamento, salvo
          ritardi documentati o richieste extra del cliente. Eventuali ritardi
          imputabili a Power Agency danno diritto al rimborso integrale.
        </p>
      </Section>

      <Section>
        <H2>5. Revisioni</H2>
        <p>
          Il cliente ha diritto a una revisione completa entro 7 giorni dalla
          consegna del preview. Le modifiche includono riscrittura del copy,
          riorganizzazione delle sezioni e aggiustamenti grafici. Richieste
          oltre i 7 giorni sono trattate come nuovi interventi.
        </p>
      </Section>

      <Section>
        <H2>6. Proprietà del sito</H2>
        <p>
          Alla consegna definitiva il codice sorgente, il dominio (se incluso
          come add-on) e la repository diventano di proprietà del cliente.
          Power Agency conserva il diritto di citare il progetto nel proprio
          portfolio salvo diversa richiesta esplicita.
        </p>
      </Section>

      <Section>
        <H2>7. Recesso e rimborso</H2>
        <p>
          Il cliente può richiedere il rimborso integrale entro 14 giorni
          dall&apos;ordine se il risultato consegnato non soddisfa le
          aspettative e la revisione non risolve le criticità.
        </p>
      </Section>

      <Section>
        <H2>8. Foro competente</H2>
        <p>
          Per qualsiasi controversia è competente in via esclusiva il Foro di
          Firenze.
        </p>
      </Section>

      <Disclaimer>
        Questo testo è un placeholder. Prima del lancio in produzione fai
        validare i Termini di servizio da un consulente legale.
      </Disclaimer>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────
// /cookies — Cookie policy
// ────────────────────────────────────────────────────────────────────────
export function CookiesBody() {
  return (
    <>
      <Section>
        <H2>Cosa sono i cookie</H2>
        <p>
          I cookie sono piccoli file di testo che i siti visitati salvano sul
          tuo dispositivo per memorizzare informazioni di sessione, preferenze
          o per attività di analisi.
        </p>
      </Section>

      <Section>
        <H2>Cookie utilizzati su questo sito</H2>
        <p>
          Power Agency utilizza esclusivamente cookie tecnici necessari al
          funzionamento del sito (preferenze sessione, sicurezza). Non
          utilizziamo cookie di profilazione né di terze parti per finalità
          pubblicitarie.
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="rounded-xl border border-bone/10 bg-coal/40 p-4">
            <strong className="font-mono text-xs uppercase tracking-widest text-brass">
              Cookie tecnici
            </strong>
            <p className="mt-2 text-mist">
              Indispensabili per la navigazione e l&apos;invio del form
              d&apos;ordine. Non richiedono consenso (art. 122 Codice Privacy).
            </p>
          </li>
          <li className="rounded-xl border border-bone/10 bg-coal/40 p-4">
            <strong className="font-mono text-xs uppercase tracking-widest text-brass">
              Preferenza cookie banner
            </strong>
            <p className="mt-2 text-mist">
              La tua scelta sul banner cookie è salvata in <code>localStorage</code>
              {" "}(non in un cookie). Nessun identificatore persistente associato.
            </p>
          </li>
          <li className="rounded-xl border border-bone/10 bg-coal/40 p-4">
            <strong className="font-mono text-xs uppercase tracking-widest text-brass">
              Vercel Analytics (opz.)
            </strong>
            <p className="mt-2 text-mist">
              Se abilitato in futuro, raccoglierà statistiche anonime sulle
              visite (no cookie persistenti, no identificatori univoci).
            </p>
          </li>
        </ul>
      </Section>

      <Section>
        <H2>Gestione delle preferenze</H2>
        <p>
          Puoi bloccare o eliminare i cookie modificando le impostazioni del
          tuo browser. Tieni presente che disabilitando i cookie tecnici alcune
          funzionalità del sito (in particolare il form d&apos;ordine)
          potrebbero non funzionare correttamente.
        </p>
      </Section>

      <Section>
        <H2>Contatti</H2>
        <p>
          Per qualsiasi domanda relativa al trattamento dei tuoi dati, scrivici
          a{" "}
          <a href="mailto:info@poweragency.it" className="text-brass hover:underline">
            info@poweragency.it
          </a>
          .
        </p>
      </Section>

      <Disclaimer>
        Questo testo è un placeholder. Prima del lancio in produzione integra
        l&apos;informativa definitiva (es. via Iubenda o consulente legale).
      </Disclaimer>
    </>
  );
}

export type LegalDocKey = "legal" | "termini" | "cookies";

export const LEGAL_DOC_META: Record<LegalDocKey, { title: string; italic: string }> = {
  legal: { title: "Note legali", italic: "legali" },
  termini: { title: "Termini di servizio", italic: "servizio" },
  cookies: { title: "Cookie policy", italic: "policy" },
};

export function LegalBodyFor({ docKey }: { docKey: LegalDocKey }) {
  switch (docKey) {
    case "legal":
      return <LegalBody />;
    case "termini":
      return <TerminiBody />;
    case "cookies":
      return <CookiesBody />;
  }
}
