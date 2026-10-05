"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/content/types";
import { CrossStitch } from "@/components/CrossStitch";
import type { PortrayalKind, PortrayalMention } from "@/lib/portrayals";

const PHRASE = /women\s*(?:,\s*)?(?:and\s+)?children|children\s*(?:,\s*)?(?:and\s+)?women/gi;

const COLUMNS = 8;
const ROW_FACTOR = 1.42;

const COLOR: Record<PortrayalKind, string> = {
  agents: "#7E99B4",
  mixed: "#B2987F",
  victims: "#A61C1F",
};

const RANK: Record<PortrayalKind, number> = {
  agents: 0,
  mixed: 1,
  victims: 2,
};

const INK = "#d5d3cf";

type PlacedMention = PortrayalMention & {
  source: number;
  sorted: number;
};

type StepId = "order" | "grouped" | "share";

type Tip = {
  source: number;
  quote: string;
  speaker: string;
  title: string;
  rect: { left: number; top: number; width: number; height: number };
};

function highlight(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = new RegExp(PHRASE.source, "gi");
  let last = 0;

  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      <strong key={start} className="font-semibold text-thread">
        {match[0]}
      </strong>,
    );
    last = start + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function place(mentions: PortrayalMention[]): PlacedMention[] {
  const ranked = mentions
    .map((mention, source) => ({ mention, source }))
    .sort((a, b) => RANK[a.mention.kind] - RANK[b.mention.kind] || a.source - b.source);
  const sortedAt = new Map(ranked.map((item, index) => [item.source, index]));

  return mentions.map((mention, source) => ({
    ...mention,
    source,
    sorted: sortedAt.get(source) ?? source,
  }));
}

function share(count: number, total: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(total === 0 ? 0 : count / total);
}

export function PortrayalScrolly({
  locale,
  agentsLabel,
  mixedLabel,
  victimsLabel,
  intro,
  grouped,
  card,
  mentions,
}: {
  locale: Locale;
  agentsLabel: string;
  mixedLabel: string;
  victimsLabel: string;
  intro: string;
  grouped: string;
  card: string;
  mentions: PortrayalMention[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const hideTip = useRef(0);
  const [step, setStep] = useState<StepId>("order");
  const [tip, setTip] = useState<Tip | null>(null);
  const [pinned, setPinned] = useState<PlacedMention | null>(null);
  const placed = place(mentions);
  const rows = Math.max(1, Math.ceil(placed.length / COLUMNS));
  const counts: Record<PortrayalKind, number> = { agents: 0, mixed: 0, victims: 0 };
  for (const mention of placed) counts[mention.kind] += 1;

  const labels: Record<PortrayalKind, string> = {
    agents: agentsLabel,
    mixed: mixedLabel,
    victims: victimsLabel,
  };
  const sorted = step !== "order";
  const braced = step === "share";
  const live = step === "share" ? card : step === "grouped" ? grouped : intro;

  useEffect(() => {
    const nodes = () => [...(sectionRef.current?.querySelectorAll<HTMLElement>("[data-step]") ?? [])];

    const update = () => {
      const mid = window.innerHeight / 2;
      let best: { id: StepId; dist: number } | null = null;

      for (const node of nodes()) {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - mid);
        const id = node.getAttribute("data-step");
        if ((id === "order" || id === "grouped" || id === "share") && (!best || dist < best.dist)) {
          best = { id, dist };
        }
      }

      if (best) setStep(best.id);
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    const observer = new IntersectionObserver(update, { threshold: [0, 0.5, 1] });
    nodes().forEach((node) => observer.observe(node));
    const hide = () => setTip(null);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", hide);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(hideTip.current);
    };
  }, []);

  return (
    <section ref={sectionRef} id="portrayal" className="mx-auto w-full max-w-6xl px-5" aria-labelledby="portrayal-title">
      <h2 id="portrayal-title" className="sr-only">
        {intro}
      </h2>
      <div className="relative">
        <div className="sticky top-0 z-0 flex h-dvh items-center justify-center">
          <div
            className="@container mx-auto w-full max-w-5xl"
            style={{ width: `min(100%, calc((100svh - 18rem) * ${COLUMNS} / ${rows * ROW_FACTOR}))` }}
          >
            <ul className="mb-4 flex list-none flex-wrap justify-center gap-x-5 gap-y-2 p-0 font-ui text-[15px] text-script sheet:gap-x-8">
              {(["agents", "mixed", "victims"] as const).map((kind) => (
                <li key={kind} className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLOR[kind] }} aria-hidden="true" />
                  <span>
                    {labels[kind]}
                    {sorted ? (
                      <span className="ml-1.5 tabular-nums sheet:sr-only">{share(counts[kind], placed.length, locale)}</span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
            <div className="relative sheet:pt-[2.85rem] sheet:pl-[4.6rem]">
              <div className="relative w-full" style={{ aspectRatio: `${COLUMNS} / ${rows * ROW_FACTOR}` }}>
                <Braces
                  shown={braced}
                  rows={rows}
                  counts={counts}
                  total={placed.length}
                  locale={locale}
                />
                {placed.map((mention) => {
                  const index = sorted ? mention.sorted : mention.source;
                  const column = index % COLUMNS;
                  const row = Math.floor(index / COLUMNS);

                  const openTip = (element: HTMLElement) => {
                    window.clearTimeout(hideTip.current);
                    const rect = element.getBoundingClientRect();
                    setTip({
                      source: mention.source,
                      quote: mention.quote,
                      speaker: mention.speaker,
                      title: mention.title,
                      rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
                    });
                  };

                  return (
                    <button
                      key={mention.source}
                      type="button"
                      className="@container absolute m-0 grid cursor-pointer grid-rows-[auto_minmax(0,1fr)] justify-items-center gap-px overflow-hidden border-0 bg-transparent p-0.5 transition-[left,top] duration-700 ease-in-out motion-reduce:transition-none!"
                      style={{
                        width: `${100 / COLUMNS}%`,
                        height: `${100 / rows}%`,
                        left: `${(column / COLUMNS) * 100}%`,
                        top: `${(row / rows) * 100}%`,
                      }}
                      aria-label={`${mention.iso}, ${labels[mention.kind]}`}
                      aria-expanded={pinned?.source === mention.source}
                      aria-controls="portrayal-detail"
                      aria-describedby={tip?.source === mention.source ? "portrayal-tip" : undefined}
                      onMouseEnter={(event) => openTip(event.currentTarget)}
                      onMouseLeave={() => {
                        hideTip.current = window.setTimeout(() => setTip(null), 140);
                      }}
                      onFocus={(event) => openTip(event.currentTarget)}
                      onBlur={() => setTip(null)}
                      onClick={() => {
                        const touch =
                          window.matchMedia("(max-width: 45rem), (hover: none), (pointer: coarse)").matches;
                        if (!touch) return;
                        setTip(null);
                        setPinned((current) => (current?.source === mention.source ? null : mention));
                      }}
                    >
                      <span
                        className="max-w-full self-end truncate font-ui leading-none tracking-[0.04em]"
                        style={{ color: INK, fontSize: "clamp(0.55rem, 30cqi, 0.78rem)" }}
                      >
                        {mention.iso}
                      </span>
                      <span className="grid h-full min-h-0 w-full grid-cols-2 grid-rows-2 self-stretch" aria-hidden="true">
                        {Array.from({ length: 4 }, (_, stitch) => (
                          <CrossStitch key={stitch} className="h-full w-full min-h-0" fill={COLOR[mention.kind]} />
                        ))}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 min-h-[6.5rem] sheet:mt-8 sheet:min-h-[7.5rem]">
              <article
                id="portrayal-detail"
                className="mx-auto max-w-xl rounded-xl border-2 border-dotted border-white bg-[#F6F2E7] p-4 text-center font-text text-lg leading-snug text-ink sheet:p-6 sheet:text-xl"
              >
                {pinned ? (
                  <>
                    <p className="m-0">{highlight(pinned.quote)}</p>
                    <p className="mt-3 mb-0 border-t border-ink/15 pt-2 font-ui text-[0.82rem] leading-snug">
                      <span className="block font-semibold">{pinned.iso}</span>
                      <span className="block">{pinned.speaker}</span>
                      <span className="block">{pinned.title}</span>
                    </p>
                  </>
                ) : (
                  <p className="m-0">{live}</p>
                )}
              </article>
            </div>
            <p className="sr-only" aria-live="polite">
              {live}
            </p>
          </div>
        </div>
        {tip ? (
          <QuoteTip
            quote={tip.quote}
            speaker={tip.speaker}
            title={tip.title}
            rect={tip.rect}
            onEnter={() => window.clearTimeout(hideTip.current)}
            onLeave={() => setTip(null)}
          />
        ) : null}
        <div className="pointer-events-none relative z-10 -mt-dvh">
          <div data-step="order" className="h-[78dvh] sheet:h-[100vh]" />
          <div data-step="grouped" className="h-[78dvh] sheet:h-[100vh]" />
          <div data-step="share" className="h-[88dvh] sheet:h-[110vh]" />
        </div>
      </div>
    </section>
  );
}

function Braces({
  shown,
  rows,
  counts,
  total,
  locale,
}: {
  shown: boolean;
  rows: number;
  counts: Record<PortrayalKind, number>;
  total: number;
  locale: string;
}) {
  const groups: { kind: PortrayalKind; start: number; count: number }[] = [
    { kind: "agents", start: 0, count: counts.agents },
    { kind: "mixed", start: counts.agents, count: counts.mixed },
    { kind: "victims", start: counts.agents + counts.mixed, count: counts.victims },
  ];

  return (
    <div
      className={`pointer-events-none absolute inset-0 hidden text-[#d5d3cf] transition-opacity duration-700 ease-in-out motion-reduce:transition-none! sheet:block ${shown ? "opacity-100 delay-300" : "opacity-0 delay-0"}`}
      aria-hidden="true"
    >
      {groups.map((group) => {
        if (group.count === 0) return null;
        const startRow = Math.floor(group.start / COLUMNS);
        const endRow = Math.floor((group.start + group.count - 1) / COLUMNS);
        const label = share(group.count, total, locale);

        if (startRow === endRow) {
          return (
            <div
              key={group.kind}
              className="absolute flex flex-col items-center justify-end"
              style={{
                left: `${((group.start % COLUMNS) / COLUMNS) * 100}%`,
                width: `${(group.count / COLUMNS) * 100}%`,
                bottom: "100%",
                height: "2.7rem",
              }}
            >
              <span className="font-text text-[clamp(0.85rem,2.4cqi,1.05rem)] leading-none">{label}</span>
              <Brace className="mt-1 h-3.5 w-[92%]" />
            </div>
          );
        }

        const fromRow = group.start % COLUMNS === 0 ? startRow : startRow + 1;
        if (fromRow > endRow) return null;

        return (
          <div
            key={group.kind}
            className="absolute flex items-center justify-end gap-1.5 pr-1"
            style={{
              top: `${(fromRow / rows) * 100}%`,
              height: `${((endRow - fromRow + 1) / rows) * 100}%`,
              right: "100%",
              width: "4.5rem",
            }}
          >
            <span className="font-text text-[clamp(1rem,2.8cqi,1.45rem)] leading-none">{label}</span>
            <SideBrace className="h-[94%] w-4 shrink-0" />
          </div>
        );
      })}
    </div>
  );
}

const BRACE =
  "M22.5 0C17.6697 0 14.2288 3.47408 11.8154 9.20312C9.3992 14.9392 7.93617 23.0916 7.11719 32.8105C5.47831 52.2599 6.40559 78.1749 7.59277 104.05C8.78086 129.944 10.2297 155.8 9.64746 175.187C9.35618 184.884 8.55649 192.922 6.97852 198.521C6.18906 201.323 5.21564 203.473 4.0459 204.914C2.88821 206.34 1.55511 207.055 0 207.055V208.431C1.55516 208.431 2.88818 209.146 4.0459 210.571C5.21567 212.012 6.18905 214.162 6.97852 216.964C8.5565 222.564 9.35618 230.601 9.64746 240.299C10.2297 259.686 8.78087 285.541 7.59277 311.436C6.40558 337.311 5.47828 363.225 7.11719 382.675C7.93618 392.394 9.39915 400.546 11.8154 406.282C14.2288 412.011 17.6697 415.485 22.5 415.485V414.485C18.2776 414.485 15.0939 411.489 12.7373 405.895C10.3837 400.307 8.93098 392.283 8.11426 382.591C6.48178 363.218 7.40304 337.369 8.59082 311.481C9.77771 285.613 11.2302 259.704 10.6465 240.269C10.3548 230.555 9.55431 222.416 7.94141 216.692C7.13542 213.832 6.11524 211.534 4.82227 209.941C3.96386 208.884 2.97748 208.134 1.85742 207.742C2.97733 207.351 3.96395 206.601 4.82227 205.544C6.11521 203.952 7.13543 201.653 7.94141 198.793C9.55429 193.069 10.3547 184.93 10.6465 175.217C11.2302 155.781 9.77771 129.872 8.59082 104.004C7.40304 78.116 6.48181 52.2676 8.11426 32.8945C8.93097 23.2027 10.3838 15.1779 12.7373 9.59082C15.0939 3.99667 18.2776 1 22.5 1V0Z";

function Brace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 416 23" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d={BRACE} fill="#F6F2E7" transform="translate(416 0) rotate(90)" />
    </svg>
  );
}

function SideBrace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 23 416" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d={BRACE} fill="#F6F2E7" />
    </svg>
  );
}

function QuoteTip({
  quote,
  speaker,
  title,
  rect,
  onEnter,
  onLeave,
}: {
  quote: string;
  speaker: string;
  title: string;
  rect: Tip["rect"];
  onEnter: () => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const text = quote;

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const margin = 12;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    let left = rect.left + rect.width / 2 - width / 2;
    const maxLeft = window.innerWidth - width - margin;
    if (left < margin) left = Math.min(Math.max(margin, rect.left), maxLeft);
    if (left > maxLeft) left = Math.max(margin, Math.min(maxLeft, rect.left + rect.width - width));
    let top = rect.top - height - margin;
    if (top < margin) top = Math.min(rect.top + rect.height + margin, window.innerHeight - height - margin);
    setPos({ left, top });
  }, [rect, text, speaker, title]);

  return createPortal(
    <div
      ref={ref}
      id="portrayal-tip"
      role="tooltip"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="fixed z-50 w-[min(22rem,calc(100vw-1.5rem))] rounded-xl border-2 border-dotted border-white bg-[#F6F2E7] px-4 py-3 text-left font-text text-[0.98rem] leading-snug text-ink"
      style={{
        left: pos?.left ?? 0,
        top: pos?.top ?? 0,
        visibility: pos ? "visible" : "hidden",
      }}
    >
      <p className="m-0">{highlight(text)}</p>
      <p className="mt-3 mb-0 border-t border-ink/15 pt-2 font-ui text-[0.82rem] leading-snug">
        <span className="block font-semibold">{speaker}</span>
        <span className="block">{title}</span>
      </p>
    </div>,
    document.body,
  );
}
