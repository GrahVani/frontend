import dynamic from "next/dynamic";

export const REGISTRY = {
  "mars-contest-karaka-litigation": dynamic(() => import("../mars-contest-karaka-litigation").then(m => ({ default: m.MarsContestKarakaLitigation }))),
  "mars-saturn-dynamic-explorer": dynamic(() => import("../mars-saturn-dynamic-explorer").then(m => ({ default: m.MarsSaturnDynamicExplorer }))),
  "mars-saturn-relationship-distinguisher": dynamic(() => import("../mars-saturn-relationship-distinguisher").then(m => ({ default: m.MarsSaturnRelationshipDistinguisher }))),
  "mars-saturn-litigation-synthesis": dynamic(() => import("../mars-saturn-litigation-synthesis").then(m => ({ default: m.MarsSaturnLitigationSynthesis }))),
  "moksha-trikona-explorer": dynamic(() => import("../moksha-trikona-explorer").then(m => ({ default: m.MokshaTrikonaExplorer }))),
  "maraka-doctrine-explorer": dynamic(() => import("../maraka-doctrine-explorer").then(m => ({ default: m.MarakaDoctrineExplorer }))),
  "maraka-identification-workbench": dynamic(() => import("../maraka-identification-workbench").then(m => ({ default: m.MarakaIdentificationWorkbench }))),
  "maraka-caution-window-trainer": dynamic(() => import("../maraka-caution-window-trainer").then(m => ({ default: m.MarakaCautionWindowTrainer }))),
  "maraka-synthesis-workbench": dynamic(() => import("../maraka-synthesis-workbench").then(m => ({ default: m.MarakaSynthesisWorkbench }))),
  "multi-stream-chart-comparator": dynamic(() => import("../multi-stream-chart-comparator").then(m => ({ default: m.MultiStreamChartComparator }))),
  "medical-routing-decision-tree": dynamic(() => import("../medical-routing-decision-tree").then(m => ({ default: m.MedicalRoutingDecisionTree }))),
  "medical-domain-competence-closing-synthesizer": dynamic(() => import("../medical-domain-competence-closing-synthesizer").then(m => ({ default: m.MedicalDomainCompetenceClosingSynthesizer }))),
  "mercury-buddhi-karaka-workbench": dynamic(() => import("../mercury-buddhi-karaka-workbench").then(m => ({ default: m.MercuryBuddhiKarakaWorkbench }))),
  "manglik-full-cancellation-workbench": dynamic(() => import("../manglik-full-cancellation-workbench").then(m => ({ default: m.ManglikFullCancellationWorkbench }))),
  "marriage-tajika-lal-kitab-overlay-workbench": dynamic(() => import("../marriage-tajika-lal-kitab-overlay-workbench").then(m => ({ default: m.MarriageTajikaLalKitabOverlayWorkbench }))),
  "marriage-dasha-timing-framework-workbench": dynamic(() => import("../marriage-dasha-timing-framework-workbench").then(m => ({ default: m.MarriageDashaTimingFrameworkWorkbench }))),
  "marriage-synthesis-overview-map": dynamic(() => import("../marriage-synthesis-overview-map").then(m => ({ default: m.MarriageSynthesisOverviewMap }))),
  "marriage-scope-competence-router": dynamic(() => import("../marriage-scope-competence-router").then(m => ({ default: m.MarriageScopeCompetenceRouter }))),
  "mars-property-karaka-depth-lab": dynamic(() => import("../mars-property-karaka-depth-lab").then(m => ({ default: m.MarsPropertyKarakaDepthLab }))),
};
