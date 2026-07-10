import dynamic from "next/dynamic";

export const REGISTRY = {
  "d1-d9-divergence-reader": dynamic(() => import("../d1-d9-divergence-reader").then(m => ({ default: m.D1D9DivergenceReader }))),
  "divergence-pattern-ranker": dynamic(() => import("../divergence-pattern-ranker").then(m => ({ default: m.DivergencePatternRanker }))),
  "dual-matrix-domain-comparison": dynamic(() => import("../dual-matrix-domain-comparison").then(m => ({ default: m.DualMatrixDomainComparison }))),
  "dashamsha-deva-asura-lab": dynamic(() => import("../dashamsha-deva-asura-lab").then(m => ({ default: m.DashamshaDevaAsuraLab }))),
};
