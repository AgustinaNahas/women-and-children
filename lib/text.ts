export function fill(
  template: string,
  values: Record<string, string | number>,
  locale: string,
): string {
  const number = new Intl.NumberFormat(locale);

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key];
    if (typeof value === "number") return number.format(value);
    if (typeof value === "string") return value;
    return "";
  });
}

export function formatDate(isoDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
