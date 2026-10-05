/** Origen público del sitio. En Vercel usa el dominio de producción. */
export function siteOrigin(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const withSlash = explicit.endsWith("/") ? explicit : `${explicit}/`;
    return new URL(withSlash);
  }

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return new URL(`https://${vercel}/`);

  return new URL("http://localhost:3000/");
}
