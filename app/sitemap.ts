import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

interface RutaIndexable {
  /** Path absoluto dentro del sitio, con `/` inicial. */
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

/**
 * Rutas indexables. Hoy solo existe la home; cuando exista el blog basta con
 * descomentar la línea de `/blog` (y agregar una por post, o mapear el índice
 * de posts acá) — el resto del archivo no se toca.
 */
const rutas: RutaIndexable[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  // { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
];

/**
 * Genera `/sitemap.xml`. Las URLs se resuelven contra `siteUrl`, que sale de
 * `NEXT_PUBLIC_SITE_URL`: el dominio definitivo todavía no está decidido.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return rutas.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified,
    changeFrequency,
    priority,
  }));
}
