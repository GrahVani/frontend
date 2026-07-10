import dynamic from "next/dynamic";

export const REGISTRY = {
  "tithi-angle-visualizer": dynamic(() => import("../tithi-angle-visualizer").then(m => ({ default: m.TithiAngleVisualizer }))),
  "tithi-calculator-dojo": dynamic(() => import("../tithi-calculator-dojo").then(m => ({ default: m.TithiCalculatorDojo }))),
  "tithi-context-matcher": dynamic(() => import("../tithi-context-matcher").then(m => ({ default: m.TithiContextMatcher }))),
  "twelfth-house-chart-t1-explorer": dynamic(() => import("../twelfth-house-chart-t1-explorer").then(m => ({ default: m.TwelfthHouseChartT1Explorer }))),
  "twelve-nine-three-arc-explorer": dynamic(() => import("../twelve-nine-three-arc-explorer").then(m => ({ default: m.TwelveNineThreeArcExplorer }))),
  "twelve-nine-three-aspect-explorer": dynamic(() => import("../twelve-nine-three-aspect-explorer").then(m => ({ default: m.TwelveNineThreeAspectExplorer }))),
  "twelfth-house-spiritual-release": dynamic(() => import("../twelfth-house-spiritual-release").then(m => ({ default: m.TwelfthHouseSpiritualRelease }))),
  "tajika-year-specific-augmentation-lab": dynamic(() => import("../tajika-year-specific-augmentation-lab").then(m => ({ default: m.TajikaYearSpecificAugmentationLab }))),
  "tajika-dhana-saham-overlay": dynamic(() => import("../tajika-dhana-saham-overlay").then(m => ({ default: m.TajikaDhanaSahamOverlay }))),
};
