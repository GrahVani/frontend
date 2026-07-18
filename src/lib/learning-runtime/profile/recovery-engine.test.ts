import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  detectRuntimeFailures,
  generateRecoveryPlan,
  executeRecoverySimulation,
  RuntimeFailure
} from "./recovery-engine";
import { recoveryManager } from "./runtime-recovery-manager";
import { getFallbackProfile } from "./runtime-fallback";

describe("Recovery Engine", () => {
  beforeEach(() => {
    recoveryManager.clearRecoveryHistory();
  });

  it("detects cache failures accurately", () => {
    const error = new Error("cache allocation failed");
    const failures = detectRuntimeFailures([error], "analytics");
    expect(failures.length).toBe(1);
    expect(failures[0].category).toBe("cache");
    expect(failures[0].severity).toBe("high");
    expect(failures[0].recoverable).toBe(true);
  });

  it("detects render failures accurately", () => {
    const error = new Error("React render limit exceeded");
    const failures = detectRuntimeFailures([error], "dashboard");
    expect(failures[0].category).toBe("render");
    expect(failures[0].severity).toBe("critical");
    expect(failures[0].recoverable).toBe(false);
  });

  it("generates optimal recovery plan based on failure", () => {
    const error = new Error("Computation timeout");
    const failures = detectRuntimeFailures([error], "recommendation");
    const plan = generateRecoveryPlan(failures);
    expect(plan.length).toBe(1);
    expect(plan[0].strategy).toBe("fallback"); // Timeout is context in detection, leading to fallback
  });

  it("manager executes recovery gracefully on failure", () => {
    const failingEngine = () => {
      throw new Error("mock cache failure");
    };
    
    // The engine should fail, detect the failure, and return the fallback value gracefully
    const result = recoveryManager.executeWithRecovery(
      "mock-engine",
      getFallbackProfile,
      failingEngine
    );

    const fallbackProfile = getFallbackProfile();
    expect(result.completionPercentage).toBe(fallbackProfile.completionPercentage);
    
    const report = recoveryManager.getRecoveryReport();
    expect(report.unrecoveredFailures).toBe(0);
    expect(report.recoveredFailures).toBe(1);
  });

  it("manager returns actual value on success", () => {
    const successEngine = () => {
      return { success: true };
    };

    const result = recoveryManager.executeWithRecovery(
      "mock-engine",
      () => ({ success: false }),
      successEngine
    );

    expect(result.success).toBe(true);
  });
});
