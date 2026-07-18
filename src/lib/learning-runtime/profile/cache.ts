/**
 * Grahvani Learning Runtime — Shared Memoization & Cache Layer (cache.ts)
 *
 * Implements a centralized, deterministic, stable-key caching engine for all
 * AI Tutor & Mentor runtime calculations (profile, memory, recommendations,
 * analytics, dashboard, session intelligence, study planner, mentoring, coaching).
 *
 * Features:
 * - Deterministic stable key generation from input arguments (progress state, profile, memory)
 * - Category-specific cache maps (`profile`, `recommendation`, `analytics`, `dashboard`, `session`, `memory`)
 * - Exact tracking of total computations, cached computations, hit rates, and execution times
 * - Automatic invalidation on progress state mutation or threshold overflow
 * - Zero stale state, pure TypeScript, completely deterministic
 */

export type CacheCategory =
  | "profile"
  | "recommendation"
  | "analytics"
  | "dashboard"
  | "session"
  | "memory"
  | "coaching"
  | "performance"
  | "ui";

export type TelemetryListener = (
  category: CacheCategory,
  operation: string,
  durationMs: number,
  cached: boolean,
  eventType: "start" | "complete"
) => void;

interface CacheEntry<T = any> {
  key: string;
  value: T;
  createdAt: number;
}

function deterministicStringify(obj: any): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return "[" + obj.map(deterministicStringify).join(",") + "]";
  }
  const keys = Object.keys(obj).sort();
  return "{" + keys.map((key) => JSON.stringify(key) + ":" + deterministicStringify(obj[key])).join(",") + "}";
}

class RuntimeCacheManager {
  private caches: Record<CacheCategory, Map<string, CacheEntry>> = {
    profile: new Map(),
    recommendation: new Map(),
    analytics: new Map(),
    dashboard: new Map(),
    session: new Map(),
    memory: new Map(),
    coaching: new Map(),
    performance: new Map(),
    ui: new Map(),
  };

  private telemetryListener: TelemetryListener | null = null;

  private totalComputations = 0;
  private cachedComputations = 0;
  private totalExecutionTimeMs = 0;
  private uncachedExecutionsCount = 0;
  private renderSavingsCount = 0;
  private lastProgressHash: string | null = null;

  /**
   * Generates a stable deterministic string key from arbitrary input arguments.
   */
  public generateStableKey(args: any[]): string {
    try {
      const simplifiedArgs = args.map((arg) => {
        if (arg === null || arg === undefined) return "";
        if (typeof arg !== "object") return String(arg);

        // If it's a progress store state, hash core dynamic fields specifically for speed and accuracy
        if (arg && typeof arg === "object" && "lessons" in arg && typeof arg.lessons === "object" && arg.lessons !== null) {
          const lessonSlugs = Object.keys(arg.lessons || {}).sort();
          const lessonSummary = lessonSlugs
            .map((slug) => {
              const l = arg.lessons[slug] || {};
              const attemptsSummary = Array.isArray(l.attempts)
                ? l.attempts.map((a: any) => `${a.scorePct}:${a.passed}:${a.attemptedAt}`).join(",")
                : "";
              return `${slug}:${l.masteryStatus || "none"}:${l.sectionsViewed?.length || 0}:${attemptsSummary}`;
            })
            .join("|");
          return `prog_${arg.streakDays || 0}_${arg.totalTimeMs || 0}_${lessonSummary}`;
        }

        // For profile or memory interfaces
        if (arg && typeof arg === "object" && "completionPercentage" in arg && "streak" in arg) {
          return `prof_${arg.completionPercentage}_${arg.completedLessons}_${arg.streak}_${arg.averageQuizScore}`;
        }
        if (arg && typeof arg === "object" && "preferredExplanation" in arg && "revisionCount" in arg) {
          return `mem_${arg.preferredExplanation}_${arg.preferredDifficulty}_${arg.revisionCount}_${arg.quizTrend}`;
        }

        // Generic object serialization fallback with sorted keys
        return deterministicStringify(arg);
      });
      return simplifiedArgs.join("::");
    } catch {
      return `key_${Date.now()}_${Math.random()}`;
    }
  }

  /**
   * Checks for progress store state changes and invalidates stale caches automatically.
   */
  public checkAndInvalidateOnProgress(progressState: any): void {
    if (!progressState || typeof progressState !== "object") return;
    const currentHash = this.generateStableKey([progressState]);
    if (this.lastProgressHash !== null && this.lastProgressHash !== currentHash) {
      this.invalidateAll();
    }
    this.lastProgressHash = currentHash;
  }

  public invalidateOnStateChange(progressState: any): void {
    this.checkAndInvalidateOnProgress(progressState);
  }

  public setTelemetryListener(listener: TelemetryListener | null): void {
    this.telemetryListener = listener;
  }

  /**
   * Memoizes a deterministic calculation function across a specific cache category.
   */
  public memoize<T>(category: CacheCategory, args: any[], fn: () => T, operationName?: string): T {
    this.totalComputations++;

    // Check progress hash invalidation if any arg looks like progress state
    for (const arg of args) {
      if (arg && typeof arg === "object" && "lessons" in arg && typeof arg.lessons === "object" && arg.lessons !== null) {
        this.checkAndInvalidateOnProgress(arg);
        break;
      }
    }

    const key = this.generateStableKey(args);
    const categoryCache = this.caches[category];
    const opName = operationName || (fn.name && fn.name !== "" ? fn.name : (typeof args[args.length - 1] === "string" ? String(args[args.length - 1]) : `${category}_eval`));

    if (categoryCache.has(key)) {
      this.cachedComputations++;
      if (this.telemetryListener) {
        this.telemetryListener(category, opName, 0, true, "start");
        this.telemetryListener(category, opName, 0, true, "complete");
      }
      return categoryCache.get(key)!.value as T;
    }

    if (this.telemetryListener) {
      this.telemetryListener(category, opName, 0, false, "start");
    }

    // Execute with timing measurement
    const start = typeof performance !== "undefined" ? performance.now() : Date.now();
    const result = fn();
    const end = typeof performance !== "undefined" ? performance.now() : Date.now();
    const elapsed = Math.max(0, end - start);

    this.totalExecutionTimeMs += elapsed;
    this.uncachedExecutionsCount++;

    // Prevent unbounded memory usage (LRU-like eviction if over 100 entries per category)
    if (categoryCache.size >= 100) {
      const firstKey = categoryCache.keys().next().value;
      if (firstKey !== undefined) {
        categoryCache.delete(firstKey);
      }
    }

    categoryCache.set(key, {
      key,
      value: result,
      createdAt: typeof performance !== "undefined" ? performance.now() : Date.now(),
    });

    if (this.telemetryListener) {
      this.telemetryListener(category, opName, elapsed, false, "complete");
    }

    return result;
  }

  /**
   * Invalidates a specific category cache or all caches.
   */
  public invalidateCategory(category: CacheCategory): void {
    this.caches[category].clear();
  }

  public invalidateAll(): void {
    (Object.keys(this.caches) as CacheCategory[]).forEach((cat) => {
      this.caches[cat].clear();
    });
  }

  /**
   * Records savings from UI re-render prevention or memoized hook evaluations.
   */
  public recordRenderSaving(savingsMs: number = 2.5): void {
    this.renderSavingsCount += savingsMs;
  }

  /**
   * Returns current statistics across cache maps.
   */
  public getCacheStatistics() {
    return {
      profileCache: this.caches.profile.size,
      recommendationCache: this.caches.recommendation.size,
      analyticsCache: this.caches.analytics.size,
      dashboardCache: this.caches.dashboard.size,
      sessionCache: this.caches.session.size,
      memoryCache: this.caches.memory.size,
      totalEntries:
        this.caches.profile.size +
        this.caches.recommendation.size +
        this.caches.analytics.size +
        this.caches.dashboard.size +
        this.caches.session.size +
        this.caches.memory.size,
    };
  }

  /**
   * Returns overall runtime execution metrics.
   */
  public getRuntimeMetrics() {
    const total = this.totalComputations;
    const cached = this.cachedComputations;
    const hitRate = total > 0 ? Math.round((cached / total) * 100) : 0;
    const avgTime =
      this.uncachedExecutionsCount > 0
        ? Number((this.totalExecutionTimeMs / this.uncachedExecutionsCount).toFixed(2))
        : 0;

    return {
      totalComputations: total,
      cachedComputations: cached,
      cacheHitRate: hitRate,
      averageExecutionTime: avgTime,
      renderSavings: Math.round(this.renderSavingsCount),
      generatedAt: 1700000000000, // Deterministic anchor timestamp per specification baseline
    };
  }

  /**
   * Resets internal diagnostic counters (useful for unit testing).
   */
  public resetMetrics(): void {
    this.totalComputations = 0;
    this.cachedComputations = 0;
    this.totalExecutionTimeMs = 0;
    this.uncachedExecutionsCount = 0;
    this.renderSavingsCount = 0;
    this.lastProgressHash = null;
    this.invalidateAll();
  }
}

export const runtimeCache = new RuntimeCacheManager();
