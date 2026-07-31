import { describe, expect, it } from "vitest";

import {
  honeypotField,
  leadContactoSchema,
  normalizarLead,
  type LeadContacto,
} from "@/lib/leads";

/** Payload válido mínimo; cada test cambia solo lo que le interesa. */
function lead(cambios: Record<string, unknown> = {}) {
  return {
    nombre: "Ana Pérez",
    email: "ana@acme.cl",
    mensaje: "Tenemos datos en S3 y nadie confía en los números.",
    ...cambios,
  };
}

describe("leadContactoSchema — el honeypot", () => {
  /**
   * ESTE ES EL TEST MÁS IMPORTANTE DE LA SUITE.
   *
   * Bug real (2026-07-22): el honeypot estaba en el esquema compartido, así que
   * `zodResolver` lo validaba también en el cliente. Un gestor de contraseñas
   * rellenando un campo llamado `website` dejaba el botón "Enviar" sin hacer
   * nada — sin mensaje, para siempre, perdiendo el lead en silencio. El build,
   * el lint y Lighthouse 100/100 pasaban igual.
   *
   * El esquema tiene que ACEPTAR el honeypot con cualquier valor; quien lo
   * juzga es el endpoint.
   */
  it("acepta el honeypot con contenido (lo juzga el servidor, no el esquema)", () => {
    const resultado = leadContactoSchema.safeParse(
      lead({ [honeypotField]: "https://spam.example" }),
    );
    expect(resultado.success).toBe(true);
  });

  it("acepta el honeypot con un valor que ni siquiera es texto", () => {
    const resultado = leadContactoSchema.safeParse(
      lead({ [honeypotField]: { raro: true } }),
    );
    expect(resultado.success).toBe(true);
  });
});

describe("leadContactoSchema — inyección de headers", () => {
  /**
   * `nombre` y `empresa` se interpolan en el asunto del email: un `\r\n` ahí es
   * inyección de headers SMTP. `.trim()` solo limpia los bordes.
   */
  it.each([
    ["salto de línea en el nombre", { nombre: "Ana\r\nBcc: victima@ejemplo.cl" }],
    ["salto de línea en la empresa", { empresa: "Acme\nBcc: victima@ejemplo.cl" }],
    ["byte nulo en el nombre", { nombre: "Ana\x00Pérez" }],
  ])("rechaza %s", (_caso, cambios) => {
    expect(leadContactoSchema.safeParse(lead(cambios)).success).toBe(false);
  });

  it("rechaza un email con salto de línea", () => {
    const resultado = leadContactoSchema.safeParse(
      lead({ email: "ana@acme.cl\r\nBcc: victima@ejemplo.cl" }),
    );
    expect(resultado.success).toBe(false);
  });
});

describe("leadContactoSchema — campos", () => {
  it("normaliza el email a minúsculas y sin espacios", () => {
    const resultado = leadContactoSchema.safeParse(lead({ email: "  ANA@Acme.CL " }));
    expect(resultado.success && resultado.data.email).toBe("ana@acme.cl");
  });

  it("acepta empresa vacía sin convertir el esquema en unión", () => {
    // Un `.or(z.literal(""))` extra haría que zod reporte el error genérico de
    // unión en vez del mensaje propio del campo.
    const resultado = leadContactoSchema.safeParse(lead({ empresa: "" }));
    expect(resultado.success).toBe(true);
  });

  it("pone tipo 'contacto' por defecto cuando no viene", () => {
    const resultado = leadContactoSchema.safeParse(lead());
    expect(resultado.success && resultado.data.tipo).toBe("contacto");
  });

  it("rechaza un mensaje de 9 caracteres y acepta uno de 10", () => {
    expect(leadContactoSchema.safeParse(lead({ mensaje: "123456789" })).success).toBe(false);
    expect(leadContactoSchema.safeParse(lead({ mensaje: "1234567890" })).success).toBe(true);
  });

  it("rechaza un nombre de 1 carácter", () => {
    expect(leadContactoSchema.safeParse(lead({ nombre: "A" })).success).toBe(false);
  });

  it("da los mensajes de error en español", () => {
    // Sin `z.config(z.locales.es())` un POST malformado responde "Invalid
    // input" en una UI que está toda en español.
    const resultado = leadContactoSchema.safeParse(lead({ email: 123 }));
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      const mensajes = resultado.error.issues.map((i) => i.message).join(" ");
      expect(mensajes).not.toMatch(/Invalid|Expected|Required/);
    }
  });
});

describe("normalizarLead", () => {
  const base: LeadContacto = {
    tipo: "contacto",
    nombre: "Ana Pérez",
    email: "ana@acme.cl",
    empresa: "Acme",
    mensaje: "Tenemos datos en S3.",
  };

  it("estampa la hora del servidor en ISO 8601", () => {
    const cuando = new Date("2026-07-27T15:30:00.000Z");
    expect(normalizarLead(base, cuando).recibidoEn).toBe("2026-07-27T15:30:00.000Z");
  });

  it("convierte la empresa vacía en undefined (no la manda como '')", () => {
    const resultado = normalizarLead({ ...base, empresa: "" }, new Date());
    expect(resultado.empresa).toBeUndefined();
  });

  it("no arrastra el honeypot al lead normalizado", () => {
    const conTrampa = { ...base, [honeypotField]: "spam" } as LeadContacto;
    expect(normalizarLead(conTrampa, new Date())).not.toHaveProperty(honeypotField);
  });
});
