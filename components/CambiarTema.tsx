"use client";

/**
 * Botón para alternar entre modo claro y oscuro.
 *
 * No tiene estado de React a propósito. El tema vive en un atributo del
 * `<html>` (`data-theme`) y en `localStorage`, no en el árbol de componentes:
 * el servidor no puede saber qué tema prefiere quien visita, así que si el
 * ícono dependiera de un `useState` habría desajuste de hidratación o un
 * parpadeo en el primer render. Acá el HTML trae los dos íconos y CSS decide
 * cuál se ve (reglas `.solo-claro` / `.solo-oscuro` en `globals.css`).
 *
 * Ausencia de `data-theme` = seguir la preferencia del sistema, que es el
 * estado inicial de todo el mundo hasta que toque este botón.
 */
export default function CambiarTema() {
  function alternar() {
    const raiz = document.documentElement;
    const elegido = raiz.getAttribute("data-theme");

    // Sin elección previa hay que resolver contra el sistema, o el primer
    // click no haría nada visible para quien ya está en modo oscuro.
    const actual =
      elegido ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    const siguiente = actual === "dark" ? "light" : "dark";
    raiz.setAttribute("data-theme", siguiente);

    // En navegación privada `localStorage` puede lanzar: el tema se aplica
    // igual, solo que no sobrevive a la recarga.
    try {
      localStorage.setItem("tema", siguiente);
    } catch {
      // Sin persistencia, pero funcional.
    }
  }

  return (
    <button
      type="button"
      onClick={alternar}
      // La etiqueta no nombra el estado actual porque el servidor no lo
      // conoce: describe la acción, que es verdad en los dos modos.
      aria-label="Cambiar entre modo claro y oscuro"
      title="Cambiar entre modo claro y oscuro"
      className="p-2 rounded-lg text-muted hover:text-fg transition"
    >
      {/* Modo claro → luna (ofrece pasar a oscuro). */}
      <svg
        className="solo-claro w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        />
      </svg>

      {/* Modo oscuro → sol (ofrece pasar a claro). */}
      <svg
        className="solo-oscuro w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.36-6.36l-1.42 1.42M7.06 16.94l-1.42 1.42m12.72 0l-1.42-1.42M7.06 7.06L5.64 5.64M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </button>
  );
}
