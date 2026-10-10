export function ScriptHeading({
  as: Tag,
  id,
  script,
  lede,
  body,
  variant = "section",
}: {
  as: "h1" | "h2";
  id?: string;
  script: string;
  lede?: string;
  body?: string;
  variant?: "section" | "frame";
}) {
  const scriptTone =
    variant === "frame"
      ? "text-thread text-[clamp(2.8rem,7vw,4.5rem)]"
      : "text-script text-[clamp(2.6rem,7vw,6.5rem)]";

  return (
    <header className="mb-8 flex flex-col">
      <Tag
        id={id}
        className={`order-3 mb-48 block w-full text-center font-script leading-none font-normal text-balance ${scriptTone}`}
      >
        {script}
      </Tag>
      {lede ? (
        <p className="order-1 mx-auto mt-36 mb-4 max-w-xl text-[clamp(1.15rem,2vw,1.45rem)] leading-snug">
          {lede}
        </p>
      ) : null}
      {body ? (
        <p className="order-2 mx-auto mt-12 mb-18 max-w-xl text-[clamp(1.15rem,2vw,1.45rem)] leading-snug">
          {body}
        </p>
      ) : null}
    </header>
  );
}
