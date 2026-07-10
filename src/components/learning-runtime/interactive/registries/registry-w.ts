import dynamic from "next/dynamic";

export const REGISTRY = {
  "when-will-i-marry-synthesis-lab": dynamic(() => import("../when-will-i-marry-synthesis-lab").then(m => ({ default: m.WhenWillIMarrySynthesisLab }))),
};
