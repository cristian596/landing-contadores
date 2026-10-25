// Validación del formulario de contacto. Se usa en el navegador; el servicio externo que recibe el
// envío debe repetir la validación (nunca confiar solo en el cliente).

export const LIMITS = {
  name: 120,
  email: 254,
  phone: 30,
  message: 2000,
} as const;

export const SERVICE_OPTIONS = [
  'Contabilidad general',
  'Asesoría tributaria',
  'Nómina',
  'Declaraciones',
  'Consultoría financiera',
  'Aún no lo sé',
] as const;

export interface ContactInput {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  consent: boolean;
  website?: string; // honeypot: los humanos no lo ven ni lo llenan
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Admite extensión de oficina: «+57 (601) 745 8899 ext. 123».
const PHONE = /^\+?[\d\s().-]{7,}(\s*(ext\.?|x)\s*\d{1,6})?$/i;

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const message = input.message.trim();

  if (name.length < 2) errors.name = 'Escribe tu nombre.';
  else if (name.length > LIMITS.name) errors.name = `Máximo ${LIMITS.name} caracteres.`;

  if (!email) errors.email = 'Escribe tu correo.';
  else if (email.length > LIMITS.email || !EMAIL.test(email)) errors.email = 'Revisa el formato del correo.';

  if (phone && (phone.length > LIMITS.phone || !PHONE.test(phone)))
    errors.phone = 'Usa números, espacios, el signo + y, si aplica, «ext.» con la extensión.';

  if (!(SERVICE_OPTIONS as readonly string[]).includes(input.service)) errors.service = 'Elige un servicio.';

  if (message.length < 10) errors.message = 'Cuéntanos un poco más (mínimo 10 caracteres).';
  else if (message.length > LIMITS.message) errors.message = `Máximo ${LIMITS.message} caracteres.`;

  if (!input.consent) errors.consent = 'Debes aceptar el tratamiento de tus datos para enviar el formulario.';

  return errors;
}

export function isSpam(input: Pick<ContactInput, 'website'>): boolean {
  return Boolean(input.website && input.website.trim());
}
