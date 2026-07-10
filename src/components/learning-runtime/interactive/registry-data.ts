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
  // Lesson 23.1.3 interactive: Muhurta Text Corpus Navigator -- classical
  // source layers, attribution discipline, and reading sequence.
  // Lesson 23.1.4 interactive: Muhurta Comparative Position Explorer --
  // stream-variant inspector, shared-principles reference, sva-dharma framework.
  // Lesson 23.2.1 interactive: Tithi Classification Explorer --
  // five-fold matcher, 30-tithi wheel, scenario screener, integration workflow.
  // Lesson 23.2.2 interactive: Vara Lord Effects Explorer --
  // weekday-event matcher, lord reference cards, scenario screener, integration workflow.
  // Lesson 23.2.3 interactive: Nakshatras Categorized Explorer --
  // category-event matcher, category reference cards, 27-nakshatra map, scenario screener, integration workflow.
  // Lesson 3.1.4's Â§7 flagship: NandÄ-BhadrÄ-JayÄ-RiktÄ-PÅ«rá¹‡Ä Classifier â€”
  // quality-event matcher with contextual-quality discipline override visualization.
  // Lesson 3.1.5's Â§7 flagship: AmÄnta-PÅ«rá¹‡imÄnta Converter â€” paká¹£a-month converter,
  // festival cross-reference cards, and regional identifier.
  // Lesson 23.1.1 interactive: Muhurta Concept Scope -- 48-minute
  // time-unit grid and discipline-scope classifier.
  // Lesson 23.6.3 interactive: M23 Closure -- cumulative module synthesis
  // with chapter wheel, hook timeline, self-assessment, and ongoing-development.
  // Lesson 23.6.2 interactive: Muhurta Decision Framework -- stakes-calibrated
  // engagement with decision-tree, stakes gauge, case files, and method matrix.
  // Lesson 23.6.1 interactive: Muhurta Honest Handling -- cumulative
  // honest-handling synthesis across M23: rarity dial, case files,
  // daivajna wheel, instance map, and common-mistake gallery.
  // Lesson 23.5.1 interactive: Panchaka Cancellation -- 27-nakshatra wheel,
  // pañca-niṣiddha-karma case files, distinction drill, and mitigation panel.
  // Lesson 23.5.2 interactive: Rāhu-Kāla + Yamagaṇḍa + Gulika-Kāla explorer —
  // 8-portion daylight wheel, 24h timeline, case-file verdict drill, 7-day
  // mnemonic pattern table, and seasonal-duration variance explorer.
  // Lesson 3.1.6's Â§7 flagship: Tithi-MuhÅ«rta Introductory Judgment â€” scenario-based
  // muhÅ«rta quality trainer with multi-element synthesis preview.
  // Lesson 3.2.1's Â§4 explorer: VÄra-Graha Wheel â€” circular 7-segment visual
  // explorer with click-for-attributes, element-filter highlight, and
  // planetary-type filter system.
  // Lesson 3.2.2's Â§7 flagship: Chaldean Planetary HorÄ Explorer â€” two-panel
  // composition (Chaldean order strip + horÄ sequence generator) with
  // 24 mod 7 = 3 principle explanation.
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
  "varga-reference-table": { path: "varga-reference-table", exportName: "VargaReferenceTable" },
  "varga-calculator": { path: "varga-calculator", exportName: "VargaCalculator" },
  "birth-time-quality-checker": { path: "birth-time-quality-checker", exportName: "BirthTimeQualityChecker" },
  "vargottama-scanner": { path: "vargottama-scanner", exportName: "VargottamaScanner" },
  "d1-d9-divergence-reader": { path: "d1-d9-divergence-reader", exportName: "D1D9DivergenceReader" },
  "navamsha-calculator": { path: "navamsha-calculator", exportName: "NavamshaCalculator" },
  "navamsha-reader": { path: "navamsha-reader", exportName: "NavamshaReader" },

  // Lesson 5.1.2's Â§7 interactive: Dignity Wheel â€” clickable 12-rashi
  // dignity map with degree cues, friendship overlay, and Sun-Moon comparison.
  // Lesson 11.1.2 interactive: Sixth-House Dusthāna–Upachaya Paradox —
  // dual-classification wheel, Mars vs Saturn worked-example comparison,
  // early-loss scenario, and discipline checks on house-specific limits.
  // Lesson 11.1.3 interactive: Sixth-Lord Permutations for Litigation —
  // clickable 12-house wheel placing the 6th lord, five-family classification,
  // Chart L1 own-house anchor, and contrasting dusthāna/upachaya placements.
  // Lesson 11.1.4 interactive: Mars as Contest Kāraka Applied to Litigation —
  // Mars placement wheel, dignity selector, Chart L1 vs exalted-1st contrast,
  // forward-pointer to Chapter 2, and discipline checks.
  // Lesson 11.2.1 interactive: Saturn as Delay, Structure, Persistence —
  // signification mapper, dignity quality selector, process gauge, and
  // Chart L1 own-sign vs debilitated contrast.
  // Lesson 11.2.2 interactive: Mars-Saturn Dynamic Explorer —
  // aspect-geometry vs natural-friendship layer toggle, asymmetric grid,
  // spot-the-error scenario, and discipline checks.
  // Lesson 11.2.3 interactive: Mars-Saturn Relationship Distinguisher —
  // conjunction / mutual aspect / mutual reception mode toggle, SVG diagrams,
  // Chart L1 verification by elimination, and contrasting conjunction case.
  // Lesson 11.2.4 interactive: Mars-Saturn Litigation Synthesis —
  // six-finding assembly, aspect-web SVG, client-facing template builder,
  // scope-limit trainer, and discipline checks.
  // Lesson 11.3.1 interactive: KP Litigation Cusp Tool —
  // Chart L1 6th-cusp data, disposition-rule step-through, sub-lord
  // substitution, and classical-vs-KP divergence display.
  // Lesson 12.1.1 interactive: Moksa Trikona Explorer — isolates the 4-8-12 trine,
  // compares all four purusartha trines, adds kendra/dusthana overlay, and includes
  // an uneven-trine builder with disposition-not-destiny discipline.
  // Lesson 12.1.2 interactive: Fourth House Spiritual Foundation — 4th house as
  // moksa foundation stage, Moon karaka picker, independent house/lord and Moon
  // strength builder, Chart S1 / Example 2 presets, and common-mistake discipline.
  // Lesson 7.4.4's §7 flagship: Maraka Synthesis Workbench — synthesise
  // Bālāriṣṭa, longevity, and maraka findings for one chart and practise
  // the universal, undated, proactive client-facing register.
  // Lesson 7.5.1's §7 explorer: Jaimini Rudra-Maheśvara Explorer — contrast
  // Parāśarī house-lordship with Jaimini kāraka-based identification, train
  // AK selection, inspect Rudra and Maheśvara rules, and present documented
  // source variance honestly.
  // Lesson 7.5.2's §7 workbench: Rudra-Maheśvara Workbench — apply the rules
  // to Chart H1, compare both Maheśvara procedures, and practise honest
  // confidence calibration plus the Jaimini-Parāśarī convergence.
  // Lesson 7.5.3's §7 explorer: KP Longevity Doctrine Explorer — interactively
  // teach sub-lord as final arbiter, four-level significator hierarchy, KP's
  // 2nd/7th/12th maraka list, Bhādhaka-by-lagna-type, and honest data-scope.
  // Lesson 5.1.4's Â§7 interactive: Friendship Matrix â€” directed graha
  // relationship grid with mirror-cell comparison and Sun-Moon polarity axes.
  // Lesson 5.1.5's Â§7 interactive: Pakshabala Slider â€” tithi scrubber with
  // inverse Sun/Moon virupa bars and a dignity-combination preview.
  // Lesson 5.2.2's Â§7 interactive: Karaka Router â€” question-driven Mars
  // register selector with house-side confirmation and tie-breaker feedback.
  // Lesson 5.2.3's Â§7 interactive: Friendship Dignity Grid â€” Mars across
  // the 12 signs with sign-lord relation, degree control, and dignity override.
  "vyapara-arambh-muhurta-evaluator": { path: "vyapara-arambh-muhurta-evaluator", exportName: "VyaparaArambhMuhurtaEvaluator" },
  "kp-sub-calculator": { path: "kp-sub-calculator", exportName: "KpSubCalculator" },
  // Module 10 Chapter 1 â€” VimÅ›ottarÄ« DaÅ›Ä Cycle
  // Lesson 10.1.1's Â§7 interactive: DaÅ›Ä Timeline â€” 120-year proportional wheel
  // with 9 clickable lord segments, starting-lord rotation, lifespan overlay,
  // and linear timeline bar.
  // Lesson 10.1.3's Â§7 interactive: DaÅ›Ä Selector â€” Universal Default vs Conditional Simulator
  // Lesson 10.2.1's Â§7 interactive: DaÅ›Ä Balance Calculator â€” four-step
  // pedagogical calculator with Moon longitude input, naká¹£atra identification,
  // fraction-traversed computation, and balance result with boundary warnings
  // and subsequent mahÄdaÅ›Ä preview.
  // Lesson 10.2.2's Â§7 interactive: DaÅ›Ä Balance Mistake Explorer â€”
  // toggle switches for all 6 common mistakes with side-by-side correct/corrupted
  // comparison and Â±1-day tolerance indicator.
  // Lesson 10.2.3's Â§7 interactive: DaÅ›Ä Balance Cross-Check â€” hand-computed
  // balance input vs engine output with Â±1-day confirmation band and
  // severity-based diagnosis hints (match/minor/major/critical).
  // Lesson 10.2.4's Â§7 interactive: DaÅ›Ä Table Builder â€” constructs the full
  // birth-to-120 mahÄdaÅ›Ä table from a balance, with expandable bhukti
  // subdivisions using the proportion formula (MD Ã— lord) Ã· 120.
  // Lesson 10.4.1's Â§7 interactive: Bhukti-Yoga Matrix â€” MD-lord â†” AD-lord
  // naisargika friendship sets the baseline quality of a sub-period.
  // Includes dignity modulator demonstrating "modulator, not override."
  // Lesson 10.4.2's Â§7 interactive: KÄraka Overlay Reader â€” MD-lord's life-phase
  // quality overlaid with AD-lord's domain-flavour significations.
  // Detects multi-kÄraka clusters and provides same-AD-different-MD comparison.
  // Lesson 10.4.3's Â§7 interactive: Two-Yes Checker â€” counts independent
  // indicator families for a predictive question and flags reliable only
  // when â‰¥2 genuinely different lines of evidence agree.
  // Lesson 10.4.4's Â§7 interactive: Event Reading Workbench â€” runs the six-step
  // workflow end-to-end with functional lordship, bhukti-yoga, kÄraka overlay,
  // and the two-yes gate for any domain + ascendant + MD-AD pair.
  // Lesson 10.6.1's Â§7 interactive: Cara DaÅ›Ä Intro â€” side-by-side contrast of
  // VimÅ›ottarÄ« (planet-based, fixed) vs Cara (sign-based, variable) with
  // modality legend and cross-validation panel.
  // Lesson 10.6.2's Â§7 interactive: Sthira DaÅ›Ä Intro â€” awareness-level
  // reference table contrasting Cara and Sthira (both rÄÅ›i-based Jaimini,
  // different rules) with deferral note to Jaimini module (T1-17).
  // Lesson 10.6.3's Â§7 interactive: KÄlacakra Overview â€” awareness-level
  // pÄda-derived sign daÅ›Ä explorer with savya/apasavya direction rules,
  // 108-point naká¹£atra-pÄda grid, and complexity breakdown.
  // Lesson 10.6.4's Â§7 interactive: ParÄÅ›arÄ«-Jaimini Chooser â€” decision-tool
  // recommending daÅ›Ä(s) for any situation with VimÅ›ottarÄ« always anchored.
  // Includes cross-validation scenarios (convergence / divergence).
  // Lesson 10.7.5's Â§7 interactive: DaÅ›Ä Landscape Map â€” survey of ~14 systems
  // grouped by class, five-point discipline overlay, and honest-framing practice.
  // Closes Module 10.
  "gajakesari-simulator": { path: "gajakesari-simulator", exportName: "GajakesariSimulator" },
  // Lesson 13.4.1's Â§7 interactive: Cheá¹£á¹­Ä Bala Calculator â€” motional strength
  // explorer with eight cheá¹£á¹­Ä avasthÄs, epicycle diagram, Sun/Moon convention
  // panels, and virÅ«pa spectrum. Rich SVG diagrams illustrate retrograde mechanics.
  // Lesson 13.4.2's Â§7 interactive: Naisargika Bala Table â€” the seven fixed
  // natural-strength values with descending bar chart, fraction ladder, wheel
  // diagram, and baseline-stack visual. No engine needed (classical constants).
  // Lesson 13.4.3's Â§7 interactive: Naisargika Rationale â€” hierarchy ladder,
  // luminosity overlay, Venus-vs-Jupiter comparison, and baseline reminder.
  // Explains why the fixed order is not arbitrary.
  // Lesson 13.5.1's Â§7 interactive: Dá¹›k Bala Calculator â€” aspect net diagram,
  // signed number line, add/remove aspects, six-component overview. Teaches
  // the signed-net concept and that dá¹›k bala can be negative.
  // Lesson 13.5.2's Â§7 interactive: á¹¢aá¸bala Summation â€” waterfall stack,
  // threshold gauge, all-planets reference, and pass/fail comparison.
  // Teaches summing, converting to rÅ«pas, and comparing to minima.
  // Lesson 13.5.3's Â§7 interactive: á¹¢aá¸bala Scorecard â€” per-planet ratio + band
  // table, band spectrum, workflow diagram, and confidence-vs-virtue visual.
  // Closes Module 13 by turning totals into interpretive judgement.
  // Lesson 13.6.1's Â§7 interactive: BhÄva Bala Calculator â€” house selector,
  // three-component inputs, house diagram, and á¹£aá¸bala parallel comparison.
  // Lesson 13.6.2's Â§7 interactive: á¹¢aá¸balaâ€“BhÄva Bala Synthesis â€” domain
  // selector, strength toggles, four-cell matrix, and confidence dial.
  // Teaches integrative reading of planet + house strength.
  // Lesson 13.6.3's Â§7 interactive: Cross-Stream Strength Map â€” four stream
  // conceptions, parallel tracks, convergence/divergence, and paÃ±cavargÄ«ya
  // breakdown. Maps how each sampradÄya measures strength.
  // Lesson 13.6.4's Â§7 interactive: Strength-Quality Matrix â€” Module 13 capstone.
  // 2Ã—2 judgement matrix fusing á¹£aá¸bala (quantity) with dignity/aspect/yoga (quality).
  // Clickable SVG matrix + preset scenarios + amplifier diagram + discipline rules.
  // Lesson 13.3.3's Â§7 interactive: Paká¹£a-Yuddha Calculator â€” paká¹£abala (lunar-phase
  // strength split) + graha-yuddha (planetary war detection). Fortnight toggle,
  // planet status grid, proximity checker with SVG diagrams, and worked scenarios.
  // Lesson 13.3.4's Â§7 interactive: Dik-KÄla Summer â€” Chapter 3 capstone.
  // Dik bala slider + nine kÄla sub-component sliders + SVG sum diagram +
  // virÅ«paâ†’rÅ«pa conversion + worked presets (Sun 10th, Moon night, war penalty).
  // Lesson 14.4.1's Â§7 interactive: Laká¹£mÄ«-SarasvatÄ« Detector â€” checks both
  // deity-named special yogas. North Indian chart SVG + house/dignity selectors +
  // condition checker with preset scenarios (Laká¹£mÄ« full, SarasvatÄ« full, broken).
  // Lesson 14.4.2's Â§7 interactive: Akhanda SÄmrÄjya Checker â€” tests the
  // "unbroken sovereignty" yoga against selectable source definitions (standard
  // vs PhaladÄ«pikÄ). Sovereignty-stack SVG + mini-chart + source-variation discipline.
  // Lesson 14.4.3's Â§7 interactive: BuddhÄditya-Gaja-Kesari Detector â€” revisits
  // both common yogas with depth. Combustion orb slider + kendra-from-Moon
  // circular diagram + strength grading + trikoá¹‡a misread warning.
  // Lesson 14.4.4's Â§7 interactive: Special-Yoga Scan â€” Chapter 4 capstone.
  // Systematic 5-yoga checklist on a fixed Cancer-lagna worked chart.
  // Jupiter-dignity toggle demonstrates broken-condition cascade.
  // Lesson 14.5.1's Â§7 interactive: Neecha-Bhaá¹…ga Checker â€” cancellation of debilitation.
  // Planet selector + 5-condition checklist + rescue-chain SVG + honest debate.
  // Lesson 14.5.2's Â§7 interactive: Vipareeta Detector â€” three Vipareeta RÄja Yogas.
  // Lagna selector + dusthana-lord placements + dusthana-triangle SVG + refinements.
  // Lesson 14.5.3's Â§7 interactive: Vipareeta Rationale â€” spoiler-of-spoiler doctrine.
  // Scenario explorer + strength/timing controls + spoiler-mechanism SVG + honest limits.
  // Lesson 14.5.4's Â§7 interactive: Vipareeta-Neecha Scan â€” Chapter 5 capstone.
  // Fixed Aries chart + neecha-bhaá¹…ga check + Hará¹£a check + combined honest reading.
  // Lesson 14.6.1's Â§7 interactive: Manglik Detector â€” Kuja-Doá¹£a from lagna/Moon/Venus.
  // House-set variation (6-house vs 5-house) + severity grading + defearmongering.
  // Lesson 14.6.2's Â§7 interactive: Manglik Cancellation Checker â€” 15+ grouped conditions.
  // Mars sign/house + toggle checklist + cancellation gauge + weighted result.
  // Lesson 14.6.3's Â§7 interactive: KÄla Sarpa Detector â€” nodal-axis configuration check.
  // RÄhu + 7 planet controls + circular diagram + doctrinal debate + honest handling.
  // Lesson 14.6.4's Â§7 interactive: Pitá¹›-Doá¹£a Indicator â€” chart signatures + remedial framework.
  // Sun/Rahu/Saturn/9th-lord controls + signature gauge + remedy cards + honest limits.
  // Lesson 14.6.5's Â§7 interactive: Kemadruma + Sade Sati Recap â€” two doá¹£as in one surface.
  // Kemadruma (Moon + 2nd/12th + cancellations) + Sade Sati (Moon + Saturn transit + phases).
  // Lesson 14.6.6's Â§7 interactive: De-Fearmongering Protocol -- 8-step discipline walker.
  // Doá¹£a selector + step cards + reframe exercise + ethics connection. Closes Chapter 6.
  // Module 17 Chapter 3 argala explorer: reference-house selector + planet placement +
  // circular diagram with argala/virodha highlights + pair-by-pair net computation +
  // five-step workflow. Serves all four lessons in the argala chapter.
  // Lesson 17.3.1 interactive: Argala Concept Explorer -- bolt metaphor SVG,
  // reference-house explorer, mechanism discriminator (argala vs graha-dá¹›á¹£á¹­i vs rÄÅ›i-dá¹›á¹£á¹­i),
  // and what-argala-does/does-not-do checklist.
  // Lesson 17.3.2 interactive: Positive Argala 2/4/11 -- counting drill with circular diagram,
  // self-check challenges, strength visualiser, and common-trap spotter.
  // Lesson 17.3.3 interactive: VirodhÄrgala Counter-Intervention -- obstruction pair explorer,
  // net-effect calculator with +/- count controls, and scenario presets.
  // Lesson 17.4.1 interactive: Ä€rÅ«á¸ha PÄda Finder -- double-count computation,
  // 1st/7th exception detection, reality-vs-perception comparison, step-by-step walker.
  // Lesson 17.4.2 interactive: The Twelve Ä€rÅ«á¸ha PÄdas -- complete image-pÄda grid,
  // AL/UL map, Lagna-AL gap interpretation, and common mistakes panel.
  // Lesson 17.4.3 interactive: Ä€rÅ«á¸ha PÄda Calculator (Upapada mode) --
  // computes UL from the 12th, shows double-count steps, 2nd-from-UL, planet
  // placements, and triangulation reminders.
  // Lesson 17.4.4 interactive: Ä€rÅ«á¸ha PÄda Explorer -- computes all twelve
  // padas, inspects occupants per pada, compares image vs reality, and builds
  // focused readings (AL, AL+UL, AL+A2, AL+A10, AL+A11).
  // Lesson 17.4.5 interactive: Ä€rÅ«á¸ha Caveat Lab -- exception detector,
  // dual-lordship convention switcher for Scorpio/Aquarius, and tradition
  // disclosure statement generator.
  // Lesson 17.5.1 interactive: RÄÅ›i-Dá¹›á¹£á¹­i Visualizer -- click any sign to
  // see the three signs it aspects, with explore mode, drill mode, and
  // rÄÅ›i-dá¹›á¹£á¹­i vs graha-dá¹›á¹£á¹­i comparison.
  // Lesson 17.5.2 interactive: RÄÅ›i-Dá¹›á¹£á¹­i Mapper -- place planets on a chart,
  // select a target, see which signs aspect it, and carry occupants + lords
  // across to read influence and multi-sign convergence.
  // Lesson 17.5.3 interactive: AK-Drishti Synthesizer -- integrates cara-kÄrakas
  // with rÄÅ›i-dá¹›á¹£á¹­i. Select a kÄraka, place it in a sign, populate the chart,
  // and read the incoming sign-aspects with benefic/malefic classification
  // and automated synthesis reading. Includes the four static-reading framework.
  // Lesson 17.7.1 interactive: KÄrakÄá¹Å›a Lagna Locator -- identify the
  // Ä€tmakÄraka from within-sign degrees, select its navÄá¹Å›a (D9) sign, and
  // see that sign projected onto the rÄÅ›i (D1) wheel as a special lagna with
  // houses counted from the KÄrakÄá¹Å›a. Includes source-vs-target diagram.
  // Lesson 17.7.2 interactive: KÄrakÄá¹Å›a Reader -- the five-step soul-purpose
  // read. Walks through AK identification, D9 sign selection, KL placement,
  // occupant + rÄÅ›i-dá¹›á¹£á¹­i aspect reading, and key houses from KL with
  // automated synthesis. Presets for Leo and Scorpio KÄrakÄá¹Å›a examples.
  // Lesson 17.7.3 interactive: Iá¹£á¹­a-DevatÄ Finder -- select the KÄrakÄá¹Å›a,
  // place planets, and see the 12th-from-KL auto-computed with planet-to-deity
  // mapping, empty-house lord fallback, aspecting contributors, and ethical
  // framing (offer, respect, hold lightly).
  // Lesson 17.7.4 interactive: Jaimini Workflow Walkthrough -- six ordered steps
  // assembling every Jaimini tool into one end-to-end reading. Enforces workflow
  // discipline: static tools first (Steps 1-5), timing engine last (Step 6).
  // Includes question presets, running synthesis, timing-first failure demo,
  // and cara-daÅ›Ä / VimÅ›ottarÄ« cross-validation.
  // Lesson 17.7.5 interactive: Jaimini Module Closure Map -- seven-chapter arc
  // visualiser, pipeline tracer for four question types, Tier-1-vs-Tier-2
  // comparison, and three discipline cards. Click any chapter to expand its
  // consumes/produces detail; select a question to highlight which chapters
  // the pipeline uses.
  // --- Module 18: Lal Kitab ---
  "lal-kitab-shadow-triad": { path: "lal-kitab-shadow-triad", exportName: "LalKitabShadowTriad" },
  // Lesson 18.2.4 interactive: Teva vs Lagna Cross-Validator â€” side-by-side dual
  // charts (Teva fixed Aries + ParÄÅ›arÄ« lagna) with planet tracer and discipline
  // check scenarios testing no-conflation. Reinforces frame separation.
  // Lesson 18.3.1 interactive: Blind Planet Explorer â€” concept tab with andhÄ
  // metaphor and characteristics, blind-vs-combust comparison table + scenario
  // classifier, and 6-scenario recognition drill with cause-based reasoning.
  // Lesson 18.3.2 interactive: Sleeping Planet Explorer â€” concept tab with sutela
  // metaphor and three characteristics, three awakening-mechanism cards, blind/
  // sleeping/awake comparison table, and 6-scenario four-state recognition drill.
  // Lesson 18.3.3 interactive: Burning Planet Explorer â€” concept tab with jalit
  // metaphor and three characteristics, two cause cards, four-state comparison
  // table with remedy logic, and 6-scenario recognition drill.
  // Lesson 18.3.4 interactive: Planetary State Synthesizer â€” Chapter 3 capstone.
  // Awake-state concept with lamp metaphor, interactive four-state framework table
  // with remedy-goal mapping, elimination checklist, and 6-scenario capstone drill
  // with yes/no check previews.
  // Lesson 21.3.1 interactive: MÅ«lÄá¹…ka Calculator â€” birth-day-of-month (1-31)
  // input with strict-preservation vs flexibility convention toggle, step-by-step
  // computation, graha-aá¹…ka register + caveat display, 31-day reference table,
  // five-step discipline workflow, and four worked examples.
  // Lesson 21.3.2 interactive: BhÄgyÄá¹…ka Calculator â€” full birth-date input
  // (day/month/year) with strict-preservation vs flexibility convention toggle,
  // step-by-step digit-sum computation, graha-aá¹…ka register + caveat display,
  // combined MÅ«lÄá¹…ka-to-BhÄgyÄá¹…ka lifetime-arc reading, worked examples, and
  // five-step discipline workflow including destiny-determinism refusal layer.
  // Lesson 21.3.3 interactive: Name-Number (NÄmÄá¹…ka) Calculator â€” three-system
  // name computation (Chaldean / Pythagorean / Vedic-Chaldean hybrid) with
  // strict-preservation vs flexibility convention toggle, letter-by-letter
  // breakdown, graha-aá¹…ka register + caveat display, Pythagorean four-number
  // framework panel, letter-table reference, worked examples, and six-step
  // discipline workflow including name-change refusal layer.
  // Lesson 21.3.4 interactive: Personal Year Number Calculator â€” birth-date +
  // target-calendar-year computation with strict-preservation vs flexibility
  // convention toggle, step-by-step digit-sum breakdown, graha-aá¹…ka register +
  // caveat display, 9-year cycle visualisation, worked examples, and six-step
  // discipline workflow including year-as-determinant refusal layer.
  // Lesson 21.4.1 interactive: Name-Correction Rationale Evaluator â€” scenario-
  // based drill for categorising name-change rationales, identifying over-claim
  // layers, applying the convergent-independent-grounds operational test, and
  // reaching approve / partial / refuse verdicts. Includes six-category reference
  // and five-step rationale-evaluation workflow.
  // Lesson 21.4.2 interactive: Name-Correction Candidate Calculator â€” six-step
  // workflow tool that computes current + candidate Name-Numbers under the chosen
  // system and convention, evaluates graha-compatibility (MITRA/SHATRU/SAMA) with
  // MÅ«lÄá¹…ka / BhÄgyÄá¹…ka, tabulates candidates, and generates a discipline-compliant
  // confirmatory-not-deterministic presentation template.
  // Lesson 21.4.3 interactive: Name-Correction Caution Screener â€” scenario-based
  // drill that applies the four-test screen, identifies the six commercial-numerology
  // failure modes, surfaces the three real-cost categories, and practises reaching
  // proceed / preview / revise / refuse verdicts. Includes reference tabs for costs,
  // failure-mode catalogue, and the Chapter 4 integrated refusal-discipline workflow.
  // Lesson 21.4.4 interactive: Numerology Honest-Handling Inspector â€” scenario-based
  // drill that distinguishes the empirical-kernel from the over-claim layer, identifies
  // the eight over-claim framings, applies the five operational forms of do-no-harm,
  // and reaches proceed / revise / refuse / mixed verdicts. Includes reference tabs
  // for the three-layer holding, the five do-no-harm forms, and the Chapter 1-4
  // integration table.
  // Lesson 21.5.1 interactive: Numerology Compatibility Calculator â€” two-person
  // Mulanka / Bhagyanka / Name-number comparison using MITRA / SHATRU / SAMA
  // graha-friendship vectors with relationship-outcome over-claim refusal.
  // Lesson 21.5.2 interactive: Business Name Numerology Calculator â€” business-name
  // candidate computation with founder compatibility, industry-register preference,
  // and pre-launch versus post-launch rebrand discipline.
  // Lesson 21.5.3 interactive: Object Numerology Calculator â€” house / phone /
  // vehicle digit reduction, personal compatibility, limited-choice recognition,
  // and explicit 4/8 fear-induction refusal.
  // Lesson 21.6.1 interactive: Chart Numerology Integration Tool â€” three-number
  // to natal-graha cross-reference, four alignment configurations, and explicit
  // chart-numerology causation over-claim refusal.
  // Lesson 21.6.2 interactive: Numerology Decision Flow â€” apply / refuse /
  // defer gates, authorised consultation modes, and absent-grounds discipline.
  // Lesson 21.6.3 interactive: Discipline Statement Builder â€” six-chapter M21
  // synthesis, do-no-harm floor, and five-field practitioner statement worksheet.
  "confidence-tier-overlay-builder": { path: "confidence-tier-overlay-builder", exportName: "ConfidenceTierOverlayBuilder" },
  "divergence-pattern-ranker": { path: "divergence-pattern-ranker", exportName: "DivergencePatternRanker" },
  "dual-matrix-domain-comparison": { path: "dual-matrix-domain-comparison", exportName: "DualMatrixDomainComparison" },
  "conflict-resolution-sequence-walkthrough": { path: "conflict-resolution-sequence-walkthrough", exportName: "ConflictResolutionSequenceWalkthrough" },
  "synthesis-statement-composition-discipline": { path: "synthesis-statement-composition-discipline", exportName: "SynthesisStatementCompositionDiscipline" },
  // Lesson 7.5.4's §7 explorer: KP Longevity Chart H1 Synthesis — apply KP
  // doctrine to Chart H1 (Bhādhaka + verified Saturn sub-lord), then practise
  // the three-stream synthesis and ethical-framing trainer.
  // Lesson 7.6.1's §7 explorer: Kālapuruṣa Body-Map Explorer — interactive
  // body-part-to-house mapping with zodiac vs chart toggle and scope gate.
  // Lesson 7.6.2's §7 explorer: Graha-Disease Correspondence Explorer —
  // seven-graha correspondences, two-layer reinforcement, tridoṣa bridge, scope gate.
  // Lesson 7.6.3's §7 trainer: Contextualisation Discipline Trainer —
  // direction-of-inference, harm pathways, question classifier, response builder.
  // Lesson 7.6.4's §7 trainer: Contextualisation Worked-Example Trainer —
  // diagnosis-first gate, contextualisation chain, no-match honesty, statement practice.
  // Lesson 7.7.1's §7 explorer: Health Synthesis Overview Map —
  // seven-lesson roadmap, Chart H1 findings recap, question router, capability-to-restraint sequence.
  // Lesson 7.7.2's §7 workbench: Vitality-Trend Synthesis Workbench —
  // seven-layer synthesis, convergence/divergence diagram, response translator, mistake check.
  // Lesson 7.7.3's §7 trainer: Known-Illness Support Consultation Trainer —
  // scenario compass, response builder, silent confidence toggle, mistake check.
  // Lesson 7.7.4's §7 trainer: Death-Prediction Prohibition Trainer —
  // absolute rule barrier, five category scripts, wrong-vs-right comparisons, restraint verse.
  // Lesson 7.7.5's §7 tool: Medical-Routing Decision Tree —
  // interactive four-tier tree, tier reference, scenario classifier, sequence rule.
  // Lesson 22.1.1 interactive: Vastu Origins Explorer — historical stream,
  // five-domain spatial scope, classical corpus, and modern feasibility guards.
  // Lesson 22.1.2 interactive: Vastu Purusha Mandala Explorer â€” 9x9 / 8x8 /
  // 7x7 grid variants, Brahma-sthana, deity-zone rings, and apartment guards.
  // Lesson 22.1.3 interactive: Vastu Five Element Mapper â€” pancha-bhuta
  // direction zones, activity matching, conflicts, and cross-discipline guardrails.
  // Lesson 22.1.4 interactive: Vastu Text Corpus Navigator â€” source layers,
  // five-text corpus, reading sequence, and regional attribution discipline.
  // Lesson 22.2.1 interactive: Vastu Cardinal Direction Lords â€” Indra, Yama,
  // Varuna, Kubera, deity-quality judgments, and activity matching.
  // Lesson 22.2.2 interactive: Vastu Intercardinal Double Quality â€” Ishana,
  // Agni, Nirriti, Vayu, convergent deity-element matching, and fear guardrails.
  // Lesson 22.2.3 interactive: Vastu Room Direction Synthesizer â€” room-by-room
  // primary, secondary, mitigation, and prohibited placement workflow.
  // Lesson 22.3.1 interactive: Vastu Earth Water Axis -- NE/SW polar axis,
  // water and weight placement, elevation discipline, and mitigation cues.
  // Lesson 22.3.2 interactive: Vastu Fire Air Axis -- SE/NW compatible-flow
  // axis, kitchen discipline, ventilation path, and proportional mitigation.
  // Lesson 22.3.3 interactive: Vastu Brahmasthana Center -- central 3x3
  // Akasha discipline, centre-violation severity, and apartment mitigation.
  // Lesson 22.4.1 interactive: Vastu Plot Selection Evaluator -- bhu-pariksha
  // shape, extension/cut, road-facing, topography, and proportional verdict.
  // Lesson 22.4.2 interactive: Vastu Ground Slope Evaluator -- slope,
  // drainage, construction phase, vertical massing, and grading feasibility.
  // Lesson 22.4.3 interactive: Vastu House Shape Evaluator -- building form,
  // corner integrity, axis rotation, and modern-context mitigation.
  // Lesson 22.4.4 interactive: Vastu Extensions Cuts Evaluator -- extension
  // versus cut asymmetry, directional severity, size, and context handling.
  // Lesson 22.5.1 interactive: Vastu Remedy Framework -- severity-calibrated
  // architectural, symbolic, yantra/pyramid, and ritual remediation tiers.
  // Lesson 22.5.2 interactive: Vastu Apartment Office Planner -- unit-level
  // mandala placement for apartments, offices, retail, and commercial spaces.
  // Lesson 22.5.3 interactive: Vastu Mirror Remedy Planner -- wall direction,
  // room context, sensitive reflection targets, and honest modern attribution.
  // Lesson 22.6.1 interactive: Vastu Honest Handling Audit -- four-test screen
  // for empirical kernel, demolition prohibition, cost-benefit, and overclaim.
  // Lesson 22.6.2 interactive: Vastu Decision Framework -- when to flag,
  // defer, refuse, and sequence the four-tier remediation cascade.
  // Lesson 22.6.3 interactive: Vastu Chart Integration -- 4H,
  // residential karakas, property houses, and dik-pala-graha context.
  // Lesson 22.6.4 interactive: Vastu Module Closure -- six-chapter
  // synthesis, do-no-harm commitments, and practitioner statement builder.
  // Lesson 18.4.4 interactive: Lal Kitab Graha Clusters â€” Chapter 4 capstone.
  // Accordion clusters for Saturn / RÄhu / Ketu, 6-item quiz, and all-nine-graha
  // summary table with unifying concrete-object pattern.
  // --- merged: components built in the local reconciliation session (not on remote) ---
  // Tier 2 Module 3 Chapter 2 Lesson 1: D10 Deva-Asura Construction Lab —
  // clickable zodiac ring, ten-segment strip, destination arc, parity-error
  // comparator, worked-example stepper, deity wheel and D10 Lagna builder.
  "dashamsha-deva-asura-lab": { path: "dashamsha-deva-asura-lab", exportName: "DashamshaDevaAsuraLab" },

  "when-will-i-marry-synthesis-lab": { path: "when-will-i-marry-synthesis-lab", exportName: "WhenWillIMarrySynthesisLab" },
  "proposal-evaluation-synthesis-lab": { path: "proposal-evaluation-synthesis-lab", exportName: "ProposalEvaluationSynthesisLab" },
  "marriage-scope-competence-router": { path: "marriage-scope-competence-router", exportName: "MarriageScopeCompetenceRouter" },
};

