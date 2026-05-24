"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Gem, ShieldAlert, ShieldCheck, XCircle, CheckCircle2, Sparkles,
  AlertTriangle, ArrowRight, Star,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────
const ASCENDANTS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const PLANET_DATA: {
  name: string;
  gem: string;
  gemHindi: string;
  finger: string;
  metal: string;
  color: string;
}[] = [
  { name: "Sun", gem: "Ruby", gemHindi: "Manik", finger: "Right Ring", metal: "Gold", color: "#f97316" },
  { name: "Moon", gem: "Pearl", gemHindi: "Moti", finger: "Right Little", metal: "Silver", color: "#64748b" },
  { name: "Mars", gem: "Red Coral", gemHindi: "Moonga", finger: "Right Ring", metal: "Gold/Copper", color: "#ef4444" },
  { name: "Mercury", gem: "Emerald", gemHindi: "Panna", finger: "Right Little", metal: "Gold", color: "#22c55e" },
  { name: "Jupiter", gem: "Yellow Sapphire", gemHindi: "Pukhraj", finger: "Right Index", metal: "Gold", color: "#eab308" },
  { name: "Venus", gem: "Diamond", gemHindi: "Heera", finger: "Right Middle", metal: "Gold", color: "#ec4899" },
  { name: "Saturn", gem: "Blue Sapphire", gemHindi: "Neelam", finger: "Right Middle", metal: "Silver", color: "#6b7280" },
  { name: "Rahu", gem: "Hessonite", gemHindi: "Gomed", finger: "Right Middle", metal: "Silver", color: "#7c3aed" },
  { name: "Ketu", gem: "Cat's Eye", gemHindi: "Lehsuniya", finger: "Right Little", metal: "Silver", color: "#3b82f6" },
];

// House rulerships by ascendant (simplified)
const TRINE_HOUSES = [1, 5, 9];
const DUSTHANA_HOUSES = [6, 8, 12];
const MARAKA_HOUSES = [2, 7];

function getHouseRulerships(ascendant: string): Record<string, number[]> {
  const idx = ASCENDANTS.indexOf(ascendant);
  const lords: Record<string, number[]> = {};
  const lordSigns: Record<string, string[]> = {
    Mars: ["Aries", "Scorpio"],
    Venus: ["Taurus", "Libra"],
    Mercury: ["Gemini", "Virgo"],
    Moon: ["Cancer"],
    Sun: ["Leo"],
    Jupiter: ["Sagittarius", "Pisces"],
    Saturn: ["Capricorn", "Aquarius"],
  };

  Object.entries(lordSigns).forEach(([lord, signs]) => {
    lords[lord] = signs.map((s) => {
      const sIdx = ASCENDANTS.indexOf(s);
      let house = ((sIdx - idx + 12) % 12) + 1;
      return house;
    });
  });

  // Rahu/Ketu don't rule signs traditionally
  lords["Rahu"] = [];
  lords["Ketu"] = [];

  return lords;
}

function classifyPlanet(ascendant: string, planetName: string): "anukul" | "pratikul" | "maraka" | "neutral" {
  if (planetName === "Rahu" || planetName === "Ketu") return "neutral";
  const houses = getHouseRulerships(ascendant)[planetName] || [];
  if (houses.some((h) => TRINE_HOUSES.includes(h))) return "anukul";
  if (houses.some((h) => DUSTHANA_HOUSES.includes(h))) return "pratikul";
  if (houses.some((h) => MARAKA_HOUSES.includes(h))) return "maraka";
  return "neutral";
}

// ─── Component ────────────────────────────────────────────────
export default function RatnaVidyaExplorer() {
  const [ascendant, setAscendant] = useState("Leo");
  const [selectedPlanet, setSelectedPlanet] = useState(PLANET_DATA[4]); // Jupiter
  const [shadbala, setShadbala] = useState(65);
  const [placement, setPlacement] = useState("2nd");

  const classification = useMemo(() => classifyPlanet(ascendant, selectedPlanet.name), [ascendant, selectedPlanet]);
  const houses = useMemo(() => getHouseRulerships(ascendant)[selectedPlanet.name] || [], [ascendant, selectedPlanet]);

  const isSafe = classification === "anukul" || (classification === "neutral" && !DUSTHANA_HOUSES.includes(Number(placement)));
  const isBlocked = classification === "pratikul" || DUSTHANA_HOUSES.includes(Number(placement));

  const verdict = isBlocked
    ? "BLOCKED"
    : shadbala > 120
    ? "UNNECESSARY"
    : isSafe
    ? "APPROVED"
    : "REVIEW";

  return (
    <div className="bg-white border border-teal-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center">
            <Gem className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-teal-900">Ratna Vidya Prescription Engine</h3>
            <p className="text-sm text-teal-600">Gemstone Safety Protocol — Anukul vs. Pratikul</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div>
            <label className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2 block">Ascendant</label>
            <select
              value={ascendant}
              onChange={(e) => setAscendant(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-teal-200 text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              {ASCENDANTS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2 block">Planet</label>
            <select
              value={selectedPlanet.name}
              onChange={(e) => setSelectedPlanet(PLANET_DATA.find((p) => p.name === e.target.value)!)}
              className="w-full px-3 py-2 rounded-lg border border-teal-200 text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              {PLANET_DATA.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2 block">Placement House</label>
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-teal-200 text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>House {i + 1}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Shadbala Slider */}
        <div className="mb-5">
          <label className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2 block">
            Shadbala Strength: <span className="text-teal-900">{shadbala}%</span>
          </label>
          <input
            type="range"
            min={30}
            max={150}
            value={shadbala}
            onChange={(e) => setShadbala(Number(e.target.value))}
            className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: "#0d9488" }}
          />
          <div className="flex justify-between text-[10px] text-slate-700 mt-1">
            <span>Weak (30%)</span>
            <span>Normal (100%)</span>
            <span>Excess (150%)</span>
          </div>
        </div>

        {/* Classification Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-bold text-slate-800">Functional Status</span>
            </div>
            <div className={`text-sm font-bold mb-1 ${
              classification === "anukul" ? "text-emerald-700" :
              classification === "pratikul" ? "text-rose-700" :
              classification === "maraka" ? "text-amber-700" : "text-slate-700"
            }`}>
              {classification === "anukul" ? "Anukul (Favorable)" :
               classification === "pratikul" ? "Pratikul (Dangerous)" :
               classification === "maraka" ? "Maraka (Caution)" : "Neutral"}
            </div>
            <p className="text-xs text-slate-700">
              Rules houses: {houses.map((h) => `H${h}`).join(", ") || "N/A"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gem className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-bold text-slate-800">Gemstone Mapping</span>
            </div>
            <div className="text-sm font-bold text-teal-800">{selectedPlanet.gem} ({selectedPlanet.gemHindi})</div>
            <p className="text-xs text-slate-700">{selectedPlanet.finger} finger · {selectedPlanet.metal}</p>
          </div>
        </div>

        {/* Safety Gates */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-bold text-slate-800">Safety Gate Checks</span>
          </div>
          <div className="space-y-2">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${classification !== "pratikul" ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
              {classification !== "pratikul" ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
              <span className={`text-xs font-bold ${classification !== "pratikul" ? "text-emerald-800" : "text-rose-800"}`}>
                Functional Status: {classification !== "pratikul" ? "PASS" : "FAIL — Pratikul planet"}
              </span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${!DUSTHANA_HOUSES.includes(Number(placement)) ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
              {!DUSTHANA_HOUSES.includes(Number(placement)) ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
              <span className={`text-xs font-bold ${!DUSTHANA_HOUSES.includes(Number(placement)) ? "text-emerald-800" : "text-rose-800"}`}>
                Placement Check: {!DUSTHANA_HOUSES.includes(Number(placement)) ? "PASS — Safe house" : "FAIL — Dusthana house"}
              </span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${shadbala <= 120 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
              {shadbala <= 120 ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
              <span className={`text-xs font-bold ${shadbala <= 120 ? "text-emerald-800" : "text-amber-800"}`}>
                Strength Check: {shadbala <= 120 ? "PASS — Needs amplification" : "UNNECESSARY — Already strong"}
              </span>
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div className={`rounded-xl border-2 p-4 mb-5 text-center ${
          verdict === "APPROVED" ? "bg-emerald-50 border-emerald-300" :
          verdict === "BLOCKED" ? "bg-rose-50 border-rose-300" :
          verdict === "UNNECESSARY" ? "bg-amber-50 border-amber-300" :
          "bg-slate-50 border-slate-200"
        }`}>
          <div className="text-xs font-bold uppercase tracking-wide mb-1">
            {verdict === "APPROVED" ? "Prescription Approved" :
             verdict === "BLOCKED" ? "Prescription Blocked" :
             verdict === "UNNECESSARY" ? "Prescription Unnecessary" : "Requires Review"}
          </div>
          <div className={`text-2xl font-extrabold ${
            verdict === "APPROVED" ? "text-emerald-800" :
            verdict === "BLOCKED" ? "text-rose-800" :
            verdict === "UNNECESSARY" ? "text-amber-800" : "text-slate-800"
          }`}>
            {selectedPlanet.gem} ({selectedPlanet.gemHindi})
          </div>
          {verdict === "APPROVED" && (
            <p className="text-sm text-emerald-700 mt-1">
              Safe to prescribe. {selectedPlanet.name} is Anukul, placed well, and needs amplification.
            </p>
          )}
          {verdict === "BLOCKED" && (
            <p className="text-sm text-rose-700 mt-1">
              <strong>DANGER:</strong> Do NOT prescribe. {selectedPlanet.name} is {classification === "pratikul" ? "Pratikul" : "in a Dusthana house"}. A gemstone will amplify suffering.
            </p>
          )}
          {verdict === "UNNECESSARY" && (
            <p className="text-sm text-amber-700 mt-1">
              {selectedPlanet.name} already operates at {shadbala}% strength. A gemstone is unnecessary and may cause excess.
            </p>
          )}
        </div>

        {/* Astrologer Note */}
        <div className="bg-teal-50 rounded-lg border border-teal-200 p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-teal-800">Astrologer Note</div>
              <p className="text-sm text-teal-700 mt-0.5">
                Gemstones are <strong>amplifiers, not fixers</strong>. Never prescribe for Pratikul planets or planets in dusthana houses. Always verify the gemstone is natural, untreated, and of sufficient carat weight.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
