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
const MODES = {
  D40: { label: "D40 Khavedāṁśa", n: 40, part: 30 / 40, domain: "maternal lineage & matrilineal karma (Moon, 4th)", startNote: "odd → Meṣa, even → Tulā" },
  D45: { label: "D45 Akṣavedāṁśa", n: 45, part: 30 / 45, domain: "paternal lineage & conduct (Sun, 9th)", startNote: "movable → Meṣa, fixed → Siṁha, dual → Dhanus" },
} as const;

export function KhavedamshaAkshavedamshaCalculator() {
  const [mode, setMode] = useState<"D40" | "D45">("D40");
  const [sign, setSign] = useState(0); // Meṣa
  const [deg, setDeg] = useState(7);

  const m = MODES[mode];
  const part = Math.min(Math.floor(deg / m.part), m.n - 1); // 0-indexed
  // D40: odd sign → Meṣa(0), even → Tulā(6). D45: movable → Meṣa(0), fixed → Siṁha(4), dual → Dhanus(8).
  const start = mode === "D40" ? (sign % 2 === 0 ? 0 : 6) : [0, 4, 8][sign % 3];
  const dest = (start + part) % 12;
  const fmt = (d: number) => `${Math.floor(d)}°${Math.round((d % 1) * 60).toString().padStart(2, "0")}′`;

  return (
    <div data-interactive="khavedamsha-akshavedamsha-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>The lineage vargas</p>
        <h2 style={{ margin: "0.2rem 0 0.4rem", color: GOLD, fontSize: "1.3rem" }}>D40 maternal · D45 paternal</h2>
        <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.6rem" }}>
          {(["D40", "D45"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={mode === k} onClick={() => setMode(k)}
              style={{ border: `1px solid ${mode === k ? GOLD : HAIRLINE}`, borderRadius: 8, background: mode === k ? GOLD : "transparent", color: mode === k ? "#fff" : INK_SECONDARY, padding: "0.3rem 0.7rem", fontWeight: 850, fontSize: "0.82rem", cursor: "pointer" }}>
              {MODES[k].label}
            </button>
          ))}
        </div>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.5 }}>{m.label}: {m.n} parts of {fmt(m.part)}; start {m.startNote}. (Deep-varga start-rules vary by lineage — this follows the lesson&apos;s convention.)</p>
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.7rem", alignItems: "center", flexWrap: "wrap" }}>
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
          <div style={{ color: INK_PRIMARY, fontSize: "0.9rem", fontWeight: 800 }}>{part + 1} of {m.n} ({fmt(part * m.part)}–{fmt((part + 1) * m.part)})</div>
        </div>
        <p style={{ margin: 0, fontWeight: 900, fontSize: "1.1rem", color: GREEN }}>→ {mode} sign: {SIGNS[dest]}</p>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          {deg.toFixed(1)}° {SIGNS[sign]} → the {part + 1}{["st", "nd", "rd"][part] || "th"} part, counted from {SIGNS[start]} → <strong style={{ color: GREEN }}>{SIGNS[dest]}</strong>.
        </p>
        <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>{mode} magnifies <strong>{m.domain}</strong> — these are very fine vargas (birth-time-sensitive); read alongside the D1.</p>
      </section>
    </div>
  );
}
