"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  honeypotField,
  leadContactoSchema,
  type LeadContacto,
  type LeadContactoInput,
  type RespuestaContacto,
} from "@/lib/leads";

/**
 * Formulario de contacto: valida en el cliente contra el mismo
 * `leadContactoSchema` que usa el endpoint y postea a `/api/contacto`.
 *
 * El servidor revalida todo — esta validación es puro feedback inmediato.
 */

type Estado = "idle" | "exito" | "error";

const CLASE_ETIQUETA = "block text-sm font-medium mb-2";

const CLASE_INPUT =
  "w-full rounded-lg bg-white/[0.03] border border-white/10 px-4 py-3 text-sm " +
  "placeholder:text-subtle hover:border-white/20 transition disabled:opacity-60";

const CLASE_ERROR = "mt-2 text-xs text-red-400";

/** Campos que el servidor puede marcar como inválidos en su respuesta. */
const CAMPOS_DEL_FORM = ["nombre", "email", "empresa", "mensaje"] as const;

function esCampoDelForm(clave: string): clave is (typeof CAMPOS_DEL_FORM)[number] {
  return (CAMPOS_DEL_FORM as readonly string[]).includes(clave);
}

/** Lee el JSON de la respuesta sin romperse si el servidor devolvió otra cosa. */
async function leerRespuesta(
  respuesta: Response,
): Promise<RespuestaContacto | null> {
  try {
    const datos: unknown = await respuesta.json();
    if (typeof datos === "object" && datos !== null && "ok" in datos) {
      return datos as RespuestaContacto;
    }
    return null;
  } catch {
    return null;
  }
}

const ERROR_GENERICO =
  "No pudimos enviar tu mensaje. Intenta de nuevo en unos minutos.";

export default function ContactoForm() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensajeError, setMensajeError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LeadContactoInput, unknown, LeadContacto>({
    resolver: zodResolver(leadContactoSchema),
    defaultValues: {
      nombre: "",
      email: "",
      empresa: "",
      mensaje: "",
      [honeypotField]: "",
    },
  });

  async function enviar(datos: LeadContacto) {
    setMensajeError("");

    let respuesta: Response;
    try {
      respuesta = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
    } catch {
      setEstado("error");
      setMensajeError(
        "No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.",
      );
      return;
    }

    const cuerpo = await leerRespuesta(respuesta);

    if (respuesta.ok && cuerpo?.ok === true) {
      // Solo acá se limpia el formulario: ante un error, lo escrito se conserva.
      reset();
      setEstado("exito");
      return;
    }

    if (cuerpo && cuerpo.ok === false) {
      if (cuerpo.campos) {
        for (const [clave, mensajes] of Object.entries(cuerpo.campos)) {
          if (!esCampoDelForm(clave) || !mensajes?.length) continue;
          setError(clave, {
            type: "server",
            message: mensajes[0],
          });
        }
      }
      setMensajeError(cuerpo.error || ERROR_GENERICO);
    } else {
      setMensajeError(ERROR_GENERICO);
    }

    setEstado("error");
  }

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 sm:p-8 text-left">
      {/*
        Región viva siempre montada: si apareciera junto con el mensaje, los
        lectores de pantalla podrían no anunciarlo.
      */}
      <div role="status" aria-live="polite">
        {estado === "exito" && (
          <p className="text-sm text-emerald-400">
            ¡Listo! Recibimos tu mensaje y te respondemos dentro de las próximas 24
            horas hábiles.
          </p>
        )}
        {estado === "error" && mensajeError !== "" && (
          <p className="text-sm text-red-400">{mensajeError}</p>
        )}
      </div>

      {estado === "exito" ? (
        <button
          type="button"
          onClick={() => {
            setEstado("idle");
            setMensajeError("");
          }}
          className="mt-6 text-sm text-brand-400 hover:text-brand-500 transition"
        >
          Enviar otro mensaje
        </button>
      ) : (
        <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contacto-nombre" className={CLASE_ETIQUETA}>
                Nombre
              </label>
              <input
                id="contacto-nombre"
                type="text"
                autoComplete="name"
                className={CLASE_INPUT}
                aria-invalid={errors.nombre ? true : undefined}
                aria-describedby={errors.nombre ? "contacto-nombre-error" : undefined}
                {...register("nombre")}
              />
              {errors.nombre && (
                <p id="contacto-nombre-error" className={CLASE_ERROR}>
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contacto-email" className={CLASE_ETIQUETA}>
                Email
              </label>
              <input
                id="contacto-email"
                type="email"
                autoComplete="email"
                className={CLASE_INPUT}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "contacto-email-error" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p id="contacto-email-error" className={CLASE_ERROR}>
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="contacto-empresa" className={CLASE_ETIQUETA}>
              Empresa{" "}
              <span className="text-subtle font-normal">(opcional)</span>
            </label>
            <input
              id="contacto-empresa"
              type="text"
              autoComplete="organization"
              className={CLASE_INPUT}
              aria-invalid={errors.empresa ? true : undefined}
              aria-describedby={errors.empresa ? "contacto-empresa-error" : undefined}
              {...register("empresa")}
            />
            {errors.empresa && (
              <p id="contacto-empresa-error" className={CLASE_ERROR}>
                {errors.empresa.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contacto-mensaje" className={CLASE_ETIQUETA}>
              ¿En qué estás trabajando?
            </label>
            <textarea
              id="contacto-mensaje"
              rows={5}
              className={`${CLASE_INPUT} resize-y`}
              placeholder="Contexto, datos que tienes hoy, qué te gustaría lograr…"
              aria-invalid={errors.mensaje ? true : undefined}
              aria-describedby={errors.mensaje ? "contacto-mensaje-error" : undefined}
              {...register("mensaje")}
            />
            {errors.mensaje && (
              <p id="contacto-mensaje-error" className={CLASE_ERROR}>
                {errors.mensaje.message}
              </p>
            )}
          </div>

          {/*
            Honeypot anti-spam: fuera del flujo visual pero real en el DOM, para
            que los bots lo completen. No es `type="hidden"` a propósito —
            muchos bots ignoran los hidden. Invisible para lectores de pantalla
            y fuera del orden de tabulación, así ningún humano lo llena.
          */}
          <div
            aria-hidden="true"
            className="absolute w-px h-px overflow-hidden opacity-0 -left-[9999px] -top-[9999px]"
          >
            <label htmlFor="contacto-website">
              No completes este campo
            </label>
            <input
              id="contacto-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register(honeypotField)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-lg font-medium hover:bg-zinc-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enviando…" : "Enviar mensaje"}
          </button>

          {/*
            Este texto tiene que describir lo que el código realmente hace: el
            mensaje se procesa vía Resend y llega a una casilla de correo. Decir
            "sin terceros" sería falso.
          */}
          <p className="text-xs text-subtle">
            Tus datos se usan solo para responderte: no los vendo ni te suscribo
            a nada. El envío se procesa vía Resend.
          </p>
        </form>
      )}
    </div>
  );
}
