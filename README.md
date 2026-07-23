# Sitio web — Daniela Chávez · Arquitectura de Datos

Landing page de la consultora: presenta servicios, caso de estudio, proceso y portafolio, y captura leads con un formulario que llega por email. Es la **Fase 1** del proyecto (sitio web profesional en Vercel); las fases siguientes —agente de assessment, agente de propuestas— se apoyan sobre este mismo código.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Resend · deploy en Vercel.

---

## Requisitos

- **Node.js ≥ 20.9** (lo exige Next 16). `node -v` para verificar.
- npm (viene con Node).

## Arrancar en local

```bash
cd landingpage
npm install
cp .env.example .env.local     # en PowerShell: copy .env.example .env.local
npm run dev
```

Abrir http://localhost:3000.

El sitio **levanta sin configurar nada**: sin `RESEND_API_KEY` el formulario muestra un mensaje pidiendo escribir al email directo, sin `NEXT_PUBLIC_GA_ID` no se inyecta Analytics y sin `NEXT_PUBLIC_CALENDLY_URL` los botones de agenda caen al mailto. Para probar el envío real de leads hay que completar las variables.

## Scripts

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Servidor de desarrollo con hot reload en http://localhost:3000 |
| `npm run build` | Build de producción — correrlo antes de dar por cerrada una tarea |
| `npm start` | Sirve el build de producción localmente (requiere `npm run build` antes) |
| `npm run lint` | ESLint (config de `eslint-config-next`) |

## Variables de entorno

Se copian de `.env.example` a `.env.local`. **`.env.local` está fuera de git** (`.gitignore` ignora todo `.env*` menos `.env.example`).

| Variable | Para qué sirve | ¿Obligatoria? | ¿Secreta? |
|----------|----------------|---------------|-----------|
| `NEXT_PUBLIC_SITE_URL` | Dominio público del sitio, sin barra final. Se usa para canonical, Open Graph y structured data. Si falta, cae a un placeholder. | En producción sí | No (pública) |
| `RESEND_API_KEY` | API key de Resend para enviar el email del lead. Sin ella el formulario responde 503 con un mensaje que deriva al email. | Sí, para que el formulario funcione | **SÍ** |
| `CONTACTO_FROM` | Remitente verificado en Resend. Por defecto `onboarding@resend.dev` (sandbox, sirve para pruebas). | No | Sí (no exponer) |
| `CONTACTO_TO` | Casilla que recibe los leads. Por defecto, el email de `content/site.ts`. | No | **SÍ** |
| `NEXT_PUBLIC_CALENDLY_URL` | Link de la discovery call de 30 min. Vacío = la UI usa mailto. | No | No (pública) |
| `NEXT_PUBLIC_GA_ID` | ID de la property de Google Analytics 4. Vacío = no se carga el script. | No | No (pública) |

Convención del proyecto (`lib/env.ts`): **una variable definida pero vacía cuenta como ausente**, que es el caso típico de crearla en el panel de Vercel y dejarla en blanco. Y si `NEXT_PUBLIC_SITE_URL` no es una URL válida, se cae al valor por defecto en vez de tumbar el build.

> ⚠️ **Regla de secretos.** Solo las variables con prefijo `NEXT_PUBLIC_` llegan al navegador; el resto vive únicamente en el servidor. Nunca renombrar `RESEND_API_KEY` ni `CONTACTO_TO` con ese prefijo, nunca loguearlas y nunca commitear un `.env.local`. Si una key se filtra, se rota en Resend, no se "borra del historial".

---

## Estructura

```
landingpage/
├── app/
│   ├── layout.tsx            # nav, footer, fuente Inter, metadata global, GA4, JSON-LD
│   ├── page.tsx              # home: ordena las secciones del sitio
│   ├── globals.css           # Tailwind v4 + design tokens (colores, tipografía, foco)
│   ├── icon.svg              # favicon
│   ├── opengraph-image.tsx   # genera el PNG 1200x630 que se ve al compartir el link
│   ├── sitemap.ts            # genera /sitemap.xml
│   ├── robots.ts             # genera /robots.txt (apunta al sitemap)
│   └── api/contacto/route.ts # endpoint del formulario → Resend
├── components/               # Nav, Hero, ProblemaSolucion, CasoEstudio, Servicios,
│                             # Proceso, Diferencial, Portafolio, StackTecnico,
│                             # Contacto + ContactoForm, Footer, Analytics, JsonLd
├── content/                  # ← contenido editable sin tocar markup (ver más abajo)
│   ├── site.ts               # nombre, logotipo, email, redes, links del menú
│   ├── hero.ts               # badge, titular, bajada y textos de los dos botones
│   ├── servicios.ts          # los 7 servicios con plazo y precio
│   ├── caso.ts               # caso de estudio y sus 4 métricas
│   ├── proceso.ts            # los 5 pasos de "cómo trabajo"
│   ├── diferenciales.ts      # diferenciales + listas problema/solución
│   ├── repos.ts              # repos del portafolio
│   └── stack.ts              # tecnologías de la franja del home
├── lib/
│   ├── leads.ts              # contrato y validación del lead (Zod)
│   ├── email.ts              # armado y envío del email vía Resend
│   ├── env.ts                # lectura normalizada de variables de entorno
│   └── seo.ts                # metadata de Next + structured data schema.org
└── public/                   # archivos estáticos — vacío a propósito: la imagen OG
                              # y el favicon se generan por código, no son archivos
```

Los **design tokens** (el color de fondo `#0a0a0f`, el indigo de marca, los grises de texto que cumplen contraste AA, la fuente Inter) están definidos una sola vez en `app/globals.css` dentro del bloque `@theme`. Cambiar ahí un color lo cambia en todo el sitio.

### SEO y metadata

Está resuelto por código, sin archivos estáticos que mantener a mano:

- `lib/seo.ts` arma la metadata de Next (title, description, canonical, Open Graph, Twitter, robots) y el **structured data** de schema.org, derivándolo de `content/site.ts` y `content/servicios.ts`. Agregar un servicio lo agrega también al JSON-LD, sin tocar `lib/seo.ts`.
- `components/JsonLd.tsx` inyecta ese grafo en el HTML inicial, que es lo que lee el crawler.
- `app/opengraph-image.tsx` genera el PNG de 1200x630 en build; Next lo cablea solo como `og:image` y `twitter:image`.
- `app/sitemap.ts` (hoy con la home; el blog está comentado, listo para descomentar) y `app/robots.ts`, que apunta al sitemap con URL absoluta.

Las URLs de todo esto salen de `NEXT_PUBLIC_SITE_URL`: si la variable está mal, el sitemap y el canonical apuntan al dominio equivocado.

---

## Cómo editar el contenido del sitio (sin tocar código de diseño)

Esta sección es para cambiar **textos, precios, servicios y proyectos** sin saber React.

La carpeta `content/` guarda lo que más se edita: el **hero** (lo primero que se ve), los **datos de contacto e identidad**, y las **listas repetibles** — servicios, proyectos del portafolio, pasos del proceso, métricas del caso, diferenciales y tecnologías. Son archivos `.ts`, pero lo único que hay adentro son **fichas**: bloques entre llaves `{ }` con campos tipo `nombre:`, `descripcion:`, `precio:`. El diseño (colores, tarjetas, animaciones) está en otro lado y se genera solo a partir de esas fichas. **Si editás únicamente el texto entre comillas, no podés romper el diseño.**

Lo que **no** está en `content/`: los **títulos de cada sección** (los grandes, tipo "Código real en GitHub." o "¿Tienes datos sin explotar?") y los **rótulos chicos en mayúsculas** de arriba de cada sección ("SERVICIOS", "PROCESO", "DIFERENCIAL"…). Esos viven dentro de los archivos de `components/`, mezclados con el markup. Se pueden cambiar, pero ahí ya conviene pedirle a Bastián que lo haga o que te muestre la línea exacta. (Una excepción: el título del caso de estudio —"Pipeline de riesgo financiero"— sí sale de `content/caso.ts`.)

Tres reglas que evitan el 99% de los errores:

1. El texto siempre va **entre comillas dobles** `"así"`.
2. Cada línea termina con **coma**.
3. No borres ni agregues llaves `{ }` ni corchetes `[ ]` — copiá una ficha entera si querés una nueva.

### Ejemplo 1: cambiar el precio y el plazo de un servicio

Archivo: `content/servicios.ts`

**Antes**

```ts
{
  slug: "finops",
  nombre: "FinOps",
  descripcion: "Visibilidad de costos cloud por equipo + optimización.",
  plazo: "4-6 semanas",
  precio: "$8-18M CLP",
},
```

**Después**

```ts
{
  slug: "finops",
  nombre: "FinOps",
  descripcion: "Visibilidad de costos cloud por equipo + optimización.",
  plazo: "3-5 semanas",
  precio: "$10-20M CLP",
},
```

Guardás, y la tarjeta de FinOps en el sitio ya muestra los valores nuevos. El `slug` es el identificador interno: dejalo como está.

### Ejemplo 2: agregar un proyecto al portafolio

Archivo: `content/repos.ts`. Copiá una ficha existente, pegala debajo y reemplazá los cuatro campos:

```ts
{
  nombre: "Customer 360",
  descripcion: "Vista unificada de cliente sobre Redshift",
  stack: "dbt · Redshift · Airflow",
  url: "https://github.com/Danichavez/customer-360",
},
```

La tarjeta nueva aparece sola en la grilla del portafolio, con el mismo estilo que las demás.

### Dónde está cada texto

| Quiero cambiar… | Archivo |
|-----------------|---------|
| El titular grande, la bajada, el badge "Disponible para nuevos proyectos" y el texto de los dos botones del inicio | `content/hero.ts` |
| Nombre, iniciales del logo, email, LinkedIn, GitHub, links del menú | `content/site.ts` |
| Los servicios (nombre, descripción, plazo, precio) | `content/servicios.ts` |
| El caso de estudio y sus 4 métricas | `content/caso.ts` |
| Los 5 pasos del proceso | `content/proceso.ts` |
| Los diferenciales y las listas "problema / solución" | `content/diferenciales.ts` |
| Los proyectos del portafolio | `content/repos.ts` |
| Las tecnologías de la franja | `content/stack.ts` |
| **Los títulos de cada sección** y los rótulos chicos en mayúsculas | `components/` — están dentro del markup; pedile ayuda a Bastián |

Dos detalles del hero: el titular está partido en dos líneas, `titulo` y `tituloDestacado` — la segunda es la que sale con el degradado indigo→verde. Y en las métricas del caso de estudio, el campo `acento` es el color del número: solo acepta uno de estos cuatro valores, escrito igual y entre comillas — `"brand"` (indigo), `"emerald"` (verde), `"amber"` (ámbar) o `"purple"` (violeta). Cualquier otra palabra ahí rompe el build.

Para ver el cambio antes de publicarlo: `npm run dev` y abrir http://localhost:3000. Si algo se rompe, el error aparece en pantalla indicando el archivo y la línea — casi siempre es una comilla o una coma faltante.

---

## Formulario de contacto

Flujo completo:

```
components/Contacto.tsx      sección con el copy, Calendly/mailto y redes
   └─ ContactoForm.tsx       el formulario en sí (React Hook Form + zodResolver)
        │  POST JSON
        ▼
/api/contacto  (app/api/contacto/route.ts)
        │  1. valida de nuevo contra lib/leads.ts (nunca se confía en el cliente)
        │  2. descarta bots con un campo trampa oculto (honeypot)
        │  3. normaliza el lead y le estampa la hora del servidor
        ▼
lib/email.ts → Resend → casilla de CONTACTO_TO
```

Detalles que importan:

- La validación está **una sola vez** en `lib/leads.ts` y la usan cliente y servidor.
- `ContactoForm` es el único Client Component del flujo; `Contacto` es Server Component. Maneja los estados de envío: botón deshabilitado con "Enviando…" mientras postea, mensaje de éxito con opción de "Enviar otro mensaje", y errores —tanto por campo como generales— anunciados a lectores de pantalla vía `aria-live`. Ante un error, lo que la persona escribió **no se pierde**.
- El email del lead va en `Reply-To`, así que se responde directo desde la bandeja.
- Si `RESEND_API_KEY` no está configurada, el endpoint devuelve 503 con un mensaje que invita a escribir al email público. No revienta ni pierde silenciosamente el lead.
- Los errores del proveedor quedan en los logs del servidor; al visitante solo le llega un mensaje genérico.

**Preparado para la Fase 2.** El contrato de `lib/leads.ts` tiene un campo `tipo` que hoy vale siempre `"contacto"`. Cuando llegue el agente de assessment, se agrega un `leadAssessmentSchema` como segunda variante de la unión discriminada y se cuelga del mismo endpoint: no hay que rediseñar el formulario ni el envío de email.

---

## Deploy

- Hosting: **Vercel** (free tier). El proyecto se conecta al repo de GitHub.
- **Push a `main` = producción.** Cualquier otra rama genera un deploy de preview con su propia URL.
- Las variables de entorno **no se heredan del `.env.local`**: hay que cargarlas también en Vercel (Project → Settings → Environment Variables), al menos `NEXT_PUBLIC_SITE_URL` y `RESEND_API_KEY`. Después de agregarlas hay que redeployar para que tomen efecto.
- Antes de pushear: `npm run build` y `npm run lint` en verde.

---

## Pendientes que bloquean el lanzamiento

Decisiones y accesos que no dependen del código:

- [ ] **Dominio definitivo** — sin él, `NEXT_PUBLIC_SITE_URL` queda en un placeholder y los links canónicos/OG apuntan a un dominio que no existe.
- [ ] **Cuenta de Calendly** — falta la URL real de la discovery call (`NEXT_PUBLIC_CALENDLY_URL`); mientras tanto la agenda cae al mailto.
- [ ] **Property de GA4** — falta el ID de medición (`NEXT_PUBLIC_GA_ID`); hoy no se mide nada.
- [ ] **API key de Resend** + remitente verificado — sin esto el formulario no envía emails. Con dominio propio hay que verificarlo en Resend y cambiar `CONTACTO_FROM`.
- [ ] **Acceso al repo GitHub** (`Danichavez`) — necesario para conectar el deploy de Vercel y para que los links del portafolio apunten a repos públicos existentes.

Pendientes técnicos conocidos:

- [ ] **Blog en MDX** — planificado en el mapa del proyecto, **no implementado**: no existen `app/blog/` ni `content/blog/`. La base ya está preparada: `lib/seo.ts` tiene la plantilla de títulos y `app/sitemap.ts` tiene la ruta `/blog` comentada, lista para descomentar.
- [ ] **Suite de tests** — todavía no hay tests ni framework de testing instalado.
