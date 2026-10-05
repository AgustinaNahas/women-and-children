import type { MetadataRoute } from "next";
import { locales } from "@/content/types";
import { pageUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    en: pageUrl("en/"),
    es: pageUrl("es/"),
    "x-default": pageUrl("en/"),
  };

  return locales.map((locale) => ({
    url: pageUrl(`${locale}/`),
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
}
