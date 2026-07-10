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
// The four quarters map to the four kendras from the sign: same / 4th / 7th / 10th.
const OFFSET = [0, 3, 6, 9];
const KENDRA_NAME = ["the same sign (1st)", "the 4th from it", "the 7th from it", "the 10th from it"];

export function ChaturthamshaCalculator() {
  const [sign, setSign] = useState(0); // Meṣa
  const [deg, setDeg] = useState(12);

  const quarter = Math.min(Math.floor(deg / 7.5), 3); // 0..3 → 1st..4th
  const dest = (sign + OFFSET[quarter]) % 12;
  const lo = (quarter * 7.5).toFixed(2).replace(/\.?0+$/, "");
  const hi = ((quarter + 1) * 7.5).toFixed(2).replace(/\.?0+$/, "");

  return (
    <div data-interactive="chaturthamsha-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>D4 Chaturthāṁśa calculator</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>Which kendra does the quarter map to?</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Each sign splits into four 7°30′ parts mapping to the four kendras (angles): the 1st quarter stays in the same sign, the 2nd goes to the 4th from it, the 3rd to the 7th, the 4th to the 10th.</p>
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
            { k: "Quarter", v: `${quarter + 1}${["st", "nd", "rd", "th"][quarter]} (${lo}–${hi}°)` },
            { k: "Maps to", v: KENDRA_NAME[quarter] },
          ].map((x) => (
            <div key={x.k} style={{ flex: "1 1 8rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.45rem 0.6rem" }}>
              <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase" }}>{x.k}</div>
              <div style={{ color: INK_PRIMARY, fontSize: "0.92rem", fontWeight: 800 }}>{x.v}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem", color: GREEN }}>→ D4 sign: {SIGNS[dest]}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          A planet at {deg.toFixed(1)}° {SIGNS[sign]} is in the {quarter + 1}{["st", "nd", "rd", "th"][quarter]} quarter → {KENDRA_NAME[quarter]} = <strong style={{ color: GREEN }}>{SIGNS[dest]}</strong>. All four destinations are kendras (1/4/7/10) — never trines.
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>D4 magnifies <strong>property, home, fixed assets, fortune (sukha) and the mother</strong> (4th-house themes) — read alongside the D1.</p>
      </section>
    </div>
  );
}
