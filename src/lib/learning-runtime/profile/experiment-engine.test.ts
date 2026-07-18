import { describe, it, expect } from "vitest";
import {
  registerExperiment,
  activateExperiment,
  evaluateExperiment,
  getAllExperiments
} from "./experiment-engine";

describe("Experiment Engine", () => {
  it("registers and evaluates experiments", () => {
    // Initial experiment
    const res = evaluateExperiment("prompt-coaching-style");
    expect(res.experimentId).toBe("prompt-coaching-style");
    expect(res.enabled).toBe(true);
    expect(res.activeVariant).toBe("socratic");

    // Register a new experiment
    registerExperiment({
      id: "new-layout-v2",
      feature: "layout",
      variant: "minimalist",
      enabled: false,
    });

    const res2 = evaluateExperiment("new-layout-v2");
    expect(res2.enabled).toBe(false);

    // Activate experiment variant
    activateExperiment("new-layout-v2", "grid");
    const res3 = evaluateExperiment("new-layout-v2");
    expect(res3.enabled).toBe(true);
    expect(res3.activeVariant).toBe("grid");

    const all = getAllExperiments();
    expect(all.some(e => e.id === "new-layout-v2")).toBe(true);
  });
});
