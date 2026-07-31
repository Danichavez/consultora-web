/**
 * Cómo funciona — tres pasos.
 *
 * Pasó de 5 pasos a 3 en el rediseño (2026-07-31): los pasos 4 y 5 (entrega y
 * soporte) describían el después de la venta y le restaban peso al único
 * objetivo de la página, que es que alguien agende la conversación.
 *
 * `numero` es string (`"01"`) y no number a propósito: se renderiza en
 * `--font-mono` con el cero a la izquierda, y es el detalle que sostiene el
 * carácter "terminal" del tema sin repintar nada de ámbar.
 */

export interface Paso {
  numero: string;
  titulo: string;
  descripcion: string;
}

export const tituloProceso = "Cómo funciona";

export const proceso: Paso[] = [
  {
    numero: "01",
    titulo: "Conversación",
    descripcion:
      "30 minutos para entender tu dolor. Gratis, sin presentaciones de 40 páginas. Sin compromiso.",
  },
  {
    numero: "02",
    titulo: "Propuesta en 48h",
    descripcion: "Alcance, timeline y precio claro. Sin letra chica.",
  },
  {
    numero: "03",
    titulo: "Implementación en tu cuenta",
    descripcion:
      "Código tuyo, infraestructura tuya. Si no nos necesitas más, sigues operando.",
  },
];
