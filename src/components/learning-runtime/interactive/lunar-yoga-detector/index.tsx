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

// Standard compact planet labels
const PLANETS = [
  { name: "Mars", labelEn: "Ma", labelNative: "म", isTara: true, color: CARA_COLOR },
  { name: "Mercury", labelEn: "Me", labelNative: "बु", isTara: true, color: STHIRA_COLOR },
  { name: "Jupiter", labelEn: "Ju", labelNative: "गु", isTara: true, color: GOLD },
  { name: "Venus", labelEn: "Ve", labelNative: "शु", isTara: true, color: "#e11d48" },
  { name: "Saturn", labelEn: "Sa", labelNative: "श", isTara: true, color: INDIGO },
  { name: "Sun", labelEn: "Su", labelNative: "सू", isTara: false, color: "#C9A24D" },
  { name: "Rahu", labelEn: "Ra", labelNative: "रा", isTara: false, color: "#16a34a" },
  { name: "Ketu", labelEn: "Ke", labelNative: "के", isTara: false, color: "#16a34a" }
];

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

export function LunarYogaDetector() {
  const [lagnaSign, setLagnaSign] = useState<number>(1);
  const [moonHouse, setMoonHouse] = useState<number>(1);

  // Keep track of which planets are placed in the Moon's flanking houses
  const [flank2Planets, setFlank2Planets] = useState<string[]>([]);
  const [flank12Planets, setFlank12Planets] = useState<string[]>([]);

  // Derived house placements
  const house2FromMoon = useMemo(() => (moonHouse % 12) + 1, [moonHouse]);
  const house12FromMoon = useMemo(() => ((moonHouse - 2 + 12) % 12) + 1, [moonHouse]);

  // Map each house to its rashi sign number based on Lagna sign
  const houseToSign = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      map[h] = ((lagnaSign - 1 + h - 1) % 12) + 1;
    }
    return map;
  }, [lagnaSign]);

  // Find planets active in flanking positions (excluding Sun/Rahu/Ketu)
  const countable2 = useMemo(() => {
    return flank2Planets.filter(name => {
      const p = PLANETS.find(pl => pl.name === name);
      return p?.isTara ?? false;
    });
  }, [flank2Planets]);

  const countable12 = useMemo(() => {
    return flank12Planets.filter(name => {
      const p = PLANETS.find(pl => pl.name === name);
      return p?.isTara ?? false;
    });
  }, [flank12Planets]);

  // Evaluate Yoga State
  const yogaResult = useMemo(() => {
    const has2 = countable2.length > 0;
    const has12 = countable12.length > 0;

    const hasExcludedIn2 = flank2Planets.some(name => !countable2.includes(name));
    const hasExcludedIn12 = flank12Planets.some(name => !countable12.includes(name));

    let state: "SUNAPHA" | "ANAPHA" | "DURUDHARA" | "KEMADRUMA" = "KEMADRUMA";
    let title = "Kemadruma Yoga";
    let description = "Neither flank is occupied by countable planets. The Moon stands alone.";
    let warning = "";

    if (has2 && has12) {
      state = "DURUDHARA";
      title = "Durudharā Yoga";
      description = `Both flanking houses are occupied by planets: ${countable2.join(", ")} in the 2nd-from-Moon, and ${countable12.join(", ")} in the 12th-from-Moon. This indicates a highly balanced and supported mind.`;
    } else if (has2) {
      state = "SUNAPHA";
      title = "Sunaphā Yoga";
      description = `Countable planet(s) (${countable2.join(", ")}) in the 2nd house from the Moon. This brings resourcefulness and self-earned prosperity.`;
    } else if (has12) {
      state = "ANAPHA";
      title = "Anaphā Yoga";
      description = `Countable planet(s) (${countable12.join(", ")}) in the 12th house from the Moon. This indicates a generous, refined, and spiritual disposition.`;
    }

    if (state === "KEMADRUMA" && (hasExcludedIn2 || hasExcludedIn12)) {
      const excluded = [];
      if (hasExcludedIn2) excluded.push("2nd");
      if (hasExcludedIn12) excluded.push("12th");
      warning = `Note: You have placed the Sun or Nodes in the ${excluded.join(" / ")} from the Moon. Because they are classically excluded, the yoga remains Kemadruma.`;
    }

    return { state, title, description, warning };
  }, [countable2, countable12, flank2Planets, flank12Planets]);

  const handleToggleFlank2 = (name: string) => {
    setFlank2Planets(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const handleToggleFlank12 = (name: string) => {
    setFlank12Planets(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

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
          <Sparkles size={18} /> Lunar Yoga Explorer (Candra-Yoga)
        </h3>
        <span style={{ fontSize: "12px", color: INK_SECONDARY }}>
          Configure the Moon's position and flanking grahas to study Sunaphā, Anaphā, Durudharā, and Kemadruma.
        </span>
      </div>

      {/* SVG Chart Panel */}
      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "100%", maxWidth: "380px", aspectRatio: "1/1", position: "relative" }}>
          <svg viewBox="0 0 400 400" style={{ width: "100%", background: "#fffdf8", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "10px", overflow: "visible" }}>

            {/* House Polygons & Shading */}
            {Array.from({ length: 12 }, (_, i) => {
              const h = i + 1;
              const signNum = houseToSign[h];
              const isMoon = h === moonHouse;
              const isFlank2 = h === house2FromMoon;
              const isFlank12 = h === house12FromMoon;

              // Sign Modality coloring
              const modality = getModality(signNum);
              const signColor = getModalityColor(modality);

              // Shading color
              let fill = "transparent";
              let stroke = "rgba(156, 122, 47, 0.15)";
              let strokeWidth = 1;

              if (isMoon) {
                fill = "rgba(79, 111, 168, 0.05)";
                stroke = INDIGO;
                strokeWidth = 2;
              } else if (isFlank2) {
                fill = "rgba(156, 122, 47, 0.04)";
                stroke = GOLD;
                strokeWidth = 1.5;
              } else if (isFlank12) {
                fill = "rgba(156, 122, 47, 0.04)";
                stroke = GOLD;
                strokeWidth = 1.5;
              }

              return (
                <g key={`lunar-yoga-house-${h}`}>
                  <polygon points={HOUSE_POLYGONS[h]} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />

                  {/* House ID Label */}
                  <text x={HOUSE_LABEL_POSITIONS[h].x} y={HOUSE_LABEL_POSITIONS[h].y} fill="rgba(107, 95, 82, 0.2)" fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    H{h}
                  </text>

                  {/* Sign Number */}
                  <text x={HOUSE_SIGN_NUM_POS[h].x} y={HOUSE_SIGN_NUM_POS[h].y} fill={signColor} fontSize="10.5" fontWeight="900" textAnchor="middle" dominantBaseline="central">
                    {signNum}
                  </text>

                  {/* Render Occupants */}
                  <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`}>
                    {isMoon && (
                      <g transform="translate(0, -10)">
                        <rect x="-22" y="-9" width="44" height="18" rx="4" fill="#7A7A7A" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        <text y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">Mo(च)</text>
                      </g>
                    )}

                    {/* Flank 2 Occupants */}
                    {isFlank2 && flank2Planets.length > 0 && (
                      <g transform="translate(0, 10)">
                        {flank2Planets.map((name, idx) => {
                          const p = PLANETS.find(pl => pl.name === name);
                          if (!p) return null;
                          const offset = (flank2Planets.length - 1) * 12;
                          const xPos = -offset + idx * 24;
                          return (
                            <g key={`flank2-${name}`} transform={`translate(${xPos}, 0)`}>
                              <rect x="-11" y="-7" width="22" height="14" rx="3" fill={p.color} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                              <text y="2.5" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="700">
                                {p.labelEn}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    )}

                    {/* Flank 12 Occupants */}
                    {isFlank12 && flank12Planets.length > 0 && (
                      <g transform="translate(0, 10)">
                        {flank12Planets.map((name, idx) => {
                          const p = PLANETS.find(pl => pl.name === name);
                          if (!p) return null;
                          const offset = (flank12Planets.length - 1) * 12;
                          const xPos = -offset + idx * 24;
                          return (
                            <g key={`flank12-${name}`} transform={`translate(${xPos}, 0)`}>
                              <rect x="-11" y="-7" width="22" height="14" rx="3" fill={p.color} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                              <text y="2.5" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="700">
                                {p.labelEn}
                              </text>
                            </g>
                          );
                        })}
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
            <text x="200" y="203" textAnchor="middle" fill={GOLD_DEEP} fontSize="9.5" fontWeight="900" letterSpacing="0.05em">LUNAR</text>
          </svg>
        </div>

        {/* Small legend */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", fontSize: "10.5px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ display: "inline-block", width: "10px", height: "10px", background: CARA_COLOR, borderRadius: "2px" }} /> Cara (Movable)</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ display: "inline-block", width: "10px", height: "10px", background: STHIRA_COLOR, borderRadius: "2px" }} /> Sthira (Fixed)</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ display: "inline-block", width: "10px", height: "10px", background: DVI_COLOR, borderRadius: "2px" }} /> Dvi (Dual)</span>
        </div>
      </div>

      {/* Control Panel and Output Info */}
      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* Core Placements */}
        <div style={{ background: "rgba(255, 251, 240, 0.5)", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {/* Lagna Sign */}
            <div style={{ flex: "1 1 120px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>Lagna Sign:</label>
              <select
                value={lagnaSign}
                onChange={(e) => setLagnaSign(Number(e.target.value))}
                style={{ width: "100%", padding: "5px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "12px", background: "#fff" }}
              >
                {RASHIS.map(r => (
                  <option key={r.number} value={r.number}>{r.number}. {r.nameIAST} ({r.nameEnglish})</option>
                ))}
              </select>
            </div>

            {/* Moon House */}
            <div style={{ flex: "1 1 120px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>Moon House Placement:</label>
              <select
                value={moonHouse}
                onChange={(e) => setMoonHouse(Number(e.target.value))}
                style={{ width: "100%", padding: "5px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "12px", background: "#fff" }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                  <option key={h} value={h}>House {h} (Sign {houseToSign[h]})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ fontSize: "11.5px", color: INK_SECONDARY, borderTop: "1px solid rgba(156,122,47,0.08)", paddingTop: "8px" }}>
            <strong>Moon flanking context:</strong>
            <ul style={{ margin: "4px 0 0 12px", padding: 0 }}>
              <li>2nd from Moon: <strong>House {house2FromMoon}</strong> (Sign {houseToSign[house2FromMoon]})</li>
              <li>12th from Moon: <strong>House {house12FromMoon}</strong> (Sign {houseToSign[house12FromMoon]})</li>
            </ul>
          </div>
        </div>

        {/* Flanking Plan Placement */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>

          {/* Flank 2 (2nd from Moon) */}
          <div style={{ flex: "1 1 180px", background: "rgba(255, 251, 240, 0.4)", border: "1px solid rgba(156,122,47,0.08)", padding: "12px", borderRadius: "8px" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "11.5px", fontWeight: 700, color: GOLD_DEEP }}>Planets in 2nd from Moon (H{house2FromMoon})</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {PLANETS.map(p => (
                <label key={`check-2-${p.name}`} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={flank2Planets.includes(p.name)}
                    onChange={() => handleToggleFlank2(p.name)}
                    style={{ accentColor: GOLD }}
                  />
                  <span style={{ color: p.color, fontWeight: 600 }}>{p.labelEn}({p.labelNative})</span>
                  <span style={{ color: INK_MUTED, fontSize: "10px" }}>{!p.isTara && "(Excluded)"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Flank 12 (12th from Moon) */}
          <div style={{ flex: "1 1 180px", background: "rgba(255, 251, 240, 0.4)", border: "1px solid rgba(156,122,47,0.08)", padding: "12px", borderRadius: "8px" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "11.5px", fontWeight: 700, color: GOLD_DEEP }}>Planets in 12th from Moon (H{house12FromMoon})</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {PLANETS.map(p => (
                <label key={`check-12-${p.name}`} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={flank12Planets.includes(p.name)}
                    onChange={() => handleToggleFlank12(p.name)}
                    style={{ accentColor: GOLD }}
                  />
                  <span style={{ color: p.color, fontWeight: 600 }}>{p.labelEn}({p.labelNative})</span>
                  <span style={{ color: INK_MUTED, fontSize: "10px" }}>{!p.isTara && "(Excluded)"}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Verdict Box */}
        <div
          style={{
            background: yogaResult.state === "KEMADRUMA" ? "rgba(190, 18, 60, 0.04)" : "rgba(156, 122, 47, 0.05)",
            border: `1px solid ${yogaResult.state === "KEMADRUMA" ? "rgba(190, 18, 60, 0.15)" : "rgba(156, 122, 47, 0.15)"}`,
            padding: "16px",
            borderRadius: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: "4px",
                background: yogaResult.state === "KEMADRUMA" ? CARA_COLOR : GOLD,
                color: "#fff"
              }}
            >
              {yogaResult.state}
            </span>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: yogaResult.state === "KEMADRUMA" ? CARA_COLOR : GOLD_DEEP }}>
              {yogaResult.title}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.5", color: INK_SECONDARY }}>
            {yogaResult.description}
          </p>

          {yogaResult.warning && (
            <div style={{ marginTop: "10px", display: "flex", gap: "6px", alignItems: "start", fontSize: "11px", color: CARA_COLOR, background: "rgba(190,18,60,0.03)", padding: "8px", borderRadius: "6px", border: "1px solid rgba(190,18,60,0.1)" }}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: "1px" }} />
              <span>{yogaResult.warning}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
