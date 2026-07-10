"use client";

import { useState } from "react";
import { HelpCircle, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, Search, Plus, Trash2 } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_LIGHT = "rgba(156, 122, 47, 0.08)";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";

interface SandboxScenario {
  id: string;
  question: string;
  choices: {
    text: string;
    type: "scoffing" | "mystification" | "balanced";
    feedback: string;
  }[];
}

const SCENARIO: SandboxScenario = {
  id: "s1",
  question: "A client visited two Hoshiarpur Bhṛgu families and received materially different readings. They ask you: 'I got two different readings for the same birth chart. Is one of them a fraud?' How do you respond?",
  choices: [
    {
      text: "Yes, this proves the Hoshiarpur readers are frauds. Since the readings contradict, the system is a scam.",
      type: "scoffing",
      feedback: "Incorrect. This represents Scoffing. It fails to recognize that independent collections are expected to differ. Disagreement is not, by itself, evidence of fraud."
    },
    {
      text: "One family must hold the absolute, original manuscript written by Sage Bhṛgu, while the other holds a fake copy.",
      type: "mystification",
      feedback: "Incorrect. This represents Mystification. It tries to force a 'one-true-school' authority claim, collapsing the distinction between tradition-internal claims and historical facts."
    },
    {
      text: "Divergence is expected because each family holds its own separate manuscript collection. Acknowledge both collections exist honestly, and advise the client to never base major life decisions on a single reading.",
      type: "balanced",
      feedback: "Correct! This is Balanced Holding. It respects the lineage collections as documented practice (Layer A) without endorsing the literal mechanism as fact (Layer B), and handles cross-family variations correctly."
    }
  ]
};

// Available planets to place in the chart
const PLANETS = ["Sun", "Moon", "Jupiter", "Saturn", "Mercury", "Venus", "Mars"];

export function BhriguFlow() {
  const [activeTab, setActiveTab] = useState<"flow" | "sandbox">("flow");
  const [step, setStep] = useState<number>(1);
  const [clientName, setClientName] = useState<string>("Srinivas");
  const [searchStatus, setSearchStatus] = useState<string>("");

  // Interactive Chart State: Mapping house number (1-12) to list of planets
  const [chartPlacements, setChartPlacements] = useState<Record<number, string[]>>({
    1: ["Lagna", "Sun"],
    10: ["Moon"],
    4: ["Jupiter"],
    7: ["Saturn"]
  });

  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [selectedPlanetToAdd, setSelectedPlanetToAdd] = useState<string>("Sun");

  // Tab 2 state
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showSandboxFeedback, setShowSandboxFeedback] = useState<boolean>(false);

  const startSearch = () => {
    setStep(3);
    setSearchStatus("Analyzing chart configuration...");
    setTimeout(() => {
      setSearchStatus("Matching planetary positions against Hoshiarpur archives...");
      setTimeout(() => {
        setSearchStatus("Manuscript located! Retrieving leaf...");
        setTimeout(() => {
          setStep(4);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const addPlanetToHouse = (house: number, planet: string) => {
    setChartPlacements((prev) => {
      const current = prev[house] || [];
      if (current.includes(planet)) return prev;
      return { ...prev, [house]: [...current, planet] };
    });
  };

  const removePlanetFromHouse = (house: number, planet: string) => {
    if (planet === "Lagna") return; // Keep Lagna fixed in House 1 by convention
    setChartPlacements((prev) => {
      const current = prev[house] || [];
      return { ...prev, [house]: current.filter((p) => p !== planet) };
    });
  };

  const resetFlow = () => {
    setStep(1);
    setSearchStatus("");
    setChartPlacements({
      1: ["Lagna", "Sun"],
      10: ["Moon"],
      4: ["Jupiter"],
      7: ["Saturn"]
    });
    setSelectedHouse(null);
  };

  // Generate dynamic readings based on current placements
  const generateReadings = () => {
    const readings = [];
    // Check if Sun is in H1
    if (chartPlacements[1]?.includes("Sun")) {
      readings.push({
        sanskrit: "मेषलग्ने सदा सूरः तनुभावस्थितो भवेत् ।",
        translit: "meṣalagne sadā sūraḥ tanubhāvasthito bhavet |",
        translation: "The Sun is situated in the first house of the birth chart (Tanu Bhāva)."
      });
    }
    // Check if Moon is in H10
    if (chartPlacements[10]?.includes("Moon")) {
      readings.push({
        sanskrit: "कर्मस्थाने यदा चन्द्रः कीर्तिमान् जायते नरः ॥",
        translit: "karmasthāne yadā candraḥ kīrtimān jāyate naraḥ ||",
        translation: "With the Moon placed in the tenth house of actions, the native attains great fame and respect."
      });
    }
    // General reading placeholder if chart is empty or custom
    if (readings.length === 0) {
      // Find where Sun is
      let sunHouse = Object.keys(chartPlacements).find(h => chartPlacements[Number(h)]?.includes("Sun"));
      let moonHouse = Object.keys(chartPlacements).find(h => chartPlacements[Number(h)]?.includes("Moon"));
      
      readings.push({
        sanskrit: `ग्रहसंयोगतः पत्रं भृगुणा लिखितं पुरा ।`,
        translit: "grahasaṁyogataḥ patraṁ bhṛguṇā likhitaṁ purā |",
        translation: `A custom leaf configuration located matching Sun in House ${sunHouse || "Unknown"} and Moon in House ${moonHouse || "Unknown"}.`
      });
      readings.push({
        sanskrit: "भाग्यवृद्धिं च लभते भृगोश्च वचनात् सदा ॥",
        translit: "bhāgyavṛddhiṁ ca labhate bhṛgośca vacanāt sadā ||",
        translation: "Through the pre-recorded words of Sage Bhṛgu, the native's fortune will rise after obstacles are cleared."
      });
    }
    return readings;
  };

  // Helper to check if a house has planets
  const getHouseText = (house: number) => {
    const list = chartPlacements[house] || [];
    return list.join(", ");
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 246, 0.8)",
        border: "1px solid rgba(156, 122, 47, 0.25)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto"
      }}
      data-interactive="bhrigu-flow"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px", marginBottom: "20px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 20 — Chapter 2 — Lesson 1
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Bhṛgu Saṁhitā Consultation Conduit
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Configure the North-Indian chart layout, search the manuscript vaults by configuration, and resolve family variations.
        </p>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("flow")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            background: activeTab === "flow" ? GOLD : "rgba(156, 122, 47, 0.06)",
            color: activeTab === "flow" ? "#fff" : GOLD_DEEP,
            border: "none",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Flow Simulator
        </button>
        <button
          onClick={() => setActiveTab("sandbox")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            background: activeTab === "sandbox" ? GOLD : "rgba(156, 122, 47, 0.06)",
            color: activeTab === "sandbox" ? "#fff" : GOLD_DEEP,
            border: "none",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Variation Sandbox
        </button>
      </div>

      {activeTab === "flow" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: "24px", minHeight: "440px" }}>
          {/* Left Panel: Steps & SVG drawing */}
          <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                Interactive Parāśari Chart (North Indian Grid)
              </span>

              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                      <label style={{ fontSize: "11px", fontWeight: 600, color: INK_SECONDARY }}>Client Name:</label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: "1px solid rgba(156, 122, 47, 0.3)",
                          background: "#fff",
                          fontSize: "13px",
                          color: INK_PRIMARY
                        }}
                      />
                    </div>
                  </div>
                  <p style={{ margin: "4px 0", fontSize: "12px", color: INK_SECONDARY }}>
                    Click on any house in the chart below to manage its planet placements:
                  </p>
                </div>
              )}

              {/* Interactive SVG Chart Drawing */}
              <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
                <svg viewBox="0 0 240 240" width="230" height="230" style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "8px", boxShadow: "0 4px 12px rgba(156,122,47,0.05)" }}>
                  {/* Outer Frame */}
                  <rect x="0" y="0" width="240" height="240" fill="none" stroke={GOLD} strokeWidth="1.5" />
                  
                  {/* Diagonals */}
                  <line x1="0" y1="0" x2="240" y2="240" stroke={GOLD} strokeWidth="1" />
                  <line x1="240" y1="0" x2="0" y2="240" stroke={GOLD} strokeWidth="1" />
                  
                  {/* Inner Diamond */}
                  <polygon points="120,0 240,120 120,240 0,120" fill="none" stroke={GOLD} strokeWidth="1" />

                  {/* House interactive click targets & text */}
                  {/* H1 (1st house - Top Center) */}
                  <g onClick={() => step === 1 && setSelectedHouse(1)} style={{ cursor: step === 1 ? "pointer" : "default" }}>
                    <polygon points="120,0 180,60 120,120 60,60" fill={selectedHouse === 1 ? "rgba(156,122,47,0.1)" : "transparent"} />
                    <text x="120" y="50" textAnchor="middle" fontSize="9" fontWeight="bold" fill={GOLD_DEEP}>{getHouseText(1)}</text>
                    <text x="120" y="32" textAnchor="middle" fontSize="7" fill={INK_MUTED}>H1 (Lagna)</text>
                  </g>

                  {/* H2 (top-left inner triangle) */}
                  <g onClick={() => step === 1 && setSelectedHouse(2)} style={{ cursor: step === 1 ? "pointer" : "default" }}>
                    <polygon points="0,0 120,0 60,60" fill={selectedHouse === 2 ? "rgba(156,122,47,0.1)" : "transparent"} />
                    <text x="60" y="38" textAnchor="middle" fontSize="9" fontWeight="bold" fill={GOLD_DEEP}>{getHouseText(2)}</text>
                    <text x="60" y="20" textAnchor="middle" fontSize="7" fill={INK_MUTED}>H2</text>
                  </g>

                  {/* H3 (left-top outer triangle) */}
                  <g onClick={() => step === 1 && setSelectedHouse(3)} style={{ cursor: step === 1 ? "pointer" : "default" }}>
                    <polygon points="0,0 0,120 60,60" fill={selectedHouse === 3 ? "rgba(156,122,47,0.1)" : "transparent"} />
                    <text x="25" y="68" textAnchor="middle" fontSize="9" fontWeight="bold" fill={GOLD_DEEP}>{getHouseText(3)}</text>
                    <text x="20" y="50" textAnchor="middle" fontSize="7" fill={INK_MUTED}>H3</text>
                  </g>

                  {/* H4 (left center diamond) */}
                  <g onClick={() => step === 1 && setSelectedHouse(4)} style={{ cursor: step === 1 ? "pointer" : "default" }}>
                    <polygon points="0,120 60,60 120,120 60,180" fill={selectedHouse === 4 ? "rgba(156,122,47,0.1)" : "transparent"} />
                    <text x="60" y="125" textAnchor="middle" fontSize="9" fontWeight="bold" fill={GOLD_DEEP}>{getHouseText(4)}</text>
                    <text x="60" y="105" textAnchor="middle" fontSize="7" fill={INK_MUTED}>H4</text>
                  </g>

                  {/* H5 (left-bottom outer triangle) */}
                  <g onClick={() => step === 1 && setSelectedHouse(5)} style={{ cursor: step === 1 ? "pointer" : "default" }}>
                    <polygon points="0,240 0,120 60,180" fill={selectedHouse === 5 ? "rgba(156,122,47,0.1)" : "transparent"} />
                    <text x="25" y="196" textAnchor="middle" fontSize="9" fontWeight="bold" fill={GOLD_DEEP}>{getHouseText(5)}</text>
                    <text x="20" y="178" textAnchor="middle" fontSize="7" fill={INK_MUTED}>H5</text>
                  </g>

                  {/* H6 (bottom-left inner triangle) */}
                  <g onClick={() => step === 1 && setSelectedHouse(6)} style={{ cursor: step === 1 ? "pointer" : "default" }}>
                    <polygon points="0,240 120,240 60,180" fill={selectedHouse === 6 ? "rgba(156,122,47,0.1)" : "transparent"} />
                    <text x="60" y="233" textAnchor="middle" fontSize="9" fontWeight="bold" fill={GOLD_DEEP}>{getHouseText(6)}</text>
                    <text x="60" y="215" textAnchor="middle" fontSize="7" fill={INK_MUTED}>H6</text>
                  </g>

                  {/* H7 (bottom center diamond) */}
                  <g onClick={() => step === 1 && setSelectedHouse(7)} style={{ cursor: step === 1 ? "pointer" : "default" }}>
                    <polygon points="120,240 180,180 120,120 60,180" fill={selectedHouse === 7 ? "rgba(156,122,47,0.1)" : "transparent"} />
                    <text x="120" y="185" textAnchor="middle" fontSize="9" fontWeight="bold" fill={GOLD_DEEP}>{getHouseText(7)}</text>
                    <text x="120" y="205" textAnchor="middle" fontSize="7" fill={INK_MUTED}>H7</text>
                  </g>

                  {/* H8 (bottom-right inner triangle) */}
                  <g onClick={() => step === 1 && setSelectedHouse(8)} style={{ cursor: step === 1 ? "pointer" : "default" }}>
                    <polygon points="240,240 120,240 180,180" fill={selectedHouse === 8 ? "rgba(156,122,47,0.1)" : "transparent"} />
                    <text x="180" y="233" textAnchor="middle" fontSize="9" fontWeight="bold" fill={GOLD_DEEP}>{getHouseText(8)}</text>
                    <text x="180" y="215" textAnchor="middle" fontSize="7" fill={INK_MUTED}>H8</text>
                  </g>

                  {/* H9 (right-bottom outer triangle) */}
                  <g onClick={() => step === 1 && setSelectedHouse(9)} style={{ cursor: step === 1 ? "pointer" : "default" }}>
                    <polygon points="240,240 240,120 180,180" fill={selectedHouse === 9 ? "rgba(156,122,47,0.1)" : "transparent"} />
                    <text x="215" y="196" textAnchor="middle" fontSize="9" fontWeight="bold" fill={GOLD_DEEP}>{getHouseText(9)}</text>
                    <text x="220" y="178" textAnchor="middle" fontSize="7" fill={INK_MUTED}>H9</text>
                  </g>

                  {/* H10 (right center diamond) */}
                  <g onClick={() => step === 1 && setSelectedHouse(10)} style={{ cursor: step === 1 ? "pointer" : "default" }}>
                    <polygon points="240,120 180,60 120,120 180,180" fill={selectedHouse === 10 ? "rgba(156,122,47,0.1)" : "transparent"} />
                    <text x="180" y="125" textAnchor="middle" fontSize="9" fontWeight="bold" fill={GOLD_DEEP}>{getHouseText(10)}</text>
                    <text x="180" y="105" textAnchor="middle" fontSize="7" fill={INK_MUTED}>H10</text>
                  </g>

                  {/* H11 (right-top outer triangle) */}
                  <g onClick={() => step === 1 && setSelectedHouse(11)} style={{ cursor: step === 1 ? "pointer" : "default" }}>
                    <polygon points="240,0 240,120 180,60" fill={selectedHouse === 11 ? "rgba(156,122,47,0.1)" : "transparent"} />
                    <text x="215" y="68" textAnchor="middle" fontSize="9" fontWeight="bold" fill={GOLD_DEEP}>{getHouseText(11)}</text>
                    <text x="220" y="50" textAnchor="middle" fontSize="7" fill={INK_MUTED}>H11</text>
                  </g>

                  {/* H12 (top-right inner triangle) */}
                  <g onClick={() => step === 1 && setSelectedHouse(12)} style={{ cursor: step === 1 ? "pointer" : "default" }}>
                    <polygon points="240,0 120,0 180,60" fill={selectedHouse === 12 ? "rgba(156,122,47,0.1)" : "transparent"} />
                    <text x="180" y="38" textAnchor="middle" fontSize="9" fontWeight="bold" fill={GOLD_DEEP}>{getHouseText(12)}</text>
                    <text x="180" y="20" textAnchor="middle" fontSize="7" fill={INK_MUTED}>H12</text>
                  </g>
                </svg>
              </div>

              {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", padding: "20px 0" }}>
                  <div className="animated-pulse" style={{ padding: "8px", borderRadius: "50%", background: GOLD_LIGHT, border: `1px solid ${GOLD}` }}>
                    <RefreshCw size={20} style={{ color: GOLD_DEEP, animation: "spin 2s linear infinite" }} />
                  </div>
                  <p style={{ fontSize: "13px", color: INK_PRIMARY, margin: 0, fontWeight: 500 }}>
                    {searchStatus}
                  </p>
                </div>
              )}

              {step === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
                  <div
                    style={{
                      background: "#FCEFD2",
                      border: "1.5px solid #D9B46C",
                      borderRadius: "8px",
                      padding: "16px",
                      boxShadow: "inset 0 2px 4px rgba(156,122,47,0.08)"
                    }}
                  >
                    <div style={{ borderBottom: "1px dashed rgba(156,122,47,0.3)", paddingBottom: "4px", marginBottom: "10px", fontSize: "10.5px", color: GOLD_DEEP, fontWeight: "bold" }}>
                      BHṚGU SAṀHITĀ LEAF FOR {clientName.toUpperCase()}
                    </div>
                    {generateReadings().map((v, i) => (
                      <div key={i} style={{ marginBottom: "10px" }}>
                        <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "bold", color: "#634710", textAlign: "center" }}>{v.sanskrit}</p>
                        <p style={{ margin: "0 0 4px", fontSize: "10px", fontStyle: "italic", color: INK_SECONDARY, textAlign: "center" }}>{v.translit}</p>
                        <p style={{ margin: 0, fontSize: "11.5px", color: INK_PRIMARY }}><strong>Reading:</strong> {v.translation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px", width: "100%", marginTop: "12px" }}>
              {step === 1 ? (
                <button
                  onClick={startSearch}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "6px",
                    background: GOLD,
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <Search size={14} /> Retrieve Bhṛgu Manuscript
                </button>
              ) : (
                <button
                  onClick={resetFlow}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "6px",
                    background: GOLD,
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <RefreshCw size={14} /> Configure Different Chart
                </button>
              )}
            </div>
          </div>

          {/* Right Panel: Selected house configuration or details */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {step === 1 && selectedHouse !== null ? (
                <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}>HOUSE CONFIGURATION</span>
                  <h4 style={{ margin: "4px 0 10px", fontSize: "15px", fontWeight: 700, color: INK_PRIMARY }}>
                    Configure House {selectedHouse} Placements
                  </h4>

                  {/* List current planets in selected house */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: INK_MUTED }}>Current Placements:</span>
                    {(chartPlacements[selectedHouse] || []).length === 0 ? (
                      <span style={{ fontSize: "12px", color: INK_MUTED, fontStyle: "italic" }}>Empty</span>
                    ) : (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {(chartPlacements[selectedHouse] || []).map((p) => (
                          <div
                            key={p}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background: GOLD_LIGHT,
                              border: "1px solid rgba(156,122,47,0.25)",
                              fontSize: "11px"
                            }}
                          >
                            <span>{p}</span>
                            {p !== "Lagna" && (
                              <button
                                onClick={() => removePlanetFromHouse(selectedHouse, p)}
                                style={{ border: "none", background: "transparent", color: RED, cursor: "pointer", padding: 0 }}
                              >
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add planet dropdown */}
                  <div style={{ display: "flex", gap: "6px" }}>
                    <select
                      value={selectedPlanetToAdd}
                      onChange={(e) => setSelectedPlanetToAdd(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "6px",
                        borderRadius: "4px",
                        border: "1px solid rgba(156, 122, 47, 0.3)",
                        fontSize: "12px",
                        color: INK_PRIMARY
                      }}
                    >
                      {PLANETS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => addPlanetToHouse(selectedHouse, selectedPlanetToAdd)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        background: GREEN,
                        color: "#fff",
                        border: "none",
                        fontWeight: 600,
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px" }}>
                  <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700, color: GOLD_DEEP }}>
                    Chart-Based Retrieval
                  </h4>
                  <p style={{ margin: 0, fontSize: "13px", color: INK_SECONDARY, lineHeight: "1.5" }}>
                    Bhṛgu Saṁhitā uses **planetary-configuration matching** to locate manuscript files in Hoshiarpur. An astrologer computes a natal chart using standard Parāśari rules, but uses it as a retrieval key rather than deriving the predictions mathematically.
                  </p>
                </div>
              )}

              <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700, color: GOLD_DEEP }}>
                  Verse-Aphoristic Readings
                </h4>
                <p style={{ margin: 0, fontSize: "13px", color: INK_SECONDARY, lineHeight: "1.5" }}>
                  The readings are read out as Sanskrit or Hindi verses (ślokas) and then explained in Punjabi or Hindi commentary. This style matches the broader North-Indian Vedic tradition.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginTop: "16px" }}>
              <HelpCircle size={16} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2px" }} />
              <span style={{ fontSize: "12px", color: INK_MUTED, lineHeight: "1.4" }}>
                Click a house in the chart layout on the left to add planets or set the Lagna configuration.
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Sandbox */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minHeight: "440px" }}>
          <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "20px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
              Variation Sandbox Dojo
            </span>
            <p style={{ fontSize: "14.5px", color: INK_PRIMARY, fontWeight: 600, margin: "12px 0 20px" }}>
              {SCENARIO.question}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {SCENARIO.choices.map((c, idx) => {
                const isSelected = selectedChoice === idx;
                let borderColor = "rgba(156, 122, 47, 0.25)";
                let bg = "#fff";
                if (showSandboxFeedback && isSelected) {
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
                      setSelectedChoice(idx);
                      setShowSandboxFeedback(true);
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

            {showSandboxFeedback && selectedChoice !== null && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  borderRadius: "8px",
                  background: SCENARIO.choices[selectedChoice].type === "balanced" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)",
                  border: `1px solid ${SCENARIO.choices[selectedChoice].type === "balanced" ? GREEN : RED}`,
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start"
                }}
              >
                {SCENARIO.choices[selectedChoice].type === "balanced" ? (
                  <CheckCircle2 size={20} style={{ color: GREEN, flexShrink: 0 }} />
                ) : (
                  <AlertTriangle size={20} style={{ color: RED, flexShrink: 0 }} />
                )}
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: SCENARIO.choices[selectedChoice].type === "balanced" ? GREEN : RED }}>
                    {SCENARIO.choices[selectedChoice].type === "balanced" ? "CORRECT DISCERNMENT" : "DOCTRINAL DEVIATION"}
                  </h4>
                  <p style={{ margin: 0, fontSize: "13.5px", color: INK_PRIMARY, lineHeight: "1.45" }}>
                    {SCENARIO.choices[selectedChoice].feedback}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
