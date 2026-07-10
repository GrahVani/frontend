import dynamic from "next/dynamic";

export const REGISTRY = {
  "overall-wealth-promise-synthesis": dynamic(() => import("../overall-wealth-promise-synthesis").then(m => ({ default: m.OverallWealthPromiseSynthesis }))),
};
