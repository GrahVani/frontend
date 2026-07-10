/**
 * Interactive component registry — slug-to-module mapping.
 *
 * Maps a curriculum-side slug to the module path and export name.
 * This file is intentionally ZERO-IMPORT — it contains only string
 * data.  The actual dynamic import happens at render time in
 * DynamicInteractive.tsx, so Turbopack never compiles more than
 * the single component the learner actually opens.
 */

export interface InteractiveEntry {
  /** Relative module path from the interactive/ directory (no extension). */
  path: string;
  /** Named export inside that module. null means default export. */
  exportName: string | null;
}

export const INTERACTIVE_REGISTRY: Record<string, InteractiveEntry> = {
  // The relationship diagram is the FULL version Lesson 2 declares it needs:
  // cluster overlay + Jyotiá¹£a interlocks + sÄá¹…ga closing panel. Lesson 1 still
  // uses the body-map (sage figure with six luminous body parts) â€” its lesson
  // page route renders <VedangaBodyMap/> directly via the `scenes` prop and
  // ignores the registry mapping. Future lessons in this chapter family pick
  // up the relationship diagram via this registry entry.
  "vedanga-vs-vedanta-comparator": { path: "vedanga-vs-vedanta-comparator", exportName: "VedangaVsVedantaComparator" },
  "sloka-recitation-frame": { path: "sloka-recitation-frame", exportName: "SlokaRecitationFrame" },
  // Lesson 2's Â§7 flagship: Jyotiá¹£a-SÄá¹…ga Synthesis Hub (hub-and-spoke
  // interlock viz + sÄá¹…ga scenario explorer in a two-tab composition).
  // Lesson 3's Â§4 explorer: Jyotiá¹£a vs Western tropical vs sun-sign pop
  // comparator â€” six discriminating dimensions Ã— three tradition-categories.
  // Lesson 3's Â§7 flagship: Disambiguation Dojo (Indo-Hellenistic lineage
  // timeline + ayanÄá¹Å›a drift slider + 5-scenario disambiguation drill in
  // a two-tab composition).
  // Lesson 4's Â§4 explorer: Karma Typology Explorer â€” 4-fold karma cycle
  // SVG diagram with visibly-clickable karma-type nodes + side-panel
  // active-detail (definition, etymology, properties, jyotiá¹£a-sees,
  // agent-control).
  // Lesson 4's Â§7 flagship: Karma-Prediction Dojo (two-tab â€” Cycle in
  // Motion with overlay toggles + Indication Translator skill drill with
  // 5 deterministic-to-indication translation scenarios).
  // Lesson 2.1's Â§4 explorer: Historical Timeline â€” horizontal SVG with 12
  // major Jyotiá¹£a authors/texts staggered on the academic-Indology
  // chronological axis. Traditional-dating overlay shows divergences.
  // Lesson 2.1's Â§7 flagship: Jyotiá¹£a Citation Dojo (two-tab â€” Dating
  // Divergence Atlas + Citation Discipline Drill with 5 scenarios).
  // Lesson 2.2's Â§4 explorer: BPHS Recension Comparator â€” ParÄÅ›ara duality
  // diptych + 10 prakaraá¹‡a-plates with Santhanam adhyÄya ranges and
  // cross-recension notes.
  // Lesson 2.2's Â§7 flagship: BPHS Citation Dojo â€” VimÅ›ottarÄ« verse cross-
  // reference + 5-scenario BPHS citation discipline drill.
  // Lesson 2.3's Â§4 explorer: VarÄhamihira Skandha Coverage Explorer â€”
  // date-anchor hero + 3 skandha plates (horÄ/saá¹hitÄ/gaá¹‡ita) + dating
  // methodology + both-anchors framework comparison diptych.
  // Lesson 2.3's Â§7 flagship: VarÄhamihira Synthesis Dojo â€” author cross-
  // dating (5 authors relative to VarÄhamihira anchor) + 5-scenario drill.
  // Lesson 2.4's Â§4 explorer: Medieval Codifier Relative-Dating Explorer â€”
  // 3-layer ParÄÅ›ari-tradition lineage + 4 codifier plates + compounding
  // uncertainty visualization.
  // Lesson 2.4's Â§7 flagship: Medieval Synthesis Dojo â€” 5-scenario drill
  // on medieval-codifier dating + citation discipline.
  // Lesson 2.5's Â§4 explorer: ParÄÅ›ari â‡„ JaiminÄ« Parallel-Tradition Explorer
  // â€” diptych hero + 4-layer side-by-side comparison + sÅ«tra-vs-verse genre
  // + 5 distinctive JaiminÄ« doctrines + same-JaiminÄ« identity question.
  // Lesson 2.5's Â§7 flagship: JaiminÄ« Second-Tradition Dojo â€” two-tab
  // (Doctrinal-Pair Atlas across 6 pairs + 5-scenario tradition-attribution
  // drill).
  "jaimini-tradition-map": { path: "jaimini-tradition-map", exportName: "JaiminiTraditionMap" },
  "sutra-interpretation-lab": { path: "sutra-interpretation-lab", exportName: "SutraInterpretationLab" },
  "jaimini-interpreter-comparator": { path: "jaimini-interpreter-comparator", exportName: "JaiminiInterpreterComparator" },
  "cara-karaka-ranker": { path: "cara-karaka-ranker", exportName: "CaraKarakaRanker" },
  "cara-karaka-role-assigner": { path: "cara-karaka-role-assigner", exportName: "CaraKarakaRoleAssigner" },
  "amatyakaraka-career-workbench": { path: "amatyakaraka-career-workbench", exportName: "AmatyakarakaCareerWorkbench" },
  "atmakaraka-king-lens": { path: "atmakaraka-king-lens", exportName: "AtmakarakaKingLens" },
  "atmakaraka-saturn-king-lens-lab": { path: "atmakaraka-saturn-king-lens-lab", exportName: "AtmakarakaSaturnKingLensLab" },
  "karaka-cross-validation": { path: "karaka-cross-validation", exportName: "KarakaCrossValidation" },
  "amk-tenth-lord-comparison-workbench": { path: "amk-tenth-lord-comparison-workbench", exportName: "AmkTenthLordComparisonWorkbench" },
  "cara-dasha-mechanism": { path: "cara-dasha-mechanism", exportName: "CaraDashaMechanism" },
  "cara-period-calculator": { path: "cara-period-calculator", exportName: "CaraPeriodCalculator" },
  "cara-sequence-builder": { path: "cara-sequence-builder", exportName: "CaraSequenceBuilder" },
  "cara-dasha-timeline": { path: "cara-dasha-timeline", exportName: "CaraDashaTimeline" },
  "dual-dasha-timeline": { path: "dual-dasha-timeline", exportName: "DualDashaTimeline" },
  // Lesson 2.6's Â§4 explorer: Four-Stream Landscape Explorer â€” hero diptych
  // (4 streams equal-weight) + modern-primary-vs-revival distinction +
  // KP founder plate + 5 KP contributions + Lal Kitab founder plate + 6 LK
  // contributions + 3 modern-primary status criteria.
  // Lesson 2.6's Â§7 flagship: Four-Stream Synthesis Dojo â€” two-tab
  // (Stream Landscape Matrix with classification-filter + cross-stream topic
  // deep-dive across 4 streams + 5-scenario Evaluative Reasoning Drill).
  // This is the Chapter-2 capstone Bloom-Evaluate practice surface.
  // Lesson 3.1's Â§4 explorer: Three Skandha Curriculum Map â€” L2 pattern
  // (triangle painting LEFT + clickable skandha rows RIGHT).
  // Lesson 3.1's Â§7 flagship: Three Skandha Synthesis Dojo â€” two-tab
  // (Stream Ã— Skandha Matrix + 5-scenario Evaluative Drill).
  // Lesson 3.2's Â§4 explorer: Seven Sub-Branches Explorer â€” L2 pattern
  // (manuscript diagram LEFT + clickable sub-branch rows RIGHT).
  // Lesson 3.2's Â§7 flagship: Seven Sub-Branches Synthesis Dojo â€” two-tab
  // (Stream Ã— Sub-Branch Matrix + 5-scenario Evaluative Drill).
  // Lesson 3.3's Â§4 explorer: Grahvani Coverage Matrix Explorer â€” L2 pattern
  // (navigational map LEFT + stream-filtered coverage cards RIGHT).
  // Lesson 3.3's Â§7 flagship: Grahvani Coverage Synthesis Dojo â€” two-tab
  // (Full 4Ã—7 Coverage Matrix + 5-scenario Evaluative Drill).
  // Lesson 4.1's Â§4 explorer: Regional Schools Explorer â€” L2 pattern
  // (map image LEFT + tabbed school explorer RIGHT with stream concentrations).
  // Lesson 4.1's Â§7 flagship: Regional Schools Synthesis Dojo â€” two-tab
  // (6Ã—4 Regional Schools Matrix + teacher lookup + 5-scenario Evaluative Drill).
  // Lesson 4.2's Â§4 explorer: Lineage Threads Network Explorer â€” L2 pattern
  // (network diagram LEFT + tabbed lineage explorer RIGHT with sub-lineages).
  // Lesson 4.2's Â§7 flagship: Lineage Threads Synthesis Dojo â€” two-tab
  // (Lineage Comparison Matrix + 5-scenario Evaluative Drill).
  // Lesson 4.3's Â§4 explorer: Three-Lineage Comparison Chart Analyzer â€” L2 pattern
  // (chart diagram LEFT + tabbed three-lineage analyzer RIGHT + convergence/divergence toggle).
  // Lesson 4.3's Â§7 flagship: Lineage Matters Synthesis Dojo â€” two-tab
  // (Integrated Synthesis View + 5-scenario Evaluative Drill).
  "lineage-matters-synthesis-dojo": { path: "lineage-matters-synthesis-dojo", exportName: "LineageMattersSynthesisDojo" },
  // Lesson 2.1.1's Â§7 interactive: Zodiac Reference Frame Explorer â€”
  // Earth-centered diagram showing sidereal vs tropical zodiacs with
  // clickable hotspots (sidereal zero, tropical zero, vernal equinox,
  // summer solstice, ayanÄá¹Å›a gap, Spica, Earth's axis, ecliptic,
  // celestial equator).
  // Lesson 2.1.2's Â§7 interactive: Precession Visualizer â€” clickable SVG
  // diagram with epoch slider, by-hand calculator, and classical-vs-modern
  // comparison tabs.
  // Lesson 2.1.3's Â§7 interactive: Zodiac Tradition Reasoning Comparator â€”
  // side-by-side comparison of Vedic-sidereal vs Western-tropical reasoning
  // across four dimensions (doctrinal, observational, historical, comparative).
  "zodiac-tradition-comparator": { path: "zodiac-tradition-comparator", exportName: null },
  // Lesson 2.1.4's Â§7 interactive: Tropical-Sidereal Conversion Calculator â€”
  // birth-date Sun-sign calculator + longitude converter showing graha-in-rÄÅ›i
  // shifts, daÅ›Ä consequences, and naká¹£atra alignment effects.
  // Lesson 2.2.1's Â§7 interactive: AyanÄá¹Å›a Definition Explorer â€”
  // 4-tab interactive: Definition (visual gap diagram + conversion calculator),
  // Etymology (Sanskrit compound breakdown), 7 Conventions (comparison table),
  // Stream Matcher (stream â†’ ayanÄá¹Å›a mapping).
  // Lesson 2.2.5's Â§7 interactive: Comparative AyanÄá¹Å›a Explorer â€” side-by-side
  // comparison of all 7 conventions, convention detail profiles, alignment-epoch
  // timeline, practitioner-community mapping, and multi-ayanÄá¹Å›a honesty discipline.
  // Lesson 2.2.6's Â§7 interactive: AyanÄá¹Å›a Decision Framework Flowchart â€”
  // scenario â†’ decision mapping, per-context rules table, multi-lineage synthesis,
  // do-not-mix visualiser, software verification, and Chapter 2 capstone panel.
  // Lesson 2.3.1's Â§9 interactive: Yuga Proportion Visualiser â€” three-mode
  // proportional bar visualiser (proportion / absolute-duration / saá¹dhyÄ)
  // with hover/click detail panels and embedded formative checkpoints.
  // Lesson 2.3.2's Â§10 interactive: Yuga Cycle Explorer â€” three-zoom-level
  // visual scrubber (MahÄ-Yuga / Manvantara / Kalpa) with human/divya toggle,
  // present-epoch marker, and modern cosmology benchmarks.
  // Lesson 2.3.3's Â§9 interactive: Traditional vs Academic Dating Comparator â€”
  // three-position side-by-side (Traditional Vedic / Yukteshwar / Academic-Indology)
  // with synthesis honesty dial.
  // Lesson 2.3.4's Â§10 interactive: Yuga Dependence Classifier â€” scenario-based
  // yuga-dependent vs yuga-independent classification drill with three difficulty levels.
  // Lesson 2.4.1's Â§9 interactive: Day-Type Comparator â€” side-by-side comparison
  // of four day-types (sÄvana / sidereal / lunar / solar) with operational-scope quiz.
  // Lesson 2.4.2's Â§10 interactive: Sunrise at Any Latitude â€” 7-step sunrise
  // computation calculator with edge-case detection (polar day/night) and
  // worked-example library (Mumbai, Delhi, Singapore).
  // Lesson 2.4.3's Â§8 interactive: Sidereal Day Explorer â€” top-down Earth view
  // with time-scrubber, differential visualisation (~3m 56s), annual accumulation,
  // and operational-context picker.
  // Lesson 2.4.4's Â§10 interactive: Tithi from Sun-Moon â€” longitude scrubbers,
  // circular elongation arc visualisation, tithi computation, variable-duration
  // mode, and edge-case detection (ká¹£aya/vá¹›ddhi tithi).
  // Lesson 2.4.5's Â§10 interactive: Saá¹…krÄnti Tracker â€” Sun's annual journey
  // through 12 rÄÅ›is with UttarÄyaá¹‡a/Daká¹£iá¹‡Äyana distinction, sidereal-vs-tropical
  // toggle, multi-century drift visualisation, and festival overlay.
  // Lesson 3.1.1's Â§4 explorer: Tithi Angle Visualizer â€” circular Sun-Moon
  // orbit with 12Â° segment overlay + real-time tithi computation + paká¹£a
  // indicator + paÃ±cÄá¹…ga reading panel.
  "tithi-angle-visualizer": { path: "tithi-angle-visualizer", exportName: "TithiAngleVisualizer" },
  // Lesson 3.1.1's Â§7 flagship: Tithi Calculator Dojo â€” step-by-step formula
  // breakdown with editable Sun/Moon longitudes + preset scenarios + elapsed
  // fraction visualisation.
  "tithi-calculator-dojo": { path: "tithi-calculator-dojo", exportName: "TithiCalculatorDojo" },
  // Lesson 3.1.2's Â§7 flagship: Tithi-Deity Wheel â€” circular 30-tithi visual
  // explorer with click-for-attributes, quality-filter highlight, and
  // festival-major badge system.
  // Lesson 3.1.1's Â§4 sub-component: Tithi Context Matcher â€” scenario-based
  // discrimination drill for paÃ±cÄá¹…ga-tithi vs astronomical-instantaneous-tithi.
  "tithi-context-matcher": { path: "tithi-context-matcher", exportName: "TithiContextMatcher" },
  // Lesson 3.1.2's Â§4 explorer: Åšukla Tithi Strip â€” horizontal scrollable
  // enumeration of the 15 Å›ukla paká¹£a tithis with deity, quality, and
  // festival cards.
  "shukla-tithi-strip": { path: "shukla-tithi-strip", exportName: "ShuklaTithiStrip" },
  // Lesson 3.1.3's Â§7 flagship: Ká¹›á¹£á¹‡a Festival Timeline â€” vertical timeline
  // of the 15 ká¹›á¹£á¹‡a paká¹£a tithis with festival-major highlights, Pitá¹› Paká¹£a
  // band, and click-to-reveal detail panel.
  // M3-C1-L1's Â§7 flagship: PaÃ±cÄá¹…ga Builder â€” computes all 5 limbs
  // (tithi + vÄra + naká¹£atra + yoga + karaá¹‡a) for any date with visual diagram.
  // Lesson 23.1.2 interactive: Panchanga Five-Limb Framework -- limb
  // definitions, derivation hierarchy, and trade-off aggregation.
  "panchanga-five-limb-framework": { path: "panchanga-five-limb-framework", exportName: "PanchangaFiveLimbFramework" },
  // Lesson 23.1.3 interactive: Muhurta Text Corpus Navigator -- classical
  // source layers, attribution discipline, and reading sequence.
  "muhurta-text-corpus-navigator": { path: "muhurta-text-corpus-navigator", exportName: "MuhurtaTextCorpusNavigator" },
  // Lesson 23.1.4 interactive: Muhurta Comparative Position Explorer --
  // stream-variant inspector, shared-principles reference, sva-dharma framework.
  "muhurta-comparative-position-explorer": { path: "muhurta-comparative-position-explorer", exportName: "MuhurtaComparativePositionExplorer" },
  // Lesson 23.2.1 interactive: Tithi Classification Explorer --
  // five-fold matcher, 30-tithi wheel, scenario screener, integration workflow.
  "tithi-classification-explorer": { path: "tithi-classification-explorer", exportName: "TithiClassificationExplorer" },
  // Lesson 23.2.2 interactive: Vara Lord Effects Explorer --
  // weekday-event matcher, lord reference cards, scenario screener, integration workflow.
  "vara-lord-effects-explorer": { path: "vara-lord-effects-explorer", exportName: "VaraLordEffectsExplorer" },
  // Lesson 23.2.3 interactive: Nakshatras Categorized Explorer --
  // category-event matcher, category reference cards, 27-nakshatra map, scenario screener, integration workflow.
  "nakshatras-categorized-explorer": { path: "nakshatras-categorized-explorer", exportName: "NakshatrasCategorizedExplorer" },
  // Lesson 3.1.4's Â§7 flagship: NandÄ-BhadrÄ-JayÄ-RiktÄ-PÅ«rá¹‡Ä Classifier â€”
  // quality-event matcher with contextual-quality discipline override visualization.
  // Lesson 3.1.5's Â§7 flagship: AmÄnta-PÅ«rá¹‡imÄnta Converter â€” paká¹£a-month converter,
  // festival cross-reference cards, and regional identifier.
  // Lesson 23.1.1 interactive: Muhurta Concept Scope -- 48-minute
  // time-unit grid and discipline-scope classifier.
  "muhurta-concept-scope": { path: "muhurta-concept-scope", exportName: "MuhurtaConceptScope" },
  // Lesson 23.6.3 interactive: M23 Closure -- cumulative module synthesis
  // with chapter wheel, hook timeline, self-assessment, and ongoing-development.
  "m23-closure": { path: "m23-closure", exportName: "M23Closure" },
  // Lesson 23.6.2 interactive: Muhurta Decision Framework -- stakes-calibrated
  // engagement with decision-tree, stakes gauge, case files, and method matrix.
  "muhurta-decision-framework": { path: "muhurta-decision-framework", exportName: "MuhurtaDecisionFramework" },
  // Lesson 23.6.1 interactive: Muhurta Honest Handling -- cumulative
  // honest-handling synthesis across M23: rarity dial, case files,
  // daivajna wheel, instance map, and common-mistake gallery.
  "muhurta-honest-handling": { path: "muhurta-honest-handling", exportName: "MuhurtaHonestHandling" },
  // Lesson 23.5.1 interactive: Panchaka Cancellation -- 27-nakshatra wheel,
  // pañca-niṣiddha-karma case files, distinction drill, and mitigation panel.
  "panchaka-cancellation": { path: "panchaka-cancellation", exportName: "PanchakaCancellation" },
  // Lesson 23.5.2 interactive: Rāhu-Kāla + Yamagaṇḍa + Gulika-Kāla explorer —
  // 8-portion daylight wheel, 24h timeline, case-file verdict drill, 7-day
  // mnemonic pattern table, and seasonal-duration variance explorer.
  "rahu-kala-yamaganda-explorer": { path: "rahu-kala-yamaganda-explorer", exportName: "RahuKalaYamagandaExplorer" },
  // Lesson 3.1.6's Â§7 flagship: Tithi-MuhÅ«rta Introductory Judgment â€” scenario-based
  // muhÅ«rta quality trainer with multi-element synthesis preview.
  // Lesson 3.2.1's Â§4 explorer: VÄra-Graha Wheel â€” circular 7-segment visual
  // explorer with click-for-attributes, element-filter highlight, and
  // planetary-type filter system.
  // Lesson 3.2.2's Â§7 flagship: Chaldean Planetary HorÄ Explorer â€” two-panel
  // composition (Chaldean order strip + horÄ sequence generator) with
  // 24 mod 7 = 3 principle explanation.
  "chaldean-letter-table-explorer": { path: "chaldean-letter-table-explorer", exportName: "ChaldeanLetterTableExplorer" },
  "pythagorean-letter-table-explorer": { path: "pythagorean-letter-table-explorer", exportName: "PythagoreanLetterTableExplorer" },
  "vedic-anka-letter-table-explorer": { path: "vedic-anka-letter-table-explorer", exportName: "VedicAnkaLetterTableExplorer" },
  "numerology-system-selection": { path: "numerology-system-selection", exportName: "NumerologySystemSelection" },
  "digit-meaning-explorer": { path: "digit-meaning-explorer", exportName: "DigitMeaningExplorer" },
  "master-number-explorer": { path: "master-number-explorer", exportName: "MasterNumberExplorer" },
  // Lesson 3.2.3's Â§7 flagship: ChoghadiyÄ &amp; RÄhu KÄlam Calculator â€”
  // sunrise/sunset input, 16-segment quality tables, visual timeline,
  // and inauspicious-window highlight.
  // Lesson 3.2.4's Â§7 flagship: VÄra-Event Pairing Explorer â€” event-category
  // cards, recommended-vÄra panels, vÄra reference grid, and planetary
  // friendship/enmity visualization.
  // Lesson 3.3.1's Â§7 flagship: Moon-Naká¹£atra Calculator â€” step-by-step formula
  // breakdown with editable Moon longitude + optional Sun context + preset
  // scenarios + 27-segment circular visualisation.
  // Lesson 3.3.2's Â§4 explorer: Naká¹£atra Strip â€” horizontal scrollable
  // enumeration of all 27 naká¹£atras with ruler-colour coding, filter pills,
  // search, and click-to-reveal detail panel (pÄda, yoni, gana, tara).
  // Lesson 3.3.3's Â§7 flagship: Naká¹£atra Deity & Ruler Wheel â€” circular 27-segment
  // SVG explorer with inner-name / outer-planet rings, filter pills, centre
  // mandala, and paká¹£a-suitability overlay toggle.
  // Lesson 3.3.4's Â§7 flagship: Daily Naká¹£atra PaÃ±cÄá¹…ga Reader â€” simulated
  // today's paÃ±cÄá¹…ga with time-slider, transition tracking, activity-suitability
  // grid, and classical reasoning panel.
  // Lesson 3.4.1's Â§7 flagship: Yoga vs Chart-Yoga Comparison â€” two-column
  // comparison table + 8-statement discrimination drill + visual icons.
  // Lesson 3.4.2's Â§7 flagship: Time-Yoga Calculator â€” Sun+Moon longitude sum
  // with step-by-step formula breakdown, 27-segment circular visualisation,
  // and preset scenarios.
  // Lesson 3.4.3's Â§7 flagship: Yoga Wheel 27 â€” circular 27-segment explorer
  // with nature colour-coding, filter pills, table view toggle, and search.
  // Lesson 3.4.4's Â§7 flagship: Inauspicious Yoga Avoidance Calculator â€”
  // focus on 6 inauspicious yogas with severity ranking, mitigation guide,
  // and month-view timeline.
  // Lesson 3.4.5's Â§7 flagship: Yoga MuhÅ«rta Screening Integrator â€” multi-element
  // muhÅ«rta screening tool with 5-element dashboard and yoga-specific filter.
  // Lesson 3.5.1's Â§7 flagship: Karaá¹‡a Calculator â€” half-tithi computation
  // with step-by-step breakdown, tithi-bar visual, and preset scenarios.
  // Lesson 3.5.2's Â§7 flagship: Karaá¹‡a Cycle Diagram â€” circular 11-karaá¹‡a
  // explorer with Cara/Sthira colour-coding, filter pills, and table view.
  // Lesson 3.5.3's Â§7 flagship: Bhadra Avoidance Integrator â€” Bhadra (Viá¹£á¹­i)
  // calculator with day-of-week selector, activity-avoidance cards, classical
  // source panel, and comparison with other inauspicious periods.
  // Lesson 2.5.1's Â§7 interactive: Samvat Converter â€” Vikrama â†” Åšaka â†” CE
  // interactive year-conversion calculator with boundary detection + convention toggles.
  // Lesson 2.5.2's Â§7 interactive: Regional Calendar Explorer â€” side-by-side
  // rendering of Tamil + Kerala + Bengali + Assamese + Odia regional calendars.
  // Lesson 2.5.3's Â§7 interactive: Calendar Converter â€” comprehensive cross-system
  // date-conversion across Vikrama / Åšaka / Kollam / Gregorian + JDN cross-validation.
  // â”€â”€â”€ Module 04: RÄÅ›i System interactives â”€â”€â”€
  "kendra-trikona-grouping-visualizer": { path: "kendra-trikona-grouping-visualizer", exportName: "KendraTrikonaGroupingVisualizer" },
  "varga-explainer": { path: "varga-explainer", exportName: "VargaExplainer" },
  "varga-reference-table": { path: "varga-reference-table", exportName: "VargaReferenceTable" },
  "varga-template-card": { path: "varga-template-card", exportName: "VargaTemplateCard" },
  "varga-calculator": { path: "varga-calculator", exportName: "VargaCalculator" },
  "multi-varga-comparator": { path: "multi-varga-comparator", exportName: "MultiVargaComparator" },
  "trimshamsha-calculator": { path: "trimshamsha-calculator", exportName: "TrimshamshaCalculator" },
  "ethical-routing-checklist": { path: "ethical-routing-checklist", exportName: "EthicalRoutingChecklist" },
  "shashtyamsha-calculator": { path: "shashtyamsha-calculator", exportName: "ShashtyamshaCalculator" },
  "d1-d60-comparator": { path: "d1-d60-comparator", exportName: "D1D60Comparator" },
  "d60-karmic-substrate-index-lab": { path: "d60-karmic-substrate-index-lab", exportName: "D60KarmicSubstrateIndexLab" },
  "d60-spiritual-path-arc-lab": { path: "d60-spiritual-path-arc-lab", exportName: "D60SpiritualPathArcLab" },
  "d60-honest-framing-ethics-lab": { path: "d60-honest-framing-ethics-lab", exportName: "D60HonestFramingEthicsLab" },
  "d60-worked-reading-confidence-lab": { path: "d60-worked-reading-confidence-lab", exportName: "D60WorkedReadingConfidenceLab" },
  "birth-time-quality-checker": { path: "birth-time-quality-checker", exportName: "BirthTimeQualityChecker" },
  "vimshopaka-calculator": { path: "vimshopaka-calculator", exportName: "VimshopakaCalculator" },
  "vargottama-scanner": { path: "vargottama-scanner", exportName: "VargottamaScanner" },
  "d1-d9-divergence-reader": { path: "d1-d9-divergence-reader", exportName: "D1D9DivergenceReader" },
  "hora-calculator": { path: "hora-calculator", exportName: "HoraCalculator" },
  "drekkana-calculator": { path: "drekkana-calculator", exportName: "DrekkanaCalculator" },
  "drekkana-system-comparator": { path: "drekkana-system-comparator", exportName: "DrekkanaSystemComparator" },
  "navamsha-calculator": { path: "navamsha-calculator", exportName: "NavamshaCalculator" },
  "navamsha-reader": { path: "navamsha-reader", exportName: "NavamshaReader" },
  "rashi-navamsha-pair": { path: "rashi-navamsha-pair", exportName: "RashiNavamshaPair" },

  // Lesson 5.1.2's Â§7 interactive: Dignity Wheel â€” clickable 12-rashi
  // dignity map with degree cues, friendship overlay, and Sun-Moon comparison.
  "stream-comparison-table": { path: "stream-comparison-table", exportName: "StreamComparisonTable" },
  "santana-fifth-house-significations-compass": { path: "santana-fifth-house-significations-compass", exportName: "SantanaFifthHouseSignificationsCompass" },
  "santana-fifth-lord-permutations-wheel": { path: "santana-fifth-lord-permutations-wheel", exportName: "SantanaFifthLordPermutationsWheel" },
  "santana-fifth-drishti-balance": { path: "santana-fifth-drishti-balance", exportName: "SantanaFifthDrishtiBalance" },
  "santana-obstruction-honesty-workbench": { path: "santana-obstruction-honesty-workbench", exportName: "SantanaObstructionHonestyWorkbench" },
  "saptamsha-builder-wheel": { path: "saptamsha-builder-wheel", exportName: "SaptamshaBuilderWheel" },
  "children-d1-d7-convergence-bench": { path: "children-d1-d7-convergence-bench", exportName: "ChildrenD1D7ConvergenceBench" },
  "d7-jupiter-karaka-workbench": { path: "d7-jupiter-karaka-workbench", exportName: "D7JupiterKarakaWorkbench" },
  "d7-santana-protocol-runner": { path: "d7-santana-protocol-runner", exportName: "D7SantanaProtocolRunner" },
  "jupiter-three-registers-convergence": { path: "jupiter-three-registers-convergence", exportName: "JupiterThreeRegistersConvergence" },
  "jupiter-strength-scorecard": { path: "jupiter-strength-scorecard", exportName: "JupiterStrengthScorecard" },
  "jupiter-dasha-bhukti-timeline": { path: "jupiter-dasha-bhukti-timeline", exportName: "JupiterDashaBhuktiTimeline" },
  "putra-karaka-pk-convergence-bench": { path: "putra-karaka-pk-convergence-bench", exportName: "PutraKarakaPkConvergenceBench" },
  "pk-placement-navamsha-workbench": { path: "pk-placement-navamsha-workbench", exportName: "PkPlacementNavamshaWorkbench" },
  "kp-children-cusp-tool": { path: "kp-children-cusp-tool", exportName: "KpChildrenCuspTool" },
  "kp-children-significator-timing-bench": { path: "kp-children-significator-timing-bench", exportName: "KpChildrenSignificatorTimingBench" },
  "jaimini-kp-children-synthesis-bench": { path: "jaimini-kp-children-synthesis-bench", exportName: "JaiminiKpChildrenSynthesisBench" },
  "when-will-children-synthesis-bench": { path: "when-will-children-synthesis-bench", exportName: "WhenWillChildrenSynthesisBench" },
  "fertility-struggle-routing-trainer": { path: "fertility-struggle-routing-trainer", exportName: "FertilityStruggleRoutingTrainer" },
  "pcpndt-refusal-trainer": { path: "pcpndt-refusal-trainer", exportName: "PcpndtRefusalTrainer" },
  "grief-aware-response-trainer": { path: "grief-aware-response-trainer", exportName: "GriefAwareResponseTrainer" },
  "children-scope-trainer": { path: "children-scope-trainer", exportName: "ChildrenScopeTrainer" },
  "twelfth-house-chart-t1-explorer": { path: "twelfth-house-chart-t1-explorer", exportName: "TwelfthHouseChartT1Explorer" },
  "ninth-house-chart-t1-explorer": { path: "ninth-house-chart-t1-explorer", exportName: "NinthHouseChartT1Explorer" },
  "twelve-nine-three-arc-explorer": { path: "twelve-nine-three-arc-explorer", exportName: "TwelveNineThreeArcExplorer" },
  "twelve-nine-three-aspect-explorer": { path: "twelve-nine-three-aspect-explorer", exportName: "TwelveNineThreeAspectExplorer" },
  "rahu-foreign-boundary-explorer": { path: "rahu-foreign-boundary-explorer", exportName: "RahuForeignBoundaryExplorer" },
  "rahu-placement-permutations-explorer": { path: "rahu-placement-permutations-explorer", exportName: "RahuPlacementPermutationsExplorer" },
  "rahu-dasha-timing-explorer": { path: "rahu-dasha-timing-explorer", exportName: "RahuDashaTimingExplorer" },
  "rahu-aspect-doctrine-fork-explorer": { path: "rahu-aspect-doctrine-fork-explorer", exportName: "RahuAspectDoctrineForkExplorer" },
  "nri-yoga-citation-honesty-explorer": { path: "nri-yoga-citation-honesty-explorer", exportName: "NriYogaCitationHonestyExplorer" },
  "nri-yoga-pattern-spotter": { path: "nri-yoga-pattern-spotter", exportName: "NriYogaPatternSpotter" },
  "kp-foreign-travel-cusp-tool": { path: "kp-foreign-travel-cusp-tool", exportName: "KpForeignTravelCuspTool" },
  "visa-question-multi-causal-synthesis": { path: "visa-question-multi-causal-synthesis", exportName: "VisaQuestionMultiCausalSynthesis" },
  "dasha-timing-foreign-settlement-sweep": { path: "dasha-timing-foreign-settlement-sweep", exportName: "DashaTimingForeignSettlementSweep" },
  "study-abroad-theme-timing-synthesis": { path: "study-abroad-theme-timing-synthesis", exportName: "StudyAbroadThemeTimingSynthesis" },
  "permanent-settlement-synthesis": { path: "permanent-settlement-synthesis", exportName: "PermanentSettlementSynthesis" },
  "scope-of-competence-router": { path: "scope-of-competence-router", exportName: "ScopeOfCompetenceRouter" },
  "sixth-house-litigation-profile": { path: "sixth-house-litigation-profile", exportName: "SixthHouseLitigationProfile" },
  // Lesson 11.1.2 interactive: Sixth-House Dusthāna–Upachaya Paradox —
  // dual-classification wheel, Mars vs Saturn worked-example comparison,
  // early-loss scenario, and discipline checks on house-specific limits.
  "sixth-house-dusthana-upachaya-paradox": { path: "sixth-house-dusthana-upachaya-paradox", exportName: "SixthHouseDusthanaUpachayaParadox" },
  // Lesson 11.1.3 interactive: Sixth-Lord Permutations for Litigation —
  // clickable 12-house wheel placing the 6th lord, five-family classification,
  // Chart L1 own-house anchor, and contrasting dusthāna/upachaya placements.
  "sixth-lord-permutations-litigation": { path: "sixth-lord-permutations-litigation", exportName: "SixthLordPermutationsLitigation" },
  // Lesson 11.1.4 interactive: Mars as Contest Kāraka Applied to Litigation —
  // Mars placement wheel, dignity selector, Chart L1 vs exalted-1st contrast,
  // forward-pointer to Chapter 2, and discipline checks.
  "mars-contest-karaka-litigation": { path: "mars-contest-karaka-litigation", exportName: "MarsContestKarakaLitigation" },
  // Lesson 11.2.1 interactive: Saturn as Delay, Structure, Persistence —
  // signification mapper, dignity quality selector, process gauge, and
  // Chart L1 own-sign vs debilitated contrast.
  "saturn-delay-structure-persistence-litigation": { path: "saturn-delay-structure-persistence-litigation", exportName: "SaturnDelayStructurePersistenceLitigation" },
  // Lesson 11.2.2 interactive: Mars-Saturn Dynamic Explorer —
  // aspect-geometry vs natural-friendship layer toggle, asymmetric grid,
  // spot-the-error scenario, and discipline checks.
  "mars-saturn-dynamic-explorer": { path: "mars-saturn-dynamic-explorer", exportName: "MarsSaturnDynamicExplorer" },
  // Lesson 11.2.3 interactive: Mars-Saturn Relationship Distinguisher —
  // conjunction / mutual aspect / mutual reception mode toggle, SVG diagrams,
  // Chart L1 verification by elimination, and contrasting conjunction case.
  "mars-saturn-relationship-distinguisher": { path: "mars-saturn-relationship-distinguisher", exportName: "MarsSaturnRelationshipDistinguisher" },
  // Lesson 11.2.4 interactive: Mars-Saturn Litigation Synthesis —
  // six-finding assembly, aspect-web SVG, client-facing template builder,
  // scope-limit trainer, and discipline checks.
  "mars-saturn-litigation-synthesis": { path: "mars-saturn-litigation-synthesis", exportName: "MarsSaturnLitigationSynthesis" },
  // Lesson 11.3.1 interactive: KP Litigation Cusp Tool —
  // Chart L1 6th-cusp data, disposition-rule step-through, sub-lord
  // substitution, and classical-vs-KP divergence display.
  "kp-litigation-cusp-tool": { path: "kp-litigation-cusp-tool", exportName: "KpLitigationCuspTool" },
  "kp-shared-significator-explorer": { path: "kp-shared-significator-explorer", exportName: "KpSharedSignificatorExplorer" },
  "kp-case-outcome-horary-intro": { path: "kp-case-outcome-horary-intro", exportName: "KpCaseOutcomeHoraryIntro" },
  "kp-litigation-synthesis-workbench": { path: "kp-litigation-synthesis-workbench", exportName: "KpLitigationSynthesisWorkbench" },
  "dasha-conflict-timing-sweep": { path: "dasha-conflict-timing-sweep", exportName: "DashaConflictTimingSweep" },
  "litigation-confidence-synthesis": { path: "litigation-confidence-synthesis", exportName: "LitigationConfidenceSynthesis" },
  "lawyer-substitution-refusal-router": { path: "lawyer-substitution-refusal-router", exportName: "LawyerSubstitutionRefusalRouter" },
  "litigation-scope-competence-closer": { path: "litigation-scope-competence-closer", exportName: "LitigationScopeCompetenceCloser" },
  // Lesson 12.1.1 interactive: Moksa Trikona Explorer — isolates the 4-8-12 trine,
  // compares all four purusartha trines, adds kendra/dusthana overlay, and includes
  // an uneven-trine builder with disposition-not-destiny discipline.
  "moksha-trikona-explorer": { path: "moksha-trikona-explorer", exportName: "MokshaTrikonaExplorer" },
  // Lesson 12.1.2 interactive: Fourth House Spiritual Foundation — 4th house as
  // moksa foundation stage, Moon karaka picker, independent house/lord and Moon
  // strength builder, Chart S1 / Example 2 presets, and common-mistake discipline.
  "fourth-house-spiritual-foundation": { path: "fourth-house-spiritual-foundation", exportName: "FourthHouseSpiritualFoundation" },
  "eighth-house-spiritual-transformation": { path: "eighth-house-spiritual-transformation", exportName: "EighthHouseSpiritualTransformation" },
  "twelfth-house-spiritual-release": { path: "twelfth-house-spiritual-release", exportName: "TwelfthHouseSpiritualRelease" },
  "eighth-twelfth-health-registers": { path: "eighth-twelfth-health-registers", exportName: "EighthTwelfthHealthRegisters" },
  "health-house-synthesis-workbench": { path: "health-house-synthesis-workbench", exportName: "HealthHouseSynthesisWorkbench" },
  "balarista-doctrine-frame-explorer": { path: "balarista-doctrine-frame-explorer", exportName: "BalaristaDoctrineFrameExplorer" },
  "balarista-configuration-spotter": { path: "balarista-configuration-spotter", exportName: "BalaristaConfigurationSpotter" },
  "balarista-cancellation-walker": { path: "balarista-cancellation-walker", exportName: "BalaristaCancellationWalker" },
  "balarista-ethics-framing-trainer": { path: "balarista-ethics-framing-trainer", exportName: "BalaristaEthicsFramingTrainer" },
  "longevity-method-selector": { path: "longevity-method-selector", exportName: "LongevityMethodSelector" },
  "ayur-calculator": { path: "ayur-calculator", exportName: "AyurCalculator" },
  "naisargika-ayur-cross-check-workbench": { path: "naisargika-ayur-cross-check-workbench", exportName: "NaisargikaAyurCrossCheckWorkbench" },
  "longevity-ethics-response-trainer": { path: "longevity-ethics-response-trainer", exportName: "LongevityEthicsResponseTrainer" },
  "maraka-doctrine-explorer": { path: "maraka-doctrine-explorer", exportName: "MarakaDoctrineExplorer" },
  "maraka-identification-workbench": { path: "maraka-identification-workbench", exportName: "MarakaIdentificationWorkbench" },
  "maraka-caution-window-trainer": { path: "maraka-caution-window-trainer", exportName: "MarakaCautionWindowTrainer" },
  // Lesson 7.4.4's §7 flagship: Maraka Synthesis Workbench — synthesise
  // Bālāriṣṭa, longevity, and maraka findings for one chart and practise
  // the universal, undated, proactive client-facing register.
  "maraka-synthesis-workbench": { path: "maraka-synthesis-workbench", exportName: "MarakaSynthesisWorkbench" },
  // Lesson 7.5.1's §7 explorer: Jaimini Rudra-Maheśvara Explorer — contrast
  // Parāśarī house-lordship with Jaimini kāraka-based identification, train
  // AK selection, inspect Rudra and Maheśvara rules, and present documented
  // source variance honestly.
  "jaimini-rudra-maheshvara-explorer": { path: "jaimini-rudra-maheshvara-explorer", exportName: "JaiminiRudraMaheshvaraExplorer" },
  // Lesson 7.5.2's §7 workbench: Rudra-Maheśvara Workbench — apply the rules
  // to Chart H1, compare both Maheśvara procedures, and practise honest
  // confidence calibration plus the Jaimini-Parāśarī convergence.
  "rudra-maheshvara-workbench": { path: "rudra-maheshvara-workbench", exportName: "RudraMaheshvaraWorkbench" },
  // Lesson 7.5.3's §7 explorer: KP Longevity Doctrine Explorer — interactively
  // teach sub-lord as final arbiter, four-level significator hierarchy, KP's
  // 2nd/7th/12th maraka list, Bhādhaka-by-lagna-type, and honest data-scope.
  "kp-longevity-doctrine-explorer": { path: "kp-longevity-doctrine-explorer", exportName: "KpLongevityDoctrineExplorer" },
  "predictive-karma-profile": { path: "predictive-karma-profile", exportName: "PredictiveKarmaProfile" },
  "tenth-lord-permutation-profile": { path: "tenth-lord-permutation-profile", exportName: "TenthLordPermutationProfile" },
  "tenth-karaka-triangulation": { path: "tenth-karaka-triangulation", exportName: "TenthKarakaTriangulation" },
  "tenth-aspect-workbench": { path: "tenth-aspect-workbench", exportName: "TenthAspectWorkbench" },
  // Lesson 5.1.4's Â§7 interactive: Friendship Matrix â€” directed graha
  // relationship grid with mirror-cell comparison and Sun-Moon polarity axes.
  // Lesson 5.1.5's Â§7 interactive: Pakshabala Slider â€” tithi scrubber with
  // inverse Sun/Moon virupa bars and a dignity-combination preview.
  "shadbala-intro": { path: "shadbala-intro", exportName: "ShadbalaIntro" },
  "shadbala-components": { path: "shadbala-components", exportName: "ShadbalaComponents" },
  "shadbala-grader": { path: "shadbala-grader", exportName: "ShadbalaGrader" },
  "uchchabala-calculator": { path: "uchchabala-calculator", exportName: "UchchabalaCalculator" },
  "saptavargabala-calculator": { path: "saptavargabala-calculator", exportName: "SaptavargabalaCalculator" },
  "oja-yugma-calculator": { path: "oja-yugma-calculator", exportName: "OjaYugmaCalculator" },
  "kendra-drekkana-calculator": { path: "kendra-drekkana-calculator", exportName: "KendraDrekkanaCalculator" },
  "sthana-bala-summer": { path: "sthana-bala-summer", exportName: "SthanaBalaSummer" },
  "dik-bala-calculator": { path: "dik-bala-calculator", exportName: "DikBalaCalculator" },
  "kala-bala-overview": { path: "kala-bala-overview", exportName: "KalaBalaOverview" },
  // Lesson 5.2.2's Â§7 interactive: Karaka Router â€” question-driven Mars
  // register selector with house-side confirmation and tie-breaker feedback.
  // Lesson 5.2.3's Â§7 interactive: Friendship Dignity Grid â€” Mars across
  // the 12 signs with sign-lord relation, degree control, and dignity override.
  "mula-root-mandala": { path: "mula-root-mandala", exportName: "MulaRootMandala" },
  "purva-ashadha-relationship-map": { path: "purva-ashadha-relationship-map", exportName: "PurvaAshadhaRelationshipMap" },
  "uttara-ashadha-attribute-universe": { path: "uttara-ashadha-attribute-universe", exportName: "UttaraAshadhaAttributeUniverse" },
  "shravana-dhanishtha-concept-constellation": { path: "shravana-dhanishtha-concept-constellation", exportName: "ShravanaDhanishthaConceptConstellation" },
  "shatabhishaj-bhadrapada-knowledge-galaxy": { path: "shatabhishaj-bhadrapada-knowledge-galaxy", exportName: "ShatabhishajBhadrapadaKnowledgeGalaxy" },
  "revati-constellation-diagram": { path: "revati-constellation-diagram", exportName: "RevatiConstellationDiagram" },
  "anuradha-devotion-network": { path: "anuradha-devotion-network", exportName: "AnuradhaDevotionNetwork" },
  "ashlesha-honest-handling-dojo": { path: "ashlesha-honest-handling-dojo", exportName: "AshleshaHonestHandlingDojo" },
  "chitra-celestial-gem-lab": { path: "chitra-celestial-gem-lab", exportName: "ChitraCelestialGemLab" },
  "gandanta-water-fire-junction": { path: "gandanta-water-fire-junction", exportName: "GandantaWaterFireJunction" },
  "jyeshtha-supremacy-talisman": { path: "jyeshtha-supremacy-talisman", exportName: "JyeshthaSupremacyTalisman" },
  "magha-ancestral-gateway-lab": { path: "magha-ancestral-gateway-lab", exportName: "MaghaAncestralGatewayLab" },
  "nakshatra-profile": { path: "nakshatra-profile", exportName: "NakshatraProfile" },
  "nakshatra-template-lab": { path: "nakshatra-template-lab", exportName: "NakshatraTemplateLab" },
  "purva-uttara-doctrine-explorer": { path: "purva-uttara-doctrine-explorer", exportName: "PurvaUttaraDoctrineExplorer" },
  "pushya-auspiciousness-lab": { path: "pushya-auspiciousness-lab", exportName: "PushyaAuspiciousnessLab" },
  "swati-breeze-navigator": { path: "swati-breeze-navigator", exportName: "SwatiBreezeNavigator" },
  "vishakha-forked-path-explorer": { path: "vishakha-forked-path-explorer", exportName: "VishakhaForkedPathExplorer" },
  "pada-calculator": { path: "pada-calculator", exportName: "PadaCalculator" },
  "vivaha-muhurta-evaluator": { path: "vivaha-muhurta-evaluator", exportName: "VivahaMuhurtaEvaluator" },
  "vyapara-arambh-muhurta-evaluator": { path: "vyapara-arambh-muhurta-evaluator", exportName: "VyaparaArambhMuhurtaEvaluator" },
  "griha-pravesha-muhurta-evaluator": { path: "griha-pravesha-muhurta-evaluator", exportName: "GrihaPraveshaMuhurtaEvaluator" },
  "yatra-muhurta-evaluator": { path: "yatra-muhurta-evaluator", exportName: "YatraMuhurtaEvaluator" },
  "pada-navamsha-mapper": { path: "pada-navamsha-mapper", exportName: "PadaNavamshaMapper" },
  "kp-sub-calculator": { path: "kp-sub-calculator", exportName: "KpSubCalculator" },
  "tara-bala-wheel": { path: "tara-bala-wheel", exportName: "TaraBalAWheel" },
  // Module 10 Chapter 1 â€” VimÅ›ottarÄ« DaÅ›Ä Cycle
  // Lesson 10.1.1's Â§7 interactive: DaÅ›Ä Timeline â€” 120-year proportional wheel
  // with 9 clickable lord segments, starting-lord rotation, lifespan overlay,
  // and linear timeline bar.
  "dasha-timeline": { path: "dasha-timeline", exportName: "DashaTimeline" },
  "dasha-start-finder": { path: "dasha-start-finder", exportName: "DashaStartFinder" },
  // Lesson 10.1.3's Â§7 interactive: DaÅ›Ä Selector â€” Universal Default vs Conditional Simulator
  "dasha-selector": { path: "dasha-selector", exportName: "DashaSelector" },
  // Lesson 10.2.1's Â§7 interactive: DaÅ›Ä Balance Calculator â€” four-step
  // pedagogical calculator with Moon longitude input, naká¹£atra identification,
  // fraction-traversed computation, and balance result with boundary warnings
  // and subsequent mahÄdaÅ›Ä preview.
  "dasha-balance-calculator": { path: "dasha-balance-calculator", exportName: "DashaBalanceCalculator" },
  "dasha-cascade-explorer": { path: "dasha-cascade-explorer", exportName: "DashaCascadeExplorer" },
  "vimshottari-ratio-calculator": { path: "vimshottari-ratio-calculator", exportName: "VimshottariRatioCalculator" },
  "antardasha-table-builder": { path: "antardasha-table-builder", exportName: "AntardashaTableBuilder" },
  "dasha-lookup-drill": { path: "dasha-lookup-drill", exportName: "DashaLookupDrill" },
  "ashtottari-explorer": { path: "ashtottari-explorer", exportName: "AshtottariExplorer" },
  "ashtottari-condition-checker": { path: "ashtottari-condition-checker", exportName: "AshtottariConditionChecker" },
  "yogini-explorer": { path: "yogini-explorer", exportName: "YoginiExplorer" },
  "dasha-class-comparator": { path: "dasha-class-comparator", exportName: "DashaClassComparator" },
  "conditional-dasha-catalog": { path: "conditional-dasha-catalog", exportName: "ConditionalDashaCatalog" },
  "conditional-criteria-checker": { path: "conditional-criteria-checker", exportName: "ConditionalCriteriaChecker" },
  "dasha-decision-framework": { path: "dasha-decision-framework", exportName: "DashaDecisionFramework" },
  "kp-vimshottari-intro": { path: "kp-vimshottari-intro", exportName: "KpVimshottariIntro" },
  // Lesson 10.2.2's Â§7 interactive: DaÅ›Ä Balance Mistake Explorer â€”
  // toggle switches for all 6 common mistakes with side-by-side correct/corrupted
  // comparison and Â±1-day tolerance indicator.
  "dasha-balance-mistake-explorer": { path: "dasha-balance-mistake-explorer", exportName: "DashaBalanceMistakeExplorer" },
  // Lesson 10.2.3's Â§7 interactive: DaÅ›Ä Balance Cross-Check â€” hand-computed
  // balance input vs engine output with Â±1-day confirmation band and
  // severity-based diagnosis hints (match/minor/major/critical).
  "dasha-balance-cross-check": { path: "dasha-balance-cross-check", exportName: "DashaBalanceCrossCheck" },
  // Lesson 10.2.4's Â§7 interactive: DaÅ›Ä Table Builder â€” constructs the full
  // birth-to-120 mahÄdaÅ›Ä table from a balance, with expandable bhukti
  // subdivisions using the proportion formula (MD Ã— lord) Ã· 120.
  "dasha-table-builder": { path: "dasha-table-builder", exportName: "DashaTableBuilder" },
  // Lesson 10.4.1's Â§7 interactive: Bhukti-Yoga Matrix â€” MD-lord â†” AD-lord
  // naisargika friendship sets the baseline quality of a sub-period.
  // Includes dignity modulator demonstrating "modulator, not override."
  "bhukti-yoga-matrix": { path: "bhukti-yoga-matrix", exportName: "BhuktiYogaMatrix" },
  // Lesson 10.4.2's Â§7 interactive: KÄraka Overlay Reader â€” MD-lord's life-phase
  // quality overlaid with AD-lord's domain-flavour significations.
  // Detects multi-kÄraka clusters and provides same-AD-different-MD comparison.
  "karaka-overlay-reader": { path: "karaka-overlay-reader", exportName: "KarakaOverlayReader" },
  "amk-placement-navamsha-workbench": { path: "amk-placement-navamsha-workbench", exportName: "AmkPlacementNavamshaWorkbench" },
  // Lesson 10.4.3's Â§7 interactive: Two-Yes Checker â€” counts independent
  // indicator families for a predictive question and flags reliable only
  // when â‰¥2 genuinely different lines of evidence agree.
  "two-yes-checker": { path: "two-yes-checker", exportName: "TwoYesChecker" },
  // Lesson 10.4.4's Â§7 interactive: Event Reading Workbench â€” runs the six-step
  // workflow end-to-end with functional lordship, bhukti-yoga, kÄraka overlay,
  // and the two-yes gate for any domain + ascendant + MD-AD pair.
  "event-reading-workbench": { path: "event-reading-workbench", exportName: "EventReadingWorkbench" },
  // Lesson 10.6.1's Â§7 interactive: Cara DaÅ›Ä Intro â€” side-by-side contrast of
  // VimÅ›ottarÄ« (planet-based, fixed) vs Cara (sign-based, variable) with
  // modality legend and cross-validation panel.
  "cara-dasha-intro": { path: "cara-dasha-intro", exportName: "CaraDashaIntro" },
  // Lesson 10.6.2's Â§7 interactive: Sthira DaÅ›Ä Intro â€” awareness-level
  // reference table contrasting Cara and Sthira (both rÄÅ›i-based Jaimini,
  // different rules) with deferral note to Jaimini module (T1-17).
  "sthira-dasha-intro": { path: "sthira-dasha-intro", exportName: "SthiraDashaIntro" },
  // Lesson 10.6.3's Â§7 interactive: KÄlacakra Overview â€” awareness-level
  // pÄda-derived sign daÅ›Ä explorer with savya/apasavya direction rules,
  // 108-point naká¹£atra-pÄda grid, and complexity breakdown.
  "kalachakra-overview": { path: "kalachakra-overview", exportName: "KalachakraOverview" },
  // Lesson 10.6.4's Â§7 interactive: ParÄÅ›arÄ«-Jaimini Chooser â€” decision-tool
  // recommending daÅ›Ä(s) for any situation with VimÅ›ottarÄ« always anchored.
  // Includes cross-validation scenarios (convergence / divergence).
  // Lesson 10.7.5's Â§7 interactive: DaÅ›Ä Landscape Map â€” survey of ~14 systems
  // grouped by class, five-point discipline overlay, and honest-framing practice.
  // Closes Module 10.
  "dasha-landscape-map": { path: "dasha-landscape-map", exportName: "DashaLandscapeMap" },
  "drishti-strength-meter": { path: "drishti-strength-meter", exportName: "DrishtiStrengthMeter" },
  "rashi-drishti-grid": { path: "rashi-drishti-grid", exportName: "RashiDrishtiGrid" },
  "aspect-doctrine-comparator": { path: "aspect-doctrine-comparator", exportName: "AspectDoctrineComparator" },
  "tajika-orb-calculator": { path: "tajika-orb-calculator", exportName: "TajikaOrbCalculator" },
  "tajika-applying-separating": { path: "tajika-applying-separating", exportName: "TajikaApplyingSeparating" },
  "tajika-yoga-glossary": { path: "tajika-yoga-glossary", exportName: "TajikaYogaGlossary" },
  "varshaphala-overview": { path: "varshaphala-overview", exportName: "VarshaphalaOverview" },
  "doctrine-selector": { path: "doctrine-selector", exportName: "DoctrineSelector" },
  "multi-stream-chart-comparator": { path: "multi-stream-chart-comparator", exportName: "MultiStreamChartComparator" },
  "saturn-aspect-disambiguator": { path: "saturn-aspect-disambiguator", exportName: "SaturnAspectDisambiguator" },
  "pmpy-detector": { path: "pmpy-detector", exportName: "PmpyDetector" },
  "pmpy-archetype-explorer": { path: "pmpy-archetype-explorer", exportName: "PmpyArchetypeExplorer" },
  "pmpy-dilution-checker": { path: "pmpy-dilution-checker", exportName: "PmpyDilutionChecker" },
  "pmpy-grade-scenario": { path: "pmpy-grade-scenario", exportName: "PmpyGradeScenario" },
  "yoga-strength-overlay": { path: "yoga-strength-overlay", exportName: "YogaStrengthOverlay" },
  "cross-stream-yoga-map": { path: "cross-stream-yoga-map", exportName: "CrossStreamYogaMap" },
  "yoga-firing-timeline": { path: "yoga-firing-timeline", exportName: "YogaFiringTimeline" },
  "yoga-reading-workflow": { path: "yoga-reading-workflow", exportName: "YogaReadingWorkflow" },
  "sarasvati-learning-arts-workbench": { path: "sarasvati-learning-arts-workbench", exportName: "SarasvatiLearningArtsWorkbench" },
  "pancha-mahapurusha-career-workbench": { path: "pancha-mahapurusha-career-workbench", exportName: "PanchaMahapurushaCareerWorkbench" },
  "raja-yoga-detector": { path: "raja-yoga-detector", exportName: "RajaYogaDetector" },
  "raja-yoga-tenth-career-workbench": { path: "raja-yoga-tenth-career-workbench", exportName: "RajaYogaTenthCareerWorkbench" },
  "yogi-avayogi-career-workbench": { path: "yogi-avayogi-career-workbench", exportName: "YogiAvayogiCareerWorkbench" },
  "dasha-career-event-window-workbench": { path: "dasha-career-event-window-workbench", exportName: "DashaCareerEventWindowWorkbench" },
  "lal-kitab-career-overlay-workbench": { path: "lal-kitab-career-overlay-workbench", exportName: "LalKitabCareerOverlayWorkbench" },
  "tajika-career-year-refinement-workbench": { path: "tajika-career-year-refinement-workbench", exportName: "TajikaCareerYearRefinementWorkbench" },
  "career-transit-confirmation-workbench": { path: "career-transit-confirmation-workbench", exportName: "CareerTransitConfirmationWorkbench" },
  "career-synthesis-overview-workbench": { path: "career-synthesis-overview-workbench", exportName: "CareerSynthesisOverviewWorkbench" },
  "job-offer-synthesis-workbench": { path: "job-offer-synthesis-workbench", exportName: "JobOfferSynthesisWorkbench" },
  "entrepreneurship-employment-synthesis-workbench": { path: "entrepreneurship-employment-synthesis-workbench", exportName: "EntrepreneurshipEmploymentSynthesisWorkbench" },
  "career-scope-competence-router": { path: "career-scope-competence-router", exportName: "CareerScopeCompetenceRouter" },
  "dharma-karmadhipati-detector": { path: "dharma-karmadhipati-detector", exportName: "DharmaKarmadhipatiDetector" },
  "raja-yoga-variants-map": { path: "raja-yoga-variants-map", exportName: "RajaYogaVariantsMap" },
  "kendra-trikona-rationale": { path: "kendra-trikona-rationale", exportName: "KendraTrikonaRationale" },
  "raja-yoga-worked-example": { path: "raja-yoga-worked-example", exportName: "RajaYogaWorkedExample" },
  "dhana-yoga-detector": { path: "dhana-yoga-detector", exportName: "DhanaYogaDetector" },
  "dhana-yoga-variants-map": { path: "dhana-yoga-variants-map", exportName: "DhanaYogaVariantsMap" },
  "raja-dhana-overlap-map": { path: "raja-dhana-overlap-map", exportName: "RajaDhanaOverlapMap" },
  "dhana-yoga-worked-example": { path: "dhana-yoga-worked-example", exportName: "DhanaYogaWorkedExample" },
  "ruchaka-valour-simulator": { path: "ruchaka-valour-simulator", exportName: "RuchakaValourSimulator" },
  "bhadra-intellect-explorer": { path: "bhadra-intellect-explorer", exportName: "BhadraIntellectExplorer" },
  "hamsa-malavya-synthesis": { path: "hamsa-malavya-synthesis", exportName: "HamsaMalavyaSynthesis" },
  "shasha-authority-analyzer": { path: "shasha-authority-analyzer", exportName: "ShashaAuthorityAnalyzer" },
  "lunar-yoga-detector": { path: "lunar-yoga-detector", exportName: "LunarYogaDetector" },
  "kemadruma-checker": { path: "kemadruma-checker", exportName: "KemadrumaChecker" },
  "gajakesari-simulator": { path: "gajakesari-simulator", exportName: "GajakesariSimulator" },
  "budhaditya-checker": { path: "budhaditya-checker", exportName: "BudhadityaChecker" },
  // Lesson 13.4.1's Â§7 interactive: Cheá¹£á¹­Ä Bala Calculator â€” motional strength
  // explorer with eight cheá¹£á¹­Ä avasthÄs, epicycle diagram, Sun/Moon convention
  // panels, and virÅ«pa spectrum. Rich SVG diagrams illustrate retrograde mechanics.
  "cheshta-bala-calculator": { path: "cheshta-bala-calculator", exportName: "CheshthaBalaCalculator" },
  // Lesson 13.4.2's Â§7 interactive: Naisargika Bala Table â€” the seven fixed
  // natural-strength values with descending bar chart, fraction ladder, wheel
  // diagram, and baseline-stack visual. No engine needed (classical constants).
  "naisargika-table": { path: "naisargika-table", exportName: "NaisargikaTable" },
  // Lesson 13.4.3's Â§7 interactive: Naisargika Rationale â€” hierarchy ladder,
  // luminosity overlay, Venus-vs-Jupiter comparison, and baseline reminder.
  // Explains why the fixed order is not arbitrary.
  "naisargika-rationale": { path: "naisargika-rationale", exportName: "NaisargikaRationale" },
  // Lesson 13.5.1's Â§7 interactive: Dá¹›k Bala Calculator â€” aspect net diagram,
  // signed number line, add/remove aspects, six-component overview. Teaches
  // the signed-net concept and that dá¹›k bala can be negative.
  "drk-bala-calculator": { path: "drk-bala-calculator", exportName: "DrkBalaCalculator" },
  // Lesson 13.5.2's Â§7 interactive: á¹¢aá¸bala Summation â€” waterfall stack,
  // threshold gauge, all-planets reference, and pass/fail comparison.
  // Teaches summing, converting to rÅ«pas, and comparing to minima.
  "shadbala-summation": { path: "shadbala-summation", exportName: "ShadbalaSummation" },
  // Lesson 13.5.3's Â§7 interactive: á¹¢aá¸bala Scorecard â€” per-planet ratio + band
  // table, band spectrum, workflow diagram, and confidence-vs-virtue visual.
  // Closes Module 13 by turning totals into interpretive judgement.
  "shadbala-scorecard": { path: "shadbala-scorecard", exportName: "ShadbalaScorecard" },
  // Lesson 13.6.1's Â§7 interactive: BhÄva Bala Calculator â€” house selector,
  // three-component inputs, house diagram, and á¹£aá¸bala parallel comparison.
  "bhava-bala-calculator": { path: "bhava-bala-calculator", exportName: "BhavaBalaCalculator" },
  // Lesson 13.6.2's Â§7 interactive: á¹¢aá¸balaâ€“BhÄva Bala Synthesis â€” domain
  // selector, strength toggles, four-cell matrix, and confidence dial.
  // Teaches integrative reading of planet + house strength.
  "shadbala-bhavabala-synthesis": { path: "shadbala-bhavabala-synthesis", exportName: "ShadbalaBhavabalaSynthesis" },
  // Lesson 13.6.3's Â§7 interactive: Cross-Stream Strength Map â€” four stream
  // conceptions, parallel tracks, convergence/divergence, and paÃ±cavargÄ«ya
  // breakdown. Maps how each sampradÄya measures strength.
  "cross-stream-strength-map": { path: "cross-stream-strength-map", exportName: "CrossStreamStrengthMap" },
  // Lesson 13.6.4's Â§7 interactive: Strength-Quality Matrix â€” Module 13 capstone.
  // 2Ã—2 judgement matrix fusing á¹£aá¸bala (quantity) with dignity/aspect/yoga (quality).
  // Clickable SVG matrix + preset scenarios + amplifier diagram + discipline rules.
  "strength-quality-matrix": { path: "strength-quality-matrix", exportName: "StrengthQualityMatrix" },
  // Lesson 13.3.3's Â§7 interactive: Paká¹£a-Yuddha Calculator â€” paká¹£abala (lunar-phase
  // strength split) + graha-yuddha (planetary war detection). Fortnight toggle,
  // planet status grid, proximity checker with SVG diagrams, and worked scenarios.
  "paksha-yuddha-calculator": { path: "paksha-yuddha-calculator", exportName: "PakshaYuddhaCalculator" },
  // Lesson 13.3.4's Â§7 interactive: Dik-KÄla Summer â€” Chapter 3 capstone.
  // Dik bala slider + nine kÄla sub-component sliders + SVG sum diagram +
  // virÅ«paâ†’rÅ«pa conversion + worked presets (Sun 10th, Moon night, war penalty).
  "dik-kala-summer": { path: "dik-kala-summer", exportName: "DikKalaSummer" },
  // Lesson 14.4.1's Â§7 interactive: Laká¹£mÄ«-SarasvatÄ« Detector â€” checks both
  // deity-named special yogas. North Indian chart SVG + house/dignity selectors +
  // condition checker with preset scenarios (Laká¹£mÄ« full, SarasvatÄ« full, broken).
  "lakshmi-saraswati-detector": { path: "lakshmi-saraswati-detector", exportName: "LakshmiSaraswatiDetector" },
  // Lesson 14.4.2's Â§7 interactive: Akhanda SÄmrÄjya Checker â€” tests the
  // "unbroken sovereignty" yoga against selectable source definitions (standard
  // vs PhaladÄ«pikÄ). Sovereignty-stack SVG + mini-chart + source-variation discipline.
  "akhanda-samrajya-checker": { path: "akhanda-samrajya-checker", exportName: "AkhandaSamrajyaChecker" },
  // Lesson 14.4.3's Â§7 interactive: BuddhÄditya-Gaja-Kesari Detector â€” revisits
  // both common yogas with depth. Combustion orb slider + kendra-from-Moon
  // circular diagram + strength grading + trikoá¹‡a misread warning.
  "buddhaditya-gajakesari-detector": { path: "buddhaditya-gajakesari-detector", exportName: "BuddhadityaGajakesariDetector" },
  // Lesson 14.4.4's Â§7 interactive: Special-Yoga Scan â€” Chapter 4 capstone.
  // Systematic 5-yoga checklist on a fixed Cancer-lagna worked chart.
  // Jupiter-dignity toggle demonstrates broken-condition cascade.
  "special-yoga-scan": { path: "special-yoga-scan", exportName: "SpecialYogaScan" },
  // Lesson 14.5.1's Â§7 interactive: Neecha-Bhaá¹…ga Checker â€” cancellation of debilitation.
  // Planet selector + 5-condition checklist + rescue-chain SVG + honest debate.
  "neecha-bhanga-checker": { path: "neecha-bhanga-checker", exportName: "NeechaBhangaChecker" },
  // Lesson 14.5.2's Â§7 interactive: Vipareeta Detector â€” three Vipareeta RÄja Yogas.
  // Lagna selector + dusthana-lord placements + dusthana-triangle SVG + refinements.
  "vipareeta-detector": { path: "vipareeta-detector", exportName: "VipareetaDetector" },
  // Lesson 14.5.3's Â§7 interactive: Vipareeta Rationale â€” spoiler-of-spoiler doctrine.
  // Scenario explorer + strength/timing controls + spoiler-mechanism SVG + honest limits.
  "vipareeta-rationale": { path: "vipareeta-rationale", exportName: "VipareetaRationale" },
  // Lesson 14.5.4's Â§7 interactive: Vipareeta-Neecha Scan â€” Chapter 5 capstone.
  // Fixed Aries chart + neecha-bhaá¹…ga check + Hará¹£a check + combined honest reading.
  "vipareeta-neecha-scan": { path: "vipareeta-neecha-scan", exportName: "VipareetaNeechaScan" },
  // Lesson 14.6.1's Â§7 interactive: Manglik Detector â€” Kuja-Doá¹£a from lagna/Moon/Venus.
  // House-set variation (6-house vs 5-house) + severity grading + defearmongering.
  "manglik-detector": { path: "manglik-detector", exportName: "ManglikDetector" },
  // Lesson 14.6.2's Â§7 interactive: Manglik Cancellation Checker â€” 15+ grouped conditions.
  // Mars sign/house + toggle checklist + cancellation gauge + weighted result.
  "manglik-cancellation-checker": { path: "manglik-cancellation-checker", exportName: "ManglikCancellationChecker" },
  // Lesson 14.6.3's Â§7 interactive: KÄla Sarpa Detector â€” nodal-axis configuration check.
  // RÄhu + 7 planet controls + circular diagram + doctrinal debate + honest handling.
  "kala-sarpa-detector": { path: "kala-sarpa-detector", exportName: "KalaSarpaDetector" },
  // Lesson 14.6.4's Â§7 interactive: Pitá¹›-Doá¹£a Indicator â€” chart signatures + remedial framework.
  // Sun/Rahu/Saturn/9th-lord controls + signature gauge + remedy cards + honest limits.
  "pitr-dosha-indicator": { path: "pitr-dosha-indicator", exportName: "PitrDoshaIndicator" },
  // Lesson 14.6.5's Â§7 interactive: Kemadruma + Sade Sati Recap â€” two doá¹£as in one surface.
  // Kemadruma (Moon + 2nd/12th + cancellations) + Sade Sati (Moon + Saturn transit + phases).
  "kemadruma-sadesati-recap": { path: "kemadruma-sadesati-recap", exportName: "KemadrumaSadesatiRecap" },
  // Lesson 14.6.6's Â§7 interactive: De-Fearmongering Protocol -- 8-step discipline walker.
  // Doá¹£a selector + step cards + reframe exercise + ethics connection. Closes Chapter 6.
  "defearmongering-protocol": { path: "defearmongering-protocol", exportName: "DefearmongeringProtocol" },
  // Module 17 Chapter 3 argala explorer: reference-house selector + planet placement +
  // circular diagram with argala/virodha highlights + pair-by-pair net computation +
  // five-step workflow. Serves all four lessons in the argala chapter.
  "argala-explorer": { path: "argala-explorer", exportName: "ArgalaExplorer" },
  // Lesson 17.3.1 interactive: Argala Concept Explorer -- bolt metaphor SVG,
  // reference-house explorer, mechanism discriminator (argala vs graha-dá¹›á¹£á¹­i vs rÄÅ›i-dá¹›á¹£á¹­i),
  // and what-argala-does/does-not-do checklist.
  "argala-concept-explorer": { path: "argala-concept-explorer", exportName: "ArgalaConceptExplorer" },
  // Lesson 17.3.2 interactive: Positive Argala 2/4/11 -- counting drill with circular diagram,
  // self-check challenges, strength visualiser, and common-trap spotter.
  "positive-argala-2-4-11": { path: "positive-argala-2-4-11", exportName: "PositiveArgala2411" },
  // Lesson 17.3.3 interactive: VirodhÄrgala Counter-Intervention -- obstruction pair explorer,
  // net-effect calculator with +/- count controls, and scenario presets.
  "virodhargala-counter-intervention": { path: "virodhargala-counter-intervention", exportName: "VirodhargalaCounterIntervention" },
  // Lesson 17.4.1 interactive: Ä€rÅ«á¸ha PÄda Finder -- double-count computation,
  // 1st/7th exception detection, reality-vs-perception comparison, step-by-step walker.
  "arudha-pada-finder": { path: "arudha-pada-finder", exportName: "ArudhaPadaFinder" },
  // Lesson 17.4.2 interactive: The Twelve Ä€rÅ«á¸ha PÄdas -- complete image-pÄda grid,
  // AL/UL map, Lagna-AL gap interpretation, and common mistakes panel.
  "twelve-arudha-padas": { path: "twelve-arudha-padas", exportName: "TwelveArudhaPadas" },
  // Lesson 17.4.3 interactive: Ä€rÅ«á¸ha PÄda Calculator (Upapada mode) --
  // computes UL from the 12th, shows double-count steps, 2nd-from-UL, planet
  // placements, and triangulation reminders.
  "arudha-pada-calculator": { path: "arudha-pada-calculator", exportName: "ArudhaPadaCalculator" },
  // Lesson 17.4.4 interactive: Ä€rÅ«á¸ha PÄda Explorer -- computes all twelve
  // padas, inspects occupants per pada, compares image vs reality, and builds
  // focused readings (AL, AL+UL, AL+A2, AL+A10, AL+A11).
  "arudha-pada-explorer": { path: "arudha-pada-explorer", exportName: "ArudhaPadaExplorer" },
  // Lesson 17.4.5 interactive: Ä€rÅ«á¸ha Caveat Lab -- exception detector,
  // dual-lordship convention switcher for Scorpio/Aquarius, and tradition
  // disclosure statement generator.
  "arudha-caveat-lab": { path: "arudha-caveat-lab", exportName: "ArudhaCaveatLab" },
  // Lesson 17.5.1 interactive: RÄÅ›i-Dá¹›á¹£á¹­i Visualizer -- click any sign to
  // see the three signs it aspects, with explore mode, drill mode, and
  // rÄÅ›i-dá¹›á¹£á¹­i vs graha-dá¹›á¹£á¹­i comparison.
  "rashi-drishti-visualizer": { path: "rashi-drishti-visualizer", exportName: "RashiDrishtiVisualizer" },
  // Lesson 17.5.2 interactive: RÄÅ›i-Dá¹›á¹£á¹­i Mapper -- place planets on a chart,
  // select a target, see which signs aspect it, and carry occupants + lords
  // across to read influence and multi-sign convergence.
  "rashi-drishti-mapper": { path: "rashi-drishti-mapper", exportName: "RashiDrishtiMapper" },
  // Lesson 17.5.3 interactive: AK-Drishti Synthesizer -- integrates cara-kÄrakas
  // with rÄÅ›i-dá¹›á¹£á¹­i. Select a kÄraka, place it in a sign, populate the chart,
  // and read the incoming sign-aspects with benefic/malefic classification
  // and automated synthesis reading. Includes the four static-reading framework.
  "ak-drishti-synthesizer": { path: "ak-drishti-synthesizer", exportName: "AkDrishtiSynthesizer" },
  // Lesson 17.7.1 interactive: KÄrakÄá¹Å›a Lagna Locator -- identify the
  // Ä€tmakÄraka from within-sign degrees, select its navÄá¹Å›a (D9) sign, and
  // see that sign projected onto the rÄÅ›i (D1) wheel as a special lagna with
  // houses counted from the KÄrakÄá¹Å›a. Includes source-vs-target diagram.
  "karakamsha-lagna-locator": { path: "karakamsha-lagna-locator", exportName: "KarakamshaLagnaLocator" },
  // Lesson 17.7.2 interactive: KÄrakÄá¹Å›a Reader -- the five-step soul-purpose
  // read. Walks through AK identification, D9 sign selection, KL placement,
  // occupant + rÄÅ›i-dá¹›á¹£á¹­i aspect reading, and key houses from KL with
  // automated synthesis. Presets for Leo and Scorpio KÄrakÄá¹Å›a examples.
  "karakamsha-reader": { path: "karakamsha-reader", exportName: "KarakamshaReader" },
  "karakamsha-virgo-soul-map-lab": { path: "karakamsha-virgo-soul-map-lab", exportName: "KarakamshaVirgoSoulMapLab" },
  "ishta-devata-ketu-derivation-lab": { path: "ishta-devata-ketu-derivation-lab", exportName: "IshtaDevataKetuDerivationLab" },
  "ishta-devata-respect-framing-lab": { path: "ishta-devata-respect-framing-lab", exportName: "IshtaDevataRespectFramingLab" },
  "karakamsha-ishta-synthesis-walkthrough": { path: "karakamsha-ishta-synthesis-walkthrough", exportName: "KarakamshaIshtaSynthesisWalkthrough" },
  // Lesson 17.7.3 interactive: Iá¹£á¹­a-DevatÄ Finder -- select the KÄrakÄá¹Å›a,
  // place planets, and see the 12th-from-KL auto-computed with planet-to-deity
  // mapping, empty-house lord fallback, aspecting contributors, and ethical
  // framing (offer, respect, hold lightly).
  "ishta-devata-finder": { path: "ishta-devata-finder", exportName: "IshtaDevataFinder" },
  "jaimini-amk-career-case-workbench": { path: "jaimini-amk-career-case-workbench", exportName: "JaiminiAmkCareerCaseWorkbench" },
  // Lesson 17.7.4 interactive: Jaimini Workflow Walkthrough -- six ordered steps
  // assembling every Jaimini tool into one end-to-end reading. Enforces workflow
  // discipline: static tools first (Steps 1-5), timing engine last (Step 6).
  // Includes question presets, running synthesis, timing-first failure demo,
  // and cara-daÅ›Ä / VimÅ›ottarÄ« cross-validation.
  "jaimini-workflow-walkthrough": { path: "jaimini-workflow-walkthrough", exportName: "JaiminiWorkflowWalkthrough" },
  // Lesson 17.7.5 interactive: Jaimini Module Closure Map -- seven-chapter arc
  // visualiser, pipeline tracer for four question types, Tier-1-vs-Tier-2
  // comparison, and three discipline cards. Click any chapter to expand its
  // consumes/produces detail; select a question to highlight which chapters
  // the pipeline uses.
  "jaimini-module-closure-map": { path: "jaimini-module-closure-map", exportName: "JaiminiModuleClosureMap" },
  // --- Module 18: Lal Kitab ---
  "lal-kitab-tradition-explorer": { path: "lal-kitab-tradition-explorer", exportName: "LalKitabTraditionExplorer" },
  "lal-kitab-farman-timeline": { path: "lal-kitab-farman-timeline", exportName: "LalKitabFarmanTimeline" },
  "lal-kitab-classical-comparator": { path: "lal-kitab-classical-comparator", exportName: "LalKitabClassicalComparator" },
  "lal-kitab-status-and-ethics-explorer": { path: "lal-kitab-status-and-ethics-explorer", exportName: "LalKitabStatusAndEthicsExplorer" },
  "lal-kitab-teva-doctrine-explorer": { path: "lal-kitab-teva-doctrine-explorer", exportName: "LalKitabTevaDoctrineExplorer" },
  "teva-builder": { path: "teva-builder", exportName: "TevaBuilder" },
  "teva-house-reader": { path: "teva-house-reader", exportName: "TevaHouseReader" },
  "lal-kitab-luminary-mapper": { path: "lal-kitab-luminary-mapper", exportName: "LalKitabLuminaryMapper" },
  "lal-kitab-mars-mercury-mapper": { path: "lal-kitab-mars-mercury-mapper", exportName: "LalKitabMarsMercuryMapper" },
  "lal-kitab-benefic-sorter": { path: "lal-kitab-benefic-sorter", exportName: "LalKitabBeneficSorter" },
  "lal-kitab-shadow-triad": { path: "lal-kitab-shadow-triad", exportName: "LalKitabShadowTriad" },
  "lal-kitab-varshphala-concept": { path: "lal-kitab-varshphala-concept", exportName: "LalKitabVarshphalaConcept" },
  "lal-kitab-varshphala-computation": { path: "lal-kitab-varshphala-computation", exportName: "LalKitabVarshphalaComputation" },
  "lal-kitab-varshphala-reading": { path: "lal-kitab-varshphala-reading", exportName: "LalKitabVarshphalaReading" },
  "lal-kitab-tajika-varshaphala-comparator": { path: "lal-kitab-tajika-varshaphala-comparator", exportName: "LalKitabTajikaVarshaphalaComparator" },
  "lal-kitab-upaya-family-sorter": { path: "lal-kitab-upaya-family-sorter", exportName: "LalKitabUpayaFamilySorter" },
  "lal-kitab-epistemic-disclosure-lab": { path: "lal-kitab-epistemic-disclosure-lab", exportName: "LalKitabEpistemicDisclosureLab" },
  "lal-kitab-remedy-decision-framework": { path: "lal-kitab-remedy-decision-framework", exportName: "LalKitabRemedyDecisionFramework" },
  "cross-stream-remedy-planner": { path: "cross-stream-remedy-planner", exportName: "CrossStreamRemedyPlanner" },
  "lal-kitab-recognition-lab": { path: "lal-kitab-recognition-lab", exportName: "LalKitabRecognitionLab" },
  "lal-kitab-stream-mastery-map": { path: "lal-kitab-stream-mastery-map", exportName: "LalKitabStreamMasteryMap" },
  // Lesson 18.2.4 interactive: Teva vs Lagna Cross-Validator â€” side-by-side dual
  // charts (Teva fixed Aries + ParÄÅ›arÄ« lagna) with planet tracer and discipline
  // check scenarios testing no-conflation. Reinforces frame separation.
  "teva-lagna-cross-validator": { path: "teva-lagna-cross-validator", exportName: "TevaLagnaCrossValidator" },
  // Lesson 18.3.1 interactive: Blind Planet Explorer â€” concept tab with andhÄ
  // metaphor and characteristics, blind-vs-combust comparison table + scenario
  // classifier, and 6-scenario recognition drill with cause-based reasoning.
  "blind-planet-explorer": { path: "blind-planet-explorer", exportName: "BlindPlanetExplorer" },
  // Lesson 18.3.2 interactive: Sleeping Planet Explorer â€” concept tab with sutela
  // metaphor and three characteristics, three awakening-mechanism cards, blind/
  // sleeping/awake comparison table, and 6-scenario four-state recognition drill.
  "sleeping-planet-explorer": { path: "sleeping-planet-explorer", exportName: "SleepingPlanetExplorer" },
  // Lesson 18.3.3 interactive: Burning Planet Explorer â€” concept tab with jalit
  // metaphor and three characteristics, two cause cards, four-state comparison
  // table with remedy logic, and 6-scenario recognition drill.
  "burning-planet-explorer": { path: "burning-planet-explorer", exportName: "BurningPlanetExplorer" },
  // Lesson 18.3.4 interactive: Planetary State Synthesizer â€” Chapter 3 capstone.
  // Awake-state concept with lamp metaphor, interactive four-state framework table
  // with remedy-goal mapping, elimination checklist, and 6-scenario capstone drill
  // with yes/no check previews.
  "planetary-state-synthesizer": { path: "planetary-state-synthesizer", exportName: "PlanetaryStateSynthesizer" },
  // Lesson 21.3.1 interactive: MÅ«lÄá¹…ka Calculator â€” birth-day-of-month (1-31)
  // input with strict-preservation vs flexibility convention toggle, step-by-step
  // computation, graha-aá¹…ka register + caveat display, 31-day reference table,
  // five-step discipline workflow, and four worked examples.
  "mulanka-calculator": { path: "mulanka-calculator", exportName: "MulankaCalculator" },
  // Lesson 21.3.2 interactive: BhÄgyÄá¹…ka Calculator â€” full birth-date input
  // (day/month/year) with strict-preservation vs flexibility convention toggle,
  // step-by-step digit-sum computation, graha-aá¹…ka register + caveat display,
  // combined MÅ«lÄá¹…ka-to-BhÄgyÄá¹…ka lifetime-arc reading, worked examples, and
  // five-step discipline workflow including destiny-determinism refusal layer.
  "bhagyanka-calculator": { path: "bhagyanka-calculator", exportName: "BhagyankaCalculator" },
  // Lesson 21.3.3 interactive: Name-Number (NÄmÄá¹…ka) Calculator â€” three-system
  // name computation (Chaldean / Pythagorean / Vedic-Chaldean hybrid) with
  // strict-preservation vs flexibility convention toggle, letter-by-letter
  // breakdown, graha-aá¹…ka register + caveat display, Pythagorean four-number
  // framework panel, letter-table reference, worked examples, and six-step
  // discipline workflow including name-change refusal layer.
  "mulanka-bhagyanka-namanka-calculator": { path: "mulanka-bhagyanka-namanka-calculator", exportName: "MulankaBhagyankaNamankaCalculator" },
  // Lesson 21.3.4 interactive: Personal Year Number Calculator â€” birth-date +
  // target-calendar-year computation with strict-preservation vs flexibility
  // convention toggle, step-by-step digit-sum breakdown, graha-aá¹…ka register +
  // caveat display, 9-year cycle visualisation, worked examples, and six-step
  // discipline workflow including year-as-determinant refusal layer.
  "personal-year-calculator": { path: "personal-year-calculator", exportName: "PersonalYearCalculator" },
  // Lesson 21.4.1 interactive: Name-Correction Rationale Evaluator â€” scenario-
  // based drill for categorising name-change rationales, identifying over-claim
  // layers, applying the convergent-independent-grounds operational test, and
  // reaching approve / partial / refuse verdicts. Includes six-category reference
  // and five-step rationale-evaluation workflow.
  "name-correction-rationale-evaluator": { path: "name-correction-rationale-evaluator", exportName: "NameCorrectionRationaleEvaluator" },
  // Lesson 21.4.2 interactive: Name-Correction Candidate Calculator â€” six-step
  // workflow tool that computes current + candidate Name-Numbers under the chosen
  // system and convention, evaluates graha-compatibility (MITRA/SHATRU/SAMA) with
  // MÅ«lÄá¹…ka / BhÄgyÄá¹…ka, tabulates candidates, and generates a discipline-compliant
  // confirmatory-not-deterministic presentation template.
  "name-correction-candidate-calculator": { path: "name-correction-candidate-calculator", exportName: "NameCorrectionCandidateCalculator" },
  // Lesson 21.4.3 interactive: Name-Correction Caution Screener â€” scenario-based
  // drill that applies the four-test screen, identifies the six commercial-numerology
  // failure modes, surfaces the three real-cost categories, and practises reaching
  // proceed / preview / revise / refuse verdicts. Includes reference tabs for costs,
  // failure-mode catalogue, and the Chapter 4 integrated refusal-discipline workflow.
  "name-correction-caution-screener": { path: "name-correction-caution-screener", exportName: "NameCorrectionCautionScreener" },
  // Lesson 21.4.4 interactive: Numerology Honest-Handling Inspector â€” scenario-based
  // drill that distinguishes the empirical-kernel from the over-claim layer, identifies
  // the eight over-claim framings, applies the five operational forms of do-no-harm,
  // and reaches proceed / revise / refuse / mixed verdicts. Includes reference tabs
  // for the three-layer holding, the five do-no-harm forms, and the Chapter 1-4
  // integration table.
  "numerology-honest-handling-inspector": { path: "numerology-honest-handling-inspector", exportName: "NumerologyHonestHandlingInspector" },
  // Lesson 21.5.1 interactive: Numerology Compatibility Calculator â€” two-person
  // Mulanka / Bhagyanka / Name-number comparison using MITRA / SHATRU / SAMA
  // graha-friendship vectors with relationship-outcome over-claim refusal.
  "numerology-compatibility-calculator": { path: "numerology-compatibility-calculator", exportName: "NumerologyCompatibilityCalculator" },
  // Lesson 21.5.2 interactive: Business Name Numerology Calculator â€” business-name
  // candidate computation with founder compatibility, industry-register preference,
  // and pre-launch versus post-launch rebrand discipline.
  "business-name-numerology-calculator": { path: "business-name-numerology-calculator", exportName: "BusinessNameNumerologyCalculator" },
  // Lesson 21.5.3 interactive: Object Numerology Calculator â€” house / phone /
  // vehicle digit reduction, personal compatibility, limited-choice recognition,
  // and explicit 4/8 fear-induction refusal.
  "object-numerology-calculator": { path: "object-numerology-calculator", exportName: "ObjectNumerologyCalculator" },
  // Lesson 21.6.1 interactive: Chart Numerology Integration Tool â€” three-number
  // to natal-graha cross-reference, four alignment configurations, and explicit
  // chart-numerology causation over-claim refusal.
  "chart-numerology-integration-tool": { path: "chart-numerology-integration-tool", exportName: "ChartNumerologyIntegrationTool" },
  // Lesson 21.6.2 interactive: Numerology Decision Flow â€” apply / refuse /
  // defer gates, authorised consultation modes, and absent-grounds discipline.
  "numerology-decision-flow": { path: "numerology-decision-flow", exportName: "NumerologyDecisionFlow" },
  // Lesson 21.6.3 interactive: Discipline Statement Builder â€” six-chapter M21
  // synthesis, do-no-harm floor, and five-field practitioner statement worksheet.
  "discipline-statement-builder": { path: "discipline-statement-builder", exportName: "DisciplineStatementBuilder" },
  "nadi-discipline-statement-builder": { path: "nadi-discipline-statement-builder", exportName: "NadiDisciplineStatementBuilder" },
  "three-step-protocol-overview": { path: "three-step-protocol-overview", exportName: "ThreeStepProtocolOverview" },
  "lagna-assessment-scorer": { path: "lagna-assessment-scorer", exportName: "LagnaAssessmentScorer" },
  "dasha-bhukti-timing-window": { path: "dasha-bhukti-timing-window", exportName: "DashaBhuktiTimingWindow" },
  "gochara-trigger-confirmation": { path: "gochara-trigger-confirmation", exportName: "GocharaTriggerConfirmation" },
  "worked-example-3-step-synthesis": { path: "worked-example-3-step-synthesis", exportName: "WorkedExample3StepSynthesis" },
  "parashara-default-explorer": { path: "parashara-default-explorer", exportName: "ParasharaDefaultExplorer" },
  "kp-cuspal-decision-tree": { path: "kp-cuspal-decision-tree", exportName: "KpCuspalDecisionTree" },
  "jaimini-calling-decision-tree": { path: "jaimini-calling-decision-tree", exportName: "JaiminiCallingDecisionTree" },
  "remedy-year-decision-tree": { path: "remedy-year-decision-tree", exportName: "RemedyYearDecisionTree" },
  "layered-framework-decision-synthesis": { path: "layered-framework-decision-synthesis", exportName: "LayeredFrameworkDecisionSynthesis" },
  "prediction-confidence-dial": { path: "prediction-confidence-dial", exportName: "PredictionConfidenceDial" },
  "two-yes-indicator-counter": { path: "two-yes-indicator-counter", exportName: "TwoYesIndicatorCounter" },
  "karma-agency-simulator": { path: "karma-agency-simulator", exportName: "KarmaAgencySimulator" },
  "confidence-phrasing-rewriter": { path: "confidence-phrasing-rewriter", exportName: "ConfidencePhrasingRewriter" },
  "write-up-structure-scaffolder": { path: "write-up-structure-scaffolder", exportName: "WriteUpStructureScaffolder" },
  "marriage-synthesis-workbench": { path: "marriage-synthesis-workbench", exportName: "MarriageSynthesisWorkbench" },
  "career-synthesis-workbench": { path: "career-synthesis-workbench", exportName: "CareerSynthesisWorkbench" },
  "multi-domain-synthesis-workbench": { path: "multi-domain-synthesis-workbench", exportName: "MultiDomainSynthesisWorkbench" },
  "five-stream-synthesis-discipline-lab": { path: "five-stream-synthesis-discipline-lab", exportName: "FiveStreamSynthesisDisciplineLab" },
  "five-stream-matrix-shape-lab": { path: "five-stream-matrix-shape-lab", exportName: "FiveStreamMatrixShapeLab" },
  "convergence-divergence-matrix-builder": { path: "convergence-divergence-matrix-builder", exportName: "ConvergenceDivergenceMatrixBuilder" },
  "confidence-tier-overlay-builder": { path: "confidence-tier-overlay-builder", exportName: "ConfidenceTierOverlayBuilder" },
  "divergence-pattern-ranker": { path: "divergence-pattern-ranker", exportName: "DivergencePatternRanker" },
  "dual-matrix-domain-comparison": { path: "dual-matrix-domain-comparison", exportName: "DualMatrixDomainComparison" },
  "conflict-resolution-sequence-walkthrough": { path: "conflict-resolution-sequence-walkthrough", exportName: "ConflictResolutionSequenceWalkthrough" },
  "synthesis-statement-composition-discipline": { path: "synthesis-statement-composition-discipline", exportName: "SynthesisStatementCompositionDiscipline" },
  "five-stream-layered-evidence-lab": { path: "five-stream-layered-evidence-lab", exportName: "FiveStreamLayeredEvidenceLab" },
  "stream-orientation-leak-audit-lab": { path: "stream-orientation-leak-audit-lab", exportName: "StreamOrientationLeakAuditLab" },
  "parashara-anchor-md1-lab": { path: "parashara-anchor-md1-lab", exportName: "ParasharaAnchorMd1Lab" },
  "parashara-only-statement-template-lab": { path: "parashara-only-statement-template-lab", exportName: "ParasharaOnlyStatementTemplateLab" },
  "parashara-worked-reading-md1-lab": { path: "parashara-worked-reading-md1-lab", exportName: "ParasharaWorkedReadingMd1Lab" },
  "parashara-anchor-not-verdict-lab": { path: "parashara-anchor-not-verdict-lab", exportName: "ParasharaAnchorNotVerdictLab" },
  "kp-cuspal-yes-no-augmentation-lab": { path: "kp-cuspal-yes-no-augmentation-lab", exportName: "KpCuspalYesNoAugmentationLab" },
  "kp-purpose-built-routing-lab": { path: "kp-purpose-built-routing-lab", exportName: "KpPurposeBuiltRoutingLab" },
  "kp-layer-boundary-worked-example-lab": { path: "kp-layer-boundary-worked-example-lab", exportName: "KpLayerBoundaryWorkedExampleLab" },
  "parashara-kp-two-stream-statement-lab": { path: "parashara-kp-two-stream-statement-lab", exportName: "ParasharaKpTwoStreamStatementLab" },
  "jaimini-dharma-path-augmentation-lab": { path: "jaimini-dharma-path-augmentation-lab", exportName: "JaiminiDharmaPathAugmentationLab" },
  "jaimini-native-domain-routing-lab": { path: "jaimini-native-domain-routing-lab", exportName: "JaiminiNativeDomainRoutingLab" },
  "jaimini-ranking-robustness-lab": { path: "jaimini-ranking-robustness-lab", exportName: "JaiminiRankingRobustnessLab" },
  "parashara-kp-jaimini-three-stream-lab": { path: "parashara-kp-jaimini-three-stream-lab", exportName: "ParasharaKpJaiminiThreeStreamLab" },
  "lal-kitab-remedy-augmentation-lab": { path: "lal-kitab-remedy-augmentation-lab", exportName: "LalKitabRemedyAugmentationLab" },
  "tajika-year-specific-augmentation-lab": { path: "tajika-year-specific-augmentation-lab", exportName: "TajikaYearSpecificAugmentationLab" },
  "nadi-access-limits-decision-lab": { path: "nadi-access-limits-decision-lab", exportName: "NadiAccessLimitsDecisionLab" },
  "five-stream-target-chart-synthesis-lab": { path: "five-stream-target-chart-synthesis-lab", exportName: "FiveStreamTargetChartSynthesisLab" },
  "five-stream-statement-template-lab": { path: "five-stream-statement-template-lab", exportName: "FiveStreamStatementTemplateLab" },
  // Lesson 7.5.4's §7 explorer: KP Longevity Chart H1 Synthesis — apply KP
  // doctrine to Chart H1 (Bhādhaka + verified Saturn sub-lord), then practise
  // the three-stream synthesis and ethical-framing trainer.
  "kp-longevity-chart-h1-synthesis": { path: "kp-longevity-chart-h1-synthesis", exportName: "KpLongevityChartH1Synthesis" },
  // Lesson 7.6.1's §7 explorer: Kālapuruṣa Body-Map Explorer — interactive
  // body-part-to-house mapping with zodiac vs chart toggle and scope gate.
  "kalapurusha-body-map-explorer": { path: "kalapurusha-body-map-explorer", exportName: "KalapurushaBodyMapExplorer" },
  // Lesson 7.6.2's §7 explorer: Graha-Disease Correspondence Explorer —
  // seven-graha correspondences, two-layer reinforcement, tridoṣa bridge, scope gate.
  "graha-disease-correspondence-explorer": { path: "graha-disease-correspondence-explorer", exportName: "GrahaDiseaseCorrespondenceExplorer" },
  // Lesson 7.6.3's §7 trainer: Contextualisation Discipline Trainer —
  // direction-of-inference, harm pathways, question classifier, response builder.
  "contextualisation-discipline-trainer": { path: "contextualisation-discipline-trainer", exportName: "ContextualisationDisciplineTrainer" },
  // Lesson 7.6.4's §7 trainer: Contextualisation Worked-Example Trainer —
  // diagnosis-first gate, contextualisation chain, no-match honesty, statement practice.
  "contextualisation-worked-example-trainer": { path: "contextualisation-worked-example-trainer", exportName: "ContextualisationWorkedExampleTrainer" },
  // Lesson 7.7.1's §7 explorer: Health Synthesis Overview Map —
  // seven-lesson roadmap, Chart H1 findings recap, question router, capability-to-restraint sequence.
  "health-synthesis-overview-map": { path: "health-synthesis-overview-map", exportName: "HealthSynthesisOverviewMap" },
  // Lesson 7.7.2's §7 workbench: Vitality-Trend Synthesis Workbench —
  // seven-layer synthesis, convergence/divergence diagram, response translator, mistake check.
  "vitality-trend-synthesis-workbench": { path: "vitality-trend-synthesis-workbench", exportName: "VitalityTrendSynthesisWorkbench" },
  // Lesson 7.7.3's §7 trainer: Known-Illness Support Consultation Trainer —
  // scenario compass, response builder, silent confidence toggle, mistake check.
  "known-illness-support-consultation-trainer": { path: "known-illness-support-consultation-trainer", exportName: "KnownIllnessSupportConsultationTrainer" },
  // Lesson 7.7.4's §7 trainer: Death-Prediction Prohibition Trainer —
  // absolute rule barrier, five category scripts, wrong-vs-right comparisons, restraint verse.
  "death-prediction-prohibition-trainer": { path: "death-prediction-prohibition-trainer", exportName: "DeathPredictionProhibitionTrainer" },
  // Lesson 7.7.5's §7 tool: Medical-Routing Decision Tree —
  // interactive four-tier tree, tier reference, scenario classifier, sequence rule.
  "medical-routing-decision-tree": { path: "medical-routing-decision-tree", exportName: "MedicalRoutingDecisionTree" },
  "active-medical-distress-handling-trainer": { path: "active-medical-distress-handling-trainer", exportName: "ActiveMedicalDistressHandlingTrainer" },
  "medical-domain-competence-closing-synthesizer": { path: "medical-domain-competence-closing-synthesizer", exportName: "MedicalDomainCompetenceClosingSynthesizer" },
  "fourth-house-education-workbench": { path: "fourth-house-education-workbench", exportName: "FourthHouseEducationWorkbench" },
  "fifth-house-intellect-workbench": { path: "fifth-house-intellect-workbench", exportName: "FifthHouseIntellectWorkbench" },
  "ninth-house-higher-learning-workbench": { path: "ninth-house-higher-learning-workbench", exportName: "NinthHouseHigherLearningWorkbench" },
  "four-five-nine-educational-arc-synthesizer": { path: "four-five-nine-educational-arc-synthesizer", exportName: "FourFiveNineEducationalArcSynthesizer" },
  "d24-construction-workbench": { path: "d24-construction-workbench", exportName: "D24ConstructionWorkbench" },
  "d24-education-reading-workbench": { path: "d24-education-reading-workbench", exportName: "D24EducationReadingWorkbench" },
  "d24-mercury-jupiter-karaka-workbench": { path: "d24-mercury-jupiter-karaka-workbench", exportName: "D24MercuryJupiterKarakaWorkbench" },
  "d24-education-synthesis-workbench": { path: "d24-education-synthesis-workbench", exportName: "D24EducationSynthesisWorkbench" },
  "mercury-buddhi-karaka-workbench": { path: "mercury-buddhi-karaka-workbench", exportName: "MercuryBuddhiKarakaWorkbench" },
  "jupiter-jnana-karaka-workbench": { path: "jupiter-jnana-karaka-workbench", exportName: "JupiterJnanaKarakaWorkbench" },
  "sarasvati-yoga-checklist-workbench": { path: "sarasvati-yoga-checklist-workbench", exportName: "SarasvatiYogaChecklistWorkbench" },
  "aptitude-tendency-mapper": { path: "aptitude-tendency-mapper", exportName: "AptitudeTendencyMapper" },
  "field-of-study-synthesis-workbench": { path: "field-of-study-synthesis-workbench", exportName: "FieldOfStudySynthesisWorkbench" },
  "exam-outcome-confidence-workbench": { path: "exam-outcome-confidence-workbench", exportName: "ExamOutcomeConfidenceWorkbench" },
  "education-scope-of-competence-workbench": { path: "education-scope-of-competence-workbench", exportName: "EducationScopeOfCompetenceWorkbench" },
  "d4-construction-workbench": { path: "d4-construction-workbench", exportName: "D4ConstructionWorkbench" },
  "d4-internal-lagna-fourth-reading-lab": { path: "d4-internal-lagna-fourth-reading-lab", exportName: "D4InternalLagnaFourthReadingLab" },
  "d4-property-quality-comparison-lab": { path: "d4-property-quality-comparison-lab", exportName: "D4PropertyQualityComparisonLab" },
  "d4-complete-property-reading-assembly-lab": { path: "d4-complete-property-reading-assembly-lab", exportName: "D4CompletePropertyReadingAssemblyLab" },
  "lal-kitab-property-teva-formula-lab": { path: "lal-kitab-property-teva-formula-lab", exportName: "LalKitabPropertyTevaFormulaLab" },
  "kp-property-fourth-cusp-sub-lord-lab": { path: "kp-property-fourth-cusp-sub-lord-lab", exportName: "KpPropertyFourthCuspSubLordLab" },
  "kp-property-significator-timing-lab": { path: "kp-property-significator-timing-lab", exportName: "KpPropertySignificatorTimingLab" },
  "cross-stream-property-synthesis-lab": { path: "cross-stream-property-synthesis-lab", exportName: "CrossStreamPropertySynthesisLab" },
  "property-dasha-acquisition-timing-lab": { path: "property-dasha-acquisition-timing-lab", exportName: "PropertyDashaAcquisitionTimingLab" },
  "home-purchase-confidence-synthesis-lab": { path: "home-purchase-confidence-synthesis-lab", exportName: "HomePurchaseConfidenceSynthesisLab" },
  "vastu-property-scope-distinction-lab": { path: "vastu-property-scope-distinction-lab", exportName: "VastuPropertyScopeDistinctionLab" },
  "property-competence-routing-lab": { path: "property-competence-routing-lab", exportName: "PropertyCompetenceRoutingLab" },
  "kp-education-cuspal-sub-lord-lab": { path: "kp-education-cuspal-sub-lord-lab", exportName: "KpEducationCuspalSubLordLab" },
  "kp-education-significator-hierarchy-lab": { path: "kp-education-significator-hierarchy-lab", exportName: "KpEducationSignificatorHierarchyLab" },
  "kp-education-exam-timing-overlay-lab": { path: "kp-education-exam-timing-overlay-lab", exportName: "KpEducationExamTimingOverlayLab" },
  "kp-education-worked-exam-synthesis-lab": { path: "kp-education-worked-exam-synthesis-lab", exportName: "KpEducationWorkedExamSynthesisLab" },
  "education-dasha-timing-window-lab": { path: "education-dasha-timing-window-lab", exportName: "EducationDashaTimingWindowLab" },
  "education-transit-tdv-overlay-lab": { path: "education-transit-tdv-overlay-lab", exportName: "EducationTransitTdvOverlayLab" },
  "education-synthesis-overview-table-lab": { path: "education-synthesis-overview-table-lab", exportName: "EducationSynthesisOverviewTableLab" },
  "predictive-failure-mode-quiz": { path: "predictive-failure-mode-quiz", exportName: "PredictiveFailureModeQuiz" },
  "birth-time-accuracy-assessment": { path: "birth-time-accuracy-assessment", exportName: "BirthTimeAccuracyAssessment" },
  "ayanamsha-choice-verifier": { path: "ayanamsha-choice-verifier", exportName: "AyanamshaChoiceVerifier" },
  "house-system-choice-verifier": { path: "house-system-choice-verifier", exportName: "HouseSystemChoiceVerifier" },
  "data-preparation-preflight": { path: "data-preparation-preflight", exportName: "DataPreparationPreflight" },
  "tattva-shuddhi-checker": { path: "tattva-shuddhi-checker", exportName: "TattvaShuddhiChecker" },
  "cross-check-decision-synthesizer": { path: "cross-check-decision-synthesizer", exportName: "CrossCheckDecisionSynthesizer" },
  "preliminary-cross-check-preflight": { path: "preliminary-cross-check-preflight", exportName: "PreliminaryCrossCheckPreflight" },
  "dignity-strength-analyzer": { path: "dignity-strength-analyzer", exportName: "DignityStrengthAnalyzer" },
  "yoga-dosha-identifier": { path: "yoga-dosha-identifier", exportName: "YogaDoshaIdentifier" },
  "dasha-context-analyzer": { path: "dasha-context-analyzer", exportName: "DashaContextAnalyzer" },
  "transit-context-analyzer": { path: "transit-context-analyzer", exportName: "TransitContextAnalyzer" },
  "reading-synthesis-workbench": { path: "reading-synthesis-workbench", exportName: "ReadingSynthesisWorkbench" },
  "cross-stream-concept-builder": { path: "cross-stream-concept-builder", exportName: "CrossStreamConceptBuilder" },
  "parashari-kp-verifier": { path: "parashari-kp-verifier", exportName: "ParashariKpVerifier" },
  "convergence-divergence-workbench": { path: "convergence-divergence-workbench", exportName: "ConvergenceDivergenceWorkbench" },
  "reading-documentation-template": { path: "reading-documentation-template", exportName: "ReadingDocumentationTemplate" },
  "second-house-wealth-evaluator": { path: "second-house-wealth-evaluator", exportName: "SecondHouseWealthEvaluator" },
  "eleventh-house-gains-evaluator": { path: "eleventh-house-gains-evaluator", exportName: "EleventhHouseGainsEvaluator" },
  "second-eleventh-lord-permutations": { path: "second-eleventh-lord-permutations", exportName: "SecondEleventhLordPermutations" },
  "natural-wealth-karaka-analyzer": { path: "natural-wealth-karaka-analyzer", exportName: "NaturalWealthKarakaAnalyzer" },
  "d2-solar-lunar-bisection": { path: "d2-solar-lunar-bisection", exportName: "D2SolarLunarBisection" },
  "d2-bisection-doctrine-reader": { path: "d2-bisection-doctrine-reader", exportName: "D2BisectionDoctrineReader" },
  "d2-solar-lunar-tendencies": { path: "d2-solar-lunar-tendencies", exportName: "D2SolarLunarTendencies" },
  "d2-real-chart-workbench": { path: "d2-real-chart-workbench", exportName: "D2RealChartWorkbench" },
  "dhana-yoga-pattern-verifier": { path: "dhana-yoga-pattern-verifier", exportName: "DhanaYogaPatternVerifier" },
  "dhana-yoga-variants-evaluator": { path: "dhana-yoga-variants-evaluator", exportName: "DhanaYogaVariantsEvaluator" },
  "lakshmi-yoga-analyser": { path: "lakshmi-yoga-analyser", exportName: "LakshmiYogaAnalyser" },
  "dhana-yoga-shadbala-overlay": { path: "dhana-yoga-shadbala-overlay", exportName: "DhanaYogaShadbalaOverlay" },
  "kp-cuspal-sub-lord-doctrine": { path: "kp-cuspal-sub-lord-doctrine", exportName: "KpCuspalSubLordDoctrine" },
  "kp-money-significators-evaluator": { path: "kp-money-significators-evaluator", exportName: "KpMoneySignificatorsEvaluator" },
  "kp-investment-timing-explorer": { path: "kp-investment-timing-explorer", exportName: "KpInvestmentTimingExplorer" },
  "kp-wealth-question-workbench": { path: "kp-wealth-question-workbench", exportName: "KpWealthQuestionWorkbench" },
  "lal-kitab-money-formula-revisited": { path: "lal-kitab-money-formula-revisited", exportName: "LalKitabMoneyFormulaRevisited" },
  "lal-kitab-money-planets-analyser": { path: "lal-kitab-money-planets-analyser", exportName: "LalKitabMoneyPlanetsAnalyser" },
  "lal-kitab-loss-formulas-evaluator": { path: "lal-kitab-loss-formulas-evaluator", exportName: "LalKitabLossFormulasEvaluator" },
  "lal-kitab-wealth-reading-workbench": { path: "lal-kitab-wealth-reading-workbench", exportName: "LalKitabWealthReadingWorkbench" },
  // Lesson 22.1.1 interactive: Vastu Origins Explorer — historical stream,
  // five-domain spatial scope, classical corpus, and modern feasibility guards.
  "vastu-origins-explorer": { path: "vastu-origins-explorer", exportName: "VastuOriginsExplorer" },
  // Lesson 22.1.2 interactive: Vastu Purusha Mandala Explorer â€” 9x9 / 8x8 /
  // 7x7 grid variants, Brahma-sthana, deity-zone rings, and apartment guards.
  "vastu-purusha-mandala-explorer": { path: "vastu-purusha-mandala-explorer", exportName: "VastuPurushaMandalaExplorer" },
  // Lesson 22.1.3 interactive: Vastu Five Element Mapper â€” pancha-bhuta
  // direction zones, activity matching, conflicts, and cross-discipline guardrails.
  "vastu-five-element-mapper": { path: "vastu-five-element-mapper", exportName: "VastuFiveElementMapper" },
  // Lesson 22.1.4 interactive: Vastu Text Corpus Navigator â€” source layers,
  // five-text corpus, reading sequence, and regional attribution discipline.
  "vastu-text-corpus-navigator": { path: "vastu-text-corpus-navigator", exportName: "VastuTextCorpusNavigator" },
  // Lesson 22.2.1 interactive: Vastu Cardinal Direction Lords â€” Indra, Yama,
  // Varuna, Kubera, deity-quality judgments, and activity matching.
  "vastu-cardinal-direction-lords": { path: "vastu-cardinal-direction-lords", exportName: "VastuCardinalDirectionLords" },
  // Lesson 22.2.2 interactive: Vastu Intercardinal Double Quality â€” Ishana,
  // Agni, Nirriti, Vayu, convergent deity-element matching, and fear guardrails.
  "vastu-intercardinal-double-quality": { path: "vastu-intercardinal-double-quality", exportName: "VastuIntercardinalDoubleQuality" },
  // Lesson 22.2.3 interactive: Vastu Room Direction Synthesizer â€” room-by-room
  // primary, secondary, mitigation, and prohibited placement workflow.
  "vastu-room-direction-synthesizer": { path: "vastu-room-direction-synthesizer", exportName: "VastuRoomDirectionSynthesizer" },
  // Lesson 22.3.1 interactive: Vastu Earth Water Axis -- NE/SW polar axis,
  // water and weight placement, elevation discipline, and mitigation cues.
  "vastu-earth-water-axis": { path: "vastu-earth-water-axis", exportName: "VastuEarthWaterAxis" },
  // Lesson 22.3.2 interactive: Vastu Fire Air Axis -- SE/NW compatible-flow
  // axis, kitchen discipline, ventilation path, and proportional mitigation.
  "vastu-fire-air-axis": { path: "vastu-fire-air-axis", exportName: "VastuFireAirAxis" },
  // Lesson 22.3.3 interactive: Vastu Brahmasthana Center -- central 3x3
  // Akasha discipline, centre-violation severity, and apartment mitigation.
  "vastu-brahmasthana-center": { path: "vastu-brahmasthana-center", exportName: "VastuBrahmasthanaCenter" },
  // Lesson 22.4.1 interactive: Vastu Plot Selection Evaluator -- bhu-pariksha
  // shape, extension/cut, road-facing, topography, and proportional verdict.
  "vastu-plot-selection-evaluator": { path: "vastu-plot-selection-evaluator", exportName: "VastuPlotSelectionEvaluator" },
  // Lesson 22.4.2 interactive: Vastu Ground Slope Evaluator -- slope,
  // drainage, construction phase, vertical massing, and grading feasibility.
  "vastu-ground-slope-evaluator": { path: "vastu-ground-slope-evaluator", exportName: "VastuGroundSlopeEvaluator" },
  // Lesson 22.4.3 interactive: Vastu House Shape Evaluator -- building form,
  // corner integrity, axis rotation, and modern-context mitigation.
  "vastu-house-shape-evaluator": { path: "vastu-house-shape-evaluator", exportName: "VastuHouseShapeEvaluator" },
  // Lesson 22.4.4 interactive: Vastu Extensions Cuts Evaluator -- extension
  // versus cut asymmetry, directional severity, size, and context handling.
  "vastu-extensions-cuts-evaluator": { path: "vastu-extensions-cuts-evaluator", exportName: "VastuExtensionsCutsEvaluator" },
  // Lesson 22.5.1 interactive: Vastu Remedy Framework -- severity-calibrated
  // architectural, symbolic, yantra/pyramid, and ritual remediation tiers.
  "vastu-remedy-framework": { path: "vastu-remedy-framework", exportName: "VastuRemedyFramework" },
  // Lesson 22.5.2 interactive: Vastu Apartment Office Planner -- unit-level
  // mandala placement for apartments, offices, retail, and commercial spaces.
  "vastu-apartment-office-planner": { path: "vastu-apartment-office-planner", exportName: "VastuApartmentOfficePlanner" },
  // Lesson 22.5.3 interactive: Vastu Mirror Remedy Planner -- wall direction,
  // room context, sensitive reflection targets, and honest modern attribution.
  "vastu-mirror-remedy-planner": { path: "vastu-mirror-remedy-planner", exportName: "VastuMirrorRemedyPlanner" },
  // Lesson 22.6.1 interactive: Vastu Honest Handling Audit -- four-test screen
  // for empirical kernel, demolition prohibition, cost-benefit, and overclaim.
  "vastu-honest-handling-audit": { path: "vastu-honest-handling-audit", exportName: "VastuHonestHandlingAudit" },
  // Lesson 22.6.2 interactive: Vastu Decision Framework -- when to flag,
  // defer, refuse, and sequence the four-tier remediation cascade.
  "vastu-decision-framework": { path: "vastu-decision-framework", exportName: "VastuDecisionFramework" },
  // Lesson 22.6.3 interactive: Vastu Chart Integration -- 4H,
  // residential karakas, property houses, and dik-pala-graha context.
  "vastu-chart-integration": { path: "vastu-chart-integration", exportName: "VastuChartIntegration" },
  // Lesson 22.6.4 interactive: Vastu Module Closure -- six-chapter
  // synthesis, do-no-harm commitments, and practitioner statement builder.
  "vastu-module-closure": { path: "vastu-module-closure", exportName: "VastuModuleClosure" },
  // Lesson 18.4.4 interactive: Lal Kitab Graha Clusters â€” Chapter 4 capstone.
  // Accordion clusters for Saturn / RÄhu / Ketu, 6-item quiz, and all-nine-graha
  // summary table with unifying concrete-object pattern.
  "lal-kitab-graha-clusters": { path: "lal-kitab-graha-clusters", exportName: "LalKitabGrahaClusters" },
  "gochara-intro": { path: "gochara-intro", exportName: "GocharaIntro" },
  "natal-relative-counter": { path: "natal-relative-counter", exportName: "NatalRelativeCounter" },
  "transit-computer": { path: "transit-computer", exportName: "TransitComputer" },
  "three-reference-reader": { path: "three-reference-reader", exportName: "ThreeReferenceReader" },
  "sade-sati-tracker": { path: "sade-sati-tracker", exportName: "SadeSatiTracker" },
  "sade-sati-phases": { path: "sade-sati-phases", exportName: "SadeSatiPhases" },
  "sade-sati-favourability": { path: "sade-sati-favourability", exportName: "SadeSatiFavourability" },
  "sade-sati-cancellation-checker": { path: "sade-sati-cancellation-checker", exportName: "SadeSatiCancellationChecker" },
  "sade-sati-communication-guide": { path: "sade-sati-communication-guide", exportName: "SadeSatiCommunicationGuide" },
  "kantaka-shani-reader": { path: "kantaka-shani-reader", exportName: "KantakaShaniReader" },
  "saturn-transit-map": { path: "saturn-transit-map", exportName: "SaturnTransitMap" },
  "guru-transit-reader": { path: "guru-transit-reader", exportName: "GuruTransitReader" },
  "guru-saturn-conjunction-reader": { path: "guru-saturn-conjunction-reader", exportName: "GuruSaturnConjunctionReader" },
  "nodal-transit-tracker": { path: "nodal-transit-tracker", exportName: "NodalTransitTracker" },
  "nodal-axis-house-reader": { path: "nodal-axis-house-reader", exportName: "NodalAxisHouseReader" },
  "eclipse-significance-checker": { path: "eclipse-significance-checker", exportName: "EclipseSignificanceChecker" },
  "eclipse-calendar": { path: "eclipse-calendar", exportName: "EclipseCalendar" },
  "vedha-intro": { path: "vedha-intro", exportName: "VedhaIntro" },
  "vedha-table-lookup": { path: "vedha-table-lookup", exportName: "VedhaTableLookup" },
  "vedha-applicator": { path: "vedha-applicator", exportName: "VedhaApplicator" },
  "cross-stream-transit-intro": { path: "cross-stream-transit-intro", exportName: "CrossStreamTransitIntro" },
  "transit-workflow-workbench": { path: "transit-workflow-workbench", exportName: "TransitWorkflowWorkbench" },
  // --- merged: components built in the local reconciliation session (not on remote) ---
  "career-varga-workflow": { path: "career-varga-workflow", exportName: "CareerVargaWorkflow" },
  "chaturthamsha-calculator": { path: "chaturthamsha-calculator", exportName: "ChaturthamshaCalculator" },
  "chaturvimshamsha-calculator": { path: "chaturvimshamsha-calculator", exportName: "ChaturvimshamshaCalculator" },
  "children-varga-workflow": { path: "children-varga-workflow", exportName: "ChildrenVargaWorkflow" },
  "dashamsha-calculator": { path: "dashamsha-calculator", exportName: "DashamshaCalculator" },
  // Tier 2 Module 3 Chapter 2 Lesson 1: D10 Deva-Asura Construction Lab —
  // clickable zodiac ring, ten-segment strip, destination arc, parity-error
  // comparator, worked-example stepper, deity wheel and D10 Lagna builder.
  "dashamsha-deva-asura-lab": { path: "dashamsha-deva-asura-lab", exportName: "DashamshaDevaAsuraLab" },
  "d10-parity-construction-workbench": { path: "d10-parity-construction-workbench", exportName: "D10ParityConstructionWorkbench" },
  "d10-reading-anchor-workbench": { path: "d10-reading-anchor-workbench", exportName: "D10ReadingAnchorWorkbench" },
  "d1-d10-convergence-workbench": { path: "d1-d10-convergence-workbench", exportName: "D1D10ConvergenceWorkbench" },
  "d10-career-question-workbench": { path: "d10-career-question-workbench", exportName: "D10CareerQuestionWorkbench" },
  "dvadashamsha-calculator": { path: "dvadashamsha-calculator", exportName: "DvadashamshaCalculator" },
  "gaja-kesari-detector": { path: "gaja-kesari-detector", exportName: "GajaKesariDetector" },
  "graha-drishti-wheel": { path: "graha-drishti-wheel", exportName: "GrahaDrishtiWheel" },
  "khavedamsha-akshavedamsha-calculator": { path: "khavedamsha-akshavedamsha-calculator", exportName: "KhavedamshaAkshavedamshaCalculator" },
  "marriage-varga-workflow": { path: "marriage-varga-workflow", exportName: "MarriageVargaWorkflow" },
  "seventh-house-marriage-profile-workbench": { path: "seventh-house-marriage-profile-workbench", exportName: "SeventhHouseMarriageProfileWorkbench" },
  "seventh-lord-placement-reader": { path: "seventh-lord-placement-reader", exportName: "SeventhLordPlacementReader" },
  "seventh-aspect-net-workbench": { path: "seventh-aspect-net-workbench", exportName: "SeventhAspectNetWorkbench" },
  "karaka-pollution-seventh-workbench": { path: "karaka-pollution-seventh-workbench", exportName: "KarakaPollutionSeventhWorkbench" },
  "d9-marriage-refinement-workbench": { path: "d9-marriage-refinement-workbench", exportName: "D9MarriageRefinementWorkbench" },
  "d9-lagna-seventh-reader": { path: "d9-lagna-seventh-reader", exportName: "D9LagnaSeventhReader" },
  "d9-venus-karaka-workbench": { path: "d9-venus-karaka-workbench", exportName: "D9VenusKarakaWorkbench" },
  "vargottama-marriage-confirmation-workbench": { path: "vargottama-marriage-confirmation-workbench", exportName: "VargottamaMarriageConfirmationWorkbench" },
  "d9-marriage-worked-example-lab": { path: "d9-marriage-worked-example-lab", exportName: "D9MarriageWorkedExampleLab" },
  "venus-marriage-karaka-prediction-workbench": { path: "venus-marriage-karaka-prediction-workbench", exportName: "VenusMarriageKarakaPredictionWorkbench" },
  "venus-dignity-strength-marriage-console": { path: "venus-dignity-strength-marriage-console", exportName: "VenusDignityStrengthMarriageConsole" },
  "venus-company-quality-workbench": { path: "venus-company-quality-workbench", exportName: "VenusCompanyQualityWorkbench" },
  "venus-analysis-marriage-case-lab": { path: "venus-analysis-marriage-case-lab", exportName: "VenusAnalysisMarriageCaseLab" },
  "upapada-marriage-arudha-workbench": { path: "upapada-marriage-arudha-workbench", exportName: "UpapadaMarriageArudhaWorkbench" },
  "ul-placement-lord-sustenance-workbench": { path: "ul-placement-lord-sustenance-workbench", exportName: "UlPlacementLordSustenanceWorkbench" },
  "darakaraka-spouse-register-workbench": { path: "darakaraka-spouse-register-workbench", exportName: "DarakarakaSpouseRegisterWorkbench" },
  "jaimini-marriage-case-synthesis-lab": { path: "jaimini-marriage-case-synthesis-lab", exportName: "JaiminiMarriageCaseSynthesisLab" },
  "saptamsha-calculator": { path: "saptamsha-calculator", exportName: "SaptamshaCalculator" },
  "saptavimshamsha-calculator": { path: "saptavimshamsha-calculator", exportName: "SaptavimshamshaCalculator" },
  "shodashamsha-calculator": { path: "shodashamsha-calculator", exportName: "ShodashamshaCalculator" },
  "spiritual-trio-comparator": { path: "spiritual-trio-comparator", exportName: "SpiritualTrioComparator" },
  "sub-lord-calculator": { path: "sub-lord-calculator", exportName: "SubLordCalculator" },
  "substrate-ethics-checklist": { path: "substrate-ethics-checklist", exportName: "SubstrateEthicsChecklist" },
  "vimshamsha-calculator": { path: "vimshamsha-calculator", exportName: "VimshamshaCalculator" },
  "d20-vimshamsha-construction-lab": { path: "d20-vimshamsha-construction-lab", exportName: "D20VimshamshaConstructionLab" },
  "d20-lagna-spiritual-houses-lab": { path: "d20-lagna-spiritual-houses-lab", exportName: "D20LagnaSpiritualHousesLab" },
  "d20-spiritual-karakas-overlay-lab": { path: "d20-spiritual-karakas-overlay-lab", exportName: "D20SpiritualKarakasOverlayLab" },
  "d20-spiritual-reading-synthesis-lab": { path: "d20-spiritual-reading-synthesis-lab", exportName: "D20SpiritualReadingSynthesisLab" },
  "ashtakavarga-intro": { path: "ashtakavarga-intro", exportName: "AshtakavargaIntro" },
  "ashtakavarga-contributors": { path: "ashtakavarga-contributors", exportName: "AshtakavargaContributors" },
  "contribution-table-demo": { path: "contribution-table-demo", exportName: "ContributionTableDemo" },
  "lagna-contributor-note": { path: "lagna-contributor-note", exportName: "LagnaContributorNote" },
  "bhinna-builder": { path: "bhinna-builder", exportName: "BhinnaBuilder" },
  "bhinna-total-checker": { path: "bhinna-total-checker", exportName: "BhinnaTotalChecker" },
  "bhinna-interpreter": { path: "bhinna-interpreter", exportName: "BhinnaInterpreter" },
  "mars-bhinna-walkthrough": { path: "mars-bhinna-walkthrough", exportName: "MarsBhinnaWalkthrough" },
  "sav-builder": { path: "sav-builder", exportName: "SavBuilder" },
  "sav-checksum": { path: "sav-checksum", exportName: "SavChecksum" },
  "sav-interpreter": { path: "sav-interpreter", exportName: "SavInterpreter" },
  "trikona-reducer": { path: "trikona-reducer", exportName: "TrikonaReducer" },
  "ekadhipatya-reducer": { path: "ekadhipatya-reducer", exportName: "EkadhipatyaReducer" },
  "reduction-order-demo": { path: "reduction-order-demo", exportName: "ReductionOrderDemo" },
  "full-reduction-walkthrough": { path: "full-reduction-walkthrough", exportName: "FullReductionWalkthrough" },
  "yoga-sav-auditor": { path: "yoga-sav-auditor", exportName: "YogaSavAuditor" },
  "transit-bav-modulator": { path: "transit-bav-modulator", exportName: "TransitBavModulator" },
  "ashtakavarga-stream-map": { path: "ashtakavarga-stream-map", exportName: "AshtakavargaStreamMap" },
  "karma-framework-map": { path: "karma-framework-map", exportName: "KarmaFrameworkMap" },
  "prarabdha-illustration": { path: "prarabdha-illustration", exportName: "PrarabdhaIllustration" },
  "mitigation-vs-cure": { path: "mitigation-vs-cure", exportName: "MitigationVsCure" },
  "remedy-authority-map": { path: "remedy-authority-map", exportName: "RemedyAuthorityMap" },
  "mantra-theory-explainer": { path: "mantra-theory-explainer", exportName: "MantraTheoryExplainer" },
  "mantra-traditions-map": { path: "mantra-traditions-map", exportName: "MantraTraditionsMap" },
  "foundational-mantra-player": { path: "foundational-mantra-player", exportName: "FoundationalMantraPlayer" },
  "mantra-safety-checklist": { path: "mantra-safety-checklist", exportName: "MantraSafetyChecklist" },
  "graha-yantra-gallery": { path: "graha-yantra-gallery", exportName: "GrahaYantraGallery" },
  "tantra-context-note": { path: "tantra-context-note", exportName: "TantraContextNote" },
  "yantra-anatomy": { path: "yantra-anatomy", exportName: "YantraAnatomy" },
  "navaratna-table": { path: "navaratna-table", exportName: "NavaratnaTable" },
  "uparatna-table": { path: "uparatna-table", exportName: "UparatnaTable" },
  "gemstone-safety-checklist": { path: "gemstone-safety-checklist", exportName: "GemstoneSafetyChecklist" },
  "protective-discipline-checklist": { path: "protective-discipline-checklist", exportName: "ProtectiveDisciplineChecklist" },
  "graha-dana-table": { path: "graha-dana-table", exportName: "GrahaDanaTable" },
  "upavasa-guide": { path: "upavasa-guide", exportName: "UpavasaGuide" },
  "puja-vrata-guide": { path: "puja-vrata-guide", exportName: "PujaVrataGuide" },
  "cross-cultural-care-guide": { path: "cross-cultural-care-guide", exportName: "CrossCulturalCareGuide" },
  "remedy-matching-explorer": { path: "remedy-matching-explorer", exportName: "RemedyMatchingExplorer" },
  "lal-kitab-upaya-intro": { path: "lal-kitab-upaya-intro", exportName: "LalKitabUpayaIntro" },
  "restraint-doctrine-card": { path: "restraint-doctrine-card", exportName: "RestraintDoctrineCard" },
  "kp-lineage-timeline": { path: "kp-lineage-timeline", exportName: "KPLineageTimeline" },
  "kp-reader-series-explorer": { path: "kp-reader-series-explorer", exportName: "KPReaderSeriesExplorer" },
  "kp-precision-resolution-comparator": { path: "kp-precision-resolution-comparator", exportName: "KPPrecisionResolutionComparator" },
  "kp-cusp-calculator": { path: "kp-cusp-calculator", exportName: "KpCuspCalculator" },
  "kp-vs-parashari-cusp-comparator": { path: "kp-vs-parashari-cusp-comparator", exportName: "KpVsParashariCuspComparator" },
  "kp-cusp-verifier": { path: "kp-cusp-verifier", exportName: "KpCuspVerifier" },
  "kp-tenth-cuspal-doctrine-workbench": { path: "kp-tenth-cuspal-doctrine-workbench", exportName: "KpTenthCuspalDoctrineWorkbench" },
  "kp-seventh-csl-marriage-promise-workbench": { path: "kp-seventh-csl-marriage-promise-workbench", exportName: "KpSeventhCslMarriagePromiseWorkbench" },
  "kp-seventh-significator-delivery-workbench": { path: "kp-seventh-significator-delivery-workbench", exportName: "KpSeventhSignificatorDeliveryWorkbench" },
  "kp-tenth-significator-hierarchy-workbench": { path: "kp-tenth-significator-hierarchy-workbench", exportName: "KpTenthSignificatorHierarchyWorkbench" },

  "249-sub-explorer": { path: "249-sub-explorer", exportName: "Kp249SubExplorer" },
  "sub-sub-recursion-explorer": { path: "sub-sub-recursion-explorer", exportName: "SubSubRecursionExplorer" },
  "sub-lord-fluency-trainer": { path: "sub-lord-fluency-trainer", exportName: "SubLordFluencyTrainer" },
  "cuspal-sub-lord-finder": { path: "cuspal-sub-lord-finder", exportName: "CuspalSubLordFinder" },
  "cuspal-sub-lord-visualizer": { path: "cuspal-sub-lord-visualizer", exportName: "CuspalSubLordVisualizer" },
  "planet-sub-lord-modulator": { path: "planet-sub-lord-modulator", exportName: "PlanetSubLordModulator" },
  "disposition-rules-workbench": { path: "disposition-rules-workbench", exportName: "DispositionRulesWorkbench" },
  "ruling-planets-role-explorer": { path: "ruling-planets-role-explorer", exportName: "RulingPlanetsRoleExplorer" },
  "ruling-planets-calculator": { path: "ruling-planets-calculator", exportName: "RulingPlanetsCalculator" },
  "ruling-planets-confirmation-workbench": { path: "ruling-planets-confirmation-workbench", exportName: "RulingPlanetsConfirmationWorkbench" },
  "kp-career-ruling-planets-timing-workbench": { path: "kp-career-ruling-planets-timing-workbench", exportName: "KpCareerRulingPlanetsTimingWorkbench" },
  "kp-marriage-significator-dasha-window": { path: "kp-marriage-significator-dasha-window", exportName: "KpMarriageSignificatorDashaWindow" },
  "kp-marriage-question-verdict-lab": { path: "kp-marriage-question-verdict-lab", exportName: "KpMarriageQuestionVerdictLab" },
  "kp-career-question-verdict-workbench": { path: "kp-career-question-verdict-workbench", exportName: "KpCareerQuestionVerdictWorkbench" },
  "ashta-kuta-framework-workbench": { path: "ashta-kuta-framework-workbench", exportName: "AshtaKutaFrameworkWorkbench" },
  "ashta-kuta-score-interpretation-workbench": { path: "ashta-kuta-score-interpretation-workbench", exportName: "AshtaKutaScoreInterpretationWorkbench" },
  "manglik-full-cancellation-workbench": { path: "manglik-full-cancellation-workbench", exportName: "ManglikFullCancellationWorkbench" },
  "marriage-tajika-lal-kitab-overlay-workbench": { path: "marriage-tajika-lal-kitab-overlay-workbench", exportName: "MarriageTajikaLalKitabOverlayWorkbench" },
  "marriage-dasha-timing-framework-workbench": { path: "marriage-dasha-timing-framework-workbench", exportName: "MarriageDashaTimingFrameworkWorkbench" },
  "marriage-synthesis-overview-map": { path: "marriage-synthesis-overview-map", exportName: "MarriageSynthesisOverviewMap" },
  "when-will-i-marry-synthesis-lab": { path: "when-will-i-marry-synthesis-lab", exportName: "WhenWillIMarrySynthesisLab" },
  "proposal-evaluation-synthesis-lab": { path: "proposal-evaluation-synthesis-lab", exportName: "ProposalEvaluationSynthesisLab" },
  "marriage-scope-competence-router": { path: "marriage-scope-competence-router", exportName: "MarriageScopeCompetenceRouter" },
  "first-house-vitality-physique-workbench": { path: "first-house-vitality-physique-workbench", exportName: "FirstHouseVitalityPhysiqueWorkbench" },
  "sixth-house-disease-recovery-workbench": { path: "sixth-house-disease-recovery-workbench", exportName: "SixthHouseDiseaseRecoveryWorkbench" },
  "fourth-house-property-workbench": { path: "fourth-house-property-workbench", exportName: "FourthHousePropertyWorkbench" },
  "fourth-lord-property-permutation-lab": { path: "fourth-lord-property-permutation-lab", exportName: "FourthLordPropertyPermutationLab" },
  "mars-property-karaka-depth-lab": { path: "mars-property-karaka-depth-lab", exportName: "MarsPropertyKarakaDepthLab" },
  "secondary-property-indicators-synthesis-lab": { path: "secondary-property-indicators-synthesis-lab", exportName: "SecondaryPropertyIndicatorsSynthesisLab" },
  "significator-hierarchy-explorer": { path: "significator-hierarchy-explorer", exportName: "SignificatorHierarchyExplorer" },
  "first-order-significator-visualizer": { path: "first-order-significator-visualizer", exportName: "FirstOrderSignificatorVisualizer" },
  "second-order-significator-workbench": { path: "second-order-significator-workbench", exportName: "SecondOrderSignificatorWorkbench" },
  "significator-chain-builder": { path: "significator-chain-builder", exportName: "SignificatorChainBuilder" },
  "kp-horary-number-selector": { path: "kp-horary-number-selector", exportName: "KpHoraryNumberSelector" },
  "kp-horary-chart-caster": { path: "kp-horary-chart-caster", exportName: "KpHoraryChartCaster" },
  "kp-horary-cuspal-verdict": { path: "kp-horary-cuspal-verdict", exportName: "KpHoraryCuspalVerdict" },
  "kp-horary-marriage-workbench": { path: "kp-horary-marriage-workbench", exportName: "KpHoraryMarriageWorkbench" },
  "kp-horary-job-workbench": { path: "kp-horary-job-workbench", exportName: "KpHoraryJobWorkbench" },
  "kp-horary-stream-comparator": { path: "kp-horary-stream-comparator", exportName: "KpHoraryStreamComparator" },
  "kp-parashari-side-by-side": { path: "kp-parashari-side-by-side", exportName: "KpParashariSideBySide" },
  "kp-parashari-convergences": { path: "kp-parashari-convergences", exportName: "KpParashariConvergences" },
  "kp-parashari-divergences": { path: "kp-parashari-divergences", exportName: "KpParashariDivergences" },
  "kp-cross-stream-router": { path: "kp-cross-stream-router", exportName: "KpCrossStreamRouter" },
  "kp-modified-vimshottari-explorer": { path: "kp-modified-vimshottari-explorer", exportName: "KpModifiedVimshottariExplorer" },
  "kp-synthesis-capstone": { path: "kp-synthesis-capstone", exportName: "KpSynthesisCapstone" },
  "tajika-origins-timeline": { path: "tajika-origins-timeline", exportName: "TajikaOriginsTimeline" },
  "tajika-neelakanthi-structure": { path: "tajika-neelakanthi-structure", exportName: "TajikaNeelakanthiStructure" },
  "tajika-texts-catalogue": { path: "tajika-texts-catalogue", exportName: "TajikaTextsCatalogue" },
  "tajika-comparative-matrix": { path: "tajika-comparative-matrix", exportName: "TajikaComparativeMatrix" },
  "tajika-ithasala-explorer": { path: "tajika-ithasala-explorer", exportName: "TajikaIthasalaExplorer" },
  "tajika-three-yoga-comparator": { path: "tajika-three-yoga-comparator", exportName: "TajikaThreeYogaComparator" },
  "tajika-twelve-yogas-surveyor": { path: "tajika-twelve-yogas-surveyor", exportName: "TajikaTwelveYogasSurveyor" },
  "tajika-yogas-application-wizard": { path: "tajika-yogas-application-wizard", exportName: "TajikaYogasApplicationWizard" },
  "tajika-saham-concept-explorer": { path: "tajika-saham-concept-explorer", exportName: "TajikaSahamConceptExplorer" },
  "tajika-auspicious-sahams-comparator": { path: "tajika-auspicious-sahams-comparator", exportName: "TajikaAuspiciousSahamsComparator" },
  "tajika-life-event-sahams-surveyor": { path: "tajika-life-event-sahams-surveyor", exportName: "TajikaLifeEventSahamsSurveyor" },
  "tajika-sahams-application-wizard": { path: "tajika-sahams-application-wizard", exportName: "TajikaSahamsApplicationWizard" },
  "tajika-muntha-concept-explorer": { path: "tajika-muntha-concept-explorer", exportName: "TajikaMunthaConceptExplorer" },
  "tajika-varshesha-selector": { path: "tajika-varshesha-selector", exportName: "TajikaVarsheshaSelector" },
  "tajika-varshaphala-caster": { path: "tajika-varshaphala-caster", exportName: "TajikaVarshaphalaCaster" },
  "tajika-varshaphala-synthesizer": { path: "tajika-varshaphala-synthesizer", exportName: "TajikaVarshaphalaSynthesizer" },
  "tajika-prashna-concept-explorer": { path: "tajika-prashna-concept-explorer", exportName: "TajikaPrashnaConceptExplorer" },
  "tajika-prashna-judgment-methodology": { path: "tajika-prashna-judgment-methodology", exportName: "TajikaPrashnaJudgmentMethodology" },
  "tajika-vs-kp-horary-comparator": { path: "tajika-vs-kp-horary-comparator", exportName: "TajikaVsKpHoraryComparator" },
  "tajika-cross-stream-synthesis": { path: "tajika-cross-stream-synthesis", exportName: "TajikaCrossStreamSynthesis" },
  "tajika-honest-handling": { path: "tajika-honest-handling", exportName: "TajikaHonestHandling" },
  "m19-closure": { path: "m19-closure", exportName: "M19Closure" },
  "evidentiary-layers": { path: "evidentiary-layers", exportName: "EvidentiaryLayers" },
  "manuscript-material-map": { path: "manuscript-material-map", exportName: "ManuscriptMaterialMap" },
  "school-comparator": { path: "school-comparator", exportName: "SchoolComparator" },
  "stream-position-map": { path: "stream-position-map", exportName: "StreamPositionMap" },
  "bhrigu-flow": { path: "bhrigu-flow", exportName: "BhriguFlow" },
  "agastya-flow": { path: "agastya-flow", exportName: "AgastyaFlow" },
  "sublineage-map": { path: "sublineage-map", exportName: "SublineageMap" },
  "grantha-accessibility-map": { path: "grantha-accessibility-map", exportName: "GranthaAccessibilityMap" },
  "matching-protocol-flow": { path: "matching-protocol-flow", exportName: "MatchingProtocolFlow" },
  "session-flow": { path: "session-flow", exportName: "SessionFlow" },
  "kanda-map": { path: "kanda-map", exportName: "KandaMap" },
  "shloka-decoder": { path: "shloka-decoder", exportName: "ShlokaDecoder" },
  "reader-due-diligence": { path: "reader-due-diligence", exportName: "ReaderDueDiligence" },
  "nadi-verification-sandbox": { path: "nadi-verification-sandbox", exportName: "NadiVerificationSandbox" },
  "nadi-commercial-explorer": { path: "nadi-commercial-explorer", exportName: "NadiCommercialExplorer" },
  "nadi-decision-framework": { path: "nadi-decision-framework", exportName: "NadiDecisionFramework" },
  "nadi-honest-handling-instance": { path: "nadi-honest-handling-instance", exportName: "NadiHonestHandlingInstance" },
  "vedanga-jyotisha-yuga-visualizer": { path: "vedanga-jyotisha-yuga-visualizer", exportName: "VedangaJyotishaYugaVisualizer" },
  "classical-canon-stratigraphy": { path: "classical-canon-stratigraphy", exportName: "ClassicalCanonStratigraphy" },
  "tajika-loanword-translator": { path: "tajika-loanword-translator", exportName: "TajikaLoanwordTranslator" },
  "modern-stream-architects": { path: "modern-stream-architects", exportName: "ModernStreamArchitects" },
  "do-no-harm-ahimsa": { path: "do-no-harm-ahimsa", exportName: "DoNoHarmAhimsa" },
  "truth-with-compassion": { path: "truth-with-compassion", exportName: "TruthWithCompassion" },
  "confidentiality": { path: "confidentiality", exportName: "ConfidentialityAuditor" },
  "competence-boundaries": { path: "competence-boundaries", exportName: "CompetenceBoundaries" },
  "empowerment-not-dependency": { path: "empowerment-not-dependency", exportName: "EmpowermentNotDependency" },
  "reasonable-fees": { path: "reasonable-fees", exportName: "ReasonableFees" },
  "session-protocols": { path: "session-protocols", exportName: "SessionProtocols" },
  "follow-up-boundaries": { path: "follow-up-boundaries", exportName: "FollowUpBoundaries" },
  "post-tier-1-reading-list": { path: "post-tier-1-reading-list", exportName: "PostTier1ReadingList" },
  "community-participation": { path: "community-participation", exportName: "CommunityParticipation" },
  "self-chart-tracking": { path: "self-chart-tracking", exportName: "SelfChartTracking" },
  "tier-2-preview": { path: "tier-2-preview", exportName: "Tier2Preview" },
  "24-module-synthesis": { path: "24-module-synthesis", exportName: "Module24SynthesisDojo" },
  "practitioner-pledge": { path: "practitioner-pledge", exportName: "PractitionerPledgeSimulator" },
  "curriculum-completion": { path: "curriculum-completion", exportName: "CurriculumCompletionLedger" },
  "path-forward": { path: "path-forward", exportName: "PathForwardRoadmap" },
  "lagna-suddhi-evaluator": { path: "lagna-suddhi-evaluator", exportName: "LagnaSuddhiEvaluator" },
  "four-pillar-integrator": { path: "four-pillar-integrator", exportName: "FourPillarIntegrator" },
  "tajika-dhana-saham-overlay": { path: "tajika-dhana-saham-overlay", exportName: "TajikaDhanaSahamOverlay" },
  "overall-wealth-promise-synthesis": { path: "overall-wealth-promise-synthesis", exportName: "OverallWealthPromiseSynthesis" },
  "investment-decision-synthesis": { path: "investment-decision-synthesis", exportName: "InvestmentDecisionSynthesis" },
  "ethical-scope-routing-dashboard": { path: "ethical-scope-routing-dashboard", exportName: "EthicalScopeRoutingDashboard" },
};

