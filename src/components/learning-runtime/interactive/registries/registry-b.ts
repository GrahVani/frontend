import dynamic from "next/dynamic";

export const REGISTRY = {
  "birth-time-quality-checker": dynamic(() => import("../birth-time-quality-checker").then(m => ({ default: m.BirthTimeQualityChecker }))),
  "balarista-doctrine-frame-explorer": dynamic(() => import("../balarista-doctrine-frame-explorer").then(m => ({ default: m.BalaristaDoctrineFrameExplorer }))),
  "balarista-configuration-spotter": dynamic(() => import("../balarista-configuration-spotter").then(m => ({ default: m.BalaristaConfigurationSpotter }))),
  "balarista-cancellation-walker": dynamic(() => import("../balarista-cancellation-walker").then(m => ({ default: m.BalaristaCancellationWalker }))),
  "balarista-ethics-framing-trainer": dynamic(() => import("../balarista-ethics-framing-trainer").then(m => ({ default: m.BalaristaEthicsFramingTrainer }))),
};
