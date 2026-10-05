import Link from "next/link";
import type { Locale } from "@/content/types";

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

  return (
    <nav className="flex w-full justify-center gap-1 px-4 pt-3 font-ui" aria-label={label}>
      {codes.map((code) => (
        <Link
          key={code}
          href={`/${code}`}
          hrefLang={code}
          lang={code}
          className="inline-flex min-h-11 items-center px-[0.7rem] font-text text-xl text-thread no-underline aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[0.28em] gap-2"
          aria-current={code === locale ? "page" : undefined}
        >
          {code === locale ? <img src="/motif-tile.svg" alt="" className="h-3 w-3" /> : null}
          {names[code]}
          {code === locale ? <img src="/motif-tile.svg" alt="" className="h-3 w-3" /> : null} 
                  </Link>
      ))}
    </nav>
  );
}
