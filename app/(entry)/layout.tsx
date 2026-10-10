import type { Metadata, Viewport } from "next";
import { pageUrl, publicPath } from "@/lib/site";
import "../globals.css";

const english = pageUrl("en/");

export const metadata: Metadata = {
  title: "Women and children in the 81st General Assembly",
  description:
    "How the 81st UN General Assembly says “women and children.” Read in English or Spanish.",
  robots: {
    index: false,
    follow: true,
  },
  icons: {
    icon: publicPath("/motif-tile.svg"),
  },
  alternates: {
    languages: {
      en: english,
      es: pageUrl("es/"),
      "x-default": english,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function EntryLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ ["--texture-field" as string]: `url("${publicPath("/tela-negra.jpg")}")` }}>
      <head>
        <noscript>
          <meta httpEquiv="refresh" content={`0;url=${english}`} />
        </noscript>
      </head>
      <body className="bg-field font-text text-lg text-script">{children}</body>
    </html>
  );
}
