/**
 * Configuración global del sitio: identidad, contacto y navegación.
 * Fuente de verdad única — nada de datos de contacto repetidos en componentes.
 */

import { env, envUrl } from "@/lib/env";

export interface NavLink {
  href: string;
  label: string;
}

/**
 * URL pública del sitio. El dominio definitivo todavía está pendiente de
 * decisión con Daniela; hasta entonces se toma de la env var que Vercel
 * inyecta, con un placeholder como último recurso.
 */
export const siteUrl = envUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  "https://danielachavez.cl",
);

export const site = {
  nombre: "Daniela Chávez",
  rol: "Data Architect",
  /** Iniciales de la marca. Se usan en el nav y en la imagen Open Graph. */
  logotipo: "DC",
  titulo: "Daniela Chávez — Arquitectura de Datos · AWS · Chile",
  descripcion:
    "Consultora de arquitectura de datos cloud en AWS. Pipelines productivos, governance, BI, FinOps e IA agéntica para empresas medianas en Chile.",
  descripcionCorta:
    "Plataformas de datos cloud que funcionan en producción. Para empresas medianas en Chile.",
  email: "danichavez1882@gmail.com",
  ciudad: "Santiago, Chile",
  locale: "es_CL",
  lang: "es-CL",
  linkedin: "https://linkedin.com/in/daniela-chavez-data",
  github: "https://github.com/Danichavez",
  /**
   * Link de la discovery call de 30 min. Pendiente: confirmar la cuenta real
   * de Calendly con Daniela. Si queda vacío, la UI cae al mailto.
   */
  calendly: env(process.env.NEXT_PUBLIC_CALENDLY_URL) ?? "",
} as const;

export const navLinks: NavLink[] = [
  { href: "#servicios", label: "Servicios" },
  { href: "#trabajo", label: "Proyectos" },
  { href: "#proceso", label: "Proceso" },
];
