/**
 * §7 Primary Simulator — host frame for the lesson's biggest interactive.
 *
 * Resolves the lesson's `interactive.component_type` slug against the
 * interactive registry and renders the matching component. Falls back to a
 * spec-pending placeholder if the slug does not resolve.
 */

import { MarkdownContent } from "../MarkdownContent";
import { resolveInteractive } from "../../interactive/registry";
import { SectionHeader } from "../SectionHeader";
import { presentationFor } from "../../lib/section-meta";
import { Sparkles } from "lucide-react";
import type { LessonSection, LessonFrontMatter } from "@/lib/learning-runtime/types";

interface PrimarySimulatorProps {
  section: LessonSection;
  frontMatter: LessonFrontMatter;
}

/**
 * Per-lesson §7 flagship overrides. Constitution §10.1 names §7 the Primary
 * Simulator — the lesson's biggest synthesis interactive. A lesson's
 * frontmatter `interactive.component_type` declares the §4 explorer; §7 may
 * resolve to a different, richer synthesis component (the "full version")
 * via this override map.
 *
 * Adding a lesson here: map its slug to the registry key of the §7 component.
 */
const SECTION_7_OVERRIDES: Readonly<Record<string, string>> = {
  // L1's §7 = Vedic Ecosystem Orbital (time-slider synthesis of the
  // six-Vedāṅga + Veda + Vedānta arrangement).
  "jyotisha-as-vedanga": "vedic-ecosystem-orbital",
  // L2's §7 = Jyotiṣa-Sāṅga Synthesis Hub (interlock viz + scenario
  // explorer). §4 keeps the petal-row explorer (VedangaRelationshipDiagram).
  "the-six-vedangas-and-their-relationship": "jyotisha-sanga-hub",
  // L3's §7 = Disambiguation Dojo (Indo-Hellenistic lineage timeline +
  // ayanāṁśa drift slider + 5-scenario disambiguation drill). §4 keeps
  // the dimension-explorer (jyotisha-vs-western-vs-pop-comparator).
  "jyotisha-vs-western-astrology-vs-pop-astrology": "disambiguation-dojo",
  // L4's §7 = Karma-Prediction Dojo (Cycle-in-Motion overlay viz +
  // Indication Translator skill drill). §4 keeps the per-karma-type
  // explorer (karma-typology-explorer).
  "philosophy-of-karma-and-prediction": "karma-prediction-dojo",
  // L2.1's §7 = Jyotiṣa Citation Dojo (Dating Divergence Atlas +
  // Citation Discipline Drill). §4 keeps the historical-timeline.
  "the-historical-timeline-of-jyotisha": "jyotisha-citation-dojo",
  // L2.2's §7 = BPHS Citation Dojo (Vimśottarī verse cross-reference +
  // citation drill). §4 keeps the BPHS recension comparator.
  "parashara-the-foundational-rishi": "bphs-citation-dojo",
  // L2.3's §7 = Varāhamihira Synthesis Dojo (Author Cross-Dating + Citation
  // Drill). §4 keeps the skandha-coverage explorer.
  "varahamihira-the-systematic-codifier": "varahamihira-synthesis-dojo",
  // L2.4's §7 = Medieval Synthesis Dojo (5-scenario drill on codifier
  // discipline). §4 keeps the relative-dating explorer.
  "medieval-codifiers-kalyanavarma-mantresvara": "medieval-synthesis-dojo",
  // L2.5's §7 = Jaiminī Second-Tradition Dojo (Doctrinal-Pair Atlas across
  // 6 pairs + 5-scenario tradition-attribution drill). §4 keeps the
  // parashari-jaimini-parallel-tradition-explorer.
  "jaimini-and-the-second-tradition": "jaimini-second-tradition-dojo",
  // L2.6's §7 = Four-Stream Synthesis Dojo (Stream Landscape Matrix +
  // 5-scenario Evaluative Reasoning Drill — chapter-capstone Bloom-Evaluate).
  // §4 keeps the four-stream-landscape-explorer.
  "modern-founders-krishnamurti-and-joshi": "four-stream-synthesis-dojo",
};

export function PrimarySimulator({ section, frontMatter: fm }: PrimarySimulatorProps) {
  const componentType = fm.interactive?.componentType;
  const specFile = fm.interactive?.specFile;
  const enabled = fm.interactive?.enabled ?? false;
  const Resolved = resolveInteractive(componentType);

  const overrideKey = SECTION_7_OVERRIDES[fm.slug];
  const InteractiveComponent = overrideKey
    ? resolveInteractive(overrideKey)
    : Resolved;

  return (
    <section
      id={`sec-${section.number}`}
      aria-labelledby={`sec-${section.number}-h`}
      className="mx-auto py-5"
      style={{ maxWidth: "960px", scrollMarginTop: "120px" }}
    >
      <div style={{ textAlign: "center" }}>
        {(() => {
          const pres = presentationFor(section, fm);
          return (
            <SectionHeader
              eyebrow={pres.eyebrow}
              title={pres.embodiedTitle}
              accentHex={pres.accentHex}
              ornament={<Sparkles size={16} />}
              align="center"
              size="compact"
            />
          );
        })()}
      </div>

      {enabled && InteractiveComponent ? (
        /* No wrapping card — the interactive's own internal composition reads as the section surface. */
        <InteractiveComponent />
      ) : enabled && componentType ? (
        <div
          className="gl-surface-twilight-glass p-8 text-center"
          style={{ minHeight: "320px", display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
          <div
            className="inline-block mx-auto px-4 py-2 rounded mb-4"
            style={{
              border: "1px dashed var(--gl-gold-hairline)",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--gl-ink-muted)",
              maxWidth: "fit-content",
            }}
          >
            Interactive: <span style={{ color: "var(--gl-gold-accent)" }}>{componentType}</span>
          </div>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "18px",
              color: "var(--gl-ink-secondary)",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.5,
            }}
          >
            Component spec lives at{" "}
            <code style={{ fontFamily: "monospace", fontSize: "0.9em", color: "var(--gl-gold-accent)" }}>
              {specFile ?? "(spec file not declared)"}
            </code>
            . Not yet registered with the interactive runtime.
          </p>
        </div>
      ) : (
        <div className="gl-surface-twilight-glass p-8">
          <MarkdownContent noTopMargin>{section.body}</MarkdownContent>
        </div>
      )}
    </section>
  );
}
