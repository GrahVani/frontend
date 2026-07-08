"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  ArrowRightLeft,
  BookOpen,
  CheckCircle2,
  Map,
  RefreshCcw,
  Sparkles,
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

const NINTH_SIGN = "Pisces";
const NINTH_LORD = "Jupiter";
const EIGHTH_SIGN = "Aquarius";
const TWELFTH_SIGN = "Gemini";
const LAGNA = "Cancer";

const PLANET_SHORT = {
  jupiter: "Ju",
  mercury: "Me",
  rahu: "Ra",
};

const ALIGNMENT_FORMS = [
  {
    key: "lord",
    label: "Jupiter is lord of the 9th",
    note: "Sign-based and unaffected by house-system choice.",
  },
  {
    key: "occupant",
    label: "Jupiter occupies the 9th whole-sign",
    note: "Whole-sign places Jupiter in Pisces/9th.",
  },
  {
    key: "aspect",
    label: "Jupiter aspects the 9th from elsewhere",
    note: "Not present here — Jupiter is inside the sign.",
  },
] as const;

const NINTH_THREADS = [
  "Long-distance travel",
  "Pilgrimage",
  "Higher study",
  "Foreign-cultural assimilation",
  "Dharma / fortune",
];

const TWELFTH_THREADS = [
  "Foreign residence",
  "Expenditure / loss",
  "Dissolution of old context",
  "Isolation / unfamiliar environment",
];

const SCENARIOS = [
  {
    key: "study",
    label: "Will I study abroad or go on pilgrimage?",
    answer: "9th",
    explanation:
      "This is the 9th's register: long-distance travel for dharma, learning, or cultural immersion.",
  },
  {
    key: "settle",
    label: "Will I settle permanently abroad?",
    answer: "12th",
    explanation:
      "This is the 12th's register: foreign residence and dissolution of the old home context.",
  },
];

export function NinthHouseChartT1Explorer() {
  const [system, setSystem] = useState<"whole-sign" | "placidus">("whole-sign");
  const [alignment, setAlignment] = useState<Record<string, boolean>>({
    lord: true,
    occupant: true,
    aspect: false,
  });
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [overclaim, setOverclaim] = useState(false);

  const activeAlignmentCount = Object.values(alignment).filter(Boolean).length;

  const synthesis = useMemo(() => {
    const systemText =
      system === "whole-sign"
        ? "In whole-sign, Pisces/9th holds both Mercury and Jupiter."
        : "In Placidus-cuspal, Jupiter moves to the 8th cusp (Aquarius), leaving Mercury as the sole cuspal 9th occupant.";
    const forms = ALIGNMENT_FORMS.filter((f) => alignment[f.key])
      .map((f) => f.label)
      .join("; ");
    const alignmentText =
      activeAlignmentCount === 0
        ? "No 9th-Jupiter alignment form is currently selected."
        : `Active 9th-Jupiter alignment forms: ${forms}.`;
    const scenario =
      activeScenario === null
        ? "Use the scenario selector to route a travel question to the correct house."
        : "";
    return `Chart T1: Cancer Lagna, ${NINTH_SIGN} in the 9th. ${systemText} ${alignmentText} ${scenario}`;
  }, [system, alignment, activeAlignmentCount, activeScenario]);

  function toggleAlignment(key: string) {
    setAlignment((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setSystem("whole-sign");
    setAlignment({ lord: true, occupant: true, aspect: false });
    setActiveScenario(null);
    setOverclaim(false);
  }

  return (
    <div
      data-interactive="ninth-house-chart-t1-explorer"
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
            <p style={eyebrowStyle}>Chart T1 — 9th house explorer</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: BLUE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Long-distance travel, dharma, and the 9th-Jupiter alignment
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Explore Chart T1&apos;s 9th house (Pisces, lord Jupiter). Toggle whole-sign vs Placidus-cuspal occupancy, test the three forms of the 9th-Jupiter alignment, and route travel questions to the 9th or 12th.
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
              <p style={eyebrowStyle}>Chart diagram</p>
              <h3
                style={{
                  margin: "0.15rem 0 0",
                  color: BLUE,
                  fontSize: "1.12rem",
                  fontWeight: 600,
                }}
              >
                {system === "whole-sign" ? "Whole-sign view" : "Placidus-cuspal view"}
              </h3>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                aria-pressed={system === "whole-sign"}
                onClick={() => setSystem("whole-sign")}
                style={smallChipStyle(system === "whole-sign", BLUE)}
              >
                Whole-sign
              </button>
              <button
                type="button"
                aria-pressed={system === "placidus"}
                onClick={() => setSystem("placidus")}
                style={smallChipStyle(system === "placidus", PURPLE)}
              >
                Placidus-cuspal
              </button>
            </div>
          </div>
          <ChartSvg system={system} />
          <p
            style={{
              margin: "0.5rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.5,
            }}
          >
            {system === "whole-sign"
              ? "Both Mercury and Jupiter count as 9th occupants. Jupiter is also the 9th lord."
              : "Cuspal analysis moves Jupiter to the 8th cusp; only Mercury remains cuspal in the 9th. Lordship and whole-sign occupancy still stand."}
          </p>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="9th-Jupiter alignment" icon={<Sparkles size={18} />} color={BLUE}>
            <p
              style={{
                margin: "0 0 0.55rem",
                color: INK_SECONDARY,
                fontSize: "0.88rem",
                lineHeight: 1.5,
              }}
            >
              The doctrine has three forms. Chart T1 shows two of them by default.
            </p>
            {ALIGNMENT_FORMS.map((form) => (
              <label
                key={form.key}
                style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "0.55rem",
                  color: INK_SECONDARY,
                  cursor: "pointer",
                  marginTop: "0.5rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={alignment[form.key]}
                  onChange={() => toggleAlignment(form.key)}
                />
                <span>
                  <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{form.label}</span>
                  <span style={{ display: "block", fontSize: "0.82rem" }}>{form.note}</span>
                </span>
              </label>
            ))}
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.65rem",
                borderRadius: 8,
                border: `1px solid ${
                  activeAlignmentCount >= 2 ? GREEN : activeAlignmentCount === 1 ? GOLD : VERMILION
                }${"44"}`,
                background: `${
                  activeAlignmentCount >= 2 ? GREEN : activeAlignmentCount === 1 ? GOLD : VERMILION
                }${"0A"}`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color:
                    activeAlignmentCount >= 2
                      ? GREEN
                      : activeAlignmentCount === 1
                        ? GOLD
                        : VERMILION,
                  fontWeight: 600,
                }}
              >
                {activeAlignmentCount} / {ALIGNMENT_FORMS.length} forms active
              </p>
              <p
                style={{
                  margin: "0.3rem 0 0",
                  color: INK_SECONDARY,
                  fontSize: "0.86rem",
                }}
              >
                {activeAlignmentCount >= 2
                  ? "Strong 9th-Jupiter alignment: a well-supported dharma/travel register."
                  : activeAlignmentCount === 1
                    ? "One alignment form present; still favourable but less emphatic."
                    : "No alignment form selected; the register is not currently supported by Jupiter."}
              </p>
            </div>
          </Panel>

          <Panel title="House-system disclosure" icon={<ArrowRightLeft size={18} />} color={PURPLE}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button
                type="button"
                aria-pressed={system === "whole-sign"}
                onClick={() => setSystem("whole-sign")}
                style={smallChipStyle(system === "whole-sign", BLUE)}
              >
                Whole-sign
              </button>
              <button
                type="button"
                aria-pressed={system === "placidus"}
                onClick={() => setSystem("placidus")}
                style={smallChipStyle(system === "placidus", PURPLE)}
              >
                Placidus-cuspal
              </button>
            </div>
            <p
              style={{
                margin: "0.55rem 0 0",
                color: INK_SECONDARY,
                fontSize: "0.88rem",
                lineHeight: 1.5,
              }}
            >
              Jupiter&apos;s lordship of Pisces and its whole-sign occupancy are sign-based facts. Its cuspal house (8th) is a separate, disclosed fact for Chapter 3 KP work.
            </p>
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>9th vs 12th — different questions</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: "0.75rem",
              marginTop: "0.65rem",
            }}
          >
            <HouseCompareCard
              icon={<BookOpen size={18} />}
              title="9th house"
              color={BLUE}
              sign={NINTH_SIGN}
              threads={NINTH_THREADS}
            />
            <HouseCompareCard
              icon={<Map size={18} />}
              title="12th house"
              color={PURPLE}
              sign={TWELFTH_SIGN}
              threads={TWELFTH_THREADS}
            />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Route the question</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.5,
            }}
          >
            Click a scenario to see which house answers it.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginTop: "0.65rem" }}>
            {SCENARIOS.map((s) => {
              const active = activeScenario === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveScenario(active ? null : s.key)}
                  style={{
                    textAlign: "left",
                    border: `1px solid ${active ? (s.answer === "9th" ? BLUE : PURPLE) : HAIRLINE}`,
                    borderRadius: 8,
                    background: active
                      ? `${s.answer === "9th" ? BLUE : PURPLE}${"12"}`
                      : "transparent",
                    color: active ? INK_PRIMARY : INK_SECONDARY,
                    padding: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{s.label}</span>
                  {active ? (
                    <span
                      style={{
                        display: "block",
                        marginTop: "0.4rem",
                        color: s.answer === "9th" ? BLUE : PURPLE,
                        fontWeight: 600,
                      }}
                    >
                      Primary house: {s.answer} — {s.explanation}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
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
              &quot;A strong 9th house with Jupiter in its own sign guarantees foreign settlement.&quot;
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
              This conflates houses. The 9th supports travel, study, and assimilation; the 12th governs residence and dissolution. A strong 9th is not a settlement verdict.
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
              Good — each house must be read on its own terms.
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

function ChartSvg({ system }: { system: "whole-sign" | "placidus" }) {
  const jupiterInNinth = system === "whole-sign";

  return (
    <svg
      viewBox="0 0 420 300"
      role="img"
      aria-label={`Chart T1 9th house diagram, ${system} view`}
      style={{
        width: "100%",
        maxHeight: 320,
        margin: "0.65rem auto 0.65rem",
        display: "block",
      }}
    >
      {/* Background field */}
      <rect x="10" y="10" width="400" height="280" rx="10" fill={`${BLUE}${"06"}`} stroke={HAIRLINE} />

      {/* Lagna */}
      <g transform="translate(210 150)">
        <circle cx="0" cy="0" r="48" fill={`${GOLD}${"18"}`} stroke={GOLD} strokeWidth="2" />
        <text x="0" y="-8" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="600">
          Lagna
        </text>
        <text x="0" y="12" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="600">
          {LAGNA}
        </text>
      </g>

      {/* 12th house */}
      <g transform="translate(340 70)">
        <rect x="-54" y="-34" width="108" height="68" rx="8" fill={`${PURPLE}${"14"}`} stroke={PURPLE} strokeWidth="2" />
        <text x="0" y="-10" textAnchor="middle" fill={PURPLE} fontSize="12" fontWeight="600">
          12th house
        </text>
        <text x="0" y="10" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">
          {TWELFTH_SIGN}
        </text>
        <text x="0" y="26" textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="600">
          Rāhu ({PLANET_SHORT.rahu})
        </text>
      </g>

      {/* 9th house */}
      <g transform="translate(95 75)">
        <rect x="-58" y="-38" width="116" height="76" rx="8" fill={`${BLUE}${"18"}`} stroke={BLUE} strokeWidth={3} />
        <text x="0" y="-14" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="600">
          9th house
        </text>
        <text x="0" y="6" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="600">
          {NINTH_SIGN}
        </text>
        <text x="0" y="24" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">
          Mercury + {jupiterInNinth ? NINTH_LORD : "..."}
        </text>
      </g>

      {/* Mercury always in 9th */}
      <g transform="translate(60 135)">
        <circle cx="0" cy="0" r="18" fill={GREEN} />
        <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
          Me
        </text>
      </g>

      {/* Jupiter either in 9th or 8th cusp */}
      {jupiterInNinth ? (
        <g transform="translate(130 135)">
          <circle cx="0" cy="0" r="18" fill={BLUE} />
          <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
            Ju
          </text>
        </g>
      ) : (
        <g transform="translate(95 240)">
          <rect x="-58" y="-30" width="116" height="60" rx="8" fill={`${PURPLE}${"12"}`} stroke={PURPLE} strokeWidth="2" strokeDasharray="4 2" />
          <text x="0" y="-8" textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight="600">
            8th cusp
          </text>
          <text x="0" y="10" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">
            {EIGHTH_SIGN}
          </text>
          <circle cx="42" cy="0" r="16" fill={BLUE} />
          <text x="42" y="5" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">
            Ju
          </text>
        </g>
      )}

      {/* Connection lines */}
      <path d="M 155 105 Q 180 80, 250 110" fill="none" stroke={GOLD} strokeWidth="2" markerEnd="url(#arrow-gold)" />
      <path d="M 285 110 Q 310 90, 330 75" fill="none" stroke={PURPLE} strokeWidth="2" strokeDasharray="4 2" />
      {!jupiterInNinth ? (
        <path d="M 210 180 Q 160 210, 120 220" fill="none" stroke={PURPLE} strokeWidth="2" strokeDasharray="4 2" />
      ) : null}

      <defs>
        <marker id="arrow-gold" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill={GOLD} />
        </marker>
      </defs>

      <text x="210" y="285" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">
        {jupiterInNinth
          ? "Jupiter lord + occupant of the 9th whole-sign"
          : "Jupiter lord of 9th, but cuspal occupant of 8th"}
      </text>
    </svg>
  );
}

function HouseCompareCard({
  icon,
  title,
  color,
  sign,
  threads,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  sign: string;
  threads: string[];
}) {
  return (
    <div
      style={{
        border: `1px solid ${color}${"44"}`,
        borderRadius: 8,
        background: `${color}${"0A"}`,
        padding: "0.85rem",
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
          margin: "0.35rem 0 0.55rem",
          color: INK_SECONDARY,
          fontSize: "0.86rem",
        }}
      >
        Chart T1 sign: <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{sign}</span>
      </p>
      <ul
        style={{
          margin: 0,
          paddingLeft: "1.1rem",
          color: INK_SECONDARY,
          fontSize: "0.85rem",
          lineHeight: 1.45,
        }}
      >
        {threads.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
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
