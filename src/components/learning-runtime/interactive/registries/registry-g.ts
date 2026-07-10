import dynamic from "next/dynamic";

export const REGISTRY = {
  "grief-aware-response-trainer": dynamic(() => import("../grief-aware-response-trainer").then(m => ({ default: m.GriefAwareResponseTrainer }))),
  "gajakesari-simulator": dynamic(() => import("../gajakesari-simulator").then(m => ({ default: m.GajakesariSimulator }))),
  "graha-disease-correspondence-explorer": dynamic(() => import("../graha-disease-correspondence-explorer").then(m => ({ default: m.GrahaDiseaseCorrespondenceExplorer }))),
};
