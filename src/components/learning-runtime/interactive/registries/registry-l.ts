import dynamic from "next/dynamic";

export const REGISTRY = {
  "lineage-matters-synthesis-dojo": dynamic(() => import("../lineage-matters-synthesis-dojo").then(m => ({ default: m.LineageMattersSynthesisDojo }))),
  "lal-kitab-shadow-triad": dynamic(() => import("../lal-kitab-shadow-triad").then(m => ({ default: m.LalKitabShadowTriad }))),
};
