import { z } from "zod";

import { site } from "@/content/site";
import { enviarEmailLead } from "@/lib/email";
import {
  honeypotField,
  leadContactoSchema,
  normalizarLead,
  type RespuestaContacto,
} from "@/lib/leads";

/**
 * `POST /api/contacto` — recibe el formulario de contacto y notifica por email.
 *
 * Reglas: la validación del cliente no se cree nunca (se revalida acá contra el
 * mismo `leadContactoSchema`), el honeypot corta antes de gastar un envío, y el
 * detalle de cualquier error interno queda en los logs del servidor — al cliente
 * solo le llega un mensaje genérico.
 */

/** Resend usa APIs de Node, así que este handler no corre en el edge. */
export const runtime = "nodejs";

function responder(cuerpo: RespuestaContacto, status: number): Response {
  return Response.json(cuerpo, { status });
}

/** ¿Es un objeto JSON plano? Un array o un `null` no sirven como payload. */
function esObjetoPlano(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

/** Un formulario de contacto no necesita más que esto. */
const MAX_BYTES_BODY = 16 * 1024;

/**
 * Rechaza POSTs cross-origin hechos desde el navegador.
 *
 * Se compara contra el `host` de la propia request y no contra una URL de
 * configuración, para que siga funcionando en local y en los preview deploys
 * de Vercel, donde el dominio no es el de producción. No frena a un `curl`
 * (que simplemente omite `Origin`): es una barrera contra spam automatizado
 * perezoso, no un reemplazo del rate limiting.
 */
function esMismoOrigen(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const host = request.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!esMismoOrigen(request)) {
    return responder(
      { ok: false, error: "Solicitud rechazada." },
      403,
    );
  }

  const largo = Number(request.headers.get("content-length"));
  if (Number.isFinite(largo) && largo > MAX_BYTES_BODY) {
    return responder(
      { ok: false, error: "El mensaje es demasiado largo." },
      413,
    );
  }

  // 1. Body defensivo: JSON roto o payload que no es objeto → 400, nunca 500.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return responder(
      { ok: false, error: "No pudimos leer el formulario. Intenta de nuevo." },
      400,
    );
  }

  if (!esObjetoPlano(body)) {
    return responder(
      { ok: false, error: "No pudimos leer el formulario. Intenta de nuevo." },
      400,
    );
  }

  // 2. Honeypot: si vino con contenido es un bot. Se le devuelve éxito para no
  //    darle señal de que lo detectamos, pero no se procesa ni se envía nada.
  //    Este es el ÚNICO lugar donde se juzga la trampa: el esquema la acepta
  //    con cualquier valor para no bloquear nunca el envío desde el cliente.
  //    Se normaliza a texto para que un valor no-string tampoco se escape.
  const trampa = body[honeypotField];
  if (trampa !== undefined && trampa !== null && String(trampa).trim() !== "") {
    return responder({ ok: true }, 200);
  }

  // 3. Validación en el servidor contra la fuente de verdad compartida.
  const analisis = leadContactoSchema.safeParse(body);
  if (!analisis.success) {
    const { fieldErrors } = z.flattenError(analisis.error);
    const campos: Record<string, string[]> = {};
    for (const [clave, mensajes] of Object.entries(fieldErrors)) {
      // El honeypot no se le reporta al cliente: no le damos pistas al bot.
      if (clave === honeypotField) continue;
      if (mensajes && mensajes.length > 0) campos[clave] = mensajes;
    }

    // Si no quedó ningún campo que marcar, "revisa los campos marcados" deja a
    // la persona sin nada que corregir. En ese caso conviene el genérico.
    if (Object.keys(campos).length === 0) {
      return responder(
        {
          ok: false,
          error: "No pudimos procesar el formulario. Revisa los datos e intenta de nuevo.",
        },
        400,
      );
    }

    return responder(
      { ok: false, error: "Revisa los campos marcados.", campos },
      400,
    );
  }

  // 4. Normalización + envío.
  const lead = normalizarLead(analisis.data, new Date());
  const envio = await enviarEmailLead(lead);

  if (!envio.ok) {
    // El detalle (incluida cualquier respuesta de Resend) queda solo en el log.
    console.error(
      `[contacto] envío fallido (${envio.motivo}): ${envio.detalle}`,
    );

    if (envio.motivo === "sin-configurar") {
      return responder(
        {
          ok: false,
          // Se muestra el email público del sitio, nunca el destinatario real
          // configurado en el entorno.
          error: `El envío automático no está disponible por ahora. Escríbeme directo a ${site.email} y te respondo igual.`,
        },
        503,
      );
    }

    return responder(
      {
        ok: false,
        error:
          "No pudimos enviar tu mensaje en este momento. Intenta de nuevo en unos minutos.",
      },
      502,
    );
  }

  // Solo el id del envío: es lo que permite rastrear un mensaje perdido en el
  // panel de Resend. Nada del lead (nombre, email, mensaje) va al log.
  console.info(`[contacto] envío ok (id: ${envio.id ?? "sin id"})`);

  return responder({ ok: true }, 200);
}
