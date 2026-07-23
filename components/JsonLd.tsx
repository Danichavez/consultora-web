import { jsonLd } from "@/lib/seo";

interface JsonLdProps {
  /** Grafo a inyectar. Por defecto, el del sitio (`lib/seo.ts`). */
  data?: Record<string, unknown>;
}

/**
 * Inyecta el structured data schema.org como `<script type="application/ld+json">`.
 *
 * Server Component: se renderiza en el HTML inicial, que es lo que lee el
 * crawler. Se puede montar en cualquier parte de `<body>`.
 *
 * Seguridad: el JSON se serializa y todo signo "menor que" se escapa como la
 * secuencia unicode `\\u003c`, para que un texto del contenido que contenga un
 * cierre de script no termine la etiqueta antes de tiempo (inyección de
 * markup). La secuencia sigue siendo JSON válido y el parser la interpreta
 * como el carácter original.
 */
export default function JsonLd({ data = jsonLd }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
