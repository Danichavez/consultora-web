/**
 * Sección "Quiénes somos".
 *
 * Voz plural y por rol, sin nombres propios — es la narrativa aprobada
 * (2026-07-23) y la que sostiene que la marca sea `ArqData` y no una persona.
 */

export const nosotros = {
  titulo: "Quiénes somos",
  parrafos: [
    "ArqData es una consultora especializada en arquitectura de datos y automatización en AWS para empresas medianas en Chile.",
    "Combinamos ingeniería de datos en producción, desarrollo full stack e inteligencia artificial para eliminar procesos manuales y darle visibilidad real a tu operación de datos.",
    "Cada proyecto es liderado por profesionales senior de punta a punta. Sin intermediarios. Sin rotación. Sin sorpresas.",
  ],
  /** Se renderizan como badges en línea, en `--font-mono`. */
  credenciales: [
    "AWS Certified",
    "Producción en industria regulada",
    "Ingeniería Civil Informática",
  ],
} as const;
