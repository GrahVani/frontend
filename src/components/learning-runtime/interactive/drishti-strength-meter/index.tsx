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

// Virūpa (max 60 = full) cast on the house d-from the planet (d = 1..12, planet's house = 1).
// BPHS whole-house gradation: 7th=60(full); 4/8=45(¾); 5/9=30(½); 3/10=15(¼); else 0.
// Mars/Jupiter/Saturn UPGRADE their special partials to full (60).
function virupa(special: Planet["special"], d: number): number {
  if (d === 7) return 60;
  if (d === 4 || d === 8) return special === "mars" ? 60 : 45;
  if (d === 5 || d === 9) return special === "jupiter" ? 60 : 30;
  if (d === 3 || d === 10) return special === "saturn" ? 60 : 15;
  return 0;
}
const tierLabel = (v: number) => (v === 60 ? "full" : v === 45 ? "¾" : v === 30 ? "½" : v === 15 ? "¼" : "—");
const tierColor = (v: number) => (v === 60 ? RED : v === 0 ? INK_MUTED : GREEN);

export function DrishtiStrengthMeter() {
  const [planetIdx, setPlanetIdx] = useState(6); // Saturn — nice default (shows the 3/10 upgrade)
  const [house, setHouse] = useState(1);
  const p = PLANETS[planetIdx];

  // For each of the 12 houses, the distance d-from the planet and the virūpa cast.
  const rows = Array.from({ length: 12 }, (_, i) => {
    const target = i + 1;
    const d = ((target - house + 12) % 12) + 1;
    return { target, d, v: virupa(p.special, d) };
  });
  const aspected = rows.filter((r) => r.v > 0 && r.d !== 1).sort((a, b) => b.v - a.v);

  return (
    <div data-interactive="drishti-strength-meter" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Dṛṣṭi strength (virūpa)</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>Graded aspect — ¼, ½, ¾, full</h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", alignItems: "center" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase", marginRight: "0.2rem" }}>Planet:</span>
          {PLANETS.map((pl, i) => (
            <button
              key={pl.name}
              type="button"
              aria-pressed={planetIdx === i}
              onClick={() => setPlanetIdx(i)}
              title={pl.name}
              style={{ border: `1px solid ${planetIdx === i ? GOLD : HAIRLINE}`, borderRadius: 8, background: planetIdx === i ? GOLD : "transparent", color: planetIdx === i ? "#fff" : INK_SECONDARY, padding: "0.25rem 0.5rem", fontWeight: 850, fontSize: "0.95rem", cursor: "pointer" }}
            >
              {pl.glyph}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.55rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: INK_MUTED, fontSize: "0.74rem", fontWeight: 900, textTransform: "uppercase" }}>In house:</span>
          <input type="range" min={1} max={12} value={house} onChange={(e) => setHouse(Number(e.target.value))} style={{ accentColor: GOLD }} aria-label="planet's house" />
          <strong style={{ color: GOLD }}>{house}</strong>
          {p.special ? <span style={{ marginLeft: "auto", color: RED, fontWeight: 800, fontSize: "0.82rem" }}>{p.name} upgrades its special aspect to full (60)</span> : <span style={{ marginLeft: "auto", color: INK_MUTED, fontSize: "0.82rem" }}>{p.name}: only the 7th is full</span>}
        </div>
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="virūpa strength by house">
        <div style={{ display: "grid", gap: "0.3rem" }}>
          {aspected.map((r) => (
            <div key={r.target} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "3.2rem", color: INK_SECONDARY, fontWeight: 800, fontSize: "0.82rem" }}>H{r.target}</span>
              <span style={{ width: "2.6rem", color: INK_MUTED, fontSize: "0.76rem" }}>{r.d}th</span>
              <div style={{ flex: 1, height: "1.1rem", background: `${HAIRLINE}`, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${(r.v / 60) * 100}%`, height: "100%", background: tierColor(r.v) }} />
              </div>
              <span style={{ width: "5.5rem", textAlign: "right", color: tierColor(r.v), fontWeight: 900, fontSize: "0.82rem" }}>{r.v} · {tierLabel(r.v)}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: "0.7rem 0 0", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5 }}>
          Every graha casts <strong style={{ color: RED }}>full (60)</strong> on its 7th, <strong style={{ color: GREEN }}>¾ (45)</strong> on the 4th/8th, <strong style={{ color: GREEN }}>½ (30)</strong> on the 5th/9th, <strong style={{ color: GREEN }}>¼ (15)</strong> on the 3rd/10th. Mars, Jupiter, and Saturn upgrade <em>their</em> partial (4/8, 5/9, 3/10) to full — that is what makes those aspects &ldquo;special.&rdquo; Whole-house at this level; the degree-precise sphuṭa value comes later.
        </p>
      </section>
    </div>
  );
}
