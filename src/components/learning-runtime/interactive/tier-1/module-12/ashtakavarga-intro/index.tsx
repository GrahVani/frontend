"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

type PlanetKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";

interface PlanetInfo {
  label: string;
  symbol: string;
  total: number;
  color: string;
  bav: number[]; // 12 elements for signs 1-12
}

const PLANETS: Record<PlanetKey, PlanetInfo> = {
  sun: {
    label: "Sun",
    symbol: "☉",
    total: 48,
    color: AMBER,
    bav: [4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 4],
  },
  moon: {
    label: "Moon",
    symbol: "☽",
    total: 49,
    color: SLATE_BLUE,
    bav: [4, 4, 4, 5, 4, 4, 4, 3, 5, 4, 4, 4],
  },
  mars: {
    label: "Mars",
    symbol: "♂",
    total: 39,
    color: "#e11d48",
    bav: [3, 3, 3, 4, 3, 3, 3, 3, 4, 3, 4, 3],
  },
  mercury: {
    label: "Mercury",
    symbol: "☿",
    total: 54,
    color: "#16a34a",
    bav: [5, 4, 4, 5, 4, 5, 4, 4, 5, 4, 5, 5],
  },
  jupiter: {
    label: "Jupiter",
    symbol: "♃",
    total: 56,
    color: "#d97706",
    bav: [5, 5, 4, 5, 4, 5, 5, 4, 5, 5, 4, 5],
  },
  venus: {
    label: "Venus",
    symbol: "♀",
    total: 52,
    color: PURPLE,
    bav: [4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 8],
  },
  saturn: {
    label: "Saturn",
    symbol: "♄",
    total: 39,
    color: "#475569",
    bav: [3, 3, 3, 4, 3, 3, 3, 3, 4, 3, 4, 3],
  },
};

const SAV_PROFILE = [28, 27, 24, 33, 26, 28, 27, 23, 33, 27, 29, 32]; // Sum = 337

export function AshtakavargaIntro() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetKey>("sun");
  const [selectedSignNum, setSelectedSignNum] = useState<number>(1);

  const activePlanet = PLANETS[selectedPlanet];
  const activeSign = RASHIS[selectedSignNum - 1];

  const handleReset = () => {
    setSelectedPlanet("sun");
    setSelectedSignNum(1);
  };

  const circlePoints = useMemo(() => {
    const points = [];
    const cx = 150, cy = 150, r = 100;
    for (let i = 0; i < 12; i++) {
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      points.push({ x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad), angleDeg, rashiNum: i + 1 });
    }
    return points;
  }, []);

  const renderWheel = (
    title: string,
    totalLabel: string,
    data: number[],
    highlightColor: string,
    isSAV: boolean
  ) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", flex: "1 1 260px" }}>
        <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>{title}</h4>
        <div style={{ position: "relative", width: "240px", height: "240px" }}>
          <svg width="240" height="240" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="2" />
            <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />
            
            {/* Sector Division Lines */}
            {RASHIS.map((_, i) => {
              const angleDeg = i * 30 - 105;
              const angleRad = (angleDeg * Math.PI) / 180;
              const lx = 150 + 130 * Math.cos(angleRad);
              const ly = 150 + 130 * Math.sin(angleRad);
              return <line key={`line-${i}`} x1="150" y1="150" x2={lx} y2={ly} stroke="rgba(156,122,47,0.08)" strokeWidth="1.2" />;
            })}

            {/* Clickable Paths */}
            {RASHIS.map((r, i) => {
              const num = r.number;
              const active = num === selectedSignNum;
              const fill = active ? `color-mix(in srgb, ${highlightColor} 12%, transparent)` : "transparent";
              const stroke = active ? highlightColor : "none";
              
              const startAngle = i * 30 - 105;
              const endAngle = i * 30 - 75;
              const so = { x: 150 + 130 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((startAngle * Math.PI) / 180) };
              const eo = { x: 150 + 130 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((endAngle * Math.PI) / 180) };
              const si = { x: 150 + 70 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 70 * Math.sin((startAngle * Math.PI) / 180) };
              const ei = { x: 150 + 70 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 70 * Math.sin((endAngle * Math.PI) / 180) };
              
              const pathData = [
                `M ${si.x} ${si.y}`,
                `L ${so.x} ${so.y}`,
                `A 130 130 0 0 1 ${eo.x} ${eo.y}`,
                `L ${ei.x} ${ei.y}`,
                `A 70 70 0 0 0 ${si.x} ${si.y}`,
                "Z"
              ].join(" ");

              return (
                <path
                  key={`path-${num}`}
                  d={pathData}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={active ? "2.5" : "1"}
                  style={{ cursor: "pointer", transition: "all 0.15s" }}
                  onClick={() => setSelectedSignNum(num)}
                />
              );
            })}

            {/* Labels and Bindus */}
            {circlePoints.map(p => {
              const r = RASHIS[p.rashiNum - 1];
              const angleDeg = p.angleDeg;
              const angleRad = (angleDeg * Math.PI) / 180;
              const ptEng = { x: 150 + 115 * Math.cos(angleRad), y: 150 + 115 * Math.sin(angleRad) };
              const ptBindu = { x: 150 + 85 * Math.cos(angleRad), y: 150 + 85 * Math.sin(angleRad) };
              const isCurrent = p.rashiNum === selectedSignNum;

              return (
                <g key={`label-${p.rashiNum}`}>
                  {/* English Name (outside) */}
                  <text
                    x={ptEng.x}
                    y={ptEng.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: "8px", fontWeight: 700, fill: INK_PRIMARY }}
                  >
                    {r.nameEnglish}
                  </text>
                  
                  {/* Bindu count badge */}
                  <g style={{ cursor: "pointer" }} onClick={() => setSelectedSignNum(p.rashiNum)}>
                    <circle
                      cx={ptBindu.x}
                      cy={ptBindu.y}
                      r={isCurrent ? "12" : "10"}
                      fill={isCurrent ? highlightColor : "rgba(156,122,47,0.06)"}
                      stroke={isCurrent ? "#ffffff" : "rgba(156,122,47,0.15)"}
                      strokeWidth="1"
                    />
                    <text
                      x={ptBindu.x}
                      y={ptBindu.y + 0.5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: isCurrent ? "9px" : "8px", fontWeight: 800, fill: isCurrent ? "#ffffff" : INK_SECONDARY }}
                    >
                      {data[p.rashiNum - 1]}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Central Circle */}
            <circle cx="150" cy="150" r="32" fill="#ffffff" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
            <text x="150" y="142" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>TOTAL</text>
            <text x="150" y="156" textAnchor="middle" style={{ fontSize: "11px", fontWeight: 900, fill: GOLD_DEEP }}>{totalLabel}</text>
            <text x="150" y="166" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>{isSAV ? "SAV" : "BAV"}</text>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            <IAST>Aṣṭakavarga</IAST> Visualizer: BAV vs SAV
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Explore how a planet&apos;s support (Bhinna Aṣṭakavarga) contributes to the total chart strength (Sarva Aṣṭakavarga).
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer", transition: "all 0.2s" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* PLANET SELECTOR BAR */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: 750, color: GOLD_DEEP, marginRight: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
          Select Planet BAV:
        </span>
        {(Object.keys(PLANETS) as PlanetKey[]).map(pk => {
          const p = PLANETS[pk];
          const active = selectedPlanet === pk;
          return (
            <button
              key={pk}
              onClick={() => setSelectedPlanet(pk)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 10px",
                borderRadius: "6px",
                border: active ? `1.5px solid ${p.color}` : "1px solid rgba(0,0,0,0.08)",
                background: active ? `${p.color}15` : "#ffffff",
                fontSize: "11px",
                fontWeight: active ? 700 : 500,
                color: active ? p.color : INK_SECONDARY,
                cursor: "pointer"
              }}
            >
              <span>{p.symbol}</span>
              <span>{p.label}</span>
              <span style={{ opacity: 0.6, fontSize: "9px" }}>({p.total})</span>
            </button>
          );
        })}
      </div>

      {/* TWO WHEELS SIDE-BY-SIDE */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        {renderWheel(
          `Sarva Aṣṭakavarga (SAV)`,
          "337",
          SAV_PROFILE,
          GOLD,
          true
        )}
        
        {renderWheel(
          `${activePlanet.label} Bhinna Aṣṭakavarga (BAV)`,
          activePlanet.total.toString(),
          activePlanet.bav,
          activePlanet.color,
          false
        )}
      </div>

      {/* DETAIL WORKBENCH */}
      <div style={{ background: "rgba(156,122,47,0.04)", border: `1px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <h4 style={{ margin: 0, fontSize: "12px", fontWeight: 750, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
          <Info size={14} /> Interactive Comparison: {activeSign.nameEnglish} ({activeSign.nameDevanagari})
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginTop: "4px" }}>
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.08)" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: activePlanet.color }}>
              {activePlanet.label} BAV Support
            </span>
            <div style={{ fontSize: "20px", fontWeight: 900, color: activePlanet.color, margin: "2px 0" }}>
              {activePlanet.bav[selectedSignNum - 1]} <span style={{ fontSize: "11px", fontWeight: 500, color: INK_MUTED }}>bindus</span>
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4 }}>
              The Sun, Moon, and other planets contribute a total of <strong>{activePlanet.bav[selectedSignNum - 1]}</strong> bindus to {activeSign.nameEnglish} specifically supporting {activePlanet.label}&apos;s transits and actions here.
            </p>
          </div>
          
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.08)" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: GOLD }}>
              Chart SAV Support
            </span>
            <div style={{ fontSize: "20px", fontWeight: 900, color: GOLD, margin: "2px 0" }}>
              {SAV_PROFILE[selectedSignNum - 1]} <span style={{ fontSize: "11px", fontWeight: 500, color: INK_MUTED }}>bindus</span>
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4 }}>
              Across the whole chart, {activeSign.nameEnglish} accumulates <strong>{SAV_PROFILE[selectedSignNum - 1]}</strong> total bindus. An SAV count &gt; 28 is strong; &lt; 25 indicates lower resources.
            </p>
          </div>
        </div>
        <p style={{ margin: "4px 0 0 0", fontSize: "10.5px", color: INK_MUTED, fontStyle: "italic", lineHeight: 1.4 }}>
          <strong>Pedagogical insight:</strong> Compare how a planet can be locally weak (e.g. Venus with only 2 bindus in Taurus BAV) while the sign itself is strong overall (e.g. SAV = 32). This shows that transit effects depend on both layers!
        </p>
      </div>

      {/* FOOTER */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", borderRadius: "8px", padding: "10px", fontSize: "9.5px", color: INK_MUTED, lineHeight: 1.4 }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). Bhinna Aṣṭakavarga (BAV) defines planetary support patterns. Sarva Aṣṭakavarga (SAV) totals the BAV scores of the 7 active physical planets, averaging exactly 337 bindus.
      </div>
    </div>
  );
}
