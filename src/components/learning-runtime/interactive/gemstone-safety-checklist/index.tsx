"use client";

import React, { useState } from "react";
import { AlertCircle, ShieldAlert, Heart, Calendar, CheckSquare, RefreshCw, AlertOctagon, HelpCircle } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

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
  day1Choice: string | null;
  day2Choice: string | null;
  day3Choice: string | null;
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

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* CHECK 1 */}
            <div
              onClick={() => handleToggleCheck("heat")}
              className={`check-item ${checklist.heat ? "active" : ""}`}
            >
              <input type="checkbox" checked={checklist.heat} readOnly style={{ pointerEvents: "none" }} />
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
            >
              <input type="checkbox" checked={checklist.durability} readOnly style={{ pointerEvents: "none" }} />
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
            >
              <input type="checkbox" checked={checklist.allergen} readOnly style={{ pointerEvents: "none" }} />
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
            >
              <input type="checkbox" checked={checklist.cost} readOnly style={{ pointerEvents: "none" }} />
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
              minHeight: "180px",
              textAlign: "center",
              padding: "10px",
              background: "rgba(0,0,0,0.02)",
              border: "1px dashed rgba(0,0,0,0.1)",
              borderRadius: "8px"
            }}>
              <Heart size={24} style={{ color: GOLD_DEEP, marginBottom: "6px" }} />
              <strong style={{ fontSize: "11.5px" }}>Gentle Resonance Stone</strong>
              <p style={{ margin: "4px 0 0 0", fontSize: "10.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                {selectedGem.name} is a gentler stone. Traditional test-periods are mostly prescribed for potent, fast-acting stones like **Blue Sapphire** and **Diamond**. Choose Blue Sapphire to run the simulator.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* CURRENT STEP INDICATOR */}
              <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 700 }}>
                  {simState.day === "result" ? "Trial Completed" : `Day ${simState.day} of 3`}
                </span>
                <div style={{ display: "flex", gap: "3px" }}>
                  {[1, 2, 3].map(d => (
                    <div
                      key={d}
                      style={{
                        width: "16px",
                        height: "4px",
                        borderRadius: "2px",
                        background: simState.day === "result" || (typeof simState.day === "number" && simState.day >= d)
                          ? GOLD_DEEP 
                          : "rgba(0,0,0,0.1)"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* SIMULATION BODY */}
              {simState.day === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
                    The client places the {selectedGem.name} under their pillow or keeps it in direct skin contact. First night outcomes:
                  </p>
                  <button onClick={() => handleSimulationChoice("positive")} className="sim-btn">
                    <strong>Auspicious Signs:</strong> Sleep was unusually peaceful and calm. Had auspicious dreams of clean temple water and spiritual icons.
                  </button>
                  <button onClick={() => handleSimulationChoice("negative")} className="sim-btn danger-btn">
                    <strong>Inauspicious Signs:</strong> Experienced highly chaotic nightmares of falling, fire, or animal attacks. Woke up sweating with high anxiety.
                  </button>
                </div>
              )}

              {simState.day === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
                    Day 2: The client carries the stone during work hours. Observe events:
                  </p>
                  <button onClick={() => handleSimulationChoice("positive")} className="sim-btn">
                    <strong>Auspicious Signs:</strong> Had a highly productive day. Communications were smooth and resolved a long-standing block.
                  </button>
                  <button onClick={() => handleSimulationChoice("negative")} className="sim-btn danger-btn">
                    <strong>Inauspicious Signs:</strong> Developed a sudden, pounding headache in the afternoon. Accidentally dropped a glass cup, shattering it, and stubbed toe.
                  </button>
                </div>
              )}

              {simState.day === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
                    Day 3: Final 24 hours of temporary contact. Evaluate symptoms:
                  </p>
                  <button onClick={() => handleSimulationChoice("positive")} className="sim-btn">
                    <strong>Auspicious Signs:</strong> Felt mentally steady, grounded, and decisive. Woke up feeling refreshed.
                  </button>
                  <button onClick={() => handleSimulationChoice("negative")} className="sim-btn danger-btn">
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
                    }}>
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
                    }}>
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
