"use client";

/**
 * Jaimini Module Closure Map -- Lesson 17.7.5 Interactive
 *
 * Seven-chapter arc visualiser, pipeline tracer, Tier-1-vs-Tier-2 map,
 * and discipline checklist for the Module 17 capstone.
 */

import { useState } from "react";
import { IAST } from "../../chrome/typography";
import {
  CHAPTER_ARC,
  PIPELINE_QUESTIONS,
  TIER_COMPARISON,
  DISCIPLINES,
} from "./data";
import {
  BookOpen,
  Target,
  Shield,
  Eye,
  MapPin,
  Home,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  GraduationCap,
} from "lucide-react";

/* --- Design tokens --- */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#3B82F6";

const CHAPTER_ICONS = [BookOpen, Target, Shield, MapPin, Eye, Clock, Sparkles];

export function JaiminiModuleClosureMap() {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [activeQuestion, setActiveQuestion] = useState(0);

  const question = PIPELINE_QUESTIONS[activeQuestion];
  const highlightedChapters = new Set(question.steps.map((s) => s.chapter));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <GraduationCap size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Jaimini</IAST> Module 17 Closure Map
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            The seven-chapter arc, the unifying idea, and what comes next.
          </p>
        </div>
      </div>

      {/* Unifying idea banner */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
        <div className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>The unifying idea</div>
        <div className="text-sm" style={{ color: INK_SECONDARY }}>
          <strong>Jaimini is a sign-centric, degree-ranked-kāraka, soul-focused system</strong> parallel to Parāśara&apos;s planet-centric approach.
          Same zodiac and grahas -- different reading point.
        </div>
      </div>

      {/* 7-chapter arc */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>The seven-chapter arc</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {CHAPTER_ARC.map((ch, i) => {
            const Icon = CHAPTER_ICONS[i];
            const isActive = activeChapter === ch.num;
            const isHighlighted = highlightedChapters.has(ch.num);
            return (
              <button
                key={ch.num}
                onClick={() => setActiveChapter(isActive ? null : ch.num)}
                className="rounded-lg p-3 text-center space-y-1.5 transition-colors"
                style={{
                  background: isActive ? `${ch.color}15` : isHighlighted ? `${ch.color}08` : SURFACE,
                  border: `1.5px solid ${isActive ? ch.color : isHighlighted ? `${ch.color}66` : HAIRLINE}`,
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <Icon size={14} style={{ color: ch.color }} />
                  {isHighlighted && activeQuestion >= 0 && (
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: `${GREEN}22`, color: GREEN }}>
                      {question.steps.filter((s) => s.chapter === ch.num).length}
                    </span>
                  )}
                </div>
                <div className="text-[10px] font-bold leading-tight" style={{ color: isActive ? ch.color : INK_PRIMARY }}>Ch {ch.num}</div>
                <div className="text-[10px] leading-tight" style={{ color: INK_SECONDARY }}>{ch.title}</div>
              </button>
            );
          })}
        </div>

        {/* Chapter detail panel */}
        {activeChapter !== null && (
          <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${CHAPTER_ARC[activeChapter - 1].color}` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: CHAPTER_ARC[activeChapter - 1].color }}>
                  Chapter {activeChapter}: {CHAPTER_ARC[activeChapter - 1].title}
                </span>
                <span className="text-xs" style={{ color: INK_MUTED }}>({CHAPTER_ARC[activeChapter - 1].lessons})</span>
              </div>
              <button onClick={() => setActiveChapter(null)} className="text-xs" style={{ color: INK_MUTED }}>
                <ChevronUp size={14} />
              </button>
            </div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>{CHAPTER_ARC[activeChapter - 1].establishes}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-md p-2" style={{ border: `1px solid ${HAIRLINE}` }}>
                <div className="text-[10px] font-bold mb-1" style={{ color: INK_MUTED }}>Consumes</div>
                {CHAPTER_ARC[activeChapter - 1].consumes.length === 0 ? (
                  <div className="text-xs" style={{ color: INK_MUTED }}>Foundation chapter -- nothing before it.</div>
                ) : (
                  <ul className="space-y-0.5">
                    {CHAPTER_ARC[activeChapter - 1].consumes.map((c, i) => (
                      <li key={i} className="text-xs" style={{ color: INK_SECONDARY }}>• {c}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-md p-2" style={{ border: `1px solid ${HAIRLINE}` }}>
                <div className="text-[10px] font-bold mb-1" style={{ color: INK_MUTED }}>Produces</div>
                <ul className="space-y-0.5">
                  {CHAPTER_ARC[activeChapter - 1].produces.map((p, i) => (
                    <li key={i} className="text-xs" style={{ color: INK_SECONDARY }}>• {p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pipeline tracer */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target size={16} style={{ color: BLUE }} />
          <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Trace a question through the pipeline</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PIPELINE_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => setActiveQuestion(i)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
              style={{
                background: activeQuestion === i ? "rgba(59,130,246,0.08)" : "transparent",
                border: `1.5px solid ${activeQuestion === i ? BLUE : HAIRLINE}`,
                color: activeQuestion === i ? BLUE : INK_SECONDARY,
              }}
            >
              {q.label}
            </button>
          ))}
        </div>
        <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${BLUE}` }}>
          <div className="text-xs font-bold" style={{ color: BLUE }}>&quot;{question.label}&quot;</div>
          <div className="space-y-2">
            {question.steps.map((s, i) => {
              const ch = CHAPTER_ARC.find((c) => c.num === s.chapter)!;
              return (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ background: `${ch.color}18`, color: ch.color }}>
                    {s.chapter}
                  </div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: ch.color }}>{ch.title}</div>
                    <div className="text-xs" style={{ color: INK_SECONDARY }}>{s.action}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: INK_MUTED }}>
            <span>Chapters used:</span>
            {Array.from(new Set(question.steps.map((s) => s.chapter))).sort((a, b) => a - b).map((n) => {
              const ch = CHAPTER_ARC.find((c) => c.num === n)!;
              return (
                <span key={n} className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: `${ch.color}12`, color: ch.color }}>
                  {n}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tier 1 vs Tier 2 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <GraduationCap size={16} style={{ color: GREEN }} />
          <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Tier 1 covers vs Tier 2 develops</span>
        </div>
        <div className="text-xs" style={{ color: INK_MUTED }}>
          Mastery-not-completion: Tier 1 gives the foundation and introductory practice; Tier 2 develops advanced application.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TIER_COMPARISON.map((row, i) => (
            <div key={i} className="rounded-lg p-3 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <div className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>{row.area}</div>
              <div className="rounded-md p-2" style={{ background: "rgba(59,130,246,0.05)", border: `1px solid ${HAIRLINE}` }}>
                <div className="text-[10px] font-bold" style={{ color: BLUE }}>Tier 1</div>
                <div className="text-xs" style={{ color: INK_SECONDARY }}>{row.tier1}</div>
              </div>
              <div className="rounded-md p-2" style={{ background: "rgba(47,125,85,0.05)", border: `1px solid ${HAIRLINE}` }}>
                <div className="text-[10px] font-bold" style={{ color: GREEN }}>Tier 2</div>
                <div className="text-xs" style={{ color: INK_SECONDARY }}>{row.tier2}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three disciplines */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} style={{ color: GREEN }} />
          <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Disciplines to carry forward</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DISCIPLINES.map((d, i) => (
            <div key={i} className="rounded-lg p-3 space-y-1.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${GREEN}` }}>
              <div className="text-xs font-bold" style={{ color: GREEN }}>{d.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{d.text}</div>
              <div className="text-[10px]" style={{ color: INK_MUTED }}>Anchored in: {d.lessons}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: VERMILION }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common mistakes at module closure</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Treating Tier-1 as complete mastery", text: "Tier 1 gives foundation + introductory cara-daśā. Advanced daśās, deeper kārakāṁśa, and rāja-yogas are Tier-2 work. Completion is a licence to practise." },
            { title: "Conflating Jaimini with Parāśara", text: "Jaimini reads sign-to-sign, degree-ranked kārakas, and sign-advancing daśā. When in the Jaimini layer, ask 'which sign?' not 'which planet rules this house?'" },
            { title: "One-interpreter dogmatism", text: "The sūtra is terse; Raman, Rath, and Rao differ on kāraka count and daśā details. Name your reconstruction so it can be checked." },
            { title: "Treating Jaimini as a rival to Parāśara", text: "They are parallel lenses on one chart, not competitors. Use one per judgement, or read both side-by-side, but never retire one for the other." },
            { title: "Skipping cross-validation", text: "Both-layers cross-validation is not extra work -- it is the condition under which the reading earns trust. Divergence is information, not noise." },
            { title: "Mistaking Module 17 for the Tier-1 capstone", text: "Module 17 is the second stream-overview complete (after KP). More stream modules follow -- next is Module 18 (Lal Kitab)." },
          ].map((m, i) => (
            <div key={i} className="rounded-lg p-3 space-y-1.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${VERMILION}` }}>
              <div className="text-xs font-bold" style={{ color: VERMILION }}>{m.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Forward map */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
        <div className="flex items-center gap-2">
          <ArrowRight size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-bold" style={{ color: GOLD_ACCENT }}>Module 17 is COMPLETE</span>
        </div>
        <div className="text-xs" style={{ color: INK_SECONDARY }}>
          You now own the Jaimini pipeline: cara-kārakas → Kārakāṁśa → rāśi-dṛṣṭi → argala → padas → cara-daśā.
          The next stream is <strong>Module 18 — Lal Kitab Overview</strong>.
        </div>
      </div>
    </div>
  );
}
