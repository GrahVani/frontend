import dynamic from "next/dynamic";

export const REGISTRY = {
  "jaimini-tradition-map": dynamic(() => import("../jaimini-tradition-map").then(m => ({ default: m.JaiminiTraditionMap }))),
  "jaimini-interpreter-comparator": dynamic(() => import("../jaimini-interpreter-comparator").then(m => ({ default: m.JaiminiInterpreterComparator }))),
  "jupiter-three-registers-convergence": dynamic(() => import("../jupiter-three-registers-convergence").then(m => ({ default: m.JupiterThreeRegistersConvergence }))),
  "jupiter-strength-scorecard": dynamic(() => import("../jupiter-strength-scorecard").then(m => ({ default: m.JupiterStrengthScorecard }))),
  "jupiter-dasha-bhukti-timeline": dynamic(() => import("../jupiter-dasha-bhukti-timeline").then(m => ({ default: m.JupiterDashaBhuktiTimeline }))),
  "jaimini-kp-children-synthesis-bench": dynamic(() => import("../jaimini-kp-children-synthesis-bench").then(m => ({ default: m.JaiminiKpChildrenSynthesisBench }))),
  "jaimini-rudra-maheshvara-explorer": dynamic(() => import("../jaimini-rudra-maheshvara-explorer").then(m => ({ default: m.JaiminiRudraMaheshvaraExplorer }))),
  "jyeshtha-supremacy-talisman": dynamic(() => import("../jyeshtha-supremacy-talisman").then(m => ({ default: m.JyeshthaSupremacyTalisman }))),
  "job-offer-synthesis-workbench": dynamic(() => import("../job-offer-synthesis-workbench").then(m => ({ default: m.JobOfferSynthesisWorkbench }))),
  "jaimini-amk-career-case-workbench": dynamic(() => import("../jaimini-amk-career-case-workbench").then(m => ({ default: m.JaiminiAmkCareerCaseWorkbench }))),
  "jaimini-workflow-walkthrough": dynamic(() => import("../jaimini-workflow-walkthrough").then(m => ({ default: m.JaiminiWorkflowWalkthrough }))),
  "jaimini-module-closure-map": dynamic(() => import("../jaimini-module-closure-map").then(m => ({ default: m.JaiminiModuleClosureMap }))),
  "jaimini-calling-decision-tree": dynamic(() => import("../jaimini-calling-decision-tree").then(m => ({ default: m.JaiminiCallingDecisionTree }))),
  "jaimini-dharma-path-augmentation-lab": dynamic(() => import("../jaimini-dharma-path-augmentation-lab").then(m => ({ default: m.JaiminiDharmaPathAugmentationLab }))),
  "jaimini-native-domain-routing-lab": dynamic(() => import("../jaimini-native-domain-routing-lab").then(m => ({ default: m.JaiminiNativeDomainRoutingLab }))),
  "jaimini-ranking-robustness-lab": dynamic(() => import("../jaimini-ranking-robustness-lab").then(m => ({ default: m.JaiminiRankingRobustnessLab }))),
  "jupiter-jnana-karaka-workbench": dynamic(() => import("../jupiter-jnana-karaka-workbench").then(m => ({ default: m.JupiterJnanaKarakaWorkbench }))),
  "jaimini-marriage-case-synthesis-lab": dynamic(() => import("../jaimini-marriage-case-synthesis-lab").then(m => ({ default: m.JaiminiMarriageCaseSynthesisLab }))),
};
