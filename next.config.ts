import type { NextConfig } from "next";

/**
 * Headers de seguridad de base.
 *
 * No se incluye CSP a propósito: el script inline de GA4 (`components/Analytics.tsx`)
 * exigiría nonce por request, lo que obliga a renderizado dinámico y tira abajo
 * el prerenderizado estático de la home. Queda para una segunda pasada, junto
 * con la decisión sobre consentimiento de analítica.
 */
const securityHeaders = [
  // Nada de adivinar el tipo de contenido a partir del cuerpo de la respuesta.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Evita que embeban el sitio (y el formulario) en un iframe ajeno.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
