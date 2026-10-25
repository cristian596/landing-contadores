import type { PhotoKey } from './photos';

export interface Member {
  name: string;
  role: string;
  bio: string;
  photo: PhotoKey;
}

// Datos de ejemplo. Las fotos son retratos de archivo de Unsplash, no del equipo real:
// reemplazar nombres, cargos, biografías y fotos antes de publicar.
export const team: Member[] = [
  {
    name: '[Nombre del socio]',
    role: 'Socia fundadora · Contadora pública',
    bio: 'Lleva [N] años acompañando a independientes en su contabilidad y su planeación tributaria. Coordina el equipo y las cuentas del plan Empresarial.',
    photo: 'retrato1',
  },
  {
    name: '[Nombre del profesional]',
    role: 'Asesor tributario',
    bio: 'Se ocupa de las declaraciones de renta, el IVA y las respuestas a requerimientos de la DIAN. Explica cada cifra antes de presentarla.',
    photo: 'retrato2',
  },
  {
    name: '[Nombre del profesional]',
    role: 'Líder de nómina',
    bio: 'Liquida nóminas, nómina electrónica y planillas de seguridad social. Conoce de memoria los cambios de cada año.',
    photo: 'retrato3',
  },
  {
    name: '[Nombre del profesional]',
    role: 'Consultora financiera',
    bio: 'Ayuda a consultores a fijar tarifas, armar presupuestos y proyectar su flujo de caja con números que entienden.',
    photo: 'retrato4',
  },
];
