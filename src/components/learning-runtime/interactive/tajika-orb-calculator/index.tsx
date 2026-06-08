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

// Classical Tājika dīptāṁśa (orb of influence, degrees) — Tājika-Nīlakaṇṭhī.
const PLANETS: { name: string; glyph: string; deepta: number }[] = [
  { name: "Sun", glyph: "☉", deepta: 15 },
  { name: "Moon", glyph: "☽", deepta: 12 },
  { name: "Mars", glyph: "♂", deepta: 8 },
  { name: "Mercury", glyph: "☿", deepta: 7 },
  { name: "Jupiter", glyph: "♃", deepta: 9 },
  { name: "Venus", glyph: "♀", deepta: 7 },
  { name: "Saturn", glyph: "♄", deepta: 9 },
];
const ANGLES: { deg: number; name: string }[] = [
  { deg: 0, name: "conjunction" }, { deg: 60, name: "sextile" }, { deg: 90, name: "square" },
  { deg: 120, name: "trine" }, { deg: 180, name: "opposition" },
];

export function TajikaOrbCalculator() {
  const [aIdx, setAIdx] = useState(0); // Sun
  const [bIdx, setBIdx] = useState(2); // Mars
  const [sep, setSep] = useState(117); // near a trine — the §7 demo

  const a = PLANETS[aIdx], b = PLANETS[bIdx];
  const orb = (a.deepta + b.deepta) / 2;
  const nearest = ANGLES.reduce((best, ang) => (Math.abs(sep - ang.deg) < Math.abs(sep - best.deg) ? ang : best), ANGLES[0]);
  const gap = Math.abs(sep - nearest.deg);
  const forms = gap <= orb;

  const Sel = ({ idx, set, label }: { idx: number; set: (n: number) => void; label: string }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
      <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>{label}</span>
      <select value={idx} onChange={(e) => set(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.3rem 0.45rem", fontWeight: 700 }}>
        {PLANETS.map((p, i) => <option key={p.name} value={i}>{p.glyph} {p.name} ({p.deepta}°)</option>)}
      </select>
    </span>
  );

  return (
    <div data-interactive="tajika-orb-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Tājika orb (dīptāṁśa)</p>
        <h2 style={{ margin: "0.2rem 0 0.6rem", color: GOLD, fontSize: "1.3rem" }}>Does the aspect form within orb?</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
          <Sel idx={aIdx} set={setAIdx} label="Graha A" />
          <Sel idx={bIdx} set={setBIdx} label="Graha B" />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>Separation:</span>
          <input type="range" min={0} max={180} value={sep} onChange={(e) => setSep(Number(e.target.value))} style={{ accentColor: GOLD, flex: 1, minWidth: "8rem" }} aria-label="angular separation" />
          <strong style={{ color: GOLD }}>{sep}°</strong>
        </div>
      </section>

      <section style={{ border: `1px solid ${forms ? GREEN : HAIRLINE}`, borderRadius: 8, background: forms ? `${GREEN}12` : SURFACE, padding: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(7rem, 1fr))", gap: "0.6rem" }}>
          {[
            { k: "Combined orb", v: `${orb}°`, note: `(${a.deepta} + ${b.deepta}) ÷ 2` },
            { k: "Nearest angle", v: `${nearest.deg}°`, note: nearest.name },
            { k: "Gap from exact", v: `${gap}°`, note: forms ? "within orb" : "outside orb" },
          ].map((c) => (
            <div key={c.k} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.5rem 0.65rem" }}>
              <div style={{ color: INK_MUTED, fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase" }}>{c.k}</div>
              <div style={{ color: GOLD, fontSize: "1.15rem", fontWeight: 900 }}>{c.v}</div>
              <div style={{ color: INK_MUTED, fontSize: "0.72rem" }}>{c.note}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: "0.7rem 0 0", color: forms ? GREEN : RED, fontWeight: 900, fontSize: "1.05rem" }}>
          {forms ? `✓ Aspect forms — ${a.name} and ${b.name} are in ${nearest.name} (gap ${gap}° ≤ orb ${orb}°).` : `✗ No aspect — gap ${gap}° exceeds the ${orb}° orb to the nearest ${nearest.name}.`}
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5 }}>
          Tājika aspects are by <strong>degree within orb</strong>, not whole-sign. The orb is the half-sum of the two grahas&apos; dīptāṁśas — so two planets can sit in mutually-aspecting signs yet form NO Tājika aspect if they are too far from the exact angle (and vice-versa). This is the annual-chart (varṣaphala) lens — deep Tājika is Module 19.
        </p>
      </section>
    </div>
  );
}
