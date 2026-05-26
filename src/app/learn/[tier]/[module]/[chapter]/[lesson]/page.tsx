/**
 * Grahvani Learning — Lesson Route (B3 chrome rendering).
 *
 * URL pattern: /learn/tier-1/module-1/chapter-1/lesson-1
 *
 * Loads the lesson markdown from curriculum/, parses it into 12 §-sections,
 * and renders each section through its dedicated chrome primitive.
 *
 * B4 will swap the §7 PrimarySimulator's placeholder for the real interactive.
 * B5 will swap the §10 MCQFlow's placeholder for the full mastery flow + cooldown.
 */

import { loadLesson } from "@/lib/learning-runtime/lesson-loader";
import { loadMcqBank } from "@/lib/learning-runtime/mcq-loader";
import type { LessonSection } from "@/lib/learning-runtime/types";
import {
  LessonShell,
  ColdOpen,
  OrientationCards,
  ConceptTheatre,
  SlokaBlock,
  WorkedExample,
  PrimarySimulator,
  MistakeCardDeck,
  MemoryAnchorDeck,
  MCQFlow,
  Summary,
  Continuation,
} from "@/components/learning-runtime/chrome";
import { VedangaBodyMap } from "@/components/learning-runtime/interactive/vedanga-body-map";
import { VedangaVsVedantaComparator } from "@/components/learning-runtime/interactive/vedanga-vs-vedanta-comparator";
import { VedangaRelationshipDiagram } from "@/components/learning-runtime/interactive/vedanga-relationship-diagram";
import { JyotishaVsWesternVsPopComparator } from "@/components/learning-runtime/interactive/jyotisha-vs-western-vs-pop-comparator";
import { KarmaTypologyExplorer } from "@/components/learning-runtime/interactive/karma-typology-explorer";
import { HistoricalTimeline } from "@/components/learning-runtime/interactive/historical-timeline";
import { BphsRecensionComparator } from "@/components/learning-runtime/interactive/bphs-recension-comparator";
import { VarahamihiraSkandhaCoverageExplorer } from "@/components/learning-runtime/interactive/varahamihira-skandha-coverage-explorer";
import { MedievalCodifierRelativeDatingExplorer } from "@/components/learning-runtime/interactive/medieval-codifier-relative-dating-explorer";
import { ParashariJaiminiParallelTraditionExplorer } from "@/components/learning-runtime/interactive/parashari-jaimini-parallel-tradition-explorer";
import { FourStreamLandscapeExplorer } from "@/components/learning-runtime/interactive/four-stream-landscape-explorer";
import { ThreeSkandhaCurriculumMap } from "@/components/learning-runtime/interactive/three-skandha-curriculum-map";
import { SectionDivider } from "@/components/learning-runtime/chrome/SectionDivider";
import { RevealSection } from "@/components/learning-runtime/chrome/RevealSection";
import { LessonTimeTracker } from "@/components/learning-runtime/LessonTimeTracker";
import { presentationFor } from "@/components/learning-runtime/lib/section-meta";
import Link from "next/link";

interface LessonRouteParams {
  tier: string;
  module: string;
  chapter: string;
  lesson: string;
}

/** Pull a section by its number from the parsed list. Returns undefined if missing. */
function findSection(sections: LessonSection[], number: string): LessonSection | undefined {
  return sections.find((s) => s.number === number);
}

/** True when a section's body is essentially "N/A" — used to hide the §6 hole on conceptual lessons. */
function isSectionEmpty(s: LessonSection): boolean {
  const t = s.body.trim();
  return t.length === 0 || /^\*?\s*N\/A/i.test(t);
}

export default async function LessonPage({
  params,
}: {
  params: Promise<LessonRouteParams>;
}) {
  const { tier, module: mod, chapter, lesson } = await params;

  let lessonData;
  let loadError: string | null = null;
  try {
    lessonData = await loadLesson(tier, mod, chapter, lesson);
  } catch (err) {
    loadError = err instanceof Error ? err.message : String(err);
  }

  const mcqBank = lessonData?.frontMatter.mcqBankFile
    ? await loadMcqBank(lessonData.frontMatter.mcqBankFile)
    : null;

  if (loadError || !lessonData) {
    return (
      <div className="gl-surface-night min-h-screen px-6 py-12">
        <div
          className="mx-auto gl-surface-twilight-glass p-8 space-y-4"
          style={{ maxWidth: "560px" }}
        >
          <h1
            className="text-3xl"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              color: "var(--gl-gold-accent)",
            }}
          >
            Lesson not found
          </h1>
          <p
            className="text-base"
            style={{ color: "var(--gl-ink-primary)", lineHeight: 1.65 }}
          >
            We could not locate a lesson at{" "}
            <code style={{ color: "var(--gl-gold-accent)" }}>
              /{tier}/{mod}/{chapter}/{lesson}
            </code>{" "}
            in the curriculum tree.
          </p>
          <pre
            className="text-xs whitespace-pre-wrap"
            style={{ color: "var(--gl-ink-muted)" }}
          >
            {loadError}
          </pre>
          <Link
            href="/learn/design-sanity"
            className="inline-block mt-4 text-sm hover:underline"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              color: "var(--gl-gold-accent)",
            }}
          >
            ← Return to design sanity check
          </Link>
        </div>
      </div>
    );
  }

  const { frontMatter: fm, sections } = lessonData;

  // Identify each canonical section by its §-number.
  const sec1 = findSection(sections, "1");
  const sec2 = findSection(sections, "2");
  const sec3 = findSection(sections, "3");
  const sec4 = findSection(sections, "4");
  const sec5 = findSection(sections, "5");
  const sec6 = findSection(sections, "6");
  const sec7 = findSection(sections, "7");
  const sec8 = findSection(sections, "8");
  const sec9 = findSection(sections, "9");
  const sec10 = findSection(sections, "10");
  const sec11 = findSection(sections, "11");
  const sec12 = findSection(sections, "12");

  // The Lesson Journey rail reflects what the *learner sees as a unit*, not
  // every authoring section in the markdown. §2 (prerequisites) has been
  // absorbed into the OrientationCards "Scholar's Contract" panel as a
  // preamble ribbon, so the rail entry for §2 would scroll to nowhere — drop
  // it. If §2 is ever rendered as its own visual block, this filter goes away.
  const railSections = sec2 && sec3 ? sections.filter((s) => s.number !== "2") : sections;

  return (
    <LessonShell sections={railSections} canonicalPath={fm.canonicalPath} frontMatter={fm}>
      <LessonTimeTracker slug={fm.slug} />
      {/* §1 — Cold Open (full-bleed hook) */}
      {sec1 && (
        <RevealSection>
          <ColdOpen frontMatter={fm} section={sec1} />
        </RevealSection>
      )}

      {/* §2 + §3 — Orientation (twin cards) */}
      {(sec2 || sec3) && (
        <RevealSection delayMs={80}>
          <OrientationCards
            frontMatter={fm}
            prerequisites={sec2}
            outcomes={sec3}
          />
        </RevealSection>
      )}

      {/* §4 — Concept Theatre (body + per-lesson interactives + reflection).
          Reflection prompts and interactive `scenes` are dispatched per lesson
          slug. To add a new lesson's interactives: extend the if/else below. */}
      {sec4 && (() => {
        let reflectionPrompts: string[] = [];
        let scenes: React.ReactNode = undefined;

        if (fm.slug === "jyotisha-as-vedanga") {
          reflectionPrompts = [
            "Which of the six Vedāṅgas' body-part role surprises you most, and why?",
            "If Jyotiṣa is the eye, what does that imply about its function relative to the other limbs?",
            "Try restating in your own words: why does the Veda need 'limbs' at all?",
          ];
          scenes = (
            <div className="space-y-8">
              <div>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "26px",
                    fontWeight: 500,
                    color: "var(--gl-gold-accent)",
                  }}
                >
                  The Vedic Body
                </h3>
                <VedangaBodyMap />
              </div>
              <div>
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "26px",
                    fontWeight: 500,
                    color: "var(--gl-gold-accent)",
                  }}
                >
                  Vedāṅga is not Vedānta
                </h3>
                <p
                  className="text-base italic mb-4"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    color: "var(--gl-ink-secondary)",
                    lineHeight: 1.55,
                    maxWidth: "640px",
                  }}
                >
                  For each text below, choose the tradition it belongs to. A wrong choice surfaces a hint — try again until the row settles.
                </p>
                <VedangaVsVedantaComparator />
              </div>
            </div>
          );
        } else if (fm.slug === "the-six-vedangas-and-their-relationship") {
          reflectionPrompts = [
            "Which cluster — recitation, meaning, or action — surprised you most as the place Jyotiṣa actually belongs?",
            "If you had to drop one of the six Vedāṅgas from a Jyotiṣa learner's training, which would you cut and what specifically would break?",
            "Try restating in your own words: what does sāṅga study mean, and why does it matter for a Jyotiṣa specialist today?",
          ];
          scenes = (
            <div data-l2-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                The Six Vedāṅgas as a Coordinated Lotus
              </h3>
              <p
                className="text-base italic mb-4"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  color: "var(--gl-ink-secondary)",
                  lineHeight: 1.55,
                  maxWidth: "680px",
                }}
              >
                The painting on the left is the contemplative figure. The
                panel on the right is the explore surface — tap any of the
                six Vedāṅga rows to read its function, cluster membership,
                and Jyotiṣa interlock.
              </p>
              <VedangaRelationshipDiagram />
            </div>
          );
        } else if (fm.slug === "modern-founders-krishnamurti-and-joshi") {
          reflectionPrompts = [
            "Of the 11 distinctive contributions you just saw (5 KP + 6 Lal Kitab), which ORIGINATION strikes you as the boldest doctrinal move — the one least derivable from anything in the prior classical landscape — and what does it tell you about what the modern-primary doctrine actually authorises?",
            "Where do YOU sit on the three modern-primary criteria (origination + practitioner lineage + empirical results)? Are there other modern Vedic-astrology authors you'd nominate as candidates — and which criterion do they meet (or fail)?",
            "Try restating the four-stream landscape in your own words: how does \"complementary, not competing\" change what you'll do when you next read a single-stream practitioner critiquing another stream?",
          ];
          scenes = (
            <div data-l26-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                The Four-Stream Classical Landscape Completed
              </h3>
              <p
                className="text-base italic mb-4"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  color: "var(--gl-ink-secondary)",
                  lineHeight: 1.55,
                  maxWidth: "680px",
                }}
              >
                Two modern primaries — KP and Lal Kitab — complete the
                four-stream landscape (Parāśari + Jaiminī + KP + Lal Kitab).
                Below: the four-stream hero, the modern-primary vs
                modern-revival distinction, K.S. Krishnamurti's five
                distinctive KP contributions, Pandit Roop Chand Joshi's six
                distinctive Lal Kitab contributions, and the three modern-
                primary status criteria with per-stream evidence.
              </p>
              <FourStreamLandscapeExplorer />
            </div>
          );
        } else if (fm.slug === "jaimini-and-the-second-tradition") {
          reflectionPrompts = [
            "Of the five distinctive Jaiminī doctrines (Cara Rāśi Daśās, Ārūḍha Lagna, rāśi-aspects, cara kārakas, Jaiminī yogas), which one's GENUINELY UNIQUE status surprised you most — and what does that imply for what you'd lose if Jaiminī were treated as a sub-school of Parāśari?",
            "Where do YOU sit on the same-Jaiminī identity question (Jyotiṣa Jaiminī = Mīmāṁsā Jaiminī or two different people)? When you next cite the Jaiminī Sūtra, what's the honest framing you'll use?",
            "Try restating in your own words: what is the difference between PARALLEL traditions and SUBORDINATE traditions — and why does parallel-not-subordinate change how you read every classical Jyotiṣa citation?",
          ];
          scenes = (
            <div data-l25-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Jaiminī and the Parallel Second Tradition
              </h3>
              <p
                className="text-base italic mb-4"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  color: "var(--gl-ink-secondary)",
                  lineHeight: 1.55,
                  maxWidth: "680px",
                }}
              >
                Parāśari and Jaiminī run alongside each other across three
                millennia of classical Jyotiṣa — structurally parallel,
                doctrinally complementary. Below: the diptych framing, the
                four-layer side-by-side lineage, the sūtra-vs-verse genre
                contrast, the five genuinely-distinctive Jaiminī doctrines,
                and the same-Jaiminī identity question held open.
              </p>
              <ParashariJaiminiParallelTraditionExplorer />
            </div>
          );
        } else if (fm.slug === "medieval-codifiers-kalyanavarma-mantresvara") {
          reflectionPrompts = [
            "Of the four medieval codifiers, whose distinctive contribution (yoga catalogue / practitioner pedagogy / comprehensive synthesis / praśna foundation) feels most operationally useful to you — and why?",
            "Where do YOU sit in the codifier vs originator framing? When you cite a classical author going forward, will you treat their role as transmitting, refining, or originating? What changes?",
            "Try restating the three-layer lineage in your own words: foundational ṛṣi-core → systematic codifier → medieval codifiers. What does each layer contribute that the others don't?",
          ];
          scenes = (
            <div data-l24-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Kalyāṇavarmā, Mantreśvara, and the Medieval Codifiers
              </h3>
              <p
                className="text-base italic mb-4"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  color: "var(--gl-ink-secondary)",
                  lineHeight: 1.55,
                  maxWidth: "680px",
                }}
              >
                Four medieval codifiers refining and synthesising the
                Parāśara + Varāhamihira foundation. Below: the three-layer
                Parāśari-tradition lineage, the four codifier plates with
                bracketed dating + citation evidence + distinctive
                contribution, and the compounding-uncertainty visualisation.
              </p>
              <MedievalCodifierRelativeDatingExplorer />
            </div>
          );
        } else if (fm.slug === "varahamihira-the-systematic-codifier") {
          reflectionPrompts = [
            "Of Varāhamihira's three texts (Bṛhat Jātaka, Bṛhat Saṁhitā, Pañcasiddhāntikā), which one's existence surprised you most — and what does it tell you about the breadth of classical Jyotiṣa scholarship?",
            "When you next encounter a date claim for a classical Jyotiṣa author (e.g., \"Kalyāṇavarmā ~800 CE\"), what's the FIRST question you'll ask about how that date was arrived at?",
            "Try restating the both-anchors framework in your own words: how can Parāśara AND Varāhamihira both be authoritative without one displacing the other?",
          ];
          scenes = (
            <div data-l23-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Varāhamihira, the Systematic Codifier
              </h3>
              <p
                className="text-base italic mb-4"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  color: "var(--gl-ink-secondary)",
                  lineHeight: 1.55,
                  maxWidth: "680px",
                }}
              >
                The most-reliably-dateable classical Jyotiṣa author and the
                only one to codify across all three skandhas. Below: the
                date-anchor hero, his three primary texts, the astronomical-
                position dating methodology, and the both-anchors framework
                pairing him with Parāśara.
              </p>
              <VarahamihiraSkandhaCoverageExplorer />
            </div>
          );
        } else if (fm.slug === "parashara-the-foundational-rishi") {
          reflectionPrompts = [
            "Of the ten BPHS prakaraṇa-divisions, which one's PURPOSE surprised you most — and what does it tell you about BPHS's encyclopaedic ambition?",
            "How will you change the way you cite BPHS in your own writing now that you've seen the recension layering? What will you say differently?",
            "Try restating in your own words: how can BPHS be BOTH foundational-authoritative AND recensionally-medieval at the same time — without contradiction?",
          ];
          scenes = (
            <div data-l22-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Parāśara, BPHS, and the Recension Problem
              </h3>
              <p
                className="text-base italic mb-4"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  color: "var(--gl-ink-secondary)",
                  lineHeight: 1.55,
                  maxWidth: "680px",
                }}
              >
                One name spans two layers: the pre-classical Maharṣi Parāśara
                whom tradition attests, and the medieval-recensional Bṛhat
                Parāśara Horā Śāstra we actually read. Below: the duality
                framing, the ten major prakaraṇa-divisions, and the citation
                discipline that respects both layers.
              </p>
              <BphsRecensionComparator />
            </div>
          );
        } else if (fm.slug === "the-historical-timeline-of-jyotisha") {
          reflectionPrompts = [
            "Of the twelve authors on the timeline, which one's DATING DIVERGENCE between traditional and academic surprised you most — and what does it imply about how you should hear classical citations going forward?",
            "Of the four citation-discipline moves (source / date / recension / translator), which one do you think you'll find HARDEST to apply consistently — and why?",
            "Try restating in your own words: why does the MODERN PRIMARY carve-out matter — what would be lost if KP and Lal Kitab were lumped in with 'modern derivative'?",
          ];
          scenes = (
            <div data-l21-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Three Millennia, Twelve Anchors
              </h3>
              <p
                className="text-base italic mb-4"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  color: "var(--gl-ink-secondary)",
                  lineHeight: 1.55,
                  maxWidth: "680px",
                }}
              >
                The major authors and texts of Indian Jyotiṣa, placed on the
                academic-Indology chronological axis. Each marker is
                clickable. Toggle the traditional-dating overlay to see where
                the lineage chronology and the academic-Indology chronology
                disagree — sometimes by centuries, sometimes by millennia.
              </p>
              <HistoricalTimeline />
            </div>
          );
        } else if (fm.slug === "philosophy-of-karma-and-prediction") {
          reflectionPrompts = [
            "Of the four karma types, which one's MAPPING onto Jyotiṣa's predictive scope surprised you most — and what does that imply about how you should hear classical chart-readings?",
            "Where do YOU sit between deterministic prediction (\"the chart tells you what will happen\") and full agency (\"nothing is given\")? What does the four-fold framework do to that intuition?",
            "Try restating in your own words: why is indication-with-confidence-tier framing more honest than deterministic prediction — given what the chart can and cannot read?",
          ];
          scenes = (
            <div data-l4-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                The Four-Fold Karma and What Jyotiṣa Reads
              </h3>
              <p
                className="text-base italic mb-4"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  color: "var(--gl-ink-secondary)",
                  lineHeight: 1.55,
                  maxWidth: "680px",
                }}
              >
                Saṁcita, Prārabdha, Āgāmī, Kriyamāṇa — four karma types around
                a single agent at the cycle's centre. Tap any node to read
                what the type is, what Jyotiṣa can see of it, and how much
                agency the agent has over it. The pattern teaches WHY
                deterministic prediction is incoherent with the framework.
              </p>
              <KarmaTypologyExplorer />
            </div>
          );
        } else if (fm.slug === "three-skandhas-overview") {
          reflectionPrompts = [
            "Of the three skandhas, which one's modern operational distribution surprised you most — and what does that imply about how you should value gaṇita study?",
            "Where do YOU think the curriculum should have placed more saṁhitā coverage? What would be lost if saṁhitā were reduced further?",
            "Try restating in your own words: why is gaṇita called 'foundational-substrate' rather than 'most important'?",
          ];
          scenes = (
            <div data-l31-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                The Three Skandhas and the Curriculum Map
              </h3>
              <p
                className="text-base italic mb-4"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  color: "var(--gl-ink-secondary)",
                  lineHeight: 1.55,
                  maxWidth: "680px",
                }}
              >
                The classical three-fold organisation of Jyotiṣa — Gaṇita
                (mathematical-astronomy), Horā (natal-and-predictive
                astrology), and Saṁhitā (mundane astrology + adjacent
                encyclopaedic disciplines). The painting on the left shows
                the triangular relationship; the panel on the right lets you
                explore each skandha's texts, modules, and stream-specific
                emphasis.
              </p>
              <ThreeSkandhaCurriculumMap />
            </div>
          );
        } else if (fm.slug === "jyotisha-vs-western-astrology-vs-pop-astrology") {
          reflectionPrompts = [
            "Of the six dimensions, which one was the biggest surprise — where did you realise you'd been carrying an incorrect mental model about one of the traditions?",
            "When you encounter \"astrology\" in casual conversation tomorrow, what's the FIRST clarifying question you'll ask before engaging substantively?",
            "Where do you think classical Hellenistic Western astrology actually has MORE in common with Vedic Jyotiṣa than modern psychological Western does? What does that tell you about the lineage?",
          ];
          scenes = (
            <div data-l3-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                What Jyotiṣa Is — and Is Not
              </h3>
              <p
                className="text-base italic mb-4"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  color: "var(--gl-ink-secondary)",
                  lineHeight: 1.55,
                  maxWidth: "680px",
                }}
              >
                Three astrology traditions, six discriminating dimensions.
                The painting on the left grounds the visual register — the
                panel on the right is the explore surface. Pick a dimension
                to see how each tradition handles it, then read the
                convergence and divergence callouts beneath.
              </p>
              <JyotishaVsWesternVsPopComparator />
            </div>
          );
        }

        // For three-skandhas-overview, the markdown §4 body contains an ASCII-art
        // triangle that duplicates the interactive SVG scene. Strip it so only
        // the interactive visual renders.
        const sec4Cleaned =
          fm.slug === "three-skandhas-overview" && sec4
            ? { ...sec4, body: sec4.body.replace(/```[\s\S]*?```/g, "") }
            : sec4;

        return <ConceptTheatre section={sec4Cleaned} reflectionPrompts={reflectionPrompts} scenes={scenes} />;
      })()}

      {sec5 && (
        <RevealSection>
          <SectionDivider accentHex={presentationFor(sec5).accentHex} />
          <SlokaBlock section={sec5} frontMatter={fm} />
        </RevealSection>
      )}

      {sec6 && !isSectionEmpty(sec6) && (
        <RevealSection>
          <SectionDivider accentHex={presentationFor(sec6).accentHex} />
          <WorkedExample section={sec6} />
        </RevealSection>
      )}

      {sec7 && (
        <RevealSection>
          <SectionDivider accentHex={presentationFor(sec7).accentHex} />
          <PrimarySimulator section={sec7} frontMatter={fm} />
        </RevealSection>
      )}

      {sec8 && (
        <RevealSection>
          <SectionDivider accentHex={presentationFor(sec8).accentHex} />
          <MistakeCardDeck section={sec8} frontMatter={fm} />
        </RevealSection>
      )}

      {sec9 && (
        <RevealSection>
          <SectionDivider accentHex={presentationFor(sec9).accentHex} />
          <MemoryAnchorDeck section={sec9} />
        </RevealSection>
      )}

      {sec10 && (
        <RevealSection>
          <SectionDivider accentHex={presentationFor(sec10).accentHex} />
          <MCQFlow section={sec10} frontMatter={fm} bank={mcqBank} />
        </RevealSection>
      )}

      {sec11 && (
        <RevealSection>
          <SectionDivider accentHex={presentationFor(sec11).accentHex} />
          <Summary section={sec11} frontMatter={fm} />
        </RevealSection>
      )}

      {sec12 && (
        <RevealSection>
          <SectionDivider accentHex={presentationFor(sec12).accentHex} />
          <Continuation section={sec12} frontMatter={fm} />
        </RevealSection>
      )}
    </LessonShell>
  );
}

export const metadata = {
  title: "Grahvani · Lesson",
};
