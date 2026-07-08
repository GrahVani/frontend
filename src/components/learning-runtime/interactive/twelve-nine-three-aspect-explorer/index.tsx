"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCcw,
  Search,
  Target,
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

const ARC_HOUSES = [12, 9, 3];
const ARC_COLORS: Record<number, string> = { 12: PURPLE, 9: BLUE, 3: GREEN };

const GRAHAS = [
  {
    key: "sun",
    name: "Sun",
    short: "Su",
    house: 2,
    color: GOLD,
    aspects: [8],
  },
  {
    key: "moon",
    name: "Moon",
    short: "Mo",
    house: 1,
    color: BLUE,
    aspects: [7],
  },
  {
    key: "mars",
    name: "Mars",
    short: "Ma",
    house: 5,
    color: VERMILION,
    aspects: [8, 11, 12],
  },
  {
    key: "mercury",
    name: "Mercury",
    short: "Me",
    house: 9,
    color: GREEN,
    aspects: [3],
  },
  {
    key: "jupiter",
    name: "Jupiter",
    short: "Ju",
    house: 9,
    color: BLUE,
    aspects: [1, 3, 5],
  },
  {
    key: "venus",
    name: "Venus",
    short: "Ve",
    house: 4,
    color: GOLD,
    aspects: [10],
  },
  {
    key: "saturn",
    name: "Saturn",
    short: "Sa",
    house: 8,
    color: PURPLE,
    aspects: [2, 5, 10],
  },
] as const;

const DISCIPLINE_STATEMENTS = [
  {
    key: "mars",
    label: "Mars's aspect on the 12th cancels the earlier supportive reading.",
    correction:
      "A single new indicator is weighed against, not allowed to override, an established multi-indicator picture. Mars is also own-sign and dignified.",
  },
  {
    key: "occupancy",
    label: "The 3rd house is occupied by Jupiter and Mercury because they aspect it.",
    correction:
      "Aspect is a real relationship, but it is not occupancy. The 3rd house is empty of occupants and aspected by Jupiter and Mercury.",
  },
  {
    key: "sample",
    label: "Checking only the most interesting planets is enough for this analysis.",
    correction:
      "The lesson's findings — including Mars's contribution to the 12th — surfaced only because every graha was checked exhaustively.",
  },
] as const;

const CENTER = { x: 260, y: 230 };
const OUTER_R = 170;
const PLANET_R = 110;

function houseAngle(house: number) {
  return Math.PI + (house - 1) * (Math.PI / 6);
}

function polar(r: number, angle: number) {
  return {
    x: CENTER.x + r * Math.cos(angle),
    y: CENTER.y + r * Math.sin(angle),
  };
}

export function TwelveNineThreeAspectExplorer() {
  const [selectedGraha, setSelectedGraha] = useState<string | null>(null);
  const [onlyArc, setOnlyArc] = useState(false);
  const [showConvergence, setShowConvergence] = useState(true);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    mars: false,
    occupancy: false,
    sample: false,
  });

  const selected = GRAHAS.find((g) => g.key === selectedGraha) ?? null;

  const arcHitters = useMemo(
    () =>
      GRAHAS.filter((g) => g.aspects.some((h) => ARC_HOUSES.includes(h))).map(
        (g) => g.name
      ),
    []
  );

  const synthesis = useMemo(() => {
    const scope = selected
      ? `Showing ${selected.name}'s aspects.`
      : "Showing all grahas' aspects.";
    const filter = onlyArc
      ? "Only aspects landing on the 12-9-3 arc are highlighted."
      : "All classical aspects are shown; arc houses are marked.";
    const hits = `Planets reaching the arc: ${arcHitters.join(", ")}.`;
    const convergence = showConvergence
      ? "Convergence overlay on: Mercury rules the 3rd and 12th; Jupiter rules the 9th; both sit in the 9th."
      : "Convergence overlay off.";
    return `${scope} ${filter} ${hits} ${convergence}`;
  }, [arcHitters, onlyArc, selected, showConvergence]);

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setSelectedGraha(null);
    setOnlyArc(false);
    setShowConvergence(true);
    setMistakes({ mars: false, occupancy: false, sample: false });
  }

  return (
    <div
      data-interactive="twelve-nine-three-aspect-explorer"
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
            <p style={eyebrowStyle}>Chart T1 — 12-9-3 aspect explorer</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: VERMILION,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Aspects on the travel arc and lordship permutations
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Compute every classical graha&apos;s aspect onto the 12-9-3 arc. Trace which planet reaches which arc house, surface the new Mars contributor, and see how all three arc-lordship threads converge in the 9th.
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
              <p style={eyebrowStyle}>Aspect wheel</p>
              <h3
                style={{
                  margin: "0.15rem 0 0",
                  color: VERMILION,
                  fontSize: "1.12rem",
                  fontWeight: 600,
                }}
              >
                {selected ? `${selected.name}'s aspects` : "All grahas' aspects"}
              </h3>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                aria-pressed={onlyArc}
                onClick={() => setOnlyArc((v) => !v)}
                style={buttonStyle(onlyArc, PURPLE)}
              >
                {onlyArc ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
                Arc only
              </button>
              <button
                type="button"
                aria-pressed={showConvergence}
                onClick={() => setShowConvergence((v) => !v)}
                style={buttonStyle(showConvergence, GOLD)}
              >
                <Target size={15} aria-hidden="true" />
                Convergence
              </button>
            </div>
          </div>
          <AspectWheel
            selectedGraha={selectedGraha}
            onlyArc={onlyArc}
            showConvergence={showConvergence}
            onSelect={setSelectedGraha}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.55rem",
              marginTop: "0.5rem",
            }}
          >
            {ARC_HOUSES.map((h) => (
              <span
                key={h}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.35rem 0.55rem",
                  borderRadius: 8,
                  background: `${ARC_COLORS[h]}${"18"}`,
                  color: ARC_COLORS[h],
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: ARC_COLORS[h],
                  }}
                />
                House {h}
              </span>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Graha aspect table" icon={<Search size={18} />} color={BLUE}>
            <p
              style={{
                margin: "0 0 0.55rem",
                color: INK_SECONDARY,
                fontSize: "0.88rem",
                lineHeight: 1.5,
              }}
            >
              Click a row to isolate that graha on the wheel. Arc-reaching aspects are highlighted.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {GRAHAS.map((g) => {
                const active = selectedGraha === g.key;
                const reachesArc = g.aspects.some((h) => ARC_HOUSES.includes(h));
                return (
                  <button
                    key={g.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedGraha(active ? null : g.key)}
                    style={{
                      textAlign: "left",
                      border: `1px solid ${active ? g.color : HAIRLINE}`,
                      borderRadius: 8,
                      background: active ? `${g.color}${"12"}` : "transparent",
                      padding: "0.6rem 0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ color: g.color, fontWeight: 600 }}>
                        {g.name} · house {g.house}
                      </span>
                      {reachesArc ? (
                        <span
                          style={{
                            color: GREEN,
                            fontSize: "0.78rem",
                            fontWeight: 600,
                          }}
                        >
                          reaches arc
                        </span>
                      ) : null}
                    </div>
                    <p
                      style={{
                        margin: "0.25rem 0 0",
                        color: INK_SECONDARY,
                        fontSize: "0.84rem",
                      }}
                    >
                      Aspects: {" "}
                      {g.aspects.map((h) => (
                        <span
                          key={h}
                          style={{
                            color: ARC_HOUSES.includes(h)
                              ? ARC_COLORS[h]
                              : INK_MUTED,
                            fontWeight: ARC_HOUSES.includes(h) ? 600 : 400,
                          }}
                        >
                          {h}
                          {", "}
                        </span>
                      ))}
                    </p>
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel title="Key findings" icon={<Target size={18} />} color={GOLD}>
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.1rem",
                color: INK_SECONDARY,
                fontSize: "0.88rem",
                lineHeight: 1.55,
              }}
            >
              <li>
                <strong style={{ color: ARC_COLORS[9], fontWeight: 600 }}>House 9</strong>{" "}
                receives no classical aspect from any graha — its strength is self-generated.
              </li>
              <li style={{ marginTop: "0.35rem" }}>
                <strong style={{ color: ARC_COLORS[3], fontWeight: 600 }}>House 3</strong>{" "}
                is empty but aspected by both Jupiter and Mercury from the 9th.
              </li>
              <li style={{ marginTop: "0.35rem" }}>
                <strong style={{ color: ARC_COLORS[12], fontWeight: 600 }}>House 12</strong>{" "}
                receives a new aspect from own-sign Mars in the 5th — adding decisiveness, not cancelling the earlier picture.
              </li>
            </ul>
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
            <p style={eyebrowStyle}>Lordship convergence</p>
            <h3
              style={{
                margin: "0.15rem 0 0",
                color: GOLD,
                fontSize: "1.12rem",
                fontWeight: 600,
              }}
            >
              The whole arc collapses into two planets in the 9th
            </h3>
          </div>
          <button
            type="button"
            aria-pressed={showConvergence}
            onClick={() => setShowConvergence((v) => !v)}
            style={smallChipStyle(showConvergence, GOLD)}
          >
            {showConvergence ? "Hide overlay" : "Show overlay"}
          </button>
        </div>
        <ConvergenceSvg visible={showConvergence} />
        <p
          style={{
            margin: "0.55rem 0 0",
            color: INK_SECONDARY,
            fontSize: "0.88rem",
            lineHeight: 1.55,
          }}
        >
          Mercury rules the 3rd and 12th; Jupiter rules the 9th. Both sit together in the 9th house — an unusually concentrated, chart-specific structural finding.
        </p>
      </section>

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

function AspectWheel({
  selectedGraha,
  onlyArc,
  showConvergence,
  onSelect,
}: {
  selectedGraha: string | null;
  onlyArc: boolean;
  showConvergence: boolean;
  onSelect: (key: string | null) => void;
}) {
  return (
    <svg
      viewBox="0 0 520 460"
      role="img"
      aria-label="Chart T1 aspect wheel focused on the 12-9-3 arc"
      style={{
        width: "100%",
        maxHeight: 420,
        margin: "0.65rem auto 0.55rem",
        display: "block",
      }}
    >
      {/* Outer wheel */}
      <circle cx={CENTER.x} cy={CENTER.y} r={OUTER_R} fill="none" stroke={HAIRLINE} />
      <circle cx={CENTER.x} cy={CENTER.y} r={PLANET_R} fill="none" stroke={HAIRLINE} strokeDasharray="4 2" />

      {/* House markers and numbers */}
      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
        const angle = houseAngle(h);
        const outer = polar(OUTER_R + 16, angle);
        const isArc = ARC_HOUSES.includes(h);
        return (
          <g key={h}>
            <line
              x1={CENTER.x}
              y1={CENTER.y}
              x2={polar(OUTER_R, angle).x}
              y2={polar(OUTER_R, angle).y}
              stroke={HAIRLINE}
              strokeWidth={1}
            />
            <text
              x={outer.x}
              y={outer.y + 4}
              textAnchor="middle"
              fill={isArc ? ARC_COLORS[h] : INK_MUTED}
              fontSize={isArc ? 13 : 11}
              fontWeight={600}
            >
              {h}
            </text>
          </g>
        );
      })}

      {/* Arc house sectors */}
      {ARC_HOUSES.map((h) => {
        const start = houseAngle(h) - Math.PI / 12;
        const end = houseAngle(h) + Math.PI / 12;
        const p1 = polar(OUTER_R, start);
        const p2 = polar(OUTER_R, end);
        return (
          <path
            key={h}
            d={`M ${CENTER.x} ${CENTER.y} L ${p1.x} ${p1.y} A ${OUTER_R} ${OUTER_R} 0 0 1 ${p2.x} ${p2.y} Z`}
            fill={`${ARC_COLORS[h]}${"14"}`}
            stroke={ARC_COLORS[h]}
            strokeWidth={2}
          />
        );
      })}

      {/* Convergence overlay: Mercury + Jupiter in 9th */}
      {showConvergence ? (
        <>
          <ConvergenceBand fromHouse={9} toHouse={3} color={GREEN} />
          <ConvergenceBand fromHouse={9} toHouse={12} color={PURPLE} />
          <ConvergenceBand fromHouse={9} toHouse={9} color={BLUE} />
        </>
      ) : null}

      {/* Aspect lines */}
      {GRAHAS.map((g) => {
        const isSelected = selectedGraha === null || selectedGraha === g.key;
        if (!isSelected) return null;
        const from = planetPosition(g);
        return g.aspects.map((target) => {
          const arcTarget = ARC_HOUSES.includes(target);
          if (onlyArc && !arcTarget) return null;
          const to = polar(OUTER_R - 10, houseAngle(target));
          const opacity = selectedGraha ? 1 : arcTarget ? 0.85 : 0.35;
          const width = selectedGraha ? 3 : arcTarget ? 2.5 : 1.5;
          return (
            <line
              key={`${g.key}-${target}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={arcTarget ? ARC_COLORS[target] : g.color}
              strokeWidth={width}
              strokeOpacity={opacity}
              strokeLinecap="round"
            />
          );
        });
      })}

      {/* Planet nodes */}
      {GRAHAS.map((g) => {
        const pos = planetPosition(g);
        const isSelected = selectedGraha === g.key;
        const reachesArc = g.aspects.some((h) => ARC_HOUSES.includes(h));
        return (
          <g key={g.key}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isSelected ? 18 : 14}
              fill={g.color}
              stroke="#fff"
              strokeWidth={isSelected ? 3 : 2}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(isSelected ? null : g.key)}
            />
            <text
              x={pos.x}
              y={pos.y + 4}
              textAnchor="middle"
              fill="#fff"
              fontSize={isSelected ? 12 : 10}
              fontWeight={600}
              style={{ pointerEvents: "none" }}
            >
              {g.short}
            </text>
            {reachesArc && !isSelected ? (
              <circle
                cx={pos.x + 10}
                cy={pos.y - 10}
                r={5}
                fill={GREEN}
              />
            ) : null}
          </g>
        );
      })}

      {/* Center label */}
      <text
        x={CENTER.x}
        y={CENTER.y + 4}
        textAnchor="middle"
        fill={INK_MUTED}
        fontSize={12}
        fontWeight={600}
      >
        Cancer Lagna
      </text>
    </svg>
  );
}

function planetPosition(g: (typeof GRAHAS)[number]) {
  const baseAngle = houseAngle(g.house);
  const index = GRAHAS.filter((x) => x.house === g.house).findIndex(
    (x) => x.key === g.key
  );
  const count = GRAHAS.filter((x) => x.house === g.house).length;
  const offset = count === 1 ? 0 : (index - (count - 1) / 2) * 0.18;
  return polar(PLANET_R, baseAngle + offset);
}

function ConvergenceBand({
  fromHouse,
  toHouse,
  color,
}: {
  fromHouse: number;
  toHouse: number;
  color: string;
}) {
  const from = polar(PLANET_R - 6, houseAngle(fromHouse));
  const to = polar(OUTER_R - 18, houseAngle(toHouse));
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 12;
  return (
    <g>
      <path
        d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray="4 3"
        strokeOpacity={0.65}
      />
    </g>
  );
}

function ConvergenceSvg({ visible }: { visible: boolean }) {
  return (
    <svg
      viewBox="0 0 520 180"
      role="img"
      aria-label="Lordship convergence diagram"
      style={{
        width: "100%",
        maxHeight: 180,
        margin: "0.55rem auto 0",
        display: "block",
        opacity: visible ? 1 : 0.25,
      }}
    >
      <rect x="10" y="10" width="500" height="160" rx="8" fill={`${GOLD}${"08"}`} stroke={HAIRLINE} />

      {/* 9th house node */}
      <g transform="translate(260 90)">
        <rect x="-70" y="-34" width="140" height="68" rx="8" fill={`${BLUE}${"18"}`} stroke={BLUE} strokeWidth={2} />
        <text x="0" y="-8" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="600">
          9th house Pisces
        </text>
        <text x="0" y="12" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">
          Mercury + Jupiter
        </text>
      </g>

      {/* Mercury to 3rd and 12th */}
      <g transform="translate(100 90)">
        <rect x="-54" y="-28" width="108" height="56" rx="8" fill={`${GREEN}${"14"}`} stroke={GREEN} strokeWidth={2} />
        <text x="0" y="-4" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight="600">
          3rd Virgo
        </text>
        <text x="0" y="14" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="600">
          lord: Mercury
        </text>
      </g>

      <g transform="translate(420 90)">
        <rect x="-54" y="-28" width="108" height="56" rx="8" fill={`${PURPLE}${"14"}`} stroke={PURPLE} strokeWidth={2} />
        <text x="0" y="-4" textAnchor="middle" fill={PURPLE} fontSize="12" fontWeight="600">
          12th Gemini
        </text>
        <text x="0" y="14" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="600">
          lord: Mercury
        </text>
      </g>

      <path d="M 155 90 Q 200 50, 190 75" fill="none" stroke={GREEN} strokeWidth={2} strokeDasharray="4 2" />
      <path d="M 365 90 Q 320 50, 330 75" fill="none" stroke={PURPLE} strokeWidth={2} strokeDasharray="4 2" />

      <text x="260" y="155" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="600">
        Two planets in the 9th carry all three arc lordships
      </text>
    </svg>
  );
}

function Panel({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        border: `1px solid ${color}${"44"}`,
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
          fontWeight: 600,
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
    padding: "0.4rem 0.65rem",
    fontSize: "0.85rem",
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
