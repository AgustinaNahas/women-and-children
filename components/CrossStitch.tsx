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
    stroke,
    strokeWidth,
    vectorEffect: strokeWidth ? ("non-scaling-stroke" as const) : undefined,
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
    </svg>
  );
}
