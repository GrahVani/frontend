"use client";

import React, { useState } from "react";
import { Type, Music, Sparkles } from "lucide-react";

const NAKSHATRAS = [
  { name: "Ashwini", sounds: ["Chu", "Che", "Cho", "La"], lord: "Ke", color: "#64748b" },
  { name: "Bharani", sounds: ["Li", "Lu", "Le", "Lo"], lord: "Ve", color: "#a855f7" },
  { name: "Krittika", sounds: ["A", "I", "U", "E"], lord: "Su", color: "#f59e0b" },
  { name: "Rohini", sounds: ["O", "Va", "Vi", "Vu"], lord: "Mo", color: "#94a3b8" },
  { name: "Mrigashira", sounds: ["Ve", "Vo", "Ka", "Ki"], lord: "Ma", color: "#ef4444" },
  { name: "Ardra", sounds: ["Ku", "Gha", "Na", "Cha"], lord: "Ra", color: "#1e293b" },
  { name: "Punarvasu", sounds: ["Ke", "Ko", "Ha", "Hi"], lord: "Ju", color: "#f97316" },
  { name: "Pushya", sounds: ["Hu", "He", "Ho", "Da"], lord: "Sa", color: "#475569" },
  { name: "Ashlesha", sounds: ["Di", "Du", "De", "Do"], lord: "Me", color: "#22c55e" },
  { name: "Magha", sounds: ["Ma", "Mi", "Mu", "Me"], lord: "Ke", color: "#64748b" },
  { name: "Purva Phalguni", sounds: ["Mo", "Ta", "Ti", "Tu"], lord: "Ve", color: "#a855f7" },
  { name: "Uttara Phalguni", sounds: ["Te", "To", "Pa", "Pi"], lord: "Su", color: "#f59e0b" },
  { name: "Hasta", sounds: ["Pu", "Sha", "Na", "Tha"], lord: "Mo", color: "#94a3b8" },
  { name: "Chitra", sounds: ["Pe", "Po", "Ra", "Ri"], lord: "Ma", color: "#ef4444" },
  { name: "Swati", sounds: ["Ru", "Re", "Ro", "Ta"], lord: "Ra", color: "#1e293b" },
  { name: "Vishakha", sounds: ["Ti", "Tu", "Te", "To"], lord: "Ju", color: "#f97316" },
  { name: "Anuradha", sounds: ["Na", "Ni", "Nu", "Ne"], lord: "Sa", color: "#475569" },
  { name: "Jyeshtha", sounds: ["No", "Ya", "Yi", "Yu"], lord: "Me", color: "#22c55e" },
  { name: "Mula", sounds: ["Ye", "Yo", "Bha", "Bhi"], lord: "Ke", color: "#64748b" },
  { name: "Purva Ashadha", sounds: ["Bhu", "Dha", "Bha", "Da"], lord: "Ve", color: "#a855f7" },
  { name: "Uttara Ashadha", sounds: ["Bhe", "Bho", "Ja", "Ji"], lord: "Su", color: "#f59e0b" },
  { name: "Shravana", sounds: ["Ju", "Je", "Jo", "Gha"], lord: "Mo", color: "#94a3b8" },
  { name: "Dhanishta", sounds: ["Ga", "Gi", "Gu", "Ge"], lord: "Ma", color: "#ef4444" },
  { name: "Shatabhisha", sounds: ["Go", "Sa", "Si", "Su"], lord: "Ra", color: "#1e293b" },
  { name: "Purva Bhadrapada", sounds: ["Se", "So", "Da", "Di"], lord: "Ju", color: "#f97316" },
  { name: "Uttara Bhadrapada", sounds: ["Du", "Tha", "Jha", "Da"], lord: "Sa", color: "#475569" },
  { name: "Revati", sounds: ["De", "Do", "Cha", "Chi"], lord: "Me", color: "#22c55e" },
];

export default function NamaNakshatra({ size = 640 }: { size?: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search
    ? NAKSHATRAS.filter((n, i) =>
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.sounds.some((s) => s.toLowerCase().includes(search.toLowerCase()))
      )
    : NAKSHATRAS;

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-violet-50 via-purple-50/30 to-indigo-50/10 border border-violet-200/40 shadow-2xl shadow-violet-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-700">
            Nama Nakshatra
          </h2>
          <p className="text-sm text-violet-400 mt-2 font-medium">
            27 Nakshatras × 4 Sounds = 108 starting syllables for naming
          </p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
            <input
              type="text"
              placeholder="Search nakshatra or sound..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-violet-200 text-sm font-bold text-gray-700 bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>

        {/* Nakshatra grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 max-h-[400px] overflow-y-auto pr-1">
          {filtered.map((n, i) => {
            const originalIdx = NAKSHATRAS.indexOf(n);
            const isSelected = selected === originalIdx;
            return (
              <button
                key={originalIdx}
                onClick={() => setSelected(isSelected ? null : originalIdx)}
                className={`p-2 rounded-xl border text-center transition-all ${isSelected ? "shadow-sm" : "hover:shadow-sm"}`}
                style={{
                  background: isSelected ? `${n.color}15` : "#fff",
                  borderColor: isSelected ? n.color : "#e2e8f0",
                }}
              >
                <div className="text-[10px] font-bold" style={{ color: n.color }}>{n.lord}</div>
                <div className="text-[11px] font-extrabold text-gray-800 truncate">{n.name}</div>
                <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                  {n.sounds.map((s, j) => (
                    <span key={j} className="text-[9px] px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-bold">{s}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected detail */}
        {selected !== null && (() => {
          const n = NAKSHATRAS[selected];
          return (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
              <div className="flex items-center gap-3 mb-2">
                <Music className="w-5 h-5 text-violet-500" />
                <span className="text-sm font-bold text-violet-700">{n.name} (Lord: {n.lord})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {n.sounds.map((s, j) => (
                  <span key={j} className="px-3 py-1.5 rounded-xl bg-white border border-violet-200 text-sm font-extrabold text-violet-700">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Names starting with these syllables are harmonically aligned with <strong>{n.name}</strong> nakshatra,
                ruled by <strong>{n.lord}</strong>. Each pada (quarter) has one sound.
              </p>
            </div>
          );
        })()}

        {!selected && (
          <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <Sparkles className="w-4 h-4 text-violet-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Search or tap any nakshatra to see its 4 starting sounds.</p>
          </div>
        )}
      </div>
    </div>
  );
}
