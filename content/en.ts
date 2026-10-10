import { bibliography, databaseHref } from "./bibliography";
import type { Content } from "./types";

/*
  PROVISIONAL, from a 114px export of the design: opening script
  "Women are not property"; frame script "Children's lives".
  PROVISIONAL wording, same shape as the agents paragraph: victims and mixed.
  Confirmed: the site studies the phrase, the category question, and the agents sentence.
*/

const en: Content = {
  meta: {
    title: "Women and children in the 81st General Assembly",
    description:
      "How the 81st UN General Assembly says “women and children,” and how those speeches frame women as agents, victims, or both.",
  },
  ui: {
    languageLabel: "Language",
    skipLabel: "Skip to content",
    notFoundTitle: "Page not found",
    closeLabel: "Close",
    newTabLabel: "opens in a new tab",
    languages: { en: "EN", es: "ES" },
    translationLabel: "Translation",
    sourceLabel: "Source",
    groupLabel: "Group",
    speechesLabel: "Speeches",
    cellsLabel: "Cells",
    showing: "Showing {label}",
    allCategories: "All categories",
    provisional:
      "Schematic, not the coded count for this session. The cells show how the three frames sit together.",
  },
  header: {
    script: "Women and children!",
    title: "How women are portrayed in United Nations speeches?",
  },
  opening: {
    script: "How women are portrayed?",
    title: "how women are portrayed?",
    lede: "Every year, the United Nations organises a General Debate, during which each country delivers a speech. They have 15 minutes to talk. Lots of words can be used.",
    body: "But... we asked ourselves: ",
    videoLabel: "Compilation of speeches that mention women",
    mute: "Mute",
    unmute: "Unmute",
    pause: "Pause",
    play: "Play",
  },
  photo: {
    title: "The general debate",
    alt: "Illustration of a podium and a green backdrop in the General Assembly hall, standing in for a photograph.",
    caption: "The general debate, session {session}.",
    credit: "Illustration. A documentary photograph can replace this frame.",
  },
  waffle: {
    title: "How much are women mentioned?",
    squareLabel: "Each rectangle represents a speech.",
    stitchLabel: "Each cross-stitch represents a speech in which women are mentioned.",
    stitchLabelChildren:
      "Each cross-stitch represents a speech in which women are mentioned alongside children or girls.",
    showing: "Showing {label}",
    steps: [
      {
        id: "pattern",
        title: "",
        body: "",
        figure: null,
        caption: "Women are mentioned in 105 of the total 197 speeches.",
      },
      {
        id: "rows",
        title: "",
        body: "",
        figure: "53%",
        caption: "of total speeches mentioned women.",
      },
      {
        id: "asked",
        title: "",
        body: "",
        figure: null,
        caption: "And when we asked how women are mentioned, we saw that...",
      },
      {
        id: "outline",
        title: "",
        body: "",
        figure: "43%",
        caption: "of mentions of women also mentioned children or girls.",
      },
    ],
    summary:
      "{phrase} of {withWomen} speeches that mention women also say women and children. {scanned} speeches were scanned.",
    scannedLabel: "Speeches scanned",
    mentionLabel: "Mention women",
    filledLabel: "Women and children",
    tableCaption: "Speeches scanned, speeches that mention women, and speeches that say women and children",
    source: "General debate, session {session}. {scanned} speeches scanned.",
    speechListCaption: "Speeches scanned, by speaker, country, and whether the speech mentions women or women and children",
    speakerLabel: "Speaker",
    countryLabel: "Country",
    speechTitleLabel: "Speech",
    mentionNone: "Women not mentioned",
    mentionWomen: "Women",
    mentionBoth: "Women and children",
  },
  quotes: {
    title: "In their words",
    lede: "The phrase, as it was spoken. The line is the transcript, trimmed at a sentence.",
    items: [
      {
        slug: "trinidad-and-tobago",
        depth: 0.18,
        text: "…we intend to commit to is women and children, as well as peace and security.",
      },
      {
        slug: "brazil",
        depth: 0.36,
        text: "Palestinians will carry the pain and trauma left by the genocide of women and children perpetrated.",
      },
      {
        slug: "iran-islamic-republic",
        depth: 0.24,
        text: "They martyred, assassinated our scientists, our men, women and children.",
      },
      {
        slug: "madagascar",
        depth: 0.42,
        text: "This priority commitment serves the entire population, particularly women and children, providing our youth with the means to build their future with confidence.",
      },
      {
        slug: "united-republic-tanzania",
        depth: 0.2,
        text: "…advocacy for women, children and those whose voices are too often unheard.",
      },
      {
        slug: "bosnia-and-herzegovina",
        depth: 0.32,
        text: "…advancing the rights of women and children.",
      },
      {
        slug: "mongolia",
        depth: 0.28,
        text: "…improving education, health, food security, and advancement of women and children.",
      },
    ],
  },
  frame: {
    script: "Evidence shows",
    title: "Evidence shows",
    body: "That the paradigm that associates women with children prevents women from being seen as active agents of change for peace, or actors of their own lives, thus limiting their participation in the reconstruction or rehabilitation of societies.",
    emphasis: "women with children",
    source:
      "Puechguirbal, N. (2004). Women and children: deconstructing a paradigm. Seton Hall J. Dipl. & Int'l Rel., 5, 5.",
  },
  portrayal: {
    agentsLabel: "Agents",
    mixedLabel: "Mixed",
    victimsLabel: "Victims",
    intro:
      "In UNGA 81, these categories were reflected as follows:",
    flowerRef: "Each flower represents whenever 'women and children' was mentioned in a country's speech.",
    grouped: "This is how 'women and children' were mentioned in the speeches.",
    card: "We saw that in {percent}% of the cases Women & Children are portrayed as victims.",
  },
  talk: {
    title: "How are women perceived?",
    description: "When we analysed the speeches, we identified three categories.",
    steps: [
      {
        id: "agents",
        label: "Agents",
        emphasis: "agents",
        body: "When we are talking about agents we are talking about speeches in which women are framed as active decision-makers, economic contributors, or rights-holders in their own right.",
      },
      {
        id: "victims",
        label: "Victims",
        emphasis: "victims",
        body: "When we are talking about victims, it is because they are framed as victims, targets, or members of vulnerable/protected groups in need of assistance.",
      },
      {
        id: "mixed",
        label: "Mixed",
        emphasis: "Mixed",
        body: "Mixed is when it contains explicit elements of both vulnerability framing and agency/actor framing within the same extract.",
      },
    ],
  },
  categories: {
    script: "Three frames",
    title: "What is the intended meaning of these categories?",
    lede: "Scroll the definitions. The mosaic keeps the category in view and lets the others recede.",
    summary:
      "Mosaic of three frames: agents, victims, and mixed. While reading one definition, cells of the other frames are dimmed.",
    tableCaption: "Cells in the schematic, by category",
    steps: [
      {
        id: "agents",
        label: "Agents",
        body: "When we are talking about agents we are talking about speeches in which women are framed as active decision-makers, economic contributors, or rights-holders in their own right.",
      },
      {
        id: "victims",
        label: "Victims",
        body: "When we are talking about victims we are talking about speeches in which women are framed as people who suffer harm, require protection, or stand in for innocence, often in the same phrase as children.",
      },
      {
        id: "mixed",
        label: "Mixed",
        body: "When we are talking about mixed we are talking about speeches that use both frames at once: women are rights-holders and, in the same passage, people to be saved.",
      },
    ],
  },
  note: {
    title: "In the transcript",
    lede: "Each hit keeps the speaker, the date, and the words around the phrase.",
    slug: "bosnia-and-herzegovina",
    excerpt:
      "…advancing the rights of women and children; and strengthening gender equality, better healthcare and education.",
  },
  flower: {
    script: "The proportion",
    title: "How often the phrase appears",
    lede: "Every petal is a speech that mentions women. One sector is the phrase women and children. The rest name women some other way.",
    summary:
      "Flower chart. {phrase} petals for women and children, {womenOnly} for other mentions of women, out of {withWomen}.",
    phraseLabel: "Women and children",
    otherLabel: "Other mentions of women",
    tableCaption: "Mentions of women, by whether the speech says women and children",
    source: "Same scan as the waffle: session {session}.",
  },
  orientation: {
    title: "How are speeches oriented?",
    policyLabel: "Policy reform",
    rhetoricalLabel: "Abstract / Rhetorical",
    policyShare: "6.3%",
    rhetoricalShare: "93.7%",
    body: "The majority of speeches mention women and children in a general narrative context without specific policy commitments.",
  },
  soWhat: {
    title: "So what?",
    paragraphs: [
      "We started this small project because, while listening to the speeches in the General Debate, we noticed that the phrase 'women and children' was mentioned many times. We felt that this was an outdated way of framing two groups with distinct rights, needs, and experiences.",
      "After reviewing academic literature on the subject, we started thinking about the implications of framing children as an extension of women's bodies, and as victims with similar needs. By grouping them together, women can be implicitly infantilised, and positioned at the same level as children, rather than recognised as autonomous political and social actors.",
      "In the speeches delivered at UNGA 81, 'women and children' are often framed in broad and abstract terms that emphasise vulnerability, without translating this concern into concrete actions to advance their rights.",
      "This approach can obscure the distinct needs, rights and agency of women and children. In particular, it prevents women from being recognised as active agents of change and actors of their own lives.",
    ],
  },
  closing: {
    slug: "timor-leste",
    text: "These are not abstracts. They are people, they are women and children, youth in their best years, they are parents, grandparents.",
  },
  footer: {
    credits: [
      { role: "Designed by:", names: "Macarena Zappe" },
      { role: "Research:", names: "Macarena Zappe & Agustina Nahas" },
      { role: "Developed by:", names: "Agustina Nahas" },
    ],
    bibliographyLabel: "Bibliography:",
    bibliography,
    methodLabel: "Method",
    method:
      "This reading covers the general debate of session {session} of the United Nations General Assembly. {scanned} speeches were scanned. Mentions of women were read in the three frames defined on this site: agents, victims, and mixed. The coded rows are in the open database.",
    citeLabel: "Cite this",
    cite: "Zappe, Macarena, and Agustina Nahas. {title}.",
    csvLabel: "Download the database (CSV)",
    databaseLabel: "Open database",
    databaseHref,
  },
};

export default en;
