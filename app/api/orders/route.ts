import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { orderIntakeSchema } from "@/lib/validation";
import { calculateMonthlyTotal } from "@/lib/catalog";
import { slugify } from "@/lib/utils";
import { uploadImage, uploadEntranceImage, uploadLogo, uploadCatalogPdf, uploadManifest } from "@/lib/blob";
import { sendEmail } from "@/lib/email/send";
import { orderConfirmation } from "@/lib/email/templates";
import { TIERS } from "@/lib/catalog";
import type { OrderPayload } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGES = 30;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_ENTRANCE_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_LOGO_BYTES = 5 * 1024 * 1024;
const MAX_CATALOG_PDF_BYTES = 20 * 1024 * 1024;

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
      frequentQuestions: form.get("frequentQuestions")?.toString() || undefined,
      industryCritique: form.get("industryCritique")?.toString() || undefined,
      guarantee: form.get("guarantee")?.toString() || undefined,
      videoScript: form.get("videoScript")?.toString() || undefined,

      // Sede & orari rimossi dal briefing: si raccolgono dopo via WhatsApp.

      // Trust signals quantitativi
      yearsExperience: parseIntOpt(form.get("yearsExperience")),
      clientsServed: parseIntOpt(form.get("clientsServed")),
      certifications: form.get("certifications")?.toString() || undefined,

      // Social media e Dati legali NON sono più raccolti in fase di briefing:
      // si gestiscono dopo, via WhatsApp con il cliente. (Campi rimossi dal form.)

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
    // totalEur = CANONE MENSILE indicativo (tier + addon mensili): NON viene
    // addebitato ora. L'anteprima è gratuita; il canone si attiva solo se il
    // cliente decide di tenere il sito (gestito a parte). Salvato nel CRM.
    const totalEur = calculateMonthlyTotal(data.tier, data.addons);

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

    // 1a-ter. PDF menù/catalogo/listino (opzionale): l'AI lo legge ed estrae
    // una sezione `catalog`. Accettiamo solo application/pdf.
    let catalogPdfUrl: string | undefined;
    const pdfFile = form.get("catalogPdf");
    if (pdfFile instanceof File && pdfFile.size > 0) {
      if (pdfFile.type !== "application/pdf") {
        return NextResponse.json(
          { error: "Il file menù/catalogo deve essere un PDF." },
          { status: 415 },
        );
      }
      if (pdfFile.size > MAX_CATALOG_PDF_BYTES) {
        return NextResponse.json(
          { error: `Il PDF supera 20MB (${(pdfFile.size / 1024 / 1024).toFixed(1)}MB)` },
          { status: 413 },
        );
      }
      const uploaded = await uploadCatalogPdf(nonce, pdfFile);
      catalogPdfUrl = uploaded.url;
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
      frequentQuestions: data.frequentQuestions,
      industryCritique: data.industryCritique,
      guarantee: data.guarantee,
      catalogPdfUrl,

      // Sede & orari rimossi dal briefing: si raccolgono dopo via WhatsApp.

      yearsExperience: data.yearsExperience,
      clientsServed: data.clientsServed,
      certifications: data.certifications,

      // Social e Dati legali rimossi dal briefing: si raccolgono dopo via WhatsApp.

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

    // 3. Anteprima GRATUITA: nessun pagamento all'invio. Il cliente richiede
    //    l'anteprima → triggeriamo la pipeline async e reindirizziamo a
    //    /grazie. La pipeline gira in background su /api/orchestrate.
    //    L'eventuale canone mensile (se il cliente decide di tenere il sito)
    //    si gestisce dopo, fuori da questo flusso.
    const secret = process.env.ORCHESTRATE_SECRET || process.env.CRON_SECRET;
    if (!secret) {
      console.error("[/api/orders] ORCHESTRATE_SECRET mancante");
      return NextResponse.json(
        { error: "Configurazione server incompleta (ORCHESTRATE_SECRET)" },
        { status: 500 },
      );
    }

    // Su Vercel serverless le fetch fire-and-forget vengono CANCELLATE quando
    // la function ritorna. Usiamo `after()` (Next.js 15) che garantisce
    // l'esecuzione DOPO la response, mantenendo viva la function.
    const manifestUrl = manifest.url;
    const orchestrateSecret = secret;

    // Mail conferma — no-op se RESEND_API_KEY non è settata.
    const tierName = TIERS.find((t) => t.key === payload.tier)?.name ?? payload.tier;
    sendEmail({
      to: payload.email,
      subject: `Richiesta di anteprima ricevuta — ${payload.company}`,
      html: orderConfirmation({
        firstName: payload.firstName || payload.company,
        company: payload.company,
        tier: tierName,
        totalEur,
        orderId: payload.nonce,
      }),
    }).catch((e) => console.warn("[/api/orders] order confirmation email error:", e));

    after(async () => {
      try {
        const res = await fetch(`${appUrl}/api/orchestrate`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${orchestrateSecret}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ manifestUrl, nonce }),
        });
        if (!res.ok) {
          console.error(
            `[/api/orders] orchestrate fallito ${res.status} per ${nonce}:`,
            await res.text(),
          );
        } else {
          console.log(`[/api/orders] orchestrate OK per ${nonce}`);
        }
      } catch (e) {
        console.error(`[/api/orders] orchestrate fetch error per ${nonce}:`, e);
      }
    });

    console.log(`[/api/orders] anteprima gratuita — pipeline scheduled for ${nonce}`);
    return NextResponse.json({
      orderId: nonce,
      redirectUrl: `/grazie?nonce=${nonce}`,
    });
  } catch (err) {
    console.error("[/api/orders]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Errore interno" },
      { status: 500 },
    );
  }
}
