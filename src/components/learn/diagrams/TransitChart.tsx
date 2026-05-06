"use client";

import React, { useState } from "react";
import { X, Globe } from "lucide-react";

interface TransitPlanet {
  planet: string;
  sanskrit: string;
  color: string;
  period: string;
  description: string;
}

const TRANSIT_PLANETS: TransitPlanet[] = [
  { planet: "Saturn", sanskrit: "शनि", color: "#475569", period: "2.5 years per sign", description: "The slowest teacher. Brings discipline, restructuring, and karmic lessons to whichever house it transits." },
  { planet: "Jupiter", sanskrit: "गुरु", color: "#f97316", period: "1 year per sign", description: "The great expander. Blesses the house it transits with wisdom, growth, fortune, and protection." },
  { planet: "Rahu", sanskrit: "राहु", color: "#7c3aed", period: "1.5 years per sign", description: "The shadow planet of obsession. Creates sudden events, foreign influences, and material cravings." },
  { planet: "Ketu", sanskrit: "केतु", color: "#0891b2", period: "1.5 years per sign", description: "The shadow planet of detachment. Brings spiritual insight, endings, and liberation from the house it transits." },
  { planet: "Mars", sanskrit: "मङ्गल", color: "#ef4444", period: "45 days per sign", description: "The energizer. Activates conflict, action, courage, and property matters in the transited house." },
  { planet: "Sun", sanskrit: "सूर्य", color: "#f59e0b", period: "1 month per sign", description: "The illuminator. Highlights authority, health, and ego issues in the transited house for one month." },
  { planet: "Venus", sanskrit: "शुक्र", color: "#ec4899", period: "1 month per sign", description: "The harmonizer. Brings relationships, beauty, and pleasure to the transited house." },
  { planet: "Mercury", sanskrit: "बुध", color: "#10b981", period: "1 month per sign", description: "The messenger. Affects communication, business, and intellect in the transited house." },
  { planet: "Moon", sanskrit: "चन्द्र", color: "#94a3b8", period: "2.25 days per sign", description: "The fastest mover. Governs daily emotions, mind states, and short-term fluctuations." },
];

export default function TransitChart({ size = 680 }: { size?: number }) {
  const [selected, setSelected] = useState<TransitPlanet | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-[720px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-cyan-50/20 to-sky-50/10 border border-cyan-200/40 shadow-2xl shadow-cyan-900/5 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-700">
            Gochara — Real-Time Planetary Transits
          </h2>
          <p className="text-sm text-cyan-400 mt-2 font-medium">
            Planets continuously move through the 12 houses, activating different life areas over time.
          </p>
        </div>

        {/* Speed comparison bar */}
        <div className="mb-6 bg-white rounded-2xl border border-gray-100 p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Transit Speed (Fastest → Slowest)</div>
          <div className="flex items-end gap-1 h-24">
            {TRANSIT_PLANETS.map((p) => {
              const heights: Record<string, string> = {
                Moon: "20%", Mercury: "25%", Venus: "28%", Sun: "30%",
                Mars: "40%", Ketu: "55%", Rahu: "55%", Jupiter: "70%", Saturn: "95%",
              };
              const isActive = selected?.planet === p.planet;
              const isHover = hovered === p.planet;
              return (
                <button
                  key={p.planet}
                  onClick={() => setSelected(isActive ? null : p)}
                  onMouseEnter={() => setHovered(p.planet)}
                  onMouseLeave={() => setHovered(null)}
                  className={`flex-1 rounded-t-lg transition-all duration-300 ${isActive ? "shadow-lg" : "hover:shadow-md"}`}
                  style={{ height: heights[p.planet] || "50%", background: isActive || isHover ? p.color : `${p.color}88` }}
                >
                  <div className="w-full h-full flex items-end justify-center pb-1">
                    <span className="text-white text-[10px] font-bold">{p.planet[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 mt-1">
            <span>2 days</span><span>1 month</span><span>1.5 yrs</span><span>2.5 yrs</span>
          </div>
        </div>

        {/* Planet cards */}
        <div className="grid grid-cols-3 gap-3">
          {TRANSIT_PLANETS.map((p) => {
            const isActive = selected?.planet === p.planet;
            const isHover = hovered === p.planet;
            return (
              <button
                key={p.planet}
                onClick={() => setSelected(isActive ? null : p)}
                onMouseEnter={() => setHovered(p.planet)}
                onMouseLeave={() => setHovered(null)}
                className={`relative rounded-2xl p-4 text-left transition-all duration-300 border-2 ${isActive ? "scale-[1.03] shadow-xl -translate-y-1" : "hover:scale-[1.01] hover:shadow-md"}`}
                style={{ background: isActive ? p.color + "10" : "#fff", borderColor: isActive || isHover ? p.color : "#f1f5f9" }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: p.color }} />
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ background: p.color }}>{p.planet[0]}</div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">{p.planet}</div>
                    <div className="text-[9px] text-gray-400">{p.sanskrit}</div>
                  </div>
                </div>
                <div className="text-[10px] font-bold px-2 py-1 rounded-full inline-block" style={{ background: p.color + "12", color: p.color }}>{p.period}</div>
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl border shadow-2xl p-6 w-full max-w-[400px] animate-in zoom-in-95 duration-200" style={{ borderColor: selected.color + "40" }}>
            <button onClick={() => setSelected(null)} className="absolute right-4 top-4 p-2 rounded-xl hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ background: selected.color }}>{selected.planet[0]}</div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">{selected.planet} Transit</h3>
                <p className="text-sm font-medium" style={{ color: selected.color }}>{selected.sanskrit} · {selected.period}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{selected.description}</p>
            <div className="p-4 rounded-2xl flex items-center gap-3" style={{ background: selected.color + "08", border: `2px dashed ${selected.color}30` }}>
              <Globe className="w-5 h-5 shrink-0" style={{ color: selected.color }} />
              <span className="text-sm font-bold" style={{ color: selected.color }}>Currently transiting a new house every {selected.period.replace("per sign", "").trim()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
