import { Inter } from "next/font/google";

import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Nav from "@/components/Nav";
import { site } from "@/content/site";
import { metadata as seoMetadata } from "@/lib/seo";

import "./globals.css";

/**
 * Inter self-hosteada por `next/font`: sin request a Google Fonts y sin el
 * salto de layout que tenía la maqueta al cargar la tipografía.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Aplica el tema guardado ANTES del primer pintado.
 *
 * Sin esto, quien eligió modo claro y tiene el sistema en oscuro vería la
 * página cargar oscura y saltar a clara — el "flash of wrong theme". Tiene
 * que ser un script síncrono y en el arranque del `<body>`: si se ejecutara
 * después de la hidratación, React ya habría pintado con el tema equivocado.
 *
 * Cuando no hay nada guardado no se toca el atributo: la ausencia de
 * `data-theme` significa "seguir al sistema", que resuelve el CSS solo.
 */
const SCRIPT_TEMA = `(function(){try{var t=localStorage.getItem("tema");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;

export const metadata = seoMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `suppressHydrationWarning` porque el script de arriba le agrega
    // `data-theme` al `<html>` antes de que React hidrate: sin esto, React
    // avisaría de una diferencia entre el HTML del servidor y el del cliente
    // que es intencional.
    <html
      lang={site.lang}
      className={inter.variable}
      suppressHydrationWarning
    >
      <body className="bg-base text-fg font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-btn focus:px-4 focus:py-2 focus:text-btn-fg"
        >
          Saltar al contenido
        </a>
        <Nav />
        <main id="contenido">{children}</main>
        <Footer />
        <JsonLd />
        <Analytics />
      </body>
    </html>
  );
}
