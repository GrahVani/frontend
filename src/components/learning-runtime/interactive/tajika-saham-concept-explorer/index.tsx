"use client";

import { useState } from "react";
import { Info, ArrowRight, Layers, Sun, Moon, Compass, RefreshCw, AlertTriangle } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

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
    // 0 deg in astrology standard is top or right. Let's make 0 deg at East (right)
    const angleRad = (deg * Math.PI) / 180;
    const cx = 150;
    const cy = 150;
    // Y coordinates are inverted in SVGs
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

    let diff = e - s;
    if (diff > 180) {
      e -= 360;
    } else if (diff < -180) {
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

  const lagnaCoords = getCoordinates(lagnaDeg, 95);
  const sunCoords = getCoordinates(sunDeg, 95);
  const moonCoords = getCoordinates(moonDeg, 95);
  const sahamCoords = getCoordinates(finalDeg, 95);

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
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
      data-interactive="tajika-saham-concept-explorer"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.12)", paddingBottom: "12px", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Module 19 — Chapter 3 — Lesson 1
        </span>
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0" }}>
          Saham Concept & Day-Night Reversal Explorer
        </h3>
        <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: "2px 0 0" }}>
          Explore the etymological lineage of Tājika sensitive-points and simulate the diurnal component swap.
        </p>
      </div>

      {/* Part 1: Cross-Cultural Transmission Map */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Compass size={18} color={GOLD} />
          <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "14px" }}>Cross-Cultural Transmission Chain</span>
        </div>

        {/* Node selector buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "space-between", position: "relative" }}>
          {ETYMOLOGY_NODES.map((node, idx) => {
            const isActive = idx === activeNode;
            return (
              <button
                key={idx}
                onClick={() => setActiveNode(idx)}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  padding: "12px",
                  borderRadius: "6px",
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
                <span style={{ fontSize: "10px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                  {node.translationFlow}
                </span>
                <strong style={{ fontSize: "14px", color: isActive ? GOLD_DEEP : INK_PRIMARY }}>
                  {node.culture}
                </strong>
                <span style={{ fontSize: "12px", color: isActive ? INK_SECONDARY : INK_MUTED, fontFamily: "monospace" }}>
                  {node.term}
                </span>
              </button>
            );
          })}
        </div>

        {/* Node detail display */}
        <div
          style={{
            background: "rgba(255, 253, 246, 0.5)",
            border: "1px dashed rgba(156, 122, 47, 0.2)",
            borderRadius: "6px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP }}>
              Etymology & Literal Meaning:
            </span>
            <span style={{ fontSize: "12.5px", color: INK_SECONDARY, fontStyle: "italic" }}>
              "{ETYMOLOGY_NODES[activeNode].literalMeaning}"
            </span>
          </div>
          <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, margin: 0 }}>
            {ETYMOLOGY_NODES[activeNode].description}
          </p>
          <div style={{ borderTop: "1px solid rgba(156, 122, 47, 0.1)", paddingTop: "6px", marginTop: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: RED, textTransform: "uppercase", display: "block" }}>
              Two-Layer Holding Discipline:
            </span>
            <p style={{ fontSize: "12px", color: INK_SECONDARY, margin: "2px 0 0" }}>
              {ETYMOLOGY_NODES[activeNode].disciplinaryNote}
            </p>
          </div>
        </div>
      </div>

      {/* Part 2: Day-Night Reversal Simulator & SVG Zodiac Wheel */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <RefreshCw size={18} color={GOLD} />
            <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "14px" }}>Day-Night Reversal Simulator & Circular Zodiac</span>
          </div>
          {/* Day/Night toggle */}
          <div style={{ display: "flex", background: "rgba(156, 122, 47, 0.08)", padding: "2px", borderRadius: "6px" }}>
            <button
              onClick={() => setIsDayBirth(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "12px",
                background: isDayBirth ? "#ffffff" : "transparent",
                color: isDayBirth ? GOLD_DEEP : INK_SECONDARY,
                boxShadow: isDayBirth ? "0 2px 6px rgba(156, 122, 47, 0.1)" : "none",
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
                gap: "4px",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "12px",
                background: !isDayBirth ? "#ffffff" : "transparent",
                color: !isDayBirth ? GOLD_DEEP : INK_SECONDARY,
                boxShadow: !isDayBirth ? "0 2px 6px rgba(156, 122, 47, 0.1)" : "none",
                transition: "all 150ms ease"
              }}
            >
              <Moon size={14} color={!isDayBirth ? GOLD_DEEP : INK_MUTED} />
              Night Birth
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
          {/* Controls Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: INK_SECONDARY }}>Lagna (Ascendant) Longitude:</span>
                <strong style={{ fontSize: "12px", color: GOLD_DEEP }}>{lagnaDeg}°</strong>
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
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: isDayBirth ? RED : GREEN }}>
                  Sun Longitude (Day: Slower / Night: Faster):
                </span>
                <strong style={{ fontSize: "12px", color: isDayBirth ? RED : GREEN }}>{sunDeg}°</strong>
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
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: isDayBirth ? GREEN : RED }}>
                  Moon Longitude (Day: Faster / Night: Slower):
                </span>
                <strong style={{ fontSize: "12px", color: isDayBirth ? GREEN : RED }}>{moonDeg}°</strong>
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
                background: "rgba(156, 122, 47, 0.02)",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid rgba(156, 122, 47, 0.08)",
                fontSize: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "4px"
              }}
            >
              <div>
                <strong>Math:</strong>{" "}
                <code style={{ fontFamily: "monospace", color: GOLD_DEEP, fontSize: "11.5px" }}>
                  {isDayBirth
                    ? `(${moonDeg}° − ${sunDeg}°) + ${lagnaDeg}°`
                    : `(${sunDeg}° − ${moonDeg}°) + ${lagnaDeg}°`}
                  {` = ${rawSum}° ➔ ${finalDeg}°`}
                </code>
              </div>
              <div>
                <strong>Zodiac:</strong>{" "}
                <span style={{ color: GREEN, fontWeight: 700 }}>
                  {RASHI_NAMES[rashiIndex]} at {relativeDeg}°
                </span>
              </div>
            </div>
          </div>

          {/* SVG Zodiac Wheel Drawing */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(156, 122, 47, 0.01)", border: "1px solid rgba(156, 122, 47, 0.06)", borderRadius: "8px", padding: "10px" }}>
            <svg width="240" height="240" viewBox="0 0 300 300" style={{ transform: "rotate(-90deg)" }}>
              {/* Outer Zodiac Circle */}
              <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(156, 122, 47, 0.25)" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="85" fill="none" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1" />
              <circle cx="150" cy="150" r="4" fill={GOLD_DEEP} />

              {/* Rashi Sector Dividers (every 30 degrees) */}
              {Array.from({ length: 12 }).map((_, idx) => {
                const angle = idx * 30;
                const inner = getCoordinates(angle, 85);
                const outer = getCoordinates(angle, 120);
                const textPos = getCoordinates(angle + 15, 135);
                return (
                  <g key={idx}>
                    <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1" />
                    {/* Rashi labels */}
                    <text
                      x={textPos.x}
                      y={textPos.y}
                      fill={INK_MUTED}
                      fontSize="8"
                      fontWeight="bold"
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
                strokeWidth="2.5"
                strokeDasharray="4 3"
                opacity="0.8"
              />

              {/* Projected distance arc (Lagna to Saham) */}
              <path
                d={getArcPath(lagnaDeg, finalDeg, 95)}
                fill="none"
                stroke={GOLD}
                strokeWidth="2.5"
                strokeDasharray="1 2"
              />

              {/* Lagna Marker */}
              <circle cx={lagnaCoords.x} cy={lagnaCoords.y} r="7" fill={GOLD_DEEP} />
              <text x={lagnaCoords.x} y={lagnaCoords.y} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" dominantBaseline="central" style={{ transform: `rotate(90deg ${lagnaCoords.x}px ${lagnaCoords.y}px)` }}>Lg</text>

              {/* Sun Marker */}
              <circle cx={sunCoords.x} cy={sunCoords.y} r="7" fill={isDayBirth ? RED : GREEN} />
              <text x={sunCoords.x} y={sunCoords.y} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" dominantBaseline="central" style={{ transform: `rotate(90deg ${sunCoords.x}px ${sunCoords.y}px)` }}>Su</text>

              {/* Moon Marker */}
              <circle cx={moonCoords.x} cy={moonCoords.y} r="7" fill={isDayBirth ? GREEN : RED} />
              <text x={moonCoords.x} y={moonCoords.y} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" dominantBaseline="central" style={{ transform: `rotate(90deg ${moonCoords.x}px ${moonCoords.y}px)` }}>Mo</text>

              {/* Saham Marker */}
              <polygon
                points={`
                  ${sahamCoords.x},${sahamCoords.y - 9}
                  ${sahamCoords.x + 3},${sahamCoords.y - 3}
                  ${sahamCoords.x + 9},${sahamCoords.y}
                  ${sahamCoords.x + 3},${sahamCoords.y + 3}
                  ${sahamCoords.x},${sahamCoords.y + 9}
                  ${sahamCoords.x - 3},${sahamCoords.y + 3}
                  ${sahamCoords.x - 9},${sahamCoords.y}
                  ${sahamCoords.x - 3},${sahamCoords.y - 3}
                `}
                fill={GOLD}
                stroke="#ffffff"
                strokeWidth="0.5"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Part 3: M19 Discipline Guardrail Warnings */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <AlertTriangle size={16} color={GOLD} />
          <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GOLD_DEEP }}>
            Saham Interpretation Guardrails
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{ backgroundColor: "rgba(162, 58, 30, 0.03)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(162, 58, 30, 0.08)" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: RED, textTransform: "uppercase", display: "block", marginBottom: "2px" }}>
              Refuse Single-Factor Causal Claims
            </span>
            <p style={{ fontSize: "12px", lineHeight: "1.4", color: INK_SECONDARY, margin: 0 }}>
              Do not tell a client that a Saham *causes* an event. The Saham is a calculated indicator contributing opportunity-context, never a deterministic trigger.
            </p>
          </div>
          <div style={{ backgroundColor: "rgba(162, 58, 30, 0.03)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(162, 58, 30, 0.08)" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: RED, textTransform: "uppercase", display: "block", marginBottom: "2px" }}>
              Refuse Mystification Purity
            </span>
            <p style={{ fontSize: "12px", lineHeight: "1.4", color: INK_SECONDARY, margin: 0 }}>
              Do not claim Sahams are taught in classical Parāśara texts. Honestly acknowledge their Hellenistic Greek (*klēros*) and Arabic roots (*sahm*).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
