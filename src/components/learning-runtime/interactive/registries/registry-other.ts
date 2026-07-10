import dynamic from "next/dynamic";

export const REGISTRY = {
  "249-sub-explorer": dynamic(() => import("../249-sub-explorer").then(m => ({ default: m.Kp249SubExplorer }))),
  "24-module-synthesis": dynamic(() => import("../24-module-synthesis").then(m => ({ default: m.Module24SynthesisDojo }))),
};
