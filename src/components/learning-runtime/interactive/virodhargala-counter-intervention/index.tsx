"use client";

/**
 * Virodhārgala Counter-Intervention -- Lesson 17.3.3 Interactive
 *
 * Obstruction pairs (12th/10th/3rd), net-effect computation,
 * and survives-vs-obstructed scenario explorer.
 */

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import { computePairs, SCENARIOS, TRAPS } from "./data";
import {
  Shield,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Minus,
  Plus,
  RotateCcw,
  ArrowRight,
  Scale,
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
const AMBER = "#C8841E";

/* --- Net bar SVG --- */

function NetBar({ positive, virodha }: { positive: number; virodha: number }) {
  const w = 200;
  const h = 28;
  const max = Math.max(positive, virodha, 1);
  const posW = (positive / max) * 90;
  const virW = (virodha / max) * 90;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 28 }}>
      <text x={5} y={10} fontSize={9} fill={GREEN} fontWeight={700}>{positive}</text>
      <rect x={5} y={14} width={posW} height={10} rx={3} fill={GREEN} fillOpacity={0.3} />
      <text x={105} y={10} fontSize={9} fill={VERMILION} fontWeight={700}>{virodha}</text>
      <rect x={105} y={14} width={virW} height={10} rx={3} fill={VERMILION} fillOpacity={0.3} />
    </svg>
  );
}

/* --- Main component --- */

export function VirodhargalaCounterIntervention() {
  const [reference, setReference] = useState(1);
  const [positiveCounts, setPositiveCounts] = useState<[number, number, number]>([0, 1, 0]);
  const [virodhaCounts, setVirodhaCounts] = useState<[number, number, number]>([0, 2, 0]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [trapRevealed, setTrapRevealed] = useState<Record<string, boolean>>({});

  const pairs = useMemo(() => computePairs(reference, positiveCounts, virodhaCounts), [reference, positiveCounts, virodhaCounts]);
  const totalPositive = positiveCounts.reduce((a, b) => a + b, 0);
  const totalVirodha = virodhaCounts.reduce((a, b) => a + b, 0);
  const overallNet = totalPositive - totalVirodha;

  const overallColor = overallNet > 0 ? GREEN : overallNet < 0 ? VERMILION : AMBER;
  const overallLabel = overallNet > 0 ? `Net positive (+${overallNet})` : overallNet < 0 ? `Net negative (${overallNet})` : "Net neutral";

  function applyScenario(i: number) {
    const s = SCENARIOS[i];
    setReference(s.reference);
    setPositiveCounts([...s.positiveCounts]);
    setVirodhaCounts([...s.virodhaCounts]);
    setScenarioIndex(i);
  }

  function adjustCount(type: "pos" | "viro", idx: number, delta: number) {
    if (type === "pos") {
      setPositiveCounts((p) => {
        const next = [...p] as [number, number, number];
        next[idx] = Math.max(0, next[idx] + delta);
        return next;
      });
    } else {
      setVirodhaCounts((p) => {
        const next = [...p] as [number, number, number];
        next[idx] = Math.max(0, next[idx] + delta);
        return next;
      });
    }
  }

  const pairLabels = [
    { pos: "2nd-from-ref", viro: "12th-from-ref", rule: "12th obstructs 2nd" },
    { pos: "4th-from-ref", viro: "10th-from-ref", rule: "10th obstructs 4th" },
    { pos: "11th-from-ref", viro: "3rd-from-ref", rule: "3rd obstructs 11th" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ShieldAlert size={22} style={{ color: VERMILION }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Virodhārgala</IAST> -- Counter-Intervention
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            The three obstruction pairs and net-effect computation.
          </p>
        </div>
      </div>

      {/* Pair reminder */}
      <div className="rounded-lg p-3 flex items-center gap-3 flex-wrap" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${VERMILION}` }}>
        <Shield size={16} style={{ color: VERMILION }} />
        <span className="text-xs font-bold" style={{ color: VERMILION }}>The three fixed pairs:</span>
        <span className="text-xs" style={{ color: INK_SECONDARY }}>12th obstructs 2nd</span>
        <ArrowRight size={12} style={{ color: INK_MUTED }} />
        <span className="text-xs" style={{ color: INK_SECONDARY }}>10th obstructs 4th</span>
        <ArrowRight size={12} style={{ color: INK_MUTED }} />
        <span className="text-xs" style={{ color: INK_SECONDARY }}>3rd obstructs 11th</span>
      </div>

      {/* Scenarios */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold" style={{ color: INK_MUTED }}>Scenarios:</span>
        {SCENARIOS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => applyScenario(i)}
            className="px-2.5 py-1.5 rounded-md text-xs font-semibold"
            style={{
              background: scenarioIndex === i ? "rgba(162,58,30,0.06)" : "transparent",
              border: `1.5px solid ${scenarioIndex === i ? VERMILION : HAIRLINE}`,
              color: scenarioIndex === i ? VERMILION : INK_SECONDARY,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Reference + controls */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Scale size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Net Intervention Calculator</h4>
        </div>

        <div>
          <div className="text-xs font-bold mb-2" style={{ color: INK_PRIMARY }}>Reference house: H{reference}</div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 12 }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setReference(i + 1)}
                className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                style={{
                  background: reference === i + 1 ? "rgba(156,122,47,0.09)" : "transparent",
                  border: `1.5px solid ${reference === i + 1 ? GOLD_ACCENT : HAIRLINE}`,
                  color: reference === i + 1 ? GOLD_ACCENT : INK_SECONDARY,
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Pair cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {pairs.map((pair, i) => {
            const label = pairLabels[i];
            const color = pair.net === "positive" ? GREEN : pair.net === "negative" ? VERMILION : AMBER;
            return (
              <div key={i} className="rounded-lg p-3 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <div className="text-xs font-bold text-center" style={{ color: INK_MUTED }}>{label.rule}</div>

                {/* Positive */}
                <div className="rounded p-2 space-y-1" style={{ background: "rgba(47,125,85,0.04)", border: `1px solid ${GREEN}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: GREEN }}>H{pair.positiveHouse} ({label.pos})</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => adjustCount("pos", i, -1)} className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ border: `1px solid ${HAIRLINE}` }}>-</button>
                      <span className="text-xs font-bold w-4 text-center" style={{ color: GREEN }}>{pair.positiveCount}</span>
                      <button onClick={() => adjustCount("pos", i, 1)} className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ border: `1px solid ${HAIRLINE}` }}>+</button>
                    </div>
                  </div>
                  <NetBar positive={pair.positiveCount} virodha={0} />
                </div>

                {/* Virodha */}
                <div className="rounded p-2 space-y-1" style={{ background: "rgba(162,58,30,0.04)", border: `1px solid ${VERMILION}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: VERMILION }}>H{pair.virodhaHouse} ({label.viro})</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => adjustCount("viro", i, -1)} className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ border: `1px solid ${HAIRLINE}` }}>-</button>
                      <span className="text-xs font-bold w-4 text-center" style={{ color: VERMILION }}>{pair.virodhaCount}</span>
                      <button onClick={() => adjustCount("viro", i, 1)} className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ border: `1px solid ${HAIRLINE}` }}>+</button>
                    </div>
                  </div>
                  <NetBar positive={0} virodha={pair.virodhaCount} />
                </div>

                {/* Net */}
                <div className="rounded p-1.5 text-center" style={{ background: `${color}08`, border: `1px solid ${color}` }}>
                  <span className="text-xs font-bold" style={{ color }}>{pair.net === "positive" ? "Survives" : pair.net === "negative" ? "Obstructed" : "Neutral"}</span>
                  <div className="text-xs" style={{ color: INK_MUTED }}>{pair.netLabel}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall net */}
        <div
          className="rounded-lg p-3 flex items-center justify-between flex-wrap gap-2"
          style={{ background: `${overallColor}06`, border: `1px solid ${overallColor}`, borderLeft: `4px solid ${overallColor}` }}
        >
          <div className="flex items-center gap-2">
            {overallNet > 0 ? <CheckCircle2 size={16} style={{ color: GREEN }} /> : overallNet < 0 ? <XCircle size={16} style={{ color: VERMILION }} /> : <AlertTriangle size={16} style={{ color: AMBER }} />}
            <span className="text-sm font-bold" style={{ color: overallColor }}>{overallLabel}</span>
          </div>
          <div className="text-xs" style={{ color: INK_SECONDARY }}>
            Positive: <strong style={{ color: GREEN }}>{totalPositive}</strong> &nbsp;|&nbsp; Obstructing: <strong style={{ color: VERMILION }}>{totalVirodha}</strong> &nbsp;|&nbsp; Net: <strong style={{ color: overallColor }}>{overallNet > 0 ? `+${overallNet}` : overallNet}</strong>
          </div>
        </div>
      </div>

      {/* Scenario description */}
      <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="text-xs font-bold mb-1" style={{ color: INK_SECONDARY }}>{SCENARIOS[scenarioIndex].label}</div>
        <div className="text-xs" style={{ color: INK_SECONDARY }}>{SCENARIOS[scenarioIndex].description}</div>
      </div>

      {/* Trap spotter */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: VERMILION }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Spot the Error</h4>
        </div>
        <div className="space-y-2">
          {TRAPS.map((trap) => {
            const rev = trapRevealed[trap.key];
            return (
              <button
                key={trap.key}
                onClick={() => setTrapRevealed((p) => ({ ...p, [trap.key]: !p[trap.key] }))}
                className="w-full text-left rounded-md p-3 space-y-1 transition-colors"
                style={{ background: rev ? "rgba(162,58,30,0.03)" : "transparent", border: `1.5px solid ${rev ? VERMILION : HAIRLINE}` }}
              >
                <div className="flex items-start gap-2">
                  {rev ? <XCircle size={14} style={{ color: VERMILION, marginTop: 2, flexShrink: 0 }} /> : <AlertTriangle size={14} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />}
                  <span className="text-xs font-semibold" style={{ color: rev ? VERMILION : INK_SECONDARY }}>{trap.statement}</span>
                </div>
                {rev && (
                  <div className="pl-5 space-y-1">
                    <div className="text-xs" style={{ color: VERMILION }}><strong>Error:</strong> {trap.error}</div>
                    <div className="text-xs" style={{ color: GREEN }}><strong>Correction:</strong> {trap.correction}</div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common Mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Pairing the wrong counter-house", text: "The pairs are fixed: 12th->2nd, 10th->4th, 3rd->11th. Each obstructor has exactly one target." },
            { title: "Ignoring virodhārgala", text: "Never stop at positive argala. The house receives only the NET. Always inspect the counter-house immediately." },
            { title: "Adding instead of comparing", text: "Net = positive MINUS obstruction. The 10th's occupant works AGAINST the 4th's argala, not with it." },
            { title: "Cancelled = house destroyed", text: "Cancelled argala means reinforcement does not arrive. The house's own significations remain intact." },
          ].map((m, i) => (
            <div key={i} className="rounded-lg p-3 space-y-1.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${AMBER}` }}>
              <div className="text-xs font-bold" style={{ color: AMBER }}>{m.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
