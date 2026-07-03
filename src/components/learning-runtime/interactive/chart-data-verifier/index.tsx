"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Sliders,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  Compass,
  Layers,
  ArrowRight,
  Info
} from "lucide-react";
import { useLessonSlug } from "../rashi-attribute-wheel";

// Curated colors for parchment theme
const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

// Types
interface PlanetPosition {
  name: string;
  sign: string;
  deg: number; // 0-30
  nakshatra: string;
  houseWhole: number;
  houseChalita: number;
  housePlacidus: number;
}

// Fixed base positions for New Delhi, Nov 23, 1985, 12:00 PM (Lahiri)
const BASE_PLANETS: PlanetPosition[] = [
  { name: "Sun", sign: "Scorpio", deg: 7.23, nakshatra: "Anuradha", houseWhole: 10, houseChalita: 9, housePlacidus: 9 },
  { name: "Moon", sign: "Pisces", deg: 12.45, nakshatra: "Uttara Bhadrapada", houseWhole: 2, houseChalita: 1, housePlacidus: 1 },
  { name: "Mars", sign: "Virgo", deg: 28.12, nakshatra: "Chitra", houseWhole: 8, houseChalita: 8, housePlacidus: 7 },
  { name: "Mercury", sign: "Scorpio", deg: 23.56, nakshatra: "Jyeshtha", houseWhole: 10, houseChalita: 10, housePlacidus: 10 },
  { name: "Jupiter", sign: "Capricorn", deg: 15.34, nakshatra: "Shravana", houseWhole: 12, houseChalita: 11, housePlacidus: 11 },
  { name: "Venus", sign: "Scorpio", deg: 1.05, nakshatra: "Vishakha", houseWhole: 10, houseChalita: 9, housePlacidus: 9 },
  { name: "Saturn", sign: "Scorpio", deg: 5.48, nakshatra: "Anuradha", houseWhole: 10, houseChalita: 9, housePlacidus: 9 },
  { name: "Rahu", sign: "Aries", deg: 14.22, nakshatra: "Bharani", houseWhole: 3, houseChalita: 3, housePlacidus: 3 },
  { name: "Ketu", sign: "Libra", deg: 14.22, nakshatra: "Swati", houseWhole: 9, houseChalita: 9, housePlacidus: 9 }
];

export function ChartDataVerifier() {
  const lessonSlug = useLessonSlug();

  // Inputs
  const [birthTime, setBirthTime] = useState("12:00");
  const [uncertainty, setUncertainty] = useState(15); // in minutes
  const [reliability, setReliability] = useState<"reliable" | "approximate" | "unknown">("reliable");
  const [stream, setStream] = useState<"Parashari" | "KP" | "strength-refinement">("Parashari");
  const [ayanamsa, setAyanamsa] = useState<"Lahiri" | "KP" | "Raman" | "Yukteshwar" | "Pushya-paksha">("Lahiri");
  const [houseSystem, setHouseSystem] = useState<"whole-sign" | "Bhāva Cālita" | "Placidus">("whole-sign");
  const [questionType, setQuestionType] = useState<"character" | "fine-timing" | "yes-no" | "year">("character");

  // UX Feedback states
  const [copied, setCopied] = useState(false);

  // Lesson-aware initial settings
  useEffect(() => {
    if (lessonSlug === "ayanamsha-choice-at-predictive-stakes") {
      setAyanamsa("Lahiri");
      setStream("Parashari");
    } else if (lessonSlug === "house-system-choice-per-question-type") {
      setHouseSystem("whole-sign");
      setStream("Parashari");
    } else if (lessonSlug === "birth-time-accuracy-assessment") {
      setReliability("approximate");
      setUncertainty(30);
    }
  }, [lessonSlug]);

  // Adjust uncertainty automatically based on reliability input
  const handleReliabilityChange = (value: "reliable" | "approximate" | "unknown") => {
    setReliability(value);
    if (value === "reliable") {
      setUncertainty(15);
    } else if (value === "approximate") {
      setUncertainty(60);
    } else {
      setUncertainty(180);
    }
  };

  // 1. Math/Doctrinal Engine simulation based on inputs:
  const baseLagnaDeg = useMemo(() => {
    // Parse birthTime hours and minutes to simulate slight changes
    const [hrs, mins] = birthTime.split(":").map(Number);
    const timeDiffMins = (hrs - 12) * 60 + (mins - 0);
    // 1 minute of time = 0.25 degrees of Lagna rotation
    let deg = 18.45 + timeDiffMins * 0.25;
    
    // Ayanamsa offsets relative to Lahiri:
    // KP: +0.10 deg, Raman: -1.35 deg, Yukteshwar: -0.45 deg, Pushya-paksha: -2.10 deg
    if (ayanamsa === "KP") deg += 0.10;
    else if (ayanamsa === "Raman") deg -= 1.35;
    else if (ayanamsa === "Yukteshwar") deg -= 0.45;
    else if (ayanamsa === "Pushya-paksha") deg -= 2.10;

    return ((deg % 30) + 30) % 30; // normalized to 0-30 within the active sign (Aquarius)
  }, [birthTime, ayanamsa]);

  const activeLagnaSign = useMemo(() => {
    const [hrs, mins] = birthTime.split(":").map(Number);
    const timeDiffMins = (hrs - 12) * 60 + (mins - 0);
    const absDeg = 318.45 + timeDiffMins * 0.25; // 318.45 deg is mid Aquarius
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const index = Math.floor((absDeg % 360) / 30);
    return signs[(index + 12) % 12];
  }, [birthTime]);

  // Compute Lagna and Moon sweep limits across the uncertainty window
  const lagnaSweep = useMemo(() => {
    // Lagna sweeps 0.25 degrees per minute of time
    const sweepRange = uncertainty * 0.25;
    const minDeg = baseLagnaDeg - sweepRange;
    const maxDeg = baseLagnaDeg + sweepRange;
    
    // Check if sign boundaries are crossed
    const crossesBoundary = minDeg < 0 || maxDeg >= 30;
    return {
      min: Math.max(0, minDeg),
      max: Math.min(30, maxDeg),
      rangeText: `${Math.max(0, minDeg).toFixed(2)}° to ${Math.min(30, maxDeg).toFixed(2)}°`,
      crossesBoundary,
      span: sweepRange * 2
    };
  }, [baseLagnaDeg, uncertainty]);

  const dashaDriftMonths = useMemo(() => {
    // 1 minute of birth time error roughly shifts dasha balance by ~2.5 days
    // 60 minutes = ~150 days (5 months)
    const driftDays = uncertainty * 2.5;
    const months = driftDays / 30.4;
    return months;
  }, [uncertainty]);

  // Dynamic planets table based on Ayanamsa offset and chosen house system
  const computedPlanets = useMemo(() => {
    // Apply ayanamsa shifts
    let shift = 0;
    if (ayanamsa === "KP") shift = 0.10;
    else if (ayanamsa === "Raman") shift = -1.35;
    else if (ayanamsa === "Yukteshwar") shift = -0.45;
    else if (ayanamsa === "Pushya-paksha") shift = -2.10;

    return BASE_PLANETS.map((p) => {
      let finalDeg = p.deg + shift;
      let finalSign = p.sign;
      if (finalDeg < 0) {
        finalDeg += 30;
        // Move back a sign (Scorpio -> Libra, etc.)
        const signs = ["Scorpio", "Libra", "Virgo", "Leo", "Cancer", "Taurus", "Aries", "Pisces", "Aquarius", "Capricorn", "Sagittarius"];
        // simplified sign adjustment
        if (p.sign === "Scorpio") finalSign = "Libra";
        else if (p.sign === "Aries") finalSign = "Pisces";
      } else if (finalDeg >= 30) {
        finalDeg -= 30;
        if (p.sign === "Scorpio") finalSign = "Sagittarius";
      }

      // Determine active house number based on selection
      let houseNum = p.houseWhole;
      if (houseSystem === "Bhāva Cālita") houseNum = p.houseChalita;
      else if (houseSystem === "Placidus") houseNum = p.housePlacidus;

      return {
        ...p,
        deg: finalDeg,
        sign: finalSign,
        house: houseNum
      };
    });
  }, [ayanamsa, houseSystem]);

  // Cusp-near flags: planets within 1° of house or sign borders
  const boundaryFlags = useMemo(() => {
    const flags: string[] = [];
    
    // Check Lagna boundary crossing
    if (lagnaSweep.crossesBoundary) {
      flags.push(`Lagna crosses boundary between ${activeLagnaSign} and adjacent sign within uncertainty window.`);
    } else if (baseLagnaDeg < 1.0 || baseLagnaDeg > 29.0) {
      flags.push(`Lagna is highly cusp-sensitive (${baseLagnaDeg.toFixed(2)}° ${activeLagnaSign}).`);
    }

    // Check Moon nakshatra boundary
    // Moon at 12.45 Pisces is in Uttara Bhadrapada (3°20' to 16°40' Pisces).
    // If uncertainty sweeps it near borders:
    const moonSweepMin = 12.45 - uncertainty * 0.01; // Moon moves ~0.01 deg per minute
    if (moonSweepMin < 3.33) {
      flags.push("Moon is near Uttara Bhadrapada nakshatra boundary.");
    }

    // Check planets cusp-near in Chalita/Placidus
    computedPlanets.forEach((p) => {
      if (p.deg < 1.0) {
        flags.push(`${p.name} is cusp-sensitive at ${p.deg.toFixed(2)}° of ${p.sign} (near sign border).`);
      }
      // Highlight houses differences
      if (p.houseWhole !== p.houseChalita && houseSystem === "Bhāva Cālita") {
        flags.push(`${p.name} shifts from House ${p.houseWhole} (Whole-Sign) to House ${p.houseChalita} (Bhāva Cālita).`);
      }
      if (p.houseWhole !== p.housePlacidus && houseSystem === "Placidus") {
        flags.push(`${p.name} shifts from House ${p.houseWhole} (Whole-Sign) to House ${p.housePlacidus} (Placidus).`);
      }
    });

    return flags;
  }, [computedPlanets, baseLagnaDeg, activeLagnaSign, lagnaSweep, uncertainty, houseSystem]);

  // 2. Stream Match Checks
  const streamWarnings = useMemo(() => {
    const warnings: string[] = [];
    if (stream === "KP") {
      if (ayanamsa !== "KP") {
        warnings.push("Ayanāṁśa mismatch: KP stream selected but Ayanāṁśa is not set to KP. In Krishnamurti Padhdhati, KP Ayanāṁśa is mandatory.");
      }
      if (houseSystem !== "Placidus") {
        warnings.push("House system mismatch: KP stream selected but House System is not Placidus. KP relies strictly on Placidus cusps.");
      }
    } else if (stream === "Parashari") {
      if (ayanamsa === "KP") {
        warnings.push("Convention warning: KP Ayanāṁśa is being applied to a classical Parāśari stream.");
      }
      if (houseSystem === "Placidus") {
        warnings.push("Convention warning: Placidus house system is selected for classical Parāśari reading (Whole-Sign or Bhāva Cālita is default).");
      }
    }
    return warnings;
  }, [stream, ayanamsa, houseSystem]);

  // 3. Combined Verdict Logic relative to question type
  const verdict = useMemo(() => {
    // Strictness levels:
    // fine-timing: very strict
    // yes-no: strict on cusps
    // character: tolerant of time/house systems
    // year: moderate

    const hasWarnings = streamWarnings.length > 0;
    const boundaryCount = boundaryFlags.length;
    const timeUncertain = reliability !== "reliable" || uncertainty > 30;

    let level: "PROCEED" | "PROCEED WITH FLAGS" | "RECTIFY" | "DECLINE" = "PROCEED";
    let rationale = "";

    if (reliability === "unknown") {
      if (questionType === "fine-timing") {
        level = "DECLINE";
        rationale = "Reading declined: fine-timing predictions (dasha/bhukti) cannot be honestly attempted when birth time is completely unknown.";
      } else {
        level = "RECTIFY";
        rationale = "Birth-time rectification required: time is completely unknown. Broad tendencies may be read, but a full chart sequence is locked.";
      }
    } else if (questionType === "fine-timing") {
      if (uncertainty > 45 || lagnaSweep.crossesBoundary || reliability === "approximate") {
        level = "RECTIFY";
        rationale = "Rectification required: timing events requires precise Vimshottari balances and a stable Lagna. The current time uncertainty throws off dasha timings by over a year.";
      } else if (boundaryCount > 0 || hasWarnings) {
        level = "PROCEED WITH FLAGS";
        rationale = "Proceed with caution: birth data is generally reliable, but critical placements sit near sign/house boundaries. Delivery must state these caveats explicitly.";
      } else {
        level = "PROCEED";
        rationale = "Ready to proceed: data checks are clean, uncertainty is minimal, and alignments are consistent for timing.";
      }
    } else if (questionType === "yes-no") {
      const cuspSensitiveMoonOrLagna = boundaryFlags.some(f => f.includes("Lagna") || f.includes("Moon"));
      if (cuspSensitiveMoonOrLagna && uncertainty > 15) {
        level = "RECTIFY";
        rationale = "Rectification required: yes/no answers turn on cuspal sub-lords. Small time changes shift the cusp-placements of the questioning lords.";
      } else if (boundaryCount > 0 || hasWarnings) {
        level = "PROCEED WITH FLAGS";
        rationale = "Proceed with caution: some cuspal transitions occur in the uncertainty window. Mention these vulnerabilities in the reading record.";
      } else {
        level = "PROCEED";
        rationale = "Ready to proceed: clear, stable houses and cusps for a yes/no verdict.";
      }
    } else {
      // character / year (more tolerant)
      if (uncertainty > 90) {
        level = "RECTIFY";
        rationale = "Rectification recommended: time uncertainty is too large to establish even a stable Ascendant sign with confidence.";
      } else if (boundaryCount > 1 || hasWarnings) {
        level = "PROCEED WITH FLAGS";
        rationale = "Proceed with caution: character analysis can proceed, but boundary placements require stating alternatives (e.g., dual-sign character traits).";
      } else {
        level = "PROCEED";
        rationale = "Ready to proceed: data is stable enough for character assessment.";
      }
    }

    return { level, rationale };
  }, [reliability, uncertainty, questionType, boundaryFlags, streamWarnings, lagnaSweep]);

  // 4. Reading Record Stub output
  const recordStubText = useMemo(() => {
    return `### DATA PRE-FLIGHT VERIFICATION RECORD
- **Stated Birth Time:** ${birthTime} (Delhi, India)
- **Time Source/Reliability:** ${reliability.toUpperCase()} (Uncertainty: ±${uncertainty} mins)
- **Ayanāṁśa Selected:** ${ayanamsa.toUpperCase()}
- **House System Selected:** ${houseSystem}
- **Target Question Type:** ${questionType.toUpperCase()} (${stream.toUpperCase()} stream)
- **Sensitivity Flags:**
${boundaryFlags.length > 0 ? boundaryFlags.map(f => `  * [FLAG] ${f}`).join("\n") : "  * None detected (data stable)"}
- **Combined Verdict:** ${verdict.level}
- **Pedagogical Rationale:** ${verdict.rationale}
- **Reproducibility Code:** GRH-D1D9-${ayanamsa.substring(0, 3)}-${houseSystem.replace(/\s+/g, "").substring(0, 5)}`;
  }, [birthTime, reliability, uncertainty, ayanamsa, houseSystem, questionType, stream, boundaryFlags, verdict]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(recordStubText);
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
      {/* Title */}
      <div className="pb-4 border-b mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: GOLD, fontFamily: "var(--font-cormorant), serif" }}>
            Chart Data Verifier
          </h2>
          <p className="text-xs italic text-gray-600">
            Pre-flight calculations: check birth-time uncertainty, ayanāṁśa, and house systems before reading.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-amber-800/10 px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Compass size={11} className="animate-spin-slow" />
          PRE-FLIGHT STAGE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-500">
            Astrologer's Data Input
          </span>

          {/* Time & Reliability */}
          <div className="p-4 rounded-xl border bg-white space-y-3" style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Birth Time (LMT):</label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Time Reliability:</label>
                <select
                  value={reliability}
                  onChange={(e) => handleReliabilityChange(e.target.value as any)}
                  className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800"
                >
                  <option value="reliable">Reliable (Certificate)</option>
                  <option value="approximate">Approximate (Family)</option>
                  <option value="unknown">Unknown Time</option>
                </select>
              </div>
            </div>

            {/* Uncertainty Slider */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-semibold text-gray-700">
                <span>Time Uncertainty:</span>
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
              <div className="flex justify-between text-[9px] text-gray-400 font-semibold">
                <span>EXACT (0m)</span>
                <span>MODERATE (30m)</span>
                <span>VAGUE (3h)</span>
              </div>
            </div>
          </div>

          {/* Methodological Context */}
          <div className="p-4 rounded-xl border bg-white space-y-3.5" style={{ borderColor: HAIRLINE }}>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Astrological Stream:</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value as any)}
                className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800"
              >
                <option value="Parashari">Classical Parāśari</option>
                <option value="KP">Krishnamurti Padhdhati (KP)</option>
                <option value="strength-refinement">Strength Refinement</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Ayanāṁśa Offset:</label>
                <select
                  value={ayanamsa}
                  onChange={(e) => setAyanamsa(e.target.value as any)}
                  className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800"
                >
                  <option value="Lahiri">Chitrapakṣa (Lahiri)</option>
                  <option value="KP">KP Ayanāṁśa</option>
                  <option value="Raman">B.V. Raman</option>
                  <option value="Yukteshwar">Sri Yukteshwar</option>
                  <option value="Pushya-paksha">Pushya-pakṣa</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">House System:</label>
                <select
                  value={houseSystem}
                  onChange={(e) => setHouseSystem(e.target.value as any)}
                  className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800"
                >
                  <option value="whole-sign">Whole-Sign</option>
                  <option value="Bhāva Cālita">Bhāva Cālita</option>
                  <option value="Placidus">Placidus Cusps</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Question Type (Pedagogical strictness):</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as any)}
                className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800"
              >
                <option value="character">General Character (Tolerant)</option>
                <option value="year">Annual Year Reading (Moderate)</option>
                <option value="yes-no">Cuspal Yes/No (Strict)</option>
                <option value="fine-timing">Fine Timing (Extremely Strict)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Outputs & Verifications */}
        <div className="lg:col-span-7 space-y-4">
          {/* Dynamic Verdict Header */}
          <div
            className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all`}
            style={{
              borderColor: verdict.level === "PROCEED" ? "#16a34a" : verdict.level === "PROCEED WITH FLAGS" ? GOLD : "#dc2626",
              backgroundColor: verdict.level === "PROCEED" ? "rgba(22, 163, 74, 0.04)" : verdict.level === "PROCEED WITH FLAGS" ? "rgba(156, 122, 47, 0.04)" : "rgba(220, 38, 38, 0.04)"
            }}
          >
            <div className="flex-1 space-y-1">
              <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-500">
                Combined Pre-Flight Verdict
              </span>
              <h3
                className="text-lg font-bold flex items-center gap-2"
                style={{
                  color: verdict.level === "PROCEED" ? "#15803d" : verdict.level === "PROCEED WITH FLAGS" ? GOLD : "#b91c1c"
                }}
              >
                {verdict.level === "PROCEED" && <CheckCircle size={18} />}
                {verdict.level === "PROCEED WITH FLAGS" && <AlertTriangle size={18} />}
                {(verdict.level === "RECTIFY" || verdict.level === "DECLINE") && <XCircle size={18} />}
                {verdict.level}
              </h3>
              <p className="text-xs text-gray-600 leading-normal">
                {verdict.rationale}
              </p>
            </div>
          </div>

          {/* Visualizing Sweeps */}
          <div className="p-4 rounded-xl border bg-white space-y-4" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-500">
              Sensitivity & Drift Gauges
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lagna drift gauge */}
              <div className="border p-3 rounded-lg flex flex-col justify-between" style={{ borderColor: HAIRLINE }}>
                <span className="text-xs font-bold text-gray-700 block mb-1">Lagna Arc Sweep:</span>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 relative flex items-center justify-center border-2 border-dashed rounded-full" style={{ borderColor: GOLD }}>
                    {/* Simulated SVG arc sweep */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="24"
                        fill="transparent"
                        stroke="#e2e8f0"
                        strokeWidth="3"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="24"
                        fill="transparent"
                        stroke={GOLD}
                        strokeWidth="5"
                        strokeDasharray="150.7"
                        strokeDashoffset={150.7 - Math.min(150.7, (lagnaSweep.span / 360) * 150.7)}
                      />
                    </svg>
                    <span className="absolute text-[10px] font-mono font-bold" style={{ color: GOLD }}>
                      {lagnaSweep.span.toFixed(1)}°
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-bold block text-gray-500">SIGN DRIFT WINDOW</span>
                    <span className="text-xs font-bold font-mono text-gray-800">{lagnaSweep.rangeText}</span>
                    <span className="text-[9px] block text-gray-400">
                      {lagnaSweep.crossesBoundary ? "🚨 Crosses Sign Boundary!" : "✓ Stable within sign"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vimshottari dasha balance drift gauge */}
              <div className="border p-3 rounded-lg flex flex-col justify-between" style={{ borderColor: HAIRLINE }}>
                <span className="text-xs font-bold text-gray-700 block mb-1">Vimshottari Dāśā Balance Shift:</span>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-500">Max Balance Drift:</span>
                    <strong style={{ color: GOLD }}>±{dashaDriftMonths.toFixed(1)} months</strong>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-800 h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (dashaDriftMonths / 12) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[9px] block text-gray-400">
                    A shifts of {dashaDriftMonths.toFixed(1)} months can misalign transits with bhukti endpoints.
                  </span>
                </div>
              </div>
            </div>

            {/* Warnings and Cusp flags lists */}
            {(boundaryFlags.length > 0 || streamWarnings.length > 0) && (
              <div className="space-y-2 pt-2 border-t" style={{ borderColor: HAIRLINE }}>
                <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
                  Detected Placements Vulnerabilities
                </span>
                
                {streamWarnings.map((warning, idx) => (
                  <div key={idx} className="flex gap-2 items-start p-2 rounded bg-red-50 border border-red-200 text-xs text-red-950">
                    <AlertTriangle size={14} className="text-red-700 mt-0.5 shrink-0" />
                    <span>{warning}</span>
                  </div>
                ))}

                {boundaryFlags.map((flag, idx) => (
                  <div key={idx} className="flex gap-2 items-start p-2 rounded bg-amber-50 border border-amber-200 text-xs text-amber-950">
                    <AlertTriangle size={14} className="text-amber-700 mt-0.5 shrink-0" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reading Record Stub copyable card */}
          <div className="p-4 rounded-xl border bg-white space-y-3" style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Layers size={14} /> Recommended Reading-Record Stub
              </span>
              <button
                onClick={copyToClipboard}
                className="px-2 py-1 text-[10px] font-bold rounded border hover:bg-amber-50 transition-all flex items-center gap-1.5 bg-transparent"
                style={{ borderColor: HAIRLINE }}
              >
                {copied ? (
                  <>
                    <Check size={11} className="text-green-700" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={11} /> Copy Stub
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              rows={5}
              value={recordStubText}
              className="w-full text-[10px] font-mono p-3 border rounded bg-amber-950/[0.01] text-gray-600 focus:outline-none"
              style={{ borderColor: HAIRLINE }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
