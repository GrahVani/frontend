"use client";

import React, { useState } from "react";

const INAUSPICIOUS = [
  { name: "Vyatīpāta", dev: "व्यतीपात", severity: "Highest", avoid: ["All new beginnings", "Travel", "Marriage", "Construction", "Important decisions"], source: "Classical muhūrta texts — destroys results of activities" },
  { name: "Vaidhṛti", dev: "वैधृति", severity: "Highest", avoid: ["All new beginnings", "Long journeys", "Business ventures", "Medical procedures"], source: "Classical muhūrta texts — reverses fortune" },
  { name: "Parigha", dev: "परिघ", severity: "High", avoid: ["New ventures", "Legal matters", "Debates", "Travel"], source: "Creates obstructions and enclosures" },
  { name: "Śūla", dev: "शूल", severity: "High", avoid: ["Medical procedures", "Surgery", "Conflict situations", "New beginnings"], source: "Brings pain and affliction" },
  { name: "Gaṇḍa", dev: "गण्ड", severity: "High", avoid: ["New beginnings", "Important decisions", "Travel", "Marriage"], source: "Brings obstacles and danger" },
  { name: "Atigaṇḍa", dev: "अतिगण्ड", severity: "Medium", avoid: ["New ventures", "Travel", "Disputes"], source: "Brings accidents and conflicts" },
];

export function InauspiciousYogaAvoidanceCalculator() {
  const [selected, setSelected] = useState(0);
  const yoga = INAUSPICIOUS[selected];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {INAUSPICIOUS.map((y, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className="p-3 rounded text-left text-sm transition-all"
            style={{
              background: selected === i ? "rgba(168,50,50,0.15)" : "var(--gl-surface-card)",
              border: `1px solid ${selected === i ? "#a83232" : "var(--gl-border-subtle)"}`,
            }}>
            <div className="font-semibold" style={{ color: selected === i ? "#e08080" : "var(--gl-ink-primary)" }}>{y.name}</div>
            <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{y.dev}</div>
          </button>
        ))}
      </div>

      <div className="p-5 rounded-lg" style={{ background: "rgba(168,50,50,0.06)", border: "1px solid #a83232" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl font-bold" style={{ color: "#e08080" }}>{yoga.dev}</div>
          <div>
            <h3 className="text-xl font-bold" style={{ color: "#e08080" }}>{yoga.name}</h3>
            <div className="text-sm" style={{ color: "#d4a0a0" }}>Severity: {yoga.severity}</div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2" style={{ color: "#e08080" }}>Activities to Avoid</h4>
          <div className="flex flex-wrap gap-2">
            {yoga.avoid.map((a, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs" style={{ background: "rgba(168,50,50,0.15)", color: "#e08080", border: "1px solid #a83232" }}>{a}</span>
            ))}
          </div>
        </div>

        <div className="text-sm" style={{ color: "#d4a0a0" }}>
          <strong>Classical source:</strong> {yoga.source}
        </div>
      </div>

      <div className="p-3 rounded text-sm" style={{ background: "rgba(0,0,0,0.2)", color: "var(--gl-ink-secondary)" }}>
        <strong>Mitigation:</strong> If you must act during an inauspicious yoga, classical texts recommend 
        additional protective measures: strengthening the lagna lord, choosing a strong nakṣatra, 
        and performing appropriate mantras or pūjās. When possible, postpone important activities to a better yoga.
      </div>
    </div>
  );
}
