"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const BLUE = "#2F5A7D";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const SIGN_ABBR = ["Meṣ", "Vṛṣ", "Mit", "Kar", "Siṁ", "Kan", "Tul", "Vṛś", "Dha", "Mak", "Kum", "Mīn"];
const FIXED = [1, 4, 7, 10];
const MOVABLE = [0, 3, 6, 9];
const DUAL = [2, 5, 8, 11];

interface Planet { name: string; glyph: string; special: "mars" | "jupiter" | "saturn" | null }
const PLANETS: Planet[] = [
  { name: "Sun", glyph: "☉", special: null },
  { name: "Moon", glyph: "☽", special: null },
  { name: "Mars", glyph: "♂", special: "mars" },
  { name: "Mercury", glyph: "☿", special: null },
  { name: "Jupiter", glyph: "♃", special: "jupiter" },
  { name: "Venus", glyph: "♀", special: null },
  { name: "Saturn", glyph: "♄", special: "saturn" },
  { name: "Rāhu", glyph: "☊", special: null },
  { name: "Ketu", glyph: "☋", special: null },
];

// Graha-dṛṣṭi in SIGN terms (whole-sign: 7th house from = 7th sign from = opposite sign).
function grahaSigns(special: Planet["special"], s: number): Set<number> {
  const out = new Set<number>([(s + 6) % 12]); // 7th
  if (special === "mars") { out.add((s + 3) % 12); out.add((s + 7) % 12); } // 4th, 8th
  if (special === "jupiter") { out.add((s + 4) % 12); out.add((s + 8) % 12); } // 5th, 9th
  if (special === "saturn") { out.add((s + 2) % 12); out.add((s + 9) % 12); } // 3rd, 10th
  return out;
}
// Rāśi-dṛṣṭi by the sign's modality.
function rashiSigns(s: number): Set<number> {
  const m = s % 3;
  if (m === 0) return new Set(FIXED.filter((j) => j !== (s + 1) % 12));
  if (m === 1) return new Set(MOVABLE.filter((j) => j !== (s + 11) % 12));
  return new Set(DUAL.filter((j) => j !== s));
}

export function AspectDoctrineComparator() {
  const [planetIdx, setPlanetIdx] = useState(2); // Mars (a special-aspect planet shows richer contrast)
  const [sign, setSign] = useState(0); // Meṣa
  const p = PLANETS[planetIdx];
  const g = grahaSigns(p.special, sign);
  const r = rashiSigns(sign);

  const both: number[] = [], grahaOnly: number[] = [], rashiOnly: number[] = [];
  for (let i = 0; i < 12; i++) {
    if (i === sign) continue;
    const inG = g.has(i), inR = r.has(i);
    if (inG && inR) both.push(i);
    else if (inG) grahaOnly.push(i);
    else if (inR) rashiOnly.push(i);
  }
  const names = (arr: number[]) => (arr.length ? arr.map((i) => SIGNS[i]).join(", ") : "—");

  return (
    <div data-interactive="aspect-doctrine-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Two aspect doctrines, one placement</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>Graha-dṛṣṭi vs rāśi-dṛṣṭi</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", alignItems: "center" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase", marginRight: "0.2rem" }}>Planet:</span>
          {PLANETS.map((pl, i) => (
            <button key={pl.name} type="button" aria-pressed={planetIdx === i} onClick={() => setPlanetIdx(i)} title={pl.name}
              style={{ border: `1px solid ${planetIdx === i ? GOLD : HAIRLINE}`, borderRadius: 8, background: planetIdx === i ? GOLD : "transparent", color: planetIdx === i ? "#fff" : INK_SECONDARY, padding: "0.25rem 0.5rem", fontWeight: 850, fontSize: "0.95rem", cursor: "pointer" }}>
              {pl.glyph}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.55rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>In sign:</span>
          <select value={sign} onChange={(e) => setSign(Number(e.target.value))} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_PRIMARY, padding: "0.35rem 0.5rem", fontWeight: 700 }}>
            {SIGNS.map((s, i) => <option key={s} value={i}>{s}</option>)}
          </select>
          <span style={{ color: INK_MUTED, fontSize: "0.8rem" }}>{p.name} in {SIGNS[sign]}</span>
        </div>
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="aspected signs by doctrine">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(4.5rem, 1fr))", gap: "0.3rem" }}>
          {SIGNS.map((_, i) => {
            const isSrc = i === sign;
            const inG = g.has(i), inR = r.has(i);
            const tag = inG && inR ? "both" : inG ? "graha" : inR ? "rāśi" : null;
            const c = isSrc ? GOLD : tag === "both" ? GOLD : tag === "graha" ? BLUE : tag === "rāśi" ? GREEN : INK_MUTED;
            return (
              <div key={i} style={{ border: `1px solid ${isSrc ? GOLD : tag ? c : HAIRLINE}`, borderRadius: 6, padding: "0.3rem 0.2rem", textAlign: "center", background: tag || isSrc ? `${c}1A` : "transparent" }}>
                <div style={{ color: c, fontWeight: 900, fontSize: "0.8rem" }}>{SIGN_ABBR[i]}</div>
                <div style={{ color: c, fontSize: "0.56rem", fontWeight: 800 }}>{isSrc ? `${p.glyph} here` : tag ?? ""}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "0.7rem", display: "grid", gap: "0.25rem", fontSize: "0.85rem", lineHeight: 1.5 }}>
          <p style={{ margin: 0 }}><strong style={{ color: BLUE }}>Graha-dṛṣṭi</strong> (7th{p.special ? " + specials" : ""}, by house/sign): {names([...g].filter((i) => i !== sign).sort((a, b) => a - b))}</p>
          <p style={{ margin: 0 }}><strong style={{ color: GREEN }}>Rāśi-dṛṣṭi</strong> (by {SIGNS[sign]}&apos;s modality): {names([...r].filter((i) => i !== sign).sort((a, b) => a - b))}</p>
          <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY }}>
            <strong style={{ color: GOLD }}>Both agree on:</strong> {names(both)} · <strong style={{ color: BLUE }}>graha-only:</strong> {names(grahaOnly)} · <strong style={{ color: GREEN }}>rāśi-only:</strong> {names(rashiOnly)}.
          </p>
          <p style={{ margin: "0.2rem 0 0", color: INK_MUTED, fontSize: "0.8rem" }}>Two valid systems, different sets — name which one you are reading; don&apos;t blend them.</p>
        </div>
      </section>
    </div>
  );
}
