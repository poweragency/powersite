"use client";

import { useEffect } from "react";

/**
 * Pulisce la chiave localStorage del brief draft (`pa-order-draft-v1`)
 * quando l'utente raggiunge la pagina /grazie. Significa: l'ordine è
 * stato accettato a buon fine, il brief locale non serve più. Senza
 * questa pulizia, la prossima volta che apri /ordina vedresti tutto
 * pre-compilato col vecchio brief.
 */
const DRAFT_KEY = "pa-order-draft-v1";

export function DraftCleanup() {
  useEffect(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // localStorage può fallire (quota, modalità privata): non bloccante
    }
  }, []);
  return null;
}
