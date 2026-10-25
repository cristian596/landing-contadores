import { describe, expect, it } from 'vitest';
import {
  CONSENT_KEY,
  CONSENT_MAX_AGE_MS,
  CONSENT_VERSION,
  isAnalyticsCookie,
  makeConsent,
  parseConsent,
  readConsent,
  writeConsent,
} from '../../src/lib/consent';
import { isValidGaId } from '../../src/lib/analytics';

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

describe('consentimiento de cookies', () => {
  it('sin decisión guardada devuelve null (se debe mostrar el banner)', () => {
    expect(readConsent(memoryStorage())).toBeNull();
  });

  it('guarda y lee la decisión', () => {
    const storage = memoryStorage();
    writeConsent(storage, makeConsent(true));
    expect(readConsent(storage)?.analytics).toBe(true);
    writeConsent(storage, makeConsent(false));
    expect(readConsent(storage)?.analytics).toBe(false);
  });

  it('las necesarias siempre quedan activas', () => {
    expect(makeConsent(false).necessary).toBe(true);
  });

  it('descarta datos corruptos o con otra versión', () => {
    expect(parseConsent('no es json')).toBeNull();
    expect(
      parseConsent(JSON.stringify({ v: CONSENT_VERSION + 1, analytics: true, ts: new Date().toISOString() })),
    ).toBeNull();
    expect(
      parseConsent(JSON.stringify({ v: CONSENT_VERSION, analytics: 'sí', ts: new Date().toISOString() })),
    ).toBeNull();
  });

  it('vuelve a preguntar pasados 12 meses', () => {
    const old = makeConsent(true, new Date(Date.now() - CONSENT_MAX_AGE_MS - 1000));
    expect(parseConsent(JSON.stringify(old))).toBeNull();
  });

  it('tolera un almacenamiento bloqueado', () => {
    const blocked = {
      getItem: () => {
        throw new Error('bloqueado');
      },
    };
    expect(readConsent(blocked)).toBeNull();
    expect(
      writeConsent(
        {
          setItem: () => {
            throw new Error('bloqueado');
          },
          removeItem: () => undefined,
        },
        makeConsent(true),
      ),
    ).toBe(false);
  });

  it('reconoce las cookies de Google Analytics', () => {
    expect(isAnalyticsCookie('_ga')).toBe(true);
    expect(isAnalyticsCookie('_ga_ABC123')).toBe(true);
    expect(isAnalyticsCookie(CONSENT_KEY)).toBe(false);
  });

  it('valida el formato del ID de GA4', () => {
    expect(isValidGaId('G-XXXXXXX')).toBe(true);
    expect(isValidGaId('UA-123')).toBe(false);
    expect(isValidGaId('')).toBe(false);
    expect(isValidGaId(undefined)).toBe(false);
  });
});
