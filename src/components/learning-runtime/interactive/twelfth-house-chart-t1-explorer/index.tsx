"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "../lib/layouts";

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

const HOUSE_12_SIGN = "Gemini";
const LORD = "Mercury";
const LORD_SIGN = "Pisces";

const OCCUPANTS = [
  {
    key: "rahu",
    label: "Rāhu",
    color: PURPLE,
    note: "Direct, thematically-aligned foreign/unfamiliar signal. Strong candidate thread, not a verdict.",
  },
  {
    key: "saturn",
    label: "Saturn",
    color: VERMILION,
    note: "Release through restriction — a harder-won letting-go signature.",
  },
  {
    key: "ketu",
    label: "Ketu",
    color: BLUE,
    note: "Release through natural detachment — smoother symbolic dissolution.",
  },
  {
    key: "none",
    label: "None",
    color: INK_MUTED,
    note: "Read the letting-go signature through the 12th lord's condition instead.",
  },
] as const;

const THREADS = [
  { key: "foreign", label: "Foreign lands", color: BLUE },
  { key: "expenditure", label: "Expenditure / loss", color: VERMILION },
  { key: "moksha", label: "Dissolution / mokṣa", color: PURPLE },
] as const;

export function TwelfthHouseChartT1Explorer() {
  const [venusKendra, setVenusKendra] = useState(true);
  const [mercuryConjunctJupiter, setMercuryConjunctJupiter] = useState(true);
  const [occupant, setOccupant] = useState<(typeof OCCUPANTS)[number]["key"]>("rahu");
  const [activeThreads, setActiveThreads] = useState<Record<string, boolean>>({
    foreign: true,
    expenditure: true,
    moksha: true,
  });
  const [overclaim, setOverclaim] = useState(false);

  const neechaBhanghaActive = venusKendra && mercuryConjunctJupiter;

  const synthesis = useMemo(() => {
    const occ = OCCUPANTS.find((o) => o.key === occupant)!;
    const threadList = THREADS.filter((t) => activeThreads[t.key])
      .map((t) => t.label)
      .join(", ");
    const lordLine = neechaBhanghaActive
      ? `${LORD} is debilitated in ${LORD_SIGN} but neecha-bhaṅga is verified — the apparent weakness does not hold.`
      : `${LORD} is debilitated in ${LORD_SIGN} and neecha-bhaṅga is not established — the 12th lord carries real softness.`;
    const occupantLine = `The 12th house is occupied by ${occ.label}: ${occ.note}`;
    return `Chart T1's 12th house is ${HOUSE_12_SIGN}. ${lordLine} ${occupantLine} Active threads: ${threadList}. Read as dissolution-of-old-context — neither pure loss nor pure liberation, but both together.`;
  }, [neechaBhanghaActive, occupant, activeThreads]);

  function toggleThread(key: string) {
    setActiveThreads((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setVenusKendra(true);
    setMercuryConjunctJupiter(true);
    setOccupant("rahu");
    setActiveThreads({ foreign: true, expenditure: true, moksha: true });
    setOverclaim(false);
  }

  return (
    <div
      data-interactive="twelfth-house-chart-t1-explorer"
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
            <p style={eyebrowStyle}>Chart T1 — 12th house explorer</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: PURPLE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Foreign lands, expenditure, and dissolution of old context
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              Explore Chart T1&apos;s 12th house (Cancer Lagna, Gemini 12th). Toggle the neecha-bhaṅga conditions, swap the occupant to compare letting-go signatures, and keep the three threads in view.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <p style={eyebrowStyle}>Chart diagram</p>
          <ChartSvg occupant={occupant} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "0.55rem",
              marginTop: "0.75rem",
            }}
          >
            <MiniFact
              icon={<Sun size={16} />}
              title="Lagna"
              body="Cancer"
              color={BLUE}
            />
            <MiniFact
              icon={<Moon size={16} />}
              title="12th house"
              body="Gemini"
              color={PURPLE}
            />
            <MiniFact
              icon={<Compass size={16} />}
              title="12th lord"
              body="Mercury in Pisces (9th)"
              color={GOLD}
            />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Neecha-bhaṅga checks" icon={<CheckCircle2 size={18} />} color={GREEN}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                color: INK_SECONDARY,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={venusKendra}
                onChange={(e) => setVenusKendra(e.target.checked)}
              />
              Venus (exalted in Pisces) sits in a kendra from Lagna and Moon
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                color: INK_SECONDARY,
                cursor: "pointer",
                marginTop: "0.55rem",
              }}
            >
              <input
                type="checkbox"
                checked={mercuryConjunctJupiter}
                onChange={(e) => setMercuryConjunctJupiter(e.target.checked)}
              />
              Mercury is conjunct its dispositor Jupiter in Pisces
            </label>
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.65rem",
                borderRadius: 8,
                border: `1px solid ${
                  neechaBhanghaActive ? GREEN : VERMILION
                }${"44"}`,
                background: `${
                  neechaBhanghaActive ? GREEN : VERMILION
                }${"0A"}`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: neechaBhanghaActive ? GREEN : VERMILION,
                  fontWeight: 600,
                }}
              >
                {neechaBhanghaActive
                  ? "Neecha-bhaṅga is verified"
                  : "Neecha-bhaṅga is not established"}
              </p>
              <p
                style={{
                  margin: "0.3rem 0 0",
                  color: INK_SECONDARY,
                  fontSize: "0.86rem",
                }}
              >
                {neechaBhanghaActive
                  ? "Mercury's debility is cancelled; the 12th lord's apparent weakness does not hold."
                  : "With these conditions off, Mercury's debilitation in Pisces remains a real softness for the 12th lord."}
              </p>
            </div>
          </Panel>

          <Panel title="12th-house occupant" icon={<Sparkles size={18} />} color={PURPLE}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {OCCUPANTS.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  aria-pressed={occupant === o.key}
                  onClick={() => setOccupant(o.key)}
                  style={smallChipStyle(occupant === o.key, o.color)}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              {OCCUPANTS.find((o) => o.key === occupant)?.note}
            </p>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Three threads of the 12th house</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            fontSize: "0.9rem",
          }}
        >
          Foreign settlement is read through the foreign-lands thread, but the expenditure/loss and mokṣa threads describe the quality of the dissolution-of-old-context.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginTop: "0.65rem",
          }}
        >
          {THREADS.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={activeThreads[t.key]}
              onClick={() => toggleThread(t.key)}
              style={smallChipStyle(activeThreads[t.key], t.color)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section
          style={{
            ...cardStyle,
            borderColor: overclaim
              ? `${VERMILION}${"66"}`
              : `${GREEN}${"66"}`,
            background: overclaim
              ? `${VERMILION}${"0A"}`
              : `${GREEN}${"0A"}`,
          }}
        >
          <p style={eyebrowStyle}>Discipline check</p>
          <label
            style={{
              display: "flex",
              alignItems: "start",
              gap: "0.6rem",
              color: INK_SECONDARY,
              cursor: "pointer",
              marginTop: "0.55rem",
            }}
          >
            <input
              type="checkbox"
              checked={overclaim}
              onChange={(e) => setOverclaim(e.target.checked)}
            />
            <span>
              &quot;Rāhu in the 12th means this native will definitely emigrate.&quot;
            </span>
          </label>
          {overclaim ? (
            <p
              style={{
                margin: "0.65rem 0 0",
                color: VERMILION,
                lineHeight: 1.55,
              }}
            >
              <AlertTriangle size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
              This overclaims from a single indicator. Rāhu in the 12th is a strong candidate thread, not a verdict. Gather the 9th house, 3rd house, Rāhu analysis, and daśā timing before any confidence-tiered conclusion.
            </p>
          ) : (
            <p
              style={{
                margin: "0.65rem 0 0",
                color: GREEN,
                lineHeight: 1.55,
              }}
            >
              <CheckCircle2 size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
              Good — a single placement establishes a theme, not a conclusion.
            </p>
          )}
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
    </div>
  );
}

function ChartSvg({ occupant }: { occupant: string }) {
  const occColor =
    OCCUPANTS.find((o) => o.key === occupant)?.color ?? INK_MUTED;

  return (
    <svg
      viewBox="0 0 340 260"
      role="img"
      aria-label="Chart T1 12th house diagram"
      style={{
        width: "100%",
        maxHeight: 300,
        margin: "0.4rem auto 0.85rem",
        display: "block",
      }}
    >
      <rect
        x="10"
        y="10"
        width="320"
        height="240"
        rx="10"
        fill={`${PURPLE}${"05"}`}
        stroke={HAIRLINE}
      />

      {/* Lagna marker */}
      <circle cx="170" cy="130" r="58" fill={`${BLUE}${"12"}`} stroke={BLUE} strokeWidth="2" />
      <text x="170" y="120" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="600">
        Lagna
      </text>
      <text x="170" y="140" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="600">
        Cancer
      </text>

      {/* 12th house */}
      <g transform="translate(260 55)">
        <rect
          x="-44"
          y="-28"
          width="88"
          height="56"
          rx="8"
          fill={`${occColor}${"18"}`}
          stroke={occColor}
          strokeWidth="3"
        />
        <text x="0" y="-6" textAnchor="middle" fill={occColor} fontSize="12" fontWeight="600">
          12th house
        </text>
        <text x="0" y="14" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">
          Gemini
        </text>
      </g>

      {/* Occupant in 12th */}
      <g transform="translate(260 115)">
        <circle cx="0" cy="0" r="20" fill={occColor} />
        <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">
          {occupant === "none" ? "—" : occupant.slice(0, 2)}
        </text>
        <text x="0" y="34" textAnchor="middle" fill={occColor} fontSize="10" fontWeight="600">
          {occupant === "none" ? "empty" : "occupant"}
        </text>
      </g>

      {/* 9th house with Mercury/Jupiter */}
      <g transform="translate(75 200)">
        <rect
          x="-42"
          y="-24"
          width="84"
          height="48"
          rx="8"
          fill={`${GOLD}${"14"}`}
          stroke={GOLD}
          strokeWidth="2"
        />
        <text x="0" y="-4" textAnchor="middle" fill={GOLD} fontSize="11" fontWeight="600">
          9th house
        </text>
        <text x="0" y="14" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">
          Pisces
        </text>
      </g>

      <g transform="translate(75 155)">
        <circle cx="-14" cy="0" r="16" fill={GREEN} />
        <text x="-14" y="4" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">
          Me
        </text>
        <circle cx="18" cy="0" r="16" fill={GREEN} />
        <text x="18" y="4" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">
          Ju
        </text>
        <text x="0" y="32" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">
          lord + dispositor
        </text>
      </g>

      {/* Arrows */}
      <path
        d="M 210 70 Q 200 100, 215 120"
        fill="none"
        stroke={HAIRLINE}
        strokeWidth="2"
        strokeDasharray="4 2"
      />
      <path
        d="M 115 175 Q 140 150, 125 130"
        fill="none"
        stroke={GOLD}
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill={GOLD} />
        </marker>
      </defs>

      <text x="170" y="245" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">
        12th lord Mercury looks to the 9th; occupant colours the 12th
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

function MiniFact({
  icon,
  title,
  body,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${color}${"44"}`,
        borderRadius: 8,
        background: `${color}${"10"}`,
        padding: "0.7rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          color,
          fontWeight: 600,
        }}
      >
        {icon}
        {title}
      </div>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          fontSize: "0.86rem",
          lineHeight: 1.35,
        }}
      >
        {body}
      </p>
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

const workbenchTwoColumnStyle: CSSProperties = {
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
