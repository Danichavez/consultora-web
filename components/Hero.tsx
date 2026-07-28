import { hero } from "@/content/hero";

/**
 * Hero de la portada: badge de disponibilidad, titular con degradado y
 * los dos CTA (agendar llamada / ver proyectos).
 * El copy vive en `content/hero.ts`.
 */
export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-6 pt-24 pb-16">
      <div className="max-w-6xl mx-auto w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-8">
            <span
              className="w-1.5 h-1.5 rounded-full bg-exito animate-pulse"
              aria-hidden="true"
            />
            {hero.disponibilidad}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
            {hero.titulo}
            <br />
            <span className="text-gradient">{hero.tituloDestacado}</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted max-w-2xl mb-10 leading-relaxed">
            {hero.bajada}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contacto"
              className="bg-btn text-btn-fg px-6 py-3.5 rounded-lg font-medium hover:opacity-90 transition text-center"
            >
              {hero.ctaPrincipal} <span aria-hidden="true">→</span>
            </a>
            <a
              href="#trabajo"
              // `line-strong` existe para esto: un borde que identifica al
              // control y llega al mínimo de 3:1 en los dos temas. El
              // `border-zinc-500` que había acá solo funcionaba sobre oscuro.
              className="border border-line-strong px-6 py-3.5 rounded-lg font-medium hover:border-fg hover:bg-warm transition text-center"
            >
              {hero.ctaSecundario}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
