"use client";

/**
 * Dik-Kāla Summer — Lesson 13.3.4 Interactive
 *
 * §7 interactive for Chapter 3 capstone.
 *
 * Combines dik bala (0–60 virūpas) with the nine kāla sub-components,
 * shows the chapter total, converts to rūpas, and verifies against
 * the worked example (Sun in 10th → dik 60 + kāla ~80 = ~140 ≈ 2.3 rūpas).
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import {
  DIK_BALA_CONFIG,
  KALA_COMPONENTS,
  PRESETS,
  getDefaultValues,
  sumKala,
  totalDikKala,
  formatVirupas,
  formatRupas,
} from "./data";
import {
  Sigma,
  RotateCcw,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
} from "lucide-react";

/* ─── Design tokens ──────────────────────────────────────────────────────── */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";

/* ─── SVG Diagram: Dik + Kāla = Total ────────────────────────────────────── */

function SumDiagram({ dikValue, kalaValues }: { dikValue: number; kalaValues: Record<string, number> }) {
  const kalaSum = sumKala(kalaValues);
  const total = dikValue + kalaSum;
  const maxDisplay = 220;

  const w = 720;
  const h = 280;
  const barY = 80;
  const barH = 32;
  const trackStart = 60;
  const trackEnd = 520;
  const trackWidth = trackEnd - trackStart;

  // Dik segment width
  const dikW = Math.max(24, (dikValue / maxDisplay) * trackWidth);
  // Kāla segments packed after dik
  const kalaStart = trackStart + dikW + 16;
  const kalaAvailable = trackEnd - kalaStart;
  const kalaTotalW = Math.max(40, (kalaSum / maxDisplay) * trackWidth);

  // Build kāla sub-segments proportionally within the kala block
  let kalaX = kalaStart;
  const kalaSegments = KALA_COMPONENTS.map((c) => {
    const val = kalaValues[c.key] ?? 0;
    const sw = kalaSum > 0 ? (val / kalaSum) * kalaTotalW : 0;
    const seg = { component: c, x: kalaX, width: Math.max(2, sw), value: val };
    kalaX += sw;
    return seg;
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 300 }}>
      {/* Background */}
      <rect x={20} y={12} width={w - 40} height={h - 24} rx={14} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.5} />

      {/* Title */}
      <text x={w / 2} y={36} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK_SECONDARY}>
        Dik Bala + Kāla Bala (nine sub-components) = Chapter Total
      </text>

      {/* Track line */}
      <line x1={trackStart} y1={barY + barH / 2} x2={trackEnd} y2={barY + barH / 2} stroke={HAIRLINE} strokeWidth={barH} strokeLinecap="round" />

      {/* Dik segment */}
      <rect x={trackStart} y={barY} width={dikW} height={barH} rx={6} fill={`${DIK_BALA_CONFIG.color}40`} stroke={DIK_BALA_CONFIG.color} strokeWidth={1.5} />
      <text x={trackStart + dikW / 2} y={barY - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill={DIK_BALA_CONFIG.color}>
        Dik {formatVirupas(dikValue)}
      </text>

      {/* Plus sign */}
      <text x={trackStart + dikW + 8} y={barY + barH / 2 + 4} textAnchor="middle" fontSize={14} fontWeight={900} fill={INK_MUTED}>+</text>

      {/* Kāla segments */}
      {kalaSegments.map((seg) => (
        <g key={seg.component.key}>
          <rect x={seg.x} y={barY} width={seg.width} height={barH} rx={seg.width > 8 ? 4 : 0} fill={`${seg.component.color}35`} stroke={seg.component.color} strokeWidth={0.8} />
          {seg.width > 20 && (
            <text x={seg.x + seg.width / 2} y={barY + barH / 2 + 4} textAnchor="middle" fontSize={7} fontWeight={700} fill={seg.component.color}>
              {seg.component.iast.slice(0, 3)}
            </text>
          )}
        </g>
      ))}

      {/* Kāla label */}
      <text x={kalaStart + kalaTotalW / 2} y={barY + barH + 16} textAnchor="middle" fontSize={9} fontWeight={600} fill={INK_SECONDARY}>
        Kāla total: {formatVirupas(kalaSum)}
      </text>

      {/* Equals */}
      <text x={trackEnd + 14} y={barY + barH / 2 + 4} textAnchor="middle" fontSize={14} fontWeight={900} fill={INK_MUTED}>=</text>

      {/* Total circle */}
      <circle cx={trackEnd + 70} cy={barY + barH / 2} r={42} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={2} />
      <text x={trackEnd + 70} y={barY + barH / 2 - 2} textAnchor="middle" fontSize={22} fontWeight={900} fill={GOLD_ACCENT}>
        {formatVirupas(total)}
      </text>
      <text x={trackEnd + 70} y={barY + barH / 2 + 16} textAnchor="middle" fontSize={9} fontWeight={700} fill={INK_SECONDARY}>
        virūpas
      </text>

      {/* Rūpa conversion */}
      <text x={trackEnd + 70} y={barY + barH + 36} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK_MUTED}>
        = {formatRupas(total)} rūpas
      </text>

      {/* Component legend row */}
      <g transform={`translate(60, ${barY + barH + 56})`}>
        {KALA_COMPONENTS.map((c, i) => {
          const lx = i * 70;
          return (
            <g key={c.key}>
              <rect x={lx} y={0} width={10} height={10} rx={2} fill={c.color} opacity={0.6} />
              <text x={lx + 14} y={9} fontSize={8} fill={INK_SECONDARY}>{c.iast}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function DikKalaSummer() {
  const [values, setValues] = useState<Record<string, number>>(getDefaultValues);
  const [selectedKey, setSelectedKey] = useState<string>("dik");

  const dikValue = values.dik ?? 0;
  const kalaSum = sumKala(values);
  const total = totalDikKala(values);

  const activePreset = useMemo(
    () =>
      PRESETS.find(
        (p) =>
          p.dikVirupas === dikValue &&
          KALA_COMPONENTS.every((c) => p.kalaValues[c.key] === values[c.key])
      ),
    [dikValue, values]
  );

  function setValue(key: string, value: number) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function applyPreset(key: string) {
    const preset = PRESETS.find((p) => p.key === key);
    if (!preset) return;
    const next: Record<string, number> = { dik: preset.dikVirupas };
    KALA_COMPONENTS.forEach((c) => {
      next[c.key] = preset.kalaValues[c.key] ?? c.defaultVirupas;
    });
    setValues(next);
    setSelectedKey("dik");
  }

  const selectedComponent =
    selectedKey === "dik"
      ? null
      : KALA_COMPONENTS.find((c) => c.key === selectedKey);

  const selectedConfig =
    selectedKey === "dik" ? DIK_BALA_CONFIG : selectedComponent;

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Sigma size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Dik + Kāla Bala Summer
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Add directional strength to the nine temporal sub-components — then convert to rūpas.
          </p>
        </div>
      </div>

      {/* ── Presets ──────────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Calculator size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              Worked Presets
            </span>
          </div>
          <button
            onClick={() => {
              setValues(getDefaultValues());
              setSelectedKey("dik");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
            style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESETS.map((preset) => {
            const isActive = activePreset?.key === preset.key;
            const pTotal = preset.dikVirupas + sumKala(preset.kalaValues);
            return (
              <button
                key={preset.key}
                onClick={() => applyPreset(preset.key)}
                className="text-left rounded-lg p-3 transition-all hover:shadow-sm space-y-1"
                style={{
                  background: isActive ? `${GOLD_ACCENT}10` : SURFACE,
                  border: `1.5px solid ${isActive ? GOLD_ACCENT : HAIRLINE}`,
                }}
              >
                <p className="text-xs font-bold" style={{ color: isActive ? GOLD_ACCENT : INK_PRIMARY }}>
                  {preset.label}
                </p>
                <p className="text-[10px]" style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>
                  {preset.note}
                </p>
                <p className="text-[10px] font-semibold" style={{ color: INK_MUTED }}>
                  Dik {preset.dikVirupas} + Kāla {sumKala(preset.kalaValues)} = {formatVirupas(pTotal)} virūpas
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Sum Diagram ──────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <SumDiagram dikValue={dikValue} kalaValues={values} />
      </div>

      {/* ── Total conversion cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          className="rounded-lg p-4 space-y-1"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${DIK_BALA_CONFIG.color}` }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: DIK_BALA_CONFIG.color }}>
            Dik Bala
          </p>
          <p className="text-2xl font-bold" style={{ color: INK_PRIMARY }}>
            {formatVirupas(dikValue)}
          </p>
          <p className="text-xs" style={{ color: INK_SECONDARY }}>
            {formatRupas(dikValue)} rūpas
          </p>
        </div>

        <div
          className="rounded-lg p-4 space-y-1"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${GOLD_ACCENT}` }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: GOLD_ACCENT }}>
            Kāla Bala (9 sub)
          </p>
          <p className="text-2xl font-bold" style={{ color: INK_PRIMARY }}>
            {formatVirupas(kalaSum)}
          </p>
          <p className="text-xs" style={{ color: INK_SECONDARY }}>
            {formatRupas(kalaSum)} rūpas
          </p>
        </div>

        <div
          className="rounded-lg p-4 space-y-1"
          style={{ background: `${GREEN}06`, border: `1px solid ${GREEN}25`, borderLeft: `3px solid ${GREEN}` }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: GREEN }}>
            Chapter Total
          </p>
          <p className="text-2xl font-bold" style={{ color: GREEN }}>
            {formatVirupas(total)}
          </p>
          <p className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>
            = {formatRupas(total)} rūpas
          </p>
        </div>
      </div>

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-4"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <ArrowRight size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Adjust the Ledger
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Click any component to select it, then drag the slider. Build the structure by hand to see which factors help a planet — then verify precise totals with the engine.
        </p>

        {/* Component selector pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedKey("dik")}
            className="px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={{
              background: selectedKey === "dik" ? `${DIK_BALA_CONFIG.color}12` : `${INK_MUTED}08`,
              border: `1px solid ${selectedKey === "dik" ? DIK_BALA_CONFIG.color : HAIRLINE}`,
              color: selectedKey === "dik" ? DIK_BALA_CONFIG.color : INK_SECONDARY,
            }}
          >
            Dik
          </button>
          {KALA_COMPONENTS.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedKey(c.key)}
              className="px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all"
              style={{
                background: selectedKey === c.key ? `${c.color}10` : `${INK_MUTED}06`,
                border: `1px solid ${selectedKey === c.key ? c.color : HAIRLINE}`,
                color: selectedKey === c.key ? c.color : INK_SECONDARY,
              }}
            >
              {c.iast}
            </button>
          ))}
        </div>

        {/* Selected component detail + slider */}
        {selectedConfig && (
          <div
            className="rounded-lg p-4 space-y-3"
            style={{
              background: `${selectedConfig.color}06`,
              border: `1px solid ${selectedConfig.color}25`,
              borderLeft: `3px solid ${selectedConfig.color}`,
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-sm font-bold" style={{ color: selectedConfig.color }}>
                  <IAST size="sm">{selectedConfig.iast}</IAST>
                  {selectedConfig.devanagari && (
                    <span className="ml-2 text-xs" style={{ opacity: 0.6 }}>
                      <Devanagari size="sm">{selectedConfig.devanagari}</Devanagari>
                    </span>
                  )}
                </p>
                <p className="text-xs mt-0.5" style={{ color: INK_SECONDARY }}>
                  {selectedConfig.description}
                </p>
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${selectedConfig.color}12`, color: selectedConfig.color }}
              >
                Range: {selectedConfig.range}
              </span>
            </div>

            <input
              type="range"
              min={selectedConfig.min}
              max={selectedConfig.max}
              step={selectedConfig.step}
              value={values[selectedConfig.key] ?? 0}
              onChange={(e) => setValue(selectedConfig.key, Number(e.target.value))}
              className="w-full"
              style={{ accentColor: selectedConfig.color }}
            />

            <div className="flex items-center justify-between">
              <p className="text-sm font-bold" style={{ color: selectedConfig.color }}>
                {formatVirupas(values[selectedConfig.key] ?? 0)} virūpas
              </p>
              <p className="text-xs" style={{ color: INK_MUTED }}>
                = {formatRupas(values[selectedConfig.key] ?? 0)} rūpas
              </p>
            </div>

            <p className="text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
              {selectedConfig.note}
            </p>
          </div>
        )}
      </div>

      {/* ── Engine verification note ─────────────────────────────────────── */}
      <div
        className="rounded-lg p-3 flex items-start gap-2.5"
        style={{ background: `${GREEN}06`, border: `1px solid ${GREEN}20`, borderLeft: `3px solid ${GREEN}` }}
      >
        <CheckCircle2 size={16} style={{ color: GREEN, marginTop: 2, flexShrink: 0 }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            Build structure by hand; verify with the engine
          </p>
          <p className="text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
            The nine kāla sub-formulae (Ayana, Tribhāga, doubled lunar pakṣabala, yuddha) are intricate.
            Use this interactive to understand <em>which</em> factors strengthen a planet — then take the precise totals from the Astro Engine. This chapter total feeds the full ṣaḍbala sum.
          </p>
        </div>
      </div>

      {/* ── Common mistakes ──────────────────────────────────────────────── */}
      <div className="space-y-2">
        {[
          {
            title: "Estimating kāla by hand",
            fix: "Take precise kāla totals from the engine. Build structure here; verify there.",
          },
          {
            title: "Forgetting a kāla sub-component",
            fix: "All nine must be summed — nathonnata, pakṣa, tribhāga, abda, māsa, vāra, horā, ayana, yuddha.",
          },
          {
            title: "Not converting to rūpas",
            fix: "Always divide the chapter total by 60. Virūpas are for summing; rūpas are for reading.",
          },
        ].map((m, i) => (
          <div
            key={i}
            className="rounded-lg p-3 flex items-start gap-2.5"
            style={{ background: `${INK_MUTED}05`, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${INK_MUTED}` }}
          >
            <AlertTriangle size={14} style={{ color: INK_MUTED, marginTop: 1, flexShrink: 0 }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>
                {m.title}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: INK_MUTED }}>
                {m.fix}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Honest note ──────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-3 flex items-start gap-2.5"
        style={{ background: `${GOLD_ACCENT}06`, border: `1px solid ${GOLD_ACCENT}25` }}
      >
        <Info size={16} style={{ color: GOLD_ACCENT, marginTop: 2, flexShrink: 0 }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            This closes Chapter 3 (Dik and Kāla Bala)
          </p>
          <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
            The chapter total = dik + (sum of nine kāla). Next: Chapter 4 covers cheṣṭā and naisargika bala.
            Remember the worked Sun: dik 60 + kāla ~80 = <strong>~140 virūpas ≈ 2.3 rūpas</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
