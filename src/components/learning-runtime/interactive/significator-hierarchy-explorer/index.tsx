"use client";

import { useState, useMemo } from "react";
import { NAKSHATRAS } from "../nakshatra-data";
import { RASHIS } from "../rashi-data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const INDIGO = "#4F6FA8";
const GREEN = "#2F7D55";
const RED = "#A23A1E";

interface PlanetInfo {
  name: string;
  house: number; // 1-indexed house
  nak: string;
  starLord: string;
}

interface Preset {
  name: string;
  houseOfInterest: number;
  cuspSign: string;
  cuspLord: string;
  planets: PlanetInfo[];
}

const PRESETS: Preset[] = [
  {
    name: "Worked 7th House (Libra Cusp, Saturn Occupies)",
    houseOfInterest: 7,
    cuspSign: "Libra",
    cuspLord: "Venus",
    planets: [
      { name: "Saturn", house: 7, nak: "Puṣya", starLord: "Saturn" },
      { name: "Venus", house: 9, nak: "Anurādhā", starLord: "Saturn" },
      { name: "Moon", house: 5, nak: "Uttara-bhādrapadā", starLord: "Saturn" },
      { name: "Mars", house: 2, nak: "Bharaṇī", starLord: "Venus" },
      { name: "Sun", house: 10, nak: "Maghā", starLord: "Ketu" },
      { name: "Mercury", house: 11, nak: "Jyeṣṭhā", starLord: "Mercury" },
      { name: "Jupiter", house: 4, nak: "Rohiṇī", starLord: "Moon" },
      { name: "Rahu", house: 12, nak: "Ardrā", starLord: "Rahu" },
      { name: "Ketu", house: 6, nak: "Mūla", starLord: "Ketu" }
    ]
  },
  {
    name: "Worked 10th House (Cancer Cusp, Empty House)",
    houseOfInterest: 10,
    cuspSign: "Cancer",
    cuspLord: "Moon",
    planets: [
      { name: "Saturn", house: 2, nak: "Puṣya", starLord: "Saturn" },
      { name: "Moon", house: 8, nak: "Anurādhā", starLord: "Saturn" },
      { name: "Venus", house: 3, nak: "Uttara-bhādrapadā", starLord: "Saturn" },
      { name: "Mars", house: 12, nak: "Bharaṇī", starLord: "Venus" },
      { name: "Sun", house: 5, nak: "Maghā", starLord: "Ketu" },
      { name: "Mercury", house: 4, nak: "Jyeṣṭhā", starLord: "Mercury" },
      { name: "Jupiter", house: 11, nak: "Rohiṇī", starLord: "Moon" },
      { name: "Rahu", house: 1, nak: "Ardrā", starLord: "Rahu" },
      { name: "Ketu", house: 7, nak: "Mūla", starLord: "Ketu" }
    ]
  }
];

export function SignificatorHierarchyExplorer() {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const activePreset = PRESETS[selectedPresetIdx];

  // Custom simulation states
  const [customMode, setCustomMode] = useState(false);
  const [houseOfInterest, setHouseOfInterest] = useState(7);
  const [cuspSign, setCuspSign] = useState("Libra");
  const [cuspLord, setCuspLord] = useState("Venus");
  const [planets, setPlanets] = useState<PlanetInfo[]>(PRESETS[0].planets);

  // Dispositor selection
  const [selectedDispositorPlanet, setSelectedDispositorPlanet] = useState<string | null>("Venus");

  // Practice Mode states
  const [practiceMode, setPracticeMode] = useState(false);
  const [selectedPracticePlanet, setSelectedPracticePlanet] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({}); // Planet -> User-assigned Level (1-4)
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({}); // Planet -> Is Correct

  const currentHouse = customMode ? houseOfInterest : activePreset.houseOfInterest;
  const currentCuspSign = customMode ? cuspSign : activePreset.cuspSign;
  const currentCuspLord = customMode ? cuspLord : activePreset.cuspLord;
  const currentPlanets = customMode ? planets : activePreset.planets;

  const occupants = useMemo(() => {
    return currentPlanets.filter((p) => p.house === currentHouse).map((p) => p.name);
  }, [currentPlanets, currentHouse]);

  // Compute standard 4 levels of significator hierarchy
  const hierarchyLevels = useMemo(() => {
    // Level 1: Planets in star of occupants
    const lvl1 = currentPlanets
      .filter((p) => occupants.includes(p.starLord))
      .map((p) => p.name);

    // Level 2: Occupants themselves
    const lvl2 = [...occupants];

    // Level 3: Planets in star of owner
    const lvl3 = currentPlanets
      .filter((p) => p.starLord === currentCuspLord)
      .map((p) => p.name);

    // Level 4: Owner itself
    const lvl4 = [currentCuspLord];

    return { lvl1, lvl2, lvl3, lvl4 };
  }, [currentPlanets, occupants, currentCuspLord]);

  // De-duplicated ranked list
  const deDuplicatedRanked = useMemo(() => {
    const list: { name: string; strongestLvl: number; allLvls: number[] }[] = [];
    const planetMap: Record<string, number[]> = {};

    currentPlanets.forEach((p) => {
      const q: number[] = [];
      if (hierarchyLevels.lvl1.includes(p.name)) q.push(1);
      if (hierarchyLevels.lvl2.includes(p.name)) q.push(2);
      if (hierarchyLevels.lvl3.includes(p.name)) q.push(3);
      if (hierarchyLevels.lvl4.includes(p.name)) q.push(4);

      if (q.length > 0) {
        planetMap[p.name] = q;
      }
    });

    Object.entries(planetMap).forEach(([name, lvls]) => {
      const strongest = Math.min(...lvls);
      list.push({
        name,
        strongestLvl: strongest,
        allLvls: lvls
      });
    });

    return list.sort((a, b) => a.strongestLvl - b.strongestLvl);
  }, [currentPlanets, hierarchyLevels]);

  const handlePracticeAssign = (level: number) => {
    if (!selectedPracticePlanet) return;
    setUserAnswers((prev) => ({ ...prev, [selectedPracticePlanet]: level }));

    let isCorrect = false;
    if (level === 1 && hierarchyLevels.lvl1.includes(selectedPracticePlanet)) isCorrect = true;
    else if (level === 2 && hierarchyLevels.lvl2.includes(selectedPracticePlanet)) isCorrect = true;
    else if (level === 3 && hierarchyLevels.lvl3.includes(selectedPracticePlanet)) isCorrect = true;
    else if (level === 4 && hierarchyLevels.lvl4.includes(selectedPracticePlanet)) isCorrect = true;
    
    setCheckedAnswers((prev) => ({ ...prev, [selectedPracticePlanet]: isCorrect }));
  };

  const resetPractice = () => {
    setUserAnswers({});
    setCheckedAnswers({});
    setSelectedPracticePlanet(null);
  };

  const changePlanetHouse = (planetName: string, newHouse: number) => {
    setPlanets((prev) =>
      prev.map((p) => (p.name === planetName ? { ...p, house: newHouse } : p))
    );
  };

  const changePlanetStarLord = (planetName: string, newLord: string) => {
    setPlanets((prev) =>
      prev.map((p) => (p.name === planetName ? { ...p, starLord: newLord } : p))
    );
  };

  const selectedPlanetInfo = useMemo(() => {
    return currentPlanets.find((p) => p.name === (practiceMode ? selectedPracticePlanet : selectedDispositorPlanet));
  }, [currentPlanets, selectedDispositorPlanet, selectedPracticePlanet, practiceMode]);

  // Check which tiers the selected planet qualifies for
  const activeQualifications = useMemo(() => {
    if (!selectedPlanetInfo) return [];
    const name = selectedPlanetInfo.name;
    const quals = [];
    if (hierarchyLevels.lvl1.includes(name)) quals.push(1);
    if (hierarchyLevels.lvl2.includes(name)) quals.push(2);
    if (hierarchyLevels.lvl3.includes(name)) quals.push(3);
    if (hierarchyLevels.lvl4.includes(name)) quals.push(4);
    return quals;
  }, [selectedPlanetInfo, hierarchyLevels]);

  // Compute text explanation for dispositor path
  const dispositorExplanation = useMemo(() => {
    if (!selectedPlanetInfo) return "";
    const p = selectedPlanetInfo;
    const starRuler = p.starLord;
    
    let text = `${p.name} resides in the nakṣatra ${p.nak}, which is ruled by its Star-Lord ${starRuler}. `;
    const isStarOccupant = occupants.includes(starRuler);
    const isStarOwner = starRuler === currentCuspLord;

    if (isStarOccupant) {
      text += `Since the Star-Lord (${starRuler}) is an occupant of House ${currentHouse}, ${p.name} qualifies at the strongest Level 1 (Star of Occupant). Under star-lord primacy, the planet acts as a proxy for its star-lord's placement.`;
    } else if (occupants.includes(p.name)) {
      text += `Since ${p.name} resides physically in House ${currentHouse}, it qualifies at Level 2 (Occupant).`;
    } else if (isStarOwner) {
      text += `Since the Star-Lord (${starRuler}) rules House ${currentHouse} (${currentCuspSign}), ${p.name} qualifies at Level 3 (Star of Owner) by star-lord association.`;
    } else if (p.name === currentCuspLord) {
      text += `Since ${p.name} owns the zodiac sign ${currentCuspSign} on the cusp, it qualifies at Level 4 (Owner). This is the weakest, most indirect tie.`;
    } else {
      text += `This planet does not currently signify House ${currentHouse} directly through the 4-level hierarchy.`;
    }

    return text;
  }, [selectedPlanetInfo, occupants, currentHouse, currentCuspLord, currentCuspSign]);

  return (
    <div style={{ color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif" }} data-interactive="significator-hierarchy-explorer">
      
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", marginBottom: "1rem", boxShadow: "0 4px 20px -2px rgba(47, 125, 85, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GREEN, fontWeight: 900, background: `${GREEN}15`, padding: "2px 8px", borderRadius: "4px" }}>Sorting Shelf Dojo</span>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD, fontWeight: 900, background: `${GOLD}15`, padding: "2px 8px", borderRadius: "4px" }}>Chapter 6, Lesson 1</span>
        </div>
        <h2 style={{ margin: "0.4rem 0 0.2rem", color: GOLD, fontSize: "1.45rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
          Significator Hierarchy Explorer
        </h2>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "13px", lineHeight: 1.55 }}>
          Analyze the strongest-to-weakest 4-level sorting shelf. Test how empty houses and de-duplication rules are resolved under star-lord primacy.
        </p>
      </section>

      {/* Preset & Custom Mode Controls */}
      <section style={{ marginBottom: "1.25rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, color: INK_SECONDARY, textTransform: "uppercase" }}>Worked Presets:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              disabled={customMode}
              onClick={() => {
                setSelectedPresetIdx(idx);
                resetPractice();
              }}
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                border: `1px solid ${HAIRLINE}`,
                background: !customMode && selectedPresetIdx === idx ? `${GOLD}20` : "transparent",
                color: GOLD,
                fontSize: "12px",
                fontWeight: 700,
                cursor: customMode ? "not-allowed" : "pointer"
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              setCustomMode(!customMode);
              resetPractice();
            }}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "6px",
              border: `1.5px solid ${GOLD}`,
              background: customMode ? GOLD : "transparent",
              color: customMode ? "#FFF" : GOLD,
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {customMode ? "Presets Mode" : "Custom Simulation"}
          </button>

          <button
            onClick={() => setPracticeMode(!practiceMode)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "6px",
              border: `1.5px solid ${INDIGO}`,
              background: practiceMode ? INDIGO : "transparent",
              color: practiceMode ? "#FFF" : INDIGO,
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {practiceMode ? "Exit Quiz" : "Practice Quiz"}
          </button>
        </div>
      </section>

      {/* Custom Control Dashboard */}
      {customMode && (
        <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "12px", padding: "1.25rem", marginBottom: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>Custom Simulation Settings</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>
              House of Interest
              <select
                value={houseOfInterest}
                onChange={(e) => setHouseOfInterest(Number(e.target.value))}
                style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>House {i + 1}</option>
                ))}
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>
              Cusp Sign Name
              <select
                value={cuspSign}
                onChange={(e) => {
                  setCuspSign(e.target.value);
                  const signIdx = RASHIS.findIndex((r) => r.nameIAST === e.target.value);
                  if (signIdx !== -1) setCuspLord(RASHIS[signIdx].lord);
                }}
                style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY }}
              >
                {RASHIS.map((r, i) => (
                  <option key={i} value={r.nameIAST}>{r.nameIAST}</option>
                ))}
              </select>
            </label>

            <div style={{ fontSize: "11px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Cusp Sign Lord (Auto)</span>
              <div style={{ padding: "8px 12px", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", background: `${GOLD}08`, fontWeight: 700, color: GOLD }}>
                {cuspLord}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Layout Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
        
        {/* Left Side: Planet Registry and Interactive Dispositor Path */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {practiceMode ? "Practice Pool: Select & Shelf-Sort" : "Planet Coordinate Registry"}
              </h3>
              {practiceMode && (
                <button
                  onClick={resetPractice}
                  style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", border: `1px solid ${HAIRLINE}`, cursor: "pointer", background: "transparent", color: INK_SECONDARY }}
                >
                  Reset Answers
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {currentPlanets.map((p) => {
                const isSelected = practiceMode ? selectedPracticePlanet === p.name : selectedDispositorPlanet === p.name;
                const hasAnswered = userAnswers[p.name] !== undefined;
                const isCorrect = checkedAnswers[p.name];

                return (
                  <div
                    key={p.name}
                    onClick={() => {
                      if (practiceMode) setSelectedPracticePlanet(p.name);
                      else setSelectedDispositorPlanet(p.name);
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: `1.5px solid ${isSelected ? GOLD : HAIRLINE}`,
                      background: isSelected ? `${GOLD}10` : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 150ms ease"
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 800, color: INK_PRIMARY, marginRight: "8px" }}>{p.name}</span>
                      <span style={{ fontSize: "11px", color: INK_SECONDARY }}>
                        in House {p.house} · Star-Lord: {p.starLord} ({p.nak})
                      </span>
                    </div>

                    {customMode && !practiceMode && (
                      <div style={{ display: "flex", gap: "0.4rem" }} onClick={(e) => e.stopPropagation()}>
                        <select
                          aria-label={`${p.name} House Selection`}
                          value={p.house}
                          onChange={(e) => changePlanetHouse(p.name, Number(e.target.value))}
                          style={{ fontSize: "10px", padding: "2px", borderRadius: "4px", background: SURFACE, color: INK_PRIMARY, border: `1px solid ${HAIRLINE}` }}
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>H{i + 1}</option>
                          ))}
                        </select>

                        <select
                          aria-label={`${p.name} Star Lord Selection`}
                          value={p.starLord}
                          onChange={(e) => changePlanetStarLord(p.name, e.target.value)}
                          style={{ fontSize: "10px", padding: "2px", borderRadius: "4px", background: SURFACE, color: INK_PRIMARY, border: `1px solid ${HAIRLINE}` }}
                        >
                          {["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map((l) => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {practiceMode && hasAnswered && (
                      <span
                        style={{
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "10px",
                          fontWeight: 800,
                          background: isCorrect ? `${GREEN}20` : `${RED}20`,
                          color: isCorrect ? GREEN : RED
                        }}
                      >
                        {isCorrect ? `Correct (Lvl ${userAnswers[p.name]})` : `Incorrect (Lvl ${userAnswers[p.name]})`}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Stellar Dispositor explanation */}
          {selectedPlanetInfo && (
            <div style={{ background: SURFACE, border: `1.5px solid ${GOLD}`, borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "13px", color: GOLD, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Stellar Dispositor Path: {selectedPlanetInfo.name}
              </h4>
              <p style={{ margin: 0, fontSize: "12.5px", color: INK_PRIMARY, lineHeight: "1.5", fontStyle: "italic" }}>
                {dispositorExplanation}
              </p>
            </div>
          )}

        </div>

        {/* Right Side: Redesigned interactive experience: The Significator Cascade Waterfall */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "12px", padding: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", width: "100%" }}>
              Significator Cascade Waterfall
            </h3>
            
            {/* SVG Cascade Funnel */}
            <svg width="100%" height="280" viewBox="0 0 320 280" style={{ overflow: "visible", borderRadius: 8, background: "rgba(0,0,0,0.01)", border: `1px solid ${HAIRLINE}40` }}>
              <defs>
                <filter id="funnelGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Waterfalls/Pipes from top source to shelves */}
              {selectedPlanetInfo && activeQualifications.map(tier => {
                let xEnd = 160;
                let yEnd = 0;
                if (tier === 1) { xEnd = 160; yEnd = 45; }
                else if (tier === 2) { xEnd = 160; yEnd = 105; }
                else if (tier === 3) { xEnd = 160; yEnd = 165; }
                else if (tier === 4) { xEnd = 160; yEnd = 225; }

                return (
                  <path
                    key={tier}
                    d={`M 160 5 C 160 20, ${xEnd} ${yEnd - 15}, ${xEnd} ${yEnd}`}
                    fill="none"
                    stroke={GOLD}
                    strokeWidth="3.5"
                    strokeDasharray="4 4"
                    strokeDashoffset="12"
                    filter="url(#funnelGlow)"
                    style={{ animation: "dash 1.5s linear infinite" }}
                  />
                );
              })}

              {/* Top Source Node representing the active selected planet */}
              <circle cx="160" cy="15" r="12" fill={selectedPlanetInfo ? GOLD : HAIRLINE} />
              <text x="160" y="15" textAnchor="middle" dominantBaseline="middle" fill="#FFF" fontSize="8" fontWeight="900">
                {selectedPlanetInfo ? selectedPlanetInfo.name.substring(0, 3) : "?"}
              </text>

              {/* TIER 1 Chamber (Star of Occupants) */}
              <g transform="translate(20, 45)">
                <rect
                  x="0"
                  y="0"
                  width="280"
                  height="45"
                  rx="6"
                  fill={activeQualifications.includes(1) ? `${GOLD}12` : SURFACE}
                  stroke={activeQualifications.includes(1) ? GOLD : HAIRLINE}
                  strokeWidth={activeQualifications.includes(1) ? 2 : 1}
                  filter={activeQualifications.includes(1) ? "url(#funnelGlow)" : undefined}
                />
                <text x="10" y="16" fontSize="9" fontWeight="800" fill={GOLD}>TIER 1 (Star of Occupant) — Strongest</text>
                <text x="10" y="32" fontSize="7.5" fill={INK_MUTED}>Proxy for occupants: {occupants.join(", ") || "None"}</text>
                
                {/* Render occupants/qualifying planets in Tier 1 */}
                <g transform="translate(190, 8)">
                  {hierarchyLevels.lvl1.map((p, i) => (
                    <g key={p} transform={`translate(${i * 24}, 12)`}>
                      <circle cx="0" cy="0" r="10" fill={GOLD} />
                      <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#FFF" fontSize="8" fontWeight="800">
                        {p.substring(0, 3)}
                      </text>
                    </g>
                  ))}
                </g>
              </g>

              {/* TIER 2 Chamber (Occupants) */}
              <g transform="translate(30, 105)">
                <rect
                  x="0"
                  y="0"
                  width="260"
                  height="45"
                  rx="6"
                  fill={activeQualifications.includes(2) ? `${GOLD}12` : SURFACE}
                  stroke={activeQualifications.includes(2) ? GOLD : HAIRLINE}
                  strokeWidth={activeQualifications.includes(2) ? 2 : 1}
                  filter={activeQualifications.includes(2) ? "url(#funnelGlow)" : undefined}
                />
                <text x="10" y="16" fontSize="9" fontWeight="800" fill={GOLD}>TIER 2 (Occupants themselves)</text>
                <text x="10" y="32" fontSize="7.5" fill={INK_MUTED}>Physical occupants of H{currentHouse}</text>
                
                {/* Render occupants/qualifying planets in Tier 2 */}
                <g transform="translate(170, 8)">
                  {hierarchyLevels.lvl2.map((p, i) => (
                    <g key={p} transform={`translate(${i * 24}, 12)`}>
                      <circle cx="0" cy="0" r="10" fill={GOLD} />
                      <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#FFF" fontSize="8" fontWeight="800">
                        {p.substring(0, 3)}
                      </text>
                    </g>
                  ))}
                </g>
              </g>

              {/* TIER 3 Chamber (Star of Owner) */}
              <g transform="translate(40, 165)">
                <rect
                  x="0"
                  y="0"
                  width="240"
                  height="45"
                  rx="6"
                  fill={activeQualifications.includes(3) ? `${GOLD}12` : SURFACE}
                  stroke={activeQualifications.includes(3) ? GOLD : HAIRLINE}
                  strokeWidth={activeQualifications.includes(3) ? 2 : 1}
                  filter={activeQualifications.includes(3) ? "url(#funnelGlow)" : undefined}
                />
                <text x="10" y="16" fontSize="9" fontWeight="800" fill={GOLD}>TIER 3 (Star of Owner)</text>
                <text x="10" y="32" fontSize="7.5" fill={INK_MUTED}>Proxy for Lord of Sign: {currentCuspLord}</text>
                
                {/* Render occupants/qualifying planets in Tier 3 */}
                <g transform="translate(150, 8)">
                  {hierarchyLevels.lvl3.map((p, i) => (
                    <g key={p} transform={`translate(${i * 24}, 12)`}>
                      <circle cx="0" cy="0" r="10" fill={GOLD} />
                      <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#FFF" fontSize="8" fontWeight="800">
                        {p.substring(0, 3)}
                      </text>
                    </g>
                  ))}
                </g>
              </g>

              {/* TIER 4 Chamber (Owner) */}
              <g transform="translate(50, 225)">
                <rect
                  x="0"
                  y="0"
                  width="220"
                  height="45"
                  rx="6"
                  fill={activeQualifications.includes(4) ? `${GOLD}12` : SURFACE}
                  stroke={activeQualifications.includes(4) ? GOLD : HAIRLINE}
                  strokeWidth={activeQualifications.includes(4) ? 2 : 1}
                  filter={activeQualifications.includes(4) ? "url(#funnelGlow)" : undefined}
                />
                <text x="10" y="16" fontSize="9" fontWeight="800" fill={GOLD}>TIER 4 (Owner itself) — Weakest</text>
                <text x="10" y="32" fontSize="7.5" fill={INK_MUTED}>Sign Lord Venus owning {currentCuspSign}</text>
                
                {/* Render occupants/qualifying planets in Tier 4 */}
                <g transform="translate(130, 8)">
                  {hierarchyLevels.lvl4.map((p, i) => (
                    <g key={p} transform={`translate(${i * 24}, 12)`}>
                      <circle cx="0" cy="0" r="10" fill={GOLD} />
                      <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#FFF" fontSize="8" fontWeight="800">
                        {p.substring(0, 3)}
                      </text>
                    </g>
                  ))}
                </g>
              </g>
            </svg>

            {/* Placement controls for quiz mode */}
            {practiceMode && selectedPracticePlanet && (
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "center", marginTop: "1rem" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", display: "block", width: "100%", textAlign: "center" }}>
                  Sort <strong>{selectedPracticePlanet}</strong> to level:
                </span>
                {[1, 2, 3, 4].map(l => (
                  <button
                    key={l}
                    onClick={() => handlePracticeAssign(l)}
                    style={{ padding: "4px 10px", borderRadius: "4px", background: GOLD, border: "none", color: "#FFF", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                  >
                    Level {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Resolved De-duplicated Ranked Chain */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Resolved, De-duplicated Ranked Chain
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {deDuplicatedRanked.map((item, idx) => (
                <div key={item.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", border: `1px solid ${HAIRLINE}`, borderRadius: "8px", background: `${GOLD}04` }}>
                  <div>
                    <span style={{ fontWeight: 850, color: GOLD, marginRight: "8px" }}>#{idx + 1}</span>
                    <span style={{ fontWeight: 750, color: INK_PRIMARY }}>{item.name}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: INK_SECONDARY }}>
                    Ranked at Level {item.strongestLvl} (Qualifies: {item.allLvls.map((l) => `L${l}`).join(", ")})
                  </div>
                </div>
              ))}
              {deDuplicatedRanked.length === 0 && (
                <span style={{ fontSize: "12px", fontStyle: "italic", color: INK_SECONDARY }}>No significators resolved yet.</span>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Styled Parametric Reference Table */}
      <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Astronomical Parameters Table</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", color: INK_SECONDARY }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}`, textAlign: "left", color: GOLD }}>
              <th style={{ padding: "8px" }}>Parameter</th>
              <th style={{ padding: "8px" }}>Value</th>
              <th style={{ padding: "8px" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}33` }}>
              <td style={{ padding: "8px", fontWeight: 700 }}>House of Interest</td>
              <td style={{ padding: "8px" }}>{currentHouse}</td>
              <td style={{ padding: "8px" }}>The cusp of judgment (marriage, career, etc.)</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}33` }}>
              <td style={{ padding: "8px", fontWeight: 700 }}>Cusp Zodiac Sign</td>
              <td style={{ padding: "8px" }}>{currentCuspSign}</td>
              <td style={{ padding: "8px" }}>Zodiac sign rising at the exact cusp longitude</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}33` }}>
              <td style={{ padding: "8px", fontWeight: 700 }}>Cusp Sign Lord (Owner)</td>
              <td style={{ padding: "8px" }}>{currentCuspLord}</td>
              <td style={{ padding: "8px" }}>The planet ruling the cusp sign</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}33` }}>
              <td style={{ padding: "8px", fontWeight: 700 }}>Occupants</td>
              <td style={{ padding: "8px" }}>{occupants.join(", ") || "None"}</td>
              <td style={{ padding: "8px" }}>Planets physically positioned inside the cusp boundaries</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", fontWeight: 700 }}>Ayanāṁśa Reference</td>
              <td style={{ padding: "8px" }}>Krishnamurti (KP) Ayanāṁśa</td>
              <td style={{ padding: "8px" }}>Epoch correction: 24° 03′ 52″</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Add SVG stroke dashoffset animation styles */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

    </div>
  );
}
