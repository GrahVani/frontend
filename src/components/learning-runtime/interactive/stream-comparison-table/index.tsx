"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Layers, Target, ShieldAlert, Compass, Star, Check, X,
  ArrowRight, Info, Sparkles, Award, ExternalLink
} from "lucide-react";
import {
  STREAMS_DATA, RECAP_NODES, QUIZ_QUESTIONS, StreamProfile
} from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const INDIGO = "#4F6FA8";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

const IconMap = {
  BookOpen: BookOpen,
  Layers: Layers,
  Target: Target,
  ShieldAlert: ShieldAlert,
  Compass: Compass,
};

const COLOR_THEMES = {
  amber: {
    text: "#b45309",
    bg: "rgba(245, 158, 11, 0.08)",
    border: "rgba(245, 158, 11, 0.25)",
    hoverBorder: "#d97706",
    progressBg: "#f59e0b",
    light: "#fef3c7"
  },
  rose: {
    text: "#be123c",
    bg: "rgba(244, 63, 94, 0.08)",
    border: "rgba(244, 63, 94, 0.25)",
    hoverBorder: "#e11d48",
    progressBg: "#f43f5e",
    light: "#ffe4e6"
  },
  emerald: {
    text: "#047857",
    bg: "rgba(16, 185, 129, 0.08)",
    border: "rgba(16, 185, 129, 0.25)",
    hoverBorder: "#059669",
    progressBg: "#10b981",
    light: "#d1fae5"
  },
  red: {
    text: "#b91c1c",
    bg: "rgba(239, 68, 68, 0.08)",
    border: "rgba(239, 68, 68, 0.25)",
    hoverBorder: "#dc2626",
    progressBg: "#ef4444",
    light: "#fee2e2"
  },
  violet: {
    text: "#6d28d9",
    bg: "rgba(139, 92, 246, 0.08)",
    border: "rgba(139, 92, 246, 0.25)",
    hoverBorder: "#7c3aed",
    progressBg: "#8b5cf6",
    light: "#ede9fe"
  }
};

const MODULE_OVERVIEWS: Record<string, string> = {
  "Module 8 (Aspects) & Module 9 (Navāṁśa)": "Learn how the 108 padas partition the zodiac into 9 subdivisions per sign, bridging rāśis and nakṣatras to reveal the subconscious drives and spouse traits.",
  "Module 9 (Navāṁśa) & Module 15 (Jaimini Fundamentals)": "Discover Jaimini Sūtras, sign-based daśās (Cara Daśā), and how Nakṣatra padas determine the unique Ārūḍha and Karaka schemes.",
  "Module 16 (KP Prediction)": "Master the 249 sub-division system, cuspal sub-lords, and star-to-sub relationships for exact timing and event classification.",
  "Module 20 (Lal Kitab System)": "Study the Persian-influenced Lal Kitab, household remedies (Upāyas), and house-focused alignments without nakṣatras.",
  "Module 19 (Tājika & Annual Charts)": "Learn solar returns (Varṣaphala), progressed Ascendant (Munthā), and how the Janma-tārā cycle timings govern the year's events."
};

type Tab = "comparison" | "recap" | "drill";

export function StreamComparisonTable() {
  const [tab, setTab] = useState<Tab>("comparison");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px 22px 22px" }} data-interactive="stream-comparison-table">
      <div role="tablist" aria-label="Stream Comparison Modes" style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        <TabButton
          active={tab === "comparison"}
          onClick={() => setTab("comparison")}
          label="Stream Comparison"
          sublabel="Five-stream nakṣatra resolutions"
          icon={<Layers size={14} />}
        />
        <TabButton
          active={tab === "recap"}
          onClick={() => setTab("recap")}
          label="Module 7 Recap"
          sublabel="Structural timeline review"
          icon={<Award size={14} />}
        />
        <TabButton
          active={tab === "drill"}
          onClick={() => setTab("drill")}
          label="Knowledge Drill"
          sublabel="3 cross-stream scenarios"
          icon={<BookOpen size={14} />}
        />
      </div>

      <AnimatePresence mode="wait">
        {tab === "comparison" && (
          <motion.div
            key="comparison"
            initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ComparisonView reducedMotion={reducedMotion} />
          </motion.div>
        )}
        {tab === "recap" && (
          <motion.div
            key="recap"
            initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <RecapView reducedMotion={reducedMotion} />
          </motion.div>
        )}
        {tab === "drill" && (
          <motion.div
            key="drill"
            initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <DrillView reducedMotion={reducedMotion} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, label, sublabel, icon }: { active: boolean; onClick: () => void; label: string; sublabel: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="gl-clickable gl-focus-ring"
      style={{
        flex: "1 1 200px",
        padding: "10px 14px",
        background: active ? "linear-gradient(180deg, rgba(255, 248, 230, 0.96) 0%, rgba(252, 240, 210, 0.92) 100%)" : "rgba(255, 251, 240, 0.55)",
        border: active ? `1.5px solid ${GOLD}` : "1.5px solid rgba(156, 122, 47, 0.20)",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span style={{
        width: "28px",
        height: "28px",
        flexShrink: 0,
        borderRadius: "50%",
        background: active ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.15)",
        color: active ? "#1A1408" : GOLD_DEEP,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {icon}
      </span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "14px", fontWeight: 700, color: active ? GOLD_DEEP : INK_PRIMARY }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "11px", color: INK_MUTED, marginTop: "2px" }}>
          {sublabel}
        </span>
      </span>
    </button>
  );
}

function ComparisonView({ reducedMotion }: { reducedMotion: boolean }) {
  const [selectedId, setSelectedId] = useState<string | null>("parashari");
  const [modalModule, setModalModule] = useState<string | null>(null);

  const selectedStream = STREAMS_DATA.find(s => s.id === selectedId) || STREAMS_DATA[0];
  const selectedTheme = COLOR_THEMES[selectedStream.color];

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {/* Stream Cards Column */}
      <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD_DEEP, fontWeight: 700 }}>
          Select a Stream to Analyze
        </div>

        {STREAMS_DATA.map(stream => {
          const theme = COLOR_THEMES[stream.color];
          const isSelected = selectedId === stream.id;
          const IconComponent = IconMap[stream.iconName];

          return (
            <button
              key={stream.id}
              onClick={() => setSelectedId(stream.id)}
              className="gl-clickable gl-focus-ring"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                background: isSelected ? theme.bg : "rgba(255, 252, 240, 0.4)",
                border: isSelected ? `1.5px solid ${theme.hoverBorder}` : "1.5px solid rgba(156, 122, 47, 0.12)",
                cursor: "pointer",
                textAlign: "left",
                transition: reducedMotion ? "none" : "all 0.2s ease",
                boxShadow: isSelected ? `0 4px 12px ${theme.border}` : "none",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px"
              }}
            >
              {/* Colored Icon */}
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: isSelected ? theme.hoverBorder : "rgba(156, 122, 47, 0.1)",
                color: isSelected ? "#fff" : theme.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <IconComponent size={16} />
              </div>

              {/* Card info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "6px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: INK_PRIMARY }}>
                    {stream.name}
                  </span>
                  <span style={{ fontSize: "12px", fontStyle: "italic", color: INK_MUTED }}>
                    {stream.devanagari}
                  </span>
                </div>
                <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: "4px 0 8px 0", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {stream.keyUsage}
                </p>

                {/* Resolution progress indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: theme.text, width: "32px" }}>
                    Res: {stream.resolution}%
                  </span>
                  <div style={{ flex: 1, height: "4px", background: "rgba(156, 122, 47, 0.12)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{
                      width: `${stream.resolution}%`,
                      height: "100%",
                      background: theme.progressBg,
                      transition: reducedMotion ? "none" : "width 0.4s ease"
                    }} />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Details Panel Column */}
      <div style={{ flex: "1.2 1 350px", display: "flex", flexDirection: "column" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStream.id}
            initial={reducedMotion ? undefined : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: "18px 20px",
              borderRadius: "12px",
              background: selectedTheme.bg,
              border: `1.5px solid ${selectedTheme.hoverBorder}30`,
              boxShadow: "0 4px 15px rgba(156, 122, 47, 0.05)",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between"
            }}
          >
            <div>
              {/* Header Badge & Resolution */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                <span style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  padding: "3px 10px",
                  borderRadius: "12px",
                  background: selectedTheme.progressBg,
                  color: "#FFF"
                }}>
                  {selectedStream.name} Stream
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Info size={13} style={{ color: selectedTheme.text }} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: selectedTheme.text }}>
                    Resolution Level: {selectedStream.resolution > 80 ? "Ultra-High" : selectedStream.resolution > 50 ? "High" : selectedStream.resolution > 20 ? "Moderate" : "Minimal"}
                  </span>
                </div>
              </div>

              {/* Title & Devanagari */}
              <div style={{ fontSize: "24px", fontFamily: "var(--font-cormorant)", fontWeight: 700, color: selectedTheme.text, marginBottom: "8px" }}>
                {selectedStream.name} <span style={{ fontSize: "16px", fontWeight: 500, color: INK_MUTED }}>({selectedStream.devanagari})</span>
              </div>

              {/* Core description */}
              <p style={{ fontSize: "14px", color: INK_PRIMARY, lineHeight: 1.5, marginBottom: "16px" }}>
                {selectedStream.coreFocus}
              </p>

              {/* Key Techniques */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: selectedTheme.text, fontWeight: 700, marginBottom: "8px" }}>
                  Key Nakṣatra Techniques
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {selectedStream.keyTechniques.map((tech, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <span style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: selectedTheme.progressBg,
                        marginTop: "7px",
                        flexShrink: 0
                      }} />
                      <span style={{ fontSize: "13px", color: INK_SECONDARY, lineHeight: 1.4 }}>
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action / Link area */}
            <div style={{
              marginTop: "16px",
              paddingTop: "14px",
              borderTop: "1px dashed rgba(156, 122, 47, 0.2)"
            }}>
              <div style={{ fontSize: "11px", color: INK_MUTED, marginBottom: "8px" }}>
                Curriculum Integration Path
              </div>
              <button
                type="button"
                onClick={() => setModalModule(selectedStream.targetModule)}
                className="gl-clickable gl-focus-ring"
                style={{
                  width: "100%",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  background: "#FFF",
                  border: `1.5px solid ${selectedTheme.hoverBorder}`,
                  color: selectedTheme.text,
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 5px rgba(156, 122, 47, 0.05)"
                }}
              >
                <span>{selectedStream.linkText}</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Target Module Preview Modal Overlay */}
      <AnimatePresence>
        {modalModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(26, 20, 8, 0.4)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px"
            }}
            onClick={() => setModalModule(null)}
          >
            <motion.div
              initial={reducedMotion ? undefined : { scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={reducedMotion ? undefined : { scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "460px",
                padding: "24px",
                borderRadius: "14px",
                background: "linear-gradient(180deg, rgba(255, 248, 230, 0.98) 0%, rgba(252, 240, 210, 0.96) 100%)",
                border: `2px solid ${GOLD}`,
                boxShadow: "0 8px 30px rgba(26, 20, 8, 0.25)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`, color: "#1A1408", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={16} />
                </div>
                <div>
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: GOLD_DEEP, fontWeight: 700 }}>
                    Future Stream Path
                  </div>
                  <div style={{ fontSize: "17px", fontWeight: 700, color: INK_PRIMARY }}>
                    {modalModule}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "14px", color: INK_SECONDARY, lineHeight: 1.5, margin: "0 0 20px 0" }}>
                {MODULE_OVERVIEWS[modalModule] || "Explore this specialized module to study how this stream's nakṣatra calculations drive precise natal and electional judgments."}
              </p>

              <button
                type="button"
                onClick={() => setModalModule(null)}
                className="gl-clickable gl-focus-ring"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
                  color: "#1A1408",
                  fontWeight: 700,
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                Got it, close preview
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RecapView({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto 10px auto" }}>
        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "20px", fontWeight: 700, color: GOLD_DEEP, margin: "0 0 6px 0" }}>
          Module 7: The Journey of the Nakṣatras
        </h3>
        <p style={{ fontSize: "13px", color: INK_MUTED, margin: 0 }}>
          You have completed all lessons in Module 7. Click nodes to trace how we built from core meanings to complex cross-stream applications.
        </p>
      </div>

      {/* Vertical Timeline */}
      <div style={{ position: "relative", paddingLeft: "30px", margin: "10px 0" }}>
        {/* Vertical line indicator */}
        <div style={{
          position: "absolute",
          left: "14px",
          top: "8px",
          bottom: "8px",
          width: "2px",
          background: `linear-gradient(180deg, ${GOLD_LIGHT} 0%, ${GOLD} 50%, ${INDIGO} 100%)`
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {RECAP_NODES.map((node, i) => (
            <div key={i} style={{ position: "relative" }}>
              {/* Timeline circle node */}
              <div style={{
                position: "absolute",
                left: "-21px",
                top: "4px",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#FFF",
                border: `3.5px solid ${i < 2 ? GOLD_LIGHT : i < 4 ? GOLD : INDIGO}`,
                boxShadow: "0 1px 3px rgba(26,20,8,0.2)"
              }} />

              {/* Timeline Card */}
              <div style={{
                background: "rgba(255, 252, 240, 0.55)",
                border: "1px solid rgba(156, 122, 47, 0.15)",
                borderRadius: "8px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px"
              }}>
                <span style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: GOLD_DEEP,
                  background: "rgba(156, 122, 47, 0.12)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  marginTop: "2px",
                  whiteSpace: "nowrap"
                }}>
                  {node.chapter}
                </span>

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 700, color: INK_PRIMARY, margin: "0 0 2px 0" }}>
                    {node.title}
                  </h4>
                  <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: 0, lineHeight: 1.45 }}>
                    {node.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DrillView({ reducedMotion }: { reducedMotion: boolean }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scenario = QUIZ_QUESTIONS[index];

  const handleSubmit = () => {
    if (selected === null) return;
    if (selected === scenario.answerIndex) {
      setScore(s => s + 1);
    }
    setSubmitted(true);
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    if (index === QUIZ_QUESTIONS.length - 1) {
      setCompleted(true);
    } else {
      setIndex(i => i + 1);
    }
  };

  const resetQuiz = () => {
    setIndex(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div style={{ textAlign: "center", padding: "30px 20px" }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "rgba(58, 140, 90, 0.12)",
          color: "#3A8C5A",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px"
        }}>
          <Check size={28} />
        </div>

        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "24px", fontWeight: 700, color: GOLD_DEEP, margin: "0 0 8px 0" }}>
          Knowledge Drill Completed!
        </h3>

        <p style={{ fontSize: "15px", color: INK_PRIMARY, maxWidth: "420px", margin: "0 auto 20px auto", lineHeight: 1.5 }}>
          You scored **{score} out of {QUIZ_QUESTIONS.length}** correct. You have successfully reviewed how the Parāśari, Jaimini, KP, Lal Kitab, and Tājika streams utilize the nakṣatras!
        </p>

        <button
          type="button"
          onClick={resetQuiz}
          className="gl-clickable gl-focus-ring"
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
            color: "#1A1408",
            border: "none",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Retake Drill
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 700, color: INDIGO, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
          Scenario {index + 1} of {QUIZ_QUESTIONS.length}
        </p>
        <div style={{ display: "flex", gap: "4px" }}>
          {QUIZ_QUESTIONS.map((_, i) => (
            <span
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: i === index ? INDIGO : "rgba(79, 111, 168, 0.25)",
                transition: reducedMotion ? "none" : "background 250ms ease"
              }}
            />
          ))}
        </div>
      </div>

      <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "19px", fontWeight: 600, color: INK_PRIMARY, lineHeight: 1.45, margin: 0 }}>
        {scenario.scenario}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {scenario.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === scenario.answerIndex;
          const showCorrect = submitted && isCorrect;
          const showWrong = submitted && isSelected && !isCorrect;

          return (
            <button
              key={i}
              type="button"
              disabled={submitted}
              onClick={() => !submitted && setSelected(i)}
              className="gl-focus-ring gl-clickable"
              aria-pressed={isSelected}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: "8px",
                background: showCorrect ? "rgba(58, 140, 90, 0.10)" : showWrong ? "rgba(162, 58, 30, 0.10)" : isSelected ? "rgba(79, 111, 168, 0.10)" : "rgba(255, 252, 240, 0.55)",
                border: showCorrect ? "1.5px solid #3A8C5A" : showWrong ? "1.5px solid #A23A1E" : isSelected ? `1.5px solid ${INDIGO}` : "1px solid rgba(156, 122, 47, 0.20)",
                cursor: submitted ? "default" : "pointer",
                transition: reducedMotion ? "none" : "all 250ms ease",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              <span style={{
                width: "24px",
                height: "24px",
                flexShrink: 0,
                borderRadius: "50%",
                background: showCorrect ? "#3A8C5A" : showWrong ? "#A23A1E" : isSelected ? INDIGO : "rgba(156, 122, 47, 0.15)",
                color: showCorrect || showWrong || isSelected ? "#FFF" : GOLD_DEEP,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                fontWeight: 700,
                marginTop: "2px"
              }}>
                {showCorrect ? <Check size={14} /> : showWrong ? <X size={14} /> : String.fromCharCode(65 + i)}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "14.5px", color: INK_PRIMARY, lineHeight: 1.45, fontWeight: isSelected ? 600 : 400 }}>
                  {opt}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "12px 14px",
            borderRadius: "8px",
            background: selected === scenario.answerIndex ? "rgba(58, 140, 90, 0.08)" : "rgba(162, 58, 30, 0.06)",
            borderLeft: `3px solid ${selected === scenario.answerIndex ? "#3A8C5A" : "#A23A1E"}`
          }}
        >
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px" }}>
            <Info size={14} style={{ color: selected === scenario.answerIndex ? "#3A8C5A" : "#A23A1E" }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: selected === scenario.answerIndex ? "#3A8C5A" : "#A23A1E" }}>
              {selected === scenario.answerIndex ? "Correct Explanation" : "Incorrect Explanation"}
            </span>
          </div>
          <p style={{ fontSize: "13.5px", color: INK_PRIMARY, margin: 0, lineHeight: 1.45 }}>
            {scenario.explanation}
          </p>
        </motion.div>
      )}

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selected === null}
            className="gl-focus-ring gl-clickable"
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              background: selected !== null ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.15)",
              color: selected !== null ? "#1A1408" : GOLD_DEEP,
              border: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 700,
              cursor: selected !== null ? "pointer" : "not-allowed",
              transition: reducedMotion ? "none" : "all 250ms ease"
            }}
          >
            Check answer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="gl-focus-ring gl-clickable"
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
              color: "#1A1408",
              border: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            {index === QUIZ_QUESTIONS.length - 1 ? "Finish drill" : "Next scenario"}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
