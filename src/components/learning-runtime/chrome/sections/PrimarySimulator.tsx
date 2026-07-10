/**
 * §7 Primary Simulator — host frame for the lesson's biggest interactive.
 *
 * Resolves the lesson's `interactive.component_type` slug against the
 * interactive registry and renders the matching component. Falls back to a
 * spec-pending placeholder if the slug does not resolve.
 */

import { MarkdownContent } from "../MarkdownContent";
import { loadInteractive } from "../../interactive/dynamic-loader";
import { SectionHeader } from "../SectionHeader";
import { presentationFor } from "../../lib/section-meta";
import { Sparkles } from "lucide-react";
import type { LessonSection, LessonFrontMatter } from "@/lib/learning-runtime/types";
import { LessonProvider } from "@/components/learning-runtime/interactive/tier-1/module-4/rashi-attribute-wheel";

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
  "the-3-step-protocol-overview": "three-step-protocol-overview",
  "step-1-lagna-assessment": "lagna-assessment-scorer",
  "step-2-dasha-bhukti-analysis": "dasha-bhukti-timing-window",
  "step-3-gochara-confirmation": "gochara-trigger-confirmation",
  "worked-example-3-step-protocol-end-to-end": "worked-example-3-step-synthesis",
  "parashara-as-default-and-when-to-layer": "parashara-default-explorer",
  "kp-for-cuspal-yes-no-questions": "kp-cuspal-decision-tree",
  "jaimini-for-cara-karaka-and-dharma-questions": "jaimini-calling-decision-tree",
  "lal-kitab-and-tajika-when-to-invoke": "remedy-year-decision-tree",
  "the-layered-framework-decision-logic-applied": "layered-framework-decision-synthesis",
  "the-four-confidence-tiers": "prediction-confidence-dial",
  "the-two-yes-principle": "two-yes-indicator-counter",
  "deterministic-vs-probabilistic-prediction": "karma-agency-simulator",
  "shani-the-judge-and-server": "shani-dignity-wheel",
  // ─── Module 02: Chart Reading Workflow ───
  "birth-time-accuracy-assessment": "birth-time-accuracy-assessment",
  "ayanamsha-choice-at-predictive-stakes": "ayanamsha-choice-verifier",
  "house-system-choice-per-question-type": "house-system-choice-verifier",
  "worked-example-data-preparation-end-to-end": "data-preparation-preflight",
  "tattva-shuddhi-diagnostic-introduction": "tattva-shuddhi-checker",
  "ruling-planets-at-consultation-moment-diagnostic": "ruling-planets-calculator",
  "interpreting-cross-check-output-proceed-caveat-or-btr": "cross-check-decision-synthesizer",
  "worked-example-cross-check-pre-flight-on-real-chart": "preliminary-cross-check-preflight",
  "step-1-dignity-and-strength-assessment": "dignity-strength-analyzer",
  "step-2-yogas-and-doshas-identification": "yoga-dosha-identifier",
  "step-3-dasha-context-analysis": "dasha-context-analyzer",
  "step-4-transit-context-analysis": "transit-context-analyzer",
  "step-5-synthesis-and-confidence-classification": "reading-synthesis-workbench",
  "cross-stream-verification-when-and-why": "cross-stream-concept-builder",
  "parashari-plus-kp-paired-verification": "parashari-kp-verifier",
  "parashari-plus-jaimini-paired-verification": "parashari-jaimini-verifier",
  "convergence-divergence-discipline-applied": "convergence-divergence-workbench",
  "the-standard-write-up-structure": "reading-documentation-template",
  "confidentiality-and-data-handling-applied": "reading-documentation-template",
  "worked-write-up-1-marriage-question": "reading-documentation-template",
  "worked-write-up-2-career-change-question": "reading-documentation-template",
  // ─── Module 05: Wealth & Finance ───
  "the-2nd-house-significations-revisited-for-wealth": "second-house-wealth-evaluator",
  "the-11th-house-significations-revisited-for-gains": "eleventh-house-gains-evaluator",
  "2nd-and-11th-lord-permutations": "second-eleventh-lord-permutations",
  "jupiter-venus-as-natural-wealth-karakas": "natural-wealth-karaka-analyzer",
  "d2-construction-the-solar-lunar-bisection": "d2-solar-lunar-bisection",
  "reading-d2-the-15-degree-bisection-doctrine": "d2-bisection-doctrine-reader",
  "solar-d2-vs-lunar-d2-tendencies": "d2-solar-lunar-tendencies",
  "worked-example-d2-reading-on-real-chart": "d2-real-chart-workbench",
  "dhana-yoga-pattern-revisited-for-prediction": "dhana-yoga-pattern-verifier",
  "the-major-dhana-yoga-variants-applied": "dhana-yoga-variants-evaluator",
  "lakshmi-yoga-and-related-formations-at-depth": "lakshmi-yoga-analyser",
  "dhana-yoga-strength-overlay-via-shadbala": "dhana-yoga-shadbala-overlay",
  "kp-2nd-and-11th-cuspal-sub-lord-doctrine": "kp-cuspal-sub-lord-doctrine",
  "significators-of-money-houses-in-kp": "kp-money-significators-evaluator",
  "kp-investment-timing-via-significator-dasha": "kp-investment-timing-explorer",
  "worked-example-kp-wealth-question": "kp-wealth-question-workbench",
  "lal-kitab-money-formula-tradition-revisited": "lal-kitab-money-formula-revisited",
  "the-lal-kitab-money-planets-mars-mercury-venus-considered": "lal-kitab-money-planets-analyser",
  "lal-kitab-loss-formulas-and-their-empirical-frame": "lal-kitab-loss-formulas-evaluator",
  "worked-example-lal-kitab-wealth-reading": "lal-kitab-wealth-reading-workbench",
  "tajika-dhana-saham-and-annual-wealth-overlay": "tajika-dhana-saham-overlay",
  "worked-synthesis-the-overall-wealth-promise-question": "overall-wealth-promise-synthesis",
  "worked-synthesis-the-investment-decision-question-with-scope-routing": "investment-decision-synthesis",
  "scope-of-competence-stock-picks-financial-planning-tax-advice": "ethical-scope-routing-dashboard",
  // M3-C1-L1's §7 = Tithi Calculator Dojo (step-by-step formula breakdown +
  // editable longitudes + preset scenarios). §4 keeps the tithi-angle-visualizer.
  "tithi-as-12-degrees-of-sun-moon-angle": "tithi-as-12-degrees-explorer",
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
  // M23-C2-L4's §7 = Precision Pāda Dial & Calculator — 13°20′→4×3°20′
  // subdivision, Navāṁśa bridge, and case-file drill.
  "nakshatra-pada-precision": "pada-calculator",
  // M23-C4-L1's §7 = Vivāha-Muhūrta Evaluator — wedding-specific pañcāṅga
  // weighting, Jupiter-Venus discipline, cancellation-doṣa screener, multi-actor
  // synergy, and saptapadī lagna-window selection.
  "vivaha-muhurta": "vivaha-muhurta-evaluator",
  // M23-C6-L1's §7 = Muhūrta Honest Handling — cumulative honest-handling
  // synthesis across M23 with rarity dial, case files, daivajña wheel, and
  // instance map.
  "muhurta-honest-handling": "muhurta-honest-handling",
  // M23-C6-L2's §7 = Muhūrta Decision Framework — stakes-calibrated engagement
  // decision-tree, stakes gauge, case files, and method matrix.
  "muhurta-decision-framework": "muhurta-decision-framework",
  // M23-C6-L3's §7 = M23 Closure — cumulative module synthesis with chapter
  // wheel, hook timeline, self-assessment, and ongoing-development practices.
  "m23-closure": "m23-closure",
  // M23-C4-L2's §7 = Vyāpāra-Ārambha-Muhūrta Evaluator — business-launch-specific
  // pañcāṅga weighting, Mercury-Jupiter discipline, cancellation-doṣa screener,
  // house-bala foundation, business-type refinement, and nirlobha ethics.
  "vyapara-arambh-muhurta": "vyapara-arambh-muhurta-evaluator",
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
  // ─── Module 04: Rāśi System ───
  // Chapter 1 — Rāśi Mechanics
  "rashi-as-30-degree-segment": "rashi-boundary-wheel",
  "the-12-rashi-boundaries": "rashi-attribute-wheel",
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
  "mina-pisces-the-watery-mutable": "rashi-profile-explorer",
  // Chapter 6 — Rāśi Groupings and Synthesis
  "chara-sthira-dvi-svabhava": "rashi-modality-classifier",
  "kendra-panaphara-apoklima": "quadrant-triad-visualizer",
  "dvi-trikona-5-9-pair-grid": "trikona-pair-explorer",
  "sirsha-prishtha-ubhaya-udaya": "rashi-rising-classifier",
  "rashi-across-streams": "rashi-stream-comparator",
  "four-worked-interpretive-examples": "chart-planet-positioner",

  // ─── Module 07: Nakshatras ───
  // Chapter 1 — The Foundation and First Five Stars
  "the-12-slot-nakshatra-template-lab": "nakshatra-template-lab",
  "nakshatra-template-lab": "nakshatra-template-lab",
  "ashwini-the-horse-headed-physicians": "nakshatra-profile",
  "bharani-the-bearer": "nakshatra-profile",
  "krittika-the-cutters-and-fire-feeders": "nakshatra-profile",
  "rohini-the-red-and-fertile-favourite-of-chandra": "nakshatra-profile",
  "mrigashira-the-deer-head": "nakshatra-profile",

  // Chapter 2 — The Cancer Boundary
  "ardra-the-moist-rudra-tear": "nakshatra-profile",
  "ardra-the-teardrop": "nakshatra-profile",
  "punarvasu-the-return-of-light": "nakshatra-profile",
  "punarvasu-the-return-of-the-light": "nakshatra-profile",
  "pushya-the-nourisher": "nakshatra-profile",
  "ashlesha-the-entwiner-naga-domain": "nakshatra-profile",
  "ashlesha-the-entwining-serpent": "nakshatra-profile",
};

/** Slugs whose §7 interactive needs extra horizontal space (e.g. large SVG wheel + sidebar). */
const WIDE_LAYOUT_SLUGS = new Set([
  "the-four-yugas-and-the-mahayuga",
  "nakshatra-to-starting-dasha-lord-mapping",
  "the-five-level-cascade-overview",
  "the-recursive-vimshottari-ratio",
  "constructing-antardasha-tables",
  "constructing-pratyantar-and-sukshma-tables",
  "reading-a-dasha-table-fluency-drill",
  "ashtottari-the-108-year-cycle",
  "when-ashtottari-applies-parashara-criterion",
  "yogini-the-36-year-cycle",
  "vimshottari-class-dasha-comparator-when-to-consult",
  "the-seven-conditional-dashas",
  "parashara-selection-criteria-for-conditional-dashas",
  "dasha-system-decision-framework",
  "kp-modified-vimshottari-introduction",
  "why-quantitative-strength-matters",
  "the-six-components-overview",
  "parashara-thresholds-uttama-madhya-adhama",
  "uchchabala-the-exaltation-distance-formula",
  "saptavargabala-seven-fold-sign-strength",
  "oja-yugmabala-odd-even-sign-strength",
  "kendrabala-and-drekkanabala",
  "summing-sthana-bala-worked-example",
  "dik-bala-the-directional-strength-formula",
  "manvantara-and-kalpa-the-cosmic-scale",
  "where-are-we-now",
  "does-yuga-position-affect-your-chart",
  "the-four-day-types",
  "savana-day-and-civil-time",
  "sidereal-day-and-its-uses",
  "the-tithi-as-lunar-day",
  "solar-day-and-sankranti",
  "regional-schools-and-lineages",
  "modern-lineage-threads",
  "lineage-matters-worked-example",
  "budha-the-prince-and-intellect",
  "budha-and-the-doctrine-of-association",
  "budha-combustion-sensitivity",
  "guru-the-teacher-and-expander",
  "guru-as-the-greatest-benefic",
  "guru-aspects-and-the-9th-house",
  "shukra-the-minister-and-grace",
  "shukra-as-asuracharya-and-the-knowledge-of-revival",
  "shukra-friendships-and-dignities",
  "shani-the-judge-and-server",
  "shani-as-the-greatest-malefic-and-greatest-teacher",
  "shani-friendships-dignities-special-aspects",
  "the-nodes-as-points-not-planets",
  "the-svarbhanu-myth-and-its-meaning",
  "rahu-the-amplifier-and-the-desire-driven",
  "the-upagrahas-introduction",
  "computing-gulika-and-mandi",
  "naisargika-friendship-the-fixed-grid",
  "tamkalika-friendship-from-the-chart",
  "panchadha-compound-friendship",
  "vakra-asta-and-other-special-states",
  "lal-kitab-divergence-and-multi-stream-grahas",
  "bhava-as-life-domain",
  "whole-sign-vs-cusp-systems-introduction",
  "the-per-bhava-template",
  "1st-bhava-tanu",
  "2nd-bhava-dhana",
  "3rd-bhava-sahaja",
  "the-arthatrikona-1-and-the-upachaya-3",
  "4th-bhava-sukha",
  "5th-bhava-putra",
  "6th-bhava-shatru",
  "7th-bhava-yuvati",
  "8th-bhava-ayu",
  "9th-bhava-bhagya",
  "10th-bhava-karma",
  "11th-bhava-labha",
  "12th-bhava-vyaya",
  "kendra-panaphara-apoklima-applied-to-bhavas",
  "trikona-dusthana-upachaya",
  "the-four-trikona-groupings",
  "naisargika-karaka-of-each-bhava",
  "karaka-of-bhava-vs-karaka-by-tenancy",
  "bhavat-bhavam-the-derivative-house-technique",
  "bhava-chalita-the-parashari-cusp-variant",
  "placidus-cusps-and-the-kp-convention",
  "bhava-madhya-and-bhava-sandhi",
  "which-house-system-when",
  "lal-kitab-fixed-aries-lagna-acknowledgement",
  "why-divisional-charts-exist",
  "the-shodasha-varga-list",
  "the-per-varga-template",
  "d1-rashi-the-macroscopic-chart-revisited",
  "d2-hora-the-wealth-magnification",
  "d3-drekkana-the-sibling-magnification",
  "the-three-drekkana-systems-parashari-jaimini-somanatha",
  "d4-chaturthamsha-the-property-magnification",
  "d7-saptamsha-the-children-magnification",
  "d9-navamsha-construction",
  "d9-navamsha-marriage-and-dharma-jurisdiction",
  "d9-as-strength-test-of-d1-planets",
  "vargottama-introduced-via-d1-d9-consistency",
  "d10-dashamsha-the-career-magnification",
  "d10-construction-and-the-deva-asura-distinction",
  "d12-dvadashamsha-the-parents-magnification",
  "d16-shodashamsha-the-vehicles-magnification",
  "using-d10-d12-d16-together-worked-example",
  "d20-vimshamsha-the-spiritual-magnification",
  "d24-chaturvimshamsha-the-education-magnification",
  "d27-saptavimshamsha-the-strength-magnification",
  "the-spiritual-trio-d20-d27-d60-introduction",
  "d30-trimshamsha-the-evil-magnification",
  "d30-construction-the-unequal-division-doctrine",
  "d40-khavedamsha-and-d45-akshavedamsha-maternal-and-paternal-lineage",
  "using-d30-honestly-disease-magnification-with-ethical-routing",
  "d60-construction-and-its-precision-demand",
  "d60-as-the-karmic-substrate-doctrinal-position",
  "d60-and-birth-time-rectification-the-coupling",
  "d60-honest-handling-substrate-not-destiny",
  "vimshopaka-the-weighted-strength-formula",
  "the-three-vimshopaka-schemes-shadvarga-saptavarga-dasavarga",
  "vargottama-deep-doctrine-and-degrees-of-strength",
  "multi-varga-reading-marriage-d1-d9-d24-d60-workflow",
  "multi-varga-reading-career-d1-d10-d24-workflow",
  "multi-varga-reading-children-d1-d7-d9-workflow",
  "cross-stream-varga-jaimini-overlay-and-kp-conventions",
  "the-divergence-question-when-d1-and-d9-disagree",
  "the-15-shukla-tithis",
  "the-15-krishna-tithis",
  "nakshatra-deity-and-ruling-planet-at-pancanga-level",
  "panchaka-cancellation",
  "rahu-kala-yamaganda",
  "muhurta-honest-handling",
  "muhurta-decision-framework",
  "m23-closure",
  "the-12-slot-nakshatra-template-lab",
  "nakshatra-template-lab",
  "ashwini-the-horse-headed-physicians",
  "bharani-the-bearer",
  "krittika-the-cutters-and-fire-feeders",
  "rohini-the-red-and-fertile-favourite-of-chandra",
  "mrigashira-the-deer-head",
  "ardra-the-moist-rudra-tear",
  "ardra-the-teardrop",
  "punarvasu-the-return-of-light",
  "punarvasu-the-return-of-the-light",
  "pushya-the-nourisher",
  "ashlesha-the-entwiner-naga-domain",
  "ashlesha-the-entwining-serpent",
  "the-pushya-nakshatra-as-greatest-auspicious",
  "ashlesha-and-snake-shadow-honest-handling",
  "tajika-drishti-in-annual-chart-context",
  "the-predictive-write-up-structure",
  "worked-example-marriage-question-end-to-end",
  "worked-example-career-change-question-end-to-end",
  "multi-domain-synthesis-workbench-walkthrough",
  "the-eight-predictive-failure-modes-overview",
  "failure-modes-1-4-indicator-and-timing-errors",
  "failure-modes-5-8-tone-and-scope-errors",
  "the-self-audit-discipline-applying-failure-modes-to-your-own-draft",
  "birth-time-accuracy-assessment",
  "ayanamsha-choice-at-predictive-stakes",
  "house-system-choice-per-question-type",
  "worked-example-data-preparation-end-to-end",
  "tattva-shuddhi-diagnostic-introduction",
  "ruling-planets-at-consultation-moment-diagnostic",
  "worked-example-cross-check-pre-flight-on-real-chart",
  "step-1-dignity-and-strength-assessment",
  "step-2-yogas-and-doshas-identification",
  "step-3-dasha-context-analysis",
  "step-4-transit-context-analysis",
  "step-5-synthesis-and-confidence-classification",
  "cross-stream-verification-when-and-why",
  "parashari-plus-kp-paired-verification",
  "parashari-plus-jaimini-paired-verification",
  "convergence-divergence-discipline-applied",
  "the-standard-write-up-structure",
  "confidentiality-and-data-handling-applied",
  "worked-write-up-1-marriage-question",
  "worked-write-up-2-career-change-question",
  "the-2nd-house-significations-revisited-for-wealth",
  "the-11th-house-significations-revisited-for-gains",
  "2nd-and-11th-lord-permutations",
  "jupiter-venus-as-natural-wealth-karakas",
  "d2-construction-the-solar-lunar-bisection",
  "reading-d2-the-15-degree-bisection-doctrine",
  "solar-d2-vs-lunar-d2-tendencies",
  "worked-example-d2-reading-on-real-chart",
  "dhana-yoga-pattern-revisited-for-prediction",
  "the-major-dhana-yoga-variants-applied",
  "lakshmi-yoga-and-related-formations-at-depth",
  "dhana-yoga-strength-overlay-via-shadbala",
  "kp-2nd-and-11th-cuspal-sub-lord-doctrine",
  "significators-of-money-houses-in-kp",
  "kp-investment-timing-via-significator-dasha",
  "worked-example-kp-wealth-question",
  "lal-kitab-money-formula-tradition-revisited",
  "the-lal-kitab-money-planets-mars-mercury-venus-considered",
  "lal-kitab-loss-formulas-and-their-empirical-frame",
  "worked-example-lal-kitab-wealth-reading",
  "tajika-dhana-saham-and-annual-wealth-overlay",
  "worked-synthesis-the-overall-wealth-promise-question",
  "worked-synthesis-the-investment-decision-question-with-scope-routing",
  "scope-of-competence-stock-picks-financial-planning-tax-advice",
]);

export async function PrimarySimulator({ section, frontMatter: fm }: PrimarySimulatorProps) {
  const componentType = fm.interactive?.componentType || fm.interactive?.component;
  const specFile = fm.interactive?.specFile;
  const enabled = fm.interactive?.enabled ?? false;

  const overrideKey = SECTION_7_OVERRIDES[fm.slug];
  const interactiveKey = overrideKey ?? componentType;
  
  let InteractiveComponent = null;

  // Direct folder routing for Tier 1 Module 1 (bypassing the alphabetical registry)
  if (fm.tier === 1 && fm.module === 1 && interactiveKey) {
    try {
      // By appending /index, Turbopack knows it's only looking for JS/TS index files, ignoring READMEs
      const mod = await import(`../../interactive/tier-1/module-1/${interactiveKey}/index`);
      // Find the first exported component (or default)
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 1: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 2
  if (fm.tier === 1 && fm.module === 2 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-2/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 2: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 3
  if (fm.tier === 1 && fm.module === 3 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-3/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 3: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 4
  if (fm.tier === 1 && fm.module === 4 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-4/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 4: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 5
  if (fm.tier === 1 && fm.module === 5 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-5/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 5: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 6
  if (fm.tier === 1 && fm.module === 6 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-6/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 6: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 7
  if (fm.tier === 1 && fm.module === 7 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-7/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 7: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 8
  if (fm.tier === 1 && fm.module === 8 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-8/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 8: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 9
  if (fm.tier === 1 && fm.module === 9 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-9/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 9: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 10
  if (fm.tier === 1 && fm.module === 10 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-10/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 10: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 11
  if (fm.tier === 1 && fm.module === 11 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-11/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 11: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 12
  if (fm.tier === 1 && fm.module === 12 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-12/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 12: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 13
  if (fm.tier === 1 && fm.module === 13 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-13/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 13: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 14
  if (fm.tier === 1 && fm.module === 14 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-14/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 14: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 15
  if (fm.tier === 1 && fm.module === 15 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-15/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 15: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 16
  if (fm.tier === 1 && fm.module === 16 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-16/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 16: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 17
  if (fm.tier === 1 && fm.module === 17 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-17/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 17: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 18
  if (fm.tier === 1 && fm.module === 18 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-18/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 18: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 19
  if (fm.tier === 1 && fm.module === 19 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-19/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 19: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 20
  if (fm.tier === 1 && fm.module === 20 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-20/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 20: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 21
  if (fm.tier === 1 && fm.module === 21 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-21/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 21: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 22
  if (fm.tier === 1 && fm.module === 22 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-22/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 22: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 23
  if (fm.tier === 1 && fm.module === 23 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-23/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 23: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 1 Module 24
  if (fm.tier === 1 && fm.module === 24 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-1/module-24/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 1 Module 24: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 2 Module 1
  if (fm.tier === 2 && fm.module === 1 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-2/module-01/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 2 Module 1: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 2 Module 2
  if (fm.tier === 2 && fm.module === 2 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-2/module-02/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 2 Module 2: ${interactiveKey}`, err);
    }
  }

  // Direct folder routing for Tier 2 Module 3
  if (fm.tier === 2 && fm.module === 3 && interactiveKey) {
    try {
      const mod = await import(`../../interactive/tier-2/module-03/${interactiveKey}/index`);
      const exportName = Object.keys(mod).find(key => key !== 'default') || 'default';
      InteractiveComponent = mod[exportName];
    } catch (err) {
      console.error(`Failed to load direct component for Tier 2 Module 3: ${interactiveKey}`, err);
    }
  }

  // Fallback to alphabetical bucket loader
  if (!InteractiveComponent && interactiveKey) {
    InteractiveComponent = await loadInteractive(interactiveKey);
  }

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
