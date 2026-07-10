import dynamic from "next/dynamic";

export const REGISTRY = {
  "vedanga-vs-vedanta-comparator": dynamic(() => import("../vedanga-vs-vedanta-comparator").then(m => ({ default: m.VedangaVsVedantaComparator }))),
  "varga-reference-table": dynamic(() => import("../varga-reference-table").then(m => ({ default: m.VargaReferenceTable }))),
  "varga-calculator": dynamic(() => import("../varga-calculator").then(m => ({ default: m.VargaCalculator }))),
  "vargottama-scanner": dynamic(() => import("../vargottama-scanner").then(m => ({ default: m.VargottamaScanner }))),
  "vyapara-arambh-muhurta-evaluator": dynamic(() => import("../vyapara-arambh-muhurta-evaluator").then(m => ({ default: m.VyaparaArambhMuhurtaEvaluator }))),
};
