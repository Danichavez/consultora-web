import ContactoForm from "@/components/ContactoForm";
import { site } from "@/content/site";

/**
 * Sección "Contacto": el objetivo del sitio entero. Reemplaza el `mailto:`
 * suelto de la maqueta por un formulario real, conservando el lenguaje visual.
 *
 * Server Component: solo el formulario (interactivo) es cliente.
 */
export default function Contacto() {
  const tieneCalendly = site.calendly.trim() !== "";

  return (
    <section id="contacto" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tienes datos sin explotar?</h2>
          <p className="text-muted mb-10">
            30 minutos para entender tu contexto y ver si podemos ayudar. Sin
            compromiso.
          </p>

          <ContactoForm />

          <div className="mt-10">
            <p className="text-sm text-muted mb-4">
              {tieneCalendly
                ? "¿Prefieres hablarlo en vivo?"
                : "¿Prefieres escribirnos directo?"}
            </p>

            {tieneCalendly ? (
              <a
                href={site.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-black px-8 py-4 rounded-lg font-medium hover:bg-zinc-200 transition text-lg"
              >
                Agendar 30 min →
                <span className="sr-only"> (abre en una pestaña nueva)</span>
              </a>
            ) : (
              <a
                href={`mailto:${site.email}`}
                className="inline-block bg-white text-black px-8 py-4 rounded-lg font-medium hover:bg-zinc-200 transition text-lg"
              >
                {site.email}
              </a>
            )}
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-white transition"
            >
              LinkedIn
              <span className="sr-only"> (abre en una pestaña nueva)</span>
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-white transition"
            >
              GitHub
              <span className="sr-only"> (abre en una pestaña nueva)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
