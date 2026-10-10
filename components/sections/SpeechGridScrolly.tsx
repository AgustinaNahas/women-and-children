"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { CrossStitch } from "@/components/CrossStitch";
import { layoutSpeeches, speechGridNarrow, speechGridWide, type SpeechGrid } from "@/content/speech-grid";
import type { Locale } from "@/content/types";
import type { SpeechTile } from "@/lib/speeches";
import { fill } from "@/lib/text";

type Step = {
  id: string;
  title: string;
  body: string;
  figure: string | null;
  caption: string;
};

type Tip = {
  id: string;
  step: number;
  rect: { left: number; top: number; width: number; height: number };
};

export function SpeechGridScrolly({
  locale,
  title,
  squareLabel,
  stitchLabel,
  stitchLabelChildren,
  showing,
  steps,
  summary,
  mentionLabel,
  speeches,
  speechListCaption,
  speakerLabel,
  countryLabel,
  speechTitleLabel,
  mentionNone,
  mentionWomen,
  mentionBoth,
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
  speeches: SpeechTile[];
  speechListCaption: string;
  speakerLabel: string;
  countryLabel: string;
  speechTitleLabel: string;
  mentionNone: string;
  mentionWomen: string;
  mentionBoth: string;
}) {
  const mentionName = { none: mentionNone, women: mentionWomen, both: mentionBoth };
  const sectionRef = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);
  const [activeId, setActiveId] = useState(steps[0]?.id ?? "");
  const active = steps.find((step) => step.id === activeId) ?? steps[0];
  const stepIndex = Math.max(0, steps.findIndex((step) => step.id === active?.id));
  const outlined = active?.id === "outline";
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
      className="mx-auto w-full max-w-[1200px] px-4 py-[clamp(2.5rem,10vw,8rem)] sheet:px-5"
      aria-labelledby="record-title"
    >
      <h2 id="record-title" className="mb-2 text-center font-script text-[clamp(2.4rem,7vw,5rem)] text-balance sheet:-mb-6">
        {title}
      </h2>
      <div className="relative">
        <div className="sticky top-0 z-1 flex h-dvh items-center justify-center">
          <figure className="@container flex max-h-full w-full max-w-xl flex-col justify-start pl-12 sheet:pl-0">
          <ul className="mb-12 flex shrink-0 list-none flex-col justify-start gap-x-5 gap-y-2 p-0 font-ui text-[13px] leading-snug text-script gap-1 min-h-[6rem]">
            <li className="flex items-center gap-2">
              <span className="relative size-7 min-w-7 overflow-visible" aria-hidden="true">
                <ThreadFill />
              </span>
              {squareLabel}
            </li>
            <li className="flex items-center gap-2">
              <span className="relative size-7 min-w-7 overflow-visible" aria-hidden="true">
                <span className="absolute inset-0.5">
                  <StackedStitch hollow={outlined} />
                </span>
              </span>
              {stitchLabel}
            </li>
            {outlined ? (
              <li className="flex items-center gap-2">
                <span className="relative size-7 min-w-7 overflow-visible" aria-hidden="true">
                  <span className="absolute p-0.5">
                    <StitchMark outlined={false} />
                  </span>
                </span>
                {stitchLabelChildren}
              </li>
            ) : null}
          </ul>
          <SpeechChart
            grid={speechGridNarrow}
            speeches={speeches}
            stepIndex={stepIndex}
            stepId={active?.id ?? ""}
            lit={lit}
            className="w-full sheet:hidden"
            style={{
              width: "100%",
              aspectRatio: "auto",
              height: `min(calc(100cqw * ${speechGridNarrow.rows} / ${speechGridNarrow.columns}), calc(100svh - 22rem))`,
              maxHeight: "calc(100svh - 22rem)",
            }}
          />
          <SpeechChart
            grid={speechGridWide}
            speeches={speeches}
            stepIndex={stepIndex}
            stepId={active?.id ?? ""}
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
        <ol className="pointer-events-none relative z-10 -mt-dvh m-0 flex list-none flex-col items-center gap-[18vh] px-0 pt-[14vh] sheet:gap-[36vh] sheet:pt-[30vh]">
          {steps.map((step, index) => (
            <li key={step.id} className={index === steps.length - 1 ? "w-full pb-[72dvh] sheet:px-16 sheet:pb-[100dvh]" : "w-full sheet:px-16"}>
              {step.body ? (
                <article
                  id={step.id}
                  data-step={step.id}
                  className="pointer-events-auto rounded-xl border-2 border-dotted border-white bg-waffle p-4 text-center text-lg text-ink sheet:p-6 sheet:text-xl"
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
      <table className="sr-only">
        <caption>{speechListCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{speakerLabel}</th>
            <th scope="col">{countryLabel}</th>
            <th scope="col">{speechTitleLabel}</th>
            <th scope="col">{mentionLabel}</th>
          </tr>
        </thead>
        <tbody>
          {speeches.map((speech) => (
            <tr key={speech.id}>
              <td>{speech.speaker}</td>
              <td>{speech.country}</td>
              <td>{speech.title}</td>
              <td>{mentionName[speech.mention]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function SpeechChart({
  grid,
  speeches,
  stepIndex,
  stepId,
  lit,
  className,
  style,
}: {
  grid: SpeechGrid;
  speeches: SpeechTile[];
  stepIndex: number;
  stepId: string;
  lit: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const placed = useMemo(() => layoutSpeeches(grid, speeches), [grid, speeches]);
  const outlined = stepId === "outline";
  const quiet = stepId === "asked" || stepId === "outline";
  const stitchedCells = useMemo(() => {
    const cells = new Set<string>();
    if (!quiet) return cells;
    for (const speech of placed) {
      if (speech.mention === "none") continue;
      const cell = stepId === "outline" ? speech.grouped : speech.packed;
      cells.add(`${cell.row}:${cell.col}`);
    }
    return cells;
  }, [placed, quiet, stepId]);
  const [tip, setTip] = useState<Tip | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const activeTip = tip?.step === stepIndex ? tip : null;
  const hovered = activeTip ? placed.find((speech) => speech.id === activeTip.id) : undefined;

  return (
    <div className={`relative ${className ?? ""}`} style={{ aspectRatio: `${grid.columns} / ${grid.rows}`, ...style }}>
      <PercentAxis />
      <div data-chart="" className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="grid h-full w-full gap-0 overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: grid.columns * grid.rows }, (_, index) => {
            const row = Math.floor(index / grid.columns);
            const col = index % grid.columns;
            const dim = quiet && !stitchedCells.has(`${row}:${col}`);
            return (
              <span key={index} className="relative overflow-hidden border-0">
                <ThreadFill dim={dim} />
              </span>
            );
          })}
        </div>
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none! ${lit ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          {placed.map((speech) => {
            const cell = stepId === "pattern" ? speech.pattern : stepId === "outline" ? speech.grouped : speech.packed;
            const hollow = outlined && speech.mention === "women";
            const silent = speech.mention === "none";
            const twin = speech.sharesPattern && stepId === "pattern";

            return (
              <button
                key={speech.id}
                type="button"
                tabIndex={-1}
                data-speech={speech.id}
                className={`absolute overflow-hidden border-0 bg-transparent p-0 transition-[left,top] duration-700 ease-in-out motion-reduce:transition-none! ${twin ? "pointer-events-none" : "cursor-pointer"}`}
                style={{
                  left: `${(cell.col / grid.columns) * 100}%`,
                  top: `${(cell.row / grid.rows) * 100}%`,
                  width: `${100 / grid.columns}%`,
                  height: `${100 / grid.rows}%`,
                  zIndex: silent || twin ? 1 : 2,
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse") return;
                  setTip({ id: speech.id, step: stepIndex, rect: readRect(event.currentTarget) });
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType !== "mouse") return;
                  setTip((current) => (current?.id === speech.id ? null : current));
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
                  setTip((current) => (current?.id === speech.id && current.step === stepIndex ? null : { id: speech.id, step: stepIndex, rect }));
                }}
              >
                <span className={`block h-full w-full ${silent ? "opacity-0" : "opacity-100"}`}>
                  {speech.mention === "women" ? <StackedStitch hollow={hollow} /> : <StitchMark outlined={false} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {hovered && activeTip ? <SpeechTip speech={hovered} rect={activeTip.rect} /> : null}
    </div>
  );
}

function readRect(element: HTMLElement): Tip["rect"] {
  const rect = element.getBoundingClientRect();
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
}

function SpeechTip({ speech, rect }: { speech: SpeechTile; rect: Tip["rect"] }) {
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
  }, [rect, speech, narrow]);

  return createPortal(
    narrow ? (
      <div
        role="tooltip"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 bg-black px-4 py-3 text-center font-text text-base leading-snug text-white"
      >
        {speech.speaker ? <p className="m-0 font-semibold">{speech.speaker}</p> : null}
        <p className="m-0">{speech.title}</p>
        <p className="m-0 text-white/70">{speech.country}</p>
      </div>
    ) : (
      <div
        ref={ref}
        role="tooltip"
        className="pointer-events-none fixed z-50 w-max max-w-[min(18rem,calc(100vw-1.5rem))] rounded-xl border-2 border-dotted border-white bg-[#F6F2E7] px-3 py-2 text-left font-text text-[0.95rem] leading-snug text-ink"
        style={{
          left: pos?.left ?? 0,
          top: pos?.top ?? 0,
          visibility: pos ? "visible" : "hidden",
        }}
      >
        {speech.speaker ? <p className="m-0 font-semibold">{speech.speaker}</p> : null}
        <p className="m-0">{speech.title}</p>
        <p className="m-0 text-ink/70">{speech.country}</p>
      </div>
    ),
    document.body,
  );
}

function PercentAxis() {
  const ticks = [100, 50, 0];

  return (
    <div className="absolute inset-y-0 right-[calc(100%+0.375rem)] w-12" aria-hidden="true">
      <span className="absolute inset-y-0 right-0 w-px bg-script/70" />
      {ticks.map((tick) => (
        <span
          key={tick}
          className="absolute right-0 flex items-center gap-1 font-ui text-[11px] leading-none whitespace-nowrap text-script"
          style={{
            top: `${100 - tick}%`,
            transform: tick === 100 ? "translateY(0)" : tick === 0 ? "translateY(-100%)" : "translateY(-50%)",
          }}
        >
          {tick}%
          <span className="h-px w-1.5 shrink-0 bg-script/70" />
        </span>
      ))}
    </div>
  );
}

function ThreadFill({ dim = false }: { dim?: boolean }) {
  return (
    <span
      className={`absolute -inset-px border-2 border-white/30 bg-waffle bg-center transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${dim ? "opacity-30" : "opacity-100"}`}
    />
  );
}

function StackedStitch({ hollow }: { hollow: boolean }) {
  return (
    <span className="relative block h-full w-full">
      <span
        className={`absolute inset-0 motion-reduce:transition-none! motion-reduce:delay-0! ${
          hollow ? "opacity-100" : "opacity-0 transition-opacity delay-700 duration-0"
        }`}
      >
        <StitchMark outlined />
      </span>
      <span
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none! ${
          hollow ? "opacity-0" : "opacity-100"
        }`}
      >
        <StitchMark outlined={false} />
      </span>
    </span>
  );
}

function StitchMark({ outlined }: { outlined: boolean }) {
  return (
    <CrossStitch
      className="h-full w-full overflow-visible"
      preserveAspectRatio="none"
      fill={outlined ? "none" : "#fff"}
      stroke="#fff"
      strokeWidth={outlined ? 1.25 : 0}
      markClassName="transition-[fill,stroke-width] duration-700 ease-in-out motion-reduce:transition-none!"
    />
  );
}
