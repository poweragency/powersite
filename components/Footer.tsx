import Link from "next/link";
import { Zap } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-bone/10 bg-coal">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-16">
          <div>
            <Logo />
            <p className="mt-6 max-w-md text-pretty text-sm leading-relaxed text-mist">
              Un piccolo atelier digitale italiano. Disegniamo a mano siti web
              sartoriali, costruiti per durare e per convertire. Una consegna
              alla volta, con cura.
            </p>
            <div className="hairline mt-8 max-w-md" />
            <p className="mt-6 font-display text-xs italic text-brass">
              &ldquo;Costruiamo asset che generano clienti.&rdquo;
            </p>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-brass">
              Contatti
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:hello@poweragency.it" className="break-all text-mist hover:text-bone">
                  hello@poweragency.it
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-brass">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/legal" className="text-mist hover:text-bone">Note legali</Link></li>
              <li><Link href="/termini" className="text-mist hover:text-bone">Termini di servizio</Link></li>
              <li><Link href="/cookies" className="text-mist hover:text-bone">Cookie policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-12 md:mt-16" />

        {/* Badge "POWERED BY POWERAGENCY" — firma centrale, cliccabile,
            glow brass on hover. Link al sito principale per backlink. */}
        <div className="mt-8 flex justify-center">
          <a
            href="https://poweragency.it"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded border border-brass/30 bg-obsidian px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brass/80 transition-all duration-300 hover:border-brass hover:bg-obsidian hover:text-brass hover:shadow-[0_0_20px_rgba(184,150,93,0.45)]"
          >
            <Zap className="h-3 w-3 fill-brass text-brass transition-transform duration-300 group-hover:scale-110" strokeWidth={0} />
            Powered by <span className="text-brass">PowerAgency</span>
          </a>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-smoke md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Power Agency. Tutti i diritti riservati.</span>
          <span className="font-mono uppercase tracking-widest">
            Atelier <span className="text-brass">·</span> Firenze <span className="text-brass">·</span> Made in Italy
          </span>
        </div>
      </div>
    </footer>
  );
}
