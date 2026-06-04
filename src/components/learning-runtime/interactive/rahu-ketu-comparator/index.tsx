"use client";

import { useState } from "react";
import { Sparkles, ArrowRightLeft, Focus, Eye } from "lucide-react";
import { COMPARISON_DATA, InteractiveMode } from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const VERMILION = "#A23A1E";
const JADE = "#3A8C5A";
const INK_ON_CREAM_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_ON_CREAM_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_ON_CREAM_MUTED = "var(--gl-ink-on-cream-muted)";

const MODES: { id: InteractiveMode; label: string; icon: React.ElementType }[] = [
  { id: "scan", label: "Scan Table", icon: Eye },
  { id: "axis", label: "House Axis", icon: ArrowRightLeft },
  { id: "conjunction", label: "Conjunction", icon: Focus },
  { id: "dasa", label: "Daśā Lengths", icon: Sparkles },
];

const HOUSES = [
  { i: 0,  poly: "150,0 75,75 150,150 225,75",        center: [150, 75], numPos: [150, 20] },
  { i: 1,  poly: "0,0 150,0 75,75",                   center: [75, 35],  numPos: [50, 20] },
  { i: 2,  poly: "0,0 75,75 0,150",                   center: [35, 75],  numPos: [20, 50] },
  { i: 3,  poly: "0,150 75,75 150,150 75,225",        center: [75, 150], numPos: [40, 150] },
  { i: 4,  poly: "0,150 75,225 0,300",                center: [35, 225], numPos: [20, 250] },
  { i: 5,  poly: "0,300 75,225 150,300",              center: [75, 265], numPos: [50, 280] },
  { i: 6,  poly: "150,300 75,225 150,150 225,225",    center: [150, 225],numPos: [150, 280] },
  { i: 7,  poly: "150,300 225,225 300,300",           center: [225, 265],numPos: [250, 280] },
  { i: 8,  poly: "300,300 225,225 300,150",           center: [265, 225],numPos: [280, 250] },
  { i: 9,  poly: "300,150 225,225 150,150 225,75",    center: [225, 150],numPos: [260, 150] },
  { i: 10, poly: "300,150 225,75 300,0",              center: [265, 75], numPos: [280, 50] },
  { i: 11, poly: "150,0 225,75 300,0",                center: [225, 35], numPos: [250, 20] },
];

export function RahuKetuComparator() {
  const [activeMode, setActiveMode] = useState<InteractiveMode>("scan");
  const [ketuHouse, setKetuHouse] = useState<number>(11); // 0-indexed, 11 is 12th house

  const rahuHouse = (ketuHouse + 6) % 12;
  const isConjunctionMode = activeMode === "conjunction";
  const isInteractiveChart = activeMode === "axis" || activeMode === "conjunction";

  const handleHouseClick = (index: number) => {
    if (isInteractiveChart) {
      setKetuHouse(index);
    }
  };

  const setMode = (mode: InteractiveMode) => {
    setActiveMode(mode);
    if (mode === "axis") {
      setKetuHouse(11); // Default to 12th house
    }
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 items-stretch"
      data-interactive="rahu-ketu-comparator"
    >
      {/* ────────── LEFT: Interactive Visualizer ────────── */}
      <div
        className="gl-surface-twilight-glass p-6 flex flex-col items-center justify-center relative"
        style={{ minHeight: "560px", overflow: "hidden" }}
      >
        <p
          className="uppercase mb-6 text-center"
          style={{
            color: GOLD,
            letterSpacing: "0.16em",
            fontWeight: 700,
            fontSize: "12px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            position: "absolute",
            top: "24px",
            left: "0",
            right: "0"
          }}
        >
          {activeMode === "scan" ? "The Comparison" : activeMode === "axis" ? "The Axis (180° Apart)" : activeMode === "conjunction" ? "Conjunction Effect" : "Daśā Periods"}
        </p>

        <div style={{ position: "relative", width: "100%", maxWidth: "300px", aspectRatio: "1/1", marginTop: "10px", userSelect: "none" }}>
          <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ overflow: "visible" }}>
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render the 12 houses as North Indian Chart polygons */}
            <g>
              {HOUSES.map((house) => {
                const isKetu = isInteractiveChart && house.i === ketuHouse;
                const isRahu = isInteractiveChart && house.i === rahuHouse;
                const isHoverable = isInteractiveChart;

                return (
                  <g 
                    key={house.i}
                    onClick={() => handleHouseClick(house.i)}
                    style={{ cursor: isHoverable ? "pointer" : "default" }}
                    className="group"
                  >
                    <polygon 
                      points={house.poly}
                      fill={isKetu ? `${JADE}1A` : isRahu ? `${VERMILION}1A` : "transparent"}
                      stroke={GOLD}
                      strokeWidth="1.5"
                      strokeOpacity="0.4"
                      className="transition-colors duration-300"
                      style={{ 
                        strokeDasharray: (isKetu || isRahu) ? "none" : "4 4" 
                      }}
                    />
                    
                    {/* Hover effect overlay */}
                    {isHoverable && (
                      <polygon 
                        points={house.poly}
                        fill="rgba(232, 199, 114, 0)"
                        className="hover:fill-[#E8C772] hover:fill-opacity-20 transition-all duration-150"
                      />
                    )}

                    {/* House Number */}
                    <text 
                      x={house.numPos[0]} 
                      y={house.numPos[1] + 4} 
                      textAnchor="middle" 
                      fontSize="10" 
                      fill={INK_ON_CREAM_MUTED}
                      fontFamily="var(--font-sans), system-ui, sans-serif"
                    >
                      {house.i + 1}
                    </text>

                    {/* Ketu Marker */}
                    {isKetu && (
                      <g transform={`translate(${house.center[0]}, ${house.center[1]})`} filter="url(#glow)">
                        <circle cx="0" cy="0" r="14" fill={JADE} />
                        <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#FFF" fontWeight="bold" fontFamily="var(--font-cormorant), serif">Ke</text>
                        
                        {/* Conjunction Planet (Venus) */}
                        {isConjunctionMode && (
                          <g transform="translate(18, 12)">
                            <circle cx="0" cy="0" r="12" fill="#E8C772" stroke={GOLD_DEEP} strokeWidth="1" />
                            <text x="0" y="4" textAnchor="middle" fontSize="10" fill={GOLD_DEEP} fontWeight="bold" fontFamily="var(--font-sans), system-ui, sans-serif">Ve</text>
                          </g>
                        )}
                      </g>
                    )}

                    {/* Rahu Marker */}
                    {isRahu && (
                      <g transform={`translate(${house.center[0]}, ${house.center[1]})`} filter="url(#glow)">
                        <circle cx="0" cy="0" r="14" fill={VERMILION} />
                        <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#FFF" fontWeight="bold" fontFamily="var(--font-cormorant), serif">Ra</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
            
            {/* Outline box to frame the chart neatly */}
            <rect x="0" y="0" width="300" height="300" fill="none" stroke={GOLD} strokeWidth="2" strokeOpacity="0.6" pointerEvents="none" />
          </svg>
        </div>

        {/* Fixed-height Context Box to prevent layout shifts */}
        <div style={{ position: "absolute", bottom: "24px", left: "24px", right: "24px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          {activeMode === "axis" && (
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "15.5px", color: INK_ON_CREAM_PRIMARY, margin: 0 }}>
              Ketu in the <strong>{ketuHouse + 1}th</strong> marks where the soul renounces.<br/>
              Rāhu in the <strong>{rahuHouse + 1}th</strong> marks where it grasps.
            </p>
          )}
          {activeMode === "conjunction" && (
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "15.5px", color: JADE, margin: 0 }}>
              Ketu conjoins Venus: It <em>cuts</em> Venus's outer expression<br/>while <em>deepening</em> its inner devotion.
            </p>
          )}
        </div>
      </div>

      {/* ────────── RIGHT: Guidance & Table Panel ────────── */}
      <aside className="gl-surface-twilight-glass flex flex-col h-full" style={{ minHeight: "560px" }}>
        {/* Toggle Controls */}
        <div className="p-4 border-b border-opacity-20" style={{ borderColor: GOLD }}>
          <p
            className="uppercase mb-3"
            style={{
              color: GOLD,
              letterSpacing: "0.12em",
              fontWeight: 700,
              fontSize: "11px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
            }}
          >
            Things to try
          </p>
          <div className="flex flex-col gap-2">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setMode(mode.id)}
                className="gl-clickable gl-focus-ring"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  background: activeMode === mode.id ? "rgba(232, 199, 114, 0.15)" : "transparent",
                  border: `1px solid ${activeMode === mode.id ? GOLD : "transparent"}`,
                  textAlign: "left",
                  transition: "all 0.2s ease"
                }}
              >
                <mode.icon size={14} color={activeMode === mode.id ? GOLD_DEEP : GOLD} />
                <span
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "13px",
                    fontWeight: activeMode === mode.id ? 700 : 500,
                    color: activeMode === mode.id ? GOLD_DEEP : INK_ON_CREAM_SECONDARY,
                  }}
                >
                  {mode.label}
                </span>
                {activeMode === mode.id && (mode.id === "axis" || mode.id === "conjunction") && (
                   <span style={{ marginLeft: "auto", fontSize: "11px", color: INK_ON_CREAM_MUTED, fontStyle: "italic", fontFamily: "var(--font-cormorant), serif" }}>Tap chart on left</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-4 flex-1 overflow-y-auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${GOLD}66` }}>
                <th style={{ textAlign: "left", padding: "6px 4px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: INK_ON_CREAM_MUTED, fontFamily: "var(--font-sans)" }}>Attribute</th>
                <th style={{ textAlign: "left", padding: "6px 4px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: VERMILION, fontFamily: "var(--font-sans)" }}>Rāhu (Head)</th>
                <th style={{ textAlign: "left", padding: "6px 4px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: JADE, fontFamily: "var(--font-sans)" }}>Ketu (Body)</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row) => {
                let isHighlighted = false;
                if (activeMode === "scan" && row.isInversion) isHighlighted = true;
                if (activeMode === "dasa" && row.id === "dasa") isHighlighted = true;
                if ((activeMode === "axis" || activeMode === "conjunction") && row.id === "chart") isHighlighted = true;
                if (activeMode === "conjunction" && row.id === "mode") isHighlighted = true;

                return (
                  <tr 
                    key={row.id}
                    style={{ 
                      borderBottom: `1px dashed ${GOLD}33`,
                      background: isHighlighted ? "rgba(232, 199, 114, 0.15)" : "transparent",
                      transition: "background 0.3s ease"
                    }}
                  >
                    <td style={{ 
                      padding: "10px 4px", 
                      fontSize: "13px", 
                      fontWeight: 600,
                      color: isHighlighted ? GOLD_DEEP : INK_ON_CREAM_PRIMARY,
                      fontFamily: "var(--font-sans), system-ui, sans-serif" 
                    }}>
                      {row.label}
                    </td>
                    <td style={{ 
                      padding: "10px 4px", 
                      fontSize: "14px", 
                      fontFamily: "var(--font-cormorant), serif",
                      color: isHighlighted ? VERMILION : INK_ON_CREAM_SECONDARY,
                      fontWeight: isHighlighted ? 500 : 400
                    }}>
                      {row.rahu}
                    </td>
                    <td style={{ 
                      padding: "10px 4px", 
                      fontSize: "14px", 
                      fontFamily: "var(--font-cormorant), serif",
                      color: isHighlighted ? JADE : INK_ON_CREAM_SECONDARY,
                      fontWeight: isHighlighted ? 500 : 400
                    }}>
                      {row.ketu}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div style={{ minHeight: "30px", marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {activeMode === "scan" && (
              <p style={{ fontSize: "14px", fontStyle: "italic", fontFamily: "var(--font-cormorant), serif", color: INK_ON_CREAM_SECONDARY, textAlign: "center", margin: 0 }}>
                Notice how the nodes invert on Mars and Mercury.
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

