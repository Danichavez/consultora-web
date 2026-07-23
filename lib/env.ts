/**
 * Lectura de variables de entorno.
 *
 * Convención del proyecto: **una variable definida pero vacía cuenta como
 * ausente**. Es el caso habitual en Vercel, donde se crea la variable en el
 * panel y se deja en blanco. Con `??` eso no se detecta (`""` no es `undefined`)
 * y el valor vacío se propaga hasta romper algo lejos del origen.
 */

/** Devuelve el valor solo si trae contenido; si no, `undefined`. */
export function env(valor: string | undefined): string | undefined {
  const limpio = valor?.trim();
  return limpio ? limpio : undefined;
}

/** Igual que `env`, pero con un valor por defecto. */
export function envCon(valor: string | undefined, porDefecto: string): string {
  return env(valor) ?? porDefecto;
}

/**
 * URL base normalizada (sin barra final). Si el valor no es una URL absoluta
 * válida cae al valor por defecto en vez de reventar: un dominio mal escrito
 * en el panel de Vercel no debería tumbar el build entero.
 */
export function envUrl(valor: string | undefined, porDefecto: string): string {
  const crudo = env(valor);
  if (!crudo) return porDefecto;

  try {
    new URL(crudo);
  } catch {
    return porDefecto;
  }

  return crudo.replace(/\/$/, "");
}
