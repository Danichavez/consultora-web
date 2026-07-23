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

export const metadata = seoMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={site.lang} className={inter.variable}>
      <body className="bg-ink text-zinc-100 font-sans antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white"
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
