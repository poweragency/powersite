import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { DraftCleanup } from "./draft-cleanup";

export default async function GraziePage({
  searchParams,
}: {
  searchParams: Promise<{ nonce?: string }>;
}) {
  const { nonce } = await searchParams;
  return (
    <>
      <DraftCleanup />
      <Nav />
      <main className="relative isolate overflow-hidden">
        <div className="glow-orb top-[-10%] right-[10%] h-[500px] w-[500px] animate-glow bg-flame/25" />
        <div className="glow-orb bottom-[10%] left-[10%] h-[400px] w-[400px] animate-glow-slow bg-brass/20" />
        <div className="tech-grid" />

        <div className="container-x relative py-24 md:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <div className="mx-auto mb-10 grid h-20 w-20 place-items-center rounded-full border border-brass/40 bg-gradient-to-br from-brass/30 to-flame/30">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brass">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <span className="chip-brass">Progetto ricevuto</span>
            </Reveal>

            <Reveal delay={250}>
              <h1 className="display mt-8 text-balance text-5xl font-bold leading-[0.95] tracking-tightest text-cream md:text-7xl">
                Grazie. <br />
                <span className="serif-italic">Iniziamo subito.</span>
              </h1>
            </Reveal>

            <Reveal delay={400}>
              <p className="mx-auto mt-8 max-w-xl text-pretty text-lg leading-relaxed text-mist">
                Il tuo brief è arrivato al nostro studio. Il nostro team è
                già al lavoro sul progetto. Verrai contattato direttamente{" "}
                <span className="text-bone">su WhatsApp da uno dei nostri tecnici</span>{" "}
                con il link di anteprima entro 48 ore.
              </p>
            </Reveal>

            <Reveal delay={550}>
              <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/10 md:grid-cols-3">
                {[
                  { n: "I", t: "Progettiamo", d: "Il nostro team disegna le sezioni, scrive il copy, sceglie la palette." },
                  { n: "II", t: "Costruiamo", d: "Sviluppiamo, testiamo, pubblichiamo sul dominio." },
                  { n: "III", t: "Consegniamo", d: "Uno dei nostri tecnici ti contatta su WhatsApp col link di anteprima." },
                ].map((s) => (
                  <div key={s.n} className="bg-coal/80 p-6 text-left backdrop-blur">
                    <span className="font-display text-2xl text-brass">{s.n}</span>
                    <div className="hairline my-3 max-w-[40%]" />
                    <h3 className="display text-lg font-bold tracking-tighter text-cream">{s.t}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-mist">{s.d}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {nonce && (
              <Reveal delay={700}>
                <p className="mt-10 text-xs text-smoke">
                  Riferimento progetto · <code className="font-mono text-mist">{nonce}</code>
                </p>
              </Reveal>
            )}

            <Reveal delay={800}>
              <div className="mt-10 flex justify-center gap-3">
                <Link href="/" className="btn-ghost-bone btn-md">
                  Torna alla home
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
