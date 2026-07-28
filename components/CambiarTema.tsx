"use client";

import { useState, useSyncExternalStore } from "react";

type Tema = "light" | "dark";

/**
 * Qué tema está activo ahora: el elegido a mano (`data-theme` en el `<html>`)
 * o, si nadie eligió, el del sistema.
 */
function leerTema(): Tema {
  const elegido = document.documentElement.getAttribute("data-theme");
  if (elegido === "dark" || elegido === "light") return elegido;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * El tema no vive en el árbol de React sino en el DOM y en el sistema
 * operativo, así que se consume con `useSyncExternalStore`: es la API pensada
 * para leer una fuente externa sin desincronizarse ni escribir estado desde un
 * efecto. El *snapshot del servidor* es `null` a propósito — el servidor no
 * puede saber qué prefiere quien visita, y devolver `null` hace que el HTML
 * del servidor coincida con el del cliente.
 */
const oyentes = new Set<() => void>();

function suscribir(alCambiar: () => void): () => void {
  oyentes.add(alCambiar);

  // Si nadie eligió a mano, el tema puede cambiar solo: alguien pasa su
  // sistema a oscuro con la pestaña abierta y el botón tiene que reflejarlo.
  const consulta = window.matchMedia("(prefers-color-scheme: dark)");
  consulta.addEventListener("change", alCambiar);

  return () => {
    oyentes.delete(alCambiar);
    consulta.removeEventListener("change", alCambiar);
  };
}

/** Avisa a React que el tema cambió por acción nuestra, no del sistema. */
function notificarCambio(): void {
  for (const avisar of oyentes) avisar();
}

/**
 * Botón para alternar entre modo claro y oscuro.
 *
 * **El ícono lo decide CSS; el estado accesible, React.** Son dos problemas
 * distintos:
 *
 * - El **ícono** sale de las reglas `.solo-claro` / `.solo-oscuro` de
 *   `globals.css`, que reaccionan a `data-theme`. Renderizarlo desde
 *   JavaScript daría parpadeo en la primera pintura.
 * - El **estado accesible** (`aria-pressed`) no se puede expresar en CSS, y
 *   sin él quien usa un lector de pantalla no tiene cómo saber en qué modo
 *   está: el cambio de ícono es información puramente visual.
 */
export default function CambiarTema() {
  const tema = useSyncExternalStore<Tema | null>(
    suscribir,
    leerTema,
    () => null, // en el servidor no hay tema que reportar
  );
  const [anuncio, setAnuncio] = useState("");

  function alternar() {
    const siguiente: Tema = leerTema() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", siguiente);
    notificarCambio();

    // El cambio visual no le llega a quien no ve la pantalla; este anuncio sí.
    setAnuncio(
      siguiente === "dark" ? "Modo oscuro activado" : "Modo claro activado",
    );

    // En navegación privada `localStorage` puede lanzar: el tema se aplica
    // igual, solo que no sobrevive a la recarga.
    try {
      localStorage.setItem("tema", siguiente);
    } catch {
      // Sin persistencia, pero funcional.
    }
  }

  return (
    <>
      {/*
        Región viva siempre montada y fuera del botón: si apareciera recién al
        cambiar el tema, algunos lectores de pantalla no la anunciarían.
      */}
      <span role="status" aria-live="polite" className="sr-only">
        {anuncio}
      </span>

      <button
        type="button"
        onClick={alternar}
        // "Modo oscuro" + `aria-pressed` se anuncia como "Modo oscuro, botón
        // de alternancia, no presionado": dice la acción y el estado. Antes de
        // hidratar no hay estado que declarar y el atributo se omite.
        aria-label="Modo oscuro"
        aria-pressed={tema === null ? undefined : tema === "dark"}
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
    </>
  );
}
