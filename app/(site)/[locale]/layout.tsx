import type { Metadata } from "next";
import { Alegreya, Open_Sans, Pinyon_Script } from "next/font/google";
import { Footer } from "@/components/Footer";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { StitchPattern } from "@/components/sections/StitchPattern";
import { databaseHref } from "@/content/bibliography";
import { flowerPattern } from "@/content/flower-pattern";
import { heroBottomLeftPattern, heroTopRightPattern } from "@/content/hero-pattern";
import { getContent } from "@/content";
import { locales, type Locale } from "@/content/types";
import { isLocale } from "@/lib/locales";
import { pageUrl, publicPath, siteOrigin } from "@/lib/site";
import "../../globals.css";

const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const alegreya = Alegreya({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-text",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};

  const content = getContent(raw);
  const origin = new URL(siteOrigin().origin);
  const canonical = pageUrl(`${raw}/`);

  return {
    metadataBase: origin,
    title: content.meta.title,
    description: content.meta.description,
    applicationName: content.meta.title,
    authors: content.footer.credits.map((credit) => ({ name: credit.names })),
    alternates: {
      canonical,
      languages: {
        en: pageUrl("en/"),
        es: pageUrl("es/"),
        "x-default": pageUrl("en/"),
      },
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: canonical,
      siteName: content.header.script,
      locale: raw === "es" ? "es_ES" : "en_US",
      alternateLocale: raw === "es" ? ["en_US"] : ["es_ES"],
      type: "article",
    },
    twitter: {
      card: "summary",
      title: content.meta.title,
      description: content.meta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const content = getContent(locale);
  const origin = siteOrigin();
  const url = pageUrl(`${locale}/`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.meta.title,
    description: content.meta.description,
    url,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: content.header.script,
      url: origin.href,
      inLanguage: ["en", "es"],
    },
    about: {
      "@type": "Dataset",
      name: content.footer.databaseLabel,
      description: content.meta.description,
      url: databaseHref,
      isAccessibleForFree: true,
    },
  };

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${pinyon.variable} ${alegreya.variable} ${openSans.variable} scroll-smooth scheme-dark motion-reduce:scroll-auto`}
      style={{ ["--texture-field" as string]: `url("${publicPath("/tela-negra.jpg")}")` }}
    >
      <body className="bg-field font-text text-lg leading-relaxed text-script">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:px-3 focus:py-2 focus:text-ink"
        >
          {content.ui.skipLabel}
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <header
          className="relative flex min-h-[85vh] flex-col overflow-x-hidden bg-linen bg-contain pb-6 text-center text-ink"
          style={{ backgroundImage: `url("${publicPath("/tela.png")}")` }}
        >
          <LanguageSwitch
            locale={locale}
            label={content.ui.languageLabel}
            names={content.ui.languages}
          />
          <div className="flex flex-1 flex-col justify-center gap-[clamp(0.75rem,2vh,1.5rem)] px-5 ">
            <div className="flex w-full min-w-0 translate-x-8 justify-end overflow-hidden">
              <StitchPattern rows={heroTopRightPattern.rows} tile={heroTopRightPattern.tile} reveal />
            </div>
            <div className="w-full mx-auto max-w-[1200px]">
              <h1 className="mt-2 block font-script text-[clamp(3.25rem,14vw,9.375rem)] leading-none font-normal text-balance text-thread text-left">
                {content.header.script}
              </h1>
              <p className="mt-3 max-w-xl text-left font-text text-[clamp(1.35rem,5vw,2.25rem)] leading-snug font-normal text-balance text-thread">
                {content.header.title}
              </p>
            </div>
            <div className="flex w-full items-end justify-between gap-4">
              <div className="flex w-auto min-w-0 flex-1 -translate-x-8 justify-start overflow-hidden">
                <StitchPattern rows={heroBottomLeftPattern.rows} tile={heroBottomLeftPattern.tile} reveal />
              </div>
              <div className="flex shrink-0 items-end gap-3">
                {Array.from({ length: flowerPattern.repeat }, (_, index) => (
                  <StitchPattern key={index} rows={flowerPattern.rows} tile={flowerPattern.tile} reveal />
                ))}
              </div>
            </div>
          </div>
        </header>
        {children}
        <Footer content={content.footer} />
      </body>
    </html>
  );
}
