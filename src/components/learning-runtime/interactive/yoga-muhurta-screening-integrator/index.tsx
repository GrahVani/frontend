"use client";

import React, { useState } from "react";

const EVENTS = [
  { name: "Marriage", tithi: ["Nandā", "Bhadrā", "Jayā"], vara: ["Thursday", "Friday", "Monday"], nakshatra: ["Rohiṇī", "Mṛgaśīrṣa", "Maghā", "Uttaraphālgunī", "Hasta", "Svātī", "Anurādhā", "Mūla", "Uttarāṣāḍhā", "Śravaṇa", "Śatabhiṣaj", "Uttarabhādrapadā", "Revatī"], yogaAvoid: ["Vyatīpāta", "Vaidhṛti", "Parigha", "Śūla", "Gaṇḍa", "Atigaṇḍa"], karanaAvoid: ["Bhadra"] },
  { name: "Travel", tithi: ["Nandā", "Bhadrā"], vara: ["Sunday", "Wednesday", "Friday"], nakshatra: ["Aśvinī", "Punarvasū", "Puṣya", "Hasta", "Svātī", "Anurādhā", "Śravaṇa", "Dhaniṣṭhā", "Śatabhiṣaj", "Revatī"], yogaAvoid: ["Vyatīpāta", "Vaidhṛti", "Gaṇḍa"], karanaAvoid: ["Bhadra"] },
  { name: "Business Opening", tithi: ["Nandā", "Bhadrā"], vara: ["Wednesday", "Thursday", "Friday"], nakshatra: ["Rohiṇī", "Mṛgaśīrṣa", "Punarvasū", "Puṣya", "Uttaraphālgunī", "Hasta", "Anurādhā", "Uttarāṣāḍhā", "Śravaṇa"], yogaAvoid: ["Vyatīpāta", "Vaidhṛti", "Parigha", "Śūla"], karanaAvoid: ["Bhadra"] },
  { name: "Construction", tithi: ["Bhadrā"], vara: ["Monday", "Thursday"], nakshatra: ["Rohiṇī", "Puṣya", "Uttaraphālgunī", "Uttarāṣāḍhā", "Uttarabhādrapadā"], yogaAvoid: ["Vyatīpāta", "Vaidhṛti", "Parigha", "Śūla", "Gaṇḍa"], karanaAvoid: ["Bhadra"] },
  { name: "Medical", tithi: ["Jayā", "Nandā"], vara: ["Tuesday", "Wednesday"], nakshatra: ["Aśvinī", "Mṛgaśīrṣa", "Ārdrā", "Punarvasū", "Aśleṣā", "Jyeṣṭhā"], yogaAvoid: ["Vyatīpāta", "Vaidhṛti", "Śūla"], karanaAvoid: ["Bhadra"] },
  { name: "Spiritual", tithi: ["Nandā", "Pūrṇā"], vara: ["Thursday", "Monday"], nakshatra: ["Rohiṇī", "Mṛgaśīrṣa", "Punarvasū", "Puṣya", "Hasta", "Anurādhā", "Śravaṇa", "Revatī"], yogaAvoid: ["Vyatīpāta", "Vaidhṛti"], karanaAvoid: ["Bhadra"] },
];

export function YogaMuhurtaScreeningIntegrator() {
  const [eventIdx, setEventIdx] = useState(0);
  const [checks, setChecks] = useState({ tithi: false, vara: false, nakshatra: false, yoga: false, karana: false });

  const evt = EVENTS[eventIdx];

  const allChecked = Object.values(checks).every(Boolean);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {EVENTS.map((e, i) => (
          <button key={i} onClick={() => { setEventIdx(i); setChecks({ tithi: false, vara: false, nakshatra: false, yoga: false, karana: false }); }}
            className="p-3 rounded text-left text-sm transition-all"
            style={{
              background: eventIdx === i ? "rgba(201,162,74,0.12)" : "var(--gl-surface-card)",
              border: `1px solid ${eventIdx === i ? "var(--gl-gold-accent)" : "var(--gl-border-subtle)"}`,
            }}>
            <div className="font-medium" style={{ color: eventIdx === i ? "var(--gl-gold-accent)" : "var(--gl-ink-primary)" }}>{e.name}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {[
          { key: "tithi", label: "Tithi", items: evt.tithi, color: "#6ab4ff" },
          { key: "vara", label: "Vāra", items: evt.vara, color: "#daa520" },
          { key: "nakshatra", label: "Nakṣatra", items: evt.nakshatra.slice(0, 5), color: "#c49af0" },
          { key: "yoga", label: "Yoga (avoid)", items: evt.yogaAvoid, color: "#e08080" },
          { key: "karana", label: "Karaṇa (avoid)", items: evt.karanaAvoid, color: "#e08080" },
        ].map((c) => (
          <div key={c.key} className="p-3 rounded-lg" style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-border-subtle)" }}>
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={checks[c.key as keyof typeof checks]} onChange={() => setChecks((p) => ({ ...p, [c.key]: !p[c.key as keyof typeof checks] }))}
                className="w-4 h-4" />
              <span className="text-sm font-semibold" style={{ color: c.color }}>{c.label}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {c.items.map((item, i) => (
                <span key={i} className="px-2 py-1 rounded text-xs" style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}33` }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="p-4 rounded-lg text-center"
        style={{
          background: allChecked ? "rgba(45,125,70,0.08)" : "rgba(0,0,0,0.1)",
          border: `1px solid ${allChecked ? "#2d7d46" : "var(--gl-border-subtle)"}`,
        }}
      >
        <div className="text-lg font-bold" style={{ color: allChecked ? "#7dd87d" : "var(--gl-ink-muted)" }}>
          {allChecked ? "✓ All 5 elements checked — proceed with confidence" : "Check all 5 elements before proceeding"}
        </div>
        {!allChecked && (
          <div className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
            Complete muhūrta requires verifying tithi, vāra, nakṣatra, yoga, and karaṇa.
          </div>
        )}
      </div>
    </div>
  );
}
