"use client";

import { useState } from "react";
import { HelpCircle, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, BookOpen } from "lucide-react";

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
    id: "m-sc-1",
    title: "Scenario 1: The Wrong-Guess Anxiety",
    question: "A client gets a Tamil Nāḍī reading but complains: 'The reader made four wrong guesses during the yes/no questions before finding the leaf. This proves the lookup is untrustworthy.' How do you guide them?",
    choices: [
      {
        text: "Tell them to demand a refund because a genuine reading should have zero errors.",
        type: "scoffing",
        feedback: "Incorrect. This represents Scoffing. Trial-and-error yes/no narrowing is a documented protocol (Layer A) where wrong guesses are structurally expected to eliminate non-matching leaves."
      },
      {
        text: "Explain that wrong guesses are structurally normal search narrowers (Layer A), and do not prove fraud nor verify supernatural accuracy. Hold both the claim and alternatives honestly.",
        type: "balanced",
        feedback: "Correct! The trial-and-error narrowing is standard practice. It is neither proof of fraud nor proof of the supernatural claim."
      },
      {
        text: "Say that the reader made errors because the seeker's negative karma was blocking the correct leaves.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. It invents cosmic excuses rather than explaining standard retrieval mechanics."
      }
    ]
  },
  {
    id: "m-sc-2",
    title: "Scenario 2: The Supernatural Verdict",
    question: "A client says: 'The reader asked ten yes/no questions and then read my father's exact name. This perfect match proves the leaves were scientifically written 5,000 years ago.' What is your response?",
    choices: [
      {
        text: "Acknowledge the hit as documented practice (Layer A), but explain that convergence also fits cold-reading or biographical inference alternatives (Layer C). Hold both with humility.",
        type: "balanced",
        feedback: "Correct! A precise hit is observed, but the mechanism remains unverified. We must hold alternatives and claims side-by-side."
      },
      {
        text: "Agree completely. A name hit is absolute verification of Sage Agastya's authorship.",
        type: "mystification",
        feedback: "Incorrect. This commits Mystification, collapsing Layer B (claims) and Layer C (proof) using a single biographical match."
      },
      {
        text: "Dismiss the match, telling the client that the reader must have pickpocketed their ID card during waiting.",
        type: "scoffing",
        feedback: "Incorrect. Scoffing assumes fraud without evidence, rather than applying a disciplined two-layer holding."
      }
    ]
  },
  {
    id: "m-sc-3",
    title: "Scenario 3: Cross-Importing Methods",
    question: "A learner asks: 'To retrieve a Bhṛgu Saṁhitā leaf in Hoshiarpur, should we first ink the client's thumb for classification?' What do you tell them?",
    choices: [
      {
        text: "Yes, thumbprint classification is the primary key for all Nāḍī lookup systems.",
        type: "mystification",
        feedback: "Incorrect. This conflates the traditions. Thumb-print matching is Tamil-primary; Bhṛgu uses computed natal charts."
      },
      {
        text: "No, thumb-prints are distinctive to Tamil leaf lines. Bhṛgu indices matching by calculated planetary configurations. Avoid category cross-importing.",
        type: "balanced",
        feedback: "Correct! You must respect the distinctive boundaries of each school and avoid cross-importing."
      },
      {
        text: "No, because Bhṛgu lookup is random and thumb-prints are just a trick anyway.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing, dismissing both systems instead of respecting their distinctive, documented procedures."
      }
    ]
  }
];

export function MatchingProtocolFlow() {
  const [activeTab, setActiveTab] = useState<"simulator" | "dojo">("simulator");
  const [mode, setMode] = useState<"tamil" | "bhrigu">("tamil");
  const [simStep, setSimStep] = useState<number>(1);

  // Simulator Inputs
  const [gender, setGender] = useState<"male" | "female">("male");
  const [selectedThumb, setSelectedThumb] = useState<string>("Shankha Loop");
  const [birthYear, setBirthYear] = useState<string>("1992");
  const [lagnaSign, setLagnaSign] = useState<string>("Aries");

  // Yes/No Battery Simulator
  const [batteryStep, setBatteryStep] = useState<number>(0);
  const [questionsNarrowed, setQuestionsNarrowed] = useState<string[]>([]);
  const [remainingLeaves, setRemainingLeaves] = useState<number>(18);

  const [convergenceExplanation, setConvergenceExplanation] = useState<"claim" | "alternatives" | null>(null);

  // Dojo State
  const [dojoIdx, setDojoIdx] = useState<number>(0);
  const [selectedDojoChoice, setSelectedDojoChoice] = useState<number | null>(null);
  const [showDojoFeedback, setShowDojoFeedback] = useState<boolean>(false);

  const currentDojo = DOJO_SCENARIOS[dojoIdx];

  const TAMIL_QUESTIONS = [
    { text: "Are you the eldest sibling?", key: "eldest" },
    { text: "Does your father's name start with a solar syllable (Surya, Bhanu)?", key: "father" },
    { text: "Is your mother alive?", key: "mother" },
    { text: "Are you married?", key: "married" }
  ];

  const BHRIGU_QUESTIONS = [
    { text: "Is Saturn placed in your 7th house?", key: "saturn" },
    { text: "Was your birth during day-time hours?", key: "daytime" },
    { text: "Is your profession connected to teaching or counseling?", key: "career" },
    { text: "Is Jupiter aspecting your Lagna?", key: "jupiter" }
  ];

  const currentQuestions = mode === "tamil" ? TAMIL_QUESTIONS : BHRIGU_QUESTIONS;

  const handleYesNoAnswer = (answer: "yes" | "no") => {
    const nextStep = batteryStep + 1;
    setQuestionsNarrowed((prev) => [...prev, `${currentQuestions[batteryStep].text}: ${answer.toUpperCase()}`]);
    setRemainingLeaves((prev) => Math.max(1, Math.round(prev * (answer === "yes" ? 0.3 : 0.6))));

    if (nextStep >= currentQuestions.length) {
      setSimStep(5); // Validation
    } else {
      setBatteryStep(nextStep);
    }
  };

  const handleResetSim = () => {
    setSimStep(1);
    setBatteryStep(0);
    setQuestionsNarrowed([]);
    setRemainingLeaves(18);
    setConvergenceExplanation(null);
  };

  const resetDojo = () => {
    setSelectedDojoChoice(null);
    setDojoIdx(0);
    setShowDojoFeedback(false);
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 246, 0.9)",
        border: "1px solid rgba(156, 122, 47, 0.25)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
      data-interactive="matching-protocol-flow"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 20 — Chapter 3 — Lesson 1
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Manuscript Matching Protocol Flow
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Step through the workflow to locate a client leaf, observe trial-and-error narrowing, and apply the three-layer frame.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1.5px solid rgba(156,122,47,0.1)" }}>
        <button
          onClick={() => setActiveTab("simulator")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: activeTab === "simulator" ? "rgba(156, 122, 47, 0.08)" : "none",
            borderBottom: activeTab === "simulator" ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
            color: activeTab === "simulator" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: activeTab === "simulator" ? 700 : 500,
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Sparkles size={16} />
          Matching Simulator
        </button>
        <button
          onClick={() => setActiveTab("dojo")}
          style={{
            padding: "10px 16px",
            border: "none",
            background: activeTab === "dojo" ? "rgba(156, 122, 47, 0.08)" : "none",
            borderBottom: activeTab === "dojo" ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
            color: activeTab === "dojo" ? GOLD_DEEP : INK_SECONDARY,
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: activeTab === "dojo" ? 700 : 500,
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <BookOpen size={16} />
          Matching Dojo
        </button>
      </div>

      {activeTab === "simulator" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", minHeight: "440px" }}>
          
          {/* Left Panel: Steps */}
          <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                  Step {simStep} of 5: {
                    simStep === 1 ? "Collector Input" :
                    simStep === 2 ? "Classification Key" :
                    simStep === 3 ? "Familial Bundle Retrieval" :
                    simStep === 4 ? "Yes/No Query Battery" : "Match Confirmed!"
                  }
                </span>
                
                {simStep === 1 && (
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as "tamil" | "bhrigu")}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid rgba(156, 122, 47, 0.3)",
                      background: "#fff",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: GOLD_DEEP
                    }}
                  >
                    <option value="tamil">Tamil Loop (Thumbprint)</option>
                    <option value="bhrigu">Bhṛgu Loop (Chart)</option>
                  </select>
                )}
              </div>

              {simStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {mode === "tamil" ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "12px", fontWeight: 600, color: INK_SECONDARY }}>Client Gender (Sets Print Hand):</label>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => setGender("male")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: `1.5px solid ${gender === "male" ? GOLD : "rgba(156,122,47,0.15)"}`, background: gender === "male" ? GOLD_LIGHT : "#fff", color: INK_PRIMARY, fontWeight: 600, cursor: "pointer" }}>Male (Right Hand)</button>
                          <button onClick={() => setGender("female")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: `1.5px solid ${gender === "female" ? GOLD : "rgba(156,122,47,0.15)"}`, background: gender === "female" ? GOLD_LIGHT : "#fff", color: INK_PRIMARY, fontWeight: 600, cursor: "pointer" }}>Female (Left Hand)</button>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "12px", fontWeight: 600, color: INK_SECONDARY }}>Select Thumbprint Core:</label>
                        <select value={selectedThumb} onChange={(e) => setSelectedThumb(e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.25)", fontSize: "13px" }}>
                          <option value="Shankha Loop">Shankha Loop (Conch loop whorl)</option>
                          <option value="Chakra Whorl">Chakra Whorl (Spiral concentric)</option>
                          <option value="Lotus Leaf">Lotus Leaf (Arch alignment)</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: INK_SECONDARY }}>Birth Year (CE):</label>
                          <input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.25)", fontSize: "13px" }} />
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: INK_SECONDARY }}>Computed Lagna:</label>
                          <select value={lagnaSign} onChange={(e) => setLagnaSign(e.target.value)} style={{ padding: "8px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.25)", fontSize: "13px" }}>
                            <option value="Aries">Aries (Meṣa)</option>
                            <option value="Taurus">Taurus (Vṛṣabha)</option>
                            <option value="Gemini">Gemini (Mithuna)</option>
                            <option value="Leo">Leo (Siṁha)</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                  <button onClick={() => setSimStep(2)} style={{ padding: "10px", borderRadius: "6px", background: GOLD, color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    Analyze Input <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {simStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "8px", padding: "14px" }}>
                    <h5 style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>
                      {mode === "tamil" ? "134 Thumbprint Categorisation" : "Calculative Lagna/Rāśi Grid"}
                    </h5>
                    <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                      {mode === "tamil" 
                        ? `The print exhibits a "${selectedThumb}" structure, matching Ridge Code ${selectedThumb === "Shankha Loop" ? "32-A" : selectedThumb === "Chakra Whorl" ? "07-D" : "88-C"}. This maps the search to South-Indian Palm Bundles.`
                        : `Astro engine computations yield Lagna in ${lagnaSign} for Year ${birthYear}. This determines the Northern Bhṛgu planetary indices.`
                      }
                    </p>
                  </div>
                  <button onClick={() => setSimStep(3)} style={{ padding: "10px", borderRadius: "6px", background: GOLD, color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    Retrieve Bundle <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {simStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#fff", border: `1px solid rgba(156,122,47,0.2)`, borderRadius: "8px", padding: "12px" }}>
                    <div style={{ animation: "pulse 1.5s infinite", width: "10px", height: "10px", borderRadius: "50%", background: GOLD }} />
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>Searching familial vault archives...</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY }}>
                    {mode === "tamil" 
                      ? "Family archives retrieved loop bundle containing 18 prospective leaves matching the category."
                      : "Bhṛgu collection catalog retrieved bundle sheet index covering 18 configuration cards."
                    }
                  </p>
                  <button onClick={() => setSimStep(4)} style={{ padding: "10px", borderRadius: "6px", background: GOLD, color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    Start Yes/No Battery <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {simStep === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "8px", padding: "14px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "4px" }}>
                      QUERY {batteryStep + 1} OF {currentQuestions.length}
                    </span>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: INK_PRIMARY }}>
                      "{currentQuestions[batteryStep].text}"
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleYesNoAnswer("yes")} style={{ flex: 1, padding: "10px", borderRadius: "6px", background: GREEN, color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>Yes</button>
                    <button onClick={() => handleYesNoAnswer("no")} style={{ flex: 1, padding: "10px", borderRadius: "6px", background: RED, color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>No</button>
                  </div>

                  <div style={{ fontSize: "11.5px", color: INK_MUTED, borderTop: "1px dashed rgba(156,122,47,0.2)", paddingTop: "8px" }}>
                    Note: Both "Yes" and "No" narrow down the candidate pool. Try answering "No" to see trial-and-error leaf exclusion in action.
                  </div>
                </div>
              )}

              {simStep === 5 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: GREEN }}>
                    <CheckCircle2 size={18} />
                    <span style={{ fontSize: "14px", fontWeight: 700 }}>Single Candidate Leaf Matched!</span>
                  </div>

                  <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "8px", padding: "14px" }}>
                    <h5 style={{ margin: "0 0 6px", fontSize: "12px", color: GOLD_DEEP, fontWeight: 700 }}>MATCHED ATTRIBUTES</h5>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {questionsNarrowed.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: INK_MUTED }}>EXPLAIN THIS CONVERGENCE:</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setConvergenceExplanation("claim")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: `1.5px solid ${convergenceExplanation === "claim" ? GOLD : "rgba(156,122,47,0.15)"}`, background: convergenceExplanation === "claim" ? GOLD_LIGHT : "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Layer B (Tradition Claim)</button>
                      <button onClick={() => setConvergenceExplanation("alternatives")} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: `1.5px solid ${convergenceExplanation === "alternatives" ? GOLD : "rgba(156,122,47,0.15)"}`, background: convergenceExplanation === "alternatives" ? GOLD_LIGHT : "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Layer C (Inference Alts)</button>
                    </div>
                  </div>

                  {convergenceExplanation && (
                    <div style={{ padding: "12px", borderRadius: "8px", background: "#fff", border: "1px solid rgba(156,122,47,0.25)", fontSize: "13px", lineHeight: "1.4" }}>
                      {convergenceExplanation === "claim" 
                        ? "Layer B: The matching leaves eliminate seeker profiles that don't match, until only the native's pre-written leaf remains."
                        : "Layer C: Skilled cold reading, verbal/non-verbal reactions, and birth configuration statistics converge to build a matching profile iteratively."
                      }
                    </div>
                  )}

                  <button onClick={handleResetSim} style={{ padding: "10px", borderRadius: "6px", background: GOLD, color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <RefreshCw size={14} /> Reset Simulator
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: High-fidelity Visualizer */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* 1. Primary interactive Drawing */}
            <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, alignSelf: "flex-start" }}>
                {mode === "tamil" ? "TAMIL INPUT SCHEMA (THUMBPRINT)" : "BHṚGU CONFIGURATION SCHEMA (CHART)"}
              </span>
              
              {mode === "tamil" ? (
                <ThumbprintSVG pattern={selectedThumb} />
              ) : (
                <BhriguChartSVG lagna={lagnaSign} year={birthYear} />
              )}

              <div style={{ fontSize: "11px", color: INK_MUTED, textAlign: "center", lineHeight: "1.3" }}>
                {mode === "tamil" 
                  ? `Ridge mapping matches standard pattern "${selectedThumb}". Identifies client gender path.` 
                  : `Lagna placed in ${lagnaSign} for Year ${birthYear} CE. Determines the catalog card indices.`
                }
              </div>
            </div>

            {/* 2. Palm Leaf Pool Seeder visualization */}
            <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}>
                {simStep === 5 ? "SINGLE MATCHED MANUSCRIPT LEAF" : "FAMILIAL VAULT BUNDLE SEARCH"}
              </span>

              {simStep === 5 ? (
                <MatchedLeafSVG 
                  mode={mode} 
                  thumb={selectedThumb} 
                  lagna={lagnaSign} 
                  birthYear={birthYear} 
                  gender={gender} 
                  attributes={questionsNarrowed} 
                />
              ) : (
                <PalmLeavesStackSVG count={remainingLeaves} simStep={simStep} />
              )}

              <div style={{ borderTop: "1px solid rgba(156,122,47,0.15)", paddingTop: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: INK_MUTED }}>
                  Protocol Steps Progress
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", marginTop: "6px" }}>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", color: simStep >= 1 ? GREEN : INK_MUTED }}>
                    <span>{simStep >= 1 ? "✓" : "○"}</span>
                    <span>1. Input ({mode === "tamil" ? "Thumbprint" : "Birth Data"})</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", color: simStep >= 2 ? GREEN : INK_MUTED }}>
                    <span>{simStep >= 2 ? "✓" : "○"}</span>
                    <span>2. Classification ({mode === "tamil" ? "Ridge Code" : "Planetary Grid"})</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", color: simStep >= 3 ? GREEN : INK_MUTED }}>
                    <span>{simStep >= 3 ? "✓" : "○"}</span>
                    <span>3. Retrieval (Bundle vault lookup)</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", color: simStep >= 4 ? GREEN : INK_MUTED }}>
                    <span>{simStep >= 4 ? "✓" : "○"}</span>
                    <span>4. Yes/No Battery (Narrowing)</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", color: simStep >= 5 ? GREEN : INK_MUTED }}>
                    <span>{simStep >= 5 ? "✓" : "○"}</span>
                    <span>5. Validation (Match confirmed)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Dojo Tab */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minHeight: "440px" }}>
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

// ============================================================================
// Visual subcomponents for interactive diagrams
// ============================================================================

function ThumbprintSVG({ pattern }: { pattern: string }) {
  return (
    <svg viewBox="0 0 120 140" width="120" height="140" style={{ overflow: "visible" }}>
      {/* Texture Background */}
      <rect x="0" y="0" width="120" height="140" rx="15" fill="#FAF6EB" stroke="rgba(156, 122, 47, 0.3)" strokeWidth="2" />
      
      {/* Decorative center hole for palm leaf background style */}
      <circle cx="15" cy="70" r="4" fill="#FAF6EB" stroke="rgba(156, 122, 47, 0.2)" />
      
      {/* Thumb outlines & ridges */}
      <g fill="none" stroke="#6D5A3D" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
        {/* Core loop whorl */}
        <rect x="30" y="30" width="60" height="80" rx="30" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1" />
        
        {pattern === "Shankha Loop" ? (
          <>
            <path d="M 60,110 C 75,90 85,75 80,50 C 75,30 45,30 40,55 C 35,75 55,90 60,110" />
            <path d="M 50,110 C 65,95 70,85 70,60 C 70,40 50,45 50,60 C 50,70 58,80 50,105" />
            <path d="M 40,110 C 50,95 55,85 55,70 C 55,60 45,65 45,75" />
            <path d="M 70,110 C 85,90 95,70 90,40 Q 60,15 30,45 C 20,60 30,95 30,110" />
          </>
        ) : pattern === "Chakra Whorl" ? (
          <>
            {/* Concentric rings */}
            <circle cx="60" cy="70" r="8" />
            <circle cx="60" cy="70" r="16" />
            <circle cx="60" cy="70" r="24" />
            <circle cx="60" cy="70" r="32" />
            <path d="M 35,115 C 45,100 75,100 85,115" />
            <path d="M 25,120 C 40,95 80,95 95,120" />
          </>
        ) : (
          /* Lotus Leaf (Archs) */
          <>
            <path d="M 30,110 Q 60,85 90,110" />
            <path d="M 30,95 Q 60,65 90,95" />
            <path d="M 30,80 Q 60,45 90,80" />
            <path d="M 30,65 Q 60,25 90,65" />
            <path d="M 35,50 Q 60,10 85,50" />
          </>
        )}
      </g>
      
      {/* Scan overlay animation effect */}
      <line x1="10" y1="20" x2="110" y2="20" stroke="rgba(47,125,85,0.4)" strokeWidth="1.5" strokeDasharray="3,3">
        <animate attributeName="y1" values="20;120;20" dur="4s" repeatCount="indefinite" />
        <animate attributeName="y2" values="20;120;20" dur="4s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}

function BhriguChartSVG({ lagna, year }: { lagna: string; year: string }) {
  const gridPositions = [
    { name: "Aries", r: 0, c: 1 },
    { name: "Taurus", r: 0, c: 2 },
    { name: "Gemini", r: 0, c: 3 },
    { name: "Cancer", r: 1, c: 3 },
    { name: "Leo", r: 2, c: 3 },
    { name: "Virgo", r: 3, c: 3 },
    { name: "Libra", r: 3, c: 2 },
    { name: "Scorpio", r: 3, c: 1 },
    { name: "Sagittarius", r: 3, c: 0 },
    { name: "Capricorn", r: 2, c: 0 },
    { name: "Aquarius", r: 1, c: 0 },
    { name: "Pisces", r: 0, c: 0 }
  ];

  return (
    <svg viewBox="0 0 160 160" width="130" height="130">
      <rect x="2" y="2" width="156" height="156" fill="#FAF6EB" stroke={GOLD} strokeWidth="2.5" />
      {/* Grid lines */}
      <line x1="41" y1="2" x2="41" y2="158" stroke={GOLD} strokeWidth="1" />
      <line x1="80" y1="2" x2="80" y2="158" stroke={GOLD} strokeWidth="1" />
      <line x1="119" y1="2" x2="119" y2="158" stroke={GOLD} strokeWidth="1" />
      <line x1="2" y1="41" x2="158" y2="41" stroke={GOLD} strokeWidth="1" />
      <line x1="2" y1="80" x2="158" y2="80" stroke={GOLD} strokeWidth="1" />
      <line x1="2" y1="119" x2="158" y2="119" stroke={GOLD} strokeWidth="1" />
      {/* Center empty space */}
      <rect x="42" y="42" width="76" height="76" fill="#fff" />
      <text x="80" y="76" textAnchor="middle" fill={GOLD_DEEP} fontSize="8px" fontWeight="bold">BHṚGU GRID</text>
      <text x="80" y="88" textAnchor="middle" fill={INK_MUTED} fontSize="7px">{year} CE</text>

      {gridPositions.map((pos) => {
        const isLagna = pos.name === lagna;
        const x = pos.c * 40 + 20;
        const y = pos.r * 40 + 25;
        return (
          <g key={pos.name}>
            {isLagna && (
              <rect x={pos.c * 40 + 3} y={pos.r * 40 + 3} width="34" height="34" fill="rgba(156,122,47,0.15)" rx="4" />
            )}
            <text x={x} y={y - 8} textAnchor="middle" fill={INK_MUTED} fontSize="6px">{pos.name.substring(0, 3).toUpperCase()}</text>
            {isLagna && (
              <text x={x} y={y + 4} textAnchor="middle" fill={GOLD_DEEP} fontSize="9px" fontWeight="bold">LAGNA</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function PalmLeavesStackSVG({ count, simStep }: { count: number; simStep: number }) {
  const leafCount = Math.min(18, count);
  return (
    <svg viewBox="0 0 200 120" width="100%" height="auto" style={{ maxHeight: "110px" }}>
      {/* Wooden shelf background */}
      <rect x="10" y="95" width="180" height="12" fill="#8C6239" rx="2" />
      <rect x="25" y="10" width="150" height="85" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" strokeDasharray="3,3" />

      {/* Palm leaf strips */}
      {Array.from({ length: leafCount }).map((_, idx) => {
        const offset = idx * 4.2;
        const width = 120 - idx * 2.2;
        const isTarget = simStep === 5 && idx === 0;
        return (
          <rect
            key={idx}
            x={100 - width / 2}
            y={86 - offset}
            width={width}
            height="5"
            rx="1.5"
            fill={isTarget ? GREEN : "url(#leafGradSim)"}
            stroke={isTarget ? "#1A5235" : "#B59E74"}
            strokeWidth="0.8"
            style={{ transition: "all 0.5s ease-in-out" }}
          />
        );
      })}
      
      <defs>
        <linearGradient id="leafGradSim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DFD2B7" />
          <stop offset="50%" stopColor="#EADEC6" />
          <stop offset="100%" stopColor="#DFD2B7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MatchedLeafSVG({ mode, thumb, lagna, birthYear, gender, attributes }: { mode: "tamil" | "bhrigu"; thumb: string; lagna: string; birthYear: string; gender: string; attributes: string[] }) {
  return (
    <svg viewBox="0 0 400 120" width="100%" height="auto">
      <defs>
        <linearGradient id="agedLeaf" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DFD2B7" />
          <stop offset="15%" stopColor="#F5ECE1" />
          <stop offset="50%" stopColor="#EADEC6" />
          <stop offset="85%" stopColor="#F5ECE1" />
          <stop offset="100%" stopColor="#DFD2B7" />
        </linearGradient>
      </defs>
      
      {/* Palm leaf body */}
      <rect x="5" y="5" width="390" height="110" rx="8" fill="url(#agedLeaf)" stroke="#B59E74" strokeWidth="2" />
      
      {/* Binding hole on left */}
      <circle cx="45" cy="60" r="7" fill="#FAF6EB" stroke="#B59E74" strokeWidth="1.5" />
      <circle cx="45" cy="60" r="3" fill="#6D5A3D" />

      {/* Incised script background strings */}
      <path d="M 60,35 Q 200,32 380,35" fill="none" stroke="#6D5A3D" strokeWidth="0.5" strokeDasharray="3,4" opacity="0.4" />
      <path d="M 60,60 Q 200,58 380,60" fill="none" stroke="#6D5A3D" strokeWidth="0.5" strokeDasharray="3,4" opacity="0.4" />
      <path d="M 60,85 Q 200,83 380,85" fill="none" stroke="#6D5A3D" strokeWidth="0.5" strokeDasharray="3,4" opacity="0.4" />

      {/* Matched Details */}
      <g transform="translate(75, 10)">
        <text x="0" y="20" fill={GOLD_DEEP} fontSize="11px" fontWeight="bold" letterSpacing="0.05em">MATCHED LEAF KEY CONVERGENCE</text>
        
        <text x="0" y="38" fill={INK_PRIMARY} fontSize="9px" fontFamily="monospace" fontWeight="bold">
          {mode === "tamil" 
            ? `Tamil print: ${thumb} | Hand: ${gender === "male" ? "Right" : "Left"}`
            : `Bhṛgu Chart: ${lagna} Lagna | Birth: ${birthYear} CE`
          }
        </text>

        {/* Dynamic attribute confirmation display */}
        <text x="0" y="58" fill={INK_SECONDARY} fontSize="8.5px" width="300" clipPath="url(#clip)">
          Chanted: {attributes.length > 0 ? attributes.slice(-2).join(" | ") : "Confirming seek details..."}
        </text>

        <text x="0" y="78" fill={GREEN} fontSize="9px" fontWeight="bold">
          ✓ Layer A observed retrieval protocol locked.
        </text>
      </g>
    </svg>
  );
}
