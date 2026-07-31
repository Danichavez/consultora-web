import { describe, expect, it } from "vitest";

import { env, envCon, envUrl } from "@/lib/env";

/**
 * El bug que estos tests previenen (ocurrió el 2026-07-22): una variable de
 * entorno **definida pero vacía** no es `undefined`, y `??` no la cubre. Es el
 * caso habitual en Vercel, donde se crea la variable en el panel y se deja en
 * blanco. Ese string vacío se propagó hasta `new URL("")` y habría tumbado el
 * build entero, lejos del origen del problema.
 */
describe("env", () => {
  it("trata la variable vacía como ausente", () => {
    expect(env("")).toBeUndefined();
  });

  it("trata la variable con solo espacios como ausente", () => {
    expect(env("   ")).toBeUndefined();
  });

  it("devuelve undefined si no está definida", () => {
    expect(env(undefined)).toBeUndefined();
  });

  it("recorta los espacios del valor real", () => {
    expect(env("  hola  ")).toBe("hola");
  });
});

describe("envCon", () => {
  it("cae al valor por defecto cuando la variable está vacía", () => {
    expect(envCon("", "defecto")).toBe("defecto");
  });

  it("cae al valor por defecto cuando no está definida", () => {
    expect(envCon(undefined, "defecto")).toBe("defecto");
  });

  it("usa el valor real cuando lo hay", () => {
    expect(envCon("real", "defecto")).toBe("real");
  });
});

describe("envUrl", () => {
  const DEFECTO = "https://codebass.org";

  it("cae al defecto si la variable está vacía", () => {
    expect(envUrl("", DEFECTO)).toBe(DEFECTO);
  });

  it("cae al defecto si el valor no es una URL absoluta válida", () => {
    // Un dominio mal escrito en el panel de Vercel no debe tumbar el build.
    expect(envUrl("codebass punto org", DEFECTO)).toBe(DEFECTO);
  });

  it("quita la barra final para que el canonical no quede duplicado", () => {
    expect(envUrl("https://ejemplo.cl/", DEFECTO)).toBe("https://ejemplo.cl");
  });

  it("deja intacta una URL válida sin barra final", () => {
    expect(envUrl("https://ejemplo.cl", DEFECTO)).toBe("https://ejemplo.cl");
  });
});
