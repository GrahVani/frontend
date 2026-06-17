"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, PlayCircle, Compass, HelpCircle, ShieldAlert, Award, Calendar } from "lucide-react";
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

interface StepDetail {
  title: string;
  context: string;
  choices: Record<string, {
    label: string;
    description: string;
    impact: string;
    points: number;
    blockedFailures: string[];
    isCompliant: boolean;
  }>;
}

const STEPS: Record<string, StepDetail> = {
  s1: {
    title: "1. Data Verification",
    context: "Before casting the chart, how do you verify the client's time-of-birth accuracy?",
    choices: {
      recorded: {
        label: "Record-Verified (Hospital / Certificate)",
        description: "High confidence. Log time and confirm Lagna degree limits.",
        impact: "Sāttvika. Ensures the mathematical foundation is correct. No risk of reading a wrong chart.",
        points: 100,
        blockedFailures: ["Wrong Chart Cast"],
        isCompliant: true
      },
      rounded: {
        label: "Family-Remembered (Rounded)",
        description: "Moderate confidence. Openly note Lagna boundaries and potential sign changes.",
        impact: "Dharmic reconciliation. Warns the client about degree shifts and maps potential discrepancies.",
        points: 80,
        blockedFailures: [],
        isCompliant: true
      },
      approximate: {
        label: "Approximate-Time (Unchecked)",
        description: "Low confidence. Cast from estimated 10:30am with mother not sure.",
        impact: "Severe risk. Proceeding with approximate birth time without warning casts a wrong chart, invalidating all subsequent interpretations.",
        points: 20,
        blockedFailures: [],
        isCompliant: false
      }
    }
  },
  s2: {
    title: "2. Scope Confirmation",
    context: "At session opening, how do you manage the client's questions?",
    choices: {
      negotiated: {
        label: "Negotiated Focus",
        description: "Clarify primary/secondary questions. Agree on time allocation.",
        impact: "Dharmic. Binds session to agreed scope and prevents client from losing time on secondary queries.",
        points: 100,
        blockedFailures: ["Scope Creep & Fee Disputes"],
        isCompliant: true
      },
      drift: {
        label: "Unstructured Drift",
        description: "No agenda. Start reading whatever pops up in chart response.",
        impact: "Uncontrolled. Session easily runs over, key client questions are forgotten, and scope creeps into unpaid territories.",
        points: 30,
        blockedFailures: [],
        isCompliant: false
      }
    }
  },
  s3: {
    title: "3. Time-Boxed Reading",
    context: "How do you manage the scheduled 60-minute window during the session?",
    choices: {
      timeboxed: {
        label: "Active Checkpoints",
        description: "Time-box to 60 minutes. Re-orient when close to limits.",
        impact: "Respects client fee-integrity and practitioner's subsequent calendar commitments.",
        points: 100,
        blockedFailures: ["Run-Over & Schedule Overrun"],
        isCompliant: true
      },
      runover: {
        label: "Run-Over (+30 mins)",
        description: "Allow session to drift to 90 minutes to ensure 'thoroughness'.",
        impact: "Breaches fee structures. Cultivates unbilled client expectations and compromises subsequent client timings.",
        points: 40,
        blockedFailures: [],
        isCompliant: false
      }
    }
  },
  s4: {
    title: "4. Written Summary",
    context: "What enduring artifact do you provide post-session?",
    choices: {
      deliver: {
        label: "Deliver Post-Session Summary",
        description: "Send key observations and actionable notes in 5 business days.",
        impact: "Dharmic. Serves as client's self-understanding tool over time, mapping progressive agency.",
        points: 100,
        blockedFailures: ["Client Memory Fade"],
        isCompliant: true
      },
      skip: {
        label: "Skip Summary (Verbal Only)",
        description: "Rely entirely on client's memory and notes taken during call.",
        impact: "Omission. Memory degrades rapidly, leading to client confusion and later 'what did you say' disputes.",
        points: 30,
        blockedFailures: [],
        isCompliant: false
      }
    }
  },
  s5: {
    title: "5. Follow-Up Window",
    context: "How do you bound client access after the session is completed?",
    choices: {
      window30: {
        label: "30-Day Clarification Window",
        description: "1 free touch for clarification on session content only.",
        impact: "Samatvam (equanimity). Binds continuing engagement to question-driven parameters.",
        points: 100,
        blockedFailures: ["Over-engagement/Life-Coach Drift"],
        isCompliant: true
      },
      whatsapp: {
        label: "Open WhatsApp Access",
        description: "Allow client to ping at all hours with daily decisions.",
        impact: "Dependency. Drifts into Life-Coach mode, eroding client agency on minor things and compromising practitioner's practice sanity.",
        points: 20,
        blockedFailures: [],
        isCompliant: false
      }
    }
  },
  s6: {
    title: "6. Recording Consent",
    context: "How do you handle audio/video recordings of the session?",
    choices: {
      consent: {
        label: "Explicit Consent + Secure Storage",
        description: "Secure permission beforehand. Store locally/securely, no third-party share.",
        impact: "Fully compliant. Prevents data privacy breaches or sharing on unverified cloud storage.",
        points: 100,
        blockedFailures: ["Confidentiality & Recording Leaks"],
        isCompliant: true
      },
      silent: {
        label: "Record Silently / Personal Reference",
        description: "Record without mentioning it, just in case you need reference.",
        impact: "Severe violation. Recording without explicit consent breaches confidentiality and DPDP data-handling laws.",
        points: 10,
        blockedFailures: [],
        isCompliant: false
      },
      norecord: {
        label: "No Recording (Written Summary Only)",
        description: "Decline recording to simplify. Rely solely on summary.",
        impact: "Valid. Clear default that completely removes data leakage risks.",
        points: 100,
        blockedFailures: ["Confidentiality & Recording Leaks"],
        isCompliant: true
      }
    }
  }
};

const ALL_FAILURES = [
  "Wrong Chart Cast",
  "Scope Creep & Fee Disputes",
  "Run-Over & Schedule Overrun",
  "Client Memory Fade",
  "Over-engagement/Life-Coach Drift",
  "Confidentiality & Recording Leaks"
];

export function SessionProtocols() {
  const [activeStep, setActiveStep] = useState<string>("s1");
  const [selections, setSelections] = useState<Record<string, string>>({
    s1: "recorded",
    s2: "negotiated",
    s3: "timeboxed",
    s4: "deliver",
    s5: "window30",
    s6: "consent"
  });

  const stepKeys = Object.keys(STEPS);
  const currentStepDetail = STEPS[activeStep];
  const activeChoiceKey = selections[activeStep];
  const activeChoice = currentStepDetail.choices[activeChoiceKey];

  // Calculate overall metrics
  const totalScore = Math.round(
    stepKeys.reduce((acc, stepKey) => {
      const choiceKey = selections[stepKey];
      const pt = STEPS[stepKey].choices[choiceKey]?.points ?? 0;
      return acc + pt;
    }, 0) / stepKeys.length
  );

  // Determine blocked failures
  const blockedFailures = new Set<string>();
  stepKeys.forEach((stepKey) => {
    const choiceKey = selections[stepKey];
    const bf = STEPS[stepKey].choices[choiceKey]?.blockedFailures ?? [];
    bf.forEach((f) => blockedFailures.add(f));
  });

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
          <Calendar size={16} color={GOLD} className="animate-spin-slow" />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Practice Flow & Auditing
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Standard Session Protocol Auditor
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Audit the six operational stages of a consultation to setting a loka-saṅgraha standard.
        </p>
      </div>

      {/* Interactive SVG Roadmap */}
      <div className="flex justify-center p-4 rounded-xl mb-6 border bg-white" style={{ borderColor: HAIRLINE }}>
        <svg width="100%" height="60" viewBox="0 0 600 60" className="max-w-xl">
          {/* Connector Line */}
          <line x1="50" y1="30" x2="550" y2="30" stroke="rgba(168,130,30,0.15)" strokeWidth="4" />
          
          {stepKeys.map((stepKey, idx) => {
            const x = 50 + idx * 100;
            const isSelected = activeStep === stepKey;
            const choiceKey = selections[stepKey];
            const isCompliant = STEPS[stepKey].choices[choiceKey]?.isCompliant;

            return (
              <g
                key={stepKey}
                className="cursor-pointer"
                onClick={() => setActiveStep(stepKey)}
              >
                {/* Connector active line */}
                {idx > 0 && (
                  <line
                    x1={50 + (idx - 1) * 100}
                    y1="30"
                    x2={x}
                    y2="30"
                    stroke={isCompliant ? GREEN : VERMILION}
                    strokeWidth="4"
                    opacity={isSelected ? 1 : 0.6}
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={x}
                  cy="30"
                  r={isSelected ? "14" : "11"}
                  fill={isCompliant ? GREEN : choiceKey === "rounded" ? GOLD : VERMILION}
                  stroke={isSelected ? INK_PRIMARY : "transparent"}
                  strokeWidth="2.5"
                  className="transition-all"
                />

                {/* Node number */}
                <text
                  x={x}
                  y="34"
                  fill="#FFF"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {idx + 1}
                </text>

                {/* Node label */}
                <text
                  x={x}
                  y="55"
                  fill={isSelected ? INK_PRIMARY : INK_MUTED}
                  fontSize="7.5"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {STEPS[stepKey].title.split(" ").slice(1).join(" ")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        
        {/* Left column: Current Stage & Choice details */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Stage Context: {currentStepDetail.title}
            </span>
            <p className="m-0 text-xs leading-relaxed font-semibold text-stone-800">
              {currentStepDetail.context}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>
              Configure Stage Response
            </span>
            <div className="flex flex-col gap-2">
              {Object.entries(currentStepDetail.choices).map(([key, choice]) => {
                const isSelected = activeChoiceKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelections({ ...selections, [activeStep]: key })}
                    className="w-full p-3 rounded-lg border text-left transition-all text-xs flex flex-col gap-1 hover:bg-white/50"
                    style={{
                      background: isSelected ? SURFACE_2 : SURFACE,
                      borderColor: isSelected ? GOLD : HAIRLINE,
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold" style={{ color: isSelected ? INK_PRIMARY : INK_SECONDARY }}>
                        {choice.label}
                      </span>
                      {choice.isCompliant ? (
                        <CheckCircle2 size={14} color={GREEN} />
                      ) : (
                        <XCircle size={14} color={VERMILION} />
                      )}
                    </div>
                    <span className="text-[10px] leading-normal text-stone-600" style={{ color: INK_SECONDARY }}>
                      {choice.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Auditing Status & Checklist */}
        <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Compliance Auditor
              </span>
              <div className="flex items-center gap-1">
                <Award size={14} color={GOLD} />
                <span className="text-xs font-bold" style={{ color: totalScore > 75 ? GREEN : totalScore > 40 ? GOLD : VERMILION }}>
                  {totalScore > 75 ? "Loka-Saṅgraha Standard" : "Deficient Standard"}
                </span>
              </div>
            </div>

            {/* Overall score bar */}
            <div className="space-y-1 mb-5">
              <div className="flex justify-between text-[11px] font-bold">
                <span>Protocol Quality Score:</span>
                <span>{totalScore}/100</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                <motion.div
                  className="h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${totalScore}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ background: totalScore > 75 ? GREEN : totalScore > 40 ? GOLD : VERMILION }}
                />
              </div>
            </div>

            {/* Checklist of failure modes */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: INK_SECONDARY }}>
                Failure Modes Blocked
              </span>
              <div className="space-y-2">
                {ALL_FAILURES.map((fail) => {
                  const isBlocked = blockedFailures.has(fail);
                  return (
                    <div
                      key={fail}
                      className="flex items-center justify-between text-[10px] leading-normal border rounded-lg p-2 bg-white"
                      style={{
                        borderColor: isBlocked ? `${GREEN}33` : `${VERMILION}22`,
                      }}
                    >
                      <span className="font-semibold" style={{ color: isBlocked ? INK_PRIMARY : INK_SECONDARY }}>
                        {fail}
                      </span>
                      {isBlocked ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase tracking-wider flex items-center gap-0.5 border border-emerald-200">
                          <CheckCircle2 size={10} color={GREEN} /> Blocked
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 uppercase tracking-wider flex items-center gap-0.5 border border-rose-200">
                          <ShieldAlert size={10} color={VERMILION} /> Active Risk
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Feedback note */}
          <div className="mt-5 pt-3 border-t" style={{ borderColor: HAIRLINE }}>
            <div className="p-3 rounded-lg flex items-start gap-2.5 text-[11px] leading-normal border bg-white" style={{ borderColor: HAIRLINE }}>
              <Compass size={15} color={GOLD} className="flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block" style={{ color: INK_PRIMARY }}>Current Decision Impact:</span>
                <p className="m-0 mt-0.5 text-stone-600" style={{ color: INK_SECONDARY }}>{activeChoice.impact}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Gita Sloka Footer */}
      <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: HAIRLINE }}>
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Bhagavad Gītā 3.21 — The Standard Setter
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः। स यत्प्रमाणं कुरुते लोकस्तदनुवर्तते॥ ३.२१॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          yad yad ācarati śreṣṭhas tat tad evetaro janaḥ | sa yat pramāṇaṁ kurute lokas tad anuvartate || 3.21 ||
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;Whatever a great person does, ordinary people follow; whatever standard such a one sets, the world adopts.&rdquo;
        </p>
      </div>
    </div>
  );
}
