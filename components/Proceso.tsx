import { proceso, tituloProceso } from "@/content/proceso";

/**
 * Sección 6 — "Cómo funciona": los tres pasos de `content/proceso.ts`.
 *
 * Es una lista **ordenada** (`<ol>`) y no un grid de `div`: el orden es el
 * contenido. Quien navega con lector de pantalla escucha "1 de 3" aunque no vea
 * el numerador grande.
 *
 * Server Component: solo datos y markup.
 */
export default function Proceso() {
  return (
    <section id="proceso" className="py-20 sm:py-24 px-6 border-t border-line">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-muted uppercase tracking-wider mb-4">
          Proceso
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-12 tracking-tight">
          {tituloProceso}
        </h2>

        {/* Vertical en móvil, tres columnas en desktop. */}
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {proceso.map((paso) => (
            <li key={paso.numero}>
              <div className="flex items-center gap-4 mb-4">
                {/*
                 * El numerador en `font-mono` con el cero a la izquierda es lo
                 * que sostiene el carácter "terminal" del tema. Va en `text-fg`
                 * y no en el ámbar: el CTA es el elemento de mayor contraste de
                 * la página y nada más puede competir con él.
                 */}
                <span className="font-mono text-4xl sm:text-5xl leading-none tabular-nums text-fg">
                  {paso.numero}
                </span>
                {/*
                 * Conector decorativo. Es una regla, no una flecha: no implica
                 * un paso siguiente, así que también se dibuja en el tercero sin
                 * mentir. `aria-hidden` porque el orden ya lo da el `<ol>`.
                 */}
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-line-strong/40"
                />
              </div>

              <h3 className="font-semibold mb-2">{paso.titulo}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {paso.descripcion}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
