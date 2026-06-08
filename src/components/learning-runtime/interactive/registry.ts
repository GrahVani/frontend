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
import { TamkalikaWheel } from "./tamkalika-wheel";
import { PanchadhaCombiner } from "./panchadha-combiner";
import { AvasthaPanel } from "./avastha-panel";
import { StreamComparator } from "./stream-comparator";
import { BhavaWheel } from "./bhava-wheel";
import { HouseSystemComparator } from "./house-system-comparator";
import { BhavaTemplateCard } from "./bhava-template-card";
import { BhavaProfile } from "./bhava-profile";
import { PreliminaryReadingFlow } from "./preliminary-reading-flow";
import { KarakaTable } from "./karaka-table";
import { NakshatraProfile } from "./nakshatra-profile";
import { PadaNavamshaMapper } from "./pada-navamsha-mapper";
import { SubLordCalculator } from "./sub-lord-calculator";
import { TaraBalaWheel } from "./tara-bala-wheel";
import { StreamComparisonTable } from "./stream-comparison-table";
import { GrahaDrishtiWheel } from "./graha-drishti-wheel";
import { DrishtiStrengthMeter } from "./drishti-strength-meter";
import { RashiDrishtiGrid } from "./rashi-drishti-grid";
import { AspectDoctrineComparator } from "./aspect-doctrine-comparator";
import { TajikaOrbCalculator } from "./tajika-orb-calculator";
import { TajikaApplyingSeparating } from "./tajika-applying-separating";
import { TajikaYogaGlossary } from "./tajika-yoga-glossary";
import { VarshaphalaOverview } from "./varshaphala-overview";
import { SaturnAspectDisambiguator } from "./saturn-aspect-disambiguator";
import { DoctrineSelector } from "./doctrine-selector";
import { PmpyDetector } from "./pmpy-detector";
import { LunarYogaDetector } from "./lunar-yoga-detector";
import { KemadrumaChecker } from "./kemadruma-checker";
import { GajaKesariDetector } from "./gaja-kesari-detector";
import { BudhadityaChecker } from "./budhaditya-checker";
import { VargaExplainer } from "./varga-explainer";
import { VargaTemplateCard } from "./varga-template-card";
import { HoraCalculator } from "./hora-calculator";
import { DrekkanaCalculator } from "./drekkana-calculator";
import { DrekkanaSystemComparator } from "./drekkana-system-comparator";
import { ChaturthamshaCalculator } from "./chaturthamsha-calculator";
import { SaptamshaCalculator } from "./saptamsha-calculator";
import { RashiNavamshaPair } from "./rashi-navamsha-pair";
import { DashamshaCalculator } from "./dashamsha-calculator";
import { DvadashamshaCalculator } from "./dvadashamsha-calculator";
import { ShodashamshaCalculator } from "./shodashamsha-calculator";
import { MultiVargaComparator } from "./multi-varga-comparator";
import { VimshamshaCalculator } from "./vimshamsha-calculator";
import { ChaturvimshamshaCalculator } from "./chaturvimshamsha-calculator";
import { SaptavimshamshaCalculator } from "./saptavimshamsha-calculator";
import { SpiritualTrioComparator } from "./spiritual-trio-comparator";
import { TrimshamshaCalculator } from "./trimshamsha-calculator";
import { KhavedamshaAkshavedamshaCalculator } from "./khavedamsha-akshavedamsha-calculator";
import { EthicalRoutingChecklist } from "./ethical-routing-checklist";
import { ShashtyamshaCalculator } from "./shashtyamsha-calculator";
import { D1D60Comparator } from "./d1-d60-comparator";
import { SubstrateEthicsChecklist } from "./substrate-ethics-checklist";
import { VimshopakaCalculator } from "./vimshopaka-calculator";
import { MarriageVargaWorkflow } from "./marriage-varga-workflow";
import { CareerVargaWorkflow } from "./career-varga-workflow";
import { ChildrenVargaWorkflow } from "./children-varga-workflow";
import { PakshabalaSlider } from "./pakshabala-slider";
import { KarakaRouter } from "./karaka-router";
import { FriendshipDignityGrid } from "./friendship-dignity-grid";

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
  // Lesson 5.8.4's §7 interactive: Tāmkālika Wheel — places a reference planet at
  // house 1, shades friend houses (2/3/4/10/11/12) and enemy houses (1/5/6/7/8/9),
  // and reads the always-mutual temporary relationship of a dropped second planet.
  "tamkalika-wheel": TamkalikaWheel,
  // Lesson 5.8.5's §7 interactive: Pañcadhā Combiner — a 3×2 decision matrix
  // combining the naisargika (fixed) and tāmkālika (temporary) layers into the
  // five tiers (adhimitra/mitra/sama/śatru/adhiśatru), lighting the resulting cell.
  "panchadha-combiner": PanchadhaCombiner,
  // Lesson 5.8.6's §7 interactive: Avasthā Panel — sets a planet's motion,
  // distance from the Sun, and degree-in-sign, and reports motion state, combustion
  // (correct orbs: Moon12/Mars17/Merc14[12R]/Jup11/Ven10[8R]/Sat15), and age-state.
  "avastha-panel": AvasthaPanel,
  // Lesson 5.8.7's §7 interactive: Stream Comparator — lays the five streams
  // (Parāśari/Jaimini/KP/Lal Kitab/Tājika) side by side, contrasts a sample
  // placement (Mars in 1st) by Parāśari vs Lal Kitab, with name-the-stream + Tier-1 toggles.
  "stream-comparator": StreamComparator,
  // Lesson 6.1.1's §7 interactive: Bhāva Wheel — a 12-house wheel anchored to a
  // selectable Lagna; shows each bhāva's domain + current sign, places a sample
  // planet (its house shifts with the Lagna), and highlights a house from a life-area question.
  "bhava-wheel": BhavaWheel,
  // Lesson 6.1.2's §7 interactive: House-System Comparator — one planet in the
  // rising sign shown by whole-sign / equal-house / Sripati (lagna-degree = midpoint),
  // with Placidus deferred to Ch7; flags when the systems split near a boundary.
  "house-system-comparator": HouseSystemComparator,
  // Lesson 6.1.3's §7 interactive: Bhāva Template Card — the 10-attribute / 4-group
  // scaffold each house lesson fills, with the 1st house pre-filled as the model, a
  // house switcher (identity + computed classifications), and a per-graha-template
  // toggle showing the 5 dropped (planet-only) attributes.
  "bhava-template-card": BhavaTemplateCard,
  // Lessons 6.2.1–6.5.3's §7 interactive: Bhāva Profile — a SHARED per-house card
  // driven by the lesson slug (Nth-bhava-*); shows that house's ten attributes
  // (computed classifications), a house-lord mover ("matters go where the lord goes"),
  // and a benefic/malefic drop. One component serves all 12 per-house lessons.
  "bhava-profile": BhavaProfile,
  // Lesson 6.2.4's §7 interactive: Preliminary Reading Flow — the two-step opening
  // pass: (1) set Lagna + Lagneśa house for the baseline, (2) drop a malefic into a
  // house and read it by nature (upachaya 3/6/10/11 = grows; gentle houses = disrupts).
  "preliminary-reading-flow": PreliminaryReadingFlow,
  // Lesson 6.6.4's §7 interactive: Kāraka Table — the 12-house naisargika-kāraka
  // table with graha-highlight (Jupiter 2/5/9/11, Saturn 6/8/10/12), a gender toggle
  // for the 7th (Venus man's / Jupiter woman's), and a pick-a-house lord+kāraka read.
  "karaka-table": KarakaTable,
  // Module 7's per-nakṣatra profile lessons' §7 interactive: a SHARED slug-driven
  // reference card reading nakshatra-data.ts (nakṣatra resolved from the lesson slug),
  // showing the 12 attributes with the Vimśottarī lord highlighted; one component
  // serves all ~24 per-nakṣatra profile lessons. Degree-span + rāśi are derived.
  "nakshatra-profile": NakshatraProfile,
  // Lesson 7.6.2's §7 interactive: the 108-cell pāda→navāṁśa mapper (27 nakṣatras × 4 pādas
  // = 108 = 12 signs × 9 navāṁśas). Pick a nakṣatra+pāda → highlights its navāṁśa sign;
  // vargottama (rāśi=navāṁśa) cells flagged. All derived (navāṁśa = SIGNS[k%12], k=(N-1)*4+(p-1)).
  "pada-navamsha-mapper": PadaNavamshaMapper,
  // Lesson 7.6.3 (KP 249) + Module 16's KP stream §7 interactive: enter a longitude →
  // the KP lord-chain sign-lord → star-lord (nakṣatra) → sub-lord, with the nakṣatra's
  // nine Vimśottarī-proportioned subs and the active sub flagged. All derived. Shared component.
  "sub-lord-calculator": SubLordCalculator,
  // Lesson 7.6.4's §7 interactive: Tāra Bala wheel — pick a Janma nakṣatra → the 9-tāra cycle
  // across all 27 (favourable/unfavourable/mixed, the 3rd/5th/7th flagged), plus a STATIC
  // Aṣṭakūṭa 8-kūṭa point reference (36 total). Tāra is derived; the kūṭa scoring grids
  // (yoni/gaṇa/nāḍī/bhakūṭa) are intentionally NOT computed here (reference only).
  "tara-bala-wheel": TaraBalaWheel,
  // Lesson 7.6.5's §7 (Module-7 capstone): how each of the five streams (Parāśari/Jaimini/KP/
  // Lal Kitab/Tājika) uses the nakṣatra — select a stream → its resolution/usage + forward module.
  // Distinct from the M5-hardcoded `stream-comparator` (a graha comparison). Content from §4.1.
  "stream-comparison-table": StreamComparisonTable,
  // Module 8 Chapter 1's §7 interactive (graha-dṛṣṭi): place ANY of the 9 grahas in any house →
  // its full 7th aspect highlighted on the 12-house wheel, plus the special aspects (Mars 4/8,
  // Jupiter 5/9, Saturn 3/10) and the planet's benefic/malefic nature. Serves 8.1.1-8.1.4.
  // (Distinct from the Guru-only `aspect-caster`, which is hardcoded to Lesson 5.4.3.)
  "graha-drishti-wheel": GrahaDrishtiWheel,
  // Lesson 8.1.4's §7 interactive: the graded virūpa aspect-strength meter. Place any graha →
  // its dṛṣṭi strength on each house (7th=full/60, 4·8=¾/45, 5·9=½/30, 3·10=¼/15), with the
  // Mars/Jupiter/Saturn special-aspect partial→full upgrade. All derived from the BPHS gradation (no engine).
  "drishti-strength-meter": DrishtiStrengthMeter,
  // Module 8 Chapter 2's §7 interactive (Jaimini rāśi-dṛṣṭi): pick a rāśi → the 3 signs it aspects
  // by modality (movable→fixed-except-adjacent, fixed→movable-except-adjacent, dual→other-duals),
  // the skipped adjacent sign greyed. Sign-to-sign (NOT planet-to-house). All derived. Serves 8.2.1-8.2.4.
  "rashi-drishti-grid": RashiDrishtiGrid,
  // Lesson 8.2.4's §7 (rāśi-dṛṣṭi vs graha-dṛṣṭi contrast): one planet+sign → the signs it aspects
  // under EACH doctrine side by side (graha = 7th+specials in whole-sign terms; rāśi = sign modality),
  // each sign tagged both/graha-only/rāśi-only/neither. All derived, no engine.
  "aspect-doctrine-comparator": AspectDoctrineComparator,
  // Module 8 Chapter 3's §7 (Tājika degree-orb): two grahas + separation → nearest aspect-angle,
  // gap-from-exact, the combined orb (half-sum of the two dīptāṁśas: Sun15/Moon12/Mars8/Mer7/Jup9/Ven7/Sat9),
  // and whether the aspect forms within orb. Derived, no engine. The annual-chart lens (deep Tājika = M19).
  "tajika-orb-calculator": TajikaOrbCalculator,
  // Lesson 8.3.2's §7: the faster graha applies toward exact (Itthaśāla = forming) then crosses
  // and separates (Īsarāpha = fading); within-orb prerequisite; retrograde inverts which side
  // is approaching. Faster = earlier in the daily-motion order (Moon…Saturn). Derived, no engine.
  "tajika-applying-separating": TajikaApplyingSeparating,
  // Lesson 8.3.3's §7: a flip-card glossary of the 16 Tājika yogas (ṣoḍaśa-yoga) using the lesson's
  // OWN §4.2 glosses verbatim — foundational four (Itthaśāla/Iśrāf/Nakta/Yamayā) highlighted, the
  // rest flagged → Module 19. No added/fabricated mechanics. Static reference, no engine.
  "tajika-yoga-glossary": TajikaYogaGlossary,
  // Lesson 8.3.4's §7 (Tājika in annual-chart context): the Muntha (the one purely-positional
  // element — advances one sign/year from the natal Lagna, Muntha = (lagna+age) mod 12) on a
  // 12-sign ring + the natal-vs-annual frame contrast. Year-lord/sahams/yoga-timing deferred to M19
  // (not faked). Derived, no engine.
  "varshaphala-overview": VarshaphalaOverview,
  // Lesson 8.4.1's §7: disambiguate "Saturn aspects the 7th" across the THREE doctrines for one
  // Saturn-house + target-house — graha-dṛṣṭi (3/7/10 yes/no), Jaimini rāśi-dṛṣṭi (modality yes/no),
  // and Tājika (degree-orb dependent, annual-only — honest "depends", not faked). Derived, no engine.
  "saturn-aspect-disambiguator": SaturnAspectDisambiguator,
  // Lesson 8.4.2's §7: the which-doctrine-when decision guide — pick a use-case (natal / Jaimini /
  // annual / cross-verify) → the preferred doctrine + rationale + deep-dive module. Fit-for-purpose,
  // never ranked. Static, from §4.1's decision table. No engine.
  "doctrine-selector": DoctrineSelector,
  // Module 8 Chapter 5's §7 (shared 8.5.1-8.5.5): the Pañcamahāpuruṣa-yoga detector — place one of the
  // five tārā-grahas (Mars/Mer/Jup/Ven/Sat) in a sign + house → own/exalted? in a kendra? → which yoga
  // (Rucaka/Bhadra/Haṃsa/Mālavya/Śaśa) or none; afflicted toggle marks a marred yoga. Derived from the
  // dignity tables + kendra rule (Sun/Moon never form one). No engine.
  "pmpy-detector": PmpyDetector,
  // Module 8 Chapter 6's §7 (lunar yogas): place planets in the 2nd/12th-from-Moon (Sun + nodes
  // excluded/greyed) → Sunaphā (2nd) / Anaphā (12th) / Durudharā (both) / Kemadruma (neither, honest
  // detect-don't-pronounce). Derived from occupancy of the Moon's flanks. No engine.
  "lunar-yoga-detector": LunarYogaDetector,
  // Lesson 8.6.2's §7: the Kemadruma-bhaṅga (cancellation) checker — tick any of the common
  // cancellation conditions (planet in kendra from Lagna/Moon, Moon conjunct/aspected, strong Moon);
  // even one cancels. Reinforces care-not-doom: usually cancelled, never a poverty-verdict. Static rules, no engine.
  "kemadruma-checker": KemadrumaChecker,
  // Lesson 8.6.3's §7: Gajakesarī detector — Jupiter's house counted FROM THE MOON ∈ {1,4,7,10}
  // (kendra) → forms; with a Jupiter-dignity toggle for the honest "geometry-vs-condition" caveat.
  // Distinct from the flank-based lunar-yoga-detector. Derived, no engine.
  "gaja-kesari-detector": GajaKesariDetector,
  // Lesson 8.6.4's §7: Budhāditya checker — Sun degree + Mercury offset → same-sign? (yoga forms)
  // and Sun–Mercury gap vs the ~14° (retro ~7°) combustion orb → clean / combust / deeply-combust /
  // dissolved-across-signs. Teaches that a same-sign Mercury is usually at least mildly combust. Derived, no engine.
  "budhaditya-checker": BudhadityaChecker,
  // Module 9 Chapter 1's §7: the varga-concept illustrator — pick a Dn (the 16 ṣoḍaśa-varga) + a degree
  // → which part (of n) the planet lands in + the domain Dn magnifies. Equal 30/n° parts, EXCEPT D30
  // (unequal 5/5/8/7/5). Per-varga sign-mapping rules are deferred to their own lessons. Derived, no engine.
  "varga-explainer": VargaExplainer,
  // Lesson 9.1.3's §7: the per-varga template card — the 8-attribute scaffold (name+meaning, subdivision,
  // computation, jurisdiction, workflow, cross-refs, errors, example), with attrs 1/2/4 pre-filled per
  // varga (D7/D9/D10/D12) + a read-alongside-D1 overlay. Mirrors bhava-template-card. Derived, no engine.
  "varga-template-card": VargaTemplateCard,
  // Lesson 9.2.2's §7: the D2 Horā calculator — sign (odd/even) + degree (</≥15°) → Sun's horā (Leo)
  // or Moon's horā (Cancer). Odd sign: 1st half Sun/Leo, 2nd Moon/Cancer; even sign reversed. Derived, no engine.
  "hora-calculator": HoraCalculator,
  // Lesson 9.2.3's §7: the D3 Drekkāṇa calculator — sign + degree → decanate (1st/2nd/3rd) → same /
  // 5th-from / 9th-from sign (the 1/5/9 trinal Parāśarī rule, same element) + deity + siblings domain. Derived, no engine.
  "drekkana-calculator": DrekkanaCalculator,
  // Lesson 9.2.4's §7: the three-drekkāṇa-system comparator — sign+degree → the D3 sign under Parāśarī
  // (1/5/9) vs Jaimini (1/7/5, one tradition) side-by-side, with Somanātha (sequential) deferred-not-faked;
  // flags where the systems diverge. Name-the-system discipline. Derived, no engine.
  "drekkana-system-comparator": DrekkanaSystemComparator,
  // Lesson 9.3.1's §7: the D4 Chaturthāṁśa calculator — sign+degree → quarter (7°30′) → the 4 kendras
  // from the sign (same/4th/7th/10th, offsets [0,3,6,9]) + property/home domain. Derived, no engine.
  "chaturthamsha-calculator": ChaturthamshaCalculator,
  // Lesson 9.3.2's §7: the D7 Saptāṁśa calculator — sign(odd/even) + degree → part 1-7 (≈4°17′) →
  // destination (odd: count from the sign; even: from its 7th) + children/Jupiter domain. Derived, no engine.
  "saptamsha-calculator": SaptamshaCalculator,
  // Lesson 9.3.5's §7: the D9-as-strength-test matrix — toggle a planet's D1 (promise) and D9 (delivery)
  // dignity → the four outcomes (delivers / promised-not-delivered / recovery / consistently-weak). Pure §4.2
  // doctrine, no chart data. Care-not-doom. Derived, no engine.
  "rashi-navamsha-pair": RashiNavamshaPair,
  // Lesson 9.4.1's §7: the D10 Daśāṁśa calculator — sign(odd/even) + degree → part 1-10 (3°) → destination
  // (odd: count from the sign; even: from its 9th) + career/10th-house domain. Derived, no engine.
  "dashamsha-calculator": DashamshaCalculator,
  // Lesson 9.4.3's §7: the D12 Dvādaśāṁśa calculator — sign + degree → part 1-12 (2°30′) → destination
  // counting from the sign itself for all signs (dest=(sign+part)%12) + parents/ancestry domain. Derived, no engine.
  "dvadashamsha-calculator": DvadashamshaCalculator,
  // Lesson 9.4.4's §7: the D16 Ṣoḍaśāṁśa calculator — sign + degree → part 1-16 (1°52′30″) → destination
  // from a modality start (movable→Meṣa/fixed→Siṁha/dual→Dhanus) + vehicles/comforts domain. Derived, no engine.
  "shodashamsha-calculator": ShodashamshaCalculator,
  // Lesson 9.4.5's §7: the multi-varga synthesis — the §4.2 D10×D16 matrix (career × comforts → 4 quadrants)
  // + a D12 (parents) blessed/afflicted modulator. Abstract strong/weak toggles, no chart data. Derived, no engine.
  "multi-varga-comparator": MultiVargaComparator,
  // Lesson 9.5.1's §7: the D20 Viṁśāṁśa calculator — sign + degree → part 1-20 (1°30′) → destination from a
  // modality start (movable→Meṣa/fixed→Dhanus/dual→Siṁha — START [0,8,4], distinct from D16) + spiritual domain. Derived, no engine.
  "vimshamsha-calculator": VimshamshaCalculator,
  // Lesson 9.5.2's §7: the D24 Chaturviṁśāṁśa (Siddhāṁśa) calculator — sign + degree → part 1-24 (1°15′) →
  // destination from odd→Siṁha(4)/even→Karka(3) + education domain. Standard floor (examples use interior degrees). Derived, no engine.
  "chaturvimshamsha-calculator": ChaturvimshamshaCalculator,
  // Lesson 9.5.3's §7: the D27 Saptaviṁśāṁśa (Bhāṁśa) calculator — sign + degree → part 1-27 (1°06′40″) →
  // destination. DEFAULT rule = universal-Meṣa start (the lesson's stated rule); optional element-start toggle
  // (fire→Meṣa/earth→Karka/air→Tulā/water→Makara). Strength/stamina domain. Derived, no engine.
  "saptavimshamsha-calculator": SaptavimshamshaCalculator,
  // Lesson 9.5.4's §7: the spiritual-trio synthesis — three abstract strong/weak toggles for D20 (practice),
  // D27 (vehicle/stamina), D60 (karmic substrate) → the §4.1 synthesis read. Capacity-not-guarantee, no chart data. Derived, no engine.
  "spiritual-trio-comparator": SpiritualTrioComparator,
  // Lesson 9.6.2's §7: the D30 Triṁśāṁśa calculator — the ONE unequal varga. Degree → which of 5 unequal
  // tārā-graha segments (odd 5/5/8/7/5 Mars→Venus / even 5/7/8/5/5 Venus→Mars) → ruling graha → its own-sign.
  // No luminaries/nodes; tendency-map-not-verdict. Derived, no engine.
  "trimshamsha-calculator": TrimshamshaCalculator,
  // Lesson 9.6.3's §7: the lineage vargas — D40 Khavedāṁśa (40×0°45′, odd→Meṣa/even→Tulā, maternal) and
  // D45 Akṣavedāṁśa (45×0°40′, movable→Meṣa/fixed→Siṁha/dual→Dhanus, paternal) via a mode toggle. Derived, no engine.
  "khavedamsha-akshavedamsha-calculator": KhavedamshaAkshavedamshaCalculator,
  // Lesson 9.6.4's §7: the ethical-routing checklist — the §4.1 four hard boundaries + scenario cards showing
  // the unsafe framing vs the honest vigilance-framed + referral response (triple-care). Care-not-doom. Static, no engine.
  "ethical-routing-checklist": EthicalRoutingChecklist,
  // Lesson 9.7.1's §7: the D60 Ṣaṣṭyāṁśa calculator — within-sign degree → index 1-60 (= ⌊deg×2⌋+1, 0°30′ parts)
  // + band + the precision-demand flip near a boundary. Name/quality/rāśi are recognition-level (NOT fabricated). Derived, no engine.
  "shashtyamsha-calculator": ShashtyamshaCalculator,
  // Lesson 9.7.2's §7: the D1↔D60 doctrine illustrator — D1=WHAT (events) vs D60=WHY (karmic substrate);
  // abstract supportive/challenging + rectified/uncertain toggles → the substrate-not-destiny reading
  // (modifiable by sādhanā; D60 unreliable on a vague time). No chart data. Derived, no engine.
  "d1-d60-comparator": D1D60Comparator,
  // Lesson 9.7.4's §7: the D60 substrate-ethics checklist — the §4.1 four forbidden malpractices + scenario
  // cards showing the forbidden framing vs the honest empowerment-centred response (substrate-not-destiny,
  // modifiable by sādhanā). The karma-domain sibling of ethical-routing-checklist. Static, no engine.
  "substrate-ethics-checklist": SubstrateEthicsChecklist,
  // Lesson 9.8.1's §7: the Vimśopaka calculator — pick a scheme (Ṣaḍvarga/Saptavarga/Daśavarga, each summing 20)
  // + toggle which vargas the planet is well-placed in → weighted score /20 + band. Weights from L2's tables. Derived, no engine.
  "vimshopaka-calculator": VimshopakaCalculator,
  // Lesson 9.8.4's §7: the marriage four-varga workflow — D1 + D9 (primary) toggles → the §4.2 D1×D9 marriage
  // matrix + D24 (compatibility) and D60 (BTR-gated karmic) layer toggles. Abstract, no chart, care-not-doom. Derived, no engine.
  "marriage-varga-workflow": MarriageVargaWorkflow,
  // Lesson 9.8.5's §7: the career three-varga workflow — D1 + D10 (primary) toggles → the §4.2 D1×D10 career
  // matrix + a D24 (education dimension) toggle. Abstract strong/weak, no chart, not-doom. Derived, no engine.
  "career-varga-workflow": CareerVargaWorkflow,
  // Lesson 9.8.6's §7: the children three-varga workflow — D1 + D7 (primary) toggles → the §4.2 D1×D7 children
  // matrix + a D9 (marriage context) toggle. Abstract strong/weak, no chart, care-not-doom (childlessness never
  // a verdict; refer fertility to doctors; count/timing → Tier-2 T2-06). Derived, no engine.
  "children-varga-workflow": ChildrenVargaWorkflow,
  // Lesson 5.1.5's §7 interactive: Pakshabala Slider — tithi scrubber with
  // inverse Sun/Moon virupa bars and a dignity-combination preview.
  "pakshabala-slider": PakshabalaSlider,
  // Lesson 5.2.2's §7 interactive: Karaka Router — question-driven Mars
  // register selector with house-side confirmation and tie-breaker feedback.
  "karaka-router": KarakaRouter,
  // Lesson 5.2.3's §7 interactive: Friendship Dignity Grid — Mars across
  // the 12 signs with sign-lord relation, degree control, and dignity override.
  "friendship-dignity-grid": FriendshipDignityGrid,
};

export function resolveInteractive(slug: string | undefined): InteractiveComponentType | null {
  if (!slug) return null;
  return INTERACTIVE_REGISTRY[slug] ?? null;
}
