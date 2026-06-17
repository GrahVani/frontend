"use client";

import { useState } from "react";
import { HelpCircle, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, BookOpen, Eye, FileText, Check, X, ShieldCheck } from "lucide-react";

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
    id: "v-sc-1",
    title: "Scenario 1: Naming the Mother",
    question: "A reader correctly states the client's mother's name is Sumathi. The client says: 'This specific hit proves Agastya wrote my leaf!' How do you evaluate this?",
    choices: [
      {
        text: "Agree that the hit verified Agastya's authorship scientifically.",
        type: "mystification",
        feedback: "Incorrect. This represents Mystification. A single hit is underdetermined; it fits both traditional claims and cold-reading alternatives."
      },
      {
        text: "Explain that the hit is documented but fits both the manuscript claim and cold-reading alternatives. We must hold both explanations side-by-side without deciding.",
        type: "balanced",
        feedback: "Correct! The hit is real, but the mechanism remains open. We hold the claim and the inference options without collapsing into certainty."
      },
      {
        text: "Dismiss it, claiming the reader must have stolen the client's ID card while they were waiting.",
        type: "scoffing",
        feedback: "Incorrect. This represents Scoffing. It assumes fraud without proof, ignoring the documented complexity of reading sessions."
      }
    ]
  },
  {
    id: "v-sc-2",
    title: "Scenario 2: The Meaning Separator",
    question: "A client learns that Nāḍī's predictive mechanism is not scientifically verified. They ask: 'If the predictions are not proven, why should I care about my reading?' What is the correct response?",
    choices: [
      {
        text: "Dismiss the reading entirely. Unverified predictions mean the session is a complete waste of time.",
        type: "scoffing",
        feedback: "Incorrect. This represents Scoffing. It fails to see that a reading can be reflective and personally valuable regardless of proof."
      },
      {
        text: "Explain that meaning and mechanism are separate. A reading can prompt reflection and connect you to your life story even if its predictions are unproven. Hold the predictive claim as open.",
        type: "balanced",
        feedback: "Correct! Meaning and mechanism are distinct. Self-reflection does not require scientific verification of palm-leaf prediction."
      },
      {
        text: "Argue that the predictions are proven on a higher cosmic level that ordinary science is too blind to understand.",
        type: "mystification",
        feedback: "Incorrect. This represents Mystification. It attempts to force verification using cosmic claims to shield the client from uncertainty."
      }
    ]
  },
  {
    id: "v-sc-3",
    title: "Scenario 3: Designing a Double-Blind Study",
    question: "A scientist wants to lock readers in an empty room, hide all birth data, and only accept translation via independent blind scholars. The reader-families refuse to participate. How do you analyze this?",
    choices: [
      {
        text: "This refusal is structural. Increasing clinical rigidity destroys the traditional matching ritual and practitioner trust, making clean tests difficult without proving fraud.",
        type: "balanced",
        feedback: "Correct! This is a core verification obstacle. Clinical protocols disrupt the traditional setting and trigger reader refusal, keeping the verdict open."
      },
      {
        text: "The readers are hiding fraud. If they were real, they would gladly accept any test.",
        type: "scoffing",
        feedback: "Incorrect. This represents Scoffing, assuming guilt rather than understanding the cultural and structural barriers to testing."
      },
      {
        text: "The readers refused because Sage Agastya's energy forbids scientific inspection under penalty of a spiritual curse.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. It invents supernatural reasons for reader refusal instead of looking at the human setting."
      }
    ]
  }
];

export function NadiVerificationSandbox() {
  const [activeTab, setActiveTab] = useState<"sandbox" | "protocol" | "dojo">("sandbox");
  const [activeLens, setActiveLens] = useState<"manuscript" | "inference" | "warm" | "drift">("manuscript");
  const [timeYears, setTimeYears] = useState(0);

  // Protocol Architect Checkboxes
  const [blindSeeker, setBlindSeeker] = useState(false);
  const [blindTranslator, setBlindTranslator] = useState(false);
  const [digitizedCheck, setDigitizedCheck] = useState(false);
  const [fakeThumbprints, setFakeThumbprints] = useState(false);

  // Dojo State variables
  const [dojoIdx, setDojoIdx] = useState(0);
  const [selectedDojoChoice, setSelectedDojoChoice] = useState<number | null>(null);
  const [showDojoFeedback, setShowDojoFeedback] = useState(false);

  const resetDojo = () => {
    setDojoIdx(0);
    setSelectedDojoChoice(null);
    setShowDojoFeedback(false);
  };

  // Calculate Protocol Metrics
  let rigourScore = 0;
  if (blindSeeker) rigourScore += 25;
  if (blindTranslator) rigourScore += 25;
  if (digitizedCheck) rigourScore += 25;
  if (fakeThumbprints) rigourScore += 25;

  let willingnessScore = 100;
  if (blindSeeker) willingnessScore -= 25;
  if (blindTranslator) willingnessScore -= 25;
  if (digitizedCheck) willingnessScore -= 20;
  if (fakeThumbprints) willingnessScore -= 20;

  const currentDojo = DOJO_SCENARIOS[dojoIdx];

  return (
    <div className="gl-surface-twilight-glass" style={{ background: "#FAF6EB", border: `2px solid ${GOLD}`, borderRadius: "12px", padding: "24px", color: INK_PRIMARY, fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(156,122,47,0.15)", paddingBottom: "16px", marginBottom: "20px" }}>
        <div>
          <h3 style={{ margin: 0, color: GOLD_DEEP, fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "8px" }}>
            <Eye size={24} style={{ color: GOLD }} /> NĀḌĪ VERIFICATION SANDBOX
          </h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "13.5px", color: INK_SECONDARY }}>
            Explore underdetermined readings, memory filters, and the structural limits of scientific testing.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", background: "rgba(156,122,47,0.08)", padding: "4px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.15)" }}>
          <button
            onClick={() => setActiveTab("sandbox")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              background: activeTab === "sandbox" ? "#fff" : "transparent",
              color: activeTab === "sandbox" ? GOLD_DEEP : INK_SECONDARY,
              border: "none",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer",
              boxShadow: activeTab === "sandbox" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
              transition: "all 0.2s"
            }}
          >
            Explanatory Lenses
          </button>
          <button
            onClick={() => setActiveTab("protocol")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              background: activeTab === "protocol" ? "#fff" : "transparent",
              color: activeTab === "protocol" ? GOLD_DEEP : INK_SECONDARY,
              border: "none",
              fontWeight: 600,
              fontSize: "12px",
              cursor: "pointer",
              boxShadow: activeTab === "protocol" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
              transition: "all 0.2s"
            }}
          >
            Protocol Architect
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
            Verification Dojo
          </button>
        </div>
      </div>

      {activeTab === "sandbox" ? (
        /* Explanatory Sandbox Tab */
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
          
          {/* Left Panel: The Reading Case Study */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div style={{ background: "#fff", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "12px", textTransform: "uppercase" }}>
                Documented Reading Case Study
              </span>
              
              <div style={{ padding: "12px", borderRadius: "8px", background: "#FAF6EB", borderLeft: `4px solid ${GOLD}`, fontSize: "13px", lineHeight: "1.5", color: INK_PRIMARY }}>
                The reader matches a Tamil thumbprint bundle. During the session, the seeker hears:
                <div style={{ margin: "10px 0 10px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div>
                    • <strong>Mother's name:</strong>{" "}
                    <span style={{ 
                      padding: "2px 4px", 
                      borderRadius: "4px", 
                      background: activeLens === "manuscript" ? "rgba(156,122,47,0.15)" : activeLens === "inference" ? "rgba(47,125,85,0.15)" : "transparent",
                      border: activeLens !== "manuscript" && activeLens !== "inference" ? "none" : `1px dashed ${activeLens === "manuscript" ? GOLD : GREEN}`,
                      fontWeight: activeLens === "manuscript" || activeLens === "inference" ? 700 : "normal",
                      transition: "all 0.3s"
                    }}>
                      "Your mother is SUMATHI"
                    </span>
                  </div>
                  
                  <div>
                    • <strong>Bereavement:</strong>{" "}
                    <span style={{ 
                      padding: "2px 4px", 
                      borderRadius: "4px", 
                      background: activeLens === "manuscript" ? "rgba(156,122,47,0.15)" : activeLens === "inference" ? "rgba(47,125,85,0.15)" : activeLens === "warm" ? "rgba(162,58,30,0.15)" : "transparent",
                      border: activeLens === "drift" ? "none" : `1px dashed ${activeLens === "manuscript" ? GOLD : activeLens === "inference" ? GREEN : RED}`,
                      fontWeight: activeLens !== "drift" ? 700 : "normal",
                      transition: "all 0.3s"
                    }}>
                      "Your brother died in 2024"
                    </span>
                  </div>

                  <div>
                    • <strong>Profession:</strong>{" "}
                    <span style={{ 
                      padding: "2px 4px", 
                      borderRadius: "4px", 
                      background: activeLens === "manuscript" ? "rgba(156,122,47,0.15)" : activeLens === "inference" ? "rgba(47,125,85,0.15)" : "transparent",
                      border: activeLens !== "manuscript" && activeLens !== "inference" ? "none" : `1px dashed ${activeLens === "manuscript" ? GOLD : GREEN}`,
                      fontWeight: activeLens === "manuscript" || activeLens === "inference" ? 700 : "normal",
                      transition: "all 0.3s"
                    }}>
                      "You deal in RARE BOOKS"
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation Selector */}
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "8px", textTransform: "uppercase" }}>
                Select Explanatory Lens
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <button
                  onClick={() => setActiveLens("manuscript")}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: `1.5px solid ${activeLens === "manuscript" ? GOLD : "rgba(156,122,47,0.2)"}`,
                    background: activeLens === "manuscript" ? GOLD_LIGHT : "#fff",
                    color: INK_PRIMARY,
                    fontWeight: 600,
                    fontSize: "12.5px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s"
                  }}
                >
                  📖 1. Ancient Manuscript (Layer B)
                </button>
                <button
                  onClick={() => setActiveLens("inference")}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: `1.5px solid ${activeLens === "inference" ? GREEN : "rgba(156,122,47,0.2)"}`,
                    background: activeLens === "inference" ? "rgba(47,125,85,0.06)" : "#fff",
                    color: INK_PRIMARY,
                    fontWeight: 600,
                    fontSize: "12.5px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s"
                  }}
                >
                  🔍 2. Cold Reading (Layer C)
                </button>
                <button
                  onClick={() => setActiveLens("warm")}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: `1.5px solid ${activeLens === "warm" ? RED : "rgba(156,122,47,0.2)"}`,
                    background: activeLens === "warm" ? "rgba(162,58,30,0.06)" : "#fff",
                    color: INK_PRIMARY,
                    fontWeight: 600,
                    fontSize: "12.5px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s"
                  }}
                >
                  🏠 3. Warm Reading (Layer C)
                </button>
                <button
                  onClick={() => setActiveLens("drift")}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: `1.5px solid ${activeLens === "drift" ? GOLD_DEEP : "rgba(156,122,47,0.2)"}`,
                    background: activeLens === "drift" ? "rgba(122,94,30,0.06)" : "#fff",
                    color: INK_PRIMARY,
                    fontWeight: 600,
                    fontSize: "12.5px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s"
                  }}
                >
                  ⌛ 4. Memory Filter (Layer C)
                </button>
              </div>
            </div>

            {/* Explanatory Explanation Text */}
            <div style={{ background: "#fff", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "16px", minHeight: "100px" }}>
              {activeLens === "manuscript" && (
                <div>
                  <h5 style={{ margin: "0 0 6px 0", color: GOLD_DEEP, fontWeight: 700, fontSize: "14px" }}>Ancient Palm Leaf Explanation</h5>
                  <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                    The tradition claims the leaves were written by ancient sages (e.g. Agastya) who recorded the seeker's biographical data. The thumbprint acts as a key to retrieve the pre-recorded leaf from the vault bundles.
                  </p>
                </div>
              )}
              {activeLens === "inference" && (
                <div>
                  <h5 style={{ margin: "0 0 6px 0", color: GREEN, fontWeight: 700, fontSize: "14px" }}>Cold Reading & Biographical Inference</h5>
                  <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                    <strong>"Sumathi"</strong> is a high-probability mother's name for seekers from that region and generation. <strong>"Brother died in 2024"</strong> can be read from the client's mourning attire, micro-expressions, or posture. <strong>"Rare books"</strong> is inferred from dust allergies, ink-stained fingertips, or brief remarks made during registration.
                  </p>
                </div>
              )}
              {activeLens === "warm" && (
                <div>
                  <h5 style={{ margin: "0 0 6px 0", color: RED, fontWeight: 700, fontSize: "14px" }}>Warm Reading (Waiting Room Cues)</h5>
                  <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                    The reader's assistant takes down booking details in advance or overhears client conversations in the waiting lobby (e.g. speaking on the phone about a brother's passing in 2024). This information is quietly passed to the reader, creating an illusion of supernatural foresight.
                  </p>
                </div>
              )}
              {activeLens === "drift" && (
                <div>
                  <h5 style={{ margin: "0 0 6px 0", color: GOLD_DEEP, fontWeight: 700, fontSize: "14px" }}>Selection Bias & Memory Filter</h5>
                  <p style={{ margin: 0, fontSize: "12.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                    The reader actually made 12 wrong guesses before landing on these 3 hits. Over time, the seeker's mind filters out the wrong guesses, remembering only the striking hits. Use the slider below to simulate memory drift.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Right Panel: SVG Visualizer of Palm leaf or Memory timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* SVG Visualizer */}
            <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", minHeight: "220px", justifyContent: "center" }}>
              {activeLens === "manuscript" && (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}>AGED PALM-LEAF RECORD</span>
                  <svg viewBox="0 0 200 60" width="100%" height="60">
                    <rect x="5" y="5" width="190" height="50" rx="4" fill="#EADEC6" stroke={GOLD} strokeWidth="1.5" />
                    <circle cx="25" cy="30" r="4" fill="#FAF6EB" stroke={GOLD} />
                    <line x1="40" y1="20" x2="180" y2="20" stroke="#6D5A3D" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.6" />
                    <line x1="40" y1="30" x2="180" y2="30" stroke="#6D5A3D" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.6" />
                    <line x1="40" y1="40" x2="180" y2="40" stroke="#6D5A3D" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.6" />
                    <text x="110" y="34" textAnchor="middle" fontSize="6.5px" fill={GOLD_DEEP} fontFamily="monospace" fontWeight="bold">தாய்: சுமதி | சகோதரன்: 2024</text>
                  </svg>
                  <span style={{ fontSize: "11px", color: INK_MUTED, textAlign: "center" }}>Layer B Claim: Incised Tamil script contains native's biography.</span>
                </div>
              )}

              {activeLens === "inference" && (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: GREEN }}>CLIENT COLD-READING PROFILE</span>
                  <svg viewBox="0 0 100 80" width="80" height="80">
                    <circle cx="50" cy="30" r="16" fill="none" stroke={GREEN} strokeWidth="2" />
                    <path d="M 30,75 C 30,55 70,55 70,75" fill="none" stroke={GREEN} strokeWidth="2" />
                    {/* Cues */}
                    <path d="M 66,30 L 85,30" stroke={RED} strokeWidth="1.5" />
                    <text x="90" y="33" fontSize="8px" fill={RED} fontWeight="bold">Speech</text>
                    <path d="M 30,65 L 15,65" stroke={RED} strokeWidth="1.5" />
                    <text x="10" y="68" fontSize="8px" fill={RED} fontWeight="bold">Dress</text>
                  </svg>
                  <span style={{ fontSize: "11px", color: INK_MUTED, textAlign: "center" }}>Layer C: Physical, verbal, and sociological cues reveal seeker indicators.</span>
                </div>
              )}

              {activeLens === "warm" && (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: RED }}>WAITING LOBBY OVERHEARING</span>
                  <svg viewBox="0 0 160 80" width="100%" height="80">
                    {/* Office desk */}
                    <rect x="20" y="45" width="50" height="30" fill="none" stroke={INK_MUTED} strokeWidth="1.5" />
                    {/* Seeker on phone */}
                    <circle cx="120" cy="35" r="10" fill="none" stroke={RED} strokeWidth="1.5" />
                    <path d="M 110,65 C 110,50 130,50 130,65" fill="none" stroke={RED} strokeWidth="1.5" />
                    {/* Talk bubble */}
                    <path d="M 90,20 Q 75,10 60,20" fill="none" stroke={RED} />
                    <text x="75" y="15" textAnchor="middle" fontSize="6px" fill={RED} fontWeight="bold">"Brother died..."</text>
                  </svg>
                  <span style={{ fontSize: "11px", color: INK_MUTED, textAlign: "center" }}>Warm Reading: Information leaked before entering the consultation room.</span>
                </div>
              )}

              {activeLens === "drift" && (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textAlign: "center" }}>THE MEMORY TIMELINE FILTER</span>
                  
                  {/* Timeline */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11.5px", padding: "10px", borderRadius: "6px", background: "#FAF6EB", border: "1px solid rgba(156,122,47,0.15)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", opacity: timeYears >= 5 ? 0.2 : 1, transition: "opacity 0.5s" }}>
                      <span>❌ Guess 1: You have 3 sisters</span>
                      <span style={{ fontSize: "9px", color: RED }}>Miss</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", opacity: timeYears >= 5 ? 0.2 : 1, transition: "opacity 0.5s" }}>
                      <span>❌ Guess 2: Father is an engineer</span>
                      <span style={{ fontSize: "9px", color: RED }}>Miss</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: GREEN, fontWeight: 700 }}>
                      <span>✓ Guess 3: Mother is Sumathi</span>
                      <span style={{ fontSize: "9px" }}>HIT</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", opacity: timeYears >= 10 ? 0.2 : 1, transition: "opacity 0.5s" }}>
                      <span>❌ Guess 4: Born in July</span>
                      <span style={{ fontSize: "9px", color: RED }}>Miss</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: GREEN, fontWeight: 700 }}>
                      <span>✓ Guess 5: Brother died in 2024</span>
                      <span style={{ fontSize: "9px" }}>HIT</span>
                    </div>
                  </div>

                  {/* Year slider */}
                  <div style={{ marginTop: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 600 }}>
                      <span>Time Elapsed:</span>
                      <span>{timeYears} Years</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      step="5" 
                      value={timeYears} 
                      onChange={(e) => setTimeYears(Number(e.target.value))}
                      style={{ width: "100%", accentColor: GOLD }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", color: INK_MUTED }}>
                      <span>Immediate Session</span>
                      <span>5 Years Later</span>
                      <span>10 Years (Only Hits Remain)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "12px", borderRadius: "8px", background: GOLD_LIGHT, border: `1px solid ${GOLD}`, fontSize: "12px", lineHeight: "1.4" }}>
              <strong>Underdetermination:</strong> Notice how the same correct hits fit all lenses. A striking name or date hit <strong>does not verify the mechanism</strong>, because cold/warm reading and memory drift explain it just as well.
            </div>

          </div>

        </div>
      ) : activeTab === "protocol" ? (
        /* Protocol Architect Tab */
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
          
          {/* Left Column: Architect Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "16px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "12px", textTransform: "uppercase" }}>
                Add Experimental Controls
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                
                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={blindSeeker} 
                    onChange={(e) => setBlindSeeker(e.target.checked)} 
                    style={{ marginTop: "3px", accentColor: GOLD }}
                  />
                  <div>
                    <strong>Double-Blind Seeker</strong>
                    <span style={{ display: "block", fontSize: "11px", color: INK_MUTED }}>Seeker is hidden behind a screen; answers via silent push-buttons. Prevents visual cold reading cues.</span>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={blindTranslator} 
                    onChange={(e) => setBlindTranslator(e.target.checked)} 
                    style={{ marginTop: "3px", accentColor: GOLD }}
                  />
                  <div>
                    <strong>Independent Translators</strong>
                    <span style={{ display: "block", fontSize: "11px", color: INK_MUTED }}>Translators are scholars isolated in a separate booth, blind to the seeker. Blocks verbal collusion cues.</span>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={digitizedCheck} 
                    onChange={(e) => setDigitizedCheck(e.target.checked)} 
                    style={{ marginTop: "3px", accentColor: GOLD }}
                  />
                  <div>
                    <strong>Digitized Leaf Scribing</strong>
                    <span style={{ display: "block", fontSize: "11px", color: INK_MUTED }}>Leaves are scanned beforehand, and matches are validated by computer algorithms. Prevents reader vault manipulation.</span>
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                  <input 
                    type="checkbox" 
                    checked={fakeThumbprints} 
                    onChange={(e) => setFakeThumbprints(e.target.checked)} 
                    style={{ marginTop: "3px", accentColor: GOLD }}
                  />
                  <div>
                    <strong>Randomized Seeker Controls</strong>
                    <span style={{ display: "block", fontSize: "11px", color: INK_MUTED }}>Fake prints and mock birth charts are mixed in the search pool. Measures database matches vs random guessing.</span>
                  </div>
                </label>

              </div>
            </div>
          </div>

          {/* Right Column: Gauges and explanations */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* Double Gauge visualizer */}
            <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
                Scientific Study Metrics
              </span>

              {/* Skeptical Rigour Gauge */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px", fontWeight: 600 }}>
                  <span style={{ color: GREEN }}>Skeptical Rigour:</span>
                  <span>{rigourScore}%</span>
                </div>
                <div style={{ height: "10px", borderRadius: "5px", background: "#FAF6EB", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)" }}>
                  <div style={{ height: "100%", width: `${rigourScore}%`, background: GREEN, transition: "width 0.4s ease" }} />
                </div>
              </div>

              {/* Practitioner Participation Willingness Gauge */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px", fontWeight: 600 }}>
                  <span style={{ color: RED }}>Practitioner Willingness:</span>
                  <span>{willingnessScore}%</span>
                </div>
                <div style={{ height: "10px", borderRadius: "5px", background: "#FAF6EB", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)" }}>
                  <div style={{ height: "100%", width: `${willingnessScore}%`, background: RED, transition: "width 0.4s ease" }} />
                </div>
              </div>

              {/* Warning/Explanation Text */}
              <div style={{ padding: "10px", borderRadius: "6px", background: willingnessScore < 50 ? "rgba(162,58,30,0.06)" : "rgba(47,125,85,0.06)", border: `1px solid ${willingnessScore < 50 ? RED : GREEN}`, fontSize: "11.5px", lineHeight: "1.4" }}>
                {willingnessScore < 50 ? (
                  <div>
                    <strong>Willingness Collapsed:</strong> Traditional reader-families refuse to participate when protocols treat their hereditary, sacred manuscript matching process with clinical suspicion. This is why a clean double-blind study remains unpublished.
                  </div>
                ) : (
                  <div>
                    <strong>Study Feasible:</strong> Readers may participate under basic observation, but low rigour score keeps the predictive mechanism scientifically unproven.
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: "12px", borderRadius: "8px", background: GOLD_LIGHT, border: `1px solid ${GOLD}`, fontSize: "12px", lineHeight: "1.4" }}>
              <strong>The Verification Obstacle:</strong> Rigorous study requires clinical controls that disrupt the matching setting, causing readers to decline. The verdict is left open, not settled.
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
