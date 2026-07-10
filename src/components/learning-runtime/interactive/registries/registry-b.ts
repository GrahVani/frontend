import dynamic from "next/dynamic";

export const REGISTRY = {
  "birth-time-quality-checker": dynamic(() => import("../birth-time-quality-checker").then(m => ({ default: m.BirthTimeQualityChecker }))),
  "balarista-doctrine-frame-explorer": dynamic(() => import("../balarista-doctrine-frame-explorer").then(m => ({ default: m.BalaristaDoctrineFrameExplorer }))),
  "balarista-configuration-spotter": dynamic(() => import("../balarista-configuration-spotter").then(m => ({ default: m.BalaristaConfigurationSpotter }))),
  "balarista-cancellation-walker": dynamic(() => import("../balarista-cancellation-walker").then(m => ({ default: m.BalaristaCancellationWalker }))),
  "balarista-ethics-framing-trainer": dynamic(() => import("../balarista-ethics-framing-trainer").then(m => ({ default: m.BalaristaEthicsFramingTrainer }))),
  "bhukti-yoga-matrix": dynamic(() => import("../bhukti-yoga-matrix").then(m => ({ default: m.BhuktiYogaMatrix }))),
  "bhadra-intellect-explorer": dynamic(() => import("../bhadra-intellect-explorer").then(m => ({ default: m.BhadraIntellectExplorer }))),
  "budhaditya-checker": dynamic(() => import("../budhaditya-checker").then(m => ({ default: m.BudhadityaChecker }))),
  "bhava-bala-calculator": dynamic(() => import("../bhava-bala-calculator").then(m => ({ default: m.BhavaBalaCalculator }))),
  "buddhaditya-gajakesari-detector": dynamic(() => import("../buddhaditya-gajakesari-detector").then(m => ({ default: m.BuddhadityaGajakesariDetector }))),
  "blind-planet-explorer": dynamic(() => import("../blind-planet-explorer").then(m => ({ default: m.BlindPlanetExplorer }))),
  "burning-planet-explorer": dynamic(() => import("../burning-planet-explorer").then(m => ({ default: m.BurningPlanetExplorer }))),
  "bhagyanka-calculator": dynamic(() => import("../bhagyanka-calculator").then(m => ({ default: m.BhagyankaCalculator }))),
  "business-name-numerology-calculator": dynamic(() => import("../business-name-numerology-calculator").then(m => ({ default: m.BusinessNameNumerologyCalculator }))),
  "birth-time-accuracy-assessment": dynamic(() => import("../birth-time-accuracy-assessment").then(m => ({ default: m.BirthTimeAccuracyAssessment }))),
  "bhinna-builder": dynamic(() => import("../bhinna-builder").then(m => ({ default: m.BhinnaBuilder }))),
  "bhinna-total-checker": dynamic(() => import("../bhinna-total-checker").then(m => ({ default: m.BhinnaTotalChecker }))),
  "bhinna-interpreter": dynamic(() => import("../bhinna-interpreter").then(m => ({ default: m.BhinnaInterpreter }))),
  "bhrigu-flow": dynamic(() => import("../bhrigu-flow").then(m => ({ default: m.BhriguFlow }))),
};
