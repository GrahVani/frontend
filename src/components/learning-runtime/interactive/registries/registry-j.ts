import dynamic from "next/dynamic";

export const REGISTRY = {
  "jupiter-three-registers-convergence": dynamic(() => import("../jupiter-three-registers-convergence").then(m => ({ default: m.JupiterThreeRegistersConvergence }))),
  "jupiter-strength-scorecard": dynamic(() => import("../jupiter-strength-scorecard").then(m => ({ default: m.JupiterStrengthScorecard }))),
  "jupiter-dasha-bhukti-timeline": dynamic(() => import("../jupiter-dasha-bhukti-timeline").then(m => ({ default: m.JupiterDashaBhuktiTimeline }))),
  "jaimini-kp-children-synthesis-bench": dynamic(() => import("../jaimini-kp-children-synthesis-bench").then(m => ({ default: m.JaiminiKpChildrenSynthesisBench }))),
  "jaimini-rudra-maheshvara-explorer": dynamic(() => import("../jaimini-rudra-maheshvara-explorer").then(m => ({ default: m.JaiminiRudraMaheshvaraExplorer }))),
  "jaimini-dharma-path-augmentation-lab": dynamic(() => import("../jaimini-dharma-path-augmentation-lab").then(m => ({ default: m.JaiminiDharmaPathAugmentationLab }))),
  "jaimini-native-domain-routing-lab": dynamic(() => import("../jaimini-native-domain-routing-lab").then(m => ({ default: m.JaiminiNativeDomainRoutingLab }))),
  "jaimini-ranking-robustness-lab": dynamic(() => import("../jaimini-ranking-robustness-lab").then(m => ({ default: m.JaiminiRankingRobustnessLab }))),
  "jupiter-jnana-karaka-workbench": dynamic(() => import("../jupiter-jnana-karaka-workbench").then(m => ({ default: m.JupiterJnanaKarakaWorkbench }))),
  "jaimini-marriage-case-synthesis-lab": dynamic(() => import("../jaimini-marriage-case-synthesis-lab").then(m => ({ default: m.JaiminiMarriageCaseSynthesisLab }))),
};
