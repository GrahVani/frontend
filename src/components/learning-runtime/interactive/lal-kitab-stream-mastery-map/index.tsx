"use client";

import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Compass, GitBranch, Map, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { CHAPTER_ARC, DISCIPLINES, PIPELINE_STEPS, STREAMS, getChapter, type ChapterId, type DisciplineId, type PipelineStepId, type StreamId } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function boundaryLabel(boundary: "read" | "recognise" | "defer") {
  if (boundary === "read") return "Read";
  if (boundary === "recognise") return "Recognise";
  return "Defer prescription";
}

function boundaryColor(boundary: "read" | "recognise" | "defer") {
  if (boundary === "read") return GREEN;
  if (boundary === "recognise") return BLUE;
  return VERMILION;
}

function MasteryArcSvg({ selectedChapterId, selectedStepId }: { selectedChapterId: ChapterId; selectedStepId: PipelineStepId }) {
  const selectedStep = PIPELINE_STEPS.find((step) => step.id === selectedStepId) ?? PIPELINE_STEPS[0];
  const stepChapter = getChapter(selectedStep.chapterId);
  const selectedIndex = CHAPTER_ARC.findIndex((chapter) => chapter.id === selectedChapterId);
  const stepIndex = PIPELINE_STEPS.findIndex((step) => step.id === selectedStepId);
  const chapterPoints = [
    { x: 122, y: 120 },
    { x: 226, y: 82 },
    { x: 350, y: 84 },
    { x: 474, y: 82 },
    { x: 578, y: 120 },
    { x: 350, y: 258 },
  ];

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 360" className="h-auto w-full min-w-0" role="img" aria-label="Module 18 mastery arc and Lal Kitab pipeline">
        <rect x="20" y="20" width="720" height="320" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="38" textAnchor="middle" fill={GOLD} fontSize="14" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          MODULE 18 CLOSURE
        </text>
        <text x="380" y="55" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" letterSpacing="0.6" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          ONE STREAM · SIX CHAPTERS · ONE ETHICAL STOP LINE
        </text>

        <path d="M122 120 C210 36 490 36 578 120" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />
        <path d="M122 120 C190 288 510 288 578 120" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />
        <path d="M226 82 L350 258 L474 82" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />

        <circle cx="350" cy="152" r="52" fill={wash(stepChapter.color, "12")} stroke={stepChapter.color} strokeWidth="2.5" />
        <text x="350" y="134" textAnchor="middle" fill={stepChapter.color} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {selectedStep.label.toUpperCase()}
        </text>
        <text x="350" y="160" textAnchor="middle" fill={INK_PRIMARY} fontSize="24" fontWeight="700" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          Ch {stepChapter.chapter}
        </text>
        <text x="350" y="180" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {boundaryLabel(selectedStep.boundary)}
        </text>

        {CHAPTER_ARC.map((chapter, index) => {
          const point = chapterPoints[index];
          const active = chapter.id === selectedChapterId || chapter.id === selectedStep.chapterId;
          return (
            <g key={chapter.id}>
              <circle cx={point.x} cy={point.y} r={active ? 42 : 34} fill={active ? wash(chapter.color, "18") : SURFACE} stroke={active ? chapter.color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
              <text x={point.x} y={point.y - 8} textAnchor="middle" fill={active ? chapter.color : INK_MUTED} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                Ch {chapter.chapter}
              </text>
              <text x={point.x} y={point.y + 10} textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {chapter.shortTitle}
              </text>
            </g>
          );
        })}

        <g>
          {PIPELINE_STEPS.map((step, index) => {
            const x = 118 + index * 92;
            const active = step.id === selectedStepId;
            const color = boundaryColor(step.boundary);
            return (
              <g key={step.id}>
                <rect x={x - 42} y="310" width="84" height="28" rx="14" fill={active ? wash(color, "16") : SURFACE} stroke={active ? color : HAIRLINE} />
                <text x={x} y="329" textAnchor="middle" fill={active ? color : INK_MUTED} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                  {index + 1}. {step.label}
                </text>
              </g>
            );
          })}
          <text x="118" y="298" fill={GOLD} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            Pipeline trace
          </text>
          <text x="646" y="298" textAnchor="end" fill={INK_MUTED} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            selected step {stepIndex + 1} / {PIPELINE_STEPS.length}
          </text>
        </g>

        <rect x="545" y="240" width="150" height="28" rx="14" fill={wash(GOLD, "10")} stroke={GOLD} />
        <text x="620" y="259" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          18 of 24 Tier-1 modules
        </text>
        <text x="95" y="90" fill={INK_MUTED} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          selected chapter {selectedIndex + 1} / 6
        </text>
      </svg>
    </section>
  );
}

export function LalKitabStreamMasteryMap() {
  const [chapterId, setChapterId] = useState<ChapterId>("upaya");
  const [disciplineId, setDisciplineId] = useState<DisciplineId>("honestRemedy");
  const [streamId, setStreamId] = useState<StreamId>("lalKitab");
  const [stepId, setStepId] = useState<PipelineStepId>("boundary");
  const chapter = getChapter(chapterId);
  const discipline = DISCIPLINES.find((item) => item.id === disciplineId) ?? DISCIPLINES[0];
  const stream = STREAMS.find((item) => item.id === streamId) ?? STREAMS[0];
  const step = PIPELINE_STEPS.find((item) => item.id === stepId) ?? PIPELINE_STEPS[0];
  const stepChapter = getChapter(step.chapterId);
  const completedChapters = useMemo(() => CHAPTER_ARC.filter((item) => item.chapter <= chapter.chapter).length, [chapter.chapter]);

  const reset = () => {
    setChapterId("upaya");
    setDisciplineId("honestRemedy");
    setStreamId("lalKitab");
    setStepId("boundary");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="lal-kitab-stream-mastery-map"
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
            Lal Kitab stream mastery map
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Close Module 18 by tracing the whole stream
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Rebuild the six-chapter arc, run one question through the Lal Kitab pipeline, and keep the Tier-1 stop line visible.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset closure
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {CHAPTER_ARC.map((item) => {
          const selected = item.id === chapterId;
          return (
            <button key={item.id} type="button" onClick={() => setChapterId(item.id)} className="min-w-0 rounded-xl p-3 text-left" style={{ background: selected ? wash(item.color, "12") : SURFACE, border: `1px solid ${selected ? item.color : HAIRLINE}` }}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-full px-2 py-1 text-xs font-black" style={{ background: wash(item.color, "12"), color: selected ? item.color : GOLD }}>
                  Ch {item.chapter}
                </span>
                {selected ? <CheckCircle2 size={17} color={item.color} /> : null}
              </div>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.shortTitle}</p>
              <Devanagari className="mt-1 block text-lg font-bold" style={{ color: selected ? item.color : INK_MUTED }}>{item.devanagari}</Devanagari>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <MasteryArcSvg selectedChapterId={chapterId} selectedStepId={stepId} />

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(chapter.color, "10"), border: `1px solid ${chapter.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: chapter.color, letterSpacing: "0.08em" }}>Selected chapter</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{chapter.title}</IAST>
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{chapter.establishes}</p>
                <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{chapter.practiceQuestion}</p>
              </div>
              <Devanagari className="shrink-0 text-3xl font-bold" style={{ color: chapter.color }}>{chapter.devanagari}</Devanagari>
            </div>
          </article>
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Closure status</p>
            </div>
            <p className="m-0 text-4xl font-semibold" style={{ color: GOLD, fontFamily: "var(--font-cormorant), serif" }}>5 streams</p>
            <p className="mb-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>
              Parashari, KP, Jaimini, Lal Kitab, and Tajika preview now form the Tier-1 stream toolkit.
            </p>
            <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{completedChapters} / 6 Lal Kitab chapters reviewed</p>
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(discipline.color, "10"), border: `1px solid ${discipline.color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck size={17} color={discipline.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: discipline.color, letterSpacing: "0.08em" }}>Discipline to carry forward</p>
            </div>
            <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{discipline.label}</h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{discipline.cue}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{discipline.action}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(stream.color, "10"), border: `1px solid ${stream.color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Compass size={17} color={stream.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: stream.color, letterSpacing: "0.08em" }}>Stream lens</p>
            </div>
            <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{stream.label}</h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{stream.role}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{stream.bestUse}</p>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <GitBranch size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>One-question pipeline</p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {PIPELINE_STEPS.map((item, index) => {
              const selected = item.id === stepId;
              const itemChapter = getChapter(item.chapterId);
              const color = boundaryColor(item.boundary);
              return (
                <button key={item.id} type="button" onClick={() => setStepId(item.id)} className="min-w-0 rounded-lg p-3 text-left" style={{ background: selected ? wash(color, "12") : SURFACE_2, border: `1px solid ${selected ? color : HAIRLINE}` }}>
                  <p className="m-0 text-xs font-black uppercase" style={{ color: selected ? color : GOLD, letterSpacing: "0.06em" }}>
                    {index + 1}. {item.label}
                  </p>
                  <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Ch {itemChapter.chapter}: {itemChapter.shortTitle}</p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{boundaryLabel(item.boundary)}</p>
                </button>
              );
            })}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(boundaryColor(step.boundary), "10"), border: `1px solid ${boundaryColor(step.boundary)}` }}>
          <div className="mb-2 flex items-center gap-2">
            <BookOpen size={17} color={boundaryColor(step.boundary)} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: boundaryColor(step.boundary), letterSpacing: "0.08em" }}>Active pipeline step</p>
          </div>
          <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{step.label}</h3>
          <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Chapter {stepChapter.chapter}: {stepChapter.title}</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{step.instruction}</p>
        </article>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Three disciplines</p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-3">
            {DISCIPLINES.map((item) => {
              const selected = item.id === disciplineId;
              return (
                <button key={item.id} type="button" onClick={() => setDisciplineId(item.id)} className="min-w-0 rounded-lg p-3 text-left" style={{ background: selected ? wash(item.color, "12") : SURFACE_2, border: `1px solid ${selected ? item.color : HAIRLINE}` }}>
                  <p className="m-0 text-sm font-bold" style={{ color: selected ? item.color : INK_PRIMARY }}>{item.label}</p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.cue}</p>
                </button>
              );
            })}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Map size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Five-stream toolkit</p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-5">
            {STREAMS.map((item) => {
              const selected = item.id === streamId;
              return (
                <button key={item.id} type="button" onClick={() => setStreamId(item.id)} className="min-w-0 rounded-lg p-3 text-left" style={{ background: selected ? wash(item.color, "12") : SURFACE_2, border: `1px solid ${selected ? item.color : HAIRLINE}` }}>
                  <p className="m-0 text-sm font-bold" style={{ color: selected ? item.color : INK_PRIMARY }}>{item.label}</p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.role}</p>
                </button>
              );
            })}
          </div>
        </article>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: wash(GOLD, "0F"), border: `1px solid ${HAIRLINE}` }}>
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Mastery phrase</p>
            <p className="mb-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>
              Lal Kitab at Tier 1 means: build the Teva, read states and meanings, check the year, recognise the upaya family, disclose the stream, and defer prescription.
            </p>
          </div>
          <Devanagari className="shrink-0 text-2xl font-bold" style={{ color: GOLD }}>लालकिताब</Devanagari>
        </div>
      </section>
    </div>
  );
}
