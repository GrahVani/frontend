"use client";

import { useState } from "react";
import type React from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Circle,
  GraduationCap,
  Map,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CAPABILITIES,
  CHAPTERS,
  COMMON_MISTAKES,
  CURRICULUM_STATUS,
  HOOK_STEPS,
  ONGOING_PRACTICES,
  findChapter,
  findPractice,
  type CapabilityKey,
  type ChapterKey,
  type OngoingPracticeKey,
} from "./data";

/* ── Design Tokens ─────────────────────────────────────── */
const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

/* ── SVG Helpers ───────────────────────────────────────── */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* ── Tab Bar ───────────────────────────────────────────── */
type TabKey = "wheel" | "timeline" | "assessment" | "ongoing";

function TabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "wheel", label: "M23 Wheel", icon: <Target size={15} /> },
    { key: "timeline", label: "Hook Timeline", icon: <Map size={15} /> },
    { key: "assessment", label: "Self-Assessment", icon: <CheckCircle2 size={15} /> },
    { key: "ongoing", label: "Ongoing Development", icon: <RefreshCw size={15} /> },
  ];

  return (
    <div className="mb-5 flex gap-1 rounded-xl p-1" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200"
            style={{
              background: isActive ? SURFACE : "transparent",
              color: isActive ? GOLD : INK_SECONDARY,
              border: isActive ? `1px solid ${HAIRLINE}` : "1px solid transparent",
              boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
              cursor: "pointer",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── M23 Wheel Tab ─────────────────────────────────────── */
function M23WheelTab() {
  const [selected, setSelected] = useState<ChapterKey>("ch1");
  const active = findChapter(selected);
  const cx = 280;
  const cy = 280;
  const radius = 200;

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <div className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-2 flex items-center gap-2">
          <Target size={17} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Six-chapter cumulative wheel</p>
        </div>
        <p className="m-0 mb-4 text-xs" style={{ color: INK_SECONDARY }}>
          Tap any chapter segment to see its cumulative achievement. The centre shows the M23 closing synthesis.
        </p>

        <div className="flex justify-center">
          <svg viewBox="0 0 560 560" className="w-full max-w-[560px]" role="img" aria-label="M23 six chapter cumulative wheel">
            <circle cx={cx} cy={cy} r={radius + 10} fill="none" stroke={HAIRLINE} />
            {CHAPTERS.map((chapter, i) => {
              const startAngle = i * 60;
              const endAngle = startAngle + 60;
              const midAngle = startAngle + 30;
              const isActive = chapter.key === selected;
              const outer = isActive ? radius + 8 : radius;
              const p1 = polarToCartesian(cx, cy, outer, startAngle);
              const p2 = polarToCartesian(cx, cy, outer, endAngle);
              const innerR = 110;
              const inner = polarToCartesian(cx, cy, innerR, endAngle);
              const inner2 = polarToCartesian(cx, cy, innerR, startAngle);
              const largeArc = endAngle - startAngle > 180 ? 1 : 0;
              const numberPos = polarToCartesian(cx, cy, 120, midAngle);
              const labelPos = polarToCartesian(cx, cy, 172, midAngle);

              return (
                <g key={chapter.key} style={{ cursor: "pointer" }} onClick={() => setSelected(chapter.key)}>
                  <path
                    d={`M ${p1.x} ${p1.y} A ${outer} ${outer} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${inner.x} ${inner.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${inner2.x} ${inner2.y} Z`}
                    fill={wash(chapter.color, isActive ? "28" : "16")}
                    stroke={isActive ? chapter.color : HAIRLINE}
                    strokeWidth={isActive ? 3 : 1.5}
                    style={{ transition: "all 0.2s ease" }}
                  />
                  <text x={numberPos.x} y={numberPos.y} textAnchor="middle" dominantBaseline="central" fill={chapter.color} fontSize={18} fontWeight={800} style={{ pointerEvents: "none" }}>
                    {chapter.number}
                  </text>
                  <foreignObject x={labelPos.x - 50} y={labelPos.y - 28} width="100" height="56" style={{ pointerEvents: "none" }}>
                    <div className="flex h-full items-center justify-center text-center text-[11px] font-bold uppercase leading-tight" style={{ color: INK_PRIMARY }}>
                      {chapter.title}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
            <circle cx={cx} cy={cy} r="86" fill="#FFFFFF" stroke={GOLD} strokeWidth={2} />
            <text x={cx} y={cy - 10} textAnchor="middle" fill={GOLD} fontSize={18} fontWeight={800}>M23</text>
            <text x={cx} y={cy + 16} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>22 lessons</text>
            <text x={cx} y={cy + 34} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={500}>Temporal discipline</text>
          </svg>
        </div>
      </div>

      <div className="min-w-0">
        <article className="rounded-xl p-5" style={{ background: wash(active.color, "08"), border: `1.5px solid ${active.color}` }}>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full" style={{ background: active.color }} />
            <p className="m-0 text-sm font-bold" style={{ color: active.color }}>Chapter {active.number}</p>
          </div>
          <h3 className="m-0 mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {active.title}
          </h3>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>{active.lessons} lessons</p>
          <p className="m-0 mt-4 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>{active.achievement}</p>
        </article>

        <div className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Cumulative achievement</p>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>
            <strong>Comprehensive muhūrta-practitioner-discipline framework</strong> spanning integrated method + event-type-specific applications + cancellation + sub-day filter + honest-handling + stakes-calibration + M24-ethics-integration.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Hook Timeline Tab ─────────────────────────────────── */
function HookTimelineTab() {
  const [selected, setSelected] = useState<string>("23.1.1");
  const active = HOOK_STEPS.find((s) => s.key === selected)!;

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <div className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-3 flex items-center gap-2">
          <Map size={17} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>§1 hook cumulative resolution</p>
        </div>
        <p className="m-0 mb-4 text-xs" style={{ color: INK_SECONDARY }}>
          Click any node to trace how the wedding-muhūrta scenario was progressively resolved across M23.
        </p>

        <div className="relative overflow-x-auto pb-2">
          <div className="flex min-w-[700px] gap-1">
            {HOOK_STEPS.map((step, i) => {
              const isActive = step.key === selected;
              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => setSelected(step.key)}
                  className="relative flex flex-1 flex-col items-center transition-all duration-200"
                  style={{ minWidth: 38 }}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      background: isActive ? GOLD : SURFACE_2,
                      color: isActive ? "#FFFFFF" : INK_SECONDARY,
                      border: `2px solid ${isActive ? GOLD : HAIRLINE}`,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className="mt-2 text-[9px] font-semibold" style={{ color: isActive ? GOLD : INK_SECONDARY }}>{step.lesson}</span>
                  {i < HOOK_STEPS.length - 1 && (
                    <div className="absolute left-1/2 top-4 h-0.5 w-full" style={{ background: HAIRLINE, transform: "translateX(50%)" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-xl p-4" style={{ background: "#FFFDF7", border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>Final recommendation</p>
          </div>
          <p className="m-0 mt-2 text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Nov 8 Sunday 2:00 PM — cumulative integrated method + sub-day filter convergence + honest-handling + M24-ethics-integration. Family decides per empowerment-principle.
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <article className="rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <BadgeCheck size={20} color={GOLD} />
            <p className="m-0 text-sm font-bold" style={{ color: GOLD }}>Lesson {active.lesson}</p>
          </div>
          <h3 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Contribution to cumulative resolution
          </h3>
          <p className="m-0 mt-3 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>{active.contribution}</p>
        </article>

        <div className="mt-4 rounded-xl p-4" style={{ background: wash(GREEN, "08"), border: `1px solid ${wash(GREEN, "22")}` }}>
          <p className="m-0 flex items-center gap-2 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.06em" }}>
            <Target size={14} /> Operational demonstration
          </p>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
            The §1 hook scenario progressively resolved across 22 lessons demonstrates the cumulative integrated method end-to-end — not an isolated worked example.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Self-Assessment Tab ───────────────────────────────── */
function SelfAssessmentTab() {
  const [checked, setChecked] = useState<Set<CapabilityKey>>(new Set());

  const toggle = (key: CapabilityKey) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const progress = Math.round((checked.size / CAPABILITIES.length) * 100);

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
      <div>
        <div className="mb-3 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Mastery self-assessment</p>
            </div>
            <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: wash(GREEN, "16"), color: GREEN }}>
              {checked.size}/{CAPABILITIES.length} checked
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {CAPABILITIES.map((cap) => {
            const isChecked = checked.has(cap.key);
            return (
              <button
                key={cap.key}
                type="button"
                onClick={() => toggle(cap.key)}
                className="flex items-start gap-4 rounded-xl p-4 text-left transition-all duration-200"
                style={{
                  background: isChecked ? wash(GREEN, "10") : SURFACE,
                  border: `1.5px solid ${isChecked ? GREEN : HAIRLINE}`,
                }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: isChecked ? GREEN : SURFACE_2,
                    border: `1.5px solid ${isChecked ? GREEN : HAIRLINE}`,
                  }}
                >
                  {isChecked ? <CheckCircle2 size={16} color="#FFFFFF" /> : <Circle size={16} color={INK_SECONDARY} />}
                </div>
                <div className="min-w-0">
                  <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{cap.label}</p>
                  <p className="m-0 mt-1 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>{cap.question}</p>
                  {isChecked && (
                    <p className="m-0 mt-2 text-xs" style={{ color: GREEN }}>
                      <strong>Evidence:</strong> {cap.evidence}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0">
        <div className="rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Progress</p>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: progress === 100 ? GREEN : GOLD }}
            />
          </div>
          <p className="m-0 mt-2 text-sm font-bold" style={{ color: progress === 100 ? GREEN : GOLD }}>{progress}% mastery articulation</p>
          <p className="m-0 mt-2 text-xs" style={{ color: INK_SECONDARY }}>
            {progress === 100
              ? "All five capabilities acknowledged. Tier-1 muhūrta-discipline-foundation operational."
              : "Check each capability to articulate your M23-completion status."}
          </p>
        </div>

        <div className="mt-4 rounded-xl p-4" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "25")}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>Assessment result</p>
          <p className="m-0 mt-2 text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            {progress === 100 ? "Tier-1 muhūrta-discipline-foundation operational." : "Continue checking capabilities to complete the self-assessment."}
          </p>
          <p className="m-0 mt-2 text-xs" style={{ color: INK_SECONDARY }}>
            Ongoing-development per Lesson 24.4.x warranted regardless of assessment completion.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Ongoing Development Tab ───────────────────────────── */
function OngoingDevelopmentTab() {
  const [selected, setSelected] = useState<OngoingPracticeKey>("svadhyaya");
  const active = findPractice(selected);

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
      <div className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-3 flex items-center gap-2">
          <RefreshCw size={17} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Continuing formation</p>
        </div>
        <div className="flex flex-col gap-2">
          {ONGOING_PRACTICES.map((p) => {
            const isActive = p.key === selected;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setSelected(p.key)}
                className="rounded-lg p-3 text-left transition-all duration-200"
                style={{
                  background: isActive ? wash(GOLD, "14") : SURFACE_2,
                  border: `1.5px solid ${isActive ? GOLD : HAIRLINE}`,
                }}
              >
                <p className="m-0 text-sm font-bold" style={{ color: isActive ? GOLD : INK_PRIMARY }}>{p.label}</p>
                <p className="m-0 mt-1 text-[10px]" style={{ color: INK_SECONDARY }}>{p.devanagari}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0">
        <article className="rounded-xl p-5" style={{ background: wash(GOLD, "08"), border: `1.5px solid ${GOLD}` }}>
          <div className="flex items-center gap-2">
            <BookOpen size={20} color={GOLD} />
            <p className="m-0 text-sm font-bold" style={{ color: GOLD }}>{active.label}</p>
          </div>
          <p className="m-0 mt-1 text-lg" style={{ color: GOLD, fontFamily: "var(--font-cormorant), serif" }}>{active.devanagari}</p>
          <p className="m-0 mt-4 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>{active.description}</p>

          <div className="mt-4 rounded-lg p-4" style={{ background: "#FFFFFF", border: `1px solid ${wash(GOLD, "25")}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>Action items</p>
            <ul className="m-0 mt-2 list-none space-y-2 p-0">
              {active.actionItems.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm" style={{ color: INK_PRIMARY }}>
                  <ArrowRight size={14} color={GOLD} className="mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <div className="mt-4 grid min-w-0 gap-3 lg:grid-cols-3">
          {COMMON_MISTAKES.map((m) => (
            <article key={m.key} className="rounded-xl p-4" style={{ background: wash(VERMILION, "08"), border: `1px solid ${wash(VERMILION, "25")}` }}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} color={VERMILION} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.06em" }}>Common mistake</p>
              </div>
              <h4 className="m-0 mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{m.label}</h4>
              <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{m.warning}</p>
              <div className="mt-3 rounded-lg p-2" style={{ background: "#FFFFFF", border: `1px solid ${wash(VERMILION, "20")}` }}>
                <p className="m-0 text-[10px] font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.05em" }}>Remedy</p>
                <p className="m-0 mt-1 text-xs" style={{ color: INK_PRIMARY }}>{m.remedy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Main Component ────────────────────────────────────── */
export function M23Closure() {
  const [activeTab, setActiveTab] = useState<TabKey>("wheel");

  const reset = () => setActiveTab("wheel");

  const completedCount = CURRICULUM_STATUS.completed.length;
  const pendingCount = CURRICULUM_STATUS.pending.length;
  const total = CURRICULUM_STATUS.total;
  const progressPercent = Math.round((completedCount / total) * 100);

  return (
    <div
      className="w-full min-w-0"
      data-interactive="m23-closure"
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
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            M23 Chapter 6 · Module Closure
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            M23 closing synthesis
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            22-lesson cumulative discipline-framework now operational. Temporal-discipline mastery achieved; transition to ongoing development and M22 Vāstu.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, cursor: "pointer" }}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <TabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === "wheel" && <M23WheelTab />}
      {activeTab === "timeline" && <HookTimelineTab />}
      {activeTab === "assessment" && <SelfAssessmentTab />}
      {activeTab === "ongoing" && <OngoingDevelopmentTab />}

      {/* Curriculum status ribbon */}
      <div className="mt-5 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap size={22} color={GOLD} />
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Tier-1 curriculum status</p>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_PRIMARY }}>
                <strong>{completedCount} of {total}</strong> modules complete ({CURRICULUM_STATUS.completed.join(", ")}) · <strong>{pendingCount}</strong> pending
              </p>
            </div>
          </div>
          <div className="flex-1 lg:max-w-md">
            <div className="h-3 w-full overflow-hidden rounded-full" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%`, background: GOLD }} />
            </div>
            <p className="m-0 mt-1 text-right text-xs" style={{ color: INK_SECONDARY }}>Next: <strong>{CURRICULUM_STATUS.next}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
