import type { Metadata } from "next";

import { Confirmacion } from "@/components/CalendlyEmbed";

/**
 * `/thank-you` — página de confirmación.
 *
 * Existe por dos razones (spec §8):
 *   1. Es el destino del redirect que se configura DENTRO de Calendly después
 *      de agendar. Ese redirect no se dispara desde el código: la página no
 *      puede saber qué pasa adentro del iframe.
 *   2. Es una URL estable que sirve como objetivo de conversión en GA4 y como
 *      destino de cualquier link directo.
 *
 * Renderiza exactamente el mismo bloque que el estado de éxito del formulario:
 * el copy vive una sola vez, en `components/CalendlyEmbed.tsx`.
 */
export const metadata: Metadata = {
  title: "Listo — recibimos tu solicitud",
  description:
    "Confirmación de la solicitud de conversación de diagnóstico con ArqData.",
  /*
   * `noindex`: es una página de confirmación, no un resultado de búsqueda. Sin
   * esto termina indexada y apareciendo en Google como si fuera la landing.
   *
   * `robots` y `alternates` se declaran completos a propósito: la metadata de
   * Next no hace merge profundo — el último segmento que define un campo
   * anidado reemplaza el del layout. Sin `googleBot` acá quedaría vivo el
   * `index: true` que el layout raíz declara para Googlebot, y sin `canonical`
   * esta página apuntaría a `/`.
   */
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  alternates: {
    canonical: "/thank-you",
  },
};

export default function ThankYouPage() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <Confirmacion nivelTitulo="h1" />
      </div>
    </section>
  );
}
