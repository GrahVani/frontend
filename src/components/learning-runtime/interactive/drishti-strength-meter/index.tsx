"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, Info, Sliders, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { RASHIS } from "../rashi-data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const INDIGO = "#4F6FA8";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

export interface Planet {
  id: string;
  name: string;
  sanskrit: string;
  devanagari: string;
  abbr: string;
  defaultNature: "benefic" | "malefic";
}

export const PLANETS: Planet[] = [
  { id: "sun", name: "Sun", sanskrit: "Sūrya", devanagari: "सूर्य", abbr: "Su", defaultNature: "malefic" },
  { id: "moon", name: "Moon", sanskrit: "Candra", devanagari: "चन्द्र", abbr: "Mo", defaultNature: "benefic" },
  { id: "mars", name: "Mars", sanskrit: "Maṅgala", devanagari: "मङ्गल", abbr: "Ma", defaultNature: "malefic" },
  { id: "mercury", name: "Mercury", sanskrit: "Budha", devanagari: "बुध", abbr: "Me", defaultNature: "benefic" },
  { id: "jupiter", name: "Jupiter", sanskrit: "Guru", devanagari: "गुरु", abbr: "Ju", defaultNature: "benefic" },
  { id: "venus", name: "Venus", sanskrit: "Śukra", devanagari: "शुक्र", abbr: "Ve", defaultNature: "benefic" },
  { id: "saturn", name: "Saturn", sanskrit: "Śani", devanagari: "शनि", abbr: "Sa", defaultNature: "malefic" },
];

function getHouseFromPlanet(planetHouse: number, targetHouse: number): number {
  const diff = (targetHouse - planetHouse + 12) % 12;
  return diff + 1;
}

function calculateDrishti(planetId: string, houseFromPlanet: number, isGradedMode: boolean): number {
  if (houseFromPlanet === 7) return 60;

  if (isGradedMode) {
    if (houseFromPlanet === 4 || houseFromPlanet === 8) {
      return planetId === "mars" ? 60 : 45;
    }
    if (houseFromPlanet === 5 || houseFromPlanet === 9) {
      return planetId === "jupiter" ? 60 : 30;
    }
    if (houseFromPlanet === 3 || houseFromPlanet === 10) {
      return planetId === "saturn" ? 60 : 15;
    }
  } else {
    // Whole-house binary model: only upgrades and 7th get 60, others get 0
    if (planetId === "mars" && (houseFromPlanet === 4 || houseFromPlanet === 8)) return 60;
    if (planetId === "jupiter" && (houseFromPlanet === 5 || houseFromPlanet === 9)) return 60;
    if (planetId === "saturn" && (houseFromPlanet === 3 || houseFromPlanet === 10)) return 60;
  }

  return 0;
}

export function DrishtiStrengthMeter() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const [planetId, setPlanetId] = useState<string>("saturn"); // Saturn is a great default to show upgrades
  const [planetHouse, setPlanetHouse] = useState<number>(1);
  const [lagnaId, setLagnaId] = useState<number>(1); // Meṣa (Aries) Lagna default
  const [isGradedMode, setIsGradedMode] = useState<boolean>(true);

  // Filter state to manage visual density
  const [showFull, setShowFull] = useState<boolean>(true);
  const [showPartial, setShowPartial] = useState<boolean>(true);

  // Hover state to highlight a single vector
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

  const selectedPlanet = useMemo(() => {
    return PLANETS.find(p => p.id === planetId) ?? PLANETS[6];
  }, [planetId]);

  const activePlacements = useMemo(() => {
    const list: {
      houseNum: number;
      houseFromPlanet: number;
      virupa: number;
      isUpgraded: boolean;
    }[] = [];

    for (let h = 1; h <= 12; h++) {
      const houseFromPlanet = getHouseFromPlanet(planetHouse, h);
      const virupa = calculateDrishti(planetId, houseFromPlanet, isGradedMode);
      
      // An aspect is upgraded if it is a special aspect and we are in graded mode
      const isUpgraded = isGradedMode && 
        ((planetId === "mars" && (houseFromPlanet === 4 || houseFromPlanet === 8)) ||
         (planetId === "jupiter" && (houseFromPlanet === 5 || houseFromPlanet === 9)) ||
         (planetId === "saturn" && (houseFromPlanet === 3 || houseFromPlanet === 10)));

      if (virupa > 0) {
        list.push({
          houseNum: h,
          houseFromPlanet,
          virupa,
          isUpgraded
        });
      }
    }
    return list;
  }, [planetId, planetHouse, isGradedMode]);

  // Filter placements based on toggles
  const filteredPlacements = useMemo(() => {
    return activePlacements.filter(p => {
      if (p.virupa === 60) return showFull;
      return showPartial;
    });
  }, [activePlacements, showFull, showPartial]);

  // Coordinate Helpers
  const cx = 180;
  const cy = 180;

  const getHouseCoord = (houseNum: number, radius = 105) => {
    // House 1 starts at top (-90 degrees) and counts counter-clockwise
    const angle = -90 - (houseNum - 1) * 30;
    const rad = angle * Math.PI / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
      angle
    };
  };

  // Get sign name based on house index and Lagna selection
  const getHouseSign = (houseNum: number) => {
    const rashiIndex = (lagnaId - 1 + (houseNum - 1)) % 12;
    return RASHIS[rashiIndex];
  };

  const getLineStyle = (virupa: number, targetHouseNum: number) => {
    const isHovered = hoveredHouse === targetHouseNum;
    const isAnyHovered = hoveredHouse !== null;

    let stroke = "#4F6FA8";
    let strokeWidth = "1.5";
    let opacity = "0.5";
    let strokeDasharray = "none";

    if (virupa === 60) {
      stroke = "#9C7A2F";
      strokeWidth = "2.8";
      opacity = "0.85";
    } else if (virupa === 45) {
      stroke = "#f59e0b";
      strokeWidth = "1.8";
      opacity = "0.55";
    } else if (virupa === 30) {
      stroke = "#4F6FA8";
      strokeWidth = "1.2";
      opacity = "0.35";
    } else if (virupa === 15) {
      stroke = "#4F6FA8";
      strokeWidth = "0.9";
      opacity = "0.20";
      strokeDasharray = "3,3";
    }

    if (isAnyHovered) {
      if (isHovered) {
        opacity = "1.0";
        strokeWidth = (parseFloat(strokeWidth) + 1.5).toString();
      } else {
        opacity = "0.06"; // Significantly dim other lines
      }
    }

    return { stroke, strokeWidth, opacity, strokeDasharray };
  };

  const getDrishtiBadgeLabel = (virupa: number, isUpgraded: boolean) => {
    if (virupa === 60) {
      return isUpgraded ? "Full (60) [Upgraded]" : "Full (60)";
    }
    if (virupa === 45) return "¾ (45)";
    if (virupa === 30) return "½ (30)";
    if (virupa === 15) return "¼ (15)";
    return "None (0)";
  };

  const handleReset = () => {
    setPlanetId("saturn");
    setPlanetHouse(1);
    setLagnaId(1);
    setIsGradedMode(true);
    setShowFull(true);
    setShowPartial(true);
    setHoveredHouse(null);
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "20px 22px 22px",
        borderRadius: "12px",
        color: INK_PRIMARY,
        background: "linear-gradient(180deg, rgba(255,251,239,0.96), rgba(245,232,203,0.72))",
        border: "1px solid var(--gl-gold-hairline)",
        boxShadow: "0 18px 40px rgba(72, 48, 16, 0.10)"
      }}
      data-interactive="drishti-strength-meter"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        input[type="range"].gl-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: rgba(156, 122, 47, 0.15);
          border-radius: 3px;
          outline: none;
          margin: 8px 0;
        }
        input[type="range"].gl-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #9C7A2F;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          transition: transform 0.1s ease, background 0.1s ease;
        }
        input[type="range"].gl-slider::-webkit-slider-thumb:hover {
          transform: scale(1.25);
          background: #7A5E1E;
        }
        input[type="range"].gl-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border: none;
          border-radius: 50%;
          background: #9C7A2F;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          transition: transform 0.1s ease, background 0.1s ease;
        }
        input[type="range"].gl-slider::-moz-range-thumb:hover {
          transform: scale(1.25);
          background: #7A5E1E;
        }
      `}} />

      <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            BPHS Graded Drishti Visualizer
          </span>
          <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0, color: GOLD_DEEP }}>
            Drishti Strength Meter
          </h2>
        </div>
        <button
          type="button"
          onClick={handleReset}
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid rgba(156, 122, 47, 0.25)",
            background: "rgba(255, 251, 240, 0.6)",
            fontSize: "12px",
            fontWeight: 700,
            color: INK_SECONDARY,
            cursor: "pointer"
          }}
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* ─── Left Column: Controls Panel ─── */}
        <div style={{ flex: "1 1 290px", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Planet Selector */}
          <div>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD_DEEP, fontWeight: 700, display: "block", marginBottom: "6px" }}>
              1. Choose Planet
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
              {PLANETS.map(p => {
                const active = planetId === p.id;
                const isSpecial = ["mars", "jupiter", "saturn"].includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPlanetId(p.id);
                      setHoveredHouse(null);
                    }}
                    style={{
                      padding: "6px 2px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      border: active 
                        ? `1.5px solid ${isSpecial ? "#9C7A2F" : "#4F6FA8"}` 
                        : "1.5px solid transparent",
                      background: active 
                        ? (isSpecial ? "rgba(156, 122, 47, 0.12)" : "rgba(79, 111, 168, 0.12)") 
                        : "rgba(255, 251, 240, 0.5)",
                      color: active 
                        ? (isSpecial ? GOLD_DEEP : INDIGO) 
                        : INK_SECONDARY,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "1px",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "800" }}>{p.abbr}</span>
                    <span style={{ fontSize: "9.5px", fontWeight: "600" }}>{p.name}</span>
                    <span style={{ fontSize: "8px", opacity: 0.8, fontWeight: "500" }}>({p.sanskrit})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Planet Position Slider */}
          <div>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD_DEEP, fontWeight: 700, display: "block", marginBottom: "4px" }}>
              2. Planet Placement (House)
            </label>
            <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(255, 251, 240, 0.4)", border: "1px solid rgba(156, 122, 47, 0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", color: INK_SECONDARY, fontWeight: 500 }}>House:</span>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={planetHouse}
                  onChange={(e) => {
                    setPlanetHouse(Number(e.target.value));
                    setHoveredHouse(null);
                  }}
                  className="gl-slider"
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: "15px", fontWeight: 800, color: GOLD_DEEP, width: "20px", textAlign: "right" }}>
                  {planetHouse}
                </span>
              </div>
              <div style={{ fontSize: "11px", color: INK_MUTED, marginTop: "2px" }}>
                Currently in: <span style={{ fontWeight: 600, color: INK_SECONDARY }}>{getHouseSign(planetHouse).nameIAST} ({getHouseSign(planetHouse).nameEnglish})</span>
              </div>
            </div>
          </div>

          {/* Lagna Selector */}
          <div>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: INDIGO, fontWeight: 700, display: "block", marginBottom: "6px" }}>
              3. Ascendant (Lagna) Sign
            </label>
            <select
              value={lagnaId}
              onChange={(e) => setLagnaId(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1.5px solid rgba(79, 111, 168, 0.25)",
                background: "rgba(255, 251, 240, 0.8)",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: 600,
                color: INK_PRIMARY,
                cursor: "pointer",
                outline: "none"
              }}
            >
              {RASHIS.map(r => (
                <option key={r.number} value={r.number}>
                  {r.number}. {r.nameIAST} ({r.nameEnglish})
                </option>
              ))}
            </select>
          </div>

          {/* Mode Selector */}
          <div>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD_DEEP, fontWeight: 700, display: "block", marginBottom: "6px" }}>
              4. Evaluation Model
            </label>
            <div style={{ display: "flex", gap: "6px", background: "rgba(156, 122, 47, 0.08)", padding: "4px", borderRadius: "8px" }}>
              <button
                type="button"
                onClick={() => {
                  setIsGradedMode(true);
                  setHoveredHouse(null);
                }}
                style={{
                  flex: 1,
                  padding: "8px 4px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  background: isGradedMode ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "transparent",
                  color: isGradedMode ? "#1A1408" : GOLD_DEEP,
                  transition: "all 0.2s ease"
                }}
              >
                Graded (BPHS Virupa)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsGradedMode(false);
                  setHoveredHouse(null);
                }}
                style={{
                  flex: 1,
                  padding: "8px 4px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  background: !isGradedMode ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "transparent",
                  color: !isGradedMode ? "#1A1408" : GOLD_DEEP,
                  transition: "all 0.2s ease"
                }}
              >
                Whole-House (Yes/No)
              </button>
            </div>
          </div>

          {/* Filters Checklist */}
          <div>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD_DEEP, fontWeight: 700, display: "block", marginBottom: "6px" }}>
              5. Filter Aspect Vectors
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <label style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "11.5px",
                fontWeight: 700,
                color: showFull ? GOLD_DEEP : INK_SECONDARY,
                background: showFull ? "rgba(156, 122, 47, 0.1)" : "rgba(0, 0, 0, 0.03)",
                padding: "6px 8px",
                borderRadius: "6px",
                border: `1px solid ${showFull ? "rgba(156, 122, 47, 0.3)" : "rgba(0,0,0,0.1)"}`,
                transition: "all 0.15s ease",
                userSelect: "none"
              }}>
                <input
                  type="checkbox"
                  checked={showFull}
                  onChange={(e) => {
                    setShowFull(e.target.checked);
                    setHoveredHouse(null);
                  }}
                  style={{ accentColor: GOLD }}
                />
                Show Full (60)
              </label>
              <label style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "11.5px",
                fontWeight: 700,
                color: showPartial ? INDIGO : INK_SECONDARY,
                background: showPartial ? "rgba(79, 111, 168, 0.1)" : "rgba(0, 0, 0, 0.03)",
                padding: "6px 8px",
                borderRadius: "6px",
                border: `1px solid ${showPartial ? "rgba(79, 111, 168, 0.3)" : "rgba(0,0,0,0.1)"}`,
                transition: "all 0.15s ease",
                userSelect: "none"
              }}>
                <input
                  type="checkbox"
                  disabled={!isGradedMode} // Partials are collapsed to 0 in Whole-House mode anyway
                  checked={isGradedMode ? showPartial : false}
                  onChange={(e) => {
                    setShowPartial(e.target.checked);
                    setHoveredHouse(null);
                  }}
                  style={{ accentColor: INDIGO }}
                />
                Show Partials
              </label>
            </div>
          </div>

          {/* Informational Note */}
          <div style={{ 
            padding: "10px 12px", 
            borderRadius: "8px", 
            background: "rgba(79, 111, 168, 0.05)", 
            border: "1px solid rgba(79, 111, 168, 0.12)",
            fontSize: "11.5px",
            lineHeight: "1.4",
            color: INK_SECONDARY
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", fontWeight: 700, color: INDIGO }}>
              <Info size={13} />
              Pedagogical Insight
            </div>
            {selectedPlanet.id === "saturn" && (
              <span>Saturn's 3rd and 10th aspects are normally ¼ strength (15 virupa) for other planets, but Saturn's special aspect upgrades them to <strong>Full (60 virupa)</strong>.</span>
            )}
            {selectedPlanet.id === "jupiter" && (
              <span>Jupiter's 5th and 9th aspects are normally ½ strength (30 virupa) for other planets, but Jupiter's special aspect upgrades them to <strong>Full (60 virupa)</strong>.</span>
            )}
            {selectedPlanet.id === "mars" && (
              <span>Mars's 4th and 8th aspects are normally ¾ strength (45 virupa) for other planets, but Mars's special aspect upgrades them to <strong>Full (60 virupa)</strong>.</span>
            )}
            {!["mars", "jupiter", "saturn"].includes(selectedPlanet.id) && (
              <span>{selectedPlanet.name} has no special aspects. In the graded model, it projects fractional gazes (15, 30, 45 virupa) onto houses, and full (60) gaze only on the 7th. In Whole-House mode, these fractions collapse to 0.</span>
            )}
          </div>

        </div>

        {/* ─── Right Column: Chart Wheel & Detail Panel ─── */}
        <div style={{ flex: "1.2 1 320px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
          
          {/* Circular SVG Wheel */}
          <div style={{ width: "320px", height: "320px", position: "relative" }}>
            <svg viewBox="0 0 360 360" width="100%" height="100%">
              <defs>
                <filter id="aspect-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Custom markers for arrowheads by strength */}
                <marker id="arrow-60" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#9C7A2F" />
                </marker>
                <marker id="arrow-45" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                </marker>
                <marker id="arrow-30" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#4F6FA8" />
                </marker>
                <marker id="arrow-15" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#4F6FA8" />
                </marker>
              </defs>

              {/* Draw 12 House Wedges */}
              {Array.from({ length: 12 }).map((_, index) => {
                const houseNum = index + 1;
                const angleSize = 30;
                // Align starting point (House 1) at the top (-90 degrees) counting counter-clockwise
                const startAngle = -90 - index * angleSize + 15;
                const endAngle = startAngle - angleSize;

                const textPos = getHouseCoord(houseNum, 138);
                const signPos = getHouseCoord(houseNum, 154);

                // Find if this house is being aspected
                const aspectEntry = filteredPlacements.find(p => p.houseNum === houseNum);
                const hasPlanet = planetHouse === houseNum;
                const isHovered = hoveredHouse === houseNum;

                // Wedge Coloring
                let wedgeFill = "rgba(255, 251, 240, 0.05)";
                let wedgeStroke = "rgba(156, 122, 47, 0.15)";
                let strokeWidth = "1";

                if (hasPlanet) {
                  wedgeFill = "rgba(156, 122, 47, 0.08)";
                  wedgeStroke = GOLD;
                  strokeWidth = "2";
                } else if (isHovered) {
                  wedgeFill = "rgba(156, 122, 47, 0.12)";
                  wedgeStroke = GOLD;
                  strokeWidth = "2.5";
                } else if (aspectEntry) {
                  if (aspectEntry.virupa === 60) {
                    wedgeFill = "rgba(156, 122, 47, 0.04)";
                    wedgeStroke = "rgba(156, 122, 47, 0.22)";
                  } else {
                    wedgeFill = "rgba(79, 111, 168, 0.02)";
                    wedgeStroke = "rgba(79, 111, 168, 0.12)";
                  }
                }

                const describeWedgeArc = (cx: number, cy: number, r: number, start: number, end: number) => {
                  const s = { x: cx + r * Math.cos(start * Math.PI / 180), y: cy + r * Math.sin(start * Math.PI / 180) };
                  const e = { x: cx + r * Math.cos(end * Math.PI / 180), y: cy + r * Math.sin(end * Math.PI / 180) };
                  return `M ${s.x} ${s.y} A ${r} ${r} 0 0 0 ${e.x} ${e.y} L ${cx} ${cy} Z`;
                };

                const signRotation = (() => {
                  let rot = textPos.angle + 90;
                  const norm = ((rot % 360) + 360) % 360;
                  if (norm > 90 && norm < 270) {
                    rot += 180;
                  }
                  return rot;
                })();

                return (
                  <g key={houseNum}>
                    {/* Wedge Path */}
                    <path
                      d={describeWedgeArc(180, 180, 125, startAngle, endAngle)}
                      fill={wedgeFill}
                      stroke={wedgeStroke}
                      strokeWidth={strokeWidth}
                      style={{ transition: "all 0.25s ease" }}
                    />

                    {/* Outer Sign text */}
                    <text
                      x={signPos.x} y={signPos.y}
                      textAnchor="middle" alignmentBaseline="middle"
                      fill={hasPlanet ? GOLD_DEEP : INK_MUTED}
                      fontSize="9" fontWeight={hasPlanet ? 800 : 600}
                      fontFamily="var(--font-sans)"
                      transform={`rotate(${signRotation}, ${signPos.x}, ${signPos.y})`}
                    >
                      {getHouseSign(houseNum).nameIAST.substring(0, 3)}
                    </text>

                    {/* House Number Inside */}
                    {houseNum === 1 ? (
                      <>
                        <text
                          x={textPos.x} y={textPos.y - 4}
                          textAnchor="middle" alignmentBaseline="middle"
                          fill={hasPlanet ? GOLD_DEEP : GOLD}
                          fontSize="11" fontWeight="800"
                          fontFamily="var(--font-sans)"
                        >
                          1
                        </text>
                        <text
                          x={textPos.x} y={textPos.y + 6}
                          textAnchor="middle" alignmentBaseline="middle"
                          fill={hasPlanet ? GOLD_DEEP : GOLD}
                          fontSize="6.5" fontWeight="800"
                          letterSpacing="0.05em"
                          fontFamily="var(--font-sans)"
                        >
                          LAGNA
                        </text>
                      </>
                    ) : (
                      <text
                        x={textPos.x} y={textPos.y}
                        textAnchor="middle" alignmentBaseline="middle"
                        fill={hasPlanet ? GOLD_DEEP : INK_SECONDARY}
                        fontSize="11.5" fontWeight={hasPlanet ? 800 : 500}
                        fontFamily="var(--font-sans)"
                      >
                        {houseNum}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Inner ring separator */}
              <circle cx="180" cy="180" r="85" fill="none" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1" />

              {/* Draw Aspect Lines (Vectors) */}
              <AnimatePresence>
                {filteredPlacements.map((p, idx) => {
                  const sourceCoord = getHouseCoord(planetHouse, 62);
                  const targetCoord = getHouseCoord(p.houseNum, 92);
                  const lineStyle = getLineStyle(p.virupa, p.houseNum);
                  const lineId = `${selectedPlanet.id}-${planetHouse}-${p.houseNum}-${isGradedMode}`;

                  return (
                    <g key={lineId}>
                      {/* Glow behind vector for premium feel - only for full/medium aspects (>=45 virupa) */}
                      {p.virupa >= 45 && (
                        <line
                          x1={sourceCoord.x} y1={sourceCoord.y}
                          x2={targetCoord.x} y2={targetCoord.y}
                          stroke={lineStyle.stroke}
                          strokeWidth={parseFloat(lineStyle.strokeWidth) * 2.5}
                          strokeLinecap="round"
                          opacity={parseFloat(lineStyle.opacity) * 0.22}
                          filter="url(#aspect-glow)"
                        />
                      )}

                      {/* Main Vector line */}
                      <motion.line
                        initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.05 }}
                        x1={sourceCoord.x} y1={sourceCoord.y}
                        x2={targetCoord.x} y2={targetCoord.y}
                        stroke={lineStyle.stroke}
                        strokeWidth={lineStyle.strokeWidth}
                        strokeDasharray={lineStyle.strokeDasharray}
                        strokeLinecap="round"
                        opacity={lineStyle.opacity}
                        markerEnd={`url(#arrow-${p.virupa})`}
                      />
                    </g>
                  );
                })}
              </AnimatePresence>

              {/* Planet Badge (drawn on top of vectors to cleanly mask them) */}
              {(() => {
                const coord = getHouseCoord(planetHouse, 62);
                const isSpecial = ["mars", "jupiter", "saturn"].includes(selectedPlanet.id);
                return (
                  <g key={selectedPlanet.id}>
                    {/* Planet badge outer circle */}
                    <circle
                      cx={coord.x} cy={coord.y} r="18"
                      fill="rgba(255, 251, 240, 0.98)"
                      stroke={isSpecial ? GOLD : INDIGO}
                      strokeWidth="2.5"
                    />

                    {/* Planet Sanskrit Abbreviation and Devanagari */}
                    <text
                      x={coord.x} y={coord.y - 2}
                      textAnchor="middle" alignmentBaseline="middle"
                      fill={INK_PRIMARY}
                      fontSize="10"
                      fontWeight="800"
                      fontFamily="var(--font-sans)"
                    >
                      {selectedPlanet.abbr}
                    </text>
                    <text
                      x={coord.x} y={coord.y + 9}
                      textAnchor="middle"
                      fill={isSpecial ? GOLD_DEEP : INDIGO}
                      fontSize="9.5"
                      fontWeight="800"
                    >
                      {selectedPlanet.devanagari}
                    </text>
                  </g>
                );
              })()}

              {/* Center Hub */}
              <circle cx="180" cy="180" r="28" fill="rgba(255, 251, 240, 0.98)" stroke={GOLD_LIGHT} strokeWidth="1.5" />
              <text x="180" y="176" textAnchor="middle" fill={GOLD_DEEP} fontSize="9" fontWeight="700" letterSpacing="0.08em">DRISHTI</text>
              <text x="180" y="188" textAnchor="middle" fill={INK_MUTED} fontSize="8.5" fontWeight="600">STRENGTH</text>
            </svg>
          </div>

          {/* Quick Summary Box */}
          <div style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "8px",
            background: "rgba(255, 251, 240, 0.5)",
            border: "1px solid rgba(156, 122, 47, 0.12)",
            fontSize: "12px",
            textAlign: "center"
          }}>
            <Sliders size={13} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle", color: GOLD }} />
            Active aspects count: <span style={{ fontWeight: 700, color: GOLD_DEEP }}>{filteredPlacements.length} visible</span>
          </div>

        </div>
      </div>

      {/* ─── Details Panel (Full Table) ─── */}
      <div style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: GOLD_DEEP, margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={14} />
            House Aspect Analysis (From {selectedPlanet.name})
          </h3>
          <span style={{ fontSize: "11px", color: INK_MUTED, marginLeft: "auto" }}>
            💡 Hover over table rows to isolate lines in the wheel
          </span>
        </div>
        
        <div style={{ borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.12)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", background: "rgba(255, 251, 240, 0.6)" }}>
            <thead>
              <tr style={{ background: "rgba(156, 122, 47, 0.08)", borderBottom: "1.5px solid rgba(156, 122, 47, 0.15)", textAlign: "left" }}>
                <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>House</th>
                <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>Sign</th>
                <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>Offset</th>
                <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>Base BPHS</th>
                <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>Effective Strength</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 12 }).map((_, idx) => {
                const hNum = idx + 1;
                const rashi = getHouseSign(hNum);
                const offset = getHouseFromPlanet(planetHouse, hNum);
                
                // Base calculation for other normal planets
                const baseVirupa = calculateDrishti("sun", offset, true);
                
                // Actual calculated virupa
                const actualVirupa = calculateDrishti(planetId, offset, isGradedMode);
                const hasAspect = actualVirupa > 0;
                
                // Check if aspect is visible under current filters
                const isAspectVisible = actualVirupa === 60 ? showFull : showPartial;
                const isRenderedAspect = hasAspect && isAspectVisible;

                // Special check for upgraded badge
                const isSpecialPlanet = ["mars", "jupiter", "saturn"].includes(planetId);
                const isUpgraded = isGradedMode && isSpecialPlanet && (
                  (planetId === "mars" && (offset === 4 || offset === 8)) ||
                  (planetId === "jupiter" && (offset === 5 || offset === 9)) ||
                  (planetId === "saturn" && (offset === 3 || offset === 10))
                );

                const isPlanetHere = planetHouse === hNum;
                const isRowHovered = hoveredHouse === hNum;

                let rowBg = "transparent";
                if (isPlanetHere) {
                  rowBg = "rgba(156, 122, 47, 0.05)";
                } else if (isRowHovered && isRenderedAspect) {
                  rowBg = "rgba(156, 122, 47, 0.08)";
                } else if (isRenderedAspect) {
                  rowBg = actualVirupa === 60 ? "rgba(156, 122, 47, 0.02)" : "rgba(79, 111, 168, 0.01)";
                }

                return (
                  <tr 
                    key={hNum} 
                    onMouseEnter={() => {
                      if (isRenderedAspect) setHoveredHouse(hNum);
                    }}
                    onMouseLeave={() => setHoveredHouse(null)}
                    style={{ 
                      background: rowBg, 
                      borderBottom: "1px solid rgba(156, 122, 47, 0.08)", 
                      transition: "all 0.15s ease",
                      cursor: isRenderedAspect ? "pointer" : "default"
                    }}
                  >
                    {/* House Index */}
                    <td style={{ padding: "8px 10px", fontWeight: isPlanetHere || isRenderedAspect ? 600 : 400 }}>
                      {hNum === 1 ? (
                        <span style={{ color: GOLD_DEEP, fontWeight: 700 }}>1st (Lagna)</span>
                      ) : (
                        `${hNum}th House`
                      )}
                      {isPlanetHere && (
                        <span style={{ fontSize: "9.5px", background: "rgba(156, 122, 47, 0.15)", color: GOLD_DEEP, padding: "2px 6px", borderRadius: "10px", marginLeft: "6px", fontWeight: 700 }}>
                          Placed
                        </span>
                      )}
                    </td>

                    {/* Sign Name */}
                    <td style={{ padding: "8px 10px", color: INK_SECONDARY }}>
                      {rashi.nameIAST} ({rashi.nameEnglish})
                    </td>

                    {/* Offset */}
                    <td style={{ padding: "8px 10px", color: INK_SECONDARY }}>
                      {offset === 1 ? "1st (Conjunction)" : `${offset}th from Planet`}
                    </td>

                    {/* Base Aspect */}
                    <td style={{ padding: "8px 10px", color: INK_MUTED }}>
                      {offset === 1 ? "—" : getDrishtiBadgeLabel(baseVirupa, false)}
                    </td>

                    {/* Effective Strength */}
                    <td style={{ padding: "8px 10px", fontWeight: isRenderedAspect ? 700 : 400 }}>
                      {isPlanetHere ? (
                        <span style={{ color: INK_MUTED }}>—</span>
                      ) : isRenderedAspect ? (
                        <span style={{ color: actualVirupa === 60 ? GOLD_DEEP : INDIGO, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          {isUpgraded && <CheckCircle2 size={13} style={{ color: GOLD }} />}
                          {getDrishtiBadgeLabel(actualVirupa, isUpgraded)}
                        </span>
                      ) : hasAspect && !isAspectVisible ? (
                        <span style={{ color: INK_MUTED, textDecoration: "line-through" }}>
                          {getDrishtiBadgeLabel(actualVirupa, isUpgraded)} (Hidden)
                        </span>
                      ) : (
                        <span style={{ color: INK_MUTED }}>None (0)</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
