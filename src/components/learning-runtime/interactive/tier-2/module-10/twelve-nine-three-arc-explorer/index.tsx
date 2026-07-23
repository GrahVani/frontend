"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  Compass,
  Layers,
  RefreshCcw,
  Shuffle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

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

const HOUSES = [
  {
    key: "twelfth",
    number: "12th",
    sign: "Gemini",
    lord: "Mercury",
    occupant: "Rāhu",
    color: PURPLE,
    question: "Foreign residence and dissolution of old context",
  },
  {
    key: "ninth",
    number: "9th",
    sign: "Pisces",
    lord: "Jupiter",
    occupant: "Mercury + Jupiter",
    color: BLUE,
    question: "Long-distance travel, dharma, and foreign-cultural assimilation",
  },
  {
    key: "third",
    number: "3rd",
    sign: "Virgo",
    lord: "Mercury",
    occupant: "none (empty)",
    color: GREEN,
    question: "Short journeys and sustaining effort",
  },
] as const;

const MALEFICS = ["Saturn", "Mars", "Rahu", "Ketu"];

const OCCUPANT_OPTIONS = [
  { key: "none", label: "None (empty)" },
  { key: "Saturn", label: "Saturn" },
  { key: "Mars", label: "Mars" },
  { key: "Rahu", label: "Rāhu" },
  { key: "Ketu", label: "Ketu" },
  { key: "Mercury", label: "Mercury" },
  { key: "Jupiter", label: "Jupiter" },
] as const;

const THREADS = [
  { key: "twelfth", label: "12th: release of old context", color: PURPLE },
  { key: "ninth", label: "9th: purpose and cultural encounter", color: BLUE },
  { key: "third", label: "3rd: effort and short journeys", color: GREEN },
] as const;

const DISCIPLINE_STATEMENTS = [
  {
    key: "empty",
    label: "An empty 3rd house means weak short-journey capacity.",
    correction:
      "An empty house is read through its lord. Chart T1's 3rd lord Mercury is redeemed through neecha-bhaṅga and conjunct Jupiter, so emptiness alone is not a verdict.",
  },
  {
    key: "upachaya",
    label: "The upachaya doctrine makes every 3rd house grow through friction.",
    correction:
      "The upachaya doctrine specifically requires a malefic OCCUPANT. An empty 3rd house does not trigger it.",
  },
  {
    key: "arc",
    label: "The 12-9-3 arc lets us read the three houses as one combined indicator.",
    correction:
      "The arc is an organizing convenience. Each house keeps its own distinct question and must be read on its own terms.",
  },
] as const;

export function TwelveNineThreeArcExplorer() {
  const [highlightLord, setHighlightLord] = useState<string | null>(null);
  const [thirdOccupant, setThirdOccupant] = useState<string>("none");
  const [activeThreads, setActiveThreads] = useState<Record<string, boolean>>({
    twelfth: true,
    ninth: true,
    third: true,
  });
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    empty: false,
    upachaya: false,
    arc: false,
  });

  const mercuryDual = useMemo(
    () => HOUSES.filter((h) => h.lord === "Mercury").map((h) => h.number),
    []
  );

  const upachayaApplies = MALEFICS.includes(thirdOccupant);

  const synthesis = useMemo(() => {
    const threadList = THREADS.filter((t) => activeThreads[t.key])
      .map((t) => t.label)
      .join("; ");
    const dual = `Mercury rules both the ${mercuryDual.join(" and the ")}, linking short-journey effort with foreign-residence dissolution.`;
    const upachaya = upachayaApplies
      ? `With ${thirdOccupant} in the 3rd, the upachaya doctrine is triggered: friction can build capacity here.`
      : "The 3rd house is empty of malefic occupants, so the upachaya doctrine does not apply.";
    return `${dual} ${upachaya} Active arc threads: ${threadList}.`;
  }, [activeThreads, mercuryDual, thirdOccupant, upachayaApplies]);

  function toggleThread(key: string) {
    setActiveThreads((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setHighlightLord(null);
    setThirdOccupant("none");
    setActiveThreads({ twelfth: true, ninth: true, third: true });
    setMistakes({ empty: false, upachaya: false, arc: false });
  }

  return (
    <div
      data-interactive="twelve-nine-three-arc-explorer"
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
            <p style={eyebrowStyle}>Chart T1 — 12-9-3 arc explorer</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: GOLD,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              The 3rd house, Mercury dual-lordship, and the connected travel arc
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Explore how Chart T1&apos;s 12th, 9th, and 3rd houses form one relocation story while keeping their own questions. Trace Mercury&apos;s dual lordship, test the upachaya doctrine, and build the arc thread by thread.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <p style={eyebrowStyle}>12-9-3 arc diagram</p>
          <ArcSvg activeThreads={activeThreads} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))",
              gap: "0.55rem",
              marginTop: "0.65rem",
            }}
          >
            {HOUSES.map((h) => (
              <MiniFact
                key={h.key}
                icon={<Compass size={16} />}
                title={`${h.number} house`}
                body={`${h.sign} · lord ${h.lord}`}
                color={h.color}
              />
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="House comparison" icon={<Layers size={18} />} color={GOLD}>
            <p
              style={{
                margin: "0 0 0.55rem",
                color: INK_SECONDARY,
                fontSize: "0.88rem",
                lineHeight: 1.5,
              }}
            >
              Click a lord name to highlight which houses share it. Mercury rules two of the three arc houses.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {HOUSES.map((h) => {
                const highlighted = highlightLord === h.lord;
                const isMercury = h.lord === "Mercury";
                return (
                  <div
                    key={h.key}
                    style={{
                      border: `1px solid ${highlighted ? h.color : HAIRLINE}`,
                      borderRadius: 8,
                      background: highlighted ? `${h.color}${"0F"}` : "transparent",
                      padding: "0.7rem",
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
                      <span style={{ color: h.color, fontWeight: 600 }}>
                        {h.number} house · {h.sign}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setHighlightLord(highlightLord === h.lord ? null : h.lord)
                        }
                        style={lordChipStyle(highlighted, h.color)}
                      >
                        lord: {h.lord}
                      </button>
                    </div>
                    <p
                      style={{
                        margin: "0.35rem 0 0",
                        color: INK_SECONDARY,
                        fontSize: "0.86rem",
                        lineHeight: 1.4,
                      }}
                    >
                      {h.question}
                    </p>
                    <p
                      style={{
                        margin: "0.25rem 0 0",
                        color: INK_MUTED,
                        fontSize: "0.82rem",
                      }}
                    >
                      Occupant: {h.occupant}
                    </p>
                    {isMercury && highlighted ? (
                      <p
                        style={{
                          margin: "0.4rem 0 0",
                          color: GOLD,
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        Mercury dual-lordship: 3rd and 12th
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Mercury's condition" icon={<Shuffle size={18} />} color={GREEN}>
            <p
              style={{
                margin: 0,
                color: INK_SECONDARY,
                lineHeight: 1.55,
                fontSize: "0.9rem",
              }}
            >
              Mercury rules the 3rd and 12th. It is debilitated in Pisces, but neecha-bhaṅga is verified, and it sits conjunct Jupiter in the 9th. The same redeemed condition feeds both the effort side and the letting-go side of relocation.
            </p>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Upachaya doctrine check</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.5,
            }}
          >
            The 3rd is an upachaya house, but the doctrine only triggers with a malefic occupant. Place a planet in the 3rd and see when the doctrine applies.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.45rem",
              marginTop: "0.65rem",
            }}
          >
            {OCCUPANT_OPTIONS.map((o) => (
              <button
                key={o.key}
                type="button"
                aria-pressed={thirdOccupant === o.key}
                onClick={() => setThirdOccupant(o.key)}
                style={smallChipStyle(
                  thirdOccupant === o.key,
                  o.key === "none" ? INK_MUTED : MALEFICS.includes(o.key) ? VERMILION : GREEN
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.65rem",
              borderRadius: 8,
              border: `1px solid ${
                upachayaApplies ? VERMILION : GREEN
              }${"44"}`,
              background: `${
                upachayaApplies ? VERMILION : GREEN
              }${"0A"}`,
            }}
          >
            <p
              style={{
                margin: 0,
                color: upachayaApplies ? VERMILION : GREEN,
                fontWeight: 600,
              }}
            >
              {upachayaApplies
                ? "Upachaya doctrine applies"
                : "Upachaya doctrine does not apply"}
            </p>
            <p
              style={{
                margin: "0.3rem 0 0",
                color: INK_SECONDARY,
                fontSize: "0.86rem",
              }}
            >
              {upachayaApplies
                ? `With ${thirdOccupant} in the 3rd, friction in the house can build capacity over time.`
                : thirdOccupant === "none"
                  ? "The 3rd is empty, so there is no occupant to trigger the doctrine."
                  : `${thirdOccupant} is not a malefic occupant; the doctrine's mechanism is not triggered.`}
            </p>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Build the arc story</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.5,
            }}
          >
            Toggle each thread to see how the three houses form one connected relocation arc.
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
          <p
            style={{
              margin: "0.65rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.55,
            }}
          >
            {Object.values(activeThreads).filter(Boolean).length === 3
              ? "All three threads are active: the full 12-9-3 relocation arc is visible."
              : "Activate all three threads to see the complete arc."}
          </p>
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

function ArcSvg({ activeThreads }: { activeThreads: Record<string, boolean> }) {
  return (
    <svg
      viewBox="0 0 520 240"
      role="img"
      aria-label="12-9-3 arc diagram"
      style={{
        width: "100%",
        maxHeight: 260,
        margin: "0.4rem auto 0.65rem",
        display: "block",
      }}
    >
      <rect x="10" y="10" width="500" height="220" rx="10" fill={`${GOLD}${"06"}`} stroke={HAIRLINE} />

      {/* 12th node */}
      <g transform="translate(90 120)">
        <circle cx="0" cy="0" r="46" fill={`${activeThreads.twelfth ? PURPLE : `${PURPLE}33`}`} opacity={activeThreads.twelfth ? 1 : 0.35} />
        <text x="0" y="-6" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">
          12th
        </text>
        <text x="0" y="14" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
          Gemini
        </text>
      </g>

      {/* 9th node */}
      <g transform="translate(260 80)">
        <circle cx="0" cy="0" r="46" fill={`${activeThreads.ninth ? BLUE : `${BLUE}33`}`} opacity={activeThreads.ninth ? 1 : 0.35} />
        <text x="0" y="-6" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">
          9th
        </text>
        <text x="0" y="14" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
          Pisces
        </text>
      </g>

      {/* 3rd node */}
      <g transform="translate(430 120)">
        <circle cx="0" cy="0" r="46" fill={`${activeThreads.third ? GREEN : `${GREEN}33`}`} opacity={activeThreads.third ? 1 : 0.35} />
        <text x="0" y="-6" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">
          3rd
        </text>
        <text x="0" y="14" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
          Virgo
        </text>
      </g>

      {/* Arc arrows */}
      <path
        d="M 135 95 Q 195 55, 215 65"
        fill="none"
        stroke={activeThreads.twelfth && activeThreads.ninth ? PURPLE : HAIRLINE}
        strokeWidth="3"
        strokeLinecap="round"
        markerEnd="url(#arrow-arc)"
      />
      <path
        d="M 305 65 Q 365 55, 385 95"
        fill="none"
        stroke={activeThreads.ninth && activeThreads.third ? GREEN : HAIRLINE}
        strokeWidth="3"
        strokeLinecap="round"
        markerEnd="url(#arrow-arc)"
      />

      {/* Mercury bridge 3rd-12th */}
      <path
        d="M 130 150 Q 260 200, 390 150"
        fill="none"
        stroke={GOLD}
        strokeWidth="3"
        strokeDasharray="5 3"
        strokeLinecap="round"
      />
      <text x="260" y="195" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="600">
        Mercury dual lordship
      </text>

      <defs>
        <marker id="arrow-arc" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill={INK_MUTED} />
        </marker>
      </defs>
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
        background: `${color}${"0A"}`,
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
          fontSize: "0.85rem",
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

function lordChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}22` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.25rem 0.5rem",
    fontSize: "0.8rem",
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
