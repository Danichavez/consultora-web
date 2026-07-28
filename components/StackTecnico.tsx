import { stack } from "@/content/stack";

/**
 * Franja compacta con las tecnologías del stack. Sin encabezado: es una tira
 * de nombres centrada entre el portafolio y el contacto.
 */
export default function StackTecnico() {
  return (
    <section className="py-16 px-6 border-t border-line">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted">
          {stack.map((tecnologia) => (
            <span key={tecnologia}>{tecnologia}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
