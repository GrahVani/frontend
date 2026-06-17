"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass, ShieldCheck, ShieldAlert, AlertTriangle, UserCheck, Flame, Scale, MessageSquare } from "lucide-react";
import { goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5C3D26)";
const INK_MUTED = "var(--gl-ink-muted, #7C6D5B)";
const GOLD = "#A8821E";
const VERMILION = "#A23A1E";
const GREEN = "#2E7D32";

interface Choice {
  label: string;
  strategy: "over" | "under" | "samatva";
  impact: string;
  agency: number;
  competence: number;
  sustainability: string;
  feedback: string;
}

interface Scenario {
  id: string;
  title: string;
  context: string;
  choices: Record<string, Choice>;
}

const SCENARIOS: Record<string, Scenario> = {
  s1: {
    id: "s1",
    title: "Scenario 1: Midnight WhatsApp",
    context: "A client messages at 11:47 PM asking whether she should attend her sister-in-law's birthday party on Saturday due to sixth-house Mars transit.",
    choices: {
      over: {
        label: "Option A: Immediate Detailed Response",
        strategy: "over",
        impact: "Over-engagement / Life-Coach Drift",
        agency: 15,
        competence: 30,
        sustainability: "Helper Burnout / High Anxiety",
        feedback: "Breaches channel boundaries. Responding at midnight to minor scheduling queries encourages the client to outsource daily decisions to you."
      },
      under: {
        label: "Option B: Block Immediately",
        strategy: "under",
        impact: "Transactional Abandonment",
        agency: 45,
        competence: 90,
        sustainability: "Damaged Reputation",
        feedback: "Severe over-correction. Ignores relationship history and leaves the client stranded without explanation."
      },
      samatva: {
        label: "Option C: Next-Day Boundary Restatement",
        strategy: "samatva",
        impact: "Samatvam Equanimity Balance",
        agency: 95,
        competence: 95,
        sustainability: "Balanced & Sustainable",
        feedback: "Perfect. Delay response to business hours. Kindly explain that daily-life decisions belong to her own discernment, not transits."
      }
    }
  },
  s2: {
    id: "s2",
    title: "Scenario 2: Cancer Crisis",
    context: "A client calls in crisis: her father is diagnosed with cancer. The family is divided on the treatment timeline.",
    choices: {
      over: {
        label: "Option A: Emotional Anchor Mode",
        strategy: "over",
        impact: "Over-engagement / Competence Over-reach",
        agency: 10,
        competence: 20,
        sustainability: "Emotional Burnout",
        feedback: "Violates counseling boundaries. Trying to play medical advisor or family mediator oversteps the astrological mandate."
      },
      under: {
        label: "Option B: Complete Disengagement",
        strategy: "under",
        impact: "Transactional Abandonment",
        agency: 50,
        competence: 70,
        sustainability: "Cold/Indifferent reputation",
        feedback: "Neglects legitimate timing support. Astrology can offer valuable timing contexts during crisis if properly bounded."
      },
      samatva: {
        label: "Option C: Timing Context & Referral",
        strategy: "samatva",
        impact: "Samatvam Equanimity Balance",
        agency: 90,
        competence: 95,
        sustainability: "Dharmic Professional Care",
        feedback: "Exemplary. Provide clear timing context for treatment initialization, and explicitly refer medical and family dynamics to qualified professionals."
      }
    }
  },
  s3: {
    id: "s3",
    title: "Scenario 3: Everyday Decision Queries",
    context: "Client asks whether to take her dog to the vet today, and whether to schedule tuition on Monday or Wednesday.",
    choices: {
      over: {
        label: "Option A: Calculate Transit Windows",
        strategy: "over",
        impact: "Over-engagement / Dependency Fostering",
        agency: 5,
        competence: 40,
        sustainability: "Severe Client Reliance",
        feedback: "Fosters dependency. Calculating transits for minor daily chores erodes client self-reliance and devalues the discipline."
      },
      under: {
        label: "Option B: Ignore Message",
        strategy: "under",
        impact: "Passive Neglect",
        agency: 45,
        competence: 80,
        sustainability: "Poor Client Care Rating",
        feedback: "Leaving the client without context or explanation fails to build their understanding of what astrology is for."
      },
      samatva: {
        label: "Option C: Compassionate Limit Setting",
        strategy: "samatva",
        impact: "Samatvam Equanimity Balance",
        agency: 95,
        competence: 95,
        sustainability: "Healthy Professional Boundaries",
        feedback: "Dharmic limit. Gently reply that everyday choices belong to client discernment and are outside the scope of astrological timers."
      }
    }
  },
  s4: {
    id: "s4",
    title: "Scenario 4: Post-Session Clarification",
    context: "Two weeks after consultation, client emails asking for clarification on a specific recommendation in the written summary.",
    choices: {
      over: {
        label: "Option A: Unbilled Full Session",
        strategy: "over",
        impact: "Over-responsive / Scope Creep",
        agency: 70,
        competence: 80,
        sustainability: "Revenue & Time Drain",
        feedback: "Devalues your preparation. Conducting a second full call instead of a simple clarification invites scope creep."
      },
      under: {
        label: "Option B: Refuse / Charge New Booking",
        strategy: "under",
        impact: "Under-responsive / Abandonment",
        agency: 40,
        competence: 50,
        sustainability: "Lost Trust / Poor Referrals",
        feedback: "Breaches the follow-up window commitment. A clarification on previous session content is included in the initial booking."
      },
      samatva: {
        label: "Option C: Concise Email Response",
        strategy: "samatva",
        impact: "Samatvam Equanimity Balance",
        agency: 95,
        competence: 95,
        sustainability: "Sustainable & Compliant",
        feedback: "Sāttvika follow-up. Sends a clear, concise email clarifying the specific point within 3 business days, keeping scope bounded."
      }
    }
  }
};

export function FollowUpBoundaries() {
  const [activeScenario, setActiveScenario] = useState<string>("s1");
  const [activeChoiceKey, setActiveChoiceKey] = useState<string>("over");

  const scenario = SCENARIOS[activeScenario];
  const choice = scenario.choices[activeChoiceKey] || Object.values(scenario.choices)[0];

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
          <MessageSquare size={16} color={GOLD} className="animate-spin-slow" />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Engagement Boundaries & Samatva
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Measured Engagement Boundary Lab
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Balance client engagement along the equanimity spectrum to prevent Life-Coach Drift and Transactional Abandonment.
        </p>
      </div>

      {/* Scenario Tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl mb-6" style={{ background: SURFACE_2 }}>
        {Object.entries(SCENARIOS).map(([key, sc]) => (
          <button
            key={key}
            onClick={() => {
              setActiveScenario(key);
              setActiveChoiceKey("over");
            }}
            className="flex-1 min-w-[120px] py-2 px-3 rounded-lg border text-center transition-all text-xs font-bold"
            style={{
              background: activeScenario === key ? SURFACE : "transparent",
              borderColor: activeScenario === key ? GOLD : "transparent",
              color: activeScenario === key ? INK_PRIMARY : INK_SECONDARY,
            }}
          >
            {sc.title}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        
        {/* Left Side: Context & Inputs */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Client Query Context
            </span>
            <p className="m-0 text-xs leading-relaxed font-semibold text-stone-800">
              {scenario.context}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>
              Select Practitioner Response
            </span>
            <div className="flex flex-col gap-2">
              {Object.entries(scenario.choices).map(([key, ch]) => (
                <button
                  key={key}
                  onClick={() => setActiveChoiceKey(key)}
                  className="w-full p-3 rounded-lg border text-left transition-all text-xs flex flex-col gap-1 hover:bg-white/50"
                  style={{
                    background: activeChoiceKey === key ? SURFACE_2 : SURFACE,
                    borderColor: activeChoiceKey === key ? GOLD : HAIRLINE,
                  }}
                >
                  <span className="font-bold" style={{ color: activeChoiceKey === key ? INK_PRIMARY : INK_SECONDARY }}>
                    {ch.label}
                  </span>
                  <span className="text-[10px] text-stone-600 leading-normal" style={{ color: INK_SECONDARY }}>
                    {ch.feedback}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Dial and Metrics */}
        <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
          <div>
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Samatvam Equanimity Dial
              </span>
            </div>

            {/* Dial SVG */}
            <div className="flex justify-center rounded-xl p-3 mb-4 border bg-white" style={{ borderColor: HAIRLINE }}>
              <svg width="200" height="110" viewBox="0 0 200 110">
                {/* Arc tracks */}
                <path d="M 30,90 A 70,70 0 0,1 170,90" fill="none" stroke="rgba(168,130,30,0.1)" strokeWidth="8" strokeLinecap="round" />
                {/* Under-involvement zone (Left) */}
                <path d="M 30,90 A 70,70 0 0,1 80,35" fill="none" stroke={VERMILION} strokeWidth="8" strokeLinecap="round" />
                {/* Samatva zone (Middle) */}
                <path d="M 80,35 A 70,70 0 0,1 120,35" fill="none" stroke={GREEN} strokeWidth="8" />
                {/* Over-involvement zone (Right) */}
                <path d="M 120,35 A 70,70 0 0,1 170,90" fill="none" stroke={GOLD} strokeWidth="8" strokeLinecap="round" />

                {/* Dial labels */}
                <text x="35" y="102" fill={VERMILION} fontSize="6" fontWeight="bold" textAnchor="middle">Abandonment</text>
                <text x="100" y="22" fill={GREEN} fontSize="7" fontWeight="bold" textAnchor="middle">Samatvam</text>
                <text x="165" y="102" fill={GOLD} fontSize="6" fontWeight="bold" textAnchor="middle">Life-Coach Drift</text>

                {/* Animated pointer based on choice */}
                {(() => {
                  let rotation = 0; // samatva
                  if (choice.strategy === "under") rotation = -50;
                  if (choice.strategy === "over") rotation = 50;
                  const color = choice.strategy === "samatva" ? GREEN : choice.strategy === "under" ? VERMILION : GOLD;
                  return (
                    <g transform="translate(100, 90)">
                      <circle cx="0" cy="0" r="6" fill={INK_PRIMARY} />
                      <line x1="0" y1="0" x2="0" y2="-65" stroke={color} strokeWidth="3" transform={`rotate(${rotation})`} strokeLinecap="round" />
                    </g>
                  );
                })()}

                <text x="100" y="82" fill={choice.strategy === "samatva" ? GREEN : choice.strategy === "under" ? VERMILION : GOLD} fontSize="8" fontWeight="bold" textAnchor="middle">
                  {choice.impact}
                </text>
              </svg>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              {/* Agency Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Client Agency & Self-Reliance:</span>
                  <span style={{ color: choice.agency > 50 ? GREEN : VERMILION }}>{choice.agency}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${choice.agency}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ background: choice.agency > 50 ? GREEN : GOLD }}
                  />
                </div>
              </div>

              {/* Competence Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Competence Boundary Integrity:</span>
                  <span style={{ color: choice.competence > 50 ? GREEN : VERMILION }}>{choice.competence}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${choice.competence}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ background: choice.competence > 50 ? GREEN : GOLD }}
                  />
                </div>
              </div>

              {/* Sustainability indicator */}
              <div className="flex items-center justify-between text-[11px] font-bold pt-2 border-t" style={{ borderColor: HAIRLINE }}>
                <span className="flex items-center gap-1">
                  <Flame size={13} color={GOLD} />
                  <span>Practice Burnout Risk:</span>
                </span>
                <span style={{ color: choice.strategy === "samatva" ? GREEN : VERMILION }}>
                  {choice.strategy === "samatva" ? "Low / Highly Sustainable" : choice.strategy === "under" ? "Moderate / Abandonment Risk" : "Critical Burnout"}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback note */}
          <div className="mt-4 pt-3 border-t" style={{ borderColor: HAIRLINE }}>
            <div
              className="p-3 rounded-lg flex items-start gap-2.5 text-[11px] leading-normal border"
              style={{
                background: SURFACE_2,
                borderColor: choice.strategy === "samatva" ? `${GREEN}33` : choice.strategy === "under" ? `${VERMILION}33` : `${GOLD}33`,
              }}
            >
              {choice.strategy === "samatva" ? (
                <>
                  <ShieldCheck size={15} color={GREEN} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: GREEN }}>Samatva Maintained</span>
                    <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{choice.feedback}</p>
                  </div>
                </>
              ) : choice.strategy === "under" ? (
                <>
                  <ShieldAlert size={15} color={VERMILION} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: VERMILION }}>Under-involvement (Abandonment)</span>
                    <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{choice.feedback}</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle size={15} color={GOLD} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: GOLD }}>Over-involvement (Life-Coach Drift)</span>
                    <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{choice.feedback}</p>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Gita Sloka Footer */}
      <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: HAIRLINE }}>
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Bhagavad Gītā 2.48 — Yoga is Evenness
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥ २.४८॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya | siddhyasiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate || 2.48 ||
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;Established in yoga, perform actions abandoning attachment, O Arjuna. Being even-minded in success and failure — evenness of mind is called yoga.&rdquo;
        </p>
      </div>
    </div>
  );
}
