import dynamic from "next/dynamic";

export const REGISTRY = {
  "kendra-trikona-grouping-visualizer": dynamic(() => import("../kendra-trikona-grouping-visualizer").then(m => ({ default: m.KendraTrikonaGroupingVisualizer }))),
  "kp-sub-calculator": dynamic(() => import("../kp-sub-calculator").then(m => ({ default: m.KpSubCalculator }))),
};
