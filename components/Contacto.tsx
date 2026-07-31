import ContactoForm from "@/components/ContactoForm";
import { contacto } from "@/content/contacto";

/**
 * Sección "Contacto": el destino de todos los CTA de la página y su único
 * objetivo real.
 *
 * Server Component: solo el formulario (interactivo) es cliente.
 *
 * Acá NO hay ni botón de Calendly ni links a redes, a diferencia de la versión
 * anterior. Son dos decisiones de la spec:
 *   - §5: un solo CTA. Un botón "Agendar" al lado del formulario compite con el
 *     submit y deja a la persona eligiendo entre dos caminos en el momento en
 *     que menos hay que hacerla pensar.
 *   - §8: la agenda aparece DESPUÉS de enviar, dentro del estado de éxito del
 *     formulario, cuando el lead ya está capturado. Si Calendly estuviera
 *     antes, quien agenda y no envía no deja ningún dato.
 *
 * El `id` lo usan los CTA del nav, el hero y el caso real. `scroll-margin-top`
 * ya está resuelto en `globals.css` para que el nav sticky no tape el titular.
 */
export default function Contacto() {
  return (
    <section id="contacto" className="py-24 px-6 border-t border-line">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-fg mb-4">
            {contacto.titulo}
          </h2>
          <p className="text-muted">{contacto.bajada}</p>
        </div>

        <ContactoForm />
      </div>
    </section>
  );
}
