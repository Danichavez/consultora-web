/**
 * Configuración global del sitio: identidad, contacto y CTA.
 * Fuente de verdad única — nada de datos de contacto repetidos en componentes.
 */

import { env, envUrl } from "@/lib/env";

/**
 * URL pública del sitio. Se toma de la env var que Vercel inyecta; el fallback
 * es `codebass.org`, el dominio puente que usamos hoy.
 *
 * ⚠️ Tiene que ser **el dominio que Vercel sirve sin redirigir** (hoy el apex;
 * `www` redirige a él con 308). De esta variable salen canonical, `og:url`,
 * `sitemap.xml` y `robots.txt`: si declara un dominio que redirige, el 100% de
 * las URLs canónicas que publicamos son un 308. Verificar contra el sitio en
 * vivo, no contra el `.env`.
 *
 * Cuando se compre `arqdata.cl`: se cambia la env var en Vercel, este fallback,
 * y se verifica el dominio nuevo en Resend.
 */
export const siteUrl = envUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  "https://codebass.org",
);

export const site = {
  /**
   * La marca del sitio es la consultora, no una persona (decisión 2026-07-31).
   * El JSON-LD acompaña: `Organization`, no `Person`.
   */
  nombre: "ArqData",
  rol: "Arquitectura de Datos en AWS",
  /** Se renderiza como texto en el nav y en la imagen Open Graph. */
  logotipo: "ArqData",
  titulo: "ArqData — Arquitectura de Datos en AWS · Chile",
  descripcion:
    "Eliminamos los procesos manuales de datos que le cuestan a tu empresa miles de horas al año. Diagnóstico en 2 semanas, implementación en tu propia cuenta AWS. Empresas medianas en Chile.",
  descripcionCorta:
    "Arquitectura de datos y automatización en AWS para empresas medianas en Chile.",
  /**
   * ⚠️ Correo interino. `contacto@arqdata.cl` NO existe: el dominio todavía no
   * está comprado, y un `mailto:` roto es peor que ninguno. No escribir esa
   * dirección en el código hasta que el dominio esté verificado en Resend.
   */
  email: "danichavez1882@gmail.com",
  ciudad: "Santiago, Chile",
  locale: "es_CL",
  lang: "es-CL",
  linkedin: "https://linkedin.com/in/daniela-chavez-data",
  github: "https://github.com/Danichavez",
  /**
   * Link de la conversación de diagnóstico de 30 min.
   *
   * ⚠️ Dejó de ser una degradación aceptable. En un sitio de 8 secciones, caer
   * al `mailto` si esto está vacío era tolerable; en una página cuyo único
   * trabajo es que alguien agende, es la falla completa y silenciosa. Es
   * prerrequisito duro de despliegue: `/devops` la verifica en Vercel.
   */
  calendly: env(process.env.NEXT_PUBLIC_CALENDLY_URL) ?? "",
} as const;

/**
 * El texto del único CTA de la página. Se repite en el nav, el hero, debajo del
 * caso y en el formulario — vive acá para que no se desincronicen.
 */
export const cta = {
  texto: "Agendar Conversación",
  /** Variante larga, solo para el botón del hero. */
  textoLargo: "Agendar Conversación de Diagnóstico — 30 min",
  destino: "#contacto",
} as const;

/**
 * La landing no tiene navegación: cualquier link que saque a la persona de la
 * página compite con el CTA. Se deja el array (vacío) en vez de borrar el tipo
 * porque `Nav.tsx` y el footer lo consumen y así el cambio es de datos, no de
 * markup.
 */
export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [];
