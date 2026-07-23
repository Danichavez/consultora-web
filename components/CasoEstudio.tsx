import { caso, type Metrica } from "@/content/caso";

/**
 * Clases completas por acento: Tailwind sólo detecta clases escritas
 * literalmente en el código, nunca concatenadas en runtime.
 */
const ACENTO_METRICA: Record<Metrica["acento"], string> = {
  brand: "text-brand-400",
  emerald: "text-emerald-400",
  amber: "text-amber-400",
  purple: "text-purple-400",
};

/**
 * Caso de estudio destacado con la grilla de métricas.
 * Los datos vienen de `content/caso.ts` — nada hardcodeado en el markup.
 */
export default function CasoEstudio() {
  return (
    <section id="caso" className="py-24 px-6 border-t border-white/5 gradient-border">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-muted uppercase tracking-wider mb-4">Caso de estudio</p>
        <h2 className="text-2xl font-semibold mb-2">{caso.titulo}</h2>
        <p className="text-muted mb-12">{caso.contexto}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {caso.metricas.map((metrica) => (
            <div
              key={metrica.etiqueta}
              className="bg-white/[0.03] border border-white/5 rounded-xl p-6"
            >
              <p className={`text-3xl font-bold ${ACENTO_METRICA[metrica.acento]} mb-1`}>
                {metrica.valor}
              </p>
              <p className="text-sm text-muted">{metrica.etiqueta}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted mt-8">{caso.detalle}</p>
      </div>
    </section>
  );
}
