"use client";

import React, { useState } from "react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Bhadra occurs when specific karana-tithi combinations align
// Simplified: Bhadra is roughly the 2nd half of certain tithis on specific days
const BHADRA_PERIODS: Record<string, string> = {
  Sunday: "2nd half of Pratipadā / 1st half of Dvitīyā",
  Monday: "2nd half of Saptamī / 1st half of Aṣṭamī",
  Tuesday: "2nd half of Caturthī / 1st half of Pañcamī",
  Wednesday: "2nd half of Daśamī / 1st half of Ekādaśī",
  Thursday: "2nd half of Trayodaśī / 1st half of Caturdaśī",
  Friday: "2nd half of Navamī / 1st half of Daśamī",
  Saturday: "2nd half of Ṣaṣṭhī / 1st half of Saptamī",
};

export function BhadraAvoidanceIntegrator() {
  const [day, setDay] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Day of Week</label>
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((d, i) => (
            <button key={i} onClick={() => setDay(i)}
              className="p-2 rounded text-xs text-center transition-all"
              style={{
                background: day === i ? "rgba(168,50,50,0.2)" : "var(--gl-surface-card)",
                color: day === i ? "#e08080" : "var(--gl-ink-primary)",
                border: `1px solid ${day === i ? "#a83232" : "var(--gl-border-subtle)"}`,
              }}>
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-lg" style={{ background: "rgba(168,50,50,0.06)", border: "1px solid #a83232" }}>
        <h3 className="text-lg font-bold mb-2" style={{ color: "#e08080" }}>Bhadra (Viṣṭi) on {DAYS[day]}</h3>
        <div className="text-sm" style={{ color: "var(--gl-ink-primary)" }}>
          <strong>Period:</strong> {BHADRA_PERIODS[DAYS[day]]}
        </div>
        <div className="mt-3 space-y-2">
          <div className="text-sm" style={{ color: "#d4a0a0" }}>
            <strong>What to avoid during Bhadra:</strong>
          </div>
          <div className="flex flex-wrap gap-2">
            {["New ventures", "Marriage", "Travel", "Construction", "Important decisions", "Business opening", "Legal matters"].map((a, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs" style={{ background: "rgba(168,50,50,0.15)", color: "#e08080", border: "1px solid #a83232" }}>{a}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 rounded text-sm" style={{ background: "rgba(0,0,0,0.2)", color: "var(--gl-ink-secondary)" }}>
        <strong>Classical note:</strong> Bhadra (also called Viṣṭi) is considered the most inauspicious karaṇa. 
        It is associated with obstruction, delay, and difficulty. Classical texts strongly advise against 
        initiating any important activity during Bhadra karaṇa. If unavoidable, perform remedial measures 
        and choose a strong nakṣatra and vāra to compensate.
      </div>

      <button onClick={() => setShowComparison(!showComparison)}
        className="px-4 py-2 rounded text-sm transition-all"
        style={{ background: "var(--gl-surface-card)", color: "var(--gl-ink-primary)", border: "1px solid var(--gl-border-subtle)" }}>
        {showComparison ? "Hide" : "Show"} Comparison with Other Inauspicious Periods
      </button>

      {showComparison && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: "Rāhu Kālam", source: "Vāra-based", duration: "~90 min/day", severity: "High", avoid: "New beginnings, travel" },
            { name: "Vyatīpāta Yoga", source: "Yoga-based", duration: "~24 hours", severity: "Highest", avoid: "All important acts" },
            { name: "Riktā Tithi", source: "Tithi-based", duration: "~24 hours", severity: "Medium", avoid: "New ventures (contextual)" },
          ].map((p, i) => (
            <div key={i} className="p-3 rounded" style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-border-subtle)" }}>
              <div className="text-sm font-semibold" style={{ color: "var(--gl-gold-accent)" }}>{p.name}</div>
              <div className="text-xs mt-1" style={{ color: "var(--gl-ink-secondary)" }}><strong>Source:</strong> {p.source}</div>
              <div className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}><strong>Duration:</strong> {p.duration}</div>
              <div className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}><strong>Severity:</strong> {p.severity}</div>
              <div className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}><strong>Avoid:</strong> {p.avoid}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
