"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, AlertCircle, Info, HelpCircle } from "lucide-react";
import { RASHIS } from "../rashi-data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const INDIGO = "#4F6FA8";
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

// SVG layout coordinates for North Indian chart
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
  1: { x: 186, y: 144 },
  2: { x: 105, y: 80 },
  3: { x: 80, y: 105 },
  4: { x: 144, y: 186 },
  5: { x: 80, y: 295 },
  6: { x: 105, y: 325 },
  7: { x: 186, y: 256 },
  8: { x: 295, y: 325 },
  9: { x: 320, y: 295 },
  10: { x: 256, y: 186 },
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

export function GajakesariSimulator() {
  const [lagnaSign, setLagnaSign] = useState<number>(1);
  const [moonHouse, setMoonHouse] = useState<number>(1);
  const [jupiterHouse, setJupiterHouse] = useState<number>(4); // default in 4th (kendra)

  // Sign selectors to configure dignity
  const [moonSign, setMoonSign] = useState<number>(4);     // Cancer (Own Sign)
  const [jupiterSign, setJupiterSign] = useState<number>(4);  // Cancer (Exalted)

  // Afflictions
  const [isMoonCombust, setIsMoonCombust] = useState<boolean>(false);
  const [isJupiterCombust, setIsJupiterCombust] = useState<boolean>(false);
  const [isAfflicted, setIsAfflicted] = useState<boolean>(false);

  // Map each house to its rashi sign number based on Lagna sign
  const houseToSign = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      map[h] = ((lagnaSign - 1 + h - 1) % 12) + 1;
    }
    return map;
  }, [lagnaSign]);

  // Derived signs from chart layout
  const currentMoonSign = useMemo(() => houseToSign[moonHouse], [moonHouse, houseToSign]);
  const currentJupiterSign = useMemo(() => houseToSign[jupiterHouse], [jupiterHouse, houseToSign]);

  // Kendra Calculation
  const houseDiff = useMemo(() => {
    return ((jupiterHouse - moonHouse + 12) % 12) + 1;
  }, [jupiterHouse, moonHouse]);

  const isKendra = useMemo(() => {
    return [1, 4, 7, 10].includes(houseDiff);
  }, [houseDiff]);

  // Dignity calculations
  const moonDignity = useMemo(() => {
    if (currentMoonSign === 2) return { label: "Exalted", score: 20, desc: "Exalted in Taurus (highest emotional support)" };
    if (currentMoonSign === 4) return { label: "Own Sign", score: 15, desc: "Own-sign Cancer (stable, rich mind)" };
    if (currentMoonSign === 8) return { label: "Debilitated", score: -20, desc: "Debilitated in Scorpio (unsteady mind)" };
    return { label: "Neutral / Other", score: 0, desc: "Neutral sign placement" };
  }, [currentMoonSign]);

  const jupiterDignity = useMemo(() => {
    if (currentJupiterSign === 4) return { label: "Exalted", score: 20, desc: "Exalted in Cancer (wise guidance)" };
    if ([9, 12].includes(currentJupiterSign)) return { label: "Own Sign", score: 15, desc: "Own-sign Sagittarius/Pisces" };
    if (currentJupiterSign === 10) return { label: "Debilitated", score: -20, desc: "Debilitated in Capricorn (weakened intelligence)" };
    return { label: "Neutral / Other", score: 0, desc: "Neutral sign placement" };
  }, [currentJupiterSign]);

  // Strength synthesis (0-100%)
  const strengthPercentage = useMemo(() => {
    if (!isKendra) return 0;

    let score = 40; // Base score
    score += moonDignity.score;
    score += jupiterDignity.score;

    if (isMoonCombust) score -= 15;
    if (isJupiterCombust) score -= 15;
    if (isAfflicted) score -= 15;

    return Math.max(0, Math.min(100, score));
  }, [isKendra, moonDignity, jupiterDignity, isMoonCombust, isJupiterCombust, isAfflicted]);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 248, 0.65)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(72, 48, 16, 0.04)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        gap: "24px"
      }}
    >
      <div style={{ width: "100%", borderBottom: "1px solid rgba(156,122,47,0.12)", paddingBottom: "12px", marginBottom: "8px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={18} /> Gaja-Kesari Yoga Simulator & Strength Calculator
        </h3>
        <span style={{ fontSize: "12px", color: INK_SECONDARY }}>
          Test Jupiter placements from the Moon, assess their dignity, and analyze the resulting strength.
        </span>
      </div>

      {/* SVG Chart Panel */}
      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "100%", maxWidth: "380px", aspectRatio: "1/1", position: "relative" }}>
          <svg viewBox="0 0 400 400" style={{ width: "100%", background: "#fffdf8", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "10px", overflow: "visible" }}>

            {/* Polygons */}
            {Array.from({ length: 12 }, (_, i) => {
              const h = i + 1;
              const signNum = houseToSign[h];
              const isMoon = h === moonHouse;
              const isJupiter = h === jupiterHouse;

              // Modality Coloring
              const modality = getModality(signNum);
              const signColor = getModalityColor(modality);

              let fill = "transparent";
              let stroke = "rgba(156, 122, 47, 0.12)";
              let strokeWidth = 1;

              if (isMoon) {
                fill = "rgba(122, 122, 122, 0.05)";
                stroke = "#7A7A7A";
                strokeWidth = 1.5;
              } else if (isJupiter) {
                fill = "rgba(156, 122, 47, 0.05)";
                stroke = GOLD;
                strokeWidth = 1.5;
              }

              return (
                <g key={`gajakesari-house-${h}`}>
                  <polygon points={HOUSE_POLYGONS[h]} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />

                  {/* House ID Label */}
                  <text x={HOUSE_LABEL_POSITIONS[h].x} y={HOUSE_LABEL_POSITIONS[h].y} fill="rgba(107, 95, 82, 0.2)" fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    H{h}
                  </text>

                  {/* Sign Number */}
                  <text x={HOUSE_SIGN_NUM_POS[h].x} y={HOUSE_SIGN_NUM_POS[h].y} fill={signColor} fontSize="10.5" fontWeight="900" textAnchor="middle" dominantBaseline="central">
                    {signNum}
                  </text>

                  {/* Renders Badges */}
                  <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`}>
                    {isMoon && (
                      <g transform={`translate(0, ${isMoon && isJupiter ? -10 : 0})`}>
                        <rect x="-22" y="-9" width="44" height="18" rx="4" fill="#7A7A7A" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        <text y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">Mo(च)</text>
                      </g>
                    )}

                    {isJupiter && (
                      <g transform={`translate(0, ${isMoon && isJupiter ? 10 : 0})`}>
                        <rect x="-20" y="-9" width="40" height="18" rx="4" fill={GOLD} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">Ju(गु)</text>
                      </g>
                    )}
                  </g>
                </g>
              );
            })}

            {/* Standard Chart Diagonals */}
            <g stroke="rgba(156, 122, 47, 0.12)" strokeWidth="1.2" fill="none">
              <rect x="10" y="10" width="380" height="380" />
              <line x1="10" y1="10" x2="390" y2="390" />
              <line x1="390" y1="10" x2="10" y2="390" />
              <line x1="200" y1="10" x2="10" y2="200" />
              <line x1="10" y1="200" x2="200" y2="390" />
              <line x1="200" y1="390" x2="390" y2="200" />
              <line x1="390" y1="200" x2="200" y2="10" />
            </g>

            {/* Connection Line */}
            {isKendra && (
              <line
                x1={HOUSE_CENTERS[moonHouse].x}
                y1={HOUSE_CENTERS[moonHouse].y}
                x2={HOUSE_CENTERS[jupiterHouse].x}
                y2={HOUSE_CENTERS[jupiterHouse].y}
                stroke={GOLD}
                strokeWidth="2.5"
                strokeDasharray="5,3"
                style={{ filter: "drop-shadow(0px 2px 4px rgba(156,122,47,0.3))" }}
              />
            )}

            {/* Central Masking Medallion */}
            <circle cx="200" cy="200" r="44" fill="#fffdf8" stroke={GOLD} strokeWidth="1.2" style={{ filter: "drop-shadow(0px 3px 6px rgba(72,48,16,0.06))" }} />
            <text x="200" y="203" textAnchor="middle" fill={GOLD_DEEP} fontSize="9.5" fontWeight="900" letterSpacing="0.05em">GAJA-KESARI</text>
          </svg>
        </div>
      </div>

      {/* Control Panel Panel */}
      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* Core Settings */}
        <div style={{ background: "rgba(255, 251, 240, 0.5)", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {/* Lagna Sign */}
            <div style={{ flex: "1 1 110px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "3px" }}>Lagna Sign:</label>
              <select
                value={lagnaSign}
                onChange={(e) => setLagnaSign(Number(e.target.value))}
                style={{ width: "100%", padding: "4px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff" }}
              >
                {RASHIS.map(r => (
                  <option key={r.number} value={r.number}>{r.number}. {r.nameIAST}</option>
                ))}
              </select>
            </div>

            {/* Moon House */}
            <div style={{ flex: "1 1 110px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "3px" }}>Moon House:</label>
              <select
                value={moonHouse}
                onChange={(e) => setMoonHouse(Number(e.target.value))}
                style={{ width: "100%", padding: "4px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff" }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                  <option key={h} value={h}>H{h} (Sign {houseToSign[h]})</option>
                ))}
              </select>
            </div>

            {/* Jupiter House */}
            <div style={{ flex: "1 1 110px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "3px" }}>Jupiter House:</label>
              <select
                value={jupiterHouse}
                onChange={(e) => setJupiterHouse(Number(e.target.value))}
                style={{ width: "100%", padding: "4px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff" }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                  <option key={h} value={h}>H{h} (Sign {houseToSign[h]})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ fontSize: "11px", color: INK_SECONDARY }}>
            Distance: <strong>{houseDiff} houses apart</strong>.
            {isKendra ? " (Kendra relation: Yoga active!)" : " (Not in a Kendra: Yoga is inactive.)"}
          </div>
        </div>

        {/* Affliction Toggles */}
        <div style={{ background: "rgba(255, 251, 240, 0.3)", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <h4 style={{ margin: 0, fontSize: "11.5px", fontWeight: 700, color: GOLD_DEEP }}>Conditions & Afflictions:</h4>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={isMoonCombust}
                disabled={!isKendra}
                onChange={(e) => setIsMoonCombust(e.target.checked)}
                style={{ accentColor: GOLD }}
              />
              <span>Moon is Combust</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={isJupiterCombust}
                disabled={!isKendra}
                onChange={(e) => setIsJupiterCombust(e.target.checked)}
                style={{ accentColor: GOLD }}
              />
              <span>Jupiter is Combust</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={isAfflicted}
                disabled={!isKendra}
                onChange={(e) => setIsAfflicted(e.target.checked)}
                style={{ accentColor: GOLD }}
              />
              <span>Malefic Affliction (Saturn/Rahu)</span>
            </label>
          </div>
        </div>

        {/* Strength Progress and Analysis */}
        {isKendra ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* Strength Bar */}
            <div style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(156,122,47,0.1)", padding: "14px", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                <span>Yoga Strength:</span>
                <span style={{ color: GOLD_DEEP }}>{strengthPercentage}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "rgba(156,122,47,0.12)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${strengthPercentage}%`, height: "100%", background: GOLD, transition: "width 0.3s ease" }} />
              </div>
            </div>

            {/* Analysis details */}
            <div style={{ fontSize: "11.5px", color: INK_SECONDARY, background: "rgba(255,255,255,0.4)", border: "1px solid rgba(156,122,47,0.08)", padding: "12px", borderRadius: "8px" }}>
              <strong>Placements breakdown:</strong>
              <ul style={{ margin: "4px 0 0 12px", padding: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                <li>Moon: Sign {currentMoonSign} — <strong>{moonDignity.desc}</strong></li>
                <li>Jupiter: Sign {currentJupiterSign} — <strong>{jupiterDignity.desc}</strong></li>
                {(isMoonCombust || isJupiterCombust || isAfflicted) && (
                  <li style={{ color: CARA_COLOR }}>
                    Afflictions active: {[
                      isMoonCombust ? "Moon combust" : "",
                      isJupiterCombust ? "Jupiter combust" : "",
                      isAfflicted ? "Malefic affliction" : ""
                    ].filter(Boolean).join(", ")} (-15% each)
                  </li>
                )}
              </ul>
            </div>

          </div>
        ) : (
          <div style={{ background: "rgba(122,122,122,0.05)", border: "1px solid rgba(122,122,122,0.15)", padding: "16px", borderRadius: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
            <Info size={16} style={{ color: INK_MUTED }} />
            <span style={{ fontSize: "12px", color: INK_SECONDARY }}>
              Gaja-Kesari Yoga is not active because Jupiter is in the {houseDiff}th house from the Moon (must be 1st, 4th, 7th, or 10th).
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
