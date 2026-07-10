import dynamic from "next/dynamic";

export const REGISTRY = {
  "upapada-marriage-arudha-workbench": dynamic(() => import("../upapada-marriage-arudha-workbench").then(m => ({ default: m.UpapadaMarriageArudhaWorkbench }))),
  "ul-placement-lord-sustenance-workbench": dynamic(() => import("../ul-placement-lord-sustenance-workbench").then(m => ({ default: m.UlPlacementLordSustenanceWorkbench }))),
};
