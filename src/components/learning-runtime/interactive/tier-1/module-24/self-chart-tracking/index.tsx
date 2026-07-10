"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ShieldCheck, AlertTriangle, Target, Calendar, AlertCircle } from "lucide-react";
import { goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5C3D26)";
const INK_MUTED = "var(--gl-ink-muted, #7C6D5B)";
const GOLD = "#A8821E";
const VERMILION = "#A23A1E";
const GREEN = "#2E7D32";

export function SelfChartTracking() {
  const [activeTab, setActiveTab] = useState<"ledger" | "ex1" | "ex2" | "ex3">("ledger");

  // Custom ledger states
  const [specificity, setSpecificity] = useState<string>("moderate");
  const [window, setWindow] = useState<string>("moderate");
  const [outcome, setOutcome] = useState<string>("partial");
  const [classification, setClassification] = useState<string>("partial_hit");

  // Example 1 states (Career Transition)
  const [ex1Class, setEx1Class] = useState<string>("none");

  // Example 2 states (Health Event)
  const [ex2Class, setEx2Class] = useState<string>("none");

  // Calculations & Verdicts
  let calibrationScore = 50;
  let feedbackText = "";
  let biasWarning = false;
  let compliance: "empowered" | "dependent" | "neglect" = "empowered";

  if (activeTab === "ledger") {
    if (outcome === "mismatch" && classification === "hit") {
      biasWarning = true;
      calibrationScore = 5;
      compliance = "dependent";
      feedbackText = "Hindsight Bias warning! Retrofitting a mismatch as a Hit compromises your journal's integrity.";
    } else if (outcome === "mismatch" && classification === "partial_hit") {
      biasWarning = true;
      calibrationScore = 15;
      compliance = "dependent";
      feedbackText = "Inflated Hit rating. A complete event mismatch cannot be classified as a partial hit.";
    } else if (specificity === "vague" && classification === "hit") {
      calibrationScore = 30;
      compliance = "neglect";
      feedbackText = "Fortune-Cookie tracking. Logged as a Hit, but your prediction was too vague to be falsified. Yields low learning value.";
    } else if (outcome === "mismatch" && classification === "miss") {
      calibrationScore = 90;
      compliance = "empowered";
      feedbackText = "Highly calibrated. Logging a Miss honestly is the core discipline of self-tracking. It refines your technique reliability data.";
    } else if (outcome === "match" && classification === "hit" && specificity === "precise" && window === "precise") {
      calibrationScore = 100;
      compliance = "empowered";
      feedbackText = "Gold standard. A precise, timestamped prediction matched exactly and was logged honestly. This builds genuine predictive skill.";
    } else if (classification === "ambiguous" && (specificity === "vague" || outcome === "vague")) {
      calibrationScore = 70;
      compliance = "empowered";
      feedbackText = "Intellectually honest. Acknowledging that vague predictions or ambiguous outcomes are undecidable protects against hit-inflation.";
    } else {
      calibrationScore = 60;
      feedbackText = "Disciplined tracking. Keep logging predictions prior to the event window and classify outcomes with absolute self-speech honesty.";
    }
  } else if (activeTab === "ex1") {
    // Career transition example: should be a Hit
    if (ex1Class === "hit") {
      calibrationScore = 100;
      compliance = "empowered";
      feedbackText = "Correct classification: HIT. Event-class (resignation + higher responsibility), timing (Oct 22 in Sept-Dec window), and character (voluntary) all match perfectly.";
    } else if (ex1Class !== "none") {
      biasWarning = true;
      calibrationScore = 40;
      compliance = "dependent";
      feedbackText = "Underrating. This is a full Hit. Logged dimensions (class, timing, character) align exactly. Mismatching it reduces calibration data quality.";
    }
  } else if (activeTab === "ex2") {
    // Health event mismatch: should be a Miss
    if (ex2Class === "miss") {
      calibrationScore = 100;
      compliance = "empowered";
      feedbackText = "Correct classification: MISS. No acute health event occurred in Q2. Honest logging resists the temptation to retrofit work stress as 'Mars transit energy' in the 6th house.";
    } else if (ex2Class === "hit" || ex2Class === "partial_hit") {
      biasWarning = true;
      calibrationScore = 5;
      compliance = "dependent";
      feedbackText = "HINDSIGHT BIAS DETECTED: Trying to stretch 'unusually busy at work' as a health hit violates the predicted-before-observed discipline.";
    } else if (ex2Class === "ambiguous") {
      calibrationScore = 40;
      compliance = "neglect";
      feedbackText = "Incorrect. The prediction was specific (acute illness/injury requiring medical check) and the outcome was clear (no illness, checkup only). This is a clear Miss.";
    }
  }

  return (
    <div
      className="w-full animate-fadeIn"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${goldOnGlassHairline}`,
        borderRadius: 16,
        padding: "24px 26px 20px",
        color: INK_PRIMARY,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        boxShadow: "0 14px 40px rgba(62, 42, 31, 0.08)",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 border-b pb-4" style={{ borderColor: HAIRLINE }}>
        <div className="flex items-center gap-2">
          <Target size={16} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Module 24 • Chapter 4 • Lesson 3
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Hits-and-Misses Transit Journal Simulator
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Master the predicted-before-observed discipline. Audit your calibration accuracy and avoid hindsight bias retrofitting.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        {[
          { id: "ledger", label: "Custom Journal Ledger" },
          { id: "ex1", label: "Example 1: Career Transition" },
          { id: "ex2", label: "Example 2: Health Event" },
          { id: "ex3", label: "Example 3: Three-Axis Stats" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="pb-2 px-1 text-xs font-bold transition-all relative"
            style={{
              color: activeTab === tab.id ? GOLD : INK_SECONDARY,
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: GOLD }}
                layoutId="activeTabUnderline3"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      {activeTab === "ledger" && (
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          {/* Controls */}
          <div className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>
                1. Prediction Specificity
              </span>
              <div className="flex gap-2">
                {[
                  { id: "vague", label: "Vague ('General Growth')" },
                  { id: "moderate", label: "Moderate ('Career Shift')" },
                  { id: "precise", label: "Precise ('Promotion Exceeding Rank')" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSpecificity(s.id)}
                    className="flex-1 py-2 px-3 rounded-lg border text-center text-xs font-bold transition-all"
                    style={{
                      background: specificity === s.id ? SURFACE_2 : SURFACE,
                      borderColor: specificity === s.id ? GOLD : HAIRLINE,
                      color: specificity === s.id ? INK_PRIMARY : INK_SECONDARY,
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>
                2. Time Window
              </span>
              <div className="flex gap-2">
                {[
                  { id: "wide", label: "Wide (5-Year range)" },
                  { id: "moderate", label: "Moderate (6-Month)" },
                  { id: "precise", label: "Precise (1-Month Transit)" },
                ].map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setWindow(w.id)}
                    className="flex-1 py-2 px-3 rounded-lg border text-center text-xs font-bold transition-all"
                    style={{
                      background: window === w.id ? SURFACE_2 : SURFACE,
                      borderColor: window === w.id ? GOLD : HAIRLINE,
                      color: window === w.id ? INK_PRIMARY : INK_SECONDARY,
                    }}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>
                3. Observed Outcome
              </span>
              <div className="flex gap-2">
                {[
                  { id: "match", label: "Exact Match" },
                  { id: "partial", label: "Partial Match" },
                  { id: "mismatch", label: "Mismatch" },
                  { id: "vague", label: "Vague Outcome" },
                ].map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setOutcome(o.id)}
                    className="flex-1 py-2 px-3 rounded-lg border text-center text-xs font-bold transition-all"
                    style={{
                      background: outcome === o.id ? SURFACE_2 : SURFACE,
                      borderColor: outcome === o.id ? GOLD : HAIRLINE,
                      color: outcome === o.id ? INK_PRIMARY : INK_SECONDARY,
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>
                4. Select Journal Entry Classification
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "hit", label: "Hit" },
                  { id: "partial_hit", label: "Partial Hit" },
                  { id: "miss", label: "Miss" },
                  { id: "ambiguous", label: "Ambiguous" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setClassification(c.id)}
                    className="py-2 px-2 rounded-lg border text-center text-xs font-bold transition-all"
                    style={{
                      background: classification === c.id ? SURFACE_2 : SURFACE,
                      borderColor: classification === c.id ? GOLD : HAIRLINE,
                      color: classification === c.id ? INK_PRIMARY : INK_SECONDARY,
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Verification display */}
          <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Timestamped Verification Timeline
              </span>
              <div className="flex justify-center rounded-xl p-2 my-3 border bg-white" style={{ borderColor: HAIRLINE }}>
                <svg width="320" height="120" viewBox="0 0 320 120">
                  <line x1="45" y1="60" x2="275" y2="60" stroke="rgba(168,130,30,0.2)" strokeWidth="1.5" />
                  <circle cx="70" cy="60" r="8" fill={GOLD} />
                  <rect x="145" y="50" width="30" height="20" rx="2" fill="rgba(168,130,30,0.1)" stroke={GOLD} strokeWidth="1" />
                  <circle cx="250" cy="60" r="8" fill={biasWarning ? VERMILION : GREEN} />
                  <text x="70" y="92" fill={INK_SECONDARY} fontSize="9" fontWeight="bold" textAnchor="middle">Pre-Event Lock</text>
                  <text x="160" y="92" fill={INK_SECONDARY} fontSize="9" fontWeight="bold" textAnchor="middle">Window</text>
                  <text x="250" y="92" fill={INK_SECONDARY} fontSize="9" fontWeight="bold" textAnchor="middle">Post-Event Log</text>
                </svg>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Calibration Index:</span>
                    <span style={{ color: calibrationScore > 50 ? GREEN : VERMILION }}>{calibrationScore}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                    <div className="h-full" style={{ width: `${calibrationScore}%`, background: calibrationScore > 50 ? GREEN : VERMILION }} />
                  </div>
                </div>

                {biasWarning && (
                  <div className="flex items-center gap-1.5 p-2 rounded bg-red-50 border border-red-200 text-[9px] text-red-800 font-semibold">
                    <AlertCircle size={12} className="flex-shrink-0" />
                    <span>Hindsight bias: Check classification honesty.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t" style={{ borderColor: HAIRLINE }}>
              <div
                className="p-3 rounded-lg flex items-start gap-2.5 text-[11px] leading-normal border"
                style={{
                  background: SURFACE_2,
                  borderColor: compliance === "empowered" ? `${GREEN}33` : `${VERMILION}33`,
                }}
              >
                {compliance === "empowered" ? (
                  <ShieldCheck size={15} color={GREEN} className="flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={15} color={VERMILION} className="flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block text-[10px]" style={{ color: compliance === "empowered" ? GREEN : VERMILION }}>
                    {compliance === "empowered" ? "Honest Tracking Compliance" : "Hindsight/Drift Alert"}
                  </span>
                  <p className="m-0 mt-0.5 text-[9px]" style={{ color: INK_SECONDARY }}>{feedbackText}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === "ex1" && (
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-4 text-xs">
            <div className="p-3 rounded bg-amber-50 border border-amber-200" style={{ color: INK_PRIMARY }}>
              <strong>Pre-Event Journal Entry (Verifiable Date: 2026-08-30)</strong>
              <ul className="m-0 mt-1 pl-4 list-disc space-y-0.5 text-[11px]" style={{ color: INK_SECONDARY }}>
                <li><strong>Window:</strong> 2026-09 to 2026-12 (4 months)</li>
                <li><strong>Predicted:</strong> Career transition. Voluntary resignation followed by new position with higher responsibility.</li>
                <li><strong>Chart Basis:</strong> Vimśottarī Saturn-Mercury antardaśā. Transit Saturn 4H-aspecting-10H Sun. Jupiter transit aspecting 10H Mars.</li>
                <li><strong>Confidence:</strong> Moderate-High (70-75%).</li>
              </ul>
            </div>
            
            <div className="p-3 rounded bg-stone-100 border border-stone-300" style={{ color: INK_PRIMARY }}>
              <strong>Post-Event Outcome Observation (Recorded: 2026-12-08)</strong>
              <p className="m-0 mt-1 text-[11px]" style={{ color: INK_SECONDARY }}>
                New promotion offer accepted 2026-10-22. Started role 2026-11-15. Voluntary career transition with team-leadership and broader domain scope.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-bold uppercase tracking-wider text-[10px]" style={{ color: GOLD }}>
                Select how you would log this in your journal:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {["hit", "partial_hit", "miss", "ambiguous"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setEx1Class(c)}
                    className="p-2 rounded border font-bold capitalize text-center transition-all text-[11px]"
                    style={{
                      background: ex1Class === c ? SURFACE_2 : SURFACE,
                      borderColor: ex1Class === c ? GOLD : HAIRLINE,
                    }}
                  >
                    {c.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: GOLD }}>
                Example 1 Analysis Verdict
              </span>
              <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                {ex1Class === "none" ? "Select a classification on the left to run the auditor." : feedbackText}
              </p>
            </div>
            <div className="pt-3 border-t" style={{ borderColor: HAIRLINE }}>
              <div className="flex justify-between text-[10px] font-bold">
                <span>Calibration score:</span>
                <span style={{ color: compliance === "empowered" ? GREEN : VERMILION }}>{calibrationScore}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ex2" && (
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-4 text-xs">
            <div className="p-3 rounded bg-amber-50 border border-amber-200" style={{ color: INK_PRIMARY }}>
              <strong>Pre-Event Journal Entry (Verifiable Date: 2026-02-15)</strong>
              <ul className="m-0 mt-1 pl-4 list-disc space-y-0.5 text-[11px]" style={{ color: INK_SECONDARY }}>
                <li><strong>Window:</strong> 2026-Q2 (April through June)</li>
                <li><strong>Predicted:</strong> Health event. Acute illness or injury requiring medical checkup beyond routine.</li>
                <li><strong>Chart Basis:</strong> Transit Mars entering 6H (illness). Saturn transiting 8H. Dasha: Mars-Saturn.</li>
                <li><strong>Confidence:</strong> Low-Moderate (40-50%).</li>
              </ul>
            </div>
            
            <div className="p-3 rounded bg-stone-100 border border-stone-300" style={{ color: INK_PRIMARY }}>
              <strong>Post-Event Outcome Observation (Recorded: 2026-07-05)</strong>
              <p className="m-0 mt-1 text-[11px]" style={{ color: INK_SECONDARY }}>
                No acute illness or injury in Q2. Only routine check-up. Experienced heavy stress and busy periods at work, but health remained fine.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-bold uppercase tracking-wider text-[10px]" style={{ color: GOLD }}>
                Select how you would log this in your journal:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {["hit", "partial_hit", "miss", "ambiguous"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setEx2Class(c)}
                    className="p-2 rounded border font-bold capitalize text-center transition-all text-[11px]"
                    style={{
                      background: ex2Class === c ? SURFACE_2 : SURFACE,
                      borderColor: ex2Class === c ? GOLD : HAIRLINE,
                    }}
                  >
                    {c.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: GOLD }}>
                Example 2 Analysis Verdict
              </span>
              <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                {ex2Class === "none" ? "Select a classification on the left to run the auditor." : feedbackText}
              </p>
            </div>
            <div className="pt-3 border-t" style={{ borderColor: HAIRLINE }}>
              <div className="flex justify-between text-[10px] font-bold">
                <span>Calibration score:</span>
                <span style={{ color: compliance === "empowered" ? GREEN : VERMILION }}>{calibrationScore}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ex3" && (
        <div className="flex flex-col gap-4 text-xs">
          <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Example 3: Three-Axis Integration Statistics
            </span>
            <p className="m-0 text-xs leading-relaxed" style={{ color: INK_PRIMARY }}>
              After 3 years of journal keeping, you aggregate ~40 pre-event/post-event entries. The statistical patterns reveal critical calibration points:
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Dasha-Only Predictions", rate: 45, desc: "12 entries logged without transit confirmation. Hit-rate is poor, suggesting dasha alone is too wide for precise events." },
              { title: "Dasha + Transit Confirmed", rate: 70, desc: "15 entries showing convergent alignment. Represents your highest prediction accuracy window." },
              { title: "Transit-Only Predictions", rate: 40, desc: "8 entries logged. Suggests transit triggers without active dasha focus produce mostly noise." },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-lg border flex flex-col justify-between gap-3 bg-white" style={{ borderColor: HAIRLINE }}>
                <div>
                  <span className="font-bold block text-[11px]" style={{ color: GOLD }}>{stat.title}</span>
                  <p className="m-0 text-[10px] leading-relaxed mt-1" style={{ color: INK_SECONDARY }}>{stat.desc}</p>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span>Aggregate Hit Rate:</span>
                    <span style={{ color: stat.rate > 50 ? GREEN : GOLD }}>{stat.rate}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                    <div className="h-full" style={{ width: `${stat.rate}%`, background: stat.rate > 50 ? GREEN : GOLD }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-lg border bg-stone-50 border-stone-200 leading-normal text-[10px]" style={{ color: INK_SECONDARY }}>
            <strong>How the practitioner integrates this data (Section 6 Example 3):</strong>
            <ul className="m-0 mt-1 pl-4 list-disc space-y-1">
              <li><strong>Svādhyāya (Text study):</strong> Returns to BPHS Chapters 47-48 to study how dasha-lords direct transits.</li>
              <li><strong>Satsaṅga (Peer review):</strong> Brings the 40-chart summary to their peer circle to compare hit-rates and debate calculations.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Sloka Footer */}
      <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: HAIRLINE }}>
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Yoga Sūtras of Patañjali 2.32 — Niyama Self-Study
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          शौचसन्तोषतपःस्वाध्यायेश्वरप्रणिधानानि नियमाः॥ २.३२॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          śauca-saṁtoṣa-tapaḥ-svādhyāyeśvarapraṇidhānāni niyamāḥ || 2.32 ||
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;Purity, contentment, austerity, self-study, and surrender to Īśvara — these are the niyamas.&rdquo;
        </p>
      </div>

    </div>
  );
}
