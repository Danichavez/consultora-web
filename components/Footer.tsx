import { site } from "@/content/site";

/**
 * Sección 9 — Footer.
 *
 * Sin links de navegación interna a propósito: la landing no tiene navegación y
 * cualquier link que saque a la persona de la página compite con el único CTA.
 * Lo que queda es identidad, contacto y el link legal.
 *
 * Ojo con el año: la home se prerenderiza estáticamente, así que
 * `new Date().getFullYear()` se evalúa **una sola vez, en el build**, y queda
 * congelado en el HTML. Cada 1 de enero el copyright muestra el año anterior
 * hasta el siguiente deploy. Se asume ese desfase; si algún día molesta, la
 * salida es renderizar el año en el cliente o forzar la ruta a dinámica.
 */
export default function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-subtle">
          {/*
           * Línea de marca compuesta desde `content/site.ts`: el nombre y el rol
           * salen de ahí para que cambiar la marca sea un cambio de datos. Solo
           * el país queda literal — `site.ciudad` es "Santiago, Chile" y acá el
           * alcance que se comunica es el país, no la oficina.
           */}
          <p className="text-fg">
            {site.nombre} · {site.rol} · Chile
          </p>
          <p className="mt-1">© {anio} {site.nombre}</p>
        </div>

        <nav
          aria-label="Enlaces del pie de página"
          className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
        >
          <a
            href={`mailto:${site.email}`}
            className="text-muted hover:text-fg transition"
          >
            {site.email}
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-fg transition"
          >
            LinkedIn
            <span className="sr-only"> (abre en una pestaña nueva)</span>
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-fg transition"
          >
            GitHub
            <span className="sr-only"> (abre en una pestaña nueva)</span>
          </a>
          {/*
           * El formulario recolecta datos personales y GA4 corre en la página:
           * la Ley 21.719 (vigente desde diciembre de 2026) pide decir qué se
           * hace con ellos. ⚠️ `/privacidad` TODAVÍA NO EXISTE como página —
           * este link da 404 hasta que alguien la cree.
           */}
          <a href="/privacidad" className="text-muted hover:text-fg transition">
            Privacidad
          </a>
        </nav>
      </div>
    </footer>
  );
}
