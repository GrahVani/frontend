"use client";

/**
 * DashaBalanceMistakeExplorer — The Six Common Mistakes Interactive
 *
 * §7 interactive for Lesson 10.2.2 (The Six Common Mistakes in Balance Calculation).
 *
 * Lets the learner toggle each of the six recurring mistakes and see how it
 * corrupts the balance, with a side-by-side correct vs corrupted comparison
 * and the ±1-day tolerance indicator.
 *
 * Design system: Grahvani Learning Design System
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  PRESETS,
  computeBalance,
  formatDms,
  formatYmd,
  dmsToDecimal,
  simulateMistakes,
  type MistakeConfig,
} from "../dasha-balance-calculator/data";
import {
  AlertTriangle,
  CheckCircle2,
  Moon,
  RotateCcw,
  Skull,
  XCircle,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";

export function DashaBalanceMistakeExplorer() {
  const [moonLongitude, setMoonLongitude] = useState(263.2381);
  const [mistakeConfig, setMistakeConfig] = useState<MistakeConfig>({
    useTropical: false,
    reverseDirection: false,
    naiveDecimal: false,
    wrongYearsOverride: 0,
    sunLongitude: 0,
    timeErrorArcMinutes: 0,
  });
  const [sunDegInput, setSunDegInput] = useState(120);

  const result = useMemo(() => {
    const config: MistakeConfig = {
      ...mistakeConfig,
      sunLongitude: mistakeConfig.sunLongitude !== 0 ? sunDegInput : 0,
    };
    return simulateMistakes(moonLongitude, config);
  }, [moonLongitude, mistakeConfig, sunDegInput]);

  const correct = result.correctBalance;
  const corrupted = result.corruptedBalance;

  const toggle = (key: keyof MistakeConfig) => {
    setMistakeConfig({ ...mistakeConfig, [key]: !mistakeConfig[key] });
  };

  const hasAnyMistake =
    mistakeConfig.useTropical ||
    mistakeConfig.reverseDirection ||
    mistakeConfig.naiveDecimal ||
    mistakeConfig.wrongYearsOverride !== 0 ||
    mistakeConfig.sunLongitude !== 0 ||
    mistakeConfig.timeErrorArcMinutes !== 0;

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
      data-interactive="dasha-balance-mistake-explorer"
    >
      {/* Header */}
      <div className="mb-4">
        <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", color: INK_MUTED }}>
          Mistake Explorer interactive
        </p>
        <h2 className="text-lg font-semibold mt-1" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          The Six Common Mistakes
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          Toggle each mistake to see how it corrupts the Vimśottarī balance. Compare against the correct result.
        </p>
      </div>

      {/* Moon input + presets */}
      <div
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 12,
          background: SURFACE,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
          <Moon size={16} style={{ color: ink.goldAccent }} />
          <span style={{ fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", color: GOLD_ACCENT }}>
            Moon longitude
          </span>
        </div>
        <label style={{ display: "block", marginBottom: "0.6rem" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Total sidereal longitude (0–360°)</span>
          <input
            type="number"
            min={0}
            max={360}
            step={0.0001}
            value={moonLongitude}
            onChange={(e) => setMoonLongitude(Number(e.target.value))}
            className="w-full mt-1 rounded-lg px-2.5 py-1.5 text-sm"
            style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
          />
        </label>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {PRESETS.map((preset) => (
            <button
              key={preset.slug}
              type="button"
              onClick={() => setMoonLongitude(preset.moonLongitude)}
              style={{
                padding: "0.35rem 0.6rem",
                borderRadius: 8,
                border: `1px solid ${HAIRLINE}`,
                background: "transparent",
                color: INK_SECONDARY,
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mistake toggles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
          gap: "0.6rem",
          marginBottom: "1rem",
        }}
      >
        <MistakeToggle
          num={1}
          label="Tropical instead of sidereal"
          active={mistakeConfig.useTropical}
          onToggle={() => toggle("useTropical")}
          description="Forgets the ~24° ayanāṁśa → wrong nakṣatra"
        />
        <MistakeToggle
          num={2}
          label="Reversed direction"
          active={mistakeConfig.reverseDirection}
          onToggle={() => toggle("reverseDirection")}
          description="Uses traversed fraction as balance"
        />
        <MistakeToggle
          num={3}
          label="Naive decimal (6°40′ → 6.40)"
          active={mistakeConfig.naiveDecimal}
          onToggle={() => toggle("naiveDecimal")}
          description="Minutes treated as hundredths"
        />
        <MistakeToggle
          num={4}
          label="Wrong mahādaśā years"
          active={mistakeConfig.wrongYearsOverride !== 0}
          onToggle={() =>
            setMistakeConfig({
              ...mistakeConfig,
              wrongYearsOverride: mistakeConfig.wrongYearsOverride !== 0 ? 0 : 20,
            })
          }
          description={mistakeConfig.wrongYearsOverride !== 0 ? `Using ${mistakeConfig.wrongYearsOverride}y instead of correct` : "Simulates wrong year lookup"}
        />
        <MistakeToggle
          num={5}
          label="Wrong anchor (Sun instead of Moon)"
          active={mistakeConfig.sunLongitude !== 0}
          onToggle={() =>
            setMistakeConfig({
              ...mistakeConfig,
              sunLongitude: mistakeConfig.sunLongitude !== 0 ? 0 : sunDegInput,
            })
          }
          description={mistakeConfig.sunLongitude !== 0 ? `Sun at ${sunDegInput}°` : "Anchor to Sun's nakṣatra"}
        />
        {mistakeConfig.sunLongitude !== 0 && (
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED }}>Sun longitude (°)</span>
              <input
                type="number"
                min={0}
                max={360}
                step={0.01}
                value={sunDegInput}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setSunDegInput(v);
                  if (mistakeConfig.sunLongitude !== 0) {
                    setMistakeConfig({ ...mistakeConfig, sunLongitude: v });
                  }
                }}
                className="w-full mt-1 rounded-lg px-2.5 py-1.5 text-sm"
                style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              />
            </label>
          </div>
        )}
        <MistakeToggle
          num={6}
          label="Birth-time error compounding"
          active={mistakeConfig.timeErrorArcMinutes !== 0}
          onToggle={() =>
            setMistakeConfig({
              ...mistakeConfig,
              timeErrorArcMinutes: mistakeConfig.timeErrorArcMinutes !== 0 ? 0 : 10,
            })
          }
          description={mistakeConfig.timeErrorArcMinutes !== 0 ? `±${mistakeConfig.timeErrorArcMinutes}′ shift` : "Simulates inaccurate birth time"}
        />
        {mistakeConfig.timeErrorArcMinutes !== 0 && (
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED }}>Time error (arc-minutes)</span>
              <input
                type="range"
                min={-30}
                max={30}
                step={1}
                value={mistakeConfig.timeErrorArcMinutes}
                onChange={(e) => setMistakeConfig({ ...mistakeConfig, timeErrorArcMinutes: Number(e.target.value) })}
                className="w-full mt-1"
                style={{ accentColor: ink.vermilionAccent }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: INK_MUTED }}>
                <span>−30′</span>
                <span>{mistakeConfig.timeErrorArcMinutes}′</span>
                <span>+30′</span>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Tolerance indicator */}
      {hasAnyMistake && (
        <div
          style={{
            borderRadius: 10,
            background: result.exceedsTolerance ? `${ink.vermilionAccent}12` : `${ink.goldAccent}12`,
            border: `1.5px solid ${result.exceedsTolerance ? ink.vermilionAccent : ink.goldAccent}50`,
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          {result.exceedsTolerance ? (
            <XCircle size={18} style={{ color: ink.vermilionAccent, flexShrink: 0 }} />
          ) : (
            <CheckCircle2 size={18} style={{ color: ink.goldAccent, flexShrink: 0 }} />
          )}
          <div>
            <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: result.exceedsTolerance ? ink.vermilionAccent : ink.goldAccent }}>
              {result.exceedsTolerance
                ? `±1-day target FAILED — off by ${(result.divergenceYears * 365.25).toFixed(1)} days`
                : `Within ±1-day tolerance — off by ${(result.divergenceYears * 365.25).toFixed(2)} days`}
            </p>
            <p style={{ margin: "0.15rem 0 0", fontSize: "0.75rem", color: INK_SECONDARY }}>
              {result.errorDescription}
            </p>
          </div>
        </div>
      )}

      {/* Side-by-side comparison */}
      {hasAnyMistake ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
            gap: "0.75rem",
          }}
        >
          <ResultCard
            label="Correct"
            color={ink.goldAccent}
            nakshatra={correct.nakshatraMapping.nakshatra.name}
            devanagari={correct.nakshatraMapping.nakshatra.devanagari}
            lord={correct.nakshatraMapping.lord}
            balanceYmd={formatYmd(correct.balanceYmd)}
            balanceYears={correct.balanceYears}
          />
          <ResultCard
            label="Corrupted"
            color={ink.vermilionAccent}
            nakshatra={corrupted.nakshatraMapping.nakshatra.name}
            devanagari={corrupted.nakshatraMapping.nakshatra.devanagari}
            lord={corrupted.nakshatraMapping.lord}
            balanceYmd={formatYmd(corrupted.balanceYmd)}
            balanceYears={corrupted.balanceYears}
          />
        </div>
      ) : (
        <div
          style={{
            borderRadius: 10,
            background: SURFACE,
            border: `1px dashed ${HAIRLINE}`,
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.85rem", color: INK_MUTED }}>
            Toggle one or more mistakes above to see how each corrupts the balance.
          </p>
        </div>
      )}

      {/* Reset */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setMoonLongitude(263.2381);
            setMistakeConfig({
              useTropical: false,
              reverseDirection: false,
              naiveDecimal: false,
              wrongYearsOverride: 0,
              sunLongitude: 0,
              timeErrorArcMinutes: 0,
            });
            setSunDegInput(120);
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
          Reset explorer
        </button>
      </div>
    </div>
  );
}

function MistakeToggle({
  num,
  label,
  active,
  onToggle,
  description,
}: {
  num: number;
  label: string;
  active: boolean;
  onToggle: () => void;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.5rem",
        padding: "0.6rem 0.75rem",
        borderRadius: 10,
        border: `1.5px solid ${active ? ink.vermilionAccent : HAIRLINE}`,
        background: active ? `${ink.vermilionAccent}10` : SURFACE,
        textAlign: "left",
        cursor: "pointer",
        width: "100%",
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: active ? ink.vermilionAccent : HAIRLINE,
          color: active ? "#fff" : INK_MUTED,
          fontSize: "0.65rem",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {num}
      </span>
      <div>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: active ? ink.vermilionAccent : INK_PRIMARY }}>
          {label}
        </div>
        <div style={{ fontSize: "0.72rem", color: INK_MUTED, marginTop: "0.1rem" }}>{description}</div>
      </div>
    </button>
  );
}

function ResultCard({
  label,
  color,
  nakshatra,
  devanagari,
  lord,
  balanceYmd,
  balanceYears,
}: {
  label: string;
  color: string;
  nakshatra: string;
  devanagari: string;
  lord: { nameIAST: string; devanagari: string; color: string };
  balanceYmd: string;
  balanceYears: number;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        background: SURFACE,
        border: `1.5px solid ${color}50`,
        padding: "1rem",
      }}
    >
      <div style={{ fontSize: "0.78rem", fontWeight: 900, color, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
        <Devanagari size="sm" style={{ color: lord.color }}>
          {devanagari}
        </Devanagari>
        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          <IAST>{nakshatra}</IAST>
        </span>
      </div>
      <div style={{ fontSize: "0.82rem", color: INK_SECONDARY, marginBottom: "0.4rem" }}>
        Lord: <IAST>{lord.nameIAST}</IAST> ({lord.devanagari})
      </div>
      <div style={{ padding: "0.5rem 0.7rem", borderRadius: 8, background: `${lord.color}12`, border: `1px solid ${lord.color}30` }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: lord.color, fontFamily: "var(--font-cormorant), serif" }}>
          {balanceYmd}
        </div>
        <div style={{ fontSize: "0.75rem", color: INK_MUTED }}>{balanceYears.toFixed(3)} years</div>
      </div>
    </div>
  );
}
