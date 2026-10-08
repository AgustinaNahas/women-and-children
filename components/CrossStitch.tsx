// Contorno exterior de las dos elipses. El borde de cada una, por separado,
// deja ver el cruce; este trazo solo sigue la silueta, que se lee como una X.
const OUTLINE =
  "M75.19 48.81L76.71 50.64L78.38 52.7L80.23 55.06L82.29 57.78L84.57 60.95L87.1 64.67L89.84 69.04L92.66 74.12L95.28 79.86L97.15 85.9L97.5 91.51L95.63 95.63L91.51 97.5L85.9 97.15L79.86 95.28L74.12 92.66L69.04 89.83L64.67 87.1L60.95 84.57L57.78 82.29L55.06 80.23L52.7 78.38L50.64 76.71L48.81 75.19L46.98 76.71L44.91 78.38L42.56 80.23L39.84 82.29L36.67 84.57L32.94 87.1L28.57 89.84L23.49 92.66L17.75 95.28L11.71 97.15L6.11 97.5L1.99 95.63L0.12 91.51L0.46 85.9L2.33 79.86L4.95 74.12L7.78 69.04L10.51 64.67L13.04 60.95L15.33 57.78L17.38 55.06L19.23 52.7L20.9 50.64L22.42 48.81L20.9 46.98L19.23 44.91L17.38 42.56L15.33 39.84L13.04 36.67L10.51 32.94L7.78 28.57L4.95 23.49L2.33 17.75L0.46 11.71L0.12 6.11L1.99 1.99L6.11 0.12L11.71 0.46L17.75 2.33L23.49 4.95L28.57 7.78L32.94 10.51L36.67 13.04L39.84 15.33L42.56 17.38L44.91 19.23L46.98 20.9L48.81 22.42L50.64 20.9L52.7 19.23L55.06 17.38L57.78 15.33L60.95 13.04L64.67 10.51L69.04 7.78L74.12 4.95L79.86 2.33L85.9 0.46L91.51 0.12L95.63 1.99L97.5 6.11L97.15 11.71L95.28 17.75L92.66 23.49L89.84 28.57L87.1 32.94L84.57 36.67L82.29 39.84L80.23 42.56L78.38 44.91L76.71 46.98Z";

export function CrossStitch({
  className,
  fill = "#A71619",
  stroke,
  strokeWidth = 0,
  preserveAspectRatio,
  markClassName,
}: {
  className?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  preserveAspectRatio?: "none" | "xMidYMid meet" | "xMidYMid slice";
  markClassName?: string;
}) {
  const mark = {
    fill,
    className: markClassName,
  };

  return (
    <svg
      viewBox="0 0 98 98"
      className={className}
      preserveAspectRatio={preserveAspectRatio}
      overflow="hidden"
      aria-hidden="true"
    >
      <ellipse
        cx="48.8063"
        cy="48.8064"
        rx="19.4423"
        ry="66.2089"
        transform="rotate(45 48.8063 48.8064)"
        {...mark}
      />
      <ellipse
        cx="48.8064"
        cy="48.8063"
        rx="19.4423"
        ry="66.2089"
        transform="rotate(135 48.8064 48.8063)"
        {...mark}
      />
      <path
        d={OUTLINE}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        vectorEffect={strokeWidth ? "non-scaling-stroke" : undefined}
        className={markClassName}
      />
    </svg>
  );
}
