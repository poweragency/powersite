import type { Metadata } from "next";
import "./globals.css";
import content from "../content.json";
import { JsonLd } from "../components/JsonLd";
import { CookieBanner } from "../components/CookieBanner";
import type { Content } from "../lib/content-schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export const metadata: Metadata = {
  ...(SITE_URL && { metadataBase: new URL(SITE_URL) }),
  title: content.meta.title,
  description: content.meta.description,
  ...(SITE_URL && { alternates: { canonical: "/" } }),
  openGraph: {
    title: content.meta.ogTitle ?? content.meta.title,
    description: content.meta.ogDescription ?? content.meta.description,
    type: "website",
    locale: "it_IT",
    ...(SITE_URL && { url: SITE_URL }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <JsonLd content={content as unknown as Content} siteUrl={SITE_URL} />
      </head>
      <body className="min-h-screen">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
