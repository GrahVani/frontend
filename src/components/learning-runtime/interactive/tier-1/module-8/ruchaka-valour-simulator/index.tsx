"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle, Shield, Award, HelpCircle } from "lucide-react";
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const CARA_COLOR = "#be123c"; // Crimson Mars color
const STHIRA_COLOR = "#0f766e"; // Fixed (Sthira) - Teal
const DVI_COLOR = "#4338ca"; // Dual (Dvi) - Indigo
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

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

export function RuchakaValourSimulator() {
  const [marsDignityPreset, setMarsDignityPreset] = useState<string>("Exalted");
  const [marsHouse, setMarsHouse] = useState<number>(10); // 1, 4, 7, 10 or 5
  const [aspectType, setAspectType] = useState<string>("None"); // None, Jupiter, Saturn
  const [isCombust, setIsCombust] = useState<boolean>(false);

  // Derive Mars sign based on Lagna = Aries (1)
  const lagnaSign = 1;
  const marsSign = marsHouse; // Since Lagna = 1, sign = house

  // Expose presets mapping
  const marsSignOverride = useMemo(() => {
    switch (marsDignityPreset) {
      case "Aries": return 1;      // Own Sign
      case "Scorpio": return 8;    // Own Sign
      case "Exalted": return 10;   // Capricorn
      case "Debilitated": return 4; // Cancer
      case "Enemy": return 2;       // Taurus (Venus sign, neutral/enemy)
      default: return 10;
    }
  }, [marsDignityPreset]);

  // Adjust Lagna so Mars falls in marsHouse while having the desired sign!
  // Formula: marsSign = ((lagnaSign + marsHouse - 2) % 12) + 1
  // Therefore: lagnaSign = ((marsSign - marsHouse + 12) % 12) + 1
  const calculatedLagnaSign = useMemo(() => {
    return ((marsSignOverride - marsHouse + 12) % 12) + 1;
  }, [marsSignOverride, marsHouse]);

  const houseToSign = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      map[h] = ((calculatedLagnaSign + h - 2) % 12) + 1;
    }
    return map;
  }, [calculatedLagnaSign]);

  // Validate Ruchaka Structurally
  const isKendra = [1, 4, 7, 10].includes(marsHouse);
  const isDignified = [1, 8, 10].includes(marsSignOverride);
  const isRuchakaActive = isKendra && isDignified;

  // Aspecting planet house calculation
  const aspectingHouse = useMemo(() => {
    if (aspectType === "None") return null;
    if (aspectType === "Jupiter") {
      // Jupiter 5/9 aspects
      if (marsHouse === 1) return 9;
      if (marsHouse === 4) return 12;
      if (marsHouse === 7) return 3;
      if (marsHouse === 10) return 2;
      return 1;
    } else {
      // Saturn 3/10 aspects
      if (marsHouse === 1) return 11;
      if (marsHouse === 4) return 2;
      if (marsHouse === 7) return 10;
      if (marsHouse === 10) return 1;
      return 3;
    }
  }, [aspectType, marsHouse]);

  // Dynamic Gauges calculation
  const scores = useMemo(() => {
    let courage = 50;
    let nobility = 50;
    let shadow = 20;
    let title = "Average Mars Expression";
    let desc = "Mars expresses itself in a moderate way. No major yoga is formed.";

    if (marsDignityPreset === "Debilitated") {
      courage = 20;
      nobility = 25;
      shadow = 45;
      title = "Debilitated Mars (Nīca)";
      desc = "Mars is in Cancer, its sign of fall. Energy is turned inward, leading to passive-aggressive traits, emotional defensiveness, and low physical stamina.";
    } else if (marsDignityPreset === "Enemy") {
      courage = 45;
      nobility = 40;
      shadow = 35;
      title = "Mars in Neutral / Enemy Sign";
      desc = "Mars resides in Taurus. Action is slow, deliberate, and stubborn, but lacks the strategic alignment of a classical leader.";
    } else if (isRuchakaActive) {
      courage = 95;
      nobility = 80;
      shadow = 15;
      title = "Ruchaka Yoga (Active)";
      desc = "Mars is strong, angular, and unafflicted. Confers physical strength, absolute fearlessness, executive command, and military or technical success.";

      if (aspectType === "Jupiter") {
        courage = 98;
        nobility = 98;
        shadow = 5;
        title = "Ruchaka Yoga (Righteous Command)";
        desc = "Jupiter aspects the angular Mars! This channels Mars's raw courage into dharmic protectiveness, noble ideals, wise administration, and a highly protective leader portrait.";
      } else if (aspectType === "Saturn") {
        courage = 90;
        nobility = 35;
        shadow = 85;
        title = "Ruchaka Yoga (Afflicted / Aggressive)";
        desc = "Saturn or Rāhu aspects Mars. The warrior's strength is hijacked by harshness, sudden anger, a domineering temper, and a tendency to execute control through raw power rather than respect.";
      }

      if (isCombust) {
        courage = 65;
        nobility = 40;
        shadow = 70;
        title = "Ruchaka Yoga (Combust / Spoiled)";
        desc = "Mars is combust by the Sun. The courage remains structurally but manifests as frustration, easily ignited temper, and a domineering nature that exhausts others.";
      }
    } else {
      // Dignified but not in Kendra
      courage = 75;
      nobility = 60;
      shadow = 25;
      title = "Dignified Mars (Off-Kendra)";
      desc = "Mars is strong in its own sign or exalted, but placed outside the pillars (Kendras). You have substantial courage and capability, but lack the public platform or leadership opportunities to manifest Ruchaka.";
      if (isCombust) {
        courage = 50;
        shadow = 50;
      }
    }

    return { courage, nobility, shadow, title, desc };
  }, [marsDignityPreset, isRuchakaActive, aspectType, isCombust]);

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
      {/* SVG Chart Column */}
      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: CARA_COLOR, letterSpacing: "0.02em" }}>
          Ruchaka Dignity Visualizer (Lagna: Sign {calculatedLagnaSign})
        </h3>

        <div style={{ position: "relative", width: "100%", maxWidth: "380px", aspectRatio: "1/1" }}>
          <svg viewBox="0 0 400 400" style={{ width: "100%", height: "100%", background: "#fffdf8", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "12px", overflow: "visible" }}>
            {/* Render Houses */}
            {Array.from({ length: 12 }, (_, i) => {
              const h = i + 1;
              const signNum = houseToSign[h];
              const isKendra = [1, 4, 7, 10].includes(h);
              const hasMars = marsHouse === h;
              const hasAspecter = aspectingHouse === h;

              return (
                <g key={`ruchaka-h-${h}`}>
                  <polygon
                    points={HOUSE_POLYGONS[h]}
                    fill={hasMars ? "rgba(190, 18, 60, 0.04)" : "transparent"}
                    stroke={hasMars ? CARA_COLOR : (isKendra ? "rgba(156, 122, 47, 0.3)" : "rgba(156, 122, 47, 0.12)")}
                    strokeWidth={hasMars ? 2 : (isKendra ? 1.5 : 1)}
                  />
                  <text x={HOUSE_LABEL_POSITIONS[h].x} y={HOUSE_LABEL_POSITIONS[h].y} fill="rgba(107, 95, 82, 0.15)" fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    H{h}
                  </text>
                  <text x={HOUSE_SIGN_NUM_POS[h].x} y={HOUSE_SIGN_NUM_POS[h].y} fill={getModalityColor(getModality(signNum))} fontSize="10.5" fontWeight="800" textAnchor="middle" dominantBaseline="central">
                    {signNum}
                  </text>

                  {/* Mars badge */}
                  {hasMars && (
                    <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`}>
                      <rect x="-20" y="-10" width="40" height="20" rx="4" fill={CARA_COLOR} stroke="#ffffff" strokeWidth="1" />
                      <text y="4" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="700">Ma(म)</text>
                    </g>
                  )}

                  {/* Aspecting planet badge */}
                  {hasAspecter && (
                    <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`}>
                      <rect x="-20" y="-10" width="40" height="20" rx="4" fill={aspectType === "Jupiter" ? GOLD : "#4338ca"} stroke="#ffffff" strokeWidth="1" />
                      <text y="4" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="700">
                        {aspectType === "Jupiter" ? "Ju(गु)" : "Sa(श)"}
                      </text>
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

            {/* Draw aspect arrow */}
            {aspectingHouse && (
              <line
                x1={HOUSE_CENTERS[aspectingHouse].x}
                y1={HOUSE_CENTERS[aspectingHouse].y}
                x2={HOUSE_CENTERS[marsHouse].x}
                y2={HOUSE_CENTERS[marsHouse].y}
                stroke={aspectType === "Jupiter" ? GOLD : "#4338ca"}
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            )}

            {/* Central Circle */}
            <circle cx="200" cy="200" r="44" fill="#fffdf8" stroke={GOLD} strokeWidth="1.2" />
            <text x="200" y="203" textAnchor="middle" fill={GOLD_DEEP} fontSize="10" fontWeight="900" letterSpacing="0.05em">RUCHAKA</text>
          </svg>
        </div>
      </div>

      {/* Control and Gauges Column */}
      <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Controls block */}
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
            <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "6px" }}>1. Mars Dignity (Preset Sign)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["Exalted", "Aries", "Scorpio", "Debilitated", "Enemy"].map(p => (
                <button
                  key={p}
                  onClick={() => setMarsDignityPreset(p)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: marsDignityPreset === p ? `1.5px solid ${CARA_COLOR}` : "1.5px solid rgba(156,122,47,0.15)",
                    background: marsDignityPreset === p ? `${CARA_COLOR}15` : "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    color: marsDignityPreset === p ? CARA_COLOR : INK_SECONDARY
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "6px" }}>2. Mars House Position</label>
            <div style={{ display: "flex", gap: "6px" }}>
              {[1, 4, 7, 10, 5].map(h => (
                <button
                  key={`mh-${h}`}
                  onClick={() => setMarsHouse(h)}
                  style={{
                    flex: "1",
                    padding: "8px 0",
                    borderRadius: "6px",
                    border: marsHouse === h ? `2px solid ${CARA_COLOR}` : "1px solid rgba(156,122,47,0.15)",
                    background: marsHouse === h ? "rgba(190,18,60,0.06)" : "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    color: marsHouse === h ? CARA_COLOR : INK_SECONDARY
                  }}
                >
                  H{h} {[1, 4, 7, 10].includes(h) ? "(Kendra)" : ""}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "6px" }}>3. Aspecting Planet</label>
              <select
                value={aspectType}
                onChange={(e) => setAspectType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid rgba(156,122,47,0.2)",
                  background: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 600,
                  outline: "none"
                }}
              >
                <option value="None">None (Isolated)</option>
                <option value="Jupiter">Jupiter (Righteous aspect)</option>
                <option value="Saturn">Saturn/Rāhu (Malefic pressure)</option>
              </select>
            </div>

            <div style={{ paddingTop: "18px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isCombust}
                  onChange={(e) => setIsCombust(e.target.checked)}
                  style={{ accentColor: CARA_COLOR }}
                />
                Combust
              </label>
            </div>
          </div>
        </div>

        {/* Dynamic Gauges and Description */}
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
            <h4 style={{ fontSize: "15px", fontWeight: 800, margin: "0 0 4px 0", color: isRuchakaActive && !isCombust ? CARA_COLOR : GOLD_DEEP }}>
              {scores.title}
            </h4>
            <p style={{ fontSize: "13px", lineHeight: "1.45", color: INK_SECONDARY, margin: 0 }}>
              {scores.desc}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid rgba(156,122,47,0.1)", paddingTop: "16px" }}>
            {/* Courage Gauge */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>
                <span>🛡️ COURAGE & COMMAND</span>
                <span>{scores.courage}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.05)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${scores.courage}%`, height: "100%", background: CARA_COLOR, borderRadius: "4px", transition: "width 0.3s ease" }} />
              </div>
            </div>

            {/* Nobility Gauge */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>
                <span>⚖️ NOBILITY & LEADERSHIP</span>
                <span>{scores.nobility}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.05)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${scores.nobility}%`, height: "100%", background: GOLD_DEEP, borderRadius: "4px", transition: "width 0.3s ease" }} />
              </div>
            </div>

            {/* Shadow Gauge */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, marginBottom: "4px" }}>
                <span>⚠️ SHADOW AGGRESSION / TYRANNY</span>
                <span style={{ color: scores.shadow > 50 ? "#dc2626" : INK_SECONDARY }}>{scores.shadow}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.05)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${scores.shadow}%`, height: "100%", background: scores.shadow > 50 ? "#dc2626" : "#f59e0b", borderRadius: "4px", transition: "width 0.3s ease" }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
