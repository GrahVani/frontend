import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateRuntimeMetrics,
  generateCacheStatistics,
  generateOptimizationReport,
} from "./performance-engine";
import { runtimeCache } from "./cache";

describe("Performance Engine & Runtime Cache Layer", () => {
  beforeEach(() => {
    runtimeCache.invalidateAll();
  });

  it("should calculate baseline runtime metrics when empty", () => {
    const metrics = calculateRuntimeMetrics();
    expect(metrics).toHaveProperty("totalComputations");
    expect(metrics).toHaveProperty("cachedComputations");
    expect(metrics).toHaveProperty("cacheHitRate");
    expect(metrics).toHaveProperty("averageExecutionTime");
    expect(metrics).toHaveProperty("renderSavings");
    expect(metrics.cacheHitRate).toBeGreaterThanOrEqual(0);
    expect(metrics.cacheHitRate).toBeLessThanOrEqual(100);
  });

  it("should generate category-specific cache statistics", () => {
    runtimeCache.memoize("profile", ["p1"], () => ({ id: "p1" }));
    runtimeCache.memoize("recommendation", ["r1"], () => ({ id: "r1" }));
    runtimeCache.memoize("analytics", ["a1"], () => ({ id: "a1" }));

    const stats = generateCacheStatistics();
    expect(stats.profileCache).toBe(1);
    expect(stats.recommendationCache).toBe(1);
    expect(stats.analyticsCache).toBe(1);
    expect(stats.totalEntries).toBe(3);
  });

  it("should generate a deterministic optimization report with recommendations", () => {
    const report = generateOptimizationReport();
    expect(report.overallScore).toBeGreaterThanOrEqual(0);
    expect(report.overallScore).toBeLessThanOrEqual(100);
    expect(report.cacheEfficiency).toBeGreaterThanOrEqual(0);
    expect(report.computationReduction).toBeGreaterThanOrEqual(0);
    expect(report.renderOptimization).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(report.recommendations)).toBe(true);
    expect(report.recommendations.length).toBeGreaterThan(0);
  });

  it("should deterministically memoize function evaluations and increment cache hits", () => {
    let callCount = 0;
    const computeFn = () => {
      callCount++;
      return { value: 42 };
    };

    const res1 = runtimeCache.memoize("memory", ["key-a"], computeFn);
    expect(res1.value).toBe(42);
    expect(callCount).toBe(1);

    const res2 = runtimeCache.memoize("memory", ["key-a"], computeFn);
    expect(res2.value).toBe(42);
    expect(callCount).toBe(1); // Should not re-invoke computeFn

    const metrics = calculateRuntimeMetrics();
    expect(metrics.totalComputations).toBeGreaterThanOrEqual(2);
    expect(metrics.cachedComputations).toBeGreaterThanOrEqual(1);
  });

  it("should invalidate all cache categories upon invalidateAll call", () => {
    runtimeCache.memoize("dashboard", ["dash-1"], () => ({ test: true }));
    runtimeCache.memoize("session", ["sess-1"], () => ({ test: true }));

    expect(generateCacheStatistics().totalEntries).toBe(2);

    runtimeCache.invalidateAll();
    expect(generateCacheStatistics().totalEntries).toBe(0);
  });

  it("should invalidate entries when progress state hash changes via invalidateOnStateChange", () => {
    const stateA = { lessons: { "l-1": { completed: true } } };
    const stateB = { lessons: { "l-1": { completed: true }, "l-2": { completed: true } } };

    runtimeCache.invalidateOnStateChange(stateA);
    runtimeCache.memoize("profile", ["prof-key"], () => ({ data: "foo" }));
    expect(generateCacheStatistics().profileCache).toBe(1);

    // Calling with same state should not invalidate
    runtimeCache.invalidateOnStateChange(stateA);
    expect(generateCacheStatistics().profileCache).toBe(1);

    // Calling with different state should trigger invalidation
    runtimeCache.invalidateOnStateChange(stateB);
    expect(generateCacheStatistics().profileCache).toBe(0);
  });
});
