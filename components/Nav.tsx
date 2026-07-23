"use client";

import { useState } from "react";

import { navLinks, site } from "@/content/site";

/**
 * Barra de navegación fija.
 *
 * Client Component porque el menú móvil necesita estado. En `sm:` y arriba
 * se comporta igual que la maqueta de referencia (links inline + CTA); en
 * móvil los links viven detrás de un botón hamburguesa accesible.
 */
export default function Nav() {
  const [abierto, setAbierto] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-ink/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <a
          href="#contenido"
          // El nombre accesible debe contener el texto visible (el logotipo
          // más el punto), o los lectores de pantalla reportan un desajuste
          // etiqueta/contenido: de ahí que el punto se repita acá y abajo.
          aria-label={`${site.logotipo}. — ${site.nombre}, inicio`}
          className="text-sm font-semibold tracking-tight py-2"
        >
          {site.logotipo}
          <span className="text-brand-400">.</span>
        </a>

        {/*
          `py-2` no cambia la altura del nav (la marca el botón "Conversemos",
          más alto) pero lleva el área táctil de 17px a 33px, por encima del
          mínimo de WCAG 2.2 para objetivos de toque.
        */}
        <div className="hidden sm:flex gap-8 text-sm text-muted">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-2 hover:text-white transition"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#contacto"
            // Blanco sobre brand-500 da 4.45:1 y reprueba AA por poco en texto
            // chico; brand-600 sube a 6.3:1. En hover aclara a brand-500.
            className="text-sm bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg transition"
          >
            Conversemos
          </a>

          <button
            type="button"
            onClick={() => setAbierto((previo) => !previo)}
            aria-label={abierto ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            aria-expanded={abierto}
            aria-controls="nav-menu-movil"
            className="sm:hidden p-2 -mr-2 rounded-lg text-muted hover:text-white transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {abierto ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="nav-menu-movil"
        className={`${abierto ? "block" : "hidden"} sm:hidden border-t border-white/5`}
      >
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-1 text-sm text-muted">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setAbierto(false)}
              className="py-2 hover:text-white transition"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
