"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const PART = 3; // 30 / 10

export function DashamshaCalculator() {
  const [sign, setSign] = useState(0); // Meṣa (odd)
  const [deg, setDeg] = useState(2);

  const oddSign = sign % 2 === 0; // sign-number odd
  const part = Math.min(Math.floor(deg / PART), 9); // 0..9 → 1st..10th
  // Odd sign: count from the sign itself. Even sign: count from the 9th sign from it.
  const dest = (sign + (oddSign ? 0 : 8) + part) % 12;

  return (
    <div data-interactive="dashamsha-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>D10 Daśāṁśa calculator</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>Where does the career-part land?</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Each sign splits into ten parts of 3°. From an ODD sign the ten count forward from the sign itself; from an EVEN sign they count forward from the 9th sign from it.</p>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
          <select value={sign} onChange={(e) => setSign(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.35rem 0.5rem", fontWeight: 700 }}>
            {SIGNS.map((s, i) => <option key={s} value={i}>{s} ({i % 2 === 0 ? "odd" : "even"})</option>)}
          </select>
          <input type="range" min={0} max={29.9} step={0.1} value={deg} onChange={(e) => setDeg(Number(e.target.value))} style={{ accentColor: GOLD, flex: 1, minWidth: "8rem" }} aria-label="degree in sign" />
          <strong style={{ color: GOLD }}>{deg.toFixed(1)}°</strong>
        </div>
      </section>

      <section style={{ border: `1px solid ${GREEN}`, borderRadius: 8, background: `${GREEN}10`, padding: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          {[
            { k: "Part", v: `${part + 1} of 10 (${part * PART}–${(part + 1) * PART}°)` },
            { k: "Counted from", v: oddSign ? "the sign itself (odd)" : "the 9th sign (even)" },
          ].map((x) => (
            <div key={x.k} style={{ flex: "1 1 8rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.45rem 0.6rem" }}>
              <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase" }}>{x.k}</div>
              <div style={{ color: INK_PRIMARY, fontSize: "0.9rem", fontWeight: 800 }}>{x.v}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem", color: GREEN }}>→ D10 sign: {SIGNS[dest]}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          {deg.toFixed(1)}° {SIGNS[sign]} is the {part + 1}{["st", "nd", "rd"][part] || "th"} daśāṁśa; an {oddSign ? "odd" : "even"} sign counts from {oddSign ? "itself" : "its 9th"}, so the planet lands in <strong style={{ color: GREEN }}>{SIGNS[dest]}</strong>.
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>D10 magnifies <strong>career, status, profession and karma in the world</strong> (10th-house themes) — read alongside the D1.</p>
      </section>
    </div>
  );
}
