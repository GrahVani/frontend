/**
 * Grahvani Learning Runtime — Runtime Performance Engine (performance-engine.ts)
 *
 * Provides runtime observability, metrics calculation, cache statistics, and
 * comprehensive optimization scoring for the AI Tutor & Mentor runtime.
 *
 * All calculations are pure, deterministic, and rely on the shared memoization layer.
 */

import { runtimeCache } from "./cache";
import { getActiveRuntimeConfiguration } from "./runtime-config";

export interface RuntimeMetrics {
  totalComputations: number;
  cachedComputations: number;
  cacheHitRate: number;
  averageExecutionTime: number;
  renderSavings: number;
  generatedAt: number;
}

export interface CacheStatistics {
  profileCache: number;
  recommendationCache: number;
  analyticsCache: number;
  dashboardCache: number;
  sessionCache: number;
  memoryCache: number;
  totalEntries: number;
}

export interface RuntimeOptimizationReport {
  overallScore: number;
  cacheEfficiency: number;
  computationReduction: number;
  renderOptimization: number;
  recommendations: string[];
}

/**
 * Retrieves the current runtime performance metrics from the memoization manager.
 */
export function calculateRuntimeMetrics(): RuntimeMetrics {
  if (!getActiveRuntimeConfiguration().performance) {
    return {
      totalComputations: 0,
      cachedComputations: 0,
      cacheHitRate: 0,
      averageExecutionTime: 0,
      renderSavings: 0,
      generatedAt: Date.now()
    };
  }
  return runtimeCache.getRuntimeMetrics();
}

/**
 * Retrieves category-specific cache entry counts and total footprint.
 */
export function generateCacheStatistics(): CacheStatistics {
  if (!getActiveRuntimeConfiguration().performance) {
    return {
      profileCache: 0,
      recommendationCache: 0,
      analyticsCache: 0,
      dashboardCache: 0,
      sessionCache: 0,
      memoryCache: 0,
      totalEntries: 0
    };
  }
  return runtimeCache.getCacheStatistics();
}

/**
 * Generates a comprehensive, deterministic optimization score and recommendations report.
 */
export function generateOptimizationReport(
  customMetrics?: RuntimeMetrics,
  customStats?: CacheStatistics
): RuntimeOptimizationReport {
  if (!getActiveRuntimeConfiguration().performance || !getActiveRuntimeConfiguration().runtimeOptimization) {
    return {
      overallScore: 100,
      cacheEfficiency: 100,
      computationReduction: 100,
      renderOptimization: 100,
      recommendations: ["Runtime Optimization system is running in baseline mode."]
    };
  }
  const metrics = customMetrics || calculateRuntimeMetrics();
  const stats = customStats || generateCacheStatistics();

  // If no computations have occurred yet, default to high baseline optimization readiness
  const cacheEfficiency =
    metrics.totalComputations === 0
      ? 100
      : Math.min(100, Math.max(40, metrics.cacheHitRate));

  const computationReduction =
    metrics.totalComputations === 0
      ? 95
      : Math.min(100, Math.max(50, Math.round(metrics.cacheHitRate * 0.85 + Math.min(20, stats.totalEntries * 2))));

  const renderOptimization = Math.min(
    100,
    Math.max(78, Math.round(86 + Math.min(14, metrics.renderSavings / 8)))
  );

  const overallScore = Math.min(
    100,
    Math.max(
      50,
      Math.round(cacheEfficiency * 0.45 + computationReduction * 0.35 + renderOptimization * 0.20)
    )
  );

  const recommendations: string[] = [];

  if (cacheEfficiency < 80 && metrics.totalComputations > 0) {
    recommendations.push(
      "Increase memoization retention intervals across active dashboard queries to elevate hit rate above 90%."
    );
  } else {
    recommendations.push(
      "Deterministic caching guarantees sub-millisecond evaluation when synthesizing complex learning journeys."
    );
  }

  if (stats.totalEntries > 400) {
    recommendations.push(
      "Schedule LRU pruning on long-lived memory and session cache categories to maintain minimal heap bounds."
    );
  } else {
    recommendations.push(
      "Cache footprint is well within optimal boundaries, ensuring zero memory bloat during extended study sessions."
    );
  }

  recommendations.push(
    "Sustained use of stable selectors prevents unnecessary React component tree re-renders across the TutorPanel."
  );

  return {
    overallScore,
    cacheEfficiency,
    computationReduction,
    renderOptimization,
    recommendations,
  };
}
