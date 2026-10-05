"use client";

import { useEffect, useMemo, useState } from "react";
import { stitchSize } from "@/content/stitches";
import { publicPath } from "@/lib/site";

/** Cuánto tarda cada puntada en pasar de invisible a visible. */
const FADE_MS = 1800;
/** Ventana, desde la carga, en la que cada puntada elige su arranque al azar. */
const SPREAD_MS = 3500;

export function StitchPattern({
  rows,
  tile,
  reveal = false,
  hold = false,
}: {
  rows: readonly string[];
  tile: string;
  reveal?: boolean;
  /** Oculta las puntadas hasta que `reveal` pasa a true. */
  hold?: boolean;
}) {
  const columns = rows.reduce((max, row) => Math.max(max, row.length), 0);
  const cells = useMemo(
    () =>
      rows.flatMap((row, rowIndex) =>
        [...row].flatMap((cell, columnIndex) =>
          cell === "x"
            ? [{ key: `${rowIndex}-${columnIndex}`, column: columnIndex + 1, row: rowIndex + 1 }]
            : [],
        ),
      ),
    [rows],
  );
  const [delays, setDelays] = useState<number[] | null>(null);

  useEffect(() => {
    if (!reveal) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setDelays(cells.map(() => Math.random() * SPREAD_MS));
  }, [reveal, cells]);

  const waiting = reveal && delays === null;
  const held = hold && !reveal;

  return (
    <div
      className="grid shrink-0"
      style={{
        gridTemplateColumns: `repeat(${columns}, ${stitchSize}px)`,
        gridAutoRows: `${stitchSize}px`,
      }}
      aria-hidden="true"
    >
      {cells.map((cell, index) => (
        <span
          key={cell.key}
          className={`bg-contain bg-center bg-no-repeat${waiting ? " stitch-await" : ""}${held ? " stitch-hold" : ""}`}
          style={{
            gridColumn: cell.column,
            gridRow: cell.row,
            backgroundImage: `url("${publicPath(tile)}")`,
            animation:
              delays === null
                ? undefined
                : `stitch-fade-in ${FADE_MS}ms ease-in-out ${delays[index]}ms both`,
          }}
        />
      ))}
    </div>
  );
}
