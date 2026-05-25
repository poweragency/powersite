"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ADDONS, TIERS, calculateTotal } from "@/lib/catalog";
import type { AddonKey, Tier } from "@/lib/types";
import { cn, formatEur } from "@/lib/utils";
import { ShowcaseModal } from "@/components/ShowcaseModal";

const FORM_ID = "order-form";
const MIN_ENTRANCE_DIMENSION = 1920;
const MAX_ENTRANCE_BYTES = 15 * 1024 * 1024;

const TONE_OPTIONS: { value: string; label: string }[] = [
  { value: "professional", label: "Professionale" },
  { value: "friendly", label: "Amichevole" },
  { value: "luxury", label: "Lusso / esclusivo" },
  { value: "energetic", label: "Energico / dinamico" },
  { value: "minimal", label: "Minimale / essenziale" },
];

type Step = 1 | 2;

function StepIndicator({ current }: { current: Step }) {
  const items: { n: number; label: string }[] = [
    { n: 1, label: "Il tuo brief" },
    { n: 2, label: "Pacchetto" },
  ];
  return (
    <div className="mb-12 flex items-center justify-center gap-3 md:gap-5">
      {items.map((item, i) => {
        const active = current === item.n;
        const done = current > item.n;
        return (
          <div key={item.n} className="flex items-center gap-3 md:gap-5">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full border-2 font-display text-sm font-bold transition-all duration-500",
                  active && "border-brass bg-brass text-obsidian shadow-[0_0_20px_-5px_rgba(201,165,92,0.6)]",
                  done && "border-brass/60 bg-brass/20 text-brass",
                  !active && !done && "border-bone/20 bg-coal text-mist",
                )}
              >
                {done ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  item.n
                )}
              </span>
              <span
                className={cn(
                  "font-display text-sm tracking-tighter transition-colors hidden sm:inline",
                  active ? "text-cream" : "text-mist",
                )}
              >
                {item.label}
              </span>
            </div>
            {i < items.length - 1 && (
              <div
                className={cn(
                  "h-px w-12 transition-colors md:w-20",
                  done ? "bg-brass" : "bg-bone/20",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface EntranceSlotProps {
  format: EntranceFormat;
  label: string;
  aspect: string;
  file: File | null;
  meta: { w: number; h: number } | null;
  error: string | null;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

function EntranceSlot({ format, label, aspect, file, meta, error, onSelect, onRemove }: EntranceSlotProps) {
  const isPortrait = format === "mobile";
  const badgeClass = cn(
    "shrink-0 grid place-items-center rounded border border-brass/40 bg-brass/15 text-brass",
    isPortrait ? "h-9 w-6" : "h-6 w-9",
  );
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-brass">{label}</span>
        <span className="font-mono text-[10px] text-mist">{aspect}</span>
      </div>
      {file ? (
        <div className="flex items-center gap-3 rounded-lg border border-brass/30 bg-coal px-3 py-2.5">
          <span className={badgeClass}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate font-mono text-[11px] text-cream" title={file.name}>{file.name}</div>
            <div className="text-[10px] text-mist">
              {meta?.w}×{meta?.h} · {(file.size / 1024 / 1024).toFixed(1)}MB
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-[10px] font-medium uppercase tracking-widest text-flame hover:underline shrink-0"
          >
            Rimuovi
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-brass/30 bg-coal/40 px-3 py-2.5 transition-all hover:border-brass hover:bg-brass/10">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onSelect}
            className="sr-only"
          />
          <span className={badgeClass}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-cream">Carica foto</div>
            <div className="text-[10px] text-mist">min 1920px · max 15MB</div>
          </div>
        </label>
      )}
      {error && <p className="mt-1 text-[10px] text-flame-300">{error}</p>}
    </div>
  );
}

function SectionHeader({ n, title, hint }: { n: string; title: string; hint?: string }) {
  return (
    <div className="mb-6 flex items-baseline gap-4 border-b border-bone/10 pb-5">
      <span className="font-display text-2xl italic text-brass">{n}</span>
      <h2 className="display text-2xl font-bold tracking-tighter text-cream md:text-3xl">{title}</h2>
      {hint && <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-mist">{hint}</span>}
    </div>
  );
}

type EntranceFormat = "mobile" | "desktop";

async function validateEntranceImage(
  file: File,
  format: EntranceFormat,
): Promise<{ ok: true; w: number; h: number } | { ok: false; reason: string }> {
  if (file.size > MAX_ENTRANCE_BYTES) {
    return { ok: false, reason: `Massimo 15MB (questa è ${(file.size / 1024 / 1024).toFixed(1)}MB)` };
  }
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { naturalWidth: w, naturalHeight: h } = img;
      const longEdge = Math.max(w, h);
      if (longEdge < MIN_ENTRANCE_DIMENSION) {
        resolve({
          ok: false,
          reason: `Risoluzione troppo bassa: ${w}×${h}. Serve almeno ${MIN_ENTRANCE_DIMENSION}px sul lato lungo.`,
        });
        return;
      }
      if (format === "mobile" && h <= w) {
        resolve({
          ok: false,
          reason: `Serve un'immagine verticale (es. 1080×1920). Questa è ${w}×${h}, orizzontale.`,
        });
        return;
      }
      if (format === "desktop" && w <= h) {
        resolve({
          ok: false,
          reason: `Serve un'immagine orizzontale (es. 1920×1080). Questa è ${w}×${h}, verticale.`,
        });
        return;
      }
      resolve({ ok: true, w, h });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ ok: false, reason: "Impossibile leggere l'immagine" });
    };
    img.src = url;
  });
}

export default function OrderForm() {
  const params = useSearchParams();
  const router = useRouter();

  const initialTier = (params.get("tier") as Tier) ?? "premium";

  const [step, setStep] = useState<Step>(1);
  const [tier, setTier] = useState<Tier>(initialTier);
  const [addons, setAddons] = useState<AddonKey[]>([]);
  const [forceAllImages, setForceAllImages] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [signatureMode, setSignatureMode] = useState<"text" | "image" | null>(null);
  const [showcaseTier, setShowcaseTier] = useState<Tier | null>(null);
  const [videoScript, setVideoScript] = useState("");
  const [entranceMobile, setEntranceMobile] = useState<File | null>(null);
  const [entranceMobileMeta, setEntranceMobileMeta] = useState<{ w: number; h: number } | null>(null);
  const [entranceMobileError, setEntranceMobileError] = useState<string | null>(null);
  const [entranceDesktop, setEntranceDesktop] = useState<File | null>(null);
  const [entranceDesktopMeta, setEntranceDesktopMeta] = useState<{ w: number; h: number } | null>(null);
  const [entranceDesktopError, setEntranceDesktopError] = useState<string | null>(null);
  const [worksRemotely, setWorksRemotely] = useState(false);
  const [logoChoice, setLogoChoice] = useState<"upload" | "design" | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quando l'utente sceglie "voglio un logo nuovo" → seleziona auto addon
  // logo_design; quando deseleziona o sceglie "upload" → rimuovi addon.
  function chooseLogoOption(option: "upload" | "design" | null) {
    setLogoChoice(option);
    setAddons((curr) => {
      if (option === "design") return curr.includes("logo_design") ? curr : [...curr, "logo_design"];
      return curr.filter((k) => k !== "logo_design");
    });
    if (option !== "upload") setLogoFile(null);
  }

  const total = useMemo(() => calculateTotal(tier, addons), [tier, addons]);

  function toggleAddon(key: AddonKey) {
    // Mutual exclusivity per i 2 addon "Modulo contatti": cliccandone uno,
    // l'altro si deseleziona automaticamente (è UNA scelta tra due opzioni
    // di delivery, non due cose acquistabili insieme).
    const CONTACT_FORM_PAIR: AddonKey[] = ["contact_form_integration", "contact_form_bespoke"];
    setAddons((curr) => {
      if (curr.includes(key)) {
        return curr.filter((k) => k !== key);
      }
      if (CONTACT_FORM_PAIR.includes(key)) {
        const other = CONTACT_FORM_PAIR.find((k) => k !== key)!;
        return [...curr.filter((k) => k !== other), key];
      }
      return [...curr, key];
    });
  }

  function onImagesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter((f) => f.size <= 10 * 1024 * 1024);
    if (valid.length !== files.length) {
      setError("Alcune immagini superano 10MB e sono state escluse.");
    }
    setImages((curr) => [...curr, ...valid].slice(0, 30));
  }

  function removeImage(i: number) {
    setImages((curr) => curr.filter((_, idx) => idx !== i));
  }

  async function onEntranceSelected(
    e: React.ChangeEvent<HTMLInputElement>,
    format: EntranceFormat,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const setErr = format === "mobile" ? setEntranceMobileError : setEntranceDesktopError;
    const setFile = format === "mobile" ? setEntranceMobile : setEntranceDesktop;
    const setMeta = format === "mobile" ? setEntranceMobileMeta : setEntranceDesktopMeta;
    setErr(null);
    const result = await validateEntranceImage(file, format);
    if (result.ok) {
      setFile(file);
      setMeta({ w: result.w, h: result.h });
    } else {
      setFile(null);
      setMeta(null);
      setErr(result.reason);
    }
  }

  function removeEntrance(format: EntranceFormat) {
    if (format === "mobile") {
      setEntranceMobile(null);
      setEntranceMobileMeta(null);
      setEntranceMobileError(null);
    } else {
      setEntranceDesktop(null);
      setEntranceDesktopMeta(null);
      setEntranceDesktopError(null);
    }
  }

  function goToStep2() {
    setError(null);
    setStep(2);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goToStep1() {
    setError(null);
    setStep(1);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (step !== 2) {
      // Step 1 completato → vai a step 2 (validation HTML5 ha già verificato i required)
      goToStep2();
      return;
    }

    if (!acceptedTerms) {
      setError("Devi accettare i termini per procedere.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set("tier", tier);
    formData.set("addons", JSON.stringify(addons));
    formData.set("forceAllImages", forceAllImages ? "true" : "false");
    formData.set("acceptedTerms", "true");
    images.forEach((img, i) => formData.append(`image_${i}`, img));
    if (tier === "business" && signatureMode === "image") {
      if (entranceMobile) formData.append("entrance_image_mobile", entranceMobile);
      if (entranceDesktop) formData.append("entrance_image_desktop", entranceDesktop);
    }
    if (tier !== "business" || signatureMode !== "text") {
      formData.delete("videoScript");
    }

    try {
      const res = await fetch("/api/orders", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Errore nell'invio dell'ordine");

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        router.push(`/grazie?nonce=${data.orderId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <ShowcaseModal tier={showcaseTier} onClose={() => setShowcaseTier(null)} />
      <StepIndicator current={step} />

      <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
        {/* ─── FORM PRINCIPALE ─────────────────────────── */}
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-16">
          {step === 1 ? (
            <>
              <header>
                <Link
                  href="/"
                  className="group mb-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-mist transition-colors hover:text-brass"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:-translate-x-0.5"
                  >
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Torna al sito
                </Link>
                <div>
                  <span className="chip-brass">Step 1 di 2</span>
                </div>
                <h1 className="display mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tightest text-cream md:text-5xl">
                  Parlaci di <span className="serif-italic">te.</span>
                </h1>
                <p className="mt-5 max-w-xl text-pretty text-mist">
                  Cinque minuti di brief. Quello che ci dici qui diventa il sito
                  che riceverai entro 48 ore. Dopo, scegli il pacchetto.
                </p>
                <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-brass/30 bg-brass/5 px-5 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-brass">
                    Consiglio
                  </span>
                  <p className="text-sm text-bone">
                    <strong className="text-cream">Più compili, più preciso sarà il tuo sito.</strong>{" "}
                    Ogni campo aiuta il copy a raccontarti meglio.
                  </p>
                </div>
              </header>

              {/* ─── I. CONTATTI ──────────────────────── */}
              <section>
                <SectionHeader n="I" title="I tuoi contatti" />
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="label">Nome *</label>
                    <input name="firstName" type="text" required placeholder="Mario" className="input" autoComplete="given-name" />
                  </div>
                  <div>
                    <label className="label">Cognome *</label>
                    <input name="lastName" type="text" required placeholder="Rossi" className="input" autoComplete="family-name" />
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input name="email" type="email" required placeholder="tu@azienda.it" className="input" autoComplete="email" />
                    <p className="mt-2 text-xs text-mist">Conferma dell&apos;ordine e riferimenti.</p>
                  </div>
                  <div>
                    <label className="label">Nome azienda *</label>
                    <input name="company" type="text" required placeholder="es. Studio Bianchi" className="input" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label flex items-baseline gap-2">
                      <span>Telefono *</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-brass">WhatsApp</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="+39 333 1234567"
                      className="input"
                      autoComplete="tel"
                    />
                    <div className="mt-2 rounded-lg border border-brass/30 bg-brass/5 p-3">
                      <p className="text-xs leading-relaxed text-bone">
                        <strong className="text-brass">Importante:</strong> il
                        sito finito ti verrà inviato direttamente su WhatsApp
                        da uno dei nostri tecnici. Assicurati di scrivere un
                        numero <strong>raggiungibile su WhatsApp</strong>,
                        completo di prefisso (+39 per l&apos;Italia).
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Sito attuale (opz.)</label>
                    <input name="website" type="url" placeholder="https://" className="input" autoComplete="url" />
                  </div>
                </div>
              </section>

              {/* ─── II. SEDE & ORARI ───────────────── */}
              <section>
                <SectionHeader n="II" title="Sede & orari" hint="opz." />
                <label className="mb-5 flex cursor-pointer items-center gap-3 rounded-xl border border-bone/10 bg-coal/50 p-4 text-sm text-mist transition-colors hover:bg-coal">
                  <input
                    type="checkbox"
                    checked={worksRemotely}
                    onChange={(e) => setWorksRemotely(e.target.checked)}
                    className="h-4 w-4 accent-brass"
                  />
                  <span>
                    <strong className="text-cream">Lavoro solo online</strong> — niente sede fisica
                  </span>
                </label>
                <input type="hidden" name="worksRemotely" value={String(worksRemotely)} />
                {!worksRemotely && (
                  <div className="grid gap-5 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <label className="label">Via</label>
                      <input name="addressStreet" type="text" placeholder="es. Via Brera" className="input" autoComplete="address-line1" />
                    </div>
                    <div>
                      <label className="label">N° civico</label>
                      <input name="addressNumber" type="text" placeholder="12" className="input" />
                    </div>
                    <div>
                      <label className="label">CAP</label>
                      <input name="addressCap" type="text" maxLength={5} pattern="\d{5}" placeholder="20121" className="input" autoComplete="postal-code" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="label">Città</label>
                      <input name="addressCity" type="text" placeholder="Milano" className="input" autoComplete="address-level2" />
                    </div>
                    <div>
                      <label className="label">Prov.</label>
                      <input name="addressProvince" type="text" maxLength={2} pattern="[A-Za-z]{2}" placeholder="MI" className="input uppercase" />
                    </div>
                    <div className="md:col-span-3">
                      <label className="label">Orari di apertura (opz.)</label>
                      <textarea
                        name="openingHours"
                        rows={3}
                        placeholder={"Lun-Ven: 9:00 - 19:00\nSab: 9:00 - 13:00\nDom: chiuso"}
                        className="textarea font-mono text-xs"
                      />
                      <p className="mt-2 text-xs text-mist">Aiuta i clienti a sapere quando contattarti. Finisce nel footer + FAQ.</p>
                    </div>
                  </div>
                )}
              </section>

              {/* ─── III. ESPERIENZA ──────────────────── */}
              <section>
                <SectionHeader n="III" title="La tua esperienza" hint="opz. ma fortemente consigliato" />
                <p className="mb-5 text-xs text-mist">
                  Numeri e credenziali alimentano la sezione &ldquo;perché fidarsi di te&rdquo; del sito.
                  <strong className="text-bone"> Non inventiamo dati</strong>: lascia vuoto se non hai certezze.
                </p>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="label">Anni di esperienza (opz.)</label>
                    <input name="yearsExperience" type="number" min={0} max={150} placeholder="es. 20" className="input" />
                  </div>
                  <div>
                    <label className="label">Clienti / pazienti / progetti totali (opz.)</label>
                    <input name="clientsServed" type="number" min={0} placeholder="es. 500" className="input" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Certificazioni, qualifiche, iscrizioni albi (opz.)</label>
                    <textarea
                      name="certifications"
                      rows={3}
                      placeholder="es. Iscritto Albo Odontoiatri MI n. 12345&#10;ISO 9001 dal 2018&#10;Laurea in Odontoiatria — Milano 2003"
                      className="textarea"
                    />
                  </div>
                </div>
              </section>

              {/* ─── IV. LOGO ──────────────────────────── */}
              <section>
                <SectionHeader n="IV" title="Logo aziendale" hint="scegli un'opzione" />
                <input type="hidden" name="logoChoice" value={logoChoice ?? ""} />
                <div className="grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => chooseLogoOption("upload")}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
                      logoChoice === "upload"
                        ? "border-brass bg-brass/10"
                        : "border-bone/10 bg-coal/60 hover:border-bone/30",
                    )}
                  >
                    <span className="font-semibold text-cream">Ho già il mio logo</span>
                    <span className="text-xs text-mist">Lo carichi tu, lo metto nel sito.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => chooseLogoOption("design")}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
                      logoChoice === "design"
                        ? "border-brass bg-brass/10"
                        : "border-bone/10 bg-coal/60 hover:border-bone/30",
                    )}
                  >
                    <span className="flex w-full items-baseline justify-between">
                      <span className="font-semibold text-cream">Non ho un logo</span>
                      <span className="font-mono text-xs text-brass">+{formatEur(197)}</span>
                    </span>
                    <span className="text-xs text-mist">Te lo disegniamo noi — addon &ldquo;Logo design su misura&rdquo;.</span>
                  </button>
                </div>
                {logoChoice === "upload" && (
                  <div className="mt-5">
                    <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-brass/30 bg-coal/40 px-4 py-3 transition-all hover:border-brass hover:bg-brass/10">
                      <input
                        type="file"
                        name="logo"
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                        className="sr-only"
                      />
                      <span className="grid h-10 w-10 place-items-center rounded border border-brass/40 bg-brass/15 text-brass">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-cream">
                          {logoFile ? logoFile.name : "Carica il logo"}
                        </div>
                        <div className="text-[10px] text-mist">PNG, JPG, SVG, WEBP · max 5MB</div>
                      </div>
                    </label>
                  </div>
                )}
              </section>

              {/* ─── V. SOCIAL ─────────────────────────── */}
              <section>
                <SectionHeader n="V" title="Social media" hint="opz." />
                <p className="mb-5 text-xs text-mist">
                  Quelli che hai. Finiscono nel footer del sito + danno credibilità.
                </p>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="label">Instagram</label>
                    <input name="socialInstagram" type="url" placeholder="https://instagram.com/..." className="input" />
                  </div>
                  <div>
                    <label className="label">Facebook</label>
                    <input name="socialFacebook" type="url" placeholder="https://facebook.com/..." className="input" />
                  </div>
                  <div>
                    <label className="label">LinkedIn</label>
                    <input name="socialLinkedin" type="url" placeholder="https://linkedin.com/..." className="input" />
                  </div>
                  <div>
                    <label className="label">TikTok</label>
                    <input name="socialTiktok" type="url" placeholder="https://tiktok.com/@..." className="input" />
                  </div>
                </div>
              </section>

              {/* ─── VI. BRIEF ────────────────────────── */}
              <section>
                <SectionHeader n="VI" title="Il tuo brand" />
                <div className="space-y-5">
                  <div>
                    <label className="label">Settore / nicchia *</label>
                    <input
                      name="sector"
                      type="text"
                      required
                      placeholder="es. Ristorante stellato, Studio dentistico, SaaS B2B..."
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Target / cliente ideale *</label>
                    <textarea
                      name="targetAudience"
                      required
                      rows={2}
                      placeholder="Chi è il tuo cliente tipo? Età, professione, esigenze..."
                      className="textarea"
                    />
                  </div>
                  <div>
                    <label className="label">USP — Cosa ti rende unico *</label>
                    <textarea
                      name="uniqueSellingProposition"
                      required
                      rows={2}
                      placeholder="Qual è il valore che offri e che la concorrenza non offre?"
                      className="textarea"
                    />
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="label">Tono di voce *</label>
                      <select name="toneOfVoice" required defaultValue="professional" className="input">
                        {TONE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value} className="bg-obsidian">{o.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">Colori preferiti (opz.)</label>
                      <input
                        name="preferredColors"
                        type="text"
                        placeholder="es. nero + oro, oppure HEX (#000, #d4af37)"
                        className="input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Note di contenuto (opz.)</label>
                    <textarea
                      name="contentNotes"
                      rows={3}
                      placeholder="Testimonianze, prezzi, FAQ specifiche..."
                      className="textarea"
                    />
                  </div>
                  <div>
                    <label className="label">Cosa NON vuoi nel sito (opz.)</label>
                    <textarea
                      name="avoidInCopy"
                      rows={2}
                      placeholder="es. evitare la parola &ldquo;low cost&rdquo;, non parlare di promozioni, niente toni aggressivi..."
                      className="textarea"
                    />
                    <p className="mt-2 text-xs text-mist">Aiutaci a non andare in direzioni sbagliate.</p>
                  </div>
                </div>
              </section>

              {/* ─── VII. IMMAGINI ────────────────────── */}
              <section>
                <SectionHeader n="VII" title="Le tue foto" hint={`${images.length}/30`} />
                <p className="mb-5 text-sm text-mist">
                  Solo le tue foto. Niente stock photography, niente archivio.
                  Max 30 file, 10MB l&apos;uno.
                </p>

                <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-bone/20 bg-coal/40 p-10 text-center transition-all hover:border-brass hover:bg-brass/5">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImagesSelected}
                    className="sr-only"
                  />
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-brass/30 bg-brass/10 text-brass">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="mt-4 font-display text-lg font-bold tracking-tighter text-cream">Clicca per caricare</p>
                  <p className="mt-1 text-xs text-mist">JPG, PNG, WebP — fino a 10MB ciascuna</p>
                </label>

                {images.length > 0 && (
                  <ul className="mt-4 max-h-56 space-y-2 overflow-y-auto rounded-xl border border-bone/10 bg-coal/40 p-3">
                    {images.map((f, i) => (
                      <li key={i} className="flex items-center justify-between rounded-lg bg-coal px-3 py-2 text-sm text-cream">
                        <span className="truncate font-mono text-xs">
                          {f.name} <span className="text-mist">({Math.round(f.size / 1024)}KB)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="ml-2 text-xs font-medium text-flame hover:underline"
                        >Rimuovi</button>
                      </li>
                    ))}
                  </ul>
                )}

                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-bone/10 bg-coal/40 p-4 hover:bg-coal hover:border-bone/20 transition-all">
                  <input
                    type="checkbox"
                    checked={forceAllImages}
                    onChange={(e) => setForceAllImages(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-brass"
                  />
                  <span className="flex-1 text-sm">
                    <strong className="block text-cream">Usa tutte le foto obbligatoriamente</strong>
                    <span className="text-xs text-mist">
                      Se disattivato, il nostro studio sceglie quali valorizzano meglio il layout.
                    </span>
                  </span>
                </label>
              </section>

              {/* CTA mobile-only */}
              <div className="md:hidden">
                <button type="submit" form={FORM_ID} className="btn-flame btn-lg w-full">
                  Continua ai pacchetti
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <header>
                <button
                  type="button"
                  onClick={goToStep1}
                  className="group mb-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-mist transition-colors hover:text-brass"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-0.5">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Modifica brief
                </button>
                <div>
                  <span className="chip-brass">Step 2 di 2</span>
                </div>
                <h1 className="display mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tightest text-cream md:text-5xl">
                  Scegli il <span className="serif-italic">pacchetto.</span>
                </h1>
                <p className="mt-5 max-w-xl text-pretty text-mist">
                  Pick il livello e aggiungi gli extra che ti servono.
                  Poi procedi al pagamento sicuro.
                </p>
              </header>

              {/* ─── I. PACCHETTO ─────────────────────── */}
              <section>
                <SectionHeader n="I" title="Pacchetto" />
                <div className="grid gap-3 md:grid-cols-3">
                  {TIERS.map((t) => {
                    const active = tier === t.key;
                    return (
                      <div
                        key={t.key}
                        className={cn(
                          "group relative rounded-2xl border transition-all",
                          active
                            ? "border-brass bg-brass/10 shadow-[0_0_30px_-10px_rgba(201,165,92,0.4)]"
                            : "border-bone/10 bg-coal/60 hover:border-bone/30 hover:bg-coal",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => setTier(t.key)}
                          className="block w-full p-5 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display text-lg font-bold tracking-tighter text-cream">{t.name}</span>
                            {active && (
                              <span className="grid h-6 w-6 place-items-center rounded-full bg-brass text-obsidian">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <div className="display mt-3 text-3xl font-bold tracking-tightest text-cream">{formatEur(t.priceEur)}</div>
                          <div className="mt-2 text-xs leading-relaxed text-mist">{t.description}</div>
                        </button>
                        <div className="border-t border-bone/5 px-5 py-3">
                          <button
                            type="button"
                            onClick={() => setShowcaseTier(t.key)}
                            className="group/btn flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-widest text-mist transition-colors hover:text-brass"
                          >
                            <span>Vedi esempi</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/btn:translate-x-0.5">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ─── Personalizzazione Signature ─── */}
                {tier === "business" && (
                  <div className="mt-6 space-y-5 rounded-2xl border border-brass/30 bg-brass/5 p-6">
                    <header className="flex items-baseline gap-3">
                      <span className="font-display text-xl italic text-brass">✦</span>
                      <h3 className="display text-lg font-bold tracking-tighter text-cream">
                        Personalizzazione Signature
                      </h3>
                    </header>

                    <p className="text-xs leading-relaxed text-mist">
                      Per il video di apertura puoi guidarci in <strong className="text-bone">uno dei due modi</strong>.
                      Scegli quello che preferisci — gli altri restano disattivati.
                    </p>

                    {/* Selettore modalità */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setSignatureMode("text")}
                        className={cn(
                          "group rounded-xl border-2 p-4 text-left transition-all",
                          signatureMode === "text"
                            ? "border-brass bg-brass/15 shadow-[0_0_20px_-8px_rgba(201,165,92,0.5)]"
                            : "border-bone/10 bg-coal/40 hover:border-bone/30 hover:bg-coal",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display text-sm font-bold tracking-tighter text-cream">
                            Descrivilo a parole
                          </span>
                          {signatureMode === "text" && (
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-brass text-obsidian">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-mist">
                          Ci dici l&apos;atmosfera del locale, noi ricostruiamo la scena.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSignatureMode("image")}
                        className={cn(
                          "group rounded-xl border-2 p-4 text-left transition-all",
                          signatureMode === "image"
                            ? "border-brass bg-brass/15 shadow-[0_0_20px_-8px_rgba(201,165,92,0.5)]"
                            : "border-bone/10 bg-coal/40 hover:border-bone/30 hover:bg-coal",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display text-sm font-bold tracking-tighter text-cream">
                            Inviaci le foto
                          </span>
                          {signatureMode === "image" && (
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-brass text-obsidian">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-mist">
                          2 foto in HD del tuo ingresso, riproduzione fedele.
                        </p>
                      </button>
                    </div>

                    {/* Area attiva — Testo */}
                    {signatureMode === "text" && (
                      <div className="pt-2">
                        <label className="label !text-brass">
                          Atmosfera del video di apertura
                        </label>
                        <textarea
                          name="videoScript"
                          rows={3}
                          value={videoScript}
                          onChange={(e) => setVideoScript(e.target.value)}
                          placeholder="Descrivi com'è fatto il tuo locale: l'ingresso, gli ambienti, l'atmosfera dei primi secondi (es. 'porta vintage in legno, luci calde, parquet, tavoli apparecchiati...')."
                          className="textarea"
                        />
                      </div>
                    )}

                    {/* Area attiva — Immagini */}
                    {signatureMode === "image" && (
                      <div className="pt-2">
                        <label className="label !text-brass">
                          Immagini d&apos;ingresso in HD
                        </label>
                        <p className="mb-4 text-xs text-mist">
                          Servono <strong className="text-bone">due foto</strong>: una verticale per mobile,
                          una orizzontale per desktop. In entrambe la porta deve essere{" "}
                          <strong className="text-bone">perfettamente centrata</strong>.
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <EntranceSlot
                            format="mobile"
                            label="Mobile (verticale)"
                            aspect="9:16"
                            file={entranceMobile}
                            meta={entranceMobileMeta}
                            error={entranceMobileError}
                            onSelect={(e) => onEntranceSelected(e, "mobile")}
                            onRemove={() => removeEntrance("mobile")}
                          />
                          <EntranceSlot
                            format="desktop"
                            label="Desktop (orizzontale)"
                            aspect="16:9"
                            file={entranceDesktop}
                            meta={entranceDesktopMeta}
                            error={entranceDesktopError}
                            onSelect={(e) => onEntranceSelected(e, "desktop")}
                            onRemove={() => removeEntrance("desktop")}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* ─── II. ADDONS ───────────────────────── */}
              <section>
                <SectionHeader n="II" title="Add-on (opzionali)" hint={`${addons.length} selezionati`} />
                <div className="grid gap-3 md:grid-cols-2">
                  {ADDONS.map((a) => {
                    const active = addons.includes(a.key);
                    return (
                      <button
                        type="button"
                        key={a.key}
                        onClick={() => toggleAddon(a.key)}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                          active
                            ? "border-brass bg-brass/10"
                            : "border-bone/10 bg-coal/60 hover:border-bone/30 hover:bg-coal",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border",
                            active ? "border-brass bg-brass text-obsidian" : "border-bone/30",
                          )}
                        >
                          {active && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span className="flex-1">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className="font-semibold text-sm text-cream">{a.name}</span>
                            <span className="shrink-0 font-mono text-xs font-medium text-brass">+{formatEur(a.priceEur)}</span>
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-mist">{a.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {error && (
            <div className="rounded-2xl border-2 border-flame bg-flame/10 p-4 text-sm font-medium text-flame-200">
              {error}
            </div>
          )}
        </form>

        {/* ─── SIDEBAR ─────────────────────────────── */}
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="relative overflow-hidden rounded-2xl border border-brass/20 bg-coal p-8 shadow-[0_20px_60px_-20px_rgba(201,165,92,0.3)]">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-brass/15 blur-3xl" />
            <div className="relative">
              {step === 1 ? (
                <>
                  <h3 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brass">
                    Step 1 di 2
                  </h3>
                  <div className="hairline my-5" />
                  <p className="display text-2xl font-bold leading-tight tracking-tighter text-cream">
                    Stai compilando il <span className="serif-italic">brief</span>.
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-mist">
                    Cinque minuti per dirci chi sei. Poi scegli il pacchetto
                    e procedi al pagamento.
                  </p>

                  <div className="hairline my-7" />

                  <button
                    type="submit"
                    form={FORM_ID}
                    className="btn-flame btn-lg hidden w-full md:inline-flex"
                  >
                    Continua ai pacchetti
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>

                  <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-smoke">
                    Dopo: pacchetto + pagamento sicuro
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brass">
                    Riepilogo
                  </h3>

                  <div className="hairline my-5" />

                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-bone">Pacchetto {TIERS.find((t) => t.key === tier)?.name}</span>
                      <span className="font-mono text-sm text-cream">
                        {formatEur(TIERS.find((t) => t.key === tier)?.priceEur ?? 0)}
                      </span>
                    </div>
                    {addons.length === 0 && (
                      <p className="text-xs italic text-smoke">Nessun add-on selezionato</p>
                    )}
                    {addons.map((k) => {
                      const addon = ADDONS.find((a) => a.key === k);
                      return addon ? (
                        <div key={k} className="flex items-baseline justify-between">
                          <span className="text-xs text-mist">+ {addon.name}</span>
                          <span className="font-mono text-xs text-bone">{formatEur(addon.priceEur)}</span>
                        </div>
                      ) : null;
                    })}
                  </div>

                  <div className="hairline my-5" />

                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-mist">Totale</span>
                    <span className="display text-4xl font-bold tracking-tightest text-cream">{formatEur(total)}</span>
                  </div>
                  <p className="mt-1 text-right text-[10px] uppercase tracking-widest text-smoke">IVA esclusa</p>

                  <label className="mt-7 mb-5 flex items-start gap-3 text-xs text-mist cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-brass"
                    />
                    <span>Accetto i <a href="/termini" target="_blank" className="text-brass hover:underline">termini di servizio</a> e le <a href="/legal" target="_blank" className="text-brass hover:underline">note legali</a> *</span>
                  </label>

                  <button
                    type="submit"
                    form={FORM_ID}
                    disabled={submitting || !acceptedTerms}
                    className="btn-flame btn-lg w-full disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Invio in corso..." : "Procedi al pagamento"}
                  </button>

                  <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-smoke">
                    Pagamento sicuro · Stripe
                  </p>
                </>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-mist">
            Hai dubbi? <a href="mailto:info@poweragency.it" className="text-brass hover:underline">Scrivici</a>
          </p>
        </aside>
      </div>
    </div>
  );
}
