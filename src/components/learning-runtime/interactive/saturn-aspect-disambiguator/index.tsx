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
const BLUE = "#2F5A7D";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const FIXED = [1, 4, 7, 10], MOVABLE = [0, 3, 6, 9], DUAL = [2, 5, 8, 11];
const MODE_NAME = ["movable", "fixed", "dual"];

// Rāśi-dṛṣṭi: which sign-indices does sign i aspect?
function rashiAspects(i: number): Set<number> {
  const m = i % 3;
  if (m === 0) return new Set(FIXED.filter((j) => j !== (i + 1) % 12));
  if (m === 1) return new Set(MOVABLE.filter((j) => j !== (i + 11) % 12));
  return new Set(DUAL.filter((j) => j !== i));
}

export function SaturnAspectDisambiguator() {
  // Whole-sign houses with Meṣa lagna, so house number = sign index + 1 (keeps it concrete).
  const [satHouse, setSatHouse] = useState(1); // Saturn's house (1-12)
  const [target, setTarget] = useState(7); // target house

  const satSign = (satHouse - 1) % 12;
  const tgtSign = (target - 1) % 12;
  // distance of target from Saturn (inclusive, Saturn's house = 1)
  const dist = ((target - satHouse + 12) % 12) + 1;

  // Graha-dṛṣṭi: Saturn aspects its 3rd, 7th, 10th.
  const grahaYes = dist === 3 || dist === 7 || dist === 10;
  // Rāśi-dṛṣṭi: Saturn's sign aspects the target's sign?
  const rashiYes = rashiAspects(satSign).has(tgtSign);
  const isSeventh = dist === 7;

  return (
    <div data-interactive="saturn-aspect-disambiguator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>“Saturn aspects the 7th” — which doctrine?</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>One phrase, three verdicts</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
          {[{ v: satHouse, set: setSatHouse, l: "♄ Saturn in house" }, { v: target, set: setTarget, l: "Target house" }].map((s) => (
            <span key={s.l} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>{s.l}</span>
              <select value={s.v} onChange={(e) => s.set(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.3rem 0.45rem", fontWeight: 700 }}>
                {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1} ({SIGNS[i]})</option>)}
              </select>
            </span>
          ))}
        </div>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem" }}>
          Saturn in {SIGNS[satSign]} ({MODE_NAME[satSign % 3]}); the target is the <strong style={{ color: isSeventh ? GOLD : INK_PRIMARY }}>{dist}{dist === 1 ? "st" : dist === 2 ? "nd" : dist === 3 ? "rd" : "th"}</strong> from Saturn{isSeventh ? " — the classic “7th” case" : ""}.
        </p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(11rem, 1fr))", gap: "0.6rem" }}>
        <div style={{ border: `1px solid ${BLUE}`, borderRadius: 8, background: `${BLUE}10`, padding: "0.7rem 0.8rem" }}>
          <div style={{ color: BLUE, fontWeight: 900, fontSize: "0.92rem" }}>Parāśari graha-dṛṣṭi</div>
          <div style={{ color: grahaYes ? GREEN : RED, fontWeight: 900, fontSize: "1.05rem", margin: "0.2rem 0" }}>{grahaYes ? "✓ aspects" : "✗ no aspect"}</div>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", lineHeight: 1.45 }}>Saturn casts its 3rd, 7th, 10th. The target is Saturn&apos;s {dist}th, {grahaYes ? "which is one of them." : "not among 3/7/10."}</p>
        </div>
        <div style={{ border: `1px solid ${GOLD}`, borderRadius: 8, background: `${GOLD}10`, padding: "0.7rem 0.8rem" }}>
          <div style={{ color: GOLD, fontWeight: 900, fontSize: "0.92rem" }}>Jaimini rāśi-dṛṣṭi</div>
          <div style={{ color: rashiYes ? GREEN : RED, fontWeight: 900, fontSize: "1.05rem", margin: "0.2rem 0" }}>{rashiYes ? "✓ aspects" : "✗ no aspect"}</div>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", lineHeight: 1.45 }}>By {SIGNS[satSign]}&apos;s modality ({MODE_NAME[satSign % 3]}): {rashiYes ? `it aspects ${SIGNS[tgtSign]}.` : `it does not aspect ${SIGNS[tgtSign]} (wrong modality / adjacent).`}</p>
        </div>
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.7rem 0.8rem" }}>
          <div style={{ color: INK_SECONDARY, fontWeight: 900, fontSize: "0.92rem" }}>Tājika orb-dṛṣṭi</div>
          <div style={{ color: INK_MUTED, fontWeight: 900, fontSize: "1.05rem", margin: "0.2rem 0" }}>≈ depends</div>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", lineHeight: 1.45 }}>No whole-sign yes/no: it needs the exact degrees within Saturn&apos;s 9° orb of an angle — and only in the <em>annual</em> chart.</p>
        </div>
      </section>

      <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5 }}>
        {isSeventh && grahaYes && !rashiYes
          ? "Notice the disagreement on the very same “7th”: graha-dṛṣṭi says yes, rāśi-dṛṣṭi says no, Tājika says “it depends.” "
          : "The three doctrines answer the same question by different rules. "}
        Always name which doctrine you mean — never average them.
      </p>
    </div>
  );
}
