/**
 * Textos del hero — lo primero que lee un visitante y la copy que más se
 * ajusta con el tiempo. Por eso vive acá y no dentro del componente.
 *
 * `tituloDestacado` se renderiza en una segunda línea con el degradado
 * indigo→emerald; `titulo` va arriba, en blanco.
 */

export const hero = {
  disponibilidad: "Disponible para nuevos proyectos",
  titulo: "Arquitectura de datos",
  tituloDestacado: "que produce resultados.",
  bajada:
    "Diseñamos plataformas de datos en AWS para empresas medianas en Chile. Pipelines automatizados, governance, BI y agentes IA — implementados en tu cuenta, con código reproducible.",
  ctaPrincipal: "Agendar llamada gratuita",
  ctaSecundario: "Ver caso de estudio",
} as const;
