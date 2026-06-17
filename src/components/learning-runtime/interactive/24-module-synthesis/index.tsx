"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ArrowDown, CircleDot, ShieldCheck, AlertTriangle, BookOpen, Link2, RotateCcw } from "lucide-react";
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

/* ─── §4.1 Five Layers ─── */
interface LayerData {
  id: string;
  label: string;
  modules: string;
  establishes: string;
  color: string;
  moduleRange: string;
}

const FIVE_LAYERS: LayerData[] = [
  { id: "foundations",  label: "Foundations",                modules: "M01–M03", establishes: "What Jyotiṣa is and isn't; the cosmology and history; the mathematics of time and the pañcāṅga",                                        color: "#7A5E1E", moduleRange: "1-3" },
  { id: "core",         label: "Core Elements",              modules: "M04–M09", establishes: "The building blocks: rāśis, grahas, bhāvas, nakṣatras, aspects, and the divisional charts",                                                color: "#A8821E", moduleRange: "4-9" },
  { id: "predictive",   label: "Predictive Methods",         modules: "M10–M14", establishes: "The machinery of timing and assessment: daśās, transits, aṣṭakavarga, ṣaḍbala, and yogas",                                                color: "#2E7D32", moduleRange: "10-14" },
  { id: "streams",      label: "Stream & Awareness Surveys", modules: "M15–M20", establishes: "The plurality of the tradition: remedies, and the KP, Jaimini, Lal Kitab, and Tājika streams, plus Nāḍī awareness",                      color: "#4F6FA8", moduleRange: "15-20" },
  { id: "ancillary",    label: "Ancillary Disciplines",      modules: "M21–M24", establishes: "The adjacent and governing disciplines: numerology, vāstu, muhūrta, and the ethics-history-discipline that holds it all",                  color: "#8B5A2B", moduleRange: "21-24" },
];

/* ─── §4.2 Convergence Tracer — career question ─── */
interface TraceStep {
  id: string;
  module: string;
  label: string;
  detail: string;
  required: boolean;
  dependsOn: string[];
}

const CAREER_TRACE: TraceStep[] = [
  { id: "houses",   module: "M06", label: "10th & 6th Houses and their lords",           detail: "Identify the houses for work and service, and identify their ruling grahas.",                                 required: true, dependsOn: [] },
  { id: "grahas",   module: "M05", label: "Grahas and natural significations",            detail: "Which grahas occupy or rule those houses? What are their natural kārakattvas?",                             required: true, dependsOn: [] },
  { id: "strength", module: "M13", label: "Graha strength (Ṣaḍbala)",                    detail: "A strong promise reads differently from a weak one. Weigh their quantitative and qualitative strength.",    required: true, dependsOn: ["houses", "grahas"] },
  { id: "dasha",    module: "M10", label: "Running Daśā and Antardaśā",                  detail: "Are the career-relevant grahas active NOW in the current daśā period?",                                   required: true, dependsOn: ["houses", "grahas"] },
  { id: "transit",  module: "M11", label: "Current Transits (Gochara)",                  detail: "Overlay current transits of major grahas against the natal promise.",                                      required: true, dependsOn: ["houses", "grahas"] },
  { id: "yoga",     module: "M14", label: "Yogas that raise or lower the baseline",      detail: "Any Rāja Yoga, Dhana Yoga, or obstructive combinations that shift the reading?",                           required: true, dependsOn: [] },
  { id: "ethics",   module: "M24", label: "Honest-handling discipline",                  detail: "This is one input among many to a decision the client owns. Frame it honestly.",                           required: true, dependsOn: [] },
];

const HEALTH_TRACE: TraceStep[] = [
  { id: "houses",   module: "M06", label: "1st (vitality), 6th (illness), 8th (chronic)", detail: "Identify the houses for health and their ruling grahas.",                                                  required: true, dependsOn: [] },
  { id: "grahas",   module: "M05", label: "Grahas ruling those houses",                   detail: "Natural significations of grahas on or ruling the 1st, 6th, and 8th houses.",                             required: true, dependsOn: [] },
  { id: "strength", module: "M13", label: "Strength check",                               detail: "A weak malefic on the 6th reads differently from a strong one.",                                          required: true, dependsOn: ["houses", "grahas"] },
  { id: "dasha",    module: "M10", label: "Daśā: are health grahas active?",              detail: "Are the health-relevant grahas active in the period in question?",                                        required: true, dependsOn: ["houses", "grahas"] },
  { id: "transit",  module: "M11", label: "Saturn and nodal transits",                    detail: "Overlay transits, especially of Saturn and the nodes, against those points.",                              required: true, dependsOn: ["houses", "grahas"] },
  { id: "yoga",     module: "M14", label: "Ariṣṭa or protective Yogas",                  detail: "Note any health-harming or protective yogas that shift the baseline.",                                     required: true, dependsOn: [] },
  { id: "ethics",   module: "M24", label: "Not a medical prognosis",                      detail: "This is a chart-context reading; it informs care and attention, it does not replace a physician.",         required: true, dependsOn: [] },
];

/* ─── §4.3 Three Disciplines ─── */
interface Discipline {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const THREE_DISCIPLINES: Discipline[] = [
  { title: "Honest Handling",                icon: <ShieldCheck size={14} />, description: "From M01's framing of what Jyotiṣa can claim, through each stream's claim-discipline, to M24's synthesis — every module distinguishes what is practised, what is claimed, and what is verified, and refuses both mystification and dismissal." },
  { title: "Refusal of Single-Cause Thinking", icon: <Link2 size={14} />,      description: "A life outcome is never pinned on one graha, one daśā, one yoga, or one number. Lives are multi-causal; a chart describes tendencies and contexts, not switches." },
  { title: "Respect for Client Autonomy",    icon: <CircleDot size={14} />,  description: "The reading informs a decision; it never makes it. The empowerment principle of M24 is the ethical form of the same humility the technical modules teach." },
];

type TabId = "architecture" | "convergence" | "disciplines";

export function Module24SynthesisDojo() {
  const [activeTab, setActiveTab] = useState<TabId>("architecture");
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [hoveredDiscipline, setHoveredDiscipline] = useState<number | null>(null);

  /* convergence tab state */
  const [queryType, setQueryType] = useState<"career" | "health">("career");
  const [activated, setActivated] = useState<Set<string>>(new Set());
  const [sequenceWarning, setSequenceWarning] = useState<string | null>(null);

  const traceSteps = queryType === "career" ? CAREER_TRACE : HEALTH_TRACE;
  const convergenceScore = Math.round((activated.size / traceSteps.length) * 100);
  const allActivated = activated.size === traceSteps.length;

  /* Sequence-order validation: warn if trying to activate timing/strength before core */
  function toggleStep(id: string) {
    const step = traceSteps.find((s) => s.id === id);
    if (!step) return;

    if (activated.has(id)) {
      setActivated((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setSequenceWarning(null);
      return;
    }

    /* Check dependencies */
    const missingDeps = step.dependsOn.filter((dep) => !activated.has(dep));
    if (missingDeps.length > 0) {
      const depLabels = missingDeps.map((d) => {
        const depStep = traceSteps.find((s) => s.id === d);
        return depStep ? `${depStep.module} (${depStep.label})` : d;
      });
      setSequenceWarning(
        `You cannot weigh ${step.label} before establishing: ${depLabels.join(", ")}. Each layer depends on the ones beneath it.`
      );
      /* Still allow activation — warn but don't block */
    } else {
      setSequenceWarning(null);
    }

    setActivated((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function resetConvergence() {
    setActivated(new Set());
    setSequenceWarning(null);
  }

  /* Activated count for integration flow visualization */
  const activatedStepIndices = useMemo(() => {
    return traceSteps.map((s, i) => ({ ...s, idx: i, active: activated.has(s.id) }));
  }, [traceSteps, activated]);

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
          <Layers size={16} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Module 24 • Chapter 5 • Lesson 1
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Tier 1 Synthesis: How Twenty-Four Modules Form One Practice
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Explore the five-layer architecture, trace a real question through converging modules, and identify the three disciplines that hold Tier 1 together.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        {([
          { id: "architecture" as TabId, label: "Five-Layer Architecture", icon: <Layers size={12} /> },
          { id: "convergence" as TabId, label: "Convergence Tracer", icon: <ArrowDown size={12} /> },
          { id: "disciplines" as TabId, label: "Three Disciplines", icon: <ShieldCheck size={12} /> },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="pb-2 px-2 text-xs font-bold transition-all relative flex items-center gap-1.5"
            style={{ color: activeTab === tab.id ? GOLD : INK_SECONDARY, background: "transparent", border: "none", cursor: "pointer" }}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: GOLD }}
                layoutId="synthTabUnderline"
              />
            )}
          </button>
        ))}
      </div>

      {/* ═══ TAB 1: Five-Layer Architecture ═══ */}
      {activeTab === "architecture" && (
        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          {/* SVG Stack Diagram — enhanced with glow, animated arrows, module badges */}
          <div className="flex justify-center rounded-xl p-4 border bg-white" style={{ borderColor: HAIRLINE }}>
            <svg width="240" height="290" viewBox="0 0 240 290">
              <defs>
                <marker id="arrowDown" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="rgba(168,130,30,0.5)" />
                </marker>
                {FIVE_LAYERS.map((layer) => (
                  <filter key={`glow-${layer.id}`} id={`glow-${layer.id}`}>
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                ))}
              </defs>

              {FIVE_LAYERS.map((layer, i) => {
                const isExpanded = expandedLayer === layer.id;
                const yPos = 12 + i * 54;
                return (
                  <g key={layer.id} className="cursor-pointer" onClick={() => setExpandedLayer(isExpanded ? null : layer.id)}>
                    {/* Dependency arrow with animation */}
                    {i > 0 && (
                      <line
                        x1="120" y1={yPos - 16} x2="120" y2={yPos}
                        stroke="rgba(168,130,30,0.35)" strokeWidth="1.5"
                        strokeDasharray="4,3" markerEnd="url(#arrowDown)"
                      >
                        <animate attributeName="stroke-dashoffset" from="14" to="0" dur="2s" repeatCount="indefinite" />
                      </line>
                    )}
                    {/* Layer block with glow on active */}
                    <rect
                      x="12" y={yPos}
                      width="216" height="42"
                      rx="10"
                      fill={isExpanded ? `${layer.color}18` : "rgba(255,249,240,0.85)"}
                      stroke={isExpanded ? layer.color : "rgba(168,130,30,0.2)"}
                      strokeWidth={isExpanded ? 2.5 : 1}
                      filter={isExpanded ? `url(#glow-${layer.id})` : undefined}
                    />
                    {/* Module badge */}
                    <rect
                      x="18" y={yPos + 6}
                      width="40" height="14"
                      rx="4"
                      fill={`${layer.color}20`}
                    />
                    <text x="38" y={yPos + 16} fill={layer.color} fontSize="8" fontWeight="700" textAnchor="middle">
                      {layer.modules}
                    </text>
                    {/* Layer name */}
                    <text x="66" y={yPos + 17} fill={INK_PRIMARY} fontSize="10" fontWeight="600" textAnchor="start" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                      {layer.label}
                    </text>
                    {/* Active indicator dot */}
                    {isExpanded && (
                      <circle cx="218" cy={yPos + 21} r="4" fill={layer.color}>
                        <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Bottom dependency note */}
              <text x="120" y="284" fill={INK_MUTED} fontSize="7" textAnchor="middle" fontStyle="italic">
                Each layer is the vocabulary the next layer speaks in
              </text>
            </svg>
          </div>

          {/* Detail Panel */}
          <div className="flex flex-col gap-3">
            <p className="m-0 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
              <strong>Click a layer</strong> in the diagram to see what it establishes. Each layer depends on the ones beneath it — the order matters.
            </p>

            <AnimatePresence mode="wait">
              {expandedLayer ? (
                (() => {
                  const layer = FIVE_LAYERS.find((l) => l.id === expandedLayer)!;
                  return (
                    <motion.div
                      key={layer.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="p-4 rounded-xl border"
                      style={{ background: SURFACE_2, borderColor: `${layer.color}33` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider" style={{ background: `${layer.color}18`, color: layer.color }}>
                          {layer.modules}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                          {layer.label}
                        </span>
                      </div>
                      <p className="m-0 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                        {layer.establishes}
                      </p>
                    </motion.div>
                  );
                })()
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-xl border flex items-center gap-3"
                  style={{ background: SURFACE_2, borderColor: HAIRLINE }}
                >
                  <BookOpen size={16} color={GOLD} className="flex-shrink-0" />
                  <p className="m-0 text-xs leading-relaxed" style={{ color: INK_MUTED }}>
                    Click any layer block in the diagram to reveal what it establishes and how it depends on the layers beneath it.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dependency reminder */}
            <div className="p-3 rounded-lg border text-[11px] leading-relaxed" style={{ background: SURFACE, borderColor: HAIRLINE, color: INK_SECONDARY }}>
              <strong style={{ color: INK_PRIMARY }}>Why order matters:</strong> You cannot weigh a graha's strength (M13) before you know the grahas (M05); you cannot run a daśā (M10) before you know the nakṣatras (M07); you cannot survey KP's cuspal sub-lords (M16) before you understand house cusps (M06).
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 2: Convergence Tracer ═══ */}
      {activeTab === "convergence" && (
        <div>
          {/* Query Selector */}
          <div className="flex flex-wrap gap-1 p-1 rounded-xl mb-5" style={{ background: SURFACE_2 }}>
            {([
              { id: "career" as const, label: "\"Is this a good period to change careers?\"" },
              { id: "health" as const, label: "\"What does the year ahead hold for my health?\"" },
            ]).map((q) => (
              <button
                key={q.id}
                onClick={() => { setQueryType(q.id); resetConvergence(); }}
                className="flex-1 min-w-[180px] py-2 px-3 rounded-lg border text-center transition-all text-xs font-bold"
                style={{
                  background: queryType === q.id ? SURFACE : "transparent",
                  borderColor: queryType === q.id ? GOLD : "transparent",
                  color: queryType === q.id ? INK_PRIMARY : INK_SECONDARY,
                  fontFamily: "var(--font-cormorant), serif",
                  cursor: "pointer",
                }}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Sequence-order warning */}
          <AnimatePresence>
            {sequenceWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg flex items-start gap-2 text-[11px] leading-normal border"
                style={{ background: "#FFF3E0", borderColor: `${GOLD}44` }}
              >
                <AlertTriangle size={14} color={GOLD} className="flex-shrink-0 mt-0.5" />
                <p className="m-0" style={{ color: INK_SECONDARY }}>{sequenceWarning}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-6 md:grid-cols-[1.3fr_0.9fr]">
            {/* Steps checklist with integration flow lines */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                  Activate each module in your reading
                </span>
                <button onClick={resetConvergence} className="text-[10px] font-bold flex items-center gap-1" style={{ color: "#4F6FA8", background: "transparent", border: "none", cursor: "pointer" }}>
                  <RotateCcw size={10} /> Reset
                </button>
              </div>
              {activatedStepIndices.map((step, i) => {
                const isActive = step.active;
                const nextActive = i < activatedStepIndices.length - 1 && activatedStepIndices[i + 1].active;
                return (
                  <div key={step.id} className="relative">
                    <button
                      onClick={() => toggleStep(step.id)}
                      className="w-full p-3 rounded-lg border text-left transition-all text-xs flex items-start gap-3 hover:bg-white/50"
                      style={{
                        background: isActive ? `${GREEN}08` : SURFACE,
                        borderColor: isActive ? `${GREEN}44` : HAIRLINE,
                        cursor: "pointer",
                      }}
                    >
                      <span
                        className="flex-shrink-0 mt-0.5 flex items-center justify-center rounded-full text-[9px] font-bold"
                        style={{
                          width: 22, height: 22,
                          background: isActive ? GREEN : SURFACE_2,
                          color: isActive ? "#fff" : INK_MUTED,
                          transition: "all 0.3s ease",
                        }}
                      >
                        {isActive ? "✓" : i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase" style={{ background: `${GOLD}15`, color: GOLD }}>{step.module}</span>
                          <span className="font-bold" style={{ color: isActive ? INK_PRIMARY : INK_SECONDARY }}>{step.label}</span>
                        </div>
                        <span className="text-[10px] leading-normal" style={{ color: INK_MUTED }}>{step.detail}</span>
                      </div>
                    </button>
                    {/* Integration flow connector between activated steps */}
                    {isActive && nextActive && i < activatedStepIndices.length - 1 && (
                      <div
                        className="absolute left-[21px] -bottom-[6px] w-[2px] h-[10px] z-10"
                        style={{ background: `${GREEN}66` }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Convergence Meter */}
            <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-3" style={{ color: GOLD }}>
                  Convergence Confidence
                </span>

                {/* Circular gauge */}
                <div className="flex justify-center mb-4">
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    {/* Track */}
                    <circle cx="75" cy="75" r="58" fill="none" stroke="rgba(168,130,30,0.10)" strokeWidth="9" />
                    {/* Progress arc */}
                    <motion.circle
                      cx="75" cy="75" r="58"
                      fill="none"
                      stroke={allActivated ? GREEN : GOLD}
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 58}
                      initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - convergenceScore / 100) }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      transform="rotate(-90 75 75)"
                    />
                    {/* Full-convergence glow */}
                    {allActivated && (
                      <circle cx="75" cy="75" r="58" fill="none" stroke={GREEN} strokeWidth="2" opacity="0.3">
                        <animate attributeName="r" values="58;64;58" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <text x="75" y="68" textAnchor="middle" fill={allActivated ? GREEN : GOLD} fontSize="30" fontWeight="700">
                      {convergenceScore}
                    </text>
                    <text x="75" y="84" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="600">
                      percent
                    </text>
                  </svg>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>Modules activated:</span>
                    <span style={{ color: allActivated ? GREEN : GOLD }}>{activated.size} / {traceSteps.length}</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                    <motion.div
                      className="h-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${convergenceScore}%` }}
                      transition={{ duration: 0.4 }}
                      style={{ background: allActivated ? GREEN : GOLD }}
                    />
                  </div>
                </div>
              </div>

              {/* Verdict */}
              <div className="mt-5">
                {allActivated ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-lg flex items-start gap-2 text-[11px] leading-normal border"
                    style={{ background: SURFACE_2, borderColor: `${GREEN}33` }}
                  >
                    <ShieldCheck size={16} color={GREEN} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block" style={{ color: GREEN }}>Full Convergence</span>
                      <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>
                        Seven modules touched for one question, in a natural sequence, with the ethical frame bracketing all of it. That sequence — not any single module — is what you built across Tier 1.
                      </p>
                    </div>
                  </motion.div>
                ) : convergenceScore > 0 ? (
                  <div className="p-3 rounded-lg flex items-start gap-2 text-[11px] leading-normal border" style={{ background: SURFACE_2, borderColor: `${GOLD}33` }}>
                    <AlertTriangle size={16} color={GOLD} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block" style={{ color: GOLD }}>Partial — keep weaving</span>
                      <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>
                        {!activated.has("ethics")
                          ? "The ethical frame is missing. A reading without honest handling is not Tier-1-complete."
                          : "Activate all modules to see how a real reading integrates them. No single module answers the question alone."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg text-[11px] leading-normal border" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
                    <p className="m-0" style={{ color: INK_MUTED }}>
                      Activate the modules you would use for this question. Watch the convergence build as independent lines of evidence come together.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: Three Disciplines ═══ */}
      {activeTab === "disciplines" && (
        <div>
          <p className="m-0 mb-4 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
            Three commitments recur in every module and are what make the tier coherent rather than merely comprehensive. A practitioner who has the techniques but not these disciplines has not actually completed Tier 1.
          </p>
          <div className="flex flex-col gap-3">
            {THREE_DISCIPLINES.map((d, i) => {
              const isHovered = hoveredDiscipline === i;
              return (
                <motion.div
                  key={i}
                  onMouseEnter={() => setHoveredDiscipline(i)}
                  onMouseLeave={() => setHoveredDiscipline(null)}
                  animate={{ scale: isHovered ? 1.01 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-xl border flex items-start gap-3"
                  style={{
                    background: isHovered ? `${GOLD}08` : SURFACE_2,
                    borderColor: isHovered ? `${GOLD}33` : HAIRLINE,
                    transition: "background 0.3s, border-color 0.3s",
                  }}
                >
                  <span className="flex-shrink-0 mt-0.5 flex items-center justify-center rounded-full" style={{ width: 30, height: 30, background: `${GOLD}15`, color: GOLD }}>
                    {d.icon}
                  </span>
                  <div className="flex-1">
                    <span className="text-sm font-semibold block mb-1" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                      {d.title}
                    </span>
                    <p className="m-0 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                      {d.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Animated divider */}
          <motion.div
            className="my-5 h-px w-full"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}44, transparent)` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />

          {/* What this synthesis is — and isn't */}
          <div className="p-4 rounded-xl border" style={{ background: SURFACE, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: GOLD }}>
              What Tier 1 gives — and does not give
            </span>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-3 rounded-lg border" style={{ background: `${GREEN}06`, borderColor: `${GREEN}22` }}>
                <span className="text-[10px] font-bold block mb-1" style={{ color: GREEN }}>✓ Tier 1 HAS given you</span>
                <p className="m-0 text-[11px] leading-relaxed" style={{ color: INK_SECONDARY }}>
                  Literacy and disciplined foundations across the whole breadth of the tradition: you can read a chart competently, you know the major streams exist and how they differ, and you carry the ethical discipline to practise honestly.
                </p>
              </div>
              <div className="p-3 rounded-lg border" style={{ background: `${VERMILION}06`, borderColor: `${VERMILION}22` }}>
                <span className="text-[10px] font-bold block mb-1" style={{ color: VERMILION }}>✗ Tier 1 has NOT given you</span>
                <p className="m-0 text-[11px] leading-relaxed" style={{ color: INK_SECONDARY }}>
                  Mastery of any single stream — depth in KP, Jaimini, classical Parāśarī prediction, or any other path is the work of Tier 2 and beyond. Holding both halves honestly is itself the capstone lesson.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Śloka — with fade-in animation */}
      <motion.div
        className="mt-6 border-t pt-4 text-center"
        style={{ borderColor: HAIRLINE }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Composite Paraphrase — Synthesis
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          अङ्गान्येकत्र संयुक्तानि यथा देहं प्रकुर्वते। तथा ज्ञानानि संयुक्तानि विज्ञानं जनयन्ति हि॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          aṅgāny ekatra saṁyuktāni yathā dehaṁ prakurvate | tathā jñānāni saṁyuktāni vijñānaṁ janayanti hi.
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;As limbs joined together make up one body, so do separate pieces of knowledge, joined together, give rise to true understanding.&rdquo;
        </p>
      </motion.div>
    </div>
  );
}
