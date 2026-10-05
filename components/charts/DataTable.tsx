import type { Locale } from "@/content/types";

export function DataTable({
  caption,
  groupLabel,
  valueLabel,
  rows,
  locale,
}: {
  caption: string;
  groupLabel: string;
  valueLabel: string;
  rows: { key: string; label: string; value: number }[];
  locale: Locale;
}) {
  const number = new Intl.NumberFormat(locale);

  return (
    <table className="mt-4 w-full max-w-lg border-collapse font-ui text-[0.95rem] [&_caption]:mb-1 [&_caption]:text-left [&_caption]:font-semibold [&_caption]:text-script [&_td]:border-b [&_td]:border-script/35 [&_td]:px-[0.2rem] [&_td]:py-2 [&_td]:text-right [&_td]:align-top [&_td]:tabular-nums [&_th]:border-b [&_th]:border-script/35 [&_th]:px-[0.2rem] [&_th]:py-2 [&_th]:text-left [&_th]:align-top">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{groupLabel}</th>
          <th scope="col">{valueLabel}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <th scope="row">{row.label}</th>
            <td>{number.format(row.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
