export function Legend({
  items,
  active,
}: {
  items: { id: string; label: string; swatch: "filled" | "empty" | "phrase" | "other" | "agents" | "victims" | "mixed" }[];
  active?: string | null;
}) {
  return (
    <ul className="mt-4 flex list-none flex-wrap gap-x-5 gap-y-3 p-0 font-ui text-[0.95rem]">
      {items.map((item) => (
        <li key={item.id} className="flex min-h-11 items-center gap-[0.45rem]">
          <svg className="size-4 shrink-0 text-script" viewBox="0 0 16 16" aria-hidden="true">
            <Swatch kind={item.swatch} />
          </svg>
          <span className={active === item.id ? "underline underline-offset-4" : undefined}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

function Swatch({
  kind,
}: {
  kind: "filled" | "empty" | "phrase" | "other" | "agents" | "victims" | "mixed";
}) {
  if (kind === "empty") {
    return <rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" />;
  }

  if (kind === "filled") {
    return <rect x="1" y="1" width="14" height="14" fill="var(--color-waffle)" />;
  }

  if (kind === "phrase") {
    return (
      <>
        <rect x="1" y="1" width="14" height="14" fill="var(--color-phrase)" />
        <circle cx="8" cy="8" r="1.4" fill="var(--color-field)" />
      </>
    );
  }

  if (kind === "other") {
    return <rect x="1" y="1" width="14" height="14" fill="var(--color-petal)" />;
  }

  return (
    <>
      <rect x="1" y="1" width="14" height="14" fill={`var(--color-${kind})`} />
      {kind === "agents" ? <circle cx="8" cy="8" r="1.5" fill="var(--color-paper)" /> : null}
      {kind === "victims" ? (
        <path d="M2 14 L14 2" stroke="var(--color-paper)" strokeWidth="1.4" />
      ) : null}
      {kind === "mixed" ? (
        <path d="M8 2 V14 M2 8 H14" stroke="var(--color-paper)" strokeWidth="1.2" />
      ) : null}
    </>
  );
}
