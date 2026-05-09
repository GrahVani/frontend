"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, ShieldAlert, CheckCircle2, XCircle, Info,
  ArrowRight, Zap, Lock, Unlock, Search, HeartPulse,
  Briefcase, Package, Scale
} from "lucide-react";

interface QueryCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  querent: string;
  target: string;
  opponent: string;
  winCondition: string;
  loseCondition: string;
  color: string;
  lightColor: string;
}

const CATEGORIES: QueryCategory[] = [
  {
    id: "theft", name: "Theft & Lost Items", icon: <Package className="w-4 h-4" />,
    querent: "House 1 (Owner)", target: "House 4 (Lost Item)", opponent: "House 7 (Thief)",
    winCondition: "Lord of 4th connects to 1st or 2nd → Item recovered",
    loseCondition: "Lord of 7th stronger than Lord of 1st → Thief gets away",
    color: "#f59e0b", lightColor: "#fef3c7",
  },
  {
    id: "medical", name: "Medical & Disease", icon: <HeartPulse className="w-4 h-4" />,
    querent: "House 1 (Patient)", target: "House 4 (Medicine)", opponent: "House 6 (Disease)",
    winCondition: "10th Lord (Doctor) > 6th Lord (Disease) → Treatment succeeds",
    loseCondition: "6th Lord dominates → Disease overcomes medicine",
    color: "#ef4444", lightColor: "#fee2e2",
  },
  {
    id: "lawsuit", name: "Lawsuit & Competition", icon: <Scale className="w-4 h-4" />,
    querent: "House 1 (Plaintiff)", target: "House 10 (Judge)", opponent: "House 7 (Defendant)",
    winCondition: "1st Lord stronger than 7th Lord → You win",
    loseCondition: "7th Lord dominates or 10th Lord afflicted → You lose",
    color: "#3b82f6", lightColor: "#dbeafe",
  },
  {
    id: "career", name: "Career & Job", icon: <Briefcase className="w-4 h-4" />,
    querent: "House 1 (Applicant)", target: "House 10 (Employer)", opponent: "House 6 (Competition)",
    winCondition: "10th Lord connects to 1st or 11th → Job offer",
    loseCondition: "6th or 8th Lords block 10th → Rejection",
    color: "#22c55e", lightColor: "#dcfce7",
  },
];

const SEED_RANGES = [
  { label: "1–108 (Navamsha)", system: "Parashari", description: "Maps to one of 108 Nakshatra Padas" },
  { label: "1–249 (Sub-Lord)", system: "KP System", description: "Maps directly to one of 249 KP Sub-Lords" },
];

export default function PrashnaHoraryExplorer() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [seedNumber, setSeedNumber] = useState(47);
  const [seedSystem, setSeedSystem] = useState(0);
  const [sincerityCheck, setSincerityCheck] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const cat = CATEGORIES[selectedCategory];

  // Simplified sincerity check demo
  const sincerityResult = sincerityCheck
    ? { pass: true, message: "Query is sincere. The chart is stable." }
    : { pass: false, message: "Query is premature or insincere. Ask again later." };

  // Simplified Yes/No result based on seed parity for demo
  const isYes = (seedNumber % 2 === 1) && sincerityCheck;

  const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  return (
    <div className="w-full max-w-[780px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-violet-50/20 to-purple-50/10 border border-violet-200/50 shadow-2xl shadow-violet-900/5 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-purple-700">
            Prashna Horary Engine
          </h2>
          <p className="text-sm text-violet-500/80 mt-2 font-medium">
            The Science of Questions — answer without birth data.
          </p>
        </div>

        {/* Query category selector */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => { setSelectedCategory(i); setShowResult(false); }}
              className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${selectedCategory === i ? "shadow-sm" : "hover:shadow-sm"}`}
              style={{
                background: selectedCategory === i ? c.lightColor : "#fff",
                borderColor: selectedCategory === i ? `${c.color}50` : "#f1f5f9",
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm shrink-0" style={{ background: c.color }}>
                {c.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">{c.name}</div>
                <div className="text-[9px] text-gray-400">{c.querent}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected category logic */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            {...fadeUp}
            className="mb-5 p-4 rounded-2xl border shadow-sm"
            style={{ background: cat.lightColor, borderColor: `${cat.color}30` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs" style={{ background: cat.color }}>
                {cat.icon}
              </div>
              <span className="text-sm font-extrabold text-gray-900">{cat.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="p-2 rounded-lg bg-white border border-gray-100 text-center">
                <div className="text-[9px] text-gray-400 uppercase">Querent</div>
                <div className="text-xs font-bold text-gray-700">{cat.querent}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-gray-100 text-center">
                <div className="text-[9px] text-gray-400 uppercase">Target</div>
                <div className="text-xs font-bold text-gray-700">{cat.target}</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-gray-100 text-center">
                <div className="text-[9px] text-gray-400 uppercase">Opponent</div>
                <div className="text-xs font-bold text-gray-700">{cat.opponent}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
              <span className="text-[11px] text-gray-600">{cat.winCondition}</span>
            </div>
            <div className="flex items-start gap-2 mt-1">
              <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
              <span className="text-[11px] text-gray-600">{cat.loseCondition}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Seed method */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">The Seed Method</span>
          </div>
          <div className="flex gap-2 mb-3">
            {SEED_RANGES.map((s, i) => (
              <button
                key={i}
                onClick={() => setSeedSystem(i)}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${seedSystem === i ? "shadow-sm" : ""}`}
                style={{
                  background: seedSystem === i ? "#8b5cf612" : "#fff",
                  borderColor: seedSystem === i ? "#8b5cf6" : "#e2e8f0",
                  color: seedSystem === i ? "#7c3aed" : "#64748b",
                }}
              >
                <div>{s.system}</div>
                <div className="text-[9px] font-normal opacity-70">{s.label}</div>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-gray-500">Your Seed Number</span>
                <span className="text-sm font-extrabold text-violet-700">{seedNumber}</span>
              </div>
              <input
                type="range" min={1} max={seedSystem === 0 ? 108 : 249}
                value={seedNumber}
                onChange={(e) => setSeedNumber(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            {SEED_RANGES[seedSystem].description}. The seed forces a fixed Ascendant regardless of time.
          </p>
        </div>

        {/* Sincerity check */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Sincerity Check</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => { setSincerityCheck(true); setShowResult(false); }}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${sincerityCheck ? "shadow-sm" : ""}`}
              style={{
                background: sincerityCheck ? "#f0fdf4" : "#fff",
                borderColor: sincerityCheck ? "#22c55e" : "#e2e8f0",
                color: sincerityCheck ? "#15803d" : "#64748b",
              }}
            >
              <div className="flex items-center justify-center gap-1">
                <Unlock className="w-3.5 h-3.5" /> Sincere Query
              </div>
            </button>
            <button
              onClick={() => { setSincerityCheck(false); setShowResult(false); }}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${!sincerityCheck ? "shadow-sm" : ""}`}
              style={{
                background: !sincerityCheck ? "#fef2f2" : "#fff",
                borderColor: !sincerityCheck ? "#ef4444" : "#e2e8f0",
                color: !sincerityCheck ? "#b91c1c" : "#64748b",
              }}
            >
              <div className="flex items-center justify-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Insincere / Premature
              </div>
            </button>
          </div>
          <div className={`p-2 rounded-lg text-center text-xs font-bold ${sincerityCheck ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
            {sincerityResult.message}
          </div>
        </div>

        {/* Predict button */}
        <button
          onClick={() => setShowResult(true)}
          className="w-full mb-5 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold transition-colors shadow-md shadow-violet-600/20"
        >
          <Search className="w-4 h-4" /> Generate Prediction
        </button>

        {/* Result */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-4 p-5 rounded-2xl border-2 text-center ${
                isYes
                  ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300"
                  : "bg-gradient-to-br from-red-50 to-orange-50 border-red-300"
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                {isYes ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <span className="text-xl font-extrabold text-emerald-700">YES — Event Will Manifest</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-500" />
                    <span className="text-xl font-extrabold text-red-700">NO — Event Blocked</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed max-w-md mx-auto">
                {isYes
                  ? `The Prashna chart for "${cat.name}" shows the target house lord is stronger than the opponent. The seed number ${seedNumber} maps to a supportive Ascendant. The answer is favorable.`
                  : `The Prashna chart for "${cat.name}" shows the opponent house lord dominates, or the seed number ${seedNumber} maps to an afflicted zone. ${!sincerityCheck ? "Additionally, the query failed the sincerity check." : "The answer is unfavorable at this time."}`
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Senior astrologer note */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-violet-50/60 border border-violet-200/40">
          <Info className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
          <p className="text-xs text-violet-800/80 leading-relaxed">
            <strong>Professional Note:</strong> Prashna is the ultimate backup system. When a user says 
            "I don't know my birth time," standard software crashes. Prashna captures the exact millisecond 
            of the question and generates a chart from that cosmic snapshot. If the Moon is in Gandanta 
            (first/last degree of a sign), the software must refuse to answer: <em>"The situation is too unstable to predict."</em>
          </p>
        </div>
      </div>
    </div>
  );
}
