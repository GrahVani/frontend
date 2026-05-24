"use client";

import React, { useState } from "react";
import { Target, Layers } from "lucide-react";

const SIGNS = ["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];
const SIGN_COLORS = ["#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7", "#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7"];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const NAKSHATRA_LORDS = [
  "Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me",
  "Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me",
  "Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me",
];

function getSubLord(nakshatraIndex: number, quarter: number) {
  // Simplified KP sub-lord logic: each nakshatra (13°20') divided into 9 unequal parts
  // based on Vimshottari dasha sequence of the nakshatra lord
  const vimshottari = ["Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me"];
  const lordIdx = vimshottari.indexOf(NAKSHATRA_LORDS[nakshatraIndex]);
  // Sub-lord cycles through vimshottari starting from nakshatra lord
  const subIdx = (lordIdx + quarter) % 9;
  return vimshottari[subIdx];
}

export default function KPSystem({ size = 640 }: { size?: number }) {
  const [selectedNakshatra, setSelectedNakshatra] = useState<number | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-cyan-50 via-teal-50/30 to-emerald-50/10 border border-cyan-200/40 shadow-2xl shadow-cyan-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-700">
            KP System
          </h2>
          <p className="text-sm text-cyan-500 mt-2 font-medium">
            Krishnamurti Paddhati — Planet → Sign Lord → Nakshatra Lord → Sub Lord
          </p>
        </div>

        {/* Hierarchy diagram */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {[
            { label: "Planet", color: "#06b6d4", icon: <Target className="w-4 h-4" /> },
            { label: "→", color: "#cbd5e1", icon: null },
            { label: "Sign Lord", color: "#0891b2", icon: <Layers className="w-4 h-4" /> },
            { label: "→", color: "#cbd5e1", icon: null },
            { label: "Nakshatra Lord", color: "#0e7490", icon: <Layers className="w-4 h-4" /> },
            { label: "→", color: "#cbd5e1", icon: null },
            { label: "Sub Lord", color: "#155e75", icon: <Target className="w-4 h-4" /> },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${item.icon ? "border" : ""}`}
              style={item.icon ? { background: `${item.color}15`, borderColor: `${item.color}40`, color: item.color } : { color: item.color }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>

        {/* Nakshatra selector grid */}
        <div className="grid grid-cols-9 gap-1 mb-4">
          {NAKSHATRAS.map((nak, i) => {
            const isSelected = selectedNakshatra === i;
            const lord = NAKSHATRA_LORDS[i];
            const signIdx = Math.floor(i * 30 / 13.33) % 12; // Approximate sign
            return (
              <button
                key={i}
                onClick={() => { setSelectedNakshatra(isSelected ? null : i); setSelectedQuarter(null); }}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-[9px] font-bold transition-all border ${isSelected ? "shadow-sm" : ""}`}
                style={{
                  background: isSelected ? `${SIGN_COLORS[signIdx]}20` : "#f8fafc",
                  borderColor: isSelected ? SIGN_COLORS[signIdx] : "#e2e8f0",
                  color: isSelected ? SIGN_COLORS[signIdx] : "#64748b",
                }}
                title={nak}
              >
                <span className="text-[8px] opacity-60">{lord}</span>
                <span>{i + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Quarter breakdown for selected nakshatra */}
        {selectedNakshatra !== null && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-100">
            <div className="text-sm font-bold text-cyan-700 mb-3">
              {NAKSHATRAS[selectedNakshatra]} (Nakshatra Lord: {NAKSHATRA_LORDS[selectedNakshatra]})
            </div>
            <div className="grid grid-cols-9 gap-1">
              {[0, 1, 2, 3].map(q => {
                const subLord = getSubLord(selectedNakshatra, q);
                const isQ = selectedQuarter === q;
                return (
                  <button
                    key={q}
                    onClick={() => setSelectedQuarter(isQ ? null : q)}
                    className={`p-2 rounded-xl text-center border transition-all ${isQ ? "shadow-sm" : ""}`}
                    style={{
                      background: isQ ? "#fff" : "#f8fafc",
                      borderColor: isQ ? "#06b6d4" : "#e2e8f0",
                    }}
                  >
                    <div className="text-[10px] text-gray-400">Pad {q + 1}</div>
                    <div className="text-sm font-extrabold text-cyan-700">{subLord}</div>
                    <div className="text-[9px] text-gray-400">Sub-Lord</div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Each Nakshatra (13°20') is divided into 4 Padas (quarters). Each Pada is further divided into 9 unequal Sub-Lords based on Vimshottari Dasha proportions.
            </p>
          </div>
        )}

        {!selectedNakshatra && (
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-sm text-gray-500">Tap any Nakshatra above to see its 4 Padas and Sub-Lords.</p>
          </div>
        )}
      </div>
    </div>
  );
}
