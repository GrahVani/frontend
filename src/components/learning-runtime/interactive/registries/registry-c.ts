import dynamic from "next/dynamic";

export const REGISTRY = {
  "confidence-tier-overlay-builder": dynamic(() => import("../confidence-tier-overlay-builder").then(m => ({ default: m.ConfidenceTierOverlayBuilder }))),
  "conflict-resolution-sequence-walkthrough": dynamic(() => import("../conflict-resolution-sequence-walkthrough").then(m => ({ default: m.ConflictResolutionSequenceWalkthrough }))),
};
