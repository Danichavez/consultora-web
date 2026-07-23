import { problemas, soluciones } from "@/content/diferenciales";

/**
 * Sección problema / solución en dos columnas.
 * Los ✗ y ✓ son decorativos: el texto del item ya comunica el sentido.
 */
export default function ProblemaSolucion() {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-sm text-muted uppercase tracking-wider mb-4">El problema</p>
            <h2 className="text-2xl font-semibold mb-6">
              Tu empresa tiene datos, pero no puede usarlos.
            </h2>
            <ul className="space-y-4 text-muted">
              {problemas.map((problema) => (
                <li key={problema} className="flex gap-3">
                  <span className="text-red-400 mt-1" aria-hidden="true">
                    ✗
                  </span>{" "}
                  {problema}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm text-muted uppercase tracking-wider mb-4">La solución</p>
            <h2 className="text-2xl font-semibold mb-6">
              Una arquitecta senior que implementa, no solo asesora.
            </h2>
            <ul className="space-y-4 text-muted">
              {soluciones.map((solucion) => (
                <li key={solucion} className="flex gap-3">
                  <span className="text-emerald-400 mt-1" aria-hidden="true">
                    ✓
                  </span>{" "}
                  {solucion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
