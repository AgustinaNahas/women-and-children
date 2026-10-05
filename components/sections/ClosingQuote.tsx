import type { Locale } from "@/content/types";

export function ClosingQuote({
  locale,
  text,
  translation,
  translationLabel,
  speaker,
  country,
}: {
  locale: Locale;
  text: string;
  translation?: string;
  translationLabel: string;
  speaker: string;
  country: string;
}) {
  return (
    <section id="closing" className="mx-auto w-full max-w-6xl px-5 py-[clamp(3rem,8vw,6rem)]" aria-label={speaker}>
      <blockquote className="mx-auto max-w-[38rem] border border-thread bg-paper px-6 py-7 text-ink" lang="en">
          <p className="mb-3 max-w-none">{text}</p>
          <footer>
            <cite className="font-ui text-[0.9rem] not-italic">{`${speaker}, ${country}`}</cite>
          </footer>
      </blockquote>
      {translation ? (
        <p className="mx-auto mt-4 max-w-[38rem] font-ui text-[0.95rem] leading-snug text-thread-soft" lang={locale}>
          <span className="font-semibold">{translationLabel}. </span>
          {translation}
        </p>
      ) : null}
    </section>
  );
}
