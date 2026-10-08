import { readFileSync } from "node:fs";
import { join } from "node:path";

export type SpeechMention = "none" | "women" | "both";

export type SpeechTile = {
  id: string;
  speaker: string;
  title: string;
  country: string;
  mention: SpeechMention;
};

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

function mentionOf(options: Set<string>): SpeechMention {
  const withChildren = options.has("Women and Children") || options.has("Women and Girls");
  if (withChildren) return "both";
  if ([...options].some((option) => option && option !== "No Mention")) return "women";
  return "none";
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

export function getSpeechTiles(): SpeechTile[] {
  const database = readFileSync(join(process.cwd(), "public/database.csv"), "utf8");
  const metadata = readFileSync(join(process.cwd(), "data/metadata.csv"), "utf8");
  const [header, ...records] = parseCsv(database);
  const [metaHeader, ...metaRecords] = parseCsv(metadata);
  if (!header || !metaHeader) return [];

  const column = Object.fromEntries(header.map((name, index) => [name, index]));
  const metaColumn = Object.fromEntries(metaHeader.map((name, index) => [name, index]));
  const nameById = new Map(
    metaRecords.map((record) => [record[metaColumn.id_speech] ?? "", fullName(record[metaColumn.speaker_name] ?? "")]),
  );

  const grouped = new Map<string, string[][]>();
  for (const record of records) {
    const id = record[column.id_speech] ?? "";
    const rows = grouped.get(id);
    if (rows) rows.push(record);
    else grouped.set(id, [record]);
  }

  return [...grouped.entries()].map(([id, rows]) => {
    const first = rows[0] ?? [];
    const options = new Set(rows.map((row) => row[column.phrase_pairing_option]?.trim() ?? ""));

    return {
      id,
      speaker: nameById.get(id) ?? "",
      title: first[column.speaker_title]?.trim() ?? "",
      country: first[column.country]?.trim() ?? "",
      mention: mentionOf(options),
    };
  });
}
