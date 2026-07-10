import dynamic from "next/dynamic";

export const REGISTRY = {
  "oja-yugma-calculator": dynamic(() => import("../oja-yugma-calculator").then(m => ({ default: m.OjaYugmaCalculator }))),
  "object-numerology-calculator": dynamic(() => import("../object-numerology-calculator").then(m => ({ default: m.ObjectNumerologyCalculator }))),
  "overall-wealth-promise-synthesis": dynamic(() => import("../overall-wealth-promise-synthesis").then(m => ({ default: m.OverallWealthPromiseSynthesis }))),
};
