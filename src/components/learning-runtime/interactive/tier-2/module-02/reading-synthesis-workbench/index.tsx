"use client";

import React, { useState, useMemo } from "react";
import { Compass, Check, Copy, ShieldCheck } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

export function ReadingSynthesisWorkbench() {
  const [dignity, setDignity] = useState<"strong" | "weak" | "afflicted">("strong");
  const [yoga, setYoga] = useState<"supportive" | "afflicting" | "none">("supportive");
  const [dasha, setDasha] = useState<"auspicious" | "challenging">("auspicious");
  const [transit, setTransit] = useState<"double" | "single" | "none">("double");
  const [copied, setCopied] = useState(false);

  // Calculate scores per component
  const dignityScore = useMemo(() => {
    if (dignity === "strong") return 30;
    if (dignity === "weak") return 15;
    return 0;
  }, [dignity]);

  const yogaScore = useMemo(() => {
    if (yoga === "supportive") return 20;
    if (yoga === "none") return 10;
    return 0;
  }, [yoga]);

  const dashaScore = useMemo(() => {
    return dasha === "auspicious" ? 30 : 0;
  }, [dasha]);

  const transitScore = useMemo(() => {
    if (transit === "double") return 20;
    if (transit === "single") return 10;
    return 0;
  }, [transit]);

  const confidenceScore = useMemo(() => {
    return dignityScore + yogaScore + dashaScore + transitScore;
  }, [dignityScore, yogaScore, dashaScore, transitScore]);

  const outputVerdict = useMemo(() => {
    if (confidenceScore >= 80) {
      return {
        level: "HIGH CONFIDENCE PREDICTION",
        color: "#15803d",
        bg: "rgba(22, 163, 74, 0.04)",
        desc: "All canonical criteria converge. The chart shows strong dignity, supportive yogas, active dasha lords, and a double-transit timing window. Highly safe to predict."
      };
    }
    if (confidenceScore >= 50) {
      return {
        level: "PROCEED WITH CAVEATS",
        color: GOLD,
        bg: "rgba(156, 122, 47, 0.04)",
        desc: "Moderate convergence. Main promise exists, but timing is affected by minor delays or weak dignity. Advise client on milestones, not strict dates."
      };
    }
    return {
      level: "REJECT PREDICTION (HIGH RISK)",
      color: "#b91c1c",
      bg: "rgba(220, 38, 38, 0.04)",
      desc: "Incoherent parameters. Weak dignity, malefic dosha, challenging dasha, or zero transit alignment. Route to rectifying/BTR review."
    };
  }, [confidenceScore]);

  const stubText = useMemo(() => {
    return `### CANONICAL READING SYNTHESIS RECORD
- **Dignity Strength:** ${dignity.toUpperCase()}
- **Yoga/Dosha Lock:** ${yoga.toUpperCase()}
- **Dasha Period:** ${dasha.toUpperCase()}
- **Transit Alignment:** ${transit.toUpperCase()}
- **Reading Confidence Score:** ${confidenceScore}%
- **Astrological Verdict:** ${outputVerdict.level}`;
  }, [dignity, yoga, dasha, transit, confidenceScore, outputVerdict]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(stubText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG Pointer position
  const gaugePath = useMemo(() => {
    const angle = (confidenceScore / 100) * 180 - 180;
    const rad = (angle * Math.PI) / 180;
    const x = 50 + 35 * Math.cos(rad);
    const y = 45 + 35 * Math.sin(rad);
    return { x, y };
  }, [confidenceScore]);

  return (
    <div
      className="p-6 md:p-8 rounded-2xl border font-sans animate-fade-in"
      style={{
        backgroundColor: BG_TINT,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)"
      }}
    >
      <div className="pb-4 border-b mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Reading Synthesis Workbench
          </h2>
          <p className="text-xs italic text-gray-600">
            Step 5: Synthesize all four steps to calculate a final predictive confidence score.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Compass size={11} className="animate-spin-slow" />
          MODULE 2.3.5
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Four-Step Synthesis Panel
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Step 1: Dignity & Shadbala:</label>
              <select
                value={dignity}
                onChange={(e) => setDignity(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
              >
                <option value="strong">Strong Dignity & shadbala (+30%)</option>
                <option value="weak">Weak Dignity (+15%)</option>
                <option value="afflicted">Afflicted Dignity (0%)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Step 2: Yogas & Doshas:</label>
              <select
                value={yoga}
                onChange={(e) => setYoga(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
              >
                <option value="supportive">Supportive Yogas (+20%)</option>
                <option value="none">No major combinations (+10%)</option>
                <option value="afflicting">Afflicting Doshas (0%)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Step 3: Dasha Timing Lord:</label>
              <select
                value={dasha}
                onChange={(e) => setDasha(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
              >
                <option value="auspicious">Auspicious Dasha Lord (+30%)</option>
                <option value="challenging">Challenging/Dusthana Lord (0%)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Step 4: Transit Triggers:</label>
              <select
                value={transit}
                onChange={(e) => setTransit(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
              >
                <option value="double">Double-Transit Triggered (+20%)</option>
                <option value="single">Single-Transit Aspect (+10%)</option>
                <option value="none">No transit support (0%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Display Column */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Synthesis Results
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 p-4 rounded-xl border bg-white shadow-sm" style={{ borderColor: HAIRLINE }}>
            {/* SVG Speedometer Gauge */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-40 h-24">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <path d="M 15 45 A 35 35 0 0 1 85 45" fill="none" stroke="#f1e6d2" strokeWidth="6" strokeLinecap="round" />
                  {confidenceScore > 0 && (
                    <path
                      d={`M 15 45 A 35 35 0 0 1 ${gaugePath.x} ${gaugePath.y}`}
                      fill="none"
                      stroke={outputVerdict.color}
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  )}
                  <circle cx="50" cy="45" r="4" fill={INK_PRIMARY} />
                  <line x1="50" y1="45" x2={gaugePath.x} y2={gaugePath.y} stroke={INK_PRIMARY} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <div className="absolute bottom-0 inset-x-0 text-center">
                  <span className="text-xl font-extrabold text-amber-900 font-mono">{confidenceScore}%</span>
                  <span className="block text-[8px] uppercase tracking-widest text-gray-400 font-bold">confidence</span>
                </div>
              </div>
            </div>

            {/* Verdict text & table */}
            <div className="sm:col-span-7 space-y-3">
              <div>
                <h4 className="text-xs font-bold block mb-1" style={{ color: outputVerdict.color }}>
                  {outputVerdict.level}
                </h4>
                <p className="text-[11px] text-gray-600 leading-normal font-normal">{outputVerdict.desc}</p>
              </div>

              {/* Dynamic Score breakdown table */}
              <div className="border-t pt-2" style={{ borderColor: HAIRLINE }}>
                <table className="w-full text-[9px] font-sans border-collapse text-left">
                  <thead>
                    <tr className="text-gray-400 uppercase font-bold border-b pb-1">
                      <th>Step</th>
                      <th>Rating</th>
                      <th className="text-right">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                      <td className="py-1 text-gray-600">1. Dignity</td>
                      <td className="py-1 font-bold text-amber-800">{dignity.toUpperCase()}</td>
                      <td className="py-1 text-right font-mono font-bold">+{dignityScore}%</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                      <td className="py-1 text-gray-600">2. Yogas</td>
                      <td className="py-1 font-bold text-amber-800">{yoga.toUpperCase()}</td>
                      <td className="py-1 text-right font-mono font-bold">+{yogaScore}%</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                      <td className="py-1 text-gray-600">3. Dasha</td>
                      <td className="py-1 font-bold text-amber-800">{dasha.toUpperCase()}</td>
                      <td className="py-1 text-right font-mono font-bold">+{dashaScore}%</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: HAIRLINE }}>
                      <td className="py-1 text-gray-600">4. Transits</td>
                      <td className="py-1 font-bold text-amber-800">{transit.toUpperCase()}</td>
                      <td className="py-1 text-right font-mono font-bold">+{transitScore}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Consultation ticket record */}
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-amber-800" /> Staging Consultation Record Ticket
              </span>
              <button
                onClick={copyToClipboard}
                className="px-2 py-1 text-[10px] font-bold rounded border hover:bg-amber-50 transition-all flex items-center gap-1.5 bg-transparent"
                style={{ borderColor: HAIRLINE }}
              >
                {copied ? <Check size={11} className="text-green-700" /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy Ticket"}
              </button>
            </div>
            <textarea
              readOnly
              rows={5}
              value={stubText}
              className="w-full text-[10px] font-mono p-3 border rounded bg-amber-950/[0.01] text-gray-600 focus:outline-none leading-relaxed"
              style={{ borderColor: HAIRLINE }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
