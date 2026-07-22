"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Layers3, RotateCcw } from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type LordKey =
  | "ketu"
  | "venus"
  | "sun"
  | "moon"
  | "mars"
  | "rahu"
  | "jupiter"
  | "saturn"
  | "mercury";
type UnitMode = "hours" | "days";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const LORDS: Record<
  LordKey,
  { label: string; short: string; years: number; color: string }
> = {
  ketu: { label: "Ketu", short: "Ke", years: 7, color: PURPLE },
  venus: { label: "Venus", short: "Ve", years: 20, color: GOLD },
  sun: { label: "Sun", short: "Su", years: 6, color: VERMILION },
  moon: { label: "Moon", short: "Mo", years: 10, color: BLUE },
  mars: { label: "Mars", short: "Ma", years: 7, color: VERMILION },
  rahu: { label: "Rāhu", short: "Ra", years: 18, color: PURPLE },
  jupiter: { label: "Jupiter", short: "Ju", years: 16, color: GREEN },
  saturn: { label: "Saturn", short: "Sa", years: 19, color: PURPLE },
  mercury: { label: "Mercury", short: "Me", years: 17, color: GREEN },
};

const LORD_ORDER: LordKey[] = [
  "ketu",
  "venus",
  "sun",
  "moon",
  "mars",
  "rahu",
  "jupiter",
  "saturn",
  "mercury",
];

function computeChildren(parentLord: LordKey, parentDurationHours: number) {
  const parentIndex = LORD_ORDER.indexOf(parentLord);
  let running = 0;
  return LORD_ORDER.map((_, offset) => {
    const childLord = LORD_ORDER[(parentIndex + offset) % 9];
    const duration = (parentDurationHours * LORDS[childLord].years) / 120;
    const start = running;
    running += duration;
    return { lord: childLord, duration, start, end: running };
  });
}

function formatHours(hours: number, unitMode: UnitMode): string {
  if (unitMode === "days") {
    return `${(hours / 24).toFixed(3)} d`;
  }
  return hours >= 10 ? `${hours.toFixed(1)} h` : `${hours.toFixed(2)} h`;
}

const MD_START_AGE = 30.506;
const MD_YEARS = 10;
const AD_START_AGE = 31.3385; // approximate from lesson
const AD_YEARS = 0.5833;
const PD_START_AGE = 31.5386;
const PD_HOURS = 809.6;
const SD_START_AGE = 31.5532; // approximate
const SD_HOURS = 128.2;

export function DeeperSubPeriodsCascadeWorkbench() {
  const [unitMode, setUnitMode] = useState<UnitMode>("hours");
  const [showStrengthNote, setShowStrengthNote] = useState(false);
  const [prdTargetLord, setPrdTargetLord] = useState<LordKey>("venus");
  const [pdLord, setPdLord] = useState<LordKey>("saturn");

  const mdEndAge = MD_START_AGE + MD_YEARS;
  const adEndAge = AD_START_AGE + AD_YEARS;
  const pdEndAge = PD_START_AGE + PD_HOURS / 24 / 365.25;
  const sdEndAge = SD_START_AGE + SD_HOURS / 24 / 365.25;

  const sdRows = useMemo(
    () => computeChildren(pdLord, PD_HOURS),
    [pdLord]
  );

  const selectedSd = sdRows[0];
  const prdRows = useMemo(
    () => computeChildren(selectedSd.lord, selectedSd.duration),
    [selectedSd]
  );

  const sdSum = sdRows.reduce((s, row) => s + row.duration, 0);
  const prdSum = prdRows.reduce((s, row) => s + row.duration, 0);

  const prdTargetRow = prdRows.find((row) => row.lord === prdTargetLord);
  const prdTargetIndex = prdRows.findIndex((row) => row.lord === prdTargetLord);
  const precedingPrd = prdRows.slice(0, prdTargetIndex);
  const precedingSum = precedingPrd.reduce(
    (sum, row) => sum + LORDS[row.lord].years,
    0
  );
  const directJumpOffset =
    prdTargetIndex > 0 ? (selectedSd.duration * precedingSum) / 120 : 0;

  const levels: Array<{ key: string; label: string; lord: LordKey; start: number; end: number; span: string; color: string; }> = [
    { key: "md", label: "Mahādaśā", lord: "moon", start: MD_START_AGE, end: mdEndAge, span: "10 years", color: BLUE },
    { key: "ad", label: "Antardaśā", lord: "mars", start: AD_START_AGE, end: adEndAge, span: "~213 days", color: GREEN },
    { key: "pd", label: "Pratyantardaśā", lord: pdLord as LordKey, start: PD_START_AGE, end: pdEndAge, span: `${formatHours(PD_HOURS, unitMode)}`, color: GOLD },
    { key: "sd", label: "Sūkṣma-daśā", lord: selectedSd.lord as LordKey, start: SD_START_AGE, end: sdEndAge, span: `${formatHours(SD_HOURS, unitMode)}`, color: PURPLE },
    { key: "prd", label: "Prāṇa-daśā", lord: "saturn", start: SD_START_AGE, end: sdEndAge, span: `${formatHours(selectedSd.duration, unitMode)}`, color: VERMILION },
  ];

  return (
    <div
      data-interactive="deeper-sub-periods-cascade-workbench"
      style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}
    >
      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={eyebrowStyle}>Deeper sub-periods cascade</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: GOLD,
                fontSize: "1.35rem",
                fontWeight: 600,
              }}
            >
              Complete the descent: SD and PrD on one real branch
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              Follow Moon/Mars/Saturn from a 10-year mahādaśā down to a
              20-hour prāṇa-daśā. The rule stays the same; only the units and
              the patience required change.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setUnitMode("hours");
              setShowStrengthNote(false);
              setPrdTargetLord("venus");
              setPdLord("saturn");
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <p style={eyebrowStyle}>Full five-level chain</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              aria-pressed={unitMode === "hours"}
              onClick={() => setUnitMode("hours")}
              style={smallChipStyle(unitMode === "hours", BLUE)}
            >
              Hours
            </button>
            <button
              type="button"
              aria-pressed={unitMode === "days"}
              onClick={() => setUnitMode("days")}
              style={smallChipStyle(unitMode === "days", GREEN)}
            >
              Days
            </button>
          </div>
        </div>
        <ChainSvg levels={levels} />
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Parent-lord-first rule</p>
          <h3
            style={{
              margin: "0.15rem 0 0.75rem",
              color: PURPLE,
              fontSize: "1.18rem",
              fontWeight: 600,
            }}
          >
            Why Saturn keeps coming first
          </h3>
          <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
            At every level the cyclic order restarts from that level&apos;s own
            parent lord. Saturn is the parent at PD and again at SD, so
            Saturn/Saturn/Saturn is the first branch — bookkeeping, not
            strength.
          </p>
          <button
            type="button"
            aria-pressed={showStrengthNote}
            onClick={() => setShowStrengthNote((v) => !v)}
            style={togglePanelStyle(showStrengthNote, PURPLE)}
          >
            <Layers3 size={18} aria-hidden="true" />
            <span>
              <strong style={{ fontWeight: 700 }}>Bookkeeping vs strength</strong>
              <span>
                {showStrengthNote
                  ? "Coming first is a structural artifact of the restart rule. Genuine strength analysis is a separate Chapter 2 topic."
                  : "Tap to see why this is not an astrological strength claim."}
              </span>
            </span>
          </button>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Branch selector</p>
          <h3
            style={{
              margin: "0.15rem 0 0.75rem",
              color: GOLD,
              fontSize: "1.18rem",
              fontWeight: 600,
            }}
          >
            Choose the pratyantardaśā parent
          </h3>
          <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
            The lesson follows Moon/Mars/Saturn. You can recompute the SD/PrD
            tables from any PD lord to see the same rule in action.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {LORD_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={pdLord === key}
                onClick={() => setPdLord(key)}
                style={smallChipStyle(pdLord === key, LORDS[key].color)}
              >
                {LORDS[key].short}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <LevelTable
          title="Level 4 — Sūkṣma-daśā"
          parentLabel={`${LORDS[pdLord].label} PD`}
          parentDuration={PD_HOURS}
          rows={sdRows}
          unitMode={unitMode}
          sum={sdSum}
          expectedSum={PD_HOURS}
        />
        <LevelTable
          title="Level 5 — Prāṇa-daśā"
          parentLabel={`${LORDS[selectedSd.lord].label} SD`}
          parentDuration={selectedSd.duration}
          rows={prdRows}
          unitMode={unitMode}
          sum={prdSum}
          expectedSum={selectedSd.duration}
        />
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Direct jump at prāṇa-daśā depth</p>
        <h3
          style={{
            margin: "0.15rem 0 0.75rem",
            color: VERMILION,
            fontSize: "1.18rem",
            fontWeight: 600,
          }}
        >
          The Lesson 18.1.2 shortcut works four levels deeper
        </h3>
        <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
          Pick any prāṇa-daśā lord. Sum the year-values of the lords preceding
          it in cyclic order, then convert in one step.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.45rem",
            marginBottom: "0.85rem",
          }}
        >
          {prdRows.map((row) => (
            <button
              key={row.lord}
              type="button"
              aria-pressed={prdTargetLord === row.lord}
              onClick={() => setPrdTargetLord(row.lord)}
              style={smallChipStyle(
                prdTargetLord === row.lord,
                LORDS[row.lord].color
              )}
            >
              {LORDS[row.lord].short}
            </button>
          ))}
        </div>
        <div
          style={{
            padding: "0.75rem",
            borderRadius: 8,
            background: `${VERMILION}08`,
            border: `1px solid ${VERMILION}33`,
          }}
        >
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            Target: <strong style={{ color: LORDS[prdTargetLord].color, fontWeight: 700 }}>{LORDS[prdTargetLord].label}</strong>
            {prdTargetRow ? (
              <>
                {" "}
                — starts at{" "}
                <strong style={{ fontWeight: 700 }}>
                  {formatHours(prdTargetRow.start, unitMode)}
                </strong>{" "}
                into the parent SD.
              </>
            ) : null}
          </p>
          {prdTargetIndex > 0 ? (
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              Preceding lords:{" "}
              {precedingPrd
                .map((row) => `${LORDS[row.lord].label}(${LORDS[row.lord].years})`)
                .join(" + ")}
              {" "}= {precedingSum}. Offset ={" "}
              {formatHours(selectedSd.duration, unitMode)} × ({precedingSum} ÷ 120) ={" "}
              {formatHours(directJumpOffset, unitMode)}.
            </p>
          ) : (
            <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.9rem" }}>
              This is the first prāṇa-daśā; no preceding sum is needed.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function ChainSvg({
  levels,
}: {
  levels: Array<{
    key: string;
    label: string;
    lord: LordKey;
    start: number;
    end: number;
    span: string;
    color: string;
  }>;
}) {
  return (
    <svg
      viewBox="0 0 900 160"
      role="img"
      aria-label="Five-level cascade chain from MD to PrD"
      style={{
        width: "100%",
        maxHeight: 240,
        margin: "0.4rem auto 0.85rem",
        display: "block",
      }}
    >
      {levels.map((level, index) => {
        const x = 30 + index * 168;
        const y = 50;
        const nextX = x + 148;
        return (
          <g key={level.key}>
            <rect
              x={x}
              y={y}
              width={138}
              height={80}
              rx={8}
              fill={`${level.color}12`}
              stroke={level.color}
              strokeWidth={2}
            />
            <text
              x={x + 69}
              y={y + 26}
              textAnchor="middle"
              fill={level.color}
              fontSize="12"
              fontWeight={700}
            >
              {level.label}
            </text>
            <text
              x={x + 69}
              y={y + 48}
              textAnchor="middle"
              fill={INK_PRIMARY}
              fontSize="14"
              fontWeight={700}
            >
              {LORDS[level.lord].label}
            </text>
            <text
              x={x + 69}
              y={y + 66}
              textAnchor="middle"
              fill={INK_MUTED}
              fontSize="11"
              fontWeight={600}
            >
              {level.span}
            </text>
            {index < levels.length - 1 ? (
              <>
                <line
                  x1={nextX}
                  y1={y + 40}
                  x2={nextX + 20}
                  y2={y + 40}
                  stroke={HAIRLINE}
                  strokeWidth={2}
                />
                <polygon
                  points={`${nextX + 20},${y + 36} ${nextX + 20},${y + 44} ${nextX + 28},${y + 40}`}
                  fill={HAIRLINE}
                />
              </>
            ) : null}
          </g>
        );
      })}
      <text
        x="450"
        y="140"
        textAnchor="middle"
        fill={INK_MUTED}
        fontSize="12"
        fontWeight={700}
      >
        Moon/Mars/Saturn/Saturn/Saturn branch: 10 years → ~20 hours
      </text>
    </svg>
  );
}

function LevelTable({
  title,
  parentLabel,
  parentDuration,
  rows,
  unitMode,
  sum,
  expectedSum,
}: {
  title: string;
  parentLabel: string;
  parentDuration: number;
  rows: Array<{ lord: LordKey; duration: number; start: number; end: number }>;
  unitMode: UnitMode;
  sum: number;
  expectedSum: number;
}) {
  const closes = Math.abs(sum - expectedSum) < 0.01;

  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8 }}>
      <div
        style={{
          padding: "0.75rem",
          borderBottom: `1px solid ${HAIRLINE}`,
          background: `${GOLD}0A`,
        }}
      >
        <p style={{ margin: 0, color: GOLD, fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {title}
        </p>
        <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
          Parent: {parentLabel} = {formatHours(parentDuration, unitMode)}
        </p>
      </div>
      <div style={{ maxHeight: 280, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: `${GOLD}08` }}>
              <th style={thStyle}>Lord</th>
              <th style={thStyle}>Start</th>
              <th style={thStyle}>Length</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.lord}
                style={{
                  background:
                    index === 0 ? `${LORDS[row.lord].color}0F` : "transparent",
                }}
              >
                <td style={tdStyle}>
                  <span style={{ color: LORDS[row.lord].color, fontWeight: 700 }}>
                    {LORDS[row.lord].label}
                  </span>
                  {index === 0 ? (
                    <span
                      style={{
                        marginLeft: "0.35rem",
                        fontSize: "0.72rem",
                        color: INK_MUTED,
                      }}
                    >
                      parent&apos;s share
                    </span>
                  ) : null}
                </td>
                <td style={tdStyle}>{formatHours(row.start, unitMode)}</td>
                <td style={tdStyle}>{formatHours(row.duration, unitMode)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          padding: "0.55rem 0.75rem",
          borderTop: `1px solid ${HAIRLINE}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
          background: closes ? `${GREEN}08` : `${VERMILION}08`,
        }}
      >
        <span style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>
          Sum-check: {formatHours(sum, unitMode)}
        </span>
        <span
          style={{
            color: closes ? GREEN : VERMILION,
            fontWeight: 700,
            fontSize: "0.85rem",
          }}
        >
          {closes ? "Closes correctly" : "Does not close"}
        </span>
      </div>
    </div>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.85rem",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const thStyle: CSSProperties = {
  padding: "0.5rem 0.65rem",
  textAlign: "left",
  color: INK_MUTED,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle: CSSProperties = {
  padding: "0.45rem 0.65rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_PRIMARY,
};
