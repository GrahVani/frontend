"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass, ShieldCheck, AlertTriangle, Map, Info, Sparkles, BookOpen } from "lucide-react";
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

interface TierDetail {
  title: string;
  subtitle: string;
  description: string;
  requirements: string[];
  mandatory: boolean;
}

const TIER_DETAILS: Record<number, TierDetail> = {
  1: {
    title: "Tier 1: Survey Foundation",
    subtitle: "Complete survey of all six streams",
    description: "Builds general chart literacy, basic yoga recognition, divisional chart definitions, and historical context.",
    requirements: ["Completion of 24 modules (~600 lessons)", "Basic chart reading competence", "Practitioner ethics baseline (M24)"],
    mandatory: true,
  },
  2: {
    title: "Tier 2: Stream Mastery",
    subtitle: "Deepen 1-2 streams to working fluency",
    description: "The vocational core. You study primary Sanskrit texts slowly alongside live charts to develop reliable predictive skills.",
    requirements: ["Deep focus in Parāśarī, Jaimini, or KP", "Aggregate hits-and-misses journal tracking", "ICAS or paramparā community calibration"],
    mandatory: true,
  },
  3: {
    title: "Tier 3: Advanced Techniques",
    subtitle: "Specialized application domains",
    description: "Deepens into advanced predictive methods (special dashas, vargas) or specialized fields like Muhūrta or medical astrology.",
    requirements: ["Tier-2 stream working fluency", "Specialized domain research or training", "Integrated cross-stream testing"],
    mandatory: false,
  },
  4: {
    title: "Tier 4: Research Contribution",
    subtitle: "Original scholarship & data validation",
    description: "Advancing the discipline itself. Textual translation, manuscript recovery, and empirical validation of classical techniques.",
    requirements: ["Textual research or statistical dataset audits", "Verification against multiple lineage claims", "Peer-reviewed publication contribution"],
    mandatory: false,
  },
  5: {
    title: "Tier 5: Transmission & Mentorship",
    subtitle: "Perpetuating lineage knowledge",
    description: "Assuming the teacher role in the paramparā, writing curricula, leading professional bodies, and sustaining the next generation.",
    requirements: ["Verifiable lineage authority", "Structure curriculum development", "Loka-saṅgraha standard-setting stewardship"],
    mandatory: false,
  },
};

export function Tier2Preview() {
  const [activeTab, setActiveTab] = useState<"matcher" | "ex1" | "ex2" | "progression">("matcher");

  // Custom Matcher states
  const [coreStrength, setCoreStrength] = useState<string>("parashari");
  const [resonance, setResonance] = useState<string>("parashari");
  const [clientBase, setClientBase] = useState<string>("life_path");
  const [community, setCommunity] = useState<string>("icas");

  // SVG Active Tier State
  const [activeTier, setActiveTier] = useState<number>(2);

  // Calibration scores & outputs
  let fragilityRisk = 15;
  let compliance: "empowered" | "dependent" | "neglect" = "empowered";
  let recommendationText = "";

  if (activeTab === "matcher") {
    const isAligned = coreStrength === resonance;
    const isClientFit =
      (coreStrength === "parashari" && clientBase === "life_path") ||
      (coreStrength === "kp" && clientBase === "horary") ||
      (coreStrength === "tajika" && clientBase === "annual");

    if (!isAligned && community === "none") {
      fragilityRisk = 90;
      compliance = "neglect";
      recommendationText = "Severe Paradharma risk! Specialising without resonance or community support leads to fragile practice (para-dharmo bhayāvahaḥ).";
    } else if (!isAligned) {
      fragilityRisk = 70;
      compliance = "dependent";
      recommendationText = "Mismatched Affinity. Your affinity resonance contradicts your tracked journal hit-rate. Check if prestige is overriding your strengths.";
    } else if (!isClientFit) {
      fragilityRisk = 50;
      compliance = "dependent";
      recommendationText = "Context Divergence. Your chosen specialisation stream does not match your primary client work profile.";
    } else if (community === "none") {
      fragilityRisk = 60;
      compliance = "neglect";
      recommendationText = "Isolated Specialisation. Even with aligned strength, pursuing Tier 2 without community calibration risks idiosyncratic drift.";
    } else {
      fragilityRisk = 12;
      compliance = "empowered";
      recommendationText = "Pure Svadharma alignment. Your specialisation integrates journal evidence, intellectual resonance, client profile, and lineage support.";
    }
  } else if (activeTab === "ex1") {
    // Student B Svadharma Alignment
    fragilityRisk = 12;
    compliance = "empowered";
    recommendationText = "Svadharma Compliant: Student B aligns journal evidence (70% Parāśarī dasha hit rate), intellectual resonance, client profile (life path natal), and ICAS lineage support. Choosing Parāśarī primary and deferring Jaimini honors Sequence Principle 3.";
  } else if (activeTab === "ex2") {
    // Student A Paradharma Failure
    fragilityRisk = 85;
    compliance = "neglect";
    recommendationText = "All-Streams-Equally Fallacy: Student A attempts Tier-2 mastery in all six streams in parallel. Dispersing focus results in shallow survey-level competence in all, but working fluency in none. This is the vocational para-dharma failure.";
  }

  const activeDetail = TIER_DETAILS[activeTier];

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
          <Map size={16} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Module 24 • Chapter 4 • Lesson 4
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Svadharma Stream Mastery Map
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Configure your progression choices or preview the lesson worked examples. Interact with the 5-Tier progression flowchart below.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        {[
          { id: "matcher", label: "Svadharma Matcher" },
          { id: "ex1", label: "Example 1: Student B (Svadharma)" },
          { id: "ex2", label: "Example 2: Student A (Paradharma)" },
          { id: "progression", label: "5-Tier Progression Map" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === "progression") setActiveTier(2);
            }}
            className="pb-2 px-1 text-xs font-bold transition-all relative"
            style={{
              color: activeTab === tab.id ? GOLD : INK_SECONDARY,
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: GOLD }}
                layoutId="activeTabUnderline4"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Layout */}
      {activeTab === "matcher" && (
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          {/* Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Journal proven strength
              </label>
              <select
                value={coreStrength}
                onChange={(e) => setCoreStrength(e.target.value)}
                className="p-2 text-xs rounded-lg border bg-white focus:outline-none"
                style={{ borderColor: HAIRLINE, color: INK_PRIMARY }}
              >
                <option value="parashari">Parāśarī (Dasa/Transit)</option>
                <option value="jaimini">Jaimini (Karakas/Sign Dasa)</option>
                <option value="kp">KP (Sub-lord Horary)</option>
                <option value="tajika">Tājika (Solar Annuals)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Intellectual Affinity
              </label>
              <select
                value={resonance}
                onChange={(e) => setResonance(e.target.value)}
                className="p-2 text-xs rounded-lg border bg-white focus:outline-none"
                style={{ borderColor: HAIRLINE, color: INK_PRIMARY }}
              >
                <option value="parashari">High with Parāśarī</option>
                <option value="jaimini">High with Jaimini</option>
                <option value="kp">High with KP</option>
                <option value="tajika">High with Tājika</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Primary Client Profile
              </label>
              <select
                value={clientBase}
                onChange={(e) => setClientBase(e.target.value)}
                className="p-2 text-xs rounded-lg border bg-white focus:outline-none"
                style={{ borderColor: HAIRLINE, color: INK_PRIMARY }}
              >
                <option value="life_path">Life Path counseling (Natal)</option>
                <option value="horary">Immediate Action timing (Praśna)</option>
                <option value="annual">Year-Ahead Solar Returns (Varṣaphala)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Community Support Node
              </label>
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="p-2 text-xs rounded-lg border bg-white focus:outline-none"
                style={{ borderColor: HAIRLINE, color: INK_PRIMARY }}
              >
                <option value="icas">ICAS/ACVA Chapters</option>
                <option value="gurukula">Active Remote Gurukula</option>
                <option value="none">Isolated Practice (None)</option>
              </select>
            </div>
          </div>

          {/* Svadharma Verification Output */}
          <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: GOLD }}>
                Svadharma Alignment Auditor
              </span>
              <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                {recommendationText}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t" style={{ borderColor: HAIRLINE }}>
              <div className="flex justify-between text-[10px] font-bold mb-1">
                <span>Fragility & Paradharma Risk:</span>
                <span style={{ color: fragilityRisk > 50 ? VERMILION : GREEN }}>{fragilityRisk}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                <div className="h-full" style={{ width: `${fragilityRisk}%`, background: fragilityRisk > 50 ? VERMILION : GREEN }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ex1" && (
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-3 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
            <div className="p-3.5 rounded bg-emerald-50 border border-emerald-200">
              <strong className="block mb-1" style={{ color: GREEN }}>Student B Parameters (Svadharma Compliant)</strong>
              <ul className="m-0 pl-4 list-disc space-y-1 text-[11px]">
                <li><strong>Journal proven strength:</strong> Parāśarī dasha + transit confirmation shows 70% hit-rate (from 14 entries).</li>
                <li><strong>Intellectual Affinity:</strong> High resonance with BPHS and Phaladīpikā. Curious about Jaimini.</li>
                <li><strong>Client Profile:</strong> Broad life path counseling.</li>
                <li><strong>Community node:</strong> Regional ICAS chapter offering structured mentor program.</li>
              </ul>
            </div>
            <p className="m-0 text-[11px]">
              Student B decides on Parāśarī as their primary Tier-2 specialisation, and Jaimini as a secondary stream deferred until working fluency in Parāśarī is fully consolidated.
            </p>
          </div>

          <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: GOLD }}>
                Auditor Verdict
              </span>
              <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                {recommendationText}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t" style={{ borderColor: HAIRLINE }}>
              <div className="flex justify-between text-[10px] font-bold">
                <span>Fragility Risk:</span>
                <span style={{ color: GREEN }}>{fragilityRisk}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ex2" && (
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-3 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
            <div className="p-3.5 rounded bg-red-50 border border-red-200">
              <strong className="block mb-1" style={{ color: VERMILION }}>Student A Parameters (Paradharma Deviation)</strong>
              <ul className="m-0 pl-4 list-disc space-y-1 text-[11px]">
                <li><strong>Journal proven strength:</strong> None established (T1 survey completed).</li>
                <li><strong>Aspiration:</strong> Intends to master all 6 streams (Parāśarī, Jaimini, KP, Tājika, Lal Kitab, Nāḍī) to Tier-2 level simultaneously.</li>
                <li><strong>Rationale:</strong> Belief that 'a complete daivajña must master every stream immediately for marketability'.</li>
              </ul>
            </div>
            <p className="m-0 text-[11px]">
              Student A divides their time equally across all streams, failing to build deep fluency in any. At Year 5, their live-chart reading skill remains restricted to Tier-1 survey levels.
            </p>
          </div>

          <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: GOLD }}>
                Auditor Verdict
              </span>
              <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                {recommendationText}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t" style={{ borderColor: HAIRLINE }}>
              <div className="flex justify-between text-[10px] font-bold">
                <span>Fragility Risk:</span>
                <span style={{ color: VERMILION }}>{fragilityRisk}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "progression" && (
        <div className="grid gap-6 md:grid-cols-[1.1fr_1.1fr]">
          {/* Flowchart Panel */}
          <div>
            <div className="mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                Click a Node to Inspect Requirements (T1-T5)
              </span>
            </div>
            <div className="flex justify-center rounded-xl p-3 border bg-white" style={{ borderColor: HAIRLINE }}>
              <svg width="220" height="90" viewBox="0 0 220 90">
                <line x1="20" y1="45" x2="60" y2="45" stroke="rgba(168,130,30,0.3)" strokeWidth="1.5" />
                <line x1="60" y1="45" x2="100" y2="45" stroke="rgba(168,130,30,0.3)" strokeWidth="1.5" />
                <path d="M 100 45 C 120 45, 120 25, 140 25" fill="none" stroke="rgba(168,130,30,0.2)" strokeWidth="1.5" />
                <path d="M 100 45 C 120 45, 120 65, 140 65" fill="none" stroke="rgba(168,130,30,0.2)" strokeWidth="1.5" />
                
                {[
                  { t: 1, x: 20, y: 45, lbl: "T1" },
                  { t: 2, x: 60, y: 45, lbl: "T2" },
                  { t: 3, x: 100, y: 45, lbl: "T3" },
                  { t: 4, x: 140, y: 25, lbl: "T4" },
                  { t: 5, x: 140, y: 65, lbl: "T5" },
                ].map((n) => (
                  <g key={n.t} className="cursor-pointer" onClick={() => setActiveTier(n.t)}>
                    <circle cx={n.x} cy={n.y} r="11" fill={activeTier === n.t ? GOLD : SURFACE_2} stroke={GOLD} strokeWidth="1.5" />
                    <text x={n.x} y={n.y + 3} fill={activeTier === n.t ? "#FFF" : INK_PRIMARY} fontSize="7" fontWeight="bold" textAnchor="middle">{n.lbl}</text>
                  </g>
                ))}
                
                <text x="20" y="80" fill={INK_MUTED} fontSize="5" textAnchor="middle">Survey</text>
                <text x="60" y="80" fill={INK_MUTED} fontSize="5" textAnchor="middle">Mastery</text>
                <text x="100" y="80" fill={INK_MUTED} fontSize="5" textAnchor="middle">Specialist</text>
                <text x="160" y="20" fill={INK_MUTED} fontSize="5" textAnchor="middle">Research (Optional)</text>
                <text x="160" y="80" fill={INK_MUTED} fontSize="5" textAnchor="middle">Teaching (Optional)</text>
              </svg>
            </div>
            
            <p className="m-0 mt-3 text-[10px] text-stone-600 leading-relaxed">
              *Note: Progression is non-linear. Many practitioners spend a full career operating at Tier 2 or 3. Tier 4 and 5 are additional paths, not stages everyone must reach.
            </p>
          </div>

          {/* Details Panel */}
          <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                {activeDetail.title}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider" style={{
                background: activeDetail.mandatory ? `${VERMILION}22` : `${GREEN}22`,
                color: activeDetail.mandatory ? VERMILION : GREEN,
              }}>
                {activeDetail.mandatory ? "Core Core" : "Optional"}
              </span>
            </div>
            <span className="text-[9px] italic" style={{ color: INK_MUTED }}>{activeDetail.subtitle}</span>
            <p className="m-0 text-[10px] leading-relaxed" style={{ color: INK_SECONDARY }}>{activeDetail.description}</p>
            
            <div className="mt-2 pt-2 border-t" style={{ borderColor: HAIRLINE }}>
              <span className="text-[8px] font-bold uppercase tracking-wider block mb-1 text-stone-500">Requirements:</span>
              <ul className="m-0 pl-3 list-disc space-y-0.5 text-[9px]" style={{ color: INK_SECONDARY }}>
                {activeDetail.requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Footer Sloka */}
      <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: HAIRLINE }}>
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Bhagavad Gītā 3.35 — Sva-Dharma Progression
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्। स्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥ ३.३५॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          śreyān sva-dharmo viguṇaḥ para-dharmāt sv-anuṣṭhitāt | sva-dharme nidhanaṁ śreyaḥ para-dharmo bhayāvahaḥ || 3.35 ||
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;Better one's own dharma imperfectly performed than another's perfectly performed; another's dharma is fraught with fear.&rdquo;
        </p>
      </div>

    </div>
  );
}
