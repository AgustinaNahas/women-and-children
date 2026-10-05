"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/content/types";
import { publicPath } from "@/lib/site";

export type QuoteCard = {
  slug: string;
  text: string;
  translation?: string;
  depth: number;
  speaker: string;
  country: string;
};

const PLACES = [
  { left: "5%", top: "0%", width: "31%", speed: 0.08 },
  { left: "63%", top: "3%", width: "29%", speed: 0.72 },
  { left: "41%", top: "22%", width: "26%", speed: 0.2 },
  { left: "1%", top: "33%", width: "33%", speed: 1.15 },
  { left: "32%", top: "48%", width: "28%", speed: 0.05 },
  { left: "62%", top: "42%", width: "30%", speed: 0.52 },
  { left: "8%", top: "68%", width: "28%", speed: 0.34 },
  { left: "48%", top: "74%", width: "28%", speed: 0.14 },
] as const;

const PHRASE = /women and children|women, children/i;

export function Quotes({
  locale,
  title,
  quotes,
  translationLabel,
}: {
  locale: Locale;
  title: string;
  quotes: QuoteCard[];
  translationLabel: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageHeight =
    quotes.length > 6
      ? "sheet:h-[108vh] 2xl:h-[135vh]"
      : "sheet:h-[92vh] 2xl:h-[115vh]";

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 45rem)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const frozen = motion.matches || narrow.matches;
      const rect = section.getBoundingClientRect();
      const total = window.innerHeight + section.offsetHeight;
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total));

      section.querySelectorAll<HTMLElement>("[data-speed]").forEach((card) => {
        const speed = Number(card.dataset.speed ?? 0);
        if (frozen || !speed) {
          card.style.transform = "";
          return;
        }
        const shift = -(progress - 0.22) * speed * window.innerHeight;
        card.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    motion.addEventListener("change", update);
    narrow.addEventListener("change", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motion.removeEventListener("change", update);
      narrow.removeEventListener("change", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="words"
      ref={sectionRef}
      className="relative overflow-visible px-4 py-16 sheet:px-4 sheet:pt-[8vh] sheet:pb-[8vh]"
      aria-labelledby="words-title"
    >
      <h2
        id="words-title"
        className="mb-8 text-center font-script text-[clamp(2.6rem,7vw,5rem)] leading-none font-normal text-balance sheet:sr-only"
      >
        {title}
      </h2>
      <div
        className={`relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 2xl:max-w-[90rem] sheet:block ${stageHeight}`}
      >
        {quotes.map((quote, index) => {
          const place = PLACES[index % PLACES.length]!;

          return (
            <LaceQuote
              key={quote.slug}
              quote={quote}
              locale={locale}
              translationLabel={translationLabel}
              place={place}
            />
          );
        })}
      </div>
    </section>
  );
}

function LaceQuote({
  quote,
  locale,
  translationLabel,
  place,
}: {
  quote: QuoteCard;
  locale: Locale;
  translationLabel: string;
  place: (typeof PLACES)[number];
}) {
  return (
    <figure
      data-speed={place.speed}
      className="relative flex w-full max-w-[24rem] flex-col items-center justify-center bg-[length:100%_100%] bg-center bg-no-repeat px-[15%] py-[13%] sheet:absolute sheet:block sheet:aspect-[694/446] sheet:w-(--q-w) sheet:max-w-none sheet:px-0 sheet:py-0 sheet:left-(--q-l) sheet:top-(--q-t)"
      style={
        {
          "--q-l": place.left,
          "--q-t": place.top,
          "--q-w": place.width,
          backgroundImage: `url("${publicPath("/puntilla.png")}")`,
        } as CSSProperties
      }
    >
      <blockquote
        className="m-0 flex w-full flex-col items-center justify-center gap-2 text-center text-ink sheet:absolute sheet:top-[22%] sheet:right-[16%] sheet:bottom-[24%] sheet:left-[16%] sheet:w-auto"
        lang="en"
      >
        <p className="m-0 font-text text-[1.05rem] leading-snug text-thread sheet:text-[clamp(calc(0.72rem-2px),calc(0.95vw-2px),calc(0.98rem-2px))] 2xl:text-[clamp(calc(0.9rem-2px),calc(1.2vw-2px),calc(1.25rem-2px))]">
          {emphasize(quote.text)}
        </p>
        <footer>
          <cite className="font-text text-sm not-italic text-thread sheet:text-[calc(0.72rem-2px)] 2xl:text-[calc(1rem-2px)]">
            <span className="sheet:sr-only">{`${quote.speaker}. `}</span>
            {quote.country}
          </cite>
        </footer>
      </blockquote>
      {quote.translation ? (
        <p className="mt-2 mb-0 max-w-[28ch] text-center font-text text-sm leading-snug text-thread sheet:sr-only" lang={locale}>
          {`${translationLabel}. ${quote.translation}`}
        </p>
      ) : null}
    </figure>
  );
}

function emphasize(text: string): ReactNode {
  const match = text.match(PHRASE);
  if (!match || match.index === undefined) return text;
  const start = match.index;
  return (
    <>
      {text.slice(0, start)}
      <strong className="font-semibold text-thread">{match[0]}</strong>
      {text.slice(start + match[0].length)}
    </>
  );
}
