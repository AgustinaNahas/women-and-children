"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CrossStitch } from "@/components/CrossStitch";
import { isCategoryId, type CategoryId, type TalkStep } from "@/content/types";
import { publicPath } from "@/lib/site";

const COLOR: Record<CategoryId, string> = {
  agents: "#7E99B4",
  victims: "#A61C1F",
  mixed: "#B2987F",
};

const TITLE =
  "m-0 shrink-0 px-5 pt-[clamp(1.25rem,3.5vh,2.75rem)] text-center font-script text-[clamp(2.6rem,7vw,5rem)] leading-none font-normal text-balance";

const ROW =
  "grid min-h-0 w-full flex-1 grid-cols-2 items-center px-[clamp(1rem,4vw,3.5rem)] max-sheet:grid-cols-1 max-sheet:content-center max-sheet:gap-4 max-sheet:overflow-y-auto";

export function TalkScrolly({ title, description, steps }: { title: string; description: string; steps: TalkStep[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<CategoryId>(steps[0]?.id ?? "agents");
  const current = steps.find((step) => step.id === active) ?? steps[0];

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const nodes = () => [...root.querySelectorAll<HTMLElement>("[data-step]")];

    const update = () => {
      const mid = window.innerHeight / 2;
      let best: { id: CategoryId; dist: number } | null = null;

      for (const node of nodes()) {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - mid);
        const id = node.getAttribute("data-step") ?? "";
        if (isCategoryId(id) && (!best || dist < best.dist)) best = { id, dist };
      }

      if (best) setActive(best.id);
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
    <section ref={sectionRef} id="talk" className="w-full mt-60" aria-labelledby="talk-title">
      <div className="relative">
      <h2 id="talk-title" className={TITLE}>
            {title}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl px-5 font-text text-2xl leading-snug sheet:px-0">
            {description}
          </p>

        <div className="sticky top-0 z-0 flex h-dvh flex-col max-sheet:overflow-y-auto">
          <div className={ROW}>
            <div className="flex justify-center">
              <div className="@container relative w-[min(100%,52vh)] max-sheet:w-[min(70%,30dvh)]">
                <img src={publicPath("/doily.png")} alt="" className="pointer-events-none block h-auto w-full select-none" />
                <div
                  className="pointer-events-none absolute"
                  style={{ top: "20%", right: "20.2%", bottom: "20%", left: "22.3%" }}
                  aria-hidden="true"
                >
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={`absolute inset-0 flex flex-col items-center justify-center pb-[6%] transition-opacity duration-700 ease-in-out motion-reduce:transition-none! ${active === step.id ? "opacity-100" : "opacity-0"}`}
                    >
                      <p
                        className="m-0 max-w-[92%] text-center font-script text-[clamp(1.7rem,16cqi,4.8rem)] leading-none font-normal"
                        style={{ color: COLOR[step.id] }}
                      >
                        {step.label}
                      </p>
                      <span className="mt-[0.55em] grid w-[20%] grid-cols-2 gap-[0.28em]">
                        {Array.from({ length: 4 }, (_, stitch) => (
                          <CrossStitch key={stitch} className={`block h-auto w-full ${stitch > 1 ? "-translate-y-2" : ""} ${stitch % 2 != 0 ? "-translate-x-2" : ""}`} fill={COLOR[step.id]}  />
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {current ? (
              <p
                className="mx-auto mt-2 min-h-[8rem] max-w-[34rem] px-4 py-3 text-center font-text text-lg leading-snug text-white sheet:hidden"
                aria-live="polite"
              >
                {emphasize(current.body, current.emphasis)}
              </p>
            ) : null}
          </div>
        </div>
        <ol className="relative z-10 m-0 list-none p-0" style={{ marginTop: "-100dvh" }}>
          {steps.map((step, index) => (
            <li
              key={step.id}
              data-step={step.id}
              className={index === steps.length - 1 ? "flex h-[100dvh] flex-col sheet:h-[120dvh]" : "flex h-[88dvh] flex-col sheet:h-dvh"}
            >
              <div className={`${TITLE} invisible`} aria-hidden="true">
                {title}
              </div>
              <div className={ROW}>
                <div className="max-sheet:hidden" aria-hidden="true" />
                <article className="hidden max-w-[34rem] justify-self-start pr-4 pl-[clamp(0.25rem,2vw,1.75rem)] sheet:block">
                  <h3 className="sr-only">{step.label}</h3>
                  <p className="m-0 font-text text-[clamp(1.2rem,1.85vw,1.7rem)] leading-snug">
                    {emphasize(step.body, step.emphasis)}
                  </p>
                </article>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function emphasize(text: string, phrase: string): ReactNode {
  const index = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (index < 0) return text;

  return (
    <>
      {text.slice(0, index)}
      <strong className="font-bold">{text.slice(index, index + phrase.length)}</strong>
      {text.slice(index + phrase.length)}
    </>
  );
}
