"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, BookOpen, Check, X, ArrowRight, Ruler, Info
} from "lucide-react";
import {
  NAKSHATRAS_KP, VIMSOTTARI_CYCLE, DRILL_SCENARIOS,
  getSubsForNakshatra, VimshottariPlanet
} from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const INDIGO = "#4F6FA8";
const JADE = "#3A8C5A";
const VERMILION = "#A23A1E";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

// Richer palette for the 9 planets — warm earthy tones
const PLANET_COLORS: Record<string, { bg: string; fill: string; text: string }> = {
  ke: { bg: "rgba(139, 105, 20, 0.15)", fill: "#8B6914", text: "#6B5010" },
  ve: { bg: "rgba(184, 134, 11, 0.15)", fill: "#B8860B", text: "#8A6508" },
  su: { bg: "rgba(205, 133, 63, 0.15)", fill: "#CD853F", text: "#9E6630" },
  mo: { bg: "rgba(210, 180, 140, 0.18)", fill: "#D2B48C", text: "#8B7355" },
  ma: { bg: "rgba(160, 82, 45, 0.15)", fill: "#A0522D", text: "#7A3E22" },
  ra: { bg: "rgba(107, 68, 35, 0.15)", fill: "#6B4423", text: "#4D311A" },
  ju: { bg: "rgba(218, 165, 32, 0.15)", fill: "#DAA520", text: "#A07D18" },
  sa: { bg: "rgba(123, 106, 58, 0.15)", fill: "#7B6A3A", text: "#5C4F2B" },
  me: { bg: "rgba(155, 133, 85, 0.15)", fill: "#9B8555", text: "#7A6944" },
};

type Tab = "ruler" | "drill";

export function KpSubCalculator() {
  const [tab, setTab] = useState<Tab>("ruler");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{ padding: "20px 22px 22px" }}
      data-interactive="kp-sub-calculator"
    >
      <div role="tablist" aria-label="KP modes" style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        <TabButton active={tab === "ruler"} onClick={() => setTab("ruler")} label="Vimśottarī Ruler" sublabel="Proportional Sub-Lord Visualization" icon={<Ruler size={14} />} />
        <TabButton active={tab === "drill"} onClick={() => setTab("drill")} label="Knowledge Drill" sublabel="3 evaluation scenarios" icon={<BookOpen size={14} />} />
      </div>

      {tab === "ruler" ? <RulerView reducedMotion={reducedMotion} /> : <DrillView reducedMotion={reducedMotion} />}
    </div>
  );
}

function TabButton({ active, onClick, label, sublabel, icon }: { active: boolean; onClick: () => void; label: string; sublabel: string; icon: React.ReactNode }) {
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick} className="gl-clickable gl-focus-ring"
      style={{
        flex: "1 1 260px", padding: "10px 14px",
        background: active ? "linear-gradient(180deg, rgba(255, 248, 230, 0.96) 0%, rgba(252, 240, 210, 0.92) 100%)" : "rgba(255, 251, 240, 0.55)",
        border: active ? `1.5px solid ${GOLD}` : "1.5px solid rgba(156, 122, 47, 0.30)",
        borderRadius: "10px", cursor: "pointer", textAlign: "left",
        display: "flex", alignItems: "center", gap: "10px",
      }}
    >
      <span style={{ width: "28px", height: "28px", flexShrink: 0, borderRadius: "50%", background: active ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.15)", color: active ? "#1A1408" : GOLD_DEEP, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{icon}</span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "14px", fontWeight: 700, color: active ? GOLD_DEEP : INK_PRIMARY }}>{label}</span>
        <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "12px", color: INK_MUTED, marginTop: "2px" }}>{sublabel}</span>
      </span>
    </button>
  );
}

/* ─── Ruler View (Redesigned) ─── */
function RulerView({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeNakId, setActiveNakId] = useState<number>(1);
  const [hoveredSub, setHoveredSub] = useState<number | null>(null);

  const activeNak = NAKSHATRAS_KP.find(n => n.id === activeNakId)!;
  const subs = getSubsForNakshatra(activeNak.lordIndex);
  const lordPlanet = VIMSOTTARI_CYCLE[activeNak.lordIndex];

  // Compute cumulative start positions for each sub (in arc-minutes)
  const cumulative: number[] = [];
  let acc = 0;
  for (const s of subs) {
    cumulative.push(acc);
    acc += s.widthArcMin;
  }

  const activeSub = hoveredSub !== null ? subs[hoveredSub] : null;
  const activeStart = hoveredSub !== null ? cumulative[hoveredSub] : 0;

  const formatArcMin = (arcMin: number) => {
    const deg = Math.floor(arcMin / 60);
    const min = Math.floor(arcMin % 60);
    const sec = Math.round((arcMin % 1) * 60);
    return `${deg}°${String(min).padStart(2, "0")}′${String(sec).padStart(2, "0")}″`;
  };

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

      {/* Left: Nakshatra Selector — compact */}
      <div style={{ flex: "0 0 200px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3 style={{ margin: 0, fontFamily: "var(--font-cormorant)", fontSize: "18px", color: GOLD_DEEP, fontWeight: 600 }}>
          Select Nakṣatra
        </h3>
        <div style={{
          display: "flex", flexDirection: "column", gap: "2px",
          maxHeight: "520px", overflowY: "auto", paddingRight: "4px",
          scrollbarWidth: "thin", scrollbarColor: `${GOLD_LIGHT} transparent`
        }}>
          {NAKSHATRAS_KP.map(n => {
            const isActive = n.id === activeNakId;
            const lord = VIMSOTTARI_CYCLE[n.lordIndex];
            return (
              <button key={n.id} onClick={() => { setActiveNakId(n.id); setHoveredSub(null); }}
                style={{
                  textAlign: "left", padding: "6px 10px", borderRadius: "5px",
                  background: isActive ? `linear-gradient(90deg, ${GOLD_LIGHT}40, transparent)` : "transparent",
                  borderLeft: isActive ? `3px solid ${GOLD}` : "3px solid transparent",
                  color: isActive ? GOLD_DEEP : INK_SECONDARY,
                  fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: isActive ? 700 : 500,
                  cursor: "pointer", transition: reducedMotion ? "none" : "all 0.15s ease",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}
              >
                <span>{n.id}. {n.name}</span>
                <span style={{ fontSize: "10px", color: INK_MUTED, fontWeight: 600 }}>{lord.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Visualization Area */}
      <div style={{ flex: 1, minWidth: "340px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Header Card */}
        <AnimatePresence mode="wait">
          <motion.div key={activeNakId}
            initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "12px 16px", background: "rgba(255, 251, 240, 0.8)",
              border: `1px solid ${GOLD_LIGHT}`, borderRadius: "10px",
              boxShadow: "0 3px 10px rgba(156, 122, 47, 0.08)",
              display: "flex", alignItems: "center", gap: "12px"
            }}
          >
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
              <Sparkles size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: INK_MUTED, fontWeight: 700 }}>
                Lord: {lordPlanet.name} ({lordPlanet.years} yrs) • Sub order starts here
              </div>
              <div style={{ fontSize: "17px", fontFamily: "var(--font-cormorant)", color: INK_PRIMARY, fontWeight: 600 }}>
                {activeNak.name}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ─── The Proportional Ruler (Clean) ─── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "10px", color: INK_MUTED, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>0°00′</span>
            <span style={{ fontSize: "10px", color: INK_MUTED, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>13°20′</span>
          </div>
          <div style={{
            display: "flex", borderRadius: "12px", overflow: "hidden", height: "64px",
            border: `1.5px solid ${GOLD_LIGHT}`, boxShadow: "0 4px 16px rgba(156, 122, 47, 0.12)"
          }}>
            {subs.map((sub, i) => {
              const isHovered = hoveredSub === i;
              const pc = PLANET_COLORS[sub.id];
              return (
                <motion.div
                  key={`${activeNakId}-${i}`}
                  initial={reducedMotion ? undefined : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  onMouseEnter={() => setHoveredSub(i)}
                  onClick={() => setHoveredSub(i)}
                  title={`${sub.name} — ${sub.widthLabel} (${sub.years} yrs)`}
                  style={{
                    flex: `${sub.years} 0 0`,
                    background: isHovered
                      ? `linear-gradient(180deg, ${pc.fill}50, ${pc.fill}90)`
                      : `linear-gradient(180deg, ${pc.bg}, ${pc.fill}30)`,
                    borderRight: i < 8 ? `1px solid rgba(255,255,255,0.5)` : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", minWidth: "0",
                    transition: reducedMotion ? "none" : "all 0.2s ease",
                    boxShadow: isHovered ? `inset 0 0 0 2px ${pc.fill}` : "none",
                  }}
                >
                  <span style={{
                    fontSize: "13px", fontWeight: 800,
                    color: isHovered ? pc.text : INK_PRIMARY,
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "0.02em",
                  }}>
                    {sub.name.substring(0, 2)}
                  </span>
                </motion.div>
              );
            })}
          </div>
          {/* Legend row below the bar — one label per segment, cleanly spaced */}
          <div style={{ display: "flex", marginTop: "6px" }}>
            {subs.map((sub, i) => {
              const isHovered = hoveredSub === i;
              const pc = PLANET_COLORS[sub.id];
              return (
                <div key={`leg-${activeNakId}-${i}`} style={{
                  flex: `${sub.years} 0 0`, textAlign: "center", minWidth: "0",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  <span style={{
                    fontSize: "10px", fontWeight: isHovered ? 800 : 600,
                    color: isHovered ? pc.text : INK_MUTED,
                    transition: reducedMotion ? "none" : "color 0.2s ease",
                  }}>
                    {sub.years}yr
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Bottom: Two-Column Detail Area (always visible, fills white space) ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

          {/* Column 1: Selected Sub Detail */}
          <div style={{
            padding: "14px 16px", borderRadius: "10px",
            background: activeSub ? `${PLANET_COLORS[activeSub.id].bg}` : "rgba(255, 251, 240, 0.5)",
            border: activeSub ? `1px solid ${PLANET_COLORS[activeSub.id].fill}40` : `1px solid rgba(156, 122, 47, 0.12)`,
            transition: reducedMotion ? "none" : "all 0.3s ease",
            minHeight: "140px", display: "flex", flexDirection: "column", justifyContent: "center"
          }}>
            {activeSub ? (
              <AnimatePresence mode="wait">
                <motion.div key={activeSub.id}
                  initial={reducedMotion ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                >
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: PLANET_COLORS[activeSub.id].text, fontWeight: 700 }}>
                    Sub-Lord Detail
                  </div>
                  <div style={{ fontSize: "22px", fontFamily: "var(--font-cormorant)", fontWeight: 700, color: PLANET_COLORS[activeSub.id].text }}>
                    {activeSub.name}
                  </div>
                  <div style={{ fontSize: "13px", color: INK_SECONDARY, fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
                    <strong>Years:</strong> {activeSub.years} / 120<br />
                    <strong>Width:</strong> {activeSub.widthLabel}<br />
                    <strong>Span:</strong> {formatArcMin(activeStart)} → {formatArcMin(activeStart + activeSub.widthArcMin)}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div style={{ textAlign: "center", color: INK_MUTED, fontSize: "13px", fontFamily: "var(--font-sans)" }}>
                <Ruler size={24} style={{ marginBottom: "8px", opacity: 0.4 }} /><br />
                Hover over a segment<br />to see its breakdown
              </div>
            )}
          </div>

          {/* Column 2: Math Formula Card */}
          <div style={{
            padding: "14px 16px", borderRadius: "10px",
            background: activeSub ? "rgba(79, 111, 168, 0.05)" : "rgba(255, 251, 240, 0.5)",
            border: "1px solid rgba(79, 111, 168, 0.12)",
            minHeight: "140px", display: "flex", flexDirection: "column", justifyContent: "center"
          }}>
            {activeSub ? (
              <AnimatePresence mode="wait">
                <motion.div key={activeSub.id}
                  initial={reducedMotion ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                >
                  <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: INDIGO, fontWeight: 700 }}>
                    Formula Breakdown
                  </div>
                  <div style={{
                    fontSize: "15px", fontFamily: "var(--font-cormorant)", fontWeight: 600,
                    color: INK_PRIMARY, lineHeight: 1.6,
                    padding: "10px 12px", background: "rgba(79, 111, 168, 0.06)",
                    borderRadius: "8px", border: "1px solid rgba(79, 111, 168, 0.1)"
                  }}>
                    ({activeSub.years} ÷ 120) × 800′
                  </div>
                  <div style={{ fontSize: "13px", color: INK_SECONDARY, fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
                    = <strong>{activeSub.widthArcMin.toFixed(2)}′</strong> = <strong style={{ color: GOLD_DEEP }}>{activeSub.widthLabel}</strong>
                  </div>
                  <div style={{
                    fontSize: "12px", color: INK_MUTED, fontFamily: "var(--font-sans)", marginTop: "2px"
                  }}>
                    {activeSub.years >= 16 ? "One of the widest subs" : activeSub.years <= 7 ? "One of the narrowest subs" : "Mid-range sub width"}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div style={{ textAlign: "center", color: INK_MUTED, fontSize: "13px", fontFamily: "var(--font-sans)" }}>
                <Info size={24} style={{ marginBottom: "8px", opacity: 0.4 }} /><br />
                See the exact arithmetic<br />for any sub-lord
              </div>
            )}
          </div>
        </div>

        {/* 243 vs 249 Info Strip */}
        <div style={{
          padding: "10px 14px", background: "rgba(79, 111, 168, 0.05)",
          border: "1px solid rgba(79, 111, 168, 0.12)", borderRadius: "8px",
          display: "flex", gap: "10px", alignItems: "center"
        }}>
          <Info size={14} color={INDIGO} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: "12px", color: INK_SECONDARY, fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
            <strong style={{ color: INDIGO }}>243 vs 249:</strong> 27 × 9 = <strong>243</strong> sub-lords. Six straddle a sign cusp → listed twice → <strong>249</strong> in KP tables.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Drill View ─── */
function DrillView({ reducedMotion }: { reducedMotion: boolean }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const scenario = DRILL_SCENARIOS[index];
  const isLast = index === DRILL_SCENARIOS.length - 1;

  const handleSubmit = () => { if (!selected) return; setSubmitted(true); };
  const handleNext = () => { setSelected(null); setSubmitted(false); if (!isLast) setIndex(i => i + 1); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 700, color: INDIGO, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
          Scenario {index + 1} of {DRILL_SCENARIOS.length}
        </p>
        <div style={{ display: "flex", gap: "4px" }}>
          {DRILL_SCENARIOS.map((_, i) => (
            <span key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i === index ? INDIGO : "rgba(79, 111, 168, 0.25)", transition: reducedMotion ? "none" : "background 250ms ease" }} />
          ))}
        </div>
      </div>

      <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.4, margin: 0 }}>
        {scenario.question}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {scenario.options.map((opt) => {
          const isSelected = selected === opt.id;
          const showCorrect = submitted && opt.isCorrect;
          const showWrong = submitted && isSelected && !opt.isCorrect;
          return (
            <button key={opt.id} type="button" disabled={submitted}
              onClick={() => !submitted && setSelected(opt.id)}
              className="gl-focus-ring gl-clickable" aria-pressed={isSelected}
              style={{
                width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: "8px",
                background: showCorrect ? "rgba(58, 140, 90, 0.10)" : showWrong ? "rgba(162, 58, 30, 0.10)" : isSelected ? "rgba(79, 111, 168, 0.10)" : "rgba(255, 252, 240, 0.55)",
                border: showCorrect ? "1.5px solid #3A8C5A" : showWrong ? "1.5px solid #A23A1E" : isSelected ? `1.5px solid ${INDIGO}` : "1px solid rgba(156, 122, 47, 0.20)",
                cursor: submitted ? "default" : "pointer",
                transition: reducedMotion ? "none" : "all 250ms ease",
                display: "flex", alignItems: "flex-start", gap: "10px",
              }}
            >
              <span style={{
                width: "24px", height: "24px", flexShrink: 0, borderRadius: "50%",
                background: showCorrect ? "#3A8C5A" : showWrong ? "#A23A1E" : isSelected ? INDIGO : "rgba(156, 122, 47, 0.15)",
                color: showCorrect || showWrong || isSelected ? "#FFF" : GOLD_DEEP,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 700, marginTop: "2px"
              }}>
                {showCorrect ? <Check size={14} /> : showWrong ? <X size={14} /> : opt.id}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: INK_PRIMARY, lineHeight: 1.45, fontWeight: isSelected ? 600 : 400 }}>{opt.label}</span>
                {submitted && (
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: opt.isCorrect ? JADE : showWrong ? VERMILION : INK_MUTED, lineHeight: 1.5, marginTop: "4px" }}>
                    {opt.explanation}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
        {!submitted ? (
          <button type="button" onClick={handleSubmit} disabled={!selected} className="gl-focus-ring gl-clickable"
            style={{
              padding: "10px 18px", borderRadius: "8px",
              background: selected ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.15)",
              color: selected ? "#1A1408" : GOLD_DEEP, border: "none",
              fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 700,
              cursor: selected ? "pointer" : "not-allowed",
              transition: reducedMotion ? "none" : "all 250ms ease"
            }}
          >Check answer</button>
        ) : (
          <button type="button" onClick={handleNext} className="gl-focus-ring gl-clickable"
            style={{
              padding: "10px 18px", borderRadius: "8px",
              background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
              color: "#1A1408", border: "none",
              fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 700,
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px"
            }}
          >
            {isLast ? "Finish drill" : "Next scenario"}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
