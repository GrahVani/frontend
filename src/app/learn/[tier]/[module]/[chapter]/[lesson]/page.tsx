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
        }

        return <ConceptTheatre section={sec4} reflectionPrompts={reflectionPrompts} scenes={scenes} />;
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
          <MistakeCardDeck section={sec8} />
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
