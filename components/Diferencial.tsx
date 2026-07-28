import { diferenciales, type Diferencial as DiferencialItem } from "@/content/diferenciales";

/**
 * Paths de los íconos decorativos, portados tal cual de la maqueta.
 */
const ICONO_PATH: Record<DiferencialItem["icono"], string> = {
  codigo: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  candado:
    "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z",
  escudo:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  rayo: "M13 10V3L4 14h7v7l9-11h-7z",
};

/**
 * Clases completas por acento (fondo del recuadro + color del SVG).
 * Escritas literalmente para que Tailwind las detecte en build.
 *
 * Los cuatro acentos son tokens que cada tema resuelve distinto, así que esta
 * tabla no cambia al cambiar de modo. Agregar un valor al union de
 * `content/diferenciales.ts` rompe el build acá, que es lo que queremos:
 * mejor un error que un ícono sin color.
 */
const ACENTO_RECUADRO: Record<DiferencialItem["acento"], string> = {
  marca: "bg-brand-500/10",
  calido: "bg-warmth/10",
  agua: "bg-water/10",
  alterno: "bg-alt/10",
};

const ACENTO_ICONO: Record<DiferencialItem["acento"], string> = {
  marca: "text-brand-500",
  calido: "text-warmth",
  agua: "text-water",
  alterno: "text-alt",
};

/**
 * Sección "Diferencial": 4 columnas con ícono, de `content/diferenciales.ts`.
 */
export default function Diferencial() {
  return (
    <section className="py-24 px-6 border-t border-line gradient-border">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-muted uppercase tracking-wider mb-4">
          Diferencial
        </p>
        <h2 className="text-2xl font-semibold mb-12">
          Calidad de consultora. Velocidad de startup.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {diferenciales.map((diferencial) => (
            <div key={diferencial.titulo}>
              <div
                className={`w-10 h-10 rounded-lg ${ACENTO_RECUADRO[diferencial.acento]} flex items-center justify-center mb-4`}
              >
                <svg
                  className={`w-5 h-5 ${ACENTO_ICONO[diferencial.acento]}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={ICONO_PATH[diferencial.icono]}
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">{diferencial.titulo}</h3>
              <p className="text-sm text-muted">{diferencial.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
