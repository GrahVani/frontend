import dynamic from "next/dynamic";

export const REGISTRY = {
  "navamsha-calculator": dynamic(() => import("../navamsha-calculator").then(m => ({ default: m.NavamshaCalculator }))),
  "navamsha-reader": dynamic(() => import("../navamsha-reader").then(m => ({ default: m.NavamshaReader }))),
  "ninth-house-chart-t1-explorer": dynamic(() => import("../ninth-house-chart-t1-explorer").then(m => ({ default: m.NinthHouseChartT1Explorer }))),
  "nri-yoga-citation-honesty-explorer": dynamic(() => import("../nri-yoga-citation-honesty-explorer").then(m => ({ default: m.NriYogaCitationHonestyExplorer }))),
  "nri-yoga-pattern-spotter": dynamic(() => import("../nri-yoga-pattern-spotter").then(m => ({ default: m.NriYogaPatternSpotter }))),
  "naisargika-ayur-cross-check-workbench": dynamic(() => import("../naisargika-ayur-cross-check-workbench").then(m => ({ default: m.NaisargikaAyurCrossCheckWorkbench }))),
  "nadi-access-limits-decision-lab": dynamic(() => import("../nadi-access-limits-decision-lab").then(m => ({ default: m.NadiAccessLimitsDecisionLab }))),
  "ninth-house-higher-learning-workbench": dynamic(() => import("../ninth-house-higher-learning-workbench").then(m => ({ default: m.NinthHouseHigherLearningWorkbench }))),
  "natural-wealth-karaka-analyzer": dynamic(() => import("../natural-wealth-karaka-analyzer").then(m => ({ default: m.NaturalWealthKarakaAnalyzer }))),
};
