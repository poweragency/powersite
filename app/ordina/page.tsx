import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { InteractiveGrid } from "@/components/InteractiveGrid";
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
        <InteractiveGrid />

        {/* Top bar: solo brand mark */}
        <div className="container-x relative">
          <div className="flex items-center pt-8">
            <Logo />
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
