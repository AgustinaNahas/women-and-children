import categories from "@/data/categories.json";
import mentions from "@/data/mentions.json";
import type { CategoryId } from "@/content/types";

type Mention = {
  date: string;
  slug: string;
  country: string;
  speaker: string;
  term: string;
};

type MentionsFile = {
  session: number;
  speeches_scanned: number;
  speeches_with_women: number;
  speeches_with_women_and_children: number;
  mentions: Mention[];
};

const data = mentions as MentionsFile;

export type Figures = {
  session: number;
  scanned: number;
  withWomen: number;
  phrase: number;
  womenOnly: number;
};

export type SpeechMeta = {
  slug: string;
  date: string;
  country: string;
  speaker: string;
};

export function getFigures(): Figures {
  const phrase = data.speeches_with_women_and_children;
  const withWomen = data.speeches_with_women;

  return {
    session: data.session,
    scanned: data.speeches_scanned,
    withWomen,
    phrase,
    womenOnly: withWomen - phrase,
  };
}

export function getMosaicCells(): CategoryId[] {
  return categories.cells.map((cell) => {
    if (cell === "agents" || cell === "victims" || cell === "mixed") return cell;
    throw new Error(`Unknown category: ${cell}`);
  });
}

export function countCategories(cells: CategoryId[]): Record<CategoryId, number> {
  const counts: Record<CategoryId, number> = { agents: 0, victims: 0, mixed: 0 };
  for (const cell of cells) counts[cell] += 1;
  return counts;
}

export function getSpeech(slug: string): SpeechMeta {
  const mentions = data.mentions.filter((item) => item.slug === slug);
  const match = mentions.find((item) => item.term === "women and children") ?? mentions[0];

  if (!match) {
    throw new Error(`No mention for ${slug}`);
  }

  return {
    slug: match.slug,
    date: match.date,
    country: match.country,
    speaker: match.speaker,
  };
}
