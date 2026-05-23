import Link from "next/link";
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
