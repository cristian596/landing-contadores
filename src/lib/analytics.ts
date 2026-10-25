// Carga de Google Analytics 4 condicionada al consentimiento. Nada de Google se pide antes de que el
// visitante acepte la categoría de analítica.
import { isAnalyticsCookie } from './consent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID_PATTERN = /^G-[A-Z0-9]{4,}$/;

export function isValidGaId(id: string | undefined): id is string {
  return typeof id === 'string' && GA_ID_PATTERN.test(id);
}

export function loadAnalytics(id: string | undefined): boolean {
  if (!isValidGaId(id)) return false;
  if (document.querySelector('script[data-ga4]')) return true;

  window.dataLayer = window.dataLayer || [];
  // gtag necesita recibir el objeto `arguments`, no un arreglo.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('config', id);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  script.dataset.ga4 = '';
  document.head.append(script);
  document.documentElement.dataset.analytics = 'loaded';
  return true;
}

// Borra las cookies de GA en el dominio actual y en sus dominios padre (GA las escribe en el de nivel superior).
export function removeAnalyticsCookies(): void {
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0]?.trim() ?? '')
    .filter(isAnalyticsCookie);
  const parts = location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; domain=.${parts.slice(i).join('.')}`);
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

export function disableAnalytics(id: string | undefined): void {
  if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
  if (isValidGaId(id)) (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = true;
  removeAnalyticsCookies();
}
