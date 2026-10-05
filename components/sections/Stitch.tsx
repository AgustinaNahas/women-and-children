export function Stitch({ className = "stitch" }: { className?: string }) {
  const marks = Array.from({ length: 18 }, (_, index) => index);

  return (
    <svg className={className} viewBox="0 0 1200 36" preserveAspectRatio="none" aria-hidden="true">
      {marks.map((mark) => {
        const x = 20 + mark * 66;
        const heart = mark % 4 === 1;
        return heart ? (
          <path
            key={mark}
            d={`M${x} 22c0-6 8-10 8-4 0-6 8-2 8 4 0 8-8 12-8 12s-8-4-8-12z`}
            fill="#c96b78"
          />
        ) : (
          <path
            key={mark}
            d={`M${x} 8l8 8m0-8l-8 8M${x + 18} 20l8 8m0-8l-8 8`}
            fill="none"
            stroke="#8E2F3C"
            strokeWidth="1.6"
            strokeLinecap="square"
          />
        );
      })}
    </svg>
  );
}
