# PowerLanding (`powersite`)

SaaS che **vende e genera landing page con AI**: il cliente compila il brief e paga su `/ordina`, una pipeline crea i contenuti con Claude, costruisce un progetto Next.js da template, lo pubblica come **repo GitHub dedicata + deploy Vercel**, e registra il lead nel CRM Power Hub.

> Naming: cartella `POWERLANDING`, package `power-agency-landing-saas`, repo GitHub `poweragency/powersite`. Il nome commerciale è **PowerLanding**.

## Tier e addon

I tier, gli addon e i prezzi vivono in **`lib/catalog.ts` (SSOT)** — non duplicarli altrove.

**Modello commerciale: "crea il sito gratis, paghi solo se ti piace".** Niente upfront del sito: il prezzo del tier è un **canone mensile** (dominio + hosting + mantenimento inclusi). Gli addon si sommano al canone, tranne il **logo** (una-tantum) e il **gestionale su misura** (su preventivo, nessun prezzo).

- **standard** — landing 5 sezioni, mobile-first · **29,97 €/mese** (barrato 44,97).
- **premium** — multi-pagina, animazioni Framer Motion, hero cinematografico · **49,97 €/mese** (barrato 74,97).
- **business ("Signature")** — tutto Premium + **video AI di apertura** + SEO/GEO/GAIO inclusi · **69,97 €/mese** (barrato 109,97). ⚠️ Il tier business **riusa il template `premium/`** (`build-project.ts`): il differenziatore è il video, prodotto **manualmente** dal team (la pipeline prepara `_signature-video/` nella repo cliente e tagga il lead CRM `video-signature:da-girare-*`).

Addon in `lib/catalog.ts` con campo `billing` (`"monthly"` default | `"oneoff"`) e flag `quoteOnly`:
- **mensili**: SEO/GEO/GAIO (1,50 €), analytics (2 €), chatbot (5 €), newsletter/email funnel (3 €), booking & e-commerce (5 €), **Modulo contatti** (4 €) — SEO/GEO/GAIO sono inclusi nel Signature (`isAddonIncludedInTier()`, non ri-addebitati);
- **una-tantum**: **logo design** (147 €);
- **su preventivo** (`quoteOnly`): **Gestionale su misura** — solo una spunta, nessun addebito; genera lead nel CRM e un tecnico ricontatta.

Stripe: i Price di tier e addon mensili devono essere **ricorrenti mensili**, il logo **one-time**; non c'è più una subscription "Mantenimento" separata (`scripts/setup-mantenimento.ts` è deprecato). Calcoli: `calculateMonthlyTotal()` / `calculateMonthlyOriginalTotal()` (canone) e `calculateOneoffTotal()` (una-tantum).

## Pipeline (7 step — `lib/orchestrator/pipeline.ts`)

1. `generateLandingContent()` — Claude genera il content strutturato (modelli separati: `ANTHROPIC_MODEL_COPY` / `ANTHROPIC_MODEL_LAYOUT`, prompt cacheato per tier)
2. `buildProject()` — copia il template del tier, scrive `content.json`, scarica le immagini da Vercel Blob (Signature: prepara `_signature-video/`)
3. `createGithubRepo()` — crea la repo cliente `client-{slug}-{nonce}` via **Git Trees API** (niente shell git, serverless-safe)
4. `deployToVercel()` — crea il progetto Vercel collegato alla repo (auto-deploy a ogni push) e lancia il primo build
5. `insertCrmLead()` — UPSERT del lead nel Supabase di **Power Hub** (tabella `powersites_leads`), idempotente su nonce, non bloccante
6. `sendPreviewEmail()` — email anteprima (no-op senza `RESEND_API_KEY`)
7. `cleanupOrderBlobs()` — pulizia dei blob temporanei

## API route

| Route | Ruolo |
|---|---|
| `POST /api/orders` | intake form: brief + upload (immagini ≤30×10MB, logo, PDF, video ingresso), manifest su Vercel Blob, crea Stripe Checkout (o, con `BYPASS_STRIPE=true`, lancia direttamente la pipeline) |
| `POST /api/stripe/webhook` | `checkout.session.completed` → verifica firma → pipeline (idempotente su event.id) |
| `POST /api/orchestrate` | pipeline async interna, auth `Bearer ORCHESTRATE_SECRET` (fallback `CRON_SECRET`), idempotente su nonce |
| `GET /api/cron/cleanup-orphans` | cron Vercel 03:00 UTC: blob orfani >24h + marker >7gg, auth `Bearer CRON_SECRET` |
| `POST /api/stripe/checkout` | **deprecata** (410 Gone) — il checkout è inline in `/api/orders` |

## Comandi

```bash
npm run dev                  # Next.js 15 + Turbopack (porta 3002 in dev)
npm run build / typecheck / lint
npm run test:gen             # pipeline AI + build locale senza GitHub/Vercel (npx tsx scripts/test-generation.ts standard "Studio Bianchi")
npm run test:addons          # confronto content con/senza addon
npm run test:tiers           # confronto Standard vs Premium su stesso brief
npm run setup:mantenimento   # DEPRECATO (canone mensile include il mantenimento)
```

## Env (vedi `.env.example`)

- **Anthropic:** `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL_COPY`, `ANTHROPIC_MODEL_LAYOUT`
- **Stripe:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_{STANDARD,PREMIUM,BUSINESS}` (ricorrenti mensili), `STRIPE_PRICE_ADDON_*` (mensili; `LOGO_DESIGN` one-time; `CONTACT_FORM_BESPOKE` e `STRIPE_PRICE_MAINTENANCE` non più usati)
- **GitHub:** `GITHUB_TOKEN` (fine-grained: Administration+Contents write), `GITHUB_OWNER_TYPE`, `GITHUB_OWNER`
- **Vercel:** `VERCEL_TOKEN`, `VERCEL_TEAM_ID`, `VERCEL_PROJECT_DOMAIN_BASE`, `BLOB_READ_WRITE_TOKEN`
- **CRM (Supabase Power Hub):** `POWERHUB_SUPABASE_URL`, `POWERHUB_SUPABASE_SERVICE_ROLE_KEY` (server-only), `POWERHUB_ANON_KEY` (iniettata nei progetti cliente per il form contatti)
- **Pipeline:** `CRON_SECRET`, `ORCHESTRATE_SECRET`, `BYPASS_STRIPE` (solo test), `NEXT_PUBLIC_APP_URL`, `HEYGEN_API_KEY` (riservata al flusso video, oggi manuale)

## Note operative / gap noti

- **Il SaaS non ha un suo database**: scrive direttamente nel Supabase di Power Hub. Modifiche allo schema `powersites_leads` vanno coordinate con quel progetto.
- Template business separato: non esiste (riusa premium) — vedere `templates/README.md`.
- Email anteprima: stub finché `RESEND_API_KEY` non è configurata.
- Video Signature: produzione manuale fuori dalla pipeline.

Ultimo sviluppo: 28/05/2026 (alias deploy) + note legali 08/06/2026.
