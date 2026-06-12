import type { Metadata, Viewport } from "next";
import { Inter, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";
import { CustomCursor } from "@/components/CustomCursor";
import { JsonLd } from "@/components/JsonLd";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Titoli: Geist (sans software-premium). Variable font, niente weight esplicito.
const display = Geist({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://poweragency.it";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Power Agency — Crea il tuo sito gratis, paghi solo se ti piace.",
  description:
    "Un piccolo studio italiano che disegna siti web sartoriali. Crei il sito gratis, paghi solo se ti piace: canone da 29,97 €/mese, dominio e hosting inclusi. Consegna in 48 ore.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Power Agency — Crea il tuo sito gratis",
    description:
      "Paghi solo se ti piace, da 29,97 €/mese. Dominio e hosting inclusi. Consegna in 48 ore.",
    type: "website",
    locale: "it_IT",
    url: SITE_URL,
    siteName: "Power Agency",
  },
  twitter: {
    card: "summary_large_image",
    title: "Power Agency — Crea il tuo sito gratis",
    description: "Paghi solo se ti piace, da 29,97 €/mese. Consegna in 48 ore.",
  },
  applicationName: "PowerLanding",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PowerLanding",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1220",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Power Agency",
    alternateName: "PowerLanding",
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    description:
      "Atelier digitale italiano. Siti web sartoriali su misura, consegnati in 48 ore.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Milano",
      addressCountry: "IT",
    },
    sameAs: [],
  };
  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Power Agency",
    url: SITE_URL,
    inLanguage: "it-IT",
  };
  return (
    <html lang="it" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <head>
        <JsonLd data={orgLd} />
        <JsonLd data={siteLd} />
      </head>
      <body className="min-h-screen font-sans antialiased bg-obsidian text-bone">
        {children}
        <CookieBanner />
        <CustomCursor />
      </body>
    </html>
  );
}
