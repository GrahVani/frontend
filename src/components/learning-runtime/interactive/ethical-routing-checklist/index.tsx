"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A8412B";

// The §4.1 four hard boundaries.
const BOUNDARIES = [
  "Do not diagnose a specific medical condition — astrology is not a medical licence.",
  "Do not catastrophise — never “you will get [disease].”",
  "Do not read mortality from the D30 alone — longevity is a separate, careful, multi-factor analysis.",
  "Do not bypass or delay medical care — a reading never substitutes for a doctor.",
];

// §4.3 scenarios: the unsafe framing vs the honest, vigilance-framed + referral response.
const SCENARIOS = [
  {
    q: "The D30 shows a vulnerability in the health area.",
    bad: "“You will develop [a named disease].”",
    good: "“This area may benefit from extra care and routine check-ups, especially during [period] — and it’s worth raising with your doctor.”",
  },
  {
    q: "The client asks: “When will I die?”",
    bad: "Naming a time from the D30 (or any single varga).",
    good: "Decline constructively: longevity is a careful multi-factor question no single chart settles; redirect to what supports wellbeing now.",
  },
  {
    q: "A malefic sits in a difficult D30 segment.",
    bad: "“This guarantees illness.”",
    good: "Frame as a tendency that needs daśā-activation and a transit-trigger to manifest at all — most stay dormant; weigh the whole chart (a strong D1/D9 carries it).",
  },
];

export function EthicalRoutingChecklist() {
  const [idx, setIdx] = useState(0);
  const s = SCENARIOS[idx];

  return (
    <div data-interactive="ethical-routing-checklist" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Ethical routing — D30 health signals</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>From signal to responsible statement</h2>
        <p style={{ margin: "0 0 0.5rem", color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase" }}>The four hard boundaries</p>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
          {BOUNDARIES.map((b, i) => <li key={i} style={{ marginBottom: "0.2rem" }}>{b}</li>)}
        </ul>
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.7rem" }}>
          {SCENARIOS.map((sc, i) => (
            <button key={i} type="button" aria-pressed={idx === i} onClick={() => setIdx(i)}
              style={{ border: `1px solid ${idx === i ? GOLD : HAIRLINE}`, borderRadius: 8, background: idx === i ? GOLD : "transparent", color: idx === i ? "#fff" : INK_SECONDARY, padding: "0.3rem 0.6rem", fontWeight: 800, fontSize: "0.78rem", cursor: "pointer" }}>
              Scenario {i + 1}
            </button>
          ))}
        </div>
        <p style={{ margin: "0 0 0.6rem", color: INK_PRIMARY, fontWeight: 800 }}>{s.q}</p>
        <div style={{ border: `1px solid ${RED}`, borderRadius: 8, background: `${RED}10`, padding: "0.6rem 0.7rem", marginBottom: "0.5rem" }}>
          <div style={{ color: RED, fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase", marginBottom: "0.2rem" }}>✗ Never</div>
          <div style={{ color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>{s.bad}</div>
        </div>
        <div style={{ border: `1px solid ${GREEN}`, borderRadius: 8, background: `${GREEN}10`, padding: "0.6rem 0.7rem" }}>
          <div style={{ color: GREEN, fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase", marginBottom: "0.2rem" }}>✓ Honest framing</div>
          <div style={{ color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>{s.good}</div>
        </div>
        <p style={{ margin: "0.7rem 0 0", color: INK_MUTED, fontSize: "0.78rem", lineHeight: 1.5 }}>
          <strong>Triple-care standard:</strong> care in the <em>claim</em> (vigilance, not prediction), a <em>disclaimer</em> of the method&apos;s limits, and a <em>referral</em> to the appropriate medical professional. A D30 tendency is a possibility weighted by timing and the whole chart — never a fixed outcome.
        </p>
      </section>
    </div>
  );
}
