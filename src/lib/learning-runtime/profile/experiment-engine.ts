/**
 * Grahvani Learning Runtime — Experiment Engine (experiment-engine.ts)
 */

export interface RuntimeExperiment {
  id: string;
  feature: string;
  variant: string;
  enabled: boolean;
}

export interface ExperimentResult {
  experimentId: string;
  activeVariant: string;
  enabled: boolean;
}

const experiments: Record<string, RuntimeExperiment> = {
  "prompt-coaching-style": {
    id: "prompt-coaching-style",
    feature: "coaching-style",
    variant: "socratic",
    enabled: true,
  },
  "study-planner-algorithm": {
    id: "study-planner-algorithm",
    feature: "study-algorithm",
    variant: "spaced-repetition",
    enabled: false,
  },
};

export function registerExperiment(experiment: RuntimeExperiment): void {
  experiments[experiment.id] = experiment;
}

export function activateExperiment(experimentId: string, variant: string): void {
  if (experiments[experimentId]) {
    experiments[experimentId].variant = variant;
    experiments[experimentId].enabled = true;
  }
}

export function evaluateExperiment(experimentId: string): ExperimentResult {
  const exp = experiments[experimentId];
  if (!exp) {
    return {
      experimentId,
      activeVariant: "control",
      enabled: false,
    };
  }
  return {
    experimentId: exp.id,
    activeVariant: exp.variant,
    enabled: exp.enabled,
  };
}

export function getAllExperiments(): RuntimeExperiment[] {
  return Object.values(experiments);
}
