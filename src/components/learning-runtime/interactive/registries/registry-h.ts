import dynamic from "next/dynamic";

export const REGISTRY = {
  "health-house-synthesis-workbench": dynamic(() => import("../health-house-synthesis-workbench").then(m => ({ default: m.HealthHouseSynthesisWorkbench }))),
  "health-synthesis-overview-map": dynamic(() => import("../health-synthesis-overview-map").then(m => ({ default: m.HealthSynthesisOverviewMap }))),
  "home-purchase-confidence-synthesis-lab": dynamic(() => import("../home-purchase-confidence-synthesis-lab").then(m => ({ default: m.HomePurchaseConfidenceSynthesisLab }))),
};
