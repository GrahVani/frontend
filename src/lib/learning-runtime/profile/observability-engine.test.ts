import { describe, it, expect, beforeEach } from "vitest";
import {
  createRuntimeEvent,
  createRuntimeTrace,
  calculateRuntimeHealth
} from "./observability-engine";
import {
  recordRuntimeEvent,
  getRuntimeEvents,
  clearRuntimeEvents,
  recordRuntimeTrace,
  getLatestTrace,
  getTraces
} from "./telemetry";
import { runtimeCache } from "./cache";
import type { RuntimeMetrics } from "./performance-engine";

describe("Observability & Telemetry Framework (PR P9-2)", () => {
  beforeEach(() => {
    clearRuntimeEvents();
    runtimeCache.invalidateAll();
  });

  describe("createRuntimeEvent", () => {
    it("creates a well-formed deterministic runtime event", () => {
      const evt = createRuntimeEvent("profile", "_computeLearnerProfile", 12.5, false, true, "Details text");
      expect(evt.id).toBeDefined();
      expect(evt.category).toBe("profile");
      expect(evt.operation).toBe("_computeLearnerProfile");
      expect(evt.durationMs).toBe(12.5);
      expect(evt.cached).toBe(false);
      expect(evt.success).toBe(true);
      expect(evt.details).toBe("Details text");
    });
  });

  describe("createRuntimeTrace", () => {
    it("aggregates events into a complete runtime trace with statistics", () => {
      const e1 = createRuntimeEvent("profile", "_computeLearnerProfile", 15, false);
      const e2 = createRuntimeEvent("recommendation", "_computeLearnerRecommendation", 5, true);
      const e3 = createRuntimeEvent("analytics", "_computeLearningInsights", 25, false);

      const trace = createRuntimeTrace([e1, e2, e3]);
      expect(trace.requestId).toBeDefined();
      expect(trace.events).toHaveLength(3);
      expect(trace.totalDuration).toBe(45);
      expect(trace.cacheHits).toBe(1);
      expect(trace.cacheMisses).toBe(2);
      expect(trace.engineCount).toBe(3);
    });

    it("correctly calculates cacheHits and cacheMisses when _start and _complete events are emitted", () => {
      const e1 = createRuntimeEvent("profile", "_computeLearnerProfile_start", 0, false);
      const e2 = createRuntimeEvent("profile", "_computeLearnerProfile_complete", 18, false);
      const e3 = createRuntimeEvent("analytics", "_computeLearningInsights_start", 0, false);
      const e4 = createRuntimeEvent("analytics", "_computeLearningInsights_complete", 4, true);

      const trace = createRuntimeTrace([e1, e2, e3, e4]);
      expect(trace.events).toHaveLength(4);
      expect(trace.totalDuration).toBe(22);
      expect(trace.cacheHits).toBe(1);
      expect(trace.cacheMisses).toBe(1);
      expect(trace.engineCount).toBe(2);
    });
  });

  describe("calculateRuntimeHealth", () => {
    const baseMetrics: RuntimeMetrics = {
      totalComputations: 100,
      cachedComputations: 80,
      cacheHitRate: 80,
      averageExecutionTime: 5,
      renderSavings: 0,
      generatedAt: Date.now()
    };

    it("returns healthy status and recommendations when metrics and events are optimal", () => {
      const events = [
        createRuntimeEvent("profile", "_computeLearnerProfile", 5, true),
        createRuntimeEvent("recommendation", "_computeLearnerRecommendation", 8, true)
      ];

      const health = calculateRuntimeHealth(baseMetrics, events);
      expect(health.status).toBe("healthy");
      expect(health.overallScore).toBeGreaterThanOrEqual(80);
      expect(health.slowOperations).toBe(0);
      expect(health.recommendations).toContain("Runtime observability engine reports optimal health across all telemetry categories.");
    });

    it("detects slow operations and adjusts status/recommendations", () => {
      const slowEvents = [
        createRuntimeEvent("profile", "_computeLearnerProfile", 150, false),
        createRuntimeEvent("analytics", "_computeLearningInsights", 120, false)
      ];

      const health = calculateRuntimeHealth(baseMetrics, slowEvents);
      expect(health.slowOperations).toBe(2);
      expect(health.recommendations.some(r => r.includes("slow runtime operations"))).toBe(true);
    });
  });

  describe("Telemetry Buffer Manager & Cache Listener", () => {
    it("records and retrieves events up to buffer limit (in reverse chronological order)", () => {
      recordRuntimeEvent(createRuntimeEvent("profile", "op1", 10, false));
      recordRuntimeEvent(createRuntimeEvent("analytics", "op2", 20, true));

      const events = getRuntimeEvents();
      expect(events).toHaveLength(2);
      expect(events[0].operation).toBe("op2");
      expect(events[1].operation).toBe("op1");
    });

    it("records traces in circular trace buffer and retrieves latest trace", () => {
      const e1 = createRuntimeEvent("profile", "op1", 10, false);
      const trace = createRuntimeTrace([e1]);
      recordRuntimeTrace(trace);

      const latest = getLatestTrace();
      expect(latest).toBeDefined();
      expect(latest?.requestId).toBe(trace.requestId);
      expect(getTraces()).toHaveLength(1);
    });

    it("automatically captures events from runtimeCache memoize operations via listener", () => {
      // Execute memoized operations via cache
      runtimeCache.memoize("profile", ["testKey1"], () => "result1");
      runtimeCache.memoize("profile", ["testKey1"], () => "result1"); // cache hit

      const events = getRuntimeEvents();
      expect(events.length).toBeGreaterThanOrEqual(2);
      
      // events[0] is most recent (_complete of 2nd call, which was a cache hit)
      expect(events[0].cached).toBe(true);
      expect(events[0].operation).toBe("testKey1_complete");
    });
  });
});
