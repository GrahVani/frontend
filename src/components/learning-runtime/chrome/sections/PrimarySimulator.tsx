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
          const pres = presentationFor(section);
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
