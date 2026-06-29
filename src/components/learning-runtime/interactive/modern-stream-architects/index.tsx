"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  User,
  ShieldCheck,
  BookOpen,
  GitBranch,
} from "lucide-react";
import { goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5C3D26)";
const GOLD = "#A8821E";
const GREEN = "#2E7D32";

interface Architect {
  id: string;
  name: string;
  lifespan: string;
  stream: string;
  texts: string;
  description: string;
  pathNodes: string[]; // List of nodes to highlight in the tree
}

const ARCHITECTS: Architect[] = [
  {
    id: "raman",
    name: "B.V. Raman",
    lifespan: "1912–1998",
    stream: "Parāśarī English translation",
    texts: "A Manual of Hindu Astrology, Three Hundred Important Combinations, Astrological Magazine",
    description: "Re-translated classical Sanskrit Horā into English, rebuilding the transmission bridge for a post-colonial generation educated under British curriculum constraints.",
    pathNodes: ["vedic", "classical", "parashari", "raman"],
  },
  {
    id: "krishnamurti",
    name: "K.S. Krishnamurti",
    lifespan: "1908–1972",
    stream: "KP System (Founder)",
    texts: "KP Reader I–VI (1963–1972)",
    description: "Synthesized the sub-lord theory and 249 nakṣatra sub-divisions. Created a predictive system that operates on Placidus houses and sidereal stars.",
    pathNodes: ["vedic", "classical", "parashari", "krishnamurti"],
  },
  {
    id: "joshi",
    name: "Pandit Roop Chand Joshi",
    lifespan: "1898–1982",
    stream: "Lal Kitab (Founder)",
    texts: "Lal Kitab Farmans (1939–1952)",
    description: "Authored the core Urdu/Hindustani manuals of Lal Kitab in Punjab. Introduced a unique, fixed-Aries chart format and concrete symbolic remedies (*upāyas*).",
    pathNodes: ["vedic", "classical", "parashari", "joshi"],
  },
  {
    id: "rao",
    name: "K.N. Rao",
    lifespan: "1931–",
    stream: "Parāśarī & Jaimini Specialist",
    texts: "Yogis, Destiny and the Wheel of Time, Predicting Through Jaimini Chara Dasa",
    description: "Founded the massive astrology school at Bhāratīya Vidyā Bhavan in Delhi. Restored empirical testing of classical Jaimini and Parāśarī techniques.",
    pathNodes: ["vedic", "classical", "parashari", "jaimini", "rao"],
  },
  {
    id: "rath",
    name: "Sanjay Rath",
    lifespan: "contemporary",
    stream: "Parāśarī-Jaimini Synthesis",
    texts: "Crux of Vedic Astrology, Parāśara Jyotiṣa Course (PJC) Modules",
    description: "Founded Sri Jagannath Centre. Rebuilt international lineage transmission of classical Jaimini and Parāśarī systems through structured translation modules.",
    pathNodes: ["vedic", "classical", "parashari", "jaimini", "rath"],
  },
  {
    id: "sastri",
    name: "V. Subrahmanya Sastri",
    lifespan: "early–mid 20th c.",
    stream: "English Translator",
    texts: "Translations of Tājika Nīlakaṇṭhī, Jātaka Pārijāta, Phaladīpikā",
    description: "Brought rigorous Sanskrit-to-English translation standards to classical text publications. His editions stabilized citations for modern English-medium courses.",
    pathNodes: ["vedic", "classical", "tajika", "sastri"],
  },
];

export function ModernStreamArchitects() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [auditChecks, setAuditChecks] = useState<boolean[]>([false, false, false, false]);

  const activeArch = ARCHITECTS[selectedIdx];

  // Modern Primary checklist verify
  const isAuditPassed = auditChecks.every(Boolean);

  const toggleCheck = (idx: number) => {
    setAuditChecks((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  // Check if a tree path segment/node is active for the current selected architect
  const isNodeActive = (nodeId: string) => {
    return activeArch.pathNodes.includes(nodeId);
  };

  // Segment helper: returns gold color if active, grey if inactive
  const getLineColor = (nodeA: string, nodeB: string) => {
    return isNodeActive(nodeA) && isNodeActive(nodeB) ? GOLD : "rgba(168, 130, 30, 0.22)";
  };

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
        boxShadow: "0 14px 40px rgba(62, 42, 31, 0.08)",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b pb-4" style={{ borderColor: HAIRLINE }}>
        <div>
          <div className="flex items-center gap-2">
            <User size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
              Modern Revival Layering
            </p>
          </div>
          <h2 className="mt-1 m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Modern Stream Architects & Continuing Tradition
          </h2>
          <p className="mt-1 m-0 text-xs text-stone-600" style={{ color: INK_SECONDARY }}>
            Trace the line of transmission connecting modern figures to classical roots, and verify the status of modern primary texts.
          </p>
        </div>
      </div>

      {/* Grid of architects */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
        {ARCHITECTS.map((a, idx) => (
          <button
            key={a.id}
            onClick={() => setSelectedIdx(idx)}
            className="py-2.5 px-2 rounded-lg border text-center transition-all flex flex-col justify-center gap-0.5 hover:border-amber-500"
            style={{
              background: selectedIdx === idx ? SURFACE_2 : SURFACE,
              borderColor: selectedIdx === idx ? GOLD : HAIRLINE,
              boxShadow: selectedIdx === idx ? `0 4px 10px rgba(168, 130, 30, 0.1)` : "none",
            }}
          >
            <span className="text-[10px] font-bold block" style={{ color: INK_PRIMARY, lineHeight: 1.2 }}>
              {a.name}
            </span>
            <span className="text-[8px] uppercase tracking-wider block" style={{ color: GOLD }}>
              {a.lifespan === "contemporary" ? "Living" : a.lifespan}
            </span>
          </button>
        ))}
      </div>

      {/* Main split layout */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-stretch">
        
        {/* Figure Profile & Continuing Tradition Stack */}
        <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: GOLD }}>
                <GitBranch size={14} />
                Lineage Transmission Tree
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded font-bold uppercase text-white" style={{ background: GOLD }}>
                {activeArch.stream}
              </span>
            </div>

            {/* Lineage Tree SVG (Light Parchment theme, matching the rest of the application) */}
            <div className="my-4 flex justify-center rounded-xl p-5 border" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
              <svg viewBox="0 0 280 205" className="w-full max-w-[520px] h-auto block">
                {/* Branches / Connectors */}
                <line x1="140" y1="180" x2="140" y2="135" stroke={getLineColor("vedic", "classical")} strokeWidth={isNodeActive("classical") ? 2.5 : 1} />
                
                {/* Classical split into sub-streams */}
                <line x1="140" y1="135" x2="70" y2="90" stroke={getLineColor("classical", "parashari")} strokeWidth={isNodeActive("parashari") ? 2 : 1} />
                <line x1="140" y1="135" x2="210" y2="90" stroke={getLineColor("classical", "tajika")} strokeWidth={isNodeActive("tajika") ? 2 : 1} />
                <line x1="70" y1="90" x2="110" y2="90" stroke={getLineColor("parashari", "jaimini")} strokeWidth={isNodeActive("jaimini") ? 2 : 1} />

                {/* Leaves split from parashari / jaimini / tajika to figures */}
                <line x1="70" y1="90" x2="30" y2="40" stroke={getLineColor("parashari", "raman")} strokeWidth={isNodeActive("raman") ? 2 : 1} />
                <line x1="70" y1="90" x2="70" y2="40" stroke={getLineColor("parashari", "krishnamurti")} strokeWidth={isNodeActive("krishnamurti") ? 2 : 1} />
                <line x1="70" y1="90" x2="110" y2="40" stroke={getLineColor("parashari", "joshi")} strokeWidth={isNodeActive("joshi") ? 2 : 1} />

                <line x1="110" y1="90" x2="150" y2="40" stroke={getLineColor("jaimini", "rao")} strokeWidth={isNodeActive("rao") ? 2 : 1} />
                <line x1="110" y1="90" x2="190" y2="40" stroke={getLineColor("jaimini", "rath")} strokeWidth={isNodeActive("rath") ? 2 : 1} />
                <line x1="210" y1="90" x2="230" y2="40" stroke={getLineColor("tajika", "sastri")} strokeWidth={isNodeActive("sastri") ? 2 : 1} />

                {/* Root Node (Vedic Roots) */}
                <circle cx="140" cy="180" r="12" fill="#1C2E20" stroke={GOLD} strokeWidth="1.4" />
                <text x="140" y="183.5" textAnchor="middle" fill="#ECEFF1" fontSize="8.5" fontWeight="bold">Vedic</text>
                <text x="140" y="199" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="bold">Lagadha (~1200 BCE)</text>

                {/* Classical Node */}
                <circle cx="140" cy="135" r="11" fill={isNodeActive("classical") ? GOLD : SURFACE} stroke={isNodeActive("classical") ? GOLD : "rgba(168, 130, 30, 0.4)"} strokeWidth="1.7" />
                <text x="140" y="138" textAnchor="middle" fill={isNodeActive("classical") ? "#FFF" : INK_SECONDARY} fontSize="7.5" fontWeight="bold">Class</text>
                <text x="195" y="138" textAnchor="middle" fill={INK_SECONDARY} fontSize="8.5" fontWeight="600">Varāhamihira (6th c.)</text>

                {/* Stream Nodes */}
                <circle cx="70" cy="90" r="10" fill={isNodeActive("parashari") ? GOLD : SURFACE} stroke={isNodeActive("parashari") ? GOLD : "rgba(168, 130, 30, 0.4)"} strokeWidth="1.7" />
                <text x="70" y="93" textAnchor="middle" fill={isNodeActive("parashari") ? "#FFF" : INK_SECONDARY} fontSize="7.5" fontWeight="bold">Para</text>

                <circle cx="110" cy="90" r="10" fill={isNodeActive("jaimini") ? GOLD : SURFACE} stroke={isNodeActive("jaimini") ? GOLD : "rgba(168, 130, 30, 0.4)"} strokeWidth="1.7" />
                <text x="110" y="93" textAnchor="middle" fill={isNodeActive("jaimini") ? "#FFF" : INK_SECONDARY} fontSize="7.5" fontWeight="bold">Jaim</text>

                <circle cx="210" cy="90" r="10" fill={isNodeActive("tajika") ? GOLD : SURFACE} stroke={isNodeActive("tajika") ? GOLD : "rgba(168, 130, 30, 0.4)"} strokeWidth="1.7" />
                <text x="210" y="93" textAnchor="middle" fill={isNodeActive("tajika") ? "#FFF" : INK_SECONDARY} fontSize="7.5" fontWeight="bold">Taji</text>

                {/* Modern Figure Nodes */}
                <circle cx="30" cy="40" r="9.5" fill={isNodeActive("raman") ? GOLD : SURFACE} stroke={isNodeActive("raman") ? GOLD : "rgba(168, 130, 30, 0.4)"} strokeWidth="1.7" />
                <text x="30" y="43" textAnchor="middle" fill={isNodeActive("raman") ? "#FFF" : INK_SECONDARY} fontSize="7.2" fontWeight="bold">BVR</text>
                
                <circle cx="70" cy="40" r="9.5" fill={isNodeActive("krishnamurti") ? GOLD : SURFACE} stroke={isNodeActive("krishnamurti") ? GOLD : "rgba(168, 130, 30, 0.4)"} strokeWidth="1.7" />
                <text x="70" y="43" textAnchor="middle" fill={isNodeActive("krishnamurti") ? "#FFF" : INK_SECONDARY} fontSize="7.2" fontWeight="bold">KSK</text>

                <circle cx="110" cy="40" r="9.5" fill={isNodeActive("joshi") ? GOLD : SURFACE} stroke={isNodeActive("joshi") ? GOLD : "rgba(168, 130, 30, 0.4)"} strokeWidth="1.7" />
                <text x="110" y="43" textAnchor="middle" fill={isNodeActive("joshi") ? "#FFF" : INK_SECONDARY} fontSize="7.2" fontWeight="bold">Roop</text>

                <circle cx="150" cy="40" r="9.5" fill={isNodeActive("rao") ? GOLD : SURFACE} stroke={isNodeActive("rao") ? GOLD : "rgba(168, 130, 30, 0.4)"} strokeWidth="1.7" />
                <text x="150" y="43" textAnchor="middle" fill={isNodeActive("rao") ? "#FFF" : INK_SECONDARY} fontSize="7.2" fontWeight="bold">KNR</text>

                <circle cx="190" cy="40" r="9.5" fill={isNodeActive("rath") ? GOLD : SURFACE} stroke={isNodeActive("rath") ? GOLD : "rgba(168, 130, 30, 0.4)"} strokeWidth="1.7" />
                <text x="190" y="43" textAnchor="middle" fill={isNodeActive("rath") ? "#FFF" : INK_SECONDARY} fontSize="7.2" fontWeight="bold">Rath</text>

                <circle cx="230" cy="40" r="9.5" fill={isNodeActive("sastri") ? GOLD : SURFACE} stroke={isNodeActive("sastri") ? GOLD : "rgba(168, 130, 30, 0.4)"} strokeWidth="1.7" />
                <text x="230" y="43" textAnchor="middle" fill={isNodeActive("sastri") ? "#FFF" : INK_SECONDARY} fontSize="7.2" fontWeight="bold">Sast</text>
              </svg>
            </div>

            <h3 className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
              {activeArch.name} ({activeArch.lifespan})
            </h3>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
              {activeArch.description}
            </p>
            <div className="mt-3 p-3 rounded-lg border text-xs" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
              <strong>Key Texts/Publications:</strong> {activeArch.texts}
            </div>
          </div>
        </div>

        {/* Modern Primary Checklist Audit */}
        <div className="flex flex-col justify-between gap-4">
          <div className="rounded-xl p-5 border flex-1" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} color={GOLD} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                Modern Primary Audit Lab
              </span>
            </div>
            
            <p className="m-0 text-xs leading-normal mb-4" style={{ color: INK_SECONDARY }}>
              To qualify as a citable &quot;Modern Primary&quot; (like KP Reader or Lal Kitab), a 20th-century text must meet four strict criteria:
            </p>

            {/* Audit Checklist */}
            <div className="space-y-3">
              {[
                "1. Named individual author (not anonymous/lineage-only)",
                "2. Stable and documented printed text variants",
                "3. No pre-modern written manuscript antecedent",
                "4. Globally recognized stream of predictive astrology",
              ].map((criteria, idx) => (
                <label key={idx} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    checked={auditChecks[idx]}
                    onChange={() => toggleCheck(idx)}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span style={{ color: auditChecks[idx] ? INK_PRIMARY : INK_SECONDARY }}>
                    {criteria}
                  </span>
                </label>
              ))}
            </div>

            {/* Verdict */}
            <AnimatePresence>
              {isAuditPassed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-4 p-3 rounded-lg border-2 flex flex-col gap-1 text-[11px]"
                  style={{
                    background: "rgba(46, 125, 50, 0.05)",
                    borderColor: GREEN,
                  }}
                >
                  <span className="font-bold flex items-center gap-1.5" style={{ color: GREEN }}>
                    <ShieldCheck size={14} />
                    Verified Modern Primary
                  </span>
                  <span style={{ color: INK_SECONDARY, lineHeight: 1.4 }}>
                    KP and Lal Kitab meet all four criteria. They are cited in the curriculum as authoritative primary sources, not derivative commentary.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick toggle next */}
          <div className="rounded-xl p-4 border bg-stone-50" style={{
            background: SURFACE,
            borderColor: HAIRLINE,
          }}>
            <button
              onClick={() => {
                const nextIdx = (selectedIdx + 1) % ARCHITECTS.length;
                setSelectedIdx(nextIdx);
              }}
              className="w-full inline-flex items-center justify-center gap-1 py-1.5 rounded text-[10px] font-bold text-white uppercase tracking-wider active:scale-95"
              style={{ background: GOLD }}
            >
              Next Architect
              <ArrowRight size={10} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
