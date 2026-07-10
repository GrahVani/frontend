import dynamic from "next/dynamic";

export const REGISTRY = {
  "navamsha-calculator": dynamic(() => import("../navamsha-calculator").then(m => ({ default: m.NavamshaCalculator }))),
  "navamsha-reader": dynamic(() => import("../navamsha-reader").then(m => ({ default: m.NavamshaReader }))),
};
