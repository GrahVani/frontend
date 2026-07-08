/**
 * Section-aware right marginalia — Phase C-Reformed Reform-8.
 *
 * Renders contextual side content that *changes with the active section*.
 * The right column is no longer a static placeholder — it carries pull-quotes,
 * extracted Sanskrit term glossary, source attribution, key-takeaway stickers,
 * SR previews per section.
 *
 * Each panel uses its section's graha accent for the eyebrow + ornament so
 * the marginalia chromatically matches the main column.
 */

"use client";

import { useMemo, type ReactNode } from "react";
import {
  Sparkles, BookOpen, ScrollText, ListChecks, AlertTriangle, Lightbulb,
  Target, ArrowRight, Quote, Layers,
} from "lucide-react";
import type { LessonSection, LessonFrontMatter } from "@/lib/learning-runtime/types";
import { presentationFor } from "../lib/section-meta";

interface SectionAwareMarginaliaProps {
  sections: LessonSection[];
  frontMatter: LessonFrontMatter;
  activeSectionNumber: string | null;
}

export function SectionAwareMarginalia({
  sections,
  frontMatter,
  activeSectionNumber,
}: SectionAwareMarginaliaProps) {
  const activeSection = useMemo(
    () => sections.find((s) => s.number === activeSectionNumber),
    [sections, activeSectionNumber],
  );

  const panel = useMemo(() => {
    if (!activeSection) {
      return <HookOpeningQuote />;
    }
    const pres = presentationFor(activeSection);
    switch (pres.role) {
      case "hook":
        return <HookOpeningQuote />;
      case "orientation-prereq":
        return <PrerequisitePanel accentHex={pres.accentHex} />;
      case "orientation-outcomes":
        return <OutcomesProgressPanel frontMatter={frontMatter} accentHex={pres.accentHex} />;
      case "body":
        return (
          <TermGlossaryPanel
            section={activeSection}
            accentHex={pres.accentHex}
          />
        );
      case "sloka":
        return <SourceAttributionPanel frontMatter={frontMatter} accentHex={pres.accentHex} />;
      case "worked-example":
        return <WorkedExampleHintPanel accentHex={pres.accentHex} />;
      case "interactive":
        return <InteractiveHintPanel accentHex={pres.accentHex} frontMatter={frontMatter} />;
      case "mistakes":
        return <MistakesTakeawayPanel accentHex={pres.accentHex} frontMatter={frontMatter} />;
      case "anchors":
        return <AnchorsSrPreviewPanel accentHex={pres.accentHex} />;
      case "practice":
        return <PracticeTipsPanel accentHex={pres.accentHex} />;
      case "summary":
        return <SummaryWhatNextPanel frontMatter={frontMatter} accentHex={pres.accentHex} />;
      case "continuation":
        return <ContinuationPanel frontMatter={frontMatter} accentHex={pres.accentHex} />;
      default:
        return <HookOpeningQuote />;
    }
  }, [activeSection, frontMatter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {panel}
      <BrandSeal frontMatter={frontMatter} />
    </div>
  );
}

/* ──────────── Shared card primitive ──────────── */

function MarginCard({
  eyebrow,
  ornament,
  accentHex,
  children,
}: {
  eyebrow: string;
  ornament: ReactNode;
  accentHex: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        padding: "16px 18px",
        background: "linear-gradient(180deg, rgba(255, 252, 240, 0.96) 0%, rgba(252, 245, 224, 0.92) 100%)",
        border: "1px solid rgba(156, 122, 47, 0.30)",
        borderRadius: "12px",
        position: "relative",
        boxShadow:
          "0 2px 0 rgba(255, 255, 255, 0.65) inset, 0 -1px 0 rgba(139, 90, 43, 0.18) inset, 0 4px 14px rgba(62, 42, 31, 0.07), 0 14px 32px rgba(62, 42, 31, 0.04)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          top: "-1px",
          height: "2px",
          background: `linear-gradient(to right, transparent 0%, ${accentHex}88 30%, ${accentHex} 50%, ${accentHex}88 70%, transparent 100%)`,
          borderRadius: "999px",
        }}
      />
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "10px",
        }}
      >
        <span style={{ color: accentHex, display: "inline-flex" }}>{ornament}</span>
        <span
          style={{
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: accentHex,
            fontWeight: 600,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          {eyebrow}
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ──────────── §1 Hook — opening pull quote ──────────── */

function HookOpeningQuote() {
  return (
    <MarginCard eyebrow="The eye of the Veda" ornament={<Quote size={11} />} accentHex="#A23A1E">
      <p
        lang="sa-Latn"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "22px",
          color: "var(--gl-ink-primary)",
          lineHeight: 1.3,
          marginBottom: "8px",
        }}
      >
        vedasya cakṣuḥ
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14px",
          color: "var(--gl-ink-secondary)",
          lineHeight: 1.5,
        }}
      >
        Each Vedāṅga is a sense-organ; Jyotiṣa alone sees time. That is the metaphor we&apos;ll unpack today.
      </p>
    </MarginCard>
  );
}

/* ──────────── §2 Prerequisites — "what you'll need" ──────────── */

function PrerequisitePanel({ accentHex }: { accentHex: string }) {
  const needs = [
    "Literacy in English",
    "A scholarly posture toward Vedic material",
    "Zero prior astrology required",
  ];
  return (
    <MarginCard eyebrow="What you bring" ornament={<BookOpen size={11} />} accentHex={accentHex}>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {needs.map((n, i) => (
          <li
            key={i}
            style={{
              fontSize: "14px",
              color: "var(--gl-ink-primary)",
              padding: "6px 0",
              borderBottom: i < needs.length - 1 ? "1px solid rgba(156, 122, 47, 0.18)" : "none",
              lineHeight: 1.5,
              fontFamily: "var(--font-cormorant), serif",
            }}
          >
            {n}
          </li>
        ))}
      </ul>
    </MarginCard>
  );
}

/* ──────────── §3 Outcomes — progress tracker ──────────── */

function OutcomesProgressPanel({
  frontMatter,
  accentHex,
}: {
  frontMatter: LessonFrontMatter;
  accentHex: string;
}) {
  return (
    <MarginCard eyebrow="By the end of this lesson" ornament={<Target size={11} />} accentHex={accentHex}>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "32px",
          fontWeight: 500,
          color: accentHex,
          marginBottom: "4px",
          lineHeight: 1,
        }}
      >
        {frontMatter.learningOutcomes.length}
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "16px",
          color: "var(--gl-ink-secondary)",
          marginBottom: "10px",
        }}
      >
        outcomes ahead
      </p>
      <p
        style={{
          fontSize: "14px",
          color: "var(--gl-ink-muted)",
          lineHeight: 1.5,
          fontFamily: "var(--font-cormorant), serif",
        }}
      >
        Targeting Bloom {frontMatter.bloomLevels.join(" + ")}. Approximately{" "}
        {frontMatter.targetMinutesTotal ?? 25} minutes total.
      </p>
    </MarginCard>
  );
}

/* ──────────── §4 Body — extracted Sanskrit term glossary ──────────── */

function TermGlossaryPanel({
  section,
  accentHex,
}: {
  section: LessonSection;
  accentHex: string;
}) {
  // Extract italicised tokens that look Sanskrit (contain a diacritic OR look like single italic phrase)
  const terms = useMemo(() => {
    const matches = Array.from(
      section.body.matchAll(/(?<!\*)\*([^*\n]{2,40})\*(?!\*)/g),
    );
    const set = new Set<string>();
    for (const m of matches) {
      const term = m[1].trim();
      // Heuristic: keep terms that have a Sanskrit diacritic or are short (1-3 words).
      const hasDiacritic = /[āīūṛṝḷḹṁṅñṇṭḍṣśḥṃ]/i.test(term);
      const wordCount = term.split(/\s+/).length;
      if (hasDiacritic || wordCount <= 2) {
        set.add(term);
      }
    }
    return Array.from(set).slice(0, 10);
  }, [section.body]);

  if (terms.length === 0) {
    return (
      <MarginCard eyebrow="In this section" ornament={<Layers size={11} />} accentHex={accentHex}>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "14px",
            color: "var(--gl-ink-muted)",
            lineHeight: 1.5,
          }}
        >
          Read carefully — this section&apos;s vocabulary will return in §9 Remember.
        </p>
      </MarginCard>
    );
  }

  return (
    <MarginCard
      eyebrow={`Terms in this section (${terms.length})`}
      ornament={<Layers size={11} />}
      accentHex={accentHex}
    >
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "5px" }}>
        {terms.map((t, i) => (
          <li
            key={i}
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "14px",
              color: "#A23A1E",
              fontWeight: 500,
              padding: "3px 8px",
              background: "rgba(162, 58, 30, 0.06)",
              borderRadius: "4px",
              borderLeft: "2px solid rgba(162, 58, 30, 0.40)",
              lineHeight: 1.4,
            }}
          >
            {t}
          </li>
        ))}
      </ul>
    </MarginCard>
  );
}

/* ──────────── §5 Śloka — source attribution ──────────── */

function SourceAttributionPanel({
  frontMatter,
  accentHex,
}: {
  frontMatter: LessonFrontMatter;
  accentHex: string;
}) {
  const primary = frontMatter.primarySources[0];
  return (
    <MarginCard eyebrow="Bibliographic source" ornament={<ScrollText size={11} />} accentHex={accentHex}>
      {primary ? (
        <>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "16px",
              color: "var(--gl-ink-primary)",
              fontWeight: 500,
              marginBottom: "6px",
              lineHeight: 1.4,
            }}
          >
            {primary.ref}
          </p>
          {primary.note && (
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "14px",
                color: "var(--gl-ink-secondary)",
                lineHeight: 1.5,
              }}
            >
              {primary.note}
            </p>
          )}
        </>
      ) : (
        <p style={{ color: "var(--gl-ink-muted)", fontSize: "14px" }}>No primary source declared.</p>
      )}
      {frontMatter.modernSources.length > 0 && (
        <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(156, 122, 47, 0.20)" }}>
          <p
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--gl-ink-muted)",
              fontWeight: 600,
              marginBottom: "6px",
            }}
          >
            Modern reference
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "14px",
              color: "var(--gl-ink-secondary)",
              lineHeight: 1.5,
            }}
          >
            {frontMatter.modernSources[0].ref}
          </p>
        </div>
      )}
    </MarginCard>
  );
}

/* ──────────── §6 Worked Example — hint ──────────── */

function WorkedExampleHintPanel({ accentHex }: { accentHex: string }) {
  return (
    <MarginCard eyebrow="As you read" ornament={<ListChecks size={11} />} accentHex={accentHex}>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "16px",
          color: "var(--gl-ink-primary)",
          lineHeight: 1.5,
        }}
      >
        Worked examples are <strong style={{ fontStyle: "normal", color: "#A23A1E" }}>scaffolded</strong> — the first walks every step; the next ones ask you to predict.
      </p>
    </MarginCard>
  );
}

/* ──────────── §7 Interactive — hint ──────────── */

/**
 * Lesson-aware content for the §7 interactive marginalia. Each lesson's §7
 * flagship has its own affordances, so the right-rail hint MUST name them
 * specifically — generic guidance is the rot the founder caught.
 */
const INTERACTIVE_HINTS: Record<
  string,
  { eyebrow: string; headline: string; bullets: string[] }
> = {
  "jyotisha-as-vedanga": {
    eyebrow: "Manipulation teaches",
    headline:
      "Drag, tap, and scrub. The orbital model teaches by what it lets you do — not by what it labels.",
    bullets: [
      "· Tap the orbital limbs",
      "· Drag the time slider",
      "· Jump to a scholar by name",
    ],
  },
  "the-six-vedangas-and-their-relationship": {
    eyebrow: "Hub teaches by interlock",
    headline:
      "Click each spoke to see how Jyotiṣa couples with that Vedāṅga in modern practice.",
    bullets: [
      "· Click any node to read its interlock detail",
      "· Toggle the modern-practice overlay",
      "· Switch tabs to the Sāṅga Scenarios drill",
    ],
  },
  "jyotisha-vs-western-astrology-vs-pop-astrology": {
    eyebrow: "Disambiguation discipline",
    headline:
      "Tradition is classified by format and depth — not just terminology. The drill tests this directly.",
    bullets: [
      "· Open the Indo-Hellenistic Lineage tab for shared roots",
      "· Drag the ayanāṁśa drift slider through history",
      "· Switch to the Disambiguation Drill for 5 scenarios",
    ],
  },
  "philosophy-of-karma-and-prediction": {
    eyebrow: "Substrate vs agency",
    headline:
      "The cycle's lesson: the chart reads ONE corner most clearly (prārabdha); the agent acts in ANOTHER (kriyamāṇa).",
    bullets: [
      "· Toggle the 'what Jyotiṣa sees' lens — prārabdha lights up",
      "· Toggle the 'agency window' lens — kriyamāṇa lights up",
      "· Switch tabs to drill the deterministic-to-indication translation",
    ],
  },
  "the-historical-timeline-of-jyotisha": {
    eyebrow: "Cite what you cite",
    headline:
      "Twelve anchors across three millennia. The honest move: name the source, the date, the recension, the translator.",
    bullets: [
      "· Tap any marker for full dating + recension status",
      "· Toggle the traditional-dating overlay to see divergences",
      "· Switch to the Citation Drill for 5 scenarios",
    ],
  },
  "parashara-the-foundational-rishi": {
    eyebrow: "Two layers in one name",
    headline:
      "Maharṣi Parāśara is BOTH the pre-classical ṛṣi tradition attests AND the medieval-recensional BPHS we actually read. Cite both honestly.",
    bullets: [
      "· Tap any prakaraṇa-plate for adhyāya range + recension notes",
      "· Switch to the Verse Cross-Reference tab for the canonical Vimśottarī verse",
      "· The 5-scenario drill tests BPHS-specific citation discipline",
    ],
  },
  "varahamihira-the-systematic-codifier": {
    eyebrow: "The chronological anchor",
    headline:
      "Varāhamihira is the only classical Jyotiṣa author whose dating is internally secure. Every other classical author is bracketed relative to him.",
    bullets: [
      "· Tap any of the three skandha plates for chapter coverage",
      "· Read the astronomical-position dating methodology — 4 operational steps",
      "· Switch to the Author Cross-Dating tab to see the citation network",
    ],
  },
  "medieval-codifiers-kalyanavarma-mantresvara": {
    eyebrow: "Layer three — codifier discipline",
    headline:
      "Four medieval codifiers refining the Parāśara + Varāhamihira foundation — each with distinctive emphasis, each dated by citation-network bracketing.",
    bullets: [
      "· Tap any codifier plate for citation evidence + distinctive contribution",
      "· Read the compounding-uncertainty visualization — brackets widen with chain length",
      "· The drill tests medieval-codifier dating + citation discipline",
    ],
  },
  "jaimini-and-the-second-tradition": {
    eyebrow: "Parallel — not subordinate",
    headline:
      "Parāśari and Jaiminī run alongside each other. Different time-engines, different aspect-systems, different significator schemas — both honoured.",
    bullets: [
      "· Read the diptych hero — equal-weight column layout teaches the parallelism",
      "· Tap any doctrine plate for the operational distinction vs Parāśari",
      "· Switch to the Doctrinal-Pair Atlas + Attribution Drill in §7",
    ],
  },
  "modern-founders-krishnamurti-and-joshi": {
    eyebrow: "Four streams — landscape completed",
    headline:
      "Modern-primary status is a high bar (origination + practitioner lineage + empirical results). Only KP and Lal Kitab unambiguously meet all three.",
    bullets: [
      "· Read the 4-column hero — Parāśari + Jaiminī (classical) + KP + Lal Kitab (modern-primary)",
      "· Tap any KP contribution for the classical-antecedent status",
      "· Tap any Lal Kitab contribution for the same",
      "· Switch to the Landscape Matrix + Evaluative Drill in §7",
    ],
  },
};

function InteractiveHintPanel({
  accentHex,
  frontMatter,
}: {
  accentHex: string;
  frontMatter: LessonFrontMatter;
}) {
  const hint =
    INTERACTIVE_HINTS[frontMatter.slug] ?? {
      eyebrow: "Manipulation teaches",
      headline:
        "The interactive teaches by what it lets you do — not by what it labels.",
      bullets: [],
    };
  return (
    <MarginCard
      eyebrow={hint.eyebrow}
      ornament={<Sparkles size={11} />}
      accentHex={accentHex}
    >
      <p
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "16px",
          color: "var(--gl-ink-primary)",
          lineHeight: 1.55,
          marginBottom: hint.bullets.length > 0 ? "10px" : "0",
        }}
      >
        {hint.headline}
      </p>
      {hint.bullets.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            fontSize: "14px",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.7,
          }}
        >
          {hint.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </MarginCard>
  );
}

/* ──────────── §8 Mistakes — key takeaway sticker ──────────── */

/**
 * Lesson-aware "the one mistake to internalise" content. Each lesson has its
 * own single most-important confusion to disarm; generic content is rot.
 */
const MISTAKES_TAKEAWAYS: Record<
  string,
  { headline: string; gloss: string }
> = {
  "jyotisha-as-vedanga": {
    headline: "Vedāṅga is not Vedānta.",
    gloss:
      "Limbs of the Veda — not the Veda's end. Two entirely different epistemic categories.",
  },
  "the-six-vedangas-and-their-relationship": {
    headline: "Sāṅga is not modular.",
    gloss:
      "The six Vedāṅgas are a coordinated system — Vyākaraṇa belongs to TWO clusters (recitation + meaning). Studying one limb in isolation misses the interlock.",
  },
  "jyotisha-vs-western-astrology-vs-pop-astrology": {
    headline: "Disambiguation is recognition + respect.",
    gloss:
      "Vedic and Western are cousins with shared Indo-Hellenistic lineage; pop is categorically different (1930-vintage entertainment format). Confusing the three — in either direction — is the practitioner-discipline error.",
  },
  "philosophy-of-karma-and-prediction": {
    headline: "Indication, not determination.",
    gloss:
      "The chart reads prārabdha (committed) and sees āgāmī partially (formation patterns) — but cannot foreclose kriyamāṇa (current real-time choices). Deterministic prediction violates the framework; indication-with-confidence-tier respects it.",
  },
  "the-historical-timeline-of-jyotisha": {
    headline: "Cite what you cite — not what sounds ancient.",
    gloss:
      "Vague gestures to \"classical tradition\" hide the recension problem, mix chronologies, and elide translator interpretive choices. The four moves — source, date, recension, translator — are what separate a system-aware scholar from silent confusion.",
  },
  "parashara-the-foundational-rishi": {
    headline: "Hold both Parāśara layers — never collapse them.",
    gloss:
      "The pre-classical Parāśara figure (tradition) and the medieval-recension BPHS (academic) are both real. Treating BPHS as the unmediated word of the ṛṣi over-claims antiquity; dismissing it as recent under-claims authority. The honest middle is recension specification + acknowledgement of doctrinal substrate.",
  },
  "varahamihira-the-systematic-codifier": {
    headline: "Honour both anchors — collapse neither.",
    gloss:
      "Parāśara = lineage authority (foundational ṛṣi, encyclopaedic horā). Varāhamihira = evidence authority (dateable, recension-stable, three-skandha-spanning). They complement, not compete. Citation discipline differs by anchor type; both serve the curriculum's authority structure.",
  },
  "medieval-codifiers-kalyanavarma-mantresvara": {
    headline: "Three layers, cumulative authorities, distinct disciplines.",
    gloss:
      "Codifier authority is real — refining, synthesising, and pedagogical structuring add value distinct from originating. Don't flatten the three-layer lineage into undifferentiated tradition; don't dismiss the medieval codifiers as \"mere\" synthesisers. Each layer carries its own appropriate citation discipline.",
  },
  "jaimini-and-the-second-tradition": {
    headline: "Two traditions, parallel — not subordinate.",
    gloss:
      "Jaiminī is not a sub-school of Parāśari; Parāśari is not a refinement of Jaiminī. They are STRUCTURALLY PARALLEL (foundational ṛṣi, codifiers, medieval commentary, modern revival) and DOCTRINALLY COMPLEMENTARY (graha vs rāśi, nakṣatra vs rāśi cycles, fixed vs variable significators). Honest practice draws on both with explicit citation of which tradition each tool comes from.",
  },
  "modern-founders-krishnamurti-and-joshi": {
    headline: "Modern-primary is a high bar — and a real one.",
    gloss:
      "Four traps collapse the four-stream landscape: treating KP/LK as \"mere innovations\" (factually inaccurate — they originate frameworks not derivable from classical); treating the streams as competing schools (category-error — they operate at different doctrinal-layers); applying Sanskrit-classical as the across-stream authority criterion (over-extends a within-stream criterion); critiquing one stream using another's internal criteria (multi-stream-honesty violation). Modern-primary recognises KP and Lal Kitab as first-party authoritative within their stream — origination + practitioner lineage + empirical results, all three required.",
  },
};

function MistakesTakeawayPanel({
  accentHex,
  frontMatter,
}: {
  accentHex: string;
  frontMatter: LessonFrontMatter;
}) {
  const takeaway =
    MISTAKES_TAKEAWAYS[frontMatter.slug] ?? {
      headline: "The single confusion to disarm.",
      gloss: "See the §8 mistakes deck for the lesson's most-load-bearing error.",
    };
  return (
    <MarginCard
      eyebrow="The one to internalise"
      ornament={<AlertTriangle size={11} />}
      accentHex={accentHex}
    >
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "16px",
          color: "var(--gl-ink-primary)",
          lineHeight: 1.5,
          marginBottom: "8px",
        }}
      >
        <strong style={{ fontStyle: "normal", color: accentHex, fontWeight: 600 }}>
          {takeaway.headline}
        </strong>
      </p>
      <p
        style={{
          fontSize: "14px",
          color: "var(--gl-ink-secondary)",
          lineHeight: 1.5,
          fontFamily: "var(--font-cormorant), serif",
        }}
      >
        {takeaway.gloss}
      </p>
    </MarginCard>
  );
}

/* ──────────── §9 Anchors — SR preview ──────────── */

function AnchorsSrPreviewPanel({ accentHex }: { accentHex: string }) {
  return (
    <MarginCard eyebrow="Spaced repetition" ornament={<Lightbulb size={11} />} accentHex={accentHex}>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "14px",
          color: "var(--gl-ink-primary)",
          lineHeight: 1.5,
          marginBottom: "10px",
        }}
      >
        Each anchor card enters your SR deck after lesson mastery.
      </p>
      <div
        style={{
          padding: "10px 12px",
          background: "rgba(232, 158, 42, 0.08)",
          borderRadius: "8px",
          borderLeft: `2px solid ${accentHex}`,
        }}
      >
        <p
          style={{
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.10em",
            color: accentHex,
            fontWeight: 600,
            marginBottom: "4px",
          }}
        >
          Next review
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.5,
            fontFamily: "var(--font-cormorant), serif",
          }}
        >
          Tomorrow · then in 3 days · then 7 · then 14.
        </p>
      </div>
    </MarginCard>
  );
}

/* ──────────── §10 Practice — quiz tips ──────────── */

function PracticeTipsPanel({ accentHex }: { accentHex: string }) {
  return (
    <MarginCard eyebrow="Before you begin" ornament={<Target size={11} />} accentHex={accentHex}>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          fontSize: "14px",
          color: "var(--gl-ink-primary)",
          lineHeight: 1.6,
          fontFamily: "var(--font-cormorant), serif",
        }}
      >
        <li style={{ paddingBottom: "8px", borderBottom: "1px solid rgba(156, 122, 47, 0.15)", marginBottom: "8px" }}>
          <strong style={{ color: accentHex }}>80%</strong> needed to pass.
        </li>
        <li style={{ paddingBottom: "8px", borderBottom: "1px solid rgba(156, 122, 47, 0.15)", marginBottom: "8px" }}>
          Each wrong answer explains <em style={{ color: "#A23A1E" }}>why</em>.
        </li>
        <li>If you don&apos;t pass, the next attempt unlocks in 24 hours.</li>
      </ul>
    </MarginCard>
  );
}

/* ──────────── §11 Summary — next-lesson sneak peek ──────────── */

function SummaryWhatNextPanel({
  frontMatter,
  accentHex,
}: {
  frontMatter: LessonFrontMatter;
  accentHex: string;
}) {
  const next = frontMatter.postrequisites[0];
  const nextName = next ? next.split("/").pop()?.replace(/^lesson-\d+-/, "").replace(/-/g, " ") : null;
  return (
    <MarginCard eyebrow="Coming next" ornament={<ArrowRight size={11} />} accentHex={accentHex}>
      {nextName ? (
        <>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "16px",
              fontWeight: 500,
              color: "var(--gl-ink-primary)",
              lineHeight: 1.3,
              marginBottom: "6px",
              textTransform: "capitalize",
            }}
          >
            {nextName}
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "14px",
              color: "var(--gl-ink-secondary)",
              lineHeight: 1.5,
            }}
          >
            You&apos;ll meet the other five limbs in their own right — and see how they support the Veda together.
          </p>
        </>
      ) : (
        <p style={{ color: "var(--gl-ink-muted)", fontSize: "14px" }}>This is the final lesson of the chapter.</p>
      )}
    </MarginCard>
  );
}

/* ──────────── §12 Continuation — chapter overview hint ──────────── */

function ContinuationPanel({
  frontMatter,
  accentHex,
}: {
  frontMatter: LessonFrontMatter;
  accentHex: string;
}) {
  return (
    <MarginCard eyebrow="Read more" ornament={<BookOpen size={11} />} accentHex={accentHex}>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "14px",
          color: "var(--gl-ink-primary)",
          lineHeight: 1.5,
          marginBottom: "10px",
        }}
      >
        <strong style={{ color: accentHex }}>{frontMatter.primarySources.length}</strong> primary classical anchors,{" "}
        <strong style={{ color: accentHex }}>{frontMatter.modernSources.length}</strong> modern academic references in this lesson.
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "14px",
          color: "var(--gl-ink-secondary)",
          lineHeight: 1.5,
        }}
      >
        Every citation is a doorway. Pull on any of them and you walk into the source-tradition this lesson sits inside.
      </p>
    </MarginCard>
  );
}

/* ──────────── Brand seal (always present at the foot of marginalia) ──────────── */

function BrandSeal({ frontMatter }: { frontMatter: LessonFrontMatter }) {
  return (
    <div style={{ textAlign: "center", padding: "10px 0", opacity: 0.55 }}>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "14px",
          color: "var(--gl-ink-muted)",
          letterSpacing: "0.10em",
        }}
      >
        Grahvani · Tier {frontMatter.tier}
      </p>
      <p
        lang="sa"
        style={{
          fontFamily: "var(--font-devanagari), serif",
          fontSize: "14px",
          color: "var(--gl-gold-accent)",
          marginTop: "2px",
        }}
      >
        ज्योतिषं वेदस्य चक्षुः
      </p>
    </div>
  );
}
