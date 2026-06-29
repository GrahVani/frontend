"use client";

/**
 * Vipareeta Rationale — Lesson 14.5.3 Interactive
 *
 * §7 interactive: illustrates the spoiler-of-spoiler logic and its honest limits.
 * Scenario explorer with strength + timing controls. Spoiler-mechanism SVG.
 * K. N. Rao observation framed as suggestive, not proof.
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { grahas } from "@/design-tokens/grahvani-learning/colors";
import { YOGAS, evaluateScenario } from "./data";
import type { YogaKey, StrengthLevel, TimingLevel } from "./data";
import {
  Lightbulb,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  Info,
  TrendingUp,
  Clock,
  Zap,
  ChevronRight,
  Eye,
} from "lucide-react";

/* ─── Design tokens ──────────────────────────────────────────────────────── */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#C8841E";

function grahaColor(slug: string) {
  return (grahas as Record<string, { primary: string }>)[slug]?.primary ?? INK_MUTED;
}

/* ─── SVG: Spoiler mechanism flow ────────────────────────────────────────── */

function SpoilerFlow({ yogaKey }: { yogaKey: YogaKey }) {
  const yoga = YOGAS.find((y) => y.key === yogaKey)!;
  const w = 480;
  const h = 180;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 200 }}>
      <text x={w / 2} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        The spoiler of the spoiler — {yoga.nameIAST} logic
      </text>

      {/* Stage 1: Dusthana lord carries harm */}
      <g transform="translate(60, 50)">
        <rect x={0} y={0} width={100} height={72} rx={10} fill={SURFACE} stroke={VERMILION} strokeWidth={2} />
        <text x={50} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={VERMILION}>
          Dusthana Lord
        </text>
        <text x={50} y={38} textAnchor="middle" fontSize={10} fontWeight={700} fill={grahaColor(yoga.grahaSlug)}>
          {yoga.lordName}
        </text>
        <text x={50} y={54} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
          carries harm
        </text>
      </g>

      {/* Arrow 1 */}
      <line x1={170} y1={86} x2={200} y2={86} stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="200,82 200,90 208,86" fill={HAIRLINE} />

      {/* Stage 2: Enters dusthana — collision */}
      <g transform="translate(220, 50)">
        <rect x={0} y={0} width={100} height={72} rx={10} fill={SURFACE} stroke={AMBER} strokeWidth={2} />
        <text x={50} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={AMBER}>
          Enters
        </text>
        <text x={50} y={38} textAnchor="middle" fontSize={10} fontWeight={700} fill={AMBER}>
          another dusthana
        </text>
        <text x={50} y={54} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
          harm meets harm
        </text>
      </g>

      {/* Arrow 2 */}
      <line x1={330} y1={86} x2={360} y2={86} stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="360,82 360,90 368,86" fill={HAIRLINE} />

      {/* Stage 3: Paradoxical benefit */}
      <g transform="translate(380, 50)">
        <rect x={0} y={0} width={100} height={72} rx={10} fill={SURFACE} stroke={GREEN} strokeWidth={2} />
        <text x={50} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={GREEN}>
          Net result
        </text>
        <text x={50} y={38} textAnchor="middle" fontSize={10} fontWeight={700} fill={GREEN}>
          paradoxical benefit
        </text>
        <text x={50} y={54} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
          harm cancels harm
        </text>
      </g>

      {/* Bottom labels */}
      <text x={110} y={148} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
        damaging significator
      </text>
      <text x={270} y={148} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
        spoiler meets spoiler
      </text>
      <text x={430} y={148} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
        fortune through difficulty
      </text>
    </svg>
  );
}

/* ─── SVG: Strength-to-outcome gauge ─────────────────────────────────────── */

function OutcomeGauge({ strength, timing }: { strength: StrengthLevel; timing: TimingLevel }) {
  const w = 360;
  const h = 90;
  const levels: StrengthLevel[] = ["weak", "moderate", "strong"];
  const cx = w / 2;

  const strengthIdx = levels.indexOf(strength);
  const timingBoost = timing === "active" ? 1 : timing === "moderate" ? 0 : -1;
  const netIdx = Math.max(0, Math.min(2, strengthIdx + timingBoost));

  const colors = [VERMILION, AMBER, GREEN];
  const labels = ["Muted", "Noticeable", "Transformative"];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 100 }}>
      <text x={cx} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK_SECONDARY}>
        Outcome gauge: strength {strength} + timing {timing}
      </text>

      {/* Track */}
      <line x1={60} y1={50} x2={300} y2={50} stroke={HAIRLINE} strokeWidth={4} strokeLinecap="round" />

      {/* Level markers */}
      {[0, 1, 2].map((i) => {
        const x = 60 + i * 120;
        const active = i === netIdx;
        return (
          <g key={i}>
            <circle cx={x} cy={50} r={active ? 10 : 6} fill={active ? colors[i] : SURFACE} stroke={colors[i]} strokeWidth={2} />
            <text x={x} y={72} textAnchor="middle" fontSize={9} fontWeight={active ? 700 : 600} fill={active ? colors[i] : INK_MUTED}>
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function VipareetaRationale() {
  const [yogaKey, setYogaKey] = useState<YogaKey>("harsha");
  const [strength, setStrength] = useState<StrengthLevel>("strong");
  const [timing, setTiming] = useState<TimingLevel>("active");

  const yoga = YOGAS.find((y) => y.key === yogaKey)!;
  const result = useMemo(() => evaluateScenario(yogaKey, strength, timing), [yogaKey, strength, timing]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Lightbulb size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Vipareeta Doctrine
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Spoiler of the spoiler — why adversity turned on itself produces benefit, and its honest limits.
          </p>
        </div>
      </div>

      {/* Spoiler mechanism diagram */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Eye size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>The Mechanism</span>
        </div>
        <SpoilerFlow yogaKey={yogaKey} />
      </div>

      {/* Scenario controls */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>Scenario Explorer</span>
          </div>
          <button
            onClick={() => { setYogaKey("harsha"); setStrength("strong"); setTiming("active"); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
            style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>

        {/* Yoga selector */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Select Vipareeta Yoga</span>
          <div className="grid grid-cols-3 gap-2">
            {YOGAS.map((y) => {
              const active = y.key === yogaKey;
              return (
                <button
                  key={y.key}
                  onClick={() => setYogaKey(y.key)}
                  className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold"
                  style={{
                    background: active ? `${y.color}12` : "transparent",
                    border: `1px solid ${active ? y.color : HAIRLINE}`,
                    color: active ? y.color : INK_SECONDARY,
                  }}
                >
                  <span><IAST>{y.nameIAST}</IAST></span>
                  <Devanagari size="sm" style={{ fontSize: "10px", opacity: 0.7 }}>{y.nameDevanagari}</Devanagari>
                </button>
              );
            })}
          </div>
        </div>

        {/* Strength selector */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Lord Strength</span>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: "weak" as StrengthLevel, label: "Weak", color: VERMILION },
              { key: "moderate" as StrengthLevel, label: "Moderate", color: AMBER },
              { key: "strong" as StrengthLevel, label: "Strong", color: GREEN },
            ]).map((s) => (
              <button
                key={s.key}
                onClick={() => setStrength(s.key)}
                className="rounded-lg px-3 py-2 text-xs font-bold"
                style={{
                  background: strength === s.key ? `${s.color}12` : "transparent",
                  border: `1px solid ${strength === s.key ? s.color : HAIRLINE}`,
                  color: strength === s.key ? s.color : INK_SECONDARY,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timing selector */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Daśā Timing</span>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: "quiet" as TimingLevel, label: "Quiet / dormant", color: INK_MUTED },
              { key: "moderate" as TimingLevel, label: "Moderate", color: AMBER },
              { key: "active" as TimingLevel, label: "Active / peak", color: GREEN },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTiming(t.key)}
                className="rounded-lg px-3 py-2 text-xs font-bold"
                style={{
                  background: timing === t.key ? `${t.color}12` : "transparent",
                  border: `1px solid ${timing === t.key ? t.color : HAIRLINE}`,
                  color: timing === t.key ? t.color : INK_SECONDARY,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-lg p-4 space-y-3"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${result.outcomeColor}` }}
        >
          <div className="flex items-center gap-2">
            <ChevronRight size={16} style={{ color: result.outcomeColor }} />
            <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Scenario Outcome</h4>
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full ml-auto"
              style={{ background: `${result.outcomeColor}15`, color: result.outcomeColor }}
            >
              {result.outcomeLabel}
            </span>
          </div>
          <p className="text-xs" style={{ color: INK_SECONDARY }}>{result.description}</p>
          <div className="flex items-start gap-1.5">
            <Zap size={11} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
            <span className="text-xs" style={{ color: INK_MUTED }}>{result.deliveryNote}</span>
          </div>
        </div>

        <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <OutcomeGauge strength={strength} timing={timing} />
        </div>
      </div>

      {/* Through struggle panel */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${yoga.color}` }}>
        <div className="flex items-center gap-2">
          <TrendingUp size={16} style={{ color: yoga.color }} />
          <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
            <IAST>{yoga.nameIAST}</IAST> — Through Struggle
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          <strong style={{ color: yoga.color }}>{yoga.flavor}</strong>
          {" — "}{yoga.struggle}
        </p>
        <div className="flex items-start gap-1.5">
          <Info size={11} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
          <span className="text-xs" style={{ color: INK_MUTED }}>
            {yoga.benefit} The benefit is real — but it arrives <em>through</em> the domain of difficulty, not in its absence.
          </span>
        </div>
      </div>

      {/* Honest limits panel */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} style={{ color: AMBER }} />
          <span className="text-xs font-bold" style={{ color: AMBER }}>Honest Limits</span>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          Vipareeta is <strong>not</strong> effortless luck. The benefit typically arrives <strong>through struggle, crisis, or reversal</strong>
          — victory <em>over</em> enemies, resilience <em>through</em> crisis, gain <em>after</em> loss. Like every yoga, delivery depends on
          the <strong>lord&apos;s strength</strong> and the <strong>timing</strong> of its daśā. A weak Vipareeta underdelivers;
          a strong one in its period can be transformative — but the path runs through hardship.
        </p>
      </div>

      {/* K. N. Rao observation */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
        <div className="flex items-center gap-2">
          <Eye size={14} style={{ color: GOLD_ACCENT }} />
          <span className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>Modern Observation — Framed Honestly</span>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          Modern teachers (notably <strong>K. N. Rao</strong>) have observed that <strong>many high achievers&apos; charts show Vipareeta configurations</strong>
          — a suggestive pattern that fits the &ldquo;rise through adversity&rdquo; reading.
        </p>
        <p className="text-xs" style={{ color: INK_MUTED }}>
          Treat this as <strong>supportive modern commentary</strong>, not statistical proof. Cite it as observation,
          and let each chart&apos;s strength and timing carry the actual judgement.
        </p>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common Mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "Effortless luck", text: "Vipareeta benefit comes through struggle and reversal — not in their absence. Do not promise trouble-free success." },
            { title: "Treating observation as proof", text: "K. N. Rao's note is suggestive modern commentary, not statistical proof. Frame it honestly." },
            { title: "Ignoring strength and timing", text: "A weak Vipareeta in a quiet daśā underdelivers. Always grade the yoga and time its periods." },
          ].map((m, i) => (
            <div
              key={i}
              className="rounded-lg p-3 space-y-1.5"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${AMBER}` }}
            >
              <div className="text-xs font-bold" style={{ color: AMBER }}>{m.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
