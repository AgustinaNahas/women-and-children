export function AssemblyFigure({
  title,
  alt,
  caption,
  credit,
}: {
  title: string;
  alt: string;
  caption: string;
  credit: string;
}) {
  return (
    <section id="debate" className="px-5 py-[clamp(3rem,8vw,6rem)]" aria-labelledby="debate-title">
      <div className="mx-auto w-full max-w-[40rem]">
        <h2 id="debate-title" className="m-0">{title}</h2>
        <figure>
          <svg role="img" aria-label={alt} viewBox="0 0 640 360" className="block h-auto w-full border border-script/35">
            <rect width="640" height="360" fill="#163226" />
            <rect x="48" y="28" width="544" height="168" fill="#1e4634" />
            <rect x="270" y="210" width="100" height="16" fill="#c8b48a" />
            <rect x="248" y="226" width="144" height="42" fill="#8a7048" />
            <path d="M214 268h212l16 28H198z" fill="#5c4630" />
            <g fill="#0e2319">
              {Array.from({ length: 5 }, (_, row) =>
                Array.from({ length: 14 }, (_, column) => (
                  <rect
                    key={`${row}-${column}`}
                    x={36 + column * 42}
                    y={248 + row * 16}
                    width="28"
                    height="8"
                    opacity={0.28 + row * 0.08}
                  />
                )),
              )}
            </g>
          </svg>
          <figcaption>
            <p className="mb-1">{caption}</p>
            <p className="mb-1 font-ui text-[0.9rem] text-thread-soft">{credit}</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
