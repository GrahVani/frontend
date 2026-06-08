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

export function BudhadityaChecker() {
  const [lagnaSign, setLagnaSign] = useState<number>(1);
  const [sunHouse, setSunHouse] = useState<number>(1);

  // Placement details
  const [isSameSign, setIsSameSign] = useState<boolean>(true);
  const [separation, setSeparation] = useState<number>(8); // default 8 degrees
  const [isRetrograde, setIsRetrograde] = useState<boolean>(false);
  const [convention, setConvention] = useState<"graded" | "strict" | "inclusive">("graded");

  // Map each house to its rashi sign number based on Lagna sign
  const houseToSign = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      map[h] = ((lagnaSign - 1 + h - 1) % 12) + 1;
    }
    return map;
  }, [lagnaSign]);

  // Derived placement houses
  const mercuryHouse = useMemo(() => {
    if (isSameSign) return sunHouse;
    return (sunHouse % 12) + 1; // adjacent house
  }, [isSameSign, sunHouse]);

  // Combustion calculation details
  // Mercury combust limits: 14° direct, 12° retrograde from Sun
  const combustionLimit = isRetrograde ? 12 : 14;
  const isCombust = useMemo(() => {
    return isSameSign && separation <= combustionLimit;
  }, [isSameSign, separation, combustionLimit]);

  // Determine structural yoga active state
  const isStructuralActive = isSameSign;

  // Resolve Yoga Verdict based on Convention
  const yogaResult = useMemo(() => {
    if (!isStructuralActive) {
      return {
        state: "NONE",
        title: "No Yoga",
        description: "Mercury and the Sun must share a sign to form Budha-Āditya Yoga. They are currently in different signs.",
        badgeColor: INK_MUTED
      };
    }

    if (convention === "strict") {
      if (isCombust) {
        return {
          state: "CANCELLED",
          title: "Budha-Āditya (Cancelled)",
          description: `Failed under Strict Convention. Mercury is combust within ${combustionLimit}° of the Sun, which is held to cancel the yoga.`,
          badgeColor: CARA_COLOR
        };
      } else {
        return {
          state: "ACTIVE",
          title: "Budha-Āditya Active",
          description: `Active & Clean. Mercury is conjoined same-sign and bright at ${separation}° separation (outside the ${combustionLimit}° combustion limit).`,
          badgeColor: STHIRA_COLOR
        };
      }
    }

    if (convention === "inclusive") {
      return {
        state: "ACTIVE",
        title: "Budha-Āditya Active",
        description: `Active. Under the Inclusive Convention, the Sun's proximity is held to amplify Mercury's intellectual prominence, even with combustion active.`,
        badgeColor: STHIRA_COLOR
      };
    }

    // Default: Graded/Practical synthesis
    if (isCombust) {
      return {
        state: "QUALIFIED",
        title: "Budha-Āditya (Qualified / Combust)",
        description: `Structurally active, but qualified. Deep combustion (${separation}° separation) means the intellect is brilliant but may be more internalized or bound to the ego.`,
        badgeColor: GOLD_DEEP
      };
    } else {
      return {
        state: "ACTIVE",
        title: "Budha-Āditya Active (Clean)",
        description: `Strong and clean. Mercury is same-sign and bright at ${separation}° separation. Intellect and eloquence are highly elevated and outwardly recognized.`,
        badgeColor: STHIRA_COLOR
      };
    }
  }, [isStructuralActive, isCombust, separation, combustionLimit, convention]);

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
          <Sparkles size={18} /> Budha-Āditya Combustion Paradox Checker
        </h3>
        <span style={{ fontSize: "12px", color: INK_SECONDARY }}>
          Study how same-sign conjunction forms the yoga, and analyze the combustion limits of Mercury.
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
              const isSun = h === sunHouse;
              const isMerc = h === mercuryHouse;

              // Modality Coloring
              const modality = getModality(signNum);
              const signColor = getModalityColor(modality);

              let fill = "transparent";
              let stroke = "rgba(156, 122, 47, 0.12)";
              let strokeWidth = 1;

              if (isSun) {
                fill = "rgba(201, 162, 77, 0.05)";
                stroke = "#C9A24D";
                strokeWidth = 1.5;
              } else if (isMerc) {
                fill = "rgba(15, 118, 110, 0.05)";
                stroke = STHIRA_COLOR;
                strokeWidth = 1.5;
              }

              return (
                <g key={`budhaditya-house-${h}`}>
                  <polygon points={HOUSE_POLYGONS[h]} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />

                  {/* House ID Label */}
                  <text x={HOUSE_LABEL_POSITIONS[h].x} y={HOUSE_LABEL_POSITIONS[h].y} fill="rgba(107, 95, 82, 0.2)" fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    H{h}
                  </text>

                  {/* Sign Number */}
                  <text x={HOUSE_SIGN_NUM_POS[h].x} y={HOUSE_SIGN_NUM_POS[h].y} fill={signColor} fontSize="10.5" fontWeight="900" textAnchor="middle" dominantBaseline="central">
                    {signNum}
                  </text>

                  {/* Badges */}
                  <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`}>
                    {isSun && (
                      <g transform={`translate(0, ${isSameSign ? -10 : 0})`}>
                        <rect x="-22" y="-9" width="44" height="18" rx="4" fill="#C9A24D" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        <text y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">Su(सू)</text>
                      </g>
                    )}

                    {isMerc && (
                      <g transform={`translate(0, ${isSameSign ? 10 : 0})`}>
                        <rect x="-22" y="-9" width="44" height="18" rx="4" fill={isCombust ? "#e11d48" : STHIRA_COLOR} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        <text y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">
                          Me(बु){isRetrograde && " R"}
                        </text>
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

            {/* Central Masking Medallion */}
            <circle cx="200" cy="200" r="44" fill="#fffdf8" stroke={GOLD} strokeWidth="1.2" style={{ filter: "drop-shadow(0px 3px 6px rgba(72,48,16,0.06))" }} />
            <text x="200" y="203" textAnchor="middle" fill={GOLD_DEEP} fontSize="9" fontWeight="900" letterSpacing="0.05em">BUDHĀDITYA</text>
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

            {/* Sun House */}
            <div style={{ flex: "1 1 110px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "3px" }}>Sun House Placement:</label>
              <select
                value={sunHouse}
                onChange={(e) => setSunHouse(Number(e.target.value))}
                style={{ width: "100%", padding: "4px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff" }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                  <option key={h} value={h}>H{h} (Sign {houseToSign[h]})</option>
                ))}
              </select>
            </div>

            {/* Sign relationship */}
            <div style={{ flex: "1 1 110px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "3px" }}>Mercury Placement:</label>
              <select
                value={isSameSign ? "same" : "adjacent"}
                onChange={(e) => setIsSameSign(e.target.value === "same")}
                style={{ width: "100%", padding: "4px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff" }}
              >
                <option value="same">Same Sign</option>
                <option value="adjacent">Adjacent Sign</option>
              </select>
            </div>
          </div>
        </div>

        {/* Slider & Degree Scale */}
        {isStructuralActive && (
          <div style={{ background: "rgba(255, 251, 240, 0.3)", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700 }}>
              <span>Mercury-Sun Separation:</span>
              <span style={{ color: GOLD_DEEP }}>{separation}°</span>
            </div>

            <input
              type="range"
              min="0"
              max="30"
              value={separation}
              onChange={(e) => setSeparation(Number(e.target.value))}
              style={{ width: "100%", accentColor: GOLD }}
            />

            {/* Visual Combustion Zones Ruler */}
            <div style={{ marginTop: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED, marginBottom: "4px" }}>
                <span>0° (Exact)</span>
                <span>10°</span>
                <span>20°</span>
                <span>30°</span>
              </div>
              <div style={{ width: "100%", height: "14px", background: "rgba(15, 118, 110, 0.08)", borderRadius: "4px", display: "flex", overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", position: "relative" }}>
                {/* Shaded combustion band */}
                <div style={{ width: `${(combustionLimit / 30) * 100}%`, height: "100%", background: "rgba(225, 29, 72, 0.12)", borderRight: "1.5px dashed #e11d48" }} />

                {/* Mercury Marker Pin */}
                <div
                  style={{
                    position: "absolute",
                    left: `calc(${(separation / 30) * 100}% - 4px)`,
                    top: "-2px",
                    width: "8px",
                    height: "18px",
                    background: isCombust ? "#e11d48" : STHIRA_COLOR,
                    borderRadius: "2px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9.5px", marginTop: "4px" }}>
                <span style={{ color: "#e11d48", fontWeight: 600 }}>Combustion Zone (0°-{combustionLimit}°)</span>
                <span style={{ color: STHIRA_COLOR, fontWeight: 600 }}>Safe Zone</span>
              </div>
            </div>

            {/* Retrograde Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(156,122,47,0.08)", paddingTop: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700 }}>Mercury retrograde status:</span>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isRetrograde}
                  onChange={(e) => setIsRetrograde(e.target.checked)}
                  style={{ accentColor: GOLD }}
                />
                <span>Retrograde (Orb changes to 12°)</span>
              </label>
            </div>

          </div>
        )}

        {/* Interpretive Convention Dropdown */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11.5px", fontWeight: 700 }}>Astrological Convention:</span>
          <select
            value={convention}
            onChange={(e) => setConvention(e.target.value as any)}
            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff" }}
          >
            <option value="graded">Graded/Practical Synthesis (Recommended)</option>
            <option value="strict">Strict (Combustion cancels yoga)</option>
            <option value="inclusive">Inclusive (Proximity always conjoins)</option>
          </select>
        </div>

        {/* Verdict Box */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.4)",
            border: `1px solid ${yogaResult.badgeColor}`,
            padding: "16px",
            borderRadius: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: "4px",
                background: yogaResult.badgeColor,
                color: "#fff"
              }}
            >
              {yogaResult.state}
            </span>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: yogaResult.badgeColor }}>
              {yogaResult.title}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.5", color: INK_SECONDARY }}>
            {yogaResult.description}
          </p>
        </div>
      </div>
    </div>
  );
}
