import { Suspense } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import OrderForm from "./order-form";

export const metadata = {
  title: "Avvia il progetto — Power Agency",
};

export default function OrdinaPage() {
  return (
    <>
      <Nav />
      <main className="relative isolate overflow-hidden">
        <div className="glow-orb top-[-15%] right-[-5%] h-[500px] w-[500px] animate-glow-slow bg-flame/15" />
        <div className="glow-orb bottom-[10%] left-[-10%] h-[400px] w-[400px] animate-glow-slow bg-brass/15" />
        <div className="grain" />

        <div className="container-x relative py-16 md:py-24">
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
