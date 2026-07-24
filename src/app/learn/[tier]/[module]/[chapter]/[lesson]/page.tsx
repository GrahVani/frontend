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

import dynamic from "next/dynamic";
import Link from "next/link";

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
  MistakeCardDeck,
  MemoryAnchorDeck,
  Summary,
  Continuation,
} from "@/components/learning-runtime/chrome";
import { SectionDivider } from "@/components/learning-runtime/chrome/SectionDivider";
import { RevealSection } from "@/components/learning-runtime/chrome/RevealSection";
import { LessonTimeTracker } from "@/components/learning-runtime/LessonTimeTracker";
import { presentationFor } from "@/components/learning-runtime/lib/section-meta";
import { MarkdownContent } from "@/components/learning-runtime/chrome/MarkdownContent";

import { LessonGuard } from "@/components/learning-runtime/LessonGuard";
import { getReflectionPrompts } from "./lesson-scene-data";

const LessonScenes = dynamic(() =>
  import("./LessonScenes").then((m) => m.LessonScenes),
);
const MCQFlow = dynamic(() =>
  import("@/components/learning-runtime/chrome/sections/MCQFlow").then(
    (m) => m.MCQFlow,
  ),
);
const PrimarySimulator = dynamic(() =>
  import("@/components/learning-runtime/chrome/sections/PrimarySimulator").then(
    (m) => m.PrimarySimulator,
  ),
);

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

/**
 * The markdown parser records headings like `## §4.1` as child sections, while
 * the route renders only canonical parent sections in the lesson chrome.
 * Reattach child markdown so authored subsection content stays visible.
 */
function withChildSections(sections: LessonSection[], parent: LessonSection | undefined): LessonSection | undefined {
  if (!parent) return undefined;

  const childPrefix = `${parent.number}.`;
  const children = sections.filter((s) => s.number.startsWith(childPrefix));
  if (children.length === 0) return parent;

  const parts = [
    parent.body.trim(),
    ...children.map((child) => [`## §${child.number} ${child.title}`, child.body.trim()].filter(Boolean).join("\n\n")),
  ].filter(Boolean);

  return {
    ...parent,
    body: parts.join("\n\n"),
  };
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
  const sec4 = withChildSections(sections, findSection(sections, "4"));
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

  // For where-grahvani-sits-in-the-skandha-map, the markdown §4 body contains
  // a large pipe-table coverage matrix that duplicates the interactive explorer.
  // Strip table rows (lines starting with |) so only the interactive renders.
  const sec4Cleaned =
    sec4 &&
    (fm.slug === "where-grahvani-sits-in-the-skandha-map" ||
      fm.slug === "regional-schools-and-lineages")
      ? {
          ...sec4,
          body: sec4.body.replace(/^[|].*$/gm, "").replace(/\n{3,}/g, "\n\n"),
        }
      : sec4;

  const reflectionPrompts = getReflectionPrompts(fm.slug);

  return (
    <LessonShell sections={railSections} canonicalPath={fm.canonicalPath} frontMatter={fm}>
      {fm.prerequisites && fm.prerequisites.length > 0 && (
        <LessonGuard prerequisites={fm.prerequisites} />
      )}
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
          slug in lesson-scene-data.ts and LessonScenes.tsx. */}
      {sec4Cleaned && (
        <ConceptTheatre
          section={sec4Cleaned}
          reflectionPrompts={reflectionPrompts}
          scenes={<LessonScenes slug={fm.slug} />}
        />
      )}

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

