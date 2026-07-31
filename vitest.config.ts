import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

/**
 * Configuración de tests.
 *
 * El alias `@/*` se declara acá a mano en vez de con un plugin que lea el
 * `tsconfig.json`: es una sola línea y evita sumar una dependencia más al
 * proyecto. Si algún día se agregan más paths al tsconfig, hay que reflejarlos
 * acá — es el precio de no tener el plugin, y es barato para dos entradas.
 *
 * `environment: "node"` a propósito: **no se testean componentes**, así que no
 * hace falta jsdom. Lo que se testea es la lógica de `lib/` y el endpoint, que
 * corren en Node.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["{lib,app}/**/*.test.ts"],
  },
});
