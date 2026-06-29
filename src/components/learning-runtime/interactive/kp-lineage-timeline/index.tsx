"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, ShieldCheck, ShieldAlert, AlertOctagon,
  CheckCircle2, RotateCcw, Compass, Smile, Layers,
  Target, Clock, Grid3X3, Microscope, BookOpen, Users
} from "lucide-react";
import { IAST } from "../../chrome/typography";

const STEEL_BLUE = "#365c7a";
const STEEL_DEEP = "#21394c";
const STEEL_LIGHT = "rgba(54, 92, 122, 0.05)";
const STEEL_BORDER = "rgba(54, 92, 122, 0.18)";
const GREEN = "#4e7037";
const GREEN_LIGHT = "rgba(78, 112, 55, 0.08)";
const RED = "#ad4b37";
const RED_LIGHT = "rgba(173, 75, 55, 0.08)";
const AMBER = "#d97706";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

type TabKey = "chronology" | "motivations" | "continuity" | "absorption" | "framing";

interface TimelineNode {
  year: string;
  title: string;
  emoji: string;
  summary: string;
  detail: string;
  tags: string[];
}

const TIMELINE_NODES: TimelineNode[] = [
  {
    year: "1908",
    title: "Birth & Cultural Roots",
    emoji: "👶",
    summary: "Born in Tamil Nadu, South India, within the classical Tamil cultural context.",
    detail: "Kuppali Sundra Krishnamurti (K.S. Krishnamurti) was born in 1908. He grew up in an environment rich in South-Indian classical astrology traditions, laying the groundwork for his future study.",
    tags: ["Biography"]
  },
  {
    year: "1930s-40s",
    title: "Parāśarī Training & Practice",
    emoji: "📚",
    summary: "Extensively trained and practiced classical Parāśarī Vedic astrology.",
    detail: "Krishnamurti mastered standard Parāśarī techniques, including the Vimśottarī daśā and sign lord analysis. Over years of client practice, he noted a recurring challenge: predictions were often theoretically correct but lacked precise timing (precision-inconsistency).",
    tags: ["Precision-inconsistency", "Classical foundation"]
  },
  {
    year: "1950s",
    title: "Methodological Innovation",
    emoji: "🧪",
    summary: "Began systematic experimentation to refine event-timing resolution.",
    detail: "To solve the timing-inconsistency, he integrated the Placidus house-system (Western horary) with sidereal zodiac nakṣatra-pādā divisions. This led to his signature sub-lord doctrine and the 249 sub-divisions.",
    tags: ["Placidus cusps", "Sub-lord doctrine", "249 subs"]
  },
  {
    year: "1960s-70s",
    title: "Reader Series Publication",
    emoji: "✍️",
    summary: "Published the foundational 6-volume KP Reader Series.",
    detail: "He authored and compiled the KP Reader Series (Vols I–VI), establishing a structured canonical literature. He also founded the KP federation to train a growing pan-Indian practitioner community.",
    tags: ["Canonical literature", "Community"]
  },
  {
    year: "1972",
    title: "Transition to Legacy",
    emoji: "🕊️",
    summary: "Krishnamurti passed away; authority transitioned to community validation.",
    detail: "With his passing in 1972, KP's authority shifted from a founding-author model to an active commentarial and empirical-verification framework sustained by his student lineage.",
    tags: ["Epistemic hand-off"]
  },
  {
    year: "Modern",
    title: "Evolving Lineage & Ecosystem",
    emoji: "🌐",
    summary: "Sustained by key commentators (Bosmia, Subramaniam, Sharma) pan-globally.",
    detail: "Today, the KP stream is an actively-systematizing global community with ongoing commentarial contributions. It coexists as the second stream in Grahvani's five-stream-plus framework.",
    tags: ["Lineage", "Five streams"]
  }
];

const MOTIVATIONS = [
  {
    id: "precision",
    icon: Target,
    title: "Precision-inconsistency",
    problem: "Classical Parāśarī predictions were often right in principle but imprecise on timing.",
    response: "KP sought systematic event-timing precision through cuspal sub-lords."
  },
  {
    id: "coarse",
    icon: Grid3X3,
    title: "Coarse whole-sign cusps",
    problem: "Whole-sign cusps sit at 0° of a sign, giving no differentiation within the sign-arc.",
    response: "Placidus cusps place house boundaries at specific degrees for finer resolution."
  },
  {
    id: "systematic",
    icon: Clock,
    title: "Need for systematic timing",
    problem: "Event timing needed a repeatable, rule-based method rather than intuition alone.",
    response: "The 249-subs subdivision and ruling-planets methodology provide a systematic framework."
  },
  {
    id: "empirical",
    icon: Microscope,
    title: "Empirical tracking",
    problem: "Methodology needed repeated verification against actual outcomes.",
    response: "Krishnamurti documented predictions and outcomes over years to refine the system."
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

const FIVE_STREAMS = [
  { name: "Parāśarī", position: "1st", color: STEEL_BLUE },
  { name: "KP", position: "2nd", color: AMBER },
  { name: "Jaimini", position: "3rd", color: STEEL_BLUE },
  { name: "Lal Kitab", position: "4th", color: STEEL_BLUE },
  { name: "Tājika", position: "5th", color: STEEL_BLUE }
];

export function KPLineageTimeline() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<TabKey>("chronology");

  const [classifications, setClassifications] = useState<Record<string, "retained" | "added" | null>>({
    zodiac: null, dasha: null, placidus: null, sublord: null, portfolios: null, ruling: null, nodes: null
  });
  const [classificationVerified, setClassificationVerified] = useState<boolean>(false);
  const [classificationFeedback, setClassificationFeedback] = useState<string | null>(null);

  const [framingIndex, setFramingIndex] = useState<number>(1);

  const [q1Selected, setQ1Selected] = useState<string | null>(null);
  const [q2Selected, setQ2Selected] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

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
      setClassificationFeedback("Correct! KP shows continuity-with-distinctness: classical bases are retained while Placidus, sub-lords, 249-divisions, and Ruling Planets are KP additions.");
    } else {
      setClassificationFeedback(`Incorrect mapping for ${incorrect.length} element(s). Review their doctrinal purpose and try again.`);
    }
  };

  const handleResetClassification = () => {
    setClassifications({ zodiac: null, dasha: null, placidus: null, sublord: null, portfolios: null, ruling: null, nodes: null });
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
      setQuizFeedback(`${MOTIVATION_QUESTIONS.q1.feedback}\n\n${MOTIVATION_QUESTIONS.q2.feedback}`);
    } else {
      let errText = "";
      if (!q1Correct) errText += "Q1 is incorrect. Hint: Krishnamurti wanted to subdivide sign-arcs because whole-sign cusps did not differentiate degrees. ";
      if (!q2Correct) errText += "Q2 is incorrect. Hint: The Reader Series was published during the 1960s-70s.";
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

  const handleResetAll = () => {
    setActiveStep(0);
    setActiveTab("chronology");
    handleResetClassification();
    handleResetQuiz();
    setAbsAnswer(null);
    setAbsFeedback(null);
    setFramingIndex(1);
  };

  const tabButtons: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "chronology", label: "Chronology", icon: Compass },
    { key: "motivations", label: "4 Motivations", icon: Target },
    { key: "continuity", label: "Continuity", icon: CheckCircle2 },
    { key: "absorption", label: "Absorption", icon: Layers },
    { key: "framing", label: "Framing", icon: ShieldCheck },
  ];

  return (
    <div style={{ padding: "16px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.80)", backdropFilter: "blur(14px)", border: `1px solid ${STEEL_BORDER}`, fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "980px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .kpt-nav-btn { border: none; background: transparent; cursor: pointer; padding: 7px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; color: ${INK_MUTED}; transition: all 0.2s ease; display: flex; align-items: center; gap: 5px; }
        .kpt-nav-btn:hover { color: ${STEEL_BLUE}; background: rgba(54, 92, 122, 0.05); }
        .kpt-nav-btn.active { background: rgba(54, 92, 122, 0.1); color: ${STEEL_BLUE}; }
        .timeline-dot { cursor: pointer; position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; z-index: 2; flex: 1; transition: all 0.25s ease; }
        .timeline-dot:hover { transform: translateY(-2px); }
        .dot-circle { width: 32px; height: 32px; border-radius: 50%; background: #ffffff; border: 2px solid ${STEEL_BORDER}; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.25s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .timeline-dot.active .dot-circle { border-color: ${STEEL_BLUE}; background: ${STEEL_BLUE}; color: #ffffff; box-shadow: 0 0 10px rgba(54, 92, 122, 0.35); }
        .quiz-option { display: flex; align-items: center; gap: 8px; padding: 7px 10px; background: rgba(255,255,255,0.5); border: 1px solid ${STEEL_BORDER}; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; }
        .quiz-option:hover:not(.submitted) { background: #ffffff; border-color: ${STEEL_BLUE}; }
        .quiz-option.selected { background: rgba(54, 92, 122, 0.05); border-color: ${STEEL_BLUE}; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", borderBottom: `1px solid ${STEEL_BORDER}`, paddingBottom: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: STEEL_DEEP, display: "flex", alignItems: "center", gap: "8px" }}>
            <Compass size={18} /> K.S. Krishnamurti: Biography & Motivations
          </h3>
          <p style={{ margin: "3px 0 0 0", fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.45" }}>
            Trace Krishnamurti&apos;s path from classical Parāśarī practice to the high-precision KP overlay.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", color: INK_MUTED, fontStyle: "italic" }}>के. एस. कृष्णमूर्ति — जीवनी</span>
          <button onClick={handleResetAll} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", border: `1px solid ${STEEL_BORDER}`, borderRadius: "6px", background: "transparent", color: INK_SECONDARY, fontSize: "10px", fontWeight: 700, cursor: "pointer" }}>
            <RotateCcw size={11} /> Reset
          </button>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: "3px", background: STEEL_LIGHT, borderRadius: "8px", padding: "3px", flexWrap: "wrap" }}>
        {tabButtons.map(btn => (
          <button key={btn.key} onClick={() => setActiveTab(btn.key)} className={`kpt-nav-btn ${activeTab === btn.key ? "active" : ""}`}>
            <btn.icon size={13} /> {btn.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ minHeight: "260px" }}>
        <AnimatePresence mode="wait">

          {activeTab === "chronology" && (
            <motion.div key="chronology" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Scrollable Parchment-Style SVG Lineage Timeline */}
              <div style={{ background: "rgba(253, 246, 227, 0.35)", borderRadius: "10px", border: `1px solid ${STEEL_BORDER}`, padding: "12px", overflowX: "auto" }}>
                <svg viewBox="0 0 600 90" style={{ minWidth: "550px", width: "100%", height: "auto", display: "block" }} aria-label="Interactive Lineage Tree">
                  {/* Lineage Thread */}
                  <path d="M 50,45 L 550,45" fill="none" stroke={STEEL_BORDER} strokeWidth="3" />
                  {/* Active glowing path */}
                  <path d={`M 50,45 L ${50 + activeStep * 100},45`} fill="none" stroke={AMBER} strokeWidth="4" strokeLinecap="round" style={{ transition: "all 0.4s ease" }} />
                  {/* Era nodes */}
                  {TIMELINE_NODES.map((node, idx) => {
                    const x = 50 + idx * 100;
                    const isActive = idx === activeStep;
                    return (
                      <g key={node.year} style={{ cursor: "pointer" }} onClick={() => setActiveStep(idx)}>
                        {/* Glow filter under active node */}
                        {isActive && (
                          <circle cx={x} cy="45" r="22" fill={AMBER} opacity="0.25" />
                        )}
                        <circle cx={x} cy="45" r="16" fill={isActive ? AMBER : "#ffffff"} stroke={isActive ? AMBER : STEEL_BLUE} strokeWidth="2.5" style={{ transition: "all 0.25s ease" }} />
                        <text x={x} y="49" textAnchor="middle" fill={isActive ? "#ffffff" : STEEL_BLUE} fontSize="13" style={{ pointerEvents: "none" }}>{node.emoji}</text>
                        <text x={x} y="78" textAnchor="middle" fill={isActive ? AMBER : INK_SECONDARY} fontSize="10px" fontWeight="800" style={{ pointerEvents: "none" }}>{node.year}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div style={{ background: "#ffffff", border: `1.5px solid ${activeStep === 5 ? GREEN : activeStep === 4 ? RED : STEEL_BLUE}`, borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 4px 12px rgba(54, 92, 122, 0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px dashed ${STEEL_BORDER}`, paddingBottom: "6px" }}>
                  <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: STEEL_DEEP }}>{currentMilestone.title} <span style={{ color: INK_MUTED, fontWeight: 600 }}>({currentMilestone.year})</span></h4>
                  <span style={{ fontSize: "9px", color: STEEL_BLUE, fontWeight: 800, background: STEEL_LIGHT, padding: "2px 6px", borderRadius: "4px" }}>BIOGRAPHY</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {currentMilestone.tags.map(tag => (
                    <span key={tag} style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "4px", background: STEEL_LIGHT, color: STEEL_BLUE, fontWeight: 700 }}>{tag}</span>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: "11.5px", fontWeight: 700, color: INK_PRIMARY }}>{currentMilestone.summary}</p>
                <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.5", color: INK_SECONDARY }}>{currentMilestone.detail}</p>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <button onClick={() => setActiveStep(prev => Math.max(0, prev - 1))} disabled={activeStep === 0} style={{ border: `1.5px solid ${STEEL_BORDER}`, background: "transparent", color: STEEL_BLUE, padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: activeStep === 0 ? "default" : "pointer", opacity: activeStep === 0 ? 0.4 : 1 }}>Back</button>
                <button onClick={() => setActiveStep(prev => Math.min(TIMELINE_NODES.length - 1, prev + 1))} disabled={activeStep === TIMELINE_NODES.length - 1} style={{ border: `1.5px solid ${STEEL_BORDER}`, background: "transparent", color: STEEL_BLUE, padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: activeStep === TIMELINE_NODES.length - 1 ? "default" : "pointer", opacity: activeStep === TIMELINE_NODES.length - 1 ? 0.4 : 1 }}>Next</button>
              </div>
            </motion.div>
          )}

          {activeTab === "motivations" && (
            <motion.div key="motivations" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
                KP did not arise from a desire to replace Parāśarī. It arose from four documented practical problems Krishnamurti encountered in classical practice. Click each motivation to see the problem and KP&apos;s response.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
                {MOTIVATIONS.map((m, idx) => {
                  const Icon = m.icon;
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{ background: "#ffffff", border: `1.5px solid ${STEEL_BORDER}`, borderRadius: "10px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: STEEL_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", color: STEEL_BLUE }}>
                          <Icon size={13} />
                        </div>
                        <span style={{ fontSize: "11.5px", fontWeight: 800, color: STEEL_DEEP }}>{m.title}</span>
                      </div>
                      <div style={{ fontSize: "10px", color: RED, fontWeight: 700 }}>Problem:</div>
                      <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.4", color: INK_SECONDARY }}>{m.problem}</p>
                      <div style={{ fontSize: "10px", color: GREEN, fontWeight: 700 }}>KP response:</div>
                      <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.4", color: INK_SECONDARY }}>{m.response}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Five streams mini-SIV */}
              <div style={{ background: "#ffffff", border: `1px solid ${STEEL_BORDER}`, borderRadius: "10px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "10px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>KP in the five-stream framework</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  {FIVE_STREAMS.map((s, i) => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ padding: "5px 10px", borderRadius: "6px", background: s.name === "KP" ? `${AMBER}18` : STEEL_LIGHT, border: `1.5px solid ${s.name === "KP" ? AMBER : STEEL_BORDER}`, fontSize: "11px", fontWeight: s.name === "KP" ? 900 : 700, color: s.name === "KP" ? AMBER : STEEL_BLUE }}>
                        {s.position} {s.name}
                      </div>
                      {i < FIVE_STREAMS.length - 1 && <span style={{ color: INK_MUTED, fontSize: "12px" }}>→</span>}
                    </div>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: "10px", color: INK_MUTED, lineHeight: "1.4" }}>
                  KP is the <strong>second stream</strong> in the five-stream-plus framework — a 20th-century single-author systematization alongside Parāśarī, Jaimini, Lal Kitab, and Tājika.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "continuity" && (
            <motion.div key="continuity" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>Continuity vs. Distinctness Classification</span>
                {classificationVerified && <button onClick={handleResetClassification} style={{ border: "none", background: "transparent", color: STEEL_BLUE, fontSize: "10px", fontWeight: 750, textDecoration: "underline", cursor: "pointer" }}>Reset</button>}
              </div>
              <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
                KP builds an overlay of mathematical subdivisions on top of traditional principles. Mark each element as <strong>Retained Parāśarī</strong> or <strong>Added KP Refinement</strong>.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {CLASSIFIABLE_ELEMENTS.map(el => {
                  const currentVal = classifications[el.id];
                  return (
                    <div key={el.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", border: `1.5px solid ${currentVal === "retained" ? GREEN : currentVal === "added" ? STEEL_BLUE : STEEL_BORDER}`, padding: "10px 12px", borderRadius: "8px", flexWrap: "wrap", gap: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY, flex: 1 }}>{el.name}</span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button disabled={classificationVerified} onClick={() => handleClassify(el.id, "retained")} style={{ border: `1px solid ${GREEN}`, background: currentVal === "retained" ? GREEN : "transparent", color: currentVal === "retained" ? "#ffffff" : GREEN, fontSize: "9.5px", fontWeight: 800, padding: "4px 8px", borderRadius: "4px", cursor: classificationVerified ? "default" : "pointer" }}>Retained Parāśarī</button>
                        <button disabled={classificationVerified} onClick={() => handleClassify(el.id, "added")} style={{ border: `1px solid ${STEEL_BLUE}`, background: currentVal === "added" ? STEEL_BLUE : "transparent", color: currentVal === "added" ? "#ffffff" : STEEL_BLUE, fontSize: "9.5px", fontWeight: 800, padding: "4px 8px", borderRadius: "4px", cursor: classificationVerified ? "default" : "pointer" }}>Added KP Refinement</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {classificationFeedback && (
                <div style={{ background: classificationVerified ? GREEN_LIGHT : RED_LIGHT, borderLeft: `3px solid ${classificationVerified ? GREEN : RED}`, padding: "10px", borderRadius: "0 8px 8px 0", fontSize: "11px", lineHeight: "1.45", color: classificationVerified ? "#344e24" : "#762e21" }}>
                  <strong>{classificationVerified ? "Passed!" : "Review Required:"}</strong> {classificationFeedback}
                </div>
              )}

              {!classificationVerified && (
                <button onClick={handleVerifyClassification} style={{ alignSelf: "flex-start", border: "none", background: STEEL_BLUE, color: "#ffffff", fontSize: "11px", fontWeight: 750, padding: "7px 16px", borderRadius: "6px", cursor: "pointer" }}>
                  Verify Elements
                </button>
              )}
            </motion.div>
          )}

          {activeTab === "absorption" && (
            <motion.div key="absorption" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
                Vedic astrology has repeatedly absorbed external techniques. Both Tājika and KP illustrate this pattern — integrating foreign methods onto a sidereal base.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
                <div style={{ background: "#ffffff", border: `1px solid ${STEEL_BORDER}`, borderLeft: `4px solid ${STEEL_BLUE}`, borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <h4 style={{ margin: 0, fontSize: "12px", fontWeight: 800, color: STEEL_DEEP }}>KP Absorption Profile</h4>
                  <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "10.5px", color: INK_SECONDARY, display: "flex", flexDirection: "column", gap: "3px" }}>
                    <li><strong>Era:</strong> 20th Century (1960s).</li>
                    <li><strong>Source:</strong> Western Horary (William Lilly, 1647).</li>
                    <li><strong>Absorbed:</strong> Placidus cusps, significator-chain logic.</li>
                    <li><strong>Medium:</strong> English-language Readers and commentary.</li>
                  </ul>
                </div>
                <div style={{ background: "#ffffff", border: `1px solid ${STEEL_BORDER}`, borderLeft: `4px solid ${GREEN}`, borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <h4 style={{ margin: 0, fontSize: "12px", fontWeight: 800, color: GREEN }}>Tājika Absorption Profile</h4>
                  <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "10.5px", color: INK_SECONDARY, display: "flex", flexDirection: "column", gap: "3px" }}>
                    <li><strong>Era:</strong> Medieval Period (12th–16th c.).</li>
                    <li><strong>Source:</strong> Persian-Arabic-Hellenistic transmissions.</li>
                    <li><strong>Absorbed:</strong> Itthaśāla aspects, deeptāṁśa orbs, Varṣaphala.</li>
                    <li><strong>Medium:</strong> Sanskritized treatises (e.g. <IAST>Tājika Nīlakaṇṭhī</IAST>).</li>
                  </ul>
                </div>
              </div>

              <div style={{ background: STEEL_LIGHT, border: `1px solid ${STEEL_BORDER}`, borderRadius: "8px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <strong style={{ fontSize: "11px", color: STEEL_DEEP }}>Commonality:</strong>
                <p style={{ margin: 0, fontSize: "10.5px", color: INK_SECONDARY, lineHeight: "1.45" }}>
                  Both systems retain the traditional Indian <strong>sidereal zodiac base</strong>. Cross-cultural integration occurs within the sidereal framework — a feature, not a disqualification.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderTop: `1px dashed ${STEEL_BORDER}`, paddingTop: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: INK_PRIMARY }}>Self-Check: True or False? Both KP and Tājika discard the sidereal zodiac in favor of tropical coordinates.</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleAbsCheck(true)} style={{ padding: "4px 12px", fontSize: "10.5px", fontWeight: 700, borderRadius: "4px", border: `1px solid ${STEEL_BORDER}`, cursor: "pointer", background: absAnswer === true ? STEEL_BLUE : "transparent", color: absAnswer === true ? "#ffffff" : STEEL_BLUE }}>True</button>
                  <button onClick={() => handleAbsCheck(false)} style={{ padding: "4px 12px", fontSize: "10.5px", fontWeight: 700, borderRadius: "4px", border: `1px solid ${STEEL_BORDER}`, cursor: "pointer", background: absAnswer === false ? GREEN : "transparent", color: absAnswer === false ? "#ffffff" : GREEN }}>False</button>
                </div>
                {absFeedback && <div style={{ fontSize: "10.5px", color: absAnswer === false ? "#344e24" : "#762e21", fontStyle: "italic" }}>{absFeedback}</div>}
              </div>
            </motion.div>
          )}

          {activeTab === "framing" && (
            <motion.div key="framing" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.45" }}>
                Explore the two extreme traps (Hagiography vs. Scoffing) and Grahvani&apos;s honest middle-ground reframe.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", margin: "4px 0" }}>
                <input type="range" min="0" max="2" step="1" value={framingIndex} onChange={(e) => setFramingIndex(parseInt(e.target.value))} style={{ cursor: "pointer", accentColor: STEEL_BLUE }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9.5px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>
                  <span style={{ color: framingIndex === 0 ? RED : undefined }}>Hagiography</span>
                  <span style={{ color: framingIndex === 1 ? STEEL_BLUE : undefined }}>Honest Reframe</span>
                  <span style={{ color: framingIndex === 2 ? RED : undefined }}>Scoffing</span>
                </div>
              </div>

              <div style={{ background: framingIndex === 1 ? STEEL_LIGHT : RED_LIGHT, border: `1.5px solid ${framingIndex === 1 ? STEEL_BLUE : RED}`, borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {framingIndex === 0 && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: RED }}><ShieldAlert size={16} /><strong style={{ fontSize: "12px", textTransform: "uppercase" }}>Hagiography over-claim</strong></div>
                    <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_PRIMARY }}>
                      <em>&quot;Krishnamurti was an infallible genius. KP is the only valid system, superseding Parāśarī.&quot;</em>
                      <br /><strong style={{ color: RED }}>Violation:</strong> one-stream over-claim + always-accurate over-promise.
                    </p>
                  </>
                )}
                {framingIndex === 1 && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: STEEL_BLUE }}><ShieldCheck size={16} /><strong style={{ fontSize: "12px", textTransform: "uppercase" }}>Honest biographical reframe</strong></div>
                    <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_PRIMARY }}>
                      <em>&quot;Krishnamurti was an experienced classical practitioner who built a systematic 20th-century refinement. Legitimacy rests on methodology and ~60 years of community verification. KP coexists with other streams.&quot;</em>
                      <br /><strong style={{ color: STEEL_BLUE }}>Virtue:</strong> preserves contributions without over-promising or dismissing classical lineages.
                    </p>
                  </>
                )}
                {framingIndex === 2 && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: RED }}><ShieldAlert size={16} /><strong style={{ fontSize: "12px", textTransform: "uppercase" }}>Scoffing dismissal</strong></div>
                    <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_PRIMARY }}>
                      <em>&quot;KP is a corrupted foreign modern fad. Placidus and sub-lord nonsense ruined classical astrology.&quot;</em>
                      <br /><strong style={{ color: RED }}>Violation:</strong> dismisses cross-cultural absorption and fails to recognize verified lineage.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quiz */}
      <div style={{ background: "#ffffff", border: `1.5px solid ${STEEL_BORDER}`, borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>Timeline & Motivations Alignment</span>
          {quizSubmitted && <button onClick={handleResetQuiz} style={{ border: "none", background: "transparent", color: STEEL_BLUE, fontSize: "10px", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Try Again</button>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>Q1: {MOTIVATION_QUESTIONS.q1.question}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {MOTIVATION_QUESTIONS.q1.options.map(opt => (
              <div key={opt.id} onClick={() => !quizSubmitted && setQ1Selected(opt.id)} className={`quiz-option ${q1Selected === opt.id ? "selected" : ""} ${quizSubmitted ? "submitted" : ""}`}>
                <input type="radio" checked={q1Selected === opt.id} readOnly style={{ pointerEvents: "none" }} />
                <span style={{ fontSize: "10.5px", color: INK_SECONDARY }}>{opt.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>Q2: {MOTIVATION_QUESTIONS.q2.question}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {MOTIVATION_QUESTIONS.q2.options.map(opt => (
              <div key={opt.id} onClick={() => !quizSubmitted && setQ2Selected(opt.id)} className={`quiz-option ${q2Selected === opt.id ? "selected" : ""} ${quizSubmitted ? "submitted" : ""}`}>
                <input type="radio" checked={q2Selected === opt.id} readOnly style={{ pointerEvents: "none" }} />
                <span style={{ fontSize: "10.5px", color: INK_SECONDARY }}>{opt.text}</span>
              </div>
            ))}
          </div>
        </div>

        {!quizSubmitted ? (
          <button onClick={handleSubmitQuiz} disabled={!q1Selected || !q2Selected} style={{ alignSelf: "flex-start", border: "none", background: STEEL_BLUE, color: "#fff", padding: "7px 16px", borderRadius: "6px", fontSize: "11px", fontWeight: 750, cursor: "pointer", opacity: q1Selected && q2Selected ? 1 : 0.5 }}>
            Submit Answers
          </button>
        ) : quizFeedback && (
          <div style={{ background: q1Selected === MOTIVATION_QUESTIONS.q1.correctId && q2Selected === MOTIVATION_QUESTIONS.q2.correctId ? GREEN_LIGHT : RED_LIGHT, borderLeft: `3px solid ${q1Selected === MOTIVATION_QUESTIONS.q1.correctId && q2Selected === MOTIVATION_QUESTIONS.q2.correctId ? GREEN : RED}`, padding: "10px", borderRadius: "0 8px 8px 0", fontSize: "11px", lineHeight: "1.45", color: q1Selected === MOTIVATION_QUESTIONS.q1.correctId && q2Selected === MOTIVATION_QUESTIONS.q2.correctId ? "#344e24" : "#762e21", whiteSpace: "pre-line" }}>
            {q1Selected === MOTIVATION_QUESTIONS.q1.correctId && q2Selected === MOTIVATION_QUESTIONS.q2.correctId ? <Smile size={14} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} /> : <AlertCircle size={14} style={{ display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} />}
            <strong>{q1Selected === MOTIVATION_QUESTIONS.q1.correctId && q2Selected === MOTIVATION_QUESTIONS.q2.correctId ? "All Correct!" : "Review Required:"}</strong>{" "}{quizFeedback}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${STEEL_BORDER}`, paddingTop: "8px", fontSize: "9px", color: INK_MUTED, flexWrap: "wrap", gap: "4px" }}>
        <span>Module 16 · Chapter 1 · Lesson 1</span>
        <span>Sources: K.S. Krishnamurti, KP Reader Series Vol. I–VI; William Lilly, <IAST>Christian Astrology</IAST> (1647).</span>
      </div>
    </div>
  );
}
