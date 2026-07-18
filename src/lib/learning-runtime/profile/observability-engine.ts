/**
 * Grahvani Learning Runtime — AI Tutor Observability Engine (observability-engine.ts)
 *
 * Provides deterministic observability, runtime trace generation, event tracking,
 * and comprehensive system health diagnosis across all AI Tutor intelligence engines.
 */

import { calculateRuntimeMetrics, RuntimeMetrics } from "./performance-engine";
import { getActiveRuntimeConfiguration } from "./runtime-config";

export interface RuntimeEvent {
  id: string;
  category:
    | "profile"
    | "memory"
    | "recommendation"
    | "analytics"
    | "dashboard"
    | "coaching"
    | "session"
    | "performance"
    | "ui";
  operation: string;
  durationMs: number;
  cached: boolean;
  timestamp: number;
  success: boolean;
  details?: string;
}

export interface RuntimeTrace {
  requestId: string;
  totalDuration: number;
  engineCount: number;
  cacheHits: number;
  cacheMisses: number;
  generatedAt: number;
  events: RuntimeEvent[];
}

export interface RuntimeHealth {
  status: "healthy" | "warning" | "critical";
  overallScore: number;
  slowOperations: number;
  cacheEfficiency: number;
  renderEfficiency: number;
  recommendations: string[];
}

let eventCounter = 0;

/**
 * Creates a deterministic RuntimeEvent.
 */
export function createRuntimeEvent(
  category: RuntimeEvent["category"],
  operation: string,
  durationMs: number,
  cached: boolean,
  success: boolean = true,
  details?: string,
  customTimestamp?: number
): RuntimeEvent {
  if (!getActiveRuntimeConfiguration().observability || !getActiveRuntimeConfiguration().telemetry) {
    return {
      id: "evt_disabled",
      category: "ui",
      operation: "disabled",
      durationMs: 0,
      cached: false,
      timestamp: Date.now(),
      success: true
    };
  }
  eventCounter++;
  const timestamp = customTimestamp || (typeof performance !== "undefined" ? Math.round(performance.now() + 1700000000000) : Date.now());
  const id = `evt_${category}_${operation.replace(/[^a-zA-Z0-9]/g, "_")}_${eventCounter}`;

  return {
    id,
    category,
    operation,
    durationMs: Number(durationMs.toFixed(2)),
    cached,
    timestamp,
    success,
    details,
  };
}

/**
 * Creates a deterministic RuntimeTrace from a collection of runtime events.
 */
export function createRuntimeTrace(
  events: RuntimeEvent[],
  requestId?: string,
  customGeneratedAt?: number
): RuntimeTrace {
  if (!getActiveRuntimeConfiguration().observability) {
    return {
      requestId: "trace_disabled",
      totalDuration: 0,
      engineCount: 0,
      cacheHits: 0,
      cacheMisses: 0,
      generatedAt: Date.now(),
      events: []
    };
  }
  const totalDuration = Number(events.reduce((sum, e) => sum + e.durationMs, 0).toFixed(2));
  const uniqueEngines = new Set(events.map((e) => e.operation.replace(/_start$|_complete$/, "")));
  const completionOrAllEvents = events.some((e) => e.operation.endsWith("_complete"))
    ? events.filter((e) => !e.operation.endsWith("_start"))
    : events;

  const cacheHits = completionOrAllEvents.filter((e) => e.cached).length;
  const cacheMisses = completionOrAllEvents.filter((e) => !e.cached).length;
  const generatedAt = customGeneratedAt || (events.length > 0 ? events[events.length - 1].timestamp : 1700000000000);
  const reqId = requestId || `trace_${events.length}_${generatedAt}`;

  return {
    requestId: reqId,
    totalDuration,
    engineCount: uniqueEngines.size,
    cacheHits,
    cacheMisses,
    generatedAt,
    events: [...events],
  };
}

/**
 * Calculates comprehensive runtime health status, efficiency scores, and diagnostic recommendations.
 */
export function calculateRuntimeHealth(
  metricsOrEvents?: RuntimeMetrics | RuntimeEvent[],
  eventsList?: RuntimeEvent[]
): RuntimeHealth {
  if (!getActiveRuntimeConfiguration().observability || !getActiveRuntimeConfiguration().diagnostics) {
    return {
      status: "healthy",
      overallScore: 100,
      slowOperations: 0,
      cacheEfficiency: 100,
      renderEfficiency: 100,
      recommendations: ["Runtime Observability is disabled in current configuration preset."]
    };
  }
  let metrics: RuntimeMetrics;
  let events: RuntimeEvent[] = [];

  if (Array.isArray(metricsOrEvents)) {
    events = metricsOrEvents;
    metrics = calculateRuntimeMetrics();
  } else if (metricsOrEvents && typeof metricsOrEvents === "object") {
    metrics = metricsOrEvents;
    if (Array.isArray(eventsList)) {
      events = eventsList;
    }
  } else {
    metrics = calculateRuntimeMetrics();
    if (Array.isArray(eventsList)) {
      events = eventsList;
    }
  }

  // Calculate slow operations (> 10ms or from average execution time if events empty)
  const slowOperations = events.length > 0
    ? events.filter((e) => e.durationMs > 10).length
    : (metrics.averageExecutionTime > 10 ? 1 : 0);

  // Cache efficiency
  const cacheEfficiency = events.length > 0
    ? Math.round((events.filter((e) => e.cached).length / events.length) * 100)
    : metrics.cacheHitRate;

  // Render efficiency based on slow operations and uncached calculations
  const renderEfficiency = Math.max(0, Math.min(100, Math.round(100 - slowOperations * 4)));

  // Overall health score calculation
  const rawScore = Math.round(cacheEfficiency * 0.5 + renderEfficiency * 0.5 - slowOperations * 2);
  const overallScore = Math.max(0, Math.min(100, rawScore));

  let status: RuntimeHealth["status"] = "healthy";
  if (overallScore < 50 || slowOperations >= 15) {
    status = "critical";
  } else if (overallScore < 80 || slowOperations >= 5) {
    status = "warning";
  }

  const recommendations: string[] = [];
  if (cacheEfficiency < 60) {
    recommendations.push(`Cache hit rate is suboptimal (${cacheEfficiency}%). Review progress store invalidation triggers.`);
  }
  if (slowOperations > 0) {
    recommendations.push(`Detected ${slowOperations} slow runtime operations (>10ms). Verify memoization boundaries.`);
  }
  if (renderEfficiency < 80) {
    recommendations.push(`Render efficiency (${renderEfficiency}%) indicates potential UI re-renders. Check stable useMemo selectors.`);
  }
  if (recommendations.length === 0) {
    recommendations.push("Runtime observability engine reports optimal health across all telemetry categories.");
  }

  return {
    status,
    overallScore,
    slowOperations,
    cacheEfficiency,
    renderEfficiency,
    recommendations,
  };
}
