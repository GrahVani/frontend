"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";

// How each stream uses the nakṣatra (from §4.1), with its nakṣatra "resolution" and forward module.
const STREAMS = [
  {
    name: "Parāśari", level: "Broad / foundational", weight: 4,
    uses: "Per-nakṣatra meanings, the Janma-nakṣatra, the Vimśottarī daśā (built from the nakṣatras), padas, and muhūrta — woven throughout, rarely the sole engine.",
    forward: "the mainstream (this course's default)",
  },
  {
    name: "Jaimini", level: "Via pāda → navāṁśa", weight: 3,
    uses: "Ārūḍha and kāraka lean on sign/pāda; the Cara and other Jaimini daśās are sign-based — so nakṣatras matter through their pāda → navāṁśa role more than per-nakṣatra lore.",
    forward: "Module 17 (Jaimini)",
  },
  {
    name: "KP", level: "Central — the finest resolution", weight: 5,
    uses: "The sub-lord chain (sign → star → sub) IS the predictive method; the 9-fold Vimśottarī sub is mandatory for horary and timing. No stream relies on the nakṣatra subdivision more.",
    forward: "Module 16 (KP)",
  },
  {
    name: "Lal Kitab", level: "Minimal", weight: 1,
    uses: "A house-and-rāśi-centred remedial system (the 'red book'); nakṣatras play a small role next to the planet-in-house emphasis.",
    forward: "Module 18 (Lal Kitab)",
  },
  {
    name: "Tājika", level: "Annual chart", weight: 2,
    uses: "The varṣaphala (annual) chart and its timing — the Janma-tārā cycle and nakṣatra-based selections in annual technique.",
    forward: "Module 19 (Tājika)",
  },
];

export function StreamComparisonTable() {
  const [sel, setSel] = useState("KP");
  const cur = STREAMS.find((s) => s.name === sel) ?? STREAMS[0];

  return (
    <div data-interactive="stream-comparison-table" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Nakṣatra across streams</p>
        <h2 style={{ margin: "0.2rem 0 0.1rem", color: GOLD, fontSize: "1.3rem" }}>One vocabulary, five resolutions</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>The nakṣatra is shared across streams, but each reads it at a different depth — KP at the finest (the sub), Jaimini through pāda→navāṁśa, Parāśari across the whole range, Lal Kitab least. Name the stream you are working in; don&apos;t silently blend.</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.85rem" }}>
          {STREAMS.map((s) => (
            <button
              key={s.name}
              type="button"
              aria-pressed={sel === s.name}
              onClick={() => setSel(s.name)}
              style={{ border: `1px solid ${sel === s.name ? GOLD : HAIRLINE}`, borderRadius: 999, background: sel === s.name ? GOLD : "transparent", color: sel === s.name ? "#fff" : INK_SECONDARY, padding: "0.3rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "0.8rem", border: `1px solid ${GOLD}`, borderRadius: 8, background: `${GOLD}12`, padding: "0.7rem 0.85rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "baseline" }}>
            <strong style={{ color: GOLD, fontSize: "1.1rem" }}>{cur.name}</strong>
            <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.82rem" }}>Nakṣatra resolution: {cur.level}</span>
          </div>
          <p style={{ margin: "0.4rem 0 0.5rem", color: INK_PRIMARY, lineHeight: 1.6 }}>{cur.uses}</p>
          <p style={{ margin: 0, color: GREEN, fontWeight: 800, fontSize: "0.86rem" }}>→ continues in: {cur.forward}</p>
        </div>
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflowX: "auto" }} aria-label="Stream vs nakṣatra-emphasis table">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "28rem", fontSize: "0.84rem" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${GOLD}66` }}>
              {["Stream", "Nakṣatra resolution", "Depth", "Continues in"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.3rem 0.5rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.72rem", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STREAMS.map((s) => {
              const isSel = s.name === sel;
              return (
                <tr key={s.name} onClick={() => setSel(s.name)} style={{ borderBottom: `1px dashed ${HAIRLINE}`, background: isSel ? `${GOLD}1A` : "transparent", cursor: "pointer" }}>
                  <td style={{ padding: "0.35rem 0.5rem", fontWeight: 900, color: isSel ? GOLD : INK_PRIMARY }}>{s.name}</td>
                  <td style={{ padding: "0.35rem 0.5rem", color: INK_SECONDARY }}>{s.level}</td>
                  <td style={{ padding: "0.35rem 0.5rem", color: GOLD, letterSpacing: "1px" }}>{"●".repeat(s.weight)}<span style={{ color: INK_MUTED }}>{"○".repeat(5 - s.weight)}</span></td>
                  <td style={{ padding: "0.35rem 0.5rem", color: INK_MUTED }}>{s.forward}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
