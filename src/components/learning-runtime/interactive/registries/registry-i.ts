import dynamic from "next/dynamic";

export const REGISTRY = {
  "ishta-devata-ketu-derivation-lab": dynamic(() => import("../ishta-devata-ketu-derivation-lab").then(m => ({ default: m.IshtaDevataKetuDerivationLab }))),
  "ishta-devata-respect-framing-lab": dynamic(() => import("../ishta-devata-respect-framing-lab").then(m => ({ default: m.IshtaDevataRespectFramingLab }))),
  "investment-decision-synthesis": dynamic(() => import("../investment-decision-synthesis").then(m => ({ default: m.InvestmentDecisionSynthesis }))),
};
