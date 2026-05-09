"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sun, Calendar, Clock, Star, ArrowRight, ChevronRight,
  ChevronLeft, MapPin, Sparkles, AlertTriangle, CheckCircle2,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────
const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

const MUNTHA_MEANING: Record<number, { quality: "good" | "bad" | "neutral"; theme: string }> = {
  0: { quality: "neutral", theme: "Self-focus, health, identity reshaping" },
  1: { quality: "neutral", theme: "Wealth building, family matters, speech" },
  2: { quality: "neutral", theme: "Courage, siblings, short travels" },
  3: { quality: "bad", theme: "Home stress, emotional upheaval, mother-related concerns" },
  4: { quality: "good", theme: "Children, romance, creative success, speculation gains" },
  5: { quality: "bad", theme: "Health issues, enemies, debts, obstacles" },
  6: { quality: "good", theme: "Marriage, partnerships, business contracts" },
  7: { quality: "bad", theme: "Sudden crises, longevity fears, hidden enemies" },
  8: { quality: "good", theme: "Luck, fortune, father blessings, higher learning" },
  9: { quality: "good", theme: "Career elevation, authority, public recognition" },
  10: { quality: "good", theme: "Financial gains, elder support, wish fulfillment" },
  11: { quality: "bad", theme: "Losses, isolation, foreign-related stress, expenses" },
};

const QUALITY_COLORS = {
  good: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", badge: "bg-emerald-100 text-emerald-700" },
  bad: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-800", badge: "bg-rose-100 text-rose-700" },
  neutral: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", badge: "bg-amber-100 text-amber-700" },
};

// ─── Helpers ──────────────────────────────────────────────────
function getMunthaHouse(natalAsc: number, age: number): number {
  const raw = (natalAsc + age) % 12;
  return raw === 0 ? 12 : raw;
}

function getSolarReturnShift(age: number): string {
  const hours = (age * 6) % 24;
  const minutes = Math.round((age * 6 * 60) % 60);
  if (hours === 0 && minutes === 0) return "Same time as birth";
  return `${hours}h ${minutes}m later`;
}

// ─── Component ────────────────────────────────────────────────
export default function VarshaPraveshExplorer() {
  const [natalAsc, setNatalAsc] = useState(0); // Aries default
  const [age, setAge] = useState(30);

  const munthaHouse = useMemo(() => getMunthaHouse(natalAsc, age), [natalAsc, age]);
  const munthaSign = SIGNS[(natalAsc + age) % 12];
  const munthaLord = SIGN_LORDS[munthaSign];
  const munthaInfo = MUNTHA_MEANING[munthaHouse - 1];
  const quality = QUALITY_COLORS[munthaInfo.quality];
  const shift = getSolarReturnShift(age);

  return (
    <div className="bg-white border border-orange-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center">
            <Sun className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-orange-900">Varsha Pravesh &amp; Muntha Calculator</h3>
            <p className="text-sm text-orange-600">Solar Return Cast + Progressed Ascendant</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-2 block">Natal Ascendant</label>
            <select
              value={natalAsc}
              onChange={(e) => setNatalAsc(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-orange-200 text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {SIGNS.map((s, i) => (
                <option key={s} value={i}>{s} ({SIGN_LORDS[s]})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-2 block">Current Age: <span className="text-orange-800">{age}</span></label>
            <input
              type="range"
              min={0}
              max={100}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <div className="flex justify-between text-[10px] text-slate-700 mt-1">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Formula + Solar Return Shift */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-bold text-orange-800">Solar Return Shift</span>
            </div>
            <div className="text-xs text-slate-800 mb-2">
              Each year the Sun returns <strong>~6 hours later</strong> than the previous year due to the 365.2422-day solar year.
            </div>
            <div className="bg-white rounded-lg border border-orange-100 p-3 text-center">
              <div className="text-xs text-slate-700">At Age {age}, Varsha Pravesh occurs</div>
              <div className="text-lg font-extrabold text-orange-800">{shift}</div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-800">Muntha Formula</span>
            </div>
            <div className="bg-white rounded-lg border border-amber-100 p-3 text-center">
              <div className="text-xs text-slate-700 mb-1">(Natal Asc + Age) % 12</div>
              <div className="text-sm font-bold text-amber-800">
                ({natalAsc + 1} + {age}) % 12 = <span className="text-lg">{munthaHouse}</span>
              </div>
              <div className="text-xs text-slate-700 mt-1">
                Muntha in <strong>{munthaSign}</strong> ({munthaLord})
              </div>
            </div>
          </div>
        </div>

        {/* Muntha Result Card */}
        <div className={`${quality.bg} rounded-xl border-2 ${quality.border} p-4 mb-5`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-700" />
              <span className="text-lg font-extrabold text-slate-800">Muntha in House {munthaHouse}</span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${quality.badge}`}>
              {munthaInfo.quality === "good" ? "Auspicious" : munthaInfo.quality === "bad" ? "Warning" : "Neutral"}
            </span>
          </div>
          <p className={`text-sm ${quality.text} font-medium`}>{munthaInfo.theme}</p>
        </div>

        {/* 12-House Wheel */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-slate-800">Annual Chart — Muntha Position</span>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Outer ring */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="#000000" strokeWidth="1" />
                <circle cx="100" cy="100" r="55" fill="none" stroke="#000000" strokeWidth="1" />
                {/* House dividing lines */}
                {[0, 30, 60, 90, 120, 150].map((deg) => {
                  const rad = (deg - 90) * (Math.PI / 180);
                  const x1 = 100 + 55 * Math.cos(rad);
                  const y1 = 100 + 55 * Math.sin(rad);
                  const x2 = 100 + 90 * Math.cos(rad);
                  const y2 = 100 + 90 * Math.sin(rad);
                  return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000000" strokeWidth="1" />;
                })}
                {/* House numbers */}
                {Array.from({ length: 12 }, (_, i) => {
                  const angle = (i * 30 - 90 + 15) * (Math.PI / 180);
                  const x = 100 + 72 * Math.cos(angle);
                  const y = 100 + 72 * Math.sin(angle);
                  const isMuntha = i + 1 === munthaHouse;
                  return (
                    <g key={i}>
                      <circle
                        cx={x} cy={y} r={isMuntha ? 16 : 12}
                        fill={isMuntha ? "#f97316" : "#fff"}
                        stroke={isMuntha ? "#ea580c" : "#000000"}
                        strokeWidth={isMuntha ? 2 : 1}
                      />
                      <text
                        x={x} y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={isMuntha ? "9" : "7"}
                        fontWeight={isMuntha ? "bold" : "normal"}
                        fill={isMuntha ? "#fff" : "#000000"}
                      >
                        H{i + 1}
                      </text>
                    </g>
                  );
                })}
                {/* Center label */}
                <circle cx="100" cy="100" r="20" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
                <text x="100" y="96" textAnchor="middle" dominantBaseline="central" fontSize="8" fill="#000000">Muntha</text>
                <text x="100" y="106" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="bold" fill="#000000">{munthaSign}</text>
              </svg>
            </div>
          </div>
        </div>

        {/* House Quality Guide */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-2.5 text-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-emerald-800">Auspicious</div>
            <div className="text-[10px] text-emerald-700">H5, H9, H10, H11</div>
          </div>
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-2.5 text-center">
            <Star className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-amber-800">Neutral</div>
            <div className="text-[10px] text-amber-700">H1, H2, H3, H7</div>
          </div>
          <div className="bg-rose-50 rounded-lg border border-rose-200 p-2.5 text-center">
            <AlertTriangle className="w-4 h-4 text-rose-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-rose-800">Warning</div>
            <div className="text-[10px] text-rose-700">H4, H6, H8, H12</div>
          </div>
        </div>

        {/* Astrologer Note */}
        <div className="mt-4 bg-orange-50 rounded-lg border border-orange-200 p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-orange-800">Astrologer Note</div>
              <p className="text-sm text-orange-700 mt-0.5">
                The Muntha reveals the <strong>psychological focus</strong> of the year. Even in a "warning" house, the Muntha shows where growth is forced. A skilled astrologer checks the Muntha lord&apos;s dignity and aspects to judge whether the challenge is surmountable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
