/**
 * Grilla del scrolly de discursos.
 * Cada `x` es un punto. Cada `-` es un cuadrado con el patrón de hilo.
 * El paso 2 toma esas `x` en orden de lectura (fila por fila) y las
 * acomoda desde arriba a la izquierda. El paso 3 deja sin relleno los
 * últimos `outlineCount` de esa fila ya ordenada.
 *
 * Desktop: 18 × 11, el marco original.
 * Mobile: 11 × 18, el mismo conteo en un mosaico vertical y simétrico,
 * para que las celdas no se aplasten ni se pisen.
 */
export type SpeechGrid = {
  columns: number;
  rows: number;
  outlineCount: number;
  pattern: readonly string[];
};

export const speechGridWide = {
  columns: 18,
  rows: 11,
  outlineCount: 15,
  pattern: [
    "xxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxx",
    "x-----------------x",
    "-----xx-xx-xx-----",
    "x----xx-xx-xx----x",
    "------------------",
    "x----xx-xx-xx----x",
    "-----xx-xx-xx-----",
    "x-----------------x",
    "xxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxx",
  ],
} as const satisfies SpeechGrid;

export const speechGridNarrow = {
  columns: 11,
  rows: 18,
  outlineCount: 15,
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
