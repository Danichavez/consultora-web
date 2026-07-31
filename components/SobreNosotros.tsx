import { nosotros } from "@/content/nosotros";
import { site } from "@/content/site";

/**
 * Sección 7 — "Quiénes somos".
 *
 * Copy en voz plural y por rol (sin nombres propios): es la narrativa aprobada
 * y vive completa en `content/nosotros.ts`. Acá solo se recorre.
 *
 * Server Component.
 */
export default function SobreNosotros() {
  return (
    <section id="nosotros" className="py-20 sm:py-24 px-6 border-t border-line">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-muted uppercase tracking-wider mb-4">
          Nosotros
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8 tracking-tight">
          {nosotros.titulo}
        </h2>

        {/* Medida de lectura acotada: párrafos de ~70 caracteres por línea. */}
        <div className="max-w-2xl space-y-4">
          {nosotros.parrafos.map((parrafo) => (
            <p key={parrafo} className="text-muted leading-relaxed">
              {parrafo}
            </p>
          ))}
        </div>

        {/*
         * Credenciales como badges en `font-mono`: el mismo recurso tipográfico
         * de los numeradores del proceso, que es de donde sale el sabor
         * "terminal" sin repintar nada de ámbar.
         */}
        <ul className="flex flex-wrap gap-2 mt-8">
          {nosotros.credenciales.map((credencial) => (
            <li
              key={credencial}
              className="font-mono text-xs text-subtle border border-line rounded-md px-3 py-1.5 bg-panel"
            >
              {credencial}
            </li>
          ))}
        </ul>

        {/*
         * Links externos: `target="_blank"` obliga a `rel="noopener
         * noreferrer"` — sin `noopener` la pestaña abierta puede manipular a la
         * que la abrió vía `window.opener`. El `sr-only` avisa del cambio de
         * pestaña, que si no es un salto sin aviso para quien no ve la ventana.
         */}
        <div className="flex flex-wrap gap-6 mt-8">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-fg transition"
          >
            LinkedIn
            <span className="sr-only"> (abre en una pestaña nueva)</span>
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-fg transition"
          >
            GitHub
            <span className="sr-only"> (abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
