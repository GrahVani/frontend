import dynamic from "next/dynamic";

export const REGISTRY = {
  "atmakaraka-saturn-king-lens-lab": dynamic(() => import("../atmakaraka-saturn-king-lens-lab").then(m => ({ default: m.AtmakarakaSaturnKingLensLab }))),
  "ayur-calculator": dynamic(() => import("../ayur-calculator").then(m => ({ default: m.AyurCalculator }))),
  "active-medical-distress-handling-trainer": dynamic(() => import("../active-medical-distress-handling-trainer").then(m => ({ default: m.ActiveMedicalDistressHandlingTrainer }))),
  "aptitude-tendency-mapper": dynamic(() => import("../aptitude-tendency-mapper").then(m => ({ default: m.AptitudeTendencyMapper }))),
  "ashta-kuta-framework-workbench": dynamic(() => import("../ashta-kuta-framework-workbench").then(m => ({ default: m.AshtaKutaFrameworkWorkbench }))),
  "ashta-kuta-score-interpretation-workbench": dynamic(() => import("../ashta-kuta-score-interpretation-workbench").then(m => ({ default: m.AshtaKutaScoreInterpretationWorkbench }))),
};
