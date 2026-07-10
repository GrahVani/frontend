import dynamic from "next/dynamic";

export const REGISTRY = {
  "eighth-house-spiritual-transformation": dynamic(() => import("../eighth-house-spiritual-transformation").then(m => ({ default: m.EighthHouseSpiritualTransformation }))),
  "eighth-twelfth-health-registers": dynamic(() => import("../eighth-twelfth-health-registers").then(m => ({ default: m.EighthTwelfthHealthRegisters }))),
  "exam-outcome-confidence-workbench": dynamic(() => import("../exam-outcome-confidence-workbench").then(m => ({ default: m.ExamOutcomeConfidenceWorkbench }))),
  "education-scope-of-competence-workbench": dynamic(() => import("../education-scope-of-competence-workbench").then(m => ({ default: m.EducationScopeOfCompetenceWorkbench }))),
  "education-dasha-timing-window-lab": dynamic(() => import("../education-dasha-timing-window-lab").then(m => ({ default: m.EducationDashaTimingWindowLab }))),
  "education-transit-tdv-overlay-lab": dynamic(() => import("../education-transit-tdv-overlay-lab").then(m => ({ default: m.EducationTransitTdvOverlayLab }))),
  "education-synthesis-overview-table-lab": dynamic(() => import("../education-synthesis-overview-table-lab").then(m => ({ default: m.EducationSynthesisOverviewTableLab }))),
  "eleventh-house-gains-evaluator": dynamic(() => import("../eleventh-house-gains-evaluator").then(m => ({ default: m.EleventhHouseGainsEvaluator }))),
  "ethical-scope-routing-dashboard": dynamic(() => import("../ethical-scope-routing-dashboard").then(m => ({ default: m.EthicalScopeRoutingDashboard }))),
};
