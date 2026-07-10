"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';
import { Check, Info, Sparkles, Zap, RotateCcw, HelpCircle, Layers, CheckCircle2, ShieldCheck, ArrowRight, Play } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GOLD_LIGHT = "#F4C77B";
const INDIGO = "#4F6FA8";
const EMERALD = "#2F7D55";
const ORANGE = "#C28220";
const CRIMSON = "#A23A1E";

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

  // Wizard active step: 1 (Input), 2 (Enumerate), 3 (Rank), 4 (Cross-Ref), 5 (Animator)
  const [activeStep, setActiveStep] = useState(1);

  // User input states
  const [selectedHouse, setSelectedHouse] = useState(7);
  const [cuspSign, setCuspSign] = useState("Libra");
  const [cuspLord, setCuspLord] = useState("Venus");
  const [cuspalSubLord, setCuspalSubLord] = useState("Saturn");
  const [rulingPlanets, setRulingPlanets] = useState<string[]>(PRESETS[0].rulingPlanetsList);
  const [planets, setPlanets] = useState<PlanetInfo[]>(PRESETS[0].planets);

  // Animator state: which planet is selected to trace energy flow
  const [animatorPlanet, setAnimatorPlanet] = useState<string>("Venus");

  // Sync state when activePreset changes
  useMemo(() => {
    setSelectedHouse(activePreset.houseOfInterest);
    setCuspSign(activePreset.cuspSign);
    setCuspLord(activePreset.cuspLord);
    setCuspalSubLord(activePreset.cuspalSubLordName);
    setRulingPlanets(activePreset.rulingPlanetsList);
    setPlanets(activePreset.planets);
    // Find the first occupant or default to Venus
    const firstOcc = activePreset.planets.find(p => p.house === activePreset.houseOfInterest);
    setAnimatorPlanet(firstOcc ? firstOcc.name : "Venus");
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
      if (levels.lvlA.includes(p.name)) q.push(5);

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

  // Selected planet under tracing details
  const activeTraceDetails = useMemo(() => {
    const pInfo = planets.find(p => p.name === animatorPlanet);
    if (!pInfo) return null;

    const rankItem = deDuplicatedRanked.find(d => d.name === animatorPlanet);
    const level = rankItem ? rankItem.strongestLvl : null;

    let rating = "Weak / Neutral";
    let score = 25;
    let logic = "";

    if (level === 1) {
      rating = "Level 1: Supreme / Strongest";
      score = 100;
      logic = `${animatorPlanet} resides in the Nakshatra of ${pInfo.starLord}, who occupies House ${selectedHouse}. Stellar theory dictates that a planet yields the results of its star-lord; hence, ${animatorPlanet} is a Level 1 primary significator.`;
    } else if (level === 2) {
      rating = "Level 2: Strong Occupant";
      score = 75;
      logic = `${animatorPlanet} physically occupies House ${selectedHouse}. Direct house tenancy grants strong secondary strength to deliver events of this cusp.`;
    } else if (level === 3) {
      rating = "Level 3: Moderate Star-Lord of Owner";
      score = 50;
      logic = `${animatorPlanet} is in the Nakshatra of ${pInfo.starLord}, who is the Lord of House ${selectedHouse} (${cuspLord}). It links to the house ownership recursively.`;
    } else if (level === 4) {
      rating = "Level 4: Mild House Owner";
      score = 35;
      logic = `${animatorPlanet} rules the sign on the cusp of House ${selectedHouse} (${cuspLord}). Lordship alone provides mild foundational significance.`;
    } else if (level === 5) {
      rating = "Level A: Aspect / Conjunction";
      score = 20;
      logic = `${animatorPlanet} conjoins or aspects the cusp or occupants of House ${selectedHouse}. A peripheral channel of signification.`;
    } else {
      logic = `${animatorPlanet} has no direct significator links to House ${selectedHouse}.`;
    }

    return {
      pInfo,
      level,
      rating,
      score,
      logic
    };
  }, [animatorPlanet, planets, selectedHouse, deDuplicatedRanked, cuspLord]);

  const toggleRulingPlanet = (planet: string) => {
    setRulingPlanets((prev) =>
      prev.includes(planet) ? prev.filter((p) => p !== planet) : [...prev, planet]
    );
  };

  // SVG paths for North Indian chart houses
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

  const getSynthesisText = () => {
    if (activePresetIdx === 0 && selectedHouse === 7) {
      return "Venus matches BOTH the 7th Cusp Sub-Lord and the Ruling Planets. Venus is also a Level 1 significator (in Mars's star) and the house owner. This creates a powerful 'double endorsement'. The marriage promise is highly positive (YES), and Venus is the primary timing lord. Mars, being a live RP and occupant, is a strong co-promoter for the timing.";
    }
    if (activePresetIdx === 1 && selectedHouse === 10) {
      return "Mercury acts as the 10th Cusp Sub-Lord and is a Level 1 significator (in occupant Sun's star), while also matching the Ruling Planets. This makes Mercury the Prime Activator for career promotion. Since the 10th house is empty of occupants, the star-ruling strength of Mercury is exceptionally concentrated.";
    }
    return `Analyze the top significators for House ${selectedHouse}. The event's yes/no promise is dictated by the Cusp Sub-Lord (${cuspalSubLord}), while the timing of fructification is governed by the overlap between the ranked significators and the active Ruling Planets (${rulingPlanets.join(", ")}).`;
  };

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "28px 24px", color: INK_PRIMARY, minHeight: "700px" }} data-interactive="significator-chain-builder">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1.2rem", marginBottom: "1.8rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 6 · Lesson 4</span>
        <h1 style={{ margin: "0.3rem 0 0", color: GOLD, fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Stellar Energy Chain Animator Cockpit</h1>
        <p style={{ margin: "0.4rem 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.5" }}>
          Map the flow of stellar significance from the source planet through the star-lord down to the cuspal delivery.
        </p>
      </section>

      {/* Preset Selector */}
      <section style={{ marginBottom: "1.8rem", display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "11.5px", fontWeight: 800, color: INK_SECONDARY, textTransform: "uppercase" }}>Select Preset Scenario:</span>
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
          { step: 5, label: "5. Energy Animator", desc: "Flow Workspace" }
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
        
        {/* Left Column: SVG North Indian Kundali Chart */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "13px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>
            North Indian Kundali Chart
          </h3>
          
          <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ maxWidth: "320px", background: "#FFFBF2", borderRadius: "8px", border: `1px solid ${HAIRLINE}` }}>
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
          <p style={{ marginTop: "12px", fontSize: "11px", color: INK_MUTED, fontStyle: "italic", textAlign: "center" }}>
            Click any house in the Kundali to set it as the Target House (Stage 1).
          </p>
        </div>

        {/* Right Column: Workflow Wizard */}
        <div style={{ display: "flex", flexDirection: "column", background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
          
          {/* Wizard Content Panel */}
          <div style={{ flex: 1, minHeight: "340px" }}>
            
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
                  <div style={{ fontSize: "12.5px", fontWeight: 700 }}>Active Cusp Sign: <span style={{ color: GOLD }}>{cuspSign}</span></div>
                  <div style={{ fontSize: "12.5px", fontWeight: 700, marginTop: "6px" }}>Active House Lord: <span style={{ color: GOLD }}>{cuspLord}</span></div>
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
                </div>
              </div>
            )}

            {/* Step 3: Rank */}
            {activeStep === 3 && (
              <div>
                <h4 style={{ margin: "0 0 12px 0", color: GOLD, fontSize: "13px", fontWeight: 800, textTransform: "uppercase" }}>Stage 3 — Rank &amp; De-duplicate</h4>
                <p style={{ fontSize: "11px", color: INK_SECONDARY, marginBottom: "12px", lineHeight: "1.4" }}>
                  Planets are sorted from strongest (Level 1) to weakest (Level A), collapsed to their highest qualification.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {deDuplicatedRanked.map((item, idx) => (
                    <div key={item.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", background: `${GOLD}04` }}>
                      <span><span style={{ fontWeight: 800, color: GOLD, marginRight: "8px" }}>#{idx + 1}</span> {item.name}</span>
                      <span style={{ fontSize: "11px", color: INK_SECONDARY }}>
                        Level {item.strongestLvl === 5 ? "A" : item.strongestLvl}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Cross-Ref */}
            {activeStep === 4 && (
              <div>
                <h4 style={{ margin: "0 0 12px 0", color: GOLD, fontSize: "13px", fontWeight: 800, textTransform: "uppercase" }}>Stage 4 — Cross-Reference RPs &amp; Sub-lord</h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD, display: "block", marginBottom: "6px" }}>Momental RPs Set</span>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {PLANETS.map((pName) => {
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
                      style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", fontSize: "12px", color: INK_PRIMARY }}
                    >
                      {PLANETS.map((pName) => (
                        <option key={pName} value={pName}>{pName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Stellar Energy Chain Animator */}
            {activeStep === 5 && activeTraceDetails && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h4 style={{ margin: "0", color: GOLD, fontSize: "13px", fontWeight: 800, textTransform: "uppercase" }}>
                  Stage 5 — Stellar Energy Chain Animator
                </h4>
                
                {/* Select planet to animate */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11.5px", color: INK_SECONDARY }}>Trace flow for:</span>
                  {deDuplicatedRanked.map(item => (
                    <button
                      key={item.name}
                      onClick={() => setAnimatorPlanet(item.name)}
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        border: `1.2px solid ${animatorPlanet === item.name ? GOLD : HAIRLINE}`,
                        background: animatorPlanet === item.name ? `${GOLD}15` : "white",
                        color: GOLD,
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>

                {/* Animated Chain Canvas */}
                <div style={{
                  background: "#1E1C18",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: `1.5px solid ${GOLD}`
                }}>
                  <svg width="100%" height="110" viewBox="0 0 480 110" style={{ overflow: "visible" }}>
                    {/* Node 1: Source Planet */}
                    <g transform="translate(60, 55)">
                      <circle cx="0" cy="0" r="28" fill="#3A342B" stroke={GOLD_LIGHT} strokeWidth="1.5" />
                      <text textAnchor="middle" dy="-4" fontSize="10" fill="#FFF" fontWeight="800">{animatorPlanet}</text>
                      <text textAnchor="middle" dy="12" fontSize="8" fill={GOLD_LIGHT} fontWeight="700">Source</text>
                    </g>

                    {/* Connection Line 1 */}
                    <line x1="88" y1="55" x2="212" y2="55" stroke="rgba(244, 199, 123, 0.2)" strokeWidth="3" />
                    <line x1="88" y1="55" x2="212" y2="55" stroke={GOLD_LIGHT} strokeWidth="1.5" strokeDasharray="6 6" />

                    {/* Node 2: Star Lord */}
                    <g transform="translate(240, 55)">
                      <circle cx="0" cy="0" r="28" fill="#3A342B" stroke={GOLD_LIGHT} strokeWidth="1.5" />
                      <text textAnchor="middle" dy="-4" fontSize="10" fill="#FFF" fontWeight="800">{activeTraceDetails.pInfo.starLord}</text>
                      <text textAnchor="middle" dy="12" fontSize="8" fill={GOLD_LIGHT} fontWeight="700">Star-Lord</text>
                    </g>

                    {/* Connection Line 2 */}
                    <line x1="268" y1="55" x2="392" y2="55" stroke="rgba(244, 199, 123, 0.2)" strokeWidth="3" />
                    <line x1="268" y1="55" x2="392" y2="55" stroke={GOLD_LIGHT} strokeWidth="1.5" strokeDasharray="6 6" />

                    {/* Node 3: Target House Cusp */}
                    <g transform="translate(420, 55)">
                      <circle cx="0" cy="0" r="28" fill="#2E4A3F" stroke={EMERALD} strokeWidth="2" />
                      <text textAnchor="middle" dy="-4" fontSize="10" fill="#FFF" fontWeight="800">House {selectedHouse}</text>
                      <text textAnchor="middle" dy="12" fontSize="8" fill={EMERALD} fontWeight="700">Destination</text>
                    </g>

                    {/* Flowing Energy Pulse */}
                    <motion.circle
                      cx={60}
                      cy={55}
                      r="6"
                      fill={GOLD_LIGHT}
                      style={{ filter: "drop-shadow(0 0 6px #F4C77B)" }}
                      animate={{ cx: [60, 240, 420] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut"
                      }}
                    />
                  </svg>
                </div>

                {/* Strength assessment block */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", background: "white", padding: "12px", borderRadius: "8px", border: `1px solid ${HAIRLINE}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 800, color: INK_PRIMARY }}>Signification Strength:</span>
                    <strong style={{
                      color: activeTraceDetails.level === 1 ? EMERALD : activeTraceDetails.level === 2 ? ORANGE : GOLD
                    }}>
                      {activeTraceDetails.rating}
                    </strong>
                  </div>
                  
                  {/* Visual Strength Meter */}
                  <div style={{ height: "6px", background: "rgba(0,0,0,0.06)", borderRadius: "4px", overflow: "hidden", margin: "4px 0" }}>
                    <div style={{ height: "100%", width: `${activeTraceDetails.score}%`, background: activeTraceDetails.level === 1 ? EMERALD : activeTraceDetails.level === 2 ? ORANGE : GOLD, borderRadius: "4px" }} />
                  </div>

                  <p style={{ margin: "2px 0 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>
                    {activeTraceDetails.logic}
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

      {/* Judgement Synthesis summary card */}
      <div style={{
        marginBottom: "2rem",
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

      {/* Styled Astronomical parameters table */}
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
              <td style={{ padding: "8px" }}>Krishnamurti (KP) standard reference precession correction</td>
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
