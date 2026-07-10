import dynamic from "next/dynamic";

export const REGISTRY = {
  "grief-aware-response-trainer": dynamic(() => import("../grief-aware-response-trainer").then(m => ({ default: m.GriefAwareResponseTrainer }))),
  "gandanta-water-fire-junction": dynamic(() => import("../gandanta-water-fire-junction").then(m => ({ default: m.GandantaWaterFireJunction }))),
  "griha-pravesha-muhurta-evaluator": dynamic(() => import("../griha-pravesha-muhurta-evaluator").then(m => ({ default: m.GrihaPraveshaMuhurtaEvaluator }))),
  "gajakesari-simulator": dynamic(() => import("../gajakesari-simulator").then(m => ({ default: m.GajakesariSimulator }))),
  "gochara-trigger-confirmation": dynamic(() => import("../gochara-trigger-confirmation").then(m => ({ default: m.GocharaTriggerConfirmation }))),
  "graha-disease-correspondence-explorer": dynamic(() => import("../graha-disease-correspondence-explorer").then(m => ({ default: m.GrahaDiseaseCorrespondenceExplorer }))),
  "gochara-intro": dynamic(() => import("../gochara-intro").then(m => ({ default: m.GocharaIntro }))),
  "guru-transit-reader": dynamic(() => import("../guru-transit-reader").then(m => ({ default: m.GuruTransitReader }))),
  "guru-saturn-conjunction-reader": dynamic(() => import("../guru-saturn-conjunction-reader").then(m => ({ default: m.GuruSaturnConjunctionReader }))),
  "gaja-kesari-detector": dynamic(() => import("../gaja-kesari-detector").then(m => ({ default: m.GajaKesariDetector }))),
  "graha-drishti-wheel": dynamic(() => import("../graha-drishti-wheel").then(m => ({ default: m.GrahaDrishtiWheel }))),
  "graha-yantra-gallery": dynamic(() => import("../graha-yantra-gallery").then(m => ({ default: m.GrahaYantraGallery }))),
  "gemstone-safety-checklist": dynamic(() => import("../gemstone-safety-checklist").then(m => ({ default: m.GemstoneSafetyChecklist }))),
  "graha-dana-table": dynamic(() => import("../graha-dana-table").then(m => ({ default: m.GrahaDanaTable }))),
  "grantha-accessibility-map": dynamic(() => import("../grantha-accessibility-map").then(m => ({ default: m.GranthaAccessibilityMap }))),
};
