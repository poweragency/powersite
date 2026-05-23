/**
 * Schema JSON dell'output strutturato. Deve essere strettamente compatibile
 * col `Content` interface di templates/standard/lib/content-schema.ts:
 * la pipeline serializza questo oggetto direttamente in `content.json`.
 *
 * Lo schema viene esposto a Claude come `input_schema` di un tool con
 * `strict: true`, così il modello è obbligato a rispettarlo.
 */

import type Anthropic from "@anthropic-ai/sdk";

export const RENDER_LANDING_TOOL_NAME = "render_landing_content";

const ctaSchema = {
  type: "object",
  additionalProperties: false,
  required: ["label", "href"],
  properties: {
    label: { type: "string", minLength: 2, maxLength: 60 },
    href: { type: "string", minLength: 1, maxLength: 200 },
  },
} as const;

const sectionHero = {
  type: "object",
  additionalProperties: false,
  required: ["type", "headline", "ctaPrimary"],
  properties: {
    type: { type: "string", enum: ["hero"] },
    headline: { type: "string", minLength: 8, maxLength: 120 },
    subheadline: { type: "string", maxLength: 240 },
    ctaPrimary: ctaSchema,
    ctaSecondary: ctaSchema,
    image: { type: "string", description: "Path immagine in /public/uploads/" },
  },
} as const;

const sectionValue = {
  type: "object",
  additionalProperties: false,
  required: ["type", "title", "items"],
  properties: {
    type: { type: "string", enum: ["value"] },
    title: { type: "string", minLength: 4, maxLength: 80 },
    items: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "body"],
        properties: {
          title: { type: "string", minLength: 4, maxLength: 60 },
          body: { type: "string", minLength: 20, maxLength: 240 },
        },
      },
    },
  },
} as const;

const sectionFeatures = {
  type: "object",
  additionalProperties: false,
  required: ["type", "title", "items"],
  properties: {
    type: { type: "string", enum: ["features"] },
    title: { type: "string", minLength: 4, maxLength: 80 },
    items: {
      type: "array",
      minItems: 3,
      maxItems: 9,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "body"],
        properties: {
          title: { type: "string", minLength: 4, maxLength: 60 },
          body: { type: "string", minLength: 20, maxLength: 200 },
          icon: { type: "string", maxLength: 6, description: "Singolo emoji" },
        },
      },
    },
  },
} as const;

const sectionSocialProof = {
  type: "object",
  additionalProperties: false,
  required: ["type", "title", "testimonials"],
  properties: {
    type: { type: "string", enum: ["social-proof"] },
    title: { type: "string", minLength: 4, maxLength: 80 },
    testimonials: {
      type: "array",
      minItems: 2,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "quote"],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 60 },
          quote: { type: "string", minLength: 20, maxLength: 280 },
          rating: { type: "integer", minimum: 4, maximum: 5 },
          image: { type: "string" },
        },
      },
    },
  },
} as const;

const sectionCta = {
  type: "object",
  additionalProperties: false,
  required: ["type", "title", "ctaPrimary"],
  properties: {
    type: { type: "string", enum: ["cta"] },
    title: { type: "string", minLength: 8, maxLength: 100 },
    body: { type: "string", maxLength: 240 },
    ctaPrimary: ctaSchema,
  },
} as const;

const sectionFaq = {
  type: "object",
  additionalProperties: false,
  required: ["type", "title", "items"],
  properties: {
    type: { type: "string", enum: ["faq"] },
    title: { type: "string", minLength: 4, maxLength: 80 },
    items: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["q", "a"],
        properties: {
          q: { type: "string", minLength: 10, maxLength: 160 },
          a: { type: "string", minLength: 20, maxLength: 400 },
        },
      },
    },
  },
} as const;

const sectionContact = {
  type: "object",
  additionalProperties: false,
  required: ["type", "title"],
  properties: {
    type: { type: "string", enum: ["contact"] },
    title: { type: "string", minLength: 4, maxLength: 60 },
    address: { type: "string", maxLength: 160 },
    phone: { type: "string", maxLength: 40 },
    email: { type: "string", maxLength: 120 },
  },
} as const;

export const CONTENT_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["meta", "brand", "sections", "images"],
  properties: {
    meta: {
      type: "object",
      additionalProperties: false,
      required: ["title", "description", "ogTitle", "ogDescription"],
      properties: {
        title: { type: "string", minLength: 10, maxLength: 70 },
        description: { type: "string", minLength: 50, maxLength: 160 },
        ogTitle: { type: "string", minLength: 10, maxLength: 70 },
        ogDescription: { type: "string", minLength: 30, maxLength: 200 },
      },
    },
    brand: {
      type: "object",
      additionalProperties: false,
      required: ["name", "tone", "palette"],
      properties: {
        name: { type: "string", minLength: 2, maxLength: 60 },
        tone: {
          type: "string",
          enum: ["professional", "friendly", "luxury", "energetic", "minimal"],
        },
        palette: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: {
            type: "string",
            pattern: "^#[0-9A-Fa-f]{6}$",
            description: "HEX color con 6 cifre",
          },
        },
      },
    },
    sections: {
      type: "array",
      minItems: 4,
      maxItems: 9,
      items: {
        anyOf: [
          sectionHero,
          sectionValue,
          sectionFeatures,
          sectionSocialProof,
          sectionCta,
          sectionFaq,
          sectionContact,
        ],
      },
    },
    images: {
      type: "object",
      additionalProperties: false,
      required: ["forceAll", "selected", "unused"],
      properties: {
        forceAll: { type: "boolean" },
        selected: {
          type: "array",
          items: { type: "string" },
          description: "Path delle immagini effettivamente usate, in ordine",
        },
        unused: {
          type: "array",
          items: { type: "string" },
          description: "Path scartati (vuoto se forceAll=true)",
        },
      },
    },
  },
} as const;

export const renderLandingTool: Anthropic.Tool = {
  name: RENDER_LANDING_TOOL_NAME,
  description:
    "Restituisce il contenuto strutturato della landing page conforme al template scelto. " +
    "DEVI chiamare questo tool una sola volta con tutti i campi compilati.",
  input_schema: CONTENT_JSON_SCHEMA as unknown as Anthropic.Tool["input_schema"],
};
