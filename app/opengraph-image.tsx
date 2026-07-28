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

/**
 * Paleta. Una imagen no puede tener dos modos, así que esta usa **siempre la
 * nocturna** — es la más distintiva de las dos y se ve bien sobre los fondos
 * claros de LinkedIn y WhatsApp, donde el preview aparece recortado.
 *
 * Estos valores están copiados de los tokens de `app/globals.css`, no
 * importados: este archivo se ejecuta en build fuera del pipeline de Tailwind
 * y no puede leer variables CSS. **Si cambia la paleta, hay que cambiarlos a
 * mano acá también** — es la clase de dato duplicado que envejece en silencio.
 */
const FONDO = "#101733";
const BRAND = "#8dd5ca";
const ROSA = "#dcaaa8";
const MALVA = "#b98ec4";
const TEXTO = "#e9e7f4";
const MUTED = "#a7adcb";
const SUBTLE = "#9098bb";
const DEGRADADO = `linear-gradient(90deg, ${BRAND}, ${ROSA} 55%, ${MALVA})`;

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
          backgroundColor: FONDO,
          color: TEXTO,
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
            <span style={{ color: TEXTO }}>{site.logotipo}</span>
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
            borderTop: "1px solid rgba(233, 231, 244, 0.10)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex" }}>
            AWS · Pipelines · Governance · BI · FinOps
          </div>
          <div style={{ display: "flex", color: BRAND }}>{dominio}</div>
        </div>

        {/* Franja degradada al pie: menta → rosa → malva, el cielo de la paleta. */}
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
