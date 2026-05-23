import Link from "next/link";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import OrderForm from "./order-form";

export const metadata = {
  title: "Avvia il progetto — Power Agency",
};

export default function OrdinaPage() {
  return (
    <>
      <main className="relative isolate overflow-hidden">
        <div className="glow-orb top-[-15%] right-[-5%] h-[500px] w-[500px] animate-glow-slow bg-flame/15" />
        <div className="glow-orb bottom-[10%] left-[-10%] h-[400px] w-[400px] animate-glow-slow bg-brass/15" />
        <div className="grain" />

        {/* Top bar leggero — solo logo + back link */}
        <div className="container-x relative">
          <div className="flex items-center justify-between gap-3 pt-8">
            <Logo />
            <Link
              href="/"
              className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-mist transition-colors hover:text-brass"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:-translate-x-0.5"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Torna al sito
            </Link>
          </div>
        </div>

        <div className="container-x relative py-12 md:py-16">
          <Suspense
            fallback={
              <div className="mx-auto max-w-3xl animate-pulse space-y-6">
                <div className="h-12 w-2/3 rounded-lg bg-coal" />
                <div className="h-4 w-1/2 rounded-lg bg-coal" />
                <div className="h-96 rounded-2xl bg-coal" />
              </div>
            }
          >
            <OrderForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
