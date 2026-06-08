"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";

// Per-varga facts that fill template attributes 1, 2, 4. Attributes 3, 5-8 are the same structural
// slots for every varga (the computation rule's specifics are taught in each varga's own chapter).
const VARGAS = [
  { d: 7, name: "Saptāṁśa", meaning: "seventh-part", n: 7, domain: "children & progeny" },
  { d: 9, name: "Navāṁśa", meaning: "ninth-part", n: 9, domain: "marriage, dharma, inner strength" },
  { d: 10, name: "Daśāṁśa", meaning: "tenth-part", n: 10, domain: "career, status, action in the world" },
  { d: 12, name: "Dvādaśāṁśa", meaning: "twelfth-part", n: 12, domain: "parents & ancestry" },
];

export function VargaTemplateCard() {
  const [idx, setIdx] = useState(1); // D9
  const [overlay, setOverlay] = useState(true);
  const v = VARGAS[idx];

  const rows = [
    { n: 1, attr: "Name + meaning", fill: `D${v.d} ${v.name} — "${v.meaning}"` },
    { n: 2, attr: "Subdivision size", fill: `${v.n} parts of ${(30 / v.n).toFixed(2).replace(/\.?0+$/, "")}° each` },
    { n: 3, attr: "Computation rule", fill: `the D${v.d} mapping (sub-part → sign) — taught in its own chapter` },
    { n: 4, attr: "Jurisdiction", fill: v.domain },
    { n: 5, attr: "Reading workflow", fill: "varga-Lagna → planets (sign/house/dignity in the varga) → relevant lord" },
    { n: 6, attr: "Cross-references", fill: `read alongside the D1; pairs with related vargas` },
    { n: 7, attr: "Common errors", fill: "reading the varga in isolation; ignoring the D1; over-claiming" },
    { n: 8, attr: "Worked example", fill: "the template applied to a sample chart" },
  ];

  return (
    <div data-interactive="varga-template-card" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>The per-varga template</p>
        <h2 style={{ margin: "0.2rem 0 0.4rem", color: GOLD, fontSize: "1.3rem" }}>One scaffold, eight attributes</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>Fill for:</span>
          {VARGAS.map((vv, i) => (
            <button key={vv.d} type="button" aria-pressed={idx === i} onClick={() => setIdx(i)}
              style={{ border: `1px solid ${idx === i ? GOLD : HAIRLINE}`, borderRadius: 8, background: idx === i ? GOLD : "transparent", color: idx === i ? "#fff" : INK_SECONDARY, padding: "0.25rem 0.6rem", fontWeight: 850, fontSize: "0.82rem", cursor: "pointer" }}>
              D{vv.d}
            </button>
          ))}
          <button type="button" aria-pressed={overlay} onClick={() => setOverlay((o) => !o)} style={{ marginLeft: "auto", border: `1px solid ${overlay ? GREEN : HAIRLINE}`, borderRadius: 8, background: overlay ? `${GREEN}1A` : "transparent", color: overlay ? GREEN : INK_SECONDARY, padding: "0.25rem 0.6rem", fontWeight: 800, fontSize: "0.76rem", cursor: "pointer" }}>
            read alongside D1 {overlay ? "ON" : "OFF"}
          </button>
        </div>
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label={`per-varga template filled for D${v.d}`}>
        <div style={{ display: "grid", gap: "0.3rem" }}>
          {rows.map((r) => {
            const facts = r.n <= 4 && r.n !== 3; // attrs 1,2,4 are the varga's facts
            return (
              <div key={r.n} style={{ display: "flex", gap: "0.6rem", alignItems: "baseline", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "0.25rem" }}>
                <span style={{ width: "1.2rem", color: GOLD, fontWeight: 900 }}>{r.n}</span>
                <span style={{ width: "9rem", color: INK_SECONDARY, fontWeight: 800, fontSize: "0.82rem" }}>{r.attr}</span>
                <span style={{ flex: 1, color: facts ? INK_PRIMARY : INK_MUTED, fontSize: "0.84rem", lineHeight: 1.4 }}>{r.fill}{facts ? "" : <em style={{ color: INK_MUTED }}> {r.n >= 5 ? "(same shape for every varga)" : ""}</em>}</span>
              </div>
            );
          })}
        </div>
        <p style={{ margin: "0.7rem 0 0", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5 }}>
          Attributes 1–4 are the <strong>facts</strong> of the varga (only the computation rule, 3, changes the work each chapter); 5–8 are how you <strong>use</strong> it — identical for every varga. {overlay ? "Always read the varga alongside the D1 — it confirms or qualifies the birth chart, never replaces it." : "Reading a varga in isolation (D1 overlay off) is the classic error — turn it back on."}
        </p>
      </section>
    </div>
  );
}
