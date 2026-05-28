"use client";

import React from "react";

/**
 * Samvat Converter — Vikrama ↔ Śaka ↔ CE
 *
 * Placeholder implementation (spec-pending).
 * Full implementation per `interactive-specs/samvat-converter-vikrama-shaka.md`.
 */
export function SamvatConverterVikramaShaka() {
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
        Samvat Converter — Vikrama ↔ Śaka ↔ CE
      </h3>
      <p
        className="text-sm mb-4"
        style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.55 }}
      >
        Interactive year-conversion calculator with boundary detection, Caitra-ādi vs
        Kārtika-ādi toggle, modern-government vs traditional Śaka toggle, and worked-example
        library.
      </p>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2 py-1 rounded bg-amber-500/10 text-amber-400">
            C-Calculator
          </span>
          <span className="text-xs text-[var(--gl-ink-muted)]">
            Spec status: pending implementation
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded bg-black/20">
            <div className="text-xs text-[var(--gl-ink-muted)] mb-1">CE Year</div>
            <div className="text-lg font-medium text-[var(--gl-gold-accent)]">2026</div>
          </div>
          <div className="p-3 rounded bg-black/20">
            <div className="text-xs text-[var(--gl-ink-muted)] mb-1">Vikrama</div>
            <div className="text-lg font-medium text-[var(--gl-gold-accent)]">2083</div>
          </div>
          <div className="p-3 rounded bg-black/20">
            <div className="text-xs text-[var(--gl-ink-muted)] mb-1">Śaka</div>
            <div className="text-lg font-medium text-[var(--gl-gold-accent)]">1948</div>
          </div>
        </div>
        <p className="text-xs text-[var(--gl-ink-muted)] italic">
          Formula: Vikrama = CE + 57 · Śaka = CE − 78 · Offset = 135
        </p>
      </div>
    </div>
  );
}
