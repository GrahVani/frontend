"use client";

/**
 * Ṣaḍbala Scorecard — The Interpretive Application Interactive
 *
 * §7 interactive for Lesson 13.5.3.
 *
 * Builds a per-planet strength scorecard: enter totals, see ratios,
 * categorise into Uttama/Madhya/Adhama bands, and get reading guidance.
 * Rich SVG diagrams visualise the band spectrum, the workflow, and
 * the confidence-vs-virtue distinction.
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import {
  REQUIRED_MINIMA,
  REQUIRED_MAP,
  BANDS,
  bandFromRatio,
  KARAKATVA_MAP,
  SCORECARD_PRESET,
} from "./data";
import {
  ClipboardCheck,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Info,
  ArrowRight,
  Shield,
  ZapOff,
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
const BLUE = "#356CAB";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function grahaColor(slug: GrahaSlug): string {
  return grahas[slug].primary;
}

/* ─── SVG Diagram: Band spectrum with planet markers ─────────────────────── */

function BandSpectrum({ entries }: { entries: { slug: GrahaSlug; ratio: number }[] }) {
  const chartW = 520;
  const chartH = 130;
  const barY = 82;
  const barH = 22;
  const leftPad = 30;
  const barW = chartW - leftPad - 30;
  const maxRatio = 2.0;

  function xForRatio(r: number) {
    return leftPad + (Math.min(r, maxRatio) / maxRatio) * barW;
  }

  const markerLayout = entries.map((entry) => {
    const baseX = xForRatio(entry.ratio);
    const siblings = entries.filter((other) => Math.abs(xForRatio(other.ratio) - baseX) < 8);
    const siblingIndex = siblings.findIndex((other) => other.slug === entry.slug);
    const middle = (siblings.length - 1) / 2;
    return {
      ...entry,
      x: baseX + (siblingIndex - middle) * 18,
      anchorX: baseX + (siblingIndex - middle) * 8,
      yOffset: siblings.length > 1 ? -18 - siblingIndex * 26 : -28,
    };
  });

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 150 }}>
      {/* Adhama zone */}
      <rect x={leftPad} y={barY} width={(0.5 / maxRatio) * barW} height={barH} rx={4} fill={VERMILION} opacity={0.18} />
      <text x={leftPad + (0.25 / maxRatio) * barW} y={barY + barH + 14} textAnchor="middle" fontSize={9} fill={VERMILION} fontWeight={600}>
        Adhama (&lt;0.5)
      </text>

      {/* Madhya zone */}
      <rect x={leftPad + (0.5 / maxRatio) * barW} y={barY} width={(0.5 / maxRatio) * barW} height={barH} rx={4} fill={AMBER} opacity={0.18} />
      <text x={leftPad + (0.75 / maxRatio) * barW} y={barY + barH + 14} textAnchor="middle" fontSize={9} fill={AMBER} fontWeight={600}>
        Madhya (0.5–1.0)
      </text>

      {/* Uttama zone */}
      <rect x={leftPad + (1.0 / maxRatio) * barW} y={barY} width={(1.0 / maxRatio) * barW} height={barH} rx={4} fill={GREEN} opacity={0.18} />
      <text x={leftPad + (1.5 / maxRatio) * barW} y={barY + barH + 14} textAnchor="middle" fontSize={9} fill={GREEN} fontWeight={600}>
        Uttama (&gt;1.0)
      </text>

      {/* 0.5 divider */}
      <line x1={xForRatio(0.5)} y1={barY - 4} x2={xForRatio(0.5)} y2={barY + barH + 4} stroke={AMBER} strokeWidth={1.5} strokeDasharray="3 3" />
      <text x={xForRatio(0.5)} y={barY - 8} textAnchor="middle" fontSize={9} fill={AMBER} fontWeight={700}>
        0.5
      </text>

      {/* 1.0 divider */}
      <line x1={xForRatio(1.0)} y1={barY - 4} x2={xForRatio(1.0)} y2={barY + barH + 4} stroke={GREEN} strokeWidth={1.5} strokeDasharray="3 3" />
      <text x={xForRatio(1.0)} y={barY - 8} textAnchor="middle" fontSize={9} fill={GREEN} fontWeight={700}>
        1.0
      </text>

      {/* Planet markers */}
      {markerLayout.map((e) => {
        const x = e.x;
        const col = grahaColor(e.slug);
        const band = bandFromRatio(e.ratio);
        const yOffset = e.yOffset;
        return (
          <g key={e.slug}>
            <line x1={x} y1={barY + yOffset + 10} x2={e.anchorX} y2={barY - 1} stroke={col} strokeWidth={1.8} strokeDasharray="3 2" opacity="0.9" />
            <circle cx={x} cy={barY + yOffset} r={10} fill={`${col}18`} stroke={col} strokeWidth={1.5} />
            <text x={x} y={barY + yOffset + 3} textAnchor="middle" fontSize={8} fill={col} fontWeight={700}>
              <IAST size="sm">{REQUIRED_MAP[e.slug].nameIAST}</IAST>
            </text>
            <text x={x} y={barY + yOffset - 12} textAnchor="middle" fontSize={8} fill={band.color} fontWeight={700}>
              {e.ratio.toFixed(2)}×
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── SVG Diagram: Workflow (4 steps) ────────────────────────────────────── */

function WorkflowDiagram() {
  const steps = [
    { label: "Compute", desc: "Sum the 6 components", icon: "Σ" },
    { label: "Compare", desc: "Total ÷ required", icon: "÷" },
    { label: "Categorise", desc: "Ratio → band", icon: "◎" },
    { label: "Apply", desc: "Read with confidence", icon: "→" },
  ];
  const stepW = 90;
  const gap = 20;
  const chartW = steps.length * stepW + (steps.length - 1) * gap + 40;
  const chartH = 90;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 110 }}>
      {steps.map((s, i) => {
        const x = 20 + i * (stepW + gap);
        const isLast = i === steps.length - 1;
        return (
          <g key={s.label}>
            {/* Box */}
            <rect x={x} y={20} width={stepW} height={50} rx={8} fill={SURFACE} stroke={isLast ? `${GREEN}50` : HAIRLINE} strokeWidth={isLast ? 2 : 1} />
            <text x={x + stepW / 2} y={38} textAnchor="middle" fontSize={10} fill={isLast ? GREEN : INK_SECONDARY} fontWeight={700}>
              {s.label}
            </text>
            <text x={x + stepW / 2} y={54} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
              {s.desc}
            </text>

            {/* Arrow */}
            {!isLast && (
              <>
                <line x1={x + stepW + 4} y1={45} x2={x + stepW + gap - 4} y2={45} stroke={GOLD_ACCENT} strokeWidth={1.5} />
                <polygon points={`${x + stepW + gap - 4},${45 - 4} ${x + stepW + gap - 4},${45 + 4} ${x + stepW + gap + 2},${45}`} fill={GOLD_ACCENT} />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── SVG Diagram: Confidence vs Virtue ──────────────────────────────────── */

function ConfidenceVsVirtue() {
  const chartW = 420;
  const chartH = 130;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 150 }}>
      <text x={chartW / 2} y={16} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
        Strength = confidence, not virtue
      </text>

      {/* Strong Malefic */}
      <g transform="translate(50, 30)">
        <rect x={0} y={0} width={150} height={85} rx={8} fill={`${VERMILION}08`} stroke={`${VERMILION}35`} strokeWidth={1.5} />
        <text x={75} y={22} textAnchor="middle" fontSize={10} fill={VERMILION} fontWeight={700}>
          Strong Malefic
        </text>
        <text x={75} y={40} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          Acts <strong>firmly</strong>
        </text>
        <text x={75} y={56} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
          Result may be hard,
        </text>
        <text x={75} y={70} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
          but it <strong>delivers</strong>
        </text>
      </g>

      {/* VS */}
      <text x={210} y={80} textAnchor="middle" fontSize={14} fill={INK_MUTED} fontWeight={700}>
        vs
      </text>

      {/* Weak Benefic */}
      <g transform="translate(220, 30)">
        <rect x={0} y={0} width={150} height={85} rx={8} fill={`${GREEN}08`} stroke={`${GREEN}35`} strokeWidth={1.5} />
        <text x={75} y={22} textAnchor="middle" fontSize={10} fill={GREEN} fontWeight={700}>
          Weak Benefic
        </text>
        <text x={75} y={40} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          Acts <strong>weakly</strong>
        </text>
        <text x={75} y={56} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
          Result may be pleasant,
        </text>
        <text x={75} y={70} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
          but it <strong>fails to deliver</strong>
        </text>
      </g>
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function ShadbalaScorecard() {
  const [totals, setTotals] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    REQUIRED_MINIMA.forEach((r) => {
      const preset = SCORECARD_PRESET.find((p) => p.grahaSlug === r.grahaSlug);
      map[r.grahaSlug] = preset ? preset.totalRupas : r.requiredRupas;
    });
    return map;
  });

  const scorecard = useMemo(() => {
    return REQUIRED_MINIMA.map((r) => {
      const total = totals[r.grahaSlug] ?? 0;
      const ratio = total / r.requiredRupas;
      const band = bandFromRatio(ratio);
      const karaka = KARAKATVA_MAP[r.grahaSlug];
      return { ...r, total, ratio, band, karaka };
    });
  }, [totals]);

  function updateTotal(slug: string, val: number) {
    setTotals((prev) => ({ ...prev, [slug]: val }));
  }

  function applyPreset() {
    const map: Record<string, number> = {};
    REQUIRED_MINIMA.forEach((r) => {
      const preset = SCORECARD_PRESET.find((p) => p.grahaSlug === r.grahaSlug);
      map[r.grahaSlug] = preset ? preset.totalRupas : r.requiredRupas;
    });
    setTotals(map);
  }

  const spectrumEntries = scorecard
    .filter((s) => (totals[s.grahaSlug] ?? 0) > 0)
    .map((s) => ({ slug: s.grahaSlug, ratio: s.ratio }));

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <ClipboardCheck size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST size="md">Ṣaḍbala</IAST>{" "}
            <span style={{ fontFamily: "var(--font-sans)", fontStyle: "normal", fontWeight: 600 }}>
              Scorecard
            </span>
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Compute → Compare → Categorise → Apply. Strength is confidence, not virtue.
          </p>
        </div>
      </div>

      {/* ── Workflow diagram ─────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <ArrowRight size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            The Four-Step Workflow
          </span>
        </div>
        <WorkflowDiagram />
      </div>

      {/* ── Scorecard table ──────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              Per-Planet Scorecard
            </span>
          </div>
          <button
            onClick={applyPreset}
            className="text-xs px-3 py-1.5 rounded-md font-medium transition-all hover:opacity-90"
            style={{ background: `${GOLD_ACCENT}15`, color: GOLD_ACCENT, border: `1px solid ${GOLD_ACCENT}40` }}
          >
            Load worked example
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Planet
                </th>
                <th className="text-right py-2 pr-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Total
                </th>
                <th className="text-right py-2 pr-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Required
                </th>
                <th className="text-right py-2 pr-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Ratio
                </th>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Band
                </th>
                <th className="text-left py-2 pl-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Reading
                </th>
              </tr>
            </thead>
            <tbody>
              {scorecard.map((s) => {
                const col = grahaColor(s.grahaSlug);
                return (
                  <tr
                    key={s.grahaSlug}
                    style={{
                      borderBottom: `1px solid ${HAIRLINE}`,
                      borderLeft: `3px solid ${s.band.color}`,
                    }}
                  >
                    <td className="py-2.5 pr-3 pl-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: col }} />
                        <span className="font-medium" style={{ color: INK_PRIMARY }}>
                          <IAST size="sm">{s.nameIAST}</IAST>
                        </span>
                        <span style={{ color: INK_MUTED }}>
                          <Devanagari size="sm" style={{ fontSize: "13px", opacity: 0.7 }}>
                            {s.nameDevanagari}
                          </Devanagari>
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3">
                      <input
                        type="number"
                        step="0.1"
                        value={s.total.toFixed(1)}
                        onChange={(e) => updateTotal(s.grahaSlug, Number(e.target.value))}
                        className="w-16 text-right rounded px-1.5 py-1 text-sm font-mono"
                        style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
                      />
                    </td>
                    <td className="py-2.5 pr-3 text-right font-mono text-xs" style={{ color: INK_MUTED }}>
                      {s.requiredRupas}
                    </td>
                    <td className="py-2.5 pr-3 text-right font-mono text-sm font-bold" style={{ color: s.band.color }}>
                      {s.ratio.toFixed(2)}×
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${s.band.color}15`,
                          color: s.band.color,
                          border: `1px solid ${s.band.color}40`,
                        }}
                      >
                        <IAST size="sm">{s.band.labelIAST}</IAST>
                      </span>
                    </td>
                    <td className="py-2.5 pl-3">
                      <p className="text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.4 }}>
                        {s.band.readingGuidance}
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Band spectrum diagram ────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Shield size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            The Band Spectrum
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Planets positioned by their ratio (total ÷ required). The three zones are a pedagogical convention — the ratio itself is the real signal.
        </p>
        <BandSpectrum entries={spectrumEntries} />
      </div>

      {/* ── Confidence vs virtue diagram ─────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <HelpCircle size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Strength is Confidence, Not Virtue
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          A strong malefic delivers its hard results firmly. A weak benefic may fail to deliver its blessings. Read strength as volume, then layer in nature for quality.
        </p>
        <ConfidenceVsVirtue />
      </div>

      {/* ── Cross-validation reminder ────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${AMBER}` }}
      >
        <div className="flex items-center gap-2">
          <ZapOff size={16} style={{ color: AMBER }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Cross-Validation Rule
          </span>
        </div>
        <p className="text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          For <strong style={{ color: VERMILION }}>Adhama</strong> planets (ratio &lt; 0.5), do not predict firmly from ṣaḍbala alone. Cross-check with:
        </p>
        <div className="flex flex-wrap gap-2">
          {["Daśā periods", "Transit triggers", "Bhāva lordship", "Nakṣatra quality"].map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: `${AMBER}10`, color: AMBER, border: `1px solid ${AMBER}30` }}
            >
              {tag}
            </span>
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
            The bands are a pedagogical convention
          </p>
          <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
            The <strong>ratio</strong> (total ÷ required) is the classical instrument. The three named bands (Uttama/Madhya/Adhama) and their exact cutoffs are a teaching convention — texts and software differ. Use the ratio as the real signal.
          </p>
        </div>
      </div>
    </div>
  );
}
