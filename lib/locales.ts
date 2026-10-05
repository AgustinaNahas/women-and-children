import { locales, type Locale } from "@/content/types";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return "en";

  for (const part of header.split(",")) {
    const tag = part.trim().split(";")[0]?.toLowerCase() ?? "";
    if (!tag || tag === "*") continue;
    if (tag.startsWith("es")) return "es";
    if (tag.startsWith("en")) return "en";
  }

  return "en";
}
