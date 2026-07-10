"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  CircleDot,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  Compass,
  ArrowRight,
  UserCheck,
  Sliders,
  Award,
  AlertTriangle,
} from "lucide-react";
import { ink, goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = "#A8821E";
const VERMILION = "#C8412E";
const GREEN = "#2E7D32";

interface DisclosureData {
  title: string;
  sanskrit: string;
  iast: string;
  brief: string;
  detail: string;
  angleDeg: number;
}

const DISCLOSURES: DisclosureData[] = [
  {
    title: "1. The Verification Gap",
    sanskrit: "अज्ञाता स्थितिः",
    iast: "ajñātā sthitiḥ",
    brief: "No rigorous scientific proof exists, nor does any disproof. Keep the mechanism open.",
    detail: "We must declare honestly that the predictive mechanism behind Nāḍī is open. Avoid the collapse into mystification ('it is proven') and the collapse into cynicism ('it is all a fraud').",
    angleDeg: -90, // Top
  },
  {
    title: "2. Quality Varies Wildly",
    sanskrit: "गुणभेदः",
    iast: "guṇa-bhedaḥ",
    brief: "Skill, lineage legitimacy, and integrity vary enormously among modern readers.",
    detail: "The tradition being real does not guarantee any given reader's reliability. Reputation and high cost do not guarantee integrity. Vetting is mandatory.",
    angleDeg: -18, // Top Right
  },
  {
    title: "3. Ordinary Explanations Fit",
    sanskrit: "लौकिककारणानि",
    iast: "laukika-kāraṇāni",
    brief: "Cold reading, pre-session research, and memory explain striking details too.",
    detail: "A seeker hearing their mother's name is striking, but it is not singular proof of a cosmic record. Ordinary informational and psychological factors explain the result just as well.",
    angleDeg: 54, // Bottom Right
  },
  {
    title: "4. Commercial Scams Exist",
    sanskrit: "वञ्चनोपायः",
    iast: "vañcanopāyaḥ",
    brief: "Exorbitant remedy demands and fear-based selling are documented scam loops.",
    detail: "Predictive details are often used as hooks to sell ₹2 lakh remedies downstream. A genuine tradition does not leverage crisis-framing or guarantees to extract wealth.",
    angleDeg: 126, // Bottom Left
  },
  {
    title: "5. Nāḍī is Never First",
    sanskrit: "न प्रथमं सूचनम्",
    iast: "na prathamaṁ sūcanam",
    brief: "Nāḍī is strictly secondary. Chart analysis and practical reasoning lead the consultation.",
    detail: "Do not raise Nāḍī unprompted. If the client introduces it, frame it as a supplementary perspective. Major decisions must never rest on a single Nāḍī prediction.",
    angleDeg: 198, // Top Left
  },
];

interface FlowStep {
  title: string;
  role: string;
  dialogue: string;
  riskAverted: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    title: "1. Seeker Query",
    role: "Acknowledge request without unprompted promotion",
    dialogue: '"I hear that you are considering a Nāḍī reading. It is a fascinating tradition, and before we proceed with referrals or options, we must walk through its limits and realities together."',
    riskAverted: "Prevents introducing Nāḍī unprompted, which dilutes the chart-first focus.",
  },
  {
    title: "2. Deliver Disclosures",
    role: "Deliver all 5 disclosures upfront",
    dialogue: '"We must understand five things: the verification gap is open; reader quality varies; cold reading fits too; commercial remedy scams are common; and Nāḍī is never our first source."',
    riskAverted: "Averts client vulnerability by equipping them with critical awareness before they meet a reader.",
  },
  {
    title: "3. Motivation Check",
    role: "Calibrate advice based on seeker's emotional state",
    dialogue: '"Are you asking out of cultural curiosity, or is there a major crisis you are hoping this will resolve? If you are under severe stress, we must focus on practical stability first."',
    riskAverted: "Filters out seekers in crisis who might make impulsive, fear-driven financial choices.",
  },
  {
    title: "4. Chart-First Look",
    role: "Evaluate primary chart indicators and practical context",
    dialogue: '"Let us look at your birth chart first. Your career markers and current dasha point to [X]. This practical reality remains our primary guidance, regardless of what is on a leaf."',
    riskAverted: "Prevents letting a single contested source override systematic chart analysis and common sense.",
  },
  {
    title: "5. Vetting Checklist",
    role: "Provide reader due-diligence before refering",
    dialogue: '"If you choose to proceed, here is the before-you-go checklist. Do not share your birth detail upfront, and refuse any reader who demands large remedy fees under fear."',
    riskAverted: "Shields the client from predatory readers by mandating strict informational due diligence.",
  },
  {
    title: "6. Autonomy & Support",
    role: "Leave choice with client, support post-reading",
    dialogue: '"The final choice is yours. If you go, we will meet afterward to read the leaf results honestly, keeping your personal agency and secondary framing intact."',
    riskAverted: "Ensures the practitioner never commands or acts as an absolute oracle, reinforcing client agency.",
  },
];

export function NadiHonestHandlingInstance() {
  const [activeTab, setActiveTab] = useState<"wheel" | "timeline" | "sliders">("wheel");
  const [selectedDisc, setSelectedDisc] = useState<number | null>(0);
  const [deliveredDisclosures, setDeliveredDisclosures] = useState<boolean[]>([false, false, false, false, false]);
  const [activeStep, setActiveStep] = useState(0);

  // Sliders State
  const [sliders, setSliders] = useState({
    causation: 75,       // High is multi-cause (good), low is single-cause (violating)
    fearInduction: 15,   // High is fear-mongering (violating), low is no fear (good)
    grounds: 80,         // High is convergent grounds (good), low is single-source (violating)
    remedyCost: 20,      // High is exorbitant (violating), low is calibrated (good)
    scope: 85,           // High is within scope (good), low is impersonation (violating)
  });

  const handleDiscClick = (idx: number) => {
    setSelectedDisc(idx);
    setDeliveredDisclosures((curr) => {
      const next = [...curr];
      next[idx] = true;
      return next;
    });
  };

  // Evaluate sliders for do-no-harm violations
  const violations: string[] = [];
  if (sliders.causation < 50) {
    violations.push("Single-Cause Thinking: Outcomes must never be pinned on one prediction alone. Lives are multi-causal.");
  }
  if (sliders.fearInduction > 30) {
    violations.push("Predatory Fear-Induction: Leveraging client anxiety to suggest or enforce remedies violates the do-no-harm floor.");
  }
  if (sliders.grounds < 60) {
    violations.push("Single-Source Reliance: Major life choices (marriage/career) require convergent grounds across chart, life, and practical reasoning.");
  }
  if (sliders.remedyCost > 40) {
    violations.push("Exorbitant Remedy Endorsement: High-fee remedies with outcome guarantees are documented scams. Endorsing them is prohibited.");
  }
  if (sliders.scope < 50) {
    violations.push("Credential Impersonation: Practitioners have Nāḍī awareness, not reading credentials. Do not read raw leaves or prescribe custom rituals.");
  }

  const isCompliant = violations.length === 0;

  return (
    <div
      className="gl-surface-twilight-glass w-full animate-fadeIn"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${goldOnGlassHairline}`,
        borderRadius: 16,
        padding: "24px 26px 20px",
        color: INK_PRIMARY,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
      }}
    >
      {/* Scoped CSS Style Injection */}
      <style>{`
        .mandala-node circle {
          transition: all 0.22s ease-in-out;
        }
        .mandala-node:hover circle {
          r: 28px !important;
          stroke: #C8412E !important;
          stroke-width: 2.5px !important;
        }
        .mandala-node text {
          transition: fill 0.22s ease-in-out;
        }
        .mandala-node:hover text {
          fill: #C8412E !important;
        }
      `}</style>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b pb-4" style={{ borderColor: HAIRLINE }}>
        <div>
          <div className="flex items-center gap-2">
            <Compass size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
              Interactive Widget
            </p>
          </div>
          <h2 className="mt-1 m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Honest Handling Wisdom Mandala
          </h2>
          <p className="mt-1 m-0 text-xs text-stone-600" style={{ color: INK_SECONDARY }}>
            Explore the five disclosures, the chronological advisory pipeline, and calibrate do-no-harm boundaries.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex gap-1 rounded-lg p-0.5 bg-amber-55" style={{ background: SURFACE_2 }}>
          <button
            onClick={() => setActiveTab("wheel")}
            className="px-3 py-1 rounded-md text-xs font-semibold transition-all"
            style={{
              background: activeTab === "wheel" ? SURFACE : "transparent",
              color: activeTab === "wheel" ? INK_PRIMARY : INK_SECONDARY,
            }}
          >
            Disclosures Wheel
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className="px-3 py-1 rounded-md text-xs font-semibold transition-all"
            style={{
              background: activeTab === "timeline" ? SURFACE : "transparent",
              color: activeTab === "timeline" ? INK_PRIMARY : INK_SECONDARY,
            }}
          >
            Advisory Flow
          </button>
          <button
            onClick={() => setActiveTab("sliders")}
            className="px-3 py-1 rounded-md text-xs font-semibold transition-all"
            style={{
              background: activeTab === "sliders" ? SURFACE : "transparent",
              color: activeTab === "sliders" ? INK_PRIMARY : INK_SECONDARY,
            }}
          >
            Boundary Inspector
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* --- WISDOM WHEEL TAB --- */}
        {activeTab === "wheel" && (
          <motion.div
            key="wheel"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid gap-6 lg:grid-cols-[1fr_340px] items-center"
          >
            {/* SVG Interactive Wheel */}
            <div className="flex flex-col items-center justify-center">
              <svg viewBox="-180 -180 360 360" className="w-full max-w-[340px] h-auto block" aria-label="5-spoke interactive disclosures wisdom mandala wheel">
                <defs>
                  <radialGradient id="hubFill" cx="35%" cy="30%" r="80%">
                    <stop offset="0%" stopColor="#FFF9E5" />
                    <stop offset="100%" stopColor="#F0E0BA" />
                  </radialGradient>
                  <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#6B4423" floodOpacity="0.15" />
                  </filter>
                </defs>

                {/* Central Hub */}
                <circle cx={0} cy={0} r="40" fill="url(#hubFill)" stroke={GOLD} strokeWidth="2" filter="url(#nodeShadow)" />
                <text x={0} y={-4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3D2E0B">HONEST</text>
                <text x={0} y={8} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3D2E0B">ADVISING</text>
                <text x={0} y={18} textAnchor="middle" fontSize="6.5" fill="#705929" fontStyle="italic">M20 Chapter 5</text>

                {/* Spoke Lines & Satellite Nodes */}
                {DISCLOSURES.map((disc, idx) => {
                  const rad = (disc.angleDeg * Math.PI) / 180;
                  const x = Math.cos(rad) * 115;
                  const y = Math.sin(rad) * 115;
                  const isSelected = selectedDisc === idx;
                  const isDelivered = deliveredDisclosures[idx];

                  return (
                    <g key={idx}>
                      {/* Spoke connecting line */}
                      <line
                        x1={0}
                        y1={0}
                        x2={x}
                        y2={y}
                        stroke={isSelected ? VERMILION : isDelivered ? GREEN : `${GOLD}45`}
                        strokeWidth={isSelected ? 2.5 : 1}
                        strokeDasharray={isSelected ? "4 4" : "none"}
                      />

                      {/* Clickable Satellite Node */}
                      <g className="mandala-node cursor-pointer" onClick={() => handleDiscClick(idx)}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? 28 : 24}
                          fill={isSelected ? "url(#hubFill)" : SURFACE}
                          stroke={isSelected ? VERMILION : isDelivered ? GREEN : GOLD}
                          strokeWidth={isSelected ? 2.5 : 1.2}
                          filter="url(#nodeShadow)"
                          style={{ transition: "all 220ms ease" }}
                        />
                        <text
                          x={x}
                          y={y - 2}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="bold"
                          fill={isSelected ? VERMILION : isDelivered ? GREEN : INK_PRIMARY}
                        >
                          §{idx + 1}
                        </text>
                        <text
                          x={x}
                          y={y + 8}
                          textAnchor="middle"
                          fontSize="6.5"
                          fill={INK_SECONDARY}
                        >
                          {idx === 0 ? "Gap" : idx === 1 ? "Quality" : idx === 2 ? "Ordinary" : idx === 3 ? "Scams" : "Never First"}
                        </text>

                        {/* Checklist indicator */}
                        {isDelivered && (
                          <circle cx={x + 16} cy={y - 16} r="6" fill={GREEN} />
                        )}
                      </g>
                    </g>
                  );
                })}
              </svg>
              <p className="text-center italic mt-3 text-xs" style={{ color: INK_SECONDARY }}>
                Click each of the 5 outer nodes of the mandala to explain the disclosures.
              </p>
            </div>

            {/* Disclosure Details Card */}
            <div>
              {selectedDisc !== null ? (
                <div
                  className="rounded-xl p-5 border flex flex-col justify-between h-full space-y-4"
                  style={{
                    background: "rgba(255, 251, 240, 0.85)",
                    borderColor: `${GOLD}55`,
                  }}
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-100" style={{ color: GOLD }}>
                      Disclosure Section
                    </span>
                    <h4 className="m-0 text-base font-bold" style={{ color: INK_PRIMARY }}>
                      {DISCLOSURES[selectedDisc].title}
                    </h4>
                    <div className="flex gap-2 items-baseline text-xs italic" style={{ color: GOLD }}>
                      <span className="font-devanagari font-normal">{DISCLOSURES[selectedDisc].sanskrit}</span>
                      <span>—</span>
                      <span>{DISCLOSURES[selectedDisc].iast}</span>
                    </div>
                    <div style={{ height: "1px", background: `${GOLD}22`, margin: "8px 0" }} />
                    <p className="text-sm font-semibold" style={{ color: INK_PRIMARY, lineHeight: 1.4 }}>
                      {DISCLOSURES[selectedDisc].brief}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                      {DISCLOSURES[selectedDisc].detail}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: deliveredDisclosures[selectedDisc] ? GREEN : GOLD }}>
                      Status: {deliveredDisclosures[selectedDisc] ? "✓ Explained" : "○ Pending Click"}
                    </span>
                    <button
                      onClick={() => handleDiscClick((selectedDisc + 1) % 5)}
                      className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-[10px] font-bold text-white"
                      style={{ background: GOLD }}
                    >
                      Next Node
                      <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-5 border text-center" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
                  <HelpCircle size={28} className="mx-auto mb-2" color={GOLD} />
                  <p className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
                    Select a disclosure node
                  </p>
                  <p className="text-xs" style={{ color: INK_SECONDARY }}>
                    Click any node in the SVG wisdom mandala to read its full definition and explanations.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* --- ADVISORY FLOW TAB --- */}
        {activeTab === "timeline" && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Step buttons */}
            <div className="flex flex-wrap border-b" style={{ borderColor: HAIRLINE }}>
              {FLOW_STEPS.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className="flex-1 min-w-[100px] py-2 text-center text-xs font-bold transition-all border-b-2"
                  style={{
                    borderColor: activeStep === idx ? GOLD : "transparent",
                    color: activeStep === idx ? INK_PRIMARY : INK_MUTED,
                  }}
                >
                  Step {idx + 1}
                </button>
              ))}
            </div>

            {/* Step Content */}
            <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-stretch">
              <div className="rounded-xl p-5 border flex flex-col justify-between space-y-4" style={{ background: SURFACE, borderColor: HAIRLINE }}>
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Advisory Stage {activeStep + 1}: {FLOW_STEPS[activeStep].title}
                  </span>
                  <div className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>
                    <strong>Practitioner Role:</strong> {FLOW_STEPS[activeStep].role}
                  </div>
                  
                  <div className="p-4 rounded-lg italic text-sm text-amber-950 bg-amber-50" style={{ borderLeft: `4px solid ${GOLD}` }}>
                    {FLOW_STEPS[activeStep].dialogue}
                  </div>
                </div>

                <div className="pt-3 border-t text-xs" style={{ borderColor: HAIRLINE, color: INK_MUTED }}>
                  <strong>Risk Averted:</strong> {FLOW_STEPS[activeStep].riskAverted}
                </div>
              </div>

              <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
                <div className="space-y-3">
                  <h4 className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                    Consultation Steps
                  </h4>
                  <ul className="m-0 p-0 space-y-2 text-xs" style={{ listStyleType: "none" }}>
                    {FLOW_STEPS.map((step, idx) => (
                      <li
                        key={idx}
                        onClick={() => setActiveStep(idx)}
                        className="cursor-pointer flex items-center gap-2 transition-all p-1.5 rounded hover:bg-amber-100"
                        style={{
                          fontWeight: activeStep === idx ? "bold" : "normal",
                          color: activeStep === idx ? INK_PRIMARY : INK_SECONDARY,
                        }}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ background: activeStep === idx ? GOLD : `${GOLD}75` }}
                        >
                          {idx + 1}
                        </span>
                        {step.title}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setActiveStep((curr) => (curr + 1) % 6)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded py-2 text-xs font-bold text-white"
                  style={{ background: GOLD }}
                >
                  Next Step
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- SLIDERS TAB --- */}
        {activeTab === "sliders" && (
          <motion.div
            key="sliders"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid gap-6 lg:grid-cols-[1fr_340px] items-start"
          >
            {/* Sliders configurator */}
            <div className="space-y-4 rounded-xl p-5 border" style={{ background: SURFACE, borderColor: HAIRLINE }}>
              <h4 className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                Ethical Boundary Sliders
              </h4>
              <p className="m-0 text-xs text-stone-600" style={{ color: INK_SECONDARY }}>
                Adjust the sliders to test when the advisor's behavior violates the do-no-harm commitments.
              </p>

              {/* Slider 1 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>1. Multi-Causal Causation</span>
                  <span style={{ color: sliders.causation < 50 ? VERMILION : GREEN }}>
                    {sliders.causation < 50 ? "Single-Cause (Violating)" : "Multi-Causal (Safe)"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliders.causation}
                  onChange={(e) => setSliders((c) => ({ ...c, causation: Number(e.target.value) }))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-stone-200"
                  style={{ accentColor: sliders.causation < 50 ? VERMILION : GOLD }}
                />
              </div>

              {/* Slider 2 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>2. Fear-Induction Level</span>
                  <span style={{ color: sliders.fearInduction > 30 ? VERMILION : GREEN }}>
                    {sliders.fearInduction > 30 ? "Anxiety-based (Violating)" : "No Fear-induction (Safe)"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliders.fearInduction}
                  onChange={(e) => setSliders((c) => ({ ...c, fearInduction: Number(e.target.value) }))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-stone-200"
                  style={{ accentColor: sliders.fearInduction > 30 ? VERMILION : GOLD }}
                />
              </div>

              {/* Slider 3 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>3. Grounds Convergence</span>
                  <span style={{ color: sliders.grounds < 60 ? VERMILION : GREEN }}>
                    {sliders.grounds < 60 ? "Single-source (Violating)" : "Convergent (Safe)"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliders.grounds}
                  onChange={(e) => setSliders((c) => ({ ...c, grounds: Number(e.target.value) }))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-stone-200"
                  style={{ accentColor: sliders.grounds < 60 ? VERMILION : GOLD }}
                />
              </div>

              {/* Slider 4 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>4. Remedy Fee Calibrations</span>
                  <span style={{ color: sliders.remedyCost > 40 ? VERMILION : GREEN }}>
                    {sliders.remedyCost > 40 ? "Exorbitant (Violating)" : "Calibrated (Safe)"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliders.remedyCost}
                  onChange={(e) => setSliders((c) => ({ ...c, remedyCost: Number(e.target.value) }))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-stone-200"
                  style={{ accentColor: sliders.remedyCost > 40 ? VERMILION : GOLD }}
                />
              </div>

              {/* Slider 5 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>5. Practitioner Scope</span>
                  <span style={{ color: sliders.scope < 50 ? VERMILION : GREEN }}>
                    {sliders.scope < 50 ? "Impersonating (Violating)" : "Advisory Scope (Safe)"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliders.scope}
                  onChange={(e) => setSliders((c) => ({ ...c, scope: Number(e.target.value) }))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-stone-200"
                  style={{ accentColor: sliders.scope < 50 ? VERMILION : GOLD }}
                />
              </div>
            </div>

            {/* Verdict Box */}
            <div className="space-y-4">
              <div
                className="rounded-xl p-5 border-2 transition-all"
                style={{
                  background: isCompliant ? "rgba(46, 125, 50, 0.05)" : "rgba(200, 65, 46, 0.05)",
                  borderColor: isCompliant ? GREEN : VERMILION,
                }}
              >
                <div className="flex items-center gap-2">
                  {isCompliant ? (
                    <Award size={18} color={GREEN} />
                  ) : (
                    <ShieldAlert size={18} color={VERMILION} />
                  )}
                  <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: isCompliant ? GREEN : VERMILION }}>
                    Postures Assessment
                  </p>
                </div>
                <h3 className="mt-3 m-0 text-base font-bold" style={{ color: INK_PRIMARY }}>
                  {isCompliant ? "Compliant & Safe" : "Violates Do-No-Harm Floor"}
                </h3>
                <p className="mt-1.5 m-0 text-xs leading-normal" style={{ color: INK_SECONDARY }}>
                  {isCompliant
                    ? "Your slider adjustments align with the advisory constitution. The client is protected."
                    : "Your slider settings violated one or more strict commitments."}
                </p>
              </div>

              {/* Violations checklist */}
              {!isCompliant && (
                <div className="rounded-xl p-5 border bg-red-55" style={{ background: SURFACE, borderColor: VERMILION }}>
                  <div className="flex items-center gap-2 mb-3 text-red-700">
                    <AlertTriangle size={15} color={VERMILION} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: VERMILION }}>
                      Flagged Violations
                    </span>
                  </div>
                  <ul className="m-0 p-0 space-y-2.5 text-xs text-red-950" style={{ listStyleType: "none" }}>
                    {violations.map((violation, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span>{violation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
