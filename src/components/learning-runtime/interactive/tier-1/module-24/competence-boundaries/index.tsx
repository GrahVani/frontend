"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass, UserCheck, Stethoscope, AlertTriangle, ShieldCheck } from "lucide-react";
import { goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5C3D26)";
const GOLD = "#A8821E";
const VERMILION = "#A23A1E";
const GREEN = "#2E7D32";
const INK_MUTED = "var(--gl-ink-muted, #7C6D5B)";

interface Option {
  label: string;
  text: string;
  svadharma: number;
  paradharma: number;
  status: "balanced" | "overreach" | "neglect";
  feedback: string;
}

interface Scenario {
  title: string;
  icon: React.ReactNode;
  context: string;
  options: Record<string, Option>;
}

export function CompetenceBoundaries() {
  const [activeTab, setActiveTab] = useState<string>("medical");
  const [activeOptKey, setActiveOptKey] = useState<string>("overreach");

  const SCENARIOS: Record<string, Scenario> = {
    medical: {
      title: "Medical Domain",
      icon: <Stethoscope size={15} />,
      context: "Client with Sun-Saturn-Rāhu 6th house cluster reports two months of persistent chest pain and asks for astrological advice.",
      options: {
        overreach: {
          label: "Option A: Replacement Overreach",
          text: "Diagnose it as definite cardiac blockage. Prescribe specific herbal teas, fasts on Saturdays, and recommend wearing a red coral gem instead of seeing a doctor.",
          svadharma: 20,
          paradharma: 100,
          status: "overreach",
          feedback: "Violates Gītā 3.35 (paradharmo bhayāvahaḥ). Diagnosing physical illnesses and prescribing treatments is the exclusive domain of licensed medical doctors. Gemstones or fasts are not medical interventions and risk the client's life."
        },
        neglect: {
          label: "Option B: Svadharma Neglect",
          text: "Refuse to read the chart or discuss the health domain at all, declaring you are legally not allowed to look at health queries.",
          svadharma: 0,
          paradharma: 0,
          status: "neglect",
          feedback: "Svadharma Neglect. You are discarding the legitimate astrological lens (identifying active health transits and timing windows) which can serve as a supportive preventive warning."
        },
        balanced: {
          label: "Option C: Complementary Balance",
          text: "Acknowledge that the 6th house transit suggests high cardiovascular vulnerability. Urge them to consult a cardiologist immediately. Offer to look at timing as supplementary support after they receive a medical exam.",
          svadharma: 100,
          paradharma: 0,
          status: "balanced",
          feedback: "Perfect compliance. Preserves the astrological indication as supplementary data while pointing the client directly to the primary medical authority."
        }
      }
    },
    legal: {
      title: "Legal Domain",
      icon: <UserCheck size={15} />,
      context: "Client is in a contested business partnership dispute and asks: 'Will I win the lawsuit in court?'",
      options: {
        overreach: {
          label: "Option A: Replacement Overreach",
          text: "Predict a definitive courtroom victory and advise them to file lawsuit immediately, bypassing expensive lawyers since the stars are in their favor.",
          svadharma: 20,
          paradharma: 100,
          status: "overreach",
          feedback: "Violates Gītā 3.35. Astrological prediction cannot analyze contracts, evidence, or courtroom procedures. Advising clients to bypass legal counsel creates massive liability."
        },
        neglect: {
          label: "Option B: Svadharma Neglect",
          text: "Tell the client that legal disputes are completely secular and refuse to offer any timing or planetary strength observations.",
          svadharma: 0,
          paradharma: 0,
          status: "neglect",
          feedback: "Under-reach. You fail to use Muhūrta and transit analysis to identify supportive windows for conflict resolution, negotiation, or filing."
        },
        balanced: {
          label: "Option C: Complementary Balance",
          text: "Explain that courtroom outcomes depend on legal merits and contracts (lawyer's domain), but note that the next 4 months are transit-restricted for litigation, suggesting wait-times or negotiation.",
          svadharma: 100,
          paradharma: 0,
          status: "balanced",
          feedback: "Perfect. Astrological timing acts as a useful input alongside a lawyer's primary legal assessment."
        }
      }
    },
    mental: {
      title: "Mental Health",
      icon: <Compass size={15} />,
      context: "Client reports 6 months of persistent low mood, lethargy, and loss of interest in activities, asking if it is a Saturn cycle they must endure.",
      options: {
        overreach: {
          label: "Option A: Replacement Overreach",
          text: "Diagnose it as pure Saturn/Rāhu affliction. Tell them to skip psychiatric care or therapy, prescribing a Śani mantra and stone as a complete cure.",
          svadharma: 10,
          paradharma: 100,
          status: "overreach",
          feedback: "Violates Gītā 3.35. Clinical depression requires professional evaluation. Attempting to treat psychiatric conditions with spiritual remedies alone is highly dangerous."
        },
        neglect: {
          label: "Option B: Svadharma Neglect",
          text: "Refuse to comment on the chart's emotional/mind attributions (like Moon-Saturn afflictions) and tell them to only speak with their therapist.",
          svadharma: 0,
          paradharma: 0,
          status: "neglect",
          feedback: "Under-reach. The chart's Moon/4th house indicators can offer the client helpful self-reflective frames to discuss in therapy."
        },
        balanced: {
          label: "Option C: Complementary Balance",
          text: "Urge the client to consult a psychiatrist or therapist immediately for clinical care. Note that the chart shows activated Moon-Saturn transits which suggest a period of low vitality, helping them frame it as a temporary self-work phase.",
          svadharma: 100,
          paradharma: 0,
          status: "balanced",
          feedback: "Perfect. Validates clinical treatment while using astrology as a supportive, reflective tool."
        }
      }
    },
    stream: {
      title: "Stream Boundary",
      icon: <Compass size={15} />,
      context: "Client asks for a precise auspicious second (Muhūrta) to sign a partnership contract, but you are only trained in Parāśarī horoscopy.",
      options: {
        overreach: {
          label: "Option A: Replacement Overreach",
          text: "Fabricate an auspicious time based on basic natal chart transits, pretending you have master-level expertise in electional Muhūrta calculation.",
          svadharma: 20,
          paradharma: 90,
          status: "overreach",
          feedback: "Internal overreach. Fabricating competence in specialized techniques (like Muhūrta or KP horary) when you only know Parāśarī horoscopy violates the internal adhikāra boundary."
        },
        neglect: {
          label: "Option B: Svadharma Neglect",
          text: "Tell the client that auspicious timing is superstitious and they should just sign the contract whenever they feel like it.",
          svadharma: 0,
          paradharma: 0,
          status: "neglect",
          feedback: "Under-reach. You dismiss a legitimate domain of the tradition (Muhūrta) rather than acknowledging your own specific limitation."
        },
        balanced: {
          label: "Option C: Complementary Balance",
          text: "Provide a general monthly time-window from Parāśarī transit rules, honestly state your training limitations, and refer them to a specialized KP/Muhūrta practitioner for date/second selection.",
          svadharma: 100,
          paradharma: 0,
          status: "balanced",
          feedback: "Perfect. Observes stream honesty and the internal competence boundary, providing your stream's inputs while referring to specialists."
        }
      }
    }
  };

  const scenario = SCENARIOS[activeTab];
  const option = scenario.options[activeOptKey] || Object.values(scenario.options)[0];

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
          <Compass size={16} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Adhikāra Boundaries
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Svadharma Referral & Adhikāra Diagnostic Board
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Stay within your domain. Balance the astrological contribution (Svadharma) with the necessity of referring out to specialized professionals (Paradharma limit).
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl mb-6" style={{ background: SURFACE_2 }}>
        {Object.entries(SCENARIOS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              setActiveOptKey("overreach");
            }}
            className="flex-1 min-w-[120px] py-2 px-3 rounded-lg border text-center transition-all text-xs font-bold flex items-center justify-center gap-1.5"
            style={{
              background: activeTab === key ? SURFACE : "transparent",
              borderColor: activeTab === key ? GOLD : "transparent",
              color: activeTab === key ? INK_PRIMARY : INK_SECONDARY,
            }}
          >
            {s.icon}
            {s.title}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        
        {/* Left Side: Context & Options */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Case Context
            </span>
            <p className="m-0 text-xs leading-relaxed font-semibold" style={{ color: INK_PRIMARY }}>
              {scenario.context}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>
              Select Response Action
            </span>
            <div className="flex flex-col gap-2">
              {Object.entries(scenario.options).map(([key, opt]) => (
                <button
                  key={key}
                  onClick={() => setActiveOptKey(key)}
                  className="w-full p-3 rounded-lg border text-left transition-all text-xs flex flex-col gap-1 hover:bg-white/50"
                  style={{
                    background: activeOptKey === key ? SURFACE_2 : SURFACE,
                    borderColor: activeOptKey === key ? GOLD : HAIRLINE,
                  }}
                >
                  <span className="font-bold" style={{ color: activeOptKey === key ? INK_PRIMARY : INK_SECONDARY }}>
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-stone-600 leading-normal" style={{ color: INK_SECONDARY }}>
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Diagnostic Balance Gauge */}
        <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
          <div>
            <div className="mb-4 border-b pb-2" style={{ borderColor: HAIRLINE }}>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Diagnostic Balance Gauge & Compass
              </span>
            </div>

            {/* Visual SVG Svadharma Referral Compass */}
            <div className="flex justify-center rounded-xl p-3 mb-4 border bg-white" style={{ borderColor: HAIRLINE }}>
              <svg width="260" height="220" viewBox="0 0 260 220">
                {/* Concentric boundaries */}
                <circle cx="130" cy="120" r="60" fill="none" stroke={INK_SECONDARY} strokeWidth="1" />
                <circle cx="130" cy="120" r="30" fill="none" stroke={INK_SECONDARY} strokeWidth="1.5" />
                <text x="130" y="123" fill={GOLD} fontSize="9" fontWeight="bold" textAnchor="middle">Svadharma</text>
                <text x="130" y="22" fill={INK_SECONDARY} fontSize="9" fontWeight="bold" textAnchor="middle">Paradharma</text>

                {/* Avatar position based on option.status */}
                {option.status === "balanced" && (
                  <>
                    {/* Bridge */}
                    <line x1="130" y1="120" x2="130" y2="72" stroke={GREEN} strokeWidth="2.5" strokeDasharray="3,2" />
                    {/* Active bridge path */}
                    <g transform="translate(130, 72)">
                      <circle cx="0" cy="0" r="10" fill={GREEN} />
                      <text x="0" y="3" textAnchor="middle" fill="#FFF" fontSize="7" fontWeight="bold">✓</text>
                    </g>
                    <text x="130" y="40" fill={GREEN} fontSize="9" fontWeight="bold" textAnchor="middle">REFERRAL PATHWAY</text>
                  </>
                )}

                {option.status === "overreach" && (
                  <>
                    {/* Intruded deep inside Paradharma */}
                    <g transform="translate(130, 72)">
                      <circle cx="0" cy="0" r="10" fill={VERMILION} />
                      <text x="0" y="3" textAnchor="middle" fill="#FFF" fontSize="7" fontWeight="bold">⚠️</text>
                    </g>
                    <text x="130" y="40" fill={VERMILION} fontSize="9" fontWeight="bold" textAnchor="middle">OVERREACH</text>
                  </>
                )}

                {option.status === "neglect" && (
                  <>
                    {/* Dot is outside or minimized */}
                    <g transform="translate(130, 190)">
                      <circle cx="0" cy="0" r="10" fill={GOLD} />
                      <text x="0" y="3" textAnchor="middle" fill="#FFF" fontSize="7" fontWeight="bold">?</text>
                    </g>
                    <text x="130" y="40" fill={GOLD} fontSize="9" fontWeight="bold" textAnchor="middle">NEGLECT</text>
                  </>
                )}
              </svg>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              
              {/* Svadharma */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Svadharma (Astrological Timing/Observation):</span>
                  <span style={{ color: option.svadharma > 0 ? GREEN : VERMILION }}>{option.svadharma}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${option.svadharma}%` }}
                    transition={{ duration: 0.4 }}
                    style={{ background: option.svadharma === 100 ? GREEN : GOLD }}
                  />
                </div>
              </div>

              {/* Paradharma */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Paradharma (Overreach / Clinical Diagnosing):</span>
                  <span style={{ color: option.paradharma > 0 ? VERMILION : GREEN }}>{option.paradharma}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${option.paradharma}%` }}
                    transition={{ duration: 0.4 }}
                    style={{ background: option.paradharma > 0 ? VERMILION : GREEN }}
                  />
                </div>
              </div>

            </div>

            {/* Diagnostic Alert Box */}
            <div className="mt-6">
              {option.status === "balanced" ? (
                <div className="p-3 rounded-lg flex items-start gap-2 text-[11px] leading-normal border" style={{
                  background: SURFACE_2,
                  borderColor: `${GREEN}33`,
                }}>
                  <ShieldCheck size={16} color={GREEN} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: GREEN }}>Complementary Balance</span>
                    <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{option.feedback}</p>
                  </div>
                </div>
              ) : option.status === "overreach" ? (
                <div className="p-3 rounded-lg flex items-start gap-2 text-[11px] leading-normal border animate-pulse" style={{
                  background: SURFACE_2,
                  borderColor: `${VERMILION}33`,
                }}>
                  <AlertTriangle size={16} color={VERMILION} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: VERMILION }}>paradharmo bhayāvahaḥ (Overreach)</span>
                    <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{option.feedback}</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg flex items-start gap-2 text-[11px] leading-normal border" style={{
                  background: SURFACE_2,
                  borderColor: `${GOLD}33`,
                }}>
                  <AlertTriangle size={16} color={GOLD} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: GOLD }}>svadharma neglect (Under-reach)</span>
                    <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{option.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg p-3 text-[10px] leading-relaxed border mt-4" style={{
            background: SURFACE_2,
            borderColor: HAIRLINE,
          }}>
            <p className="m-0" style={{ color: INK_SECONDARY }}>
              Staying within your competence boundaries builds public trust and legal safety. Astrology is supplementary in professional domains, not a primary replacement.
            </p>
          </div>

        </div>
      </div>

      {/* Gita Sloka Footer */}
      <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: HAIRLINE }}>
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Bhagavad Gītā 3.35 — Svadharma Principle
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्। स्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥ ३.३५॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          śreyān svadharmo viguṇaḥ paradharmāt svanuṣṭhitāt | svadharme nidhanaṁ śreyaḥ paradharmo bhayāvahaḥ || 3.35 ||
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;Better is one&apos;s own duty, though devoid of merit, than the duty of another well-performed. Better is death in the discharge of one&apos;s own duty; the duty of another is fraught with danger.&rdquo;
        </p>
      </div>
    </div>
  );
}
