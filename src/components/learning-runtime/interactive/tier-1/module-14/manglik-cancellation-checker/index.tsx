"use client";

/**
 * Manglik Cancellation Checker — Lesson 14.6.2 Interactive
 *
 * §7 interactive: tests all 15+ grouped cancellations (A–E) against a chart.
 * Mars sign/house + toggle checklist + cancellation gauge SVG + weighted result.
 */

import { useState, useMemo } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { SIGN_NAMES, CANCELLATIONS, runCheck, PRESETS } from "./data";
import type { CheckState, GroupKey } from "./data";
import {
  Shield,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  Sparkles,
  Scale,
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

const GROUP_COLORS: Record<GroupKey, string> = {
  A: "#2F7D55",
  B: "#356CAB",
  C: "#8B5A9F",
  D: "#C8841E",
  E: "#8A7E5E",
};

const GROUP_LABELS: Record<GroupKey, string> = {
  A: "Dignity of Mars",
  B: "Benefic influence",
  C: "Mutual cancellation",
  D: "Sign-house specifics",
  E: "Folk / regional",
};

/* ─── SVG: Cancellation gauge ────────────────────────────────────────────── */

function CancellationGauge({
  metCount,
  firmCount,
  traditionCount,
  folkCount,
}: {
  metCount: number;
  firmCount: number;
  traditionCount: number;
  folkCount: number;
}) {
  const w = 420;
  const h = 90;
  const total = CANCELLATIONS.length;
  const barW = 320;
  const barX = (w - barW) / 2;
  const segW = barW / total;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 100 }}>
      <text x={w / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        Cancellation gauge — {metCount} of {total} conditions met
      </text>

      {/* Segments */}
      {CANCELLATIONS.map((c, i) => {
        const met = i < metCount; // This is a simplification; we'll color by actual met status
        // Actually we need to know which specific ones are met. Let me pass results instead.
        return null;
      })}

      {/* Simplified: stacked bars by weight */}
      <rect x={barX} y={32} width={barW} height={18} rx={4} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />

      {firmCount > 0 && (
        <rect x={barX} y={32} width={(firmCount / total) * barW} height={18} rx={4} fill={GREEN} fillOpacity={0.7} />
      )}
      {traditionCount > 0 && (
        <rect
          x={barX + (firmCount / total) * barW}
          y={32}
          width={(traditionCount / total) * barW}
          height={18}
          rx={4}
          fill={AMBER}
          fillOpacity={0.7}
        />
      )}
      {folkCount > 0 && (
        <rect
          x={barX + ((firmCount + traditionCount) / total) * barW}
          y={32}
          width={(folkCount / total) * barW}
          height={18}
          rx={4}
          fill={INK_MUTED}
          fillOpacity={0.5}
        />
      )}

      {/* Legend */}
      <g transform={`translate(${barX}, 60)`}>
        <rect x={0} y={0} width={10} height={10} rx={2} fill={GREEN} fillOpacity={0.7} />
        <text x={16} y={9} fontSize={8} fill={INK_SECONDARY}>Firm ({firmCount})</text>
        <rect x={75} y={0} width={10} height={10} rx={2} fill={AMBER} fillOpacity={0.7} />
        <text x={91} y={9} fontSize={8} fill={INK_SECONDARY}>Tradition ({traditionCount})</text>
        <rect x={170} y={0} width={10} height={10} rx={2} fill={INK_MUTED} fillOpacity={0.5} />
        <text x={186} y={9} fontSize={8} fill={INK_SECONDARY}>Folk ({folkCount})</text>
        <text x={245} y={9} fontSize={8} fill={INK_MUTED}>Total: {metCount}/{total}</text>
      </g>
    </svg>
  );
}

/* ─── Toggle helper ──────────────────────────────────────────────────────── */

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
      <span className="text-xs" style={{ color: INK_SECONDARY }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors"
        style={{ background: checked ? GREEN : HAIRLINE }}
        aria-pressed={checked}
      >
        <span className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform" style={{ transform: checked ? "translateX(14px)" : "translateX(2px)", marginTop: 3 }} />
      </button>
    </label>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function ManglikCancellationChecker() {
  const [state, setState] = useState<CheckState>({
    marsSign: 10,
    marsHouse: 7,
    jupiterAspect: false,
    jupiterSameHouse: false,
    otherBeneficAspect: false,
    mutualManglik: false,
    bornTuesday: false,
    ageOver28: false,
    strong7thLordVenus: false,
  });

  const result = useMemo(() => runCheck(state), [state]);

  function setField<K extends keyof CheckState>(field: K, value: CheckState[K]) {
    setState((prev) => ({ ...prev, [field]: value }));
  }

  function applyPreset(key: string) {
    const preset = PRESETS[key];
    if (!preset) return;
    setState({ ...preset });
  }

  const groups: GroupKey[] = ["A", "B", "C", "D", "E"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Manglik Cancellation Checker
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Test all 15+ grouped cancellations. Weight firmly-classical above tradition-specific.
          </p>
        </div>
      </div>

      {/* Mars setup + Presets */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>Chart Setup</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(PRESETS).map(([key, preset]) => {
              const labels: Record<string, string> = {
                "dignity-exalt": "Dignity: exalted",
                "jupiter-aspect": "Jupiter aspect",
                mutual: "Mutual",
                "sign-house": "Sign-house",
                "folk-mix": "Folk mix",
                none: "None",
              };
              return (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className="px-2 py-1.5 rounded-md text-xs font-semibold"
                  style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
                >
                  {labels[key] || key}
                </button>
              );
            })}
            <button
              onClick={() => applyPreset("dignity-exalt")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
              style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Mars sign</span>
            <select
              value={state.marsSign}
              onChange={(e) => setField("marsSign", Number(e.target.value))}
              className="w-full rounded-md px-3 py-1.5 text-sm"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {SIGN_NAMES.map((name, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}. {name}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Mars house</span>
            <select
              value={state.marsHouse}
              onChange={(e) => setField("marsHouse", Number(e.target.value))}
              className="w-full rounded-md px-3 py-1.5 text-sm"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>H{i + 1}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Cancellation checklist */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Scale size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Cancellation Checklist</h4>
          <span className="text-xs ml-auto" style={{ color: INK_MUTED }}>
            {result.metCount} met · {result.firmCount} firm · {result.traditionCount} tradition · {result.folkCount} folk
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {groups.map((g) => {
            const groupItems = result.results.filter((r) => r.group === g);
            const groupMet = groupItems.filter((r) => r.met).length;
            const color = GROUP_COLORS[g];

            return (
              <div
                key={g}
                className="rounded-lg p-3 space-y-2"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${color}` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color }}>
                    Group {g}: {GROUP_LABELS[g]}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: groupMet > 0 ? color : INK_MUTED }}>
                    {groupMet}/{groupItems.length}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {groupItems.map((item) => {
                    const isToggle = item.key.startsWith("B") || item.key.startsWith("C") || item.key.startsWith("E");
                    const toggleKey =
                      item.key === "B1" ? "jupiterAspect" :
                      item.key === "B2" ? "otherBeneficAspect" :
                      item.key === "B3" ? "jupiterSameHouse" :
                      item.key === "C1" ? "mutualManglik" :
                      item.key === "E1" ? "bornTuesday" :
                      item.key === "E2" ? "ageOver28" :
                      item.key === "E3" ? "strong7thLordVenus" : null;

                    return (
                      <div key={item.key} className="flex items-start gap-2">
                        {item.met ? (
                          <CheckCircle2 size={13} style={{ color: GREEN, flexShrink: 0, marginTop: 2 }} />
                        ) : (
                          <XCircle size={13} style={{ color: INK_MUTED, flexShrink: 0, marginTop: 2 }} />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs" style={{ color: item.met ? INK_SECONDARY : INK_MUTED }}>
                              {item.label}
                            </span>
                            {isToggle && toggleKey && (
                              <button
                                type="button"
                                onClick={() => setField(toggleKey as keyof CheckState, !state[toggleKey as keyof CheckState])}
                                className="relative inline-flex h-4 w-7 shrink-0 rounded-full transition-colors"
                                style={{ background: state[toggleKey as keyof CheckState] ? GREEN : HAIRLINE }}
                                aria-pressed={!!state[toggleKey as keyof CheckState]}
                              >
                                <span className="inline-block h-2.5 w-2.5 rounded-full bg-white transition-transform" style={{ transform: state[toggleKey as keyof CheckState] ? "translateX(10px)" : "translateX(2px)", marginTop: 3 }} />
                              </button>
                            )}
                          </div>
                          <span className="text-xs" style={{ color: INK_MUTED }}>{item.detailText}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gauge + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <CancellationGauge
            metCount={result.metCount}
            firmCount={result.firmCount}
            traditionCount={result.traditionCount}
            folkCount={result.folkCount}
          />
        </div>

        <div
          className="rounded-lg p-4 space-y-3"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${result.overallColor}` }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Overall Verdict</h4>
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: `${result.overallColor}15`, color: result.overallColor }}
            >
              {result.overallLabel}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: GREEN }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Firmly-classical: dignity, benefic influence, mutual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: AMBER }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Tradition-specific: sign-house verses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: INK_MUTED }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Folk / regional: weakest authority</span>
            </div>
          </div>
        </div>
      </div>

      {/* Honest preface reminder */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
        <div className="flex items-center gap-2">
          <Info size={14} style={{ color: AMBER }} />
          <span className="text-xs font-bold" style={{ color: AMBER }}>Honest Preface</span>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          The "15+" is <strong>not one canonical list</strong>. It <strong>aggregates</strong> across the Bṛhat Pārāśara Horā Śāstra,
          marriage (Vivāha) texts, and regional custom. Some items are firmly classical; others (sign-house specifics, folk rules)
          are <strong>tradition-specific</strong>. Treat the <em>grouping</em> as the durable knowledge.
        </p>
      </div>

      {/* Discipline reminder */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
        <div className="flex items-center gap-2">
          <ChevronRight size={14} style={{ color: GREEN }} />
          <span className="text-xs font-bold" style={{ color: GREEN }}>The Discipline</span>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          Because so many cancellations exist, <strong>most Manglik charts carry at least one</strong>.
          The rule is absolute: <strong>never declare a Manglik problem without checking the cancellations first.</strong>
          Report the doṣa <em>and</em> its cancellation status together, and weight the firmly-classical items (A–C)
          above the tradition-specific ones (D–E).
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
            { title: "Declaring without checking", text: "Never declare a Manglik problem without running the cancellation checklist first. Most charts carry at least one." },
            { title: "Treating folk rules as firm", text: "Weight dignity, benefic influence, and mutual cancellation above folk rules like 'born on Tuesday.'" },
            { title: "Presenting '15' as canonical", text: "The number aggregates across texts and traditions — not one canonical list. Say so honestly." },
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
