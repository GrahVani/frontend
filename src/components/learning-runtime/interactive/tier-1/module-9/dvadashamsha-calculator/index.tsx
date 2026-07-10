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
const PART = 2.5; // 30 / 12 = 2°30′

export function DvadashamshaCalculator() {
  const [sign, setSign] = useState(0); // Meṣa
  const [deg, setDeg] = useState(4);

  const part = Math.min(Math.floor(deg / PART), 11); // 0..11 → 1st..12th
  // D12 counts from the sign itself for ALL signs (no odd/even split).
  const dest = (sign + part) % 12;
  const fmt = (d: number) => `${Math.floor(d)}°${Math.round((d % 1) * 60).toString().padStart(2, "0")}′`;

  return (
    <div data-interactive="dvadashamsha-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>D12 Dvādaśāṁśa calculator</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>Where does the parents-part land?</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Each sign splits into twelve parts of 2°30′. The twelve count forward from the sign itself — the same rule for every sign (no odd/even split).</p>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
          <select value={sign} onChange={(e) => setSign(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.35rem 0.5rem", fontWeight: 700 }}>
            {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
          </select>
          <input type="range" min={0} max={29.9} step={0.1} value={deg} onChange={(e) => setDeg(Number(e.target.value))} style={{ accentColor: GOLD, flex: 1, minWidth: "8rem" }} aria-label="degree in sign" />
          <strong style={{ color: GOLD }}>{deg.toFixed(1)}°</strong>
        </div>
      </section>

      <section style={{ border: `1px solid ${GREEN}`, borderRadius: 8, background: `${GREEN}10`, padding: "1rem" }}>
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.45rem 0.6rem", marginBottom: "0.5rem", display: "inline-block" }}>
          <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase" }}>Part</div>
          <div style={{ color: INK_PRIMARY, fontSize: "0.9rem", fontWeight: 800 }}>{part + 1} of 12 ({fmt(part * PART)}–{fmt((part + 1) * PART)})</div>
        </div>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem", color: GREEN }}>→ D12 sign: {SIGNS[dest]}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          {deg.toFixed(1)}° {SIGNS[sign]} is the {part + 1}{["st", "nd", "rd"][part] || "th"} dvādaśāṁśa; counting that many signs from {SIGNS[sign]} lands the planet in <strong style={{ color: GREEN }}>{SIGNS[dest]}</strong>.
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>D12 magnifies <strong>parents, ancestry, lineage and inheritance</strong> (4th/9th-house parental themes) — read alongside the D1.</p>
      </section>
    </div>
  );
}
