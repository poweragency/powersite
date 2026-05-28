import Link from "next/link";

/**
 * Footer del sito cliente (versione Premium / Signature).
 *
 * Il badge "Powered by PowerLanding" usa i colori dinamici della palette
 * generata dall'AI (variabili CSS --color-accent + --color-ink) invece
 * di colori hardcoded oro/nero — così si integra con qualsiasi brand.
 *
 * I link legali usano <Link> (next) per navigazione client-side fluida verso
 * /legal /privacy /cookies — niente full reload (lo "scatto").
 */
export function Footer({ brandName }: { brandName: string }) {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container-narrow flex flex-col items-center gap-7 text-sm">
        <a
          href="https://powersite.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 whitespace-nowrap rounded border border-accent/30 bg-ink/40 px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent/85 transition-all duration-300 hover:scale-[1.03] hover:border-accent hover:bg-ink/60 hover:text-accent hover:shadow-[0_0_28px_hsl(var(--color-accent)/0.45)]"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
            className="text-accent transition-transform duration-300 group-hover:scale-110"
          >
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
          </svg>
          Powered by <span className="text-accent">PowerLanding</span>
        </a>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-widest opacity-80">
          <Link href="/legal" className="hover:opacity-100 hover:text-accent transition-colors">Note legali</Link>
          <span aria-hidden className="opacity-40">·</span>
          <Link href="/privacy" className="hover:opacity-100 hover:text-accent transition-colors">Privacy</Link>
          <span aria-hidden className="opacity-40">·</span>
          <Link href="/cookies" className="hover:opacity-100 hover:text-accent transition-colors">Cookie policy</Link>
        </nav>
        <span className="opacity-70 text-xs text-center">
          © {new Date().getFullYear()} {brandName}. Tutti i diritti riservati.
        </span>
      </div>
    </footer>
  );
}
