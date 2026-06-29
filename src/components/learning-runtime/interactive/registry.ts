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
import { JaiminiTraditionMap } from "./jaimini-tradition-map";
import { SutraInterpretationLab } from "./sutra-interpretation-lab";
import { JaiminiInterpreterComparator } from "./jaimini-interpreter-comparator";
import { CaraKarakaRanker } from "./cara-karaka-ranker";
import { CaraKarakaRoleAssigner } from "./cara-karaka-role-assigner";
import { AtmakarakaKingLens } from "./atmakaraka-king-lens";
import { KarakaCrossValidation } from "./karaka-cross-validation";
import { CaraDashaMechanism } from "./cara-dasha-mechanism";
import { CaraPeriodCalculator } from "./cara-period-calculator";
import { CaraSequenceBuilder } from "./cara-sequence-builder";
import { CaraDashaTimeline } from "./cara-dasha-timeline";
import { DualDashaTimeline } from "./dual-dasha-timeline";
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
import { PanchangaFiveLimbFramework } from "./panchanga-five-limb-framework";
import { MuhurtaTextCorpusNavigator } from "./muhurta-text-corpus-navigator";
import { MuhurtaComparativePositionExplorer } from "./muhurta-comparative-position-explorer";
import { TithiClassificationExplorer } from "./tithi-classification-explorer";
import { VaraLordEffectsExplorer } from "./vara-lord-effects-explorer";
import { NakshatrasCategorizedExplorer } from "./nakshatras-categorized-explorer";
import { TithiDeityWheel } from "./tithi-deity-wheel";
import { TithiContextMatcher } from "./tithi-context-matcher";
import { ShuklaTithiStrip } from "./shukla-tithi-strip";
import { KrishnaFestivalTimeline } from "./krishna-festival-timeline";
import { NandaBhadraClassifier } from "./nanda-bhadra-classifier";
import { AmantaPurnimantaConverter } from "./amanta-purnimanta-converter";
import { M23Closure } from "./m23-closure";
import { MuhurtaConceptScope } from "./muhurta-concept-scope";
import { MuhurtaDecisionFramework } from "./muhurta-decision-framework";
import { MuhurtaHonestHandling } from "./muhurta-honest-handling";
import { TithiMuhurtaIntroductoryJudgment } from "./tithi-muhurta-introductory-judgment";
import { VaraGrahaWheel } from "./vara-graha-wheel";
import { ChaldeanPlanetaryHoraExplorer } from "./chaldean-planetary-hora-explorer";
import { ChaldeanLetterTableExplorer } from "./chaldean-letter-table-explorer";
import { PythagoreanLetterTableExplorer } from "./pythagorean-letter-table-explorer";
import { VedicAnkaLetterTableExplorer } from "./vedic-anka-letter-table-explorer";
import { NumerologySystemSelection } from "./numerology-system-selection";
import { DigitMeaningExplorer } from "./digit-meaning-explorer";
import { MasterNumberExplorer } from "./master-number-explorer";
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
import { AngularHouseClassifier } from "./angular-house-classifier";
import { QualityHouseClassifier } from "./quality-house-classifier";
import { PurusharthaTrineExplorer } from "./purushartha-trine-explorer";
import { KarakaTable } from "./karaka-table";
import { KarakaTenancyLab } from "./karaka-tenancy-lab";
import { BhavatBhavamDrill } from "./bhavat-bhavam-drill";
import { BhavaChalitaRefinement } from "./bhava-chalita-refinement";
import { PlacidusKpConvention } from "./placidus-kp-convention";
import { BhavaMadhyaSandhi } from "./bhava-madhya-sandhi";
import { HouseSystemDecisionFramework } from "./house-system-decision-framework";
import { LalKitabFixedAriesLagna } from "./lal-kitab-fixed-aries-lagna";
import { LalKitabTraditionExplorer } from "./lal-kitab-tradition-explorer";
import { LalKitabFarmanTimeline } from "./lal-kitab-farman-timeline";
import { LalKitabClassicalComparator } from "./lal-kitab-classical-comparator";
import { LalKitabStatusAndEthicsExplorer } from "./lal-kitab-status-and-ethics-explorer";
import { LalKitabTevaDoctrineExplorer } from "./lal-kitab-teva-doctrine-explorer";
import { TevaBuilder } from "./teva-builder";
import { TevaHouseReader } from "./teva-house-reader";
import { LalKitabLuminaryMapper } from "./lal-kitab-luminary-mapper";
import { LalKitabMarsMercuryMapper } from "./lal-kitab-mars-mercury-mapper";
import { LalKitabBeneficSorter } from "./lal-kitab-benefic-sorter";
import { LalKitabShadowTriad } from "./lal-kitab-shadow-triad";
import { LalKitabVarshphalaConcept } from "./lal-kitab-varshphala-concept";
import { LalKitabVarshphalaComputation } from "./lal-kitab-varshphala-computation";
import { LalKitabVarshphalaReading } from "./lal-kitab-varshphala-reading";
import { LalKitabTajikaVarshaphalaComparator } from "./lal-kitab-tajika-varshaphala-comparator";
import { LalKitabUpayaFamilySorter } from "./lal-kitab-upaya-family-sorter";
import { LalKitabEpistemicDisclosureLab } from "./lal-kitab-epistemic-disclosure-lab";
import { LalKitabRemedyDecisionFramework } from "./lal-kitab-remedy-decision-framework";
import { CrossStreamRemedyPlanner } from "./cross-stream-remedy-planner";
import { LalKitabRecognitionLab } from "./lal-kitab-recognition-lab";
import { LalKitabStreamMasteryMap } from "./lal-kitab-stream-mastery-map";
import { TevaLagnaCrossValidator } from "./teva-lagna-cross-validator";
import { LalKitabGrahaClusters } from "./lal-kitab-graha-clusters";
import { BlindPlanetExplorer } from "./blind-planet-explorer";
import { SleepingPlanetExplorer } from "./sleeping-planet-explorer";
import { BurningPlanetExplorer } from "./burning-planet-explorer";
import { PlanetaryStateSynthesizer } from "./planetary-state-synthesizer";
import { MulankaCalculator } from "./mulanka-calculator";
import { BhagyankaCalculator } from "./bhagyanka-calculator";
import { MulankaBhagyankaNamankaCalculator } from "./mulanka-bhagyanka-namanka-calculator";
import { PersonalYearCalculator } from "./personal-year-calculator";
import { NameCorrectionRationaleEvaluator } from "./name-correction-rationale-evaluator";
import { NameCorrectionCandidateCalculator } from "./name-correction-candidate-calculator";
import { NameCorrectionCautionScreener } from "./name-correction-caution-screener";
import { NumerologyHonestHandlingInspector } from "./numerology-honest-handling-inspector";
import { NumerologyCompatibilityCalculator } from "./numerology-compatibility-calculator";
import { BusinessNameNumerologyCalculator } from "./business-name-numerology-calculator";
import { ObjectNumerologyCalculator } from "./object-numerology-calculator";
import { ChartNumerologyIntegrationTool } from "./chart-numerology-integration-tool";
import { NumerologyDecisionFlow } from "./numerology-decision-flow";
import { DisciplineStatementBuilder } from "./discipline-statement-builder";
import { NadiDisciplineStatementBuilder } from "./nadi-discipline-statement-builder";
import { VastuOriginsExplorer } from "./vastu-origins-explorer";
import { VastuPurushaMandalaExplorer } from "./vastu-purusha-mandala-explorer";
import { VastuFiveElementMapper } from "./vastu-five-element-mapper";
import { VastuTextCorpusNavigator } from "./vastu-text-corpus-navigator";
import { VastuCardinalDirectionLords } from "./vastu-cardinal-direction-lords";
import { VastuIntercardinalDoubleQuality } from "./vastu-intercardinal-double-quality";
import { VastuRoomDirectionSynthesizer } from "./vastu-room-direction-synthesizer";
import { VastuEarthWaterAxis } from "./vastu-earth-water-axis";
import { VastuFireAirAxis } from "./vastu-fire-air-axis";
import { VastuBrahmasthanaCenter } from "./vastu-brahmasthana-center";
import { VastuPlotSelectionEvaluator } from "./vastu-plot-selection-evaluator";
import { VastuGroundSlopeEvaluator } from "./vastu-ground-slope-evaluator";
import { VastuHouseShapeEvaluator } from "./vastu-house-shape-evaluator";
import { VastuExtensionsCutsEvaluator } from "./vastu-extensions-cuts-evaluator";
import { VastuRemedyFramework } from "./vastu-remedy-framework";
import { VastuApartmentOfficePlanner } from "./vastu-apartment-office-planner";
import { VastuMirrorRemedyPlanner } from "./vastu-mirror-remedy-planner";
import { VastuHonestHandlingAudit } from "./vastu-honest-handling-audit";
import { VastuDecisionFramework } from "./vastu-decision-framework";
import { VastuChartIntegration } from "./vastu-chart-integration";
import { VastuModuleClosure } from "./vastu-module-closure";
import { VargaExplainer } from "./varga-explainer";
import { VargaReferenceTable } from "./varga-reference-table";
import { VargaTemplateCard } from "./varga-template-card";
import { VargaCalculator } from "./varga-calculator";
import { MultiVargaComparator } from "./multi-varga-comparator";
import { TrimshamshaCalculator } from "./trimshamsha-calculator";
import { EthicalRoutingChecklist } from "./ethical-routing-checklist";
import { ShashtyamshaCalculator } from "./shashtyamsha-calculator";
import { D1D60Comparator } from "./d1-d60-comparator";
import { BirthTimeQualityChecker } from "./birth-time-quality-checker";
import { VimshopakaCalculator } from "./vimshopaka-calculator";
import { VargottamaScanner } from "./vargottama-scanner";
import { D1D9DivergenceReader } from "./d1-d9-divergence-reader";
import { HoraCalculator } from "./hora-calculator";
import { DrekkanaCalculator } from "./drekkana-calculator";
import { DrekkanaSystemComparator } from "./drekkana-system-comparator";
import { NavamshaCalculator } from "./navamsha-calculator";
import { NavamshaReader } from "./navamsha-reader";
import { RashiNavamshaPair } from "./rashi-navamsha-pair";
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
import { TamkalikaWheel } from "./tamkalika-wheel";
import { PanchadhaCombiner } from "./panchadha-combiner";
import { AvasthaPanel } from "./avastha-panel";
import { StreamComparator } from "./stream-comparator";
import { StreamComparisonTable } from "./stream-comparison-table";
import { BhavaWheel } from "./bhava-wheel";
import { HouseSystemComparator } from "./house-system-comparator";
import { BhavaTemplateCard } from "./bhava-template-card";
import { BhavaProfile } from "./bhava-profile";
import { PreliminaryReadingFlow } from "./preliminary-reading-flow";
import { RahuAmplifier } from "./rahu-amplifier";
import { JupiterEvaluator } from "./jupiter-evaluator";
import { AspectCaster } from "./aspect-caster";
import { MythMap } from "./myth-map";
import { ShukraFriendshipDignityGrid } from "./shukra-friendship-dignity-grid";
import { AssociationClassifier } from "./association-classifier";
import { CombustionCalculator } from "./combustion-calculator";
import { FriendshipMatrix } from "./friendship-matrix";
import { PakshabalaSlider } from "./pakshabala-slider";
import { ShadbalaIntro } from "./shadbala-intro";
import { ShadbalaComponents } from "./shadbala-components";
import { ShadbalaGrader } from "./shadbala-grader";
import { UchchabalaCalculator } from "./uchchabala-calculator";
import { SaptavargabalaCalculator } from "./saptavargabala-calculator";
import { OjaYugmaCalculator } from "./oja-yugma-calculator";
import { KendraDrekkanaCalculator } from "./kendra-drekkana-calculator";
import { SthanaBalaSummer } from "./sthana-bala-summer";
import { DikBalaCalculator } from "./dik-bala-calculator";
import { KalaBalaOverview } from "./kala-bala-overview";
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
import { DashaCascadeExplorer } from "./dasha-cascade-explorer";
import { DashaStartFinder } from "./dasha-start-finder";
import { DashaBalanceCalculator } from "./dasha-balance-calculator";
import { DashaBalanceMistakeExplorer } from "./dasha-balance-mistake-explorer";
import { DashaBalanceCrossCheck } from "./dasha-balance-cross-check";
import { DashaTableBuilder } from "./dasha-table-builder";
import { AntardashaTableBuilder } from "./antardasha-table-builder";
import { DashaLookupDrill } from "./dasha-lookup-drill";
import { VimshottariRatioCalculator } from "./vimshottari-ratio-calculator";
import { AshtottariExplorer } from "./ashtottari-explorer";
import { AshtottariConditionChecker } from "./ashtottari-condition-checker";
import { YoginiExplorer } from "./yogini-explorer";
import { DashaClassComparator } from "./dasha-class-comparator";
import { ConditionalDashaCatalog } from "./conditional-dasha-catalog";
import { ConditionalCriteriaChecker } from "./conditional-criteria-checker";
import { DashaDecisionFramework } from "./dasha-decision-framework";
import { KpVimshottariIntro } from "./kp-vimshottari-intro";
import { DashaTimeline } from "./dasha-timeline";
import { DashaSelector } from "./dasha-selector";
import { BhuktiYogaMatrix } from "./bhukti-yoga-matrix";
import { KarakaOverlayReader } from "./karaka-overlay-reader";
import { TwoYesChecker } from "./two-yes-checker";
import { EventReadingWorkbench } from "./event-reading-workbench";
import { CaraDashaIntro } from "./cara-dasha-intro";
import { SthiraDashaIntro } from "./sthira-dasha-intro";
import { KalachakraOverview } from "./kalachakra-overview";
import { ParashariJaiminiChooser } from "./parashari-jaimini-chooser";
import { DashaLandscapeMap } from "./dasha-landscape-map";
import { DrishtiStrengthMeter } from "./drishti-strength-meter";
import { RashiDrishtiGrid } from "./rashi-drishti-grid";
import { AspectDoctrineComparator } from "./aspect-doctrine-comparator";
import { TajikaOrbCalculator } from "./tajika-orb-calculator";
import { TajikaApplyingSeparating } from "./tajika-applying-separating";
import { TajikaYogaGlossary } from "./tajika-yoga-glossary";
import { VarshaphalaOverview } from "./varshaphala-overview";
import { DoctrineSelector } from "./doctrine-selector";
import { MultiStreamChartComparator } from "./multi-stream-chart-comparator";
import { SaturnAspectDisambiguator } from "./saturn-aspect-disambiguator";
import { PmpyDetector } from "./pmpy-detector";
import { PmpyArchetypeExplorer } from "./pmpy-archetype-explorer";
import { PmpyDilutionChecker } from "./pmpy-dilution-checker";
import { PmpyGradeScenario } from "./pmpy-grade-scenario";
import { YogaStrengthOverlay } from "./yoga-strength-overlay";
import { CrossStreamYogaMap } from "./cross-stream-yoga-map";
import { YogaFiringTimeline } from "./yoga-firing-timeline";
import { YogaReadingWorkflow } from "./yoga-reading-workflow";
import { RajaYogaDetector } from "./raja-yoga-detector";
import { DharmaKarmadhipatiDetector } from "./dharma-karmadhipati-detector";
import { RajaYogaVariantsMap } from "./raja-yoga-variants-map";
import { KendraTrikonaRationale } from "./kendra-trikona-rationale";
import { RajaYogaWorkedExample } from "./raja-yoga-worked-example";
import { DhanaYogaDetector } from "./dhana-yoga-detector";
import { DhanaYogaVariantsMap } from "./dhana-yoga-variants-map";
import { RajaDhanaOverlapMap } from "./raja-dhana-overlap-map";
import { DhanaYogaWorkedExample } from "./dhana-yoga-worked-example";
import { RuchakaValourSimulator } from "./ruchaka-valour-simulator";
import { BhadraIntellectExplorer } from "./bhadra-intellect-explorer";
import { HamsaMalavyaSynthesis } from "./hamsa-malavya-synthesis";
import { ShashaAuthorityAnalyzer } from "./shasha-authority-analyzer";
import { LunarYogaDetector } from "./lunar-yoga-detector";
import { KemadrumaChecker } from "./kemadruma-checker";
import { GajakesariSimulator } from "./gajakesari-simulator";
import { BudhadityaChecker } from "./budhaditya-checker";
import { CheshthaBalaCalculator } from "./cheshta-bala-calculator";
import { NaisargikaTable } from "./naisargika-table";
import { NaisargikaRationale } from "./naisargika-rationale";
import { DrkBalaCalculator } from "./drk-bala-calculator";
import { ShadbalaSummation } from "./shadbala-summation";
import { ShadbalaScorecard } from "./shadbala-scorecard";
import { BhavaBalaCalculator } from "./bhava-bala-calculator";
import { ShadbalaBhavabalaSynthesis } from "./shadbala-bhavabala-synthesis";
import { CrossStreamStrengthMap } from "./cross-stream-strength-map";
import { StrengthQualityMatrix } from "./strength-quality-matrix";
import { PakshaYuddhaCalculator } from "./paksha-yuddha-calculator";
import { DikKalaSummer } from "./dik-kala-summer";
import { LakshmiSaraswatiDetector } from "./lakshmi-saraswati-detector";
import { AkhandaSamrajyaChecker } from "./akhanda-samrajya-checker";
import { BuddhadityaGajakesariDetector } from "./buddhaditya-gajakesari-detector";
import { SpecialYogaScan } from "./special-yoga-scan";
import { NeechaBhangaChecker } from "./neecha-bhanga-checker";
import { VipareetaDetector } from "./vipareeta-detector";
import { VipareetaRationale } from "./vipareeta-rationale";
import { VipareetaNeechaScan } from "./vipareeta-neecha-scan";
import { ManglikDetector } from "./manglik-detector";
import { ManglikCancellationChecker } from "./manglik-cancellation-checker";
import { KalaSarpaDetector } from "./kala-sarpa-detector";
import { PitrDoshaIndicator } from "./pitr-dosha-indicator";
import { KemadrumaSadesatiRecap } from "./kemadruma-sadesati-recap";
import { DefearmongeringProtocol } from "./defearmongering-protocol";
import { ArgalaExplorer } from "./argala-explorer";
import { ArgalaConceptExplorer } from "./argala-concept-explorer";
import { PositiveArgala2411 } from "./positive-argala-2-4-11";
import { VirodhargalaCounterIntervention } from "./virodhargala-counter-intervention";
import { ArudhaPadaFinder } from "./arudha-pada-finder";
import { TwelveArudhaPadas } from "./twelve-arudha-padas";
import { ArudhaPadaCalculator } from "./arudha-pada-calculator";
import { ArudhaPadaExplorer } from "./arudha-pada-explorer";
import { ArudhaCaveatLab } from "./arudha-caveat-lab";
import { RashiDrishtiVisualizer } from "./rashi-drishti-visualizer";
import { RashiDrishtiMapper } from "./rashi-drishti-mapper";
import { AkDrishtiSynthesizer } from "./ak-drishti-synthesizer";
import { KarakamshaLagnaLocator } from "./karakamsha-lagna-locator";
import { KarakamshaReader } from "./karakamsha-reader";
import { IshtaDevataFinder } from "./ishta-devata-finder";
import { JaiminiWorkflowWalkthrough } from "./jaimini-workflow-walkthrough";
import { JaiminiModuleClosureMap } from "./jaimini-module-closure-map";
import { GocharaIntro } from "./gochara-intro";
import { NatalRelativeCounter } from "./natal-relative-counter";
import { TransitComputer } from "./transit-computer";
import { ThreeReferenceReader } from "./three-reference-reader";
import { SadeSatiTracker } from "./sade-sati-tracker";
import { SadeSatiPhases } from "./sade-sati-phases";
import { SadeSatiFavourability } from "./sade-sati-favourability";
import { SadeSatiCancellationChecker } from "./sade-sati-cancellation-checker";
import { SadeSatiCommunicationGuide } from "./sade-sati-communication-guide";
import { KantakaShaniReader } from "./kantaka-shani-reader";
import { SaturnTransitMap } from "./saturn-transit-map";
import { GuruTransitReader } from "./guru-transit-reader";
import { GuruSaturnConjunctionReader } from "./guru-saturn-conjunction-reader";
import { NodalTransitTracker } from "./nodal-transit-tracker";
import { NodalAxisHouseReader } from "./nodal-axis-house-reader";
import { EclipseSignificanceChecker } from "./eclipse-significance-checker";
import { EclipseCalendar } from "./eclipse-calendar";
import { VedhaIntro } from "./vedha-intro";
import { VedhaTableLookup } from "./vedha-table-lookup";
import { VedhaApplicator } from "./vedha-applicator";
import { CrossStreamTransitIntro } from "./cross-stream-transit-intro";
import { TransitWorkflowWorkbench } from "./transit-workflow-workbench";
import { CareerVargaWorkflow } from "./career-varga-workflow";
import { ChaturthamshaCalculator } from "./chaturthamsha-calculator";
import { ChaturvimshamshaCalculator } from "./chaturvimshamsha-calculator";
import { ChildrenVargaWorkflow } from "./children-varga-workflow";
import { DashamshaCalculator } from "./dashamsha-calculator";
import { DvadashamshaCalculator } from "./dvadashamsha-calculator";
import { GajaKesariDetector } from "./gaja-kesari-detector";
import { GrahaDrishtiWheel } from "./graha-drishti-wheel";
import { KhavedamshaAkshavedamshaCalculator } from "./khavedamsha-akshavedamsha-calculator";
import { MarriageVargaWorkflow } from "./marriage-varga-workflow";
import { SaptamshaCalculator } from "./saptamsha-calculator";
import { SaptavimshamshaCalculator } from "./saptavimshamsha-calculator";
import { ShodashamshaCalculator } from "./shodashamsha-calculator";
import { SpiritualTrioComparator } from "./spiritual-trio-comparator";
import { SubLordCalculator } from "./sub-lord-calculator";
import { Kp249SubExplorer } from "./249-sub-explorer";
import { SubSubRecursionExplorer } from "./sub-sub-recursion-explorer";
import { SubLordFluencyTrainer } from "./sub-lord-fluency-trainer";
import { SubstrateEthicsChecklist } from "./substrate-ethics-checklist";
import { VimshamshaCalculator } from "./vimshamsha-calculator";
import { AshtakavargaIntro } from "./ashtakavarga-intro";
import { AshtakavargaContributors } from "./ashtakavarga-contributors";
import { ContributionTableDemo } from "./contribution-table-demo";
import { LagnaContributorNote } from "./lagna-contributor-note";
import { BhinnaBuilder } from "./bhinna-builder";
import { BhinnaTotalChecker } from "./bhinna-total-checker";
import { BhinnaInterpreter } from "./bhinna-interpreter";
import { MarsBhinnaWalkthrough } from "./mars-bhinna-walkthrough";
import { SavBuilder } from "./sav-builder";
import { SavChecksum } from "./sav-checksum";
import { SavInterpreter } from "./sav-interpreter";
import { TrikonaReducer } from "./trikona-reducer";
import { EkadhipatyaReducer } from "./ekadhipatya-reducer";
import { ReductionOrderDemo } from "./reduction-order-demo";
import { FullReductionWalkthrough } from "./full-reduction-walkthrough";
import { YogaSavAuditor } from "./yoga-sav-auditor";
import { TransitBavModulator } from "./transit-bav-modulator";
import { AshtakavargaStreamMap } from "./ashtakavarga-stream-map";
import { KarmaFrameworkMap } from "./karma-framework-map";
import { PrarabdhaIllustration } from "./prarabdha-illustration";
import { MitigationVsCure } from "./mitigation-vs-cure";
import { RemedyAuthorityMap } from "./remedy-authority-map";
import { MantraTheoryExplainer } from "./mantra-theory-explainer";
import { MantraTraditionsMap } from "./mantra-traditions-map";
import { FoundationalMantraPlayer } from "./foundational-mantra-player";
import { MantraSafetyChecklist } from "./mantra-safety-checklist";
import { GrahaYantraGallery } from "./graha-yantra-gallery";
import { TantraContextNote } from "./tantra-context-note";
import { YantraAnatomy } from "./yantra-anatomy";
import { NavaratnaTable } from "./navaratna-table";
import { UparatnaTable } from "./uparatna-table";
import { GemstoneSafetyChecklist } from "./gemstone-safety-checklist";
import { ProtectiveDisciplineChecklist } from "./protective-discipline-checklist";
import { GrahaDanaTable } from "./graha-dana-table";
import { UpavasaGuide } from "./upavasa-guide";
import { PujaVrataGuide } from "./puja-vrata-guide";
import { CrossCulturalCareGuide } from "./cross-cultural-care-guide";
import { RemedyMatchingExplorer } from "./remedy-matching-explorer";
import { LalKitabUpayaIntro } from "./lal-kitab-upaya-intro";
import { RestraintDoctrineCard } from "./restraint-doctrine-card";
import { KPLineageTimeline } from "./kp-lineage-timeline";
import { KPReaderSeriesExplorer } from "./kp-reader-series-explorer";
import { KPPrecisionResolutionComparator } from "./kp-precision-resolution-comparator";
import { KpCuspCalculator } from "./kp-cusp-calculator";
import { KpVsParashariCuspComparator } from "./kp-vs-parashari-cusp-comparator";
import { KpCuspVerifier } from "./kp-cusp-verifier";
import { CuspalSubLordFinder } from "./cuspal-sub-lord-finder";
import { CuspalSubLordVisualizer } from "./cuspal-sub-lord-visualizer";
import { PlanetSubLordModulator } from "./planet-sub-lord-modulator";
import { DispositionRulesWorkbench } from "./disposition-rules-workbench";
import { RulingPlanetsRoleExplorer } from "./ruling-planets-role-explorer";
import { RulingPlanetsCalculator } from "./ruling-planets-calculator";
import { RulingPlanetsConfirmationWorkbench } from "./ruling-planets-confirmation-workbench";
import { SignificatorHierarchyExplorer } from "./significator-hierarchy-explorer";
import { FirstOrderSignificatorVisualizer } from "./first-order-significator-visualizer";
import { SecondOrderSignificatorWorkbench } from "./second-order-significator-workbench";
import { SignificatorChainBuilder } from "./significator-chain-builder";
import { KpHoraryNumberSelector } from "./kp-horary-number-selector";
import { KpHoraryChartCaster } from "./kp-horary-chart-caster";
import { KpHoraryCuspalVerdict } from "./kp-horary-cuspal-verdict";
import { KpHoraryMarriageWorkbench } from "./kp-horary-marriage-workbench";
import { KpHoraryJobWorkbench } from "./kp-horary-job-workbench";
import { KpHoraryStreamComparator } from "./kp-horary-stream-comparator";
import { KpParashariSideBySide } from "./kp-parashari-side-by-side";
import { KpParashariConvergences } from "./kp-parashari-convergences";
import { KpParashariDivergences } from "./kp-parashari-divergences";
import { KpCrossStreamRouter } from "./kp-cross-stream-router";
import { KpModifiedVimshottariExplorer } from "./kp-modified-vimshottari-explorer";
import { KpSynthesisCapstone } from "./kp-synthesis-capstone";
import { TajikaOriginsTimeline } from "./tajika-origins-timeline";
import { TajikaNeelakanthiStructure } from "./tajika-neelakanthi-structure";
import { TajikaTextsCatalogue } from "./tajika-texts-catalogue";
import { TajikaComparativeMatrix } from "./tajika-comparative-matrix";
import { TajikaIthasalaExplorer } from "./tajika-ithasala-explorer";
import { TajikaThreeYogaComparator } from "./tajika-three-yoga-comparator";
import { TajikaTwelveYogasSurveyor } from "./tajika-twelve-yogas-surveyor";
import { TajikaYogasApplicationWizard } from "./tajika-yogas-application-wizard";
import { TajikaSahamConceptExplorer } from "./tajika-saham-concept-explorer";
import { TajikaAuspiciousSahamsComparator } from "./tajika-auspicious-sahams-comparator";
import { TajikaLifeEventSahamsSurveyor } from "./tajika-life-event-sahams-surveyor";
import { TajikaSahamsApplicationWizard } from "./tajika-sahams-application-wizard";
import { TajikaMunthaConceptExplorer } from "./tajika-muntha-concept-explorer";
import { TajikaVarsheshaSelector } from "./tajika-varshesha-selector";
import { TajikaVarshaphalaCaster } from "./tajika-varshaphala-caster";
import { TajikaVarshaphalaSynthesizer } from "./tajika-varshaphala-synthesizer";
import { TajikaPrashnaConceptExplorer } from "./tajika-prashna-concept-explorer";
import { TajikaPrashnaJudgmentMethodology } from "./tajika-prashna-judgment-methodology";
import { TajikaVsKpHoraryComparator } from "./tajika-vs-kp-horary-comparator";
import { TajikaCrossStreamSynthesis } from "./tajika-cross-stream-synthesis";
import { TajikaHonestHandling } from "./tajika-honest-handling";
import { M19Closure } from "./m19-closure";
import { EvidentiaryLayers } from "./evidentiary-layers";
import { ManuscriptMaterialMap } from "./manuscript-material-map";
import { SchoolComparator } from "./school-comparator";
import { StreamPositionMap } from "./stream-position-map";
import { BhriguFlow } from "./bhrigu-flow";
import { AgastyaFlow } from "./agastya-flow";
import { SublineageMap } from "./sublineage-map";
import { GranthaAccessibilityMap } from "./grantha-accessibility-map";
import { MatchingProtocolFlow } from "./matching-protocol-flow";
import { SessionFlow } from "./session-flow";
import { KandaMap } from "./kanda-map";
import { ShlokaDecoder } from "./shloka-decoder";
import { ReaderDueDiligence } from "./reader-due-diligence";
import { NadiVerificationSandbox } from "./nadi-verification-sandbox";
import { NadiCommercialExplorer } from "./nadi-commercial-explorer";
import { NadiDecisionFramework } from "./nadi-decision-framework";
import { NadiHonestHandlingInstance } from "./nadi-honest-handling-instance";
import { VedangaJyotishaYugaVisualizer } from "./vedanga-jyotisha-yuga-visualizer";
import { ClassicalCanonStratigraphy } from "./classical-canon-stratigraphy";
import { TajikaLoanwordTranslator } from "./tajika-loanword-translator";
import { ModernStreamArchitects } from "./modern-stream-architects";
import { DoNoHarmAhimsa } from "./do-no-harm-ahimsa";
import { TruthWithCompassion } from "./truth-with-compassion";
import { ConfidentialityAuditor } from "./confidentiality";
import { CompetenceBoundaries } from "./competence-boundaries";
import { EmpowermentNotDependency } from "./empowerment-not-dependency";
import { ReasonableFees } from "./reasonable-fees";
import { SessionProtocols } from "./session-protocols";
import { FollowUpBoundaries } from "./follow-up-boundaries";
import { PostTier1ReadingList } from "./post-tier-1-reading-list";
import { CommunityParticipation } from "./community-participation";
import { SelfChartTracking } from "./self-chart-tracking";
import { Tier2Preview } from "./tier-2-preview";
import { Module24SynthesisDojo } from "./24-module-synthesis";
import { PractitionerPledgeSimulator } from "./practitioner-pledge";
import { CurriculumCompletionLedger } from "./curriculum-completion";
import { PathForwardRoadmap } from "./path-forward";
import { VivahaMuhurtaEvaluator } from "./vivaha-muhurta-evaluator";
import { VyaparaArambhMuhurtaEvaluator } from "./vyapara-arambh-muhurta-evaluator";
import { GrihaPraveshaMuhurtaEvaluator } from "./griha-pravesha-muhurta-evaluator";
import { YatraMuhurtaEvaluator } from "./yatra-muhurta-evaluator";
import { PanchakaCancellation } from "./panchaka-cancellation";
import { RahuKalaYamagandaExplorer } from "./rahu-kala-yamaganda-explorer";
import { LagnaSuddhiEvaluator } from "./lagna-suddhi-evaluator";
import { FourPillarIntegrator } from "./four-pillar-integrator";


export type InteractiveComponentType = ComponentType<Record<string, never>>;

export const INTERACTIVE_REGISTRY: Record<string, InteractiveComponentType> = {
  "vedanga-body-map": VedangaBodyMap,
  // The relationship diagram is the FULL version Lesson 2 declares it needs:
  // cluster overlay + Jyotiá¹£a interlocks + sÄá¹…ga closing panel. Lesson 1 still
  // uses the body-map (sage figure with six luminous body parts) â€” its lesson
  // page route renders <VedangaBodyMap/> directly via the `scenes` prop and
  // ignores the registry mapping. Future lessons in this chapter family pick
  // up the relationship diagram via this registry entry.
  "vedanga-relationship-diagram": VedangaRelationshipDiagram,
  "vedanga-vs-vedanta-comparator": VedangaVsVedantaComparator,
  "vedic-ecosystem-orbital": VedicEcosystemOrbital,
  "sloka-recitation-frame": SlokaRecitationFrame,
  // Lesson 2's Â§7 flagship: Jyotiá¹£a-SÄá¹…ga Synthesis Hub (hub-and-spoke
  // interlock viz + sÄá¹…ga scenario explorer in a two-tab composition).
  "jyotisha-sanga-hub": JyotishaSangaHub,
  // Lesson 3's Â§4 explorer: Jyotiá¹£a vs Western tropical vs sun-sign pop
  // comparator â€” six discriminating dimensions Ã— three tradition-categories.
  "jyotisha-vs-western-vs-pop-comparator": JyotishaVsWesternVsPopComparator,
  // Lesson 3's Â§7 flagship: Disambiguation Dojo (Indo-Hellenistic lineage
  // timeline + ayanÄá¹Å›a drift slider + 5-scenario disambiguation drill in
  // a two-tab composition).
  "disambiguation-dojo": DisambiguationDojo,
  // Lesson 4's Â§4 explorer: Karma Typology Explorer â€” 4-fold karma cycle
  // SVG diagram with visibly-clickable karma-type nodes + side-panel
  // active-detail (definition, etymology, properties, jyotiá¹£a-sees,
  // agent-control).
  "karma-typology-explorer": KarmaTypologyExplorer,
  // Lesson 4's Â§7 flagship: Karma-Prediction Dojo (two-tab â€” Cycle in
  // Motion with overlay toggles + Indication Translator skill drill with
  // 5 deterministic-to-indication translation scenarios).
  "karma-prediction-dojo": KarmaPredictionDojo,
  // Lesson 2.1's Â§4 explorer: Historical Timeline â€” horizontal SVG with 12
  // major Jyotiá¹£a authors/texts staggered on the academic-Indology
  // chronological axis. Traditional-dating overlay shows divergences.
  "historical-timeline": HistoricalTimeline,
  // Lesson 2.1's Â§7 flagship: Jyotiá¹£a Citation Dojo (two-tab â€” Dating
  // Divergence Atlas + Citation Discipline Drill with 5 scenarios).
  "jyotisha-citation-dojo": JyotishaCitationDojo,
  // Lesson 2.2's Â§4 explorer: BPHS Recension Comparator â€” ParÄÅ›ara duality
  // diptych + 10 prakaraá¹‡a-plates with Santhanam adhyÄya ranges and
  // cross-recension notes.
  "bphs-recension-comparator": BphsRecensionComparator,
  // Lesson 2.2's Â§7 flagship: BPHS Citation Dojo â€” VimÅ›ottarÄ« verse cross-
  // reference + 5-scenario BPHS citation discipline drill.
  "bphs-citation-dojo": BphsCitationDojo,
  // Lesson 2.3's Â§4 explorer: VarÄhamihira Skandha Coverage Explorer â€”
  // date-anchor hero + 3 skandha plates (horÄ/saá¹hitÄ/gaá¹‡ita) + dating
  // methodology + both-anchors framework comparison diptych.
  "varahamihira-skandha-coverage-explorer": VarahamihiraSkandhaCoverageExplorer,
  // Lesson 2.3's Â§7 flagship: VarÄhamihira Synthesis Dojo â€” author cross-
  // dating (5 authors relative to VarÄhamihira anchor) + 5-scenario drill.
  "varahamihira-synthesis-dojo": VarahamihiraSynthesisDojo,
  // Lesson 2.4's Â§4 explorer: Medieval Codifier Relative-Dating Explorer â€”
  // 3-layer ParÄÅ›ari-tradition lineage + 4 codifier plates + compounding
  // uncertainty visualization.
  "medieval-codifier-relative-dating-explorer": MedievalCodifierRelativeDatingExplorer,
  // Lesson 2.4's Â§7 flagship: Medieval Synthesis Dojo â€” 5-scenario drill
  // on medieval-codifier dating + citation discipline.
  "medieval-synthesis-dojo": MedievalSynthesisDojo,
  // Lesson 2.5's Â§4 explorer: ParÄÅ›ari â‡„ JaiminÄ« Parallel-Tradition Explorer
  // â€” diptych hero + 4-layer side-by-side comparison + sÅ«tra-vs-verse genre
  // + 5 distinctive JaiminÄ« doctrines + same-JaiminÄ« identity question.
  "parashari-jaimini-parallel-tradition-explorer": ParashariJaiminiParallelTraditionExplorer,
  // Lesson 2.5's Â§7 flagship: JaiminÄ« Second-Tradition Dojo â€” two-tab
  // (Doctrinal-Pair Atlas across 6 pairs + 5-scenario tradition-attribution
  // drill).
  "jaimini-second-tradition-dojo": JaiminiSecondTraditionDojo,
  "jaimini-tradition-map": JaiminiTraditionMap,
  "sutra-interpretation-lab": SutraInterpretationLab,
  "jaimini-interpreter-comparator": JaiminiInterpreterComparator,
  "cara-karaka-ranker": CaraKarakaRanker,
  "cara-karaka-role-assigner": CaraKarakaRoleAssigner,
  "atmakaraka-king-lens": AtmakarakaKingLens,
  "karaka-cross-validation": KarakaCrossValidation,
  "cara-dasha-mechanism": CaraDashaMechanism,
  "cara-period-calculator": CaraPeriodCalculator,
  "cara-sequence-builder": CaraSequenceBuilder,
  "cara-dasha-timeline": CaraDashaTimeline,
  "dual-dasha-timeline": DualDashaTimeline,
  // Lesson 2.6's Â§4 explorer: Four-Stream Landscape Explorer â€” hero diptych
  // (4 streams equal-weight) + modern-primary-vs-revival distinction +
  // KP founder plate + 5 KP contributions + Lal Kitab founder plate + 6 LK
  // contributions + 3 modern-primary status criteria.
  "four-stream-landscape-explorer": FourStreamLandscapeExplorer,
  // Lesson 2.6's Â§7 flagship: Four-Stream Synthesis Dojo â€” two-tab
  // (Stream Landscape Matrix with classification-filter + cross-stream topic
  // deep-dive across 4 streams + 5-scenario Evaluative Reasoning Drill).
  // This is the Chapter-2 capstone Bloom-Evaluate practice surface.
  "four-stream-synthesis-dojo": FourStreamSynthesisDojo,
  // Lesson 3.1's Â§4 explorer: Three Skandha Curriculum Map â€” L2 pattern
  // (triangle painting LEFT + clickable skandha rows RIGHT).
  "three-skandha-curriculum-map": ThreeSkandhaCurriculumMap,
  // Lesson 3.1's Â§7 flagship: Three Skandha Synthesis Dojo â€” two-tab
  // (Stream Ã— Skandha Matrix + 5-scenario Evaluative Drill).
  "three-skandha-synthesis-dojo": ThreeSkandhaSynthesisDojo,
  // Lesson 3.2's Â§4 explorer: Seven Sub-Branches Explorer â€” L2 pattern
  // (manuscript diagram LEFT + clickable sub-branch rows RIGHT).
  "seven-sub-branches-explorer": SevenSubBranchesExplorer,
  // Lesson 3.2's Â§7 flagship: Seven Sub-Branches Synthesis Dojo â€” two-tab
  // (Stream Ã— Sub-Branch Matrix + 5-scenario Evaluative Drill).
  "seven-sub-branches-synthesis-dojo": SevenSubBranchesSynthesisDojo,
  // Lesson 3.3's Â§4 explorer: Grahvani Coverage Matrix Explorer â€” L2 pattern
  // (navigational map LEFT + stream-filtered coverage cards RIGHT).
  "grahvani-coverage-matrix-explorer": GrahvaniCoverageMatrixExplorer,
  // Lesson 3.3's Â§7 flagship: Grahvani Coverage Synthesis Dojo â€” two-tab
  // (Full 4Ã—7 Coverage Matrix + 5-scenario Evaluative Drill).
  "grahvani-coverage-synthesis-dojo": GrahvaniCoverageSynthesisDojo,
  // Lesson 4.1's Â§4 explorer: Regional Schools Explorer â€” L2 pattern
  // (map image LEFT + tabbed school explorer RIGHT with stream concentrations).
  "regional-schools-explorer": RegionalSchoolsExplorer,
  // Lesson 4.1's Â§7 flagship: Regional Schools Synthesis Dojo â€” two-tab
  // (6Ã—4 Regional Schools Matrix + teacher lookup + 5-scenario Evaluative Drill).
  "regional-schools-synthesis-dojo": RegionalSchoolsSynthesisDojo,
  // Lesson 4.2's Â§4 explorer: Lineage Threads Network Explorer â€” L2 pattern
  // (network diagram LEFT + tabbed lineage explorer RIGHT with sub-lineages).
  "lineage-threads-network-explorer": LineageThreadsNetworkExplorer,
  // Lesson 4.2's Â§7 flagship: Lineage Threads Synthesis Dojo â€” two-tab
  // (Lineage Comparison Matrix + 5-scenario Evaluative Drill).
  "lineage-threads-synthesis-dojo": LineageThreadsSynthesisDojo,
  // Lesson 4.3's Â§4 explorer: Three-Lineage Comparison Chart Analyzer â€” L2 pattern
  // (chart diagram LEFT + tabbed three-lineage analyzer RIGHT + convergence/divergence toggle).
  "three-lineage-comparison-chart-analyzer": ThreeLineageComparisonChartAnalyzer,
  // Lesson 4.3's Â§7 flagship: Lineage Matters Synthesis Dojo â€” two-tab
  // (Integrated Synthesis View + 5-scenario Evaluative Drill).
  "lineage-matters-synthesis-dojo": LineageMattersSynthesisDojo,
  // Lesson 2.1.1's Â§7 interactive: Zodiac Reference Frame Explorer â€”
  // Earth-centered diagram showing sidereal vs tropical zodiacs with
  // clickable hotspots (sidereal zero, tropical zero, vernal equinox,
  // summer solstice, ayanÄá¹Å›a gap, Spica, Earth's axis, ecliptic,
  // celestial equator).
  "zodiac-reference-frame-explorer": ZodiacReferenceFrameExplorer,
  // Lesson 2.1.2's Â§7 interactive: Precession Visualizer â€” clickable SVG
  // diagram with epoch slider, by-hand calculator, and classical-vs-modern
  // comparison tabs.
  "precession-visualizer": PrecessionVisualizer,
  // Lesson 2.1.3's Â§7 interactive: Zodiac Tradition Reasoning Comparator â€”
  // side-by-side comparison of Vedic-sidereal vs Western-tropical reasoning
  // across four dimensions (doctrinal, observational, historical, comparative).
  "zodiac-tradition-reasoning-comparator": ZodiacTraditionReasoningComparator,
  "zodiac-tradition-comparator": ZodiacTraditionComparator,
  // Lesson 2.1.4's Â§7 interactive: Tropical-Sidereal Conversion Calculator â€”
  // birth-date Sun-sign calculator + longitude converter showing graha-in-rÄÅ›i
  // shifts, daÅ›Ä consequences, and naká¹£atra alignment effects.
  "tropical-sidereal-conversion-calculator": TropicalSiderealConversionCalculator,
  // Lesson 2.2.1's Â§7 interactive: AyanÄá¹Å›a Definition Explorer â€”
  // 4-tab interactive: Definition (visual gap diagram + conversion calculator),
  // Etymology (Sanskrit compound breakdown), 7 Conventions (comparison table),
  // Stream Matcher (stream â†’ ayanÄá¹Å›a mapping).
  "ayanamsha-definition-explorer": AyanamshaDefinitionExplorer,
  "lahiri-ayanamsha-explorer": LahiriAyanamshaExplorer,
  "lahiri-by-hand-step-by-step-calculator": LahiriByHandStepByStepCalculator,
  "krishnamurti-ayanamsha-explorer": KrishnamurtiAyanamshaExplorer,
  "ayanamsha-comparator": KrishnamurtiAyanamshaExplorer,
  // Lesson 2.2.5's Â§7 interactive: Comparative AyanÄá¹Å›a Explorer â€” side-by-side
  // comparison of all 7 conventions, convention detail profiles, alignment-epoch
  // timeline, practitioner-community mapping, and multi-ayanÄá¹Å›a honesty discipline.
  "comparative-ayanamsha-explorer": ComparativeAyanamshaExplorer,
  // Lesson 2.2.6's Â§7 interactive: AyanÄá¹Å›a Decision Framework Flowchart â€”
  // scenario â†’ decision mapping, per-context rules table, multi-lineage synthesis,
  // do-not-mix visualiser, software verification, and Chapter 2 capstone panel.
  "ayanamsha-decision-framework-flowchart": AyanamshaDecisionFrameworkFlowchart,
  // Lesson 2.3.1's Â§9 interactive: Yuga Proportion Visualiser â€” three-mode
  // proportional bar visualiser (proportion / absolute-duration / saá¹dhyÄ)
  // with hover/click detail panels and embedded formative checkpoints.
  "yuga-proportion-visualiser": YugaProportionVisualiser,
  // Lesson 2.3.2's Â§10 interactive: Yuga Cycle Explorer â€” three-zoom-level
  // visual scrubber (MahÄ-Yuga / Manvantara / Kalpa) with human/divya toggle,
  // present-epoch marker, and modern cosmology benchmarks.
  "yuga-cycle-explorer": YugaCycleExplorer,
  // Lesson 2.3.3's Â§9 interactive: Traditional vs Academic Dating Comparator â€”
  // three-position side-by-side (Traditional Vedic / Yukteshwar / Academic-Indology)
  // with synthesis honesty dial.
  "traditional-vs-academic-dating-comparator": TraditionalVsAcademicDatingComparator,
  // Lesson 2.3.4's Â§10 interactive: Yuga Dependence Classifier â€” scenario-based
  // yuga-dependent vs yuga-independent classification drill with three difficulty levels.
  "yuga-dependence-classifier": YugaDependenceClassifier,
  // Lesson 2.4.1's Â§9 interactive: Day-Type Comparator â€” side-by-side comparison
  // of four day-types (sÄvana / sidereal / lunar / solar) with operational-scope quiz.
  "day-type-comparator": DayTypeComparator,
  // Lesson 2.4.2's Â§10 interactive: Sunrise at Any Latitude â€” 7-step sunrise
  // computation calculator with edge-case detection (polar day/night) and
  // worked-example library (Mumbai, Delhi, Singapore).
  "sunrise-at-any-latitude": SunriseAtAnyLatitude,
  // Lesson 2.4.3's Â§8 interactive: Sidereal Day Explorer â€” top-down Earth view
  // with time-scrubber, differential visualisation (~3m 56s), annual accumulation,
  // and operational-context picker.
  "sidereal-day-explorer": SiderealDayExplorer,
  // Lesson 2.4.4's Â§10 interactive: Tithi from Sun-Moon â€” longitude scrubbers,
  // circular elongation arc visualisation, tithi computation, variable-duration
  // mode, and edge-case detection (ká¹£aya/vá¹›ddhi tithi).
  "tithi-from-sun-moon": TithiFromSunMoon,
  // Lesson 2.4.5's Â§10 interactive: Saá¹…krÄnti Tracker â€” Sun's annual journey
  // through 12 rÄÅ›is with UttarÄyaá¹‡a/Daká¹£iá¹‡Äyana distinction, sidereal-vs-tropical
  // toggle, multi-century drift visualisation, and festival overlay.
  "sankranti-tracker": SankrantiTracker,
  // Lesson 3.1.1's Â§4 explorer: Tithi Angle Visualizer â€” circular Sun-Moon
  // orbit with 12Â° segment overlay + real-time tithi computation + paká¹£a
  // indicator + paÃ±cÄá¹…ga reading panel.
  "tithi-angle-visualizer": TithiAngleVisualizer,
  // Lesson 3.1.1's Â§7 flagship: Tithi Calculator Dojo â€” step-by-step formula
  // breakdown with editable Sun/Moon longitudes + preset scenarios + elapsed
  // fraction visualisation.
  "tithi-calculator-dojo": TithiCalculatorDojo,
  // Lesson 3.1.2's Â§7 flagship: Tithi-Deity Wheel â€” circular 30-tithi visual
  // explorer with click-for-attributes, quality-filter highlight, and
  // festival-major badge system.
  "tithi-deity-wheel": TithiDeityWheel,
  // Lesson 3.1.1's Â§4 sub-component: Tithi Context Matcher â€” scenario-based
  // discrimination drill for paÃ±cÄá¹…ga-tithi vs astronomical-instantaneous-tithi.
  "tithi-context-matcher": TithiContextMatcher,
  // Lesson 3.1.2's Â§4 explorer: Åšukla Tithi Strip â€” horizontal scrollable
  // enumeration of the 15 Å›ukla paká¹£a tithis with deity, quality, and
  // festival cards.
  "shukla-tithi-strip": ShuklaTithiStrip,
  // Lesson 3.1.3's Â§7 flagship: Ká¹›á¹£á¹‡a Festival Timeline â€” vertical timeline
  // of the 15 ká¹›á¹£á¹‡a paká¹£a tithis with festival-major highlights, Pitá¹› Paká¹£a
  // band, and click-to-reveal detail panel.
  "krishna-festival-timeline": KrishnaFestivalTimeline,
  // M3-C1-L1's Â§7 flagship: PaÃ±cÄá¹…ga Builder â€” computes all 5 limbs
  // (tithi + vÄra + naká¹£atra + yoga + karaá¹‡a) for any date with visual diagram.
  "pancanga-builder": PancangaBuilder,
  // Lesson 23.1.2 interactive: Panchanga Five-Limb Framework -- limb
  // definitions, derivation hierarchy, and trade-off aggregation.
  "panchanga-five-limb-framework": PanchangaFiveLimbFramework,
  // Lesson 23.1.3 interactive: Muhurta Text Corpus Navigator -- classical
  // source layers, attribution discipline, and reading sequence.
  "muhurta-text-corpus-navigator": MuhurtaTextCorpusNavigator,
  // Lesson 23.1.4 interactive: Muhurta Comparative Position Explorer --
  // stream-variant inspector, shared-principles reference, sva-dharma framework.
  "muhurta-comparative-position-explorer": MuhurtaComparativePositionExplorer,
  // Lesson 23.2.1 interactive: Tithi Classification Explorer --
  // five-fold matcher, 30-tithi wheel, scenario screener, integration workflow.
  "tithi-classification-explorer": TithiClassificationExplorer,
  // Lesson 23.2.2 interactive: Vara Lord Effects Explorer --
  // weekday-event matcher, lord reference cards, scenario screener, integration workflow.
  "vara-lord-effects-explorer": VaraLordEffectsExplorer,
  // Lesson 23.2.3 interactive: Nakshatras Categorized Explorer --
  // category-event matcher, category reference cards, 27-nakshatra map, scenario screener, integration workflow.
  "nakshatras-categorized-explorer": NakshatrasCategorizedExplorer,
  // Lesson 3.1.4's Â§7 flagship: NandÄ-BhadrÄ-JayÄ-RiktÄ-PÅ«rá¹‡Ä Classifier â€”
  // quality-event matcher with contextual-quality discipline override visualization.
  "nanda-bhadra-jaya-rikta-purna-classifier": NandaBhadraClassifier,
  // Lesson 3.1.5's Â§7 flagship: AmÄnta-PÅ«rá¹‡imÄnta Converter â€” paká¹£a-month converter,
  // festival cross-reference cards, and regional identifier.
  "amanta-purnimanta-converter": AmantaPurnimantaConverter,
  // Lesson 23.1.1 interactive: Muhurta Concept Scope -- 48-minute
  // time-unit grid and discipline-scope classifier.
  "muhurta-concept-scope": MuhurtaConceptScope,
  // Lesson 23.6.3 interactive: M23 Closure -- cumulative module synthesis
  // with chapter wheel, hook timeline, self-assessment, and ongoing-development.
  "m23-closure": M23Closure,
  // Lesson 23.6.2 interactive: Muhurta Decision Framework -- stakes-calibrated
  // engagement with decision-tree, stakes gauge, case files, and method matrix.
  "muhurta-decision-framework": MuhurtaDecisionFramework,
  // Lesson 23.6.1 interactive: Muhurta Honest Handling -- cumulative
  // honest-handling synthesis across M23: rarity dial, case files,
  // daivajna wheel, instance map, and common-mistake gallery.
  "muhurta-honest-handling": MuhurtaHonestHandling,
  // Lesson 23.5.1 interactive: Panchaka Cancellation -- 27-nakshatra wheel,
  // pañca-niṣiddha-karma case files, distinction drill, and mitigation panel.
  "panchaka-cancellation": PanchakaCancellation,
  // Lesson 23.5.2 interactive: Rāhu-Kāla + Yamagaṇḍa + Gulika-Kāla explorer —
  // 8-portion daylight wheel, 24h timeline, case-file verdict drill, 7-day
  // mnemonic pattern table, and seasonal-duration variance explorer.
  "rahu-kala-yamaganda-explorer": RahuKalaYamagandaExplorer,
  // Lesson 3.1.6's Â§7 flagship: Tithi-MuhÅ«rta Introductory Judgment â€” scenario-based
  // muhÅ«rta quality trainer with multi-element synthesis preview.
  "tithi-muhurta-introductory-judgment": TithiMuhurtaIntroductoryJudgment,
  // Lesson 3.2.1's Â§4 explorer: VÄra-Graha Wheel â€” circular 7-segment visual
  // explorer with click-for-attributes, element-filter highlight, and
  // planetary-type filter system.
  "vara-graha-wheel": VaraGrahaWheel,
  // Lesson 3.2.2's Â§7 flagship: Chaldean Planetary HorÄ Explorer â€” two-panel
  // composition (Chaldean order strip + horÄ sequence generator) with
  // 24 mod 7 = 3 principle explanation.
  "chaldean-planetary-hora-explorer": ChaldeanPlanetaryHoraExplorer,
  "chaldean-letter-table-explorer": ChaldeanLetterTableExplorer,
  "pythagorean-letter-table-explorer": PythagoreanLetterTableExplorer,
  "vedic-anka-letter-table-explorer": VedicAnkaLetterTableExplorer,
  "numerology-system-selection": NumerologySystemSelection,
  "digit-meaning-explorer": DigitMeaningExplorer,
  "master-number-explorer": MasterNumberExplorer,
  // Lesson 3.2.3's Â§7 flagship: ChoghadiyÄ &amp; RÄhu KÄlam Calculator â€”
  // sunrise/sunset input, 16-segment quality tables, visual timeline,
  // and inauspicious-window highlight.
  "choghadiya-rahukalam-calculator": ChoghadiyaRahuKalamCalculator,
  // Lesson 3.2.4's Â§7 flagship: VÄra-Event Pairing Explorer â€” event-category
  // cards, recommended-vÄra panels, vÄra reference grid, and planetary
  // friendship/enmity visualization.
  "vara-event-pairing-explorer": VaraEventPairingExplorer,
  // Lesson 3.3.1's Â§7 flagship: Moon-Naká¹£atra Calculator â€” step-by-step formula
  // breakdown with editable Moon longitude + optional Sun context + preset
  // scenarios + 27-segment circular visualisation.
  "moon-nakshatra-calculator": MoonNakshatraCalculator,
  // Lesson 3.3.2's Â§4 explorer: Naká¹£atra Strip â€” horizontal scrollable
  // enumeration of all 27 naká¹£atras with ruler-colour coding, filter pills,
  // search, and click-to-reveal detail panel (pÄda, yoni, gana, tara).
  "nakshatra-strip": NakshatraStrip,
  // Lesson 3.3.3's Â§7 flagship: Naká¹£atra Deity & Ruler Wheel â€” circular 27-segment
  // SVG explorer with inner-name / outer-planet rings, filter pills, centre
  // mandala, and paká¹£a-suitability overlay toggle.
  "nakshatra-deity-ruler-wheel": NakshatraDeityRulerWheel,
  // Lesson 3.3.4's Â§7 flagship: Daily Naká¹£atra PaÃ±cÄá¹…ga Reader â€” simulated
  // today's paÃ±cÄá¹…ga with time-slider, transition tracking, activity-suitability
  // grid, and classical reasoning panel.
  "daily-nakshatra-pancanga-reader": DailyNakshatraPancangaReader,
  // Lesson 3.4.1's Â§7 flagship: Yoga vs Chart-Yoga Comparison â€” two-column
  // comparison table + 8-statement discrimination drill + visual icons.
  "yoga-vs-chart-yoga-comparison": YogaVsChartYogaComparison,
  // Lesson 3.4.2's Â§7 flagship: Time-Yoga Calculator â€” Sun+Moon longitude sum
  // with step-by-step formula breakdown, 27-segment circular visualisation,
  // and preset scenarios.
  "time-yoga-calculator": TimeYogaCalculator,
  // Lesson 3.4.3's Â§7 flagship: Yoga Wheel 27 â€” circular 27-segment explorer
  // with nature colour-coding, filter pills, table view toggle, and search.
  "yoga-wheel-27": YogaWheel27,
  // Lesson 3.4.4's Â§7 flagship: Inauspicious Yoga Avoidance Calculator â€”
  // focus on 6 inauspicious yogas with severity ranking, mitigation guide,
  // and month-view timeline.
  "inauspicious-yoga-avoidance-calculator": InauspiciousYogaAvoidanceCalculator,
  // Lesson 3.4.5's Â§7 flagship: Yoga MuhÅ«rta Screening Integrator â€” multi-element
  // muhÅ«rta screening tool with 5-element dashboard and yoga-specific filter.
  "yoga-muhurta-screening-integrator": YogaMuhurtaScreeningIntegrator,
  // Lesson 3.5.1's Â§7 flagship: Karaá¹‡a Calculator â€” half-tithi computation
  // with step-by-step breakdown, tithi-bar visual, and preset scenarios.
  "karana-calculator": KaranaCalculator,
  // Lesson 3.5.2's Â§7 flagship: Karaá¹‡a Cycle Diagram â€” circular 11-karaá¹‡a
  // explorer with Cara/Sthira colour-coding, filter pills, and table view.
  "karana-cycle-diagram": KaranaCycleDiagram,
  // Lesson 3.5.3's Â§7 flagship: Bhadra Avoidance Integrator â€” Bhadra (Viá¹£á¹­i)
  // calculator with day-of-week selector, activity-avoidance cards, classical
  // source panel, and comparison with other inauspicious periods.
  "bhadra-avoidance-integrator": BhadraAvoidanceIntegrator,
  // Lesson 2.5.1's Â§7 interactive: Samvat Converter â€” Vikrama â†” Åšaka â†” CE
  // interactive year-conversion calculator with boundary detection + convention toggles.
  "samvat-converter-vikrama-shaka": SamvatConverterVikramaShaka,
  // Lesson 2.5.2's Â§7 interactive: Regional Calendar Explorer â€” side-by-side
  // rendering of Tamil + Kerala + Bengali + Assamese + Odia regional calendars.
  "regional-calendar-explorer": RegionalCalendarExplorer,
  // Lesson 2.5.3's Â§7 interactive: Calendar Converter â€” comprehensive cross-system
  // date-conversion across Vikrama / Åšaka / Kollam / Gregorian + JDN cross-validation.
  "calendar-converter": CalendarConverter,
  // â”€â”€â”€ Module 04: RÄÅ›i System interactives â”€â”€â”€
  "rashi-boundary-wheel": RashiBoundaryWheel,
  "boundary-crossing-demonstrator": BoundaryCrossingDemonstrator,
  "rashi-attribute-wheel": RashiAttributeWheel,
  "rashi-modality-classifier": RashiModalityClassifier,
  "kendra-trikona-grouping-visualizer": KendraTrikonaGroupingVisualizer,
  "angular-house-classifier": AngularHouseClassifier,
  "quality-house-classifier": QualityHouseClassifier,
  "purushartha-trine-explorer": PurusharthaTrineExplorer,
  "karaka-table": KarakaTable,
  "karaka-tenancy-lab": KarakaTenancyLab,
  "bhavat-bhavam-drill": BhavatBhavamDrill,
  "bhava-chalita-refinement": BhavaChalitaRefinement,
  "placidus-kp-convention": PlacidusKpConvention,
  "bhava-madhya-sandhi": BhavaMadhyaSandhi,
  "house-system-decision-framework": HouseSystemDecisionFramework,
  "lal-kitab-fixed-aries-lagna": LalKitabFixedAriesLagna,
  "varga-explainer": VargaExplainer,
  "varga-reference-table": VargaReferenceTable,
  "varga-template-card": VargaTemplateCard,
  "varga-calculator": VargaCalculator,
  "multi-varga-comparator": MultiVargaComparator,
  "trimshamsha-calculator": TrimshamshaCalculator,
  "ethical-routing-checklist": EthicalRoutingChecklist,
  "shashtyamsha-calculator": ShashtyamshaCalculator,
  "d1-d60-comparator": D1D60Comparator,
  "birth-time-quality-checker": BirthTimeQualityChecker,
  "vimshopaka-calculator": VimshopakaCalculator,
  "vargottama-scanner": VargottamaScanner,
  "d1-d9-divergence-reader": D1D9DivergenceReader,
  "hora-calculator": HoraCalculator,
  "drekkana-calculator": DrekkanaCalculator,
  "drekkana-system-comparator": DrekkanaSystemComparator,
  "navamsha-calculator": NavamshaCalculator,
  "navamsha-reader": NavamshaReader,
  "rashi-navamsha-pair": RashiNavamshaPair,
  "chart-planet-positioner": ChartPlanetPositioner,
  "rashi-rising-classifier": RashiRisingClassifier,
  "rashi-stream-comparator": RashiStreamComparator,
  "rashi-profile-explorer": RashiProfileExplorer,
  "quadrant-triad-visualizer": QuadrantTriadVisualizer,
  "trikona-pair-explorer": TrikonaPairExplorer,
  // Lesson 5.1.2's Â§7 interactive: Dignity Wheel â€” clickable 12-rashi
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
  "tamkalika-wheel": TamkalikaWheel,
  "panchadha-combiner": PanchadhaCombiner,
  "avastha-panel": AvasthaPanel,
  "stream-comparator": StreamComparator,
  "stream-comparison-table": StreamComparisonTable,
  "bhava-wheel": BhavaWheel,
  "house-system-comparator": HouseSystemComparator,
  "bhava-template-card": BhavaTemplateCard,
  "bhava-profile": BhavaProfile,
  "preliminary-reading-flow": PreliminaryReadingFlow,
  "rahu-amplifier": RahuAmplifier,
  "rahu-ketu-comparator": RahuKetuComparator,
  "jupiter-evaluator": JupiterEvaluator,
  "aspect-caster": AspectCaster,
  "myth-map": MythMap,
  "shukra-friendship-dignity-grid": ShukraFriendshipDignityGrid,
  "association-classifier": AssociationClassifier,
  "combustion-calculator": CombustionCalculator,
  // Lesson 5.1.4's Â§7 interactive: Friendship Matrix â€” directed graha
  // relationship grid with mirror-cell comparison and Sun-Moon polarity axes.
  "friendship-matrix": FriendshipMatrix,
  // Lesson 5.1.5's Â§7 interactive: Pakshabala Slider â€” tithi scrubber with
  // inverse Sun/Moon virupa bars and a dignity-combination preview.
  "pakshabala-slider": PakshabalaSlider,
  "shadbala-intro": ShadbalaIntro,
  "shadbala-components": ShadbalaComponents,
  "shadbala-grader": ShadbalaGrader,
  "uchchabala-calculator": UchchabalaCalculator,
  "saptavargabala-calculator": SaptavargabalaCalculator,
  "oja-yugma-calculator": OjaYugmaCalculator,
  "kendra-drekkana-calculator": KendraDrekkanaCalculator,
  "sthana-bala-summer": SthanaBalaSummer,
  "dik-bala-calculator": DikBalaCalculator,
  "kala-bala-overview": KalaBalaOverview,
  // Lesson 5.2.2's Â§7 interactive: Karaka Router â€” question-driven Mars
  // register selector with house-side confirmation and tie-breaker feedback.
  "karaka-router": KarakaRouter,
  // Lesson 5.2.3's Â§7 interactive: Friendship Dignity Grid â€” Mars across
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
  "vivaha-muhurta-evaluator": VivahaMuhurtaEvaluator,
  "vyapara-arambh-muhurta-evaluator": VyaparaArambhMuhurtaEvaluator,
  "griha-pravesha-muhurta-evaluator": GrihaPraveshaMuhurtaEvaluator,
  "yatra-muhurta-evaluator": YatraMuhurtaEvaluator,
  "pada-navamsha-mapper": PadaNavamshaMapper,
  "kp-sub-calculator": KpSubCalculator,
  "tara-bala-wheel": TaraBalAWheel,
  // Module 10 Chapter 1 â€” VimÅ›ottarÄ« DaÅ›Ä Cycle
  // Lesson 10.1.1's Â§7 interactive: DaÅ›Ä Timeline â€” 120-year proportional wheel
  // with 9 clickable lord segments, starting-lord rotation, lifespan overlay,
  // and linear timeline bar.
  "dasha-timeline": DashaTimeline,
  "dasha-start-finder": DashaStartFinder,
  // Lesson 10.1.3's Â§7 interactive: DaÅ›Ä Selector â€” Universal Default vs Conditional Simulator
  "dasha-selector": DashaSelector,
  // Lesson 10.2.1's Â§7 interactive: DaÅ›Ä Balance Calculator â€” four-step
  // pedagogical calculator with Moon longitude input, naká¹£atra identification,
  // fraction-traversed computation, and balance result with boundary warnings
  // and subsequent mahÄdaÅ›Ä preview.
  "dasha-balance-calculator": DashaBalanceCalculator,
  "dasha-cascade-explorer": DashaCascadeExplorer,
  "vimshottari-ratio-calculator": VimshottariRatioCalculator,
  "antardasha-table-builder": AntardashaTableBuilder,
  "dasha-lookup-drill": DashaLookupDrill,
  "ashtottari-explorer": AshtottariExplorer,
  "ashtottari-condition-checker": AshtottariConditionChecker,
  "yogini-explorer": YoginiExplorer,
  "dasha-class-comparator": DashaClassComparator,
  "conditional-dasha-catalog": ConditionalDashaCatalog,
  "conditional-criteria-checker": ConditionalCriteriaChecker,
  "dasha-decision-framework": DashaDecisionFramework,
  "kp-vimshottari-intro": KpVimshottariIntro,
  // Lesson 10.2.2's Â§7 interactive: DaÅ›Ä Balance Mistake Explorer â€”
  // toggle switches for all 6 common mistakes with side-by-side correct/corrupted
  // comparison and Â±1-day tolerance indicator.
  "dasha-balance-mistake-explorer": DashaBalanceMistakeExplorer,
  // Lesson 10.2.3's Â§7 interactive: DaÅ›Ä Balance Cross-Check â€” hand-computed
  // balance input vs engine output with Â±1-day confirmation band and
  // severity-based diagnosis hints (match/minor/major/critical).
  "dasha-balance-cross-check": DashaBalanceCrossCheck,
  // Lesson 10.2.4's Â§7 interactive: DaÅ›Ä Table Builder â€” constructs the full
  // birth-to-120 mahÄdaÅ›Ä table from a balance, with expandable bhukti
  // subdivisions using the proportion formula (MD Ã— lord) Ã· 120.
  "dasha-table-builder": DashaTableBuilder,
  // Lesson 10.4.1's Â§7 interactive: Bhukti-Yoga Matrix â€” MD-lord â†” AD-lord
  // naisargika friendship sets the baseline quality of a sub-period.
  // Includes dignity modulator demonstrating "modulator, not override."
  "bhukti-yoga-matrix": BhuktiYogaMatrix,
  // Lesson 10.4.2's Â§7 interactive: KÄraka Overlay Reader â€” MD-lord's life-phase
  // quality overlaid with AD-lord's domain-flavour significations.
  // Detects multi-kÄraka clusters and provides same-AD-different-MD comparison.
  "karaka-overlay-reader": KarakaOverlayReader,
  // Lesson 10.4.3's Â§7 interactive: Two-Yes Checker â€” counts independent
  // indicator families for a predictive question and flags reliable only
  // when â‰¥2 genuinely different lines of evidence agree.
  "two-yes-checker": TwoYesChecker,
  // Lesson 10.4.4's Â§7 interactive: Event Reading Workbench â€” runs the six-step
  // workflow end-to-end with functional lordship, bhukti-yoga, kÄraka overlay,
  // and the two-yes gate for any domain + ascendant + MD-AD pair.
  "event-reading-workbench": EventReadingWorkbench,
  // Lesson 10.6.1's Â§7 interactive: Cara DaÅ›Ä Intro â€” side-by-side contrast of
  // VimÅ›ottarÄ« (planet-based, fixed) vs Cara (sign-based, variable) with
  // modality legend and cross-validation panel.
  "cara-dasha-intro": CaraDashaIntro,
  // Lesson 10.6.2's Â§7 interactive: Sthira DaÅ›Ä Intro â€” awareness-level
  // reference table contrasting Cara and Sthira (both rÄÅ›i-based Jaimini,
  // different rules) with deferral note to Jaimini module (T1-17).
  "sthira-dasha-intro": SthiraDashaIntro,
  // Lesson 10.6.3's Â§7 interactive: KÄlacakra Overview â€” awareness-level
  // pÄda-derived sign daÅ›Ä explorer with savya/apasavya direction rules,
  // 108-point naká¹£atra-pÄda grid, and complexity breakdown.
  "kalachakra-overview": KalachakraOverview,
  // Lesson 10.6.4's Â§7 interactive: ParÄÅ›arÄ«-Jaimini Chooser â€” decision-tool
  // recommending daÅ›Ä(s) for any situation with VimÅ›ottarÄ« always anchored.
  // Includes cross-validation scenarios (convergence / divergence).
  "parashari-jaimini-chooser": ParashariJaiminiChooser,
  // Lesson 10.7.5's Â§7 interactive: DaÅ›Ä Landscape Map â€” survey of ~14 systems
  // grouped by class, five-point discipline overlay, and honest-framing practice.
  // Closes Module 10.
  "dasha-landscape-map": DashaLandscapeMap,
  "drishti-strength-meter": DrishtiStrengthMeter,
  "rashi-drishti-grid": RashiDrishtiGrid,
  "aspect-doctrine-comparator": AspectDoctrineComparator,
  "tajika-orb-calculator": TajikaOrbCalculator,
  "tajika-applying-separating": TajikaApplyingSeparating,
  "tajika-yoga-glossary": TajikaYogaGlossary,
  "varshaphala-overview": VarshaphalaOverview,
  "doctrine-selector": DoctrineSelector,
  "multi-stream-chart-comparator": MultiStreamChartComparator,
  "saturn-aspect-disambiguator": SaturnAspectDisambiguator,
  "pmpy-detector": PmpyDetector,
  "pmpy-archetype-explorer": PmpyArchetypeExplorer,
  "pmpy-dilution-checker": PmpyDilutionChecker,
  "pmpy-grade-scenario": PmpyGradeScenario,
  "yoga-strength-overlay": YogaStrengthOverlay,
  "cross-stream-yoga-map": CrossStreamYogaMap,
  "yoga-firing-timeline": YogaFiringTimeline,
  "yoga-reading-workflow": YogaReadingWorkflow,
  "raja-yoga-detector": RajaYogaDetector,
  "dharma-karmadhipati-detector": DharmaKarmadhipatiDetector,
  "raja-yoga-variants-map": RajaYogaVariantsMap,
  "kendra-trikona-rationale": KendraTrikonaRationale,
  "raja-yoga-worked-example": RajaYogaWorkedExample,
  "dhana-yoga-detector": DhanaYogaDetector,
  "dhana-yoga-variants-map": DhanaYogaVariantsMap,
  "raja-dhana-overlap-map": RajaDhanaOverlapMap,
  "dhana-yoga-worked-example": DhanaYogaWorkedExample,
  "ruchaka-valour-simulator": RuchakaValourSimulator,
  "bhadra-intellect-explorer": BhadraIntellectExplorer,
  "hamsa-malavya-synthesis": HamsaMalavyaSynthesis,
  "shasha-authority-analyzer": ShashaAuthorityAnalyzer,
  "lunar-yoga-detector": LunarYogaDetector,
  "kemadruma-checker": KemadrumaChecker,
  "gajakesari-simulator": GajakesariSimulator,
  "budhaditya-checker": BudhadityaChecker,
  // Lesson 13.4.1's Â§7 interactive: Cheá¹£á¹­Ä Bala Calculator â€” motional strength
  // explorer with eight cheá¹£á¹­Ä avasthÄs, epicycle diagram, Sun/Moon convention
  // panels, and virÅ«pa spectrum. Rich SVG diagrams illustrate retrograde mechanics.
  "cheshta-bala-calculator": CheshthaBalaCalculator,
  // Lesson 13.4.2's Â§7 interactive: Naisargika Bala Table â€” the seven fixed
  // natural-strength values with descending bar chart, fraction ladder, wheel
  // diagram, and baseline-stack visual. No engine needed (classical constants).
  "naisargika-table": NaisargikaTable,
  // Lesson 13.4.3's Â§7 interactive: Naisargika Rationale â€” hierarchy ladder,
  // luminosity overlay, Venus-vs-Jupiter comparison, and baseline reminder.
  // Explains why the fixed order is not arbitrary.
  "naisargika-rationale": NaisargikaRationale,
  // Lesson 13.5.1's Â§7 interactive: Dá¹›k Bala Calculator â€” aspect net diagram,
  // signed number line, add/remove aspects, six-component overview. Teaches
  // the signed-net concept and that dá¹›k bala can be negative.
  "drk-bala-calculator": DrkBalaCalculator,
  // Lesson 13.5.2's Â§7 interactive: á¹¢aá¸bala Summation â€” waterfall stack,
  // threshold gauge, all-planets reference, and pass/fail comparison.
  // Teaches summing, converting to rÅ«pas, and comparing to minima.
  "shadbala-summation": ShadbalaSummation,
  // Lesson 13.5.3's Â§7 interactive: á¹¢aá¸bala Scorecard â€” per-planet ratio + band
  // table, band spectrum, workflow diagram, and confidence-vs-virtue visual.
  // Closes Module 13 by turning totals into interpretive judgement.
  "shadbala-scorecard": ShadbalaScorecard,
  // Lesson 13.6.1's Â§7 interactive: BhÄva Bala Calculator â€” house selector,
  // three-component inputs, house diagram, and á¹£aá¸bala parallel comparison.
  "bhava-bala-calculator": BhavaBalaCalculator,
  // Lesson 13.6.2's Â§7 interactive: á¹¢aá¸balaâ€“BhÄva Bala Synthesis â€” domain
  // selector, strength toggles, four-cell matrix, and confidence dial.
  // Teaches integrative reading of planet + house strength.
  "shadbala-bhavabala-synthesis": ShadbalaBhavabalaSynthesis,
  // Lesson 13.6.3's Â§7 interactive: Cross-Stream Strength Map â€” four stream
  // conceptions, parallel tracks, convergence/divergence, and paÃ±cavargÄ«ya
  // breakdown. Maps how each sampradÄya measures strength.
  "cross-stream-strength-map": CrossStreamStrengthMap,
  // Lesson 13.6.4's Â§7 interactive: Strength-Quality Matrix â€” Module 13 capstone.
  // 2Ã—2 judgement matrix fusing á¹£aá¸bala (quantity) with dignity/aspect/yoga (quality).
  // Clickable SVG matrix + preset scenarios + amplifier diagram + discipline rules.
  "strength-quality-matrix": StrengthQualityMatrix,
  // Lesson 13.3.3's Â§7 interactive: Paká¹£a-Yuddha Calculator â€” paká¹£abala (lunar-phase
  // strength split) + graha-yuddha (planetary war detection). Fortnight toggle,
  // planet status grid, proximity checker with SVG diagrams, and worked scenarios.
  "paksha-yuddha-calculator": PakshaYuddhaCalculator,
  // Lesson 13.3.4's Â§7 interactive: Dik-KÄla Summer â€” Chapter 3 capstone.
  // Dik bala slider + nine kÄla sub-component sliders + SVG sum diagram +
  // virÅ«paâ†’rÅ«pa conversion + worked presets (Sun 10th, Moon night, war penalty).
  "dik-kala-summer": DikKalaSummer,
  // Lesson 14.4.1's Â§7 interactive: Laká¹£mÄ«-SarasvatÄ« Detector â€” checks both
  // deity-named special yogas. North Indian chart SVG + house/dignity selectors +
  // condition checker with preset scenarios (Laká¹£mÄ« full, SarasvatÄ« full, broken).
  "lakshmi-saraswati-detector": LakshmiSaraswatiDetector,
  // Lesson 14.4.2's Â§7 interactive: Akhanda SÄmrÄjya Checker â€” tests the
  // "unbroken sovereignty" yoga against selectable source definitions (standard
  // vs PhaladÄ«pikÄ). Sovereignty-stack SVG + mini-chart + source-variation discipline.
  "akhanda-samrajya-checker": AkhandaSamrajyaChecker,
  // Lesson 14.4.3's Â§7 interactive: BuddhÄditya-Gaja-Kesari Detector â€” revisits
  // both common yogas with depth. Combustion orb slider + kendra-from-Moon
  // circular diagram + strength grading + trikoá¹‡a misread warning.
  "buddhaditya-gajakesari-detector": BuddhadityaGajakesariDetector,
  // Lesson 14.4.4's Â§7 interactive: Special-Yoga Scan â€” Chapter 4 capstone.
  // Systematic 5-yoga checklist on a fixed Cancer-lagna worked chart.
  // Jupiter-dignity toggle demonstrates broken-condition cascade.
  "special-yoga-scan": SpecialYogaScan,
  // Lesson 14.5.1's Â§7 interactive: Neecha-Bhaá¹…ga Checker â€” cancellation of debilitation.
  // Planet selector + 5-condition checklist + rescue-chain SVG + honest debate.
  "neecha-bhanga-checker": NeechaBhangaChecker,
  // Lesson 14.5.2's Â§7 interactive: Vipareeta Detector â€” three Vipareeta RÄja Yogas.
  // Lagna selector + dusthana-lord placements + dusthana-triangle SVG + refinements.
  "vipareeta-detector": VipareetaDetector,
  // Lesson 14.5.3's Â§7 interactive: Vipareeta Rationale â€” spoiler-of-spoiler doctrine.
  // Scenario explorer + strength/timing controls + spoiler-mechanism SVG + honest limits.
  "vipareeta-rationale": VipareetaRationale,
  // Lesson 14.5.4's Â§7 interactive: Vipareeta-Neecha Scan â€” Chapter 5 capstone.
  // Fixed Aries chart + neecha-bhaá¹…ga check + Hará¹£a check + combined honest reading.
  "vipareeta-neecha-scan": VipareetaNeechaScan,
  // Lesson 14.6.1's Â§7 interactive: Manglik Detector â€” Kuja-Doá¹£a from lagna/Moon/Venus.
  // House-set variation (6-house vs 5-house) + severity grading + defearmongering.
  "manglik-detector": ManglikDetector,
  // Lesson 14.6.2's Â§7 interactive: Manglik Cancellation Checker â€” 15+ grouped conditions.
  // Mars sign/house + toggle checklist + cancellation gauge + weighted result.
  "manglik-cancellation-checker": ManglikCancellationChecker,
  // Lesson 14.6.3's Â§7 interactive: KÄla Sarpa Detector â€” nodal-axis configuration check.
  // RÄhu + 7 planet controls + circular diagram + doctrinal debate + honest handling.
  "kala-sarpa-detector": KalaSarpaDetector,
  // Lesson 14.6.4's Â§7 interactive: Pitá¹›-Doá¹£a Indicator â€” chart signatures + remedial framework.
  // Sun/Rahu/Saturn/9th-lord controls + signature gauge + remedy cards + honest limits.
  "pitr-dosha-indicator": PitrDoshaIndicator,
  // Lesson 14.6.5's Â§7 interactive: Kemadruma + Sade Sati Recap â€” two doá¹£as in one surface.
  // Kemadruma (Moon + 2nd/12th + cancellations) + Sade Sati (Moon + Saturn transit + phases).
  "kemadruma-sadesati-recap": KemadrumaSadesatiRecap,
  // Lesson 14.6.6's Â§7 interactive: De-Fearmongering Protocol -- 8-step discipline walker.
  // Doá¹£a selector + step cards + reframe exercise + ethics connection. Closes Chapter 6.
  "defearmongering-protocol": DefearmongeringProtocol,
  // Module 17 Chapter 3 argala explorer: reference-house selector + planet placement +
  // circular diagram with argala/virodha highlights + pair-by-pair net computation +
  // five-step workflow. Serves all four lessons in the argala chapter.
  "argala-explorer": ArgalaExplorer,
  // Lesson 17.3.1 interactive: Argala Concept Explorer -- bolt metaphor SVG,
  // reference-house explorer, mechanism discriminator (argala vs graha-dá¹›á¹£á¹­i vs rÄÅ›i-dá¹›á¹£á¹­i),
  // and what-argala-does/does-not-do checklist.
  "argala-concept-explorer": ArgalaConceptExplorer,
  // Lesson 17.3.2 interactive: Positive Argala 2/4/11 -- counting drill with circular diagram,
  // self-check challenges, strength visualiser, and common-trap spotter.
  "positive-argala-2-4-11": PositiveArgala2411,
  // Lesson 17.3.3 interactive: VirodhÄrgala Counter-Intervention -- obstruction pair explorer,
  // net-effect calculator with +/- count controls, and scenario presets.
  "virodhargala-counter-intervention": VirodhargalaCounterIntervention,
  // Lesson 17.4.1 interactive: Ä€rÅ«á¸ha PÄda Finder -- double-count computation,
  // 1st/7th exception detection, reality-vs-perception comparison, step-by-step walker.
  "arudha-pada-finder": ArudhaPadaFinder,
  // Lesson 17.4.2 interactive: The Twelve Ä€rÅ«á¸ha PÄdas -- complete image-pÄda grid,
  // AL/UL map, Lagna-AL gap interpretation, and common mistakes panel.
  "twelve-arudha-padas": TwelveArudhaPadas,
  // Lesson 17.4.3 interactive: Ä€rÅ«á¸ha PÄda Calculator (Upapada mode) --
  // computes UL from the 12th, shows double-count steps, 2nd-from-UL, planet
  // placements, and triangulation reminders.
  "arudha-pada-calculator": ArudhaPadaCalculator,
  // Lesson 17.4.4 interactive: Ä€rÅ«á¸ha PÄda Explorer -- computes all twelve
  // padas, inspects occupants per pada, compares image vs reality, and builds
  // focused readings (AL, AL+UL, AL+A2, AL+A10, AL+A11).
  "arudha-pada-explorer": ArudhaPadaExplorer,
  // Lesson 17.4.5 interactive: Ä€rÅ«á¸ha Caveat Lab -- exception detector,
  // dual-lordship convention switcher for Scorpio/Aquarius, and tradition
  // disclosure statement generator.
  "arudha-caveat-lab": ArudhaCaveatLab,
  // Lesson 17.5.1 interactive: RÄÅ›i-Dá¹›á¹£á¹­i Visualizer -- click any sign to
  // see the three signs it aspects, with explore mode, drill mode, and
  // rÄÅ›i-dá¹›á¹£á¹­i vs graha-dá¹›á¹£á¹­i comparison.
  "rashi-drishti-visualizer": RashiDrishtiVisualizer,
  // Lesson 17.5.2 interactive: RÄÅ›i-Dá¹›á¹£á¹­i Mapper -- place planets on a chart,
  // select a target, see which signs aspect it, and carry occupants + lords
  // across to read influence and multi-sign convergence.
  "rashi-drishti-mapper": RashiDrishtiMapper,
  // Lesson 17.5.3 interactive: AK-Drishti Synthesizer -- integrates cara-kÄrakas
  // with rÄÅ›i-dá¹›á¹£á¹­i. Select a kÄraka, place it in a sign, populate the chart,
  // and read the incoming sign-aspects with benefic/malefic classification
  // and automated synthesis reading. Includes the four static-reading framework.
  "ak-drishti-synthesizer": AkDrishtiSynthesizer,
  // Lesson 17.7.1 interactive: KÄrakÄá¹Å›a Lagna Locator -- identify the
  // Ä€tmakÄraka from within-sign degrees, select its navÄá¹Å›a (D9) sign, and
  // see that sign projected onto the rÄÅ›i (D1) wheel as a special lagna with
  // houses counted from the KÄrakÄá¹Å›a. Includes source-vs-target diagram.
  "karakamsha-lagna-locator": KarakamshaLagnaLocator,
  // Lesson 17.7.2 interactive: KÄrakÄá¹Å›a Reader -- the five-step soul-purpose
  // read. Walks through AK identification, D9 sign selection, KL placement,
  // occupant + rÄÅ›i-dá¹›á¹£á¹­i aspect reading, and key houses from KL with
  // automated synthesis. Presets for Leo and Scorpio KÄrakÄá¹Å›a examples.
  "karakamsha-reader": KarakamshaReader,
  // Lesson 17.7.3 interactive: Iá¹£á¹­a-DevatÄ Finder -- select the KÄrakÄá¹Å›a,
  // place planets, and see the 12th-from-KL auto-computed with planet-to-deity
  // mapping, empty-house lord fallback, aspecting contributors, and ethical
  // framing (offer, respect, hold lightly).
  "ishta-devata-finder": IshtaDevataFinder,
  // Lesson 17.7.4 interactive: Jaimini Workflow Walkthrough -- six ordered steps
  // assembling every Jaimini tool into one end-to-end reading. Enforces workflow
  // discipline: static tools first (Steps 1-5), timing engine last (Step 6).
  // Includes question presets, running synthesis, timing-first failure demo,
  // and cara-daÅ›Ä / VimÅ›ottarÄ« cross-validation.
  "jaimini-workflow-walkthrough": JaiminiWorkflowWalkthrough,
  // Lesson 17.7.5 interactive: Jaimini Module Closure Map -- seven-chapter arc
  // visualiser, pipeline tracer for four question types, Tier-1-vs-Tier-2
  // comparison, and three discipline cards. Click any chapter to expand its
  // consumes/produces detail; select a question to highlight which chapters
  // the pipeline uses.
  "jaimini-module-closure-map": JaiminiModuleClosureMap,
  // --- Module 18: Lal Kitab ---
  "lal-kitab-tradition-explorer": LalKitabTraditionExplorer,
  "lal-kitab-farman-timeline": LalKitabFarmanTimeline,
  "lal-kitab-classical-comparator": LalKitabClassicalComparator,
  "lal-kitab-status-and-ethics-explorer": LalKitabStatusAndEthicsExplorer,
  "lal-kitab-teva-doctrine-explorer": LalKitabTevaDoctrineExplorer,
  "teva-builder": TevaBuilder,
  "teva-house-reader": TevaHouseReader,
  "lal-kitab-luminary-mapper": LalKitabLuminaryMapper,
  "lal-kitab-mars-mercury-mapper": LalKitabMarsMercuryMapper,
  "lal-kitab-benefic-sorter": LalKitabBeneficSorter,
  "lal-kitab-shadow-triad": LalKitabShadowTriad,
  "lal-kitab-varshphala-concept": LalKitabVarshphalaConcept,
  "lal-kitab-varshphala-computation": LalKitabVarshphalaComputation,
  "lal-kitab-varshphala-reading": LalKitabVarshphalaReading,
  "lal-kitab-tajika-varshaphala-comparator": LalKitabTajikaVarshaphalaComparator,
  "lal-kitab-upaya-family-sorter": LalKitabUpayaFamilySorter,
  "lal-kitab-epistemic-disclosure-lab": LalKitabEpistemicDisclosureLab,
  "lal-kitab-remedy-decision-framework": LalKitabRemedyDecisionFramework,
  "cross-stream-remedy-planner": CrossStreamRemedyPlanner,
  "lal-kitab-recognition-lab": LalKitabRecognitionLab,
  "lal-kitab-stream-mastery-map": LalKitabStreamMasteryMap,
  // Lesson 18.2.4 interactive: Teva vs Lagna Cross-Validator â€” side-by-side dual
  // charts (Teva fixed Aries + ParÄÅ›arÄ« lagna) with planet tracer and discipline
  // check scenarios testing no-conflation. Reinforces frame separation.
  "teva-lagna-cross-validator": TevaLagnaCrossValidator,
  // Lesson 18.3.1 interactive: Blind Planet Explorer â€” concept tab with andhÄ
  // metaphor and characteristics, blind-vs-combust comparison table + scenario
  // classifier, and 6-scenario recognition drill with cause-based reasoning.
  "blind-planet-explorer": BlindPlanetExplorer,
  // Lesson 18.3.2 interactive: Sleeping Planet Explorer â€” concept tab with sutela
  // metaphor and three characteristics, three awakening-mechanism cards, blind/
  // sleeping/awake comparison table, and 6-scenario four-state recognition drill.
  "sleeping-planet-explorer": SleepingPlanetExplorer,
  // Lesson 18.3.3 interactive: Burning Planet Explorer â€” concept tab with jalit
  // metaphor and three characteristics, two cause cards, four-state comparison
  // table with remedy logic, and 6-scenario recognition drill.
  "burning-planet-explorer": BurningPlanetExplorer,
  // Lesson 18.3.4 interactive: Planetary State Synthesizer â€” Chapter 3 capstone.
  // Awake-state concept with lamp metaphor, interactive four-state framework table
  // with remedy-goal mapping, elimination checklist, and 6-scenario capstone drill
  // with yes/no check previews.
  "planetary-state-synthesizer": PlanetaryStateSynthesizer,
  // Lesson 21.3.1 interactive: MÅ«lÄá¹…ka Calculator â€” birth-day-of-month (1-31)
  // input with strict-preservation vs flexibility convention toggle, step-by-step
  // computation, graha-aá¹…ka register + caveat display, 31-day reference table,
  // five-step discipline workflow, and four worked examples.
  "mulanka-calculator": MulankaCalculator,
  // Lesson 21.3.2 interactive: BhÄgyÄá¹…ka Calculator â€” full birth-date input
  // (day/month/year) with strict-preservation vs flexibility convention toggle,
  // step-by-step digit-sum computation, graha-aá¹…ka register + caveat display,
  // combined MÅ«lÄá¹…ka-to-BhÄgyÄá¹…ka lifetime-arc reading, worked examples, and
  // five-step discipline workflow including destiny-determinism refusal layer.
  "bhagyanka-calculator": BhagyankaCalculator,
  // Lesson 21.3.3 interactive: Name-Number (NÄmÄá¹…ka) Calculator â€” three-system
  // name computation (Chaldean / Pythagorean / Vedic-Chaldean hybrid) with
  // strict-preservation vs flexibility convention toggle, letter-by-letter
  // breakdown, graha-aá¹…ka register + caveat display, Pythagorean four-number
  // framework panel, letter-table reference, worked examples, and six-step
  // discipline workflow including name-change refusal layer.
  "mulanka-bhagyanka-namanka-calculator": MulankaBhagyankaNamankaCalculator,
  // Lesson 21.3.4 interactive: Personal Year Number Calculator â€” birth-date +
  // target-calendar-year computation with strict-preservation vs flexibility
  // convention toggle, step-by-step digit-sum breakdown, graha-aá¹…ka register +
  // caveat display, 9-year cycle visualisation, worked examples, and six-step
  // discipline workflow including year-as-determinant refusal layer.
  "personal-year-calculator": PersonalYearCalculator,
  // Lesson 21.4.1 interactive: Name-Correction Rationale Evaluator â€” scenario-
  // based drill for categorising name-change rationales, identifying over-claim
  // layers, applying the convergent-independent-grounds operational test, and
  // reaching approve / partial / refuse verdicts. Includes six-category reference
  // and five-step rationale-evaluation workflow.
  "name-correction-rationale-evaluator": NameCorrectionRationaleEvaluator,
  // Lesson 21.4.2 interactive: Name-Correction Candidate Calculator â€” six-step
  // workflow tool that computes current + candidate Name-Numbers under the chosen
  // system and convention, evaluates graha-compatibility (MITRA/SHATRU/SAMA) with
  // MÅ«lÄá¹…ka / BhÄgyÄá¹…ka, tabulates candidates, and generates a discipline-compliant
  // confirmatory-not-deterministic presentation template.
  "name-correction-candidate-calculator": NameCorrectionCandidateCalculator,
  // Lesson 21.4.3 interactive: Name-Correction Caution Screener â€” scenario-based
  // drill that applies the four-test screen, identifies the six commercial-numerology
  // failure modes, surfaces the three real-cost categories, and practises reaching
  // proceed / preview / revise / refuse verdicts. Includes reference tabs for costs,
  // failure-mode catalogue, and the Chapter 4 integrated refusal-discipline workflow.
  "name-correction-caution-screener": NameCorrectionCautionScreener,
  // Lesson 21.4.4 interactive: Numerology Honest-Handling Inspector â€” scenario-based
  // drill that distinguishes the empirical-kernel from the over-claim layer, identifies
  // the eight over-claim framings, applies the five operational forms of do-no-harm,
  // and reaches proceed / revise / refuse / mixed verdicts. Includes reference tabs
  // for the three-layer holding, the five do-no-harm forms, and the Chapter 1-4
  // integration table.
  "numerology-honest-handling-inspector": NumerologyHonestHandlingInspector,
  // Lesson 21.5.1 interactive: Numerology Compatibility Calculator â€” two-person
  // Mulanka / Bhagyanka / Name-number comparison using MITRA / SHATRU / SAMA
  // graha-friendship vectors with relationship-outcome over-claim refusal.
  "numerology-compatibility-calculator": NumerologyCompatibilityCalculator,
  // Lesson 21.5.2 interactive: Business Name Numerology Calculator â€” business-name
  // candidate computation with founder compatibility, industry-register preference,
  // and pre-launch versus post-launch rebrand discipline.
  "business-name-numerology-calculator": BusinessNameNumerologyCalculator,
  // Lesson 21.5.3 interactive: Object Numerology Calculator â€” house / phone /
  // vehicle digit reduction, personal compatibility, limited-choice recognition,
  // and explicit 4/8 fear-induction refusal.
  "object-numerology-calculator": ObjectNumerologyCalculator,
  // Lesson 21.6.1 interactive: Chart Numerology Integration Tool â€” three-number
  // to natal-graha cross-reference, four alignment configurations, and explicit
  // chart-numerology causation over-claim refusal.
  "chart-numerology-integration-tool": ChartNumerologyIntegrationTool,
  // Lesson 21.6.2 interactive: Numerology Decision Flow â€” apply / refuse /
  // defer gates, authorised consultation modes, and absent-grounds discipline.
  "numerology-decision-flow": NumerologyDecisionFlow,
  // Lesson 21.6.3 interactive: Discipline Statement Builder â€” six-chapter M21
  // synthesis, do-no-harm floor, and five-field practitioner statement worksheet.
  "discipline-statement-builder": DisciplineStatementBuilder,
  "nadi-discipline-statement-builder": NadiDisciplineStatementBuilder,
  // Lesson 22.1.1 interactive: Vastu Origins Explorer â€” historical stream,
  // five-domain spatial scope, classical corpus, and modern feasibility guards.
  "vastu-origins-explorer": VastuOriginsExplorer,
  // Lesson 22.1.2 interactive: Vastu Purusha Mandala Explorer â€” 9x9 / 8x8 /
  // 7x7 grid variants, Brahma-sthana, deity-zone rings, and apartment guards.
  "vastu-purusha-mandala-explorer": VastuPurushaMandalaExplorer,
  // Lesson 22.1.3 interactive: Vastu Five Element Mapper â€” pancha-bhuta
  // direction zones, activity matching, conflicts, and cross-discipline guardrails.
  "vastu-five-element-mapper": VastuFiveElementMapper,
  // Lesson 22.1.4 interactive: Vastu Text Corpus Navigator â€” source layers,
  // five-text corpus, reading sequence, and regional attribution discipline.
  "vastu-text-corpus-navigator": VastuTextCorpusNavigator,
  // Lesson 22.2.1 interactive: Vastu Cardinal Direction Lords â€” Indra, Yama,
  // Varuna, Kubera, deity-quality judgments, and activity matching.
  "vastu-cardinal-direction-lords": VastuCardinalDirectionLords,
  // Lesson 22.2.2 interactive: Vastu Intercardinal Double Quality â€” Ishana,
  // Agni, Nirriti, Vayu, convergent deity-element matching, and fear guardrails.
  "vastu-intercardinal-double-quality": VastuIntercardinalDoubleQuality,
  // Lesson 22.2.3 interactive: Vastu Room Direction Synthesizer â€” room-by-room
  // primary, secondary, mitigation, and prohibited placement workflow.
  "vastu-room-direction-synthesizer": VastuRoomDirectionSynthesizer,
  // Lesson 22.3.1 interactive: Vastu Earth Water Axis -- NE/SW polar axis,
  // water and weight placement, elevation discipline, and mitigation cues.
  "vastu-earth-water-axis": VastuEarthWaterAxis,
  // Lesson 22.3.2 interactive: Vastu Fire Air Axis -- SE/NW compatible-flow
  // axis, kitchen discipline, ventilation path, and proportional mitigation.
  "vastu-fire-air-axis": VastuFireAirAxis,
  // Lesson 22.3.3 interactive: Vastu Brahmasthana Center -- central 3x3
  // Akasha discipline, centre-violation severity, and apartment mitigation.
  "vastu-brahmasthana-center": VastuBrahmasthanaCenter,
  // Lesson 22.4.1 interactive: Vastu Plot Selection Evaluator -- bhu-pariksha
  // shape, extension/cut, road-facing, topography, and proportional verdict.
  "vastu-plot-selection-evaluator": VastuPlotSelectionEvaluator,
  // Lesson 22.4.2 interactive: Vastu Ground Slope Evaluator -- slope,
  // drainage, construction phase, vertical massing, and grading feasibility.
  "vastu-ground-slope-evaluator": VastuGroundSlopeEvaluator,
  // Lesson 22.4.3 interactive: Vastu House Shape Evaluator -- building form,
  // corner integrity, axis rotation, and modern-context mitigation.
  "vastu-house-shape-evaluator": VastuHouseShapeEvaluator,
  // Lesson 22.4.4 interactive: Vastu Extensions Cuts Evaluator -- extension
  // versus cut asymmetry, directional severity, size, and context handling.
  "vastu-extensions-cuts-evaluator": VastuExtensionsCutsEvaluator,
  // Lesson 22.5.1 interactive: Vastu Remedy Framework -- severity-calibrated
  // architectural, symbolic, yantra/pyramid, and ritual remediation tiers.
  "vastu-remedy-framework": VastuRemedyFramework,
  // Lesson 22.5.2 interactive: Vastu Apartment Office Planner -- unit-level
  // mandala placement for apartments, offices, retail, and commercial spaces.
  "vastu-apartment-office-planner": VastuApartmentOfficePlanner,
  // Lesson 22.5.3 interactive: Vastu Mirror Remedy Planner -- wall direction,
  // room context, sensitive reflection targets, and honest modern attribution.
  "vastu-mirror-remedy-planner": VastuMirrorRemedyPlanner,
  // Lesson 22.6.1 interactive: Vastu Honest Handling Audit -- four-test screen
  // for empirical kernel, demolition prohibition, cost-benefit, and overclaim.
  "vastu-honest-handling-audit": VastuHonestHandlingAudit,
  // Lesson 22.6.2 interactive: Vastu Decision Framework -- when to flag,
  // defer, refuse, and sequence the four-tier remediation cascade.
  "vastu-decision-framework": VastuDecisionFramework,
  // Lesson 22.6.3 interactive: Vastu Chart Integration -- 4H,
  // residential karakas, property houses, and dik-pala-graha context.
  "vastu-chart-integration": VastuChartIntegration,
  // Lesson 22.6.4 interactive: Vastu Module Closure -- six-chapter
  // synthesis, do-no-harm commitments, and practitioner statement builder.
  "vastu-module-closure": VastuModuleClosure,
  // Lesson 18.4.4 interactive: Lal Kitab Graha Clusters â€” Chapter 4 capstone.
  // Accordion clusters for Saturn / RÄhu / Ketu, 6-item quiz, and all-nine-graha
  // summary table with unifying concrete-object pattern.
  "lal-kitab-graha-clusters": LalKitabGrahaClusters,
  "gochara-intro": GocharaIntro,
  "natal-relative-counter": NatalRelativeCounter,
  "transit-computer": TransitComputer,
  "three-reference-reader": ThreeReferenceReader,
  "sade-sati-tracker": SadeSatiTracker,
  "sade-sati-phases": SadeSatiPhases,
  "sade-sati-favourability": SadeSatiFavourability,
  "sade-sati-cancellation-checker": SadeSatiCancellationChecker,
  "sade-sati-communication-guide": SadeSatiCommunicationGuide,
  "kantaka-shani-reader": KantakaShaniReader,
  "saturn-transit-map": SaturnTransitMap,
  "guru-transit-reader": GuruTransitReader,
  "guru-saturn-conjunction-reader": GuruSaturnConjunctionReader,
  "nodal-transit-tracker": NodalTransitTracker,
  "nodal-axis-house-reader": NodalAxisHouseReader,
  "eclipse-significance-checker": EclipseSignificanceChecker,
  "eclipse-calendar": EclipseCalendar,
  "vedha-intro": VedhaIntro,
  "vedha-table-lookup": VedhaTableLookup,
  "vedha-applicator": VedhaApplicator,
  "cross-stream-transit-intro": CrossStreamTransitIntro,
  "transit-workflow-workbench": TransitWorkflowWorkbench,
  // --- merged: components built in the local reconciliation session (not on remote) ---
  "career-varga-workflow": CareerVargaWorkflow,
  "chaturthamsha-calculator": ChaturthamshaCalculator,
  "chaturvimshamsha-calculator": ChaturvimshamshaCalculator,
  "children-varga-workflow": ChildrenVargaWorkflow,
  "dashamsha-calculator": DashamshaCalculator,
  "dvadashamsha-calculator": DvadashamshaCalculator,
  "gaja-kesari-detector": GajaKesariDetector,
  "graha-drishti-wheel": GrahaDrishtiWheel,
  "khavedamsha-akshavedamsha-calculator": KhavedamshaAkshavedamshaCalculator,
  "marriage-varga-workflow": MarriageVargaWorkflow,
  "saptamsha-calculator": SaptamshaCalculator,
  "saptavimshamsha-calculator": SaptavimshamshaCalculator,
  "shodashamsha-calculator": ShodashamshaCalculator,
  "spiritual-trio-comparator": SpiritualTrioComparator,
  "sub-lord-calculator": SubLordCalculator,
  "substrate-ethics-checklist": SubstrateEthicsChecklist,
  "vimshamsha-calculator": VimshamshaCalculator,
  "ashtakavarga-intro": AshtakavargaIntro,
  "ashtakavarga-contributors": AshtakavargaContributors,
  "contribution-table-demo": ContributionTableDemo,
  "lagna-contributor-note": LagnaContributorNote,
  "bhinna-builder": BhinnaBuilder,
  "bhinna-total-checker": BhinnaTotalChecker,
  "bhinna-interpreter": BhinnaInterpreter,
  "mars-bhinna-walkthrough": MarsBhinnaWalkthrough,
  "sav-builder": SavBuilder,
  "sav-checksum": SavChecksum,
  "sav-interpreter": SavInterpreter,
  "trikona-reducer": TrikonaReducer,
  "ekadhipatya-reducer": EkadhipatyaReducer,
  "reduction-order-demo": ReductionOrderDemo,
  "full-reduction-walkthrough": FullReductionWalkthrough,
  "yoga-sav-auditor": YogaSavAuditor,
  "transit-bav-modulator": TransitBavModulator,
  "ashtakavarga-stream-map": AshtakavargaStreamMap,
  "karma-framework-map": KarmaFrameworkMap,
  "prarabdha-illustration": PrarabdhaIllustration,
  "mitigation-vs-cure": MitigationVsCure,
  "remedy-authority-map": RemedyAuthorityMap,
  "mantra-theory-explainer": MantraTheoryExplainer,
  "mantra-traditions-map": MantraTraditionsMap,
  "foundational-mantra-player": FoundationalMantraPlayer,
  "mantra-safety-checklist": MantraSafetyChecklist,
  "graha-yantra-gallery": GrahaYantraGallery,
  "tantra-context-note": TantraContextNote,
  "yantra-anatomy": YantraAnatomy,
  "navaratna-table": NavaratnaTable,
  "uparatna-table": UparatnaTable,
  "gemstone-safety-checklist": GemstoneSafetyChecklist,
  "protective-discipline-checklist": ProtectiveDisciplineChecklist,
  "graha-dana-table": GrahaDanaTable,
  "upavasa-guide": UpavasaGuide,
  "puja-vrata-guide": PujaVrataGuide,
  "cross-cultural-care-guide": CrossCulturalCareGuide,
  "remedy-matching-explorer": RemedyMatchingExplorer,
  "lal-kitab-upaya-intro": LalKitabUpayaIntro,
  "restraint-doctrine-card": RestraintDoctrineCard,
  "kp-lineage-timeline": KPLineageTimeline,
  "kp-reader-series-explorer": KPReaderSeriesExplorer,
  "kp-precision-resolution-comparator": KPPrecisionResolutionComparator,
  "kp-cusp-calculator": KpCuspCalculator,
  "kp-vs-parashari-cusp-comparator": KpVsParashariCuspComparator,
  "kp-cusp-verifier": KpCuspVerifier,
  "placidus-house-visualizer": PlacidusKpConvention,
  "249-sub-explorer": Kp249SubExplorer,
  "sub-sub-recursion-explorer": SubSubRecursionExplorer,
  "sub-lord-fluency-trainer": SubLordFluencyTrainer,
  "cuspal-sub-lord-finder": CuspalSubLordFinder,
  "cuspal-sub-lord-visualizer": CuspalSubLordVisualizer,
  "planet-sub-lord-modulator": PlanetSubLordModulator,
  "disposition-rules-workbench": DispositionRulesWorkbench,
  "ruling-planets-role-explorer": RulingPlanetsRoleExplorer,
  "ruling-planets-calculator": RulingPlanetsCalculator,
  "ruling-planets-confirmation-workbench": RulingPlanetsConfirmationWorkbench,
  "significator-hierarchy-explorer": SignificatorHierarchyExplorer,
  "first-order-significator-visualizer": FirstOrderSignificatorVisualizer,
  "second-order-significator-workbench": SecondOrderSignificatorWorkbench,
  "significator-chain-builder": SignificatorChainBuilder,
  "kp-horary-number-selector": KpHoraryNumberSelector,
  "kp-horary-chart-caster": KpHoraryChartCaster,
  "kp-horary-cuspal-verdict": KpHoraryCuspalVerdict,
  "kp-horary-marriage-workbench": KpHoraryMarriageWorkbench,
  "kp-horary-job-workbench": KpHoraryJobWorkbench,
  "kp-horary-stream-comparator": KpHoraryStreamComparator,
  "kp-parashari-side-by-side": KpParashariSideBySide,
  "kp-parashari-convergences": KpParashariConvergences,
  "kp-parashari-divergences": KpParashariDivergences,
  "kp-cross-stream-router": KpCrossStreamRouter,
  "kp-modified-vimshottari-explorer": KpModifiedVimshottariExplorer,
  "kp-synthesis-capstone": KpSynthesisCapstone,
  "tajika-origins-timeline": TajikaOriginsTimeline,
  "tajika-neelakanthi-structure": TajikaNeelakanthiStructure,
  "tajika-texts-catalogue": TajikaTextsCatalogue,
  "tajika-comparative-matrix": TajikaComparativeMatrix,
  "tajika-ithasala-explorer": TajikaIthasalaExplorer,
  "tajika-three-yoga-comparator": TajikaThreeYogaComparator,
  "tajika-twelve-yogas-surveyor": TajikaTwelveYogasSurveyor,
  "tajika-yogas-application-wizard": TajikaYogasApplicationWizard,
  "tajika-saham-concept-explorer": TajikaSahamConceptExplorer,
  "tajika-auspicious-sahams-comparator": TajikaAuspiciousSahamsComparator,
  "tajika-life-event-sahams-surveyor": TajikaLifeEventSahamsSurveyor,
  "tajika-sahams-application-wizard": TajikaSahamsApplicationWizard,
  "tajika-muntha-concept-explorer": TajikaMunthaConceptExplorer,
  "tajika-varshesha-selector": TajikaVarsheshaSelector,
  "tajika-varshaphala-caster": TajikaVarshaphalaCaster,
  "tajika-varshaphala-synthesizer": TajikaVarshaphalaSynthesizer,
  "tajika-prashna-concept-explorer": TajikaPrashnaConceptExplorer,
  "tajika-prashna-judgment-methodology": TajikaPrashnaJudgmentMethodology,
  "tajika-vs-kp-horary-comparator": TajikaVsKpHoraryComparator,
  "tajika-cross-stream-synthesis": TajikaCrossStreamSynthesis,
  "tajika-honest-handling": TajikaHonestHandling,
  "m19-closure": M19Closure,
  "evidentiary-layers": EvidentiaryLayers,
  "manuscript-material-map": ManuscriptMaterialMap,
  "school-comparator": SchoolComparator,
  "stream-position-map": StreamPositionMap,
  "bhrigu-flow": BhriguFlow,
  "agastya-flow": AgastyaFlow,
  "sublineage-map": SublineageMap,
  "grantha-accessibility-map": GranthaAccessibilityMap,
  "matching-protocol-flow": MatchingProtocolFlow,
  "session-flow": SessionFlow,
  "kanda-map": KandaMap,
  "shloka-decoder": ShlokaDecoder,
  "reader-due-diligence": ReaderDueDiligence,
  "nadi-verification-sandbox": NadiVerificationSandbox,
  "nadi-commercial-explorer": NadiCommercialExplorer,
  "nadi-decision-framework": NadiDecisionFramework,
  "nadi-honest-handling-instance": NadiHonestHandlingInstance,
  "vedanga-jyotisha-yuga-visualizer": VedangaJyotishaYugaVisualizer,
  "classical-canon-stratigraphy": ClassicalCanonStratigraphy,
  "tajika-loanword-translator": TajikaLoanwordTranslator,
  "modern-stream-architects": ModernStreamArchitects,
  "do-no-harm-ahimsa": DoNoHarmAhimsa,
  "truth-with-compassion": TruthWithCompassion,
  "confidentiality": ConfidentialityAuditor,
  "competence-boundaries": CompetenceBoundaries,
  "empowerment-not-dependency": EmpowermentNotDependency,
  "reasonable-fees": ReasonableFees,
  "session-protocols": SessionProtocols,
  "follow-up-boundaries": FollowUpBoundaries,
  "post-tier-1-reading-list": PostTier1ReadingList,
  "community-participation": CommunityParticipation,
  "self-chart-tracking": SelfChartTracking,
  "tier-2-preview": Tier2Preview,
  "24-module-synthesis": Module24SynthesisDojo,
  "practitioner-pledge": PractitionerPledgeSimulator,
  "curriculum-completion": CurriculumCompletionLedger,
  "path-forward": PathForwardRoadmap,
  "lagna-suddhi-evaluator": LagnaSuddhiEvaluator,
  "four-pillar-integrator": FourPillarIntegrator,
};

export function resolveInteractive(slug: string | undefined): InteractiveComponentType | null {
  if (!slug) return null;
  return INTERACTIVE_REGISTRY[slug] ?? null;
}


