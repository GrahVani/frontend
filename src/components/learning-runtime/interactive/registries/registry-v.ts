import dynamic from "next/dynamic";

export const REGISTRY = {
  "vedanga-vs-vedanta-comparator": dynamic(() => import("../vedanga-vs-vedanta-comparator").then(m => ({ default: m.VedangaVsVedantaComparator }))),
  "varga-reference-table": dynamic(() => import("../varga-reference-table").then(m => ({ default: m.VargaReferenceTable }))),
  "varga-calculator": dynamic(() => import("../varga-calculator").then(m => ({ default: m.VargaCalculator }))),
  "vargottama-scanner": dynamic(() => import("../vargottama-scanner").then(m => ({ default: m.VargottamaScanner }))),
  "visa-question-multi-causal-synthesis": dynamic(() => import("../visa-question-multi-causal-synthesis").then(m => ({ default: m.VisaQuestionMultiCausalSynthesis }))),
  "vyapara-arambh-muhurta-evaluator": dynamic(() => import("../vyapara-arambh-muhurta-evaluator").then(m => ({ default: m.VyaparaArambhMuhurtaEvaluator }))),
  "vitality-trend-synthesis-workbench": dynamic(() => import("../vitality-trend-synthesis-workbench").then(m => ({ default: m.VitalityTrendSynthesisWorkbench }))),
  "vastu-property-scope-distinction-lab": dynamic(() => import("../vastu-property-scope-distinction-lab").then(m => ({ default: m.VastuPropertyScopeDistinctionLab }))),
  "vargottama-marriage-confirmation-workbench": dynamic(() => import("../vargottama-marriage-confirmation-workbench").then(m => ({ default: m.VargottamaMarriageConfirmationWorkbench }))),
  "venus-marriage-karaka-prediction-workbench": dynamic(() => import("../venus-marriage-karaka-prediction-workbench").then(m => ({ default: m.VenusMarriageKarakaPredictionWorkbench }))),
  "venus-dignity-strength-marriage-console": dynamic(() => import("../venus-dignity-strength-marriage-console").then(m => ({ default: m.VenusDignityStrengthMarriageConsole }))),
  "venus-company-quality-workbench": dynamic(() => import("../venus-company-quality-workbench").then(m => ({ default: m.VenusCompanyQualityWorkbench }))),
  "venus-analysis-marriage-case-lab": dynamic(() => import("../venus-analysis-marriage-case-lab").then(m => ({ default: m.VenusAnalysisMarriageCaseLab }))),
};
