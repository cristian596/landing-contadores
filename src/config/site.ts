// Datos de la firma. Todo lo que está entre corchetes es un placeholder que se debe reemplazar antes de publicar.
export interface SiteInfo {
  name: string;
  legalName: string;
  nit: string;
  description: string;
  email: string;
  privacyEmail: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  hours: readonly { days: string; time: string }[];
  social: readonly { label: string; href: string }[];
  legalUpdated: string;
}

export const site: SiteInfo = {
  name: '[Nombre de la firma]',
  legalName: '[Razón social de la firma]',
  nit: '[NIT de la firma]',
  description:
    'Contabilidad, impuestos y nómina para contadores y consultores independientes en Colombia, con un honorario fijo cada mes.',
  email: '[correo@dominio.com]',
  privacyEmail: '[datospersonales@dominio.com]',
  phone: '[+57 XXX XXX XXXX]',
  whatsapp: '[+57 XXX XXX XXXX]',
  address: '[Dirección de la oficina]',
  city: '[Ciudad], Colombia',
  hours: [
    { days: 'Lunes a viernes', time: '[8:00 a. m. – 5:00 p. m.]' },
    { days: 'Sábados', time: '[9:00 a. m. – 12:00 m.]' },
  ],
  social: [
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
  ],
  legalUpdated: '[DD de mes de AAAA]',
};

export const nav = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/planes', label: 'Planes' },
  { href: '/equipo', label: 'Equipo' },
  { href: '/preguntas-frecuentes', label: 'Preguntas' },
  { href: '/contacto', label: 'Contacto' },
] as const;

export const legalNav = [
  { href: '/politica-de-privacidad', label: 'Política de privacidad' },
  { href: '/tratamiento-de-datos', label: 'Tratamiento de datos personales' },
  { href: '/politica-de-cookies', label: 'Política de cookies' },
] as const;
