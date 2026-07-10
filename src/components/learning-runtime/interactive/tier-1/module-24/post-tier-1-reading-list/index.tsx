"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ShieldCheck, AlertTriangle, Hourglass, CheckCircle2, BookMarked, PenTool } from "lucide-react";
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

interface Book {
  id: string;
  title: string;
  stream: string;
  type: "foundational" | "advanced";
  difficulty: "beginner" | "intermediate" | "advanced";
}

const BOOKS: Book[] = [
  { id: "bphs", title: "Bṛhat Parāśara Horā Śāstra (BPHS)", stream: "parashari", type: "foundational", difficulty: "beginner" },
  { id: "bj", title: "Bṛhat Jātaka (Varāhamihira)", stream: "parashari", type: "foundational", difficulty: "beginner" },
  { id: "pd", title: "Phaladīpikā (Mantreśvara)", stream: "parashari", type: "advanced", difficulty: "intermediate" },
  { id: "saravali", title: "Sārāvalī (Kalyāṇa Varma)", stream: "parashari", type: "advanced", difficulty: "advanced" },
  { id: "js", title: "Jaimini Sūtras (Upadeśa Sūtras)", stream: "jaimini", type: "foundational", difficulty: "intermediate" },
  { id: "kpr", title: "KP Readers (I-VI)", stream: "kp", type: "foundational", difficulty: "intermediate" },
  { id: "tn", title: "Tājika Nīlakaṇṭhī", stream: "tajika", type: "foundational", difficulty: "intermediate" },
  { id: "lk", title: "Lal Kitab (Roop Chand Joshi)", stream: "lal-kitab", type: "foundational", difficulty: "intermediate" },
];

export function PostTier1ReadingList() {
  const [activeTab, setActiveTab] = useState<"planner" | "example1" | "example2" | "example3">("planner");
  
  // Tab 1: Planner states
  const [primaryStream, setPrimaryStream] = useState<string>("parashari");
  const [secondaryStream, setSecondaryStream] = useState<string>("none");
  const [pacing, setPacing] = useState<number>(3); 
  const [selectedBooks, setSelectedBooks] = useState<string[]>(["bphs"]);

  // Tab 2: Example 1 states
  const [ex1Choice, setEx1Choice] = useState<string>("none");

  // Tab 3: Example 2 states
  const [ex2Choice, setEx2Choice] = useState<string>("none");

  // Tab 4: Example 3 states
  const [ex3Choice, setEx3Choice] = useState<string>("none");

  const toggleBook = (id: string) => {
    setSelectedBooks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // Calculations for Planner
  const totalSelected = selectedBooks.length;
  const hasBphs = selectedBooks.includes("bphs");
  const hasBj = selectedBooks.includes("bj");
  
  let status: "empowered" | "dependent" | "neglect" = "empowered";
  let auditFeedback = "Svadharma Compliant Study Plan: Focusing on foundational texts at a disciplined pace.";
  const alerts: string[] = [];

  if (primaryStream === secondaryStream && primaryStream !== "none") {
    status = "dependent";
    alerts.push("Validation Error: Secondary stream cannot match your primary stream.");
    auditFeedback = "Divergent focus check: Adjust your secondary focus to prevent duplication of efforts.";
  }

  const selectedOtherStreamBooks = BOOKS.filter(
    (b) => selectedBooks.includes(b.id) && b.stream !== primaryStream
  );

  if (selectedOtherStreamBooks.length > 0 && !hasBphs) {
    status = "dependent";
    alerts.push("Sequence Violation: BPHS must be studied before starting secondary streams.");
    auditFeedback = "Fragmented Focus: Rushing to secondary streams without Parāśarī foundation breaches sequenced-mastery.";
  }

  const hasAdvancedParashari = selectedBooks.includes("pd") || selectedBooks.includes("saravali");
  if (hasAdvancedParashari && !hasBphs) {
    status = "dependent";
    alerts.push("Sequence Violation: Foundational texts (BPHS) must precede advanced compilations (Phaladīpikā/Sārāvalī).");
    auditFeedback = "Rushing to advanced manuals. Phaladīpikā assumes core divisional chart models taught in BPHS.";
  }

  if (totalSelected >= 5 && pacing === 1) {
    status = "neglect";
    alerts.push("List-Completion Fallacy: Skimming too many texts with insufficient weekly hours.");
    auditFeedback = "Bibliographic collection failure. Owning or skimming 5+ volumes at 1 hr/week yields zero chart-reading fluency.";
  }

  if (secondaryStream !== "none" && pacing === 1) {
    status = "dependent";
    alerts.push("Dispersed focus risk: Low hours allocated for two separate stream schedules.");
    auditFeedback = "Dispersed focus. Fluency will be highly shallow in both streams.";
  }

  let bibConfidence = Math.min(100, totalSelected * 15 + pacing * 5);
  let opFluency = 0;

  if (pacing === 1) {
    opFluency = Math.max(5, totalSelected * 5);
  } else if (pacing === 3) {
    opFluency = Math.min(85, (hasBphs ? 35 : 10) + (hasBj ? 20 : 0) + (selectedBooks.length * 8));
  } else {
    opFluency = Math.min(100, (hasBphs ? 45 : 15) + (hasBj ? 25 : 0) + (selectedBooks.length * 10));
  }

  if (status !== "empowered") {
    opFluency = Math.max(5, Math.floor(opFluency * 0.4));
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
        <div className="flex items-center gap-2">
          <BookOpen size={16} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Module 24 • Chapter 4 • Lesson 1
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Svādhyāya Sequencing & Pacing Dojo
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Sequence your reading plan honestly. Experience the exact lesson worked examples to test your study discipline.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        {[
          { id: "planner", label: "Study Planner" },
          { id: "example1", label: "Example 1: Dasa Sequencing" },
          { id: "example2", label: "Example 2: Study Pacing" },
          { id: "example3", label: "Example 3: Citation Audit" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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
                layoutId="activeTabUnderline"
              />
            )}
          </button>
        ))}
      </div>

      {/* Main Panel Content */}
      {activeTab === "planner" && (
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          {/* Controls */}
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                  Primary Stream Focus
                </label>
                <select
                  value={primaryStream}
                  onChange={(e) => setPrimaryStream(e.target.value)}
                  className="p-2 text-xs rounded-lg border focus:ring-1 focus:ring-amber-500 bg-white"
                  style={{ borderColor: HAIRLINE, color: INK_PRIMARY }}
                >
                  <option value="parashari">Parāśarī (Natal & Dasa)</option>
                  <option value="jaimini">Jaimini (Sign Dasa & Karakas)</option>
                  <option value="kp">KP (Stellar & Sub-lords)</option>
                  <option value="tajika">Tājika (Varṣaphala)</option>
                  <option value="lal-kitab">Lal Kitab (Punjabi Upaya)</option>
                  <option value="nadi">Nāḍī (Palm-leaf Principles)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                  Secondary Stream Focus
                </label>
                <select
                  value={secondaryStream}
                  onChange={(e) => setSecondaryStream(e.target.value)}
                  className="p-2 text-xs rounded-lg border focus:ring-1 focus:ring-amber-500 bg-white"
                  style={{ borderColor: HAIRLINE, color: INK_PRIMARY }}
                >
                  <option value="none">None (Single Focus)</option>
                  <option value="parashari">Parāśarī</option>
                  <option value="jaimini">Jaimini</option>
                  <option value="kp">KP</option>
                  <option value="tajika">Tājika</option>
                  <option value="lal-kitab">Lal Kitab</option>
                  <option value="nadi">Nāḍī</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Study Hours Per Week
              </span>
              <div className="flex gap-2 p-1 rounded-lg" style={{ background: SURFACE_2 }}>
                {[
                  { val: 1, label: "1 hr (Skimming)" },
                  { val: 3, label: "3 hrs (Disciplined)" },
                  { val: 5, label: "5+ hrs (Dedicated)" },
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => setPacing(p.val)}
                    className="flex-1 py-1.5 px-3 rounded-md text-[10px] font-bold transition-all"
                    style={{
                      background: pacing === p.val ? SURFACE : "transparent",
                      color: pacing === p.val ? INK_PRIMARY : INK_SECONDARY,
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Scripture Stack selections
              </span>
              <div className="grid gap-2 max-h-[180px] overflow-y-auto pr-1">
                {BOOKS.map((book) => {
                  const isSelected = selectedBooks.includes(book.id);
                  return (
                    <button
                      key={book.id}
                      onClick={() => toggleBook(book.id)}
                      className="flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-all hover:bg-white/50"
                      style={{
                        background: isSelected ? SURFACE_2 : SURFACE,
                        borderColor: isSelected ? GOLD : HAIRLINE,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded border flex items-center justify-center"
                          style={{ borderColor: GOLD, background: isSelected ? GOLD : "transparent" }}
                        >
                          {isSelected && <span className="text-[8px] text-white">✓</span>}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold" style={{ color: INK_PRIMARY }}>{book.title}</span>
                          <span className="text-[8px] uppercase tracking-wider" style={{ color: INK_MUTED }}>
                            {book.stream} • {book.type}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Visual & Auditor */}
          <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Study Path Timeline
              </span>
              <div className="flex justify-center rounded-xl p-3 my-3 border bg-white" style={{ borderColor: HAIRLINE }}>
                <svg width="320" height="120" viewBox="0 0 320 120">
                  <path d="M 40 60 Q 100 15, 180 60 T 280 60" fill="none" stroke="rgba(168,130,30,0.15)" strokeWidth="3" />
                  {pacing > 1 && totalSelected > 0 && (
                    <motion.path
                      d="M 40 60 Q 100 15, 180 60 T 280 60"
                      fill="none"
                      stroke={status === "empowered" ? GREEN : GOLD}
                      strokeWidth="3"
                      strokeDasharray="260"
                      initial={{ strokeDashoffset: 260 }}
                      animate={{ strokeDashoffset: 260 - (opFluency / 100) * 260 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  <circle cx="40" cy="60" r="6" fill={GOLD} />
                  <circle cx="180" cy="60" r="6" fill={totalSelected >= 3 ? GOLD : "rgba(168,130,30,0.2)"} />
                  <circle cx="280" cy="60" r="6" fill={totalSelected >= 5 && opFluency > 50 ? GREEN : "rgba(168,130,30,0.2)"} />
                  <text x="40" y="90" fill={INK_SECONDARY} fontSize="9" fontWeight="bold" textAnchor="middle">Foundations</text>
                  <text x="180" y="90" fill={INK_SECONDARY} fontSize="9" fontWeight="bold" textAnchor="middle">Cross-Reference</text>
                  <text x="280" y="90" fill={INK_SECONDARY} fontSize="9" fontWeight="bold" textAnchor="middle">Fluency</text>
                </svg>
              </div>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Bibliographic Confidence (Lists Owned):</span>
                    <span style={{ color: GOLD }}>{bibConfidence}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                    <div className="h-full bg-amber-600" style={{ width: `${bibConfidence}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Operational Fluency (Live-Chart Action):</span>
                    <span style={{ color: opFluency > 50 ? GREEN : VERMILION }}>{opFluency}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                    <div className="h-full bg-emerald-700" style={{ width: `${opFluency}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t" style={{ borderColor: HAIRLINE }}>
              {alerts.map((a, i) => (
                <div key={i} className="mb-2 p-2 rounded bg-red-50 border border-red-200 text-[9px] text-red-800 flex items-start gap-1">
                  <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                  <span>{a}</span>
                </div>
              ))}
              <div
                className="p-3 rounded-lg flex items-start gap-2.5 text-[11px] leading-normal border"
                style={{
                  background: SURFACE_2,
                  borderColor: status === "empowered" ? `${GREEN}33` : `${VERMILION}33`,
                }}
              >
                {status === "empowered" ? (
                  <ShieldCheck size={15} color={GREEN} className="flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={15} color={VERMILION} className="flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block" style={{ color: status === "empowered" ? GREEN : VERMILION }}>
                    {status === "empowered" ? "Svadharma Compliant" : "Sequence Alert"}
                  </span>
                  <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{auditFeedback}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "example1" && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Example 1 context: Jaimini vs Parāśarī Sequence
            </span>
            <p className="m-0 text-xs leading-relaxed" style={{ color: INK_PRIMARY }}>
              A Tier-1 graduate considers: <em>&ldquo;Should I take up Jaimini next, or deepen my Parāśarī work?&rdquo;</em> Select an approach below to audit it based on the Sequence Principles of Section 4.8.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                id: "dispersed",
                title: "Dispersed-Attention Choice",
                text: "Take up Jaimini alongside Parāśarī, studying Jaimini Sūtras and Sanjay Rath's Crux in parallel before reaching working fluency in Parāśarī.",
                verdict: "Sequence Principle 3 Violation: Adding a second stream prematurely disperses focus, leading to shallow bibliographic acquaintance in both.",
                status: "dependent",
              },
              {
                id: "premature",
                title: "Premature Specialisation",
                text: "Declare Parāśarī 'done' after Tier 1 and immediately jump to Sārāvalī's advanced yoga chapters, without slow-reading BPHS Chapters 16-35.",
                verdict: "Sequence Principle 1 Violation: Advanced texts require foundational chart architecture. Reading Sārāvalī early results in rote recitation without understanding.",
                status: "neglect",
              },
              {
                id: "compliant",
                title: "Discipline-Compliant Path",
                text: "Complete BPHS Chapters 16-35 slowly, applying each yoga to 3-5 charts. Cross-reference with Bṛhat Jātaka. Start Jaimini only after 6-12 months of verified Parāśarī fluency.",
                verdict: "Svadharma Compliant: Principle 1 & 3 honored. Sequential learning builds robust internal mental models before adding advanced or secondary systems.",
                status: "empowered",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setEx1Choice(opt.id)}
                className="p-3 rounded-lg border text-left text-xs transition-all flex flex-col justify-between gap-3"
                style={{
                  background: ex1Choice === opt.id ? SURFACE_2 : SURFACE,
                  borderColor: ex1Choice === opt.id ? GOLD : HAIRLINE,
                }}
              >
                <div>
                  <span className="font-bold block mb-1 text-[11px]" style={{ color: GOLD }}>{opt.title}</span>
                  <p className="m-0 text-[10px] leading-relaxed" style={{ color: INK_SECONDARY }}>{opt.text}</p>
                </div>
                {ex1Choice === opt.id && (
                  <div className="p-2 rounded text-[10px] leading-normal font-semibold" style={{
                    background: opt.status === "empowered" ? `${GREEN}15` : `${VERMILION}15`,
                    color: opt.status === "empowered" ? GREEN : VERMILION,
                  }}>
                    {opt.verdict}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "example2" && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Example 2 context: Operating Svādhyāya in a Working Week
            </span>
            <p className="m-0 text-xs leading-relaxed" style={{ color: INK_PRIMARY }}>
              A practicing daivajña with a daily client load asks: <em>&ldquo;How do I actually do continuing education when my time is bounded?&rdquo;</em> Select a pacing framework to audit.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                id: "unimplemented",
                title: "Aspirational-but-Unimplemented",
                text: "Buy ten classical translations. Declare that you will 'read more' during spare moments. Fail to establish a scheduled slot. Six months later, zero texts have been opened.",
                verdict: "Aspiration without structure fails. Tapas (disciplined effort) is required to block time. Relying on random free moments is the default failure mode of busy practitioners.",
                status: "neglect",
              },
              {
                id: "disciplined",
                title: "Svādhyāya-as-Discipline Path",
                text: "Schedule exactly 1 hour, three mornings per week. Read 2-4 ślokas slowly, write brief summary notes in your own words, and apply the rules to one chart from your journal archive.",
                verdict: "Tapas and Svādhyāya operationalized. 3 hours/week of structured engagement compounds to 150 hours/year. This slow integration builds calibrated practitioner depth.",
                status: "empowered",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setEx2Choice(opt.id)}
                className="p-3.5 rounded-lg border text-left text-xs transition-all flex flex-col justify-between gap-3"
                style={{
                  background: ex2Choice === opt.id ? SURFACE_2 : SURFACE,
                  borderColor: ex2Choice === opt.id ? GOLD : HAIRLINE,
                }}
              >
                <div>
                  <span className="font-bold block mb-1 text-[11px]" style={{ color: GOLD }}>{opt.title}</span>
                  <p className="m-0 text-[10px] leading-relaxed" style={{ color: INK_SECONDARY }}>{opt.text}</p>
                </div>
                {ex2Choice === opt.id && (
                  <div className="p-2 rounded text-[10px] leading-normal font-semibold" style={{
                    background: opt.status === "empowered" ? `${GREEN}15` : `${VERMILION}15`,
                    color: opt.status === "empowered" ? GREEN : VERMILION,
                  }}>
                    {opt.verdict}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "example3" && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Example 3 context: Honest Citation Audit
            </span>
            <p className="m-0 text-xs leading-relaxed" style={{ color: INK_PRIMARY }}>
              A practitioner references <em>Pañca-Mahā-Puruṣa-yoga</em> in a consultation summary. Select a citation approach to audit their honest-attribution discipline.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                id: "misattribution",
                title: "Low-effort Misattribution",
                text: "'Pañca-Mahā-Puruṣa-yoga is described by Sanjay Rath in Crux of Vedic Astrology as...'",
                verdict: "Misattribution: Pañca-Mahā-Puruṣa-yoga is in BPHS Chapter 36. Citing a modern commentator as the source of a classical concept violates honest-attribution.",
                status: "dependent",
              },
              {
                id: "overbroad",
                title: "Over-broad Attribution",
                text: "'Pañca-Mahā-Puruṣa-yoga is an ancient Vedic concept...'",
                verdict: "Vague & unhelpful: Fails to provide chapter, verse, or translator detail. Renders the citation impossible to verify or cross-reference.",
                status: "neglect",
              },
              {
                id: "compliant",
                title: "Honest-Attribution Compliant",
                text: "'Pañca-Mahā-Puruṣa-yoga, treated foundationally in BPHS Chapter 36 (Santhanam trans., Vol. 2) and Bṛhat Jātaka 12.1-2 (Bhat trans.), is elaborated by Sanjay Rath in Crux...'",
                verdict: "Perfect: Names the primary classical source, chapter/verse, translation editions (translators are interpreters), and modern commentator correctly.",
                status: "empowered",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setEx3Choice(opt.id)}
                className="p-3 rounded-lg border text-left text-xs transition-all flex flex-col justify-between gap-3"
                style={{
                  background: ex3Choice === opt.id ? SURFACE_2 : SURFACE,
                  borderColor: ex3Choice === opt.id ? GOLD : HAIRLINE,
                }}
              >
                <div>
                  <span className="font-bold block mb-1 text-[11px]" style={{ color: GOLD }}>{opt.title}</span>
                  <p className="m-0 text-[10px] leading-relaxed" style={{ color: INK_SECONDARY }}>{opt.text}</p>
                </div>
                {ex3Choice === opt.id && (
                  <div className="p-2 rounded text-[10px] leading-normal font-semibold" style={{
                    background: opt.status === "empowered" ? `${GREEN}15` : `${VERMILION}15`,
                    color: opt.status === "empowered" ? GREEN : VERMILION,
                  }}>
                    {opt.verdict}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
