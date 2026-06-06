"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, GitCompare, RotateCcw, ShieldCheck } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST, Devanagari } from "../../chrome/typography";
import {
  ASHTOTTARI_DECISION_COLORS,
  CRITERIA,
  DEFAULT_DECISION_STATE,
  EMPTY_DECISION_STATE,
  type CriterionKey,
  type DecisionState,
  decisionBand,
  decisionScore,
  hasGateCondition,
  recommendationDetail,
  recommendationLabel,
  supportCount,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

function toggleState(state: DecisionState, key: CriterionKey): DecisionState {
  return { ...state, [key]: !state[key] };
}

function statusColor(state: DecisionState) {
  const band = decisionBand(state);

  if (band === "candidate-supported" || band === "candidate") return ASHTOTTARI_DECISION_COLORS.rahu;
  if (band === "study-only") return ASHTOTTARI_DECISION_COLORS.caution;
  return ink.goldAccent;
}

function DecisionBridge({ state }: { state: DecisionState }) {
  const gate = hasGateCondition(state);
  const support = supportCount(state);
  const color = statusColor(state);
  const ashtottariWidth = gate ? Math.max(42, Math.min(88, decisionScore(state))) : support > 0 ? 28 : 0;

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-4 flex items-center gap-2">
        <GitCompare size={17} color={ink.goldAccent} />
        <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
          Alongside rule
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm font-semibold" style={{ color: INK_SECONDARY }}>
            <span>Vimshottari baseline</span>
            <span>Always active</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <div
              className="h-full rounded-full"
              style={{ width: "100%", background: ASHTOTTARI_DECISION_COLORS.vimshottari }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm font-semibold" style={{ color: INK_SECONDARY }}>
            <span>Ashtottari supplement</span>
            <span>{gate ? "Candidate" : support > 0 ? "Verify first" : "Inactive"}</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${ashtottariWidth}%`, background: color, opacity: gate ? 1 : 0.52 }}
            />
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm" style={{ color: INK_MUTED }}>
        The second bar never replaces the first. A qualifying Rahu relation only adds a supplementary timing lens.
      </p>
    </section>
  );
}

function CriterionButton({
  state,
  criterion,
  onToggle,
}: {
  state: DecisionState;
  criterion: (typeof CRITERIA)[number];
  onToggle: (key: CriterionKey) => void;
}) {
  const active = state[criterion.key];
  const color = criterion.isGate ? ASHTOTTARI_DECISION_COLORS.rahu : ASHTOTTARI_DECISION_COLORS.support;

  return (
    <button
      type="button"
      onClick={() => onToggle(criterion.key)}
      className="flex min-h-[116px] w-full flex-col items-start justify-between rounded-xl p-4 text-left transition"
      style={{
        background: active ? `${color}1f` : SURFACE,
        border: `1.5px solid ${active ? color : HAIRLINE}`,
        color: INK_PRIMARY,
      }}
      aria-pressed={active}
    >
      <span className="flex w-full items-start justify-between gap-3">
        <span>
          <span className="block text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>
            {criterion.isGate ? "Classical gate" : "Practice cue"}
          </span>
          <span className="mt-1 block text-base font-semibold">{criterion.label}</span>
        </span>
        {active ? <CheckCircle2 size={20} color={color} /> : <CircleDot size={20} color={INK_MUTED} />}
      </span>
      <span className="mt-3 block text-sm leading-snug" style={{ color: INK_SECONDARY }}>
        {criterion.description}
      </span>
    </button>
  );
}

function DecisionDiagram({ state }: { state: DecisionState }) {
  const gate = hasGateCondition(state);
  const support = supportCount(state);
  const color = statusColor(state);

  const nodes = useMemo(
    () => [
      { label: "Lagna", active: state.lagnaRahu, x: 78, y: 86 },
      { label: "Moon", active: state.moonRahu, x: 78, y: 218 },
      { label: "Rahu", active: gate || support > 0, x: 218, y: 152 },
      { label: "Ashtottari", active: gate, x: 362, y: 152 },
    ],
    [gate, state.lagnaRahu, state.moonRahu, support],
  );

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 440 300" className="h-auto w-full" role="img" aria-label="Rahu condition decision diagram">
        <rect x="18" y="24" width="404" height="252" rx="18" fill={SURFACE_2} stroke="var(--gl-gold-hairline)" />
        <path
          d="M 108 86 C 150 88, 174 124, 198 148"
          fill="none"
          stroke={state.lagnaRahu ? color : "var(--gl-gold-hairline)"}
          strokeWidth={state.lagnaRahu ? 4 : 2}
          strokeLinecap="round"
        />
        <path
          d="M 108 218 C 150 216, 174 180, 198 156"
          fill="none"
          stroke={state.moonRahu ? color : "var(--gl-gold-hairline)"}
          strokeWidth={state.moonRahu ? 4 : 2}
          strokeLinecap="round"
        />
        <path
          d="M 248 152 C 286 152, 315 152, 338 152"
          fill="none"
          stroke={gate ? color : "var(--gl-gold-hairline)"}
          strokeWidth={gate ? 5 : 2}
          strokeDasharray={gate ? undefined : "6 8"}
          strokeLinecap="round"
        />
        {nodes.map((node) => (
          <g key={node.label}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.label === "Rahu" ? 34 : 31}
              fill={node.active ? `${color}26` : SURFACE}
              stroke={node.active ? color : "var(--gl-gold-hairline)"}
              strokeWidth={node.active ? 2.5 : 1.5}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fill={node.active ? color : INK_MUTED}
              fontSize={node.label === "Ashtottari" ? 12 : 14}
              fontWeight={800}
              style={{ fontFamily: "var(--font-sans), sans-serif" }}
            >
              {node.label}
            </text>
          </g>
        ))}
        <text
          x="220"
          y="260"
          textAnchor="middle"
          fill={INK_MUTED}
          fontSize="11"
          fontWeight={800}
          letterSpacing="1.2"
          style={{ fontFamily: "var(--font-sans), sans-serif" }}
        >
          BPHS gate first; practical cues only support the decision
        </text>
      </svg>
    </section>
  );
}

export function AshtottariConditionChecker() {
  const [state, setState] = useState<DecisionState>(DEFAULT_DECISION_STATE);
  const gate = hasGateCondition(state);
  const score = decisionScore(state);
  const color = statusColor(state);
  const band = decisionBand(state);

  return (
    <div
      className="w-full"
      data-interactive="ashtottari-condition-checker"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
      }}
    >
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
            Conditional dasha decision tool
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            When <IAST>Ashtottari</IAST> applies
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Toggle the Rahu-related Lagna/Moon gate and the practical cross-check cues. The result always keeps Vimshottari as the default.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setState(DEFAULT_DECISION_STATE)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            <RotateCcw size={16} />
            Rahu candidate
          </button>
          <button
            type="button"
            onClick={() => setState(EMPTY_DECISION_STATE)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: gate ? ASHTOTTARI_DECISION_COLORS.rahuTint : SURFACE, border: `1.5px solid ${color}` }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>
                  Recommendation
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {recommendationLabel(state)}
                </h3>
                <p className="mt-2 max-w-2xl text-sm" style={{ color: INK_SECONDARY }}>
                  {recommendationDetail(state)}
                </p>
              </div>
              <div
                className="rounded-xl px-4 py-3 text-center"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, minWidth: 132 }}
              >
                <p className="m-0 text-xs font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.08em" }}>
                  Signal
                </p>
                <p className="m-0 text-3xl font-bold" style={{ color, fontFamily: "var(--font-cormorant), serif" }}>
                  {score}
                </p>
                <p className="m-0 text-xs font-semibold" style={{ color: INK_MUTED }}>
                  {band === "study-only" ? "ungated" : "of 100"}
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-2">
            {CRITERIA.map((criterion) => (
              <CriterionButton
                key={criterion.key}
                state={state}
                criterion={criterion}
                onToggle={(key) => setState((current) => toggleState(current, key))}
              />
            ))}
          </section>
        </div>

        <div className="min-w-0 space-y-4">
          <DecisionDiagram state={state} />
          <DecisionBridge state={state} />
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              {gate ? <ShieldCheck size={18} color={ASHTOTTARI_DECISION_COLORS.rahu} /> : <AlertTriangle size={18} color={ink.goldAccent} />}
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Recension honesty
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              The lesson names the accepted trigger broadly: a Rahu-related Lagna/Moon condition. Because texts state the exact rule in more than one way, this tool teaches the gate and the workflow, not a single overclaimed wording.
            </p>
            <div
              className="mt-4 flex items-center justify-between gap-4 rounded-xl p-3"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}
            >
              <span className="text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                No gate
              </span>
              <Devanagari size="lg" style={{ color: ASHTOTTARI_DECISION_COLORS.rahu }}>
                राहु
              </Devanagari>
              <span className="text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                No supplement
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
