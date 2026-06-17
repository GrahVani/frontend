"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Heart, Lock, Users, Compass, Eye, BookOpen, HandHeart, AlertTriangle, ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react";
import { goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5C3D26)";
const INK_MUTED = "var(--gl-ink-muted, #7C6D5B)";
const GOLD = "#A8821E";
const GREEN = "#2E7D32";
const VERMILION = "#A23A1E";

/* ─── §4.1 Eight Commitments — directly from the lesson table ─── */
interface Commitment {
  num: number;
  name: string;
  meaning: string;
  discipline: string;
  tested: string;
  icon: React.ReactNode;
}

const EIGHT_COMMITMENTS: Commitment[] = [
  { num: 1, name: "Ahiṁsā",                 meaning: "Do no psychological harm",                   discipline: "The refusal of fear-induction across every stream",            tested: "When fear would make the reading more dramatic — or more lucrative",                     icon: <Shield size={14} /> },
  { num: 2, name: "Truth with compassion",    meaning: "Never lie, never be cruel",                   discipline: "Honest handling held together with care",                       tested: "When the honest reading is hard to hear",                                                icon: <Heart size={14} /> },
  { num: 3, name: "Confidentiality",          meaning: "Guard the client's data as sacred",           discipline: "The trust a consultation depends on",                           tested: "When the client's story is interesting to others",                                       icon: <Lock size={14} /> },
  { num: 4, name: "Empowerment",              meaning: "Never make the client dependent",             discipline: "The empowerment principle (M24)",                               tested: "When dependence would mean repeat business",                                             icon: <Users size={14} /> },
  { num: 5, name: "Boundaries",               meaning: "Refer out; never over-reach",                 discipline: "The competence-boundary / adhikāra discipline",                 tested: "When admitting a limit feels like losing the client",                                    icon: <Compass size={14} /> },
  { num: 6, name: "Honest handling",           meaning: "Acknowledge limits and uncertainties",        discipline: "The practised/claimed/verified frame",                          tested: "When certainty would sound more impressive",                                             icon: <Eye size={14} /> },
  { num: 7, name: "Continuing learning",       meaning: "Never stagnate",                             discipline: "The mastery-not-completion principle",                          tested: "When competence tempts you to stop studying",                                            icon: <BookOpen size={14} /> },
  { num: 8, name: "Service orientation",       meaning: "Put the client's good above commercial gain", discipline: "The whole ethical spine of the tradition",                       tested: "When the client's interest and your income diverge",                                     icon: <HandHeart size={14} /> },
];

/* ─── §6 Pressure Scenarios — from lesson worked examples ─── */
interface PressureOption {
  label: string;
  text: string;
  commitments: string[];
  status: "balanced" | "overreach" | "neglect";
  feedback: string;
}

interface PressureScenario {
  title: string;
  context: string;
  options: Record<string, PressureOption>;
}

const SCENARIO_KEYS = ["marriage", "muhurta", "gossip"] as const;

const SCENARIOS: Record<string, PressureScenario> = {
  marriage: {
    title: "Marriage Anxiety",
    context: "A client, visibly anxious, says: \"Just tell me — is my marriage going to fail? Please, I need you to tell me yes or no.\" The chart shows genuine stress indications on the 7th house, nothing deterministic.",
    options: {
      overreach: {
        label: "Fear Confirmation",
        text: "Confirm the doom: \"Yes, your marriage will fail — the 7th lord is weak and Saturn aspects it. Prepare yourself.\" Deliver the certainty they crave.",
        commitments: [],
        status: "overreach",
        feedback: "Violates Ahiṁsā (fear-induction for dramatic effect) and Honest Handling (presenting a tendency as a deterministic verdict). The chart shows stress, not a sentence.",
      },
      neglect: {
        label: "False Soothing",
        text: "Tell them \"Everything is fine, don't worry at all\" — lie to spare their feelings, ignoring the genuine stress indications in the chart.",
        commitments: [],
        status: "neglect",
        feedback: "Violates Truth with Compassion. Softening the truth into a lie is not compassion — it is dishonesty. The stress indications are real and deserve honest naming.",
      },
      balanced: {
        label: "Pledge-Aligned Response",
        text: "Name what is actually there — real stress indications — and what is not — any verdict of failure. \"The chart shows a demanding period for partnership, not a sentence. This is a period to attend to the relationship, not abandon it on a prediction.\"",
        commitments: ["Ahiṁsā", "Truth with compassion", "Honest handling", "Empowerment"],
        status: "balanced",
        feedback: "Four commitments upheld: Ahiṁsā (no fear-induction), Truth with compassion (honest but kind), Honest handling (stress indications, not a sentence), and Empowerment (the client can act on this).",
      },
    },
  },
  muhurta: {
    title: "Stream Competence",
    context: "A client asks for a precise auspicious second to sign a partnership contract, but you are only trained in Parāśarī horoscopy — not in electional Muhūrta calculation.",
    options: {
      overreach: {
        label: "Fabricate Expertise",
        text: "Calculate an auspicious time from basic natal chart transits and present it as a precise Muhūrta selection, pretending mastery of electional techniques.",
        commitments: [],
        status: "overreach",
        feedback: "Violates Boundaries (fabricating competence in Muhūrta) and Honest Handling (presenting survey-level knowledge as mastery). Internal adhikāra overreach.",
      },
      neglect: {
        label: "Dismiss the Domain",
        text: "Tell the client that auspicious timing is superstitious and they should just sign whenever they feel like it.",
        commitments: [],
        status: "neglect",
        feedback: "Violates Service Orientation and Boundaries (dismissing a legitimate domain rather than acknowledging your limitation and referring). Muhūrta is a real discipline within the tradition.",
      },
      balanced: {
        label: "Pledge-Aligned Response",
        text: "Provide a general monthly window from Parāśarī transit rules, honestly state your training limitations, and refer them to a specialised Muhūrta practitioner for the precise timing.",
        commitments: ["Boundaries", "Honest handling", "Service orientation"],
        status: "balanced",
        feedback: "Three commitments upheld: Boundaries (admitting the limit), Honest handling (stating the limitation plainly), and Service orientation (referring to a specialist even though it costs the consultation).",
      },
    },
  },
  gossip: {
    title: "Confidentiality Under Pressure",
    context: "At a social gathering, a mutual friend casually asks: \"You read so-and-so's chart recently — what did you find? Anything interesting about their health?\" The client had shared sensitive personal details during the consultation.",
    options: {
      overreach: {
        label: "Share Details",
        text: "Share a few \"interesting\" findings, rationalising that you're not giving away everything — just the highlights that make for good conversation.",
        commitments: [],
        status: "overreach",
        feedback: "Violates Confidentiality. The client's chart data and personal disclosures are sacred trust. Partial disclosure is still disclosure. The client's story is not social currency.",
      },
      neglect: {
        label: "Deny the Reading",
        text: "Lie and say you never read that person's chart at all, to avoid the whole conversation.",
        commitments: [],
        status: "neglect",
        feedback: "Violates Truth with Compassion. You need not lie — you can simply state that consultations are private without denying the reading happened.",
      },
      balanced: {
        label: "Pledge-Aligned Response",
        text: "Smile and say: \"I keep all consultations private — I'm sure you'd want the same if I read yours.\" Redirect the conversation without lying or disclosing.",
        commitments: ["Confidentiality", "Truth with compassion", "Service orientation"],
        status: "balanced",
        feedback: "Three commitments upheld: Confidentiality (guarded the data), Truth with compassion (honest without lying), and Service orientation (the client's trust above social ease).",
      },
    },
  },
};

type TabId = "commitments" | "pressure" | "compose";

export function PractitionerPledgeSimulator() {
  const [activeTab, setActiveTab] = useState<TabId>("commitments");
  const [expandedCommitment, setExpandedCommitment] = useState<number | null>(null);

  /* Pressure tab state */
  const [activeScenario, setActiveScenario] = useState<string>("marriage");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());

  /* Compose tab state */
  const [pledgeText, setPledgeText] = useState<string>("");

  const scenario = SCENARIOS[activeScenario];
  const chosenOption = selectedAction ? scenario.options[selectedAction] : null;

  /* Count upheld commitments across current scenario */
  const upheldSet = new Set(chosenOption?.commitments || []);

  /* Track scenario completions */
  const handleActionSelect = (key: string) => {
    setSelectedAction(key);
    setCompletedScenarios((prev) => {
      const next = new Set(prev);
      next.add(activeScenario);
      return next;
    });
  };

  /* All scenarios completed */
  const allScenariosComplete = completedScenarios.size === SCENARIO_KEYS.length;

  /* Build seal data for the SVG */
  const sealCommitments = useMemo(() => {
    return EIGHT_COMMITMENTS.map((c) => ({
      ...c,
      upheld: upheldSet.has(c.name),
    }));
  }, [upheldSet]);

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
            Module 24 • Chapter 5 • Lesson 2
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          The Practitioner&apos;s Pledge: Eight Commitments Under Pressure
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Explore the eight commitments, test them under real consultation pressure, and compose your own pledge in first person.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        {([
          { id: "commitments" as TabId, label: "Eight Commitments" },
          { id: "pressure" as TabId, label: "Pressure Simulator" },
          { id: "compose" as TabId, label: "Compose Your Pledge" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="pb-2 px-2 text-xs font-bold transition-all relative"
            style={{ color: activeTab === tab.id ? GOLD : INK_SECONDARY, background: "transparent", border: "none", cursor: "pointer" }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: GOLD }}
                layoutId="pledgeTabLine"
              />
            )}
          </button>
        ))}
      </div>

      {/* ═══ TAB 1: Eight Commitments with Seal SVG ═══ */}
      {activeTab === "commitments" && (
        <div>
          <p className="m-0 mb-4 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
            The pledge has eight points. Each is stated simply, tied to the discipline it summarises, and paired with the pressure that tests it. Click any commitment to expand its details.
          </p>

          {/* Eight-Spoke Seal SVG */}
          <div className="flex justify-center mb-5">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Central ring */}
              <circle cx="100" cy="100" r="70" fill="none" stroke={`${GOLD}30`} strokeWidth="1.5" />
              <circle cx="100" cy="100" r="30" fill={`${GOLD}08`} stroke={`${GOLD}22`} strokeWidth="1" />
              <text x="100" y="97" textAnchor="middle" fill={GOLD} fontSize="7" fontWeight="700">PLEDGE</text>
              <text x="100" y="107" textAnchor="middle" fill={INK_MUTED} fontSize="6">8 Points</text>

              {/* Eight spokes + commitment nodes */}
              {EIGHT_COMMITMENTS.map((c, i) => {
                const angle = (i * 45 - 90) * (Math.PI / 180);
                const innerR = 30;
                const outerR = 70;
                const nodeR = 82;
                const x1 = 100 + Math.cos(angle) * innerR;
                const y1 = 100 + Math.sin(angle) * innerR;
                const x2 = 100 + Math.cos(angle) * outerR;
                const y2 = 100 + Math.sin(angle) * outerR;
                const nx = 100 + Math.cos(angle) * nodeR;
                const ny = 100 + Math.sin(angle) * nodeR;
                const isExpanded = expandedCommitment === c.num;

                return (
                  <g key={c.num} className="cursor-pointer" onClick={() => setExpandedCommitment(isExpanded ? null : c.num)}>
                    {/* Spoke line */}
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isExpanded ? GOLD : `${GOLD}25`} strokeWidth={isExpanded ? 1.5 : 1} />
                    {/* Node circle */}
                    <circle cx={nx} cy={ny} r={isExpanded ? 14 : 11} fill={isExpanded ? `${GOLD}20` : "rgba(255,249,240,0.9)"} stroke={isExpanded ? GOLD : `${GOLD}33`} strokeWidth={isExpanded ? 2 : 1} />
                    {/* Node number */}
                    <text x={nx} y={ny + 3} textAnchor="middle" fill={isExpanded ? GOLD : INK_MUTED} fontSize="8" fontWeight="700">
                      {c.num}
                    </text>
                    {/* Active pulse */}
                    {isExpanded && (
                      <circle cx={nx} cy={ny} r="14" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.4">
                        <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Commitment cards grid */}
          <div className="grid gap-2 md:grid-cols-2">
            {EIGHT_COMMITMENTS.map((c) => {
              const isExpanded = expandedCommitment === c.num;
              return (
                <button
                  key={c.num}
                  onClick={() => setExpandedCommitment(isExpanded ? null : c.num)}
                  className="w-full text-left p-3.5 rounded-xl border transition-all"
                  style={{
                    background: isExpanded ? SURFACE_2 : SURFACE,
                    borderColor: isExpanded ? `${GOLD}44` : HAIRLINE,
                    cursor: "pointer",
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <span
                      className="flex-shrink-0 flex items-center justify-center rounded-full"
                      style={{ width: 26, height: 26, background: `${GOLD}15`, color: GOLD }}
                    >
                      {c.icon}
                    </span>
                    <div className="flex-1">
                      <span className="text-xs font-bold block" style={{ color: INK_PRIMARY }}>
                        {c.num}. {c.name}
                      </span>
                      <span className="text-[10px]" style={{ color: INK_SECONDARY }}>{c.meaning}</span>
                    </div>
                    <ChevronRight size={12} color={GOLD} style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 pt-2 border-t flex flex-col gap-1.5" style={{ borderColor: HAIRLINE }}
                      >
                        <p className="m-0 text-[10px] leading-relaxed">
                          <strong style={{ color: GOLD }}>Discipline behind it:</strong>{" "}
                          <span style={{ color: INK_SECONDARY }}>{c.discipline}</span>
                        </p>
                        <p className="m-0 text-[10px] leading-relaxed">
                          <strong style={{ color: VERMILION }}>Tested when:</strong>{" "}
                          <span style={{ color: INK_SECONDARY }}>{c.tested}</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TAB 2: Pressure Simulator ═══ */}
      {activeTab === "pressure" && (
        <div>
          {/* Scenario progress tracker */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: INK_MUTED }}>Scenarios:</span>
            <div className="flex gap-2">
              {SCENARIO_KEYS.map((key) => {
                const isActive = activeScenario === key;
                const isComplete = completedScenarios.has(key);
                return (
                  <button
                    key={key}
                    onClick={() => { setActiveScenario(key); setSelectedAction(null); }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all"
                    style={{
                      background: isActive ? `${GOLD}15` : isComplete ? `${GREEN}10` : SURFACE_2,
                      border: `1px solid ${isActive ? GOLD : isComplete ? `${GREEN}33` : HAIRLINE}`,
                      color: isActive ? GOLD : isComplete ? GREEN : INK_MUTED,
                      cursor: "pointer",
                    }}
                  >
                    {isComplete && <CheckCircle2 size={10} />}
                    {SCENARIOS[key].title}
                  </button>
                );
              })}
            </div>
            {allScenariosComplete && (
              <span className="text-[10px] font-bold" style={{ color: GREEN }}>All complete ✓</span>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
            {/* Left: Context & Options */}
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>Case Scenario</span>
                <p className="m-0 text-xs leading-relaxed font-semibold" style={{ color: INK_PRIMARY }}>{scenario.context}</p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>Choose Your Response</span>
                {Object.entries(scenario.options).map(([key, opt]) => (
                  <button
                    key={key}
                    onClick={() => handleActionSelect(key)}
                    className="w-full p-3 rounded-lg border text-left transition-all text-xs flex flex-col gap-1 hover:bg-white/50"
                    style={{
                      background: selectedAction === key ? SURFACE_2 : SURFACE,
                      borderColor: selectedAction === key ? (opt.status === "balanced" ? `${GREEN}44` : opt.status === "overreach" ? `${VERMILION}44` : `${GOLD}44`) : HAIRLINE,
                      cursor: "pointer",
                    }}
                  >
                    <span className="font-bold" style={{ color: selectedAction === key ? INK_PRIMARY : INK_SECONDARY }}>{opt.label}</span>
                    <span className="text-[10px] leading-normal" style={{ color: INK_SECONDARY }}>{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Pledge Seal & Feedback */}
            <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-3" style={{ color: GOLD }}>
                  Pledge Integrity
                </span>

                {/* Commitments grid — larger for readability */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {sealCommitments.map((c) => (
                    <div
                      key={c.num}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-all"
                      style={{
                        background: c.upheld ? `${GREEN}10` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${c.upheld ? `${GREEN}33` : HAIRLINE}`,
                      }}
                    >
                      <span style={{ color: c.upheld ? GREEN : INK_MUTED }}>{c.icon}</span>
                      <span className="text-[8px] font-bold leading-tight" style={{ color: c.upheld ? GREEN : INK_MUTED }}>{c.name}</span>
                    </div>
                  ))}
                </div>

                {/* Integrity bar */}
                {chosenOption && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span>Commitments upheld:</span>
                      <span style={{ color: chosenOption.status === "balanced" ? GREEN : VERMILION }}>
                        {chosenOption.commitments.length} / 8
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                      <motion.div
                        className="h-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(chosenOption.commitments.length / 8) * 100}%` }}
                        transition={{ duration: 0.4 }}
                        style={{ background: chosenOption.status === "balanced" ? GREEN : VERMILION }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback */}
              <div className="mt-5">
                <AnimatePresence mode="wait">
                  {chosenOption ? (
                    <motion.div
                      key={`${activeScenario}-${selectedAction}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="p-3 rounded-lg flex items-start gap-2 text-[11px] leading-normal border"
                      style={{
                        background: SURFACE_2,
                        borderColor: chosenOption.status === "balanced" ? `${GREEN}33` : chosenOption.status === "overreach" ? `${VERMILION}33` : `${GOLD}33`,
                      }}
                    >
                      {chosenOption.status === "balanced"
                        ? <ShieldCheck size={16} color={GREEN} className="flex-shrink-0 mt-0.5" />
                        : <AlertTriangle size={16} color={chosenOption.status === "overreach" ? VERMILION : GOLD} className="flex-shrink-0 mt-0.5" />
                      }
                      <div>
                        <span className="font-bold block" style={{
                          color: chosenOption.status === "balanced" ? GREEN : chosenOption.status === "overreach" ? VERMILION : GOLD,
                        }}>
                          {chosenOption.status === "balanced" ? "Pledge Upheld" : chosenOption.status === "overreach" ? "Pledge Violated" : "Pledge Undermined"}
                        </span>
                        <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{chosenOption.feedback}</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty-pressure"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 rounded-lg text-[11px] leading-normal border"
                      style={{ background: SURFACE_2, borderColor: HAIRLINE }}
                    >
                      <p className="m-0" style={{ color: INK_MUTED }}>
                        Choose a response to see which commitments are upheld or violated under this pressure scenario.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: Compose Your Pledge ═══ */}
      {activeTab === "compose" && (
        <div>
          <p className="m-0 mb-3 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
            Write the eight commitments in your own words, in the first person, specific to the practice you intend to have. A pledge in your own words is one you will actually keep. <em>Don&apos;t copy the table — translate it.</em>
          </p>

          {/* Worked fragment */}
          <div className="p-4 rounded-xl border mb-5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: GOLD }}>
              Worked fragment — one practitioner&apos;s version
            </span>
            <blockquote className="m-0 pl-3 border-l-2 text-xs italic leading-relaxed" style={{ borderColor: GOLD, color: INK_SECONDARY }}>
              I will never use fear to make a reading land harder. I will tell the truth as I see it, and I will tell it in a way the person can carry. When a question is outside what I can competently answer, I will say so and point them to someone who can, even when it costs me the consultation.
            </blockquote>
          </div>

          {/* User's pledge composition area */}
          <div className="p-4 rounded-xl border mb-5" style={{ background: SURFACE, borderColor: `${GOLD}22` }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: GOLD }}>
              Your Pledge — Write in First Person
            </span>
            <textarea
              value={pledgeText}
              onChange={(e) => setPledgeText(e.target.value)}
              placeholder={"I will...\n\n(Write all eight commitments in your own voice. Keep this where you will reread it before a hard consultation.)"}
              className="w-full rounded-lg p-3 text-xs leading-relaxed resize-y min-h-[120px]"
              style={{
                background: SURFACE_2,
                border: `1px solid ${HAIRLINE}`,
                color: INK_PRIMARY,
                fontFamily: "var(--font-cormorant), serif",
                outline: "none",
                minHeight: 120,
              }}
              rows={6}
            />
            {pledgeText.length > 0 && (
              <p className="m-0 mt-2 text-[10px]" style={{ color: INK_MUTED }}>
                {pledgeText.split(/\s+/).filter(Boolean).length} words written • Remember: revise it as your practice matures.
              </p>
            )}
          </div>

          {/* Reminder cards */}
          <div className="grid gap-2 md:grid-cols-2">
            <div className="p-3 rounded-lg border text-[11px] leading-relaxed" style={{ background: SURFACE, borderColor: HAIRLINE }}>
              <strong style={{ color: GREEN }}>Why first person:</strong>
              <p className="m-0 mt-1" style={{ color: INK_SECONDARY }}>
                Ethics learned as information evaporates under pressure. &ldquo;I will&rdquo; survives where &ldquo;a practitioner should&rdquo; does not.
              </p>
            </div>
            <div className="p-3 rounded-lg border text-[11px] leading-relaxed" style={{ background: SURFACE, borderColor: HAIRLINE }}>
              <strong style={{ color: GOLD }}>Not an addition — a summary:</strong>
              <p className="m-0 mt-1" style={{ color: INK_SECONDARY }}>
                Every point traces back to a discipline you already learned. The pledge invents nothing — it gathers. Revise it as your practice matures.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Śloka — with fade-in */}
      <motion.div
        className="mt-6 border-t pt-4 text-center"
        style={{ borderColor: HAIRLINE }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Composite Paraphrase — Truth with Compassion
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          सत्यं ब्रूयात् प्रियं ब्रूयात् न ब्रूयात् सत्यम् अप्रियम्। हितं च एव परं ब्रूयाद् एष धर्मः सनातनः॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          satyaṁ brūyāt priyaṁ brūyāt, na brūyāt satyam apriyam | hitaṁ ca eva paraṁ brūyād, eṣa dharmaḥ sanātanaḥ.
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;Speak the truth, speak it kindly; do not speak a truth that only wounds; speak above all what genuinely helps — this is the lasting dharma.&rdquo;
        </p>
      </motion.div>
    </div>
  );
}
