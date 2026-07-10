import dynamic from "next/dynamic";

export const REGISTRY = {
  "marriage-scope-competence-router": dynamic(() => import("../marriage-scope-competence-router").then(m => ({ default: m.MarriageScopeCompetenceRouter }))),
};
