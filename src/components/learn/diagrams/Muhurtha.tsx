"use client";

import React, { useState } from "react";
import { Clock, AlertTriangle, CheckCircle, Moon, Sun } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Rahu Kaalam (1.5h) and Yamagandam (1.5h) per day of week
// Format: [start_hour, start_minute, duration_minutes]
const RAHU_KAALAM: [number, number, number][] = [
  [16, 30, 90],  // Sunday: 4:30 PM - 6:00 PM
  [7, 30, 90],   // Monday: 7:30 AM - 9:00 AM
  [15, 0, 90],   // Tuesday: 3:00 PM - 4:30 PM
  [12, 0, 90],   // Wednesday: 12:00 PM - 1:30 PM
  [13, 30, 90],  // Thursday: 1:30 PM - 3:00 PM
  [10, 30, 90],  // Friday: 10:30 AM - 12:00 PM
  [9, 0, 90],    // Saturday: 9:00 AM - 10:30 AM
];

const YAMAGANDAM: [number, number, number][] = [
  [12, 0, 90],   // Sunday
  [10, 30, 90],  // Monday
  [9, 0, 90],    // Tuesday
  [7, 30, 90],   // Wednesday
  [6, 0, 90],    // Thursday
  [15, 0, 90],   // Friday
  [13, 30, 90],  // Saturday
];

// 30 Muhurthas × 48 min each = 24 hours
// Good Muhurthas (names from classical texts)
const MUHURTHAS = [
  { name: "Rudra", quality: "bad" }, { name: "Ahi", quality: "bad" }, { name: "Mitra", quality: "good" },
  { name: "Pitri", quality: "bad" }, { name: "Vasu", quality: "good" }, { name: "Varaha", quality: "good" },
  { name: "Vishvedeva", quality: "good" }, { name: "Vidhi", quality: "good" }, { name: "Sathamukhi", quality: "good" },
  { name: "Puruhuta", quality: "good" }, { name: "Vahini", quality: "bad" }, { name: "Naktanchara", quality: "bad" },
  { name: "Varuna", quality: "good" }, { name: "Aryaman", quality: "good" }, { name: "Bhaga", quality: "good" },
  { name: "Girisha", quality: "bad" }, { name: "Ajapada", quality: "bad" }, { name: "Ahir-Budhnya", quality: "good" },
  { name: "Pushya", quality: "good" }, { name: "Ashvini", quality: "good" }, { name: "Yama", quality: "bad" },
  { name: "Agni", quality: "good" }, { name: "Vidhatri", quality: "good" }, { name: "Kanda", quality: "good" },
  { name: "Aditi", quality: "good" }, { name: "Jiva/Amrita", quality: "good" }, { name: "Vishnu", quality: "good" },
  { name: "Dyumani", quality: "good" }, { name: "Brahma", quality: "excellent" }, { name: "Samudram", quality: "bad" },
];

const TITHIS = [
  { name: "Pratipada", paksha: "waxing", type: "fixed" }, { name: "Dwitiya", paksha: "waxing", type: "fixed" },
  { name: "Tritiya", paksha: "waxing", type: "fixed" }, { name: "Chaturthi", paksha: "waxing", type: "bad" },
  { name: "Panchami", paksha: "waxing", type: "fixed" }, { name: "Shashthi", paksha: "waxing", type: "fixed" },
  { name: "Saptami", paksha: "waxing", type: "fixed" }, { name: "Ashtami", paksha: "waxing", type: "bad" },
  { name: "Navami", paksha: "waxing", type: "bad" }, { name: "Dashami", paksha: "waxing", type: "fixed" },
  { name: "Ekadashi", paksha: "waxing", type: "excellent" }, { name: "Dwadashi", paksha: "waxing", type: "fixed" },
  { name: "Trayodashi", paksha: "waxing", type: "fixed" }, { name: "Chaturdashi", paksha: "waxing", type: "bad" },
  { name: "Purnima", paksha: "waxing", type: "excellent" },
  { name: "Pratipada", paksha: "waning", type: "fixed" }, { name: "Dwitiya", paksha: "waning", type: "fixed" },
  { name: "Tritiya", paksha: "waning", type: "fixed" }, { name: "Chaturthi", paksha: "waning", type: "bad" },
  { name: "Panchami", paksha: "waning", type: "fixed" }, { name: "Shashthi", paksha: "waning", type: "fixed" },
  { name: "Saptami", paksha: "waning", type: "fixed" }, { name: "Ashtami", paksha: "waning", type: "bad" },
  { name: "Navami", paksha: "waning", type: "bad" }, { name: "Dashami", paksha: "waning", type: "fixed" },
  { name: "Ekadashi", paksha: "waning", type: "excellent" }, { name: "Dwadashi", paksha: "waning", type: "fixed" },
  { name: "Trayodashi", paksha: "waning", type: "fixed" }, { name: "Chaturdashi", paksha: "waning", type: "bad" },
  { name: "Amavasya", paksha: "waning", type: "bad" },
];

const NAKSHATRAS = [
  { name: "Ashwini", nature: "movable" }, { name: "Bharani", nature: "fierce" }, { name: "Krittika", nature: "fixed" },
  { name: "Rohini", nature: "fixed" }, { name: "Mrigashira", nature: "movable" }, { name: "Ardra", nature: "fierce" },
  { name: "Punarvasu", nature: "movable" }, { name: "Pushya", nature: "fixed" }, { name: "Ashlesha", nature: "fierce" },
  { name: "Magha", nature: "fierce" }, { name: "Purva Phalguni", nature: "fierce" }, { name: "Uttara Phalguni", nature: "fixed" },
  { name: "Hasta", nature: "fixed" }, { name: "Chitra", nature: "movable" }, { name: "Swati", nature: "movable" },
  { name: "Vishakha", nature: "fierce" }, { name: "Anuradha", nature: "fixed" }, { name: "Jyeshtha", nature: "fierce" },
  { name: "Mula", nature: "fierce" }, { name: "Purva Ashadha", nature: "fierce" }, { name: "Uttara Ashadha", nature: "fixed" },
  { name: "Shravana", nature: "fixed" }, { name: "Dhanishta", nature: "movable" }, { name: "Shatabhisha", nature: "movable" },
  { name: "Purva Bhadrapada", nature: "fierce" }, { name: "Uttara Bhadrapada", nature: "fixed" }, { name: "Revati", nature: "movable" },
];

export default function Muhurtha({ size = 680 }: { size?: number }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMuhurtha, setSelectedMuhurtha] = useState<number | null>(null);
  const [selectedTithi, setSelectedTithi] = useState<number | null>(null);
  const [selectedNakshatra, setSelectedNakshatra] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<"all" | "business" | "wedding" | "travel" | "demolition">("all");

  const rahu = RAHU_KAALAM[selectedDay];
  const yama = YAMAGANDAM[selectedDay];

  const muhurthaStart = (idx: number) => {
    const totalMin = idx * 48;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const isInWindow = (idx: number, window: [number, number, number]) => {
    const muhStartMin = idx * 48;
    const winStartMin = window[0] * 60 + window[1];
    const winEndMin = winStartMin + window[2];
    return muhStartMin >= winStartMin && muhStartMin < winEndMin;
  };

  const qualityColor = (q: string) => {
    switch (q) {
      case "excellent": return "#22c55e";
      case "good": return "#3b82f6";
      case "bad": return "#ef4444";
      default: return "#94a3b8";
    }
  };

  const filterColor = (q: string) => {
    if (filterType === "all") return true;
    if (filterType === "business") return q === "good" || q === "excellent";
    if (filterType === "wedding") return q === "good" || q === "excellent";
    if (filterType === "travel") return q === "good" || q === "excellent";
    if (filterType === "demolition") return q === "bad";
    return true;
  };

  return (
    <div className="relative w-full max-w-[720px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/10 border border-emerald-200/40 shadow-2xl shadow-emerald-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
            Muhurtha
          </h2>
          <p className="text-sm text-emerald-400 mt-2 font-medium">
            Electional Astrology — 30 Muhurthas × 48 min = 24 hours. Select the perfect window.
          </p>
        </div>

        {/* Day selector */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {DAYS.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${selectedDay === i ? "shadow-sm" : ""}`}
              style={{
                background: selectedDay === i ? "#10b98115" : "#fff",
                borderColor: selectedDay === i ? "#10b981" : "#e2e8f0",
                color: selectedDay === i ? "#059669" : "#94a3b8",
              }}
            >
              {DAY_SHORT[i]}
            </button>
          ))}
        </div>

        {/* Rahu Kaalam & Yamagandam */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-3 rounded-xl bg-red-50 border border-red-100">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[10px] font-bold text-red-700 uppercase">Rahu Kaalam</span>
            </div>
            <div className="text-sm font-extrabold text-red-600">
              {String(rahu[0]).padStart(2, "0")}:{String(rahu[1]).padStart(2, "0")} — {String(Math.floor((rahu[0]*60+rahu[1]+rahu[2])/60)).padStart(2,"0")}:{String((rahu[0]*60+rahu[1]+rahu[2])%60).padStart(2,"0")}
            </div>
            <div className="text-[10px] text-red-400">Avoid starting new ventures</div>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[10px] font-bold text-orange-700 uppercase">Yamagandam</span>
            </div>
            <div className="text-sm font-extrabold text-orange-600">
              {String(yama[0]).padStart(2, "0")}:{String(yama[1]).padStart(2, "0")} — {String(Math.floor((yama[0]*60+yama[1]+yama[2])/60)).padStart(2,"0")}:{String((yama[0]*60+yama[1]+yama[2])%60).padStart(2,"0")}
            </div>
            <div className="text-[10px] text-orange-400">Avoid important actions</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
          {[
            { key: "all", label: "All" },
            { key: "business", label: "Business" },
            { key: "wedding", label: "Wedding" },
            { key: "travel", label: "Travel" },
            { key: "demolition", label: "Demolition" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key as any)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${filterType === f.key ? "shadow-sm" : ""}`}
              style={{
                background: filterType === f.key ? "#10b98115" : "#fff",
                borderColor: filterType === f.key ? "#10b981" : "#e2e8f0",
                color: filterType === f.key ? "#059669" : "#94a3b8",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 30 Muhurthas grid */}
        <div className="grid grid-cols-6 gap-1.5 mb-4">
          {MUHURTHAS.map((m, i) => {
            const isRahu = isInWindow(i, rahu);
            const isYama = isInWindow(i, yama);
            const isSelected = selectedMuhurtha === i;
            const passesFilter = filterColor(m.quality);

            let bg = "#fff";
            let border = "#e2e8f0";
            let text = "#64748b";

            if (isRahu || isYama) {
              bg = "#fef2f2";
              border = "#fca5a5";
              text = "#ef4444";
            } else if (m.quality === "excellent") {
              bg = "#f0fdf4";
              border = "#86efac";
              text = "#22c55e";
            } else if (m.quality === "good") {
              bg = "#eff6ff";
              border = "#93c5fd";
              text = "#3b82f6";
            } else if (m.quality === "bad") {
              bg = "#f8fafc";
              border = "#cbd5e1";
              text = "#94a3b8";
            }

            if (isSelected) {
              bg = `${qualityColor(m.quality)}15`;
              border = qualityColor(m.quality);
            }

            return (
              <button
                key={i}
                onClick={() => setSelectedMuhurtha(isSelected ? null : i)}
                disabled={!passesFilter}
                className={`p-1.5 rounded-lg border text-center transition-all ${isSelected ? "shadow-sm" : "hover:shadow-sm"} ${!passesFilter ? "opacity-30" : ""}`}
                style={{ background: bg, borderColor: border }}
              >
                <div className="text-[9px] font-bold" style={{ color: text }}>M{i + 1}</div>
                <div className="text-[10px] font-extrabold truncate" style={{ color: isSelected ? qualityColor(m.quality) : text }}>{m.name}</div>
                <div className="text-[8px] text-gray-400">{muhurthaStart(i)}</div>
                {(isRahu || isYama) && (
                  <div className="text-[7px] font-bold text-red-500">{isRahu ? "Rahu" : "Yama"}</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Tithi selector */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Moon className="w-3 h-3" /> Lunar Phase (Tithi)
          </div>
          <div className="flex flex-wrap gap-1">
            {TITHIS.map((t, i) => (
              <button
                key={i}
                onClick={() => setSelectedNakshatra(null)}
                onMouseEnter={() => setSelectedTithi(i)}
                onMouseLeave={() => setSelectedTithi(null)}
                className={`px-1.5 py-1 rounded-md text-[9px] font-bold border transition-all ${selectedTithi === i ? "shadow-sm" : ""}`}
                style={{
                  background: selectedTithi === i ? `${qualityColor(t.type)}15` : t.paksha === "waxing" ? "#fef3c7" : "#f1f5f9",
                  borderColor: selectedTithi === i ? qualityColor(t.type) : t.paksha === "waxing" ? "#fcd34d" : "#e2e8f0",
                  color: selectedTithi === i ? qualityColor(t.type) : t.paksha === "waxing" ? "#b45309" : "#64748b",
                }}
              >
                {t.name.slice(0, 4)}
              </button>
            ))}
          </div>
        </div>

        {/* Nakshatra selector */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sun className="w-3 h-3" /> Nakshatra Nature
          </div>
          <div className="flex flex-wrap gap-1">
            {NAKSHATRAS.map((n, i) => (
              <button
                key={i}
                onClick={() => setSelectedNakshatra(selectedNakshatra === i ? null : i)}
                className={`px-1.5 py-1 rounded-md text-[9px] font-bold border transition-all ${selectedNakshatra === i ? "shadow-sm" : ""}`}
                style={{
                  background: selectedNakshatra === i
                    ? (n.nature === "fixed" ? "#dbeafe" : n.nature === "movable" ? "#dcfce7" : "#fee2e2")
                    : "#fff",
                  borderColor: selectedNakshatra === i
                    ? (n.nature === "fixed" ? "#3b82f6" : n.nature === "movable" ? "#22c55e" : "#ef4444")
                    : "#e2e8f0",
                  color: selectedNakshatra === i
                    ? (n.nature === "fixed" ? "#1d4ed8" : n.nature === "movable" ? "#15803d" : "#b91c1c")
                    : "#94a3b8",
                }}
              >
                {n.name.split(" ")[0].slice(0, 5)}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Muhurtha detail */}
        {selectedMuhurtha !== null && (() => {
          const m = MUHURTHAS[selectedMuhurtha];
          const start = muhurthaStart(selectedMuhurtha);
          const endH = Math.floor((selectedMuhurtha * 48 + 48) / 60);
          const endM = (selectedMuhurtha * 48 + 48) % 60;
          const end = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
          return (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-extrabold text-emerald-700">Muhurtha {selectedMuhurtha + 1}: {m.name}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${qualityColor(m.quality)}20`, color: qualityColor(m.quality) }}>
                  {m.quality === "excellent" ? "Excellent" : m.quality === "good" ? "Good" : "Avoid"}
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-2">{start} — {end} ({DAYS[selectedDay]})</div>
              <div className="flex items-center gap-2">
                {m.quality === "good" || m.quality === "excellent" ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs text-gray-600">
                  {m.quality === "excellent" ? "Ideal for starting any new venture." :
                   m.quality === "good" ? "Favorable for most activities." :
                   "Avoid starting new ventures during this window."}
                </span>
              </div>
            </div>
          );
        })()}

        {!selectedMuhurtha && (
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
            <Clock className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Select a day, then tap any Muhurtha to see its quality and timing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
