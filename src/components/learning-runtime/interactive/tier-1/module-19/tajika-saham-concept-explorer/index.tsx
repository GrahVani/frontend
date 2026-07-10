"use client";

import { useState } from "react";
import { Info, ArrowRight, Layers, Sun, Moon, Compass, RefreshCw, AlertTriangle } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";
const LIGHT_BG = "#FCFAF2";

interface EtymologyNode {
  culture: string;
  term: string;
  literalMeaning: string;
  translationFlow: string;
  description: string;
  disciplinaryNote: string;
}

const ETYMOLOGY_NODES: EtymologyNode[] = [
  {
    culture: "Hellenistic Greece",
    term: "Klēros (κλῆρος)",
    literalMeaning: "Lot, portion, or share chosen by casting lots",
    translationFlow: "Greek roots (1st C. BCE - 2nd C. CE)",
    description: "Calculated algebraic points computed from planetary distances mapped onto the ascendant. Represented non-causal ambient lots of fortune, spirit, and necessity.",
    disciplinaryNote: "This Hellenistic root demonstrates that the lot concept is not an indigenous Vedic mathematical apparatus, but rather a cross-cultural astronomy construct."
  },
  {
    culture: "Medieval Arabic/Persian",
    term: "Sahm (سهم) / Sihām (pl.)",
    literalMeaning: "Arrow, lot, portion, or division",
    translationFlow: "Arabic Systematization (8th - 12th C. CE)",
    description: "Islamic astrologers consolidated the Hellenistic Lots into a vast catalogue of 'Arabic Parts'. Preserved day-night reversal and planetary significator formulas.",
    disciplinaryNote: "Scholars like Albumasar refined the math. The term 'saham' is the direct etymological ancestor of the Sanskrit word."
  },
  {
    culture: "Vedic Tājika India",
    term: "Saham (सहम)",
    literalMeaning: "Sanskritized phonetic loanword from Arabic Sahm",
    translationFlow: "Sanskrit Reception (13th - 16th C. CE)",
    description: "North Indian scholars mapped Arabic Lots into Sanskrit ślokas, adopting 'Saham' as a core Tājika signature feature. They placed these points directly onto the sidereal zodiac.",
    disciplinaryNote: "Preserves the complete mathematical structure and etymological loanword while proving Tājika's functional integration under classical Jyotiṣa."
  }
];

const RASHI_NAMES = [
  "Meṣa (Aries)", "Vṛṣabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
  "Siṁha (Leo)", "Kanyā (Virgo)", "Tulā (Libra)", "Vṛścika (Scorpio)",
  "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Mīna (Pisces)"
];

export function TajikaSahamConceptExplorer() {
  const [activeNode, setActiveNode] = useState(0);
  const [isDayBirth, setIsDayBirth] = useState(true);
  const [lagnaDeg, setLagnaDeg] = useState(15);
  const [sunDeg, setSunDeg] = useState(45);
  const [moonDeg, setMoonDeg] = useState(210);

  // Math helper
  const diff = isDayBirth ? (moonDeg - sunDeg) : (sunDeg - moonDeg);
  let rawSum = diff + lagnaDeg;
  let finalDeg = rawSum % 360;
  if (finalDeg < 0) finalDeg += 360;

  const rashiIndex = Math.floor(finalDeg / 30);
  const relativeDeg = Math.round((finalDeg % 30) * 10) / 10;

  // SVG Helper to calculate planetary coords
  const getCoordinates = (deg: number, radius: number) => {
    // 0 deg is at the right (East point)
    const angleRad = (deg * Math.PI) / 180;
    const cx = 150;
    const cy = 150;
    return {
      x: cx + radius * Math.cos(angleRad),
      y: cy - radius * Math.sin(angleRad)
    };
  };

  const getArcPath = (start: number, end: number, radius: number) => {
    const points = [];
    let s = start % 360;
    if (s < 0) s += 360;
    let e = end % 360;
    if (e < 0) e += 360;

    let diffVal = e - s;
    if (diffVal > 180) {
      e -= 360;
    } else if (diffVal < -180) {
      e += 360;
    }

    const steps = Math.max(2, Math.ceil(Math.abs(e - s) / 2));
    for (let i = 0; i <= steps; i++) {
      const angle = s + (e - s) * (i / steps);
      const coords = getCoordinates(angle, radius);
      points.push(`${coords.x},${coords.y}`);
    }
    return `M ${points.join(" L ")}`;
  };

  // Radially separate to prevent overlaps
  const lagnaCoords = getCoordinates(lagnaDeg, 80);
  const sunCoords = getCoordinates(sunDeg, 94);
  const moonCoords = getCoordinates(moonDeg, 108);
  const sahamCoords = getCoordinates(finalDeg, 122);

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
      data-interactive="tajika-saham-concept-explorer"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 3 — Lesson 1
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: INK_PRIMARY, margin: "6px 0 0", fontFamily: "var(--font-cormorant), serif" }}>
          Saham Concept & Day-Night Reversal Explorer
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0", lineHeight: "1.4" }}>
          Explore the etymological lineage of Tājika sensitive-points (Sahams) and simulate the diurnal component swap on a radial coordinate wheel.
        </p>
      </div>

      {/* Part 1: Cross-Cultural Transmission Map */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "8px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Compass size={18} color={GOLD} />
          <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "14.5px" }}>Cross-Cultural Transmission Chain</span>
        </div>

        {/* Node selector buttons */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "space-between" }}>
          {ETYMOLOGY_NODES.map((node, idx) => {
            const isActive = idx === activeNode;
            return (
              <button
                key={idx}
                onClick={() => setActiveNode(idx)}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  padding: "14px",
                  borderRadius: "8px",
                  background: isActive ? "rgba(156, 122, 47, 0.06)" : "#ffffff",
                  border: `1.5px solid ${isActive ? GOLD : "rgba(156, 122, 47, 0.15)"}`,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "4px",
                  textAlign: "left",
                  transition: "all 200ms ease"
                }}
              >
                <span style={{ fontSize: "9.5px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {node.translationFlow}
                </span>
                <strong style={{ fontSize: "15px", color: isActive ? GOLD_DEEP : INK_PRIMARY }}>
                  {node.culture}
                </strong>
                <span style={{ fontSize: "12.5px", color: isActive ? RED : INK_MUTED, fontFamily: "monospace" }}>
                  {node.term}
                </span>
              </button>
            );
          })}
        </div>

        {/* Node detail display */}
        <div
          style={{
            background: LIGHT_BG,
            border: "1px dashed rgba(156, 122, 47, 0.25)",
            borderRadius: "6px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
            <span style={{ fontSize: "12.5px", fontWeight: 700, color: GOLD_DEEP }}>
              Etymology & Literal Meaning:
            </span>
            <span style={{ fontSize: "13.5px", color: INK_PRIMARY, fontStyle: "italic", fontWeight: 700 }}>
              "{ETYMOLOGY_NODES[activeNode].literalMeaning}"
            </span>
          </div>
          <p style={{ fontSize: "13.5px", lineHeight: "1.55", color: INK_SECONDARY, margin: 0 }}>
            {ETYMOLOGY_NODES[activeNode].description}
          </p>
          <div style={{ borderTop: "1px solid rgba(156, 122, 47, 0.15)", paddingTop: "8px", marginTop: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: RED, textTransform: "uppercase", display: "block" }}>
              Two-Layer Holding Discipline:
            </span>
            <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: "4px 0 0", lineHeight: "1.4" }}>
              {ETYMOLOGY_NODES[activeNode].disciplinaryNote}
            </p>
          </div>
        </div>
      </div>

      {/* Part 2: Day-Night Reversal Simulator & SVG Zodiac Wheel */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "8px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <RefreshCw size={18} color={GOLD} />
            <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "14.5px" }}>Day-Night Reversal Simulator</span>
          </div>
          {/* Day/Night toggle */}
          <div style={{ display: "flex", background: "rgba(156, 122, 47, 0.08)", padding: "3px", borderRadius: "6px" }}>
            <button
              onClick={() => setIsDayBirth(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "12px",
                background: isDayBirth ? "#ffffff" : "transparent",
                color: isDayBirth ? GOLD_DEEP : INK_SECONDARY,
                boxShadow: isDayBirth ? "0 2px 6px rgba(156, 122, 47, 0.12)" : "none",
                transition: "all 150ms ease"
              }}
            >
              <Sun size={14} color={isDayBirth ? AMBER : INK_MUTED} />
              Day Birth
            </button>
            <button
              onClick={() => setIsDayBirth(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "12px",
                background: !isDayBirth ? "#ffffff" : "transparent",
                color: !isDayBirth ? GOLD_DEEP : INK_SECONDARY,
                boxShadow: !isDayBirth ? "0 2px 6px rgba(156, 122, 47, 0.12)" : "none",
                transition: "all 150ms ease"
              }}
            >
              <Moon size={14} color={!isDayBirth ? GOLD_DEEP : INK_MUTED} />
              Night Birth
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "20px", alignItems: "center" }}>
          {/* Controls Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: INK_SECONDARY }}>Lagna (Ascendant) Coordinate:</span>
                <strong style={{ fontSize: "13px", color: GOLD_DEEP }}>{lagnaDeg}°</strong>
              </div>
              <input
                type="range"
                min="0"
                max="359"
                value={lagnaDeg}
                onChange={(e) => setLagnaDeg(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: GOLD }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: isDayBirth ? RED : GREEN }}>
                  Sun Longitude (Day: Slower / Night: Faster):
                </span>
                <strong style={{ fontSize: "13px", color: isDayBirth ? RED : GREEN }}>{sunDeg}°</strong>
              </div>
              <input
                type="range"
                min="0"
                max="359"
                value={sunDeg}
                onChange={(e) => setSunDeg(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: isDayBirth ? RED : GREEN }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: isDayBirth ? GREEN : RED }}>
                  Moon Longitude (Day: Faster / Night: Slower):
                </span>
                <strong style={{ fontSize: "13px", color: isDayBirth ? GREEN : RED }}>{moonDeg}°</strong>
              </div>
              <input
                type="range"
                min="0"
                max="359"
                value={moonDeg}
                onChange={(e) => setMoonDeg(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: isDayBirth ? GREEN : RED }}
              />
            </div>

            {/* Arithmetic display */}
            <div
              style={{
                background: "rgba(156, 122, 47, 0.03)",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid rgba(156, 122, 47, 0.12)",
                fontSize: "13px",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}
            >
              <div>
                <strong>Calculated Formula:</strong>{" "}
                <code style={{ fontFamily: "monospace", color: GOLD_DEEP, fontSize: "12px", fontWeight: "bold" }}>
                  {isDayBirth
                    ? `(Moon − Sun) + Lagna`
                    : `(Sun − Moon) + Lagna`}
                </code>
              </div>
              <div style={{ borderTop: "1px dashed rgba(156, 122, 47, 0.15)", paddingTop: "6px" }}>
                <strong>Zodiac Output:</strong>{" "}
                <span style={{ color: GREEN, fontWeight: 800 }}>
                  {RASHI_NAMES[rashiIndex]} at {relativeDeg}°
                </span>
              </div>
            </div>
          </div>

          {/* SVG Zodiac Wheel Drawing with screen reader support and radial spacing */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: LIGHT_BG, border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "10px", padding: "14px" }}>
            <svg 
              width="100%" 
              viewBox="0 0 300 300" 
              style={{ transform: "rotate(-90deg)", maxWidth: "240px" }}
              aria-label="Interactive radial zodiac coordinate chart displaying day-night Saham calculation"
            >
              <desc>
                {`Zodiac wheel showing Lagna at ${lagnaDeg} degrees, Sun at ${sunDeg} degrees, Moon at ${moonDeg} degrees. The calculated Saham result is at ${finalDeg} degrees, situated in ${RASHI_NAMES[rashiIndex]}.`}
              </desc>
              {/* Outer Zodiac Circle */}
              <circle cx="150" cy="150" r="122" fill="none" stroke="rgba(156, 122, 47, 0.25)" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="66" fill="none" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1" />
              <circle cx="150" cy="150" r="5" fill={GOLD_DEEP} />

              {/* Rashi Sector Dividers (every 30 degrees) */}
              {Array.from({ length: 12 }).map((_, idx) => {
                const angle = idx * 30;
                const inner = getCoordinates(angle, 66);
                const outer = getCoordinates(angle, 122);
                const textPos = getCoordinates(angle + 15, 136);
                return (
                  <g key={idx}>
                    <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1" />
                    {/* Rashi numerical labels */}
                    <text
                      x={textPos.x}
                      y={textPos.y}
                      fill={INK_MUTED}
                      fontSize="9"
                      fontWeight="800"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ transform: `rotate(90deg ${textPos.x}px ${textPos.y}px)` }}
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}

              {/* Measured distance arc (Sun to Moon) */}
              <path
                d={getArcPath(sunDeg, moonDeg, 95)}
                fill="none"
                stroke={isDayBirth ? GREEN : RED}
                strokeWidth="3"
                strokeDasharray="4 3"
                opacity="0.8"
              />

              {/* Projected distance arc (Lagna to Saham) */}
              <path
                d={getArcPath(lagnaDeg, finalDeg, 95)}
                fill="none"
                stroke={GOLD}
                strokeWidth="3"
                strokeDasharray="1 3"
              />

              {/* Lagna Marker (Radius 80) */}
              <circle cx={lagnaCoords.x} cy={lagnaCoords.y} r="8.5" fill={GOLD_DEEP} />
              <text x={lagnaCoords.x} y={lagnaCoords.y} fill="#ffffff" fontSize="9.5" fontWeight="900" textAnchor="middle" dominantBaseline="central" style={{ transform: `rotate(90deg ${lagnaCoords.x}px ${lagnaCoords.y}px)` }}>Lg</text>

              {/* Sun Marker (Radius 94) */}
              <circle cx={sunCoords.x} cy={sunCoords.y} r="8.5" fill={isDayBirth ? RED : GREEN} />
              <text x={sunCoords.x} y={sunCoords.y} fill="#ffffff" fontSize="9.5" fontWeight="900" textAnchor="middle" dominantBaseline="central" style={{ transform: `rotate(90deg ${sunCoords.x}px ${sunCoords.y}px)` }}>Su</text>

              {/* Moon Marker (Radius 108) */}
              <circle cx={moonCoords.x} cy={moonCoords.y} r="8.5" fill={isDayBirth ? GREEN : RED} />
              <text x={moonCoords.x} y={moonCoords.y} fill="#ffffff" fontSize="9.5" fontWeight="900" textAnchor="middle" dominantBaseline="central" style={{ transform: `rotate(90deg ${moonCoords.x}px ${moonCoords.y}px)` }}>Mo</text>

              {/* Saham Marker (Radius 122) */}
              <polygon
                points={`
                  ${sahamCoords.x},${sahamCoords.y - 11}
                  ${sahamCoords.x + 4},${sahamCoords.y - 4}
                  ${sahamCoords.x + 11},${sahamCoords.y}
                  ${sahamCoords.x + 4},${sahamCoords.y + 4}
                  ${sahamCoords.x},${sahamCoords.y + 11}
                  ${sahamCoords.x - 4},${sahamCoords.y + 4}
                  ${sahamCoords.x - 11},${sahamCoords.y}
                  ${sahamCoords.x - 4},${sahamCoords.y - 4}
                `}
                fill={GOLD}
                stroke="#ffffff"
                strokeWidth="1.2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Part 3: M19 Discipline Guardrail Warnings */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "8px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertTriangle size={18} color={GOLD_DEEP} />
          <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GOLD_DEEP }}>
            Saham Interpretation Guardrails
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ backgroundColor: "rgba(162, 58, 30, 0.02)", padding: "12px", borderRadius: "6px", border: "1px solid rgba(162, 58, 30, 0.08)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: RED, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
              Refuse Single-Factor Causal Claims
            </span>
            <p style={{ fontSize: "12.5px", lineHeight: "1.45", color: INK_SECONDARY, margin: 0 }}>
              Do not tell a client that a Saham *causes* an event. The Saham is a calculated indicator contributing opportunity-context, never a deterministic trigger.
            </p>
          </div>
          <div style={{ backgroundColor: "rgba(162, 58, 30, 0.02)", padding: "12px", borderRadius: "6px", border: "1px solid rgba(162, 58, 30, 0.08)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: RED, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
              Refuse Mystification Purity
            </span>
            <p style={{ fontSize: "12.5px", lineHeight: "1.45", color: INK_SECONDARY, margin: 0 }}>
              Do not claim Sahams are taught in classical Parāśara texts. Honestly acknowledge their Hellenistic Greek (*klēros*) and Arabic roots (*sahm*).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
