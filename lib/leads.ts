import { z } from "zod";

/**
 * Contrato de leads — fuente de verdad única de validación (cliente y servidor).
 *
 * Diseñado para que la Fase 2 (agente de assessment) se cuelgue sin rediseñar
 * nada: `tipo` es el discriminante. Hoy solo existe `"contacto"`; cuando llegue
 * la Fase 2 se agrega un `leadAssessmentSchema` con las 8 preguntas del brief y
 * se suma a `leadSchema` como variante de la unión discriminada. El endpoint
 * `/api/contacto` ya normaliza y valida contra este contrato.
 */

/**
 * Los mensajes que este esquema no define explícitamente los genera zod, y por
 * defecto salen en inglés. La UI es toda en español, así que se cambia el
 * locale global una sola vez, acá, que es el módulo que ambos lados importan.
 */
z.config(z.locales.es());

/**
 * Sin saltos de línea ni nulos. `nombre` y `empresa` terminan en el asunto del
 * email: un `\r\n` ahí es un intento de inyección de headers SMTP. `.trim()`
 * solo limpia los bordes, así que el corte tiene que ser explícito.
 */
const SIN_CARACTERES_DE_CONTROL = /^[^\r\n\x00]*$/;

/** Campos comunes a cualquier lead, sea de contacto o de assessment. */
const leadBaseFields = {
  nombre: z
    .string()
    .trim()
    .min(2, "Ingresa tu nombre.")
    .max(80, "El nombre es demasiado largo.")
    .regex(SIN_CARACTERES_DE_CONTROL, "El nombre tiene caracteres no válidos."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Ingresa un email válido.")),
  // `.optional()` ya acepta el string vacío que manda el formulario cuando el
  // campo queda en blanco. Un `.or(z.literal(""))` extra convertiría esto en
  // una unión, y zod reportaría el error genérico de unión en vez del mensaje
  // de abajo.
  empresa: z
    .string()
    .trim()
    .max(100, "El nombre de la empresa es demasiado largo.")
    .regex(SIN_CARACTERES_DE_CONTROL, "La empresa tiene caracteres no válidos.")
    .optional(),
};

/** Trampa anti-spam: campo oculto para humanos, visible para bots. */
export const honeypotField = "website" as const;

/**
 * El honeypot se acepta con cualquier valor **a propósito**: quien lo juzga es
 * el endpoint, no este esquema.
 *
 * Si el esquema lo rechazara, la validación del cliente cortaría el envío antes
 * de llegar al servidor. Un gestor de contraseñas o una extensión de autofill
 * puede rellenar un campo llamado `website` aunque esté oculto y tenga
 * `autocomplete="off"`; en ese caso la persona apretaría "Enviar" y no pasaría
 * nada, sin mensaje ni forma de darse cuenta. Se perdería el lead en silencio.
 */
const honeypotSchema = z.unknown().optional();

/** Lead del formulario de contacto (Fase 1). */
export const leadContactoSchema = z.object({
  tipo: z.literal("contacto").default("contacto"),
  ...leadBaseFields,
  mensaje: z
    .string()
    .trim()
    .min(10, "Cuéntame un poco más — al menos 10 caracteres.")
    .max(2000, "El mensaje es demasiado largo (máx. 2000 caracteres)."),
  [honeypotField]: honeypotSchema,
});

/**
 * Unión de todos los tipos de lead. Hoy tiene una sola variante; la Fase 2
 * agregará `leadAssessmentSchema` acá como `z.discriminatedUnion("tipo", [...])`.
 */
export const leadSchema = leadContactoSchema;

/** Payload validado tal como llega desde el formulario. */
export type LeadContactoInput = z.input<typeof leadContactoSchema>;
export type LeadContacto = z.output<typeof leadContactoSchema>;

/**
 * Lead ya normalizado y listo para persistir o notificar. Es lo que consumen
 * el envío de email (Fase 1) y, más adelante, el agente de assessment (Fase 2).
 */
export interface Lead {
  tipo: "contacto";
  nombre: string;
  email: string;
  empresa?: string;
  mensaje: string;
  /** Momento de recepción en el servidor, ISO 8601. */
  recibidoEn: string;
}

/** Descarta el honeypot y estampa la marca de tiempo del servidor. */
export function normalizarLead(datos: LeadContacto, recibidoEn: Date): Lead {
  return {
    tipo: "contacto",
    nombre: datos.nombre,
    email: datos.email,
    empresa: datos.empresa ? datos.empresa : undefined,
    mensaje: datos.mensaje,
    recibidoEn: recibidoEn.toISOString(),
  };
}

/** Respuesta que el endpoint devuelve al formulario. */
export type RespuestaContacto =
  | { ok: true }
  | { ok: false; error: string; campos?: Record<string, string[]> };
