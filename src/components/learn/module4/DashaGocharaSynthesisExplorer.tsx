"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitMerge, Target, Clock, Orbit, Zap, CheckCircle2, XCircle,
  ArrowRight, Star, AlertTriangle, Sparkles, ChevronRight, Info
} from "lucide-react";

interface LifeDomain {
  id: string;
  name: string;
  house: number;
  lord: string;
  lordSign: number;
  icon: string;
}

const DOMAINS: LifeDomain[] = [
  { id: "career", name: "Career & Status", house: 10, lord: "Mercury", lordSign: 6, icon: "💼" },
  { id: "marriage", name: "Marriage & Partnership", house: 7, lord: "Jupiter", lordSign: 9, icon: "💍" },
  { id: "wealth", name: "Wealth & Assets", house: 2, lord: "Venus", lordSign: 4, icon: "💰" },
  { id: "children", name: "Children & Creativity", house: 5, lord: "Mars", lordSign: 11, icon: "👶" },
  { id: "health", name: "Health & Vitality", house: 1, lord: "Saturn", lordSign: 1, icon: "❤️" },
];

const DASHA_PRESETS = [
  { md: "Jupiter", mdYears: 16, ad: "Venus", adYears: 20, houses: [10, 11], label: "Jupiter-Venus: Career Expansion" },
  { md: "Saturn", mdYears: 19, ad: "Saturn", adYears: 19, houses: [12, 8], label: "Saturn-Saturn: Karmic Restructuring" },
  { md: "Venus", mdYears: 20, ad: "Jupiter", adYears: 16, houses: [7, 2], label: "Venus-Jupiter: Marriage & Wealth" },
  { md: "Rahu", mdYears: 18, ad: "Saturn", adYears: 19, houses: [6, 12], label: "Rahu-Saturn: Obstacles & Loss" },
];

const GOCHARA_PRESETS = [
  { jupiter: 11, saturn: 5, label: "Jupiter in 11th, Saturn in 5th" },
  { jupiter: 5, saturn: 10, label: "Jupiter in 5th, Saturn in 10th" },
  { jupiter: 1, saturn: 7, label: "Jupiter in 1st, Saturn in 7th" },
  { jupiter: 9, saturn: 3, label: "Jupiter in 9th, Saturn in 3rd" },
];

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export default function DashaGocharaSynthesisExplorer() {
  const [selectedDomain, setSelectedDomain] = useState<LifeDomain>(DOMAINS[0]);
  const [dashaPreset, setDashaPreset] = useState(0);
  const [gocharaPreset, setGocharaPreset] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const dp = DASHA_PRESETS[dashaPreset];
  const gp = GOCHARA_PRESETS[gocharaPreset];

  // Step 2: Dasha Promise — do MD/AD lords connect to target house?
  const dashaConnectsHouse = dp.houses.includes(selectedDomain.house);
  const dashaConnectsLord = dp.houses.includes(selectedDomain.lordSign);
  const dashaPromise = dashaConnectsHouse || dashaConnectsLord;

  // Step 3: Gochara Trigger — Jupiter 5/7/9, Saturn 3/7/10 aspects
  const jupiterAspects = [((gp.jupiter + 4) % 12) + 1, ((gp.jupiter + 6) % 12) + 1, ((gp.jupiter + 8) % 12) + 1];
  const saturnAspects = [((gp.saturn + 2) % 12) + 1, ((gp.saturn + 6) % 12) + 1, ((gp.saturn + 9) % 12) + 1];

  const jupiterHits = jupiterAspects.includes(selectedDomain.house) || jupiterAspects.includes(selectedDomain.lordSign);
  const saturnHits = saturnAspects.includes(selectedDomain.house) || saturnAspects.includes(selectedDomain.lordSign);
  const gocharaTrigger = jupiterHits && saturnHits;

  // Step 4: Fast transit catalyst (simplified: always "possible" if steps 2+3 pass)
  const fastTransit = dashaPromise && gocharaTrigger;

  // Final prediction
  const allPass = dashaPromise && gocharaTrigger && fastTransit;

  const steps = [
    {
      num: 1,
      title: "Define Query Target",
      icon: <Target className="w-4 h-4" />,
      color: "#0ea5e9",
      result: `${selectedDomain.name} (House ${selectedDomain.house})`,
      pass: true,
      detail: `The user is asking about ${selectedDomain.name.toLowerCase()}. We target House ${selectedDomain.house} and its lord ${selectedDomain.lord} (in House ${selectedDomain.lordSign}).`,
    },
    {
      num: 2,
      title: "Dasha Promise",
      icon: <Clock className="w-4 h-4" />,
      color: "#f59e0b",
      result: dashaPromise ? "SEASON ACTIVE ✓" : "SEASON INACTIVE ✗",
      pass: dashaPromise,
      detail: dashaPromise
        ? `Current ${dp.md} Mahadasha / ${dp.ad} Antardasha connects to House ${selectedDomain.house} or its lord. The cosmic environment supports this event.`
        : `Current ${dp.md}-${dp.ad} period is disconnected from House ${selectedDomain.house}. The Dasha does not promise this event — transits cannot override it.`,
    },
    {
      num: 3,
      title: "Gochara Trigger",
      icon: <Orbit className="w-4 h-4" />,
      color: "#8b5cf6",
      result: gocharaTrigger ? "DOUBLE TRANSIT ✓" : "NO TRIGGER ✗",
      pass: gocharaTrigger,
      detail: gocharaTrigger
        ? `Jupiter (H${gp.jupiter}) aspects H${jupiterAspects.join(", ")}. Saturn (H${gp.saturn}) aspects H${saturnAspects.join(", ")}. Both hit the target — the crosshair is active!`
        : `Jupiter aspects H${jupiterAspects.join(", ")}. Saturn aspects H${saturnAspects.join(", ")}. They do not both converge on the target. Event stays potential.`,
    },
    {
      num: 4,
      title: "Fast Transit Catalyst",
      icon: <Zap className="w-4 h-4" />,
      color: "#10b981",
      result: fastTransit ? "CATALYST READY ✓" : "WAITING ✗",
      pass: fastTransit,
      detail: fastTransit
        ? "With Dasha Promise AND Double Transit active, a fast-moving planet (Sun/Mars/Moon) transiting the target house will trigger the exact day."
        : "Fast transits cannot fire an event when the macro conditions (Dasha + Gochara) are not aligned. This prevents false positives.",
    },
  ];

  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <div className="w-full max-w-[780px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-violet-50/20 to-purple-50/10 border border-violet-200/50 shadow-2xl shadow-violet-900/5 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-purple-700">
            Dasha + Gochara Synthesis Engine
          </h2>
          <p className="text-sm text-violet-500/80 mt-2 font-medium">
            The ultimate predictive algorithm: Promise + Trigger = Manifestation.
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {/* Domain selector */}
          <div className="p-3 rounded-2xl bg-white border border-violet-100 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Target className="w-3.5 h-3.5 text-violet-600" />
              <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider">Target</span>
            </div>
            <select
              value={selectedDomain.id}
              onChange={(e) => setSelectedDomain(DOMAINS.find(d => d.id === e.target.value) || DOMAINS[0])}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm font-bold text-gray-700 outline-none focus:border-violet-400 cursor-pointer"
            >
              {DOMAINS.map(d => (
                <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
              ))}
            </select>
            <div className="text-[10px] text-gray-400 mt-1">House {selectedDomain.house} · Lord: {selectedDomain.lord}</div>
          </div>

          {/* Dasha preset */}
          <div className="p-3 rounded-2xl bg-white border border-amber-100 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Dasha Period</span>
            </div>
            <select
              value={dashaPreset}
              onChange={(e) => setDashaPreset(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm font-bold text-gray-700 outline-none focus:border-amber-400 cursor-pointer"
            >
              {DASHA_PRESETS.map((d, i) => (
                <option key={i} value={i}>{d.md}-{d.ad}</option>
              ))}
            </select>
            <div className="text-[10px] text-gray-400 mt-1">{dp.label}</div>
          </div>

          {/* Gochara preset */}
          <div className="p-3 rounded-2xl bg-white border border-sky-100 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Orbit className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">Gochara</span>
            </div>
            <select
              value={gocharaPreset}
              onChange={(e) => setGocharaPreset(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm font-bold text-gray-700 outline-none focus:border-sky-400 cursor-pointer"
            >
              {GOCHARA_PRESETS.map((g, i) => (
                <option key={i} value={i}>{g.label}</option>
              ))}
            </select>
            <div className="text-[10px] text-gray-400 mt-1">Jupiter H{gp.jupiter} · Saturn H{gp.saturn}</div>
          </div>
        </div>

        {/* Algorithm steps */}
        <div className="space-y-2.5 mb-5">
          {steps.map((step, i) => {
            const isOpen = currentStep === step.num;
            const isPast = currentStep > step.num;
            return (
              <motion.div
                key={step.num}
                initial={false}
                animate={{ scale: isOpen ? 1.01 : 1 }}
                className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "shadow-md"
                    : isPast
                    ? step.pass
                      ? "border-green-200 bg-green-50/30"
                      : "border-red-200 bg-red-50/30"
                    : "border-gray-100 bg-white"
                }`}
                style={isOpen ? { borderColor: `${step.color}40`, background: `${step.color}06` } : {}}
              >
                <button
                  onClick={() => setCurrentStep(isOpen ? 0 : step.num)}
                  className="w-full flex items-center gap-3 p-3.5 text-left"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm"
                    style={{ background: isPast ? (step.pass ? "#22c55e" : "#ef4444") : step.color }}
                  >
                    {isPast ? (step.pass ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />) : step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">Step {step.num}: {step.title}</span>
                      {isPast && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${step.pass ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {step.pass ? "PASS" : "FAIL"}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium truncate">{step.result}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3.5 pb-3.5 pt-0">
                        <div className="pl-11">
                          <p className="text-xs text-gray-600 leading-relaxed mb-2">{step.detail}</p>

                          {step.num === 2 && (
                            <div className="flex flex-wrap gap-1.5">
                              {dp.houses.map(h => (
                                <span
                                  key={h}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    h === selectedDomain.house || h === selectedDomain.lordSign
                                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  House {h} {h === selectedDomain.house ? "(TARGET)" : h === selectedDomain.lordSign ? "(LORD)" : ""}
                                </span>
                              ))}
                            </div>
                          )}

                          {step.num === 3 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-orange-600 w-16">Jupiter</span>
                                <div className="flex gap-1">
                                  {jupiterAspects.map(h => (
                                    <span key={h} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${h === selectedDomain.house || h === selectedDomain.lordSign ? "bg-orange-100 text-orange-700 border border-orange-200" : "bg-gray-100 text-gray-500"}`}>
                                      H{h}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-600 w-16">Saturn</span>
                                <div className="flex gap-1">
                                  {saturnAspects.map(h => (
                                    <span key={h} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${h === selectedDomain.house || h === selectedDomain.lordSign ? "bg-slate-200 text-slate-700 border border-slate-300" : "bg-gray-100 text-gray-500"}`}>
                                      H{h}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Final Prediction Card */}
        <motion.div
          layout
          className={`p-5 rounded-2xl border-2 text-center transition-all duration-500 ${
            allPass
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg shadow-green-900/5"
              : "bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {allPass ? (
              <>
                <Sparkles className="w-5 h-5 text-green-500" />
                <span className="text-lg font-extrabold text-green-700">EVENT WILL MANIFEST</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-lg font-extrabold text-red-700">EVENT BLOCKED</span>
              </>
            )}
          </div>

          <p className="text-sm text-gray-700 leading-relaxed max-w-md mx-auto">
            {allPass
              ? `All three gates are OPEN. The ${selectedDomain.name.toLowerCase()} event has the Dasha promise, the Double Transit trigger, and the fast transit catalyst. The window is active.`
              : !dashaPromise
              ? `The Dasha season does not support ${selectedDomain.name.toLowerCase()}. Even if transits look promising, the macro-environment blocks manifestation. A snowstorm cannot happen in Summer.`
              : !gocharaTrigger
              ? `The Dasha creates the right season for ${selectedDomain.name.toLowerCase()}, but Jupiter and Saturn have not both turned their keys. The event remains potential — waiting for the crosshair.`
              : `Something is blocking the final catalyst. Check fast transits for the exact timing window.`
            }
          </p>

          {/* Gate indicators */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {steps.slice(1).map((step) => (
              <div key={step.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    step.pass ? "bg-green-500" : "bg-red-400"
                  }`}
                >
                  {step.pass ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <div className="text-[9px] font-bold text-gray-500 hidden sm:block">{step.title.split(" ")[0]}</div>
                {step.num < 4 && <ArrowRight className="w-3 h-3 text-gray-300" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Formula bar */}
        <div className="mt-5 bg-gradient-to-r from-amber-100 via-violet-100 to-emerald-100 rounded-xl p-4 text-center border border-gray-100">
          <div className="flex items-center justify-center gap-2 text-sm font-bold flex-wrap">
            <span className="px-3 py-1 rounded-lg bg-amber-500 text-white text-xs">Dasha Promise</span>
            <span className="text-gray-400">+</span>
            <span className="px-3 py-1 rounded-lg bg-violet-500 text-white text-xs">Gochara Trigger</span>
            <span className="text-gray-400">+</span>
            <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs">Fast Catalyst</span>
            <span className="text-gray-400">=</span>
            <span className={`px-3 py-1 rounded-lg text-white text-xs ${allPass ? "bg-green-500" : "bg-red-400"}`}>
              {allPass ? "Manifestation" : "Blocked"}
            </span>
          </div>
        </div>

        {/* Senior astrologer note */}
        <div className="mt-4 flex items-start gap-3 p-4 rounded-2xl bg-violet-50/60 border border-violet-200/40">
          <Info className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
          <p className="text-xs text-violet-800/80 leading-relaxed">
            <strong>Professional Note:</strong> The greatest value your software provides is filtering false positives. 
            A user sees Jupiter transiting their 2nd House of Wealth and gets excited — but if they're running a 
            Rahu-Saturn period connected to the 12th House of Loss, the software must warn: 
            <em> "This transit prevents total bankruptcy, but will not create a windfall."</em> 
            The Dasha is the ceiling; Gochara can only work within that ceiling.
          </p>
        </div>
      </div>
    </div>
  );
}
