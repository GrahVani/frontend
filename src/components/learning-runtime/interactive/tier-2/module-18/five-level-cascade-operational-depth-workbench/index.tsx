"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Scale,
  Timer,
} from "lucide-react";
import {
  workbenchDiagramLayoutStyle,
  workbenchTwoColumnStyle,
} from "@/components/learning-runtime/interactive/lib/layouts";

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
type LevelKey = "md" | "ad" | "pd" | "sd" | "prd";
type DisclosureMode = "assumed" | "direct";
type DepthKey = LevelKey;
type QuestionKey =
  | "career-theme"
  | "job-offer"
  | "medical-week"
  | "travel-day"
  | "surgery-hour";

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

const LEVELS: Record<
  LevelKey,
  {
    label: string;
    sanskrit: string;
    abbreviation: string;
    span: string;
    desc: string;
    color: string;
  }
> = {
  md: {
    label: "Mahādaśā",
    sanskrit: "महादशा",
    abbreviation: "MD",
    span: "Years",
    desc: "The 120-year natal cycle, anchored to birth nakṣatra.",
    color: BLUE,
  },
  ad: {
    label: "Antardaśā",
    sanskrit: "अन्तर्दशा",
    abbreviation: "AD",
    span: "Months to ~2 years",
    desc: "Subdivides the mahādaśā; also called bhukti.",
    color: GREEN,
  },
  pd: {
    label: "Pratyantardaśā",
    sanskrit: "प्रत्यन्तर्दशा",
    abbreviation: "PD",
    span: "Weeks to months",
    desc: "Subdivides the antardaśā.",
    color: GOLD,
  },
  sd: {
    label: "Sūkṣma-daśā",
    sanskrit: "सूक्ष्मदशा",
    abbreviation: "SD",
    span: "Days to weeks",
    desc: "Subdivides the pratyantardaśā.",
    color: PURPLE,
  },
  prd: {
    label: "Prāṇa-daśā",
    sanskrit: "प्राणदशा",
    abbreviation: "PrD",
    span: "Hours to days",
    desc: "Subdivides the sūkṣma-daśā.",
    color: VERMILION,
  },
};

const LEVEL_ORDER: LevelKey[] = ["md", "ad", "pd", "sd", "prd"];

const QUESTIONS: Record<
  QuestionKey,
  { text: string; correct: DepthKey; explanation: string }
> = {
  "career-theme": {
    text: "Year-wide career theme",
    correct: "md",
    explanation: "Mahādaśā gives the long arc — years, not months or days.",
  },
  "job-offer": {
    text: "Month a job offer is likely",
    correct: "ad",
    explanation: "Antardaśā narrows the window to months inside the MD.",
  },
  "medical-week": {
    text: "Week of a planned procedure",
    correct: "pd",
    explanation: "Pratyantardaśā reaches week-scale precision when birth time is sound.",
  },
  "travel-day": {
    text: "Day of travel departure",
    correct: "sd",
    explanation: "Sūkṣma-daśā reaches days, but only with a well-timed birth chart.",
  },
  "surgery-hour": {
    text: "Hour of a surgery",
    correct: "prd",
    explanation: "Prāṇa-daśā is hour-level; use it rarely and only when precision is justified.",
  },
};

function computeChildren(parentLord: LordKey, parentDuration: number) {
  const parentIndex = LORD_ORDER.indexOf(parentLord);
  let running = 0;
  return LORD_ORDER.map((_, offset) => {
    const childLord = LORD_ORDER[(parentIndex + offset) % 9];
    const duration = (parentDuration * LORDS[childLord].years) / 120;
    const start = running;
    running += duration;
    return { lord: childLord, duration, start, end: running };
  });
}

function formatDuration(years: number): string {
  if (years >= 1) return `${years.toFixed(4)} yr`;
  const days = years * 365.25;
  if (days >= 1) return `${days.toFixed(1)} d`;
  const hours = days * 24;
  return `${hours.toFixed(1)} hr`;
}

export function FiveLevelCascadeOperationalDepthWorkbench() {
  const [activeLevel, setActiveLevel] = useState<LevelKey>("md");
  const [mdLord, setMdLord] = useState<LordKey>("moon");
  const [adLord, setAdLord] = useState<LordKey>("mars");
  const [pdLord, setPdLord] = useState<LordKey>("sun");
  const [disclosureMode, setDisclosureMode] = useState<DisclosureMode>("direct");
  const [depthMatches, setDepthMatches] = useState<
    Partial<Record<QuestionKey, DepthKey>>
  >({});

  const mdChildren = useMemo(
    () => computeChildren(mdLord, LORDS[mdLord].years),
    [mdLord]
  );
  const selectedAd = mdChildren.find((c) => c.lord === adLord) ?? mdChildren[0];
  const adChildren = useMemo(
    () => computeChildren(adLord, selectedAd.duration),
    [adLord, selectedAd.duration]
  );
  const selectedPd = adChildren.find((c) => c.lord === pdLord) ?? adChildren[0];
  const pdChildren = useMemo(
    () => computeChildren(pdLord, selectedPd.duration),
    [pdLord, selectedPd.duration]
  );

  const mdSum = mdChildren.reduce((s, c) => s + c.duration, 0);
  const adSum = adChildren.reduce((s, c) => s + c.duration, 0);
  const pdSum = pdChildren.reduce((s, c) => s + c.duration, 0);

  const activeLevelData = LEVELS[activeLevel];

  return (
    <div
      data-interactive="five-level-cascade-operational-depth-workbench"
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
            <p style={eyebrowStyle}>Five-level cascade at operational depth</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: GOLD,
                fontSize: "1.35rem",
                fontWeight: 600,
              }}
            >
              One recursive rule, five nested time-scales
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              The Vimśottarī cascade is self-similar: every level divides the
              parent among the nine lords in the same 7-20-6-10-7-18-16-19-17
              proportion, restarting from the parent&apos;s own lord.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveLevel("md");
              setMdLord("moon");
              setAdLord("mars");
              setPdLord("sun");
              setDisclosureMode("direct");
              setDepthMatches({});
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={eyebrowStyle}>Nested cascade</p>
              <h3
                style={{
                  margin: "0.15rem 0 0",
                  color: activeLevelData.color,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                {activeLevelData.label} ({activeLevelData.abbreviation})
              </h3>
            </div>
            <strong
              style={{
                color: activeLevelData.color,
                fontWeight: 700,
              }}
            >
              {activeLevelData.span}
            </strong>
          </div>
          <CascadeSvg activeLevel={activeLevel} onSelect={setActiveLevel} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
              gap: "0.65rem",
            }}
          >
            {LEVEL_ORDER.map((key) => {
              const level = LEVELS[key];
              const isActive = key === activeLevel;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveLevel(key)}
                  style={{
                    border: `1px solid ${isActive ? level.color : HAIRLINE}`,
                    borderRadius: 8,
                    background: isActive ? `${level.color}14` : "transparent",
                    color: isActive ? level.color : INK_SECONDARY,
                    padding: "0.65rem",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{level.abbreviation}</span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.82rem",
                      marginTop: "0.2rem",
                    }}
                  >
                    {level.label}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: INK_MUTED,
                      marginTop: "0.15rem",
                    }}
                  >
                    {level.span}
                  </span>
                </button>
              );
            })}
          </div>
          <p
            style={{
              margin: "0.75rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.5,
            }}
          >
            {activeLevelData.desc}
          </p>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Select mahādaśā lord" icon={<Timer size={18} />} color={BLUE}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.45rem",
              }}
            >
              {LORD_ORDER.map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={mdLord === key}
                  onClick={() => {
                    setMdLord(key);
                    setAdLord(key);
                    setPdLord(key);
                  }}
                  style={smallChipStyle(mdLord === key, LORDS[key].color)}
                >
                  {LORDS[key].short}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>
              {LORDS[mdLord].label} MD runs {LORDS[mdLord].years} years. All
              nine antardaśās start from {LORDS[mdLord].label}.
            </p>
          </Panel>

          <Panel title="The single rule" icon={<Scale size={18} />} color={GREEN}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              At every level:
            </p>
            <code
              style={{
                display: "block",
                margin: "0.55rem 0 0",
                padding: "0.55rem",
                borderRadius: 8,
                background: `${GOLD}0F`,
                color: INK_PRIMARY,
                fontSize: "0.9rem",
              }}
            >
              child = parent × child-lord-years ÷ 120
            </code>
            <p style={bodyTextStyle}>
              The child sequence restarts from the parent lord, not from Ketu.
            </p>
          </Panel>
        </section>
      </div>

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
          <div>
            <p style={eyebrowStyle}>Proportional rule drill</p>
            <h3
              style={{
                margin: "0.15rem 0 0",
                color: GREEN,
                fontSize: "1.2rem",
                fontWeight: 600,
              }}
            >
              Drill down three levels and verify each sum-check
            </h3>
          </div>
          <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>
            Click a row in MD→AD to choose the AD lord; click a row in AD→PD to
            choose the PD lord.
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "1rem",
            marginTop: "0.85rem",
          }}
        >
          <LevelTable
            title={`${LORDS[mdLord].label} MD → Antardaśā`}
            parentLabel={`${LORDS[mdLord].label} MD`}
            parentDuration={LORDS[mdLord].years}
            parentUnit="yr"
            rows={mdChildren}
            selectedLord={adLord}
            onSelect={setAdLord}
            sum={mdSum}
            expectedSum={LORDS[mdLord].years}
          />
          <LevelTable
            title={`${LORDS[mdLord].label}/${LORDS[adLord].label} AD → Pratyantardaśā`}
            parentLabel={`${LORDS[mdLord].label}/${LORDS[adLord].label} AD`}
            parentDuration={selectedAd.duration}
            parentUnit="yr"
            rows={adChildren}
            selectedLord={pdLord}
            onSelect={setPdLord}
            sum={adSum}
            expectedSum={selectedAd.duration}
          />
          <LevelTable
            title={`${LORDS[mdLord].label}/${LORDS[adLord].label}/${LORDS[pdLord].label} PD → Sūkṣma-daśā`}
            parentLabel={`${LORDS[pdLord].label} PD`}
            parentDuration={selectedPd.duration}
            parentUnit="yr"
            rows={pdChildren}
            selectedLord={null}
            onSelect={() => {}}
            sum={pdSum}
            expectedSum={selectedPd.duration}
          />
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Source disclosure</p>
          <h3
            style={{
              margin: "0.15rem 0 0.75rem",
              color: disclosureMode === "direct" ? GREEN : VERMILION,
              fontSize: "1.18rem",
              fontWeight: 600,
            }}
          >
            {disclosureMode === "direct"
              ? "Cite BPHS directly"
              : "Assume T1-10 exists"}
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "0.85rem",
            }}
          >
            <button
              type="button"
              aria-pressed={disclosureMode === "assumed"}
              onClick={() => setDisclosureMode("assumed")}
              style={smallChipStyle(disclosureMode === "assumed", VERMILION)}
            >
              Assume T1-10
            </button>
            <button
              type="button"
              aria-pressed={disclosureMode === "direct"}
              onClick={() => setDisclosureMode("direct")}
              style={smallChipStyle(disclosureMode === "direct", GREEN)}
            >
              Cite BPHS directly
            </button>
          </div>
          {disclosureMode === "assumed" ? (
            <div
              style={{
                border: `1px solid ${VERMILION}44`,
                borderRadius: 8,
                background: `${VERMILION}0F`,
                padding: "0.75rem",
                color: INK_SECONDARY,
                lineHeight: 1.55,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  color: VERMILION,
                  fontWeight: 700,
                  marginBottom: "0.35rem",
                }}
              >
                <AlertTriangle size={16} aria-hidden="true" />
                Problem
              </div>
              Tier 1 Module 10 was found almost entirely unauthored. Referencing
              its lesson numbers as if they exist would send learners to missing
              content.
            </div>
          ) : (
            <div
              style={{
                border: `1px solid ${GREEN}44`,
                borderRadius: 8,
                background: `${GREEN}0F`,
                padding: "0.75rem",
                color: INK_SECONDARY,
                lineHeight: 1.55,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  color: GREEN,
                  fontWeight: 700,
                  marginBottom: "0.35rem",
                }}
              >
                <BookOpen size={16} aria-hidden="true" />
                Correct practice
              </div>
              This module cites BPHS, Dasākramaprakaraṇa (chs. 46–58), directly
              wherever T1-10 content would normally be assumed, and states the
              gap plainly.
            </div>
          )}
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Depth matcher</p>
          <h3
            style={{
              margin: "0.15rem 0 0.75rem",
              color: GOLD,
              fontSize: "1.18rem",
              fontWeight: 600,
            }}
          >
            Match each question to the right cascade depth
          </h3>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            {(Object.keys(QUESTIONS) as QuestionKey[]).map((qKey) => {
              const q = QUESTIONS[qKey];
              const selected = depthMatches[qKey];
              const isCorrect = selected === q.correct;
              return (
                <div
                  key={qKey}
                  style={{
                    border: `1px solid ${
                      selected ? (isCorrect ? GREEN : VERMILION) : HAIRLINE
                    }44`,
                    borderRadius: 8,
                    background: selected
                      ? isCorrect
                        ? `${GREEN}0F`
                        : `${VERMILION}0F`
                      : "transparent",
                    padding: "0.75rem",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 0.5rem",
                      color: INK_PRIMARY,
                      fontWeight: 600,
                    }}
                  >
                    {q.text}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.4rem",
                    }}
                  >
                    {LEVEL_ORDER.map((depth) => (
                      <button
                        key={depth}
                        type="button"
                        aria-pressed={selected === depth}
                        onClick={() =>
                          setDepthMatches((prev) => ({
                            ...prev,
                            [qKey]: depth,
                          }))
                        }
                        style={smallChipStyle(
                          selected === depth,
                          LEVELS[depth].color
                        )}
                      >
                        {LEVELS[depth].abbreviation}
                      </button>
                    ))}
                  </div>
                  {selected ? (
                    <p
                      style={{
                        margin: "0.5rem 0 0",
                        color: isCorrect ? GREEN : VERMILION,
                        fontSize: "0.85rem",
                        lineHeight: 1.45,
                      }}
                    >
                      {isCorrect ? (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                          }}
                        >
                          <CheckCircle2 size={14} aria-hidden="true" />
                          {q.explanation}
                        </span>
                      ) : (
                        `Not quite — ${q.explanation.toLowerCase()}`
                      )}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function CascadeSvg({
  activeLevel,
  onSelect,
}: {
  activeLevel: LevelKey;
  onSelect: (level: LevelKey) => void;
}) {
  const sizes = [
    { level: "md", x: 30, y: 20, w: 500, h: 220, r: 48 },
    { level: "ad", x: 70, y: 50, w: 420, h: 180, r: 40 },
    { level: "pd", x: 110, y: 80, w: 340, h: 140, r: 32 },
    { level: "sd", x: 150, y: 110, w: 260, h: 100, r: 24 },
    { level: "prd", x: 190, y: 140, w: 180, h: 60, r: 16 },
  ];

  return (
    <svg
      viewBox="0 0 560 280"
      role="img"
      aria-label="Five nested Vimśottarī cascade levels"
      style={{
        width: "100%",
        maxHeight: 360,
        margin: "0.4rem auto 0.85rem",
        display: "block",
      }}
    >
      {sizes.map(({ level, x, y, w, h, r }, index) => {
        const isActive = level === activeLevel;
        const color = LEVELS[level].color;
        return (
          <g
            key={level}
            onClick={() => onSelect(level)}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={r}
              fill={isActive ? `${color}18` : `${color}0A`}
              stroke={isActive ? color : HAIRLINE}
              strokeWidth={isActive ? 3 : 1.5}
            />
            <text
              x={x + w / 2}
              y={y + h / 2 - 6}
              textAnchor="middle"
              fill={isActive ? color : INK_PRIMARY}
              fontSize={15 + index * 1.5}
              fontWeight={700}
            >
              {LEVELS[level].abbreviation}
            </text>
            <text
              x={x + w / 2}
              y={y + h / 2 + 14}
              textAnchor="middle"
              fill={INK_MUTED}
              fontSize={11}
              fontWeight={600}
            >
              {LEVELS[level].span}
            </text>
          </g>
        );
      })}
      <text
        x="280"
        y="265"
        textAnchor="middle"
        fill={INK_MUTED}
        fontSize="12"
        fontWeight={700}
      >
        Click a level to focus it
      </text>
    </svg>
  );
}

function LevelTable({
  title,
  parentLabel,
  parentDuration,
  parentUnit,
  rows,
  selectedLord,
  onSelect,
  sum,
  expectedSum,
}: {
  title: string;
  parentLabel: string;
  parentDuration: number;
  parentUnit: string;
  rows: Array<{
    lord: LordKey;
    duration: number;
    start: number;
    end: number;
  }>;
  selectedLord: LordKey | null;
  onSelect: (lord: LordKey) => void;
  sum: number;
  expectedSum: number;
}) {
  const closes = Math.abs(sum - expectedSum) < 0.0001;

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
          Parent: {parentLabel} = {parentDuration.toFixed(4)} {parentUnit}
        </p>
      </div>
      <div style={{ maxHeight: 260, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: `${GOLD}08` }}>
              <th style={thStyle}>Lord</th>
              <th style={thStyle}>Years</th>
              <th style={thStyle}>Length</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSelected = selectedLord === row.lord;
              return (
                <tr
                  key={row.lord}
                  onClick={() => onSelect(row.lord)}
                  style={{
                    background: isSelected ? `${LORDS[row.lord].color}12` : "transparent",
                    cursor: onSelect ? "pointer" : "default",
                  }}
                >
                  <td style={tdStyle}>
                    <span
                      style={{
                        color: LORDS[row.lord].color,
                        fontWeight: 700,
                      }}
                    >
                      {LORDS[row.lord].label}
                    </span>
                    {isSelected ? (
                      <span
                        style={{
                          marginLeft: "0.35rem",
                          fontSize: "0.72rem",
                          color: INK_MUTED,
                        }}
                      >
                        selected
                      </span>
                    ) : null}
                  </td>
                  <td style={tdStyle}>{LORDS[row.lord].years}</td>
                  <td style={tdStyle}>{formatDuration(row.duration)}</td>
                </tr>
              );
            })}
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
          Sum-check: {sum.toFixed(4)} {parentUnit}
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

function Panel({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: ReactNode;
  color: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        border: `1px solid ${color}44`,
        borderRadius: 8,
        background: SURFACE,
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color,
          fontWeight: 700,
        }}
      >
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
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
