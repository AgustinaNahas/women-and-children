import type { MetadataRoute } from "next";
import { locales } from "@/content/types";
import { siteOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  const languages = {
    en: new URL("/en", origin).href,
    es: new URL("/es", origin).href,
    "x-default": new URL("/en", origin).href,
  };

  return locales.map((locale) => ({
    url: new URL(`/${locale}`, origin).href,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
}
