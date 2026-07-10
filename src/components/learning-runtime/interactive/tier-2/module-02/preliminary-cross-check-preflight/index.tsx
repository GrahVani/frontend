"use client";

import React, { useState, useMemo } from "react";
import { AlertTriangle, CheckCircle, XCircle, Compass, Copy, Check, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

const GOLD = "#9c7a2f";
const INK_PRIMARY = "#2b2621";
const INK_SECONDARY = "#5c534c";
const HAIRLINE = "rgba(156, 122, 47, 0.25)";
const BG_TINT = "rgba(247, 244, 237, 0.95)";

interface CaseStudy {
  id: string;
  title: string;
  statedTime: string;
  statedReliability: "reliable" | "approximate" | "unknown";
  statedQuestion: string;
  queryTime: string;
  queryDay: string;
  tattvaMoment: string;
  tattvaChart: string;
  rpResonance: string;
  correctVerdict: "PROCEED" | "RECTIFY" | "DECLINE";
  hint: string;
  reasoning: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-a",
    title: "Case Study A: Stable Natal Assessment",
    statedTime: "12:00 LMT (New Delhi)",
    statedReliability: "reliable",
    statedQuestion: "Marriage timing verification",
    queryTime: "14:15 LMT (Saturday)",
    queryDay: "Saturday",
    tattvaMoment: "Vāyu (Air)",
    tattvaChart: "Vāyu (Air - Lagna Aquarius)",
    rpResonance: "Strong (3/5 matching RPs)",
    correctVerdict: "PROCEED",
    hint: "Think about it: Birth certificate is reliable, the elements align (Air/Air), and RPs show high matching locks. What should we do?",
    reasoning: "Data is highly reliable, corroborated by elements matching (Air/Air), and supported by strong Ruling Planets resonance. Safe to proceed."
  },
  {
    id: "case-b",
    title: "Case Study B: Element Clash / Cusp Sensitivity",
    statedTime: "12:00 LMT (approximate)",
    statedReliability: "approximate",
    statedQuestion: "Fine-timing promotion query",
    queryTime: "15:24 LMT (Sunday)",
    queryDay: "Sunday",
    tattvaMoment: "Tejas (Fire)",
    tattvaChart: "Apas (Water - Moon Pisces)",
    rpResonance: "None (0/5 matching RPs)",
    correctVerdict: "RECTIFY",
    hint: "Recall the rule: Stated birth is family-memory (approximate), we have an antagonistic Fire/Water clash, and zero RP matches. How do we safeguard the cusps?",
    reasoning: "Approximate birth data, combined with a sharp element clash (Fire vs Water) and zero RP resonance, indicates high risk of chart displacement. Rectification required."
  },
  {
    id: "case-c",
    title: "Case Study C: Completely Unknown Birth Data",
    statedTime: "Unknown (only calendar date)",
    statedReliability: "unknown",
    statedQuestion: "Annual year forecast",
    queryTime: "17:10 LMT (Monday)",
    queryDay: "Monday",
    tattvaMoment: "Prithvi (Earth)",
    tattvaChart: "Clashing / Unknown",
    rpResonance: "None",
    correctVerdict: "DECLINE",
    hint: "Think: Can we casting a precise Ascendant or divisional chart for cuspal calculations if there is no birth time at all?",
    reasoning: "Birth time is completely unknown. Timing events or verifying house-cusp questions cannot be honestly attempted. Decline reading or route to broad BTR."
  }
];

export function PreliminaryCrossCheckPreflight() {
  const [activeCaseId, setActiveCaseId] = useState("case-a");
  const [selectedVerdict, setSelectedVerdict] = useState<"PROCEED" | "RECTIFY" | "DECLINE" | null>(null);
  const [copied, setCopied] = useState(false);

  const activeCase = useMemo(() => {
    return CASE_STUDIES.find((c) => c.id === activeCaseId) || CASE_STUDIES[0];
  }, [activeCaseId]);

  // Reset answer when switching cases
  const handleCaseChange = (caseId: string) => {
    setActiveCaseId(caseId);
    setSelectedVerdict(null);
  };

  const isAnswerCorrect = useMemo(() => {
    return selectedVerdict === activeCase.correctVerdict;
  }, [selectedVerdict, activeCase]);

  const stubText = useMemo(() => {
    return `### PRELIMINARY CROSS-CHECK STAGING RECORD
- **Case Reference:** ${activeCase.title}
- **Stated Birth Time:** ${activeCase.statedTime} (${activeCase.statedReliability.toUpperCase()})
- **Tattva Alignment:** Moment: ${activeCase.tattvaMoment} vs Chart: ${activeCase.tattvaChart}
- **Ruling Planets Resonance:** ${activeCase.rpResonance}
- **Pre-flight Verdict:** ${activeCase.correctVerdict}
- **Astrological Routing:** ${activeCase.reasoning}`;
  }, [activeCase]);

  const copyToClipboard = () => {
    if (!isAnswerCorrect) return;
    navigator.clipboard.writeText(stubText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="p-6 md:p-8 rounded-2xl border font-sans animate-fade-in"
      style={{
        backgroundColor: BG_TINT,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)"
      }}
    >
      <div className="pb-4 border-b mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Preliminary Cross-Check Preflight Capstone
          </h2>
          <p className="text-xs italic text-gray-600">
            Case Simulator: evaluate chart parameters, query alignments, and log verified consultation tickets.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Compass size={11} className="animate-spin-slow" />
          MODULE 2.2.4
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cases selector */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Case Files
          </span>

          <div className="space-y-2.5">
            {CASE_STUDIES.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCaseChange(c.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  activeCaseId === c.id ? "bg-white shadow-md border-amber-800" : "bg-white/40 border-gray-200 opacity-75 hover:bg-white/80 hover:opacity-100"
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-amber-800 block mb-0.5">
                  {c.id.toUpperCase()}
                </span>
                <strong className="text-sm font-bold text-gray-800 block">{c.title}</strong>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">Question: {c.statedQuestion}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Workspace */}
        <div className="lg:col-span-7 space-y-5">
          <span className="text-[10px] uppercase tracking-wider block font-bold text-gray-400">
            Diagnostic Workspace
          </span>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4 font-sans text-xs" style={{ borderColor: HAIRLINE }}>
            <span className="font-bold text-amber-800 block border-b pb-1.5 mb-2" style={{ borderColor: HAIRLINE }}>
              Parameters Log
            </span>
            
            <div className="grid grid-cols-2 gap-4 leading-normal">
              <div>
                <span className="text-gray-500 font-semibold block text-[10px] uppercase">Stated Birth:</span>
                <strong className="text-gray-800">{activeCase.statedTime}</strong>
                <span className="block text-[10px] text-amber-700 font-bold uppercase mt-0.5">
                  ({activeCase.statedReliability})
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block text-[10px] uppercase">Query Moment:</span>
                <strong className="text-gray-800">{activeCase.queryTime}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 leading-normal border-t pt-3" style={{ borderColor: HAIRLINE }}>
              <div>
                <span className="text-gray-500 font-semibold block text-[10px] uppercase">Tattva Alignments:</span>
                <span className="block text-gray-800 font-bold">Moment: {activeCase.tattvaMoment}</span>
                <span className="block text-gray-600 font-medium">Chart: {activeCase.tattvaChart}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block text-[10px] uppercase">Ruling Planets:</span>
                <strong className="text-gray-800">{activeCase.rpResonance}</strong>
              </div>
            </div>
          </div>

          {/* Gamified Decision Block */}
          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Make your Pre-flight Decision:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedVerdict("PROCEED")}
                className={`py-2 text-xs font-bold rounded border transition-all ${
                  selectedVerdict === "PROCEED" ? "bg-green-800 text-white border-green-800" : "bg-transparent text-gray-700 hover:bg-gray-50"
                }`}
                style={{ borderColor: selectedVerdict === "PROCEED" ? "transparent" : HAIRLINE }}
              >
                PROCEED
              </button>
              <button
                onClick={() => setSelectedVerdict("RECTIFY")}
                className={`py-2 text-xs font-bold rounded border transition-all ${
                  selectedVerdict === "RECTIFY" ? "bg-amber-700 text-white border-amber-700" : "bg-transparent text-gray-700 hover:bg-gray-50"
                }`}
                style={{ borderColor: selectedVerdict === "RECTIFY" ? "transparent" : HAIRLINE }}
              >
                RECTIFY FIRST
              </button>
              <button
                onClick={() => setSelectedVerdict("DECLINE")}
                className={`py-2 text-xs font-bold rounded border transition-all ${
                  selectedVerdict === "DECLINE" ? "bg-red-800 text-white border-red-800" : "bg-transparent text-gray-700 hover:bg-gray-50"
                }`}
                style={{ borderColor: selectedVerdict === "DECLINE" ? "transparent" : HAIRLINE }}
              >
                DECLINE
              </button>
            </div>

            {/* Assessment Feedback */}
            {selectedVerdict && (
              <div
                className="p-3 rounded border text-xs font-semibold leading-relaxed"
                style={{
                  borderColor: isAnswerCorrect ? "#16a34a" : "#dc2626",
                  backgroundColor: isAnswerCorrect ? "rgba(22, 163, 74, 0.03)" : "rgba(220, 38, 38, 0.03)"
                }}
              >
                {isAnswerCorrect ? (
                  <div className="text-green-800 space-y-1">
                    <span className="flex items-center gap-1.5 font-bold"><CheckCircle size={14} /> Correct Astrological Decision!</span>
                    <p className="font-normal text-gray-600">{activeCase.reasoning}</p>
                  </div>
                ) : (
                  <div className="text-red-950 space-y-1">
                    <span className="flex items-center gap-1.5 font-bold"><XCircle size={14} /> Incorrect Action choice</span>
                    <p className="font-normal text-gray-600">{activeCase.hint}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Staging ticket stub - unlocked only when correct */}
          <div className={`p-4 rounded-xl border bg-white shadow-sm space-y-3 transition-opacity ${isAnswerCorrect ? "opacity-100" : "opacity-50 pointer-events-none"}`} style={{ borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-amber-800" /> Staging Consultation Record Ticket {!isAnswerCorrect && "(LOCKED)"}
              </span>
              <button
                onClick={copyToClipboard}
                disabled={!isAnswerCorrect}
                className="px-2 py-1 text-[10px] font-bold rounded border hover:bg-amber-50 transition-all flex items-center gap-1.5 bg-transparent"
                style={{ borderColor: HAIRLINE }}
              >
                {copied ? <Check size={11} className="text-green-700" /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy Ticket"}
              </button>
            </div>
            <textarea
              readOnly
              rows={5}
              value={stubText}
              className="w-full text-[10px] font-mono p-3 border rounded bg-amber-950/[0.01] text-gray-600 focus:outline-none leading-relaxed"
              style={{ borderColor: HAIRLINE }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
