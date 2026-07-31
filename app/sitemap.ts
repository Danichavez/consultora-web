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
 * Rutas **indexables**. El sitemap no es un inventario de páginas: es la lista
 * de URLs que le pedimos a Google que indexe. Una ruta que no queremos en los
 * resultados no va acá aunque exista y responda 200.
 *
 * Hoy el sitio tiene tres páginas y dos son indexables.
 */
const rutas: RutaIndexable[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  // Indexable y de baja prioridad: nadie la busca, pero que sea rastreable y
  // encontrable es parte de cumplir con la Ley 21.719.
  { path: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
];

/**
 * `/thank-you` queda FUERA del sitemap a propósito — y las dos mitades de esa
 * decisión importan:
 *
 * 1. **No va en el sitemap.** La página se sirve con `noindex` (metadata propia
 *    en `app/thank-you/page.tsx`). Listar en el sitemap una URL marcada
 *    `noindex` son dos señales contradictorias en la misma dirección: Search
 *    Console lo reporta como el error "URL enviada marcada como noindex" y
 *    ensucia la cobertura del único sitemap que tenemos. Es una confirmación de
 *    conversión, no un resultado de búsqueda.
 *
 * 2. **Pero NO se bloquea en `robots.txt`.** Es la trampa clásica: un
 *    `Disallow: /thank-you` impide el rastreo, y sin rastrear la página el
 *    crawler nunca llega a leer la etiqueta `noindex` — con lo cual, si alguien
 *    la enlaza, puede terminar indexada igual, sin título ni descripción. Para
 *    que `noindex` funcione, la página tiene que ser rastreable. Ver `robots.ts`.
 */

/**
 * Genera `/sitemap.xml`. Las URLs se resuelven contra `siteUrl`, que sale de
 * `NEXT_PUBLIC_SITE_URL` y tiene que ser el dominio que Vercel sirve **sin
 * redirigir** (hoy el apex): si apunta al que redirige, cada entrada de este
 * sitemap es un 308.
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
