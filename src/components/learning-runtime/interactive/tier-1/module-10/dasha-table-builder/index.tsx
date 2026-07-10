"use client";

/**
 * DashaTableBuilder — Mahādaśā-Bhukti Table Constructor
 *
 * §7 interactive for Lesson 10.2.4 (Mahādaśā-Bhukti Table Construction).
 *
 * Builds the full birth-to-120 mahādaśā table from a balance,
 * and expands any mahādaśā into its nine bhuktis with the
 * proportion formula bhukti = (MD-years × lord-years) ÷ 120.
 *
 * Design system: Grahvani Learning Design System
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { DASHA_LORDS } from "../dasha-timeline/data";
import {
  computeBalance,
  formatDms,
  dmsToDecimal,
  toDms,
} from "../dasha-balance-calculator/data";
import {
  buildMahadashaTable,
  computeBhuktis,
  formatYmd,
  formatDecimalYears,
  type MahadashaRow,
  type BhuktiRow,
} from "./data";
import {
  Calculator,
  ChevronDown,
  ChevronRight,
  List,
  Moon,
  RotateCcw,
  Table2,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";

/* ─── Sub-components ───────────────────────────────────────────────────── */

function InputPanel({
  moonLon,
  setMoonLon,
  directLordIndex,
  setDirectLordIndex,
  directBalance,
  setDirectBalance,
  useDirectMode,
  setUseDirectMode,
}: {
  moonLon: number;
  setMoonLon: (v: number) => void;
  directLordIndex: number;
  setDirectLordIndex: (v: number) => void;
  directBalance: number;
  setDirectBalance: (v: number) => void;
  useDirectMode: boolean;
  setUseDirectMode: (v: boolean) => void;
}) {
  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
        <Calculator size={16} style={{ color: ink.goldAccent }} />
        <span style={{ fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", color: GOLD_ACCENT }}>
          Table input
        </span>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <button
          type="button"
          onClick={() => setUseDirectMode(false)}
          style={{
            flex: 1,
            padding: "0.4rem 0.6rem",
            borderRadius: 8,
            border: `1.5px solid ${!useDirectMode ? ink.goldAccent : HAIRLINE}`,
            background: !useDirectMode ? `${ink.goldAccent}12` : "transparent",
            color: !useDirectMode ? INK_PRIMARY : INK_MUTED,
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Moon longitude
        </button>
        <button
          type="button"
          onClick={() => setUseDirectMode(true)}
          style={{
            flex: 1,
            padding: "0.4rem 0.6rem",
            borderRadius: 8,
            border: `1.5px solid ${useDirectMode ? ink.goldAccent : HAIRLINE}`,
            background: useDirectMode ? `${ink.goldAccent}12` : "transparent",
            color: useDirectMode ? INK_PRIMARY : INK_MUTED,
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Direct lord + balance
        </button>
      </div>

      {!useDirectMode ? (
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Moon sidereal longitude (0–360°)</span>
            <input
              type="number"
              min={0}
              max={360}
              step={0.0001}
              value={moonLon}
              onChange={(e) => setMoonLon(Number(e.target.value))}
              className="w-full mt-1 rounded-lg px-2.5 py-1.5 text-sm"
              style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            />
          </label>
          <div style={{ fontSize: "0.72rem", color: INK_MUTED }}>
            Auto-computes starting lord and balance from Moon position.
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.6rem" }}>
          <label style={{ display: "block" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Starting mahādaśā lord</span>
            <select
              value={directLordIndex}
              onChange={(e) => setDirectLordIndex(Number(e.target.value))}
              className="w-full mt-1 rounded-lg px-2.5 py-1.5 text-sm"
              style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {DASHA_LORDS.map((l, i) => (
                <option key={l.grahaSlug} value={i}>
                  {l.nameIAST} ({l.years}y)
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: "block" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Balance (years remaining)</span>
            <input
              type="number"
              min={0}
              max={20}
              step={0.001}
              value={directBalance}
              onChange={(e) => setDirectBalance(Number(e.target.value))}
              className="w-full mt-1 rounded-lg px-2.5 py-1.5 text-sm"
              style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            />
          </label>
        </div>
      )}

      {/* Quick presets */}
      <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: `1px dashed ${HAIRLINE}` }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
          Quick presets
        </span>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <PresetButton label="Ketu 3.5y" onClick={() => { setUseDirectMode(true); setDirectLordIndex(0); setDirectBalance(3.5); }} />
          <PresetButton label="Jupiter 8.12y" onClick={() => { setUseDirectMode(true); setDirectLordIndex(6); setDirectBalance(8.12); }} />
          <PresetButton label="Venus 0.5y" onClick={() => { setUseDirectMode(true); setDirectLordIndex(1); setDirectBalance(0.5); }} />
          <PresetButton label="Moon at 0° Aśvinī" onClick={() => { setUseDirectMode(false); setMoonLon(0); }} />
        </div>
      </div>
    </div>
  );
}

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
      {label}
    </button>
  );
}

function MdTable({
  rows,
  selectedIndex,
  onSelect,
}: {
  rows: MahadashaRow[];
  selectedIndex: number | null;
  onSelect: (idx: number) => void;
}) {
  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
        <Table2 size={16} style={{ color: ink.goldAccent }} />
        <span style={{ fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", color: GOLD_ACCENT }}>
          Mahādaśā table (birth → 120)
        </span>
      </div>

      <div style={{ display: "grid", gap: "0.35rem" }}>
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 1fr 120px 80px 40px",
            gap: "0.5rem",
            padding: "0.4rem 0.6rem",
            fontSize: "0.68rem",
            fontWeight: 800,
            color: INK_MUTED,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          <span>#</span>
          <span>Lord</span>
          <span>Age span</span>
          <span>Years</span>
          <span></span>
        </div>

        {rows.map((row) => {
          const isSelected = selectedIndex === row.index;
          return (
            <button
              key={row.index}
              type="button"
              onClick={() => onSelect(isSelected ? -1 : row.index)}
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr 120px 80px 40px",
                gap: "0.5rem",
                alignItems: "center",
                padding: "0.5rem 0.6rem",
                borderRadius: 8,
                border: `1.5px solid ${isSelected ? row.lord.color : HAIRLINE}`,
                background: isSelected ? `${row.lord.color}10` : row.isFirst ? `${row.lord.color}08` : "transparent",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: INK_MUTED }}>{row.index + 1}</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: row.lord.color, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{row.lord.nameIAST}</IAST>
                {row.isFirst && (
                  <span style={{ fontSize: "0.65rem", color: INK_MUTED, marginLeft: "0.4rem", fontFamily: "var(--font-sans), sans-serif" }}>
                    (balance)
                  </span>
                )}
              </span>
              <span style={{ fontSize: "0.78rem", color: INK_SECONDARY }}>
                {row.startAge.toFixed(1)} → {row.endAge.toFixed(1)}
              </span>
              <span style={{ fontSize: "0.78rem", color: INK_PRIMARY, fontWeight: 700 }}>
                {row.years.toFixed(2)}
              </span>
              <span style={{ display: "flex", justifyContent: "center" }}>
                {isSelected ? (
                  <ChevronDown size={14} style={{ color: row.lord.color }} />
                ) : (
                  <ChevronRight size={14} style={{ color: INK_MUTED }} />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "0.6rem", fontSize: "0.72rem", color: INK_MUTED }}>
        Click a row to expand its nine bhuktis. Only the first mahādaśā is partial (the balance); all later ones use their full years.
      </div>
    </div>
  );
}

function BhuktiPanel({ mdRow }: { mdRow: MahadashaRow }) {
  const bhuktis = useMemo(() => computeBhuktis(mdRow.lord.index - 1, mdRow.years), [mdRow]);
  const totalBhuktiYears = bhuktis.reduce((sum, b) => sum + b.years, 0);

  return (
    <div style={{ border: `2px solid ${mdRow.lord.color}40`, borderRadius: 12, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.6rem" }}>
        <List size={16} style={{ color: mdRow.lord.color }} />
        <span style={{ fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", color: mdRow.lord.color }}>
          Bhuktis within <IAST>{mdRow.lord.nameIAST}</IAST> mahādaśā
        </span>
      </div>

      <div
        style={{
          borderRadius: 8,
          background: `${mdRow.lord.color}10`,
          border: `1px solid ${mdRow.lord.color}30`,
          padding: "0.6rem 0.8rem",
          marginBottom: "0.75rem",
        }}
      >
        <span style={{ fontSize: "0.78rem", color: INK_SECONDARY }}>
          Formula: <strong>bhukti = (MD-years × bhukti-lord-years) ÷ 120</strong>
        </span>
        <span style={{ fontSize: "0.72rem", color: INK_MUTED, display: "block", marginTop: "0.15rem" }}>
          Mahādaśā = <IAST>{mdRow.lord.nameIAST}</IAST>, {mdRow.years.toFixed(3)} years
        </span>
      </div>

      <div style={{ display: "grid", gap: "0.3rem" }}>
        {/* Bhukti header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 120px 1fr",
            gap: "0.5rem",
            padding: "0.3rem 0.5rem",
            fontSize: "0.65rem",
            fontWeight: 800,
            color: INK_MUTED,
            textTransform: "uppercase",
          }}
        >
          <span>Bhukti lord</span>
          <span>Years</span>
          <span>YMD</span>
          <span>Formula</span>
        </div>

        {bhuktis.map((b, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 80px 120px 1fr",
              gap: "0.5rem",
              alignItems: "center",
              padding: "0.4rem 0.5rem",
              borderRadius: 6,
              background: i === 0 ? `${b.lord.color}12` : "transparent",
              border: `1px solid ${i === 0 ? `${b.lord.color}40` : HAIRLINE}`,
            }}
          >
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: b.lord.color, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{b.lord.nameIAST}</IAST>
              {i === 0 && (
                <span style={{ fontSize: "0.6rem", color: INK_MUTED, marginLeft: "0.3rem", fontFamily: "var(--font-sans)" }}>starts</span>
              )}
            </span>
            <span style={{ fontSize: "0.8rem", color: INK_PRIMARY, fontWeight: 700 }}>
              {b.years.toFixed(3)}
            </span>
            <span style={{ fontSize: "0.75rem", color: INK_SECONDARY }}>
              {formatYmd(yearsToYmd(b.years))}
            </span>
            <span style={{ fontSize: "0.72rem", color: INK_MUTED, fontFamily: "var(--font-mono), monospace" }}>
              {b.formula}
            </span>
          </div>
        ))}
      </div>

      {/* Sum verification */}
      <div
        style={{
          marginTop: "0.6rem",
          borderRadius: 8,
          background: `${mdRow.lord.color}10`,
          border: `1.5px solid ${mdRow.lord.color}40`,
          padding: "0.5rem 0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "0.78rem", color: INK_SECONDARY }}>
          Sum of 9 bhuktis: <strong>{totalBhuktiYears.toFixed(3)} years</strong>
        </span>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 800,
            color: Math.abs(totalBhuktiYears - mdRow.years) < 0.001 ? mdRow.lord.color : ink.vermilionAccent,
          }}
        >
          {Math.abs(totalBhuktiYears - mdRow.years) < 0.001 ? "✓ Matches MD" : "✗ Mismatch"}
        </span>
      </div>
    </div>
  );
}

function yearsToYmd(years: number) {
  const y = Math.floor(years);
  const remainderMonths = (years - y) * 12;
  const m = Math.floor(remainderMonths);
  const d = Math.round((remainderMonths - m) * 30);
  return { years: y, months: m, days: d };
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export function DashaTableBuilder() {
  const [moonLon, setMoonLon] = useState(263.2381);
  const [directLordIndex, setDirectLordIndex] = useState(6); // Jupiter
  const [directBalance, setDirectBalance] = useState(4.114);
  const [useDirectMode, setUseDirectMode] = useState(false);
  const [selectedMdIndex, setSelectedMdIndex] = useState<number | null>(0);

  const { startLordIndex, balanceYears } = useMemo(() => {
    if (useDirectMode) {
      return { startLordIndex: directLordIndex, balanceYears: directBalance };
    }
    const bal = computeBalance(moonLon);
    return { startLordIndex: bal.nakshatraMapping.lord.index - 1, balanceYears: bal.balanceYears };
  }, [useDirectMode, directLordIndex, directBalance, moonLon]);

  const mdRows = useMemo(
    () => buildMahadashaTable(startLordIndex, balanceYears),
    [startLordIndex, balanceYears]
  );

  const selectedMd = selectedMdIndex != null ? mdRows.find((r) => r.index === selectedMdIndex) ?? null : null;

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
      data-interactive="dasha-table-builder"
    >
      {/* Header */}
      <div className="mb-4">
        <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", color: INK_MUTED }}>
          Table builder interactive
        </p>
        <h2 className="text-lg font-semibold mt-1" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          <IAST>Mahādaśā</IAST>-<IAST>Bhukti</IAST> Table Constructor
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          Build the full birth-to-120 table from a balance. Expand any mahādaśā to see its nine bhuktis.
        </p>
      </div>

      {/* Input + Table layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
          gap: "0.85rem",
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: "0.85rem" }}>
          <InputPanel
            moonLon={moonLon}
            setMoonLon={setMoonLon}
            directLordIndex={directLordIndex}
            setDirectLordIndex={setDirectLordIndex}
            directBalance={directBalance}
            setDirectBalance={setDirectBalance}
            useDirectMode={useDirectMode}
            setUseDirectMode={setUseDirectMode}
          />

          {/* Summary card */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 900, color: GOLD_ACCENT, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
              Current table basis
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: INK_MUTED, fontWeight: 700, textTransform: "uppercase" }}>Starting lord</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: DASHA_LORDS[startLordIndex].color, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{DASHA_LORDS[startLordIndex].nameIAST}</IAST>
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", color: INK_MUTED, fontWeight: 700, textTransform: "uppercase" }}>Balance</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {formatYmd(yearsToYmd(balanceYears))}
                </div>
                <div style={{ fontSize: "0.72rem", color: INK_MUTED }}>{balanceYears.toFixed(3)} years</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <MdTable rows={mdRows} selectedIndex={selectedMdIndex} onSelect={setSelectedMdIndex} />
          {selectedMd && <BhuktiPanel mdRow={selectedMd} />}
        </div>
      </div>

      {/* Reset */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setMoonLon(263.2381);
            setDirectLordIndex(6);
            setDirectBalance(4.114);
            setUseDirectMode(false);
            setSelectedMdIndex(0);
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
          Reset builder
        </button>
      </div>
    </div>
  );
}
