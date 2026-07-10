import dynamic from "next/dynamic";

export const REGISTRY = {
  "gajakesari-simulator": dynamic(() => import("../gajakesari-simulator").then(m => ({ default: m.GajakesariSimulator }))),
};
