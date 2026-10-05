import { useId } from "react";
import type { Locale } from "@/content/types";
import { DataTable } from "./DataTable";
import { Legend } from "./Legend";

export function Flower({
  locale,
  phrase,
  other,
  title,
  description,
  phraseLabel,
  otherLabel,
  tableCaption,
  groupLabel,
  valueLabel,
  source,
}: {
  locale: Locale;
  phrase: number;
  other: number;
  title: string;
  description: string;
  phraseLabel: string;
  otherLabel: string;
  tableCaption: string;
  groupLabel: string;
  valueLabel: string;
  source: string;
}) {
  const titleId = useId().replace(/:/g, "");
  const descId = `${titleId}-desc`;
  const total = phrase + other;
  const center = 160;

  return (
    <figure className="mt-8 max-w-[40rem]">
      <svg role="img" aria-labelledby={`${titleId} ${descId}`} viewBox="0 0 320 320" className="block h-auto w-full max-w-md">
        <title id={titleId}>{title}</title>
        <desc id={descId}>{description}</desc>
        {Array.from({ length: total }, (_, index) => {
          const angle = (index / total) * 360 - 90;
          const marked = index < phrase;
          return (
            <ellipse
              key={index}
              cx={center}
              cy="78"
              rx="3.1"
              ry="42"
              fill={marked ? "var(--color-phrase)" : "var(--color-petal)"}
              transform={`rotate(${angle} ${center} ${center})`}
            />
          );
        })}
        <circle cx={center} cy={center} r="28" fill="var(--color-field)" stroke="var(--color-script)" />
        <text
          x={center}
          y={center + 5}
          textAnchor="middle"
          fill="var(--color-script)"
          fontSize="16"
          fontFamily="var(--font-ui), sans-serif"
        >
          {new Intl.NumberFormat(locale).format(phrase)}/
          {new Intl.NumberFormat(locale).format(total)}
        </text>
      </svg>
      <Legend
        items={[
          { id: "phrase", label: phraseLabel, swatch: "phrase" },
          { id: "other", label: otherLabel, swatch: "other" },
        ]}
      />
      <DataTable
        locale={locale}
        caption={tableCaption}
        groupLabel={groupLabel}
        valueLabel={valueLabel}
        rows={[
          { key: "phrase", label: phraseLabel, value: phrase },
          { key: "other", label: otherLabel, value: other },
        ]}
      />
      <p className="font-ui text-[0.9rem] text-thread-soft">{source}</p>
    </figure>
  );
}
