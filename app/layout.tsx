import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Power Agency — Atelier digitale. Landing su misura in 24h.",
  description:
    "Un piccolo studio italiano che disegna landing page sartoriali. Niente template. Niente account. Solo lavoro su misura, consegnato in 24 ore.",
  openGraph: {
    title: "Power Agency — Atelier digitale",
    description:
      "Landing page sartoriali, disegnate per te. Consegna in 24 ore.",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-screen font-sans antialiased bg-obsidian text-bone">
        {children}
      </body>
    </html>
  );
}
