// Estado del consentimiento de cookies. Sin dependencias del DOM para poder probarlo con Vitest.

// Subir la versión obliga a pedir el consentimiento de nuevo (p. ej. si cambia la política de cookies).
export const CONSENT_VERSION = 1;
export const CONSENT_KEY = 'cc_consent';
// La preferencia se vuelve a pedir pasados 12 meses.
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
export const CONSENT_EVENT = 'consent:change';

export interface Consent {
  v: number;
  necessary: true;
  analytics: boolean;
  ts: string;
}

type ReadableStorage = Pick<Storage, 'getItem'>;
type WritableStorage = Pick<Storage, 'setItem' | 'removeItem'>;

export function makeConsent(analytics: boolean, now: Date = new Date()): Consent {
  return { v: CONSENT_VERSION, necessary: true, analytics, ts: now.toISOString() };
}

export function parseConsent(raw: string | null, now: Date = new Date()): Consent | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== 'object' || data === null) return null;
    const { v, analytics, ts } = data as Record<string, unknown>;
    if (v !== CONSENT_VERSION || typeof analytics !== 'boolean' || typeof ts !== 'string') return null;
    const saved = Date.parse(ts);
    if (Number.isNaN(saved) || now.getTime() - saved > CONSENT_MAX_AGE_MS) return null;
    return { v, necessary: true, analytics, ts };
  } catch {
    return null;
  }
}

export function readConsent(storage: ReadableStorage | undefined, now?: Date): Consent | null {
  try {
    return parseConsent(storage?.getItem(CONSENT_KEY) ?? null, now);
  } catch {
    // Almacenamiento bloqueado (modo privado, políticas del navegador): se trata como sin decisión.
    return null;
  }
}

export function writeConsent(storage: WritableStorage | undefined, consent: Consent): boolean {
  try {
    storage?.setItem(CONSENT_KEY, JSON.stringify(consent));
    return true;
  } catch {
    return false;
  }
}

export function clearConsent(storage: WritableStorage | undefined): void {
  try {
    storage?.removeItem(CONSENT_KEY);
  } catch {
    /* sin almacenamiento disponible */
  }
}

// Nombres de las cookies que crea Google Analytics 4.
export function isAnalyticsCookie(name: string): boolean {
  return name === '_ga' || name.startsWith('_ga_') || name === '_gid' || name === '_gat';
}
