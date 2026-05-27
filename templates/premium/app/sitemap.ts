import type { MetadataRoute } from "next";
import content from "../content.json";
import { navLinksFromContent } from "../lib/page-routing";
import type { Section } from "../lib/content-schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE_URL || "https://example.com";
  const pages = navLinksFromContent(content.sections as unknown as Section[]);
  const entries: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${base}${p.href === "/" ? "" : p.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p.href === "/" ? 1 : 0.7,
  }));
  for (const slug of ["legal", "privacy", "cookies"]) {
    entries.push({
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    });
  }
  return entries;
}
