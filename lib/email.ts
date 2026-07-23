import { Resend } from "resend";

import { site } from "@/content/site";
import { envCon } from "@/lib/env";
import type { Lead } from "@/lib/leads";

/**
 * Notificación por email de un lead nuevo, vía Resend.
 *
 * El cliente de Resend se instancia *dentro* de `enviarEmailLead`, nunca en el
 * top-level: si `RESEND_API_KEY` no está configurada (build de preview, clone
 * recién bajado, CI sin secretos), importar este módulo no debe explotar. La
 * ausencia de la key se reporta como un resultado de error explícito y el route
 * la traduce a un mensaje útil para la persona que escribió.
 */

/** Motivo del fallo. `sin-configurar` es problema nuestro, no del usuario. */
export type MotivoFallo = "sin-configurar" | "proveedor";

export type ResultadoEnvio =
  | { ok: true; id: string | null }
  | { ok: false; motivo: MotivoFallo; detalle: string };

/** Remitente verificado en Resend. Sin dominio propio, el sandbox de Resend. */
const REMITENTE_POR_DEFECTO = "onboarding@resend.dev";

/** Escapa los caracteres que romperían (o inyectarían) HTML en el email. */
function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Fecha legible en horario de Chile; si el ISO viniera raro, cae al crudo. */
function fechaLegible(iso: string): string {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return iso;
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(fecha);
}

/**
 * Segunda barrera contra inyección de headers: el esquema ya rechaza saltos de
 * línea, pero el asunto se arma acá y esta función es exportada — no queremos
 * que dependa de que quien la llame haya validado antes.
 */
function unaSolaLinea(valor: string): string {
  return valor.replace(/[\r\n\x00]+/g, " ").trim();
}

/** `Nuevo lead: Ana Pérez (Acme)` — pensado para escanear la bandeja de un vistazo. */
export function asuntoLead(lead: Lead): string {
  const empresa = lead.empresa ?? "sin empresa";
  return unaSolaLinea(`Nuevo lead: ${lead.nombre} (${empresa})`);
}

/** Cuerpo en texto plano con todos los campos del lead. */
export function cuerpoTextoLead(lead: Lead): string {
  return [
    `Nuevo lead desde ${site.nombre} — formulario de contacto`,
    "",
    `Nombre:   ${lead.nombre}`,
    `Email:    ${lead.email}`,
    `Empresa:  ${lead.empresa ?? "—"}`,
    `Recibido: ${fechaLegible(lead.recibidoEn)} (${lead.recibidoEn})`,
    "",
    "Mensaje:",
    lead.mensaje,
    "",
    "—",
    "Responde directo a este email: el remitente del lead está en Reply-To.",
  ].join("\n");
}

/** Cuerpo HTML equivalente. Todo dato del lead va escapado. */
export function cuerpoHtmlLead(lead: Lead): string {
  const filas: Array<[string, string]> = [
    ["Nombre", lead.nombre],
    ["Email", lead.email],
    ["Empresa", lead.empresa ?? "—"],
    ["Recibido", `${fechaLegible(lead.recibidoEn)} (${lead.recibidoEn})`],
  ];

  const celdas = filas
    .map(
      ([etiqueta, valor]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#71717a;">${escaparHtml(
          etiqueta,
        )}</td><td style="padding:4px 0;">${escaparHtml(valor)}</td></tr>`,
    )
    .join("");

  return [
    `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.6;color:#18181b;">`,
    `<h2 style="font-size:16px;margin:0 0 16px;">Nuevo lead desde el formulario de contacto</h2>`,
    `<table style="border-collapse:collapse;margin-bottom:16px;">${celdas}</table>`,
    `<p style="margin:0 0 4px;color:#71717a;">Mensaje</p>`,
    `<div style="white-space:pre-wrap;padding:12px;background:#f4f4f5;border-radius:8px;">${escaparHtml(
      lead.mensaje,
    )}</div>`,
    `<p style="margin:16px 0 0;color:#71717a;font-size:12px;">Responde directo a este email: el remitente del lead está en Reply-To.</p>`,
    `</div>`,
  ].join("");
}

/**
 * Envía la notificación del lead. Nunca lanza: todo error se devuelve como
 * `{ ok: false }` para que el route decida qué contarle al usuario.
 */
export async function enviarEmailLead(lead: Lead): Promise<ResultadoEnvio> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      motivo: "sin-configurar",
      detalle: "RESEND_API_KEY no está definida en el entorno.",
    };
  }

  // `envCon` trata la variable vacía como ausente: definir `CONTACTO_TO=""` en
  // el panel de Vercel produciría un envío inválido y un 502 sin causa visible.
  const from = envCon(process.env.CONTACTO_FROM, REMITENTE_POR_DEFECTO);
  const to = envCon(process.env.CONTACTO_TO, site.email);

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo: lead.email,
      subject: asuntoLead(lead),
      text: cuerpoTextoLead(lead),
      html: cuerpoHtmlLead(lead),
    });

    if (error) {
      return {
        ok: false,
        motivo: "proveedor",
        detalle: `${error.name}: ${error.message}`,
      };
    }

    return { ok: true, id: data?.id ?? null };
  } catch (error) {
    return {
      ok: false,
      motivo: "proveedor",
      detalle: error instanceof Error ? error.message : String(error),
    };
  }
}
