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
// The three Parāśarī drekkāṇa deities.
const DEITY = ["Nārada", "Agastya", "Durvāsā"];

export function DrekkanaCalculator() {
  const [sign, setSign] = useState(0); // Meṣa
  const [deg, setDeg] = useState(15);

  const decanate = Math.min(Math.floor(deg / 10), 2); // 0,1,2 → 1st/2nd/3rd
  const offset = [0, 4, 8][decanate]; // same / 5th / 9th (trine)
  const dest = (sign + offset) % 12;
  const trineName = ["same sign", "the 5th from it", "the 9th from it"][decanate];

  return (
    <div data-interactive="drekkana-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>D3 Drekkāṇa calculator</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>Which trine does the decanate map to?</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Each sign splits into three 10° drekkāṇas. Parāśarī: the 1st (0–10°) stays in the same sign, the 2nd (10–20°) goes to the 5th from it, the 3rd (20–30°) to the 9th — always within the same element.</p>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
          <select value={sign} onChange={(e) => setSign(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.35rem 0.5rem", fontWeight: 700 }}>
            {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
          </select>
          <input type="range" min={0} max={29.9} step={0.1} value={deg} onChange={(e) => setDeg(Number(e.target.value))} style={{ accentColor: GOLD, flex: 1, minWidth: "8rem" }} aria-label="degree in sign" />
          <strong style={{ color: GOLD }}>{deg.toFixed(1)}°</strong>
        </div>
      </section>

      <section style={{ border: `1px solid ${GREEN}`, borderRadius: 8, background: `${GREEN}10`, padding: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          {[
            { k: "Drekkāṇa", v: `${decanate + 1}${["st", "nd", "rd"][decanate]} (${decanate * 10}–${decanate * 10 + 10}°)` },
            { k: "Maps to", v: trineName },
            { k: "Deity", v: DEITY[decanate] },
          ].map((x) => (
            <div key={x.k} style={{ flex: "1 1 7rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.45rem 0.6rem" }}>
              <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase" }}>{x.k}</div>
              <div style={{ color: INK_PRIMARY, fontSize: "0.9rem", fontWeight: 800 }}>{x.v}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem", color: GREEN }}>→ D3 sign: {SIGNS[dest]}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          A planet at {deg.toFixed(1)}° {SIGNS[sign]} sits in the {decanate + 1}{["st", "nd", "rd"][decanate]} drekkāṇa → {trineName} = <strong style={{ color: GREEN }}>{SIGNS[dest]}</strong> (same element — a trine).
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>D3 magnifies <strong>siblings, co-borns, courage and valour</strong> (the 3rd-house themes, Mars-kāraka) — read alongside the D1.</p>
      </section>
    </div>
  );
}
