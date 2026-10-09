"use client";

import { useEffect, useRef, useState } from "react";
import { CrossStitch } from "@/components/CrossStitch";

const BLUE = "#7E99B4";
const GREEN = "#5D7E62";

const PATTERN = [
  "-XX--XX-",
  "X--XX--X",
  "X-X--X-X",
  "-XXYYXX-",
  "X-X--X-X",
  "X--XX--X",
  "-XX--XX-",
] as const;

const STAGE_COLS = 16;
const STAGE_ROWS = 9;
const MOTIF_COL = 4;
const MOTIF_ROW = 1;
const BLUE_COL = 12;
const BLUE_ROW = 1;
const GREEN_COL = 8;
const GREEN_ROW = 7;

type Kind = "blue" | "green";
type StepId = "motif" | "bars";

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

function slot(col: number, row: number) {
  return {
    left: `${(col / STAGE_COLS) * 100}%`,
    top: `${(row / STAGE_ROWS) * 100}%`,
    width: `${100 / STAGE_COLS}%`,
    height: `${100 / STAGE_ROWS}%`,
  };
}

function barSlot(mark: Mark) {
  if (mark.kind === "green") return slot(GREEN_COL + mark.barIndex, GREEN_ROW);
  return slot(BLUE_COL + (mark.barIndex % 4), BLUE_ROW + Math.floor(mark.barIndex / 4));
}

export function OrientationScrolly({
  title,
  policyLabel,
  rhetoricalLabel,
  policyShare,
  rhetoricalShare,
  body,
}: {
  title: string;
  policyLabel: string;
  rhetoricalLabel: string;
  policyShare: string;
  rhetoricalShare: string;
  body: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState<StepId>("motif");
  const bars = step === "bars";

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

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
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
              {marks.map((mark) => {
                const place = bars ? barSlot(mark) : slot(MOTIF_COL + mark.col, MOTIF_ROW + mark.row);
                return (
                  <span
                    key={mark.id}
                    className="absolute transition-[left,top] duration-700 ease-in-out motion-reduce:transition-none motion-reduce:opacity-100!"
                    style={{
                      ...place,
                      animationName: bars ? "none" : "stitch-fade-in",
                      animationDuration: "1s",
                      animationTimingFunction: "ease-in-out",
                      animationFillMode: "both",
                      animationTimeline: bars ? "auto" : "view()",
                      animationRange: `entry ${4 + mark.order * 0.28}% entry ${24 + mark.order * 0.28}%`,
                    }}
                    aria-hidden="true"
                  >
                    <span className="grid h-full min-h-0 w-full grid-cols-2 grid-rows-2 self-stretch" aria-hidden="true">
                        {Array.from({ length: 4 }, (_, stitch) => (
                          <CrossStitch key={stitch} className={`h-full w-full min-h-0 ${stitch > 1 ? "-translate-y-1" : ""} ${stitch % 2 != 0 ? "-translate-x-1" : ""}`} fill={mark.kind === "green" ? GREEN : BLUE} />
                        ))}
                    </span>
                  </span>
                );
              })}
              <p
                className={`absolute m-0 flex items-end justify-center text-center font-script leading-none text-script transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${bars ? "opacity-100 delay-300" : "opacity-0"}`}
                style={{ ...slot(BLUE_COL, 0), width: `${(4 / STAGE_COLS) * 100}%` }}
                aria-hidden={bars ? undefined : true}
              >
                <span className="text-[clamp(1.35rem,7cqi,4.2rem)]">{rhetoricalShare}</span>
              </p>
              <p
                className={`absolute m-0 flex items-end justify-center text-center font-script leading-none text-script transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${bars ? "opacity-100 delay-300" : "opacity-0"}`}
                style={{
                  left: `${((GREEN_COL - 1) / STAGE_COLS) * 100}%`,
                  top: `${((GREEN_ROW - 1) / STAGE_ROWS) * 100}%`,
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
        </div>
        <div className="pointer-events-none relative z-10" style={{ marginTop: "-80dvh" }}>
          <div data-step="motif" className="h-dvh" />
          <div data-step="bars" className="pt-[40dvh] pb-[20dvh]">
            <p className="pointer-events-auto m-0 max-w-[28rem] px-5 font-text text-base leading-snug text-script sheet:w-[min(35rem,40vw)] sheet:max-w-none sheet:text-[clamp(1.2rem,1.7vw,1.65rem)]">
              {body}
            </p>
          </div>
        </div>
      </div>
    </section>
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
