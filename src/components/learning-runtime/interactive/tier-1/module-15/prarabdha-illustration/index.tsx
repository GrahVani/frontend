"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Info, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  Sliders, 
  Shield, 
  RefreshCw, 
  AlertTriangle, 
  Check, 
  Wind, 
  Zap, 
  Lock, 
  Unlock, 
  ArrowRight,
  HelpCircle
} from "lucide-react";
import { isSoundMuted } from "@/design-tokens/grahvani-learning";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

function ToggleSwitch({ checked, onChange, label, sublabel, icon, disabled = false }: ToggleSwitchProps) {
  return (
    <div
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      style={{
        background: disabled ? "rgba(0,0,0,0.02)" : "#ffffff",
        padding: "12px",
        borderRadius: "12px",
        border: `1.5px solid ${checked ? GOLD : "rgba(156, 122, 47, 0.15)"}`,
        boxShadow: checked ? "0 4px 12px rgba(156, 122, 47, 0.08)" : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.25s ease-in-out",
        opacity: disabled ? 0.45 : 1,
      }}
      className={!disabled ? "remedy-toggle-card" : ""}
      tabIndex={disabled ? -1 : 0}
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          color: checked ? GOLD : INK_MUTED,
          transition: "color 0.25s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {icon}
        </div>
        <div>
          <span style={{
            fontSize: "12px",
            fontWeight: 800,
            color: checked ? GOLD_DEEP : INK_PRIMARY,
            display: "block",
            transition: "color 0.25s ease"
          }}>
            {label}
          </span>
          <span style={{ fontSize: "9.5px", color: INK_MUTED, display: "block", marginTop: "1px" }}>
            {sublabel}
          </span>
        </div>
      </div>
      
      {/* Switch pill */}
      <div style={{
        width: "36px",
        height: "18px",
        borderRadius: "9px",
        background: checked ? GOLD : "rgba(0,0,0,0.08)",
        position: "relative",
        transition: "background-color 0.25s ease",
        flexShrink: 0,
      }}>
        <div style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#ffffff",
          position: "absolute",
          top: "3px",
          left: checked ? "21px" : "3px",
          transition: "left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
        }} />
      </div>
    </div>
  );
}

export function PrarabdhaIllustration() {
  // Step/Phase state:
  // 0: Observe & Try to Recall
  // 1: Remedy 1 (Reduce Intensity) active/awaiting
  // 2: Remedy 2 (Shift Timing) active/awaiting
  // 3: Remedy 3 (Build Capacity) active/awaiting
  // 4: Integration Summary / Flip Card Insight
  const [step, setStep] = useState<number>(0);
  
  // Remedy Toggle states
  const [reduceIntensity, setReduceIntensity] = useState<boolean>(false);
  const [shiftTiming, setShiftTiming] = useState<boolean>(false);
  const [buildCapacity, setBuildCapacity] = useState<boolean>(false);
  const [recallAlert, setRecallAlert] = useState<boolean>(false);
  const [cardFlipped, setCardFlipped] = useState<boolean>(false);

  // Sound Engine
  const playSound = (type: "twang" | "chime" | "thud" | "whoosh" | "success") => {
    if (typeof window === "undefined" || isSoundMuted()) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      if (type === "twang") {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(85, now + 0.18);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.16, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === "chime") {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(880, now); // A5
        osc1.frequency.exponentialRampToValueAtTime(920, now + 0.4);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1320, now); // E6
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.12, now + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);
      } else if (type === "thud") {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(95, now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.20, now + 0.02);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "whoosh") {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.35);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.08, now + 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === "success") {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(220, now); // A3
        osc1.frequency.linearRampToValueAtTime(330, now + 0.25); // E4
        osc1.frequency.linearRampToValueAtTime(440, now + 0.7); // A4
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(440, now);
        osc2.frequency.linearRampToValueAtTime(660, now + 0.7);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.16, now + 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.0);
        osc2.stop(now + 1.0);
      }
    } catch (e) {
      console.warn("Audio Context fail:", e);
    }
  };

  const resetValues = () => {
    playSound("whoosh");
    setStep(0);
    setReduceIntensity(false);
    setShiftTiming(false);
    setBuildCapacity(false);
    setRecallAlert(false);
    setCardFlipped(false);
  };

  const handleRecallClick = () => {
    playSound("thud");
    setRecallAlert(true);
  };

  // Determine current active arrow flight animation style
  const getArrowClassName = () => {
    if (shiftTiming) {
      return reduceIntensity ? "arrow-curved-slow" : "arrow-curved";
    }
    return reduceIntensity ? "arrow-linear-slow" : "arrow-linear";
  };

  // Keep track of guided unlocks
  const handleToggleReduce = (checked: boolean) => {
    setReduceIntensity(checked);
    playSound("chime");
    if (checked && step === 1) {
      // Advance to step 2 after a tiny delay for visual satisfaction
      setTimeout(() => {
        setStep(2);
        playSound("whoosh");
      }, 500);
    }
  };

  const handleToggleTiming = (checked: boolean) => {
    setShiftTiming(checked);
    playSound("chime");
    if (checked && step === 2) {
      setTimeout(() => {
        setStep(3);
        playSound("whoosh");
      }, 500);
    }
  };

  const handleToggleCapacity = (checked: boolean) => {
    setBuildCapacity(checked);
    playSound("chime");
    if (checked && step === 3) {
      setTimeout(() => {
        setStep(4);
        playSound("success");
      }, 500);
    }
  };

  const stepsList = [
    { label: "Observe", index: 0 },
    { label: "Cushion", index: 1 },
    { label: "Timing", index: 2 },
    { label: "Fortify", index: 3 },
    { label: "Insight", index: 4 }
  ];

  return (
    <div style={{ 
      padding: "20px", 
      borderRadius: "20px", 
      background: "rgba(255, 253, 248, 0.82)", 
      backdropFilter: "blur(16px)", 
      border: "1.5px solid rgba(156, 122, 47, 0.2)", 
      boxShadow: "0 10px 30px rgba(45, 38, 30, 0.05), inset 0 0 40px rgba(156, 122, 47, 0.02)",
      fontFamily: "'Inter', sans-serif", 
      color: INK_PRIMARY, 
      maxWidth: "960px", 
      margin: "0 auto", 
      display: "flex", 
      flexDirection: "column", 
      gap: "20px" 
    }}>
      
      {/* CSS STYLES INJECTION */}
      <style>{`
        /* Dynamic SVG Remedy Animations */
        @keyframes arrowLinear {
          0% { transform: translate(50px, 125px); opacity: 0; }
          8% { opacity: 1; }
          85% { opacity: 1; }
          90%, 100% { transform: translate(325px, 125px); opacity: 0; }
        }
        @keyframes arrowCurved {
          0% { transform: translate(50px, 125px) rotate(0deg); opacity: 0; }
          8% { opacity: 1; }
          50% { transform: translate(187px, 85px) rotate(-16deg); }
          85% { opacity: 1; }
          90%, 100% { transform: translate(325px, 125px) rotate(16deg); opacity: 0; }
        }
        .arrow-linear {
          animation: arrowLinear 1.6s infinite linear;
        }
        .arrow-linear-slow {
          animation: arrowLinear 3.2s infinite linear;
          filter: blur(0.6px);
        }
        .arrow-curved {
          animation: arrowCurved 1.6s infinite linear;
        }
        .arrow-curved-slow {
          animation: arrowCurved 3.2s infinite linear;
          filter: blur(0.6px);
        }

        /* Concentric shield pulse */
        @keyframes shieldPulse {
          0% { stroke-dashoffset: 0; stroke-width: 3.5px; opacity: 0.8; }
          50% { stroke-dashoffset: 10; stroke-width: 5px; opacity: 1; filter: drop-shadow(0 0 3px ${GOLD}); }
          100% { stroke-dashoffset: 20; stroke-width: 3.5px; opacity: 0.8; }
        }
        .shield-pulsing {
          animation: shieldPulse 2s infinite linear;
          stroke-dasharray: 8,4;
        }

        /* Flowing wind lines */
        @keyframes windFlow {
          0% { stroke-dashoffset: 24; opacity: 0.3; }
          50% { opacity: 0.85; }
          100% { stroke-dashoffset: 0; opacity: 0.3; }
        }
        .wind-flowing {
          animation: windFlow 1.8s infinite linear;
          stroke-dasharray: 6,6;
        }

        /* Fortification aura pulse */
        @keyframes auraPulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.06); opacity: 0.55; }
        }
        .aura-pulsing {
          animation: auraPulse 3s infinite ease-in-out;
          transform-origin: 340px 165px;
        }

        @keyframes sparkFloat {
          0%, 100% { transform: translateY(0px) scale(0.8); opacity: 0.3; }
          50% { transform: translateY(-6px) scale(1.25); opacity: 1; }
        }
        .spark-item {
          animation: sparkFloat 2.5s infinite ease-in-out;
        }

        /* Remedy Toggle Card Hover */
        .remedy-toggle-card {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .remedy-toggle-card:hover {
          border-color: ${GOLD} !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(156, 122, 47, 0.08);
          background: rgba(251, 248, 243, 0.8) !important;
        }

        /* Interactive phase transitions */
        .phase-enter {
          animation: phaseSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes phaseSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Keyboard outline accessibility */
        [tabindex]:focus-visible {
          outline: 2px solid ${GOLD};
          outline-offset: 2px;
        }
      `}</style>

      {/* HEADER */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexWrap: "wrap", 
        gap: "12px", 
        borderBottom: "1.5px solid rgba(156, 122, 47, 0.12)", 
        paddingBottom: "12px" 
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 850, color: GOLD_DEEP, fontFamily: "'Noto Serif', 'Georgia', serif", letterSpacing: "-0.2px" }}>
            Prārabdha: The Arrow Analogy
          </h3>
          <p style={{ margin: "3px 0 0 0", fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.35 }}>
            Witness the flight of ripened karma. Discover why classical fate cannot be erased, but its impact can be transformed.
          </p>
        </div>
        <button
          onClick={resetValues}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "5px", 
            padding: "8px 14px", 
            border: "1.5px solid rgba(156, 122, 47, 0.22)", 
            borderRadius: "10px", 
            background: "transparent", 
            color: INK_SECONDARY, 
            fontSize: "11px", 
            fontWeight: 800, 
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          className="remedy-toggle-card"
          aria-label="Reset simulation"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* STEP INDICATOR DOTS */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(156, 122, 47, 0.03)",
        border: "1px solid rgba(156, 122, 47, 0.08)",
        borderRadius: "12px",
        padding: "10px 16px",
        width: "100%",
        overflowX: "auto"
      }}>
        {stepsList.map((s) => {
          const isActive = step === s.index;
          const isCompleted = step > s.index;
          return (
            <div 
              key={s.index} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px", 
                flexShrink: 0,
                opacity: isActive || isCompleted ? 1 : 0.45,
                transition: "all 0.25s ease"
              }}
            >
              <div style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: isCompleted ? GOLD : (isActive ? "#ffffff" : "transparent"),
                border: `2px solid ${isActive || isCompleted ? GOLD : INK_MUTED}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isCompleted ? "#ffffff" : (isActive ? GOLD_DEEP : INK_MUTED),
                fontSize: "10px",
                fontWeight: 900,
                transition: "all 0.25s ease",
                boxShadow: isActive ? `0 0 8px ${GOLD}` : "none"
              }}>
                {isCompleted ? <Check size={10} strokeWidth={4} /> : s.index + 1}
              </div>
              <span style={{
                fontSize: "11px",
                fontWeight: isActive ? 800 : 600,
                color: isActive ? GOLD_DEEP : INK_SECONDARY,
                transition: "color 0.25s ease"
              }}>
                {s.label}
              </span>
              {s.index < 4 && (
                <div style={{
                  width: "24px",
                  height: "2px",
                  background: isCompleted ? GOLD : "rgba(0,0,0,0.08)",
                  marginLeft: "8px",
                  transition: "background-color 0.25s ease"
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* SPLIT VIEW GRID */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
        gap: "24px",
        alignItems: "start" 
      }}>
        
        {/* Left Column: SVG Illustration Box */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "12px",
          background: "#ffffff", 
          padding: "16px", 
          borderRadius: "16px", 
          border: "1.5px solid rgba(156, 122, 47, 0.12)",
          boxShadow: "0 4px 20px rgba(45, 38, 30, 0.02)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
              <Sliders size={15} style={{ color: GOLD }} /> Karmic Path Visualizer
            </h4>
            <span style={{ 
              fontSize: "10px", 
              color: step === 0 ? "#ef4444" : GOLD_DEEP, 
              fontWeight: 800,
              background: step === 0 ? "rgba(239, 68, 68, 0.05)" : "rgba(156, 122, 47, 0.06)",
              padding: "3px 8px",
              borderRadius: "6px"
            }}>
              {step === 0 ? "Fate Unmitigated" : "Active Measures"}
            </span>
          </div>

          {/* SVG Frame */}
          <div style={{ 
            position: "relative", 
            width: "100%", 
            aspectRatio: "1.6 / 1", 
            borderRadius: "12px", 
            background: "linear-gradient(180deg, rgba(251, 248, 243, 0.8) 0%, rgba(246, 241, 232, 0.4) 100%)",
            border: "1px solid rgba(156, 122, 47, 0.08)",
            overflow: "hidden"
          }}>
            <svg width="100%" height="100%" viewBox="0 0 400 250">
              <defs>
                <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8c7750" />
                  <stop offset="50%" stopColor="#bfa370" />
                  <stop offset="100%" stopColor="#665333" />
                </linearGradient>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(251,248,243,0.15)" />
                  <stop offset="100%" stopColor="rgba(156,122,47,0.06)" />
                </linearGradient>
                <linearGradient id="shieldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(156,122,47,0)" />
                  <stop offset="50%" stopColor="rgba(156,122,47,0.6)" />
                  <stop offset="100%" stopColor="rgba(156,122,47,0.1)" />
                </linearGradient>
              </defs>

              {/* Sky Background Rect */}
              <rect x="0" y="0" width="400" height="250" fill="url(#skyGradient)" />

              {/* Distant Mountains for Horizon Depth */}
              <path d="M 0 210 L 80 165 L 140 210" fill="none" stroke="rgba(156,122,47,0.05)" strokeWidth="1.5" />
              <path d="M 100 210 L 190 145 L 280 210" fill="none" stroke="rgba(156,122,47,0.05)" strokeWidth="1.5" />
              <path d="M 230 210 L 310 160 L 400 210" fill="none" stroke="rgba(156,122,47,0.05)" strokeWidth="1.5" />

              {/* Ground horizon line */}
              <line x1="10" y1="210" x2="390" y2="210" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1.5" />
              <text x="200" y="226" textAnchor="middle" style={{ fontSize: "8.5px", fontWeight: 700, fill: INK_MUTED, letterSpacing: "1.5px" }}>
                THE HORIZON OF TIME &amp; DEED
              </text>

              {/* Classical Devanagari Flourish Bow Label */}
              <text x="35" y="42" style={{ fontSize: "8px", fontWeight: 800, fill: INK_MUTED, letterSpacing: "0.5px" }}>SANCITA (THE RESUME)</text>

              {/* Bow (Left) - Detailed Curved wood */}
              <g transform="translate(0, 0)">
                {/* Bow string backing */}
                <line x1="32" y1="52" x2="32" y2="198" stroke="rgba(45,38,30,0.3)" strokeWidth="0.8" />
                <line x1="32" y1="52" x2="48" y2="125" stroke="rgba(45,38,30,0.15)" strokeWidth="0.8" />
                <line x1="32" y1="198" x2="48" y2="125" stroke="rgba(45,38,30,0.15)" strokeWidth="0.8" />
                
                {/* Wood Bow arc */}
                <path d="M 32 50 C 65 95 65 155 32 200" fill="none" stroke="url(#woodGradient)" strokeWidth="4.5" strokeLinecap="round" />
                
                {/* Center handgrip binding */}
                <rect x="42" y="119" width="5" height="12" rx="1" fill="#4d4133" />
                <line x1="42" y1="122" x2="47" y2="122" stroke="#ffffff" strokeWidth="0.5" />
                <line x1="42" y1="128" x2="47" y2="128" stroke="#ffffff" strokeWidth="0.5" />
              </g>

              {/* Projected Flight Path Guides */}
              <path 
                d={shiftTiming ? "M 48 125 Q 187 85 325 125" : "M 48 125 L 325 125"} 
                fill="none" 
                stroke="rgba(156,122,47,0.1)" 
                strokeWidth="1.5" 
                strokeDasharray="4,4" 
              />

              {/* Remedy Effect 2: Wind Shift (Timing Wind Rays) */}
              <g style={{ opacity: shiftTiming ? 1 : 0, transition: "opacity 0.5s ease-in-out", pointerEvents: "none" }}>
                <path d="M 120 160 Q 170 100 220 115" fill="none" stroke={GOLD} strokeWidth="1.5" className="wind-flowing" />
                <path d="M 140 175 Q 195 115 250 130" fill="none" stroke={GOLD} strokeWidth="1.2" className="wind-flowing" style={{ animationDelay: "0.3s" }} />
                <path d="M 90 145 Q 145 85 200 100" fill="none" stroke={GOLD} strokeWidth="1" className="wind-flowing" style={{ animationDelay: "0.6s" }} />
                <text x="170" y="72" textAnchor="middle" style={{ fontSize: "8.5px", fontWeight: 800, fill: GOLD_DEEP }}>
                  Timing Shift (Prāṇa currents deflecting path)
                </text>
              </g>

              {/* Remedy Effect 1: Concentric Cushion Shield Arc */}
              <g style={{ opacity: reduceIntensity ? 1 : 0, transition: "opacity 0.5s ease-in-out", pointerEvents: "none" }}>
                {/* Outer pulsing shield */}
                <path d="M 285 85 A 65 65 0 0 1 285 165" fill="none" stroke="url(#shieldGlow)" strokeWidth="6" strokeLinecap="round" className="shield-pulsing" />
                {/* Inner soft shield outline */}
                <path d="M 275 95 A 45 45 0 0 1 275 155" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" opacity="0.65" />
                <text x="245" y="80" textAnchor="end" style={{ fontSize: "8.5px", fontWeight: 800, fill: GOLD_DEEP }}>
                  Intensity Cushion
                </text>
              </g>

              {/* Remedy Effect 3: Seated Person Fortification Aura & Sparks */}
              <g transform="translate(0, 0)">
                {/* Glowing Capacity Aura backdrop */}
                <circle 
                  cx="340" 
                  cy="165" 
                  r="30" 
                  fill="none" 
                  stroke={GOLD} 
                  strokeWidth="3.5" 
                  style={{ opacity: buildCapacity ? 1 : 0, transition: "opacity 0.5s ease-in-out" }} 
                  className="aura-pulsing"
                />
                
                {/* Sparks floating upward */}
                {buildCapacity && (
                  <g>
                    {/* Spark 1 */}
                    <path d="M 305 130 L 307 133 L 310 133 L 308 135 L 309 138 L 306 136 L 303 138 L 304 135 L 302 133 L 305 133 Z" fill={GOLD} className="spark-item" style={{ animationDelay: "0.2s" }} />
                    {/* Spark 2 */}
                    <path d="M 370 140 L 372 143 L 375 143 L 373 145 L 374 148 L 371 146 L 368 148 L 369 145 L 367 143 L 370 143 Z" fill={GOLD} className="spark-item" style={{ animationDelay: "0.8s" }} />
                    {/* Spark 3 */}
                    <circle cx="335" cy="115" r="2" fill={GOLD} className="spark-item" style={{ animationDelay: "1.4s" }} />
                    {/* Spark 4 */}
                    <circle cx="348" cy="122" r="1.5" fill={GOLD} className="spark-item" style={{ animationDelay: "0.5s" }} />
                  </g>
                )}

                {/* Refined Lotus Meditative Posture Silhouette */}
                {/* Base Shadow */}
                <ellipse cx="340" cy="193" rx="28" ry="6" fill="rgba(45,38,30,0.08)" />

                {/* Lotus Figure Body Outlines */}
                <path 
                  d="M 322 178 C 322 150 330 139 340 139 C 350 139 358 150 358 178 C 367 178 371 187 363 190 C 353 194 327 194 317 190 C 309 187 313 178 322 178 Z" 
                  fill="#ffffff" 
                  stroke={INK_PRIMARY} 
                  strokeWidth="2.5" 
                  strokeLinejoin="round"
                />
                {/* Head */}
                <circle cx="340" cy="125" r="10" fill="#ffffff" stroke={INK_PRIMARY} strokeWidth="2.5" />
                
                {/* Fortified Crown symbol (if capacity active) */}
                {buildCapacity ? (
                  <path d="M 335 111 L 340 106 L 345 111 Z" fill={GOLD} />
                ) : (
                  <circle cx="340" cy="111" r="1.5" fill={INK_MUTED} />
                )}

                {/* Agent label */}
                <text x="340" y="204" textAnchor="middle" style={{ fontSize: "8.5px", fontWeight: 900, fill: INK_PRIMARY, letterSpacing: "1px" }}>
                  THE AGENT
                </text>
              </g>

              {/* ANIMATED ARROW IN FLIGHT */}
              <g className={getArrowClassName()}>
                {/* Glowing trail */}
                <line x1="-30" y1="0" x2="0" y2="0" stroke="url(#shieldGlow)" strokeWidth="6" opacity="0.6" />
                
                {/* Arrow shaft */}
                <line x1="-24" y1="0" x2="8" y2="0" stroke={INK_PRIMARY} strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Feathers / Fletching */}
                <path d="M -24 -4 L -18 0 L -24 4 L -28 0 Z" fill={INK_MUTED} />
                <line x1="-22" y1="-3" x2="-18" y2="0" stroke={INK_PRIMARY} strokeWidth="1.2" />
                <line x1="-22" y1="3" x2="-18" y2="0" stroke={INK_PRIMARY} strokeWidth="1.2" />
                
                {/* Elegant arrowhead */}
                <path d="M 8 -3.5 L 17 0 L 8 3.5 Z" fill={INK_PRIMARY} />

                {/* Arrow label */}
                <text x="-8" y="-7" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 900, fill: INK_MUTED, letterSpacing: "0.5px" }}>
                  PRĀRABDHA
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right Column: Workflow Narrative Control Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Phase 0: Observe & Recall Arrow */}
          {step === 0 && (
            <div className="phase-enter" style={{ 
              background: "rgba(239, 68, 68, 0.03)", 
              border: "1.5px solid rgba(239, 68, 68, 0.16)", 
              padding: "16px", 
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "0 4px 15px rgba(239, 68, 68, 0.02)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#ef4444", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <AlertTriangle size={13} /> Pedagogical Guardrail
                </span>
                <span style={{ fontSize: "9px", color: INK_MUTED, fontWeight: 700 }}>Step 1 of 5</span>
              </div>
              <p style={{ margin: 0, fontSize: "12.5px", lineHeight: "1.5", color: INK_PRIMARY }}>
                Astrological malpractice often promises to <strong>"cancel" or "erase" past karmas</strong> entirely. To test this, try to recall the arrow loosed from the bow.
              </p>
              
              <button
                onClick={handleRecallClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "12px",
                  background: "#ef4444",
                  border: "none",
                  borderRadius: "10px",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#dc2626"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#ef4444"}
                aria-label="Attempt to recall arrow"
              >
                <RefreshCw size={14} className={recallAlert ? "animate-spin" : ""} /> Try to Recall Arrow (Erase Fate)
              </button>

              {recallAlert && (
                <div className="phase-enter" style={{ 
                  background: "#ffffff", 
                  padding: "12px", 
                  borderRadius: "10px", 
                  border: "1.5px solid #ef4444",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <ShieldAlert size={18} style={{ color: "#ef4444", flexShrink: 0, marginTop: "1px" }} />
                    <div>
                      <span style={{ fontSize: "12px", color: "#b91c1c", fontWeight: 800, display: "block" }}>
                        Recall Failed!
                      </span>
                      <span style={{ fontSize: "11px", color: "#7f1d1d", fontWeight: 600, display: "block", marginTop: "2px", lineHeight: "1.4" }}>
                        Once released, the arrow must land. Classical scriptures agree: ripened karma (Prārabdha) cannot be cancelled or deleted.
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      playSound("whoosh");
                      setStep(1);
                    }}
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      padding: "8px",
                      background: "rgba(156, 122, 47, 0.1)",
                      border: `1.5px solid ${GOLD}`,
                      borderRadius: "8px",
                      color: GOLD_DEEP,
                      fontSize: "11px",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    Acknowledge &amp; Explore Honest Measures <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Phase 1: Guided Remedies sequence */}
          {step >= 1 && step <= 3 && (
            <div className="phase-enter" style={{ 
              background: "#ffffff",
              border: "1.5px solid rgba(156,122,47,0.18)",
              padding: "16px",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: "0 4px 20px rgba(45, 38, 30, 0.02)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Shield size={14} style={{ color: GOLD }} /> Honest Remedies Panel
                </span>
                <span style={{ fontSize: "9px", color: INK_MUTED, fontWeight: 700 }}>
                  Step {step + 1} of 5
                </span>
              </div>

              {/* Interactive instruction based on sub-step */}
              <div style={{ 
                background: SURFACE_MANUSCRIPT, 
                padding: "10px 12px", 
                borderRadius: "10px", 
                borderLeft: `3px solid ${GOLD}`,
                fontSize: "11.5px",
                lineHeight: "1.45",
                color: INK_SECONDARY
              }}>
                {step === 1 && (
                  <span>
                    <strong>1. Cushion the Landing:</strong> Since fate cannot be erased, a doctor does not pretend the bone isn't broken — they apply a cast. Turn on <strong>Reduce Intensity</strong>.
                  </span>
                )}
                {step === 2 && (
                  <span>
                    <strong>2. Shift the Timing:</strong> Karma has a peak moment. Remedies can act like a dispersing wind, spreading the event across a wider, manageable timeline. Turn on <strong>Shift Timing</strong>.
                  </span>
                )}
                {step === 3 && (
                  <span>
                    <strong>3. Build Capacity:</strong> Instead of hiding from the storm, we strengthen the foundation. Fortify the agent's internal resilience. Turn on <strong>Build Capacity</strong>.
                  </span>
                )}
              </div>

              {/* Remedies Toggles stack */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                
                {/* Remedy 1 */}
                <ToggleSwitch 
                  checked={reduceIntensity}
                  onChange={handleToggleReduce}
                  label="1. Reduce Intensity"
                  sublabel="Cushions landing force. Slows arrow flight."
                  icon={<Shield size={16} />}
                  disabled={step < 1}
                />

                {/* Remedy 2 */}
                <ToggleSwitch 
                  checked={shiftTiming}
                  onChange={handleToggleTiming}
                  label="2. Shift Timing"
                  sublabel="Deflects path. Spreads event windows."
                  icon={<Wind size={16} />}
                  disabled={step < 2}
                />

                {/* Remedy 3 */}
                <ToggleSwitch 
                  checked={buildCapacity}
                  onChange={handleToggleCapacity}
                  label="3. Build Capacity / Resilience"
                  sublabel="Fortifies the person with golden aura."
                  icon={<Zap size={16} />}
                  disabled={step < 3}
                />

              </div>

              {/* Step completion hints */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1.5px solid rgba(156,122,47,0.12)", paddingTop: "10px" }}>
                <span style={{ fontSize: "10.5px", color: INK_MUTED, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Lock size={11} /> Locks release on trigger
                </span>
                {/* Enable skip button */}
                <button
                  onClick={() => {
                    playSound("success");
                    setReduceIntensity(true);
                    setShiftTiming(true);
                    setBuildCapacity(true);
                    setStep(4);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: GOLD_DEEP,
                    fontSize: "11px",
                    fontWeight: 750,
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Apply All at Once
                </button>
              </div>
            </div>
          )}

          {/* Phase 2: Integration Summary */}
          {step === 4 && (
            <div className="phase-enter" style={{ 
              background: SURFACE_MANUSCRIPT,
              border: `1.5px solid ${GOLD}`,
              padding: "18px",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "0 6px 20px rgba(156, 122, 47, 0.08)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={14} style={{ color: GOLD }} /> Integrational Insight
                </span>
                <span style={{ fontSize: "9px", color: GOLD, fontWeight: 800 }}>Complete (● ● ● ●)</span>
              </div>
              <h4 style={{ margin: 0, fontSize: "14.5px", fontWeight: 800, color: GOLD_DEEP, fontFamily: "'Noto Serif', 'Georgia', serif" }}>
                Outcome Transformed
              </h4>
              <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.5", color: INK_SECONDARY }}>
                Review the visual simulation: The arrow <strong>still landed</strong>. It could not be deleted. But because you:
              </p>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "11.5px", color: INK_PRIMARY, display: "flex", flexDirection: "column", gap: "4px" }}>
                <li>Cushioned the target (reduced intensity)</li>
                <li>Deflected the path (shifted timing)</li>
                <li>Fortified the agent's soul (built capacity)</li>
              </ul>
              <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.45", color: INK_PRIMARY, fontStyle: "italic", background: "#ffffff", padding: "8px 10px", borderRadius: "8px", border: "1px dashed rgba(156,122,47,0.2)" }}>
                "The event still occurs, but what would have been a fatal puncture is experienced as a minor scratch."
              </p>

              {/* Free Exploration Toggle Box */}
              <div style={{ borderTop: "1px solid rgba(156,122,47,0.12)", paddingTop: "10px", marginTop: "4px" }}>
                <span style={{ fontSize: "9.5px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                  Free Exploration Toggles
                </span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <button 
                    onClick={() => { playSound("chime"); setReduceIntensity(!reduceIntensity); }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: `1.5px solid ${reduceIntensity ? GOLD : "rgba(0,0,0,0.08)"}`,
                      background: reduceIntensity ? "rgba(156,122,47,0.06)" : "#ffffff",
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                      color: reduceIntensity ? GOLD_DEEP : INK_SECONDARY
                    }}
                  >
                    Intensity {reduceIntensity ? "ON" : "OFF"}
                  </button>
                  <button 
                    onClick={() => { playSound("chime"); setShiftTiming(!shiftTiming); }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: `1.5px solid ${shiftTiming ? GOLD : "rgba(0,0,0,0.08)"}`,
                      background: shiftTiming ? "rgba(156,122,47,0.06)" : "#ffffff",
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                      color: shiftTiming ? GOLD_DEEP : INK_SECONDARY
                    }}
                  >
                    Timing {shiftTiming ? "ON" : "OFF"}
                  </button>
                  <button 
                    onClick={() => { playSound("chime"); setBuildCapacity(!buildCapacity); }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: `1.5px solid ${buildCapacity ? GOLD : "rgba(0,0,0,0.08)"}`,
                      background: buildCapacity ? "rgba(156,122,47,0.06)" : "#ffffff",
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                      color: buildCapacity ? GOLD_DEEP : INK_SECONDARY
                    }}
                  >
                    Capacity {buildCapacity ? "ON" : "OFF"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* THREE-D FLIP CARD COMPARISON DECK */}
      <div style={{ marginTop: "12px", borderTop: "1.5px solid rgba(156, 122, 47, 0.12)", paddingTop: "16px" }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: 850, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
          <HelpCircle size={15} style={{ color: GOLD }} /> Ethical Framing: Over-Claiming vs. Doctrinal Reality
        </h4>
        <p style={{ margin: "0 0 16px 0", fontSize: "11.5px", color: INK_SECONDARY, lineHeight: 1.4 }}>
          How do you communicate remedies to a client? Compare the warning case of over-promising (astrological malpractice) with honest scriptural framing.
        </p>

        {/* 3D Flip Card Container */}
        <div style={{
          perspective: "1200px",
          width: "100%",
          minHeight: "185px",
          position: "relative"
        }}>
          <div style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transformStyle: "preserve-3d",
            transform: cardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "185px"
          }}>
            
            {/* FRONT SIDE (Over-claiming warning) */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              borderRadius: "16px",
              padding: "18px",
              background: "rgba(239, 68, 68, 0.02)",
              border: "1.5px solid rgba(239, 68, 68, 0.22)",
              boxShadow: "0 4px 15px rgba(239, 68, 68, 0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              zIndex: cardFlipped ? 0 : 2,
              boxSizing: "border-box"
            }}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#ef4444", display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                  ❌ Over-Claiming (Astrological Malpractice)
                </span>
                <span style={{ fontSize: "13px", color: "#b91c1c", fontStyle: "italic", fontWeight: 650, display: "block", marginBottom: "8px", lineHeight: "1.4" }}>
                  "Wear this sapphire, and your Saturn dashā affliction will be completely removed and cancelled."
                </span>
                <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
                  <strong>The Danger:</strong> This formulation creates the illusion that remedial stones or chants erase karma. When the customer still experiences Saturn's heavy constraints, they lose trust in Vedic science.
                </p>
              </div>
              <button
                onClick={() => {
                  playSound("whoosh");
                  setCardFlipped(true);
                }}
                style={{
                  alignSelf: "flex-end",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "transparent",
                  border: "none",
                  color: "#b91c1c",
                  fontSize: "11.5px",
                  fontWeight: 800,
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  transition: "background-color 0.2s ease"
                }}
                className="remedy-toggle-card"
                aria-label="See honest doctrinal framing"
              >
                See Honest Doctrinal Framing <ArrowRight size={13} />
              </button>
            </div>

            {/* BACK SIDE (Honest framing) */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              borderRadius: "16px",
              padding: "18px",
              background: "#ffffff",
              border: `1.8px solid ${GOLD}`,
              boxShadow: "0 6px 20px rgba(156, 122, 47, 0.12)",
              transform: "rotateY(180deg)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              zIndex: cardFlipped ? 2 : 0,
              boxSizing: "border-box"
            }}>
              <div>
                <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#16a34a", display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                  ✅ Honest Framing (Doctrinal Reality)
                </span>
                <span style={{ fontSize: "13px", color: GOLD_DEEP, fontStyle: "italic", fontWeight: 650, display: "block", marginBottom: "8px", lineHeight: "1.4" }}>
                  "This gemstone matches Saturn's resonance, helping you remain patient, disciplined, and resilient as you navigate this karmic period."
                </span>
                <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
                  <strong>The Value:</strong> Classically accurate. Remedies do not act as cosmic delete buttons; they strengthen the container (agent) and soften the blows (cushion), cultivating genuine spiritual maturity.
                </p>
              </div>
              <button
                onClick={() => {
                  playSound("whoosh");
                  setCardFlipped(false);
                }}
                style={{
                  alignSelf: "flex-end",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "transparent",
                  border: "none",
                  color: GOLD_DEEP,
                  fontSize: "11.5px",
                  fontWeight: 800,
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  transition: "background-color 0.2s ease"
                }}
                className="remedy-toggle-card"
                aria-label="Return to malpractice warning"
              >
                ← Return to Malpractice Warning
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

