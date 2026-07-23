import { repos } from "@/content/repos";

/**
 * Sección "Proyectos": grilla de tarjetas-link a los repos públicos de GitHub.
 * El `id="trabajo"` es el ancla a la que apunta el nav — no cambiarlo.
 */
export default function Portafolio() {
  return (
    <section id="trabajo" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-muted uppercase tracking-wider mb-4">
          Proyectos
        </p>
        <h2 className="text-2xl font-semibold mb-4">Código real en GitHub.</h2>
        <p className="text-muted mb-12">
          Proyectos públicos con documentación, tests, CI/CD y diagramas de
          arquitectura.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo) => (
            <a
              key={repo.url}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:border-brand-500/30 transition block group"
            >
              <h3 className="font-medium mb-1 group-hover:text-brand-400 transition">
                {repo.nombre}
                <span className="sr-only"> (abre en una pestaña nueva)</span>
              </h3>
              <p className="text-sm text-muted mb-3">{repo.descripcion}</p>
              <p className="text-xs text-subtle">{repo.stack}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
