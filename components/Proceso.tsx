import { proceso, type Paso } from "@/content/proceso";

/**
 * Clases completas por acento: Tailwind sólo detecta clases escritas
 * literalmente en el código, nunca concatenadas en runtime.
 */
const ACENTO_CIRCULO: Record<Paso["acento"], string> = {
  marca: "bg-brand-500/20 text-brand-500",
  alterno: "bg-alt/20 text-alt",
};

/**
 * Sección "Proceso": los 5 pasos de `content/proceso.ts`.
 */
export default function Proceso() {
  return (
    <section id="proceso" className="py-24 px-6 border-t border-line">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-muted uppercase tracking-wider mb-4">
          Proceso
        </p>
        <h2 className="text-2xl font-semibold mb-16">
          De conversación a producción en semanas.
        </h2>

        <div className="grid md:grid-cols-5 gap-8">
          {proceso.map((paso) => (
            <div key={paso.numero}>
              <div
                className={`w-8 h-8 rounded-full ${ACENTO_CIRCULO[paso.acento]} flex items-center justify-center text-sm font-bold mb-4`}
              >
                {paso.numero}
              </div>
              <h3 className="text-sm font-medium mb-1">{paso.titulo}</h3>
              <p className="text-xs text-muted">{paso.detalle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
