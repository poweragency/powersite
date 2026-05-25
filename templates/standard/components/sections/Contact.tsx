interface Props {
  title: string;
  address?: string;
  phone?: string;
  email?: string;
}

/**
 * Estrae numero "puro" per wa.me (solo cifre, niente + né spazi).
 * Ritorna null se il phone non sembra internazionale valido (deve avere ≥10 cifre).
 */
function whatsappNumber(phone?: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits : null;
}

/**
 * Sezione contatti.
 *
 * Form-contatti (POST → /api/contact → CRM cliente) renderizzato SOLO se
 * `NEXT_PUBLIC_CONTACT_FORM === "true"` (iniettata da deploy-vercel quando
 * uno dei 2 addon Modulo Contatti è attivo). Altrimenti la sezione è
 * info-only (telefono/email/indirizzo), il cliente riceve i contatti via
 * canali diretti perché non ha CRM dove raccoglierli.
 */
export function Contact({ title, address, phone, email }: Props) {
  const showForm = process.env.NEXT_PUBLIC_CONTACT_FORM === "true";
  const waNumber = whatsappNumber(phone);
  return (
    <section id="contatti" className="py-20 md:py-28 bg-secondary">
      <div className={`container-narrow ${showForm ? "grid md:grid-cols-2 gap-12" : "max-w-2xl text-center"}`}>
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {title}
          </h2>
          <ul className={`space-y-3 text-ink/80 ${showForm ? "" : "inline-block text-left"}`}>
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
                {waNumber && (
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/15 px-3 py-1 text-xs font-semibold text-[#1f8d4a] transition-colors hover:bg-[#25D366]/30"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.5.7.3 1.25.48 1.68.61.7.22 1.34.19 1.85.12.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35zM12 2C6.5 2 2 6.5 2 12c0 1.93.55 3.73 1.5 5.25L2 22l4.88-1.5C8.38 21.45 10.13 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
                    </svg>
                    WhatsApp
                  </a>
                )}
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

        {showForm && (
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
            <input
              name="phone"
              type="tel"
              placeholder="Telefono (opzionale)"
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
        )}
      </div>
    </section>
  );
}
