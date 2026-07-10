import dynamic from "next/dynamic";

export const REGISTRY = {
  "tithi-angle-visualizer": dynamic(() => import("../tithi-angle-visualizer").then(m => ({ default: m.TithiAngleVisualizer }))),
  "tithi-calculator-dojo": dynamic(() => import("../tithi-calculator-dojo").then(m => ({ default: m.TithiCalculatorDojo }))),
  "tithi-context-matcher": dynamic(() => import("../tithi-context-matcher").then(m => ({ default: m.TithiContextMatcher }))),
};
