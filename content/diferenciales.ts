/**
 * Diferenciales y comparación problema/solución del home.
 */

export interface Diferencial {
  titulo: string;
  descripcion: string;
  /** Selecciona el ícono SVG en el componente. */
  icono: "codigo" | "candado" | "escudo";
  acento: "brand" | "emerald" | "amber";
}

export const diferenciales: Diferencial[] = [
  {
    titulo: "Quien diseña, implementa",
    descripcion:
      "La arquitecta que habla contigo es la que escribe el código. Sin intermediarios, sin juniors rotando.",
    icono: "codigo",
    acento: "brand",
  },
  {
    titulo: "Ownership, no dependencia",
    descripcion:
      "Todo en tu cuenta AWS. Código tuyo. IaC reproducible. Si mañana no me necesitas, sigues operando solo.",
    icono: "candado",
    acento: "emerald",
  },
  {
    titulo: "Producción regulada",
    descripcion:
      "8+ años en industria financiera. Auditoría, compliance, alta disponibilidad. Si funciona ahí, funciona en cualquier lado.",
    icono: "escudo",
    acento: "amber",
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
