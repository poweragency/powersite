import type { LegalContent } from "./content-schema";

/**
 * Body delle 3 pagine legali del sito cliente (/legal, /privacy, /cookies).
 * Generate automaticamente dal brief — il footer ci mette il link.
 * I dati cliente vengono sostituiti dinamicamente (companyName, P.IVA, PEC,
 * sede legale, ecc.); placeholder visibili dove mancano.
 *
 * Le pagine includono SEMPRE un disclaimer che dice "documento generato
 * automaticamente, validare con un consulente legale prima della
 * pubblicazione definitiva" — coprire la responsabilità.
 */

function dash(v: string | null | undefined): React.ReactNode {
  if (v && v.trim()) return v;
  return <span className="italic opacity-60">[da inserire]</span>;
}

function Disclaimer() {
  return (
    <div className="mt-12 rounded-xl border border-accent/30 bg-accent/5 p-5 text-sm text-ink/80">
      ⚠️ <strong>Documento generato automaticamente</strong> in base ai dati
      forniti. Prima della pubblicazione definitiva è consigliato far validare
      i contenuti da un consulente legale di tua fiducia.
    </div>
  );
}

const headingClass = "text-2xl font-bold text-primary mt-8 mb-3";
const paraClass = "text-ink/80 leading-relaxed";

export function LegalBody({ legal, brandName }: { legal: LegalContent; brandName: string }) {
  return (
    <>
      <h2 className={headingClass}>Titolare</h2>
      <p className={paraClass}>
        Titolare del sito è <strong>{legal.companyName || brandName}</strong>.
        Per qualsiasi comunicazione legale scrivere a{" "}
        <a href={`mailto:${legal.email}`} className="text-accent underline">{legal.email}</a>.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-ink/80">
        <li><strong>Ragione sociale:</strong> {dash(legal.companyName)}</li>
        <li><strong>Sede legale:</strong> {dash(legal.sedeLegale)}</li>
        <li><strong>Partita IVA:</strong> {dash(legal.vatNumber)}</li>
        <li><strong>Codice Fiscale:</strong> {dash(legal.fiscalCode)}</li>
        <li><strong>Iscrizione REA:</strong> {dash(legal.rea)}</li>
        <li><strong>PEC:</strong> {dash(legal.pec)}</li>
        {legal.shareCapital && <li><strong>Capitale sociale:</strong> {legal.shareCapital}</li>}
        <li><strong>Email:</strong> {legal.email}</li>
        {legal.phone && <li><strong>Telefono:</strong> {legal.phone}</li>}
      </ul>

      <h2 className={headingClass}>Diritti d&apos;autore</h2>
      <p className={paraClass}>
        Tutti i contenuti pubblicati su questo sito (testi, immagini, marchi,
        grafica, codice sorgente) sono di proprietà di {legal.companyName || brandName}
        {" "}salvo diversa indicazione. La riproduzione, modifica o distribuzione
        non autorizzata è vietata.
      </p>

      <h2 className={headingClass}>Limitazione di responsabilità</h2>
      <p className={paraClass}>
        Le informazioni pubblicate su questo sito sono fornite a scopo
        informativo. {legal.companyName || brandName} non garantisce l&apos;accuratezza
        assoluta dei contenuti e declina ogni responsabilità per usi impropri
        delle informazioni fornite o per eventuali errori o omissioni.
      </p>

      <h2 className={headingClass}>Foro competente</h2>
      <p className={paraClass}>
        Per qualsiasi controversia relativa all&apos;utilizzo di questo sito è
        competente in via esclusiva il Foro del luogo in cui ha sede il
        Titolare.
      </p>

      <Disclaimer />
    </>
  );
}

export function PrivacyBody({ legal, brandName }: { legal: LegalContent; brandName: string }) {
  return (
    <>
      <h2 className={headingClass}>Titolare del trattamento</h2>
      <p className={paraClass}>
        Il titolare del trattamento dei dati personali è{" "}
        <strong>{legal.companyName || brandName}</strong>
        {legal.sedeLegale && <>, con sede in <strong>{legal.sedeLegale}</strong></>}
        {legal.vatNumber && <>, P.IVA <strong>{legal.vatNumber}</strong></>}.
        {" "}Per esercitare i tuoi diritti scrivi a{" "}
        <a href={`mailto:${legal.email}`} className="text-accent underline">{legal.email}</a>
        {legal.pec && <> o via PEC a <a href={`mailto:${legal.pec}`} className="text-accent underline">{legal.pec}</a></>}.
      </p>

      <h2 className={headingClass}>Dati raccolti</h2>
      {legal.hasContactForm ? (
        <p className={paraClass}>
          Tramite il modulo di contatto presente sul sito raccogliamo:
          nome e cognome, email, telefono (opzionale) e il messaggio che ci
          invii. Questi dati vengono usati esclusivamente per rispondere alla
          tua richiesta.
        </p>
      ) : (
        <p className={paraClass}>
          Questo sito NON raccoglie dati personali tramite moduli di contatto.
          I contatti avvengono direttamente via telefono, email o WhatsApp:
          in quel caso i tuoi dati sono trattati secondo le norme delle
          rispettive piattaforme.
        </p>
      )}

      <h2 className={headingClass}>Base giuridica e finalità</h2>
      <p className={paraClass}>
        Il trattamento avviene sulla base del tuo consenso (art. 6.1.a GDPR)
        ed è finalizzato esclusivamente a fornire risposta alle tue richieste
        e gestire il rapporto commerciale.
      </p>

      <h2 className={headingClass}>Conservazione</h2>
      <p className={paraClass}>
        I dati raccolti vengono conservati per il tempo strettamente necessario
        alla gestione della richiesta e comunque per non più di 24 mesi dalla
        raccolta, salvo obblighi di legge (es. contabili, fiscali).
      </p>

      <h2 className={headingClass}>I tuoi diritti (artt. 15-22 GDPR)</h2>
      <p className={paraClass}>
        Hai diritto di accesso, rettifica, cancellazione, limitazione,
        portabilità e opposizione al trattamento. Per esercitarli scrivi a{" "}
        <a href={`mailto:${legal.email}`} className="text-accent underline">{legal.email}</a>.
        Hai inoltre diritto di proporre reclamo all&apos;Autorità Garante
        (www.garanteprivacy.it).
      </p>

      <Disclaimer />
    </>
  );
}

export function CookiesBody({ legal, brandName }: { legal: LegalContent; brandName: string }) {
  return (
    <>
      <h2 className={headingClass}>Cosa sono i cookie</h2>
      <p className={paraClass}>
        I cookie sono piccoli file di testo che i siti visitati salvano sul
        tuo dispositivo per memorizzare informazioni di sessione o
        preferenze.
      </p>

      <h2 className={headingClass}>Cookie utilizzati su questo sito</h2>
      <p className={paraClass}>
        Questo sito utilizza esclusivamente <strong>cookie tecnici</strong>
        {" "}necessari al funzionamento. Non utilizziamo cookie di profilazione
        né di terze parti per finalità pubblicitarie senza il tuo consenso
        esplicito.
      </p>

      <h2 className={headingClass}>Gestione delle preferenze</h2>
      <p className={paraClass}>
        Puoi bloccare o eliminare i cookie modificando le impostazioni del
        tuo browser. Disabilitando i cookie tecnici alcune funzionalità del
        sito potrebbero non funzionare correttamente.
      </p>

      <h2 className={headingClass}>Contatti</h2>
      <p className={paraClass}>
        Per qualsiasi domanda sui cookie o sulla privacy scrivi a{" "}
        <a href={`mailto:${legal.email}`} className="text-accent underline">{legal.email}</a>.
        Il titolare è <strong>{legal.companyName || brandName}</strong>.
      </p>

      <Disclaimer />
    </>
  );
}
