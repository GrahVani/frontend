"use client";

import React, { useState } from "react";
import { X, Clock } from "lucide-react";

interface DashaPeriod {
  planet: string;
  sanskrit: string;
  years: number;
  color: string;
  description: string;
  nature: string;
}

const DASHA_PERIODS: DashaPeriod[] = [
  { planet: "Ketu", sanskrit: "केतु", years: 7, color: "#64748b", description: "Spiritual detachment, sudden endings, liberation from past karma.", nature: "Malefic" },
  { planet: "Venus", sanskrit: "शुक्र", years: 20, color: "#ec4899", description: "Luxury, relationships, artistic growth, and material comfort.", nature: "Benefic" },
  { planet: "Sun", sanskrit: "सूर्य", years: 6, color: "#f59e0b", description: "Authority, career recognition, ego development, government dealings.", nature: "Malefic" },
  { planet: "Moon", sanskrit: "चन्द्र", years: 10, color: "#94a3b8", description: "Emotional growth, mind expansion, public dealings, nourishment.", nature: "Benefic" },
  { planet: "Mars", sanskrit: "मङ्गल", years: 7, color: "#ef4444", description: "Courage, property disputes, siblings, physical energy, wars.", nature: "Malefic" },
  { planet: "Rahu", sanskrit: "राहु", years: 18, color: "#7c3aed", description: "Obsession, foreign connections, sudden rise, illusion, technology.", nature: "Malefic" },
  { planet: "Jupiter", sanskrit: "गुरु", years: 16, color: "#f97316", description: "Wisdom, children, expansion, divine grace, teaching, wealth.", nature: "Benefic" },
  { planet: "Saturn", sanskrit: "शनि", years: 19, color: "#475569", description: "Discipline, hard work, delay, maturity, karma repayment.", nature: "Malefic" },
  { planet: "Mercury", sanskrit: "बुध", years: 17, color: "#10b981", description: "Intellect, business, communication, education, commerce.", nature: "Neutral" },
];

const TOTAL_YEARS = 120;

export default function DashaTimeline({ size = 680 }: { size?: number }) {
  const [selected, setSelected] = useState<DashaPeriod | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative w-full max-w-[720px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-amber-50/20 to-orange-50/10 border border-amber-200/40 shadow-2xl shadow-amber-900/5 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-700">
            Vimshottari Dasha — 120 Year Timeline
          </h2>
          <p className="text-sm text-amber-400 mt-2 font-medium">
            Each planet rules a specific period of your life. Tap any segment to explore.
          </p>
        </div>

        <div className="relative w-full h-16 bg-gray-100 rounded-2xl overflow-hidden flex mb-6 shadow-inner">
          {DASHA_PERIODS.map((d, i) => {
            const widthPct = (d.years / TOTAL_YEARS) * 100;
            const isActive = selected?.planet === d.planet;
            const isHover = hovered === i;
            return (
              <button
                key={d.planet}
                onClick={() => setSelected(isActive ? null : d)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`relative h-full flex items-center justify-center transition-all duration-300 ${isActive ? "z-10 shadow-lg" : "hover:z-10 hover:shadow-md"}`}
                style={{ width: `${widthPct}%`, background: isActive || isHover ? d.color : `${d.color}cc` }}
              >
                <span className={`font-bold text-white ${widthPct > 8 ? "text-sm" : "text-[10px]"}`}>
                  {widthPct > 5 ? d.planet[0] : ""}
                </span>
                {(isActive || isHover) && widthPct > 10 && (
                  <span className="absolute bottom-1 text-[9px] text-white/90 font-semibold">{d.years}y</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] text-gray-400 font-medium px-1 mb-6">
          <span>Birth</span><span>Age 30</span><span>Age 60</span><span>Age 90</span><span>Age 120</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {DASHA_PERIODS.map((d, i) => {
            const isActive = selected?.planet === d.planet;
            const isHover = hovered === i;
            return (
              <button
                key={d.planet}
                onClick={() => setSelected(isActive ? null : d)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`relative rounded-2xl p-3 text-left transition-all duration-300 border-2 ${isActive ? "scale-105 shadow-xl -translate-y-1" : "hover:scale-[1.02] hover:shadow-md"}`}
                style={{ background: isActive ? d.color + "12" : "#fff", borderColor: isActive || isHover ? d.color : "#f1f5f9" }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: d.color }} />
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ background: d.color }}>{d.planet[0]}</div>
                  <span className="text-lg font-extrabold" style={{ color: d.color }}>{d.years}</span>
                </div>
                <div className="text-sm font-bold text-gray-800">{d.planet}</div>
                <div className="text-[10px] text-gray-400">{d.sanskrit}</div>
                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: d.color + "15", color: d.color }}>{d.nature}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /><span className="text-sm font-bold text-gray-700">Total Cycle</span></div>
          <span className="text-xl font-extrabold text-amber-600">{TOTAL_YEARS} Years</span>
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
                <h3 className="text-xl font-extrabold text-gray-900">{selected.planet} Mahadasha</h3>
                <p className="text-sm font-medium" style={{ color: selected.color }}>{selected.sanskrit} · {selected.years} Years</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{selected.description}</p>
            <div className="p-4 rounded-2xl" style={{ background: selected.color + "08", border: `2px dashed ${selected.color}30` }}>
              <div className="flex items-center justify-between"><span className="text-sm font-bold text-gray-500">Duration</span><span className="text-2xl font-extrabold" style={{ color: selected.color }}>{selected.years} Years</span></div>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(selected.years / 20) * 100}%`, background: selected.color }} /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
