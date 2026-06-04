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
import { RahuKetuComparator } from "./rahu-ketu-comparator";
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
import { SevenSubBranchesExplorer } from "./seven-sub-branches-explorer";
import { SevenSubBranchesSynthesisDojo } from "./seven-sub-branches-synthesis-dojo";
import { GrahvaniCoverageMatrixExplorer } from "./grahvani-coverage-matrix-explorer";
import { GrahvaniCoverageSynthesisDojo } from "./grahvani-coverage-synthesis-dojo";
import { RegionalSchoolsExplorer } from "./regional-schools-explorer";
import { RegionalSchoolsSynthesisDojo } from "./regional-schools-synthesis-dojo";
import { LineageThreadsNetworkExplorer } from "./lineage-threads-network-explorer";
import { LineageThreadsSynthesisDojo } from "./lineage-threads-synthesis-dojo";
import { ThreeLineageComparisonChartAnalyzer } from "./three-lineage-comparison-chart-analyzer";
import { LineageMattersSynthesisDojo } from "./lineage-matters-synthesis-dojo";
import { PrecessionVisualizer } from "./precession-visualizer";
import { ZodiacReferenceFrameExplorer } from "./zodiac-reference-frame-explorer";
import { ZodiacTraditionReasoningComparator } from "./zodiac-tradition-reasoning-comparator";
import ZodiacTraditionComparator from "./zodiac-tradition-comparator";
import { TropicalSiderealConversionCalculator } from "./tropical-sidereal-conversion-calculator";
import { AyanamshaDefinitionExplorer } from "./ayanamsha-definition-explorer";
import { LahiriAyanamshaExplorer } from "./lahiri-ayanamsha-explorer";
import { LahiriByHandStepByStepCalculator } from "./lahiri-by-hand-step-by-step-calculator";
import { KrishnamurtiAyanamshaExplorer } from "./krishnamurti-ayanamsha-explorer";
import { YugaProportionVisualiser } from "./yuga-proportion-visualiser";
import { YugaCycleExplorer } from "./yuga-cycle-explorer";
import { TraditionalVsAcademicDatingComparator } from "./traditional-vs-academic-dating-comparator";
import { YugaDependenceClassifier } from "./yuga-dependence-classifier";
import { DayTypeComparator } from "./day-type-comparator";
import { SunriseAtAnyLatitude } from "./sunrise-at-any-latitude";
import { SiderealDayExplorer } from "./sidereal-day-explorer";
import { TithiFromSunMoon } from "./tithi-from-sun-moon";
import { SankrantiTracker } from "./sankranti-tracker";
import { ComparativeAyanamshaExplorer } from "./comparative-ayanamsha-explorer";
import { AyanamshaDecisionFrameworkFlowchart } from "./ayanamsha-decision-framework-flowchart";
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
import { SamvatConverterVikramaShaka } from "./samvat-converter-vikrama-shaka";
import { RegionalCalendarExplorer } from "./regional-calendar-explorer";
import { CalendarConverter } from "./calendar-converter";
import { RashiBoundaryWheel } from "./rashi-boundary-wheel";
import { BoundaryCrossingDemonstrator } from "./boundary-crossing-demonstrator";
import { RashiAttributeWheel } from "./rashi-attribute-wheel";
import { RashiModalityClassifier } from "./rashi-modality-classifier";
import { KendraTrikonaGroupingVisualizer } from "./kendra-trikona-grouping-visualizer";
import { ChartPlanetPositioner } from "./chart-planet-positioner";
import { RashiRisingClassifier } from "./rashi-rising-classifier";
import { RashiStreamComparator } from "./rashi-stream-comparator";
import { RashiProfileExplorer } from "./rashi-profile-explorer";
import { QuadrantTriadVisualizer } from "./quadrant-triad-visualizer";
import { TrikonaPairExplorer } from "./trikona-pair-explorer";
import { DignityWheel } from "./dignity-wheel";
import { BudhaDignityWheel } from "./budha-dignity-wheel";
import { GuruDignityWheel } from "./guru-dignity-wheel";
import { ShukraDignityWheel } from "./shukra-dignity-wheel";
import { ShaniDignityWheel } from "./shani-dignity-wheel";
import { SaturnLessonMapper } from "./saturn-lesson-mapper";
import { ShaniAspectDignityGrid } from "./shani-aspect-dignity-grid";
import { NodeGeometry } from "./node-geometry";
import { NodeAxisReader } from "./node-axis-reader";
import { NodeDignityPositions } from "./node-dignity-positions";
import { UpagrahaList } from "./upagraha-list";
import { GulikaCalculator } from "./gulika-calculator";
import { RahuAmplifier } from "./rahu-amplifier";
import { JupiterEvaluator } from "./jupiter-evaluator";
import { AspectCaster } from "./aspect-caster";
import { MythMap } from "./myth-map";
import { ShukraFriendshipDignityGrid } from "./shukra-friendship-dignity-grid";
import { AssociationClassifier } from "./association-classifier";
import { CombustionCalculator } from "./combustion-calculator";
import { FriendshipMatrix } from "./friendship-matrix";
import { PakshabalaSlider } from "./pakshabala-slider";
import { KarakaRouter } from "./karaka-router";
import { FriendshipDignityGrid } from "./friendship-dignity-grid";
import { MulaRootMandala } from "./mula-root-mandala";
import { PurvaAshadhaRelationshipMap } from "./purva-ashadha-relationship-map";
import { UttaraAshadhaAttributeUniverse } from "./uttara-ashadha-attribute-universe";
import { ShravanaDhanishthaConceptConstellation } from "./shravana-dhanishtha-concept-constellation";
import { ShatabhishajBhadrapadaKnowledgeGalaxy } from "./shatabhishaj-bhadrapada-knowledge-galaxy";
import { RevatiConstellationDiagram } from "./revati-constellation-diagram";
import { AnuradhaDevotionNetwork } from "./anuradha-devotion-network";
import { AshleshaHonestHandlingDojo } from "./ashlesha-honest-handling-dojo";
import { ChitraCelestialGemLab } from "./chitra-celestial-gem-lab";
import { GandantaWaterFireJunction } from "./gandanta-water-fire-junction";
import { JyeshthaSupremacyTalisman } from "./jyeshtha-supremacy-talisman";
import { MaghaAncestralGatewayLab } from "./magha-ancestral-gateway-lab";
import { NakshatraProfile } from "./nakshatra-profile";
import { NakshatraTemplateLab } from "./nakshatra-template-lab";
import { PurvaUttaraDoctrineExplorer } from "./purva-uttara-doctrine-explorer";
import { PushyaAuspiciousnessLab } from "./pushya-auspiciousness-lab";
import { SwatiBreezeNavigator } from "./swati-breeze-navigator";
import { VishakhaForkedPathExplorer } from "./vishakha-forked-path-explorer";
import { PadaCalculator } from "./pada-calculator";
import { PadaNavamshaMapper } from "./pada-navamsha-mapper";
import { KpSubCalculator } from "./kp-sub-calculator";
import { TaraBalAWheel } from "./tara-bala-wheel";
import { StreamComparisonTable } from "./stream-comparison-table";

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
  // Lesson 3.2's §4 explorer: Seven Sub-Branches Explorer — L2 pattern
  // (manuscript diagram LEFT + clickable sub-branch rows RIGHT).
  "seven-sub-branches-explorer": SevenSubBranchesExplorer,
  // Lesson 3.2's §7 flagship: Seven Sub-Branches Synthesis Dojo — two-tab
  // (Stream × Sub-Branch Matrix + 5-scenario Evaluative Drill).
  "seven-sub-branches-synthesis-dojo": SevenSubBranchesSynthesisDojo,
  // Lesson 3.3's §4 explorer: Grahvani Coverage Matrix Explorer — L2 pattern
  // (navigational map LEFT + stream-filtered coverage cards RIGHT).
  "grahvani-coverage-matrix-explorer": GrahvaniCoverageMatrixExplorer,
  // Lesson 3.3's §7 flagship: Grahvani Coverage Synthesis Dojo — two-tab
  // (Full 4×7 Coverage Matrix + 5-scenario Evaluative Drill).
  "grahvani-coverage-synthesis-dojo": GrahvaniCoverageSynthesisDojo,
  // Lesson 4.1's §4 explorer: Regional Schools Explorer — L2 pattern
  // (map image LEFT + tabbed school explorer RIGHT with stream concentrations).
  "regional-schools-explorer": RegionalSchoolsExplorer,
  // Lesson 4.1's §7 flagship: Regional Schools Synthesis Dojo — two-tab
  // (6×4 Regional Schools Matrix + teacher lookup + 5-scenario Evaluative Drill).
  "regional-schools-synthesis-dojo": RegionalSchoolsSynthesisDojo,
  // Lesson 4.2's §4 explorer: Lineage Threads Network Explorer — L2 pattern
  // (network diagram LEFT + tabbed lineage explorer RIGHT with sub-lineages).
  "lineage-threads-network-explorer": LineageThreadsNetworkExplorer,
  // Lesson 4.2's §7 flagship: Lineage Threads Synthesis Dojo — two-tab
  // (Lineage Comparison Matrix + 5-scenario Evaluative Drill).
  "lineage-threads-synthesis-dojo": LineageThreadsSynthesisDojo,
  // Lesson 4.3's §4 explorer: Three-Lineage Comparison Chart Analyzer — L2 pattern
  // (chart diagram LEFT + tabbed three-lineage analyzer RIGHT + convergence/divergence toggle).
  "three-lineage-comparison-chart-analyzer": ThreeLineageComparisonChartAnalyzer,
  // Lesson 4.3's §7 flagship: Lineage Matters Synthesis Dojo — two-tab
  // (Integrated Synthesis View + 5-scenario Evaluative Drill).
  "lineage-matters-synthesis-dojo": LineageMattersSynthesisDojo,
  // Lesson 2.1.1's §7 interactive: Zodiac Reference Frame Explorer —
  // Earth-centered diagram showing sidereal vs tropical zodiacs with
  // clickable hotspots (sidereal zero, tropical zero, vernal equinox,
  // summer solstice, ayanāṁśa gap, Spica, Earth's axis, ecliptic,
  // celestial equator).
  "zodiac-reference-frame-explorer": ZodiacReferenceFrameExplorer,
  // Lesson 2.1.2's §7 interactive: Precession Visualizer — clickable SVG
  // diagram with epoch slider, by-hand calculator, and classical-vs-modern
  // comparison tabs.
  "precession-visualizer": PrecessionVisualizer,
  // Lesson 2.1.3's §7 interactive: Zodiac Tradition Reasoning Comparator —
  // side-by-side comparison of Vedic-sidereal vs Western-tropical reasoning
  // across four dimensions (doctrinal, observational, historical, comparative).
  "zodiac-tradition-reasoning-comparator": ZodiacTraditionReasoningComparator,
  "zodiac-tradition-comparator": ZodiacTraditionComparator,
  // Lesson 2.1.4's §7 interactive: Tropical-Sidereal Conversion Calculator —
  // birth-date Sun-sign calculator + longitude converter showing graha-in-rāśi
  // shifts, daśā consequences, and nakṣatra alignment effects.
  "tropical-sidereal-conversion-calculator": TropicalSiderealConversionCalculator,
  // Lesson 2.2.1's §7 interactive: Ayanāṁśa Definition Explorer —
  // 4-tab interactive: Definition (visual gap diagram + conversion calculator),
  // Etymology (Sanskrit compound breakdown), 7 Conventions (comparison table),
  // Stream Matcher (stream → ayanāṁśa mapping).
  "ayanamsha-definition-explorer": AyanamshaDefinitionExplorer,
  "lahiri-ayanamsha-explorer": LahiriAyanamshaExplorer,
  "lahiri-by-hand-step-by-step-calculator": LahiriByHandStepByStepCalculator,
  "krishnamurti-ayanamsha-explorer": KrishnamurtiAyanamshaExplorer,
  // Lesson 2.2.5's §7 interactive: Comparative Ayanāṁśa Explorer — side-by-side
  // comparison of all 7 conventions, convention detail profiles, alignment-epoch
  // timeline, practitioner-community mapping, and multi-ayanāṁśa honesty discipline.
  "comparative-ayanamsha-explorer": ComparativeAyanamshaExplorer,
  // Lesson 2.2.6's §7 interactive: Ayanāṁśa Decision Framework Flowchart —
  // scenario → decision mapping, per-context rules table, multi-lineage synthesis,
  // do-not-mix visualiser, software verification, and Chapter 2 capstone panel.
  "ayanamsha-decision-framework-flowchart": AyanamshaDecisionFrameworkFlowchart,
  // Lesson 2.3.1's §9 interactive: Yuga Proportion Visualiser — three-mode
  // proportional bar visualiser (proportion / absolute-duration / saṁdhyā)
  // with hover/click detail panels and embedded formative checkpoints.
  "yuga-proportion-visualiser": YugaProportionVisualiser,
  // Lesson 2.3.2's §10 interactive: Yuga Cycle Explorer — three-zoom-level
  // visual scrubber (Mahā-Yuga / Manvantara / Kalpa) with human/divya toggle,
  // present-epoch marker, and modern cosmology benchmarks.
  "yuga-cycle-explorer": YugaCycleExplorer,
  // Lesson 2.3.3's §9 interactive: Traditional vs Academic Dating Comparator —
  // three-position side-by-side (Traditional Vedic / Yukteshwar / Academic-Indology)
  // with synthesis honesty dial.
  "traditional-vs-academic-dating-comparator": TraditionalVsAcademicDatingComparator,
  // Lesson 2.3.4's §10 interactive: Yuga Dependence Classifier — scenario-based
  // yuga-dependent vs yuga-independent classification drill with three difficulty levels.
  "yuga-dependence-classifier": YugaDependenceClassifier,
  // Lesson 2.4.1's §9 interactive: Day-Type Comparator — side-by-side comparison
  // of four day-types (sāvana / sidereal / lunar / solar) with operational-scope quiz.
  "day-type-comparator": DayTypeComparator,
  // Lesson 2.4.2's §10 interactive: Sunrise at Any Latitude — 7-step sunrise
  // computation calculator with edge-case detection (polar day/night) and
  // worked-example library (Mumbai, Delhi, Singapore).
  "sunrise-at-any-latitude": SunriseAtAnyLatitude,
  // Lesson 2.4.3's §8 interactive: Sidereal Day Explorer — top-down Earth view
  // with time-scrubber, differential visualisation (~3m 56s), annual accumulation,
  // and operational-context picker.
  "sidereal-day-explorer": SiderealDayExplorer,
  // Lesson 2.4.4's §10 interactive: Tithi from Sun-Moon — longitude scrubbers,
  // circular elongation arc visualisation, tithi computation, variable-duration
  // mode, and edge-case detection (kṣaya/vṛddhi tithi).
  "tithi-from-sun-moon": TithiFromSunMoon,
  // Lesson 2.4.5's §10 interactive: Saṅkrānti Tracker — Sun's annual journey
  // through 12 rāśis with Uttarāyaṇa/Dakṣiṇāyana distinction, sidereal-vs-tropical
  // toggle, multi-century drift visualisation, and festival overlay.
  "sankranti-tracker": SankrantiTracker,
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
  // Lesson 2.5.1's §7 interactive: Samvat Converter — Vikrama ↔ Śaka ↔ CE
  // interactive year-conversion calculator with boundary detection + convention toggles.
  "samvat-converter-vikrama-shaka": SamvatConverterVikramaShaka,
  // Lesson 2.5.2's §7 interactive: Regional Calendar Explorer — side-by-side
  // rendering of Tamil + Kerala + Bengali + Assamese + Odia regional calendars.
  "regional-calendar-explorer": RegionalCalendarExplorer,
  // Lesson 2.5.3's §7 interactive: Calendar Converter — comprehensive cross-system
  // date-conversion across Vikrama / Śaka / Kollam / Gregorian + JDN cross-validation.
  "calendar-converter": CalendarConverter,
  // ─── Module 04: Rāśi System interactives ───
  "rashi-boundary-wheel": RashiBoundaryWheel,
  "boundary-crossing-demonstrator": BoundaryCrossingDemonstrator,
  "rashi-attribute-wheel": RashiAttributeWheel,
  "rashi-modality-classifier": RashiModalityClassifier,
  "kendra-trikona-grouping-visualizer": KendraTrikonaGroupingVisualizer,
  "chart-planet-positioner": ChartPlanetPositioner,
  "rashi-rising-classifier": RashiRisingClassifier,
  "rashi-stream-comparator": RashiStreamComparator,
  "rashi-profile-explorer": RashiProfileExplorer,
  "quadrant-triad-visualizer": QuadrantTriadVisualizer,
  "trikona-pair-explorer": TrikonaPairExplorer,
  // Lesson 5.1.2's §7 interactive: Dignity Wheel — clickable 12-rashi
  // dignity map with degree cues, friendship overlay, and Sun-Moon comparison.
  "dignity-wheel": DignityWheel,
  "budha-dignity-wheel": BudhaDignityWheel,
  "guru-dignity-wheel": GuruDignityWheel,
  "shukra-dignity-wheel": ShukraDignityWheel,
  "shani-dignity-wheel": ShaniDignityWheel,
  "saturn-lesson-mapper": SaturnLessonMapper,
  "shani-aspect-dignity-grid": ShaniAspectDignityGrid,
  "node-geometry": NodeGeometry,
  "node-axis-reader": NodeAxisReader,
  "node-dignity-positions": NodeDignityPositions,
  "upagraha-list": UpagrahaList,
  "gulika-calculator": GulikaCalculator,
  "rahu-amplifier": RahuAmplifier,
  "rahu-ketu-comparator": RahuKetuComparator,
  "jupiter-evaluator": JupiterEvaluator,
  "aspect-caster": AspectCaster,
  "myth-map": MythMap,
  "shukra-friendship-dignity-grid": ShukraFriendshipDignityGrid,
  "association-classifier": AssociationClassifier,
  "combustion-calculator": CombustionCalculator,
  // Lesson 5.1.4's §7 interactive: Friendship Matrix — directed graha
  // relationship grid with mirror-cell comparison and Sun-Moon polarity axes.
  "friendship-matrix": FriendshipMatrix,
  // Lesson 5.1.5's §7 interactive: Pakshabala Slider — tithi scrubber with
  // inverse Sun/Moon virupa bars and a dignity-combination preview.
  "pakshabala-slider": PakshabalaSlider,
  // Lesson 5.2.2's §7 interactive: Karaka Router — question-driven Mars
  // register selector with house-side confirmation and tie-breaker feedback.
  "karaka-router": KarakaRouter,
  // Lesson 5.2.3's §7 interactive: Friendship Dignity Grid — Mars across
  // the 12 signs with sign-lord relation, degree control, and dignity override.
  "friendship-dignity-grid": FriendshipDignityGrid,
  "mula-root-mandala": MulaRootMandala,
  "purva-ashadha-relationship-map": PurvaAshadhaRelationshipMap,
  "uttara-ashadha-attribute-universe": UttaraAshadhaAttributeUniverse,
  "shravana-dhanishtha-concept-constellation": ShravanaDhanishthaConceptConstellation,
  "shatabhishaj-bhadrapada-knowledge-galaxy": ShatabhishajBhadrapadaKnowledgeGalaxy,
  "revati-constellation-diagram": RevatiConstellationDiagram,
  "anuradha-devotion-network": AnuradhaDevotionNetwork,
  "ashlesha-honest-handling-dojo": AshleshaHonestHandlingDojo,
  "chitra-celestial-gem-lab": ChitraCelestialGemLab,
  "gandanta-water-fire-junction": GandantaWaterFireJunction,
  "jyeshtha-supremacy-talisman": JyeshthaSupremacyTalisman,
  "magha-ancestral-gateway-lab": MaghaAncestralGatewayLab,
  "nakshatra-profile": NakshatraProfile,
  "nakshatra-template-lab": NakshatraTemplateLab,
  "purva-uttara-doctrine-explorer": PurvaUttaraDoctrineExplorer,
  "pushya-auspiciousness-lab": PushyaAuspiciousnessLab,
  "swati-breeze-navigator": SwatiBreezeNavigator,
  "vishakha-forked-path-explorer": VishakhaForkedPathExplorer,
  "pada-calculator": PadaCalculator,
  "pada-navamsha-mapper": PadaNavamshaMapper,
  "kp-sub-calculator": KpSubCalculator,
  "tara-bala-wheel": TaraBalAWheel,
  "stream-comparison-table": StreamComparisonTable,
};

export function resolveInteractive(slug: string | undefined): InteractiveComponentType | null {
  if (!slug) return null;
  return INTERACTIVE_REGISTRY[slug] ?? null;
}
