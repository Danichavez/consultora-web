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
 *   dolor → por qué nosotros → cómo → quiénes → CTA
 *
 * Mover una sección cambia el argumento, no el layout. Nav y Footer viven en el
 * layout porque envuelven también a `/thank-you`.
 *
 * Acá iba un "Caso real" con cifras (1.100 horas/año, US$250/mes de infra).
 * Se quitó el 2026-07-31 por decisión del usuario. Consecuencia que se atendió
 * en el mismo cambio: el titular del hero afirmaba "+1.000 horas al año" y esas
 * cifras eran lo único que lo respaldaba en toda la página — se reescribió el
 * titular sin cifra. **Si algún día vuelve el caso, el hero puede volver a
 * hablar en números; mientras no esté, no hay con qué sostenerlos.**
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Dolor />
      <Diferencial />
      <Proceso />
      <SobreNosotros />
      <Contacto />
    </>
  );
}
