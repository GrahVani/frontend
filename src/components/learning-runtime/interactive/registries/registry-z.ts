import dynamic from "next/dynamic";

export const REGISTRY = {
  "zodiac-tradition-comparator": dynamic(() => import("../zodiac-tradition-comparator")),
};
