/**
 * Grilla del scrolly de discursos.
 * Cada `x` es el lugar de un punto visible en el paso 1. Cada `-` es un
 * cuadrado. Cada discurso tiene su punto: opaco si menciona mujeres,
 * invisible si no. La última celda libre no corresponde a ningún discurso.
 * El paso 2 mueve los puntos de abajo hacia arriba, de izquierda a derecha:
 * abajo los que también dicen niños o niñas, y encima los que van a quedar con contorno.
 * El paso del contorno no los mueve.
 *
 * Desktop: 18 × 11, el marco original.
 * Mobile: 11 × 18, el mismo conteo en un mosaico vertical y simétrico,
 * para que las celdas no se aplasten ni se pisen.
 */
export type SpeechGrid = {
  columns: number;
  rows: number;
  pattern: readonly string[];
};

export type SpeechMention = "none" | "women" | "both";

export type Cell = { col: number; row: number };

export type LaidSpeech<T> = T & {
  pattern: Cell;
  packed: Cell;
  grouped: Cell;
  sharesPattern: boolean;
};

export const speechGridWide = {
  columns: 18,
  rows: 11,
  pattern: [
    "xxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxx",
    "x----------------x",
    "-----xx-xx-xx-----",
    "x----xx-xx-xx----x",
    "------------------",
    "x----xx-xx-xx----x",
    "-----xx-xx-xx-----",
    "x----------------x",
    "xxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxx",
  ],
} as const satisfies SpeechGrid;

export const speechGridNarrow = {
  columns: 11,
  rows: 18,
  pattern: [
    "-xxx-x-xxx-",
    "x-x-x-x-x-x",
    "--x-x-x-x--",
    "--x-x-x-x--",
    "x-x-x-x-x-x",
    "-xxx-x-xxx-",
    "x-x-x-x-x-x",
    "-xxx-x-xxx-",
    "x--x-x-x--x",
    "x--x-x-x--x",
    "-xxx-x-xxx-",
    "x-x-x-x-x-x",
    "-xxx-x-xxx-",
    "x-x-x-x-x-x",
    "--x-x-x-x--",
    "--x-x-x-x--",
    "x-x-x-x-x-x",
    "-xxx-x-xxx-",
  ],
} as const satisfies SpeechGrid;

function patternCells(grid: SpeechGrid) {
  const marks: Cell[] = [];
  const blanks: Cell[] = [];

  grid.pattern.forEach((line, row) => {
    if (row >= grid.rows) return;
    [...line].forEach((cell, col) => {
      if (col >= grid.columns) return;
      (cell === "x" ? marks : blanks).push({ col, row });
    });
  });

  return { marks, blanks };
}

function fromBottom(index: number, columns: number, rows: number): Cell {
  const col = index % columns;
  const row = rows - 1 - Math.floor(index / columns);
  if (row < 0) throw new Error(`Cell ${index} is outside the ${columns}×${rows} grid`);
  return { col, row };
}

/**
 * Paso 1: las menciones ocupan las `x`, una por celda. Si sobra alguna,
 * comparte celda con otra `x` y solo se separa al pasar al paso 2, para no
 * agregar puntos en los huecos del patrón. El resto va a los cuadrados vacíos.
 * Paso 2: se apilan desde abajo a la izquierda. Abajo, las que también dicen
 * niños o niñas; encima, las que van a quedar solo con contorno.
 * El paso del contorno no las mueve: solo cambia el trazo.
 */
export function layoutSpeeches<T extends { id: string; mention: SpeechMention }>(
  grid: SpeechGrid,
  speeches: readonly T[],
): LaidSpeech<T>[] {
  const { marks, blanks } = patternCells(grid);
  const stitched = speeches.filter((speech) => speech.mention !== "none");
  const plain = speeches.filter((speech) => speech.mention === "none");
  const both = stitched.filter((speech) => speech.mention === "both");
  const only = stitched.filter((speech) => speech.mention === "women");
  const pack = (index: number) => fromBottom(index, grid.columns, grid.rows);

  const packed = new Map<string, Cell>();
  const grouped = new Map<string, Cell>();
  const pattern = new Map<string, Cell>();
  const shares = new Set<string>();

  const ordered = [...both, ...only];
  ordered.forEach((speech, index) => {
    const cell = pack(index);
    packed.set(speech.id, cell);
    grouped.set(speech.id, cell);
  });
  plain.forEach((speech, index) => {
    const cell = pack(ordered.length + index);
    packed.set(speech.id, cell);
    grouped.set(speech.id, cell);
  });

  stitched.forEach((speech, index) => {
    const cell = marks[index] ?? marks[index % marks.length];
    if (!cell) throw new Error("The speech grid has no stitches");
    pattern.set(speech.id, cell);
    if (index >= marks.length) shares.add(speech.id);
  });
  plain.forEach((speech, index) => {
    const cell = blanks[index];
    if (!cell) throw new Error(`No blank cell for ${speech.id}`);
    pattern.set(speech.id, cell);
  });

  return speeches.map((speech) => {
    const at = pattern.get(speech.id);
    const packedCell = packed.get(speech.id);
    const groupedCell = grouped.get(speech.id);
    if (!at || !packedCell || !groupedCell) throw new Error(`Unplaced speech ${speech.id}`);
    return {
      ...speech,
      pattern: at,
      packed: packedCell,
      grouped: groupedCell,
      sharesPattern: shares.has(speech.id),
    };
  });
}
