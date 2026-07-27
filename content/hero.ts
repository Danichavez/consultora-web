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
  /**
   * Apuntaba al caso de estudio, que se quitó del sitio (2026-07-27). Ahora
   * lleva al portafolio (`#trabajo`), que pasó a ser la prueba principal.
   */
  ctaSecundario: "Ver proyectos",
} as const;
