"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getContent } from "@/content";
import { isLocale } from "@/lib/locales";

export default function NotFound() {
  const params = useParams();
  const raw = typeof params.locale === "string" ? params.locale : "";
  const content = getContent(isLocale(raw) ? raw : "en");

  return (
    <main id="content" className="mx-auto w-full max-w-[40rem] px-5 py-[clamp(3rem,8vw,6rem)]">
      <h1 className="font-script text-5xl font-normal">{content.ui.notFoundTitle}</h1>
      <p>
        <Link href="/en" hrefLang="en" lang="en">
          English
        </Link>
        {" · "}
        <Link href="/es" hrefLang="es" lang="es">
          Español
        </Link>
      </p>
    </main>
  );
}
