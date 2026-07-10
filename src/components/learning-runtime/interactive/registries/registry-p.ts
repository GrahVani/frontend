import dynamic from "next/dynamic";

export const REGISTRY = {
  "proposal-evaluation-synthesis-lab": dynamic(() => import("../proposal-evaluation-synthesis-lab").then(m => ({ default: m.ProposalEvaluationSynthesisLab }))),
};
