"use client";

import React, { useState } from "react";
import { Gem, Flame, HandHeart, Music, Droplets, ArrowRight } from "lucide-react";

interface Remedy {
  name: string;
  sanskrit: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  description: string;
  examples: string[];
}

const REMEDIES: Remedy[] = [
  {
    name: "Mantra",
    sanskrit: "Japa",
    icon: <Music className="w-5 h-5" />,
    color: "#f59e0b",
    bg: "#fffbeb",
    description: "Chanting sacred seed syllables (Bija Mantras) to harmonize planetary frequencies.",
    examples: ["Om Sraam Sreem Sroum Sah Ketave Namah", "Om Hrim Shrim Lakshmiyai Namah", "Om Sham Shanicharaya Namah"],
  },
  {
    name: "Gemstone",
    sanskrit: "Ratna",
    icon: <Gem className="w-5 h-5" />,
    color: "#3b82f6",
    bg: "#eff6ff",
    description: "Wearing specific gemstones to strengthen or pacify planetary energies.",
    examples: ["Ruby (Sun)", "Pearl (Moon)", "Coral (Mars)", "Emerald (Mercury)", "Yellow Sapphire (Jupiter)", "Diamond (Venus)", "Blue Sapphire (Saturn)", "Hessonite (Rahu)", "Cat's Eye (Ketu)"],
  },
  {
    name: "Donation",
    sanskrit: "Daana",
    icon: <HandHeart className="w-5 h-5" />,
    color: "#22c55e",
    bg: "#f0fdf4",
    description: "Giving away items ruled by the afflicted planet to neutralize negative karma.",
    examples: ["Sun: Wheat, red cloth, copper", "Moon: Rice, white cloth, silver", "Mars: Lentils, red cloth, copper", "Saturn: Black sesame, iron, blankets"],
  },
  {
    name: "Yagya / Homa",
    sanskrit: "Agni Ritual",
    icon: <Flame className="w-5 h-5" />,
    color: "#ef4444",
    bg: "#fef2f2",
    description: "Fire rituals where offerings are made to invoke planetary deities.",
    examples: ["Navagraha Homa (all planets)", "Maha Mrityunjaya (health)", "Baglamukhi (protection)", "Gayatri (wisdom)"],
  },
  {
    name: "Water Rituals",
    sanskrit: "Tirtha / Abhisheka",
    icon: <Droplets className="w-5 h-5" />,
    color: "#06b6d4",
    bg: "#ecfeff",
    description: "Sacred baths, river offerings, and water-based purification ceremonies.",
    examples: ["Ganga Snan (bathing in Ganges)", "Kalasha Abhisheka (sacred pot ritual)", "Tarpana (offering water to ancestors)"],
  },
];

export default function Remediation({ size = 640 }: { size?: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedExample, setSelectedExample] = useState<number>(0);

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50/30 to-teal-50/10 border border-emerald-200/40 shadow-2xl shadow-emerald-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
            Astro-Remediation
          </h2>
          <p className="text-sm text-emerald-400 mt-2 font-medium">
            5 Pillars of Remedial Measures — diagnose the affliction, prescribe the cure
          </p>
        </div>

        {/* Diagnostic flow */}
        <div className="flex items-center justify-center gap-1 mb-5 flex-wrap">
          {["Identify Affliction", "Find Karaka", "Select Remedy", "Execute", "Monitor"].map((step, i) => (
            <React.Fragment key={i}>
              <div className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-bold">{step}</div>
              {i < 4 && <ArrowRight className="w-3 h-3 text-emerald-300" />}
            </React.Fragment>
          ))}
        </div>

        {/* Remedy cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {REMEDIES.map((r, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => { setSelected(isSelected ? null : i); setSelectedExample(0); }}
                className={`p-3 rounded-2xl border text-center transition-all duration-200 ${isSelected ? "shadow-md" : "hover:shadow-sm"}`}
                style={{
                  background: isSelected ? r.bg : "#fff",
                  borderColor: isSelected ? r.color : "#e2e8f0",
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mx-auto mb-2" style={{ background: r.color }}>
                  {r.icon}
                </div>
                <div className="text-sm font-extrabold text-gray-900">{r.name}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: r.color }}>{r.sanskrit}</div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        {selected !== null && (() => {
          const r = REMEDIES[selected];
          return (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: r.color }}>{r.icon}</div>
                <div>
                  <div className="text-sm font-extrabold text-gray-900">{r.name}</div>
                  <div className="text-[10px] font-bold" style={{ color: r.color }}>{r.sanskrit}</div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3">{r.description}</p>
              <div className="text-xs font-bold text-emerald-700 mb-1">Examples:</div>
              <div className="flex flex-wrap gap-1.5">
                {r.examples.map((ex, j) => (
                  <button
                    key={j}
                    onClick={() => setSelectedExample(j)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${selectedExample === j ? "shadow-sm" : ""}`}
                    style={{
                      background: selectedExample === j ? `${r.color}15` : "#fff",
                      borderColor: selectedExample === j ? r.color : "#e2e8f0",
                      color: selectedExample === j ? r.color : "#64748b",
                    }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {!selected && (
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-sm text-gray-500">Tap any remedy pillar above to explore examples and details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
