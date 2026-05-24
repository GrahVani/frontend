"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Search, Gem, Volume2, HeartHandshake, AlertTriangle,
  CheckCircle2, XCircle, Sparkles, ArrowRight, RotateCcw,
  Sun, Moon, CircleDot, Flame, Crown, Star,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────
const AFFLICTION_CATEGORIES = [
  {
    id: "wealth",
    label: "Wealth / Finances",
    icon: Crown,
    color: "amber",
    houses: "2nd, 11th",
    planets: ["Jupiter", "Venus", "Mercury"],
    weaknesses: [
      { id: "w1", label: "2nd Lord Debilitated", planet: "Mercury", severity: "high" },
      { id: "w2", label: "11th Lord Afflicted", planet: "Saturn", severity: "medium" },
      { id: "w3", label: "Jupiter Weak in D-9", planet: "Jupiter", severity: "medium" },
      { id: "w4", label: "Venus Combust", planet: "Venus", severity: "high" },
    ],
  },
  {
    id: "health",
    label: "Health / Vitality",
    icon: Sun,
    color: "emerald",
    houses: "1st, 6th",
    planets: ["Sun", "Mars", "Saturn"],
    weaknesses: [
      { id: "h1", label: "1st Lord in 6th", planet: "Mars", severity: "high" },
      { id: "h2", label: "Saturn in 1st", planet: "Saturn", severity: "medium" },
      { id: "h3", label: "Sun Debilitated", planet: "Sun", severity: "high" },
      { id: "h4", label: "Rahu in 6th", planet: "Rahu", severity: "medium" },
    ],
  },
  {
    id: "relationship",
    label: "Relationships / Marriage",
    icon: HeartHandshake,
    color: "rose",
    houses: "7th",
    planets: ["Venus", "Jupiter", "Moon"],
    weaknesses: [
      { id: "r1", label: "7th Lord in 6th", planet: "Mars", severity: "high" },
      { id: "r2", label: "Venus Afflicted by Saturn", planet: "Venus", severity: "high" },
      { id: "r3", label: "Darakaraka Debilitated", planet: "Jupiter", severity: "medium" },
      { id: "r4", label: "Moon in Scorpio", planet: "Moon", severity: "medium" },
    ],
  },
  {
    id: "career",
    label: "Career / Status",
    icon: Star,
    color: "violet",
    houses: "10th",
    planets: ["Saturn", "Sun", "Mercury"],
    weaknesses: [
      { id: "c1", label: "10th Lord in 8th", planet: "Saturn", severity: "high" },
      { id: "c2", label: "Sun in 12th", planet: "Sun", severity: "medium" },
      { id: "c3", label: "Mercury Retrograde", planet: "Mercury", severity: "low" },
      { id: "c4", label: "Rahu in 10th", planet: "Rahu", severity: "medium" },
    ],
  },
];

const REMEDY_TABS = [
  { id: "mantra", label: "Mantra", icon: Volume2, desc: "Sound frequency to harmonize planetary energy" },
  { id: "dana", label: "Dana (Charity)", icon: HeartHandshake, desc: "Donate items ruled by the afflicted planet" },
  { id: "ratna", label: "Ratna (Gemstone)", icon: Gem, desc: "Wear crystal to amplify benefic frequency" },
];

const PRESCRIPTIONS: Record<string, Record<string, { mantra?: string; dana?: string; ratna?: string; ratnaWarning?: string; bodyZone?: string; geometry?: string }>> = {
  Mercury: {
    mantra: { mantra: "Om Namo Bhagavate Vasudevaya" },
    dana: { dana: "Donate green vegetables, books, or stationery on Wednesdays" },
    ratna: { ratna: "Emerald (Panna) — wear on right little finger", ratnaWarning: "Only if Mercury rules benefic houses. Never if 6th/8th/12th lord." },
  },
  Jupiter: {
    mantra: { mantra: "Om Gram Grim Graum Sah Guruve Namah" },
    dana: { dana: "Donate yellow clothes, turmeric, or gold on Thursdays" },
    ratna: { ratna: "Yellow Sapphire (Pukhraj) — wear on right index finger", ratnaWarning: "Safe for most charts — Jupiter is natural benefic. Avoid if 6th/8th/12th lord." },
  },
  Venus: {
    mantra: { mantra: "Om Draam Dreem Draum Sah Shukraya Namah" },
    dana: { dana: "Donate white clothes, rice, or perfumes on Fridays" },
    ratna: { ratna: "Diamond / White Sapphire — wear on right middle finger", ratnaWarning: "Only if Venus is functional benefic. Dangerous for Taurus/Libra Ascendant with 6th/8th ownership." },
  },
  Mars: {
    mantra: { mantra: "Om Kraam Kreem Kraum Sah Bhaumaya Namah" },
    dana: { dana: "Donate red lentils, copper, or land on Tuesdays" },
    ratna: { ratna: "Red Coral (Moonga) — wear on right ring finger", ratnaWarning: "Mars is malefic for many charts. NEVER strengthen if 6th/8th/12th lord." },
  },
  Saturn: {
    mantra: { mantra: "Om Praam Preem Praum Sah Shanishcharaya Namah" },
    dana: { dana: "Donate black sesame, iron, or blankets on Saturdays" },
    ratna: { ratna: "Blue Sapphire (Neelam) — wear on right middle finger", ratnaWarning: "EXTREME CAUTION: Blue Sapphire can destroy if Saturn is malefic. Test for 3 days first." },
  },
  Sun: {
    mantra: { mantra: "Om Hraam Hreem Hraum Sah Suryaya Namah" },
    dana: { dana: "Donate wheat, copper, or red cloth on Sundays" },
    ratna: { ratna: "Ruby (Manik) — wear on right ring finger", ratnaWarning: "Only if Sun is well-placed. Avoid if 6th/8th/12th lord." },
  },
  Moon: {
    mantra: { mantra: "Om Shraam Shreem Shraum Sah Chandraya Namah" },
    dana: { dana: "Donate rice, pearls, or white cloth on Mondays" },
    ratna: { ratna: "Pearl (Moti) — wear on right little finger", ratnaWarning: "Generally safe — Moon is natural benefic." },
  },
  Rahu: {
    mantra: { mantra: "Om Bhraam Bhreem Bhraum Sah Rahave Namah" },
    dana: { dana: "Donate black blankets, sesame, or mustard oil on Saturdays" },
    ratna: { ratna: "Hessonite (Gomed) — wear on right middle finger", ratnaWarning: "Rahu is always tricky. Only wear if Rahu is well-placed in 3rd/6th/10th/11th." },
  },
};

const BODY_ZONES: Record<string, { zone: string; reason: string }> = {
  wealth: { zone: "Right forearm or chest", reason: "Zones of manifestation and expansion" },
  health: { zone: "Upper back or shoulders", reason: "Zones of burden and protection" },
  relationship: { zone: "Left arm or near heart", reason: "Zones of reception and balance" },
  career: { zone: "Right shoulder or neck", reason: "Zones of authority and visibility" },
};

const SEVERITY_COLORS = {
  low: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  high: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

// ─── Component ────────────────────────────────────────────────
export default function RemediationExplorer() {
  const [selectedCategory, setSelectedCategory] = useState(AFFLICTION_CATEGORIES[0]);
  const [selectedWeakness, setSelectedWeakness] = useState<(typeof AFFLICTION_CATEGORIES)[0]["weaknesses"][0] | null>(null);
  const [activeTab, setActiveTab] = useState<"mantra" | "dana" | "ratna">("mantra");

  const planet = selectedWeakness?.planet;
  const prescription = planet ? PRESCRIPTIONS[planet]?.[activeTab] : null;
  const bodyZone = BODY_ZONES[selectedCategory.id];

  return (
    <div className="bg-white border border-violet-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border-b border-violet-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center">
            <Shield className="w-5 h-5 text-violet-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-violet-900">Astro-Remediation Engine</h3>
            <p className="text-sm text-violet-600">Diagnostic Scan → Targeted Prescription</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Step 1: Select Category */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">Step 1: Select Life Domain</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AFFLICTION_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategory.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat); setSelectedWeakness(null); }}
                  className={`text-left px-3 py-2.5 rounded-xl border transition-all ${
                    active
                      ? `bg-${cat.color}-50 border-${cat.color}-300 shadow-sm`
                      : "bg-white border-slate-200 hover:border-violet-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${active ? `text-${cat.color}-600` : "text-slate-700"}`} />
                  <div className={`text-xs font-bold ${active ? `text-${cat.color}-800` : "text-slate-700"}`}>{cat.label}</div>
                  <div className="text-xs text-slate-700 mt-0.5">Houses: {cat.houses}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Weakness */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">Step 2: Identify the Affliction</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedCategory.weaknesses.map((w) => {
              const active = selectedWeakness?.id === w.id;
              const sev = SEVERITY_COLORS[w.severity as keyof typeof SEVERITY_COLORS];
              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedWeakness(w)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all ${
                    active
                      ? "bg-violet-50 border-violet-300 shadow-sm"
                      : `${sev.bg} ${sev.border} hover:border-violet-200`
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${w.severity === "high" ? "bg-rose-500" : w.severity === "medium" ? "bg-amber-500" : "bg-slate-600"}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold ${active ? "text-violet-800" : "text-slate-700"}`}>{w.label}</div>
                    <div className={`text-xs ${active ? "text-violet-600" : "text-slate-700"}`}>Planet: {w.planet}</div>
                  </div>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${w.severity === "high" ? "bg-rose-100 text-rose-800" : w.severity === "medium" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-800"}`}>
                    {w.severity.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Prescription */}
        <AnimatePresence>
          {selectedWeakness && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">Step 3: Prescription</span>
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-100 rounded-xl p-0.5 mb-4">
                {REMEDY_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as "mantra" | "dana" | "ratna")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold transition-all ${
                        active ? "bg-white text-violet-700 shadow-sm" : "text-slate-700"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Prescription Card */}
              <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl border border-violet-200 p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  {activeTab === "mantra" && <Volume2 className="w-4 h-4 text-violet-600" />}
                  {activeTab === "dana" && <HeartHandshake className="w-4 h-4 text-violet-600" />}
                  {activeTab === "ratna" && <Gem className="w-4 h-4 text-violet-600" />}
                  <span className="text-sm font-bold text-violet-800">
                    {activeTab === "mantra" ? "Mantra Prescription" : activeTab === "dana" ? "Charity Prescription" : "Gemstone Prescription"}
                  </span>
                </div>

                {prescription?.mantra && (
                  <div className="bg-white rounded-lg border border-violet-100 p-4 text-center">
                    <div className="text-xs text-slate-700 uppercase tracking-wide mb-1">Bija Mantra for {planet}</div>
                    <div className="text-lg font-extrabold text-violet-900 font-serif">{prescription.mantra}</div>
                    <p className="text-sm text-slate-700 mt-2">Chant 108 times daily during the planet&apos;s Hora for maximum effect.</p>
                  </div>
                )}

                {prescription?.dana && (
                  <div className="bg-white rounded-lg border border-violet-100 p-4">
                    <div className="text-xs text-slate-700 uppercase tracking-wide mb-1">Recommended Charity</div>
                    <div className="text-sm font-bold text-violet-900">{prescription.dana}</div>
                  </div>
                )}

                {prescription?.ratna && (
                  <div>
                    <div className="bg-white rounded-lg border border-violet-100 p-4 mb-3">
                      <div className="text-xs text-slate-700 uppercase tracking-wide mb-1">Recommended Gemstone</div>
                      <div className="text-sm font-bold text-violet-900">{prescription.ratna}</div>
                    </div>
                    {prescription.ratnaWarning && (
                      <div className="bg-rose-50 rounded-lg border border-rose-200 p-3 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-rose-800">Critical Warning</div>
                          <p className="text-sm text-rose-700">{prescription.ratnaWarning}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modern Protocol — Tattoo Geometry */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CircleDot className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-bold text-slate-800">Modern Protocol: Sacred Geometry</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg border border-slate-100 p-3">
                    <div className="text-xs text-slate-700 uppercase tracking-wide mb-1">Body Placement</div>
                    <div className="text-sm font-bold text-slate-800">{bodyZone.zone}</div>
                    <p className="text-sm text-slate-700 mt-1">{bodyZone.reason}</p>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-100 p-3">
                    <div className="text-xs text-slate-700 uppercase tracking-wide mb-1">Sacred Geometry</div>
                    <div className="text-sm font-bold text-slate-800">
                      {selectedCategory.id === "wealth" && "Sri Yantra / Upward Triangles"}
                      {selectedCategory.id === "health" && "Mahamrityunjaya / Hexagon"}
                      {selectedCategory.id === "relationship" && "Vesica Piscis / Intersecting Circles"}
                      {selectedCategory.id === "career" && "Sri Yantra / Crown Chakra Geometry"}
                    </div>
                    <p className="text-sm text-slate-700 mt-1">Permanent frequency anchor via sacred geometry tattoo.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedWeakness && (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
            <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-800">Select an affliction above to generate a personalized remedy protocol.</p>
          </div>
        )}

        {/* Golden Rule */}
        <div className="mt-4 bg-amber-50 rounded-lg border border-amber-200 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-amber-800">Golden Rule of Remediation</div>
              <p className="text-sm text-amber-700 mt-0.5">
                Never strengthen a functional malefic. Always run a diagnostic scan first. The remedy must match the exact affliction — generic advice is worse than no advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
