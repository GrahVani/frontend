"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { BadgeCheck, BookOpenCheck, ClipboardCheck, Compass, Milestone, RotateCcw, ShieldCheck } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CHAPTERS,
  COMMITMENTS,
  PRACTICE_MODES,
  VOICES,
  buildStatement,
  findChapter,
  type ChapterKey,
  type Option,
  type PracticeModeKey,
  type VoiceKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#2F6F9F";
const AMBER = "#B9801E";

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function scoreColor(score: number) {
  if (score >= 5) return GREEN;
  if (score >= 3) return AMBER;
  return BLUE;
}

export function VastuModuleClosure() {
  const [chapterKey, setChapterKey] = useState<ChapterKey>("discipline");
  const [modeKey, setModeKey] = useState<PracticeModeKey>("chartContext");
  const [voiceKey, setVoiceKey] = useState<VoiceKey>("clientFacing");
  const [checked, setChecked] = useState<string[]>(COMMITMENTS.map((item) => item.key));

  const chapter = useMemo(() => findChapter(chapterKey), [chapterKey]);
  const statement = useMemo(() => buildStatement(modeKey, voiceKey, checked), [modeKey, voiceKey, checked]);
  const color = scoreColor(checked.length);

  const reset = () => {
    setChapterKey("discipline");
    setModeKey("chartContext");
    setVoiceKey("clientFacing");
    setChecked(COMMITMENTS.map((item) => item.key));
  };

  const toggleCommitment = (key: string) => {
    setChecked((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-module-closure"
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
            M22 closure builder
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Write your Vastu practitioner discipline
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Integrate the six-chapter arc, reaffirm do-no-harm, and produce a scope statement for practice.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset closure
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Compass size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
                Six chapter arc
              </p>
            </div>
            <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>classical &gt; discipline</p>
          </div>
          <div className="grid min-w-0 gap-2 md:grid-cols-2 xl:grid-cols-3">
            {CHAPTERS.map((item) => {
              const active = item.key === chapterKey;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setChapterKey(item.key)}
                  className="min-w-0 rounded-xl p-3 text-left"
                  style={{ background: active ? wash(GOLD, "14") : SURFACE_2, border: `1px solid ${active ? GOLD : HAIRLINE}` }}
                >
                  <span className="block text-xs font-black uppercase" style={{ color: active ? GOLD : INK_SECONDARY }}>
                    Chapter {item.chapter}
                  </span>
                  <span className="mt-1 block text-base font-bold" style={{ color: INK_PRIMARY }}>{item.label}</span>
                  <span className="mt-2 block text-xs leading-snug" style={{ color: INK_SECONDARY }}>{item.layer}</span>
                </button>
              );
            })}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "10"), border: `1px solid ${GREEN}` }}>
          <div className="flex items-center gap-2">
            <BookOpenCheck size={17} color={GREEN} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Selected layer</p>
          </div>
          <h3 className="mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Ch {chapter.chapter}: {chapter.label}
          </h3>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>{chapter.note}</p>
          <p className="mb-0 mt-3 text-sm font-semibold" style={{ color: GREEN }}>{chapter.practiceCue}</p>
        </article>
      </section>

      <section className="mb-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Do-no-harm commitments</p>
          </div>
          <div className="grid min-w-0 gap-2">
            {COMMITMENTS.map((item) => {
              const active = checked.includes(item.key);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleCommitment(item.key)}
                  className="min-w-0 rounded-lg px-3 py-2 text-left"
                  style={{ background: active ? wash(color, "12") : SURFACE_2, border: `1px solid ${active ? color : HAIRLINE}` }}
                >
                  <span className="flex min-w-0 items-center gap-2 text-sm font-bold" style={{ color: active ? color : INK_PRIMARY }}>
                    {active ? <BadgeCheck size={16} /> : <span className="inline-block h-4 w-4 rounded-full" style={{ border: `1px solid ${HAIRLINE}` }} />}
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs leading-snug" style={{ color: INK_SECONDARY }}>{item.note}</span>
                </button>
              );
            })}
          </div>
        </article>

        <div className="grid min-w-0 gap-4">
          <section className="grid min-w-0 gap-3 md:grid-cols-2">
            <Selector title="Practice scope" icon={<ClipboardCheck size={16} />} options={PRACTICE_MODES} value={modeKey} onChange={setModeKey} />
            <Selector title="Statement voice" icon={<Milestone size={16} />} options={VOICES} value={voiceKey} onChange={setVoiceKey} />
          </section>
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
              <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>
                Statement preview
              </p>
              <span className="rounded-full px-3 py-1 text-xs font-black" style={{ color, background: SURFACE, border: `1px solid ${color}` }}>
                {checked.length}/5 commitments
              </span>
            </div>
            <pre className="m-0 whitespace-pre-wrap rounded-xl p-4 text-sm leading-relaxed" style={{ color: INK_PRIMARY, background: SURFACE, border: `1px solid ${HAIRLINE}`, fontFamily: "var(--font-sans), sans-serif" }}>
              {statement}
            </pre>
          </article>
        </div>
      </section>

      <section className="grid min-w-0 gap-3 md:grid-cols-3">
        <MilestoneCard title="22 of 24" body="M22 closes the space-discipline foundation. Two Tier 1 modules remain." />
        <MilestoneCard title="M23 next" body="Muhūrta brings the time-discipline counterpart to Vastu space literacy." />
        <MilestoneCard title="M24 capstone" body="Ethics, history, and discipline integrate the full practitioner framework." />
      </section>
    </div>
  );
}

function MilestoneCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
      <p className="m-0 text-xs font-black uppercase" style={{ color: GOLD }}>{title}</p>
      <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{body}</p>
    </article>
  );
}

function Selector<T extends string>({
  title,
  icon,
  options,
  value,
  onChange,
}: {
  title: string;
  icon: React.ReactNode;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <section className="min-w-0 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-2 flex items-center gap-2">
        <span style={{ color: GOLD }}>{icon}</span>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{title}</p>
      </div>
      <div className="grid min-w-0 gap-2">
        {options.map((option) => {
          const selected = option.key === value;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              className="min-w-0 rounded-lg px-3 py-2 text-left text-sm font-semibold"
              style={{
                color: selected ? INK_PRIMARY : INK_SECONDARY,
                background: selected ? wash(GOLD, "12") : SURFACE_2,
                border: `1px solid ${selected ? GOLD : HAIRLINE}`,
              }}
            >
              <span className="block">{option.label}</span>
              <span className="mt-1 block text-xs font-normal leading-snug" style={{ color: INK_SECONDARY }}>{option.note}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
