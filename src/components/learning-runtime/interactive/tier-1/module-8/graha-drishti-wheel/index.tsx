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

type Nature = "benefic" | "malefic" | "neutral";
interface Planet { name: string; glyph: string; nature: Nature; specials: number[] }

// Every graha casts the full 7th aspect. Mars also 4th/8th, Jupiter 5th/9th, Saturn 3rd/10th.
const PLANETS: Planet[] = [
  { name: "Sun", glyph: "☉", nature: "malefic", specials: [] },
  { name: "Moon", glyph: "☽", nature: "benefic", specials: [] },
  { name: "Mars", glyph: "♂", nature: "malefic", specials: [4, 8] },
  { name: "Mercury", glyph: "☿", nature: "neutral", specials: [] },
  { name: "Jupiter", glyph: "♃", nature: "benefic", specials: [5, 9] },
  { name: "Venus", glyph: "♀", nature: "benefic", specials: [] },
  { name: "Saturn", glyph: "♄", nature: "malefic", specials: [3, 10] },
  { name: "Rāhu", glyph: "☊", nature: "malefic", specials: [] },
  { name: "Ketu", glyph: "☋", nature: "malefic", specials: [] },
];

// The house n-from h (inclusive count, h = 1st).
const aspectHouse = (h: number, n: number) => ((h - 1 + (n - 1)) % 12) + 1;
const NATURE_C: Record<Nature, string> = { benefic: GREEN, malefic: RED, neutral: GOLD };

export function GrahaDrishtiWheel() {
  const [planetIdx, setPlanetIdx] = useState(0); // Sun
  const [house, setHouse] = useState(1);
  const p = PLANETS[planetIdx];

  const seventh = aspectHouse(house, 7);
  const specialHouses = p.specials.map((n) => aspectHouse(house, n));
  const aspected = new Set<number>([seventh, ...specialHouses]);

  return (
    <div data-interactive="graha-drishti-wheel" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Graha-dṛṣṭi</p>
        <h2 style={{ margin: "0.2rem 0 0.5rem", color: GOLD, fontSize: "1.3rem" }}>The planetary aspect (every graha sees its 7th)</h2>

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
          <span style={{ marginLeft: "auto", color: NATURE_C[p.nature], fontWeight: 800, fontSize: "0.82rem", textTransform: "capitalize" }}>{p.name}: {p.nature}</span>
        </div>
      </section>

      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ position: "relative", width: "min(20rem, 80vw)", height: "min(20rem, 80vw)", margin: "0 auto" }}>
          {Array.from({ length: 12 }, (_, i) => {
            const h = i + 1;
            const angle = (-90 + i * 30) * (Math.PI / 180);
            const x = 50 + 40 * Math.cos(angle);
            const y = 50 + 40 * Math.sin(angle);
            const isPlanet = h === house;
            const is7 = h === seventh;
            const isSpecial = specialHouses.includes(h);
            const bg = isPlanet ? GOLD : is7 ? `${RED}26` : isSpecial ? `${GREEN}1F` : "transparent";
            const border = isPlanet ? GOLD : is7 ? RED : isSpecial ? GREEN : HAIRLINE;
            return (
              <div
                key={h}
                style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", width: "3.1rem", height: "3.1rem", border: `2px solid ${border}`, borderRadius: 8, background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: 1.1 }}
              >
                <span style={{ fontSize: "0.66rem", fontWeight: 900, color: isPlanet ? "#fff" : INK_MUTED }}>H{h}</span>
                {isPlanet ? <span style={{ fontSize: "1.05rem", color: "#fff" }}>{p.glyph}</span> : is7 ? <span style={{ fontSize: "0.6rem", fontWeight: 900, color: RED }}>7th ◄</span> : isSpecial ? <span style={{ fontSize: "0.58rem", fontWeight: 800, color: GREEN }}>aspect</span> : null}
              </div>
            );
          })}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", textAlign: "center", color: INK_MUTED, fontSize: "0.7rem", fontWeight: 800 }}>
            dṛṣṭi
          </div>
        </div>
      </section>

      <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
        <strong style={{ color: GOLD }}>{p.name}</strong> in house {house} casts its full <strong style={{ color: RED }}>7th aspect</strong> on house {seventh}.{" "}
        {p.specials.length ? (
          <>It also has the special aspects of {p.name} — houses <strong style={{ color: GREEN }}>{specialHouses.join(" and ")}</strong> (the {p.specials.join("/")}th). </>
        ) : (
          <>Like all non-Mars/Jupiter/Saturn grahas, it has only the universal 7th. </>
        )}
        Its <span style={{ color: NATURE_C[p.nature], fontWeight: 800 }}>{p.nature}</span> nature colours the <em>effect</em> of that gaze — a benefic blesses what it sees, a malefic stresses it — though the geometry is the same.
      </p>
    </div>
  );
}
