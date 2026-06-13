"use client";

import { useState, useMemo } from "react";
import { RASHIS } from "../rashi-data";

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
  houseOfInterest: number;
  cuspSign: string;
  cuspLord: string;
  cuspalSubLordName: string;
  rulingPlanetsList: string[];
  planets: PlanetInfo[];
}

const PRESETS: Preset[] = [
  {
    name: "Worked 7th House (Libra Cusp, Saturn Occupies)",
    houseOfInterest: 7,
    cuspSign: "Libra",
    cuspLord: "Venus",
    cuspalSubLordName: "Saturn",
    rulingPlanetsList: ["Venus", "Moon", "Saturn", "Jupiter"],
    planets: [
      { name: "Saturn", house: 7, sign: "Libra", nak: "Puṣya", starLord: "Saturn" },
      { name: "Venus", house: 9, sign: "Sagittarius", nak: "Anurādhā", starLord: "Saturn" },
      { name: "Moon", house: 5, sign: "Leo", nak: "Uttara-bhādrapadā", starLord: "Saturn" },
      { name: "Mars", house: 2, sign: "Scorpio", nak: "Bharaṇī", starLord: "Venus" },
      { name: "Sun", house: 10, sign: "Cancer", nak: "Maghā", starLord: "Ketu" },
      { name: "Mercury", house: 11, sign: "Leo", nak: "Jyeṣṭhā", starLord: "Mercury" },
      { name: "Jupiter", house: 4, sign: "Aries", nak: "Rohiṇī", starLord: "Moon" },
      { name: "Rahu", house: 12, sign: "Pisces", nak: "Ardrā", starLord: "Rahu" },
      { name: "Ketu", house: 6, sign: "Virgo", nak: "Mūla", starLord: "Ketu" }
    ]
  },
  {
    name: "Worked 10th House (Cancer Cusp, Empty House)",
    houseOfInterest: 10,
    cuspSign: "Cancer",
    cuspLord: "Moon",
    cuspalSubLordName: "Mercury",
    rulingPlanetsList: ["Moon", "Saturn", "Mercury", "Mars"],
    planets: [
      { name: "Saturn", house: 2, sign: "Leo", nak: "Puṣya", starLord: "Saturn" },
      { name: "Moon", house: 8, sign: "Virgo", nak: "Anurādhā", starLord: "Saturn" },
      { name: "Venus", house: 3, sign: "Libra", nak: "Uttara-bhādrapadā", starLord: "Saturn" },
      { name: "Mars", house: 12, sign: "Scorpio", nak: "Bharaṇī", starLord: "Venus" },
      { name: "Sun", house: 5, sign: "Sagittarius", nak: "Maghā", starLord: "Ketu" },
      { name: "Mercury", house: 4, sign: "Capricorn", nak: "Jyeṣṭhā", starLord: "Mercury" },
      { name: "Jupiter", house: 11, sign: "Aquarius", nak: "Rohiṇī", starLord: "Moon" },
      { name: "Rahu", house: 1, sign: "Aries", nak: "Ardrā", starLord: "Rahu" },
      { name: "Ketu", house: 7, sign: "Libra", nak: "Mūla", starLord: "Ketu" }
    ]
  }
];

export function SignificatorChainBuilder() {
  const [activePresetIdx, setActivePresetIdx] = useState(0);
  const activePreset = PRESETS[activePresetIdx];

  // Wizard active step: 1 (Input), 2 (Enumerate), 3 (Rank), 4 (Cross-Ref), 5 (Output)
  const [activeStep, setActiveStep] = useState(1);

  // User input states
  const [selectedHouse, setSelectedHouse] = useState(7);
  const [cuspSign, setCuspSign] = useState("Libra");
  const [cuspLord, setCuspLord] = useState("Venus");
  const [cuspalSubLord, setCuspalSubLord] = useState("Saturn");
  const [rulingPlanets, setRulingPlanets] = useState<string[]>(PRESETS[0].rulingPlanetsList);
  const [planets, setPlanets] = useState<PlanetInfo[]>(PRESETS[0].planets);

  // Expanded planet for details diagnostics in Stage 5
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);

  // Sync state when activePreset changes
  useMemo(() => {
    setSelectedHouse(activePreset.houseOfInterest);
    setCuspSign(activePreset.cuspSign);
    setCuspLord(activePreset.cuspLord);
    setCuspalSubLord(activePreset.cuspalSubLordName);
    setRulingPlanets(activePreset.rulingPlanetsList);
    setPlanets(activePreset.planets);
    setExpandedPlanet(null);
  }, [activePreset]);

  // Helper to map house index to sign index (0-11)
  const getSignForHouse = (h: number) => {
    const lagnaSignIdx = RASHIS.findIndex((r) => r.lord === cuspLord);
    const resolvedLagna = lagnaSignIdx === -1 ? 0 : lagnaSignIdx;
    return (resolvedLagna + h - 1) % 12;
  };

  // Occupants
  const occupants = useMemo(() => {
    return planets.filter((p) => p.house === selectedHouse).map((p) => p.name);
  }, [planets, selectedHouse]);

  // Enumerate 4 levels + aspect/conjunctions
  const levels = useMemo(() => {
    const lvl1 = planets.filter((p) => occupants.includes(p.starLord)).map((p) => p.name);
    const lvl2 = [...occupants];
    const lvl3 = planets.filter((p) => p.starLord === cuspLord).map((p) => p.name);
    const lvl4 = [cuspLord];
    
    // A-significator helper: aspecting or conjoining
    const aspect = planets.filter((p) => p.starLord === "Mars" || p.starLord === "Rahu").map((p) => p.name);
    const conjoined = planets.filter((p) => p.house === selectedHouse && p.name !== cuspLord).map((p) => p.name);
    const lvlA = [...aspect, ...conjoined].filter((pName) => !lvl1.includes(pName) && !lvl2.includes(pName) && !lvl3.includes(pName) && !lvl4.includes(pName));
    
    return { lvl1, lvl2, lvl3, lvl4, lvlA };
  }, [planets, occupants, cuspLord, selectedHouse]);

  // Rank and De-duplicate significators
  const deDuplicatedRanked = useMemo(() => {
    const list: { name: string; strongestLvl: number; allLvls: number[] }[] = [];
    const planetMap: Record<string, number[]> = {};

    planets.forEach((p) => {
      const q: number[] = [];
      if (levels.lvl1.includes(p.name)) q.push(1);
      if (levels.lvl2.includes(p.name)) q.push(2);
      if (levels.lvl3.includes(p.name)) q.push(3);
      if (levels.lvl4.includes(p.name)) q.push(4);
      if (levels.lvlA.includes(p.name)) q.push(5); // 5 represents A-significators

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
  }, [planets, levels]);

  const toggleRulingPlanet = (planet: string) => {
    setRulingPlanets((prev) =>
      prev.includes(planet) ? prev.filter((p) => p !== planet) : [...prev, planet]
    );
  };

  // SVG paths for North Indian chart houses (width 400, height 400)
  const housePaths = [
    { id: 1, path: "M 200,200 L 100,100 L 200,0 L 300,100 Z", textX: 200, textY: 70 },
    { id: 2, path: "M 0,0 L 200,0 L 100,100 Z", textX: 100, textY: 40 },
    { id: 3, path: "M 0,0 L 0,200 L 100,100 Z", textX: 40, textY: 100 },
    { id: 4, path: "M 200,200 L 100,100 L 0,200 L 100,300 Z", textX: 70, textY: 200 },
    { id: 5, path: "M 0,400 L 0,200 L 100,300 Z", textX: 40, textY: 300 },
    { id: 6, path: "M 0,400 L 200,400 L 100,300 Z", textX: 100, textY: 360 },
    { id: 7, path: "M 200,200 L 100,300 L 200,400 L 300,300 Z", textX: 200, textY: 330 },
    { id: 8, path: "M 400,400 L 200,400 L 300,300 Z", textX: 300, textY: 360 },
    { id: 9, path: "M 400,400 L 400,200 L 300,300 Z", textX: 360, textY: 300 },
    { id: 10, path: "M 200,200 L 300,300 L 400,200 L 300,100 Z", textX: 330, textY: 200 },
    { id: 11, path: "M 400,0 L 400,200 L 300,100 Z", textX: 360, textY: 100 },
    { id: 12, path: "M 400,0 L 200,0 L 300,100 Z", textX: 300, textY: 40 }
  ];

  const planetsByHouse = useMemo(() => {
    const map: Record<number, string[]> = {};
    planets.forEach((p) => {
      if (!map[p.house]) map[p.house] = [];
      map[p.house].push(p.name);
    });
    return map;
  }, [planets]);

  const planetNameExplanation = (name: string, isRP: boolean, isSubLord: boolean, strongestLvl: number) => {
    const lvlText = strongestLvl === 5 ? "Level A (Aspect/Conjunction)" : `Level ${strongestLvl}`;
    let exp = `${name} is a ${lvlText} significator for House ${selectedHouse}.`;
    
    if (isSubLord && isRP) {
      exp += ` Being both the Cuspal Sub-Lord and a Ruling Planet, it acts as a prime event catalyst. It governs the validity of the house promise and is actively transit-synchronized at the time of inquiry. Any Vimśottarī period (Mahādaśā, Bhukti, or Antardaśā) of ${name} will be highly auspicious and likely trigger the event.`;
    } else if (isSubLord) {
      exp += ` Since it is the Cuspal Sub-Lord, it acts as the primary gatekeeper for the event promise. It holds the final veto over whether the event occurs. However, because it is not an active Ruling Planet right now, its activation might be delayed or dependent on other active RPs in the timing scheme.`;
    } else if (isRP) {
      exp += ` It is currently a Ruling Planet in the heavens, signifying that its energy is live and active. While it doesn't rule the cuspal promise directly, its alignment with the active RPs means it will play a key role in timing the event execution (e.g. as a Bhukti or transit lord) once the promise itself is validated by the Cuspal Sub-Lord.`;
    } else {
      exp += ` It contributes to the overall significator pool but has no active RP alignment or cuspal sub-lord role. Its influence remains background or secondary, and it is unlikely to be the primary indicator of timing or verdict.`;
    }
    return exp;
  };

  const getSynthesisText = () => {
    if (activePresetIdx === 0 && selectedHouse === 7) {
      return "Venus matches BOTH the 7th Cusp Sub-Lord and the Ruling Planets. Venus is also a Level 1 significator (in Mars's star) and the house owner. This creates a powerful 'double endorsement'. The marriage promise is highly positive (YES), and Venus is the primary timing lord. Mars, being a live RP and occupant, is a strong co-promoter for the timing.";
    }
    if (activePresetIdx === 1 && selectedHouse === 10) {
      return "Mercury acts as the 10th Cusp Sub-Lord and is a Level 1 significator (in occupant Sun's star), while also matching the Ruling Planets. This makes Mercury the Prime Activator for career promotion. Since the 10th house is empty of occupants, the star-ruling strength of Mercury is exceptionally concentrated.";
    }
    
    const matchedRPsAndCSL = deDuplicatedRanked.filter((item) => rulingPlanets.includes(item.name) && cuspalSubLord === item.name);
    if (matchedRPsAndCSL.length > 0) {
      const names = matchedRPsAndCSL.map(n => n.name).join(", ");
      return `The significator chain reveals that ${names} holds a dual role as both the Cusp Sub-Lord (governing the verdict) and a Ruling Planet (governing the timing). This indicates a strong, active promise for House ${selectedHouse}. Watch for the Vimśottarī periods of ${names} for event manifestation.`;
    }
    return `Analyze the top significators for House ${selectedHouse}. The event's yes/no promise is dictated by the Cusp Sub-Lord (${cuspalSubLord}), while the timing of fructification is governed by the overlap between the ranked significators and the active Ruling Planets (${rulingPlanets.join(", ")}).`;
  };

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "28px 24px", color: INK_PRIMARY, minHeight: "700px" }} data-interactive="significator-chain-builder">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1.2rem", marginBottom: "1.8rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 6 · Lesson 4</span>
        <h1 style={{ margin: "0.3rem 0 0", color: GOLD, fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Significator Chain Builder Cockpit</h1>
        <p style={{ margin: "0.4rem 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.5" }}>
          Run the end-to-end significator chain workflow (Input → Enumerate → Rank → Cross-Reference → Output). Monitor active matches and event confirmation signals.
        </p>
      </section>

      {/* Preset Selector */}
      <section style={{ marginBottom: "1.8rem", display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: 800, color: INK_SECONDARY, textTransform: "uppercase" }}>Select Preset Scenario:</span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setActivePresetIdx(idx)}
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

      {/* Interactive Flowchart */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: SURFACE,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: "12px",
        padding: "16px 20px",
        marginBottom: "1.8rem",
        gap: "8px",
        flexWrap: "nowrap",
        overflowX: "auto"
      }}>
        {[
          { step: 1, label: "1. Input Cusp", desc: "Select House" },
          { step: 2, label: "2. Enumerate", desc: "Collect Tiers" },
          { step: 3, label: "3. Rank Pool", desc: "De-duplicate" },
          { step: 4, label: "4. Cross-Ref", desc: "Verify RPs & CSL" },
          { step: 5, label: "5. Final Output", desc: "Annotated Verdict" }
        ].map((s, idx) => {
          const isActive = activeStep === s.step;
          const isCompleted = activeStep > s.step;
          return (
            <div
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              style={{
                flex: 1,
                minWidth: "120px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                position: "relative",
                padding: "8px",
                borderRadius: "8px",
                background: isActive ? `${GOLD}12` : "transparent",
                border: `1.5px solid ${isActive ? GOLD : isCompleted ? `${GOLD}88` : "transparent"}`,
                transition: "all 0.2s ease",
                textAlign: "center"
              }}
            >
              <div style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: isActive ? GOLD : isCompleted ? `${GOLD}dd` : "#FFF",
                border: `1.5px solid ${GOLD}`,
                color: isActive || isCompleted ? "#FFF" : INK_SECONDARY,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 900,
                marginBottom: "6px",
                boxShadow: isActive ? `0 0 8px ${GOLD}60` : "none"
              }}>
                {isCompleted ? "✓" : s.step}
              </div>
              <span style={{ fontSize: "11.5px", fontWeight: 800, color: isActive ? GOLD : INK_PRIMARY }}>{s.label}</span>
              <span style={{ fontSize: "9.5px", color: INK_SECONDARY }}>{s.desc}</span>
              
              {/* Connection Arrow */}
              {idx < 4 && (
                <div style={{
                  position: "absolute",
                  right: "-12px",
                  top: "calc(50% - 14px)",
                  fontSize: "14px",
                  color: isCompleted ? GOLD : `${HAIRLINE}aa`,
                  fontWeight: "bold",
                  pointerEvents: "none",
                  zIndex: 1
                }}>
                  ➜
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2.4rem", marginBottom: "2.4rem" }}>
        
        {/* Left Column: SVG North Indian Kundali Chart */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "13px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>
            North Indian Kundali Chart
          </h3>
          
          <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ maxWidth: "340px", background: "#FFFBF2", borderRadius: "8px", border: `1px solid ${HAIRLINE}` }}>
            {housePaths.map((hp) => {
              const isSelected = selectedHouse === hp.id;
              const signNum = getSignForHouse(hp.id) + 1;
              const cellPlanets = planetsByHouse[hp.id] || [];

              return (
                <g key={hp.id} style={{ cursor: "pointer" }} onClick={() => setSelectedHouse(hp.id)}>
                  <path
                    d={hp.path}
                    fill={isSelected ? `${GOLD}15` : "transparent"}
                    stroke={isSelected ? GOLD : "#9C7A2F33"}
                    strokeWidth={isSelected ? 3.5 : 1}
                  />
                  <text x={hp.textX} y={hp.textY - 14} textAnchor="middle" fill={GOLD} style={{ fontSize: "11px", fontWeight: 900 }}>
                    {signNum}
                  </text>
                  <text x={hp.textX} y={hp.textY - 2} textAnchor="middle" fill={INK_SECONDARY} style={{ fontSize: "8.5px" }}>
                    H{hp.id}
                  </text>
                  <text x={hp.textX} y={hp.textY + 12} textAnchor="middle" fill={INK_PRIMARY} style={{ fontSize: "10px", fontWeight: 800 }}>
                    {cellPlanets.join(", ")}
                  </text>
                </g>
              );
            })}
          </svg>
          <p style={{ marginTop: "12px", fontSize: "11px", color: INK_SECONDARY, fontStyle: "italic", textAlign: "center" }}>
            Click any house in the Kundali to set it as the Input (Stage 1).
          </p>
        </div>

        {/* Right Column: Workflow Wizard */}
        <div style={{ display: "flex", flexDirection: "column", background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
          
          {/* Wizard Tabs */}
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "10px", marginBottom: "16px" }}>
            {[1, 2, 3, 4, 5].map((step) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                style={{
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontWeight: 800,
                  border: "none",
                  background: activeStep === step ? GOLD : "transparent",
                  color: activeStep === step ? "#FFF" : INK_SECONDARY,
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                S{step} {step === 1 ? "Input" : step === 2 ? "Enumerate" : step === 3 ? "Rank" : step === 4 ? "Cross-Ref" : "Output"}
              </button>
            ))}
          </div>

          {/* Wizard Content Panel */}
          <div style={{ flex: 1, minHeight: "280px" }}>
            
            {/* Step 1: Input */}
            {activeStep === 1 && (
              <div>
                <h4 style={{ margin: "0 0 12px 0", color: GOLD, fontSize: "13px", fontWeight: 800, textTransform: "uppercase" }}>Stage 1 — Select Target House</h4>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "16px" }}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hNum) => (
                    <button
                      key={hNum}
                      onClick={() => setSelectedHouse(hNum)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: `1px solid ${selectedHouse === hNum ? GOLD : HAIRLINE}`,
                        background: selectedHouse === hNum ? `${GOLD}15` : "transparent",
                        color: GOLD,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      H{hNum}
                    </button>
                  ))}
                </div>
                <div style={{ padding: "12px", border: `1px solid ${HAIRLINE}`, borderRadius: "8px", background: "#FFFBF2" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700 }}>Active Cusp Sign: <span style={{ color: GOLD }}>{cuspSign}</span></div>
                  <div style={{ fontSize: "12px", fontWeight: 700, marginTop: "6px" }}>Active House Lord: <span style={{ color: GOLD }}>{cuspLord}</span></div>
                </div>
              </div>
            )}

            {/* Step 2: Enumerate */}
            {activeStep === 2 && (
              <div>
                <h4 style={{ margin: "0 0 12px 0", color: GOLD, fontSize: "13px", fontWeight: 800, textTransform: "uppercase" }}>Stage 2 — Enumerate Significators</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "8px 12px", background: "#FFFBF2" }}>
                    <span style={{ fontSize: "10px", fontWeight: 900, color: GOLD, display: "block" }}>Level 1 (Star of Occupant)</span>
                    <span style={{ fontSize: "12px", fontWeight: 700 }}>{levels.lvl1.join(", ") || "None"}</span>
                  </div>
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "8px 12px", background: "#FFFBF2" }}>
                    <span style={{ fontSize: "10px", fontWeight: 900, color: GOLD, display: "block" }}>Level 2 (Occupants)</span>
                    <span style={{ fontSize: "12px", fontWeight: 700 }}>{levels.lvl2.join(", ") || "None"}</span>
                  </div>
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "8px 12px", background: "#FFFBF2" }}>
                    <span style={{ fontSize: "10px", fontWeight: 900, color: GOLD, display: "block" }}>Level 3 (Star of Owner)</span>
                    <span style={{ fontSize: "12px", fontWeight: 700 }}>{levels.lvl3.join(", ") || "None"}</span>
                  </div>
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "8px 12px", background: "#FFFBF2" }}>
                    <span style={{ fontSize: "10px", fontWeight: 900, color: GOLD, display: "block" }}>Level 4 (Owner)</span>
                    <span style={{ fontSize: "12px", fontWeight: 700 }}>{levels.lvl4.join(", ") || "None"}</span>
                  </div>
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "8px 12px", background: "#FFFBF2" }}>
                    <span style={{ fontSize: "10px", fontWeight: 900, color: GOLD, display: "block" }}>A-Significators (Conjunction/Aspect)</span>
                    <span style={{ fontSize: "12px", fontWeight: 700 }}>{levels.lvlA.join(", ") || "None"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Rank */}
            {activeStep === 3 && (
              <div>
                <h4 style={{ margin: "0 0 12px 0", color: GOLD, fontSize: "13px", fontWeight: 800, textTransform: "uppercase" }}>Stage 3 — Rank &amp; De-duplicate</h4>
                <p style={{ fontSize: "11px", color: INK_SECONDARY, marginBottom: "12px", lineHeight: "1.4" }}>
                  Planets are sorted from strongest (Level 1) to weakest (A-Significators), collapsed to their highest qualification.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {deDuplicatedRanked.map((item, idx) => (
                    <div key={item.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", background: `${GOLD}04` }}>
                      <span><span style={{ fontWeight: 800, color: GOLD, marginRight: "8px" }}>#{idx + 1}</span> {item.name}</span>
                      <span style={{ fontSize: "10.5px", color: INK_SECONDARY }}>
                        Level {item.strongestLvl === 5 ? "A (Aspect)" : item.strongestLvl}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Cross-Ref */}
            {activeStep === 4 && (
              <div>
                <h4 style={{ margin: "0 0 12px 0", color: GOLD, fontSize: "13px", fontWeight: 800, textTransform: "uppercase" }}>Stage 4 — Cross-Reference Machinery</h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD, display: "block", marginBottom: "6px" }}>Ruling Planets (RPs)</span>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map((pName) => {
                        const isRP = rulingPlanets.includes(pName);
                        return (
                          <button
                            key={pName}
                            onClick={() => toggleRulingPlanet(pName)}
                            style={{
                              padding: "4px 8px",
                              fontSize: "11px",
                              borderRadius: "4px",
                              border: `1px solid ${isRP ? GOLD : HAIRLINE}`,
                              background: isRP ? `${GOLD}12` : "transparent",
                              color: isRP ? GOLD : INK_SECONDARY,
                              cursor: "pointer"
                            }}
                          >
                            {pName}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ borderTop: `1px solid ${HAIRLINE}33`, paddingTop: "10px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD, display: "block", marginBottom: "6px" }}>Cuspal Sub-Lord</span>
                    <select
                      value={cuspalSubLord}
                      onChange={(e) => setCuspalSubLord(e.target.value)}
                      style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", fontSize: "12px" }}
                    >
                      {["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map((pName) => (
                        <option key={pName} value={pName}>{pName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Output */}
            {activeStep === 5 && (
              <div>
                <h4 style={{ margin: "0 0 12px 0", color: GOLD, fontSize: "13.5px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.02em" }}>Stage 5 — Final Annotated Significator Chain</h4>
                <p style={{ fontSize: "12px", color: INK_SECONDARY, marginBottom: "14px", lineHeight: "1.4" }}>
                  Below is the resolved significator pool ranked by strength and annotated against current RPs and the cuspal sub-lord. Click any planet card to toggle detailed activation diagnostics.
                </p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {deDuplicatedRanked.map((item, idx) => {
                    const isRP = rulingPlanets.includes(item.name);
                    const isSubLord = cuspalSubLord === item.name;
                    const isExpanded = expandedPlanet === item.name;

                    // Choose colors and badges based on status
                    let cardBorder = HAIRLINE;
                    let cardBg = "transparent";
                    let badgeBg = `${HAIRLINE}33`;
                    let badgeBorder = HAIRLINE;
                    let badgeColor = INK_SECONDARY;
                    let badgeText = "Significator";

                    if (isRP && isSubLord) {
                      cardBorder = GOLD;
                      cardBg = `${GOLD}06`;
                      badgeBg = "#FCF3CF";
                      badgeBorder = "#F4D03F";
                      badgeColor = "#7D6608";
                      badgeText = "★ Prime Activator (RP + CSL)";
                    } else if (isSubLord) {
                      cardBorder = "#28B463";
                      cardBg = "#F4FDF7";
                      badgeBg = "#D4EFDF";
                      badgeBorder = "#28B463";
                      badgeColor = "#196F3D";
                      badgeText = "Cusp Sub-Lord (Verdict)";
                    } else if (isRP) {
                      cardBorder = INDIGO;
                      cardBg = "#F2F4F8";
                      badgeBg = "#EBF5FB";
                      badgeBorder = "#5DADE2";
                      badgeColor = "#1B4F72";
                      badgeText = "Live RP (Timing)";
                    }

                    return (
                      <div
                        key={item.name}
                        onClick={() => setExpandedPlanet(isExpanded ? null : item.name)}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: `1.5px solid ${cardBorder}`,
                          background: cardBg,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: isExpanded ? `0 4px 10px rgba(156,122,47,0.12)` : "none"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontWeight: 900, color: GOLD, fontSize: "13px" }}>#{idx + 1}</span>
                              <span style={{ fontWeight: 800, color: INK_PRIMARY, fontSize: "14px" }}>{item.name}</span>
                            </div>
                            <div style={{ fontSize: "10px", color: INK_SECONDARY, marginTop: "2px" }}>
                              Tiers Qualified: {item.allLvls.map((l) => `Level ${l === 5 ? "A" : l}`).join(", ")}
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "10px",
                              fontWeight: 900,
                              background: badgeBg,
                              border: `1px solid ${badgeBorder}`,
                              color: badgeColor,
                              textTransform: "uppercase"
                            }}>
                              {badgeText}
                            </span>
                            <span style={{ fontSize: "12px", color: GOLD, transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                              ▼
                            </span>
                          </div>
                        </div>

                        {/* Activation explanation (collapsible detail) */}
                        {isExpanded && (
                          <div style={{
                            marginTop: "12px",
                            paddingTop: "12px",
                            borderTop: `1px dashed ${HAIRLINE}`,
                            fontSize: "12px",
                            color: INK_PRIMARY,
                            lineHeight: "1.45"
                          }}
                          onClick={(e) => e.stopPropagation()} // Prevent collapse when clicking text
                          >
                            <p style={{ margin: "0 0 6px 0", fontWeight: 700, color: GOLD }}>Astrological Role &amp; Activation Analysis:</p>
                            <span style={{ fontStyle: "normal" }}>
                              {planetNameExplanation(item.name, isRP, isSubLord, item.strongestLvl)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Judgement Synthesis summary card */}
                <div style={{
                  marginTop: "16px",
                  padding: "16px",
                  borderRadius: "10px",
                  border: `1.5px solid ${GOLD}`,
                  background: `${GOLD}05`,
                  color: INK_PRIMARY
                }}>
                  <h5 style={{ margin: "0 0 8px 0", color: GOLD, fontSize: "13px", fontWeight: 900, textTransform: "uppercase" }}>
                    Judgement Synthesis Panel
                  </h5>
                  <p style={{ margin: 0, fontSize: "12.5px", lineHeight: "1.5" }}>
                    {getSynthesisText()}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Wizard Action Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", borderTop: `1px solid ${HAIRLINE}33`, paddingTop: "12px" }}>
            <button
              disabled={activeStep === 1}
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              style={{ padding: "6px 12px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, cursor: "pointer", background: "transparent", color: GOLD, opacity: activeStep === 1 ? 0.4 : 1 }}
            >
              Previous Step
            </button>
            <button
              disabled={activeStep === 5}
              onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
              style={{ padding: "6px 16px", borderRadius: "6px", border: "none", background: GOLD, color: "#FFF", fontWeight: 700, cursor: "pointer", opacity: activeStep === 5 ? 0.4 : 1 }}
            >
              Next Step
            </button>
          </div>

        </div>

      </div>

      {/* Styled Astronomical parameters table below replacing dev console */}
      <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>Astronomical Parameters Table</h3>
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
              <td style={{ padding: "8px", fontWeight: 700 }}>Ayanāṁśa Value</td>
              <td style={{ padding: "8px" }}>24° 03′ 52.84″</td>
              <td style={{ padding: "8px" }}>Krishnamurti (KP) standard reference correction</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}33` }}>
              <td style={{ padding: "8px", fontWeight: 700 }}>Julian Date</td>
              <td style={{ padding: "8px" }}>2461234.5678</td>
              <td style={{ padding: "8px" }}>Epoch timestamp for horizontal calculations</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}33` }}>
              <td style={{ padding: "8px", fontWeight: 700 }}>Target Cusp Sub-Lord</td>
              <td style={{ padding: "8px", color: GOLD, fontWeight: 700 }}>{cuspalSubLord}</td>
              <td style={{ padding: "8px" }}>Cusp sub-division ruler that delivers the verdict</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", fontWeight: 700 }}>Active RPs Set</td>
              <td style={{ padding: "8px", color: INDIGO, fontWeight: 700 }}>{rulingPlanets.join(", ")}</td>
              <td style={{ padding: "8px" }}>Positional roles at the moment of horary casting</td>
            </tr>
          </tbody>
        </table>
      </section>

    </div>
  );
}
