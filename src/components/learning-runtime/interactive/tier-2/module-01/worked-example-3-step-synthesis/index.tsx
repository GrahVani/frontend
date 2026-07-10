"use client";

import { useMemo, useState } from "react";
import { Info, CheckCircle2, ClipboardCopy, Lock, Unlock, Sparkles } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  ARIES_DASHAS,
  CHARTS,
  DOMAINS,
  VIRGO_DASHAS,
  type DomainKey,
} from '@/components/learning-runtime/interactive/three-step-shared-data';

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

export function WorkedExample3StepSynthesis() {
  const [selectedChartId, setSelectedChartId] = useState<string>("virgo-teach");
  const [selectedDomainKey, setSelectedDomainKey] = useState<DomainKey>("career");
  const [promiseVerdict, setPromiseVerdict] = useState<"strong" | "qualified" | "absent" | "">("");
  const [timelineAge, setTimelineAge] = useState<number>(35);
  const [windowVerdict, setWindowVerdict] = useState<"active" | "partial" | "dormant" | "">("");
  const [transitMonthOffset, setTransitMonthOffset] = useState<number>(6);
  const [activeStepTab, setActiveStepTab] = useState<1 | 2 | 3 | 4>(1);

  // Practitioner Log states
  const [logContext, setLogContext] = useState("");
  const [logIndicators, setLogIndicators] = useState("");
  const [logTier, setLogTier] = useState("");
  const [logCaveats, setLogCaveats] = useState("");
  const [logEthics, setLogEthics] = useState("");

  const chart = useMemo(
    () => CHARTS.find((c) => c.id === selectedChartId) || CHARTS[0],
    [selectedChartId],
  );

  const domain = useMemo(
    () => DOMAINS.find((d) => d.key === selectedDomainKey) || DOMAINS[0],
    [selectedDomainKey],
  );

  const dashaList = selectedChartId === "virgo-teach" ? VIRGO_DASHAS : ARIES_DASHAS;
  const currentDashaPeriod = useMemo(() => {
    return dashaList.find((d) => timelineAge >= d.ageStart && timelineAge < d.ageEnd) || dashaList[0];
  }, [timelineAge, dashaList]);

  const finalConfidenceTier = useMemo(() => {
    if (promiseVerdict === "absent" || windowVerdict === "dormant") {
      return "No Prediction Defensible";
    }
    if (promiseVerdict === "strong" && windowVerdict === "active") {
      return "Strong Indication";
    }
    if (promiseVerdict === "qualified" || windowVerdict === "partial") {
      return "Moderate Indication";
    }
    return "Weak Indication";
  }, [promiseVerdict, windowVerdict]);

  const exportLocked = !logEthics.trim() || !logCaveats.trim();

  const handleCopyDraft = () => {
    if (exportLocked) return;

    const text = `=== 3-STEP PROTOCOL PRACTITIONER LOG ===
Chart: ${chart.name}
Domain: ${domain.label}
Promise Verdict: ${promiseVerdict || "Unset"}
Timing Window Verdict: ${windowVerdict || "Unset"}
Final Confidence Tier: ${finalConfidenceTier}

1. CONTEXT:
${logContext || "Unwritten"}

2. INDICATORS:
${logIndicators || "Unwritten"}

3. CONFIDENCE TIER RATIONALE:
${logTier || "Unwritten"}

4. CAVEATS & CONDITIONS:
${logCaveats || "Unwritten"}

5. ETHICAL BOUNDARIES & CLIENT CARE:
${logEthics || "Unwritten"}`;

    navigator.clipboard.writeText(text);
    alert("Draft log template copied to clipboard!");
  };

  // Sanskrit text highlighting states
  let activeVersePart: "promise" | "timing" | "synthesis" | "none" = "none";
  if (promiseVerdict && windowVerdict && activeStepTab === 4) {
    activeVersePart = "synthesis";
  } else if (promiseVerdict && activeStepTab === 2) {
    activeVersePart = "timing";
  } else {
    activeVersePart = "promise";
  }

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="worked-example-3-step-synthesis"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            Worked Example: 3-Step Protocol Synthesis
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Synthesize Natal Promise, Vimshottari Dasha, and Gochara transits
          </p>
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1 font-bold font-sans" style={{ color: GOLD }}>
              Select Chart
            </label>
            <select
              value={selectedChartId}
              onChange={(e) => {
                setSelectedChartId(e.target.value);
                setPromiseVerdict("");
                setWindowVerdict("");
                setActiveStepTab(1);
              }}
              className="px-2 py-1 text-sm border rounded bg-transparent font-sans font-semibold"
              style={{ borderColor: HAIRLINE }}
            >
              {CHARTS.map((c) => (
                <option key={c.id} value={c.id} style={{ background: SURFACE }}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider mb-1 font-bold font-sans" style={{ color: GOLD }}>
              Domain
            </label>
            <select
              value={selectedDomainKey}
              onChange={(e) => setSelectedDomainKey(e.target.value as DomainKey)}
              className="px-2 py-1 text-sm border rounded bg-transparent font-sans font-semibold"
              style={{ borderColor: HAIRLINE }}
            >
              {DOMAINS.map((d) => (
                <option key={d.key} value={d.key} style={{ background: SURFACE }}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Funnel and Stepper Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
        {/* SVG Funnel Visualizer (Left Column) */}
        <div className="flex flex-col items-center justify-center p-6 border rounded-xl bg-white/40 shadow-inner" style={{ borderColor: HAIRLINE }}>
          <span className="text-xs uppercase tracking-wider mb-4 font-bold font-sans text-gray-500">Protocol Funnel</span>
          <svg className="w-full max-w-[160px] h-56" viewBox="0 0 60 95">
            {/* Outer Funnel Shape */}
            <path
              d="M 5 10 L 15 50 L 25 80 L 35 80 L 45 50 L 55 10 Z"
              fill="none"
              stroke="#b45309"
              strokeWidth="1.5"
            />

            {/* Ball/Indicator Dropping through gates based on tab */}
            {activeStepTab === 1 && (
              <circle cx="30" cy="20" r="4" fill="#d97706" className="animate-pulse" />
            )}
            {activeStepTab === 2 && (
              <circle cx="30" cy="45" r="4" fill="#3b82f6" className="animate-pulse" />
            )}
            {activeStepTab === 3 && (
              <circle cx="30" cy="70" r="4" fill="#7c3aed" className="animate-pulse" />
            )}
            {activeStepTab === 4 && (
              <circle cx="30" cy="84" r="3.5" fill="#16a34a" />
            )}

            {/* Gate 1 */}
            <line x1="8" y1="25" x2="52" y2="25" stroke={promiseVerdict ? "#16a34a" : "#94a3b8"} strokeWidth="2" />
            {/* Gate 2 */}
            <line x1="14" y1="50" x2="46" y2="50" stroke={windowVerdict ? "#16a34a" : "#94a3b8"} strokeWidth="2" />
            {/* Gate 3 */}
            <line x1="20" y1="75" x2="40" y2="75" stroke={promiseVerdict && windowVerdict ? "#16a34a" : "#94a3b8"} strokeWidth="2" />

            {/* Labels */}
            <text x="30" y="31" fontSize="3" fontWeight="bold" fill={INK_SECONDARY} textAnchor="middle">1. Promise</text>
            <text x="30" y="56" fontSize="3" fontWeight="bold" fill={INK_SECONDARY} textAnchor="middle">2. Timing</text>
            <text x="30" y="81" fontSize="3" fontWeight="bold" fill={INK_SECONDARY} textAnchor="middle">3. Trigger</text>
          </svg>
        </div>

        {/* Stepper Inputs */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            {/* Stepper tabs */}
            <div className="flex border-b mb-6" style={{ borderColor: HAIRLINE }}>
              {[1, 2, 3, 4].map((stepNum) => {
                const stepNames = ["Promise", "Timing", "Trigger", "Journal"];
                const isLocked = stepNum === 2 ? !promiseVerdict : stepNum === 3 ? (!promiseVerdict || !windowVerdict) : stepNum === 4 ? (!promiseVerdict || !windowVerdict) : false;
                return (
                  <button
                    key={stepNum}
                    onClick={() => !isLocked && setActiveStepTab(stepNum as any)}
                    disabled={isLocked}
                    className={`flex-1 py-2 text-center border-b-2 font-bold transition-all flex items-center justify-center gap-1 text-xs md:text-sm ${
                      activeStepTab === stepNum ? "border-amber-600 text-amber-700 bg-amber-50/20" : "border-transparent"
                    } ${isLocked ? "opacity-30 cursor-not-allowed" : "opacity-80"}`}
                    style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
                  >
                    Step {stepNum}: {stepNames[stepNum - 1]} {isLocked && <Lock size={12} />}
                  </button>
                );
              })}
            </div>

            {/* Stepper Content Panels */}
            {activeStepTab === 1 && (
              <div className="animate-fade-in space-y-4">
                <h3 className="text-lg font-semibold" style={{ color: GOLD }}>Step 1: Record Promise</h3>
                <div className="p-4 rounded border bg-white/50" style={{ borderColor: HAIRLINE }}>
                  <p className="text-sm">Verify the domain promise under Lagna check before timing.</p>
                </div>
                <div className="flex gap-4">
                  {["strong", "qualified", "absent"].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer capitalize font-sans font-bold">
                      <input
                        type="radio"
                        name="synthesis-promise"
                        checked={promiseVerdict === v}
                        onChange={() => {
                          setPromiseVerdict(v as any);
                          setActiveStepTab(2);
                        }}
                        className="accent-amber-700 h-4 w-4"
                      />
                      {v}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeStepTab === 2 && (
              <div className="animate-fade-in space-y-4">
                <h3 className="text-lg font-semibold" style={{ color: GOLD }}>Step 2: Calibrate Timing</h3>
                <div className="mb-4">
                  <label className="text-sm font-semibold">Active Age: {timelineAge} years</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={timelineAge}
                    onChange={(e) => setTimelineAge(Number(e.target.value))}
                    className="w-full accent-amber-700 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
                  />
                </div>
                <div className="flex gap-4">
                  {["active", "partial", "dormant"].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer capitalize font-sans font-bold">
                      <input
                        type="radio"
                        name="synthesis-window"
                        checked={windowVerdict === v}
                        onChange={() => {
                          setWindowVerdict(v as any);
                          setActiveStepTab(3);
                        }}
                        className="accent-amber-700 h-4 w-4"
                      />
                      {v}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeStepTab === 3 && (
              <div className="animate-fade-in space-y-4">
                <h3 className="text-lg font-semibold" style={{ color: GOLD }}>Step 3: Verify Transits</h3>
                <div className="mb-4">
                  <label className="text-sm font-semibold">Month Offset: {transitMonthOffset} months</label>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={transitMonthOffset}
                    onChange={(e) => setTransitMonthOffset(Number(e.target.value))}
                    className="w-full accent-amber-700 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
                  />
                </div>
                <div className="p-4 rounded-lg border bg-green-50 border-green-200 text-green-950 flex items-center gap-2">
                  <CheckCircle2 className="text-green-700" size={18} />
                  <span className="text-xs font-semibold">Double Transit Active & Unobstructed. Proceed to final Synthesis Log.</span>
                </div>
                <button
                  onClick={() => setActiveStepTab(4)}
                  className="px-4 py-2 border rounded bg-amber-800 hover:bg-amber-900 text-white font-sans font-bold text-xs"
                >
                  Write Synthesis Log ➔
                </button>
              </div>
            )}

            {activeStepTab === 4 && (
              <div className="animate-fade-in space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold" style={{ color: GOLD }}>Practitioner Log Workspace</h3>
                  <div className="flex items-center gap-2">
                    {exportLocked ? (
                      <span className="text-[10px] text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded flex items-center gap-1 font-sans">
                        <Lock size={10} /> Caveats & Ethics Required
                      </span>
                    ) : (
                      <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded flex items-center gap-1 font-sans">
                        <Unlock size={10} /> Ready to export
                      </span>
                    )}
                    <button
                      onClick={handleCopyDraft}
                      disabled={exportLocked}
                      className={`px-3 py-1.5 text-xs border rounded flex items-center gap-1 font-sans font-bold transition ${
                        exportLocked ? "bg-gray-150 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-amber-800 hover:bg-amber-900 text-white border-amber-950"
                      }`}
                    >
                      <ClipboardCopy size={12} /> Copy Draft Log
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-gray-500 font-sans">1. Context</label>
                    <textarea
                      value={logContext}
                      onChange={(e) => setLogContext(e.target.value)}
                      rows={2}
                      placeholder="e.g. Career change timing for Virgo native..."
                      className="w-full p-2 text-xs border rounded bg-transparent font-sans"
                      style={{ borderColor: HAIRLINE }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-gray-500 font-sans">2. Indicators</label>
                    <textarea
                      value={logIndicators}
                      onChange={(e) => setLogIndicators(e.target.value)}
                      rows={2}
                      placeholder="e.g. Ju MD and Sa transit aspecting 10th..."
                      className="w-full p-2 text-xs border rounded bg-transparent font-sans"
                      style={{ borderColor: HAIRLINE }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-gray-500 font-sans">3. Confidence Tier Rationale</label>
                    <textarea
                      value={logTier}
                      onChange={(e) => setLogTier(e.target.value)}
                      rows={2}
                      placeholder="e.g. Strong promise matching active MD carrier..."
                      className="w-full p-2 text-xs border rounded bg-transparent font-sans"
                      style={{ borderColor: HAIRLINE }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-red-800 font-sans">4. Caveats & Obstructions (REQUIRED)</label>
                    <textarea
                      value={logCaveats}
                      onChange={(e) => setLogCaveats(e.target.value)}
                      rows={2}
                      placeholder="e.g. Sandhi degrees or possible transit Vedhas..."
                      className="w-full p-2 text-xs border rounded bg-transparent font-sans border-red-200"
                      style={{ borderColor: HAIRLINE }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-red-800 font-sans">5. Ethical Guidance & Non-Deterministic Counsel (REQUIRED)</label>
                    <textarea
                      value={logEthics}
                      onChange={(e) => setLogEthics(e.target.value)}
                      rows={2}
                      placeholder="e.g. Framed as indicators of capacity, leaving free will intact..."
                      className="w-full p-2 text-xs border rounded bg-transparent font-sans border-red-200"
                      style={{ borderColor: HAIRLINE }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
