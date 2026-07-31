import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";

/**
 * Genera `/robots.txt`. El sitio es una landing pública: se permite todo y se
 * apunta al sitemap con URL absoluta (los crawlers ignoran una relativa).
 *
 * ⚠️ `/thank-you` **no se bloquea acá**, aunque vaya con `noindex`. Es
 * deliberado y es el error de SEO más común de este par: `Disallow` impide el
 * rastreo, y una página que no se rastrea nunca entrega su etiqueta `noindex`
 * al crawler — si alguien la enlaza, Google puede indexar la URL igual, sin
 * título ni descripción, y ya no hay forma de sacarla porque no puede leer la
 * instrucción que se lo pide. `noindex` solo funciona si la página es
 * rastreable. El bloqueo lo hace la metadata de la página; robots.txt se queda
 * fuera del asunto.
 *
 * `sitemap` y `host` salen de `NEXT_PUBLIC_SITE_URL`: tiene que ser el dominio
 * que Vercel sirve sin redirigir (hoy el apex).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: siteUrl,
  };
}
