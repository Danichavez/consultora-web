import CasoReal from "@/components/CasoReal";
import Contacto from "@/components/Contacto";
import Diferencial from "@/components/Diferencial";
import Dolor from "@/components/Dolor";
import Hero from "@/components/Hero";
import Proceso from "@/components/Proceso";
import SobreNosotros from "@/components/SobreNosotros";

/**
 * Home. Página única, sin navegación interna: todo el scroll conduce al
 * formulario de `#contacto`, que es la única acción de la página.
 *
 * El orden no es estético, es el del argumento de venta y está fijado en
 * `Contexto/Documentacion/spec_rediseno_landing.md` §3:
 *
 *   dolor → prueba de que lo resolvimos → por qué nosotros → cómo → quiénes → CTA
 *
 * Mover una sección cambia el argumento, no el layout. Nav y Footer viven en el
 * layout porque envuelven también a `/thank-you`.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Dolor />
      <CasoReal />
      <Diferencial />
      <Proceso />
      <SobreNosotros />
      <Contacto />
    </>
  );
}
