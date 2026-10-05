import { useId } from "react";
import type { Locale } from "@/content/types";
import { DataTable } from "./DataTable";
import { Legend } from "./Legend";

export function Waffle({
  locale,
  total,
  filled,
  title,
  description,
  filledLabel,
  emptyLabel,
  tableCaption,
  groupLabel,
  valueLabel,
  source,
}: {
  locale: Locale;
  total: number;
  filled: number;
  title: string;
  description: string;
  filledLabel: string;
  emptyLabel: string;
  tableCaption: string;
  groupLabel: string;
  valueLabel: string;
  source: string;
}) {
  const titleId = useId().replace(/:/g, "");
  const descId = `${titleId}-desc`;
  const columns = 10;
  const size = 16;
  const gap = 4;
  const rows = Math.ceil(total / columns);
  const width = columns * size + (columns - 1) * gap;
  const height = rows * size + (rows - 1) * gap;

  return (
    <figure className="mt-8 max-w-[40rem]">
      <svg
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        viewBox={`0 0 ${width} ${height}`}
        className="block h-auto w-full"
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{description}</desc>
        {Array.from({ length: total }, (_, index) => {
          const marked = index < filled;
          const x = (index % columns) * (size + gap);
          const y = Math.floor(index / columns) * (size + gap);
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={size}
              height={size}
              rx="1"
              fill={marked ? "var(--color-waffle)" : "none"}
              stroke="var(--color-script)"
              strokeWidth={marked ? 0 : 1}
            />
          );
        })}
      </svg>
      <Legend
        items={[
          { id: "filled", label: filledLabel, swatch: "filled" },
          { id: "empty", label: emptyLabel, swatch: "empty" },
        ]}
      />
      <DataTable
        locale={locale}
        caption={tableCaption}
        groupLabel={groupLabel}
        valueLabel={valueLabel}
        rows={[
          { key: "filled", label: filledLabel, value: filled },
          { key: "empty", label: emptyLabel, value: total - filled },
        ]}
      />
      <p className="font-ui text-[0.9rem] text-thread-soft">{source}</p>
    </figure>
  );
}
