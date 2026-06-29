"use client";

import { useMemo, useState } from "react";
import { BookOpenCheck, ClipboardCheck, Edit3, RotateCcw, ShieldCheck } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from "../../chrome/typography";
import {
  CHAPTER_SYNTHESIS,
  CONSULTATION_TESTS,
  DEFAULT_STATEMENT,
  DO_NO_HARM,
  STATEMENT_FIELDS,
  type StatementFieldKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted, #8B8273)";
const GOLD = ink.goldAccent;
const GOLD_DEEP = "var(--gl-gold-deep, #9C7A2F)";
const GOLD_LIGHT = "var(--gl-gold-light, #FFFDF6)";
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function splitChapterTitle(title: string): string[] {
  if (!title.includes(" ")) return [title];
  const words = title.split(" ");
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

function ModuleArcSvg({ activeChapter }: { activeChapter: number }) {
  const points = CHAPTER_SYNTHESIS.map((chapter, index) => {
    const angle = -140 + index * 70;
    const radians = (angle * Math.PI) / 180;
    return {
      chapter,
      x: 380 + Math.cos(radians) * 220,
      y: 210 + Math.sin(radians) * 95,
    };
  });
  return (
    <section className="w-full min-w-0 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 400" className="h-auto w-full min-w-[520px]" role="img" aria-label="Module 20 five chapter synthesis arc">
        <rect x="20" y="20" width="720" height="360" rx="22" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="48" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          FIVE CHAPTERS BECOME ONE ETHICAL FRAMEWORK
        </text>
        <path d="M160 230 C250 110, 510 110, 600 230" fill="none" stroke={HAIRLINE} strokeWidth="4" strokeDasharray="10 12" />
        <circle cx="380" cy="188" r="78" fill={SURFACE} stroke={GOLD} strokeWidth="4" />
        <text x="380" y="164" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>M20</text>
        <text x="380" y="198" textAnchor="middle" fill={INK_PRIMARY} fontSize="28" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>discipline</text>
        <text x="380" y="224" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>write it, test it, hold it</text>
        {points.map(({ chapter, x, y }) => {
          const active = chapter.chapter === activeChapter;
          const color = active ? GREEN : GOLD;
          const titleLines = splitChapterTitle(chapter.title);
          return (
            <g key={chapter.chapter}>
              <circle cx={x} cy={y} r={active ? 42 : 36} fill={wash(color, active ? "16" : "0D")} stroke={color} strokeWidth={active ? 3 : 2} />
              <text x={x} y={y - 10} textAnchor="middle" fill={color} fontSize="20" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{chapter.chapter}</text>
              <text x={x} y={y + (titleLines.length === 1 ? 12 : 6)} textAnchor="middle" fill={INK_PRIMARY} fontSize="9" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {titleLines.map((line, index) => (
                  <tspan key={line} x={x} dy={index === 0 ? 0 : 12}>{line}</tspan>
                ))}
              </text>
            </g>
          );
        })}
        <rect x="120" y="350" width="520" height="28" rx="14" fill={SURFACE} stroke={VERMILION} />
        <text x="380" y="369" textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          No single factor, no fear, no absolute guarantees, supplementary lookup positioning.
        </text>
      </svg>
    </section>
  );
}

export function NadiDisciplineStatementBuilder() {
  const [activeChapter, setActiveChapter] = useState(1);
  const [statement, setStatement] = useState(DEFAULT_STATEMENT);
  const [checked, setChecked] = useState<string[]>(["No single-factor major life decisions.", "No fear-induction or threat of calamity."]);
  const [activeTest, setActiveTest] = useState(CONSULTATION_TESTS[0].id);
  const chapter = CHAPTER_SYNTHESIS.find((item) => item.chapter === activeChapter) ?? CHAPTER_SYNTHESIS[0];
  const test = CONSULTATION_TESTS.find((item) => item.id === activeTest) ?? CONSULTATION_TESTS[0];

  const draft = useMemo(
    () =>
      `MY NĀḌĪ PRACTITIONER DISCIPLINE\n\nSCOPE. ${statement.scope}\n\nDISCLOSURES. ${statement.disclosure}\n\nGATING PROCESS. ${statement.process}\n\nDO-NO-HARM. ${statement.doharm}\n\nSUPPLEMENTARY PLACE. ${statement.place}`,
    [statement],
  );

  const reset = () => {
    setActiveChapter(1);
    setStatement(DEFAULT_STATEMENT);
    setChecked(["No single-factor major life decisions.", "No fear-induction or threat of calamity."]);
    setActiveTest(CONSULTATION_TESTS[0].id);
  };

  const updateField = (key: StatementFieldKey, value: string) => {
    setStatement((current) => ({ ...current, [key]: value }));
  };

  const toggleCheck = (item: string) => {
    setChecked((current) =>
      current.includes(item) ? current.filter((x) => x !== item) : [...current, item],
    );
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="nadi-discipline-statement-builder"
      style={{
        maxWidth: "none",
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Module 20 closure synthesis dojo
          </p>
          <h2 className="mt-1 text-2xl font-semibold animate-fade-in" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Build your Nāḍī advisory discipline
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Review the five-chapter arc, check the do-no-harm floor, and write your signed discipline statement.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="grid min-w-0 gap-4">
          <ModuleArcSvg activeChapter={activeChapter} />
          <div className="grid min-w-0 gap-2 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {CHAPTER_SYNTHESIS.map((item) => (
              <button key={item.chapter} type="button" onClick={() => setActiveChapter(item.chapter)} className="min-w-0 rounded-xl p-3 text-left transition-all hover:scale-[1.02]" style={{ background: item.chapter === activeChapter ? wash(GREEN, "12") : SURFACE, border: `1px solid ${item.chapter === activeChapter ? GREEN : HAIRLINE}` }}>
                <span className="block text-xs font-black uppercase" style={{ color: item.chapter === activeChapter ? GREEN : GOLD }}>Chapter {item.chapter}</span>
                <span className="mt-1 block break-words text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.title}</span>
              </button>
            ))}
          </div>

          <div className="rounded-xl p-4 transition-all" style={{ background: wash(GOLD, "08"), border: `1px solid ${HAIRLINE}` }}>
            <h4 className="m-0 text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>Chapter {chapter.chapter} Synthesis</h4>
            <p className="mt-2 m-0 text-sm font-semibold leading-relaxed" style={{ color: INK_PRIMARY }}>
              {chapter.gives}
            </p>
            <div className="mt-3 flex items-start gap-2 rounded-lg p-2.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <span className="text-xs font-bold uppercase text-amber-800" style={{ letterSpacing: "0.05em" }}>PRACTICAL RULE:</span>
              <p className="m-0 text-xs italic font-medium" style={{ color: INK_SECONDARY }}>{chapter.practiceCue}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Do-No-Harm Checklist */}
          <div className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} color={GREEN} />
              <h4 className="m-0 text-xs font-bold uppercase tracking-wider" style={{ color: GREEN }}>Do-No-Harm floor</h4>
            </div>
            <p className="mt-1.5 m-0 text-xs" style={{ color: INK_SECONDARY }}>Select the core boundaries you commit to uphold:</p>
            <div className="mt-3 flex flex-col gap-2">
              {DO_NO_HARM.map((item) => {
                const active = checked.includes(item);
                return (
                  <button key={item} type="button" onClick={() => toggleCheck(item)} className="flex w-full items-start gap-3 rounded-lg p-2.5 text-left text-xs transition-all hover:bg-[rgba(47,125,82,0.04)]" style={{ background: active ? wash(GREEN, "0B") : SURFACE_2, border: `1px solid ${active ? GREEN : HAIRLINE}` }}>
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border" style={{ borderColor: active ? GREEN : GOLD, background: active ? GREEN : SURFACE }}>
                      {active && <span className="text-[10px] font-black text-white">✓</span>}
                    </div>
                    <span style={{ color: active ? INK_PRIMARY : INK_SECONDARY, fontWeight: active ? 600 : 500 }}>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verification Challenge */}
          <div className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <BookOpenCheck size={18} color={BLUE} />
              <h4 className="m-0 text-xs font-bold uppercase tracking-wider" style={{ color: BLUE }}>Case scenario tests</h4>
            </div>
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
              {CONSULTATION_TESTS.map((item) => (
                <button key={item.id} type="button" onClick={() => setActiveTest(item.id)} className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all" style={{ background: item.id === activeTest ? BLUE : SURFACE_2, color: item.id === activeTest ? "#fff" : INK_SECONDARY, border: `1px solid ${item.id === activeTest ? BLUE : HAIRLINE}` }}>
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-3 m-0 text-xs font-bold leading-normal" style={{ color: INK_PRIMARY }}>"{test.question}"</p>
            <div className="mt-3 rounded-lg p-2.5 bg-sky-50/50" style={{ background: wash(BLUE, "08"), border: `1px solid ${wash(BLUE, "25")}` }}>
              <span className="text-[10px] font-black uppercase" style={{ color: BLUE }}>Fields triggered:</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {test.tests.map((key) => (
                  <span key={key} className="rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-white border tracking-wider" style={{ borderColor: HAIRLINE, color: GOLD }}>
                    {key}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editor & Drafting Panel */}
      <section className="mb-4 grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <Edit3 size={18} color={GOLD} />
            <h4 className="m-0 text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>Draft your discipline statement</h4>
          </div>
          <div className="flex flex-col gap-3">
            {STATEMENT_FIELDS.map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor={`field-${field.key}`} className="text-xs font-extrabold uppercase tracking-wide" style={{ color: INK_PRIMARY }}>{field.label}</label>
                  <button type="button" onClick={() => updateField(field.key, field.sample)} className="text-[10px] font-bold text-amber-800 hover:underline">Insert template sample</button>
                </div>
                <textarea
                  id={`field-${field.key}`}
                  rows={2}
                  value={statement[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.prompt}
                  className="w-full rounded-lg p-2 text-xs leading-normal transition-all focus:outline-none focus:ring-1"
                  style={{
                    background: SURFACE_2,
                    border: `1px solid ${HAIRLINE}`,
                    color: INK_PRIMARY,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Signed Pledge Card */}
        <div className="flex flex-col rounded-xl p-5 relative bg-[radial-gradient(ellipse_at_top,_rgba(254,250,234,0.6)_0%,_rgba(240,224,186,0.3)_100%)]" style={{ border: `2px solid ${GOLD}`, boxShadow: "0 8px 30px rgba(156,122,47,0.12)" }}>
          <div className="absolute top-4 right-4 pointer-events-none opacity-20">
            <svg viewBox="0 0 100 100" width="80" height="80">
              <circle cx="50" cy="50" r="45" fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="3 3" />
              <path d="M25,50 C25,25 75,25 75,50 C75,75 25,75 25,50" fill="none" stroke={GOLD} strokeWidth="3" />
            </svg>
          </div>
          
          <div className="text-center pb-4 border-b border-dashed" style={{ borderColor: HAIRLINE }}>
            <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: GOLD }}>Commitment Covenant</span>
            <h3 className="m-0 mt-1 text-xl font-bold italic" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              Nāḍī Advisory Discipline Statement
            </h3>
          </div>

          <div className="flex-1 mt-4 overflow-y-auto pr-1 text-xs space-y-4 max-h-[380px] leading-relaxed" style={{ color: INK_PRIMARY, fontFamily: "var(--font-serif), serif" }}>
            <div>
              <span className="font-extrabold uppercase text-[9px] block mb-0.5 tracking-wider" style={{ color: GOLD }}>I. Scope Boundaries</span>
              <p className="m-0 italic">"{statement.scope}"</p>
            </div>
            <div>
              <span className="font-extrabold uppercase text-[9px] block mb-0.5 tracking-wider" style={{ color: GOLD }}>II. Client Disclosures</span>
              <p className="m-0 italic">"{statement.disclosure}"</p>
            </div>
            <div>
              <span className="font-extrabold uppercase text-[9px] block mb-0.5 tracking-wider" style={{ color: GOLD }}>III. Gating Safeguards</span>
              <p className="m-0 italic">"{statement.process}"</p>
            </div>
            <div>
              <span className="font-extrabold uppercase text-[9px] block mb-0.5 tracking-wider" style={{ color: GOLD }}>IV. Do-No-Harm Pledge</span>
              <p className="m-0 italic">"{statement.doharm}"</p>
            </div>
            <div>
              <span className="font-extrabold uppercase text-[9px] block mb-0.5 tracking-wider" style={{ color: GOLD }}>V. Supplementary Status</span>
              <p className="m-0 italic">"{statement.place}"</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-dashed flex items-end justify-between" style={{ borderColor: HAIRLINE }}>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider block" style={{ color: INK_SECONDARY }}>PRACTITIONER SIGNATURE:</span>
              <span className="text-lg font-bold italic block mt-1" style={{ color: GOLD_DEEP, fontFamily: "var(--font-cormorant), serif" }}>Grahvani Seeker</span>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(draft);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity"
              style={{ background: GREEN }}
            >
              <ClipboardCheck size={14} />
              Copy statement draft
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
