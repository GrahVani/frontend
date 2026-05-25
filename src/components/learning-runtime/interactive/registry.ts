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
};

export function resolveInteractive(slug: string | undefined): InteractiveComponentType | null {
  if (!slug) return null;
  return INTERACTIVE_REGISTRY[slug] ?? null;
}
