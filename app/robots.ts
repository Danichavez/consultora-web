import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";

/**
 * Genera `/robots.txt`. El sitio es una landing pública: se permite todo y se
 * apunta al sitemap con URL absoluta (los crawlers ignoran una relativa).
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
