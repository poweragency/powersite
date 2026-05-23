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
- **business/** — hero con video AI di apertura, design cinematografico

## Schema `content.json`

Vedi [`lib/orchestrator/steps/generate-content.ts`](../lib/orchestrator/steps/generate-content.ts) per la definizione TypeScript di `GeneratedContent`.

## Come pubblicarli come "template repo" GitHub

Una volta sviluppato un template:

1. `cd templates/standard`
2. Push come repo dedicata (es. `power-agency/template-standard`)
3. Su GitHub → Settings → ✅ "Template repository"
4. Impostare la variabile `GITHUB_TEMPLATE_REPO_STANDARD` nel `.env` del SaaS

La pipeline userà l'API GitHub `POST /repos/{template_owner}/{template_repo}/generate` per creare le repo cliente da questo template (anziché clonare manualmente).
