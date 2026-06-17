"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, BookOpen, Award, RotateCcw, HelpCircle } from "lucide-react";
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

/* ─── §6 Readiness Checklist — directly from the lesson ─── */
interface ChecklistItem {
  id: string;
  text: string;
  category: "technical" | "discipline";
}

const CHECKLIST: ChecklistItem[] = [
  { id: "c1", text: "Given a birth chart, can I read the grahas in their houses and signs without notes?",                     category: "technical" },
  { id: "c2", text: "Can I distinguish a strong placement from a weak one and say why?",                                       category: "technical" },
  { id: "c3", text: "Can I run a daśā and lay a transit against a chart?",                                                     category: "technical" },
  { id: "c4", text: "Can I recognise the major yogas and say what they do and don't promise?",                                  category: "technical" },
  { id: "c5", text: "Can I name how at least three streams differ from classical Parāśarī?",                                   category: "technical" },
  { id: "c6", text: "Can I give the honest framing — practised / claimed / verified — for a contested technique?",              category: "discipline" },
  { id: "c7", text: "When a question exceeds my competence, do I say so and refer out?",                                       category: "discipline" },
  { id: "c8", text: "Do I keep the client's decision theirs?",                                                                 category: "discipline" },
];

/* ─── §4.2 Genuine vs Superficial Markers — from the lesson table ─── */
interface MarkerPair {
  genuine: string;
  superficial: string;
}

const MARKER_PAIRS: MarkerPair[] = [
  { genuine: "Reaching for several modules on one question and weighing them together",  superficial: "Reciting one technique impressively in isolation" },
  { genuine: "Saying \"the chart suggests\" and \"this is one factor among many\"",      superficial: "Saying \"the chart says\" and \"this will happen\"" },
  { genuine: "Naming the limit of your competence and referring out",                    superficial: "Answering everything to avoid losing the client" },
  { genuine: "Holding a striking result open rather than over-claiming it",              superficial: "Treating a vivid hit as proof of a mechanism" },
  { genuine: "Comfort with \"I don't know yet\"",                                        superficial: "Manufactured certainty to seem complete" },
];

/* ─── §4.1 Competence Inventory — from the lesson ─── */
interface CompetenceArea {
  label: string;
  description: string;
}

const COMPETENCE_AREAS: CompetenceArea[] = [
  { label: "Chart literacy",              description: "You can set up and read a birth chart — grahas in rāśis and bhāvas, their aspects, their dignities — without it being a wall of symbols." },
  { label: "Strength assessment",         description: "You can tell a strong promise from a weak one, rather than reading every placement as equally loud." },
  { label: "Predictive-method fluency",   description: "You can run a daśā, lay a transit against a chart, and recognise the major yogas — the machinery of timing." },
  { label: "Multi-stream awareness",      description: "You know that KP, Jaimini, Lal Kitab, Tājika, and Nāḍī exist, how they differ from classical Parāśarī, and when one might be reached for." },
  { label: "Ancillary literacy",          description: "You can place numerology, vāstu, and muhūrta honestly, neither dismissing nor inflating them." },
  { label: "Ethical discipline",          description: "You carry the honest-handling frame, the refusal of single-cause thinking, the empowerment principle, and the pledge." },
];

type TabId = "checklist" | "markers" | "inventory";

export function CurriculumCompletionLedger() {
  const [activeTab, setActiveTab] = useState<TabId>("checklist");
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [hoveredMarker, setHoveredMarker] = useState<{ index: number; side: "genuine" | "superficial" } | null>(null);

  const technicalCount = CHECKLIST.filter((c) => c.category === "technical" && checked.has(c.id)).length;
  const disciplineCount = CHECKLIST.filter((c) => c.category === "discipline" && checked.has(c.id)).length;
  const technicalTotal = CHECKLIST.filter((c) => c.category === "technical").length;
  const disciplineTotal = CHECKLIST.filter((c) => c.category === "discipline").length;
  const technicalPct = Math.round((technicalCount / technicalTotal) * 100);
  const disciplinePct = Math.round((disciplineCount / disciplineTotal) * 100);
  const allChecked = checked.size === CHECKLIST.length;

  function toggleCheck(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function resetChecklist() {
    setChecked(new Set());
  }

  /* Verdict logic — from lesson §6 */
  let verdictColor = INK_MUTED;
  let verdictTitle = "Begin your self-assessment";
  let verdictText = "Check each item not by \"did I study it?\" but \"can I do it, under pressure, with a real person?\"";

  if (checked.size > 0) {
    if (technicalPct === 100 && disciplinePct === 0) {
      verdictColor = VERMILION;
      verdictTitle = "Safety Risk";
      verdictText = "Technical competence without ethical discipline is a liability. A person with the techniques but not the discipline has not completed Tier 1 — they have completed the more dangerous half.";
    } else if (technicalPct === 0 && disciplinePct === 100) {
      verdictColor = GOLD;
      verdictTitle = "Shaky Foundation";
      verdictText = "Ethical awareness without technical grounding — the discipline is there but the technical items need revisiting. Return to the relevant modules.";
    } else if (allChecked) {
      verdictColor = GREEN;
      verdictTitle = "Graduate Ready";
      verdictText = "Both the technical foundation and the ethical discipline hold. You have genuine breadth and disciplined foundations — and not yet mastery of any single stream. Hold both honestly.";
    } else if (technicalPct > 60 && disciplinePct > 60) {
      verdictColor = GOLD;
      verdictTitle = "Nearly There";
      verdictText = "Most items hold. Review the unchecked items — genuine completion needs both the technical and the discipline columns.";
    } else {
      verdictColor = GOLD;
      verdictTitle = "In Progress";
      verdictText = "Keep self-assessing honestly. Items 1–5 are the technical foundation; 6–8 are the discipline. Both must hold for genuine Tier 1 completion.";
    }
  }

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={16} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
              Module 24 • Chapter 5 • Lesson 3
            </p>
          </div>
          {checked.size > 0 && (
            <button
              onClick={resetChecklist}
              className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 px-2 py-1 rounded transition-colors hover:bg-black/5"
              style={{ color: INK_MUTED }}
            >
              <RotateCcw size={10} /> Reset
            </button>
          )}
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Completing Tier 1: What You Have Built, and How to Know It
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Self-assess against an honest readiness checklist, distinguish genuine completion from its appearance, and take stock of the competence Tier 1 confers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        {([
          { id: "checklist" as TabId, label: "Readiness Checklist" },
          { id: "markers" as TabId,   label: "Genuine vs Superficial" },
          { id: "inventory" as TabId, label: "Competence Inventory" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="pb-2 px-2 text-xs font-bold transition-all relative"
            style={{ color: activeTab === tab.id ? GOLD : INK_SECONDARY }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: GOLD }}
                layoutId="completionTabLine"
              />
            )}
          </button>
        ))}
      </div>

      {/* ═══ TAB 1: Readiness Checklist ═══ */}
      {activeTab === "checklist" && (
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          {/* Left: Checklist */}
          <div className="flex flex-col gap-2">
            <p className="m-0 mb-2 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
              For each item, answer not &ldquo;did I study it?&rdquo; but &ldquo;<strong>can I do it, under pressure, with a real person?</strong>&rdquo;
            </p>

            {/* Technical items */}
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Technical Foundation (Items 1–5)
            </span>
            {CHECKLIST.filter((c) => c.category === "technical").map((item, i) => (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className="w-full p-3 rounded-lg border text-left text-xs flex items-start gap-3 transition-all hover:bg-white/50"
                style={{
                  background: checked.has(item.id) ? `${GREEN}08` : SURFACE,
                  borderColor: checked.has(item.id) ? `${GREEN}33` : HAIRLINE,
                }}
              >
                <span
                  className="flex-shrink-0 mt-0.5 flex items-center justify-center rounded"
                  style={{
                    width: 20, height: 20,
                    background: checked.has(item.id) ? GREEN : SURFACE_2,
                    color: checked.has(item.id) ? "#fff" : INK_MUTED,
                    borderRadius: 4,
                  }}
                >
                  {checked.has(item.id) ? <CheckCircle2 size={12} /> : <span className="text-[9px] font-bold">{i + 1}</span>}
                </span>
                <span style={{ color: checked.has(item.id) ? INK_PRIMARY : INK_SECONDARY }}>{item.text}</span>
              </button>
            ))}

            {/* Discipline items */}
            <span className="text-[10px] font-bold uppercase tracking-wider mt-2" style={{ color: VERMILION }}>
              Ethical Discipline (Items 6–8)
            </span>
            {CHECKLIST.filter((c) => c.category === "discipline").map((item, i) => (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className="w-full p-3 rounded-lg border text-left text-xs flex items-start gap-3 transition-all hover:bg-white/50"
                style={{
                  background: checked.has(item.id) ? `${GREEN}08` : SURFACE,
                  borderColor: checked.has(item.id) ? `${GREEN}33` : HAIRLINE,
                }}
              >
                <span
                  className="flex-shrink-0 mt-0.5 flex items-center justify-center rounded"
                  style={{
                    width: 20, height: 20,
                    background: checked.has(item.id) ? GREEN : SURFACE_2,
                    color: checked.has(item.id) ? "#fff" : INK_MUTED,
                    borderRadius: 4,
                  }}
                >
                  {checked.has(item.id) ? <CheckCircle2 size={12} /> : <span className="text-[9px] font-bold">{i + 6}</span>}
                </span>
                <span style={{ color: checked.has(item.id) ? INK_PRIMARY : INK_SECONDARY }}>{item.text}</span>
              </button>
            ))}
          </div>

          {/* Right: Dual Radial Gauge & Verdict */}
          <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-3 text-center" style={{ color: GOLD }}>
                Competence Profile Balance
              </span>

              {/* Concentric Dual Radial Gauge */}
              <div className="flex flex-col items-center justify-center p-2 relative mb-4">
                <svg width="180" height="180" viewBox="0 0 180 180" className="relative z-10">
                  <defs>
                    <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  {/* Outer Track (Technical) */}
                  <circle
                    cx="90" cy="90" r="70"
                    fill="transparent"
                    stroke={SURFACE_2}
                    strokeWidth="8"
                  />
                  {/* Outer Arc (Technical Progress) */}
                  <motion.circle
                    cx="90" cy="90" r="70"
                    fill="transparent"
                    stroke={GOLD}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 70}
                    animate={{ strokeDashoffset: (2 * Math.PI * 70) * (1 - technicalPct / 100) }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    transform="rotate(-90 90 90)"
                  />

                  {/* Inner Track (Discipline) */}
                  <circle
                    cx="90" cy="90" r="50"
                    fill="transparent"
                    stroke={SURFACE_2}
                    strokeWidth="8"
                  />
                  {/* Inner Arc (Discipline Progress) */}
                  <motion.circle
                    cx="90" cy="90" r="50"
                    fill="transparent"
                    stroke={disciplinePct === 100 ? GREEN : VERMILION}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 50}
                    animate={{ strokeDashoffset: (2 * Math.PI * 50) * (1 - disciplinePct / 100) }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    transform="rotate(-90 90 90)"
                  />

                  {/* Center Seal background / rotating star when complete */}
                  <AnimatePresence>
                    {allChecked && (
                      <motion.g
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{ originX: "90px", originY: "90px" }}
                      >
                        <motion.g
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                          style={{ originX: "90px", originY: "90px" }}
                        >
                          {/* 12-Pointed Star representing 12 Rasis */}
                          <path
                            d="M 90 46 L 95 62 L 111 58 L 105 73 L 120 78 L 108 89 L 120 100 L 105 105 L 111 120 L 95 116 L 90 132 L 85 116 L 69 120 L 75 105 L 60 100 L 72 89 L 60 78 L 75 73 L 69 58 L 85 62 Z"
                            fill="rgba(168, 130, 30, 0.15)"
                            stroke={GOLD}
                            strokeWidth="1"
                            style={{ filter: "url(#gold-glow)" }}
                          />
                        </motion.g>
                      </motion.g>
                    )}
                  </AnimatePresence>

                  {/* Center Core Circle */}
                  <circle
                    cx="90" cy="90" r="32"
                    fill={allChecked ? GOLD : SURFACE}
                    stroke={allChecked ? GOLD : HAIRLINE}
                    strokeWidth="2"
                    style={allChecked ? { filter: "url(#gold-glow)" } : undefined}
                  />

                  {/* Center Icon/Text */}
                  {allChecked ? (
                    <g transform="translate(78, 78)">
                      <Award size={24} color="#FFF" />
                    </g>
                  ) : (
                    <g>
                      <text x="90" y="87" fill={INK_PRIMARY} fontSize="12" fontWeight="bold" textAnchor="middle">
                        {checked.size}
                      </text>
                      <text x="90" y="99" fill={INK_MUTED} fontSize="7" fontWeight="bold" letterSpacing="1" textAnchor="middle">
                        OF 8
                      </text>
                    </g>
                  )}
                </svg>

                {/* Legend labels */}
                <div className="flex gap-4 mt-3 text-[10px]">
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: GOLD }} />
                    <span style={{ color: INK_SECONDARY }}>Technical ({technicalPct}%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: disciplinePct === 100 ? GREEN : VERMILION }} />
                    <span style={{ color: INK_SECONDARY }}>Ethical ({disciplinePct}%)</span>
                  </div>
                </div>
              </div>

              {/* Balance reminder */}
              <p className="m-0 text-[10px] leading-relaxed text-center" style={{ color: INK_MUTED }}>
                Genuine completion needs both columns. The discipline items are the more urgent gap if they are shaky — re-read Module 24 and re-make your pledge.
              </p>
            </div>

            {/* Verdict box */}
            <div className="mt-5">
              <div
                className="p-3 rounded-lg flex items-start gap-2 text-[11px] leading-normal border transition-all duration-300"
                style={{
                  background: allChecked ? `${GREEN}08` : SURFACE_2,
                  borderColor: allChecked ? GREEN : `${verdictColor}33`,
                  boxShadow: allChecked ? "0 0 12px rgba(46, 125, 50, 0.15)" : "none",
                }}
              >
                {allChecked ? (
                  <Award size={16} color={GREEN} className="flex-shrink-0 mt-0.5 animate-pulse" />
                ) : verdictColor === VERMILION ? (
                  <AlertTriangle size={16} color={verdictColor} className="flex-shrink-0 mt-0.5" />
                ) : (
                  <BookOpen size={16} color={verdictColor} className="flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block" style={{ color: allChecked ? GREEN : verdictColor }}>
                    {verdictTitle}
                  </span>
                  <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{verdictText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 2: Genuine vs Superficial ═══ */}
      {activeTab === "markers" && (
        <div className="space-y-4">
          <p className="m-0 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
            Completion is easier to fake than to have. These markers distinguish the real thing from its appearance. If you find yourself doing the left-hand column under pressure, you have completed Tier 1 in the way that matters.
          </p>
          <div className="flex flex-col gap-3">
            {MARKER_PAIRS.map((pair, i) => {
              const isHoveredGenuine = hoveredMarker?.index === i && hoveredMarker?.side === "genuine";
              const isHoveredSuperficial = hoveredMarker?.index === i && hoveredMarker?.side === "superficial";
              const hasHoveredRow = hoveredMarker?.index === i;

              return (
                <div key={i} className="relative grid md:grid-cols-2 gap-4 items-center">
                  {/* Genuine Column */}
                  <div
                    onMouseEnter={() => setHoveredMarker({ index: i, side: "genuine" })}
                    onMouseLeave={() => setHoveredMarker(null)}
                    className="p-3.5 rounded-lg border flex items-start gap-2.5 transition-all duration-300 cursor-default relative z-10"
                    style={{
                      background: isHoveredGenuine ? `${GREEN}0F` : hasHoveredRow && hoveredMarker?.side !== "genuine" ? `${GREEN}02` : `${GREEN}06`,
                      borderColor: isHoveredGenuine ? GREEN : `${GREEN}22`,
                      opacity: hoveredMarker && hoveredMarker.index === i && hoveredMarker.side !== "genuine" ? 0.35 : 1,
                      transform: isHoveredGenuine ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <CheckCircle2 size={14} color={GREEN} className="flex-shrink-0 mt-0.5" />
                    <p className="m-0 text-[11px] leading-relaxed font-semibold" style={{ color: INK_PRIMARY }}>
                      {pair.genuine}
                    </p>
                  </div>

                  {/* Connecting Line element inside grid (between cols) */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-0 pointer-events-none">
                    <svg width="40" height="2" viewBox="0 0 40 2">
                      <line
                        x1="0" y1="1" x2="40" y2="1"
                        stroke={hasHoveredRow ? GOLD : HAIRLINE}
                        strokeWidth="1.5"
                        strokeDasharray={hasHoveredRow ? "none" : "3 3"}
                        className="transition-all duration-300"
                      />
                    </svg>
                  </div>

                  {/* Superficial Column */}
                  <div
                    onMouseEnter={() => setHoveredMarker({ index: i, side: "superficial" })}
                    onMouseLeave={() => setHoveredMarker(null)}
                    className="p-3.5 rounded-lg border flex items-start gap-2.5 transition-all duration-300 cursor-default relative z-10"
                    style={{
                      background: isHoveredSuperficial ? `${VERMILION}0F` : hasHoveredRow && hoveredMarker?.side !== "superficial" ? `${VERMILION}02` : `${VERMILION}06`,
                      borderColor: isHoveredSuperficial ? VERMILION : `${VERMILION}22`,
                      opacity: hoveredMarker && hoveredMarker.index === i && hoveredMarker.side !== "superficial" ? 0.35 : 1,
                      transform: isHoveredSuperficial ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <XCircle size={14} color={VERMILION} className="flex-shrink-0 mt-0.5" />
                    <p className="m-0 text-[11px] leading-relaxed" style={{ color: INK_SECONDARY }}>
                      {pair.superficial}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TAB 3: Competence Inventory ═══ */}
      {activeTab === "inventory" && (
        <div className="space-y-4">
          <p className="m-0 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
            Set aside the tally. Here is the real inventory of competence a completed Tier 1 confers — the last item is not a footnote.
          </p>
          <div className="flex flex-col gap-3">
            {COMPETENCE_AREAS.map((area, i) => {
              const isEssential = i === COMPETENCE_AREAS.length - 1;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl border flex items-start gap-3 transition-all hover:bg-white/50"
                  style={{
                    background: isEssential ? `${SURFACE_2}CC` : SURFACE_2,
                    borderColor: isEssential ? GOLD : HAIRLINE,
                    boxShadow: isEssential ? "0 4px 12px rgba(168, 130, 30, 0.05)" : "none",
                  }}
                >
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-full text-[10px] font-bold"
                    style={{
                      width: 26,
                      height: 26,
                      background: isEssential ? `${VERMILION}15` : `${GOLD}15`,
                      color: isEssential ? VERMILION : GOLD,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <span className="text-sm font-semibold flex items-center gap-2 mb-0.5" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                      {area.label}
                      {isEssential && (
                        <motion.span
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wide"
                          style={{ background: `${VERMILION}15`, color: VERMILION }}
                        >
                          ESSENTIAL
                        </motion.span>
                      )}
                    </span>
                    <p className="m-0 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>{area.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* §4.3 What readiness is — and isn't */}
          <div className="mt-5 p-4 rounded-xl border" style={{ background: SURFACE, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: GOLD }}>
              Readiness is — and is not
            </span>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-3 rounded-lg border" style={{ background: `${GREEN}06`, borderColor: `${GREEN}22` }}>
                <span className="text-[10px] font-bold block mb-1" style={{ color: GREEN }}>✓ Tier 1 readiness IS</span>
                <p className="m-0 text-[11px] leading-relaxed" style={{ color: INK_SECONDARY }}>
                  A sound, honest foundation: real chart literacy, real predictive fluency, real breadth, and the discipline to practise without harm.
                </p>
              </div>
              <div className="p-3 rounded-lg border" style={{ background: `${VERMILION}06`, borderColor: `${VERMILION}22` }}>
                <span className="text-[10px] font-bold block mb-1" style={{ color: VERMILION }}>✗ Tier 1 readiness is NOT</span>
                <p className="m-0 text-[11px] leading-relaxed" style={{ color: INK_SECONDARY }}>
                  Mastery of any single stream, or permission to stop learning. The constitution's mastery-not-completion principle means a completed Tier 1 is a well-laid foundation, not a finished house.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Śloka */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-6 border-t pt-4 text-center"
        style={{ borderColor: HAIRLINE }}
      >
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Composite Paraphrase — Humility of the Learned
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          यथा यथा हि पुरुषः शास्त्रं समधिगच्छति। तथा तथा विजानाति कियद् अल्पं मया श्रुतम्॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          yathā yathā hi puruṣaḥ śāstraṁ samadhigacchati | tathā tathā vijānāti kiyad alpaṁ mayā śrutam.
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;The more a person truly masters a body of knowledge, the more clearly they realise how little of it they have yet heard.&rdquo;
        </p>
      </motion.div>
    </div>
  );
}
