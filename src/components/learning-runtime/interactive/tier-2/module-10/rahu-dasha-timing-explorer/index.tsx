"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const CURRENT_AGE = 27.5;

type Period = {
  id: string;
  md: string;
  bhukti: string;
  startAge: number;
  endAge: number;
  era: string;
  color: string;
  note: string;
  indicators: string[];
};

const PERIODS: Period[] = [
  {
    id: "venus-rahu",
    md: "Venus",
    bhukti: "Rāhu",
    startAge: 20.54,
    endAge: 23.54,
    era: "past",
    color: GREEN,
    note: "Past Rahu-connected window",
    indicators: ["Rāhu bhukti-lord occupies the 12th house", "Rāhu is the foreign-experience kāraka"],
  },
  {
    id: "venus-saturn",
    md: "Venus",
    bhukti: "Saturn",
    startAge: 26.21,
    endAge: 29.38,
    era: "present",
    color: GOLD,
    note: "Currently-running period — no domain-specific indicators",
    indicators: [],
  },
  {
    id: "sun-rahu",
    md: "Sun",
    bhukti: "Rāhu",
    startAge: 34.53,
    endAge: 35.43,
    era: "future",
    color: BLUE,
    note: "Nearest future Rahu-connected window",
    indicators: ["Rāhu bhukti-lord occupies the 12th house", "Rāhu is the foreign-experience kāraka"],
  },
  {
    id: "moon-rahu",
    md: "Moon",
    bhukti: "Rāhu",
    startAge: 40.79,
    endAge: 42.29,
    era: "future",
    color: BLUE,
    note: "Further future Rahu-connected window",
    indicators: ["Rāhu bhukti-lord occupies the 12th house", "Rāhu is the foreign-experience kāraka"],
  },
  {
    id: "rahu-md",
    md: "Rāhu",
    bhukti: "any",
    startAge: 56.375,
    endAge: 74.375,
    era: "far-future",
    color: PURPLE,
    note: "Rāhu's own Mahādaśā — strongest structural alignment",
    indicators: ["Rāhu MD-lord occupies the 12th house", "Rāhu is the foreign-experience kāraka"],
  },
];

const ALL_CANDIDATES = [
  "MD lord occupies 12th, 9th, or 3rd",
  "Bhukti lord occupies 12th, 9th, or 3rd",
  "MD or bhukti lord is Rāhu",
  "MD or bhukti lord aspects the 12-9-3 arc",
  "MD or bhukti lord rules an arc house",
  "General dignity of MD/bhukti lord",
];

const DISCIPLINE_STATEMENTS = [
  {
    key: "dignity",
    label: "Venus and Saturn's own-sign dignity count as two yeses for foreign settlement.",
    correction:
      "Dignity is a general indicator. For this domain question, indicators must connect to the 12-9-3 arc or Rāhu.",
  },
  {
    key: "denial",
    label: "A 'no daśā signal' finding means the event cannot occur in this period.",
    correction:
      "No signal is an honest absence for this technique, not a denial of possibility. Other techniques and real-world agency still apply.",
  },
  {
    key: "manufacture",
    label: "If a period has no domain-specific indicators, we should stretch one to make the answer useful.",
    correction:
      "Report the honest absence rather than manufacture a connection. Confidence-tier discipline requires it.",
  },
] as const;

const MIN_YES = 2;

export function RahuDashaTimingExplorer() {
  const [selectedId, setSelectedId] = useState<string>("venus-saturn");
  const [manualChecks, setManualChecks] = useState<Record<string, boolean>>({});
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    dignity: false,
    denial: false,
    manufacture: false,
  });

  const selected = PERIODS.find((p) => p.id === selectedId)!;

  const activeIndicators = useMemo(() => {
    const base = new Set(selected.indicators);
    // manual toggles for candidate list; only domain-specific ones count
    return ALL_CANDIDATES.filter((c) => {
      if (base.has(c)) return true;
      if (manualChecks[c]) {
        return c !== "General dignity of MD/bhukti lord";
      }
      return false;
    });
  }, [selected, manualChecks]);

  const validYesCount = activeIndicators.length;
  const twoYesMet = validYesCount >= MIN_YES;

  const synthesis = useMemo(() => {
    const periodText = `${selected.md} MD / ${selected.bhukti} bhukti, ages ${selected.startAge}-${selected.endAge}.`;
    const indicatorText =
      validYesCount === 0
        ? "Zero valid domain-specific indicators are present."
        : `${validYesCount} valid domain-specific indicator${validYesCount > 1 ? "s" : ""}: ${activeIndicators.join("; ")}.`;
    const verdict = twoYesMet
      ? "This period satisfies the two-yes principle for foreign-settlement timing."
      : "This period does not satisfy the two-yes principle for foreign-settlement timing.";
    return `${periodText} ${indicatorText} ${verdict}`;
  }, [activeIndicators, selected, twoYesMet, validYesCount]);

  function toggleCandidate(candidate: string) {
    setManualChecks((prev) => ({ ...prev, [candidate]: !prev[candidate] }));
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setSelectedId("venus-saturn");
    setManualChecks({});
    setMistakes({ dignity: false, denial: false, manufacture: false });
  }

  return (
    <div
      data-interactive="rahu-dasha-timing-explorer"
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
            <p style={eyebrowStyle}>Chart T1 — Rāhu daśā timing explorer</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: GOLD,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Two-yes principle applied to foreign-settlement windows
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Scrub through Chart T1&apos;s Rāhu-linked daśā windows. Click a period to inspect its domain-specific indicators and see whether the two-yes bar is met — including the honest currently-dormant finding.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Timeline</p>
        <TimelineSvg
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </section>

      <div style={responsiveTwoColumnStyle}>
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
              <p style={eyebrowStyle}>Selected period</p>
              <h3
                style={{
                  margin: "0.15rem 0 0",
                  color: selected.color,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                {selected.md} MD · {selected.bhukti} bhukti
              </h3>
            </div>
            <span
              style={{
                padding: "0.35rem 0.65rem",
                borderRadius: 8,
                background: `${selected.color}${"18"}`,
                color: selected.color,
                fontSize: "0.82rem",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {selected.era}
            </span>
          </div>
          <p
            style={{
              margin: "0.55rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.9rem",
            }}
          >
            Ages {selected.startAge}–{selected.endAge}
          </p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.5,
            }}
          >
            {selected.note}
          </p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Domain-specific indicator checklist</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.86rem",
              lineHeight: 1.5,
            }}
          >
            Valid indicators must connect to the 12-9-3 arc or to Rāhu. General dignity alone does not count.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
              marginTop: "0.55rem",
            }}
          >
            {ALL_CANDIDATES.map((c) => {
              const inherent = selected.indicators.includes(c);
              const checked = inherent || !!manualChecks[c];
              const isDignity = c === "General dignity of MD/bhukti lord";
              const counts = checked && !isDignity;
              return (
                <label
                  key={c}
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    color: isDignity ? INK_MUTED : INK_SECONDARY,
                    cursor: inherent ? "default" : "pointer",
                    fontSize: "0.88rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={inherent}
                    onChange={() => toggleCandidate(c)}
                  />
                  <span>
                    {c}
                    {inherent ? (
                      <span style={{ color: GREEN, fontWeight: 600 }}> — present</span>
                    ) : counts ? (
                      <span style={{ color: GREEN, fontWeight: 600 }}> — counts</span>
                    ) : checked && isDignity ? (
                      <span style={{ color: VERMILION, fontWeight: 600 }}> — not domain-specific</span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.65rem",
              borderRadius: 8,
              border: `1px solid ${
                twoYesMet ? GREEN : VERMILION
              }${"44"}`,
              background: `${
                twoYesMet ? GREEN : VERMILION
              }${"0A"}`,
            }}
          >
            <p
              style={{
                margin: 0,
                color: twoYesMet ? GREEN : VERMILION,
                fontWeight: 600,
              }}
            >
              {twoYesMet
                ? `Two-yes principle satisfied (${validYesCount}/${MIN_YES})`
                : `Two-yes principle not satisfied (${validYesCount}/${MIN_YES})`}
            </p>
            <p
              style={{
                margin: "0.3rem 0 0",
                color: INK_SECONDARY,
                fontSize: "0.86rem",
              }}
            >
              {twoYesMet
                ? "At least two independent domain-specific indicators converge."
                : selected.era === "present"
                  ? "The currently-running period has no domain-specific activation. This is an honest absence, not a denial."
                  : "Toggle valid indicators above to see what would be needed."}
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline checks</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            fontSize: "0.88rem",
            lineHeight: 1.5,
          }}
        >
          Mark each false statement to reveal the correction.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          {DISCIPLINE_STATEMENTS.map((s) => {
            const active = mistakes[s.key];
            return (
              <div
                key={s.key}
                style={{
                  border: `1px solid ${active ? VERMILION : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${VERMILION}${"0A"}` : "transparent",
                  padding: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    color: INK_SECONDARY,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleMistake(s.key)}
                  />
                  <span>{s.label}</span>
                </label>
                {active ? (
                  <p
                    style={{
                      margin: "0.55rem 0 0",
                      color: VERMILION,
                      fontSize: "0.86rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <AlertTriangle size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                    {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Integrated reading</p>
        <p
          style={{
            margin: "0.45rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.6,
          }}
        >
          {synthesis}
        </p>
      </section>
    </div>
  );
}

function TimelineSvg({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const totalWidth = 860;
  const totalHeight = 340;
  const margin = { top: 62, right: 54, bottom: 58, left: 48 };
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;
  const maxAge = 100;
  const axisY = margin.top + height;

  function x(age: number) {
    return margin.left + (age / maxAge) * width;
  }

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      role="img"
      aria-label="Chart T1 Rahu-linked dasha timeline"
      style={{
        width: "100%",
        minHeight: 320,
        margin: "0.55rem auto 0",
        display: "block",
      }}
    >
      <rect x="10" y="10" width={totalWidth - 20} height={totalHeight - 20} rx="10" fill={`${GOLD}${"06"}`} stroke={HAIRLINE} />

      {/* Axis */}
      <line
        x1={margin.left}
        y1={axisY}
        x2={margin.left + width}
        y2={axisY}
        stroke={INK_MUTED}
        strokeWidth={2}
      />
      {Array.from({ length: 11 }, (_, i) => i * 10).map((age) => (
        <g key={age}>
          <line
            x1={x(age)}
            y1={axisY}
            x2={x(age)}
            y2={axisY + 8}
            stroke={INK_MUTED}
          />
          <text
            x={x(age)}
            y={axisY + 30}
            textAnchor="middle"
            fill={INK_MUTED}
            fontSize="16"
            fontWeight={600}
          >
            {age}
          </text>
        </g>
      ))}
      <text
        x={margin.left + width / 2}
        y={totalHeight - 6}
        textAnchor="middle"
        fill={INK_MUTED}
        fontSize="17"
        fontWeight={600}
      >
        Age
      </text>

      {/* Current age marker */}
      <line
        x1={x(CURRENT_AGE)}
        y1={margin.top - 8}
        x2={x(CURRENT_AGE)}
        y2={axisY + 10}
        stroke={VERMILION}
        strokeWidth={2}
        strokeDasharray="4 2"
      />
      <text
        x={x(CURRENT_AGE)}
        y={margin.top - 14}
        textAnchor="middle"
        fill={VERMILION}
        fontSize="16"
        fontWeight={600}
      >
        present (~{CURRENT_AGE})
      </text>

      {/* Period bars */}
      {PERIODS.map((p, index) => {
        const selected = selectedId === p.id;
        const y = margin.top + index * 33 + 8;
        const isRahuMd = p.id === "rahu-md";
        return (
          <g key={p.id} style={{ cursor: "pointer" }} onClick={() => onSelect(p.id)}>
            <rect
              x={x(p.startAge)}
              y={y}
              width={x(p.endAge) - x(p.startAge)}
              height={24}
              rx={7}
              fill={p.color}
              opacity={selected ? 1 : 0.65}
              stroke={selected ? "#fff" : "none"}
              strokeWidth={selected ? 3 : 0}
            />
            <text
              x={x((p.startAge + p.endAge) / 2)}
              y={y + 14}
              textAnchor="middle"
              fill="#fff"
              fontSize="14"
              fontWeight={600}
            >
              {p.md}–{p.bhukti}
            </text>
            {isRahuMd ? (
              <text
                x={x((p.startAge + p.endAge) / 2)}
                y={y + 46}
                textAnchor="middle"
                fill={selected ? p.color : INK_SECONDARY}
                fontSize="14"
                fontWeight={600}
              >
                <tspan x={x((p.startAge + p.endAge) / 2)} dy="0">
                  RÄhu&apos;s own MahÄdaÅ›Ä
                </tspan>
                <tspan x={x((p.startAge + p.endAge) / 2)} dy="18">
                  strongest structural alignment
                </tspan>
              </text>
            ) : (
              <text
                x={x(p.endAge) + 10}
                y={y + 17}
                textAnchor="start"
                fill={selected ? p.color : INK_SECONDARY}
                fontSize="14"
                fontWeight={600}
              >
                {p.note}
              </text>
            )}
          </g>
        );
      })}
    </svg>
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
