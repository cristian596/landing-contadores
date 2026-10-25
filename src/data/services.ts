import type { PhotoKey } from './photos';

export type IconName = 'ledger' | 'tax' | 'payroll' | 'filing' | 'growth';

export interface Service {
  slug: string;
  icon: IconName;
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
  forWhom: string;
  photo: PhotoKey;
}

export const services: Service[] = [
  {
    slug: 'contabilidad-general',
    icon: 'ledger',
    title: 'Contabilidad general',
    summary: 'Tus ingresos y gastos registrados y conciliados cada mes.',
    description:
      'Registramos tus facturas, cuentas de cobro y gastos, conciliamos tus cuentas bancarias y cerramos el mes con estados financieros que puedes leer sin ser contador.',
    deliverables: [
      'Registro y conciliación bancaria mensual',
      'Estado de resultados y balance general',
      'Control de cuentas por cobrar y por pagar',
      'Archivo digital de soportes contables',
    ],
    forWhom: 'Independientes y pequeñas firmas que facturan cada mes.',
    photo: 'calculadoraFacturas',
  },
  {
    slug: 'asesoria-tributaria',
    icon: 'tax',
    title: 'Asesoría tributaria',
    summary: 'Pagas lo que corresponde, ni un peso más, y sin sanciones.',
    description:
      'Revisamos tu régimen, tus responsabilidades en el RUT y tus retenciones para que tomes decisiones tributarias informadas durante todo el año, no solo en temporada de declaraciones.',
    deliverables: [
      'Revisión y actualización del RUT',
      'Análisis de régimen ordinario o simple',
      'Planeación tributaria anual',
      'Acompañamiento en requerimientos de la DIAN',
    ],
    forWhom: 'Quien no sabe si está en el régimen correcto o recibió una carta de la DIAN.',
    photo: 'formulariosImpuestos',
  },
  {
    slug: 'nomina',
    icon: 'payroll',
    title: 'Nómina',
    summary: 'Tu equipo recibe su pago y sus aportes a tiempo.',
    description:
      'Liquidamos la nómina, generamos la nómina electrónica, calculamos prestaciones sociales y preparamos la planilla de aportes a seguridad social, incluida la tuya como independiente.',
    deliverables: [
      'Liquidación de nómina y prestaciones',
      'Nómina electrónica',
      'Planilla de seguridad social (PILA)',
      'Certificados laborales y de ingresos',
    ],
    forWhom: 'Consultores con asistentes o un equipo pequeño, y quien aporta como independiente.',
    photo: 'reunionMesa',
  },
  {
    slug: 'declaraciones',
    icon: 'filing',
    title: 'Declaraciones',
    summary: 'Cada formulario presentado antes de su fecha.',
    description:
      'Preparamos y presentamos tus declaraciones con los soportes en orden y te avisamos con anticipación según el calendario tributario que aplica a tu NIT.',
    deliverables: [
      'Declaración de renta de persona natural',
      'Declaraciones de IVA y retención en la fuente',
      'Información exógena',
      'Impuestos municipales (ICA)',
    ],
    forWhom: 'Toda persona o empresa obligada a declarar ante la DIAN o su municipio.',
    photo: 'certificadoRetencion',
  },
  {
    slug: 'consultoria-financiera',
    icon: 'growth',
    title: 'Consultoría financiera para independientes',
    summary: 'Decide con números: tarifas, ahorro, flujo de caja.',
    description:
      'Te ayudamos a fijar tarifas que cubran tus impuestos y aportes, a separar tus finanzas personales de las del negocio y a proyectar tu flujo de caja para los meses flojos.',
    deliverables: [
      'Cálculo de tarifa mínima rentable',
      'Presupuesto y flujo de caja proyectado',
      'Reserva para impuestos y aportes',
      'Revisión trimestral de indicadores',
    ],
    forWhom: 'Independientes que facturan bien pero no saben cuánto les queda.',
    photo: 'reportesGraficos',
  },
];
