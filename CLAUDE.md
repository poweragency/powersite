# CLAUDE.md — PowerLanding (`powersite`)

Guida per agenti AI. Lingua: italiano per UI/commit, inglese per identificatori. Leggi prima il [README](README.md): pipeline, route, env e gap noti sono lì.

## Punti fermi (non violarli)

- **`lib/catalog.ts` è la SSOT** di tier, addon e prezzi. Mai duplicare prezzi in pagine/email/doc: si legge dal catalogo.
- **Il tier business ("Signature") riusa il template `premium/`** (`lib/orchestrator/steps/build-project.ts`): il differenziatore è il video, prodotto manualmente. Non creare una cartella `templates/business/` senza decisione esplicita.
- **Il CRM è il Supabase di Power Hub** (`POWERHUB_SUPABASE_URL`, tabella `powersites_leads`): nessuna modifica allo schema senza coordinarsi con quel progetto. La `service_role` key resta server-side.
- **Idempotenza ovunque**: webhook Stripe (marker su event.id), `/api/orchestrate` (nonce), `insertCrmLead` (UPSERT su nonce). Ogni nuovo step della pipeline deve essere ri-eseguibile senza effetti doppi.
- **Repo cliente via Git Trees API** (`create-github-repo.ts`), niente shell git: il runtime è serverless.
- **Modello "anteprima gratuita"**: `/api/orders` NON crea più checkout Stripe — lancia sempre la pipeline e reindirizza a `/grazie`. Nessun pagamento all'invio. Il canone mensile (catalogo) è solo informativo; l'addebito vero (se il cliente tiene il sito) si gestisce fuori da questo flusso. `lib/stripe.ts` + webhook restano dormienti per un futuro step "paga per tenere".

## Comandi

```bash
npm run dev / build / typecheck / lint
npm run test:gen | test:addons | test:tiers     # pipeline AI senza GitHub/Vercel
npm run setup:mantenimento                       # setup prodotto Stripe ricorrente
```

La verifica standard prima di chiudere un blocco: `npm run typecheck && npm run build`.

## Gotcha

- Generazione contenuti: due modelli separati (`ANTHROPIC_MODEL_COPY`/`ANTHROPIC_MODEL_LAYOUT`) con prompt cacheato per tier — se tocchi i prompt, attento a non rompere il caching.
- `/api/stripe/checkout` è deprecata (410). Nessun checkout nel flusso: `/api/orders` genera l'anteprima gratis (vedi Punti fermi).
- Cron `cleanup-orphans` (vercel.json, 03:00 UTC): se aggiungi upload nuovi su Vercel Blob, mettili sotto `pending/{nonce}/` così il cleanup li copre.
