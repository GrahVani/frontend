"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, CheckCircle2, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { RASHIS, getRashiByNumber } from '@/components/learning-runtime/interactive/rashi-data';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const GREEN = "#2F7D55";
const RED = "#A8412B";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface StepInfo {
  contributor: string;
  symbol: string;
  natalSign: number;
  houses: number[];
  color: string;
  desc: string;
}

const STEPS: StepInfo[] = [
  { contributor: "Sun", symbol: "☉", natalSign: 4, houses: [3, 5, 6, 10, 11, 12], color: "#f59e0b", desc: "Sun in Karka. Mars gives bindus in the 3rd, 5th, 6th, 10th, 11th and 12th houses counted from the Sun." },
  { contributor: "Moon", symbol: "☽", natalSign: 8, houses: [3, 6, 11], color: "#3b82f6", desc: "Moon in Vṛścika. Mars gives bindus in the 3rd, 6th and 11th houses counted from the Moon." },
  { contributor: "Mars", symbol: "♂", natalSign: 1, houses: [1, 2, 4, 7, 8, 10, 11], color: "#ef4444", desc: "Mars in Meṣa. Mars gives bindus in the 1st, 2nd, 4th, 7th, 8th, 10th and 11th houses counted from Mars." },
  { contributor: "Mercury", symbol: "☿", natalSign: 4, houses: [3, 5, 6, 11], color: "#10b981", desc: "Mercury in Karka. Mars gives bindus in the 3rd, 5th, 6th and 11th houses counted from Mercury." },
  { contributor: "Jupiter", symbol: "♃", natalSign: 9, houses: [1, 4, 10, 11], color: "#d97706", desc: "Jupiter in Dhanus. Mars gives bindus in the 1st, 4th, 10th and 11th houses counted from Jupiter." },
  { contributor: "Venus", symbol: "♀", natalSign: 7, houses: [6, 8, 11, 12], color: "#ec4899", desc: "Venus in Tulā. Mars gives bindus in the 6th, 8th, 11th and 12th houses counted from Venus." },
  { contributor: "Saturn", symbol: "♄", natalSign: 6, houses: [1, 4, 7, 8, 10, 11], color: "#64748b", desc: "Saturn in Kanyā. Mars gives bindus in the 1st, 4th, 7th, 8th, 10th and 11th houses counted from Saturn." },
  { contributor: "Lagna", symbol: "Lg", natalSign: 1, houses: [1, 3, 6, 10, 11], color: GOLD_DEEP, desc: "Lagna in Meṣa. Mars gives bindus in the 1st, 3rd, 6th, 10th and 11th houses counted from the Lagna." },
];

const TOTAL_BINDUS = 39;

const PLANET_CONFIG: Record<string, { label: string; color: string }> = {
  ASC: { label: "Lagna", color: GOLD_DEEP },
  "☉": { label: "Sun", color: "#f59e0b" },
  "☽": { label: "Moon", color: "#3b82f6" },
  "♂": { label: "Mars", color: "#ef4444" },
  "☿": { label: "Mercury", color: "#10b981" },
  "♃": { label: "Jupiter", color: "#d97706" },
  "♀": { label: "Venus", color: "#ec4899" },
  "♄": { label: "Saturn", color: "#64748b" },
};

function getPlanetsInSign(signNum: number): string[] {
  switch (signNum) {
    case 1: return ["ASC", "♂"];
    case 4: return ["☉", "☿"];
    case 6: return ["♄"];
    case 7: return ["♀"];
    case 8: return ["☽"];
    case 9: return ["♃"];
    default: return [];
  }
}

function getAbsoluteSign(relativeHouse: number, natalSign: number) {
  return ((natalSign - 1 + relativeHouse - 1) % 12) + 1;
}

export function MarsBhinnaWalkthrough() {
  const [step, setStep] = useState<number>(0); // 0 = intro, 1-8 = contributors, 9 = verify

  const currentStep = step > 0 && step <= 8 ? STEPS[step - 1] : null;
  const isComplete = step === 9;

  const BAV = useMemo(() => {
    const grid = Array(12).fill(0);
    const stepsCount = Math.min(step, 8);
    for (let i = 0; i < stepsCount; i++) {
      const s = STEPS[i];
      s.houses.forEach(h => {
        const absSign = getAbsoluteSign(h, s.natalSign);
        grid[absSign - 1] += 1;
      });
    }
    return grid;
  }, [step]);

  const totalBindus = useMemo(() => BAV.reduce((a, b) => a + b, 0), [BAV]);

  const circlePoints = useMemo(() => {
    const points = [];
    const cx = 150, cy = 150, r = 105;
    for (let i = 0; i < 12; i++) {
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      points.push({ x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad), angleDeg, rashiNum: i + 1 });
    }
    return points;
  }, []);

  const currentDropSigns = useMemo(() => {
    if (!currentStep) return [];
    return currentStep.houses.map(h => getAbsoluteSign(h, currentStep.natalSign));
  }, [currentStep]);

  const handleNext = () => { if (step < 9) setStep(step + 1); };
  const handlePrev = () => { if (step > 0) setStep(step - 1); };
  const handleReset = () => { setStep(0); };

  const wheelSize = 220;

  return (
    <div data-interactive="mars-bhinna-walkthrough" style={{ padding: "14px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Mars BAV Walkthrough
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Build Mars&apos;s <IAST>Bhinna Aṣṭakavarga</IAST> on the sample chart, contributor by contributor, and verify the {TOTAL_BINDUS}-bindu checksum.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Stepper bar */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={handlePrev}
          disabled={step === 0}
          style={{ display: "flex", alignItems: "center", gap: "2px", padding: "5px 10px", border: "1px solid rgba(156,122,47,0.2)", borderRadius: "6px", background: step === 0 ? "rgba(0,0,0,0.03)" : "#ffffff", color: step === 0 ? INK_MUTED : INK_PRIMARY, fontSize: "11px", fontWeight: 700, cursor: step === 0 ? "not-allowed" : "pointer" }}
        >
          <ChevronLeft size={14} /> Back
        </button>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>
              {step === 0 ? "Ready to start" : step === 9 ? "Verification" : `Step ${step} of 8`}
            </span>
            <span style={{ fontSize: "10px", fontWeight: 700, color: INK_MUTED }}>
              {Math.round((step / 9) * 100)}%
            </span>
          </div>
          <div style={{ height: "6px", borderRadius: "3px", background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / 9) * 100}%` }}
              transition={{ duration: 0.3 }}
              style={{ height: "100%", background: isComplete ? GREEN : step === 0 ? GOLD_DEEP : currentStep?.color }}
            />
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={isComplete}
          style={{ display: "flex", alignItems: "center", gap: "2px", padding: "5px 12px", border: "none", borderRadius: "6px", background: isComplete ? GREEN : "#ef4444", color: "#ffffff", fontSize: "11px", fontWeight: 800, cursor: isComplete ? "not-allowed" : "pointer" }}
        >
          {step === 0 ? <><Play size={12} fill="#ffffff" /> Start</> : isComplete ? <><CheckCircle2 size={12} /> Done</> : <>{step === 8 ? "Finish" : "Next"} <ChevronRight size={14} /></>}
        </button>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>

        {/* Left: Natal chart */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "10px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", alignSelf: "flex-start" }}>
              Sample Natal Chart
            </h4>
            <div style={{ position: "relative", width: `${wheelSize}px`, height: `${wheelSize}px` }}>
              <svg width={wheelSize} height={wheelSize} viewBox="0 0 300 300" style={{ overflow: "visible" }}>
                <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="2" />
                <circle cx="150" cy="150" r="72" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />

                {RASHIS.map((_, i) => {
                  const angleDeg = i * 30 - 105;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const lx = 150 + 130 * Math.cos(angleRad);
                  const ly = 150 + 130 * Math.sin(angleRad);
                  return <line key={`nline-${i}`} x1="150" y1="150" x2={lx} y2={ly} stroke="rgba(156,122,47,0.08)" strokeWidth="1.2" />;
                })}

                {RASHIS.map((r, i) => {
                  const num = r.number;
                  const isActive = currentStep && currentStep.natalSign === num;

                  const startAngle = i * 30 - 105;
                  const endAngle = i * 30 - 75;
                  const so = { x: 150 + 130 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((startAngle * Math.PI) / 180) };
                  const eo = { x: 150 + 130 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((endAngle * Math.PI) / 180) };
                  const si = { x: 150 + 72 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 72 * Math.sin((startAngle * Math.PI) / 180) };
                  const ei = { x: 150 + 72 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 72 * Math.sin((endAngle * Math.PI) / 180) };

                  const pathData = [
                    `M ${si.x} ${si.y}`,
                    `L ${so.x} ${so.y}`,
                    `A 130 130 0 0 1 ${eo.x} ${eo.y}`,
                    `L ${ei.x} ${ei.y}`,
                    `A 72 72 0 0 0 ${si.x} ${si.y}`,
                    "Z"
                  ].join(" ");

                  return (
                    <path
                      key={`npath-${num}`}
                      d={pathData}
                      fill={isActive && currentStep ? `color-mix(in srgb, ${currentStep.color} 12%, transparent)` : "transparent"}
                      stroke={isActive && currentStep ? currentStep.color : "none"}
                      strokeWidth={isActive ? "2" : "0"}
                      style={{ transition: "all 0.2s" }}
                    />
                  );
                })}

                {circlePoints.map(p => {
                  const r = RASHIS[p.rashiNum - 1];
                  const angleDeg = p.angleDeg;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const ptEng = { x: 150 + 115 * Math.cos(angleRad), y: 150 + 115 * Math.sin(angleRad) };
                  const planets = getPlanetsInSign(p.rashiNum);

                  return (
                    <g key={`nlabel-${p.rashiNum}`}>
                      <text
                        x={ptEng.x}
                        y={ptEng.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "8px", fontWeight: 700, fill: INK_PRIMARY }}
                      >
                        {r.nameEnglish}
                      </text>

                      {planets.map((glyph, idx) => {
                        const conf = PLANET_CONFIG[glyph];
                        if (!conf) return null;
                        const radius = planets.length === 2 ? (idx === 0 ? 94 : 78) : 86;
                        const px = 150 + radius * Math.cos(angleRad);
                        const py = 150 + radius * Math.sin(angleRad);

                        if (glyph === "ASC") {
                          return (
                            <g key={`nplanet-${p.rashiNum}-${glyph}`}>
                              <rect x={px - 13} y={py - 7} width="26" height="14" rx="3" fill="#ffffff" stroke={conf.color} strokeWidth="1.5" />
                              <text x={px} y={py + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7.5px", fontWeight: 800, fill: conf.color }}>Lg</text>
                            </g>
                          );
                        }
                        return (
                          <g key={`nplanet-${p.rashiNum}-${glyph}`}>
                            <circle cx={px} cy={py} r="10" fill="#ffffff" stroke={conf.color} strokeWidth="1.5" />
                            <text x={px} y={py + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "11px", fontWeight: 800, fill: conf.color }}>{glyph}</text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}

                <circle cx="150" cy="150" r="28" fill="#ffffff" stroke={GOLD} strokeWidth="1.5" />
                <text x="150" y="145" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>NATAL</text>
                <text x="150" y="160" textAnchor="middle" style={{ fontSize: "12px", fontWeight: 900, fill: GOLD_DEEP }}>CHART</text>
              </svg>
            </div>
          </div>

          {/* Natal legend */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>Contributor placements</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px" }}>
              {STEPS.map(s => {
                const rashi = getRashiByNumber(s.natalSign)!;
                const isActive = currentStep?.contributor === s.contributor;
                return (
                  <div
                    key={s.contributor}
                    onClick={() => setStep(STEPS.indexOf(s) + 1)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "4px 6px",
                      borderRadius: "5px",
                      background: isActive ? `${s.color}15` : "rgba(156,122,47,0.04)",
                      border: `1px solid ${isActive ? s.color : "rgba(156,122,47,0.1)"}`,
                      cursor: "pointer",
                      transition: "all 0.15s"
                    }}
                  >
                    <span style={{ fontSize: "12px", color: s.color, fontWeight: 800 }}>{s.symbol}</span>
                    <span style={{ fontSize: "9.5px", color: INK_PRIMARY, fontWeight: isActive ? 800 : 600 }}>{s.contributor}</span>
                    <span style={{ fontSize: "9px", color: INK_MUTED, marginLeft: "auto" }}>{rashi.nameEnglish}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: BAV wheel + step detail */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "6px" }}>
              <h4 style={{ margin: 0, fontSize: "10px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>
                Mars BAV — Cumulative Bindus
              </h4>
              <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP }}>
                Total: {totalBindus}/{TOTAL_BINDUS}
              </span>
            </div>
            <div style={{ position: "relative", width: `${wheelSize}px`, height: `${wheelSize}px` }}>
              <svg width={wheelSize} height={wheelSize} viewBox="0 0 300 300" style={{ overflow: "visible" }}>
                <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="2" />
                <circle cx="150" cy="150" r="72" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />

                {RASHIS.map((_, i) => {
                  const angleDeg = i * 30 - 105;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const lx = 150 + 130 * Math.cos(angleRad);
                  const ly = 150 + 130 * Math.sin(angleRad);
                  return <line key={`bline-${i}`} x1="150" y1="150" x2={lx} y2={ly} stroke="rgba(156,122,47,0.08)" strokeWidth="1.2" />;
                })}

                {RASHIS.map((r, i) => {
                  const num = r.number;
                  const isCurrentDrop = currentDropSigns.includes(num);
                  const binduCount = BAV[num - 1];

                  const startAngle = i * 30 - 105;
                  const endAngle = i * 30 - 75;
                  const so = { x: 150 + 130 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((startAngle * Math.PI) / 180) };
                  const eo = { x: 150 + 130 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((endAngle * Math.PI) / 180) };
                  const si = { x: 150 + 72 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 72 * Math.sin((startAngle * Math.PI) / 180) };
                  const ei = { x: 150 + 72 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 72 * Math.sin((endAngle * Math.PI) / 180) };

                  const pathData = [
                    `M ${si.x} ${si.y}`,
                    `L ${so.x} ${so.y}`,
                    `A 130 130 0 0 1 ${eo.x} ${eo.y}`,
                    `L ${ei.x} ${ei.y}`,
                    `A 72 72 0 0 0 ${si.x} ${si.y}`,
                    "Z"
                  ].join(" ");

                  return (
                    <path
                      key={`bpath-${num}`}
                      d={pathData}
                      fill={isCurrentDrop && currentStep ? `color-mix(in srgb, ${currentStep.color} 18%, transparent)` : binduCount > 0 ? "rgba(156,122,47,0.05)" : "transparent"}
                      stroke={isCurrentDrop && currentStep ? currentStep.color : "rgba(156,122,47,0.08)"}
                      strokeWidth={isCurrentDrop ? "2" : "0.5"}
                      style={{ transition: "all 0.2s" }}
                    />
                  );
                })}

                {circlePoints.map(p => {
                  const r = RASHIS[p.rashiNum - 1];
                  const angleDeg = p.angleDeg;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const ptEng = { x: 150 + 115 * Math.cos(angleRad), y: 150 + 115 * Math.sin(angleRad) };
                  const ptBindu = { x: 150 + 85 * Math.cos(angleRad), y: 150 + 85 * Math.sin(angleRad) };
                  const binduCount = BAV[p.rashiNum - 1];
                  const isCurrentDrop = currentDropSigns.includes(p.rashiNum);

                  return (
                    <g key={`blabel-${p.rashiNum}`}>
                      <text
                        x={ptEng.x}
                        y={ptEng.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "8px", fontWeight: 700, fill: INK_PRIMARY }}
                      >
                        {r.nameEnglish}
                      </text>

                      <g>
                        <circle
                          cx={ptBindu.x}
                          cy={ptBindu.y}
                          r={isCurrentDrop ? "13" : "11"}
                          fill={isCurrentDrop && currentStep ? `${currentStep.color}20` : "rgba(156,122,47,0.04)"}
                          stroke={isCurrentDrop && currentStep ? currentStep.color : "rgba(156,122,47,0.12)"}
                          strokeWidth="1.5"
                          style={{ transition: "all 0.2s" }}
                        />
                        <text
                          x={ptBindu.x}
                          y={ptBindu.y + 0.5}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{ fontSize: isCurrentDrop ? "10px" : "9px", fontWeight: 900, fill: binduCount > 0 ? GOLD_DEEP : INK_MUTED }}
                        >
                          {binduCount}
                        </text>
                      </g>
                    </g>
                  );
                })}

                <circle cx="150" cy="150" r="28" fill="#ffffff" stroke={GOLD} strokeWidth="1.5" />
                <text x="150" y="142" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>MARS</text>
                <text x="150" y="156" textAnchor="middle" style={{ fontSize: "12px", fontWeight: 900, fill: GOLD_DEEP }}>{totalBindus}</text>
                <text x="150" y="166" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>BINDUS</text>
              </svg>
            </div>
          </div>

          {/* Step detail card */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", flex: 1 }}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="intro" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP }}>How the walkthrough works</div>
                  <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
                    For Mars&apos;s BAV we apply <strong>Mars&apos;s contribution table</strong> from each of the 8 contributors&apos; natal signs. Each step drops <strong>+1 bindu</strong> in the signs that are Mars&apos;s benefic houses counted from that contributor.
                  </p>
                  <button onClick={handleNext} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", padding: "6px", border: "none", borderRadius: "6px", background: "#ef4444", color: "#ffffff", fontSize: "11px", fontWeight: 800, cursor: "pointer", marginTop: "4px" }}>
                    <Play size={12} fill="#ffffff" /> Start with the Sun
                  </button>
                </motion.div>
              )}

              {currentStep && (
                <motion.div key={`step-${step}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: currentStep.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "14px", fontWeight: 900 }}>
                      {currentStep.symbol}
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 800, color: INK_PRIMARY }}>
                        Step {step}: {currentStep.contributor}
                      </div>
                      <div style={{ fontSize: "9.5px", color: INK_MUTED }}>
                        In <IAST>{getRashiByNumber(currentStep.natalSign)?.nameIAST}</IAST> — adds {currentStep.houses.length} bindu{currentStep.houses.length === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
                    {currentStep.desc}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {currentStep.houses.map(h => {
                      const absSign = getAbsoluteSign(h, currentStep.natalSign);
                      const rashi = getRashiByNumber(absSign)!;
                      return (
                        <span key={h} style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "4px", background: `${currentStep.color}15`, border: `1px solid ${currentStep.color}40`, color: currentStep.color, fontWeight: 800 }}>
                          {h}H → {rashi.nameEnglish}
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {isComplete && (
                <motion.div key="verify" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center", textAlign: "center" }}>
                  <CheckCircle2 size={24} color={GREEN} />
                  <div style={{ fontSize: "13px", fontWeight: 900, color: GOLD_DEEP }}>Total = {totalBindus} bindus</div>
                  <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
                    Mars&apos;s fixed total is <strong>{TOTAL_BINDUS}</strong>. The construction is verified — every contributor&apos;s drops have been stacked and summed.
                  </p>
                  {totalBindus === TOTAL_BINDUS ? (
                    <span style={{ fontSize: "10px", color: GREEN, fontWeight: 800, padding: "3px 10px", borderRadius: "4px", background: `${GREEN}15` }}>
                      ✓ Checksum matches {TOTAL_BINDUS}
                    </span>
                  ) : (
                    <span style={{ fontSize: "10px", color: RED, fontWeight: 800, padding: "3px 10px", borderRadius: "4px", background: `${RED}15` }}>
                      ✗ Expected {TOTAL_BINDUS}; got {totalBindus}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). Mars&apos;s BAV is built by applying Mars&apos;s benefic-house table from each of the 8 contributors&apos; natal signs, then summing per sign. The twelve-sign total must equal Mars&apos;s fixed total of {TOTAL_BINDUS} bindus.
      </div>
    </div>
  );
}
