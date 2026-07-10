import dynamic from "next/dynamic";

export const REGISTRY = {
  "children-d1-d7-convergence-bench": dynamic(() => import("../children-d1-d7-convergence-bench").then(m => ({ default: m.ChildrenD1D7ConvergenceBench }))),
  "children-scope-trainer": dynamic(() => import("../children-scope-trainer").then(m => ({ default: m.ChildrenScopeTrainer }))),
  "convergence-divergence-matrix-builder": dynamic(() => import("../convergence-divergence-matrix-builder").then(m => ({ default: m.ConvergenceDivergenceMatrixBuilder }))),
  "confidence-tier-overlay-builder": dynamic(() => import("../confidence-tier-overlay-builder").then(m => ({ default: m.ConfidenceTierOverlayBuilder }))),
  "conflict-resolution-sequence-walkthrough": dynamic(() => import("../conflict-resolution-sequence-walkthrough").then(m => ({ default: m.ConflictResolutionSequenceWalkthrough }))),
  "contextualisation-discipline-trainer": dynamic(() => import("../contextualisation-discipline-trainer").then(m => ({ default: m.ContextualisationDisciplineTrainer }))),
  "contextualisation-worked-example-trainer": dynamic(() => import("../contextualisation-worked-example-trainer").then(m => ({ default: m.ContextualisationWorkedExampleTrainer }))),
  "cross-stream-property-synthesis-lab": dynamic(() => import("../cross-stream-property-synthesis-lab").then(m => ({ default: m.CrossStreamPropertySynthesisLab }))),
};
