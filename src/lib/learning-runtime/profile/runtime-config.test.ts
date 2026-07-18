import { describe, it, expect } from "vitest";
import {
  getDefaultRuntimeConfiguration,
  createRuntimePreset,
  mergeRuntimeConfiguration,
  RUNTIME_PRESETS,
  getActiveRuntimeConfiguration,
  setActiveRuntimeConfiguration,
  getActivePresetId,
  setActivePresetId
} from "./runtime-config";

describe("Runtime Configuration Engine", () => {
  it("generates correct default configuration with all engines enabled", () => {
    const config = getDefaultRuntimeConfiguration();
    expect(config.profile).toBe(true);
    expect(config.recovery).toBe(true);
    expect(config.telemetry).toBe(true);
  });

  it("creates custom runtime presets correctly", () => {
    const custom = createRuntimePreset("custom-id", "Custom Name", "Description", {
      profile: false,
      analytics: false,
    });

    expect(custom.id).toBe("custom-id");
    expect(custom.name).toBe("Custom Name");
    expect(custom.configuration.profile).toBe(false);
    expect(custom.configuration.analytics).toBe(false);
    expect(custom.configuration.recovery).toBe(true); // default remains true
  });

  it("merges configurations correctly", () => {
    const base = getDefaultRuntimeConfiguration();
    const merged = mergeRuntimeConfiguration(base, { profile: false });
    expect(merged.profile).toBe(false);
    expect(merged.recovery).toBe(true);
  });

  it("allows setting and getting active preset and configuration", () => {
    setActivePresetId("minimal");
    expect(getActivePresetId()).toBe("minimal");
    expect(getActiveRuntimeConfiguration().memory).toBe(false);

    setActivePresetId("development");
    expect(getActivePresetId()).toBe("development");
    expect(getActiveRuntimeConfiguration().diagnostics).toBe(true);
  });
});
