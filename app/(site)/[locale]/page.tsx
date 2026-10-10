import { notFound } from "next/navigation";
import { AssemblyFigure } from "@/components/sections/AssemblyFigure";
import { CategoryScrolly } from "@/components/sections/CategoryScrolly";
import { ClosingQuote } from "@/components/sections/ClosingQuote";
import { EvidenceFrame } from "@/components/sections/EvidenceFrame";
import { MentionVideo } from "@/components/sections/MentionVideo";
import { PortrayalScrolly } from "@/components/sections/PortrayalScrolly";
import { Quotes } from "@/components/sections/Quotes";
import { OrientationScrolly } from "@/components/sections/OrientationScrolly";
import { SoWhat } from "@/components/sections/SoWhat";
import { SpeechGridScrolly } from "@/components/sections/SpeechGridScrolly";
import { TalkScrolly } from "@/components/sections/TalkScrolly";
import { TranscriptNote } from "@/components/sections/TranscriptNote";
import { ScriptHeading } from "@/components/ScriptHeading";
import { Flower } from "@/components/charts/Flower";
import { getContent } from "@/content";
import { countCategories, getFigures, getMosaicCells, getSpeech } from "@/lib/charts";
import { getPortrayalMentions } from "@/lib/portrayals";
import { getSpeechTiles } from "@/lib/speeches";
import { isLocale } from "@/lib/locales";
import { fill, formatDate } from "@/lib/text";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const content = getContent(raw);
  const figures = getFigures();
  const cells = getMosaicCells();
  const counts = countCategories(cells);
  const values = {
    ...figures,
    percent: Math.round((figures.withWomen / figures.scanned) * 100),
  };
  const portrayals = getPortrayalMentions();
  const speeches = getSpeechTiles();
  const victimShare = portrayals.filter((mention) => mention.kind === "victims").length;
  const victimPercent = new Intl.NumberFormat(raw, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(portrayals.length === 0 ? 0 : (victimShare / portrayals.length) * 100);
  const note = getSpeech(content.note.slug);
  const closing = getSpeech(content.closing.slug);
  const quotes = content.quotes.items.map((item) => {
    const speech = getSpeech(item.slug);
    return { ...item, speaker: speech.speaker, country: speech.country };
  });

  return (
    <main id="content">
      <section id="opening" aria-labelledby="opening-title">
        <div className="w-full mx-auto max-w-[1200px] px-5 pt-[clamp(3rem,8vw,6rem)]">
          <ScriptHeading
            id="opening-title"
            as="h2"
            script={content.opening.script}
            lede={content.opening.lede}
            body={content.opening.body}
          />
        </div>
        <MentionVideo
          label={content.opening.videoLabel}
          mute={content.opening.mute}
          unmute={content.opening.unmute}
          pause={content.opening.pause}
          play={content.opening.play}
        />
      </section>

      <SpeechGridScrolly
        locale={raw}
        title={content.waffle.title}
        squareLabel={content.waffle.squareLabel}
        stitchLabel={content.waffle.stitchLabel}
        stitchLabelChildren={content.waffle.stitchLabelChildren}
        showing={content.waffle.showing}
        steps={content.waffle.steps.map((step) => ({
          ...step,
          title: fill(step.title, values, raw),
          body: fill(step.body, values, raw),
          figure: step.figure === null ? null : fill(step.figure, values, raw),
          caption: fill(step.caption, values, raw),
        }))}
        summary={fill(content.waffle.summary, values, raw)}
        speechListCaption={content.waffle.speechListCaption}
        speakerLabel={content.waffle.speakerLabel}
        countryLabel={content.waffle.countryLabel}
        speechTitleLabel={content.waffle.speechTitleLabel}
        mentionNone={content.waffle.mentionNone}
        mentionWomen={content.waffle.mentionWomen}
        mentionBoth={content.waffle.mentionBoth}
        scannedLabel={content.waffle.scannedLabel}
        mentionLabel={content.waffle.mentionLabel}
        filledLabel={content.waffle.filledLabel}
        tableCaption={content.waffle.tableCaption}
        groupLabel={content.ui.groupLabel}
        valueLabel={content.ui.speechesLabel}
        source={fill(content.waffle.source, values, raw)}
        scanned={figures.scanned}
        withWomen={figures.withWomen}
        phrase={figures.phrase}
        speeches={speeches}
      />

      <Quotes
        locale={raw}
        title={content.quotes.title}
        quotes={quotes}
        translationLabel={content.ui.translationLabel}
        closeLabel={content.ui.closeLabel}
      />

      <EvidenceFrame
        script={content.frame.script}
        body={content.frame.body}
        emphasis={content.frame.emphasis}
        source={content.frame.source}
      />

      <TalkScrolly title={content.talk.title} description={content.talk.description} steps={content.talk.steps} />

      <PortrayalScrolly
        flowerRef={content.portrayal.flowerRef}
        locale={raw}
        agentsLabel={content.portrayal.agentsLabel}
        mixedLabel={content.portrayal.mixedLabel}
        victimsLabel={content.portrayal.victimsLabel}
        intro={content.portrayal.intro}
        grouped={content.portrayal.grouped}
        card={fill(content.portrayal.card, { percent: victimPercent }, raw)}
        mentions={portrayals}
      />

      <OrientationScrolly
        title={content.orientation.title}
        policyLabel={content.orientation.policyLabel}
        rhetoricalLabel={content.orientation.rhetoricalLabel}
        policyShare={content.orientation.policyShare}
        rhetoricalShare={content.orientation.rhetoricalShare}
        body={content.orientation.body}
      />

      <SoWhat title={content.soWhat.title} paragraphs={content.soWhat.paragraphs} />
    </main>
  );
}
