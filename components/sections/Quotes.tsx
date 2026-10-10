"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
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
const GROW = "560ms cubic-bezier(0.16, 1, 0.3, 1)";
const LACE = { width: 623, height: 400 };

function fitLace(viewportWidth: number, viewportHeight: number): Origin {
  const ratio = LACE.width / LACE.height;
  const maxWidth = viewportWidth * 0.8;
  const maxHeight = viewportHeight * 0.8;
  let width = maxWidth;
  let height = width / ratio;
  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }
  return {
    top: (viewportHeight - height) / 2,
    left: (viewportWidth - width) / 2,
    width,
    height,
  };
}

type Origin = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function Quotes({
  locale,
  title,
  quotes,
  translationLabel,
  closeLabel,
}: {
  locale: Locale;
  title: string;
  quotes: QuoteCard[];
  translationLabel: string;
  closeLabel: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<{ quote: QuoteCard; origin: Origin } | null>(null);
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

  useEffect(() => {
    if (open) return;
    pendingFocus.current?.focus();
    pendingFocus.current = null;
  }, [open]);

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
              hidden={open?.quote.slug === quote.slug}
              onOpen={(origin, opener) => {
                openerRef.current = opener;
                setOpen({ quote, origin });
              }}
            />
          );
        })}
      </div>
      {open ? (
        <QuoteStage
          quote={open.quote}
          origin={open.origin}
          locale={locale}
          translationLabel={translationLabel}
          closeLabel={closeLabel}
          onClose={() => {
            pendingFocus.current = openerRef.current;
            setOpen(null);
          }}
        />
      ) : null}
    </section>
  );
}

function LaceQuote({
  quote,
  locale,
  translationLabel,
  place,
  hidden,
  onOpen,
}: {
  quote: QuoteCard;
  locale: Locale;
  translationLabel: string;
  place: (typeof PLACES)[number];
  hidden: boolean;
  onOpen: (origin: Origin, opener: HTMLButtonElement) => void;
}) {
  const quoteId = `quote-${quote.slug}`;

  return (
    <div
      className={`flex w-full max-w-[24rem] flex-col items-center gap-3 sheet:contents ${hidden ? "invisible" : ""}`}
      inert={hidden ? true : undefined}
    >
      <figure
        data-speed={place.speed}
        className="@container relative aspect-[623/400] w-full bg-[length:100%_100%] bg-center bg-no-repeat sheet:absolute sheet:block sheet:aspect-[694/446] sheet:w-(--q-w) sheet:max-w-none sheet:left-(--q-l) sheet:top-(--q-t)"
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
          id={quoteId}
          className="absolute top-[20%] right-[16%] bottom-[18%] left-[16%] m-0 flex flex-col items-center justify-center text-center text-ink sheet:top-[26%] sheet:right-[18%] sheet:bottom-[24%] sheet:left-[18%] sheet:w-auto sheet:gap-2"
          lang="en"
        >
          <p className="m-0 font-text text-[clamp(0.78rem,4.4cqi,1rem)] leading-snug text-thread sheet:pt-4 sheet:text-[clamp(calc(0.72rem-2px),calc(0.95vw-2px),calc(0.98rem-2px))] 2xl:text-[clamp(calc(0.9rem-2px),calc(1.2vw-2px),calc(1.25rem-2px))]">
            {emphasize(quote.text)}
          </p>
          <footer className="max-sheet:hidden">
            <cite className="font-text text-sm not-italic text-thread sheet:text-[calc(0.72rem-2px)]">
              <span className="sr-only">{`${quote.speaker}. `}</span>
              {quote.country}
            </cite>
          </footer>
        </blockquote>
        <button
          type="button"
          className="absolute inset-0 cursor-pointer border-0 bg-transparent p-0"
          aria-haspopup="dialog"
          aria-expanded={hidden}
          aria-labelledby={quoteId}
          tabIndex={hidden ? -1 : undefined}
          onClick={(event) => {
            const figure = event.currentTarget.parentElement;
            if (!figure) return;
            const rect = figure.getBoundingClientRect();
            onOpen(
              { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
              event.currentTarget,
            );
          }}
        />
      </figure>
      <p className="m-0 max-w-[34ch] px-1 text-center font-text text-[0.95rem] leading-snug text-script sheet:sr-only" lang={locale}>
        <span className="block sheet:hidden">{`${quote.speaker}. ${quote.country}`}</span>
        {quote.translation ? <span className="mt-1 block">{`${translationLabel}. ${quote.translation}`}</span> : null}
      </p>
    </div>
  );
}

function QuoteStage({
  quote,
  origin,
  locale,
  translationLabel,
  closeLabel,
  onClose,
}: {
  quote: QuoteCard;
  origin: Origin;
  locale: Locale;
  translationLabel: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const closeRef = useRef<() => void>(() => {});
  const closing = useRef(false);
  const reduce = useRef(false);
  const timer = useRef(0);
  const [grown, setGrown] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [narrow, setNarrow] = useState(false);
  const textId = "quote-stage-text";

  onCloseRef.current = onClose;
  closeRef.current = () => {
    if (closing.current) return;
    closing.current = true;
    if (reduce.current || window.matchMedia("(max-width: 45rem)").matches) {
      onCloseRef.current();
      return;
    }
    setGrown(false);
    timer.current = window.setTimeout(() => onCloseRef.current(), 620);
  };

  useLayoutEffect(() => {
    const measure = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      setNarrow(window.matchMedia("(max-width: 45rem)").matches);
    };
    measure();
    window.addEventListener("resize", measure);
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = reduce.current ? 0 : window.setTimeout(() => setGrown(true), 32);
    if (reduce.current) setGrown(true);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const gap = window.innerWidth - root.clientWidth;
    const previousOverflow = root.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    root.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      root.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, []);

  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      const closeButton = closeButtonRef.current;
      if (!panel || !closeButton) return;
      event.preventDefault();
      const active = document.activeElement;
      if (event.shiftKey) {
        (active === closeButton ? panel : closeButton).focus();
        return;
      }
      (active === panel ? closeButton : panel).focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(timer.current);
    };
  }, []);

  const fitted = fitLace(viewport.width, viewport.height);
  const frame: CSSProperties = grown
    ? fitted
    : { top: origin.top, left: origin.left, width: origin.width, height: origin.height };

  if (narrow) {
    return createPortal(
      <div className="fixed inset-0 z-[70]">
        <div className="absolute inset-0 bg-black" onClick={() => closeRef.current()} />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={textId}
          tabIndex={-1}
          className="absolute top-1/2 left-1/2 max-h-[92dvh] w-[min(92vw,26rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto outline-none"
          onClick={() => closeRef.current()}
        >
          <CloseQuote closeLabel={closeLabel} buttonRef={closeButtonRef} onClose={() => closeRef.current()} />
          <div
            className="@container relative aspect-[623/400] w-full bg-[length:100%_100%] bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${publicPath("/puntilla.png")}")` }}
          >
            <blockquote
              className="absolute top-[20%] right-[16%] bottom-[18%] left-[16%] m-0 flex flex-col items-center justify-center text-center"
              lang="en"
            >
              <p id={textId} className="m-0 font-text text-[clamp(0.85rem,4.6cqi,1.15rem)] leading-snug text-thread">
                {emphasize(quote.text)}
              </p>
            </blockquote>
          </div>
          <p className="mt-4 mb-2 px-2 text-center font-text text-base leading-snug text-script" lang={locale}>
            <span className="block">{`${quote.speaker}. ${quote.country}`}</span>
            {quote.translation ? (
              <span className="mt-2 block">{`${translationLabel}. ${quote.translation}`}</span>
            ) : null}
          </p>
        </div>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[70] cursor-pointer">
      <div
        className="absolute inset-0 bg-black"
        style={{
          opacity: grown ? 1 : 0,
          transition: reduce.current ? undefined : `opacity ${GROW}`,
        }}
        onClick={() => closeRef.current()}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={textId}
        tabIndex={-1}
        className="absolute overflow-hidden bg-[length:100%_100%] bg-center bg-no-repeat outline-none"
        style={{
          ...frame,
          backgroundImage: `url("${publicPath("/puntilla.png")}")`,
          transition: reduce.current ? undefined : `top ${GROW}, left ${GROW}, width ${GROW}, height ${GROW}`,
        }}
        onClick={() => closeRef.current()}
      >
        <CloseQuote closeLabel={closeLabel} buttonRef={closeButtonRef} onClose={() => closeRef.current()} />
        <blockquote
          className="absolute top-[22%] right-[18%] bottom-[22%] left-[18%] m-0 flex flex-col items-center justify-center gap-[clamp(0.75rem,2vh,1.5rem)] text-center"
          lang="en"
        >
          <p
            id={textId}
            className="m-0 font-text leading-snug text-thread"
            style={{
              fontSize: grown ? "clamp(1.45rem, 3.15vw, 2.85rem)" : "clamp(0.72rem, 0.95vw, 1.05rem)",
              transition: reduce.current ? undefined : `font-size ${GROW}`,
            }}
          >
            {emphasize(quote.text)}
          </p>
          <footer>
            <cite
              className="font-text not-italic text-thread"
              style={{
                fontSize: grown ? "clamp(1rem, 1.7vw, 1.4rem)" : "0.72rem",
                transition: reduce.current ? undefined : `font-size ${GROW}`,
              }}
            >
              <span className="sr-only">{`${quote.speaker}. `}</span>
              {quote.country}
            </cite>
          </footer>
          {quote.translation ? (
            <p
              className="m-0 max-w-[36ch] font-text leading-snug text-thread"
              lang={locale}
              style={{
                fontSize: grown ? "clamp(0.95rem, 1.45vw, 1.25rem)" : "0.72rem",
                transition: reduce.current ? undefined : `font-size ${GROW}`,
              }}
            >
              {`${translationLabel}. ${quote.translation}`}
            </p>
          ) : null}
        </blockquote>
      </div>
    </div>,
    document.body,
  );
}

function CloseQuote({
  closeLabel,
  buttonRef,
  onClose,
}: {
  closeLabel: string;
  buttonRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={closeLabel}
      className="absolute top-2 right-2 z-10 inline-flex size-11 items-center justify-center font-text text-3xl leading-none text-thread"
      onClick={(event) => {
        event.stopPropagation();
        onClose();
      }}
    >
      <span aria-hidden="true">×</span>
    </button>
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
