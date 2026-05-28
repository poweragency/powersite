import Link from "next/link";
import content from "../content.json";
import type { Content } from "../lib/content-schema";
import { BrandStyle } from "./BrandStyle";
import { Footer } from "./Footer";

const data = content as unknown as Content;

interface Props {
  title: string;
  children: React.ReactNode;
}

/**
 * Shell delle pagine legali (legal / privacy / cookies) del sito cliente.
 * Header semplice senza Nav (le pagine legali sono accessibili via Footer,
 * non hanno bisogno della nav principale per non distrarre dal contenuto).
 */
export function LegalPageShell({ title, children }: Props) {
  return (
    <>
      <BrandStyle palette={data.brand.palette} />
      <div className="fade-in">
        <header className="bg-primary text-white py-10">
          <div className="container-narrow">
            <Link href="/" className="text-xs uppercase tracking-widest opacity-70 transition-opacity hover:opacity-100">
              ← Torna al sito
            </Link>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold">{title}</h1>
          </div>
        </header>
        <main className="container-narrow py-12 md:py-16">{children}</main>
      </div>
      <Footer brandName={data.brand.name} />
    </>
  );
}
