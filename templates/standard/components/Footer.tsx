/**
 * Footer del sito cliente.
 *
 * Il badge "Powered by PowerAgency" usa i colori dinamici della palette
 * generata dall'AI (variabili CSS --color-accent + --color-ink) invece
 * di colori hardcoded oro/nero — così si integra con qualsiasi brand.
 *   - background: ink (più scuro disponibile della palette) con opacità
 *   - bordo + testo + icona: accent della palette
 * Funziona su palette verdi, blu, rosse, qualsiasi senza stonare.
 */
export function Footer({ brandName }: { brandName: string }) {
  return (
    <footer className="bg-primary text-white py-10">
      <div className="container-narrow flex flex-col items-center gap-6 text-sm">
        <a
          href="https://poweragency.it"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 whitespace-nowrap rounded border border-accent/30 bg-ink/40 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent/80 transition-all duration-300 hover:border-accent hover:bg-ink/60 hover:text-accent hover:shadow-[0_0_22px_hsl(var(--color-accent)/0.4)]"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
            className="text-accent transition-transform duration-300 group-hover:scale-110"
          >
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
          </svg>
          Powered by <span className="text-accent">PowerAgency</span>
        </a>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-widest opacity-80">
          <a href="/legal" className="hover:opacity-100 hover:text-accent transition-colors">Note legali</a>
          <span aria-hidden className="opacity-40">·</span>
          <a href="/privacy" className="hover:opacity-100 hover:text-accent transition-colors">Privacy</a>
          <span aria-hidden className="opacity-40">·</span>
          <a href="/cookies" className="hover:opacity-100 hover:text-accent transition-colors">Cookie policy</a>
        </nav>
        <span className="opacity-70 text-xs text-center">
          © {new Date().getFullYear()} {brandName}. Tutti i diritti riservati.
        </span>
      </div>
    </footer>
  );
}
