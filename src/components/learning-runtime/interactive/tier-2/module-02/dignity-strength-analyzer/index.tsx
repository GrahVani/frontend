"use client";

import React, { useState, useMemo } from "react";
import { Compass, Shield, Award, HelpCircle } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

// Minimum required Shadbala in Virupas for each planet (classical rule)
const MIN_VIRUPAS: Record<string, number> = {
  Sun: 390,
  Moon: 360,
  Mars: 300,
  Mercury: 420,
  Jupiter: 390,
  Saturn: 300
};

export function DignityStrengthAnalyzer() {
  const [planet, setPlanet] = useState("Sun");
  const [dignity, setDignity] = useState<"exalted" | "own" | "friendly" | "enemy" | "debilitated">("own");
  const [shadbalaPercent, setShadbalaPercent] = useState(100); 

  // Calculate actual Virupas dynamically
  const actualVirupas = useMemo(() => {
    const min = MIN_VIRUPAS[planet] || 300;
    return Math.round((min * shadbalaPercent) / 100);
  }, [planet, shadbalaPercent]);

  const minRequired = useMemo(() => {
    return MIN_VIRUPAS[planet] || 300;
  }, [planet]);

  // Tilt angle of balance scale based on inputs
  const balanceTilt = useMemo(() => {
    let dignityWeight = 0;
    if (dignity === "exalted") dignityWeight = 15;
    if (dignity === "own") dignityWeight = 8;
    if (dignity === "friendly") dignityWeight = 4;
    if (dignity === "enemy") dignityWeight = -4;
    if (dignity === "debilitated") dignityWeight = -15;

    const shadbalaWeight = (shadbalaPercent - 100) * 0.25; 
    return dignityWeight - shadbalaWeight;
  }, [dignity, shadbalaPercent]);

  const outputVerdict = useMemo(() => {
    if (dignity === "exalted" && shadbalaPercent >= 120) {
      return {
        title: "PRISTINE & POWERFUL DELIVERY",
        color: "#15803d",
        bg: "rgba(22, 163, 74, 0.04)",
        desc: `${planet} holds high qualitative nobility (Exalted) and exceptional quantitative power (${actualVirupas} Virupas vs ${minRequired} required). The planet will manifest its promises smoothly, cleanly, and with immense success during its dasha.`
      };
    }
    if (dignity === "debilitated" && shadbalaPercent < 80) {
      return {
        title: "DOOMED PROMISE & INABILITY",
        color: "#b91c1c",
        bg: "rgba(220, 38, 38, 0.04)",
        desc: `${planet} is debilitated and lacks functional strength (${actualVirupas} Virupas vs ${minRequired} required). Its dasha will bring frustration, delays, and an inability to manifest the promise of its houses.`
      };
    }
    if (dignity === "debilitated" && shadbalaPercent >= 130) {
      return {
        title: "STRUGGLE TO POWER (NEECHA BHANGA POTENTIAL)",
        color: GOLD,
        bg: "rgba(156, 122, 47, 0.04)",
        desc: `${planet} is debilitated (weak status) but has high raw functional energy (${actualVirupas} Virupas). The querent will succeed after initial failures, indicating a classic Neecha Bhanga dynamic.`
      };
    }
    if (dignity === "exalted" && shadbalaPercent < 80) {
      return {
        title: "NOBLE BUT FRAGILE",
        color: GOLD,
        bg: "rgba(156, 122, 47, 0.04)",
        desc: `${planet} is exalted but lacks the required Shadbala strength (${actualVirupas} Virupas vs ${minRequired} required). High expectations but slow or fragile delivery.`
      };
    }
    return {
      title: "BALANCED FUNCTIONAL STATUS",
      color: GOLD,
      bg: "rgba(156, 122, 47, 0.04)",
      desc: `${planet} holds normal/supportive dignity (${dignity}) and average strength (${actualVirupas} Virupas). Expect stable, predictable results during its dasha.`
    };
  }, [planet, dignity, shadbalaPercent, actualVirupas, minRequired]);

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
            Dignity and Strength Analyzer
          </h2>
          <p className="text-xs italic text-gray-600">
            Step 1: Compare planetary status (dignity) with execution capacity (Shadbala in Virupas).
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Compass size={11} className="animate-spin-slow" />
          MODULE 2.3.1
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Planetary Status Inputs
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Select Planet:</label>
              <select
                value={planet}
                onChange={(e) => setPlanet(e.target.value)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans font-bold text-amber-950"
              >
                <option value="Sun">Sun (Surya) - Min: 390 Virupas</option>
                <option value="Moon">Moon (Chandra) - Min: 360 Virupas</option>
                <option value="Mars">Mars (Mangala) - Min: 300 Virupas</option>
                <option value="Mercury">Mercury (Budha) - Min: 420 Virupas</option>
                <option value="Jupiter">Jupiter (Guru) - Min: 390 Virupas</option>
                <option value="Saturn">Saturn (Shani) - Min: 300 Virupas</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Sign Dignity:</label>
              <select
                value={dignity}
                onChange={(e) => setDignity(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans"
              >
                <option value="exalted">Exalted (Nobility)</option>
                <option value="own">Own Sign / Moolatrikona</option>
                <option value="friendly">Friendly Sign</option>
                <option value="enemy">Enemy Sign</option>
                <option value="debilitated">Debilitated (Struggle)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Shadbala Ratio:</span>
                <span className="text-amber-800 font-mono">{shadbalaPercent}% ({actualVirupas} / {minRequired} Virupas)</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={shadbalaPercent}
                onChange={(e) => setShadbalaPercent(Number(e.target.value))}
                className="w-full accent-amber-800 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                <span>WEAK (50%)</span>
                <span>REQUIRED (100%)</span>
                <span>STRONG (200%)</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Display */}
          <div
            className="p-4 rounded-xl border shadow-sm transition-all text-xs"
            style={{
              borderColor: outputVerdict.color,
              backgroundColor: outputVerdict.bg
            }}
          >
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">ESTIMATED CAPACITY</span>
            <h4 className="text-xs font-bold block mb-1" style={{ color: outputVerdict.color }}>
              {outputVerdict.title}
            </h4>
            <p className="text-gray-600 leading-relaxed font-normal">{outputVerdict.desc}</p>
          </div>
        </div>

        {/* Visualizer Column */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Interactive Balance Scale
          </span>

          <div className="p-6 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[220px]" style={{ borderColor: HAIRLINE }}>
            {/* SVG Balance Scale */}
            <svg viewBox="0 0 100 60" className="w-full max-w-[280px]">
              <line x1="50" y1="10" x2="50" y2="50" stroke={INK_SECONDARY} strokeWidth="2.5" />
              <line x1="40" y1="50" x2="60" y2="50" stroke={INK_SECONDARY} strokeWidth="4" strokeLinecap="round" />

              <g transform={`rotate(${balanceTilt}, 50, 15)`}>
                <line x1="20" y1="15" x2="80" y2="15" stroke={GOLD} strokeWidth="2" />
                <circle cx="50" cy="15" r="2.5" fill={GOLD} />

                {/* Left Pan: Dignity */}
                <line x1="20" y1="15" x2="10" y2="30" stroke={INK_SECONDARY} strokeWidth="0.8" />
                <line x1="20" y1="15" x2="30" y2="30" stroke={INK_SECONDARY} strokeWidth="0.8" />
                <path d="M 8 30 Q 20 38 32 30 Z" fill="rgba(156, 122, 47, 0.15)" stroke={GOLD} strokeWidth="0.8" />
                <text x="20" y="27" textAnchor="middle" fontSize="4.5" fill={INK_PRIMARY} fontWeight="bold">Dignity</text>

                {/* Right Pan: Shadbala */}
                <line x1="80" y1="15" x2="70" y2="30" stroke={INK_SECONDARY} strokeWidth="0.8" />
                <line x1="80" y1="15" x2="90" y2="30" stroke={INK_SECONDARY} strokeWidth="0.8" />
                <path d="M 68 30 Q 80 38 92 30 Z" fill="rgba(156, 122, 47, 0.15)" stroke={GOLD} strokeWidth="0.8" />
                <text x="80" y="27" textAnchor="middle" fontSize="4.5" fill={INK_PRIMARY} fontWeight="bold">Shadbala</text>
              </g>
            </svg>
            <p className="text-[10px] text-gray-500 text-center italic mt-4 max-w-[320px]">
              Dignity represents qualitative nobility; Shadbala represents quantitative energy (measured in Virupas).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
