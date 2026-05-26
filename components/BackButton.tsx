"use client";

import { useRouter } from "next/navigation";

interface Props {
  className?: string;
  label?: string;
  /** Fallback URL se l'utente è arrivato direttamente alla pagina (history vuota). */
  fallback?: string;
}

export function BackButton({ className, label = "Indietro", fallback = "/" }: Props) {
  const router = useRouter();
  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  }
  return (
    <button
      type="button"
      onClick={goBack}
      className={
        className ??
        "group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-mist transition-colors hover:text-brass"
      }
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
      {label}
    </button>
  );
}
