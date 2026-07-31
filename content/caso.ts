/**
 * Caso real — la única prueba cuantificada del sitio.
 *
 * ⚠️ Dos advertencias que hay que leer antes de tocar este archivo:
 *
 * 1. **El cliente va anonimizado, siempre.** "Sector financiero regulado" es
 *    todo lo que se publica. Nunca el nombre, ni un detalle que lo identifique.
 *
 * 2. **Estas cifras NO son precios.** Son métricas de resultado (horas
 *    liberadas, costo de infraestructura, antigüedad en producción). La decisión
 *    comercial de 2026-07-27 sacó del sitio los montos en CLP de los servicios y
 *    sigue vigente: acá no se agrega ninguna cifra de lo que cobramos, ni
 *    siquiera como rango. Si alguien pide "mostrar el ROI en pesos", eso reabre
 *    esa decisión y no se hace sin aval explícito.
 *
 * Recordatorio de la vez pasada: cuando un dato sale (o entra) por decisión de
 * negocio, hay que revisarlo también en metadata, JSON-LD, OG y sitemap — no
 * solo en la vista.
 */

export interface CifraCaso {
  /** Se renderiza grande y en `--font-mono`. */
  valor: string;
  label: string;
}

export const caso = {
  titulo: "Caso real — Sector financiero regulado",
  pedido: {
    etiqueta: "El pedido",
    texto: "«Crear una tabla con datos históricos».",
  },
  hallazgo: {
    etiqueta: "Lo que descubrimos",
    texto:
      "Un proceso de riesgo de 4 horas diarias sostenido en planillas, sin auditoría, con un solo punto de falla.",
  },
  entrega: {
    etiqueta: "Lo que entregamos",
    texto:
      "Un pipeline serverless de 4 etapas con 9 controles de calidad automáticos.",
  },
  cifras: [
    { valor: "1.100", label: "horas/año liberadas" },
    { valor: "US$250", label: "al mes de infraestructura total" },
    { valor: "4+", label: "años en producción" },
  ] satisfies CifraCaso[],
  cta: "¿Tu equipo tiene un proceso parecido?",
} as const;
