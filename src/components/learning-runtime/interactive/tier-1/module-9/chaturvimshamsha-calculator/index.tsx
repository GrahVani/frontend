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
const PART = 30 / 24; // 1°15′
// D24: odd signs (sign-number odd → 0-indexed even) start from Siṁha (Leo, idx 4, Sun's house);
// even signs start from Karka (Cancer, idx 3, Moon's house). Then 24 sequential.

export function ChaturvimshamshaCalculator() {
  const [sign, setSign] = useState(0); // Meṣa (odd)
  const [deg, setDeg] = useState(4);

  const oddSign = sign % 2 === 0;
  const start = oddSign ? 4 : 3;
  const part = Math.min(Math.floor(deg / PART), 23); // 0..23 → 1st..24th
  const dest = (start + part) % 12;
  const fmt = (d: number) => `${Math.floor(d)}°${Math.round((d % 1) * 60).toString().padStart(2, "0")}′`;

  return (
    <div data-interactive="chaturvimshamsha-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>D24 Chaturviṁśāṁśa (Siddhāṁśa) calculator</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>Where does the learning-part land?</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Each sign splits into twenty-four parts of 1°15′. The count starts from Siṁha (Leo) for ODD signs and from Karka (Cancer) for EVEN signs — the houses of the Sun and Moon, the two lights of learning.</p>
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
            { k: "Part", v: `${part + 1} of 24 (${fmt(part * PART)}–${fmt((part + 1) * PART)})` },
            { k: "Parity / start", v: `${oddSign ? "odd" : "even"} → ${SIGNS[start]}` },
          ].map((x) => (
            <div key={x.k} style={{ flex: "1 1 8rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.45rem 0.6rem" }}>
              <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase" }}>{x.k}</div>
              <div style={{ color: INK_PRIMARY, fontSize: "0.9rem", fontWeight: 800 }}>{x.v}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem", color: GREEN }}>→ D24 sign: {SIGNS[dest]}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          {deg.toFixed(1)}° {SIGNS[sign]} is {oddSign ? "odd" : "even"}, so the count begins at {SIGNS[start]}; this is the {part + 1}{["st", "nd", "rd"][part] || "th"} part → the planet lands in <strong style={{ color: GREEN }}>{SIGNS[dest]}</strong>.
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>D24 (Siddhāṁśa) magnifies <strong>education, learning and scholarly attainment</strong> — read alongside the D1.</p>
      </section>
    </div>
  );
}
