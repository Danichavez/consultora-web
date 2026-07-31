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
  "ArqData",
  "arquitectura de datos",
  "automatización de procesos de datos",
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
 * - `title` y `description` salen de `content/site.ts`, nunca se escriben acá:
 *   el cambio de marca a "ArqData" se propagó solo por eso.
 * - `metadataBase` viene de `siteUrl` (env var `NEXT_PUBLIC_SITE_URL`), que
 *   tiene que ser el dominio que Vercel sirve **sin redirigir** (hoy el apex;
 *   `www` va con 308 hacia él). De ahí salen canonical, `og:url`, el sitemap y
 *   robots: si apunta a un dominio que redirige, el 100% de las canónicas que
 *   publicamos son un 308. `arqdata.cl` todavía no está comprado — cuando lo
 *   esté, se cambia la env var, no este archivo.
 * - `openGraph.images` / `twitter.images` se omiten **a propósito**: los llena
 *   la convención de archivo `app/opengraph-image.tsx`. Definirlos a mano acá
 *   pisa la imagen generada.
 * - `title.template` aplica a las páginas hijas (hoy `/thank-you`), que solo
 *   tienen que exportar su `title`.
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
 * `@id`: la organización, el servicio profesional y el sitio. Google entiende
 * mejor un grafo con referencias que tres bloques sueltos y duplicados.
 *
 * ⚠️ El nodo raíz es `Organization`, no `Person` (decisión de marca 2026-07-31).
 * Es la contrapartida obligatoria de que la marca visible pasara de "Daniela
 * Chávez" a "ArqData": un `Person` que se llama "ArqData" es structured data
 * incorrecto — declara que una consultora es un ser humano, y arrastra
 * propiedades que no le corresponden (`jobTitle`, `knowsAbout` de persona).
 * Si algún día vuelve a haber una persona nombrada en el sitio, se agrega un
 * nodo `Person` aparte enlazado por `founder`, no se revierte éste.
 *
 * El catálogo de ofertas se genera desde `content/servicios.ts`: agregar un
 * servicio ahí lo agrega también acá, sin tocar este archivo. **Ese archivo no
 * se borra aunque la página ya no muestre los servicios** — este `OfferCatalog`
 * y toda la Fase 2 se derivan de él.
 */
export const jsonLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organizacion`,
      name: site.nombre,
      /*
       * Sin `legalName`: "ArqData" es la marca, no la razón social, y todavía no
       * sabemos cuál es la entidad legal. Declarar una que no existe es peor que
       * omitir la propiedad.
       */
      description: site.descripcionCorta,
      email: `mailto:${site.email}`,
      url: siteUrl,
      image: `${siteUrl}/opengraph-image`,
      /**
       * Único raster que sirve el sitio (la OG se genera por código y `public/`
       * está vacío). No es un isotipo, pero contiene el logotipo y es válido;
       * un SVG acá no sirve, Google pide raster para `logo`.
       */
      logo: `${siteUrl}/opengraph-image`,
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
      /*
       * Sin `priceRange`. Sobrevivió a la purga de precios del 2026-07-27
       * —que sacó `priceSpecification` del `OfferCatalog`— porque `"$$$"` no es
       * una cifra, pero es exactamente la misma clase de dato: una señal de
       * precio en structured data público, que Google puede mostrar en
       * resultados enriquecidos. La decisión comercial es que el monto se
       * conversa en la llamada, y eso no distingue entre un número y tres
       * signos peso. Reponerlo es una línea, si alguna vez se decide al revés.
       */
      parentOrganization: { "@id": `${siteUrl}/#organizacion` },
      provider: { "@id": `${siteUrl}/#organizacion` },
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
          // Sin `price` ni `priceSpecification` a propósito: por decisión
          // comercial el sitio no publica cifras. Dejarlas acá las seguiría
          // exponiendo —el JSON-LD es público y Google lo lee— aunque no se
          // vean en la página, que es justo lo que se quiso evitar.
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
      publisher: { "@id": `${siteUrl}/#organizacion` },
    },
  ],
};
