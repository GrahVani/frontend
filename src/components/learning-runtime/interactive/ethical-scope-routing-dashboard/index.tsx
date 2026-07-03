"use client";

import { useState, useMemo } from "react";
import { Info, Sparkles, Check, Copy, AlertTriangle, Heart } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const GOLD = ink.goldAccent || "#9C7A2F";

const SHLOKA_WORDS = [
  { word: "अविदित्वा तु", meaning: "Without fully realizing or knowing" },
  { word: "शास्त्रमर्यादा", meaning: "The code of limits and boundaries of the sacred science (Shastra)" },
  { word: "रक्षिता", meaning: "Must be preserved and guarded carefully by the practitioner" }
];

interface Scenario {
  id: number;
  title: string;
  query: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
    phrase: string;
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Scenario 1: Speculative Inheritance Allocation",
    query: "I just inherited $50,000. Astrology says my 11th house is favorable. Should I put it all into cryptocurrency tomorrow?",
    options: [
      {
        text: "Direct predicting (Incorrect): 'Yes, your 11th house is awake. Speculative crypto will double your wealth.'",
        isCorrect: false,
        feedback: "Incorrect: Astrologers must never make speculative product picks or give financial investment recommendations.",
        phrase: ""
      },
      {
        text: "Ethical Routing (Correct): Route the client to a certified financial advisor to assess risk profile, while confirming the timing window is generally supportive.",
        isCorrect: true,
        feedback: "Correct! Confirming general supportive timing trends while routing the asset pick is the ethical standard.",
        phrase: "Your chart displays supportive timing trends. However, specific asset allocation and risk management should be guided by a certified financial planner."
      }
    ]
  },
  {
    id: 2,
    title: "Scenario 2: Client Financial & Mental Distress",
    query: "I lost my job, facing immediate eviction next week, and honestly, I feel like there's no reason to live anymore. Can you predict if things will get better?",
    options: [
      {
        text: "Direct prediction (Incorrect): 'Don't worry, your next Dasha is Jupiter. You will find a job next month, just hold on.'",
        isCorrect: false,
        feedback: "Incorrect: Evasion or trivializing deep distress with planetary promises is highly dangerous and violates Ahimsa (do no harm).",
        phrase: ""
      },
      {
        text: "Distress Care Routing (Correct): Offer immediate compassionate care, refer to mental health support/suicide prevention hotlines, and credit counseling.",
        isCorrect: true,
        feedback: "Correct! Ahimsa demands prioritizing safety and routing human distress to crisis services immediately.",
        phrase: "I hear how heavy this is. Please contact immediate support services (988 hotline) or a crisis counselor. We can review timing only when your immediate housing and health are secure."
      }
    ]
  },
  {
    id: 3,
    title: "Scenario 3: Specific Tax Planning Query",
    query: "Which mutual fund option under Section 80C should I choose to reduce my tax liability this fiscal year?",
    options: [
      {
        text: "Vague astrological advice (Incorrect): 'Mercury rules tax documents. Choose a fund ruled by Mercury like IT or communications.'",
        isCorrect: false,
        feedback: "Incorrect: Astrologers lack training in tax regulations. Refer all tax liability questions to a certified accountant.",
        phrase: ""
      },
      {
        text: "Accountant Referral (Correct): State that tax planning requires CPA/CA calculation, declining direct fund picking.",
        isCorrect: true,
        feedback: "Correct! Preservation of competence boundaries requires referring tax positions to chartered accountants.",
        phrase: "Tax planning and filing configurations require detailed accounting calculations. I recommend routing this Section 80C decision to a qualified chartered accountant."
      }
    ]
  }
];

export function EthicalScopeRoutingDashboard() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const currentScenario = SCENARIOS[activeScenarioIdx];

  const handleSelectOption = (optIdx: number) => {
    setAnswers({
      ...answers,
      [currentScenario.id]: optIdx
    });
  };

  // Calculate Ethics Index (0 to 100)
  const ethicsIndex = useMemo(() => {
    const solvedCount = Object.keys(answers).length;
    if (solvedCount === 0) return 0;
    
    let correctCount = 0;
    SCENARIOS.forEach((s) => {
      const ansIdx = answers[s.id];
      if (ansIdx !== undefined && s.options[ansIdx].isCorrect) {
        correctCount++;
      }
    });

    return Math.round((correctCount / SCENARIOS.length) * 100);
  }, [answers]);

  const activeSelectedOption = answers[currentScenario.id] !== undefined ? currentScenario.options[answers[currentScenario.id]] : null;

  const copyPhrasing = () => {
    if (!activeSelectedOption || !activeSelectedOption.phrase) return;
    navigator.clipboard.writeText(activeSelectedOption.phrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strokeDashoffset = useMemo(() => {
    const circumference = 2 * Math.PI * 30;
    return circumference - (ethicsIndex / 100) * circumference;
  }, [ethicsIndex]);

  return (
    <div
      className="p-6 md:p-8 rounded-xl border my-6 shadow-sm font-sans animate-fade-in"
      style={{
        backgroundColor: SURFACE,
        borderColor: HAIRLINE,
        color: INK_PRIMARY,
      }}
      data-interactive="ethical-scope-routing-dashboard"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-amber-900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Ethical Scope & Referral Router
          </h2>
          <p className="text-xs italic text-gray-600">
            Module 5, Chapter 6: Adhikara boundaries, tax planning, and distress counseling referrals.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-800/10 px-3 py-1 rounded-full text-[10px] font-bold text-amber-800 border border-amber-800/20">
          <Sparkles size={11} className="animate-pulse" />
          ACTIVE ETHICS CHECK
        </div>
      </div>

      {/* Sanskrit Verse with breakdowns */}
      <div className="mb-6 p-4 rounded-xl border bg-white shadow-sm text-center relative" style={{ borderColor: HAIRLINE }}>
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold text-gray-400 tracking-wider">
          Scriptural Boundary Maxim (Click words for translation)
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
        {/* Left Column: controls */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tabs for scenarios */}
          <div className="flex gap-2 border-b pb-2" style={{ borderColor: HAIRLINE }}>
            {SCENARIOS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveScenarioIdx(idx)}
                className={`px-3 py-1 text-xs font-bold rounded border cursor-pointer transition-all ${
                  activeScenarioIdx === idx ? "bg-amber-850 text-white" : "bg-transparent text-gray-500 hover:bg-amber-50"
                }`}
                style={{ borderColor: HAIRLINE }}
              >
                Case {s.id}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl border bg-white shadow-sm space-y-4" style={{ borderColor: HAIRLINE }}>
            <div>
              <span className="text-[9px] uppercase font-bold text-gray-400 block mb-1">Client Query:</span>
              <p className="text-xs font-bold text-gray-800 italic">"{currentScenario.query}"</p>
            </div>

            {/* Options */}
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: HAIRLINE }}>
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1.5">Select Practitioner Action:</label>
              <div className="space-y-2">
                {currentScenario.options.map((opt, oIdx) => {
                  const isSelected = answers[currentScenario.id] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full p-3 rounded border text-left text-xs font-bold transition-all cursor-pointer ${
                        isSelected 
                          ? opt.isCorrect 
                            ? "bg-green-100 border-green-500 text-green-950 scale-[1.01]" 
                            : "bg-red-100 border-red-500 text-red-950 scale-[1.01]"
                          : "bg-transparent hover:bg-amber-50/20 border-gray-200"
                      }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ethics speedometer gauge */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center min-h-[220px]" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] uppercase font-bold text-gray-400 block border-b pb-1 w-full text-center mb-6">
              Ethics & Adhikara Gauge
            </span>

            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="30" fill="transparent" stroke="#f3f4f6" strokeWidth="8" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="30" 
                  fill="transparent" 
                  stroke={ethicsIndex >= 66 ? "#15803d" : "#d97706"} 
                  strokeWidth="8" 
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-amber-900">{ethicsIndex}%</span>
                <span className="text-[8px] text-gray-400 block font-bold uppercase tracking-wider">Index</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-amber-900 block mt-4 text-center">
              {ethicsIndex === 100 ? "Verified Adhikara Seal" : "Pending Verification"}
            </span>
          </div>
        </div>
      </div>

      {/* Choice feedback and phrasing register */}
      {activeSelectedOption && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border leading-relaxed text-xs font-semibold ${
            activeSelectedOption.isCorrect ? "bg-green-50 border-green-200 text-green-950" : "bg-red-50 border-red-200 text-red-950"
          }`}>
            {activeSelectedOption.feedback}
          </div>

          {activeSelectedOption.isCorrect && activeSelectedOption.phrase && (
            <div className="p-4 rounded-xl border bg-white shadow-sm space-y-3 animate-fade-in" style={{ borderColor: HAIRLINE }}>
              <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: HAIRLINE }}>
                <div>
                  <span className="text-[9px] uppercase tracking-wider block text-gray-400 font-bold">
                    Calibrated Interpretations
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium italic">
                    Copy referral routing statement for client communication
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
              <blockquote className="text-xs italic text-gray-600 border-l-2 pl-3 py-1 bg-amber-50/10" style={{ borderColor: GOLD }}>
                "{activeSelectedOption.phrase}"
              </blockquote>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
