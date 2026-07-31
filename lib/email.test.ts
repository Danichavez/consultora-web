import { afterEach, describe, expect, it } from "vitest";

import {
  asuntoLead,
  cuerpoHtmlLead,
  cuerpoTextoLead,
  enviarEmailLead,
} from "@/lib/email";
import type { Lead } from "@/lib/leads";

function lead(cambios: Partial<Lead> = {}): Lead {
  return {
    tipo: "contacto",
    nombre: "Ana Pérez",
    email: "ana@acme.cl",
    rol: "gerente-ti",
    desafio: "costos-cloud",
    recibidoEn: "2026-07-27T15:30:00.000Z",
    ...cambios,
  };
}

describe("asuntoLead", () => {
  it("arma un asunto escaneable de un vistazo", () => {
    expect(asuntoLead(lead())).toBe(
      "Nuevo lead: Ana Pérez — Costos cloud creciendo sin visibilidad",
    );
  });

  /**
   * Segunda barrera contra inyección de headers SMTP. El esquema zod ya
   * rechaza los saltos de línea, pero esta función es exportada y no debe
   * depender de que quien la llame haya validado antes. Resend pasa el
   * `subject` tal cual al API: no sanitiza nada.
   */
  it("aplasta saltos de línea y nulos en una sola línea", () => {
    const asunto = asuntoLead(lead({ nombre: "Ana\r\nBcc: victima@ejemplo.cl\x00" }));
    expect(asunto).not.toMatch(/[\r\n\x00]/);
  });
});

describe("cuerpoHtmlLead — escapado", () => {
  it("escapa el HTML del nombre", () => {
    const html = cuerpoHtmlLead(lead({ nombre: "<script>alert('x')</script>" }));
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapa comillas y ampersands", () => {
    const html = cuerpoHtmlLead(lead({ nombre: `a & b "c" 'd'` }));
    expect(html).toContain("&amp;");
    expect(html).toContain("&quot;");
    expect(html).toContain("&#39;");
  });

  it("muestra las etiquetas del rol y del desafío, no los slugs", () => {
    const html = cuerpoHtmlLead(lead());
    expect(html).toContain("Gerente de TI");
    expect(html).not.toContain("gerente-ti");
    expect(html).not.toContain("costos-cloud");
  });
});

describe("cuerpoTextoLead", () => {
  it("incluye todos los campos del lead", () => {
    const texto = cuerpoTextoLead(lead());
    expect(texto).toContain("Ana Pérez");
    expect(texto).toContain("ana@acme.cl");
    expect(texto).toContain("Gerente de TI");
    expect(texto).toContain("Costos cloud creciendo sin visibilidad");
  });

  /**
   * La nota es informativa y no bloquea nada: el formulario acepta `@gmail` a
   * propósito (el correo de la propia consultora es uno). Sirve para priorizar.
   */
  it("anota el correo personal al costado del email", () => {
    expect(cuerpoTextoLead(lead({ email: "ana@gmail.com" }))).toContain(
      "ana@gmail.com (correo personal)",
    );
  });

  it("no anota nada cuando el correo es corporativo", () => {
    expect(cuerpoTextoLead(lead())).not.toContain("correo personal");
  });

  it("no revienta con una fecha inválida", () => {
    // Cae al ISO crudo en vez de mostrar "Invalid Date".
    expect(cuerpoTextoLead(lead({ recibidoEn: "no-es-una-fecha" }))).toContain(
      "no-es-una-fecha",
    );
  });
});

describe("enviarEmailLead sin configurar", () => {
  const original = process.env.RESEND_API_KEY;
  afterEach(() => {
    if (original === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = original;
  });

  /**
   * Sin la key no se llama a Resend: se devuelve un resultado de error
   * explícito que el route traduce a un 503 con un mensaje útil. Es lo que
   * permite que el sitio corra y se despliegue sin ningún secreto configurado.
   * Este test no necesita mock de red justamente porque corta antes.
   */
  it("devuelve 'sin-configurar' sin tocar la red", async () => {
    delete process.env.RESEND_API_KEY;

    const resultado = await enviarEmailLead(lead());
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.motivo).toBe("sin-configurar");
  });

  it("trata la key vacía como ausente", async () => {
    process.env.RESEND_API_KEY = "";

    const resultado = await enviarEmailLead(lead());
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.motivo).toBe("sin-configurar");
  });
});
