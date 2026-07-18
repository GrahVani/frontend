import { describe, it, expect } from "vitest";
import {
  enableFeature,
  disableFeature,
  toggleFeature,
  isFeatureEnabled,
  getAllFeatureFlags
} from "./feature-flags";

describe("Feature Flag Manager", () => {
  it("determines flag status and allows toggles dynamically", () => {
    // Initial state
    expect(isFeatureEnabled("experimental-tutoring-model")).toBe(false);

    // Enable
    enableFeature("experimental-tutoring-model");
    expect(isFeatureEnabled("experimental-tutoring-model")).toBe(true);

    // Disable
    disableFeature("experimental-tutoring-model");
    expect(isFeatureEnabled("experimental-tutoring-model")).toBe(false);

    // Toggle
    const newVal = toggleFeature("experimental-tutoring-model");
    expect(newVal).toBe(true);
    expect(isFeatureEnabled("experimental-tutoring-model")).toBe(true);

    // Get all feature flags
    const all = getAllFeatureFlags();
    expect(all.length).toBeGreaterThanOrEqual(3);
    expect(all.some(f => f.id === "experimental-tutoring-model")).toBe(true);
  });
});
