import dynamic from "next/dynamic";

export const REGISTRY = {
  "fertility-struggle-routing-trainer": dynamic(() => import("../fertility-struggle-routing-trainer").then(m => ({ default: m.FertilityStruggleRoutingTrainer }))),
  "fourth-house-spiritual-foundation": dynamic(() => import("../fourth-house-spiritual-foundation").then(m => ({ default: m.FourthHouseSpiritualFoundation }))),
  "five-stream-synthesis-discipline-lab": dynamic(() => import("../five-stream-synthesis-discipline-lab").then(m => ({ default: m.FiveStreamSynthesisDisciplineLab }))),
  "five-stream-matrix-shape-lab": dynamic(() => import("../five-stream-matrix-shape-lab").then(m => ({ default: m.FiveStreamMatrixShapeLab }))),
  "five-stream-layered-evidence-lab": dynamic(() => import("../five-stream-layered-evidence-lab").then(m => ({ default: m.FiveStreamLayeredEvidenceLab }))),
  "five-stream-target-chart-synthesis-lab": dynamic(() => import("../five-stream-target-chart-synthesis-lab").then(m => ({ default: m.FiveStreamTargetChartSynthesisLab }))),
  "five-stream-statement-template-lab": dynamic(() => import("../five-stream-statement-template-lab").then(m => ({ default: m.FiveStreamStatementTemplateLab }))),
  "fourth-house-education-workbench": dynamic(() => import("../fourth-house-education-workbench").then(m => ({ default: m.FourthHouseEducationWorkbench }))),
  "fifth-house-intellect-workbench": dynamic(() => import("../fifth-house-intellect-workbench").then(m => ({ default: m.FifthHouseIntellectWorkbench }))),
  "four-five-nine-educational-arc-synthesizer": dynamic(() => import("../four-five-nine-educational-arc-synthesizer").then(m => ({ default: m.FourFiveNineEducationalArcSynthesizer }))),
  "field-of-study-synthesis-workbench": dynamic(() => import("../field-of-study-synthesis-workbench").then(m => ({ default: m.FieldOfStudySynthesisWorkbench }))),
  "full-reduction-walkthrough": dynamic(() => import("../full-reduction-walkthrough").then(m => ({ default: m.FullReductionWalkthrough }))),
  "foundational-mantra-player": dynamic(() => import("../foundational-mantra-player").then(m => ({ default: m.FoundationalMantraPlayer }))),
  "first-house-vitality-physique-workbench": dynamic(() => import("../first-house-vitality-physique-workbench").then(m => ({ default: m.FirstHouseVitalityPhysiqueWorkbench }))),
  "fourth-house-property-workbench": dynamic(() => import("../fourth-house-property-workbench").then(m => ({ default: m.FourthHousePropertyWorkbench }))),
  "fourth-lord-property-permutation-lab": dynamic(() => import("../fourth-lord-property-permutation-lab").then(m => ({ default: m.FourthLordPropertyPermutationLab }))),
  "first-order-significator-visualizer": dynamic(() => import("../first-order-significator-visualizer").then(m => ({ default: m.FirstOrderSignificatorVisualizer }))),
  "follow-up-boundaries": dynamic(() => import("../follow-up-boundaries").then(m => ({ default: m.FollowUpBoundaries }))),
  "four-pillar-integrator": dynamic(() => import("../four-pillar-integrator").then(m => ({ default: m.FourPillarIntegrator }))),
};
