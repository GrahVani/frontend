"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronRight,
  RefreshCcw,
  Scale,
  ShieldAlert,
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
const PURPLE = "#6B5AA8";

const SIXTH_SIGNIFICATORS = ["Saturn", "Rahu", "Jupiter"];

const SUB_LORDS: Record<
  string,
  {
    label: string;
    isSignificator: boolean;
    dignityInAquarius: "own" | "exalted" | "friendly" | "neutral" | "enemy" | "debilitated" | "node";
    note: string;
  }
> = {
  Ketu: {
    label: "Ketu",
    isSignificator: false,
    dignityInAquarius: "node",
    note: "Not a 6th-house significator in Chart L1’s chain; nodes carry no separate dignity claim.",
  },
  Saturn: {
    label: "Saturn",
    isSignificator: true,
    dignityInAquarius: "own",
    note: "6th lord/occupant and significator; also in own sign in Aquarius.",
  },
  Rahu: {
    label: "Rahu",
    isSignificator: true,
    dignityInAquarius: "node",
    note: "Appears in the 6th-house significator chain (Saturn > Rahu > Jupiter).",
  },
  Jupiter: {
    label: "Jupiter",
    isSignificator: true,
    dignityInAquarius: "enemy",
    note: "Appears in the 6th-house significator chain; dignity is not own/exalted here.",
  },
  Mars: {
    label: "Mars",
    isSignificator: false,
    dignityInAquarius: "neutral",
    note: "Not a 6th-house significator in Chart L1’s chain.",
  },
  Venus: {
    label: "Venus",
    isSignificator: false,
    dignityInAquarius: "friendly",
    note: "Not a 6th-house significator in Chart L1’s chain.",
  },
};

const DISCIPLINE_STATEMENTS = [
  {
    key: "override",
    label: "The KP 6th-cusp NO disproves the classical 6th-house strength.",
    correction:
      "The two frameworks are independent mechanisms. Report both; do not force one to override the other.",
  },
  {
    key: "precision-priority",
    label: "KP’s exact-degree precision means its verdict should automatically take priority.",
    correction:
      "Internal precision is not the same as cross-system priority. Each system is reported on its own terms.",
  },
  {
    key: "scope",
    label: "This lesson’s significator check should include the adversarial 7th house.",
    correction:
      "This lesson scopes to the 6th cusp alone; the 7th house is introduced separately in Lesson 11.3.2.",
  },
] as const;

export function KpLitigationCuspTool() {
  const [subLord, setSubLord] = useState<string>("Ketu");
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    override: false,
    "precision-priority": false,
    scope: false,
  });

  const data = SUB_LORDS[subLord];

  const verdict = useMemo<"YES" | "NO" | "CONDITIONAL">(() => {
    if (data.isSignificator || data.dignityInAquarius === "own" || data.dignityInAquarius === "exalted") {
      return "YES";
    }
    if (data.dignityInAquarius === "debilitated") {
      return "NO";
    }
    return "NO";
  }, [data]);

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setSubLord("Ketu");
    setMistakes({ override: false, "precision-priority": false, scope: false });
  }

  return (
    <div
      data-interactive="kp-litigation-cusp-tool"
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
            <p style={eyebrowStyle}>Chart L1 — KP 6th cusp</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: BLUE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Cuspal sub-lord disposition check
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Load Chart L1&apos;s 6th cusp, step through the disposition rules, and substitute a different sub-lord to see how the KP verdict shifts.
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_MUTED }}>
            <Calculator size={18} aria-hidden="true" />
            <p style={eyebrowStyle}>Cusp data</p>
          </div>
          <div
            style={{
              display: "grid",
              gap: "0.55rem",
              marginTop: "0.55rem",
            }}
          >
            <DataRow label="House" value="6th" />
            <DataRow label="Cusp degree" value="Aquarius 14°46&apos;26&quot;" />
            <DataRow label="Nakṣatra" value="Śatabhiṣā (lord Saturn)" />
            <DataRow label="Sign lord" value="Saturn" />
            <DataRow label="Star lord" value="Saturn" />
            <DataRow label="Sub-lord" value={subLord} highlight={subLord === "Ketu" ? VERMILION : INK_PRIMARY} />
          </div>

          <div style={{ marginTop: "0.85rem" }}>
            <p style={{ ...eyebrowStyle, marginBottom: "0.55rem" }}>Substitute sub-lord</p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {Object.keys(SUB_LORDS).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={subLord === key}
                  onClick={() => setSubLord(key)}
                  style={smallChipStyle(subLord === key, SUB_LORDS[key].isSignificator ? GREEN : VERMILION)}
                >
                  {SUB_LORDS[key].label}
                </button>
              ))}
            </div>
            <p
              style={{
                margin: "0.55rem 0 0",
                color: INK_MUTED,
                fontSize: "0.82rem",
                lineHeight: 1.5,
              }}
            >
              Try substituting Saturn or another significator to watch the verdict change.
            </p>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Disposition rules</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.55,
            }}
          >
            Significator status is the decisive gate. Other YES rules are set aside where not applicable.
          </p>

          <div
            style={{
              display: "grid",
              gap: "0.55rem",
              marginTop: "0.65rem",
            }}
          >
            <RuleRow
              label="Sub-lord is a 6th-house significator"
              value={data.isSignificator ? "YES" : "NO"}
              applies={data.isSignificator}
              detail={
                data.isSignificator
                  ? `${subLord} is in the computed significator set: ${SIXTH_SIGNIFICATORS.join(", ")}.`
                  : `${subLord} is not in the set ${SIXTH_SIGNIFICATORS.join(", ")}.`
              }
            />
            <RuleRow
              label="Sub-lord holds own / exalted dignity"
              value={data.dignityInAquarius === "own" || data.dignityInAquarius === "exalted" ? "YES" : "NO"}
              applies={data.dignityInAquarius === "own" || data.dignityInAquarius === "exalted"}
              detail={`In Aquarius, ${subLord} is ${data.dignityInAquarius}.`}
            />
            <RuleRow
              label="Ruling Planet at judgment"
              value="Not applicable"
              applies={false}
              detail="Ruling Planets is a horary-moment technique, not used natally here."
            />
            <RuleRow
              label="Aspects the relevant cusps"
              value="Not computed"
              applies={false}
              detail="A full KP-graded cuspal-aspect check was not computed for this lesson."
            />
          </div>

          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${verdict === "YES" ? GREEN : VERMILION}`,
              background: `${verdict === "YES" ? GREEN : VERMILION}${"0A"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: verdict === "YES" ? GREEN : VERMILION }}>
              <Scale size={18} aria-hidden="true" />
              <span style={{ fontWeight: 600, fontSize: "1.05rem" }}>KP verdict: {verdict}</span>
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              {data.note}
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Classical vs. KP: hold both honestly</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.55rem",
          }}
        >
          <div
            style={{
              border: `1px solid ${GREEN}`,
              borderRadius: 8,
              background: `${GREEN}${"08"}`,
              padding: "0.85rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: GREEN, fontWeight: 600 }}>
              <CheckCircle2 size={16} aria-hidden="true" />
              Classical whole-sign reading
            </div>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              The 6th house is strong: Saturn rules it, occupies it, and is in its own sign (Aquarius). Clean, self-contained governance of the litigation domain.
            </p>
          </div>

          <div
            style={{
              border: `1px solid ${subLord === "Ketu" ? VERMILION : GREEN}`,
              borderRadius: 8,
              background: `${subLord === "Ketu" ? VERMILION : GREEN}${"08"}`,
              padding: "0.85rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: subLord === "Ketu" ? VERMILION : GREEN, fontWeight: 600 }}>
              {subLord === "Ketu" ? <XCircle size={16} aria-hidden="true" /> : <CheckCircle2 size={16} aria-hidden="true" />}
              KP cuspal reading
            </div>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              {subLord === "Ketu"
                ? "The 6th cusp’s sub-lord is Ketu, which is not a significator of the 6th house. Clean NO on the significator gate."
                : `With ${subLord} as sub-lord, the cusp passes the significator/dignity gate and reads YES.`}
            </p>
          </div>
        </div>
        <p
          style={{
            margin: "0.75rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.6,
          }}
        >
          These are two internally-consistent mechanisms reaching different verdicts. Neither is asked to override the other. A practitioner fluent in both reports both precisely.
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
                    <ShieldAlert size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                    {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${PURPLE}66`,
          background: `${PURPLE}${"0A"}`,
        }}
      >
        <p style={eyebrowStyle}>Live synthesis</p>
        <h3
          style={{
            margin: "0.15rem 0 0",
            color: PURPLE,
            fontSize: "1.15rem",
            fontWeight: 600,
          }}
        >
          <ArrowRight size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
          {subLord === "Ketu" ? "Chart L1: a genuine divergence" : `Substituted ${subLord}: verdict shifts`}
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {subLord === "Ketu"
            ? "With Ketu as the 6th-cuspal sub-lord, the KP disposition check returns NO on the significator gate. This stands honestly alongside Chapter 1’s strong classical 6th-house reading — two valid mechanisms producing different verdicts."
            : `With ${subLord} as sub-lord, the cusp passes the significator/dignity gate and the KP reading moves to ${verdict}. This demonstrates why the sub-lord is the decisive KP gate.`}
        </p>
      </section>
    </div>
  );
}

function DataRow({
  label,
  value,
  highlight = INK_PRIMARY,
}: {
  label: string;
  value: string;
  highlight?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "0.4rem 0",
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <span style={{ color: INK_MUTED, fontSize: "0.86rem" }}>{label}</span>
      <span style={{ color: highlight, fontWeight: 600, fontSize: "0.86rem" }}>{value}</span>
    </div>
  );
}

function RuleRow({
  label,
  value,
  applies,
  detail,
}: {
  label: string;
  value: string;
  applies: boolean;
  detail: string;
}) {
  const color = value === "Not applicable" || value === "Not computed" ? INK_MUTED : applies ? GREEN : VERMILION;
  return (
    <div
      style={{
        border: `1px solid ${color}`,
        borderRadius: 8,
        background: value === "Not applicable" || value === "Not computed" ? "transparent" : `${color}${"08"}`,
        padding: "0.65rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
        <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>{label}</span>
        <span style={{ color, fontWeight: 600, fontSize: "0.88rem" }}>{value}</span>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.45 }}>
        <ChevronRight size={12} style={{ verticalAlign: "middle" }} aria-hidden="true" /> {detail}
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
    padding: "0.45rem 0.65rem",
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
