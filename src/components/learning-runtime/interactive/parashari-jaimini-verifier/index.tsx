"use client";

import React, { useState, useMemo } from "react";
import { Compass, Info, Check, AlertTriangle } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// Circular coordinates (100x100 box) for drawing 12 signs in a ring
const SIGN_COORDS = [
  { sign: "Aries", label: "Ar", cx: 50, cy: 10 },
  { sign: "Taurus", label: "Ta", cx: 70, cy: 15 },
  { sign: "Gemini", label: "Ge", cx: 85, cy: 30 },
  { sign: "Cancer", label: "Ca", cx: 90, cy: 50 },
  { sign: "Leo", label: "Le", cx: 85, cy: 70 },
  { sign: "Virgo", label: "Vi", cx: 70, cy: 85 },
  { sign: "Libra", label: "Li", cx: 50, cy: 90 },
  { sign: "Scorpio", label: "Sc", cx: 30, cy: 85 },
  { sign: "Sagittarius", label: "Sa", cx: 15, cy: 70 },
  { sign: "Capricorn", label: "Cp", cx: 10, cy: 50 },
  { sign: "Aquarius", label: "Aq", cx: 15, cy: 30 },
  { sign: "Pisces", label: "Pi", cx: 30, cy: 15 }
];

export function ParashariJaiminiVerifier() {
  const [dashaLord, setDashaLord] = useState<"auspicious" | "malefic">("auspicious");
  const [karaka, setKaraka] = useState("Amatyakaraka");
  const [karakaSign, setKarakaSign] = useState("Aries");
  const [dashaSign, setDashaSign] = useState("Leo");

  // Calculate Jaimini aspects (Rashi Drishti)
  const isJaiminiAspected = useMemo(() => {
    // Rashi Drishti rules:
    // Cardinal aspect Fixed except adjacent
    // Fixed aspect Cardinal except adjacent
    // Mutable aspect all other Mutables
    const cardinal = ["Aries", "Cancer", "Libra", "Capricorn"];
    const fixed = ["Taurus", "Leo", "Scorpio", "Aquarius"];
    const mutable = ["Gemini", "Virgo", "Sagittarius", "Pisces"];

    if (cardinal.includes(dashaSign)) {
      // aspects fixed except adjacent
      const adj: Record<string, string> = { Aries: "Taurus", Cancer: "Leo", Libra: "Scorpio", Capricorn: "Aquarius" };
      return fixed.includes(karakaSign) && karakaSign !== adj[dashaSign];
    }
    if (fixed.includes(dashaSign)) {
      // aspects cardinal except adjacent
      const adj: Record<string, string> = { Taurus: "Aries", Leo: "Cancer", Scorpio: "Libra", Aquarius: "Capricorn" };
      return cardinal.includes(karakaSign) && karakaSign !== adj[dashaSign];
    }
    if (mutable.includes(dashaSign)) {
      // aspects other mutables
      return mutable.includes(karakaSign) && karakaSign !== dashaSign;
    }
    return false;
  }, [dashaSign, karakaSign]);

  const outputVerdict = useMemo(() => {
    if (dashaLord === "auspicious" && isJaiminiAspected) {
      return {
        level: "CLEAN CROSS-STREAM CONVERGENCE",
        color: "#15803d",
        bg: "rgba(22, 163, 74, 0.04)",
        desc: `Joint validation success! Parashari dasha lord is supportive, and the Jaimini Chara Dasha sign (${dashaSign}) aspects your key Chara Karaka (${karaka}) in ${karakaSign} under Rashi Drishti rules.`
      };
    }
    if (dashaLord === "malefic" && !isJaiminiAspected) {
      return {
        level: "MUTUAL REJECTION (DIVERGENCE)",
        color: "#b91c1c",
        bg: "rgba(220, 38, 38, 0.04)",
        desc: `Both streams deny timing. Parashari dasha lord is malefic, and the Chara Dasha sign does not aspect the natal karaka, triggering delay.`
      };
    }
    return {
      level: "MIXED TIMING WINDOW",
      color: GOLD,
      bg: "rgba(156, 122, 47, 0.04)",
      desc: "One stream confirms but the other is neutral/opposed. Minor success or delay is anticipated."
    };
  }, [dashaLord, karaka, isJaiminiAspected, dashaSign, karakaSign]);

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
          <h2 className="text-2xl font-bold tracking-tight text-amber-900 animate-fade-in" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Parāśarī-Jaimini Paired Verifier
          </h2>
          <p className="text-xs italic text-gray-600">
            Step 3: Compare Parashari Vimshottari dasha lords with Jaimini Chara Karakas.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Compass size={11} className="animate-spin-slow" />
          MODULE 2.4.3
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Cross-Stream Inputs
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Parāśarī Dasha Lord:</label>
              <select
                value={dashaLord}
                onChange={(e) => setDashaLord(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
              >
                <option value="auspicious">Auspicious Vimshottari Lord</option>
                <option value="malefic">Challenging / Malefic Lord</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Jaimini Chara Karaka:</label>
              <select
                value={karaka}
                onChange={(e) => setKaraka(e.target.value)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
              >
                <option value="Amatyakaraka">Amatyakaraka (AmK - Career / Status)</option>
                <option value="Darakaraka">Darakaraka (DK - Marriage / Spouse)</option>
                <option value="Atmakaraka">Atmakaraka (AK - Soul / Self)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-500">Chara Dasha Sign:</label>
                <select
                  value={dashaSign}
                  onChange={(e) => setDashaSign(e.target.value)}
                  className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800 font-sans"
                >
                  {ZODIAC_SIGNS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] uppercase font-bold text-gray-500">Karaka Placement Sign:</label>
                <select
                  value={karakaSign}
                  onChange={(e) => setKarakaSign(e.target.value)}
                  className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800 font-sans"
                >
                  {ZODIAC_SIGNS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Verdict Box */}
          <div
            className="p-4 rounded-xl border shadow-sm text-xs font-semibold leading-relaxed"
            style={{
              borderColor: outputVerdict.color,
              backgroundColor: outputVerdict.bg
            }}
          >
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Verification Verdict</span>
            <strong className="text-xs block mb-1" style={{ color: outputVerdict.color }}>
              {outputVerdict.level}
            </strong>
            <p className="text-gray-600 font-normal leading-normal">{outputVerdict.desc}</p>
          </div>
        </div>

        {/* Visualizer Column */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Jaimini Sign Aspect Wheel
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[260px]" style={{ borderColor: HAIRLINE }}>
            {/* SVG sign circle */}
            <div className="w-52 h-52">
              <svg viewBox="0 0 100 100" className="w-full h-full font-serif">
                <circle cx="50" cy="50" r="40" fill="none" stroke={HAIRLINE} strokeWidth="1" />
                
                {/* Sign cells */}
                {SIGN_COORDS.map((cell) => {
                  const isKaraka = cell.sign === karakaSign;
                  const isDashaSign = cell.sign === dashaSign;
                  
                  return (
                    <g key={cell.sign}>
                      <circle cx={cell.cx} cy={cell.cy} r="4.5" fill="white" stroke={isKaraka ? "#dc2626" : isDashaSign ? GOLD : HAIRLINE} strokeWidth="0.8" />
                      <text x={cell.cx} y={cell.cy + 1.2} textAnchor="middle" fontSize="3.5" fontWeight="bold" fill={isKaraka ? "#dc2626" : isDashaSign ? GOLD : INK_SECONDARY}>
                        {isKaraka ? karaka.slice(0, 2) : isDashaSign ? "DS" : cell.label}
                      </text>
                    </g>
                  );
                })}

                {/* Draw sign aspect connection beam if Jaimini aspects */}
                {isJaiminiAspected ? (
                  <line
                    x1={SIGN_COORDS.find((c) => c.sign === dashaSign)?.cx}
                    y1={SIGN_COORDS.find((c) => c.sign === dashaSign)?.cy}
                    x2={SIGN_COORDS.find((c) => c.sign === karakaSign)?.cx}
                    y2={SIGN_COORDS.find((c) => c.sign === karakaSign)?.cy}
                    stroke={GOLD}
                    strokeWidth="1.2"
                    strokeDasharray="2,2"
                  />
                ) : (
                  <line
                    x1={SIGN_COORDS.find((c) => c.sign === dashaSign)?.cx}
                    y1={SIGN_COORDS.find((c) => c.sign === dashaSign)?.cy}
                    x2={SIGN_COORDS.find((c) => c.sign === karakaSign)?.cx}
                    y2={SIGN_COORDS.find((c) => c.sign === karakaSign)?.cy}
                    stroke="#dc2626"
                    strokeWidth="1.2"
                    strokeDasharray="2,2"
                  />
                )}
              </svg>
            </div>
            <p className="text-[10px] text-gray-500 text-center italic mt-3 max-w-[320px]">
              {isJaiminiAspected ? (
                <span className="text-green-700 font-bold block">✓ Verified: {dashaSign} aspects {karakaSign} under Jaimini rules!</span>
              ) : (
                <span className="text-red-700 font-bold block">✗ No Aspect: {dashaSign} does not aspect {karakaSign} under Jaimini rules.</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
