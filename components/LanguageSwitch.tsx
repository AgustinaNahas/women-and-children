import Link from "next/link";
import type { Locale } from "@/content/types";
import { publicPath } from "@/lib/site";

export function LanguageSwitch({
  locale,
  label,
  names,
}: {
  locale: Locale;
  label: string;
  names: Record<Locale, string>;
}) {
  const codes: Locale[] = ["en", "es"];
  const fullNames: Record<Locale, string> = { en: "English", es: "Español" };

  return (
    <nav className="flex w-full justify-start gap-1 px-4 sheet:translate-y-0 translate-y-[20vh] pt-3 font-ui max-w-[1200px] mx-auto -mb-18" aria-label={label}>
      {codes.map((code) => (
        <Link
          key={code}
          href={`/${code}`}
          hrefLang={code}
          lang={code}
          className="inline-flex min-h-11 items-center px-[0.7rem] font-text text-xl text-thread no-underline aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[0.28em] gap-2 z-10 relative"
          aria-current={code === locale ? "page" : undefined}
        >
          {code === locale ? <img src={publicPath("/motif-tile.svg")} alt="" className="h-3 w-3" /> : null}
          <span className="sr-only">{fullNames[code]}</span>
          <span aria-hidden="true">{names[code]}</span>
          {code === locale ? <img src={publicPath("/motif-tile.svg")} alt="" className="h-3 w-3" /> : null} 
                  </Link>
      ))}
    </nav>
  );
}
