/**
 * Sección "¿Te suena?" — cuantificación del dolor, antes de proponer nada.
 *
 * El orden importa y no es cosmético: es el mismo orden que los radio buttons
 * de `DESAFIOS` en `lib/leads.ts`. Quien se reconoce en la tarjeta 2 encuentra
 * la opción 2 en el formulario, y el email a la casilla dice exactamente cuál
 * de estas tarjetas lo trajo.
 */

import type { Acento } from "@/content/diferenciales";

export interface Dolor {
  titulo: string;
  descripcion: string;
  /** Selecciona el ícono SVG en el componente. */
  icono: "moneda" | "reloj" | "grafico";
  acento: Acento;
}

export const tituloDolor = "¿Alguna de estas te suena familiar?";

export const dolores: Dolor[] = [
  {
    titulo: "Costos cloud sin visibilidad",
    descripcion:
      "La factura de AWS crece cada mes pero nadie en tu equipo puede explicar por qué ni atribuirla por proyecto.",
    icono: "moneda",
    acento: "marca",
  },
  {
    titulo: "Reportes que dependen de una persona",
    descripcion:
      "Hay un proceso crítico que solo alguien del equipo sabe hacer. Si esa persona se va, el reporte no sale.",
    icono: "reloj",
    acento: "calido",
  },
  {
    titulo: "Datos que nadie confía",
    descripcion:
      "El equipo pasa más tiempo reconciliando planillas que tomando decisiones. Cada área tiene 'su verdad'.",
    icono: "grafico",
    acento: "agua",
  },
];

export const cierreDolor =
  "Cada uno de estos problemas tiene un costo medible. Y se resuelve en semanas — no en meses ni en millones.";
