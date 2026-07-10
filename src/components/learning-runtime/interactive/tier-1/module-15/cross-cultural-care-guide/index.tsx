"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, XCircle, Award, RefreshCw, AlertOctagon } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

// Contrast styling
const STEEL_BLUE = "#3e5b76";
const TEAL_DEEP = "#2a3d4f";
const STEEL_BG = "rgba(62, 91, 118, 0.05)";
const STEEL_BORDER = "rgba(62, 91, 118, 0.2)";

interface RemedyMapping {
  id: string;
  name: string;
  sanskrit: string;
  devotionalDetails: string;
  secularName: string;
  secularDetails: string;
  sharedMechanism: string;
  angle: number; // needle target angle (North=0, East=90, South=180, West=270)
}

const REMEDY_MAPS: RemedyMapping[] = [
  {
    id: "mantra",
    name: "Mantra / Pūjā (Ritual)",
    sanskrit: "मन्त्र-पूजा",
    devotionalDetails: "Reciting Sanskrit sound frequencies 108 times daily or offering flowers/incense to a planetary deity image.",
    secularName: "Reflective Meditative Practice",
    secularDetails: "Engaging in focused deep breathing, silent contemplation, or reading philosophically grounding texts daily.",
    sharedMechanism: "Quiet focus settles the nervous system, clears emotional waves, and expands mental presence.",
    angle: 0
  },
  {
    id: "dana",
    name: "Dāna (Charity)",
    sanskrit: "दानम्",
    devotionalDetails: "Giving graha-associated foods (wheat, sesame) or metals (copper, iron) to traditional recipients on weekdays.",
    secularName: "Ordinary Charity",
    secularDetails: "Volunteering time or donating financial support and supplies to local shelters, food banks, or elderly homes.",
    sharedMechanism: "Generosity balances possessive karma (sañcita) and nurtures compassion via present conduct (kriyamāṇa).",
    angle: 9
  },
  {
    id: "vrata",
    name: "Vrata (Vow)",
    sanskrit: "व्रतम्",
    devotionalDetails: "A highly structured, religious commitment combining fasting, pūjā, and dāna on a deity's holy day.",
    secularName: "Kept Commitment to Practice",
    secularDetails: "Pledging to perform a constructive, healthy habit (e.g. daily walk, reading, early sleep) for a fixed period (e.g. 40 days).",
    sharedMechanism: "Keeping a self-assigned commitment exercises personal integrity, strengthening the mind's baseline power.",
    angle: 18
  },
  {
    id: "upavasa",
    name: "Upavāsa (Fasting)",
    sanskrit: "उपवासः",
    devotionalDetails: "Abstaining from food or taking a modified fast on the weekday of the graha (e.g. Saturday for Śani) as a devotion.",
    secularName: "Dietary Discipline / Restraint",
    secularDetails: "Mindfully abstaining from specific foods (sugar, heavy meals) on a fixed weekday to build physical and mental control.",
    sharedMechanism: "Voluntary self-restraint purifies the body, strengthens willpower, and counteracts impulsive desires.",
    angle: 27
  }
];

interface DojoScenario {
  id: number;
  question: string;
  options: {
    key: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const SCENARIOS: DojoScenario[] = [
  {
    id: 1,
    question: "A client who does not share the Hindu faith is facing Sade Sati. How do you present Saturn remedies?",
    options: [
      {
        key: "a",
        text: "You must perform Saturday Śani pūjās and visit a Hanuman temple. Jyotiṣa remedies only work within the traditional religious context.",
        isCorrect: false,
        feedback: "Incorrect. Imposing religious practice is unethical. Efficacy relies on the underlying discipline, which has universal equivalents."
      },
      {
        key: "b",
        text: "Traditionally, we recommend a Saturday vrata (Saturn vow). If that fits your beliefs, you can fast and recite prayers. If you prefer a secular approach, you can practice Saturday dietary discipline and support local needy elders.",
        isCorrect: true,
        feedback: "Correct! Offers the traditional option respectfully, frames it as optional, and provides clear secular alternatives with the same intent."
      }
    ]
  },
  {
    id: 2,
    question: "A consultee asks: 'Do these remedies still work if I don't believe in the planetary deities?'",
    options: [
      {
        key: "a",
        text: "No. Faith (bhakti) is required to unlock the devas' grace. Without belief, the mantras and offerings carry no energetic power and will fail.",
        isCorrect: false,
        feedback: "Incorrect. You are gating help behind religion. The core mechanism is disciplined, generous conduct (kriyamāṇa), which operates universally."
      },
      {
        key: "b",
        text: "Yes. The core mechanism is disciplined, generous conduct (kriyamāṇa). Doing charity work or keeping a dietary restraint vow is effective for mental focus and karma balancing regardless of religious belief.",
        isCorrect: true,
        feedback: "Correct! Affirms that the remedial mechanism is based on conduct and intent, which are universal human capacities."
      }
    ]
  },
  {
    id: 3,
    question: "A client is uncomfortable chanting Sanskrit mantras. How do you respond?",
    options: [
      {
        key: "a",
        text: "The sound patterns must be in Sanskrit. If you cannot chant them, we cannot use mantra remedies, and you will have to buy an expensive gemstone instead.",
        isCorrect: false,
        feedback: "Incorrect. Pushing expensive gemstones because a client refuses Sanskrit chants violates both 'cheaper first' and 'no coercion' rules."
      },
      {
        key: "b",
        text: "Traditional mantras use Sanskrit for specific sound focus. If that is uncomfortable, you can substitute a reflective phrase from your own faith, or practice silent, mindful breathing for 10 minutes daily.",
        isCorrect: true,
        feedback: "Correct! Respects the client's boundary, offers an alternative, and maintains the core intent (meditative attention)."
      }
    ]
  }
];

export function CrossCulturalCareGuide() {
  const [activeTab, setActiveTab] = useState<"siblings" | "dojo" | "compass">("compass");
  const [selectedRemedyId, setSelectedRemedyId] = useState<string>("mantra");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});

  const selectedRemedy = REMEDY_MAPS.find(r => r.id === selectedRemedyId) || REMEDY_MAPS[0];

  const handleSelectRemedy = (id: string) => {
    setSelectedRemedyId(id);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleSelectAnswer = (scenarioId: number, optionKey: string) => {
    setSelectedAnswers(prev => ({ ...prev, [scenarioId]: optionKey }));
    setShowFeedback(prev => ({ ...prev, [scenarioId]: true }));
    
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    const option = scenario?.options.find(o => o.key === optionKey);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(option?.isCorrect ? 15 : 35);
    }
  };

  const getScore = () => {
    let score = 0;
    SCENARIOS.forEach(s => {
      const chosen = s.options.find(o => o.key === selectedAnswers[s.id]);
      if (chosen && chosen.isCorrect) score++;
    });
    return score;
  };

  const resetDojo = () => {
    setSelectedAnswers({});
    setShowFeedback({});
  };

  const allAnswered = Object.keys(selectedAnswers).length === SCENARIOS.length;

  // Render the SVG Compass
  const renderCompassSVG = () => {
    const angleMap: Record<string, number> = {
      mantra: 0,
      dana: 90,
      vrata: 180,
      upavasa: 270
    };
    const currentAngle = angleMap[selectedRemedyId] ?? 0;

    return (
      <svg
        viewBox="0 0 200 200"
        style={{
          width: "180px",
          height: "180px",
          background: "none"
        }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="compassRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5efe6" />
            <stop offset="100%" stopColor="#ab9b82" />
          </linearGradient>
          <linearGradient id="needleGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe082" />
            <stop offset="100%" stopColor="#b388ff" opacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Ring */}
        <circle cx="100" cy="100" r="90" fill="url(#compassRing)" stroke={GOLD} strokeWidth="1.5" />
        <circle cx="100" cy="100" r="82" fill="#fffdf9" stroke="rgba(156,122,47,0.15)" strokeWidth="1" />

        {/* 4 Interactive Quadrants clickable */}
        <g style={{ cursor: "pointer" }}>
          {/* North - Mantra */}
          <circle cx="100" cy="30" r="18" fill={selectedRemedyId === "mantra" ? GOLD_DEEP : "transparent"} stroke={GOLD} strokeWidth="1" onClick={() => handleSelectRemedy("mantra")} />
          <text x="100" y="22" fontSize="9" fontWeight="bold" textAnchor="middle" fill={selectedRemedyId === "mantra" ? "#fff" : INK_SECONDARY} onClick={() => handleSelectRemedy("mantra")}>N</text>
          <text x="100" y="32" fontSize="6.5" fontWeight="800" textAnchor="middle" fill={selectedRemedyId === "mantra" ? "#ffe082" : GOLD_DEEP} onClick={() => handleSelectRemedy("mantra")}>Mantra</text>

          {/* East - Dana */}
          <circle cx="170" cy="100" r="18" fill={selectedRemedyId === "dana" ? GOLD_DEEP : "transparent"} stroke={GOLD} strokeWidth="1" onClick={() => handleSelectRemedy("dana")} />
          <text x="170" y="92" fontSize="9" fontWeight="bold" textAnchor="middle" fill={selectedRemedyId === "dana" ? "#fff" : INK_SECONDARY} onClick={() => handleSelectRemedy("dana")}>E</text>
          <text x="170" y="102" fontSize="6.5" fontWeight="800" textAnchor="middle" fill={selectedRemedyId === "dana" ? "#ffe082" : GOLD_DEEP} onClick={() => handleSelectRemedy("dana")}>Dāna</text>

          {/* South - Vrata */}
          <circle cx="100" cy="170" r="18" fill={selectedRemedyId === "vrata" ? GOLD_DEEP : "transparent"} stroke={GOLD} strokeWidth="1" onClick={() => handleSelectRemedy("vrata")} />
          <text x="100" y="162" fontSize="9" fontWeight="bold" textAnchor="middle" fill={selectedRemedyId === "vrata" ? "#fff" : INK_SECONDARY} onClick={() => handleSelectRemedy("vrata")}>S</text>
          <text x="100" y="172" fontSize="6.5" fontWeight="800" textAnchor="middle" fill={selectedRemedyId === "vrata" ? "#ffe082" : GOLD_DEEP} onClick={() => handleSelectRemedy("vrata")}>Vrata</text>

          {/* West - Upavasa */}
          <circle cx="30" cy="100" r="18" fill={selectedRemedyId === "upavasa" ? GOLD_DEEP : "transparent"} stroke={GOLD} strokeWidth="1" onClick={() => handleSelectRemedy("upavasa")} />
          <text x="30" y="92" fontSize="9" fontWeight="bold" textAnchor="middle" fill={selectedRemedyId === "upavasa" ? "#fff" : INK_SECONDARY} onClick={() => handleSelectRemedy("upavasa")}>W</text>
          <text x="30" y="102" fontSize="6.5" fontWeight="800" textAnchor="middle" fill={selectedRemedyId === "upavasa" ? "#ffe082" : GOLD_DEEP} onClick={() => handleSelectRemedy("upavasa")}>Upavāsa</text>
        </g>

        {/* Center pivot point */}
        <circle cx="100" cy="100" r="8" fill={GOLD_DEEP} stroke="#ffe082" strokeWidth="1.5" />

        {/* Compass Needle */}
        <g
          transform={`rotate(${currentAngle}, 100, 100)`}
          style={{
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transformOrigin: "100px 100px"
          }}
        >
          {/* North needle tip (red/gold) */}
          <path d="M 100 45 L 94 100 L 106 100 Z" fill="#e0583c" filter="drop-shadow(0 0 2px rgba(224,88,60,0.5))" />
          {/* South needle tip (black) */}
          <path d="M 100 155 L 94 100 L 106 100 Z" fill={INK_PRIMARY} />
          {/* Center pin cap */}
          <circle cx="100" cy="100" r="3" fill="#ffe082" />
        </g>
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
        .tab-btn {
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tab-btn.active {
          border-color: rgba(156,122,47,0.2);
          background: #ffffff;
          color: ${GOLD_DEEP};
          font-weight: 800;
        }
        .rem-btn {
          border: 1px solid rgba(156,122,47,0.2);
          background: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          color: ${INK_SECONDARY};
          text-align: left;
        }
        .rem-btn:hover {
          border-color: ${GOLD};
          background: rgba(251,248,243,0.7);
        }
        .rem-btn.active {
          border-color: ${GOLD_DEEP};
          background: rgba(156, 122, 47, 0.08);
          color: ${GOLD_DEEP};
          font-weight: 750;
        }
        .dojo-choice-btn {
          border: 1.5px solid rgba(156,122,47,0.15);
          background: rgba(255,255,255,0.45);
          transition: all 0.2s ease;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 11.5px;
          line-height: 1.4;
          text-align: left;
        }
        .dojo-choice-btn:hover:not(:disabled) {
          border-color: ${GOLD};
          background: rgba(251,248,243,0.7);
        }
        button:focus-visible {
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
          Cross-Cultural Care & Secular Sibling Dojo
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Learn to present faith-based remedies ethically by matching them to secular equivalents and training optional framing.
        </p>
      </div>

      {/* TAB CONTROLLER */}
      <div style={{
        display: "flex",
        background: "rgba(0,0,0,0.04)",
        borderRadius: "8px",
        padding: "3px",
        alignSelf: "flex-start",
        gap: "4px"
      }}>
        <button
          onClick={() => setActiveTab("compass")}
          className={`tab-btn ${activeTab === "compass" ? "active" : ""}`}
          style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "11.5px", color: INK_SECONDARY }}
        >
          Universal Welcoming Compass
        </button>
        <button
          onClick={() => setActiveTab("dojo")}
          className={`tab-btn ${activeTab === "dojo" ? "active" : ""}`}
          style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "11.5px", color: INK_SECONDARY }}
        >
          Framing Dojo
        </button>
      </div>

      {/* TAB 1: COMPASS (REPLACE STATIC SIBLINGS VIEW) */}
      {activeTab === "compass" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "24px"
          }}>
            {/* COMPASS COMPONENT */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px"
            }}>
              {renderCompassSVG()}
              <span style={{ fontSize: "9.5px", color: INK_MUTED, fontStyle: "italic" }}>
                * Click cardinal points or buttons to rotate compass.
              </span>
            </div>

            {/* BUTTON SELECTOR GRIDS */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              flex: "1",
              minWidth: "220px"
            }} role="radiogroup" aria-label="Remedy Sibling Mapping Selection">
              {REMEDY_MAPS.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleSelectRemedy(r.id)}
                  aria-pressed={r.id === selectedRemedyId}
                  className={`rem-btn ${r.id === selectedRemedyId ? "active" : ""}`}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                    <span>{r.name}</span>
                    <span style={{ color: GOLD }}>{r.sanskrit}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CONTRASTING CARD DIPTYCH */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "16px"
          }}>
            {/* TRADITIONAL DEVOTIONAL CARD */}
            <div style={{
              background: "rgba(156, 122, 47, 0.03)",
              border: "1.5px solid rgba(156, 122, 47, 0.2)",
              borderRadius: "12px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "12.5px", fontWeight: 850, color: GOLD_DEEP }}>
                  Traditional Devotional
                </span>
                <span style={{ fontSize: "13px", fontFamily: "'Noto Serif Devanagari', serif", color: GOLD, fontWeight: 700 }}>
                  {selectedRemedy.sanskrit}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.45", color: INK_PRIMARY }}>
                {selectedRemedy.devotionalDetails}
              </p>
            </div>

            {/* SECULAR EQUIVALENT CARD */}
            <div style={{
              background: STEEL_BG,
              border: `1.5px solid ${STEEL_BORDER}`,
              borderRadius: "12px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              <span style={{ fontSize: "12.5px", fontWeight: 850, color: TEAL_DEEP }}>
                Secular Equivalent
              </span>
              <strong style={{ fontSize: "11px", color: STEEL_BLUE, marginTop: "-2px" }}>
                {selectedRemedy.secularName}
              </strong>
              <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.45", color: INK_PRIMARY }}>
                {selectedRemedy.secularDetails}
              </p>
            </div>
          </div>

          {/* SHARED MECHANISM STATEMENT */}
          <div style={{
            background: SURFACE_MANUSCRIPT,
            border: `1.5px solid ${GOLD}`,
            borderRadius: "12px",
            padding: "12px"
          }} role="status">
            <strong style={{ fontSize: "11px", color: GOLD_DEEP, display: "block" }}>
              Universal Karmic Mechanism (Kriyamāṇa)
            </strong>
            <p style={{ margin: "3px 0 0 0", fontSize: "11px", lineHeight: "1.4", color: INK_SECONDARY }}>
              {selectedRemedy.sharedMechanism} The physical act of restraint, the focus of meditation, and the kindness of giving are **universally positive** human traits, operating effectively regardless of religious beliefs.
            </p>
          </div>

        </div>
      )}

      {/* TAB 2: DOJO */}
      {activeTab === "dojo" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {SCENARIOS.map((s) => {
              const chosenKey = selectedAnswers[s.id];
              const isSubmitted = showFeedback[s.id];
              const chosenOption = s.options.find(o => o.key === chosenKey);

              return (
                <div
                  key={s.id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(156, 122, 47, 0.15)",
                    borderRadius: "12px",
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                    <span style={{
                      background: "rgba(156,122,47,0.1)",
                      color: GOLD_DEEP,
                      fontWeight: 800,
                      fontSize: "11px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      flexShrink: 0
                    }}>
                      S{s.id}
                    </span>
                    <h4 style={{ margin: 0, fontSize: "12px", fontWeight: 750, color: INK_PRIMARY, lineHeight: "1.4" }}>
                      {s.question}
                    </h4>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} role="radiogroup" aria-label={`Scenario ${s.id} Options`}>
                    {s.options.map((opt) => {
                      const isChosen = chosenKey === opt.key;
                      
                      let bg = undefined;
                      let color = undefined;
                      let borderStyle = undefined;

                      if (isChosen) {
                        if (isSubmitted) {
                          bg = opt.isCorrect ? "rgba(78, 112, 55, 0.1)" : "rgba(173, 75, 55, 0.1)";
                          color = opt.isCorrect ? "#4e7037" : "#ad4b37";
                          borderStyle = `1.5px solid ${opt.isCorrect ? "#4e7037" : "#ad4b37"}`;
                        } else {
                          bg = GOLD_DEEP;
                          color = "#ffffff";
                          borderStyle = `1.5px solid ${GOLD_DEEP}`;
                        }
                      }

                      return (
                        <button
                          key={opt.key}
                          disabled={isSubmitted}
                          onClick={() => handleSelectAnswer(s.id, opt.key)}
                          className="dojo-choice-btn"
                          aria-pressed={isChosen}
                          style={{
                            background: bg,
                            color: color,
                            border: borderStyle
                          }}
                        >
                          <strong>{opt.key.toUpperCase()}.</strong> {opt.text}
                        </button>
                      );
                    })}
                  </div>

                  {/* FEEDBACK BLOCK */}
                  {isSubmitted && chosenOption && (
                    <div style={{
                      background: chosenOption.isCorrect ? "rgba(78, 112, 55, 0.04)" : "rgba(173, 75, 55, 0.04)",
                      borderLeft: `3px solid ${chosenOption.isCorrect ? "#4e7037" : "#ad4b37"}`,
                      padding: "8px 12px",
                      borderRadius: "0 8px 8px 0",
                      fontSize: "11px",
                      lineHeight: "1.4",
                      color: chosenOption.isCorrect ? "#344e24" : "#762e21",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "6px"
                    }} role="alert">
                      <div>
                        <strong>{chosenOption.isCorrect ? "Respectful Framing!" : "Coercive Framing."}</strong>
                        <p style={{ margin: "2px 0 0 0" }}>{chosenOption.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SCORED COMPLETED MESSAGE */}
          {allAnswered && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(251, 248, 243, 0.8)",
              border: `1.5px solid ${GOLD}`,
              textAlign: "center"
            }} role="status">
              <div>
                <span style={{ fontSize: "13px", fontWeight: 850, color: GOLD_DEEP }}>
                  Dojo Score: {getScore()} / {SCENARIOS.length}
                </span>
                <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
                  {getScore() === SCENARIOS.length 
                    ? "Excellent! You present devotional remedies respectfully, offering secular equivalents and safeguarding client agency."
                    : "Some classifications were incorrect. Reset to refine your framing skills."
                  }
                </p>
              </div>
              <button
                onClick={resetDojo}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: GOLD_DEEP,
                  color: "#ffffff",
                  fontSize: "10.5px",
                  fontWeight: 750,
                  cursor: "pointer",
                  marginTop: "6px"
                }}
              >
                <RefreshCw size={10} /> Reset Dojo
              </button>
            </div>
          )}

        </div>
      )}

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
            Critical Ethical Directive
          </span>
          <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#762e21" }}>
            We **never impose** religious practices on consultees, and we never imply that a remedy 'won't work' without the religious wrapping. Remediations are always offered on the **consultee's terms**, respecting their own faith, boundaries, and worldview.
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
        <span>Grahvani Learning Runtime (Chapter 5)</span>
        <span>Cross-Cultural Care & secular Sibling Dojo</span>
      </div>
    </div>
  );
}
