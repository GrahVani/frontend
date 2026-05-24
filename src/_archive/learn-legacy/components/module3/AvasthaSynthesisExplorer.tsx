"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info, Lightbulb, RotateCcw, ChevronRight, Star,
  TrendingUp, TrendingDown, Activity, CircleDot,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────
interface PlanetData {
  id: string;
  glyph: string;
  name: string;
  sanskrit: string;
  color: string;
  exaltation: string;
  debilitation: string;
  moolatrikona: string;
  ownSigns: string[];
  friendlySigns: string[];
  enemySigns: string[];
}

interface SignData {
  name: string;
  sanskrit: string;
  parity: "odd" | "even";
  element: string;
}

interface AvasthaData {
  name: string;
  label: string;
  powerPct: number;
  color: string;
  bg: string;
  border: string;
  description: string;
}

interface DignityResult {
  type: "exaltation" | "moolatrikona" | "own" | "friendly" | "neutral" | "enemy" | "debilitation";
  label: string;
  powerPct: number;
  color: string;
  description: string;
}

// ─── Static Data ──────────────────────────────────────────────
const PLANETS: PlanetData[] = [
  { id: "sun", glyph: "☉", name: "Sun", sanskrit: "Surya", color: "#d97706", exaltation: "Aries", debilitation: "Libra", moolatrikona: "Leo", ownSigns: ["Leo"], friendlySigns: ["Aries", "Cancer", "Sagittarius", "Pisces"], enemySigns: ["Taurus", "Libra", "Aquarius"] },
  { id: "moon", glyph: "☽", name: "Moon", sanskrit: "Chandra", color: "#64748b", exaltation: "Taurus", debilitation: "Scorpio", moolatrikona: "Taurus", ownSigns: ["Cancer"], friendlySigns: ["Taurus", "Gemini", "Virgo", "Libra", "Sagittarius", "Pisces"], enemySigns: ["Scorpio", "Capricorn"] },
  { id: "mars", glyph: "♂", name: "Mars", sanskrit: "Mangala", color: "#dc2626", exaltation: "Capricorn", debilitation: "Cancer", moolatrikona: "Aries", ownSigns: ["Aries", "Scorpio"], friendlySigns: ["Leo", "Sagittarius", "Pisces"], enemySigns: ["Gemini", "Virgo", "Libra", "Aquarius"] },
  { id: "mercury", glyph: "☿", name: "Mercury", sanskrit: "Budha", color: "#059669", exaltation: "Virgo", debilitation: "Pisces", moolatrikona: "Virgo", ownSigns: ["Gemini", "Virgo"], friendlySigns: ["Taurus", "Leo", "Libra"], enemySigns: ["Cancer", "Sagittarius", "Pisces"] },
  { id: "jupiter", glyph: "♃", name: "Jupiter", sanskrit: "Guru", color: "#ea580c", exaltation: "Cancer", debilitation: "Capricorn", moolatrikona: "Sagittarius", ownSigns: ["Sagittarius", "Pisces"], friendlySigns: ["Aries", "Cancer", "Leo", "Scorpio"], enemySigns: ["Gemini", "Virgo", "Libra", "Aquarius"] },
  { id: "venus", glyph: "♀", name: "Venus", sanskrit: "Shukra", color: "#db2777", exaltation: "Pisces", debilitation: "Virgo", moolatrikona: "Libra", ownSigns: ["Taurus", "Libra"], friendlySigns: ["Gemini", "Virgo", "Capricorn", "Aquarius"], enemySigns: ["Aries", "Leo", "Scorpio", "Sagittarius"] },
  { id: "saturn", glyph: "♄", name: "Saturn", sanskrit: "Shani", color: "#475569", exaltation: "Libra", debilitation: "Aries", moolatrikona: "Aquarius", ownSigns: ["Capricorn", "Aquarius"], friendlySigns: ["Taurus", "Gemini", "Virgo", "Libra"], enemySigns: ["Cancer", "Leo", "Scorpio", "Sagittarius"] },
];

const SIGNS: SignData[] = [
  { name: "Aries", sanskrit: "Mesha", parity: "odd", element: "Fire" },
  { name: "Taurus", sanskrit: "Vrishabha", parity: "even", element: "Earth" },
  { name: "Gemini", sanskrit: "Mithuna", parity: "odd", element: "Air" },
  { name: "Cancer", sanskrit: "Karka", parity: "even", element: "Water" },
  { name: "Leo", sanskrit: "Simha", parity: "odd", element: "Fire" },
  { name: "Virgo", sanskrit: "Kanya", parity: "even", element: "Earth" },
  { name: "Libra", sanskrit: "Tula", parity: "odd", element: "Air" },
  { name: "Scorpio", sanskrit: "Vrishchika", parity: "even", element: "Water" },
  { name: "Sagittarius", sanskrit: "Dhanu", parity: "odd", element: "Fire" },
  { name: "Capricorn", sanskrit: "Makara", parity: "even", element: "Earth" },
  { name: "Aquarius", sanskrit: "Kumbha", parity: "odd", element: "Air" },
  { name: "Pisces", sanskrit: "Meena", parity: "even", element: "Water" },
];

const ODD_AVASTHAS: AvasthaData[] = [
  { name: "Bala", label: "Infant", powerPct: 25, color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d", description: "Newborn potential. Has energy but lacks maturity to execute complex tasks." },
  { name: "Kumara", label: "Adolescent", powerPct: 50, color: "#3b82f6", bg: "#eff6ff", border: "#93c5fd", description: "Learning and growing. Capable but still requires guidance." },
  { name: "Yuva", label: "Youth / Prime", powerPct: 100, color: "#22c55e", bg: "#f0fdf4", border: "#86efac", description: "Maximum energy, ambition, and capability. The absolute sweet spot." },
  { name: "Vriddha", label: "Old", powerPct: 10, color: "#6b7280", bg: "#f9fafb", border: "#d1d5db", description: "Wisdom remains but physical energy to push forward is minimal." },
  { name: "Mrita", label: "Dead", powerPct: 0, color: "#991b1b", bg: "#fef2f2", border: "#fca5a5", description: "Energy entirely depleted for material gains. Excellent for spiritual release." },
];

const EVEN_AVASTHAS: AvasthaData[] = [
  { name: "Mrita", label: "Dead", powerPct: 0, color: "#991b1b", bg: "#fef2f2", border: "#fca5a5", description: "Energy entirely depleted for material gains. Excellent for spiritual release." },
  { name: "Vriddha", label: "Old", powerPct: 10, color: "#6b7280", bg: "#f9fafb", border: "#d1d5db", description: "Wisdom remains but physical energy to push forward is minimal." },
  { name: "Yuva", label: "Youth / Prime", powerPct: 100, color: "#22c55e", bg: "#f0fdf4", border: "#86efac", description: "Maximum energy, ambition, and capability. The absolute sweet spot." },
  { name: "Kumara", label: "Adolescent", powerPct: 50, color: "#3b82f6", bg: "#eff6ff", border: "#93c5fd", description: "Learning and growing. Capable but still requires guidance." },
  { name: "Bala", label: "Infant", powerPct: 25, color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d", description: "Newborn potential. Has energy but lacks maturity to execute complex tasks." },
];

const PRESETS = [
  { label: "Sun in Aries at 29°", planetId: "sun", signName: "Aries", degree: 29, note: "The classic from Module 3.2: Exalted but Dead." },
  { label: "Moon in Taurus at 15°", planetId: "moon", signName: "Taurus", degree: 15, note: "Exalted + Yuva in Even sign = Maximum output!" },
  { label: "Saturn in Libra at 5°", planetId: "saturn", signName: "Libra", degree: 5, note: "Exalted but Bala (Infant) = brilliant but inexperienced." },
  { label: "Jupiter in Cancer at 20°", planetId: "jupiter", signName: "Cancer", degree: 20, note: "Exalted + Vriddha (Old) in Even = wisdom without push." },
];

// ─── Helpers ──────────────────────────────────────────────────
function getAvastha(degree: number, parity: "odd" | "even"): AvasthaData {
  const clamped = Math.min(Math.max(degree, 0), 29.999);
  const idx = Math.min(Math.floor(clamped / 6), 4);
  return parity === "odd" ? ODD_AVASTHAS[idx] : EVEN_AVASTHAS[idx];
}

function getDignity(planet: PlanetData, signName: string): DignityResult {
  if (planet.exaltation === signName) {
    return { type: "exaltation", label: "Exaltation (Uccha)", powerPct: 100, color: "#22c55e", description: `Peak 100% operational efficiency. ${planet.name} is at its absolute best in ${signName}.` };
  }
  if (planet.moolatrikona === signName) {
    return { type: "moolatrikona", label: "Moolatrikona", powerPct: 80, color: "#3b82f6", description: `The ${planet.name}'s primary office. It does its best work here.` };
  }
  if (planet.ownSigns.includes(signName)) {
    return { type: "own", label: "Own Sign (Sva)", powerPct: 60, color: "#6366f1", description: `${planet.name} rests comfortably in its own territory.` };
  }
  if (planet.friendlySigns.includes(signName)) {
    return { type: "friendly", label: "Friendly Sign", powerPct: 40, color: "#8b5cf6", description: `${planet.name} receives support and cooperation in ${signName}.` };
  }
  if (planet.enemySigns.includes(signName)) {
    return { type: "enemy", label: "Enemy Sign", powerPct: 15, color: "#f97316", description: `${planet.name} faces resistance and friction in ${signName}.` };
  }
  if (planet.debilitation === signName) {
    return { type: "debilitation", label: "Debilitation (Neecha)", powerPct: 0, color: "#ef4444", description: `Lowest operational efficiency. ${planet.name} struggles to function properly.` };
  }
  return { type: "neutral", label: "Neutral Sign", powerPct: 30, color: "#6b7280", description: `${planet.name} operates at average capacity in ${signName}.` };
}

function formatDegree(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}° ${m.toString().padStart(2, "0")}'`;
}

// ─── Component ────────────────────────────────────────────────
export default function AvasthaSynthesisExplorer() {
  const [planetId, setPlanetId] = useState("sun");
  const [signName, setSignName] = useState("Aries");
  const [degree, setDegree] = useState(29);

  const planet = useMemo(() => PLANETS.find((p) => p.id === planetId)!, [planetId]);
  const sign = useMemo(() => SIGNS.find((s) => s.name === signName)!, [signName]);
  const avastha = useMemo(() => getAvastha(degree, sign.parity), [degree, sign.parity]);
  const dignity = useMemo(() => getDignity(planet, signName), [planet, signName]);

  const avasthaList = sign.parity === "odd" ? ODD_AVASTHAS : EVEN_AVASTHAS;

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-emerald-50/20 to-amber-50/20 rounded-2xl border border-emerald-200/60 shadow-lg p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-5">
        <h3 className="text-xl sm:text-2xl font-bold text-emerald-900">Avastha &amp; Dignity Synthesis</h3>
        <p className="text-sm text-emerald-700 mt-1">
          Dignity tells you <strong>WHAT</strong> a planet promises. Avastha tells you <strong>HOW WELL</strong> it can deliver.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-emerald-200 p-3 sm:p-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">Planet</label>
          <select
            value={planetId}
            onChange={(e) => setPlanetId(e.target.value)}
            className="text-sm font-medium rounded-lg border border-gray-200 bg-white px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {PLANETS.map((p) => (
              <option key={p.id} value={p.id}>{p.glyph} {p.name} ({p.sanskrit})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">Sign</label>
          <select
            value={signName}
            onChange={(e) => setSignName(e.target.value)}
            className="text-sm font-medium rounded-lg border border-gray-200 bg-white px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {SIGNS.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} ({s.sanskrit}) — {s.parity === "odd" ? "Odd" : "Even"} · {s.element}
              </option>
            ))}
          </select>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
            sign.parity === "odd" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-rose-50 text-rose-700 border-rose-200"
          }`}>
            {sign.parity === "odd" ? "Odd Sign" : "Even Sign"}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <label className="text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">Degree</label>
          <input
            type="range" min={0} max={29.9} step={0.1} value={degree}
            onChange={(e) => setDegree(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <span className="text-sm font-bold text-emerald-800 w-16">{formatDegree(degree)}</span>
        </div>

        <button
          onClick={() => { setPlanetId("sun"); setSignName("Aries"); setDegree(29); }}
          className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-5">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => { setPlanetId(preset.planetId); setSignName(preset.signName); setDegree(preset.degree); }}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold border bg-white hover:bg-emerald-50 border-emerald-200 text-emerald-700 transition-colors"
            title={preset.note}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main Content: Ruler + Dashboard */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left: 30° Ruler */}
        <div className="flex-1 min-w-0 w-full">
          <div className="bg-white rounded-xl border border-emerald-200 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wide">The 30° Ruler</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                sign.parity === "odd" ? "bg-violet-50 text-violet-700" : "bg-rose-50 text-rose-700"
              }`}>
                {sign.parity === "odd" ? "Odd Sign → Forward" : "Even Sign → Reversed"}
              </span>
            </div>

            {/* Ruler visualization */}
            <div className="relative">
              {/* Zone bars */}
              <div className="flex h-16 rounded-xl overflow-hidden border border-gray-200">
                {avasthaList.map((av, idx) => (
                  <div
                    key={av.name}
                    className="flex-1 flex flex-col items-center justify-center relative transition-all duration-300"
                    style={{ background: av.bg }}
                  >
                    <span className="text-xs font-extrabold" style={{ color: av.color }}>{av.name}</span>
                    <span className="text-[10px] font-medium text-gray-500">{av.label}</span>
                    <span className="text-[10px] font-bold mt-0.5" style={{ color: av.color }}>{av.powerPct}%</span>
                    {/* Active glow */}
                    {avastha.name === av.name && (
                      <motion.div
                        layoutId="avastha-glow"
                        className="absolute inset-0 border-2 rounded-xl"
                        style={{ borderColor: av.color }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Degree marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-gray-900 transition-all duration-100"
                style={{ left: `${(degree / 30) * 100}%` }}
              >
                <div className="absolute -top-2 -left-1.5 w-4 h-4 bg-gray-900 rounded-full" />
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                  {formatDegree(degree)}
                </div>
              </div>

              {/* Degree ticks */}
              <div className="flex justify-between mt-1 px-0.5">
                {[0, 6, 12, 18, 24, 30].map((d) => (
                  <span key={d} className="text-[10px] text-gray-400 font-medium">{d}°</span>
                ))}
              </div>
            </div>

            {/* Algorithm arrows for Odd/Even */}
            <div className="mt-4 flex items-center justify-center gap-3">
              {avasthaList.map((av, idx) => (
                <React.Fragment key={av.name}>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm" style={{ background: av.color }}>
                      {av.powerPct === 100 ? "★" : `${av.powerPct}`}
                    </div>
                    <span className="text-[9px] font-bold text-gray-500">{av.name}</span>
                  </div>
                  {idx < avasthaList.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Current Avastha Detail Card */}
          <motion.div
            key={avastha.name + sign.parity}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 rounded-xl border p-4"
            style={{ background: avastha.bg, borderColor: avastha.border }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-sm" style={{ background: avastha.color }}>
                {avastha.powerPct === 100 ? "★" : `${avastha.powerPct}`}
              </div>
              <div>
                <h4 className="text-sm font-bold" style={{ color: avastha.color }}>
                  {avastha.name} <span className="text-gray-400 font-medium">({avastha.label})</span>
                </h4>
                <p className="text-[10px] text-gray-500 font-medium">
                  {sign.parity === "odd" ? "Odd Sign" : "Even Sign"} · {formatDegree(Math.floor(degree / 6) * 6)}–{formatDegree(Math.min((Math.floor(degree / 6) + 1) * 6, 30))}
                </p>
              </div>
              <div className="ml-auto">
                <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center" style={{ borderColor: avastha.color + "40" }}>
                  <span className="text-sm font-extrabold" style={{ color: avastha.color }}>{avastha.powerPct}%</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">{avastha.description}</p>
            {/* Power bar */}
            <div className="mt-3 h-2 bg-white rounded-full overflow-hidden border" style={{ borderColor: avastha.border }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: avastha.color }}
                initial={{ width: 0 }}
                animate={{ width: `${avastha.powerPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Right: Synthesis Dashboard */}
        <div className="lg:w-96 shrink-0 space-y-4 w-full">
          {/* Dignity Card */}
          <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Dignity</h4>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {dignity.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-sm" style={{ background: planet.color }}>
                {planet.glyph}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{planet.name} <span className="text-gray-400 font-medium">({planet.sanskrit})</span></p>
                <p className="text-xs text-gray-500">in {signName} <span className="text-gray-400">({sign.sanskrit})</span></p>
              </div>
            </div>
            <div className="p-3 rounded-lg border" style={{ background: dignity.color + "08", borderColor: dignity.color + "30" }}>
              <div className="flex items-center gap-2 mb-1">
                {dignity.type === "exaltation" && <TrendingUp className="w-4 h-4 text-green-600" />}
                {dignity.type === "debilitation" && <TrendingDown className="w-4 h-4 text-red-500" />}
                {dignity.type !== "exaltation" && dignity.type !== "debilitation" && <Activity className="w-4 h-4" style={{ color: dignity.color }} />}
                <span className="text-xs font-bold" style={{ color: dignity.color }}>{dignity.label}</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{dignity.description}</p>
            </div>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: dignity.color }}
                initial={{ width: 0 }}
                animate={{ width: `${dignity.powerPct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1 text-right">Dignity strength: ~{dignity.powerPct}%</p>
          </div>

          {/* Synthesis Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CircleDot className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wide">Synthesis</h4>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Dignity Promise</span>
                <span className="font-bold" style={{ color: dignity.color }}>{dignity.label}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Avastha Delivery</span>
                <span className="font-bold" style={{ color: avastha.color }}>{avastha.name} ({avastha.powerPct}%)</span>
              </div>
              <div className="h-px bg-amber-200 my-2" />
              <div className="p-3 rounded-lg bg-white border border-amber-200">
                <p className="text-sm font-bold text-amber-900 leading-relaxed">
                  {dignity.type === "exaltation" && avastha.powerPct === 0 && (
                    <>Brilliant inner potential ({dignity.label}) but completely unable to manifest it materially ({avastha.label} Avastha). The "Ferrari with an empty tank."</>
                  )}
                  {dignity.type === "exaltation" && avastha.powerPct === 100 && (
                    <>Peak combination! Exalted planet in prime youth. Maximum promise AND maximum delivery capacity.</>
                  )}
                  {dignity.type === "exaltation" && avastha.powerPct > 0 && avastha.powerPct < 100 && (
                    <>Exalted planet has brilliant potential, but the {avastha.label} Avastha limits output to {avastha.powerPct}% capacity.</>
                  )}
                  {dignity.type === "debilitation" && avastha.powerPct === 100 && (
                    <>Debilitated planet in prime youth. The planet is weak by nature but has full energy to express that weakness. Struggle is active and visible.</>
                  )}
                  {dignity.type === "debilitation" && avastha.powerPct < 100 && (
                    <>Double weakness: Debilitated dignity AND {avastha.label} Avastha. Minimal visible results.</>
                  )}
                  {dignity.type !== "exaltation" && dignity.type !== "debilitation" && (
                    <>{dignity.label} gives {planet.name} a {dignity.powerPct}% baseline. The {avastha.label} Avastha modifies this to an effective {Math.round((dignity.powerPct * avastha.powerPct) / 100)}% material output.</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3.5 h-3.5 text-gray-500" />
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Key Rule</h4>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              The <strong>middle degrees (12°–18°)</strong> are ALWAYS <strong>Yuva (Youth/Prime)</strong> at 100% power,
              regardless of whether the sign is Odd or Even. This is the mathematical anchor of the system.
            </p>
          </div>
        </div>
      </div>

      {/* Senior Astrologer Note */}
      <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-bold">Senior Astrologer Note:</span>{" "}
            The #1 mistake in software engines is ignoring sign parity. If you code Bala as always 0°–6°,
            you will be wrong 50% of the time. In <strong>even signs</strong>, 0°–6° is <strong>Mrita (Dead)</strong> —
            the exact opposite of Bala. Always check the sign's parity before computing the Avastha.
          </p>
        </div>
      </div>
    </div>
  );
}
