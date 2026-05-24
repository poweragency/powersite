import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function formatEur(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents);
}

/**
 * Pattern dei nomi repo cliente: `client-{slug}-{8 char hex/alfanum}`.
 *  - prefisso `client-` invariante (nessuna repo dell'org senza questo è toccata)
 *  - slug del nome azienda (3-40 char a-z0-9-)
 *  - suffisso 8 caratteri derivato dal nonce (stesso ordine → stesso nome
 *    → idempotenza se Stripe ritenta il webhook)
 */
const RESERVED_REPO_PATTERN = /^client-[a-z0-9][a-z0-9-]{1,40}-[a-z0-9]{8}$/;

export function buildClientRepoName(companySlug: string, nonce: string): string {
  const shortNonce = nonce.replace(/[^a-z0-9]/gi, "").slice(0, 8).toLowerCase().padEnd(8, "x");
  const name = `client-${companySlug}-${shortNonce}`;
  if (!RESERVED_REPO_PATTERN.test(name)) {
    throw new Error(`Invalid repo name generated: ${name}`);
  }
  return name;
}

export function isClientRepoName(name: string): boolean {
  return RESERVED_REPO_PATTERN.test(name);
}
