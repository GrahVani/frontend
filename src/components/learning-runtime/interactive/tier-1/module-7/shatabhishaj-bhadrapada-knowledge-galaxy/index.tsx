"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, BookOpen, Check, X, ArrowRight, 
  Leaf, Shield, Lock, Activity, Waves, 
  Flame, Zap, Eye, RefreshCw, Heart, Target,
  Layers, Feather, Droplet, Sun, Clock
} from "lucide-react";
import { NODES, DRILL_SCENARIOS, NodeData } from "./data";

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
type SystemType = "shatabhishaj" | "purva" | "uttara";

const ICON_MAP: Record<string, React.ReactNode> = {
  "Leaf": <Leaf size={18} strokeWidth={2.5} />,
  "Shield": <Shield size={18} strokeWidth={2.5} />,
  "Lock": <Lock size={18} strokeWidth={2.5} />,
  "Activity": <Activity size={18} strokeWidth={2.5} />,
  "Waves": <Waves size={18} strokeWidth={2.5} />,
  "Sparkles": <Sparkles size={18} strokeWidth={2.5} />,
  "Flame": <Flame size={18} strokeWidth={2.5} />,
  "Zap": <Zap size={18} strokeWidth={2.5} />,
  "Eye": <Eye size={18} strokeWidth={2.5} />,
  "RefreshCw": <RefreshCw size={18} strokeWidth={2.5} />,
  "Heart": <Heart size={18} strokeWidth={2.5} />,
  "Target": <Target size={18} strokeWidth={2.5} />,
  "BookOpen": <BookOpen size={18} strokeWidth={2.5} />,
  "Layers": <Layers size={18} strokeWidth={2.5} />,
  "Feather": <Feather size={18} strokeWidth={2.5} />,
  "Droplet": <Droplet size={18} strokeWidth={2.5} />,
  "Sun": <Sun size={18} strokeWidth={2.5} />,
  "Clock": <Clock size={18} strokeWidth={2.5} />,
};

const ICON_COLORS: Record<string, string> = {
  "Leaf": "#3A8C5A", // Green
  "Shield": "#4F6FA8", // Blue
  "Lock": "#8A4A9B", // Purple
  "Activity": "#D97A2E", // Orange
  "Waves": "#2A8C9F", // Teal
  "Sparkles": "#9C7A2F", // Gold
  "Flame": "#C44A29", // Red/Orange
  "Zap": "#D9B02E", // Yellow
  "Eye": "#4F6FA8", // Blue
  "RefreshCw": "#3A8C5A", // Green
  "Heart": "#B83A4A", // Pink/Red
  "Target": "#8A4A9B", // Purple
  "BookOpen": "#2A8C9F", // Teal
  "Layers": "#4F6FA8", // Blue
  "Feather": "#8A4A9B", // Purple
  "Droplet": "#2A8C9F", // Teal
  "Sun": "#D9B02E", // Yellow
  "Clock": "#D97A2E", // Orange
};

export function ShatabhishajBhadrapadaKnowledgeGalaxy() {
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
      data-interactive="shatabhishaj-bhadrapada-knowledge-galaxy"
    >
      <div role="tablist" aria-label="Synthesis modes" style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
        <TabButton
          active={tab === "diagram"}
          onClick={() => setTab("diagram")}
          label="Interactive Mandala"
          sublabel="High-fidelity 6-axis layout"
          icon={<Sparkles size={14} />}
        />
        <TabButton
          active={tab === "drill"}
          onClick={() => setTab("drill")}
          label="Penance Drill"
          sublabel="3 evaluation scenarios"
          icon={<BookOpen size={14} />}
        />
      </div>

      {tab === "diagram" ? (
        <DiagramView reducedMotion={reducedMotion} />
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

function DiagramView({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeSystem, setActiveSystem] = useState<SystemType>("shatabhishaj");
  const systemNodes = NODES.filter(n => n.system === activeSystem);
  const centerNode = systemNodes.find(n => n.isCenter);
  const [activeNode, setActiveNode] = useState<string>(centerNode?.id || "");
  
  // Update active node when system changes
  useEffect(() => {
    const center = NODES.find(n => n.system === activeSystem && n.isCenter);
    if (center) setActiveNode(center.id);
  }, [activeSystem]);

  const RADIUS = 180; // Tighter radius to make nodes appear larger

  return (
    <div className="flex flex-col gap-6">
      {/* System Toggle Header */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
        <SystemToggle active={activeSystem === "shatabhishaj"} onClick={() => setActiveSystem("shatabhishaj")} label="Śatabhiṣaj" />
        <SystemToggle active={activeSystem === "purva"} onClick={() => setActiveSystem("purva")} label="Pūrva Bhādrapadā" />
        <SystemToggle active={activeSystem === "uttara"} onClick={() => setActiveSystem("uttara")} label="Uttara Bhādrapadā" />
      </div>

      {/* Stacked Zero-Scroll Layout (Top/Bottom) */}
      <div className="flex flex-col gap-4 items-center" style={{ flex: 1, minHeight: 0 }}>
        
        {/* Top: The Massive Interactive Mandala */}
        <div style={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center", height: "420px", flexShrink: 0 }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "600px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSystem}
                initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <svg width="100%" height="100%" viewBox="-260 -260 520 520" style={{ overflow: "visible" }}>
                  <defs>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={GOLD} stopOpacity="0.8" />
                      <stop offset="70%" stopColor={GOLD} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="activeCenterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#A8863A" />
                      <stop offset="100%" stopColor="#8A651E" />
                    </linearGradient>
                    <filter id="softShadow">
                      <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor={GOLD_DEEP} floodOpacity="0.15" />
                    </filter>
                  </defs>

                  {/* 1. The Faint Geometric Lotus Background */}
                  <g opacity="0.15">
                    {[...Array(12)].map((_, i) => (
                      <ellipse 
                        key={i}
                        cx="0" cy="0" rx="140" ry="40"
                        fill="none" stroke={GOLD_DEEP} strokeWidth="1"
                        transform={`rotate(${i * 15})`}
                      />
                    ))}
                    {[...Array(8)].map((_, i) => (
                      <path
                        key={`petal-${i}`}
                        d="M 0 -80 C 40 -160, 80 -80, 0 0 C -80 -80, -40 -160, 0 -80"
                        fill="none" stroke={GOLD_DEEP} strokeWidth="1.5"
                        transform={`rotate(${i * 45})`}
                      />
                    ))}
                  </g>

                  {/* 2. The Orbital Rings */}
                  <circle cx="0" cy="0" r={RADIUS} fill="none" stroke={GOLD_LIGHT} strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
                  <circle cx="0" cy="0" r={RADIUS * 0.75} fill="none" stroke={GOLD_LIGHT} strokeWidth="0.5" strokeDasharray="2 8" opacity="0.4" />

                  {/* Connection Lines from Center to Outer Nodes */}
                  {systemNodes.filter(n => !n.isCenter).map(node => {
                    const rad = ((node.angleDeg || 0) * Math.PI) / 180;
                    return (
                      <line
                        key={`line-${node.id}`}
                        x1="0" y1="0"
                        x2={Math.cos(rad) * RADIUS}
                        y2={Math.sin(rad) * RADIUS}
                        stroke={GOLD_LIGHT}
                        strokeWidth="1"
                        strokeDasharray="2 4"
                        opacity="0.4"
                      />
                    );
                  })}

                  {/* Decorative Dots on the Orbital Ring */}
                  {systemNodes.filter(n => !n.isCenter).map(node => {
                    const rad = ((node.angleDeg || 0) * Math.PI) / 180;
                    const dotRad = rad + (30 * Math.PI) / 180; // Offset by 30 degrees
                    return (
                      <circle
                        key={`dot-${node.id}`}
                        cx={Math.cos(dotRad) * RADIUS}
                        cy={Math.sin(dotRad) * RADIUS}
                        r="3"
                        fill={GOLD_DEEP}
                        opacity="0.5"
                      />
                    );
                  })}

                  {/* 3. Outer Attribute Nodes */}
                  {systemNodes.filter(n => !n.isCenter).map((node) => {
                    const rad = ((node.angleDeg || 0) * Math.PI) / 180;
                    const x = Math.cos(rad) * RADIUS;
                    const y = Math.sin(rad) * RADIUS;
                    const isActive = activeNode === node.id;
                    const iconColor = node.iconName && ICON_COLORS[node.iconName] ? ICON_COLORS[node.iconName] : GOLD_DEEP;
                    
                    return (
                      <g 
                        key={node.id}
                        transform={`translate(${x}, ${y})`}
                        onClick={() => setActiveNode(node.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <motion.circle 
                          cx="0" cy="0" r="48"
                          fill={isActive ? "rgba(255, 251, 240, 1)" : "rgba(255, 251, 240, 0.85)"}
                          stroke={isActive ? iconColor : "rgba(156, 122, 47, 0.4)"}
                          strokeWidth={isActive ? "2.5" : "1.5"}
                          filter="url(#softShadow)"
                          whileHover={reducedMotion ? {} : { scale: 1.08 }}
                          transition={{ duration: 0.2 }}
                        />
                        {/* Icon Inside Circle Top */}
                        {node.iconName && ICON_MAP[node.iconName] && (
                          <g transform="translate(0, -18)">
                            <foreignObject x="-12" y="-12" width="24" height="24">
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', color: iconColor }}>
                                {ICON_MAP[node.iconName]}
                              </div>
                            </foreignObject>
                          </g>
                        )}
                        <text
                          textAnchor="middle" dy="8"
                          fontSize="15" fontWeight={700}
                          fill={GOLD_DEEP}
                          pointerEvents="none"
                        >
                          {node.devanagari}
                        </text>
                        <text
                          textAnchor="middle" dy="24"
                          fontSize="13" fontWeight={600}
                          fill={INK_SECONDARY}
                          pointerEvents="none"
                        >
                          {node.interlockLabel}
                        </text>
                      </g>
                    );
                  })}

                  {/* 4. The Center Node */}
                  {centerNode && (
                    <g 
                      transform="translate(0, 0)"
                      onClick={() => setActiveNode(centerNode.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <motion.circle 
                        cx="0" cy="0" r="100" fill="url(#centerGlow)"
                        animate={reducedMotion ? {} : { scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        pointerEvents="none"
                      />
                      <circle 
                        cx="0" cy="0" r="80" 
                        fill={activeNode === centerNode.id ? "url(#activeCenterGrad)" : GOLD} 
                        stroke={GOLD_LIGHT} strokeWidth="3" 
                        filter="url(#softShadow)"
                      />
                      <circle cx="0" cy="0" r="74" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                      <text textAnchor="middle" dy="-2" fontSize="28" fontWeight="bold" fill="#FFF" pointerEvents="none">
                        {centerNode.devanagari}
                      </text>
                      <text textAnchor="middle" dy="22" fontSize="15" fontWeight="500" fill="rgba(255,255,255,0.95)" pointerEvents="none">
                        {centerNode.iast}
                      </text>
                    </g>
                  )}
                </svg>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom: The Content Panel (Zero Scroll) */}
        <div style={{ display: "flex", width: "100%", maxWidth: "800px", flexDirection: "column", flex: 1, overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            {NODES.filter(n => n.id === activeNode).map(node => (
              <motion.div
                key={node.id}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  padding: "20px 28px",
                  background: "linear-gradient(145deg, rgba(255, 251, 240, 0.8) 0%, rgba(252, 240, 210, 0.4) 100%)",
                  border: `1px solid ${GOLD_LIGHT}`,
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px -8px rgba(156, 122, 47, 0.15)",
                  backdropFilter: "blur(12px)",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: `linear-gradient(to bottom, ${GOLD_LIGHT}, ${GOLD})` }} />
                
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {node.iconName && ICON_MAP[node.iconName] && (
                    <div style={{ 
                      width: "40px", height: "40px", borderRadius: "50%", 
                      background: "rgba(255,255,255,0.6)", 
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: ICON_COLORS[node.iconName] || GOLD_DEEP,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      flexShrink: 0
                    }}>
                      {ICON_MAP[node.iconName]}
                    </div>
                  )}
                  <div>
                    <h4 style={{ margin: "0 0 2px 0", fontFamily: "var(--font-sans)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD_DEEP, fontWeight: 700 }}>
                      {node.interlockBrief}
                    </h4>
                    <h3 style={{ margin: 0, fontFamily: "var(--font-cormorant)", fontSize: "24px", fontWeight: 600, color: INK_PRIMARY, lineHeight: 1.1 }}>
                      {node.interlockLabel} <span style={{ color: GOLD_LIGHT, fontWeight: 300 }}>({node.iast})</span>
                    </h3>
                  </div>
                </div>
                
                <div style={{ width: "100%", height: "1px", background: `linear-gradient(90deg, ${GOLD_LIGHT}, transparent)` }} />

                <p style={{ margin: 0, fontSize: "15px", color: INK_SECONDARY, lineHeight: 1.5, fontWeight: 500 }}>
                  {node.interlockDetail}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SystemToggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 20px",
        borderRadius: "30px",
        background: active ? GOLD : "rgba(255, 251, 240, 0.4)",
        color: active ? "#FFF" : GOLD_DEEP,
        border: active ? `1px solid ${GOLD}` : `1px solid rgba(156, 122, 47, 0.2)`,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        fontSize: "14px",
        fontWeight: active ? 700 : 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: active ? "0 4px 12px rgba(156, 122, 47, 0.2)" : "none"
      }}
    >
      {label}
    </button>
  );
}

// ... [DrillView implementation remains exactly the same as previously defined, truncating here for brevity but assuming DrillView is present in actual file. Wait, I must include DrillView so the file compiles!]

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
      {scenario.context && (
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "15px",
            color: INK_SECONDARY,
            lineHeight: 1.5,
          }}
        >
          {scenario.context}
        </p>
      )}

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
