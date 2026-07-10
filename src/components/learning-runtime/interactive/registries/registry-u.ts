import dynamic from "next/dynamic";

export const REGISTRY = {
  "uchchabala-calculator": dynamic(() => import("../uchchabala-calculator").then(m => ({ default: m.UchchabalaCalculator }))),
  "uttara-ashadha-attribute-universe": dynamic(() => import("../uttara-ashadha-attribute-universe").then(m => ({ default: m.UttaraAshadhaAttributeUniverse }))),
  "upapada-marriage-arudha-workbench": dynamic(() => import("../upapada-marriage-arudha-workbench").then(m => ({ default: m.UpapadaMarriageArudhaWorkbench }))),
  "ul-placement-lord-sustenance-workbench": dynamic(() => import("../ul-placement-lord-sustenance-workbench").then(m => ({ default: m.UlPlacementLordSustenanceWorkbench }))),
  "uparatna-table": dynamic(() => import("../uparatna-table").then(m => ({ default: m.UparatnaTable }))),
  "upavasa-guide": dynamic(() => import("../upavasa-guide").then(m => ({ default: m.UpavasaGuide }))),
};
