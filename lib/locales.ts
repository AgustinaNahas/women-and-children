import { locales, type Locale } from "@/content/types";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}
