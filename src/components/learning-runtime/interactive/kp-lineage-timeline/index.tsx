"use client";

import React, { useState, useCallback } from "react";
import {
  AlertCircle, ShieldCheck, ShieldAlert, AlertOctagon,
  Activity, Zap, ChevronRight, ChevronLeft, BookOpen,
  CheckCircle2, XCircle, RotateCcw, Compass, ArrowRight, Smile, Layers
} from "lucide-react";

// Steel Blue and Cream Palette
const STEEL_BLUE = "#365c7a";
const STEEL_DEEP = "#21394c";
const STEEL_LIGHT = "rgba(54, 92, 122, 0.05)";
const STEEL_BORDER = "rgba(54, 92, 122, 0.18)";
const GREEN = "#4e7037";
const GREEN_LIGHT = "rgba(78, 112, 55, 0.06)";
const RED = "#ad4b37";
const RED_LIGHT = "rgba(173, 75, 55, 0.05)";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

interface TimelineNode {
  year: string;
  title: string;
  emoji: string;
  summary: string;
  detail: string;
}

const TIMELINE_NODES: TimelineNode[] = [
  {
    year: "1908",
    title: "Birth & Cultural Roots",
    emoji: "👶",
    summary: "Born in Tamil Nadu, South India, within the classical Tamil cultural context.",
    detail: "Kuppali Sundra Krishnamurti (K.S. Krishnamurti) was born in 1908. He grew up in an environment rich in South-Indian classical astrology traditions, laying the groundwork for his future study."
  },
  {
    year: "1930s-40s",
    title: "Parāśarī Training & Practice",
    emoji: "📚",
    summary: "Extensively trained and practiced classical Parāśarī Vedic astrology.",
    detail: "Krishnamurti mastered standard Parāśarī techniques, including the Vimśottarī daśā and sign lord analysis. Over years of client practice, he noted a recurring challenge: predictions were often theoretically correct but lacked precise timing (precision-inconsistency)."
  },
  {
    year: "1950s",
    title: "Methodological Innovation",
    emoji: "🧪",
    summary: "Began systematic experimentation to refine event-timing resolution.",
    detail: "To solve the timing-inconsistency, he integrated the Placidus house-system (Western horary) with sidereal zodiac nakṣatra-pādā divisions. This led to his signature sub-lord doctrine and the 249 sub-divisions."
  },
  {
    year: "1960s-70s",
    title: "Reader Series Publication",
    emoji: "✍️",
    summary: "Published the foundational 6-volume KP Reader Series.",
    detail: "He authored and compiled the KP Reader Series (Vols I–VI), establishing a structured canonical literature. He also founded the KP federation to train a growing pan-Indian practitioner community."
  },
  {
    year: "1972",
    title: "Transition to Legacy",
    emoji: "🕊️",
    summary: "Krishnamurti passed away; authority transitioned to community validation.",
    detail: "With his passing in 1972, KP's authority shifted from a founding-author model to an active commentarial and empirical-verification framework sustained by his student lineage."
  },
  {
    year: "Modern",
    title: "Evolving Lineage & Ecosystem",
    emoji: "🌐",
    summary: "Sustained by key commentators (Bosmia, Subramaniam, Sharma) pan-globally.",
    detail: "Today, the KP stream is an actively-systematizing global community with ongoing commentarial contributions. It coexists as the second stream in Grahvani's five-stream-plus framework."
  }
];

const MOTIVATION_QUESTIONS = {
  q1: {
    question: "Which specific motivation drove Kuppali Sundra Krishnamurti's move to adopt Placidus house cusps?",
    options: [
      { id: "q1_opt1", text: "Precision-inconsistency in classical event-timing, but not sign-boundary issues" },
      { id: "q1_opt2", text: "Coarse whole-sign house cusps which did not differentiate degrees within a sign" },
      { id: "q1_opt3", text: "A desire to completely replace and discard classical Parāśarī astrology" },
      { id: "q1_opt4", text: "A request from Western astronomers to standardize Indian charts" }
    ],
    correctId: "q1_opt2",
    feedback: "Correct! The coarse-grained whole-sign house system placed cusps exactly at sign boundaries (0°), failing to differentiate the actual degrees of cuspal activity. This drove the move to Placidus cusps."
  },
  q2: {
    question: "In which milestone period did these timing-precision motivations culminate in the publication of the canonical 6-volume Reader Series?",
    options: [
      { id: "q2_opt1", text: "1930s-40s (Early classical Parāśarī training phase)" },
      { id: "q2_opt2", text: "1950s (Initial sub-lord and Placidus experimentation)" },
      { id: "q2_opt3", text: "1960s-70s (Publication of the canonical KP Reader Series)" },
      { id: "q2_opt4", text: "1972 (Post-passing lineage transition to community verification)" }
    ],
    correctId: "q2_opt3",
    feedback: "Correct! The 1960s-70s represents the culmination of his mid-career systematization and compilation of Readers I-VI, establishing the foundational canonical literature."
  }
};

interface ClassifiableElement {
  id: string;
  name: string;
  category: "retained" | "added";
  reason: string;
}

const CLASSIFIABLE_ELEMENTS: ClassifiableElement[] = [
  { id: "zodiac", name: "Sidereal Zodiac sign boundaries", category: "retained", reason: "KP retains the traditional sidereal sign boundaries, preserving classical astronomical references." },
  { id: "dasha", name: "Vimśottarī Daśā (120-year period mappings)", category: "retained", reason: "KP retains the classical 120-year planet sequence, though it adds sub-lord overlays for timing." },
  { id: "placidus", name: "Placidus quadrant-based house system", category: "added", reason: "Adopted from Western horary to place cusps at specific degrees instead of sign boundaries." },
  { id: "sublord", name: "Sub-Lord doctrine & 249 subdivisions", category: "added", reason: "KP's signature proportional partitioning of nakṣatras based on Vimśottarī period durations." },
  { id: "portfolios", name: "Standard planetary portfolios (e.g. Jupiter = wisdom)", category: "retained", reason: "KP uses the same traditional planetary houses, significations, and karakatvas." },
  { id: "ruling", name: "Ruling Planets momental-chart timing", category: "added", reason: "KP's specific method of timing events by correlating planets active at the moment of query." },
  { id: "nodes", name: "Shadow-planets (Rāhu/Ketu) traditional significance", category: "retained", reason: "KP operates within the classical Vedic framework where Rahu/Ketu act as amplifiers." }
];

export function KPLineageTimeline() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"chronology" | "continuity" | "absorption" | "refusal">("chronology");

  // Classification Game State
  const [classifications, setClassifications] = useState<Record<string, "retained" | "added" | null>>({
    zodiac: null,
    dasha: null,
    placidus: null,
    sublord: null,
    portfolios: null,
    ruling: null,
    nodes: null
  });
  const [classificationVerified, setClassificationVerified] = useState<boolean>(false);
  const [classificationFeedback, setClassificationFeedback] = useState<string | null>(null);

  // Framing slider state
  const [framingIndex, setFramingIndex] = useState<number>(1); // 0: Hagiography, 1: Honest Reframe, 2: Scoffing

  // Quiz state
  const [q1Selected, setQ1Selected] = useState<string | null>(null);
  const [q2Selected, setQ2Selected] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Absorption check state
  const [absAnswer, setAbsAnswer] = useState<boolean | null>(null);
  const [absFeedback, setAbsFeedback] = useState<string | null>(null);

  const currentMilestone = TIMELINE_NODES[activeStep];

  const handleClassify = (id: string, category: "retained" | "added") => {
    if (classificationVerified) return;
    setClassifications(prev => ({ ...prev, [id]: category }));
    setClassificationFeedback(null);
  };

  const handleVerifyClassification = () => {
    const unclassified = Object.values(classifications).some(val => val === null);
    if (unclassified) {
      setClassificationFeedback("Please classify all elements before verifying.");
      return;
    }

    const incorrect = CLASSIFIABLE_ELEMENTS.filter(el => classifications[el.id] !== el.category);
    if (incorrect.length === 0) {
      setClassificationVerified(true);
      setClassificationFeedback("Correct! You have successfully mapped all components. You noticed the continuity-with-distinctness pattern: the sidereal zodiac, Vimśottarī, planetary portfolios, and Rahu/Ketu are classical bases, while Placidus house divisions, sub-lords, 249-divisions, and Ruling Planets are KP distinct additions.");
    } else {
      setClassificationFeedback(`Incorrect mapping for ${incorrect.length} element(s). Review their doctrinal purpose and try again.`);
    }
  };

  const handleResetClassification = () => {
    setClassifications({
      zodiac: null,
      dasha: null,
      placidus: null,
      sublord: null,
      portfolios: null,
      ruling: null,
      nodes: null
    });
    setClassificationVerified(false);
    setClassificationFeedback(null);
  };

  const handleSubmitQuiz = () => {
    if (!q1Selected || !q2Selected) {
      setQuizFeedback("Please answer both questions before submitting.");
      return;
    }
    setQuizSubmitted(true);
    const q1Correct = q1Selected === MOTIVATION_QUESTIONS.q1.correctId;
    const q2Correct = q2Selected === MOTIVATION_QUESTIONS.q2.correctId;

    if (q1Correct && q2Correct) {
      setQuizFeedback(`Correct! \n- Q1: ${MOTIVATION_QUESTIONS.q1.feedback}\n- Q2: ${MOTIVATION_QUESTIONS.q2.feedback}`);
    } else {
      let errText = "";
      if (!q1Correct) errText += "Q1 Answer is incorrect. Hint: Krishnamurti wanted to subdivide sign-arcs because whole-sign cusps did not differentiate degrees. ";
      if (!q2Correct) errText += "Q2 Answer is incorrect. Hint: The Reader Series was published during the 1960s-70s.";
      setQuizFeedback(errText);
    }
  };

  const handleResetQuiz = () => {
    setQ1Selected(null);
    setQ2Selected(null);
    setQuizSubmitted(false);
    setQuizFeedback(null);
  };

  const handleAbsCheck = (val: boolean) => {
    setAbsAnswer(val);
    if (val === false) {
      setAbsFeedback("Correct! Both systems retain the traditional Indian sidereal zodiac base, representing cross-cultural absorption within a sidereal reference frame, rather than discarding it.");
    } else {
      setAbsFeedback("Incorrect. Tājika and KP systems do not adopt tropical coordinates; both continue to use the classical sidereal zodiac.");
    }
  };

  return (
    <div style={{
      padding: "20px",
      borderRadius: "16px",
      background: "rgba(255, 253, 248, 0.80)",
      backdropFilter: "blur(14px)",
      border: `1px solid ${STEEL_BORDER}`,
      fontFamily: "'Inter', sans-serif",
      color: INK_PRIMARY,
      maxWidth: "980px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "18px"
    }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        
        .kpt-nav-btn {
          border: none; background: transparent; cursor: pointer; padding: 8px 16px;
          border-radius: 8px; font-size: 11.5px; font-weight: 700; color: ${INK_MUTED};
          transition: all 0.2s ease;
        }
        .kpt-nav-btn:hover { color: ${STEEL_BLUE}; background: rgba(54, 92, 122, 0.04); }
        .kpt-nav-btn.active { background: rgba(54, 92, 122, 0.08); color: ${STEEL_BLUE}; }

        .timeline-dot {
          cursor: pointer; position: relative; display: flex; flex-direction: column;
          align-items: center; gap: 4px; z-index: 2; flex: 1; transition: all 0.25s ease;
        }
        .timeline-dot:hover { transform: translateY(-2px); }
        .dot-circle {
          width: 32px; height: 32px; border-radius: 50%; background: #ffffff;
          border: 2px solid ${STEEL_BORDER}; display: flex; align-items: center;
          justify-content: center; font-size: 14px; transition: all 0.25s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.06);
        }
        .timeline-dot.active .dot-circle {
          border-color: ${STEEL_BLUE}; background: ${STEEL_BLUE}; color: #ffffff;
          box-shadow: 0 0 10px rgba(54, 92, 122, 0.4);
        }

        .continuity-box {
          background: #ffffff; border: 1.5px solid rgba(54, 92, 122, 0.12);
          border-radius: 10px; padding: 12px; transition: all 0.3s ease;
        }

        .framing-card {
          border: 1px solid rgba(54, 92, 122, 0.15); border-radius: 12px; padding: 16px;
          background: #ffffff; transition: all 0.3s ease; display: flex; flex-direction: column; gap: 8px;
        }
        .quiz-option {
          display: flex; align-items: center; gap: 8px; padding: 8px 12px;
          background: rgba(255,255,255,0.45); border: 1px solid rgba(54, 92, 122, 0.12);
          border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
        }
        .quiz-option:hover:not(.submitted) { background: #ffffff; border-color: ${STEEL_BLUE}; }
        .quiz-option.selected { background: rgba(54, 92, 122, 0.04); border-color: ${STEEL_BLUE}; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ borderBottom: "1px solid rgba(54, 92, 122, 0.12)", paddingBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: STEEL_DEEP, display: "flex", alignItems: "center", gap: "8px" }}>
            <Compass size={18} />
            K.S. Krishnamurti: Biography & Motivations
          </h3>
          <span style={{ fontSize: "11px", fontWeight: 700, color: STEEL_BLUE, fontStyle: "italic" }}>
            के. एस. कृष्णमूर्ति — जीवनी
          </span>
        </div>
        <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", color: INK_SECONDARY, lineHeight: "1.45" }}>
          Trace Kuppali Sundra Krishnamurti's path from classical Parāśarī practice to developing the high-precision KP overlay.
        </p>
      </div>

      {/* ── NAV SWITCHER ── */}
      <div style={{ display: "flex", gap: "4px", background: "rgba(54, 92, 122, 0.03)", borderRadius: "10px", padding: "3px", flexWrap: "wrap" }}>
        <button onClick={() => setActiveTab("chronology")} className={`kpt-nav-btn ${activeTab === "chronology" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Compass size={13} /> Chronology & Timeline</span>
        </button>
        <button onClick={() => setActiveTab("continuity")} className={`kpt-nav-btn ${activeTab === "continuity" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><CheckCircle2 size={13} /> Continuity vs. Distinctness Game</span>
        </button>
        <button onClick={() => setActiveTab("absorption")} className={`kpt-nav-btn ${activeTab === "absorption" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Layers size={13} /> Absorption Comparison</span>
        </button>
        <button onClick={() => setActiveTab("refusal")} className={`kpt-nav-btn ${activeTab === "refusal" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><AlertOctagon size={13} /> Biographical Framing</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 1: CHRONOLOGY & TIMELINE                             */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "chronology" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "slideIn 0.3s ease" }}>
          
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
            <div style={{
              position: "absolute", left: "16px", right: "16px", height: "3px",
              background: `linear-gradient(to right, ${STEEL_BLUE} ${activeStep * 20}%, #e0dcd3 ${activeStep * 20}%)`,
              top: "26px", zIndex: 1, transition: "all 0.3s ease"
            }} />
            
            {TIMELINE_NODES.map((node, idx) => (
              <div
                key={node.year}
                onClick={() => setActiveStep(idx)}
                className={`timeline-dot ${activeStep === idx ? "active" : ""}`}
              >
                <div className="dot-circle">
                  <span>{node.emoji}</span>
                </div>
                <span style={{ fontSize: "10.5px", fontWeight: 800, color: activeStep === idx ? STEEL_BLUE : INK_MUTED }}>
                  {node.year}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            background: "#ffffff", border: `1.5px solid ${STEEL_BLUE}`,
            borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px",
            boxShadow: "0 4px 12px rgba(54, 92, 122, 0.04)", animation: "slideIn 0.25s ease"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(54, 92, 122, 0.2)", paddingBottom: "6px" }}>
              <h4 style={{ margin: 0, fontSize: "13.5px", fontWeight: 800, color: STEEL_DEEP }}>
                {currentMilestone.title} ({currentMilestone.year})
              </h4>
              <span style={{ fontSize: "10px", color: STEEL_BLUE, fontWeight: 700, background: STEEL_LIGHT, padding: "2px 6px", borderRadius: "4px" }}>
                BIOGRAPHY
              </span>
            </div>
            
            {currentMilestone.year === "1972" && (
              <div style={{
                background: "rgba(173, 75, 55, 0.05)", border: `1px solid ${RED}`, padding: "6px 10px",
                borderRadius: "6px", fontSize: "10px", color: RED, fontWeight: 700, display: "flex", gap: "6px", alignItems: "center"
              }}>
                <Zap size={12} />
                <span>Epistemic Hand-off: Founding-Author Authority ➔ Community-Verification model</span>
              </div>
            )}
            {currentMilestone.year === "Modern" && (
              <div style={{
                background: "rgba(78, 112, 55, 0.06)", border: `1px solid ${GREEN}`, padding: "6px 10px",
                borderRadius: "6px", fontSize: "10.5px", color: GREEN, fontWeight: 700, display: "flex", gap: "6px", alignItems: "center"
              }}>
                <ShieldCheck size={12} />
                <span>Commentators: Bosmia (cases), Subramaniam (math), Sharma (federation)</span>
              </div>
            )}

            <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: INK_PRIMARY }}>
              {currentMilestone.summary}
            </p>
            <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.5", color: INK_SECONDARY }}>
              {currentMilestone.detail}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              style={{
                border: `1.5px solid ${STEEL_BORDER}`, background: "transparent", color: STEEL_BLUE,
                padding: "6px 12px", borderRadius: "6px", fontSize: "10.5px", fontWeight: 700,
                cursor: activeStep === 0 ? "default" : "pointer", opacity: activeStep === 0 ? 0.4 : 1
              }}
            >
              Back
            </button>
            <button
              onClick={() => setActiveStep(prev => Math.min(TIMELINE_NODES.length - 1, prev + 1))}
              disabled={activeStep === TIMELINE_NODES.length - 1}
              style={{
                border: `1.5px solid ${STEEL_BORDER}`, background: "transparent", color: STEEL_BLUE,
                padding: "6px 12px", borderRadius: "6px", fontSize: "10.5px", fontWeight: 700,
                cursor: activeStep === TIMELINE_NODES.length - 1 ? "default" : "pointer", opacity: activeStep === TIMELINE_NODES.length - 1 ? 0.4 : 1
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 2: CONTINUITY VS. DISTINCTNESS GAME                  */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "continuity" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              Continuity vs. Distinctness Classification Game
            </span>
            {classificationVerified && (
              <button
                onClick={handleResetClassification}
                style={{
                  border: "none", background: "transparent", color: STEEL_BLUE,
                  fontSize: "11px", fontWeight: 750, textDecoration: "underline", cursor: "pointer"
                }}
              >
                Reset Elements
              </button>
            )}
          </div>

          <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
            KP did not replace the classical Indian system. It builds an overlay of mathematical subdivisions directly on top of traditional principles. Mark each element below as either **Retained from Classical Base** or **Added KP Refinement**.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {CLASSIFIABLE_ELEMENTS.map(el => {
              const currentVal = classifications[el.id];
              return (
                <div
                  key={el.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#ffffff",
                    border: `1.5px solid ${currentVal === "retained" ? "#4e7037" : currentVal === "added" ? STEEL_BLUE : STEEL_BORDER}`,
                    padding: "10px 14px",
                    borderRadius: "10px"
                  }}
                >
                  <span style={{ fontSize: "11.5px", fontWeight: 700, color: INK_PRIMARY }}>{el.name}</span>
                  
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      disabled={classificationVerified}
                      onClick={() => handleClassify(el.id, "retained")}
                      style={{
                        border: "1px solid #4e7037",
                        background: currentVal === "retained" ? "#4e7037" : "transparent",
                        color: currentVal === "retained" ? "#ffffff" : "#4e7037",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "4px 8px",
                        borderRadius: "4px",
                        cursor: classificationVerified ? "default" : "pointer"
                      }}
                    >
                      Retained Parāśarī
                    </button>
                    <button
                      disabled={classificationVerified}
                      onClick={() => handleClassify(el.id, "added")}
                      style={{
                        border: `1px solid ${STEEL_BLUE}`,
                        background: currentVal === "added" ? STEEL_BLUE : "transparent",
                        color: currentVal === "added" ? "#ffffff" : STEEL_BLUE,
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "4px 8px",
                        borderRadius: "4px",
                        cursor: classificationVerified ? "default" : "pointer"
                      }}
                    >
                      Added KP Refinement
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {classificationFeedback && (
            <div style={{
              background: classificationVerified ? GREEN_LIGHT : RED_LIGHT,
              borderLeft: `3px solid ${classificationVerified ? "#4e7037" : "#ad4b37"}`,
              padding: "10px", borderRadius: "0 8px 8px 0", fontSize: "11px", lineHeight: "1.45",
              color: classificationVerified ? "#344e24" : "#762e21",
              animation: "slideIn 0.25s ease"
            }}>
              <strong>{classificationVerified ? "Passed!" : "Review Required:"}</strong> {classificationFeedback}
            </div>
          )}

          {!classificationVerified && (
            <button
              onClick={handleVerifyClassification}
              style={{
                alignSelf: "flex-start",
                border: "none",
                background: STEEL_BLUE,
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 750,
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Verify Elements
            </button>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 3: ABSORPTION COMPARISON                             */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "absorption" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            Cross-Cultural Absorption: KP vs. Tājika (§4.5 & §4.6)
          </span>
          <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
            Vedic astrology has a rich history of absorbing external techniques. Both Tājika and KP illustrate this feature, adapting foreign methods onto a sidereal base.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="continuity-box" style={{ borderLeft: `4px solid ${STEEL_BLUE}` }}>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "12px", fontWeight: 800, color: STEEL_DEEP }}>
                KP Absorption Profile
              </h4>
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "10.5px", color: INK_SECONDARY, display: "flex", flexDirection: "column", gap: "4px" }}>
                <li><strong>Era:</strong> 20th Century (1960s).</li>
                <li><strong>Source:</strong> Western Horary (William Lilly's 1647 *Christian Astrology*).</li>
                <li><strong>Absorbed Elements:</strong> Placidus house-cusp calculation, significator chain logic.</li>
                <li><strong>Medium:</strong> Modern English-language Readers and commentary.</li>
              </ul>
            </div>

            <div className="continuity-box" style={{ borderLeft: "4px solid #4e7037" }}>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "12px", fontWeight: 800, color: "#4e7037" }}>
                Tājika Absorption Profile
              </h4>
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "10.5px", color: INK_SECONDARY, display: "flex", flexDirection: "column", gap: "4px" }}>
                <li><strong>Era:</strong> Medieval Period (12th–16th Century).</li>
                <li><strong>Source:</strong> Persian-Arabic-Hellenistic transmissions.</li>
                <li><strong>Absorbed Elements:</strong> Aspects (itthaśāla), planetary orbs (deeptāṁśa), Varṣaphala (annual return).</li>
                <li><strong>Medium:</strong> Sanskritized treatises (e.g., *Tājika Nīlakaṇṭhī*).</li>
              </ul>
            </div>
          </div>

          <div style={{
            background: "#ffffff", border: `1px solid ${STEEL_BORDER}`, borderRadius: "10px", padding: "12px",
            display: "flex", flexDirection: "column", gap: "8px"
          }}>
            <strong style={{ fontSize: "11px", color: STEEL_DEEP }}>Commonalities:</strong>
            <p style={{ margin: 0, fontSize: "10.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
              Both systems retain the traditional Indian **sidereal zodiac base**. The cross-cultural integration occurs within the sidereal framework, showing that insular origin is not a requirement for Vedic validity.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px dashed rgba(54,92,122,0.15)", paddingTop: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>Self-Check: True or False? Both KP and Tājika systems discard the sidereal zodiac in favor of tropical coordinates.</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleAbsCheck(true)}
                style={{
                  padding: "4px 12px", fontSize: "10.5px", fontWeight: 700, borderRadius: "4px",
                  border: `1px solid ${STEEL_BORDER}`, cursor: "pointer", background: absAnswer === true ? STEEL_BLUE : "transparent",
                  color: absAnswer === true ? "#ffffff" : STEEL_BLUE
                }}
              >
                True
              </button>
              <button
                onClick={() => handleAbsCheck(false)}
                style={{
                  padding: "4px 12px", fontSize: "10.5px", fontWeight: 700, borderRadius: "4px",
                  border: `1px solid ${STEEL_BORDER}`, cursor: "pointer", background: absAnswer === false ? "#4e7037" : "transparent",
                  color: absAnswer === false ? "#ffffff" : "#4e7037"
                }}
              >
                False
              </button>
            </div>
            {absFeedback && (
              <div style={{ fontSize: "10.5px", color: absAnswer === false ? "#344e24" : "#762e21", marginTop: "4px", fontStyle: "italic" }}>
                {absFeedback}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 4: BIOGRAPHICAL FRAMING (DOUBLE REFUSAL)              */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "refusal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              Biographical Framing Dial (§4.7)
            </span>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.45" }}>
              Explore the two extreme traps (Hagiography over-claims vs. Scoffing dismissals) and learn to hold Grahvani's ethical, honest middle-ground reframe.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "8px 0" }}>
            <input
              type="range"
              min="0"
              max="2"
              step="1"
              value={framingIndex}
              onChange={(e) => setFramingIndex(parseInt(e.target.value))}
              style={{ cursor: "pointer", accentColor: STEEL_BLUE }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9.5px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>
              <span style={{ color: framingIndex === 0 ? "#ad4b37" : undefined }}>Hagiography (Over-claim)</span>
              <span style={{ color: framingIndex === 1 ? STEEL_BLUE : undefined }}>Honest Middle Ground</span>
              <span style={{ color: framingIndex === 2 ? "#ad4b37" : undefined }}>Scoffing (Dismissal)</span>
            </div>
          </div>

          <div className="framing-card" style={{
            borderColor: framingIndex === 1 ? STEEL_BLUE : "#ad4b37",
            background: framingIndex === 1 ? STEEL_LIGHT : "rgba(173, 75, 55, 0.02)"
          }}>
            {framingIndex === 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ad4b37" }}>
                  <ShieldAlert size={16} />
                  <strong style={{ fontSize: "12px", textTransform: "uppercase" }}>Hagiography over-claim</strong>
                </div>
                <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_PRIMARY }}>
                  <em>"Krishnamurti was an infallible mathematical genius. His predictions were always correct, and KP is the only valid prediction system, superseding Parāśarī."</em>
                  <br /><strong style={{ color: "#ad4b37" }}>Violation:</strong> Commits one-stream over-claims (violating multi-streams-valid) and makes always-accurate over-promises.
                </p>
              </>
            )}
            {framingIndex === 1 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: STEEL_BLUE }}>
                  <ShieldCheck size={16} />
                  <strong style={{ fontSize: "12px", textTransform: "uppercase" }}>Honest biographical reframe</strong>
                </div>
                <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_PRIMARY }}>
                  <em>"Krishnamurti was an experienced classical practitioner who built a systematic 20th-century refinement (sub-lords). Legitimacy rests on methodology-rigour and ~60 years of community verification. KP coexists legitimately alongside other streams."</em>
                  <br /><strong style={{ color: STEEL_BLUE }}>Virtue:</strong> Preserves the legitimacy of his contributions without over-promising or dismissing classical lineages.
                </p>
              </>
            )}
            {framingIndex === 2 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ad4b37" }}>
                  <ShieldAlert size={16} />
                  <strong style={{ fontSize: "12px", textTransform: "uppercase" }}>Scoffing dismissal</strong>
                </div>
                <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_PRIMARY }}>
                  <em>"KP is a corrupted, foreign modern fad. Placidus house divisions have no authority, and Krishnamurti ruined classical astrology with Western horary."</em>
                  <br /><strong style={{ color: "#ad4b37" }}>Violation:</strong> Dismisses cross-cultural absorption (which is a feature, not a bug) and fails to recognize ~60 years of verified commentarial lineage.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── INTERACTIVE MOTIVATIONS QUIZ ── */}
      <div style={{
        background: "#ffffff", border: `1.5px solid ${STEEL_BORDER}`,
        borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px",
        marginTop: "4px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            Timeline & Motivations Alignment Activity (§4.3)
          </span>
          {quizSubmitted && (
            <button onClick={handleResetQuiz} style={{ border: "none", background: "transparent", color: STEEL_BLUE, fontSize: "10.5px", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
              Try Again
            </button>
          )}
        </div>
        
        <p style={{ margin: 0, fontSize: "11.5px", fontWeight: 700, color: INK_PRIMARY }}>
          Align the motivations of Krishnamurti Paddhati (KP) with the canonical timeline milestones:
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>
            Q1: {MOTIVATION_QUESTIONS.q1.question}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {MOTIVATION_QUESTIONS.q1.options.map(opt => (
              <div
                key={opt.id}
                onClick={() => !quizSubmitted && setQ1Selected(opt.id)}
                className={`quiz-option ${q1Selected === opt.id ? "selected" : ""} ${quizSubmitted ? "submitted" : ""}`}
              >
                <input type="radio" checked={q1Selected === opt.id} readOnly style={{ pointerEvents: "none" }} />
                <span style={{ fontSize: "11px", color: INK_SECONDARY }}>{opt.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>
            Q2: {MOTIVATION_QUESTIONS.q2.question}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {MOTIVATION_QUESTIONS.q2.options.map(opt => (
              <div
                key={opt.id}
                onClick={() => !quizSubmitted && setQ2Selected(opt.id)}
                className={`quiz-option ${q2Selected === opt.id ? "selected" : ""} ${quizSubmitted ? "submitted" : ""}`}
              >
                <input type="radio" checked={q2Selected === opt.id} readOnly style={{ pointerEvents: "none" }} />
                <span style={{ fontSize: "11px", color: INK_SECONDARY }}>{opt.text}</span>
              </div>
            ))}
          </div>
        </div>

        {!quizSubmitted ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={!q1Selected || !q2Selected}
            style={{
              border: "none", background: STEEL_BLUE, color: "#fff", padding: "8px 16px",
              borderRadius: "6px", fontSize: "11px", fontWeight: 750, cursor: "pointer",
              opacity: q1Selected && q2Selected ? 1 : 0.5,
              alignSelf: "flex-start", marginTop: "10px"
            }}
          >
            Submit Answers
          </button>
        ) : (
          quizFeedback && (
            <div style={{
              background: q1Selected === MOTIVATION_QUESTIONS.q1.correctId && q2Selected === MOTIVATION_QUESTIONS.q2.correctId ? GREEN_LIGHT : RED_LIGHT,
              borderLeft: `3px solid ${q1Selected === MOTIVATION_QUESTIONS.q1.correctId && q2Selected === MOTIVATION_QUESTIONS.q2.correctId ? "#4e7037" : "#ad4b37"}`,
              padding: "10px", borderRadius: "0 8px 8px 0", fontSize: "11px", lineHeight: "1.45",
              color: q1Selected === MOTIVATION_QUESTIONS.q1.correctId && q2Selected === MOTIVATION_QUESTIONS.q2.correctId ? "#344e24" : "#762e21",
              animation: "slideIn 0.25s ease", whiteSpace: "pre-line"
            }}>
              {q1Selected === MOTIVATION_QUESTIONS.q1.correctId && q2Selected === MOTIVATION_QUESTIONS.q2.correctId ? (
                <Smile size={14} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} />
              ) : (
                <AlertCircle size={14} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} />
              )}
              <strong>{q1Selected === MOTIVATION_QUESTIONS.q1.correctId && q2Selected === MOTIVATION_QUESTIONS.q2.correctId ? "All Correct!" : "Answers Incorrect."}</strong>
              <br />{quizFeedback}
            </div>
          )
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: `1px solid ${STEEL_BORDER}`,
        paddingTop: "8px",
        fontSize: "10px",
        color: INK_MUTED
      }}>
        <span>Module 16 · Chapter 1 · Lesson 1</span>
        <span>KP Lineage Timeline</span>
      </div>
    </div>
  );
}
