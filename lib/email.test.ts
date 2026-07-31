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
    empresa: "Acme",
    mensaje: "Tenemos datos en S3.",
    recibidoEn: "2026-07-27T15:30:00.000Z",
    ...cambios,
  };
}

describe("asuntoLead", () => {
  it("arma un asunto escaneable de un vistazo", () => {
    expect(asuntoLead(lead())).toBe("Nuevo lead: Ana Pérez (Acme)");
  });

  it("dice 'sin empresa' cuando no viene", () => {
    expect(asuntoLead(lead({ empresa: undefined }))).toBe(
      "Nuevo lead: Ana Pérez (sin empresa)",
    );
  });

  /**
   * Segunda barrera contra inyección de headers SMTP. El esquema zod ya
   * rechaza los saltos de línea, pero esta función es exportada y no debe
   * depender de que quien la llame haya validado antes. Resend pasa el
   * `subject` tal cual al API: no sanitiza nada.
   */
  it("aplasta saltos de línea y nulos en una sola línea", () => {
    const asunto = asuntoLead(
      lead({ nombre: "Ana\r\nBcc: victima@ejemplo.cl", empresa: "Acme\x00" }),
    );
    expect(asunto).not.toMatch(/[\r\n\x00]/);
  });
});

describe("cuerpoHtmlLead — escapado", () => {
  it("escapa el HTML del mensaje", () => {
    const html = cuerpoHtmlLead(
      lead({ mensaje: "<script>alert('x')</script>" }),
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapa el HTML del nombre y de la empresa", () => {
    const html = cuerpoHtmlLead(
      lead({ nombre: "<b>Ana</b>", empresa: '"><img src=x>' }),
    );
    expect(html).not.toContain("<b>Ana</b>");
    expect(html).not.toContain("<img src=x>");
  });

  it("escapa comillas y ampersands", () => {
    const html = cuerpoHtmlLead(lead({ mensaje: `a & b "c" 'd'` }));
    expect(html).toContain("&amp;");
    expect(html).toContain("&quot;");
    expect(html).toContain("&#39;");
  });
});

describe("cuerpoTextoLead", () => {
  it("incluye todos los campos del lead", () => {
    const texto = cuerpoTextoLead(lead());
    expect(texto).toContain("Ana Pérez");
    expect(texto).toContain("ana@acme.cl");
    expect(texto).toContain("Acme");
    expect(texto).toContain("Tenemos datos en S3.");
  });

  it("marca la empresa ausente con un guion", () => {
    expect(cuerpoTextoLead(lead({ empresa: undefined }))).toContain("Empresa:  —");
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
