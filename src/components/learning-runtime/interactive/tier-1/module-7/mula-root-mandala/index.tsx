"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Check, X, ArrowRight } from "lucide-react";
import { NODES, DRILL_SCENARIOS } from "./data";

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

export function MulaRootMandala() {
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
      data-interactive="mula-root-mandala"
    >
      <div role="tablist" aria-label="Synthesis modes" style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
        <TabButton
          active={tab === "diagram"}
          onClick={() => setTab("diagram")}
          label="Interactive Mandala"
          sublabel="Spiritual/cultural significance"
          icon={<Sparkles size={14} />}
        />
        <TabButton
          active={tab === "drill"}
          onClick={() => setTab("drill")}
          label="Nirṛti Drill"
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
  const [activeNode, setActiveNode] = useState<string>(NODES[0].id);
  const RADIUS = 140;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6 items-stretch">
      <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", minHeight: "480px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "440px", margin: "0 auto", aspectRatio: "1/1" }}>
          <svg width="100%" height="100%" viewBox="-200 -200 400 400" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="activeHubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={GOLD} />
                <stop offset="100%" stopColor={GOLD_DEEP} />
              </linearGradient>
              <linearGradient id="inactiveHubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9F0" />
                <stop offset="100%" stopColor="#FAEFD8" />
              </linearGradient>
            </defs>

            <circle cx="0" cy="0" r={RADIUS} fill="none" stroke={GOLD_LIGHT} strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="0" cy="0" r={RADIUS * 0.5} fill="none" stroke={GOLD_LIGHT} strokeWidth="1" strokeDasharray="2 6" />
            
            {NODES.filter(n => !n.isCenter).map((node) => {
              const rad = ((node.angleDeg || 0) * Math.PI) / 180;
              const x = Math.cos(rad) * RADIUS;
              const y = Math.sin(rad) * RADIUS;
              const isActive = activeNode === node.id;
              
              return (
                <g key={node.id}>
                  <motion.line
                    x1="0" y1="0" x2={x} y2={y}
                    stroke={isActive ? GOLD : GOLD_LIGHT}
                    strokeWidth={isActive ? 2 : 1}
                    animate={reducedMotion ? {} : { strokeOpacity: isActive ? 1 : 0.4 }}
                  />
                  <g 
                    transform={`translate(${x}, ${y})`}
                    onClick={() => setActiveNode(node.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <motion.circle 
                      cx="0" cy="0" r="30"
                      fill={isActive ? GOLD : "#FFF9F0"}
                      stroke={GOLD}
                      strokeWidth="2"
                      whileHover={reducedMotion ? {} : { scale: 1.05 }}
                    />
                    <text
                      textAnchor="middle" dy="4"
                      fontSize="14" fontWeight={isActive ? 600 : 500}
                      fill={isActive ? "#FFF" : GOLD_DEEP}
                      pointerEvents="none"
                    >
                      {node.devanagari}
                    </text>
                    
                    {/* Shift text slightly away from the center to prevent overlap */}
                    <text
                      textAnchor="middle" dy={node.angleDeg && node.angleDeg > 0 ? "46" : "-42"}
                      fontSize="12" fontWeight={700}
                      fill={GOLD_DEEP}
                      pointerEvents="none"
                      style={{ textShadow: "0 2px 4px rgba(255,255,255,0.8)" }}
                    >
                      {node.iast}
                    </text>
                  </g>
                </g>
              );
            })}

            {NODES.filter(n => n.isCenter).map((node) => {
               const isActive = activeNode === node.id;

               return (
                <g 
                  key={node.id}
                  transform="translate(0, 0)"
                  onClick={() => setActiveNode(node.id)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Concentric outer rings */}
                  <circle cx="0" cy="0" r="54" fill="none" stroke={isActive ? GOLD : "rgba(156, 122, 47, 0.2)"} strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="0" cy="0" r="48" fill="none" stroke={isActive ? GOLD_LIGHT : "rgba(156, 122, 47, 0.4)"} strokeWidth="1.5" />
                  
                  {/* Core hub */}
                  <motion.circle 
                    cx="0" cy="0" r="42" 
                    fill={isActive ? "url(#activeHubGrad)" : "url(#inactiveHubGrad)"} 
                    stroke={GOLD_DEEP} 
                    strokeWidth="2.5" 
                    whileHover={reducedMotion ? {} : { scale: 1.05 }}
                  />

                  {/* Inner details / spokes */}
                  <circle cx="0" cy="0" r="32" fill="none" stroke={isActive ? "rgba(255, 255, 255, 0.3)" : "rgba(156, 122, 47, 0.2)"} strokeWidth="1" />
                  {Array.from({ length: 8 }).map((_, i) => {
                    const spokeRad = (i * 45 * Math.PI) / 180;
                    const sx1 = Math.cos(spokeRad) * 8;
                    const sy1 = Math.sin(spokeRad) * 8;
                    const sx2 = Math.cos(spokeRad) * 32;
                    const sy2 = Math.sin(spokeRad) * 32;
                    return (
                      <line 
                        key={i} 
                        x1={sx1} y1={sy1} x2={sx2} y2={sy2} 
                        stroke={isActive ? "rgba(255, 255, 255, 0.35)" : "rgba(156, 122, 47, 0.25)"} 
                        strokeWidth="1" 
                      />
                    );
                  })}
                  
                  <text textAnchor="middle" dy="-2" fontSize="15" fontWeight="bold" fill={isActive ? "#FFF" : GOLD_DEEP} pointerEvents="none">
                    {node.devanagari}
                  </text>
                  <text textAnchor="middle" dy="16" fontSize="11" fill={isActive ? "rgba(255,255,255,0.9)" : INK_SECONDARY} pointerEvents="none">
                    {node.iast}
                  </text>
                </g>
               )
            })}
          </svg>
        </div>

        {/* Interactive Legend Box explaining components */}
        <div 
          style={{ 
            marginTop: "16px", 
            padding: "14px 16px", 
            background: "rgba(255, 251, 240, 0.6)", 
            border: "1px solid rgba(156, 122, 47, 0.2)", 
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <h4 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Maṇḍala Legend & Interactive Navigation
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: INK_SECONDARY, lineHeight: 1.4 }}>
            Click on any circle in the mandala diagram or select a role below to analyze its energetic relation to the Mūla (Root) core:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }} className="grid grid-cols-1 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setActiveNode("mula")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 10px",
                borderRadius: "6px",
                background: activeNode === "mula" ? "rgba(156, 122, 47, 0.12)" : "transparent",
                border: activeNode === "mula" ? `1px solid ${GOLD}` : "1px solid transparent",
                cursor: "pointer",
                textAlign: "left"
              }}
              className="gl-clickable"
            >
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`, border: `1px solid ${GOLD_DEEP}`, display: "inline-block" }} />
              <span style={{ fontSize: "13px", fontWeight: activeNode === "mula" ? 700 : 500, color: INK_PRIMARY }}>
                <strong>Center:</strong> Mūla Nakshatra Core
              </span>
            </button>
            
            <button
              type="button"
              onClick={() => setActiveNode("sagittarius")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 10px",
                borderRadius: "6px",
                background: activeNode === "sagittarius" ? "rgba(156, 122, 47, 0.12)" : "transparent",
                border: activeNode === "sagittarius" ? `1px solid ${GOLD}` : "1px solid transparent",
                cursor: "pointer",
                textAlign: "left"
              }}
              className="gl-clickable"
            >
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FFF9F0", border: `2px solid ${GOLD}`, display: "inline-block" }} />
              <span style={{ fontSize: "13px", fontWeight: activeNode === "sagittarius" ? 700 : 500, color: INK_PRIMARY }}>
                <strong>Top-Left:</strong> Dhanus (Rashi/Sign)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNode("nirriti")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 10px",
                borderRadius: "6px",
                background: activeNode === "nirriti" ? "rgba(156, 122, 47, 0.12)" : "transparent",
                border: activeNode === "nirriti" ? `1px solid ${GOLD}` : "1px solid transparent",
                cursor: "pointer",
                textAlign: "left"
              }}
              className="gl-clickable"
            >
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FFF9F0", border: `2px solid ${GOLD}`, display: "inline-block" }} />
              <span style={{ fontSize: "13px", fontWeight: activeNode === "nirriti" ? 700 : 500, color: INK_PRIMARY }}>
                <strong>Top-Right:</strong> Nirṛti (Presiding Deity)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNode("roots")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 10px",
                borderRadius: "6px",
                background: activeNode === "roots" ? "rgba(156, 122, 47, 0.12)" : "transparent",
                border: activeNode === "roots" ? `1px solid ${GOLD}` : "1px solid transparent",
                cursor: "pointer",
                textAlign: "left"
              }}
              className="gl-clickable"
            >
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FFF9F0", border: `2px solid ${GOLD}`, display: "inline-block" }} />
              <span style={{ fontSize: "13px", fontWeight: activeNode === "roots" ? 700 : 500, color: INK_PRIMARY }}>
                <strong>Bottom-Left:</strong> Tied Roots (Symbol)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNode("ketu")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 10px",
                borderRadius: "6px",
                background: activeNode === "ketu" ? "rgba(156, 122, 47, 0.12)" : "transparent",
                border: activeNode === "ketu" ? `1px solid ${GOLD}` : "1px solid transparent",
                cursor: "pointer",
                textAlign: "left"
              }}
              className="gl-clickable"
            >
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FFF9F0", border: `2px solid ${GOLD}`, display: "inline-block" }} />
              <span style={{ fontSize: "13px", fontWeight: activeNode === "ketu" ? 700 : 500, color: INK_PRIMARY }}>
                <strong>Bottom-Right:</strong> Ketu (Planetary Lord)
              </span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, justifyContent: "center", flexDirection: "column" }}>
        {NODES.filter(n => n.id === activeNode).map(node => (
          <motion.div
            key={node.id}
            initial={reducedMotion ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              padding: "28px 32px",
              background: "linear-gradient(145deg, rgba(255, 251, 240, 0.8) 0%, rgba(252, 240, 210, 0.4) 100%)",
              border: `1px solid ${GOLD_LIGHT}`,
              borderRadius: "16px",
              boxShadow: "0 8px 32px -8px rgba(156, 122, 47, 0.15)",
              backdropFilter: "blur(12px)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: `linear-gradient(to bottom, ${GOLD_LIGHT}, ${GOLD})` }} />
            
            <h4 style={{ margin: "0 0 6px 0", fontFamily: "var(--font-sans)", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD_DEEP, fontWeight: 700 }}>
              {node.interlockBrief}
            </h4>
            <h3 style={{ margin: "0 0 20px 0", fontFamily: "var(--font-cormorant)", fontSize: "32px", fontWeight: 600, color: INK_PRIMARY, lineHeight: 1.1 }}>
              {node.interlockLabel} <span style={{ color: GOLD_LIGHT, fontWeight: 300 }}>({node.iast})</span>
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <h5 style={{ margin: "0 0 8px 0", fontFamily: "var(--font-sans)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: INDIGO, fontWeight: 600 }}>Core Concept</h5>
                <p style={{ margin: 0, fontSize: "16px", color: INK_SECONDARY, lineHeight: 1.6, fontWeight: 500 }}>
                  {node.coreConcept}
                </p>
              </div>

              <div>
                <h5 style={{ margin: "0 0 8px 0", fontFamily: "var(--font-sans)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: INDIGO, fontWeight: 600 }}>Cosmic Function</h5>
                <p style={{ margin: 0, fontSize: "16px", color: INK_SECONDARY, lineHeight: 1.6 }}>
                  {node.cosmicFunction}
                </p>
              </div>

              <div style={{ marginTop: "8px", paddingTop: "16px", borderTop: "1px dashed rgba(156, 122, 47, 0.2)" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {node.keyAttributes.map((attr, idx) => (
                    <motion.div
                      key={idx}
                      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      style={{
                        padding: "6px 12px",
                        background: "rgba(156, 122, 47, 0.08)",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: GOLD_DEEP,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Sparkles size={12} />
                      {attr}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

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
