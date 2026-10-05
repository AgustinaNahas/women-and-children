import { useId } from "react";
import type { CategoryId, Locale } from "@/content/types";
import { DataTable } from "./DataTable";
import { Legend } from "./Legend";

const columns = 8;
const size = 28;
const gap = 6;

export function Mosaic({
  locale,
  cells,
  active,
  labels,
  title,
  description,
  tableCaption,
  groupLabel,
  valueLabel,
  counts,
}: {
  locale: Locale;
  cells: CategoryId[];
  active: CategoryId | null;
  labels: Record<CategoryId, string>;
  title: string;
  description: string;
  tableCaption: string;
  groupLabel: string;
  valueLabel: string;
  counts: Record<CategoryId, number>;
}) {
  const titleId = useId().replace(/:/g, "");
  const descId = `${titleId}-desc`;
  const rows = Math.ceil(cells.length / columns);
  const width = columns * size + (columns - 1) * gap;
  const height = rows * size + (rows - 1) * gap;
  const order: CategoryId[] = ["agents", "victims", "mixed"];

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
        <MosaicPatterns prefix={titleId} />
        {cells.map((cell, index) => {
          const x = (index % columns) * (size + gap);
          const y = Math.floor(index / columns) * (size + gap);
          const dimmed = active !== null && cell !== active;
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={size}
              height={size}
              fill={`url(#${titleId}-${cell})`}
              opacity={dimmed ? 0.25 : 1}
            />
          );
        })}
      </svg>
      <Legend
        active={active}
        items={order.map((id) => ({ id, label: labels[id], swatch: id }))}
      />
      <DataTable
        locale={locale}
        caption={tableCaption}
        groupLabel={groupLabel}
        valueLabel={valueLabel}
        rows={order.map((id) => ({ key: id, label: labels[id], value: counts[id] }))}
      />
    </figure>
  );
}

function MosaicPatterns({ prefix }: { prefix: string }) {
  return (
    <defs>
      <pattern id={`${prefix}-agents`} width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="var(--color-agents)" />
        <circle cx="4" cy="4" r="1.3" fill="var(--color-paper)" />
      </pattern>
      <pattern id={`${prefix}-victims`} width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="var(--color-victims)" />
        <path d="M0 8 L8 0" stroke="var(--color-paper)" strokeWidth="1.2" />
      </pattern>
      <pattern id={`${prefix}-mixed`} width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="var(--color-mixed)" />
        <path d="M4 0 V8 M0 4 H8" stroke="var(--color-paper)" strokeWidth="1" />
      </pattern>
    </defs>
  );
}
