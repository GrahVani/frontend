"use client";

import React, { useState, useMemo } from "react";
import { RASHIS } from "../rashi-data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const VENUS_PINK = "#e11d48"; // Rose-red Venus color from Chapter 4
const JUPITER_YELLOW = GOLD; // Gold Jupiter color from Chapter 4
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

const CARA_COLOR = "#be123c"; // Movable (Cara) - Crimson
const STHIRA_COLOR = "#0f766e"; // Fixed (Sthira) - Teal
const DVI_COLOR = "#4338ca"; // Dual (Dvi) - Indigo

const getModality = (signIndex: number): "Movable" | "Fixed" | "Dual" => {
  if ([1, 4, 7, 10].includes(signIndex)) return "Movable";
  if ([2, 5, 8, 11].includes(signIndex)) return "Fixed";
  return "Dual";
};

const getModalityColor = (mod: "Movable" | "Fixed" | "Dual") => {
  if (mod === "Movable") return CARA_COLOR;
  if (mod === "Fixed") return STHIRA_COLOR;
  return DVI_COLOR;
};

const HOUSE_POLYGONS: Record<number, string> = {
  1: "200,10 105,105 200,200 295,105",
  2: "10,10 200,10 105,105",
  3: "10,10 105,105 10,200",
  4: "10,200 105,105 200,200 105,295",
  5: "10,200 105,295 10,390",
  6: "10,390 105,295 200,390",
  7: "200,390 105,295 200,200 295,295",
  8: "200,390 295,295 390,390",
  9: "390,200 295,295 390,390",
  10: "390,200 295,105 200,200 295,295",
  11: "390,10 295,105 390,200",
  12: "200,10 390,10 295,105"
};

const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 105 },
  2: { x: 105, y: 45 },
  3: { x: 45, y: 105 },
  4: { x: 105, y: 200 },
  5: { x: 45, y: 295 },
  6: { x: 105, y: 355 },
  7: { x: 200, y: 295 },
  8: { x: 295, y: 355 },
  9: { x: 355, y: 295 },
  10: { x: 295, y: 200 },
  11: { x: 355, y: 105 },
  12: { x: 295, y: 45 }
};

const HOUSE_SIGN_NUM_POS: Record<number, { x: number; y: number }> = {
  1: { x: 188, y: 142 },
  2: { x: 105, y: 80 },
  3: { x: 80, y: 105 },
  4: { x: 142, y: 188 },
  5: { x: 80, y: 295 },
  6: { x: 105, y: 320 },
  7: { x: 188, y: 258 },
  8: { x: 295, y: 320 },
  9: { x: 320, y: 295 },
  10: { x: 258, y: 188 },
  11: { x: 320, y: 105 },
  12: { x: 295, y: 80 }
};

const HOUSE_LABEL_POSITIONS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 35 },
  2: { x: 105, y: 35 },
  3: { x: 35, y: 80 },
  4: { x: 35, y: 200 },
  5: { x: 35, y: 320 },
  6: { x: 105, y: 365 },
  7: { x: 200, y: 365 },
  8: { x: 295, y: 365 },
  9: { x: 365, y: 320 },
  10: { x: 365, y: 200 },
  11: { x: 365, y: 80 },
  12: { x: 295, y: 35 }
};

export function HamsaMalavyaSynthesis() {
  const [lagnaSign, setLagnaSign] = useState<number>(4); // Default Cancer (4) so exalted Jupiter in H1 is easy to see
  const [jupiterHouse, setJupiterHouse] = useState<number>(1); // 1-12
  const [venusHouse, setVenusHouse] = useState<number>(4); // 1-12
  const [jupiterCombust, setJupiterCombust] = useState<boolean>(false);
  const [jupiterAfflicted, setJupiterAfflicted] = useState<boolean>(false);
  const [venusCombust, setVenusCombust] = useState<boolean>(false);
  const [venusAfflicted, setVenusAfflicted] = useState<boolean>(false);

  // Map houses to signs
  const houseToSign = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      map[h] = ((lagnaSign + h - 2) % 12) + 1;
    }
    return map;
  }, [lagnaSign]);

  // Derived signs
  const jupiterSign = useMemo(() => houseToSign[jupiterHouse], [jupiterHouse, houseToSign]);
  const venusSign = useMemo(() => houseToSign[venusHouse], [venusHouse, houseToSign]);

  const jupiterSignName = useMemo(() => RASHIS[jupiterSign - 1].nameIAST, [jupiterSign]);
  const venusSignName = useMemo(() => RASHIS[venusSign - 1].nameIAST, [venusSign]);

  // Jupiter Dignity
  const jupiterDignity = useMemo(() => {
    if (jupiterSign === 4) return { isDignified: true, label: "Exalted (Cancer)" };
    if ([9, 12].includes(jupiterSign)) return { isDignified: true, label: "Own Sign" };
    if (jupiterSign === 10) return { isDignified: false, label: "Debilitated (Capricorn)" };
    return { isDignified: false, label: "Neutral/Other" };
  }, [jupiterSign]);

  // Venus Dignity
  const venusDignity = useMemo(() => {
    if (venusSign === 12) return { isDignified: true, label: "Exalted (Pisces)" };
    if ([2, 7].includes(venusSign)) return { isDignified: true, label: "Own Sign" };
    if (venusSign === 6) return { isDignified: false, label: "Debilitated (Virgo)" };
    return { isDignified: false, label: "Neutral/Other" };
  }, [venusSign]);

  // Yoga status
  const isHamsaActive = [1, 4, 7, 10].includes(jupiterHouse) && jupiterDignity.isDignified;
  const isMalavyaActive = [1, 4, 7, 10].includes(venusHouse) && venusDignity.isDignified;

  // Scores
  const scores = useMemo(() => {
    let wisdom = 40;
    let grace = 40;
    let synthesisTitle = "Dual Benefic Balance";
    let synthesisDesc = "Jupiter and Venus are in normal positions, providing moderate wisdom and artistic grace.";

    if (isHamsaActive) {
      wisdom = jupiterCombust || jupiterAfflicted ? 70 : 100;
    } else if (jupiterSign === 10) {
      wisdom = 15; // Debilitated
    } else {
      wisdom = [9, 12, 4].includes(jupiterSign) ? 75 : 45; // Dignified off-kendra vs neutral
    }

    if (isMalavyaActive) {
      grace = venusCombust || venusAfflicted ? 70 : 100;
    } else if (venusSign === 6) {
      grace = 15; // Debilitated
    } else {
      grace = [2, 7, 12].includes(venusSign) ? 75 : 45; // Dignified off-kendra vs neutral
    }

    // Synthesis description
    if (isHamsaActive && isMalavyaActive) {
      synthesisTitle = "Haṁsa & Mālavya Double Yoga!";
      synthesisDesc = "Rare and supreme benefic conjunction or mutual angles. The native is gifted with deep philosophical wisdom, benevolence (Jupiter) as well as absolute artistic refinement, spousal fortune, and domestic luxury (Venus).";
      if (jupiterCombust || venusCombust || jupiterAfflicted || venusAfflicted) {
        synthesisTitle += " (Marred/Reduced)";
        synthesisDesc += " However, structural afflictions or combustion limit the ease of their expression.";
      }
    } else if (isHamsaActive) {
      synthesisTitle = "Haṁsa Yoga Active (Wisdom Focus)";
      synthesisDesc = "Jupiter forms Haṁsa Yoga. Confers a noble, highly respected, and deeply spiritual character, prioritizing dharma and education over material luxuries.";
    } else if (isMalavyaActive) {
      synthesisTitle = "Mālavya Yoga Active (Grace Focus)";
      synthesisDesc = "Venus forms Mālavya Yoga. Endows the native with immense charm, magnetic grace, refinement, comfort, love for fine arts, and luxury.";
    }

    // Kendra harmony slider position (0 = purely Jupiter, 100 = purely Venus, 50 = balance)
    let harmonyVal = 50;
    if (wisdom !== grace) {
      harmonyVal = 50 + (grace - wisdom) / 2;
    }

    return { wisdom, grace, harmonyVal, title: synthesisTitle, desc: synthesisDesc };
  }, [isHamsaActive, isMalavyaActive, jupiterSign, venusSign, jupiterCombust, jupiterAfflicted, venusCombust, venusAfflicted]);

  return (
    <div style={{
      background: "rgba(255, 253, 248, 0.6)",
      border: "1px solid rgba(156, 122, 47, 0.15)",
      borderRadius: "16px",
      padding: "24px",
      color: INK_PRIMARY,
      maxWidth: "960px",
      margin: "0 auto",
      boxShadow: "0 8px 32px rgba(72, 48, 16, 0.04)",
      display: "flex",
      flexWrap: "wrap",
      gap: "24px"
    }}>
      {/* Chart Column */}
      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: GOLD_DEEP, letterSpacing: "0.02em" }}>
          Benefic Synthesis Chart (Lagna: {RASHIS[lagnaSign - 1].nameIAST})
        </h3>

        <div style={{ position: "relative", width: "100%", maxWidth: "380px", aspectRatio: "1/1" }}>
          <svg viewBox="0 0 400 400" style={{ width: "100%", height: "100%", background: "#fffdf8", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "12px", overflow: "visible" }}>
            {/* Render Houses */}
            {Array.from({ length: 12 }, (_, i) => {
              const h = i + 1;
              const signNum = houseToSign[h];
              const isKendra = [1, 4, 7, 10].includes(h);
              const hasJu = jupiterHouse === h;
              const hasVe = venusHouse === h;

              return (
                <g key={`synth-h-${h}`}>
                  <polygon
                    points={HOUSE_POLYGONS[h]}
                    fill={hasJu && hasVe ? "rgba(156, 122, 47, 0.04)" : (hasJu ? "rgba(180, 83, 9, 0.03)" : (hasVe ? "rgba(219, 39, 119, 0.03)" : "transparent"))}
                    stroke={hasJu || hasVe ? GOLD : (isKendra ? "rgba(156, 122, 47, 0.3)" : "rgba(156, 122, 47, 0.12)")}
                    strokeWidth={hasJu || hasVe ? 2 : (isKendra ? 1.5 : 1)}
                  />
                  <text x={HOUSE_LABEL_POSITIONS[h].x} y={HOUSE_LABEL_POSITIONS[h].y} fill="rgba(107, 95, 82, 0.15)" fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    H{h}
                  </text>
                  <text x={HOUSE_SIGN_NUM_POS[h].x} y={HOUSE_SIGN_NUM_POS[h].y} fill={getModalityColor(getModality(signNum))} fontSize="10.5" fontWeight="800" textAnchor="middle" dominantBaseline="central">
                    {signNum}
                  </text>

                  {/* Render planet badges inside the house */}
                  {hasJu && (
                    <g transform={`translate(${HOUSE_CENTERS[h].x - (hasVe ? 18 : 0)}, ${HOUSE_CENTERS[h].y})`}>
                      <rect x="-16" y="-9" width="32" height="18" rx="4" fill={JUPITER_YELLOW} stroke="#ffffff" strokeWidth="0.8" />
                      <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="700">Ju(गु)</text>
                    </g>
                  )}

                  {hasVe && (
                    <g transform={`translate(${HOUSE_CENTERS[h].x + (hasJu ? 18 : 0)}, ${HOUSE_CENTERS[h].y})`}>
                      <rect x="-16" y="-9" width="32" height="18" rx="4" fill={VENUS_PINK} stroke="#ffffff" strokeWidth="0.8" />
                      <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="700">Ve(शु)</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Standard Chart Diagonals */}
            <g stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1.2" fill="none">
              <rect x="10" y="10" width="380" height="380" />
              <line x1="10" y1="10" x2="390" y2="390" />
              <line x1="390" y1="10" x2="10" y2="390" />
              <line x1="200" y1="10" x2="10" y2="200" />
              <line x1="10" y1="200" x2="200" y2="390" />
              <line x1="200" y1="390" x2="390" y2="200" />
              <line x1="390" y1="200" x2="200" y2="10" />
            </g>

            {/* Central Circle */}
            <circle cx="200" cy="200" r="44" fill="#fffdf8" stroke={GOLD} strokeWidth="1.2" />
            <text x="200" y="198" textAnchor="middle" fill={GOLD_DEEP} fontSize="9" fontWeight="950" letterSpacing="0.05em">BENEFIC</text>
            <text x="200" y="210" textAnchor="middle" fill={GOLD_DEEP} fontSize="9" fontWeight="950" letterSpacing="0.05em">SYNTHESIS</text>
          </svg>
        </div>
      </div>

      {/* Controls and Gauges Column */}
      <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Controls Block */}
        <div style={{
          background: "rgba(255, 255, 255, 0.4)",
          border: "1px solid rgba(156, 122, 47, 0.1)",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "6px" }}>1. Lagna Sign (Shared Ascendant)</label>
            <select
              value={lagnaSign}
              onChange={(e) => setLagnaSign(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid rgba(156,122,47,0.2)",
                background: "#ffffff",
                fontSize: "12px",
                color: INK_PRIMARY,
                fontWeight: 600,
                outline: "none"
              }}
            >
              {RASHIS.map(r => (
                <option key={r.number} value={r.number}>Sign {r.number} — {r.nameIAST} ({r.nameEnglish})</option>
              ))}
            </select>
          </div>

          {/* Jupiter controls */}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: JUPITER_YELLOW }}>
              <span>♃ JUPITER (GURU)</span>
              <span>Sign: {jupiterSignName} ({jupiterDignity.label})</span>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <select
                  value={jupiterHouse}
                  onChange={(e) => setJupiterHouse(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid rgba(156,122,47,0.15)",
                    background: "#ffffff",
                    fontSize: "11.5px",
                    fontWeight: 600
                  }}
                >
                  {Array.from({ length: 12 }, (_, idx) => {
                    const h = idx + 1;
                    const isK = [1, 4, 7, 10].includes(h);
                    return <option key={`juh-${h}`} value={h}>House {h} {isK ? "(Kendra)" : ""}</option>;
                  })}
                </select>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600 }}>
                <input type="checkbox" checked={jupiterCombust} onChange={(e) => setJupiterCombust(e.target.checked)} />
                Combust
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600 }}>
                <input type="checkbox" checked={jupiterAfflicted} onChange={(e) => setJupiterAfflicted(e.target.checked)} />
                Afflict
              </label>
            </div>
          </div>

          {/* Venus controls */}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: VENUS_PINK }}>
              <span>♀ VENUS (ŚUKRA)</span>
              <span>Sign: {venusSignName} ({venusDignity.label})</span>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <select
                  value={venusHouse}
                  onChange={(e) => setVenusHouse(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid rgba(156,122,47,0.15)",
                    background: "#ffffff",
                    fontSize: "11.5px",
                    fontWeight: 600
                  }}
                >
                  {Array.from({ length: 12 }, (_, idx) => {
                    const h = idx + 1;
                    const isK = [1, 4, 7, 10].includes(h);
                    return <option key={`veh-${h}`} value={h}>House {h} {isK ? "(Kendra)" : ""}</option>;
                  })}
                </select>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600 }}>
                <input type="checkbox" checked={venusCombust} onChange={(e) => setVenusCombust(e.target.checked)} style={{ accentColor: VENUS_PINK }} />
                Combust
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600 }}>
                <input type="checkbox" checked={venusAfflicted} onChange={(e) => setVenusAfflicted(e.target.checked)} style={{ accentColor: VENUS_PINK }} />
                Afflict
              </label>
            </div>
          </div>
        </div>

        {/* Synthesis Gauges */}
        <div style={{
          background: "rgba(255, 255, 255, 0.5)",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "14px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          <div>
            <h4 style={{ fontSize: "14.5px", fontWeight: 850, margin: "0 0 4px 0", color: GOLD_DEEP }}>
              {scores.title}
            </h4>
            <p style={{ fontSize: "13px", lineHeight: "1.45", color: INK_SECONDARY, margin: 0 }}>
              {scores.desc}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid rgba(156,122,47,0.1)", paddingTop: "14px" }}>

            {/* Dharmic Wisdom (Jupiter) */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, marginBottom: "3px" }}>
                <span>📖 DHARMIC WISDOM (HAṀSA SCORE)</span>
                <span style={{ color: JUPITER_YELLOW }}>{scores.wisdom}%</span>
              </div>
              <div style={{ width: "100%", height: "7px", background: "rgba(0,0,0,0.05)", borderRadius: "3.5px" }}>
                <div style={{ width: `${scores.wisdom}%`, height: "100%", background: JUPITER_YELLOW, borderRadius: "3.5px" }} />
              </div>
            </div>

            {/* Sensory Grace (Venus) */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, marginBottom: "3px" }}>
                <span>🎨 ARTISTIC GRACE & LUXURY (MĀLAVYA SCORE)</span>
                <span style={{ color: VENUS_PINK }}>{scores.grace}%</span>
              </div>
              <div style={{ width: "100%", height: "7px", background: "rgba(0,0,0,0.05)", borderRadius: "3.5px" }}>
                <div style={{ width: `${scores.grace}%`, height: "100%", background: VENUS_PINK, borderRadius: "3.5px" }} />
              </div>
            </div>

            {/* Kendra Harmony Gauge */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>
                <span>⚖️ KENDRA HARMONY BALANCE</span>
                <span>
                  {scores.harmonyVal < 40
                    ? "Ascetic focus"
                    : scores.harmonyVal > 60
                      ? "Sensory refinement"
                      : "Ideal Synthesis"}
                </span>
              </div>
              <div style={{ position: "relative", width: "100%", height: "12px", background: "linear-gradient(to right, #b45309, #db2777)", borderRadius: "6px" }}>
                <div style={{
                  position: "absolute",
                  left: `${scores.harmonyVal}%`,
                  top: "-2px",
                  width: "16px",
                  height: "16px",
                  background: "#ffffff",
                  border: `2.5px solid ${GOLD}`,
                  borderRadius: "50%",
                  transform: "translateX(-50%)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
                  transition: "left 0.3s ease"
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED, marginTop: "4px" }}>
                <span>Guru (Dharma/Philosophy)</span>
                <span>Śukra (Arts/Luxuries)</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
