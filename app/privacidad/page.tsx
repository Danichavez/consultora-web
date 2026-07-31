import type { Metadata } from "next";

import { site } from "@/content/site";

/**
 * Política de privacidad.
 *
 * ⚠️ Regla que este proyecto ya aprendió a los golpes: **este texto tiene que
 * describir lo que el código realmente hace.** La versión anterior del
 * formulario prometía "sin terceros" mientras mandaba los datos a Resend y
 * cargaba GA4 en la misma página — una afirmación falsa y reclamable.
 *
 * Si cambia el flujo de datos (se agrega una base de datos, se conecta la API
 * de Claude en la Fase 2, se cambia de proveedor de email), **hay que actualizar
 * esta página en el mismo commit.** Cada afirmación de abajo es verificable
 * contra el código:
 *
 *   - campos del formulario  → `lib/leads.ts` (leadContactoSchema)
 *   - envío por email        → `lib/email.ts` (Resend)
 *   - ausencia de base de datos → no hay cliente de DB en el proyecto
 *   - analítica              → `components/Analytics.tsx` (GA4, condicional)
 *   - agenda                 → `components/CalendlyEmbed.tsx` (condicional)
 *   - dirección IP           → `lib/rate-limit.ts` (en memoria, agrupada /64)
 */

export const metadata: Metadata = {
  title: `Política de privacidad — ${site.nombre}`,
  description:
    "Qué datos recolectamos en este sitio, con qué finalidad, quiénes los procesan y cómo ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
};

/** Última revisión del texto. Estático a propósito: es un dato editorial. */
const ULTIMA_ACTUALIZACION = "31 de julio de 2026";

export default function Privacidad() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
        Política de privacidad
      </h1>
      <p className="mt-3 font-mono text-xs text-subtle">
        Última actualización: {ULTIMA_ACTUALIZACION}
      </p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-lg font-medium text-fg">Quiénes somos</h2>
          <p className="mt-3">
            {site.nombre} es una consultora de arquitectura de datos y
            automatización en AWS, con domicilio en {site.ciudad}. Somos
            responsables del tratamiento de los datos que se describen acá.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-fg">Qué datos recolectamos</h2>
          <p className="mt-3">
            Si completás el formulario de contacto, recolectamos exactamente
            cuatro datos, y ninguno más:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Tu nombre</li>
            <li>Tu correo electrónico</li>
            <li>Tu rol en la empresa</li>
            <li>El principal desafío que seleccionaste</li>
          </ul>
          <p className="mt-3">
            El formulario no pide teléfono, dirección, RUT ni datos de tu
            empresa. No usamos cookies de publicidad ni de perfilamiento, y no
            compramos ni enriquecemos estos datos con fuentes externas.
          </p>
          <p className="mt-3">
            Además, para evitar el abuso automatizado del formulario, nuestro
            servidor cuenta temporalmente las solicitudes por dirección IP. Ese
            conteo vive en la memoria del proceso, se agrupa por rango en lugar
            de guardar la dirección exacta, y se borra solo a los pocos minutos.
            No queda registrado junto a tu mensaje ni se usa para identificarte.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-fg">Para qué los usamos</h2>
          <p className="mt-3">
            Únicamente para responderte y coordinar una conversación. No te
            suscribimos a ninguna lista, no te enviamos newsletter y no
            vendemos, cedemos ni compartimos tus datos con terceros para fines
            comerciales.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-fg">
            Quiénes más los procesan
          </h2>
          <p className="mt-3">
            No tenemos base de datos: tu mensaje se convierte en un correo y
            queda en nuestra casilla. Para que eso funcione intervienen estos
            proveedores, todos fuera de Chile:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-fg">Resend</strong> — entrega el correo
              con tus respuestas a nuestra casilla.
            </li>
            <li>
              <strong className="text-fg">Vercel</strong> — aloja el sitio y
              procesa la solicitud del formulario.
            </li>
            <li>
              <strong className="text-fg">Google Analytics 4</strong> — mide el
              uso del sitio de forma agregada. Recolecta datos de navegación,
              no el contenido del formulario.
            </li>
            <li>
              <strong className="text-fg">Calendly</strong> — si agendás una
              conversación, los datos de esa reserva los procesa Calendly bajo
              su propia política.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-fg">Cuánto los conservamos</h2>
          <p className="mt-3">
            Conservamos los correos de contacto mientras exista una conversación
            comercial en curso o razonablemente previsible. Podés pedirnos que
            los borremos en cualquier momento y lo hacemos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-fg">Tus derechos</h2>
          <p className="mt-3">
            Conforme a la Ley 19.628 y a la Ley 21.719 de protección de datos
            personales, podés pedirnos acceder a tus datos, corregirlos,
            eliminarlos u oponerte a su tratamiento. Escribinos a{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-brand-500 underline underline-offset-4 hover:text-brand-600"
            >
              {site.email}
            </a>{" "}
            y respondemos dentro de los plazos legales.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-fg">Cambios</h2>
          <p className="mt-3">
            Si cambiamos cómo tratamos los datos, actualizamos esta página y la
            fecha de arriba.
          </p>
        </section>
      </div>
    </div>
  );
}
