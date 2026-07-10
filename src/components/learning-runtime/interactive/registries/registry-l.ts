import dynamic from "next/dynamic";

export const REGISTRY = {
  "lineage-matters-synthesis-dojo": dynamic(() => import("../lineage-matters-synthesis-dojo").then(m => ({ default: m.LineageMattersSynthesisDojo }))),
  "litigation-confidence-synthesis": dynamic(() => import("../litigation-confidence-synthesis").then(m => ({ default: m.LitigationConfidenceSynthesis }))),
  "lawyer-substitution-refusal-router": dynamic(() => import("../lawyer-substitution-refusal-router").then(m => ({ default: m.LawyerSubstitutionRefusalRouter }))),
  "litigation-scope-competence-closer": dynamic(() => import("../litigation-scope-competence-closer").then(m => ({ default: m.LitigationScopeCompetenceCloser }))),
  "longevity-method-selector": dynamic(() => import("../longevity-method-selector").then(m => ({ default: m.LongevityMethodSelector }))),
  "longevity-ethics-response-trainer": dynamic(() => import("../longevity-ethics-response-trainer").then(m => ({ default: m.LongevityEthicsResponseTrainer }))),
  "lal-kitab-shadow-triad": dynamic(() => import("../lal-kitab-shadow-triad").then(m => ({ default: m.LalKitabShadowTriad }))),
  "lal-kitab-remedy-augmentation-lab": dynamic(() => import("../lal-kitab-remedy-augmentation-lab").then(m => ({ default: m.LalKitabRemedyAugmentationLab }))),
  "lal-kitab-property-teva-formula-lab": dynamic(() => import("../lal-kitab-property-teva-formula-lab").then(m => ({ default: m.LalKitabPropertyTevaFormulaLab }))),
  "lakshmi-yoga-analyser": dynamic(() => import("../lakshmi-yoga-analyser").then(m => ({ default: m.LakshmiYogaAnalyser }))),
  "lal-kitab-money-formula-revisited": dynamic(() => import("../lal-kitab-money-formula-revisited").then(m => ({ default: m.LalKitabMoneyFormulaRevisited }))),
  "lal-kitab-money-planets-analyser": dynamic(() => import("../lal-kitab-money-planets-analyser").then(m => ({ default: m.LalKitabMoneyPlanetsAnalyser }))),
  "lal-kitab-loss-formulas-evaluator": dynamic(() => import("../lal-kitab-loss-formulas-evaluator").then(m => ({ default: m.LalKitabLossFormulasEvaluator }))),
  "lal-kitab-wealth-reading-workbench": dynamic(() => import("../lal-kitab-wealth-reading-workbench").then(m => ({ default: m.LalKitabWealthReadingWorkbench }))),
};
