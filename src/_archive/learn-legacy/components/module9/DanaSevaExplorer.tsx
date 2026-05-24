"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HeartHandshake, Package, Users, Clock, Sparkles, ArrowRight,
  CheckCircle2,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────
const PLANET_DANA = [
  {
    planet: "Sun",
    materials: ["Wheat", "Copper", "Jaggery", "Red cloth"],
    demographic: ["Government", "Temples", "Fathers", "Leaders"],
    day: "Sunday",
    time: "Sunrise",
    color: "#f97316",
  },
  {
    planet: "Moon",
    materials: ["Rice", "Milk", "Silver items", "White cloth"],
    demographic: ["Mothers", "Infants", "Emotional support groups"],
    day: "Monday",
    time: "Evening",
    color: "#64748b",
  },
  {
    planet: "Mars",
    materials: ["Red lentils", "Red clay", "Copper", "Red cloth"],
    demographic: ["Police", "Military", "Firefighters", "Younger brothers"],
    day: "Tuesday",
    time: "Morning",
    color: "#ef4444",
  },
  {
    planet: "Mercury",
    materials: ["Green moong dal", "Green vegetables", "Books", "Stationery"],
    demographic: ["Students", "Orphans", "Publishers"],
    day: "Wednesday",
    time: "Morning",
    color: "#22c55e",
  },
  {
    planet: "Jupiter",
    materials: ["Chana dal", "Turmeric", "Educational materials", "Yellow cloth"],
    demographic: ["Teachers", "Priests", "Spiritual guides", "Legal system"],
    day: "Thursday",
    time: "Morning",
    color: "#eab308",
  },
  {
    planet: "Venus",
    materials: ["Silk", "Perfumes", "White rice", "Cosmetics"],
    demographic: ["Women in need", "Artists", "Wives"],
    day: "Friday",
    time: "Morning",
    color: "#ec4899",
  },
  {
    planet: "Saturn",
    materials: ["Black sesame", "Mustard oil", "Iron", "Blankets", "Old shoes"],
    demographic: ["Elderly", "Disabled", "Janitors", "Manual laborers", "Impoverished"],
    day: "Saturday",
    time: "After Sunset",
    color: "#6b7280",
  },
  {
    planet: "Rahu",
    materials: ["Coconuts", "Lead items", "Sweeping tools", "Old electronics"],
    demographic: ["Outcasts", "People with infectious diseases"],
    day: "Saturday",
    time: "Night",
    color: "#7c3aed",
  },
  {
    planet: "Ketu",
    materials: ["Multi-colored blankets", "Dog food", "Mosquito nets"],
    demographic: ["Outcasts", "Stray animals (dogs)", "Spiritual seekers"],
    day: "Tuesday",
    time: "Night",
    color: "#3b82f6",
  },
];

// ─── Component ────────────────────────────────────────────────
export default function DanaSevaExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState(PLANET_DANA[6]); // Saturn

  return (
    <div className="bg-white border border-teal-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-teal-900">Dana &amp; Seva Karmic Offset</h3>
            <p className="text-sm text-teal-600">Material · Demographic · Timing</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Planet Selector */}
        <div className="mb-5">
          <label className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2 block">Afflicted Planet</label>
          <div className="flex flex-wrap gap-2">
            {PLANET_DANA.map((p) => {
              const active = selectedPlanet.planet === p.planet;
              return (
                <button
                  key={p.planet}
                  onClick={() => setSelectedPlanet(p)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border transition-all ${
                    active
                      ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                      : "bg-white text-slate-800 border-slate-200 hover:border-teal-300"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} /> {p.planet}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Vector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <motion.div
            key={`${selectedPlanet.planet}-material`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 rounded-xl border border-orange-200 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">Material</span>
            </div>
            <div className="space-y-1">
              {selectedPlanet.materials.map((m) => (
                <div key={m} className="flex items-center gap-1.5 text-xs text-slate-800">
                  <CheckCircle2 className="w-3 h-3 text-orange-500 shrink-0" /> {m}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            key={`${selectedPlanet.planet}-demographic`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-violet-50 rounded-xl border border-violet-200 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-violet-600" />
              <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">Demographic</span>
            </div>
            <div className="space-y-1">
              {selectedPlanet.demographic.map((d) => (
                <div key={d} className="flex items-center gap-1.5 text-xs text-slate-800">
                  <CheckCircle2 className="w-3 h-3 text-violet-500 shrink-0" /> {d}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            key={`${selectedPlanet.planet}-timing`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-emerald-50 rounded-xl border border-emerald-200 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Timing</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> Day: <strong>{selectedPlanet.day}</strong>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> Time: <strong>{selectedPlanet.time}</strong>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Prescription Card */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border-2 border-teal-300 p-5 mb-5">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2">Karmic Offset Prescription</div>
          <p className="text-sm text-teal-900 leading-relaxed">
            To offset <strong>{selectedPlanet.planet}</strong>&apos;s negative energy, donate{" "}
            <strong>{selectedPlanet.materials.slice(0, 3).join(", ")}</strong> directly to{" "}
            <strong>{selectedPlanet.demographic[0].toLowerCase()}</strong> on{" "}
            <strong>{selectedPlanet.day}</strong>, exactly <strong>{selectedPlanet.time.toLowerCase()}</strong>.
            Do not give money — give the physical items.
          </p>
        </div>

        {/* Execution Flow */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-bold text-slate-800">Execution Flow</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {["Diagnostic", "Query DB", "Assemble", "Output"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
                  {i + 1}. {step}
                </div>
                {i < 3 && <ArrowRight className="w-3 h-3 text-slate-400 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>

        {/* Astrologer Note */}
        <div className="bg-teal-50 rounded-lg border border-teal-200 p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-teal-800">Astrologer Note</div>
              <p className="text-sm text-teal-700 mt-0.5">
                Dana &amp; Seva is the <strong>safest</strong> and most universally applicable remedy. The donation must be a precision strike — exact material, exact demographic, exact timing. Random charity does not fix specific astrological code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
