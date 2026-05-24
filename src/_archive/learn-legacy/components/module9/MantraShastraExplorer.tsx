"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Volume2, Music, Clock, AlertTriangle, CheckCircle2, Sparkles,
  RotateCcw, Moon,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────
const PLANET_MANTRAS = [
  { planet: "Sun", bija: "Hraam", mantra: "Om Hraam Hreem Hraum Sah Suryaya Namah", reps: 7000, day: "Sunday", time: "Sunrise", color: "#f97316" },
  { planet: "Moon", bija: "Shraam", mantra: "Om Shraam Shreem Shraum Sah Chandraya Namah", reps: 11000, day: "Monday", time: "Evening", color: "#64748b" },
  { planet: "Mars", bija: "Kraam", mantra: "Om Kraam Kreem Kraum Sah Bhaumaya Namah", reps: 10000, day: "Tuesday", time: "Morning", color: "#ef4444" },
  { planet: "Mercury", bija: "Braam", mantra: "Om Braam Breem Braum Sah Budhaya Namah", reps: 9000, day: "Wednesday", time: "Morning", color: "#22c55e" },
  { planet: "Jupiter", bija: "Graam", mantra: "Om Graam Greem Graum Sah Gurave Namah", reps: 19000, day: "Thursday", time: "Morning", color: "#eab308" },
  { planet: "Venus", bija: "Draam", mantra: "Om Draam Dreem Draum Sah Shukraya Namah", reps: 16000, day: "Friday", time: "Morning", color: "#ec4899" },
  { planet: "Saturn", bija: "Praam", mantra: "Om Praam Preem Praum Sah Shanishcharaya Namah", reps: 23000, day: "Saturday", time: "After Sunset", color: "#6b7280" },
  { planet: "Rahu", bija: "Bhraam", mantra: "Om Bhraam Bhreem Bhraum Sah Rahave Namah", reps: 18000, day: "Saturday", time: "Night", color: "#7c3aed" },
  { planet: "Ketu", bija: "Sraam", mantra: "Om Sraam Sreem Sraum Sah Ketave Namah", reps: 17000, day: "Tuesday", time: "Night", color: "#3b82f6" },
];

const SCENARIOS = [
  { id: "dusthana", label: "Dusthana Lord (6/8/12)", desc: "Planet rules disease, obstacles, or loss. Gemstone blocked. Mantra prescribed.", severity: "high" },
  { id: "sadesati", label: "Sade Sati Transit", desc: "7.5-year Saturn transit. Mental health stabilization required.", severity: "high" },
  { id: "mahadasha", label: "Severe Mahadasha", desc: "Running dasha of an afflicted planet. Full Japa within 40 days.", severity: "medium" },
  { id: "general", label: "General Pacification", desc: "Routine mantra practice for overall harmony.", severity: "low" },
];

// ─── Component ────────────────────────────────────────────────
export default function MantraShastraExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState(PLANET_MANTRAS[6]); // Saturn
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [dailyReps, setDailyReps] = useState(108);

  const daysNeeded = Math.ceil(selectedPlanet.reps / dailyReps);
  const weeksNeeded = Math.ceil(daysNeeded / 7);

  return (
    <div className="bg-white border border-teal-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-teal-900">Mantra Shastra Prescription Engine</h3>
            <p className="text-sm text-teal-600">Bija Mantras + Japa Count Calculator</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Planet Selector */}
        <div className="mb-5">
          <label className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2 block">Select Planet</label>
          <div className="flex flex-wrap gap-2">
            {PLANET_MANTRAS.map((p) => {
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

        {/* Scenario Selector */}
        <div className="mb-5">
          <label className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2 block">Prescription Scenario</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setScenario(s)}
                className={`text-left px-3 py-2.5 rounded-lg border text-xs transition-all ${
                  scenario.id === s.id
                    ? "bg-teal-50 border-teal-300 shadow-sm"
                    : "bg-white border-slate-200 hover:border-teal-200"
                }`}
              >
                <div className={`font-bold ${scenario.id === s.id ? "text-teal-800" : "text-slate-800"}`}>{s.label}</div>
                <div className="text-[10px] text-slate-700 mt-0.5">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Mantra Card */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-200 p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">Bija Mantra for {selectedPlanet.planet}</span>
          </div>
          <div className="bg-white rounded-lg border border-teal-100 p-4 text-center mb-3">
            <div className="text-[10px] text-slate-700 uppercase tracking-wide mb-1">Root Bija: <strong>{selectedPlanet.bija}</strong></div>
            <div className="text-lg font-extrabold text-teal-900 font-serif">{selectedPlanet.mantra}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-lg border border-teal-100 p-2 text-center">
              <div className="text-[10px] text-slate-700">Baseline Reps</div>
              <div className="text-sm font-bold text-teal-800">{selectedPlanet.reps.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg border border-teal-100 p-2 text-center">
              <div className="text-[10px] text-slate-700">Best Day</div>
              <div className="text-sm font-bold text-teal-800">{selectedPlanet.day}</div>
            </div>
            <div className="bg-white rounded-lg border border-teal-100 p-2 text-center">
              <div className="text-[10px] text-slate-700">Best Time</div>
              <div className="text-sm font-bold text-teal-800">{selectedPlanet.time}</div>
            </div>
          </div>
        </div>

        {/* Japa Calculator */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-bold text-slate-800">Japa Completion Calculator</span>
          </div>
          <div className="mb-3">
            <label className="text-xs font-bold text-slate-700 mb-1 block">Daily Repetitions: <span className="text-teal-700">{dailyReps}</span></label>
            <input
              type="range"
              min={27}
              max={1080}
              step={27}
              value={dailyReps}
              onChange={(e) => setDailyReps(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: "#0d9488" }}
            />
            <div className="flex justify-between text-[10px] text-slate-700 mt-1">
              <span>27/day</span>
              <span>108/day</span>
              <span>540/day</span>
              <span>1080/day</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg border border-slate-100 p-3 text-center">
              <div className="text-[10px] text-slate-700">Days to Complete</div>
              <div className="text-xl font-extrabold text-teal-800">{daysNeeded}</div>
            </div>
            <div className="bg-white rounded-lg border border-slate-100 p-3 text-center">
              <div className="text-[10px] text-slate-700">Weeks to Complete</div>
              <div className="text-xl font-extrabold text-teal-800">{weeksNeeded}</div>
            </div>
          </div>
          {scenario.id === "mahadasha" && (
            <div className="mt-2 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1.5 rounded border border-amber-200 text-center">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Target: Complete within 40 days
            </div>
          )}
        </div>

        {/* Routing Logic */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <RotateCcw className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-bold text-slate-800">Routing Logic Gate</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
              <span className="text-slate-700">Software detects <strong>{scenario.label}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
              <span className="text-slate-700">Gemstone prescription <strong>{scenario.severity === "high" ? "BLOCKED" : "reviewed"}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
              <span className="text-slate-700">Auto-routed to <strong>Mantra Shastra</strong> protocol</span>
            </div>
          </div>
        </div>

        {/* Astrologer Note */}
        <div className="bg-teal-50 rounded-lg border border-teal-200 p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-teal-800">Astrologer Note</div>
              <p className="text-sm text-teal-700 mt-0.5">
                Mantras are <strong>completely safe</strong> — impossible to overdose. They act as equalizers, not amplifiers. For severe afflictions, combine mantra with Dana (charity) for maximum effect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
