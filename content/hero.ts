/**
 * Textos del hero — lo primero que lee un visitante y la copy que más se ajusta
 * con el tiempo. Por eso vive acá y no dentro del componente.
 *
 * `tituloDestacado` se renderiza en una segunda línea con `.text-gradient`;
 * `titulo` va arriba, en `text-fg`.
 *
 * Voz plural, sin lenguaje corporativo abstracto y sin nombres propios: son las
 * tres reglas de copy de la spec del rediseño.
 */

export const hero = {
  titulo: "Eliminamos los procesos manuales de datos",
  tituloDestacado: "que le cuestan a tu empresa +1.000 horas al año.",
  bajada:
    "Diagnóstico en 2 semanas. Implementación en tu cuenta AWS. Sin dependencia, sin licencias de terceros, sin sorpresas.",
  /**
   * Línea de credenciales bajo el CTA. Se renderiza en `--font-mono` y en
   * `text-subtle`: es prueba, no titular.
   */
  proof: [
    "AWS Certified",
    "Producción en industria regulada",
    "Resultados en semanas, no meses",
  ],
} as const;
