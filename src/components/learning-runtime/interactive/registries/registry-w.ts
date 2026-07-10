import dynamic from "next/dynamic";

export const REGISTRY = {
  "when-will-children-synthesis-bench": dynamic(() => import("../when-will-children-synthesis-bench").then(m => ({ default: m.WhenWillChildrenSynthesisBench }))),
  "when-will-i-marry-synthesis-lab": dynamic(() => import("../when-will-i-marry-synthesis-lab").then(m => ({ default: m.WhenWillIMarrySynthesisLab }))),
};
