// Datos de prueba para /dev/*: solo existen en desarrollo (la ruta no se genera en producción).
// Cada valor es algo que un cliente real podría escribir o que el negocio podría configurar.
import type { SiteInfo } from '../config/site';
import { site } from '../config/site';
import type { Member } from '../data/team';
import type { Plan, FeatureRow } from '../data/plans';
import type { Faq } from '../data/faq';
import { team } from '../data/team';
import { comparison, plans } from '../data/plans';
import { faqGroups } from '../data/faq';

export type Estado = 'demo' | 'extremo' | 'vacio' | 'uno';

export interface Dataset {
  team: Member[];
  plans: Plan[];
  comparison: { group: string; rows: FeatureRow[] }[];
  faq: Faq[];
  info: SiteInfo;
}

const worstTeam: Member[] = [
  {
    name: 'María Alejandra Rodríguez-Villamizar de los Ríos',
    role: 'Directora de Planeación Tributaria Internacional y Precios de Transferencia',
    bio: 'Contadora pública con especialización en tributación internacional, maestría en finanzas corporativas y diplomado en normas internacionales de información financiera (NIIF). Acompaña a consultores que facturan en dólares a clientes del exterior, con convenios para evitar la doble imposición, y responde requerimientos de la DIAN desde hace más de quince años.',
    photo: 'retrato1',
  },
  { name: 'Jo', role: 'Auxiliar contable', bio: 'Concilia.', photo: 'retrato2' },
  {
    name: 'عبد الرحمن الشمري',
    role: 'مستشار ضريبي',
    bio: 'يساعد العملاء في الإقرارات الضريبية.',
    photo: 'retrato3',
  },
  { name: 'Dương Thị Ngọc Ánh', role: '', bio: '', photo: 'retrato4' },
];

const worstPlans: Plan[] = [
  {
    id: 'basico',
    name: 'Básico',
    forWhom: 'Para quien empieza.',
    monthly: '$0',
    yearly: '$0',
    highlights: [],
  },
  {
    id: 'profesional',
    name: 'Profesional para Steuerberatungsgesellschaften',
    forWhom:
      'Für Freiberufler und Beratungsgesellschaften mit umsatzsteuerpflichtigen Leistungen und Angestellten in mehreren Städten.',
    monthly: '$1.250.000.000',
    yearly: '$15.000.000.000',
    highlights: [
      'Todo lo del plan Básico',
      'IVA bimestral y cuatrimestral, retención en la fuente, autorretención especial de renta y reteICA en 14 municipios',
      'Nómina de hasta 1.284 personas',
      '月次決算レポート',
    ],
  },
  {
    id: 'empresarial',
    name: 'Empresarial',
    forWhom: 'Para firmas pequeñas con equipo y varias líneas de ingreso.',
    monthly: '$X.XXX.XXX',
    yearly: '$XX.XXX.XXX',
    highlights: Array.from({ length: 12 }, (_, i) => `Beneficio incluido número ${i + 1}`),
  },
];

const worstComparison: { group: string; rows: FeatureRow[] }[] = [
  {
    group: 'Contabilidad y cumplimiento de obligaciones formales ante entidades de control',
    rows: [
      {
        label:
          'Registro, conciliación bancaria y cierre contable mensual bajo NIIF para pymes y microempresas',
        values: {
          basico: true,
          profesional: 'Ilimitado, con revisión trimestral presencial en sus oficinas',
          empresarial: '1.250.000 movimientos',
        },
      },
      { label: 'Exógena', values: { basico: false, profesional: '—', empresarial: true } },
    ],
  },
];

const worstFaq: Faq[] = [
  {
    q: '¿Qué pasa si facturo en dólares a un cliente de Estados Unidos a través de una plataforma como Upwork o Deel y además tengo ingresos como empleado en Colombia?',
    a: 'Respuesta larga con una dirección sin espacios: https://www.dian.gov.co/Contribuyentes-Plus/Paginas/Calendario-Tributario-y-obligaciones-formales-personas-naturales-residentes.aspx y un correo bartholomew.fitzgerald@northwind-industries-holdings.example.com.',
  },
  { q: '¿IVA?', a: 'Sí.' },
  { q: '確定申告は必要ですか？', a: '収入によって異なります。詳しくはお問い合わせください。' },
];

const worstInfo: SiteInfo = {
  ...site,
  name: 'Rodríguez Villamizar & Asociados Contadores Públicos S.A.S.',
  legalName: 'Rodríguez Villamizar & Asociados Contadores Públicos Sociedad por Acciones Simplificada',
  nit: '900.123.456-7',
  email: 'bartholomew.fitzgerald@northwind-industries-holdings.example.com',
  phone: '+57 (601) 745 8899 ext. 12345',
  address: 'Carrera 7 # 71-21, Torre B, Oficina 1204, Edificio Bancafé Centro Empresarial',
  city: 'San José de Cúcuta, Norte de Santander, Colombia',
};

export const datasets: Record<Estado, Dataset> = {
  demo: { team, plans, comparison, faq: faqGroups[0]!.items, info: site },
  extremo: {
    team: worstTeam,
    plans: worstPlans,
    comparison: worstComparison,
    faq: worstFaq,
    info: worstInfo,
  },
  vacio: { team: [], plans, comparison, faq: [], info: site },
  uno: {
    team: team.slice(0, 1),
    plans,
    comparison: comparison.slice(0, 1),
    faq: faqGroups[0]!.items.slice(0, 1),
    info: site,
  },
};
