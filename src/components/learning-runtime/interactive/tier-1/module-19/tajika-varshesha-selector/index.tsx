"use client";

import { useState } from "react";
import { Info, HelpCircle, Layers, CheckCircle2, ShieldAlert, Award, Compass, MousePointer } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

const RASHI_LARDS = [
  "", // 0-based filler
  "Mars",    // 1 = Aries
  "Venus",   // 2 = Taurus
  "Mercury", // 3 = Gemini
  "Moon",    // 4 = Cancer
  "Sun",     // 5 = Leo
  "Mercury", // 6 = Virgo
  "Venus",   // 7 = Libra
  "Mars",    // 8 = Scorpio
  "Jupiter", // 9 = Sagittarius
  "Saturn",  // 10 = Capricorn
  "Saturn",  // 11 = Aquarius
  "Jupiter"  // 12 = Pisces
];

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa"
};

const HOUSE_PATHS = {
  1: "M 100,0 L 50,50 L 100,100 L 150,50 Z",
  2: "M 0,0 L 100,0 L 50,50 Z",
  3: "M 0,0 L 0,100 L 50,50 Z",
  4: "M 0,100 L 50,50 L 100,100 L 50,150 Z",
  5: "M 0,200 L 0,100 L 50,150 Z",
  6: "M 0,200 L 100,200 L 50,150 Z",
  7: "M 100,200 L 50,150 L 100,100 L 150,150 Z",
  8: "M 200,200 L 100,200 L 150,150 Z",
  9: "M 200,200 L 200,100 L 150,150 Z",
  10: "M 200,100 L 150,50 L 100,100 L 150,150 Z",
  11: "M 200,0 L 200,100 L 150,50 Z",
  12: "M 200,0 L 100,0 L 150,50 Z"
};

const HOUSE_CENTROIDS = {
  1: { x: 100, y: 50 },
  2: { x: 50, y: 16.67 },
  3: { x: 16.67, y: 50 },
  4: { x: 50, y: 100 },
  5: { x: 16.67, y: 150 },
  6: { x: 50, y: 183.33 },
  7: { x: 100, y: 150 },
  8: { x: 150, y: 183.33 },
  9: { x: 183.33, y: 150 },
  10: { x: 150, y: 100 },
  11: { x: 183.33, y: 50 },
  12: { x: 150, y: 16.67 }
};

const HOUSE_LABEL_POS = {
  1: { x: 100, y: 24 },
  2: { x: 30, y: 16 },
  3: { x: 16, y: 30 },
  4: { x: 24, y: 100 },
  5: { x: 16, y: 170 },
  6: { x: 30, y: 184 },
  7: { x: 100, y: 176 },
  8: { x: 170, y: 184 },
  9: { x: 184, y: 170 },
  10: { x: 176, y: 100 },
  11: { x: 184, y: 30 },
  12: { x: 170, y: 16 }
};

// Aspect coordinate endpoints for drawing lines to H1 center (100, 50)
const ASPECT_LINE_COORDS: Record<number, { x: number; y: number }> = {
  1: { x: 100, y: 50 },
  3: { x: 16.67, y: 50 },
  4: { x: 50, y: 100 },
  5: { x: 16.67, y: 150 },
  7: { x: 100, y: 150 },
  9: { x: 183.33, y: 150 },
  10: { x: 150, y: 100 },
  11: { x: 183.33, y: 50 }
};

const DOJO_QUESTION = {
  clientQuery: "My Varṣaphala year-lord is Saturn. Does this mean I am doomed to have a year of constant failures and blockages? I am thinking of putting all my projects on hold.",
  options: [
    {
      text: "Affirm the fatalistic outcome: 'Saturn is the great restrictor. You should delay all your major career launches and prepare for severe delays. It is best not to start anything major.'",
      isCorrect: false,
      feedback: "Incorrect. This teaches the client to submit to fatalistic fear, violating the non-deterministic M19 counseling protocol."
    },
    {
      text: "Reframe as Year-Tone structure: 'Saturn as Varṣeśa indicates that this year's primary tone is built around discipline, patient building, and responsibility. It is a time for meticulous preparation and sustained effort, not failure. Do not put life on hold; instead, structure your projects carefully.'",
      isCorrect: true,
      feedback: "Correct! This translates a Saturn year-lord into a positive requirement for discipline, responsibility, and patient building without fear."
    },
    {
      text: "Over-promise to ease panic: 'No, Saturn is actually excellent! Since it is your year-lord, it will immediately reward you with massive authority, a huge corporate post, and effortless power.'",
      isCorrect: false,
      feedback: "Incorrect. Over-promising is also non-compliant, as it ignores the realistic themes of Saturn."
    }
  ]
};

type ActivePlanetType = "Sun" | "Moon" | "Mars" | "Venus";

export function TajikaVarsheshaSelector() {
  // Configurable Inputs
  const [isDayBirth, setIsDayBirth] = useState<boolean>(true);
  const [natalLagna, setNatalLagna] = useState<number>(1); // 1 = Aries
  const [varsaLagna, setVarsaLagna] = useState<number>(4); // 4 = Cancer
  const [munthaHouse, setMunthaHouse] = useState<number>(7); // House 7
  
  // Custom House Placements for candidates
  const [sunHouse, setSunHouse] = useState<number>(11); // Dina-Ratri-pati (Day)
  const [moonHouse, setMoonHouse] = useState<number>(2);  // Dina-Ratri-pati (Night)
  const [marsHouse, setMarsHouse] = useState<number>(6);  // Janma-Lagnesa
  const [venusHouse, setVenusHouse] = useState<number>(1); // Muntha-pati / Tri-Rasi-pati
  const [jupiterHouse] = useState<number>(10); // Simple fallback

  // Active Placement Planet state
  const [activePlacementPlanet, setActivePlacementPlanet] = useState<ActivePlanetType>("Mars");

  // Counseling Dojo State
  const [dojoChoice, setDojoChoice] = useState<number | null>(null);
  const [dojoFeedback, setDojoFeedback] = useState<string>("");

  // Calculated Lords
  const janmaLagneśa = RASHI_LARDS[natalLagna];
  const varsaLagneśa = RASHI_LARDS[varsaLagna];

  const munthaSign = (natalLagna + munthaHouse - 2) % 12 + 1;
  const munthāPati = RASHI_LARDS[munthaSign];

  // Tri-Rāśi-pati calculation
  const getTriRasiPati = (sign: number, isDay: boolean): string => {
    const fireSigns = [1, 5, 9];
    const earthSigns = [2, 6, 10];
    const airSigns = [3, 7, 11];
    
    if (fireSigns.includes(sign)) return isDay ? "Sun" : "Jupiter";
    if (earthSigns.includes(sign)) return isDay ? "Venus" : "Moon";
    if (airSigns.includes(sign)) return isDay ? "Saturn" : "Mercury";
    return isDay ? "Mars" : "Venus"; // Water
  };
  const triRāśiPati = getTriRasiPati(varsaLagna, isDayBirth);

  const dinaRātriPati = isDayBirth ? "Sun" : "Moon";

  // Check where each planet is placed
  const getPlanetHouse = (planet: string): number => {
    if (planet === "Sun") return sunHouse;
    if (planet === "Moon") return moonHouse;
    if (planet === "Mars") return marsHouse;
    if (planet === "Venus") return venusHouse;
    return jupiterHouse;
  };

  const handleHouseClick = (houseIndex: number) => {
    if (activePlacementPlanet === "Sun") setSunHouse(houseIndex);
    else if (activePlacementPlanet === "Moon") setMoonHouse(houseIndex);
    else if (activePlacementPlanet === "Mars") setMarsHouse(houseIndex);
    else if (activePlacementPlanet === "Venus") setVenusHouse(houseIndex);
  };

  // Offices list
  const candidatesList = [
    { office: "Janma-Lagneśa", planet: janmaLagneśa, house: getPlanetHouse(janmaLagneśa) },
    { office: "Varṣa-Lagneśa", planet: varsaLagneśa, house: getPlanetHouse(varsaLagneśa) },
    { office: "Munthā-pati", planet: munthāPati, house: getPlanetHouse(munthāPati) },
    { office: "Tri-Rāśi-pati", planet: triRāśiPati, house: getPlanetHouse(triRāśiPati) },
    { office: "Dina-Rātri-pati", planet: dinaRātriPati, house: getPlanetHouse(dinaRātriPati) }
  ];

  const ASPECT_HOUSES = [1, 3, 4, 5, 7, 9, 10, 11];

  // Base scoring function
  const getPancavargiScore = (planet: string, house: number) => {
    let ksetra = 15;
    let uccha = 10;
    let hadda = 3.75;
    let drekkana = 5;
    let navamsa = 3.75;

    if (planet === "Venus" && munthaSign === 7) ksetra = 30; // Own sign Libra
    if (planet === "Sun" && sunHouse === 1) ksetra = 30;
    if (planet === "Moon" && varsaLagna === 4) ksetra = 30;

    const total = ksetra + uccha + hadda + drekkana + navamsa;

    return { ksetra, uccha, hadda, drekkana, navamsa, total };
  };

  const scoredDistinctCandidates = Array.from(new Set(candidatesList.map(c => c.planet))).map(planet => {
    const house = getPlanetHouse(planet);
    const aspectsLagna = ASPECT_HOUSES.includes(house);
    const scoreInfo = getPancavargiScore(planet, house);
    return {
      planet,
      house,
      aspectsLagna,
      ...scoreInfo
    };
  });

  // Aspecting qualifiers
  const aspectingQualifiers = scoredDistinctCandidates.filter(c => c.aspectsLagna);

  let varshesa = "";
  let selectionReason = "";

  if (aspectingQualifiers.length > 0) {
    const sorted = [...aspectingQualifiers].sort((a, b) => b.total - a.total);
    varshesa = sorted[0].planet;
    selectionReason = `${varshesa} aspects the Varṣa Lagna (from House ${sorted[0].house}) and has the highest Pańcavargīya-bala score (${sorted[0].total}).`;
  } else {
    varshesa = munthāPati;
    selectionReason = `No candidates aspect the Varṣa Lagna. The Munthā-pati (${munthāPati}) is selected as Varṣeśa by default.`;
  }

  const handleDojoAnswer = (idx: number, isCorrect: boolean, feedback: string) => {
    setDojoChoice(idx);
    setDojoFeedback(feedback);
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 246, 0.7)",
        border: "1px solid rgba(156, 122, 47, 0.2)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
      data-interactive="tajika-varshesha-selector"
    >
      {/* Inline styles for custom aspect line dash offsets */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes aspect-dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .aspect-flow-line {
          stroke-dasharray: 6,4;
          animation: aspect-dash 1.2s infinite linear;
        }
      `}} />

      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 4 — Lesson 2
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Varṣeśa (Year Lord) Selector & Scorer
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Position candidates directly on the chart, calculate aspect qualification, and audit the Pańcavargīya-bala.
        </p>
      </div>

      {/* Grid: Left Settings, Right North Indian Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* Settings Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(156, 122, 47, 0.12)",
              borderRadius: "10px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "0 2px 8px rgba(156,122,47,0.01)"
            }}
          >
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Annual Chart Variables:
            </span>

            {/* Birth Time Toggle */}
            <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
              <span>Birth Time (Dina-Rātri-lord basis):</span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => setIsDayBirth(true)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: `1px solid ${isDayBirth ? GOLD_DEEP : "rgba(156, 122, 47, 0.2)"}`,
                    background: isDayBirth ? GOLD_DEEP : "#ffffff",
                    color: isDayBirth ? "#ffffff" : INK_SECONDARY,
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "11.5px",
                    transition: "all 150ms ease"
                  }}
                >
                  Day-Birth
                </button>
                <button
                  onClick={() => setIsDayBirth(false)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: `1px solid ${!isDayBirth ? GOLD_DEEP : "rgba(156, 122, 47, 0.2)"}`,
                    background: !isDayBirth ? GOLD_DEEP : "#ffffff",
                    color: !isDayBirth ? "#ffffff" : INK_SECONDARY,
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "11.5px",
                    transition: "all 150ms ease"
                  }}
                >
                  Night-Birth
                </button>
              </div>
            </div>

            {/* Selectors for Lagna and Munthā */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 500 }}>Natal Lagna:</label>
                <select
                  value={natalLagna}
                  onChange={(e) => setNatalLagna(Number(e.target.value))}
                  style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid rgba(156, 122, 47, 0.25)", outline: "none" }}
                >
                  {Array.from({ length: 12 }, (_, idx) => (
                    <option key={idx + 1} value={idx + 1}>{idx + 1} - {RASHI_LARDS[idx + 1]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: 500 }}>Varṣa Lagna:</label>
                <select
                  value={varsaLagna}
                  onChange={(e) => setVarsaLagna(Number(e.target.value))}
                  style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid rgba(156, 122, 47, 0.25)", outline: "none" }}
                >
                  {Array.from({ length: 12 }, (_, idx) => (
                    <option key={idx + 1} value={idx + 1}>{idx + 1} - {RASHI_LARDS[idx + 1]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Muntha House Scrubber */}
            <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
              <label style={{ fontWeight: 500 }}>Munthā House placement:</label>
              <select
                value={munthaHouse}
                onChange={(e) => setMunthaHouse(Number(e.target.value))}
                style={{ padding: "6px", borderRadius: "6px", border: "1px solid rgba(156, 122, 47, 0.25)", outline: "none" }}
              >
                {Array.from({ length: 12 }, (_, idx) => (
                  <option key={idx + 1} value={idx + 1}>House {idx + 1}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Planet Tray Selector (Active Placement Planet) */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(156, 122, 47, 0.12)",
              borderRadius: "10px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              boxShadow: "0 2px 8px rgba(156,122,47,0.01)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <MousePointer size={15} />
              Click-to-Place Planet Tray:
            </div>
            <p style={{ fontSize: "12px", color: INK_MUTED, margin: 0 }}>
              Select a planet below, then click any house on the chart to reposition it instantly.
            </p>
            <div style={{ display: "flex", gap: "6px" }}>
              {(["Sun", "Moon", "Mars", "Venus"] as ActivePlanetType[]).map((p) => {
                const isSelected = p === activePlacementPlanet;
                return (
                  <button
                    key={p}
                    onClick={() => setActivePlacementPlanet(p)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: "6px",
                      background: isSelected ? GOLD_DEEP : "rgba(156, 122, 47, 0.05)",
                      color: isSelected ? "#ffffff" : INK_SECONDARY,
                      border: `1.5px solid ${isSelected ? GOLD_DEEP : "rgba(156, 122, 47, 0.12)"}`,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "12px",
                      transition: "all 150ms ease"
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Clickable North Indian SVG Chart */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.16)",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 4px 16px rgba(156, 122, 47, 0.03)"
          }}
        >
          <span style={{ fontSize: "12.5px", fontWeight: 700, color: GOLD_DEEP, alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "6px" }}>
            <Compass size={16} />
            Clickable Chart (Lagna center H1)
          </span>

          <svg width="220" height="220" viewBox="0 0 200 200">
            <rect x="0" y="0" width="200" height="200" fill="none" stroke="rgba(156, 122, 47, 0.3)" strokeWidth="1.5" rx="4" />
            
            {(Object.keys(HOUSE_PATHS) as Array<unknown> as number[]).map((h) => {
              const isLagna = h === 1;
              const isMuntha = h === munthaHouse;
              const pathStr = HOUSE_PATHS[h as keyof typeof HOUSE_PATHS];
              const pos = HOUSE_LABEL_POS[h as keyof typeof HOUSE_LABEL_POS];
              const centroid = HOUSE_CENTROIDS[h as keyof typeof HOUSE_CENTROIDS];
              const currentRashi = (varsaLagna + h - 2) % 12 + 1;

              // Find planets in this house
              const planets: string[] = [];
              if (sunHouse === h) planets.push("Sun");
              if (moonHouse === h) planets.push("Moon");
              if (marsHouse === h) planets.push("Mars");
              if (venusHouse === h) planets.push("Venus");
              if (jupiterHouse === h) planets.push("Jupiter");
              
              const planetAbbrs = Array.from(new Set(planets)).map(p => PLANET_SYMBOLS[p] || p.substring(0,2));
              
              let fillColor = "none";
              let strokeCol = "rgba(156, 122, 47, 0.2)";
              let strokeW = "1";

              // Highlight if Varṣeśa planet is in this house
              const isVarshesaPlanetInHouse = planets.includes(varshesa);

              if (isVarshesaPlanetInHouse) {
                fillColor = "rgba(156, 122, 47, 0.08)";
                strokeCol = GOLD;
                strokeW = "2";
              } else if (isLagna) {
                fillColor = "rgba(47, 125, 85, 0.03)";
              }

              return (
                <g key={h} onClick={() => handleHouseClick(h)} style={{ cursor: "pointer" }}>
                  <path
                     d={pathStr}
                     fill={fillColor}
                     stroke={strokeCol}
                     strokeWidth={strokeW}
                     style={{ transition: "all 200ms ease" }}
                  />
                  {/* Rashi Sign Index */}
                  <text
                    x={centroid.x}
                    y={centroid.y - 7}
                    fill={isVarshesaPlanetInHouse ? GOLD_DEEP : INK_MUTED}
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {currentRashi}
                  </text>
                  {/* House Label */}
                  <text
                    x={pos.x}
                    y={pos.y}
                    fill="rgba(77, 65, 51, 0.4)"
                    fontSize="6.5"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {`H${h}`}
                  </text>
                  {/* Planets / Muntha markers */}
                  <text
                    x={centroid.x}
                    y={centroid.y + 7}
                    fill={isVarshesaPlanetInHouse ? GOLD_DEEP : INK_PRIMARY}
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {isMuntha ? "Mun" : ""} {planetAbbrs.join(" ")}
                  </text>
                </g>
              );
            })}

            {/* Glowing Aspect Rays */}
            {scoredDistinctCandidates.map((cand, idx) => {
              if (!cand.aspectsLagna || cand.house === 1) return null;
              const start = ASPECT_LINE_COORDS[cand.house];
              if (!start) return null;
              return (
                <line
                  key={idx}
                  x1={start.x}
                  y1={start.y}
                  x2={100}
                  y2={50}
                  stroke={GOLD}
                  strokeWidth="1.8"
                  className="aspect-flow-line"
                  opacity="0.8"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Pańcādhikāri Pool & Qualifications */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "10px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          boxShadow: "0 2px 8px rgba(156,122,47,0.01)"
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          1. Pańcādhikāri Candidate Qualification Pool:
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
          {candidatesList.map((cand, idx) => {
            const aspectQualified = ASPECT_HOUSES.includes(cand.house);
            return (
              <div
                key={idx}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  background: "rgba(156, 122, 47, 0.02)",
                  border: `1.5px solid ${aspectQualified ? GREEN : "rgba(162, 58, 30, 0.15)"}`,
                  fontSize: "12px"
                }}
              >
                <div style={{ fontWeight: 700, color: INK_MUTED, fontSize: "11px" }}>{cand.office}</div>
                <div style={{ color: GOLD_DEEP, fontWeight: 700, fontSize: "13.5px", margin: "3px 0" }}>
                  {cand.planet} (House {cand.house})
                </div>
                <div style={{ fontSize: "11px", color: aspectQualified ? GREEN : RED, fontWeight: 700 }}>
                  {aspectQualified ? "✓ Aspects Lagna" : "✗ No Aspect"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pańcavargīya-bala Scorecard */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "10px",
          padding: "16px",
          boxShadow: "0 2px 8px rgba(156,122,47,0.01)"
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", display: "block", marginBottom: "10px", letterSpacing: "0.05em" }}>
          2. Pańcavargīya-bala 5-Fold Strength Scorecard:
        </span>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(156, 122, 47, 0.15)", color: GOLD_DEEP }}>
                <th style={{ padding: "8px" }}>Candidate Planet</th>
                <th style={{ padding: "8px" }}>House</th>
                <th style={{ padding: "8px" }}>Kṣetra (Sign)</th>
                <th style={{ padding: "8px" }}>Uccha (Exalt)</th>
                <th style={{ padding: "8px" }}>Hadda (Term)</th>
                <th style={{ padding: "8px" }}>Drekkāṇa (Decan)</th>
                <th style={{ padding: "8px" }}>Navāṁśa</th>
                <th style={{ padding: "8px", fontWeight: "bold" }}>Total Score</th>
                <th style={{ padding: "8px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {scoredDistinctCandidates.map((cand, idx) => {
                const isWinner = cand.planet === varshesa;
                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: "1px solid rgba(156, 122, 47, 0.08)",
                      background: isWinner ? "rgba(156, 122, 47, 0.04)" : "none",
                      fontWeight: isWinner ? "bold" : "normal"
                    }}
                  >
                    <td style={{ padding: "10px 8px" }}>{cand.planet}</td>
                    <td style={{ padding: "10px 8px" }}>H{cand.house}</td>
                    <td style={{ padding: "10px 8px" }}>{cand.ksetra}</td>
                    <td style={{ padding: "10px 8px" }}>{cand.uccha}</td>
                    <td style={{ padding: "10px 8px" }}>{cand.hadda}</td>
                    <td style={{ padding: "10px 8px" }}>{cand.drekkana}</td>
                    <td style={{ padding: "10px 8px" }}>{cand.navamsa}</td>
                    <td style={{ padding: "10px 8px", color: GOLD_DEEP, fontWeight: "bold" }}>{cand.total}</td>
                    <td style={{ padding: "10px 8px" }}>
                      {isWinner ? (
                        <span style={{ color: GOLD_DEEP, fontSize: "11px", fontWeight: "bold" }}>★ YEAR LORD</span>
                      ) : cand.aspectsLagna ? (
                        <span style={{ color: GREEN, fontSize: "11px" }}>Qualified</span>
                      ) : (
                        <span style={{ color: RED, fontSize: "11px" }}>Disqualified</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Box */}
      <div
        style={{
          background: "rgba(156, 122, 47, 0.08)",
          border: `1px solid ${GOLD}`,
          borderRadius: "10px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          boxShadow: "0 2px 12px rgba(156, 122, 47, 0.04)"
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
          Selected Year-Lord (Varṣeśa):
        </span>
        <h4 style={{ fontSize: "19px", fontWeight: 700, color: GOLD_DEEP, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          <Award size={20} />
          {varshesa} is the Varṣeśa!
        </h4>
        <p style={{ fontSize: "13px", margin: 0, color: INK_SECONDARY, lineHeight: "1.45" }}>
          <strong>Rule Selection Verdict:</strong> {selectionReason}
        </p>
      </div>

      {/* M19 Counseling Dojo Drill */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "12px",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxShadow: "0 4px 16px rgba(156, 122, 47, 0.02)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Layers size={18} color={GOLD} />
          <div>
            <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "15px" }}>M19 Counseling Dojo Drill</span>
            <p style={{ fontSize: "12px", color: INK_MUTED, margin: 0 }}>
              Practice the counseling reframe when the client presents fear of a difficult Year Lord placement.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "rgba(156, 122, 47, 0.04)",
            borderLeft: `4px solid ${GOLD}`,
            padding: "12px 14px",
            fontSize: "13.5px",
            lineHeight: "1.5",
            fontStyle: "italic",
            color: INK_SECONDARY,
            borderRadius: "0 8px 8px 0"
          }}
        >
          <strong>Client:</strong> "{DOJO_QUESTION.clientQuery}"
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {DOJO_QUESTION.options.map((opt, idx) => {
            const isSelected = dojoChoice === idx;
            const borderCol = isSelected ? (opt.isCorrect ? GREEN : RED) : "rgba(156, 122, 47, 0.15)";
            const bgCol = isSelected ? (opt.isCorrect ? "rgba(47, 125, 85, 0.04)" : "rgba(162, 58, 30, 0.04)") : "#ffffff";

            return (
              <button
                key={idx}
                onClick={() => handleDojoAnswer(idx, opt.isCorrect, opt.feedback)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: bgCol,
                  border: `1px solid ${borderCol}`,
                  cursor: "pointer",
                  fontSize: "13px",
                  color: INK_SECONDARY,
                  lineHeight: "1.5",
                  transition: "all 150ms ease",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.01)"
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: `1.5px solid ${isSelected ? (opt.isCorrect ? GREEN : RED) : INK_MUTED}`,
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: isSelected ? (opt.isCorrect ? GREEN : RED) : INK_MUTED,
                    flexShrink: 0,
                    marginTop: "2px"
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {dojoChoice !== null && (
          <div
            style={{
              background: DOJO_QUESTION.options[dojoChoice].isCorrect ? "rgba(47, 125, 85, 0.08)" : "rgba(162, 58, 30, 0.08)",
              border: `1px solid ${DOJO_QUESTION.options[dojoChoice].isCorrect ? GREEN : RED}`,
              color: DOJO_QUESTION.options[dojoChoice].isCorrect ? GREEN : RED,
              borderRadius: "8px",
              padding: "12px 14px",
              fontSize: "13px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            {DOJO_QUESTION.options[dojoChoice].isCorrect ? (
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            ) : (
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            )}
            <span>{dojoFeedback}</span>
          </div>
        )}
      </div>
    </div>
  );
}
