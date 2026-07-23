/**
 * Catálogo de servicios. Alineado con Contexto/Empresa/catalogo_servicios.md.
 * Editar un servicio = editar un objeto de este array; el markup no se toca.
 */

export interface Servicio {
  /** Identificador estable, usado como key de React. */
  slug: string;
  nombre: string;
  descripcion: string;
  plazo: string;
  precio: string;
  /** Se renderiza en la tarjeta ancha destacada, no en la grilla. */
  destacado?: boolean;
}

export const servicios: Servicio[] = [
  {
    slug: "assessment",
    nombre: "Assessment de Datos",
    descripcion: "Diagnóstico de madurez + quick-wins + roadmap priorizado.",
    plazo: "2 semanas",
    precio: "$3-6M CLP",
  },
  {
    slug: "quick-win",
    nombre: "Quick Win",
    descripcion: "3 mejoras rápidas: seguridad, calidad o automatización.",
    plazo: "3-4 semanas",
    precio: "$8-12M CLP",
  },
  {
    slug: "pipeline-productivo",
    nombre: "Pipeline Productivo",
    descripcion: "ETL/ELT end-to-end en AWS con calidad y CI/CD.",
    plazo: "8-12 semanas",
    precio: "$25-50M CLP",
  },
  {
    slug: "data-governance",
    nombre: "Data Governance",
    descripcion: "Contracts, calidad, catálogo, ownership — sin tools de $100K.",
    plazo: "6-8 semanas",
    precio: "$15-30M CLP",
  },
  {
    slug: "business-intelligence",
    nombre: "Business Intelligence",
    descripcion: "Modelo dimensional + dashboards + KPIs + alertas.",
    plazo: "6-10 semanas",
    precio: "$15-35M CLP",
  },
  {
    slug: "finops",
    nombre: "FinOps",
    descripcion: "Visibilidad de costos cloud por equipo + optimización.",
    plazo: "4-6 semanas",
    precio: "$8-18M CLP",
  },
  {
    slug: "ia-agentica",
    nombre: "IA Agéntica",
    descripcion:
      "Agentes inteligentes sobre tus datos: alertas contextuales, reportes automáticos, chatbot de datos con aprendizaje continuo.",
    plazo: "4-6 semanas",
    precio: "$10-25M CLP",
    destacado: true,
  },
];
