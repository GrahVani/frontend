"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Scale, ShieldAlert, Sparkles, TrendingUp, Compass, Heart, AlertTriangle } from "lucide-react";
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

interface Option {
  pricing: "flat" | "tiered";
  action: "standard" | "upsell";
  waiver: boolean;
  guna: "Sattvika" | "Rajasika" | "Tamasika";
  nirlobha: number;
  trust: number;
  sustainability: string;
  feedback: string;
}

interface ClientCase {
  id: string;
  title: string;
  context: string;
  defaultFee: string;
  options: Record<string, Option>;
}

const CASES: Record<string, ClientCase> = {
  c1: {
    id: "c1",
    title: "Case 1: Relational Friction Crisis",
    context: "Client is in distress over a Saturn-Mars seventh-house conjunction. She seeks marital timing advice.",
    defaultFee: "₹3,500 (Standard Session)",
    options: {
      "flat-standard": {
        pricing: "flat",
        action: "standard",
        waiver: false,
        guna: "Sattvika",
        nirlobha: 95,
        trust: 95,
        sustainability: "Strong (Long-Term Referral Stream)",
        feedback: "Dharmic balance. Standard flat fee upfront. Astrological patterns are framed as conscious partner work, rather than fatalistic curses. Traditional remedies are given for the client's own practice without fees."
      },
      "flat-upsell": {
        pricing: "flat",
        action: "upsell",
        waiver: false,
        guna: "Tamasika",
        nirlobha: 20,
        trust: 15,
        sustainability: "High Short-Term Cash / Zero Trust",
        feedback: "Severe violation. Frames the chart configuration as a catastrophic 'destruct-curse' and upsells a ₹45,000 pūjā package. Leverages client fear for monetary extraction. Client trust collapses."
      },
      "tiered-standard": {
        pricing: "tiered",
        action: "standard",
        waiver: false,
        guna: "Rajasika",
        nirlobha: 55,
        trust: 65,
        sustainability: "Moderate",
        feedback: "Commercialized. Offering 'Premium Care Tiers' for better astrological reading is profit-motivated. Astrological quality should not be rationed based on fee tiers; different scopes are valid, different qualities are not."
      },
      "tiered-upsell": {
        pricing: "tiered",
        action: "upsell",
        waiver: false,
        guna: "Tamasika",
        nirlobha: 10,
        trust: 5,
        sustainability: "Unstable (Exploitative Model)",
        feedback: "Tāmasika. High-pressure sales leveraging tiered packages and fear-based ritual additions. Completely contradicts the Varāhamihira 'nirlobha' (greedless) standard."
      }
    }
  },
  c2: {
    id: "c2",
    title: "Case 2: Corporate Executive Priority Request",
    context: "A wealthy executive demands immediate priority scheduling and exclusive 'custom analysis' for commercial timing.",
    defaultFee: "₹3,500 (Standard Session)",
    options: {
      "flat-standard": {
        pricing: "flat",
        action: "standard",
        waiver: false,
        guna: "Sattvika",
        nirlobha: 90,
        trust: 92,
        sustainability: "Stable (Dignity and Professional Trust)",
        feedback: "Sāttvika. The practitioner treats the corporate executive with identical dedication as any client, maintaining the upfront flat-fee standard without opportunistic price hikes."
      },
      "flat-upsell": {
        pricing: "flat",
        action: "upsell",
        waiver: false,
        guna: "Rajasika",
        nirlobha: 40,
        trust: 50,
        sustainability: "Sustained by Upsells",
        feedback: "Rājasika. Although fee is flat, upselling unnecessary gemstones or custom rituals to a wealthy client who can 'afford it' violates nirlobha. The consultation becomes commodity trading."
      },
      "tiered-standard": {
        pricing: "tiered",
        action: "standard",
        waiver: false,
        guna: "Rajasika",
        nirlobha: 50,
        trust: 70,
        sustainability: "Profitable but Transactional",
        feedback: "Rājasika. Uses tiered pricing (e.g. ₹15,000 'Executive Premium Tier' with identical analytical substance) to extract more from high-net-worth individuals. Encourages transactional rather than spiritual dialogue."
      },
      "tiered-upsell": {
        pricing: "tiered",
        action: "upsell",
        waiver: false,
        guna: "Tamasika",
        nirlobha: 15,
        trust: 30,
        sustainability: "Short-Term Premium Revenue",
        feedback: "Tāmasika. Exploits the executive's career timing anxiety to sell ultra-expensive customized ritual interventions under exclusive labels. Complete loss of philosophical detachment."
      }
    }
  },
  c3: {
    id: "c3",
    title: "Case 3: Hardship Inquiry",
    context: "A student in acute distress seeks guidance but states that they cannot afford the ₹3,500 session fee.",
    defaultFee: "₹3,500 (Standard Session)",
    options: {
      "flat-standard-waiver": {
        pricing: "flat",
        action: "standard",
        waiver: true,
        guna: "Sattvika",
        nirlobha: 100,
        trust: 98,
        sustainability: "Compassion-Pricing Integration (~10-20% limit)",
        feedback: "Exemplary. Applies distress-fee-reduction quietly via honest conversation without requesting complex documentation. Fits the Varāhamihira 'dayā-yuta' (compassionate) and 'nirlobha' guidelines."
      },
      "flat-standard-nowaiver": {
        pricing: "flat",
        action: "standard",
        waiver: false,
        guna: "Rajasika",
        nirlobha: 65,
        trust: 75,
        sustainability: "Rigidly Commercial",
        feedback: "Rājasika. Strictly holds the standard fee line. Refusing to adjust for genuine distress indicates rigid profit focus over karuṇā (compassion)."
      },
      "flat-upsell-nowaiver": {
        pricing: "flat",
        action: "upsell",
        waiver: false,
        guna: "Tamasika",
        nirlobha: 5,
        trust: 5,
        sustainability: "Exploitative",
        feedback: "Extremely Tāmasika. Pressures a financially vulnerable student into expensive remedial loans or packages. A severe breach of the ahiṁsā client-protection mandate."
      },
      "tiered-standard-waiver": {
        pricing: "tiered",
        action: "standard",
        waiver: true,
        guna: "Rajasika",
        nirlobha: 60,
        trust: 80,
        sustainability: "Complex Hybrid",
        feedback: "Partially aligned. While offering a distress reduction, the practitioner still maintains quality-tiered consultation packages which creates internal conflict in service standards."
      }
    }
  }
};

export function ReasonableFees() {
  const [activeCase, setActiveCase] = useState<string>("c1");
  const [pricingModel, setPricingModel] = useState<"flat" | "tiered">("flat");
  const [actionResponse, setActionResponse] = useState<"standard" | "upsell">("standard");
  const [hardshipWaiver, setHardshipWaiver] = useState<boolean>(false);

  const clientCase = CASES[activeCase];

  // Resolve option key
  let optionKey = `${pricingModel}-${actionResponse}`;
  if (activeCase === "c3") {
    if (pricingModel === "flat" && actionResponse === "standard") {
      optionKey = hardshipWaiver ? "flat-standard-waiver" : "flat-standard-nowaiver";
    } else if (pricingModel === "flat" && actionResponse === "upsell") {
      optionKey = "flat-upsell-nowaiver"; // No waiver option on upsell
    } else {
      optionKey = hardshipWaiver ? "tiered-standard-waiver" : "flat-standard-nowaiver";
    }
  }

  const option = clientCase.options[optionKey] || Object.values(clientCase.options)[0];

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
          <Scale size={16} color={GOLD} className="animate-spin-slow" />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Fee Ethics & Dakṣiṇā Design
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Fee Ethics & Remedial Upsell Simulator
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Analyze client contexts and design appropriate pricing models matching classical Sanskrit nirlobha standards.
        </p>
      </div>

      {/* Case Tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl mb-6" style={{ background: SURFACE_2 }}>
        {Object.entries(CASES).map(([key, c]) => (
          <button
            key={key}
            onClick={() => {
              setActiveCase(key);
              setPricingModel("flat");
              setActionResponse("standard");
              setHardshipWaiver(false);
            }}
            className="flex-1 min-w-[120px] py-2 px-3 rounded-lg border text-center transition-all text-xs font-bold"
            style={{
              background: activeCase === key ? SURFACE : "transparent",
              borderColor: activeCase === key ? GOLD : "transparent",
              color: activeCase === key ? INK_PRIMARY : INK_SECONDARY,
            }}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        
        {/* Left Side: Context & Inputs */}
        <div className="flex flex-col gap-5">
          {/* Context Card */}
          <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Inquiry Context
            </span>
            <p className="m-0 text-xs leading-relaxed font-semibold" style={{ color: INK_PRIMARY }}>
              {clientCase.context}
            </p>
            <div className="mt-1 text-[10px] italic text-stone-600" style={{ color: INK_MUTED }}>
              Standard Practice Rate: {clientCase.defaultFee}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4">
            {/* Control 1: Pricing Model */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>
                1. Select Fee Structure
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPricingModel("flat")}
                  className="p-3 rounded-lg border text-left text-xs transition-all flex flex-col gap-0.5 hover:bg-white/50"
                  style={{
                    background: pricingModel === "flat" ? SURFACE_2 : SURFACE,
                    borderColor: pricingModel === "flat" ? GOLD : HAIRLINE,
                  }}
                >
                  <span className="font-bold" style={{ color: INK_PRIMARY }}>Flat Fee (₹3,500)</span>
                  <span className="text-[10px]" style={{ color: INK_MUTED }}>Expertise & Time standard rate</span>
                </button>
                <button
                  onClick={() => setPricingModel("tiered")}
                  className="p-3 rounded-lg border text-left text-xs transition-all flex flex-col gap-0.5 hover:bg-white/50"
                  style={{
                    background: pricingModel === "tiered" ? SURFACE_2 : SURFACE,
                    borderColor: pricingModel === "tiered" ? GOLD : HAIRLINE,
                  }}
                >
                  <span className="font-bold" style={{ color: INK_PRIMARY }}>Tiered Quality (Basic/Premium)</span>
                  <span className="text-[10px]" style={{ color: INK_MUTED }}>Rations read quality by fee tier</span>
                </button>
              </div>
            </div>

            {/* Control 2: Action Response */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>
                2. Select Counseling Action
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActionResponse("standard")}
                  className="p-3 rounded-lg border text-left text-xs transition-all flex flex-col gap-0.5 hover:bg-white/50"
                  style={{
                    background: actionResponse === "standard" ? SURFACE_2 : SURFACE,
                    borderColor: actionResponse === "standard" ? GOLD : HAIRLINE,
                  }}
                >
                  <span className="font-bold" style={{ color: INK_PRIMARY }}>Standard Counseling</span>
                  <span className="text-[10px]" style={{ color: INK_MUTED }}>Relational practice / Self-help remedies</span>
                </button>
                <button
                  onClick={() => setActionResponse("upsell")}
                  className="p-3 rounded-lg border text-left text-xs transition-all flex flex-col gap-0.5 hover:bg-white/50"
                  style={{
                    background: actionResponse === "upsell" ? SURFACE_2 : SURFACE,
                    borderColor: actionResponse === "upsell" ? GOLD : HAIRLINE,
                  }}
                >
                  <span className="font-bold" style={{ color: INK_PRIMARY }}>Remedial Upsell (₹45,000)</span>
                  <span className="text-[10px]" style={{ color: INK_MUTED }}>Tiered pūjās and gemstone upsells</span>
                </button>
              </div>
            </div>

            {/* Control 3: Hardship Waiver (Case 3 only) */}
            {activeCase === "c3" && (
              <div className="flex items-center gap-2.5 p-3 rounded-lg border bg-white" style={{ borderColor: HAIRLINE }}>
                <input
                  type="checkbox"
                  id="waiver-chk"
                  checked={hardshipWaiver}
                  onChange={(e) => {
                    setHardshipWaiver(e.target.checked);
                    if (e.target.checked) {
                      setPricingModel("flat");
                      setActionResponse("standard");
                    }
                  }}
                  className="w-4 h-4 accent-amber-700 cursor-pointer"
                />
                <label htmlFor="waiver-chk" className="text-xs font-bold cursor-pointer flex flex-col" style={{ color: INK_PRIMARY }}>
                  <span>Apply Distress-Fee-Reduction (Compassion Pricing)</span>
                  <span className="text-[10px] font-normal" style={{ color: INK_MUTED }}>Offer ₹1,200 reduced focused session quietly</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Guṇa Dial and Metrics */}
        <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
          <div>
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Dakṣiṇā Guṇa Dial
              </span>
            </div>

            {/* Guṇa Dial SVG */}
            <div className="flex justify-center rounded-xl p-3 mb-4 border bg-white" style={{ borderColor: HAIRLINE }}>
              <svg width="200" height="110" viewBox="0 0 200 110">
                {/* Arc tracks */}
                <path d="M 30,90 A 70,70 0 0,1 170,90" fill="none" stroke="rgba(168,130,30,0.1)" strokeWidth="8" strokeLinecap="round" />
                {/* Sattvika zone (Left) */}
                <path d="M 30,90 A 70,70 0 0,1 80,35" fill="none" stroke={GREEN} strokeWidth="8" strokeLinecap="round" />
                {/* Rajasika zone (Middle) */}
                <path d="M 80,35 A 70,70 0 0,1 120,35" fill="none" stroke={GOLD} strokeWidth="8" />
                {/* Tamasika zone (Right) */}
                <path d="M 120,35 A 70,70 0 0,1 170,90" fill="none" stroke={VERMILION} strokeWidth="8" strokeLinecap="round" />

                {/* Dial labels */}
                <text x="40" y="102" fill={GREEN} fontSize="7" fontWeight="bold" textAnchor="middle">Sāttvika</text>
                <text x="100" y="22" fill={GOLD} fontSize="7" fontWeight="bold" textAnchor="middle">Rājasika</text>
                <text x="160" y="102" fill={VERMILION} fontSize="7" fontWeight="bold" textAnchor="middle">Tāmasika</text>

                {/* Animated pointer based on guna */}
                {(() => {
                  let rotation = 0; // standard middle
                  if (option.guna === "Sattvika") rotation = -50;
                  if (option.guna === "Tamasika") rotation = 50;
                  const color = option.guna === "Sattvika" ? GREEN : option.guna === "Tamasika" ? VERMILION : GOLD;
                  return (
                    <g transform="translate(100, 90)">
                      <circle cx="0" cy="0" r="6" fill={INK_PRIMARY} />
                      <line x1="0" y1="0" x2="0" y2="-65" stroke={color} strokeWidth="3" transform={`rotate(${rotation})`} strokeLinecap="round" />
                    </g>
                  );
                })()}

                <text x="100" y="82" fill={INK_PRIMARY} fontSize="8" fontWeight="bold" textAnchor="middle">
                  {option.guna === "Sattvika" ? "Sāttvika Dakṣiṇā" : option.guna === "Tamasika" ? "Tāmasika Extraction" : "Rājasika Transaction"}
                </text>
              </svg>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              {/* Nirlobha Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Nirlobha (Greedless) Index:</span>
                  <span style={{ color: option.nirlobha > 60 ? GREEN : VERMILION }}>{option.nirlobha}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${option.nirlobha}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ background: option.nirlobha > 60 ? GREEN : option.nirlobha > 30 ? GOLD : VERMILION }}
                  />
                </div>
              </div>

              {/* Trust Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Client Trust & Integrity:</span>
                  <span style={{ color: option.trust > 60 ? GREEN : VERMILION }}>{option.trust}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${option.trust}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ background: option.trust > 60 ? GREEN : option.trust > 30 ? GOLD : VERMILION }}
                  />
                </div>
              </div>

              {/* Sustainability indicator */}
              <div className="flex items-center justify-between text-[11px] font-bold pt-2 border-t" style={{ borderColor: HAIRLINE }}>
                <span className="flex items-center gap-1">
                  <TrendingUp size={13} color={GOLD} />
                  <span>Practice Sustainability:</span>
                </span>
                <span style={{ color: option.guna === "Sattvika" ? GREEN : option.guna === "Tamasika" ? VERMILION : GOLD }}>
                  {option.guna === "Sattvika" ? "Sustainable" : option.guna === "Tamasika" ? "Unstable" : "Transactional"}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback details */}
          <div className="mt-4 pt-3 border-t" style={{ borderColor: HAIRLINE }}>
            <div
              className="p-3 rounded-lg flex items-start gap-2.5 text-[11px] leading-normal border"
              style={{
                background: SURFACE_2,
                borderColor: option.guna === "Sattvika" ? `${GREEN}33` : option.guna === "Tamasika" ? `${VERMILION}33` : `${GOLD}33`,
              }}
            >
              {option.guna === "Sattvika" ? (
                <>
                  <Heart size={15} color={GREEN} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: GREEN }}>Ethical Standard Met</span>
                    <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{option.feedback}</p>
                  </div>
                </>
              ) : option.guna === "Tamasika" ? (
                <>
                  <ShieldAlert size={15} color={VERMILION} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: VERMILION }}>Severe Ethics Failure</span>
                    <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{option.feedback}</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle size={15} color={GOLD} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: GOLD }}>Minor Ethics Issue</span>
                    <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{option.feedback}</p>
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
          Bhagavad Gītā 2.47 — The Fruit of Action
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥ २.४७॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          karmaṇy evādhikāras te mā phaleṣu kadāchana | mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi || 2.47 ||
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;You have the right to action alone, never to its fruits. Let not the fruits-of-action be your motivation; let not your attachment be to inaction either.&rdquo;
        </p>
      </div>
    </div>
  );
}
