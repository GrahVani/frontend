import dynamic from "next/dynamic";

export const REGISTRY = {
  "ethical-routing-checklist": dynamic(() => import("../ethical-routing-checklist").then(m => ({ default: m.EthicalRoutingChecklist }))),
  "eighth-house-spiritual-transformation": dynamic(() => import("../eighth-house-spiritual-transformation").then(m => ({ default: m.EighthHouseSpiritualTransformation }))),
  "eighth-twelfth-health-registers": dynamic(() => import("../eighth-twelfth-health-registers").then(m => ({ default: m.EighthTwelfthHealthRegisters }))),
  "event-reading-workbench": dynamic(() => import("../event-reading-workbench").then(m => ({ default: m.EventReadingWorkbench }))),
  "entrepreneurship-employment-synthesis-workbench": dynamic(() => import("../entrepreneurship-employment-synthesis-workbench").then(m => ({ default: m.EntrepreneurshipEmploymentSynthesisWorkbench }))),
  "exam-outcome-confidence-workbench": dynamic(() => import("../exam-outcome-confidence-workbench").then(m => ({ default: m.ExamOutcomeConfidenceWorkbench }))),
  "education-scope-of-competence-workbench": dynamic(() => import("../education-scope-of-competence-workbench").then(m => ({ default: m.EducationScopeOfCompetenceWorkbench }))),
  "education-dasha-timing-window-lab": dynamic(() => import("../education-dasha-timing-window-lab").then(m => ({ default: m.EducationDashaTimingWindowLab }))),
  "education-transit-tdv-overlay-lab": dynamic(() => import("../education-transit-tdv-overlay-lab").then(m => ({ default: m.EducationTransitTdvOverlayLab }))),
  "education-synthesis-overview-table-lab": dynamic(() => import("../education-synthesis-overview-table-lab").then(m => ({ default: m.EducationSynthesisOverviewTableLab }))),
  "eleventh-house-gains-evaluator": dynamic(() => import("../eleventh-house-gains-evaluator").then(m => ({ default: m.EleventhHouseGainsEvaluator }))),
  "eclipse-significance-checker": dynamic(() => import("../eclipse-significance-checker").then(m => ({ default: m.EclipseSignificanceChecker }))),
  "eclipse-calendar": dynamic(() => import("../eclipse-calendar").then(m => ({ default: m.EclipseCalendar }))),
  "ekadhipatya-reducer": dynamic(() => import("../ekadhipatya-reducer").then(m => ({ default: m.EkadhipatyaReducer }))),
  "evidentiary-layers": dynamic(() => import("../evidentiary-layers").then(m => ({ default: m.EvidentiaryLayers }))),
  "empowerment-not-dependency": dynamic(() => import("../empowerment-not-dependency").then(m => ({ default: m.EmpowermentNotDependency }))),
  "ethical-scope-routing-dashboard": dynamic(() => import("../ethical-scope-routing-dashboard").then(m => ({ default: m.EthicalScopeRoutingDashboard }))),
};
