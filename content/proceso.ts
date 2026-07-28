/**
 * Los 5 pasos del proceso de trabajo (catalogo_servicios.md → "Cómo trabajo").
 */

export interface Paso {
  numero: number;
  titulo: string;
  detalle: string;
  /** El último paso lleva otro acento para cerrar visualmente la secuencia. */
  acento: "marca" | "alterno";
}

export const proceso: Paso[] = [
  { numero: 1, titulo: "Discovery", detalle: "30 min · Gratis", acento: "marca" },
  { numero: 2, titulo: "Propuesta", detalle: "En 48 horas", acento: "marca" },
  { numero: 3, titulo: "Implementación", detalle: "En tu cuenta AWS", acento: "marca" },
  { numero: 4, titulo: "Entrega", detalle: "Código + docs + training", acento: "marca" },
  { numero: 5, titulo: "Soporte", detalle: "30 días incluidos", acento: "alterno" },
];
