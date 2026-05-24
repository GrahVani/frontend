"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info, Lightbulb, RotateCcw, GitBranch, Target, Shield,
  ArrowRight, ChevronRight, CheckCircle2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────
type OperationMode = "mirror" | "loss" | "custom";

interface HouseData {
  num: number;
  sanskrit: string;
  meaning: string;
  keywords: string[];
}

interface Preset {
  label: string;
  source: number;
  steps: number;
  mode: OperationMode;
  interpretation: string;
  checksum: string;
}

// ─── Static Data ──────────────────────────────────────────────
const HOUSES: HouseData[] = [
  { num: 1, sanskrit: "Tanu", meaning: "Body / Self", keywords: ["Personality", "Physical body", "Lagna", "Life path"] },
  { num: 2, sanskrit: "Dhana", meaning: "Wealth", keywords: ["Money", "Family", "Speech", "Food"] },
  { num: 3, sanskrit: "Sahaja", meaning: "Siblings / Courage", keywords: ["Courage", "Younger siblings", "Communication", "Skills"] },
  { num: 4, sanskrit: "Bandhu", meaning: "Home / Mother", keywords: ["Mother", "Property", "Vehicle", "Happiness"] },
  { num: 5, sanskrit: "Putra", meaning: "Children / Intellect", keywords: ["Children", "Intelligence", "Speculation", "Mantra"] },
  { num: 6, sanskrit: "Ari", meaning: "Enemies / Disease", keywords: ["Disease", "Debt", "Enemies", "Service"] },
  { num: 7, sanskrit: "Yuvati", meaning: "Spouse / Partnership", keywords: ["Marriage", "Partnership", "Business", "Foreign lands"] },
  { num: 8, sanskrit: "Randhra", meaning: "Death / Occult", keywords: ["Longevity", "Occult", "Sudden events", "Inheritance"] },
  { num: 9, sanskrit: "Dharma", meaning: "Fortune / Father", keywords: ["Father", "Higher learning", "Luck", "Religion"] },
  { num: 10, sanskrit: "Karma", meaning: "Career / Status", keywords: ["Career", "Status", "Power", "Government"] },
  { num: 11, sanskrit: "Labha", meaning: "Gains", keywords: ["Income", "Elder siblings", "Friends", "Ambition"] },
  { num: 12, sanskrit: "Vyaya", meaning: "Loss / Liberation", keywords: ["Expenses", "Foreign settlement", "Liberation", "Sleep"] },
];

const PRESETS: Preset[] = [
  {
    label: "4th from 4th → 7th",
    source: 4, steps: 4, mode: "mirror",
    interpretation: "The 4th from the 4th is the 7th House. This reveals the mother's happiness, the mother's mother (grandmother), and the ultimate psychological peace derived from the home.",
    checksum: "If the 4th house is afflicted but the 7th is strong, the mother has protective support.",
  },
  {
    label: "5th from 5th → 9th",
    source: 5, steps: 5, mode: "mirror",
    interpretation: "The 5th from the 5th is the 9th House. It represents the child's children (grandchildren), and the ultimate future of your creative intelligence.",
    checksum: "If the 5th is weak but the 9th is exalted, your legacy survives through higher learning and dharma.",
  },
  {
    label: "10th from 10th → 7th",
    source: 10, steps: 10, mode: "mirror",
    interpretation: "The 10th from the 10th is the 7th House. While the 10th is your title, the 7th is your independent business and public reception. No supreme career without dealing with the public.",
    checksum: "A strong 10th with a destroyed 7th means high status but no public trust.",
  },
  {
    label: "12th from 2nd → 1st",
    source: 2, steps: 12, mode: "loss",
    interpretation: "The 12th from the 2nd (Wealth) is the 1st House (Self). Spending your wealth on yourself depletes the bank account.",
    checksum: "Self-indulgence is the drain pipe of accumulated wealth.",
  },
  {
    label: "12th from 7th → 6th",
    source: 7, steps: 12, mode: "loss",
    interpretation: "The 12th from the 7th (Marriage) is the 6th House (Conflict). Divorce and arguments destroy the partnership.",
    checksum: "If the 6th is strong and the 7th is weak, the marriage dissolves into litigation.",
  },
  {
    label: "12th from 12th → 11th",
    source: 12, steps: 12, mode: "loss",
    interpretation: "The 12th from the 12th (Loss) is the 11th House (Gains). The loss of a loss is a gain!",
    checksum: "Expenditure (12th) that eliminates another loss creates profit (11th).",
  },
];

// ─── Geometry Helpers ─────────────────────────────────────────
function getHouseAngle(houseNum: number) {
  const deg = -90 - (houseNum - 1) * 30;
  return (deg * Math.PI) / 180;
}

function polar(cx: number, cy: number, r: number, angleRad: number) {
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function getResultHouse(source: number, steps: number): number {
  // Inclusive counting: source is step 1, so we move (steps - 1) houses forward
  let result = source + steps - 1;
  while (result > 12) result -= 12;
  return result;
}

function getCountingPath(source: number, steps: number): number[] {
  const path: number[] = [];
  let current = source;
  for (let i = 0; i < steps; i++) {
    path.push(current);
    current = current === 12 ? 1 : current + 1;
  }
  return path;
}

// ─── Component ────────────────────────────────────────────────
export default function BhavatBhavamMatrixExplorer() {
  const [sourceHouse, setSourceHouse] = useState(4);
  const [steps, setSteps] = useState(4);
  const [mode, setMode] = useState<OperationMode>("mirror");
  const [animating, setAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const resultHouse = useMemo(() => getResultHouse(sourceHouse, steps), [sourceHouse, steps]);
  const countingPath = useMemo(() => getCountingPath(sourceHouse, steps), [sourceHouse, steps]);

  // Auto-animate when inputs change
  useEffect(() => {
    setAnimating(true);
    setAnimationStep(0);
    const interval = setInterval(() => {
      setAnimationStep((prev) => {
        if (prev >= steps) {
          clearInterval(interval);
          return steps;
        }
        return prev + 1;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [sourceHouse, steps, mode]);

  const cx = 280;
  const cy = 280;
  const rOuter = 220;
  const rMid = 160;
  const rLabel = 250;
  const rCount = 190;

  const sourceInfo = HOUSES.find((h) => h.num === sourceHouse)!;
  const resultInfo = HOUSES.find((h) => h.num === resultHouse)!;

  const activePreset = PRESETS.find(
    (p) => p.source === sourceHouse && p.steps === steps && p.mode === mode
  );

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-amber-50/20 to-orange-50/20 rounded-2xl border border-amber-200/60 shadow-lg p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-5">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-900">Bhavat Bhavam Matrix</h3>
        <p className="text-sm text-amber-700 mt-1">
          The recursive house principle. Count inclusively from any house to find its deeper layer.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-amber-200 p-3 sm:p-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">From House</label>
          <select
            value={sourceHouse}
            onChange={(e) => {
              const h = Number(e.target.value);
              setSourceHouse(h);
              if (mode === "mirror") setSteps(h);
              if (mode === "loss") setSteps(12);
            }}
            className="text-sm font-medium rounded-lg border border-gray-200 bg-white px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
          >
            {HOUSES.map((h) => (
              <option key={h.num} value={h.num}>{h.num} — {h.sanskrit} ({h.meaning})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">Operation</label>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {[
              { id: "mirror" as const, label: "Mirror", desc: "X from X" },
              { id: "loss" as const, label: "Loss", desc: "12 from X" },
              { id: "custom" as const, label: "Custom", desc: "N from X" },
            ].map((op) => (
              <button
                key={op.id}
                onClick={() => {
                  setMode(op.id);
                  if (op.id === "mirror") setSteps(sourceHouse);
                  if (op.id === "loss") setSteps(12);
                }}
                className={`px-3 py-2 text-xs font-bold transition-colors ${
                  mode === op.id ? "bg-amber-100 text-amber-800" : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "custom" && (
          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <label className="text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Steps</label>
            <input
              type="range" min={1} max={12} step={1} value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <span className="text-sm font-bold text-amber-800 w-8">{steps}</span>
          </div>
        )}

        <button
          onClick={() => { setSourceHouse(4); setSteps(4); setMode("mirror"); }}
          className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-5">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => { setSourceHouse(preset.source); setSteps(preset.steps); setMode(preset.mode); }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
              activePreset?.label === preset.label
                ? "bg-amber-100 border-amber-400 text-amber-800 shadow-sm"
                : "bg-white border-amber-200 text-amber-700 hover:bg-amber-50"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Formula banner */}
      <div className="rounded-xl border p-3 mb-5 flex items-center gap-3 bg-amber-50/60 border-amber-200">
        <GitBranch className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-800">
            {mode === "mirror" && `Mirror Principle: The ${sourceHouse}${getOrdinal(sourceHouse)} from the ${sourceHouse}${getOrdinal(sourceHouse)}`}
            {mode === "loss" && `12th House Sub-Routine: The 12th from the ${sourceHouse}${getOrdinal(sourceHouse)}`}
            {mode === "custom" && `Custom Query: The ${steps}${getOrdinal(steps)} from the ${sourceHouse}${getOrdinal(sourceHouse)}`}
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            Inclusive counting: House {sourceHouse} is counted as "1." Continue counter-clockwise for {steps - 1} more houses.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-amber-600">Result</span>
          <p className="text-lg font-extrabold text-amber-900">{resultHouse}{getOrdinal(resultHouse)}</p>
        </div>
      </div>

      {/* Main Content: Chart + Details */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left: SVG Chart */}
        <div className="flex-1 flex justify-center min-w-0">
          <svg viewBox="0 0 560 560" className="w-full h-auto max-w-[520px]">
            {/* Outer rim */}
            <circle cx={cx} cy={cy} r={rOuter} fill="#fafafa" stroke="#e2e8f0" strokeWidth={2} />
            <circle cx={cx} cy={cy} r={rOuter - 1} fill="none" stroke="#fff" strokeWidth={2} />
            <circle cx={cx} cy={cy} r={rMid} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />
            <circle cx={cx} cy={cy} r={4} fill="#475569" />

            {/* House spokes */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = getHouseAngle(i + 1);
              const x = cx + rOuter * Math.cos(angle);
              const y = cy + rOuter * Math.sin(angle);
              return <line key={`spoke-${i}`} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth={1.5} />;
            })}

            {/* House wedges */}
            {Array.from({ length: 12 }).map((_, i) => {
              const houseNum = i + 1;
              const angle = getHouseAngle(houseNum);
              const nextAngle = getHouseAngle(houseNum === 12 ? 1 : houseNum + 1);
              const x1 = cx + rOuter * Math.cos(angle);
              const y1 = cy + rOuter * Math.sin(angle);
              const x2 = cx + rOuter * Math.cos(nextAngle);
              const y2 = cy + rOuter * Math.sin(nextAngle);

              const isSource = houseNum === sourceHouse;
              const isResult = houseNum === resultHouse;
              const inPath = countingPath.includes(houseNum);
              const pathIndex = countingPath.indexOf(houseNum);
              const hasAnimated = pathIndex !== -1 && pathIndex < animationStep;

              let fill = "transparent";
              let stroke = "#e2e8f0";
              let strokeWidth = 1;

              if (isSource) {
                fill = "#f59e0b18";
                stroke = "#f59e0b";
                strokeWidth = 2.5;
              } else if (isResult && hasAnimated) {
                fill = "#22c55e18";
                stroke = "#22c55e";
                strokeWidth = 2.5;
              } else if (inPath && hasAnimated) {
                fill = "#e2e8f0";
                stroke = "#94a3b8";
                strokeWidth = 1;
              }

              return (
                <path
                  key={`wedge-${houseNum}`}
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 0 ${x2} ${y2} Z`}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
              );
            })}

            {/* House labels */}
            {Array.from({ length: 12 }).map((_, i) => {
              const houseNum = i + 1;
              const angle = getHouseAngle(houseNum);
              const pos = polar(cx, cy, rLabel, angle);
              const isSource = houseNum === sourceHouse;
              const isResult = houseNum === resultHouse;
              const inPath = countingPath.includes(houseNum);
              const pathIndex = countingPath.indexOf(houseNum);
              const hasAnimated = pathIndex !== -1 && pathIndex < animationStep;

              return (
                <text
                  key={`label-${houseNum}`}
                  x={pos.x} y={pos.y}
                  textAnchor="middle" dominantBaseline="central"
                  className="text-lg font-bold"
                  fill={isSource ? "#d97706" : isResult && hasAnimated ? "#16a34a" : inPath && hasAnimated ? "#64748b" : "#94a3b8"}
                >
                  {houseNum}
                </text>
              );
            })}

            {/* Counting numbers on mid-ring */}
            <AnimatePresence>
              {countingPath.map((h, idx) => {
                if (idx >= animationStep) return null;
                const angle = getHouseAngle(h);
                const pos = polar(cx, cy, rCount, angle);
                const isResult = idx === countingPath.length - 1;

                return (
                  <motion.g
                    key={`count-${h}-${idx}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <circle
                      cx={pos.x} cy={pos.y} r={16}
                      fill={isResult ? "#22c55e" : "#fff"}
                      stroke={isResult ? "#22c55e" : "#f59e0b"}
                      strokeWidth={2}
                    />
                    <text
                      x={pos.x} y={pos.y + 1}
                      textAnchor="middle" dominantBaseline="central"
                      fontSize={12} fontWeight={800}
                      fill={isResult ? "#fff" : "#d97706"}
                    >
                      {idx + 1}
                    </text>
                  </motion.g>
                );
              })}
            </AnimatePresence>

            {/* Arc from source to result */}
            <AnimatePresence>
              {animationStep >= steps && (
                <motion.path
                  d={describeArc(cx, cy, rOuter - 10, getHouseAngle(sourceHouse), getHouseAngle(resultHouse))}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>

            {/* Center label */}
            <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700} fill="#94a3b8">
              Bhavat
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="central" fontSize={10} fill="#cbd5e1">
              From House
            </text>
          </svg>
        </div>

        {/* Right: Details Panel */}
        <div className="lg:w-96 shrink-0 space-y-4 w-full">
          {/* Counting Steps Card */}
          <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wide">Inclusive Counting</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {countingPath.map((h, idx) => (
                <React.Fragment key={idx}>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={idx < animationStep ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.3 }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold ${
                      idx === 0 ? "bg-amber-50 border-amber-300 text-amber-800" :
                      idx === countingPath.length - 1 ? "bg-green-50 border-green-300 text-green-800" :
                      "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white ${
                      idx === 0 ? "bg-amber-500" : idx === countingPath.length - 1 ? "bg-green-500" : "bg-gray-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <span>H{h}</span>
                    <span className="text-gray-400 font-normal">{HOUSES[h - 1].sanskrit}</span>
                  </motion.div>
                  {idx < countingPath.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-gray-300 self-center" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Result Card */}
          <motion.div
            key={`${sourceHouse}-${steps}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <h4 className="text-xs font-bold text-green-700 uppercase tracking-wide">Result</h4>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-extrabold shadow-sm bg-green-600">
                {resultHouse}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{resultInfo.sanskrit} · {resultInfo.meaning}</p>
                <p className="text-xs text-gray-500">{resultInfo.keywords.join(" · ")}</p>
              </div>
            </div>
            {activePreset ? (
              <>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">{activePreset.interpretation}</p>
                <div className="p-2.5 rounded-lg bg-white border border-green-200">
                  <p className="text-[11px] text-green-800 leading-relaxed">
                    <span className="font-bold">Professional Checksum:</span> {activePreset.checksum}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-600 leading-relaxed">
                The {steps}{getOrdinal(steps)} from the {sourceHouse}{getOrdinal(sourceHouse)} reveals the deeper structural layer of{" "}
                <strong>{sourceInfo.meaning.toLowerCase()}</strong>, as expressed through the domain of{" "}
                <strong>{resultInfo.meaning.toLowerCase()}</strong>.
              </p>
            )}
          </motion.div>

          {/* Source House Reference */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Source House</h4>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm bg-amber-500">
                {sourceHouse}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{sourceInfo.sanskrit} · {sourceInfo.meaning}</p>
                <p className="text-xs text-gray-500">{sourceInfo.keywords.join(" · ")}</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3.5 h-3.5 text-gray-500" />
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">How It Works</h4>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500" />
                <span className="text-[11px] text-gray-600">Source house (count starts here as "1")</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span className="text-[11px] text-gray-600">Result house (the derivative / Bhavat Bhavam)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-amber-500 flex items-center justify-center text-[8px] font-bold text-amber-600">3</div>
                <span className="text-[11px] text-gray-600">Counting badge — shows inclusive step number</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 border-b-2 border-dashed border-green-500" />
                <span className="text-[11px] text-gray-600">Arc connecting source to result</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Senior Astrologer Note */}
      <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-bold">Senior Astrologer Note:</span>{" "}
            Without Bhavat Bhavam, a beginner looks at an afflicted 9th house and says, "Your father will suffer."
            But a professional checks the 9th from the 9th (the 5th house). If the 5th is incredibly strong,
            the father has a protective shield. Bhavat Bhavam is your <strong>checksum</strong> — never skip it.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Utilities ────────────────────────────────────────────────
function getOrdinal(n: number): string {
  return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  // Normalize angles for counter-clockwise arc
  let start = startAngle;
  let end = endAngle;

  // Ensure we go counter-clockwise (the shorter arc in the direction of house numbering)
  const diff = end - start;
  if (diff > 0) {
    // If end > start, we need to go the long way around (counter-clockwise from start to end means decreasing angle)
    end = end - 2 * Math.PI;
  }

  const startX = cx + r * Math.cos(start);
  const startY = cy + r * Math.sin(start);
  const endX = cx + r * Math.cos(end);
  const endY = cy + r * Math.sin(end);
  const largeArc = Math.abs(end - start) > Math.PI ? 1 : 0;

  return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 0 ${endX} ${endY}`;
}
