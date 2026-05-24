"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Hexagon, Sparkles, MapPin, CircleDot, ArrowRight,
  Star,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────
const PLANET_YANTRAS = [
  {
    planet: "Sun",
    shape: "Circle / Bindu (Center Point)",
    element: "Fire",
    direction: "East",
    bodyZone: "Head / Brain",
    sign: "Leo",
    color: "#f97316",
  },
  {
    planet: "Moon",
    shape: "Crescent / Wave Symmetry",
    element: "Water",
    direction: "North-West",
    bodyZone: "Chest / Heart",
    sign: "Cancer",
    color: "#64748b",
  },
  {
    planet: "Mars",
    shape: "Upward-facing Triangle",
    element: "Fire",
    direction: "South",
    bodyZone: "Upper Stomach / Spine",
    sign: "Aries, Scorpio",
    color: "#ef4444",
  },
  {
    planet: "Mercury",
    shape: "Arrow / Interlocking Polygons",
    element: "Earth/Air",
    direction: "North",
    bodyZone: "Shoulders / Arms / Hands",
    sign: "Gemini, Virgo",
    color: "#22c55e",
  },
  {
    planet: "Jupiter",
    shape: "Expanding Square / Upward Triangle",
    element: "Ether",
    direction: "North-East",
    bodyZone: "Thighs / Hips",
    sign: "Sagittarius, Pisces",
    color: "#eab308",
  },
  {
    planet: "Venus",
    shape: "Hexagram / Vesica Piscis / Lotus",
    element: "Water",
    direction: "South-East",
    bodyZone: "Face / Throat / Neck",
    sign: "Taurus, Libra",
    color: "#ec4899",
  },
  {
    planet: "Saturn",
    shape: "Square / Cross / Labyrinth",
    element: "Air",
    direction: "West",
    bodyZone: "Knees / Bones",
    sign: "Capricorn, Aquarius",
    color: "#6b7280",
  },
  {
    planet: "Rahu",
    shape: "Spiral / Asymmetric Pattern",
    element: "Air",
    direction: "South-West",
    bodyZone: "Lower Back / Kidneys / Navel",
    sign: "—",
    color: "#7c3aed",
  },
  {
    planet: "Ketu",
    shape: "Descending Triangle / Flag",
    element: "Fire",
    direction: "—",
    bodyZone: "Calves / Ankles",
    sign: "—",
    color: "#3b82f6",
  },
];

const BODY_ZONES: Record<string, { zone: string; sign: string }> = {
  "Head / Brain": { zone: "Aries", sign: "Mars energy — courage, initiative" },
  "Face / Throat / Neck": { zone: "Taurus", sign: "Venus energy — beauty, voice" },
  "Shoulders / Arms / Hands": { zone: "Gemini", sign: "Mercury energy — communication" },
  "Chest / Heart": { zone: "Cancer", sign: "Moon energy — emotion, nurture" },
  "Upper Stomach / Spine": { zone: "Leo", sign: "Sun energy — identity, power" },
  "Lower Abdomen / Digestive Tract": { zone: "Virgo", sign: "Mercury energy — analysis" },
  "Lower Back / Kidneys / Navel": { zone: "Libra", sign: "Venus energy — balance" },
  "Pelvis / Reproductive Organs": { zone: "Scorpio", sign: "Mars energy — transformation" },
  "Thighs / Hips": { zone: "Sagittarius", sign: "Jupiter energy — expansion" },
  "Knees / Bones": { zone: "Capricorn", sign: "Saturn energy — structure" },
  "Calves / Ankles": { zone: "Aquarius", sign: "Saturn energy — innovation" },
  "Feet": { zone: "Pisces", sign: "Jupiter energy — spirituality" },
};

// ─── Component ────────────────────────────────────────────────
export default function YantraGeometryExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState(PLANET_YANTRAS[4]); // Jupiter

  const bodyInfo = BODY_ZONES[selectedPlanet.bodyZone];

  return (
    <div className="bg-white border border-teal-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center">
            <Hexagon className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-teal-900">Yantra &amp; Modern Anchor Engine</h3>
            <p className="text-sm text-teal-600">Sacred Geometry → Spatial Anchor → Biological Anchor</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Planet Selector */}
        <div className="mb-5">
          <label className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2 block">Select Planet</label>
          <div className="flex flex-wrap gap-2">
            {PLANET_YANTRAS.map((p) => {
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

        {/* Tri-fold Result */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <motion.div
            key={`${selectedPlanet.planet}-geo`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 rounded-xl border border-orange-200 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Hexagon className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">Geometry</span>
            </div>
            <div className="text-sm font-bold text-orange-900 mb-1">{selectedPlanet.shape}</div>
            <div className="text-xs text-orange-700">Element: {selectedPlanet.element}</div>
          </motion.div>

          <motion.div
            key={`${selectedPlanet.planet}-vastu`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-violet-50 rounded-xl border border-violet-200 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-violet-600" />
              <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">Vastu Direction</span>
            </div>
            <div className="text-sm font-bold text-violet-900 mb-1">{selectedPlanet.direction}</div>
            <div className="text-xs text-violet-700">Place Yantra facing {selectedPlanet.direction.toLowerCase()}</div>
          </motion.div>

          <motion.div
            key={`${selectedPlanet.planet}-body`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-emerald-50 rounded-xl border border-emerald-200 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <CircleDot className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Body Zone</span>
            </div>
            <div className="text-sm font-bold text-emerald-900 mb-1">{selectedPlanet.bodyZone}</div>
            <div className="text-xs text-emerald-700">Kala Purusha: {bodyInfo?.zone || "—"}</div>
          </motion.div>
        </div>

        {/* Prescription Output */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border-2 border-teal-300 p-5 mb-5">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-2">Prescription Output</div>
          <p className="text-sm text-teal-900 leading-relaxed">
            To stabilize <strong>{selectedPlanet.planet}</strong>&apos;s frequency, prescribe{" "}
            <strong>{selectedPlanet.shape.split("/")[0].toLowerCase()}</strong> geometry.
            For Vastu: anchor in the <strong>{selectedPlanet.direction}</strong> quadrant.
            For biological anchor: place on the <strong>{selectedPlanet.bodyZone.toLowerCase()}</strong>.
            This creates a passive, permanent structural receiver for {selectedPlanet.planet.toLowerCase()}&apos;s energy.
          </p>
        </div>

        {/* Modern Anchors */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-bold text-slate-800">Modern Anchor Equivalents</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {["Vision Board", "Digital Reminder", "Environmental Design", "Wearable Symbol"].map((anchor) => (
              <div key={anchor} className="bg-white rounded-lg border border-slate-100 p-2.5 text-center text-xs font-bold text-slate-700">
                {anchor}
              </div>
            ))}
          </div>
        </div>

        {/* Execution Flow */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-bold text-slate-800">Geometry Engine Flow</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {["Diagnostic", "Shape Query", "Placement Query", "Output"].map((step, i) => (
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
                Yantras are <strong>spatial and structural</strong> — not acoustic or optical. They create a passive anchor that holds planetary frequency in place permanently. Clean the Yantra regularly and energize it through Prana Pratishtha.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
