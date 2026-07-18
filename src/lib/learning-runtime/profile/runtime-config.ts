/**
 * Grahvani Learning Runtime — Runtime Configuration Engine (runtime-config.ts)
 */

export interface RuntimeConfiguration {
  profile: boolean;
  memory: boolean;
  recommendation: boolean;
  analytics: boolean;
  dashboard: boolean;
  coaching: boolean;
  studyPlanner: boolean;
  mentor: boolean;
  sessionIntelligence: boolean;
  performance: boolean;
  observability: boolean;
  recovery: boolean;
  telemetry: boolean;
  diagnostics: boolean;
  roadmap: boolean;
  predictions: boolean;
  achievements: boolean;
  interventions: boolean;
  runtimeOptimization: boolean;
}

export interface RuntimePreset {
  id: string;
  name: string;
  configuration: RuntimeConfiguration;
  description: string;
}

export interface FeatureFlag {
  id: string;
  enabled: boolean;
  description: string;
}

export function getDefaultRuntimeConfiguration(): RuntimeConfiguration {
  return {
    profile: true,
    memory: true,
    recommendation: true,
    analytics: true,
    dashboard: true,
    coaching: true,
    studyPlanner: true,
    mentor: true,
    sessionIntelligence: true,
    performance: true,
    observability: true,
    recovery: true,
    telemetry: true,
    diagnostics: true,
    roadmap: true,
    predictions: true,
    achievements: true,
    interventions: true,
    runtimeOptimization: true,
  };
}

export const RUNTIME_PRESETS: RuntimePreset[] = [
  {
    id: "production",
    name: "Production",
    description: "Standard production configuration focused on core features and recovery.",
    configuration: {
      profile: true,
      memory: true,
      recommendation: true,
      analytics: true,
      dashboard: true,
      coaching: true,
      studyPlanner: true,
      mentor: true,
      sessionIntelligence: true,
      performance: true,
      observability: true,
      recovery: true,
      telemetry: true,
      diagnostics: false,
      roadmap: true,
      predictions: true,
      achievements: true,
      interventions: true,
      runtimeOptimization: true,
    },
  },
  {
    id: "development",
    name: "Development",
    description: "Full configuration with active diagnostics and telemetry enabled.",
    configuration: {
      profile: true,
      memory: true,
      recommendation: true,
      analytics: true,
      dashboard: true,
      coaching: true,
      studyPlanner: true,
      mentor: true,
      sessionIntelligence: true,
      performance: true,
      observability: true,
      recovery: true,
      telemetry: true,
      diagnostics: true,
      roadmap: true,
      predictions: true,
      achievements: true,
      interventions: true,
      runtimeOptimization: true,
    },
  },
  {
    id: "diagnostics",
    name: "Diagnostics",
    description: "Diagnostics mode with focus on debugging, logging, and recovery systems.",
    configuration: {
      profile: false,
      memory: false,
      recommendation: false,
      analytics: false,
      dashboard: false,
      coaching: false,
      studyPlanner: false,
      mentor: false,
      sessionIntelligence: false,
      performance: true,
      observability: true,
      recovery: true,
      telemetry: true,
      diagnostics: true,
      roadmap: false,
      predictions: false,
      achievements: false,
      interventions: false,
      runtimeOptimization: true,
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Absolute minimum system footprint, executing only profile and recovery.",
    configuration: {
      profile: true,
      memory: false,
      recommendation: false,
      analytics: false,
      dashboard: false,
      coaching: false,
      studyPlanner: false,
      mentor: false,
      sessionIntelligence: false,
      performance: false,
      observability: false,
      recovery: true,
      telemetry: false,
      diagnostics: false,
      roadmap: false,
      predictions: false,
      achievements: false,
      interventions: false,
      runtimeOptimization: false,
    },
  },
  {
    id: "full_mentor",
    name: "Full Mentor",
    description: "Unleash mentoring capabilities, dashboard, and custom coach interventions.",
    configuration: {
      profile: true,
      memory: true,
      recommendation: true,
      analytics: true,
      dashboard: true,
      coaching: true,
      studyPlanner: true,
      mentor: true,
      sessionIntelligence: true,
      performance: true,
      observability: true,
      recovery: true,
      telemetry: true,
      diagnostics: true,
      roadmap: true,
      predictions: true,
      achievements: true,
      interventions: true,
      runtimeOptimization: true,
    },
  },
];

let activeConfiguration: RuntimeConfiguration = { ...RUNTIME_PRESETS.find(p => p.id === "development")!.configuration };
let activePresetId = "development";

export function getActiveRuntimeConfiguration(): RuntimeConfiguration {
  return activeConfiguration;
}

export function setActiveRuntimeConfiguration(config: RuntimeConfiguration): void {
  activeConfiguration = config;
}

export function getActivePresetId(): string {
  return activePresetId;
}

export function setActivePresetId(presetId: string): void {
  activePresetId = presetId;
  const preset = RUNTIME_PRESETS.find(p => p.id === presetId);
  if (preset) {
    activeConfiguration = { ...preset.configuration };
  }
}

export function createRuntimePreset(id: string, name: string, description: string, configuration: Partial<RuntimeConfiguration>): RuntimePreset {
  return {
    id,
    name,
    description,
    configuration: {
      ...getDefaultRuntimeConfiguration(),
      ...configuration,
    },
  };
}

export function mergeRuntimeConfiguration(base: RuntimeConfiguration, overrides: Partial<RuntimeConfiguration>): RuntimeConfiguration {
  return {
    ...base,
    ...overrides,
  };
}
