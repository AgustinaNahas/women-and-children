import { readFileSync } from "node:fs";
import { join } from "node:path";

export type PortrayalKind = "agents" | "mixed" | "victims";

export type PortrayalMention = {
  iso: string;
  kind: PortrayalKind;
  quote: string;
  speaker: string;
  title: string;
};

const KINDS: Record<string, PortrayalKind> = {
  "1": "victims",
  "2": "agents",
  "3": "mixed",
};

const PHRASE = "Women and Children";

const WITH_ARTICLE = new Set([
  "Comoros",
  "Holy See",
  "Russian Federation",
  "Solomon Islands",
  "United Republic of Tanzania",
]);

function roleOf(role: string, country: string): string {
  const place = country.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const article = WITH_ARTICLE.has(place) ? "the " : "";
  return `${role} of ${article}${place}`;
}

function fullName(raw: string): string {
  const lines = raw.split(/\n/).map((line) => line.trim()).filter(Boolean);
  const honorific = lines[0] ?? "";
  const name = lines[1] ?? "";
  if (honorific && name.toLowerCase().startsWith(honorific.toLowerCase())) {
    return name.slice(honorific.length).trim();
  }
  return name;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (quoted) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

export function getPortrayalMentions(): PortrayalMention[] {
  const text = readFileSync(join(process.cwd(), "public/database.csv"), "utf8");
  const metadata = readFileSync(join(process.cwd(), "data/metadata.csv"), "utf8");
  const [header, ...records] = parseCsv(text);
  const [metaHeader, ...metaRecords] = parseCsv(metadata);
  if (!header || !metaHeader) return [];

  const column = Object.fromEntries(header.map((name, index) => [name, index]));
  const metaColumn = Object.fromEntries(metaHeader.map((name, index) => [name, index]));
  const speakerById = new Map(
    metaRecords.map((record) => [record[metaColumn.id_speech] ?? "", fullName(record[metaColumn.speaker_name] ?? "")]),
  );

  const phrase = column.phrase_pairing_option;
  const code = column.portrayal_code;
  const iso = column.Country;
  const place = column.country;
  const quote = column.extract_clean;
  const fallback = column.textual_extract;
  const title = column.speaker_title;
  const speechId = column.id_speech;

  return records.flatMap((record) => {
    if (record[phrase] !== PHRASE) return [];
    const kind = KINDS[record[code] ?? ""];
    const country = record[iso]?.trim();
    const name = record[place]?.trim();
    const extract = (record[quote] || record[fallback] || "").replace(/\s+/g, " ").replace(/[•]/g, "").trim();
    const role = record[title]?.trim();
    if (!kind || !country || !extract || !name || !role) return [];

    return [{
      iso: country,
      kind,
      quote: extract,
      speaker: speakerById.get(record[speechId] ?? "") || name,
      title: roleOf(role, name),
    }];
  });
}
