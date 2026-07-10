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

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const SIGN_ABBR = ["Meṣ", "Vṛṣ", "Mit", "Kar", "Siṁ", "Kan", "Tul", "Vṛś", "Dha", "Mak", "Kum", "Mīn"];
// Modality by index mod 3: 0 = cara (movable), 1 = sthira (fixed), 2 = dvisvabhāva (dual).
const MODE = ["movable (cara)", "fixed (sthira)", "dual (dvisvabhāva)"];
const FIXED = [1, 4, 7, 10];
const MOVABLE = [0, 3, 6, 9];
const DUAL = [2, 5, 8, 11];

// Jaimini rāśi-dṛṣṭi: a cara sign aspects the fixed signs except the adjacent next (i+1);
// a sthira sign aspects the movable signs except the adjacent previous (i-1);
// a dual sign aspects the other three dual signs. Each aspects exactly 3; aspects are mutual.
function aspectedSigns(i: number): number[] {
  const m = i % 3;
  if (m === 0) return FIXED.filter((j) => j !== (i + 1) % 12);
  if (m === 1) return MOVABLE.filter((j) => j !== (i + 11) % 12);
  return DUAL.filter((j) => j !== i);
}
function excludedSign(i: number): number | null {
  const m = i % 3;
  if (m === 0) return (i + 1) % 12;
  if (m === 1) return (i + 11) % 12;
  return null;
}

export function RashiDrishtiGrid() {
  const [sel, setSel] = useState(0); // Meṣa
  const aspected = aspectedSigns(sel);
  const excluded = excludedSign(sel);
  const aspectedSet = new Set(aspected);

  return (
    <div data-interactive="rashi-drishti-grid" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Jaimini rāśi-dṛṣṭi</p>
        <h2 style={{ margin: "0.2rem 0 0.1rem", color: GOLD, fontSize: "1.3rem" }}>Sign-to-sign aspect by modality</h2>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>Pick a rāśi. A movable sign aspects the fixed signs (bar the adjacent one); a fixed sign the movable (bar the adjacent); a dual sign the other three duals. Every aspect is mutual.</p>

        <div style={{ marginTop: "0.85rem", border: `1px solid ${GOLD}`, borderRadius: 8, background: `${GOLD}12`, padding: "0.7rem 0.85rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", alignItems: "baseline" }}>
            <strong style={{ color: GOLD, fontSize: "1.1rem" }}>{SIGNS[sel]}</strong>
            <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.82rem" }}>{MODE[sel % 3]}</span>
          </div>
          <p style={{ margin: "0.4rem 0 0", color: INK_PRIMARY, lineHeight: 1.6 }}>
            aspects <strong style={{ color: GREEN }}>{aspected.map((j) => SIGNS[j]).join(", ")}</strong>
            {excluded !== null ? <> — but <strong style={{ color: RED }}>not {SIGNS[excluded]}</strong> (the adjacent {sel % 3 === 0 ? "fixed" : "movable"} sign, skipped).</> : <> (all three of the other dual signs — duals skip nothing).</>}
          </p>
        </div>
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ position: "relative", width: "min(21rem, 82vw)", height: "min(21rem, 82vw)", margin: "0 auto" }}>
          {SIGNS.map((_, i) => {
            const angle = (-90 + i * 30) * (Math.PI / 180);
            const x = 50 + 41 * Math.cos(angle);
            const y = 50 + 41 * Math.sin(angle);
            const isSel = i === sel;
            const isAspected = aspectedSet.has(i);
            const isExcluded = i === excluded;
            const bg = isSel ? GOLD : isAspected ? `${GREEN}22` : isExcluded ? `${RED}1A` : "transparent";
            const border = isSel ? GOLD : isAspected ? GREEN : isExcluded ? RED : HAIRLINE;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSel(i)}
                aria-pressed={isSel}
                title={`${SIGNS[i]} — ${MODE[i % 3]}`}
                style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", width: "3.3rem", height: "3.3rem", border: `2px solid ${border}`, borderRadius: 8, background: bg, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: 1.05, padding: 0 }}
              >
                <span style={{ fontSize: "0.78rem", fontWeight: 900, color: isSel ? "#fff" : isAspected ? GREEN : isExcluded ? RED : INK_PRIMARY }}>{SIGN_ABBR[i]}</span>
                {isAspected ? <span style={{ fontSize: "0.56rem", fontWeight: 800, color: GREEN }}>aspect</span> : isExcluded ? <span style={{ fontSize: "0.54rem", fontWeight: 800, color: RED }}>skipped</span> : null}
              </button>
            );
          })}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", textAlign: "center", color: INK_MUTED, fontSize: "0.7rem", fontWeight: 800 }}>
            rāśi<br />dṛṣṭi
          </div>
        </div>
        <p style={{ margin: "0.6rem 0 0", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5, textAlign: "center" }}>
          <span style={{ color: GREEN, fontWeight: 800 }}>green</span> = aspected · <span style={{ color: RED, fontWeight: 800 }}>red</span> = the skipped adjacent sign · movable↔fixed and dual↔dual only.
        </p>
      </section>
    </div>
  );
}
