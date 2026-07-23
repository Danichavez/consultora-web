import Hero from "@/components/Hero";
import ProblemaSolucion from "@/components/ProblemaSolucion";
import CasoEstudio from "@/components/CasoEstudio";
import Servicios from "@/components/Servicios";
import Proceso from "@/components/Proceso";
import Diferencial from "@/components/Diferencial";
import Portafolio from "@/components/Portafolio";
import StackTecnico from "@/components/StackTecnico";
import Contacto from "@/components/Contacto";

/**
 * Home. El orden de las secciones replica el de la maqueta de referencia
 * (Contexto/Referencia/index.html). Nav y Footer viven en el layout.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <ProblemaSolucion />
      <CasoEstudio />
      <Servicios />
      <Proceso />
      <Diferencial />
      <Portafolio />
      <StackTecnico />
      <Contacto />
    </>
  );
}
