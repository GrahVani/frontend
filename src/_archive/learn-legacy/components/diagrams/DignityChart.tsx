"use client";

import React, { useState } from "react";
import { X, TrendingUp, TrendingDown, Minus, Home, Star, Heart, Shield } from "lucide-react";

interface PlanetDignity {
  planet: string;
  sanskrit: string;
  color: string;
  exaltation: { sign: string; deg: string; power: number };
  moolatrikona: { sign: string; range: string; power: number };
  ownSigns: { signs: string[]; power: number };
  friendly: string[];
  neutral: string[];
  enemy: string[];
  debilitation: { sign: string; deg: string; power: number };
}

const PLANETS: PlanetDignity[] = [
  { planet: "Sun", sanskrit: "Surya", color: "#f59e0b", exaltation: { sign: "Aries", deg: "10°", power: 100 }, moolatrikona: { sign: "Leo", range: "4°-20°", power: 75 }, ownSigns: { signs: ["Leo"], power: 60 }, friendly: ["Moon", "Mars", "Jupiter"], neutral: ["Mercury"], enemy: ["Venus", "Saturn"], debilitation: { sign: "Libra", deg: "10°", power: 0 } },
  { planet: "Moon", sanskrit: "Chandra", color: "#94a3b8", exaltation: { sign: "Taurus", deg: "3°", power: 100 }, moolatrikona: { sign: "Taurus", range: "4°-20°", power: 75 }, ownSigns: { signs: ["Cancer"], power: 60 }, friendly: ["Sun", "Mercury"], neutral: ["Mars", "Jupiter", "Venus", "Saturn"], enemy: [], debilitation: { sign: "Scorpio", deg: "3°", power: 0 } },
  { planet: "Mars", sanskrit: "Mangala", color: "#ef4444", exaltation: { sign: "Capricorn", deg: "28°", power: 100 }, moolatrikona: { sign: "Aries", range: "0°-12°", power: 75 }, ownSigns: { signs: ["Aries", "Scorpio"], power: 60 }, friendly: ["Sun", "Moon", "Jupiter"], neutral: ["Venus", "Saturn"], enemy: ["Mercury"], debilitation: { sign: "Cancer", deg: "28°", power: 0 } },
  { planet: "Mercury", sanskrit: "Budha", color: "#10b981", exaltation: { sign: "Virgo", deg: "15°", power: 100 }, moolatrikona: { sign: "Virgo", range: "16°-20°", power: 75 }, ownSigns: { signs: ["Gemini", "Virgo"], power: 60 }, friendly: ["Sun", "Venus"], neutral: ["Mars", "Jupiter", "Saturn"], enemy: ["Moon"], debilitation: { sign: "Pisces", deg: "15°", power: 0 } },
  { planet: "Jupiter", sanskrit: "Guru", color: "#f97316", exaltation: { sign: "Cancer", deg: "5°", power: 100 }, moolatrikona: { sign: "Sagittarius", range: "0°-10°", power: 75 }, ownSigns: { signs: ["Sagittarius", "Pisces"], power: 60 }, friendly: ["Sun", "Moon", "Mars"], neutral: ["Saturn"], enemy: ["Mercury", "Venus"], debilitation: { sign: "Capricorn", deg: "5°", power: 0 } },
  { planet: "Venus", sanskrit: "Shukra", color: "#ec4899", exaltation: { sign: "Pisces", deg: "27°", power: 100 }, moolatrikona: { sign: "Libra", range: "0°-15°", power: 75 }, ownSigns: { signs: ["Taurus", "Libra"], power: 60 }, friendly: ["Mercury", "Saturn"], neutral: ["Mars", "Jupiter"], enemy: ["Sun", "Moon"], debilitation: { sign: "Virgo", deg: "27°", power: 0 } },
  { planet: "Saturn", sanskrit: "Shani", color: "#475569", exaltation: { sign: "Libra", deg: "20°", power: 100 }, moolatrikona: { sign: "Aquarius", range: "0°-20°", power: 75 }, ownSigns: { signs: ["Capricorn", "Aquarius"], power: 60 }, friendly: ["Mercury", "Venus"], neutral: ["Jupiter"], enemy: ["Sun", "Moon", "Mars"], debilitation: { sign: "Aries", deg: "20°", power: 0 } },
];

const AVASTHAS = [
  { name: "Bala", label: "Infant", range: "0°-6°", power: 0.25, color: "#ef4444", desc: "Weak, inexperienced" },
  { name: "Kumara", label: "Youth", range: "6°-12°", power: 0.50, color: "#f97316", desc: "Growing strength" },
  { name: "Yuva", label: "Adult", range: "12°-18°", power: 1.00, color: "#22c55e", desc: "Maximum power" },
  { name: "Vriddha", label: "Elder", range: "18°-24°", power: 0.75, color: "#3b82f6", desc: "Stable, wise" },
  { name: "Mrita", label: "Near Death", range: "24°-30°", power: 0.25, color: "#6b7280", desc: "Exhausted, minimal" },
];

function PowerBar({ label, power, color }: { label: string; power: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold text-gray-500 w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${power}%`, background: color }} />
      </div>
      <span className="text-[10px] font-bold w-8 text-right" style={{ color }}>{power}%</span>
    </div>
  );
}

export default function DignityChart({ size = 640 }: { size?: number }) {
  const [selected, setSelected] = useState<PlanetDignity | null>(null);
  const [selectedAvastha, setSelectedAvastha] = useState<(typeof AVASTHAS)[0] | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-[720px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/10 border border-emerald-200/40 shadow-2xl shadow-emerald-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700 tracking-tight">
            Planetary Dignity & Avasthas
          </h2>
          <p className="text-sm text-emerald-400 mt-2 font-medium">
            A planet's strength depends on its sign placement and degree-based age state
          </p>
        </div>

        {/* Planet strength meters */}
        <div className="space-y-3 mb-6">
          {PLANETS.map((p) => {
            const isActive = selected?.planet === p.planet;
            const isHover = hoveredPlanet === p.planet;
            return (
              <button
                key={p.planet}
                onClick={() => setSelected(isActive ? null : p)}
                onMouseEnter={() => setHoveredPlanet(p.planet)}
                onMouseLeave={() => setHoveredPlanet(null)}
                className={`w-full rounded-xl p-3 sm:p-4 text-left transition-all duration-300 border ${
                  isActive ? "shadow-lg scale-[1.01]" : "hover:shadow-md hover:border-emerald-200"
                }`}
                style={{ background: isActive ? p.color + "08" : "#fff", borderColor: isActive || isHover ? p.color + "40" : "#f1f5f9" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ background: p.color }}>
                    {p.planet[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">{p.planet} <span className="text-xs text-gray-400 font-medium">({p.sanskrit})</span></span>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-xs font-bold text-green-600">{p.exaltation.sign}</span>
                        <span className="text-gray-300">|</span>
                        <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-xs font-bold text-red-500">{p.debilitation.sign}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 pl-12">
                  <PowerBar label="Exaltation" power={100} color="#22c55e" />
                  <PowerBar label="Moolatrikona" power={75} color={p.color} />
                  <PowerBar label="Own Sign" power={60} color="#3b82f6" />
                  <PowerBar label="Debilitation" power={0} color="#ef4444" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Avastha cards */}
        <div className="grid grid-cols-5 gap-2">
          {AVASTHAS.map((av) => {
            const isActive = selectedAvastha?.name === av.name;
            return (
              <button
                key={av.name}
                onClick={() => setSelectedAvastha(isActive ? null : av)}
                className={`rounded-xl p-3 text-center transition-all duration-300 border ${
                  isActive ? "shadow-lg scale-105" : "hover:shadow-md hover:scale-[1.02]"
                }`}
                style={{ background: isActive ? av.color + "10" : "#fff", borderColor: isActive ? av.color : "#f1f5f9" }}
              >
                <div className="text-lg font-extrabold" style={{ color: av.color }}>{av.power}×</div>
                <div className="text-xs font-bold text-gray-700 mt-1">{av.name}</div>
                <div className="text-[10px] text-gray-400">{av.label}</div>
                <div className="text-[9px] text-gray-300 mt-0.5">{av.range}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Planet detail popup */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-3xl border shadow-2xl p-6 w-full max-w-[420px] animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto"
            style={{ borderColor: selected.color + "40" }}>
            <button onClick={() => setSelected(null)} className="absolute right-4 top-4 p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ background: selected.color }}>
                {selected.planet[0]}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">{selected.planet}</h3>
                <p className="text-sm font-medium" style={{ color: selected.color }}>{selected.sanskrit}</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                <TrendingUp className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-green-700">Exaltation (Uccha)</div>
                  <div className="text-sm font-bold text-gray-800">{selected.exaltation.sign} {selected.exaltation.deg}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: selected.color + "08", border: `1px solid ${selected.color}20` }}>
                <Star className="w-5 h-5 shrink-0" style={{ color: selected.color }} />
                <div>
                  <div className="text-xs font-bold" style={{ color: selected.color }}>Moolatrikona</div>
                  <div className="text-sm font-bold text-gray-800">{selected.moolatrikona.sign} {selected.moolatrikona.range}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                <Home className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-blue-700">Own Signs (Swa)</div>
                  <div className="text-sm font-bold text-gray-800">{selected.ownSigns.signs.join(", ")}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                <TrendingDown className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-red-700">Debilitation (Neecha)</div>
                  <div className="text-sm font-bold text-gray-800">{selected.debilitation.sign} {selected.debilitation.deg}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Heart className="w-5 h-5 text-pink-500 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-gray-500">Relationships</div>
                  <div className="text-xs text-gray-700 mt-1">
                    <span className="font-semibold text-green-600">Friends:</span> {selected.friendly.join(", ") || "None"} · 
                    <span className="font-semibold text-gray-500">Neutral:</span> {selected.neutral.join(", ") || "None"} · 
                    <span className="font-semibold text-red-500">Enemies:</span> {selected.enemy.join(", ") || "None"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avastha popup */}
      {selectedAvastha && !selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedAvastha(null)} />
          <div className="relative bg-white rounded-3xl border shadow-2xl p-6 w-full max-w-[340px] animate-in zoom-in-95 duration-200"
            style={{ borderColor: selectedAvastha.color + "40" }}>
            <button onClick={() => setSelectedAvastha(null)} className="absolute right-4 top-4 p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
            <div className="text-center mb-4">
              <div className="text-4xl font-extrabold" style={{ color: selectedAvastha.color }}>{selectedAvastha.power}×</div>
              <h3 className="text-lg font-bold text-gray-900 mt-1">{selectedAvastha.name}</h3>
              <p className="text-sm text-gray-400">{selectedAvastha.label} · {selectedAvastha.range}</p>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: selectedAvastha.color + "08", border: `1px solid ${selectedAvastha.color}20` }}>
              <p className="text-sm text-gray-700 leading-relaxed">
                A planet in <strong>{selectedAvastha.name}</strong> state operates at <strong style={{ color: selectedAvastha.color }}>{selectedAvastha.power}×</strong> strength.
                {selectedAvastha.name === "Yuva" && " This is peak maturity — the planet delivers its full promise."}
                {selectedAvastha.name === "Bala" && " The planet is newborn and weak, struggling to express its nature."}
                {selectedAvastha.name === "Mrita" && " The planet is exhausted, delivering minimal visible results."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
