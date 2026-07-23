import { ImageResponse } from "next/og";

import { site, siteUrl } from "@/content/site";

/**
 * Imagen Open Graph de la home (la que se ve al compartir el link en
 * LinkedIn, WhatsApp, Slack o X). Next la genera en build y la cablea sola:
 * agrega `og:image` y `twitter:image` al `<head>` sin que el layout haga nada.
 *
 * Ojo con el CSS: `ImageResponse` renderiza con Satori, que soporta un
 * subconjunto de CSS. Flexbox sí, grid no; todo elemento con más de un hijo
 * necesita `display: flex` explícito. Por eso el markup de abajo es verboso.
 */

export const alt = `${site.nombre} — ${site.rol}. ${site.descripcionCorta}`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

/** Paleta, alineada con los tokens de `app/globals.css`. */
const INK = "#0a0a0f";
const BRAND = "#818cf8";
const EMERALD = "#34d399";
const MUTED = "#a1a1aa";
const SUBTLE = "#8f8f9a";
const DEGRADADO = `linear-gradient(90deg, ${BRAND}, ${EMERALD})`;

export default function Image() {
  const dominio = new URL(siteUrl).host;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: INK,
          color: "#ffffff",
          padding: "72px 80px",
        }}
      >
        {/* Cabecera: marca a la izquierda, ciudad a la derecha. */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
          }}
        >
          <div style={{ display: "flex", fontWeight: 600 }}>
            <span style={{ color: "#ffffff" }}>{site.logotipo}</span>
            <span style={{ color: BRAND }}>.</span>
          </div>
          <div style={{ display: "flex", color: MUTED }}>{site.ciudad}</div>
        </div>

        {/* Bloque principal: nombre, rol con acento y descripción corta. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {site.nombre}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 72,
                height: 8,
                borderRadius: 999,
                backgroundImage: DEGRADADO,
                marginRight: 24,
              }}
            />
            <div style={{ display: "flex", fontSize: 42, color: BRAND, fontWeight: 600 }}>
              {site.rol}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: MUTED,
              marginTop: 32,
              maxWidth: 880,
              lineHeight: 1.4,
            }}
          >
            {site.descripcionCorta}
          </div>
        </div>

        {/* Pie: capacidades y dominio. */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: SUBTLE,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex" }}>
            AWS · Pipelines · Governance · BI · FinOps
          </div>
          <div style={{ display: "flex", color: EMERALD }}>{dominio}</div>
        </div>

        {/* Franja degradada al pie, el acento indigo → emerald del sitio. */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            display: "flex",
            width: "100%",
            height: 10,
            backgroundImage: DEGRADADO,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
