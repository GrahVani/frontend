/**
 * Grahvani Learning Runtime — AI Tutor Runtime Recovery Manager (runtime-recovery-manager.ts)
 *
 * Centralized fault-tolerance manager handling execution wrapping, failure detection,
 * retry strategies, cache invalidation, and fallback propagation.
 */

import {
  RuntimeFailure,
  RecoveryAction,
  RecoveryReport,
  detectRuntimeFailures,
  generateRecoveryPlan,
  executeRecoverySimulation
} from "./recovery-engine";
import { runtimeCache } from "./cache";

class RuntimeRecoveryManager {
  private failures: RuntimeFailure[] = [];
  private actions: RecoveryAction[] = [];
  private readonly maxBuffer = 50;
  
  public getFailures(): RuntimeFailure[] {
    return [...this.failures].reverse();
  }

  public getActions(): RecoveryAction[] {
    return [...this.actions].reverse();
  }

  public getRecoveryReport(): RecoveryReport {
    return executeRecoverySimulation(this.failures, this.actions);
  }

  private recordFailureAndAction(failure: RuntimeFailure, action: RecoveryAction) {
    this.failures.push(failure);
    this.actions.push(action);
    if (this.failures.length > this.maxBuffer) {
      this.failures.shift();
      this.actions.shift();
    }
  }

  /**
   * Safely executes an engine function.
   * If it throws an error, detects the failure, applies the optimal recovery strategy,
   * and guarantees a deterministic return (via retry or fallback).
   */
  public executeWithRecovery<T>(
    engineName: string,
    fallbackFactory: () => T,
    computeFn: () => T
  ): T {
    try {
      return computeFn();
    } catch (err: any) {
      const detectedFailures = detectRuntimeFailures([err instanceof Error ? err : new Error(String(err))], engineName);
      const failure = detectedFailures[0];
      const plan = generateRecoveryPlan([failure]);
      const action = plan[0];
      
      this.recordFailureAndAction(failure, action);

      if (action.strategy === "retry") {
        try {
          return computeFn(); // Synchronous retry
        } catch (retryErr) {
          // If retry fails, degrade to fallback
          const secondaryFailure = detectRuntimeFailures([retryErr instanceof Error ? retryErr : new Error(String(retryErr))], `${engineName}_retry`)[0];
          this.recordFailureAndAction(secondaryFailure, {
            id: `action_${secondaryFailure.id}_fallback`,
            strategy: "fallback",
            description: "Retry failed. Degraded to deterministic fallback.",
            successProbability: 100
          });
          return fallbackFactory();
        }
      } else if (action.strategy === "invalidate_cache") {
        try {
          runtimeCache.invalidateAll(); // Clear potentially corrupted cache
          return computeFn(); // Recompute
        } catch (recomputeErr) {
          return fallbackFactory();
        }
      } else {
        // "fallback", "skip_engine", or unrecoverable
        return fallbackFactory();
      }
    }
  }

  public clearRecoveryHistory(): void {
    this.failures = [];
    this.actions = [];
  }
}

export const recoveryManager = new RuntimeRecoveryManager();
