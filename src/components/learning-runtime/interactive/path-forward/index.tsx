"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, ArrowRight, BookOpen, Heart, Compass, AlertTriangle, ShieldCheck, CheckCircle2, Copy, Sparkles } from "lucide-react";
import { goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5C3D26)";
const INK_MUTED = "var(--gl-ink-muted, #7C6D5B)";
const GOLD = "#A8821E";
const GREEN = "#2E7D32";
const VERMILION = "#A23A1E";

/* ─── §4.1 Phases — directly from the lesson table ─── */
interface Phase {
  id: string;
  title: string;
  horizon: string;
  purpose: string;
  icon: React.ReactNode;
  color: string;
}

const PHASES: Phase[] = [
  { id: "consolidation",   title: "Consolidation",                     horizon: "The next several months",  purpose: "Unhurried reading of classical texts and re-reading of charts you already have, letting the breadth settle into fluency before adding depth",                                                   icon: <BookOpen size={14} />,  color: "#7A5E1E" },
  { id: "choosing",        title: "Choosing a Stream",                 horizon: "After consolidation",       purpose: "Selecting one stream — Parāśarī depth, KP, Jaimini, or another — to focus on, by genuine affinity rather than prestige",                                                                    icon: <Compass size={14} />,   color: GOLD },
  { id: "mastery",         title: "Deeper Mastery",                    horizon: "One to two years per stream", purpose: "The focused work of Tier 2 and beyond: real depth in the chosen path",                                                                                                                    icon: <ArrowRight size={14} />, color: GREEN },
  { id: "specialisation",  title: "Specialisation & Contribution",     horizon: "The long term",              purpose: "Specialising further, and eventually contributing back — to clients, to students, to the tradition",                                                                                       icon: <Heart size={14} />,     color: "#4F6FA8" },
  { id: "lifelong",        title: "Lifelong Practice",                 horizon: "Always",                     purpose: "Upholding the pledge, keeping learning, and serving — the constant beneath every phase",                                                                                                   icon: <ShieldCheck size={14} />, color: "#8B5A2B" },
];

/* ─── §4.3 Stream Choices — from lesson ─── */
interface StreamOption {
  id: string;
  name: string;
  description: string;
  rightReason: string;
  wrongReason: string;
}

const STREAM_OPTIONS: StreamOption[] = [
  { id: "parashari",  name: "Classical Parāśarī",  description: "BPHS-based natal horoscopy with Vimśottarī daśā and traditional predictive methods.",        rightReason: "A way of reading that already makes sense to you, resonance with classical Sanskrit texts",   wrongReason: "\"Everyone does it\" or \"it's the most traditional\"" },
  { id: "kp",         name: "KP (Krishnamurti)",   description: "Sub-lord based precision horoscopy with Placidus houses and horary number methods.",           rightReason: "You enjoy precision-based analysis, sub-lord logic appeals to your thinking style",          wrongReason: "\"KP sounds advanced\" or \"clients ask for it\"" },
  { id: "jaimini",    name: "Jaimini",              description: "Cara karaka system with sign-based daśās (Cara, Sthira) and Arudha Padas.",                  rightReason: "The sign-based daśā logic and karaka system genuinely resonates with how you read",          wrongReason: "\"It's rare so it's prestigious\"" },
  { id: "tajika",     name: "Tājika",               description: "Annual solar returns (Varṣaphala) with Ithaśāla yogas and Arabic-Persian methods.",          rightReason: "Year-ahead timing questions are what you actually want to answer",                          wrongReason: "\"It's different from what others do\"" },
];

/* ─── §4.2 Consolidation Activities — from lesson worked example ─── */
const CONSOLIDATION_ACTIVITIES = [
  "Re-read the BPHS chapters behind M05, M06, and M10",
  "Re-read the ten charts I already have, integrating daśā and transit",
  "Keep a notebook of where my readings were too certain",
  "Practise giving the honest framing to friends — practised / claimed / verified",
  "Run at least 5 transit overlay readings with a study partner",
];

/* Quiz questions for stream matching */
const QUIZ_QUESTIONS = [
  {
    question: "Which analytical detail level do you prefer to inspect?",
    options: [
      { label: "Traditional vargas (divisional charts) and planetary aspects", stream: "parashari" },
      { label: "Sub-lord divisions of nakshatras and cusp positions", stream: "kp" },
      { label: "Sign-based aspects, arudha padas, and specific lagnas", stream: "jaimini" },
      { label: "Solar-return annual chart dynamics and Tajik aspects", stream: "tajika" }
    ]
  },
  {
    question: "Which dasha/timing method feels most logical to your study style?",
    options: [
      { label: "Vimshottari Dasha (planetary periods based on Moon's nakshatra)", stream: "parashari" },
      { label: "Sub-lord rule tables and instant horary query calculations", stream: "kp" },
      { label: "Sign-based dashas (Cara or Sthira dasha) where signs are periods", stream: "jaimini" },
      { label: "Annual returns with Ithalasa and Esarpha yoga interactions", stream: "tajika" }
    ]
  },
  {
    question: "What primary skill do you want to master first in Tier 2?",
    options: [
      { label: "Holistic natal chart synthesis and classical Sanskrit texts", stream: "parashari" },
      { label: "High-precision yes/no query timing for client questions", stream: "kp" },
      { label: "Sutra-based interpretive rules and karaka dynamics", stream: "jaimini" },
      { label: "Year-by-year predictive returns and annual solar overlays", stream: "tajika" }
    ]
  }
];

type TabId = "timeline" | "choosing" | "plan";

export function PathForwardRoadmap() {
  const [activeTab, setActiveTab] = useState<TabId>("timeline");
  const [activePhase, setActivePhase] = useState<string>("consolidation");

  /* Choosing tab state */
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  
  /* Quiz state */
  const [quizStep, setQuizStep] = useState<number>(-1); // -1 = welcome, 0-2 = questions, 3 = finished
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [recommendedStream, setRecommendedStream] = useState<string | null>(null);

  /* Plan tab state */
  const [consolidationMonths, setConsolidationMonths] = useState<number>(6);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(5);
  const [selectedActivities, setSelectedActivities] = useState<Set<number>>(new Set());
  const [customGoal, setCustomGoal] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const activePhaseData = PHASES.find((p) => p.id === activePhase)!;
  const chosenStream = selectedStream ? STREAM_OPTIONS.find((s) => s.id === selectedStream) : null;
  const activePhaseIdx = PHASES.findIndex((p) => p.id === activePhase);

  function toggleActivity(idx: number) {
    setSelectedActivities((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  function handleStartQuiz() {
    setQuizStep(0);
    setQuizAnswers([]);
    setRecommendedStream(null);
  }

  function handleQuizAnswer(stream: string) {
    const nextAnswers = [...quizAnswers, stream];
    setQuizAnswers(nextAnswers);

    if (quizStep < 2) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate scores
      const counts: Record<string, number> = { parashari: 0, kp: 0, jaimini: 0, tajika: 0 };
      nextAnswers.forEach((ans) => {
        counts[ans] = (counts[ans] || 0) + 1;
      });
      // Find max
      let maxStream = "parashari";
      let maxCount = 0;
      Object.keys(counts).forEach((key) => {
        if (counts[key] > maxCount) {
          maxCount = counts[key];
          maxStream = key;
        }
      });
      setRecommendedStream(maxStream);
      setQuizStep(3);
    }
  }

  function applyQuizRecommendation() {
    if (recommendedStream) {
      setSelectedStream(recommendedStream);
      setQuizStep(-1); // Back to choices
    }
  }

  function handleCopyPlan() {
    const committedActivitiesText = Array.from(selectedActivities)
      .map((idx) => `  - ${CONSOLIDATION_ACTIVITIES[idx]}`)
      .join("\n");

    const planText = `### My Jyotiṣa Path Forward Plan\n` +
      `- **Consolidation Duration**: ${consolidationMonths} months (${hoursPerWeek} hours/week)\n` +
      `- **Target Activities**:\n${committedActivitiesText || "  - (None selected yet)"}\n` +
      `- **Chosen Specialisation Stream**: ${chosenStream ? chosenStream.name : "None selected"}\n` +
      `- **Personal Goal**: ${customGoal || "Consolidate my Tier 1 foundation and practice honestly."}\n` +
      `- **Oath**: I commit to the Practitioner's Pledge and to consolidation before depth.`;

    navigator.clipboard.writeText(planText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="w-full animate-fadeIn"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${goldOnGlassHairline}`,
        borderRadius: 16,
        padding: "24px 26px 20px",
        color: INK_PRIMARY,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        boxShadow: "0 14px 40px rgba(62, 42, 31, 0.08)",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 border-b pb-4" style={{ borderColor: HAIRLINE }}>
        <div className="flex items-center gap-2">
          <Map size={16} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Module 24 • Chapter 5 • Lesson 4
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          The Path Forward: From Tier 1 Foundation to a Lifetime of Practice
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Explore the realistic arc ahead, choose a stream by genuine affinity, and compose your own path-forward plan.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        {([
          { id: "timeline" as TabId, label: "Progression Timeline" },
          { id: "choosing" as TabId, label: "Choose a Stream" },
          { id: "plan" as TabId, label: "Compose Your Plan" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="pb-2 px-2 text-xs font-bold transition-all relative"
            style={{ color: activeTab === tab.id ? GOLD : INK_SECONDARY }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: GOLD }}
                layoutId="pathTabLine"
              />
            )}
          </button>
        ))}
      </div>

      {/* ═══ TAB 1: Progression Timeline ═══ */}
      {activeTab === "timeline" && (
        <div className="flex flex-col gap-6">
          {/* Timeline SVG */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: GOLD }}>
              Interactive Pathway (Click a phase to explore)
            </span>
            <div className="flex justify-center rounded-xl p-4 border bg-white overflow-x-auto" style={{ borderColor: HAIRLINE }}>
              <svg width="720" height="205" viewBox="0 0 720 205" className="w-full max-w-[780px] min-w-[720px] h-auto">
                {/* Background base path line */}
                <line x1="60" y1="85" x2="660" y2="85" stroke={INK_SECONDARY} strokeWidth="4" strokeLinecap="round" opacity="0.25" />
                
                {/* Progressive active path line */}
                <motion.line
                  x1="60" y1="85"
                  x2={60 + activePhaseIdx * 150} y2="85"
                  stroke={GOLD}
                  strokeWidth="4"
                  strokeLinecap="round"
                  animate={{ x2: 60 + activePhaseIdx * 150 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />

                {PHASES.map((phase, i) => {
                  const x = 60 + i * 150;
                  const isActive = activePhase === phase.id;
                  return (
                    <g key={phase.id} className="cursor-pointer" onClick={() => setActivePhase(phase.id)}>
                      {/* Pulsing glow ring for active node */}
                      {isActive && (
                        <motion.circle
                          cx={x} cy={85} r={22}
                          fill="transparent"
                          stroke={phase.color}
                          strokeWidth="2"
                          animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0.2, 0.8] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        />
                      )}
                      
                      {/* Outer node circle */}
                      <circle
                        cx={x} cy={85} r={isActive ? 16 : 13}
                        fill={isActive ? phase.color : SURFACE_2}
                        stroke={phase.color}
                        strokeWidth={isActive ? 2.5 : 2}
                        className="transition-all duration-200"
                      />
                      
                      {/* Number indicator */}
                      <text
                        x={x} y={isActive ? 89 : 88.5}
                        fill={isActive ? "#FFF" : INK_PRIMARY}
                        fontSize={isActive ? "13" : "12"}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {i + 1}
                      </text>

                      {/* Phase labels */}
                      <text
                        x={x} y={120}
                        fill={isActive ? phase.color : INK_PRIMARY}
                        fontSize="13"
                        fontWeight={isActive ? "bold" : "600"}
                        textAnchor="middle"
                      >
                        {phase.title.split(" ")[0]}
                      </text>
                      {phase.title.split(" ").length > 1 && (
                        <text
                          x={x} y={137}
                          fill={isActive ? phase.color : INK_SECONDARY}
                          fontSize="12"
                          fontWeight="500"
                          textAnchor="middle"
                        >
                          {phase.title.split(" ").slice(1).join(" ")}
                        </text>
                      )}

                      {/* Horizon text */}
                      <text
                        x={x} y={158}
                        fill={isActive ? GOLD : INK_SECONDARY}
                        fontSize="10"
                        fontWeight="500"
                        textAnchor="middle"
                      >
                        {phase.horizon}
                      </text>
                    </g>
                  );
                })}

                <text x="360" y="28" fill={INK_SECONDARY} fontSize="12" textAnchor="middle" fontWeight="500">
                  The phases overlap and the timeline flexes with the life you actually have
                </text>
              </svg>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center justify-center rounded-full" style={{ width: 28, height: 28, background: `${activePhaseData.color}15`, color: activePhaseData.color }}>
                  {activePhaseData.icon}
                </span>
                <div>
                  <span className="text-sm font-semibold block" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                    {activePhaseData.title}
                  </span>
                  <span className="text-[9px] italic" style={{ color: INK_MUTED }}>{activePhaseData.horizon}</span>
                </div>
              </div>
              <p className="m-0 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                {activePhaseData.purpose}
              </p>

              {/* Special notes for consolidation */}
              {activePhase === "consolidation" && (
                <div className="mt-2 p-3 rounded-lg border text-[11px] leading-normal" style={{ background: SURFACE, borderColor: `${GOLD}22` }}>
                  <AlertTriangle size={12} color={GOLD} className="inline mr-1" />
                  <strong style={{ color: GOLD }}>Resist the rush:</strong>{" "}
                  <span style={{ color: INK_SECONDARY }}>
                    Depth added to an unsettled foundation produces a fragile practitioner. Depth added to a consolidated foundation compounds.
                  </span>
                </div>
              )}
              {activePhase === "lifelong" && (
                <div className="mt-2 p-3 rounded-lg border text-[11px] leading-normal" style={{ background: SURFACE, borderColor: `${GREEN}22` }}>
                  <ShieldCheck size={12} color={GREEN} className="inline mr-1" />
                  <strong style={{ color: GREEN }}>The constant:</strong>{" "}
                  <span style={{ color: INK_SECONDARY }}>
                    The pledge. The techniques will deepen and branch; the discipline stays the same. That constancy is what makes a long practice trustworthy.
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-right">
              <button
                onClick={() => {
                  if (activePhase === "consolidation") setActiveTab("plan");
                  if (activePhase === "choosing") setActiveTab("choosing");
                }}
                className="text-[10px] uppercase font-bold tracking-wider text-amber-800 hover:text-amber-900 transition-colors"
              >
                {activePhase === "consolidation" ? "Configure Plan →" : activePhase === "choosing" ? "Select Stream →" : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 2: Choose a Stream ═══ */}
      {activeTab === "choosing" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
            <p className="m-0 text-xs leading-relaxed max-w-2xl" style={{ color: INK_SECONDARY }}>
              Choose a stream the way the whole curriculum has taught you to choose anything: <strong>honestly</strong>. Tier 1's multi-stream survey existed precisely so this choice could be informed rather than blind. Re-evaluate yourself or take the affinity quiz.
            </p>
            {quizStep === -1 ? (
              <button
                onClick={handleStartQuiz}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 hover:bg-black/5"
                style={{ color: GOLD, borderColor: GOLD }}
              >
                <Sparkles size={13} /> Stream Affinity Quiz
              </button>
            ) : (
              <button
                onClick={() => setQuizStep(-1)}
                className="flex-shrink-0 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-black/5"
                style={{ color: INK_MUTED }}
              >
                Cancel Quiz
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {quizStep === -1 ? (
              /* Static Stream Cards list */
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-3 md:grid-cols-2"
              >
                {STREAM_OPTIONS.map((stream) => {
                  const isSelected = selectedStream === stream.id;
                  return (
                    <button
                      key={stream.id}
                      onClick={() => setSelectedStream(isSelected ? null : stream.id)}
                      className="w-full text-left p-4 rounded-xl border transition-all duration-350 cursor-pointer flex flex-col justify-between"
                      style={{
                        background: isSelected ? SURFACE_2 : SURFACE,
                        borderColor: isSelected ? GOLD : HAIRLINE,
                        boxShadow: isSelected ? "0 4px 14px rgba(168, 130, 30, 0.05)" : "none",
                      }}
                    >
                      <div>
                        <span className="text-sm font-semibold block mb-1 flex items-center justify-between" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                          {stream.name}
                          {isSelected && <CheckCircle2 size={14} color={GOLD} />}
                        </span>
                        <p className="m-0 text-[11px] leading-relaxed mb-2" style={{ color: INK_SECONDARY }}>
                          {stream.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="pt-2 border-t flex flex-col gap-1.5 mt-2" style={{ borderColor: HAIRLINE }}>
                          <p className="m-0 text-[10px] leading-relaxed">
                            <span className="font-bold" style={{ color: GREEN }}>✓ Right reason:</span>{" "}
                            <span style={{ color: INK_SECONDARY }}>{stream.rightReason}</span>
                          </p>
                          <p className="m-0 text-[10px] leading-relaxed">
                            <span className="font-bold" style={{ color: VERMILION }}>✗ Wrong reason:</span>{" "}
                            <span style={{ color: INK_SECONDARY }}>{stream.wrongReason}</span>
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            ) : quizStep >= 0 && quizStep <= 2 ? (
              /* Quiz active screen */
              <motion.div
                key="quiz-question"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="p-5 rounded-xl border max-w-xl mx-auto flex flex-col gap-4 bg-white"
                style={{ borderColor: HAIRLINE }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                    Affinity quiz (Question {quizStep + 1} of 3)
                  </span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: quizStep >= i ? GOLD : SURFACE_2 }}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="m-0 text-sm font-bold leading-snug" style={{ color: INK_PRIMARY }}>
                  {QUIZ_QUESTIONS[quizStep].question}
                </h3>

                <div className="flex flex-col gap-2 mt-2">
                  {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuizAnswer(opt.stream)}
                      className="w-full text-left p-3 rounded-lg border text-xs transition-all hover:bg-amber-50/40 hover:border-amber-400"
                      style={{ background: SURFACE, borderColor: HAIRLINE, color: INK_SECONDARY }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Quiz finished screen */
              <motion.div
                key="quiz-result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 rounded-xl border max-w-lg mx-auto flex flex-col gap-4 text-center bg-white"
                style={{ borderColor: GOLD }}
              >
                <div className="flex items-center justify-center">
                  <span className="p-3 bg-amber-50 rounded-full">
                    <Sparkles size={24} color={GOLD} className="animate-spin-slow" />
                  </span>
                </div>
                <div>
                  <h3 className="m-0 text-base font-bold" style={{ color: INK_PRIMARY }}>
                    Affinity Quiz Result
                  </h3>
                  <p className="m-0 text-xs mt-1" style={{ color: INK_MUTED }}>
                    Based on your analytical style and preferences, your matched stream is:
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-amber-50/20" style={{ borderColor: `${GOLD}22` }}>
                  <span className="text-base font-bold block" style={{ color: GOLD, fontFamily: "var(--font-cormorant), serif" }}>
                    {recommendedStream && STREAM_OPTIONS.find((s) => s.id === recommendedStream)?.name}
                  </span>
                  <p className="m-0 text-xs mt-1.5 max-w-md mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
                    {recommendedStream && STREAM_OPTIONS.find((s) => s.id === recommendedStream)?.description}
                  </p>
                </div>

                <div className="flex gap-2 justify-center mt-2">
                  <button
                    onClick={handleStartQuiz}
                    className="px-3 py-1.5 rounded-lg border text-xs font-bold transition-all hover:bg-black/5"
                    style={{ borderColor: HAIRLINE, color: INK_MUTED }}
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={applyQuizRecommendation}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all text-white bg-amber-800 hover:bg-amber-900"
                  >
                    Accept and Select Stream Focus
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stream selection status badge */}
          {selectedStream && quizStep === -1 && (
            <div className="p-3.5 rounded-xl border flex items-center justify-between" style={{ background: `${GREEN}08`, borderColor: `${GREEN}33` }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} color={GREEN} />
                <span className="text-xs" style={{ color: INK_PRIMARY }}>
                  Active Focus: <strong style={{ color: GREEN }}>{chosenStream?.name}</strong>. This stream choice is locked into your generated plan.
                </span>
              </div>
              <button
                onClick={() => setSelectedStream(null)}
                className="text-[10px] uppercase font-bold tracking-widest hover:text-amber-800"
                style={{ color: INK_MUTED }}
              >
                Clear Selection
              </button>
            </div>
          )}

          {/* Discipline reminder */}
          <div className="mt-4 p-3 rounded-lg border text-[11px] leading-relaxed" style={{ background: SURFACE, borderColor: HAIRLINE }}>
            <strong style={{ color: INK_PRIMARY }}>The wrong reasons are:</strong>{" "}
            <span style={{ color: INK_SECONDARY }}>prestige (&ldquo;KP sounds advanced&rdquo;), market (&ldquo;clients ask for it&rdquo;), and others&apos; expectations.</span>{" "}
            <strong style={{ color: INK_PRIMARY }}>The right reasons are:</strong>{" "}
            <span style={{ color: INK_SECONDARY }}>genuine affinity, genuine use, and genuine resonance with how you think.</span>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: Compose Your Plan ═══ */}
      {activeTab === "plan" && (
        <div className="space-y-6">
          <p className="m-0 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
            Write your own path forward, in four short parts. Be specific and realistic to your actual life. A path you have written down is one you can actually walk, and adjust, rather than a fog you drift in.
          </p>

          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            {/* Left: Input Composer */}
            <div className="flex flex-col gap-4">
              {/* Consolidation Period config */}
              <div className="p-4 rounded-xl border flex flex-col gap-3" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                  1. Consolidation Parameters
                </span>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold" style={{ color: INK_SECONDARY }}>
                    Duration: {consolidationMonths} months
                  </label>
                  <div className="flex gap-2">
                    {[2, 3, 6, 9, 12].map((m) => (
                      <button
                        key={m}
                        onClick={() => setConsolidationMonths(m)}
                        className="px-3 py-1.5 rounded-lg border text-xs font-bold transition-all"
                        style={{
                          background: consolidationMonths === m ? GOLD : SURFACE,
                          color: consolidationMonths === m ? "#FFF" : INK_SECONDARY,
                          borderColor: consolidationMonths === m ? GOLD : HAIRLINE,
                        }}
                      >
                        {m === 2 ? "2 (Demo)" : `${m} months`}
                      </button>
                    ))}
                  </div>
                  {/* Guardrail warnings */}
                  {consolidationMonths < 3 ? (
                    <div className="text-[10px] leading-relaxed flex items-start gap-1 p-2 rounded border mt-1" style={{ color: VERMILION, background: `${VERMILION}0A`, borderColor: `${VERMILION}22` }}>
                      <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Safety warning:</strong> Less than 3 months is insufficient for consolidation. A minimum of 3-6 months is required to transition from breadth to fluent chart literacy.
                      </span>
                    </div>
                  ) : consolidationMonths < 6 ? (
                    <div className="text-[10px] leading-relaxed flex items-start gap-1 p-2 rounded border mt-1" style={{ color: GOLD, background: `${GOLD}0A`, borderColor: `${GOLD}22` }}>
                      <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                      <span>
                        Breadth needs at least 3–6 months to mature into fluent chart literacy. Ensure your study hours match this need.
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-[10px] font-bold" style={{ color: INK_SECONDARY }}>
                    Target dedication (hours per week): {hoursPerWeek} hrs
                  </label>
                  <div className="flex gap-2">
                    {[2, 5, 10, 15].map((h) => (
                      <button
                        key={h}
                        onClick={() => setHoursPerWeek(h)}
                        className="px-3 py-1.5 rounded-lg border text-xs font-bold transition-all"
                        style={{
                          background: hoursPerWeek === h ? GOLD : SURFACE,
                          color: hoursPerWeek === h ? "#FFF" : INK_SECONDARY,
                          borderColor: hoursPerWeek === h ? GOLD : HAIRLINE,
                        }}
                      >
                        {h} hrs/wk
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-2">
                  <label className="text-[10px] font-bold" style={{ color: INK_SECONDARY }}>Select Committed Activities:</label>
                  {CONSOLIDATION_ACTIVITIES.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => toggleActivity(i)}
                      className="w-full p-2.5 rounded-lg border text-left text-[10px] flex items-start gap-2.5 transition-all"
                      style={{
                        background: selectedActivities.has(i) ? `${GREEN}08` : SURFACE,
                        borderColor: selectedActivities.has(i) ? `${GREEN}33` : HAIRLINE,
                      }}
                    >
                      <span
                        className="flex-shrink-0 rounded mt-0.5"
                        style={{
                          width: 14, height: 14,
                          background: selectedActivities.has(i) ? GREEN : SURFACE_2,
                          color: selectedActivities.has(i) ? "#fff" : INK_MUTED,
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px",
                        }}
                      >
                        {selectedActivities.has(i) ? "✓" : ""}
                      </span>
                      <span style={{ color: selectedActivities.has(i) ? INK_PRIMARY : INK_SECONDARY }}>{act}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1 mt-1.5">
                  <label className="text-[10px] font-bold" style={{ color: INK_SECONDARY }}>Write a custom study goal (optional):</label>
                  <input
                    type="text"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="e.g. Master the synthesis of Vimshottari and Transits under pressure."
                    className="w-full p-2 rounded-lg border text-xs bg-white outline-none focus:border-amber-500"
                    style={{ borderColor: HAIRLINE, color: INK_PRIMARY }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Path Forward Card Summary */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                2. Generated Path Forward Card
              </span>
              
              <div
                className="p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300"
                style={{
                  background: SURFACE,
                  borderColor: GOLD,
                  boxShadow: "0 10px 30px rgba(168, 130, 30, 0.08)",
                  minHeight: "330px"
                }}
              >
                {/* Decorative border layout */}
                <div className="absolute inset-2 border pointer-events-none rounded-xl" style={{ borderColor: `${GOLD}22` }} />
                
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="text-center border-b pb-3" style={{ borderColor: HAIRLINE }}>
                    <h3 className="m-0 text-sm font-semibold tracking-wider uppercase" style={{ color: GOLD, fontFamily: "var(--font-cormorant), serif" }}>
                      My Path Forward Plan
                    </h3>
                    <p className="m-0 text-[8px] tracking-widest uppercase text-stone-500">
                      Jyotiṣa Tier 1 Graduation Ledger
                    </p>
                  </div>

                  <div className="space-y-2.5 text-[11px] leading-relaxed">
                    <div>
                      <span className="font-bold text-[9px] uppercase tracking-wide block" style={{ color: INK_MUTED }}>
                        I. Consolidation Phase
                      </span>
                      <p className="m-0 font-medium" style={{ color: INK_PRIMARY }}>
                        Duration: {consolidationMonths} months at {hoursPerWeek} hours/week.
                      </p>
                      <div className="pl-2.5 mt-1 border-l-2 space-y-0.5" style={{ borderColor: HAIRLINE }}>
                        {selectedActivities.size > 0 ? (
                          Array.from(selectedActivities).map((idx) => (
                            <p key={idx} className="m-0 text-[10px] text-stone-700">
                              • {CONSOLIDATION_ACTIVITIES[idx]}
                            </p>
                          ))
                        ) : (
                          <p className="m-0 text-[10px] italic text-stone-500">
                            No target activities committed yet.
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-[9px] uppercase tracking-wide block" style={{ color: INK_MUTED }}>
                        II. Specialisation Focus
                      </span>
                      <p className="m-0 font-medium" style={{ color: chosenStream ? GREEN : INK_PRIMARY }}>
                        {chosenStream ? chosenStream.name : "No stream selected yet."}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-[9px] uppercase tracking-wide block" style={{ color: INK_MUTED }}>
                        III. Personal Mandate
                      </span>
                      <p className="m-0 font-medium italic" style={{ color: INK_PRIMARY }}>
                        &ldquo;{customGoal || "Consolidate my Tier 1 foundation and practice honestly."}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t flex items-center justify-between" style={{ borderColor: HAIRLINE }}>
                  <div className="text-[9px] italic" style={{ color: INK_MUTED }}>
                    &ldquo;Dhairyeṇa gamyate sarvam&rdquo;
                  </div>
                  <button
                    onClick={handleCopyPlan}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-white bg-amber-800 hover:bg-amber-900 active:scale-95"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 size={12} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy Plan Card
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Worked version */}
          <div className="mt-4 p-4 rounded-xl border" style={{ background: SURFACE, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: GOLD }}>
              Worked version — one practitioner's plan
            </span>
            <div className="grid gap-2 md:grid-cols-2 text-[10px] leading-relaxed" style={{ color: INK_SECONDARY }}>
              <p className="m-0"><strong style={{ color: INK_PRIMARY }}>Consolidation (~6 months):</strong> &ldquo;Re-read the BPHS chapters behind M05, M06, and M10; re-read the ten charts I already have, this time integrating daśā and transit; keep a notebook of where my readings were too certain.&rdquo;</p>
              <p className="m-0"><strong style={{ color: INK_PRIMARY }}>Stream choice:</strong> &ldquo;I'm drawn to classical Parāśarī predictive work — it's the way of reading that already feels natural — so my Tier 2 focus is Parāśarī depth, with KP as a later second.&rdquo;</p>
              <p className="m-0"><strong style={{ color: INK_PRIMARY }}>Mastery arc (1–2 years):</strong> &ldquo;Work through the Tier 2 Parāśarī track; find a teacher or a study group; read charts weekly with feedback.&rdquo;</p>
              <p className="m-0"><strong style={{ color: INK_PRIMARY }}>Lifelong:</strong> &ldquo;Re-read and re-affirm the pledge each year; only ever take questions I'm competent for; keep learning.&rdquo;</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Śloka */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-6 border-t pt-4 text-center"
        style={{ borderColor: HAIRLINE }}
      >
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Composite Paraphrase — The Endless Road
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          न हि ज्ञानस्य पर्यन्तो मार्गोऽयं दीर्घ एव च। धैर्येण गम्यते सर्वं न तु वेगेन केनचित्॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          na hi jñānasya paryanto, mārgo &apos;yaṁ dīrgha eva ca | dhairyeṇa gamyate sarvaṁ, na tu vegena kenacit.
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;There is no final end to knowledge, and this road is a long one; it is travelled entirely by steadiness, never by haste.&rdquo;
        </p>
      </motion.div>
    </div>
  );
}
