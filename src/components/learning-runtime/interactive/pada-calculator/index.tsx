"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, BookOpen, Check, X, ArrowRight,
  Calculator, ChevronRight, Circle
} from "lucide-react";
import { DRILL_SCENARIOS } from "./data";

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

export function PadaCalculator() {
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
      data-interactive="pada-calculator"
    >
      <div role="tablist" aria-label="Synthesis modes" style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        <TabButton
          active={tab === "diagram"}
          onClick={() => setTab("diagram")}
          label="Precision Pada Dial"
          sublabel="Interactive calculation"
          icon={<Calculator size={14} />}
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
        <CalculatorView reducedMotion={reducedMotion} />
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

function CalculatorView({ reducedMotion }: { reducedMotion: boolean }) {
  // Value represents position in arc-minutes (0 to 800)
  const [minutes, setMinutes] = useState(250); // Default to somewhere in Pada 2
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const maxMinutes = 800; // 13°20'
  const percentage = (minutes / maxMinutes) * 100;

  // Math logic
  const padaIndex = Math.floor(minutes / 200);
  const padaNumber = padaIndex + 1;
  const rawDivision = (minutes / 200).toFixed(2);
  
  // formatting helper (e.g. 250' -> 4°10')
  const degrees = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  const handleMove = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let newX = clientX - rect.left;
    newX = Math.max(0, Math.min(newX, rect.width));
    const newPercentage = newX / rect.width;
    // Snap to integers for cleaner UX
    let newMins = Math.round(newPercentage * maxMinutes);
    // Hard cap at 800
    newMins = Math.min(maxMinutes, Math.max(0, newMins));
    setMinutes(newMins);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMove = (e: PointerEvent) => handleMove(e.clientX);
      const handleGlobalUp = () => setIsDragging(false);
      window.addEventListener("pointermove", handleGlobalMove);
      window.addEventListener("pointerup", handleGlobalUp);
      return () => {
        window.removeEventListener("pointermove", handleGlobalMove);
        window.removeEventListener("pointerup", handleGlobalUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="flex flex-col gap-8">
      {/* Top: The Interactive Slider Track */}
      <div 
        style={{ 
          padding: "48px 32px 64px 32px", 
          background: "linear-gradient(180deg, rgba(255, 251, 240, 0.4) 0%, rgba(255, 251, 240, 0.8) 100%)",
          borderRadius: "16px",
          border: `1px solid ${GOLD_LIGHT}`,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-cormorant)", fontSize: "28px", color: GOLD_DEEP, fontWeight: 600 }}>
            Position within Nakṣatra
          </h3>
          <p style={{ margin: "4px 0 0 0", fontFamily: "var(--font-sans)", fontSize: "15px", color: INK_SECONDARY }}>
            Drag the glowing orb to set the planet's longitude (0° to 13°20′)
          </p>
        </div>

        {/* The Track Container */}
        <div 
          ref={trackRef}
          onPointerDown={handlePointerDown}
          style={{ 
            height: "16px", 
            background: "rgba(156, 122, 47, 0.15)", 
            borderRadius: "8px",
            position: "relative",
            cursor: "pointer",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
            touchAction: "none"
          }}
        >
          {/* Track Fill */}
          <div 
            style={{ 
              position: "absolute", top: 0, left: 0, height: "100%", width: `${percentage}%`,
              background: `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD})`,
              borderRadius: "8px",
              boxShadow: `0 0 16px ${GOLD_LIGHT}80`,
              transition: isDragging ? "none" : "width 0.1s ease"
            }} 
          />

          {/* Pada Boundary Markers */}
          {[1, 2, 3].map(boundary => (
            <div 
              key={boundary}
              style={{
                position: "absolute",
                top: "-12px",
                bottom: "-12px",
                left: `${(boundary * 25)}%`,
                width: "2px",
                background: GOLD_DEEP,
                opacity: 0.6,
                zIndex: 10
              }}
            >
              <div style={{
                position: "absolute",
                top: "36px",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                color: GOLD_DEEP,
                fontWeight: 600,
                whiteSpace: "nowrap"
              }}>
                {boundary === 1 ? "3°20′" : boundary === 2 ? "6°40′" : "10°00′"}
              </div>
            </div>
          ))}

          {/* Start/End Markers */}
          <div style={{ position: "absolute", top: "36px", left: 0, transform: "translateX(-50%)", fontFamily: "var(--font-sans)", fontSize: "12px", color: INK_MUTED, fontWeight: 600 }}>
            0°00′
          </div>
          <div style={{ position: "absolute", top: "36px", right: 0, transform: "translateX(50%)", fontFamily: "var(--font-sans)", fontSize: "12px", color: INK_MUTED, fontWeight: 600 }}>
            13°20′
          </div>

          {/* Draggable Thumb */}
          <div 
            style={{
              position: "absolute",
              top: "50%",
              left: `${percentage}%`,
              transform: "translate(-50%, -50%)",
              width: "32px",
              height: "32px",
              background: "#FFF",
              borderRadius: "50%",
              border: `3px solid ${GOLD}`,
              boxShadow: `0 4px 12px ${GOLD}60`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              transition: isDragging ? "none" : "left 0.1s ease",
            }}
          >
            <div style={{ width: "8px", height: "8px", background: GOLD, borderRadius: "50%" }} />
            
            {/* Value Tooltip above Thumb */}
            <div style={{
              position: "absolute",
              top: "-45px",
              background: GOLD_DEEP,
              color: "#FFF",
              padding: "4px 12px",
              borderRadius: "20px",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: 700,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              pointerEvents: "none"
            }}>
              {degrees}°{mins.toString().padStart(2, '0')}′
            </div>
          </div>
        </div>

        {/* Visual Pada Zones */}
        <div style={{ display: "flex", width: "100%", marginTop: "64px", gap: "4px" }}>
          {[1, 2, 3, 4].map(pada => {
            const isActive = pada === padaNumber;
            return (
              <div 
                key={pada}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  textAlign: "center",
                  background: isActive ? `linear-gradient(180deg, ${GOLD_LIGHT}40 0%, transparent 100%)` : "transparent",
                  borderTop: isActive ? `3px solid ${GOLD}` : "3px solid transparent",
                  transition: "all 0.3s ease",
                  borderRadius: "4px",
                }}
              >
                <div style={{ 
                  fontFamily: "var(--font-sans)", 
                  fontSize: "14px", 
                  fontWeight: isActive ? 800 : 500,
                  color: isActive ? GOLD_DEEP : INK_MUTED,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em"
                }}>
                  Pada {pada}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: The Glassmorphic Calculation Panel */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        <motion.div
          animate={{ background: "rgba(255, 251, 240, 0.9)" }}
          style={{
            padding: "24px",
            borderRadius: "12px",
            border: `1px solid rgba(156, 122, 47, 0.3)`,
            boxShadow: "0 4px 16px rgba(156, 122, 47, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: INK_MUTED, fontWeight: 700 }}>
            Step 1: Convert to Minutes
          </div>
          <div style={{ fontSize: "24px", fontFamily: "var(--font-cormorant)", color: INK_PRIMARY, fontWeight: 600 }}>
            ({degrees} × 60) + {mins} = <span style={{ color: GOLD_DEEP }}>{minutes}′</span>
          </div>
          <div style={{ fontSize: "14px", color: INK_SECONDARY }}>
            Convert the position within the Nakṣatra purely into arc-minutes.
          </div>
        </motion.div>

        <motion.div
          animate={{ background: "rgba(255, 251, 240, 0.9)" }}
          style={{
            padding: "24px",
            borderRadius: "12px",
            border: `1px solid rgba(156, 122, 47, 0.3)`,
            boxShadow: "0 4px 16px rgba(156, 122, 47, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: INK_MUTED, fontWeight: 700 }}>
            Step 2: Floor Division
          </div>
          <div style={{ fontSize: "24px", fontFamily: "var(--font-cormorant)", color: INK_PRIMARY, fontWeight: 600 }}>
            ⌊{minutes} ÷ 200⌋ = <span style={{ color: GOLD_DEEP }}>{padaIndex}</span>
          </div>
          <div style={{ fontSize: "14px", color: INK_SECONDARY }}>
            Raw division is {rawDivision}. We take the floor (round down) to get the Pada Index (0-3).
          </div>
        </motion.div>

        <motion.div
          animate={{ background: `linear-gradient(135deg, ${GOLD_LIGHT}30, ${GOLD}40)` }}
          style={{
            padding: "24px",
            borderRadius: "12px",
            border: `1px solid ${GOLD}`,
            boxShadow: "0 8px 24px rgba(156, 122, 47, 0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Sparkles style={{ position: "absolute", top: 16, right: 16, color: GOLD_DEEP, opacity: 0.2 }} size={48} />
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD_DEEP, fontWeight: 800 }}>
            Step 3: Add One
          </div>
          <div style={{ fontSize: "36px", fontFamily: "var(--font-cormorant)", color: GOLD_DEEP, fontWeight: 700, lineHeight: 1 }}>
            {padaIndex} + 1 = Pada {padaNumber}
          </div>
          <div style={{ fontSize: "14px", color: INK_SECONDARY, fontWeight: 500, zIndex: 10 }}>
            Always add 1 to the floor division index to get the final Pada.
          </div>
        </motion.div>
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
