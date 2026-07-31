import Link from "next/link";

import CambiarTema from "@/components/CambiarTema";
import { cta, navLinks, site } from "@/content/site";

/**
 * Barra de navegación fija.
 *
 * **Server Component a propósito.** La versión anterior era `"use client"`
 * porque el menú hamburguesa necesitaba `useState`. Al quedarse la landing sin
 * navegación interna (spec §9) no hay menú, no hay estado y no hay motivo para
 * mandar este árbol al bundle del cliente: la única pieza interactiva es
 * `CambiarTema`, que trae su propio `"use client"`.
 *
 * Sigue en `fixed` y no en `position: sticky`: es el contrato que ya asumen el
 * layout y el padding superior del hero. El efecto para quien navega es el
 * mismo — la barra acompaña todo el scroll — y cambiarlo movería el layout de
 * archivos que no son de este componente.
 */
export default function Nav() {
  return (
    <nav className="fixed w-full z-50 bg-base/80 backdrop-blur-lg border-b border-line">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
        {/*
          El logotipo va en `font-mono`: es donde vive el sabor "terminal" del
          tema (spec §2), sin repintar nada de ámbar.

          Sin `aria-label`: el nombre accesible sale del texto visible
          ("ArqData") y así no hay forma de que etiqueta y contenido se
          desajusten. El guion bajo es un cursor decorativo — va `aria-hidden`
          para que no se cuele en ese nombre ni se lea en voz alta.

          `py-2` no cambia la altura de la barra (la marca el botón del CTA,
          más alto) pero lleva el área táctil por encima del mínimo de 24px de
          WCAG 2.2.
        */}
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-fg py-2"
        >
          {site.logotipo}
          <span className="text-brand-500" aria-hidden="true">
            _
          </span>
        </Link>

        {/*
          `navLinks` está vacío por decisión de producto: cualquier link que
          saque a la persona de la página compite con el único CTA. Se consume
          igual —en vez de borrar el markup— para que reponer navegación sea
          agregar objetos al array y nada más. Con el array vacío no se
          renderiza ni el contenedor: un `<div>` vacío seguiría aportando `gap`.
        */}
        {navLinks.length > 0 && (
          <div className="hidden sm:flex gap-8 text-sm text-muted">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-2 hover:text-fg transition"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 sm:gap-2">
          <CambiarTema />

          {/*
            El CTA acompaña todo el scroll: es el único destino de la página.
            `bg-btn`/`text-btn-fg` invierten el fondo en los dos modos, que es
            lo que lo mantiene como el elemento de mayor contraste.
            `whitespace-nowrap` evita que "Agendar Conversación" se parta en
            dos líneas y estire la barra en pantallas angostas.
          */}
          <a
            href={cta.destino}
            className="text-sm bg-btn text-btn-fg px-4 py-2 rounded-lg font-medium whitespace-nowrap hover:opacity-90 transition"
          >
            {cta.texto}
          </a>
        </div>
      </div>
    </nav>
  );
}
