export type PlanId = 'basico' | 'profesional' | 'empresarial';

export interface Plan {
  id: PlanId;
  name: string;
  forWhom: string;
  // Precios de ejemplo: reemplazar por los honorarios reales antes de publicar.
  monthly: string;
  yearly: string;
  highlights: string[];
}

export const yearlyDiscount = '[X]%';

export const plans: Plan[] = [
  {
    id: 'basico',
    name: 'Básico',
    forWhom: 'Para quien empieza a facturar como independiente.',
    monthly: '$XXX.XXX',
    yearly: '$X.XXX.XXX',
    highlights: ['Contabilidad mensual', 'Declaración de renta anual', 'Planilla PILA como independiente'],
  },
  {
    id: 'profesional',
    name: 'Profesional',
    forWhom: 'Para consultores responsables de IVA o con un asistente.',
    monthly: '$XXX.XXX',
    yearly: '$X.XXX.XXX',
    highlights: [
      'Todo lo del plan Básico',
      'IVA y retención en la fuente',
      'Nómina de hasta [N] personas',
      'Reunión trimestral de revisión',
    ],
  },
  {
    id: 'empresarial',
    name: 'Empresarial',
    forWhom: 'Para firmas pequeñas con equipo y varias líneas de ingreso.',
    monthly: '$X.XXX.XXX',
    yearly: '$XX.XXX.XXX',
    highlights: [
      'Todo lo del plan Profesional',
      'Nómina de hasta [N] personas',
      'Información exógena e ICA',
      'Consultoría financiera mensual',
      'Contador asignado con línea directa',
    ],
  },
];

export type Cell = boolean | string;

export interface FeatureRow {
  label: string;
  values: Record<PlanId, Cell>;
}

export const comparison: { group: string; rows: FeatureRow[] }[] = [
  {
    group: 'Contabilidad',
    rows: [
      {
        label: 'Registro y conciliación mensual',
        values: { basico: true, profesional: true, empresarial: true },
      },
      {
        label: 'Estados financieros',
        values: { basico: 'Trimestral', profesional: 'Mensual', empresarial: 'Mensual' },
      },
      {
        label: 'Movimientos incluidos al mes',
        values: { basico: '[N]', profesional: '[N]', empresarial: 'Sin límite' },
      },
    ],
  },
  {
    group: 'Impuestos',
    rows: [
      { label: 'Declaración de renta anual', values: { basico: true, profesional: true, empresarial: true } },
      {
        label: 'IVA y retención en la fuente',
        values: { basico: false, profesional: true, empresarial: true },
      },
      { label: 'Información exógena', values: { basico: false, profesional: false, empresarial: true } },
      {
        label: 'Impuestos municipales (ICA)',
        values: { basico: false, profesional: false, empresarial: true },
      },
      {
        label: 'Respuesta a requerimientos DIAN',
        values: { basico: 'Cotización aparte', profesional: true, empresarial: true },
      },
    ],
  },
  {
    group: 'Nómina',
    rows: [
      {
        label: 'Planilla PILA como independiente',
        values: { basico: true, profesional: true, empresarial: true },
      },
      {
        label: 'Nómina electrónica',
        values: { basico: false, profesional: 'Hasta [N] personas', empresarial: 'Hasta [N] personas' },
      },
    ],
  },
  {
    group: 'Acompañamiento',
    rows: [
      {
        label: 'Canal de atención',
        values: { basico: 'Correo', profesional: 'Correo y WhatsApp', empresarial: 'Línea directa' },
      },
      {
        label: 'Reunión de revisión',
        values: { basico: 'Anual', profesional: 'Trimestral', empresarial: 'Mensual' },
      },
      { label: 'Consultoría financiera', values: { basico: false, profesional: false, empresarial: true } },
    ],
  },
];
