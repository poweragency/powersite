import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 font-display text-lg tracking-tighter", className)}
    >
      <span className="relative inline-grid h-8 w-8 place-items-center rounded-full border border-brass/40 bg-gradient-to-br from-brass/20 to-flame/20">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brass">
          <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </span>
      <span className="flex items-baseline gap-0.5 text-bone">
        <span className="font-semibold">power</span>
        <span className="text-brass">·</span>
        <span className="italic text-mist">agency</span>
      </span>
    </Link>
  );
}
