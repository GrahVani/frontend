"use client";

/**
 * DashaBalanceCalculator — Four-Step Vimśottarī Balance Computer
 *
 * §7 interactive for Lesson 10.2.1 (Computing the Vimśottarī Daśā Balance at Birth).
 *
 * Walks the learner through the four canonical steps:
 *   1. Moon's exact sidereal longitude
 *   2. Nakṣatra identification + lord
 *   3. Fraction of nakṣatra traversed
 *   4. Balance = (1 − fraction) × full mahādaśā years
 *
 * Design system: Grahvani Learning Design System
 *   - Colors: grahas, ink from design-tokens
 *   - Typography: IAST, Devanagari from chrome/typography
 *   - CSS vars: --gl-ink-primary, --gl-gold-accent, --gl-card-surface-solid, --gl-gold-hairline
 */

import { useState, useMemo, useCallback } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import {
  RASHIS,
  PRESETS,
  computeBalance,
  formatDms,
  formatDecimal,
  formatArcMinutes,
  formatYmd,
  dmsToDecimal,
  toDms,
  getSubsequentMahadashas,
  NAKSHATRA_SPAN_DEGREES,
  NAKSHATRA_SPAN_ARC_MINUTES,
  type BalanceResult,
} from "./data";
import {
  AlertTriangle,
  Moon,
  RotateCcw,
  Ruler,
  Clock,
} from "lucide-react";

/* ─── Constants ────────────────────────────────────────────────────────── */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";

/* ─── Sub-components ───────────────────────────────────────────────────── */

function InputPanel({
  rashiIndex,
  setRashiIndex,
  deg,
  setDeg,
  min,
  setMin,
  sec,
  setSec,
  useTotalMode,
  setUseTotalMode,
  totalDeg,
  setTotalDeg,
  precisionUnit,
  setPrecisionUnit,
  onPreset,
}: {
  rashiIndex: number;
  setRashiIndex: (v: number) => void;
  deg: number;
  setDeg: (v: number) => void;
  min: number;
  setMin: (v: number) => void;
  sec: number;
  setSec: (v: number) => void;
  useTotalMode: boolean;
  setUseTotalMode: (v: boolean) => void;
  totalDeg: number;
  setTotalDeg: (v: number) => void;
  precisionUnit: "dms" | "decimal";
  setPrecisionUnit: (v: "dms" | "decimal") => void;
  onPreset: (lon: number) => void;
}) {
  return (
    <div
      style={{
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 12,
        background: SURFACE,
        padding: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
        <Moon size={16} style={{ color: ink.goldAccent }} />
        <span
          style={{
            fontSize: "0.78rem",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: GOLD_ACCENT,
          }}
        >
          Step 1 — Moon longitude
        </span>
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <button
          type="button"
          onClick={() => setUseTotalMode(false)}
          style={{
            flex: 1,
            padding: "0.4rem 0.6rem",
            borderRadius: 8,
            border: `1.5px solid ${!useTotalMode ? ink.goldAccent : HAIRLINE}`,
            background: !useTotalMode ? `${ink.goldAccent}12` : "transparent",
            color: !useTotalMode ? INK_PRIMARY : INK_MUTED,
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Rāśi + degrees
        </button>
        <button
          type="button"
          onClick={() => setUseTotalMode(true)}
          style={{
            flex: 1,
            padding: "0.4rem 0.6rem",
            borderRadius: 8,
            border: `1.5px solid ${useTotalMode ? ink.goldAccent : HAIRLINE}`,
            background: useTotalMode ? `${ink.goldAccent}12` : "transparent",
            color: useTotalMode ? INK_PRIMARY : INK_MUTED,
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Total longitude (0–360°)
        </button>
      </div>

      {!useTotalMode ? (
        <div style={{ display: "grid", gap: "0.6rem" }}>
          <label style={{ display: "block" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.04em" }}>Rāśi</span>
            <select
              value={rashiIndex}
              onChange={(e) => setRashiIndex(Number(e.target.value))}
              className="w-full mt-1 rounded-lg px-2.5 py-1.5 text-sm"
              style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {RASHIS.map((r) => (
                <option key={r.num} value={r.num - 1}>
                  {r.nameIAST} ({r.devanagari}) — {r.startLongitude}°
                </option>
              ))}
            </select>
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
            <NumberInput label="Degrees" value={deg} onChange={setDeg} min={0} max={29} />
            <NumberInput label="Minutes" value={min} onChange={setMin} min={0} max={59} />
            <NumberInput label="Seconds" value={sec} onChange={setSec} min={0} max={59} />
          </div>
        </div>
      ) : (
        <div>
          <label style={{ display: "block" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.04em" }}>Total sidereal longitude</span>
            <input
              type="number"
              min={0}
              max={360}
              step={0.0001}
              value={totalDeg}
              onChange={(e) => setTotalDeg(Number(e.target.value))}
              className="w-full mt-1 rounded-lg px-2.5 py-1.5 text-sm"
              style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            />
          </label>
        </div>
      )}

      {/* Precision toggle */}
      <div
        style={{
          marginTop: "0.75rem",
          paddingTop: "0.75rem",
          borderTop: `1px dashed ${HAIRLINE}`,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span style={{ fontSize: "0.72rem", color: INK_MUTED, fontWeight: 700 }}>Display:</span>
        <button
          type="button"
          onClick={() => setPrecisionUnit("dms")}
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            padding: "0.2rem 0.5rem",
            borderRadius: 6,
            border: `1px solid ${precisionUnit === "dms" ? ink.goldAccent : HAIRLINE}`,
            background: precisionUnit === "dms" ? `${ink.goldAccent}15` : "transparent",
            color: precisionUnit === "dms" ? ink.goldAccent : INK_MUTED,
            cursor: "pointer",
          }}
        >
          DMS (′″)
        </button>
        <button
          type="button"
          onClick={() => setPrecisionUnit("decimal")}
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            padding: "0.2rem 0.5rem",
            borderRadius: 6,
            border: `1px solid ${precisionUnit === "decimal" ? ink.goldAccent : HAIRLINE}`,
            background: precisionUnit === "decimal" ? `${ink.goldAccent}15` : "transparent",
            color: precisionUnit === "decimal" ? ink.goldAccent : INK_MUTED,
            cursor: "pointer",
          }}
        >
          Decimal degrees
        </button>
      </div>

      {/* Presets */}
      <div style={{ marginTop: "0.85rem" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "0.4rem" }}>
          Worked examples
        </span>
        <div style={{ display: "grid", gap: "0.4rem" }}>
          {PRESETS.map((preset) => (
            <button
              key={preset.slug}
              type="button"
              onClick={() => onPreset(preset.moonLongitude)}
              style={{
                textAlign: "left",
                padding: "0.5rem 0.7rem",
                borderRadius: 8,
                border: `1px solid ${HAIRLINE}`,
                background: "transparent",
                color: INK_SECONDARY,
                fontSize: "0.78rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--gl-surface-2, #F5EDD8)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <span style={{ fontWeight: 700, color: INK_PRIMARY }}>{preset.label}</span>
              <span style={{ color: INK_MUTED, display: "block", marginTop: "0.15rem", fontSize: "0.72rem" }}>{preset.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontSize: "0.68rem", color: INK_MUTED, fontWeight: 700 }}>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
        className="w-full mt-1 rounded-lg px-2 py-1.5 text-sm"
        style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
      />
    </label>
  );
}

function StepCard({
  stepNum,
  title,
  children,
  accentColor = ink.goldAccent,
}: {
  stepNum: number;
  title: string;
  children: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div
      style={{
        border: `1.5px solid ${accentColor}40`,
        borderRadius: 10,
        background: SURFACE,
        padding: "0.9rem 1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: accentColor,
            color: "#fff",
            fontSize: "0.7rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {stepNum}
        </span>
        <span style={{ fontSize: "0.82rem", fontWeight: 800, color: accentColor, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {title}
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function MathLine({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div style={{ marginTop: "0.35rem" }}>
      <div style={{ fontSize: "0.78rem", color: INK_MUTED }}>{label}</div>
      <div style={{ fontSize: "0.9rem", fontWeight: 700, color: INK_PRIMARY, fontFamily: "var(--font-mono), monospace", marginTop: "0.1rem" }}>
        {value}
      </div>
      {note && <div style={{ fontSize: "0.72rem", color: INK_MUTED, fontStyle: "italic", marginTop: "0.15rem" }}>{note}</div>}
    </div>
  );
}

function BalanceBar({ result }: { result: BalanceResult }) {
  const consumedPct = result.fractionConsumed * 100;
  const remainingPct = result.fractionRemaining * 100;
  const color = result.nakshatraMapping.lord.color;
  const tint = result.nakshatraMapping.lord.colorTint;

  return (
    <div
      style={{
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 12,
        background: SURFACE,
        padding: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
        <Ruler size={15} style={{ color: ink.goldAccent }} />
        <span style={{ fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", color: GOLD_ACCENT }}>
          Nakṣatra position
        </span>
      </div>

      {/* Bar */}
      <div style={{ display: "flex", height: 32, borderRadius: 8, overflow: "hidden", border: `1px solid ${HAIRLINE}` }}>
        <div
          style={{
            width: `${consumedPct}%`,
            background: tint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "width 0.3s ease",
          }}
          title="Consumed before birth"
        >
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: INK_MUTED, whiteSpace: "nowrap" }}>
            {consumedPct.toFixed(1)}% consumed
          </span>
        </div>
        <div
          style={{
            width: `${remainingPct}%`,
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "width 0.3s ease",
          }}
          title="Unspent balance from birth"
        >
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
            {remainingPct.toFixed(1)}% unspent
          </span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
        <span style={{ fontSize: "0.72rem", color: INK_MUTED }}>
          Start: {formatDms(result.nakshatraStartLongitude)}
        </span>
        <span style={{ fontSize: "0.72rem", color: INK_MUTED }}>
          End: {formatDms(result.nakshatraEndLongitude)}
        </span>
      </div>
    </div>
  );
}

function BoundaryWarning({ result }: { result: BalanceResult }) {
  if (!result.isNearBoundary) return null;
  const which = result.boundaryDistanceArcMinutes === result.elapsedArcMinutes ? "start" : "end";
  return (
    <div
      style={{
        border: `1.5px solid ${ink.vermilionAccent}50`,
        borderRadius: 10,
        background: `${ink.vermilionAccent}10`,
        padding: "0.75rem 1rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.6rem",
      }}
    >
      <AlertTriangle size={18} style={{ color: ink.vermilionAccent, flexShrink: 0, marginTop: 1 }} />
      <div>
        <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: ink.vermilionAccent }}>
          Boundary sensitivity warning
        </p>
        <p style={{ margin: "0.2rem 0 0", fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
          The Moon is only <strong>{result.boundaryDistanceArcMinutes.toFixed(2)} arc-minutes</strong> from the{" "}
          {which} of this nakṣatra. A small birth-time error (≈ {Math.ceil(result.boundaryDistanceArcMinutes / 2)} minutes)
          could shift the starting lord entirely.
        </p>
      </div>
    </div>
  );
}

function SubsequentPreview({ result }: { result: BalanceResult }) {
  const subsequent = useMemo(
    () => getSubsequentMahadashas(result.nakshatraMapping.lord.index - 1, result.balanceYears, 3),
    [result]
  );

  return (
    <div
      style={{
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 12,
        background: SURFACE,
        padding: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
        <Clock size={15} style={{ color: ink.goldAccent }} />
        <span style={{ fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", color: GOLD_ACCENT }}>
          Subsequent mahādaśās
        </span>
      </div>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {subsequent.map((md, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.5rem 0.7rem",
              borderRadius: 8,
              background: i === 0 ? `${md.lord.colorTint}` : "transparent",
              border: `1px solid ${i === 0 ? `${md.lord.color}40` : HAIRLINE}`,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: md.lord.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: md.lord.color, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{md.lord.nameIAST}</IAST>
            </span>
            <span style={{ fontSize: "0.78rem", color: INK_SECONDARY }}>
              {md.durationYears} years
            </span>
            <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: INK_MUTED }}>
              starts at +{md.startOffsetYears.toFixed(2)}y
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export function DashaBalanceCalculator() {
  const [rashiIndex, setRashiIndex] = useState(8); // Sagittarius (Dhanu) — matches Example 1
  const [deg, setDeg] = useState(23);
  const [min, setMin] = useState(14);
  const [sec, setSec] = useState(17);
  const [useTotalMode, setUseTotalMode] = useState(false);
  const [totalDeg, setTotalDeg] = useState(263.2381);
  const [precisionUnit, setPrecisionUnit] = useState<"dms" | "decimal">("dms");

  const moonLongitude = useMemo(() => {
    if (useTotalMode) return totalDeg;
    return RASHIS[rashiIndex].startLongitude + dmsToDecimal(deg, min, sec);
  }, [useTotalMode, totalDeg, rashiIndex, deg, min, sec]);

  const result = useMemo(() => computeBalance(moonLongitude), [moonLongitude]);

  const handlePreset = useCallback((lon: number) => {
    setUseTotalMode(true);
    setTotalDeg(Number(lon.toFixed(4)));
  }, []);

  const handleReset = useCallback(() => {
    setRashiIndex(8);
    setDeg(23);
    setMin(14);
    setSec(17);
    setUseTotalMode(false);
    setTotalDeg(263.2381);
    setPrecisionUnit("dms");
  }, []);

  const lord = result.nakshatraMapping.lord;

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
      data-interactive="dasha-balance-calculator"
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
          Calculator interactive
        </p>
        <h2
          className="text-lg font-semibold mt-1"
          style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}
        >
          <IAST>Vimśottarī</IAST> Daśā Balance Calculator
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          Walk through the four canonical steps. Enter the Moon&apos;s sidereal longitude and watch each intermediate value materialise.
        </p>
      </div>

      {/* Main layout: inputs left, cascade right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
          gap: "0.85rem",
          alignItems: "start",
        }}
      >
        {/* Left column — inputs + visual */}
        <div style={{ display: "grid", gap: "0.85rem" }}>
          <InputPanel
            rashiIndex={rashiIndex}
            setRashiIndex={setRashiIndex}
            deg={deg}
            setDeg={setDeg}
            min={min}
            setMin={setMin}
            sec={sec}
            setSec={setSec}
            useTotalMode={useTotalMode}
            setUseTotalMode={setUseTotalMode}
            totalDeg={totalDeg}
            setTotalDeg={setTotalDeg}
            precisionUnit={precisionUnit}
            setPrecisionUnit={setPrecisionUnit}
            onPreset={handlePreset}
          />
          <BalanceBar result={result} />
          <BoundaryWarning result={result} />
        </div>

        {/* Right column — four-step cascade */}
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {/* Step 1 */}
          <StepCard stepNum={1} title="Moon's exact sidereal longitude" accentColor={grahas.candra.primary}>
            <MathLine
              label="Within rāśi"
              value={`${precisionUnit === "dms" ? formatDms(result.rashiLongitude) : formatDecimal(result.rashiLongitude)} ${result.rashi.nameIAST} (${result.rashi.devanagari})`}
            />
            <MathLine
              label="Total from 0° Aries"
              value={precisionUnit === "dms" ? formatDms(result.moonLongitude) : formatDecimal(result.moonLongitude)}
              note="Used to identify nakṣatra regardless of rāśi boundary crossings."
            />
          </StepCard>

          {/* Step 2 */}
          <StepCard stepNum={2} title="Nakṣatra identification & lord" accentColor={lord.color}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
              <Devanagari size="md" style={{ color: lord.color }}>
                {result.nakshatraMapping.nakshatra.devanagari}
              </Devanagari>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{result.nakshatraMapping.nakshatra.name}</IAST>
                </div>
                <div style={{ fontSize: "0.75rem", color: INK_MUTED }}>
                  Pāda {result.pada} of 4 · #{result.nakshatraMapping.nakshatra.num} of 27
                </div>
              </div>
            </div>
            <MathLine
              label="Nakṣatra lord (starting mahādaśā)"
              value={`${lord.nameIAST} (${lord.devanagari}) — ${lord.years} years`}
              note="BPHS 46.1: candreṇa nakṣatra-nāthaḥ — the lord of the Moon's nakṣatra, not the rāśi lord."
            />
            <MathLine
              label="Nakṣatra span"
              value={`${precisionUnit === "dms" ? formatDms(result.nakshatraStartLongitude) : formatDecimal(result.nakshatraStartLongitude)} → ${precisionUnit === "dms" ? formatDms(result.nakshatraEndLongitude) : formatDecimal(result.nakshatraEndLongitude)}`}
            />
          </StepCard>

          {/* Step 3 */}
          <StepCard stepNum={3} title="Fraction of nakṣatra traversed" accentColor={ink.goldAccent}>
            <MathLine
              label="Elapsed within nakṣatra"
              value={
                precisionUnit === "dms"
                  ? `${formatDms(result.elapsedDegrees)} = ${formatArcMinutes(result.elapsedArcMinutes)}`
                  : `${formatDecimal(result.elapsedDegrees)} = ${result.elapsedArcMinutes.toFixed(2)}′`
              }
            />
            <MathLine
              label="Full nakṣatra span"
              value={
                precisionUnit === "dms"
                  ? `13°20′00″ = ${NAKSHATRA_SPAN_ARC_MINUTES} arc-minutes`
                  : `${NAKSHATRA_SPAN_DEGREES.toFixed(4)}° = ${NAKSHATRA_SPAN_ARC_MINUTES} arc-minutes`
              }
            />
            <MathLine
              label="Fraction consumed (bhuktā)"
              value={`${result.elapsedArcMinutes.toFixed(2)}′ / ${NAKSHATRA_SPAN_ARC_MINUTES}′ = ${result.fractionConsumed.toFixed(6)}`}
            />
            <MathLine
              label="Fraction remaining (bhogyā)"
              value={`1 − ${result.fractionConsumed.toFixed(6)} = ${result.fractionRemaining.toFixed(6)}`}
              note="This is the 'one minus' discipline — always subtract from 1."
            />
          </StepCard>

          {/* Step 4 */}
          <StepCard stepNum={4} title="Balance calculation" accentColor={lord.color}>
            <MathLine
              label="Formula"
              value={`(1 − fraction) × full mahādaśā years`}
            />
            <MathLine
              label="Computation"
              value={`${result.fractionRemaining.toFixed(6)} × ${result.fullMahadashaYears} = ${result.balanceYears.toFixed(4)} years`}
            />
            <div
              style={{
                marginTop: "0.5rem",
                padding: "0.6rem 0.8rem",
                borderRadius: 8,
                background: `${lord.color}15`,
                border: `1.5px solid ${lord.color}40`,
              }}
            >
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: lord.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Final balance
              </div>
              <div
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: lord.color,
                  fontFamily: "var(--font-cormorant), serif",
                  marginTop: "0.15rem",
                }}
              >
                {formatYmd(result.balanceYmd)}
              </div>
              <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, marginTop: "0.2rem" }}>
                of <IAST>{lord.nameIAST}</IAST> mahādaśā ·{" "}
                <span style={{ fontWeight: 700 }}>{result.balanceYears.toFixed(3)} years</span> remaining
              </div>
            </div>
          </StepCard>

          <SubsequentPreview result={result} />
        </div>
      </div>

      {/* Reset */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            backgroundColor: "var(--gl-surface-2, #F5EDD8)",
            color: INK_SECONDARY,
            border: `1px solid ${HAIRLINE}`,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={14} />
          Reset calculator
        </button>
      </div>
    </div>
  );
}
