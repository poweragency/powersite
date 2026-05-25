interface Props {
  title: string;
  address?: string;
  phone?: string;
  email?: string;
}

/**
 * Sezione contatti Premium.
 * Form-contatti renderizzato SOLO se NEXT_PUBLIC_CONTACT_FORM === "true"
 * (iniettata da deploy-vercel.ts quando uno dei 2 addon Modulo Contatti
 * è attivo). Vedi templates/standard/components/sections/Contact.tsx
 * per il razionale completo.
 */
export function Contact({ title, address, phone, email }: Props) {
  const showForm = process.env.NEXT_PUBLIC_CONTACT_FORM === "true";
  return (
    <section id="contatti" className="py-24 md:py-32 bg-secondary">
      <div className={`container-narrow ${showForm ? "grid md:grid-cols-2 gap-16" : "max-w-3xl text-center"}`}>
        <div>
          <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl text-primary mb-8">
            {title}
          </h2>
          <ul className={`space-y-5 text-ink/80 ${showForm ? "" : "inline-block text-left"}`}>
            {address && (
              <li>
                <strong className="block text-xs uppercase tracking-[0.2em] text-accent mb-2 font-semibold">
                  Indirizzo
                </strong>
                <span className="text-lg">{address}</span>
              </li>
            )}
            {phone && (
              <li>
                <strong className="block text-xs uppercase tracking-[0.2em] text-accent mb-2 font-semibold">
                  Telefono
                </strong>
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="text-lg hover:text-accent transition-colors"
                >
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li>
                <strong className="block text-xs uppercase tracking-[0.2em] text-accent mb-2 font-semibold">
                  Email
                </strong>
                <a
                  href={`mailto:${email}`}
                  className="text-lg hover:text-accent transition-colors"
                >
                  {email}
                </a>
              </li>
            )}
          </ul>
        </div>

        {showForm && (
          <form
            action="/api/contact"
            method="POST"
            className="space-y-5 bg-canvas p-8 md:p-10 rounded-3xl border border-primary/10 shadow-sm"
          >
            <h3 className="text-xl font-semibold text-primary mb-2">Scrivici</h3>
            <input
              name="name"
              type="text"
              required
              placeholder="Nome e cognome *"
              className="w-full rounded-xl border border-ink/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email *"
              className="w-full rounded-xl border border-ink/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Telefono (opzionale)"
              className="w-full rounded-xl border border-ink/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Raccontaci di cosa hai bisogno *"
              className="w-full rounded-xl border border-ink/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <button type="submit" className="btn-primary w-full">
              Invia richiesta
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
