"use client";

import { useState } from "react";
import { HelpCircle, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, BookOpen, Compass, Shield, DollarSign, Heart, FileText, Check, X } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_LIGHT = "rgba(156, 122, 47, 0.08)";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";

interface DojoScenario {
  id: string;
  title: string;
  question: string;
  choices: {
    text: string;
    type: "scoffing" | "mystification" | "balanced";
    feedback: string;
  }[];
}

const DOJO_SCENARIOS: DojoScenario[] = [
  {
    id: "c-sc-1",
    title: "Scenario 1: Driver Steering Commission",
    question: "Upon arriving at Hoshiarpur station, your taxi driver insists: 'Your booked reader has duplicate records. Let me drive you to my cousin's center, they have the true ancient Bhrigu library.' What do you do?",
    choices: [
      {
        text: "Follow the driver. A local driver knows the spiritual landscape better than online reviews or family references.",
        type: "mystification",
        feedback: "Incorrect. This falls for commission steering. Drivers are motivated by a commission payout, which steers clients to high-commission centers rather than honest ones."
      },
      {
        text: "Politely refuse and stick to your verified reference. Explain that commission steering is a common economic pressure in pilgrimage towns.",
        type: "balanced",
        feedback: "Correct! Stick to your verified due-diligence reference. Avoid steering traps driven by commission networks."
      },
      {
        text: "Report the driver to the municipal authorities immediately, calling the entire town a den of thieves.",
        type: "scoffing",
        feedback: "Incorrect. This represents Scoffing. It reacts with aggressive hostility instead of quietly applying commercial boundaries."
      }
    ]
  },
  {
    id: "c-sc-2",
    title: "Scenario 2: The Family Remedy Cascade",
    question: "After giving a client a reading, the reader says: 'Your Saturn curse is cleared, but your daughter has a dark configuration. Scribe a separate leaf for her for ₹45,000 to prevent a marriage block.' How do you guide them?",
    choices: [
      {
        text: "Refuse the cascade. This is the family upsell pattern. Let your daughter choose her own path, and refuse to commit money under sudden emotional pressure.",
        type: "balanced",
        feedback: "Correct! The family-pressure cascade targets dependents to build financial commitment. Keep the choice with the client and refuse room pressure."
      },
      {
        text: "Pay the fee. A parent's primary duty is to clear spiritual blocks for their children at any cost.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. It allows family pressure to drive a major financial decision under the guise of parental duty."
      },
      {
        text: "Accuse the reader of blackmail and storm out of the office to warn others in the temple town.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It reacts with anger instead of quietly applying the due diligence limits."
      }
    ]
  }
];

export function NadiCommercialExplorer() {
  const [activeTab, setActiveTab] = useState<"simulator" | "dojo">("simulator");
  const [simStep, setSimStep] = useState<number>(1);

  // Seeker State Gauges
  const [budget, setBudget] = useState<number>(20000);
  const [fearLevel, setFearLevel] = useState<number>(20);
  const [scamAlert, setScamAlert] = useState<string | null>(null);

  // Pre-Reading Checklist Shields
  const [priceShield, setPriceShield] = useState(false);
  const [recordingShield, setRecordingShield] = useState(false);
  const [lineageShield, setLineageShield] = useState(false);

  // Dojo State variables
  const [dojoIdx, setDojoIdx] = useState(0);
  const [selectedDojoChoice, setSelectedDojoChoice] = useState<number | null>(null);
  const [showDojoFeedback, setShowDojoFeedback] = useState(false);

  const resetDojo = () => {
    setDojoIdx(0);
    setSelectedDojoChoice(null);
    setShowDojoFeedback(false);
  };

  const handleResetSim = () => {
    setSimStep(1);
    setBudget(20000);
    setFearLevel(20);
    setScamAlert(null);
    setPriceShield(false);
    setRecordingShield(false);
    setLineageShield(false);
  };

  const currentDojo = DOJO_SCENARIOS[dojoIdx];

  // Simulator choices trigger actions
  const triggerAction = (action: "driver-yes" | "driver-no" | "room-pay" | "room-refuse") => {
    if (simStep === 1) {
      if (action === "driver-yes") {
        setBudget((prev) => prev - 500);
        setFearLevel((prev) => Math.min(100, prev + 20));
        setScamAlert("Taxi driver commission steering active. Led to high-upsell reading center.");
        setSimStep(2);
      } else {
        setFearLevel((prev) => Math.max(0, prev - 10));
        setSimStep(2);
      }
    } else if (simStep === 3) {
      if (action === "room-pay") {
        setBudget((prev) => Math.max(0, prev - 15000));
        setFearLevel((prev) => Math.max(0, prev - 30)); // False relief
        setScamAlert("Warning: Accepted ₹15,000 exorbitant remedy. Classic conflict of interest upsell.");
        setSimStep(4);
      } else {
        setFearLevel((prev) => Math.max(0, prev - 10));
        setScamAlert("Refused fear-induction. Integrity shield intact. You walk away safely.");
        setSimStep(4);
      }
    }
  };

  return (
    <div className="gl-surface-twilight-glass" style={{ background: "#FAF6EB", border: `2px solid ${GOLD}`, borderRadius: "12px", padding: "24px", color: INK_PRIMARY, fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(156,122,47,0.15)", paddingBottom: "16px", marginBottom: "20px" }}>
        <div>
          <h3 style={{ margin: 0, color: GOLD_DEEP, fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "8px" }}>
            <Compass size={24} style={{ color: GOLD }} /> NĀḌĪ COMMERCIAL EXPLORER
          </h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "13.5px", color: INK_SECONDARY }}>
            Trace Vaitheeswarankoil's tourism economy, steering networks, and identify room upsell pressure.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", background: "rgba(156,122,47,0.08)", padding: "4px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.15)" }}>
          <button
            onClick={() => setActiveTab("simulator")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              background: activeTab === "simulator" ? "#fff" : "transparent",
              color: activeTab === "simulator" ? GOLD_DEEP : INK_SECONDARY,
              border: "none",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer",
              boxShadow: activeTab === "simulator" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
              transition: "all 0.2s"
            }}
          >
            Pilgrimage Simulator
          </button>
          <button
            onClick={() => {
              setActiveTab("dojo");
              setSelectedDojoChoice(null);
              setShowDojoFeedback(false);
            }}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              background: activeTab === "dojo" ? "#fff" : "transparent",
              color: activeTab === "dojo" ? GOLD_DEEP : INK_SECONDARY,
              border: "none",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer",
              boxShadow: activeTab === "dojo" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
              transition: "all 0.2s"
            }}
          >
            Commercial Dojo
          </button>
        </div>
      </div>

      {activeTab === "simulator" ? (
        /* Simulator Tab */
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
          
          {/* Left Panel: Roadmap & Interaction */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* Step Roadmap */}
            <div style={{ display: "flex", gap: "6px", overflow: "visible" }}>
              {[
                { s: 1, name: "Arrival" },
                { s: 2, name: "Steeling" },
                { s: 3, name: "Reading Room" },
                { s: 4, name: "Exit" }
              ].map((stepObj) => (
                <div 
                  key={stepObj.s} 
                  style={{ 
                    flex: 1, 
                    padding: "6px", 
                    borderRadius: "4px", 
                    background: simStep === stepObj.s ? GOLD : "rgba(156,122,47,0.08)",
                    border: simStep === stepObj.s ? "none" : "1px solid rgba(156,122,47,0.15)",
                    color: simStep === stepObj.s ? "#fff" : INK_SECONDARY,
                    fontSize: "11px",
                    fontWeight: 700,
                    textAlign: "center",
                    transition: "all 0.3s"
                  }}
                >
                  {stepObj.s}. {stepObj.name}
                </div>
              ))}
            </div>

            {/* Stage Box Content */}
            <div style={{ background: "#fff", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "16px", minHeight: "180px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              
              {simStep === 1 && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: GOLD_DEEP, fontSize: "14px", fontWeight: 700 }}>Stage 1: Arrival & Auto Steering</h4>
                  <p style={{ margin: "0 0 16px 0", fontSize: "12.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
                    You step off the train at Vaitheeswarankoil. An auto driver grabs your bags: 
                    <em style={{ display: "block", marginTop: "6px", color: INK_PRIMARY }}>"Sir, the reader center you booked has faked palm leaves. Let me drive you to my cousin's library. I get you direct access to hereditary Agastya bundles for a discount!"</em>
                  </p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                      onClick={() => triggerAction("driver-yes")}
                      style={{ flex: 1, padding: "10px", borderRadius: "6px", background: RED, color: "#fff", border: "none", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}
                    >
                      Follow Driver (Steer Route)
                    </button>
                    <button 
                      onClick={() => triggerAction("driver-no")}
                      style={{ flex: 1, padding: "10px", borderRadius: "6px", background: GREEN, color: "#fff", border: "none", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}
                    >
                      Stick to Booked Center
                    </button>
                  </div>
                </div>
              )}

              {simStep === 2 && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: GOLD_DEEP, fontSize: "14px", fontWeight: 700 }}>Stage 2: Steeling & Checklist Shields</h4>
                  <p style={{ margin: "0 0 16px 0", fontSize: "12.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
                    Before sitting in the reading room, establish your **Checklist Shields** to neutralize upsell pressure. Enable checks:
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                      <input type="checkbox" checked={lineageShield} onChange={(e) => setLineageShield(e.target.checked)} style={{ accentColor: GOLD }} />
                      <span><strong>Lineage reference check</strong> (Verifies hereditary successor)</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                      <input type="checkbox" checked={priceShield} onChange={(e) => setPriceShield(e.target.checked)} style={{ accentColor: GOLD }} />
                      <span><strong>Written Price Lock</strong> (Secures per-kāṇḍa fees upfront)</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                      <input type="checkbox" checked={recordingShield} onChange={(e) => setRecordingShield(e.target.checked)} style={{ accentColor: GOLD }} />
                      <span><strong>Recording permission confirmed</strong> (Secures session record)</span>
                    </label>
                  </div>
                  <button 
                    onClick={() => setSimStep(3)}
                    style={{ padding: "10px", borderRadius: "6px", background: GOLD, color: "#fff", border: "none", width: "100%", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}
                  >
                    Enter Reading Room <ArrowRight size={14} style={{ display: "inline", marginLeft: "4px" }} />
                  </button>
                </div>
              )}

              {simStep === 3 && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: GOLD_DEEP, fontSize: "14px", fontWeight: 700 }}>Stage 3: The Pitch ( Saturn Remedy )</h4>
                  <p style={{ margin: "0 0 16px 0", fontSize: "12.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
                    The reader states: 
                    <em style={{ display: "block", marginTop: "6px", color: INK_PRIMARY }}>"A severe planetary Saturn doṣa is written on your leaf! Your career will collapse within 3 months. To avert tragedy, you must pay ₹15,000 today for a shanti-puja conducted by our temple priests."</em>
                  </p>
                  
                  {priceShield && recordingShield ? (
                    <div style={{ background: "rgba(47,125,85,0.06)", border: `1px solid ${GREEN}`, padding: "8px 12px", borderRadius: "6px", fontSize: "12px", color: GREEN, marginBottom: "16px" }}>
                      <strong>✓ Pre-Check shields active!</strong> Your written price lock and recording record allow you to calmly refuse the sudden crisis upsell.
                    </div>
                  ) : null}

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                      onClick={() => triggerAction("room-pay")}
                      disabled={priceShield && recordingShield}
                      style={{ flex: 1, padding: "10px", borderRadius: "6px", background: RED, color: "#fff", border: "none", fontWeight: 600, fontSize: "12px", cursor: priceShield && recordingShield ? "not-allowed" : "pointer", opacity: priceShield && recordingShield ? 0.4 : 1 }}
                    >
                      Pay ₹15,000 for Puja
                    </button>
                    <button 
                      onClick={() => triggerAction("room-refuse")}
                      style={{ flex: 1, padding: "10px", borderRadius: "6px", background: GREEN, color: "#fff", border: "none", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}
                    >
                      Refuse & Exit
                    </button>
                  </div>
                </div>
              )}

              {simStep === 4 && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: GOLD_DEEP, fontSize: "14px", fontWeight: 700 }}>Stage 4: Exit & Review</h4>
                  <p style={{ margin: "0 0 16px 0", fontSize: "12.5px", lineHeight: "1.4", color: INK_SECONDARY }}>
                    The pilgrimage simulation is complete. Settle down and review your safety score.
                  </p>
                  <button 
                    onClick={handleResetSim}
                    style={{ padding: "10px", borderRadius: "6px", background: GOLD, color: "#fff", border: "none", width: "100%", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}
                  >
                    Run Simulation Again
                  </button>
                </div>
              )}

            </div>

          </div>

          {/* Right Panel: Gauges and checklist shield assets */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* Status Gauges */}
            <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                Seeker Safety Gauges
              </span>

              {/* Seeker Budget */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, color: INK_SECONDARY }}>Seeker Budget:</span>
                  <span style={{ fontWeight: 700, color: GOLD_DEEP }}>₹{budget.toLocaleString()}</span>
                </div>
                <div style={{ height: "8px", borderRadius: "4px", background: "#FAF6EB", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)" }}>
                  <div style={{ height: "100%", width: `${(budget / 20000) * 100}%`, background: budget < 10000 ? RED : GREEN, transition: "width 0.4s ease" }} />
                </div>
              </div>

              {/* Seeker Fear Level */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, color: INK_SECONDARY }}>Fear/Crisis Level:</span>
                  <span style={{ fontWeight: 700, color: fearLevel > 50 ? RED : GREEN }}>{fearLevel}%</span>
                </div>
                <div style={{ height: "8px", borderRadius: "4px", background: "#FAF6EB", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)" }}>
                  <div style={{ height: "100%", width: `${fearLevel}%`, background: fearLevel > 50 ? RED : GREEN, transition: "width 0.4s ease" }} />
                </div>
              </div>

              {/* Dynamic Alerts */}
              {scamAlert && (
                <div style={{ padding: "10px", borderRadius: "6px", background: "rgba(156,122,47,0.06)", border: `1px solid ${GOLD}`, fontSize: "11.5px", color: INK_SECONDARY, lineHeight: "1.3" }}>
                  {scamAlert}
                </div>
              )}
            </div>

            {/* Checklist Shields Visualization */}
            <div style={{ background: "#fff", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                Checklist Shields Status
              </span>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", color: lineageShield ? GREEN : INK_MUTED }}>
                  <span>{lineageShield ? "✓" : "○"}</span>
                  <span>1. Lineage Referral Check</span>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", color: priceShield ? GREEN : INK_MUTED }}>
                  <span>{priceShield ? "✓" : "○"}</span>
                  <span>2. Written Price Lock</span>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", color: recordingShield ? GREEN : INK_MUTED }}>
                  <span>{recordingShield ? "✓" : "○"}</span>
                  <span>3. Recording Permit</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Dojo Tab */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minHeight: "380px" }}>
          <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                {currentDojo.title}
              </span>
              <span style={{ fontSize: "11px", color: INK_MUTED }}>
                {dojoIdx + 1} of {DOJO_SCENARIOS.length}
              </span>
            </div>

            <p style={{ fontSize: "14.5px", color: INK_PRIMARY, fontWeight: 600, margin: "0 0 20px" }}>
              {currentDojo.question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {currentDojo.choices.map((c, idx) => {
                const isSelected = selectedDojoChoice === idx;
                let borderColor = "rgba(156, 122, 47, 0.25)";
                let bg = "#fff";
                if (showDojoFeedback && isSelected) {
                  borderColor = c.type === "balanced" ? GREEN : RED;
                  bg = c.type === "balanced" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)";
                } else if (isSelected) {
                  borderColor = GOLD;
                  bg = "rgba(156,122,47,0.04)";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDojoChoice(idx);
                      setShowDojoFeedback(true);
                    }}
                    style={{
                      textAlign: "left",
                      padding: "14px",
                      borderRadius: "8px",
                      border: `1.5px solid ${borderColor}`,
                      background: bg,
                      fontSize: "13.5px",
                      color: INK_PRIMARY,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px"
                    }}
                  >
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: `1.5px solid ${GOLD}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: "bold",
                        background: isSelected ? GOLD : "transparent",
                        color: isSelected ? "#fff" : GOLD,
                        flexShrink: 0,
                        marginTop: "1px"
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span style={{ lineHeight: "1.4" }}>{c.text}</span>
                  </button>
                );
              })}
            </div>

            {showDojoFeedback && selectedDojoChoice !== null && (
              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: currentDojo.choices[selectedDojoChoice].type === "balanced" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)",
                    border: `1px solid ${currentDojo.choices[selectedDojoChoice].type === "balanced" ? GREEN : RED}`,
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start"
                  }}
                >
                  {currentDojo.choices[selectedDojoChoice].type === "balanced" ? (
                    <CheckCircle2 size={20} style={{ color: GREEN, flexShrink: 0 }} />
                  ) : (
                    <ShieldAlert size={20} style={{ color: RED, flexShrink: 0 }} />
                  )}
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: currentDojo.choices[selectedDojoChoice].type === "balanced" ? GREEN : RED }}>
                      {currentDojo.choices[selectedDojoChoice].type === "balanced" ? "CORRECT DISCERNMENT" : "TRAP WARNING"}
                    </h4>
                    <p style={{ margin: 0, fontSize: "13.5px", color: INK_PRIMARY, lineHeight: "1.45" }}>
                      {currentDojo.choices[selectedDojoChoice].feedback}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                  {dojoIdx < DOJO_SCENARIOS.length - 1 ? (
                    <button
                      onClick={() => {
                        setShowDojoFeedback(false);
                        setSelectedDojoChoice(null);
                        setDojoIdx((prev) => prev + 1);
                      }}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        background: GREEN,
                        color: "#fff",
                        border: "none",
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: "pointer"
                      }}
                    >
                      Next Scenario
                    </button>
                  ) : (
                    <button
                      onClick={resetDojo}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        background: GREEN,
                        color: "#fff",
                        border: "none",
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: "pointer"
                      }}
                    >
                      <RefreshCw size={14} /> Reset Dojo
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
