import dynamic from "next/dynamic";

export const REGISTRY = {
  "when-will-children-synthesis-bench": dynamic(() => import("../when-will-children-synthesis-bench").then(m => ({ default: m.WhenWillChildrenSynthesisBench }))),
  "worked-example-3-step-synthesis": dynamic(() => import("../worked-example-3-step-synthesis").then(m => ({ default: m.WorkedExample3StepSynthesis }))),
  "write-up-structure-scaffolder": dynamic(() => import("../write-up-structure-scaffolder").then(m => ({ default: m.WriteUpStructureScaffolder }))),
  "when-will-i-marry-synthesis-lab": dynamic(() => import("../when-will-i-marry-synthesis-lab").then(m => ({ default: m.WhenWillIMarrySynthesisLab }))),
};
