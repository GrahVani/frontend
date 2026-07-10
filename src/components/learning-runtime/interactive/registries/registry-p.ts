import dynamic from "next/dynamic";

export const REGISTRY = {
  "putra-karaka-pk-convergence-bench": dynamic(() => import("../putra-karaka-pk-convergence-bench").then(m => ({ default: m.PutraKarakaPkConvergenceBench }))),
  "pk-placement-navamsha-workbench": dynamic(() => import("../pk-placement-navamsha-workbench").then(m => ({ default: m.PkPlacementNavamshaWorkbench }))),
  "pcpndt-refusal-trainer": dynamic(() => import("../pcpndt-refusal-trainer").then(m => ({ default: m.PcpndtRefusalTrainer }))),
  "permanent-settlement-synthesis": dynamic(() => import("../permanent-settlement-synthesis").then(m => ({ default: m.PermanentSettlementSynthesis }))),
  "parashara-anchor-md1-lab": dynamic(() => import("../parashara-anchor-md1-lab").then(m => ({ default: m.ParasharaAnchorMd1Lab }))),
  "parashara-only-statement-template-lab": dynamic(() => import("../parashara-only-statement-template-lab").then(m => ({ default: m.ParasharaOnlyStatementTemplateLab }))),
  "parashara-worked-reading-md1-lab": dynamic(() => import("../parashara-worked-reading-md1-lab").then(m => ({ default: m.ParasharaWorkedReadingMd1Lab }))),
  "parashara-anchor-not-verdict-lab": dynamic(() => import("../parashara-anchor-not-verdict-lab").then(m => ({ default: m.ParasharaAnchorNotVerdictLab }))),
  "parashara-kp-two-stream-statement-lab": dynamic(() => import("../parashara-kp-two-stream-statement-lab").then(m => ({ default: m.ParasharaKpTwoStreamStatementLab }))),
  "parashara-kp-jaimini-three-stream-lab": dynamic(() => import("../parashara-kp-jaimini-three-stream-lab").then(m => ({ default: m.ParasharaKpJaiminiThreeStreamLab }))),
  "property-dasha-acquisition-timing-lab": dynamic(() => import("../property-dasha-acquisition-timing-lab").then(m => ({ default: m.PropertyDashaAcquisitionTimingLab }))),
  "property-competence-routing-lab": dynamic(() => import("../property-competence-routing-lab").then(m => ({ default: m.PropertyCompetenceRoutingLab }))),
  "proposal-evaluation-synthesis-lab": dynamic(() => import("../proposal-evaluation-synthesis-lab").then(m => ({ default: m.ProposalEvaluationSynthesisLab }))),
};
