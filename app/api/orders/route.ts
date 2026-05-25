import { NextRequest, NextResponse } from "next/server";
import { orderIntakeSchema } from "@/lib/validation";
import { calculateTotal } from "@/lib/catalog";
import { slugify } from "@/lib/utils";
import { uploadImage, uploadEntranceImage, uploadLogo, uploadManifest } from "@/lib/blob";
import { stripe, buildLineItems } from "@/lib/stripe";
import type { OrderPayload } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGES = 30;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_ENTRANCE_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_LOGO_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const parseIntOpt = (v: FormDataEntryValue | null): number | undefined => {
      const s = v?.toString().trim();
      if (!s) return undefined;
      const n = Number.parseInt(s, 10);
      return Number.isFinite(n) && n >= 0 ? n : undefined;
    };

    const raw = {
      firstName: form.get("firstName")?.toString().trim() ?? "",
      lastName: form.get("lastName")?.toString().trim() ?? "",
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
      avoidInCopy: form.get("avoidInCopy")?.toString() || undefined,
      videoScript: form.get("videoScript")?.toString() || undefined,

      // Indirizzo strutturato
      worksRemotely: form.get("worksRemotely")?.toString() === "true",
      addressStreet: form.get("addressStreet")?.toString() || undefined,
      addressNumber: form.get("addressNumber")?.toString() || undefined,
      addressCity: form.get("addressCity")?.toString() || undefined,
      addressCap: form.get("addressCap")?.toString() || undefined,
      addressProvince: form.get("addressProvince")?.toString().toUpperCase() || undefined,
      openingHours: form.get("openingHours")?.toString() || undefined,

      // Trust signals quantitativi
      yearsExperience: parseIntOpt(form.get("yearsExperience")),
      clientsServed: parseIntOpt(form.get("clientsServed")),
      certifications: form.get("certifications")?.toString() || undefined,

      // Social media
      socialInstagram: form.get("socialInstagram")?.toString() || undefined,
      socialFacebook: form.get("socialFacebook")?.toString() || undefined,
      socialLinkedin: form.get("socialLinkedin")?.toString() || undefined,
      socialTiktok: form.get("socialTiktok")?.toString() || undefined,

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

    // 1a-bis. Logo cliente (opzionale, separato dalle altre immagini)
    let logoBlobUrl: string | undefined;
    const logoFile = form.get("logo");
    if (logoFile instanceof File && logoFile.size > 0) {
      if (logoFile.size > MAX_LOGO_BYTES) {
        return NextResponse.json(
          { error: `Logo supera 5MB (${(logoFile.size / 1024 / 1024).toFixed(1)}MB)` },
          { status: 413 },
        );
      }
      const uploaded = await uploadLogo(nonce, logoFile);
      logoBlobUrl = uploaded.url;
    }

    // 1b. (Solo Signature) due immagini ingresso hi-res (mobile + desktop)
    let entranceImageMobileUrl: string | undefined;
    let entranceImageDesktopUrl: string | undefined;

    for (const format of ["mobile", "desktop"] as const) {
      const entranceFile = form.get(`entrance_image_${format}`);
      if (entranceFile instanceof File && entranceFile.size > 0) {
        if (entranceFile.size > MAX_ENTRANCE_IMAGE_BYTES) {
          return NextResponse.json(
            { error: `Immagine ingresso ${format} supera 15MB (${(entranceFile.size / 1024 / 1024).toFixed(1)}MB)` },
            { status: 413 },
          );
        }
        const uploaded = await uploadEntranceImage(nonce, format, entranceFile);
        if (format === "mobile") entranceImageMobileUrl = uploaded.url;
        else entranceImageDesktopUrl = uploaded.url;
      }
    }

    // 2. Costruisci payload e caricalo come manifest.json
    const payload: OrderPayload = {
      nonce,
      createdAt: new Date().toISOString(),
      firstName: data.firstName,
      lastName: data.lastName,
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
      avoidInCopy: data.avoidInCopy,

      worksRemotely: data.worksRemotely,
      addressStreet: data.addressStreet,
      addressNumber: data.addressNumber,
      addressCity: data.addressCity,
      addressCap: data.addressCap || undefined,
      addressProvince: data.addressProvince || undefined,
      openingHours: data.openingHours,

      yearsExperience: data.yearsExperience,
      clientsServed: data.clientsServed,
      certifications: data.certifications,

      socialInstagram: data.socialInstagram || undefined,
      socialFacebook: data.socialFacebook || undefined,
      socialLinkedin: data.socialLinkedin || undefined,
      socialTiktok: data.socialTiktok || undefined,

      logoBlobUrl,

      tier: data.tier,
      addons: data.addons,
      totalEur,
      forceAllImages: data.forceAllImages,
      imageBlobUrls,
      entranceImageMobileUrl,
      entranceImageDesktopUrl,
    };
    const manifest = await uploadManifest(payload);

    // appUrl per redirect Stripe + per chiamata interna /api/orchestrate.
    // In prod usa NEXT_PUBLIC_APP_URL; in dev locale fallback all'origin
    // della request stessa (così funziona su qualsiasi porta del dev server).
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;

    // 3a. Modalità BYPASS_STRIPE: salta pagamento, triggera pipeline async
    //     e reindirizza a /grazie. Pipeline gira in background su /api/orchestrate.
    if (process.env.BYPASS_STRIPE === "true") {
      const secret = process.env.ORCHESTRATE_SECRET || process.env.CRON_SECRET;
      if (!secret) {
        console.error("[/api/orders] BYPASS_STRIPE attivo ma ORCHESTRATE_SECRET mancante");
        return NextResponse.json(
          { error: "Configurazione server incompleta (ORCHESTRATE_SECRET)" },
          { status: 500 },
        );
      }

      // Fire-and-forget: NON awaitiamo. Catch silenzia errori di rete iniziali.
      // La pipeline poi gestisce i propri errori internamente.
      fetch(`${appUrl}/api/orchestrate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ manifestUrl: manifest.url, nonce }),
      }).catch((e) => {
        console.error(`[/api/orders] orchestrate trigger fallito per ${nonce}:`, e);
      });

      console.log(`[/api/orders] BYPASS_STRIPE — pipeline triggered for ${nonce}`);
      return NextResponse.json({
        orderId: nonce,
        redirectUrl: `/grazie?nonce=${nonce}`,
      });
    }

    // 3b. Modalità Stripe normale (default): crea Checkout Session
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
