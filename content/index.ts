import type { Content, Locale } from "./types";
import en from "./en";
import es from "./es";

const dictionaries: Record<Locale, Content> = { en, es };

export function getContent(locale: Locale): Content {
  return dictionaries[locale];
}
