interface CatalogItem {
  name: string;
  description?: string;
  price?: string;
}
interface CatalogCategory {
  name: string;
  items: CatalogItem[];
}
interface Props {
  title: string;
  subtitle?: string;
  categories: CatalogCategory[];
}

/**
 * Sezione Catalogo / Menù / Listino — estratta dal PDF caricato dal cliente.
 * Layout editoriale: categorie come blocchi, voci in lista con prezzo allineato
 * a destra (puntinato tipografico tipo menù di ristorante).
 */
export function Catalog({ title, subtitle, categories }: Props) {
  return (
    <section id="catalogo" className="py-24 md:py-32 bg-secondary">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <p className="section-eyebrow">Catalogo</p>
          <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl text-primary">{title}</h2>
          {subtitle && (
            <p className="mt-5 text-lg text-ink/70 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
          {categories.map((cat, ci) => (
            <div key={ci}>
              <h3 className="text-2xl font-semibold text-primary mb-2">{cat.name}</h3>
              <div className="hairline mb-6 max-w-[80px]" />
              <ul className="space-y-5">
                {cat.items.map((item, ii) => (
                  <li key={ii}>
                    <div className="flex items-baseline gap-3">
                      <span className="font-medium text-ink">{item.name}</span>
                      <span className="flex-1 border-b border-dotted border-ink/20 translate-y-[-3px]" />
                      {item.price && (
                        <span className="flex-none font-semibold text-accent whitespace-nowrap">
                          {item.price}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm text-ink/60 leading-relaxed max-w-prose">
                        {item.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
