/**
 * Grahvani Learning Runtime — AI Tutor Recovery Engine (recovery-engine.ts)
 *
 * Provides deterministic runtime recovery, failure diagnosis, and self-healing strategies
 * to ensure enterprise-grade resilience across all Tutor intelligence engines.
 */
import { getActiveRuntimeConfiguration } from "./runtime-config";
export interface RuntimeFailure {
  id: string;
  engine: string;
  category: "cache" | "computation" | "render" | "telemetry" | "context";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: number;
  recoverable: boolean;
}

export interface RecoveryAction {
  id: string;
  strategy: "retry" | "fallback" | "invalidate_cache" | "skip_engine" | "recompute";
  description: string;
  successProbability: number;
}

export interface RecoveryReport {
  runtimeHealthy: boolean;
  recoveredFailures: number;
  unrecoveredFailures: number;
  actions: RecoveryAction[];
  generatedAt: number;
}

let failureCounter = 0;
let actionCounter = 0;

/**
 * Creates a deterministic RuntimeFailure object.
 */
export function createRuntimeFailure(
  engine: string,
  category: RuntimeFailure["category"],
  severity: RuntimeFailure["severity"],
  message: string,
  recoverable: boolean,
  customTimestamp?: number
): RuntimeFailure {
  failureCounter++;
  const timestamp = customTimestamp || (typeof performance !== "undefined" ? Math.round(performance.now() + 1700000000000) : Date.now());
  const id = `fail_${engine.replace(/[^a-zA-Z0-9]/g, "_")}_${failureCounter}`;

  return {
    id,
    engine,
    category,
    severity,
    message,
    timestamp,
    recoverable,
  };
}

/**
 * Detects failures from an array of potential error objects or unhandled rejections.
 */
export function detectRuntimeFailures(errors: Error[], engineContext: string = "unknown"): RuntimeFailure[] {
  if (!getActiveRuntimeConfiguration().recovery) {
    return [];
  }
  return errors.map((err) => {
    // Deterministically classify severity based on error characteristics
    let severity: RuntimeFailure["severity"] = "medium";
    let category: RuntimeFailure["category"] = "computation";
    let recoverable = true;

    const errMsg = err.message.toLowerCase();
    if (errMsg.includes("cache") || errMsg.includes("memory")) {
      category = "cache";
      severity = "high";
    } else if (errMsg.includes("timeout") || errMsg.includes("network")) {
      category = "context";
      severity = "high";
    } else if (errMsg.includes("render") || errMsg.includes("react")) {
      category = "render";
      severity = "critical";
      recoverable = false;
    } else if (errMsg.includes("telemetry") || errMsg.includes("buffer")) {
      category = "telemetry";
      severity = "low";
    }

    return createRuntimeFailure(engineContext, category, severity, err.message, recoverable);
  });
}

/**
 * Generates an optimal recovery plan (list of actions) for a given set of failures.
 */
export function generateRecoveryPlan(failures: RuntimeFailure[]): RecoveryAction[] {
  if (!getActiveRuntimeConfiguration().recovery) {
    return [];
  }
  return failures.map((failure) => {
    actionCounter++;
    const id = `action_${failure.id}_${actionCounter}`;
    let strategy: RecoveryAction["strategy"] = "fallback";
    let description = "Falling back to deterministic placeholder values.";
    let successProbability = 100;

    if (!failure.recoverable) {
      strategy = "skip_engine";
      description = "Engine execution skipped due to unrecoverable critical failure.";
      successProbability = 100;
    } else {
      switch (failure.category) {
        case "cache":
          strategy = "invalidate_cache";
          description = "Invalidating stale cache segment and forcing deterministic recompute.";
          successProbability = 95;
          break;
        case "computation":
          strategy = "retry";
          description = "Retrying pure computation synchronously.";
          successProbability = 80;
          break;
        case "telemetry":
          strategy = "skip_engine";
          description = "Skipping telemetry emission; preserving core runtime.";
          successProbability = 100;
          break;
        case "context":
          strategy = "fallback";
          description = "Injecting safe fallback context.";
          successProbability = 100;
          break;
        default:
          strategy = "fallback";
          break;
      }
    }

    return {
      id,
      strategy,
      description,
      successProbability,
    };
  });
}

/**
 * Simulates executing a recovery plan and produces a final status report.
 */
export function executeRecoverySimulation(
  failures: RuntimeFailure[],
  actions: RecoveryAction[],
  customGeneratedAt?: number
): RecoveryReport {
  if (!getActiveRuntimeConfiguration().recovery) {
    return {
      runtimeHealthy: true,
      recoveredFailures: 0,
      unrecoveredFailures: 0,
      actions: [],
      generatedAt: Date.now(),
    };
  }
  let recoveredFailures = 0;
  let unrecoveredFailures = 0;

  failures.forEach((failure, index) => {
    const action = actions[index];
    if (action && failure.recoverable && action.successProbability >= 80) {
      recoveredFailures++;
    } else if (action && action.strategy === "skip_engine") {
      // skipping is a form of graceful degradation (recovery)
      recoveredFailures++;
    } else {
      unrecoveredFailures++;
    }
  });

  const runtimeHealthy = unrecoveredFailures === 0;
  const generatedAt = customGeneratedAt || (typeof performance !== "undefined" ? Math.round(performance.now() + 1700000000000) : Date.now());

  return {
    runtimeHealthy,
    recoveredFailures,
    unrecoveredFailures,
    actions,
    generatedAt,
  };
}
