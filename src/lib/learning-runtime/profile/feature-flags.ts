/**
 * Grahvani Learning Runtime — Feature Flag Manager (feature-flags.ts)
 */

import type { FeatureFlag } from "./runtime-config";

// In-memory feature flag state
const featureFlags: Record<string, FeatureFlag> = {
  "experimental-tutoring-model": {
    id: "experimental-tutoring-model",
    enabled: false,
    description: "Enable experimental, advanced RAG tutoring prompt logic.",
  },
  "visual-roadmap-v2": {
    id: "visual-roadmap-v2",
    enabled: false,
    description: "Enable the version 2 of Personal Learning Roadmap with micro-animations.",
  },
  "advanced-burnout-risk": {
    id: "advanced-burnout-risk",
    enabled: false,
    description: "Enable advanced neural-heuristic burnout prediction models.",
  },
};

export function enableFeature(id: string): void {
  if (featureFlags[id]) {
    featureFlags[id].enabled = true;
  } else {
    featureFlags[id] = { id, enabled: true, description: "Dynamic feature flag." };
  }
}

export function disableFeature(id: string): void {
  if (featureFlags[id]) {
    featureFlags[id].enabled = false;
  } else {
    featureFlags[id] = { id, enabled: false, description: "Dynamic feature flag." };
  }
}

export function toggleFeature(id: string): boolean {
  if (featureFlags[id]) {
    featureFlags[id].enabled = !featureFlags[id].enabled;
    return featureFlags[id].enabled;
  }
  featureFlags[id] = { id, enabled: true, description: "Dynamic feature flag." };
  return true;
}

export function isFeatureEnabled(id: string): boolean {
  return featureFlags[id] ? featureFlags[id].enabled : false;
}

export function getAllFeatureFlags(): FeatureFlag[] {
  return Object.values(featureFlags);
}
