import Link from "next/link";
import { NewsletterForm } from "../NewsletterForm";

interface Props {
  title: string;
  body?: string;
  ctaPrimary: { label: string; href: string };
}

export function CtaBlock({ title, body, ctaPrimary }: Props) {
  // Lead-magnet (addon email_funnel): se la CTA punta a "#newsletter" e l'addon
  // è attivo, mostriamo il form di iscrizione invece del semplice bottone.
  const isNewsletter =
    ctaPrimary.href === "#newsletter" && process.env.NEXT_PUBLIC_EMAIL_FUNNEL === "true";

  return (
    <section className="py-24 md:py-32 bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--color-accent)/0.5),transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--color-accent)/0.3),transparent_50%)]" />
      <div className="container-narrow text-center relative z-10">
        <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
          {title}
        </h2>
        {body && (
          <p className="text-lg md:text-xl opacity-85 mb-10 max-w-2xl mx-auto leading-relaxed">
            {body}
          </p>
        )}
        {isNewsletter ? (
          <NewsletterForm label={ctaPrimary.label} />
        ) : (
          <Link
            href={ctaPrimary.href}
            className="inline-flex items-center justify-center rounded-full bg-white text-primary px-10 py-5 font-semibold tracking-wide text-lg transition-all hover:scale-[1.02] hover:shadow-2xl"
          >
            {ctaPrimary.label}
          </Link>
        )}
      </div>
    </section>
  );
}
