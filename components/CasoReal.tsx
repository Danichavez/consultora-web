import { caso } from "@/content/caso";
import { cta } from "@/content/site";

/**
 * Los tres bloques de la narrativa, en orden: qué pidieron, qué encontramos,
 * qué entregamos. Se arma acá y no en `content/caso.ts` porque es una decisión
 * de presentación (el orden de lectura), no un dato.
 */
const BLOQUES: ReadonlyArray<{ etiqueta: string; texto: string }> = [
  caso.pedido,
  caso.hallazgo,
  caso.entrega,
];

/**
 * Caso real — la única prueba cuantificada del sitio.
 *
 * Dos columnas en desktop (relato a la izquierda, cifras a la derecha) que se
 * apilan en móvil: primero el relato, después los números, que es el orden en
 * que convencen.
 *
 * El cliente va anonimizado y las cifras son métricas de resultado, nunca
 * precios: las dos reglas están documentadas en `content/caso.ts` y no se
 * cambian desde este componente.
 */
export default function CasoReal() {
  return (
    <section id="caso" className="py-24 px-6 border-t border-line">
      <div className="max-w-6xl mx-auto">
        {/*
          `gradient-border` es el resplandor de fósforo del tema: en claro un
          lavado cálido de papel, en oscuro la luz del ámbar sobre el negro. Es
          lo que despega este bloque del resto de la página sin necesidad de
          otro botón que compita con el CTA.
        */}
        <div className="gradient-border border border-line rounded-2xl p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-fg mb-10">
            {caso.titulo}
          </h2>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-8">
              {BLOQUES.map((bloque) => (
                <div
                  key={bloque.etiqueta}
                  className="border-l-2 border-line-strong pl-5"
                >
                  <p className="font-mono text-xs uppercase tracking-wider text-brand-500 mb-2">
                    {bloque.etiqueta}
                  </p>
                  <p className="text-muted leading-relaxed">{bloque.texto}</p>
                </div>
              ))}
            </div>

            {/*
              Stat cards: el valor en `font-mono` y grande, la etiqueta debajo en
              tono secundario. El mono no es decorativo acá — alinea los dígitos
              y es donde el tema "terminal" tiene sentido.
            */}
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {caso.cifras.map((cifra) => (
                <div
                  key={cifra.label}
                  className="bg-panel border border-line rounded-xl p-5"
                >
                  <p className="font-mono text-3xl font-bold text-brand-500 tracking-tight">
                    {cifra.valor}
                  </p>
                  <p className="text-sm text-muted mt-1">{cifra.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/*
            Acción secundaria: link de texto, nunca un botón relleno. La spec
            (§5) exige que ningún elemento comparta la jerarquía visual del CTA
            primario — un segundo botón sólido acá se lo comería.
          */}
          <div className="mt-10 pt-8 border-t border-line text-center">
            <a
              href={cta.destino}
              className="text-brand-500 underline underline-offset-4 hover:text-brand-600 transition"
            >
              {caso.cta} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
