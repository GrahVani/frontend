"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  CircleDot,
  GitBranch,
  SlidersHorizontal,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  UserCheck,
  FileCheck,
  AlertTriangle,
  Compass,
  ArrowRight,
  BookOpen,
  XCircle,
} from "lucide-react";
import { surfaces, ink, goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";
import {
  DEFAULT_STATE,
  PRESETS,
  evaluateState,
  type NadiFrameworkState,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const VERMILION = "#C8412E";
const GOLD = "#A8821E";
const GREEN = "#2E7D32";

interface ToggleSwitchProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  accentColor?: string;
}

function ToggleSwitch({ label, description, checked, onChange, accentColor = GOLD }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className="flex w-full items-start justify-between gap-4 rounded-xl p-4 text-left transition-all"
      style={{
        background: checked ? `rgba(168, 130, 30, 0.08)` : SURFACE,
        border: `1px solid ${checked ? accentColor : HAIRLINE}`,
        boxShadow: checked ? `0 2px 8px rgba(168, 130, 30, 0.06)` : "none",
      }}
    >
      <div className="flex-1">
        <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
          {label}
        </p>
        <p className="mt-1 m-0 text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.4 }}>
          {description}
        </p>
      </div>
      <div className="flex items-center pt-0.5">
        {checked ? (
          <CheckCircle2 size={18} color={accentColor} className="flex-shrink-0" />
        ) : (
          <CircleDot size={18} color={INK_MUTED} className="flex-shrink-0" />
        )}
      </div>
    </button>
  );
}

export function NadiDecisionFramework() {
  const [state, setState] = useState<NadiFrameworkState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<"sandbox" | "lessons" | "trainer">("sandbox");
  const [focusedGate, setFocusedGate] = useState<1 | 2 | 3>(1);

  // Roleplay / Trainer State
  const [roleplayStage, setRoleplayStage] = useState<"intro" | "disclosures" | "remedy" | "completed" | "failed">("intro");
  const [disclosuresChecked, setDisclosuresChecked] = useState<boolean[]>([false, false, false, false, false]);
  const [failedReason, setFailedReason] = useState("");

  const evaluation = evaluateState(state);

  const getVerdictStyle = () => {
    switch (evaluation.verdict) {
      case "OUT_OF_SCOPE":
        return { color: INK_MUTED, background: SURFACE_2, title: "Out of Scope" };
      case "REFUSE":
        return { color: VERMILION, background: "rgba(200, 65, 46, 0.06)", title: "Refuse Outright" };
      case "DEFER":
        return { color: GOLD, background: "rgba(168, 130, 30, 0.08)", title: "Defer to Specialist" };
      case "MODE_1_CONTEXTUAL":
        return { color: GREEN, background: "rgba(46, 125, 50, 0.06)", title: "Mode 1: Contextual Mention" };
      case "MODE_2_STANDALONE":
        return { color: GREEN, background: "rgba(46, 125, 50, 0.06)", title: "Mode 2: Standalone Advisory" };
    }
  };

  const verdictStyle = getVerdictStyle();

  // SVG Flowchart Path State Logic
  const recommendPass = evaluation.recommendPass;
  const refusePass = evaluation.refusePass;
  const deferPass = evaluation.deferPass;
  const verdict = evaluation.verdict;

  // Trainer Step Triggers
  const startTrainer = () => {
    setRoleplayStage("disclosures");
    setDisclosuresChecked([false, false, false, false, false]);
    setFailedReason("");
  };

  const handleDisclosureClick = (idx: number) => {
    setDisclosuresChecked((curr) => {
      const next = [...curr];
      next[idx] = true;
      return next;
    });
  };

  const allDisclosuresRead = disclosuresChecked.every((v) => v);

  return (
    <div
      className="gl-surface-twilight-glass w-full"
      data-interactive="nadi-decision-framework"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${goldOnGlassHairline}`,
        borderRadius: 16,
        padding: "24px 26px 20px",
        color: INK_PRIMARY,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b pb-4" style={{ borderColor: HAIRLINE }}>
        <div>
          <div className="flex items-center gap-2">
            <Compass size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: ink.goldAccent }}>
              Module 20 Chapter 5
            </p>
          </div>
          <h2 className="mt-1 m-0 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Nāḍī Advisory & Gating System
          </h2>
          <p className="mt-1 m-0 text-sm" style={{ color: INK_SECONDARY }}>
            Explore the recommend, refuse, and defer gates that run on our curriculum-standard honest advising model.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 rounded-lg p-1 bg-amber-55" style={{ background: SURFACE_2 }}>
          <button
            onClick={() => setActiveTab("sandbox")}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={{
              background: activeTab === "sandbox" ? SURFACE : "transparent",
              color: activeTab === "sandbox" ? INK_PRIMARY : INK_SECONDARY,
              boxShadow: activeTab === "sandbox" ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
            }}
          >
            <GitBranch className="inline mr-1" size={13} />
            Gating Sandbox
          </button>
          <button
            onClick={() => setActiveTab("lessons")}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={{
              background: activeTab === "lessons" ? SURFACE : "transparent",
              color: activeTab === "lessons" ? INK_PRIMARY : INK_SECONDARY,
              boxShadow: activeTab === "lessons" ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
            }}
          >
            <BookOpen className="inline mr-1" size={13} />
            Pedagogical Map
          </button>
          <button
            onClick={() => setActiveTab("trainer")}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={{
              background: activeTab === "trainer" ? SURFACE : "transparent",
              color: activeTab === "trainer" ? INK_PRIMARY : INK_SECONDARY,
              boxShadow: activeTab === "trainer" ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
            }}
          >
            <UserCheck className="inline mr-1" size={13} />
            Disclosures Trainer
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* --- SANDBOX TAB --- */}
        {activeTab === "sandbox" && (
          <motion.div
            key="sandbox"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Presets Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[rgba(168,130,30,0.03)] p-3 rounded-xl border" style={{ borderColor: HAIRLINE }}>
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} color={GOLD} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                  Lesson Scenarios:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setState(preset.state);
                      // Auto focus the most relevant gate contextually
                      if (key === "monday") setFocusedGate(1);
                      else if (key === "scamRemedy") setFocusedGate(2);
                      else setFocusedGate(1);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:bg-[rgba(168,130,30,0.08)]"
                    style={{
                      background: SURFACE,
                      border: `1px solid ${HAIRLINE}`,
                      color: INK_SECONDARY,
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setState(DEFAULT_STATE);
                    setFocusedGate(1);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:bg-amber-100"
                  style={{
                    background: SURFACE_2,
                    border: `1px solid ${HAIRLINE}`,
                    color: INK_SECONDARY,
                  }}
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              </div>
            </div>

            {/* Visual Interactive SVG Flowchart */}
            <div className="rounded-xl p-4 border relative bg-[radial-gradient(ellipse_at_top,_rgba(254,250,234,0.6)_0%,_rgba(240,224,186,0.3)_100%)]" style={{ borderColor: HAIRLINE }}>
              <h3 className="m-0 mb-2 text-xs font-bold uppercase tracking-widest text-center" style={{ color: GOLD }}>
                Decision Flow Pipeline
              </h3>
              
              <svg viewBox="0 0 820 220" className="w-full h-auto block" style={{ maxHeight: "280px" }}>
                <defs>
                  <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={GOLD} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="vermilionGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={VERMILION} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={VERMILION} stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={GREEN} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
                  </radialGradient>
                  <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#6B4423" floodOpacity="0.1" />
                  </filter>
                </defs>

                {/* --- CONNECTING LINES --- */}
                {/* 1. Start to Gate 1 (Always Active) */}
                <line x1="20" y1="110" x2="120" y2="110" stroke={GOLD} strokeWidth="2" strokeDasharray="4 4" />

                {/* 2. Gate 1 (Recommend) to Out of Scope leaf */}
                <path
                  d="M 160 110 C 160 65, 245 65, 245 40"
                  fill="none"
                  stroke={!recommendPass ? VERMILION : `${INK_MUTED}40`}
                  strokeWidth={!recommendPass ? 3.5 : 1.2}
                  strokeDasharray={!recommendPass ? "5 3" : "none"}
                  className={!recommendPass ? "animate-[dash_1s_linear_infinite]" : ""}
                  style={{ transition: "all 300ms ease" }}
                />

                {/* 3. Gate 1 (Recommend) to Gate 2 (Refuse) */}
                <line
                  x1="200"
                  y1="110"
                  x2="290"
                  y2="110"
                  stroke={recommendPass ? GREEN : `${INK_MUTED}40`}
                  strokeWidth={recommendPass ? 3 : 1.2}
                  strokeDasharray={recommendPass ? "5 3" : "none"}
                  style={{ transition: "all 300ms ease" }}
                />

                {/* 4. Gate 2 (Refuse) to Refuse Outright leaf */}
                <path
                  d="M 330 110 C 330 65, 415 65, 415 40"
                  fill="none"
                  stroke={recommendPass && !refusePass ? VERMILION : `${INK_MUTED}40`}
                  strokeWidth={recommendPass && !refusePass ? 3.5 : 1.2}
                  strokeDasharray={recommendPass && !refusePass ? "5 3" : "none"}
                  style={{ transition: "all 300ms ease" }}
                />

                {/* 5. Gate 2 (Refuse) to Gate 3 (Defer) */}
                <line
                  x1="370"
                  y1="110"
                  x2="460"
                  y2="110"
                  stroke={recommendPass && refusePass ? GREEN : `${INK_MUTED}40`}
                  strokeWidth={recommendPass && refusePass ? 3 : 1.2}
                  strokeDasharray={recommendPass && refusePass ? "5 3" : "none"}
                  style={{ transition: "all 300ms ease" }}
                />

                {/* 6. Gate 3 (Defer) to Defer Leaf */}
                <path
                  d="M 500 110 C 500 65, 585 65, 585 40"
                  fill="none"
                  stroke={recommendPass && refusePass && !deferPass ? GOLD : `${INK_MUTED}40`}
                  strokeWidth={recommendPass && refusePass && !deferPass ? 3.5 : 1.2}
                  strokeDasharray={recommendPass && refusePass && !deferPass ? "5 3" : "none"}
                  style={{ transition: "all 300ms ease" }}
                />

                {/* 7. Gate 3 (Defer) to Mode Splits */}
                <line
                  x1="540"
                  y1="110"
                  x2="620"
                  y2="110"
                  stroke={recommendPass && refusePass && deferPass ? GREEN : `${INK_MUTED}40`}
                  strokeWidth={recommendPass && refusePass && deferPass ? 3 : 1.2}
                  strokeDasharray={recommendPass && refusePass && deferPass ? "5 3" : "none"}
                  style={{ transition: "all 300ms ease" }}
                />

                {/* 8. Mode split to Mode 1 (Contextual) */}
                <path
                  d="M 620 110 C 660 110, 660 80, 700 80"
                  fill="none"
                  stroke={verdict === "MODE_1_CONTEXTUAL" ? GREEN : `${INK_MUTED}40`}
                  strokeWidth={verdict === "MODE_1_CONTEXTUAL" ? 3.5 : 1.2}
                  strokeDasharray={verdict === "MODE_1_CONTEXTUAL" ? "5 3" : "none"}
                  style={{ transition: "all 300ms ease" }}
                />

                {/* 9. Mode split to Mode 2 (Standalone) */}
                <path
                  d="M 620 110 C 660 110, 660 145, 700 145"
                  fill="none"
                  stroke={verdict === "MODE_2_STANDALONE" ? GREEN : `${INK_MUTED}40`}
                  strokeWidth={verdict === "MODE_2_STANDALONE" ? 3.5 : 1.2}
                  strokeDasharray={verdict === "MODE_2_STANDALONE" ? "5 3" : "none"}
                  style={{ transition: "all 300ms ease" }}
                />

                {/* --- GATE NODES (CLICKABLE) --- */}
                {/* Gate 1: Recommend */}
                <g className="cursor-pointer" onClick={() => setFocusedGate(1)}>
                  <circle cx="160" cy="110" r="32" fill={focusedGate === 1 ? "url(#goldGlow)" : SURFACE} stroke={focusedGate === 1 ? GOLD : HAIRLINE} strokeWidth={focusedGate === 1 ? 2.5 : 1.2} filter="url(#shadow)" />
                  <text x="160" y="106" textAnchor="middle" fontSize="10" fontWeight="bold" fill={INK_PRIMARY}>1. Recommend?</text>
                  <text x="160" y="121" textAnchor="middle" fontSize="8" fill={recommendPass ? GREEN : VERMILION} fontWeight="bold">
                    {recommendPass ? "PASS" : "BLOCK"}
                  </text>
                  {/* Status indicator badge */}
                  <circle cx="184" cy="92" r="8" fill={recommendPass ? GREEN : VERMILION} />
                  <text x="184" y="95" textAnchor="middle" fontSize="9" fill="#FFF" fontWeight="bold">
                    {recommendPass ? "✓" : "✗"}
                  </text>
                </g>

                {/* Gate 2: Refuse */}
                <g className="cursor-pointer" onClick={() => setFocusedGate(2)} opacity={recommendPass ? 1 : 0.5}>
                  <circle cx="330" cy="110" r="32" fill={focusedGate === 2 ? "url(#vermilionGlow)" : SURFACE} stroke={focusedGate === 2 ? VERMILION : HAIRLINE} strokeWidth={focusedGate === 2 ? 2.5 : 1.2} filter="url(#shadow)" />
                  <text x="330" y="106" textAnchor="middle" fontSize="10" fontWeight="bold" fill={INK_PRIMARY}>2. Refuse?</text>
                  <text x="330" y="121" textAnchor="middle" fontSize="8" fill={!recommendPass ? INK_MUTED : refusePass ? GREEN : VERMILION} fontWeight="bold">
                    {!recommendPass ? "WAIT" : refusePass ? "OK" : "REFUSED"}
                  </text>
                  {recommendPass && (
                    <>
                      <circle cx="354" cy="92" r="8" fill={refusePass ? GREEN : VERMILION} />
                      <text x="354" y="95" textAnchor="middle" fontSize="9" fill="#FFF" fontWeight="bold">
                        {refusePass ? "✓" : "✗"}
                      </text>
                    </>
                  )}
                </g>

                {/* Gate 3: Defer */}
                <g className="cursor-pointer" onClick={() => setFocusedGate(3)} opacity={recommendPass && refusePass ? 1 : 0.5}>
                  <circle cx="500" cy="110" r="32" fill={focusedGate === 3 ? "url(#goldGlow)" : SURFACE} stroke={focusedGate === 3 ? GOLD : HAIRLINE} strokeWidth={focusedGate === 3 ? 2.5 : 1.2} filter="url(#shadow)" />
                  <text x="500" y="106" textAnchor="middle" fontSize="10" fontWeight="bold" fill={INK_PRIMARY}>3. Defer?</text>
                  <text x="500" y="121" textAnchor="middle" fontSize="8" fill={!recommendPass || !refusePass ? INK_MUTED : deferPass ? GREEN : GOLD} fontWeight="bold">
                    {!recommendPass || !refusePass ? "WAIT" : deferPass ? "OK" : "DEFERRED"}
                  </text>
                  {recommendPass && refusePass && (
                    <>
                      <circle cx="524" cy="92" r="8" fill={deferPass ? GREEN : GOLD} />
                      <text x="524" y="95" textAnchor="middle" fontSize="9" fill="#FFF" fontWeight="bold">
                        {deferPass ? "✓" : "!"}
                      </text>
                    </>
                  )}
                </g>

                {/* --- LEAF NODES (OUTCOMES) --- */}
                {/* Out of Scope */}
                <g opacity={verdict === "OUT_OF_SCOPE" ? 1 : 0.45}>
                  <rect x="200" y="15" width="90" height="28" rx="6" fill={verdict === "OUT_OF_SCOPE" ? "rgba(138, 126, 94, 0.15)" : SURFACE} stroke={verdict === "OUT_OF_SCOPE" ? INK_MUTED : HAIRLINE} strokeWidth="1.2" />
                  <text x="245" y="32" textAnchor="middle" fontSize="9" fontWeight="bold" fill={verdict === "OUT_OF_SCOPE" ? INK_PRIMARY : INK_MUTED}>Out of Scope</text>
                </g>

                {/* Refuse Leaf */}
                <g opacity={verdict === "REFUSE" ? 1 : 0.45}>
                  <rect x="370" y="15" width="90" height="28" rx="6" fill={verdict === "REFUSE" ? "rgba(200, 65, 46, 0.1)" : SURFACE} stroke={verdict === "REFUSE" ? VERMILION : HAIRLINE} strokeWidth="1.2" />
                  <text x="415" y="32" textAnchor="middle" fontSize="9" fontWeight="bold" fill={verdict === "REFUSE" ? VERMILION : INK_MUTED}>Refuse Outright</text>
                </g>

                {/* Defer Leaf */}
                <g opacity={verdict === "DEFER" ? 1 : 0.45}>
                  <rect x="540" y="15" width="90" height="28" rx="6" fill={verdict === "DEFER" ? "rgba(168, 130, 30, 0.1)" : SURFACE} stroke={verdict === "DEFER" ? GOLD : HAIRLINE} strokeWidth="1.2" />
                  <text x="585" y="32" textAnchor="middle" fontSize="9" fontWeight="bold" fill={verdict === "DEFER" ? GOLD : INK_MUTED}>Defer to Specialist</text>
                </g>

                {/* Mode 1: Contextual */}
                <g opacity={verdict === "MODE_1_CONTEXTUAL" ? 1 : 0.45}>
                  <rect x="670" y="58" width="130" height="34" rx="6" fill={verdict === "MODE_1_CONTEXTUAL" ? "rgba(46, 125, 50, 0.1)" : SURFACE} stroke={verdict === "MODE_1_CONTEXTUAL" ? GREEN : HAIRLINE} strokeWidth="1.5" />
                  <text x="735" y="74" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill={verdict === "MODE_1_CONTEXTUAL" ? GREEN : INK_MUTED}>Mode 1: Contextual</text>
                  <text x="735" y="85" textAnchor="middle" fontSize="7" fill={INK_SECONDARY}>Short mention in reading</text>
                </g>

                {/* Mode 2: Standalone */}
                <g opacity={verdict === "MODE_2_STANDALONE" ? 1 : 0.45}>
                  <rect x="670" y="128" width="130" height="34" rx="6" fill={verdict === "MODE_2_STANDALONE" ? "rgba(46, 125, 50, 0.1)" : SURFACE} stroke={verdict === "MODE_2_STANDALONE" ? GREEN : HAIRLINE} strokeWidth="1.5" />
                  <text x="735" y="144" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill={verdict === "MODE_2_STANDALONE" ? GREEN : INK_MUTED}>Mode 2: Standalone</text>
                  <text x="735" y="155" textAnchor="middle" fontSize="7" fill={INK_SECONDARY}>Dedicated advisory session</text>
                </g>
              </svg>
            </div>

            {/* main layout grid */}
            <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
              
              {/* Controls Column */}
              <div className="space-y-6">
                
                {/* Gate Selector Tabs */}
                <div className="flex border-b" style={{ borderColor: HAIRLINE }}>
                  <button
                    onClick={() => setFocusedGate(1)}
                    className="flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all"
                    style={{
                      borderColor: focusedGate === 1 ? GOLD : "transparent",
                      color: focusedGate === 1 ? INK_PRIMARY : INK_MUTED,
                    }}
                  >
                    Gate 1: Recommend
                  </button>
                  <button
                    onClick={() => setFocusedGate(2)}
                    className="flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all"
                    style={{
                      borderColor: focusedGate === 2 ? VERMILION : "transparent",
                      color: focusedGate === 2 ? INK_PRIMARY : INK_MUTED,
                    }}
                  >
                    Gate 2: Refuse
                  </button>
                  <button
                    onClick={() => setFocusedGate(3)}
                    className="flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all"
                    style={{
                      borderColor: focusedGate === 3 ? GOLD : "transparent",
                      color: focusedGate === 3 ? INK_PRIMARY : INK_MUTED,
                    }}
                  >
                    Gate 3: Defer
                  </button>
                </div>

                {/* Gate 1 controls */}
                {focusedGate === 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle size={15} color={GOLD} />
                      <h4 className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                        Gate 1: Client Triggers & Scope
                      </h4>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ToggleSwitch
                        label="Client Explicitly Asks"
                        description="Seeker books an advisory or asks directly about Nāḍī."
                        checked={state.explicitlyAsked}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            explicitlyAsked: !curr.explicitlyAsked,
                            unprompted: false,
                          }))
                        }
                      />
                      <ToggleSwitch
                        label="Names Decision Point"
                        description="Seeker mentions Vaitheeswarankoil visit or family reading."
                        checked={state.namesDecisionPoint}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            namesDecisionPoint: !curr.namesDecisionPoint,
                            unprompted: false,
                          }))
                        }
                      />
                      <ToggleSwitch
                        label="Life Stage Proximity"
                        description="Ancestral family context or pilgrimage moment."
                        checked={state.lifeStageContext}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            lifeStageContext: !curr.lifeStageContext,
                            unprompted: false,
                          }))
                        }
                      />
                      <ToggleSwitch
                        label="Chart Surfaces Relevant Sign"
                        description="Chart indicator suggests a complementary Nāḍī angle."
                        checked={state.chartSurfaces}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            chartSurfaces: !curr.chartSurfaces,
                            unprompted: false,
                          }))
                        }
                      />
                      <div className="sm:col-span-2">
                        <ToggleSwitch
                          label="Unprompted Recommendation"
                          description="Practitioner raises Nāḍī with NO client prompt or chart indication (Fails Gate 1)."
                          checked={state.unprompted}
                          accentColor={VERMILION}
                          onChange={() =>
                            setState((curr) => ({
                              ...curr,
                              unprompted: !curr.unprompted,
                              explicitlyAsked: false,
                              namesDecisionPoint: false,
                              lifeStageContext: false,
                              chartSurfaces: false,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Gate 2 controls */}
                {focusedGate === 2 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={15} color={VERMILION} />
                      <h4 className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: VERMILION }}>
                        Gate 2: Do-No-Harm Red Lines
                      </h4>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ToggleSwitch
                        label="Exorbitant Remedy / Fear"
                        description="Fear-driven sales pitch or exorbitant ritual fee (e.g. ₹2 lakh)."
                        checked={state.exorbitantRemedy}
                        accentColor={VERMILION}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            exorbitantRemedy: !curr.exorbitantRemedy,
                          }))
                        }
                      />
                      <ToggleSwitch
                        label="Outcome Guarantee"
                        description="Seeker demands or reader promises guaranteed results."
                        checked={state.wantsGuarantee}
                        accentColor={VERMILION}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            wantsGuarantee: !curr.wantsGuarantee,
                          }))
                        }
                      />
                      <ToggleSwitch
                        label="Financial Distress"
                        description="Committing to the reading/remedy causes financial hardship."
                        checked={state.financialDistress}
                        accentColor={VERMILION}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            financialDistress: !curr.financialDistress,
                          }))
                        }
                      />
                      <ToggleSwitch
                        label="Unethical Purpose"
                        description="Using predictions to manipulate family relationships."
                        checked={state.unethicalPurpose}
                        accentColor={VERMILION}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            unethicalPurpose: !curr.unethicalPurpose,
                          }))
                        }
                      />
                      <ToggleSwitch
                        label="Impersonate Credentials"
                        description="Practitioner performs raw leaf-readings or writes rituals."
                        checked={state.impersonateCredentials}
                        accentColor={VERMILION}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            impersonateCredentials: !curr.impersonateCredentials,
                          }))
                        }
                      />
                      <ToggleSwitch
                        label="Resting Decision Alone"
                        description="Resting major life decision (marriage/career) on Nāḍī alone."
                        checked={state.restingDecisionAlone}
                        accentColor={VERMILION}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            restingDecisionAlone: !curr.restingDecisionAlone,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Gate 3 controls */}
                {focusedGate === 3 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={15} color={GOLD} />
                      <h4 className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                        Gate 3: Defer / Specialized Referral
                      </h4>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ToggleSwitch
                        label="Deep Leaf Interpretation"
                        description="Seeker asks to translate raw, archaic Tamil leaf verses."
                        checked={state.deepInterpretation}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            deepInterpretation: !curr.deepInterpretation,
                          }))
                        }
                      />
                      <ToggleSwitch
                        label="Sub-Tradition Specifics"
                        description="Detailed Saptarṣi / aṁśa system queries."
                        checked={state.subTraditionSpecifics}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            subTraditionSpecifics: !curr.subTraditionSpecifics,
                          }))
                        }
                      />
                      <ToggleSwitch
                        label="Verify Specific Reader"
                        description="Vetting specific apprentice lineage histories."
                        checked={state.verifySpecificReader}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            verifySpecificReader: !curr.verifySpecificReader,
                          }))
                        }
                      />
                      <ToggleSwitch
                        label="Integrate Deep Traditions"
                        description="Weaving Nāḍī with other heavy, lineage-specific methods."
                        checked={state.integrateDeepTradition}
                        onChange={() =>
                          setState((curr) => ({
                            ...curr,
                            integrateDeepTradition: !curr.integrateDeepTradition,
                          }))
                        }
                      />
                      <div className="sm:col-span-2">
                        <ToggleSwitch
                          label="Tradition Disputes"
                          description="Seeker asks to resolve/adjudicate lineage authenticity debates."
                          checked={state.traditionDisputes}
                          onChange={() =>
                            setState((curr) => ({
                              ...curr,
                              traditionDisputes: !curr.traditionDisputes,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                
                {/* Active Verdict panel */}
                <div
                  className="rounded-xl p-5 border-2 transition-all"
                  style={{
                    background: verdictStyle.background,
                    borderColor: verdictStyle.color,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck size={18} color={verdictStyle.color} />
                    <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: verdictStyle.color }}>
                      Evaluation Result
                    </p>
                  </div>
                  <h3 className="mt-3 m-0 text-xl font-bold" style={{ color: INK_PRIMARY }}>
                    {verdictStyle.title}
                  </h3>
                  <p className="mt-2 m-0 text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
                    {evaluation.reason}
                  </p>
                </div>

                {/* Checklist panel */}
                <div className="rounded-xl p-5 border" style={{ background: SURFACE, borderColor: HAIRLINE }}>
                  <div className="mb-4 flex items-center gap-2">
                    <FileCheck size={18} color={GOLD} />
                    <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                      Advisory checklist
                    </p>
                  </div>
                  <ul className="m-0 space-y-3 p-0" style={{ listStyleType: "none" }}>
                    {evaluation.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span
                          className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5"
                          style={{ background: SURFACE_2, color: GOLD }}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-sm leading-snug" style={{ color: INK_PRIMARY }}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- PEDAGOGICAL MAP TAB --- */}
        {activeTab === "lessons" && (
          <motion.div
            key="lessons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-3">
              {/* Lesson 1 Card */}
              <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-100" style={{ color: GOLD }}>
                    Lesson 20.5.1
                  </span>
                  <h4 className="mt-2 m-0 text-lg font-bold" style={{ color: INK_PRIMARY }}>
                    Honest Handling
                  </h4>
                  <p className="mt-2 m-0 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                    Defines the core commitments: the Five Disclosures and the Do-No-Harm ethical floor.
                  </p>
                  <div className="mt-4 border-t pt-3" style={{ borderColor: HAIRLINE }}>
                    <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: INK_MUTED }}>
                      Bloom Level:
                    </div>
                    <div className="text-xs font-semibold" style={{ color: INK_PRIMARY }}>
                      Understand, Apply
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[10px] italic" style={{ color: INK_MUTED }}>
                    Spine: "Say what is known, no more and no less."
                  </span>
                </div>
              </div>

              {/* Lesson 2 Card */}
              <div className="rounded-xl p-5 border-2 flex flex-col justify-between" style={{ background: "rgba(168,130,30,0.03)", borderColor: GOLD }}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-200" style={{ color: GOLD }}>
                    Lesson 20.5.2
                  </span>
                  <h4 className="mt-2 m-0 text-lg font-bold" style={{ color: INK_PRIMARY }}>
                    Decision Framework
                  </h4>
                  <p className="mt-2 m-0 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                    Maps the recommend, refuse, and defer gating rules to evaluate client requests contextually.
                  </p>
                  <div className="mt-4 border-t pt-3" style={{ borderColor: HAIRLINE }}>
                    <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: INK_MUTED }}>
                      Bloom Level:
                    </div>
                    <div className="text-xs font-semibold" style={{ color: INK_PRIMARY }}>
                      Understand, Apply
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[10px] italic" style={{ color: GOLD }}>
                    Spine: Recommend ➔ Refuse ➔ Defer gating.
                  </span>
                </div>
              </div>

              {/* Lesson 3 Card */}
              <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-100" style={{ color: GOLD }}>
                    Lesson 20.5.3
                  </span>
                  <h4 className="mt-2 m-0 text-lg font-bold" style={{ color: INK_PRIMARY }}>
                    Module Closure
                  </h4>
                  <p className="mt-2 m-0 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                    Integrates the 5 chapters into a personal, first-person discipline statement written in your own voice.
                  </p>
                  <div className="mt-4 border-t pt-3" style={{ borderColor: HAIRLINE }}>
                    <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: INK_MUTED }}>
                      Bloom Level:
                    </div>
                    <div className="text-xs font-semibold" style={{ color: INK_PRIMARY }}>
                      Create, Evaluate
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[10px] italic" style={{ color: INK_MUTED }}>
                    Spine: "Commit to your own limits in writing."
                  </span>
                </div>
              </div>
            </div>

            {/* Theoretical Recap Card */}
            <div className="rounded-xl p-5 border bg-amber-50" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
              <h4 className="m-0 text-sm font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                Astrologer's Advisory Constitutional Floor
              </h4>
              <p className="mt-2 m-0 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>
                A chart reader with Nāḍī awareness acts as an honest guide, not an oracle. By delivering the five disclosures upfront, keeping the chart primary, demanding due diligence, and refusing fear-induction/outcome guarantees, we protect our seekers from predation while honoring the cultural tradition.
              </p>
            </div>
          </motion.div>
        )}

        {/* --- TRAINER TAB --- */}
        {activeTab === "trainer" && (
          <motion.div
            key="trainer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {roleplayStage === "intro" && (
              <div className="rounded-xl p-6 border text-center max-w-xl mx-auto space-y-4" style={{ background: SURFACE, borderColor: HAIRLINE }}>
                <Compass size={40} color={GOLD} className="mx-auto" />
                <h3 className="m-0 text-xl font-bold" style={{ color: INK_PRIMARY }}>
                  Nāḍī Advisor Roleplay Simulation
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
                  Test your advisory fluency. Walk through a realistic client consultation, select the ethically correct choices, and deliver the 5 disclosures to keep the client safe.
                </p>
                <button
                  onClick={startTrainer}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all bg-[rgba(156,122,47,1)] hover:bg-[rgba(122,94,30,1)]"
                  style={{ background: GOLD }}
                >
                  Begin Advisor Training
                  <ArrowRight size={13} />
                </button>
              </div>
            )}

            {roleplayStage === "disclosures" && (
              <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-stretch">
                {/* Scenario box */}
                <div className="rounded-xl p-5 border flex flex-col justify-between space-y-4" style={{ background: SURFACE, borderColor: HAIRLINE }}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                        Consultation: Stage 1
                      </span>
                    </div>
                    <blockquote className="m-0 border-l-4 pl-4 py-1 italic text-sm text-amber-900 bg-amber-50 rounded" style={{ borderColor: GOLD }}>
                      "My cousin had a Nāḍī reading in Vaitheeswarankoil where they named his mother. It was amazing! I want to go get a reading for my own career. What do you think?"
                    </blockquote>
                    <p className="text-xs" style={{ color: INK_SECONDARY }}>
                      <strong>Advisor Instruction:</strong> Explain the 5 disclosures before recommending. Click each button below to review/deliver them to the client.
                    </p>
                  </div>

                  {/* Clicking to deliver disclosures */}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { title: "1. The Verification Gap", desc: "No scientific proof exists, but it hasn't been disproven either. Keep it open." },
                      { title: "2. Quality Varies Wildly", desc: "Reader skill and integrity differ enormously. Price does not guarantee quality." },
                      { title: "3. Ordinary Explanations Exist", desc: "A reading fits cold reading or inference as well as direct text reading." },
                      { title: "4. Scams Operate Nearby", desc: "Exorbitant remedy demands and fear-induction are common red flags." },
                      { title: "5. Nāḍī is Never First", desc: "Nāḍī is secondary. Chart analysis and practical reasoning come first." },
                    ].map((disc, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDisclosureClick(idx)}
                        className="p-3 text-left rounded-lg border transition-all text-xs flex flex-col gap-1"
                        style={{
                          background: disclosuresChecked[idx] ? "rgba(46, 125, 50, 0.05)" : SURFACE_2,
                          borderColor: disclosuresChecked[idx] ? GREEN : HAIRLINE,
                        }}
                      >
                        <span className="font-bold flex items-center justify-between">
                          {disc.title}
                          {disclosuresChecked[idx] && <span style={{ color: GREEN }}>✓ Sent</span>}
                        </span>
                        <span style={{ color: INK_MUTED }}>{disc.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: HAIRLINE }}>
                    <span className="text-xs" style={{ color: INK_MUTED }}>
                      {disclosuresChecked.filter((v) => v).length} of 5 disclosures explained
                    </span>
                    <button
                      disabled={!allDisclosuresRead}
                      onClick={() => setRoleplayStage("remedy")}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all`}
                      style={{
                        background: allDisclosuresRead ? GOLD : `${INK_MUTED}40`,
                        cursor: allDisclosuresRead ? "pointer" : "not-allowed",
                      }}
                    >
                      Proceed to Stage 2
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Scorecard Sidebar */}
                <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
                  <div className="space-y-4">
                    <h4 className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                      Advisor scorecard
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: INK_MUTED }}>Status:</span>
                        <span className="font-bold text-blue-500">DELIVERING DISCLOSURES</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: INK_MUTED }}>Autonomy Check:</span>
                        <span className="font-bold text-green-600">INTACT</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border text-xs leading-normal bg-amber-50" style={{ borderColor: HAIRLINE, color: INK_SECONDARY }}>
                    An advisor must deliver all disclosures consistently. Skipping any of them leaves the client under-informed.
                  </div>
                </div>
              </div>
            )}

            {roleplayStage === "remedy" && (
              <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-stretch">
                {/* Scenario box */}
                <div className="rounded-xl p-5 border flex flex-col justify-between space-y-4" style={{ background: SURFACE, borderColor: HAIRLINE }}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                        Consultation: Stage 2
                      </span>
                    </div>
                    <blockquote className="m-0 border-l-4 pl-4 py-1 italic text-sm text-amber-900 bg-amber-50 rounded" style={{ borderColor: GOLD }}>
                      "I understand the risks. But if I do go and the reader tells me I have a severe Saturn affliction and must pay ₹2 lakhs for a shanti-puja to save my career, should I pay it?"
                    </blockquote>
                    <p className="text-xs" style={{ color: INK_SECONDARY }}>
                      <strong>Advisor Instruction:</strong> Choose the correct response that aligns with the do-no-harm commitments.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => {
                        setRoleplayStage("failed");
                        setFailedReason("You endorsed an exorbitant remedy. Astrologers must refuse fear-driven ritual packages designed to extract large sums under crisis framing.");
                      }}
                      className="w-full text-left p-3.5 rounded-lg border hover:bg-amber-50 transition-all text-xs font-semibold"
                      style={{ background: SURFACE, borderColor: HAIRLINE, color: INK_PRIMARY }}
                    >
                      A. "Yes, if it's Saturn, you must pay. Remedies are essential to avert career collapse."
                    </button>
                    <button
                      onClick={() => {
                        setRoleplayStage("failed");
                        setFailedReason("You recommended performing a custom remedy yourself. Astrologers with Nāḍī awareness do not perform leaf readings or prescribe remedies; doing so impersonates credentials.");
                      }}
                      className="w-full text-left p-3.5 rounded-lg border hover:bg-amber-50 transition-all text-xs font-semibold"
                      style={{ background: SURFACE, borderColor: HAIRLINE, color: INK_PRIMARY }}
                    >
                      B. "The reader is a scammer. But you should do a smaller ₹20,000 ritual with me instead."
                    </button>
                    <button
                      onClick={() => setRoleplayStage("completed")}
                      className="w-full text-left p-3.5 rounded-lg border hover:bg-amber-50 transition-all text-xs font-semibold"
                      style={{ background: SURFACE, borderColor: HAIRLINE, color: INK_PRIMARY }}
                    >
                      C. "No. An exorbitant remedy sold under fear is a documented scam pattern. Refuse the payment and rely on multi-source reasoning."
                    </button>
                  </div>
                </div>

                {/* Scorecard Sidebar */}
                <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
                  <div className="space-y-4">
                    <h4 className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                      Advisor scorecard
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: INK_MUTED }}>Status:</span>
                        <span className="font-bold text-blue-500">REMEDY SCREENING</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: INK_MUTED }}>Autonomy Check:</span>
                        <span className="font-bold text-green-600">INTACT</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border text-xs leading-normal bg-amber-50" style={{ borderColor: HAIRLINE, color: INK_SECONDARY }}>
                    The do-no-harm commitments are the floor, not the decoration. Refuse fear-induction outright.
                  </div>
                </div>
              </div>
            )}

            {roleplayStage === "completed" && (
              <div className="rounded-xl p-6 border text-center max-w-xl mx-auto space-y-4" style={{ background: SURFACE, borderColor: HAIRLINE }}>
                <CheckCircle2 size={40} color={GREEN} className="mx-auto" />
                <h3 className="m-0 text-xl font-bold" style={{ color: GREEN }}>
                  Advisor Fluency Installed!
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
                  Excellent work. You successfully delivered the five disclosures, preserved the client's autonomy, and correctly flagged the exorbitant remedy scam under Gate 2 (Refuse).
                </p>
                <button
                  onClick={() => setRoleplayStage("intro")}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all bg-[rgba(156,122,47,1)] hover:bg-[rgba(122,94,30,1)]"
                  style={{ background: GOLD }}
                >
                  Restart Trainer
                </button>
              </div>
            )}

            {roleplayStage === "failed" && (
              <div className="rounded-xl p-6 border text-center max-w-xl mx-auto space-y-4" style={{ background: SURFACE, borderColor: HAIRLINE }}>
                <XCircle size={40} color={VERMILION} className="mx-auto" />
                <h3 className="m-0 text-xl font-bold" style={{ color: VERMILION }}>
                  Advisory Discipline Violated
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>
                  {failedReason}
                </p>
                <button
                  onClick={startTrainer}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all bg-[rgba(200,65,46,1)] hover:bg-[rgba(170,50,30,1)]"
                  style={{ background: VERMILION }}
                >
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
