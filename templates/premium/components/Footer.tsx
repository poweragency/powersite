export function Footer({ brandName }: { brandName: string }) {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container-narrow flex flex-col items-center gap-7 text-sm">
        {/* Badge "POWERED BY POWERAGENCY" — firma Power Agency, identica
            su tutti i siti cliente. Link per backlink + credibilità. */}
        <a
          href="https://poweragency.it"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 whitespace-nowrap rounded border border-[#b8965d]/30 bg-[#0a0a0a] px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b8965d]/85 transition-all duration-300 hover:scale-[1.03] hover:border-[#b8965d] hover:text-[#b8965d] hover:shadow-[0_0_28px_rgba(184,150,93,0.55)]"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#b8965d" aria-hidden className="transition-transform duration-300 group-hover:scale-110">
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
          </svg>
          Powered by <span className="text-[#b8965d]">PowerAgency</span>
        </a>
        <span className="opacity-70 text-xs text-center">
          © {new Date().getFullYear()} {brandName}. Tutti i diritti riservati.
        </span>
      </div>
    </footer>
  );
}
