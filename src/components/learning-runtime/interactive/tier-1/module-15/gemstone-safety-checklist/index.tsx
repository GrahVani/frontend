"use client";

import React, { useState } from "react";
import { AlertCircle, ShieldAlert, Heart, Calendar, CheckSquare, RefreshCw, AlertOctagon, HelpCircle } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

interface GemSafetyProfile {
  id: string;
  name: string;
  potency: "Extreme" | "High" | "Medium" | "Mild";
  durabilityNote: string;
  hasTestPeriod: boolean;
}

const GEMS_SAFETY_PROFILES: GemSafetyProfile[] = [
  {
    id: "blue_sapphire",
    name: "Blue Sapphire (Nīlam)",
    potency: "Extreme",
    durabilityNote: "Extremely hard (9 Mohs). Very durable, but its high astrological potency demands a strict 3-day test period.",
    hasTestPeriod: true
  },
  {
    id: "diamond",
    name: "Diamond (Vajra)",
    potency: "Extreme",
    durabilityNote: "Hardest mineral (10 Mohs) but can cleave under direct impact. High potency, often requires short test period.",
    hasTestPeriod: true
  },
  {
    id: "pearl",
    name: "Pearl (Muktā)",
    potency: "Mild",
    durabilityNote: "Very soft & organic (2.5-4.5 Mohs). Extremely sensitive to chemicals, acids, perfume, sweat, and soap. Needs protective setting.",
    hasTestPeriod: false
  },
  {
    id: "coral",
    name: "Red Coral (Pravāla)",
    potency: "Medium",
    durabilityNote: "Soft & organic (3.5 Mohs). Can degrade, fade, or dissolve when exposed to heavy sweat, household cleaners, or swimming pool chlorine.",
    hasTestPeriod: false
  },
  {
    id: "emerald",
    name: "Emerald (Marakata)",
    potency: "High",
    durabilityNote: "Hard (7.5-8 Mohs) but highly included with natural internal fissures. Prone to cracking or chipping under physical shock. Handle gently.",
    hasTestPeriod: false
  }
];

interface SimulationState {
  day: 1 | 2 | 3 | "result";
  day1Choice: "positive" | "negative" | null;
  day2Choice: "positive" | "negative" | null;
  day3Choice: "positive" | "negative" | null;
}

export function GemstoneSafetyChecklist() {
  const [selectedGemId, setSelectedGemId] = useState<string>("blue_sapphire");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    heat: false,
    durability: false,
    allergen: false,
    cost: false
  });
  
  const [simState, setSimState] = useState<SimulationState>({
    day: 1,
    day1Choice: null,
    day2Choice: null,
    day3Choice: null
  });

  const selectedGem = GEMS_SAFETY_PROFILES.find(g => g.id === selectedGemId) || GEMS_SAFETY_PROFILES[0];

  const handleSelectGem = (id: string) => {
    setSelectedGemId(id);
    resetSimulation();
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleToggleCheck = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(8);
    }
  };

  const handleSimulationChoice = (choice: "positive" | "negative") => {
    const currentDay = simState.day;
    if (currentDay === 1) {
      setSimState(prev => ({ ...prev, day: 2, day1Choice: choice }));
    } else if (currentDay === 2) {
      setSimState(prev => ({ ...prev, day: 3, day2Choice: choice }));
    } else if (currentDay === 3) {
      setSimState(prev => ({ ...prev, day: "result", day3Choice: choice }));
    }
    
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(choice === "negative" ? 40 : 15);
    }
  };

  const resetSimulation = () => {
    setSimState({
      day: 1,
      day1Choice: null,
      day2Choice: null,
      day3Choice: null
    });
  };

  const hasNegativeVibration = 
    simState.day1Choice === "negative" || 
    simState.day2Choice === "negative" || 
    simState.day3Choice === "negative";

  const getCompletedCount = () => {
    return Object.values(checklist).filter(Boolean).length;
  };

  // Render SVG based on current state of simulation
  const renderVisualSimulation = () => {
    const currentDay = simState.day;
    
    // Choose active choice for drawing
    let activeChoice: "positive" | "negative" | null = null;
    let dayNum = 1;
    if (currentDay === 1) {
      dayNum = 1;
      activeChoice = null;
    } else if (currentDay === 2) {
      dayNum = 2;
      activeChoice = simState.day1Choice;
    } else if (currentDay === 3) {
      dayNum = 3;
      activeChoice = simState.day2Choice;
    } else {
      dayNum = 3;
      activeChoice = simState.day3Choice;
    }

    // SVG parameters
    return (
      <svg
        viewBox="0 0 400 120"
        style={{
          width: "100%",
          maxHeight: "130px",
          borderRadius: "8px",
          background: "var(--gl-cream-light, #fdfcf7)",
          border: "1px solid rgba(156,122,47,0.12)",
          transition: "all 0.5s ease"
        }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="nightSky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1325" />
            <stop offset="100%" stopColor="#1C2541" />
          </linearGradient>
          <linearGradient id="nightSkyRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a0b12" />
            <stop offset="70%" stopColor="#300d11" />
            <stop offset="100%" stopColor="#0d0304" />
          </linearGradient>
          
          <linearGradient id="daySky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#70a6ff" />
            <stop offset="100%" stopColor="#bce3ff" />
          </linearGradient>
          <linearGradient id="daySkyStorm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f596b" />
            <stop offset="100%" stopColor="#2c323f" />
          </linearGradient>

          <linearGradient id="twilightSky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e57c82" />
            <stop offset="50%" stopColor="#a364d9" />
            <stop offset="100%" stopColor="#3b2b85" />
          </linearGradient>
          <linearGradient id="twilightSkyStorm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5d354a" />
            <stop offset="100%" stopColor="#1e182e" />
          </linearGradient>
        </defs>

        {/* BACKGROUND */}
        {dayNum === 1 && (
          <rect
            width="400"
            height="120"
            fill={activeChoice === "negative" ? "url(#nightSkyRed)" : "url(#nightSky)"}
            style={{ transition: "fill 0.5s ease" }}
          />
        )}
        {dayNum === 2 && (
          <rect
            width="400"
            height="120"
            fill={activeChoice === "negative" ? "url(#daySkyStorm)" : "url(#daySky)"}
            style={{ transition: "fill 0.5s ease" }}
          />
        )}
        {dayNum === 3 && (
          <rect
            width="400"
            height="120"
            fill={activeChoice === "negative" ? "url(#twilightSkyStorm)" : "url(#twilightSky)"}
            style={{ transition: "fill 0.5s ease" }}
          />
        )}

        {/* ATMOSPHERIC DECORATIONS */}
        {dayNum === 1 && (
          <>
            {/* Stars */}
            <circle cx="50" cy="25" r="1.5" fill="#fff" opacity="0.8" />
            <circle cx="120" cy="40" r="1" fill="#fff" opacity="0.6" />
            <circle cx="280" cy="30" r="1.5" fill="#fff" opacity="0.7" />
            <circle cx="340" cy="20" r="2" fill="#fff" opacity="0.9" className="animate-pulse" />
            <circle cx="220" cy="50" r="1" fill="#fff" opacity="0.5" />
            
            {activeChoice === "negative" ? (
              // Nightmares Red Waves and storm lines
              <g opacity="0.85">
                <path d="M 0 90 Q 50 70 100 95 T 200 80 T 300 100 T 400 85" fill="none" stroke="#ad4b37" strokeWidth="2.5" strokeDasharray="3,3" />
                <path d="M 0 100 Q 60 85 120 105 T 240 90 T 360 110 T 400 100" fill="none" stroke="#e0583c" strokeWidth="1.5" />
                {/* Closed anxious eyes */}
                <path d="M 160 50 Q 175 60 190 50" fill="none" stroke="#ad4b37" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 210 50 Q 225 60 240 50" fill="none" stroke="#ad4b37" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 175 40 L 165 32" stroke="#ad4b37" strokeWidth="2" />
                <path d="M 225 40 L 235 32" stroke="#ad4b37" strokeWidth="2" />
              </g>
            ) : (
              // Peaceful sleep moon & green waves
              <g>
                <path d="M 0 100 Q 100 85 200 100 T 400 100" fill="none" stroke="rgba(78, 112, 55, 0.4)" strokeWidth="2" />
                <path d="M 0 108 Q 120 95 240 108 T 400 108" fill="none" stroke="rgba(78, 112, 55, 0.6)" strokeWidth="1.5" />
                
                {/* Serene Crescent Moon */}
                <path d="M 200 25 A 20 20 0 1 0 220 57 A 24 24 0 1 1 200 25 Z" fill="#ffe082" filter="drop-shadow(0px 0px 8px rgba(255,224,130,0.6))" />
                {/* Sleeping Face Details (closed peaceful curve) */}
                <path d="M 170 55 Q 180 62 190 55" fill="none" stroke="#ffe082" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                <path d="M 210 55 Q 220 62 230 55" fill="none" stroke="#ffe082" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              </g>
            )}
          </>
        )}

        {dayNum === 2 && (
          <>
            {activeChoice === "negative" ? (
              // Accidents (shattered particles and lightning)
              <g>
                {/* Storm clouds */}
                <path d="M -20 20 Q 20 -10 60 15 Q 100 -5 140 20 Q 180 0 220 25 Q 260 5 300 25 Q 340 10 380 30 T 420 20 L 420 50 L -20 50 Z" fill="#3b4454" />
                
                {/* Shattered glass outlines in center */}
                <path d="M 180 55 L 200 45 L 220 55 L 205 75 L 180 55 Z" fill="none" stroke="#e0583c" strokeWidth="1.5" />
                <line x1="200" y1="45" x2="200" y2="30" stroke="#e0583c" strokeWidth="1.5" />
                <line x1="220" y1="55" x2="235" y2="60" stroke="#e0583c" strokeWidth="1.5" />
                <line x1="205" y1="75" x2="210" y2="90" stroke="#e0583c" strokeWidth="1.5" />
                <line x1="180" y1="55" x2="165" y2="50" stroke="#e0583c" strokeWidth="1.5" />

                {/* Exclamation alert */}
                <path d="M 200 40 L 200 70" stroke="#e0583c" strokeWidth="3" strokeLinecap="round" />
                <circle cx="200" cy="80" r="2.5" fill="#e0583c" />
              </g>
            ) : (
              // Productive sun & gears
              <g>
                {/* Sun */}
                <circle cx="200" cy="45" r="20" fill="#fff176" filter="drop-shadow(0 0 12px rgba(255,241,118,0.7))" />
                <path d="M 200 15 L 200 5 M 200 75 L 200 85 M 170 45 L 160 45 M 230 45 L 240 45 M 179 24 L 172 17 M 221 66 L 228 73 M 179 66 L 172 73 M 221 24 L 228 17" stroke="#fff176" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Ascending arrow */}
                <path d="M 130 85 L 150 65 L 160 72 L 185 45 M 185 45 L 175 45 M 185 45 L 185 55" fill="none" stroke="#4e7037" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Small gears */}
                <circle cx="250" cy="70" r="8" fill="none" stroke="#ffe082" strokeWidth="2" strokeDasharray="3,2" />
                <circle cx="265" cy="78" r="6" fill="none" stroke="#ffe082" strokeWidth="1.5" strokeDasharray="2,2" />
              </g>
            )}
          </>
        )}

        {dayNum === 3 && (
          <>
            {activeChoice === "negative" ? (
              // Quarrels (Faces facing away with lightning)
              <g>
                {/* Face Left silhouette facing left */}
                <path d="M 150 40 Q 140 40 135 50 Q 130 55 130 65 Q 130 75 138 80 L 140 90" fill="none" stroke="#ad4b37" strokeWidth="2.5" strokeLinecap="round" />
                {/* Face Right silhouette facing right */}
                <path d="M 250 40 Q 260 40 265 50 Q 270 55 270 65 Q 270 75 262 80 L 260 90" fill="none" stroke="#ad4b37" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Red jagged lightning bolt */}
                <path d="M 200 35 L 190 60 L 210 60 L 195 85" fill="none" stroke="#e0583c" strokeWidth="3" strokeLinejoin="miter" strokeLinecap="round" />
              </g>
            ) : (
              // Serene lotus flower
              <g>
                {/* Calm water ripple lines */}
                <ellipse cx="200" cy="90" rx="60" ry="6" fill="none" stroke="rgba(78, 112, 55, 0.4)" strokeWidth="1.5" />
                <ellipse cx="200" cy="95" rx="90" ry="8" fill="none" stroke="rgba(78, 112, 55, 0.3)" strokeWidth="1" />

                {/* Lotus Petals */}
                <g transform="translate(180, 50)" fill="#81c784" stroke="#388e3c" strokeWidth="1" opacity="0.9">
                  {/* Back petals */}
                  <path d="M 20 30 C 10 10, 0 10, 0 30 Z" />
                  <path d="M 20 30 C 30 10, 40 10, 40 30 Z" />
                  {/* Middle petals */}
                  <path d="M 20 30 C 0 15, 10 5, 20 25 Z" fill="#a5d6a7" />
                  <path d="M 20 30 C 40 15, 30 5, 20 25 Z" fill="#a5d6a7" />
                  {/* Central bud */}
                  <path d="M 20 30 C 10 0, 30 0, 20 30 Z" fill="#c8e6c9" />
                </g>
                {/* Golden aura halo above lotus */}
                <circle cx="200" cy="62" r="18" fill="none" stroke="#ffe082" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
              </g>
            )}
          </>
        )}

        {/* LABELS AND TEXT OVERLAYS */}
        <text
          x="20"
          y="105"
          fill="#ffffff"
          fontSize="10"
          fontWeight="bold"
          opacity="0.85"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {dayNum === 1 ? "Night 1: Sleep State" : dayNum === 2 ? "Day 2: Waking Conduct" : "Day 3: Final 24h Shift"}
        </text>

        {/* Real-time sign label */}
        {activeChoice && (
          <rect
            x="290"
            y="90"
            width="90"
            height="20"
            rx="10"
            fill={activeChoice === "negative" ? "rgba(173, 75, 55, 0.9)" : "rgba(78, 112, 55, 0.9)"}
          />
        )}
        {activeChoice && (
          <text
            x="335"
            y="103"
            fill="#ffffff"
            fontSize="9"
            fontWeight="bold"
            textAnchor="middle"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {activeChoice === "negative" ? "Inauspicious" : "Auspicious"}
          </text>
        )}
      </svg>
    );
  };

  return (
    <div style={{
      padding: "16px",
      borderRadius: "16px",
      background: "rgba(255, 253, 248, 0.75)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(156, 122, 47, 0.15)",
      fontFamily: "'Inter', sans-serif",
      color: INK_PRIMARY,
      maxWidth: "960px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}>
      <style>{`
        .check-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px;
          background: rgba(255,255,255,0.4);
          border: 1px solid rgba(156,122,47,0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .check-item:hover {
          background: rgba(255, 253, 248, 0.9);
          border-color: ${GOLD};
        }
        .check-item.active {
          border-color: rgba(78, 112, 55, 0.35);
          background: rgba(78, 112, 55, 0.03);
        }
        .sim-btn {
          border: 1.5px solid rgba(156,122,47,0.15);
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 750;
          color: ${INK_SECONDARY};
          text-align: left;
          width: 100%;
        }
        .sim-btn:hover {
          border-color: ${GOLD};
          background: rgba(251,248,243,0.7);
        }
        .sim-btn.danger-btn:hover {
          border-color: #ad4b37;
          background: rgba(173, 75, 55, 0.04);
        }
        
        /* Focus state accessibility override */
        button:focus-visible, .check-item:focus-visible {
          outline: 2px solid ${GOLD_DEEP};
          outline-offset: 2px;
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        borderBottom: "1px solid rgba(156, 122, 47, 0.1)",
        paddingBottom: "10px"
      }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          Gemstone Safety & Test-Period Simulator
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Audit physical settings, hardness properties, and walk through a traditional 3-day observational trial.
        </p>
      </div>

      {/* SELECT GEM */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
          Select Gemstone to Analyze
        </span>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {GEMS_SAFETY_PROFILES.map(g => (
            <button
              key={g.id}
              onClick={() => handleSelectGem(g.id)}
              aria-pressed={g.id === selectedGemId}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                border: g.id === selectedGemId ? `1.5px solid ${GOLD_DEEP}` : "1.5px solid rgba(156,122,47,0.2)",
                background: g.id === selectedGemId ? GOLD_DEEP : "rgba(255,255,255,0.45)",
                color: g.id === selectedGemId ? "#ffffff" : INK_SECONDARY,
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "16px"
      }}>
        {/* LEFT PANEL: 4 SAFEGUARDS CHECKLIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              Four Safeguards Audit
            </span>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#4e7037" }}>
              Passed: {getCompletedCount()} / 4
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} role="group" aria-label="Four Safeguards Checklist">
            {/* CHECK 1 */}
            <div
              onClick={() => handleToggleCheck("heat")}
              className={`check-item ${checklist.heat ? "active" : ""}`}
              role="checkbox"
              aria-checked={checklist.heat}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleCheck("heat"); } }}
            >
              <input type="checkbox" checked={checklist.heat} readOnly style={{ pointerEvents: "none" }} tabIndex={-1} />
              <div>
                <strong style={{ fontSize: "11px", color: GOLD_DEEP }}>Astrological 'Heat' (Intensity) Check</strong>
                <div style={{ fontSize: "9px", color: INK_MUTED, marginTop: "2px" }}>Potency: {selectedGem.potency}</div>
                <p style={{ margin: "2px 0 0 0", fontSize: "10px", lineHeight: "1.35", color: INK_SECONDARY }}>
                  Verified that this gem's strength matches the client's sensitivity. {selectedGem.hasTestPeriod ? "Requires test period." : "Standard caution applies."}
                </p>
              </div>
            </div>

            {/* CHECK 2 */}
            <div
              onClick={() => handleToggleCheck("durability")}
              className={`check-item ${checklist.durability ? "active" : ""}`}
              role="checkbox"
              aria-checked={checklist.durability}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleCheck("durability"); } }}
            >
              <input type="checkbox" checked={checklist.durability} readOnly style={{ pointerEvents: "none" }} tabIndex={-1} />
              <div>
                <strong style={{ fontSize: "11px", color: GOLD_DEEP }}>Physical Hardness & Setting Check</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "10px", lineHeight: "1.35", color: INK_SECONDARY }}>
                  {selectedGem.durabilityNote}
                </p>
              </div>
            </div>

            {/* CHECK 3 */}
            <div
              onClick={() => handleToggleCheck("allergen")}
              className={`check-item ${checklist.allergen ? "active" : ""}`}
              role="checkbox"
              aria-checked={checklist.allergen}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleCheck("allergen"); } }}
            >
              <input type="checkbox" checked={checklist.allergen} readOnly style={{ pointerEvents: "none" }} tabIndex={-1} />
              <div>
                <strong style={{ fontSize: "11px", color: GOLD_DEEP }}>Metal Setting Allergen Check</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "10px", lineHeight: "1.35", color: INK_SECONDARY }}>
                  Ensured no nickel alloys are used. Selected high-quality gold, silver, or platinum to prevent skin reactions.
                </p>
              </div>
            </div>

            {/* CHECK 4 */}
            <div
              onClick={() => handleToggleCheck("cost")}
              className={`check-item ${checklist.cost ? "active" : ""}`}
              role="checkbox"
              aria-checked={checklist.cost}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleToggleCheck("cost"); } }}
            >
              <input type="checkbox" checked={checklist.cost} readOnly style={{ pointerEvents: "none" }} tabIndex={-1} />
              <div>
                <strong style={{ fontSize: "11px", color: GOLD_DEEP }}>Cost & Commission Review</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "10px", lineHeight: "1.35", color: INK_SECONDARY }}>
                  Evaluated budget limits. Assured that the client is not pressured into high-price purchases. Offered uparatnas if required.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: 3-DAY TRIAL SIMULATOR */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: "rgba(255,255,255,0.5)",
          border: "1px solid rgba(156,122,47,0.15)",
          borderRadius: "12px",
          padding: "14px"
        }}>
          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            3-Day Test Period Simulator
          </span>

          {!selectedGem.hasTestPeriod ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: "220px",
              textAlign: "center",
              padding: "16px",
              background: "rgba(0,0,0,0.02)",
              border: "1px dashed rgba(0,0,0,0.1)",
              borderRadius: "8px"
            }}>
              <Heart size={28} style={{ color: GOLD_DEEP, marginBottom: "8px" }} />
              <strong style={{ fontSize: "12px", color: GOLD_DEEP }}>Gentle Resonance Stone</strong>
              <p style={{ margin: "6px 0 0 0", fontSize: "10.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                {selectedGem.name} is a gentler stone. Traditional test-periods are mostly prescribed for potent, fast-acting stones like **Blue Sapphire** and **Diamond**. Choose Blue Sapphire or Diamond to run the simulator.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              
              {/* TIMELINE SVG */}
              <svg viewBox="0 0 320 30" style={{ width: "100%", height: "30px" }} aria-hidden="true">
                {/* Horizontal progress bar background */}
                <line x1="40" y1="15" x2="280" y2="15" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
                {/* Completed progress line */}
                <line 
                  x1="40" 
                  y1="15" 
                  x2={simState.day === "result" ? 280 : simState.day === 3 ? 160 : simState.day === 2 ? 40 : 40} 
                  stroke={GOLD} 
                  strokeWidth="2.5" 
                  style={{ transition: "all 0.5s ease" }}
                />
                
                {/* Day 1 Node */}
                <circle 
                  cx="40" 
                  cy="15" 
                  r="8" 
                  fill={simState.day1Choice ? (simState.day1Choice === "positive" ? "#4e7037" : "#ad4b37") : (simState.day === 1 ? "#fff" : "rgba(0,0,0,0.15)")} 
                  stroke={simState.day === 1 ? GOLD_DEEP : (simState.day1Choice ? "transparent" : "rgba(0,0,0,0.2)")}
                  strokeWidth="2"
                />
                <text x="40" y="28" fontSize="8" fontWeight="bold" textAnchor="middle" fill={INK_SECONDARY}>Day 1</text>

                {/* Day 2 Node */}
                <circle 
                  cx="160" 
                  cy="15" 
                  r="8" 
                  fill={simState.day2Choice ? (simState.day2Choice === "positive" ? "#4e7037" : "#ad4b37") : (simState.day === 2 ? "#fff" : "rgba(0,0,0,0.15)")} 
                  stroke={simState.day === 2 ? GOLD_DEEP : (simState.day2Choice ? "transparent" : "rgba(0,0,0,0.2)")}
                  strokeWidth="2"
                />
                <text x="160" y="28" fontSize="8" fontWeight="bold" textAnchor="middle" fill={INK_SECONDARY}>Day 2</text>

                {/* Day 3 Node */}
                <circle 
                  cx="280" 
                  cy="15" 
                  r="8" 
                  fill={simState.day3Choice ? (simState.day3Choice === "positive" ? "#4e7037" : "#ad4b37") : (simState.day === 3 ? "#fff" : "rgba(0,0,0,0.15)")} 
                  stroke={simState.day === 3 ? GOLD_DEEP : (simState.day3Choice ? "transparent" : "rgba(0,0,0,0.2)")}
                  strokeWidth="2"
                />
                <text x="280" y="28" fontSize="8" fontWeight="bold" textAnchor="middle" fill={INK_SECONDARY}>Day 3</text>
              </svg>

              {/* ATMOSPHERE DISPLAY */}
              {renderVisualSimulation()}

              {/* CURRENT STEP INDICATOR & INSTRUCTIONS */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 700 }}>
                  {simState.day === "result" ? "Trial Completed" : `Day ${simState.day} of 3 Observation`}
                </span>
              </div>

              {/* SIMULATION BODY */}
              {simState.day === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
                    The client places the {selectedGem.name} under their pillow or keeps it in direct skin contact. First night outcomes:
                  </p>
                  <button onClick={() => handleSimulationChoice("positive")} className="sim-btn" aria-label="Select Auspicious Outcome: Sleep was peaceful and calm. Had auspicious dreams of clean temple water.">
                    <strong>Auspicious Signs:</strong> Sleep was unusually peaceful and calm. Had auspicious dreams of clean temple water and spiritual icons.
                  </button>
                  <button onClick={() => handleSimulationChoice("negative")} className="sim-btn danger-btn" aria-label="Select Inauspicious Outcome: Experienced highly chaotic nightmares of falling or animal attacks.">
                    <strong>Inauspicious Signs:</strong> Experienced highly chaotic nightmares of falling, fire, or animal attacks. Woke up sweating with high anxiety.
                  </button>
                </div>
              )}

              {simState.day === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
                    Day 2: The client carries the stone during work hours. Observe events:
                  </p>
                  <button onClick={() => handleSimulationChoice("positive")} className="sim-btn" aria-label="Select Auspicious Outcome: Had a highly productive day and communications were smooth.">
                    <strong>Auspicious Signs:</strong> Had a highly productive day. Communications were smooth and resolved a long-standing block.
                  </button>
                  <button onClick={() => handleSimulationChoice("negative")} className="sim-btn danger-btn" aria-label="Select Inauspicious Outcome: Developed a sudden headache, dropped a glass cup, stubbed toe.">
                    <strong>Inauspicious Signs:</strong> Developed a sudden, pounding headache in the afternoon. Accidentally dropped a glass cup, shattering it, and stubbed toe.
                  </button>
                </div>
              )}

              {simState.day === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
                    Day 3: Final 24 hours of temporary contact. Evaluate symptoms:
                  </p>
                  <button onClick={() => handleSimulationChoice("positive")} className="sim-btn" aria-label="Select Auspicious Outcome: Felt mentally steady, grounded, and decisive.">
                    <strong>Auspicious Signs:</strong> Felt mentally steady, grounded, and decisive. Woke up feeling refreshed.
                  </button>
                  <button onClick={() => handleSimulationChoice("negative")} className="sim-btn danger-btn" aria-label="Select Inauspicious Outcome: Unexplained tightness in chest, high irritability, sudden argument.">
                    <strong>Inauspicious Signs:</strong> Unexplained tightness in chest, high irritability, and a sudden, intense argument with spouse.
                  </button>
                </div>
              )}

              {/* RESULTS PAGE */}
              {simState.day === "result" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {hasNegativeVibration ? (
                    <div style={{
                      background: "rgba(173, 75, 55, 0.05)",
                      border: "1.5px solid rgba(173, 75, 55, 0.25)",
                      borderRadius: "8px",
                      padding: "10px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px"
                    }} role="alert">
                      <ShieldAlert size={18} style={{ color: "#ad4b37", flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <strong style={{ fontSize: "11px", color: "#ad4b37" }}>Test Failed: Discontinue Wear Immediately</strong>
                        <p style={{ margin: "2px 0 0 0", fontSize: "10px", lineHeight: "1.4", color: "#762e21" }}>
                          Traditional guideline recommends **immediate removal** of the stone. Nightmare dreams, physical accidents, headaches, and sudden quarrels indicate the planet's amplified vibration is causing distress or triggering chart sensitivities.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      background: "rgba(78, 112, 55, 0.04)",
                      border: "1.5px solid rgba(78, 112, 55, 0.2)",
                      borderRadius: "8px",
                      padding: "10px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px"
                    }} role="alert">
                      <CheckSquare size={18} style={{ color: "#4e7037", flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <strong style={{ fontSize: "11px", color: "#4e7037" }}>Test Passed: Favourable Resonance</strong>
                        <p style={{ margin: "2px 0 0 0", fontSize: "10px", lineHeight: "1.4", color: "#344e24" }}>
                          Three days of temporary contact yielded peaceful sleep, high productivity, and steady focus. The traditional test suggests the client's body-mind system is in harmony with this amplified vibration.
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={resetSimulation}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      border: "none",
                      background: GOLD_DEEP,
                      color: "#ffffff",
                      fontSize: "10.5px",
                      fontWeight: 750,
                      cursor: "pointer"
                    }}
                  >
                    <RefreshCw size={10} /> Reset Simulator
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* TIER-1 ETHICAL BOUNDARY REMINDER */}
      <div style={{
        background: "rgba(173, 75, 55, 0.05)",
        border: "1.5px solid rgba(173, 75, 55, 0.25)",
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        alignItems: "flex-start",
        gap: "8px"
      }}>
        <AlertOctagon size={16} style={{ color: "#ad4b37", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#ad4b37", textTransform: "uppercase" }}>
            Pedagogical Disclaimer
          </span>
          <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#762e21" }}>
            The traditional test-period is presented as an observational Jyotiṣa methodology to protect consultees from harsh astrological heat. It is **not** a clinical diagnostic or medical check. Skin allergies to setting metals must always be addressed by dermatological guidelines.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(156,122,47,0.08)",
        paddingTop: "8px",
        fontSize: "10px",
        color: INK_MUTED
      }}>
        <span>Grahvani Learning Runtime (Chapter 4)</span>
        <span>Gemstone Safety & Test-Period Simulator</span>
      </div>
    </div>
  );
}
