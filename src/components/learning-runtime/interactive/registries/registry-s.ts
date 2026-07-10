import dynamic from "next/dynamic";

export const REGISTRY = {
  "sloka-recitation-frame": dynamic(() => import("../sloka-recitation-frame").then(m => ({ default: m.SlokaRecitationFrame }))),
  "shukla-tithi-strip": dynamic(() => import("../shukla-tithi-strip").then(m => ({ default: m.ShuklaTithiStrip }))),
  "synthesis-statement-composition-discipline": dynamic(() => import("../synthesis-statement-composition-discipline").then(m => ({ default: m.SynthesisStatementCompositionDiscipline }))),
};
