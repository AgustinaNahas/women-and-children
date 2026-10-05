"use client";

import { useEffect, useRef, useState } from "react";
import { Mosaic } from "@/components/charts/Mosaic";
import { ScriptHeading } from "@/components/ScriptHeading";
import { isCategoryId, type CategoryId, type Locale } from "@/content/types";
import { fill } from "@/lib/text";

export function CategoryScrolly({
  locale,
  script,
  title,
  lede,
  provisional,
  steps,
  cells,
  counts,
  summary,
  tableCaption,
  groupLabel,
  valueLabel,
  showing,
  allCategories,
}: {
  locale: Locale;
  script: string;
  title: string;
  lede: string;
  provisional: string;
  steps: { id: CategoryId; label: string; body: string }[];
  cells: CategoryId[];
  counts: Record<CategoryId, number>;
  summary: string;
  tableCaption: string;
  groupLabel: string;
  valueLabel: string;
  showing: string;
  allCategories: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<CategoryId | null>(null);
  const labels = Object.fromEntries(steps.map((step) => [step.id, step.label])) as Record<
    CategoryId,
    string
  >;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nodes = () => [...(sectionRef.current?.querySelectorAll<HTMLElement>("[data-step]") ?? [])];

    const update = () => {
      if (motion.matches) {
        setActive(null);
        return;
      }

      let best: { id: CategoryId; ratio: number } | null = null;

      for (const node of nodes()) {
        const rect = node.getBoundingClientRect();
        const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const ratio = rect.height > 0 ? visible / rect.height : 0;
        const id = node.getAttribute("data-step") ?? "";
        if (ratio >= 0.35 && isCategoryId(id) && (!best || ratio > best.ratio)) {
          best = { id, ratio };
        }
      }

      setActive(best?.id ?? null);
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    const observer = new IntersectionObserver(update, {
      threshold: [0.35, 0.55, 0.75],
    });
    nodes().forEach((node) => observer.observe(node));

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    motion.addEventListener("change", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motion.removeEventListener("change", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const live = active ? fill(showing, { label: labels[active] }, locale) : allCategories;

  return (
    <section
      id="categories"
      ref={sectionRef}
      className="mx-auto w-full max-w-6xl px-5 py-[clamp(3rem,8vw,6rem)]"
      aria-labelledby="categories-title"
    >
      <ScriptHeading id="categories-title" as="h2" script={script} lede={lede} />
      <div className="grid grid-cols-[minmax(16rem,0.9fr)_minmax(0,1.1fr)] items-start gap-[clamp(1.5rem,4vw,3rem)] max-sheet:grid-cols-1">
        <aside className="sticky top-4 max-sheet:top-0 max-sheet:z-[2] max-sheet:bg-field max-sheet:pb-2">
          <Mosaic
            locale={locale}
            cells={cells}
            active={active}
            labels={labels}
            title={title}
            description={summary}
            tableCaption={tableCaption}
            groupLabel={groupLabel}
            valueLabel={valueLabel}
            counts={counts}
          />
          <p className="font-ui text-[0.9rem] text-thread-soft">{provisional}</p>
          <p className="sr-only" aria-live="polite">
            {live}
          </p>
        </aside>
        <ol className="list-none">
          {steps.map((step) => (
            <li key={step.id}>
              <article
                id={step.id}
                data-step={step.id}
                className="flex min-h-[72vh] flex-col justify-center border-l-[3px] py-4 pl-5 max-sheet:min-h-[58vh] max-sheet:pl-[0.9rem] motion-reduce:min-h-0 motion-reduce:py-5"
                style={{ borderColor: `var(--color-${step.id})` }}
              >
                <h3 className="mb-3 font-text text-[clamp(1.8rem,3vw,2.4rem)]">{step.label}</h3>
                <p className="max-w-[38rem]">{step.body}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
