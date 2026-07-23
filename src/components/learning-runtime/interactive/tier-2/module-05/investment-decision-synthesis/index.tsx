"use client";

import { useState, useMemo } from "react";
import { Sparkles, Check, Copy } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";
const LABEL_TEXT = "#5f5447";
const HELPER_TEXT = "#4b5563";

const SHLOKA_WORDS = [
  { word: "कालं गतिं च", meaning: "The timing (kala) and trajectory trend (gati) of finances" },
  { word: "वित्तस्य", meaning: "Of wealth and resource movements" },
  { word: "न तु निश्चयम्", meaning: "But never declaring a deterministic guarantee on a specific transaction outcome" },
  { word: "विशेषं वित्तकार्यस्य", meaning: "Specific investment decisions, tax details, and stock-picks" },
  { word: "परस्मै विनिवेदयेत्", meaning: "Must be routed and referred to another (the certified financial planner / tax advisor)" }
];

interface QuizItem {
  id: number;
  text: string;
  correctBucket: "astrology" | "advisor";
  explanation: string;
}

const QUIZ_ITEMS: QuizItem[] = [
  {
    id: 1,
    text: "Is the next 12 months a generally supportive period for me to take financial risks?",
    correctBucket: "astrology",
    explanation: "Correct! Astrology can map general favorable timing windows and trend trajectories."
  },
  {
    id: 2,
    text: "Should I buy Tesla stock or invest in real estate in Austin?",
    correctBucket: "advisor",
    explanation: "Correct! Specific asset allocation and product selection are non-astrological financial advisor questions."
  },
  {
    id: 3,
    text: "Will this specific mutual fund guarantee a 15% return?",
    correctBucket: "advisor",
    explanation: "Correct! Return guarantees are financial calculations and market risks, not readable by charts."
  },
  {
    id: 4,
    text: "Will I clear my heavy debts during the current Jupiter Dasha?",
    correctBucket: "astrology",
    explanation: "Correct! Timing of debt clearance or litigation release aligns with Dasha periods."
  }
];

export function InvestmentDecisionSynthesis() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, "astrology" | "advisor">>({});
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRoute = (itemId: number, bucket: "astrology" | "advisor") => {
    setSelectedAnswers({
      ...selectedAnswers,
      [itemId]: bucket
    });
  };

  const phrasingText = useMemo(() => {
    return "What I can confirm is that this looks like a generally favorable financial period for you, with the Dasha and annual return aligning. What I cannot tell you is whether this specific stock will go up—please refer the asset pick and risk allocation details to a qualified financial advisor.";
  }, []);

  const copyPhrasing = () => {
    navigator.clipboard.writeText(phrasingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate score
  const score = useMemo(() => {
    const solved = Object.keys(selectedAnswers).length;
    if (solved === 0) return 0;
    let correct = 0;
    QUIZ_ITEMS.forEach((item) => {
      if (selectedAnswers[item.id] === item.correctBucket) {
        correct++;
      }
    });
    return Math.round((correct / QUIZ_ITEMS.length) * 100);
  }, [selectedAnswers]);

  const strokeDashoffset = useMemo(() => {
    const circumference = 2 * Math.PI * 30;
    return circumference - (score / 100) * circumference;
  }, [score]);

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans animate-fade-in"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="investment-decision-synthesis"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Scope Routing & Investment Timing Workbench
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 6: Splitting timing windows from specific investment picks.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Sparkles size={11} className="animate-pulse" />
          ACTIVE WORKBENCH
        </div>
      </div>

      {/* Sanskrit Verse with breakdowns */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm text-center relative" style={{ borderColor: HAIRLINE }}>
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold tracking-wider" style={{ color: LABEL_TEXT }}>
          Scriptural Competence Boundaries Maxim (Click words for breakdown)
        </div>
        <div className="py-3 flex flex-wrap justify-center gap-2">
          {SHLOKA_WORDS.map((w, idx) => (
            <button
              key={idx}
              onClick={() => setActiveWordIdx(activeWordIdx === idx ? null : idx)}
              className={`text-xs md:text-sm font-bold transition-all px-1.5 py-0.5 rounded cursor-pointer ${
                activeWordIdx === idx 
                  ? "bg-amber-800 text-white shadow-md scale-105" 
                  : "text-amber-950 hover:bg-amber-50"
              }`}
            >
              {w.word}
            </button>
          ))}
        </div>
        {activeWordIdx !== null && (
          <div className="mt-2 text-xs text-amber-900 font-bold bg-amber-50/50 py-1.5 px-3 rounded-lg border border-amber-250/20 animate-fade-in">
            {SHLOKA_WORDS[activeWordIdx].meaning}
          </div>
        )}
      </div>

      {/* Main Grid: Quiz Items and Score Dial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
        <div className="lg:col-span-8 space-y-4">
          <span className="text-[10px] uppercase font-bold block border-b pb-1" style={{ color: LABEL_TEXT }}>
            Astrological Scope Routing Game (Route each client query correctly)
          </span>

          {QUIZ_ITEMS.map((item) => {
            const answer = selectedAnswers[item.id];
            const isCorrect = answer === item.correctBucket;
            return (
              <div key={item.id} className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
                <p className="text-xs font-bold text-gray-800 font-mono">&ldquo;{item.text}&rdquo;</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRoute(item.id, "astrology")}
                    className={`px-3 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                      answer === "astrology"
                        ? isCorrect 
                          ? "bg-green-105 border-green-500 text-green-950" 
                          : "bg-red-100 border-red-500 text-red-950"
                        : "bg-transparent text-gray-700 hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    Route to Astrology Scope
                  </button>
                  <button
                    onClick={() => handleRoute(item.id, "advisor")}
                    className={`px-3 py-1.5 rounded border text-xs font-bold transition-all cursor-pointer ${
                      answer === "advisor"
                        ? isCorrect 
                          ? "bg-green-105 border-green-500 text-green-950" 
                          : "bg-red-100 border-red-500 text-red-950"
                        : "bg-transparent text-gray-700 hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    Route to Financial Advisor Scope
                  </button>
                </div>

                {answer && (
                  <div className={`text-[11px] font-bold transition-all ${isCorrect ? "text-green-755" : "text-red-750"}`}>
                    {isCorrect ? `✓ ${item.explanation}` : `✗ Incorrect routing: ${item.explanation}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Score Dial */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[220px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold block border-b pb-1 w-full text-center mb-6" style={{ color: LABEL_TEXT }}>
              Adhikara Ethics Score
            </span>

            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="30" fill="transparent" stroke="#f3f4f6" strokeWidth="8" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="30" 
                  fill="transparent" 
                  stroke={score >= 75 ? "#15803d" : "#d97706"} 
                  strokeWidth="8" 
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-amber-900">{score}%</span>
                <span className="text-[8px] block font-bold uppercase tracking-wider" style={{ color: LABEL_TEXT }}>Score</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-amber-900 block mt-4 text-center">
              {score === 100 ? "Adhikara Aligned" : "Check boundaries"}
            </span>
          </div>
        </div>
      </div>

      {/* Phrasing Register Panel */}
      <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3" style={{ borderColor: HAIRLINE }}>
        <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: HAIRLINE }}>
          <div>
            <span className="text-[9px] uppercase tracking-wider block font-bold" style={{ color: LABEL_TEXT }}>
              Calibrated Interpretations
            </span>
            <span className="text-[10px] font-medium italic" style={{ color: HELPER_TEXT }}>
              Use this qualitative framing in your client write-ups
            </span>
          </div>
          <button
            onClick={copyPhrasing}
            className="px-2 py-1 text-[10px] font-bold rounded border transition-all flex items-center gap-1 bg-transparent hover:bg-amber-50 cursor-pointer"
            style={{ borderColor: HAIRLINE }}
          >
            {copied ? <Check size={11} className="text-green-700" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy Phrasing"}
          </button>
        </div>
        <blockquote className="text-xs italic border-l-2 pl-3 py-1 bg-amber-50/10" style={{ borderColor: GOLD, color: HELPER_TEXT }}>
          &ldquo;{phrasingText}&rdquo;
        </blockquote>
      </div>
    </div>
  );
}
