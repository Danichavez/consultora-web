import { hero } from "@/content/hero";

/**
 * Hero de la portada: badge de disponibilidad, titular con degradado y
 * los dos CTA (agendar llamada / ver caso de estudio).
 * El copy vive en `content/hero.ts`.
 */
export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-6 pt-24 pb-16">
      <div className="max-w-6xl mx-auto w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-8">
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
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
              className="bg-white text-black px-6 py-3.5 rounded-lg font-medium hover:bg-zinc-200 transition text-center"
            >
              {hero.ctaPrincipal} <span aria-hidden="true">→</span>
            </a>
            <a
              href="#caso"
              // La maqueta usaba zinc-700 (1.9:1 sobre el fondo): el borde que
              // identifica al botón quedaba casi invisible. zinc-500 da 4.3:1 y
              // cumple el mínimo de 3:1 para componentes no textuales.
              className="border border-zinc-500 px-6 py-3.5 rounded-lg font-medium hover:border-zinc-400 hover:bg-white/5 transition text-center"
            >
              {hero.ctaSecundario}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
