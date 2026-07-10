"use client";

import React, { useState, useMemo } from "react";
import { Compass, Info, CheckCircle2, ShieldAlert } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

export function YogaDoshaIdentifier() {
  const [comboKey, setComboKey] = useState<"ruchaka" | "kemadruma" | "gajakesari">("ruchaka");

  // Dynamic parameters for inputs
  const [marsSign, setMarsSign] = useState<"Aries" | "Scorpio" | "Capricorn" | "Cancer" | "Gemini">("Aries");
  const [marsHouse, setMarsHouse] = useState<number>(1); // Kendra vs others
  
  const [adjacentPlanets, setAdjacentPlanets] = useState<"none" | "has_planets">("none");
  const [kendraPlanets, setKendraPlanets] = useState<"none" | "has_kendra">("none");

  const [jupiterRelation, setJupiterRelation] = useState<"1" | "4" | "7" | "10" | "6" | "8">("1");
  const [jupiterCombust, setJupiterCombust] = useState<boolean>(false);

  // Evaluate Rules Dynamically based on parameters
  const ruleEvaluation = useMemo(() => {
    const rulesList: { label: string; ok: boolean; weight: number }[] = [];

    if (comboKey === "ruchaka") {
      const isKendra = [1, 4, 7, 10].includes(marsHouse);
      const isDignity = ["Aries", "Scorpio", "Capricorn"].includes(marsSign);

      rulesList.push({
        label: `Mars placed in a Kendra house (${marsHouse}H Chosen)`,
        ok: isKendra,
        weight: 50
      });
      rulesList.push({
        label: `Mars is in Aries, Scorpio, or Capricorn (${marsSign} Chosen)`,
        ok: isDignity,
        weight: 50
      });
    } else if (comboKey === "kemadruma") {
      const noAdjacent = adjacentPlanets === "none";
      const noKendra = kendraPlanets === "none";

      rulesList.push({
        label: "No planets (except Sun/Rahu) in 2nd house from Moon",
        ok: noAdjacent,
        weight: 40
      });
      rulesList.push({
        label: "No planets (except Sun/Rahu) in 12th house from Moon",
        ok: noAdjacent,
        weight: 40
      });
      rulesList.push({
        label: "No planets in Kendras from Ascendant or Moon (No Cancellation)",
        ok: noKendra,
        weight: 20
      });
    } else {
      // Gaja Kesari
      const isKendra = ["1", "4", "7", "10"].includes(jupiterRelation);
      const notCombust = !jupiterCombust;

      rulesList.push({
        label: `Jupiter is in Kendra from Moon (${jupiterRelation}H relation chosen)`,
        ok: isKendra,
        weight: 60
      });
      rulesList.push({
        label: "Jupiter is free from combustion",
        ok: notCombust,
        weight: 40
      });
    }

    return rulesList;
  }, [comboKey, marsSign, marsHouse, adjacentPlanets, kendraPlanets, jupiterRelation, jupiterCombust]);

  // Manifestation Score (sum of met rules weights)
  const manifestPercent = useMemo(() => {
    let score = 0;
    ruleEvaluation.forEach((r) => {
      if (r.ok) score += r.weight;
    });
    return score;
  }, [ruleEvaluation]);

  const outputVerdict = useMemo(() => {
    if (comboKey === "ruchaka") {
      return manifestPercent === 100
        ? "RUCHAKA YOGA ACTIVE: Exceptional valor, administrative courage, and leadership logic."
        : "RUCHAKA DORMANT: Double condition (Kendra placement + sign dignity) is unfulfilled.";
    } else if (comboKey === "kemadruma") {
      if (manifestPercent === 100) return "KEMADRUMA DOSHA ACTIVE: Feeling of mental isolation, lack of support networks.";
      if (manifestPercent === 0) return "KEMADRUMA DORMANT/CANCELLED: Sizable planetary support rules out isolation.";
      return "KEMADRUMA PARTIALLY MUTED: Presence of Kendra planets cancels major financial impacts.";
    } else {
      return manifestPercent === 100
        ? "GAJA KESARI ACTIVE: Deep wisdom, protection from disputes, and high public reputation."
        : "GAJA KESARI DORMANT: Jupiter lies in a Dusthana or is combust, reducing yoga potency.";
    }
  }, [comboKey, manifestPercent]);

  // SVG Gauge Dial coordinates
  const gaugePath = useMemo(() => {
    const angle = (manifestPercent / 100) * 180 - 180;
    const rad = (angle * Math.PI) / 180;
    const x = 50 + 35 * Math.cos(rad);
    const y = 45 + 35 * Math.sin(rad);
    return { x, y };
  }, [manifestPercent]);

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
            Yoga and Dosha Identifier
          </h2>
          <p className="text-xs italic text-gray-600">
            Step 2: Modify placement parameters to check structural rules and cancellations.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Compass size={11} className="animate-spin-slow" />
          MODULE 2.3.2
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Rule-Based Validation
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Target Combination:</label>
              <select
                value={comboKey}
                onChange={(e) => setComboKey(e.target.value as any)}
                className="w-full text-xs p-2 border rounded bg-transparent focus:ring-amber-800 font-sans font-bold"
              >
                <option value="ruchaka">Ruchaka Yoga (Mars Kendra/Dignity)</option>
                <option value="kemadruma">Kemadruma Dosha (Moon Isolation)</option>
                <option value="gajakesari">Gaja Kesari Yoga (Jupiter/Moon Kendra)</option>
              </select>
            </div>

            {/* Dynamic Controls based on selected combo */}
            <div className="border-t pt-3 space-y-3.5" style={{ borderColor: HAIRLINE }}>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Placement Configuration</span>

              {comboKey === "ruchaka" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500">Mars Sign:</label>
                    <select
                      value={marsSign}
                      onChange={(e) => setMarsSign(e.target.value as any)}
                      className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800 font-sans"
                    >
                      <option value="Aries">Aries (Own Sign)</option>
                      <option value="Scorpio">Scorpio (Own Sign)</option>
                      <option value="Capricorn">Capricorn (Exalted)</option>
                      <option value="Cancer">Cancer (Debilitated)</option>
                      <option value="Gemini">Gemini (Enemy Sign)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500">Mars House Placement:</label>
                    <select
                      value={marsHouse}
                      onChange={(e) => setMarsHouse(Number(e.target.value))}
                      className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800 font-sans"
                    >
                      <option value={1}>1st House (Kendra)</option>
                      <option value={4}>4th House (Kendra)</option>
                      <option value={7}>7th House (Kendra)</option>
                      <option value={10}>10th House (Kendra)</option>
                      <option value={5}>5th House (Trikona)</option>
                      <option value={9}>9th House (Trikona)</option>
                    </select>
                  </div>
                </div>
              )}

              {comboKey === "kemadruma" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500">Planets in 2nd/12th from Moon:</label>
                    <select
                      value={adjacentPlanets}
                      onChange={(e) => setAdjacentPlanets(e.target.value as any)}
                      className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800 font-sans"
                    >
                      <option value="none">No Planets (Isolated Moon)</option>
                      <option value="has_planets">Planets Present (Neutralized)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500">Planets in Kendra from Asc/Moon:</label>
                    <select
                      value={kendraPlanets}
                      onChange={(e) => setKendraPlanets(e.target.value as any)}
                      className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800 font-sans"
                    >
                      <option value="none">No Kendra Planets</option>
                      <option value="has_kendra">Kendra Planets present (cancellation)</option>
                    </select>
                  </div>
                </div>
              )}

              {comboKey === "gajakesari" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500">Jupiter position from Moon:</label>
                    <select
                      value={jupiterRelation}
                      onChange={(e) => setJupiterRelation(e.target.value as any)}
                      className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800 font-sans"
                    >
                      <option value="1">1st House (Kendra)</option>
                      <option value="4">4th House (Kendra)</option>
                      <option value="7">7th House (Kendra)</option>
                      <option value="10">10th House (Kendra)</option>
                      <option value="6">6th House (Dusthana)</option>
                      <option value="8">8th House (Dusthana)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-gray-500">Combustion status:</label>
                    <select
                      value={jupiterCombust ? "combust" : "free"}
                      onChange={(e) => setJupiterCombust(e.target.value === "combust")}
                      className="w-full text-xs p-1.5 border rounded bg-transparent focus:ring-amber-800 font-sans"
                    >
                      <option value="free">Jupiter is Free</option>
                      <option value="combust">Jupiter is Combust (weakened)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Rules Checkboxes (Read-Only evaluated dynamically) */}
            <div className="border-t pt-3 space-y-2" style={{ borderColor: HAIRLINE }}>
              <label className="block text-[10px] uppercase font-bold text-gray-500">Rule checklist:</label>
              {ruleEvaluation.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-[8px] text-white ${rule.ok ? "bg-green-700" : "bg-red-700"}`}>
                    {rule.ok ? "✓" : "✗"}
                  </div>
                  <span className={rule.ok ? "text-gray-700 font-medium" : "text-gray-400 line-through"}>{rule.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Display Column */}
        <div className="lg:col-span-6 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Interactive Manifest Dial
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4 flex flex-col items-center justify-center min-h-[260px]" style={{ borderColor: HAIRLINE }}>
            {/* SVG Speedometer Gauge */}
            <div className="relative w-44 h-24">
              <svg viewBox="0 0 100 50" className="w-full h-full">
                <path d="M 15 45 A 35 35 0 0 1 85 45" fill="none" stroke="#f1e6d2" strokeWidth="6" strokeLinecap="round" />
                {manifestPercent > 0 && (
                  <path
                    d={`M 15 45 A 35 35 0 0 1 ${gaugePath.x} ${gaugePath.y}`}
                    fill="none"
                    stroke={manifestPercent === 100 ? GOLD : "#8b5cf6"}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                )}
                <circle cx="50" cy="45" r="4" fill={INK_PRIMARY} />
                <line x1="50" y1="45" x2={gaugePath.x} y2={gaugePath.y} stroke={INK_PRIMARY} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div className="absolute bottom-0 inset-x-0 text-center">
                <span className="text-xl font-extrabold text-amber-900 font-mono">{manifestPercent}%</span>
                <span className="block text-[8px] uppercase tracking-widest text-gray-400 font-bold">manifestation</span>
              </div>
            </div>

            <div
              className="p-3.5 rounded border text-xs font-semibold leading-relaxed text-center w-full"
              style={{
                borderColor: manifestPercent === 100 ? GOLD : HAIRLINE,
                backgroundColor: manifestPercent === 100 ? "rgba(156, 122, 47, 0.03)" : "transparent"
              }}
            >
              {outputVerdict}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
