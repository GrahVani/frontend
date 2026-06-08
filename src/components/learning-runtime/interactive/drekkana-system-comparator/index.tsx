"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const BLUE = "#2F5A7D";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
// Parāśarī: 1st→same, 2nd→5th, 3rd→9th (offsets 0/4/8). Jaimini (per the lesson): 1st→same, 2nd→7th, 3rd→5th (0/6/4).
const PARASHARI = [0, 4, 8];
const JAIMINI = [0, 6, 4];

export function DrekkanaSystemComparator() {
  const [sign, setSign] = useState(0); // Meṣa
  const [deg, setDeg] = useState(15);

  const decanate = Math.min(Math.floor(deg / 10), 2);
  const par = (sign + PARASHARI[decanate]) % 12;
  const jai = (sign + JAIMINI[decanate]) % 12;
  const diverge = par !== jai;

  return (
    <div data-interactive="drekkana-system-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Three drekkāṇa systems</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>Same planet, different D3 — name your system</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>The same decanate maps to different signs in different schemes. Parāśarī (the Tier-1 default) sends it to a trine (1st/5th/9th); Jaimini uses 1st/7th/5th (one tradition); Somanātha runs a sequential scheme taken up beyond Tier 1.</p>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
          <select value={sign} onChange={(e) => setSign(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.35rem 0.5rem", fontWeight: 700 }}>
            {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
          </select>
          <input type="range" min={0} max={29.9} step={0.1} value={deg} onChange={(e) => setDeg(Number(e.target.value))} style={{ accentColor: GOLD, flex: 1, minWidth: "8rem" }} aria-label="degree in sign" />
          <strong style={{ color: GOLD }}>{deg.toFixed(1)}°</strong>
          <span style={{ color: INK_MUTED, fontSize: "0.8rem" }}>{decanate + 1}{["st", "nd", "rd"][decanate]} drekkāṇa</span>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))", gap: "0.6rem" }}>
        <div style={{ border: `1px solid ${GREEN}`, borderRadius: 8, background: `${GREEN}10`, padding: "0.7rem 0.8rem" }}>
          <div style={{ color: GREEN, fontWeight: 900, fontSize: "0.9rem" }}>Parāśarī (default)</div>
          <div style={{ color: INK_MUTED, fontSize: "0.72rem" }}>1st→same · 2nd→5th · 3rd→9th (trine)</div>
          <div style={{ color: INK_PRIMARY, fontWeight: 900, fontSize: "1.05rem", marginTop: "0.25rem" }}>→ {SIGNS[par]}</div>
        </div>
        <div style={{ border: `1px solid ${BLUE}`, borderRadius: 8, background: `${BLUE}10`, padding: "0.7rem 0.8rem" }}>
          <div style={{ color: BLUE, fontWeight: 900, fontSize: "0.9rem" }}>Jaimini (one tradition)</div>
          <div style={{ color: INK_MUTED, fontSize: "0.72rem" }}>1st→same · 2nd→7th · 3rd→5th</div>
          <div style={{ color: INK_PRIMARY, fontWeight: 900, fontSize: "1.05rem", marginTop: "0.25rem" }}>→ {SIGNS[jai]}</div>
        </div>
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.7rem 0.8rem" }}>
          <div style={{ color: INK_SECONDARY, fontWeight: 900, fontSize: "0.9rem" }}>Somanātha</div>
          <div style={{ color: INK_MUTED, fontSize: "0.72rem" }}>a sequential 36-decanate scheme</div>
          <div style={{ color: INK_MUTED, fontWeight: 800, fontSize: "0.95rem", marginTop: "0.25rem" }}>→ beyond Tier 1</div>
        </div>
      </section>

      <p style={{ margin: 0, color: diverge ? GOLD : INK_MUTED, fontWeight: diverge ? 800 : 600, fontSize: "0.9rem", lineHeight: 1.5 }}>
        {decanate === 0
          ? "In the 1st drekkāṇa all systems agree — the sign itself."
          : diverge
          ? `Here the systems DIVERGE: Parāśarī says ${SIGNS[par]}, Jaimini says ${SIGNS[jai]}. Pick one system and stay in it — never read a D3 placement without saying which scheme produced it.`
          : `Here Parāśarī and Jaimini happen to agree (${SIGNS[par]}) — but they often won't; always name the system.`}
      </p>
    </div>
  );
}
