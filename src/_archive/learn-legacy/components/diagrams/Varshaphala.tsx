"use client";

import React, { useState } from "react";
import { Sun, Calendar, ArrowRight } from "lucide-react";

const MONTHS = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
];

const MONTH_LORDS = ["Ma", "Ve", "Me", "Mo", "Su", "Me", "Ve", "Ma", "Ju", "Sa", "Sa", "Ju"];
const LORD_COLORS: Record<string, string> = {
  "Su": "#f59e0b", "Mo": "#94a3b8", "Ma": "#ef4444", "Me": "#22c55e",
  "Ju": "#f97316", "Ve": "#a855f7", "Sa": "#475569", "Ra": "#1e293b", "Ke": "#64748b",
};

export default function Varshaphala({ size = 640 }: { size?: number }) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [ MunthaSign, setMunthaSign ] = useState(1);

  const munthaProgress = ((MunthaSign - 1) / 12) * 100;

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50/30 to-yellow-50/10 border border-orange-200/40 shadow-2xl shadow-orange-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-700">
            Varshaphala (Tajik)
          </h2>
          <p className="text-sm text-orange-400 mt-2 font-medium">
            Solar Return System — 12 monthly lords + Muntha progression
          </p>
        </div>

        {/* Solar Return overview */}
        <div className="flex items-center gap-4 mb-5 p-4 rounded-2xl bg-white border border-orange-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
            <Sun className="w-6 h-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-gray-900">Solar Return Computation</div>
            <div className="text-xs text-gray-500 mt-0.5">
              When the Sun returns to its exact natal degree, a new Varsha (year) begins.
              The ascendant of this moment becomes the Varsha Lagna.
            </div>
          </div>
        </div>

        {/* Muntha slider */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-orange-700">Muntha (Year Progress)</span>
            <span className="text-sm font-extrabold text-orange-600">Sign {MunthaSign}</span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            value={MunthaSign}
            onChange={(e) => setMunthaSign(parseInt(e.target.value))}
            className="w-full h-2 bg-orange-100 rounded-full appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between mt-1 text-[10px] text-gray-400">
            <span>Aries</span>
            <span>Pisces</span>
          </div>
          <div className="mt-2 p-2 rounded-xl bg-orange-50 border border-orange-100 text-center">
            <span className="text-xs text-orange-700">
              Muntha at <strong>Sign {MunthaSign}</strong> — predicts the overall theme of the year.
            </span>
          </div>
        </div>

        {/* 12 Monthly Lords */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 mb-4">
          {MONTHS.map((m, i) => {
            const lord = MONTH_LORDS[i];
            const isSelected = selectedMonth === i;
            return (
              <button
                key={i}
                onClick={() => setSelectedMonth(isSelected ? null : i)}
                className={`p-2 rounded-xl text-center border transition-all ${isSelected ? "shadow-sm" : ""}`}
                style={{
                  background: isSelected ? `${LORD_COLORS[lord]}15` : "#fff",
                  borderColor: isSelected ? LORD_COLORS[lord] : "#e2e8f0",
                }}
              >
                <div className="text-[10px] font-bold text-gray-400">{m}</div>
                <div className="text-lg font-extrabold" style={{ color: LORD_COLORS[lord] }}>{lord}</div>
                <div className="text-[9px] text-gray-400">Lord</div>
              </button>
            );
          })}
        </div>

        {/* Selected month detail */}
        {selectedMonth !== null && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-bold text-orange-700">
                Month {selectedMonth + 1}: {MONTHS[selectedMonth]} — Lord: {MONTH_LORDS[selectedMonth]}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              In Tajik Varshaphala, each month of the solar year is ruled by a specific planet.
              The {MONTHS[selectedMonth]} month is ruled by <strong style={{ color: LORD_COLORS[MONTH_LORDS[selectedMonth]] }}>{MONTH_LORDS[selectedMonth]}</strong>.
              Events during this month are judged by the strength and placement of this lord in the Varsha Kundali.
            </p>
          </div>
        )}

        {/* Sahams */}
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <div className="text-xs font-bold text-amber-700 mb-1">Key Sahams (Sensitive Points)</div>
          <div className="flex flex-wrap gap-2">
            {["Fortune", "Wealth", "Marriage", "Children", "Disease", "Travel"].map((s) => (
              <span key={s} className="px-2 py-1 rounded-lg bg-white border border-amber-200 text-[10px] font-bold text-amber-700">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
