"use client";

import { useState, useEffect } from "react";
import { HelpCircle, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, BookOpen, ShieldCheck, Check, X, Info, Sliders, DollarSign, Laptop, MapPin } from "lucide-react";

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
    id: "r-sc-1",
    title: "Scenario 1: The Prestigious Red-Flag Reader",
    question: "A client is considering Reader X, who has a highly famous lineage and charges ₹45,000 per kāṇḍa. However, Reader X strictly forbids recording the session and is evasive when asked to name their specific apprentice predecessor. How do you advise them?",
    choices: [
      {
        text: "Tell them to pay the fee immediately. A highly prestigious named lineage must have confidential and sacred reasons for forbidding recordings.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. It assumes prestigious names are exempt from due diligence, ignoring the recording and lineage red flags."
      },
      {
        text: "Advise them to avoid Reader X. A cluster of red flags (no recording, opaque apprenticeship) outweighs a prestigious name. Choose a reader with verifiable transparency.",
        type: "balanced",
        feedback: "Correct! Multiple red flags outweigh a single good sign like prestige. Recording policy and apprenticeship transparency are key checklist metrics."
      },
      {
        text: "Dismiss the reader and tell the client that all prestigious hereditary lineages are simple fraud hubs trying to steal money.",
        type: "scoffing",
        feedback: "Incorrect. This represents Scoffing. It generalizes all hereditary readers as frauds rather than applying disciplined criteria."
      }
    ]
  },
  {
    id: "r-sc-2",
    title: "Scenario 2: The Price-Quality Fallacy",
    question: "A seeker who had a disappointing reading from an expensive reader says: 'I paid ₹30,000 and the reader rushed through my leaf. This proves all expensive readers are scams, and only the cheapest ₹500 readers are honest.' What is your response?",
    choices: [
      {
        text: "Agree completely. Higher prices are always scams, while low prices guarantee that the reader is humble and honest.",
        type: "scoffing",
        feedback: "Incorrect. This represents Scoffing. It falls for the inverse price fallacy, assuming price dictates integrity in a simple linear way."
      },
      {
        text: "Explain that price does not track quality in either direction. Both expensive shortcuts and low-cost loss-leaders (baiting upsells) exist. Evaluate readers on transparency and checklist points, not cost.",
        type: "balanced",
        feedback: "Correct! Price is not a proxy for quality. A low price can be a loss-leader trap, and a high price can be a commercial shortcut. Only due-diligence checklist points track safety."
      },
      {
        text: "Suggest that expensive readings are always high quality, but the client must have had negative planetary configurations that ruined that specific session.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. It invents astrological excuses to protect the false idea that price reflects quality."
      }
    ]
  },
  {
    id: "r-sc-3",
    title: "Scenario 3: Calibrating Remote Readings",
    question: "A seeker is booking a remote video-consultation with a Hoshiarpur reader. They expect the exact same verification cycle and visual checks as an in-person visit. How do you manage their expectations?",
    choices: [
      {
        text: "Warn them that remote readings are entirely fake and computer-generated, so they must travel to India or cancel.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. Remote readings are a legitimate and cost-effective option for those who cannot travel."
      },
      {
        text: "Advise them that remote readings are legitimate but naturally thin the live confirmation cycle and remove physical oversight. Settle recording policies and calibrate expectations.",
        type: "balanced",
        feedback: "Correct! Online readings are legitimate but carry trade-offs, particularly in thinning the feedback cycle and removing direct checks."
      },
      {
        text: "Tell them that because time and space are cosmic illusions, the remote session will be identical and even more mystically attuned.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification, using mystical claims to wave away real, practical trade-offs in communication channels."
      }
    ]
  },
  {
    id: "r-sc-4",
    title: "Scenario 4: The Urgent Remedy Upsell",
    question: "During a matching session, the reader suddenly says: 'A severe planetary doṣa is written on your leaf. To avoid immediate tragedy, you must transfer ₹1.5 lakh today for a shanti-puja conducted by my priests.' What is the correct action?",
    choices: [
      {
        text: "Transfer the money immediately. Severe planetary curses are too dangerous to hold, and the leaf has identified the emergency.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. It succumbs to fear-induction and crisis-framing, which are predatory commercial tactics."
      },
      {
        text: "Decline the upsell on the spot. Fear-induction and high-price crisis framing are classic red flags. A reputable reader treats doṣas as background, never as an urgent sales pitch.",
        type: "balanced",
        feedback: "Correct! Exorbitant remedies, fear-induction, and crisis framing are key scam red flags. Refuse fear-induction and walk away."
      },
      {
        text: "Accuse the reader of theft, tell them all pūjās are fictional, and write a viral review debunking the entire temple town.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It attacks the entire spiritual tradition instead of calmly applying the commercial protection rules."
      }
    ]
  }
];

export function ReaderDueDiligence() {
  const [activeTab, setActiveTab] = useState<"calculator" | "dojo">("calculator");
  
  // Checklist State variables
  const [hasReputation, setHasReputation] = useState(true);
  const [hasApprenticeship, setHasApprenticeship] = useState(true);
  const [hasPricing, setHasPricing] = useState(true);
  const [hasRecording, setHasRecording] = useState(true);
  const [hasLineageClarity, setHasLineageClarity] = useState(true);
  const [hasNoUpsell, setHasNoUpsell] = useState(true);
  
  const [price, setPrice] = useState(8000);
  const [locationMode, setLocationMode] = useState<"in-person" | "online">("in-person");
  
  // Dojo State variables
  const [dojoIdx, setDojoIdx] = useState(0);
  const [selectedDojoChoice, setSelectedDojoChoice] = useState<number | null>(null);
  const [showDojoFeedback, setShowDojoFeedback] = useState(false);

  // Auto-set values based on preset selection
  const applyPreset = (preset: "A" | "B" | "C") => {
    if (preset === "A") {
      setHasReputation(true); // Prestigious name
      setHasApprenticeship(false); // Evasive predecessor
      setHasPricing(true);
      setHasRecording(false); // Forbids recording
      setHasLineageClarity(false); // Vague sublineage
      setHasNoUpsell(true);
      setPrice(35000);
      setLocationMode("in-person");
    } else if (preset === "B") {
      setHasReputation(true);
      setHasApprenticeship(true);
      setHasPricing(true);
      setHasRecording(true);
      setHasLineageClarity(true);
      setHasNoUpsell(true);
      setPrice(8000);
      setLocationMode("in-person");
    } else {
      setHasReputation(false);
      setHasApprenticeship(false);
      setHasPricing(false);
      setHasRecording(false);
      setHasLineageClarity(false);
      setHasNoUpsell(false); // Aggressive upsell
      setPrice(500);
      setLocationMode("online");
    }
    setSelectedDojoChoice(null);
    setShowDojoFeedback(false);
  };

  // Calculate Quality Score
  const checklistPoints = [
    hasReputation,
    hasApprenticeship,
    hasPricing,
    hasRecording,
    hasLineageClarity,
    hasNoUpsell
  ];
  const passedCount = checklistPoints.filter(Boolean).length;
  const scorePercentage = Math.round((passedCount / 6) * 100);

  // Red Flags count (which is 6 - passedCount)
  const redFlagsCount = 6 - passedCount;

  // Reset function
  const handleResetSim = () => {
    setHasReputation(true);
    setHasApprenticeship(true);
    setHasPricing(true);
    setHasRecording(true);
    setHasLineageClarity(true);
    setHasNoUpsell(true);
    setPrice(8000);
    setLocationMode("in-person");
  };

  const resetDojo = () => {
    setDojoIdx(0);
    setSelectedDojoChoice(null);
    setShowDojoFeedback(false);
  };

  const currentDojo = DOJO_SCENARIOS[dojoIdx];

  return (
    <div className="gl-surface-twilight-glass" style={{ background: "#FAF6EB", border: `2px solid ${GOLD}`, borderRadius: "12px", padding: "24px", color: INK_PRIMARY, fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(156,122,47,0.15)", paddingBottom: "16px", marginBottom: "20px" }}>
        <div>
          <h3 style={{ margin: 0, color: GOLD_DEEP, fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck size={24} style={{ color: GOLD }} /> READER DUE-DILIGENCE CALCULATOR
          </h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "13.5px", color: INK_SECONDARY }}>
            Apply the six-point due-diligence checklist to evaluate a practitioner and debunk the price fallacy.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", background: "rgba(156,122,47,0.08)", padding: "4px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.15)" }}>
          <button
            onClick={() => setActiveTab("calculator")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              background: activeTab === "calculator" ? "#fff" : "transparent",
              color: activeTab === "calculator" ? GOLD_DEEP : INK_SECONDARY,
              border: "none",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer",
              boxShadow: activeTab === "calculator" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
              transition: "all 0.2s"
            }}
          >
            Calculator
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
            Diligence Dojo
          </button>
        </div>
      </div>

      {activeTab === "calculator" ? (
        /* Calculator Tab */
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
          
          {/* Left Column: Interactive parameters */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* Presets */}
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "8px", textTransform: "uppercase" }}>
                Reader Presets (From Lesson §6)
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button 
                  onClick={() => applyPreset("A")}
                  style={{ flex: 1, padding: "8px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.3)", background: price === 35000 && !hasRecording ? GOLD_LIGHT : "#fff", fontWeight: 600, color: INK_PRIMARY, cursor: "pointer", transition: "all 0.2s" }}
                >
                  Reader A (₹35k, Red Flags)
                </button>
                <button 
                  onClick={() => applyPreset("B")}
                  style={{ flex: 1, padding: "8px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.3)", background: price === 8000 && hasRecording ? GOLD_LIGHT : "#fff", fontWeight: 600, color: INK_PRIMARY, cursor: "pointer", transition: "all 0.2s" }}
                >
                  Reader B (₹8k, Safe)
                </button>
                <button 
                  onClick={() => applyPreset("C")}
                  style={{ flex: 1, padding: "8px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.3)", background: price === 500 && !hasNoUpsell ? GOLD_LIGHT : "#fff", fontWeight: 600, color: INK_PRIMARY, cursor: "pointer", transition: "all 0.2s" }}
                >
                  Reader C (₹500, Scam Bait)
                </button>
              </div>
            </div>

            {/* Checklist Items */}
            <div style={{ background: "#fff", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "16px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "12px", textTransform: "uppercase" }}>
                The Six-Point Checklist
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                
                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={hasReputation} 
                    onChange={(e) => setHasReputation(e.target.checked)} 
                    style={{ marginTop: "3px", accentColor: GOLD }}
                  />
                  <div>
                    <strong style={{ color: INK_PRIMARY }}>1. Reputation & Lineage</strong>
                    <span style={{ display: "block", fontSize: "11.5px", color: INK_MUTED }}>Established family line with verifiable community standing.</span>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={hasApprenticeship} 
                    onChange={(e) => setHasApprenticeship(e.target.checked)} 
                    style={{ marginTop: "3px", accentColor: GOLD }}
                  />
                  <div>
                    <strong style={{ color: INK_PRIMARY }}>2. Apprenticeship History</strong>
                    <span style={{ display: "block", fontSize: "11.5px", color: INK_MUTED }}>Training under a named predecessor (not generic claims).</span>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={hasPricing} 
                    onChange={(e) => setHasPricing(e.target.checked)} 
                    style={{ marginTop: "3px", accentColor: GOLD }}
                  />
                  <div>
                    <strong style={{ color: INK_PRIMARY }}>3. Transparent Pricing</strong>
                    <span style={{ display: "block", fontSize: "11.5px", color: INK_MUTED }}>Clear up-front pricing structure without hidden expenses.</span>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={hasRecording} 
                    onChange={(e) => setHasRecording(e.target.checked)} 
                    style={{ marginTop: "3px", accentColor: GOLD }}
                  />
                  <div>
                    <strong style={{ color: INK_PRIMARY }}>4. Recording Policy</strong>
                    <span style={{ display: "block", fontSize: "11.5px", color: INK_MUTED }}>Reader welcomes or allows you to make your own session recording.</span>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={hasLineageClarity} 
                    onChange={(e) => setHasLineageClarity(e.target.checked)} 
                    style={{ marginTop: "3px", accentColor: GOLD }}
                  />
                  <div>
                    <strong style={{ color: INK_PRIMARY }}>5. Sub-lineage Clarity</strong>
                    <span style={{ display: "block", fontSize: "11.5px", color: INK_MUTED }}>Reader names sub-lineage honestly (Agastya, Bhṛgu) without inflation.</span>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={hasNoUpsell} 
                    onChange={(e) => setHasNoUpsell(e.target.checked)} 
                    style={{ marginTop: "3px", accentColor: GOLD }}
                  />
                  <div>
                    <strong style={{ color: INK_PRIMARY }}>6. No Pressure-Upsell</strong>
                    <span style={{ display: "block", fontSize: "11.5px", color: INK_MUTED }}>No immediate pressure for exorbitant Saturn/family remedies.</span>
                  </div>
                </label>

              </div>
            </div>

            {/* Slider and Location Toggles */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#fff", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11.5px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                  Session Location Medium
                </span>
                <div style={{ display: "flex", gap: "4px", background: "rgba(156,122,47,0.08)", padding: "2px", borderRadius: "6px" }}>
                  <button 
                    onClick={() => setLocationMode("in-person")}
                    style={{ padding: "4px 8px", fontSize: "11px", border: "none", borderRadius: "4px", background: locationMode === "in-person" ? GOLD : "transparent", color: locationMode === "in-person" ? "#fff" : INK_SECONDARY, cursor: "pointer", fontWeight: 600 }}
                  >
                    In-Person
                  </button>
                  <button 
                    onClick={() => setLocationMode("online")}
                    style={{ padding: "4px 8px", fontSize: "11px", border: "none", borderRadius: "4px", background: locationMode === "online" ? GOLD : "transparent", color: locationMode === "online" ? "#fff" : INK_SECONDARY, cursor: "pointer", fontWeight: 600 }}
                  >
                    Online/Remote
                  </button>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, color: INK_SECONDARY }}>Stated Reading Fee:</span>
                  <span style={{ color: GOLD_DEEP, fontWeight: 700 }}>₹{price.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="100000" 
                  step="500" 
                  value={price} 
                  onChange={(e) => setPrice(Number(e.target.value))}
                  style={{ width: "100%", accentColor: GOLD }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED }}>
                  <span>₹500 (Scam loss-leader)</span>
                  <span>₹8,000 (Average)</span>
                  <span>₹100,000 (Oversold)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual feedback gauges and graphs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* 1. Score Gauge Certificate */}
            <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", position: "relative" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, alignSelf: "flex-start", textTransform: "uppercase" }}>
                Due-Diligence Certificate
              </span>

              {/* Circular Gauge */}
              <div style={{ position: "relative", width: "100px", height: "100px" }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#FAF6EB" strokeWidth="8" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke={redFlagsCount >= 3 ? RED : passedCount >= 5 ? GREEN : GOLD} 
                    strokeWidth="8" 
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - passedCount / 6)}`}
                    transform="rotate(-90 50 50)"
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                  />
                </svg>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <span style={{ fontSize: "22px", fontWeight: 850, color: redFlagsCount >= 3 ? RED : passedCount >= 5 ? GREEN : GOLD_DEEP }}>
                    {passedCount}/6
                  </span>
                  <span style={{ fontSize: "9px", textTransform: "uppercase", fontWeight: 700, color: INK_MUTED }}>
                    Passed
                  </span>
                </div>
              </div>

              {/* Status Banner */}
              <div style={{ width: "100%", padding: "10px", borderRadius: "6px", background: redFlagsCount >= 3 ? "rgba(162,58,30,0.06)" : passedCount >= 5 ? "rgba(47,125,85,0.06)" : "rgba(156,122,47,0.06)", border: `1px solid ${redFlagsCount >= 3 ? RED : passedCount >= 5 ? GREEN : GOLD}`, textAlign: "center" }}>
                {redFlagsCount >= 3 ? (
                  <div style={{ display: "flex", alignSelf: "center", justifyContent: "center", gap: "6px", color: RED, fontWeight: 700, fontSize: "13px" }}>
                    <ShieldAlert size={16} style={{ marginTop: "1px" }} /> HIGH RISK CLUSTER
                  </div>
                ) : passedCount >= 5 ? (
                  <div style={{ display: "flex", alignSelf: "center", justifyContent: "center", gap: "6px", color: GREEN, fontWeight: 700, fontSize: "13px" }}>
                    <Sparkles size={16} style={{ marginTop: "1px" }} /> REPUTABLE PROFILE
                  </div>
                ) : (
                  <div style={{ display: "flex", alignSelf: "center", justifyContent: "center", gap: "6px", color: GOLD_DEEP, fontWeight: 700, fontSize: "13px" }}>
                    <AlertTriangle size={16} style={{ marginTop: "1px" }} /> MODERATE RISK WARNING
                  </div>
                )}
                
                <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.3" }}>
                  {redFlagsCount >= 3 
                    ? `Warning: Reader shows ${redFlagsCount} red flags. Multiple caution signals outweigh prestige or cheapness.`
                    : passedCount >= 5 
                      ? "Profile complies with the core disciplines. Safe to consult within boundary limits."
                      : `Observe caution. Missing ${redFlagsCount} checklist credentials. Verify recording & pricing upfront.`
                  }
                </p>
              </div>
            </div>

            {/* 2. Interactive Myth-Buster Graph */}
            <div style={{ background: "#fff", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
                <Sliders size={13} /> The Price Fallacy Visualizer
              </span>

              {/* Mini SVG Graph */}
              <div style={{ background: "#FAF6EB", borderRadius: "6px", padding: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
                <svg viewBox="0 0 200 80" width="100%" height="70" style={{ overflow: "visible" }}>
                  {/* Grid Lines */}
                  <line x1="25" y1="10" x2="25" y2="70" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                  <line x1="25" y1="70" x2="190" y2="70" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
                  <line x1="25" y1="20" x2="190" y2="20" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="2,2" />
                  
                  {/* Axis labels */}
                  <text x="10" y="45" transform="rotate(-90 10 45)" textAnchor="middle" fontSize="6px" fill={INK_MUTED} fontWeight="bold">QUALITY SCORE</text>
                  <text x="107" y="78" textAnchor="middle" fontSize="6px" fill={INK_MUTED} fontWeight="bold">PRICE (₹)</text>

                  {/* Stiff quality scores independent line */}
                  <line x1="25" y1={70 - passedCount * 8} x2="190" y2={70 - passedCount * 8} stroke={GOLD} strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
                  
                  {/* Current Active Spot */}
                  {/* Map price index to X coordinate: 500 -> 30, 100k -> 180 */}
                  {(() => {
                    const x = 30 + (price / 100000) * 150;
                    const y = 70 - passedCount * 8;
                    return (
                      <g>
                        <circle cx={x} cy={y} r="5" fill={redFlagsCount >= 3 ? RED : GREEN} />
                        <line x1={x} y1={y} x2={x} y2="70" stroke={INK_MUTED} strokeWidth="0.8" strokeDasharray="2,2" />
                        <text x={x} y={y - 8} textAnchor="middle" fontSize="7px" fill={GOLD_DEEP} fontWeight="bold">Active Check</text>
                      </g>
                    );
                  })()}

                  {/* Preset Anchors */}
                  <circle cx="31" cy="70 - 0 * 8" r="3" fill="#666" opacity="0.5" />
                  <text x="31" y="65" textAnchor="middle" fontSize="5px" fill="#666">C</text>

                  <circle cx="42" cy="70 - 6 * 8" r="3" fill="#666" opacity="0.5" />
                  <text x="42" y="17" textAnchor="middle" fontSize="5px" fill="#666">B</text>

                  <circle cx="82" cy="70 - 4 * 8" r="3" fill="#666" opacity="0.5" />
                  <text x="82" y="33" textAnchor="middle" fontSize="5px" fill="#666">A</text>
                </svg>
              </div>

              <div style={{ fontSize: "11px", color: INK_MUTED, lineHeight: "1.3", background: "rgba(156,122,47,0.04)", padding: "6px 10px", borderRadius: "6px", borderLeft: `3px solid ${GOLD}` }}>
                <strong>Price Fallacy Active:</strong> Notice that shifting the Price slider does <strong>not</strong> change the horizontal Quality line. Cost is commercially arbitrary. Only character and transparency checks define safety.
              </div>
            </div>

            {/* 3. Online Trade-offs grid */}
            <div style={{ background: "#fff", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
                {locationMode === "online" ? <Laptop size={13} /> : <MapPin size={13} />}
                Medium Analysis: {locationMode === "online" ? "Online/Remote" : "In-Person Visit"}
              </span>

              {locationMode === "online" ? (
                <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", color: GREEN }}>
                    <Check size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span><strong>Convenience:</strong> Highly cost-effective (no flight tickets, hotel stays, or time off work).</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", color: RED }}>
                    <X size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span><strong>Thinned Cycle:</strong> Highly reduced live confirmation interaction. Greater risk of cold-reading templates.</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", color: RED }}>
                    <X size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span><strong>No Oversight:</strong> Cannot physically inspect the matching thumbprint code selection or archive bundle.</span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", color: GREEN }}>
                    <Check size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span><strong>Full Feedback Loop:</strong> Maximum interaction during the yes/no leaf retrieval battery.</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", color: GREEN }}>
                    <Check size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span><strong>Direct Checks:</strong> You watch the print taken, witness the setting, and see the physical manuscript.</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "flex-start", color: RED }}>
                    <X size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span><strong>High Expense:</strong> Adds substantial overhead costs (travel, lodging) that distort cost-benefit balance.</span>
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleResetSim} style={{ padding: "10px", borderRadius: "6px", background: GOLD, color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = GOLD_DEEP} onMouseOut={(e) => e.currentTarget.style.background = GOLD}>
              <RefreshCw size={14} /> Reset Calculator
            </button>
          </div>

        </div>
      ) : (
        /* Dojo Tab */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minHeight: "400px" }}>
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
