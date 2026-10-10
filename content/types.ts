export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export type CategoryId = "agents" | "victims" | "mixed";

const categoryIds: CategoryId[] = ["agents", "victims", "mixed"];

export function isCategoryId(value: string): value is CategoryId {
  return categoryIds.some((id) => id === value);
}

export type QuoteCopy = {
  slug: string;
  text: string;
  translation?: string;
  depth: number;
};

export type CategoryStep = {
  id: CategoryId;
  label: string;
  body: string;
};

export type TalkStep = {
  id: CategoryId;
  label: string;
  emphasis: string;
  body: string;
};

export type Content = {
  meta: {
    title: string;
    description: string;
  };
  ui: {
    languageLabel: string;
    skipLabel: string;
    notFoundTitle: string;
    closeLabel: string;
    newTabLabel: string;
    languages: Record<Locale, string>;
    translationLabel: string;
    sourceLabel: string;
    groupLabel: string;
    speechesLabel: string;
    cellsLabel: string;
    showing: string;
    allCategories: string;
    provisional: string;
  };
  header: {
    script: string;
    title: string;
  };
  opening: {
    script: string;
    title: string;
    lede: string;
    body: string;
    videoLabel: string;
    mute: string;
    unmute: string;
    pause: string;
    play: string;
  };
  photo: {
    title: string;
    alt: string;
    caption: string;
    credit: string;
  };
  waffle: {
    title: string;
    squareLabel: string;
    stitchLabel: string;
    stitchLabelChildren: string;
    showing: string;
    steps: {
      id: string;
      title: string;
      body: string;
      figure: string | null;
      caption: string;
    }[];
    summary: string;
    scannedLabel: string;
    mentionLabel: string;
    filledLabel: string;
    tableCaption: string;
    source: string;
    speechListCaption: string;
    speakerLabel: string;
    countryLabel: string;
    speechTitleLabel: string;
    mentionNone: string;
    mentionWomen: string;
    mentionBoth: string;
  };
  quotes: {
    title: string;
    lede: string;
    items: QuoteCopy[];
  };
  frame: {
    script: string;
    title: string;
    body: string;
    emphasis: string;
    source: string;
  };
  portrayal: {
    agentsLabel: string;
    mixedLabel: string;
    victimsLabel: string;
    intro: string;
    grouped: string;
    card: string;
    flowerRef: string;
  };
  talk: {
    title: string;
    description: string;
    steps: TalkStep[];
  };
  categories: {
    script: string;
    title: string;
    lede: string;
    steps: CategoryStep[];
    summary: string;
    tableCaption: string;
  };
  note: {
    title: string;
    lede: string;
    slug: string;
    excerpt: string;
    translation?: string;
  };
  flower: {
    script: string;
    title: string;
    lede: string;
    summary: string;
    phraseLabel: string;
    otherLabel: string;
    tableCaption: string;
    source: string;
  };
  orientation: {
    title: string;
    policyLabel: string;
    rhetoricalLabel: string;
    policyShare: string;
    rhetoricalShare: string;
    body: string;
  };
  soWhat: {
    title: string;
    paragraphs: string[];
  };
  closing: {
    slug: string;
    text: string;
    translation?: string;
  };
  footer: {
    credits: { role: string; names: string }[];
    bibliographyLabel: string;
    bibliography: BibRun[][];
    methodLabel: string;
    method: string;
    citeLabel: string;
    cite: string;
    csvLabel: string;
    databaseLabel: string;
    databaseHref: string;
  };
};

export type BibRun = {
  text: string;
  italic?: boolean;
  href?: string;
};
