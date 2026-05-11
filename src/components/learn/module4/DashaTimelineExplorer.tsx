"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, ChevronRight, ChevronLeft, Star, Moon,
  Calculator, Layers, ArrowRight, Info, RotateCcw
} from "lucide-react";

interface DashaPlanet {
  planet: string;
  sanskrit: string;
  years: number;
  color: string;
  lightColor: string;
  nature: "Benefic" | "Malefic" | "Neutral";
  description: string;
  icon: string;
}

const PLANETS: DashaPlanet[] = [
  { planet: "Ketu", sanskrit: "केतु", years: 7, color: "#64748b", lightColor: "#e2e8f0", nature: "Malefic", description: "Spiritual detachment, sudden endings, liberation from past karma.", icon: "☋" },
  { planet: "Venus", sanskrit: "शुक्र", years: 20, color: "#ec4899", lightColor: "#fce7f3", nature: "Benefic", description: "Luxury, relationships, artistic growth, material comfort.", icon: "♀" },
  { planet: "Sun", sanskrit: "सूर्य", years: 6, color: "#f59e0b", lightColor: "#fef3c7", nature: "Malefic", description: "Authority, career recognition, ego development, government.", icon: "☉" },
  { planet: "Moon", sanskrit: "चन्द्र", years: 10, color: "#94a3b8", lightColor: "#f1f5f9", nature: "Benefic", description: "Emotional growth, mind expansion, public dealings, nourishment.", icon: "☽" },
  { planet: "Mars", sanskrit: "मङ्गल", years: 7, color: "#ef4444", lightColor: "#fee2e2", nature: "Malefic", description: "Courage, property disputes, siblings, physical energy.", icon: "♂" },
  { planet: "Rahu", sanskrit: "राहु", years: 18, color: "#7c3aed", lightColor: "#ede9fe", nature: "Malefic", description: "Obsession, foreign connections, sudden rise, illusion, technology.", icon: "☊" },
  { planet: "Jupiter", sanskrit: "गुरु", years: 16, color: "#f97316", lightColor: "#ffedd5", nature: "Benefic", description: "Wisdom, children, expansion, divine grace, teaching, wealth.", icon: "♃" },
  { planet: "Saturn", sanskrit: "शनि", years: 19, color: "#475569", lightColor: "#e2e8f0", nature: "Malefic", description: "Discipline, hard work, delay, maturity, karma repayment.", icon: "♄" },
  { planet: "Mercury", sanskrit: "बुध", years: 17, color: "#10b981", lightColor: "#d1fae5", nature: "Neutral", description: "Intellect, business, communication, education, commerce.", icon: "☿" },
];

const TOTAL_YEARS = 120;

type Tier = "mahadasha" | "antardasha" | "pratyantardasha";

interface TierInfo {
  key: Tier;
  label: string;
  sanskrit: string;
  description: string;
}

const TIERS: TierInfo[] = [
  { key: "mahadasha", label: "Mahadasha", sanskrit: "महादशा", description: "The Great Period — primary 1st-level chapter of life." },
  { key: "antardasha", label: "Antardasha", sanskrit: "अन्तर्दशा", description: "The Sub-Period — 2nd level nested within Mahadasha." },
  { key: "pratyantardasha", label: "Pratyantardasha", sanskrit: "प्रत्यन्तर्दशा", description: "The Sub-Sub-Period — 3rd level for precise timing." },
];

const NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
];

export default function DashaTimelineExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState<DashaPlanet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [tier, setTier] = useState<Tier>("mahadasha");
  const [anchorNakshatra, setAnchorNakshatra] = useState(0); // 0 = Ashwini
  const [showMath, setShowMath] = useState(false);

  // Compute cumulative years for timeline positioning
  const cumulativeYears = useMemo(() => {
    const cum: number[] = [0];
    for (let i = 0; i < PLANETS.length; i++) {
      cum.push(cum[i] + PLANETS[i].years);
    }
    return cum;
  }, []);

  // Starting planet based on Moon's Nakshatra
  const startPlanet = PLANETS.find(p => p.planet === NAKSHATRA_LORDS[anchorNakshatra]) || PLANETS[0];

  // Generate sequence starting from anchor
  const sequence = useMemo(() => {
    const startIdx = PLANETS.findIndex(p => p.planet === startPlanet.planet);
    const seq: DashaPlanet[] = [];
    for (let i = 0; i < PLANETS.length; i++) {
      seq.push(PLANETS[(startIdx + i) % PLANETS.length]);
    }
    return seq;
  }, [startPlanet]);

  // Calculate Antardashas for a given Mahadasha lord
  const getAntardashas = (mdPlanet: DashaPlanet) => {
    return sequence.map(adPlanet => {
      const years = (mdPlanet.years * adPlanet.years) / TOTAL_YEARS;
      return { planet: adPlanet, years: Number(years.toFixed(2)) };
    });
  };

  // Calculate Pratyantardashas for a given MD+AD pair
  const getPratyantardashas = (mdPlanet: DashaPlanet, adPlanet: DashaPlanet) => {
    const adYears = (mdPlanet.years * adPlanet.years) / TOTAL_YEARS;
    return sequence.map(pdPlanet => {
      const years = (adYears * pdPlanet.years) / TOTAL_YEARS;
      return { planet: pdPlanet, years: Number(years.toFixed(3)) };
    });
  };

  const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.3 } };

  return (
    <div className="w-full select-none">
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700">
            Vimshottari Dasha Explorer
          </h2>
          <p className="text-base text-amber-700 mt-2 font-semibold">
            Click through the fractal layers of the 120-year cosmic clock.
          </p>
        </div>

        {/* Tier tabs */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {TIERS.map((t, i) => (
            <button
              key={t.key}
              onClick={() => { setTier(t.key); setSelectedPlanet(null); }}
              className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border ${
                tier === t.key
                  ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20"
                  : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-700"
              }`}
            >
              <div className="flex items-center gap-1.5">
                {i === 0 && <Layers className="w-3.5 h-3.5" />}
                {i === 1 && <ChevronRight className="w-3.5 h-3.5" />}
                {i === 2 && <ArrowRight className="w-3.5 h-3.5" />}
                {t.label}
              </div>
              <div className={`text-xs font-semibold ${tier === t.key ? "text-amber-100" : "text-gray-500"}`}>
                {t.sanskrit}
              </div>
            </button>
          ))}
        </div>

        {/* Anchor Point Control */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-amber-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-800 uppercase tracking-wider">Anchor Point: Moon's Nakshatra at Birth</span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={anchorNakshatra}
              onChange={(e) => { setAnchorNakshatra(Number(e.target.value)); setSelectedPlanet(null); }}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-amber-400 cursor-pointer"
            >
              {NAKSHATRA_LORDS.map((lord, i) => {
                const names = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
                  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
                  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
                return (
                  <option key={i} value={i}>
                    {names[i] || `Nakshatra ${i + 1}`} — ruled by {lord}
                  </option>
                );
              })}
            </select>
            <div className="shrink-0 px-3 py-2 rounded-xl font-bold text-sm" style={{ background: startPlanet.lightColor, color: startPlanet.color, border: `1px solid ${startPlanet.color}30` }}>
              Starts: {startPlanet.planet}
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
            The Dasha sequence begins from the Nakshatra the Moon occupies at birth. 
            If the Moon is halfway through that Nakshatra, only the remaining balance applies.
          </p>
        </div>

        {/* Timeline bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">120-Year Timeline</span>
            <span className="text-xs text-gray-600">Birth → Age 120</span>
          </div>
          <div className="relative h-14 bg-gray-100 rounded-2xl overflow-hidden flex shadow-inner">
            {sequence.map((p, i) => {
              const widthPct = (p.years / TOTAL_YEARS) * 100;
              const isActive = selectedPlanet?.planet === p.planet;
              const isHover = hoveredPlanet === p.planet;
              return (
                <button
                  key={`${p.planet}-${i}`}
                  onClick={() => setSelectedPlanet(isActive ? null : p)}
                  onMouseEnter={() => setHoveredPlanet(p.planet)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                  className={`relative h-full flex flex-col items-center justify-center transition-all duration-300 ${isActive ? "z-10 shadow-lg scale-[1.02]" : "hover:z-10 hover:shadow-md"}`}
                  style={{ width: `${widthPct}%`, background: isActive || isHover ? p.color : `${p.color}cc` }}
                >
                  <span className="font-bold text-white text-sm">{p.planet[0]}</span>
                  {widthPct > 6 && (
                    <span className="text-xs text-white/90 font-bold">{p.years}y</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-600 font-semibold px-1 mt-1">
            <span>Birth</span>
            <span>Age 30</span>
            <span>Age 60</span>
            <span>Age 90</span>
            <span>Age 120</span>
          </div>
        </div>

        {/* Planet cards */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-5">
          {sequence.map((p) => {
            const isActive = selectedPlanet?.planet === p.planet;
            const isHover = hoveredPlanet === p.planet;
            return (
              <button
                key={p.planet}
                onClick={() => setSelectedPlanet(isActive ? null : p)}
                onMouseEnter={() => setHoveredPlanet(p.planet)}
                onMouseLeave={() => setHoveredPlanet(null)}
                className={`relative rounded-xl p-2.5 text-left transition-all duration-300 border-2 ${isActive ? "scale-105 shadow-lg -translate-y-0.5" : "hover:scale-[1.02] hover:shadow-md"}`}
                style={{ background: isActive ? p.lightColor : "#fff", borderColor: isActive || isHover ? p.color : "#f1f5f9" }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: p.color }} />
                <div className="flex items-center justify-between mb-1">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm" style={{ background: p.color }}>{p.icon}</div>
                  <span className="text-base font-extrabold" style={{ color: p.color }}>{p.years}</span>
                </div>
                <div className="text-xs font-bold text-gray-800">{p.planet}</div>
                <div className="text-xs text-gray-600 font-semibold">{p.sanskrit}</div>
              </button>
            );
          })}
        </div>

        {/* Drill-down panel */}
        <AnimatePresence mode="wait">
          {selectedPlanet && tier !== "mahadasha" && (
            <motion.div {...fadeUp} className="mb-5 p-5 rounded-2xl bg-white border border-amber-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: selectedPlanet.color }}>
                    {selectedPlanet.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      {tier === "antardasha" ? `${selectedPlanet.planet} Mahadasha → Antardashas` : `${selectedPlanet.planet} Antardasha → Pratyantardashas`}
                    </div>
                    <div className="text-xs text-gray-600 font-semibold">{tier === "antardasha" ? "Sub-periods within this Mahadasha" : "Sub-sub-periods for precise timing"}</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowMath(!showMath)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold hover:bg-amber-100 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  {showMath ? "Hide" : "Show"} Math
                </button>
              </div>

              {showMath && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60"
                >
                  <div className="text-sm text-gray-700 font-semibold">
                    {tier === "antardasha" ? (
                      <>
                        Antardasha formula: <strong className="text-amber-700">(MD years × AD years) ÷ 120</strong>
                        <br />
                        Example: {selectedPlanet.planet} MD ({selectedPlanet.years}y) × Venus AD (20y) ÷ 120 = <strong>{((selectedPlanet.years * 20) / 120).toFixed(2)} years</strong>
                      </>
                    ) : (
                      <>
                        Pratyantardasha formula: <strong className="text-amber-700">(AD years × PD years) ÷ 120</strong>
                        <br />
                        Each PD gets proportionally smaller — down to days and hours at the 5th tier (Pranadasha).
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {tier === "antardasha" ? (
                  getAntardashas(selectedPlanet).map((ad, i) => (
                    <div
                      key={ad.planet.planet}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl border transition-colors hover:shadow-sm"
                      style={{ borderColor: `${ad.planet.color}20`, background: ad.planet.lightColor }}
                    >
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: ad.planet.color }}>
                        {ad.planet.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-800">{ad.planet.planet} Antardasha</div>
                        <div className="text-xs text-gray-600 font-semibold">{ad.planet.sanskrit}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-extrabold" style={{ color: ad.planet.color }}>{ad.years}y</div>
                        <div className="text-xs text-gray-600">{Math.round(ad.years * 12)} months</div>
                      </div>
                    </div>
                  ))
                ) : (
                  (() => {
                    const adPlanet = selectedPlanet; // In this UI flow, user clicks an AD card which becomes selected
                    const mdPlanet = sequence[0]; // Simplified: assume first in sequence for demo
                    return getPratyantardashas(mdPlanet, adPlanet).map((pd) => (
                      <div
                        key={pd.planet.planet}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl border transition-colors hover:shadow-sm"
                        style={{ borderColor: `${pd.planet.color}20`, background: pd.planet.lightColor }}
                      >
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: pd.planet.color }}>
                          {pd.planet.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-gray-800">{pd.planet.planet} Pratyantardasha</div>
                          <div className="text-[10px] text-gray-500">{pd.planet.sanskrit}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-extrabold" style={{ color: pd.planet.color }}>{pd.years}y</div>
                          <div className="text-[9px] text-gray-400">{Math.round(pd.years * 365)} days</div>
                        </div>
                      </div>
                    ));
                  })()
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected planet detail */}
        <AnimatePresence>
          {selectedPlanet && (
            <motion.div {...fadeUp} className="p-5 rounded-2xl border shadow-sm" style={{ background: selectedPlanet.lightColor, borderColor: `${selectedPlanet.color}30` }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0" style={{ background: selectedPlanet.color }}>
                  {selectedPlanet.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-extrabold text-gray-900">{selectedPlanet.planet} {tier === "mahadasha" ? "Mahadasha" : tier === "antardasha" ? "Antardasha" : "Pratyantardasha"}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: selectedPlanet.color + "15", color: selectedPlanet.color }}>
                      {selectedPlanet.nature}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-semibold mb-2">{selectedPlanet.sanskrit} · {selectedPlanet.years} Years</p>
                  <p className="text-base text-gray-800 leading-relaxed">{selectedPlanet.description}</p>
                  {tier === "mahadasha" && (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => setTier("antardasha")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-amber-200 text-amber-800 text-sm font-bold hover:bg-amber-50 transition-colors shadow-sm"
                      >
                        Drill into Antardashas <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Total cycle bar */}
        <div className="mt-5 flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-gray-700">Total Vimshottari Cycle</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5">
              {PLANETS.map(p => (
                <div key={p.planet} className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold border-2 border-white" style={{ background: p.color }}>
                  {p.planet[0]}
                </div>
              ))}
            </div>
            <span className="text-xl font-extrabold text-amber-600">{TOTAL_YEARS} Years</span>
          </div>
        </div>

        {/* Senior astrologer note */}
        <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <Star className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-900 leading-relaxed">
            <strong>Professional Note:</strong> When a client asks "When will I get married?", 
            first identify the Dasha lords connected to the 7th house. Then check if the current 
            Antardasha lord also connects. This narrows a 16-year Jupiter Mahadasha down to a 
            2-year Venus Antardasha — and further down to the exact month via Pratyantardasha.
          </p>
        </div>
      </div>
    </div>
  );
}
