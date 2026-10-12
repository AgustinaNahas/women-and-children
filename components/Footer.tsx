"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { StitchPattern } from "@/components/sections/StitchPattern";
import { flowerPattern } from "@/content/flower-pattern";
import { heroTopRightPattern } from "@/content/hero-pattern";
import type { BibRun, Content } from "@/content/types";
import { publicPath } from "@/lib/site";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[1.15rem]">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[1.15rem]" fill="none">
      <path
        d="M14 5h5v5M19 5l-9 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CreditLink({
  href,
  label,
  newTabLabel,
  children,
}: {
  href: string;
  label: string;
  newTabLabel: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex text-thread no-underline hover:opacity-70"
    >
      {children}
      <span className="sr-only"> ({newTabLabel})</span>
    </a>
  );
}

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
              <p className="mt-1 flex flex-wrap items-center gap-x-2.5 font-text text-[1.2rem] leading-snug">
                <span>{credit.names}</span>
                {credit.linkedin || credit.site ? (
                  <span className="inline-flex items-center gap-2">
                    {credit.linkedin ? (
                      <CreditLink
                        href={credit.linkedin}
                        label={`${credit.names}, ${content.linkedinLabel}`}
                        newTabLabel={newTabLabel}
                      >
                        <LinkedInIcon />
                      </CreditLink>
                    ) : null}
                    {credit.site ? (
                      <CreditLink
                        href={credit.site}
                        label={`${credit.names}, ${content.siteLabel}`}
                        newTabLabel={newTabLabel}
                      >
                        <ExternalIcon />
                      </CreditLink>
                    ) : null}
                  </span>
                ) : null}
              </p>
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

        <span aria-hidden="true" className="mt-12 block font-script text-[clamp(2rem,8vw,2.35rem)] leading-none text-balance  ">
        <a
          href={content.databaseHref}
          className="no-underline hover:underline hover:decoration-1 hover:underline-offset-[0.12em]"

          target="_blank"
          rel="noopener noreferrer"
        >
          {content.databaseLabel}
          <span className="sr-only"> ({newTabLabel})</span>
        </a>
        {" "}/{" "}
        <a
          href={csvHref}
          className=" no-underline hover:underline hover:decoration-1 hover:underline-offset-[0.12em]"
        >
          {content.csvLabel}
        </a>

        </span>

        
      </div>

      <div data-footer-mid="" className="pointer-events-none absolute top-1/2 left-0 h-px w-px" aria-hidden="true" />
    </footer>
  );
}
