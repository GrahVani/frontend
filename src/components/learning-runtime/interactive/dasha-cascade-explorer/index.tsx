"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { AlertTriangle, ChevronRight, GitBranch, Layers3, RotateCcw, ShieldCheck, Timer, ZoomIn } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST, Devanagari } from "../../chrome/typography";
import { useLessonSlug } from "@/components/learning-runtime/interactive/tier-1/module-4/rashi-attribute-wheel";
import { DASHA_LORDS, SEQUENCE_MNEMONIC, YEARS_MNEMONIC, rotatedSequence } from "../dasha-timeline/data";
import {
  CASCADE_LEVELS,
  DEFAULT_CASCADE_PATH,
  STANDARD_DEPTH_KEYS,
  buildCascadeNodes,
  buildSubPeriods,
  formatCascadeDuration,
  getLevel,
  getLordByIndex,
  getParentForLevel,
  type CascadeLevelKey,
} from "./data";

const LEVEL_KEYS = CASCADE_LEVELS.map((level) => level.key);
const READABLE_INK = "#3F2D1D";
const READABLE_SECONDARY = "#5C4630";
const READABLE_MUTED = "#745D40";
const READABLE_GOLD = "#936817";
const TABLE_LINE = "rgba(139, 118, 82, 0.28)";
const SELECTED_ROW = "rgba(255, 248, 229, 0.98)";

type FineUnit = "days" | "hours" | "minutes";

interface FinePeriodRow {
  sequenceNumber: number;
  lord: (typeof DASHA_LORDS)[number];
  amount: number;
  start: number;
  end: number;
}

function buildFineRows(parentLordIndex: number, parentAmount: number): FinePeriodRow[] {
  let running = 0;

  return rotatedSequence(parentLordIndex - 1).map((lord, index) => {
    const amount = (parentAmount * lord.years) / 120;
    const row = {
      sequenceNumber: index + 1,
      lord,
      amount,
      start: running,
      end: running + amount,
    };
    running += amount;
    return row;
  });
}

function formatFineAmount(amount: number, unit: FineUnit) {
  if (unit === "days") {
    return amount >= 10 ? `${amount.toFixed(0)} d` : `${amount.toFixed(1)} d`;
  }
  if (unit === "hours") {
    return amount >= 10 ? `${amount.toFixed(0)} hr` : `${amount.toFixed(1)} hr`;
  }
  return amount >= 10 ? `${amount.toFixed(0)} min` : `${amount.toFixed(1)} min`;
}

function FineLevelTable({
  title,
  parentLabel,
  parentAmount,
  unit,
  rows,
  selectedLordIndex,
  onSelectLord,
}: {
  title: string;
  parentLabel: string;
  parentAmount: number;
  unit: FineUnit;
  rows: FinePeriodRow[];
  selectedLordIndex: number;
  onSelectLord: (index: number) => void;
}) {
  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  return (
    <section className="min-w-0 rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
            {title}
          </p>
          <p className="m-0 text-base" style={{ color: READABLE_SECONDARY }}>
            Parent: {parentLabel} = {formatFineAmount(parentAmount, unit)}
          </p>
        </div>
        <p className="m-0 text-sm font-semibold" style={{ color: READABLE_MUTED, overflowWrap: "anywhere" }}>
          {rows.map((row) => row.lord.abbr).join(" -> ")}
        </p>
      </div>

      <div className="max-w-full overflow-x-auto overflow-y-hidden rounded-xl" style={{ border: "1px solid var(--gl-gold-hairline)" }}>
        <div
          className="grid min-w-[780px]"
          style={{
            gridTemplateColumns: "56px 160px 220px 120px 120px 120px",
            background: "var(--gl-surface-2, #F5EDD8)",
            color: READABLE_SECONDARY,
            fontSize: "0.82rem",
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {["#", "Lord", "Formula", "Length", "Starts", "Ends"].map((heading) => (
            <div key={heading} className="px-3 py-2">
              {heading}
            </div>
          ))}
        </div>

        {rows.map((row) => {
          const selected = selectedLordIndex === row.lord.index;
          return (
            <button
              key={`${title}-${row.lord.index}`}
              type="button"
              onClick={() => onSelectLord(row.lord.index)}
              className="grid min-w-[780px] text-left"
              style={{
                gridTemplateColumns: "56px 160px 220px 120px 120px 120px",
                background: selected ? SELECTED_ROW : "var(--gl-card-surface-solid, #FFF9F0)",
                borderTop: `1px solid ${TABLE_LINE}`,
              }}
            >
              <div className="px-3 py-3 text-base font-bold" style={{ color: READABLE_GOLD }}>
                {row.sequenceNumber}
              </div>
              <div className="px-3 py-3">
                <span className="block text-base font-bold" style={{ color: READABLE_INK }}>
                  {row.lord.nameIAST}
                </span>
                <span className="block text-sm" style={{ color: READABLE_SECONDARY }}>
                  {row.lord.years} of 120
                </span>
              </div>
              <div className="px-3 py-3 text-base font-semibold" style={{ color: READABLE_INK, fontFamily: "var(--font-mono), monospace" }}>
                ({parentAmount.toFixed(2)} x {row.lord.years}) / 120
              </div>
              <div className="px-3 py-3 text-base font-bold" style={{ color: READABLE_INK }}>
                {formatFineAmount(row.amount, unit)}
              </div>
              <div className="px-3 py-3 text-base" style={{ color: READABLE_SECONDARY }}>
                +{formatFineAmount(row.start, unit)}
              </div>
              <div className="px-3 py-3 text-base" style={{ color: READABLE_SECONDARY }}>
                +{formatFineAmount(row.end, unit)}
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-base font-semibold" style={{ color: Math.abs(total - parentAmount) < 0.000001 ? "#2F7A4F" : ink.vermilionAccent }}>
        Sum check: {formatFineAmount(total, unit)} returns to the parent.
      </p>
    </section>
  );
}

function FineCascadeDrill() {
  const [bhuktiLordIndex, setBhuktiLordIndex] = useState(9);
  const [bhuktiDays, setBhuktiDays] = useState(983);
  const [selectedPdLordIndex, setSelectedPdLordIndex] = useState(9);
  const [selectedSdLordIndex, setSelectedSdLordIndex] = useState(9);
  const [birthUncertaintyMinutes, setBirthUncertaintyMinutes] = useState(10);

  const bhuktiLord = getLordByIndex(bhuktiLordIndex);
  const pdRows = useMemo(() => buildFineRows(bhuktiLordIndex, bhuktiDays), [bhuktiLordIndex, bhuktiDays]);
  const selectedPd = pdRows.find((row) => row.lord.index === selectedPdLordIndex) ?? pdRows[0];
  const pdHours = selectedPd.amount * 24;
  const sdRows = useMemo(() => buildFineRows(selectedPd.lord.index, pdHours), [selectedPd, pdHours]);
  const selectedSd = sdRows.find((row) => row.lord.index === selectedSdLordIndex) ?? sdRows[0];
  const sdMinutes = selectedSd.amount * 60;
  const subDayReliable = birthUncertaintyMinutes <= 2;
  const hourReliable = birthUncertaintyMinutes <= 15;

  return (
    <section
      className="rounded-xl p-4"
      data-interactive="dasha-cascade-explorer-fine-level"
      style={{ background: "var(--gl-surface-2, #F5EDD8)", border: "1px solid var(--gl-gold-hairline)" }}
    >
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
            Lesson 10.3.4 fine-level drill
          </p>
          <h3 className="mt-1 text-2xl font-semibold" style={{ color: READABLE_INK, fontFamily: "var(--font-cormorant), serif" }}>
            From bhukti-days to <IAST>pratyantardasha</IAST> and <IAST>sukshma</IAST>
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setBhuktiLordIndex(9);
            setBhuktiDays(983);
            setSelectedPdLordIndex(9);
            setSelectedSdLordIndex(9);
            setBirthUncertaintyMinutes(10);
          }}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)", color: READABLE_SECONDARY }}
        >
          <RotateCcw size={16} />
          Saturn-Mercury example
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <div className="mb-3 flex items-center gap-2">
              <Timer size={17} color={ink.goldAccent} />
              <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                Parent bhukti
              </p>
            </div>
            <label className="block">
              <span className="text-sm font-bold uppercase" style={{ color: READABLE_MUTED, letterSpacing: "0.06em" }}>
                Bhukti lord
              </span>
              <select
                value={bhuktiLordIndex}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setBhuktiLordIndex(next);
                  setSelectedPdLordIndex(next);
                }}
                className="mt-1 w-full rounded-lg px-4 py-3 text-base"
                style={{ background: "var(--gl-surface-2, #F5EDD8)", border: "1px solid var(--gl-gold-hairline)", color: READABLE_INK }}
              >
                {DASHA_LORDS.map((lord) => (
                  <option key={lord.index} value={lord.index}>
                    {lord.nameIAST} ({lord.abbr})
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 block">
              <span className="text-sm font-bold uppercase" style={{ color: READABLE_MUTED, letterSpacing: "0.06em" }}>
                Bhukti length in days
              </span>
              <input
                type="number"
                min={1}
                max={8000}
                step={1}
                value={bhuktiDays}
                onChange={(event) => setBhuktiDays(Math.max(1, Number(event.target.value)))}
                className="mt-1 w-full rounded-lg px-4 py-3 text-base"
                style={{ background: "var(--gl-surface-2, #F5EDD8)", border: "1px solid var(--gl-gold-hairline)", color: READABLE_INK }}
              />
            </label>
            <div className="mt-3 rounded-lg p-3" style={{ background: bhuktiLord.colorTint, border: `1px solid ${bhuktiLord.color}40` }}>
              <p className="m-0 text-base font-semibold" style={{ color: READABLE_INK }}>
                PD sequence starts from {bhuktiLord.nameIAST}.
              </p>
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: subDayReliable ? grahas.budha.secondaryTint : `${ink.vermilionAccent}10`, border: `1.5px solid ${subDayReliable ? grahas.budha.primary : ink.vermilionAccent}50` }}>
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle size={17} color={subDayReliable ? grahas.budha.primary : ink.vermilionAccent} />
              <p className="m-0 text-sm font-bold uppercase" style={{ color: subDayReliable ? "#2F7A4F" : ink.vermilionAccent, letterSpacing: "0.08em" }}>
                Birth-time support
              </p>
            </div>
            <label className="block">
              <span className="text-sm font-bold uppercase" style={{ color: READABLE_MUTED, letterSpacing: "0.06em" }}>
                Uncertainty: +/- {birthUncertaintyMinutes} minutes
              </span>
              <input
                type="range"
                min={0}
                max={30}
                value={birthUncertaintyMinutes}
                onChange={(event) => setBirthUncertaintyMinutes(Number(event.target.value))}
                className="mt-2 w-full"
                style={{ accentColor: subDayReliable ? grahas.budha.primary : ink.vermilionAccent }}
              />
            </label>
            <p className="mt-3 text-base leading-relaxed" style={{ color: READABLE_SECONDARY }}>
              {hourReliable
                ? "SD-level hour windows are plausible, but use software for exact boundaries."
                : "Stop at PD. Hour/minute layers would give false precision for this uncertainty."}
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: subDayReliable ? "#2F7A4F" : ink.vermilionAccent }}>
              Prana preview: selected SD is about {formatFineAmount(sdMinutes, "minutes")}.
            </p>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <FineLevelTable
            title="Pratyantardasha table in days"
            parentLabel={`${bhuktiLord.nameIAST} bhukti`}
            parentAmount={bhuktiDays}
            unit="days"
            rows={pdRows}
            selectedLordIndex={selectedPdLordIndex}
            onSelectLord={setSelectedPdLordIndex}
          />
          <FineLevelTable
            title="Sukshma table in hours"
            parentLabel={`${selectedPd.lord.nameIAST} PD`}
            parentAmount={pdHours}
            unit="hours"
            rows={sdRows}
            selectedLordIndex={selectedSdLordIndex}
            onSelectLord={setSelectedSdLordIndex}
          />
        </div>
      </div>
    </section>
  );
}

function updateDownstreamPath(
  path: Record<CascadeLevelKey, number>,
  levelKey: CascadeLevelKey,
  lordIndex: number
): Record<CascadeLevelKey, number> {
  const next = { ...path, [levelKey]: lordIndex };
  const changedIndex = LEVEL_KEYS.indexOf(levelKey);

  for (let i = changedIndex + 1; i < LEVEL_KEYS.length; i++) {
    next[LEVEL_KEYS[i]] = lordIndex;
  }

  return next;
}

function CascadeSvg({
  activeLevel,
  path,
  accurateBirthTime,
  onSelectLevel,
}: {
  activeLevel: CascadeLevelKey;
  path: Record<CascadeLevelKey, number>;
  accurateBirthTime: boolean;
  onSelectLevel: (level: CascadeLevelKey) => void;
}) {
  const nodes = useMemo(() => buildCascadeNodes(path), [path]);

  return (
    <svg
      viewBox="0 0 920 360"
      role="img"
      aria-label="Five nested Vimshottari dasha levels from Mahadasha to Prana"
      className="h-auto w-full"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="cascade-gold-wash" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--gl-card-surface-solid, #FFF9F0)" />
          <stop offset="100%" stopColor="var(--gl-surface-2, #F5EDD8)" />
        </linearGradient>
        <filter id="cascade-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#7A4A1B" floodOpacity="0.12" />
        </filter>
      </defs>

      <rect x="12" y="18" width="896" height="314" rx="18" fill="url(#cascade-gold-wash)" />
      <path
        d="M104 284 C260 216 334 120 464 172 C584 220 612 82 812 106"
        fill="none"
        stroke="var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))"
        strokeWidth="2"
        strokeDasharray="7 9"
      />

      {nodes.map((node, index) => {
        const x = 48 + index * 172;
        const y = 50 + index * 26;
        const cardWidth = 142 - index * 6;
        const cardHeight = 190 - index * 18;
        const selected = activeLevel === node.level.key;
        const fineTimingLocked = !accurateBirthTime && !STANDARD_DEPTH_KEYS.includes(node.level.key);

        return (
          <g
            key={node.level.key}
            role="button"
            tabIndex={0}
            aria-label={`${node.level.abbreviation} ${node.lord.nameIAST}`}
            onClick={() => onSelectLevel(node.level.key)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectLevel(node.level.key);
              }
            }}
            style={{ cursor: "pointer", opacity: fineTimingLocked ? 0.48 : 1 }}
          >
            {index > 0 && (
              <path
                d={`M ${x - 34} ${y + 84} C ${x - 18} ${y + 84}, ${x - 18} ${y + 42}, ${x - 2} ${y + 42}`}
                fill="none"
                stroke={selected ? node.lord.color : "var(--gl-gold-accent)"}
                strokeWidth={selected ? 3 : 1.5}
                strokeLinecap="round"
              />
            )}

            <rect
              x={x}
              y={y}
              width={cardWidth}
              height={cardHeight}
              rx="12"
              fill={selected ? node.lord.colorTint : "var(--gl-card-surface-solid, #FFF9F0)"}
              stroke={selected ? node.lord.color : "var(--gl-gold-hairline, rgba(232, 199, 114, 0.32))"}
              strokeWidth={selected ? 2.5 : 1}
              filter="url(#cascade-soft-shadow)"
            />
            <rect x={x + 12} y={y + 12} width={cardWidth - 24} height="8" rx="4" fill={node.lord.color} opacity={0.78} />
            <text
              x={x + 16}
              y={y + 45}
              fill={node.lord.color}
              fontSize="12"
              fontWeight="800"
              style={{ fontFamily: "var(--font-sans), sans-serif", letterSpacing: "0.08em" }}
            >
              {node.level.abbreviation}
            </text>
            <text
              x={x + 16}
              y={y + 72}
              fill="var(--gl-ink-primary)"
              fontSize="22"
              fontWeight="700"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              {node.lord.abbr}
            </text>
            <text
              x={x + 16}
              y={y + 96}
              fill="var(--gl-ink-secondary)"
              fontSize="13"
              fontWeight="700"
              style={{ fontFamily: "var(--font-sans), sans-serif" }}
            >
              {node.lord.nameIAST}
            </text>
            <text
              x={x + 16}
              y={y + 121}
              fill="var(--gl-ink-muted)"
              fontSize="11"
              style={{ fontFamily: "var(--font-sans), sans-serif" }}
            >
              {formatCascadeDuration(node.years, node.level.unit)}
            </text>
            <text
              x={x + 16}
              y={y + 146}
              fill="var(--gl-ink-muted)"
              fontSize="10"
              style={{ fontFamily: "var(--font-sans), sans-serif" }}
            >
              {node.level.durationScale}
            </text>
            {fineTimingLocked && (
              <text
                x={x + 16}
                y={y + cardHeight - 18}
                fill={ink.vermilionAccent}
                fontSize="10"
                fontWeight="700"
                style={{ fontFamily: "var(--font-sans), sans-serif" }}
              >
                fine timing only
              </text>
            )}
          </g>
        );
      })}

      <g transform="translate(52 300)">
        <text
          x="0"
          y="0"
          fill="var(--gl-ink-muted)"
          fontSize="12"
          fontWeight="700"
          style={{ fontFamily: "var(--font-sans), sans-serif", letterSpacing: "0.08em" }}
        >
          SAME NINE-FOLD RATIO AT EVERY DESCENT
        </text>
        <text
          x="322"
          y="0"
          fill={grahas.budha.primary}
          fontSize="15"
          fontWeight="800"
          style={{ fontFamily: "var(--font-sans), sans-serif" }}
        >
          {YEARS_MNEMONIC}
        </text>
      </g>
    </svg>
  );
}

function SubPeriodSelector({
  activeLevel,
  path,
  onSelectLord,
}: {
  activeLevel: CascadeLevelKey;
  path: Record<CascadeLevelKey, number>;
  onSelectLord: (level: CascadeLevelKey, lordIndex: number) => void;
}) {
  const activeLevelInfo = getLevel(activeLevel);
  const parent = getParentForLevel(activeLevel, path);
  const activeLord = getLordByIndex(path[activeLevel]);
  const parentLord = activeLevel === "md" ? activeLord : parent?.lord ?? activeLord;
  const parentYears = activeLevel === "md" ? activeLord.years : parent?.years ?? activeLord.years;
  const options =
    activeLevel === "md"
      ? DASHA_LORDS.map((lord) => ({ lord, years: lord.years, proportion: lord.years / 120 }))
      : buildSubPeriods(parentLord.index, parentYears);

  return (
    <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
            {activeLevel === "md" ? "Choose mahadasha lord" : `Expand ${parentLord.nameIAST} into ${activeLevelInfo.abbreviation}`}
          </p>
          <h3 className="text-xl font-semibold" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>{activeLevelInfo.labelIAST}</IAST>
          </h3>
        </div>
        <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: activeLord.colorTint, color: activeLord.color }}>
          {activeLord.abbr} selected
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {options.map(({ lord, years, proportion }) => {
          const selected = path[activeLevel] === lord.index;
          return (
            <button
              key={`${activeLevel}-${lord.index}`}
              type="button"
              onClick={() => onSelectLord(activeLevel, lord.index)}
              className="rounded-lg p-3 text-left transition-transform hover:-translate-y-0.5"
              style={{
                background: selected ? lord.colorTint : "var(--gl-surface-2, #F5EDD8)",
                border: `1.5px solid ${selected ? lord.color : "var(--gl-gold-hairline)"}`,
                minHeight: "82px",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold" style={{ color: lord.color }}>
                  {lord.abbr}
                </span>
                <span className="text-xs font-semibold" style={{ color: "var(--gl-ink-muted)" }}>
                  {(proportion * 100).toFixed(1)}%
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                {lord.nameIAST}
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--gl-ink-muted)" }}>
                {formatCascadeDuration(years, activeLevelInfo.unit)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DashaCascadeExplorer() {
  const slug = useLessonSlug();
  const showFineLevelDrill = slug === "constructing-pratyantar-and-sukshma-tables";
  const [activeLevel, setActiveLevel] = useState<CascadeLevelKey>("ad");
  const [path, setPath] = useState<Record<CascadeLevelKey, number>>(DEFAULT_CASCADE_PATH);
  const [accurateBirthTime, setAccurateBirthTime] = useState(false);

  const nodes = useMemo(() => buildCascadeNodes(path), [path]);
  const activeNode = nodes.find((node) => node.level.key === activeLevel) ?? nodes[0];

  const handleSelectLord = (levelKey: CascadeLevelKey, lordIndex: number) => {
    setPath((current) => updateDownstreamPath(current, levelKey, lordIndex));
  };

  if (showFineLevelDrill) {
    return <FineCascadeDrill />;
  }

  return (
    <div
      className="w-full"
      data-interactive="dasha-cascade-explorer"
      style={
        {
          "--cascade-saturn": grahas.shani.primary,
          background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
          border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))",
          borderRadius: "16px",
          padding: "20px",
        } as CSSProperties
      }
    >
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.1em" }}>
            <IAST>Vimshottari</IAST> cascade
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant), serif" }}>
            Five levels, one repeating ratio
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
            Choose a level, then pick the lord inside its parent. The same nine-year ratio repeats; only the
            starting lord and the shrinking parent length change.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAccurateBirthTime((value) => !value)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{
              background: accurateBirthTime ? grahas.budha.secondaryTint : "var(--gl-card-surface-solid, #FFF9F0)",
              color: accurateBirthTime ? grahas.budha.primary : "var(--gl-ink-secondary)",
              border: `1px solid ${accurateBirthTime ? grahas.budha.primary : "var(--gl-gold-hairline)"}`,
            }}
          >
            <ShieldCheck size={16} />
            Accurate birth time
          </button>
          <button
            type="button"
            onClick={() => {
              setPath(DEFAULT_CASCADE_PATH);
              setActiveLevel("ad");
              setAccurateBirthTime(false);
            }}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{
              background: "var(--gl-card-surface-solid, #FFF9F0)",
              color: "var(--gl-ink-secondary)",
              border: "1px solid var(--gl-gold-hairline)",
            }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl p-3" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          <CascadeSvg activeLevel={activeLevel} path={path} accurateBirthTime={accurateBirthTime} onSelectLevel={setActiveLevel} />

          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {CASCADE_LEVELS.map((level) => {
              const node = nodes.find((item) => item.level.key === level.key) ?? nodes[0];
              const active = activeLevel === level.key;
              const fine = !accurateBirthTime && !STANDARD_DEPTH_KEYS.includes(level.key);

              return (
                <button
                  key={level.key}
                  type="button"
                  onClick={() => setActiveLevel(level.key)}
                  className="rounded-lg px-3 py-2 text-left"
                  style={{
                    background: active ? node.lord.colorTint : "var(--gl-surface-2, #F5EDD8)",
                    border: `1.5px solid ${active ? node.lord.color : "var(--gl-gold-hairline)"}`,
                    opacity: fine ? 0.62 : 1,
                    minHeight: "82px",
                  }}
                >
                  <span className="block text-xs font-bold" style={{ color: node.lord.color }}>
                    {level.abbreviation}
                  </span>
                  <span className="block text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                    {node.lord.nameIAST}
                  </span>
                  <span className="block text-xs" style={{ color: "var(--gl-ink-muted)" }}>
                    {level.precision}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <SubPeriodSelector activeLevel={activeLevel} path={path} onSelectLord={handleSelectLord} />

          <div className="rounded-xl p-4" style={{ background: activeNode.lord.colorTint, border: `1.5px solid ${activeNode.lord.color}40` }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase" style={{ color: activeNode.lord.color, letterSpacing: "0.08em" }}>
                  Active window
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant), serif" }}>
                  {activeNode.lord.nameIAST} {activeNode.level.abbreviation}
                </h3>
              </div>
              <Devanagari size="lg" style={{ color: activeNode.lord.color }}>
                {activeNode.level.devanagari}
              </Devanagari>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.52)", border: "1px solid rgba(255,255,255,0.55)" }}>
                <p className="text-xs font-bold uppercase" style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.08em" }}>
                  Duration preview
                </p>
                <p className="mt-1 text-xl font-bold" style={{ color: activeNode.lord.color }}>
                  {formatCascadeDuration(activeNode.years, activeNode.level.unit)}
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.52)", border: "1px solid rgba(255,255,255,0.55)" }}>
                <p className="text-xs font-bold uppercase" style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.08em" }}>
                  Reading precision
                </p>
                <p className="mt-1 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                  {activeNode.level.precision}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
              {activeNode.level.parentPhrase}. The child sequence starts from the parent&apos;s lord, not automatically
              from Ketu.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl p-4" style={{ background: "var(--gl-surface-2, #F5EDD8)", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="mb-3 flex items-center gap-2">
            <GitBranch size={17} color={grahas.rahu.primary} />
            <p className="text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Self-similar rule
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
            <span>{SEQUENCE_MNEMONIC}</span>
            <ChevronRight size={16} />
            <span>{YEARS_MNEMONIC}</span>
            <ChevronRight size={16} />
            <span>divide parent by 120</span>
          </div>
          <p className="mt-3 text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
            At every depth, each child receives its lord&apos;s Vimshottari years as a fraction of 120. That is why
            the shape repeats while the clock becomes smaller.
          </p>
        </div>

        <div
          className="rounded-xl p-4"
          style={{
            background: accurateBirthTime ? grahas.budha.secondaryTint : "var(--gl-card-surface-solid, #FFF9F0)",
            border: `1px solid ${accurateBirthTime ? grahas.budha.primary : "var(--gl-gold-hairline)"}`,
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Layers3 size={17} color={accurateBirthTime ? grahas.budha.primary : ink.vermilionAccent} />
            <p className="text-xs font-bold uppercase" style={{ color: accurateBirthTime ? grahas.budha.primary : ink.vermilionAccent, letterSpacing: "0.08em" }}>
              Practical depth
            </p>
          </div>
          <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
            {accurateBirthTime
              ? "Fine timing is enabled: SD and PrD can be inspected, but still require careful context."
              : "Standard reading depth is MD to AD to PD. SD and PrD are shown muted until the birth time is accurate enough."}
          </p>
          <button
            type="button"
            onClick={() => setActiveLevel(accurateBirthTime ? "prd" : "pd")}
            className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{
              background: "var(--gl-card-surface-solid, #FFF9F0)",
              color: accurateBirthTime ? grahas.budha.primary : ink.vermilionAccent,
              border: "1px solid var(--gl-gold-hairline)",
            }}
          >
            <ZoomIn size={16} />
            {accurateBirthTime ? "Inspect PrD" : "Stop at PD"}
          </button>
        </div>
      </div>
    </div>
  );
}
