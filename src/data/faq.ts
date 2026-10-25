export interface Faq {
  q: string;
  a: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: Faq[];
}

// Respuestas generales. Las que dependen de normas o topes de la DIAN se deben revisar cada año
// con el contador responsable antes de publicarlas.
export const faqGroups: FaqGroup[] = [
  {
    id: 'tributacion',
    title: 'Tributación',
    items: [
      {
        q: '¿Estoy obligado a declarar renta como independiente?',
        a: 'Depende de tus ingresos, tu patrimonio, tus consumos con tarjeta y tus compras del año anterior frente a los topes que fija la DIAN cada año. En la primera reunión revisamos tus cifras y te decimos si debes declarar y cuándo vence tu plazo según tu NIT.',
      },
      {
        q: '¿Me conviene el régimen simple o el ordinario?',
        a: 'Ninguno es mejor para todos. Comparamos cuánto pagarías en cada régimen con tus ingresos y gastos reales, y te mostramos el cálculo antes de cualquier cambio en el RUT.',
      },
      {
        q: '¿Qué hago si me llegó un requerimiento de la DIAN?',
        a: 'No lo ignores: los plazos para responder son cortos. Envíanos el documento y te diremos qué pide, qué soportes necesitamos y en cuánto tiempo podemos responderlo.',
      },
      {
        q: '¿Pueden corregir declaraciones de años anteriores?',
        a: 'Sí. Revisamos lo presentado, calculamos si la corrección genera un mayor valor a pagar o un saldo a favor, y te explicamos los costos y riesgos antes de corregir.',
      },
    ],
  },
  {
    id: 'honorarios',
    title: 'Honorarios',
    items: [
      {
        q: '¿Cómo se calculan sus honorarios?',
        a: 'Cobramos un honorario fijo mensual según el plan y el volumen de movimientos. No cobramos por hora ni por cada llamada. Los trabajos fuera del plan se cotizan antes de empezar.',
      },
      {
        q: '¿Hay cláusula de permanencia?',
        a: '[Definir política de permanencia]. Puedes cambiar de plan cuando tu actividad crezca o disminuya.',
      },
      {
        q: '¿Qué medios de pago aceptan?',
        a: '[Definir medios de pago aceptados]. Emitimos factura electrónica por cada pago.',
      },
    ],
  },
  {
    id: 'contratacion',
    title: 'Proceso de contratación',
    items: [
      {
        q: '¿Cómo empezamos?',
        a: 'Agenda una consulta inicial sin costo. Revisamos tu situación, te proponemos un plan y, si estás de acuerdo, firmamos una carta de servicios y te pedimos los documentos para empezar.',
      },
      {
        q: '¿Qué documentos necesitan?',
        a: 'Tu RUT, las declaraciones de los últimos dos años si las tienes, extractos bancarios recientes y acceso a tu facturación electrónica. Te enviamos una lista exacta según tu caso.',
      },
      {
        q: '¿Puedo cambiarme desde otro contador a mitad de año?',
        a: 'Sí. Pedimos la información contable del periodo, revisamos lo que esté pendiente y nos encargamos de la transición sin que pierdas fechas.',
      },
    ],
  },
];
