"use client";

import { useEffect, useRef, useState } from "react";
import { StitchPattern } from "@/components/sections/StitchPattern";
import { flowerPattern } from "@/content/flower-pattern";
import { heroTopRightPattern } from "@/content/hero-pattern";
import type { BibRun, Content } from "@/content/types";
import { publicPath } from "@/lib/site";

function Citation({ parts, newTabLabel }: { parts: readonly BibRun[]; newTabLabel: string }) {
  return parts.map((part, index) => {
    if (part.href) {
      return (
        <a
          key={index}
          href={part.href}
          className={`underline decoration-1 underline-offset-[0.18em] ${part.italic ? "italic" : ""}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part.text}
          <span className="sr-only"> ({newTabLabel})</span>
        </a>
      );
    }

    return (
      <span key={index} className={part.italic ? "italic" : undefined}>
        {part.text}
      </span>
    );
  });
}

export function Footer({
  content,
  newTabLabel,
  method,
  cite,
  citeUrl,
  csvHref,
}: {
  content: Content["footer"];
  newTabLabel: string;
  method: string;
  cite: string;
  citeUrl: string;
  csvHref: string;
}) {
  const footerRef = useRef<HTMLElement>(null);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const midpoint = footer.querySelector("[data-footer-mid]");
    if (!(midpoint instanceof Element)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setReveal(true);
      },
      { threshold: 0 },
    );
    observer.observe(midpoint);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-linen bg-contain px-[clamp(1.25rem,5vw,4.5rem)] pt-6 pb-16 text-thread lg:pt-16 lg:pb-24"
      style={{ backgroundImage: `url("${publicPath("/tela.png")}")` }}
    >
      <div
        className="pointer-events-none -mx-[clamp(1.25rem,5vw,4.5rem)] mb-10 flex flex-col items-end overflow-hidden lg:absolute lg:inset-x-0 lg:top-0 lg:mx-0 lg:mb-0"
        aria-hidden="true"
      >
        <div className="-translate-y-2 translate-x-8">
          <StitchPattern
            rows={heroTopRightPattern.rows}
            tile={heroTopRightPattern.tile}
            reveal={reveal}
            hold
          />
        </div>
        <div className="-mt-8 lg:mr-[clamp(0.5rem,3vw,2.5rem)]">
          <StitchPattern rows={flowerPattern.rows} tile={flowerPattern.tile} reveal={reveal} hold />
        </div>
      </div>

      <div className="relative max-w-[40rem] lg:max-w-[min(40rem,calc(100%-22rem))]">
        <div className="flex flex-col gap-7">
          {content.credits.map((credit) => (
            <div key={credit.role}>
              <p className="font-script text-[2.35rem] leading-none">{credit.role}</p>
              <p className="mt-1 font-text text-[1.2rem] leading-snug">{credit.names}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="font-script text-[2.35rem] leading-none font-normal">{content.bibliographyLabel}</h2>
          <ul className="mt-3 flex flex-col gap-3 font-text text-[1.08rem] leading-snug">
            {content.bibliography.map((parts, index) => (
              <li key={index} className="grid grid-cols-[1rem_1fr] gap-x-2">
                <span aria-hidden="true">+</span>
                <span className="wrap-break-word">
                  <Citation parts={parts} newTabLabel={newTabLabel} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12">
          <h2 className="font-script text-[2.35rem] leading-none font-normal">{content.methodLabel}</h2>
          <p className="mt-3 font-text text-[1.08rem] leading-snug">{method}</p>
        </div>

        <div className="mt-12">
          <h2 className="font-script text-[2.35rem] leading-none font-normal">{content.citeLabel}</h2>
          <p className="mt-3 font-text text-[1.08rem] leading-snug">
            {cite}{" "}
            <a href={citeUrl} className="underline decoration-1 underline-offset-[0.18em]">
              {citeUrl}
            </a>
          </p>
        </div>

        <a
          href={csvHref}
          className="mt-12 inline-block font-text text-[1.08rem] leading-snug underline decoration-1 underline-offset-[0.18em]"
        >
          {content.csvLabel}
        </a>

        <a
          href={content.databaseHref}
          className="mt-12 inline-block font-script text-[clamp(2rem,8vw,2.35rem)] leading-none text-balance no-underline hover:underline hover:decoration-1 hover:underline-offset-[0.12em]"
          target="_blank"
          rel="noopener noreferrer"
        >
          {content.databaseLabel}
          <span className="sr-only"> ({newTabLabel})</span>
        </a>
      </div>

      <div data-footer-mid="" className="pointer-events-none absolute top-1/2 left-0 h-px w-px" aria-hidden="true" />
    </footer>
  );
}
