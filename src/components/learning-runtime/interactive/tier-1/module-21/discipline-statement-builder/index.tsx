"use client";

import { useMemo, useState } from "react";
import { BookOpenCheck, ClipboardCheck, Edit3, RotateCcw, ShieldCheck } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
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
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;
const INDIGO = "#2C2C3E";

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
    const angle = -150 + index * 60;
    const radians = (angle * Math.PI) / 180;
    return {
      chapter,
      x: 380 + Math.cos(radians) * 260,
      y: 240 + Math.sin(radians) * 160,
    };
  });
  return (
    <section className="w-full min-w-0 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 460" className="h-auto w-full min-w-[520px]" role="img" aria-label="Module 21 six chapter synthesis arc">
        <rect x="20" y="20" width="720" height="420" rx="22" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="48" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          SIX CHAPTERS BECOME ONE DISCIPLINE
        </text>
        <path d="M155 320 C250 80, 510 80, 605 320" fill="none" stroke={HAIRLINE} strokeWidth="4" strokeDasharray="10 12" />
        <circle cx="380" cy="230" r="95" fill={SURFACE} stroke={GOLD} strokeWidth="4" />
        <text x="380" y="190" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>M21</text>
        <text x="380" y="222" textAnchor="middle" fill={INK_PRIMARY} fontSize="30" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>discipline</text>
        <text x="380" y="250" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          <tspan x="380" dy="0">write it, test it,</tspan>
          <tspan x="380" dy="16">practise it</tspan>
        </text>
        {points.map(({ chapter, x, y }) => {
          const active = chapter.chapter === activeChapter;
          const color = active ? GREEN : GOLD;
          const titleLines = splitChapterTitle(chapter.title);
          return (
            <g key={chapter.chapter}>
              <circle cx={x} cy={y} r={active ? 44 : 38} fill={wash(color, active ? "16" : "0D")} stroke={color} strokeWidth={active ? 3 : 2} />
              <text x={x} y={y - 12} textAnchor="middle" fill={color} fontSize="20" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{chapter.chapter}</text>
              <text x={x} y={y + (titleLines.length === 1 ? 14 : 8)} textAnchor="middle" fill={INK_PRIMARY} fontSize="9" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {titleLines.map((line, index) => (
                  <tspan key={line} x={x} dy={index === 0 ? 0 : 12}>{line}</tspan>
                ))}
              </text>
            </g>
          );
        })}
        <rect x="120" y="410" width="520" height="28" rx="14" fill={SURFACE} stroke={VERMILION} />
        <text x="380" y="429" textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          No single factor, no fear, no guarantees, no numerology-only major action.
        </text>
      </svg>
    </section>
  );
}

export function DisciplineStatementBuilder() {
  const [activeChapter, setActiveChapter] = useState(1);
  const [statement, setStatement] = useState(DEFAULT_STATEMENT);
  const [checked, setChecked] = useState<string[]>(["No single-factor causation.", "No fear-induction."]);
  const [activeTest, setActiveTest] = useState(CONSULTATION_TESTS[0].id);
  const chapter = CHAPTER_SYNTHESIS.find((item) => item.chapter === activeChapter) ?? CHAPTER_SYNTHESIS[0];
  const test = CONSULTATION_TESTS.find((item) => item.id === activeTest) ?? CONSULTATION_TESTS[0];

  const draft = useMemo(
    () =>
      `MY NUMEROLOGY DISCIPLINE\n\nSCOPE. ${statement.scope}\n\nSYSTEM. ${statement.system}\n\nHONESTY. ${statement.honesty}\n\nETHICS SCREEN. ${statement.ethics}\n\nPLACE. ${statement.place}`,
    [statement],
  );

  const reset = () => {
    setActiveChapter(1);
    setStatement(DEFAULT_STATEMENT);
    setChecked(["No single-factor causation.", "No fear-induction."]);
    setActiveTest(CONSULTATION_TESTS[0].id);
  };

  const updateField = (key: StatementFieldKey, value: string) => {
    setStatement((current) => ({ ...current, [key]: value }));
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="discipline-statement-builder"
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
            M21 closure worksheet
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Build your numerology practitioner discipline
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Review the six-chapter arc, check the do-no-harm floor, and write the five-field statement in your own voice.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="grid min-w-0 gap-4">
          <ModuleArcSvg activeChapter={activeChapter} />
          <div className="grid min-w-0 gap-2 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {CHAPTER_SYNTHESIS.map((item) => (
              <button key={item.chapter} type="button" onClick={() => setActiveChapter(item.chapter)} className="min-w-0 rounded-xl p-3 text-left" style={{ background: item.chapter === activeChapter ? wash(GREEN, "12") : SURFACE, border: `1px solid ${item.chapter === activeChapter ? GREEN : HAIRLINE}` }}>
                <span className="block text-xs font-black uppercase" style={{ color: item.chapter === activeChapter ? GREEN : GOLD }}>Chapter {item.chapter}</span>
                <span className="mt-1 block break-words text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "10"), border: `1px solid ${GREEN}` }}>
            <div className="mb-2 flex items-center gap-2">
              <BookOpenCheck size={17} color={GREEN} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Selected chapter</p>
            </div>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{chapter.chapter}. {chapter.title}</IAST>
            </h3>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{chapter.gives}</p>
            <p className="mb-0 mt-2 text-sm font-bold" style={{ color: GREEN }}>{chapter.practiceCue}</p>
          </article>
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Do-no-harm floor</p>
            </div>
            <div className="grid min-w-0 gap-2">
              {DO_NO_HARM.map((item) => {
                const active = checked.includes(item);
                return (
                  <button key={item} type="button" onClick={() => setChecked((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]))} className="min-w-0 rounded-lg px-3 py-2 text-left text-sm font-bold" style={{ background: active ? wash(GOLD, "14") : SURFACE_2, border: `1px solid ${active ? GOLD : HAIRLINE}`, color: active ? GOLD : INK_PRIMARY }}>
                    {active ? "✓ " : ""}{item}
                  </button>
                );
              })}
            </div>
          </article>
        </aside>
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          {STATEMENT_FIELDS.map((field) => (
            <article key={field.key} className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-3 flex items-center gap-2">
                <Edit3 size={17} color={GOLD} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{field.label}</p>
              </div>
              <p className="mb-3 text-sm" style={{ color: INK_SECONDARY }}>{field.prompt}</p>
              <textarea
                value={statement[field.key]}
                onChange={(event) => updateField(field.key, event.target.value)}
                className="min-h-24 w-full min-w-0 resize-y rounded-xl p-3 text-sm leading-relaxed"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              />
            </article>
          ))}
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(BLUE, "0F"), border: `1px solid ${BLUE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <ClipboardCheck size={17} color={BLUE} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Live statement</p>
            </div>
            <pre className="m-0 whitespace-pre-wrap break-words rounded-xl p-3 text-sm leading-relaxed" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontFamily: "var(--font-sans), sans-serif" }}>
              {draft}
            </pre>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Test against consultations</p>
            <div className="mt-3 grid min-w-0 gap-2">
              {CONSULTATION_TESTS.map((item) => (
                <button key={item.id} type="button" onClick={() => setActiveTest(item.id)} className="min-w-0 rounded-lg px-3 py-2 text-left text-sm font-bold" style={{ background: activeTest === item.id ? wash(GREEN, "12") : SURFACE_2, border: `1px solid ${activeTest === item.id ? GREEN : HAIRLINE}`, color: activeTest === item.id ? GREEN : INK_PRIMARY }}>
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mb-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>{test.question}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {test.tests.map((key) => {
                const field = STATEMENT_FIELDS.find((item) => item.key === key);
                return (
                  <span key={key} className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: wash(GOLD, "12"), border: `1px solid ${HAIRLINE}`, color: GOLD }}>
                    {field?.label}
                  </span>
                );
              })}
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Closure guard</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              Written discipline is the point: without it, the module remains knowledge. With it, the learner has a rule they can practise from.
            </p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(INDIGO, "08"), border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Milestone</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              Module 21 closes numerology literacy; it does not replace the chart, muhurta, vastu, or the Tier-1 ethics capstone.
            </p>
          </article>
        </aside>
      </section>
    </div>
  );
}
