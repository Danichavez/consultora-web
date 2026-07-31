import { z } from "zod";

/**
 * Contrato de leads — fuente de verdad única de validación (cliente y servidor).
 *
 * Diseñado para que la Fase 2 (agente de assessment) se cuelgue sin rediseñar
 * nada: `tipo` es el discriminante. Hoy solo existe `"contacto"`; la Fase 2
 * agrega `leadAssessmentSchema` como segunda variante de `leadSchema` y una
 * segunda rama en `normalizarLead()`. El endpoint no se toca.
 *
 * El formulario de la landing es un **micro-cualificador de 4 campos**: su
 * trabajo es que alguien agende, no levantar requisitos. El formulario largo
 * (texto libre que alimenta el prompt del agente) es el de `/assessment`, y es
 * otro formulario con otro esquema — no una versión extendida de este.
 */

/**
 * Los mensajes que este esquema no define explícitamente los genera zod, y por
 * defecto salen en inglés. La UI es toda en español, así que se cambia el
 * locale global una sola vez, acá, que es el módulo que ambos lados importan.
 */
z.config(z.locales.es());

/**
 * Sin saltos de línea ni nulos. `nombre` termina en el asunto del email: un
 * `\r\n` ahí es un intento de inyección de headers SMTP. `.trim()` solo limpia
 * los bordes, así que el corte tiene que ser explícito.
 */
const SIN_CARACTERES_DE_CONTROL = /^[^\r\n\x00]*$/;

/**
 * Rol de quien consulta. Es un enum y no texto libre a propósito: cada campo
 * cerrado es una superficie menos de abuso y un dato más fácil de leer de un
 * vistazo en la bandeja.
 *
 * El `value` es el dato que viaja; el `label` es lo que se ve. Los dos viven
 * acá para que el formulario y el email muestren exactamente lo mismo — si el
 * label viviera en el componente, el email diría `gerente-ti` y nadie lo
 * arreglaría hasta que Daniela preguntara qué significa.
 */
export const ROLES = [
  { value: "cto", label: "CTO" },
  { value: "gerente-ti", label: "Gerente de TI" },
  { value: "data-lead", label: "Data Lead" },
  { value: "arquitecto", label: "Arquitecto" },
  { value: "finops", label: "FinOps" },
  { value: "otro", label: "Otro" },
] as const;

export type RolLead = (typeof ROLES)[number]["value"];

/** Los cuatro dolores de la sección "¿Te suena?", en el mismo orden. */
export const DESAFIOS = [
  {
    value: "costos-cloud",
    label: "Costos cloud creciendo sin visibilidad",
  },
  {
    value: "reportes-manuales",
    label: "Reportes manuales que toman horas",
  },
  {
    value: "dependencia-persona",
    label: "Procesos críticos que dependen de una persona",
  },
  {
    value: "modernizar-arquitectura",
    label: "Necesidad de modernizar la arquitectura de datos",
  },
] as const;

export type DesafioLead = (typeof DESAFIOS)[number]["value"];

/** Devuelve el texto visible de un valor del enum. Lo usan la UI y el email. */
export function etiquetaRol(valor: RolLead): string {
  return ROLES.find((r) => r.value === valor)?.label ?? valor;
}

export function etiquetaDesafio(valor: DesafioLead): string {
  return DESAFIOS.find((d) => d.value === valor)?.label ?? valor;
}

const valoresRoles = ROLES.map((r) => r.value) as [RolLead, ...RolLead[]];
const valoresDesafios = DESAFIOS.map((d) => d.value) as [
  DesafioLead,
  ...DesafioLead[],
];

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

/**
 * Lead del formulario de la landing. Cuatro campos, todos obligatorios.
 *
 * `tipo` NO lleva `.default()`: un discriminante con default dentro de una
 * `z.discriminatedUnion` es terreno resbaloso, y la Fase 2 convierte esto en
 * unión. Se saca ahora, con una sola variante, para que la fase siguiente no
 * herede el problema. A cambio, **los formularios tienen que mandar `tipo`
 * explícito en sus `defaultValues`**.
 */
export const leadContactoSchema = z.object({
  tipo: z.literal("contacto"),
  ...leadBaseFields,
  rol: z.enum(valoresRoles, { message: "Selecciona tu rol." }),
  desafio: z.enum(valoresDesafios, { message: "Selecciona tu principal desafío." }),
  [honeypotField]: honeypotSchema,
});

/**
 * Unión de todos los tipos de lead. Hoy tiene una sola variante; la Fase 2
 * agrega `leadAssessmentSchema` acá como `z.discriminatedUnion("tipo", [...])`.
 */
export const leadSchema = leadContactoSchema;

/** Payload validado tal como llega desde el formulario. */
export type LeadContactoInput = z.input<typeof leadContactoSchema>;
export type LeadContacto = z.output<typeof leadContactoSchema>;

/**
 * Lead ya normalizado y listo para notificar. Es lo que consumen el envío de
 * email (Fase 1) y, más adelante, el agente de assessment (Fase 2).
 *
 * Es un `type` y no una `interface` porque la Fase 2 lo vuelve una unión
 * discriminada (`LeadContactoNormalizado | LeadAssessmentNormalizado`). Con el
 * `switch` exhaustivo sobre `tipo` en `procesarLead()`, agregar una variante sin
 * manejarla rompe el build — que es exactamente lo que queremos.
 */
export interface LeadContactoNormalizado {
  tipo: "contacto";
  nombre: string;
  email: string;
  rol: RolLead;
  desafio: DesafioLead;
  /** Momento de recepción en el servidor, ISO 8601. */
  recibidoEn: string;
}

export type Lead = LeadContactoNormalizado;

/** Descarta el honeypot y estampa la marca de tiempo del servidor. */
export function normalizarLead(datos: LeadContacto, recibidoEn: Date): Lead {
  return {
    tipo: "contacto",
    nombre: datos.nombre,
    email: datos.email,
    rol: datos.rol,
    desafio: datos.desafio,
    recibidoEn: recibidoEn.toISOString(),
  };
}

/**
 * Dominios de correo gratuito. **No se usa para validar**: bloquear un `@gmail`
 * perdería clientes reales (en Chile una PYME mediana escribe desde Gmail) y el
 * email de contacto de la propia consultora es uno. Se usa solo para mostrar una
 * sugerencia en gris en el formulario, sin marcar el campo como inválido ni
 * impedir el envío.
 *
 * Vive acá y no en el componente porque el email a la casilla también la usa,
 * para anotar "correo personal" al costado del dato.
 */
export const DOMINIOS_PERSONALES = [
  "gmail.com",
  "hotmail.com",
  "hotmail.cl",
  "outlook.com",
  "outlook.cl",
  "live.cl",
  "yahoo.com",
  "yahoo.es",
  "icloud.com",
  "proton.me",
  "protonmail.com",
] as const;

export function esCorreoPersonal(email: string): boolean {
  const dominio = email.trim().toLowerCase().split("@")[1];
  if (!dominio) return false;
  return (DOMINIOS_PERSONALES as readonly string[]).includes(dominio);
}

/** Respuesta que el endpoint devuelve al formulario. */
export type RespuestaContacto =
  | { ok: true }
  | { ok: false; error: string; campos?: Record<string, string[]> };
