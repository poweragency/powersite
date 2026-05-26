import Link from "next/link";
import { Zap } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-bone/10 bg-coal">
      <div className="container-x py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-3 md:items-start md:gap-12">
          <div>
            <Logo />
          </div>

          <div className="md:text-center">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm md:justify-center">
              <li><Link href="/legal" className="text-mist hover:text-bone">Note legali</Link></li>
              <li><Link href="/termini" className="text-mist hover:text-bone">Termini</Link></li>
              <li><Link href="/cookies" className="text-mist hover:text-bone">Cookie policy</Link></li>
            </ul>
          </div>

          {/* Badge "POWERED BY POWERAGENCY" */}
          <div className="md:justify-self-end">
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
        </div>

        <div className="hairline mt-8" />

        <div className="mt-5 flex flex-col items-start justify-between gap-2 text-xs text-smoke md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Power Agency. Tutti i diritti riservati.</span>
          <span className="font-mono uppercase tracking-widest">
            Atelier <span className="text-brass">·</span> Milano <span className="text-brass">·</span> Made in Italy
          </span>
        </div>
      </div>
    </footer>
  );
}
