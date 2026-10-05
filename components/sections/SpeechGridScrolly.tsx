"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { CrossStitch } from "@/components/CrossStitch";
import { speechGridNarrow, speechGridWide, type SpeechGrid } from "@/content/speech-grid";
import type { Locale } from "@/content/types";
import { publicPath } from "@/lib/site";
import { fill } from "@/lib/text";

type Step = {
  id: string;
  title: string;
  body: string;
  figure: string | null;
  caption: string;
};

type Mark = { index: number; col: number; row: number };

function stitches(grid: SpeechGrid): Mark[] {
  const marks: Mark[] = [];

  grid.pattern.forEach((line, row) => {
    if (row >= grid.rows) return;
    [...line].forEach((cell, col) => {
      if (col >= grid.columns || cell !== "x") return;
      marks.push({ index: marks.length, col, row });
    });
  });

  return marks;
}

const wideMarks = stitches(speechGridWide);
const narrowMarks = stitches(speechGridNarrow);
const THREAD = `url("${publicPath("/hilo.png")}")`;

function sameParity(row: number, col: number) {
  return row % 2 === col % 2;
}

export function SpeechGridScrolly({
  locale,
  title,
  squareLabel,
  stitchLabel,
  stitchLabelChildren,
  showing,
  steps,
  summary,
  scannedLabel,
  mentionLabel,
  filledLabel,
  tableCaption,
  groupLabel,
  valueLabel,
  source,
  scanned,
  withWomen,
  phrase,
}: {
  locale: Locale;
  title: string;
  squareLabel: string;
  stitchLabel: string;
  stitchLabelChildren: string;
  showing: string;
  steps: Step[];
  summary: string;
  scannedLabel: string;
  mentionLabel: string;
  filledLabel: string;
  tableCaption: string;
  groupLabel: string;
  valueLabel: string;
  source: string;
  scanned: number;
  withWomen: number;
  phrase: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);
  const [activeId, setActiveId] = useState(steps[0]?.id ?? "");
  const active = steps.find((step) => step.id === activeId) ?? steps[0];
  const stepIndex = Math.max(0, steps.findIndex((step) => step.id === active?.id));
  const packed = stepIndex >= 1;
  const outlined = stepIndex >= 2;
  useEffect(() => {
    const nodes = () => [...(sectionRef.current?.querySelectorAll<HTMLElement>("[data-step]") ?? [])];
    const charts = () => [...(sectionRef.current?.querySelectorAll<HTMLElement>("[data-chart]") ?? [])];

    const update = () => {
      const mid = window.innerHeight / 2;
      let best: { id: string; dist: number } | null = null;

      for (const node of nodes()) {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - mid);
        const id = node.getAttribute("data-step") ?? "";
        if (id && (!best || dist < best.dist)) best = { id, dist };
      }

      if (best) setActiveId(best.id);

      const fully = charts().some((chart) => {
        const rect = chart.getBoundingClientRect();
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          rect.top >= -1 &&
          rect.left >= -1 &&
          rect.bottom <= window.innerHeight + 1 &&
          rect.right <= window.innerWidth + 1
        );
      });
      setLit((current) => (current === fully ? current : fully));
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
    charts().forEach((chart) => observer.observe(chart));

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="record"
      ref={sectionRef}
      className="mx-auto w-full max-w-6xl px-4 py-[clamp(2.5rem,10vw,8rem)] sheet:px-5"
      aria-labelledby="record-title"
    >
      <h2 id="record-title" className="mb-2 text-center font-script text-[clamp(2.4rem,7vw,5rem)] text-balance sheet:-mb-6">
        {title}
      </h2>
      <div className="relative">
        <div className="sticky top-0 z-0 flex h-dvh items-center justify-center">
          <figure className="flex max-h-full w-full max-w-2xl flex-col justify-center">
          <ul className="mb-3 flex shrink-0 list-none flex-wrap justify-start gap-x-5 gap-y-2 p-0 font-ui text-[15px] leading-snug text-script">
            <li className="flex items-center gap-2">
              <span className="relative size-8 shrink-0 overflow-hidden" aria-hidden="true">
                <ThreadFill turned={false} />
              </span>
              {squareLabel}
            </li>
            <li className="flex items-center gap-2">
              <span className="relative size-9 shrink-0 overflow-hidden" aria-hidden="true">
                <span className="absolute inset-0">
                  <StitchMark outlined={false} />
                </span>
              </span>
              {outlined ? stitchLabelChildren : stitchLabel}
            </li>
          </ul>
          <SpeechChart
            grid={speechGridNarrow}
            marks={narrowMarks}
            packed={packed}
            outlined={outlined}
            lit={lit}
            className="mx-auto sheet:hidden"
            style={{
              width: `min(100%, calc((100svh - 14rem) * ${speechGridNarrow.columns} / ${speechGridNarrow.rows}))`,
              maxHeight: "calc(100svh - 14rem)",
            }}
          />
          <SpeechChart
            grid={speechGridWide}
            marks={wideMarks}
            packed={packed}
            outlined={outlined}
            lit={lit}
            className="hidden w-full sheet:block"
          />
          {active ? (
            <figcaption className="mt-5 flex shrink-0 items-center justify-center gap-3 text-center sheet:mt-8 sheet:gap-4">
              {active.figure ? (
                <p className="font-script text-[clamp(2.75rem,12vw,6.5rem)] leading-none text-script">{active.figure}</p>
              ) : null}
              <p
                className={
                  active.figure
                    ? "max-w-[16rem] text-left font-text text-lg leading-snug sheet:text-2xl"
                    : "mx-auto max-w-md text-center font-text text-xl leading-snug text-balance sheet:text-3xl"
                }
              >
                {active.caption}
              </p>
            </figcaption>
          ) : null}
          <p className="sr-only" aria-live="polite">
            {active
              ? `${active.title ? `${fill(showing, { label: active.title }, locale)}. ` : ""}${active.figure ? `${active.figure} ` : ""}${active.caption}`
              : summary}
          </p>
          </figure>
        </div>
        <ol className="relative z-10 -mt-dvh m-0 flex list-none flex-col items-center gap-[18vh] px-0 pt-[14vh] sheet:gap-[36vh] sheet:pt-[30vh]">
          {steps.map((step, index) => (
            <li key={step.id} className={index === steps.length - 1 ? "w-full pb-[72dvh] sheet:px-16 sheet:pb-[100dvh]" : "w-full sheet:px-16"}>
              {step.body ? (
                <article
                  id={step.id}
                  data-step={step.id}
                  className="rounded-xl border-2 border-dotted border-white bg-waffle p-4 text-center text-lg text-white sheet:p-6 sheet:text-xl"
                >
                  {step.title ? (
                    <h3 className="mb-3 font-text text-[clamp(1.6rem,3vw,2.2rem)]">{step.title}</h3>
                  ) : null}
                  <p>{step.body}</p>
                </article>
              ) : (
                <div id={step.id} data-step={step.id} className="min-h-[32vh] sheet:min-h-[48vh]" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function SpeechChart({
  grid,
  marks,
  packed,
  outlined,
  lit,
  className,
  style,
}: {
  grid: SpeechGrid;
  marks: Mark[];
  packed: boolean;
  outlined: boolean;
  lit: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const outlineFrom = Math.max(0, marks.length - grid.outlineCount);

  return (
    <div
      data-chart=""
      className={`relative overflow-hidden bg-waffle ${className ?? ""}`}
      style={{ aspectRatio: `${grid.columns} / ${grid.rows}`, ...style }}
      aria-hidden="true"
    >
      <div
        className="grid h-full w-full gap-0 overflow-hidden bg-waffle"
        style={{
          gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: grid.columns * grid.rows }, (_, index) => {
          const col = index % grid.columns;
          const row = Math.floor(index / grid.columns);

          return (
            <span key={index} className="relative overflow-hidden border-0">
              <ThreadFill turned={!sameParity(row, col)} />
            </span>
          );
        })}
      </div>
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none! ${lit ? "opacity-100" : "opacity-0"}`}
      >
        {marks.map((mark) => {
          const packedCol = mark.index % grid.columns;
          const packedRow = Math.floor(mark.index / grid.columns);
          const stays = packedCol === mark.col && packedRow === mark.row;
          const becomesOutline = mark.index >= outlineFrom;
          const hideFill = becomesOutline && outlined;

          return (
            <span key={mark.index} className="contents">
              {stays ? null : (
                <StitchSlot grid={grid} col={mark.col} row={mark.row} shown={!packed} fade>
                  <StitchMark outlined={false} />
                </StitchSlot>
              )}
              <StitchSlot
                grid={grid}
                col={stays ? mark.col : packedCol}
                row={stays ? mark.row : packedRow}
                shown={stays ? !hideFill : packed && !hideFill}
                fade
                slow={hideFill}
              >
                <StitchMark outlined={false} />
              </StitchSlot>
              {becomesOutline ? (
                <StitchSlot
                  grid={grid}
                  col={stays ? mark.col : packedCol}
                  row={stays ? mark.row : packedRow}
                  shown={outlined && (stays || packed)}
                  fade
                  delayIn={false}
                  slow
                >
                  <StitchMark outlined />
                </StitchSlot>
              ) : null}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function StitchSlot({
  grid,
  col,
  row,
  shown,
  fade,
  delayIn = true,
  slow = false,
  children,
}: {
  grid: SpeechGrid;
  col: number;
  row: number;
  shown: boolean;
  fade: boolean;
  delayIn?: boolean;
  slow?: boolean;
  children: ReactNode;
}) {
  const duration = slow ? "duration-700" : "duration-[400ms]";
  const delay = fade && delayIn && shown ? "delay-[400ms]" : "delay-0";

  return (
    <span
      className={
        fade
          ? `pointer-events-none absolute overflow-hidden transition-opacity ease-in-out motion-reduce:transition-none! motion-reduce:delay-0! ${duration} ${shown ? "opacity-100" : "opacity-0"} ${delay}`
          : "pointer-events-none absolute overflow-hidden opacity-100"
      }
      style={{
        left: `${(col / grid.columns) * 100}%`,
        top: `${(row / grid.rows) * 100}%`,
        width: `${100 / grid.columns}%`,
        height: `${100 / grid.rows}%`,
      }}
    >
      {children}
    </span>
  );
}

function ThreadFill({ turned }: { turned: boolean }) {
  return (
    <span
      className={turned ? "absolute -inset-px rotate-90 border-0 bg-cover bg-center" : "absolute -inset-px border-0 bg-cover bg-center"}
      style={{ backgroundImage: THREAD }}
    />
  );
}

function StitchMark({ outlined }: { outlined: boolean }) {
  return (
    <CrossStitch
      className="h-full w-full"
      preserveAspectRatio="none"
      fill={outlined ? "none" : "#fff"}
      stroke="#fff"
      strokeWidth={outlined ? 1.25 : 0}
      markClassName="transition-[fill,stroke-width] duration-700 ease-in-out motion-reduce:transition-none!"
    />
  );
}
