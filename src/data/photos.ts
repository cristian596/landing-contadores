import type { ImageMetadata } from 'astro';
import libroMayor from '../assets/photos/libro-mayor.jpg';
import calculadoraFacturas from '../assets/photos/calculadora-facturas.jpg';
import reunionMesa from '../assets/photos/reunion-mesa.jpg';
import formulariosImpuestos from '../assets/photos/formularios-impuestos.jpg';
import independienteEscritorio from '../assets/photos/independiente-escritorio.jpg';
import revisionDocumentos from '../assets/photos/revision-documentos.jpg';
import contadorRevisa from '../assets/photos/contador-revisa.jpg';
import colegasRevision from '../assets/photos/colegas-revision.jpg';
import escritorioCifras from '../assets/photos/escritorio-cifras.jpg';
import grapadoraPapeles from '../assets/photos/grapadora-papeles.jpg';
import certificadoRetencion from '../assets/photos/certificado-retencion.jpg';
import reportesGraficos from '../assets/photos/reportes-graficos.jpg';
import retrato1 from '../assets/photos/retrato-1.jpg';
import retrato2 from '../assets/photos/retrato-2.jpg';
import retrato3 from '../assets/photos/retrato-3.jpg';
import retrato4 from '../assets/photos/retrato-4.jpg';
import salaReuniones from '../assets/photos/sala-reuniones.jpg';

export interface Photo {
  src: ImageMetadata;
  alt: string;
  author: string;
  authorUrl: string;
  photoUrl: string;
}

// Todas las fotografías vienen de Unsplash (licencia Unsplash: uso comercial gratuito, sin atribución
// obligatoria). Aun así se acredita a cada autor en /creditos y en el pie de las páginas que las usan.
const credit = (handle: string, id: string) => ({
  authorUrl: `https://unsplash.com/@${handle}?utm_source=plantilla_contadores&utm_medium=referral`,
  photoUrl: `https://unsplash.com/photos/${id}?utm_source=plantilla_contadores&utm_medium=referral`,
});

export const photos = {
  libroMayor: {
    src: libroMayor,
    alt: 'Libro contable antiguo abierto sobre un escritorio, con estantes de libros al fondo',
    author: 'Magic Fan',
    ...credit('magicunsplash', 'asJcxnofSWg'),
  },
  calculadoraFacturas: {
    src: calculadoraFacturas,
    alt: 'Calculadora sobre una pila de facturas y hojas de cálculo impresas',
    author: 'FIN',
    ...credit('fin21', '741iShluYhk'),
  },
  reunionMesa: {
    src: reunionMesa,
    alt: 'Personas tomando notas alrededor de una mesa de madera durante una reunión',
    author: 'Dylan Gillis',
    ...credit('mainermedia', 'KdeqA3aTnBY'),
  },
  formulariosImpuestos: {
    src: formulariosImpuestos,
    alt: 'Manos sosteniendo formularios tributarios junto a una calculadora y un portátil',
    author: 'Kelly Sikkema',
    ...credit('kellysikkema', '8XrYtOYQDRU'),
  },
  independienteEscritorio: {
    src: independienteEscritorio,
    alt: 'Profesional independiente trabajando en su portátil en una oficina luminosa',
    author: 'Vitaly Gariev',
    ...credit('silverkblack', '1ZrHX1Kj594'),
  },
  revisionDocumentos: {
    src: revisionDocumentos,
    alt: 'Persona revisando documentos con calculadora y portátil sobre una manta oscura',
    author: 'Kelly Sikkema',
    ...credit('kellysikkema', '0oZpRxG5Hkk'),
  },
  contadorRevisa: {
    src: contadorRevisa,
    alt: 'Hombre con gafas revisando documentos en su escritorio',
    author: 'Vitaly Gariev',
    ...credit('silverkblack', 'xQydhL4LmlA'),
  },
  colegasRevision: {
    src: colegasRevision,
    alt: 'Dos colegas revisando documentos en un escritorio de oficina',
    author: 'Vitaly Gariev',
    ...credit('silverkblack', 'zQXdDfmkevA'),
  },
  escritorioCifras: {
    src: escritorioCifras,
    alt: 'Escritorio visto desde arriba con documentos, calculadora y bolígrafo',
    author: 'Kelly Sikkema',
    ...credit('kellysikkema', 'xoU52jUVUXA'),
  },
  grapadoraPapeles: {
    src: grapadoraPapeles,
    alt: 'Grapadora negra sobre una pila de papeles ordenados',
    author: 'Duskfall Crew',
    ...credit('duskfallcrew', 'qWM6whL_7vM'),
  },
  certificadoRetencion: {
    src: certificadoRetencion,
    alt: 'Certificados tributarios, teléfono y bolígrafo sobre un escritorio oscuro',
    author: 'Kelly Sikkema',
    ...credit('kellysikkema', 'M98NRBuzbpc'),
  },
  reportesGraficos: {
    src: reportesGraficos,
    alt: 'Reportes financieros con gráficos impresos junto a una libreta y un teléfono',
    author: 'Jakub Żerdzicki',
    ...credit('jakubzerdzicki', 'heiYgqp0Tsk'),
  },
  retrato1: {
    src: retrato1,
    alt: 'Retrato de una profesional con chaqueta gris junto a una ventana',
    author: 'Christina @ wocintechchat.com',
    ...credit('wocintechchat', '0Zx1bDv5BNY'),
  },
  retrato2: {
    src: retrato2,
    alt: 'Retrato de un profesional sonriente con suéter gris',
    author: 'Jurica Koletić',
    ...credit('juricakoletic', '7YVZYZeITc8'),
  },
  retrato3: {
    src: retrato3,
    alt: 'Retrato de una profesional sonriente con chaqueta de rayas',
    author: 'Christina @ wocintechchat.com',
    ...credit('wocintechchat', 'SJvDxw0azqw'),
  },
  retrato4: {
    src: retrato4,
    alt: 'Retrato de una profesional sonriente con camisa blanca',
    author: 'Jake Nackos',
    ...credit('jakenackos', 'IF9TK5Uy-KI'),
  },
  salaReuniones: {
    src: salaReuniones,
    alt: 'Sala de reuniones con un equipo trabajando en portátiles alrededor de una mesa larga',
    author: 'Christina @ wocintechchat.com',
    ...credit('wocintechchat', 'faEfWCdOKIg'),
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
