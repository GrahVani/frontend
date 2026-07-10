import dynamic from "next/dynamic";

export const REGISTRY = {
  "birth-time-quality-checker": dynamic(() => import("../birth-time-quality-checker").then(m => ({ default: m.BirthTimeQualityChecker }))),
};
