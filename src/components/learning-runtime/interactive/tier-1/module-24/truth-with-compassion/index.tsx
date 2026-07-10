"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, AlertCircle, Compass } from "lucide-react";
import { goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5C3D26)";
const GOLD = "#A8821E";
const VERMILION = "#A23A1E";
const GREEN = "#2E7D32";

interface SpeechOption {
  label: string;
  text: string;
  truth: number;
  compassion: number;
  agency: number;
  manuSatyam: boolean;
  manuPriyam: boolean;
  manuNaApriyam: boolean;
  manuNaAnritam: boolean;
  feedback: string;
}

interface SpeechScenario {
  query: string;
  context: string;
  options: Record<string, SpeechOption>;
}

const SCENARIOS: Record<string, SpeechScenario> = {
  illness: {
    query: "Will I be alive a year from now?",
    context: "Client is in late 50s; chart shows severe 8th house affliction indicating major cardiovascular risk over the next 18 months.",
    options: {
      brutal: {
        label: "Brutal Honesty",
        text: "Your chart shows significant indications of life-threatening risk in the next eighteen months. The probability of mortality is high. You should prepare your family.",
        truth: 100,
        compassion: 10,
        agency: 5,
        manuSatyam: true,
        manuPriyam: false,
        manuNaApriyam: false,
        manuNaAnritam: true,
        feedback: "Violates 'na brūyāt satyam apriyam' (do not speak the unpleasant truth). Weaponising a difficult chart fact without providing a constructive pathway only paralyzes the client with fear."
      },
      flattery: {
        label: "Comforting Lie",
        text: "Your chart shows long life and good health; do not worry. You will be alive and well.",
        truth: 10,
        compassion: 90,
        agency: 20,
        manuSatyam: false,
        manuPriyam: true,
        manuNaApriyam: true,
        manuNaAnritam: false,
        feedback: "Violates 'priyaṁ ca nānṛtaṁ brūyāt' (do not speak the agreeable falsehood). Providing false reassurance is dangerous; the client might neglect genuine medical care."
      },
      balanced: {
        label: "Daivajña Speech",
        text: "I do not predict specific death-dates, as it causes unnecessary harm. What your chart does show is that the next eighteen months require high health vigilance. I strongly recommend scheduling a comprehensive medical check-up, managing stress, and adjusting lifestyle factors soon.",
        truth: 100,
        compassion: 100,
        agency: 100,
        manuSatyam: true,
        manuPriyam: true,
        manuNaApriyam: true,
        manuNaAnritam: true,
        feedback: "Upholds the entire Manu Smṛti speech dharma. Refusing fatalistic predictions and pairing the indication with immediate, actionable medical referral preserves truth, compassion, and agency."
      }
    }
  },
  relationship: {
    query: "Will my marriage be unhappy?",
    context: "Client has Mars in the 7th house and Saturn aspecting it. They are anxious about relational conflict.",
    options: {
      brutal: {
        label: "Brutal Honesty",
        text: "Yes, Mars in the 7th house and Saturn aspecting it is a clear signature of relational misery and divorce. You cannot avoid it.",
        truth: 40,
        compassion: 15,
        agency: 5,
        manuSatyam: false,
        manuPriyam: false,
        manuNaApriyam: false,
        manuNaAnritam: true,
        feedback: "Violates 'na brūyāt satyam apriyam' and is astrologically false in asserting determinism without factoring in cancellation rules (bhaṅgas) or personal effort."
      },
      flattery: {
        label: "Comforting Lie",
        text: "Do not worry at all! A simple mantra will erase all Mars issues and make your marriage absolutely perfect and conflict-free.",
        truth: 20,
        compassion: 95,
        agency: 30,
        manuSatyam: false,
        manuPriyam: true,
        manuNaApriyam: true,
        manuNaAnritam: false,
        feedback: "Violates 'priyaṁ ca nānṛtaṁ brūyāt'. It promises a magical shortcut, denying the real work and compromise required in challenging relationship transits."
      },
      balanced: {
        label: "Daivajña Speech",
        text: "This configuration suggests relational domain work, meaning a happy marriage will depend heavily on deliberate communication, clear boundary negotiation, and active mutual effort rather than on automatic harmony. Treat it as a relational practice; consider proactive pre-marital counselling.",
        truth: 100,
        compassion: 100,
        agency: 100,
        manuSatyam: true,
        manuPriyam: true,
        manuNaApriyam: true,
        manuNaAnritam: true,
        feedback: "Perfect. Interprets the configuration as a skill practice rather than a fatal curse, preserving the astrological indication while restoring client agency."
      }
    }
  },
  business: {
    query: "Should I invest in this new venture now?",
    context: "Proposed launch window shows severe 2nd (wealth) and 11th (gains) house afflictions in transits.",
    options: {
      brutal: {
        label: "Brutal Honesty",
        text: "No, your financial houses are severely afflicted. If you invest now, you will fail completely and go bankrupt.",
        truth: 70,
        compassion: 20,
        agency: 10,
        manuSatyam: true,
        manuPriyam: false,
        manuNaApriyam: false,
        manuNaAnritam: true,
        feedback: "Violates 'na brūyāt satyam apriyam'. Delivers a difficult forecast in an alarmist framing that paralyses the client rather than suggesting timing shifts or margin-of-safety adjustments."
      },
      flattery: {
        label: "Comforting Lie",
        text: "Go ahead, trust your gut! The universe always rewards courage, and a lucky stone will take care of any planetary friction.",
        truth: 15,
        compassion: 90,
        agency: 40,
        manuSatyam: false,
        manuPriyam: true,
        manuNaApriyam: true,
        manuNaAnritam: false,
        feedback: "Violates 'priyaṁ ca nānṛtaṁ brūyāt'. A flattering falsehood that encourages reckless financial risk, directly violating the practitioner's duty of care."
      },
      balanced: {
        label: "Daivajña Speech",
        text: "The proposed launch window shows substantial financial stress indications. While success is not impossible, it would require a much larger cash margin of safety. Alternatively, waiting seven months allows these transits to clear, offering a much more supportive window.",
        truth: 100,
        compassion: 100,
        agency: 100,
        manuSatyam: true,
        manuPriyam: true,
        manuNaApriyam: true,
        manuNaAnritam: true,
        feedback: "Excellent. Delivers the financial warning clearly and offers two actionable alternatives (higher safety margin or a specific timing shift) to empower their choice."
      }
    }
  },
  timing: {
    query: "When will I get married?",
    context: "Client wants an exact wedding date, but the chart is under-determined and only shows supportive general periods.",
    options: {
      brutal: {
        label: "Brutal Honesty",
        text: "You will marry on June 14, 2028, between 2 PM and 4 PM, with a person born in March 1996.",
        truth: 20,
        compassion: 50,
        agency: 10,
        manuSatyam: false,
        manuPriyam: false,
        manuNaApriyam: true,
        manuNaAnritam: true,
        feedback: "Violates 'satyaṁ' (truth). Fabricating extreme precision about details the chart cannot reliably provide is a subtle form of untruth."
      },
      flattery: {
        label: "Comforting Lie",
        text: "You will get married very, very soon to a wealthy soulmate who matches every single dream of yours.",
        truth: 10,
        compassion: 95,
        agency: 40,
        manuSatyam: false,
        manuPriyam: true,
        manuNaApriyam: true,
        manuNaAnritam: false,
        feedback: "Violates 'priyaṁ ca nānṛtaṁ brūyāt'. Comforting flattery designed to satisfy immediate client desires while offering zero realistic timeline context."
      },
      balanced: {
        label: "Daivajña Speech",
        text: "The Venus-Jupiter period (running through 2027) and the Jupiter-Moon period (2028 onward) are the most astrologically supportive windows for marriage-formation. The chart cannot predict a specific day or spouse identity, so I advise actively engaging in relational contexts during these supportive periods.",
        truth: 100,
        compassion: 100,
        agency: 100,
        manuSatyam: true,
        manuPriyam: true,
        manuNaApriyam: true,
        manuNaAnritam: true,
        feedback: "Excellent. Follows the uncertainty-honesty rule. It clearly details what is highly probable versus what is silent/undetermined, avoiding false precision."
      }
    }
  }
};

export function TruthWithCompassion() {
  const [activeQuery, setActiveQuery] = useState<string>("illness");
  const [activeOptionKey, setActiveOptionKey] = useState<string>("brutal");

  const scenario = SCENARIOS[activeQuery];
  const option = scenario.options[activeOptionKey];

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
          <MessageSquare size={16} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Speech-Discipline Matrix
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Daivajña Speech Matrix & Manu-Test Simulator
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Master the art of delivering true, difficult astrological forecasts without weaponisation and without comforting falsehood.
        </p>
      </div>

      {/* Query Selector */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl mb-6" style={{ background: SURFACE_2 }}>
        {Object.entries(SCENARIOS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => {
              setActiveQuery(key);
              setActiveOptionKey("brutal");
            }}
            className="flex-1 min-w-[120px] py-2 px-3 rounded-lg border text-center transition-all text-xs font-bold"
            style={{
              background: activeQuery === key ? SURFACE : "transparent",
              borderColor: activeQuery === key ? GOLD : "transparent",
              color: activeQuery === key ? INK_PRIMARY : INK_SECONDARY,
            }}
          >
            {s.query}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        
        {/* Left: Client Query & Response Selection */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Client Query context
            </span>
            <p className="m-0 text-xs text-stone-600" style={{ color: INK_SECONDARY }}>
              {scenario.context}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>
              Select Response style to Evaluate
            </span>
            <div className="flex gap-2">
              {Object.entries(scenario.options).map(([key, opt]) => (
                <button
                  key={key}
                  onClick={() => setActiveOptionKey(key)}
                  className="flex-1 py-2 rounded-lg border text-center transition-all text-xs font-bold"
                  style={{
                    background: activeOptionKey === key ? SURFACE_2 : SURFACE,
                    borderColor: activeOptionKey === key ? GOLD : HAIRLINE,
                    color: activeOptionKey === key ? INK_PRIMARY : INK_SECONDARY,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div
              className="p-4 rounded-xl border min-h-[140px] flex flex-col justify-between"
              style={{
                background: SURFACE,
                borderColor: activeOptionKey === "balanced" ? `${GREEN}44` : `${VERMILION}44`,
              }}
            >
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider block mb-2" style={{ color: activeOptionKey === "balanced" ? GREEN : VERMILION }}>
                  Speech Output
                </span>
                <p className="m-0 text-xs leading-relaxed italic" style={{ color: INK_PRIMARY }}>
                  &ldquo;{option.text}&rdquo;
                </p>
              </div>

              <div className="mt-4 border-t pt-2.5 flex flex-col gap-1 text-[11px]" style={{ borderColor: HAIRLINE }}>
                <span className="font-bold flex items-center gap-1" style={{ color: activeOptionKey === "balanced" ? GREEN : VERMILION }}>
                  {activeOptionKey === "balanced" ? (
                    <>
                      <CheckCircle2 size={13} />
                      <span>Dharmic Alignment achieved</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={13} />
                      <span>Ethical Deficit detected</span>
                    </>
                  )}
                </span>
                <p className="m-0 text-[10px]" style={{ color: INK_SECONDARY }}>
                  {option.feedback}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Manu Test Meters */}
        <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
          <div>
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Manu Smṛti 4.138 speech gates
              </span>
            </div>

            {/* Visual SVG Speech Compass Flow Chart */}
            <div className="flex justify-center rounded-xl p-4 mb-4 border bg-white" style={{ borderColor: HAIRLINE }}>
              <svg viewBox="0 0 240 170" className="w-full max-w-[420px] h-auto block">
                {/* Connecting Lines */}
                <path
                  d="M 20 85 L 60 45 L 180 45 L 60 125 L 180 125 L 220 85"
                  fill="none"
                  stroke={activeOptionKey === "balanced" ? GREEN : "rgba(168,130,30,0.15)"}
                  strokeWidth="3"
                />

                {/* Gate 1: Satyam */}
                <g transform="translate(60, 45)">
                  <circle cx="0" cy="0" r="19" fill={option.manuSatyam ? "rgba(46,125,50,0.15)" : "rgba(162,58,30,0.15)"} stroke={option.manuSatyam ? GREEN : VERMILION} strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill={option.manuSatyam ? GREEN : VERMILION}>Satya</text>
                  <text x="0" y="-25" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill={INK_PRIMARY}>Gate 1</text>
                </g>

                {/* Gate 2: Priyam */}
                <g transform="translate(180, 45)">
                  <circle cx="0" cy="0" r="19" fill={option.manuPriyam ? "rgba(46,125,50,0.15)" : "rgba(162,58,30,0.15)"} stroke={option.manuPriyam ? GREEN : VERMILION} strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill={option.manuPriyam ? GREEN : VERMILION}>Priya</text>
                  <text x="0" y="-25" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill={INK_PRIMARY}>Gate 2</text>
                </g>

                {/* Gate 3: Na Apriyam */}
                <g transform="translate(60, 125)">
                  <circle cx="0" cy="0" r="19" fill={option.manuNaApriyam ? "rgba(46,125,50,0.15)" : "rgba(162,58,30,0.15)"} stroke={option.manuNaApriyam ? GREEN : VERMILION} strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill={option.manuNaApriyam ? GREEN : VERMILION}>Apriya</text>
                  <text x="0" y="-25" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill={INK_PRIMARY}>Gate 3</text>
                </g>

                {/* Gate 4: Priyam Nanritam */}
                <g transform="translate(180, 125)">
                  <circle cx="0" cy="0" r="19" fill={option.manuNaAnritam ? "rgba(46,125,50,0.15)" : "rgba(162,58,30,0.15)"} stroke={option.manuNaAnritam ? GREEN : VERMILION} strokeWidth="2" />
                  <text x="0" y="4" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill={option.manuNaAnritam ? GREEN : VERMILION}>Anṛta</text>
                  <text x="0" y="-25" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill={INK_PRIMARY}>Gate 4</text>
                </g>

                {/* Output Terminal */}
                <g transform="translate(220, 85)">
                  <circle cx="0" cy="0" r="13" fill={activeOptionKey === "balanced" ? GREEN : "rgba(162,58,30,0.15)"} stroke={activeOptionKey === "balanced" ? GREEN : VERMILION} strokeWidth="1.5" />
                  <text x="0" y="3" textAnchor="middle" fontSize="8" fontWeight="bold" fill={activeOptionKey === "balanced" ? "#FFF" : VERMILION}>Out</text>
                </g>
              </svg>
            </div>

            {/* Trio Meters */}
            <div className="space-y-3 border-t pt-4" style={{ borderColor: HAIRLINE }}>
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: GOLD }}>
                Speech-Discipline Trio (Truth + Compassion + Agency)
              </span>

              {/* Truth */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Truth / Honesty:</span>
                  <span>{option.truth}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${option.truth}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ background: option.truth === 100 ? GREEN : GOLD }}
                  />
                </div>
              </div>

              {/* Compassion */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Compassion / Receivability:</span>
                  <span>{option.compassion}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${option.compassion}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ background: option.compassion === 100 ? GREEN : GOLD }}
                  />
                </div>
              </div>

              {/* Agency */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Client Agency / Actionability:</span>
                  <span>{option.agency}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${option.agency}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ background: option.agency === 100 ? GREEN : GOLD }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg p-3 text-[11px] leading-relaxed border flex flex-col gap-1 mt-4" style={{
            background: SURFACE_2,
            borderColor: HAIRLINE,
          }}>
            <div className="flex items-center gap-1 font-bold" style={{ color: GOLD }}>
              <Compass size={12} />
              <span>Dharmaśāstra Rule</span>
            </div>
            <p className="m-0 text-[10px]" style={{ color: INK_SECONDARY }}>
              Speech must satisfy all four tests simultaneously. Delivering truth brutally fails clause 3; delivering comforting lies fails clause 4. Only the balanced combination satisfies the eternal dharma.
            </p>
          </div>
        </div>
      </div>

      {/* Sloka Block Footer */}
      <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: HAIRLINE }}>
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Manu Smṛti 4.138 — Foundational speech-ethics
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          सत्यं ब्रूयात्प्रियं ब्रूयान्न ब्रूयात्सत्यमप्रियम्। प्रियं च नानृतं ब्रूयादेष धर्मः सनातनः॥ ४.१३८॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          satyaṁ brūyāt priyaṁ brūyān na brūyāt satyam apriyam | priyaṁ ca nānṛtaṁ brūyāt eṣa dharmaḥ sanātanaḥ || 4.138 ||
        </p>
      </div>
    </div>
  );
}
