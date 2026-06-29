"use client";

import { useState } from "react";
import { Scale, HeartHandshake, ShieldAlert, Check, Radar, Eye } from "lucide-react";

interface StreamComparison {
  name: string;
  zodiac: string;
  dasha: string;
  chartBase: string;
  focus: string;
  features: string;
  complementarity: string;
  overClaim: string;
  refutation: string;
  // Radar values (1 to 5 scale)
  annualTiming: number;
  lifeTrajectory: number;
  aspectPrecision: number;
  algebraicComplexity: number;
  color: string;
}

const STREAMS: StreamComparison[] = [
  {
    name: "Parāśari",
    zodiac: "Sidereal (Lāhiri / Raman)",
    dasha: "Vimśottarī primary + specialised cycles",
    chartBase: "Natal rāśi + divisional vargas (D1–D60)",
    focus: "Lifetime trajectory, general timing, overall strength",
    features: "Shadbala, classical planetary yogas, sign aspects",
    complementarity: "Acts as the foundation. Tājika Varṣaphala is layered on top to refine the year-specific timing predicted by the natal Vimśottarī dasha.",
    overClaim: "Parāśari is the only true, pure Vedic system; Tājika is a foreign Arabic import and should not be practiced by Vedic astrologers.",
    refutation: "Cross-cultural absorption is a core feature of Indian traditions. Tājika uses the sidereal zodiac, integrates with Parāśarī house definitions, and has a multi-century Sanskrit canon.",
    annualTiming: 2,
    lifeTrajectory: 5,
    aspectPrecision: 2,
    algebraicComplexity: 3,
    color: "#D97706" // Amber Gold
  },
  {
    name: "Jaimini",
    zodiac: "Sidereal",
    dasha: "Rāśi-based dashas (Chara-daśā, etc.)",
    chartBase: "Natal rāśi + Karaka-overlay lens",
    focus: "Soul path (Dharma), career direction, specific windows",
    features: "Atmakāraka, Arūḍha Padas, Chara-dṛṣṭi (sign aspects)",
    complementarity: "Jaimini chara-karakas (like the Amatyakaraka for career) can be mapped onto the Tājika Varṣaphala chart to cross-verify yearly vocational peaks.",
    overClaim: "Jaimini is a completely separate science from Parāśari, rendering Parāśarī rules invalid when Jaimini is applied.",
    refutation: "The curriculum teaches Jaimini and Parāśari as parallel, overlapping streams that cross-validate each other rather than contradictory rivals.",
    annualTiming: 1,
    lifeTrajectory: 5,
    aspectPrecision: 2,
    algebraicComplexity: 4,
    color: "#E11D48" // Rose
  },
  {
    name: "KP Stream",
    zodiac: "Sidereal (precision Krishnamurti Ayanamsha)",
    dasha: "Modified Vimśottarī via Star/Sub-lord",
    chartBase: "Placidus houses (cusp divisions)",
    focus: "Pinpoint timing, binary YES/NO event validation",
    features: "1-249 sub-lord divisions, significator chains, ruling planets",
    complementarity: "KP's sub-lord divisions can be computed on the Tājika solar return positions to give micro-timing precision for yearly events.",
    overClaim: "KP's Placidus house system renders all traditional whole-sign calculations completely obsolete and false.",
    refutation: "KP is built on top of the Parāśarī planetary rules; whole-sign and Placidus are different focal depths, not absolute truths.",
    annualTiming: 2,
    lifeTrajectory: 4,
    aspectPrecision: 5,
    algebraicComplexity: 4,
    color: "#2563EB" // Blue
  },
  {
    name: "Lal Kitab",
    zodiac: "Sidereal (but fixed Aries Lagna in Teva)",
    dasha: "Fixed 35-year cycle + annual return loop",
    chartBase: "Fixed-Lagna Teva chart",
    focus: "Remedial mapping, household karmic patterns",
    features: "Sleeping planets, blind houses, planetary clusters",
    complementarity: "Operates as a distinct diagnostic remedial stream. Minimal direct technical integration, but co-exists within the practitioner's toolkit.",
    overClaim: "Lal Kitab remedies are absolute magic spells that erase karma without moral or spiritual self-discipline.",
    refutation: "Lal Kitab remedies represent defensive discipline, acting as mitigation rather than a magical erasure of prārabdha karma.",
    annualTiming: 3,
    lifeTrajectory: 3,
    aspectPrecision: 1,
    algebraicComplexity: 3,
    color: "#7C3AED" // Violet
  },
  {
    name: "Nāḍī",
    zodiac: "Sidereal",
    dasha: "Transit-based cycles + age-period mapping",
    chartBase: "Palm-leaf texts (planet-to-planet layouts)",
    focus: "Detailed chapter-by-chapter life records, past lives",
    features: "Nadi amsa increments, planetary alignments, past-life indicators",
    complementarity: "Nāḍī readings provide macro-karmic blueprints; Tājika solar returns compute the annual activation periods of those transits.",
    overClaim: "Nāḍī leaves are always 100% historically literal, and copyists never introduced recensional formatting modifications.",
    refutation: "Honest holding separates the legitimate palm-leaf legacy from copyist updates and recensional additions made over the centuries.",
    annualTiming: 1,
    lifeTrajectory: 5,
    aspectPrecision: 2,
    algebraicComplexity: 3,
    color: "#0D9488" // Teal
  },
  {
    name: "Tājika",
    zodiac: "Sidereal (traditional or custom ayanāṁśas)",
    dasha: "Muddā-daśā (annual Vimśottarī) + Patyāyinī",
    chartBase: "Annual solar return chart (Varṣaphala)",
    focus: "Year-specific predictions, solar return timing, horary",
    features: "50 Sahams (topic lots), progressed Munthā, 16 yogas, Praśna",
    complementarity: "Layers over Parāśari. Provides solar-return annual detail that refines and specifies the broad life-cycle dashas of the natal chart.",
    overClaim: "Tājika Varṣaphala is a standalone system that operates completely independently from the natal Parāśari chart.",
    refutation: "A solar return has zero root without the natal chart. The natal chart establishes the absolute boundaries of what is possible in the lifetime.",
    annualTiming: 5,
    lifeTrajectory: 1,
    aspectPrecision: 4,
    algebraicComplexity: 5,
    color: "#9C7A2F" // Mughal Gold
  }
];

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const LIGHT_BG = "#FCFAF2";

export function TajikaComparativeMatrix() {
  const [activeStreamIdx, setActiveStreamIdx] = useState(5); // Default to Tājika
  const [activeMode, setActiveMode] = useState<"standard" | "complementarity" | "overclaims">("standard");

  const activeStream = STREAMS[activeStreamIdx];

  // Helper to map radar levels to SVG coordinates
  // Center is (150, 150), Max radius is 90
  const getRadarPoint = (val: number, direction: "UP" | "RIGHT" | "DOWN" | "LEFT") => {
    const center = 150;
    const step = 18; // 90 / 5 levels
    const radius = val * step;
    
    if (direction === "UP") return `${center},${center - radius}`;
    if (direction === "RIGHT") return `${center + radius},${center}`;
    if (direction === "DOWN") return `${center},${center + radius}`;
    return `${center - radius},${center}`; // LEFT
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "14px",
        background: "rgba(255, 253, 246, 0.85)",
        border: "1px solid rgba(156, 122, 47, 0.2)",
        boxShadow: "0 10px 40px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
      data-interactive="tajika-comparative-matrix"
    >
      {/* Header section */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 1 — Lesson 4
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: INK_PRIMARY, margin: "6px 0 0", fontFamily: "var(--font-cormorant), serif" }}>
          Tājika Structural Comparative Matrix
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0", lineHeight: "1.4" }}>
          Synthesize Tājika's place in the wider Vedic-astrology universe by analyzing comparative technical signatures.
        </p>
      </div>

      {/* Mode Selectors */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "8px",
          padding: "10px",
          flexWrap: "wrap"
        }}
      >
        <button
          onClick={() => setActiveMode("standard")}
          style={{
            backgroundColor: activeMode === "standard" ? GOLD : "transparent",
            color: activeMode === "standard" ? "#ffffff" : GOLD,
            border: `1px solid ${GOLD}`,
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "11.5px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 150ms ease"
          }}
        >
          <Scale size={14} /> Full Grid Matrix
        </button>

        <button
          onClick={() => setActiveMode("complementarity")}
          style={{
            backgroundColor: activeMode === "complementarity" ? GOLD : "transparent",
            color: activeMode === "complementarity" ? "#ffffff" : GOLD,
            border: `1px solid ${GOLD}`,
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "11.5px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 150ms ease"
          }}
        >
          <HeartHandshake size={14} /> Complementarity Flow
        </button>

        <button
          onClick={() => setActiveMode("overclaims")}
          style={{
            backgroundColor: activeMode === "overclaims" ? GOLD : "transparent",
            color: activeMode === "overclaims" ? "#ffffff" : GOLD,
            border: `1px solid ${GOLD}`,
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "11.5px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 150ms ease"
          }}
        >
          <ShieldAlert size={14} /> Refuse Over-claims
        </button>
      </div>

      {/* Interactive Radar SVG & Stream Info */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: "20px",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "10px",
          padding: "20px",
          alignItems: "center"
        }}
      >
        {/* Left Side: Radar Plot */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
            Quad-Stream Signature Plot
          </span>
          <svg 
            viewBox="0 0 300 300" 
            style={{ 
              width: "100%", 
              maxWidth: "250px", 
              height: "auto", 
              backgroundColor: LIGHT_BG, 
              borderRadius: "50%",
              border: "1px solid rgba(156, 122, 47, 0.08)"
            }}
          >
            {/* Concentric grid lines levels 1 to 5 */}
            {[1, 2, 3, 4, 5].map((lvl) => {
              const radius = lvl * 18;
              return (
                <polygon
                  key={lvl}
                  points={`150,${150 - radius} ${150 + radius},150 150,${150 + radius} ${150 - radius},150`}
                  fill="none"
                  stroke="rgba(156, 122, 47, 0.08)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Radar Grid Axes */}
            <line x1="150" y1="60" x2="150" y2="240" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1" />
            <line x1="60" y1="150" x2="240" y2="150" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1" />

            {/* Axis Label Text */}
            <text x="150" y="44" fontSize="9.5" fontWeight="800" fill={GOLD_DEEP} textAnchor="middle">ANNUAL TIMING FOCUS</text>
            <text x="246" y="153" fontSize="9.5" fontWeight="800" fill={GOLD_DEEP} textAnchor="start">NATAL LIFE</text>
            <text x="150" y="264" fontSize="9.5" fontWeight="800" fill={GOLD_DEEP} textAnchor="middle">ASPECT PRECISION</text>
            <text x="54" y="153" fontSize="9.5" fontWeight="800" fill={GOLD_DEEP} textAnchor="end">ALGEBRAIC COMP.</text>

            {/* Inactive Streams (Dotted shapes in background) */}
            {STREAMS.map((s, idx) => {
              if (idx === activeStreamIdx) return null;
              return (
                <polygon
                  key={s.name}
                  points={`${getRadarPoint(s.annualTiming, "UP")} ${getRadarPoint(s.lifeTrajectory, "RIGHT")} ${getRadarPoint(s.aspectPrecision, "DOWN")} ${getRadarPoint(s.algebraicComplexity, "LEFT")}`}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="1"
                  strokeDasharray="2,3"
                  opacity="0.3"
                />
              );
            })}

            {/* Active Radar Shape (Filled) */}
            <polygon
              points={`${getRadarPoint(activeStream.annualTiming, "UP")} ${getRadarPoint(activeStream.lifeTrajectory, "RIGHT")} ${getRadarPoint(activeStream.aspectPrecision, "DOWN")} ${getRadarPoint(activeStream.algebraicComplexity, "LEFT")}`}
              fill={activeStream.color}
              fillOpacity="0.25"
              stroke={activeStream.color}
              strokeWidth="3.5"
              style={{ transition: "all 300ms ease" }}
            />

            {/* Dot Highlights on Active vertices */}
            <circle cx="150" cy={150 - activeStream.annualTiming * 18} r="5" fill={activeStream.color} />
            <circle cx={150 + activeStream.lifeTrajectory * 18} cy="150" r="5" fill={activeStream.color} />
            <circle cx="150" cy={150 + activeStream.aspectPrecision * 18} r="5" fill={activeStream.color} />
            <circle cx={150 - activeStream.algebraicComplexity * 18} cy="150" r="5" fill={activeStream.color} />
          </svg>
        </div>

        {/* Right Side: Quick info overlay */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: activeStream.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Selected Signature Profile
          </span>
          <h4 style={{ fontSize: "20px", fontWeight: 800, color: INK_PRIMARY, margin: 0, fontFamily: "var(--font-cormorant), serif" }}>
            {activeStream.name} Methodology
          </h4>
          <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, margin: 0 }}>
            {activeStream.focus}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "4px" }}>
            <div style={{ backgroundColor: LIGHT_BG, padding: "8px", borderRadius: "4px", border: "1px solid rgba(156, 122, 47, 0.05)" }}>
              <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Annual Focus</span>
              <strong style={{ fontSize: "14px", color: activeStream.color }}>{activeStream.annualTiming} / 5</strong>
            </div>
            <div style={{ backgroundColor: LIGHT_BG, padding: "8px", borderRadius: "4px", border: "1px solid rgba(156, 122, 47, 0.05)" }}>
              <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Life Trajectory</span>
              <strong style={{ fontSize: "14px", color: activeStream.color }}>{activeStream.lifeTrajectory} / 5</strong>
            </div>
            <div style={{ backgroundColor: LIGHT_BG, padding: "8px", borderRadius: "4px", border: "1px solid rgba(156, 122, 47, 0.05)" }}>
              <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Aspect Precision</span>
              <strong style={{ fontSize: "14px", color: activeStream.color }}>{activeStream.aspectPrecision} / 5</strong>
            </div>
            <div style={{ backgroundColor: LIGHT_BG, padding: "8px", borderRadius: "4px", border: "1px solid rgba(156, 122, 47, 0.05)" }}>
              <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Algebraic Complexity</span>
              <strong style={{ fontSize: "14px", color: activeStream.color }}>{activeStream.algebraicComplexity} / 5</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Tabs selection */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Compare Astrology Systems:
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {STREAMS.map((s, idx) => {
            const isActive = idx === activeStreamIdx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStreamIdx(idx)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  backgroundColor: isActive ? s.color : "#ffffff",
                  border: `1.5px solid ${isActive ? s.color : "rgba(156, 122, 47, 0.15)"}`,
                  color: isActive ? "#ffffff" : INK_SECONDARY,
                  cursor: "pointer",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  transition: "all 150ms ease"
                }}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Matrix Table or details based on mode */}
      <div 
        style={{ 
          overflowX: "auto", 
          backgroundColor: "#ffffff", 
          border: "1px solid rgba(156, 122, 47, 0.15)", 
          borderRadius: "8px"
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: "rgba(156, 122, 47, 0.04)", borderBottom: "1.5px solid rgba(156, 122, 47, 0.2)" }}>
              <th style={{ padding: "12px", textAlign: "left", color: GOLD_DEEP, fontWeight: 700 }}>Stream</th>
              <th style={{ padding: "12px", textAlign: "left", color: GOLD_DEEP, fontWeight: 700 }}>Zodiac Reference</th>
              <th style={{ padding: "12px", textAlign: "left", color: GOLD_DEEP, fontWeight: 700 }}>Dasha Engine</th>
              <th style={{ padding: "12px", textAlign: "left", color: GOLD_DEEP, fontWeight: 700 }}>Base Chart Map</th>
            </tr>
          </thead>
          <tbody>
            {STREAMS.map((s, idx) => {
              const isActive = idx === activeStreamIdx;
              return (
                <tr 
                  key={idx} 
                  onClick={() => setActiveStreamIdx(idx)}
                  style={{ 
                    borderBottom: "1px solid rgba(156, 122, 47, 0.08)",
                    cursor: "pointer",
                    backgroundColor: isActive ? "rgba(156, 122, 47, 0.04)" : "transparent",
                    transition: "background 150ms ease"
                  }}
                >
                  <td style={{ padding: "12px", fontWeight: 700, color: s.color }}>{s.name}</td>
                  <td style={{ padding: "12px", color: INK_SECONDARY }}>{s.zodiac}</td>
                  <td style={{ padding: "12px", color: INK_SECONDARY }}>{s.dasha}</td>
                  <td style={{ padding: "12px", color: INK_SECONDARY }}>{s.chartBase}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Stream detail board */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(156, 122, 47, 0.02)"
        }}
      >
        {activeMode === "standard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: RED }}>
                Focal Stream Analysis
              </span>
              <h4 style={{ fontSize: "18px", fontWeight: 800, color: INK_PRIMARY, marginTop: "2px", marginBottom: "8px", fontFamily: "var(--font-cormorant), serif" }}>
                {activeStream.name} Technical Signature
              </h4>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <strong style={{ color: GOLD_DEEP, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Zodiac Framework</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "13.5px", color: INK_SECONDARY }}>{activeStream.zodiac}</p>
                </div>
                <div>
                  <strong style={{ color: GOLD_DEEP, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Dasha Mechanics</strong>
                  <p style={{ margin: "2px 0 0", fontSize: "13.5px", color: INK_SECONDARY }}>{activeStream.dasha}</p>
                </div>
              </div>
              <div>
                <strong style={{ color: GOLD_DEEP, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Signature Features</strong>
                <p style={{ margin: "2px 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>{activeStream.features}</p>
              </div>
            </div>
          </div>
        )}

        {activeMode === "complementarity" && (
          <div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px" }}>
              <HeartHandshake size={15} color={GREEN} />
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: GREEN }}>
                Practitioner Complementarity Flow
              </span>
            </div>
            <h4 style={{ fontSize: "18px", fontWeight: 800, color: INK_PRIMARY, margin: "0 0 8px", fontFamily: "var(--font-cormorant), serif" }}>
              Integrating {activeStream.name} Alongside Tājika
            </h4>
            <p style={{ fontSize: "13.5px", lineHeight: "1.6", color: INK_SECONDARY, margin: "0 0 14px" }}>
              {activeStream.complementarity}
            </p>
            <div style={{ backgroundColor: "rgba(47, 125, 85, 0.04)", border: "1px solid rgba(47, 125, 85, 0.15)", borderRadius: "6px", padding: "12px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, textTransform: "uppercase", color: GREEN, display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                <Check size={14} /> Astrological Calibration Tip
              </span>
              <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: 0, lineHeight: "1.4" }}>
                Always overlay short-term yearly methods (like Tājika Sahams and Yogas) on top of the natal Parāśarī dasha indicators to check if the birth promise is activated in the annual loop.
              </p>
            </div>
          </div>
        )}

        {activeMode === "overclaims" && (
          <div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px" }}>
              <ShieldAlert size={15} color={RED} />
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: RED }}>
                Refusing Partisan Over-claims
              </span>
            </div>
            <h4 style={{ fontSize: "18px", fontWeight: 800, color: INK_PRIMARY, margin: "0 0 8px", fontFamily: "var(--font-cormorant), serif" }}>
              Calibrating {activeStream.name} Claims
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <div style={{ borderLeft: `3px solid ${RED}`, paddingLeft: "12px", backgroundColor: "rgba(162, 58, 30, 0.03)", padding: "12px", borderRadius: "0 6px 6px 0" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: RED }}>
                  The Over-claim Bias
                </span>
                <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, margin: "4px 0 0", fontStyle: "italic" }}>
                  "{activeStream.overClaim}"
                </p>
              </div>
              <div style={{ borderLeft: `3px solid ${GREEN}`, paddingLeft: "12px", backgroundColor: "rgba(47, 125, 85, 0.03)", padding: "12px", borderRadius: "0 6px 6px 0" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: GREEN }}>
                  The Refutation Discipline
                </span>
                <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, margin: "4px 0 0" }}>
                  {activeStream.refutation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
