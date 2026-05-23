import { NextRequest, NextResponse } from "next/server";
import { orderIntakeSchema } from "@/lib/validation";
import { calculateTotal } from "@/lib/catalog";
import { slugify } from "@/lib/utils";
import { uploadImage, uploadManifest } from "@/lib/blob";
import { stripe, buildLineItems } from "@/lib/stripe";
import type { OrderPayload } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGES = 30;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const raw = {
      email: form.get("email")?.toString() ?? "",
      company: form.get("company")?.toString() ?? "",
      website: form.get("website")?.toString() || undefined,
      phone: form.get("phone")?.toString() || undefined,
      sector: form.get("sector")?.toString() ?? "",
      targetAudience: form.get("targetAudience")?.toString() ?? "",
      uniqueSellingProposition: form.get("uniqueSellingProposition")?.toString() ?? "",
      primaryCta: form.get("primaryCta")?.toString() || undefined,
      secondaryCta: form.get("secondaryCta")?.toString() || undefined,
      toneOfVoice: form.get("toneOfVoice")?.toString() ?? "professional",
      preferredColors: form.get("preferredColors")?.toString() || undefined,
      contentNotes: form.get("contentNotes")?.toString() || undefined,
      videoScript: form.get("videoScript")?.toString() || undefined,
      tier: form.get("tier")?.toString() ?? "standard",
      addons: JSON.parse(form.get("addons")?.toString() || "[]"),
      forceAllImages: form.get("forceAllImages")?.toString() === "true",
      acceptedTerms: form.get("acceptedTerms") !== null,
      imageUrls: [] as string[],
    };

    const parsed = orderIntakeSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dati non validi" },
        { status: 400 },
      );
    }
    const data = parsed.data;

    // Estrai e valida le immagini
    const imageFiles: File[] = [];
    for (const [key, value] of form.entries()) {
      if (!key.startsWith("image_") || !(value instanceof File)) continue;
      if (value.size === 0) continue;
      if (value.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: `Immagine ${value.name} supera 10MB` },
          { status: 413 },
        );
      }
      imageFiles.push(value);
      if (imageFiles.length >= MAX_IMAGES) break;
    }

    const nonce = crypto.randomUUID();
    const companySlug = slugify(data.company) || "client";
    const totalEur = calculateTotal(data.tier, data.addons);

    // 1. Carica immagini su Vercel Blob
    const imageBlobUrls: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const result = await uploadImage(nonce, i, imageFiles[i]);
      imageBlobUrls.push(result.url);
    }

    // 2. Costruisci payload e caricalo come manifest.json
    const payload: OrderPayload = {
      nonce,
      createdAt: new Date().toISOString(),
      email: data.email,
      company: data.company,
      companySlug,
      website: data.website,
      phone: data.phone,
      sector: data.sector,
      targetAudience: data.targetAudience,
      uniqueSellingProposition: data.uniqueSellingProposition,
      primaryCta: data.primaryCta,
      secondaryCta: data.secondaryCta,
      toneOfVoice: data.toneOfVoice,
      preferredColors: data.preferredColors,
      contentNotes: data.contentNotes,
      videoScript: data.videoScript,
      tier: data.tier,
      addons: data.addons,
      totalEur,
      forceAllImages: data.forceAllImages,
      imageBlobUrls,
    };
    const manifest = await uploadManifest(payload);

    // 3. Crea Stripe Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002";
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      customer_email: data.email,
      line_items: buildLineItems(data.tier, data.addons),
      success_url: `${appUrl}/grazie?nonce=${nonce}`,
      cancel_url: `${appUrl}/ordina?canceled=1`,
      metadata: {
        nonce,
        tier: data.tier,
        email: data.email,
        company_slug: companySlug,
        manifest_url: manifest.url,
        total_eur: String(totalEur),
      },
    });

    return NextResponse.json({ orderId: nonce, checkoutUrl: session.url });
  } catch (err) {
    console.error("[/api/orders]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Errore interno" },
      { status: 500 },
    );
  }
}
