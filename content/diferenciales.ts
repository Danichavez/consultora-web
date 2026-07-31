/**
 * Diferenciales del home — las tres garantías.
 *
 * Se pasó de 4 tarjetas a 3 en el rediseño (2026-07-31). Voz plural y por rol,
 * sin nombres propios: es la narrativa aprobada.
 */

/**
 * Acentos disponibles. Son **roles**, no colores: cada tema les asigna un valor
 * distinto (en claro `calido` es tierra quemada, en oscuro es ámbar pálido).
 * Antes se llamaban `emerald`/`amber`/`sky` y quedaron obsoletos al cambiar la
 * paleta — un nombre que miente sobre el color es peor que ninguno.
 */
export type Acento = "marca" | "calido" | "agua" | "alterno";

export interface Diferencial {
  titulo: string;
  descripcion: string;
  /** Selecciona el ícono SVG en el componente. */
  icono: "persona" | "candado" | "diana";
  acento: Acento;
}

export const tituloDiferencial = "Por qué no somos una consultora más";

export const diferenciales: Diferencial[] = [
  {
    titulo: "Profesionales senior, directo",
    descripcion:
      "Quien lidera tu proyecto es quien lo ejecuta. Sin capas de gestión, sin juniors rotando, sin traspasos entre equipos.",
    icono: "persona",
    acento: "marca",
  },
  {
    titulo: "Cero dependencia",
    descripcion:
      "Todo en tu cuenta AWS. Terraform, CI/CD, código documentado. Si terminamos y no nos necesitas, sigues operando solo.",
    icono: "candado",
    acento: "alterno",
  },
  {
    titulo: "Riesgo acotado",
    descripcion:
      "Empezamos con un diagnóstico de 2 semanas. Si no encontramos valor concreto, no te proponemos nada más.",
    icono: "diana",
    acento: "calido",
  },
];
