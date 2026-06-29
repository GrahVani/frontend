"use client";

/**
 * Vipareeta Detector — Lesson 14.5.2 Interactive
 *
 * §7 interactive: flags Harṣa, Sarala, and Vimala Vipareeta Rāja Yogas.
 * Lagna selector + dusthana-lord house placements + association toggles.
 * Dusthana-triangle SVG + house ring. Refinements disclosed.
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import {
  SIGN_NAMES,
  SIGN_LORDS,
  DUSTHANAS,
  KENDRAS,
  TRIKONAS,
  getSignOfHouse,
  getLordOfHouse,
  isDusthana,
  checkVipareeta,
  PRESETS,
} from "./data";
import type { VipareetaResult } from "./data";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Sparkles,
  ChevronRight,
  ShieldAlert,
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
const DUSTHANA_COLOR = "#8B5A5A";

function grahaColor(slug: string) {
  return (grahas as Record<string, { primary: string }>)[slug]?.primary ?? INK_MUTED;
}

/* ─── SVG: Dusthana triangle ─────────────────────────────────────────────── */

function DusthanaTriangle({ results }: { results: VipareetaResult[] }) {
  const w = 360;
  const h = 260;
  const cx = w / 2;
  const cy = h / 2 + 10;
  const r = 85;

  // Positions: H6 at top, H8 bottom-left, H12 bottom-right
  const nodes: Record<number, { x: number; y: number; label: string }> = {
    6: { x: cx, y: cy - r, label: "H6" },
    8: { x: cx - r * 0.866, y: cy + r * 0.5, label: "H8" },
    12: { x: cx + r * 0.866, y: cy + r * 0.5, label: "H12" },
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 260 }}>
      <text x={cx} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        Dusthana lords and their placements
      </text>

      {/* Triangle edges */}
      <line x1={nodes[6].x} y1={nodes[6].y} x2={nodes[8].x} y2={nodes[8].y} stroke={HAIRLINE} strokeWidth={1.5} />
      <line x1={nodes[8].x} y1={nodes[8].y} x2={nodes[12].x} y2={nodes[12].y} stroke={HAIRLINE} strokeWidth={1.5} />
      <line x1={nodes[12].x} y1={nodes[12].y} x2={nodes[6].x} y2={nodes[6].y} stroke={HAIRLINE} strokeWidth={1.5} />

      {/* Nodes */}
      {results.map((res) => {
        const node = nodes[res.lordHouse];
        const isFormed = res.formed;
        const isStrong = res.strength === "strong";
        const color = grahaColor(res.lordGrahaSlug);

        return (
          <g key={res.key}>
            {/* Node circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={isFormed ? 28 : 22}
              fill={SURFACE}
              stroke={isFormed ? (isStrong ? GREEN : AMBER) : DUSTHANA_COLOR}
              strokeWidth={isFormed ? 3 : 1.5}
            />
            {/* Lord name */}
            <text x={node.x} y={node.y - 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>
              {res.lordIAST}
            </text>
            <text x={node.x} y={node.y + 10} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
              {node.label} lord
            </text>

            {/* Placement indicator — small circle outside main node */}
            {isFormed && (
              <>
                <line
                  x1={node.x}
                  y1={node.y + (res.lordHouse === 6 ? 28 : -28)}
                  x2={node.x + (res.lordHouse === 8 ? -35 : res.lordHouse === 12 ? 35 : 0)}
                  y2={node.y + (res.lordHouse === 6 ? 50 : -50)}
                  stroke={isStrong ? GREEN : AMBER}
                  strokeWidth={1.5}
                  strokeDasharray={res.inOwnDusthana ? "4 3" : undefined}
                />
                <circle
                  cx={node.x + (res.lordHouse === 8 ? -35 : res.lordHouse === 12 ? 35 : 0)}
                  cy={node.y + (res.lordHouse === 6 ? 50 : -50)}
                  r={14}
                  fill={SURFACE}
                  stroke={isStrong ? GREEN : AMBER}
                  strokeWidth={2}
                />
                <text
                  x={node.x + (res.lordHouse === 8 ? -35 : res.lordHouse === 12 ? 35 : 0)}
                  y={node.y + (res.lordHouse === 6 ? 50 : -50) + 4}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill={isStrong ? GREEN : AMBER}
                >
                  H{res.placedHouse}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(16, ${h - 32})`}>
        <circle cx={8} cy={0} r={6} fill={SURFACE} stroke={GREEN} strokeWidth={2} />
        <text x={20} y={4} fontSize={8} fill={INK_SECONDARY}>Strong (another dusthana)</text>
        <circle cx={130} cy={0} r={6} fill={SURFACE} stroke={AMBER} strokeWidth={2} />
        <text x={142} y={4} fontSize={8} fill={INK_SECONDARY}>Moderate/weak</text>
        <circle cx={230} cy={0} r={6} fill={SURFACE} stroke={DUSTHANA_COLOR} strokeWidth={1.5} />
        <text x={242} y={4} fontSize={8} fill={INK_SECONDARY}>Not formed</text>
      </g>
    </svg>
  );
}

/* ─── SVG: House position ring ───────────────────────────────────────────── */

function HouseRing({
  lagnaSign,
  lord6House,
  lord8House,
  lord12House,
}: {
  lagnaSign: number;
  lord6House: number;
  lord8House: number;
  lord12House: number;
}) {
  const w = 260;
  const h = 260;
  const cx = w / 2;
  const cy = h / 2;
  const r = 82;

  const polar = (house: number) => {
    const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const lord6Info = getLordOfHouse(6, lagnaSign);
  const lord8Info = getLordOfHouse(8, lagnaSign);
  const lord12Info = getLordOfHouse(12, lagnaSign);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 260 }}>
      <text x={cx} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        Chart positions (dusthanas shaded)
      </text>

      <circle cx={cx} cy={cy} r={r} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r - 20} fill="none" stroke={HAIRLINE} strokeWidth={1} strokeDasharray="4 4" />

      {Array.from({ length: 12 }, (_, i) => {
        const h = i + 1;
        const pos = polar(h);
        const isDust = isDusthana(h);
        const isLagna = h === 1;

        return (
          <g key={h}>
            <line x1={cx} y1={cy} x2={pos.x} y2={pos.y} stroke={isDust ? DUSTHANA_COLOR : HAIRLINE} strokeWidth={isDust ? 2 : 1} />
            <text
              x={pos.x * 0.84 + cx * 0.16}
              y={pos.y * 0.84 + cy * 0.16 + 4}
              textAnchor="middle"
              fontSize={isDust ? 11 : 9}
              fontWeight={isDust ? 800 : 600}
              fill={
                h === lord6House ? grahaColor(lord6Info.grahaSlug)
                  : h === lord8House ? grahaColor(lord8Info.grahaSlug)
                    : h === lord12House ? grahaColor(lord12Info.grahaSlug)
                      : isDust ? DUSTHANA_COLOR
                        : isLagna ? GOLD_ACCENT
                          : INK_MUTED
              }
            >
              {h === lord6House ? "6L" : h === lord8House ? "8L" : h === lord12House ? "12L" : `H${h}`}
            </text>
          </g>
        );
      })}

      {/* Center: lagna sign */}
      <circle cx={cx} cy={cy} r={20} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={2} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill={GOLD_ACCENT}>
        {SIGN_NAMES[lagnaSign - 1].slice(0, 4)}
      </text>

      {/* Legend */}
      <g transform={`translate(20, ${h - 44})`}>
        <rect x={0} y={0} width={10} height={10} rx={2} fill={DUSTHANA_COLOR} fillOpacity={0.15} stroke={DUSTHANA_COLOR} strokeWidth={1} />
        <text x={16} y={9} fontSize={8} fill={INK_SECONDARY}>Dusthana</text>
        <rect x={70} y={0} width={10} height={10} rx={2} fill={grahaColor(lord6Info.grahaSlug)} fillOpacity={0.2} stroke={grahaColor(lord6Info.grahaSlug)} strokeWidth={1} />
        <text x={86} y={9} fontSize={8} fill={INK_SECONDARY}>6L</text>
        <rect x={110} y={0} width={10} height={10} rx={2} fill={grahaColor(lord8Info.grahaSlug)} fillOpacity={0.2} stroke={grahaColor(lord8Info.grahaSlug)} strokeWidth={1} />
        <text x={126} y={9} fontSize={8} fill={INK_SECONDARY}>8L</text>
        <rect x={150} y={0} width={10} height={10} rx={2} fill={grahaColor(lord12Info.grahaSlug)} fillOpacity={0.2} stroke={grahaColor(lord12Info.grahaSlug)} strokeWidth={1} />
        <text x={166} y={9} fontSize={8} fill={INK_SECONDARY}>12L</text>
      </g>
    </svg>
  );
}

/* ─── Toggle row helper ──────────────────────────────────────────────────── */

function ToggleRow({
  label,
  checked,
  onChange,
  accent,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  accent?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
      <span className="text-xs" style={{ color: INK_SECONDARY }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors"
        style={{ background: checked ? (accent ?? GREEN) : HAIRLINE }}
        aria-pressed={checked}
      >
        <span
          className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform"
          style={{ transform: checked ? "translateX(14px)" : "translateX(2px)", marginTop: 3 }}
        />
      </button>
    </label>
  );
}

/* ─── Yoga result card ───────────────────────────────────────────────────── */

function YogaCard({ result }: { result: VipareetaResult }) {
  const borderColor = result.formed
    ? result.strength === "strong" ? GREEN : result.strength === "moderate" ? AMBER : AMBER
    : VERMILION;

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${borderColor}` }}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: grahaColor(result.lordGrahaSlug) }}>
            <IAST>{result.nameIAST}</IAST>
          </span>
          <Devanagari size="sm" style={{ fontSize: "11px", color: INK_MUTED }}>
            {result.nameDevanagari}
          </Devanagari>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: result.formed
              ? result.strength === "strong" ? `${GREEN}15` : `${AMBER}15`
              : `${VERMILION}12`,
            color: result.formed
              ? result.strength === "strong" ? GREEN : AMBER
              : VERMILION,
          }}
        >
          {result.formed
            ? result.strength === "strong" ? "Strong" : result.strength === "moderate" ? "Moderate" : "Weak"
            : "Absent"}
        </span>
      </div>

      <div className="px-4 pb-3 space-y-1.5">
        <div className="flex items-center gap-2">
          {result.formed ? (
            <CheckCircle2 size={13} style={{ color: GREEN, flexShrink: 0 }} />
          ) : (
            <XCircle size={13} style={{ color: VERMILION, flexShrink: 0 }} />
          )}
          <span className="text-xs" style={{ color: INK_SECONDARY }}>
            {result.lordIAST} (lord of H{result.lordHouse}) in H{result.placedHouse}
            {result.formed ? ` — dusthana ${result.inOwnDusthana ? "(own)" : "(another)"}` : " — not a dusthana"}
          </span>
        </div>
        {result.formed && result.associatedWithGood && (
          <div className="flex items-start gap-1.5">
            <Info size={11} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
            <span className="text-xs" style={{ color: INK_MUTED }}>
              Associated with a good-house lord or benefic — this weakens the vipareeta logic.
            </span>
          </div>
        )}
      </div>

      <div className="px-4 py-2 text-xs" style={{ color: INK_SECONDARY, background: `${GOLD_ACCENT}08` }}>
        <strong>Flavor:</strong> {result.flavor}
      </div>
      <div className="px-4 py-2 text-xs font-semibold" style={{ color: INK_SECONDARY, background: `${borderColor}06` }}>
        Grade: {result.grade}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function VipareetaDetector() {
  const [lagnaSign, setLagnaSign] = useState(1);
  const [lord6House, setLord6House] = useState(8);
  const [lord8House, setLord8House] = useState(3);
  const [lord12House, setLord12House] = useState(5);
  const [harshaAssoc, setHarshaAssoc] = useState(false);
  const [saralaAssoc, setSaralaAssoc] = useState(false);
  const [vimalaAssoc, setVimalaAssoc] = useState(false);

  const results = useMemo(
    () => checkVipareeta(lagnaSign, lord6House, lord8House, lord12House, harshaAssoc, saralaAssoc, vimalaAssoc),
    [lagnaSign, lord6House, lord8House, lord12House, harshaAssoc, saralaAssoc, vimalaAssoc],
  );

  const formedCount = results.filter((r) => r.formed).length;
  const strongCount = results.filter((r) => r.formed && r.strength === "strong").length;

  function applyPreset(key: string) {
    const preset = PRESETS.find((p) => p.key === key);
    if (!preset) return;
    setLagnaSign(preset.lagnaSign);
    setLord6House(preset.lord6House);
    setLord8House(preset.lord8House);
    setLord12House(preset.lord12House);
    setHarshaAssoc(preset.harshaAssoc);
    setSaralaAssoc(preset.saralaAssoc);
    setVimalaAssoc(preset.vimalaAssoc);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ShieldAlert size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Vipareeta Detector
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Flag Harṣa, Sarala, and Vimala — dusthana lords in dusthanas. Adversity turned on itself.
          </p>
        </div>
      </div>

      {/* Lagna + Presets */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>Chart Setup</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESETS.map((preset) => (
              <button
                key={preset.key}
                onClick={() => applyPreset(preset.key)}
                className="px-2.5 py-1.5 rounded-md text-xs font-semibold"
                style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
              >
                {preset.label}
              </button>
            ))}
            <button
              onClick={() => applyPreset("harsha-example")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
              style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Lagna:</span>
          <select
            value={lagnaSign}
            onChange={(e) => setLagnaSign(Number(e.target.value))}
            className="rounded-md px-3 py-1.5 text-sm"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
          >
            {SIGN_NAMES.map((name, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}. {name}
              </option>
            ))}
          </select>
          <span className="text-xs" style={{ color: INK_MUTED }}>
            6th lord: <strong style={{ color: grahaColor(getLordOfHouse(6, lagnaSign).grahaSlug) }}>{getLordOfHouse(6, lagnaSign).iast}</strong>
            {" · "}8th lord: <strong style={{ color: grahaColor(getLordOfHouse(8, lagnaSign).grahaSlug) }}>{getLordOfHouse(8, lagnaSign).iast}</strong>
            {" · "}12th lord: <strong style={{ color: grahaColor(getLordOfHouse(12, lagnaSign).grahaSlug) }}>{getLordOfHouse(12, lagnaSign).iast}</strong>
          </span>
        </div>
      </div>

      {/* Controls + Diagrams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Controls */}
        <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <ChevronRight size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>Dusthana Lord Placements</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "6th lord house", value: lord6House, onChange: setLord6House, color: grahaColor(getLordOfHouse(6, lagnaSign).grahaSlug) },
              { label: "8th lord house", value: lord8House, onChange: setLord8House, color: grahaColor(getLordOfHouse(8, lagnaSign).grahaSlug) },
              { label: "12th lord house", value: lord12House, onChange: setLord12House, color: grahaColor(getLordOfHouse(12, lagnaSign).grahaSlug) },
            ].map((ctrl) => (
              <label key={ctrl.label} className="space-y-1">
                <span className="text-xs font-semibold" style={{ color: ctrl.color }}>{ctrl.label}</span>
                <select
                  value={ctrl.value}
                  onChange={(e) => ctrl.onChange(Number(e.target.value))}
                  className="w-full rounded-md px-2 py-1.5 text-sm"
                  style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>H{i + 1}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Refinements — association with good-house lords / benefics</span>
            <div className="grid grid-cols-1 gap-2">
              <ToggleRow
                label={`${getLordOfHouse(6, lagnaSign).iast} (6L) associated with benefic/good lord`}
                checked={harshaAssoc}
                onChange={setHarshaAssoc}
                accent={grahaColor(getLordOfHouse(6, lagnaSign).grahaSlug)}
              />
              <ToggleRow
                label={`${getLordOfHouse(8, lagnaSign).iast} (8L) associated with benefic/good lord`}
                checked={saralaAssoc}
                onChange={setSaralaAssoc}
                accent={grahaColor(getLordOfHouse(8, lagnaSign).grahaSlug)}
              />
              <ToggleRow
                label={`${getLordOfHouse(12, lagnaSign).iast} (12L) associated with benefic/good lord`}
                checked={vimalaAssoc}
                onChange={setVimalaAssoc}
                accent={grahaColor(getLordOfHouse(12, lagnaSign).grahaSlug)}
              />
            </div>
          </div>
        </div>

        {/* Diagrams */}
        <div className="space-y-3">
          <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <DusthanaTriangle results={results} />
          </div>
          <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <HouseRing lagnaSign={lagnaSign} lord6House={lord6House} lord8House={lord8House} lord12House={lord12House} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ChevronRight size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Vipareeta Results</h4>
          <span className="text-xs ml-auto" style={{ color: INK_MUTED }}>
            {formedCount} formed · {strongCount} strong
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {results.map((res) => (
            <YogaCard key={res.key} result={res} />
          ))}
        </div>
      </div>

      {/* Refinement note */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
        <div className="flex items-center gap-2">
          <Info size={14} style={{ color: AMBER }} />
          <span className="text-xs font-bold" style={{ color: AMBER }}>Strengthening Refinements (source-varying)</span>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          The yoga is generally held <strong>stronger</strong> when the dusthana lord sits in a dusthana
          <em> other than its own</em> and does <strong>not</strong> associate with lords of good houses or benefics —
          keeping the &ldquo;malefic spoils malefic&rdquo; logic clean. Exact emphasis varies by source.
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
            { title: "Reading any dusthana lord as bad", text: "A 6/8/12 lord in a dusthana can form a Vipareeta Rāja Yoga — a benefit, not a problem." },
            { title: "Confusing the three", text: "Harṣa = 6th lord; Sarala = 8th lord; Vimala = 12th lord. Each must be in any dusthana (6/8/12)." },
            { title: "Ignoring refinements", text: "The yoga is stronger when the lord is in another dusthana and unassociated with good-house lords or benefics." },
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
