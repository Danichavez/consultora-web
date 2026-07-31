import { beforeEach, describe, expect, it, vi } from "vitest";

import type { RespuestaContacto } from "@/lib/leads";

/**
 * Tests de integración del endpoint. Convierten en regresión permanente los
 * cinco casos que QA encontró a mano con `curl` el 2026-07-22.
 *
 * Se mockea el envío de email —lo único que sale a la red— para no depender de
 * Resend ni gastar cuota. Todo lo demás (validación, honeypot, rate limit,
 * orden de los chequeos) corre de verdad.
 */
const enviarEmailLead = vi.fn();
vi.mock("@/lib/email", () => ({
  enviarEmailLead: (...args: unknown[]) => enviarEmailLead(...args),
}));

const { POST } = await import("@/app/api/contacto/route");

/** Cada test usa su propia IP: el contador del rate limit es global. */
let ip = 0;
function nuevaIp(): string {
  ip += 1;
  return `198.51.100.${ip}`;
}

function pedir(cuerpo: unknown, extra: Record<string, string> = {}): Request {
  return new Request("https://codebass.org/api/contacto", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": nuevaIp(),
      ...extra,
    },
    body: typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo),
  });
}

const LEAD_VALIDO = {
  nombre: "Ana Pérez",
  email: "ana@acme.cl",
  mensaje: "Tenemos datos en S3 y nadie confía en los números.",
};

beforeEach(() => {
  enviarEmailLead.mockReset();
  enviarEmailLead.mockResolvedValue({ ok: true, id: "re_123" });
});

describe("POST /api/contacto — cuerpo mal formado", () => {
  it("responde 400 si el body no es JSON", async () => {
    const respuesta = await POST(pedir("esto no es json {"));
    expect(respuesta.status).toBe(400);
    expect(enviarEmailLead).not.toHaveBeenCalled();
  });

  it("responde 400 si el body es un array", async () => {
    const respuesta = await POST(pedir([1, 2, 3]));
    expect(respuesta.status).toBe(400);
  });

  it("responde 400 si el body es null", async () => {
    const respuesta = await POST(pedir(null));
    expect(respuesta.status).toBe(400);
  });
});

describe("POST /api/contacto — validación", () => {
  it("responde 400 con los errores por campo", async () => {
    const respuesta = await POST(pedir({ nombre: "A", email: "no-es-email" }));
    expect(respuesta.status).toBe(400);

    const cuerpo = (await respuesta.json()) as RespuestaContacto;
    expect(cuerpo.ok).toBe(false);
    if (!cuerpo.ok) {
      expect(cuerpo.campos).toHaveProperty("nombre");
      expect(cuerpo.campos).toHaveProperty("email");
      expect(cuerpo.campos).toHaveProperty("mensaje");
    }
  });

  it("nunca le reporta el honeypot al cliente (no le da pistas al bot)", async () => {
    const respuesta = await POST(pedir({ nombre: "A" }));
    const cuerpo = (await respuesta.json()) as RespuestaContacto;
    if (!cuerpo.ok) expect(cuerpo.campos).not.toHaveProperty("website");
  });
});

describe("POST /api/contacto — honeypot", () => {
  /**
   * Al bot se le devuelve 200 para no darle señal de que lo detectamos, pero
   * no se procesa ni se gasta un envío de Resend.
   */
  it("responde 200 falso y no envía nada", async () => {
    const respuesta = await POST(
      pedir({ ...LEAD_VALIDO, website: "https://spam.example" }),
    );
    expect(respuesta.status).toBe(200);
    expect(enviarEmailLead).not.toHaveBeenCalled();
  });

  it("un honeypot vacío no bloquea a una persona real", async () => {
    const respuesta = await POST(pedir({ ...LEAD_VALIDO, website: "" }));
    expect(respuesta.status).toBe(200);
    expect(enviarEmailLead).toHaveBeenCalledOnce();
  });
});

describe("POST /api/contacto — mismo origen", () => {
  it("responde 403 a un POST desde otro origen", async () => {
    const respuesta = await POST(
      pedir(LEAD_VALIDO, { origin: "https://sitio-atacante.example", host: "codebass.org" }),
    );
    expect(respuesta.status).toBe(403);
    expect(enviarEmailLead).not.toHaveBeenCalled();
  });

  it("acepta el POST del propio sitio", async () => {
    const respuesta = await POST(
      pedir(LEAD_VALIDO, { origin: "https://codebass.org", host: "codebass.org" }),
    );
    expect(respuesta.status).toBe(200);
  });
});

describe("POST /api/contacto — tamaño", () => {
  it("responde 413 si el body declara más de 16KB", async () => {
    const respuesta = await POST(
      pedir(LEAD_VALIDO, { "content-length": String(20 * 1024) }),
    );
    expect(respuesta.status).toBe(413);
  });
});

describe("POST /api/contacto — rate limit", () => {
  it("bloquea con 429 y Retry-After a partir de la 6ª request de la misma IP", async () => {
    const misma = nuevaIp();
    const request = () =>
      new Request("https://codebass.org/api/contacto", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": misma },
        body: JSON.stringify(LEAD_VALIDO),
      });

    for (let i = 0; i < 5; i += 1) {
      expect((await POST(request())).status).toBe(200);
    }

    const bloqueada = await POST(request());
    expect(bloqueada.status).toBe(429);
    expect(bloqueada.headers.get("Retry-After")).toBeTruthy();
  });

  it("cuenta también las requests inválidas (mandar basura no sale gratis)", async () => {
    const misma = nuevaIp();
    const request = (cuerpo: unknown) =>
      new Request("https://codebass.org/api/contacto", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": misma },
        body: JSON.stringify(cuerpo),
      });

    for (let i = 0; i < 5; i += 1) {
      expect((await POST(request({ basura: true }))).status).toBe(400);
    }

    // La 6ª, ya válida, igual se bloquea: el contador corre antes de validar.
    expect((await POST(request(LEAD_VALIDO))).status).toBe(429);
  });
});

describe("POST /api/contacto — envío", () => {
  it("responde 200 y llama al envío una sola vez con el lead normalizado", async () => {
    const respuesta = await POST(pedir({ ...LEAD_VALIDO, empresa: "Acme" }));

    expect(respuesta.status).toBe(200);
    expect(enviarEmailLead).toHaveBeenCalledOnce();
    expect(enviarEmailLead.mock.calls[0][0]).toMatchObject({
      tipo: "contacto",
      nombre: "Ana Pérez",
      email: "ana@acme.cl",
      empresa: "Acme",
    });
    // La hora la pone el servidor, nunca el cliente.
    expect(enviarEmailLead.mock.calls[0][0]).toHaveProperty("recibidoEn");
  });

  it("responde 503 y deriva al email cuando falta la configuración", async () => {
    enviarEmailLead.mockResolvedValue({
      ok: false,
      motivo: "sin-configurar",
      detalle: "RESEND_API_KEY no está definida en el entorno.",
    });

    const respuesta = await POST(pedir(LEAD_VALIDO));
    expect(respuesta.status).toBe(503);

    const cuerpo = (await respuesta.json()) as RespuestaContacto;
    // Muestra el email público del sitio, nunca el destinatario real del entorno.
    if (!cuerpo.ok) expect(cuerpo.error).toContain("@");
  });

  it("responde 502 cuando el proveedor falla", async () => {
    enviarEmailLead.mockResolvedValue({
      ok: false,
      motivo: "proveedor",
      detalle: "rate_limit_exceeded: too many requests",
    });

    const respuesta = await POST(pedir(LEAD_VALIDO));
    expect(respuesta.status).toBe(502);

    const cuerpo = (await respuesta.json()) as RespuestaContacto;
    // El detalle del proveedor queda en los logs, no le llega a la persona.
    if (!cuerpo.ok) expect(cuerpo.error).not.toContain("rate_limit_exceeded");
  });
});
