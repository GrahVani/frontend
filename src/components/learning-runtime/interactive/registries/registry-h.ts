import dynamic from "next/dynamic";

export const REGISTRY = {
  "hora-calculator": dynamic(() => import("../hora-calculator").then(m => ({ default: m.HoraCalculator }))),
  "health-house-synthesis-workbench": dynamic(() => import("../health-house-synthesis-workbench").then(m => ({ default: m.HealthHouseSynthesisWorkbench }))),
  "hamsa-malavya-synthesis": dynamic(() => import("../hamsa-malavya-synthesis").then(m => ({ default: m.HamsaMalavyaSynthesis }))),
  "health-synthesis-overview-map": dynamic(() => import("../health-synthesis-overview-map").then(m => ({ default: m.HealthSynthesisOverviewMap }))),
  "home-purchase-confidence-synthesis-lab": dynamic(() => import("../home-purchase-confidence-synthesis-lab").then(m => ({ default: m.HomePurchaseConfidenceSynthesisLab }))),
  "house-system-choice-verifier": dynamic(() => import("../house-system-choice-verifier").then(m => ({ default: m.HouseSystemChoiceVerifier }))),
};
