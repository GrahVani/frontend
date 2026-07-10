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
const PART = 30 / 27; // 1°06′40″ ≈ 1.111°
// Element start (the disclosed alternate): fire→Meṣa(0), earth→Karka(3), air→Tulā(6), water→Makara(9), by index%4.
const ELEMENT_START = [0, 3, 6, 9];
const ELEMENT = ["fire", "earth", "air", "water"];

export function SaptavimshamshaCalculator() {
  const [sign, setSign] = useState(0); // Meṣa
  const [deg, setDeg] = useState(4);
  const [elementMode, setElementMode] = useState(false);

  const part = Math.min(Math.floor(deg / PART), 26); // 0..26 → 1st..27th
  const elem = sign % 4;
  const start = elementMode ? ELEMENT_START[elem] : 0; // default rule: universal Meṣa start
  const dest = (start + part) % 12;
  const fmt = (d: number) => `${Math.floor(d)}°${Math.round((d % 1) * 60).toString().padStart(2, "0")}′`;

  return (
    <div data-interactive="saptavimshamsha-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>D27 Saptaviṁśāṁśa (Bhāṁśa) calculator</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>Where does the strength-part land?</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Each sign splits into twenty-seven parts of 1°06′40″. The default rule counts the parts from Meṣa for every sign; an alternate lineage starts by element — disclose which you use.</p>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
          <select value={sign} onChange={(e) => setSign(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.35rem 0.5rem", fontWeight: 700 }}>
            {SIGNS.map((s, i) => <option key={s} value={i}>{s} ({ELEMENT[i % 4]})</option>)}
          </select>
          <input type="range" min={0} max={29.9} step={0.1} value={deg} onChange={(e) => setDeg(Number(e.target.value))} style={{ accentColor: GOLD, flex: 1, minWidth: "7rem" }} aria-label="degree in sign" />
          <strong style={{ color: GOLD }}>{deg.toFixed(1)}°</strong>
          <button type="button" aria-pressed={elementMode} onClick={() => setElementMode((m) => !m)} style={{ border: `1px solid ${elementMode ? GOLD : HAIRLINE}`, borderRadius: 8, background: elementMode ? GOLD : "transparent", color: elementMode ? "#fff" : INK_SECONDARY, padding: "0.25rem 0.55rem", fontWeight: 800, fontSize: "0.74rem", cursor: "pointer" }}>
            {elementMode ? "element start" : "universal Meṣa"}
          </button>
        </div>
      </section>

      <section style={{ border: `1px solid ${GREEN}`, borderRadius: 8, background: `${GREEN}10`, padding: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          {[
            { k: "Part", v: `${part + 1} of 27 (${fmt(part * PART)}–${fmt((part + 1) * PART)})` },
            { k: "Start", v: elementMode ? `${ELEMENT[elem]} → ${SIGNS[start]}` : "Meṣa (universal)" },
          ].map((x) => (
            <div key={x.k} style={{ flex: "1 1 8rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.45rem 0.6rem" }}>
              <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase" }}>{x.k}</div>
              <div style={{ color: INK_PRIMARY, fontSize: "0.9rem", fontWeight: 800 }}>{x.v}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem", color: GREEN }}>→ D27 sign: {SIGNS[dest]}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          {deg.toFixed(1)}° {SIGNS[sign]} is the {part + 1}{["st", "nd", "rd"][part] || "th"} saptaviṁśāṁśa; counting from {SIGNS[start]} the planet lands in <strong style={{ color: GREEN }}>{SIGNS[dest]}</strong>.
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>D27 (Bhāṁśa / Nakṣatrāṁśa) magnifies <strong>strengths, weaknesses, stamina and resilience</strong> — read alongside the D1.</p>
      </section>
    </div>
  );
}
