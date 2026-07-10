"use client";

import { useState } from "react";
import { Info, ShieldAlert, Lock, Unlock, CheckCircle, FileText, RefreshCw } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

export function WriteUpStructureScaffolder() {
  const [part1, setPart1] = useState("");
  const [part2, setPart2] = useState("");
  const [part3, setPart3] = useState("unset");
  const [part4, setPart4] = useState("");
  const [part5, setPart5] = useState("");

  const loadTemplate = () => {
    setPart1("Lagna: Virgo, exalted Lagna-and-10th lord Mercury in D1. Professional rise query.");
    setPart2("1. 10th lord exalted in kendra (strong promise).\n2. Vimshottari MD Mercury active (timing window).\n3. Jupiter-Saturn double transit on 10th (trigger).");
    setPart3("strong");
    setPart4("Birth time margin of error +/- 5 mins; Lahiri ayanamsha used; check D10 transit aspect next.");
    setPart5("Stated the indication of career advancement during the transit window. Framed as a strong tendency, not fate. Encouraged professional resume updates.");
  };

  const resetFields = () => {
    setPart1("");
    setPart2("");
    setPart3("unset");
    setPart4("");
    setPart5("");
  };

  // Live trigger validations
  const isPart1Valid = part1.trim().length >= 10;
  const isPart2Valid = part2.trim().length >= 15;
  const isPart3Valid = part3 !== "unset";
  const isPart4Valid = part4.trim().length >= 10;
  const isPart5Valid = part5.trim().length >= 15;

  let progress = 0;
  if (isPart1Valid) progress += 20;
  if (isPart2Valid) progress += 20;
  if (isPart3Valid) progress += 20;
  if (isPart4Valid) progress += 20;
  if (isPart5Valid) progress += 20;

  // Search for deterministic phrasing violations
  const lowerPart1 = part1.toLowerCase();
  const lowerPart2 = part2.toLowerCase();
  const lowerPart4 = part4.toLowerCase();
  const lowerPart5 = part5.toLowerCase();
  const hasDeterministicViolation =
    lowerPart1.includes("will ") || lowerPart1.includes("definitely") ||
    lowerPart2.includes("will ") || lowerPart2.includes("definitely") ||
    lowerPart4.includes("will ") || lowerPart4.includes("definitely") ||
    lowerPart5.includes("will ") || lowerPart5.includes("definitely");

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="write-up-structure-scaffolder"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Predictive Write-Up Scaffolder
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Scaffold the standard 5-part written reading format (sandarbha to hitena vacasā)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadTemplate}
            className="px-3 py-1.5 bg-amber-800 text-white rounded hover:bg-amber-900 text-xs font-sans font-bold shadow-sm flex items-center gap-1"
          >
            <FileText size={14} /> Load Preset Template
          </button>
          <button
            onClick={resetFields}
            className="px-2.5 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-xs font-sans font-bold shadow-sm flex items-center gap-1"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor workspace */}
        <div className="lg:col-span-2 space-y-5">
          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: GOLD }}>
                Part 1: Chart Context (sandarbhaṁ)
              </label>
              <span className={`text-xs font-sans font-bold ${isPart1Valid ? "text-green-700" : "text-gray-400"}`}>
                {isPart1Valid ? "✓ Active" : "✗ Minimum 10 chars"}
              </span>
            </div>
            <textarea
              value={part1}
              onChange={(e) => setPart1(e.target.value)}
              placeholder="e.g. Leo Lagna, 10th lord Venus in 10th house. Professional timing query..."
              className="w-full h-16 p-2 text-xs border rounded bg-white/50 focus:outline-none"
              style={{ borderColor: HAIRLINE }}
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: GOLD }}>
                Part 2: Evidentiary Grounds (hetum)
              </label>
              <span className={`text-xs font-sans font-bold ${isPart2Valid ? "text-green-700" : "text-gray-400"}`}>
                {isPart2Valid ? "✓ Active" : "✗ Minimum 15 chars"}
              </span>
            </div>
            <textarea
              value={part2}
              onChange={(e) => setPart2(e.target.value)}
              placeholder="List independent tripod grounds (Promise,Timing,Trigger)..."
              className="w-full h-16 p-2 text-xs border rounded bg-white/50 focus:outline-none"
              style={{ borderColor: HAIRLINE }}
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: GOLD }}>
                Part 3: Confidence Weight (balaṁ)
              </label>
              <span className={`text-xs font-sans font-bold ${isPart3Valid ? "text-green-700" : "text-gray-400"}`}>
                {isPart3Valid ? "✓ Active" : "✗ Select tier"}
              </span>
            </div>
            <select
              value={part3}
              onChange={(e) => setPart3(e.target.value)}
              className="w-full p-2 text-xs border rounded bg-white/50 focus:outline-none font-sans font-semibold"
              style={{ borderColor: HAIRLINE }}
            >
              <option value="unset">-- Select Confidence Tier --</option>
              <option value="strong">Strong (3+ converging indicators)</option>
              <option value="moderate">Moderate (2 converging indicators)</option>
              <option value="weak">Weak / Possibility (1 indicator)</option>
              <option value="none">No Prediction (contradictory / zero indicators)</option>
            </select>
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: GOLD }}>
                Part 4: Boundaries & Technical Caveats (sīmāṁ)
              </label>
              <span className={`text-xs font-sans font-bold ${isPart4Valid ? "text-green-700" : "text-gray-400"}`}>
                {isPart4Valid ? "✓ Active" : "✗ Minimum 10 chars"}
              </span>
            </div>
            <textarea
              value={part4}
              onChange={(e) => setPart4(e.target.value)}
              placeholder="e.g. Birth time precision margin, boundary planet proximity cautions..."
              className="w-full h-16 p-2 text-xs border rounded bg-white/50 focus:outline-none"
              style={{ borderColor: HAIRLINE }}
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold flex items-center gap-1.5" style={{ color: GOLD }}>
                Part 5: Ethical Framing & Routing (hitena vacasā)
              </label>
              <span className={`text-xs font-sans font-bold ${isPart5Valid ? "text-green-700" : "text-gray-400"}`}>
                {isPart5Valid ? "✓ Active" : "✗ Minimum 15 chars"}
              </span>
            </div>
            <textarea
              value={part5}
              onChange={(e) => setPart5(e.target.value)}
              placeholder="Describe agency-supporting actions. Avoid decrees or death warnings..."
              className="w-full h-16 p-2 text-xs border rounded bg-white/50 focus:outline-none"
              style={{ borderColor: HAIRLINE }}
            />
          </div>
        </div>

        {/* Progress & Lock side-dashboard */}
        <div className="p-6 rounded-xl border bg-white/40 shadow-inner flex flex-col justify-between" style={{ borderColor: HAIRLINE }}>
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ color: GOLD }}>Progress Dashboard</h3>

            {/* Circular Progress Gauge */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke={progress === 100 ? "#15803d" : "#b45309"}
                  strokeDasharray={`${progress}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute text-2xl font-bold font-sans text-gray-800">{progress}%</div>
            </div>

            {/* Completeness Checklist */}
            <div className="space-y-2 text-xs font-sans font-semibold">
              <div className="flex items-center gap-2">
                <span className={isPart1Valid ? "text-green-700 font-bold" : "text-gray-400"}>{isPart1Valid ? "✓" : "✗"}</span>
                <span>Part 1: Context (sandarbhaṁ)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={isPart2Valid ? "text-green-700 font-bold" : "text-gray-400"}>{isPart2Valid ? "✓" : "✗"}</span>
                <span>Part 2: Indicators (hetum)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={isPart3Valid ? "text-green-700 font-bold" : "text-gray-400"}>{isPart3Valid ? "✓" : "✗"}</span>
                <span>Part 3: Confidence (balaṁ)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={isPart4Valid ? "text-green-700 font-bold" : "text-gray-400"}>{isPart4Valid ? "✓" : "✗"}</span>
                <span>Part 4: Technical Caveats (sīmāṁ)</span>
              </div>
              <div className="flex items-center gap-2 font-extrabold text-amber-950">
                <span className={isPart5Valid ? "text-green-700" : "text-red-700"}>{isPart5Valid ? "✓" : "✗"}</span>
                <span>Part 5: Ethical Frame (hitena vacasā)</span>
              </div>
            </div>
          </div>

          {/* Warnings and locks */}
          <div className="mt-6 border-t pt-4" style={{ borderColor: HAIRLINE }}>
            {hasDeterministicViolation && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-red-900 text-xs mb-3 flex items-start gap-1.5">
                <ShieldAlert size={16} className="shrink-0 mt-0.5 text-red-700" />
                <div>
                  <strong>Deterministic Phrasing Warning:</strong> Detects absolute words ('will' or 'definitely'). Calibrate your language to describe propensities and windows of capability.
                </div>
              </div>
            )}

            {isPart5Valid ? (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-900 text-sm font-sans font-bold flex items-center gap-1.5">
                <Unlock size={18} className="text-green-700" />
                <span>Reading Unlocked for Export</span>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-sm font-sans font-bold flex items-center gap-1.5 animate-pulse">
                <Lock size={18} className="text-red-700" />
                <span>Locked: Ethics Check Failed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
