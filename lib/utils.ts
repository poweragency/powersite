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

const RESERVED_REPO_PATTERN = /^client-[a-z0-9-]+-\d{10,}$/;

export function buildClientRepoName(companySlug: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const name = `client-${companySlug}-${timestamp}`;
  if (!RESERVED_REPO_PATTERN.test(name)) {
    throw new Error(`Invalid repo name generated: ${name}`);
  }
  return name;
}

export function isClientRepoName(name: string): boolean {
  return RESERVED_REPO_PATTERN.test(name);
}
