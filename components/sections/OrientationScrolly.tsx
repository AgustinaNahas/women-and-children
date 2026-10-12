"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CrossStitch } from "@/components/CrossStitch";
import type { OrientationMention } from "@/lib/portrayals";

const BLUE = "#7E99B4";
const GREEN = "#5D7E62";

// 30 celestes y 2 verdes: una puntada por mención de «mujeres y niños».
const PATTERN = [
  "-XX-XX-",
  "XX-X-XX",
  "XXX-XXX",
  "-Y---Y-",
  "XXX-XXX",
  "XX-X-XX",
  "-XX-XX-",
] as const;

const STAGE_COLS = 16;
const STAGE_ROWS = 9;
const MOTIF_COL = 4;
const MOTIF_ROW = 1;
const GREEN_COL = 8;
const BAR_TOP = 1;
const BAR_BOTTOM = 7;

type Kind = "blue" | "green";
type StepId = "motif" | "bars";
type Tip = {
  id: string;
  rect: { left: number; top: number; width: number; height: number };
};

type Mark = {
  id: string;
  col: number;
  row: number;
  kind: Kind;
  order: number;
  barIndex: number;
};

function buildMarks(): Mark[] {
  const list: Mark[] = [];
  let blue = 0;
  let green = 0;

  PATTERN.forEach((line, row) => {
    [...line].forEach((cell, col) => {
      if (cell === "-") return;
      const kind: Kind = cell === "Y" ? "green" : "blue";
      list.push({
        id: `${row}-${col}`,
        col,
        row,
        kind,
        order: list.length,
        barIndex: kind === "green" ? green++ : blue++,
      });
    });
  });

  return list;
}

const marks = buildMarks();
const blueCount = marks.filter((mark) => mark.kind === "blue").length;
const BLUE_ROWS = BAR_BOTTOM - BAR_TOP + 1;
const BLUE_COLS = Math.max(1, Math.ceil(blueCount / BLUE_ROWS));
const BLUE_COL = STAGE_COLS - BLUE_COLS;
const blueRowsUsed = Math.ceil(blueCount / BLUE_COLS);
const blueLabelRow = BAR_BOTTOM - blueRowsUsed;

function slot(col: number, row: number) {
  return {
    left: `${(col / STAGE_COLS) * 100}%`,
    top: `${(row / STAGE_ROWS) * 100}%`,
    width: `${100 / STAGE_COLS}%`,
    height: `${100 / STAGE_ROWS}%`,
  };
}

function barSlot(mark: Mark) {
  if (mark.kind === "green") return slot(GREEN_COL + mark.barIndex, BAR_BOTTOM);
  const col = mark.barIndex % BLUE_COLS;
  const fromBottom = Math.floor(mark.barIndex / BLUE_COLS);
  return slot(BLUE_COL + col, BAR_BOTTOM - fromBottom);
}

function placeMentions(mentions: OrientationMention[]) {
  const policy = mentions.filter((mention) => mention.kind === "policy");
  const rhetorical = mentions.filter((mention) => mention.kind === "rhetorical");
  let policyIndex = 0;
  let rhetoricalIndex = 0;

  return marks.flatMap((mark) => {
    const mention = mark.kind === "green" ? policy[policyIndex++] : rhetorical[rhetoricalIndex++];
    if (!mention) return [];
    return [{ ...mark, mention }];
  });
}

function readRect(element: HTMLElement): Tip["rect"] {
  const rect = element.getBoundingClientRect();
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}

export function OrientationScrolly({
  title,
  policyLabel,
  rhetoricalLabel,
  policyShare,
  rhetoricalShare,
  body,
  mentions,
}: {
  title: string;
  policyLabel: string;
  rhetoricalLabel: string;
  policyShare: string;
  rhetoricalShare: string;
  body: string;
  mentions: OrientationMention[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const [step, setStep] = useState<StepId>("motif");
  const [tip, setTip] = useState<Tip | null>(null);
  const bars = step === "bars";
  const placed = useMemo(() => placeMentions(mentions), [mentions]);
  const open = tip ? placed.find((mark) => mark.id === tip.id) : undefined;

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const nodes = () => [...root.querySelectorAll<HTMLElement>("[data-step]")];

    const update = () => {
      const mid = window.innerHeight / 2;
      let best: { id: StepId; dist: number } | null = null;

      for (const node of nodes()) {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - mid);
        const id = node.getAttribute("data-step");
        if ((id === "motif" || id === "bars") && (!best || dist < best.dist)) best = { id, dist };
      }

      if (best) setStep(best.id);
    };

    const observer = new IntersectionObserver(update, { threshold: [0, 0.5, 1] });
    nodes().forEach((node) => observer.observe(node));
    observer.observe(root);

    const hideTip = () => setTip(null);

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("scroll", hideTip, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("scroll", hideTip);
      window.removeEventListener("resize", update);
    };
  }, []);

  const live = bars
    ? `${rhetoricalShare} ${rhetoricalLabel}. ${policyShare} ${policyLabel}. ${body}`
    : `${title}. ${policyLabel}. ${rhetoricalLabel}.`;

  return (
    <section ref={sectionRef} id="orientation" className="w-full" aria-labelledby="orientation-title">
      <div className="relative">
        <div className="sticky top-0 z-0 flex h-dvh flex-col px-5 pt-[clamp(1.25rem,3.5vh,2.75rem)] pb-6">
          <h2
            id="orientation-title"
            className="m-0 shrink-0 text-center font-script text-[clamp(2.6rem,7vw,5rem)] leading-none font-normal text-balance"
          >
            {title}
          </h2>
          <ul className="mx-auto mt-4 flex min-h-8 shrink-0 list-none flex-wrap justify-center gap-x-6 gap-y-2 p-0 font-ui text-[15px] text-script sheet:gap-x-8">
            <LegendItem color={GREEN} label={policyLabel} />
            <LegendItem color={BLUE} label={rhetoricalLabel} />
          </ul>
          <div className="relative min-h-0 flex-1">
            <div
              className="@container absolute inset-0 m-auto max-w-full [--orientation-offset:10rem] min-[640px]:[--orientation-offset:25rem]"
              style={{
                aspectRatio: `${STAGE_COLS} / ${STAGE_ROWS}`,
                width: `min(100%, calc((100svh - var(--orientation-offset)) * ${STAGE_COLS} / ${STAGE_ROWS}))`,
                maxHeight: "100%",
              }}
            >
              {placed.map((mark) => {
                const place = bars ? barSlot(mark) : slot(MOTIF_COL + mark.col, MOTIF_ROW + mark.row);
                const kindLabel = mark.mention.kind === "policy" ? policyLabel : rhetoricalLabel;
                return (
                  <button
                    key={mark.id}
                    type="button"
                    className="absolute cursor-pointer border-0 bg-transparent p-0 transition-[left,top] duration-700 ease-in-out motion-reduce:transition-none motion-reduce:opacity-100!"
                    style={{
                      ...place,
                      animationName: bars ? "none" : "stitch-fade-in",
                      animationDuration: "1s",
                      animationTimingFunction: "ease-in-out",
                      animationFillMode: "both",
                      animationTimeline: bars ? "auto" : "view()",
                      animationRange: `entry ${4 + mark.order * 0.28}% entry ${24 + mark.order * 0.28}%`,
                    }}
                    aria-label={`${mark.mention.country}. ${kindLabel}`}
                    aria-describedby={open?.id === mark.id ? "orientation-tip" : undefined}
                    onPointerEnter={(event) => {
                      if (event.pointerType !== "mouse") return;
                      setTip({ id: mark.id, rect: readRect(event.currentTarget) });
                    }}
                    onPointerLeave={(event) => {
                      if (event.pointerType !== "mouse") return;
                      setTip((current) => (current?.id === mark.id ? null : current));
                    }}
                    onPointerDown={(event) => {
                      pointerStart.current = { x: event.clientX, y: event.clientY };
                    }}
                    onPointerUp={(event) => {
                      if (event.pointerType === "mouse") return;
                      const origin = pointerStart.current;
                      pointerStart.current = null;
                      if (!origin || Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 8) return;
                      const rect = readRect(event.currentTarget);
                      setTip((current) => (current?.id === mark.id ? null : { id: mark.id, rect }));
                    }}
                    onFocus={(event) => setTip({ id: mark.id, rect: readRect(event.currentTarget) })}
                    onBlur={() => setTip((current) => (current?.id === mark.id ? null : current))}
                  >
                    <span className="grid h-full min-h-0 w-full grid-cols-2 grid-rows-2 self-stretch" aria-hidden="true">
                        {Array.from({ length: 4 }, (_, stitch) => (
                          <CrossStitch key={stitch} className={`h-full w-full min-h-0 ${stitch > 1 ? "-translate-y-1" : ""} ${stitch % 2 != 0 ? "-translate-x-1" : ""}`} fill={mark.kind === "green" ? GREEN : BLUE} />
                        ))}
                    </span>
                  </button>
                );
              })}
              <p
                className={`pointer-events-none absolute m-0 flex items-end justify-center text-center font-script leading-none text-script transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${bars ? "opacity-100 delay-300" : "opacity-0"}`}
                style={{ ...slot(BLUE_COL, blueLabelRow), width: `${(BLUE_COLS / STAGE_COLS) * 100}%` }}
                aria-hidden={bars ? undefined : true}
              >
                <span className="text-[clamp(1.35rem,7cqi,4.2rem)]">{rhetoricalShare}</span>
              </p>
              <p
                className={`pointer-events-none absolute m-0 flex items-end justify-center text-center font-script leading-none text-script transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${bars ? "opacity-100 delay-300" : "opacity-0"}`}
                style={{
                  left: `${((GREEN_COL - 1) / STAGE_COLS) * 100}%`,
                  top: `${((BAR_BOTTOM - 1) / STAGE_ROWS) * 100}%`,
                  width: `${(4 / STAGE_COLS) * 100}%`,
                  height: `${100 / STAGE_ROWS}%`,
                }}
                aria-hidden={bars ? undefined : true}
              >
                <span className="text-[clamp(1.15rem,5cqi,2.8rem)]">{policyShare}</span>
              </p>
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {live}
          </p>
          {open && tip ? (
            <OrientationTip
              country={open.mention.country}
              label={open.mention.kind === "policy" ? policyLabel : rhetoricalLabel}
              color={open.kind === "green" ? GREEN : BLUE}
              rect={tip.rect}
            />
          ) : null}
        </div>
        <div className="pointer-events-none relative z-10" style={{ marginTop: "-80dvh" }}>
          <div data-step="motif" className="h-dvh" />
          <div data-step="bars" className="pt-[40dvh] pb-[20dvh]">
            <p className="pointer-events-auto m-0 max-w-[28rem] px-5 font-text text-base leading-snug text-script sheet:w-[min(35rem,40vw)] sheet:max-w-none sheet:pl-16 sheet:text-[clamp(1.2rem,1.7vw,1.65rem)]">
              {body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrientationTip({
  country,
  label,
  color,
  rect,
}: {
  country: string;
  label: string;
  color: string;
  rect: Tip["rect"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [narrow, setNarrow] = useState(false);

  useLayoutEffect(() => {
    const query = window.matchMedia("(max-width: 45rem)");
    const apply = () => setNarrow(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useLayoutEffect(() => {
    if (narrow) return;
    const element = ref.current;
    if (!element) return;
    const margin = 12;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    let left = rect.left + rect.width / 2 - width / 2;
    const maxLeft = window.innerWidth - width - margin;
    if (left < margin) left = margin;
    if (left > maxLeft) left = Math.max(margin, maxLeft);
    let top = rect.top - height - margin;
    if (top < margin) top = Math.min(rect.top + rect.height + margin, window.innerHeight - height - margin);
    setPos({ left, top });
  }, [rect, country, label, narrow]);

  return createPortal(
    narrow ? (
      <div
        id="orientation-tip"
        role="tooltip"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 bg-black px-4 py-3 text-center font-text text-base leading-snug text-white"
      >
        <p className="m-0 font-semibold">{country}</p>
        <p className="m-0" style={{ color }}>{label}</p>
      </div>
    ) : (
      <div
        ref={ref}
        id="orientation-tip"
        role="tooltip"
        className="pointer-events-none fixed z-50 w-max max-w-[min(18rem,calc(100vw-1.5rem))] rounded-xl border-2 border-dotted border-white bg-[#F6F2E7] px-3 py-2 text-left font-text text-[0.95rem] leading-snug text-ink"
        style={{
          left: pos?.left ?? 0,
          top: pos?.top ?? 0,
          visibility: pos ? "visible" : "hidden",
        }}
      >
        <p className="m-0 font-semibold">{country}</p>
        <p className="m-0" style={{ color }}>{label}</p>
      </div>
    ),
    document.body,
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <CrossStitch className="size-5 shrink-0" fill={color} />
      {label}
    </li>
  );
}
