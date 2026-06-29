"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, RotateCcw } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS, getRashiByNumber } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

type Mode = "sav" | "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";

interface PlanetInfo {
  label: string;
  symbol: string;
  expected: number;
  color: string;
  bav: number[];
}

const PLANETS: Record<Exclude<Mode, "sav">, PlanetInfo> = {
  sun: { label: "Sun", symbol: "☉", expected: 48, color: AMBER, bav: [4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 4] },
  moon: { label: "Moon", symbol: "☽", expected: 49, color: SLATE_BLUE, bav: [3, 4, 5, 5, 4, 4, 4, 3, 5, 4, 4, 4] },
  mars: { label: "Mars", symbol: "♂", expected: 39, color: "#ef4444", bav: [2, 3, 4, 4, 3, 3, 3, 3, 4, 3, 4, 3] },
  mercury: { label: "Mercury", symbol: "☿", expected: 54, color: "#10b981", bav: [5, 4, 4, 5, 4, 5, 4, 4, 5, 4, 5, 5] },
  jupiter: { label: "Jupiter", symbol: "♃", expected: 56, color: "#d97706", bav: [6, 5, 3, 5, 4, 5, 5, 4, 5, 5, 4, 5] },
  venus: { label: "Venus", symbol: "♀", expected: 52, color: PURPLE, bav: [5, 4, 2, 5, 4, 4, 4, 3, 5, 4, 4, 8] },
  saturn: { label: "Saturn", symbol: "♄", expected: 39, color: "#64748b", bav: [3, 3, 3, 4, 3, 3, 3, 3, 4, 3, 4, 3] },
};

const SAV_TOTAL = 337;
const planetKeys = Object.keys(PLANETS) as Exclude<Mode, "sav">[];

export function SavBuilder() {
  const [activeMode, setActiveMode] = useState<Mode>("sav");
  const [selectedSignIndex, setSelectedSignIndex] = useState<number | null>(null);

  const savGrid = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => planetKeys.reduce((sum, pk) => sum + PLANETS[pk].bav[i], 0));
  }, []);

  const activeGrid = useMemo(() => activeMode === "sav" ? savGrid : PLANETS[activeMode].bav, [activeMode, savGrid]);
  const activeTotal = useMemo(() => activeMode === "sav" ? SAV_TOTAL : PLANETS[activeMode].expected, [activeMode]);
  const activeColor = useMemo(() => activeMode === "sav" ? GOLD : PLANETS[activeMode].color, [activeMode]);

  const handleReset = () => {
    setActiveMode("sav");
    setSelectedSignIndex(null);
  };

  const circlePoints = useMemo(() => {
    const points = [];
    const cx = 150, cy = 150, r = 105;
    for (let i = 0; i < 12; i++) {
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      points.push({ x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad), angleDeg, rashiNum: i + 1 });
    }
    return points;
  }, []);

  const selectedSign = selectedSignIndex !== null ? getRashiByNumber(selectedSignIndex + 1) : null;

  const wheelSize = 230;

  return (
    <div data-interactive="sav-builder" style={{ padding: "14px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Scoped hover styles to avoid React hover-state glitches on touch */}
      <style>{`
        .sav-segment { cursor: pointer; transition: all 0.15s ease; }
        .sav-segment:hover { fill: color-mix(in srgb, var(--gl-gold-accent, #9C7A2F) 12%, transparent) !important; stroke: var(--gl-gold-accent, #9C7A2F) !important; stroke-width: 2 !important; }
        .sav-cell { cursor: pointer; transition: all 0.15s ease; }
        .sav-cell:hover { background: rgba(156, 122, 47, 0.08) !important; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Sarvāṣṭakavarga (SAV) Builder
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Sum the 7 planetary BAV grids sign-by-sign into the chart-wide SAV map.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Lagna exclusion banner */}
      <div style={{ background: "rgba(156,122,47,0.04)", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "8px 12px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
        <Info size={15} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "1px" }} />
        <div style={{ fontSize: "10.5px", lineHeight: 1.45, color: INK_SECONDARY }}>
          <strong>Lagna is excluded.</strong> The Lagna contributes bindus when building each planet&apos;s BAV, but the SAV sums only the <strong>7 planetary BAVs</strong> — keeping the total at exactly <strong>{SAV_TOTAL}</strong> bindus.
        </div>
      </div>

      {/* Mode tabs */}
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", background: "#ffffff", padding: "8px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
        <button
          onClick={() => setActiveMode("sav")}
          style={{
            padding: "5px 10px",
            borderRadius: "5px",
            border: activeMode === "sav" ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.08)",
            background: activeMode === "sav" ? "rgba(156,122,47,0.08)" : "#ffffff",
            fontSize: "11px",
            fontWeight: 800,
            color: activeMode === "sav" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer"
          }}
        >
          Σ SAV ({SAV_TOTAL})
        </button>
        {planetKeys.map(pk => {
          const p = PLANETS[pk];
          const active = activeMode === pk;
          return (
            <button
              key={pk}
              onClick={() => setActiveMode(pk)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                padding: "5px 8px",
                borderRadius: "5px",
                border: active ? `1.5px solid ${p.color}` : "1px solid rgba(0,0,0,0.08)",
                background: active ? `${p.color}12` : "#ffffff",
                fontSize: "10.5px",
                fontWeight: active ? 800 : 600,
                color: active ? p.color : INK_SECONDARY,
                cursor: "pointer"
              }}
            >
              <span>{p.symbol}</span>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>

        {/* Left: compact sign grid + breakdown */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h4 style={{ margin: 0, fontSize: "10px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>
                {activeMode === "sav" ? "SAV per sign" : `${PLANETS[activeMode].label} BAV per sign`}
              </h4>
              <span style={{ fontSize: "9px", color: INK_MUTED }}>Tap a sign to inspect</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "5px" }}>
              {RASHIS.map((r, idx) => {
                const isSelected = selectedSignIndex === idx;
                const value = activeGrid[idx];
                return (
                  <div
                    key={r.number}
                    className="sav-cell"
                    onClick={() => setSelectedSignIndex(idx)}
                    style={{
                      background: isSelected ? `${activeColor}18` : "rgba(156,122,47,0.04)",
                      border: `1.2px solid ${isSelected ? activeColor : "rgba(156,122,47,0.12)"}`,
                      borderRadius: "6px",
                      padding: "6px 3px",
                      textAlign: "center"
                    }}
                  >
                    <div style={{ fontSize: "8px", fontWeight: 700, color: INK_MUTED }}>{r.nameEnglish}</div>
                    <div style={{ fontSize: "14px", fontWeight: 900, color: isSelected ? activeColor : INK_PRIMARY }}>{value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Breakdown panel */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", flex: 1, minHeight: "90px" }}>
            <AnimatePresence mode="wait">
              {selectedSign ? (
                <motion.div
                  key={`breakdown-${selectedSignIndex}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <div style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP }}>
                    {selectedSign.nameEnglish} breakdown
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {planetKeys.map(pk => {
                      const p = PLANETS[pk];
                      const isActive = activeMode === pk;
                      return (
                        <span
                          key={pk}
                          style={{
                            fontSize: "9px",
                            padding: "3px 6px",
                            borderRadius: "4px",
                            background: isActive ? `${p.color}18` : "rgba(156,122,47,0.06)",
                            border: `1px solid ${isActive ? p.color : "rgba(156,122,47,0.12)"}`,
                            color: isActive ? p.color : INK_SECONDARY,
                            fontWeight: isActive ? 800 : 600
                          }}
                        >
                          {p.symbol} {p.bav[selectedSignIndex!]}
                        </span>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: "10.5px", color: INK_SECONDARY, lineHeight: "1.45" }}>
                    {planetKeys.map(pk => PLANETS[pk].bav[selectedSignIndex!]).join(" + ")} = <strong style={{ color: GOLD_DEEP }}>{savGrid[selectedSignIndex!]}</strong> SAV bindus
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "70px" }}
                >
                  <span style={{ fontSize: "10.5px", color: INK_MUTED, fontStyle: "italic" }}>Tap any sign above to see its 7-planet breakdown.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: wheel */}
        <div style={{ flex: "1 1 260px", minWidth: "240px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "6px" }}>
            <h4 style={{ margin: 0, fontSize: "10px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>
              {activeMode === "sav" ? "Sarvāṣṭakavarga Wheel" : `${PLANETS[activeMode].label} BAV Wheel`}
            </h4>
            <span style={{ fontSize: "10px", fontWeight: 800, color: activeColor }}>
              Total: {activeTotal}
            </span>
          </div>

          <div style={{ position: "relative", width: `${wheelSize}px`, height: `${wheelSize}px` }}>
            <svg width={wheelSize} height={wheelSize} viewBox="0 0 300 300" style={{ overflow: "visible" }}>
              <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="2" />
              <circle cx="150" cy="150" r="72" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />

              {RASHIS.map((_, i) => {
                const angleDeg = i * 30 - 105;
                const angleRad = (angleDeg * Math.PI) / 180;
                const lx = 150 + 130 * Math.cos(angleRad);
                const ly = 150 + 130 * Math.sin(angleRad);
                return <line key={`line-${i}`} x1="150" y1="150" x2={lx} y2={ly} stroke="rgba(156,122,47,0.08)" strokeWidth="1.2" />;
              })}

              {RASHIS.map((r, i) => {
                const num = r.number;
                const isSelected = selectedSignIndex === (num - 1);

                const startAngle = i * 30 - 105;
                const endAngle = i * 30 - 75;
                const so = { x: 150 + 130 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((startAngle * Math.PI) / 180) };
                const eo = { x: 150 + 130 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((endAngle * Math.PI) / 180) };
                const si = { x: 150 + 72 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 72 * Math.sin((startAngle * Math.PI) / 180) };
                const ei = { x: 150 + 72 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 72 * Math.sin((endAngle * Math.PI) / 180) };

                const pathData = [
                  `M ${si.x} ${si.y}`,
                  `L ${so.x} ${so.y}`,
                  `A 130 130 0 0 1 ${eo.x} ${eo.y}`,
                  `L ${ei.x} ${ei.y}`,
                  `A 72 72 0 0 0 ${si.x} ${si.y}`,
                  "Z"
                ].join(" ");

                return (
                  <path
                    key={`spath-${num}`}
                    className="sav-segment"
                    d={pathData}
                    fill={isSelected ? `color-mix(in srgb, ${activeColor} 16%, transparent)` : "transparent"}
                    stroke={isSelected ? activeColor : "rgba(156,122,47,0.08)"}
                    strokeWidth={isSelected ? "2.5" : "0.5"}
                    onClick={() => setSelectedSignIndex(num - 1)}
                  />
                );
              })}

              {circlePoints.map(p => {
                const r = RASHIS[p.rashiNum - 1];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 150 + 115 * Math.cos(angleRad), y: 150 + 115 * Math.sin(angleRad) };
                const ptBindu = { x: 150 + 85 * Math.cos(angleRad), y: 150 + 85 * Math.sin(angleRad) };
                const isSelected = selectedSignIndex === (p.rashiNum - 1);
                const value = activeGrid[p.rashiNum - 1];

                return (
                  <g key={`slabel-${p.rashiNum}`}>
                    <text
                      x={ptEng.x}
                      y={ptEng.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "8px", fontWeight: 700, fill: INK_PRIMARY }}
                    >
                      {r.nameEnglish}
                    </text>

                    <g style={{ cursor: "pointer" }} onClick={() => setSelectedSignIndex(p.rashiNum - 1)}>
                      <circle
                        cx={ptBindu.x}
                        cy={ptBindu.y}
                        r={isSelected ? "14" : "11"}
                        fill={isSelected ? activeColor : activeMode === "sav" ? "rgba(156,122,47,0.05)" : `color-mix(in srgb, ${activeColor} 10%, transparent)`}
                        stroke={isSelected ? "#ffffff" : activeColor}
                        strokeWidth={isSelected ? "2" : "1"}
                        style={{ transition: "all 0.15s" }}
                      />
                      <text
                        x={ptBindu.x}
                        y={ptBindu.y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: isSelected ? "10px" : "8.5px", fontWeight: 900, fill: isSelected ? "#ffffff" : INK_SECONDARY }}
                      >
                        {value}
                      </text>
                    </g>
                  </g>
                );
              })}

              <circle cx="150" cy="150" r="28" fill="#ffffff" stroke={GOLD} strokeWidth="1.5" />
              <text x="150" y="145" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>TOTAL</text>
              <text x="150" y="160" textAnchor="middle" style={{ fontSize: "12px", fontWeight: 900, fill: GOLD_DEEP }}>{activeTotal}</text>
              <text x="150" y="170" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>BINDUS</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). Summing the 7 planetary BAV totals yields exactly {SAV_TOTAL} bindus (48 + 49 + 39 + 54 + 56 + 52 + 39 = {SAV_TOTAL}). This is the chart-wide checksum.
      </div>
    </div>
  );
}
