import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-bone/10 bg-coal">
      <div className="container-x py-20">
        <div className="grid gap-16 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-md text-pretty text-sm leading-relaxed text-mist">
              Un piccolo atelier digitale italiano. Disegniamo a mano landing
              page sartoriali, costruite per durare e per convertire. Una
              consegna alla volta, con cura.
            </p>
            <div className="hairline mt-8 max-w-md" />
            <p className="mt-6 font-display text-xs italic text-brass">
              &ldquo;Costruiamo asset che generano clienti.&rdquo;
            </p>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-brass">Studio</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#processo" className="text-mist hover:text-bone">Il processo</Link></li>
              <li><Link href="#pacchetti" className="text-mist hover:text-bone">Pacchetti</Link></li>
              <li><Link href="#manifesto" className="text-mist hover:text-bone">Manifesto</Link></li>
              <li><Link href="#faq" className="text-mist hover:text-bone">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-brass">Contatti</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="mailto:hello@poweragency.it" className="text-mist hover:text-bone">hello@poweragency.it</a></li>
              <li><Link href="/ordina" className="text-mist hover:text-bone">Inizia un progetto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-widest text-brass">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-mist hover:text-bone">Privacy</Link></li>
              <li><Link href="#" className="text-mist hover:text-bone">Termini</Link></li>
              <li><Link href="#" className="text-mist hover:text-bone">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-16" />

        <div className="mt-8 flex flex-col items-start justify-between gap-3 text-xs text-smoke md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Power Agency. Tutti i diritti riservati.</span>
          <span className="font-mono uppercase tracking-widest">
            Atelier <span className="text-brass">·</span> Firenze <span className="text-brass">·</span> Made in Italy
          </span>
        </div>
      </div>
    </footer>
  );
}
