"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

const SPEED = 0.22;

export function EvidenceFrame({
  script,
  body,
  emphasis,
  source,
}: {
  script: string;
  body: string;
  emphasis: string;
  source: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 45rem)");
    let raf = 0;

    const update = () => {
      raf = 0;
      if (motion.matches || narrow.matches) {
        frame.style.transform = "";
        return;
      }

      const rect = section.getBoundingClientRect();
      const view = window.innerHeight;
      const center = rect.top + rect.height / 2 - view / 2;
      const max = view * 0.28;
      const shift = Math.max(-max, Math.min(0, -center * SPEED));
      frame.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
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
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="children"
      ref={sectionRef}
      className="relative z-10 mt-6 px-5 pt-8 pb-16 sheet:-mt-[12vh] sheet:pt-[8vh] sheet:pb-[16vh]"
      aria-labelledby="children-title"
    >
      <div ref={frameRef} className="@container relative mx-auto w-full max-w-[34rem] will-change-transform">
        <img src="/marco.png" alt="" className="pointer-events-none block h-auto w-full select-none" />
        <div className="absolute top-[20%] right-[12%] bottom-[10%] left-[16%] flex flex-col items-center overflow-y-auto text-center text-thread">
          <h2
            id="children-title"
            className="m-0 font-script text-[clamp(2.35rem,11cqi,4rem)] leading-none font-normal text-balance"
          >
            {script}
          </h2>
          <p className="mt-24 max-w-[30ch] font-text text-[clamp(0.92rem,4.2cqi,1.35rem)] leading-snug">
            {emphasize(body, emphasis)}
          </p>

          <div className="min-h-4 flex-1" />
          <p className="mt-4 mb-0 font-text text-[clamp(0.68rem,2.15cqi,0.8rem)] leading-snug sheet:mt-12 px-12">
            {source}
          </p>
          <div className="min-h-4 flex-[0.45]" />
        </div>
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
      <strong className="font-semibold">{text.slice(index, index + phrase.length)}</strong>
      {text.slice(index + phrase.length)}
    </>
  );
}
