"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5C3D26)";
const GOLD = "#A8821E";
const VERMILION = "#A23A1E";
const GREEN = "#2E7D32";

interface Option {
  label: string;
  text: string;
  dpdp: number;
  gdpr: number;
  gita: number;
  isCompliant: boolean;
  feedback: string;
}

interface Scenario {
  title: string;
  description: string;
  options: Record<string, Option>;
}

const SCENARIOS: Record<string, Scenario> = {
  spouse: {
    title: "Spouse Inquiry",
    description: "A client's husband calls asking about his wife's compatibility reading from last week. He wants to know what you told her.",
    options: {
      disclose: {
        label: "Option A: Full Disclosure",
        text: "Brief him on the reading and discuss her compatibility concerns since he is part of the relationship.",
        dpdp: 0,
        gdpr: 0,
        gita: 0,
        isCompliant: false,
        feedback: "Violates the default no-disclosure rule. Discussing client data with family members without the client's explicit prior consent violates DPDP 2023, GDPR, and classical speech-restraint boundaries."
      },
      protect: {
        label: "Option B: Refusal & Alternatives",
        text: "Decline to discuss the reading. Explain that you do not share client details without their direct involvement. Invite them to schedule a couples session together.",
        dpdp: 100,
        gdpr: 100,
        gita: 100,
        isCompliant: true,
        feedback: "Perfect compliance. Re-establishes the default confidentiality boundary while offering clean, ethical alternatives for joint consultation."
      }
    }
  },
  social: {
    title: "Social-Media Post",
    description: "You want to share a post about an unusual chart configuration, detailing demographic markers (software engineer from Bangalore, born in 1991) without naming the client.",
    options: {
      post: {
        label: "Option A: Post Anonymously",
        text: "Publish the details on social media, assuming that omitting the client's name fully protects their privacy.",
        dpdp: 20,
        gdpr: 15,
        gita: 30,
        isCompliant: false,
        feedback: "Violates the 'even-anonymous-aggregates need consent' rule. The combination of unique chart coordinates and specific demographic data makes the client easily identifiable to their social circle."
      },
      protect: {
        label: "Option B: Written Consent / Fictionalise",
        text: "Construct a synthetic chart containing the same configuration, or obtain written consent from the client to publish the case, fully changing any identifying details.",
        dpdp: 100,
        gdpr: 100,
        gita: 100,
        isCompliant: true,
        feedback: "Perfect compliance. Protects the real client's identity completely by using synthetic data or securing explicit written permission."
      }
    }
  },
  ai: {
    title: "Cloud AI LLM usage",
    description: "You want to use a cloud-based AI tool (e.g. Claude or ChatGPT) to quickly search for classical references associated with a client's birth-data and chart placements.",
    options: {
      leak: {
        label: "Option A: Paste to Public AI",
        text: "Paste the client's birth details and chart coordinates directly into the public AI model's chat prompt.",
        dpdp: 0,
        gdpr: 0,
        gita: 0,
        isCompliant: false,
        feedback: "Severe data leak. Transmitting client personal data to public cloud servers without consent violates DPDP 2023 purpose limitation and GDPR data transfer rules."
      },
      protect: {
        label: "Option B: Local AI / Synthetic Query",
        text: "Use an on-device local AI model that operates offline, or query the AI using fictionalized coordinates to research the mathematical configuration.",
        dpdp: 100,
        gdpr: 100,
        gita: 100,
        isCompliant: true,
        feedback: "Perfect compliance. Keeps client data in your controlled, local environment."
      }
    }
  },
  erasure: {
    title: "Right of Erasure",
    description: "An EU-based or Indian client contacts you requesting that you delete all their birth-data, notes, and records from your practice databases.",
    options: {
      refuse: {
        label: "Option A: Refuse Erasure",
        text: "Inform the client that astrology is a sacred oral tradition, and data privacy laws do not apply to private spiritual consultations.",
        dpdp: 0,
        gdpr: 0,
        gita: 0,
        isCompliant: false,
        feedback: "Illegal. Astrologer practices are not exempt from data protection laws. Clients have a legal right of erasure, and you must comply or face heavy penalties."
      },
      protect: {
        label: "Option B: Comply with Secure Erasure",
        text: "Securely erase all birth-data, notes, and interpretative reports from your databases, keeping only basic transaction logs for financial audits.",
        dpdp: 100,
        gdpr: 100,
        gita: 100,
        isCompliant: true,
        feedback: "Perfect compliance. Complies with GDPR Article 17 and DPDP 2023 Section 12 right-to-erasure requirements."
      }
    }
  }
};

export function ConfidentialityAuditor() {
  const [activeTab, setActiveTab] = useState<string>("spouse");
  const [activeOpt, setActiveOpt] = useState<string>("disclose");

  const scenario = SCENARIOS[activeTab];
  const option = scenario.options[activeOpt] || Object.values(scenario.options)[0];

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
          <Shield size={16} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Legal & Data Compliance
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Client Data Privacy Auditor
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Audit real-world consulting scenarios and balance modern data protection laws (DPDP 2023, GDPR) with the classical disclosure-discipline.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl mb-6" style={{ background: SURFACE_2 }}>
        {Object.entries(SCENARIOS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              setActiveOpt(Object.keys(s.options)[0]);
            }}
            className="flex-1 min-w-[120px] py-2 px-3 rounded-lg border text-center transition-all text-xs font-bold"
            style={{
              background: activeTab === key ? SURFACE : "transparent",
              borderColor: activeTab === key ? GOLD : "transparent",
              color: activeTab === key ? INK_PRIMARY : INK_SECONDARY,
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        
        {/* Left: Scenario & Actions */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Audit Scenario context
            </span>
            <p className="m-0 text-xs leading-relaxed" style={{ color: INK_PRIMARY }}>
              {scenario.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>
              Select Decision Action
            </span>
            <div className="flex flex-col gap-2">
              {Object.entries(scenario.options).map(([key, opt]) => (
                <button
                  key={key}
                  onClick={() => setActiveOpt(key)}
                  className="w-full p-3 rounded-lg border text-left transition-all text-xs flex flex-col gap-1 hover:bg-white/50"
                  style={{
                    background: activeOpt === key ? SURFACE_2 : SURFACE,
                    borderColor: activeOpt === key ? GOLD : HAIRLINE,
                  }}
                >
                  <span className="font-bold" style={{ color: activeOpt === key ? INK_PRIMARY : INK_SECONDARY }}>
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

        {/* Right: Compliance Report Card */}
        <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
          <div>
            <div className="mb-4 flex items-center gap-1.5 border-b pb-2" style={{ borderColor: HAIRLINE }}>
              <Lock size={14} color={GOLD} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Data Compliance Report Card & Firewall
              </span>
            </div>

            {/* Visual SVG Data Firewall Stream */}
            <div className="flex justify-center rounded-xl p-3 mb-4 border bg-white" style={{ borderColor: HAIRLINE }}>
              <svg width="200" height="120" viewBox="0 0 200 120">
                {/* Boundary Line */}
                <line x1="100" y1="10" x2="100" y2="110" stroke={option.isCompliant ? GREEN : VERMILION} strokeWidth="1.5" strokeDasharray="3,3" />
                <text x="100" y="8" fill={option.isCompliant ? GREEN : VERMILION} fontSize="6.5" fontWeight="bold" textAnchor="middle">BOUNDARY</text>

                {/* Local vault */}
                <g transform="translate(35, 60)">
                  <rect x="-25" y="-18" width="50" height="36" rx="4" fill="rgba(168,130,30,0.1)" stroke={GOLD} strokeWidth="1.5" />
                  <text x="0" y="-2" textAnchor="middle" fontSize="7" fontWeight="bold" fill={INK_PRIMARY}>Client Data</text>
                  <text x="0" y="8" textAnchor="middle" fontSize="6.5" fill={INK_SECONDARY}>Vault</text>
                </g>

                {/* External World */}
                <g transform="translate(165, 60)">
                  <rect x="-25" y="-18" width="50" height="36" rx="4" fill="none" stroke="rgba(77, 65, 51, 0.4)" strokeWidth="1" />
                  <text x="0" y="-2" textAnchor="middle" fontSize="7" fontWeight="bold" fill={INK_PRIMARY}>External</text>
                  <text x="0" y="8" textAnchor="middle" fontSize="6.5" fill={INK_SECONDARY}>Recipient</text>
                </g>

                {/* Data Flow Beam */}
                {option.isCompliant ? (
                  <>
                    {/* Secure local routing */}
                    <path d="M 60 60 Q 100 60, 100 90" fill="none" stroke={GREEN} strokeWidth="2" />
                    {/* Padlock closed */}
                    <g transform="translate(100, 60)">
                      <circle cx="0" cy="0" r="10" fill={GREEN} />
                      <text x="0" y="3.5" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold">🔒</text>
                    </g>
                    <g transform="translate(100, 95)">
                      <rect x="-25" y="-8" width="50" height="16" rx="3" fill="rgba(46,125,50,0.1)" stroke={GREEN} strokeWidth="1" />
                      <text x="0" y="2" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill={GREEN}>Secure</text>
                    </g>
                  </>
                ) : (
                  <>
                    {/* Leaking data stream */}
                    <line x1="60" y1="60" x2="140" y2="60" stroke={VERMILION} strokeWidth="2.5" strokeDasharray="4,2" />
                    {/* Padlock open */}
                    <g transform="translate(100, 60)">
                      <circle cx="0" cy="0" r="10" fill={VERMILION} />
                      <text x="0" y="3.5" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold">🔓</text>
                    </g>
                    <text x="100" y="48" fill={VERMILION} fontSize="7" fontWeight="bold" textAnchor="middle">DATA BREACH</text>
                  </>
                )}
              </svg>
            </div>

            {/* Score bars */}
            <div className="space-y-4">
              
              {/* DPDP 2023 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>DPDP 2023 Compliance (India):</span>
                  <span style={{ color: option.dpdp === 100 ? GREEN : VERMILION }}>{option.dpdp}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${option.dpdp}%` }}
                    transition={{ duration: 0.4 }}
                    style={{ background: option.dpdp === 100 ? GREEN : VERMILION }}
                  />
                </div>
              </div>

              {/* GDPR */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>GDPR Compliance (EU):</span>
                  <span style={{ color: option.gdpr === 100 ? GREEN : VERMILION }}>{option.gdpr}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${option.gdpr}%` }}
                    transition={{ duration: 0.4 }}
                    style={{ background: option.gdpr === 100 ? GREEN : VERMILION }}
                  />
                </div>
              </div>

              {/* Gītā 18.67 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Bhagavad Gītā 18.67 (Disclosure Limit):</span>
                  <span style={{ color: option.gita === 100 ? GREEN : VERMILION }}>{option.gita}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${option.gita}%` }}
                    transition={{ duration: 0.4 }}
                    style={{ background: option.gita === 100 ? GREEN : VERMILION }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Compliance Status Block */}
          <div className="mt-6 pt-4 border-t" style={{ borderColor: HAIRLINE }}>
            <div
              className="p-3 rounded-lg flex items-start gap-2.5 text-[11px] leading-normal"
              style={{
                background: SURFACE_2,
                border: `1px solid ${option.isCompliant ? GREEN : VERMILION}33`,
              }}
            >
              {option.isCompliant ? (
                <>
                  <CheckCircle size={15} color={GREEN} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: GREEN }}>Compliant Decision</span>
                    <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{option.feedback}</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle size={15} color={VERMILION} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: VERMILION }}>Compliance Breach</span>
                    <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{option.feedback}</p>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Gītā Sloka Footer */}
      <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: HAIRLINE }}>
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Bhagavad Gītā 18.67 — The Discipline of Disclosure
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          इदं ते नातपस्काय नाभक्ताय कदाचन। न चाशुश्रूषवे वाच्यं न च मां योऽभ्यसूयति॥ १८.६७॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          idaṁ te nātapaskāya nābhaktāya kadācana | na cāśuśrūṣave vācyaṁ na ca māṁ yo&apos;bhyasūyati || 18.67 ||
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;This [teaching] should never be spoken by you to one who lacks self-discipline, who lacks devotion, who has no desire to listen, or who scorns the truth.&rdquo;
        </p>
      </div>
    </div>
  );
}
