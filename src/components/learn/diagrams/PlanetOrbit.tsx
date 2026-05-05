"use client";

import React, { useState } from "react";
import { X, Sun, Moon, Flame, Droplets, Wind, Mountain, Star, CircleDot } from "lucide-react";

interface PlanetData {
  name: string;
  sanskrit: string;
  color: string;
  bg: string;
  border: string;
  nature: "Benefic" | "Malefic" | "Neutral";
  gender: "Masculine" | "Feminine" | "Neutral";
  element: string;
  governs: string;
  day: string;
  role: string;
  description: string;
  icon: React.ReactNode;
}

const PLANETS: PlanetData[] = [
  { name: "Sun", sanskrit: "Surya", color: "#f59e0b", bg: "#fffbeb", border: "#fed7aa", nature: "Malefic", gender: "Masculine", element: "Fire", governs: "Soul, Authority, Father, Government", day: "Sunday", role: "The King", description: "The source of all life. Represents ego, vitality, and the soul's purpose.", icon: <Sun className="w-5 h-5" /> },
  { name: "Moon", sanskrit: "Chandra", color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0", nature: "Benefic", gender: "Feminine", element: "Water", governs: "Mind, Emotions, Mother, Nourishment", day: "Monday", role: "The Queen", description: "The fastest planet. Governs the mind, emotions, and public reception.", icon: <Moon className="w-5 h-5" /> },
  { name: "Mars", sanskrit: "Mangala", color: "#ef4444", bg: "#fef2f2", border: "#fecaca", nature: "Malefic", gender: "Masculine", element: "Fire", governs: "Courage, War, Siblings, Real Estate", day: "Tuesday", role: "The Commander", description: "The warrior planet. Drives action, courage, and physical strength.", icon: <Flame className="w-5 h-5" /> },
  { name: "Mercury", sanskrit: "Budha", color: "#10b981", bg: "#ecfdf5", border: "#a7f3d0", nature: "Neutral", gender: "Neutral", element: "Earth", governs: "Intellect, Communication, Commerce, Speech", day: "Wednesday", role: "The Prince", description: "The messenger. Rules intellect, communication, and adaptability.", icon: <Wind className="w-5 h-5" /> },
  { name: "Jupiter", sanskrit: "Guru", color: "#f97316", bg: "#fff7ed", border: "#fed7aa", nature: "Benefic", gender: "Masculine", element: "Ether", governs: "Wisdom, Wealth, Children, Expansion", day: "Thursday", role: "The Teacher", description: "The great benefic. Brings wisdom, growth, and divine grace.", icon: <Star className="w-5 h-5" /> },
  { name: "Venus", sanskrit: "Shukra", color: "#ec4899", bg: "#fdf2f8", border: "#fbcfe8", nature: "Benefic", gender: "Feminine", element: "Water", governs: "Love, Luxury, Arts, Diplomacy", day: "Friday", role: "The Counselor", description: "The planet of beauty. Governs relationships, art, and refinement.", icon: <Droplets className="w-5 h-5" /> },
  { name: "Saturn", sanskrit: "Shani", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", nature: "Malefic", gender: "Neutral", element: "Air", governs: "Discipline, Delay, Karma, Hard Work", day: "Saturday", role: "The Judge", description: "The taskmaster. Teaches discipline through time and effort.", icon: <Mountain className="w-5 h-5" /> },
  { name: "Rahu", sanskrit: "Rahu", color: "#64748b", bg: "#f1f5f9", border: "#cbd5e1", nature: "Malefic", gender: "Feminine", element: "Air", governs: "Desire, Obsession, Foreign, Amplification", day: "—", role: "The Rebel", description: "The north node. Creates obsession and amplifies desires.", icon: <CircleDot className="w-5 h-5" /> },
  { name: "Ketu", sanskrit: "Ketu", color: "#71717a", bg: "#f4f4f5", border: "#d4d4d8", nature: "Malefic", gender: "Neutral", element: "Fire", governs: "Liberation, Detachment, Spirituality", day: "—", role: "The Monk", description: "The south node. Brings detachment and spiritual insight.", icon: <CircleDot className="w-5 h-5" /> },
];

const NATURE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Benefic: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  Malefic: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
  Neutral: { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" },
};

export default function PlanetOrbit({ size = 520 }: { size?: number }) {
  const [selected, setSelected] = useState<PlanetData | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-[720px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-[#fdfcfa] to-[#f5f2ee] border border-amber-100/80 shadow-lg shadow-amber-900/5 p-4 sm:p-6">
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-600 tracking-tight">The Navagraha</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Nine Cosmic Governors — Seven Physical Bodies + Two Shadow Planets</p>
        </div>

        {/* Planet Card Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
          {PLANETS.map((p) => {
            const isHovered = hovered === p.name;
            const isSelected = selected?.name === p.name;
            const natStyle = NATURE_STYLES[p.nature];

            return (
              <button
                key={p.name}
                onClick={() => setSelected(p)}
                onMouseEnter={() => setHovered(p.name)}
                onMouseLeave={() => setHovered(null)}
                className={`relative rounded-2xl p-3 text-left transition-all duration-200 border-2 ${
                  isHovered || isSelected
                    ? "shadow-lg scale-[1.03] -translate-y-1"
                    : "shadow-sm hover:shadow-md"
                }`}
                style={{
                  background: p.bg,
                  borderColor: isHovered || isSelected ? p.color : p.border,
                }}
              >
                {/* Top color bar */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: p.color }} />

                {/* Planet circle */}
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm sm:text-base shadow-sm"
                  style={{ background: p.color }}
                >
                  {p.name[0]}
                </div>

                {/* Sanskrit name */}
                <p className="text-center text-xs sm:text-sm font-bold truncate" style={{ color: p.color }}>
                  {p.sanskrit}
                </p>

                {/* English name */}
                <p className="text-center text-[10px] sm:text-xs text-gray-500 truncate mt-0.5">
                  {p.name}
                </p>

                {/* Role badge */}
                <div
                  className="mt-2 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-center truncate"
                  style={{ background: `${p.color}15`, color: p.color }}
                >
                  {p.role}
                </div>

                {/* Nature badge */}
                <div
                  className="mt-1.5 text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-center truncate"
                  style={{ background: natStyle.bg, color: natStyle.text, border: `1px solid ${natStyle.border}` }}
                >
                  {p.nature}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {Object.entries(NATURE_STYLES).map(([key, style]) => (
            <div key={key} className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
              <span className="w-2 h-2 rounded-full" style={{ background: style.text }} />
              {key}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Planet Detail Popup */}
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl" onClick={() => setSelected(null)} />
          <div
            className="relative bg-white rounded-2xl border-2 shadow-2xl p-5 w-full max-w-[380px] animate-in zoom-in-95 duration-200"
            style={{ borderColor: selected.color }}
          >
            <button onClick={() => setSelected(null)} className="absolute right-3 top-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-sm" style={{ background: selected.color }}>
                {selected.name[0]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selected.name}</h3>
                <p className="text-sm font-medium" style={{ color: selected.color }}>{selected.sanskrit} · {selected.role}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4 bg-gray-50 p-3 rounded-xl">
              {selected.description}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: NATURE_STYLES[selected.nature].bg }}>
                <span className="text-xs font-semibold text-gray-500 uppercase">Nature</span>
                <span className="text-sm font-bold" style={{ color: NATURE_STYLES[selected.nature].text }}>{selected.nature}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                <span className="text-xs font-semibold text-gray-500 uppercase">Gender</span>
                <span className="text-sm font-bold text-gray-700">{selected.gender}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                <span className="text-xs font-semibold text-gray-500 uppercase">Element</span>
                <span className="text-sm font-bold text-gray-700">{selected.element}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                <span className="text-xs font-semibold text-gray-500 uppercase">Day</span>
                <span className="text-sm font-bold text-gray-700">{selected.day}</span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl" style={{ background: `${selected.color}12`, border: `1px solid ${selected.border}` }}>
              <span className="text-xs font-semibold text-gray-500 uppercase">Governs</span>
              <p className="text-sm font-bold mt-1" style={{ color: selected.color }}>{selected.governs}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      {hovered && !selected && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg pointer-events-none animate-in fade-in duration-150">
          Click {hovered} to explore
        </div>
      )}
    </div>
  );
}
