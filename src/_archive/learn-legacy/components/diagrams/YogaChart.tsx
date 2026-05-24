"use client";

import React, { useState } from "react";
import { X, Crown, Coins, Star, RefreshCw, Gem } from "lucide-react";

interface YogaData {
  id: string;
  name: string;
  sub: string;
  sanskrit: string;
  color: string;
  gradient: string;
  icon: React.ReactNode;
  description: string;
  blueprint: string;
  examples: string[];
  houses: string[];
}

const YOGAS: YogaData[] = [
  {
    id: "raja",
    name: "Raja",
    sub: "Yoga",
    sanskrit: "राजयोग",
    color: "#7c3aed",
    gradient: "from-violet-500 to-purple-600",
    icon: <Crown className="w-7 h-7" />,
    description: "Combinations for power, status, fame, and executive authority. The king-maker yogas that elevate a person to positions of command.",
    blueprint: "Kendra lords (1, 4, 7, 10) unite with Trikona lords (1, 5, 9). When the pillars of the chart connect with the blessing houses, royalty is produced.",
    examples: ["9th lord in 10th + 10th lord in 9th", "1st lord in 5th + 5th lord in 1st", "Mutual aspect between Kendra & Trikona lords"],
    houses: ["1", "4", "5", "7", "9", "10"],
  },
  {
    id: "dhana",
    name: "Dhana",
    sub: "Yoga",
    sanskrit: "धनयोग",
    color: "#059669",
    gradient: "from-emerald-500 to-teal-600",
    icon: <Coins className="w-7 h-7" />,
    description: "Combinations for massive wealth, financial windfalls, and capital accumulation. Pure material prosperity without regard for fame.",
    blueprint: "Wealth houses (2nd and 11th) connect with fortune houses (5th and 9th). Liquid assets + luck + intellect = prosperity.",
    examples: ["2nd lord in 11th house", "11th lord in 5th or 9th", "5th lord in 2nd or 11th", "Mutual aspect between 2nd & 11th lords"],
    houses: ["2", "5", "9", "11"],
  },
  {
    id: "mahapurusha",
    name: "Pancha Mahapurusha",
    sub: "The 5 Great Personalities",
    sanskrit: "पञ्चमहापुरुषयोग",
    color: "#dc2626",
    gradient: "from-rose-500 to-red-600",
    icon: <Star className="w-7 h-7" />,
    description: "Each is formed when a specific physical planet sits in a Kendra in its Own Sign or Exaltation. Creates a 'Great Person' characterized by that planet.",
    blueprint: "Mars, Mercury, Jupiter, Venus, or Saturn in Kendra (1, 4, 7, 10) AND in Own Sign or Exaltation.",
    examples: ["Ruchaka (Mars) — Supreme commander", "Bhadra (Mercury) — Scholar & orator", "Hamsa (Jupiter) — Spiritual teacher", "Malavya (Venus) — Statesman", "Shasha (Saturn) — Ruler"],
    houses: ["1", "4", "7", "10"],
  },
  {
    id: "viparita",
    name: "Viparita Raja",
    sub: "Yoga from Adversity",
    sanskrit: "विपरीत राजयोग",
    color: "#0891b2",
    gradient: "from-cyan-500 to-sky-600",
    icon: <RefreshCw className="w-7 h-7" />,
    description: "Raja Yoga arising from adversity. Dusthana lords (6, 8, 12) combine to produce unexpected success through struggle.",
    blueprint: "Two or more Dusthana lords (6, 8, 12) conjoin or mutually aspect. The suffering transforms into authority.",
    examples: ["6th + 8th lord conjunction", "8th + 12th lord mutual aspect", "All three Dusthana lords in one house"],
    houses: ["6", "8", "12"],
  },
  {
    id: "kesari",
    name: "Gaja-Kesari",
    sub: "Wisdom + Mind",
    sanskrit: "गजकेसरियोग",
    color: "#d97706",
    gradient: "from-amber-500 to-orange-600",
    icon: <Gem className="w-7 h-7" />,
    description: "Jupiter and Moon in mutual Kendra (1, 4, 7, 10) from each other. Wisdom + Mind = greatness and good fortune.",
    blueprint: "Jupiter and Moon placed in Kendra from each other (4th, 7th, or 10th apart). Not conjunction — angular relationship.",
    examples: ["Moon in 1st, Jupiter in 4th/7th/10th", "Jupiter in 1st, Moon in 4th/7th/10th", "Both in mutual Kendra from Lagna"],
    houses: ["1", "4", "7", "10"],
  },
];

const HOUSE_POSITIONS: Record<string, { x: number; y: number }> = {
  "1": { x: 50, y: 15 }, "2": { x: 80, y: 30 }, "3": { x: 90, y: 55 },
  "4": { x: 80, y: 80 }, "5": { x: 50, y: 90 }, "6": { x: 20, y: 80 },
  "7": { x: 10, y: 55 }, "8": { x: 20, y: 30 }, "9": { x: 65, y: 22 },
  "10": { x: 85, y: 50 }, "11": { x: 65, y: 78 }, "12": { x: 35, y: 22 },
};

export default function YogaChart({ size = 640 }: { size?: number }) {
  const [selected, setSelected] = useState<YogaData | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-[720px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20 border border-violet-200/40 shadow-2xl shadow-violet-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-700 tracking-tight">
            Core Yogas — Planetary Combinations
          </h2>
          <p className="text-sm text-violet-400 mt-2 font-medium">
            A Yoga is a mathematical alignment of planets that produces a predictable life result
          </p>
        </div>

        {/* House map background */}
        <div className="relative w-full aspect-square max-w-[400px] mx-auto mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* House circle */}
            <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="28" fill="#f8fafc" stroke="#ddd6fe" strokeWidth="0.5" />

            {/* House dots */}
            {Array.from({ length: 12 }, (_, i) => {
              const h = String(i + 1);
              const pos = HOUSE_POSITIONS[h];
              return (
                <g key={h}>
                  <circle cx={pos.x} cy={pos.y} r="3" fill="#fff" stroke="#c4b5fd" strokeWidth="0.8" />
                  <text x={pos.x} y={pos.y + 0.5} textAnchor="middle" dominantBaseline="central" fontSize="3" fontWeight="700" fill="#8b5cf6">{h}</text>
                </g>
              );
            })}

            {/* Connection lines for selected yoga */}
            {selected && selected.houses.map((h, i) => {
              const pos = HOUSE_POSITIONS[h];
              const nextPos = HOUSE_POSITIONS[selected.houses[(i + 1) % selected.houses.length]];
              return (
                <line
                  key={`${h}-${i}`}
                  x1={pos.x} y1={pos.y} x2={nextPos.x} y2={nextPos.y}
                  stroke={selected.color} strokeWidth="1.2" opacity="0.3" strokeDasharray="2 1"
                />
              );
            })}

            {/* Active house glows */}
            {selected && selected.houses.map((h) => {
              const pos = HOUSE_POSITIONS[h];
              return (
                <circle key={h} cx={pos.x} cy={pos.y} r="5" fill={selected.color} opacity="0.2" />
              );
            })}

            {/* Center text */}
            <text x="50" y="49" textAnchor="middle" dominantBaseline="central" fontSize="4.5" fontWeight="800" fill="#7c3aed">Yuj</text>
            <text x="50" y="54" textAnchor="middle" dominantBaseline="central" fontSize="2.8" fill="#a78bfa">"To Join"</text>
          </svg>
        </div>

        {/* Yoga cards */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {YOGAS.map((yoga, i) => {
            const isActive = selected?.id === yoga.id;
            const isHover = hovered === yoga.id;
            return (
              <button
                key={yoga.id}
                onClick={() => setSelected(isActive ? null : yoga)}
                onMouseEnter={() => setHovered(yoga.id)}
                onMouseLeave={() => setHovered(null)}
                className={`relative group rounded-2xl p-3 sm:p-4 text-left transition-all duration-300 border-2 ${
                  isActive ? "scale-105 -translate-y-1 shadow-xl" : "hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg"
                }`}
                style={{
                  background: isActive ? yoga.color + "10" : "#fff",
                  borderColor: isActive || isHover ? yoga.color : "#e2e8f0",
                }}
              >
                {/* Top gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${yoga.gradient}`} />

                {/* Number */}
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                  style={{ background: yoga.color }}>
                  {i + 1}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2 sm:mb-3"
                  style={{ background: yoga.color + "15", color: yoga.color }}>
                  {yoga.icon}
                </div>

                {/* Name */}
                <h3 className="text-sm sm:text-base font-extrabold leading-tight" style={{ color: yoga.color }}>
                  {yoga.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5">{yoga.sub}</p>

                {/* Houses pills */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {yoga.houses.slice(0, 3).map((h) => (
                    <span key={h} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: yoga.color + "15", color: yoga.color }}>
                      H{h}
                    </span>
                  ))}
                  {yoga.houses.length > 3 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md text-gray-400">+{yoga.houses.length - 3}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail popup */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl border shadow-2xl p-6 w-full max-w-[460px] animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto"
            style={{ borderColor: selected.color + "40" }}>
            <button onClick={() => setSelected(null)} className="absolute right-4 top-4 p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${selected.color}, ${selected.color}dd)` }}>
                {selected.icon}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">{selected.name} <span className="text-gray-400 font-semibold">{selected.sub}</span></h3>
                <p className="text-sm font-medium" style={{ color: selected.color }}>{selected.sanskrit}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-5">{selected.description}</p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl" style={{ background: selected.color + "08", border: `1px solid ${selected.color}20` }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Blueprint</span>
                <p className="text-sm font-bold mt-1.5 leading-relaxed" style={{ color: selected.color }}>{selected.blueprint}</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Formation Examples</span>
                <ul className="mt-2.5 space-y-2">
                  {selected.examples.map((ex, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-white"
                        style={{ background: selected.color }}>{idx + 1}</span>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                {selected.houses.map((h) => (
                  <span key={h} className="text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ background: selected.color }}>
                    House {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
