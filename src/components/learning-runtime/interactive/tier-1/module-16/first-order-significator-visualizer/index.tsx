"use client";

import { useState, useMemo } from "react";
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const INDIGO = "#4F6FA8";

interface PlanetInfo {
  name: string;
  house: number;
  sign: string;
  nak: string;
  starLord: string;
}

interface Preset {
  name: string;
  lagnaSign: number; // Rashi index (0 = Aries)
  planets: PlanetInfo[];
}

const PRESETS: Preset[] = [
  {
    name: "Scenario A: 7th House Marriage Focus",
    lagnaSign: 0, // Aries Lagna (so Libra rises on 7th cusp)
    planets: [
      { name: "Mars", house: 7, sign: "Libra", nak: "Viśākhā", starLord: "Jupiter" },
      { name: "Saturn", house: 7, sign: "Libra", nak: "Chitrā", starLord: "Mars" },
      { name: "Venus", house: 9, sign: "Sagittarius", nak: "Pūrva-aṣāḍhā", starLord: "Venus" },
      { name: "Moon", house: 5, sign: "Leo", nak: "Pūrva-phālgunī", starLord: "Venus" },
      { name: "Sun", house: 1, sign: "Aries", nak: "Aśvinī", starLord: "Ketu" },
      { name: "Mercury", house: 1, sign: "Aries", nak: "Bharaṇī", starLord: "Venus" },
      { name: "Jupiter", house: 11, sign: "Aquarius", nak: "Dhaniṣṭhā", starLord: "Mars" },
      { name: "Rahu", house: 3, sign: "Gemini", nak: "Ardrā", starLord: "Rahu" },
      { name: "Ketu", house: 9, sign: "Sagittarius", nak: "Mūla", starLord: "Ketu" }
    ]
  },
  {
    name: "Scenario B: 10th House Career Focus",
    lagnaSign: 9, // Capricorn Lagna (so Libra rises on 10th cusp)
    planets: [
      { name: "Saturn", house: 10, sign: "Libra", nak: "Svātī", starLord: "Rahu" },
      { name: "Sun", house: 10, sign: "Libra", nak: "Chitrā", starLord: "Mars" },
      { name: "Venus", house: 1, sign: "Capricorn", nak: "Uttarāṣāḍhā", starLord: "Sun" },
      { name: "Moon", house: 2, sign: "Aquarius", nak: "Śatabhiṣaj", starLord: "Rahu" },
      { name: "Mars", house: 8, sign: "Leo", nak: "Maghā", starLord: "Ketu" },
      { name: "Mercury", house: 9, sign: "Virgo", nak: "Hasta", starLord: "Moon" },
      { name: "Jupiter", house: 4, sign: "Aries", nak: "Kṛttikā", starLord: "Sun" },
      { name: "Rahu", house: 11, sign: "Scorpio", nak: "Anurādhā", starLord: "Saturn" },
      { name: "Ketu", house: 5, sign: "Taurus", nak: "Rohiṇī", starLord: "Moon" }
    ]
  }
];

export function FirstOrderSignificatorVisualizer() {
  const [activePresetIdx, setActivePresetIdx] = useState(0);
  const activePreset = PRESETS[activePresetIdx];

  const [selectedHouse, setSelectedHouse] = useState(7); // default 7th house selected

  const lagnaSignIdx = activePreset.lagnaSign;
  const currentPlanets = activePreset.planets;

  // Helper to map house index to sign index (0-11)
  const getSignForHouse = (h: number) => {
    return (lagnaSignIdx + h - 1) % 12;
  };

  const currentCuspSign = useMemo(() => {
    const sIdx = getSignForHouse(selectedHouse);
    return RASHIS[sIdx];
  }, [lagnaSignIdx, selectedHouse]);

  // Extract Occupants
  const occupants = useMemo(() => {
    return currentPlanets.filter((p) => p.house === selectedHouse);
  }, [currentPlanets, selectedHouse]);

  // Extract Lord
  const houseLord = currentCuspSign.lord;
  const lordPlanetInfo = useMemo(() => {
    return currentPlanets.find((p) => p.name === houseLord);
  }, [currentPlanets, houseLord]);

  // 1st-Order Set
  const firstOrderSet = useMemo(() => {
    const list = [...occupants.map((o) => o.name)];
    if (!list.includes(houseLord)) {
      list.push(houseLord);
    }
    return list;
  }, [occupants, houseLord]);

  // Calculate Stellar Strength percentage for the cusp details gauge
  const stellarStrength = useMemo(() => {
    let score = 20; // baseline 20% for cusp lord existence
    score += occupants.length * 40; // +40% per occupant
    if (lordPlanetInfo && lordPlanetInfo.house === selectedHouse) {
      score += 10; // extra strength if lord sits in its own house
    }
    return Math.min(100, score);
  }, [occupants, lordPlanetInfo, selectedHouse]);

  // SVG paths and centers for North Indian chart houses (width 400, height 400)
  const housePaths = [
    { id: 1, path: "M 200,200 L 100,100 L 200,0 L 300,100 Z", textX: 200, textY: 70, cX: 200, cY: 85 },
    { id: 2, path: "M 0,0 L 200,0 L 100,100 Z", textX: 100, textY: 40, cX: 100, cY: 45 },
    { id: 3, path: "M 0,0 L 0,200 L 100,100 Z", textX: 40, textY: 100, cX: 45, cY: 100 },
    { id: 4, path: "M 200,200 L 100,100 L 0,200 L 100,300 Z", textX: 70, textY: 200, cX: 85, cY: 200 },
    { id: 5, path: "M 0,400 L 0,200 L 100,300 Z", textX: 40, textY: 300, cX: 45, cY: 300 },
    { id: 6, path: "M 0,400 L 200,400 L 100,300 Z", textX: 100, textY: 360, cX: 100, cY: 355 },
    { id: 7, path: "M 200,200 L 100,300 L 200,400 L 300,300 Z", textX: 200, textY: 330, cX: 200, cY: 315 },
    { id: 8, path: "M 400,400 L 200,400 L 300,300 Z", textX: 300, textY: 360, cX: 300, cY: 355 },
    { id: 9, path: "M 400,400 L 400,200 L 300,300 Z", textX: 360, textY: 300, cX: 355, cY: 300 },
    { id: 10, path: "M 200,200 L 300,300 L 400,200 L 300,100 Z", textX: 330, textY: 200, cX: 315, cY: 200 },
    { id: 11, path: "M 400,0 L 400,200 L 300,100 Z", textX: 360, textY: 100, cX: 355, cY: 100 },
    { id: 12, path: "M 400,0 L 200,0 L 300,100 Z", textX: 300, textY: 40, cX: 300, cY: 45 }
  ];

  const planetsByHouse = useMemo(() => {
    const map: Record<number, string[]> = {};
    currentPlanets.forEach((p) => {
      if (!map[p.house]) map[p.house] = [];
      map[p.house].push(p.name);
    });
    return map;
  }, [currentPlanets]);

  // Find coordinates for selected house and cusp lord house to draw trace
  const selectedHouseCenter = useMemo(() => {
    return housePaths.find((hp) => hp.id === selectedHouse) ?? housePaths[6];
  }, [selectedHouse]);

  const cuspLordCenter = useMemo(() => {
    if (!lordPlanetInfo) return null;
    return housePaths.find((hp) => hp.id === lordPlanetInfo.house) ?? null;
  }, [lordPlanetInfo]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "28px 24px", color: INK_PRIMARY, minHeight: "650px" }} data-interactive="first-order-significator-visualizer">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1.2rem", marginBottom: "1.8rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 6 · Lesson 2</span>
        <h1 style={{ margin: "0.3rem 0 0", color: GOLD, fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>First-Order Significator Visualizer</h1>
        <p style={{ margin: "0.4rem 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.5" }}>
          Isolate the occupants (Level 2) and sign-lord (Level 4) of a selected house from an interactive North Indian Kundali chart. Select custom scenarios below.
        </p>
      </section>

      {/* Preset Loader */}
      <section style={{ marginBottom: "1.8rem", display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: 800, color: INK_SECONDARY, textTransform: "uppercase" }}>Select Scenario Chart:</span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActivePresetIdx(idx);
              if (idx === 0) setSelectedHouse(7);
              else setSelectedHouse(10);
            }}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              border: `1px solid ${HAIRLINE}`,
              background: activePresetIdx === idx ? `${GOLD}20` : "transparent",
              color: GOLD,
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {p.name}
          </button>
        ))}
      </section>

      {/* Two-Column Workspace */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2.4rem", marginBottom: "2.4rem" }}>
        
        {/* Left Column: SVG North Indian Kundali Chart with Golden Trace */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "13px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>
            Interactive North Indian Kundali Chart
          </h3>
          
          <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ maxWidth: "360px", background: "#FFFBF2", borderRadius: "8px", border: `1px solid ${HAIRLINE}` }}>
            {housePaths.map((hp) => {
              const isSelected = selectedHouse === hp.id;
              const signNum = getSignForHouse(hp.id) + 1;
              const planets = planetsByHouse[hp.id] || [];

              return (
                <g key={hp.id} style={{ cursor: "pointer" }} onClick={() => setSelectedHouse(hp.id)}>
                  {/* House Segment Area */}
                  <path
                    d={hp.path}
                    fill={isSelected ? `${GOLD}15` : "transparent"}
                    stroke={isSelected ? GOLD : "#9C7A2F33"}
                    strokeWidth={isSelected ? 3.5 : 1}
                    style={{ transition: "all 0.2s" }}
                  />

                  {/* House Number text (Lagna relative offset sign number) */}
                  <text
                    x={hp.textX}
                    y={hp.textY - 14}
                    textAnchor="middle"
                    fill={GOLD}
                    style={{ fontSize: "12px", fontWeight: 900 }}
                  >
                    {signNum}
                  </text>

                  {/* House Label */}
                  <text
                    x={hp.textX}
                    y={hp.textY - 2}
                    textAnchor="middle"
                    fill={INK_SECONDARY}
                    style={{ fontSize: "9px", letterSpacing: "0.05em" }}
                  >
                    H{hp.id}
                  </text>

                  {/* Planets list in house */}
                  <text
                    x={hp.textX}
                    y={hp.textY + 12}
                    textAnchor="middle"
                    fill={INK_PRIMARY}
                    style={{ fontSize: "10.5px", fontWeight: 800 }}
                  >
                    {planets.join(", ")}
                  </text>
                </g>
              );
            })}

            {/* Glowing Golden Trace from Cusp to Cusp Lord */}
            {cuspLordCenter && cuspLordCenter.id !== selectedHouse && (
              <g>
                <line
                  x1={selectedHouseCenter.cX}
                  y1={selectedHouseCenter.cY}
                  x2={cuspLordCenter.cX}
                  y2={cuspLordCenter.cY}
                  stroke={GOLD}
                  strokeWidth="2.5"
                  strokeDasharray="5,5"
                  strokeLinecap="round"
                />
                <circle cx={selectedHouseCenter.cX} cy={selectedHouseCenter.cY} r="5" fill={GOLD} />
                <circle cx={cuspLordCenter.cX} cy={cuspLordCenter.cY} r="6" fill={GOLD} />
              </g>
            )}
          </svg>

          <p style={{ marginTop: "12px", fontSize: "11.5px", color: INK_SECONDARY, fontStyle: "italic", textAlign: "center" }}>
            Click any house cell inside the Kundali to display its 1st-order significators in the panel.
          </p>
        </div>

        {/* Right Column: 1st-Order Extraction Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "13px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>
              House Cusp Details
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ padding: "12px", border: `1px solid ${HAIRLINE}`, borderRadius: "8px", background: "#FFFBF2" }}>
                <span style={{ fontSize: "10px", textTransform: "uppercase", color: INK_SECONDARY, fontWeight: 700 }}>Selected House</span>
                <div style={{ fontSize: "18px", fontWeight: 900, color: GOLD }}>House {selectedHouse}</div>
              </div>
              <div style={{ padding: "12px", border: `1px solid ${HAIRLINE}`, borderRadius: "8px", background: "#FFFBF2" }}>
                <span style={{ fontSize: "10px", textTransform: "uppercase", color: INK_SECONDARY, fontWeight: 700 }}>Cusp Sign</span>
                <div style={{ fontSize: "18px", fontWeight: 900, color: GOLD }}>{currentCuspSign.nameIAST}</div>
              </div>
            </div>

            {/* Premium Upgrade: Cusp Strength Gauge */}
            <div style={{ marginBottom: "1rem", padding: "10px 14px", border: `1px solid ${HAIRLINE}`, borderRadius: "8px", background: "#FFFBF2" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", textTransform: "uppercase", color: INK_SECONDARY, fontWeight: 700, marginBottom: "4px" }}>
                <span>Stellar Prominence Gauge</span>
                <span style={{ color: GOLD }}>{stellarStrength}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: `${GOLD}22`, borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${stellarStrength}%`, height: "100%", background: GOLD, transition: "width 0.4s" }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              
              {/* Occupant Card */}
              <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: "8px", padding: "12px", background: "#FFFBF2" }}>
                <div style={{ fontSize: "11px", fontWeight: 800, color: GOLD, textTransform: "uppercase", marginBottom: "6px" }}>Occupants (Level 2)</div>
                {occupants.length > 0 ? (
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {occupants.map((o) => (
                      <span key={o.name} style={{ padding: "4px 8px", background: `${GOLD}12`, borderRadius: "4px", fontSize: "12px", fontWeight: 700 }}>
                        {o.name} <span style={{ fontSize: "10px", color: INK_SECONDARY, fontWeight: 400 }}>({o.nak})</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: "12px", color: INK_SECONDARY, fontStyle: "italic" }}>No Occupants (Empty House)</span>
                )}
              </div>

              {/* Owner/Lord Card */}
              <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: "8px", padding: "12px", background: "#FFFBF2" }}>
                <div style={{ fontSize: "11px", fontWeight: 800, color: GOLD, textTransform: "uppercase", marginBottom: "6px" }}>Cusp Lord (Level 4)</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: INK_PRIMARY }}>
                    {houseLord} <span style={{ fontSize: "11px", color: INK_SECONDARY, fontWeight: 400 }}>(rules {currentCuspSign.nameIAST})</span>
                  </span>
                  {lordPlanetInfo && (
                    <span style={{ fontSize: "11px", color: INK_SECONDARY }}>
                      Positioned in House {lordPlanetInfo.house} ({lordPlanetInfo.nak})
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* 1st-Order Set Union */}
          <div style={{ background: SURFACE, border: `1px solid ${GOLD}`, borderRadius: "10px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "13px", color: GOLD, fontWeight: 900, textTransform: "uppercase" }}>
              Assembled 1st-Order Set
            </h3>
            <div style={{ padding: "12px", background: `${GOLD}08`, borderRadius: "8px", border: `1px solid ${HAIRLINE}` }}>
              <div style={{ fontSize: "12px", color: INK_SECONDARY, marginBottom: "8px", fontWeight: 600 }}>
                Set formula: {"{ Occupants ∪ Cusp Lord }"}
              </div>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                {firstOrderSet.map((p) => (
                  <span key={p} style={{ padding: "6px 12px", background: GOLD, color: "#FFF", borderRadius: "6px", fontSize: "13px", fontWeight: 900 }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Star-of-Occupant Bridge to 2nd-Order */}
            <div style={{ marginTop: "16px", padding: "12px", background: "#FFFBF2", borderRadius: "8px", border: `1px solid ${HAIRLINE}` }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "11px", color: INDIGO, fontWeight: 800, textTransform: "uppercase" }}>
                Star-of-Occupant Bridge (Preview)
              </h4>
              <p style={{ margin: "0 0 8px 0", fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                Planets tenanting these occupants' nakṣatras form the 2nd-order significators.
              </p>
              {occupants.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {occupants.map((o) => (
                    <div key={o.name} style={{ fontSize: "11px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 700 }}>{o.name}&apos;s Star-Lord:</span>
                      <span style={{ color: GOLD, fontWeight: 700 }}>{o.starLord} ({o.nak})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: "11px", color: INK_SECONDARY, fontStyle: "italic" }}>
                  No occupants to bridge. Fall straight through to the Owner&apos;s star in the next tier.
                </span>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Styled Calculation parameters Table instead of VIX console */}
      <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>Astronomical Parameters Table</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}`, textAlign: "left", color: GOLD }}>
              <th style={{ padding: "8px" }}>House</th>
              <th style={{ padding: "8px" }}>Cusp Sign</th>
              <th style={{ padding: "8px" }}>Sign Lord (Lordship)</th>
              <th style={{ padding: "8px" }}>Active Occupants</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 12 }, (_, i) => {
              const hIdx = i + 1;
              const sign = getSignForHouse(hIdx);
              const signName = RASHIS[sign].nameIAST;
              const lord = RASHIS[sign].lord;
              const houseOccupants = currentPlanets.filter((p) => p.house === hIdx).map((p) => p.name);

              return (
                <tr key={hIdx} style={{ borderBottom: `1px solid ${HAIRLINE}33`, background: selectedHouse === hIdx ? `${GOLD}05` : "transparent" }}>
                  <td style={{ padding: "8px", fontWeight: 700 }}>House {hIdx}</td>
                  <td style={{ padding: "8px" }}>{signName}</td>
                  <td style={{ padding: "8px", color: GOLD, fontWeight: 700 }}>{lord}</td>
                  <td style={{ padding: "8px" }}>{houseOccupants.join(", ") || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

    </div>
  );
}
