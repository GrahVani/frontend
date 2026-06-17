"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, AlertTriangle, ShieldCheck, Heart } from "lucide-react";
import { goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5C3D26)";
const GOLD = "#A8821E";
const VERMILION = "#A23A1E";
const GREEN = "#2E7D32";

interface Scenario {
  title: string;
  configText: string;
  paralysisText: string;
  empowermentText: string;
  paralysisAnxiety: number;
  paralysisAgency: number;
  empowermentAnxiety: number;
  empowermentAgency: number;
  violatedRules: string[];
  upheldRules: string[];
  explanation: string;
}

const INK_MUTED = "var(--gl-ink-muted, #7C6D5B)";

const HOUSE_PATHS = {
  1: "M 100,0 L 50,50 L 100,100 L 150,50 Z",
  2: "M 0,0 L 100,0 L 50,50 Z",
  3: "M 0,0 L 0,100 L 50,50 Z",
  4: "M 0,100 L 50,50 L 100,100 L 50,150 Z",
  5: "M 0,200 L 0,100 L 50,150 Z",
  6: "M 0,200 L 100,200 L 50,150 Z",
  7: "M 100,200 L 50,150 L 100,100 L 150,150 Z",
  8: "M 200,200 L 100,200 L 150,150 Z",
  9: "M 200,200 L 200,100 L 150,150 Z",
  10: "M 200,100 L 150,50 L 100,100 L 150,150 Z",
  11: "M 200,0 L 200,100 L 150,50 Z",
  12: "M 200,0 L 100,0 L 150,50 Z"
};

const HOUSE_CENTROIDS = {
  1: { x: 100, y: 50 },
  2: { x: 50, y: 16.67 },
  3: { x: 16.67, y: 50 },
  4: { x: 50, y: 100 },
  5: { x: 16.67, y: 150 },
  6: { x: 50, y: 183.33 },
  7: { x: 100, y: 150 },
  8: { x: 150, y: 183.33 },
  9: { x: 183.33, y: 150 },
  10: { x: 150, y: 100 },
  11: { x: 183.33, y: 50 },
  12: { x: 150, y: 16.67 }
};

const PERFECT_LABEL_POS = {
  1: { x: 100, y: 24 },
  2: { x: 30, y: 16 },
  3: { x: 16, y: 30 },
  4: { x: 24, y: 100 },
  5: { x: 16, y: 170 },
  6: { x: 30, y: 184 },
  7: { x: 100, y: 176 },
  8: { x: 170, y: 184 },
  9: { x: 184, y: 170 },
  10: { x: 176, y: 100 },
  11: { x: 184, y: 30 },
  12: { x: 170, y: 16 }
};

interface Scenario {
  title: string;
  configText: string;
  paralysisText: string;
  empowermentText: string;
  paralysisAnxiety: number;
  paralysisAgency: number;
  empowermentAnxiety: number;
  empowermentAgency: number;
  violatedRules: string[];
  upheldRules: string[];
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    title: "Sāḍhe-Sāti Transit",
    configText: "Saturn is transiting the 12th, 1st, and 2nd houses from the natal Moon.",
    paralysisText: "You are about to enter seven-and-a-half years of absolute destruction. Saturn will destroy your marriage, ruin your finances, and there is significant indication of serious illness or death. You must commission a Śani-Śānti-pūjā worth ₹85,000 immediately to ward off this disaster.",
    empowermentText: "You are entering Sāḍhe-Sāti. This is a time of consolidation and restructuring, asking for patience and long-term priority planning rather than rapid expansion. Domains of home and career will ask for foundational work. Avoid costly rituals; focus on practical adjustments.",
    paralysisAnxiety: 95,
    paralysisAgency: 5,
    empowermentAnxiety: 25,
    empowermentAgency: 90,
    violatedRules: [
      "Rule 2: Fear-mongering to extract remedial fees",
      "Rule 3: Using paralysis language that blocks agency"
    ],
    upheldRules: [
      "Rule 2: Explaining Saturn's transit values honestly without scare-tactics",
      "Rule 3: Reframing transit as a period of structured consolidation"
    ],
    explanation: "Sāḍhe-Sāti is a standard planetary cycle. Presenting it as a catastrophic curse to extract high fees directly violates Ahiṁsā by inducing financial and emotional panic, leaving the client helpless rather than informed."
  },
  {
    title: "Maṅgla-Doṣa Marriage",
    configText: "Mars is situated in the 7th house of relationships.",
    paralysisText: "Your marriage is cursed. Your spouse will face severe misfortune or sudden death unless you perform a major Mangal Puja at a specific temple costing ₹50,000. Do not marry until this ritual is complete.",
    empowermentText: "Mars in the 7th house highlights active energy in relationships, requiring conscious communication and boundary negotiation. Since there are multiple cancellation conditions in your chart, focus on building strong relational habits and practicing patience rather than fearing a curse.",
    paralysisAnxiety: 90,
    paralysisAgency: 10,
    empowermentAnxiety: 15,
    empowermentAgency: 85,
    violatedRules: [
      "Rule 2: Creating a marriage-block fear-trap",
      "Rule 3: Declaring an absolute curse without cancellation conditions"
    ],
    upheldRules: [
      "Rule 2: Acknowledging relationship energy honestly",
      "Rule 3: Focus on active communication as relationship practice"
    ],
    explanation: "Maṅgla-Doṣa contains numerous scriptural cancellation conditions (bhaṅgas). Suppressing these cancellations to manufacture marriage-paralysis is an ethical violation designed to feed client dependency."
  },
  {
    title: "Serious Illness Risk",
    configText: "The active Daśā lord activates a heavily afflicted 8th house.",
    paralysisText: "There is significant indication of serious illness or death in the next eighteen months. You should prepare your family; your life is coming to a close.",
    empowermentText: "The chart indicates a period requiring higher-than-baseline health attention. Please schedule a comprehensive check-up with your physician, focus on lifestyle factors like rest and diet, and prioritize stress management. Astrology supplements but does not replace medical care.",
    paralysisAnxiety: 100,
    paralysisAgency: 0,
    empowermentAnxiety: 30,
    empowermentAgency: 95,
    violatedRules: [
      "Rule 1: Predicting specific death-dates and timelines",
      "Rule 4: Failure to refer to medical professionals"
    ],
    upheldRules: [
      "Rule 1: Protecting client psychological safety by refusing death predictions",
      "Rule 4: Pointing client immediately to a primary physician"
    ],
    explanation: "Predicting specific death-dates is strictly forbidden in Jyotiṣa ethics. True ahiṁsā translates potential health vulnerability into immediate, actionable medical preventive care."
  }
];

export function DoNoHarmAhimsa() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isEmpowered, setIsEmpowered] = useState<boolean>(false);

  const scenario = SCENARIOS[activeIdx];
  const activeAnxiety = isEmpowered ? scenario.empowermentAnxiety : scenario.paralysisAnxiety;
  const activeAgency = isEmpowered ? scenario.empowermentAgency : scenario.paralysisAgency;

  return (
    <div
      className="w-full animate-fadeIn"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${goldOnGlassHairline}`,
        borderRadius: 16,
        padding: "24px 26px 20px",
        color: INK_PRIMARY,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        boxShadow: "0 14px 40px rgba(62, 42, 31, 0.08)",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 border-b pb-4" style={{ borderColor: HAIRLINE }}>
        <div className="flex items-center gap-2">
          <Heart size={16} color={VERMILION} fill={VERMILION} className="animate-pulse" />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Ethics & Speech Reframer
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Ahiṁsā Reading Reframer & Sentiment Lab
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Select common difficult chart configurations and contrast fear-mongering statements with compassionate, empowerment-oriented reframings.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl mb-6" style={{ background: SURFACE_2 }}>
        {SCENARIOS.map((s, idx) => (
          <button
            key={s.title}
            onClick={() => {
              setActiveIdx(idx);
              setIsEmpowered(false);
            }}
            className="flex-1 min-w-[120px] py-2 px-3 rounded-lg border text-center transition-all text-xs font-bold"
            style={{
              background: activeIdx === idx ? SURFACE : "transparent",
              borderColor: activeIdx === idx ? GOLD : "transparent",
              color: activeIdx === idx ? INK_PRIMARY : INK_SECONDARY,
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Side: Speech Contrast Panel */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border flex flex-col gap-2" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Chart Configuration
            </span>
            <p className="m-0 text-xs font-semibold leading-relaxed" style={{ color: INK_PRIMARY }}>
              {scenario.configText}
            </p>

            {/* Visual SVG Kundali Sim */}
            <div className="flex justify-center rounded-xl p-3 my-2 relative overflow-hidden border bg-white" style={{ borderColor: HAIRLINE }}>
              <svg width="180" height="180" viewBox="0 0 200 200" className="block">
                <rect x="0" y="0" width="200" height="200" fill="none" stroke="rgba(168, 130, 30, 0.3)" strokeWidth="1.5" rx="4" />
                
                {/* Diagonals */}
                <line x1="0" y1="0" x2="200" y2="200" stroke="rgba(168, 130, 30, 0.2)" strokeWidth="1" />
                <line x1="200" y1="0" x2="0" y2="200" stroke="rgba(168, 130, 30, 0.2)" strokeWidth="1" />
                
                {/* Inner diamond */}
                <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(168, 130, 30, 0.2)" strokeWidth="1" />
                <line x1="0" y1="100" x2="100" y2="200" stroke="rgba(168, 130, 30, 0.2)" strokeWidth="1" />
                <line x1="100" y1="200" x2="200" y2="100" stroke="rgba(168, 130, 30, 0.2)" strokeWidth="1" />
                <line x1="200" y1="100" x2="100" y2="0" stroke="rgba(168, 130, 30, 0.2)" strokeWidth="1" />

                {(Object.keys(HOUSE_PATHS) as Array<unknown> as number[]).map((h) => {
                  const pathStr = HOUSE_PATHS[h as keyof typeof HOUSE_PATHS];
                  const pos = PERFECT_LABEL_POS[h as keyof typeof PERFECT_LABEL_POS];
                  const centroid = HOUSE_CENTROIDS[h as keyof typeof HOUSE_CENTROIDS];
                  
                  let lagnaSign = 1;
                  if (activeIdx === 1) lagnaSign = 8;
                  if (activeIdx === 2) lagnaSign = 5;
                  const currentRashi = (lagnaSign + h - 2) % 12 + 1;
                  
                  let planetsText = "";
                  if (activeIdx === 0) {
                    if (h === 2) planetsText = "Mo";
                    if (h === 1) planetsText = "Sa";
                  } else if (activeIdx === 1) {
                    if (h === 7) planetsText = "Ma";
                    if (h === 3) planetsText = "Ju";
                  } else if (activeIdx === 2) {
                    if (h === 6) planetsText = "Su Sa Ra";
                  }

                  return (
                    <g key={h}>
                      <path d={pathStr} fill="none" stroke="rgba(168, 130, 30, 0.08)" strokeWidth="1" />
                      <text x={centroid.x} y={centroid.y - 7} fill={INK_MUTED} fontSize="9" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                        {currentRashi}
                      </text>
                      <text x={pos.x} y={pos.y} fill="rgba(168, 130, 30, 0.4)" fontSize="6" textAnchor="middle" dominantBaseline="central">
                        {`H${h}`}
                      </text>
                      {planetsText && (
                        <text x={centroid.x} y={centroid.y + 7} fill={planetsText.includes("Sa") || planetsText.includes("Ma") ? VERMILION : planetsText.includes("Ju") ? GREEN : INK_PRIMARY} fontSize="8.5" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                          {planetsText}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Aspect lines */}
                {activeIdx === 0 && (
                  <g>
                    <line x1="100" y1="50" x2="16.67" y2="50" stroke={!isEmpowered ? VERMILION : GOLD} strokeWidth={!isEmpowered ? 1.5 : 1} strokeDasharray={!isEmpowered ? "none" : "2,2"} />
                    <line x1="100" y1="50" x2="100" y2="150" stroke={!isEmpowered ? VERMILION : GOLD} strokeWidth={!isEmpowered ? 1.5 : 1} strokeDasharray={!isEmpowered ? "none" : "2,2"} />
                    <line x1="100" y1="50" x2="183.33" y2="50" stroke={!isEmpowered ? VERMILION : GOLD} strokeWidth={!isEmpowered ? 1.5 : 1} strokeDasharray={!isEmpowered ? "none" : "2,2"} />
                    {!isEmpowered && (
                      <text x="100" y="80" fill={VERMILION} fontSize="7" fontWeight="bold" textAnchor="middle">OMINOUS ASPECTS</text>
                    )}
                  </g>
                )}

                {activeIdx === 1 && (
                  <g>
                    <line x1="100" y1="150" x2="150" y2="100" stroke={!isEmpowered ? VERMILION : "rgba(168,130,30,0.2)"} strokeWidth="1" />
                    <line x1="100" y1="150" x2="100" y2="50" stroke={!isEmpowered ? VERMILION : "rgba(168,130,30,0.2)"} strokeWidth="1" />
                    <line x1="100" y1="150" x2="50" y2="16.67" stroke={!isEmpowered ? VERMILION : "rgba(168,130,30,0.2)"} strokeWidth="1" />
                    {isEmpowered && (
                      <>
                        <line x1="16.67" y1="50" x2="100" y2="150" stroke={GREEN} strokeWidth="1.8" strokeDasharray="3,2" />
                        <text x="60" y="110" fill={GREEN} fontSize="7" fontWeight="bold" textAnchor="middle" transform="rotate(50 60 110)">Guru Aspect</text>
                      </>
                    )}
                  </g>
                )}

                {activeIdx === 2 && (
                  <g>
                    <line x1="50" y1="183.33" x2="100" y2="50" stroke={!isEmpowered ? VERMILION : GREEN} strokeWidth="1.8" strokeDasharray={!isEmpowered ? "none" : "4,2"} />
                    <text x="75" y="110" fill={!isEmpowered ? VERMILION : GREEN} fontSize="7" fontWeight="bold" textAnchor="middle">
                      {!isEmpowered ? "DOOM RAY" : "VIGILANCE"}
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2 justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>
                Select Delivery Style
              </span>
              <div className="flex gap-1 bg-stone-100 p-0.5 rounded-lg" style={{ background: SURFACE_2 }}>
                <button
                  onClick={() => setIsEmpowered(false)}
                  className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all"
                  style={{
                    background: !isEmpowered ? VERMILION : "transparent",
                    color: !isEmpowered ? "#FFFFFF" : INK_SECONDARY,
                  }}
                >
                  Paralysis (Fear)
                </button>
                <button
                  onClick={() => setIsEmpowered(true)}
                  className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all"
                  style={{
                    background: isEmpowered ? GREEN : "transparent",
                    color: isEmpowered ? "#FFFFFF" : INK_SECONDARY,
                  }}
                >
                  Empowerment (Ahiṁsā)
                </button>
              </div>
            </div>

            <div
              className="p-4 rounded-xl border transition-all duration-300 min-h-[120px] flex flex-col justify-between"
              style={{
                background: SURFACE,
                borderColor: isEmpowered ? `${GREEN}44` : `${VERMILION}44`,
                boxShadow: isEmpowered ? `0 4px 12px ${GREEN}08` : `0 4px 12px ${VERMILION}08`,
              }}
            >
              <p className="m-0 text-xs leading-relaxed" style={{ color: INK_PRIMARY }}>
                {isEmpowered ? scenario.empowermentText : scenario.paralysisText}
              </p>
              <div className="mt-3 flex items-center gap-2 border-t pt-2.5 text-[10px]" style={{ borderColor: HAIRLINE }}>
                {isEmpowered ? (
                  <>
                    <ShieldCheck size={14} color={GREEN} />
                    <span className="font-bold" style={{ color: GREEN }}>Ahiṁsā Compliant</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={14} color={VERMILION} />
                    <span className="font-bold" style={{ color: VERMILION }}>Ahiṁsā Violation</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sentiment Lab Meters & Feedback */}
        <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
          <div>
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Client Sentiment & Impact Lab
              </span>
            </div>

            {/* Anxiety Meter */}
            <div className="mb-4 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span>Anxiety & Paralysis Level:</span>
                <span style={{ color: activeAnxiety > 50 ? VERMILION : GREEN }}>{activeAnxiety}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                <motion.div
                  className="h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${activeAnxiety}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{
                    background: activeAnxiety > 50 ? VERMILION : GOLD,
                  }}
                />
              </div>
            </div>

            {/* Agency Meter */}
            <div className="mb-6 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span>Agency & Empowerment Level:</span>
                <span style={{ color: activeAgency > 50 ? GREEN : VERMILION }}>{activeAgency}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                <motion.div
                  className="h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${activeAgency}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{
                    background: activeAgency > 50 ? GREEN : GOLD,
                  }}
                />
              </div>
            </div>

            {/* Rules Check */}
            <div className="mb-4 rounded-lg p-3 text-[11px]" style={{ background: SURFACE_2 }}>
              <span className="font-bold block mb-1.5" style={{ color: isEmpowered ? GREEN : VERMILION }}>
                {isEmpowered ? "Upholding Rules:" : "Violations Detected:"}
              </span>
              <ul className="m-0 pl-4 list-disc space-y-1 leading-normal" style={{ color: INK_SECONDARY }}>
                {(isEmpowered ? scenario.upheldRules : scenario.violatedRules).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg p-3 text-[11px] leading-relaxed border flex flex-col gap-1" style={{
            background: SURFACE_2,
            borderColor: HAIRLINE,
          }}>
            <div className="flex items-center gap-1 font-bold" style={{ color: GOLD }}>
              <Compass size={12} />
              <span>Astrological Insight</span>
            </div>
            <p className="m-0" style={{ color: INK_SECONDARY }}>
              {scenario.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Sloka Block Footer */}
      <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: HAIRLINE }}>
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Yoga Sūtra 2.35 — The Standard of Established Ahiṁsā
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          अहिंसाप्रतिष्ठायां तत्सन्निधौ वैरत्यागः॥ २.३५॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          ahiṁsā-pratiṣṭhāyāṁ tat-sannidhau vaira-tyāgaḥ || 2.35 ||
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;When non-harming is established in the practitioner, all hostility abates in their presence.&rdquo;
        </p>
      </div>
    </div>
  );
}
