import { Fragment } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Marquee } from "@/components/Marquee";
import { InteractiveGrid } from "@/components/InteractiveGrid";
import { formatEur } from "@/lib/utils";

const MARQUEE = [
  "Atelier digitale",
  "Su misura",
  "Consegna in 48 ore",
  "Lavoro sartoriale",
  "Codice scritto a mano",
  "Senza template",
  "Cura artigianale",
];

const STEPS = [
  {
    n: "I",
    t: "Compiliamo il brief",
    d: "Quindici domande mirate, scritte da chi disegna siti web da anni. Cinque minuti che ci dicono tutto quello che serve.",
  },
  {
    n: "II",
    t: "Lo studio progetta",
    d: "Il nostro team studia il tuo brand, scrive ogni parola del copy, sceglie la palette, compone le sezioni. Niente è automatico.",
  },
  {
    n: "III",
    t: "Costruiamo e mettiamo online",
    d: "Sviluppiamo il sito con codice scritto a mano, lo pubblichiamo su dominio, lo testiamo su ogni dispositivo.",
  },
  {
    n: "IV",
    t: "Ricevi e approvi",
    d: "Otterrai la tua anteprima, accettiamo qualsiasi modifica e alla tua conferma caricheremo il sito definitivo per te.",
  },
];

const VALUES = [
  { t: "Lavoriamo su misura", d: "Ogni sito è progettato da zero per te. Niente template, niente preset, niente layout già visti." },
  { t: "Codice scritto a mano.", d: "Sviluppiamo con cura riga per riga. Il sito è veloce, pulito, e tuo per sempre." },
  { t: "Le tue immagini.", d: "Carichiamo le foto del tuo business. Niente stock photography, niente immagini generiche da archivio." },
  { t: "Copy che vende.", d: "Ogni parola è studiata per portare risultati. Headline, CTA, FAQ, tutto curato da un nostro esperto copywriter." },
  { t: "Consegna garantita.", d: "48 ore dal pagamento al link di anteprima. Non promesse, ma il nostro impegno scritto." },
  { t: "Tuo per sempre.", d: "Codice, repository, dominio: tutto a tuo nome. Vuoi cambiare studio domani? Hai già tutto in mano." },
];

const TESTIMONIALS = [
  {
    name: "Marco D.",
    role: "Studio Dentistico, Milano",
    quote: "Mi aspettavo un sito generico, ho ricevuto qualcosa che sembrava cucito addosso al mio studio. La cura nei dettagli è quella delle agenzie da 5K€, il prezzo no.",
  },
  {
    name: "Sara P.",
    role: "Personal Trainer, Roma",
    quote: "Ho compilato il brief la sera, il pomeriggio dopo il sito era online. Il copy parla esattamente come parlo io ai miei clienti. Hanno capito il tono al primo colpo.",
  },
  {
    name: "Luca M.",
    role: "Studio Legale, Torino",
    quote: "Cercavo qualcosa di sobrio e autorevole, non il solito sito da freelance. Il loro studio ha colto la sensibilità giusta. Lo show del mio profilo professionale.",
  },
];

const FAQ = [
  {
    q: "Quanto ci impiegate davvero?",
    a: "Quarantotto ore dal pagamento al link di anteprima. È il nostro impegno, scritto. Se per qualsiasi ragione non riusciamo a rispettarlo, ti rimborsiamo integralmente.",
  },
  {
    q: "Cosa serve per iniziare?",
    a: "Una mail, i dati del tuo business, qualche foto. Niente account da creare, niente login da ricordare, niente file da scaricare. Compili il brief, paghi, ricevi il sito.",
  },
  {
    q: "Posso modificare il sito dopo?",
    a: "Sì, certo. Ti consegniamo l'intera repository con il codice sorgente. Modifichi tu, fai modificare a un dev di fiducia, o torni da noi per le evoluzioni successive.",
  },
  {
    q: "Il dominio è incluso?",
    a: "Inizialmente pubblichiamo su un nostro sottodominio (es. tuobrand.poweragency.it). Per il dominio personalizzato c'è l'add-on dominio (€67/anno), oppure lo trasferisci tu in pochi minuti seguendo la nostra guida.",
  },
  {
    q: "Cosa succede se non mi piace?",
    a: "Garantiamo una revisione completa entro 7 giorni: aggiungiamo, togliamo, riscriviamo, fino a quando non sei soddisfatto.",
  },
  {
    q: "Quante landing fate al mese?",
    a: "Lavoriamo in numeri piccoli e controllati. Massimo 30 progetti al mese, mai di più. Preferiamo dire no a un cliente che consegnare qualcosa di mediocre.",
  },
];

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* ─── HERO ────────────────────────────────────────── */}
      {/* -mt-16 pt-16: l'hero scorre SOTTO il nav (che è z-50 trasparente)
          così gli orb atmosferici riempiono anche la zona del nav, eliminando
          la "riga nera" tra nav e hero. pt-16 ricompensa lo spazio per il contenuto. */}
      <section className="relative isolate -mt-16 overflow-hidden pt-16">
        {/* Atmosfere */}
        <div className="glow-orb top-[-10%] right-[-12%] h-[800px] w-[800px] animate-glow bg-flame/20" />
        <div className="glow-orb top-[40%] left-[-15%] h-[600px] w-[600px] animate-glow-slow bg-brass/15" />
        <InteractiveGrid />

        <div className="container-x relative pt-28 pb-32 md:pt-36 md:pb-40 lg:pt-44">
          <div className="mx-auto max-w-5xl text-center">

            {/* Eyebrow — chip-brass coerente col resto della pagina */}
            <Reveal>
              <span className="chip-brass">
                Atelier digitale · Milano
              </span>
            </Reveal>

            {/* Headline */}
            <h1 className="display mt-12 text-balance text-5xl font-bold leading-[1] text-cream sm:text-6xl md:mt-14 md:text-7xl lg:text-[7.5rem] lg:leading-[0.95]">
              <Reveal delay={120} inline className="block">Sito web</Reveal>
              <Reveal delay={280} inline className="block">su misura</Reveal>
              <Reveal delay={440} inline className="block">
                <span className="text-flame">in 48 ore</span>
              </Reveal>
            </h1>

            {/* Hairline brass — segno editoriale */}
            <Reveal delay={650}>
              <div className="hairline mx-auto mt-14 max-w-xs md:mt-16" />
            </Reveal>

            {/* Subhead */}
            <Reveal delay={780}>
              <p className="mx-auto mt-10 max-w-xl text-pretty text-base leading-relaxed text-bone/80 md:text-lg">
                Un sito disegnato e costruito per te, dal nostro studio.
                <br />
                Una consegna alla volta, con cura artigianale.
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={920}>
              <div className="mt-12 flex flex-col items-center gap-5">
                <Link href="/ordina" className="btn-flame btn-xl">
                  Avvia il progetto
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link
                  href="#processo"
                  className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-mist transition-colors hover:text-brass"
                >
                  Scopri il processo
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-y-0.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                </Link>
              </div>
            </Reveal>

            {/* Stats — riga elegante con hairline verticali */}
            <Reveal delay={1100}>
              <div className="mx-auto mt-24 flex flex-col items-center gap-7 md:mt-32 md:flex-row md:justify-center md:gap-0">
                {[
                  { num: "48h", label: "Consegna" },
                  { num: "30", label: "Progetti/mese max" },
                  { num: "100%", label: "Su misura" },
                ].map((s, i) => (
                  <Fragment key={s.label}>
                    {i > 0 && <span className="hidden h-12 w-px bg-bone/15 md:mx-12 md:block lg:mx-16" />}
                    <div className="text-center">
                      <div className="display text-3xl font-bold tracking-tightest text-cream md:text-4xl">
                        {s.num}
                      </div>
                      <div className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-mist">
                        {s.label}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ────────────────────────────────────── */}
      <Marquee items={MARQUEE} />

      {/* ─── PROCESSO ────────────────────────────────────── */}
      <section id="processo" className="relative py-32 md:py-40">
        <div className="container-x">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <Reveal>
              <span className="chip-brass">Il processo</span>
            </Reveal>
            <Reveal delay={150}>
              <h2 className="display mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tighter text-cream md:text-6xl">
                Quattro tappe.<br />
                <span className="serif-italic">Una consegna.</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <article className="card group h-full">
                  <span className="font-display text-3xl text-brass">{s.n}</span>
                  <div className="hairline mt-4 max-w-[40%]" />
                  <h3 className="display mt-6 text-2xl font-bold tracking-tighter text-cream">
                    {s.t}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{s.d}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VALORI ──────────────────────────────────────── */}
      <section id="filosofia" className="relative py-32 md:py-40">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="chip-brass">La nostra filosofia</span>
            </Reveal>
            <Reveal delay={150}>
              <h2 className="display mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tighter text-cream md:text-6xl">
                Sei principi <br />
                su cui <span className="serif-italic">non</span> scendiamo a patti.
              </h2>
            </Reveal>
          </div>

          <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/10 md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 80}>
                <article className="group relative h-full bg-coal/80 p-8 transition-colors hover:bg-coal">
                  <div className="font-mono text-xs font-medium text-brass">
                    {String(i + 1).padStart(2, "0")} /
                  </div>
                  <h3 className="display mt-4 text-2xl font-bold tracking-tighter text-cream">{v.t}</h3>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-mist">{v.d}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INVESTIMENTO ─────────────────────────────── */}
      <section id="pacchetti" className="relative overflow-hidden py-32 md:py-40">
        <div className="glow-orb top-[5%] right-[15%] h-[500px] w-[500px] animate-glow bg-flame/20" />
        <div className="glow-orb bottom-[-20%] left-[15%] h-[600px] w-[600px] animate-glow-slow bg-brass/20" />
        <InteractiveGrid />

        <div className="container-x relative">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="chip-brass">Investimento</span>
            </Reveal>

            <Reveal delay={150}>
              <h2 className="display mt-8 text-balance text-5xl font-bold leading-[0.95] tracking-tightest text-cream md:text-7xl lg:text-[7rem]">
                A partire da
                <br />
                <span className="text-flame">{formatEur(397)}</span>
                <span className="text-mist">.</span>
              </h2>
            </Reveal>

            <Reveal delay={300}>
              <p className="mx-auto mt-10 max-w-2xl text-pretty text-lg leading-relaxed text-mist">
                Tre livelli pensati per ogni esigenza —{" "}
                <span className="text-bone">Standard</span>,{" "}
                <span className="text-bone">Premium</span>,{" "}
                <span className="text-bone">Signature</span>.
                Tutto compreso: progettazione, sviluppo, deploy, hosting, email
                di consegna.
              </p>
            </Reveal>

            <Reveal delay={450}>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <Link href="/ordina" className="btn-flame btn-xl">
                  Avvia il progetto
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={600}>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-widest text-smoke">
                Pacchetti dettagliati nel checkout · Pagamento sicuro via Stripe
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIANZE ──────────────────────────────── */}
      <section id="recensioni" className="relative py-32 md:py-40">
        <div className="container-x">
          <div className="mb-20 grid items-end gap-10 md:grid-cols-2">
            <div>
              <Reveal>
                <span className="chip-brass">Voci</span>
              </Reveal>
              <Reveal delay={150}>
                <h2 className="display mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tighter text-cream md:text-6xl">
                  Lavori che <br />
                  <span className="serif-italic">parlano italiano.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={250}>
              <p className="text-pretty text-lg leading-relaxed text-mist">
                Storie di clienti che hanno ricevuto qualcosa che sembrava
                cucito addosso. Non recensioni a stelle: parole vere, di
                gente vera, che ha visto i numeri salire.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <figure className="card flex h-full flex-col">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-brass/60">
                    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.232-.65 3.811-1.853 4.428-3.546.276-.756.345-1.531.207-2.252h-3.64v-10.051h8.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.232-.65 3.811-1.853 4.428-3.546.276-.756.345-1.531.207-2.252h-3.64v-10.051h9.001z" />
                  </svg>
                  <blockquote className="mt-6 flex-1 text-pretty text-bone/90 leading-relaxed">
                    {t.quote}
                  </blockquote>
                  <div className="hairline mt-8" />
                  <figcaption className="mt-6 flex items-baseline gap-3">
                    <span className="font-display font-bold tracking-tighter text-cream">{t.name}</span>
                    <span className="text-xs italic text-mist">— {t.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ────────────────────────────────────────── */}
      <section id="faq" className="relative py-32 md:py-40">
        <div className="container-x grid gap-16 md:grid-cols-[1fr_2fr] md:gap-24">
          <div className="md:sticky md:top-24 md:self-start">
            <Reveal>
              <span className="chip-brass">FAQ</span>
            </Reveal>
            <Reveal delay={150}>
              <h2 className="display mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tighter text-cream md:text-5xl">
                Domande <br />
                <span className="serif-italic">comuni.</span>
              </h2>
            </Reveal>
            <Reveal delay={300}>
              <p className="mt-6 text-pretty text-mist">
                Se la tua domanda non c&apos;è qui sotto, scrivici una
                mail a <a href="mailto:info@poweragency.it" className="text-brass hover:underline">info@poweragency.it</a>.
                Rispondiamo entro qualche ora.
              </p>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <dl className="divide-y divide-bone/10 border-y border-bone/10">
              {FAQ.map((item) => (
                <details key={item.q} className="group py-7">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                    <dt className="font-display text-xl font-bold tracking-tighter text-cream">
                      {item.q}
                    </dt>
                    <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-bone/20 text-bone transition-all group-open:rotate-45 group-open:border-brass group-open:bg-brass group-open:text-obsidian">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </summary>
                  <dd className="mt-4 text-pretty leading-relaxed text-mist">{item.a}</dd>
                </details>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ─── CTA FINALE ─────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="glow-orb top-[10%] right-[20%] h-[600px] w-[600px] animate-glow bg-flame/40" />
        <div className="glow-orb bottom-[-10%] left-[10%] h-[500px] w-[500px] animate-glow-slow bg-brass/25" />
        <InteractiveGrid />

        <div className="container-x relative py-32 text-center md:py-40">
          <Reveal>
            <span className="chip-brass">Iniziamo</span>
          </Reveal>
          <Reveal delay={150}>
            <h2 className="display mx-auto mt-8 max-w-4xl text-balance text-5xl font-bold leading-[0.95] text-cream md:text-7xl lg:text-[6rem]">
              La tua landing <br />
              ti sta <span className="serif-italic">aspettando.</span>
            </h2>
          </Reveal>
          <Reveal delay={300}>
            <p className="mx-auto mt-8 max-w-xl text-pretty text-lg text-mist">
              Cinque minuti per il brief. Quarantotto ore per la consegna.
              Una decisione che fa la differenza.
            </p>
          </Reveal>
          <Reveal delay={450}>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link href="/ordina?tier=premium" className="btn-flame btn-xl">
                Avvia il progetto — da {formatEur(397)}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
