import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", origin).href,
    host: origin.origin,
  };
}
