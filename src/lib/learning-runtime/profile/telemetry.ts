/**
 * Grahvani Learning Runtime — Runtime Telemetry Layer (telemetry.ts)
 *
 * Lightweight, deterministic, in-memory-only telemetry management.
 * Maintains a high-performance circular event buffer and stores runtime traces without
 * initiating any network requests or external I/O.
 */

import { createRuntimeEvent, RuntimeEvent, RuntimeTrace } from "./observability-engine";
import { runtimeCache } from "./cache";

export class RuntimeTelemetryManager {
  private events: RuntimeEvent[] = [];
  private traces: RuntimeTrace[] = [];
  private maxEvents: number;
  private maxTraces: number;

  constructor(maxEvents: number = 300, maxTraces: number = 50) {
    this.maxEvents = maxEvents;
    this.maxTraces = maxTraces;
  }

  /**
   * Appends a new runtime event to the circular buffer.
   */
  public recordEvent(event: RuntimeEvent): void {
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }

  /**
   * Retrieves recorded runtime events, optionally filtered by category and limited.
   */
  public getEvents(limit?: number, category?: RuntimeEvent["category"]): RuntimeEvent[] {
    let filtered = this.events;
    if (category) {
      filtered = filtered.filter((e) => e.category === category);
    }
    const result = [...filtered].reverse();
    return limit && limit > 0 ? result.slice(0, limit) : result;
  }

  /**
   * Clears all stored runtime events and traces.
   */
  public clearEvents(): void {
    this.events = [];
    this.traces = [];
  }

  /**
   * Records a complete runtime trace.
   */
  public recordTrace(trace: RuntimeTrace): void {
    this.traces.push(trace);
    if (this.traces.length > this.maxTraces) {
      this.traces.shift();
    }
  }

  /**
   * Returns the most recently recorded runtime trace, or null if none recorded.
   */
  public getLatestTrace(): RuntimeTrace | null {
    if (this.traces.length === 0) return null;
    return this.traces[this.traces.length - 1];
  }

  /**
   * Returns recorded runtime traces up to optional limit.
   */
  public getTraces(limit?: number): RuntimeTrace[] {
    const result = [...this.traces].reverse();
    return limit && limit > 0 ? result.slice(0, limit) : result;
  }

  /**
   * Configures the maximum number of events retained in the circular buffer.
   */
  public setMaxEvents(maxEvents: number): void {
    this.maxEvents = maxEvents;
    while (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }
}

export const runtimeTelemetry = new RuntimeTelemetryManager();

// Auto-connect telemetry to the runtime cache layer
runtimeCache.setTelemetryListener((category, operation, durationMs, cached, eventType) => {
  const opName = eventType === "start" ? `${operation}_start` : `${operation}_complete`;
  const evt = createRuntimeEvent(
    category as RuntimeEvent["category"],
    opName,
    durationMs,
    cached,
    true,
    eventType === "start" ? "Execution started" : cached ? "Cache hit" : "Execution completed"
  );
  runtimeTelemetry.recordEvent(evt);
});

/**
 * Top-level utility functions wrapping the singleton instance.
 */
export function recordRuntimeEvent(event: RuntimeEvent): void {
  runtimeTelemetry.recordEvent(event);
}

export function getRuntimeEvents(limit?: number, category?: RuntimeEvent["category"]): RuntimeEvent[] {
  return runtimeTelemetry.getEvents(limit, category);
}

export function clearRuntimeEvents(): void {
  runtimeTelemetry.clearEvents();
}

export function recordRuntimeTrace(trace: RuntimeTrace): void {
  runtimeTelemetry.recordTrace(trace);
}

export function getLatestTrace(): RuntimeTrace | null {
  return runtimeTelemetry.getLatestTrace();
}

export function getTraces(limit?: number): RuntimeTrace[] {
  return runtimeTelemetry.getTraces(limit);
}
