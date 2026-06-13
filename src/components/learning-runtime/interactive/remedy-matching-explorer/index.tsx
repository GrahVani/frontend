"use client";

import React, { useState, useCallback } from "react";
import {
  AlertCircle, ShieldCheck, ShieldAlert, AlertOctagon,
  Activity, Zap, ChevronRight, ChevronLeft, BookOpen,
  CheckCircle2, XCircle, RotateCcw, Layers, Gem, Music,
  Heart, UtensilsCrossed, Lightbulb, ArrowRight
} from "lucide-react";

/* ── Design Tokens ── */
const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GREEN = "#4e7037";
const GREEN_LIGHT = "rgba(78, 112, 55, 0.06)";
const RED = "#ad4b37";
const RED_LIGHT = "rgba(173, 75, 55, 0.05)";

/* ── Data ── */
interface GrahaInfo {
  id: string;
  name: string;
  devanagari: string;
  gradient: string;
  emoji: string;
}

const GRAHAS: GrahaInfo[] = [
  { id: "sun", name: "Sun (Sūrya)", devanagari: "सूर्यः", emoji: "☉", gradient: "radial-gradient(circle at 35% 35%, #ff4d4d, #b30006 60%, #4a0002 100%)" },
  { id: "moon", name: "Moon (Candra)", devanagari: "चन्द्रः", emoji: "☽", gradient: "radial-gradient(circle at 35% 35%, #ffffff, #f7f3e6 45%, #dccda5 75%, #a59670 100%)" },
  { id: "mars", name: "Mars (Maṅgala)", devanagari: "मङ्गलः", emoji: "♂", gradient: "radial-gradient(circle at 35% 35%, #ff7a5c, #d32f2f 65%, #7f0000 100%)" },
  { id: "mercury", name: "Mercury (Budha)", devanagari: "बुधः", emoji: "☿", gradient: "radial-gradient(circle at 35% 35%, #39e678, #008f39 60%, #004d1a 100%)" },
  { id: "jupiter", name: "Jupiter (Guru)", devanagari: "गुरुः", emoji: "♃", gradient: "radial-gradient(circle at 35% 35%, #fff176, #fbc02d 60%, #f57f17 100%)" },
  { id: "venus", name: "Venus (Śukra)", devanagari: "शुक्रः", emoji: "♀", gradient: "radial-gradient(circle at 35% 35%, #ffffff 0%, #e1f5fe 35%, #b3e5fc 60%, #455a64 100%)" },
  { id: "saturn", name: "Saturn (Śani)", devanagari: "शनिः", emoji: "♄", gradient: "radial-gradient(circle at 35% 35%, #448aff, #0d47a1 60%, #0a1931 100%)" },
  { id: "rahu", name: "Rāhu", devanagari: "राहुः", emoji: "☊", gradient: "radial-gradient(circle at 35% 35%, #fb8c00, #a13d00 65%, #4e1a00 100%)" },
  { id: "ketu", name: "Ketu", devanagari: "केतुः", emoji: "☋", gradient: "radial-gradient(circle at 35% 35%, #90a4ae, #5d4037 50%, #3e2723 80%, #1a0f0d 100%)" },
];

type ChartState = "weak" | "harmful";
type RemedyCat = "gem" | "mantra" | "dana" | "fasting";

interface WorkedExample {
  title: string;
  scenario: string;
  correctAction: string;
  takeaway: string;
  icon: React.ReactNode;
}

const WORKED_EXAMPLES: WorkedExample[] = [
  {
    title: "Example 1 — Strengthen",
    scenario: "A beneficial-but-weak Jupiter is found in the chart. Jupiter is a functional benefic/yogakāraka but is under-delivering due to low dignity.",
    correctAction: "Strengthen → Yellow Sapphire (gemstone) + Jupiter mantra. Amplify the helpful planet's rays.",
    takeaway: "Amplify a helpful planet — strengthen via gemstone and mantra.",
    icon: <Zap size={16} style={{ color: GOLD_DEEP }} />,
  },
  {
    title: "Example 2 — Pacify",
    scenario: "A harmful Saturn is creating obstacles and delays. Saturn's malefic influence is dominating the chart.",
    correctAction: "Pacify → Śani dāna (charity), fasting on Saturday — NOT a blue sapphire. Appease, don't amplify.",
    takeaway: "Appease a malefic — pacify via dāna and fasting, never a gemstone.",
    icon: <Activity size={16} style={{ color: RED }} />,
  },
  {
    title: "Example 3 — Disclaimer",
    scenario: "A learner understands this matching logic and is tempted to prescribe a remedy to a friend who has chart problems.",
    correctAction: "The learner EXPLAINS the theory but does NOT prescribe. Prescription is gated to Tier-2 (Module 21) + Module 24 ethics + supervised practice.",
    takeaway: "Understanding ≠ a license to prescribe. Theory only at Tier-1.",
    icon: <AlertOctagon size={16} style={{ color: RED }} />,
  },
];

interface MistakeQuiz {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

const MISTAKES_QUIZ: MistakeQuiz[] = [
  {
    statement: "You should give a gemstone to a malefic planet to reduce its harmful effects.",
    isTrue: false,
    explanation: "Gemstones STRENGTHEN (amplify). Giving one to a malefic amplifies the harm. Malefics are PACIFIED with charity and fasting instead.",
  },
  {
    statement: "Understanding the matching framework at Tier-1 means you can prescribe remedies to clients.",
    isTrue: false,
    explanation: "This is THEORY ONLY. Prescription requires Tier-2 (Module 21), Module 24 ethics gate, and supervised practice.",
  },
  {
    statement: "Remedial situations usually require combining several categories, not just picking one.",
    isTrue: true,
    explanation: "Step 4 of the matching logic states that situations 'usually combine several categories for one situation' — a single remedy is rarely sufficient.",
  },
];

const STEP_LABELS = [
  { num: 1, label: "Identify Graha", icon: <Activity size={14} /> },
  { num: 2, label: "Strengthen or Pacify", icon: <Zap size={14} /> },
  { num: 3, label: "Choose Category", icon: <Layers size={14} /> },
  { num: 4, label: "Combine & Evaluate", icon: <CheckCircle2 size={14} /> },
];

const REMEDY_CATEGORIES: { id: RemedyCat; label: string; sublabel: string; icon: React.ReactNode; action: string }[] = [
  { id: "gem", label: "Gemstone (Ratna)", sublabel: "Amplifies planetary signal", icon: <Gem size={15} />, action: "strengthen" },
  { id: "mantra", label: "Mantra", sublabel: "Amplifies via vibration", icon: <Music size={15} />, action: "strengthen" },
  { id: "dana", label: "Dāna (Charity)", sublabel: "Appeases via giving", icon: <Heart size={15} />, action: "pacify" },
  { id: "fasting", label: "Upavāsa (Fasting)", sublabel: "Purifies via restraint", icon: <UtensilsCrossed size={15} />, action: "pacify" },
];

/* ── Main Component ── */
export function RemedyMatchingExplorer() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedGrahaId, setSelectedGrahaId] = useState("saturn");
  const [chartState, setChartState] = useState<ChartState>("harmful");
  const [selectedCategories, setSelectedCategories] = useState<RemedyCat[]>([]);
  const [showEvaluation, setShowEvaluation] = useState(false);

  // Worked examples tab
  const [activeTab, setActiveTab] = useState<"flow" | "examples" | "quiz">("flow");
  const [exampleIdx, setExampleIdx] = useState(0);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean | null>>({});
  const [quizRevealed, setQuizRevealed] = useState<Record<number, boolean>>({});

  const currentGraha = GRAHAS.find(g => g.id === selectedGrahaId) || GRAHAS[6];

  const handleSelectGraha = useCallback((id: string) => {
    setSelectedGrahaId(id);
    setSelectedCategories([]);
    setShowEvaluation(false);
    if (activeStep < 2) setActiveStep(2);
  }, [activeStep]);

  const handleSelectState = useCallback((state: ChartState) => {
    setChartState(state);
    setSelectedCategories([]);
    setShowEvaluation(false);
    if (activeStep < 3) setActiveStep(3);
  }, [activeStep]);

  const handleToggleCategory = useCallback((cat: RemedyCat) => {
    setSelectedCategories(prev => {
      const has = prev.includes(cat);
      const next = has ? prev.filter(c => c !== cat) : [...prev, cat];
      return next;
    });
    setShowEvaluation(false);
    if (activeStep < 4) setActiveStep(4);
  }, [activeStep]);

  const handleEvaluate = useCallback(() => {
    setShowEvaluation(true);
  }, []);

  const handleReset = useCallback(() => {
    setActiveStep(1);
    setSelectedGrahaId("saturn");
    setChartState("harmful");
    setSelectedCategories([]);
    setShowEvaluation(false);
  }, []);

  const handleQuizAnswer = (idx: number, answer: boolean) => {
    setQuizAnswers(prev => ({ ...prev, [idx]: answer }));
    setQuizRevealed(prev => ({ ...prev, [idx]: true }));
  };

  /* ── Evaluation Logic ── */
  const getEvaluation = () => {
    if (selectedCategories.length === 0) return null;

    const results: { cat: RemedyCat; correct: boolean; hazardous?: boolean; message: string }[] = [];
    const gName = currentGraha.name.split(" ")[0];

    for (const cat of selectedCategories) {
      if (chartState === "weak") {
        if (cat === "gem") results.push({ cat, correct: true, message: `Gemstone correctly selected to STRENGTHEN weak-but-beneficial ${gName}. Amplifies helpful rays.` });
        else if (cat === "mantra") results.push({ cat, correct: true, message: `Mantra correctly selected to STRENGTHEN ${gName}. Vibrations amplify planetary energy.` });
        else if (cat === "dana") results.push({ cat, correct: false, message: `Dāna (charity) PACIFIES — it does not strengthen a weak benefic. Mismatched goal.` });
        else if (cat === "fasting") results.push({ cat, correct: false, message: `Upavāsa (fasting) PACIFIES — it restrains, not amplifies. Mismatched goal.` });
      } else {
        if (cat === "dana") results.push({ cat, correct: true, message: `Dāna correctly selected to PACIFY harmful ${gName}. Charity appeases without amplifying.` });
        else if (cat === "fasting") results.push({ cat, correct: true, message: `Upavāsa correctly selected to PACIFY ${gName}. Mindful fasting soothes malefic influence.` });
        else if (cat === "gem") results.push({ cat, correct: false, hazardous: true, message: `CRITICAL SAFETY WARNING: Gemstones STRENGTHEN (amplify). Wearing a stone for malefic ${gName} would AMPLIFY the harmful influence. Never strengthen a malefic!` });
        else if (cat === "mantra") results.push({ cat, correct: false, message: `CAUTION: Mantras amplify planetary vibration. Amplifying a malefic is risky. Safe default: charity and fasting.` });
      }
    }

    // Check combination
    const correctCount = results.filter(r => r.correct).length;
    const hasHazard = results.some(r => r.hazardous);
    const hasCombination = selectedCategories.length >= 2;

    return { results, correctCount, hasHazard, hasCombination };
  };

  const evaluation = showEvaluation ? getEvaluation() : null;

  /* ── Gemstone Safety Connection (§4.2) ── */
  const showSafetyConnection = chartState === "harmful" && selectedCategories.includes("gem");

  return (
    <div style={{
      padding: "20px",
      borderRadius: "16px",
      background: "rgba(255, 253, 248, 0.80)",
      backdropFilter: "blur(14px)",
      border: "1px solid rgba(156, 122, 47, 0.15)",
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
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(156,122,47,0.15); } 50% { box-shadow: 0 0 12px 2px rgba(156,122,47,0.25); } }
        @keyframes shakeHazard { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); } 20%, 40%, 60%, 80% { transform: translateX(2px); } }
        .rme-graha-orb {
          cursor: pointer; border-radius: 50%; width: 36px; height: 36px;
          border: 2.5px solid transparent; transition: all 0.25s ease;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .rme-graha-orb:hover { transform: scale(1.12); border-color: rgba(156,122,47,0.4); }
        .rme-graha-orb.selected { border-color: ${GOLD_DEEP}; transform: scale(1.18); box-shadow: 0 0 14px rgba(156,122,47,0.45); animation: pulseGlow 2s ease-in-out infinite; }
        .rme-state-btn {
          border: 1.5px solid rgba(156,122,47,0.2); background: rgba(255,255,255,0.5);
          cursor: pointer; transition: all 0.25s ease; padding: 12px 16px; border-radius: 10px;
          font-size: 12px; font-weight: 700; color: ${INK_SECONDARY}; flex: 1;
          display: flex; align-items: center; gap: 8px;
        }
        .rme-state-btn:hover { border-color: ${GOLD}; background: rgba(251,248,243,0.8); }
        .rme-state-btn.active-weak { background: rgba(156,122,47,0.06); border-color: ${GOLD_DEEP}; color: ${GOLD_DEEP}; }
        .rme-state-btn.active-harmful { background: ${RED_LIGHT}; border-color: ${RED}; color: ${RED}; }
        .rme-cat-chip {
          border: 1.5px solid rgba(156,122,47,0.18); background: rgba(255,255,255,0.5);
          cursor: pointer; transition: all 0.25s ease; padding: 10px 14px; border-radius: 10px;
          font-size: 11.5px; font-weight: 700; color: ${INK_SECONDARY};
          display: flex; align-items: center; gap: 8px; flex: 1; min-width: 140px;
        }
        .rme-cat-chip:hover { border-color: ${GOLD}; background: rgba(251,248,243,0.7); transform: translateY(-1px); }
        .rme-cat-chip.selected { border-color: ${GOLD_DEEP}; background: rgba(156,122,47,0.08); color: ${GOLD_DEEP}; }
        .rme-cat-chip.hazard { border-color: ${RED}; background: ${RED_LIGHT}; color: ${RED}; animation: shakeHazard 0.5s ease; }
        .rme-tab-btn {
          border: none; background: transparent; cursor: pointer; padding: 8px 16px;
          border-radius: 8px; font-size: 11.5px; font-weight: 700; color: ${INK_MUTED};
          transition: all 0.2s ease;
        }
        .rme-tab-btn:hover { color: ${GOLD_DEEP}; background: rgba(156,122,47,0.04); }
        .rme-tab-btn.active { background: rgba(156,122,47,0.08); color: ${GOLD_DEEP}; }
        .rme-quiz-btn {
          border: 1.5px solid rgba(156,122,47,0.18); background: rgba(255,255,255,0.5);
          cursor: pointer; transition: all 0.2s ease; padding: 8px 18px; border-radius: 8px;
          font-size: 11px; font-weight: 700;
        }
        .rme-quiz-btn:hover:not(:disabled) { border-color: ${GOLD}; }
        .rme-quiz-btn:disabled { opacity: 0.6; cursor: default; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ borderBottom: "1px solid rgba(156,122,47,0.12)", paddingBottom: "12px" }}>
        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "8px" }}>
          <Layers size={18} />
          Remedy Matching Framework Explorer
        </h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "11.5px", color: INK_SECONDARY, lineHeight: "1.45" }}>
          Walk the 4-step matching logic: identify the graha → decide strengthen or pacify → choose categories → combine and evaluate. <strong style={{ color: RED }}>Theory only — not a prescription license.</strong>
        </p>
      </div>

      {/* ── TAB SWITCHER ── */}
      <div style={{ display: "flex", gap: "4px", background: "rgba(156,122,47,0.03)", borderRadius: "10px", padding: "3px" }}>
        <button onClick={() => setActiveTab("flow")} className={`rme-tab-btn ${activeTab === "flow" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Layers size={13} /> 4-Step Matching Flow</span>
        </button>
        <button onClick={() => setActiveTab("examples")} className={`rme-tab-btn ${activeTab === "examples" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><BookOpen size={13} /> Worked Examples</span>
        </button>
        <button onClick={() => setActiveTab("quiz")} className={`rme-tab-btn ${activeTab === "quiz" ? "active" : ""}`}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Lightbulb size={13} /> Common Mistakes Quiz</span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 1: 4-STEP MATCHING FLOW                           */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "flow" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "slideIn 0.3s ease" }}>

          {/* ── STEP PROGRESS BAR ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0", justifyContent: "center" }}>
            {STEP_LABELS.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div
                  onClick={() => setActiveStep(step.num)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "6px 14px", borderRadius: "20px", cursor: "pointer",
                    background: activeStep >= step.num ? "rgba(156,122,47,0.08)" : "transparent",
                    border: `1.5px solid ${activeStep >= step.num ? GOLD_DEEP : "rgba(156,122,47,0.12)"}`,
                    transition: "all 0.3s ease",
                  }}
                >
                  <span style={{
                    width: "22px", height: "22px", borderRadius: "50%",
                    background: activeStep >= step.num ? GOLD_DEEP : "rgba(156,122,47,0.1)",
                    color: activeStep >= step.num ? "#fff" : INK_MUTED,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 800, transition: "all 0.3s ease",
                  }}>
                    {activeStep > step.num ? <CheckCircle2 size={12} /> : step.num}
                  </span>
                  <span style={{
                    fontSize: "10px", fontWeight: 700,
                    color: activeStep >= step.num ? GOLD_DEEP : INK_MUTED,
                  }}>
                    {step.label}
                  </span>
                </div>
                {idx < STEP_LABELS.length - 1 && (
                  <div style={{
                    width: "24px", height: "2px",
                    background: activeStep > step.num ? GOLD_DEEP : "rgba(156,122,47,0.12)",
                    transition: "all 0.3s ease",
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ── STEP 1: SELECT PLANET ── */}
          <div style={{
            display: "flex", flexDirection: "column", gap: "8px",
            background: activeStep === 1 ? "rgba(156,122,47,0.03)" : "transparent",
            border: `1px solid ${activeStep === 1 ? "rgba(156,122,47,0.15)" : "rgba(156,122,47,0.06)"}`,
            borderRadius: "12px", padding: "14px", transition: "all 0.3s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                width: "20px", height: "20px", borderRadius: "50%",
                background: activeStep >= 1 ? GOLD_DEEP : "rgba(156,122,47,0.1)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "9px", fontWeight: 800,
              }}>1</span>
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: activeStep >= 1 ? GOLD_DEEP : INK_MUTED, letterSpacing: "0.5px" }}>
                Identify the Relevant Graha
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", paddingLeft: "28px" }}>
              {GRAHAS.map(g => (
                <button
                  key={g.id}
                  onClick={() => handleSelectGraha(g.id)}
                  className={`rme-graha-orb ${g.id === selectedGrahaId ? "selected" : ""}`}
                  style={{ background: g.gradient }}
                  title={g.name}
                >
                  <span style={{ fontSize: "12px" }}>{g.emoji}</span>
                </button>
              ))}
            </div>
            <div style={{ paddingLeft: "28px", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: currentGraha.gradient, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }} />
              <div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: INK_PRIMARY }}>{currentGraha.name}</div>
                <div style={{ fontSize: "11px", color: INK_MUTED }}>{currentGraha.devanagari}</div>
              </div>
            </div>
          </div>

          {/* ── STEP 2: ASSESS CHART STATE ── */}
          <div style={{
            display: "flex", flexDirection: "column", gap: "8px",
            background: activeStep === 2 ? "rgba(156,122,47,0.03)" : "transparent",
            border: `1px solid ${activeStep === 2 ? "rgba(156,122,47,0.15)" : "rgba(156,122,47,0.06)"}`,
            borderRadius: "12px", padding: "14px", transition: "all 0.3s ease",
            opacity: activeStep >= 2 ? 1 : 0.45, pointerEvents: activeStep >= 2 ? "auto" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                width: "20px", height: "20px", borderRadius: "50%",
                background: activeStep >= 2 ? GOLD_DEEP : "rgba(156,122,47,0.1)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "9px", fontWeight: 800,
              }}>2</span>
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: activeStep >= 2 ? GOLD_DEEP : INK_MUTED, letterSpacing: "0.5px" }}>
                Decide: Strengthen or Pacify?
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px", paddingLeft: "28px" }}>
              <button
                onClick={() => handleSelectState("weak")}
                className={`rme-state-btn ${chartState === "weak" ? "active-weak" : ""}`}
              >
                <Zap size={16} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "12px" }}>STRENGTHEN</div>
                  <div style={{ fontWeight: 500, fontSize: "10px", opacity: 0.8 }}>Beneficial but weak</div>
                </div>
              </button>
              <button
                onClick={() => handleSelectState("harmful")}
                className={`rme-state-btn ${chartState === "harmful" ? "active-harmful" : ""}`}
              >
                <Activity size={16} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "12px" }}>PACIFY</div>
                  <div style={{ fontWeight: 500, fontSize: "10px", opacity: 0.8 }}>Malefic / Harmful</div>
                </div>
              </button>
            </div>
            {/* Goal explanation */}
            <div style={{
              marginLeft: "28px", padding: "10px 14px", borderRadius: "8px",
              background: chartState === "weak" ? "rgba(156,122,47,0.04)" : RED_LIGHT,
              borderLeft: `3px solid ${chartState === "weak" ? GOLD_DEEP : RED}`,
              fontSize: "11px", lineHeight: "1.5", color: INK_SECONDARY,
            }}>
              {chartState === "weak"
                ? "We strengthen a weak beneficial planet (functional benefic / yogakāraka under-delivering) to boost its helpful rays."
                : "We pacify a malefic or harmful planet to soothe and appease its energy, mitigating conflict without increasing its signal force."
              }
            </div>
          </div>

          {/* ── STEP 3: CHOOSE CATEGORIES (multi-select) ── */}
          <div style={{
            display: "flex", flexDirection: "column", gap: "8px",
            background: activeStep === 3 ? "rgba(156,122,47,0.03)" : "transparent",
            border: `1px solid ${activeStep === 3 ? "rgba(156,122,47,0.15)" : "rgba(156,122,47,0.06)"}`,
            borderRadius: "12px", padding: "14px", transition: "all 0.3s ease",
            opacity: activeStep >= 3 ? 1 : 0.45, pointerEvents: activeStep >= 3 ? "auto" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: activeStep >= 3 ? GOLD_DEEP : "rgba(156,122,47,0.1)",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "9px", fontWeight: 800,
                }}>3</span>
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: activeStep >= 3 ? GOLD_DEEP : INK_MUTED, letterSpacing: "0.5px" }}>
                  Choose Remedy Categories
                </span>
              </div>
              <span style={{
                fontSize: "9.5px", fontWeight: 700, color: GOLD_DEEP,
                background: "rgba(156,122,47,0.08)", padding: "3px 8px", borderRadius: "4px",
              }}>
                Multi-select: combine categories
              </span>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", paddingLeft: "28px" }}>
              {REMEDY_CATEGORIES.map(cat => {
                const isSelected = selectedCategories.includes(cat.id);
                const isHazard = showEvaluation && isSelected && evaluation?.results.find(r => r.cat === cat.id)?.hazardous;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleToggleCategory(cat.id)}
                    className={`rme-cat-chip ${isSelected ? (isHazard ? "hazard" : "selected") : ""}`}
                  >
                    {cat.icon}
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "11.5px", fontWeight: 800 }}>{cat.label}</div>
                      <div style={{ fontSize: "9.5px", fontWeight: 500, opacity: 0.7 }}>{cat.sublabel}</div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 size={14} style={{ marginLeft: "auto", color: isHazard ? RED : GOLD_DEEP }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Gemstone Safety Connection (§4.2) */}
            {showSafetyConnection && (
              <div style={{
                marginLeft: "28px", padding: "12px 14px", borderRadius: "10px",
                background: "rgba(173, 75, 55, 0.06)", border: `1.5px solid ${RED}`,
                display: "flex", gap: "10px", alignItems: "flex-start",
                animation: "slideIn 0.3s ease",
              }}>
                <ShieldAlert size={18} style={{ color: RED, flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: RED, textTransform: "uppercase" }}>
                    § 4.2 — Gemstone Safety Connection
                  </div>
                  <p style={{ margin: "4px 0 0 0", fontSize: "11px", lineHeight: "1.5", color: "#762e21" }}>
                    This is exactly <strong>why gemstones (which strengthen) are NEVER for malefics</strong>. Gemstones amplify
                    — so giving one to a harmful planet amplifies the harm. The strengthen-vs-pacify framework makes this
                    safety rule fall out naturally: <strong>pacify with charity and discipline, not a stone</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── STEP 4: COMBINE & EVALUATE ── */}
          <div style={{
            display: "flex", flexDirection: "column", gap: "10px",
            background: activeStep === 4 ? "rgba(156,122,47,0.03)" : "transparent",
            border: `1px solid ${activeStep === 4 ? "rgba(156,122,47,0.15)" : "rgba(156,122,47,0.06)"}`,
            borderRadius: "12px", padding: "14px", transition: "all 0.3s ease",
            opacity: activeStep >= 4 ? 1 : 0.45, pointerEvents: activeStep >= 4 ? "auto" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: activeStep >= 4 ? GOLD_DEEP : "rgba(156,122,47,0.1)",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "9px", fontWeight: 800,
                }}>4</span>
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: activeStep >= 4 ? GOLD_DEEP : INK_MUTED, letterSpacing: "0.5px" }}>
                  Combine & Evaluate
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleEvaluate}
                  disabled={selectedCategories.length === 0}
                  style={{
                    border: "none", background: selectedCategories.length > 0 ? GOLD_DEEP : "rgba(156,122,47,0.15)",
                    color: "#fff", padding: "7px 16px", borderRadius: "8px",
                    fontSize: "11px", fontWeight: 750, cursor: selectedCategories.length > 0 ? "pointer" : "default",
                    transition: "all 0.2s ease", opacity: selectedCategories.length > 0 ? 1 : 0.5,
                  }}
                >
                  Evaluate Selection
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    border: `1px solid ${GOLD}`, background: "transparent",
                    color: GOLD_DEEP, padding: "7px 12px", borderRadius: "8px",
                    fontSize: "11px", fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "4px",
                  }}
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>
            </div>

            {/* Evaluation results */}
            {evaluation && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingLeft: "28px", animation: "slideIn 0.3s ease" }}>
                {/* Combination feedback */}
                {evaluation.hasCombination && (
                  <div style={{
                    padding: "8px 12px", borderRadius: "8px",
                    background: "rgba(156,122,47,0.04)", borderLeft: `3px solid ${GOLD_DEEP}`,
                    fontSize: "11px", color: GOLD_DEEP, fontWeight: 700,
                  }}>
                    ✦ You selected {selectedCategories.length} categories — good! Situations usually combine several categories.
                  </div>
                )}

                {/* Individual results */}
                {evaluation.results.map((r, i) => {
                  const catInfo = REMEDY_CATEGORIES.find(c => c.id === r.cat);
                  return (
                    <div key={i} style={{
                      padding: "10px 14px", borderRadius: "10px",
                      background: r.correct ? GREEN_LIGHT : RED_LIGHT,
                      border: `1px solid ${r.correct ? GREEN : r.hazardous ? RED : "rgba(156,122,47,0.2)"}`,
                      display: "flex", gap: "10px", alignItems: "flex-start",
                    }}>
                      {r.correct
                        ? <ShieldCheck size={16} style={{ color: GREEN, flexShrink: 0, marginTop: "1px" }} />
                        : r.hazardous
                          ? <ShieldAlert size={16} style={{ color: RED, flexShrink: 0, marginTop: "1px" }} />
                          : <AlertCircle size={16} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "1px" }} />
                      }
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: 800, color: r.correct ? GREEN : r.hazardous ? RED : GOLD_DEEP }}>
                          {catInfo?.label} — {r.correct ? "Correct Match" : r.hazardous ? "CRITICAL SAFETY WARNING" : "Mismatched Category"}
                        </div>
                        <p style={{ margin: "3px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: r.correct ? "#344e24" : r.hazardous ? "#762e21" : INK_SECONDARY }}>
                          {r.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty state prompt */}
            {!evaluation && selectedCategories.length === 0 && activeStep >= 4 && (
              <div style={{
                marginLeft: "28px", padding: "14px", borderRadius: "10px",
                background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)",
                fontSize: "11px", color: INK_MUTED, textAlign: "center",
              }}>
                Select one or more remedy categories above, then click "Evaluate Selection" to see the matching analysis.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 2: WORKED EXAMPLES (§6)                           */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "examples" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
              Worked Examples from §6
            </span>
            <span style={{ fontSize: "10px", color: INK_MUTED }}>
              {exampleIdx + 1} / {WORKED_EXAMPLES.length}
            </span>
          </div>

          {/* Example card */}
          <div style={{
            background: "#ffffff", border: "1px solid rgba(156,122,47,0.12)",
            borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column",
            gap: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", animation: "slideIn 0.25s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(156,122,47,0.08)", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {WORKED_EXAMPLES[exampleIdx].icon}
              </div>
              <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: GOLD_DEEP }}>
                {WORKED_EXAMPLES[exampleIdx].title}
              </h4>
            </div>

            <div style={{ fontSize: "12px", lineHeight: "1.6", color: INK_PRIMARY }}>
              <strong style={{ color: GOLD_DEEP }}>Scenario:</strong> {WORKED_EXAMPLES[exampleIdx].scenario}
            </div>

            <div style={{
              padding: "12px 14px", borderRadius: "10px",
              background: GREEN_LIGHT, borderLeft: `3px solid ${GREEN}`,
              fontSize: "11.5px", lineHeight: "1.5", color: "#344e24",
            }}>
              <strong>Correct Action:</strong> {WORKED_EXAMPLES[exampleIdx].correctAction}
            </div>

            <div style={{
              padding: "10px 14px", borderRadius: "8px",
              background: "rgba(156,122,47,0.04)", border: `1px dashed rgba(156,122,47,0.2)`,
              fontSize: "11px", color: GOLD_DEEP, fontWeight: 700,
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              <Lightbulb size={14} />
              <strong>Takeaway:</strong> {WORKED_EXAMPLES[exampleIdx].takeaway}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => setExampleIdx(prev => Math.max(0, prev - 1))}
              disabled={exampleIdx === 0}
              style={{
                border: `1px solid ${GOLD}`, background: "transparent", color: GOLD_DEEP,
                padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: 700,
                cursor: exampleIdx === 0 ? "default" : "pointer", opacity: exampleIdx === 0 ? 0.4 : 1,
                display: "flex", alignItems: "center", gap: "4px",
              }}
            >
              <ChevronLeft size={14} /> Previous
            </button>

            {/* Dots */}
            <div style={{ display: "flex", gap: "6px" }}>
              {WORKED_EXAMPLES.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setExampleIdx(i)}
                  style={{
                    width: i === exampleIdx ? "20px" : "8px", height: "8px", borderRadius: "4px",
                    background: i === exampleIdx ? GOLD_DEEP : "rgba(156,122,47,0.2)",
                    cursor: "pointer", transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setExampleIdx(prev => Math.min(WORKED_EXAMPLES.length - 1, prev + 1))}
              disabled={exampleIdx === WORKED_EXAMPLES.length - 1}
              style={{
                border: `1px solid ${GOLD}`, background: "transparent", color: GOLD_DEEP,
                padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: 700,
                cursor: exampleIdx === WORKED_EXAMPLES.length - 1 ? "default" : "pointer",
                opacity: exampleIdx === WORKED_EXAMPLES.length - 1 ? 0.4 : 1,
                display: "flex", alignItems: "center", gap: "4px",
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB 3: COMMON MISTAKES QUIZ (§8)                      */}
      {/* ════════════════════════════════════════════════════════ */}
      {activeTab === "quiz" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", animation: "slideIn 0.3s ease" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            Test Your Understanding — Common Mistakes (§8)
          </span>

          {MISTAKES_QUIZ.map((q, idx) => {
            const answered = quizRevealed[idx];
            const userAnswer = quizAnswers[idx];
            const isCorrect = answered && userAnswer === q.isTrue;

            return (
              <div key={idx} style={{
                background: "#ffffff", border: `1px solid ${answered ? (isCorrect ? GREEN : RED) : "rgba(156,122,47,0.12)"}`,
                borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column",
                gap: "10px", transition: "all 0.3s ease",
              }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: INK_PRIMARY, lineHeight: "1.5" }}>
                  <span style={{
                    fontSize: "9px", fontWeight: 800, color: "#fff",
                    background: GOLD_DEEP, padding: "2px 6px", borderRadius: "4px", marginRight: "8px",
                  }}>
                    Q{idx + 1}
                  </span>
                  &ldquo;{q.statement}&rdquo;
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleQuizAnswer(idx, true)}
                    disabled={answered}
                    className="rme-quiz-btn"
                    style={{
                      color: answered && q.isTrue ? GREEN : answered && userAnswer === true ? RED : INK_SECONDARY,
                      borderColor: answered && userAnswer === true ? (isCorrect ? GREEN : RED) : undefined,
                      background: answered && userAnswer === true ? (isCorrect ? GREEN_LIGHT : RED_LIGHT) : undefined,
                    }}
                  >
                    True
                  </button>
                  <button
                    onClick={() => handleQuizAnswer(idx, false)}
                    disabled={answered}
                    className="rme-quiz-btn"
                    style={{
                      color: answered && !q.isTrue ? GREEN : answered && userAnswer === false ? RED : INK_SECONDARY,
                      borderColor: answered && userAnswer === false ? (isCorrect ? GREEN : RED) : undefined,
                      background: answered && userAnswer === false ? (isCorrect ? GREEN_LIGHT : RED_LIGHT) : undefined,
                    }}
                  >
                    False
                  </button>
                </div>

                {answered && (
                  <div style={{
                    padding: "10px 12px", borderRadius: "8px",
                    background: isCorrect ? GREEN_LIGHT : RED_LIGHT,
                    borderLeft: `3px solid ${isCorrect ? GREEN : RED}`,
                    fontSize: "11px", lineHeight: "1.5",
                    color: isCorrect ? "#344e24" : "#762e21",
                    animation: "slideIn 0.25s ease",
                  }}>
                    <strong>{isCorrect ? "Correct!" : `Incorrect — the statement is ${q.isTrue ? "TRUE" : "FALSE"}.`}</strong>
                    <br />{q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── PRESCRIPTION DISCLAIMER (§4.3) ── */}
      <div style={{
        background: RED_LIGHT, border: `1.5px solid rgba(173,75,55,0.25)`,
        borderRadius: "12px", padding: "14px", display: "flex", alignItems: "flex-start", gap: "10px",
      }}>
        <AlertOctagon size={18} style={{ color: RED, flexShrink: 0, marginTop: "2px" }} />
        <div>
          <span style={{ fontSize: "11px", fontWeight: 800, color: RED, textTransform: "uppercase" }}>
            Critical Disclaimer — Theory Only (§4.3)
          </span>
          <p style={{ margin: "4px 0 0 0", fontSize: "11px", lineHeight: "1.5", color: "#762e21" }}>
            <strong>Understanding this matching logic does NOT authorise you to prescribe remedies.</strong> Knowing how
            strengthen-vs-pacify works is theoretical competence only. Real prescription requires <strong>Tier-2 (Module 21)</strong>,
            the <strong>Module 24 ethics gate</strong>, and <strong>supervised practice</strong>. At Tier-1 you can explain how
            matching works — you cannot do it for a consultee.
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: "1px solid rgba(156,122,47,0.08)", paddingTop: "8px",
        fontSize: "10px", color: INK_MUTED,
      }}>
        <span>Module 15 · Chapter 6 · Lesson 1</span>
        <span>Remedy Matching Framework Explorer</span>
      </div>
    </div>
  );
}
