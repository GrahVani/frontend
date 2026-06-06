"use client";

/**
 * DashaBalanceCrossCheck — Hand vs Engine Cross-Check Interactive
 *
 * §7 interactive for Lesson 10.2.3 (Cross-Checking Against the Astro Engine).
 *
 * The learner enters their hand-computed balance and compares it against the
 * engine output. The component shows the ±1-day confirmation band and
 * severity-based diagnosis hints when they diverge.
 *
 * Design system: Grahvani Learning Design System
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { DASHA_LORDS } from "../dasha-timeline/data";
import {
  PRESETS,
  computeBalance,
  formatDms,
  formatYmd,
  compareHandVsEngine,
  type HandBalanceInput,
} from "../dasha-balance-calculator/data";
import {
  AlertTriangle,
  CheckCircle2,
  Crosshair,
  Moon,
  RotateCcw,
  XCircle,
  Activity,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";

export function DashaBalanceCrossCheck() {
  const [moonLongitude, setMoonLongitude] = useState(263.2381);

  // Hand-computed balance inputs
  const [handYears, setHandYears] = useState(4);
  const [handMonths, setHandMonths] = useState(1);
  const [handDays, setHandDays] = useState(11);
  const [handLord, setHandLord] = useState("guru");

  const engineResult = useMemo(() => computeBalance(moonLongitude), [moonLongitude]);

  const handInput: HandBalanceInput = {
    years: handYears,
    months: handMonths,
    days: handDays,
    lordSlug: handLord,
  };

  const check = compareHandVsEngine(handInput, engineResult);

  const severityColor =
    check.severity === "match"
      ? ink.goldAccent
      : check.severity === "minor"
      ? "#B8860B"
      : check.severity === "major"
      ? ink.vermilionAccent
      : "#8B0000";

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
      data-interactive="dasha-balance-cross-check"
    >
      {/* Header */}
      <div className="mb-4">
        <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", color: INK_MUTED }}>
          Cross-Check interactive
        </p>
        <h2 className="text-lg font-semibold mt-1" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Hand Balance vs Astro Engine
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          Enter your hand-computed balance. Compare against the engine output. ±1 day = confirmed.
        </p>
      </div>

      {/* Moon longitude input */}
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
            Birth Moon longitude (engine input)
          </span>
        </div>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
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

      {/* Hand balance input */}
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
          <Crosshair size={16} style={{ color: ink.goldAccent }} />
          <span style={{ fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", color: GOLD_ACCENT }}>
            Your hand-computed balance
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 100%), 1fr))",
            gap: "0.6rem",
          }}
        >
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Years</label>
            <input
              type="number"
              min={0}
              max={120}
              value={handYears}
              onChange={(e) => setHandYears(Math.max(0, Number(e.target.value)))}
              className="w-full mt-1 rounded-lg px-2.5 py-1.5 text-sm"
              style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Months</label>
            <input
              type="number"
              min={0}
              max={11}
              value={handMonths}
              onChange={(e) => setHandMonths(Math.max(0, Math.min(11, Number(e.target.value))))}
              className="w-full mt-1 rounded-lg px-2.5 py-1.5 text-sm"
              style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Days</label>
            <input
              type="number"
              min={0}
              max={30}
              value={handDays}
              onChange={(e) => setHandDays(Math.max(0, Math.min(30, Number(e.target.value))))}
              className="w-full mt-1 rounded-lg px-2.5 py-1.5 text-sm"
              style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Starting lord</label>
            <select
              value={handLord}
              onChange={(e) => setHandLord(e.target.value)}
              className="w-full mt-1 rounded-lg px-2.5 py-1.5 text-sm"
              style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {DASHA_LORDS.map((l) => (
                <option key={l.grahaSlug} value={l.grahaSlug}>
                  {l.nameIAST} ({l.years}y)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison band */}
      <div
        style={{
          borderRadius: 12,
          background: check.withinTolerance ? `${ink.goldAccent}10` : `${ink.vermilionAccent}10`,
          border: `2px solid ${check.withinTolerance ? ink.goldAccent : ink.vermilionAccent}50`,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
          {check.withinTolerance ? (
            <CheckCircle2 size={20} style={{ color: ink.goldAccent }} />
          ) : (
            <XCircle size={20} style={{ color: ink.vermilionAccent }} />
          )}
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: check.withinTolerance ? ink.goldAccent : ink.vermilionAccent,
            }}
          >
            {check.withinTolerance
              ? `✓ CONFIRMED — within ±1 day (${check.divergenceDays.toFixed(2)} days off)`
              : `✗ DIVERGENCE — ${check.divergenceDays.toFixed(1)} days off`}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              borderRadius: 10,
              background: SURFACE,
              border: `1.5px solid ${ink.goldAccent}40`,
              padding: "0.85rem",
            }}
          >
            <div style={{ fontSize: "0.72rem", fontWeight: 900, color: ink.goldAccent, textTransform: "uppercase", marginBottom: "0.3rem" }}>
              Hand computed
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {handYears}y {handMonths}m {handDays}d
            </div>
            <div style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>
              Lord: {DASHA_LORDS.find((l) => l.grahaSlug === handLord)?.nameIAST ?? handLord}
            </div>
          </div>

          <div
            style={{
              borderRadius: 10,
              background: SURFACE,
              border: `1.5px solid ${engineResult.nakshatraMapping.lord.color}40`,
              padding: "0.85rem",
            }}
          >
            <div style={{ fontSize: "0.72rem", fontWeight: 900, color: engineResult.nakshatraMapping.lord.color, textTransform: "uppercase", marginBottom: "0.3rem" }}>
              Engine output
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {formatYmd(engineResult.balanceYmd)}
            </div>
            <div style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>
              Lord: <IAST>{engineResult.nakshatraMapping.lord.nameIAST}</IAST> · {engineResult.balanceYears.toFixed(3)}y
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div
        style={{
          borderRadius: 10,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "0.85rem 1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
          <Activity size={16} style={{ color: severityColor, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: severityColor, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Diagnosis
            </div>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
              {check.diagnosis}
            </p>
          </div>
        </div>
      </div>

      {/* Engine detail card */}
      <div
        style={{
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          padding: "1rem",
        }}
      >
        <div style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.6rem" }}>
          Engine computation details
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: "0.5rem" }}>
          <Detail label="Moon longitude" value={formatDms(engineResult.moonLongitude)} />
          <Detail label="Nakṣatra" value={`${engineResult.nakshatraMapping.nakshatra.name} (${engineResult.nakshatraMapping.nakshatra.devanagari})`} />
          <Detail label="Pāda" value={`${engineResult.pada} of 4`} />
          <Detail label="Lord" value={`${engineResult.nakshatraMapping.lord.nameIAST} (${engineResult.nakshatraMapping.lord.years}y)`} />
          <Detail label="Fraction remaining" value={engineResult.fractionRemaining.toFixed(6)} />
          <Detail label="Balance (years)" value={engineResult.balanceYears.toFixed(4)} />
        </div>
      </div>

      {/* Reset */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setMoonLongitude(263.2381);
            setHandYears(4);
            setHandMonths(1);
            setHandDays(11);
            setHandLord("guru");
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
          Reset cross-check
        </button>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: "0.7rem", color: INK_MUTED, fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, fontWeight: 600 }}>{value}</div>
    </div>
  );
}
