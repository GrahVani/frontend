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

export function BudhadityaChecker() {
  // The Sun's degree within a reference sign (0-30), and Mercury's offset from the Sun (-25..+25).
  // Mercury never strays more than ~28° from the Sun.
  const [sunDeg, setSunDeg] = useState(4);
  const [offset, setOffset] = useState(16);
  const [retro, setRetro] = useState(false);

  const mercLon = sunDeg + offset; // within the reference sign if 0..30
  const sameSign = mercLon >= 0 && mercLon < 30;
  const gap = Math.abs(offset);
  const orb = retro ? 7 : 14; // combustion orb; retrograde Mercury resists, so a tighter orb
  const combust = gap < orb;
  const deeply = gap < 5;

  let verdict: string, color: string, detail: string;
  if (!sameSign) {
    verdict = "No Budhāditya";
    color = RED;
    detail = `Mercury has slipped into the ${mercLon < 0 ? "previous" : "next"} sign — Mercury and the Sun are no longer in the same rāśi, so the yoga does not form.`;
  } else if (combust) {
    verdict = deeply ? "Budhāditya — deeply combust" : "Budhāditya — combust";
    color = GOLD;
    detail = `Mercury and the Sun share the sign (yoga present), but Mercury is only ${gap}° from the Sun — within the ~${orb}° combustion orb${retro ? " (retrograde, tighter)" : ""}. ${deeply ? "Deeply combust: the intellect-promise is markedly qualified." : "Combust: the promise is real but qualified — read Mercury's wider condition and daśā."}`;
  } else {
    verdict = "Budhāditya — clean";
    color = GREEN;
    detail = `Mercury and the Sun share the sign AND Mercury is ${gap}° away — outside the ~${orb}° orb. This is the strongest form: in-sign but uncombust. (Note how narrow this window is — a same-sign Mercury is usually at least mildly combust.)`;
  }

  return (
    <div data-interactive="budhaditya-checker" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Budhāditya checker</p>
        <h2 style={{ margin: "0.2rem 0 0.2rem", color: GOLD, fontSize: "1.3rem" }}>Same sign — and how combust?</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Budhāditya = Mercury and the Sun in the same sign. Set the Sun&apos;s degree and Mercury&apos;s distance from it: in-sign forms the yoga; within ~{orb}° of the Sun, Mercury is combust and the promise is qualified.</p>
        <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.8rem" }}>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ width: "9rem", color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>Sun at (° in sign)</span>
            <input type="range" min={0} max={29} value={sunDeg} onChange={(e) => setSunDeg(Number(e.target.value))} style={{ accentColor: GOLD, flex: 1, minWidth: "8rem" }} />
            <strong style={{ color: GOLD }}>{sunDeg}°</strong>
          </label>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ width: "9rem", color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>Mercury offset</span>
            <input type="range" min={-25} max={25} value={offset} onChange={(e) => setOffset(Number(e.target.value))} style={{ accentColor: GOLD, flex: 1, minWidth: "8rem" }} />
            <strong style={{ color: GOLD }}>{offset > 0 ? `+${offset}` : offset}°</strong>
          </label>
          <button type="button" aria-pressed={retro} onClick={() => setRetro((r) => !r)} style={{ justifySelf: "start", border: `1px solid ${retro ? GOLD : HAIRLINE}`, borderRadius: 8, background: retro ? `${GOLD}1A` : "transparent", color: retro ? GOLD : INK_SECONDARY, padding: "0.3rem 0.6rem", fontWeight: 800, cursor: "pointer", fontSize: "0.78rem" }}>
            Mercury retrograde {retro ? "ON (orb ~7°)" : "OFF (orb ~14°)"}
          </button>
        </div>
      </section>

      <section style={{ border: `1px solid ${color}`, borderRadius: 8, background: `${color}10`, padding: "1rem" }}>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          {[
            { k: "Same sign?", v: sameSign ? "yes" : "no", ok: sameSign },
            { k: "Sun–Mercury gap", v: `${gap}°`, ok: !combust },
            { k: "Combust?", v: combust ? (deeply ? "deeply" : "yes") : "no", ok: !combust },
          ].map((c) => (
            <div key={c.k} style={{ flex: "1 1 6rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.45rem 0.6rem" }}>
              <div style={{ color: INK_MUTED, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase" }}>{c.k}</div>
              <div style={{ color: c.ok ? GREEN : GOLD, fontSize: "1rem", fontWeight: 900 }}>{c.v}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem", color }}>{verdict}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>{detail}</p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>Results, when clean: sharp intellect, eloquence, learning, analytical skill, recognition. Combustion qualifies — it never simply destroys. Combustion orbs vary by lineage (~12–14°); disclose which you use.</p>
      </section>
    </div>
  );
}
