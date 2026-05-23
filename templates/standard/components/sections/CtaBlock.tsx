import Link from "next/link";

interface Props {
  title: string;
  body?: string;
  ctaPrimary: { label: string; href: string };
}

export function CtaBlock({ title, body, ctaPrimary }: Props) {
  return (
    <section className="py-20 md:py-28 bg-primary text-white">
      <div className="container-narrow text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
        {body && <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">{body}</p>}
        <Link href={ctaPrimary.href} className="btn-primary">
          {ctaPrimary.label}
        </Link>
      </div>
    </section>
  );
}
