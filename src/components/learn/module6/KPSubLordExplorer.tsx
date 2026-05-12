"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Layers, GitBranch, CheckCircle2, XCircle, Info,
  ArrowRight, Star, Zap
} from "lucide-react";

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
];

const LORD_COLORS: Record<string, string> = {
  Sun: "#f59e0b", Moon: "#94a3b8", Mars: "#ef4444", Mercury: "#22c55e",
  Jupiter: "#f97316", Venus: "#a855f7", Saturn: "#475569", Rahu: "#1e293b", Ketu: "#64748b",
};

const VIMSHOTTARI = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

function getSubLord(nakshatraIndex: number, pada: number) {
  const lord = NAKSHATRA_LORDS[nakshatraIndex];
  const lordIdx = VIMSHOTTARI.indexOf(lord);
  const subIdx = (lordIdx + pada) % 9;
  return VIMSHOTTARI[subIdx];
}

const YES_NO_EXAMPLES = [
  {
    query: "Will I get the job?",
    house: "10th House Cusp",
    subLord: "Jupiter",
    starLord: "Venus",
    signifies: [2, 6, 10, 11],
    houses: "Wealth, Service, Career, Gains",
    result: true,
    explanation: "Jupiter as Sub-Lord signifies houses 2, 6, 10, 11 — all connected to career gains.",
  },
  {
    query: "Will I lose money?",
    house: "2nd House Cusp",
    subLord: "Saturn",
    starLord: "Rahu",
    signifies: [8, 12],
    houses: "Obstacles, Loss",
    result: false,
    explanation: "Saturn signifies 8 and 12 — houses of obstacles and endings. Financial loss is indicated.",
  },
  {
    query: "Will the marriage happen?",
    house: "7th House Cusp",
    subLord: "Venus",
    starLord: "Mercury",
    signifies: [2, 7, 11],
    houses: "Wealth, Marriage, Gains",
    result: true,
    explanation: "Venus signifies 2, 7, 11 — the trinity of marriage execution.",
  },
];

export default function KPSubLordExplorer() {
  const [selectedNakshatra, setSelectedNakshatra] = useState<number | null>(null);
  const [selectedPada, setSelectedPada] = useState<number | null>(null);
  const [activeExample, setActiveExample] = useState(0);

  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <div className="w-full select-none">
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-sky-700">
            KP Sub-Lord Engine
          </h2>
          <p className="text-base text-cyan-700 mt-2 font-semibold">
            3-tier hierarchy: Planet → Star Lord → Sub Lord. The Sub Lord decides Yes or No.
          </p>
        </div>

        {/* Hierarchy visualization */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-cyan-100 shadow-sm">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { label: "Planet", desc: "The Source", color: "#06b6d4", icon: <Target className="w-4 h-4" /> },
              { label: "→", color: "#cbd5e1", icon: null },
              { label: "Star Lord", desc: "The Result", color: "#0891b2", icon: <Star className="w-4 h-4" /> },
              { label: "→", color: "#cbd5e1", icon: null },
              { label: "Sub Lord", desc: "The Decider", color: "#0e7490", icon: <Zap className="w-4 h-4" /> },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold ${item.icon ? "border" : ""}`}
                style={item.icon ? { background: `${item.color}12`, borderColor: `${item.color}30`, color: item.color } : { color: item.color }}
              >
                {item.icon}
                <div>
                  <div>{item.label}</div>
                  {item.desc && <div className="text-[9px] opacity-70 font-normal">{item.desc}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nakshatra grid */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">27 Nakshatras</span>
          </div>
          <div className="grid grid-cols-9 gap-1">
            {NAKSHATRAS.map((nak, i) => {
              const isSelected = selectedNakshatra === i;
              const lord = NAKSHATRA_LORDS[i];
              return (
                <button
                  key={i}
                  onClick={() => { setSelectedNakshatra(isSelected ? null : i); setSelectedPada(null); }}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-bold transition-all border ${isSelected ? "shadow-sm" : ""}`}
                  style={{
                    background: isSelected ? `${LORD_COLORS[lord]}18` : "#f8fafc",
                    borderColor: isSelected ? LORD_COLORS[lord] : "#e2e8f0",
                    color: isSelected ? LORD_COLORS[lord] : "#334155",
                  }}
                  title={nak}
                >
                  <span className="text-xs opacity-70">{lord.slice(0, 2)}</span>
                  <span>{i + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected nakshatra detail */}
        <AnimatePresence>
          {selectedNakshatra !== null && (
            <motion.div {...fadeUp} className="mb-5 p-4 rounded-2xl bg-white border border-cyan-100 shadow-sm">
              <div className="text-sm font-bold text-cyan-700 mb-3">
                {NAKSHATRAS[selectedNakshatra]} — Nakshatra Lord: <span style={{ color: LORD_COLORS[NAKSHATRA_LORDS[selectedNakshatra]] }}>{NAKSHATRA_LORDS[selectedNakshatra]}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[0, 1, 2, 3].map(pada => {
                  const subLord = getSubLord(selectedNakshatra, pada);
                  const isP = selectedPada === pada;
                  return (
                    <button
                      key={pada}
                      onClick={() => setSelectedPada(isP ? null : pada)}
                      className={`p-2 rounded-xl text-center border transition-all ${isP ? "shadow-sm" : ""}`}
                      style={{
                        background: isP ? `${LORD_COLORS[subLord]}12` : "#f8fafc",
                        borderColor: isP ? LORD_COLORS[subLord] : "#e2e8f0",
                      }}
                    >
                      <div className="text-sm text-gray-600">Pad {pada + 1}</div>
                      <div className="text-sm font-extrabold" style={{ color: LORD_COLORS[subLord] }}>{subLord}</div>
                      <div className="text-sm text-gray-600">Sub-Lord</div>
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Each Nakshatra (13°20') divides into 4 Padas. Each Pada slices further into 9 unequal Sub-Lords 
                based on Vimshottari Dasha proportions. The Sub-Lord is the ultimate decider of event manifestation.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Yes/No Prediction Engine */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-bold text-cyan-800 uppercase tracking-wider">Yes/No Prediction Engine</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {YES_NO_EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setActiveExample(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${activeExample === i ? "bg-cyan-600 text-white border-cyan-600 shadow-sm" : "bg-white text-gray-700 border-gray-300 hover:border-cyan-400"}`}
              >
                {ex.query}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeExample}
              {...fadeUp}
              className="p-3 rounded-xl border"
              style={{
                background: YES_NO_EXAMPLES[activeExample].result ? "#f0fdf4" : "#fef2f2",
                borderColor: YES_NO_EXAMPLES[activeExample].result ? "#86efac" : "#fecaca",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm`} style={{ background: LORD_COLORS[YES_NO_EXAMPLES[activeExample].subLord] }}>
                  {YES_NO_EXAMPLES[activeExample].subLord[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800">{YES_NO_EXAMPLES[activeExample].house}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-gray-300">Star: {YES_NO_EXAMPLES[activeExample].starLord}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-gray-300">Sub: {YES_NO_EXAMPLES[activeExample].subLord}</span>
                  </div>
                </div>
                <div className="text-right">
                  {YES_NO_EXAMPLES[activeExample].result ? (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-extrabold">YES</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="w-5 h-5" />
                      <span className="text-sm font-extrabold">NO</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {YES_NO_EXAMPLES[activeExample].explanation}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs font-bold text-gray-600">Signifies:</span>
                {YES_NO_EXAMPLES[activeExample].signifies.map(h => (
                  <span key={h} className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-gray-300 text-gray-700">
                    H{h}
                  </span>
                ))}
                <span className="text-xs text-gray-600">({YES_NO_EXAMPLES[activeExample].houses})</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Ruling Planets */}
        <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-100">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-bold text-cyan-800 uppercase tracking-wider">Ruling Planets (RPs)</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            The "divine checksum." RPs are the lords of the exact moment the chart is calculated: 
            Day Lord, Ascendant Sign Lord, Moon Star Lord, Moon Sign Lord, and Ascendant Star Lord.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Day Lord", "Asc Lord", "Moon Star", "Moon Sign", "Asc Star"].map(rp => (
              <span key={rp} className="px-2 py-1 rounded-lg bg-white border border-cyan-300 text-xs font-bold text-cyan-800">
                {rp}
              </span>
            ))}
          </div>
          <p className="text-sm text-cyan-700 mt-2">
            If a planet is NOT on this committee, it cannot execute a major life event today.
          </p>
        </div>

        {/* Senior astrologer note */}
        <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-cyan-50 border border-cyan-200">
          <Info className="w-5 h-5 text-cyan-700 mt-0.5 shrink-0" />
          <p className="text-sm text-cyan-900 leading-relaxed">
            <strong>Professional Note:</strong> KP gives unambiguous Yes/No answers. Standard astrology says 
            "Jupiter is transiting your 10th house — good for career." KP says: "The 10th cusp Sub-Lord is Saturn 
            signifying 6 and 12 — NO, you will not get this job." The Sub-Lord is the final gatekeeper.
          </p>
        </div>
      </div>
    </div>
  );
}
