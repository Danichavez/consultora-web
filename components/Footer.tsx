import { site } from "@/content/site";

/**
 * Footer del sitio.
 *
 * Ojo con el año: la home se prerenderiza estáticamente, así que
 * `new Date().getFullYear()` se evalúa una sola vez —en el build— y queda
 * congelado en el HTML. Cada 1 de enero el copyright muestra el año anterior
 * hasta el siguiente deploy. Es aceptable para este sitio; si algún día
 * molesta, la salida es renderizar el año en el cliente o forzar la ruta a
 * dinámica, no tocar esta línea.
 */
export default function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="py-8 text-center text-xs text-subtle border-t border-line">
      <div className="max-w-6xl mx-auto px-6">
        © {anio} {site.nombre} · {site.ciudad}
      </div>
    </footer>
  );
}
