/** Prefijo público. Vacío en local; en GitHub Pages es /women-and-children. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Ruta de un archivo de `public/`, con el prefijo del sitio. */
export function publicPath(file: string): string {
  const path = file.startsWith("/") ? file : `/${file}`;
  return `${basePath}${path}`;
}

/** Origen público del sitio, con barra final. Incluye el prefijo de Pages. */
export function siteOrigin(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const withSlash = explicit.endsWith("/") ? explicit : `${explicit}/`;
    return new URL(withSlash);
  }

  return new URL("http://localhost:3000/");
}

/** URL absoluta de una ruta del sitio. `path` no lleva barra inicial. */
export function pageUrl(path: string): string {
  const relative = path.replace(/^\//, "");
  return new URL(relative, siteOrigin()).href;
}
