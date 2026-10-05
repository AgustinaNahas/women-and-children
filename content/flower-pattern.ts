/*
  Flores de la derecha, al lado del pattern de abajo.
  Cada fila es una línea de la grilla. `x` dibuja una puntada, `-` la deja vacía.
  El tamaño de cada puntada es `stitchSize`, el mismo que en la banda.
  `repeat` es cuántas veces se dibuja el motivo.
*/
export const flowerPattern = {
  tile: "/motif-tile.svg",
  repeat: 2,
  rows: [
    "-xx-xx-",
    "xxxxxxx",
    "xxx-xxx",
    "-x---x-",
    "xxx-xxx",
    "xxxxxxx",
    "-xx-xx-",
    "---x---",
    "xx-x-xx",
    "--x-x--",
    "---x---",
    "---x---",
  ],
} as const;
