"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  Eye,
  EyeOff,
  RefreshCcw,
  Scale,
  ShieldCheck,
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

const DOCTRINES = {
  "7th-only": {
    label: "7th-only doctrine",
    color: BLUE,
    aspects: [7],
    note: "Rāhu casts only the universal 7th-house aspect, like the Sun, Moon, Mercury, and Venus.",
  },
  extended: {
    label: "Extended 5/7/9 doctrine",
    color: PURPLE,
    aspects: [5, 7, 9],
    note: "Rāhu also receives Jupiter-like special aspects on the 5th, 7th, and 9th signs from its placement.",
  },
} as const;

const HOUSE_DATA: Record<
  number,
  { sign: string; occupant?: string; occupantColor?: string; note?: string }
> = {
  4: { sign: "Libra", occupant: "Venus", occupantColor: GOLD, note: "Venus's house" },
  6: { sign: "Sagittarius", occupant: "Ketu", occupantColor: BLUE, note: "Ketu's house" },
  8: { sign: "Aquarius", occupant: "Saturn", occupantColor: PURPLE, note: "Saturn's house" },
  9: { sign: "Pisces", occupant: "Jupiter + Mercury", occupantColor: GREEN, note: "Unaffected by either doctrine" },
};

const DISCIPLINE_STATEMENTS = [
  {
    key: "settled",
    label: "The Rāhu-aspect question is a settled classical point with one clear right answer.",
    correction:
      "It is a genuine, unresolved classical disagreement. Neither doctrine is simply mistaken.",
  },
  {
    key: "always-matters",
    label: "Every doctrinal disagreement automatically changes a chart's findings.",
    correction:
      "Check per chart and per question. On Chart T1 the fork changes the Venus/house-4 finding but does not reach house 9.",
  },
  {
    key: "switch",
    label: "A practitioner may switch doctrines between clients to produce better-sounding readings.",
    correction:
      "Choose and disclose a doctrine before seeing the answer it produces, then apply it consistently.",
  },
] as const;

export function RahuAspectDoctrineForkExplorer() {
  const [doctrine, setDoctrine] = useState<keyof typeof DOCTRINES>("extended");
  const [showHouse9, setShowHouse9] = useState(true);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    settled: false,
    "always-matters": false,
    switch: false,
  });

  const aspects = DOCTRINES[doctrine].aspects;
  const reachedHouseSet = useMemo(() => {
    const rahuHouse = 12;
    const houses = aspects.map((a) => ((rahuHouse + a - 2) % 12) + 1);
    return new Set(houses);
  }, [aspects]);

  const synthesis = useMemo(() => {
    const d = DOCTRINES[doctrine];
    const affected = [4, 6, 8].filter((h) => reachedHouseSet.has(h))
      .map((h) => `house ${h}${HOUSE_DATA[h].occupant ? ` (${HOUSE_DATA[h].occupant})` : ""}`)
      .join(", ");
    const unaffected = "House 9 (Jupiter + Mercury) is not reached under either doctrine.";
    return `Using the ${d.label.toLowerCase()}, Rāhu in Gemini aspects ${affected}. ${unaffected}`;
  }, [doctrine, reachedHouseSet]);

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setDoctrine("extended");
    setShowHouse9(true);
    setMistakes({ settled: false, "always-matters": false, switch: false });
  }

  return (
    <div
      data-interactive="rahu-aspect-doctrine-fork-explorer"
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
            <p style={eyebrowStyle}>Chart T1 — Rāhu aspect-doctrine fork</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: PURPLE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Choose, disclose, and apply a lineage-dependent doctrine consistently
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Toggle between the two classical doctrines for Rāhu/Ketu aspects and see exactly where Chart T1&apos;s findings change — and where they stay the same.
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
              <p style={eyebrowStyle}>Aspect diagram</p>
              <h3
                style={{
                  margin: "0.15rem 0 0",
                  color: DOCTRINES[doctrine].color,
                  fontSize: "1.12rem",
                  fontWeight: 600,
                }}
              >
                {DOCTRINES[doctrine].label}
              </h3>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(Object.keys(DOCTRINES) as Array<keyof typeof DOCTRINES>).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={doctrine === key}
                  onClick={() => setDoctrine(key)}
                  style={smallChipStyle(
                    doctrine === key,
                    DOCTRINES[key].color
                  )}
                >
                  {DOCTRINES[key].label}
                </button>
              ))}
            </div>
          </div>
          <AspectSvg
            doctrine={doctrine}
            reachedHouses={reachedHouseSet}
            showHouse9={showHouse9}
          />
          <button
            type="button"
            onClick={() => setShowHouse9((v) => !v)}
            style={{
              ...buttonStyle(showHouse9, INK_MUTED),
              marginTop: "0.55rem",
            }}
          >
            {showHouse9 ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
            {showHouse9 ? "Hide house 9" : "Show house 9"}
          </button>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Doctrine note" icon={<BookOpen size={18} />} color={DOCTRINES[doctrine].color}>
            <p
              style={{
                margin: 0,
                color: INK_SECONDARY,
                lineHeight: 1.55,
                fontSize: "0.9rem",
              }}
            >
              {DOCTRINES[doctrine].note}
            </p>
          </Panel>

          <Panel title="Reached houses" icon={<Scale size={18} />} color={PURPLE}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {[4, 6, 8, 9].map((h) => {
                const reached = reachedHouseSet.has(h);
                const data = HOUSE_DATA[h];
                return (
                  <div
                    key={h}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      padding: "0.55rem",
                      borderRadius: 8,
                      border: `1px solid ${
                        reached ? PURPLE : h === 9 ? GREEN : HAIRLINE
                      }`,
                      background: reached
                        ? `${PURPLE}${"10"}`
                        : h === 9
                          ? `${GREEN}${"10"}`
                          : "transparent",
                    }}
                  >
                    <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>
                      {h}th ({data.sign})
                    </span>
                    <span
                      style={{
                        color: reached
                          ? PURPLE
                          : h === 9
                            ? GREEN
                            : INK_MUTED,
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      {reached
                        ? `reached${data.occupant ? ` · ${data.occupant}` : ""}`
                        : h === 9
                          ? "not reached either"
                          : "not reached"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Practitioner discipline" icon={<ShieldCheck size={18} />} color={GREEN}>
            <ol
              style={{
                margin: 0,
                paddingLeft: "1.1rem",
                color: INK_SECONDARY,
                fontSize: "0.88rem",
                lineHeight: 1.55,
              }}
            >
              <li>
                <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Choose</strong> — settle which doctrine you follow before seeing the answer.
              </li>
              <li style={{ marginTop: "0.35rem" }}>
                <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Disclose</strong> — state the doctrine whenever it changes a finding.
              </li>
              <li style={{ marginTop: "0.35rem" }}>
                <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Apply consistently</strong> — never switch doctrines to fit a preferred outcome.
              </li>
            </ol>
          </Panel>
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

function AspectSvg({
  doctrine,
  reachedHouses,
  showHouse9,
}: {
  doctrine: keyof typeof DOCTRINES;
  reachedHouses: Set<number>;
  showHouse9: boolean;
}) {
  const center = { x: 250, y: 160 };
  const rahuR = 42;

  // positions for target houses relative to center, approximating chart wheel
  const targets: Record<number, { x: number; y: number }> = {
    4: { x: 80, y: 90 },   // Libra / 4th-ish
    6: { x: 250, y: 270 }, // Sagittarius / 6th-ish
    8: { x: 420, y: 90 },  // Aquarius / 8th-ish
    9: { x: 420, y: 240 }, // Pisces / 9th-ish
  };

  return (
    <svg
      viewBox="0 0 500 320"
      role="img"
      aria-label={`Rahu aspect diagram under ${DOCTRINES[doctrine].label}`}
      style={{
        width: "100%",
        maxHeight: 320,
        margin: "0.65rem auto 0.55rem",
        display: "block",
      }}
    >
      <rect x="10" y="10" width="480" height="300" rx="10" fill={`${PURPLE}${"06"}`} stroke={HAIRLINE} />

      {/* Rahu node */}
      <g transform={`translate(${center.x} ${center.y})`}>
        <circle cx="0" cy="0" r={rahuR} fill={PURPLE} />
        <text x="0" y="-6" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">
          Rāhu
        </text>
        <text x="0" y="12" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">
          Gemini / 12th
        </text>
      </g>

      {/* Aspect rays */}
      {[4, 6, 8].map((h) => {
        const reached = reachedHouses.has(h);
        const t = targets[h];
        return (
          <line
            key={h}
            x1={center.x}
            y1={center.y}
            x2={t.x}
            y2={t.y}
            stroke={reached ? PURPLE : HAIRLINE}
            strokeWidth={reached ? 4 : 2}
            strokeDasharray={reached ? undefined : "5 3"}
            strokeLinecap="round"
            opacity={reached ? 1 : 0.4}
          />
        );
      })}

      {/* House 9 reference */}
      {showHouse9 ? (
        <>
          <line
            x1={center.x}
            y1={center.y}
            x2={targets[9].x}
            y2={targets[9].y}
            stroke={HAIRLINE}
            strokeWidth={2}
            strokeDasharray="5 3"
            opacity={0.35}
          />
          <g transform={`translate(${targets[9].x} ${targets[9].y})`}>
            <circle cx="0" cy="0" r="28" fill={`${GREEN}${"18"}`} stroke={GREEN} strokeWidth="2" />
            <text x="0" y="-4" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">
              9th
            </text>
            <text x="0" y="10" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="600">
              Pisces
            </text>
          </g>
        </>
      ) : null}

      {/* Target house nodes */}
      {[4, 6, 8].map((h) => {
        const reached = reachedHouses.has(h);
        const t = targets[h];
        const data = HOUSE_DATA[h];
        return (
          <g key={h} transform={`translate(${t.x} ${t.y})`}>
            <circle
              cx="0"
              cy="0"
              r="28"
              fill={reached ? `${PURPLE}22` : `${INK_MUTED}12`}
              stroke={reached ? PURPLE : INK_MUTED}
              strokeWidth={2}
            />
            <text x="0" y="-5" textAnchor="middle" fill={reached ? PURPLE : INK_MUTED} fontSize="11" fontWeight="600">
              {h}th
            </text>
            <text x="0" y="8" textAnchor="middle" fill={INK_PRIMARY} fontSize="9" fontWeight="600">
              {data.sign}
            </text>
            {reached && data.occupant ? (
              <text x="0" y="34" textAnchor="middle" fill={data.occupantColor} fontSize="9" fontWeight="600">
                {data.occupant}
              </text>
            ) : null}
          </g>
        );
      })}

      <text x="250" y="305" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">
        {doctrine === "extended"
          ? "Extended doctrine reaches houses 4, 6, and 8"
          : "7th-only doctrine reaches house 6 only"}
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
