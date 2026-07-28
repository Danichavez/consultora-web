/**
 * Diferenciales y comparación problema/solución del home.
 */

/**
 * Acentos disponibles. Son **roles**, no colores: cada tema les asigna un
 * valor distinto (en claro `calido` es tierra, en oscuro es rosa). Antes se
 * llamaban `emerald`/`amber`/`sky` y quedaron obsoletos al cambiar la paleta
 * — un nombre que miente sobre el color es peor que ninguno.
 */
export type Acento = "marca" | "calido" | "agua" | "alterno";

export interface Diferencial {
  titulo: string;
  descripcion: string;
  /** Selecciona el ícono SVG en el componente. */
  icono: "codigo" | "candado" | "escudo" | "rayo";
  acento: Acento;
}

export const diferenciales: Diferencial[] = [
  {
    titulo: "Quien diseña, implementa",
    descripcion:
      "Una dupla fija: la arquitecta que diseña tus datos y el ingeniero que construye la IA y la automatización. Los mismos dos, de principio a fin, sin traspasos.",
    icono: "codigo",
    acento: "marca",
  },
  {
    titulo: "Ownership, no dependencia",
    descripcion:
      "Todo en tu cuenta AWS. Código tuyo. IaC reproducible. Si mañana no nos necesitas, sigues operando solo.",
    icono: "candado",
    acento: "alterno",
  },
  {
    titulo: "Producción regulada",
    descripcion:
      "8+ años en industria financiera. Auditoría, compliance, alta disponibilidad. Si funciona ahí, funciona en cualquier lado.",
    icono: "escudo",
    acento: "calido",
  },
  {
    titulo: "Del dato a la automatización",
    descripcion:
      "La misma dupla que ordena tus datos te construye los agentes de IA y las automatizaciones encima. In-house, nada tercerizado.",
    icono: "rayo",
    acento: "agua",
  },
];

export const problemas: string[] = [
  "Reportes manuales que toman días",
  "Factura de AWS que crece sin visibilidad",
  "Nadie confía en los números",
  "Sin arquitecto de datos en el equipo",
];

export const soluciones: string[] = [
  "Pipelines automatizados que corren solos",
  "Costos claros por equipo y por pipeline",
  "Datos validados con calidad automática",
  "Todo en tu cuenta AWS, código tuyo",
];
