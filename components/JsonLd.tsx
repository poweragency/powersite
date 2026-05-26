/**
 * Inserisce uno script application/ld+json nell'<head>.
 * Wrapper minimale: passa l'oggetto JS, il componente lo serializza.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
