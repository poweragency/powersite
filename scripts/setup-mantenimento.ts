/**
 * Setup idempotente del prodotto Stripe "Mantenimento Power" — subscription
 * mensile 19€/mese proposta come UPSELL durante la chiamata di delivery.
 *
 * Cosa fa:
 *   1. Cerca/crea Product "Mantenimento Power" (lookup via metadata.key)
 *   2. Cerca/crea Price ricorrente 19€/mese EUR (lookup via lookup_key)
 *   3. Cerca/crea Payment Link che punta al Price
 *   4. Stampa l'URL del Payment Link da salvare/inviare via WhatsApp
 *
 * Idempotente: rilanciarlo non duplica nulla.
 *
 * Uso:
 *   1. Assicurati STRIPE_SECRET_KEY in .env.local
 *   2. npx tsx scripts/setup-mantenimento.ts
 *
 * Per cambiare prezzo (es. da 19 a 14):
 *   1. Cambia PRICE_EUR sotto
 *   2. Cambia LOOKUP_KEY (es. "mantenimento_power_14_eur_monthly")
 *   3. Rilancia → crea un nuovo Price (Stripe non permette mutate dei Price esistenti)
 *      e un nuovo Payment Link. Il vecchio Payment Link continua a funzionare per chi
 *      lo ha già ricevuto (puoi disattivarlo manualmente dal Dashboard).
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import Stripe from "stripe";

config({ path: resolve(process.cwd(), ".env.local") });

const PRICE_EUR = 19;
const LOOKUP_KEY = `mantenimento_power_${PRICE_EUR}_eur_monthly`;
const PRODUCT_METADATA_KEY = "mantenimento_power";

async function main() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    console.error("❌ STRIPE_SECRET_KEY mancante in .env.local");
    process.exit(1);
  }

  const stripe = new Stripe(apiKey, { apiVersion: "2025-02-24.acacia" });

  console.log(`\n🔧 Setup "Mantenimento Power" — ${PRICE_EUR}€/mese\n`);

  // 1. Product (idempotente via metadata)
  const existingProducts = await stripe.products.search({
    query: `metadata['key']:'${PRODUCT_METADATA_KEY}' AND active:'true'`,
    limit: 1,
  });

  let product: Stripe.Product;
  if (existingProducts.data.length > 0) {
    product = existingProducts.data[0];
    console.log(`✓ Product esistente: ${product.id}`);
  } else {
    product = await stripe.products.create({
      name: "Mantenimento Power",
      description:
        "Hosting Vercel, rinnovo dominio, 1 modifica testi/foto al mese, report mensile basic.",
      metadata: { key: PRODUCT_METADATA_KEY },
    });
    console.log(`✓ Product creato: ${product.id}`);
  }

  // 2. Price (idempotente via lookup_key)
  const existingPrices = await stripe.prices.list({
    lookup_keys: [LOOKUP_KEY],
    active: true,
    limit: 1,
  });

  let price: Stripe.Price;
  if (existingPrices.data.length > 0) {
    price = existingPrices.data[0];
    console.log(`✓ Price esistente: ${price.id} (${(price.unit_amount ?? 0) / 100}€/mese)`);
  } else {
    price = await stripe.prices.create({
      product: product.id,
      currency: "eur",
      unit_amount: PRICE_EUR * 100,
      recurring: { interval: "month" },
      lookup_key: LOOKUP_KEY,
      nickname: `Mantenimento Power — ${PRICE_EUR}€/mese`,
    });
    console.log(`✓ Price creato: ${price.id}`);
  }

  // 3. Payment Link (cerco esistente filtrando per line_items che usa il nostro Price)
  const existingLinks = await stripe.paymentLinks.list({ active: true, limit: 100 });
  const matchingLink = existingLinks.data.find((link) => link.metadata.key === PRODUCT_METADATA_KEY);

  let link: Stripe.PaymentLink;
  if (matchingLink) {
    link = matchingLink;
    console.log(`✓ Payment Link esistente: ${link.id}`);
  } else {
    link = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { key: PRODUCT_METADATA_KEY },
      // Niente shipping, niente collect address — subscription pulita
      // Il cliente compila solo metodo di pagamento + email
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });
    console.log(`✓ Payment Link creato: ${link.id}`);
  }

  console.log(`\n✅ Pronto. URL da inviare via WhatsApp al cliente:\n`);
  console.log(`   ${link.url}\n`);
  console.log(`Suggerimento: salvalo in .env.local come:`);
  console.log(`   STRIPE_MANTENIMENTO_PAYMENT_LINK=${link.url}\n`);
}

main().catch((err) => {
  console.error("\n❌ Errore:", err);
  process.exit(1);
});
