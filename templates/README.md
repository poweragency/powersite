# Templates Power Agency

Ogni sottocartella è un **template Next.js standalone** che viene clonato per ogni cliente, riempito con il `content.json` generato dall'AI e deployato come repo separata.

## Struttura attesa di ciascun template

```
templates/{tier}/
├── package.json          # progetto Next.js indipendente
├── next.config.ts
├── tailwind.config.ts
├── content.json          # placeholder, sovrascritto dalla pipeline
├── public/
│   └── uploads/          # immagini cliente (popolate dalla pipeline)
├── app/
│   ├── layout.tsx
│   ├── globals.css       # variabili palette sostituite a build-time
│   └── page.tsx          # legge content.json e renderizza le sezioni
└── components/           # blocchi: <Hero>, <Features>, <Cta>, ...
```

## Tier

- **standard/** — landing 5 sezioni, design pulito, mobile-first
- **premium/** — animazioni Framer Motion, A/B varianti, multilingua
- **business ("Signature")** — ⚠️ NON ha una cartella propria: **riusa `premium/`** (mapping in `lib/orchestrator/steps/build-project.ts`). Il differenziatore del tier è il video AI di apertura, prodotto manualmente dal team (la pipeline prepara `_signature-video/` nella repo cliente). Creare `business/` solo se/quando si deciderà un design dedicato.

## Schema `content.json`

Vedi [`lib/orchestrator/steps/generate-content.ts`](../lib/orchestrator/steps/generate-content.ts) per la definizione TypeScript di `GeneratedContent`.

## Come la pipeline usa i template (stato reale)

La pipeline **copia la cartella locale del template** e crea la repo cliente via **Git Trees API** (`lib/orchestrator/steps/create-github-repo.ts`) — serverless-safe, niente shell git.

> Nota storica: una versione precedente di questo doc descriveva un meccanismo a "template repository GitHub" (`POST /repos/{owner}/{template}/generate` + env `GITHUB_TEMPLATE_REPO_*`). **Non è mai stato implementato**: quelle env non esistono in `.env.example` e la pipeline non le legge. Se in futuro si vorrà quel meccanismo, va costruito — oggi la fonte dei template è questa cartella.
