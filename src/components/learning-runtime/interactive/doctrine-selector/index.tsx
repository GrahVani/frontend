"use client";
 
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Layers, CheckCircle, AlertCircle, Info, Award, HelpCircle } from "lucide-react";

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  recommended: string;
  color: string;
  bgLight: string;
  borderLight: string;
  modulePath: string;
  source: string;
  rationale: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "natal",
    title: "Core Natal Promise",
    description: "Analyzing lifelong patterns, character traits, health, wealth, and general yogas.",
    icon: "🪐",
    recommended: "Parāśari Graha-Dṛṣṭi",
    color: "#be123c", // Crimson
    bgLight: "rgba(190, 18, 60, 0.05)",
    borderLight: "rgba(190, 18, 60, 0.2)",
    modulePath: "Module 08 (Aspects) & General Natal Reading",
    source: "Bṛhat Pārāśara Horā Śāstra (BPHS)",
    rationale: "Parāśari graha-dṛṣṭi operates at the planet-to-house level using whole-sign house counts. It is the universal workhorse for natal horoscope promise."
  },
  {
    id: "jaimini",
    title: "Jaimini Analysis",
    description: "Evaluating spouse indicators (Dārakāraka), soul purpose (Atmakāraka), Ārūḍhas, and Jaimini daśā timing.",
    icon: "🧭",
    recommended: "Jaimini Rāśi-Dṛṣṭi",
    color: "#4338ca", // Indigo
    bgLight: "rgba(67, 56, 202, 0.05)",
    borderLight: "rgba(67, 56, 202, 0.2)",
    modulePath: "Module 17 (Jaimini Stream Overview)",
    source: "Jaimini Sūtras",
    rationale: "Jaimini rāśi-dṛṣṭi operates sign-to-sign based on sign modalities (movable, fixed, dual). Using sign-level aspects keeps the Jaimini stream internally consistent."
  },
  {
    id: "annual",
    title: "Annual Chart / Year Timing",
    description: "Timing specific events within the current year of life using Varṣaphala and Munthā.",
    icon: "📅",
    recommended: "Tājika Orb-Dṛṣṭi",
    color: "#9C7A2F", // Gold
    bgLight: "rgba(156, 122, 47, 0.05)",
    borderLight: "rgba(156, 122, 47, 0.2)",
    modulePath: "Module 19 (Tājika Stream & Varṣaphala)",
    source: "Tājika Nīlakaṇṭhī",
    rationale: "Tājika uses exact degree-based orbs (dīptāṁśa) to determine applying (Itthāśāla) and separating (Iśrāf) aspects. This dynamic motion is optimized for year-level precision."
  },
  {
    id: "synthesis",
    title: "Cross-Verification Synthesis",
    description: "Reconciling a highly important chart judgment (e.g. marriage timing or career transition) by looking at multiple streams.",
    icon: "🧬",
    recommended: "Multi-Stream Convergence (All Three)",
    color: "#0f766e", // Teal
    bgLight: "rgba(15, 118, 110, 0.05)",
    borderLight: "rgba(15, 118, 110, 0.2)",
    modulePath: "Module 08 Chapter 4 & Tier 2 Module 13 (Synthesis Protocol)",
    source: "Synthesis of BPHS, Jaimini Sūtras, and Tājika Nīlakaṇṭhī",
    rationale: "Running multiple aspect doctrines side-by-side allows the practitioner to find convergence (agreement) to boost reading confidence, or explain divergence."
  }
];

export function DoctrineSelector() {
  const [selectedId, setSelectedId] = useState<string>("natal");
  
  // Toggles for the convergence drill in Cross-Verification scenario
  const [parashariActive, setParashariActive] = useState<boolean>(true);
  const [jaiminiActive, setJaiminiActive] = useState<boolean>(true);
  const [tajikaActive, setTajikaActive] = useState<boolean>(false);

  const activeScenario = useMemo(() => {
    return SCENARIOS.find(s => s.id === selectedId) ?? SCENARIOS[0];
  }, [selectedId]);

  // Compute confidence level for synthesis
  const activeCount = useMemo(() => {
    let count = 0;
    if (parashariActive) count++;
    if (jaiminiActive) count++;
    if (tajikaActive) count++;
    return count;
  }, [parashariActive, jaiminiActive, tajikaActive]);

  const synthesisResult = useMemo(() => {
    if (activeCount === 3) {
      return {
        level: "High Confidence (Full Convergence)",
        color: "#15803d",
        bg: "rgba(22, 163, 74, 0.08)",
        border: "rgba(22, 163, 74, 0.3)",
        text: "Excellent indicator! When all three systems agree that an aspect link is active, the prediction has maximum robustness. Report this alignment confidently.",
        icon: <Award size={18} />
      };
    }
    if (activeCount === 2) {
      return {
        level: "Moderate Confidence (Partial Convergence)",
        color: "#9C7A2F",
        bg: "rgba(156, 122, 47, 0.08)",
        border: "rgba(156, 122, 47, 0.3)",
        text: "Good confirmation. Two streams agree, but one diverges. Write a layered synthesis statement: name the two agreeing streams as the core finding and disclose the divergent one honestly.",
        icon: <CheckCircle size={18} />
      };
    }
    if (activeCount === 1) {
      return {
        level: "Low Confidence (Divergent reading)",
        color: "#b91c1c",
        bg: "rgba(220, 38, 38, 0.08)",
        border: "rgba(220, 38, 38, 0.3)",
        text: "No convergence. An aspect link is active under only one doctrine. You must specify which stream is reporting the link and highlight that the other two lenses show no connection.",
        icon: <AlertCircle size={18} />
      };
    }
    return {
      level: "No connection",
      color: "#6b7280",
      bg: "rgba(107, 114, 128, 0.08)",
      border: "rgba(107, 114, 128, 0.3)",
      text: "All doctrines agree that no aspect link is present. This is a convergent 'quiet' state.",
      icon: <HelpCircle size={18} />
    };
  }, [activeCount]);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(255, 253, 246, 0.7)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.05)",
        fontFamily: "'Inter', sans-serif",
        color: "var(--gl-ink-on-cream-primary)",
        maxWidth: "860px",
        margin: "0 auto"
      }}
    >
      <div style={{ borderBottom: "1px solid rgba(156,122,47,0.12)", paddingBottom: "12px", marginBottom: "18px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--gl-gold-accent-deep, #7A5E1E)", display: "flex", alignItems: "center", gap: "6px" }}>
          <Layers size={18} /> Aspect Doctrine Selector
        </h3>
        <span style={{ fontSize: "11.5px", color: "var(--gl-ink-on-cream-secondary)" }}>Interactive decision tool matching your query type to the correct aspect method</span>
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Left column: Cards list */}
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--gl-ink-on-cream-secondary)", marginBottom: "4px", display: "block" }}>
            Choose an Astrological Scenario:
          </label>
          
          {SCENARIOS.map((scenario) => {
            const isSelected = selectedId === scenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setSelectedId(scenario.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px",
                  borderRadius: "8px",
                  border: isSelected ? `2px solid ${scenario.color}` : "2px solid rgba(156, 122, 47, 0.1)",
                  background: isSelected ? scenario.bgLight : "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center"
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.border = `2px solid ${scenario.color}80`;
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.border = "2px solid rgba(156, 122, 47, 0.1)";
                  }
                }}
              >
                <span style={{ fontSize: "24px" }}>{scenario.icon}</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: isSelected ? scenario.color : "inherit" }}>
                    {scenario.title}
                  </h4>
                  <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "var(--gl-ink-on-cream-muted)", lineHeight: 1.4 }}>
                    {scenario.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right column: Recommendation Details */}
        <div style={{ flex: "1 1 380px", display: "flex" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "10px",
                border: `1px solid ${activeScenario.borderLight}`,
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.02)"
              }}
            >
              {/* Header */}
              <div>
                <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--gl-ink-on-cream-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Recommended Doctrine
                </span>
                <h3 style={{ margin: "2px 0 0 0", fontSize: "18px", fontWeight: 800, color: activeScenario.color }}>
                  {activeScenario.recommended}
                </h3>
              </div>

              {/* Rationale and Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px" }}>
                  <BookOpen size={14} color="var(--gl-ink-on-cream-muted)" />
                  <strong>Classical Source:</strong> <span style={{ fontFamily: "serif", fontStyle: "italic" }}>{activeScenario.source}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px" }}>
                  <Layers size={14} color="var(--gl-ink-on-cream-muted)" />
                  <strong>Curriculum Home:</strong> <span>{activeScenario.modulePath}</span>
                </div>
              </div>

              {/* Rationale Box */}
              <div style={{ background: activeScenario.bgLight, padding: "12px", borderRadius: "6px", borderLeft: `3px solid ${activeScenario.color}` }}>
                <h5 style={{ margin: "0 0 4px 0", fontSize: "11px", fontWeight: 700, color: activeScenario.color, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Info size={12} /> Technical Rationale
                </h5>
                <p style={{ margin: 0, fontSize: "11px", lineHeight: 1.45, color: "var(--gl-ink-on-cream-secondary)" }}>
                  {activeScenario.rationale}
                </p>
              </div>

              {/* Special interactive tool for synthesis tab */}
              {selectedId === "synthesis" && (
                <div style={{ borderTop: "1px solid rgba(15, 118, 110, 0.15)", paddingTop: "12px", marginTop: "4px" }}>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#0f766e", display: "block", marginBottom: "8px" }}>
                    Interactive Convergence Drill:
                  </label>
                  <span style={{ fontSize: "10.5px", color: "var(--gl-ink-on-cream-muted)", display: "block", marginBottom: "8px", lineHeight: 1.3 }}>
                    Toggle which aspect doctrines agree on a placement to calculate predicted reading confidence.
                  </span>
                  
                  {/* Toggles */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <button
                      type="button"
                      onClick={() => setParashariActive(!parashariActive)}
                      style={{
                        flex: 1,
                        padding: "6px 4px",
                        fontSize: "10.5px",
                        fontWeight: 600,
                        background: parashariActive ? "rgba(190, 18, 60, 0.1)" : "#ffffff",
                        border: parashariActive ? "1px solid rgba(190, 18, 60, 0.3)" : "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: parashariActive ? "#be123c" : "#6b7280"
                      }}
                    >
                      Parāśari
                    </button>
                    <button
                      type="button"
                      onClick={() => setJaiminiActive(!jaiminiActive)}
                      style={{
                        flex: 1,
                        padding: "6px 4px",
                        fontSize: "10.5px",
                        fontWeight: 600,
                        background: jaiminiActive ? "rgba(67, 56, 202, 0.1)" : "#ffffff",
                        border: jaiminiActive ? "1px solid rgba(67, 56, 202, 0.3)" : "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: jaiminiActive ? "#4338ca" : "#6b7280"
                      }}
                    >
                      Jaimini
                    </button>
                    <button
                      type="button"
                      onClick={() => setTajikaActive(!tajikaActive)}
                      style={{
                        flex: 1,
                        padding: "6px 4px",
                        fontSize: "10.5px",
                        fontWeight: 600,
                        background: tajikaActive ? "rgba(156, 122, 47, 0.1)" : "#ffffff",
                        border: tajikaActive ? "1px solid rgba(156, 122, 47, 0.3)" : "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: tajikaActive ? "#9C7A2F" : "#6b7280"
                      }}
                    >
                      Tājika
                    </button>
                  </div>

                  {/* Convergence status indicator */}
                  <div
                    style={{
                      background: synthesisResult.bg,
                      border: `1px solid ${synthesisResult.border}`,
                      borderRadius: "6px",
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: synthesisResult.color, fontSize: "11.5px", fontWeight: 700 }}>
                      {synthesisResult.icon}
                      {synthesisResult.level}
                    </div>
                    <p style={{ margin: 0, fontSize: "10.5px", color: "var(--gl-ink-on-cream-secondary)", lineHeight: 1.4 }}>
                      {synthesisResult.text}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
