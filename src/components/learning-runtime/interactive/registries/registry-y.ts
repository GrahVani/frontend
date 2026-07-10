import dynamic from "next/dynamic";

export const REGISTRY = {
  "yatra-muhurta-evaluator": dynamic(() => import("../yatra-muhurta-evaluator").then(m => ({ default: m.YatraMuhurtaEvaluator }))),
  "yogini-explorer": dynamic(() => import("../yogini-explorer").then(m => ({ default: m.YoginiExplorer }))),
  "yoga-strength-overlay": dynamic(() => import("../yoga-strength-overlay").then(m => ({ default: m.YogaStrengthOverlay }))),
  "yoga-firing-timeline": dynamic(() => import("../yoga-firing-timeline").then(m => ({ default: m.YogaFiringTimeline }))),
  "yoga-reading-workflow": dynamic(() => import("../yoga-reading-workflow").then(m => ({ default: m.YogaReadingWorkflow }))),
  "yogi-avayogi-career-workbench": dynamic(() => import("../yogi-avayogi-career-workbench").then(m => ({ default: m.YogiAvayogiCareerWorkbench }))),
  "yoga-dosha-identifier": dynamic(() => import("../yoga-dosha-identifier").then(m => ({ default: m.YogaDoshaIdentifier }))),
  "yoga-sav-auditor": dynamic(() => import("../yoga-sav-auditor").then(m => ({ default: m.YogaSavAuditor }))),
  "yantra-anatomy": dynamic(() => import("../yantra-anatomy").then(m => ({ default: m.YantraAnatomy }))),
};
