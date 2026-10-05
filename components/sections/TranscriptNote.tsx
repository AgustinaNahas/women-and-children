import type { Locale } from "@/content/types";

export function TranscriptNote({
  locale,
  title,
  lede,
  excerpt,
  translation,
  translationLabel,
  speaker,
  country,
  date,
}: {
  locale: Locale;
  title: string;
  lede: string;
  excerpt: string;
  translation?: string;
  translationLabel: string;
  speaker: string;
  country: string;
  date: string;
}) {
  return (
    <section
      id="transcript"
      className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] items-start gap-8 px-5 py-[clamp(3rem,8vw,6rem)] max-sheet:grid-cols-1"
      aria-labelledby="transcript-title"
    >
      <header>
        <h2 id="transcript-title" className="m-0">{title}</h2>
        <p className="max-w-[40rem] text-[clamp(1.2rem,2vw,1.45rem)] leading-snug">{lede}</p>
      </header>
      <article className="border border-thread bg-paper p-5 text-ink">
        <ul className="mb-4 flex list-none flex-col gap-[0.15rem] p-0 font-ui text-[0.85rem] text-ink">
          <li>{date}</li>
          <li>{country}</li>
          <li>{speaker}</li>
        </ul>
          <blockquote className="m-0" lang="en">
            <p className="mb-3 max-w-none">{excerpt}</p>
          </blockquote>
          {translation ? (
            <p className="mt-4 max-w-none font-ui text-[0.95rem] leading-snug text-ink" lang={locale}>
              <span className="font-semibold">{translationLabel}. </span>
              {translation}
            </p>
          ) : null}
      </article>
    </section>
  );
}
