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
import { TithiAngleVisualizer } from "@/components/learning-runtime/interactive/tithi-angle-visualizer";
import { TithiContextMatcher } from "@/components/learning-runtime/interactive/tithi-context-matcher";
import { ShuklaTithiStrip } from "@/components/learning-runtime/interactive/shukla-tithi-strip";
import { SevenSubBranchesExplorer } from "@/components/learning-runtime/interactive/seven-sub-branches-explorer";
import ZodiacTraditionComparator from "@/components/learning-runtime/interactive/zodiac-tradition-comparator";
import { RegionalSchoolsExplorer } from "@/components/learning-runtime/interactive/regional-schools-explorer";
import { LineageThreadsNetworkExplorer } from "@/components/learning-runtime/interactive/lineage-threads-network-explorer";
import { ThreeLineageComparisonChartAnalyzer } from "@/components/learning-runtime/interactive/three-lineage-comparison-chart-analyzer";
import { YugaProportionVisualiser } from "@/components/learning-runtime/interactive/yuga-proportion-visualiser";
import { YugaCycleExplorer } from "@/components/learning-runtime/interactive/yuga-cycle-explorer";
import { TraditionalVsAcademicDatingComparator } from "@/components/learning-runtime/interactive/traditional-vs-academic-dating-comparator";
import { YugaDependenceClassifier } from "@/components/learning-runtime/interactive/yuga-dependence-classifier";
import { DayTypeComparator } from "@/components/learning-runtime/interactive/day-type-comparator";
import { SunriseAtAnyLatitude } from "@/components/learning-runtime/interactive/sunrise-at-any-latitude";
import { SiderealDayExplorer } from "@/components/learning-runtime/interactive/sidereal-day-explorer";
import { TithiFromSunMoon } from "@/components/learning-runtime/interactive/tithi-from-sun-moon";
import { SankrantiTracker } from "@/components/learning-runtime/interactive/sankranti-tracker";
import { SamvatConverterVikramaShaka } from "@/components/learning-runtime/interactive/samvat-converter-vikrama-shaka";
import { RegionalCalendarExplorer } from "@/components/learning-runtime/interactive/regional-calendar-explorer";
import { CalendarConverter } from "@/components/learning-runtime/interactive/calendar-converter";
import { SectionDivider } from "@/components/learning-runtime/chrome/SectionDivider";
import { RevealSection } from "@/components/learning-runtime/chrome/RevealSection";
import { LessonTimeTracker } from "@/components/learning-runtime/LessonTimeTracker";
import { presentationFor } from "@/components/learning-runtime/lib/section-meta";
import { MarkdownContent } from "@/components/learning-runtime/chrome/MarkdownContent";
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
  // it. Subsections (e.g., §3.1, §4.2) inherit their parent's type label, which
  // creates repetitive sidebar entries — filter them out; the learner navigates
  // to the parent and reads through subsections sequentially.
  const railSections = sec2 && sec3
    ? sections.filter((s) => s.number !== "2" && !s.number.includes("."))
    : sections.filter((s) => !s.number.includes("."));

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
        } else if (fm.slug === "tithi-as-12-degrees-of-sun-moon-angle") {
          reflectionPrompts = [
            "At what elongation does the transition from śukla to kṛṣṇa pakṣa occur, and why is it astronomically significant?",
            "If a birth occurs at 16:00 on a day whose pañcāṅga-tithi is Śukla Caturthī but whose tithi-end-time was 14:42, what tithi do you record in the natal chart — and why?",
            "Try restating in your own words: why must true (spaṣṭa) longitudes be used instead of mean longitudes for tithi computation?",
          ];
          scenes = (
            <div data-l311-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                The 12° Sun-Moon Engine
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
                The tithi is the first limb of the pañcāṅga — computed from the
                angular separation of the Moon from the Sun, 12° per tithi.
                Drag the slider to see how the tithi changes as the Moon
                advances, and read the pañcāṅga interpretation at each moment.
              </p>
              <TithiAngleVisualizer />
              <div className="mt-10">
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "26px",
                    fontWeight: 500,
                    color: "var(--gl-gold-accent)",
                  }}
                >
                  Pañcāṅga-tithi vs Astronomical-instantaneous
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
                  The same 12° formula produces two operationally distinct tithis
                  depending on when you apply it. Read each scenario and choose
                  which tithi type a practitioner would use — wrong choices teach
                  via correction.
                </p>
                <TithiContextMatcher />
              </div>
            </div>
          );
        } else if (fm.slug === "the-15-shukla-tithis") {
          reflectionPrompts = [
            "Which śukla tithi's deity association surprised you most — and what does it tell you about how tithi-deity correspondences encode cultural significance?",
            "Why do you think Pratipadā and Pūrṇimā have special names while tithis 2–14 follow a numeral pattern? What does this tell you about how the tradition frames beginnings and endings?",
            "Try reciting the 15 śukla tithis in order from memory — which three give you the most trouble, and why?",
          ];
          scenes = (
            <div data-l312-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                The 15 Śukla Tithis in Sequence
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
                Scroll through the strip below — each card shows the tithi
                name, Devanāgarī, deity, and quality. Tap any card to reveal
                its operational significance and festival associations. Filter
                by quality to see the mod-5 pattern (Nandā 1/6/11, Bhadrā
                2/7/12, Jayā 3/8/13, Riktā 4/9/14, Pūrṇā 5/10/15).
              </p>
              <ShuklaTithiStrip />
            </div>
          );
        } else if (fm.slug === "seven-sub-branches") {
          reflectionPrompts = [
            "Which sub-branch surprised you most in how much curriculum coverage it receives — or doesn't receive? What does that imply about how you should allocate your study time?",
            "Where do YOU think the honest framing of 'seven as convention' helps the learner — and where might it create unnecessary doubt?",
            "Try restating in your own words: why is Bṛhat Saṁhitā primary for multiple saṁhitā sub-branches, while no single text dominates all horā sub-branches?",
          ];
          scenes = (
            <div data-l32-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Zodiac Tradition Comparator
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
                The interactive below allows you to conceptually and visually understand the fundamental differences between the Sidereal (Nirayana) and Tropical (Sayana) zodiac systems. Use the Time Travel slider to observe Ayanamsa drift.
              </p>
              <ZodiacTraditionComparator />
            </div>
          );
        } else if (fm.slug === "where-grahvani-sits-in-the-skandha-map") {
          reflectionPrompts = [
            "Which cell of the 4 × 3 × 7 coverage matrix surprised you most in how the curriculum distributed its depth — and what does that tell you about the curriculum's operational priorities?",
            "Of the seven categories of intentional non-coverage, which one do you think will be most relevant to YOUR learning path — and what's your plan for engaging the cross-references?",
            "Try restating in your own words: why is 'modern-teaching-synthesis' a MORE honest self-positioning than 'modern-primary' would be for this curriculum?",
          ];
        } else if (fm.slug === "regional-schools-and-lineages") {
          reflectionPrompts = [
            "Of the six regional schools, which one's stream-concentration pattern surprised you most — and what does it tell you about how geography shapes doctrinal emphasis?",
            "A Punjabi Parāśari practitioner and a Tamil Nadu Parāśari practitioner share the same stream — but what specific regional-school differences would you expect in their teaching language, cultural framing, and cross-stream references?",
            "Try restating in your own words: why is the regional-school organisational level NECESSARY alongside streams + skandhas + sub-branches? What would be lost without it?",
          ];
          scenes = (
            <div data-l41-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Six Regional Schools Across the Four-Stream Landscape
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
                The geographic-cultural-linguistic organisational level that
                cross-cuts the four-stream landscape. The map on the left
                shows the six schools across India and the global diaspora;
                the panel on the right lets you explore each school's
                geographic centres, languages, stream concentrations, and
                distinctive practitioner-community features. Toggle the
                cross-regional practice overlay to see how modern
                globalisation connects the schools.
              </p>
              <RegionalSchoolsExplorer />
            </div>
          );
        } else if (fm.slug === "modern-lineage-threads") {
          reflectionPrompts = [
            "Of the eight lineage threads, which one's relationship to its regional school surprised you most — and what does it tell you about how lineages operate within broader regional contexts?",
            "A learner trained through BVB Delhi and another through SJC both study Jaiminī revival material. What specific lineage-level differences would you expect in their methodological emphases, teaching infrastructure, and practitioner-community norms?",
            "Try restating in your own words: why is the lineage-thread organisational level NECESSARY alongside streams + skandhas + sub-branches + regional schools? What would be lost without it?",
          ];
          scenes = (
            <div data-l42-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Eight Modern Lineage Threads
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
                The specific teacher-student-network organisations that
                produce operational practitioner training pathways — more
                granular than regional schools, more concrete than streams.
                The network diagram on the left shows the eight lineage
                threads with their founders and cross-connections; the panel
                on the right lets you explore each lineage's founder,
                regional school, stream emphasis, teaching infrastructure,
                distinctive features, and cross-references. Toggle the
                cross-cutting patterns overlay to see multi-region and
                multi-stream lineage operation.
              </p>
              <LineageThreadsNetworkExplorer />
            </div>
          );
        } else if (fm.slug === "lineage-matters-worked-example") {
          reflectionPrompts = [
            "The three approaches converge on broad-strokes thematic interpretation (marriage-challenge + career-strength + strong-lagna). Where do YOU sit on the reliability question — does convergence across lineages convince you of analytical reliability, or do you need additional evidence?",
            "Of the three approaches' unique contributions (KP event-timing precision; BVB deepest classical engagement; Western-Vedic-fusion cross-cultural translation + broader integration), which one would be most valuable to YOUR learning path — and what's your plan for accessing it?",
            "Try restating in your own words: what is the difference between 'synthesis' and 'collapse' — and why does the synthesis discipline prevent multi-lineage practice from diluting single-lineage operational accuracy?",
          ];
          scenes = (
            <div data-l43-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Same Chart, Three Lineages — Convergence, Divergence, Synthesis
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
                The chapter-capstone + module-capstone worked example:
                an anonymised demonstration chart analysed through three
                lineage approaches — Tamil Nadu KP teaching lineage, BVB
                Delhi Parāśari + Jaiminī revival, and Western-Vedic-fusion
                (SJC/AIVS-style). The chart on the left shows the
                demonstration chart; the panel on the right lets you explore
                each lineage's chart-erection conventions, primary
                analytical lens, distinctive predictive judgments, and
                remedial recommendations. Toggle the convergence +
                divergence + unique contributions comparison to see the
                full three-way analytical pattern.
              </p>
              <ThreeLineageComparisonChartAnalyzer />
            </div>
          );
        } else if (fm.slug === "the-four-yugas-and-the-mahayuga") {
          reflectionPrompts = [
            "The 4:3:2:1 proportional structure and the absolute durations (1.728M / 1.296M / 0.864M / 0.432M years) are two ways of describing the same thing. Which representation do you find more memorable, and why?",
            "The dharma-erosion doctrine is a cosmological-philosophical framework, not a sociological claim. What is the practical difference this framing makes for how you read classical texts?",
            "Try restating in your own words: why does the yuga-cycle need saṁdhyā + saṁdhyāṁśa twilight regions? What doctrinal awkwardness would arise without them?",
          ];
          scenes = (
            <div data-l231-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                The Four Yugas and the Mahā-Yuga
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
                The complete four-yuga unit — Satya, Tretā, Dvāpara, Kali —
                proportionally structured in the invariant 4:3:2:1 ratio.
                Toggle between proportion, absolute duration, and saṁdhyā
                twilight modes. Click any yuga bar to reveal its detail
                panel: Devanāgarī name, duration in divya-varṣa and human
                years, dharma-leg count, and symbolic gloss. Answer the
                formative checkpoints to test recall.
              </p>
              <YugaProportionVisualiser />
            </div>
          );
        } else if (fm.slug === "manvantara-and-kalpa-the-cosmic-scale") {
          reflectionPrompts = [
            "The Manvantara (~308M years) and Kalpa (~4.32B years) are scales far beyond human intuition. What mental anchor do you use to make these numbers meaningful?",
            "Why does the Kalpa structure need 14 Manvantaras plus 15 saṁdhyā periods rather than a simple multiple? What doctrinal function does the saṁdhyā serve at this scale?",
            "Try restating in your own words: what is the difference between a Manvantara and a Kalpa, and why does the distinction matter for cosmological literacy?",
          ];
          scenes = (
            <div data-l232-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Manvantara and Kalpa: The Cosmic Scale
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
                Explore the nested cosmic-time hierarchy from Mahā-Yuga up to
                Brahmā-life. Toggle each tier to reveal its duration, constituent
                units, and classical anchors.
              </p>
              <YugaCycleExplorer />
            </div>
          );
        } else if (fm.slug === "where-are-we-now") {
          reflectionPrompts = [
            "The traditional, Yukteshwar, and academic-Indology positions on present-epoch dating all operate at different epistemological registers. Which register do you find most challenging to hold simultaneously with the others?",
            "The saṅkalpa formula requires the traditional placement. How would you honestly respond to a client who asks why you use the traditional framework rather than Yukteshwar's?",
            "Try restating in your own words: what is the difference between 'this position is operationally normative in context X' and 'this position is universally true'?",
          ];
          scenes = (
            <div data-l233-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Traditional vs Academic Dating Comparator
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
                Three position-clusters side by side — Traditional Vedic,
                Yukteshwar, and Academic-Indology — with the multi-tradition-
                honesty synthesis dial at the bottom.
              </p>
              <TraditionalVsAcademicDatingComparator />
            </div>
          );
        } else if (fm.slug === "does-yuga-position-affect-your-chart") {
          reflectionPrompts = [
            "The diagnostic question — 'does this computation require cosmic-time-locator input?' — cleanly separates yuga-dependent from yuga-independent calculations. Which category surprised you more in how large it is?",
            "Why is 'cultural-cosmological context' operationally distinct from 'computational input'? When might a practitioner confuse the two in client communication?",
            "Try restating the honest-weighting framework in your own words: what is the third path between maximalist over-application and minimalist under-application?",
          ];
          scenes = (
            <div data-l234-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Yuga-Dependence Classifier
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
                Classify each practitioner computation as yuga-dependent or
                yuga-independent using the single diagnostic question. Surface
                correct verdicts, reasoning, and cross-references.
              </p>
              <YugaDependenceClassifier />
            </div>
          );
        } else if (fm.slug === "the-four-day-types") {
          reflectionPrompts = [
            "The four day-types are defined by four different reference-events (sunrise, star-transit, Sun-Moon angle, sign-ingress). Which reference-event do you find most counterintuitive, and why?",
            "A client says 'I was born on March 15, 1985 at 2 AM' — which day-type is implicit in their statement, and which day-type would a pañcāṅga use to determine their vāra?",
            "Try restating in your own words: why does the sidereal day (~23h 56m) being shorter than the sāvana day (~24h) mean that using sāvana-day mechanics for sidereal-position computation accumulates ~1° error per year?",
          ];
          scenes = (
            <div data-l241-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                The Four Day-Types Comparator
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
                Compare the four day-types side by side — sāvana, sidereal,
                lunar/tithi, and solar/saṅkrānti. Toggle each dimension
                (reference-event, duration, operational norm) to see how
                each day-type differs from the others.
              </p>
              <DayTypeComparator />
            </div>
          );
        } else if (fm.slug === "savana-day-and-civil-time") {
          reflectionPrompts = [
            "The sunrise-hour-angle formula cos H = −tan(φ) × tan(δ) is a spherical-trigonometry result. What is the physical meaning of each variable, and why does the minus sign appear?",
            "At the equator, sunrise is nearly constant year-round. At high latitudes, the formula breaks down. What does this tell you about the formula's domain of applicability?",
            "Try restating in your own words: why is sunrise (not sunset, noon, or midnight) the traditional Vedic civil-day reference?",
          ];
          scenes = (
            <div data-l242-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Sunrise at Any Latitude
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
                Enter any date, latitude, and longitude to compute local
                sunrise time. The calculator walks through declination,
                hour-angle, and longitude-correction step by step.
              </p>
              <SunriseAtAnyLatitude />
            </div>
          );
        } else if (fm.slug === "sidereal-day-and-its-uses") {
          reflectionPrompts = [
            "The ~3m 56s differential between sāvana and sidereal day seems tiny. Why does it accumulate to ~1° per year — and why is that operationally consequential for nakṣatra-timing?",
            "Local Sidereal Time (LST) converts civil time to star-time. When would you need LST in actual chart-computation work?",
            "Try restating in your own words: what is the difference between 'the Earth rotates 360° in 24 hours' (sāvana intuition) and 'the Earth rotates 360° in 23h 56m 4s' (sidereal fact)?",
          ];
          scenes = (
            <div data-l243-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Sidereal Day Explorer
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
                Visualise the sāvana-vs-sidereal differential. Watch the
                Earth rotate relative to the Sun vs relative to fixed stars.
                Compute LST from any civil time and location.
              </p>
              <SiderealDayExplorer />
            </div>
          );
        } else if (fm.slug === "the-tithi-as-lunar-day") {
          reflectionPrompts = [
            "The tithi formula divides Sun-Moon elongation by 12°. Why 12° specifically — what makes that the natural unit for lunar-day division?",
            "A tithi can last 23 hours or 25 hours depending on the Moon's orbital speed. What does this variability mean for pañcāṅga practitioners who need to publish a calendar months in advance?",
            "Try restating in your own words: what is the difference between 'the tithi prevailing at sunrise' (pañcāṅga convention) and 'the astronomical tithi at the birth moment' (natal computation)?",
          ];
          scenes = (
            <div data-l244-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Tithi from Sun-Moon Angle
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
                Drag the Sun and Moon to any angular separation and watch the
                tithi update in real time. The simulator visualises the 12°
                elongation engine, pakṣa transitions, and edge cases.
              </p>
              <TithiFromSunMoon />
            </div>
          );
        } else if (fm.slug === "solar-day-and-sankranti") {
          reflectionPrompts = [
            "The Uttarāyaṇa-Dakṣiṇāyana axis divides the year into 'auspicious' and 'contemplative' halves. Is this a cosmological-philosophical framework or a sociological claim about human behaviour — and what is the practical difference?",
            "Makara Saṅkrānti is ~14 January in sidereal terms but ~21 December in tropical terms. A Western-astrology client asks why Makara Saṅkrānti is not on the winter solstice. What is your honest answer?",
            "Try restating in your own words: why does the saṅkrānti-date drift forward at ~1 day per 72 years, and what does this mean for interpreting classical texts that mention saṅkrānti dates?",
          ];
          scenes = (
            <div data-l245-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Saṅkrānti Tracker
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
                Navigate the Sun's annual journey through the 12 rāśis.
                Scrub through the year to watch saṅkrānti events, toggle
                sidereal vs tropical dates, and visualise multi-century drift.
              </p>
              <SankrantiTracker />
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
        } else if (fm.slug === "vikrama-and-shaka-the-major-samvats") {
          reflectionPrompts = [
            "The 135-year offset is simple arithmetic (57 + 78), but year-start boundaries complicate it. Where do you think you'll make the most mistakes in real client work — the arithmetic or the boundaries?",
            "A north-India client mentions their birth year as 'Vikrama 2050' and a south-India client as 'Śaka 1915'. Without computing, which client is older — and what does this tell you about intuitive date sense across saṁvats?",
            "Try restating in your own words: why does the modern Indian government use a modified Śaka year-start (22 March) when the classical tradition uses Caitra Śukla Pratipad? What is lost and what is gained by each convention?",
          ];
          scenes = (
            <div data-l251-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Samvat Converter — Vikrama ↔ Śaka ↔ CE
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
                Interactive year-conversion calculator with boundary detection,
                Caitra-ādi vs Kārtika-ādi toggle, modern-government vs traditional
                Śaka toggle, and worked-example library for cross-validation.
              </p>
              <SamvatConverterVikramaShaka />
            </div>
          );
        } else if (fm.slug === "kollam-era-and-regional-calendars") {
          reflectionPrompts = [
            "Of the eight calendar systems in the explorer, which one's year-start date surprised you most — and what does that tell you about your own calendar intuition?",
            "A Kerala client and a Tamil client both celebrate their New Year in April. But only one actually does. Which one — and why does the other celebrate in August?",
            "Try restating in your own words: why is Kollam's Siṁha Saṅkrānti year-start not a 'mistake' or 'delay' but a coherent regional convention with its own historical logic?",
          ];
          scenes = (
            <div data-l252-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Regional Calendar Explorer
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
                Side-by-side rendering of the major Indian calendar systems.
                Input any Gregorian date to see equivalent dates across all
                systems simultaneously. Toggle map mode to explore regional
                conventions geographically.
              </p>
              <RegionalCalendarExplorer />
            </div>
          );
        } else if (fm.slug === "converting-dates-systematically") {
          reflectionPrompts = [
            "Module 02 closes with this lesson. Of the five chapters' frameworks, which one do you feel MOST confident applying — and which one needs review before Module 03?",
            "A client gives you a birth date as 'Kollam 1195, Kanni 12' and asks for their Gregorian birth date. Walk through the complete conversion step by step — where is the highest risk of error?",
            "Try restating in your own words: what is the difference between 'I know the conversion formula' and 'I can reliably convert dates under pressure'? What practice bridge is still missing?",
          ];
          scenes = (
            <div data-l253-scenes-mounted="true">
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "26px",
                  fontWeight: 500,
                  color: "var(--gl-gold-accent)",
                }}
              >
                Calendar Converter
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
                Module 02's most operationally-comprehensive calculative interactive.
                Comprehensive cross-system date conversion with year-boundary
                auto-detection, Julian-Gregorian transition handling, adhika-māsa
                identification, and JDN cross-validation.
              </p>
              <CalendarConverter />
            </div>
          );
        }

        // For three-skandhas-overview, the markdown §4 body contains an ASCII-art
        // triangle that duplicates the interactive SVG scene. Strip it so only
        // the interactive visual renders.
        // For where-grahvani-sits-in-the-skandha-map, the markdown §4 body contains
        // a large pipe-table coverage matrix that duplicates the interactive explorer.
        // Strip table rows (lines starting with |) so only the interactive renders.
        const sec4Cleaned =
          fm.slug === "three-skandhas-overview" && sec4
            ? { ...sec4, body: sec4.body.replace(/```[\s\S]*?```/g, "") }
            : fm.slug === "where-grahvani-sits-in-the-skandha-map" && sec4
              ? { ...sec4, body: sec4.body.replace(/^[|].*$/gm, "").replace(/\n{3,}/g, "\n\n") }
              : fm.slug === "regional-schools-and-lineages" && sec4
                ? { ...sec4, body: sec4.body.replace(/^[|].*$/gm, "").replace(/\n{3,}/g, "\n\n") }
                : fm.slug === "modern-lineage-threads" && sec4
                  ? { ...sec4, body: sec4.body.replace(/^[|].*$/gm, "").replace(/\n{3,}/g, "\n\n") }
                  : fm.slug === "lineage-matters-worked-example" && sec4
                    ? { ...sec4, body: sec4.body.replace(/^[|].*$/gm, "").replace(/\n{3,}/g, "\n\n") }
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

      {/* Sections beyond §12 — rendered as generic markdown (M3 lessons use §13-§14) */}
      {sections
        .filter((s) => {
          const n = Number(s.number);
          return !Number.isNaN(n) && n >= 13;
        })
        .map((extraSec) => (
          <RevealSection key={extraSec.number}>
            <SectionDivider accentHex={presentationFor(extraSec).accentHex} />
            <section
              className="mx-auto py-5"
              style={{ maxWidth: "880px", scrollMarginTop: "120px" }}
            >
              <div className="gl-surface-twilight-glass p-8">
                <MarkdownContent noTopMargin>{extraSec.body}</MarkdownContent>
              </div>
            </section>
          </RevealSection>
        ))}
    </LessonShell>
  );
}

export const metadata = {
  title: "Grahvani · Lesson",
};
