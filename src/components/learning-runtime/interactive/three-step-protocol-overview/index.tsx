"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BookOpen, CheckCircle, Info, Lock, Unlock } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  ARIES_DASHAS,
  CHARTS,
  DOMAINS,
  VIRGO_DASHAS,
  type DomainKey,
  getSignOfHouse,
  SIGN_NAMES,
} from "../three-step-shared-data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4d4133)";
const GOLD = ink.goldAccent || "#9C7A2F";

export function ThreeStepProtocolOverview() {
  const [selectedChartId, setSelectedChartId] = useState<string>("virgo-teach");
  const [selectedDomainKey, setSelectedDomainKey] = useState<DomainKey>("career");
  const [promiseVerdict, setPromiseVerdict] = useState<"strong" | "qualified" | "absent" | "">("");
  const [timelineAge, setTimelineAge] = useState<number>(35);
  const [windowVerdict, setWindowVerdict] = useState<"active" | "partial" | "dormant" | "">("");
  const [transitMonthOffset, setTransitMonthOffset] = useState<number>(6);
  const [activeStepTab, setActiveStepTab] = useState<1 | 2 | 3>(1);

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

  // Determine active verse highlight based on active step or full completion
  let activeVersePart: "bhava" | "dasha" | "gochara" | "all" | "none" = "none";
  if (promiseVerdict && windowVerdict && activeStepTab === 3) {
    activeVersePart = "all";
  } else if (activeStepTab === 1) {
    activeVersePart = "bhava";
  } else if (activeStepTab === 2) {
    activeVersePart = "dasha";
  } else if (activeStepTab === 3) {
    activeVersePart = "gochara";
  }

  // Qualitative confidence calculation
  let confidenceVerdict = "No Prediction Defensible";
  let confidenceColor = "#b91c1c"; // red

  if (promiseVerdict === "strong" && windowVerdict === "active") {
    confidenceVerdict = "Strong Indication";
    confidenceColor = "#15803d"; // green
  } else if (
    (promiseVerdict === "strong" && windowVerdict === "partial") ||
    (promiseVerdict === "qualified" && windowVerdict === "active")
  ) {
    confidenceVerdict = "Moderate Indication";
    confidenceColor = "#b45309"; // amber
  } else if (promiseVerdict === "absent" || windowVerdict === "dormant") {
    confidenceVerdict = "No Prediction Defensible";
    confidenceColor = "#b91c1c";
  } else if (promiseVerdict && windowVerdict) {
    confidenceVerdict = "Weak Indication";
    confidenceColor = "#b91c1c";
  }

  return (
    <div
      className="p-6 rounded-xl border my-6 shadow-sm font-serif"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="three-step-protocol-overview"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD }}>
            The 3-Step Protocol Overview
          </h2>
          <p className="text-sm italic" style={{ color: INK_SECONDARY }}>
            Promise (Lagna) ➔ Timing (Daśā) ➔ Trigger (Gochara)
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

      {/* Grid: Stepper tabs + SVG Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
        {/* SVG Funnel Visualizer (Left Column) */}
        <div className="flex flex-col items-center justify-center p-6 border rounded-xl bg-white/40 shadow-inner" style={{ borderColor: HAIRLINE }}>
          <span className="text-xs uppercase tracking-wider mb-4 font-bold font-sans text-gray-500">Prediction Funnel</span>
          <svg className="w-full max-w-[180px] h-52" viewBox="0 0 60 90">
            {/* Outer Funnel Shape */}
            <path
              d="M 5 10 L 15 50 L 25 80 L 35 80 L 45 50 L 55 10 Z"
              fill="none"
              stroke="#b45309"
              strokeWidth="1.5"
            />

            {/* Gate 1: Promise (Top) */}
            <g className="transition-all duration-300">
              <line x1="9" y1="20" x2="51" y2="20" stroke={promiseVerdict ? "#16a34a" : "#dc2626"} strokeWidth="3" />
              <text x="30" y="27" fontSize="3" fontWeight="bold" fill={INK_PRIMARY} textAnchor="middle">
                Gate 1: Promise ({promiseVerdict || "LOCKED"})
              </text>
            </g>

            {/* Gate 2: Timing (Middle) */}
            <g className="transition-all duration-300">
              <line x1="13" y1="45" x2="47" y2="45" stroke={windowVerdict ? "#16a34a" : !promiseVerdict ? "#94a3b8" : "#dc2626"} strokeWidth="3" />
              <text x="30" y="52" fontSize="3" fontWeight="bold" fill={INK_PRIMARY} textAnchor="middle">
                Gate 2: Timing ({windowVerdict || "LOCKED"})
              </text>
            </g>

            {/* Gate 3: Trigger (Bottom) */}
            <g className="transition-all duration-300">
              <line x1="21" y1="70" x2="39" y2="70" stroke={promiseVerdict && windowVerdict ? "#16a34a" : "#94a3b8"} strokeWidth="3" />
              <text x="30" y="77" fontSize="3" fontWeight="bold" fill={INK_PRIMARY} textAnchor="middle">
                Gate 3: Trigger
              </text>
            </g>

            {/* Lock/Unlock indicators */}
            {!promiseVerdict ? (
              <circle cx="30" cy="45" r="2.5" fill="#7f1d1d" />
            ) : (
              <circle cx="30" cy="45" r="2.5" fill="#14532d" />
            )}
            {!windowVerdict ? (
              <circle cx="30" cy="70" r="2.5" fill="#7f1d1d" />
            ) : (
              <circle cx="30" cy="70" r="2.5" fill="#14532d" />
            )}
          </svg>
        </div>

        {/* Stepper inputs (Right Columns) */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            {/* Stepper Tabs */}
            <div className="flex border-b mb-6" style={{ borderColor: HAIRLINE }}>
              <button
                onClick={() => setActiveStepTab(1)}
                className={`flex-1 py-3 text-center border-b-2 font-bold transition-all ${
                  activeStepTab === 1 ? "border-amber-600 text-amber-700 bg-amber-50/20" : "border-transparent opacity-60"
                }`}
                style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
              >
                Step 1: Promise
              </button>
              <button
                onClick={() => promiseVerdict && setActiveStepTab(2)}
                disabled={!promiseVerdict}
                className={`flex-1 py-3 text-center border-b-2 font-bold transition-all flex items-center justify-center gap-2 ${
                  activeStepTab === 2 ? "border-amber-600 text-amber-700 bg-amber-50/20" : "border-transparent"
                } ${!promiseVerdict ? "opacity-30 cursor-not-allowed" : "opacity-80"}`}
                style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
              >
                Step 2: Timing {!promiseVerdict ? <Lock size={14} /> : <Unlock size={14} />}
              </button>
              <button
                onClick={() => promiseVerdict && windowVerdict && setActiveStepTab(3)}
                disabled={!promiseVerdict || !windowVerdict}
                className={`flex-1 py-3 text-center border-b-2 font-bold transition-all flex items-center justify-center gap-2 ${
                  activeStepTab === 3 ? "border-amber-600 text-amber-700 bg-amber-50/20" : "border-transparent"
                } ${(!promiseVerdict || !windowVerdict) ? "opacity-30 cursor-not-allowed" : "opacity-80"}`}
                style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
              >
                Step 3: Trigger {(!promiseVerdict || !windowVerdict) ? <Lock size={14} /> : <Unlock size={14} />}
              </button>
            </div>

            {/* Tab Panels */}
            {activeStepTab === 1 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-2" style={{ color: GOLD }}>Step 1: Natal Promise Check</h3>
                <p className="text-sm mb-4" style={{ color: INK_SECONDARY }}>
                  Verify whether the chosen domain is promised in the birth chart. Check the bhāva (house), bhāva-lord, and kāraka.
                </p>

                <div className="p-4 rounded-lg border mb-4 bg-white/70" style={{ borderColor: HAIRLINE }}>
                  <p className="font-semibold text-lg mb-2">Lagna Evaluation Details:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>House Position: House {domain.bhavaNum} ({domain.bhavaName})</li>
                    <li>Zodiac Sign: {SIGN_NAMES[getSignOfHouse(chart.lagnaSignNum, domain.bhavaNum) - 1]}</li>
                    <li>Significator (Kāraka): {domain.karaka}</li>
                  </ul>
                </div>

                <div>
                  <span className="block text-sm font-semibold mb-2">Record Promise Verdict:</span>
                  <div className="flex gap-4">
                    {["strong", "qualified", "absent"].map((v) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer capitalize font-sans font-semibold">
                        <input
                          type="radio"
                          name="promise"
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
              </div>
            )}

            {activeStepTab === 2 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-2" style={{ color: GOLD }}>Step 2: Vimshottari Dasha Window</h3>
                <p className="text-sm mb-4" style={{ color: INK_SECONDARY }}>
                  Adjust the age slider to identify when the dasha and bhukti periods activate the houses of the natal promise.
                </p>

                <div className="mb-6 p-4 rounded-lg border bg-white/70" style={{ borderColor: HAIRLINE }}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold">Active Age: {timelineAge} years</label>
                    <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-sans font-bold">
                      {currentDashaPeriod.md} - {currentDashaPeriod.ad} Period
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={timelineAge}
                    onChange={(e) => setTimelineAge(Number(e.target.value))}
                    className="w-full accent-amber-700 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <span className="block text-sm font-semibold mb-2">Record Timing Window Verdict:</span>
                  <div className="flex gap-4">
                    {["active", "partial", "dormant"].map((v) => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer capitalize font-sans font-semibold">
                        <input
                          type="radio"
                          name="window"
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
              </div>
            )}

            {activeStepTab === 3 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-2" style={{ color: GOLD }}>Step 3: Gochara (Transit) Trigger</h3>
                <p className="text-sm mb-4" style={{ color: INK_SECONDARY }}>
                  Locate Saturn and Jupiter transit triggers. Ensure transits hit the sensitive natal points.
                </p>

                <div className="mb-6 p-4 rounded-lg border bg-white/70" style={{ borderColor: HAIRLINE }}>
                  <label className="block text-sm font-semibold mb-2">Adjust Month Offset: {transitMonthOffset} months</label>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={transitMonthOffset}
                    onChange={(e) => setTransitMonthOffset(Number(e.target.value))}
                    className="w-full accent-amber-700 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-lg border flex items-start gap-3 bg-green-50 border-green-200 text-green-800 shadow-sm">
                  <CheckCircle size={20} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Active Transit Trigger Identified</p>
                    <p className="text-xs mt-1">Slow-moving planets are transiting/aspecting the active dasha-bhukti lords.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Synthesis Verdict Panel */}
          {promiseVerdict && (
            <div className="mt-6 p-4 rounded-lg border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300" style={{ borderColor: HAIRLINE, backgroundColor: SURFACE_2 }}>
              <div className="flex items-center gap-3">
                <Info size={20} style={{ color: GOLD }} />
                <div>
                  <p className="text-sm font-semibold">Funnel Convergence Status</p>
                  <div className="flex gap-2 items-center text-xs mt-1 font-sans">
                    <span className="capitalize">Promise: {promiseVerdict}</span>
                    {windowVerdict && <span>• Window: {windowVerdict}</span>}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase tracking-wider block text-gray-500 font-sans font-semibold">Confidence Verdict</span>
                <span className="text-lg font-bold" style={{ color: confidenceColor }}>
                  {confidenceVerdict}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
