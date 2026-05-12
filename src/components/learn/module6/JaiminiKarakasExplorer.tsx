"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Eye, Sparkles, ArrowRight, Info, Star, Crown, Heart,
  Briefcase, Baby, ShieldAlert, Frown, CheckCircle2
} from "lucide-react";

interface Karaka {
  role: string;
  sanskrit: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  lightColor: string;
}

const KARAKAS: Karaka[] = [
  { role: "Atmakaraka", sanskrit: "Soul Planet", description: "The planet with the highest degree. Represents the core soul purpose and ultimate destiny.", icon: <Crown className="w-4 h-4" />, color: "#f59e0b", lightColor: "#fef3c7" },
  { role: "Amatyakaraka", sanskrit: "Career Planet", description: "2nd highest degree. Governs professional path, advisors, and government connections.", icon: <Briefcase className="w-4 h-4" />, color: "#3b82f6", lightColor: "#dbeafe" },
  { role: "Bhratrukaraka", sanskrit: "Siblings/Guru", description: "3rd highest degree. Rules siblings, courage, and spiritual teachers.", icon: <Users className="w-4 h-4" />, color: "#22c55e", lightColor: "#dcfce7" },
  { role: "Matrukaraka", sanskrit: "Mother", description: "4th highest degree. Represents mother, vehicles, and emotional nourishment.", icon: <Heart className="w-4 h-4" />, color: "#ec4899", lightColor: "#fce7f3" },
  { role: "Putrakaraka", sanskrit: "Children", description: "5th highest degree. Governs children, creativity, education, and past merit.", icon: <Baby className="w-4 h-4" />, color: "#a855f7", lightColor: "#f3e8ff" },
  { role: "Gnatikaraka", sanskrit: "Obstacles", description: "6th highest degree. Represents enemies, diseases, disputes, and competition.", icon: <ShieldAlert className="w-4 h-4" />, color: "#ef4444", lightColor: "#fee2e2" },
  { role: "Darakaraka", sanskrit: "Spouse", description: "Lowest degree. Overrides Venus to determine the exact nature of the marriage partner.", icon: <Star className="w-4 h-4" />, color: "#8b5cf6", lightColor: "#ede9fe" },
];

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
const PLANET_COLORS = ["#f59e0b", "#94a3b8", "#ef4444", "#22c55e", "#f97316", "#a855f7", "#475569"];

// Sample degree data for demo (descending sort)
const SAMPLE_DEGREES = [28.5, 24.3, 19.7, 15.2, 8.9, 3.4, 1.1]; // Saturn lowest = Darakaraka

// Rashi Drishti: modality-based aspects
const MODALITIES = [
  { signs: [0, 3, 6, 9], name: "Movable", color: "#ef4444", aspects: [4, 7, 10] }, // Aries aspects Leo, Scorpio, Aquarius (fixed signs except adjacent)
  { signs: [1, 4, 7, 10], name: "Fixed", color: "#3b82f6", aspects: [3, 6, 9] }, // Taurus aspects Cancer, Libra, Capricorn (movable except adjacent)
  { signs: [2, 5, 8, 11], name: "Dual", color: "#22c55e", aspects: [5, 8, 11] }, // Gemini aspects Virgo, Sagittarius, Pisces (other dual signs)
];

const SIGN_NAMES = ["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

export default function JaiminiKarakasExplorer() {
  const [selectedKaraka, setSelectedKaraka] = useState(0);
  const [selectedSign, setSelectedSign] = useState(0);
  const [showDrishti, setShowDrishti] = useState(true);

  // Sort planets by degree to assign karakas
  const sortedPlanets = PLANETS.map((p, i) => ({ planet: p, degree: SAMPLE_DEGREES[i], color: PLANET_COLORS[i] }))
    .sort((a, b) => b.degree - a.degree);

  const currentKaraka = KARAKAS[selectedKaraka];
  const assignedPlanet = sortedPlanets[selectedKaraka];

  // Find modality of selected sign
  const signModality = MODALITIES.find(m => m.signs.includes(selectedSign));
  const aspectedSigns = signModality ? signModality.signs.map(s => (s + 4) % 12).filter(s => s !== selectedSign) : [];

  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <div className="w-full select-none">
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-violet-700">
            Jaimini Chara Karakas
          </h2>
          <p className="text-base text-indigo-700 mt-2 font-semibold">
            Sign-centric engine — variable significators based on exact planetary degrees.
          </p>
        </div>

        {/* Degree sorting demo */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-indigo-800 uppercase tracking-wider">Degree-Based Sorting</span>
          </div>
          <div className="space-y-1.5">
            {sortedPlanets.map((sp, i) => {
              const karaka = KARAKAS[i];
              return (
                <button
                  key={sp.planet}
                  onClick={() => setSelectedKaraka(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${selectedKaraka === i ? "shadow-sm" : "hover:shadow-sm"}`}
                  style={{
                    background: selectedKaraka === i ? karaka.lightColor : "#fff",
                    borderColor: selectedKaraka === i ? karaka.color : "#f1f5f9",
                  }}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`} style={{ background: sp.color }}>
                    {i + 1}
                  </div>
                  <div className="w-20 text-sm font-bold text-gray-800 text-left">{sp.planet}</div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(sp.degree / 30) * 100}%`, background: sp.color }} />
                  </div>
                  <div className="text-xs font-extrabold text-gray-600 w-12 text-right">{sp.degree.toFixed(1)}°</div>
                  <div className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: karaka.lightColor, color: karaka.color }}>
                    {karaka.role}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Karaka detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedKaraka}
            {...fadeUp}
            className="mb-5 p-4 rounded-2xl border shadow-sm"
            style={{ background: currentKaraka.lightColor, borderColor: `${currentKaraka.color}30` }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shrink-0" style={{ background: currentKaraka.color }}>
                {currentKaraka.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-extrabold text-gray-900">{currentKaraka.role}</span>
                  <span className="text-xs font-bold text-gray-600">({currentKaraka.sanskrit})</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">{currentKaraka.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">Assigned to:</span>
                  <span className="text-sm font-extrabold px-2 py-0.5 rounded-full bg-white border border-gray-300" style={{ color: assignedPlanet.color }}>
                    {assignedPlanet.planet} ({assignedPlanet.degree.toFixed(1)}°)
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Rashi Drishti wheel */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-800 uppercase tracking-wider">Rashi Drishti (Sign Aspects)</span>
            </div>
            <button
              onClick={() => setShowDrishti(!showDrishti)}
              className="text-xs font-bold px-2 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-300 hover:bg-indigo-100 transition-colors"
            >
              {showDrishti ? "Hide" : "Show"} Wheel
            </button>
          </div>

          <AnimatePresence>
            {showDrishti && (
              <motion.div {...fadeUp}>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {SIGN_NAMES.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSign(i)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-all border ${selectedSign === i ? "shadow-sm" : ""}`}
                      style={{
                        background: selectedSign === i ? `${signModality?.color}15` : "#fff",
                        borderColor: selectedSign === i ? signModality?.color : "#e2e8f0",
                        color: selectedSign === i ? signModality?.color : "#64748b",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Modality legend */}
                <div className="flex items-center gap-3 mb-3">
                  {MODALITIES.map(m => (
                    <span key={m.name} className="flex items-center gap-1 text-xs font-bold" style={{ color: m.color }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                      {m.name}
                    </span>
                  ))}
                </div>

                {/* Selected sign info */}
                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                  <div className="text-sm font-bold text-indigo-800 mb-1">
                    {SIGN_NAMES[selectedSign]} is a <span style={{ color: signModality?.color }}>{signModality?.name}</span> sign
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {signModality?.name === "Movable" && "Movable signs aspect ALL Fixed Signs (except the one directly adjacent)."}
                    {signModality?.name === "Fixed" && "Fixed signs aspect ALL Movable Signs (except the one directly adjacent)."}
                    {signModality?.name === "Dual" && "Dual signs aspect ALL other Dual Signs."}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold text-gray-700">Aspects:</span>
                    {aspectedSigns.map(s => (
                      <span key={s} className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-gray-300 text-gray-800">
                        {SIGN_NAMES[s]}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Karakamsha */}
        <div className="mb-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-bold text-violet-800 uppercase tracking-wider">Karakamsha Architecture</span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed mb-2">
            The Atmakaraka's sign in the <strong>Navamsha (D-9)</strong> becomes the Karakamsha Lagna — 
            the soul's true center of destiny. The software must generate predictions from this sign, 
            not just the standard D-1 Ascendant.
          </p>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-violet-50 border border-violet-100">
            <ArrowRight className="w-4 h-4 text-violet-500 shrink-0" />
            <span className="text-sm text-violet-800">
              <strong>Step 1:</strong> Find Atmakaraka ({sortedPlanets[0].planet}) → 
              <strong> Step 2:</strong> Locate its D-9 sign → 
              <strong> Step 3:</strong> Treat that sign as Lagna for soul-level predictions.
            </span>
          </div>
        </div>

        {/* Senior astrologer note */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-200">
          <Info className="w-5 h-5 text-indigo-700 mt-0.5 shrink-0" />
          <p className="text-sm text-indigo-900 leading-relaxed">
            <strong>Professional Note:</strong> Jaimini is the second opinion. When Parashari predicts an event, 
            boot up Jaimini to verify. If Atmakaraka and Darakaraka are in mutual Rashi Drishti, marriage is 
            confirmed. If not, Parashari's prediction may be premature. Never rely on a single system.
          </p>
        </div>
      </div>
    </div>
  );
}
