"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Flame,
  RefreshCcw,
  XCircle,
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

type PatternStatus = "fire" | "fail" | "tension";

const STATUS_LABELS: Record<
  PatternStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  fire: {
    label: "Fires on Chart T1",
    color: GREEN,
    icon: <Flame size={16} />,
  },
  fail: {
    label: "Does not apply",
    color: VERMILION,
    icon: <XCircle size={16} />,
  },
  tension: {
    label: "Genuine tension",
    color: GOLD,
    icon: <AlertTriangle size={16} />,
  },
};

const PATTERNS: {
  id: number;
  text: string;
  status: PatternStatus;
  reason: string;
}[] = [
  {
    id: 1,
    text: "12th lord placed in a kendra from Lagna",
    status: "fail",
    reason: "Mercury (12th lord) sits in the 9th house — a trikoṇa, not a kendra.",
  },
  {
    id: 2,
    text: "12th lord specifically in the 4th house ('home abroad')",
    status: "fail",
    reason: "Mercury occupies the 9th, not the 4th.",
  },
  {
    id: 3,
    text: "12th lord in the 9th house",
    status: "fire",
    reason: "Chart T1's 12th lord Mercury is directly in the 9th house.",
  },
  {
    id: 4,
    text: "9th lord in the 12th house",
    status: "fail",
    reason: "Jupiter (9th lord) occupies its own 9th house, not the 12th.",
  },
  {
    id: 5,
    text: "Rāhu placed in the 9th, 10th, or 12th house",
    status: "fire",
    reason: "Rāhu occupies the 12th house directly.",
  },
  {
    id: 6,
    text: "4th lord and 12th lord connected by conjunction, mutual aspect, or sign-exchange",
    status: "fail",
    reason: "Venus (4th lord) and Mercury (12th lord) share no conjunction, mutual aspect, or sign-exchange.",
  },
  {
    id: 7,
    text: "4th house or its lord weak or afflicted",
    status: "tension",
    reason: "Venus is own-sign in the 4th — strong, not weak. Some popular sources call this an absolute block; this curriculum rejects that absolutism.",
  },
];

const DISCIPLINE_STATEMENTS = [
  {
    key: "verdict",
    label: "Two of seven patterns firing means foreign settlement is confirmed.",
    correction:
      "This is a structural pattern-match, not a confidence-tiered verdict. Final synthesis belongs to Chapter 4.",
  },
  {
    key: "absolute",
    label: "A strong 4th house makes foreign settlement impossible.",
    correction:
      "No single indicator — favourable or unfavourable — is an absolute verdict. The strong 4th is a real texture to weigh.",
  },
  {
    key: "ignore",
    label: "A counter-indicator should be ignored if it complicates a favourable picture.",
    correction:
      "Report genuine tension honestly. Ignoring a real finding is as misleading as overstating it.",
  },
] as const;

export function NriYogaPatternSpotter() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [fourthFrame, setFourthFrame] = useState<"texture" | "veto">("texture");
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    verdict: false,
    absolute: false,
    ignore: false,
  });

  const counts = useMemo(() => {
    const fire = PATTERNS.filter((p) => p.status === "fire").length;
    const fail = PATTERNS.filter((p) => p.status === "fail").length;
    const tension = PATTERNS.filter((p) => p.status === "tension").length;
    return { fire, fail, tension };
  }, []);

  function toggleExpanded(id: number) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setExpanded({});
    setFourthFrame("texture");
    setMistakes({ verdict: false, absolute: false, ignore: false });
  }

  return (
    <div
      data-interactive="nri-yoga-pattern-spotter"
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
            <p style={eyebrowStyle}>Chart T1 — NRI-yoga pattern spotter</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: BLUE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Testing the seven major modern-compilation patterns
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Click each pattern to see whether it fires, fails, or creates tension on Chart T1. Keep the citation layer and anti-absolutism discipline in view.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Pattern checklist</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0.65rem",
            marginTop: "0.55rem",
          }}
        >
          {PATTERNS.map((p) => {
            const status = STATUS_LABELS[p.status];
            const open = expanded[p.id];
            return (
              <button
                key={p.id}
                type="button"
                aria-expanded={open}
                onClick={() => toggleExpanded(p.id)}
                style={{
                  textAlign: "left",
                  border: `1px solid ${status.color}`,
                  borderRadius: 8,
                  background: `${status.color}${"10"}`,
                  padding: "0.75rem",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    alignItems: "start",
                  }}
                >
                  <span style={{ color: INK_PRIMARY, fontWeight: 600, lineHeight: 1.4 }}>
                    {p.id}. {p.text}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      color: status.color,
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </div>
                {open ? (
                  <p
                    style={{
                      margin: "0.55rem 0 0",
                      color: INK_SECONDARY,
                      fontSize: "0.86rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {p.reason}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.55rem",
            marginTop: "0.75rem",
          }}
        >
          <MiniStat label="Fire" value={counts.fire} color={GREEN} />
          <MiniStat label="Fail" value={counts.fail} color={VERMILION} />
          <MiniStat label="Tension" value={counts.tension} color={GOLD} />
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section
          style={{
            ...cardStyle,
            borderColor: `${GOLD}${"66"}`,
            background: `${GOLD}${"08"}`,
          }}
        >
          <p style={eyebrowStyle}>The strong 4th-house tension</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            Chart T1&apos;s 4th lord Venus is own-sign in the 4th — a strong home-base condition. Some popular sources treat this as an absolute block on foreign settlement. Choose how this curriculum reads it.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.65rem",
            }}
          >
            <button
              type="button"
              aria-pressed={fourthFrame === "texture"}
              onClick={() => setFourthFrame("texture")}
              style={buttonStyle(fourthFrame === "texture", GREEN)}
            >
              <CheckCircle2 size={15} aria-hidden="true" />
              Real texture to weigh
            </button>
            <button
              type="button"
              aria-pressed={fourthFrame === "veto"}
              onClick={() => setFourthFrame("veto")}
              style={buttonStyle(fourthFrame === "veto", VERMILION)}
            >
              <AlertTriangle size={15} aria-hidden="true" />
              Absolute veto
            </button>
          </div>
          {fourthFrame === "veto" ? (
            <p
              style={{
                margin: "0.65rem 0 0",
                color: VERMILION,
                lineHeight: 1.55,
              }}
            >
              This curriculum rejects the absolute-veto framing. A single indicator, in either direction, cannot overrule the full pattern-match and structural findings.
            </p>
          ) : (
            <p
              style={{
                margin: "0.65rem 0 0",
                color: GREEN,
                lineHeight: 1.55,
              }}
            >
              Good — the strong 4th is a genuine counter-note, carried forward as texture, not as a trump card.
            </p>
          )}
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Citation reminder</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            These seven patterns are widely-taught modern-systematised combinations, not primary classical verses. Cite the underlying house/kāraka reasoning classically; cite the numbered pattern list as modern compilation literature.
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
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.4rem 0.65rem",
        borderRadius: 8,
        background: `${color}${"14"}`,
        color,
        fontSize: "0.85rem",
        fontWeight: 600,
      }}
    >
      <span>{label}</span>
      <span
        style={{
          minWidth: 20,
          height: 20,
          borderRadius: "50%",
          background: color,
          color: "#fff",
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
