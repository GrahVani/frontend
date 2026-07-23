"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  RefreshCcw,
  ShieldAlert,
  Target,
  XCircle,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const NEUTRAL = "#6B5330";
const NEUTRAL_SOFT = "#FFF7E8";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

type Tier = "multi" | "two" | "single" | "none";

interface Segment {
  id: string;
  md: string;
  bhukti: string;
  startAge: number;
  endAge: number;
  tier: Tier;
  reasons: string[];
  note?: string;
}

const TIER_META: Record<
  Tier,
  { label: string; color: string; short: string }
> = {
  multi: { label: "Multi-yes — strongest", color: GREEN, short: "multi-yes" },
  two: { label: "Two-yes", color: BLUE, short: "two-yes" },
  single: { label: "Single-indicator", color: GOLD, short: "single" },
  none: { label: "No connection", color: NEUTRAL, short: "none" },
};

function tierFill(tier: Tier) {
  return tier === "none" ? NEUTRAL_SOFT : `${TIER_META[tier].color}${"20"}`;
}

const MIN_AGE = 22;
const MAX_AGE = 42;
const PRESENT_AGE = 27.5;

const TIMELINE_ROWS: { md: string; y: number; segments: Segment[] }[] = [
  {
    md: "Venus Mahādaśā",
    y: 40,
    segments: [
      {
        id: "venus-rahu",
        md: "Venus MD",
        bhukti: "Rāhu",
        startAge: 20.54,
        endAge: 23.54,
        tier: "two",
        reasons: [
          "Rāhu (bhukti-lord) occupies the 12th house — positional indicator.",
          "Rāhu is the chapter’s independent foreign-settlement kāraka — significator indicator.",
        ],
      },
      {
        id: "venus-jupiter",
        md: "Venus MD",
        bhukti: "Jupiter",
        startAge: 23.54,
        endAge: 26.21,
        tier: "two",
        reasons: [
          "Jupiter rules the 9th house — ownership indicator.",
          "Jupiter occupies the 9th house — occupancy indicator.",
        ],
      },
      {
        id: "venus-saturn",
        md: "Venus MD",
        bhukti: "Saturn",
        startAge: 26.21,
        endAge: 29.38,
        tier: "none",
        reasons: [
          "Saturn does not occupy, rule, or aspect the 12th, 9th, or 3rd houses.",
          "General dignity (own-sign in the 8th) is not a domain-specific indicator for this question.",
        ],
        note: "Currently-running period at the native's present age (~27-28).",
      },
      {
        id: "venus-mercury",
        md: "Venus MD",
        bhukti: "Mercury",
        startAge: 29.38,
        endAge: 32.21,
        tier: "multi",
        reasons: [
          "Mercury rules the 12th house — ownership indicator.",
          "Mercury rules the 3rd house — second ownership indicator.",
          "Mercury occupies the 9th house — occupancy indicator.",
          "Mercury outranks Jupiter in Chart T1's KP 9th-house significator hierarchy.",
        ],
        note: "Standout near-future window: the richest significator convergence in the whole sweep.",
      },
      {
        id: "venus-ketu",
        md: "Venus MD",
        bhukti: "Ketu",
        startAge: 32.21,
        endAge: 33.38,
        tier: "two",
        reasons: [
          "Ketu aspects the 12th house under both 7th-only and extended nodal-aspect doctrines — aspect indicator.",
          "Ketu is one of the 12th house's own classical kārakas — signification indicator.",
        ],
      },
    ],
  },
  {
    md: "Sun Mahādaśā",
    y: 90,
    segments: [
      {
        id: "sun-sun",
        md: "Sun MD",
        bhukti: "Sun",
        startAge: 33.38,
        endAge: 33.68,
        tier: "none",
        reasons: ["The Sun does not occupy, rule, or aspect the 12th, 9th, or 3rd houses."],
      },
      {
        id: "sun-moon",
        md: "Sun MD",
        bhukti: "Moon",
        startAge: 33.68,
        endAge: 34.18,
        tier: "none",
        reasons: ["The Moon does not occupy, rule, or aspect the 12th, 9th, or 3rd houses."],
      },
      {
        id: "sun-mars",
        md: "Sun MD",
        bhukti: "Mars",
        startAge: 34.18,
        endAge: 34.53,
        tier: "single",
        reasons: [
          "Mars's special 8th-house aspect reaches the 12th house — aspect indicator.",
          "Mars does not rule or occupy any arc house, nor is it a 12th-house kāraka.",
        ],
      },
      {
        id: "sun-rahu",
        md: "Sun MD",
        bhukti: "Rāhu",
        startAge: 34.53,
        endAge: 35.43,
        tier: "two",
        reasons: [
          "Rāhu occupies the 12th house — positional indicator.",
          "Rāhu is the foreign-settlement kāraka — significator indicator.",
        ],
      },
      {
        id: "sun-jupiter",
        md: "Sun MD",
        bhukti: "Jupiter",
        startAge: 35.43,
        endAge: 36.23,
        tier: "two",
        reasons: [
          "Jupiter rules the 9th house — ownership indicator.",
          "Jupiter occupies the 9th house — occupancy indicator.",
        ],
      },
      {
        id: "sun-saturn",
        md: "Sun MD",
        bhukti: "Saturn",
        startAge: 36.23,
        endAge: 37.18,
        tier: "none",
        reasons: [
          "Saturn does not occupy, rule, or aspect the 12th, 9th, or 3rd houses.",
          "General dignity is not a domain-specific indicator for this question.",
        ],
      },
      {
        id: "sun-mercury",
        md: "Sun MD",
        bhukti: "Mercury",
        startAge: 37.18,
        endAge: 38.03,
        tier: "multi",
        reasons: [
          "Mercury rules the 12th house — ownership indicator.",
          "Mercury rules the 3rd house — second ownership indicator.",
          "Mercury occupies the 9th house — occupancy indicator.",
        ],
      },
      {
        id: "sun-ketu",
        md: "Sun MD",
        bhukti: "Ketu",
        startAge: 38.03,
        endAge: 38.38,
        tier: "none",
        reasons: ["Ketu does not connect to the 12-9-3 arc in this brief window."],
      },
      {
        id: "sun-venus",
        md: "Sun MD",
        bhukti: "Venus",
        startAge: 38.38,
        endAge: 39.38,
        tier: "none",
        reasons: ["Venus does not occupy, rule, or aspect the 12th, 9th, or 3rd houses."],
      },
    ],
  },
  {
    md: "Moon Mahādaśā",
    y: 140,
    segments: [
      {
        id: "moon-moon",
        md: "Moon MD",
        bhukti: "Moon",
        startAge: 39.38,
        endAge: 40.21,
        tier: "none",
        reasons: ["The Moon does not occupy, rule, or aspect the 12th, 9th, or 3rd houses."],
      },
      {
        id: "moon-mars",
        md: "Moon MD",
        bhukti: "Mars",
        startAge: 40.21,
        endAge: 40.79,
        tier: "single",
        reasons: [
          "Mars's special 8th-house aspect reaches the 12th house — aspect indicator.",
          "No second independent arc connection is present.",
        ],
      },
      {
        id: "moon-rahu",
        md: "Moon MD",
        bhukti: "Rāhu",
        startAge: 40.79,
        endAge: 42.29,
        tier: "two",
        reasons: [
          "Rāhu occupies the 12th house — positional indicator.",
          "Rāhu is the foreign-settlement kāraka — significator indicator.",
        ],
      },
      {
        id: "moon-jupiter",
        md: "Moon MD",
        bhukti: "Jupiter",
        startAge: 42.29,
        endAge: 43.62,
        tier: "two",
        reasons: [
          "Jupiter rules the 9th house — ownership indicator.",
          "Jupiter occupies the 9th house — occupancy indicator.",
        ],
        note: "This two-yes window begins just after the sweep's age ceiling of 42.",
      },
    ],
  },
];

const OUT_OF_RANGE: Segment[] = [
  {
    id: "rahu-md",
    md: "Rāhu Mahādaśā",
    bhukti: "Rāhu (MD-lord)",
    startAge: 56.375,
    endAge: 74.375,
    tier: "two",
    reasons: [
      "Rāhu occupies the 12th house throughout its own MD — positional indicator.",
      "Rāhu is the foreign-settlement kāraka — significator indicator.",
    ],
    note: "Far outside the 22-42 sweep, but the single strongest classical alignment for the whole theme.",
  },
];

const DISCIPLINE_STATEMENTS = [
  {
    key: "rahu-only",
    label: "Restricting the sweep to Rāhu alone gives the complete timing picture.",
    correction:
      "Rāhu is a legitimate significator, but it is not the only one. A Rāhu-only sweep would miss the standout Mercury bhukti window entirely.",
  },
  {
    key: "single-equals-two",
    label: "A single-indicator Mars bhukti is just as strong as a two-yes Jupiter bhukti.",
    correction:
      "Mars has only one arc connection (aspect). A two-yes case requires two genuinely independent indicator types.",
  },
  {
    key: "beyond-range",
    label: "Because the sweep is comprehensive, its findings extend reliably beyond age 42.",
    correction:
      "The sweep is explicitly limited to ages 22-42. Specific findings beyond that range were not computed in this build.",
  },
  {
    key: "dignity",
    label: "Venus's and Saturn's own-sign dignity count as yeses for the foreign-settlement question.",
    correction:
      "General dignity is a real indicator, but it must connect to the relevant house/significator for the specific question.",
  },
] as const;

export function DashaTimingForeignSettlementSweep() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visibleTiers, setVisibleTiers] = useState<Record<Tier, boolean>>({
    multi: true,
    two: true,
    single: true,
    none: true,
  });
  const [showOutOfRange, setShowOutOfRange] = useState(false);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "rahu-only": false,
    "single-equals-two": false,
    "beyond-range": false,
    dignity: false,
  });

  function toggleTier(tier: Tier) {
    setVisibleTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setSelectedId(null);
    setVisibleTiers({ multi: true, two: true, single: true, none: true });
    setShowOutOfRange(false);
    setMistakes({ "rahu-only": false, "single-equals-two": false, "beyond-range": false, dignity: false });
  }

  const allSegments = useMemo(() => {
    const segs: Segment[] = [];
    TIMELINE_ROWS.forEach((row) => segs.push(...row.segments));
    if (showOutOfRange) segs.push(...OUT_OF_RANGE);
    return segs;
  }, [showOutOfRange]);

  const selectedSegment = useMemo(
    () => allSegments.find((s) => s.id === selectedId) || null,
    [allSegments, selectedId]
  );

  const counts = useMemo(() => {
    const inRange = allSegments.filter((s) => s.endAge > MIN_AGE && s.startAge < MAX_AGE);
    return {
      multi: inRange.filter((s) => s.tier === "multi").length,
      two: inRange.filter((s) => s.tier === "two").length,
      single: inRange.filter((s) => s.tier === "single").length,
      none: inRange.filter((s) => s.tier === "none").length,
    };
  }, [allSegments]);

  const axisX = (age: number) => {
    const clamped = Math.max(MIN_AGE, Math.min(MAX_AGE, age));
    return ((clamped - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 720 + 80;
  };

  const segmentWidth = (s: Segment) => {
    const start = Math.max(MIN_AGE, s.startAge);
    const end = Math.min(MAX_AGE, s.endAge);
    const years = Math.max(0, end - start);
    return (years / (MAX_AGE - MIN_AGE)) * 720;
  };

  return (
    <div
      data-interactive="dasha-timing-foreign-settlement-sweep"
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
            <p style={eyebrowStyle}>Chart T1 — Full daśā sweep (ages 22-42)</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: PURPLE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Two-yes timing sweep across every graha
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Click any bhukti bar to inspect its domain-specific indicators. Confirm the four honest tiers and the standout Mercury window that a Rāhu-only sweep would miss.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Tier counts inside the sweep</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))",
              gap: "0.55rem",
              marginTop: "0.55rem",
            }}
          >
            <CountPill label="Multi-yes" value={counts.multi} color={GREEN} />
            <CountPill label="Two-yes" value={counts.two} color={BLUE} />
            <CountPill label="Single" value={counts.single} color={GOLD} />
            <CountPill label="None" value={counts.none} color={NEUTRAL} />
          </div>
        </section>

        <section
          style={{
            ...cardStyle,
            borderColor: `${GREEN}${"66"}`,
            background: `${GREEN}${"08"}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Target size={18} style={{ color: GREEN }} aria-hidden="true" />
            <p style={eyebrowStyle}>Standout window</p>
          </div>
          <p
            style={{
              margin: "0.4rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            <strong style={{ color: GREEN, fontWeight: 600 }}>Venus MD → Mercury bhukti</strong>{" "}
            (age 29.38-32.21, ~2028-2031). Mercury rules the 12th and 3rd and occupies the 9th — the richest significator convergence in the whole sweep, and stronger than Jupiter in the KP 9th-house hierarchy.
          </p>
        </section>
      </div>

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
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Clock size={18} style={{ color: PURPLE }} aria-hidden="true" />
            <p style={eyebrowStyle}>Timeline sweep</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {(Object.keys(TIER_META) as Tier[]).map((tier) => {
              const meta = TIER_META[tier];
              const active = visibleTiers[tier];
              return (
                <button
                  key={tier}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleTier(tier)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.35rem 0.55rem",
                    borderRadius: 8,
                    border: `1px solid ${active ? meta.color : HAIRLINE}`,
                    background: active ? `${meta.color}${"14"}` : "transparent",
                    color: active ? meta.color : INK_SECONDARY,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: active ? meta.color : `${meta.color}${"40"}`,
                    }}
                  />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            marginTop: "0.75rem",
            overflowX: "auto",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 8,
            background: SURFACE,
          }}
        >
          <svg
            viewBox="0 0 820 220"
            preserveAspectRatio="xMidYMid meet"
            style={{ minWidth: 700, display: "block" }}
            aria-label="Daśā sweep timeline from age 22 to 42"
          >
            {/* Axis line */}
            <line x1={80} y1={185} x2={800} y2={185} stroke={HAIRLINE} strokeWidth={1.5} />
            {[22, 27, 32, 37, 42].map((age) => (
              <g key={age}>
                <line
                  x1={axisX(age)}
                  y1={180}
                  x2={axisX(age)}
                  y2={185}
                  stroke={INK_MUTED}
                  strokeWidth={1.5}
                />
                <text
                  x={axisX(age)}
                  y={200}
                  textAnchor="middle"
                  fontSize={10}
                  fill={INK_MUTED}
                >
                  {age}
                </text>
              </g>
            ))}
            <text x={440} y={215} textAnchor="middle" fontSize={10} fill={INK_MUTED}>
              Age (years)
            </text>

            {/* Present age marker */}
            <line
              x1={axisX(PRESENT_AGE)}
              y1={25}
              x2={axisX(PRESENT_AGE)}
              y2={180}
              stroke={VERMILION}
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            <text
              x={axisX(PRESENT_AGE)}
              y={20}
              textAnchor="middle"
              fontSize={9}
              fill={VERMILION}
              fontWeight={600}
            >
              present (~27-28)
            </text>

            {/* MD rows */}
            {TIMELINE_ROWS.map((row) => (
              <g key={row.md}>
                <text
                  x={10}
                  y={row.y + 18}
                  fontSize={11}
                  fill={INK_SECONDARY}
                  fontWeight={600}
                >
                  {row.md}
                </text>
                {row.segments
                  .filter((s) => visibleTiers[s.tier])
                  .map((s) => {
                    const x = axisX(s.startAge);
                    const w = segmentWidth(s);
                    if (w <= 0) return null;
                    const meta = TIER_META[s.tier];
                    return (
                      <g key={s.id}>
                        <rect
                          x={x}
                          y={row.y}
                          width={w}
                          height={28}
                          rx={4}
                          fill={tierFill(s.tier)}
                          stroke={meta.color}
                          strokeWidth={selectedId === s.id ? 2.5 : 1.5}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedId(s.id)}
                        />
                        {w > 30 ? (
                          <text
                            x={x + w / 2}
                            y={row.y + 18}
                            textAnchor="middle"
                            fontSize={9}
                            fill={INK_PRIMARY}
                            fontWeight={600}
                            pointerEvents="none"
                          >
                            {s.bhukti}
                          </text>
                        ) : null}
                      </g>
                    );
                  })}
              </g>
            ))}

            {showOutOfRange
              ? OUT_OF_RANGE.filter((s) => visibleTiers[s.tier]).map((s) => {
                  const x = axisX(s.startAge);
                  const w = segmentWidth(s);
                  if (w <= 0) return null;
                  const meta = TIER_META[s.tier];
                  return (
                    <g key={s.id}>
                      <rect
                        x={x}
                        y={170}
                        width={w}
                        height={10}
                        rx={3}
                         fill={tierFill(s.tier)}
                        stroke={meta.color}
                        strokeDasharray="3 2"
                        strokeWidth={1.5}
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedId(s.id)}
                      />
                      <text x={x + w / 2} y={165} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
                        Rāhu MD (far future)
                      </text>
                    </g>
                  );
                })
              : null}
          </svg>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Selected bhukti details</p>
          {selectedSegment ? (
            <div style={{ marginTop: "0.55rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: INK_PRIMARY,
                      fontSize: "1.05rem",
                      fontWeight: 600,
                    }}
                  >
                    {selectedSegment.md} → {selectedSegment.bhukti} bhukti
                  </h3>
                  <p
                    style={{
                      margin: "0.25rem 0 0",
                      color: INK_MUTED,
                      fontSize: "0.86rem",
                    }}
                  >
                    Age {selectedSegment.startAge.toFixed(2)}–{selectedSegment.endAge.toFixed(2)}
                  </p>
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.35rem 0.65rem",
                    borderRadius: 8,
                    background: TIER_META[selectedSegment.tier].color,
                    color: "#fff",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                  }}
                >
                  {selectedSegment.tier === "multi" ? (
                    <CheckCircle2 size={14} aria-hidden="true" />
                  ) : selectedSegment.tier === "two" ? (
                    <CheckCircle2 size={14} aria-hidden="true" />
                  ) : selectedSegment.tier === "single" ? (
                    <AlertTriangle size={14} aria-hidden="true" />
                  ) : (
                    <XCircle size={14} aria-hidden="true" />
                  )}
                  {TIER_META[selectedSegment.tier].label}
                </span>
              </div>
              {selectedSegment.note ? (
                <p
                  style={{
                    margin: "0.65rem 0 0",
                    color: selectedSegment.tier === "multi" ? GREEN : INK_SECONDARY,
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
                  }}
                >
                  {selectedSegment.note}
                </p>
              ) : null}
              <ul
                style={{
                  margin: "0.65rem 0 0",
                  paddingLeft: "1.2rem",
                  color: INK_SECONDARY,
                  fontSize: "0.88rem",
                  lineHeight: 1.55,
                }}
              >
                {selectedSegment.reasons.map((r, i) => (
                  <li key={i} style={{ margin: "0.3rem 0" }}>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p
              style={{
                margin: "0.55rem 0 0",
                color: INK_MUTED,
                fontStyle: "italic",
                lineHeight: 1.55,
              }}
            >
              Click a coloured bar on the timeline to see its indicator reasoning.
            </p>
          )}
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <HelpCircle size={18} style={{ color: GOLD }} aria-hidden="true" />
            <p style={eyebrowStyle}>Scope disclosure</p>
          </div>
          <p
            style={{
              margin: "0.4rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            This sweep is limited to ages 22-42, the range for which Chart T1&apos;s full antardaśā tables were computed and verified in this build. It is not a claim about the whole life.
          </p>
          <label
            style={{
              display: "flex",
              alignItems: "start",
              gap: "0.55rem",
              marginTop: "0.65rem",
              cursor: "pointer",
              color: INK_PRIMARY,
              fontWeight: 600,
            }}
          >
            <input
              type="checkbox"
              checked={showOutOfRange}
              onChange={(e) => setShowOutOfRange(e.target.checked)}
            />
            <span>Show the far-future Rāhu Mahādaśā (outside the sweep)</span>
          </label>
          {showOutOfRange ? (
            <p
              style={{
                margin: "0.55rem 0 0",
                color: INK_SECONDARY,
                fontSize: "0.86rem",
                lineHeight: 1.55,
              }}
            >
              Rāhu&apos;s own MD (age 56.375–74.375) is the single strongest classical alignment for the travel/foreign theme, but it lies well beyond the computed sweep.
            </p>
          ) : null}
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
                    <ShieldAlert size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                    {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CountPill({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const isNeutral = color === NEUTRAL;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.5rem",
        padding: "0.55rem 0.75rem",
        borderRadius: 8,
        border: `1px solid ${color}`,
        background: isNeutral ? NEUTRAL_SOFT : `${color}${"0A"}`,
        color,
        fontSize: "0.85rem",
        fontWeight: 600,
      }}
    >
      <span>{label}</span>
      <span
        style={{
          minWidth: 22,
          height: 22,
          borderRadius: "50%",
          background: isNeutral ? SURFACE : color,
          color: isNeutral ? color : "#fff",
          border: isNeutral ? `1px solid ${color}` : "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
        }}
      >
        {value}
      </span>
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
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
