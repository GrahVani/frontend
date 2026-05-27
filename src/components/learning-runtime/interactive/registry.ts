/**
 * Interactive component registry.
 *
 * Maps a curriculum-side slug (declared in lesson front matter's
 * `interactive.component_type`) to the React component that renders it.
 *
 * Aliases are supported so that lessons authored before a spec was renamed
 * still resolve.
 */

import type { ComponentType } from "react";
import { VedangaBodyMap } from "./vedanga-body-map";
import { VedangaVsVedantaComparator } from "./vedanga-vs-vedanta-comparator";
import { VedicEcosystemOrbital } from "./vedic-ecosystem-orbital";
import { SlokaRecitationFrame } from "./sloka-recitation-frame";
import { VedangaRelationshipDiagram } from "./vedanga-relationship-diagram";
import { JyotishaSangaHub } from "./jyotisha-sanga-hub";
import { JyotishaVsWesternVsPopComparator } from "./jyotisha-vs-western-vs-pop-comparator";
import { DisambiguationDojo } from "./disambiguation-dojo";
import { KarmaTypologyExplorer } from "./karma-typology-explorer";
import { KarmaPredictionDojo } from "./karma-prediction-dojo";
import { HistoricalTimeline } from "./historical-timeline";
import { JyotishaCitationDojo } from "./jyotisha-citation-dojo";
import { BphsRecensionComparator } from "./bphs-recension-comparator";
import { BphsCitationDojo } from "./bphs-citation-dojo";
import { VarahamihiraSkandhaCoverageExplorer } from "./varahamihira-skandha-coverage-explorer";
import { VarahamihiraSynthesisDojo } from "./varahamihira-synthesis-dojo";
import { MedievalCodifierRelativeDatingExplorer } from "./medieval-codifier-relative-dating-explorer";
import { MedievalSynthesisDojo } from "./medieval-synthesis-dojo";
import { ParashariJaiminiParallelTraditionExplorer } from "./parashari-jaimini-parallel-tradition-explorer";
import { JaiminiSecondTraditionDojo } from "./jaimini-second-tradition-dojo";
import { FourStreamLandscapeExplorer } from "./four-stream-landscape-explorer";
import { FourStreamSynthesisDojo } from "./four-stream-synthesis-dojo";
import { ThreeSkandhaCurriculumMap } from "./three-skandha-curriculum-map";
import { ThreeSkandhaSynthesisDojo } from "./three-skandha-synthesis-dojo";
import { TithiAngleVisualizer } from "./tithi-angle-visualizer";
import { TithiCalculatorDojo } from "./tithi-calculator-dojo";
import { PancangaBuilder } from "./pancanga-builder";
import { TithiDeityWheel } from "./tithi-deity-wheel";
import { TithiContextMatcher } from "./tithi-context-matcher";
import { ShuklaTithiStrip } from "./shukla-tithi-strip";
import { KrishnaFestivalTimeline } from "./krishna-festival-timeline";
import { NandaBhadraClassifier } from "./nanda-bhadra-classifier";
import { AmantaPurnimantaConverter } from "./amanta-purnimanta-converter";
import { TithiMuhurtaIntroductoryJudgment } from "./tithi-muhurta-introductory-judgment";
import { VaraGrahaWheel } from "./vara-graha-wheel";
import { ChaldeanPlanetaryHoraExplorer } from "./chaldean-planetary-hora-explorer";
import { ChoghadiyaRahuKalamCalculator } from "./choghadiya-rahukalam-calculator";
import { VaraEventPairingExplorer } from "./vara-event-pairing-explorer";
import { MoonNakshatraCalculator } from "./moon-nakshatra-calculator";
import { NakshatraStrip } from "./nakshatra-strip";
import { NakshatraDeityRulerWheel } from "./nakshatra-deity-ruler-wheel";
import { DailyNakshatraPancangaReader } from "./daily-nakshatra-pancanga-reader";
import { YogaVsChartYogaComparison } from "./yoga-vs-chart-yoga-comparison";
import { TimeYogaCalculator } from "./time-yoga-calculator";
import { YogaWheel27 } from "./yoga-wheel-27";
import { InauspiciousYogaAvoidanceCalculator } from "./inauspicious-yoga-avoidance-calculator";
import { YogaMuhurtaScreeningIntegrator } from "./yoga-muhurta-screening-integrator";
import { KaranaCalculator } from "./karana-calculator";
import { KaranaCycleDiagram } from "./karana-cycle-diagram";
import { BhadraAvoidanceIntegrator } from "./bhadra-avoidance-integrator";

export type InteractiveComponentType = ComponentType<Record<string, never>>;

export const INTERACTIVE_REGISTRY: Record<string, InteractiveComponentType> = {
  "vedanga-body-map": VedangaBodyMap,
  // The relationship diagram is the FULL version Lesson 2 declares it needs:
  // cluster overlay + Jyotiṣa interlocks + sāṅga closing panel. Lesson 1 still
  // uses the body-map (sage figure with six luminous body parts) — its lesson
  // page route renders <VedangaBodyMap/> directly via the `scenes` prop and
  // ignores the registry mapping. Future lessons in this chapter family pick
  // up the relationship diagram via this registry entry.
  "vedanga-relationship-diagram": VedangaRelationshipDiagram,
  "vedanga-vs-vedanta-comparator": VedangaVsVedantaComparator,
  "vedic-ecosystem-orbital": VedicEcosystemOrbital,
  "sloka-recitation-frame": SlokaRecitationFrame,
  // Lesson 2's §7 flagship: Jyotiṣa-Sāṅga Synthesis Hub (hub-and-spoke
  // interlock viz + sāṅga scenario explorer in a two-tab composition).
  "jyotisha-sanga-hub": JyotishaSangaHub,
  // Lesson 3's §4 explorer: Jyotiṣa vs Western tropical vs sun-sign pop
  // comparator — six discriminating dimensions × three tradition-categories.
  "jyotisha-vs-western-vs-pop-comparator": JyotishaVsWesternVsPopComparator,
  // Lesson 3's §7 flagship: Disambiguation Dojo (Indo-Hellenistic lineage
  // timeline + ayanāṁśa drift slider + 5-scenario disambiguation drill in
  // a two-tab composition).
  "disambiguation-dojo": DisambiguationDojo,
  // Lesson 4's §4 explorer: Karma Typology Explorer — 4-fold karma cycle
  // SVG diagram with visibly-clickable karma-type nodes + side-panel
  // active-detail (definition, etymology, properties, jyotiṣa-sees,
  // agent-control).
  "karma-typology-explorer": KarmaTypologyExplorer,
  // Lesson 4's §7 flagship: Karma-Prediction Dojo (two-tab — Cycle in
  // Motion with overlay toggles + Indication Translator skill drill with
  // 5 deterministic-to-indication translation scenarios).
  "karma-prediction-dojo": KarmaPredictionDojo,
  // Lesson 2.1's §4 explorer: Historical Timeline — horizontal SVG with 12
  // major Jyotiṣa authors/texts staggered on the academic-Indology
  // chronological axis. Traditional-dating overlay shows divergences.
  "historical-timeline": HistoricalTimeline,
  // Lesson 2.1's §7 flagship: Jyotiṣa Citation Dojo (two-tab — Dating
  // Divergence Atlas + Citation Discipline Drill with 5 scenarios).
  "jyotisha-citation-dojo": JyotishaCitationDojo,
  // Lesson 2.2's §4 explorer: BPHS Recension Comparator — Parāśara duality
  // diptych + 10 prakaraṇa-plates with Santhanam adhyāya ranges and
  // cross-recension notes.
  "bphs-recension-comparator": BphsRecensionComparator,
  // Lesson 2.2's §7 flagship: BPHS Citation Dojo — Vimśottarī verse cross-
  // reference + 5-scenario BPHS citation discipline drill.
  "bphs-citation-dojo": BphsCitationDojo,
  // Lesson 2.3's §4 explorer: Varāhamihira Skandha Coverage Explorer —
  // date-anchor hero + 3 skandha plates (horā/saṁhitā/gaṇita) + dating
  // methodology + both-anchors framework comparison diptych.
  "varahamihira-skandha-coverage-explorer": VarahamihiraSkandhaCoverageExplorer,
  // Lesson 2.3's §7 flagship: Varāhamihira Synthesis Dojo — author cross-
  // dating (5 authors relative to Varāhamihira anchor) + 5-scenario drill.
  "varahamihira-synthesis-dojo": VarahamihiraSynthesisDojo,
  // Lesson 2.4's §4 explorer: Medieval Codifier Relative-Dating Explorer —
  // 3-layer Parāśari-tradition lineage + 4 codifier plates + compounding
  // uncertainty visualization.
  "medieval-codifier-relative-dating-explorer": MedievalCodifierRelativeDatingExplorer,
  // Lesson 2.4's §7 flagship: Medieval Synthesis Dojo — 5-scenario drill
  // on medieval-codifier dating + citation discipline.
  "medieval-synthesis-dojo": MedievalSynthesisDojo,
  // Lesson 2.5's §4 explorer: Parāśari ⇄ Jaiminī Parallel-Tradition Explorer
  // — diptych hero + 4-layer side-by-side comparison + sūtra-vs-verse genre
  // + 5 distinctive Jaiminī doctrines + same-Jaiminī identity question.
  "parashari-jaimini-parallel-tradition-explorer": ParashariJaiminiParallelTraditionExplorer,
  // Lesson 2.5's §7 flagship: Jaiminī Second-Tradition Dojo — two-tab
  // (Doctrinal-Pair Atlas across 6 pairs + 5-scenario tradition-attribution
  // drill).
  "jaimini-second-tradition-dojo": JaiminiSecondTraditionDojo,
  // Lesson 2.6's §4 explorer: Four-Stream Landscape Explorer — hero diptych
  // (4 streams equal-weight) + modern-primary-vs-revival distinction +
  // KP founder plate + 5 KP contributions + Lal Kitab founder plate + 6 LK
  // contributions + 3 modern-primary status criteria.
  "four-stream-landscape-explorer": FourStreamLandscapeExplorer,
  // Lesson 2.6's §7 flagship: Four-Stream Synthesis Dojo — two-tab
  // (Stream Landscape Matrix with classification-filter + cross-stream topic
  // deep-dive across 4 streams + 5-scenario Evaluative Reasoning Drill).
  // This is the Chapter-2 capstone Bloom-Evaluate practice surface.
  "four-stream-synthesis-dojo": FourStreamSynthesisDojo,
  // Lesson 3.1's §4 explorer: Three Skandha Curriculum Map — L2 pattern
  // (triangle painting LEFT + clickable skandha rows RIGHT).
  "three-skandha-curriculum-map": ThreeSkandhaCurriculumMap,
  // Lesson 3.1's §7 flagship: Three Skandha Synthesis Dojo — two-tab
  // (Stream × Skandha Matrix + 5-scenario Evaluative Drill).
  "three-skandha-synthesis-dojo": ThreeSkandhaSynthesisDojo,
  // Lesson 3.1.1's §4 explorer: Tithi Angle Visualizer — circular Sun-Moon
  // orbit with 12° segment overlay + real-time tithi computation + pakṣa
  // indicator + pañcāṅga reading panel.
  "tithi-angle-visualizer": TithiAngleVisualizer,
  // Lesson 3.1.1's §7 flagship: Tithi Calculator Dojo — step-by-step formula
  // breakdown with editable Sun/Moon longitudes + preset scenarios + elapsed
  // fraction visualisation.
  "tithi-calculator-dojo": TithiCalculatorDojo,
  // Lesson 3.1.2's §7 flagship: Tithi-Deity Wheel — circular 30-tithi visual
  // explorer with click-for-attributes, quality-filter highlight, and
  // festival-major badge system.
  "tithi-deity-wheel": TithiDeityWheel,
  // Lesson 3.1.1's §4 sub-component: Tithi Context Matcher — scenario-based
  // discrimination drill for pañcāṅga-tithi vs astronomical-instantaneous-tithi.
  "tithi-context-matcher": TithiContextMatcher,
  // Lesson 3.1.2's §4 explorer: Śukla Tithi Strip — horizontal scrollable
  // enumeration of the 15 śukla pakṣa tithis with deity, quality, and
  // festival cards.
  "shukla-tithi-strip": ShuklaTithiStrip,
  // Lesson 3.1.3's §7 flagship: Kṛṣṇa Festival Timeline — vertical timeline
  // of the 15 kṛṣṇa pakṣa tithis with festival-major highlights, Pitṛ Pakṣa
  // band, and click-to-reveal detail panel.
  "krishna-festival-timeline": KrishnaFestivalTimeline,
  // M3-C1-L1's §7 flagship: Pañcāṅga Builder — computes all 5 limbs
  // (tithi + vāra + nakṣatra + yoga + karaṇa) for any date with visual diagram.
  "pancanga-builder": PancangaBuilder,
  // Lesson 3.1.4's §7 flagship: Nandā-Bhadrā-Jayā-Riktā-Pūrṇā Classifier —
  // quality-event matcher with contextual-quality discipline override visualization.
  "nanda-bhadra-jaya-rikta-purna-classifier": NandaBhadraClassifier,
  // Lesson 3.1.5's §7 flagship: Amānta-Pūrṇimānta Converter — pakṣa-month converter,
  // festival cross-reference cards, and regional identifier.
  "amanta-purnimanta-converter": AmantaPurnimantaConverter,
  // Lesson 3.1.6's §7 flagship: Tithi-Muhūrta Introductory Judgment — scenario-based
  // muhūrta quality trainer with multi-element synthesis preview.
  "tithi-muhurta-introductory-judgment": TithiMuhurtaIntroductoryJudgment,
  // Lesson 3.2.1's §4 explorer: Vāra-Graha Wheel — circular 7-segment visual
  // explorer with click-for-attributes, element-filter highlight, and
  // planetary-type filter system.
  "vara-graha-wheel": VaraGrahaWheel,
  // Lesson 3.2.2's §7 flagship: Chaldean Planetary Horā Explorer — two-panel
  // composition (Chaldean order strip + horā sequence generator) with
  // 24 mod 7 = 3 principle explanation.
  "chaldean-planetary-hora-explorer": ChaldeanPlanetaryHoraExplorer,
  // Lesson 3.2.3's §7 flagship: Choghadiyā &amp; Rāhu Kālam Calculator —
  // sunrise/sunset input, 16-segment quality tables, visual timeline,
  // and inauspicious-window highlight.
  "choghadiya-rahukalam-calculator": ChoghadiyaRahuKalamCalculator,
  // Lesson 3.2.4's §7 flagship: Vāra-Event Pairing Explorer — event-category
  // cards, recommended-vāra panels, vāra reference grid, and planetary
  // friendship/enmity visualization.
  "vara-event-pairing-explorer": VaraEventPairingExplorer,
  // Lesson 3.3.1's §7 flagship: Moon-Nakṣatra Calculator — step-by-step formula
  // breakdown with editable Moon longitude + optional Sun context + preset
  // scenarios + 27-segment circular visualisation.
  "moon-nakshatra-calculator": MoonNakshatraCalculator,
  // Lesson 3.3.2's §4 explorer: Nakṣatra Strip — horizontal scrollable
  // enumeration of all 27 nakṣatras with ruler-colour coding, filter pills,
  // search, and click-to-reveal detail panel (pāda, yoni, gana, tara).
  "nakshatra-strip": NakshatraStrip,
  // Lesson 3.3.3's §7 flagship: Nakṣatra Deity & Ruler Wheel — circular 27-segment
  // SVG explorer with inner-name / outer-planet rings, filter pills, centre
  // mandala, and pakṣa-suitability overlay toggle.
  "nakshatra-deity-ruler-wheel": NakshatraDeityRulerWheel,
  // Lesson 3.3.4's §7 flagship: Daily Nakṣatra Pañcāṅga Reader — simulated
  // today's pañcāṅga with time-slider, transition tracking, activity-suitability
  // grid, and classical reasoning panel.
  "daily-nakshatra-pancanga-reader": DailyNakshatraPancangaReader,
  // Lesson 3.4.1's §7 flagship: Yoga vs Chart-Yoga Comparison — two-column
  // comparison table + 8-statement discrimination drill + visual icons.
  "yoga-vs-chart-yoga-comparison": YogaVsChartYogaComparison,
  // Lesson 3.4.2's §7 flagship: Time-Yoga Calculator — Sun+Moon longitude sum
  // with step-by-step formula breakdown, 27-segment circular visualisation,
  // and preset scenarios.
  "time-yoga-calculator": TimeYogaCalculator,
  // Lesson 3.4.3's §7 flagship: Yoga Wheel 27 — circular 27-segment explorer
  // with nature colour-coding, filter pills, table view toggle, and search.
  "yoga-wheel-27": YogaWheel27,
  // Lesson 3.4.4's §7 flagship: Inauspicious Yoga Avoidance Calculator —
  // focus on 6 inauspicious yogas with severity ranking, mitigation guide,
  // and month-view timeline.
  "inauspicious-yoga-avoidance-calculator": InauspiciousYogaAvoidanceCalculator,
  // Lesson 3.4.5's §7 flagship: Yoga Muhūrta Screening Integrator — multi-element
  // muhūrta screening tool with 5-element dashboard and yoga-specific filter.
  "yoga-muhurta-screening-integrator": YogaMuhurtaScreeningIntegrator,
  // Lesson 3.5.1's §7 flagship: Karaṇa Calculator — half-tithi computation
  // with step-by-step breakdown, tithi-bar visual, and preset scenarios.
  "karana-calculator": KaranaCalculator,
  // Lesson 3.5.2's §7 flagship: Karaṇa Cycle Diagram — circular 11-karaṇa
  // explorer with Cara/Sthira colour-coding, filter pills, and table view.
  "karana-cycle-diagram": KaranaCycleDiagram,
  // Lesson 3.5.3's §7 flagship: Bhadra Avoidance Integrator — Bhadra (Viṣṭi)
  // calculator with day-of-week selector, activity-avoidance cards, classical
  // source panel, and comparison with other inauspicious periods.
  "bhadra-avoidance-integrator": BhadraAvoidanceIntegrator,
};

export function resolveInteractive(slug: string | undefined): InteractiveComponentType | null {
  if (!slug) return null;
  return INTERACTIVE_REGISTRY[slug] ?? null;
}
