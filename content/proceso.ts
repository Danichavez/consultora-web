/**
 * Los 5 pasos del proceso de trabajo (catalogo_servicios.md → "Cómo trabajo").
 */

export interface Paso {
  numero: number;
  titulo: string;
  detalle: string;
  /** El último paso se marca en emerald para cerrar la secuencia. */
  acento: "brand" | "emerald";
}

export const proceso: Paso[] = [
  { numero: 1, titulo: "Discovery", detalle: "30 min · Gratis", acento: "brand" },
  { numero: 2, titulo: "Propuesta", detalle: "En 48 horas", acento: "brand" },
  { numero: 3, titulo: "Implementación", detalle: "En tu cuenta AWS", acento: "brand" },
  { numero: 4, titulo: "Entrega", detalle: "Código + docs + training", acento: "brand" },
  { numero: 5, titulo: "Soporte", detalle: "30 días incluidos", acento: "emerald" },
];
