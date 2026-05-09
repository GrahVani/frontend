"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarClock, Filter, ShieldAlert, ShieldCheck, Star,
  Clock, ChevronRight, RotateCcw, Sparkles, Lock, Unlock,
  Sun, Moon, Home, CheckCircle2, XCircle, ArrowRight,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────
const EVENT_TYPES = [
  { id: "business", label: "Business Launch", icon: Sparkles, paksha: "shukla", nakshatraNature: "fixed", ascendantNeed: "earth" },
  { id: "wedding", label: "Wedding / Marriage", icon: Star, paksha: "shukla", nakshatraNature: "fixed", ascendantNeed: "benefic" },
  { id: "travel", label: "Travel / Vehicle", icon: ChevronRight, paksha: "any", nakshatraNature: "movable", ascendantNeed: "any" },
  { id: "surgery", label: "Surgery", icon: ShieldCheck, paksha: "krishna", nakshatraNature: "fierce", ascendantNeed: "clear8" },
  { id: "demolition", label: "Demolition", icon: ShieldAlert, paksha: "krishna", nakshatraNature: "fierce", ascendantNeed: "clear8" },
  { id: "foundation", label: "Lay Foundation", icon: Home, paksha: "shukla", nakshatraNature: "fixed", ascendantNeed: "earth" },
];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const RAHU_KAALAM: Record<string, [number, number]> = {
  Sunday: [16.5, 18.0], Monday: [7.5, 9.0], Tuesday: [15.0, 16.5],
  Wednesday: [12.0, 13.5], Thursday: [13.5, 15.0], Friday: [10.5, 12.0], Saturday: [9.0, 10.5],
};

const YAMAGANDAM: Record<string, [number, number]> = {
  Sunday: [12.0, 13.5], Monday: [10.5, 12.0], Tuesday: [9.0, 10.5],
  Wednesday: [7.5, 9.0], Thursday: [6.0, 7.5], Friday: [15.0, 16.5], Saturday: [13.5, 15.0],
};

const NAKSHATRAS = [
  { name: "Ashwini", nature: "movable", lord: "Ketu" },
  { name: "Bharani", nature: "fierce", lord: "Venus" },
  { name: "Krittika", nature: "fixed", lord: "Sun" },
  { name: "Rohini", nature: "fixed", lord: "Moon" },
  { name: "Mrigashira", nature: "movable", lord: "Mars" },
  { name: "Ardra", nature: "fierce", lord: "Rahu" },
  { name: "Punarvasu", nature: "movable", lord: "Jupiter" },
  { name: "Pushya", nature: "fixed", lord: "Saturn" },
  { name: "Ashlesha", nature: "fierce", lord: "Mercury" },
  { name: "Magha", nature: "fierce", lord: "Ketu" },
  { name: "Purva Phalguni", nature: "fixed", lord: "Venus" },
  { name: "Uttara Phalguni", nature: "fixed", lord: "Sun" },
  { name: "Hasta", nature: "movable", lord: "Moon" },
  { name: "Chitra", nature: "movable", lord: "Mars" },
  { name: "Swati", nature: "movable", lord: "Rahu" },
  { name: "Vishakha", nature: "mixed", lord: "Jupiter" },
  { name: "Anuradha", nature: "fixed", lord: "Saturn" },
  { name: "Jyeshtha", nature: "fierce", lord: "Mercury" },
  { name: "Mula", nature: "fierce", lord: "Ketu" },
  { name: "Purva Ashadha", nature: "movable", lord: "Venus" },
  { name: "Uttara Ashadha", nature: "fixed", lord: "Sun" },
  { name: "Shravana", nature: "movable", lord: "Moon" },
  { name: "Dhanishta", nature: "movable", lord: "Mars" },
  { name: "Shatabhisha", nature: "fierce", lord: "Rahu" },
  { name: "Purva Bhadrapada", nature: "fierce", lord: "Jupiter" },
  { name: "Uttara Bhadrapada", nature: "fixed", lord: "Saturn" },
  { name: "Revati", nature: "movable", lord: "Mercury" },
];

const NAKSHATRA_BY_DAY: Record<string, string[]> = {
  Sunday: ["Hasta", "Chitra", "Swati", "Vishakha"],
  Monday: ["Anuradha", "Jyeshtha", "Mula", "Purva Ashadha"],
  Tuesday: ["Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha"],
  Wednesday: ["Purva Bhadrapada", "Uttara Bhadrapada", "Revati", "Ashwini"],
  Thursday: ["Bharani", "Krittika", "Rohini", "Mrigashira"],
  Friday: ["Ardra", "Punarvasu", "Pushya", "Ashlesha"],
  Saturday: ["Magha", "Purva Phalguni", "Uttara Phalguni", "Bharani"],
};

const TITHIS = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"];
const KRISHNA_TITHIS = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"];

const COLORS = {
  violet: { light: "#f3e8ff", DEFAULT: "#8b5cf6", dark: "#5b21b6", text: "#5b21b6" },
  rose: { light: "#ffe4e6", DEFAULT: "#f43f5e", dark: "#9f1239", text: "#9f1239" },
  emerald: { light: "#d1fae5", DEFAULT: "#10b981", dark: "#065f46", text: "#065f46" },
  amber: { light: "#fef3c7", DEFAULT: "#f59e0b", dark: "#92400e", text: "#92400e" },
  slate: { light: "#f1f5f9", DEFAULT: "#64748b", dark: "#1e293b", text: "#334155" },
};

// ─── Helpers ──────────────────────────────────────────────────
function isBlocked(day: string, hour: number): boolean {
  const rk = RAHU_KAALAM[day];
  const yg = YAMAGANDAM[day];
  if (rk && hour >= rk[0] && hour < rk[1]) return true;
  if (yg && hour >= yg[0] && hour < yg[1]) return true;
  return false;
}

function getDayNakshatras(day: string, eventType: (typeof EVENT_TYPES)[0]) {
  const names = NAKSHATRA_BY_DAY[day];
  return names.map((n) => {
    const nk = NAKSHATRAS.find((x) => x.name === n)!;
    const matches = eventType.nakshatraNature === "any" || nk.nature === eventType.nakshatraNature || (eventType.nakshatraNature === "fixed" && nk.nature === "mixed");
    return { ...nk, matches };
  });
}

// ─── Component ────────────────────────────────────────────────
export default function MuhurthaFilterExplorer() {
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [selectedDay, setSelectedDay] = useState("Thursday");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const rk = RAHU_KAALAM[selectedDay];
  const yg = YAMAGANDAM[selectedDay];

  const hours = useMemo(() => {
    const h = [];
    for (let i = 6; i <= 20; i++) h.push(i);
    return h;
  }, []);

  const dayNakshatras = useMemo(() => getDayNakshatras(selectedDay, eventType), [selectedDay, eventType]);
  const matchingNakshatra = dayNakshatras.find((n) => n.matches);

  const tithiList = eventType.paksha === "krishna" ? KRISHNA_TITHIS : TITHIS;
  const tithiMatch = eventType.paksha === "shukla" ? true : eventType.paksha === "krishna" ? false : true;

  return (
    <div className="bg-white border border-violet-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border-b border-violet-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center">
            <CalendarClock className="w-5 h-5 text-violet-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-violet-900">Muhurtha 3-Filter Algorithm</h3>
            <p className="text-sm text-violet-600">Interactive Electional Astrology Engine</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 border-b border-violet-100">
        <label className="text-xs font-bold text-violet-700 uppercase tracking-wide mb-2 block">Select Event Type</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {EVENT_TYPES.map((et) => {
            const Icon = et.icon;
            const active = eventType.id === et.id;
            return (
              <button
                key={et.id}
                onClick={() => { setEventType(et); setStep(1); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                  active
                    ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                    : "bg-white text-slate-800 border-slate-200 hover:border-violet-300 hover:text-violet-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {et.label}
              </button>
            );
          })}
        </div>

        <label className="text-xs font-bold text-violet-700 uppercase tracking-wide mb-2 block">Select Day of Week</label>
        <div className="flex flex-wrap gap-1.5">
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => { setSelectedDay(d); setStep(1); }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                selectedDay === d
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-slate-800 border-slate-200 hover:border-violet-300"
              }`}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Algorithm Steps */}
      <div className="px-6 py-5">
        {/* Step Navigation */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s as 1 | 2 | 3 | 4)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border transition-all ${
                step === s
                  ? "bg-violet-600 text-white border-violet-600"
                  : step > s
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              {step > s ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Filter className="w-3.5 h-3.5" />}
              {s === 1 ? "Blocklist" : s === 2 ? "Allowlist" : s === 3 ? "Ascendant" : "Result"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h4 className="font-bold text-rose-800">Filter 1: The Blocklist</h4>
                <span className="ml-auto text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">Eliminate Toxicity</span>
              </div>
              <p className="text-sm text-slate-800 mb-4">All times falling within Rahu Kaalam or Yamagandam are automatically blocked for positive events.</p>

              {/* Rahu/Yama bars */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-800 w-24">Rahu Kaalam</span>
                  <div className="flex-1 h-8 bg-slate-100 rounded-lg relative overflow-hidden">
                    {rk && (
                      <div
                        className="absolute top-0 h-full bg-rose-400/70 border-x border-rose-500 flex items-center justify-center"
                        style={{ left: `${((rk[0] - 6) / 14) * 100}%`, width: `${((rk[1] - rk[0]) / 14) * 100}%` }}
                      >
                        <span className="text-[10px] font-bold text-white whitespace-nowrap">{rk[0]}:00–{rk[1]}:00</span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                      <span className="text-[9px] text-slate-700">6:00</span>
                      <span className="text-[9px] text-slate-700">20:00</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-800 w-24">Yamagandam</span>
                  <div className="flex-1 h-8 bg-slate-100 rounded-lg relative overflow-hidden">
                    {yg && (
                      <div
                        className="absolute top-0 h-full bg-amber-400/70 border-x border-amber-500 flex items-center justify-center"
                        style={{ left: `${((yg[0] - 6) / 14) * 100}%`, width: `${((yg[1] - yg[0]) / 14) * 100}%` }}
                      >
                        <span className="text-[10px] font-bold text-white whitespace-nowrap">{yg[0]}:00–{yg[1]}:00</span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                      <span className="text-[9px] text-slate-700">6:00</span>
                      <span className="text-[9px] text-slate-700">20:00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hour grid */}
              <div className="grid grid-cols-8 gap-1.5">
                {hours.map((h) => {
                  const blocked = isBlocked(selectedDay, h);
                  return (
                    <div
                      key={h}
                      className={`text-center py-1.5 rounded-md text-xs font-semibold border transition-all ${
                        blocked
                          ? "bg-rose-50 text-rose-700 border-rose-200 line-through opacity-60"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {h}:00
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-slate-800">
                <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-rose-500" /> Blocked (~43% of day)</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Available (~57% of day)</span>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-emerald-800">Filter 2: The Allowlist</h4>
                <span className="ml-auto text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Match Frequency</span>
              </div>

              {/* Tithi check */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {eventType.paksha === "shukla" ? <Sun className="w-4 h-4 text-amber-500" /> : eventType.paksha === "krishna" ? <Moon className="w-4 h-4 text-indigo-500" /> : <Star className="w-4 h-4 text-violet-500" />}
                  <span className="text-sm font-bold text-slate-800">Lunar Phase Check</span>
                </div>
                <p className="text-sm text-slate-800 mb-3">
                  Event type <strong>{eventType.label}</strong> requires{" "}
                  <span className={`font-bold ${eventType.paksha === "shukla" ? "text-amber-700" : eventType.paksha === "krishna" ? "text-indigo-700" : "text-violet-700"}`}>
                    {eventType.paksha === "shukla" ? "Shukla Paksha (Waxing Moon)" : eventType.paksha === "krishna" ? "Krishna Paksha (Waning Moon)" : "Any Paksha"}
                  </span>
                </p>
                <div className="flex gap-1 flex-wrap">
                  {tithiList.slice(0, 8).map((t, i) => (
                    <span
                      key={t}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        tithiMatch
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-indigo-50 text-indigo-700 border-indigo-200"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nakshatra check */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-bold text-slate-800">Nakshatra Nature Check</span>
                </div>
                <p className="text-sm text-slate-800 mb-3">
                  Looking for <strong className="text-violet-700 capitalize">{eventType.nakshatraNature}</strong> Nakshatras on <strong>{selectedDay}</strong>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {dayNakshatras.map((n) => (
                    <div
                      key={n.name}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
                        n.matches
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-rose-50 border-rose-200 text-rose-800 opacity-60"
                      }`}
                    >
                      {n.matches ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                      <span className="font-semibold">{n.name}</span>
                      <span className="ml-auto text-[10px] opacity-70 capitalize">{n.nature}</span>
                    </div>
                  ))}
                </div>
                {matchingNakshatra && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-100/50 px-3 py-2 rounded-lg border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    Best match: <strong>{matchingNakshatra.name}</strong> ({matchingNakshatra.lord})
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-violet-600" />
                <h4 className="font-bold text-violet-800">Filter 3: The Ascendant Lock</h4>
                <span className="ml-auto text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">Minute-Level</span>
              </div>
              <p className="text-sm text-slate-800 mb-4">Once a day and hour pass Filters 1 &amp; 2, refine to the exact minute. The 8th house must be clear of malefics.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Unlock className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-800">8th House Check</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-emerald-700 font-medium">CLEAR — No malefics</span>
                  </div>
                  <p className="text-xs text-emerald-600">Rahu, Saturn, Mars all avoid the 8th in this window. Longevity protected.</p>
                </div>
                <div className="bg-violet-50 rounded-xl border border-violet-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-violet-600" />
                    <span className="text-sm font-bold text-violet-800">Benefic Aspect</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-violet-500" />
                    <span className="text-sm text-violet-700 font-medium">Jupiter aspects Ascendant</span>
                  </div>
                  <p className="text-xs text-violet-600">Jupiter (5th aspect) on Lagna brings wisdom, growth, and protection to the event.</p>
                </div>
              </div>

              {/* Lagna wheel mini */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <span className="text-xs font-bold text-slate-800 mb-3 block">Muhurtha Lagna Snapshot</span>
                <div className="flex items-center justify-center gap-6">
                  <div className="relative w-28 h-28">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
                        const angle = (i * 30 - 90) * (Math.PI / 180);
                        const x1 = 50 + 30 * Math.cos(angle);
                        const y1 = 50 + 30 * Math.sin(angle);
                        const x2 = 50 + 46 * Math.cos(angle);
                        const y2 = 50 + 46 * Math.sin(angle);
                        const tx = 50 + 38 * Math.cos(angle);
                        const ty = 50 + 38 * Math.sin(angle);
                        return (
                          <g key={i}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="1" />
                            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central" fontSize="5" fill="#334155">H{i + 1}</text>
                          </g>
                        );
                      })}
                      <circle cx="50" cy="50" r="28" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                      <circle cx="50" cy="50" r="8" fill="#8b5cf6" opacity="0.2" />
                      <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fontSize="5" fill="#5b21b6" fontWeight="bold">Asc</text>
                      {/* Jupiter aspect line */}
                      <line x1="50" y1="50" x2="85" y2="35" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
                      <circle cx="85" cy="35" r="3" fill="#10b981" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-slate-800">Lagna: <strong className="text-violet-700">Taurus</strong> (Earth)</div>
                    <div className="text-xs text-slate-800">8th House: <strong className="text-emerald-600">Clear</strong></div>
                    <div className="text-xs text-slate-800">Jupiter: <strong className="text-emerald-600">Aspecting</strong></div>
                    <div className="text-xs text-slate-800">Moon: <strong className="text-amber-600">Waxing</strong></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-amber-800">Final Output: The Auspicious Window</h4>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300 p-5 text-center mb-4">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">Recommended Muhurtha</div>
                <div className="text-2xl font-extrabold text-amber-900 mb-1">
                  {selectedDay}, 10:15 AM – 11:00 AM
                </div>
                <div className="text-sm text-amber-700 font-medium">
                  {matchingNakshatra?.name} Nakshatra · {eventType.paksha === "shukla" ? "Shukla Paksha" : "Krishna Paksha"} · Taurus Ascendant
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <div className="text-xs font-bold text-emerald-800">Filter 1</div>
                  <div className="text-[10px] text-emerald-600">No Rahu/Yama</div>
                </div>
                <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <div className="text-xs font-bold text-emerald-800">Filter 2</div>
                  <div className="text-[10px] text-emerald-600">Nakshatra Match</div>
                </div>
                <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <div className="text-xs font-bold text-emerald-800">Filter 3</div>
                  <div className="text-[10px] text-emerald-600">8th Clear</div>
                </div>
              </div>

              <div className="bg-violet-50 rounded-lg border border-violet-200 p-3">
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-violet-800">Astrologer Note</div>
                    <p className="text-xs text-violet-700 mt-0.5">
                      This 45-minute window clears all three filters for <strong>{eventType.label}</strong>. The Jupiter aspect on the Ascendant ensures growth, while the empty 8th house guarantees longevity of the venture.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s))}
            disabled={step === 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-800 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowRight className="w-3 h-3 rotate-180" /> Previous
          </button>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`w-2 h-2 rounded-full ${step === s ? "bg-violet-600" : step > s ? "bg-emerald-400" : "bg-slate-200"}`} />
            ))}
          </div>
          <button
            onClick={() => setStep((s) => (s < 4 ? ((s + 1) as 1 | 2 | 3 | 4) : s))}
            disabled={step === 4}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
