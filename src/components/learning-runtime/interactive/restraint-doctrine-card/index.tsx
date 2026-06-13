"use client";

import React, { useState, useCallback } from "react";
import {
  Award, RefreshCw, AlertOctagon, ShieldCheck, CheckCircle2,
  Lock, Unlock, ArrowRight, BookOpen, Compass, ChevronDown, ChevronUp, Check
} from "lucide-react";

// Design Tokens
const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const GOLD_LIGHT = "rgba(156, 122, 47, 0.06)";
const GOLD_BORDER = "rgba(156, 122, 47, 0.2)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GREEN = "#4e7037";
const GREEN_LIGHT = "rgba(78, 112, 55, 0.06)";
const RED = "#ad4b37";
const RED_LIGHT = "rgba(173, 75, 55, 0.05)";

interface CompetencyItem {
  id: string;
  text: string;
  type: "can" | "cannot";
}

const COMPETENCY_ITEMS: CompetencyItem[] = [
  { id: "can1", text: "Explain the theories of all 7 remedy categories", type: "can" },
  { id: "can2", text: "Clarify strengthen-vs-pacify matching framework", type: "can" },
  { id: "can3", text: "Detail gemstone safety & medical cautions", type: "can" },
  { id: "cannot1", text: "Prescribe custom remedy regimes or gemstones to clients", type: "cannot" },
  { id: "cannot2", text: "Advise specific client fasting levels without medical screening", type: "cannot" },
  { id: "cannot3", text: "Impose or gate remedies behind faith boundaries", type: "cannot" }
];

interface VirtueReason {
  title: string;
  summary: string;
  detail: string;
}

const VIRTUE_REASONS: VirtueReason[] = [
  {
    title: "Premature Prescription = Real Harm-Risk",
    summary: "Recommending wrong gemstones or severe fasts can amplify malefic influences and damage health.",
    detail: "Gemstones act as amplifiers. Prescribing a gemstone for a malefic planet strengthens its negative influence. Recommending fasting without medical screening can worsen physical conditions. Restraint prevents these physical and psychological dangers."
  },
  {
    title: "Remedies are Genuinely Powerful",
    summary: "Remedies are not mere placebo; they are structural energetic interventions.",
    detail: "In classical Jyotiṣa, remedial measures modify subtle planetary rays. Gemstones, mantras, and fasts carry significant energy. Devising regimes without thorough multi-varga alignment and planetary strength calculation is highly risky."
  },
  {
    title: "Ethical Practice Demands Competence-Gating",
    summary: "Just like medicine or law, astrological prescription demands validated training.",
    detail: "Professional integrity means only practicing where you are certified. Gatekeeping the prescriptive side of remedies under advanced training (Tier-2 + supervised hours) protects the client and maintains the dignity of Jyotiṣa."
  },
  {
    title: "Restraint is a Virtue, Not a Deficiency",
    summary: "Acknowledging your current limits builds trust and protects the consultative bond.",
    detail: "Consultees value honesty. Stating clearly, 'I understand the theory of these remedies, but I am not yet licensed to prescribe one for you,' demonstrates high character, maturity, and safety-consciousness, separating you from commercial astrologers."
  }
];

interface DojoScenario {
  title: string;
  prompt: string;
  options: { key: string; text: string; correct: boolean; feedback: string }[];
}

const DOJO_SCENARIOS: DojoScenario[] = [
  {
    title: "Scenario 1: The Gemstone Question",
    prompt: "A client going through a difficult Saturn dasha asks: 'I want to buy a blue sapphire to strengthen my chart. Can you prescribe whether I should wear it?'",
    options: [
      {
        key: "a",
        text: "Yes, let me look at your Saturn's lordship. If it's a benefic, I will select the stone's carat and tell you how to wear it.",
        correct: false,
        feedback: "Incorrect. Gemstone prescription is gated to Tier-2. Premature gemstone recommendations carry significant risk of amplifying harmful energies."
      },
      {
        key: "b",
        text: "I understand the matching theory, but as a Tier-1 student, I am not qualified to prescribe remedies. I can explain that Saturn is pacified via dāna and fasting rather than stones.",
        correct: true,
        feedback: "Correct! By refusing to prescribe and explaining the difference between pacifying and strengthening, you uphold safety and restraint."
      }
    ]
  },
  {
    title: "Scenario 2: The Friend's Marriage Delay",
    prompt: "A close friend asks you to design a customized weekly fasting and mantra regime to solve their delay in marriage.",
    options: [
      {
        key: "a",
        text: "Since they are a friend, you suggest a specific Venus mantra and recommend fasting on Fridays, skipping lunch.",
        correct: false,
        feedback: "Incorrect. Designing custom fasting levels requires health screening and advanced assessment. Friendship does not bypass professional safety guidelines."
      },
      {
        key: "b",
        text: "Explain that Friday fasts/Venus mantras relate to Venus in theory, but suggest they consult a doctor before fasting, and explain you cannot prescribe a custom regime.",
        correct: true,
        feedback: "Correct! You explained the theory neutrally, emphasized health safety (medical check), and did not prescribe."
      }
    ]
  },
  {
    title: "Scenario 3: The 'Simple' Totka Temptation",
    prompt: "A relative has business problems. You know Mercury governs business. You are tempted to tell them to feed green gram to birds because 'it's just bird food, what harm could it do?'",
    options: [
      {
        key: "a",
        text: "Give them the totka. It's safe, cheap, and simple, so it doesn't count as a high-risk prescription.",
        correct: false,
        feedback: "Incorrect. Even simple folk remedies are part of prescription. At Tier-1, you explain how Mercury is pacified in theory — you do not hand out remedies."
      },
      {
        key: "b",
        text: "Explain the Mercury-bird folk tradition of Lal Kitab as an educational example, but clearly state you are not recommending it as their personal remedy.",
        correct: true,
        feedback: "Correct! You shared the educational knowledge of the tradition without overstepping into personal prescription."
      }
    ]
  }
];

const STATEMENT_PHRASES = [
  { id: "p1", text: "I understand the theoretical matching framework of remedies," },
  { id: "p2", text: "but I am not yet qualified to prescribe a remedy to you at Tier-1." },
  { id: "p3", text: "Prescription is gated to Tier-2 under supervised practice." }
];

export function RestraintDoctrineCard() {
  const [activeTab, setActiveTab] = useState<"curriculum" | "checklist" | "dojo" | "statement">("curriculum");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  // Virtue expand/collapse states
  const [expandedVirtue, setExpandedVirtue] = useState<number | null>(null);

  // Dojo states
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState<number>(0);
  const [dojoAnswers, setDojoAnswers] = useState<Record<number, string>>({});
  const [showDojoFeedback, setShowDojoFeedback] = useState<Record<number, boolean>>({});

  // Sentence builder states
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);
  const [statementValid, setStatementValid] = useState<boolean | null>(null);

  const handleToggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectDojoOption = (optKey: string) => {
    setDojoAnswers(prev => ({ ...prev, [currentScenarioIdx]: optKey }));
    setShowDojoFeedback(prev => ({ ...prev, [currentScenarioIdx]: true }));
  };

  // Statement Builder functions
  const handlePhraseClick = (phraseText: string) => {
    if (selectedPhrases.includes(phraseText)) {
      setSelectedPhrases(prev => prev.filter(p => p !== phraseText));
      setStatementValid(null);
    } else {
      setSelectedPhrases(prev => [...prev, phraseText]);
      setStatementValid(null);
    }
  };

  const handleCheckStatement = () => {
    if (selectedPhrases.length !== 3) {
      setStatementValid(false);
      return;
    }
    const isCorrectOrder =
      selectedPhrases[0] === STATEMENT_PHRASES[0].text &&
      selectedPhrases[1] === STATEMENT_PHRASES[1].text &&
      selectedPhrases[2] === STATEMENT_PHRASES[2].text;
    
    setStatementValid(isCorrectOrder);
  };

  const handleResetStatement = () => {
    setSelectedPhrases([]);
    setStatementValid(null);
  };

  const allCheckboxesChecked = COMPETENCY_ITEMS.every(item => checkedItems[item.id]);
  const allScenariosAnswered = Object.keys(dojoAnswers).length === DOJO_SCENARIOS.length;
  const allScenariosCorrect = allScenariosAnswered && 
    DOJO_SCENARIOS.every((s, idx) => {
      const ansKey = dojoAnswers[idx];
      const opt = s.options.find(o => o.key === ansKey);
      return opt && opt.correct;
    });
  const statementMastered = statementValid === true;

  const isCompleted = allCheckboxesChecked && allScenariosCorrect && statementMastered;

  const resetAll = () => {
    setCheckedItems({});
    setDojoAnswers({});
    setShowDojoFeedback({});
    setSelectedPhrases([]);
    setStatementValid(null);
    setCurrentScenarioIdx(0);
    setActiveTab("curriculum");
  };

  return (
    <div style={{
      padding: "20px",
      borderRadius: "16px",
      background: "rgba(255, 253, 248, 0.80)",
      backdropFilter: "blur(14px)",
      border: `1px solid ${GOLD_BORDER}`,
      fontFamily: "'Inter', sans-serif",
      color: INK_PRIMARY,
      maxWidth: "980px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        
        .rd-nav-btn {
          border: none; background: transparent; cursor: pointer; padding: 8px 16px;
          border-radius: 8px; font-size: 11.5px; font-weight: 700; color: ${INK_MUTED};
          transition: all 0.2s ease;
        }
        .rd-nav-btn:hover { color: ${GOLD_DEEP}; background: rgba(156, 122, 47, 0.04); }
        .rd-nav-btn.active { background: rgba(156, 122, 47, 0.08); color: ${GOLD_DEEP}; }

        .comp-checkbox-row {
          display: flex; align-items: center; gap: 10px; padding: 10px 14px;
          background: rgba(255,255,255,0.5); border: 1px solid rgba(156,122,47,0.12);
          border-radius: 10px; cursor: pointer; transition: all 0.2s ease;
        }
        .comp-checkbox-row:hover { background: #fff; border-color: ${GOLD}; }
        .comp-checkbox-row.checked { background: rgba(156, 122, 47, 0.04); border-color: ${GOLD_DEEP}; }

        .dojo-choice-btn {
          border: 1.5px solid rgba(156,122,47,0.18); background: rgba(255,255,255,0.5);
          transition: all 0.2s ease; cursor: pointer; padding: 12px; border-radius: 10px;
          font-size: 11.5px; line-height: 1.45; text-align: left;
        }
        .dojo-choice-btn:hover:not(:disabled) { border-color: ${GOLD}; background: #fff; }
        
        .phrase-pill {
          background: #ffffff; border: 1.5px solid rgba(156,122,47,0.18);
          padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 11px;
          color: ${INK_SECONDARY}; transition: all 0.2s ease; text-align: center;
          font-weight: 600;
        }
        .phrase-pill:hover { border-color: ${GOLD}; background: rgba(156,122,47,0.02); }
        .phrase-pill.selected { background: rgba(156, 122, 47, 0.08); border-color: ${GOLD_DEEP}; color: ${GOLD_DEEP}; }

        .virtue-card {
          border: 1px solid rgba(156,122,47,0.12); background: #ffffff;
          border-radius: 10px; padding: 12px; cursor: pointer; transition: all 0.2s ease;
        }
        .virtue-card:hover { border-color: ${GOLD}; box-shadow: 0 4px 8px rgba(156, 122, 47, 0.05); }

        .parchment-scroll {
          background: #fdfaf4; border: 2.5px solid #d4c3a3;
          box-shadow: 0 6px 20px rgba(156, 122, 47, 0.12), inset 0 0 30px rgba(156, 122, 47, 0.06);
          border-radius: 14px; padding: 20px; text-align: center;
          animation: slideIn 0.4s ease-out;
        }
        .scroll-border {
          border: 1.5px solid rgba(156, 122, 47, 0.25); border-radius: 10px; padding: 22px;
        }

        .chapter-node {
          padding: 6px 10px; border-radius: 6px; border: 1.5px solid rgba(156,122,47,0.12);
          font-size: 10px; font-weight: 700; text-align: center; color: ${INK_MUTED}; flex: 1; min-width: 90px;
        }
        .chapter-node.completed { background: rgba(78, 112, 55, 0.06); border-color: ${GREEN}; color: ${GREEN}; }
        .chapter-node.active { background: ${GOLD_LIGHT}; border-color: ${GOLD_DEEP}; color: ${GOLD_DEEP}; box-shadow: 0 0 8px rgba(156, 122, 47, 0.2); }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.12)", paddingBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={18} />
            The Prescription-Restraint Doctrine Card
          </h3>
          <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, fontStyle: "italic" }}>
            उपाय-संयम-सिद्धान्तः
          </span>
        </div>
        <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", color: INK_SECONDARY, lineHeight: "1.45" }}>
          Master the closing wisdom of the remedial foundation: the professional ethical discipline of knowing when NOT to prescribe remedies.
        </p>
      </div>

      {/* ── NAV SWITCHER ── */}
      <div style={{ display: "flex", gap: "4px", background: "rgba(156, 122, 47, 0.03)", borderRadius: "10px", padding: "3px" }}>
        <button onClick={() => setActiveTab("curriculum")} className={`rd-nav-btn ${activeTab === "curriculum" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Compass size={13} /> Curriculum Map & Virtues</span>
        </button>
        <button onClick={() => setActiveTab("checklist")} className={`rd-nav-btn ${activeTab === "checklist" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><CheckCircle2 size={13} /> Boundary Checklist</span>
        </button>
        <button onClick={() => setActiveTab("dojo")} className={`rd-nav-btn ${activeTab === "dojo" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Award size={13} /> Restraint Dojo Scenarios</span>
        </button>
        <button onClick={() => setActiveTab("statement")} className={`rd-nav-btn ${activeTab === "statement" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><BookOpen size={13} /> Restraint Statement Builder</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 1: CURRICULUM MAP & VIRTUES                          */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "curriculum" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "slideIn 0.3s ease" }}>
          
          {/* Module 15 curriculum map */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              Module 15 Curriculum Progress Map (22 Lessons)
            </span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "6px 0" }}>
              <div className="chapter-node completed">Ch 1: Scope (4)</div>
              <div className="chapter-node completed">Ch 2: Mantra (4)</div>
              <div className="chapter-node completed">Ch 3: Yantra/Tantra (3)</div>
              <div className="chapter-node completed">Ch 4: Gems (4)</div>
              <div className="chapter-node completed">Ch 5: Gentle (4)</div>
              <div className="chapter-node active">Ch 6: Matching & Restraint (3)</div>
            </div>
            <p style={{ margin: 0, fontSize: "10.5px", color: GOLD_DEEP, fontWeight: 700 }}>
              ✦ Current position: Lesson 22 of 22 — closing the remedial foundation.
            </p>
          </div>

          {/* Why Restraint is a Virtue Expandable Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              Why Restraint is a Virtue (§4.2)
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {VIRTUE_REASONS.map((v, idx) => {
                const isOpen = expandedVirtue === idx;
                return (
                  <div
                    key={idx}
                    className="virtue-card"
                    onClick={() => setExpandedVirtue(isOpen ? null : idx)}
                    style={{ gridColumn: isOpen ? "span 2" : "auto" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "11.5px", color: GOLD_DEEP }}>{v.title}</strong>
                      {isOpen ? <ChevronUp size={14} style={{ color: GOLD }} /> : <ChevronDown size={14} style={{ color: GOLD }} />}
                    </div>
                    <p style={{ margin: "4px 0 0 0", fontSize: "10.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                      {v.summary}
                    </p>
                    {isOpen && (
                      <p style={{
                        margin: "8px 0 0 0", padding: "8px", background: "rgba(156, 122, 47, 0.04)",
                        borderRadius: "6px", fontSize: "10.5px", lineHeight: "1.45", color: INK_PRIMARY,
                        borderLeft: `2px solid ${GOLD_DEEP}`, animation: "slideIn 0.2s ease"
                      }}>
                        {v.detail}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 2: BOUNDARY CHECKLIST                                */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "checklist" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            1. Verify Competency Boundaries (Check all to complete)
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {COMPETENCY_ITEMS.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleCheck(item.id)}
                  className={`comp-checkbox-row ${isChecked ? "checked" : ""}`}
                >
                  <input type="checkbox" checked={isChecked} readOnly style={{ pointerEvents: "none" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
                    {item.type === "can" ? (
                      <span style={{
                        background: "rgba(78, 112, 55, 0.12)", color: "#344e24",
                        fontSize: "9px", fontWeight: 800, padding: "1px 5px", borderRadius: "3px",
                        textTransform: "uppercase"
                      }}>
                        Can (Theory)
                      </span>
                    ) : (
                      <span style={{
                        background: "rgba(173, 75, 55, 0.12)", color: "#762e21",
                        fontSize: "9px", fontWeight: 800, padding: "1px 5px", borderRadius: "3px",
                        textTransform: "uppercase"
                      }}>
                        Cannot (Prescribe)
                      </span>
                    )}
                    <span style={{ fontSize: "11.5px", color: INK_PRIMARY, fontWeight: 500 }}>{item.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 3: RESTRAINT DOJO SCENARIOS                          */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "dojo" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              2. Restraint Dojo counseling challenge
            </span>
            <span style={{ fontSize: "10px", color: INK_MUTED, fontWeight: 700 }}>
              Scenario {currentScenarioIdx + 1} of {DOJO_SCENARIOS.length}
            </span>
          </div>

          {/* Dojo card */}
          <div style={{
            background: "#ffffff", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "12px",
            padding: "16px", display: "flex", flexDirection: "column", gap: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)", animation: "slideIn 0.25s ease"
          }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>
              {DOJO_SCENARIOS[currentScenarioIdx].title}
            </span>
            <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: INK_PRIMARY, lineHeight: "1.5" }}>
              {DOJO_SCENARIOS[currentScenarioIdx].prompt}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              {DOJO_SCENARIOS[currentScenarioIdx].options.map(opt => {
                const isSelected = dojoAnswers[currentScenarioIdx] === opt.key;
                const isRevealed = showDojoFeedback[currentScenarioIdx];
                return (
                  <button
                    key={opt.key}
                    disabled={isRevealed}
                    onClick={() => handleSelectDojoOption(opt.key)}
                    className="dojo-choice-btn"
                    style={{
                      borderColor: isSelected ? (opt.correct ? GREEN : RED) : undefined,
                      background: isSelected ? (opt.correct ? GREEN_LIGHT : RED_LIGHT) : undefined,
                      color: isSelected ? (opt.correct ? GREEN : RED) : undefined,
                    }}
                  >
                    <strong>{opt.key.toUpperCase()}.</strong> {opt.text}
                  </button>
                );
              })}
            </div>

            {/* Scenario Feedback */}
            {showDojoFeedback[currentScenarioIdx] && (
              <div style={{
                background: DOJO_SCENARIOS[currentScenarioIdx].options.find(o => o.key === dojoAnswers[currentScenarioIdx])?.correct
                  ? GREEN_LIGHT : RED_LIGHT,
                borderLeft: `3px solid ${DOJO_SCENARIOS[currentScenarioIdx].options.find(o => o.key === dojoAnswers[currentScenarioIdx])?.correct ? GREEN : RED}`,
                padding: "10px 12px", borderRadius: "0 8px 8px 0", fontSize: "11px", lineHeight: "1.45",
                color: DOJO_SCENARIOS[currentScenarioIdx].options.find(o => o.key === dojoAnswers[currentScenarioIdx])?.correct
                  ? "#344e24" : "#762e21",
                animation: "slideIn 0.2s ease"
              }}>
                <strong>
                  {DOJO_SCENARIOS[currentScenarioIdx].options.find(o => o.key === dojoAnswers[currentScenarioIdx])?.correct
                    ? "Correct! Virtuous Restraint." : "Ethical Overstep / Mismatched Action."}
                </strong>
                <p style={{ margin: "4px 0 0 0" }}>
                  {DOJO_SCENARIOS[currentScenarioIdx].options.find(o => o.key === dojoAnswers[currentScenarioIdx])?.feedback}
                </p>
              </div>
            )}
          </div>

          {/* Dojo navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
            <button
              onClick={() => setCurrentScenarioIdx(prev => Math.max(0, prev - 1))}
              disabled={currentScenarioIdx === 0}
              style={{
                border: `1px solid ${GOLD}`, background: "transparent", color: GOLD_DEEP,
                padding: "6px 12px", borderRadius: "6px", fontSize: "10.5px", fontWeight: 700,
                cursor: currentScenarioIdx === 0 ? "default" : "pointer", opacity: currentScenarioIdx === 0 ? 0.4 : 1
              }}
            >
              Previous Scenario
            </button>
            <button
              onClick={() => setCurrentScenarioIdx(prev => Math.min(DOJO_SCENARIOS.length - 1, prev + 1))}
              disabled={currentScenarioIdx === DOJO_SCENARIOS.length - 1 || !showDojoFeedback[currentScenarioIdx]}
              style={{
                border: `1px solid ${GOLD}`, background: "transparent", color: GOLD_DEEP,
                padding: "6px 12px", borderRadius: "6px", fontSize: "10.5px", fontWeight: 700,
                cursor: (currentScenarioIdx === DOJO_SCENARIOS.length - 1 || !showDojoFeedback[currentScenarioIdx]) ? "default" : "pointer",
                opacity: (currentScenarioIdx === DOJO_SCENARIOS.length - 1 || !showDojoFeedback[currentScenarioIdx]) ? 0.4 : 1
              }}
            >
              Next Scenario
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 4: RESTRAINT STATEMENT BUILDER                       */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "statement" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              3. Practise the Honest Restraint Statement (§7)
            </span>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.45" }}>
              Arrange the phrases below in the correct logical sequence to construct the canonical statement of ethical restraint.
            </p>
          </div>

          {/* Draggable/clickable phrase list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "6px 0" }}>
            {STATEMENT_PHRASES.map((p) => {
              const isSelected = selectedPhrases.includes(p.text);
              return (
                <button
                  key={p.id}
                  onClick={() => handlePhraseClick(p.text)}
                  className={`phrase-pill ${isSelected ? "selected" : ""}`}
                >
                  {p.text}
                </button>
              );
            })}
          </div>

          {/* Constructed output panel */}
          <div style={{
            background: "#ffffff", border: `1.5px dashed ${GOLD}`, borderRadius: "10px",
            padding: "14px", minHeight: "60px", display: "flex", flexDirection: "column", gap: "6px"
          }}>
            <span style={{ fontSize: "9.5px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Assembled Statement:</span>
            {selectedPhrases.length > 0 ? (
              <p style={{ margin: 0, fontSize: "11.5px", color: INK_PRIMARY, lineHeight: "1.5", fontWeight: 600 }}>
                {selectedPhrases.join(" ")}
              </p>
            ) : (
              <span style={{ fontSize: "11px", color: INK_MUTED, fontStyle: "italic" }}>
                Click the phrases above in correct order to construct the statement.
              </span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleCheckStatement}
              disabled={selectedPhrases.length === 0}
              style={{
                border: "none", background: GOLD_DEEP, color: "#fff", padding: "7px 16px",
                borderRadius: "6px", fontSize: "11px", fontWeight: 750, cursor: "pointer",
                opacity: selectedPhrases.length > 0 ? 1 : 0.5
              }}
            >
              Verify Statement
            </button>
            <button
              onClick={handleResetStatement}
              style={{
                border: `1px solid ${GOLD}`, background: "transparent", color: GOLD_DEEP,
                padding: "7px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Reset Phrase Puzzle
            </button>
          </div>

          {/* Verification Feedback */}
          {statementValid !== null && (
            <div style={{
              background: statementValid ? GREEN_LIGHT : RED_LIGHT,
              borderLeft: `3px solid ${statementValid ? GREEN : RED}`,
              padding: "10px", borderRadius: "0 6px 6px 0", fontSize: "11px",
              color: statementValid ? "#344e24" : "#762e21", animation: "slideIn 0.2s ease"
            }}>
              {statementValid ? (
                <span><strong>Verification Passed!</strong> Excellent. This statement summarizes theoretical competence combined with ethical limits.</span>
              ) : (
                <span><strong>Verification Failed.</strong> Order is incorrect or incomplete. Think about logical progression: recognize knowledge → state current limit → specify gating requirement.</span>
              )}
            </div>
          )}

        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* MASTERY SCROLL / COMPLETED STATE                          */}
      {/* ════════════════════════════════════════════════════════ */}
      {isCompleted ? (
        <div className="parchment-scroll">
          <div className="scroll-border">
            <Award size={36} style={{ color: GOLD_DEEP, margin: "0 auto 8px auto" }} />
            <h4 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: GOLD_DEEP }}>
              Scroll of Remedial Foundation Mastery
            </h4>
            <span style={{ fontSize: "11px", color: GOLD, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
              Module 15 Core Completer
            </span>
            
            {/* 22 lessons complete summary */}
            <div style={{
              margin: "12px 0", padding: "10px", background: "rgba(156,122,47,0.03)",
              border: "1px dashed rgba(156,122,47,0.25)", borderRadius: "8px",
              textAlign: "left", fontSize: "10.5px", color: INK_SECONDARY, display: "flex", flexDirection: "column", gap: "4px"
            }}>
              <strong style={{ color: GOLD_DEEP, fontSize: "11px" }}>Curriculum Summary (22 Lessons Mastered):</strong>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
                <span>• Ch 1: Intro Scope (4/4)</span>
                <span>• Ch 2: Mantra Science (4/4)</span>
                <span>• Ch 3: Yantras & Tantras (3/3)</span>
                <span>• Ch 4: Gemstones & Cautions (4/4)</span>
                <span>• Ch 5: Gentle Charities (4/4)</span>
                <span>• Ch 6: Matching & Restraint (3/3)</span>
              </div>
            </div>

            <p style={{ margin: "10px 0 0 0", fontSize: "11px", lineHeight: "1.5", color: INK_PRIMARY }}>
              This document verifies that you have completed the **entire Module 15 Introductory Remedial Measures** curriculum. You have demonstrated theoretical competence in all 7 categories and a clear alignment with the **counseling restraint doctrine**.
            </p>

            {/* What's next roadmap */}
            <div style={{
              marginTop: "14px", borderTop: "1px solid rgba(156,122,47,0.15)", paddingTop: "10px",
              display: "flex", flexDirection: "column", gap: "4px", alignItems: "center"
            }}>
              <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Gated Prescription Pathway:</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "9.5px", fontWeight: 700, color: INK_MUTED, flexWrap: "wrap", justifyContent: "center" }}>
                <span style={{ color: GREEN, background: GREEN_LIGHT, padding: "2px 4px", borderRadius: "3px" }}>M15 Foundation Completed</span>
                <ArrowRight size={10} />
                <span>Tier-2 Module 21 (Advanced)</span>
                <ArrowRight size={10} />
                <span>Module 24 Ethics Gate</span>
                <ArrowRight size={10} />
                <span>Supervised Practice</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Status panel when not complete */
        <div style={{
          background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: "12px", padding: "12px", display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <span style={{ fontSize: "10.5px", color: INK_MUTED, display: "flex", alignItems: "center", gap: "4px" }}>
            <Lock size={12} /> Mastery Scroll locked. Complete all sections to unlock:
          </span>
          <div style={{ display: "flex", gap: "8px", fontSize: "9.5px", fontWeight: 700 }}>
            <span style={{ color: allCheckboxesChecked ? GREEN : RED }}>Checklist {allCheckboxesChecked ? "✓" : "✗"}</span>
            <span style={{ color: allScenariosCorrect ? GREEN : RED }}>Scenarios {allScenariosCorrect ? "✓" : "✗"}</span>
            <span style={{ color: statementMastered ? GREEN : RED }}>Statement {statementMastered ? "✓" : "✗"}</span>
          </div>
        </div>
      )}

      {/* ── ETHICAL DOCTRINE REMINDER ── */}
      <div style={{
        background: "rgba(173, 75, 55, 0.05)",
        border: "1.5px solid rgba(173, 75, 55, 0.25)",
        borderRadius: "12px",
        padding: "14px",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px"
      }}>
        <AlertOctagon size={18} style={{ color: "#ad4b37", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#ad4b37", textTransform: "uppercase" }}>
            The prescription-restraint doctrine
          </span>
          <p style={{ margin: "4px 0 0 0", fontSize: "11px", lineHeight: "1.5", color: "#762e21" }}>
            Restraint is a virtue, not a deficiency. Recommending powerful remedies without verified prescriptive qualifications can create direct psychological and karmic harm. Completing Tier-1 provides full literacy to discuss theory — prescription is held behind further training.
          </p>
        </div>
      </div>

      {/* Reset all button for testing */}
      {isCompleted && (
        <button
          onClick={resetAll}
          style={{
            border: "none", background: "transparent", color: GOLD_DEEP, cursor: "pointer",
            fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px",
            alignSelf: "center", textDecoration: "underline"
          }}
        >
          <RefreshCw size={10} /> Reset and Practice Again
        </button>
      )}

      {/* ── FOOTER ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: `1px solid ${GOLD_BORDER}`,
        paddingTop: "8px",
        fontSize: "10px",
        color: INK_MUTED
      }}>
        <span>Grahvani Learning Runtime (Chapter 6)</span>
        <span>The Prescription-Restraint Doctrine Card</span>
      </div>
    </div>
  );
}
