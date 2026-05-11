"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors, Info, AlertTriangle, CheckCircle2, ArrowRight,
  Star, RotateCcw
} from "lucide-react";

interface VargaDef {
  name: string;
  divisor: number;
  sliceSize: string;
  sliceDegrees: number;
  description: string;
  useCase: string;
  color: string;
  lightColor: string;
}

const VARGAS: VargaDef[] = [
  { name: "Navamsha", divisor: 9, sliceSize: "3°20'", sliceDegrees: 3 + 20 / 60, description: "30° ÷ 9 = 3°20' per slice. Matches Nakshatra Pada size.", useCase: "Soul strength, marriage, second half of life", color: "#ec4899", lightColor: "#fce7f3" },
  { name: "Dashamsha", divisor: 10, sliceSize: "3°00'", sliceDegrees: 3, description: "30° ÷ 10 = 3°00' per slice. Perfect tenths.", useCase: "Career, professional karma, public status", color: "#3b82f6", lightColor: "#dbeafe" },
  { name: "Shashtiamsha", divisor: 60, sliceSize: "0°30'", sliceDegrees: 0.5, description: "30° ÷ 60 = 0°30' per slice. Half a degree.", useCase: "Karmic DNA, past-life validation, finest details", color: "#8b5cf6", lightColor: "#ede9fe" },
];

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGN_COLORS = ["#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7", "#ef4444", "#22c55e", "#eab308", "#3b82f6", "#f97316", "#a855f7"];

// Simple mapping: for demo, D-9 slice sign cycles through elements
function getVargaSign(d1Sign: number, sliceIndex: number, varga: VargaDef) {
  // Deterministic demo: rotate through signs based on slice
  return ((d1Sign - 1 + sliceIndex * (varga.divisor === 9 ? 4 : varga.divisor === 10 ? 5 : 1)) % 12) + 1;
}

export default function VargaSlicerExplorer() {
  const [degree, setDegree] = useState(14.5);
  const [selectedSign, setSelectedSign] = useState(0); // Aries
  const [activeVarga, setActiveVarga] = useState(0); // Navamsha
  const [showChecksum, setShowChecksum] = useState(false);

  const varga = VARGAS[activeVarga];
  const sliceIndex = Math.floor(degree / varga.sliceDegrees);
  const sliceStart = sliceIndex * varga.sliceDegrees;
  const sliceEnd = Math.min((sliceIndex + 1) * varga.sliceDegrees, 30);

  // For checksum demo: show D-1 vs D-9 sign
  const d1Sign = selectedSign + 1;
  const d9Slice = Math.floor(degree / (3 + 20 / 60));
  const d9Sign = getVargaSign(d1Sign, d9Slice, VARGAS[0]);
  const d10Sign = getVargaSign(d1Sign, Math.floor(degree / 3), VARGAS[1]);

  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <div className="w-full select-none">
      <div className="py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-700">
            Varga Slicer
          </h2>
          <p className="text-base text-emerald-700 mt-2 font-semibold">
            See how a 30° sign is divided into microscopic compartments.
          </p>
        </div>

        {/* Varga tabs */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {VARGAS.map((v, i) => (
            <button
              key={v.name}
              onClick={() => setActiveVarga(i)}
              className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border ${
                activeVarga === i
                  ? "shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700"
              }`}
              style={activeVarga === i ? { background: v.lightColor, borderColor: `${v.color}50`, color: v.color } : {}}
            >
              <div>{v.name}</div>
              <div className={`text-xs font-semibold ${activeVarga === i ? "opacity-80" : "text-gray-500"}`}>D-{v.divisor}</div>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Star className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">D-1 Sign</span>
            </div>
            <select
              value={selectedSign}
              onChange={(e) => setSelectedSign(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm font-bold text-gray-700 outline-none focus:border-emerald-400 cursor-pointer"
            >
              {SIGNS.map((s, i) => (
                <option key={s} value={i}>{s}</option>
              ))}
            </select>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Exact Degree</span>
              <span className="text-sm font-extrabold text-emerald-700">{degree.toFixed(2)}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={0.01}
              value={degree}
              onChange={(e) => setDegree(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0°</span><span>15°</span><span>30°</span>
            </div>
          </div>
        </div>

        {/* Slice visualization */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-800 uppercase tracking-wider">{varga.name} Slices</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: varga.lightColor, color: varga.color }}>
              {varga.divisor} slices × {varga.sliceSize} each
            </span>
          </div>

          {/* Ruler */}
          <div className="relative h-10 bg-gray-100 rounded-xl overflow-hidden mb-2">
            {Array.from({ length: varga.divisor }, (_, i) => {
              const left = (i / varga.divisor) * 100;
              const width = (1 / varga.divisor) * 100;
              const isActive = sliceIndex === i;
              return (
                <div
                  key={i}
                  className="absolute top-0 h-full flex items-center justify-center text-xs font-bold border-r border-white/50 transition-colors"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    background: isActive ? varga.color : i % 2 === 0 ? "#f1f5f9" : "#e2e8f0",
                    color: isActive ? "#fff" : "#94a3b8",
                  }}
                >
                  {varga.divisor <= 20 ? i + 1 : ""}
                </div>
              );
            })}
            {/* Position marker */}
            <div
              className="absolute top-0 w-0.5 h-full bg-red-500 z-10"
              style={{ left: `${(degree / 30) * 100}%` }}
            >
              <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-600 font-semibold">
            <span>0°</span><span>10°</span><span>20°</span><span>30°</span>
          </div>

          {/* Active slice info */}
          <div className="mt-3 p-3 rounded-xl flex items-center gap-3" style={{ background: varga.lightColor, border: `1px solid ${varga.color}30` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ background: varga.color }}>
              {sliceIndex + 1}
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800">Slice {sliceIndex + 1} of {varga.divisor}</div>
              <div className="text-sm text-gray-700">
                Range: {sliceStart.toFixed(2)}° — {sliceEnd.toFixed(2)}° · Size: {varga.sliceSize}
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-bold text-gray-700">Varga Sign</div>
              <div className="text-sm font-extrabold" style={{ color: varga.color }}>
                {SIGNS[getVargaSign(d1Sign, sliceIndex, varga) - 1].slice(0, 3)}
              </div>
            </div>
          </div>
        </div>

        {/* Checksum demo */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Validation Checksum</span>
            </div>
            <button
              onClick={() => setShowChecksum(!showChecksum)}
              className="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
            >
              {showChecksum ? "Hide" : "Show"} Example
            </button>
          </div>

          <AnimatePresence>
            {showChecksum && (
              <motion.div {...fadeUp}>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                    <div className="text-xs font-bold text-amber-700 uppercase mb-1">D-1 Rashi</div>
                    <div className="text-lg font-extrabold text-gray-900">{SIGNS[selectedSign]}</div>
                    <div className="text-xs text-gray-700">{degree.toFixed(1)}°</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-gray-300" />
                  </div>
                  <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 text-center">
                    <div className="text-xs font-bold text-pink-700 uppercase mb-1">D-9 Navamsha</div>
                    <div className="text-lg font-extrabold text-gray-900">{SIGNS[d9Sign - 1]}</div>
                    <div className="text-xs text-gray-700">Slice {d9Slice + 1}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">
                  A planet at {degree.toFixed(1)}° in {SIGNS[selectedSign]} appears strong in D-1. 
                  But its D-9 placement in <strong>{SIGNS[d9Sign - 1]}</strong> reveals the 
                  <em>true underlying strength</em>. Professional software must check both charts before predicting.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!showChecksum && (
            <p className="text-sm text-gray-600 italic">Click "Show Example" to see how D-1 and D-9 can disagree.</p>
          )}
        </div>

        {/* D-60 Warning */}
        {activeVarga === 2 && (
          <motion.div {...fadeUp} className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-base font-bold text-red-800">D-60 Critical Warning</div>
              <p className="text-sm text-red-800 leading-relaxed mt-1">
                Because D-60 uses 0°30' slices, it changes <strong>every 2 minutes of clock time</strong>. 
                Your software must warn users: if birth time is not accurate to the minute, D-60 analysis is completely invalid.
              </p>
            </div>
          </motion.div>
        )}

        {/* Varga summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VARGAS.map((v, i) => (
            <button
              key={v.name}
              onClick={() => setActiveVarga(i)}
              className={`p-3 rounded-xl border text-left transition-all ${activeVarga === i ? "shadow-md scale-[1.02]" : "hover:shadow-sm"}`}
              style={{ background: activeVarga === i ? v.lightColor : "#fff", borderColor: activeVarga === i ? `${v.color}40` : "#f1f5f9" }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: v.color }}>D-{v.divisor}</div>
                <span className="text-sm font-bold text-gray-900">{v.name}</span>
              </div>
              <div className="text-xs text-gray-600 mb-1">{v.sliceSize} per slice</div>
              <div className="text-xs font-semibold" style={{ color: v.color }}>{v.useCase}</div>
            </button>
          ))}
        </div>

        {/* Senior astrologer note */}
        <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <Info className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
          <p className="text-sm text-emerald-900 leading-relaxed">
            <strong>Professional Note:</strong> Never predict from D-1 alone. A Sun exalted at 29°50' in Aries 
            looks like a king in the main chart — but in D-9 it falls into Libra (debilitated). 
            The software must output: <em>"Surface confidence exists, but structural support is broken. 
            Leadership roles will fail under pressure."</em>
          </p>
        </div>
      </div>
    </div>
  );
}
