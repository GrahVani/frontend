"use client";

import { useState, useMemo } from "react";
import { NAKSHATRAS } from "../nakshatra-data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const BLUE = "#356CAB";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const PLANET_NAMES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const VIM: [string, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];

const NAK_DEG = 13 + 20 / 60; // 13.3333°

const BASE_MEANINGS: Record<string, string> = {
  Sun: "Soul, authority, government, leadership, status, vitality, external ego.",
  Moon: "Mind, emotions, public connection, public image, memory, shifting moods.",
  Mars: "Action, energy, courage, conflict, dynamic drive, physical construction.",
  Mercury: "Intellect, logic, commerce, writing, speech, agility, mathematical parsing.",
  Jupiter: "Wisdom, wealth, counseling, child indicators, spiritual expansion.",
  Venus: "Relational harmony, spouse, beauty, refined arts, diplomatic transactions.",
  Saturn: "Discipline, delays, structures, boundaries, karmic patience, structural endurance.",
  Rahu: "Amplification, material obsessions, foreign systems, illusions, expansion.",
  Ketu: "Separation, spiritual detachment, internal search, dissolution, liberation."
};

const PLANET_COLORS: Record<string, string> = {
  Sun: "#D97706",
  Moon: "#85929E",
  Mars: "#EF4444",
  Mercury: "#10B981",
  Jupiter: "#EAB308",
  Venus: "#EC4899",
  Saturn: "#6366F1",
  Rahu: "#4B5563",
  Ketu: "#78350F"
};

function getModulationText(planet: string, subLord: string): string {
  const pairs: Record<string, string> = {
    "Mars-Mercury": "Energy & drive are channeled through Mercury's themes: intellect, communication, or commerce. Instead of raw physical confrontation, energy is applied to analytical or commercial pursuits (e.g. intellectual sparring or business drive).",
    "Venus-Sun": "Love, spouse, and relational indicators are filtered through Sun's theme: authority, status, and recognition. Relationships are highly tied to social status or authority roles, and artistic pursuits seek official recognition.",
    "Jupiter-Saturn": "Wisdom, teaching, and expansion are filtered through Saturn's theme: discipline, delay, and obstacles. Wisdom is won slowly through trial and hard discipline; educational pursuits require patience.",
    "Mars-Venus": "Mars's assertive drive is modulated by Venusian themes: relationships, arts, and refinement. Energy is channeled into creative, artistic, or relational pursuits rather than conflict.",
    "Saturn-Moon": "Saturnian discipline and delay are modulated by Moon's emotional filter. The native feels delays deeply at an emotional level; structural duties are colored by public or nurturing roles.",
    "Sun-Jupiter": "Sun's leadership and authority are modulated by Jupiterian wisdom and counsel. The native exercises authority through teaching, counseling, or philosophical leadership.",
    "Moon-Ketu": "Moon's mind and emotional state are modulated by Ketu's detachment and dissolution. The native experiences deep intuitive wisdom but also emotional detachment or a sense of spiritual isolation.",
    "Mercury-Jupiter": "Mercury's intellectual commerce is modulated by Jupiter's wisdom and teaching. Communication is focused on advisory, philosophical, or educational counseling.",
    "Venus-Jupiter": "Venusian wealth and arts are modulated by Jupiterian expansion and fortune. Artistic talent expands into grand scales, and wealth is acquired through teaching, law, or ethical means."
  };

  const key = `${planet}-${subLord}`;
  return pairs[key] ?? `${planet}'s raw planetary energy is refracted through the prism of ${subLord}'s sub-lord, coloring how its final predictive results manifest.`;
}

function fmtDMS(d: number): string {
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  const sec = Math.round(((d - deg) * 60 - min) * 60);
  if (sec === 60) return `${deg}°${(min + 1).toString().padStart(2, "0")}′00″`;
  return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″`;
}

function getSubLordData(lon: number) {
  const nakIdx = Math.min(Math.floor(lon / NAK_DEG), 26);
  const nak = NAKSHATRAS[nakIdx];
  const elapsed = lon - nakIdx * NAK_DEG;
  
  const start = VIM.findIndex((v) => v[0] === nak.ruler);
  const subs: { lord: string; years: number; from: number; to: number }[] = [];
  let cursor = 0;
  for (let j = 0; j < 9; j++) {
    const [lord, years] = VIM[(start + j) % 9];
    const width = (years / 120) * NAK_DEG;
    subs.push({ lord, years, from: cursor, to: cursor + width });
    cursor += width;
  }
  
  const activeSub = subs.find((s) => elapsed >= s.from && elapsed < s.to) ?? subs[subs.length - 1];

  return {
    nak,
    elapsed,
    subs,
    activeSub
  };
}

export function PlanetSubLordModulator() {
  const [selectedPlanet, setSelectedPlanet] = useState<string>("Mars");
  
  const [planetLongitudes, setPlanetLongitudes] = useState<Record<string, number>>({
    Sun: 45.0,
    Moon: 140.0,
    Mars: 314.3667, 
    Mercury: 110.0,
    Jupiter: 265.0,
    Venus: 98.50, 
    Saturn: 185.0,
    Rahu: 12.0,
    Ketu: 192.0
  });

  const activeLongitude = planetLongitudes[selectedPlanet] ?? 0;
  const subData = getSubLordData(activeLongitude);

  const handleNudge = (amt: number) => {
    setPlanetLongitudes((prev) => {
      const copy = { ...prev };
      const cur = copy[selectedPlanet] ?? 0;
      copy[selectedPlanet] = Math.max(0, Math.min(359.99, cur + amt));
      return copy;
    });
  };

  const handleSliderChange = (val: number) => {
    setPlanetLongitudes((prev) => {
      const copy = { ...prev };
      copy[selectedPlanet] = val;
      return copy;
    });
  };

  const modulationText = useMemo(() => {
    return getModulationText(selectedPlanet, subData.activeSub.lord);
  }, [selectedPlanet, subData.activeSub.lord]);

  // Derived colors for modulation lens pipeline
  const planetColor = PLANET_COLORS[selectedPlanet] || GOLD;
  const starLordColor = PLANET_COLORS[subData.nak.ruler] || GOLD;
  const subLordColor = PLANET_COLORS[subData.activeSub.lord] || GOLD;

  return (
    <div style={{ color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif" }} data-interactive="planet-sub-lord-modulator">
      
      {/* Header Banner */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", marginBottom: "1rem", boxShadow: "0 4px 20px -2px rgba(47, 125, 85, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GREEN, fontWeight: 900, background: `${GREEN}15`, padding: "2px 8px", borderRadius: "4px" }}>Energy Refraction Pipeline</span>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD, fontWeight: 900, background: `${GOLD}15`, padding: "2px 8px", borderRadius: "4px" }}>Chapter 4, Lesson 2</span>
        </div>
        <h2 style={{ margin: "0.4rem 0 0.2rem", color: GOLD, fontSize: "1.45rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
          Planet Sub-Lord Modulation Layer
        </h2>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "13px", lineHeight: 1.55 }}>
          KP Sub-lord theory states that while a planet's Star Lord shows the source of its energy, its Sub Lord acts as a refraction filter defining the final outcome of that energy.
        </p>
      </section>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        
        {/* Left Side: Planet Selector and Scrubber */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
            <h3 style={{ margin: "0 0 0.75rem", color: GOLD, fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Select Graha</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem", marginBottom: "1rem" }}>
              {PLANET_NAMES.map((p) => {
                const isActive = selectedPlanet === p;
                const pSub = getSubLordData(planetLongitudes[p] ?? 0).activeSub.lord;
                return (
                  <button
                    key={p}
                    onClick={() => setSelectedPlanet(p)}
                    style={{
                      border: `1.5px solid ${isActive ? PLANET_COLORS[p] : HAIRLINE}`,
                      borderRadius: 8,
                      background: isActive ? `${PLANET_COLORS[p]}15` : "transparent",
                      color: isActive ? PLANET_COLORS[p] : INK_PRIMARY,
                      padding: "0.45rem 0.25rem",
                      fontSize: "11px",
                      fontWeight: isActive ? 800 : 600,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transition: "all 150ms ease"
                    }}
                  >
                    <strong>{p}</strong>
                    <span style={{ fontSize: "8px", color: INK_MUTED, marginTop: "0.15rem" }}>Sub: {pSub.substring(0, 3)}</span>
                  </button>
                );
              })}
            </div>

            {/* Longitude fine tune / range slider */}
            <div style={{ borderTop: `1px dashed ${HAIRLINE}`, paddingTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "10px", color: INK_MUTED, textTransform: "uppercase", fontWeight: 800 }}>Graha Longitude:</span>
                <strong style={{ fontSize: "12px", color: GOLD, fontFamily: "monospace" }}>{fmtDMS(activeLongitude)}</strong>
              </div>
              <input
                type="range"
                min="0"
                max="359.99"
                step="0.05"
                value={activeLongitude}
                onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: planetColor, cursor: "pointer", marginBottom: "0.75rem" }}
                aria-label="Planet Longitude Scrubber"
              />
              <div style={{ display: "flex", gap: "0.3rem", justifyContent: "center" }}>
                <button onClick={() => handleNudge(-1)} style={nudgeButtonStyle}>-1°</button>
                <button onClick={() => handleNudge(-1/15)} style={nudgeButtonStyle}>-4′</button>
                <button onClick={() => handleNudge(1/15)} style={nudgeButtonStyle}>+4′</button>
                <button onClick={() => handleNudge(1)} style={nudgeButtonStyle}>+1°</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Planet Modulation Lens Pipeline SVG & Refraction Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {/* Draggable Redesigned experience: The Planet Modulation Lens Pipeline */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
              Energy Refraction Pipeline Diagram
            </span>
            <svg width="100%" height="150" viewBox="0 0 420 150" style={{ background: "rgba(0,0,0,0.01)", border: `1px stroke ${HAIRLINE}`, borderRadius: 8, overflow: "visible" }}>
              <defs>
                <filter id="laserGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="refractedBeam" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor={starLordColor} />
                  <stop offset="100%" stopColor={subLordColor} />
                </linearGradient>
              </defs>

              {/* Layout pipeline connection lines */}
              <line x1="50" y1="75" x2="370" y2="75" stroke={`${HAIRLINE}50`} strokeWidth="1" strokeDasharray="3 3" />
              
              {/* LASER BEAMS */}
              {/* Beam 1: Planet to Star Lord (focused lens) */}
              <line x1="50" y1="75" x2="180" y2="75" stroke={planetColor} strokeWidth="3" filter="url(#laserGlow)" />
              {/* Beam 2: Star Lord to Sub Lord (Prism) */}
              <line x1="180" y1="75" x2="295" y2="75" stroke={starLordColor} strokeWidth="3.5" filter="url(#laserGlow)" />
              {/* Beam 3: Sub Lord refracted/modulated outputs */}
              <line x1="295" y1="75" x2="370" y2="40" stroke={subLordColor} strokeWidth="2.5" filter="url(#laserGlow)" strokeDasharray="5 1" />
              <line x1="295" y1="75" x2="370" y2="75" stroke={subLordColor} strokeWidth="3.5" filter="url(#laserGlow)" />
              <line x1="295" y1="75" x2="370" y2="110" stroke={subLordColor} strokeWidth="2.5" filter="url(#laserGlow)" strokeDasharray="5 1" />

              {/* NODE 1: Planet Base Energy */}
              <g transform="translate(50, 75)">
                <circle cx="0" cy="0" r="22" fill={SURFACE} stroke={planetColor} strokeWidth="3" />
                <circle cx="0" cy="0" r="16" fill={`${planetColor}15`} />
                <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="900" fill={INK_PRIMARY}>
                  {selectedPlanet}
                </text>
              </g>

              {/* NODE 2: Star Lord Focus Lens */}
              <g transform="translate(180, 75)">
                <ellipse rx="10" ry="26" fill={`${starLordColor}12`} stroke={starLordColor} strokeWidth="2.5" />
                <line x1="0" y1="-28" x2="0" y2="28" stroke={starLordColor} strokeWidth="1" />
                <text x="0" y="-34" textAnchor="middle" fontSize="8" fontWeight="800" fill={starLordColor} style={{ textTransform: "uppercase" }}>
                  Star Lord Lens ({subData.nak.ruler})
                </text>
              </g>

              {/* NODE 3: Sub Lord Verdict Prism */}
              <g transform="translate(295, 75)">
                {/* Draw triangle prism */}
                <polygon points="-16,24 -16,-24 18,0" fill={`${subLordColor}10`} stroke={subLordColor} strokeWidth="2.5" />
                <text x="0" y="-34" textAnchor="middle" fontSize="8" fontWeight="800" fill={subLordColor} style={{ textTransform: "uppercase" }}>
                  Sub Lord Prism ({subData.activeSub.lord})
                </text>
              </g>

              {/* Output Target Screen */}
              <g transform="translate(370, 75)">
                <line x1="0" y1="-45" x2="0" y2="45" stroke={INK_SECONDARY} strokeWidth="3" strokeLinecap="round" />
                <text x="10" y="0" textAnchor="start" dominantBaseline="middle" fontSize="8" fontWeight="800" fill={INK_MUTED} style={{ textTransform: "uppercase" }}>
                  Modulated Results
                </text>
              </g>
            </svg>
          </div>

          {/* Modulation Text Card */}
          <div style={{ display: "grid", gap: "0.8rem" }}>
            
            <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem" }}>
              <span style={{ color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", fontWeight: 800, display: "block" }}>
                1. Base Planet Significations
              </span>
              <p style={{ margin: "0.2rem 0 0", fontSize: "12.5px", color: INK_SECONDARY, lineHeight: 1.5 }}>
                {BASE_MEANINGS[selectedPlanet]}
              </p>
            </div>

            <div style={{ background: `${GOLD}05`, border: `1.5px solid ${subLordColor}44`, borderRadius: 12, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.01)" }}>
              <span style={{ color: subLordColor, fontSize: "9px", textTransform: "uppercase", fontWeight: 900, display: "block" }}>
                2. modulated KP result
              </span>
              <h4 style={{ margin: "0.2rem 0 0.4rem", color: GOLD, fontSize: "1.2rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
                {selectedPlanet} Energy refracted through {subData.activeSub.lord}
              </h4>
              <p style={{ margin: 0, fontSize: "12.5px", color: INK_PRIMARY, lineHeight: 1.55 }}>
                {modulationText}
              </p>
            </div>

          </div>

          {/* Sub divisions range overlay */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem" }}>
            <span style={{ color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: "0.4rem" }}>
              Sub-Division span coordinates inside {subData.nak.name} nakṣatra:
            </span>
            <div style={{ position: "relative", height: "1.8rem", background: "rgba(0,0,0,0.02)", border: `1px solid ${HAIRLINE}`, borderRadius: 6, display: "flex", overflow: "hidden" }}>
              {subData.subs.map((s, idx) => {
                const isActive = s.lord === subData.activeSub.lord;
                const widthPercent = ((s.to - s.from) / NAK_DEG) * 100;
                return (
                  <div
                    key={idx}
                    style={{
                      width: `${widthPercent}%`,
                      height: "100%",
                      borderRight: `1px solid ${HAIRLINE}`,
                      background: isActive ? `${subLordColor}20` : "transparent",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "9px",
                      fontWeight: isActive ? 900 : 500,
                      color: isActive ? subLordColor : INK_MUTED
                    }}
                  >
                    {s.lord.substring(0, 3)}
                  </div>
                );
              })}
              <div
                style={{
                  position: "absolute",
                  left: `${(subData.elapsed / NAK_DEG) * 100}%`,
                  top: 0,
                  bottom: 0,
                  width: "3px",
                  background: subLordColor,
                  boxShadow: `0 0 6px ${subLordColor}`
                }}
              />
            </div>

            <div style={{ borderTop: `1px dashed ${HAIRLINE}`, marginTop: "0.8rem", paddingTop: "0.6rem" }}>
              <span style={{ color: GOLD, fontSize: "9px", textTransform: "uppercase", fontWeight: 900, display: "block", marginBottom: "0.3rem" }}>Mathematical Calculation Log</span>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5px", color: INK_SECONDARY }}>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                    <td style={{ padding: "0.25rem 0" }}>Graha absolute longitude</td>
                    <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700, fontFamily: "monospace" }}>{activeLongitude.toFixed(4)}°</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                    <td style={{ padding: "0.25rem 0" }}>Nakṣatra division start</td>
                    <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700 }}>{(Math.floor(activeLongitude / NAK_DEG) * NAK_DEG).toFixed(4)}° ({subData.nak.name})</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                    <td style={{ padding: "0.25rem 0" }}>Offset / Span ratio</td>
                    <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700, fontFamily: "monospace" }}>{fmtDMS(subData.elapsed)} ({Math.round(subData.elapsed * 60)}′ / 800′)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.25rem 0" }}>Active Modulation Sub-Lord</td>
                    <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700, color: subLordColor }}>{subData.activeSub.lord}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

const nudgeButtonStyle: React.CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 4,
  background: SURFACE,
  color: INK_PRIMARY,
  padding: "0.3rem 0.5rem",
  cursor: "pointer",
  fontSize: "11px",
  fontWeight: 700
};
