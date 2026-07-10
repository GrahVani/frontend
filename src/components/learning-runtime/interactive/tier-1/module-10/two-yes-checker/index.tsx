"use client";

/**
 * TwoYesChecker — The Two-Yes Principle Interactive
 *
 * §7 interactive for Lesson 10.4.3.
 *
 * Lets the learner toggle independent indicators for a predictive question,
 * counts the number of unique indicator-groups active, and flags a prediction
 * as reliable only when ≥2 independent groups agree.
 *
 * Includes a false-double demonstration: two differently-worded indicators
 * in the same group still count as one yes.
 */

import { useState, useMemo } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  QUESTIONS,
  INDICATOR_GROUPS,
  getIndicators,
  computeReliability,
  SCENARIO_PRESETS,
  type PredictiveQuestion,
  type ReliabilityVerdict,
} from "./data";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  CircleDot,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
  Target,
  XCircle,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";

/* ─── Helpers ──────────────────────────────────────────────────────────── */

function verdictColor(v: ReliabilityVerdict): string {
  return v === "reliable" ? GREEN : v === "uncertain" ? GOLD_ACCENT : VERMILION;
}

function verdictIcon(v: ReliabilityVerdict) {
  return v === "reliable" ? CheckCircle2 : v === "uncertain" ? HelpCircle : XCircle;
}

function verdictLabel(v: ReliabilityVerdict): string {
  return v === "reliable" ? "Reliable prediction" : v === "uncertain" ? "Uncertain — need more" : "No signal";
}

/* ─── Sub-components ───────────────────────────────────────────────────── */

function IndicatorToggle({
  indicator,
  group,
  active,
  onToggle,
  groupActive,
}: {
  indicator: ReturnType<typeof getIndicators>[number];
  group: (typeof INDICATOR_GROUPS)[string];
  active: boolean;
  onToggle: () => void;
  groupActive: boolean;
}) {
  const color = groupActive ? GREEN : INK_MUTED;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.5rem",
        width: "100%",
        textAlign: "left",
        padding: "0.65rem 0.85rem",
        borderRadius: 10,
        border: `1.5px solid ${active ? color : HAIRLINE}`,
        background: active ? `${color}12` : "transparent",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          border: `2px solid ${active ? color : HAIRLINE}`,
          background: active ? color : "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {active && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, color: active ? INK_PRIMARY : INK_SECONDARY, fontSize: "0.85rem" }}>
          {indicator.label}
          {indicator.isFalseDouble && (
            <span
              style={{
                marginLeft: "0.4rem",
                fontSize: "0.65rem",
                fontWeight: 800,
                color: GOLD_ACCENT,
                background: `${GOLD_ACCENT}18`,
                padding: "0.1rem 0.35rem",
                borderRadius: 4,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              same group
            </span>
          )}
        </div>
        <div style={{ fontSize: "0.75rem", color: INK_MUTED, marginTop: "0.1rem", lineHeight: 1.5 }}>
          {indicator.description}
        </div>
      </div>
      {groupActive && (
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 950,
            color: GREEN,
            background: `${GREEN}18`,
            padding: "0.15rem 0.4rem",
            borderRadius: 4,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            flexShrink: 0,
          }}
        >
          yes
        </span>
      )}
    </button>
  );
}

function VerdictBanner({ verdict, count }: { verdict: ReliabilityVerdict; count: number }) {
  const color = verdictColor(verdict);
  const Icon = verdictIcon(verdict);
  return (
    <div
      style={{
        borderRadius: 12,
        background: `${color}10`,
        border: `2px solid ${color}45`,
        padding: "1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "0.85rem",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: `${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={24} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: "1.15rem", fontWeight: 700, color, fontFamily: "var(--font-cormorant), serif" }}>
          {verdictLabel(verdict)}
        </div>
        <div style={{ fontSize: "0.82rem", color: INK_SECONDARY, marginTop: "0.15rem", lineHeight: 1.5 }}>
          {verdict === "reliable"
            ? `${count} independent indicator groups agree — you may commit to this prediction.`
            : verdict === "uncertain"
              ? `Only ${count} indicator group active — one yes alone is uncertain. Add a second independent indicator before predicting.`
              : "No indicator groups active — nothing to base a prediction on."}
        </div>
      </div>
    </div>
  );
}

function YesMeter({ count }: { count: number }) {
  const segments = [0, 1, 2, 3];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
      {segments.map((i) => {
        const filled = i < count;
        const color = i >= 2 ? GREEN : i === 1 ? GOLD_ACCENT : INK_MUTED;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              background: filled ? color : `${INK_MUTED}20`,
              transition: "background 0.2s ease",
            }}
          />
        );
      })}
      <span
        style={{
          fontSize: "0.78rem",
          fontWeight: 950,
          color: count >= 2 ? GREEN : count === 1 ? GOLD_ACCENT : INK_MUTED,
          marginLeft: "0.3rem",
          minWidth: 40,
          textAlign: "right",
        }}
      >
        {count} / 2+
      </span>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export function TwoYesChecker() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

  const question = QUESTIONS[questionIndex];
  const indicators = useMemo(() => getIndicators(question), [question]);

  const { activeGroups, count, verdict, falseDoublesActive } = useMemo(
    () => computeReliability(activeIds, indicators),
    [activeIds, indicators]
  );

  const toggleIndicator = (id: string) => {
    setActiveIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const loadScenario = (preset: (typeof SCENARIO_PRESETS)[number]) => {
    const qIdx = QUESTIONS.findIndex((q) => q.id === preset.questionId);
    if (qIdx >= 0) setQuestionIndex(qIdx);
    setActiveIds(new Set(preset.activeIds));
  };

  // Group indicators by their groupId for rendering
  const grouped = useMemo(() => {
    const map = new Map<string, typeof indicators>();
    for (const ind of indicators) {
      if (!map.has(ind.groupId)) map.set(ind.groupId, []);
      map.get(ind.groupId)!.push(ind);
    }
    return map;
  }, [indicators]);

  return (
    <div
      className="w-full"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: "20px",
        color: INK_PRIMARY,
      }}
      data-interactive="two-yes-checker"
    >
      {/* Header */}
      <div className="mb-4">
        <p
          style={{
            margin: 0,
            fontSize: "0.78rem",
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: INK_MUTED,
          }}
        >
          Two-yes principle interactive
        </p>
        <h2
          className="text-lg font-semibold mt-1"
          style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}
        >
          <IAST>Dvisammati</IAST>-Checker: Independent Indicator Counter
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          A reliable prediction needs at least two independent indicators. Toggle evidence and watch the verdict.
        </p>
      </div>

      {/* Question selector */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block" }}>
          <span
            style={{
              display: "block",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: INK_MUTED,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "0.35rem",
            }}
          >
            Predictive question
          </span>
          <select
            value={questionIndex}
            onChange={(e) => {
              setQuestionIndex(Number(e.target.value));
              setActiveIds(new Set());
            }}
            className="w-full rounded-lg px-2.5 py-2 text-sm"
            style={{
              background: "var(--gl-surface-2, #F5EDD8)",
              border: `1px solid ${HAIRLINE}`,
              color: INK_PRIMARY,
              fontWeight: 700,
            }}
          >
            {QUESTIONS.map((q, i) => (
              <option key={q.id} value={i}>
                {q.label} ({q.houses} house{q.houses.includes("&") ? "s" : ""})
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Verdict banner */}
      <div style={{ marginBottom: "1rem" }}>
        <VerdictBanner verdict={verdict} count={count} />
      </div>

      {/* Yes meter */}
      <div
        style={{
          borderRadius: 10,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "0.85rem 1rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 950,
            color: INK_MUTED,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: "0.4rem",
          }}
        >
          Independent yes count
        </div>
        <YesMeter count={count} />
        <p style={{ margin: "0.4rem 0 0", fontSize: "0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
          {count >= 2
            ? "Two or more different indicator families are active — the convergence rule is satisfied."
            : count === 1
              ? "Only one indicator family is active. Look for a genuinely different line of evidence."
              : "Toggle indicators below to build your case."}
        </p>
      </div>

      {/* False double warning */}
      {falseDoublesActive && (
        <div
          style={{
            borderRadius: 10,
            background: `${GOLD_ACCENT}10`,
            border: `1.5px solid ${GOLD_ACCENT}45`,
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <ShieldAlert size={16} style={{ color: GOLD_ACCENT, flexShrink: 0 }} />
          <span style={{ fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
            <strong style={{ color: GOLD_ACCENT }}>False double detected.</strong>{" "}
            Both toggles are in the same indicator family — they count as{" "}
            <em>one yes</em>, not two. Add an indicator from a different family.
          </span>
        </div>
      )}

      {/* Indicator toggles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
          gap: "0.85rem",
          marginBottom: "1rem",
        }}
      >
        {Array.from(grouped.entries()).map(([groupId, groupIndicators]) => {
          const group = INDICATOR_GROUPS[groupId];
          const isGroupActive = activeGroups.has(groupId);
          return (
            <div
              key={groupId}
              style={{
                borderRadius: 12,
                background: SURFACE,
                border: `1.5px solid ${isGroupActive ? `${GREEN}45` : HAIRLINE}`,
                padding: "0.85rem",
                transition: "border-color 0.2s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  marginBottom: "0.5rem",
                }}
              >
                <CircleDot size={14} style={{ color: isGroupActive ? GREEN : INK_MUTED }} />
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 950,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: isGroupActive ? GREEN : INK_MUTED,
                  }}
                >
                  {group.label}
                </span>
                {isGroupActive && (
                  <BadgeCheck size={14} style={{ color: GREEN, marginLeft: "auto" }} />
                )}
              </div>
              <div style={{ display: "grid", gap: "0.4rem" }}>
                {groupIndicators.map((ind) => (
                  <IndicatorToggle
                    key={ind.id}
                    indicator={ind}
                    group={group}
                    active={activeIds.has(ind.id)}
                    onToggle={() => toggleIndicator(ind.id)}
                    groupActive={isGroupActive}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scenario presets */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
          <Target size={16} style={{ color: GOLD_ACCENT }} />
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GOLD_ACCENT,
            }}
          >
            Scenarios from the lesson
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {SCENARIO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => loadScenario(preset)}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: 8,
                border: `1px solid ${HAIRLINE}`,
                background: "transparent",
                color: INK_SECONDARY,
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
              }}
              title={preset.note}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Active scenario note */}
        {SCENARIO_PRESETS.find((p) => {
          const currentIds = Array.from(activeIds).sort().join(",");
          const presetIds = [...p.activeIds].sort().join(",");
          return currentIds === presetIds && QUESTIONS[questionIndex].id === p.questionId;
        })?.note && (
          <div
            style={{
              marginTop: "0.6rem",
              borderRadius: 8,
              background: `${BLUE}10`,
              border: `1px solid ${BLUE}35`,
              padding: "0.6rem 0.8rem",
              fontSize: "0.82rem",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            <strong style={{ color: BLUE }}>Lesson note:</strong>{" "}
            {
              SCENARIO_PRESETS.find((p) => {
                const currentIds = Array.from(activeIds).sort().join(",");
                const presetIds = [...p.activeIds].sort().join(",");
                return currentIds === presetIds && QUESTIONS[questionIndex].id === p.questionId;
              })?.note
            }
          </div>
        )}
      </div>

      {/* Reset */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setQuestionIndex(0);
            setActiveIds(new Set());
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            backgroundColor: "var(--gl-surface-2, #F5EDD8)",
            color: INK_SECONDARY,
            border: `1px solid ${HAIRLINE}`,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={14} />
          Reset checker
        </button>
      </div>
    </div>
  );
}
