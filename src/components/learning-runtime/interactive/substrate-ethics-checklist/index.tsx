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

// The §4.1 four forbidden malpractices.
const MALPRACTICES = [
  "Catastrophising the substrate — “your karma is bad / you are spiritually doomed.”",
  "False determinism — “you are destined to suffer in [domain].”",
  "Unverifiable past-life claims — “in a past life you did X, so now…”",
  "Manipulation — using the D60’s gravity to extract emotion or money.",
];

// §6 scenarios: the forbidden framing vs the honest, empowerment-centred response.
const SCENARIOS = [
  {
    q: "The D60 shows a challenging karmic substrate.",
    bad: "“Your karma is bad — you are doomed in this area.”",
    good: "“This substrate suggests focusing conscious effort and practice on this growth-area” — weighed with the whole chart. Substrate → agency, never doom.",
  },
  {
    q: "The client asks: “What did I do in a past life to deserve this?”",
    bad: "Asserting unverifiable past-life specifics (“in a past life you did X…”).",
    good: "Decline the unprovable past-life claim; redirect to what can be worked with now — sādhanā, remedies, conscious choices.",
  },
  {
    q: "The D60’s gravity could frighten a client into more sessions or payment.",
    bad: "Using fear to extract emotion or money.",
    good: "Never. The reading must empower, not extract — the D60’s power obliges restraint, not exploitation.",
  },
];

export function SubstrateEthicsChecklist() {
  const [idx, setIdx] = useState(0);
  const s = SCENARIOS[idx];

  return (
    <div data-interactive="substrate-ethics-checklist" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>D60 substrate — honest handling</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>Substrate is a ground, never a sentence</h2>
        <p style={{ margin: "0 0 0.5rem", color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase" }}>The four forbidden malpractices</p>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
          {MALPRACTICES.map((m, i) => <li key={i} style={{ marginBottom: "0.2rem" }}>{m}</li>)}
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
          <div style={{ color: RED, fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase", marginBottom: "0.2rem" }}>✗ Forbidden</div>
          <div style={{ color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>{s.bad}</div>
        </div>
        <div style={{ border: `1px solid ${GREEN}`, borderRadius: 8, background: `${GREEN}10`, padding: "0.6rem 0.7rem" }}>
          <div style={{ color: GREEN, fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase", marginBottom: "0.2rem" }}>✓ Honest framing</div>
          <div style={{ color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>{s.good}</div>
        </div>
        <p style={{ margin: "0.7rem 0 0", color: INK_MUTED, fontSize: "0.78rem", lineHeight: 1.5 }}>
          <strong>The empowerment narrative is mandatory:</strong> every D60 reading must leave the person with agency and a path — modifiable by sādhanā (karma, bhakti, jñāna, yoga) and remedies — not a sentence. The substrate is starting-conditions: it conditions probability, it does not fix the outcome.
        </p>
      </section>
    </div>
  );
}
