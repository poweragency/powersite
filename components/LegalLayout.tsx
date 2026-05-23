import { Nav } from "./Nav";
import { Footer } from "./Footer";

interface Props {
  eyebrow: string;
  title: string;
  italicWord?: string;
  updatedAt: string;
  children: React.ReactNode;
}

export function LegalLayout({ eyebrow, title, italicWord, updatedAt, children }: Props) {
  return (
    <>
      <Nav />
      <main className="relative isolate overflow-hidden">
        <div className="glow-orb top-[-15%] right-[-5%] h-[400px] w-[400px] animate-glow-slow bg-brass/15" />
        <div className="grain" />

        <article className="container-x relative py-16 md:py-24">
          <header className="mx-auto max-w-3xl">
            <span className="chip-brass">{eyebrow}</span>
            <h1 className="display mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tightest text-cream md:text-6xl">
              {italicWord ? (
                <>
                  {title.split(italicWord)[0]}
                  <span className="serif-italic">{italicWord}</span>
                  {title.split(italicWord)[1] ?? ""}
                </>
              ) : (
                title
              )}
            </h1>
            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-mist">
              Ultimo aggiornamento · {updatedAt}
            </p>
            <div className="hairline mt-8" />
          </header>

          <div className="prose-legal mx-auto mt-12 max-w-3xl space-y-8 text-pretty leading-relaxed text-bone/90">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
