/**
 * Caso de estudio de referencia. Datos alineados con
 * Contexto/Empresa/catalogo_servicios.md.
 */

export interface Metrica {
  valor: string;
  etiqueta: string;
  /** Acento del número destacado. El componente lo traduce a clases Tailwind. */
  acento: "brand" | "emerald" | "amber" | "purple";
}

export const caso = {
  titulo: "Pipeline de riesgo financiero",
  contexto: "Sector pensiones regulado · Chile",
  detalle:
    "Pipeline serverless con AWS Glue, Step Functions y Redshift. Calcula Tracking Error, VaR y Beta para 5 fondos y 2,000+ instrumentos financieros diariamente.",
  metricas: [
    { valor: "4h → 15m", etiqueta: "Proceso automatizado", acento: "brand" },
    { valor: "1,100 h", etiqueta: "Ahorradas por año", acento: "emerald" },
    { valor: "$250", etiqueta: "USD/mes en infra", acento: "amber" },
    // El catálogo declara ">99%"; la maqueta decía "99.9%". Se unifica en el
    // dato conservador del catálogo, que es la fuente de verdad del negocio.
    { valor: ">99%", etiqueta: "Uptime", acento: "purple" },
  ] satisfies Metrica[],
} as const;
