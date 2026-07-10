import dynamic from "next/dynamic";

export const REGISTRY = {
  "rahu-foreign-boundary-explorer": dynamic(() => import("../rahu-foreign-boundary-explorer").then(m => ({ default: m.RahuForeignBoundaryExplorer }))),
  "rahu-placement-permutations-explorer": dynamic(() => import("../rahu-placement-permutations-explorer").then(m => ({ default: m.RahuPlacementPermutationsExplorer }))),
  "rahu-dasha-timing-explorer": dynamic(() => import("../rahu-dasha-timing-explorer").then(m => ({ default: m.RahuDashaTimingExplorer }))),
  "rahu-aspect-doctrine-fork-explorer": dynamic(() => import("../rahu-aspect-doctrine-fork-explorer").then(m => ({ default: m.RahuAspectDoctrineForkExplorer }))),
  "rudra-maheshvara-workbench": dynamic(() => import("../rudra-maheshvara-workbench").then(m => ({ default: m.RudraMaheshvaraWorkbench }))),
};
