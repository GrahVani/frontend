"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, Layers, Clock, AlertCircle } from "lucide-react";
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

const getRashiAbbr = (signNum: number): string => {
  const abbrs: Record<number, string> = {
    1: "Ari",
    2: "Tau",
    3: "Gem",
    4: "Can",
    5: "Leo",
    6: "Vir",
    7: "Lib",
    8: "Sco",
    9: "Sag",
    10: "Cap",
    11: "Aqu",
    12: "Pis"
  };
  return abbrs[signNum] ?? "";
};

// North Indian geometries (400x400 SVG)
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

export function SaturnAspectDisambiguator() {
  const [saturnHouse, setSaturnHouse] = useState<number>(1); // 1 or 4
  const [saturnDegree, setSaturnDegree] = useState<number>(8); // 0-30
  const [targetHouse, setTargetHouse] = useState<number>(7); // 1-12

  // Fixed Ascendant = Aries (1)
  const ascendantSign = 1;

  // Modality helper
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

  const saturnSign = saturnHouse;
  const targetSign = targetHouse;

  const saturnModality = useMemo(() => getModality(saturnSign), [saturnSign]);
  const targetModality = useMemo(() => getModality(targetSign), [targetSign]);

  // Target sign names
  const targetSignName = useMemo(() => {
    const r = RASHIS.find(x => x.number === targetSign);
    return r ? `${r.nameIAST} (${r.nameEnglish})` : "";
  }, [targetSign]);

  // 1. Parāśari Aspect calculation
  const hasParashariAspect = useMemo(() => {
    const diff = ((targetHouse - saturnHouse + 12) % 12) + 1;
    // Saturn aspects 3, 7, 10 houses from itself
    return diff === 3 || diff === 7 || diff === 10;
  }, [saturnHouse, targetHouse]);

  // 2. Jaimini Aspect calculation
  const hasJaiminiAspect = useMemo(() => {
    const isAdjacent = Math.abs(saturnSign - targetSign) === 1 || Math.abs(saturnSign - targetSign) === 11;

    if (saturnModality === "Movable" && targetModality === "Fixed" && !isAdjacent) return true;
    if (saturnModality === "Fixed" && targetModality === "Movable" && !isAdjacent) return true;
    if (saturnModality === "Dual" && targetModality === "Dual" && saturnSign !== targetSign) return true;
    return false;
  }, [saturnSign, targetSign, saturnModality, targetModality]);

  // 3. Tājika Aspect calculation
  // Target cusp degree is fixed at 5° (similar to worked example)
  const targetCuspDegree = 5;
  const saturnOrb = 9; // Saturn Tājika orb is 9°

  const tajikaDetails = useMemo(() => {
    const targetAbs = (targetSign - 1) * 30 + targetCuspDegree;
    const saturnAbs = (saturnSign - 1) * 30 + saturnDegree;

    const diff = (targetAbs - saturnAbs + 360) % 360;

    const aspectAngles = [0, 60, 90, 120, 180, 240, 270, 300];
    let closestAngle = 0;
    let minDiff = 360;

    aspectAngles.forEach((a) => {
      const d = Math.abs(diff - a);
      const dWrap = 360 - d;
      const finalD = Math.min(d, dWrap);
      if (finalD < minDiff) {
        minDiff = finalD;
        closestAngle = a;
      }
    });

    const tajikaAngleMap: Record<number, number> = {
      0: 0, 60: 60, 90: 90, 120: 120, 180: 180,
      240: 120, 270: 90, 300: 60
    };

    const mappedAngle = tajikaAngleMap[closestAngle] ?? 0;
    const hasAspect = minDiff <= saturnOrb;

    // Determine applying vs separating
    // Cusp is stationary at 5°. Saturn is moving direct (0 -> 30)
    // If Saturn's degree <= 5° -> Saturn is approaching the exact aspect at 5°. Result: applying
    // If Saturn's degree > 5° -> Saturn is moving away from 5°. Result: separating
    const isApplying = saturnDegree <= 5;

    return {
      hasAspect,
      angle: mappedAngle,
      diffDeg: Math.round(minDiff),
      type: isApplying ? "applying" : "separating" as "applying" | "separating"
    };
  }, [saturnSign, saturnDegree, targetSign]);

  // Curved path helper for Jaimini sign aspect
  const getBezierPath = (from: number, to: number) => {
    const p1 = HOUSE_CENTERS[from];
    const p2 = HOUSE_CENTERS[to];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const L = Math.sqrt(dx * dx + dy * dy) || 1;

    const margin = 28;
    const x1 = p1.x + (dx / L) * margin;
    const y1 = p1.y + (dy / L) * margin;
    const x2 = p2.x - (dx / L) * margin;
    const y2 = p2.y - (dy / L) * margin;

    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    let Ux = -dy / L;
    let Uy = dx / L;

    const dot = Ux * (mx - 200) + Uy * (my - 200);
    if (dot < 0) {
      Ux = -Ux;
      Uy = -Uy;
    }

    const cx = mx + 30 * Ux;
    const cy = my + 30 * Uy;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(255, 253, 246, 0.7)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.05)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "860px",
        margin: "0 auto"
      }}
    >
      <div style={{ borderBottom: "1px solid rgba(156,122,47,0.12)", paddingBottom: "12px", marginBottom: "18px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={16} /> Saturn Aspect Disambiguator
        </h3>
        <span style={{ fontSize: "11.5px", color: INK_SECONDARY }}>Simulate Saturn aspects to the 7th house and inspect the verdicts under three doctrines</span>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>

        {/* Left column: SVG Chart & Controls */}
        <div style={{ flex: "1 1 320px", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Controls box */}
          <div style={{ background: "rgba(255, 251, 240, 0.5)", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "12px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>

            {/* House Toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700 }}>Saturn Position:</span>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  type="button"
                  onClick={() => setSaturnHouse(1)}
                  style={{
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    borderRadius: "4px",
                    cursor: "pointer",
                    background: saturnHouse === 1 ? GOLD : "#ffffff",
                    color: saturnHouse === 1 ? "#ffffff" : INK_SECONDARY,
                    border: "1px solid rgba(0,0,0,0.1)"
                  }}
                >
                  1st House (Aries)
                </button>
                <button
                  type="button"
                  onClick={() => setSaturnHouse(4)}
                  style={{
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    borderRadius: "4px",
                    cursor: "pointer",
                    background: saturnHouse === 4 ? GOLD : "#ffffff",
                    color: saturnHouse === 4 ? "#ffffff" : INK_SECONDARY,
                    border: "1px solid rgba(0,0,0,0.1)"
                  }}
                >
                  4th House (Cancer)
                </button>
              </div>
            </div>

            {/* Degree Slider */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px" }}>
                <span style={{ fontWeight: 700 }}>Saturn Longitude:</span>
                <span style={{ color: GOLD_DEEP, fontWeight: 700 }}>{saturnDegree}° {saturnSign === 1 ? "Aries" : "Cancer"}</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={saturnDegree}
                onChange={(e) => setSaturnDegree(Number(e.target.value))}
                style={{ width: "100%", accentColor: GOLD }}
              />
              <span style={{ fontSize: "9.5px", color: INK_MUTED }}>
                Saturn's Tājika orb is 9° around cusp. Target Cusp is at 5°.
              </span>
            </div>

            {/* Target House Selector */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700 }}>Target House:</span>
              <select
                value={targetHouse}
                onChange={(e) => setTargetHouse(Number(e.target.value))}
                style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff" }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                  <option key={h} value={h}>H{h} ({RASHIS[h - 1].nameIAST})</option>
                ))}
              </select>
            </div>

          </div>

          {/* SVG Diagram */}
          <div style={{ width: "100%", aspectRatio: "1/1", position: "relative" }}>
            <svg viewBox="0 0 400 400" style={{ width: "100%", background: "#fffdf8", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "10px", overflow: "visible" }}>
              <defs>
                <marker id="arrow-parashari-dis" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={CARA_COLOR} />
                </marker>
                <marker id="arrow-jaimini-dis" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={DVI_COLOR} />
                </marker>
                <marker id="arrow-tajika-dis" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={GOLD_DEEP} />
                </marker>
              </defs>

              {/* Polygons */}
              {Array.from({ length: 12 }, (_, i) => {
                const h = i + 1;
                const isSaturn = h === saturnHouse;
                const isTarget = h === targetHouse;
                const mod = getModality(h);
                const modColor = getModalityColor(mod);

                return (
                  <g key={`saturn-dis-h-${h}`}>
                    <polygon
                      points={HOUSE_POLYGONS[h]}
                      fill={isSaturn ? "rgba(156, 122, 47, 0.08)" : (isTarget ? "rgba(79, 111, 168, 0.05)" : "transparent")}
                      stroke={isSaturn ? GOLD : (isTarget ? INDIGO : "rgba(156, 122, 47, 0.15)")}
                      strokeWidth={isSaturn || isTarget ? 2 : 1}
                    />
                    <text x={HOUSE_LABEL_POSITIONS[h].x} y={HOUSE_LABEL_POSITIONS[h].y} fill="rgba(107, 95, 82, 0.15)" fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                      H{h}
                    </text>
                    <text x={HOUSE_SIGN_NUM_POS[h].x} y={HOUSE_SIGN_NUM_POS[h].y} fill={modColor} fontSize="10" fontWeight="800" textAnchor="middle" dominantBaseline="central">
                      {h}
                    </text>

                    {/* Saturn Badge */}
                    {isSaturn && (
                      <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y - (isTarget ? 20 : 0)})`}>
                        <rect x="-42" y="-11" width="84" height="22" rx="6" fill={INDIGO} stroke="rgba(255,255,255,0.2)" strokeWidth="1" style={{ filter: "drop-shadow(0px 2px 4px rgba(79,111,168,0.15))" }} />
                        <text y="4.5" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="700" letterSpacing="0.02em">
                          Saturn ♄ {saturnDegree}°
                        </text>
                      </g>
                    )}

                    {/* Target cusp marker */}
                    {isTarget && (
                      <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y + (isSaturn ? 20 : 0)})`}>
                        <text y="-8" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="800">
                          {getRashiAbbr(h)}
                        </text>
                        <text y="3.5" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="600">
                          ({RASHIS[h - 1].nameIAST})
                        </text>
                        <text y="13.5" textAnchor="middle" fill={GOLD_DEEP} fontSize="8.5" fontWeight="700">
                          Cusp: 5°
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Standard Lines */}
              <g stroke="rgba(156, 122, 47, 0.12)" strokeWidth="1.2" fill="none">
                <rect x="10" y="10" width="380" height="380" />
                <line x1="10" y1="10" x2="390" y2="390" />
                <line x1="390" y1="10" x2="10" y2="390" />
                <line x1="200" y1="10" x2="10" y2="200" />
                <line x1="10" y1="200" x2="200" y2="390" />
                <line x1="200" y1="390" x2="390" y2="200" />
                <line x1="390" y1="200" x2="200" y2="10" />
              </g>

              {/* Aspect Visual Lines */}
              {hasParashariAspect && (
                <line
                  x1={HOUSE_CENTERS[saturnHouse].x + ((HOUSE_CENTERS[targetHouse].x - HOUSE_CENTERS[saturnHouse].x) / (Math.sqrt(Math.pow(HOUSE_CENTERS[targetHouse].x - HOUSE_CENTERS[saturnHouse].x, 2) + Math.pow(HOUSE_CENTERS[targetHouse].y - HOUSE_CENTERS[saturnHouse].y, 2)) || 1)) * 28}
                  y1={HOUSE_CENTERS[saturnHouse].y + ((HOUSE_CENTERS[targetHouse].y - HOUSE_CENTERS[saturnHouse].y) / (Math.sqrt(Math.pow(HOUSE_CENTERS[targetHouse].x - HOUSE_CENTERS[saturnHouse].x, 2) + Math.pow(HOUSE_CENTERS[targetHouse].y - HOUSE_CENTERS[saturnHouse].y, 2)) || 1)) * 28}
                  x2={HOUSE_CENTERS[targetHouse].x - ((HOUSE_CENTERS[targetHouse].x - HOUSE_CENTERS[saturnHouse].x) / (Math.sqrt(Math.pow(HOUSE_CENTERS[targetHouse].x - HOUSE_CENTERS[saturnHouse].x, 2) + Math.pow(HOUSE_CENTERS[targetHouse].y - HOUSE_CENTERS[saturnHouse].y, 2)) || 1)) * 28}
                  y2={HOUSE_CENTERS[targetHouse].y - ((HOUSE_CENTERS[targetHouse].y - HOUSE_CENTERS[saturnHouse].y) / (Math.sqrt(Math.pow(HOUSE_CENTERS[targetHouse].x - HOUSE_CENTERS[saturnHouse].x, 2) + Math.pow(HOUSE_CENTERS[targetHouse].y - HOUSE_CENTERS[saturnHouse].y, 2)) || 1)) * 28}
                  stroke={CARA_COLOR}
                  strokeWidth="2.2"
                  markerEnd="url(#arrow-parashari-dis)"
                />
              )}

              {hasJaiminiAspect && (
                <path
                  d={getBezierPath(saturnHouse, targetHouse)}
                  fill="none"
                  stroke={DVI_COLOR}
                  strokeWidth="2.2"
                  markerEnd="url(#arrow-jaimini-dis)"
                />
              )}

              {tajikaDetails.hasAspect && (
                <line
                  x1={HOUSE_CENTERS[saturnHouse].x + ((HOUSE_CENTERS[targetHouse].x - HOUSE_CENTERS[saturnHouse].x) / (Math.sqrt(Math.pow(HOUSE_CENTERS[targetHouse].x - HOUSE_CENTERS[saturnHouse].x, 2) + Math.pow(HOUSE_CENTERS[targetHouse].y - HOUSE_CENTERS[saturnHouse].y, 2)) || 1)) * 28}
                  y1={HOUSE_CENTERS[saturnHouse].y + ((HOUSE_CENTERS[targetHouse].y - HOUSE_CENTERS[saturnHouse].y) / (Math.sqrt(Math.pow(HOUSE_CENTERS[targetHouse].x - HOUSE_CENTERS[saturnHouse].x, 2) + Math.pow(HOUSE_CENTERS[targetHouse].y - HOUSE_CENTERS[saturnHouse].y, 2)) || 1)) * 28}
                  x2={HOUSE_CENTERS[targetHouse].x - ((HOUSE_CENTERS[targetHouse].x - HOUSE_CENTERS[saturnHouse].x) / (Math.sqrt(Math.pow(HOUSE_CENTERS[targetHouse].x - HOUSE_CENTERS[saturnHouse].x, 2) + Math.pow(HOUSE_CENTERS[targetHouse].y - HOUSE_CENTERS[saturnHouse].y, 2)) || 1)) * 28}
                  y2={HOUSE_CENTERS[targetHouse].y - ((HOUSE_CENTERS[targetHouse].y - HOUSE_CENTERS[saturnHouse].y) / (Math.sqrt(Math.pow(HOUSE_CENTERS[targetHouse].x - HOUSE_CENTERS[saturnHouse].x, 2) + Math.pow(HOUSE_CENTERS[targetHouse].y - HOUSE_CENTERS[saturnHouse].y, 2)) || 1)) * 28}
                  stroke={GOLD}
                  strokeWidth="2.2"
                  strokeDasharray={tajikaDetails.type === "separating" ? "3,3" : "none"}
                  markerEnd="url(#arrow-tajika-dis)"
                />
              )}

              {/* Central Medallion */}
              <circle cx="200" cy="200" r="44" fill="#fffdf8" stroke={GOLD} strokeWidth="1.2" style={{ filter: "drop-shadow(0px 3px 6px rgba(72,48,16,0.08))" }} />
              <text x="200" y="203" textAnchor="middle" fill={GOLD_DEEP} fontSize="10" fontWeight="900" letterSpacing="0.05em">DISAMBIG</text>
            </svg>
          </div>
        </div>

        {/* Right column: 3-Doctrine Verdict Cards */}
        <div style={{ flex: "1 1 360px", display: "flex", flexDirection: "column", gap: "12px" }}>

          <label style={{ fontSize: "12px", fontWeight: 700, color: INK_SECONDARY }}>
            Three Aspect Verdicts:
          </label>

          {/* 1. Parāśari */}
          <div style={{ background: "#ffffff", border: `1px solid ${hasParashariAspect ? "rgba(190, 18, 60, 0.2)" : "rgba(0,0,0,0.08)"}`, padding: "12px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: CARA_COLOR, display: "flex", alignItems: "center", gap: "4px" }}>
                <Eye size={14} /> Parāśari Graha-Dṛṣṭi
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: 900,
                padding: "2px 8px",
                borderRadius: "12px",
                background: hasParashariAspect ? "rgba(190, 18, 60, 0.1)" : "rgba(0,0,0,0.05)",
                color: hasParashariAspect ? CARA_COLOR : INK_MUTED,
                border: `1px solid ${hasParashariAspect ? "rgba(190,18,60,0.25)" : "rgba(0,0,0,0.08)"}`
              }}>
                {hasParashariAspect ? "YES (Aspecting)" : "NO"}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4 }}>
              {hasParashariAspect
                ? `Saturn is in H${saturnHouse} and targets H${targetHouse}. Saturn's full aspects land on the 3rd, 7th, and 10th from itself — which includes the target.`
                : `Saturn is in H${saturnHouse} and targets H${targetHouse}. The target is not 3rd, 7th, or 10th from Saturn's position.`
              }
            </p>
          </div>

          {/* 2. Jaimini */}
          <div style={{ background: "#ffffff", border: `1px solid ${hasJaiminiAspect ? "rgba(67, 56, 202, 0.2)" : "rgba(0,0,0,0.08)"}`, padding: "12px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: DVI_COLOR, display: "flex", alignItems: "center", gap: "4px" }}>
                <Layers size={14} /> Jaimini Rāśi-Dṛṣṭi
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: 900,
                padding: "2px 8px",
                borderRadius: "12px",
                background: hasJaiminiAspect ? "rgba(67, 56, 202, 0.1)" : "rgba(0,0,0,0.05)",
                color: hasJaiminiAspect ? DVI_COLOR : INK_MUTED,
                border: `1px solid ${hasJaiminiAspect ? "rgba(67, 56, 202, 0.25)" : "rgba(0,0,0,0.08)"}`
              }}>
                {hasJaiminiAspect ? "YES (Aspecting)" : "NO"}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4 }}>
              {saturnSign === 1 && targetSign === 7
                ? `Saturn is in Aries (${saturnModality}) and targets Libra (${targetModality}). Two Movable signs never aspect each other.`
                : hasJaiminiAspect
                  ? `Saturn's sign (Sign ${saturnSign} - ${saturnModality}) Jaimini-aspects the target sign (Sign ${targetSign} - ${targetModality}) by modality compatibility.`
                  : `Saturn's sign (${saturnModality}) does not Jaimini-aspect the target sign (${targetModality}) due to modality matching or adjacency rules.`
              }
            </p>
          </div>

          {/* 3. Tājika */}
          <div style={{ background: "#ffffff", border: `1px solid ${tajikaDetails.hasAspect ? "rgba(156, 122, 47, 0.2)" : "rgba(0,0,0,0.08)"}`, padding: "12px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={14} /> Tājika Orb-Dṛṣṭi
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: 900,
                padding: "2px 8px",
                borderRadius: "12px",
                background: tajikaDetails.hasAspect ? "rgba(156, 122, 47, 0.12)" : "rgba(0,0,0,0.05)",
                color: tajikaDetails.hasAspect ? GOLD_DEEP : INK_MUTED,
                border: `1px solid ${tajikaDetails.hasAspect ? "rgba(156,122,47,0.25)" : "rgba(0,0,0,0.08)"}`
              }}>
                {tajikaDetails.hasAspect
                  ? `YES (${tajikaDetails.type})`
                  : "NO (Outside Orb)"
                }
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4 }}>
              {tajikaDetails.hasAspect
                ? `Saturn is at ${saturnDegree}° in its sign, which is within the 9° orb of the target's 5° cusp (Distance to closest aspect angle is ${tajikaDetails.diffDeg}°). The aspect is ${tajikaDetails.type}.`
                : `Saturn at ${saturnDegree}° is outside the 9° orb of the target's 5° cusp (Distance to closest aspect angle is ${tajikaDetails.diffDeg}°).`
              }
            </p>
          </div>

          {/* Lesson 1 summary note */}
          <div style={{ background: "rgba(156, 122, 47, 0.05)", border: "1px dashed rgba(156, 122, 47, 0.2)", padding: "12px", borderRadius: "8px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <AlertCircle size={16} color={GOLD_DEEP} style={{ flexShrink: 0, marginTop: "2px" }} />
            <span style={{ fontSize: "10.5px", color: INK_SECONDARY, lineHeight: 1.4 }}>
              <strong>Disambiguation Lesson:</strong> Observe that placing Saturn in the 1st targeting the 7th results in <strong>Parāśari: YES</strong>, <strong>Jaimini: NO</strong>, and <strong>Tājika: degree-dependent</strong>. Moving Saturn's degree slider past 14° or below 26° disables the Tājika aspect, proving why the claim "Saturn aspects the 7th" is incomplete without stating its doctrine.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
