"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, Info, CheckCircle2, ArrowRightLeft } from "lucide-react";
import { RASHIS } from "../rashi-data";
import { useLessonSlug } from "../rashi-attribute-wheel";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const INDIGO = "#4F6FA8";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

const CARA_COLOR = "#be123c"; // Crimson red for Movable (Cara)
const STHIRA_COLOR = "#0f766e"; // Teal/Green for Fixed (Sthira)
const DVI_COLOR = "#4338ca"; // Indigo for Dual (Dvi-svabhāva)

// North Indian Chart Geometries (400x400 SVG)
// Outer boundary is logical 400x400 grid (viewBox 0 0 400 400)
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
  12: "200,10 390,10 295,105",
};

// Center positions for rendering sign details / planet list in each house
const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 105 },  // Top Diamond
  2: { x: 105, y: 45 },   // Top Left Triangle (Top-most)
  3: { x: 45, y: 105 },   // Top Left Triangle (Left-most)
  4: { x: 105, y: 200 },  // Left Diamond
  5: { x: 45, y: 295 },   // Bottom Left Triangle (Left-most)
  6: { x: 105, y: 355 },  // Bottom Left Triangle (Bottom-most)
  7: { x: 200, y: 295 },  // Bottom Diamond
  8: { x: 295, y: 355 },  // Bottom Right Triangle (Bottom-most)
  9: { x: 355, y: 295 },  // Bottom Right Triangle (Right-most)
  10: { x: 295, y: 200 }, // Right Diamond
  11: { x: 355, y: 105 }, // Top Right Triangle (Right-most)
  12: { x: 295, y: 45 },  // Top Right Triangle (Top-most)
};

// Text coordinates for house sign numbers (positioned outside the central yantra circle to avoid overlap)
const HOUSE_SIGN_NUM_POS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 144 },  // Moved further up to clear central circle
  2: { x: 105, y: 85 },
  3: { x: 85, y: 105 },
  4: { x: 144, y: 200 },  // Moved further left to clear central circle
  5: { x: 90, y: 295 },
  6: { x: 105, y: 325 },
  7: { x: 200, y: 256 },  // Moved further down to clear central circle
  8: { x: 295, y: 325 },
  9: { x: 315, y: 295 },
  10: { x: 256, y: 200 }, // Moved further right to clear central circle
  11: { x: 315, y: 105 },
  12: { x: 295, y: 85 },
};

// Text coordinates for fixed house number labels (positioned near the outer boundary/corners of each segment)
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
  12: { x: 295, y: 35 },
};

interface AspectResult {
  aspected: number[];
  skipped: number | null;
  modality: "Movable" | "Fixed" | "Dual";
}

function getRashiDrishti(signIndex: number): AspectResult {
  const movable = [1, 4, 7, 10];
  const fixed = [2, 5, 8, 11];
  const dual = [3, 6, 9, 12];

  if (movable.includes(signIndex)) {
    const skipped = (signIndex % 12) + 1; // adjacent fixed sign
    const aspected = fixed.filter(f => f !== skipped);
    return { aspected, skipped, modality: "Movable" };
  }

  if (fixed.includes(signIndex)) {
    const skipped = signIndex === 2 ? 1 : signIndex - 1; // adjacent movable sign
    const aspected = movable.filter(m => m !== skipped);
    return { aspected, skipped, modality: "Fixed" };
  }

  const aspected = dual.filter(d => d !== signIndex);
  return { aspected, skipped: null, modality: "Dual" };
}

function checkGrahaDrishti(planet: "Mars" | "Saturn", fromSign: number, toSign: number): boolean {
  if (planet === "Mars") {
    const aspects = [
      (fromSign + 3) % 12 || 12, // 4th aspect
      (fromSign + 6) % 12 || 12, // 7th aspect
      (fromSign + 7) % 12 || 12  // 8th aspect
    ];
    return aspects.includes(toSign);
  } else {
    const aspects = [
      (fromSign + 2) % 12 || 12, // 3rd aspect
      (fromSign + 6) % 12 || 12, // 7th aspect
      (fromSign + 9) % 12 || 12  // 10th aspect
    ];
    return aspects.includes(toSign);
  }
}

export function RashiDrishtiGrid() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Context-aware defaults
  const lessonSlug = useLessonSlug();
  const defaultTab = lessonSlug === "applying-rashi-drishti-to-planets" ? "planets" : "signs";
  const [activeTab, setActiveTab] = useState<"signs" | "planets">(defaultTab);

  // Tab 1: Sign aspects state
  const [selectedSign, setSelectedSign] = useState<number>(1); // Aries default
  const [isMutualityMode, setIsMutualityMode] = useState<boolean>(false);
  const [hoveredSign, setHoveredSign] = useState<number | null>(null);

  // Tab 2: Planet links state (default Mars in Aries, Saturn in Aquarius matching worked example)
  const [marsSign, setMarsSign] = useState<number>(1);
  const [saturnSign, setSaturnSign] = useState<number>(11);

  // Sync tab with slug changes
  useEffect(() => {
    if (lessonSlug === "applying-rashi-drishti-to-planets") {
      setActiveTab("planets");
    } else {
      setActiveTab("signs");
    }
  }, [lessonSlug]);

  const activeRashi = useMemo(() => {
    return RASHIS.find(r => r.number === selectedSign) ?? RASHIS[0];
  }, [selectedSign]);

  const drishtiResult = useMemo(() => {
    return getRashiDrishti(selectedSign);
  }, [selectedSign]);

  const getRashiModalityEnum = (mod: string): "Movable" | "Fixed" | "Dual" => {
    if (mod === "Chara" || mod === "Movable" || mod === "Cara") return "Movable";
    if (mod === "Fixed" || mod === "Sthira") return "Fixed";
    return "Dual";
  };

  const getModalityColor = (mod: "Movable" | "Fixed" | "Dual" | string) => {
    if (mod === "Movable" || mod === "Chara" || mod === "Cara") return CARA_COLOR;
    if (mod === "Fixed" || mod === "Sthira") return STHIRA_COLOR;
    return DVI_COLOR;
  };

  const getModalityLabel = (mod: string) => {
    if (mod === "Chara" || mod === "Movable" || mod === "Cara") return "CARA";
    if (mod === "Sthira" || mod === "Fixed") return "STHI";
    return "DVI";
  };

  const getModalityName = (mod: string) => {
    if (mod === "Movable" || mod === "Chara" || mod === "Cara") return "Cara (Movable)";
    if (mod === "Fixed" || mod === "Sthira") return "Sthira (Fixed)";
    return "Dvi-svabhāva (Dual)";
  };

  const handleReset = () => {
    if (activeTab === "signs") {
      setSelectedSign(1);
      setIsMutualityMode(false);
      setHoveredSign(null);
    } else {
      setMarsSign(1);
      setSaturnSign(11);
    }
  };

  // Compute quadratic Bezier path string arcing outwards from center (200, 200), shortened at ends to clear text
  const getBezierPath = (from: number, to: number, isSkipped: boolean) => {
    const p1 = HOUSE_CENTERS[from];
    const p2 = HOUSE_CENTERS[to];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const L = Math.sqrt(dx * dx + dy * dy);

    if (L < 0.1) {
      return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
    }

    // Shorten path by 32px at both ends to cleanly clear cell text & badges
    const margin = 32;
    const x1 = p1.x + (dx / L) * margin;
    const y1 = p1.y + (dy / L) * margin;
    const x2 = p2.x - (dx / L) * margin;
    const y2 = p2.y - (dy / L) * margin;

    if (isSkipped) {
      // Draw straight dashed line for skipped adjacent signs
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    // Midpoint of shortened path
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    // Calculate perpendicular unit normal vector
    let Ux = -dy / L;
    let Uy = dx / L;

    // Vector from center (200, 200) to midpoint
    const vx = mx - 200;
    const vy = my - 200;

    // Direct curve outward (away from center)
    const dot = Ux * vx + Uy * vy;
    if (dot < 0) {
      Ux = -Ux;
      Uy = -Uy;
    }

    // Outward bend height of 30 pixels creates a beautiful orbiting effect
    const bend = 30;
    const cx = mx + bend * Ux;
    const cy = my + bend * Uy;

    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  // Compute aspects for Tab 1 (Sign Mode)
  const aspectLines = useMemo(() => {
    if (activeTab !== "signs") return [];
    const list: { from: number; to: number; isSkipped: boolean; isReturn: boolean }[] = [];

    // Forward aspects
    drishtiResult.aspected.forEach(target => {
      list.push({ from: selectedSign, to: target, isSkipped: false, isReturn: false });
    });

    // Skipped sign
    if (drishtiResult.skipped !== null) {
      list.push({ from: selectedSign, to: drishtiResult.skipped, isSkipped: true, isReturn: false });
    }

    // Return aspects for Mutuality Mode
    if (isMutualityMode) {
      drishtiResult.aspected.forEach(target => {
        list.push({ from: target, to: selectedSign, isSkipped: false, isReturn: true });
      });
    }

    return list;
  }, [selectedSign, drishtiResult, isMutualityMode, activeTab]);

  // Compute aspect channels for Tab 2 (Planet Mode)
  const planetLinks = useMemo(() => {
    if (activeTab !== "planets") return { hasRashi: false, marsAspectsSaturn: false, saturnAspectsMars: false, list: [] };
    
    const p1 = HOUSE_CENTERS[marsSign];
    const p2 = HOUSE_CENTERS[saturnSign];
    const list: { from: number; to: number; type: "rashi" | "mars-graha" | "saturn-graha"; path: string; stroke: string; markerId?: string }[] = [];
    
    // 1. Jaimini Rashi-Drishti (Mutual)
    const hasRashi = getRashiDrishti(marsSign).aspected.includes(saturnSign);
    if (hasRashi) {
      const path = getBezierPath(marsSign, saturnSign, false);
      list.push({
        from: marsSign,
        to: saturnSign,
        type: "rashi",
        path,
        stroke: GOLD,
      });
    }

    const margin = 32;

    // 2. Mars Graha-Drishti -> Saturn
    const marsAspectsSaturn = checkGrahaDrishti("Mars", marsSign, saturnSign);
    if (marsAspectsSaturn) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const L = Math.sqrt(dx*dx + dy*dy) || 1;
      const x1 = p1.x + (dx / L) * margin;
      const y1 = p1.y + (dy / L) * margin;
      const x2 = p2.x - (dx / L) * margin;
      const y2 = p2.y - (dy / L) * margin;

      list.push({
        from: marsSign,
        to: saturnSign,
        type: "mars-graha",
        path: `M ${x1} ${y1} L ${x2} ${y2}`,
        stroke: CARA_COLOR,
        markerId: "arrow-movable"
      });
    }

    // 3. Saturn Graha-Drishti -> Mars
    const saturnAspectsMars = checkGrahaDrishti("Saturn", saturnSign, marsSign);
    if (saturnAspectsMars) {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const L = Math.sqrt(dx*dx + dy*dy) || 1;
      const x1 = p2.x + (dx / L) * margin;
      const y1 = p2.y + (dy / L) * margin;
      const x2 = p1.x - (dx / L) * margin;
      const y2 = p1.y - (dy / L) * margin;

      list.push({
        from: saturnSign,
        to: marsSign,
        type: "saturn-graha",
        path: `M ${x1} ${y1} L ${x2} ${y2}`,
        stroke: INDIGO,
        markerId: "arrow-return"
      });
    }

    return { hasRashi, marsAspectsSaturn, saturnAspectsMars, list };
  }, [marsSign, saturnSign, activeTab]);

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
      data-interactive="rashi-drishti-grid"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-yantra {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-yantra {
          animation: spin-yantra 35s linear infinite;
          transform-origin: 200px 200px;
        }
      `}} />

      {/* Header and Reset */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Jaimini Rāśi-Dṛṣṭi Grid
          </span>
          <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0, color: GOLD_DEEP }}>
            Aspect Mandala & Constellation Grid
          </h2>
        </div>
        <button
          type="button"
          onClick={handleReset}
          style={{
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

      {/* Mode Tab Bar */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid rgba(156, 122, 47, 0.15)",
        marginBottom: "18px",
        gap: "4px"
      }}>
        <button
          type="button"
          onClick={() => setActiveTab("signs")}
          style={{
            padding: "8px 16px",
            border: "none",
            background: activeTab === "signs" ? "rgba(156, 122, 47, 0.10)" : "transparent",
            borderBottom: activeTab === "signs" ? `2.5px solid ${GOLD}` : "2.5px solid transparent",
            color: activeTab === "signs" ? GOLD_DEEP : INK_SECONDARY,
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          Sign Aspects (Māndala)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("planets")}
          style={{
            padding: "8px 16px",
            border: "none",
            background: activeTab === "planets" ? "rgba(156, 122, 47, 0.10)" : "transparent",
            borderBottom: activeTab === "planets" ? `2.5px solid ${GOLD}` : "2.5px solid transparent",
            color: activeTab === "planets" ? GOLD_DEEP : INK_SECONDARY,
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
        >
          Planet Link Analyzer
        </button>
      </div>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        
        {/* ─── Left Column: Controls & Dynamic Guides ─── */}
        <div style={{ flex: "1 1 290px", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {activeTab === "signs" ? (
            /* TAB 1: Sign Aspects Controls */
            <>
              <div>
                <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD_DEEP, fontWeight: 700, display: "block", marginBottom: "6px" }}>
                  1. Select a Sign (Rāśi)
                </label>
                <div style={{
                  maxHeight: "220px",
                  overflowY: "auto",
                  borderRadius: "8px",
                  border: "1px solid rgba(156, 122, 47, 0.15)",
                  background: "rgba(255, 251, 240, 0.4)",
                  padding: "4px"
                }}>
                  {RASHIS.map(r => {
                    const active = selectedSign === r.number;
                    const modEnum = getRashiModalityEnum(r.modality);
                    const modColor = getModalityColor(modEnum);
                    return (
                      <button
                        key={r.number}
                        type="button"
                        onClick={() => {
                          setSelectedSign(r.number);
                          setHoveredSign(null);
                        }}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "none",
                          background: active ? "rgba(156, 122, 47, 0.12)" : "transparent",
                          color: active ? GOLD_DEEP : INK_PRIMARY,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontWeight: active ? 700 : 500,
                          fontSize: "13px",
                          textAlign: "left",
                          transition: "background 0.15s ease"
                        }}
                      >
                        <span>{r.number}. {r.nameIAST} ({r.nameEnglish})</span>
                        <span style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          color: "#fff",
                          background: modColor,
                          padding: "2px 6px",
                          borderRadius: "10px",
                          textTransform: "uppercase"
                        }}>
                          {getModalityLabel(r.modality)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD_DEEP, fontWeight: 700, display: "block", marginBottom: "6px" }}>
                  2. Aspect Mutuality View
                </label>
                <button
                  type="button"
                  onClick={() => setIsMutualityMode(!isMutualityMode)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: "none",
                    background: isMutualityMode ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.08)",
                    color: isMutualityMode ? "#1A1408" : GOLD_DEEP,
                    fontWeight: 700,
                    fontSize: "12.5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <ArrowRightLeft size={14} />
                  {isMutualityMode ? "Mutuality: ACTIVE (Mutual Gaze)" : "Enable Mutual Gaze Toggles"}
                </button>
              </div>

              {/* Modality Rule Guide */}
              <div style={{
                padding: "12px 14px",
                borderRadius: "8px",
                background: "rgba(255, 251, 240, 0.55)",
                border: "1px solid rgba(156, 122, 47, 0.12)",
                fontSize: "12px",
                lineHeight: "1.45"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", fontWeight: 700, color: getModalityColor(drishtiResult.modality) }}>
                  <Info size={14} />
                  {getModalityName(activeRashi.modality)} Rule
                </div>
                {drishtiResult.modality === "Movable" && (
                  <span>
                    <strong>Cara (Movable)</strong> signs aspect all <strong>Sthira (Fixed)</strong> signs <strong>EXCEPT</strong> the one immediately adjacent to them.
                    Since {activeRashi.nameIAST} is Movable, it aspects Leo, Scorpio, and Aquarius, but skips adjacent <strong>{drishtiResult.skipped && RASHIS[drishtiResult.skipped - 1].nameIAST}</strong>.
                  </span>
                )}
                {drishtiResult.modality === "Fixed" && (
                  <span>
                    <strong>Sthira (Fixed)</strong> signs aspect all <strong>Cara (Movable)</strong> signs <strong>EXCEPT</strong> the one immediately adjacent to them.
                    Since {activeRashi.nameIAST} is Fixed, it aspects Cancer, Libra, and Capricorn, but skips adjacent <strong>{drishtiResult.skipped && RASHIS[drishtiResult.skipped - 1].nameIAST}</strong>.
                  </span>
                )}
                {drishtiResult.modality === "Dual" && (
                  <span>
                    <strong>Dvi-svabhāva (Dual)</strong> signs aspect <strong>the other three Dual signs</strong>. There are no adjacent exceptions, so all four dual signs (Gemini, Virgo, Sagittarius, Pisces) aspect each other mutually.
                  </span>
                )}
              </div>
            </>
          ) : (
            /* TAB 2: Planet Link Analyzer Controls */
            <>
              {/* Mars Position Selector */}
              <div>
                <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: CARA_COLOR, fontWeight: 700, display: "block", marginBottom: "6px" }}>
                  Mars (Mangala ♂) Position
                </label>
                <select
                  value={marsSign}
                  onChange={(e) => setMarsSign(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: "1px solid rgba(156, 122, 47, 0.25)",
                    background: "rgba(255, 251, 240, 0.7)",
                    color: INK_PRIMARY,
                    fontSize: "13.5px",
                    fontWeight: 600,
                    outline: "none"
                  }}
                >
                  {RASHIS.map(r => (
                    <option key={r.number} value={r.number}>
                      {r.number}. {r.nameIAST} ({r.nameEnglish}) - {getModalityLabel(r.modality)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Saturn Position Selector */}
              <div>
                <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: INDIGO, fontWeight: 700, display: "block", marginBottom: "6px" }}>
                  Saturn (Shani ♄) Position
                </label>
                <select
                  value={saturnSign}
                  onChange={(e) => setSaturnSign(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: "1px solid rgba(156, 122, 47, 0.25)",
                    background: "rgba(255, 251, 240, 0.7)",
                    color: INK_PRIMARY,
                    fontSize: "13.5px",
                    fontWeight: 600,
                    outline: "none"
                  }}
                >
                  {RASHIS.map(r => (
                    <option key={r.number} value={r.number}>
                      {r.number}. {r.nameIAST} ({r.nameEnglish}) - {getModalityLabel(r.modality)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Diagnostic Results Summary */}
              <div style={{
                padding: "12px 14px",
                borderRadius: "8px",
                background: "rgba(255, 251, 240, 0.55)",
                border: "1px solid rgba(156, 122, 47, 0.12)",
                fontSize: "12.5px",
                lineHeight: "1.45"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", fontWeight: 700, color: GOLD_DEEP }}>
                  <Info size={14} />
                  Aspect Channel Analysis
                </div>
                
                {/* 1. Jaimini Channel */}
                <div style={{ marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
                  <span>Jaimini Rāśi-Dṛṣṭi:</span>
                  <span style={{
                    fontWeight: 700,
                    color: planetLinks.hasRashi ? GOLD_DEEP : INK_MUTED
                  }}>
                    {planetLinks.hasRashi ? "ACTIVE (Mutual)" : "INACTIVE"}
                  </span>
                </div>

                {/* 2. Parashari Channel */}
                <div style={{ marginBottom: "6px", display: "flex", flexDirection: "column", borderTop: "1px solid rgba(156,122,47,0.08)", paddingTop: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Parāśari Graha-Dṛṣṭi:</span>
                    <span style={{
                      fontWeight: 700,
                      color: (planetLinks.marsAspectsSaturn || planetLinks.saturnAspectsMars) ? INDIGO : INK_MUTED
                    }}>
                      {(planetLinks.marsAspectsSaturn || planetLinks.saturnAspectsMars) ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: INK_MUTED, marginTop: "2px" }}>
                    {planetLinks.marsAspectsSaturn && (
                      <div style={{ color: CARA_COLOR }}>• Mars ♂ aspects Saturn ♄</div>
                    )}
                    {planetLinks.saturnAspectsMars && (
                      <div style={{ color: INDIGO }}>• Saturn ♄ aspects Mars ♂</div>
                    )}
                    {!planetLinks.marsAspectsSaturn && !planetLinks.saturnAspectsMars && "• No active planetary aspects"}
                  </div>
                </div>

                {/* 3. Synthesis Verdict */}
                <div style={{
                  marginTop: "10px",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  background: (planetLinks.hasRashi && (planetLinks.marsAspectsSaturn || planetLinks.saturnAspectsMars))
                    ? "rgba(156, 122, 47, 0.12)"
                    : planetLinks.hasRashi
                      ? "rgba(156, 122, 47, 0.08)"
                      : (planetLinks.marsAspectsSaturn || planetLinks.saturnAspectsMars)
                        ? "rgba(79, 111, 168, 0.12)"
                        : "rgba(0,0,0,0.03)",
                  color: (planetLinks.hasRashi && (planetLinks.marsAspectsSaturn || planetLinks.saturnAspectsMars))
                    ? GOLD_DEEP
                    : planetLinks.hasRashi
                      ? GOLD_DEEP
                      : (planetLinks.marsAspectsSaturn || planetLinks.saturnAspectsMars)
                        ? INDIGO
                        : INK_MUTED
                }}>
                  {(planetLinks.hasRashi && (planetLinks.marsAspectsSaturn || planetLinks.saturnAspectsMars))
                    ? "REINFORCED ASPECT (Strong Link)"
                    : planetLinks.hasRashi
                      ? "JAIMINI-ONLY LINK (Hidden Connection)"
                      : (planetLinks.marsAspectsSaturn || planetLinks.saturnAspectsMars)
                        ? "PARĀŚARI-ONLY LINK"
                        : "NO ASPECT CHANNELS ACTIVE"}
                </div>
              </div>

              {/* Pedagogical Takeaway */}
              <div style={{
                padding: "10px 12px",
                borderRadius: "8px",
                background: "rgba(255, 251, 240, 0.35)",
                border: "1px dashed rgba(156, 122, 47, 0.20)",
                fontSize: "11.5px",
                color: INK_SECONDARY,
                lineHeight: "1.4"
              }}>
                {planetLinks.hasRashi && !planetLinks.marsAspectsSaturn && !planetLinks.saturnAspectsMars && (
                  <span>
                    💡 <strong>Jaimini-Only:</strong> Notice how these two planets are mutually linked through their sign locations, even though neither planet aspects the other under Parāśari rules. This is the cornerstone of Jaimini's unique interpretative and yoga logic.
                  </span>
                )}
                {planetLinks.hasRashi && (planetLinks.marsAspectsSaturn || planetLinks.saturnAspectsMars) && (
                  <span>
                    🔥 <strong>Reinforced Connection:</strong> Both systems are active. The direct planetary gaze and the sign-aspect channels overlap, indicating a very powerful, high-confidence link in interpretation.
                  </span>
                )}
                {!planetLinks.hasRashi && (planetLinks.marsAspectsSaturn || planetLinks.saturnAspectsMars) && (
                  <span>
                    🪐 <strong>Parāśari-Only:</strong> A standard planetary aspect is present, but Jaimini sign-aspect mechanics do not connect these signs.
                  </span>
                )}
                {!planetLinks.hasRashi && !planetLinks.marsAspectsSaturn && !planetLinks.saturnAspectsMars && (
                  <span>
                    ❌ <strong>No connection:</strong> The planets are currently completely independent. Try moving Mars to Aries and Saturn to Scorpio or Aquarius to activate aspect channels.
                  </span>
                )}
              </div>
            </>
          )}

        </div>

        {/* ─── Right Column: North Indian Chart Grid ─── */}
        <div style={{ flex: "1.2 1 320px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
          
          {/* North Indian SVG Canvas */}
          <div style={{ width: "320px", height: "320px", position: "relative" }}>
            <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ background: "rgba(255, 251, 240, 0.2)", borderRadius: "12px", overflow: "visible" }}>
              <defs>
                <filter id="yantra-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                
                {/* Modality arrowheads */}
                <marker id="arrow-movable" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={CARA_COLOR} />
                </marker>
                <marker id="arrow-fixed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={STHIRA_COLOR} />
                </marker>
                <marker id="arrow-dual" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={DVI_COLOR} />
                </marker>
                <marker id="arrow-return" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={INDIGO} />
                </marker>
              </defs>

              {/* 1. Draw 12 House Polygons with Highlights */}
              {Array.from({ length: 12 }, (_, idx) => {
                const sNum = idx + 1; // Aries Lagna means Sign == House

                // Mode-dependent states
                const isSelected = activeTab === "signs" && selectedSign === sNum;
                const isAspected = activeTab === "signs" && drishtiResult.aspected.includes(sNum);
                const isSkipped = activeTab === "signs" && drishtiResult.skipped === sNum;
                const isHovered = hoveredSign === sNum;

                // Tab 2 Specific highlights
                const isMarsCell = activeTab === "planets" && marsSign === sNum;
                const isSaturnCell = activeTab === "planets" && saturnSign === sNum;

                const modEnum = getRashiModalityEnum(RASHIS[sNum - 1].modality);
                const modColor = getModalityColor(modEnum);

                let cellFill = "transparent";
                let cellStroke = "rgba(156, 122, 47, 0.15)";
                let borderThickness = 1.0;

                if (activeTab === "signs") {
                  if (isSelected) {
                    cellFill = `${modColor}14`;
                    cellStroke = modColor;
                    borderThickness = 2.5;
                  } else if (isSkipped) {
                    cellFill = "rgba(185, 28, 28, 0.04)";
                    cellStroke = "#b91c1c";
                    borderThickness = 1.5;
                  } else if (isHovered && isAspected) {
                    cellFill = `${modColor}0F`;
                    cellStroke = modColor;
                    borderThickness = 2;
                  } else if (isAspected) {
                    cellFill = "rgba(156, 122, 47, 0.01)";
                    cellStroke = "rgba(156, 122, 47, 0.25)";
                    borderThickness = 1.2;
                  }
                } else {
                  // Planets Mode highlights
                  if (isMarsCell && isSaturnCell) {
                    cellFill = "rgba(156, 122, 47, 0.10)";
                    cellStroke = GOLD;
                    borderThickness = 2.5;
                  } else if (isMarsCell) {
                    cellFill = "rgba(190, 18, 60, 0.06)";
                    cellStroke = CARA_COLOR;
                    borderThickness = 2.0;
                  } else if (isSaturnCell) {
                    cellFill = "rgba(67, 56, 202, 0.06)";
                    cellStroke = INDIGO;
                    borderThickness = 2.0;
                  }
                }

                return (
                  <g key={`house-group-${sNum}`}>
                    {/* Main House Polygon */}
                    <polygon
                      points={HOUSE_POLYGONS[sNum]}
                      fill={cellFill}
                      stroke={cellStroke}
                      strokeWidth={borderThickness}
                      strokeDasharray={isSkipped ? "3,3" : undefined}
                      style={{ transition: "all 0.2s ease" }}
                    />
                    
                    {/* Fixed House Label H1-H12 */}
                    <text
                      x={HOUSE_LABEL_POSITIONS[sNum].x}
                      y={HOUSE_LABEL_POSITIONS[sNum].y}
                      fill="rgba(107, 95, 82, 0.22)"
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="select-none pointer-events-none"
                    >
                      H{sNum}
                    </text>

                    {/* Sign Number */}
                    <text
                      x={HOUSE_SIGN_NUM_POS[sNum].x}
                      y={HOUSE_SIGN_NUM_POS[sNum].y}
                      fill={isSelected ? modColor : (isSkipped ? "#b91c1c" : INK_MUTED)}
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="select-none pointer-events-none"
                    >
                      {sNum}
                    </text>

                    {/* Sign English Name inside the house */}
                    <text
                      x={HOUSE_CENTERS[sNum].x}
                      y={HOUSE_CENTERS[sNum].y - 12}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isSelected ? modColor : (isSkipped ? "#b91c1c" : INK_PRIMARY)}
                      fontSize="12.5"
                      fontWeight="800"
                      style={{ letterSpacing: "0.02em" }}
                    >
                      {RASHIS[sNum - 1].nameEnglish}
                    </text>

                    {/* Sign Sanskrit IAST Name inside the house */}
                    <text
                      x={HOUSE_CENTERS[sNum].x}
                      y={HOUSE_CENTERS[sNum].y + 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isSelected ? modColor : INK_SECONDARY}
                      fontSize="9.5"
                      fontWeight="600"
                    >
                      ({RASHIS[sNum - 1].nameIAST})
                    </text>

                    {/* Modality badge inside the house */}
                    {isSkipped ? (
                      <g transform={`translate(${HOUSE_CENTERS[sNum].x}, ${HOUSE_CENTERS[sNum].y + 16})`}>
                        <rect x="-24" y="-7" width="48" height="14" rx="7" fill="#b91c1c" />
                        <text y="1" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" letterSpacing="0.05em">
                          SKIPPED
                        </text>
                      </g>
                    ) : (
                      <g transform={`translate(${HOUSE_CENTERS[sNum].x}, ${HOUSE_CENTERS[sNum].y + 16})`}>
                        <rect x="-20" y="-7" width="40" height="14" rx="7" fill={modColor} opacity={isSelected ? 1 : 0.8} />
                        <text y="1" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" letterSpacing="0.05em">
                          {getModalityLabel(RASHIS[sNum - 1].modality)}
                        </text>
                      </g>
                    )}

                    {/* Click Catcher Overlay */}
                    <polygon
                      points={HOUSE_POLYGONS[sNum]}
                      fill="transparent"
                      cursor="pointer"
                      onClick={() => {
                        if (activeTab === "signs") {
                          setSelectedSign(sNum);
                          setHoveredSign(null);
                        } else {
                          // In planets mode, tap cycling:
                          if (marsSign !== sNum) {
                            setMarsSign(sNum);
                          } else {
                            setSaturnSign(sNum);
                          }
                        }
                      }}
                    />
                  </g>
                );
              })}

              {/* 2. Draw North Indian Diagonal & Diamond Lines */}
              <g stroke="var(--gl-gold-accent, #9C7A2F)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ pointerEvents: "none" }}>
                <rect x="10" y="10" width="380" height="380" />
                <line x1="10" y1="10" x2="390" y2="390" />
                <line x1="390" y1="10" x2="10" y2="390" />
                <line x1="200" y1="10" x2="10" y2="200" />
                <line x1="10" y1="200" x2="200" y2="390" />
                <line x1="200" y1="390" x2="390" y2="200" />
                <line x1="390" y1="200" x2="200" y2="10" />
              </g>

              {/* 3. Render Planet Markers on top of the centers */}
              {activeTab === "planets" && (
                <>
                  {/* Draw Mars if present */}
                  <g transform={`translate(${HOUSE_CENTERS[marsSign].x - (marsSign === saturnSign ? 18 : 0)}, ${HOUSE_CENTERS[marsSign].y - 28})`}>
                    <rect x="-20" y="-9" width="40" height="18" rx="4" fill={CARA_COLOR} stroke="#ffffff" strokeWidth="0.8" />
                    <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">Ma(म)</text>
                  </g>
                  {/* Draw Saturn if present */}
                  <g transform={`translate(${HOUSE_CENTERS[saturnSign].x + (marsSign === saturnSign ? 18 : 0)}, ${HOUSE_CENTERS[saturnSign].y - 28})`}>
                    <rect x="-20" y="-9" width="40" height="18" rx="4" fill="#4F6FA8" stroke="#ffffff" strokeWidth="0.8" />
                    <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">Sa(श)</text>
                  </g>
                </>
              )}

              {/* 4. Draw Aspect Lines */}
              {activeTab === "signs" ? (
                /* Tab 1: Sign Aspect Lines */
                <AnimatePresence>
                  {aspectLines.map((line, idx) => {
                    const path = getBezierPath(line.from, line.to, line.isSkipped);

                    const modColor = getModalityColor(drishtiResult.modality);
                    const stroke = line.isSkipped 
                      ? "#b91c1c" 
                      : (line.isReturn ? INDIGO : modColor);

                    const opacity = line.isSkipped 
                      ? 0.35 
                      : (hoveredSign !== null 
                        ? (hoveredSign === line.to || hoveredSign === line.from ? 1.0 : 0.05) 
                        : (line.isReturn ? 0.45 : 0.85));

                    const strokeWidth = line.isSkipped 
                      ? "1.2" 
                      : (hoveredSign === line.to ? "3.2" : "2.2");

                    const strokeDasharray = line.isSkipped 
                      ? "2,3" 
                      : (line.isReturn ? "4,4" : "none");

                    const markerId = line.isSkipped 
                      ? undefined 
                      : (line.isReturn ? "arrow-return" : `arrow-${drishtiResult.modality.toLowerCase()}`);

                    const lineKey = `mandala-line-${line.from}-${line.to}-${line.isSkipped}-${line.isReturn}`;

                    return (
                      <g key={lineKey}>
                        {/* Glow path behind aspect curves */}
                        {!line.isSkipped && !line.isReturn && (
                          <path
                            d={path}
                            fill="none"
                            stroke={stroke}
                            strokeWidth={parseFloat(strokeWidth) * 2.5}
                            strokeLinecap="round"
                            opacity={opacity * 0.2}
                            filter="url(#yantra-glow)"
                          />
                        )}

                        {/* Main curve */}
                        <motion.path
                          initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.05 }}
                          d={path}
                          fill="none"
                          stroke={stroke}
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDasharray}
                          strokeLinecap="round"
                          opacity={opacity}
                          markerEnd={markerId ? `url(#${markerId})` : undefined}
                          style={{ pointerEvents: "none" }}
                        />
                      </g>
                    );
                  })}
                </AnimatePresence>
              ) : (
                /* Tab 2: Planet Aspect Channels */
                <AnimatePresence>
                  {planetLinks.list.map((line, idx) => {
                    const isRashi = line.type === "rashi";
                    const strokeWidth = isRashi ? "2.5" : "2.0";
                    const strokeDasharray = isRashi ? "none" : "3,3";
                    const markerId = line.markerId;

                    return (
                      <g key={`planet-link-line-${idx}-${line.from}-${line.to}`}>
                        {/* Rashi curved path glow */}
                        {isRashi && (
                          <path
                            d={line.path}
                            fill="none"
                            stroke={line.stroke}
                            strokeWidth={6}
                            strokeLinecap="round"
                            opacity={0.15}
                            filter="url(#yantra-glow)"
                          />
                        )}

                        <motion.path
                          initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.1 }}
                          d={line.path}
                          fill="none"
                          stroke={line.stroke}
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDasharray}
                          strokeLinecap="round"
                          markerEnd={markerId ? `url(#${markerId})` : undefined}
                          style={{ pointerEvents: "none" }}
                        />
                      </g>
                    );
                  })}
                </AnimatePresence>
              )}

              {/* 5. Center Hub Details (inside rotating yantra circle overlay at 200, 200) */}
              <circle cx="200" cy="200" r="44" fill="rgba(255, 251, 240, 0.96)" stroke={activeTab === "signs" ? getModalityColor(drishtiResult.modality) : (planetLinks.hasRashi ? GOLD : INK_MUTED)} strokeWidth="2.5" style={{ filter: "drop-shadow(0px 3px 6px rgba(72,48,16,0.12))" }} />
              
              {activeTab === "signs" ? (
                /* Sign Mode center hub details */
                <>
                  <text x="200" y="191" textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight="800">
                    {activeRashi.nameDevanagari}
                  </text>
                  <text x="200" y="206" textAnchor="middle" fill={getModalityColor(drishtiResult.modality)} fontSize="11" fontWeight="700">
                    {activeRashi.nameIAST}
                  </text>
                  <text x="200" y="217" textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight="700" letterSpacing="0.05em">
                    {getModalityLabel(activeRashi.modality)} / {drishtiResult.modality.toUpperCase()}
                  </text>
                </>
              ) : (
                /* Planets Mode center hub details */
                <>
                  <text x="200" y="192" textAnchor="middle" fill={GOLD_DEEP} fontSize="18" fontWeight="800" letterSpacing="0.05em">
                    ♂ ↔ ♄
                  </text>
                  <text x="200" y="206" textAnchor="middle" fill={planetLinks.hasRashi ? GOLD_DEEP : (planetLinks.marsAspectsSaturn || planetLinks.saturnAspectsMars ? INDIGO : INK_MUTED)} fontSize="9.5" fontWeight="800" letterSpacing="0.03em">
                    {planetLinks.hasRashi && (planetLinks.marsAspectsSaturn || planetLinks.saturnAspectsMars)
                      ? "REINFORCED"
                      : planetLinks.hasRashi
                        ? "JAIMINI-ONLY"
                        : (planetLinks.marsAspectsSaturn || planetLinks.saturnAspectsMars)
                          ? "PARĀŚARI-ONLY"
                          : "NO ASPECT"}
                  </text>
                  <text x="200" y="217" textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight="700" letterSpacing="0.05em">
                    PLANET LINK
                  </text>
                </>
              )}
            </svg>
          </div>

          {/* Quick Summary Badge */}
          <div style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "8px",
            background: "rgba(255, 251, 240, 0.5)",
            border: "1px solid rgba(156, 122, 47, 0.12)",
            fontSize: "12px",
            textAlign: "center"
          }}>
            {activeTab === "signs" ? (
              <>
                <Sparkles size={13} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle", color: getModalityColor(drishtiResult.modality) }} />
                Active aspects: <span style={{ fontWeight: 700, color: GOLD_DEEP }}>3 signs aspected</span>
              </>
            ) : (
              <>
                <Sparkles size={13} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle", color: planetLinks.hasRashi ? GOLD : INDIGO }} />
                Active aspect channels: <span style={{ fontWeight: 700, color: GOLD_DEEP }}>
                  {planetLinks.list.length === 0 ? "0 active channels" : `${planetLinks.list.length} channel(s) active`}
                </span>
              </>
            )}
          </div>

        </div>
      </div>

      {/* ─── Details Panel (Full Table) ─── */}
      <div style={{ marginTop: "24px" }}>
        {activeTab === "signs" ? (
          /* TAB 1 Details Table */
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: GOLD_DEEP, margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={14} />
                Aspect and skipped analysis details
              </h3>
              <span style={{ fontSize: "11px", color: INK_MUTED, marginLeft: "auto" }}>
                💡 Hover over table rows to isolate lines in the wheel
              </span>
            </div>
            
            <div style={{ borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.12)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", background: "rgba(255, 251, 240, 0.6)" }}>
                <thead>
                  <tr style={{ background: "rgba(156, 122, 47, 0.08)", borderBottom: "1.5px solid rgba(156, 122, 47, 0.15)", textAlign: "left" }}>
                    <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>Target Sign</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>Modality</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>Lord</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>Aspect Status</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>Jaimini Rule Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {RASHIS.map((rashi) => {
                    const sNum = rashi.number;
                    const isSelected = selectedSign === sNum;
                    const isAspected = drishtiResult.aspected.includes(sNum);
                    const isSkipped = drishtiResult.skipped === sNum;

                    const isRowHovered = hoveredSign === sNum;

                    const targetModEnum = getRashiModalityEnum(rashi.modality);
                    const targetModColor = getModalityColor(targetModEnum);

                    let rowBg = "transparent";
                    if (isSelected) {
                      rowBg = "rgba(156, 122, 47, 0.05)";
                    } else if (isRowHovered && (isAspected || isSkipped)) {
                      rowBg = "rgba(156, 122, 47, 0.08)";
                    } else if (isAspected) {
                      rowBg = "rgba(15, 118, 110, 0.02)";
                    } else if (isSkipped) {
                      rowBg = "rgba(185, 28, 28, 0.02)";
                    }

                    return (
                      <tr 
                         key={sNum}
                         onMouseEnter={() => {
                           if (isAspected || isSkipped) setHoveredSign(sNum);
                         }}
                         onMouseLeave={() => setHoveredSign(null)}
                         style={{ 
                           background: rowBg, 
                           borderBottom: "1px solid rgba(156, 122, 47, 0.08)", 
                           transition: "all 0.15s ease",
                           cursor: (isAspected || isSkipped) ? "pointer" : "default"
                         }}
                      >
                        {/* Sign Name */}
                        <td style={{ padding: "8px 10px", fontWeight: isSelected || isAspected ? 600 : 400 }}>
                          {sNum}. {rashi.nameIAST} ({rashi.nameEnglish})
                          {isSelected && (
                            <span style={{ fontSize: "9.5px", background: "rgba(156, 122, 47, 0.15)", color: GOLD_DEEP, padding: "2px 6px", borderRadius: "10px", marginLeft: "6px", fontWeight: 700 }}>
                              Selected
                            </span>
                          )}
                        </td>

                        {/* Modality */}
                        <td style={{ padding: "8px 10px" }}>
                          <span style={{ color: targetModColor, fontWeight: 600 }}>
                            {getModalityName(rashi.modality)}
                          </span>
                        </td>

                        {/* Lord */}
                        <td style={{ padding: "8px 10px", color: INK_SECONDARY }}>
                          {rashi.lord}
                        </td>

                        {/* Aspect Status */}
                        <td style={{ padding: "8px 10px", fontWeight: isAspected || isSkipped ? 700 : 400 }}>
                          {isSelected ? (
                            <span style={{ color: INK_MUTED }}>—</span>
                          ) : isAspected ? (
                            <span style={{ color: getModalityColor(drishtiResult.modality), display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <CheckCircle2 size={13} />
                              Aspected (Mutual)
                            </span>
                          ) : isSkipped ? (
                            <span style={{ color: "#b91c1c" }}>Skipped (Adjacent)</span>
                          ) : (
                            <span style={{ color: INK_MUTED }}>No Aspect</span>
                          )}
                        </td>

                        {/* Explanation */}
                        <td style={{ padding: "8px 10px", fontSize: "12px", color: INK_MUTED }}>
                          {isSelected ? (
                            "This is the source sign casting the aspects."
                          ) : isAspected ? (
                            `${getModalityLabel(activeRashi.modality)} sign aspects opposite ${getModalityLabel(rashi.modality)} sign.`
                          ) : isSkipped ? (
                            `Skipped because ${rashi.nameIAST} is immediately adjacent to ${activeRashi.nameIAST}.`
                          ) : (
                            `Modality rule does not apply between ${getModalityLabel(activeRashi.modality)} and ${getModalityLabel(rashi.modality)}.`
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* TAB 2 Details Table */
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: GOLD_DEEP, margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={14} />
                Planet Aspect Matrix Summary
              </h3>
            </div>
            
            <div style={{ borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.12)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", background: "rgba(255, 251, 240, 0.6)" }}>
                <thead>
                  <tr style={{ background: "rgba(156, 122, 47, 0.08)", borderBottom: "1.5px solid rgba(156, 122, 47, 0.15)", textAlign: "left" }}>
                    <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>Aspect Channel</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>Methodology</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>Connection Detail</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>System Status</th>
                    <th style={{ padding: "8px 10px", fontWeight: 700, color: INK_PRIMARY }}>Pedagogical Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1: Rashi Drishti */}
                  <tr style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.08)" }}>
                    <td style={{ padding: "8px 10px", fontWeight: 600 }}>Jaimini Rāśi-Dṛṣṭi</td>
                    <td style={{ padding: "8px 10px", color: GOLD_DEEP }}>Sign-to-Sign (Modality)</td>
                    <td style={{ padding: "8px 10px" }}>
                      {RASHIS[marsSign - 1].nameIAST} ({getModalityLabel(RASHIS[marsSign - 1].modality)}) ↔ {RASHIS[saturnSign - 1].nameIAST} ({getModalityLabel(RASHIS[saturnSign - 1].modality)})
                    </td>
                    <td style={{ padding: "8px 10px", fontWeight: 700 }}>
                      {planetLinks.hasRashi ? (
                        <span style={{ color: GOLD_DEEP, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle2 size={13} /> Active (Mutual)
                        </span>
                      ) : (
                        <span style={{ color: INK_MUTED }}>Inactive</span>
                      )}
                    </td>
                    <td style={{ padding: "8px 10px", fontSize: "12px", color: INK_MUTED }}>
                      Binds planets together globally via their sign placement, ignoring house degrees.
                    </td>
                  </tr>

                  {/* Row 2: Mars Graha-Drishti */}
                  <tr style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.08)" }}>
                    <td style={{ padding: "8px 10px", fontWeight: 600 }}>Mars Graha-Dṛṣṭi</td>
                    <td style={{ padding: "8px 10px", color: CARA_COLOR }}>Planet-to-Sign (7/4/8 aspects)</td>
                    <td style={{ padding: "8px 10px" }}>
                      Mars in {RASHIS[marsSign - 1].nameIAST} → Saturn in {RASHIS[saturnSign - 1].nameIAST}
                    </td>
                    <td style={{ padding: "8px 10px", fontWeight: 700 }}>
                      {planetLinks.marsAspectsSaturn ? (
                        <span style={{ color: CARA_COLOR, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle2 size={13} /> Active
                        </span>
                      ) : (
                        <span style={{ color: INK_MUTED }}>Inactive</span>
                      )}
                    </td>
                    <td style={{ padding: "8px 10px", fontSize: "12px", color: INK_MUTED }}>
                      Direct laser-like energetic projection from Mars to signs 4, 7, and 8 houses away.
                    </td>
                  </tr>

                  {/* Row 3: Saturn Graha-Drishti */}
                  <tr>
                    <td style={{ padding: "8px 10px", fontWeight: 600 }}>Saturn Graha-Dṛṣṭi</td>
                    <td style={{ padding: "8px 10px", color: INDIGO }}>Planet-to-Sign (7/3/10 aspects)</td>
                    <td style={{ padding: "8px 10px" }}>
                      Saturn in {RASHIS[saturnSign - 1].nameIAST} → Mars in {RASHIS[marsSign - 1].nameIAST}
                    </td>
                    <td style={{ padding: "8px 10px", fontWeight: 700 }}>
                      {planetLinks.saturnAspectsMars ? (
                        <span style={{ color: INDIGO, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle2 size={13} /> Active
                        </span>
                      ) : (
                        <span style={{ color: INK_MUTED }}>Inactive</span>
                      )}
                    </td>
                    <td style={{ padding: "8px 10px", fontSize: "12px", color: INK_MUTED }}>
                      Direct structural-restricting gaze from Saturn to signs 3, 7, and 10 houses away.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
