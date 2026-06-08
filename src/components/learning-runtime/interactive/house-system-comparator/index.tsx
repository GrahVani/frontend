"use client";

import { useState } from "react";
import { RotateCcw, Tag } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A23A1E";

// Rising sign fixed to Mesa (matching the lesson's worked examples). The planet
// sits somewhere in the rising sign, so whole-sign always puts it in the 1st;
// the cusp systems may pull it into the 12th or 2nd near a boundary.
const RISING = "Meṣa";

function ordinal(n: number) {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

// House of a longitude given the longitude of the 1st-house cusp (its starting
// junction). Whole 30-degree houses measured forward from that junction.
function houseFromFirstCusp(planetLon: number, firstCuspLon: number) {
  return Math.floor((((planetLon - firstCuspLon) % 360) + 360) % 360 / 30) + 1;
}

export function HouseSystemComparator() {
  const [lagnaDeg, setLagnaDeg] = useState(10); // exact degree of the Lagna within Mesa
  const [planetDeg, setPlanetDeg] = useState(28); // the planet's degree within Mesa
  const [nameSystem, setNameSystem] = useState(true);

  // Planet is in the rising sign (Mesa, 0-30 absolute longitude).
  const wholeSign = 1; // the planet is in the Lagna's own sign
  const equal = houseFromFirstCusp(planetDeg, lagnaDeg); // Lagna degree = 1st cusp (start)
  const sripati = houseFromFirstCusp(planetDeg, lagnaDeg - 15); // Lagna degree = bhava-madhya (midpoint)

  const split = !(wholeSign === equal && wholeSign === sripati);

  const rows: { system: string; house: number | null; note: string }[] = [
    { system: "Whole-sign", house: wholeSign, note: "the house IS the sign (curriculum default)" },
    { system: "Equal-house", house: equal, note: "30° houses from the Lagna degree" },
    { system: "Sripati / Bhāva-chalita", house: sripati, note: "Lagna degree = bhāva-madhya (midpoint)" },
    { system: "Placidus", house: null, note: "latitude-dependent — precise cusps in Lesson 6.7.2 (KP/Western)" },
  ];

  return (
    <div data-interactive="house-system-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>House-system comparator</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>One planet, four house systems</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setLagnaDeg(10);
              setPlanetDeg(28);
              setNameSystem(true);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.9rem" }} aria-label="Inputs">
          <label style={{ display: "block" }}>
            <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.86rem" }}>Lagna at {lagnaDeg}° {RISING}</span>
            <input type="range" min={0} max={29} step={1} value={lagnaDeg} onChange={(e) => setLagnaDeg(Number(e.target.value))} aria-label="Lagna degree within the rising sign" style={{ width: "100%", accentColor: GOLD }} />
          </label>
          <label style={{ display: "block" }}>
            <span style={{ color: INK_SECONDARY, fontWeight: 800, fontSize: "0.86rem" }}>Planet at {planetDeg}° {RISING}</span>
            <input type="range" min={0} max={29} step={1} value={planetDeg} onChange={(e) => setPlanetDeg(Number(e.target.value))} aria-label="Planet degree within the rising sign" style={{ width: "100%", accentColor: RED }} />
          </label>
          <button
            type="button"
            aria-pressed={nameSystem}
            onClick={() => setNameSystem((v) => !v)}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", border: `1px solid ${nameSystem ? GREEN : HAIRLINE}`, borderRadius: 8, background: nameSystem ? GREEN : "transparent", color: nameSystem ? "#fff" : INK_SECONDARY, padding: "0.5rem 0.7rem", fontWeight: 850, cursor: "pointer", width: "fit-content" }}
          >
            <Tag size={14} aria-hidden="true" />
            Name your system: {nameSystem ? "on" : "off"}
          </button>
          <section style={{ border: `1px solid ${split ? RED : GREEN}`, borderRadius: 8, background: split ? `${RED}14` : `${GREEN}14`, padding: "0.8rem" }}>
            <div style={{ color: split ? RED : GREEN, fontWeight: 900 }}>{split ? "Systems split" : "Systems agree"}</div>
            <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              {split
                ? `Near the boundary, the cusp systems pull the planet out of the whole-sign 1st. Always say which system you read by.`
                : `Well inside the sign, the systems agree — disagreement clusters at the edges, not the middle.`}
            </p>
          </section>
        </section>

        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="House under each system">
          <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
            Planet at {planetDeg}° {RISING} — its house by system
          </div>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {rows.map((r) => {
              const isWhole = r.system === "Whole-sign";
              const differs = r.house != null && r.house !== wholeSign;
              return (
                <div
                  key={r.system}
                  style={{
                    border: `1px solid ${isWhole ? GOLD : differs ? RED : HAIRLINE}`,
                    borderRadius: 8,
                    background: isWhole ? `${GOLD}14` : differs ? `${RED}0D` : "rgba(255,251,241,0.6)",
                    padding: "0.7rem 0.8rem",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.6rem",
                    flexWrap: "wrap",
                  }}
                >
                  <strong style={{ color: isWhole ? GOLD : INK_PRIMARY, minWidth: "9.5rem" }}>{r.system}</strong>
                  <span style={{ color: r.house == null ? INK_MUTED : differs ? RED : GREEN, fontWeight: 900, fontSize: "1.02rem" }}>
                    {r.house == null ? "—" : `${r.house}${ordinal(r.house)} house`}
                  </span>
                  {nameSystem ? <span style={{ marginLeft: "auto", color: INK_MUTED, fontSize: "0.8rem", fontStyle: "italic" }}>{r.note}</span> : null}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
