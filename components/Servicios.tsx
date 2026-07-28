import { servicios, type NivelInversion } from "@/content/servicios";

/**
 * Texto visible de cada nivel de inversión. El sitio comunica magnitud, no
 * cifras: el monto se conversa en la llamada. Escrito acá y no en los datos
 * para que el copy se ajuste sin tocar el catálogo.
 */
const etiquetaInversion: Record<NivelInversion, string> = {
  acotada: "Inversión acotada",
  media: "Inversión media",
  alta: "Inversión alta",
};

/**
 * Sección "Servicios": grilla de servicios estándar + tarjeta ancha destacada.
 * Los datos vienen de `content/servicios.ts`; el markup no contiene copy.
 */
export default function Servicios() {
  const grilla = servicios.filter((servicio) => !servicio.destacado);
  const destacados = servicios.filter((servicio) => servicio.destacado);

  return (
    <section id="servicios" className="py-24 px-6 border-t border-line">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-muted uppercase tracking-wider mb-4">
          Servicios
        </p>
        <h2 className="text-2xl font-semibold mb-12">
          De diagnóstico a implementación completa.
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {grilla.map((servicio) => (
            <div
              key={servicio.slug}
              className="bg-panel border border-line rounded-xl p-6 hover:border-brand-500/30 transition group"
            >
              <h3 className="font-semibold mb-2 group-hover:text-brand-500 transition">
                {servicio.nombre}
              </h3>
              <p className="text-sm text-muted mb-4">
                {servicio.descripcion}
              </p>
              <div className="flex justify-between gap-3 text-xs text-muted">
                <span>{servicio.plazo}</span>
                {/* El acento cálido distingue la inversión del plazo sin
                    necesidad de otro rótulo. */}
                <span className="text-warmth">
                  {etiquetaInversion[servicio.inversion]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {destacados.map((servicio) => (
          <div
            key={servicio.slug}
            className="mt-5 bg-brand-500/[0.05] border border-brand-500/20 rounded-xl p-6 hover:border-brand-500/40 transition"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-brand-500 mb-1">
                  {servicio.nombre}
                </h3>
                <p className="text-sm text-muted">{servicio.descripcion}</p>
              </div>
              <div className="text-right text-sm text-muted whitespace-nowrap">
                <p>{servicio.plazo}</p>
                <p className="text-warmth">
                  {etiquetaInversion[servicio.inversion]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
