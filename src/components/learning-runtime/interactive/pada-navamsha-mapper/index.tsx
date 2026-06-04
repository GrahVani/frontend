"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, BookOpen, Check, X, ArrowRight, CircleDashed, LayoutTemplate
} from "lucide-react";
import { NAKSHATRAS, ZODIAC_SIGNS, DRILL_SCENARIOS, NakshatraData } from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const INDIGO = "#4F6FA8";
const JADE = "#3A8C5A";
const VERMILION = "#A23A1E";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

type Tab = "diagram" | "drill";

export function PadaNavamshaMapper() {
  const [tab, setTab] = useState<Tab>("diagram");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{ padding: "20px 22px 22px" }}
      data-interactive="pada-navamsha-mapper"
    >
      <div role="tablist" aria-label="Synthesis modes" style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        <TabButton
          active={tab === "diagram"}
          onClick={() => setTab("diagram")}
          label="Navāṁśa Mandala"
          sublabel="Interactive Circular Mapping"
          icon={<CircleDashed size={14} />}
        />
        <TabButton
          active={tab === "drill"}
          onClick={() => setTab("drill")}
          label="Knowledge Drill"
          sublabel="3 evaluation scenarios"
          icon={<BookOpen size={14} />}
        />
      </div>

      {tab === "diagram" ? (
        <MapperView reducedMotion={reducedMotion} />
      ) : (
        <DrillView reducedMotion={reducedMotion} />
      )}
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
        flex: "1 1 260px",
        padding: "10px 14px",
        background: active
          ? "linear-gradient(180deg, rgba(255, 248, 230, 0.96) 0%, rgba(252, 240, 210, 0.92) 100%)"
          : "rgba(255, 251, 240, 0.55)",
        border: active ? `1.5px solid ${GOLD}` : "1.5px solid rgba(156, 122, 47, 0.30)",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span
        style={{
          width: "28px",
          height: "28px",
          flexShrink: 0,
          borderRadius: "50%",
          background: active ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.15)",
          color: active ? "#1A1408" : GOLD_DEEP,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "14px", fontWeight: 700, color: active ? GOLD_DEEP : INK_PRIMARY }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "12px", color: INK_MUTED, marginTop: "2px" }}>
          {sublabel}
        </span>
      </span>
    </button>
  );
}

// ----------------------------------------------------------------------------
// SVG Mandala Helpers
// ----------------------------------------------------------------------------
function describeArc(x: number, y: number, r: number, startAngle: number, endAngle: number) {
  // SVG arcs: zero is straight up, we want to start from top and go clockwise.
  // Actually standard astro wheels often put Aries at the top or East. Let's put Aries at 0 deg (top).
  const start = polarToCartesian(x, y, r, endAngle);
  const end = polarToCartesian(x, y, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
    "L", x, y,
    "Z"
  ].join(" ");
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function MapperView({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeNakId, setActiveNakId] = useState<number>(4); // Default Rohini

  const activeNak = NAKSHATRAS.find(n => n.id === activeNakId)!;
  const mod3 = activeNakId % 3;
  const startSignId = mod3 === 1 ? 0 : mod3 === 2 ? 4 : 8;

  // Real vargottama requires exact rashi calculation. For the structural lesson, 
  // we know the parent Nakshatra's primary sign from data.ts
  const parentRashiId = activeNak.startRashiId; // Note: startRashiId in data.ts was roughly set to the starting rashi of Pada 1, which works for this structural level

  const activePadas = [
    { pada: 1, signId: startSignId % 12 },
    { pada: 2, signId: (startSignId + 1) % 12 },
    { pada: 3, signId: (startSignId + 2) % 12 },
    { pada: 4, signId: (startSignId + 3) % 12 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* Left: Nakshatra Selector Panel */}
      <div style={{ flex: "0 0 240px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <h3 style={{ margin: 0, fontFamily: "var(--font-cormorant)", fontSize: "20px", color: GOLD_DEEP, fontWeight: 600 }}>
          Select Nakṣatra
        </h3>
        
        <div style={{ 
          display: "flex", flexDirection: "column", gap: "4px", 
          maxHeight: "480px", overflowY: "auto", 
          paddingRight: "8px",
          scrollbarWidth: "thin",
          scrollbarColor: `${GOLD_LIGHT} transparent`
        }}>
          {NAKSHATRAS.map(n => {
            const isActive = n.id === activeNakId;
            return (
              <button
                key={n.id}
                onClick={() => setActiveNakId(n.id)}
                style={{
                  textAlign: "left",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  background: isActive ? `linear-gradient(90deg, ${GOLD_LIGHT}40, transparent)` : "transparent",
                  borderLeft: isActive ? `3px solid ${GOLD}` : "3px solid transparent",
                  color: isActive ? GOLD_DEEP : INK_SECONDARY,
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  transition: reducedMotion ? "none" : "all 0.2s ease"
                }}
              >
                {n.id}. {n.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Right: The Circular Mandala */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
        
        {/* Dynamic Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNakId}
            initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              width: "100%",
              padding: "16px 20px",
              background: "rgba(255, 251, 240, 0.8)",
              border: `1px solid ${GOLD_LIGHT}`,
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(156, 122, 47, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: "16px"
            }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: INK_MUTED, fontWeight: 700 }}>
                N = {activeNak.id} • Mod 3 = {mod3}
              </div>
              <div style={{ fontSize: "20px", fontFamily: "var(--font-cormorant)", color: INK_PRIMARY, fontWeight: 600 }}>
                {activeNak.name} starts at <span style={{ color: GOLD_DEEP }}>{ZODIAC_SIGNS[startSignId]}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* The SVG Mandala */}
        <div style={{ width: "400px", height: "400px", position: "relative" }}>
          <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ overflow: "visible" }}>
            <defs>
              <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-vargottama" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="1.5" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="grad-active" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity="0.9" />
                <stop offset="100%" stopColor={GOLD} stopOpacity="0.7" />
              </radialGradient>
              <radialGradient id="grad-vargottama" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF2D6" stopOpacity="1" />
                <stop offset="50%" stopColor={GOLD_LIGHT} stopOpacity="0.9" />
                <stop offset="100%" stopColor={GOLD} stopOpacity="0.8" />
              </radialGradient>
            </defs>

            {/* Inner Ring (Background) */}
            <circle cx="200" cy="200" r="150" fill="rgba(255, 251, 240, 0.4)" stroke={GOLD_LIGHT} strokeWidth="2" strokeOpacity="0.5" />

            {/* Render 12 Wedges */}
            {ZODIAC_SIGNS.map((sign, i) => {
              const angleSize = 360 / 12; // 30 degrees
              const startAngle = i * angleSize;
              const endAngle = (i + 1) * angleSize;
              const midAngle = startAngle + (angleSize / 2);
              const isFireSign = i === 0 || i === 4 || i === 8;

              const activePadaData = activePadas.find(p => p.signId === i);
              const isActive = !!activePadaData;
              const isVargottama = isActive && activePadaData.signId === parentRashiId; // rough logic for structural lesson

              // Text positioning
              const textPos = polarToCartesian(200, 200, 115, midAngle);
              const padaPos = polarToCartesian(200, 200, 175, midAngle); // Orbiting orb

              return (
                <g key={sign}>
                  {/* The Wedge */}
                  <path
                    d={describeArc(200, 200, 150, startAngle, endAngle)}
                    fill={isVargottama ? "url(#grad-vargottama)" : isActive ? "url(#grad-active)" : isFireSign ? "rgba(162, 58, 30, 0.05)" : "transparent"}
                    stroke={isActive ? GOLD_DEEP : "rgba(156, 122, 47, 0.2)"}
                    strokeWidth={isActive ? "2" : "1"}
                    style={{ transition: "all 0.4s ease" }}
                  />

                  {/* Fire Sign Marker */}
                  {isFireSign && !isActive && (
                    <circle cx={polarToCartesian(200, 200, 140, startAngle).x} cy={polarToCartesian(200, 200, 140, startAngle).y} r="3" fill={VERMILION} />
                  )}

                  {/* Zodiac Sign Label */}
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill={isActive ? "#1A1408" : INK_MUTED}
                    fontSize="11"
                    fontWeight={isActive ? "700" : "600"}
                    letterSpacing="0.05em"
                    transform={`rotate(${midAngle + 90}, ${textPos.x}, ${textPos.y})`}
                    style={{ transition: "all 0.4s ease" }}
                  >
                    {sign.substring(0, 3).toUpperCase()}
                  </text>

                  {/* Floating Pada Orb */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.g
                        initial={reducedMotion ? undefined : { scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={reducedMotion ? undefined : { scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <circle
                          cx={padaPos.x}
                          cy={padaPos.y}
                          r="16"
                          fill={isVargottama ? "#FFF" : GOLD_DEEP}
                          filter={isVargottama ? "url(#glow-vargottama)" : "url(#glow-gold)"}
                        />
                        <text
                          x={padaPos.x}
                          y={padaPos.y}
                          textAnchor="middle"
                          alignmentBaseline="central"
                          fill={isVargottama ? GOLD_DEEP : "#FFF"}
                          fontSize="13"
                          fontWeight="800"
                          fontFamily="var(--font-cormorant)"
                        >
                          P{activePadaData.pada}
                        </text>
                      </motion.g>
                    )}
                  </AnimatePresence>
                </g>
              );
            })}

            {/* Center Hub */}
            <circle cx="200" cy="200" r="45" fill="rgba(255, 251, 240, 0.9)" stroke={GOLD_LIGHT} strokeWidth="2" />
            <text x="200" y="195" textAnchor="middle" fill={GOLD_DEEP} fontSize="11" fontWeight="700" letterSpacing="0.1em">NAVĀṀŚA</text>
            <text x="200" y="210" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600" letterSpacing="0.05em">D9</text>
          </svg>
        </div>

      </div>
    </div>
  );
}

// ... DrillView standard implementation
function DrillView({ reducedMotion }: { reducedMotion: boolean }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const scenario = DRILL_SCENARIOS[index];
  const isLast = index === DRILL_SCENARIOS.length - 1;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    if (!isLast) setIndex((i) => i + 1);
  };

  const selectedOption = scenario.options.find((o) => o.id === selected);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <p
          className="uppercase"
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            color: INDIGO,
            letterSpacing: "0.12em",
          }}
        >
          Scenario {index + 1} of {DRILL_SCENARIOS.length}
        </p>
        <div style={{ display: "flex", gap: "4px" }}>
          {DRILL_SCENARIOS.map((_, i) => (
            <span
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: i === index ? INDIGO : "rgba(79, 111, 168, 0.25)",
                transition: reducedMotion ? "none" : "background 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
              }}
            />
          ))}
        </div>
      </div>

      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "20px",
          fontWeight: 500,
          color: INK_PRIMARY,
          lineHeight: 1.4,
        }}
      >
        {scenario.question}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {scenario.options.map((opt) => {
          const isSelected = selected === opt.id;
          const showCorrect = submitted && opt.isCorrect;
          const showWrong = submitted && isSelected && !opt.isCorrect;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={submitted}
              onClick={() => !submitted && setSelected(opt.id)}
              className="gl-focus-ring gl-clickable"
              aria-pressed={isSelected}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: "8px",
                background: showCorrect
                  ? "rgba(58, 140, 90, 0.10)"
                  : showWrong
                  ? "rgba(162, 58, 30, 0.10)"
                  : isSelected
                  ? "rgba(79, 111, 168, 0.10)"
                  : "rgba(255, 252, 240, 0.55)",
                border: showCorrect
                  ? "1.5px solid #3A8C5A"
                  : showWrong
                  ? "1.5px solid #A23A1E"
                  : isSelected
                  ? `1.5px solid ${INDIGO}`
                  : "1px solid rgba(156, 122, 47, 0.20)",
                cursor: submitted ? "default" : "pointer",
                transition: reducedMotion
                  ? "none"
                  : "all 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: showCorrect
                    ? "#3A8C5A"
                    : showWrong
                    ? "#A23A1E"
                    : isSelected
                    ? INDIGO
                    : "rgba(156, 122, 47, 0.15)",
                  color: showCorrect || showWrong || isSelected ? "#FFF" : GOLD_DEEP,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginTop: "2px",
                }}
              >
                {showCorrect ? <Check size={14} /> : showWrong ? <X size={14} /> : opt.id}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "15px",
                    color: INK_PRIMARY,
                    lineHeight: 1.45,
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {opt.label}
                </span>
                {submitted && (
                  <span
                    style={{
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "14px",
                      color: opt.isCorrect ? JADE : showWrong ? VERMILION : INK_MUTED,
                      lineHeight: 1.5,
                      marginTop: "4px",
                    }}
                  >
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
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selected}
            className="gl-focus-ring gl-clickable"
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              background: selected ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.15)",
              color: selected ? "#1A1408" : GOLD_DEEP,
              border: "none",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              cursor: selected ? "pointer" : "not-allowed",
              transition: reducedMotion
                ? "none"
                : "all 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
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
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
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
