"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const SUN = "#A8412B";
const MOON = "#2F5A7D";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];

export function HoraCalculator() {
  const [sign, setSign] = useState(0); // Meṣa (odd)
  const [deg, setDeg] = useState(10);

  const oddSign = sign % 2 === 0; // sign-number odd = 0-indexed even (Meṣa#1, Mithuna#3, …)
  const firstHalf = deg < 15;
  // Odd sign: 1st half = Sun's horā (Leo), 2nd half = Moon's horā (Cancer). Even sign: reversed.
  const sunHora = (oddSign && firstHalf) || (!oddSign && !firstHalf);
  const horaLord = sunHora ? "Sun" : "Moon";
  const horaSign = sunHora ? "Siṁha (Leo)" : "Karka (Cancer)";
  const c = sunHora ? SUN : MOON;

  return (
    <div data-interactive="hora-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>D2 Horā calculator</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>Sun's horā or Moon's horā?</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Each sign splits into two 15° horās. In an ODD sign the first half is the Sun's horā (Leo), the second the Moon's (Cancer); in an EVEN sign it reverses. Every planet lands in Leo or Cancer.</p>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
          <select value={sign} onChange={(e) => setSign(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.35rem 0.5rem", fontWeight: 700 }}>
            {SIGNS.map((s, i) => <option key={s} value={i}>{s} ({i % 2 === 0 ? "odd" : "even"})</option>)}
          </select>
          <input type="range" min={0} max={29.9} step={0.1} value={deg} onChange={(e) => setDeg(Number(e.target.value))} style={{ accentColor: GOLD, flex: 1, minWidth: "8rem" }} aria-label="degree in sign" />
          <strong style={{ color: GOLD }}>{deg.toFixed(1)}°</strong>
        </div>
      </section>

      <section style={{ border: `1px solid ${c}`, borderRadius: 8, background: `${c}10`, padding: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          {[
            { k: "Sign parity", v: oddSign ? "odd" : "even" },
            { k: "Half", v: firstHalf ? "first 15° (0–15°)" : "second 15° (15–30°)" },
          ].map((x) => (
            <div key={x.k} style={{ flex: "1 1 8rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.45rem 0.6rem" }}>
              <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase" }}>{x.k}</div>
              <div style={{ color: INK_PRIMARY, fontSize: "0.95rem", fontWeight: 800 }}>{x.v}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem", color: c }}>→ {horaLord}&apos;s horā — {horaSign}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          {SIGNS[sign]} is an {oddSign ? "odd" : "even"} sign, so its {firstHalf ? "first" : "second"} half is the {horaLord}&apos;s horā → the planet&apos;s D2 sign is {horaSign}.
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>D2 magnifies <strong>wealth &amp; resources</strong>. The Sun&apos;s horā leans to self-earned/active wealth, the Moon&apos;s to nourishing/inherited flow — read alongside the D1, never alone.</p>
      </section>
    </div>
  );
}
