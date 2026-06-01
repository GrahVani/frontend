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
import { LessonProvider } from "../../interactive/rashi-attribute-wheel";

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
  // L3.1's §7 = Three Skandha Synthesis Dojo (Stream × Skandha Matrix +
  // 5-scenario Evaluative Drill). §4 keeps the three-skandha-curriculum-map.
  "three-skandhas-overview": "three-skandha-synthesis-dojo",
  // M3-C1-L1's §7 = Tithi Calculator Dojo (step-by-step formula breakdown +
  // editable longitudes + preset scenarios). §4 keeps the tithi-angle-visualizer.
  "tithi-as-12-degrees-of-sun-moon-angle": "tithi-calculator-dojo",
  // M3-C1-L2's §7 = Tithi-Deity Wheel (circular 30-tithi visual explorer with
  // click-for-attributes + quality-filter + festival-major badges).
  "the-15-shukla-tithis": "tithi-deity-wheel",
  // M3-C1-L3's §7 = Tithi-Deity Wheel (continuation — kṛṣṇa pakṣa focus;
  // same component, learners explore the bottom-half kṛṣṇa segments).
  "the-15-krishna-tithis": "krishna-festival-timeline",
  // M3-C1-L4's §7 = Nandā-Bhadrā-Jayā-Riktā-Pūrṇā Classifier —
  // quality-event matcher with contextual-quality discipline.
  "nanda-bhadra-jaya-rikta-purna": "nanda-bhadra-jaya-rikta-purna-classifier",
  // M3-C1-L5's §7 = Amānta-Pūrṇimānta Converter — pakṣa-month converter
  // with festival cross-reference and regional identifier.
  "amanta-vs-purnimanta": "amanta-purnimanta-converter",
  // M3-C1-L6's §7 = Tithi-Muhūrta Introductory Judgment — scenario-based
  // quality trainer with multi-element synthesis preview.
  "tithi-quality-and-muhurta-introduction": "tithi-muhurta-introductory-judgment",
  // M3-C2-L1's §7 = Vāra-Graha Wheel — 7-segment circular explorer.
  "the-7-varas-and-their-lords": "vara-graha-wheel",
  // M3-C2-L2's §7 = Chaldean Planetary Horā Explorer — Chaldean order +
  // horā sequence generator with 24-mod-7 principle.
  "why-this-order-of-weekdays": "chaldean-planetary-hora-explorer",
  // M3-C2-L3's §7 = Choghadiyā & Rāhu Kālam Calculator — 16-segment
  // quality tables + visual timeline + inauspicious-window highlight.
  "chogadiya-and-rahu-kalam": "choghadiya-rahukalam-calculator",
  // M3-C2-L4's §7 = Vāra-Event Pairing Explorer — event-category cards +
  // recommended-vāra panels + planetary friendship visualization.
  "vara-in-muhurta-which-weekday-for-which-event": "vara-event-pairing-explorer",
  // M3-C3-L1's §7 = Moon-Nakṣatra Calculator — formula breakdown +
  // editable longitude + preset scenarios + circular visualisation.
  "nakshatra-as-13-deg-20-min": "moon-nakshatra-calculator",
  // M3-C3-L2's §4 explorer = Nakṣatra Strip — horizontal scrollable
  // enumeration of all 27 nakṣatras (uses registry for §7 continuity).
  "the-27-nakshatras-at-glance": "nakshatra-strip",
  // M3-C3-L3's §7 = Nakṣatra Deity & Ruler Wheel — circular 27-segment
  // explorer with inner-name / outer-planet rings and filter pills.
  "nakshatra-deity-and-ruling-planet-at-pancanga-level": "nakshatra-deity-ruler-wheel",
  // M3-C3-L4's §7 = Daily Nakṣatra Pañcāṅga Reader — simulated today's
  // pañcāṅga with time-slider and activity-suitability grid.
  "the-daily-nakshatra-and-its-use": "daily-nakshatra-pancanga-reader",
  // M3-C4-L1's §7 = Yoga vs Chart-Yoga Comparison — two-column comparison
  // table + 8-statement discrimination drill.
  "time-yoga-vs-chart-yoga-clearing-up-confusion": "yoga-vs-chart-yoga-comparison",
  // M3-C4-L2's §7 = Time-Yoga Calculator — Sun+Moon longitude sum with
  // step-by-step formula breakdown and 27-segment circular visualisation.
  "time-yoga-as-sun-plus-moon-longitude": "time-yoga-calculator",
  // M3-C4-L3's §7 = Yoga Wheel 27 — circular 27-segment explorer with
  // nature colour-coding, filter pills, and table view toggle.
  "the-27-time-yogas": "yoga-wheel-27",
  // M3-C4-L4's §7 = Inauspicious Yoga Avoidance Calculator — focus on
  // 6 inauspicious yogas with severity ranking and mitigation guide.
  "the-inauspicious-yogas-to-avoid": "inauspicious-yoga-avoidance-calculator",
  // M3-C4-L5's §7 = Yoga Muhūrta Screening Integrator — multi-element
  // muhūrta screening tool with 5-element dashboard.
  "yoga-in-muhurta-introduction": "yoga-muhurta-screening-integrator",
  // M3-C5-L1's §7 = Karaṇa Calculator — half-tithi computation with
  // step-by-step breakdown and tithi-bar visual.
  "karana-as-half-tithi": "karana-calculator",
  // M3-C5-L2's §7 = Karaṇa Cycle Diagram — circular 11-karaṇa explorer
  // with Cara/Sthira colour-coding and filter pills.
  "the-11-karanas-7-cara-4-sthira": "karana-cycle-diagram",
  // M3-C5-L3's §7 = Bhadra Avoidance Integrator — Bhadra (Viṣṭi) calculator
  // with day-of-week selector and activity-avoidance cards.
  "bhadra-vishti-karana-and-its-avoidance": "bhadra-avoidance-integrator",
  // L3.2's §7 = Seven Sub-Branches Synthesis Dojo (Stream × Sub-Branch Matrix +
  // 5-scenario Evaluative Drill). §4 keeps the seven-sub-branches-explorer.
  "seven-sub-branches": "seven-sub-branches-synthesis-dojo",
  // L3.3's §7 = Grahvani Coverage Synthesis Dojo (Full 4×7 Coverage Matrix +
  // 5-scenario Evaluative Drill). §4 keeps the grahvani-coverage-matrix-explorer.
  "where-grahvani-sits-in-the-skandha-map": "grahvani-coverage-matrix-explorer",
  // L4.1's §7 = Regional Schools Synthesis Dojo (6×4 Regional Schools Matrix +
  // teacher lookup + 5-scenario Evaluative Drill). §4 keeps the regional-schools-explorer.
  "regional-schools-and-lineages": "regional-schools-synthesis-dojo",
  // L4.2's §7 = Lineage Threads Synthesis Dojo (Lineage Comparison Matrix +
  // 5-scenario Evaluative Drill). §4 keeps the lineage-threads-network-explorer.
  "modern-lineage-threads": "lineage-threads-synthesis-dojo",
  // L4.3's §7 = Lineage Matters Synthesis Dojo (Integrated Synthesis View +
  // 5-scenario Evaluative Drill). §4 keeps the three-lineage-comparison-chart-analyzer.
  "lineage-matters-worked-example": "lineage-matters-synthesis-dojo",
  // ─── Module 04: Rāśi System ───
  // Chapter 1 — Rāśi Mechanics
  "rashi-as-30-degree-segment": "rashi-boundary-wheel",
  "the-12-rashi-boundaries": "rashi-boundary-wheel",
  "why-crossing-a-rashi-boundary-matters": "boundary-crossing-demonstrator",
  // Chapter 2 — Meṣa, Vṛṣabha, Mithuna
  "the-per-rashi-template": "rashi-attribute-wheel",
  "mesha-aries-the-fiery-cardinal": "rashi-profile-explorer",
  "vrishabha-taurus-the-earthen-fixed": "rashi-profile-explorer",
  "mithuna-gemini-the-airy-mutable": "rashi-profile-explorer",
  // Chapter 3 — Karka, Siṁha, Kanyā
  "karka-cancer-the-watery-cardinal": "rashi-profile-explorer",
  "simha-leo-the-fiery-fixed": "rashi-profile-explorer",
  "kanya-virgo-the-earthen-mutable": "rashi-profile-explorer",
  // Chapter 4 — Tulā, Vṛścika, Dhanus
  "tula-libra-the-airy-cardinal": "rashi-profile-explorer",
  "vrishchika-scorpio-the-watery-fixed": "rashi-profile-explorer",
  "dhanus-sagittarius-the-fiery-mutable": "rashi-profile-explorer",
  // Chapter 5 — Makara, Kumbha, Mīna
  "makara-capricorn-the-earthen-cardinal": "rashi-profile-explorer",
  "kumbha-aquarius-the-airy-fixed": "rashi-profile-explorer",
  "meena-pisces-the-watery-mutable": "rashi-profile-explorer",
  // Chapter 6 — Rāśi Groupings and Synthesis
  "chara-sthira-dvi-svabhava": "rashi-modality-classifier",
  "kendra-panaphara-apoklima": "quadrant-triad-visualizer",
  "dvi-trikona-5-9-pair-grid": "trikona-pair-explorer",
  "sirsha-prishtha-ubhaya-udaya": "rashi-rising-classifier",
  "rashi-across-streams": "rashi-stream-comparator",
  "four-worked-interpretive-examples": "chart-planet-positioner",
};

/** Slugs whose §7 interactive needs extra horizontal space (e.g. large SVG wheel + sidebar). */
const WIDE_LAYOUT_SLUGS = new Set([
  "the-15-shukla-tithis",
  "the-15-krishna-tithis",
  "nakshatra-deity-and-ruling-planet-at-pancanga-level",
]);

export function PrimarySimulator({ section, frontMatter: fm }: PrimarySimulatorProps) {
  const componentType = fm.interactive?.componentType;
  const specFile = fm.interactive?.specFile;
  const enabled = fm.interactive?.enabled ?? false;
  const Resolved = resolveInteractive(componentType);

  const overrideKey = SECTION_7_OVERRIDES[fm.slug];
  const InteractiveComponent = overrideKey
    ? resolveInteractive(overrideKey)
    : Resolved;

  const useWideLayout = WIDE_LAYOUT_SLUGS.has(fm.slug);

  return (
    <section
      id={`sec-${section.number}`}
      aria-labelledby={`sec-${section.number}-h`}
      className="mx-auto py-5"
      style={{ maxWidth: useWideLayout ? "1140px" : "960px", scrollMarginTop: "120px" }}
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
        /* Wrap in LessonProvider so interactives can read the lesson slug for context-aware defaults. */
        <LessonProvider value={{ slug: fm.slug }}>
          <InteractiveComponent />
        </LessonProvider>
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
