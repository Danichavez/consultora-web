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
 * Paleta. Una imagen no puede tener dos modos, así que esta usa **siempre el
 * terminal oscuro** — es el más distintivo de los dos y se recorta bien sobre
 * los fondos claros de LinkedIn y WhatsApp, donde el preview aparece embebido.
 *
 * ⚠️ Estos valores son una **copia a mano** de los tokens `--term-*` de
 * `app/globals.css`, no un import: este archivo se ejecuta en build fuera del
 * pipeline de Tailwind y no puede leer variables CSS. **Si cambia la paleta hay
 * que cambiarlos también acá** — es la clase de dato duplicado que envejece en
 * silencio, y ya pasó: el rediseño a terminal amber encontró esta imagen todavía
 * pintada con la paleta anterior (navy y menta).
 */
const FONDO = "#0b0b0c"; // --term-base
const BRAND = "#ffb224"; // --term-brand-500 (ámbar de fósforo) — 10.9:1 sobre el fondo
const BRAND_CLARO = "#ffc85c"; // --term-brand-400 — 12.8:1
const BRAND_OSCURO = "#e8981a"; // --term-brand-600 — 8.4:1
const WARMTH = "#e0a06a"; // --term-warmth — 8.8:1
const TEXTO = "#ececed"; // --term-fg — 16.7:1
const MUTED = "#a5a29c"; // --term-muted — 7.7:1
const SUBTLE = "#8a857c"; // --term-subtle — 5.4:1
const LINEA = "#26262a"; // --term-line

/**
 * Mismo barrido que `.text-gradient` en `globals.css` (brand → warmth → brand
 * oscuro), para que la imagen y el titular del sitio se lean como la misma
 * marca. Acá va como fondo de una franja, nunca como `background-clip: text`:
 * eso es frágil en Satori.
 */
const DEGRADADO = `linear-gradient(90deg, ${BRAND_CLARO}, ${WARMTH} 55%, ${BRAND_OSCURO})`;

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
          <div style={{ display: "flex", alignItems: "center", fontWeight: 600 }}>
            <span style={{ color: BRAND }}>~$</span>
            <span style={{ color: TEXTO, marginLeft: 12 }}>{site.logotipo}</span>
            {/*
              El cursor va dibujado como un rectángulo, no como un carácter de
              bloque (`▍`): Satori usa su fuente por defecto y un glifo que esa
              fuente no tenga se renderiza como tofu. Un div siempre existe.
            */}
            <div
              style={{
                display: "flex",
                width: 13,
                height: 26,
                backgroundColor: BRAND,
                marginLeft: 8,
              }}
            />
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
            borderTop: `1px solid ${LINEA}`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex" }}>
            AWS · Pipelines · Governance · BI · FinOps
          </div>
          <div style={{ display: "flex", color: BRAND }}>{dominio}</div>
        </div>

        {/* Franja degradada al pie: el barrido de ámbar de la rampa `brand`. */}
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
