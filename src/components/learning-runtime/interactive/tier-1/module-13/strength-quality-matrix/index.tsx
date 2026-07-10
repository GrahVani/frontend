"use client";

/**
 * Strength-Quality Matrix — Module 13 Capstone Interactive
 *
 * §7 interactive for Lesson 13.6.4.
 *
 * A 2×2 judgement matrix that fuses quantitative strength (ṣaḍbala)
 * with qualitative reading (dignity / aspect / yoga). Clickable SVG
 * matrix, preset scenarios, amplifier diagram, and discipline rules.
 */

import { useState } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import { MATRIX_CELLS, SCENARIOS, DISCIPLINE_RULES } from "./data";
import type { MatrixCell } from "./data";
import {
  Scale,
  Star,
  Zap,
  Feather,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from "lucide-react";

/* ─── Design tokens ──────────────────────────────────────────────────────── */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";

/* ─── SVG Diagram: The 2×2 Judgement Matrix ──────────────────────────────── */

function MatrixSVG({ activeKey, onSelect }: { activeKey?: string; onSelect: (k: MatrixCell["key"]) => void }) {
  const w = 400;
  const h = 320;
  const pad = 48;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const cx = pad + innerW / 2;
  const cy = pad + innerH / 2;
  const qw = innerW / 2;
  const qh = innerH / 2;

  const qPos: Record<MatrixCell["key"], { x: number; y: number }> = {
    sb: { x: cx, y: pad },      // top-right
    sm: { x: cx, y: cy },       // bottom-right
    wb: { x: pad, y: pad },     // top-left
    wm: { x: pad, y: cy },      // bottom-left
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 340 }}>
      {/* Background grid */}
      <rect x={pad} y={pad} width={innerW} height={innerH} rx={12} fill={`${SURFACE}`} stroke={HAIRLINE} strokeWidth={1.5} />

      {/* Vertical axis line (Quality) */}
      <line x1={cx} y1={pad} x2={cx} y2={pad + innerH} stroke={INK_MUTED} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.5} />

      {/* Horizontal axis line (Strength) */}
      <line x1={pad} y1={cy} x2={pad + innerW} y2={cy} stroke={INK_MUTED} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.5} />

      {/* Quadrants */}
      {MATRIX_CELLS.map((cell) => {
        const pos = qPos[cell.key];
        const isActive = activeKey === cell.key;
        const rx = 10;
        return (
          <g key={cell.key} style={{ cursor: "pointer" }} onClick={() => onSelect(cell.key)}>
            <rect
              x={pos.x + 2}
              y={pos.y + 2}
              width={qw - 4}
              height={qh - 4}
              rx={rx}
              fill={isActive ? `${cell.bgHex}18` : `${cell.bgHex}0C`}
              stroke={isActive ? cell.borderHex : `${cell.borderHex}40`}
              strokeWidth={isActive ? 2.5 : 1.5}
            />
            {/* Cell label */}
            <text
              x={pos.x + qw / 2}
              y={pos.y + qh / 2 - 6}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill={cell.color}
            >
              {cell.label}
            </text>
            {/* Cell subtitle */}
            <text
              x={pos.x + qw / 2}
              y={pos.y + qh / 2 + 10}
              textAnchor="middle"
              fontSize={8}
              fill={INK_SECONDARY}
            >
              {cell.subtitle.length > 22 ? cell.subtitle.slice(0, 22) + "…" : cell.subtitle}
            </text>
            {/* Hover/active indicator dot */}
            <circle
              cx={pos.x + qw - 12}
              cy={pos.y + 12}
              r={isActive ? 4 : 3}
              fill={cell.color}
              opacity={isActive ? 0.9 : 0.3}
            />
          </g>
        );
      })}

      {/* Axis labels — Y-axis (Strength) */}
      <text x={pad - 8} y={pad + 10} textAnchor="end" fontSize={9} fontWeight={600} fill={INK_SECONDARY}>
        Strong
      </text>
      <text x={pad - 8} y={pad + innerH - 4} textAnchor="end" fontSize={9} fontWeight={600} fill={INK_SECONDARY}>
        Weak
      </text>
      <text
        x={16}
        y={pad + innerH / 2}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill={INK_MUTED}
        transform={`rotate(-90, 16, ${pad + innerH / 2})`}
      >
        Ṣaḍbala (quantity)
      </text>

      {/* Axis labels — X-axis (Quality) */}
      <text x={pad + 8} y={pad + innerH + 18} textAnchor="start" fontSize={9} fontWeight={600} fill={INK_SECONDARY}>
        Benefic
      </text>
      <text x={pad + innerW - 8} y={pad + innerH + 18} textAnchor="end" fontSize={9} fontWeight={600} fill={INK_SECONDARY}>
        Malefic
      </text>
      <text x={pad + innerW / 2} y={pad + innerH + 32} textAnchor="middle" fontSize={9} fontWeight={700} fill={INK_MUTED}>
        Dignity / Aspect / Yoga (quality)
      </text>

      {/* Center label */}
      <circle cx={cx} cy={cy} r={3} fill={INK_MUTED} opacity={0.4} />
    </svg>
  );
}

/* ─── SVG Diagram: Amplifier visual ──────────────────────────────────────── */

function AmplifierDiagram() {
  const w = 420;
  const h = 165;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 185 }}>
      <text x={w / 2} y={20} textAnchor="middle" fontSize={12} fill={INK_SECONDARY} fontWeight={700}>
        Strength amplifies whatever the quality is
      </text>

      {/* Low-strength bar (small effect) */}
      <text x={60} y={66} textAnchor="middle" fontSize={9} fill={INK_MUTED}>Low shadbala</text>
      {/* Benefic direction */}
      <rect x={30} y={76} width={60} height={10} rx={4} fill="#2F7D5530" />
      <line x1={60} y1={86} x2={60} y2={100} stroke="#2F7D55" strokeWidth={1.5} strokeDasharray="3 2" opacity={0.5} />
      <polygon points="56,96 60,104 64,96" fill="#2F7D55" opacity={0.6} />
      <text x={60} y={118} textAnchor="middle" fontSize={8} fill="#2F7D55">Small benefit</text>
      {/* Malefic direction */}
      <line x1={60} y1={76} x2={60} y2={62} stroke="#A23A1E" strokeWidth={1.5} strokeDasharray="3 2" opacity={0.5} />
      <polygon points="56,66 60,58 64,66" fill="#A23A1E" opacity={0.6} />
      <text x={60} y={50} textAnchor="middle" fontSize={8} fill="#A23A1E">Small harm</text>

      {/* High-strength bar (large effect) */}
      <text x={180} y={66} textAnchor="middle" fontSize={9} fill={INK_MUTED}>High shadbala</text>
      <rect x={140} y={72} width={80} height={18} rx={5} fill="#2F7D5530" />
      <line x1={180} y1={90} x2={180} y2={116} stroke="#2F7D55" strokeWidth={2.5} opacity={0.7} />
      <polygon points="174,110 180,124 186,110" fill="#2F7D55" opacity={0.8} />
      <text x={180} y={140} textAnchor="middle" fontSize={9} fontWeight={600} fill="#2F7D55">Large benefit</text>
      {/* Malefic direction */}
      <line x1={180} y1={72} x2={180} y2={46} stroke="#A23A1E" strokeWidth={2.5} opacity={0.7} />
      <polygon points="174,52 180,38 186,52" fill="#A23A1E" opacity={0.8} />
      <text x={180} y={34} textAnchor="middle" fontSize={9} fontWeight={600} fill="#A23A1E">Large harm</text>

      {/* Divider */}
      <line x1={260} y1={54} x2={260} y2={126} stroke={HAIRLINE} strokeWidth={1} />

      {/* Summary equation */}
      <text x={340} y={72} textAnchor="middle" fontSize={9} fill={INK_SECONDARY} fontWeight={600}>
        Strength × Quality
      </text>
      <text x={340} y={88} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
        = Reading
      </text>
      <text x={340} y={112} textAnchor="middle" fontSize={8} fill={INK_SECONDARY}>
        Never one alone
      </text>
    </svg>
  );
}

/* ─── Icon helper ────────────────────────────────────────────────────────── */

function CellIcon({ icon, color }: { icon: MatrixCell["icon"]; color: string }) {
  const props = { size: 18, style: { color } };
  switch (icon) {
    case "star":
      return <Star {...props} />;
    case "bolt":
      return <Zap {...props} />;
    case "feather":
      return <Feather {...props} />;
    case "alert":
      return <AlertTriangle {...props} />;
  }
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function StrengthQualityMatrix() {
  const [activeKey, setActiveKey] = useState<MatrixCell["key"] | undefined>("sb");

  const activeCell = activeKey ? MATRIX_CELLS.find((c) => c.key === activeKey) : null;

  function applyScenario(cellKey: MatrixCell["key"]) {
    setActiveKey(cellKey);
  }

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Scale size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Strength-Quality Matrix
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Never read quantity without quality — or quality without quantity.
          </p>
        </div>
      </div>

      {/* ── 2×2 Matrix + Detail ──────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-4"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Click any quadrant to see the full reading. The two axes are independent —
          strength (ṣaḍbala) tells you <em>how much</em> force; quality (dignity, aspect, yoga) tells you <em>what kind</em>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Matrix SVG */}
          <div className="lg:col-span-3">
            <MatrixSVG activeKey={activeKey} onSelect={setActiveKey} />
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            {activeCell ? (
              <div
                className="rounded-lg p-4 space-y-3 h-full"
                style={{
                  background: `${activeCell.bgHex}08`,
                  border: `1px solid ${activeCell.borderHex}30`,
                  borderLeft: `3px solid ${activeCell.color}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <CellIcon icon={activeCell.icon} color={activeCell.color} />
                  <span className="text-sm font-bold" style={{ color: activeCell.color }}>
                    {activeCell.label}
                  </span>
                  {activeCell.danger && (
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: `${activeCell.color}15`, color: activeCell.color }}
                    >
                      Danger zone
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium" style={{ color: INK_SECONDARY }}>
                  {activeCell.subtitle}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                  {activeCell.reading}
                </p>
                <div className="flex items-center gap-2 text-[10px]" style={{ color: INK_MUTED }}>
                  <span className="px-1.5 py-0.5 rounded" style={{ background: `${activeCell.color}12` }}>
                    {activeCell.strength === "strong" ? "High ṣaḍbala" : "Low ṣaḍbala"}
                  </span>
                  <span>+</span>
                  <span className="px-1.5 py-0.5 rounded" style={{ background: `${activeCell.color}12` }}>
                    {activeCell.quality === "benefic" ? "Benefic context" : "Malefic context"}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="rounded-lg p-4 h-full flex items-center justify-center"
                style={{ border: `1px dashed ${HAIRLINE}` }}
              >
                <p className="text-xs" style={{ color: INK_MUTED }}>
                  Select a quadrant to see the reading.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Amplifier diagram ────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <ArrowUpRight size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            The Amplifier Principle
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Ṣaḍbala is not goodness — it is <em>amplification</em>. A strong planet makes its quality louder.
        </p>
        <AmplifierDiagram />
      </div>

      {/* ── Preset scenarios ─────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <ChevronRight size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Worked Scenarios
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Click a scenario to place it on the matrix and read the result.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SCENARIOS.map((sc) => {
            const cell = MATRIX_CELLS.find((c) => c.key === sc.cellKey)!;
            const isActive = activeKey === sc.cellKey;
            return (
              <button
                key={sc.key}
                onClick={() => applyScenario(sc.cellKey)}
                className="text-left rounded-lg p-3 transition-all hover:shadow-sm space-y-2"
                style={{
                  background: isActive ? `${cell.bgHex}10` : SURFACE,
                  border: `1.5px solid ${isActive ? cell.borderHex : HAIRLINE}`,
                  borderLeft: `3px solid ${cell.color}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
                    <IAST size="sm">{sc.planetIAST}</IAST>
                    <span className="ml-1.5 text-xs" style={{ color: INK_MUTED, opacity: 0.7 }}>
                      <Devanagari size="sm">{sc.planetDevanagari}</Devanagari>
                    </span>
                  </span>
                  <CellIcon icon={cell.icon} color={cell.color} />
                </div>
                <p className="text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
                  {sc.setup}
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{ background: `${cell.color}12`, color: cell.color }}
                  >
                    {cell.label}
                  </span>
                </div>
                <p className="text-[10px] font-medium" style={{ color: cell.color }}>
                  {sc.takeaway}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Discipline rules ─────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            The Three Discipline Rules
          </span>
        </div>
        <div className="space-y-2">
          {DISCIPLINE_RULES.map((rule) => (
            <div
              key={rule.num}
              className="rounded-lg p-3 flex items-start gap-3"
              style={{
                background: `${GOLD_ACCENT}06`,
                border: `1px solid ${GOLD_ACCENT}20`,
                borderLeft: `3px solid ${GOLD_ACCENT}`,
              }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{ background: `${GOLD_ACCENT}18`, color: GOLD_ACCENT }}
              >
                {rule.num}
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
                  {rule.title}
                </p>
                <p className="text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
                  <span style={{ color: "#A23A1E" }}>Warning: </span>
                  {rule.warning}
                </p>
                <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
                  <span style={{ color: "#2F7D55" }}>Correction: </span>
                  {rule.correction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Honest note banner ───────────────────────────────────────────── */}
      <div
        className="rounded-lg p-3 flex items-start gap-2.5"
        style={{ background: `${GOLD_ACCENT}06`, border: `1px solid ${GOLD_ACCENT}25` }}
      >
        <Info size={16} style={{ color: GOLD_ACCENT, marginTop: 2, flexShrink: 0 }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            Tier-1 is awareness; deep technique lives ahead
          </p>
          <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
            This matrix is your minimum checklist. The Tier-2 opener deep-dives the strength-vs-quality
            discipline with live-chart practice, nuanced aspect weighing, and yoga-context modulation.
            At Tier-1, internalise the rule: <strong>never read one axis alone</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
