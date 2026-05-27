"use client";

import { useEffect } from "react";

/**
 * Tracking analytics COOKIE-COMPLIANT (addon "analytics").
 *
 * Carica gli script di tracking (Google Analytics 4, Meta/Facebook Pixel)
 * SOLO dopo che il visitatore ha cliccato "Accetta tutti" nel cookie banner.
 * Finché il consenso non è "all", NESSUN cookie di tracking viene scritto →
 * GDPR-compliant per default.
 *
 * Gating:
 *   - NEXT_PUBLIC_ANALYTICS === "true"  (iniettata se l'addon è attivo)
 *   - almeno uno tra NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_META_PIXEL_ID
 *     (settati MANUALMENTE da Power Agency per il singolo cliente, perché
 *      ogni cliente ha la propria proprietà GA4 / pixel).
 *
 * Il consenso arriva dal CookieBanner:
 *   - localStorage "site-cookie-consent" = { choice: "all" | "necessary" }
 *   - evento window "cookie-consent" con detail.choice
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    __trackersLoaded?: boolean;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const META_PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function loadTrackers() {
  if (typeof window === "undefined" || window.__trackersLoaded) return;
  window.__trackersLoaded = true;

  // Google Analytics 4
  if (GA_ID) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
  }

  // Meta (Facebook/Instagram) Pixel
  if (META_PIXEL) {
    const w = window as Window & { fbq?: any; _fbq?: any };
    if (!w.fbq) {
      const n: any = function (...args: unknown[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      };
      n.queue = [];
      n.loaded = true;
      n.version = "2.0";
      w.fbq = n;
      w._fbq = n;
      const t = document.createElement("script");
      t.async = true;
      t.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(t);
    }
    w.fbq("init", META_PIXEL);
    w.fbq("track", "PageView");
  }
}

export function Analytics() {
  const enabled = process.env.NEXT_PUBLIC_ANALYTICS === "true" && Boolean(GA_ID || META_PIXEL);

  useEffect(() => {
    if (!enabled) return;
    // Consenso già dato in una sessione precedente?
    try {
      const saved = window.localStorage.getItem("site-cookie-consent");
      if (saved && JSON.parse(saved).choice === "all") loadTrackers();
    } catch {
      /* ignore */
    }
    // Consenso dato ora dal banner.
    const onConsent = (e: Event) => {
      const choice = (e as CustomEvent<{ choice: string }>).detail?.choice;
      if (choice === "all") loadTrackers();
    };
    window.addEventListener("cookie-consent", onConsent);
    return () => window.removeEventListener("cookie-consent", onConsent);
  }, [enabled]);

  return null;
}
