"use client";

import { useState, useMemo } from "react";
import { NAKSHATRAS } from "../nakshatra-data";
import { RASHIS } from "../rashi-data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const INDIGO = "#4F6FA8";

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
    return currentPlanets.find((p) => p.name === selectedDispositorPlanet);
  }, [currentPlanets, selectedDispositorPlanet]);

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
    <div className="gl-surface-twilight-glass" style={{ padding: "28px 24px", color: INK_PRIMARY, minHeight: "650px" }} data-interactive="significator-hierarchy-explorer">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1.2rem", marginBottom: "1.8rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 6 · Lesson 1</span>
        <h1 style={{ margin: "0.3rem 0 0", color: GOLD, fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Significator Hierarchy Explorer</h1>
        <p style={{ margin: "0.4rem 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.5" }}>
          Analyze the strongest-to-weakest 4-level sorting shelf. Test how empty houses and de-duplication rules are resolved under star-lord primacy.
        </p>
      </section>

      {/* Preset & Custom Mode Controls */}
      <section style={{ marginBottom: "1.8rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
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
                fontWeight: 600,
                cursor: customMode ? "not-allowed" : "pointer"
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.8rem" }}>
          <button
            onClick={() => {
              setCustomMode(!customMode);
              resetPractice();
            }}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "6px",
              border: `1px solid ${GOLD}`,
              background: customMode ? GOLD : "transparent",
              color: customMode ? "#FFF" : GOLD,
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {customMode ? "Use Presets Mode" : "Switch to Custom Simulation"}
          </button>

          <button
            onClick={() => setPracticeMode(!practiceMode)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "6px",
              border: `1px solid ${INDIGO}`,
              background: practiceMode ? INDIGO : "transparent",
              color: practiceMode ? "#FFF" : INDIGO,
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {practiceMode ? "Exit Practice Mode" : "Practice Mode Quiz"}
          </button>
        </div>
      </section>

      {/* Custom Control Dashboard */}
      {customMode && (
        <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "8px", padding: "16px 20px", marginBottom: "1.8rem" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>Custom Simulation Settings</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>
              House of Interest
              <select
                value={houseOfInterest}
                onChange={(e) => setHouseOfInterest(Number(e.target.value))}
                style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2" }}
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
                style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2" }}
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

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem", marginBottom: "2.4rem" }}>
        
        {/* Left Side: Unsorted Planet Pool or Custom Interactive Positioning */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "13px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>
                {practiceMode ? "Practice Pool: Select & Assign" : "Planet Coordinate Registry"}
              </h3>
              {practiceMode && (
                <button
                  onClick={resetPractice}
                  style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", border: `1px solid ${HAIRLINE}`, cursor: "pointer", background: "transparent", color: INK_SECONDARY }}
                >
                  Reset Progress
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
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
                      border: `1px solid ${isSelected ? GOLD : HAIRLINE}`,
                      background: isSelected ? `${GOLD}10` : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.2s"
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 800, color: INK_PRIMARY, marginRight: "8px" }}>{p.name}</span>
                      <span style={{ fontSize: "11px", color: INK_SECONDARY }}>
                        in House {p.house} · Star: {p.nak} ({p.starLord})
                      </span>
                    </div>

                    {customMode && !practiceMode && (
                      <div style={{ display: "flex", gap: "0.4rem" }} onClick={(e) => e.stopPropagation()}>
                        <select
                          value={p.house}
                          onChange={(e) => changePlanetHouse(p.name, Number(e.target.value))}
                          style={{ fontSize: "10px", padding: "2px", borderRadius: "4px", background: "#FFF" }}
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>H{i + 1}</option>
                          ))}
                        </select>

                        <select
                          value={p.starLord}
                          onChange={(e) => changePlanetStarLord(p.name, e.target.value)}
                          style={{ fontSize: "10px", padding: "2px", borderRadius: "4px", background: "#FFF" }}
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
                          background: isCorrect ? "#D4EDDA" : "#F8D7DA",
                          color: isCorrect ? "#155724" : "#721C24"
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

          {/* Premium Upgrade: Visual Stellar Dispositor Tree */}
          {!practiceMode && selectedPlanetInfo && (
            <div style={{ background: SURFACE, border: `1px solid ${GOLD}`, borderRadius: "10px", padding: "20px" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 900, textTransform: "uppercase" }}>
                Stellar Dispositor Path: {selectedPlanetInfo.name}
              </h3>
              
              {/* SVG Tree Diagram */}
              <svg width="100%" height="70" viewBox="0 0 340 70" style={{ background: "#FFFBF2", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, marginBottom: "12px" }}>
                {/* Nodes */}
                {/* Planet Node */}
                <rect x="15" y="15" width="75" height="40" rx="4" fill={GOLD} />
                <text x="52" y="38" textAnchor="middle" fill="#FFF" style={{ fontSize: "11px", fontWeight: 800 }}>{selectedPlanetInfo.name}</text>
                
                {/* Arrow 1 */}
                <path d="M 90,35 L 115,35" stroke={GOLD} strokeWidth="2" fill="none" />
                <polygon points="115,35 110,31 110,39" fill={GOLD} />
                <text x="102" y="28" textAnchor="middle" fill={GOLD} style={{ fontSize: "8px", fontWeight: 800 }}>Star</text>

                {/* Star Lord Node */}
                <rect x="120" y="15" width="80" height="40" rx="4" fill="transparent" stroke={GOLD} strokeWidth="2" />
                <text x="160" y="38" textAnchor="middle" fill={GOLD} style={{ fontSize: "11px", fontWeight: 800 }}>{selectedPlanetInfo.starLord}</text>

                {/* Arrow 2 */}
                <path d="M 200,35 L 225,35" stroke={GOLD} strokeWidth="2" fill="none" />
                <polygon points="225,35 220,31 220,39" fill={GOLD} />
                <text x="212" y="28" textAnchor="middle" fill={GOLD} style={{ fontSize: "8px", fontWeight: 800 }}>rules</text>

                {/* Target Level Node */}
                <rect x="230" y="15" width="95" height="40" rx="4" fill={INDIGO} />
                <text x="277" y="38" textAnchor="middle" fill="#FFF" style={{ fontSize: "10px", fontWeight: 800 }}>
                  {occupants.includes(selectedPlanetInfo.starLord) ? "Lvl 1 (Star-Occupant)" : selectedPlanetInfo.starLord === currentCuspLord ? "Lvl 3 (Star-Owner)" : "Indirect / Residual"}
                </text>
              </svg>

              <p style={{ margin: 0, fontSize: "12px", color: INK_PRIMARY, lineHeight: "1.5", fontStyle: "italic" }}>
                {dispositorExplanation}
              </p>
            </div>
          )}

        </div>

        {/* Right Side: The 4-Level Sorting Shelf */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "13px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>
              The 4-Level Significator Hierarchy
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              
              {/* Level 1 Slot */}
              <div style={{ border: `1px dashed ${GOLD}`, borderRadius: "8px", padding: "12px", background: "#FFFBF2" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 900, color: GOLD }}>Level 1 (Star of Occupants) - Strongest</span>
                  {practiceMode && selectedPracticePlanet && (
                    <button
                      onClick={() => handlePracticeAssign(1)}
                      style={{ fontSize: "10px", padding: "2px 8px", background: GOLD, color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Place Here
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", minHeight: "28px", alignItems: "center" }}>
                  {practiceMode ? (
                    Object.entries(userAnswers).filter(([_, lvl]) => lvl === 1).map(([pName]) => (
                      <span key={pName} style={{ padding: "4px 8px", background: `${GOLD}15`, borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>
                        {pName}
                      </span>
                    ))
                  ) : (
                    hierarchyLevels.lvl1.length > 0 ? (
                      hierarchyLevels.lvl1.map((p) => (
                        <span key={p} style={{ padding: "4px 8px", background: `${GOLD}15`, borderRadius: "4px", fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>
                          {p}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: "11px", color: "#A08060", fontStyle: "italic" }}>Empty Slot</span>
                    )
                  )}
                </div>
              </div>

              {/* Level 2 Slot */}
              <div style={{ border: `1px dashed ${GOLD}`, borderRadius: "8px", padding: "12px", background: "#FFFBF2" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 900, color: GOLD }}>Level 2 (Occupants themselves)</span>
                  {practiceMode && selectedPracticePlanet && (
                    <button
                      onClick={() => handlePracticeAssign(2)}
                      style={{ fontSize: "10px", padding: "2px 8px", background: GOLD, color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Place Here
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", minHeight: "28px", alignItems: "center" }}>
                  {practiceMode ? (
                    Object.entries(userAnswers).filter(([_, lvl]) => lvl === 2).map(([pName]) => (
                      <span key={pName} style={{ padding: "4px 8px", background: `${GOLD}15`, borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>
                        {pName}
                      </span>
                    ))
                  ) : (
                    hierarchyLevels.lvl2.length > 0 ? (
                      hierarchyLevels.lvl2.map((p) => (
                        <span key={p} style={{ padding: "4px 8px", background: `${GOLD}15`, borderRadius: "4px", fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>
                          {p}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: "11px", color: "#A08060", fontStyle: "italic" }}>Empty Slot</span>
                    )
                  )}
                </div>
              </div>

              {/* Level 3 Slot */}
              <div style={{ border: `1px dashed ${GOLD}`, borderRadius: "8px", padding: "12px", background: "#FFFBF2" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 900, color: GOLD }}>Level 3 (Star of Owner)</span>
                  {practiceMode && selectedPracticePlanet && (
                    <button
                      onClick={() => handlePracticeAssign(3)}
                      style={{ fontSize: "10px", padding: "2px 8px", background: GOLD, color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Place Here
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", minHeight: "28px", alignItems: "center" }}>
                  {practiceMode ? (
                    Object.entries(userAnswers).filter(([_, lvl]) => lvl === 3).map(([pName]) => (
                      <span key={pName} style={{ padding: "4px 8px", background: `${GOLD}15`, borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>
                        {pName}
                      </span>
                    ))
                  ) : (
                    hierarchyLevels.lvl3.length > 0 ? (
                      hierarchyLevels.lvl3.map((p) => (
                        <span key={p} style={{ padding: "4px 8px", background: `${GOLD}15`, borderRadius: "4px", fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>
                          {p}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: "11px", color: "#A08060", fontStyle: "italic" }}>Empty Slot</span>
                    )
                  )}
                </div>
              </div>

              {/* Level 4 Slot */}
              <div style={{ border: `1px dashed ${GOLD}`, borderRadius: "8px", padding: "12px", background: "#FFFBF2" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 900, color: GOLD }}>Level 4 (Owner itself) - Weakest</span>
                  {practiceMode && selectedPracticePlanet && (
                    <button
                      onClick={() => handlePracticeAssign(4)}
                      style={{ fontSize: "10px", padding: "2px 8px", background: GOLD, color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Place Here
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", minHeight: "28px", alignItems: "center" }}>
                  {practiceMode ? (
                    Object.entries(userAnswers).filter(([_, lvl]) => lvl === 4).map(([pName]) => (
                      <span key={pName} style={{ padding: "4px 8px", background: `${GOLD}15`, borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>
                        {pName}
                      </span>
                    ))
                  ) : (
                    hierarchyLevels.lvl4.length > 0 ? (
                      hierarchyLevels.lvl4.map((p) => (
                        <span key={p} style={{ padding: "4px 8px", background: `${GOLD}15`, borderRadius: "4px", fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>
                          {p}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: "11px", color: "#A08060", fontStyle: "italic" }}>Empty Slot</span>
                    )
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* De-duplicated Ranked Output Box */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "13px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>
              Resolved, De-duplicated Ranked Chain
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {deDuplicatedRanked.map((item, idx) => (
                <div key={item.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", background: `${GOLD}04` }}>
                  <div>
                    <span style={{ fontWeight: 800, color: GOLD, marginRight: "8px" }}>#{idx + 1}</span>
                    <span style={{ fontWeight: 700, color: INK_PRIMARY }}>{item.name}</span>
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

      {/* Styled Calculation parameters Table instead of VIX console */}
      <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Astronomical Parameters Table</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
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

    </div>
  );
}
