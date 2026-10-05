import { readFileSync } from "node:fs";
import { join } from "node:path";
import mentionsFile from "@/data/mentions.json";

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

// char_index of the mentions.json row for each extract. The tooltip reads `context`
// from that row, so editing the text does not move it to another mention.
const PINNED: Record<string, number> = {
  M_3_1: 3105,
  M_3_2: 10453,
  M_6_1: 3348,
  M_10_1: 10590,
  M_14_1: 7272,
  M_15_1: 7156,
  M_16_4: 10138,
  M_20_1: 4692,
  M_26_3: 11688,
  M_38_1: 854,
  M_43_1: 8487,
  M_53_1: 2736,
  M_74_1: 3807,
  M_75_1: 4456,
  M_76_1: 5999,
  M_79_1: 4427,
  M_88_1: 4122,
  M_102_1: 1077,
  M_119_2: 11612,
  M_122_1: 6478,
  M_126_1: 6207,
  M_126_2: 8366,
  M_126_3: 9029,
  M_134_1: 4530,
  M_150_1: 8605,
  M_150_2: 9554,
  M_153_1: 3456,
  M_164_1: 9008,
  M_166_1: 6152,
  M_179_1: 1134,
  M_180_1: 6888,
};

function words(text: string) {
  return new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean));
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
  const [header, ...records] = parseCsv(text);
  if (!header) return [];

  const column = Object.fromEntries(header.map((name, index) => [name, index]));
  const phrase = column.phrase_pairing_option;
  const code = column.portrayal_code;
  const iso = column.Country;
  const place = column.country;
  const quote = column.textual_extract;
  const title = column.speaker_title;
  const extractId = column.id_extract;
  const mentions = mentionsFile.mentions;
  const byPin = new Map(mentions.map((mention, index) => [`${mention.country}\0${mention.char_index}`, index]));
  const used = new Set<number>();

  return records.flatMap((record) => {
    if (record[phrase] !== PHRASE) return [];
    const kind = KINDS[record[code] ?? ""];
    const country = record[iso]?.trim();
    const name = record[place]?.trim();
    const extract = record[quote]?.replace(/\s+/g, " ").replace(/[•]/g, "").trim();
    const role = record[title]?.trim();
    if (!kind || !country || !extract || !name || !role) return [];

    const pinned = byPin.get(`${name}\0${PINNED[record[extractId] ?? ""]}`);
    let index = pinned;
    if (index === undefined || used.has(index)) {
      const extractWords = words(extract);
      let best = -1;
      let score = -1;
      mentions.forEach((mention, mentionIndex) => {
        if (used.has(mentionIndex) || mention.country !== name) return;
        let shared = 0;
        for (const word of words(mention.context)) if (extractWords.has(word)) shared += 1;
        if (shared > score) {
          score = shared;
          best = mentionIndex;
        }
      });
      index = best === -1 ? undefined : best;
    }
    if (index !== undefined) used.add(index);
    const mention = index === undefined ? undefined : mentions[index];

    return [{
      iso: country,
      kind,
      quote: mention ? mention.context : extract,
      speaker: mention?.speaker ?? name,
      title: roleOf(role, name),
    }];
  });
}
