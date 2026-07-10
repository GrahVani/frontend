"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Sliders,
  Copy,
  Check,
  Compass,
  Layers,
  ArrowRight,
  ShieldCheck,
  Gauge
} from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

interface Planet {
  name: string;
  sign: string;
  deg: number;
  houseWhole: number;
  houseChalita: number;
  housePlacidus: number;
}

const BASE_PLANETS: Planet[] = [
  { name: "Sun", sign: "Scorpio", deg: 7.23, houseWhole: 10, houseChalita: 9, housePlacidus: 9 },
  { name: "Moon", sign: "Pisces", deg: 12.45, houseWhole: 2, houseChalita: 1, housePlacidus: 1 },
  { name: "Mars", sign: "Virgo", deg: 28.12, houseWhole: 8, houseChalita: 8, housePlacidus: 7 },
  { name: "Mercury", sign: "Scorpio", deg: 23.56, houseWhole: 10, houseChalita: 10, housePlacidus: 10 },
  { name: "Jupiter", sign: "Capricorn", deg: 15.34, houseWhole: 12, houseChalita: 11, housePlacidus: 11 },
  { name: "Venus", sign: "Scorpio", deg: 1.05, houseWhole: 10, houseChalita: 9, housePlacidus: 9 },
  { name: "Saturn", sign: "Scorpio", deg: 5.48, houseWhole: 10, houseChalita: 9, housePlacidus: 9 }
];

export function DataPreparationPreflight() {
  const [birthTime, setBirthTime] = useState("12:00");
  const [uncertainty, setUncertainty] = useState(15);
  const [reliability, setReliability] = useState<"reliable" | "approximate" | "unknown">("reliable");
  const [stream, setStream] = useState<"Parashari" | "KP" | "strength-refinement">("Parashari");
  const [ayanamsa, setAyanamsa] = useState<"Lahiri" | "KP" | "Raman" | "Yukteshwar" | "Pushya-paksha">("Lahiri");
  const [houseSystem, setHouseSystem] = useState<"whole-sign" | "Bhāva Cālita" | "Placidus">("whole-sign");
  const [questionType, setQuestionType] = useState<"character" | "fine-timing" | "yes-no" | "year">("character");

  const [copied, setCopied] = useState(false);

  const handleReliabilityChange = (value: "reliable" | "approximate" | "unknown") => {
    setReliability(value);
    if (value === "reliable") setUncertainty(15);
    else if (value === "approximate") setUncertainty(60);
    else setUncertainty(180);
  };

  const baseLagnaDeg = useMemo(() => {
    const [hrs, mins] = birthTime.split(":").map(Number);
    const timeDiffMins = (hrs - 12) * 60 + (mins - 0);
    let deg = 18.45 + timeDiffMins * 0.25;
    if (ayanamsa === "KP") deg += 0.10;
    else if (ayanamsa === "Raman") deg -= 1.35;
    else if (ayanamsa === "Yukteshwar") deg -= 0.45;
    else if (ayanamsa === "Pushya-paksha") deg -= 2.10;
    return ((deg % 30) + 30) % 30;
  }, [birthTime, ayanamsa]);

  const activeLagnaSign = useMemo(() => {
    const [hrs, mins] = birthTime.split(":").map(Number);
    const timeDiffMins = (hrs - 12) * 60 + (mins - 0);
    const absDeg = 318.45 + timeDiffMins * 0.25;
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs[(Math.floor((absDeg % 360) / 30) + 12) % 12];
  }, [birthTime]);

  const lagnaSweep = useMemo(() => {
    const sweepRange = uncertainty * 0.25;
    const minDeg = baseLagnaDeg - sweepRange;
    const maxDeg = baseLagnaDeg + sweepRange;
    return {
      rangeText: `${Math.max(0, minDeg).toFixed(2)}° to ${Math.min(30, maxDeg).toFixed(2)}°`,
      crossesBoundary: minDeg < 0 || maxDeg >= 30,
      span: sweepRange * 2
    };
  }, [baseLagnaDeg, uncertainty]);

  const dashaDriftMonths = useMemo(() => {
    return (uncertainty * 2.5) / 30.4;
  }, [uncertainty]);

  const boundaryFlags = useMemo(() => {
    const flags: string[] = [];
    if (lagnaSweep.crossesBoundary) {
      flags.push(`Lagna crosses boundary between ${activeLagnaSign} and adjacent sign within uncertainty window.`);
    } else if (baseLagnaDeg < 1.0 || baseLagnaDeg > 29.0) {
      flags.push(`Lagna is cusp-sensitive (${baseLagnaDeg.toFixed(2)}° ${activeLagnaSign}).`);
    }
    BASE_PLANETS.forEach((p) => {
      if (p.deg < 1.5 || p.deg > 28.5) {
        flags.push(`${p.name} sits near sign or house boundary at ${p.deg.toFixed(2)}°.`);
      }
      if (houseSystem === "Bhāva Cālita" && p.houseWhole !== p.houseChalita) {
        flags.push(`${p.name} shifts house: H${p.houseWhole} ➔ H${p.houseChalita}.`);
      }
      if (houseSystem === "Placidus" && p.houseWhole !== p.housePlacidus) {
        flags.push(`${p.name} shifts house: H${p.houseWhole} ➔ H${p.housePlacidus}.`);
      }
    });
    return flags;
  }, [baseLagnaDeg, activeLagnaSign, lagnaSweep, houseSystem]);

  const streamWarnings = useMemo(() => {
    const warnings: string[] = [];
    if (stream === "KP") {
      if (ayanamsa !== "KP") warnings.push("KP stream requires KP Ayanāṁśa.");
      if (houseSystem !== "Placidus") warnings.push("KP stream requires Placidus cusps.");
    }
    return warnings;
  }, [stream, ayanamsa, houseSystem]);

  // Data Integrity Score calculation (0 - 100)
  const integrityScore = useMemo(() => {
    let score = 100;
    if (reliability === "approximate") score -= 30;
    else if (reliability === "unknown") score -= 65;

    if (uncertainty > 45) score -= 15;
    if (lagnaSweep.crossesBoundary) score -= 15;
    if (streamWarnings.length > 0) score -= 10;
    if (boundaryFlags.length > 2) score -= 10;

    return Math.max(10, score);
  }, [reliability, uncertainty, lagnaSweep, streamWarnings, boundaryFlags]);

  const verdict = useMemo(() => {
    if (reliability === "unknown") {
      return {
        level: questionType === "fine-timing" ? "DECLINE" : "RECTIFY",
        rationale: "Birth-time is completely unknown. timing prediction is locked; rectification required."
      };
    }
    if (questionType === "fine-timing" && (uncertainty > 45 || lagnaSweep.crossesBoundary || reliability === "approximate")) {
      return { level: "RECTIFY", rationale: "Timing is highly sensitive to Vimshottari balance drift. Rectification required." };
    }
    if (boundaryFlags.length > 0 || streamWarnings.length > 0) {
      return { level: "PROCEED WITH FLAGS", rationale: "Data is generally reliable but boundaries are sensitive. State flags in record." };
    }
    return { level: "PROCEED", rationale: "Ready to proceed: data checks are clean, uncertainty is minimal." };
  }, [reliability, uncertainty, questionType, boundaryFlags, streamWarnings, lagnaSweep]);

  const stubText = useMemo(() => {
    return `### DATA PRE-FLIGHT VERIFICATION RECORD
- **Birth Time LMT:** ${birthTime} (±${uncertainty} mins)
- **Time Reliability:** ${reliability.toUpperCase()}
- **Ayanāṁśa:** ${ayanamsa.toUpperCase()}
- **House System:** ${houseSystem}
- **Data Integrity Score:** ${integrityScore}%
- **Combined Verdict:** ${verdict.level}
- **Vulnerabilities:**
${boundaryFlags.length > 0 ? boundaryFlags.map(f => `  * ${f}`).join("\n") : "  * None (stable)"}`;
  }, [birthTime, uncertainty, reliability, ayanamsa, houseSystem, verdict, boundaryFlags, integrityScore]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(stubText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="p-6 md:p-8 rounded-2xl border font-sans"
      style={{
        backgroundColor: BG_TINT,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)"
      }}
    >
      <div className="pb-4 border-b mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900 animate-fade-in" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Data-Preparation Preflight Cockpit
          </h2>
          <p className="text-xs italic text-gray-600">
            Unified pre-reading diagnostic checklist: assess chart parameters before prediction.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Compass size={11} className="animate-spin-slow" />
          MODULE 2.1.4
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Parameters Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Pre-flight Parameters
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            {/* Time accuracy section */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <Clock size={13} /> Time Accuracy Setup
              </span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800"
                />
                <select
                  value={reliability}
                  onChange={(e) => handleReliabilityChange(e.target.value as any)}
                  className="text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800"
                >
                  <option value="reliable">Reliable (Cert)</option>
                  <option value="approximate">Approximate (Family)</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-gray-600">
                  <span>Uncertainty:</span>
                  <span className="font-mono text-amber-800">±{uncertainty} mins</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="5"
                  value={uncertainty}
                  onChange={(e) => setUncertainty(Number(e.target.value))}
                  className="w-full accent-amber-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Ayanamsa & House System */}
            <div className="space-y-3 border-t pt-3" style={{ borderColor: HAIRLINE }}>
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <Layers size={13} /> Doctrinal Settings
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5">Ayanāṁśa:</label>
                  <select
                    value={ayanamsa}
                    onChange={(e) => setAyanamsa(e.target.value as any)}
                    className="w-full text-[11px] p-1.5 border rounded bg-transparent focus:ring-amber-800"
                  >
                    <option value="Lahiri">Chitrapakṣa</option>
                    <option value="KP">KP Ayanamsa</option>
                    <option value="Raman">B.V. Raman</option>
                    <option value="Yukteshwar">Yukteshwar</option>
                    <option value="Pushya-paksha">Pushya-pakṣa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5">House System:</label>
                  <select
                    value={houseSystem}
                    onChange={(e) => setHouseSystem(e.target.value as any)}
                    className="w-full text-[11px] p-1.5 border rounded bg-transparent focus:ring-amber-800"
                  >
                    <option value="whole-sign">Whole-Sign</option>
                    <option value="Bhāva Cālita">Bhāva Cālita</option>
                    <option value="Placidus">Placidus</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Question Type */}
            <div className="space-y-2 border-t pt-3" style={{ borderColor: HAIRLINE }}>
              <label className="block text-[9px] uppercase font-bold text-gray-400">Stream & Question Context:</label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={stream}
                  onChange={(e) => setStream(e.target.value as any)}
                  className="w-full text-[11px] p-1.5 border rounded bg-transparent focus:ring-amber-800"
                >
                  <option value="Parashari">Parāśari</option>
                  <option value="KP">KP Stream</option>
                </select>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value as any)}
                  className="w-full text-[11px] p-1.5 border rounded bg-transparent focus:ring-amber-800"
                >
                  <option value="character">Character</option>
                  <option value="fine-timing">Fine Timing</option>
                  <option value="yes-no">Yes/No</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Verdict HUD & Staging Stub */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Pre-flight Health Diagnostics
          </span>

          {/* Scoring HUD */}
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Dial visual */}
              <div className="w-24 h-24 relative flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={integrityScore > 75 ? "#16a34a" : integrityScore > 45 ? GOLD : "#dc2626"}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (integrityScore / 100) * 251.2}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <span className="text-xl font-bold font-mono text-gray-800">{integrityScore}%</span>
                  <span className="text-[7px] uppercase font-bold text-gray-400">Integrity</span>
                </div>
              </div>

              {/* Verdict readout */}
              <div className="flex-1 w-full space-y-1 text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold text-gray-400">Pre-flight Verdict</span>
                <h4
                  className="text-lg font-bold flex justify-center sm:justify-start items-center gap-1.5"
                  style={{ color: verdict.level === "PROCEED" ? "#15803d" : verdict.level === "PROCEED WITH FLAGS" ? GOLD : "#b91c1c" }}
                >
                  {verdict.level}
                </h4>
                <p className="text-xs text-gray-600 leading-normal">{verdict.rationale}</p>
              </div>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-3 gap-3 border-t pt-3.5 text-center text-[10px] font-bold" style={{ borderColor: HAIRLINE }}>
              <div className="p-2 rounded bg-amber-950/[0.02] border" style={{ borderColor: HAIRLINE }}>
                <span className="block text-gray-400 mb-0.5">TIME ACCURACY</span>
                <span className={reliability === "unknown" ? "text-red-700" : "text-green-700"}>
                  {reliability === "unknown" ? "✗ Vague" : "✓ Mapped"}
                </span>
              </div>
              <div className="p-2 rounded bg-amber-950/[0.02] border" style={{ borderColor: HAIRLINE }}>
                <span className="block text-gray-400 mb-0.5">AYANĀMŚA ALIGN</span>
                <span className={streamWarnings.some(w => w.includes("Ayan")) ? "text-red-700" : "text-green-700"}>
                  {streamWarnings.some(w => w.includes("Ayan")) ? "✗ Mismatch" : "✓ Aligned"}
                </span>
              </div>
              <div className="p-2 rounded bg-amber-950/[0.02] border" style={{ borderColor: HAIRLINE }}>
                <span className="block text-gray-400 mb-0.5">HOUSE DIVISION</span>
                <span className={boundaryFlags.some(f => f.includes("house")) ? "text-amber-800" : "text-green-700"}>
                  {boundaryFlags.some(f => f.includes("house")) ? "⚠️ Shifts" : "✓ Clean"}
                </span>
              </div>
            </div>
          </div>

          {/* Consultation Record Stub */}
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-amber-800" /> Copy Pre-flight Consultation Record
              </span>
              <button
                onClick={copyToClipboard}
                className="px-2 py-1 text-[10px] font-bold rounded border hover:bg-amber-50 transition-all flex items-center gap-1.5 bg-transparent"
                style={{ borderColor: HAIRLINE }}
              >
                {copied ? <Check size={11} className="text-green-700" /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy Stub"}
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
