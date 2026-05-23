interface Props {
  title: string;
  address?: string;
  phone?: string;
  email?: string;
}

export function Contact({ title, address, phone, email }: Props) {
  return (
    <section id="contatti" className="py-20 md:py-28 bg-secondary">
      <div className="container-narrow grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {title}
          </h2>
          <ul className="space-y-3 text-ink/80">
            {address && (
              <li>
                <strong className="block text-sm uppercase tracking-wider text-accent mb-1">
                  Indirizzo
                </strong>
                {address}
              </li>
            )}
            {phone && (
              <li>
                <strong className="block text-sm uppercase tracking-wider text-accent mb-1">
                  Telefono
                </strong>
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-accent">
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li>
                <strong className="block text-sm uppercase tracking-wider text-accent mb-1">
                  Email
                </strong>
                <a href={`mailto:${email}`} className="hover:text-accent">
                  {email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <form action="/api/contact" method="POST" className="space-y-4 bg-canvas p-6 rounded-2xl border border-ink/5">
          <h3 className="font-semibold text-primary mb-2">Scrivici</h3>
          <input
            name="name"
            type="text"
            required
            placeholder="Nome *"
            className="w-full rounded-md border border-ink/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email *"
            className="w-full rounded-md border border-ink/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Messaggio *"
            className="w-full rounded-md border border-ink/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button type="submit" className="btn-primary w-full">
            Invia
          </button>
        </form>
      </div>
    </section>
  );
}
