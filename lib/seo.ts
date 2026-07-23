/**
 * Metadata SEO y structured data del sitio.
 *
 * Fuente de verdad: `content/site.ts` y `content/servicios.ts`. Acá no se
 * reescribe copy — todo se deriva de esos contratos para que un cambio de
 * texto no haya que replicarlo en dos lados.
 *
 * Consumo desde `app/layout.tsx`:
 *   import { metadata } from "@/lib/seo";      // re-exportar tal cual
 *   import JsonLd from "@/components/JsonLd";  // render dentro de <body>
 */

import type { Metadata } from "next";

import { servicios } from "@/content/servicios";
import { site, siteUrl } from "@/content/site";

/** "Santiago, Chile" → "Santiago". Evita repetir la ciudad a mano. */
const ciudad = site.ciudad.split(",")[0].trim();

/**
 * Palabras clave del rubro. No reemplazan al contenido (Google las ignora
 * casi por completo) pero sí las leen otros crawlers y agregadores.
 */
export const keywords = [
  "arquitectura de datos",
  "data architect Chile",
  "consultoría de datos",
  "AWS",
  "pipelines de datos",
  "ETL",
  "ELT",
  "data governance",
  "business intelligence",
  "FinOps",
  "data engineering",
  "Redshift",
  "dbt",
  "Airflow",
  "IA agéntica",
  "Santiago de Chile",
];

/**
 * Metadata raíz. `app/layout.tsx` la re-exporta sin modificarla.
 *
 * Notas:
 * - `metadataBase` viene de `siteUrl` (env var `NEXT_PUBLIC_SITE_URL`): el
 *   dominio definitivo todavía no está decidido, nada se hardcodea acá.
 * - `openGraph.images` / `twitter.images` se omiten a propósito: los llena
 *   automáticamente la convención de archivo `app/opengraph-image.tsx`.
 * - `title.template` queda listo para las páginas futuras del blog, que solo
 *   tendrán que exportar `title: "Mi post"`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.titulo,
    template: `%s · ${site.nombre}`,
  },
  description: site.descripcion,
  applicationName: site.nombre,
  authors: [{ name: site.nombre, url: siteUrl }],
  creator: site.nombre,
  publisher: site.nombre,
  keywords,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: siteUrl,
    siteName: `${site.nombre} — ${site.rol}`,
    title: site.titulo,
    description: site.descripcion,
  },
  twitter: {
    card: "summary_large_image",
    title: site.titulo,
    description: site.descripcionCorta,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/**
 * Structured data (schema.org) en un `@graph` con tres nodos enlazados por
 * `@id`: la persona, el servicio profesional y el sitio. Google entiende
 * mejor un grafo con referencias que tres bloques sueltos y duplicados.
 *
 * El catálogo de ofertas se genera desde `content/servicios.ts`: agregar un
 * servicio ahí lo agrega también acá, sin tocar este archivo.
 */
export const jsonLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#persona`,
      name: site.nombre,
      jobTitle: site.rol,
      description: site.descripcionCorta,
      email: `mailto:${site.email}`,
      url: `${siteUrl}/`,
      image: `${siteUrl}/opengraph-image`,
      address: {
        "@type": "PostalAddress",
        addressLocality: ciudad,
        addressCountry: "CL",
      },
      knowsAbout: keywords,
      sameAs: [site.linkedin, site.github],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#negocio`,
      name: `${site.nombre} — ${site.rol}`,
      description: site.descripcion,
      url: `${siteUrl}/`,
      email: `mailto:${site.email}`,
      image: `${siteUrl}/opengraph-image`,
      priceRange: "$$$",
      founder: { "@id": `${siteUrl}/#persona` },
      provider: { "@id": `${siteUrl}/#persona` },
      availableLanguage: ["es", "en"],
      address: {
        "@type": "PostalAddress",
        addressLocality: ciudad,
        addressCountry: "CL",
      },
      areaServed: {
        "@type": "Country",
        name: "Chile",
      },
      sameAs: [site.linkedin, site.github],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios de arquitectura de datos",
        itemListElement: servicios.map((servicio, indice) => ({
          "@type": "Offer",
          "@id": `${siteUrl}/#servicio-${servicio.slug}`,
          position: indice + 1,
          priceCurrency: "CLP",
          // Los precios son rangos referenciales, no un monto cerrado: van
          // como texto en la especificación, no como `price`.
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "CLP",
            description: servicio.precio,
          },
          itemOffered: {
            "@type": "Service",
            name: servicio.nombre,
            description: servicio.descripcion,
            serviceType: servicio.nombre,
            provider: { "@id": `${siteUrl}/#negocio` },
            areaServed: { "@type": "Country", name: "Chile" },
          },
          eligibleDuration: {
            "@type": "QuantitativeValue",
            description: servicio.plazo,
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: site.titulo,
      description: site.descripcion,
      inLanguage: site.lang,
      publisher: { "@id": `${siteUrl}/#persona` },
    },
  ],
};
