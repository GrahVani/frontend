"use client";

import React from "react";

/**
 * Regional Calendar Explorer
 *
 * Placeholder implementation (spec-pending).
 * Full implementation per `interactive-specs/regional-calendar-explorer.md`.
 */
export function RegionalCalendarExplorer() {
  return (
    <div className="p-6 rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5">
      <h3
        className="mb-2"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "22px",
          fontWeight: 500,
          color: "var(--gl-gold-accent)",
        }}
      >
        Regional Calendar Explorer
      </h3>
      <p
        className="text-sm mb-4"
        style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.55 }}
      >
        Side-by-side rendering of the major Indian calendar systems with date-input scrubber,
        regional map mode, and festival cross-correlation.
      </p>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2 py-1 rounded bg-amber-500/10 text-amber-400">
            E-Comparator
          </span>
          <span className="text-xs text-[var(--gl-ink-muted)]">
            Spec status: pending implementation
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { name: "Vikrama", start: "Caitra Śukla" },
            { name: "Śaka", start: "Caitra Śukla" },
            { name: "Kollam", start: "Siṁha Saṅkrānti" },
            { name: "Tamil", start: "Meṣa Saṅkrānti" },
            { name: "Bengali", start: "Meṣa Saṅkrānti" },
            { name: "Assamese", start: "Meṣa Saṅkrānti" },
            { name: "Odia", start: "Meṣa Saṅkrānti" },
            { name: "Gregorian", start: "1 January" },
          ].map((cal) => (
            <div key={cal.name} className="p-2 rounded bg-black/20 text-center">
              <div className="text-xs font-medium text-[var(--gl-ink-primary)]">
                {cal.name}
              </div>
              <div className="text-[10px] text-[var(--gl-ink-muted)]">
                {cal.start}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
